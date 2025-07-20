import { Redis } from "ioredis";

export const RedisClient:Redis = new Redis({
    port: 6379,
    host: process.env.REDIS_HOST || "localhost",
})