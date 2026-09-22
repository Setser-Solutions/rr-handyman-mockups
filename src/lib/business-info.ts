// Shared business info for the handyman website mockups.
// All three designs read from this single source of truth so the brand
// stays consistent across mockups. Replace placeholders before going live.

export const BUSINESS = {
  brand: "R&R Handyman Services",
  shortBrand: "R&R Handyman",
  owner: "Rick Rodriguez",
  phone: "(555) 014-2837",
  phoneHref: "tel:+15550142837",
  email: "rick@rrhandyman.example",
  emailHref: "mailto:rick@rrhandyman.example",
  serviceArea: "Springfield County & surrounding towns",
  primaryCity: "Springfield",
  citiesServed: [
    "Springfield",
    "Riverton",
    "Lakeside",
    "Maple Grove",
    "Brookfield",
    "Fairview",
    "Hillcrest",
  ],
  hours: {
    weekdays: "Mon–Fri: 7:00 AM – 6:00 PM",
    saturday: "Sat: 8:00 AM – 2:00 PM",
    sunday: "Sun: Closed (emergency only)",
  },
  yearsInBusiness: 12,
  jobsCompleted: 1850,
  avgRating: 4.9,
  reviewCount: 213,
  // Keep the small lead-form list in sync with the design copy.
  services: [
    {
      id: "plumbing",
      label: "Plumbing",
      icon: "Droplets",
      shortBlurb: "Faucets, sinks, disposals, toilets, drains — fixed or installed.",
      longBlurb:
        "From a leaking kitchen faucet to a full bathroom rough-in, our plumbing work is clean, code-compliant, and guaranteed. We install pull-down faucets, garbage disposals, shut-off valves, toilet flanges, PVC drains, shower heads, and sewer cleanouts — and we test every connection before we leave.",
      bullets: [
        "Faucet & sink installation",
        "Garbage disposal replacement",
        "Toilet reset & flange repair",
        "Drain & vent rough-in",
        "Shower head & fixture upgrades",
        "Leak diagnosis & repair",
      ],
      startingAt: "$120",
      image: "/handyman-photos/img_008.jpg",
    },
    {
      id: "carpentry",
      label: "Carpentry",
      icon: "Hammer",
      shortBlurb: "Decks, porches, cabinets, trim, drywall, and framing — done right.",
      longBlurb:
        "Whether you want a new multi-level deck, a welcoming front porch, custom garage shelving, or a kitchen remodel with new cabinets and trim, our carpentry crew delivers tight joinery and clean finishes. We handle framing, drywall patch and texture, siding, door installation, and finishing work that lasts.",
      bullets: [
        "Custom deck & porch builds",
        "Kitchen & bathroom remodeling",
        "Cabinet & trim installation",
        "Drywall repair & texture match",
        "Framing & structural repairs",
        "Siding, doors, and mailboxes",
      ],
      startingAt: "$295",
      image: "/handyman-photos/img_013.jpg",
    },
    {
      id: "power-washing",
      label: "Power Washing",
      icon: "SprayCan",
      shortBlurb: "Driveways, patios, decks, and siding brought back to like-new.",
      longBlurb:
        "A professional pressure wash is the fastest, most affordable way to boost curb appeal. We use commercial surface cleaners and wand attachments to lift years of grime, mold, and stains off concrete patios, driveways, wood decks, and home siding — without damaging the surface underneath.",
      bullets: [
        "Concrete driveway cleaning",
        "Patio & walkway washing",
        "Wood deck restoration",
        "House siding washing",
        "Surface cleaner attachment work",
        "Pre-stain deck prep",
      ],
      startingAt: "$180",
      image: "/handyman-photos/img_009.jpg",
    },
  ] as const,
  trustBadges: [
    "Licensed & insured",
    "12+ years in business",
    "1,850+ jobs completed",
    "4.9★ from 213 reviews",
  ],
};

export type Service = (typeof BUSINESS.services)[number];

// SEO keyword clusters, used in <meta> tags and visible H2/H3 copy across designs.
export const SEO_KEYWORDS = {
  primary: "handyman services Springfield",
  clusters: [
    "plumber Springfield",
    "emergency plumbing repair",
    "kitchen faucet installation",
    "garbage disposal replacement",
    "deck builder Springfield",
    "porch construction",
    "kitchen remodeler",
    "drywall repair Springfield",
    "power washing Springfield",
    "driveway pressure washing",
    "deck staining and washing",
    "handyman near me",
  ],
};

// Testimonials used in every design (consistent social proof).
export const TESTIMONIALS = [
  {
    quote:
      "Rick rebuilt our back deck in three days. The framing is rock-solid and the finish work is the cleanest I've seen on a residential job. Worth every penny.",
    name: "Dana M.",
    location: "Riverton",
    service: "Deck Build",
    rating: 5,
  },
  {
    quote:
      "I had a leaking kitchen faucet and a corroded shutoff valve. R&R swapped both, added a new pull-down faucet, and left the sink spotless. Fast and professional.",
    name: "Marcus T.",
    location: "Springfield",
    service: "Plumbing",
    rating: 5,
  },
  {
    quote:
      "We thought we'd have to repaint the whole house. R&R pressure-washed the siding and driveway instead — the place literally looks new. Highly recommend.",
    name: "Priya & Sam K.",
    location: "Lakeside",
    service: "Power Washing",
    rating: 5,
  },
  {
    quote:
      "From drywall patch to cabinet install, Rick handled our kitchen remodel end to end. Communication was great and the punch list was zero when he finished.",
    name: "The Alvarez Family",
    location: "Maple Grove",
    service: "Kitchen Remodel",
    rating: 5,
  },
];

// FAQ content — also reused for SEO (rich results / structured data).
export const FAQS = [
  {
    q: "What areas does R&R Handyman serve?",
    a: `We serve ${BUSINESS.serviceArea}. The core cities we work in are ${BUSINESS.citiesServed.slice(0, 5).join(", ")}, and the surrounding communities. Not sure if you're in our service area? Call ${BUSINESS.phone} and we'll confirm on the spot.`,
  },
  {
    q: "Do you give free estimates?",
    a: "Yes — every job starts with a free, no-obligation estimate. For most plumbing, carpentry, and power washing work we can give you a flat, upfront price over the phone or in person within 24 hours.",
  },
  {
    q: "Are you licensed and insured?",
    a: "Yes. R&R Handyman Services is fully licensed and insured, with 12+ years of residential experience and over 1,850 completed jobs in the Springfield area.",
  },
  {
    q: "Do you offer emergency plumbing?",
    a: "For active leaks that can't wait, call us directly at " + BUSINESS.phone + ". Same-day and weekend emergency plumbing calls are handled as priority — Sunday emergency calls are billed at our weekend rate.",
  },
  {
    q: "What does power washing cost?",
    a: "Most driveway + patio power washing packages start at " + BUSINESS.services[2].startingAt + " and go up based on square footage and how dirty the surface is. Deck washing is quoted separately based on board type and stain condition.",
  },
];
