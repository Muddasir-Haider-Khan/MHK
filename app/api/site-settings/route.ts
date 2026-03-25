import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pool = getPool();
    const client = await pool.connect();
    
    try {
      const result = await client.query('SELECT * FROM site_settings ORDER BY id ASC LIMIT 1');
      if (result.rows.length === 0) {
        // Return defaults if none exist
        return NextResponse.json({
          site_name: 'MHK',
          primary_color: '#8b5cf6',
          secondary_color: '#ffffff'
        });
      }
      return NextResponse.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
