import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Run all database queries concurrently for faster response times
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

    return NextResponse.json({
      profile,
      skills,
      projects,
      experience,
      education,
      settings
    }, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate',
      }
    });
  } catch (error: any) {
    console.error('Error fetching global portfolio data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
