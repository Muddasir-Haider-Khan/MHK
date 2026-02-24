const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database');

// Auth middleware
function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
    const token = authHeader.split(' ')[1];
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}

// File upload config
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
    }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ==================== PROFILE ====================
router.get('/profile', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM profile WHERE id = 1');
        res.json(result.rows[0] || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/profile', auth, async (req, res) => {
    try {
        const { name, title, bio, tagline, email, github, linkedin, twitter, website, avatar, philosophy, narrative } = req.body;
        await db.query(`UPDATE profile SET name=$1, title=$2, bio=$3, tagline=$4, email=$5, github=$6, linkedin=$7, twitter=$8, website=$9, avatar=$10, philosophy=$11, narrative=$12 WHERE id=1`, [
            name, title, bio, tagline, email, github, linkedin, twitter, website, avatar, philosophy, typeof narrative === 'string' ? narrative : JSON.stringify(narrative)
        ]);
        res.json({ message: 'Profile updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== SKILLS ====================
router.get('/skills', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM skills ORDER BY sort_order ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/skills', auth, async (req, res) => {
    try {
        const { name, category, level, description, icon, sort_order } = req.body;
        const result = await db.query('INSERT INTO skills (name, category, level, description, icon, sort_order) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', [
            name, category || 'General', level || 80, description || '', icon || '', sort_order || 0
        ]);
        res.json({ id: result.rows[0].id, message: 'Skill created' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/skills/:id', auth, async (req, res) => {
    try {
        const { name, category, level, description, icon, sort_order } = req.body;
        await db.query('UPDATE skills SET name=$1, category=$2, level=$3, description=$4, icon=$5, sort_order=$6 WHERE id=$7', [
            name, category, level, description, icon, sort_order, req.params.id
        ]);
        res.json({ message: 'Skill updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/skills/:id', auth, async (req, res) => {
    try {
        await db.query('DELETE FROM skills WHERE id=$1', [req.params.id]);
        res.json({ message: 'Skill deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== PROJECTS ====================
router.get('/projects', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM projects ORDER BY sort_order ASC');
        res.json(result.rows.map(p => ({ ...p, technologies: JSON.parse(p.technologies || '[]') })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/projects', auth, async (req, res) => {
    try {
        const { title, description, long_description, image, technologies, role, outcome, link, github_link, featured, sort_order } = req.body;
        const result = await db.query('INSERT INTO projects (title, description, long_description, image, technologies, role, outcome, link, github_link, featured, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id', [
            title, description || '', long_description || '', image || '', JSON.stringify(technologies || []), role || '', outcome || '', link || '', github_link || '', featured || 0, sort_order || 0
        ]);
        res.json({ id: result.rows[0].id, message: 'Project created' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/projects/:id', auth, async (req, res) => {
    try {
        const { title, description, long_description, image, technologies, role, outcome, link, github_link, featured, sort_order } = req.body;
        await db.query('UPDATE projects SET title=$1, description=$2, long_description=$3, image=$4, technologies=$5, role=$6, outcome=$7, link=$8, github_link=$9, featured=$10, sort_order=$11 WHERE id=$12', [
            title, description, long_description, image, JSON.stringify(technologies || []), role, outcome, link, github_link, featured, sort_order, req.params.id
        ]);
        res.json({ message: 'Project updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/projects/:id', auth, async (req, res) => {
    try {
        await db.query('DELETE FROM projects WHERE id=$1', [req.params.id]);
        res.json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== EXPERIENCE ====================
router.get('/experience', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM experience ORDER BY sort_order ASC');
        res.json(result.rows.map(e => ({ ...e, technologies: JSON.parse(e.technologies || '[]') })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/experience', auth, async (req, res) => {
    try {
        const { company, position, start_date, end_date, description, technologies, current, sort_order } = req.body;
        const result = await db.query('INSERT INTO experience (company, position, start_date, end_date, description, technologies, current, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id', [
            company, position, start_date || '', end_date || '', description || '', JSON.stringify(technologies || []), current || 0, sort_order || 0
        ]);
        res.json({ id: result.rows[0].id, message: 'Experience created' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/experience/:id', auth, async (req, res) => {
    try {
        const { company, position, start_date, end_date, description, technologies, current, sort_order } = req.body;
        await db.query('UPDATE experience SET company=$1, position=$2, start_date=$3, end_date=$4, description=$5, technologies=$6, current=$7, sort_order=$8 WHERE id=$9', [
            company, position, start_date, end_date, description, JSON.stringify(technologies || []), current, sort_order, req.params.id
        ]);
        res.json({ message: 'Experience updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/experience/:id', auth, async (req, res) => {
    try {
        await db.query('DELETE FROM experience WHERE id=$1', [req.params.id]);
        res.json({ message: 'Experience deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== EDUCATION ====================
router.get('/education', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM education ORDER BY sort_order ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/education', auth, async (req, res) => {
    try {
        const { institution, degree, field, start_date, end_date, description, sort_order } = req.body;
        const result = await db.query('INSERT INTO education (institution, degree, field, start_date, end_date, description, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id', [
            institution, degree, field || '', start_date || '', end_date || '', description || '', sort_order || 0
        ]);
        res.json({ id: result.rows[0].id, message: 'Education created' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/education/:id', auth, async (req, res) => {
    try {
        const { institution, degree, field, start_date, end_date, description, sort_order } = req.body;
        await db.query('UPDATE education SET institution=$1, degree=$2, field=$3, start_date=$4, end_date=$5, description=$6, sort_order=$7 WHERE id=$8', [
            institution, degree, field, start_date, end_date, description, sort_order, req.params.id
        ]);
        res.json({ message: 'Education updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/education/:id', auth, async (req, res) => {
    try {
        await db.query('DELETE FROM education WHERE id=$1', [req.params.id]);
        res.json({ message: 'Education deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== SETTINGS ====================
router.get('/settings', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM settings');
        const settings = {};
        result.rows.forEach(r => settings[r.key] = r.value);
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/settings', auth, async (req, res) => {
    try {
        const entries = Object.entries(req.body);
        for (const [key, value] of entries) {
            await db.query('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value', [key, String(value)]);
        }
        res.json({ message: 'Settings updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== MEDIA ====================
router.get('/media', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM media ORDER BY uploaded_at DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/media/upload', auth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const result = await db.query('INSERT INTO media (filename, original_name, mimetype, size) VALUES ($1, $2, $3, $4) RETURNING id', [
            req.file.filename, req.file.originalname, req.file.mimetype, req.file.size
        ]);
        res.json({
            id: result.rows[0].id,
            filename: req.file.filename,
            url: `/uploads/${req.file.filename}`,
            message: 'File uploaded'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/media/:id', auth, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM media WHERE id=$1', [req.params.id]);
        const media = result.rows[0];
        if (media) {
            const filePath = path.join(uploadDir, media.filename);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            await db.query('DELETE FROM media WHERE id=$1', [req.params.id]);
        }
        res.json({ message: 'Media deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== ALL DATA (for portfolio) ====================
router.get('/all', async (req, res) => {
    try {
        const profileRes = await db.query('SELECT * FROM profile WHERE id = 1');
        const skillsRes = await db.query('SELECT * FROM skills ORDER BY sort_order ASC');
        const projectsRes = await db.query('SELECT * FROM projects ORDER BY sort_order ASC');
        const experienceRes = await db.query('SELECT * FROM experience ORDER BY sort_order ASC');
        const educationRes = await db.query('SELECT * FROM education ORDER BY sort_order ASC');
        const settingsRes = await db.query('SELECT * FROM settings');

        const profile = profileRes.rows[0];
        const skills = skillsRes.rows;
        const projects = projectsRes.rows.map(p => ({ ...p, technologies: JSON.parse(p.technologies || '[]') }));
        const experience = experienceRes.rows.map(e => ({ ...e, technologies: JSON.parse(e.technologies || '[]') }));
        const education = educationRes.rows;

        const settings = {};
        settingsRes.rows.forEach(r => settings[r.key] = r.value);

        res.json({ profile, skills, projects, experience, education, settings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
