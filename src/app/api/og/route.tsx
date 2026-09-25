import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import path from 'path';
import { BUSINESS } from '@/lib/business-info';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// OG images are typically 1200×630
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const DESIGN_CONFIG: Record<
  string,
  { name: string; tag: string; hero: string; bg: string; accent: string; text: string }
> = {
  modern: {
    name: 'Modern Professional',
    tag: 'Design 1 of 3',
    hero: 'img_013.jpg', // front porch on blue house
    bg: '#0c0a09', // stone-950
    accent: '#f59e0b', // amber-500
    text: '#fafaf9', // stone-50
  },
  portfolio: {
    name: 'Before/After Portfolio',
    tag: 'Design 2 of 3',
    hero: 'img_009.jpg', // patio before/after split
    bg: '#fafaf9', // stone-50
    accent: '#059669', // emerald-600
    text: '#1c1917', // stone-900
  },
  trusted: {
    name: 'Trusted Local Craftsman',
    tag: 'Design 3 of 3',
    hero: 'img_006.jpg', // organized garage
    bg: '#f5f5f4', // stone-100
    accent: '#ea580c', // orange-600
    text: '#1c1917', // stone-900
  },
  default: {
    name: BUSINESS.brand,
    tag: 'Plumbing · Carpentry · Power Washing',
    hero: 'img_000.jpg', // multi-level deck
    bg: '#0c0a09',
    accent: '#f59e0b',
    text: '#fafaf9',
  },
};

/**
 * GET /api/og?design=modern|portfolio|trusted
 *
 * Generates a per-design OpenGraph image (1200×630 PNG) using next/og.
 * Used by layout.tsx's metadata.openGraph.images so sharing a design on
 * social media shows that design's hero photo + branding.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const design = url.searchParams.get('design') ?? 'default';
  const cfg = DESIGN_CONFIG[design] ?? DESIGN_CONFIG.default;

  // Load the hero image from /public and convert to base64 data URL for Satori.
  const heroPath = path.join(process.cwd(), 'public', 'handyman-photos', cfg.hero);
  let heroDataUrl: string | undefined;
  try {
    const buf = await readFile(heroPath);
    const b64 = buf.toString('base64');
    heroDataUrl = `data:image/jpeg;base64,${b64}`;
  } catch {
    // If the photo can't be read, fall back to a text-only card.
    heroDataUrl = undefined;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: cfg.bg,
          color: cfg.text,
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            height: '8px',
            backgroundColor: cfg.accent,
            width: '100%',
          }}
        />

        {/* Main content area */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'row',
            padding: '48px 60px',
            gap: '40px',
            alignItems: 'center',
          }}
        >
          {/* Left: text */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              flex: 1,
            }}
          >
            {/* Brand badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '52px',
                  height: '52px',
                  borderRadius: '10px',
                  backgroundColor: cfg.accent,
                  color: cfg.bg,
                  fontSize: '24px',
                  fontWeight: 700,
                }}
              >
                R&R
              </div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  color: cfg.text,
                }}
              >
                {BUSINESS.brand}
              </div>
            </div>

            {/* Tag */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '18px',
                color: cfg.accent,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {cfg.tag}
            </div>

            {/* Headline */}
            <div
              style={{
                fontSize: '52px',
                fontWeight: 700,
                lineHeight: 1.1,
                color: cfg.text,
                marginTop: '8px',
              }}
            >
              {design === 'modern'
                ? 'Your home. Fixed right the first time.'
                : design === 'portfolio'
                ? 'See the difference.'
                : design === 'trusted'
                ? "Hi, I'm Rick — your local handyman."
                : 'Plumbing · Carpentry · Power Washing'}
            </div>

            {/* Stats row */}
            <div
              style={{
                display: 'flex',
                gap: '32px',
                marginTop: '16px',
                fontSize: '20px',
                color: cfg.text,
                opacity: 0.85,
              }}
            >
              <div>12+ years</div>
              <div style={{ opacity: 0.4 }}>·</div>
              <div>1,850+ jobs</div>
              <div style={{ opacity: 0.4 }}>·</div>
              <div>4.9★ rating</div>
            </div>

            {/* Contact */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '20px',
                fontSize: '22px',
                color: cfg.accent,
                fontWeight: 600,
              }}
            >
              {BUSINESS.phone} · {BUSINESS.primaryCity}
            </div>
          </div>

          {/* Right: hero photo */}
          {heroDataUrl ? (
            <div
              style={{
                display: 'flex',
                width: '440px',
                height: '440px',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              }}
            >
              <img
                src={heroDataUrl}
                alt="R&R Handyman project"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          ) : null}
        </div>

        {/* Bottom footer bar */}
        <div
          style={{
            display: 'flex',
            padding: '20px 60px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            fontSize: '16px',
            opacity: 0.6,
            color: cfg.text,
            justifyContent: 'space-between',
          }}
        >
          <div>Licensed & Insured · Downriver Michigan</div>
          <div>Free, flat-price quotes within 24 hours</div>
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    },
  );
}
