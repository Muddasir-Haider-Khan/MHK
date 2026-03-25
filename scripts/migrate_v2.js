require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  const client = await pool.connect();
  console.log('Running V2 Migration: Specific Content Models...');
  
  try {
    await client.query('BEGIN');

    // Drop existing tables to ensure clean schema (for this portfolio-specific migration)
    await client.query('DROP TABLE IF EXISTS profile, skills, experience, education, projects CASCADE');

    // Profile
    await client.query(`
      CREATE TABLE IF NOT EXISTS profile (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) DEFAULT 'Muddasir Haider Khan',
        role VARCHAR(255) DEFAULT 'AI Engineer',
        location VARCHAR(255) DEFAULT 'Islamabad, Pakistan',
        email VARCHAR(255) DEFAULT 'muddasirhaider048@gmail.com',
        phone VARCHAR(50) DEFAULT '03352767961',
        linkedin VARCHAR(1024) DEFAULT 'https://www.linkedin.com/in/muddasir-haider-khan',
        instagram VARCHAR(1024),
        facebook VARCHAR(1024),
        vsco VARCHAR(1024),
        cal_link VARCHAR(1024),
        summary TEXT,
        narrative TEXT, -- JSON array of strings for Story.tsx
        philosophy TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Skills
    await client.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        level INTEGER DEFAULT 90,
        description TEXT,
        icon VARCHAR(100),
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Experience
    await client.query(`
      CREATE TABLE IF NOT EXISTS experience (
        id SERIAL PRIMARY KEY,
        company VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        start_date VARCHAR(100),
        end_date VARCHAR(100),
        is_current BOOLEAN DEFAULT FALSE,
        description TEXT, -- Can be plain text or JSON
        technologies TEXT DEFAULT '[]', -- JSON array
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Education
    await client.query(`
      CREATE TABLE IF NOT EXISTS education (
        id SERIAL PRIMARY KEY,
        institution VARCHAR(255) NOT NULL,
        degree VARCHAR(255),
        field_of_study VARCHAR(255),
        location VARCHAR(255),
        start_date VARCHAR(100),
        end_date VARCHAR(100),
        description TEXT,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Projects
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        long_description TEXT,
        image VARCHAR(1024),
        github_link VARCHAR(1024),
        link VARCHAR(1024),
        technologies TEXT DEFAULT '[]', -- JSON array
        role VARCHAR(255),
        outcome TEXT,
        featured INTEGER DEFAULT 0,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seeding Real Data
    console.log('Seeding real user data...');

    // 1. Profile
    const narrative = JSON.stringify([
      "AI Engineer based in Islamabad.",
      "Leading research and innovation at Altertec AI.",
      "Founder of Devai Consultants.",
      "Passionate about delivering AI-driven solutions.",
      "Combining technical expertise with strategic leadership."
    ]);
    
    await client.query(`
      INSERT INTO profile (id, name, role, location, email, phone, linkedin, instagram, facebook, vsco, cal_link, summary, narrative)
      VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `, [
      'Muddasir Haider Khan',
      'AI Engineer',
      'Islamabad, Pakistan',
      'muddasirhaider048@gmail.com',
      '03352767961',
      'https://www.linkedin.com/in/muddasir-haider-khan',
      'https://www.instagram.com/_mudda5ir/',
      'https://www.facebook.com/profile.php?id=61581560218950',
      'https://vsco.co/mudda5ir/gallery',
      'https://cal.com/muddasir-haider-khan/discovery-call',
      'AI Engineer with experience in AI research, full-stack development, and product testing.',
      narrative
    ]);

    // 2. Skills
    const skills = [
      { name: 'AI Engineering', cat: 'AI/ML', icon: 'brain' },
      { name: 'Full-Stack Development', cat: 'Backend', icon: 'server' },
      { name: 'Front-End Development', cat: 'Frontend', icon: 'monitor' },
      { name: 'Data Analysis', cat: 'Database', icon: 'database' },
      { name: 'Product Testing', cat: 'Tools', icon: 'wrench' },
      { name: 'Communication', cat: 'Tools', icon: 'message-square' }
    ];
    
    for (let i = 0; i < skills.length; i++) {
      await client.query(`
        INSERT INTO skills (name, category, icon, sort_order)
        VALUES ($1, $2, $3, $4)
      `, [skills[i].name, skills[i].cat, skills[i].icon, i]);
    }

    // 3. Experience
    const exp = [
      { co: 'Altertec AI', role: 'AI Research & Innovation Lead', loc: 'Islamabad', start: 'Nov 2025', end: 'Present', cur: true },
      { co: 'Mars BPO', role: 'Verifier', loc: 'Rawalpindi', start: 'Nov 2025', end: 'Dec 2025', cur: false },
      { co: 'Devai Consultants', role: 'Company Owner', loc: 'Pakistan', start: 'July 2025', end: 'Oct 2025', cur: false }
    ];
    
    for (let i = 0; i < exp.length; i++) {
      await client.query(`
        INSERT INTO experience (company, role, location, start_date, end_date, is_current, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [exp[i].co, exp[i].role, exp[i].loc, exp[i].start, exp[i].end, exp[i].cur, i]);
    }

    // 4. Education
    const edu = [
      { inst: 'IMCB G-7/2', deg: 'ICS 2nd Year', field: 'Computer Science', start: '2024', end: '2026' },
      { inst: 'PIAIC', deg: 'Agentic AI Engineering', field: 'Artificial Intelligence', start: '2024', end: '2025' },
      { inst: 'Coursera', deg: 'Foundations of Project Management', field: 'Management', start: '2025', end: '2025' },
      { inst: 'IMCB G-7/2', deg: 'Matriculation', field: 'Computer Science', start: '2022', end: '2024' }
    ];
    
    for (let i = 0; i < edu.length; i++) {
      await client.query(`
        INSERT INTO education (institution, degree, field_of_study, start_date, end_date, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [edu[i].inst, edu[i].deg, edu[i].field, edu[i].start, edu[i].end, i]);
    }

    // 5. Projects
    const projects = [
      {
        title: 'Altertec AI Platform',
        desc: 'Advanced AI research platform for automated agent orchestration.',
        long: 'Architected and developed a full-scale AI platform for Altertec AI, enabling researchers to deploy LLM-based agents with ease.',
        img: '/images/projects/altertec-ai.png',
        techs: JSON.stringify(['React', 'Node.js', 'PyTorch', 'LangChain']),
        role: 'AI Research Lead',
        out: 'Increased workflow efficiency by 80%.',
        link: 'https://altertec.ai',
        git: '',
        feat: 1
      },
      {
        title: 'AREHMANLAB',
        desc: 'Clinical Laboratory Management & Analytics Platform.',
        long: 'A comprehensive management system for clinical laboratories, featuring automated report generation and patient analytics.',
        img: 'https://images.unsplash.com/photo-1579152276503-31581d966b6c?q=80&w=2070',
        techs: JSON.stringify(['Next.js', 'Tailwind CSS', 'PostgreSQL']),
        role: 'Lead Developer',
        out: 'Streamlined clinical operations for multi-center labs.',
        link: 'https://www.arehmanlab.com/',
        git: '',
        feat: 0
      },
      {
        title: 'LegalGram',
        desc: 'Legal Services Automation & Documentation System.',
        long: 'Simplifying legal processes through automated document generation and case management tools.',
        img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070',
        techs: JSON.stringify(['React', 'Firebase', 'Cloud Functions']),
        role: 'Full-Stack Engineer',
        out: 'Reduced document processing time by 60%.',
        link: 'https://preview--legalgram-dev.lovable.app/',
        git: '',
        feat: 0
      },
      {
        title: 'Crypto Trading Dashboard',
        desc: 'Real-time Crypto Analytics & Portfolio Tracking Dashboard.',
        long: 'Interactive dashboard for real-time cryptocurrency price tracking, technical analysis, and portfolio management.',
        img: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=2070',
        techs: JSON.stringify(['Next.js', 'Chart.js', 'WebSockets']),
        role: 'Frontend Architect',
        out: 'Achieved <100ms latency for real-time data updates.',
        link: 'https://preview--cryptocurrency-trading-dashboard-594.lovable.app/',
        git: '',
        feat: 0
      },
      {
        title: 'BunnyHop',
        desc: 'Modern E-commerce Streetwear & Apparel Store.',
        long: 'A high-performance e-commerce platform for streetwear, focusing on premium UX and seamless checkout.',
        img: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=2070',
        techs: JSON.stringify(['Shopify', 'Hydrogen', 'Tailwind']),
        role: 'E-commerce Specialist',
        out: 'Successfully launched with zero downtime on drop day.',
        link: 'https://bunnyhopstore.com/',
        git: '',
        feat: 0
      },
      {
        title: 'MedSurgX',
        desc: 'Medical & Surgical Equipment Solutions Provider.',
        long: 'Professional B2B platform for medical supply chain management and surgical equipment distribution.',
        img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070',
        techs: JSON.stringify(['Next.js', 'Directus', 'Tailwind']),
        role: 'Full-Stack Developer',
        out: 'Automated inventory tracking for 500+ SKUs.',
        link: 'https://medsurgx.com/',
        git: '',
        feat: 0
      },
      {
        title: 'Pehnish',
        desc: 'Premium E-commerce Fashion & Clothing Boutique.',
        long: 'A curated fashion experience featuring luxury clothing and high-end apparel collections.',
        img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070',
        techs: JSON.stringify(['Next.js', 'Framer Motion', 'Stripe']),
        role: 'UI/UX Developer',
        out: '25% increase in conversion through immersive design.',
        link: 'https://pehnish.vercel.app/',
        git: '',
        feat: 0
      }
    ];

    for (let i = 0; i < projects.length; i++) {
      const p = projects[i];
      await client.query(`
        INSERT INTO projects (title, description, long_description, image, technologies, role, outcome, link, github_link, featured, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [p.title, p.desc, p.long, p.img, p.techs, p.role, p.out, p.link, p.git, p.feat, i]);
    }

    await client.query('COMMIT');
    console.log('✅ V2 Migration Complete!');
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ V2 Migration Failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
