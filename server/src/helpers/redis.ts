import { Redis } from "ioredis";

const client = new Redis(process.env.REDIS_URL as string, {
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
});

client.on("connect", () => console.log("Redis connected"));
client.on("error", (err) => {
    // Log connection issues but do not crash
    console.error("Redis connection error:", err.message);
});

export const RedisClient = {
    get: async (key: string): Promise<string | null> => {
        try {
            return await client.get(key);
        } catch (error: any) {
            console.error(`Redis GET error for key ${key}:`, error.message);
            return null;
        }
    },
    setex: async (key: string, seconds: number, value: string): Promise<string | null> => {
        try {
            return await client.setex(key, seconds, value);
        } catch (error: any) {
            console.error(`Redis SETEX error for key ${key}:`, error.message);
            return null;
        }
    },
    del: async (key: string): Promise<number> => {
        try {
            return await client.del(key);
        } catch (error: any) {
            console.error(`Redis DEL error for key ${key}:`, error.message);
            return 0;
        }
    },
    incr: async (key: string): Promise<number> => {
        try {
            return await client.incr(key);
        } catch (error: any) {
            console.error(`Redis INCR error for key ${key}:`, error.message);
            throw error;
        }
    },
    expire: async (key: string, seconds: number): Promise<number> => {
        try {
            return await client.expire(key, seconds);
        } catch (error: any) {
            console.error(`Redis EXPIRE error for key ${key}:`, error.message);
            return 0;
        }
    }
};