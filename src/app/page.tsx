'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Check, ChevronRight, Eye, ImageIcon, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BUSINESS, SEO_KEYWORDS } from '@/lib/business-info';

type DesignKey = 'modern' | 'portfolio' | 'trusted';

const DESIGNS: {
  key: DesignKey;
  name: string;
  tag: string;
  desc: string;
  accent: string;
}[] = [
  {
    key: 'modern',
    name: 'Modern Professional',
    tag: 'Bold · Dark · Energetic',
    desc: 'Dark hero with amber accents. Contractor-grade confidence, with strong CTAs and an interactive gallery.',
    accent: 'bg-amber-500',
  },
  {
    key: 'portfolio',
    name: 'Before/After Portfolio',
    tag: 'Light · Visual · Photo-led',
    desc: 'Light, photography-driven layout with a split before/after hero, masonry gallery, and case-study spotlight.',
    accent: 'bg-emerald-500',
  },
  {
    key: 'trusted',
    name: 'Trusted Local Craftsman',
    tag: 'Warm · Story-driven · Friendly',
    desc: 'Warm, meet-the-owner vibe with a personal story, process section, and trust badges throughout.',
    accent: 'bg-orange-500',
  },
];

// Lazy-load each design so only the active one ships to the client.
const DesignModern = dynamic(
  () => import('@/components/designs/design-modern'),
  { ssr: true }
);
const DesignPortfolio = dynamic(
  () => import('@/components/designs/design-portfolio'),
  { ssr: true }
);
const DesignTrusted = dynamic(
  () => import('@/components/designs/design-trusted'),
  { ssr: true }
);

function DesignRenderer({ active }: { active: DesignKey }) {
  if (active === 'modern') return <DesignModern />;
  if (active === 'portfolio') return <DesignPortfolio />;
  return <DesignTrusted />;
}

export default function Home() {
  const [active, setActive] = useState<DesignKey>('modern');

  // Scroll back to top whenever the design changes so the reviewer
  // sees the new hero, not wherever they were on the previous design.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [active]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-stone-900">
      {/*
        ===== Mockup Switcher Banner =====
        Non-sticky, sits at the top of the page so it scrolls away once the
        user is exploring a design. Each design has its own sticky nav inside.
      */}
      <header className="border-b border-stone-200 bg-stone-50">
        <div className="mx-auto max-w-7xl px-4 py-4 md:py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-stone-900 text-sm font-bold text-amber-400">
                R&amp;R
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900">
                  {BUSINESS.brand} — Website Mockups
                </p>
                <p className="text-xs text-stone-500">
                  3 unique design concepts using the client&apos;s real project
                  photos, organized by trade (plumbing · carpentry · power
                  washing). Built SEO-friendly & lead-generating.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {DESIGNS.map((d) => {
                const isActive = d.key === active;
                return (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => setActive(d.key)}
                    aria-pressed={isActive}
                    className={`group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                      isActive
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-300 bg-white text-stone-700 hover:border-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${d.accent}`}
                      aria-hidden
                    />
                    <span className="hidden sm:inline">{d.name}</span>
                    <span className="sm:hidden">
                      {d.name.split(' ')[0]}
                    </span>
                    {isActive && <Check className="h-3 w-3" aria-hidden />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active design blurb */}
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-stone-200 bg-white px-4 py-2.5 text-xs text-stone-600">
            <span className="inline-flex items-center gap-1 font-semibold text-stone-900">
              <Eye className="h-3.5 w-3.5" aria-hidden />
              Previewing: {DESIGNS.find((d) => d.key === active)?.name}
            </span>
            <span className="text-stone-300">·</span>
            <span>{DESIGNS.find((d) => d.key === active)?.desc}</span>
            <span className="ml-auto inline-flex items-center gap-2">
              <a
                href={BUSINESS.phoneHref}
                className="inline-flex items-center gap-1 text-stone-900 underline-offset-2 hover:underline"
              >
                <Phone className="h-3 w-3" aria-hidden />
                {BUSINESS.phone}
              </a>
              <ChevronRight className="h-3 w-3 text-stone-300" aria-hidden />
              <ImageIcon className="h-3 w-3 text-stone-400" aria-hidden />
              <span>{SEO_KEYWORDS.clusters.length} service keywords wired in</span>
            </span>
          </div>
        </div>
      </header>

      <main id="main" className="flex-1">
        <DesignRenderer active={active} />
      </main>
    </div>
  );
}
