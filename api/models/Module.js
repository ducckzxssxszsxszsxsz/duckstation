const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  type:        { type: String, enum: ['text', 'image'], required: true },
  content:     { type: String, default: '' }, // text content
  imageUrl:    { type: String, default: '' }, // image URL
  description: { type: String, default: '' }, // description for images
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

module.exports = mongoose.model('Module', moduleSchema);
