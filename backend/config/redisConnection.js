import { createClient } from "redis";
import { settings } from "./settings.js";

let redisClient = null;

export const connectToRedis = async () => {
  if (!redisClient) {
    redisClient = createClient({
      url: settings.redis.url,
    });

    redisClient.on("error", (err) => {
      console.error("Redis error:", err);
    });

    await redisClient.connect();
    console.log("✓ Redis connected");
  }
  return redisClient;
};

export const getRedisClient = () => {
  if (!redisClient) {
    throw new Error("Redis not connected. Call connectToRedis first.");
  }
  return redisClient;
};

export const closeRedisConnection = async () => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log("✓ Redis disconnected");
  }
};
