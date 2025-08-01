import { prisma } from "../db/db";
import bcrypt from "bcrypt"
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10)
}
export const updateUserPassword = async (identifier: { id?: string; email?: string }, hashedPassword: string) => {
    const validUser = await prisma.user.findFirst({
        where:{
            OR:[
                {id:identifier.id},
                {email:identifier.email}
            ]
        }
    })
    
    if(!validUser) {
        throw new Error("Invalid user")
    }
    if(identifier.id) {
        return await prisma.user.update({
            where:{
                id:identifier.id
            },
            data:{
                password:hashedPassword
            }
        })
    } else {
        return await prisma.user.update({
            where:{
                email:identifier.email
            },
            data:{
                password:hashedPassword
            }
        })
    }
}