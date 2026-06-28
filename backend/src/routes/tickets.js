const router = require('express').Router();
const Ticket = require('../models/Ticket');
const { protect, adminOnly } = require('../middleware/auth');

// ── POST /api/tickets (user create ticket) ──
router.post('/', protect, async (req, res, next) => {
  try {
    const { subject, message } = req.body;
    const ticket = await Ticket.create({
      user: req.user._id,
      subject,
      messages: [{ sender: 'user', text: message, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }],
    });
    res.status(201).json({ success: true, ticket });
  } catch (err) { next(err); }
});

// ── GET /api/tickets/my (user own tickets) ──
router.get('/my', protect, async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id }).sort('-updatedAt');
    res.json({ success: true, tickets });
  } catch (err) { next(err); }
});

// ── GET /api/tickets/:id (user or admin) ──
router.get('/:id', protect, async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('user', 'name email telegram');
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    // User can only see own tickets
    if (req.user.role !== 'admin' && ticket.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    res.json({ success: true, ticket });
  } catch (err) { next(err); }
});

// ── POST /api/tickets/:id/message (user or admin reply) ──
router.post('/:id/message', protect, async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    if (req.user.role !== 'admin' && ticket.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const sender = req.user.role === 'admin' ? 'admin' : 'user';
    ticket.messages.push({
      sender,
      text: req.body.text,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    });
    if (sender === 'admin') ticket.admin = req.user.name;
    ticket.status = sender === 'admin' ? 'open' : 'pending';
    await ticket.save();
    res.json({ success: true, ticket });
  } catch (err) { next(err); }
});

// ── GET /api/tickets (admin — all tickets) ──
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const tickets = await Ticket.find().populate('user', 'name telegram discordTag').sort('-updatedAt');
    res.json({ success: true, tickets });
  } catch (err) { next(err); }
});

// ── PUT /api/tickets/:id/close (admin) ──
router.put('/:id/close', protect, adminOnly, async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    ticket.status = 'closed';
    await ticket.save();
    res.json({ success: true, ticket });
  } catch (err) { next(err); }
});

module.exports = router;
