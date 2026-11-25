const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many requests. Please try again later." }
});

const sosReportLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { success: false, error: "SOS report rate limit reached. Please wait a minute." }
});

module.exports = { apiLimiter, sosReportLimiter };
