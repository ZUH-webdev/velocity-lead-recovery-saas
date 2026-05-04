/**
 * Redis client setup (ioredis)
 */
const Redis = require('ioredis');
let client;

/**
 * Create and export a Redis client
 * @param {string} url Redis connection URL
 */
async function createRedisClient(url) {
  if (client) return client;
  client = new Redis(url);

  client.on('connect', () => console.log('Redis connected'));
  client.on('error', (err) => console.error('Redis error', err));

  // Wait until ready
  await client.connect().catch((e) => {
    // ioredis connect may throw if already connected; handle gracefully
    if (e.message && e.message.includes('connect')) console.warn('Redis connect warning:', e.message);
  });

  return client;
}

module.exports = { createRedisClient };
