import { NextResponse } from 'next/server';
import { verifyAdminAuthFromCookies } from '@/lib/admin-auth';

// GET /api/admin/auth/status — returns whether the current request is
// authenticated as admin. Used by the login gate to decide whether to
// show the login form or redirect to /admin/leads.
export async function GET() {
  const authed = await verifyAdminAuthFromCookies();
  return NextResponse.json({ ok: true, authed });
}
