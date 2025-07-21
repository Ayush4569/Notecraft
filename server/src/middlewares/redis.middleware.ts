import { NextFunction, Request,Response } from "express"
import { RedisClient } from "../helpers/redis";

export const rateLimiter = (route:string,requestLimit:number,windowDuration:number)=>{
    return async function(req:Request,res:Response,next:NextFunction){
        
        const identifier = req.user?.id ?? req.ip;

        const key = `${route}:${identifier}`

        const currentRequest = await RedisClient.incr(key);
        if(currentRequest === 1) {
            await RedisClient.expire(key,windowDuration)
        }
        if(currentRequest > requestLimit ) {
            res.status(429).json({
                success:false,
                message:"Too many requests. Please try again later."
            })
            return;
        }
        res.setHeader("X-RateLimit-Limit", requestLimit.toString());
        next()
    }   
}       