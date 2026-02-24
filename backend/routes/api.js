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
router.get('/profile', (req, res) => {
    const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get();
    res.json(profile || {});
});

router.put('/profile', auth, (req, res) => {
    const { name, title, bio, tagline, email, github, linkedin, twitter, website, avatar, philosophy, narrative } = req.body;
    db.prepare(`UPDATE profile SET name=?, title=?, bio=?, tagline=?, email=?, github=?, linkedin=?, twitter=?, website=?, avatar=?, philosophy=?, narrative=? WHERE id=1`).run(
        name, title, bio, tagline, email, github, linkedin, twitter, website, avatar, philosophy, typeof narrative === 'string' ? narrative : JSON.stringify(narrative)
    );
    res.json({ message: 'Profile updated' });
});

// ==================== SKILLS ====================
router.get('/skills', (req, res) => {
    const skills = db.prepare('SELECT * FROM skills ORDER BY sort_order ASC').all();
    res.json(skills);
});

router.post('/skills', auth, (req, res) => {
    const { name, category, level, description, icon, sort_order } = req.body;
    const result = db.prepare('INSERT INTO skills (name, category, level, description, icon, sort_order) VALUES (?, ?, ?, ?, ?, ?)').run(
        name, category || 'General', level || 80, description || '', icon || '', sort_order || 0
    );
    res.json({ id: result.lastInsertRowid, message: 'Skill created' });
});

router.put('/skills/:id', auth, (req, res) => {
    const { name, category, level, description, icon, sort_order } = req.body;
    db.prepare('UPDATE skills SET name=?, category=?, level=?, description=?, icon=?, sort_order=? WHERE id=?').run(
        name, category, level, description, icon, sort_order, req.params.id
    );
    res.json({ message: 'Skill updated' });
});

router.delete('/skills/:id', auth, (req, res) => {
    db.prepare('DELETE FROM skills WHERE id=?').run(req.params.id);
    res.json({ message: 'Skill deleted' });
});

// ==================== PROJECTS ====================
router.get('/projects', (req, res) => {
    const projects = db.prepare('SELECT * FROM projects ORDER BY sort_order ASC').all();
    res.json(projects.map(p => ({ ...p, technologies: JSON.parse(p.technologies || '[]') })));
});

router.post('/projects', auth, (req, res) => {
    const { title, description, long_description, image, technologies, role, outcome, link, github_link, featured, sort_order } = req.body;
    const result = db.prepare('INSERT INTO projects (title, description, long_description, image, technologies, role, outcome, link, github_link, featured, sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?)').run(
        title, description || '', long_description || '', image || '', JSON.stringify(technologies || []), role || '', outcome || '', link || '', github_link || '', featured || 0, sort_order || 0
    );
    res.json({ id: result.lastInsertRowid, message: 'Project created' });
});

router.put('/projects/:id', auth, (req, res) => {
    const { title, description, long_description, image, technologies, role, outcome, link, github_link, featured, sort_order } = req.body;
    db.prepare('UPDATE projects SET title=?, description=?, long_description=?, image=?, technologies=?, role=?, outcome=?, link=?, github_link=?, featured=?, sort_order=? WHERE id=?').run(
        title, description, long_description, image, JSON.stringify(technologies || []), role, outcome, link, github_link, featured, sort_order, req.params.id
    );
    res.json({ message: 'Project updated' });
});

router.delete('/projects/:id', auth, (req, res) => {
    db.prepare('DELETE FROM projects WHERE id=?').run(req.params.id);
    res.json({ message: 'Project deleted' });
});

// ==================== EXPERIENCE ====================
router.get('/experience', (req, res) => {
    const exp = db.prepare('SELECT * FROM experience ORDER BY sort_order ASC').all();
    res.json(exp.map(e => ({ ...e, technologies: JSON.parse(e.technologies || '[]') })));
});

router.post('/experience', auth, (req, res) => {
    const { company, position, start_date, end_date, description, technologies, current, sort_order } = req.body;
    const result = db.prepare('INSERT INTO experience (company, position, start_date, end_date, description, technologies, current, sort_order) VALUES (?,?,?,?,?,?,?,?)').run(
        company, position, start_date || '', end_date || '', description || '', JSON.stringify(technologies || []), current || 0, sort_order || 0
    );
    res.json({ id: result.lastInsertRowid, message: 'Experience created' });
});

