const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const query = (text, params) => pool.query(text, params);

async function initDB() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query('CREATE TABLE IF NOT EXISTS profile (id SERIAL PRIMARY KEY, name TEXT DEFAULT \'Muddasir Haider Khan\', title TEXT DEFAULT \'Creative AI Engineer\', bio TEXT DEFAULT \'I architect intelligent systems...\', tagline TEXT DEFAULT \'Based in Islamabad\', email TEXT DEFAULT \'muddasirhaider048@gmail.com\', github TEXT DEFAULT \'\', linkedin TEXT DEFAULT \'\', twitter TEXT DEFAULT \'\', website TEXT DEFAULT \'\', avatar TEXT DEFAULT \'\', philosophy TEXT DEFAULT \'I build systems that run quietly for years.\', narrative TEXT DEFAULT \'["Hello there.", "I see you are looking for something specific.", "Something that solves a problem...", "...and looks good doing it.", "I build with precision.", "Every line of code has a purpose."]\')');
    console.log('✅ Table profile created');

    await client.query('CREATE TABLE IF NOT EXISTS skills (id SERIAL PRIMARY KEY, name TEXT NOT NULL, category TEXT DEFAULT \'General\', level INTEGER DEFAULT 80, description TEXT DEFAULT \'\', icon TEXT DEFAULT \'\', sort_order INTEGER DEFAULT 0)');
    console.log('✅ Table skills created');

    await client.query('CREATE TABLE IF NOT EXISTS projects (id SERIAL PRIMARY KEY, title TEXT NOT NULL, description TEXT DEFAULT \'\', long_description TEXT DEFAULT \'\', image TEXT DEFAULT \'\', technologies TEXT DEFAULT \'[]\', role TEXT DEFAULT \'\', outcome TEXT DEFAULT \'\', link TEXT DEFAULT \'\', github_link TEXT DEFAULT \'\', featured INTEGER DEFAULT 0, sort_order INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');
    console.log('✅ Table projects created');

    await client.query('CREATE TABLE IF NOT EXISTS experience (id SERIAL PRIMARY KEY, company TEXT NOT NULL, position TEXT NOT NULL, start_date TEXT DEFAULT \'\', end_date TEXT DEFAULT \'\', description TEXT DEFAULT \'\', technologies TEXT DEFAULT \'[]\', current INTEGER DEFAULT 0, sort_order INTEGER DEFAULT 0)');
    console.log('✅ Table experience created');

    await client.query('CREATE TABLE IF NOT EXISTS education (id SERIAL PRIMARY KEY, institution TEXT NOT NULL, degree TEXT NOT NULL, field TEXT DEFAULT \'\', start_date TEXT DEFAULT \'\', end_date TEXT DEFAULT \'\', description TEXT DEFAULT \'\', sort_order INTEGER DEFAULT 0)');
    console.log('✅ Table education created');

    await client.query('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT DEFAULT \'\')');
    console.log('✅ Table settings created');

    await client.query('CREATE TABLE IF NOT EXISTS media (id SERIAL PRIMARY KEY, filename TEXT NOT NULL, original_name TEXT NOT NULL, mimetype TEXT DEFAULT \'\', size INTEGER DEFAULT 0, uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');
    console.log('✅ Table media created');

    // Seed default profile if empty
    const profileRes = await client.query('SELECT COUNT(*) FROM profile');
    if (parseInt(profileRes.rows[0].count) === 0) {
      await client.query('INSERT INTO profile (id) VALUES (1)');
    }

    // Seed default skills if empty
    const skillRes = await client.query('SELECT COUNT(*) FROM skills');
    if (parseInt(skillRes.rows[0].count) === 0) {
      const defaultSkills = [
        ['Python', 'AI & Data', 95, 'Deep expertise in Python for AI/ML pipelines, data analysis, and backend development.', '🐍', 1],
        ['PyTorch', 'AI & Data', 85, 'Building and training neural networks for complex AI applications.', '🔥', 2],
        ['TensorFlow', 'AI & Data', 80, 'Production-grade machine learning model deployment and training.', '🧠', 3],
        ['Pandas', 'AI & Data', 90, 'Advanced data manipulation, cleaning, and analysis at scale.', '🐼', 4],
        ['JavaScript', 'Web Development', 90, 'Full-stack JavaScript development with modern ES6+ patterns.', '⚡', 5],
        ['React', 'Web Development', 85, 'Building interactive, component-based user interfaces.', '⚛️', 6],
        ['Next.js', 'Web Development', 80, 'Server-side rendered applications with optimal performance.', '▲', 7],
        ['Node.js', 'Web Development', 85, 'Scalable backend services and REST API development.', '🟢', 8],
        ['Tailwind CSS', 'Web Development', 90, 'Rapid UI development with utility-first CSS framework.', '🎨', 9],
        ['SQL', 'Database', 85, 'Complex queries, database design, and optimization.', '🗃️', 10],
        ['Git', 'DevOps', 90, 'Version control, branching strategies, and collaboration.', '📦', 11],
        ['Docker', 'DevOps', 75, 'Containerization and deployment automation.', '🐳', 12],
        ['GSAP', 'Creative', 85, 'High-performance web animations and interactive experiences.', '✨', 13],
        ['Figma', 'Design', 75, 'UI/UX design, prototyping, and design systems.', '🎯', 14],
      ];
      for (const s of defaultSkills) {
        await client.query('INSERT INTO skills (name, category, level, description, icon, sort_order) VALUES ($1, $2, $3, $4, $5, $6)', s);
      }
    }

    // Seed default projects if empty
    const projectRes = await client.query('SELECT COUNT(*) FROM projects');
    if (parseInt(projectRes.rows[0].count) === 0) {
      const defaultProjects = [
        [
          'AI Data Analysis Platform',
          'A powerful tool leveraging Python and Pandas for intelligent data processing.',
          'Built an end-to-end data analysis platform that processes millions of records, generates insights through ML models, and presents results through an interactive dashboard. The system reduced analysis time by 70% for the client.',
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
          JSON.stringify(['Python', 'Pandas', 'Scikit-learn', 'FastAPI', 'React']),
          'Lead Developer & AI Architect',
          'Reduced analysis time by 70%, processing 2M+ records daily.',
          '',
          1, 1
        ],
        [
          'Predictive Analytics Engine',
          'Forecasting market trends with 85% accuracy using ensemble ML models.',
          'Designed and deployed a predictive analytics engine that combines multiple ML models to forecast market trends. The system uses real-time data feeds, automated retraining, and provides actionable insights through a clean dashboard.',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
          JSON.stringify(['Python', 'PyTorch', 'PostgreSQL', 'Docker', 'AWS']),
          'ML Engineer',
          '85% prediction accuracy, deployed to production serving 10K+ users.',
          '',
          1, 2
        ],
        [
          'Real-Time Chat Intelligence',
          'NLP-powered chat system with sentiment analysis and smart routing.',
          'Built a real-time chat platform with integrated NLP capabilities. The system analyzes message sentiment in real-time, provides smart response suggestions, and automatically routes conversations based on intent classification.',
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop',
          JSON.stringify(['Node.js', 'Socket.io', 'TensorFlow.js', 'React', 'MongoDB']),
          'Full-Stack Developer',
          'Handles 50K+ messages/day with 92% sentiment accuracy.',
          '',
          1, 3
        ],
      ];
      for (const p of defaultProjects) {
        await client.query('INSERT INTO projects (title, description, long_description, image, technologies, role, outcome, link, featured, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', p);
      }
    }

    // Seed default experience if empty
    const expRes = await client.query('SELECT COUNT(*) FROM experience');
    if (parseInt(expRes.rows[0].count) === 0) {
      const defaultExp = [
        ['Freelance', 'AI Engineer & Full-Stack Developer', '2023', 'Present', 'Building AI-powered applications, data pipelines, and modern web platforms for clients worldwide. Specializing in end-to-end solutions from model training to production deployment.', JSON.stringify(['Python', 'React', 'Node.js', 'PyTorch', 'AWS']), 1, 1],
        ['Tech Startup', 'Software Engineer', '2022', '2023', 'Developed and maintained multiple web applications, implemented CI/CD pipelines, and contributed to the core product architecture.', JSON.stringify(['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'Docker']), 0, 2],
      ];
      for (const e of defaultExp) {
        await client.query('INSERT INTO experience (company, position, start_date, end_date, description, technologies, current, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', e);
      }
    }

    // Seed default education if empty
    const eduRes = await client.query('SELECT COUNT(*) FROM education');
    if (parseInt(eduRes.rows[0].count) === 0) {
      await client.query('INSERT INTO education (institution, degree, field, start_date, end_date, description, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7)', [
        'University', 'Bachelor of Science', 'Computer Science', '2020', '2024', 'Focused on artificial intelligence, machine learning, and software engineering.', 1
      ]);
    }

    // Seed default settings
    const settingsRes = await client.query('SELECT COUNT(*) FROM settings');
    if (parseInt(settingsRes.rows[0].count) === 0) {
      const defaultSettings = [
        ['site_title', 'Muddasir Haider Khan | AI Creative Engineer'],
        ['projects_completed', '25'],
        ['years_experience', '3'],
        ['technologies_used', '30']
      ];
      for (const [key, value] of defaultSettings) {
        await client.query('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING', [key, value]);
      }
    }

    await client.query('COMMIT');
    console.log('✅ PostgreSQL Database initialized and seeded');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Database initialization error:', error);
  } finally {
    client.release();
  }
}

module.exports = {
  query,
  pool,
  initDB
};
