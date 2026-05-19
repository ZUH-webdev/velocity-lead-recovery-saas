/**
 * Entry point for the Velocity backend server.
 * - Loads environment
 * - Connects to PostgreSQL and Redis
 * - Starts Express server
 */
import "dotenv/config"; // single import-style dotenv load, no double call needed

import http from "http";
import app from "./app";
import { prisma } from "./config/prisma";
import { getRedisClient } from "./config/redis";
import { env } from "./config/env";

const server = http.createServer(app);

async function start() {
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL database");

    await getRedisClient();
    console.log("Connected to Redis");

    server.listen(env.PORT, () => {
      console.log(`Velocity server running on port ${env.PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    await shutdown(1);
  }
}

async function shutdown(code = 0) {
  console.log("Shutting down...");
  server.close();
  await prisma.$disconnect();
  process.exit(code);
}

process.on("SIGTERM", () => shutdown());
process.on("SIGINT", () => shutdown());

start();