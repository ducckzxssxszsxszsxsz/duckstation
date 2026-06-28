const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:    { type: String, required: true },  // YYYY-MM-DD
  time:    { type: String, required: true },  // HH:00
  status:  { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  note:    { type: String, default: '' },
}, { timestamps: true });

// Blocked dates by admin
const blockedDateSchema = new mongoose.Schema({
  date:  { type: String, required: true, unique: true },
  note:  { type: String, default: '' },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
const BlockedDate = mongoose.model('BlockedDate', blockedDateSchema);

// Available time slots configured by admin per date
const availableSlotSchema = new mongoose.Schema({
  date:  { type: String, required: true, unique: true },
  slots: [{ type: String }],
}, { timestamps: true });

const AvailableSlot = mongoose.model('AvailableSlot', availableSlotSchema);

module.exports = { Booking, BlockedDate, AvailableSlot };
