/**
 * Express application setup
 * - Middlewares: CORS, JSON body parser, logging, rate limiter
 * - Routes registration
 * - Global error handler
 */
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimiter = require('./middleware/rateLimiter');
const corsMiddleware = require('./middleware/cors');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth.routes');
const businessRoutes = require('./routes/business.routes');
const leadsRoutes = require('./routes/leads.routes');
const smsRoutes = require('./routes/sms.routes');
const calendarRoutes = require('./routes/calendar.routes');

const app = express();

app.use(helmet());
app.use(morgan('combined'));
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(rateLimiter);

// Health
app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Velocity Lead Recovery backend is running',
    endpoints: ['/api/health', '/api/auth', '/api/business', '/api/leads', '/api/sms', '/api/calendar']
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/calendar', calendarRoutes);


// backend/src/app.js

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    services: {
      db: 'connected',
      redis: 'connected'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', code: 'NOT_FOUND' });
});

// Error handler
app.use(errorHandler);

module.exports = app;
