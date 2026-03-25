require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrate() {
  const client = await pool.connect();
  console.log('Connected to Neon PostgreSQL. Beginning migration...');
  
  try {
    await client.query('BEGIN');

    // Site Settings
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        site_name VARCHAR(255) DEFAULT 'MHK',
        site_logo_url VARCHAR(1024),
        site_favicon_url VARCHAR(1024),
        primary_color VARCHAR(50) DEFAULT '#8b5cf6',
        secondary_color VARCHAR(50) DEFAULT '#ffffff',
        font_heading VARCHAR(100) DEFAULT 'Clash Display',
        font_body VARCHAR(100) DEFAULT 'Outfit',
        contact_email VARCHAR(255),
        contact_phone VARCHAR(50),
        contact_address TEXT,
        social_facebook VARCHAR(1024),
        social_instagram VARCHAR(1024),
        social_twitter VARCHAR(1024),
        social_linkedin VARCHAR(1024),
        social_youtube VARCHAR(1024),
        social_whatsapp VARCHAR(1024),
        google_analytics_id VARCHAR(100),
        meta_title_suffix VARCHAR(255) DEFAULT ' | MHK',
        maintenance_mode BOOLEAN DEFAULT FALSE,
        maintenance_message TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Pages
    await client.query(`
      CREATE TABLE IF NOT EXISTS pages (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        meta_title VARCHAR(255),
        meta_description TEXT,
        og_image_url VARCHAR(1024),
        is_published BOOLEAN DEFAULT TRUE,
        is_in_nav BOOLEAN DEFAULT FALSE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Hero Sections
    await client.query(`
      CREATE TABLE IF NOT EXISTS hero_sections (
        id SERIAL PRIMARY KEY,
        page_slug VARCHAR(255) NOT NULL,
        badge_text VARCHAR(255),
        heading VARCHAR(255),
        heading_highlight VARCHAR(255),
        subheading TEXT,
        cta_primary_text VARCHAR(100),
        cta_primary_url VARCHAR(1024),
        cta_secondary_text VARCHAR(100),
        cta_secondary_url VARCHAR(1024),
        background_image_url VARCHAR(1024),
        background_video_url VARCHAR(1024),
        is_active BOOLEAN DEFAULT TRUE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(page_slug)
      );
    `);

    // Navigation Items
    await client.query(`
      CREATE TABLE IF NOT EXISTS nav_items (
        id SERIAL PRIMARY KEY,
        label VARCHAR(255) NOT NULL,
        url VARCHAR(1024) NOT NULL,
        parent_id INTEGER REFERENCES nav_items(id) ON DELETE CASCADE,
        order_index INTEGER DEFAULT 0,
        open_in_new_tab BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        is_cta_button BOOLEAN DEFAULT FALSE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Testimonials
    await client.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        author_name VARCHAR(255) NOT NULL,
        author_title VARCHAR(255),
        author_company VARCHAR(255),
        author_avatar_url VARCHAR(1024),
        content TEXT NOT NULL,
        rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
        is_featured BOOLEAN DEFAULT FALSE,
        order_index INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Team Members
    await client.query(`
      CREATE TABLE IF NOT EXISTS team_members (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        bio TEXT,
        avatar_url VARCHAR(1024),
        social_linkedin VARCHAR(1024),
        social_twitter VARCHAR(1024),
        social_email VARCHAR(255),
        order_index INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // FAQs
    await client.query(`
      CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        question VARCHAR(500) NOT NULL,
        answer TEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'general',
        order_index INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Pricing Plans
    await client.query(`
      CREATE TABLE IF NOT EXISTS pricing_plans (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        tagline VARCHAR(255),
        price_monthly DECIMAL(10, 2),
        price_yearly DECIMAL(10, 2),
        currency_symbol VARCHAR(10) DEFAULT '$',
        features JSONB DEFAULT '[]'::jsonb,
        cta_text VARCHAR(100),
        cta_url VARCHAR(1024),
        is_featured BOOLEAN DEFAULT FALSE,
        badge_text VARCHAR(100),
        order_index INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Stats
    await client.query(`
      CREATE TABLE IF NOT EXISTS stats (
        id SERIAL PRIMARY KEY,
        label VARCHAR(255) NOT NULL,
        value VARCHAR(255) NOT NULL,
        icon VARCHAR(100),
        description TEXT,
        order_index INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Gallery / Portfolio
    await client.query(`
      CREATE TABLE IF NOT EXISTS gallery_items (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(1024) NOT NULL,
        category VARCHAR(100),
        external_url VARCHAR(1024),
        order_index INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Announcements
    await client.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        message TEXT NOT NULL,
        cta_text VARCHAR(100),
        cta_url VARCHAR(1024),
        background_color VARCHAR(50) DEFAULT '#8b5cf6',
        text_color VARCHAR(50) DEFAULT '#ffffff',
        is_active BOOLEAN DEFAULT FALSE,
        show_from TIMESTAMP,
        show_until TIMESTAMP,
        is_dismissible BOOLEAN DEFAULT TRUE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Contact Submissions
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
        admin_notes TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT
      );
    `);

    // Media Library
    await client.query(`
      CREATE TABLE IF NOT EXISTS media_files (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        original_filename VARCHAR(255),
        file_url VARCHAR(1024) NOT NULL,
        file_type VARCHAR(100),
        file_size INTEGER,
        width INTEGER,
        height INTEGER,
        alt_text VARCHAR(255),
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Blog Posts
    await client.query(`
      CREATE TABLE IF NOT EXISTS post_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        color VARCHAR(50)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT,
        content TEXT,
        featured_image_url VARCHAR(1024),
        category_id INTEGER REFERENCES post_categories(id) ON DELETE SET NULL,
        status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
        published_at TIMESTAMP,
        meta_title VARCHAR(255),
        meta_description TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query('COMMIT');
    console.log('✅ PostgreSQL Schema Migration Complete!');
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Migration Failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
