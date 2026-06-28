const router = require('express').Router();
const Module = require('../models/Module');
const { protect, adminOnly } = require('../middleware/auth');

// ── GET /api/modules (public — published only) ──
router.get('/', async (req, res, next) => {
  try {
    const modules = await Module.find({ status: 'published' }).sort('order');
    res.json({ success: true, modules });
  } catch (err) { next(err); }
});

// ── GET /api/modules/all (admin — all including draft) ──
router.get('/all', protect, adminOnly, async (req, res, next) => {
  try {
    const modules = await Module.find().sort('order');
    res.json({ success: true, modules });
  } catch (err) { next(err); }
});

// ── GET /api/modules/:id ──
router.get('/:id', async (req, res, next) => {
  try {
    const mod = await Module.findById(req.params.id);
    if (!mod) return res.status(404).json({ success: false, message: 'Module not found' });
    res.json({ success: true, module: mod });
  } catch (err) { next(err); }
});

// ── POST /api/modules (admin) ──
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const { title, batch, status, free, order } = req.body;
    const mod = await Module.create({ title, batch, status, free, order });
    res.status(201).json({ success: true, module: mod });
  } catch (err) { next(err); }
});

// ── PUT /api/modules/:id (admin) ──
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const mod = await Module.findById(req.params.id);
    if (!mod) return res.status(404).json({ success: false, message: 'Module not found' });
    const { title, batch, status, free, order } = req.body;
    if (title !== undefined) mod.title = title;
    if (batch !== undefined) mod.batch = batch;
    if (status !== undefined) mod.status = status;
    if (free !== undefined) mod.free = free;
    if (order !== undefined) mod.order = order;
    await mod.save();
    res.json({ success: true, module: mod });
  } catch (err) { next(err); }
});

// ── DELETE /api/modules/:id (admin) ──
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const mod = await Module.findByIdAndDelete(req.params.id);
    if (!mod) return res.status(404).json({ success: false, message: 'Module not found' });
    res.json({ success: true, message: 'Module deleted' });
  } catch (err) { next(err); }
});

// ── POST /api/modules/:id/lessons (admin add lesson) ──
router.post('/:id/lessons', protect, adminOnly, async (req, res, next) => {
  try {
    const mod = await Module.findById(req.params.id);
    if (!mod) return res.status(404).json({ success: false, message: 'Module not found' });
    mod.lessons.push({ title: req.body.title || 'New Lesson', steps: [] });
    await mod.save();
    res.json({ success: true, module: mod });
  } catch (err) { next(err); }
});

// ── PUT /api/modules/:moduleId/lessons/:lessonId (admin update lesson) ──
router.put('/:moduleId/lessons/:lessonId', protect, adminOnly, async (req, res, next) => {
  try {
    const mod = await Module.findById(req.params.moduleId);
    if (!mod) return res.status(404).json({ success: false, message: 'Module not found' });
    const lesson = mod.lessons.id(req.params.lessonId);
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
    const { title, status, steps } = req.body;
    if (title !== undefined) lesson.title = title;
    if (status !== undefined) lesson.status = status;
    if (steps !== undefined) lesson.steps = steps;
    await mod.save();
    res.json({ success: true, module: mod });
  } catch (err) { next(err); }
});

// ── DELETE /api/modules/:moduleId/lessons/:lessonId (admin delete lesson) ──
router.delete('/:moduleId/lessons/:lessonId', protect, adminOnly, async (req, res, next) => {
  try {
    const mod = await Module.findById(req.params.moduleId);
    if (!mod) return res.status(404).json({ success: false, message: 'Module not found' });
    mod.lessons = mod.lessons.filter(l => l._id.toString() !== req.params.lessonId);
    await mod.save();
    res.json({ success: true, module: mod });
  } catch (err) { next(err); }
});

module.exports = router;
