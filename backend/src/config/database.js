/**
 * MongoDB connection with retry logic using Mongoose
 */
const mongoose = require('mongoose');

/**
 * Connect to MongoDB with simple retry/backoff
 * @param {string} uri MongoDB connection string
 */
async function connectWithRetry(uri) {
  const maxRetries = 5;
  let attempts = 0;
  const connect = async () => {
    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('MongoDB connected');
    } catch (err) {
      attempts += 1;
      console.error(`MongoDB connection failed (attempt ${attempts}):`, err.message);
      if (attempts >= maxRetries) throw err;
      const backoff = Math.min(1000 * 2 ** attempts, 30000);
      console.log(`Retrying MongoDB connection in ${backoff}ms`);
      await new Promise((r) => setTimeout(r, backoff));
      return connect();
    }
  };

  return connect();
}

module.exports = { connectWithRetry };
