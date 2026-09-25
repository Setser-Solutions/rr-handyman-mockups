import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createHash } from 'crypto';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { notifyNewLead } from '@/lib/notify';

// Simple in-memory rate limiting: max 5 lead submissions per IP per 10 min.
// For a mockup / small-business site this is plenty.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const hits = new Map<string, number[]>();

function rateLimitOk(key: string): boolean {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (arr.length >= RATE_LIMIT_MAX) {
    hits.set(key, arr);
    return false;
  }
  arr.push(now);
  hits.set(key, arr);
  return true;
}

function hashIp(ip: string): string {
  return createHash('sha256').update(`rr-handyman::${ip}`).digest('hex').slice(0, 16);
}

const VALID_DESIGNS = new Set(['modern', 'portfolio', 'trusted', 'final']);

/**
 * Normalize the service value from the form's Select into the human-readable
 * label we store in the DB. The 3 designs use different value schemes:
 *   - Modern/Trusted: "plumbing", "carpentry", "power-washing", "multiple", "not-sure"
 *   - Portfolio: uses BUSINESS.services[].id which is the same kebab ids + "other"
 *   - Some forms may also send the human-readable label directly.
 * We accept any of these and normalize to the canonical label.
 */
const SERVICE_ALIASES: Record<string, string> = {
  // kebab-case ids used by the Select components
  plumbing: 'Plumbing',
  carpentry: 'Carpentry',
  'power-washing': 'Power Washing',
  'power_washing': 'Power Washing',
  // "not sure / multiple" variants
  multiple: 'Multiple / Not sure',
  'not-sure': 'Multiple / Not sure',
  other: 'Multiple / Not sure',
  electrical: 'Electrical',
  // human-readable labels (pass through)
  Plumbing: 'Plumbing',
  Carpentry: 'Carpentry',
  'Power Washing': 'Power Washing',
  'Multiple / Not sure': 'Multiple / Not sure',
};

function normalizeService(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  return SERVICE_ALIASES[trimmed] ?? trimmed;
}

// POST /api/leads — submit a new lead from any mockup design's contact form.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const email = typeof body.email === 'string' && body.email.trim() ? body.email.trim() : null;
    const serviceRaw = typeof body.service === 'string' ? body.service.trim() : '';
    const service = normalizeService(serviceRaw);
    const message = typeof body.message === 'string' ? body.message.trim().slice(0, 2000) : null;
    const design = typeof body.design === 'string' && VALID_DESIGNS.has(body.design) ? body.design : null;
    const estimate = typeof body.estimate === 'string' && body.estimate.trim() ? body.estimate.trim().slice(0, 100) : null;

    // Validate required fields
    if (!name || name.length < 2 || name.length > 100) {
      return NextResponse.json({ ok: false, error: 'Please enter your name (2–100 chars).' }, { status: 400 });
    }
    if (!phone || phone.replace(/[^0-9]/g, '').length < 7) {
      return NextResponse.json({ ok: false, error: 'Please enter a valid phone number.' }, { status: 400 });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }
    // Service is optional — if provided, it's already normalized above.

    // Rate limit by IP hash
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')?.trim()
      || 'unknown';
    const ipH = hashIp(ip);
    if (!rateLimitOk(ipH)) {
      return NextResponse.json(
        { ok: false, error: 'Too many submissions. Please try again in a few minutes.' },
        { status: 429 },
      );
    }

    const lead = await db.lead.create({
      data: {
        name,
        phone,
        email,
        service,
        message,
        design,
        estimate,
        ipHash: ipH,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        service: true,
        message: true,
        design: true,
        estimate: true,
        createdAt: true,
      },
    });

    // Send SMS/email notification to Rick (silently skips if not configured).
    // We don't await this — it shouldn't block the API response.
    void notifyNewLead({
      name,
      phone,
      email,
      service,
      message,
      design,
      estimate,
    });

    return NextResponse.json({ ok: true, lead }, { status: 201 });
  } catch (err) {
    console.error('[api/leads POST]', err);
    return NextResponse.json(
      { ok: false, error: 'Something went wrong. Please call us directly.' },
      { status: 500 },
    );
  }
}

// GET /api/leads — list recent leads (admin dashboard).
// Requires admin auth (cookie). Returns last 50 with workflow fields.
export async function GET(req: NextRequest) {
  if (!verifyAdminAuth(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const leads = await db.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        service: true,
        message: true,
        design: true,
        estimate: true,
        contacted: true,
        contactedAt: true,
        starred: true,
        adminNote: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ ok: true, leads, count: leads.length });
  } catch (err) {
    console.error('[api/leads GET]', err);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch leads.' },
      { status: 500 },
    );
  }
}
