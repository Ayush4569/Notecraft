import { z } from "zod"
export const loginSchema = z.object({
    identifier: z.string(),
    password: z.string().min(6, { message: "Password must be 6 characters" })
})

export const registerSchema = z.object({
    username: z.string()
        .min(2, { message: "Username must be at least 2 characters" })
        .max(20, { message: "Username must be less than 20 characters" })
        .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters')
    ,
    email: z.string().email(),
    password: z.string().min(6, { message: "Password must be 6 characters" }),
    profileImage: z.string().optional()
})
export const verifySchema = z.object({
    code: z.string().length(6, 'Verification code must be 6 digits'),
});