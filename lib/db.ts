import { Pool } from 'pg';

let pool: Pool | undefined;

export function getPool(): Pool {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ DATABASE_URL is not defined in environment variables');
    // Provide a dummy pool-like object to prevent crash on instantiating
    return {
      query: () => { throw new Error('DATABASE_URL is missing'); },
      connect: () => { throw new Error('DATABASE_URL is missing'); },
      end: () => Promise.resolve()
    } as unknown as Pool;
  }

  pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    },
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err);
  });

  return pool;
}

export const query = (text: string, params?: any[]) => getPool().query(text, params);

export async function initDB() {
  const p = getPool();
  if (!p.connect) return; 

  console.log('📡 Initializing PostgreSQL Database...');
  const client = await p.connect();
  try {
    await client.query('BEGIN');

    // Create tables individually for better stability
    await client.query(`CREATE TABLE IF NOT EXISTS profile (
      id SERIAL PRIMARY KEY, 
      name TEXT DEFAULT 'Muddasir Haider Khan', 
      title TEXT DEFAULT 'Creative AI Engineer', 
      bio TEXT DEFAULT 'I architect intelligent systems...', 
      tagline TEXT DEFAULT 'Based in Islamabad', 
      email TEXT DEFAULT 'muddasirhaider048@gmail.com', 
      github TEXT DEFAULT '', 
      linkedin TEXT DEFAULT '', 
      twitter TEXT DEFAULT '', 
      website TEXT DEFAULT '', 
      avatar TEXT DEFAULT '', 
      philosophy TEXT DEFAULT 'I build systems that run quietly for years.', 
      narrative TEXT DEFAULT '["Hello there.", "I see you are looking for something specific.", "Something that solves a problem...", "...and looks good doing it.", "I build with precision.", "Every line of code has a purpose."]'
    )`);
    await client.query(`CREATE TABLE IF NOT EXISTS skills (id SERIAL PRIMARY KEY, name TEXT NOT NULL, category TEXT DEFAULT 'General', level INTEGER DEFAULT 80, description TEXT DEFAULT '', icon TEXT DEFAULT '', sort_order INTEGER DEFAULT 0)`);
    await client.query(`CREATE TABLE IF NOT EXISTS projects (id SERIAL PRIMARY KEY, title TEXT NOT NULL, description TEXT DEFAULT '', long_description TEXT DEFAULT '', image TEXT DEFAULT '', technologies TEXT DEFAULT '[]', role TEXT DEFAULT '', outcome TEXT DEFAULT '', link TEXT DEFAULT '', github_link TEXT DEFAULT '', featured INTEGER DEFAULT 0, sort_order INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    await client.query(`CREATE TABLE IF NOT EXISTS experience (id SERIAL PRIMARY KEY, company TEXT NOT NULL, position TEXT NOT NULL, start_date TEXT DEFAULT '', end_date TEXT DEFAULT '', description TEXT DEFAULT '', technologies TEXT DEFAULT '[]', current INTEGER DEFAULT 0, sort_order INTEGER DEFAULT 0)`);
    await client.query(`CREATE TABLE IF NOT EXISTS education (id SERIAL PRIMARY KEY, institution TEXT NOT NULL, degree TEXT NOT NULL, field TEXT DEFAULT '', start_date TEXT DEFAULT '', end_date TEXT DEFAULT '', description TEXT DEFAULT '', sort_order INTEGER DEFAULT 0)`);
    await client.query(`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT DEFAULT '')`);
    await client.query(`CREATE TABLE IF NOT EXISTS media (id SERIAL PRIMARY KEY, filename TEXT NOT NULL, original_name TEXT NOT NULL, mimetype TEXT DEFAULT '', size INTEGER DEFAULT 0, uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);

    // Seed profile if empty
    const profileRes = await client.query('SELECT COUNT(*) FROM profile');
    if (parseInt(profileRes.rows[0].count) === 0) {
      await client.query('INSERT INTO profile (id) VALUES (1)');
    }

    await client.query('COMMIT');
    console.log('✅ PostgreSQL Database schema and seeding verified');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Database initialization error:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function ping() {
  try {
    const res = await query('SELECT NOW()');
    return res.rows[0];
  } catch (err: any) {
    console.error('❌ Database ping failed:', err.message);
    throw err;
  }
}
