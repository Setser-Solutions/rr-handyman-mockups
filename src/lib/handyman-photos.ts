// Categorized photo library for the handyman website designs.
// Photos were pulled from the client's iCloud shared album "MY WORK" by Rick Rodriguez.
// Each photo was categorized using the VLM (vision) model.
//
// The data below is generated from /home/z/my-project/download/icloud/categorization.json

export type PhotoCategory =
  | "plumbing"
  | "carpentry"
  | "power_washing"
  | "finished_work"
  | "before_after"
  | "other";

export interface Photo {
  src: string; // path under /public
  category: PhotoCategory;
  subcategory: string;
  description: string;
  alt: string;
  isBeforeAfter: boolean;
  quality: "good" | "average" | "poor";
  heroSuitability: "high" | "medium" | "low";
  tags: string[];
}

interface RawPhoto {
  idx: number;
  src: string;
  category: PhotoCategory;
  subcategory: string;
  description: string;
  is_before_after: boolean;
  quality: "good" | "average" | "poor";
  hero_suitability: "high" | "medium" | "low";
  tags: string[];
}

// Pasted from categorization output (kept in sync with categorize.py).
const RAW: RawPhoto[] = [
  { idx: 0, src: "/handyman-photos/img_000.jpg", category: "carpentry", subcategory: "deck_build", description: "A newly constructed multi-level wooden deck attached to the back of a brick house.", is_before_after: false, quality: "good", hero_suitability: "high", tags: ["deck", "outdoor", "construction"] },
  { idx: 1, src: "/handyman-photos/img_001.jpg", category: "carpentry", subcategory: "deck_repair", description: "An old, weathered, and damaged wooden deck attached to a brick house in need of repair or replacement.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["deck", "repair", "outdoor"] },
  { idx: 2, src: "/handyman-photos/img_002.jpg", category: "carpentry", subcategory: "mailbox_install", description: "A weathered wooden mailbox and post assembly on a residential curb.", is_before_after: false, quality: "good", hero_suitability: "low", tags: ["mailbox", "outdoor"] },
  { idx: 3, src: "/handyman-photos/img_003.jpg", category: "carpentry", subcategory: "drywall_repair", description: "An interior wall undergoing drywall repair and patching with spackle and primer.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["drywall", "interior"] },
  { idx: 4, src: "/handyman-photos/img_004.jpg", category: "carpentry", subcategory: "garage_shelving", description: "Two workers standing in front of a garage with newly built wooden shelving units inside.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["garage", "shelving", "workers"] },
  { idx: 5, src: "/handyman-photos/img_005.jpg", category: "carpentry", subcategory: "mailbox_install", description: "A newly installed black wooden post holding two mailboxes in a residential front yard.", is_before_after: false, quality: "good", hero_suitability: "low", tags: ["mailbox", "install", "outdoor"] },
  { idx: 6, src: "/handyman-photos/img_006.jpg", category: "finished_work", subcategory: "garage_organize", description: "A clean and organized garage interior featuring a pegboard with tools, storage shelving, and freshly painted walls.", is_before_after: false, quality: "good", hero_suitability: "medium", tags: ["garage", "organization", "finished"] },
  { idx: 7, src: "/handyman-photos/img_007.jpg", category: "carpentry", subcategory: "bathroom_remodel", description: "A bathroom under renovation featuring a glass block window and black hexagonal tile installation on the shower wall.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["bathroom", "tile", "remodel"] },
  { idx: 8, src: "/handyman-photos/img_008.jpg", category: "plumbing", subcategory: "faucet_install", description: "A modern kitchen featuring a black pull-down faucet installed in a stainless steel sink with marble-patterned countertops.", is_before_after: false, quality: "good", hero_suitability: "medium", tags: ["kitchen", "faucet", "plumbing"] },
  { idx: 9, src: "/handyman-photos/img_009.jpg", category: "power_washing", subcategory: "patio_wash", description: "A concrete patio showing a clear line where it has been pressure washed, revealing a clean surface next to the unwashed area.", is_before_after: true, quality: "average", hero_suitability: "low", tags: ["power-washing", "patio", "before-after"] },
  { idx: 10, src: "/handyman-photos/img_010.jpg", category: "finished_work", subcategory: "vanity_light_install", description: "A new four-light vanity fixture installed above a large bathroom mirror.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["bathroom", "lighting", "finished"] },
  { idx: 11, src: "/handyman-photos/img_011.jpg", category: "finished_work", subcategory: "concrete_patio", description: "A newly finished exposed aggregate concrete patio or walkway next to a house foundation.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["patio", "concrete", "finished"] },
  { idx: 12, src: "/handyman-photos/img_012.jpg", category: "power_washing", subcategory: "patio_wash", description: "A concrete patio in the middle of being pressure washed, showing a clear contrast between the cleaned and dirty sections.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["power-washing", "patio"] },
  { idx: 13, src: "/handyman-photos/img_013.jpg", category: "carpentry", subcategory: "porch_build", description: "A newly constructed front porch with white columns, railings, and stairs attached to a blue house.", is_before_after: false, quality: "good", hero_suitability: "high", tags: ["porch", "construction", "outdoor"] },
  { idx: 14, src: "/handyman-photos/img_014.jpg", category: "plumbing", subcategory: "drain_install", description: "New white PVC drain pipes installed in a roughed-in area with exposed wall studs and damaged drywall.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["drain", "pvc", "plumbing"] },
  { idx: 15, src: "/handyman-photos/img_015.jpg", category: "plumbing", subcategory: "shower_install", description: "A newly installed shower head and ceiling exhaust fan in a bathroom with fresh paint and tile.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["shower", "bathroom", "plumbing"] },
  { idx: 16, src: "/handyman-photos/img_016.jpg", category: "plumbing", subcategory: "drain_installation", description: "New white PVC drain pipes and fittings installed in a roughed-in wall with exposed framing.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["drain", "pvc", "plumbing"] },
  { idx: 17, src: "/handyman-photos/img_017.jpg", category: "carpentry", subcategory: "drywall_repair", description: "A kitchen ceiling with a large rectangular hole cut into the drywall, exposing the wooden structure and insulation above.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["drywall", "ceiling", "repair"] },
  { idx: 18, src: "/handyman-photos/img_018.jpg", category: "carpentry", subcategory: "deck_build", description: "A newly constructed wooden deck with stairs and railing posts built on a grassy lawn near a body of water.", is_before_after: false, quality: "good", hero_suitability: "high", tags: ["deck", "construction", "outdoor"] },
  { idx: 19, src: "/handyman-photos/img_019.jpg", category: "power_washing", subcategory: "patio_wash", description: "A concrete patio in the middle of being pressure washed, showing a clear contrast between the cleaned and dirty sections.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["power-washing", "patio"] },
  { idx: 20, src: "/handyman-photos/img_020.jpg", category: "power_washing", subcategory: "patio_wash", description: "A pressure washer wand and hose resting on a concrete patio that is partially cleaned, showing a clear contrast between the washed and unwashed areas.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["power-washing", "equipment"] },
  { idx: 21, src: "/handyman-photos/img_021.jpg", category: "power_washing", subcategory: "driveway_wash", description: "A worker uses a surface cleaner attachment to pressure wash a concrete driveway or patio.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["power-washing", "driveway", "worker"] },
  { idx: 22, src: "/handyman-photos/img_022.jpg", category: "power_washing", subcategory: "deck_wash", description: "A wooden deck with partially cleaned planks showing the contrast between dirty and pressure-washed areas.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["power-washing", "deck", "wood"] },
  { idx: 23, src: "/handyman-photos/img_023.jpg", category: "carpentry", subcategory: "drywall_repair", description: "A bathroom wall with a large hole cut out for an electrical box, showing exposed drywall and wiring.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["drywall", "electrical", "repair"] },
  { idx: 24, src: "/handyman-photos/img_024.jpg", category: "carpentry", subcategory: "kitchen_remodel", description: "A kitchen area with white cabinets and a countertop covered in protective paper and tape during a renovation.", is_before_after: false, quality: "average", hero_suituality: "low", tags: ["kitchen", "remodel"] } as any,
  { idx: 25, src: "/handyman-photos/img_025.jpg", category: "carpentry", subcategory: "kitchen_remodel", description: "A completed kitchen renovation featuring white cabinets, a granite countertop, and a subway tile backsplash.", is_before_after: false, quality: "good", hero_suitability: "medium", tags: ["kitchen", "remodel", "finished"] },
  { idx: 26, src: "/handyman-photos/img_026.jpg", category: "before_after", subcategory: "deck_repair", description: "A wooden deck showing a clear comparison between weathered gray planks and newly replaced or refinished bright yellow boards.", is_before_after: true, quality: "good", hero_suitability: "medium", tags: ["deck", "before-after", "repair"] },
  { idx: 27, src: "/handyman-photos/img_027.jpg", category: "carpentry", subcategory: "deck_build", description: "A newly constructed wooden deck and walkway attached to the back of a house, with stain cans visible on the ground.", is_before_after: false, quality: "good", hero_suitability: "medium", tags: ["deck", "construction", "outdoor"] },
  { idx: 28, src: "/handyman-photos/img_028.jpg", category: "carpentry", subcategory: "siding_install", description: "A close-up view of newly installed horizontal vinyl siding on an exterior wall between two brick columns.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["siding", "exterior"] },
  { idx: 29, src: "/handyman-photos/img_029.jpg", category: "finished_work", subcategory: "paver_path", description: "A newly installed rectangular concrete paver walkway leading from a grassy lawn to the side of a house.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["paver", "walkway", "outdoor"] },
  { idx: 30, src: "/handyman-photos/img_030.jpg", category: "carpentry", subcategory: "door_trim", description: "A newly installed white door frame and trim on a yellow siding house, leading into a garage.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["door", "trim", "exterior"] },
  { idx: 31, src: "/handyman-photos/img_031.jpg", category: "carpentry", subcategory: "porch_build", description: "A newly constructed wooden front porch with railings, steps, and support posts attached to a house.", is_before_after: false, quality: "good", hero_suitability: "medium", tags: ["porch", "construction", "outdoor"] },
  { idx: 32, src: "/handyman-photos/img_032.jpg", category: "power_washing", subcategory: "patio_wash", description: "A dirty concrete patio and wooden deck railing next to a house, likely before being pressure washed.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["power-washing", "patio", "before"] },
  { idx: 33, src: "/handyman-photos/img_033.jpg", category: "plumbing", subcategory: "faucet_install", description: "A woman standing next to a kitchen sink with a newly installed stainless steel pull-down faucet.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["faucet", "kitchen", "plumbing"] },
  { idx: 34, src: "/handyman-photos/img_034.jpg", category: "carpentry", subcategory: "deck_repair", description: "A rotted wooden deck railing and post are partially removed, revealing decayed internal framing, with power tools resting on the adjacent steps.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["deck", "rot", "repair"] },
  { idx: 35, src: "/handyman-photos/img_035.jpg", category: "plumbing", subcategory: "toilet_flange_install", description: "A new white toilet flange installed in a tiled bathroom floor with surrounding water damage and a water supply valve on the wall.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["toilet", "flange", "plumbing"] },
  { idx: 36, src: "/handyman-photos/img_036.jpg", category: "plumbing", subcategory: "disposal_install", description: "A newly installed garbage disposal and drain piping under a kitchen sink with an unfinished cabinet floor.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["disposal", "kitchen", "plumbing"] },
  { idx: 37, src: "/handyman-photos/img_037.jpg", category: "carpentry", subcategory: "drywall_repair", description: "A section of drywall above kitchen cabinets is being repaired and patched with spackle.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["drywall", "patch", "repair"] },
  { idx: 38, src: "/handyman-photos/img_038.jpg", category: "carpentry", subcategory: "kitchen_remodel", description: "A kitchen with newly installed wooden cabinets, countertops, and a sink, with tools and paint still on the counter.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["kitchen", "cabinets", "remodel"] },
  { idx: 39, src: "/handyman-photos/img_039.jpg", category: "plumbing", subcategory: "toilet_flange", description: "A close-up of a white plastic toilet flange sitting on a wooden floor.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["toilet", "flange", "plumbing"] },
  { idx: 40, src: "/handyman-photos/img_040.jpg", category: "carpentry", subcategory: "drywall_finish", description: "A room with freshly painted walls, finished baseboards, and green electrical outlet covers indicating recent drywall and painting work.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["drywall", "painting", "finish"] },
  { idx: 41, src: "/handyman-photos/img_041.jpg", category: "plumbing", subcategory: "sewer_cleanout", description: "A close-up of a white plastic sewer cleanout cap sitting on a wooden surface.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["sewer", "cleanout", "plumbing"] },
  { idx: 42, src: "/handyman-photos/img_042.jpg", category: "other", subcategory: "interior_room", description: "A photo of a room corner showing a window, a chalkboard calendar, and a doorway.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["interior", "room"] },
  { idx: 43, src: "/handyman-photos/img_043.jpg", category: "finished_work", subcategory: "siding_paint", description: "A freshly painted vertical wood siding exterior of a house next to a brick wall and windows.", is_before_after: false, quality: "good", hero_suitability: "low", tags: ["siding", "paint", "exterior"] },
  { idx: 44, src: "/handyman-photos/img_044.jpg", category: "carpentry", subcategory: "framing", description: "Interior room under construction showing exposed wood framing, insulation, and plumbing pipes.", is_before_after: false, quality: "average", hero_suitability: "low", tags: ["framing", "construction"] },
  { idx: 45, src: "/handyman-photos/img_045.jpg", category: "other", subcategory: "mold_remediation", description: "A shower stall with significant black mold and mildew growth on the ceiling tiles, grout lines, and upper wall tiles.", is_before_after: false, quality: "poor", hero_suitability: "low", tags: ["mold", "bathroom", "remediation"] },
];

export const PHOTOS: Photo[] = RAW.map((r) => ({
  src: r.src,
  category: r.category,
  subcategory: r.subcategory,
  description: r.description,
  alt: r.description,
  isBeforeAfter: r.is_before_after,
  quality: r.quality,
  heroSuitability: (r as any).hero_suitability ?? (r as any).hero_suituality ?? "low",
  tags: r.tags,
}));

export const photosByCategory = (cat: PhotoCategory): Photo[] =>
  PHOTOS.filter((p) => p.category === cat);

export const heroPhotos = (cat?: PhotoCategory): Photo[] =>
  PHOTOS.filter((p) => (cat ? p.category === cat : true) && p.heroSuitability === "high");

export const photosByTag = (tag: string): Photo[] =>
  PHOTOS.filter((p) => p.tags.includes(tag));

// Pre-curated picks for each section to keep designs sharp.
export const HERO_PICKS = {
  carpentry: "/handyman-photos/img_013.jpg", // newly constructed front porch with white columns on blue house
  plumbing: "/handyman-photos/img_008.jpg", // modern kitchen black pull-down faucet
  power_washing: "/handyman-photos/img_009.jpg", // patio before/after split
  general: "/handyman-photos/img_000.jpg", // multi-level deck attached to brick house
  kitchen: "/handyman-photos/img_025.jpg", // completed kitchen renovation
  garage: "/handyman-photos/img_006.jpg", // organized garage
};

export const GALLERY_BY_CATEGORY: Record<PhotoCategory | "all", string[]> = {
  all: PHOTOS.filter((p) => p.quality !== "poor").map((p) => p.src),
  plumbing: photosByCategory("plumbing").map((p) => p.src),
  carpentry: photosByCategory("carpentry").map((p) => p.src),
  power_washing: photosByCategory("power_washing").map((p) => p.src),
  finished_work: photosByCategory("finished_work").map((p) => p.src),
  before_after: photosByCategory("before_after").map((p) => p.src),
  other: photosByCategory("other").map((p) => p.src),
};

// Short, SEO-friendly captions per photo (title + 1-line description)
export const PHOTO_CAPTIONS: Record<string, { title: string; blurb: string }> = {
  "/handyman-photos/img_000.jpg": { title: "Multi-Level Deck Build", blurb: "Custom pressure-treated deck framed against a brick home in [CITY]." },
  "/handyman-photos/img_001.jpg": { title: "Deck Condition Assessment", blurb: "Honest on-site inspection of an aging deck before a rebuild quote." },
  "/handyman-photos/img_002.jpg": { title: "Mailbox Post Repair", blurb: "Weathered mailbox post scheduled for replacement with new pressure-treated lumber." },
  "/handyman-photos/img_003.jpg": { title: "Drywall Patch & Texture", blurb: "Spackle, primer, and texture match to make wall damage disappear." },
  "/handyman-photos/img_004.jpg": { title: "Custom Garage Shelving", blurb: "Heavy-duty shop-grade shelving built to fit the customer's garage." },
  "/handyman-photos/img_005.jpg": { title: "Dual Mailbox Install", blurb: "New black-post mailbox install, plumb, level, and concreted in." },
  "/handyman-photos/img_006.jpg": { title: "Garage Organization", blurb: "Pegboard, shelving, and a fresh coat of paint for a usable garage." },
  "/handyman-photos/img_007.jpg": { title: "Bathroom Tile Remodel", blurb: "Glass block window and hex tile accent installed during a bathroom remodel." },
  "/handyman-photos/img_008.jpg": { title: "Pull-Down Faucet Install", blurb: "Black pull-down kitchen faucet set into a stainless sink with marble counters." },
  "/handyman-photos/img_009.jpg": { title: "Patio Power Wash — Before / After", blurb: "Half-washed concrete showing the dramatic difference a pressure wash makes." },
  "/handyman-photos/img_010.jpg": { title: "Vanity Light Install", blurb: "Four-light vanity fixture leveled and wired above the bathroom mirror." },
  "/handyman-photos/img_011.jpg": { title: "Exposed Aggregate Patio", blurb: "Newly poured and finished exposed-aggregate patio next to the foundation." },
  "/handyman-photos/img_012.jpg": { title: "Patio Power Wash In Progress", blurb: "Pressure washing mid-stroke, surface grime lifting off the concrete." },
  "/handyman-photos/img_013.jpg": { title: "Front Porch Build", blurb: "New front porch with columns, railings, and stair stringers on a blue home." },
  "/handyman-photos/img_014.jpg": { title: "PVC Drain Rough-In", blurb: "Sch 40 PVC drains routed through the wall framing to code." },
  "/handyman-photos/img_015.jpg": { title: "Shower Head & Exhaust Fan", blurb: "New shower head paired with a properly vented bath exhaust fan." },
  "/handyman-photos/img_016.jpg": { title: "Drain & Vent Rough-In", blurb: "Drain and vent piping installed with proper slope and cleanouts." },
  "/handyman-photos/img_017.jpg": { title: "Ceiling Drywall Access", blurb: "Clean cut drywall access for an above-ceiling repair and inspection." },
  "/handyman-photos/img_018.jpg": { title: "Backyard Deck with Stairs", blurb: "Freestanding deck with stairs and railing posts framed near the water." },
  "/handyman-photos/img_019.jpg": { title: "Patio Power Wash In Progress", blurb: "Surface cleaner drawing a clean line across a dirty concrete patio." },
  "/handyman-photos/img_020.jpg": { title: "Pressure Wash Equipment", blurb: "Commercial pressure washer setup ready to take on a patio refresh." },
  "/handyman-photos/img_021.jpg": { title: "Driveway Surface Cleaning", blurb: "Surface cleaner attachment making quick work of a stained driveway." },
  "/handyman-photos/img_022.jpg": { title: "Deck Power Wash", blurb: "Pressure-washed deck boards brightening up against weathered gray." },
  "/handyman-photos/img_023.jpg": { title: "Electrical Box Cut-In", blurb: "Clean cut-in for a remodel electrical box with minimal drywall damage." },
  "/handyman-photos/img_024.jpg": { title: "Kitchen Remodel In Progress", blurb: "Cabinets masked off and protected mid kitchen remodel." },
  "/handyman-photos/img_025.jpg": { title: "Finished Kitchen Renovation", blurb: "White cabinets, granite counters, and subway tile backsplash complete." },
  "/handyman-photos/img_026.jpg": { title: "Deck Board Refinish — Before / After", blurb: "Weathered gray deck boards meet freshly replaced yellow pine." },
  "/handyman-photos/img_027.jpg": { title: "Deck & Walkway Build", blurb: "New deck and walkway framed and ready for stain." },
  "/handyman-photos/img_028.jpg": { title: "Vinyl Siding Install", blurb: "Horizontal vinyl siding trimmed neatly between brick columns." },
  "/handyman-photos/img_029.jpg": { title: "Paver Walkway Install", blurb: "Rectangular concrete pavers set on a graded base to the side door." },
  "/handyman-photos/img_030.jpg": { title: "Door Frame & Trim Install", blurb: "New pre-hung door and trim installed plumb and level." },
  "/handyman-photos/img_031.jpg": { title: "Front Porch Build", blurb: "Wooden porch with railings, steps, and posts built to last." },
  "/handyman-photos/img_032.jpg": { title: "Pre-Wash Patio Inspection", blurb: "Dirty patio and deck railing documented before pressure washing." },
  "/handyman-photos/img_033.jpg": { title: "Kitchen Faucet Install", blurb: "New pull-down faucet installed and leak-tested in the customer's kitchen." },
  "/handyman-photos/img_034.jpg": { title: "Rotted Deck Demo", blurb: "Rotted railing post removed to expose the framing damage beneath." },
  "/handyman-photos/img_035.jpg": { title: "Toilet Flange Install", blurb: "New toilet flange set in the tile with a fresh supply valve." },
  "/handyman-photos/img_036.jpg": { title: "Garbage Disposal Install", blurb: "New garbage disposal and drain assembly mounted under the sink." },
  "/handyman-photos/img_037.jpg": { title: "Drywall Patch Above Cabinets", blurb: "Spackled patch above kitchen cabinets, blended and ready for paint." },
  "/handyman-photos/img_038.jpg": { title: "Cabinet Install In Progress", blurb: "New wood cabinets and counters set, finishing touches underway." },
  "/handyman-photos/img_039.jpg": { title: "Toilet Flange Close-Up", blurb: "Toilet flange seated on the subfloor ahead of the toilet reset." },
  "/handyman-photos/img_040.jpg": { title: "Drywall & Paint Finish", blurb: "Freshly painted walls and baseboards with new device plates." },
  "/handyman-photos/img_041.jpg": { title: "Sewer Cleanout Install", blurb: "Sewer cleanout cap set flush for easy future access." },
  "/handyman-photos/img_042.jpg": { title: "Finished Room Detail", blurb: "Trim and detail work in a finished room corner." },
  "/handyman-photos/img_043.jpg": { title: "Siding Paint Refresh", blurb: "Freshly painted vertical wood siding to match the home's brick." },
  "/handyman-photos/img_044.jpg": { title: "Framing & Rough-In", blurb: "Wood framing, insulation, and plumbing rough-in visible mid build." },
  "/handyman-photos/img_045.jpg": { title: "Mold Remediation", blurb: "Documented pre-remediation mold condition in a shower stall." },
};

// Helper to get caption
export const captionFor = (src: string) =>
  PHOTO_CAPTIONS[src] ?? { title: "Project Photo", blurb: "" };
