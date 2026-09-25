'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronUp, Phone, Send } from 'lucide-react';
import { BUSINESS } from '@/lib/business-info';
import { ServiceEstimator } from '@/components/service-estimator';

// The single, final production design chosen by the client — a warm blend of
// the final design.
import DesignFinal from '@/components/designs/design-final';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [footerInView, setFooterInView] = useState(false);
  const scrollRef = useRef(0);

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
    const foot = document.querySelector('main footer');
    if (foot) io.observe(foot);
    return () => io.disconnect();
  }, []);

  const showMobileCta = scrolled && !footerInView;
  const backToTopBottomClass = showMobileCta ? 'bottom-20' : 'bottom-6';

  return (
    <div className="min-h-screen flex flex-col bg-white text-stone-900">
      {/* ===== Scroll progress bar (top of viewport) ===== */}
      <div
        className="fixed top-0 left-0 right-0 z-[70] h-0.5 bg-stone-200/60 pointer-events-none"
        aria-hidden
      >
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-yellow-400 transition-[width] duration-150 ease-out"
          style={{ width: `${scrollPct}%` }}
        />
      </div>

      <main id="main" className="flex-1">
        <DesignFinal />
      </main>

      {/* ===== Back-to-top button (appears after scrolling) ===== */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll back to top"
        className={`fixed ${backToTopBottomClass} right-4 sm:right-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg ring-1 ring-black/10 transition-all hover:bg-slate-800 hover:scale-105 hover:ring-2 hover:ring-yellow-400 hover:ring-offset-2 ${
          scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <ChevronUp className="h-5 w-5" aria-hidden />
      </button>

      {/* ===== Mobile floating CTAs (only on small screens) ===== */}
      <div
        className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 grid grid-cols-3 gap-px border-t border-stone-200 bg-white/95 backdrop-blur shadow-[0_-2px_10px_rgba(0,0,0,0.06)] transition-all duration-300 ${
          showMobileCta ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        }`}
      >
        <a
          href={BUSINESS.phoneHref}
          className="inline-flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-stone-900 hover:bg-stone-100"
        >
          <Phone className="h-4 w-4" aria-hidden />
          Call
        </a>
        <div className="flex items-center justify-center">
          <ServiceEstimator />
        </div>
        <a
          href="#contact"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 py-3.5 text-sm font-semibold text-white hover:bg-blue-700 hover:ring-2 hover:ring-yellow-400"
        >
          <Send className="h-4 w-4" aria-hidden />
          Quote
        </a>
      </div>
    </div>
  );
}
