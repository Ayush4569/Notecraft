import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../schemas/index";
import bcrypt from "bcrypt"
import { sendVerificationEmail } from "../helpers/email-verification";
import { prisma } from "../db/db";
import { decodeRefreshToken, generateAccessToken, generateRefreshToken } from "../helpers/generateToken";
import { accessTokenOptions, refreshTokenOptions } from "../helpers/cookie-options";

const getUser = async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    };
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id as string
            },
            select: {
                id: true,
                username: true,
                email: true,
                profileImage: true,
                isPro: true
            }
        })
        res.status(200).json({
            success: true,
            user,
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
                    message: "User already verified"
                });
                return
            }
            const hashedPassword = await bcrypt.hash(password, 10);
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
            const hashedPassword = await bcrypt.hash(password, 10);
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
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
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
                    name: user.username,
                    email: user.email,
                    profileImage: user.profileImage,
                },
                message: "Login successful",
            })
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
        res.status(401).json({
            success: false,
            message: "Invalid refresh token",
        })
        return;
    }
    const user = await prisma.user.findUnique({
        where: {
            id: decodedUser.id
        }
    })
    if (!user) {
        res.status(401).json({
            success: false,
            message: "User not found",
        })
        return;
    }
    if (incomingRefreshToken !== user.refreshToken) {
        res.status(401).json({
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
    const { username, code } = req.body
    try {
        const user = await prisma.user.findFirst({ where: { username, isVerified: false } });
        if (!user) {
            res.status(40).json({
                success: false,
                message: 'No such user'
            });
            return;
        }
        const isCodeCorrect = user.verifyCode === code;
        const isCodeValid = new Date(user.verifyCodeExpiry) > new Date();
        if (isCodeCorrect && isCodeValid) {
            await prisma.user.update({ where: { username }, data: { isVerified: true } })
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
}

export { getUser, createUser, loginUser, logoutUser, refreshAccessToken, verifyCode };