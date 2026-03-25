import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { broadcastEvent } from '@/lib/sse';
import { cookies } from 'next/headers';

// Simple admin auth check
async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value === 'true';
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const pool = getPool();
    const client = await pool.connect();
    
    try {
      // Upsert global settings (assuming id 1 is the single global settings row)
      const query = `
        INSERT INTO site_settings (id, site_name, primary_color, secondary_color, meta_title_suffix, contact_email)
        VALUES (1, $1, $2, $3, $4, $5)
        ON CONFLICT (id) DO UPDATE SET
          site_name = EXCLUDED.site_name,
          primary_color = EXCLUDED.primary_color,
          secondary_color = EXCLUDED.secondary_color,
          meta_title_suffix = EXCLUDED.meta_title_suffix,
          contact_email = EXCLUDED.contact_email,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *;
      `;
      
      const values = [
        data.site_name || 'MHK',
        data.primary_color || '#8b5cf6',
        data.secondary_color || '#ffffff',
        data.meta_title_suffix || ' | MHK',
        data.contact_email || ''
      ];

      const result = await client.query(query, values);
      const updatedSettings = result.rows[0];

      // Broadcast changes to all connected SSE clients instantly
      broadcastEvent('settings', 'updated', updatedSettings);

      return NextResponse.json({
        success: true,
        data: updatedSettings,
        message: 'Site settings updated successfully'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
