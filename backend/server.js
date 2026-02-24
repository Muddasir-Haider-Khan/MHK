require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Static files
app.use('/uploads', express.static(uploadsDir));
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));
app.use('/api/cv', require('./routes/cv'));
app.use('/api/ai', require('./routes/ai'));

// SPA fallback for admin
app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'admin', 'index.html'));
});

// SPA fallback for frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n  ✨ Portfolio System Running`);
    console.log(`  🌐 Portfolio: http://localhost:${PORT}`);
    console.log(`  🔧 Admin:     http://localhost:${PORT}/admin`);
    console.log(`  📡 API:       http://localhost:${PORT}/api\n`);
});
