const router = require('express').Router();
const { Booking, BlockedDate, AvailableSlot } = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/auth');

// ── GET /api/bookings/available?date=YYYY-MM-DD ──
router.get('/available', async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ success: false, message: 'Date required' });

    const blocked = await BlockedDate.findOne({ date });
    if (blocked) return res.json({ success: true, available: false, message: 'Date blocked by admin' });

    const booked = await Booking.find({ date, status: { $in: ['pending', 'confirmed'] } });
    const bookedTimes = booked.map(b => b.time);

    // Check admin-configured slots for this date
    const slotConfig = await AvailableSlot.findOne({ date });
    const allSlots = slotConfig ? slotConfig.slots : ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '19:00', '20:00'];

    const slots = allSlots.map(time => ({
      time,
      label: `${time} WIB`,
      available: !bookedTimes.includes(time),
    }));

    res.json({ success: true, available: true, slots, booked: bookedTimes });
  } catch (err) { next(err); }
});

// ── POST /api/bookings (user create booking) ──
router.post('/', protect, async (req, res, next) => {
  try {
    const { date, time } = req.body;

    const blocked = await BlockedDate.findOne({ date });
    if (blocked) return res.status(400).json({ success: false, message: 'Date is blocked' });

    const existing = await Booking.findOne({ date, time, status: { $in: ['pending', 'confirmed'] } });
    if (existing) return res.status(400).json({ success: false, message: 'Time slot already booked' });

    // Max 2 bookings per day globally
    const dayBookings = await Booking.find({ date, status: { $in: ['pending', 'confirmed'] } });
    if (dayBookings.length >= 2) {
      return res.status(400).json({ success: false, message: 'Maximum 2 bookings per day reached' });
    }

    const booking = await Booking.create({ user: req.user._id, date, time });
    res.status(201).json({ success: true, booking });
  } catch (err) { next(err); }
});

// ── GET /api/bookings/my (user own bookings) ──
router.get('/my', protect, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, bookings });
  } catch (err) { next(err); }
});

// ── GET /api/bookings (admin — all bookings) ──
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const { date } = req.query;
    const filter = date ? { date } : {};
    const bookings = await Booking.find(filter).populate('user', 'name telegram discordTag').sort('date time');
    res.json({ success: true, bookings });
  } catch (err) { next(err); }
});

// ── PUT /api/bookings/:id/confirm (admin) ──
router.put('/:id/confirm', protect, adminOnly, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    booking.status = 'confirmed';
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) { next(err); }
});

// ── PUT /api/bookings/:id/cancel (admin) ──
router.put('/:id/cancel', protect, adminOnly, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    booking.status = 'cancelled';
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) { next(err); }
});

// ── PUT /api/bookings/:id/reschedule (admin) ──
router.put('/:id/reschedule', protect, adminOnly, async (req, res, next) => {
  try {
    const { date, time } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    booking.date = date;
    booking.time = time;
    booking.status = 'pending';
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) { next(err); }
});

// ── POST /api/bookings/block-date (admin) ──
router.post('/block-date', protect, adminOnly, async (req, res, next) => {
  try {
    const { date, note } = req.body;
    const exists = await BlockedDate.findOne({ date });
    if (exists) return res.status(400).json({ success: false, message: 'Date already blocked' });
    const blocked = await BlockedDate.create({ date, note });
    res.status(201).json({ success: true, blocked });
  } catch (err) { next(err); }
});

// ── DELETE /api/bookings/block-date/:date (admin unblock) ──
router.delete('/block-date/:date', protect, adminOnly, async (req, res, next) => {
  try {
    await BlockedDate.findOneAndDelete({ date: req.params.date });
    res.json({ success: true, message: 'Date unblocked' });
  } catch (err) { next(err); }
});

// ── GET /api/bookings/slots?date=YYYY-MM-DD (admin get configured slots) ──
router.get('/slots', protect, adminOnly, async (req, res, next) => {
  try {
    const { date } = req.query;
    if (date) {
      const config = await AvailableSlot.findOne({ date });
      return res.json({ success: true, date, slots: config ? config.slots : [] });
    }
    // Return all configs
    const all = await AvailableSlot.find();
    res.json({ success: true, configs: all });
  } catch (err) { next(err); }
});

// ── PUT /api/bookings/slots (admin set available slots for a date) ──
router.put('/slots', protect, adminOnly, async (req, res, next) => {
  try {
    const { date, slots } = req.body;
    if (!date || !Array.isArray(slots)) {
      return res.status(400).json({ success: false, message: 'Date and slots array required' });
    }
    const config = await AvailableSlot.findOneAndUpdate(
      { date },
      { slots },
      { upsert: true, new: true }
    );
    res.json({ success: true, config });
  } catch (err) { next(err); }
});

module.exports = router;
