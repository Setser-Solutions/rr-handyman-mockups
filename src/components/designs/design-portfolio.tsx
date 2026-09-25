'use client';

import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  Droplets,
  Hammer,
  SprayCan,
  Phone,
  Star,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Clock,
  Mail,
  ShieldCheck,
  Wrench,
  Menu,
  Calendar,
  Send,
  Camera,
  Images,
  Quote,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useLeadForm } from '@/hooks/use-lead-form';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

import {
  HERO_PICKS,
  GALLERY_BY_CATEGORY,
  captionFor,
} from '@/lib/handyman-photos';
import { BUSINESS, TESTIMONIALS, FAQS } from '@/lib/business-info';

export const DESIGN_ID = 'portfolio';
export const DESIGN_NAME = 'Before/After Portfolio';

const CURRENT_YEAR = new Date().getFullYear();

const ICONS = { Droplets, Hammer, SprayCan } as const;

const NAV_LINKS = [
  { label: 'Work', id: 'gallery' },
  { label: 'Services', id: 'services' },
  { label: 'Reviews', id: 'reviews' },
  { label: 'FAQ', id: 'faq' },
  { label: 'Contact', id: 'contact' },
] as const;

type GalleryFilter = keyof typeof GALLERY_BY_CATEGORY;

const FILTERS: { label: string; value: GalleryFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Plumbing', value: 'plumbing' },
  { label: 'Carpentry', value: 'carpentry' },
  { label: 'Power Washing', value: 'power_washing' },
  { label: 'Finished', value: 'finished_work' },
];

