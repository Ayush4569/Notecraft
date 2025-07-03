import jwt from "jsonwebtoken";
import { User } from "types/user";

export function generateAccessToken(user: User) {
    const token = jwt.sign({
        id: user.id,
        email: user.email,
        name: user.username,
        profileImage: user.profileImage,
    }, 
    process.env.ACCESS_TOKEN_SECRET as string,
     {
        expiresIn: '1h',
    })
    return token;
}
export function generateRefreshToken(user: User) {
    const token = jwt.sign({
        id: user.id,
        email: user.email,
        name: user.username,
        profileImage: user.profileImage,
    },
    process.env.REFRESH_TOKEN_SECRET as string || '7d',
    {
        expiresIn: '7d',
    })
    return token;
}

export const decodeRefreshToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
        return decoded as {
            id: string;
            email: string;
            name: string;
            profileImage: string | null;
        }
    } catch (error) {
        return null;
    }
}