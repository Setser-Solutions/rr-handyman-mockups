import { NextRequest, NextResponse } from 'next/server';
import {
  makeAdminToken,
  getAdminPassword,
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_MAX_AGE,
} from '@/lib/admin-auth';

// POST /api/admin/auth/login
// Body: { password: string }
// Sets an HttpOnly cookie on success.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body.password !== 'string') {
      return NextResponse.json({ ok: false, error: 'Password required.' }, { status: 400 });
    }
    if (body.password !== getAdminPassword()) {
      // Slight delay to mitigate timing attacks.
      await new Promise((r) => setTimeout(r, 300));
      return NextResponse.json({ ok: false, error: 'Incorrect password.' }, { status: 401 });
    }
    const token = makeAdminToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ADMIN_COOKIE_MAX_AGE,
    });
    return res;
  } catch (err) {
    console.error('[api/admin/auth/login]', err);
    return NextResponse.json(
      { ok: false, error: 'Login failed.' },
      { status: 500 },
    );
  }
}
