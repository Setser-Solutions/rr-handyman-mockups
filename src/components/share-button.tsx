'use client';

import { useState } from 'react';
import { Check, Link2, Share2 } from 'lucide-react';

interface ShareButtonProps {
  /** Current design key — encoded into the URL hash so reloads land on it. */
  design: 'modern' | 'portfolio' | 'trusted' | 'compare';
}

// Feature-detect Web Share API once at module load (client-only). This avoids
// a setState-in-effect for the canShare check.
const CAN_SHARE =
  typeof navigator !== 'undefined' &&
  typeof navigator.share === 'function';

/**
 * Compact share button that copies a deep-link to the current view to the
 * clipboard. The link uses a `#design=<key>` URL hash that page.tsx reads
 * on mount to auto-select that design (so the client can share "look at
 * design 2" with a collaborator).
 *
 * Falls back to the native Web Share API on mobile when available.
 */
export function ShareButton({ design }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const url = (() => {
    if (typeof window === 'undefined') return '';
    const u = new URL(window.location.href);
    u.hash = design === 'compare' ? '#design=compare' : `#design=${design}`;
    return u.toString();
  })();

  async function handleShare() {
    const shareData = {
      title: 'R&R Handyman — Website Mockups',
      text: `Check out the ${design === 'compare' ? 'all 3 designs' : design} mockup for the handyman site`,
      url,
    };
    if (CAN_SHARE) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // user cancelled — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked — do nothing
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:border-stone-900 hover:bg-stone-100 sm:text-sm"
      title="Copy a shareable link to this view"
      aria-label="Share this view"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
          <span className="hidden sm:inline">Link copied!</span>
        </>
      ) : CAN_SHARE ? (
        <>
          <Share2 className="h-3.5 w-3.5" aria-hidden />
          <span className="hidden sm:inline">Share</span>
        </>
      ) : (
        <>
          <Link2 className="h-3.5 w-3.5" aria-hidden />
          <span className="hidden sm:inline">Copy link</span>
        </>
      )}
    </button>
  );
}
