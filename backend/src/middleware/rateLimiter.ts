import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 600, // Allow high concurrent student traffic
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  message: { error: 'Too many requests, please try again later.' },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: false, // Disable standardHeaders here to prevent collision with generalLimiter
  legacyHeaders: false,
  validate: false,
  message: { error: 'Too many login attempts, please try again later.' },
});

export const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 500, // High limit to allow stress-free student submissions & campus Wi-Fi
  standardHeaders: false,
  legacyHeaders: false,
  validate: false,
  message: { error: 'High submission volume detected from this network. Please wait a few moments and try again.' },
});

export const statusLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: false,
  legacyHeaders: false,
  validate: false,
  message: { error: 'Too many status check attempts.' },
});
