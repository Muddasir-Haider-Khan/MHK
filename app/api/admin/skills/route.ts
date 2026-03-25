import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { broadcastEvent } from '@/lib/sse';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return false;
  try {
    verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const pool = getPool();
  const res = await pool.query('SELECT * FROM skills ORDER BY sort_order ASC');
  return NextResponse.json(res.rows);
}

export async function POST(req: Request) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { name, category, level, icon, sort_order } = body;
  const pool = getPool();
  const res = await pool.query(
    'INSERT INTO skills (name, category, level, icon, sort_order) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, category, level, icon, sort_order]
  );
  broadcastEvent('skills', 'created', res.rows[0]);
  return NextResponse.json(res.rows[0]);
}

export async function PUT(req: Request) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { id, name, category, level, icon, sort_order, is_active } = body;
  const pool = getPool();
  await pool.query(
    'UPDATE skills SET name = $1, category = $2, level = $3, icon = $4, sort_order = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7',
    [name, category, level, icon, sort_order, is_active, id]
  );
  broadcastEvent('skills', 'updated', { success: true });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const pool = getPool();
  await pool.query('DELETE FROM skills WHERE id = $1', [id]);
  broadcastEvent('skills', 'deleted', { id });
  return NextResponse.json({ success: true });
}
