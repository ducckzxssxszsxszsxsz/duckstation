const mongoose = require('mongoose');

const broadcastSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  body:     { type: String, default: '' },
  type:     { type: String, enum: ['signal', 'content', 'reminder'], default: 'signal' },
  target:   { type: String, default: 'all' }, // 'all', 'batch5', 'batch6'
  reach:    { type: Number, default: 0 },
  sentAt:   { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Broadcast', broadcastSchema);
