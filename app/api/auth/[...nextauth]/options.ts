import { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import client from "@/db/index"
import bcrypt from "bcrypt"
export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: "Email", placeholder: "Enter your email", type: "email" },
                password: { label: 'password', placeholder: 'Enter password', type: 'password' }
            },
            authorize: async (credentials: any): Promise<any> => {
                try {
                    const user = await client.user.findFirst({
                        where: {
                            OR: [
                                { email: credentials.identifier },
                                { username: credentials.identifier },
                            ]
                        }
                    })
                    if (!user) {
                        throw new Error("user not found")
                    }
                    if (!user.isVerified) {
                        throw new Error('Please verify your email to login');
                    }
                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );
                    if (isPasswordCorrect) {
                        return user;
                    } else {
                        throw new Error('Incorrect password');
                    }
                } catch (error: any) {
                    throw new Error(error.message);
                }
            }
        }),
        GoogleProvider({
            clientId:process.env.AUTH_GOOGLE_ID as string,
            clientSecret:process.env.AUTH_GOOGLE_SECRET as string
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60 * 24 ,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.username = user.username;
                token.isVerified = user.isVerified;
                token.picture = user.image
            }
            return token
        },
        session: ({ session, token }) => {
            session.user.id = token.id
            session.user.username = token.username;
            session.user.isVerified = token.isVerified;
            session.user.image = token.picture
            return session
        }
    },
    pages: {
        signIn: '/login'
    }
}