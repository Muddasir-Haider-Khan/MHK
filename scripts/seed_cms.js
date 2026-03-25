require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seed() {
  const client = await pool.connect();
  console.log('Seeding initial data into Neon Postgres...');
  
  try {
    await client.query('BEGIN');

    // 1. Site Settings
    await client.query(`
      INSERT INTO site_settings (id, site_name, primary_color, secondary_color, meta_title_suffix)
      VALUES (1, 'MHK.', '#8b5cf6', '#ffffff', ' | MHK')
      ON CONFLICT (id) DO NOTHING;
    `);

    // 2. Navigation Items
    const navItems = [
      { label: 'Story', url: '#story', is_cta: false },
      { label: 'Skills', url: '#skills', is_cta: false },
      { label: 'Work', url: '#work', is_cta: false },
      { label: 'Journey', url: '#experience', is_cta: false },
      { label: 'Process', url: '#process', is_cta: false },
      { label: "Let's Talk", url: '#contact', is_cta: true }
    ];

    await client.query('DELETE FROM nav_items'); // Clear for clean seed
    let order = 1;
    for (const item of navItems) {
      await client.query(`
        INSERT INTO nav_items (label, url, order_index, is_cta_button)
        VALUES ($1, $2, $3, $4)
      `, [item.label, item.url, order++, item.is_cta]);
    }

    // 3. Hero Section for Home
    await client.query(`
      INSERT INTO hero_sections (page_slug, badge_text, heading, heading_highlight, subheading, cta_primary_text, cta_primary_url, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (page_slug) DO UPDATE SET
        badge_text = EXCLUDED.badge_text,
        heading = EXCLUDED.heading,
        subheading = EXCLUDED.subheading;
    `, [
      'home',
      'Based in Islamabad',
      'MHK',
      '',
      'Top AI Engineer',
      "Let's Talk",
      '#contact',
      true
    ]);

    await client.query('COMMIT');
    console.log('✅ Seed completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
