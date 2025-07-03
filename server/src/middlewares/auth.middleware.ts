import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
interface Decoded extends JwtPayload {
    id: string
    name: string;
    email: string;
    profileImage: string
}
export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {

        res.status(401).json({ success: false, message: 'No token' });
        return
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as Decoded
        if (typeof decodedToken === 'object' && 'id' in decodedToken) {


            req.user = decodedToken

            next();
            return;
        }
        else {
            res.status(403).json({ success: false, message: 'Invalid token payload' });
            return
        }

    } catch (error) {
        res.status(403).json({ success: false, message: 'Invalid or expired token' });
        return;
    }
}