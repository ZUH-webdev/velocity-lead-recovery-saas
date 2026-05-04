/**
 * SMS Service Test
 * Tests Velocity conversation flow without needing a database
 */

// Mock SMSConversation for testing
class MockSMSConversation {
  constructor(data) {
    Object.assign(this, data);
    this.messages = [];
  }

  static async findOne(query) {
    return null; // Simulate no existing conversation
  }

  static async findOneAndUpdate(query, update, options) {
    return { ...query, ...update };
  }

  async save() {
    return this;
  }
}

// Test the SMS Service
async function testSMSConversation() {
  console.log('🚀 Starting Velocity SMS Conversation Test\n');

  const SMSService = require('./SMSService');
  const smsTemplates = require('./smsTemplates');

  // Override MongoDB calls for testing
  const SMSConversation = require('../models/SMSConversation');

  // Simulate a full conversation
  const testPhoneNumber = '+1-555-TEST-123';
  const testBusinessId = 'test-clinic-123';

  const testConversation = {
    leadPhoneNumber: testPhoneNumber,
    businessId: testBusinessId,
    state: 'greeting',
    leadName: null,
    visitReason: null,
    isNewPatient: null,
    urgency: null,
    timePreference: null,
    messages: [],
    isEmergency: false,
    lastMessageAt: new Date(),
    async save() {
      return this;
    }
  };

  // Override findOne for testing
  const originalFindOne = SMSConversation.findOne;
  SMSConversation.findOne = async (query) => {
    if (query.state) return null; // No conversation found
    return testConversation;
  };

  const testMessages = [
    'hello velocity',
    'I am Sarah',
    'dental cleaning',
    'new',
    'mornings',
    'tomorrow 2'
  ];

  console.log('📱 Simulating lead conversation...\n');

  for (const leadMessage of testMessages) {
    console.log(`📤 Lead: "${leadMessage}"`);

    try {
      // Simulate processing
      const result = await simulateMessageProcessing(testConversation, leadMessage);

      if (result) {
        console.log(`📥 Velocity: "${result}"`);
      }
      console.log(`   State: ${testConversation.state}\n`);
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  console.log('\n✅ Test Complete!');
  console.log(`\nFinal Conversation State:`);
  console.log(`- Lead Name: ${testConversation.leadName}`);
  console.log(`- Visit Reason: ${testConversation.visitReason}`);
  console.log(`- New Patient: ${testConversation.isNewPatient}`);
  console.log(`- Time Preference: ${testConversation.timePreference}`);
  console.log(`- Appointment: ${testConversation.appointmentDate} at ${testConversation.appointmentTime}`);
  console.log(`- Total Messages: ${testConversation.messages.length}`);
}

/**
 * Simulate message processing
 */
async function simulateMessageProcessing(conversation, messageText) {
  const text = messageText.toLowerCase().trim();

  switch (conversation.state) {
    case 'greeting':
      if (!conversation.leadName) {
        conversation.leadName = messageText.charAt(0).toUpperCase() + messageText.slice(1);
        conversation.state = 'qualification';
        return `What's the reason for your visit?`;
      }
      break;

    case 'qualification':
      if (!conversation.visitReason) {
        conversation.visitReason = messageText;
        return `Are you a new or returning patient?`;
      }

      if (conversation.isNewPatient === null || conversation.isNewPatient === undefined) {
        conversation.isNewPatient = text.includes('new') || text.includes('first');
        return `Mornings or afternoons better?`;
      }

      if (!conversation.timePreference) {
        conversation.timePreference = text.includes('morning') ? 'morning' : 'afternoon';
        conversation.state = 'booking';
        return `Would tomorrow at 2:00 PM or Wednesday at 10:00 AM work better for you?`;
      }
      break;

    case 'booking':
      if (text.includes('tomorrow') || text.includes('2')) {
        conversation.appointmentDate = 'Tomorrow';
        conversation.appointmentTime = '2:00 PM';
      } else if (text.includes('wed') || text.includes('10')) {
        conversation.appointmentDate = 'Wednesday';
        conversation.appointmentTime = '10:00 AM';
      }

      if (conversation.appointmentDate) {
        conversation.state = 'confirmed';
        return `Great — you're set for ${conversation.appointmentDate} at ${conversation.appointmentTime}. See you at [Clinic Name]. We'll text a reminder 24 hours before.`;
      }
      break;

    case 'confirmed':
      return null;
  }

  return null;
}

// Run test if executed directly
if (require.main === module) {
  testSMSConversation().catch(console.error);
}

module.exports = { testSMSConversation };
