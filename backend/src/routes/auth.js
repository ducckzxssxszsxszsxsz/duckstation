const router = require('express').Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const { generateToken, protect } = require('../middleware/auth');

// ── Passport Google Strategy ──
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id') {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI || '/api/auth/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ providerId: profile.id });
      if (!user) {
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          user.providerId = profile.id;
          user.provider = 'google';
          user.avatar = profile.photos[0]?.value || '';
          await user.save();
        } else {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0]?.value || '',
            provider: 'google',
            providerId: profile.id,
            password: 'google_oauth_' + profile.id,
          });
        }
      }
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
}

// ── POST /api/auth/register ──
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const user = await User.create({ name, email, password, provider: 'local' });
    res.status(201).json({ success: true, token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
});

// ── POST /api/auth/login ──
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    res.json({ success: true, token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
});

// ── GET /api/auth/google (redirect ke Google) ──
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// ── GET /api/auth/google/callback (Google redirect balik) ──
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/?error=google_auth_failed' }), (req, res) => {
  const token = generateToken(req.user._id);
  // Redirect ke frontend dengan token
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth-callback?token=${token}&provider=google`);
});

// ── POST /api/auth/google (manual — dari frontend Google Identity Services) ──
router.post('/google/verify', async (req, res, next) => {
  try {
    const { credential, clientId } = req.body;
    // Decode JWT dari Google Identity Services (tanpa SDK)
    const payload = JSON.parse(Buffer.from(credential.split('.')[1], 'base64').toString());
    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ providerId: sub });
    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        user.providerId = sub;
        user.provider = 'google';
        user.avatar = picture || '';
        await user.save();
      } else {
        user = await User.create({
          name, email, avatar: picture || '',
          provider: 'google', providerId: sub,
          password: 'google_' + sub,
        });
      }
    }

    res.json({ success: true, token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (err) { next(err); }
});

// ── POST /api/auth/discord ──
router.post('/discord', async (req, res, next) => {
  try {
    const { email, name, avatar, discordId, discordTag } = req.body;
    let user = await User.findOne({ discordId });
    if (!user && email) {
      user = await User.findOne({ email });
    }
    if (!user) {
      user = await User.create({ name: name || discordTag, email: email || `${discordTag}@discord.local`, avatar, provider: 'discord', providerId: discordId, discordId, discordTag, password: 'discord_auth' });
    } else {
      user.discordId = discordId;
      user.discordTag = discordTag;
      if (avatar) user.avatar = avatar;
      await user.save();
    }
    res.json({ success: true, token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role, discordTag: user.discordTag } });
  } catch (err) { next(err); }
});

// ── POST /api/auth/discord/bind ──
router.post('/discord/bind', protect, async (req, res, next) => {
  try {
    const { discordId, discordTag } = req.body;
    req.user.discordId = discordId;
    req.user.discordTag = discordTag;
    await req.user.save();
    res.json({ success: true, message: 'Discord bound successfully', user: { discordTag: req.user.discordTag } });
  } catch (err) { next(err); }
});

// ── GET /api/auth/me ──
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
