const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.warn('⚠️ JWT_SECRET is not set! Authentication will not work properly.');
}

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const adminUser = process.env.ADMIN_USERNAME || 'admin';
        const adminPass = process.env.ADMIN_PASSWORD;

        if (!adminPass) {
            return res.status(500).json({ error: 'Server misconfiguration: ADMIN_PASSWORD not set' });
        }

        if (username !== adminUser) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (password !== adminPass) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { username, role: 'admin' },
            JWT_SECRET || 'unsafe-fallback-change-me',
            { expiresIn: '24h' }
        );

        res.json({ token, username, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ valid: false });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET || 'unsafe-fallback-change-me');
        res.json({ valid: true, user: decoded });
    } catch {
        res.status(401).json({ valid: false });
    }
});

module.exports = router;
