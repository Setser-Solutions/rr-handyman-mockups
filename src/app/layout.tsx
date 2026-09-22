import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { BUSINESS, FAQS, SEO_KEYWORDS } from "@/lib/business-info";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://rrhandyman.example";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${BUSINESS.brand} | Plumbing, Carpentry & Power Washing in ${BUSINESS.primaryCity}`,
    template: `%s | ${BUSINESS.brand}`,
  },
  description: `${BUSINESS.brand} is ${BUSINESS.primaryCity}'s neighborhood handyman. ${BUSINESS.services
    .map((s) => s.label)
    .join(", ")} done right the first time. 12+ years, 1,850+ jobs, 4.9★ rating. Free, flat-price quotes within 24 hours. Call ${BUSINESS.phone}.`,
  keywords: [
    SEO_KEYWORDS.primary,
    ...SEO_KEYWORDS.clusters,
    "handyman",
    "home repair",
    "home improvement",
    "residential contractor",
    BUSINESS.brand,
    BUSINESS.owner,
    ...BUSINESS.citiesServed.map((c) => `handyman ${c}`),
  ],
  authors: [{ name: BUSINESS.owner, url: siteUrl }],
  creator: BUSINESS.owner,
  publisher: BUSINESS.brand,
  applicationName: BUSINESS.brand,
  category: "Home Services",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
    apple: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: `${BUSINESS.brand} — ${BUSINESS.primaryCity} Handyman`,
    description: `Plumbing, carpentry, and power washing done right the first time. 12+ years · 1,850+ jobs · 4.9★ rating. Call ${BUSINESS.phone}.`,
    url: siteUrl,
    siteName: BUSINESS.brand,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/handyman-photos/img_013.jpg",
        width: 2048,
        height: 1536,
        alt: "Newly constructed front porch with white columns built by R&R Handyman Services.",
      },
      {
        url: "/handyman-photos/img_000.jpg",
        width: 2048,
        height: 1536,
        alt: "Custom multi-level wooden deck built by R&R Handyman Services.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS.brand} — ${BUSINESS.primaryCity} Handyman`,
    description: `Plumbing, carpentry, and power washing done right the first time. Call ${BUSINESS.phone}.`,
    images: ["/handyman-photos/img_013.jpg"],
  },
  other: {
    "geo.region": "US-MA",
    "geo.placename": BUSINESS.primaryCity,
    "geo.position": "42.101483;-72.589811",
    ICBM: "42.101483, -72.589811",
  },
};

// JSON-LD structured data for LocalBusiness + FAQPage + WebSite + BreadcrumbList.
// Helps Google surface the business in local pack & rich results.
function buildJsonLd() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${siteUrl}/#business`,
    name: BUSINESS.brand,
    image: `${siteUrl}/handyman-photos/img_013.jpg`,
    logo: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
    url: siteUrl,
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    priceRange: "$$",
    description: `${BUSINESS.brand} is ${BUSINESS.primaryCity}'s neighborhood handyman. ${BUSINESS.services
      .map((s) => s.label)
      .join(", ")} with 12+ years of experience and a 4.9★ rating.`,
    founder: { "@type": "Person", name: BUSINESS.owner },
    knowsAbout: SEO_KEYWORDS.clusters,
    areaServed: BUSINESS.citiesServed.map((c) => ({
      "@type": "City",
      name: c,
    })),
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS.primaryCity,
      addressRegion: "MA",
      postalCode: "01101",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 42.101483,
      longitude: -72.589811,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "14:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: BUSINESS.avgRating,
      reviewCount: BUSINESS.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Handyman Services",
      itemListElement: BUSINESS.services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.label,
          description: s.longBlurb,
        },
        priceCurrency: "USD",
        price: s.startingAt.replace(/[^0-9]/g, ""),
      })),
    },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteUrl}/#faq`,
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: BUSINESS.brand,
    publisher: { "@id": `${siteUrl}/#business` },
    inLanguage: "en-US",
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Handyman Services",
        item: `${siteUrl}/#services`,
      },
    ],
  };

  return {
    "@graph": [localBusiness, webSite, faqPage, breadcrumb],
  };
}

const jsonLd = buildJsonLd();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
