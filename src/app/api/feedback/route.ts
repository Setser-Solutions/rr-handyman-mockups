import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const VALID_DESIGNS = new Set(['modern', 'portfolio', 'trusted']);

// POST /api/feedback — submit a per-design review note from the client.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const design = typeof body.design === 'string' ? body.design.trim() : '';
    const notes = typeof body.notes === 'string' ? body.notes.trim() : '';
    const rating = typeof body.rating === 'number' && body.rating >= 1 && body.rating <= 5 ? body.rating : null;

    if (!VALID_DESIGNS.has(design)) {
      return NextResponse.json({ ok: false, error: 'Invalid design key.' }, { status: 400 });
    }
    if (!notes || notes.length < 3 || notes.length > 2000) {
      return NextResponse.json({ ok: false, error: 'Notes must be 3–2000 characters.' }, { status: 400 });
    }

    const fb = await db.designFeedback.create({
      data: { design, notes, rating },
      select: { id: true, design: true, notes: true, rating: true, createdAt: true },
    });

    return NextResponse.json({ ok: true, feedback: fb }, { status: 201 });
  } catch (err) {
    console.error('[api/feedback POST]', err);
    return NextResponse.json(
      { ok: false, error: 'Failed to save feedback.' },
      { status: 500 },
    );
  }
}
