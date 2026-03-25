import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pool = getPool();
    const client = await pool.connect();
    
    try {
      const result = await client.query('SELECT * FROM nav_items WHERE is_active = true ORDER BY order_index ASC');
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching nav items:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
