'use client';

import { useEffect, useState } from 'react';
import { Loader2, MessageSquare, Send, Star, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BUSINESS } from '@/lib/business-info';

type DesignKey = 'modern' | 'portfolio' | 'trusted';

interface FeedbackEntry {
  id: string;
  design: string;
  rating: number | null;
  notes: string;
  createdAt: string;
}

const DESIGN_LABELS: Record<DesignKey, string> = {
  modern: 'Modern Professional',
  portfolio: 'Before/After Portfolio',
  trusted: 'Trusted Local Craftsman',
};

const ACCENT: Record<DesignKey, string> = {
  modern: 'bg-amber-500',
  portfolio: 'bg-emerald-500',
  trusted: 'bg-orange-500',
};

/** Format an ISO date string as a short relative time. */
function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Date.now() - then;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

interface DesignNotesProps {
  activeDesign: DesignKey;
}

/**
 * Slide-out drawer that lets the client leave per-design review notes
 * (rating + free-text) and see all previously-submitted notes.
 * Notes persist server-side via /api/feedback so the developer can read
 * them later via /api/feedback/list.
 */
export function DesignNotes({ activeDesign }: DesignNotesProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // When the drawer opens, fetch existing feedback entries.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    fetch('/api/feedback/list')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.ok && Array.isArray(data.feedback)) {
          setEntries(data.feedback);
        }
      })
      .catch(() => {
        /* swallow — drawer still works offline */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (notes.trim().length < 3) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          design: activeDesign,
          rating,
          notes: notes.trim(),
        }),
      });
      const data = await res.json().catch(() => null);
      if (data?.ok && data.feedback) {
        setEntries((prev) => [data.feedback, ...prev]);
        setNotes('');
        setRating(5);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:border-stone-900 hover:bg-stone-100 sm:text-sm"
          title="Leave per-design feedback notes for the developer"
        >
          <MessageSquare className="h-3.5 w-3.5" aria-hidden />
          <span className="hidden sm:inline">Design Notes</span>
          {entries.length > 0 && (
            <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-stone-900 px-1 text-[10px] font-bold text-white">
              {entries.length}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col gap-0 p-0"
      >
        <SheetHeader className="border-b border-stone-200 p-6 pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <span
              className={`h-2.5 w-2.5 rounded-full ${ACCENT[activeDesign]}`}
              aria-hidden
            />
            Design Notes
          </SheetTitle>
          <SheetDescription>
            Leave feedback on the design you&apos;re currently previewing (
            <strong className="font-semibold text-stone-700">
              {DESIGN_LABELS[activeDesign]}
            </strong>
            ). Notes are saved for the developer to review.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {/* Submit form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 border-b border-stone-200 p-6"
          >
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                Your rating
              </Label>
              <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((n) => {
                  const active = rating >= n;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      role="radio"
                      aria-checked={rating === n}
                      aria-label={`${n} star${n > 1 ? 's' : ''}`}
                      className="rounded p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          active
                            ? 'fill-amber-400 text-amber-500'
                            : 'fill-stone-100 text-stone-300'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="ml-2 text-sm font-medium text-stone-600">
                  {rating}/5
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="design-notes-input"
                className="text-xs font-semibold uppercase tracking-wide text-stone-500"
              >
                Notes for this design
              </Label>
              <Textarea
                id="design-notes-input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder={`What do you like about ${DESIGN_LABELS[activeDesign]}? What would you change? Which sections hit / miss?`}
                className="resize-y"
                maxLength={2000}
              />
              <p className="text-right text-[11px] text-stone-400">
                {notes.length}/2000
              </p>
            </div>

            <Button
              type="submit"
              disabled={submitting || notes.trim().length < 3}
              className="w-full bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Save note for {DESIGN_LABELS[activeDesign]}
                </>
              )}
            </Button>
          </form>

          {/* Existing entries */}
          <div className="p-6 pt-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                All notes ({entries.length})
              </h3>
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-stone-400" />}
            </div>
            {entries.length === 0 && !loading ? (
              <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-500">
                <MessageSquare className="mx-auto mb-2 h-6 w-6 text-stone-300" />
                No notes yet. Be the first to leave feedback on these mockups.
              </div>
            ) : (
              <ul className="space-y-3">
                {entries.map((e) => (
                  <li
                    key={e.id}
                    className="rounded-lg border border-stone-200 bg-white p-3 shadow-sm"
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className={`h-2 w-2 rounded-full ${ACCENT[e.design as DesignKey] ?? 'bg-stone-400'}`}
                          aria-hidden
                        />
                        <span className="text-xs font-semibold text-stone-700">
                          {DESIGN_LABELS[e.design as DesignKey] ?? e.design}
                        </span>
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {timeAgo(e.createdAt)}
                      </span>
                    </div>
                    {e.rating !== null && (
                      <div className="mb-1 flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < (e.rating ?? 0)
                                ? 'fill-amber-400 text-amber-500'
                                : 'fill-stone-200 text-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                    <p className="text-sm text-stone-700 whitespace-pre-wrap break-words">
                      {e.notes}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="border-t border-stone-200 bg-stone-50 p-4 text-[11px] text-stone-500">
          Notes are stored locally for {BUSINESS.brand} mockup review only and
          aren&apos;t visible to end users.
        </div>
      </SheetContent>
    </Sheet>
  );
}
