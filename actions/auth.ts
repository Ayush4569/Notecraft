'use server'
import { registerSchema } from "@/schemas/index"
import client from "@/db/index"
import { z } from "zod"
import bcrypt from 'bcrypt'
type User = z.infer<typeof registerSchema>
export async function Signup(formData: User) {
    const userData = registerSchema.safeParse(formData);
    if (!userData.success) {
        throw new Error("Invalid input")
    }
    const { username, email, password, profileImage } = userData.data;
    const user = await client.user.findFirst({
        where: {
            username,
            email
        }
    })

    if (user) {
        return {
            success: false,
            message: 'username or email already exist'
        }
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
         await client.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                profileImage: profileImage ?? null
            }
        })
        return {
            success: true,
            message: "Account created"
        }
    } catch (error) {
        console.error('Error at actions/signup',error)
        return {
            success: false,
            message: "Internal error while creating user"
        }
    }

}