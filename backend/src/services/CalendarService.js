/**
 * Calendar Service
 * Handles Google Calendar integration for real-time availability checking
 * Uses OAuth2 with stored refreshToken from Business model
 */

const { google } = require('googleapis');
const env = require('../config/environment');

class CalendarService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.GOOGLE_REDIRECT_URI
    );
  }

  /**
   * Get available 30-minute slots for a given date
   * @param {Object} business - Business document with integrations.googleCalendar.refreshToken
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<Array>} First 2 available slots as formatted strings (e.g., ["10:00 AM", "2:30 PM"])
   */
  async getAvailableSlots(business, date) {
    try {
      // Validate inputs
      if (!business?.integrations?.googleCalendar?.refreshToken) {
        throw new Error('No Google Calendar refresh token found for this business');
      }

      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new Error('Invalid date format. Use YYYY-MM-DD');
      }

      const timezone = business.settings?.timezone || 'UTC';

      // Set up OAuth2 client with refresh token
      this.oauth2Client.setCredentials({
        refresh_token: business.integrations.googleCalendar.refreshToken
      });

      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

      // Get calendar ID (default to primary calendar)
      const calendarId = business.integrations.googleCalendar.calendarId || 'primary';

      // Calculate time window (9 AM to 5 PM in business's timezone)
      const { startTime, endTime } = this._calculateTimeWindow(date, timezone);

      // Query freebusy to find busy times
      const busyTimes = await this._getBusyTimes(
        calendar,
        calendarId,
        startTime,
        endTime
      );

      // Find available 30-minute slots
      const availableSlots = this._findAvailableSlots(
        startTime,
        endTime,
        busyTimes,
        timezone
      );

      // Return first 2 available slots
      return availableSlots.slice(0, 2);
    } catch (error) {
      console.error('Calendar Service Error:', error.message);
      throw error;
    }
  }

  /**
   * Calculate 9 AM - 5 PM time window in business timezone
   * @private
   */
  _calculateTimeWindow(date, timezone) {
    const dateObj = new Date(`${date}T09:00:00`);

    // Create time objects for 9 AM and 5 PM in the specified timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    // Get the start of business day (9 AM)
    let startOfDay = new Date(dateObj);
    startOfDay.setHours(9, 0, 0, 0);

    // Convert to UTC by calculating offset
    const offset = this._getTimezoneOffset(date, timezone);
    const startTime = new Date(startOfDay.getTime() - offset);

    // Get the end of business day (5 PM)
    let endOfDay = new Date(dateObj);
    endOfDay.setHours(17, 0, 0, 0);
    const endTime = new Date(endOfDay.getTime() - offset);

    return {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      offset
    };
  }

  /**
   * Get timezone offset in milliseconds
   * @private
   */
  _getTimezoneOffset(date, timezone) {
    const utcDate = new Date(`${date}T12:00:00Z`);
    const tzDate = new Date(
      utcDate.toLocaleString('en-US', { timeZone: timezone })
    );

    return utcDate - tzDate;
  }

  /**
   * Query Google Calendar API for busy times
   * @private
   */
  async _getBusyTimes(calendar, calendarId, startTime, endTime) {
    try {
      const response = await calendar.freebusy.query({
        requestBody: {
          timeMin: startTime,
          timeMax: endTime,
          items: [{ id: calendarId }]
        }
      });

      const busyIntervals = response.data?.calendars?.[calendarId]?.busy || [];
      return busyIntervals;
    } catch (error) {
      console.error('Error querying freebusy:', error.message);
      throw error;
    }
  }

  /**
   * Find available 30-minute slots between busy times
   * @private
   */
  _findAvailableSlots(startTime, endTime, busyTimes, timezone) {
    const slots = [];
    const SLOT_DURATION_MS = 30 * 60 * 1000; // 30 minutes

    let currentTime = new Date(startTime);
    const businessEnd = new Date(endTime);

    while (currentTime.getTime() + SLOT_DURATION_MS <= businessEnd.getTime()) {
      const slotEnd = new Date(currentTime.getTime() + SLOT_DURATION_MS);

      // Check if this slot overlaps with any busy time
      const isAvailable = !busyTimes.some(busy => {
        const busyStart = new Date(busy.start);
        const busyEnd = new Date(busy.end);

        // Check for overlap
        return currentTime < busyEnd && slotEnd > busyStart;
      });

      if (isAvailable) {
        // Format slot time in business timezone
        const formattedTime = this._formatTime(currentTime, timezone);
        slots.push(formattedTime);
      }

      // Move to next 30-minute slot
      currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
    }

    return slots;
  }

  /**
   * Format time to "HH:MM AM/PM" in business timezone
   * @private
   */
  _formatTime(date, timezone) {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  }

  /**
   * Get the Google Calendar OAuth2 authorization URL
   * Used for initial setup - to get the refresh token for a business
   */
  getAuthorizationUrl() {
    const SCOPES = ['https://www.googleapis.com/auth/calendar'];

    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent' // Force consent to get refresh token
    });

    return authUrl;
  }

  /**
   * Exchange authorization code for refresh token
   * Call this after user approves the OAuth consent screen
   * @param {string} code - Authorization code from OAuth callback
   * @returns {Promise<string>} Refresh token to store in Business model
   */
  async getRefreshTokenFromCode(code) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      return tokens.refresh_token;
    } catch (error) {
      console.error('Error exchanging code for refresh token:', error.message);
      throw error;
    }
  }
}

module.exports = new CalendarService();
