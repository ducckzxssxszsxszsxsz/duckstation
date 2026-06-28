const mongoose = require('mongoose');

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

module.exports = mongoose.model('Order', orderSchema);
