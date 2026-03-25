import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ page_slug: string }> | { page_slug: string } }
) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.page_slug;

    if (!slug) {
      return NextResponse.json({ error: 'Page slug is required' }, { status: 400 });
    }

    const pool = getPool();
    const client = await pool.connect();
    
    try {
      const result = await client.query('SELECT * FROM hero_sections WHERE page_slug = $1 AND is_active = true', [slug]);
      
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Hero section not found' }, { status: 404 });
      }

      return NextResponse.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(`Error fetching hero for slug:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
