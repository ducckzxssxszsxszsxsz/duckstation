const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

try { dotenv.config({ path: path.join(__dirname, '..', '.env') }); } catch(e) {}

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174', 'https://duckstation-ten.vercel.app'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Lazy connect MongoDB on first request
let dbConnected = false;
app.use(async (req, res, next) => {
  if (!dbConnected && process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      dbConnected = true;
      console.log('MongoDB connected');
    } catch (err) {
      console.error('MongoDB connection error:', err.message);
    }
  }
  next();
});

// Auth routes inline (avoid require issues on Vercel)
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Batch = require('./models/Batch');
const Order = require('./models/Order');
const Module = require('./models/Module');
const { Quiz, QuizAttempt } = require('./models/Quiz');
const { Booking, BlockedDate, AvailableSlot } = require('./models/Booking');
const Ticket = require('./models/Ticket');
const Broadcast = require('./models/Broadcast');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
    next();
  } catch { return res.status(401).json({ success: false, message: 'Invalid token' }); }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ success: false, message: 'Admin only' });
};

// ─── AUTH ───
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'All fields required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });
    const user = await User.create({ name, email, password, provider: 'local' });
    res.status(201).json({ success: true, token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || user.password !== password) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    res.json({ success: true, token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ── Google OAuth Redirect ──
app.get('/api/auth/google', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${FRONTEND_URL}/api/auth/google/callback`;
  const scope = 'email profile';
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline`;
  res.redirect(url);
});

// ── Google OAuth Callback ──
app.get('/api/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.redirect(`${FRONTEND_URL}/?error=no_code`);

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${FRONTEND_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.id_token) return res.redirect(`${FRONTEND_URL}/?error=token_exchange_failed`);

    // Decode ID token
    const payload = JSON.parse(Buffer.from(tokenData.id_token.split('.')[1], 'base64').toString());
    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ providerId: sub });
    if (!user) {
      user = await User.findOne({ email });
      if (user) { user.providerId = sub; user.provider = 'google'; user.avatar = picture || ''; await user.save(); }
      else { user = await User.create({ name, email, avatar: picture || '', provider: 'google', providerId: sub, password: 'google_' + sub }); }
    }

    const jwtToken = generateToken(user._id);
    res.redirect(`${FRONTEND_URL}/auth-callback?token=${jwtToken}&provider=google`);
  } catch (e) {
    res.redirect(`${FRONTEND_URL}/?error=${encodeURIComponent(e.message)}`);
  }
});

