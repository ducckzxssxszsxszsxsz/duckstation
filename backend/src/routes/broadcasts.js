const router = require('express').Router();
const Broadcast = require('../models/Broadcast');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// ── GET /api/broadcasts (admin — history) ──
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const broadcasts = await Broadcast.find().sort('-sentAt');
    res.json({ success: true, broadcasts });
  } catch (err) { next(err); }
});

// ── POST /api/broadcasts (admin create & send) ──
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const { title, body, type, target } = req.body;

    // Count reach
    let reach = 0;
    if (target === 'all') {
      reach = await User.countDocuments({ status: 'active' });
    } else if (target === 'batch5') {
      reach = await User.countDocuments({ batchName: /Basic/i, status: 'active' });
    } else if (target === 'batch6') {
      reach = await User.countDocuments({ batchName: /Advanced|Pro/i, status: 'active' });
    }

    const broadcast = await Broadcast.create({ title, body, type, target, reach, sentAt: new Date() });
    res.status(201).json({ success: true, broadcast, message: `Broadcast sent to ${reach} users` });
  } catch (err) { next(err); }
});

// ── GET /api/broadcasts/latest (user — get latest broadcasts) ──
router.get('/latest', protect, async (req, res, next) => {
  try {
    const broadcasts = await Broadcast.find().sort('-sentAt').limit(10);
    res.json({ success: true, broadcasts });
  } catch (err) { next(err); }
});

module.exports = router;
