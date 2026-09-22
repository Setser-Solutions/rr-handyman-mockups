import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/admin-auth';

// PATCH /api/leads/[id] — update a lead's admin workflow state.
// Body: { contacted?: boolean, adminNote?: string }
// Requires admin auth (cookie).
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!verifyAdminAuth(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const data: { contacted?: boolean; contactedAt?: Date | null; adminNote?: string } = {};
    if (typeof body.contacted === 'boolean') {
      data.contacted = body.contacted;
      data.contactedAt = body.contacted ? new Date() : null;
    }
    if (typeof body.adminNote === 'string') {
      data.adminNote = body.adminNote.slice(0, 1000);
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ ok: false, error: 'No updatable fields provided.' }, { status: 400 });
    }

    const lead = await db.lead.update({
      where: { id },
      data,
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
        adminNote: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ ok: true, lead });
  } catch (err) {
    console.error('[api/leads/[id] PATCH]', err);
    return NextResponse.json(
      { ok: false, error: 'Failed to update lead.' },
      { status: 500 },
    );
  }
}

// DELETE /api/leads/[id] — permanently delete a lead.
// Requires admin auth (cookie).
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!verifyAdminAuth(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await params;
    await db.lead.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[api/leads/[id] DELETE]', err);
    return NextResponse.json(
      { ok: false, error: 'Failed to delete lead.' },
      { status: 500 },
    );
  }
}