// ── Google Verify (manual from GIS) ──
app.post('/api/auth/google/verify', async (req, res) => {
  try {
    const { credential } = req.body;
    const payload = JSON.parse(Buffer.from(credential.split('.')[1], 'base64').toString());
    const { email, name, picture, sub } = payload;
    let user = await User.findOne({ providerId: sub });
    if (!user) {
      user = await User.findOne({ email });
      if (user) { user.providerId = sub; user.provider = 'google'; user.avatar = picture || ''; await user.save(); }
      else { user = await User.create({ name, email, avatar: picture || '', provider: 'google', providerId: sub, password: 'google_' + sub }); }
    }
    res.json({ success: true, token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.get('/api/auth/me', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

// ─── USERS ───
app.get('/api/users', protect, adminOnly, async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { telegram: { $regex: search, $options: 'i' } }] } : {};
    const users = await User.find(filter).select('-password').sort('-createdAt');
    res.json({ success: true, count: users.length, users });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.get('/api/users/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, user });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.put('/api/users/profile', protect, async (req, res) => {
  try {
    const { telegram, experience } = req.body;
    if (telegram !== undefined) req.user.telegram = telegram;
    if (experience !== undefined) req.user.experience = experience;
    await req.user.save();
    res.json({ success: true, user: req.user });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ─── BATCHES ───
app.get('/api/batches', async (req, res) => {
  try { res.json({ success: true, batches: await Batch.find().sort('-createdAt') }); } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.post('/api/batches', protect, adminOnly, async (req, res) => {
  try { res.status(201).json({ success: true, batch: await Batch.create(req.body) }); } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.put('/api/batches/:id', protect, adminOnly, async (req, res) => {
  try { const b = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json({ success: true, batch: b }); } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.delete('/api/batches/:id', protect, adminOnly, async (req, res) => {
  try { await Batch.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ─── ORDERS ───
app.post('/api/orders', protect, async (req, res) => {
  try {
    const { batchId, method, telegram, fullName, email, discordTag } = req.body;
    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
    if (telegram) req.user.telegram = telegram;
    if (fullName) req.user.name = fullName;
    if (email) req.user.email = email;
    if (discordTag) req.user.discordTag = discordTag;
    req.user.batch = batch._id; req.user.batchName = batch.name;
    await req.user.save();
    const order = await Order.create({ user: req.user._id, batch: batch._id, batchName: batch.name, method, amount: batch.priceIdr });
    res.status(201).json({ success: true, order });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.get('/api/orders', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    const orders = await Order.find(filter).populate('user', 'name email telegram discordTag').sort('-createdAt');
    res.json({ success: true, count: orders.length, orders });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.put('/api/orders/:id/approve', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('batch');
    if (!order) return res.status(404).json({ success: false, message: 'Not found' });
    order.status = 'approved'; await order.save();
    const user = await User.findById(order.user);
    if (user) { user.status = 'active'; if (order.batch) user.discordRole = order.batch.discordRole; await user.save(); }
    res.json({ success: true, order });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.put('/api/orders/:id/reject', protect, adminOnly, async (req, res) => {
  try { const o = await Order.findByIdAndUpdate(req.params.id, { status: 'rejected', note: req.body.note || '' }, { new: true }); res.json({ success: true, order: o }); } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ─── MODULES ───
app.get('/api/modules', async (req, res) => {
  try { res.json({ success: true, modules: await Module.find({ status: 'published' }).sort('order') }); } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.get('/api/modules/all', protect, adminOnly, async (req, res) => {
  try { res.json({ success: true, modules: await Module.find().sort('order') }); } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.post('/api/modules', protect, adminOnly, async (req, res) => {
  try { res.status(201).json({ success: true, module: await Module.create(req.body) }); } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.put('/api/modules/:id', protect, adminOnly, async (req, res) => {
  try { const m = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json({ success: true, module: m }); } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.delete('/api/modules/:id', protect, adminOnly, async (req, res) => {
  try { await Module.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ─── QUIZZES ───
app.get('/api/quizzes', protect, adminOnly, async (req, res) => {
  try { res.json({ success: true, quizzes: await Quiz.find().sort('-createdAt') }); } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.get('/api/quizzes/active', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ status: 'published' }).sort('-createdAt');
    if (!quiz) return res.status(404).json({ success: false, message: 'No active quiz' });
    const safe = { ...quiz.toObject(), questions: quiz.questions.map(q => ({ question: q.question, options: q.options })) };
    res.json({ success: true, quiz: safe });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.get('/api/quizzes/my-attempts', protect, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ user: req.user._id }).sort('-createdAt');
    const quiz = await Quiz.findOne({ status: 'published' }).sort('-createdAt');
    res.json({
      success: true, attempts: attempts.length, maxAttempts: quiz?.maxAttempts || 3, minScore: quiz?.minScore || 70,
      passed: attempts.some(a => a.passed), lastScore: attempts.length > 0 ? attempts[0].score : 0,
    });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.post('/api/quizzes/submit', protect, async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    const userAttempts = await QuizAttempt.find({ user: req.user._id, quiz: quizId });
    if (userAttempts.length >= quiz.maxAttempts) return res.status(400).json({ success: false, message: 'Max attempts reached', resetRequired: true });
    if (userAttempts.some(a => a.passed)) return res.status(400).json({ success: false, message: 'Already passed' });
    let correct = 0;
    const graded = answers.map(a => { const q = quiz.questions[a.questionIdx]; const ok = q ? a.selectedIdx === q.correctIdx : false; if (ok) correct++; return { questionIdx: a.questionIdx, selectedIdx: a.selectedIdx, correct: ok }; });
    const score = Math.round((correct / quiz.questions.length) * 100);
    const passed = score >= quiz.minScore;
    const attemptNum = userAttempts.length + 1;
    await QuizAttempt.create({ user: req.user._id, quiz: quizId, attempt: attemptNum, score, answers: graded, passed });
    req.user.quizAttempts = attemptNum; req.user.quizScore = score; req.user.quizPassed = passed;
    await req.user.save();
    res.json({ success: true, attempt: { attempt: attemptNum, score, passed, minScore: quiz.minScore } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ─── BOOKINGS ───
app.get('/api/bookings/available', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ success: false, message: 'Date required' });
    const blocked = await BlockedDate.findOne({ date });
    if (blocked) return res.json({ success: true, available: false });
    const booked = await Booking.find({ date, status: { $in: ['pending', 'confirmed'] } }).select('time');
    const bookedTimes = booked.map(b => b.time);
    const allSlots = ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '19:00', '20:00'];
    res.json({ success: true, available: true, slots: allSlots.map(t => ({ time: t, label: `${t} WIB`, available: !bookedTimes.includes(t) })), booked: bookedTimes });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.post('/api/bookings', protect, async (req, res) => {
  try {
    const { date, time } = req.body;
    const blocked = await BlockedDate.findOne({ date });
    if (blocked) return res.status(400).json({ success: false, message: 'Date blocked' });
    const existing = await Booking.findOne({ date, time, status: { $in: ['pending', 'confirmed'] } });
    if (existing) return res.status(400).json({ success: false, message: 'Slot taken' });
    const dayBookings = await Booking.find({ date, status: { $in: ['pending', 'confirmed'] } });
    if (dayBookings.length >= 2) return res.status(400).json({ success: false, message: 'Max 2 per day' });
    const booking = await Booking.create({ user: req.user._id, date, time });
    res.status(201).json({ success: true, booking });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.get('/api/bookings/my', protect, async (req, res) => {
  try { res.json({ success: true, bookings: await Booking.find({ user: req.user._id }).sort('-createdAt') }); } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.get('/api/bookings', protect, adminOnly, async (req, res) => {
  try { const f = req.query.date ? { date: req.query.date } : {}; res.json({ success: true, bookings: await Booking.find(f).populate('user', 'name telegram discordTag').sort('date time') }); } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.put('/api/bookings/:id/confirm', protect, adminOnly, async (req, res) => {
  try { const b = await Booking.findByIdAndUpdate(req.params.id, { status: 'confirmed' }, { new: true }); res.json({ success: true, booking: b }); } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.put('/api/bookings/:id/cancel', protect, adminOnly, async (req, res) => {
  try { const b = await Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true }); res.json({ success: true, booking: b }); } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.post('/api/bookings/block-date', protect, adminOnly, async (req, res) => {
  try { const b = await BlockedDate.create({ date: req.body.date, note: req.body.note }); res.status(201).json({ success: true, blocked: b }); } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ─── TICKETS ───
app.post('/api/tickets', protect, async (req, res) => {
  try {
    const { subject, message } = req.body;
    const ticket = await Ticket.create({ user: req.user._id, subject, messages: [{ sender: 'user', text: message, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }] });
    res.status(201).json({ success: true, ticket });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.get('/api/tickets/my', protect, async (req, res) => {
  try { res.json({ success: true, tickets: await Ticket.find({ user: req.user._id }).sort('-updatedAt') }); } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.get('/api/tickets', protect, adminOnly, async (req, res) => {
  try { res.json({ success: true, tickets: await Ticket.find().populate('user', 'name telegram discordTag').sort('-updatedAt') }); } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.get('/api/tickets/:id', protect, async (req, res) => {
  try {
    const t = await Ticket.findById(req.params.id).populate('user', 'name email telegram');
    if (!t) return res.status(404).json({ success: false, message: 'Not found' });
    if (req.user.role !== 'admin' && t.user._id.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Denied' });
    res.json({ success: true, ticket: t });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.post('/api/tickets/:id/message', protect, async (req, res) => {
  try {
    const t = await Ticket.findById(req.params.id);
    if (!t) return res.status(404).json({ success: false, message: 'Not found' });
    const sender = req.user.role === 'admin' ? 'admin' : 'user';
    t.messages.push({ sender, text: req.body.text, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) });
    if (sender === 'admin') t.admin = req.user.name;
    t.status = sender === 'admin' ? 'open' : 'pending';
    await t.save();
    res.json({ success: true, ticket: t });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.put('/api/tickets/:id/close', protect, adminOnly, async (req, res) => {
  try { const t = await Ticket.findByIdAndUpdate(req.params.id, { status: 'closed' }, { new: true }); res.json({ success: true, ticket: t }); } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ─── BROADCASTS ───
app.get('/api/broadcasts', protect, adminOnly, async (req, res) => {
  try { res.json({ success: true, broadcasts: await Broadcast.find().sort('-sentAt') }); } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.post('/api/broadcasts', protect, adminOnly, async (req, res) => {
  try {
    const { title, body, type, target } = req.body;
    let reach = 0;
    if (target === 'all') reach = await User.countDocuments({ status: 'active' });
    else if (target === 'batch5') reach = await User.countDocuments({ batchName: /Basic/i, status: 'active' });
    else if (target === 'batch6') reach = await User.countDocuments({ batchName: /Advanced|Pro/i, status: 'active' });
    const b = await Broadcast.create({ title, body, type, target, reach, sentAt: new Date() });
    res.status(201).json({ success: true, broadcast: b });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// --- BOOKING SLOTS (admin configure available hours) ---
app.get('/api/bookings/slots', protect, adminOnly, async (req, res) => {
  try {
    const { date } = req.query;
    if (date) {
      const config = await AvailableSlot.findOne({ date });
      return res.json({ success: true, date, slots: config ? config.slots : [] });
    }
    const all = await AvailableSlot.find();
    res.json({ success: true, configs: all });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.put('/api/bookings/slots', protect, adminOnly, async (req, res) => {
  try {
    const { date, slots } = req.body;
    if (!date || !Array.isArray(slots)) return res.status(400).json({ success: false, message: 'Date and slots array required' });
    const config = await AvailableSlot.findOneAndUpdate({ date }, { slots }, { upsert: true, new: true });
    res.json({ success: true, config });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// --- BROADCASTS (user) ---
app.get('/api/broadcasts/latest', protect, async (req, res) => {
  try { res.json({ success: true, broadcasts: await Broadcast.find().sort('-sentAt').limit(10) }); } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// --- UNBLOCK DATE ---
app.delete('/api/bookings/block-date/:date', protect, adminOnly, async (req, res) => {
  try {
    await BlockedDate.findOneAndDelete({ date: req.params.date });
    res.json({ success: true, message: 'Date unblocked' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// --- RESCHEDULE BOOKING (admin) ---
app.put('/api/bookings/:id/reschedule', protect, adminOnly, async (req, res) => {
  try {
    const { date, time } = req.body;
    const b = await Booking.findByIdAndUpdate(req.params.id, { date, time, status: 'pending' }, { new: true });
    if (!b) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, booking: b });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// --- ADMIN CLEANUP (reset all data except admin) ---
app.get('/api/admin/cleanup', protect, adminOnly, async (req, res) => {
  try {
    await User.deleteMany({ role: { $ne: 'admin' } });
    await Order.deleteMany({});
    await Ticket.deleteMany({});
    await Booking.deleteMany({});
    await BlockedDate.deleteMany({});
    await Broadcast.deleteMany({});
    res.json({ success: true, message: 'All data cleared except admin' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ─── HEALTH ───
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }));

module.exports = app;
