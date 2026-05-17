/**
 * Lead model - stores lead data and scoring history
 */
const mongoose = require('mongoose');

const ScoreHistorySchema = new mongoose.Schema(
  {
    score: { type: Number, required: true },
    reason: { type: String },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const LeadSchema = new mongoose.Schema(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
    firstName: { type: String, index: true },
    lastName: { type: String },
    email: { type: String, index: true },
    phone: { type: String, index: true },
    source: { type: String, default: 'widget' },
    status: { type: String, enum: ['new', 'contacted', 'qualified', 'lost', 'booked'], default: 'new', index: true },
    score: { type: Number, default: 0, index: true },
    scoreHistory: [ScoreHistorySchema],
    notes: [{ body: String, createdAt: { type: Date, default: Date.now } }],
    appointmentId: { type: String }
  },
  { timestamps: true }
);

LeadSchema.index({ businessId: 1, status: 1, score: -1, createdAt: -1 });

module.exports = mongoose.model('Lead', LeadSchema);
