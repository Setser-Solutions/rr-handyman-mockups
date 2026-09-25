'use client';

import { useMemo, useState, type ReactNode } from 'react';
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
  Camera,
  Images,
  Quote,
  type LucideIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
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
} from '@/lib/handyman-photos';
import { BUSINESS, TESTIMONIALS, FAQS } from '@/lib/business-info';

export const DESIGN_ID = 'final';
export const DESIGN_NAME = 'R&R Handyman';

const CURRENT_YEAR = new Date().getFullYear();

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

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
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
    <div
      className={`flex items-center gap-0.5 ${className ?? ''}`}
      aria-label="5 out of 5 stars"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-4 fill-yellow-500 text-yellow-500" />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Top nav                                    */
/* -------------------------------------------------------------------------- */

function TopNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-300 bg-stone-100/95 backdrop-blur supports-[backdrop-filter]:bg-stone-100/80">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-20"
        aria-label="Primary"
      >
        {/* Brand */}
        <a href="#main" className="group flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-yellow-400 text-slate-900 shadow-sm transition-transform group-hover:scale-105">
            <Hammer className="size-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-xl italic text-slate-900">
              Rick Rodriguez
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-stone-500">
              {BUSINESS.brand}
            </span>
          </span>
        </a>

        {/* Center nav (desktop) */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-stone-700 transition-colors hover:text-blue-700"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right CTA */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            className="hidden bg-blue-600 text-stone-50 hover:bg-blue-700 hover:ring-2 hover:ring-yellow-400 hover:ring-offset-2 sm:inline-flex"
          >
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
                className="border-stone-300 bg-white text-slate-900 md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 border-stone-300 bg-stone-50">
              <SheetHeader className="pb-2">
                <SheetTitle className="font-serif text-2xl italic text-slate-900">
                  Rick Rodriguez
                </SheetTitle>
                <p className="text-xs uppercase tracking-wider text-stone-500">
                  {BUSINESS.brand}
                </p>
              </SheetHeader>
              <nav className="mt-4 flex flex-col" aria-label="Mobile primary">
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <a
                      href={link.href}
                      className="border-b border-stone-200 px-1 py-3 text-base font-medium text-stone-800 transition-colors hover:text-blue-700"
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-6">
                <SheetClose asChild>
                  <Button
                    asChild
                    className="w-full bg-blue-600 text-stone-50 hover:bg-blue-700 hover:ring-2 hover:ring-yellow-400 hover:ring-offset-2"
                  >
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
/*                                   Hero                                      */
/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section
      aria-label="Rick Rodriguez introduction"
      className="relative overflow-hidden bg-stone-100"
    >
      <div className="grid items-stretch md:grid-cols-2 md:min-h-[88vh]">
        {/* Left: copy */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="order-2 flex flex-col justify-center gap-6 px-6 py-16 md:order-1 md:px-12 md:py-20 lg:px-16"
        >
          <motion.div variants={fadeUp}>
            <Badge className="border-yellow-300 bg-yellow-50 text-yellow-800 hover:bg-yellow-50">
              <MapPin className="mr-1 size-3.5" />
              {BUSINESS.primaryCity}&apos;s neighborhood handyman
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl md:text-6xl"
          >
            Hi, I&apos;m Rick — your{' '}
            <span className="text-blue-700">local handyman.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-xl text-base leading-relaxed text-stone-700 sm:text-lg"
          >
            Power washing, carpentry, electrical, and plumbing done right, by a guy who actually
            shows up. {BUSINESS.yearsInBusiness}+ years,{' '}
            {BUSINESS.jobsCompleted.toLocaleString()}+ jobs, and a {BUSINESS.avgRating}★
            rating because I treat your home like mine.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-3"
          >
            <Button
              asChild
              size="lg"
              className="bg-blue-600 text-stone-50 hover:bg-blue-700 hover:ring-2 hover:ring-yellow-400 hover:ring-offset-2"
            >
              <a href="#contact">
                Tell Rick What You Need
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-stone-400 bg-transparent text-slate-900 hover:bg-stone-200/60"
            >
              <a href="#work">
                <Images className="size-4" />
                See My Work
              </a>
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-600"
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-blue-700" />
              Licensed &amp; insured
            </span>
            <span aria-hidden className="text-stone-400">
              ·
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4 text-blue-700" />
              Same-day quotes
            </span>
            <span aria-hidden className="text-stone-400">
              ·
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-blue-700" />
              {BUSINESS.serviceArea.split('&')[0].trim()}
            </span>
          </motion.div>
        </motion.div>

        {/* Right: before/after image + overlapping owner card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative order-1 min-h-[60vh] bg-stone-200 md:order-2 md:min-h-0"
        >
          <img
            src={HERO_PICKS.power_washing}
            alt="Concrete patio power wash showing a clean half next to a dirty half — the before-and-after difference"
            className="absolute inset-0 size-full object-cover"
            loading="eager"
          />
          <Badge className="absolute left-4 top-4 gap-1.5 bg-yellow-400 px-3 py-1.5 text-xs text-slate-900 font-bold shadow-lg">
            <Camera className="size-3.5" />
            Before / After
          </Badge>

          {/* Overlapping owner card */}
          <Card className="absolute -bottom-5 left-4 max-w-[16rem] border-stone-300 bg-stone-50/95 p-4 shadow-lg backdrop-blur md:-left-6">
            <div className="flex items-center gap-3">
              <div className="size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-blue-600 ring-offset-2 ring-offset-stone-50">
                <img
                  src="/handyman-photos/img_004.jpg"
                  alt="Rick Rodriguez and a crew member standing in front of a finished garage shelving install"
                  className="size-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="leading-tight">
                <p className="font-serif text-lg italic text-slate-900">
                  Rick Rodriguez
                </p>
                <p className="text-xs uppercase tracking-wider text-stone-500">
                  Owner · {BUSINESS.brand}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-stone-200 pt-3">
              <StarsRow />
              <span className="text-xs text-stone-600">
                {BUSINESS.avgRating}★ · {BUSINESS.yearsInBusiness}+ yrs
              </span>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Trust bar                                    */
/* -------------------------------------------------------------------------- */

function TrustBar() {
  const stats = [
    { icon: ShieldCheck, label: 'Licensed & Insured' },
    { icon: Wrench, label: `${BUSINESS.yearsInBusiness}+ Years` },
    { icon: Hammer, label: `${BUSINESS.jobsCompleted.toLocaleString()}+ Jobs` },
    {
      icon: Star,
      label: `${BUSINESS.avgRating}★ from ${BUSINESS.reviewCount} Reviews`,
    },
  ];

  return (
    <section
      aria-label="Trust badges"
      className="border-y border-blue-200 bg-blue-50 py-8"
    >
      <div className="mx-auto max-w-7xl px-6">
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s) => (
            <li
              key={s.label}
              className="flex items-center justify-center gap-2 text-center md:justify-start"
            >
              <s.icon className="size-5 shrink-0 text-blue-700" />
              <span className="text-sm font-semibold text-stone-800 sm:text-base">
                {s.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Services                                    */
/* -------------------------------------------------------------------------- */

function Services() {
  return (
    <section id="services" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-600">
            What Rick does
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Four trades, one phone call.
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
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
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
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 to-transparent" />
                    <Badge className="absolute left-3 top-3 border-yellow-300 bg-stone-50/95 text-yellow-700 hover:bg-stone-50/95">
                      {service.label}
                    </Badge>
                    <div className="absolute bottom-3 right-3 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-slate-900">
                      Starting at {service.startingAt}
                    </div>
                  </div>

                  <div className="flex h-full flex-col p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex size-9 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
                        <Icon className="size-5" />
                      </span>
                      <h3 className="text-xl font-semibold text-slate-900">
                        {service.label}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-stone-600">
                      {service.longBlurb}
                    </p>

                    <ul className="mt-4 space-y-2">
                      {service.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-2 text-sm text-stone-700"
                        >
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-yellow-600" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href="#contact"
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800"
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
/*                                Meet Rick                                    */
/* -------------------------------------------------------------------------- */

function MeetRick() {
  const trustItems = [
    { icon: ShieldCheck, label: 'Licensed & insured' },
    { icon: Wrench, label: `${BUSINESS.yearsInBusiness}+ years` },
    { icon: Star, label: `${BUSINESS.avgRating}★ rating` },
  ];

  return (
    <section id="meet" className="bg-stone-100 py-20 md:py-28">
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
              <Badge className="border-stone-300 bg-slate-900/90 text-stone-50 hover:bg-slate-900/90">
                <Hammer className="mr-1 size-3.5" />
                Custom garage shelving crew
              </Badge>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-600">
            A few words from Rick
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            I started R&amp;R Handyman in 2012 because I was tired of seeing
            neighbors get burned.
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-stone-700">
            <p>
              I started R&amp;R Handyman in 2012 because I was tired of seeing
              neighbors get burned by no-show contractors and overpriced{' '}
              &ldquo;pros.&rdquo; I&apos;m a one-truck, two-tool-belt operation —
              when you call, I answer. When I show up, I do the work myself.
            </p>
            <p>
              Power washing, carpentry, electrical, and plumbing are the four things I do
              every week. That means I&apos;m fast, I&apos;m clean, and I know
              what your job should cost before I start.
            </p>
            <p>
              Every job is backed by my 12-month workmanship guarantee. If
              something I touched fails within a year, I come back and fix it
              free.
            </p>
          </div>

          <ul className="mt-8 flex flex-wrap gap-3">
            {trustItems.map((item) => (
              <li
                key={item.label}
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-stone-800"
              >
                <item.icon className="size-4 text-blue-700" />
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
/*                          Case study spotlight                               */
/* -------------------------------------------------------------------------- */

function CaseStudySpotlight() {
  const t = TESTIMONIALS[0];

  return (
    <section
      aria-labelledby="spotlight-heading"
      className="bg-slate-900 py-20 text-stone-50 md:py-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-2 md:gap-12">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="relative overflow-hidden rounded-2xl border border-stone-800 shadow-xl"
        >
          <img
            src="/handyman-photos/img_026.jpg"
            alt="Deck board refinish before and after — weathered gray planks meet freshly replaced bright yellow pine"
            className="aspect-[4/3] w-full object-cover"
            loading="lazy"
          />
          <Badge className="absolute left-4 top-4 gap-1.5 bg-blue-600 px-3 py-1.5 text-stone-50">
            <Camera className="size-3.5" />
            Before / After
          </Badge>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-yellow-600">
            Project Spotlight
          </p>
          <h3
            id="spotlight-heading"
            className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
          >
            Project Spotlight: Deck Refinish
          </h3>
          <p className="mt-4 leading-relaxed text-stone-300">
            We lifted years of weathered gray deck boards and replaced them with
            new yellow pine, feathered into the existing framing, sanded smooth,
            and sealed against the next ten winters. The contrast — clean bright
            wood next to sun-bleached gray — is the kind of before/after that
            makes neighbors ask for the contractor&apos;s number.
          </p>

          <blockquote className="mt-6 border-l-2 border-blue-500 pl-4">
            <Quote className="size-5 text-blue-500" />
            <p className="mt-2 italic leading-relaxed text-stone-100">
              &ldquo;{t.quote}&rdquo;
            </p>
            <footer className="mt-3 text-sm text-stone-400">
              — {t.name}, {t.location} · {t.service}
            </footer>
          </blockquote>

          <div className="mt-7">
            <Button
              asChild
              className="bg-blue-600 text-stone-50 hover:bg-blue-700 hover:ring-2 hover:ring-yellow-400 hover:ring-offset-2"
            >
              <a href="#contact">
                Request a deck quote
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                            Project gallery                                  */
/* -------------------------------------------------------------------------- */

type GalleryFilter = 'all' | 'plumbing' | 'carpentry' | 'power_washing' | 'electrical';

const GALLERY_FILTERS: { key: GalleryFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'plumbing', label: 'Plumbing' },
  { key: 'carpentry', label: 'Carpentry' },
  { key: 'power_washing', label: 'Power Washing' },
  { key: 'electrical', label: 'Electrical' },
];

const FILTER_BADGE_LABEL: Record<GalleryFilter, string> = {
  all: 'Project',
  plumbing: 'Plumbing',
  carpentry: 'Carpentry',
  power_washing: 'Power Washing',
  electrical: 'Electrical',
};

function categoryLabelForSrc(src: string): string {
  const entry = (
    Object.keys(GALLERY_BY_CATEGORY) as (keyof typeof GALLERY_BY_CATEGORY)[]
  ).find((cat) => cat !== 'all' && GALLERY_BY_CATEGORY[cat].includes(src));
  if (!entry) return 'Project';
  return entry
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function ProjectGallery() {
  const [filter, setFilter] = useState<GalleryFilter>('all');
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const sources = useMemo(
    () => GALLERY_BY_CATEGORY[filter] ?? GALLERY_BY_CATEGORY.all,
    [filter],
  );
  const activeCaption = lightboxSrc ? captionFor(lightboxSrc) : null;

  return (
    <section id="work" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-600">
            Recent work
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Some of the jobs Rick&apos;s done lately.
          </h2>
          <p className="mt-3 text-base text-stone-600">
            Filter by trade — every photo is a real R&amp;R job, not a stock image.
          </p>
        </Reveal>

        {/* Filter pills */}
        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
          role="tablist"
          aria-label="Filter work by category"
        >
          {GALLERY_FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.key)}
                className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                  active
                    ? 'border-blue-600 bg-blue-600 text-stone-50'
                    : 'border-stone-300 bg-white text-stone-700 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Masonry grid */}
        {sources.length === 0 ? (
          <p className="py-12 text-center text-stone-500">
            No photos in this category yet.
          </p>
        ) : (
          <motion.div
            key={filter}
            variants={stagger}
            initial="hidden"
            animate="show"
            className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4"
          >
            {sources.map((src) => {
              const caption = captionFor(src);
              const cat = categoryLabelForSrc(src);
              const filterLabel =
                filter === 'all' ? cat : FILTER_BADGE_LABEL[filter];
              return (
                <motion.button
                  key={src}
                  variants={fadeIn}
                  type="button"
                  onClick={() => setLightboxSrc(src)}
                  className="group relative block w-full break-inside-avoid overflow-hidden rounded-xl border border-stone-300 bg-stone-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  aria-label={`Open photo: ${caption.title}`}
                >
                  <img
                    src={src}
                    alt={caption.title}
                    className="block w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <Badge className="mb-2 border-yellow-300 bg-stone-50/95 text-yellow-700 hover:bg-stone-50/95">
                      {filterLabel}
                    </Badge>
                    <p className="text-sm font-semibold text-stone-50">
                      {caption.title}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog
        open={!!lightboxSrc}
        onOpenChange={(open) => {
          if (!open) setLightboxSrc(null);
        }}
      >
        <DialogContent className="max-w-3xl border-stone-300 bg-stone-50 p-0">
          {activeCaption && lightboxSrc && (
            <>
              <div className="overflow-hidden rounded-t-lg">
                <img
                  src={lightboxSrc}
                  alt={activeCaption.title}
                  className="max-h-[70vh] w-full bg-slate-900 object-contain"
                />
              </div>
              <DialogHeader className="px-6 pb-4 pt-4">
                <div className="flex items-center gap-2">
                  <Badge className="border-yellow-300 bg-yellow-50 text-yellow-800 hover:bg-yellow-50">
                    {categoryLabelForSrc(lightboxSrc)}
                  </Badge>
                </div>
                <DialogTitle className="font-serif text-xl text-slate-900">
                  {activeCaption.title}
                </DialogTitle>
                <DialogDescription className="text-stone-600">
                  {activeCaption.blurb ||
                    'A recent project from Rick Rodriguez at R&R Handyman Services.'}
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
/*                             How Rick works                                  */
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
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-600">
            How Rick works
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
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
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-stone-50 shadow-md">
                  {i + 1}
                </div>
                <div className="mt-4 flex justify-center">
                  <span className="flex size-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
                    <step.icon className="size-5" />
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {step.body}
                </p>
              </Card>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Testimonials                                  */
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
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-600">
            From the neighbors
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
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
                  <span className="text-sm font-semibold text-stone-500">
                    {t.rating.toFixed(1)}
                  </span>
                </div>
                <blockquote className="mt-4 text-lg leading-relaxed text-stone-800">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-6 flex items-center gap-3 border-t border-stone-200 pt-4">
                  <div className="flex size-11 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-stone-50">
                    {initials(t.name)}
                  </div>
                  <div className="leading-tight">
                    <p className="font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-stone-500">
                      {t.location} ·{' '}
                      <Badge
                        variant="outline"
                        className="border-blue-200 bg-blue-50 px-1.5 py-0 text-[10px] font-medium text-blue-700"
                      >
                        {t.service}
                      </Badge>
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
/*                            Trust badges band                                */
/* -------------------------------------------------------------------------- */

function TrustBadgesBand() {
  const badges = [
    { icon: ShieldCheck, label: 'Licensed & Insured' },
    { icon: Wrench, label: `${BUSINESS.yearsInBusiness}+ Years` },
    {
      icon: Hammer,
      label: `${BUSINESS.jobsCompleted.toLocaleString()}+ Jobs`,
    },
    {
      icon: Star,
      label: `${BUSINESS.avgRating}★ from ${BUSINESS.reviewCount} Reviews`,
    },
  ];

  return (
    <section
      aria-label="Why neighbors trust R&R Handyman"
      className="border-y border-blue-200 bg-blue-50 py-10"
    >
      <div className="mx-auto max-w-7xl px-6">
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {badges.map((b) => (
            <li
              key={b.label}
              className="flex items-center justify-center gap-2 text-center md:justify-start"
            >
              <b.icon className="size-5 shrink-0 text-blue-700" />
              <span className="text-sm font-semibold text-stone-800 sm:text-base">
                {b.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Lead form                                   */
/* -------------------------------------------------------------------------- */

function LeadForm() {
  const [formKey, setFormKey] = useState(0);

  const { submit: handleSubmit, submitting } = useLeadForm({
    design: 'final',
    successTitle: 'Got it — Rick will call you back within 24 hours.',
    successDescription: `For emergencies, call ${BUSINESS.phone} directly.`,
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
      label: 'Cities served',
      value: BUSINESS.serviceArea,
    },
  ];

  return (
    <section id="contact" className="bg-stone-100 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-start gap-12 px-6 md:grid-cols-2 md:gap-16">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-600">
            Tell Rick
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Tell Rick what you need.
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-stone-700">
            Drop your info below and Rick will call you back within 24 hours —
            usually sooner. For after-hours emergencies, just call the shop line
            directly.
          </p>

          <ul className="mt-8 space-y-4">
            {contactRows.map((row) => {
              const inner = (
                <>
                  <span className="flex size-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
                    <row.icon className="size-5" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-stone-500">
                      {row.label}
                    </span>
                    <span className="text-base font-medium text-slate-900">
                      {row.value}
                    </span>
                  </span>
                </>
              );
              return (
                <li key={row.label}>
                  {row.href ? (
                    <a
                      href={row.href}
                      className="flex items-center gap-4 rounded-lg p-1 transition-colors hover:text-blue-700"
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
              <CardTitle className="font-serif text-2xl text-slate-900">
                Send Rick a message
              </CardTitle>
              <CardDescription className="text-stone-600">
                No obligation. Rick replies himself — usually the same day.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
              <form
                key={formKey}
                onSubmit={handleSubmit}
                className="space-y-4"
                noValidate
              >
                <div className="space-y-2">
                  <Label htmlFor="final-name" className="text-stone-800">
                    Your name <span className="text-blue-700">*</span>
                  </Label>
                  <Input
                    id="final-name"
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Pat"
                    className="border-stone-300 bg-stone-50 focus-visible:border-blue-600 focus-visible:ring-blue-600/30"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="final-phone" className="text-stone-800">
                      Phone <span className="text-blue-700">*</span>
                    </Label>
                    <Input
                      id="final-phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="(555) 000-0000"
                      className="border-stone-300 bg-stone-50 focus-visible:border-blue-600 focus-visible:ring-blue-600/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="final-email" className="text-stone-800">
                      Email <span className="text-stone-400">(optional)</span>
                    </Label>
                    <Input
                      id="final-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="border-stone-300 bg-stone-50 focus-visible:border-blue-600 focus-visible:ring-blue-600/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="final-service" className="text-stone-800">
                    What do you need?
                  </Label>
                  <Select name="service" defaultValue="">
                    <SelectTrigger
                      id="final-service"
                      className="w-full border-stone-300 bg-stone-50 focus-visible:border-blue-600 focus-visible:ring-blue-600/30"
                    >
                      <SelectValue placeholder="Pick a trade — or ask Rick" />
                    </SelectTrigger>
                    <SelectContent className="border-stone-300 bg-white">
                      <SelectItem value="power-washing">Power Washing</SelectItem>
                      <SelectItem value="carpentry">Carpentry</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="not-sure">Not sure / multiple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="final-message" className="text-stone-800">
                    Anything else Rick should know?
                  </Label>
                  <Textarea
                    id="final-message"
                    name="message"
                    rows={4}
                    placeholder="e.g., kitchen faucet started dripping Tuesday, looks like the shutoff is stuck too."
                    className="resize-y border-stone-300 bg-stone-50 focus-visible:border-blue-600 focus-visible:ring-blue-600/30"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-stone-50 hover:bg-blue-700 hover:ring-2 hover:ring-yellow-400 hover:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
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
                  By sending, you agree Rick can call or text you back about your
                  project.
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
/*                                    FAQ                                      */
/* -------------------------------------------------------------------------- */

function FAQ() {
  return (
    <section id="faq" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-600">
            Quick answers
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
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
                <AccordionTrigger className="text-left text-base font-semibold text-slate-900 hover:text-blue-700 hover:no-underline">
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
/*                               Service area                                  */
/* -------------------------------------------------------------------------- */

function ServiceArea() {
  return (
    <section className="bg-stone-100 py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <Card className="overflow-hidden border-stone-300 bg-white shadow-sm">
            <div className="grid items-center gap-8 p-6 md:grid-cols-2 md:p-10">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-yellow-600">
                  Where Rick works
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Where Rick works.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-stone-600">
                  Not on the list? Call — I cover most of {BUSINESS.serviceArea} and
                  I&apos;m happy to drive for the right job.
                </p>
                <Button
                  asChild
                  className="mt-6 bg-blue-600 text-stone-50 hover:bg-blue-700 hover:ring-2 hover:ring-yellow-400 hover:ring-offset-2"
                >
                  <a href={BUSINESS.phoneHref}>
                    <Phone className="size-4" />
                    Call {BUSINESS.phone}
                  </a>
                </Button>
              </div>

              <ul className="grid grid-cols-2 gap-2">
                {BUSINESS.citiesServed.map((city) => (
                  <li
                    key={city}
                    className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm font-medium text-stone-800"
                  >
                    <MapPin className="size-4 text-blue-700" />
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
/*                              Final CTA banner                               */
/* -------------------------------------------------------------------------- */

function FinalCTA() {
  return (
    <section className="bg-slate-900 py-16 text-stone-50 md:py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Ready to get this off your to-do list?
          </h2>
          <p className="mt-4 text-lg text-stone-300">
            Call or text Rick directly — 7 days a week. Same-day quotes on most
            jobs.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-blue-600 text-stone-50 hover:bg-blue-700 hover:ring-2 hover:ring-yellow-400 hover:ring-offset-2"
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
/*                                   Footer                                    */
/* -------------------------------------------------------------------------- */

function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-stone-400">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-yellow-400 text-slate-900">
                <Hammer className="size-4" />
              </span>
              <p className="font-serif text-lg italic text-stone-50">
                Rick Rodriguez
              </p>
            </div>
            <p className="mt-3 text-sm leading-relaxed">
              {BUSINESS.brand} — power washing, carpentry, electrical, and plumbing done
              right, by a guy who actually shows up.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-300">
              <ShieldCheck className="size-4 text-blue-500" />
              Licensed &amp; Insured
            </p>
          </div>

          {/* Services */}
          <nav aria-label="Footer services">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-200">
              Services
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {BUSINESS.services.map((s) => (
                <li key={s.id}>
                  <a
                    href="#services"
                    className="transition-colors hover:text-blue-400"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Service area */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-200">
              Service area
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {BUSINESS.citiesServed.slice(0, 6).map((city) => (
                <li key={city} className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-blue-500" />
                  {city}
                </li>
              ))}
              <li className="pt-1 text-xs text-stone-500">
                & surrounding towns
              </li>
            </ul>
          </div>

          {/* Hours + contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-200">
              Hours &amp; contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 size-4 shrink-0 text-blue-500" />
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
                  className="flex items-center gap-2 transition-colors hover:text-blue-400"
                >
                  <Phone className="size-4 shrink-0 text-blue-500" />
                  {BUSINESS.phone}
                </a>
              </li>
              <li>
                <a
                  href={BUSINESS.emailHref}
                  className="flex items-center gap-2 transition-colors hover:text-blue-400"
                >
                  <Mail className="size-4 shrink-0 text-blue-500" />
                  {BUSINESS.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-stone-800 pt-6 text-xs text-stone-500 sm:flex-row">
          <p>
            © {CURRENT_YEAR} {BUSINESS.brand}. All rights reserved.
          </p>
          <p>
            Website by{' '}
            <a
              href="https://setsersolutions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 transition-colors hover:text-yellow-500"
            >
              Setser Solutions
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Main component                                 */
/* -------------------------------------------------------------------------- */

export default function DesignFinal() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-100">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      <TopNav />

      <main id="main" className="flex-1">
        <Hero />
        <TrustBar />
        <Services />
        <MeetRick />
        <CaseStudySpotlight />
        <ProjectGallery />
        <HowRickWorks />
        <Testimonials />
        <TrustBadgesBand />
        <LeadForm />
        <FAQ />
        <ServiceArea />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
