import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM experience WHERE is_active = true ORDER BY sort_order ASC');
    // Parse technologies JSON string
    const data = result.rows.map(row => ({
      ...row,
      technologies: typeof row.technologies === 'string' ? JSON.parse(row.technologies) : row.technologies
    }));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
