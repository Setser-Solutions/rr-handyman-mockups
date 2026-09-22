'use client';

import { useState, type ReactNode } from 'react';
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
  Smile,
  Loader2,
  type LucideIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLeadForm } from '@/hooks/use-lead-form';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

import {
  GALLERY_BY_CATEGORY,
  HERO_PICKS,
  captionFor,
  type Photo,
} from '@/lib/handyman-photos';
import { BUSINESS, TESTIMONIALS, FAQS } from '@/lib/business-info';

export const DESIGN_ID = 'trusted';
export const DESIGN_NAME = 'Trusted Local Craftsman';

const NAV_LINKS: { href: string; label: string }[] = [
  { href: '#meet', label: 'Meet Rick' },
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Work' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#contact', label: 'Contact' },
];

const ICON_MAP: Record<string, LucideIcon> = {
  Droplets,
  Hammer,
  SprayCan,
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

function StarsRow({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${className ?? ''}`} aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-4 fill-amber-500 text-amber-500" />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Top nav                                    */
/* -------------------------------------------------------------------------- */

function TopNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-300 bg-stone-100/95 backdrop-blur supports-[backdrop-filter]:bg-stone-100/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-20" aria-label="Primary">
        {/* Brand */}
        <a href="#main" className="group flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-orange-600 text-stone-50 shadow-sm transition-transform group-hover:scale-105">
            <Hammer className="size-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-xl italic text-stone-900">Rick Rodriguez</span>
            <span className="text-xs font-medium uppercase tracking-wider text-stone-500">
              {BUSINESS.shortBrand}
            </span>
          </span>
        </a>

        {/* Center nav (desktop) */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-stone-700 transition-colors hover:text-orange-700"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right CTA */}
        <div className="flex items-center gap-2">
          <Button asChild className="hidden bg-orange-600 text-stone-50 hover:bg-orange-700 sm:inline-flex">
            <a href={BUSINESS.phoneHref}>
              <Phone className="size-4" />
              Call Rick
            </a>
          </Button>

          {/* Mobile hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-stone-300 bg-white text-stone-900 md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 border-stone-300 bg-stone-50">
              <SheetHeader className="pb-2">
                <SheetTitle className="font-serif text-2xl italic text-stone-900">
                  Rick Rodriguez
                </SheetTitle>
                <p className="text-xs uppercase tracking-wider text-stone-500">
                  {BUSINESS.shortBrand}
                </p>
              </SheetHeader>
              <nav className="mt-4 flex flex-col">
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <a
                      href={link.href}
                      className="border-b border-stone-200 px-1 py-3 text-base font-medium text-stone-800 transition-colors hover:text-orange-700"
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-6">
                <SheetClose asChild>
                  <Button asChild className="w-full bg-orange-600 text-stone-50 hover:bg-orange-700">
                    <a href={BUSINESS.phoneHref}>
                      <Phone className="size-4" />
                      Call {BUSINESS.phone}
                    </a>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Hero                                      */
/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-stone-100">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:gap-12 md:py-20 lg:min-h-[88vh]">
        {/* Left: copy */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="order-2 md:order-1"
        >
          <motion.div variants={fadeUp}>
            <Badge className="border-orange-200 bg-orange-100 text-orange-700 hover:bg-orange-100">
              <MapPin className="mr-1 size-3.5" />
              Springfield&apos;s neighborhood handyman
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-stone-900 sm:text-5xl md:text-6xl"
          >
            Hi, I&apos;m Rick — your <span className="text-orange-700">local handyman.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-relaxed text-stone-700">
            Plumbing, carpentry, and power washing done right, by a guy who actually shows up.
            12+ years, 1,850+ jobs, and a 4.9★ rating because I treat your home like mine.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="bg-orange-600 text-stone-50 hover:bg-orange-700">
              <a href="#contact">
                Tell Rick What You Need
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-stone-400 bg-transparent text-stone-900 hover:bg-stone-200/60"
            >
              <a href="#work">See My Work</a>
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-stone-600"
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-orange-700" />
              Licensed &amp; insured
            </span>
            <span aria-hidden className="text-stone-400">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4 text-orange-700" />
              Same-day quotes
            </span>
            <span aria-hidden className="text-stone-400">·</span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-orange-700" />
              Springfield County
            </span>
          </motion.div>
        </motion.div>

        {/* Right: portrait + overlapping card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative order-1 md:order-2"
        >
          <div className="relative overflow-hidden rounded-2xl border border-stone-300 bg-stone-200 shadow-xl shadow-orange-900/10">
            <img
              src={HERO_PICKS.garage}
              alt={captionFor(HERO_PICKS.garage).title}
              className="h-[320px] w-full object-cover sm:h-[420px] md:h-[560px]"
              loading="eager"
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-stone-900/5" />
          </div>

          {/* Overlapping owner card */}
          <Card className="absolute -bottom-5 left-4 max-w-[15rem] border-stone-300 bg-stone-50/95 p-4 shadow-lg backdrop-blur md:-left-6 md:max-w-xs">
            <div className="flex items-center gap-3">
              <div className="size-12 overflow-hidden rounded-full ring-2 ring-orange-600 ring-offset-2 ring-offset-stone-50">
                <img
                  src="/handyman-photos/img_004.jpg"
                  alt="Rick Rodriguez and a crew member in front of a finished garage shelving install"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="leading-tight">
                <p className="font-serif text-lg italic text-stone-900">Rick Rodriguez</p>
                <p className="text-xs uppercase tracking-wider text-stone-500">
                  Owner · {BUSINESS.yearsInBusiness}+ yrs
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-stone-200 pt-3">
              <StarsRow />
              <span className="text-xs text-stone-600">
                {BUSINESS.avgRating} from {BUSINESS.reviewCount} reviews
              </span>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Meet Rick                                   */
/* -------------------------------------------------------------------------- */

function MeetRick() {
  const trustItems = [
    { icon: ShieldCheck, label: 'Licensed & insured' },
    { icon: Wrench, label: `${BUSINESS.yearsInBusiness}+ years` },
    { icon: Star, label: `${BUSINESS.avgRating}★ rating` },
  ];

  return (
    <section id="meet" className="bg-white py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2 md:gap-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-stone-300 shadow-lg">
            <img
              src="/handyman-photos/img_004.jpg"
              alt="Rick Rodriguez and a crew member standing in front of a garage with newly built wooden shelving"
              className="h-[340px] w-full object-cover sm:h-[460px]"
              loading="lazy"
            />
            <div className="absolute bottom-4 left-4">
              <Badge className="border-stone-300 bg-stone-900/90 text-stone-50 hover:bg-stone-900/90">
                <Hammer className="mr-1 size-3.5" />
                Custom garage shelving crew
              </Badge>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-700">
            A few words from Rick
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            I started R&amp;R Handyman in 2012 because I was tired of seeing neighbors get burned.
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-stone-700">
            <p>
              I started R&amp;R Handyman in 2012 because I was tired of seeing neighbors get burned by
              no-show contractors and overpriced &ldquo;pros.&rdquo; I&apos;m a one-truck,
              two-tool-belt operation — when you call, I answer. When I show up, I do the work myself.
            </p>
            <p>
              Plumbing, carpentry, and power washing are the three things I do every week. That
              means I&apos;m fast, I&apos;m clean, and I know what your job should cost before I start.
            </p>
            <p>
              Every job is backed by my 12-month workmanship guarantee. If something I touched fails
              within a year, I come back and fix it free.
            </p>
          </div>

          <ul className="mt-8 flex flex-wrap gap-3">
            {trustItems.map((item) => (
              <li
                key={item.label}
                className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-stone-800"
              >
                <item.icon className="size-4 text-orange-700" />
                {item.label}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Services                                  */
/* -------------------------------------------------------------------------- */

function Services() {
  return (
    <section id="services" className="bg-stone-100 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-700">
            What Rick does
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Three trades, one phone call.
          </h2>
          <p className="mt-3 text-lg text-stone-600">
            No sub-contractors, no runaround. You call Rick, Rick does the work.
          </p>
        </Reveal>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {BUSINESS.services.map((service) => {
            const Icon = ICON_MAP[service.icon] ?? Hammer;
            return (
              <motion.div key={service.id} variants={fadeUp}>
                <Card className="group h-full overflow-hidden border-stone-300 bg-white p-0 shadow-sm transition-shadow hover:shadow-lg">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={captionFor(service.image).title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-stone-900/0 to-transparent" />
                    <Badge className="absolute left-3 top-3 border-orange-200 bg-stone-50/95 text-orange-700 hover:bg-stone-50/95">
                      {service.label}
                    </Badge>
                    <div className="absolute bottom-3 right-3 rounded-full bg-stone-900/80 px-3 py-1 text-xs font-medium text-stone-50">
                      Starting at {service.startingAt}
                    </div>
                  </div>

                  <div className="flex h-full flex-col p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex size-9 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                        <Icon className="size-5" />
                      </span>
                      <h3 className="text-xl font-semibold text-stone-900">{service.label}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-stone-600">{service.longBlurb}</p>

                    <ul className="mt-4 space-y-2">
                      {service.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-stone-700">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-orange-600" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href="#contact"
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-700 transition-colors hover:text-orange-800"
                    >
                      Ask Rick about {service.label.toLowerCase()}
                      <ArrowRight className="size-4" />
                    </a>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                              How Rick works                                */
/* -------------------------------------------------------------------------- */

function HowRickWorks() {
  const steps = [
    {
      icon: Phone,
      title: 'Tell Rick what\u2019s broken',
      body: `Call or text me at ${BUSINESS.phone}. I'll ask a few questions and give you a flat, upfront price — usually on the spot.`,
    },
    {
      icon: Calendar,
      title: 'Pick a time that works',
      body: "I'll show up when I say I will. Most jobs get on the calendar within a week; emergencies get same-day.",
    },
    {
      icon: Smile,
      title: 'Rick fixes it, cleans up, leaves',
      body: "I do the work, sweep the floor, and stand behind it for 12 months. You pay what I quoted — no surprise add-ons.",
    },
  ];

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-700">
            How Rick works
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Three steps. No surprises.
          </h2>
        </Reveal>

        <motion.ol
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-12 grid gap-8 md:grid-cols-3"
        >
          {steps.map((step, i) => (
            <motion.li key={step.title} variants={fadeUp}>
              <Card className="h-full border-stone-300 bg-stone-50 p-6 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-orange-600 text-lg font-bold text-stone-50 shadow-md">
                  {i + 1}
                </div>
                <div className="mt-4 flex justify-center">
                  <span className="flex size-10 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                    <step.icon className="size-5" />
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-stone-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{step.body}</p>
              </Card>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                             Work gallery                                   */
/* -------------------------------------------------------------------------- */

type FilterKey = 'all' | 'plumbing' | 'carpentry' | 'power_washing';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'plumbing', label: 'Plumbing' },
  { key: 'carpentry', label: 'Carpentry' },
  { key: 'power_washing', label: 'Power Washing' },
];

function categoryLabelForSrc(src: string): string {
  // Quick reverse-lookup using GALLERY_BY_CATEGORY buckets.
  const entry = (Object.keys(GALLERY_BY_CATEGORY) as (keyof typeof GALLERY_BY_CATEGORY)[]).find(
    (cat) => cat !== 'all' && GALLERY_BY_CATEGORY[cat].includes(src),
  );
  if (!entry) return 'Project';
  return entry
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function WorkGallery() {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const sources = GALLERY_BY_CATEGORY[filter].slice(0, 9);
  const activeCaption = lightboxSrc ? captionFor(lightboxSrc) : null;

  return (
    <section id="work" className="bg-stone-100 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-700">
            Recent work
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Some of the jobs Rick&apos;s done lately.
          </h2>
        </Reveal>

        {/* Filter pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="Filter work by category">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.key)}
                className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 ${
                  active
                    ? 'border-orange-600 bg-orange-600 text-stone-50'
                    : 'border-stone-300 bg-white text-stone-700 hover:border-orange-300 hover:bg-orange-50'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <motion.div
          key={filter}
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {sources.map((src) => {
            const caption = captionFor(src);
            const cat = categoryLabelForSrc(src);
            return (
              <motion.button
                key={src}
                variants={fadeUp}
                type="button"
                onClick={() => setLightboxSrc(src)}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-stone-300 bg-stone-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
                aria-label={`Open photo: ${caption.title}`}
              >
                <img
                  src={src}
                  alt={caption.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/85 via-stone-900/15 to-transparent opacity-90" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <Badge className="border-orange-200 bg-stone-50/95 text-orange-700 hover:bg-stone-50/95">
                    {cat}
                  </Badge>
                  <p className="mt-2 text-sm font-semibold text-stone-50">{caption.title}</p>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Lightbox */}
      <Dialog open={!!lightboxSrc} onOpenChange={(o) => !o && setLightboxSrc(null)}>
        <DialogContent className="max-w-3xl border-stone-300 bg-stone-50 p-0">
          {activeCaption && lightboxSrc && (
            <>
              <div className="overflow-hidden rounded-t-lg">
                <img
                  src={lightboxSrc}
                  alt={activeCaption.title}
                  className="max-h-[70vh] w-full object-contain bg-stone-900"
                />
              </div>
              <DialogHeader className="px-6 pb-2 pt-4">
                <div className="flex items-center gap-2">
                  <Badge className="border-orange-200 bg-orange-100 text-orange-700 hover:bg-orange-100">
                    {categoryLabelForSrc(lightboxSrc)}
                  </Badge>
                </div>
                <DialogTitle className="font-serif text-xl text-stone-900">
                  {activeCaption.title}
                </DialogTitle>
                <DialogDescription className="text-stone-600">
                  {activeCaption.blurb || 'A recent project from Rick Rodriguez at R&R Handyman Services.'}
                </DialogDescription>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Testimonials                                 */
/* -------------------------------------------------------------------------- */

function Testimonials() {
  const picks = [TESTIMONIALS[0], TESTIMONIALS[2]];

  function initials(name: string): string {
    return name
      .split(/\s|&|and/i)
      .map((p) => p.trim().charAt(0))
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  return (
    <section id="reviews" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-700">
            From the neighbors
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            What the neighbors are saying.
          </h2>
        </Reveal>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-12 grid gap-6 md:grid-cols-2"
        >
          {picks.map((t) => (
            <motion.div key={t.name} variants={fadeUp}>
              <Card className="h-full border-stone-300 bg-stone-50 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <StarsRow />
                  <span className="text-sm font-semibold text-stone-500">5.0</span>
                </div>
                <blockquote className="mt-4 text-lg leading-relaxed text-stone-800">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-6 flex items-center gap-3 border-t border-stone-200 pt-4">
                  <div className="flex size-11 items-center justify-center rounded-full bg-orange-600 text-sm font-semibold text-stone-50">
                    {initials(t.name)}
                  </div>
                  <div className="leading-tight">
                    <p className="font-semibold text-stone-900">{t.name}</p>
                    <p className="text-xs text-stone-500">
                      {t.location} · {t.service}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                            Trust badges band                               */
/* -------------------------------------------------------------------------- */

function TrustBand() {
  const badges = [
    { icon: ShieldCheck, label: 'Licensed & Insured' },
    { icon: Wrench, label: `${BUSINESS.yearsInBusiness}+ Years` },
    { icon: Hammer, label: `${BUSINESS.jobsCompleted.toLocaleString()}+ Jobs` },
    { icon: Star, label: `${BUSINESS.avgRating}★ from ${BUSINESS.reviewCount} Reviews` },
  ];

  return (
    <section className="border-y border-orange-200 bg-orange-50 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {badges.map((b) => (
            <li key={b.label} className="flex items-center justify-center gap-2 text-center md:justify-start">
              <b.icon className="size-5 shrink-0 text-orange-700" />
              <span className="text-sm font-semibold text-stone-800 sm:text-base">{b.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Lead form                                   */
/* -------------------------------------------------------------------------- */

function LeadForm() {
  const [formKey, setFormKey] = useState(0);

  const { submit: handleSubmit, submitting } = useLeadForm({
    design: 'trusted',
    successTitle: 'Got it — Rick will call you back within 24 hours.',
    successDescription: 'For emergencies, call (555) 014-2837 directly.',
    onAfterSubmit: () => setFormKey((k) => k + 1),
  });

  const contactRows = [
    { icon: Phone, label: 'Call or text', value: BUSINESS.phone, href: BUSINESS.phoneHref },
    { icon: Mail, label: 'Email', value: BUSINESS.email, href: BUSINESS.emailHref },
    {
      icon: Clock,
      label: 'Hours',
      value: `${BUSINESS.hours.weekdays} · ${BUSINESS.hours.saturday}`,
    },
    {
      icon: MapPin,
      label: 'Service area',
      value: BUSINESS.serviceArea,
    },
  ];

  return (
    <section id="contact" className="bg-stone-100 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-start gap-12 px-6 md:grid-cols-2 md:gap-16">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-700">
            Tell Rick
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Tell Rick what you need.
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-stone-700">
            Drop your info below and Rick will call you back within 24 hours — usually sooner. For
            after-hours emergencies, just call the shop line directly.
          </p>

          <ul className="mt-8 space-y-4">
            {contactRows.map((row) => {
              const inner = (
                <>
                  <span className="flex size-10 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                    <row.icon className="size-5" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-stone-500">
                      {row.label}
                    </span>
                    <span className="text-base font-medium text-stone-900">{row.value}</span>
                  </span>
                </>
              );
              return (
                <li key={row.label}>
                  {row.href ? (
                    <a
                      href={row.href}
                      className="flex items-center gap-4 rounded-lg p-1 transition-colors hover:text-orange-700"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 p-1">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <Card className="border-stone-300 bg-white p-6 shadow-lg md:p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="font-serif text-2xl text-stone-900">
                Send Rick a message
              </CardTitle>
              <CardDescription className="text-stone-600">
                No obligation. Rick replies himself — usually the same day.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
              <form key={formKey} onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="trusted-name" className="text-stone-800">
                    Your name <span className="text-orange-700">*</span>
                  </Label>
                  <Input
                    id="trusted-name"
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Pat Springfield"
                    className="border-stone-300 bg-stone-50 focus-visible:border-orange-600 focus-visible:ring-orange-600/30"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="trusted-phone" className="text-stone-800">
                      Phone <span className="text-orange-700">*</span>
                    </Label>
                    <Input
                      id="trusted-phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="(555) 000-0000"
                      className="border-stone-300 bg-stone-50 focus-visible:border-orange-600 focus-visible:ring-orange-600/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trusted-email" className="text-stone-800">
                      Email <span className="text-stone-400">(optional)</span>
                    </Label>
                    <Input
                      id="trusted-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="border-stone-300 bg-stone-50 focus-visible:border-orange-600 focus-visible:ring-orange-600/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trusted-service" className="text-stone-800">
                    What do you need?
                  </Label>
                  <Select name="service" defaultValue="">
                    <SelectTrigger
                      id="trusted-service"
                      className="w-full border-stone-300 bg-stone-50 focus-visible:border-orange-600 focus-visible:ring-orange-600/30"
                    >
                      <SelectValue placeholder="Pick a trade — or ask Rick" />
                    </SelectTrigger>
                    <SelectContent className="border-stone-300 bg-white">
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="carpentry">Carpentry</SelectItem>
                      <SelectItem value="power-washing">Power Washing</SelectItem>
                      <SelectItem value="not-sure">Not sure / multiple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trusted-message" className="text-stone-800">
                    Anything else Rick should know?
                  </Label>
                  <Textarea
                    id="trusted-message"
                    name="message"
                    rows={4}
                    placeholder="e.g., kitchen faucet started dripping Tuesday, looks like the shutoff is stuck too."
                    className="resize-y border-stone-300 bg-stone-50 focus-visible:border-orange-600 focus-visible:ring-orange-600/30"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="w-full bg-orange-600 text-stone-50 hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Send Rick a Message
                    </>
                  )}
                </Button>
                <p className="text-center text-xs text-stone-500">
                  By sending, you agree Rick can call or text you back about your project.
                </p>
              </form>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   FAQ                                      */
/* -------------------------------------------------------------------------- */

function FAQ() {
  return (
    <section id="faq" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-700">
            Quick answers
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Questions Rick hears a lot.
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <Accordion
            type="single"
            collapsible
            className="rounded-xl border border-stone-300 bg-stone-50 px-4 md:px-6"
          >
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={faq.q}
                value={`faq-${i}`}
                className="border-b border-stone-200 last:border-b-0"
              >
                <AccordionTrigger className="text-left text-base font-semibold text-stone-900 hover:text-orange-700 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-stone-700">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Service area                                  */
/* -------------------------------------------------------------------------- */

function ServiceArea() {
  return (
    <section className="bg-stone-100 py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <Card className="overflow-hidden border-stone-300 bg-white shadow-sm">
            <div className="grid items-center gap-8 p-6 md:grid-cols-2 md:p-10">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-orange-700">
                  Where Rick works
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                  Serving Springfield County &amp; the surrounding towns.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-stone-600">
                  Not on the list? Call — I cover most of Springfield County and I&apos;m happy to
                  drive for the right job.
                </p>
                <Button
                  asChild
                  className="mt-6 bg-orange-600 text-stone-50 hover:bg-orange-700"
                >
                  <a href={BUSINESS.phoneHref}>
                    <Phone className="size-4" />
                    Call {BUSINESS.phone}
                  </a>
                </Button>
              </div>

              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-2">
                {BUSINESS.citiesServed.map((city) => (
                  <li
                    key={city}
                    className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm font-medium text-stone-800"
                  >
                    <MapPin className="size-4 text-orange-700" />
                    {city}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Final CTA banner                              */
/* -------------------------------------------------------------------------- */

function FinalCTA() {
  return (
    <section className="bg-stone-900 py-16 text-stone-50 md:py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Ready to get this off your to-do list?
          </h2>
          <p className="mt-4 text-lg text-stone-300">
            Call or text Rick directly — 7 days a week. Same-day quotes on most jobs.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-orange-600 text-stone-50 hover:bg-orange-700"
            >
              <a href={BUSINESS.phoneHref}>
                <Phone className="size-4" />
                {BUSINESS.phone}
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-stone-600 bg-transparent text-stone-50 hover:bg-stone-800"
            >
              <a href="#contact">
                <Mail className="size-4" />
                Send a message
              </a>
            </Button>
          </div>
          <p className="mt-6 text-sm text-stone-400">
            Text or call, 7 days a week · Emergency plumbing welcome
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Footer                                    */
/* -------------------------------------------------------------------------- */

function Footer() {
  return (
    <footer className="mt-auto bg-stone-900 text-stone-400">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-orange-600 text-stone-50">
                <Hammer className="size-4" />
              </span>
              <p className="font-serif text-lg italic text-stone-50">Rick Rodriguez</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed">
              {BUSINESS.brand} — plumbing, carpentry, and power washing done right,
              by a guy who actually shows up.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-300">
              <ShieldCheck className="size-4 text-orange-500" />
              Licensed &amp; Insured
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-200">Services</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {BUSINESS.services.map((s) => (
                <li key={s.id}>
                  <a href="#services" className="transition-colors hover:text-orange-400">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service area */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-200">
              Service area
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {BUSINESS.citiesServed.slice(0, 6).map((city) => (
                <li key={city} className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-orange-500" />
                  {city}
                </li>
              ))}
              <li className="pt-1 text-xs text-stone-500">& surrounding towns</li>
            </ul>
          </div>

          {/* Hours + contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-200">
              Hours &amp; contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 size-4 shrink-0 text-orange-500" />
                <span>
                  {BUSINESS.hours.weekdays}
                  <br />
                  {BUSINESS.hours.saturday}
                  <br />
                  {BUSINESS.hours.sunday}
                </span>
              </li>
              <li>
                <a
                  href={BUSINESS.phoneHref}
                  className="flex items-center gap-2 transition-colors hover:text-orange-400"
                >
                  <Phone className="size-4 shrink-0 text-orange-500" />
                  {BUSINESS.phone}
                </a>
              </li>
              <li>
                <a
                  href={BUSINESS.emailHref}
                  className="flex items-center gap-2 transition-colors hover:text-orange-400"
                >
                  <Mail className="size-4 shrink-0 text-orange-500" />
                  {BUSINESS.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-stone-800 pt-6 text-xs text-stone-500 sm:flex-row">
          <p>© 2024 {BUSINESS.brand}. All rights reserved.</p>
          <p>Website mockup — sample design</p>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Main component                                */
/* -------------------------------------------------------------------------- */

export default function DesignTrusted() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-100">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-orange-600 focus:px-4 focus:py-2 focus:text-stone-50">
        Skip to content
      </a>

      <TopNav />

      <main id="main" className="flex-1">
        <Hero />
        <MeetRick />
        <Services />
        <HowRickWorks />
        <WorkGallery />
        <Testimonials />
        <TrustBand />
        <LeadForm />
        <FAQ />
        <ServiceArea />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
