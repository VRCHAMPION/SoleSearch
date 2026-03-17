require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
const sneakerRoutes = require('./routes/sneakers');

const app = express();
const PORT = process.env.PORT || 4000;

// --- Middleware ---
app.use(cors({
    origin: process.env.CLIENT_URL ? [process.env.CLIENT_URL, 'http://localhost:3000'] : ['http://localhost:3000', 'https://solesearch-your-branch.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());

// Rate limiting — sneaks-api scrapes live; protect from abuse
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30,
    message: { error: 'Too many requests. Please try again shortly.' },
});
app.use('/api', apiLimiter);

// --- In-Memory Cache Layer ---
const cache = new NodeCache({ stdTTL: 300 }); // 5-minute TTL

app.use('/api', (req, res, next) => {
    const key = req.originalUrl;
    const cached = cache.get(key);
    if (cached) {
        return res.json({ ...cached, _cached: true });
    }
    // Monkey-patch res.json to auto-cache
    const originalJson = res.json.bind(res);
    res.json = (data) => {
        cache.set(key, data);
        return originalJson(data);
    };
    next();
});

// --- Routes ---
app.use('/api', sneakerRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Start background cron jobs
require('./cron');


if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 SoleSearch API running on port ${PORT}`);
    });
}

module.exports = app;

// Prevent crashes from sneaks-api internal errors
process.on('uncaughtException', (err) => {
    console.error('⚠️  Uncaught Exception (server stays alive):', err.message);
});
process.on('unhandledRejection', (reason) => {
    console.error('⚠️  Unhandled Rejection (server stays alive):', reason);
});
