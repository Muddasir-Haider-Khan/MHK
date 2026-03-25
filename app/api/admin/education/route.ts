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
  const res = await pool.query('SELECT * FROM education ORDER BY sort_order ASC');
  return NextResponse.json(res.rows);
}

export async function POST(req: Request) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { institution, degree, field_of_study, location, start_date, end_date, description, sort_order } = body;
  const pool = getPool();
  const res = await pool.query(
    'INSERT INTO education (institution, degree, field_of_study, location, start_date, end_date, description, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [institution, degree, field_of_study, location, start_date, end_date, description, sort_order]
  );
  broadcastEvent('education', 'created', res.rows[0]);
  return NextResponse.json(res.rows[0]);
}

export async function PUT(req: Request) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { id, institution, degree, field_of_study, location, start_date, end_date, description, sort_order, is_active } = body;
  const pool = getPool();
  await pool.query(
    'UPDATE education SET institution = $1, degree = $2, field_of_study = $3, location = $4, start_date = $5, end_date = $6, description = $7, sort_order = $8, is_active = $9, updated_at = CURRENT_TIMESTAMP WHERE id = $10',
    [institution, degree, field_of_study, location, start_date, end_date, description, sort_order, is_active, id]
  );
  broadcastEvent('education', 'updated', { success: true });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const pool = getPool();
  await pool.query('DELETE FROM education WHERE id = $1', [id]);
  broadcastEvent('education', 'deleted', { id });
  return NextResponse.json({ success: true });
}
