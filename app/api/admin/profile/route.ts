import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { broadcastEvent } from '@/lib/sse';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { name, role, location, email, phone, linkedin, summary, narrative, philosophy } = body;

    const pool = getPool();
    await pool.query(
      `UPDATE profile SET 
        name = $1, role = $2, location = $3, email = $4, phone = $5, 
        linkedin = $6, summary = $7, narrative = $8, philosophy = $9,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1`,
      [
        name, role, location, email, phone, linkedin, summary, 
        typeof narrative === 'string' ? narrative : JSON.stringify(narrative),
        philosophy
      ]
    );

    broadcastEvent('profile', 'updated', { success: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin Profile Update Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
