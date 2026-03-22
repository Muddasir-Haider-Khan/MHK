require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./database');
const isVercel = process.env.VERCEL === '1';

// Initialize Database
if (db.initDB) {
    db.initDB().catch(err => {
        console.error('⚠️ Database migration failed at startup:', err);
    });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', async (req, res) => {
    try {
        const dbStatus = await db.ping();
        res.json({ status: 'ok', db: 'connected', time: dbStatus.now, serverless: isVercel });
    } catch (err) {
        res.status(500).json({ status: 'error', db: 'disconnected', error: err.message });
    }
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));
app.use('/api/cv', require('./routes/cv'));
app.use('/api/ai', require('./routes/ai'));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('🔥 Server Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        detail: isVercel ? 'Check Vercel logs for stack trace' : err.message
    });
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('🌪️ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start server (Only if NOT in serverless)
if (!isVercel) {
    app.listen(PORT, () => {
        console.log(`\n  ✨ Portfolio System Running`);
        console.log(`  🌐 Portfolio: http://localhost:${PORT}`);
        console.log(`  🔧 Admin:     http://localhost:${PORT}/admin`);
        console.log(`  📡 API:       http://localhost:${PORT}/api\n`);
    });
}

module.exports = app;