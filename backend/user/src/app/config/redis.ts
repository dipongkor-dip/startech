import {createClient, type RedisClientType} from "redis";
import {env} from "../env/index.js";

export const redisClient: RedisClientType = createClient({
  url: env.redis_url,
});

export const connectRedis = async () => {
  redisClient.on("error", (err) => {
    console.error("❌ Redis Client Error:", err);
  });

  redisClient.on("connect", () => {
    console.log("✅ Redis Client Connected");
  });

  await redisClient.connect();
};

export const setOTP = async (key: string, otp: string, expiresInSeconds: number) => {
  await redisClient.set(key, otp, {EX: expiresInSeconds});
};

export const getOTP = async (key: string) => {
  return await redisClient.get(key);
};

export const deleteOTP = async (key: string) => {
  await redisClient.del(key);
};

export const setRateLimit = async (key: string, expiresInSeconds: number) => {
  await redisClient.set(key, "true", {EX: expiresInSeconds});
};

export const checkRateLimit = async (key: string) => {
  const value = await redisClient.get(key);
  return value === "true";
};

export const disconnectRedis = async () => {
  await redisClient.quit();
  console.log("✅ Redis Client Disconnected");
};
