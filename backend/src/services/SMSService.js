/**
 * SMS Service
 * Handles Velocity conversation logic, message routing, and state management
 */
const SMSConversation = require('../models/SMSConversation');
const Business = require('../models/Business');
const { templates, getTimeSlots } = require('./smsTemplates');
const CalendarService = require('./CalendarService');

class SMSService {
  /**
   * Process incoming SMS from lead
   */
  async processIncomingMessage(phoneNumber, messageText, businessId, initiationMethod = 'manual') {
    try {
      let conversation = await SMSConversation.findOne({
        leadPhoneNumber: phoneNumber,
        businessId
      });

      if (!conversation) {
        // New conversation
        conversation = new SMSConversation({
          leadPhoneNumber: phoneNumber,
          businessId,
          state: 'greeting',
          initiationMethod,
          messages: []
        });
      }

      // Add lead's message
      conversation.messages.push({
        sender: 'lead',
        text: messageText,
        timestamp: new Date()
      });

      // Process message and determine response
      const response = await this._generateResponse(conversation, messageText, conversation.businessId);

      // Add Velocity's response
      if (response) {
        conversation.messages.push({
          sender: 'velocity',
          text: response,
          timestamp: new Date()
        });
      }

      conversation.lastMessageAt = new Date();
      await conversation.save();

      return {
        success: true,
        response,
        state: conversation.state,
        conversation
      };
    } catch (error) {
      console.error('Error processing SMS:', error);
      throw error;
    }
  }

  /**
   * Generate response based on conversation state
   */
  async _generateResponse(conversation, messageText, businessId) {
    const text = messageText.toLowerCase().trim();

    switch (conversation.state) {
      case 'greeting':
        return this._handleGreeting(conversation, text);

      case 'qualification':
        return this._handleQualification(conversation, text);

      case 'booking':
        return await this._handleBooking(conversation, text, businessId);

      case 'confirmed':
        return null; // No more responses

      default:
        return templates.clarification();
    }
  }

  /**
   * Handle greeting phase
   */
  _handleGreeting(conversation, text) {
    if (!conversation.leadName) {
      // Extract name from first message
      conversation.leadName = this._extractName(text);
      conversation.state = 'qualification';

      return templates.qualReason();
    }
    return null;
  }

  /**
   * Handle qualification phase
   */
  _handleQualification(conversation, text) {
    const clinicName = '[Clinic Name]';

    // Detect emergency keywords
    if (
      text.includes('emergency') ||
      text.includes('911') ||
      text.includes('er') ||
      text.includes('hospital')
    ) {
      conversation.isEmergency = true;
      conversation.state = 'escalated';
      return templates.emergencyResponse();
    }

    // Set visit reason if not set
    if (!conversation.visitReason) {
      conversation.visitReason = text;

      // Check if new or returning patient
      if (!conversation.isNewPatient) {
        return `Are you a new or returning patient?`;
      }
    }

    // Set new/returning patient status
    if (conversation.isNewPatient === null || conversation.isNewPatient === undefined) {
      conversation.isNewPatient =
        text.includes('new') || text.includes('first') ? true : false;

      // Ask about time preference
      return templates.qualTimePreference();
    }

    // Set time preference
    if (!conversation.timePreference) {
      conversation.timePreference =
        text.includes('morning') ? 'morning' : text.includes('afternoon') ? 'afternoon' : 'any';

      // Move to booking phase
      conversation.state = 'booking';
      const slots = getTimeSlots();
      return templates.bookingTwoSlots(slots[0].slot, slots[1].slot);
    }

    return templates.clarification();
  }

