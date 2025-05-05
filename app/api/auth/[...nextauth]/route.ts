import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import client from "@/db/index"
import { loginSchema } from "@/schemas"
import bcrypt from "bcrypt"
export const authOptions = {
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: "Email", placeholder: "Enter your email", type: "email" },
                password: { label: 'password', placeholder: 'Enter password', type: 'password' }
            },
            authorize: async (credentials) => {
                const result = loginSchema.safeParse(credentials);
                if (!result.success) {
                    return null
                }
                const { email, password } = result.data
                const user = await client.user.findUnique({ where: { email } });
                if (!user || !user.password) return null;
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) return null
                return {
                    id: user.id.toString(),
                    name: user.username,
                    image: user?.profileImage,
                    email:user.email
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60,
        updateAge: 5 * 60
    },
    callbacks: {
        // @ts-ignore
        jwt: ({ token }) => {
            token.userId = token.sub
            return token
        },
        session: ({ session, token }: any) => {
            session.userId = token.userId
            return session
        }
    },
    pages:{
        '/login':"/auth/login",
        '/signup':"/auth/signup"
    }
}
// @ts-ignore
export const handler =  NextAuth(authOptions)
export { handler as GET, handler as POST }