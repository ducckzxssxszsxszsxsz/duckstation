const router = require('express').Router();
const Batch = require('../models/Batch');
const { protect, adminOnly } = require('../middleware/auth');

// ── GET /api/batches (public) ──
router.get('/', async (req, res, next) => {
  try {
    const batches = await Batch.find().sort('-createdAt');
    res.json({ success: true, batches });
  } catch (err) { next(err); }
});

// ── GET /api/batches/:id ──
router.get('/:id', async (req, res, next) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
    res.json({ success: true, batch });
  } catch (err) { next(err); }
});

// ── POST /api/batches (admin) ──
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const { name, tier, description, priceIdr, priceUsdt, discordRole, features, status } = req.body;
    const batch = await Batch.create({ name, tier, description, priceIdr, priceUsdt, discordRole, features: features || [], status });
    res.status(201).json({ success: true, batch });
  } catch (err) { next(err); }
});

// ── PUT /api/batches/:id (admin) ──
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
    const { name, tier, description, priceIdr, priceUsdt, discordRole, features, status } = req.body;
    if (name !== undefined) batch.name = name;
    if (tier !== undefined) batch.tier = tier;
    if (description !== undefined) batch.description = description;
    if (priceIdr !== undefined) batch.priceIdr = priceIdr;
    if (priceUsdt !== undefined) batch.priceUsdt = priceUsdt;
    if (discordRole !== undefined) batch.discordRole = discordRole;
    if (features !== undefined) batch.features = features;
    if (status !== undefined) batch.status = status;
    await batch.save();
    res.json({ success: true, batch });
  } catch (err) { next(err); }
});

// ── DELETE /api/batches/:id (admin) ──
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
    res.json({ success: true, message: 'Batch deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
