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

// Ensure uploads directory exists (Serverless safe)
const uploadsDir = path.join(__dirname, 'uploads');
try {
    if (!fs.existsSync(uploadsDir) && !isVercel) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
} catch (e) {
    console.warn('⚠️ Could not create uploads directory (expected in serverless)');
}

// Health check
app.get('/api/status', (req, res) => res.json({ status: 'online', serverless: isVercel }));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));
app.use('/api/cv', require('./routes/cv'));
app.use('/api/ai', require('./routes/ai'));

// Start server (Only if NOT in serverless)
if (!isVercel) {
    app.listen(PORT, () => {
        console.log(`\n  ✨ Portfolio System Running`);
        console.log(`  🌐 Portfolio: http://localhost:${PORT}`);
        console.log(`  🔧 Admin:     http://localhost:${PORT}/admin`);
        console.log(`  📡 API:       http://localhost:${PORT}/api\n`);
    });
}
module.exports = app; // At the very bottom