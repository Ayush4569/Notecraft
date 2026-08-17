import { Redis } from "ioredis";

export const RedisClient:Redis = new Redis(process.env.REDIS_URL as string);
RedisClient.on("connect", () => console.log("Redis connected"));
RedisClient.on("error", (err) => console.error("Redis error", err));