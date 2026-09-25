# R&R Handyman Services — Downriver Michigan

A production-ready Next.js 16 website for **R&R Handyman Services** (Rick Rodriguez), serving **Downriver Michigan** with **power washing, carpentry, electrical, and plumbing** services.

## What's included

### Single production website
A warm, professional design that blends a personal "meet the owner" narrative with a photography-driven before/after project showcase. Built from Rick's real project photos.

**Color palette:** Blue + Yellow + Grey

### Lead capture + admin CRM
- **Lead form** on the homepage → submissions persist to a SQLite database
- **SMS/email notifications** to Rick's phone when a new lead arrives
- **Admin dashboard** at `/admin/leads` (password: `RR-admin-2026`):
  - Lead list with pagination, search, filters, date-range, star/important flag
  - Lead detail dialog with admin notes + print view
  - Bulk actions (select all, mark contacted, delete, export selected)
  - Stats: by service (donut), by design (donut), conversion rate, 7d/30d chart
  - CSV export (all or selected)
  - Keyboard shortcuts (J/K/Enter/Space/?)

### 4 Services
1. **Power Washing** — driveways, patios, decks, siding
2. **Carpentry** — decks, porches, cabinets, trim, drywall, framing
3. **Electrical** — outlets, switches, fixtures, ceiling fans, panels
4. **Plumbing** — faucets, sinks, disposals, toilets, drains

## Getting started

### Prerequisites
- Node.js 18+ (or [Bun](https://bun.sh))

### Installation
```bash
git clone https://github.com/Setser-Solutions/rr-handyman-mockups.git
cd rr-handyman-mockups
bun install
cp .env.example .env
bun run db:push
bun run dev
```

Visit **http://localhost:3000**.

### Admin dashboard
Visit **http://localhost:3000/admin/login** → password: `RR-admin-2026`

### Lead notifications (SMS + email)
Set these env vars in `.env`:
```
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=465
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-email-password
NOTIFICATION_EMAIL=rick@rrhandyman.com
NOTIFICATION_SMS_GATEWAY=vtext.com
```

The SMS gateway depends on Rick's carrier:
- Verizon: `vtext.com`
- AT&T: `txt.att.net`
- T-Mobile: `tmomail.net`
- Sprint: `messaging.sprintpcs.com`
- Metro PCS: `metropcs.com`

## Customizing

Edit `src/lib/business-info.ts` to change:
- Phone, email, service area
- Services (labels, blurbs, bullets, starting prices)
- Testimonials, FAQs, SEO keywords

## Hosting on Namecheap
1. Build the site: `bun run build`
2. Deploy the `.next/standalone` folder to your Namecheap server
3. Set the env vars (DATABASE_URL, ADMIN_PASSWORD, SMTP_*, NOTIFICATION_*)
4. Run with `node .next/standalone/server.js`

## Tech stack
- Next.js 16 + TypeScript 5 + Tailwind CSS 4 + shadcn/ui
- Prisma ORM + SQLite
- nodemailer (SMS/email notifications)
- lucide-react + framer-motion

## License
Custom mockup for R&R Handyman Services. Photos from the client's personal iCloud album.
