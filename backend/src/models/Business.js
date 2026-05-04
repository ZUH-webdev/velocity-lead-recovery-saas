/**
 * Business model - stores company information and settings
 */
const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    industry: { type: String },
    website: { type: String },
    phone: { type: String, index: true },
    address: { type: String },
    services: [
      {
        name: String,
        durationMinutes: Number,
        priceCents: Number
      }
    ],
    settings: {
      timezone: { type: String, default: 'UTC' },
      locale: { type: String, default: 'en' }
    },
    chatbot: {
      enabled: { type: Boolean, default: false },
      config: { type: mongoose.Schema.Types.Mixed }
    },
    integrations: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

BusinessSchema.index({ name: 1 });

module.exports = mongoose.model('Business', BusinessSchema);
