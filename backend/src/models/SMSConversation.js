/**
 * SMSConversation Model
 * Stores SMS conversation history and qualification state
 */
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['lead', 'velocity'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const smsConversationSchema = new mongoose.Schema(
  {
    // Lead info
    leadPhoneNumber: { type: String, required: true, unique: true },
    leadName: String,

    // Business context
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },

    // Conversation state
    state: {
      type: String,
      enum: ['greeting', 'qualification', 'booking', 'confirmed', 'escalated', 'closed'],
      default: 'greeting'
    },

    // Qualification data
    visitReason: String,
    isNewPatient: Boolean,
    urgency: { type: String, enum: ['routine', 'urgent', 'emergency'] },
    hasInsurance: Boolean,
    timePreference: { type: String, enum: ['morning', 'afternoon', 'any'] },

    // Booking data
    appointmentDate: Date,
    appointmentTime: String,

    // Conversation
    messages: [messageSchema],

    // Flags
    isEmergency: { type: Boolean, default: false },
    isEscalated: { type: Boolean, default: false },
    escalationReason: String,
    escalatedToTeamMemberId: mongoose.Schema.Types.ObjectId,

    // Metadata
    initiationMethod: { type: String, enum: ['missed_call', 'form_submit', 'manual'] },
    source: String,
    lastMessageAt: { type: Date, default: Date.now },
    closedAt: Date,
    closedReason: String
  },
  { timestamps: true }
);

// Index for quick lookup
smsConversationSchema.index({ leadPhoneNumber: 1, businessId: 1 });
smsConversationSchema.index({ state: 1, updatedAt: -1 });

module.exports = mongoose.model('SMSConversation', smsConversationSchema);
