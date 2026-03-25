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
  const res = await pool.query('SELECT * FROM projects ORDER BY sort_order ASC');
  return NextResponse.json(res.rows);
}

export async function POST(req: Request) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { title, description, long_description, image, github_link, link, technologies, role, outcome, featured, sort_order } = body;
  const pool = getPool();
  const res = await pool.query(
    'INSERT INTO projects (title, description, long_description, image, github_link, link, technologies, role, outcome, featured, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
    [title, description, long_description, image, github_link, link, JSON.stringify(technologies || []), role, outcome, featured || 0, sort_order]
  );
  broadcastEvent('projects', 'created', res.rows[0]);
  return NextResponse.json(res.rows[0]);
}

export async function PUT(req: Request) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { id, title, description, long_description, image, github_link, link, technologies, role, outcome, featured, sort_order, is_active } = body;
  const pool = getPool();
  await pool.query(
    'UPDATE projects SET title = $1, description = $2, long_description = $3, image = $4, github_link = $5, link = $6, technologies = $7, role = $8, outcome = $9, featured = $10, sort_order = $11, is_active = $12, updated_at = CURRENT_TIMESTAMP WHERE id = $13',
    [title, description, long_description, image, github_link, link, JSON.stringify(technologies || []), role, outcome, featured, sort_order, is_active, id]
  );
  broadcastEvent('projects', 'updated', { success: true });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const pool = getPool();
  await pool.query('DELETE FROM projects WHERE id = $1', [id]);
  broadcastEvent('projects', 'deleted', { id });
  return NextResponse.json({ success: true });
}
