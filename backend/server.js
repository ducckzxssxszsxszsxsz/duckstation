const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./src/config/db');

dotenv.config();
connectDB();

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth',       require('./src/routes/auth'));
app.use('/api/users',      require('./src/routes/users'));
app.use('/api/batches',    require('./src/routes/batches'));
app.use('/api/orders',     require('./src/routes/orders'));
app.use('/api/modules',    require('./src/routes/modules'));
app.use('/api/quizzes',    require('./src/routes/quizzes'));
app.use('/api/bookings',   require('./src/routes/bookings'));
app.use('/api/tickets',    require('./src/routes/tickets'));
app.use('/api/broadcasts', require('./src/routes/broadcasts'));

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Serve static frontend (production)
const path = require('path');
app.use(express.static(path.join(__dirname, 'frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`DuckStation API running on port ${PORT}`));
