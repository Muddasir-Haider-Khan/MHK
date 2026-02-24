require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./database');

// Initialize Database (Async startup guard)
const isVercel = process.env.VERCEL === '1';
if (db.initDB) {
    db.initDB().catch(err => {
        console.error('⚠️ Database migration failed at startup:', err);
    });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists (Serverless safe)
const uploadsDir = path.join(__dirname, 'uploads');
try {
    if (!fs.existsSync(uploadsDir) && !isVercel) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
} catch (e) {
    console.warn('⚠️ Could not create uploads directory (expected in serverless)');
}

// Health check & Diagnostics
app.get('/api/health', async (req, res) => {
    try {
        const dbStatus = await db.ping();
        res.json({ status: 'ok', db: 'connected', time: dbStatus.now, serverless: isVercel });
    } catch (err) {
        res.status(500).json({ status: 'error', db: 'disconnected', error: err.message, serverless: isVercel });
    }
});

app.get('/api/debug-env', (req, res) => {
    res.json({
        has_db_url: !!process.env.DATABASE_URL,
        db_url_prefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 10) + '...' : 'none',
        node_env: process.env.NODE_ENV,
        ver_version: process.env.VERCEL_GIT_COMMIT_SHA || 'local'
    });
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