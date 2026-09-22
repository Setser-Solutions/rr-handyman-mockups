'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Check,
  ChevronUp,
  Eye,
  ImageIcon,
  Layers,
  Phone,
  Send,
  X,
} from 'lucide-react';
import { BUSINESS, SEO_KEYWORDS } from '@/lib/business-info';
import { ServiceEstimator } from '@/components/service-estimator';
import { DesignNotes } from '@/components/design-notes';
import { ShareButton } from '@/components/share-button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Static imports — fixes the Radix useId hydration mismatch that occurred
// with next/dynamic (ssr:true). All three designs are bundled; only the
// active one is rendered at a time so React's useId stays stable across
// server render and client hydration.
import DesignModern from '@/components/designs/design-modern';
import DesignPortfolio from '@/components/designs/design-portfolio';
import DesignTrusted from '@/components/designs/design-trusted';

type DesignKey = 'modern' | 'portfolio' | 'trusted';

const DESIGNS: {
  key: DesignKey;
  shortLabel: string;
  name: string;
  tag: string;
  desc: string;
  accent: string; // tailwind bg class for the dot
  ring: string; // tailwind ring/border class for active state
  docTitle: string;
}[] = [
  {
    key: 'modern',
    shortLabel: 'Modern',
    name: 'Modern Professional',
    tag: 'Bold · Dark · Energetic',
    desc: 'Dark hero with amber accents. Contractor-grade confidence, with strong CTAs and an interactive gallery.',
    accent: 'bg-amber-500',
    ring: 'ring-amber-500/40',
    docTitle: 'Design 1 · Modern Professional',
  },
  {
    key: 'portfolio',
    shortLabel: 'Portfolio',
    name: 'Before/After Portfolio',
    tag: 'Light · Visual · Photo-led',
    desc: 'Light, photography-driven layout with a split before/after hero, masonry gallery, and case-study spotlight.',
    accent: 'bg-emerald-500',
    ring: 'ring-emerald-500/40',
    docTitle: 'Design 2 · Before/After Portfolio',
  },
  {
    key: 'trusted',
    shortLabel: 'Trusted',
    name: 'Trusted Local Craftsman',
    tag: 'Warm · Story-driven · Friendly',
    desc: 'Warm, meet-the-owner vibe with a personal story, process section, and trust badges throughout.',
    accent: 'bg-orange-500',
    ring: 'ring-orange-500/40',
    docTitle: 'Design 3 · Trusted Local Craftsman',
  },
];

const DESIGN_MAP: Record<DesignKey, () => JSX.Element> = {
  modern: DesignModern,
  portfolio: DesignPortfolio,
  trusted: DesignTrusted,
};

function isDesignKey(s: string | null | undefined): s is DesignKey {
  return s === 'modern' || s === 'portfolio' || s === 'trusted';
}

/**
 * Update the <meta property="og:image"> and twitter:image tags in <head>
 * so social-media crawlers pick up the active design's branded OG card.
 * Crawlers don't run JS, but this covers the case where someone shares the
 * URL after the page has loaded (e.g. via the ShareButton's copied link).
 */
function updateOgImage(design: DesignKey | 'default') {
  if (typeof document === 'undefined') return;
  const ogUrl = `/api/og?design=${design}`;
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) {
    ogImage.setAttribute('content', ogUrl);
  }
  const twImage = document.querySelector('meta[name="twitter:image"]');
  if (twImage) {
    twImage.setAttribute('content', ogUrl);
  }
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute(
      'content',
      design === 'default'
        ? `${BUSINESS.brand} — Website Mockups`
        : `${BUSINESS.brand} — ${DESIGNS.find((d) => d.key === design)?.name ?? ''}`,
    );
  }
}

