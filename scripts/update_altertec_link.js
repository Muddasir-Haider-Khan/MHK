require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

(async () => {
  try {
    const res = await pool.query('UPDATE projects SET link = $1 WHERE title ILIKE $2 RETURNING id, title, link', ['https://altertecai.com/', '%Altertec%']);
    console.log('Update success:', res.rows[0]);
  } catch(e) {
    console.error('Error:', e);
  } finally {
    await pool.end();
  }
})();
