import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../schemas/index";
import bcrypt from "bcrypt"
import { sendVerificationEmail } from "../helpers/email-verification";
import crypto from "crypto";
import { prisma } from "../db/db";
import { decodeRefreshToken, generateAccessToken, generateRefreshToken } from "../helpers/generateToken";
import { accessTokenOptions, refreshTokenOptions, clearCookieOptions } from "../helpers/cookie-options";
import jwt from "jsonwebtoken";
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
            const userProfile = {
                ...userObject,
                isGuest: userObject.isGuest ?? false,
                freeAiTrials: userObject.freeAiTrials ?? 0,
                subscriptionStatus: userObject.subscription?.status ?? null
            };
            res
            .status(200)
            .json({
                success: true,
                message: "User fetched successfully",
                data: userProfile,
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
                isGuest: true,
                freeAiTrials: true,
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
        const userProfile = {
            id: user.id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage ?? "",
            isPro: user.isPro,
            isGuest: user.isGuest ?? false,
            freeAiTrials: user.freeAiTrials ?? 0,
            subscriptionStatus: user.subscription?.status ?? null
        };
        res
        .status(200)
        .json({
            success: true,
            message: "User fetched successfully",
            data: userProfile,
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
        let verifyCode = crypto.randomInt(100000, 1000000).toString();
        const hashedPassword = await hashPassword(password);
        let user;
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                res.status(400).json({
                    success: false,
                    message: "Email already taken"
                });
                return;
            }
            user = await prisma.user.update({
                where: {
                    email
                },
                data: {
                    username,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry: new Date(Date.now() + 3600000),
                    isVerified: true,
                },
                include: {
                    subscription: {
                        select: {
                            status: true,
                        }
                    }
                }
            });
        } else {
            user = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry: new Date(Date.now() + 3600000),
                    isVerified: true,
                },
                include: {
                    subscription: {
                        select: {
                            status: true,
                        }
                    }
                }
            });
        }

        // Check if there is an active guest session to transfer documents from
        const existingRefreshToken = req.cookies?.refreshToken;
        if (existingRefreshToken) {
            try {
                const decoded = decodeRefreshToken(existingRefreshToken);
                if (decoded?.id) {
                    const guestUser = await prisma.user.findUnique({
                        where: { id: decoded.id },
                        select: { id: true, isGuest: true }
                    });
                    if (guestUser?.isGuest) {
                        await prisma.document.updateMany({
                            where: { userId: guestUser.id },
                            data: { userId: user.id }
                        });
                        await prisma.user.delete({
                            where: { id: guestUser.id }
                        }).catch(() => {});
                    }
                }
            } catch (guestMigrateErr) {
                console.warn("Guest session migration non-critical error:", guestMigrateErr);
            }
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                refreshToken
            }
        });

        // Non-blocking async verification email dispatch
        void sendVerificationEmail(email, username, verifyCode, 'register').catch((err) => {
            console.warn("Async verification email dispatch error:", err);
        });

        const userProfile = {
            id: user.id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage ?? "",
            isPro: user.isPro,
            isGuest: false,
            freeAiTrials: user.freeAiTrials ?? 10,
            subscriptionStatus: user.subscription?.status ?? null
        };

        res
            .status(201)
            .cookie("accessToken", accessToken, accessTokenOptions)
            .cookie("refreshToken", refreshToken, refreshTokenOptions)
            .json({
                success: true,
                message: "User registered and logged in successfully",
                data: {
                    user: userProfile,
                    accessToken
                }
            });
        return;
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
        const userProfile = {
            id: user.id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage ?? "",
            isPro: user.isPro,
            subscriptionStatus: user.subscription?.status ?? null
        };
        res
            .status(200)
            .cookie("accessToken", accessToken, accessTokenOptions)
            .cookie("refreshToken", refreshToken, refreshTokenOptions)
            .json({
                success: true,
                message: "Login successful",
                data: {
                    user: userProfile,
                    accessToken
                }
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
        let userId: string | null = req.user?.id || null;

        if (!userId) {
            const token =
                req.cookies?.accessToken ||
                req.header("Authorization")?.replace("Bearer ", "");
            if (token) {
                try {
                    const decoded = jwt.decode(token) as { id?: string } | null;
                    if (decoded?.id) {
                        userId = decoded.id;
                    }
                } catch {
                    // Ignore decode errors
                }
            }
        }

        if (!userId && req.cookies?.refreshToken) {
            const decodedRefresh = decodeRefreshToken(req.cookies.refreshToken);
            if (decodedRefresh?.id) {
                userId = decodedRefresh.id;
            }
        }

        if (userId) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    refreshToken: null,
                }
            }).catch((err) => {
                console.warn("Could not null refreshToken for user during logout:", err);
            });
            await RedisClient.del(`user:${userId}`).catch((err) => {
                console.warn("Could not delete user cache during logout:", err);
            });
        }

        res
            .status(200)
            .clearCookie("accessToken", clearCookieOptions)
            .clearCookie("refreshToken", clearCookieOptions)
            .json({
                success: true,
                message: "Logout successful",
            });
        return;
    } catch (error) {
        console.error("Error logging out:", error);
        res
            .status(200)
            .clearCookie("accessToken", clearCookieOptions)
            .clearCookie("refreshToken", clearCookieOptions)
            .json({
                success: true,
                message: "Logout completed",
            });
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
        res.status(401).clearCookie("refreshToken", clearCookieOptions).json({
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
                data: {
                    accessToken
                }
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
                    const updatedUser = await prisma.user.update({
                        where: { username },
                        data: { isVerified: true },
                        include: {
                            subscription: {
                                select: {
                                    status: true,
                                }
                            }
                        }
                    });

                    const accessToken = generateAccessToken(updatedUser);
                    const refreshToken = generateRefreshToken(updatedUser);

                    await prisma.user.update({
                        where: { id: updatedUser.id },
                        data: { refreshToken }
                    });

                    const userProfile = {
                        id: updatedUser.id,
                        username: updatedUser.username,
                        email: updatedUser.email,
                        profileImage: updatedUser.profileImage ?? "",
                        isPro: updatedUser.isPro,
                        subscriptionStatus: updatedUser.subscription?.status ?? null
                    };

                    res
                        .status(200)
                        .cookie("accessToken", accessToken, accessTokenOptions)
                        .cookie("refreshToken", refreshToken, refreshTokenOptions)
                        .json({
                            success: true,
                            message: 'code verified successfully and logged in',
                            data: {
                                user: userProfile,
                                accessToken
                            }
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
                res.status(200).json({
                    success: true,
                    message: 'Otp verified',
                    data: { resetToken }
                });
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
        let verifyCode = crypto.randomInt(100000, 1000000).toString();
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
const createGuestUser = async (req: Request, res: Response) => {
    try {
        const guestId = nanoid(10);
        const username = `guest_${guestId}`;
        const email = `guest_${guestId}@guest.notecraft.app`;
        const dummyPassword = await hashPassword(crypto.randomUUID());

        const guestUser = await prisma.user.create({
            data: {
                username,
                email,
                password: dummyPassword,
                isGuest: true,
                freeAiTrials: 3, // Backend-enforced limit of 3 AI trials for guests
                isVerified: true,
                verifyCode: "",
                verifyCodeExpiry: new Date(Date.now() + 3600000),
            },
            include: {
                subscription: {
                    select: {
                        status: true,
                    }
                }
            }
        });

        // Create an initial welcoming document for the guest workspace
        const initialDoc = await prisma.document.create({
            data: {
                userId: guestUser.id,
                title: "Welcome to Notecraft (Guest)",
                icon: "🚀",
                content: {
                    version: "0.31.2",
                    blocks: [
                        {
                            type: "heading",
                            props: { level: 2 },
                            content: "✨ Your Guest Workspace is Ready!",
                        },
                        {
                            type: "paragraph",
                            content: "You're exploring Notecraft in Guest Mode. You have 3 free AI formatting trials to test out.",
                        },
                        {
                            type: "bulletListItem",
                            content: "Create new documents, nested pages, and manage your trash from the sidebar.",
                        },
                        {
                            type: "bulletListItem",
                            content: "Select any text to trigger the AI formatting partner (3 trials remaining).",
                        },
                        {
                            type: "bulletListItem",
                            content: "Sign up for a free account at any time to preserve your documents permanently and unlock 10+ AI credits.",
                        },
                    ],
                },
            },
        });

        const accessToken = generateAccessToken(guestUser);
        const refreshToken = generateRefreshToken(guestUser);

        await prisma.user.update({
            where: { id: guestUser.id },
            data: {
                refreshToken,
            },
        });

        const userProfile = {
            id: guestUser.id,
            username: guestUser.username,
            email: guestUser.email,
            profileImage: "",
            isPro: false,
            isGuest: true,
            freeAiTrials: 3,
            subscriptionStatus: null,
        };

        res
            .status(200)
            .cookie("accessToken", accessToken, accessTokenOptions)
            .cookie("refreshToken", refreshToken, refreshTokenOptions)
            .json({
                success: true,
                message: "Guest session created successfully",
                data: {
                    user: userProfile,
                    accessToken,
                    documentId: initialDoc.id,
                },
            });
        return;
    } catch (error) {
        console.error("Error creating guest user:", error);
        res.status(500).json({
            success: false,
            message: "Failed to initialize guest session",
        });
        return;
    }
};

export {
    getUser,
    createUser,
    createGuestUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    verifyCode,
    resetPasswordOtp,
    changePassword,
    forgotPassword
};