router.put('/experience/:id', auth, (req, res) => {
    const { company, position, start_date, end_date, description, technologies, current, sort_order } = req.body;
    db.prepare('UPDATE experience SET company=?, position=?, start_date=?, end_date=?, description=?, technologies=?, current=?, sort_order=? WHERE id=?').run(
        company, position, start_date, end_date, description, JSON.stringify(technologies || []), current, sort_order, req.params.id
    );
    res.json({ message: 'Experience updated' });
});

router.delete('/experience/:id', auth, (req, res) => {
    db.prepare('DELETE FROM experience WHERE id=?').run(req.params.id);
    res.json({ message: 'Experience deleted' });
});

// ==================== EDUCATION ====================
router.get('/education', (req, res) => {
    const edu = db.prepare('SELECT * FROM education ORDER BY sort_order ASC').all();
    res.json(edu);
});

router.post('/education', auth, (req, res) => {
    const { institution, degree, field, start_date, end_date, description, sort_order } = req.body;
    const result = db.prepare('INSERT INTO education (institution, degree, field, start_date, end_date, description, sort_order) VALUES (?,?,?,?,?,?,?)').run(
        institution, degree, field || '', start_date || '', end_date || '', description || '', sort_order || 0
    );
    res.json({ id: result.lastInsertRowid, message: 'Education created' });
});

router.put('/education/:id', auth, (req, res) => {
    const { institution, degree, field, start_date, end_date, description, sort_order } = req.body;
    db.prepare('UPDATE education SET institution=?, degree=?, field=?, start_date=?, end_date=?, description=?, sort_order=? WHERE id=?').run(
        institution, degree, field, start_date, end_date, description, sort_order, req.params.id
    );
    res.json({ message: 'Education updated' });
});

router.delete('/education/:id', auth, (req, res) => {
    db.prepare('DELETE FROM education WHERE id=?').run(req.params.id);
    res.json({ message: 'Education deleted' });
});

// ==================== SETTINGS ====================
router.get('/settings', (req, res) => {
    const rows = db.prepare('SELECT * FROM settings').all();
    const settings = {};
    rows.forEach(r => settings[r.key] = r.value);
    res.json(settings);
});

router.put('/settings', auth, (req, res) => {
    const upsert = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    const transaction = db.transaction((data) => {
        Object.entries(data).forEach(([key, value]) => upsert.run(key, String(value)));
    });
    transaction(req.body);
    res.json({ message: 'Settings updated' });
});

// ==================== MEDIA ====================
router.get('/media', (req, res) => {
    const media = db.prepare('SELECT * FROM media ORDER BY uploaded_at DESC').all();
    res.json(media);
});

router.post('/media/upload', auth, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const result = db.prepare('INSERT INTO media (filename, original_name, mimetype, size) VALUES (?, ?, ?, ?)').run(
        req.file.filename, req.file.originalname, req.file.mimetype, req.file.size
    );
    res.json({
        id: result.lastInsertRowid,
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`,
        message: 'File uploaded'
    });
});

router.delete('/media/:id', auth, (req, res) => {
    const media = db.prepare('SELECT * FROM media WHERE id=?').get(req.params.id);
    if (media) {
        const filePath = path.join(uploadDir, media.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        db.prepare('DELETE FROM media WHERE id=?').run(req.params.id);
    }
    res.json({ message: 'Media deleted' });
});

// ==================== ALL DATA (for portfolio) ====================
router.get('/all', (req, res) => {
    const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get();
    const skills = db.prepare('SELECT * FROM skills ORDER BY sort_order ASC').all();
    const projects = db.prepare('SELECT * FROM projects ORDER BY sort_order ASC').all().map(p => ({ ...p, technologies: JSON.parse(p.technologies || '[]') }));
    const experience = db.prepare('SELECT * FROM experience ORDER BY sort_order ASC').all().map(e => ({ ...e, technologies: JSON.parse(e.technologies || '[]') }));
    const education = db.prepare('SELECT * FROM education ORDER BY sort_order ASC').all();
    const settingsRows = db.prepare('SELECT * FROM settings').all();
    const settings = {};
    settingsRows.forEach(r => settings[r.key] = r.value);

    res.json({ profile, skills, projects, experience, education, settings });
});

module.exports = router;
