'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
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
  Loader2,
  type LucideIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLeadForm } from '@/hooks/use-lead-form';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  PHOTOS,
  HERO_PICKS,
  GALLERY_BY_CATEGORY,
  PHOTO_CAPTIONS,
  captionFor,
  type PhotoCategory,
} from '@/lib/handyman-photos';
import { BUSINESS, TESTIMONIALS, FAQS } from '@/lib/business-info';

export const DESIGN_ID = 'modern';
export const DESIGN_NAME = 'Modern Professional';

/* -------------------------------------------------------------------------- */
/*  Static config                                                             */
/* -------------------------------------------------------------------------- */

const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

const SERVICE_ICONS: Record<string, LucideIcon> = {
  Droplets,
  Hammer,
  SprayCan,
};

type GalleryFilter = 'all' | PhotoCategory;

const GALLERY_FILTERS: { id: GalleryFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'plumbing', label: 'Plumbing' },
  { id: 'carpentry', label: 'Carpentry' },
  { id: 'power_washing', label: 'Power Washing' },
];

const PROCESS_STEPS: {
  icon: LucideIcon;
  title: string;
  body: string;
}[] = [
  {
    icon: Phone,
    title: 'Free Quote',
    body: "Tell us what's broken. We'll give you a flat, upfront price — usually within 24 hours.",
  },
  {
    icon: Calendar,
    title: 'Schedule',
    body: 'Pick a time that works. We show up on the day we promise, with the tools and materials ready.',
  },
  {
    icon: CheckCircle2,
    title: 'Done Right',
    body: 'We fix it, clean up, and stand behind the work. Most jobs are guaranteed for 12 months.',
  },
];

