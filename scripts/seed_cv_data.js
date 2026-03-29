require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seed() {
  const client = await pool.connect();
  console.log('Seeding CV data into Neon Postgres...');
  
  try {
    await client.query('BEGIN');

    // 1. Projects
    const projects = [
      {
        title: 'Altertec AI Innovation',
        description: 'Leading AI Research and Innovation, building automated systems and AI agents.',
        long_description: 'As the Lead for AI Research & Innovation, I architected and deployed multiple AI agents and automated workflows using LangChain and various LLMs.',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070',
        technologies: JSON.stringify(['Python', 'Next.js', 'PyTorch', 'LangChain']),
        role: 'AI Innovation Lead',
        outcome: 'Automated 70% of research workflows.',
        link: 'https://altertecai.com/',
        github_link: '',
        featured: 1,
        sort_order: 1,
        is_active: true
      },
      {
        title: 'Devai Consultants',
        description: 'Founder of an AI agency connecting clients with top-tier AI developers.',
        long_description: 'Founded Devai Consultants to bridge the gap between businesses and cutting-edge AI talent. Managed technical sales and delivery.',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070',
        technologies: JSON.stringify(['AI Consulting', 'React', 'Management']),
        role: 'Founder',
        outcome: 'Successfully connected 10+ clients with AI solutions.',
        link: '',
        github_link: '',
        featured: 1,
        sort_order: 2,
        is_active: true
      }
    ];

    await client.query('DELETE FROM projects');
    for (const p of projects) {
      await client.query(`
        INSERT INTO projects (title, description, long_description, image, technologies, role, outcome, link, github_link, featured, sort_order, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `, [p.title, p.description, p.long_description, p.image, p.technologies, p.role, p.outcome, p.link, p.github_link, p.featured, p.sort_order, p.is_active]);
    }

    // 2. Experience
    const experience = [
      {
        company: 'Altertec AI',
        role: 'AI Research & Innovation Lead',
        location: 'Islamabad, Pakistan',
        period: '2023 - Present',
        description: JSON.stringify([
          'Leading a team of AI researchers and developers',
          'Architecting scalable AI solutions and automated agents',
          'Driving technological impact through innovative research'
        ]),
        is_active: true,
        sort_order: 1
      },
      {
        company: 'Devai Consultants',
        role: 'Founder',
        location: 'Islamabad, Pakistan',
        period: '2022 - Present',
        description: JSON.stringify([
          'Connecting clients with AI developers',
          'Managing project lifecycles and technical delivery',
          'Strategic growth and business development'
        ]),
        is_active: true,
        sort_order: 2
      }
    ];

    await client.query('DELETE FROM experience');
    for (const e of experience) {
      await client.query(`
        INSERT INTO experience (company, role, location, period, description, is_active, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [e.company, e.role, e.location, e.period, e.description, e.is_active, e.sort_order]);
    }

    // 3. Education
    const education = [
      {
        institution: 'University in Islamabad',
        degree: 'Bachelor of Science in AI / Computer Science',
        period: '2019 - 2023',
        description: 'Focus on Machine Learning, NLP, and Full-stack Development.',
        is_active: true,
        sort_order: 1
      }
    ];

    await client.query('DELETE FROM education');
    for (const edu of education) {
      await client.query(`
        INSERT INTO education (institution, degree, period, description, is_active, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [edu.institution, edu.degree, edu.period, edu.description, edu.is_active, edu.sort_order]);
    }

    await client.query('COMMIT');
    console.log('✅ CV Data seeding completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
