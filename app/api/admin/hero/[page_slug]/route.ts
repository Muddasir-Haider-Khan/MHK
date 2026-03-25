import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { broadcastEvent } from '@/lib/sse';
import { cookies } from 'next/headers';

async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value === 'true';
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ page_slug: string }> | { page_slug: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const slug = resolvedParams.page_slug;
    const data = await request.json();
    
    if (!slug) {
      return NextResponse.json({ error: 'Page slug is required' }, { status: 400 });
    }

    const pool = getPool();
    const client = await pool.connect();
    
    try {
      // Upsert hero section for this page
      const query = `
        INSERT INTO hero_sections (page_slug, badge_text, heading, heading_highlight, subheading, cta_primary_text, cta_primary_url, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (page_slug) DO UPDATE SET
          badge_text = EXCLUDED.badge_text,
          heading = EXCLUDED.heading,
          heading_highlight = EXCLUDED.heading_highlight,
          subheading = EXCLUDED.subheading,
          cta_primary_text = EXCLUDED.cta_primary_text,
          cta_primary_url = EXCLUDED.cta_primary_url,
          is_active = EXCLUDED.is_active,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *;
      `;
      
      const values = [
        slug,
        data.badge_text || '',
        data.heading || '',
        data.heading_highlight || '',
        data.subheading || '',
        data.cta_primary_text || '',
        data.cta_primary_url || '',
        data.is_active !== undefined ? data.is_active : true
      ];

      const result = await client.query(query, values);
      const updatedHero = result.rows[0];

      // Broadcast changes to trigger instant UI refresh
      broadcastEvent('hero', 'updated', updatedHero);

      return NextResponse.json({
        success: true,
        data: updatedHero,
        message: 'Hero section updated successfully'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating hero section:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
