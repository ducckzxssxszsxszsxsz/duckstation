const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender:   { type: String, enum: ['user', 'admin'], required: true },
  text:     { type: String, required: true },
  time:     { type: String, default: '' },
});

const ticketSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject:  { type: String, required: true, trim: true },
  status:   { type: String, enum: ['open', 'pending', 'closed'], default: 'open' },
  admin:    { type: String, default: '' },
  messages: [messageSchema],
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
