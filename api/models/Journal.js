const mongoose = require('mongoose');

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

const accountSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:          { type: String, required: true },
  type:          { type: String, enum: ['personal', 'funded', 'custom'], default: 'personal' },
  balance:       { type: Number, default: 5000 },
  currentBalance:{ type: Number, default: 5000 },
  currency:      { type: String, default: 'USD' },
  broker:        { type: String, default: '' },
}, { timestamps: true });

const Journal = mongoose.model('Journal', journalEntrySchema);
const Account = mongoose.model('Account', accountSchema);

module.exports = { Journal, Account };
