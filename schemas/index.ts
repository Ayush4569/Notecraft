import {z} from "zod"
export const loginSchema = z.object({
    email:z.string().email(),
    password:z.string().min(6,{message:"Password must be 6 characters"})
})

export const registerSchema = z.object({
    username:z.string().min(3,{message:"username must be 3 characters"}),
    email:z.string().email(),
    password:z.string().min(6,{message:"Password must be 6 characters"}),
    profileImage:z.string().optional()
})