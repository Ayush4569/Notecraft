import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../schemas/index";
import bcrypt from "bcrypt"
import { sendVerificationEmail } from "../helpers/email-verification";
import { prisma } from "../db/db";
import { decodeRefreshToken, generateAccessToken, generateRefreshToken } from "../helpers/generateToken";
import { accessTokenOptions, refreshTokenOptions } from "../helpers/cookie-options";
import { hashPassword, updateUserPassword } from "../helpers/user.service";
import { RedisClient } from "../helpers/redis";
import { nanoid } from "nanoid";
const getUser = async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    };
    try {
        const cachedUser = await RedisClient.get(`user:${req.user.id}`);
        
        if(cachedUser) {
            const userObject = JSON.parse(cachedUser)
            res
            .status(200)
            .json({
                success: true,
                user: {
                    ...userObject,
                    subscriptionStatus: userObject.subscription?.status ?? null
                },
                message: "User fetched successfully",
            });
            return;
        }
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id as string
            },
            select: {
                id: true,
                username: true,
                email: true,
                profileImage: true,
                subscription: {
                    select: {
                        status: true,
                    }
                },
                isPro: true
            }
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        await RedisClient.setex(`user:${req.user.id}`,1800,JSON.stringify(user))
        res
        .status(200)
        .json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage ?? "",
                isPro: user.isPro,
                subscriptionStatus: user.subscription?.status ?? null
            },
            message: "User fetched successfully",
        });
        return;
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal Server Error" });
        return

    }
}
const createUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body
    try {
        const result = registerSchema.safeParse({ username, email, password });
        if (!result.success) {
            const signupErrors = result.error.format()._errors || []
            res.status(500).json({
                success: false,
                message:
                    signupErrors?.length > 0
                        ? signupErrors.join(', ')
                        : 'Invalid fields',
            });
            return
        }
        const existingVerifiedUserByUsername = await prisma.user.findFirst({
            where: {
                username,
                isVerified: true,
            }
        })
        if (existingVerifiedUserByUsername) {
            res.status(400).json({
                success: false,
                message: "username is already taken "
            });
            return
        }
        const existingUserByEmail = await prisma.user.findFirst({
            where: {
                email
            }
        });
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                res.status(500).json({
                    success: false,
                    message: "Email already taken"
                });
                return
            }
            const hashedPassword = await hashPassword(password)
            await prisma.user.update({
                where: {
                    email
                },
                data: {
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry: new Date(Date.now() + 3600000)
                }
            })
        } else {
            const hashedPassword = await hashPassword(password)
            await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry: new Date(Date.now() + 3600000)
                }
            })
        }
        const emailResponse = await sendVerificationEmail(email, username, verifyCode, 'register');
        if (!emailResponse.success) {
            res.status(500).json(
                {
                    success: false,
                    message: emailResponse.message,
                }
            );
            return
        }
        res.status(201).json(
            {
                success: true,
                message: 'User registered successfully. Please verify your account.',
            }
        );
        return
    } catch (error) {
        console.error("Error registering user", error);
        res.status(500).json({
            success: false,
            message: "Error registering user"
        });
        return

    }
}
const loginUser = async (req: Request, res: Response) => {
    const { identifier, password } = req.body;
    const result = loginSchema.safeParse({ identifier, password });
    if (!result.success) {
        const loginErrors = result.error.format()._errors || [];
        res.status(500).json({
            success: false,
            message:
                loginErrors?.length > 0
                    ? loginErrors.join(', ')
                    : 'Invalid fields',
        });
        return;
    }
    if (!identifier || !password) {
        res.status(400).json({ success: false, message: "Identifier and password are required" });
        return;
    }
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier },
                ]
            },
            include: {
                subscription: {
                    select: {
                        status: true,
                    }
                }
            }
        })
        if (!user) {
            res.status(401).json({ success: false, message: "Invalid credentials" });
            return;
        }
        if (!user.isVerified) {
            res.status(401).json({ success: false, message: "Invalid credentials" });
            return;
        }
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );
        if (!isPasswordCorrect) {
            res.status(401).json({ success: false, message: "Invalid password" });
            return;
        }
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)
        await prisma.user.update({
            where: { id: user.id },
            data: {
                refreshToken
            }
        })
        res
            .status(200)
            .cookie("accessToken", accessToken, accessTokenOptions)
            .cookie("refreshToken", refreshToken, refreshTokenOptions)
            .json({
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    profileImage: user.profileImage ?? "",
                    isPro: user.isPro,
                    subscriptionStatus: user.subscription?.status ?? null
                },
                message: "Login successful",
            })
        return;
    } catch (error) {
        console.log('Error login', error);
        res.status(500).json({
            success: false,
            message: 'Error user login'
        });
        return;
    }
}
const logoutUser = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        await prisma.user.update({
            where: { id: user.id },
            data: {
                refreshToken: null,
            }
        });
        await RedisClient.del(`user:${user.id}`)
        res
            .status(200)
            .clearCookie("accessToken", accessTokenOptions)
            .clearCookie("refreshToken", refreshTokenOptions)
            .json({
                success: true,
                message: "Logout successful",
            });
        return;
    } catch (error) {
        console.error("Error logging out:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
        return;
    }
}
const refreshAccessToken = async (req: Request, res: Response) => {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
        res.status(401).json({
            success: false,
            message: "Unauthorized pls login to generate refreshToken"
        })
        return;
    }
    const decodedUser = decodeRefreshToken(incomingRefreshToken);
    if (!decodedUser) {
        res.status(401).clearCookie("refreshToken", incomingRefreshToken).json({
            success: false,
            message: "Invalid refresh token",
        })
        return;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: decodedUser.id
        }
    });

    if (!user) {
        res.status(401).clearCookie("refreshToken", incomingRefreshToken).json({
            success: false,
            message: "User not found",
        })
        return;
    }
    if (incomingRefreshToken !== user.refreshToken) {
        res.
            status(401).
            clearCookie("refreshToken", incomingRefreshToken).
            json({
                success: false,
                message: "Token mismatch, please login again",
            })
        return;
    }

    const accessToken = generateAccessToken(user);
    res
        .status(200)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .json(
            {
                success: true,
                message: "Access token refreshed successfully",
            }
        );
    return;
}
const verifyCode = async (req: Request, res: Response) => {
    const { key } = req.query as { key: "register" | "forgot" };
    switch (key) {
        case 'register':
            const { username, code } = req.body as { username: string, code: string }
            try {
                const user = await prisma.user.findFirst({ where: { username, isVerified: false } });
                if (!user) {
                    res.status(400).json({
                        success: false,
                        message: 'No such user'
                    });
                    return;
                }
                const isCodeCorrect = user.verifyCode === code;
                const isCodeValid = new Date(user.verifyCodeExpiry) > new Date();
                if (isCodeCorrect && isCodeValid) {
                    await prisma.user.update({ where: { username }, data: { isVerified: true } });
                    res.status(200).json({
                        success: true,
                        message: 'code verified successfully'
                    });
                    return;
                } else if (!isCodeCorrect) {
                    res.status(400).json({
                        success: false,
                        message: 'Incorrect code'
                    });
                    return;
                }
                else {
                    res.status(400).json({
                        success: false,
                        message: 'code expired pls signup again to get new code'
                    });
                    return;
                }
            } catch (error) {
                console.log('Error verifying code', error);
                res.status(500).json({
                    success: false,
                    message: 'Error verifying code'
                });
                return;

            }

        case 'forgot':
            const { otp, email } = req.body as { otp: string, email: string };
            try {
                const redisOtp = await RedisClient.get(`${email}:otp`);
                if (!redisOtp) {
                    res.status(400).json({ sucess: false, message: "Otp expired" });
                    return;
                }

                if (otp !== redisOtp) {
                    res.status(400).json({ sucess: false, message: "Otp is wrong" });
                    return;
                }
                await RedisClient.del(`${email}:otp`)
                const resetToken = nanoid()
                await RedisClient.setex(`reset-token:${resetToken}`, 600, email)
                res.status(200).json({ success: true, message: 'Otp verified', resetToken });
                return;
            } catch (error) {
                console.log("Error verifying otp", error);
                res.status(500).json({ success: false, message: 'Error verifying otp' });
                return;
            }
    }

}
const changePassword = async (req: Request, res: Response) => {
    const { password } = req.body as { password: string }
    try {
        const hashedPassword = await hashPassword(password)
        const user = req.user;
        if (!user || !user.id) {
            res.status(400).json({
                success: false,
                message: "Login to reset"
            });
            return;
        }
        await updateUserPassword({ id: user.id }, hashedPassword)
        res.status(200).json({ success: true, message: "Password changed" });
        return;
    } catch (error) {
        console.log('Error resetting password');
        res.status(500).json({ success: false, message: "server error" })
        return;
    }
}
const resetPasswordOtp = async (req: Request, res: Response) => {
    const { email } = req.body as { email: string };
    if (!email) {
        res.status(400).json({ success: false, message: "Valid email is required" });
        return;
    }
    try {
        const userWithValidEmail = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!userWithValidEmail) {
            res.status(400).json({ success: false, message: "No user with given email" });
            return;
        }
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const emailResponse = await sendVerificationEmail(email, email, verifyCode, "forgotpassword");
        if (!emailResponse.success) {
            res.status(500).json(
                {
                    success: false,
                    message: emailResponse.message,
                }
            );
            return
        }
        await RedisClient.setex(`${email}:otp`, 300, verifyCode);
        res.status(200).json(
            {
                success: true,
                message: "Otp sent!!",
            }
        );
        return
    } catch (error) {
        console.log('error in forget password', error);
        res.status(500).json(
            {
                success: false,
                message: "Error resetting password",
            }
        );
        return
    }
}
const forgotPassword = async (req: Request, res: Response) => {
    const { newPassword, resetToken } = req.body as { newPassword: string, resetToken: string; }

    try {
        const redisResetToken = await RedisClient.get(`reset-token:${resetToken}`);

        if (!redisResetToken) {
            res.status(401).json({ success: false, message: "otp is not verified" });
            return;
        }

        const hashedPassword = await hashPassword(newPassword);
        await updateUserPassword({ email: redisResetToken }, hashedPassword);
        await RedisClient.del(`reset-token:${resetToken}`)
        res.status(200).json({
            success: true,
            message: "Password changed"
        })
        return;

    } catch (error) {
        console.log('Error in forgot password', error);
        res.status(500).json({ success: false, message: "server error" })
        return;
    }
}
export {
    getUser,
    createUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    verifyCode,
    resetPasswordOtp,
    changePassword,
    forgotPassword
};