import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { broadcastEvent } from '@/lib/sse';
import { cookies } from 'next/headers';

async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value === 'true';
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const pool = getPool();
    const client = await pool.connect();
    
    try {
      const query = `
        INSERT INTO nav_items (label, url, parent_id, order_index, open_in_new_tab, is_active, is_cta_button)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;
      
      const values = [
        data.label,
        data.url,
        data.parent_id || null,
        data.order_index || 0,
        data.open_in_new_tab || false,
        data.is_active !== undefined ? data.is_active : true,
        data.is_cta_button || false
      ];

      const result = await client.query(query, values);
      const newNavItem = result.rows[0];

      broadcastEvent('nav', 'created', newNavItem);

      return NextResponse.json({
        success: true,
        data: newNavItem,
        message: 'Navigation item created successfully'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating nav item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    if (!data.id) return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });

    const pool = getPool();
    const client = await pool.connect();
    
    try {
      const query = `
        UPDATE nav_items 
        SET label = $1, url = $2, parent_id = $3, order_index = $4, 
            open_in_new_tab = $5, is_active = $6, is_cta_button = $7, updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING *;
      `;
      
      const values = [
        data.label,
        data.url,
        data.parent_id || null,
        data.order_index || 0,
        data.open_in_new_tab || false,
        data.is_active !== undefined ? data.is_active : true,
        data.is_cta_button || false,
        data.id
      ];

      const result = await client.query(query, values);
      if (result.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

      broadcastEvent('nav', 'updated', result.rows[0]);

      return NextResponse.json({
        success: true,
        data: result.rows[0],
        message: 'Navigation item updated successfully'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating nav item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });

    const pool = getPool();
    const client = await pool.connect();
    
    try {
      await client.query('DELETE FROM nav_items WHERE id = $1', [id]);
      broadcastEvent('nav', 'deleted', { id });
      return NextResponse.json({ success: true, message: 'Navigation item deleted' });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error deleting nav item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
