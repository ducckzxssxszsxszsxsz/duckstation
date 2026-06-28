const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:     { type: String, select: false },
  avatar:       { type: String, default: '' },
  role:         { type: String, enum: ['guest', 'user', 'admin'], default: 'guest' },
  status:       { type: String, enum: ['active', 'inactive', 'banned'], default: 'active' },

  // Auth provider
  provider:     { type: String, enum: ['google', 'discord', 'local'], default: 'local' },
  providerId:   { type: String, default: '' },

  // Discord binding
  discordId:    { type: String, default: '' },
  discordTag:   { type: String, default: '' },
  discordRole:  { type: String, default: '' }, // 'Student', 'Pro Trader'

  // Profile
  telegram:     { type: String, default: '' },
  experience:   { type: String, default: '' },

  // Batch enrollment
  batch:        { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', default: null },
  batchName:    { type: String, default: '' },

  // Progress
  progress:     { type: Number, default: 0 },  // percentage
  quizPassed:   { type: Boolean, default: false },
  quizScore:    { type: Number, default: 0 },
  quizAttempts: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
