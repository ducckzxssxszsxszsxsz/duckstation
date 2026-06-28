const router = require('express').Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Batch = require('../models/Batch');
const { protect, adminOnly } = require('../middleware/auth');

// ── POST /api/orders (user create order) ──
router.post('/', protect, async (req, res, next) => {
  try {
    const { batchId, method, telegram, fullName, email, discordId, discordTag } = req.body;
    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });

    // Update user profile
    if (telegram) req.user.telegram = telegram;
    if (fullName) req.user.name = fullName;
    if (email) req.user.email = email;
    if (discordId) req.user.discordId = discordId;
    if (discordTag) req.user.discordTag = discordTag;
    req.user.batch = batch._id;
    req.user.batchName = batch.name;
    await req.user.save();

    const order = await Order.create({
      user: req.user._id,
      batch: batch._id,
      batchName: batch.name,
      method,
      amount: batch.priceIdr,
    });

    res.status(201).json({ success: true, order });
  } catch (err) { next(err); }
});

// ── GET /api/orders (admin) ──
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    const orders = await Order.find(filter).populate('user', 'name email telegram discordTag').populate('batch', 'name').sort('-createdAt');
    res.json({ success: true, count: orders.length, orders });
  } catch (err) { next(err); }
});

// ── PUT /api/orders/:id/approve (admin) ──
router.put('/:id/approve', protect, adminOnly, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('batch');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.status = 'approved';
    await order.save();

    // Activate user access & assign Discord role
    const user = await User.findById(order.user);
    if (user) {
      user.status = 'active';
      if (order.batch) {
        user.discordRole = order.batch.discordRole;
      }
      await user.save();
    }

    res.json({ success: true, order, message: 'Order approved — user access activated, Discord role assigned' });
  } catch (err) { next(err); }
});

// ── PUT /api/orders/:id/reject (admin) ──
router.put('/:id/reject', protect, adminOnly, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.status = 'rejected';
    order.note = req.body.note || '';
    await order.save();
    res.json({ success: true, order });
  } catch (err) { next(err); }
});

// ── GET /api/orders/my (user own orders) ──
router.get('/my', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, orders });
  } catch (err) { next(err); }
});

module.exports = router;
