/**
 * CORS middleware configured for allowed origin
 */
const cors = require('cors');
const env = require('../config/environment');

const raw = env.CORS_ORIGIN || '';
const allowed = raw.split(',').map(s => s.trim()).filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowed.includes('*') || allowed.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = cors(corsOptions);
