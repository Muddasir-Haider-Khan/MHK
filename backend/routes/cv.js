const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');
const db = require('../database');

async function getAllData() {
    const profileRes = await db.query('SELECT * FROM profile WHERE id = 1');
    const skillsRes = await db.query('SELECT * FROM skills ORDER BY sort_order ASC');
    const projectsRes = await db.query('SELECT * FROM projects ORDER BY sort_order ASC');
    const experienceRes = await db.query('SELECT * FROM experience ORDER BY sort_order ASC');
    const educationRes = await db.query('SELECT * FROM education ORDER BY sort_order ASC');

    return {
        profile: profileRes.rows[0],
        skills: skillsRes.rows,
        projects: projectsRes.rows,
        experience: experienceRes.rows,
        education: educationRes.rows
    };
}

// PDF Export
router.get('/pdf', async (req, res) => {
    try {
        const { profile, skills, projects, experience, education } = await getAllData();
        const doc = new PDFDocument({ margin: 50, size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${(profile.name || 'CV').replace(/\s+/g, '_')}_CV.pdf"`);
        doc.pipe(res);

        // Header
        doc.fontSize(22).font('Helvetica-Bold').text(profile.name || 'Name', { align: 'center' });
        doc.fontSize(11).font('Helvetica').text(profile.title || '', { align: 'center' });
        doc.fontSize(10).text(profile.email || '', { align: 'center' });
        const links = [profile.linkedin, profile.github, profile.website].filter(Boolean).join(' | ');
        if (links) doc.text(links, { align: 'center' });
        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#333333');
        doc.moveDown(0.8);

        // Summary
        doc.fontSize(13).font('Helvetica-Bold').text('SUMMARY');
        doc.moveDown(0.3);
        doc.fontSize(10).font('Helvetica').text(profile.bio || '');
        doc.moveDown(0.8);

        // Skills
        doc.fontSize(13).font('Helvetica-Bold').text('SKILLS');
        doc.moveDown(0.3);
        const categories = {};
        skills.forEach(s => {
            if (!categories[s.category]) categories[s.category] = [];
            categories[s.category].push(s.name);
        });
        Object.entries(categories).forEach(([cat, skillNames]) => {
            doc.fontSize(10).font('Helvetica-Bold').text(`${cat}: `, { continued: true });
            doc.font('Helvetica').text(skillNames.join(', '));
        });
        doc.moveDown(0.8);

        // Experience
        doc.fontSize(13).font('Helvetica-Bold').text('EXPERIENCE');
        doc.moveDown(0.3);
        experience.forEach(exp => {
            doc.fontSize(11).font('Helvetica-Bold').text(exp.position);
            doc.fontSize(10).font('Helvetica').text(`${exp.company} | ${exp.start_date} - ${exp.current ? 'Present' : exp.end_date}`);
            doc.moveDown(0.2);
            if (exp.description) doc.fontSize(10).text(exp.description);
            doc.moveDown(0.5);
        });
        doc.moveDown(0.3);

        // Projects
        doc.fontSize(13).font('Helvetica-Bold').text('PROJECTS');
        doc.moveDown(0.3);
        projects.forEach(proj => {
            doc.fontSize(11).font('Helvetica-Bold').text(proj.title);
            if (proj.description) doc.fontSize(10).font('Helvetica').text(proj.description);
            const techs = JSON.parse(proj.technologies || '[]');
            if (techs.length) doc.fontSize(9).fillColor('#555').text(`Technologies: ${techs.join(', ')}`).fillColor('#000');
            doc.moveDown(0.5);
        });
        doc.moveDown(0.3);

        // Education
        doc.fontSize(13).font('Helvetica-Bold').text('EDUCATION');
        doc.moveDown(0.3);
        education.forEach(edu => {
            doc.fontSize(11).font('Helvetica-Bold').text(`${edu.degree}${edu.field ? ' in ' + edu.field : ''}`);
            doc.fontSize(10).font('Helvetica').text(`${edu.institution} | ${edu.start_date} - ${edu.end_date}`);
            if (edu.description) doc.text(edu.description);
            doc.moveDown(0.5);
        });

        doc.end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DOCX Export
router.get('/docx', async (req, res) => {
    try {
        const { profile, skills, projects, experience, education } = await getAllData();

        const children = [];

        // Header
        children.push(new Paragraph({ children: [new TextRun({ text: profile.name || 'Name', bold: true, size: 36, font: 'Calibri' })], alignment: AlignmentType.CENTER }));
        children.push(new Paragraph({ children: [new TextRun({ text: profile.title || '', size: 22, font: 'Calibri' })], alignment: AlignmentType.CENTER }));
        children.push(new Paragraph({ children: [new TextRun({ text: profile.email || '', size: 20, font: 'Calibri' })], alignment: AlignmentType.CENTER, spacing: { after: 200 } }));

        // Summary
        children.push(new Paragraph({ text: 'SUMMARY', heading: HeadingLevel.HEADING_2, spacing: { before: 300 } }));
        children.push(new Paragraph({ children: [new TextRun({ text: profile.bio || '', size: 20, font: 'Calibri' })], spacing: { after: 200 } }));

        // Skills
        children.push(new Paragraph({ text: 'SKILLS', heading: HeadingLevel.HEADING_2, spacing: { before: 300 } }));
        const categories = {};
        skills.forEach(s => {
            if (!categories[s.category]) categories[s.category] = [];
            categories[s.category].push(s.name);
        });
        Object.entries(categories).forEach(([cat, names]) => {
            children.push(new Paragraph({
                children: [
                    new TextRun({ text: `${cat}: `, bold: true, size: 20, font: 'Calibri' }),
                    new TextRun({ text: names.join(', '), size: 20, font: 'Calibri' }),
                ]
            }));
        });

        // Experience
        children.push(new Paragraph({ text: 'EXPERIENCE', heading: HeadingLevel.HEADING_2, spacing: { before: 300 } }));
        experience.forEach(exp => {
            children.push(new Paragraph({ children: [new TextRun({ text: exp.position, bold: true, size: 22, font: 'Calibri' })], spacing: { before: 100 } }));
            children.push(new Paragraph({ children: [new TextRun({ text: `${exp.company} | ${exp.start_date} - ${exp.current ? 'Present' : exp.end_date}`, size: 20, font: 'Calibri', italics: true })] }));
            if (exp.description) children.push(new Paragraph({ children: [new TextRun({ text: exp.description, size: 20, font: 'Calibri' })], spacing: { after: 100 } }));
        });

        // Projects
        children.push(new Paragraph({ text: 'PROJECTS', heading: HeadingLevel.HEADING_2, spacing: { before: 300 } }));
        projects.forEach(proj => {
            children.push(new Paragraph({ children: [new TextRun({ text: proj.title, bold: true, size: 22, font: 'Calibri' })], spacing: { before: 100 } }));
            if (proj.description) children.push(new Paragraph({ children: [new TextRun({ text: proj.description, size: 20, font: 'Calibri' })] }));
            const techs = JSON.parse(proj.technologies || '[]');
            if (techs.length) children.push(new Paragraph({ children: [new TextRun({ text: `Technologies: ${techs.join(', ')}`, size: 18, font: 'Calibri', color: '555555' })], spacing: { after: 100 } }));
        });

        // Education
        children.push(new Paragraph({ text: 'EDUCATION', heading: HeadingLevel.HEADING_2, spacing: { before: 300 } }));
        education.forEach(edu => {
            children.push(new Paragraph({ children: [new TextRun({ text: `${edu.degree}${edu.field ? ' in ' + edu.field : ''}`, bold: true, size: 22, font: 'Calibri' })], spacing: { before: 100 } }));
            children.push(new Paragraph({ children: [new TextRun({ text: `${edu.institution} | ${edu.start_date} - ${edu.end_date}`, size: 20, font: 'Calibri', italics: true })] }));
            if (edu.description) children.push(new Paragraph({ children: [new TextRun({ text: edu.description, size: 20, font: 'Calibri' })], spacing: { after: 100 } }));
        });

        const doc = new Document({ sections: [{ children }] });
        const buffer = await Packer.toBuffer(doc);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename="${(profile.name || 'CV').replace(/\s+/g, '_')}_CV.docx"`);
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
