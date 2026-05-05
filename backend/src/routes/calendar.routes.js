/**
 * Calendar Integration Routes
 * Handles OAuth flow for connecting Google Calendar
 * Endpoints for availability checking
 */
const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const CalendarService = require('../services/CalendarService');
const auth = require('../middleware/auth.middleware');

/**
 * GET /api/calendar/auth-url
 * Get Google OAuth authorization URL for business
 * User visits this URL in browser to authorize calendar access
 */
router.get('/auth-url', auth, async (req, res) => {
  try {
    const authUrl = CalendarService.getAuthorizationUrl();
    
    res.json({
      success: true,
      authUrl,
      message: 'Visit this URL to authorize Google Calendar access'
    });
  } catch (error) {
    console.error('Error getting auth URL:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/calendar/callback
 * OAuth callback - exchange authorization code for refresh token
 * Google redirects here after user approves access
 */
router.get('/callback', auth, async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Authorization code missing' 
      });
    }

    // Exchange authorization code for refresh token
    const refreshToken = await CalendarService.getRefreshTokenFromCode(code);

    // Get business from authenticated user
    const business = await Business.findById(req.user.businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    // Store refresh token in business document
    business.integrations = business.integrations || {};
    business.integrations.googleCalendar = {
      refreshToken,
      calendarId: 'primary', // Use primary calendar by default
      connectedAt: new Date(),
      connectedBy: req.user.userId
    };

    await business.save();

    res.json({
      success: true,
      message: 'Google Calendar connected successfully',
      business: {
        id: business._id,
        name: business.name,
        calendarConnected: true,
        timezone: business.settings?.timezone || 'UTC'
      }
    });
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/calendar/availability
 * Get available 30-minute time slots for a given date
 * 
 * Query Parameters:
 *   - date (required): Date in YYYY-MM-DD format (e.g., 2025-05-06)
 * 
 * Response:
 *   - availableSlots: Array of formatted times (e.g., ["10:00 AM", "2:30 PM"])
 *   - timezone: Business's timezone
 *   - count: Number of available slots found
 * 
 * Example:
 *   GET /api/calendar/availability?date=2025-05-06
 *   
 *   Response:
 *   {
 *     "success": true,
 *     "date": "2025-05-06",
 *     "timezone": "America/New_York",
 *     "availableSlots": ["10:00 AM", "2:30 PM", "3:00 PM", "3:30 PM"],
 *     "count": 4
 *   }
 */
router.get('/availability', auth, async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ 
        success: false, 
        message: 'Date parameter required in YYYY-MM-DD format' 
      });
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD (e.g., 2025-05-06)'
      });
    }

    const business = await Business.findById(req.user.businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    // Check if Google Calendar is connected
    if (!business.integrations?.googleCalendar?.refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Google Calendar not connected. Visit /api/calendar/auth-url to connect first'
      });
    }

    // Get available slots from calendar
    const slots = await CalendarService.getAvailableSlots(business, date);

    res.json({
      success: true,
      date,
      timezone: business.settings?.timezone || 'UTC',
      availableSlots: slots,
      count: slots.length
    });
  } catch (error) {
    console.error('Error getting availability:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      type: error.constructor.name 
    });
  }
});

/**
 * GET /api/calendar/status
 * Check if Google Calendar is connected for the business
 * Returns calendar connection status and details
 */
router.get('/status', auth, async (req, res) => {
  try {
    const business = await Business.findById(req.user.businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    const isConnected = !!business.integrations?.googleCalendar?.refreshToken;

    res.json({
      success: true,
      connected: isConnected,
      business: {
        id: business._id,
        name: business.name,
        timezone: business.settings?.timezone || 'UTC'
      },
      ...(isConnected && {
        calendar: {
          calendarId: business.integrations.googleCalendar.calendarId,
          connectedAt: business.integrations.googleCalendar.connectedAt,
          connectedBy: business.integrations.googleCalendar.connectedBy
        }
      })
    });
  } catch (error) {
    console.error('Error getting calendar status:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE /api/calendar/disconnect
 * Disconnect Google Calendar from the business
 * Removes stored refresh token
 */
router.delete('/disconnect', auth, async (req, res) => {
  try {
    const business = await Business.findById(req.user.businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    // Clear calendar integration
    if (business.integrations?.googleCalendar) {
      business.integrations.googleCalendar = null;
      await business.save();
    }

    res.json({
      success: true,
      message: 'Google Calendar disconnected successfully'
    });
  } catch (error) {
    console.error('Error disconnecting calendar:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/calendar/settings
 * Update calendar settings (timezone, calendar ID, etc.)
 */
router.put('/settings', auth, async (req, res) => {
  try {
    const { timezone, calendarId } = req.body;

    const business = await Business.findById(req.user.businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    // Update timezone if provided
    if (timezone) {
      business.settings = business.settings || {};
      business.settings.timezone = timezone;
    }

    // Update calendar ID if provided
    if (calendarId && business.integrations?.googleCalendar) {
      business.integrations.googleCalendar.calendarId = calendarId;
    }

    await business.save();

    res.json({
      success: true,
      message: 'Calendar settings updated',
      settings: {
        timezone: business.settings?.timezone || 'UTC',
        calendarId: business.integrations?.googleCalendar?.calendarId || 'primary'
      }
    });
  } catch (error) {
    console.error('Error updating calendar settings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
