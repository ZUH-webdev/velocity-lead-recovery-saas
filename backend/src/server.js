/**
 * Entry point for the LeadBooster backend server.
 * - Loads environment
 * - Connects to MongoDB and Redis
 * - Starts Express server
 */
require('dotenv').config();
const http = require('http');
const app = require('./app');
const { connectWithRetry } = require('./config/database');
const { createRedisClient } = require('./config/redis');
const env = require('./config/environment');

const server = http.createServer(app);

async function start() {
  try {
    await connectWithRetry(process.env.MONGODB_URI);
    await createRedisClient(process.env.REDIS_URL);

    server.listen(env.PORT, () => {
      console.log(`LeadBooster server running on port ${env.PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