/* -------------------------------------------------------------------------- */
/*  Small presentational helpers                                              */
/* -------------------------------------------------------------------------- */

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
      {children}
    </span>
  );
}

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.5, delay },
  };
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export default function DesignModern() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState<GalleryFilter>('all');
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [serviceNeeded, setServiceNeeded] = useState<string>('');

  const galleryPhotos = useMemo(() => {
    const list = GALLERY_BY_CATEGORY[galleryFilter] ?? GALLERY_BY_CATEGORY.all;
    return list.slice(0, 9);
  }, [galleryFilter]);

  const { submit: handleQuoteSubmit, submitting } = useLeadForm({
    design: 'modern',
    onAfterSubmit: () => setServiceNeeded(''),
  });

  const closeMobileNav = () => setMobileNavOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-stone-900">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-amber-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-stone-950">
        Skip to content
      </a>

      {/* ------------------------------------------------------------------ */}
      {/*  Top nav                                                           */}
      {/* ------------------------------------------------------------------ */}
      <header className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur border-b border-stone-800">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Brand */}
          <a href="#main" className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-md bg-amber-500 text-sm font-extrabold text-stone-950">
              R&amp;R
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-stone-50">
                {BUSINESS.brand}
              </span>
              <span className="text-[11px] text-stone-400">
                Plumbing · Carpentry · Power Washing
              </span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-stone-300 transition-colors hover:bg-stone-800 hover:text-stone-50"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            <Button
              asChild
              className="bg-amber-500 text-stone-950 shadow-sm hover:bg-amber-400"
            >
              <a href={BUSINESS.phoneHref}>
                <Phone className="size-4" />
                {BUSINESS.phone}
              </a>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-stone-50 hover:bg-stone-800 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-stone-800 bg-stone-950 text-stone-50"
            >
              <SheetHeaderMobile />
              <nav
                className="flex flex-col gap-1 px-4"
                aria-label="Mobile primary"
              >
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={closeMobileNav}
                    className="rounded-md px-3 py-3 text-base font-medium text-stone-200 transition-colors hover:bg-stone-800 hover:text-amber-400"
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
              <div className="mt-auto p-4">
                <Button
                  asChild
                  className="w-full bg-amber-500 text-stone-950 hover:bg-amber-400"
                >
                  <a href={BUSINESS.phoneHref} onClick={closeMobileNav}>
                    <Phone className="size-4" />
                    Call {BUSINESS.phone}
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main id="main" className="flex-1">
        {/* ---------------------------------------------------------------- */}
        {/*  Hero                                                            */}
        {/* ---------------------------------------------------------------- */}
        <section
          className="relative flex min-h-screen items-center"
          aria-labelledby="hero-heading"
        >
          <img
            src={HERO_PICKS.general}
            alt="Multi-level pressure-treated deck built against a brick home by R&R Handyman"
            className="absolute inset-0 size-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-stone-950/70" aria-hidden="true" />
          <div
            className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/30"
            aria-hidden="true"
          />

          <div className="relative mx-auto w-full max-w-7xl px-6 py-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <Badge className="border-amber-500/40 bg-amber-500/15 text-amber-400">
                <ShieldCheck className="size-3" />
                Licensed &amp; insured · Springfield County
              </Badge>

              <h1
                id="hero-heading"
                className="mt-5 text-5xl font-bold leading-[1.05] tracking-tight text-stone-50 md:text-7xl"
              >
                Your home. Fixed right the first time.
              </h1>

              <p className="mt-6 max-w-2xl text-lg text-stone-300 md:text-xl">
                Plumbing, carpentry, and power washing from one crew you can
                trust. For {BUSINESS.yearsInBusiness}+ years, {BUSINESS.owner}{' '}
                has been the pro Springfield neighbors call when it has to be
                done right.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-amber-500 text-stone-950 shadow-md hover:bg-amber-400"
                >
                  <a href="#contact">
                    Get My Free Quote
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-stone-600 bg-stone-950/40 text-stone-50 hover:bg-stone-800 hover:text-amber-400"
                >
                  <a href={BUSINESS.phoneHref}>
                    <Phone className="size-4" />
                    Call Now
                  </a>
                </Button>
              </div>

              {/* Inline stats */}
              <dl className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-stone-300">
                <div className="flex items-center gap-2">
                  <dt className="sr-only">Years in business</dt>
                  <dd className="font-semibold text-stone-50">
                    {BUSINESS.yearsInBusiness}+ yrs
                  </dd>
                  <span className="text-stone-500">in business</span>
                </div>
                <div className="hidden h-4 w-px bg-stone-700 sm:block" />
                <div className="flex items-center gap-2">
                  <dt className="sr-only">Jobs completed</dt>
                  <dd className="font-semibold text-stone-50">
                    {BUSINESS.jobsCompleted.toLocaleString()}+
                  </dd>
                  <span className="text-stone-500">jobs done</span>
                </div>
                <div className="hidden h-4 w-px bg-stone-700 sm:block" />
                <div className="flex items-center gap-2">
                  <Star className="size-4 fill-amber-500 text-amber-500" />
                  <dd className="font-semibold text-stone-50">
                    {BUSINESS.avgRating}
                  </dd>
                  <span className="text-stone-500">
                    from {BUSINESS.reviewCount} reviews
                  </span>
                </div>
              </dl>
            </motion.div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/*  Trust bar                                                       */}
        {/* ---------------------------------------------------------------- */}
        <section
          className="border-b border-stone-200 bg-white"
          aria-label="At a glance"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-6 py-8 md:grid-cols-4">
            {[
              {
                icon: Clock,
                title: `${BUSINESS.yearsInBusiness}+ Years`,
                sub: 'In Business',
              },
              {
                icon: CheckCircle2,
                title: `${BUSINESS.jobsCompleted.toLocaleString()}+`,
                sub: 'Jobs Completed',
              },
              {
                icon: Star,
                title: `${BUSINESS.avgRating}★`,
                sub: 'Average Rating',
              },
              {
                icon: ShieldCheck,
                title: 'Licensed',
                sub: '& Insured',
              },
            ].map((s, i) => (
              <motion.div
                key={s.sub}
                {...fadeUp(i * 0.06)}
                className="flex items-center justify-center gap-3 px-2 text-center md:justify-start md:text-left"
              >
                <s.icon className="size-6 shrink-0 text-amber-600" />
                <div className="leading-tight">
                  <div className="text-lg font-bold text-stone-900">
                    {s.title}
                  </div>
                  <div className="text-xs uppercase tracking-wide text-stone-500">
                    {s.sub}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/*  Services                                                        */}
        {/* ---------------------------------------------------------------- */}
        <section
          id="services"
          className="bg-white py-20 md:py-28"
          aria-labelledby="services-heading"
        >
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              {...fadeUp()}
              className="mx-auto max-w-2xl text-center"
            >
              <SectionEyebrow>What we do</SectionEyebrow>
              <h2
                id="services-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl"
              >
                Four trades. One phone call.
              </h2>
              <p className="mt-4 text-stone-500">
                From a leaking faucet to a brand-new front porch, R&amp;R
                Handyman is the single crew you need for the jobs that
                actually move the needle on your home.
              </p>
            </motion.div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {BUSINESS.services.map((service, i) => {
                const Icon = SERVICE_ICONS[service.icon] ?? Wrench;
                return (
                  <motion.article key={service.id} {...fadeUp(i * 0.08)}>
                    <Card className="h-full overflow-hidden p-0 shadow-sm transition-shadow hover:shadow-md">
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <img
                          src={service.image}
                          alt={`${service.label} work by ${BUSINESS.brand} — ${service.shortBlurb}`}
                          className="size-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute left-3 top-3">
                          <Badge className="bg-stone-950/85 text-stone-50">
                            <Icon className="size-3" />
                            {service.label}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4 p-6">
                        <CardHeader className="p-0">
                          <CardTitle className="text-xl font-semibold text-stone-900">
                            {service.label}
                          </CardTitle>
                          <p className="text-sm text-stone-500">
                            {service.shortBlurb}
                          </p>
                        </CardHeader>
                        <ul className="flex flex-col gap-2">
                          {service.bullets.map((b) => (
                            <li
                              key={b}
                              className="flex items-start gap-2 text-sm text-stone-700"
                            >
                              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-600" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-auto flex items-center justify-between border-t border-stone-200 pt-4">
                          <div className="text-sm text-stone-500">
                            Starting at{' '}
                            <span className="text-base font-bold text-stone-900">
                              {service.startingAt}
                            </span>
                          </div>
                          <Button
                            asChild
                            variant="link"
                            className="h-auto p-0 text-amber-600 hover:text-amber-700"
                          >
                            <a href="#contact">
                              Get a Quote
                              <ArrowRight className="size-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/*  Projects gallery                                                */}
        {/* ---------------------------------------------------------------- */}
        <section
          id="projects"
          className="bg-stone-50 py-20 md:py-28"
          aria-labelledby="projects-heading"
        >
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              {...fadeUp()}
              className="flex flex-col gap-3 md:items-end md:justify-between md:flex-row"
            >
              <div className="max-w-2xl">
                <SectionEyebrow>Recent work</SectionEyebrow>
                <h2
                  id="projects-heading"
                  className="mt-3 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl"
                >
                  Real projects, real Springfield homes.
                </h2>
              </div>
              <p className="text-sm text-stone-500 md:max-w-sm md:text-right">
                A small selection from {BUSINESS.owner}&apos;s phone — tap any
                photo to zoom in.
              </p>
            </motion.div>

            {/* Filter pills */}
            <div
              className="mt-8 flex flex-wrap gap-2"
              role="tablist"
              aria-label="Filter projects"
            >
              {GALLERY_FILTERS.map((f) => {
                const active = galleryFilter === f.id;
                return (
                  <Button
                    key={f.id}
                    variant={active ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setGalleryFilter(f.id)}
                    className={cn(
                      active
                        ? 'bg-stone-900 text-stone-50 hover:bg-stone-800'
                        : 'border-stone-300 text-stone-700 hover:bg-stone-100',
                    )}
                    role="tab"
                    aria-selected={active}
                  >
                    {f.label}
                  </Button>
                );
              })}
            </div>

            {/* Grid */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galleryPhotos.map((src, i) => {
                const cap = captionFor(src);
                const category = photoCategoryFor(src);
                return (
                  <motion.button
                    key={src}
                    type="button"
                    onClick={() => setLightboxSrc(src)}
                    {...fadeUp(i * 0.04)}
                    className="group relative overflow-hidden rounded-xl border border-stone-200 bg-white text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                    aria-label={`Open photo: ${cap.title}`}
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <img
                        src={src}
                        alt={cap.title}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/10 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <Badge className="mb-2 bg-amber-500/90 text-stone-950">
                          {category}
                        </Badge>
                        <div className="text-base font-semibold text-stone-50">
                          {cap.title}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/*  Process                                                         */}
        {/* ---------------------------------------------------------------- */}
        <section
          className="bg-stone-950 text-stone-50 py-20 md:py-28"
          aria-labelledby="process-heading"
        >
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              {...fadeUp()}
              className="mx-auto max-w-2xl text-center"
            >
              <SectionEyebrow>How it works</SectionEyebrow>
              <h2
                id="process-heading"
                className="mt-3 text-3xl font-bold tracking-tight md:text-4xl"
              >
                Three steps. No surprises.
              </h2>
              <p className="mt-4 text-stone-400">
                We keep the process simple, the pricing upfront, and the
                cleanup thorough.
              </p>
            </motion.div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {PROCESS_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.article
                    key={step.title}
                    {...fadeUp(i * 0.08)}
                    className="relative rounded-xl border border-stone-800 bg-stone-900/40 p-6"
                  >
                    <div className="flex items-center gap-4">
                      <span className="grid size-11 place-items-center rounded-full bg-amber-500 text-base font-bold text-stone-950">
                        {i + 1}
                      </span>
                      <Icon className="size-6 text-amber-500" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm text-stone-400">{step.body}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/*  Testimonials                                                    */}
        {/* ---------------------------------------------------------------- */}
        <section
          id="reviews"
          className="bg-white py-20 md:py-28"
          aria-labelledby="reviews-heading"
        >
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              {...fadeUp()}
              className="mx-auto max-w-2xl text-center"
            >
              <SectionEyebrow>Reviews</SectionEyebrow>
              <h2
                id="reviews-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl"
              >
                Why neighbors recommend us.
              </h2>
              <p className="mt-4 text-stone-500">
                {BUSINESS.avgRating} stars from {BUSINESS.reviewCount}+
                reviews across the Springfield area.
              </p>
            </motion.div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {TESTIMONIALS.map((t, i) => (
                <motion.article
                  key={t.name}
                  {...fadeUp(i * 0.06)}
                  className="flex h-full flex-col rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="size-5 fill-amber-500 text-amber-500"
                      />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-stone-700">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <footer className="mt-6 flex items-center justify-between gap-4 border-t border-stone-200 pt-4">
                    <div>
                      <div className="font-semibold text-stone-900">
                        {t.name}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-stone-500">
                        <MapPin className="size-3" />
                        {t.location}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-stone-300 text-stone-600"
                    >
                      {t.service}
                    </Badge>
                  </footer>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/*  Contact / lead form                                             */}
        {/* ---------------------------------------------------------------- */}
        <section
          id="contact"
          className="bg-stone-50 py-20 md:py-28"
          aria-labelledby="contact-heading"
        >
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
            {/* Left column */}
            <motion.div {...fadeUp()}>
              <SectionEyebrow>Contact</SectionEyebrow>
              <h2
                id="contact-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl"
              >
                Get your free quote
              </h2>
              <p className="mt-4 text-stone-500">
                Tell us what you need fixed. We respond to every request within
                24 hours — usually much faster. There&apos;s no charge for the
                estimate, and no obligation.
              </p>

              <ul className="mt-8 flex flex-col gap-4">
                <li className="flex items-start gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-stone-900 text-amber-400">
                    <Phone className="size-5" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-stone-900">
                      Call or text
                    </div>
                    <a
                      href={BUSINESS.phoneHref}
                      className="text-stone-600 hover:text-amber-600"
                    >
                      {BUSINESS.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-stone-900 text-amber-400">
                    <Mail className="size-5" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-stone-900">
                      Email
                    </div>
                    <a
                      href={BUSINESS.emailHref}
                      className="text-stone-600 hover:text-amber-600"
                    >
                      {BUSINESS.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-stone-900 text-amber-400">
                    <Clock className="size-5" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-stone-900">
                      Hours
                    </div>
                    <div className="text-stone-600">
                      {BUSINESS.hours.weekdays}
                    </div>
                    <div className="text-stone-600">
                      {BUSINESS.hours.saturday}
                    </div>
                    <div className="text-stone-600">
                      {BUSINESS.hours.sunday}
                    </div>
                  </div>
                </li>
              </ul>

              <div className="mt-8 flex flex-wrap gap-2">
                {BUSINESS.trustBadges.map((b) => (
                  <Badge
                    key={b}
                    variant="outline"
                    className="border-stone-300 text-stone-600"
                  >
                    <CheckCircle2 className="size-3 text-amber-600" />
                    {b}
                  </Badge>
                ))}
              </div>
            </motion.div>

            {/* Right column — form */}
            <motion.div {...fadeUp(0.1)}>
              <Card className="p-0 shadow-md">
                <CardHeader className="border-b border-stone-200">
                  <CardTitle className="text-lg font-semibold text-stone-900">
                    Request a free quote
                  </CardTitle>
                  <p className="text-sm text-stone-500">
                    We&rsquo;ll call you back within one business day.
                  </p>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleQuoteSubmit}
                    className="flex flex-col gap-4"
                  >
                    <div className="grid gap-2">
                      <Label htmlFor="quote-name">
                        Name <span className="text-amber-600">*</span>
                      </Label>
                      <Input
                        id="quote-name"
                        name="name"
                        required
                        autoComplete="name"
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="quote-phone">
                          Phone <span className="text-amber-600">*</span>
                        </Label>
                        <Input
                          id="quote-phone"
                          name="phone"
                          type="tel"
                          required
                          autoComplete="tel"
                          placeholder="(555) 014-2837"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="quote-email">Email</Label>
                        <Input
                          id="quote-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="quote-service">Service needed</Label>
                      <Select
                        value={serviceNeeded}
                        onValueChange={setServiceNeeded}
                        name="service"
                      >
                        <SelectTrigger id="quote-service" className="w-full">
                          <SelectValue placeholder="Pick the closest match" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="plumbing">Plumbing</SelectItem>
                          <SelectItem value="carpentry">Carpentry</SelectItem>
                          <SelectItem value="power-washing">
                            Power Washing
                          </SelectItem>
                          <SelectItem value="multiple">
                            Multiple / Not sure
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="quote-message">Message</Label>
                      <Textarea
                        id="quote-message"
                        name="message"
                        rows={4}
                        placeholder="Tell us what's broken or what you'd like built."
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-amber-500 text-stone-950 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Get My Free Quote
                          <Send className="size-4" />
                        </>
                      )}
                    </Button>
                    <p className="text-center text-xs text-stone-500">
                      For plumbing emergencies, call {BUSINESS.phone} directly.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/*  FAQ                                                             */}
        {/* ---------------------------------------------------------------- */}
        <section
          id="faq"
          className="bg-white py-20 md:py-28"
          aria-labelledby="faq-heading"
        >
          <div className="mx-auto max-w-3xl px-6">
            <motion.div {...fadeUp()} className="text-center">
              <SectionEyebrow>FAQ</SectionEyebrow>
              <h2
                id="faq-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl"
              >
                Questions, answered.
              </h2>
            </motion.div>

            <motion.div {...fadeUp(0.1)} className="mt-10">
              <Accordion
                type="single"
                collapsible
                defaultValue="faq-0"
                className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white"
              >
                {FAQS.map((f, i) => (
                  <AccordionItem
                    key={f.q}
                    value={`faq-${i}`}
                    className="border-b-0 px-4"
                  >
                    <AccordionTrigger className="text-left text-base font-semibold text-stone-900 hover:text-amber-600">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-stone-600">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/*  Final CTA                                                       */}
        {/* ---------------------------------------------------------------- */}
        <section
          className="bg-amber-500 text-stone-950 py-16 md:py-20"
          aria-labelledby="cta-heading"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 text-center">
            <h2
              id="cta-heading"
              className="text-3xl font-bold tracking-tight md:text-5xl"
            >
              Need it fixed this week?
            </h2>
            <p className="max-w-xl text-stone-900/80">
              Call {BUSINESS.owner} directly. Same-week appointments available
              for most plumbing and carpentry work across Springfield County.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-stone-950 text-amber-400 shadow-md hover:bg-stone-900"
            >
              <a href={BUSINESS.phoneHref}>
                <Phone className="size-4" />
                Call {BUSINESS.phone}
              </a>
            </Button>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------------------- */}
      {/*  Footer                                                          */}
      {/* ---------------------------------------------------------------- */}
      <footer className="mt-auto bg-stone-950 text-stone-400">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-md bg-amber-500 text-sm font-extrabold text-stone-950">
                R&amp;R
              </span>
              <span className="font-semibold text-stone-50">
                {BUSINESS.brand}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed">
              Plumbing, carpentry, and power washing from a single crew you can
              trust. Owned and operated by {BUSINESS.owner}.
            </p>
            <p className="mt-4 text-xs text-stone-500">
              Licensed &amp; Insured · ICC# H-2024-0000
            </p>
          </div>

          {/* Services */}
          <nav aria-label="Services">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-200">
              Services
            </h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              {BUSINESS.services.map((s) => (
                <li key={s.id}>
                  <a
                    href="#services"
                    className="transition-colors hover:text-amber-400"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Service area */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-200">
              Service area
            </h3>
            <ul
              className="mt-4 flex max-h-48 flex-col gap-2 overflow-y-auto pr-2 text-sm [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-stone-700 [&::-webkit-scrollbar-track]:bg-stone-900"
            >
              {BUSINESS.citiesServed.map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <MapPin className="size-3 text-amber-500" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Hours & contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-200">
              Hours &amp; contact
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 size-4 text-amber-500" />
                <span>
                  {BUSINESS.hours.weekdays}
                  <br />
                  {BUSINESS.hours.saturday}
                  <br />
                  {BUSINESS.hours.sunday}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-amber-500" />
                <a
                  href={BUSINESS.phoneHref}
                  className="hover:text-amber-400"
                >
                  {BUSINESS.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-amber-500" />
                <a
                  href={BUSINESS.emailHref}
                  className="hover:text-amber-400"
                >
                  {BUSINESS.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-stone-500 md:flex-row">
            <p>
              © {new Date().getFullYear()} {BUSINESS.brand}. All rights
              reserved.
            </p>
            <p></p>
          </div>
        </div>
      </footer>

      {/* ---------------------------------------------------------------- */}
      {/*  Lightbox dialog                                                 */}
      {/* ---------------------------------------------------------------- */}
      <Dialog
        open={lightboxSrc !== null}
        onOpenChange={(open) => {
          if (!open) setLightboxSrc(null);
        }}
      >
        <DialogContent className="max-w-3xl border-stone-200 bg-white p-0">
          {lightboxSrc && (
            <>
              <DialogHeader className="sr-only">
                <DialogTitle>{captionFor(lightboxSrc).title}</DialogTitle>
                <DialogDescription>
                  Enlarged project photo from {BUSINESS.brand}.
                </DialogDescription>
              </DialogHeader>
              <div className="overflow-hidden rounded-t-lg">
                <img
                  src={lightboxSrc}
                  alt={captionFor(lightboxSrc).title}
                  className="max-h-[60vh] w-full object-cover"
                />
              </div>
              <div className="px-6 pb-6 pt-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-500/15 text-amber-700">
                    {photoCategoryFor(lightboxSrc)}
                  </Badge>
                  <h3 className="text-lg font-semibold text-stone-900">
                    {captionFor(lightboxSrc).title}
                  </h3>
                </div>
                {captionFor(lightboxSrc).blurb && (
                  <p className="mt-2 text-sm text-stone-600">
                    {captionFor(lightboxSrc).blurb}
                  </p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Local subcomponents                                                       */
/* -------------------------------------------------------------------------- */

function SheetHeaderMobile() {
  return (
    <div className="flex items-center justify-between border-b border-stone-800 p-4">
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-md bg-amber-500 text-sm font-extrabold text-stone-950">
          R&amp;R
        </span>
        <SheetTitle className="text-base font-semibold text-stone-50">
          {BUSINESS.brand}
        </SheetTitle>
      </div>
      <SheetClose
        className="rounded-md p-2 text-stone-400 hover:bg-stone-800 hover:text-stone-50"
        aria-label="Close menu"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

// Reverse-lookup the human-friendly category of a photo by its src.
// Used for gallery badges and the lightbox header.
function photoCategoryFor(src: string): string {
  const photo = PHOTOS.find((p) => p.src === src);
  if (!photo) return 'Project';
  switch (photo.category) {
    case 'plumbing':
      return 'Plumbing';
    case 'carpentry':
      return 'Carpentry';
    case 'power_washing':
      return 'Power Washing';
    case 'finished_work':
      return 'Finished Work';
    case 'before_after':
      return 'Before / After';
    default:
      return 'Project';
  }
}
