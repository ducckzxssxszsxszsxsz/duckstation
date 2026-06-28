const mongoose = require('mongoose');

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
}, { timestamps: true });

module.exports = mongoose.model('Batch', batchSchema);
