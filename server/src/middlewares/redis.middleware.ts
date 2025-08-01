import { NextFunction, Request, Response } from "express"
import { RedisClient } from "../helpers/redis";

export const rateLimiter = (route: string, maxRequest: number, windowDuration: number) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const userRequest = req.ip ?? req.user?.id as string;
        const redisReq = await RedisClient.incr(`${route}:${userRequest}`)
        if (redisReq === 1) {
            await RedisClient.expire(`${route}:${userRequest}`, windowDuration);
        }

        if (redisReq > maxRequest) {
            res.status(429).json({
                success: false,
                message: "Too many requests. Please try again later."
            });
            return;
        }
        res.setHeader("X-RateLimit", redisReq.toString())
        next()

    }
}   