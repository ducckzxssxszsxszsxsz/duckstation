const router = require('express').Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// ── GET /api/users (admin) ──
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { telegram: { $regex: search, $options: 'i' } }] } : {};
    const users = await User.find(filter).select('-password').sort('-createdAt');
    res.json({ success: true, count: users.length, users });
  } catch (err) { next(err); }
});

// ── GET /api/users/:id (admin) ──
router.get('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) { next(err); }
});

// ── PUT /api/users/:id (admin) ──
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const { name, telegram, experience, status, discordRole, progress } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (name !== undefined) user.name = name;
    if (telegram !== undefined) user.telegram = telegram;
    if (experience !== undefined) user.experience = experience;
    if (status !== undefined) user.status = status;
    if (discordRole !== undefined) user.discordRole = discordRole;
    if (progress !== undefined) user.progress = progress;
    await user.save();
    res.json({ success: true, user });
  } catch (err) { next(err); }
});

// ── PUT /api/users/profile (user update own profile) ──
router.put('/profile', protect, async (req, res, next) => {
  try {
    const { telegram, experience } = req.body;
    if (telegram !== undefined) req.user.telegram = telegram;
    if (experience !== undefined) req.user.experience = experience;
    await req.user.save();
    res.json({ success: true, user: req.user });
  } catch (err) { next(err); }
});

// ── DELETE /api/users/:id (admin) ──
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
