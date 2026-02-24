const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        const adminUser = process.env.ADMIN_USERNAME || 'admin';
        const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

        if (username !== adminUser) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Direct comparison for simplicity (env-based password)
        if (password !== adminPass) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { username, role: 'admin' },
            process.env.JWT_SECRET || 'fallback_secret',
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        res.json({ valid: true, user: decoded });
    } catch {
        res.status(401).json({ valid: false });
    }
});

module.exports = router;
