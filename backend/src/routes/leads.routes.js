/**
 * Lead routes
 */
const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const auth = require('../middleware/auth.middleware');
const { isEmailValid, isPhoneValid } = require('../utils/validators');

/**
 * POST /api/leads - public, for widget embed
 */
router.post('/', async (req, res, next) => {
  try {
    const { businessId, firstName, lastName, email, phone, source } = req.body;
    if (!businessId) return res.status(400).json({ error: 'Missing businessId', code: 'BAD_REQUEST' });
    if (email && !isEmailValid(email)) return res.status(400).json({ error: 'Invalid email', code: 'INVALID_EMAIL' });
    if (phone && !isPhoneValid(phone)) return res.status(400).json({ error: 'Invalid phone', code: 'INVALID_PHONE' });

    const lead = new Lead({ businessId, firstName, lastName, email, phone, source });
    // Basic scoring
    lead.score = computeScore(lead);
    lead.scoreHistory.push({ score: lead.score, reason: 'initial' });
    await lead.save();
    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/leads/:businessId - list leads (protected)
 */
router.get('/:businessId', auth, async (req, res, next) => {
  try {
    const { businessId } = req.params;
    if (req.user.businessId && req.user.businessId.toString() !== businessId) return res.status(403).json({ error: 'Forbidden', code: 'FORBIDDEN' });

    const { page = 1, limit = 20, status, minScore } = req.query;
    const query = { businessId };
    if (status) query.status = status;
    if (minScore) query.score = { $gte: Number(minScore) };

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort({ score: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: leads, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/leads/:businessId/:leadId - get single lead
 */
router.get('/:businessId/:leadId', auth, async (req, res, next) => {
  try {
    const { businessId, leadId } = req.params;
    if (req.user.businessId && req.user.businessId.toString() !== businessId) return res.status(403).json({ error: 'Forbidden', code: 'FORBIDDEN' });
    const lead = await Lead.findOne({ _id: leadId, businessId });
    if (!lead) return res.status(404).json({ error: 'Lead not found', code: 'NOT_FOUND' });
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/leads/:businessId/:leadId - update lead
 */
router.put('/:businessId/:leadId', auth, async (req, res, next) => {
  try {
    const { businessId, leadId } = req.params;
    if (req.user.businessId && req.user.businessId.toString() !== businessId) return res.status(403).json({ error: 'Forbidden', code: 'FORBIDDEN' });
    const updates = req.body;
    const lead = await Lead.findOneAndUpdate({ _id: leadId, businessId }, { $set: updates }, { new: true, runValidators: true });
    if (!lead) return res.status(404).json({ error: 'Lead not found', code: 'NOT_FOUND' });
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/leads/:businessId/:leadId/score - recalculate and add score
 */
router.post('/:businessId/:leadId/score', auth, async (req, res, next) => {
  try {
    const { businessId, leadId } = req.params;
    if (req.user.businessId && req.user.businessId.toString() !== businessId) return res.status(403).json({ error: 'Forbidden', code: 'FORBIDDEN' });
    const lead = await Lead.findOne({ _id: leadId, businessId });
    if (!lead) return res.status(404).json({ error: 'Lead not found', code: 'NOT_FOUND' });
    const newScore = computeScore(lead, req.body);
    lead.score = newScore;
    lead.scoreHistory.push({ score: newScore, reason: req.body.reason || 'manual' });
    await lead.save();
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
});

/**
 * Basic scoring algorithm: simple heuristic
 */
function computeScore(lead, opts = {}) {
  let score = 0;
  if (lead.email) score += 30;
  if (lead.phone) score += 30;
  if (lead.firstName) score += 10;
  if (lead.lastName) score += 5;
  if (lead.source && lead.source === 'referral') score += 20;
  if (opts.boost) score += Number(opts.boost);
  return Math.min(100, score);
}

module.exports = router;