  /**
   * Handle booking phase - Get real-time availability from Google Calendar
   */
  async _handleBooking(conversation, text, businessId) {
    let clinicName = '[Clinic Name]';
    let availableSlots = [];

    try {
      // Fetch business details for timezone and calendar integration
      const business = await Business.findById(businessId);
      if (business) {
        clinicName = business.name;

        // Try to get real-time slots from Google Calendar
        if (business.integrations?.googleCalendar?.refreshToken) {
          try {
            // Get tomorrow's date in YYYY-MM-DD format
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowDate = tomorrow.toISOString().split('T')[0];

            // Get available slots from calendar
            const realSlots = await CalendarService.getAvailableSlots(business, tomorrowDate);

            // Format slots with dates
            const tomorrowFormatted = tomorrow.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric'
            });

            availableSlots = realSlots.map(time => ({
              slot: `tomorrow (${tomorrowFormatted}) at ${time}`,
              date: tomorrowFormatted,
              time: time
            }));

            console.log(`Found ${availableSlots.length} available slots for ${clinicName}`);
          } catch (calendarError) {
            console.warn(`Calendar lookup failed, falling back to defaults: ${calendarError.message}`);
            // Fall back to hardcoded slots if calendar lookup fails
            availableSlots = this._getDefaultSlots();
          }
        } else {
          // No calendar integration configured, use defaults
          availableSlots = this._getDefaultSlots();
        }
      } else {
        // Business not found, use defaults
        availableSlots = this._getDefaultSlots();
      }
    } catch (error) {
      console.error('Error in booking handler:', error);
      // Use default slots as fallback
      availableSlots = this._getDefaultSlots();
    }

    // Ensure we have at least 2 slots
    const slotsToOffer = availableSlots.slice(0, 2);
    if (slotsToOffer.length < 2) {
      slotsToOffer.push(...this._getDefaultSlots().slice(0, 2 - slotsToOffer.length));
    }

    // Check which slot they chose
    const chosenSlot =
      text.includes(slotsToOffer[0].time.toLowerCase().replace(' ', '')) ||
      text.includes('first')
        ? slotsToOffer[0]
        : text.includes(slotsToOffer[1].time.toLowerCase().replace(' ', '')) ||
          text.includes('second')
        ? slotsToOffer[1]
        : null;

    if (chosenSlot) {
      conversation.appointmentDate = chosenSlot.date;
      conversation.appointmentTime = chosenSlot.time;
      conversation.state = 'confirmed';

      const day = new Date(chosenSlot.date).toLocaleDateString('en-US', {
        weekday: 'long'
      });
      return templates.confirmAppointment(day, chosenSlot.date, chosenSlot.time, clinicName);
    }

    // If they want a custom time
    if (
      text.includes('other') ||
      text.includes('different') ||
      text.includes('custom') ||
      text.includes('what')
    ) {
      return templates.bookingAlternate();
    }

    // First time in booking state - offer available slots
    if (!conversation.slotOffer) {
      conversation.slotOffer = {
        slot1: slotsToOffer[0].slot,
        slot2: slotsToOffer[1].slot
      };
      return templates.bookingTwoSlots(slotsToOffer[0].slot, slotsToOffer[1].slot);
    }

    // If they provide custom date/time, capture it
    if (text) {
      conversation.appointmentDate = text;
      conversation.appointmentTime = text;
      conversation.state = 'confirmed';
      return `Great — I'll get that booked for ${text}. See you at ${clinicName}!`;
    }

    return templates.clarification();
  }

  /**
   * Get default hardcoded time slots (fallback if calendar not configured)
   * @private
   */
  _getDefaultSlots() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const wednesday = new Date();
    wednesday.setDate(wednesday.getDate() + (3 - wednesday.getDay()));

    const tomorrowFormatted = tomorrow.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });

    const wednesdayFormatted = wednesday.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });

    return [
      { slot: `tomorrow (${tomorrowFormatted}) at 2:00 PM`, date: tomorrowFormatted, time: '2:00 PM' },
      { slot: `Wednesday (${wednesdayFormatted}) at 10:00 AM`, date: wednesdayFormatted, time: '10:00 AM' }
    ];
  }

  /**
   * Extract name from text (simple heuristic)
   */
  _extractName(text) {
    // Remove common filler words
    const name = text
      .replace(/^(my name is|i'm|i am|hello|hi|hey|my names?)/gi, '')
      .split(/[,.]|and|or/)[0]
      .trim();

    return name || 'there';
  }

  /**
   * Start new conversation (missed call or form submission)
   */
  async startConversation(
    phoneNumber,
    businessId,
    initiationMethod,
    leadName = null
  ) {
    try {
      // Check if conversation already exists
      let conversation = await SMSConversation.findOne({
        leadPhoneNumber: phoneNumber,
        businessId
      });

      if (conversation) {
        // Resume existing conversation
        return conversation;
      }

      // Create new conversation
      const business = await require('../models/Business').findById(businessId);
      const clinicName = business?.name || '[Clinic Name]';

      conversation = new SMSConversation({
        leadPhoneNumber: phoneNumber,
        businessId,
        leadName,
        initiationMethod,
        state: 'greeting',
        messages: []
      });

      // Generate opening message
      let openingMessage;
      if (initiationMethod === 'missed_call') {
        openingMessage = templates.openMissedCall(clinicName);
      } else if (initiationMethod === 'form_submit' && leadName) {
        openingMessage = templates.openFormSubmit(leadName, clinicName);
      } else {
        openingMessage = templates.openMissedCall(clinicName);
      }

      // Add opening message
      conversation.messages.push({
        sender: 'velocity',
        text: openingMessage,
        timestamp: new Date()
      });

      await conversation.save();
      return conversation;
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  }

  /**
   * Get conversation by phone number and business
   */
  async getConversation(phoneNumber, businessId) {
    return SMSConversation.findOne({
      leadPhoneNumber: phoneNumber,
      businessId
    });
  }

  /**
   * Close conversation
   */
  async closeConversation(phoneNumber, businessId, reason = 'completed') {
    return SMSConversation.findOneAndUpdate(
      { leadPhoneNumber: phoneNumber, businessId },
      {
        state: 'closed',
        closedAt: new Date(),
        closedReason: reason
      },
      { new: true }
    );
  }

  /**
   * Escalate conversation to human
   */
  async escalateConversation(phoneNumber, businessId, teamMemberId, reason) {
    return SMSConversation.findOneAndUpdate(
      { leadPhoneNumber: phoneNumber, businessId },
      {
        state: 'escalated',
        isEscalated: true,
        escalationReason: reason,
        escalatedToTeamMemberId: teamMemberId
      },
      { new: true }
    );
  }
}

module.exports = new SMSService();
