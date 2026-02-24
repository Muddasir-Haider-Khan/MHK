const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database');

function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });
    try {
        req.user = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'fallback_secret');
        next();
    } catch { res.status(401).json({ error: 'Invalid token' }); }
}

router.post('/generate', auth, async (req, res) => {
    const { type } = req.body; // 'bio', 'summary', 'project_descriptions', 'skill_descriptions', 'all'
    const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get();
    const skills = db.prepare('SELECT * FROM skills ORDER BY sort_order ASC').all();
    const projects = db.prepare('SELECT * FROM projects ORDER BY sort_order ASC').all();
    const experience = db.prepare('SELECT * FROM experience ORDER BY sort_order ASC').all();

    // If OpenAI key is available, use it
    if (process.env.OPENAI_API_KEY) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'You are a professional portfolio content writer. Write in first person, confident tone, minimal marketing language. Focus on impact and results.' },
                        { role: 'user', content: buildPrompt(type, { profile, skills, projects, experience }) }
                    ],
                    temperature: 0.7
                })
            });
            const data = await response.json();
            return res.json({ content: data.choices[0].message.content, source: 'ai' });
        } catch (err) {
            // Fall through to fallback
        }
    }

    // Fallback: generate professional content without AI
    const content = generateFallbackContent(type, { profile, skills, projects, experience });
    res.json({ content, source: 'template' });
});

function buildPrompt(type, data) {
    const { profile, skills, projects, experience } = data;
    const context = `Name: ${profile.name}, Title: ${profile.title}, Skills: ${skills.map(s => s.name).join(', ')}, Projects: ${projects.map(p => p.title).join(', ')}`;

    switch (type) {
        case 'bio': return `Write a professional 3-sentence bio for a portfolio. ${context}. Tone: confident, not salesy.`;
        case 'summary': return `Write a professional summary (4-5 sentences) for a CV/resume. ${context}. Focus on impact.`;
        case 'project_descriptions': return `Write short professional descriptions (2-3 sentences each) for these projects: ${projects.map(p => p.title).join(', ')}. Context: ${context}. Return as JSON array.`;
        case 'skill_descriptions': return `Write one-sentence descriptions for these skills: ${skills.map(s => s.name).join(', ')}. Context: ${context}. Return as JSON object.`;
        default: return `Generate a complete portfolio content package including bio, summary, and project descriptions. ${context}`;
    }
}

function generateFallbackContent(type, data) {
    const { profile, skills, projects, experience } = data;
    const name = profile.name || 'Developer';
    const title = profile.title || 'Engineer';
    const topSkills = skills.slice(0, 5).map(s => s.name).join(', ');
    const years = experience.length > 0 ? `${experience.length}+` : 'several';

    const templates = {
        bio: `${name} is a ${title} with a passion for building intelligent systems that solve real-world problems. With expertise in ${topSkills}, I specialize in creating solutions that are both technically robust and beautifully crafted. Every project I take on is driven by a commitment to quality, performance, and lasting impact.`,
        summary: `Results-driven ${title} with ${years} years of experience in software development and AI/ML applications. Proficient in ${topSkills}, with a proven track record of delivering high-impact solutions. Skilled at translating complex requirements into clean, scalable architectures. Passionate about building systems that combine technical excellence with exceptional user experiences.`,
        project_descriptions: projects.map(p => ({
            title: p.title,
            description: `${p.title} is a purpose-built solution designed to deliver measurable results. ${p.description || 'This project showcases technical depth and practical problem-solving.'} ${p.outcome ? 'Result: ' + p.outcome : ''}`
        })),
        skill_descriptions: Object.fromEntries(skills.map(s => [s.name, s.description || `Professional-grade expertise in ${s.name} for production applications.`]))
    };

    if (type === 'all') return templates;
    return templates[type] || templates.bio;
}

module.exports = router;