export default function Home() {
  const [active, setActive] = useState<DesignKey>('modern');
  const [compareMode, setCompareMode] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [footerInView, setFooterInView] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const scrollRef = useRef(0);

  // ===== Read URL hash on mount + on hashchange to deep-link to a specific design =====
  // Supports #design=modern|portfolio|trusted|compare so the client can
  // share a direct link to a specific mockup (or compare mode).
  useEffect(() => {
    function applyHash() {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash.replace(/^#/, '');
      const params = new URLSearchParams(hash.includes('=') ? hash : `design=${hash}`);
      const d = params.get('design');
      if (d === 'compare') {
        setCompareMode(true);
      } else if (isDesignKey(d)) {
        setActive(d);
        setCompareMode(false);
      }
    }
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  // ===== Update URL hash when active design / compare mode changes =====
  // so the URL stays shareable & survives reloads.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = compareMode ? '#design=compare' : `#design=${active}`;
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', hash);
    }
  }, [active, compareMode]);

  // ===== Global keyboard shortcuts =====
  // 1 / 2 / 3  → switch to that design
  // c / C      → toggle compare mode
  // b / B      → collapse/expand the switcher banner
  // ?          → toggle the keyboard shortcuts help dialog
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Ignore if user is typing in a form field
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable || t.tagName === 'SELECT')) {
        return;
      }
      if (e.key === '1') { setActive('modern'); setCompareMode(false); }
      else if (e.key === '2') { setActive('portfolio'); setCompareMode(false); }
      else if (e.key === '3') { setActive('trusted'); setCompareMode(false); }
      else if (e.key === 'c' || e.key === 'C') { setCompareMode((v) => !v); }
      else if (e.key === 'b' || e.key === 'B') { setBannerOpen((v) => !v); }
      else if (e.key === '?') { setHelpOpen((v) => !v); }
      else if (e.key === 'Escape') {
        if (compareMode) setCompareMode(false);
        setHelpOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [compareMode]);

  // ===== Scroll progress + back-to-top visibility =====
  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const top = window.scrollY || doc.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      const pct = height > 0 ? Math.min(100, (top / height) * 100) : 0;
      scrollRef.current = top;
      setScrollPct(pct);
      setScrolled(top > 600);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ===== Hide mobile floating CTAs when the footer is in view =====
  // so they don't cover the footer's contact info. Uses IntersectionObserver
  // on the <footer> element of the active design.
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          setFooterInView(e.isIntersecting);
        }
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.05 },
    );
    // Observe any footer inside main; re-observe when active design changes.
    const foot = document.querySelector('main footer');
    if (foot) io.observe(foot);
    return () => io.disconnect();
  }, [active, compareMode]);

  // ===== Scroll-to-top when the active design changes (non-compare mode) =====
  useEffect(() => {
    if (!compareMode && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [active, compareMode]);

  // ===== Per-design document.title + OG image meta tag =====
  // Updates the browser tab title AND the <meta property="og:image"> tag
  // so sharing the current URL on social media shows the active design's
  // branded OG card (generated dynamically by /api/og?design=<key>).
  useEffect(() => {
    if (compareMode) {
      document.title = `${BUSINESS.brand} — All 3 mockups (compare mode)`;
      updateOgImage('default');
    } else {
      const d = DESIGNS.find((x) => x.key === active);
      document.title = `${BUSINESS.brand} — ${d?.docTitle ?? ''}`;
      updateOgImage(active);
    }
  }, [active, compareMode]);

  const activeDesign = DESIGNS.find((d) => d.key === active)!;
  const ActiveDesign = DESIGN_MAP[active];

  // Mobile CTAs should hide: when footer is in view, when banner is collapsed
  // by the user via keyboard while at the top, or when not yet scrolled.
  const showMobileCta = scrolled && !footerInView;
  // Back-to-top should lift above mobile CTAs on small screens.
  const backToTopBottomClass = showMobileCta ? 'bottom-20' : 'bottom-6';

  return (
    <div className="min-h-screen flex flex-col bg-white text-stone-900">
      {/* ===== Scroll progress bar (top of viewport) ===== */}
      <div
        className="fixed top-0 left-0 right-0 z-[70] h-0.5 bg-stone-200/60 pointer-events-none"
        aria-hidden
      >
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 transition-[width] duration-150 ease-out"
          style={{ width: `${scrollPct}%` }}
        />
      </div>

      {/* ===== Mockup Switcher Banner ===== */}
      <header className="sticky top-0 z-[60] border-b border-stone-200 bg-stone-50/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 md:py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-stone-900 text-sm font-bold text-amber-400 shadow-sm">
              R&amp;R
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-stone-900">
                  {BUSINESS.brand} — Website Mockups
                </p>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-stone-200/70 px-2 py-0.5 text-[10px] font-medium text-stone-600">
                  <ImageIcon className="h-3 w-3" aria-hidden />
                  46 real photos
                </span>
              </div>
              {bannerOpen && (
                <p className="mt-0.5 text-xs text-stone-500">
                  3 unique design concepts using the client&apos;s real project
                  photos, organized by trade (plumbing · carpentry · power
                  washing). SEO-friendly & lead-generating.
                </p>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <ServiceEstimator />
              <DesignNotes activeDesign={active} />
              <ShareButton design={compareMode ? 'compare' : active} />
              {/* Compare mode toggle */}
              <button
                type="button"
                onClick={() => setCompareMode((v) => !v)}
                aria-pressed={compareMode}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                  compareMode
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-stone-300 bg-white text-stone-700 hover:border-stone-900 hover:bg-stone-100'
                }`}
                title="Show all three designs stacked vertically (keyboard: C)"
              >
                <Layers className="h-3.5 w-3.5" aria-hidden />
                <span className="hidden sm:inline">Compare</span>
              </button>
              {/* Collapse banner toggle */}
              <button
                type="button"
                onClick={() => setBannerOpen((v) => !v)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-500 transition-colors hover:border-stone-900 hover:bg-stone-100 hover:text-stone-900"
                title={`${bannerOpen ? 'Collapse' : 'Expand'} banner (keyboard: B)`}
                aria-label={bannerOpen ? 'Collapse banner' : 'Expand banner'}
              >
                {bannerOpen ? <X className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Design toggle pills + active blurb (collapsible) */}
          {bannerOpen && (
            <div className="mt-3 space-y-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                {DESIGNS.map((d) => {
                  const isActive = d.key === active && !compareMode;
                  return (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => {
                        setActive(d.key);
                        setCompareMode(false);
                      }}
                      aria-pressed={isActive}
                      className={`group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all sm:text-sm ${
                        isActive
                          ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                          : 'border-stone-300 bg-white text-stone-700 hover:border-stone-900 hover:bg-stone-100'
                      }`}
                      title={`Switch to ${d.name} (keyboard: ${d.key === 'modern' ? '1' : d.key === 'portfolio' ? '2' : '3'})`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${d.accent}`}
                        aria-hidden
                      />
                      <span className="hidden sm:inline">{d.name}</span>
                      <span className="sm:hidden">{d.shortLabel}</span>
                      {isActive && <Check className="h-3 w-3" aria-hidden />}
                    </button>
                  );
                })}
              </div>

              {/* Active design blurb / keyboard hints */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-stone-200 bg-white px-4 py-2 text-xs text-stone-600">
                {compareMode ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-stone-900">
                    <Layers className="h-3.5 w-3.5" aria-hidden />
                    Compare mode — all 3 designs stacked below. Press Esc or C to exit.
                  </span>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-1 font-semibold text-stone-900">
                      <Eye className="h-3.5 w-3.5" aria-hidden />
                      Previewing: {activeDesign.name}
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="hidden md:inline">{activeDesign.desc}</span>
                  </>
                )}
                <span className="ml-auto inline-flex items-center gap-2">
                  <kbd className="rounded border border-stone-300 bg-stone-100 px-1.5 py-0.5 text-[10px] font-mono text-stone-600">1</kbd>
                  <kbd className="rounded border border-stone-300 bg-stone-100 px-1.5 py-0.5 text-[10px] font-mono text-stone-600">2</kbd>
                  <kbd className="rounded border border-stone-300 bg-stone-100 px-1.5 py-0.5 text-[10px] font-mono text-stone-600">3</kbd>
                  <span className="text-stone-400">switch</span>
                  <kbd className="rounded border border-stone-300 bg-stone-100 px-1.5 py-0.5 text-[10px] font-mono text-stone-600">C</kbd>
                  <span className="text-stone-400">compare</span>
                  <span className="hidden sm:inline text-stone-300">·</span>
                  <a
                    href={BUSINESS.phoneHref}
                    className="hidden sm:inline-flex items-center gap-1 text-stone-900 underline-offset-2 hover:underline"
                  >
                    <Phone className="h-3 w-3" aria-hidden />
                    {BUSINESS.phone}
                  </a>
                </span>
              </div>
              <p className="text-[10px] text-stone-400">
                Tip: Press <kbd className="rounded border border-stone-300 bg-stone-100 px-1 font-mono">1</kbd>/<kbd className="rounded border border-stone-300 bg-stone-100 px-1 font-mono">2</kbd>/<kbd className="rounded border border-stone-300 bg-stone-100 px-1 font-mono">3</kbd> to swap designs, <kbd className="rounded border border-stone-300 bg-stone-100 px-1 font-mono">C</kbd> for compare, <kbd className="rounded border border-stone-300 bg-stone-100 px-1 font-mono">B</kbd> to collapse, <kbd className="rounded border border-stone-300 bg-stone-100 px-1 font-mono">?</kbd> for help. {SEO_KEYWORDS.clusters.length} service keywords wired in.
              </p>
            </div>
          )}
        </div>
      </header>

      <main id="main" className="flex-1">
        {compareMode ? (
          <CompareView activeKey={active} onJumpToDesign={(k) => { setActive(k); setCompareMode(false); }} />
        ) : (
          <ActiveDesign />
        )}
      </main>

      {/* ===== Back-to-top button (appears after scrolling) ===== */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll back to top"
        className={`fixed ${backToTopBottomClass} right-4 sm:right-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-stone-900 text-white shadow-lg ring-1 ring-black/10 transition-all hover:bg-stone-800 hover:scale-105 ${
          scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <ChevronUp className="h-5 w-5" aria-hidden />
      </button>

      {/* ===== Mobile floating CTAs (only on small screens) ===== */}
      {/* Hidden when the footer is in view so they don't cover footer contact info. */}
      <div
        className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 grid grid-cols-2 gap-px border-t border-stone-200 bg-white/95 backdrop-blur shadow-[0_-2px_10px_rgba(0,0,0,0.06)] transition-all duration-300 ${
          showMobileCta ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        }`}
      >
        <a
          href={BUSINESS.phoneHref}
          className="inline-flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-stone-900 hover:bg-stone-100"
        >
          <Phone className="h-4 w-4" aria-hidden />
          Call Rick
        </a>
        <a
          href="#contact"
          className="inline-flex items-center justify-center gap-2 bg-amber-500 py-3.5 text-sm font-semibold text-stone-950 hover:bg-amber-400"
        >
          <Send className="h-4 w-4" aria-hidden />
          Free Quote
        </a>
      </div>

      {/* ===== Keyboard shortcuts help dialog (toggle with ?) ===== */}
      <KeyboardHelpDialog open={helpOpen} onOpenChange={setHelpOpen} />

      {/* ===== Help trigger button (bottom-left, desktop only) ===== */}
      <button
        type="button"
        onClick={() => setHelpOpen(true)}
        className="hidden sm:inline-flex fixed bottom-6 left-6 z-40 h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-white/90 text-stone-500 shadow-sm backdrop-blur transition-colors hover:border-stone-900 hover:bg-white hover:text-stone-900"
        title="Keyboard shortcuts (press ?)"
        aria-label="Show keyboard shortcuts"
      >
        <span className="text-sm font-bold">?</span>
      </button>
    </div>
  );
}

