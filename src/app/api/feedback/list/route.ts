import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/feedback/list — list all per-design feedback notes (newest first).
export async function GET() {
  try {
    const feedback = await db.designFeedback.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        design: true,
        rating: true,
        notes: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ ok: true, feedback, count: feedback.length });
  } catch (err) {
    console.error('[api/feedback/list GET]', err);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch feedback.' },
      { status: 500 },
    );
  }
}
