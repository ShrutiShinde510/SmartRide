const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// ── Security middleware ──
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ── Rate limiting ──
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api', limiter);

// ── Routes ──
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/otp', require('./routes/otp.routes'));
app.use('/api/rides', require('./routes/ride.routes'));

// ── Health check ──
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Vaygo server running', timestamp: new Date() });
});

// ── 404 handler ──
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Error handler ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ── MongoDB connection + server start ──
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');

    // Drop old root-level indexes to prevent E11000 duplicate key clashes
    try {
      const db = mongoose.connection.db;
      const collections = await db.listCollections({ name: 'users' }).toArray();
      if (collections.length > 0) {
        const usersColl = db.collection('users');
        const indexes = await usersColl.indexes();
        if (indexes.some(idx => idx.name === 'phone_1')) {
          await usersColl.dropIndex('phone_1');
          console.log('Dropped old root-level phone_1 index');
        }
        if (indexes.some(idx => idx.name === 'email_1')) {
          await usersColl.dropIndex('email_1');
          console.log('Dropped old root-level email_1 index');
        }
      }
    } catch (err) {
      console.error('Failed to clean up old collection indexes:', err.message);
    }

    app.listen(process.env.PORT, () => {
      console.log(`Vaygo server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });