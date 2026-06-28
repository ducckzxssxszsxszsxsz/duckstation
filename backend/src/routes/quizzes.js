const router = require('express').Router();
const { Quiz, QuizAttempt } = require('../models/Quiz');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// ── GET /api/quizzes (admin — all) ──
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const quizzes = await Quiz.find().sort('-createdAt');
    res.json({ success: true, quizzes });
  } catch (err) { next(err); }
});

// ── GET /api/quizzes/active (user — get active quiz for submission) ──
router.get('/active', protect, async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ status: 'published' }).sort('-createdAt');
    if (!quiz) return res.status(404).json({ success: false, message: 'No active quiz' });
    // Don't send correct answers to client
    const safeQuiz = { ...quiz.toObject(), questions: quiz.questions.map(q => ({ question: q.question, options: q.options })) };
    res.json({ success: true, quiz: safeQuiz });
  } catch (err) { next(err); }
});

// ── GET /api/quizzes/my-attempts (user) ──
router.get('/my-attempts', protect, async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({ user: req.user._id }).sort('-createdAt');
    const quiz = await Quiz.findOne({ status: 'published' }).sort('-createdAt');
    const maxAttempts = quiz ? quiz.maxAttempts : 3;
    const minScore = quiz ? quiz.minScore : 70;
    const passed = attempts.some(a => a.passed);
    const lastScore = attempts.length > 0 ? attempts[0].score : 0;
    res.json({
      success: true,
      attempts: attempts.length,
      maxAttempts,
      minScore,
      passed,
      lastScore,
      history: attempts.map(a => ({ attempt: a.attempt, score: a.score, passed: a.passed, date: a.createdAt })),
    });
  } catch (err) { next(err); }
});

// ── POST /api/quizzes/submit (user submit quiz answers) ──
router.post('/submit', protect, async (req, res, next) => {
  try {
    const { quizId, answers } = req.body; // answers: [{ questionIdx, selectedIdx }]
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    // Check attempts
    const userAttempts = await QuizAttempt.find({ user: req.user._id, quiz: quizId });
    if (userAttempts.length >= quiz.maxAttempts) {
      return res.status(400).json({ success: false, message: 'Max attempts reached', resetRequired: true });
    }

    // Check if already passed
    if (userAttempts.some(a => a.passed)) {
      return res.status(400).json({ success: false, message: 'Quiz already passed' });
    }

    // Grade
    let correct = 0;
    const gradedAnswers = answers.map((a, i) => {
      const q = quiz.questions[a.questionIdx];
      const isCorrect = q ? a.selectedIdx === q.correctIdx : false;
      if (isCorrect) correct++;
      return { questionIdx: a.questionIdx, selectedIdx: a.selectedIdx, correct: isCorrect };
    });

    const score = Math.round((correct / quiz.questions.length) * 100);
    const passed = score >= quiz.minScore;
    const attemptNum = userAttempts.length + 1;

    const attempt = await QuizAttempt.create({
      user: req.user._id,
      quiz: quizId,
      attempt: attemptNum,
      score,
      answers: gradedAnswers,
      passed,
    });

    // Update user
    req.user.quizAttempts = attemptNum;
    req.user.quizScore = score;
    req.user.quizPassed = passed;
    await req.user.save();

    res.json({
      success: true,
      attempt: { attempt: attemptNum, score, passed, minScore: quiz.minScore },
      message: passed ? 'Congratulations! Quiz passed.' : `Score ${score} < minimum ${quiz.minScore}. ${quiz.maxAttempts - attemptNum > 0 ? `Sisa ${quiz.maxAttempts - attemptNum}x percobaan.` : 'Semua progres di-reset.'}`,
    });
  } catch (err) { next(err); }
});

// ── POST /api/quizzes (admin create quiz) ──
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const { title, description, module, minScore, maxAttempts, questions, status } = req.body;
    const quiz = await Quiz.create({ title, description, module, minScore, maxAttempts, questions, status });
    res.status(201).json({ success: true, quiz });
  } catch (err) { next(err); }
});

// ── PUT /api/quizzes/:id (admin update quiz) ──
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    const { title, description, module, minScore, maxAttempts, questions, status } = req.body;
    if (title !== undefined) quiz.title = title;
    if (description !== undefined) quiz.description = description;
    if (module !== undefined) quiz.module = module;
    if (minScore !== undefined) quiz.minScore = minScore;
    if (maxAttempts !== undefined) quiz.maxAttempts = maxAttempts;
    if (questions !== undefined) quiz.questions = questions;
    if (status !== undefined) quiz.status = status;
    await quiz.save();
    res.json({ success: true, quiz });
  } catch (err) { next(err); }
});

// ── DELETE /api/quizzes/:id (admin) ──
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    await QuizAttempt.deleteMany({ quiz: req.params.id });
    res.json({ success: true, message: 'Quiz deleted' });
  } catch (err) { next(err); }
});

// ── POST /api/quizzes/reset-user (admin reset user quiz progress) ──
router.post('/reset-user', protect, adminOnly, async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.quizAttempts = 0;
    user.quizScore = 0;
    user.quizPassed = false;
    user.progress = 0;
    await user.save();
    await QuizAttempt.deleteMany({ user: userId });
    res.json({ success: true, message: 'User quiz progress reset' });
  } catch (err) { next(err); }
});

module.exports = router;