const FILTER_BADGE_LABEL: Record<GalleryFilter, string> = {
  all: 'Project',
  plumbing: 'Plumbing',
  carpentry: 'Carpentry',
  power_washing: 'Power Washing',
  finished_work: 'Finished Work',
  before_after: 'Before/After',
  other: 'Detail',
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const viewportOnce = { once: true, margin: '-80px' as const };

function scrollToId(id: string) {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function serviceIdToFilter(id: string): GalleryFilter {
  if (id === 'power-washing') return 'power_washing';
  return id as GalleryFilter;
}

export default function DesignPortfolio() {
  const [galleryFilter, setGalleryFilter] = useState<GalleryFilter>('all');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [serviceNeeded, setServiceNeeded] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const galleryPhotos: string[] =
    GALLERY_BY_CATEGORY[galleryFilter] ?? GALLERY_BY_CATEGORY.all;

  function handleServiceGalleryClick(serviceId: string) {
    setGalleryFilter(serviceIdToFilter(serviceId));
    scrollToId('gallery');
  }

  const { submit: handleSubmit, submitting } = useLeadForm({
    design: 'portfolio',
    successTitle: 'Quote request received.',
    successDescription: 'Rick will reach out within 24 hours.',
    onAfterSubmit: () => setServiceNeeded(''),
  });

  return (
    <div className="min-h-screen flex flex-col bg-white text-stone-900">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-emerald-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      {/* ===== NAV ===== */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <a href="#main" className="flex items-center gap-3 shrink-0">
            <span
              aria-hidden="true"
              className="grid place-items-center h-10 w-10 rounded-md bg-emerald-600 text-white font-bold text-xs tracking-tight"
            >
              R&amp;R
            </span>
            <span className="font-semibold text-stone-900 tracking-tight text-sm sm:text-base">
              {BUSINESS.brand}
            </span>
          </a>

          <nav
            className="hidden md:flex items-center gap-7"
            aria-label="Primary"
          >
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => scrollToId(l.id)}
                className="text-sm font-medium text-stone-600 hover:text-emerald-700 transition-colors"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" asChild className="border-stone-200">
              <a href={BUSINESS.phoneHref}>
                <Phone className="size-4" />
                Call
              </a>
            </Button>
            <Button
              type="button"
              onClick={() => scrollToId('contact')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Get a Quote
              <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="md:hidden">
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[88vw] max-w-sm bg-white">
                <SheetTitle className="px-4 pt-2 text-stone-900">
                  {BUSINESS.brand}
                </SheetTitle>
                <nav
                  className="flex flex-col gap-1 px-4"
                  aria-label="Mobile primary"
                >
                  {NAV_LINKS.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => {
                        scrollToId(l.id);
                        setMobileNavOpen(false);
                      }}
                      className="text-left text-base font-medium text-stone-700 hover:text-emerald-700 transition-colors py-3 border-b border-stone-100"
                    >
                      {l.label}
                    </button>
                  ))}
                </nav>
                <div className="flex flex-col gap-2 px-4 mt-4">
                  <Button
                    variant="outline"
                    asChild
                    className="border-stone-200 w-full"
                  >
                    <a href={BUSINESS.phoneHref}>
                      <Phone className="size-4" />
                      {BUSINESS.phone}
                    </a>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      scrollToId('contact');
                      setMobileNavOpen(false);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white w-full"
                  >
                    Get a Quote
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main id="main" className="flex-1">
        {/* ===== HERO ===== */}
        <section aria-label="Hero" className="relative bg-white">
          <div className="grid md:grid-cols-2 md:min-h-[88vh]">
            <div className="px-6 py-16 md:py-20 flex flex-col justify-center gap-6 max-w-xl mx-auto md:mx-0">
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 w-fit gap-1.5 px-3 py-1">
                <MapPin className="size-3" />
                {BUSINESS.serviceArea.split('&')[0].trim()} · {BUSINESS.avgRating}
                ★
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold text-stone-900 tracking-tight leading-[1.05]">
                See the difference. Then call the guy who made it.
              </h1>

              <p className="text-base md:text-lg text-stone-600 leading-relaxed">
                From{' '}
                <strong className="font-semibold text-stone-900">plumbing</strong>{' '}
                fixes and{' '}
                <strong className="font-semibold text-stone-900">carpentry</strong>{' '}
                builds to dramatic{' '}
                <strong className="font-semibold text-stone-900">
                  power washing
                </strong>{' '}
                makeovers, every R&amp;R job comes with a before/after
                you&apos;ll want to show the neighbors.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  size="lg"
                  onClick={() => scrollToId('gallery')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  View Our Work
                  <Images className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToId('contact')}
                  className="border-stone-300 text-stone-800"
                >
                  Get a Free Quote
                  <ArrowRight className="size-4" />
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-stone-500 pt-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-600" />{' '}
                  {BUSINESS.yearsInBusiness}+ yrs
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-600" />{' '}
                  {BUSINESS.jobsCompleted.toLocaleString()}+ jobs
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-600" /> Same-day
                  estimates
                </span>
              </div>
            </div>

            <div className="relative bg-stone-100 min-h-[60vh] md:min-h-0">
              <img
                src={HERO_PICKS.power_washing}
                alt="Patio power wash before and after showing half-cleaned concrete next to the unwashed section"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-emerald-600 text-white border-transparent gap-1.5 px-3 py-1.5 text-xs shadow-lg">
                <Camera className="size-3.5" />
                Before / After
              </Badge>
            </div>
          </div>
        </section>

        {/* ===== STATS BAND ===== */}
        <section
          aria-label="Key stats"
          className="bg-stone-900 text-stone-50 py-12"
        >
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: `${BUSINESS.yearsInBusiness}+ Years`, label: 'In business' },
              {
                value: `${BUSINESS.jobsCompleted.toLocaleString()}+ Jobs`,
                label: 'Completed',
              },
              {
                value: `${BUSINESS.avgRating}★ Reviews`,
                label: `${BUSINESS.reviewCount} verified`,
              },
              { value: '24h Response', label: 'On quote requests' },
            ].map((s) => (
              <motion.div
                key={s.label}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={fadeUp}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-emerald-400">
                  {s.value}
                </div>
                <div className="text-xs md:text-sm text-stone-400 mt-1">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== SERVICES TABS ===== */}
        <section
          id="services"
          aria-labelledby="services-heading"
          className="bg-stone-50 py-20 md:py-28"
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
              className="max-w-2xl"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-3">
                What we do
              </p>
              <h2
                id="services-heading"
                className="text-3xl md:text-5xl font-bold text-stone-900 tracking-tight"
              >
                Three trades, hundreds of transformations.
              </h2>
            </motion.div>

            <Tabs defaultValue="carpentry" className="mt-10">
              <TabsList className="bg-white border border-stone-200 h-auto p-1.5 rounded-xl flex w-full md:w-fit gap-1">
                {BUSINESS.services.map((s) => {
                  const Icon = ICONS[s.icon as keyof typeof ICONS] ?? Hammer;
                  return (
                    <TabsTrigger
                      key={s.id}
                      value={s.id}
                      className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg px-4 py-2 text-sm font-medium flex-1 md:flex-initial"
                    >
                      <Icon className="size-4" />
                      {s.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {BUSINESS.services.map((s) => {
                const Icon = ICONS[s.icon as keyof typeof ICONS] ?? Hammer;
                return (
                  <TabsContent key={s.id} value={s.id} className="mt-8">
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={fadeIn}
                      className="grid md:grid-cols-2 gap-6 md:gap-10 items-center"
                    >
                      <div className="relative rounded-xl overflow-hidden border border-stone-200 shadow-sm">
                        <img
                          src={s.image}
                          alt={`${s.label} work sample from R&R Handyman`}
                          className="w-full h-full object-cover aspect-[4/3]"
                          loading="lazy"
                        />
                        <Badge className="absolute top-3 left-3 bg-emerald-600 text-white border-transparent gap-1 px-2.5 py-1">
                          <Icon className="size-3" />
                          {s.label}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-stone-900 mb-3">
                          {s.label}
                        </h3>
                        <p className="text-stone-600 leading-relaxed mb-5">
                          {s.longBlurb}
                        </p>
                        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mb-6">
                          {s.bullets.map((b) => (
                            <li
                              key={b}
                              className="flex items-start gap-2 text-sm text-stone-700"
                            >
                              <CheckCircle2 className="size-4 text-emerald-600 mt-0.5 shrink-0" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap items-center gap-4">
                          <Button
                            type="button"
                            onClick={() => handleServiceGalleryClick(s.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            See {s.label} gallery
                            <ArrowRight className="size-4" />
                          </Button>
                          <span className="text-sm text-stone-500">
                            Starting at{' '}
                            <span className="font-semibold text-stone-900">
                              {s.startingAt}
                            </span>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        </section>

        {/* ===== GALLERY ===== */}
        <section
          id="gallery"
          aria-labelledby="gallery-heading"
          className="bg-white py-20 md:py-28"
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
              className="max-w-2xl mb-8"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-3">
                Recent work
              </p>
              <h2
                id="gallery-heading"
                className="text-3xl md:text-5xl font-bold text-stone-900 tracking-tight"
              >
                A look at recent projects in {BUSINESS.primaryCity}.
              </h2>
              <p className="text-stone-600 mt-4">
                Filter by trade to see how each kind of job turns out.
              </p>
            </motion.div>

            <div
              className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-1"
              role="tablist"
              aria-label="Filter gallery by trade"
            >
              {FILTERS.map((f) => {
                const active = galleryFilter === f.value;
                return (
                  <Button
                    key={f.value}
                    type="button"
                    size="sm"
                    variant={active ? 'default' : 'outline'}
                    onClick={() => setGalleryFilter(f.value)}
                    aria-pressed={active}
                    className={
                      active
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'border-stone-200 text-stone-700 hover:border-stone-300'
                    }
                  >
                    {f.label}
                  </Button>
                );
              })}
            </div>

            {galleryPhotos.length === 0 ? (
              <p className="text-center text-stone-500 py-12">
                No photos in this category yet.
              </p>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4">
                {galleryPhotos.map((src) => {
                  const cap = captionFor(src);
                  const filterLabel = FILTER_BADGE_LABEL[galleryFilter];
                  return (
                    <motion.button
                      key={src}
                      type="button"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-40px' }}
                      variants={fadeIn}
                      onClick={() => setLightbox(src)}
                      aria-label={`Open "${cap.title}" in lightbox`}
                      className="group relative block w-full text-left rounded-xl overflow-hidden border border-stone-200 bg-stone-100 break-inside-avoid focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 outline-none"
                    >
                      <img
                        src={src}
                        alt={cap.title}
                        loading="lazy"
                        className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/85 via-stone-900/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <Badge className="bg-emerald-600 text-white border-transparent mb-2 text-[10px] uppercase tracking-wide">
                          {filterLabel}
                        </Badge>
                        <h3 className="text-white font-semibold text-base leading-snug">
                          {cap.title}
                        </h3>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ===== LIGHTBOX DIALOG ===== */}
        <Dialog
          open={!!lightbox}
          onOpenChange={(open) => {
            if (!open) setLightbox(null);
          }}
        >
          <DialogContent className="max-w-3xl bg-white p-0 overflow-hidden gap-0">
            {lightbox && (
              <>
                <img
                  src={lightbox}
                  alt={captionFor(lightbox).title}
                  className="w-full h-auto max-h-[68vh] object-contain bg-stone-100"
                />
                <DialogHeader className="p-6 pt-4 text-left">
                  <DialogTitle className="text-xl text-stone-900">
                    {captionFor(lightbox).title}
                  </DialogTitle>
                  {captionFor(lightbox).blurb && (
                    <DialogDescription className="text-stone-600">
                      {captionFor(lightbox).blurb}
                    </DialogDescription>
                  )}
                </DialogHeader>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* ===== CASE STUDY HIGHLIGHT ===== */}
        <section
          aria-labelledby="spotlight-heading"
          className="bg-stone-900 text-stone-50 py-20 md:py-28"
        >
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
              className="relative rounded-2xl overflow-hidden border border-stone-800 shadow-xl"
            >
              <img
                src="/handyman-photos/img_026.jpg"
                alt="Deck board refinish before and after — weathered gray planks meet freshly replaced yellow pine"
                className="w-full h-auto object-cover aspect-[4/3]"
                loading="lazy"
              />
              <Badge className="absolute top-4 left-4 bg-emerald-600 text-white border-transparent gap-1.5 px-3 py-1.5">
                <Camera className="size-3.5" />
                Before / After
              </Badge>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">
                Project Spotlight
              </p>
              <h3
                id="spotlight-heading"
                className="text-2xl md:text-4xl font-bold mb-4 tracking-tight"
              >
                Project Spotlight: Deck Refinish
              </h3>
              <p className="text-stone-300 leading-relaxed mb-6">
                We lifted years of weathered gray deck boards and replaced them
                with new yellow pine, feathered into the existing framing, sanded
                smooth, and sealed against the next ten winters. The contrast —
                clean bright wood next to sun-bleached gray — is the kind of
                before/after that makes neighbors ask for the contractor&apos;s
                number.
              </p>
              <blockquote className="border-l-2 border-emerald-500 pl-4 mb-6">
                <Quote className="size-5 text-emerald-500 mb-2" />
                <p className="text-stone-200 italic mb-2 leading-relaxed">
                  &ldquo;{TESTIMONIALS[0].quote}&rdquo;
                </p>
                <footer className="text-sm text-stone-400">
                  — {TESTIMONIALS[0].name}, {TESTIMONIALS[0].location} ·{' '}
                  {TESTIMONIALS[0].service}
                </footer>
              </blockquote>
              <Button
                type="button"
                onClick={() => scrollToId('contact')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Request a deck quote
                <ArrowRight className="size-4" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section
          id="reviews"
          aria-labelledby="reviews-heading"
          className="bg-white py-20 md:py-28"
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
              className="max-w-2xl mb-12"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-3">
                Reviews
              </p>
              <h2
                id="reviews-heading"
                className="text-3xl md:text-5xl font-bold text-stone-900 tracking-tight"
              >
                What customers say.
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.slice(1, 4).map((t) => (
                <motion.article
                  key={t.name}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  variants={fadeUp}
                >
                  <Card className="h-full p-6 gap-4 border-stone-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="px-0 space-y-4">
                      <Quote className="size-8 text-emerald-600" />
                      <div
                        className="flex gap-0.5"
                        aria-label={`${t.rating} out of 5 stars`}
                      >
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="size-4 text-amber-500 fill-amber-500"
                          />
                        ))}
                      </div>
                      <p className="text-stone-700 leading-relaxed text-sm">
                        {t.quote}
                      </p>
                      <div className="pt-3 border-t border-stone-100">
                        <p className="font-semibold text-stone-900 text-sm">
                          {t.name}
                        </p>
                        <p className="text-xs text-stone-500">
                          {t.location} · {t.service}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PROCESS ===== */}
        <section
          aria-labelledby="process-heading"
          className="bg-stone-50 py-20 md:py-28"
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
              className="max-w-2xl mb-12"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-3">
                How it works
              </p>
              <h2
                id="process-heading"
                className="text-3xl md:text-5xl font-bold text-stone-900 tracking-tight"
              >
                Three steps. No surprises.
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  n: '1',
                  title: 'Free Quote',
                  desc: 'Tell us what you need — by phone, form, or text. We visit the site (or review photos) and send a flat, no-obligation quote within 24 hours.',
                },
                {
                  n: '2',
                  title: 'Schedule',
                  desc: 'Accept the quote and pick a day that works. Most plumbing and power-washing jobs book within the week. Larger carpentry builds get a clear start and finish date.',
                },
                {
                  n: '3',
                  title: 'Done Right',
                  desc: 'Rick shows up on time, does the work to code, cleans up the site, and walks you through the result. You only pay when the punch list is empty.',
                },
              ].map((step, i) => (
                <motion.div
                  key={step.n}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  variants={fadeUp}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="relative p-6 rounded-xl border border-stone-200 bg-white shadow-sm"
                >
                  <span
                    aria-hidden="true"
                    className="grid place-items-center h-10 w-10 rounded-full bg-emerald-600 text-white font-bold mb-4"
                  >
                    {step.n}
                  </span>
                  <h3 className="font-semibold text-stone-900 text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== LEAD FORM ===== */}
        <section
          id="contact"
          aria-labelledby="contact-heading"
          className="bg-stone-900 text-stone-50 py-20 md:py-28"
        >
          <div className="max-w-2xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
              className="text-center mb-10"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">
                Get a quote
              </p>
              <h2
                id="contact-heading"
                className="text-3xl md:text-5xl font-bold tracking-tight"
              >
                Get a free quote in 24 hours.
              </h2>
              <p className="text-stone-400 mt-4">
                Tell us about your project. Rick personally reviews every request
                and reaches out within one business day.
              </p>
            </motion.div>

            <Card className="bg-stone-800/50 border-stone-700 text-stone-50 p-0 gap-0">
              <CardContent className="p-6 md:p-8 space-y-5">
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-stone-200">
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        autoComplete="name"
                        className="bg-stone-900/60 border-stone-700 text-white placeholder:text-stone-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/30"
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-stone-200">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        className="bg-stone-900/60 border-stone-700 text-white placeholder:text-stone-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/30"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-stone-200">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="bg-stone-900/60 border-stone-700 text-white placeholder:text-stone-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/30"
                      placeholder="you@email.com"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="service" className="text-stone-200">
                        Service needed
                      </Label>
                      <Select
                        value={serviceNeeded}
                        onValueChange={setServiceNeeded}
                      >
                        <SelectTrigger
                          id="service"
                          className="bg-stone-900/60 border-stone-700 text-white w-full focus-visible:border-emerald-500 focus-visible:ring-emerald-500/30 data-[placeholder]:text-stone-500"
                        >
                          <SelectValue placeholder="Pick a trade" />
                        </SelectTrigger>
                        <SelectContent>
                          {BUSINESS.services.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.label}
                            </SelectItem>
                          ))}
                          <SelectItem value="other">Something else</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="date"
                        className="text-stone-200 flex items-center gap-1.5"
                      >
                        <Calendar className="size-3.5" />
                        Preferred date
                      </Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        className="bg-stone-900/60 border-stone-700 text-white placeholder:text-stone-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/30 [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message" className="text-stone-200">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="bg-stone-900/60 border-stone-700 text-white placeholder:text-stone-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/30 min-h-24"
                      placeholder="Tell us a bit about the job — what's broken, what you want built, or what you want washed."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        Send request
                      </>
                    )}
                  </Button>
                </form>

                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 border-t border-stone-700 text-xs text-stone-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-emerald-400" /> Licensed
                    &amp; insured
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Wrench className="size-4 text-emerald-400" />{' '}
                    {BUSINESS.yearsInBusiness}+ years
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star className="size-4 text-emerald-400" />{' '}
                    {BUSINESS.avgRating}★
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section
          id="faq"
          aria-labelledby="faq-heading"
          className="bg-white py-20 md:py-28"
        >
          <div className="max-w-3xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
              className="text-center mb-10"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-3">
                FAQ
              </p>
              <h2
                id="faq-heading"
                className="text-3xl md:text-5xl font-bold text-stone-900 tracking-tight"
              >
                Questions, answered.
              </h2>
            </motion.div>

            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border-stone-200"
                >
                  <AccordionTrigger className="text-left text-base font-medium text-stone-900 hover:no-underline hover:text-emerald-700">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-stone-600 leading-relaxed text-sm">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-stone-900 text-stone-400 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <span
                aria-hidden="true"
                className="grid place-items-center h-10 w-10 rounded-md bg-emerald-600 text-white font-bold text-xs"
              >
                R&amp;R
              </span>
              <span className="font-semibold text-stone-50">
                {BUSINESS.brand}
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Owned and operated by {BUSINESS.owner}. {BUSINESS.serviceArea}.
            </p>
          </div>

          <div>
            <h3 className="text-stone-50 font-semibold text-sm mb-3">Services</h3>
            <ul className="space-y-2 text-sm">
              {BUSINESS.services.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setGalleryFilter(serviceIdToFilter(s.id));
                      scrollToId('services');
                    }}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-stone-50 font-semibold text-sm mb-3">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToId('gallery')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Recent Work
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToId('reviews')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Reviews
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToId('faq')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToId('contact')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Get a Quote
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-stone-50 font-semibold text-sm mb-3">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={BUSINESS.phoneHref}
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <Phone className="size-4" /> {BUSINESS.phone}
                </a>
              </li>
              <li>
                <a
                  href={BUSINESS.emailHref}
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <Mail className="size-4" /> {BUSINESS.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="size-4" /> {BUSINESS.hours.weekdays}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4" /> {BUSINESS.primaryCity} &amp; nearby
                towns
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
            <p>
              © {CURRENT_YEAR} {BUSINESS.brand}. All rights reserved.
            </p>
            <p></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
