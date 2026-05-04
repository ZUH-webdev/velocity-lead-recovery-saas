/**
 * SMS Service
 * Handles Velocity conversation logic, message routing, and state management
 */
const SMSConversation = require('../models/SMSConversation');
const { templates, getTimeSlots } = require('./smsTemplates');

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
      const response = await this._generateResponse(conversation, messageText);

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
  async _generateResponse(conversation, messageText) {
    const text = messageText.toLowerCase().trim();

    switch (conversation.state) {
      case 'greeting':
        return this._handleGreeting(conversation, text);

      case 'qualification':
        return this._handleQualification(conversation, text);

      case 'booking':
        return this._handleBooking(conversation, text);

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
   * Handle booking phase
   */
  _handleBooking(conversation, text) {
    const clinicName = '[Clinic Name]';
    const slots = getTimeSlots();

    // Check which slot they chose
    const chosenSlot =
      text.includes('tomorrow') || text.includes('2:00') || text.includes('2 pm')
        ? slots[0]
        : text.includes('wednesday') || text.includes('10:00') || text.includes('10 am')
        ? slots[1]
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
