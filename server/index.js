require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { apiLimiter } = require('./middleware/security');
const { startIngestionScheduler } = require('./cron/scheduler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/', apiLimiter);

// Import API Routes
const apiRoutes = require('./routes/api');
const summaryRoutes = require('./routes/summary');
const reportRoutes = require('./routes/reports');
const subscribeRoutes = require('./routes/subscribe');

app.use('/api/v1', apiRoutes);
app.use('/api/v1', summaryRoutes);
app.use('/api/v1', reportRoutes);
app.use('/api/v1', subscribeRoutes);

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
