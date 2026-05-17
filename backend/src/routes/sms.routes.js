/**
 * SMS Routes
 * Handles incoming SMS messages and SMS conversation management
 */
const express = require('express');
const router = express.Router();
const SMSService = require('../services/SMSService');

/**
 * POST /api/sms/incoming
 * Receive incoming SMS message from Twilio (or other SMS provider)
 */
router.post('/incoming', async (req, res) => {
  try {
    const { phoneNumber, messageText, businessId, initiationMethod } = req.body;

    if (!phoneNumber || !messageText || !businessId) {
      return res.status(400).json({
        error: 'Missing required fields: phoneNumber, messageText, businessId'
      });
    }

    const result = await SMSService.processIncomingMessage(
      phoneNumber,
      messageText,
      businessId,
      initiationMethod || 'manual'
    );

    res.json({
      success: true,
      data: {
        response: result.response,
        state: result.state,
        conversationId: result.conversation._id
      }
    });
  } catch (error) {
    console.error('Error receiving SMS:', error);
    res.status(500).json({ error: 'Failed to process SMS', details: error.message });
  }
});

/**
 * POST /api/sms/start
 * Start a new SMS conversation (missed call or form submission)
 */
router.post('/start', async (req, res) => {
  try {
    const { phoneNumber, businessId, initiationMethod, leadName } = req.body;

    if (!phoneNumber || !businessId) {
      return res.status(400).json({
        error: 'Missing required fields: phoneNumber, businessId'
      });
    }

    const conversation = await SMSService.startConversation(
      phoneNumber,
      businessId,
      initiationMethod || 'manual',
      leadName
    );

    // Get the opening message to send
    const openingMessage = conversation.messages[conversation.messages.length - 1];

    res.json({
      success: true,
      data: {
        conversationId: conversation._id,
        message: openingMessage.text,
        state: conversation.state
      }
    });
  } catch (error) {
    console.error('Error starting SMS conversation:', error);
    res.status(500).json({ error: 'Failed to start conversation', details: error.message });
  }
});

/**
 * GET /api/sms/conversation/:phoneNumber
 * Get conversation history by phone number
 */
router.get('/conversation/:phoneNumber', async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const { businessId } = req.query;

    if (!businessId) {
      return res.status(400).json({ error: 'Missing required query param: businessId' });
    }

    const conversation = await SMSService.getConversation(phoneNumber, businessId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation', details: error.message });
  }
});

/**
 * POST /api/sms/close
 * Close a conversation
 */
router.post('/close', async (req, res) => {
  try {
    const { phoneNumber, businessId, reason } = req.body;

    if (!phoneNumber || !businessId) {
      return res.status(400).json({
        error: 'Missing required fields: phoneNumber, businessId'
      });
    }

    const conversation = await SMSService.closeConversation(
      phoneNumber,
      businessId,
      reason || 'completed'
    );

    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Error closing conversation:', error);
    res.status(500).json({ error: 'Failed to close conversation', details: error.message });
  }
});

/**
 * POST /api/sms/escalate
 * Escalate conversation to human team member
 */
router.post('/escalate', async (req, res) => {
  try {
    const { phoneNumber, businessId, teamMemberId, reason } = req.body;

    if (!phoneNumber || !businessId || !teamMemberId) {
      return res.status(400).json({
        error: 'Missing required fields: phoneNumber, businessId, teamMemberId'
      });
    }

    const conversation = await SMSService.escalateConversation(
      phoneNumber,
      businessId,
      teamMemberId,
      reason || 'escalated'
    );

    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Error escalating conversation:', error);
    res.status(500).json({ error: 'Failed to escalate conversation', details: error.message });
  }
});

module.exports = router;