/* ============================================================
   Keyboard shortcuts help dialog — toggled by the ? key or the
   bottom-left ? button. Lists every shortcut with descriptions.
   ============================================================ */
function KeyboardHelpDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const shortcuts: { keys: string[]; desc: string }[] = [
    { keys: ['1'], desc: 'Switch to Modern Professional design' },
    { keys: ['2'], desc: 'Switch to Before/After Portfolio design' },
    { keys: ['3'], desc: 'Switch to Trusted Local Craftsman design' },
    { keys: ['C'], desc: 'Toggle compare mode (all 3 designs stacked)' },
    { keys: ['B'], desc: 'Collapse / expand the switcher banner' },
    { keys: ['?'], desc: 'Open / close this help dialog' },
    { keys: ['Esc'], desc: 'Close dialogs / exit compare mode' },
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-stone-900 text-sm font-bold text-amber-400">
              ?
            </span>
            Keyboard shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keys anywhere on the page (except when typing in a form
            field) to navigate the mockup switcher faster.
          </DialogDescription>
        </DialogHeader>
        <dl className="space-y-2 pt-2">
          {shortcuts.map((s) => (
            <div key={s.keys.join('')} className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="rounded-md border border-stone-300 bg-stone-100 px-2 py-1 text-xs font-mono font-semibold text-stone-700 shadow-sm"
                  >
                    {k}
                  </kbd>
                ))}
              </dt>
              <dd className="text-sm text-stone-600 text-right">{s.desc}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-3 text-xs text-stone-500">
          Tip: Deep-links work too — share{' '}
          <code className="rounded bg-stone-200 px-1 py-0.5 font-mono">
            /#design=trusted
          </code>{' '}
          to send someone straight to that design.
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ============================================================
   Compare View — render all three designs stacked vertically,
   separated by labeled dividers so the client can scroll through
   every concept without toggling. Each divider has a "Jump to
   this design" button that exits compare mode on that design.
   ============================================================ */
function CompareView({
  activeKey,
  onJumpToDesign,
}: {
  activeKey: DesignKey;
  onJumpToDesign: (k: DesignKey) => void;
}) {
  return (
    <div>
      {DESIGNS.map((d, i) => {
        const Design = DESIGN_MAP[d.key];
        const isActive = d.key === activeKey;
        return (
          <div key={d.key} className="relative">
            {/* Divider / label between designs */}
            <div className="sticky top-[56px] z-40 border-y border-stone-900 bg-stone-900 text-stone-50">
              <div className="mx-auto max-w-7xl px-4 py-2.5 flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${d.accent}`} aria-hidden />
                <span className="text-xs font-mono text-stone-400">
                  Design {i + 1} / {DESIGNS.length}
                </span>
                <span className="text-sm font-semibold">{d.name}</span>
                <span className="hidden sm:inline text-xs text-stone-400">— {d.tag}</span>
                <button
                  type="button"
                  onClick={() => onJumpToDesign(d.key)}
                  className={`ml-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    isActive
                      ? 'border-amber-400 bg-amber-400 text-stone-950'
                      : 'border-stone-700 bg-stone-800 text-stone-100 hover:bg-stone-700'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" aria-hidden />
                  View only this design
                </button>
              </div>
            </div>
            <Design />
          </div>
        );
      })}
    </div>
  );
}
