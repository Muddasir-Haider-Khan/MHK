import { query } from '@/lib/db';

export async function getPortfolioData() {
  try {
    const [
      profileRes,
      skillsRes,
      projectsRes,
      experienceRes,
      educationRes,
      settingsRes
    ] = await Promise.all([
      query('SELECT * FROM profile WHERE id = 1'),
      query('SELECT * FROM skills ORDER BY sort_order ASC'),
      query('SELECT * FROM projects ORDER BY sort_order ASC'),
      query('SELECT * FROM experience ORDER BY sort_order ASC'),
      query('SELECT * FROM education ORDER BY sort_order ASC'),
      query('SELECT * FROM settings')
    ]);

    const profile = profileRes.rows[0] || {};
    const skills = skillsRes.rows || [];
    const projects = projectsRes.rows.map(p => ({ ...p, technologies: JSON.parse(p.technologies || '[]') })) || [];
    const experience = experienceRes.rows.map(e => ({ ...e, technologies: JSON.parse(e.technologies || '[]') })) || [];
    const education = educationRes.rows || [];
    
    const settings: Record<string, string> = {};
    if (settingsRes.rows) {
      settingsRes.rows.forEach(r => settings[r.key] = r.value);
    }

    return {
      profile,
      skills,
      projects,
      experience,
      education,
      settings
    };
  } catch (error) {
    console.error('Error fetching global portfolio data from DB:', error);
    return null;
  }
}
