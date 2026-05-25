import {Redis} from "ioredis";

let client: Redis | null = null;

export async function getRedisClient(): Promise<Redis> {
  if (!client) {
    client = new Redis(process.env.REDIS_URL!);
  }
  return client;
}