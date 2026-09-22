# R&R Handyman Services — Website Mockups

A Next.js 16 website for **R&R Handyman Services** (Rick Rodriguez), a handyman business offering **plumbing, carpentry, and power washing**. This project features **3 unique, switchable design mockups** built from the client's real project photos, with a full lead-capture system and an admin CRM dashboard.

## What's included

### 3 unique website designs (switchable on the homepage)

1. **Modern Professional** — bold dark hero with amber accents, contractor-grade energy
2. **Before/After Portfolio** — light, photography-driven with a split before/after hero
3. **Trusted Local Craftsman** — warm, story-driven, meet-the-owner vibe

Each design includes:
- Sticky navigation with mobile menu
- Hero section with real project photos
- Three services section (Plumbing, Carpentry, Power Washing) with starting prices
- Filterable project gallery with lightbox
- Lead capture form (persists to database)
- Testimonials
- FAQ accordion
- SEO-optimized semantic HTML + JSON-LD structured data

### Lead capture + admin CRM

- **Lead form** on every design → submissions persist to a SQLite database
- **Admin dashboard** at `/admin/leads` (password-protected):
  - Lead list with pagination, search, design/service/starred filters, date-range filter
  - Lead detail dialog with admin notes + print view
  - Bulk actions (select all, mark contacted, delete, export selected)
  - Star/important flag per lead
  - Stats: total leads, leads by design, by service (donut charts), conversion rate, 7-day/30-day leads-over-time chart
  - Real-time new-lead notification toast (auto-refresh every 30s)
  - CSV export (all leads or selected only)
  - Keyboard shortcuts (J/K navigate, Enter open, Space select, ? for help)

### Service cost estimator

An interactive "Estimate Cost" dialog on the homepage banner that gives a ballpark price range based on trade (Plumbing/Carpentry/Power Washing), scope (Small/Medium/Large), and urgency (Standard/Same-day). The estimate is attached to the lead when submitted.

### SEO features

- Per-design OpenGraph images (dynamically generated at `/api/og?design=modern|portfolio|trusted`)
- JSON-LD structured data (LocalBusiness + FAQPage + BreadcrumbList)
- `sitemap.xml` + `robots.txt` (dynamic)
- Semantic HTML5, proper heading hierarchy, alt text on all photos
- 12+ service keywords + city-tail keywords

## Tech stack

- **Framework**: Next.js 16 (App Router) + TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York)
- **Database**: Prisma ORM + SQLite
- **Icons**: lucide-react
- **Animations**: framer-motion
- **State**: Zustand (estimate store) + React hooks
- **Toasts**: sonner

## Getting started

### Prerequisites

- Node.js 18+ (or [Bun](https://bun.sh))
- A code editor (VS Code recommended)

### Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd rr-handyman

# Install dependencies
bun install
# or: npm install

# Copy the env file
cp .env.example .env

# Push the database schema
bun run db:push
# or: npx prisma db push --accept-data-loss

# Start the dev server
bun run dev
# or: npm run dev
```

Visit **http://localhost:3000** to see the site.

### Admin dashboard

Visit **http://localhost:3000/admin/login** and enter the password:

```
rr-admin-2024
```

> **Important**: Change this password before going live! Set the `ADMIN_PASSWORD` environment variable in your `.env` file.

## Project structure

```
src/
├── app/
│   ├── page.tsx              # Homepage with design switcher
│   ├── layout.tsx            # Root layout + SEO metadata + JSON-LD
│   ├── admin/
│   │   ├── login/            # Admin login page
│   │   └── leads/            # Admin CRM dashboard
│   ├── api/
│   │   ├── leads/            # Lead CRUD API (POST/GET/PATCH/DELETE)
│   │   ├── feedback/         # Design feedback API
│   │   ├── admin/auth/       # Admin login/logout/status
│   │   └── og/               # Dynamic OG image generation
│   ├── sitemap.ts            # Dynamic sitemap
│   └── robots.ts             # Dynamic robots.txt
├── components/
│   ├── designs/              # The 3 website designs
│   │   ├── design-modern.tsx
│   │   ├── design-portfolio.tsx
│   │   └── design-trusted.tsx
│   ├── service-estimator.tsx # Interactive price calculator
│   ├── design-notes.tsx      # Client feedback drawer
│   └── share-button.tsx      # Share/deep-link button
├── lib/
│   ├── business-info.ts      # ← Edit this to customize brand/phone/services
│   ├── handyman-photos.ts    # Photo data (categorized by trade)
│   ├── admin-auth.ts         # Admin cookie auth
│   ├── estimate-store.ts     # Zustand store for estimator
│   └── db.ts                 # Prisma client
├── hooks/
│   └── use-lead-form.ts      # Shared lead-form submission hook
└── public/
    └── handyman-photos/      # 46 real project photos from iCloud album
```

## Customizing for production

Before going live, edit `src/lib/business-info.ts`:

```typescript
export const BUSINESS = {
  brand: "R&R Handyman Services",
  owner: "Rick Rodriguez",
  phone: "(555) 014-2837",          // ← Replace with real phone
  email: "rick@rrhandyman.example",  // ← Replace with real email
  serviceArea: "Springfield County & surrounding towns",
  primaryCity: "Springfield",        // ← Replace with real city
  citiesServed: ["Springfield", "Riverton", ...],  // ← Real cities
  ...
};
```

Also set `ADMIN_PASSWORD` in your `.env` file to a secure password.

## Keyboard shortcuts (homepage)

| Key | Action |
|-----|--------|
| `1` | Switch to Modern Professional design |
| `2` | Switch to Before/After Portfolio design |
| `3` | Switch to Trusted Local Craftsman design |
| `C` | Toggle compare mode (all 3 stacked) |
| `B` | Collapse/expand the switcher banner |
| `?` | Show keyboard shortcuts help |

## Keyboard shortcuts (admin dashboard)

| Key | Action |
|-----|--------|
| `J` / `↓` | Focus next lead row |
| `K` / `↑` | Focus previous lead row |
| `Enter` | Open focused lead's detail |
| `Space` | Toggle selection of focused lead |
| `Esc` | Clear selection |
| `?` | Show keyboard shortcuts help |

## License

This project is a custom mockup for R&R Handyman Services. All photos are from the client's personal iCloud album and are not licensed for reuse.
