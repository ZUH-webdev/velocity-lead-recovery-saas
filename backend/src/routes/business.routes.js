/**
 * Business-related routes
 */
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const Business = require('../models/Business');

// GET /api/business/:id - get business
router.get('/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const business = await Business.findById(id);
    if (!business) return res.status(404).json({ error: 'Business not found', code: 'NOT_FOUND' });
    // ownership check - simple: user.businessId must match
    if (req.user.businessId && req.user.businessId.toString() !== id) return res.status(403).json({ error: 'Forbidden', code: 'FORBIDDEN' });
    res.json({ success: true, data: business });
  } catch (err) {
    next(err);
  }
});

// PUT /api/business/:id/settings - update settings
router.put('/:id/settings', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.businessId && req.user.businessId.toString() !== id) return res.status(403).json({ error: 'Forbidden', code: 'FORBIDDEN' });
    const updates = req.body;
    const business = await Business.findByIdAndUpdate(id, { $set: { settings: updates } }, { new: true, runValidators: true });
    if (!business) return res.status(404).json({ error: 'Business not found', code: 'NOT_FOUND' });
    res.json({ success: true, data: business });
  } catch (err) {
    next(err);
  }
});

// POST /api/business/:id/services - add a service
router.post('/:id/services', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.businessId && req.user.businessId.toString() !== id) return res.status(403).json({ error: 'Forbidden', code: 'FORBIDDEN' });
    const { name, durationMinutes, priceCents } = req.body;
    if (!name) return res.status(400).json({ error: 'Service name required', code: 'BAD_REQUEST' });
    const business = await Business.findById(id);
    if (!business) return res.status(404).json({ error: 'Business not found', code: 'NOT_FOUND' });
    business.services.push({ name, durationMinutes, priceCents });
    await business.save();
    res.json({ success: true, data: business.services });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
