import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Simple admin auth for the /admin/* routes.
 *
 * Approach:
 * - A single shared password stored in ADMIN_PASSWORD env var (default
 *   "rr-admin-2024" for the mockup — change before going live).
 * - On POST /api/admin/auth/login with the right password, we set an
 *   HttpOnly cookie `rr_admin` containing an HMAC of the password.
 * - verifyAdminAuth checks that cookie against the expected HMAC.
 *
 * This is intentionally simple (no users table, no sessions DB) — it's a
 * mockup admin gate, not a multi-user auth system. For production you'd
 * swap this for NextAuth.js credentials provider.
 */

const ADMIN_COOKIE = 'rr_admin';
// Mockup default password — the client should override via env var.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'rr-admin-2024';
// Secret used to HMAC the cookie value (so the cookie isn't just the
// plaintext password). Mockup default; override via env in production.
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'rr-handyman-mockup-secret-2024';

function expectedToken(): string {
  return createHmac('sha256', ADMIN_SECRET).update(ADMIN_PASSWORD).digest('hex');
}

/** Generate the cookie value to set on login. */
export function makeAdminToken(): string {
  return expectedToken();
}

export const ADMIN_COOKIE_NAME = ADMIN_COOKIE;
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Verify the admin cookie on an incoming request. Works in both
 * route handlers (NextRequest) and server components (via cookies()).
 *
 * In a route handler, pass the NextRequest. In a server component,
 * call verifyAdminAuthFromCookies() instead (since there's no req).
 */
export function verifyAdminAuth(req: Request): boolean {
  try {
    // Read cookie from the request's Cookie header.
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map((c) => {
        const [k, ...v] = c.split('=');
        return [k, decodeURIComponent(v.join('='))];
      }),
    );
    const token = cookies[ADMIN_COOKIE];
    if (!token) return false;
    const expected = expectedToken();
    if (token.length !== expected.length) return false;
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

/** Server-component variant: reads from next/headers cookies(). */
export async function verifyAdminAuthFromCookies(): Promise<boolean> {
  try {
    const store = await cookies();
    const token = store.get(ADMIN_COOKIE)?.value;
    if (!token) return false;
    const expected = expectedToken();
    if (token.length !== expected.length) return false;
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

/** The configured password (for the login route to compare against). */
export function getAdminPassword(): string {
  return ADMIN_PASSWORD;
}
