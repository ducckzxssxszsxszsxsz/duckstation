const mongoose = require('mongoose');

// ─── User ───
const userSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:     { type: String, select: false },
  avatar:       { type: String, default: '' },
  role:         { type: String, enum: ['guest', 'user', 'admin'], default: 'guest' },
  roleExpiry:    { type: Date, default: null },
  roleGrantedAt: { type: Date, default: null },
  status:       { type: String, enum: ['active', 'inactive', 'banned'], default: 'active' },
  provider:     { type: String, enum: ['google', 'discord', 'local'], default: 'local' },
  providerId:   { type: String, default: '' },
  discordId:    { type: String, default: '' },
  discordTag:   { type: String, default: '' },
  discordRole:  { type: String, default: '' },
  telegram:     { type: String, default: '' },
  experience:   { type: String, default: '' },
  batch:        { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', default: null },
  batchName:    { type: String, default: '' },
  progress:     { type: Number, default: 0 },
  quizPassed:   { type: Boolean, default: false },
  quizScore:    { type: Number, default: 0 },
  quizAttempts: { type: Number, default: 0 },
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

// ─── Batch ───
const batchSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  tier:        { type: String, enum: ['Starter', 'Pro'], default: 'Starter' },
  description: { type: String, default: '' },
  priceIdr:    { type: String, required: true },
  priceUsdt:   { type: String, required: true },
  discordRole: { type: String, required: true },
  role:        { type: String, default: '' },
  status:      { type: String, enum: ['open', 'closed'], default: 'open' },
  features:    [{ type: String }],
  members:     { type: Number, default: 0 },
  durationDays: { type: Number, default: 30 },
}, { timestamps: true });
const Batch = mongoose.model('Batch', batchSchema);

// ─── Booking ───
const bookingSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:    { type: String, required: true },
  time:    { type: String, required: true },
  status:  { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  note:    { type: String, default: '' },
}, { timestamps: true });
const Booking = mongoose.model('Booking', bookingSchema);

// ─── BlockedDate ───
const blockedDateSchema = new mongoose.Schema({
  date:  { type: String, required: true, unique: true },
  note:  { type: String, default: '' },
}, { timestamps: true });
const BlockedDate = mongoose.model('BlockedDate', blockedDateSchema);

// ─── AvailableSlot ───
const availableSlotSchema = new mongoose.Schema({
  date:  { type: String, required: true, unique: true },
  slots: [{ type: String }],
}, { timestamps: true });
const AvailableSlot = mongoose.model('AvailableSlot', availableSlotSchema);

// ─── Module ───
const stepSchema = new mongoose.Schema({
  type:        { type: String, enum: ['text', 'image'], required: true },
  content:     { type: String, default: '' },
  imageUrl:    { type: String, default: '' },
  description: { type: String, default: '' },
  order:       { type: Number, default: 0 },
});
const lessonSchema = new mongoose.Schema({
  title:  { type: String, required: true, trim: true },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  steps:  [stepSchema],
  order:  { type: Number, default: 0 },
});
const moduleSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  batch:    { type: String, default: 'Semua Batch' },
  status:   { type: String, enum: ['draft', 'published'], default: 'draft' },
  free:     { type: Boolean, default: false },
  roles:    [{ type: String }],
  lessons:  [lessonSchema],
  order:    { type: Number, default: 0 },
}, { timestamps: true });
const Module = mongoose.model('Module', moduleSchema);

// ─── Order ───
const orderSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  batch:     { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  batchName: { type: String, required: true },
  method:    { type: String, enum: ['QRIS', 'Transfer', 'E-Wallet'], required: true },
  status:    { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  amount:    { type: String, default: '' },
  proofUrl:  { type: String, default: '' },
  note:      { type: String, default: '' },
}, { timestamps: true });
const Order = mongoose.model('Order', orderSchema);

// ─── Quiz ───
const questionSchema = new mongoose.Schema({
  question:   { type: String, required: true },
  options:    [{ type: String, required: true }],
  correctIdx: { type: Number, required: true },
  explanation:{ type: String, default: '' },
});
const quizSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  module:      { type: mongoose.Schema.Types.ObjectId, ref: 'Module', default: null },
  minScore:    { type: Number, default: 70 },
  maxAttempts: { type: Number, default: 3 },
  questions:   [questionSchema],
  status:      { type: String, enum: ['draft', 'published'], default: 'draft' },
}, { timestamps: true });
const Quiz = mongoose.model('Quiz', quizSchema);

// ─── QuizAttempt ───
const quizAttemptSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz:      { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  attempt:   { type: Number, required: true },
  score:     { type: Number, required: true },
  answers:   [{ questionIdx: Number, selectedIdx: Number, correct: Boolean }],
  passed:    { type: Boolean, default: false },
}, { timestamps: true });
const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

// ─── Ticket ───
const ticketMessageSchema = new mongoose.Schema({
  sender:   { type: String, enum: ['user', 'admin'], required: true },
  text:     { type: String, required: true },
  time:     { type: String, default: '' },
});
const ticketSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject:  { type: String, required: true, trim: true },
  status:   { type: String, enum: ['open', 'pending', 'closed'], default: 'open' },
  admin:    { type: String, default: '' },
  messages: [ticketMessageSchema],
}, { timestamps: true });
const Ticket = mongoose.model('Ticket', ticketSchema);

// ─── Broadcast ───
const broadcastSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  body:     { type: String, default: '' },
  type:     { type: String, enum: ['signal', 'content', 'reminder'], default: 'signal' },
  target:   { type: String, default: 'all' },
  reach:    { type: Number, default: 0 },
  sentAt:   { type: Date, default: Date.now },
}, { timestamps: true });
const Broadcast = mongoose.model('Broadcast', broadcastSchema);

// ─── Journal ───
const journalEntrySchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  date:      { type: Date, required: true },
  pair:      { type: String, required: true },
  timeframe: { type: String, default: 'H1' },
  direction: { type: String, enum: ['buy', 'sell'], required: true },
  entryPrice:  { type: Number },
  exitPrice:   { type: Number },
  risk:        { type: Number, default: 0 },
  pnl:         { type: Number, default: 0 },
  reason:      { type: String, default: '' },
  notes:       { type: String, default: '' },
  images:      [{ type: String }],
  result:      { type: String, enum: ['win', 'loss', 'breakeven', 'pending'], default: 'pending' },
}, { timestamps: true });
const Journal = mongoose.model('Journal', journalEntrySchema);

// ─── Account ───
const accountSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:          { type: String, required: true },
  type:          { type: String, enum: ['personal', 'funded', 'custom'], default: 'personal' },
  balance:       { type: Number, default: 5000 },
  currentBalance:{ type: Number, default: 5000 },
  currency:      { type: String, default: 'USD' },
  broker:        { type: String, default: '' },
}, { timestamps: true });
const Account = mongoose.model('Account', accountSchema);

// ─── Message ───
const messageSchema = new mongoose.Schema({
  from:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  body:    { type: String, required: true },
  read:    { type: Boolean, default: false },
}, { timestamps: true });
const Message = mongoose.model('Message', messageSchema);

// ─── Notification ───
const notificationSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:   { type: String, required: true },
  message: { type: String, required: true },
  type:    { type: String, enum: ['booking', 'order', 'broadcast', 'system', 'role'], default: 'system' },
  read:    { type: Boolean, default: false },
  link:    { type: String, default: '' },
}, { timestamps: true });
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = { User, Batch, Booking, BlockedDate, AvailableSlot, Module, Order, Quiz, QuizAttempt, Ticket, Broadcast, Journal, Account, Message, Notification };
