/**
 * CORS middleware configured for allowed origin
 */
const cors = require('cors');
const env = require('../config/environment');

const corsOptions = {
  origin: env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = cors(corsOptions);
