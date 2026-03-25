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
  const res = await pool.query('SELECT * FROM experience ORDER BY sort_order ASC');
  return NextResponse.json(res.rows);
}

export async function POST(req: Request) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { company, role, location, start_date, end_date, is_current, description, technologies, sort_order } = body;
  const pool = getPool();
  const res = await pool.query(
    'INSERT INTO experience (company, role, location, start_date, end_date, is_current, description, technologies, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
    [company, role, location, start_date, end_date, is_current, description, JSON.stringify(technologies || []), sort_order]
  );
  broadcastEvent('experience', 'created', res.rows[0]);
  return NextResponse.json(res.rows[0]);
}

export async function PUT(req: Request) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { id, company, role, location, start_date, end_date, is_current, description, technologies, sort_order, is_active } = body;
  const pool = getPool();
  await pool.query(
    'UPDATE experience SET company = $1, role = $2, location = $3, start_date = $4, end_date = $5, is_current = $6, description = $7, technologies = $8, sort_order = $9, is_active = $10, updated_at = CURRENT_TIMESTAMP WHERE id = $11',
    [company, role, location, start_date, end_date, is_current, description, JSON.stringify(technologies || []), sort_order, is_active, id]
  );
  broadcastEvent('experience', 'updated', { success: true });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const pool = getPool();
  await pool.query('DELETE FROM experience WHERE id = $1', [id]);
  broadcastEvent('experience', 'deleted', { id });
  return NextResponse.json({ success: true });
}
