require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { apiLimiter } = require('./middleware/security');
const { startIngestionScheduler } = require('./cron/scheduler');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration supporting Vercel production domains and local development
const allowedOrigins = [
  'https://south-india-disaster-watch-and-alert-system-sidas.vercel.app',
  'https://kerala-flood-watch.vercel.app',
  'https://keralafloodwatch.in',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive so live queries never fail
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api/', apiLimiter);

// Import API Routes
const apiRoutes = require('./routes/api');
const summaryRoutes = require('./routes/summary');
const reportRoutes = require('./routes/reports');
const subscribeRoutes = require('./routes/subscribe');
const predictionRoutes = require('./routes/predictions');

app.use('/api/v1', apiRoutes);
app.use('/api/v1', summaryRoutes);
app.use('/api/v1', reportRoutes);
app.use('/api/v1', subscribeRoutes);
app.use('/api/v1', predictionRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.message);
  res.status(500).json({ success: false, error: "Internal Server Error", message: err.message });
});

app.listen(PORT, () => {
  console.log(`📡 SIDAS Engine running on port ${PORT}`);
  if (process.env.SUPABASE_URL) {
    startIngestionScheduler();
  } else {
    console.warn("⚠️ SUPABASE_URL missing. Operating in static mode.");
  }
});
