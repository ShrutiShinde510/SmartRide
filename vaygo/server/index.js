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
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/messages', require('./routes/message.routes'));
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

    // Drop stale indexes to prevent E11000 duplicate key clashes after schema changes
    try {
      const db = mongoose.connection.db;

      // Clean up legacy indexes on 'users' collection
      const usersColl = (await db.listCollections({ name: 'users' }).toArray()).length > 0
        ? db.collection('users') : null;
      if (usersColl) {
        const userIdxs = await usersColl.indexes();
        for (const name of ['phone_1', 'email_1', 'username_1']) {
          if (userIdxs.some(i => i.name === name)) {
            await usersColl.dropIndex(name);
            console.log(`Dropped old users index: ${name}`);
          }
        }
      }

      // Clean up stale nested-schema indexes on 'passengers' collection
      const passColl = (await db.listCollections({ name: 'passengers' }).toArray()).length > 0
        ? db.collection('passengers') : null;
      if (passColl) {
        const passIdxs = await passColl.indexes();
        for (const name of ['personal_info.phone_1', 'personal_info.email_1']) {
          if (passIdxs.some(i => i.name === name)) {
            await passColl.dropIndex(name);
            console.log(`Dropped stale passengers index: ${name}`);
          }
        }
      }
    } catch (err) {
      console.error('Failed to clean up old collection indexes:', err.message);
    }

    app.listen(process.env.PORT, () => {
      console.log(`Vaygo server running on http://localhost:${process.env.PORT}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${process.env.PORT} is already in use.`);
        console.error(`   Run: Get-NetTCPConnection -LocalPort ${process.env.PORT} | Select-Object -ExpandProperty OwningProcess | ForEach-Object { taskkill /PID $_ /F }`);
        process.exit(1);
      } else {
        throw err;
      }
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

