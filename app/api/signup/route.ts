import { NextResponse, NextRequest } from "next/server";
import client from "@/db/index"
import bcrypt from "bcrypt"
import { registerSchema } from "@/schemas/index";
import { sendVerificationEmail } from "@/helpers/email-verification";
export async function POST(req: NextRequest) {
    const { username, email, password } = await req.json()
    try {
        const result = registerSchema.safeParse({ username, email, password });
        if (!result.success) {
            const signupErrors = result.error.format()._errors || []
            return NextResponse.json({
                success: false,
                message:
                    signupErrors?.length > 0
                        ? signupErrors.join(', ')
                        : 'Invalid fields',
            }, {
                status: 500
            })
        }
        const existingVerifiedUserByUsername = await client.user.findFirst({
            where: {
                username,
                isVerified: true
            }
        })
        if (existingVerifiedUserByUsername) {
            return NextResponse.json({
                success: false,
                message: "username is already taken "
            }, {
                status: 400
            })
        }
        const existingUserByEmail = await client.user.findFirst({
            where: {
                email
            }
        });
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: "User already verified"
                }, {
                    status: 500
                })
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await client.user.update({
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
            await client.user.create({
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
            return NextResponse.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            );
        }
        return NextResponse.json(
            {
                success: true,
                message: 'User registered successfully. Please verify your account.',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error registering user", error);
        return NextResponse.json({
            success: false,
            message: "Error registering user"
        }, {
            status: 500
        })

    }
} 