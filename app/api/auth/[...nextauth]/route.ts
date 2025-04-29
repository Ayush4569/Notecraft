import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import client from "@/db/index"
export const authOptions = {
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: "Email", placeholder: "Enter your email", type: "email" },
                password: { label: 'password', placeholder: 'Enter password', type: 'password' }
            },
            authorize:async(credentials)=>{
                const email = credentials?.email
                const password = credentials?.password
                const user = await client.user.findFirst({
                    where:{
                        email
                    }
                })

                if(!user) {
                    return null
                }
                if(user && user.password == password){
                    return {
                        id:user.id.toString(),
                        email:user.email,
                        image:user.profileImage
                    }
                }
                return null
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
      }
}
// @ts-ignore
export default NextAuth(authOptions)