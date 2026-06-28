const mongoose = require('mongoose');

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

// User quiz attempt record
const quizAttemptSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz:      { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  attempt:   { type: Number, required: true },
  score:     { type: Number, required: true },
  answers:   [{ questionIdx: Number, selectedIdx: Number, correct: Boolean }],
  passed:    { type: Boolean, default: false },
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);
const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

module.exports = { Quiz, QuizAttempt };
