import { JobListing, Quotation } from "@/types";

// Demonstration homeowner jobs for Prototype A workflow demonstration.
// No fabricated incoming quotations are pre-populated.
export const SAMPLE_JOBS: JobListing[] = [
  {
    id: "sample-job-101",
    title: "1,450 sq.ft Italian Statuario Marble Laying & Polish",
    homeownerName: "Anand Sharma",
    workType: "Marble Installation",
    city: "Hyderabad",
    location: "Banjara Hills, Hyderabad",
    areaSqFt: 1450,
    flooringType: "Italian Marble",
    roomType: "Living & Foyer Area",
    materialResponsibility: "Homeowner supplies materials",
    materialsProvidedBy: "Homeowner",
    budgetMin: 95000,
    budgetMax: 130000,
    budgetEst: 110000,
    preferredStartDate: "Within 10 days",
    expectedCompletionDate: "Within 25 days",
    photos: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    ],
    additionalRequirements: [
      "Optical laser datum calibration (IS 1443)",
      "Dry layout bookmatch vein sign-off",
      "7-stage diamond crystallization polish",
    ],
    postedDate: "2 days ago",
    status: "Open for Quotes",
    description:
      "Homeowner requirement: Seeking skilled Italian marble contractor for a 1,450 sq.ft duplex living room. Slabs supplied at site by homeowner. Scope includes dry bookmatch layout approval, epoxy joint infill, and multi-grade diamond polishing crystallization.",
    quotesReceived: 0,
    urgency: "Standard",
    isSampleJob: true,
  },
  {
    id: "sample-job-102",
    title: "980 sq.ft Large-Format Porcelain Tile Installation",
    homeownerName: "Sunita Reddy",
    workType: "Tile Installation",
    city: "Hyderabad",
    location: "Kondapur, Hyderabad",
    areaSqFt: 980,
    flooringType: "Vitrified Tiles",
    roomType: "Entire 3BHK Apartment",
    materialResponsibility: "Homeowner supplies materials",
    materialsProvidedBy: "Homeowner",
    budgetMin: 32000,
    budgetMax: 45000,
    budgetEst: 38000,
    preferredStartDate: "Immediate start",
    expectedCompletionDate: "Within 12 days",
    photos: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
    ],
    additionalRequirements: [
      "Suction lifters for 1200x1800mm slabs",
      "Tile leveling clips & epoxy grouting",
      "Lippage tolerance < 1.0mm",
    ],
    postedDate: "1 day ago",
    status: "Open for Quotes",
    description:
      "Need tile craftsman equipped with suction cup handling equipment for 1200x1800mm glazed porcelain tiles. Subfloor screed leveling, tile spacing clips, and color-matched epoxy grouting.",
    quotesReceived: 0,
    urgency: "Urgent",
    isSampleJob: true,
  },
  {
    id: "sample-job-103",
    title: "320 sq.ft Granite Staircase & Landings",
    homeownerName: "K. Raghunath",
    workType: "Granite Installation",
    city: "Warangal",
    location: "Hanamkonda, Warangal",
    areaSqFt: 320,
    flooringType: "Granite",
    roomType: "Internal Duplex Staircase (22 Steps)",
    materialResponsibility: "Quotation required for both",
    materialsProvidedBy: "Discuss",
    budgetMin: 20000,
    budgetMax: 28000,
    budgetEst: 24000,
    preferredStartDate: "Flexible schedule",
    expectedCompletionDate: "Within 10 days",
    photos: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
    ],
    additionalRequirements: [
      "Half-round bullnose edge profiling",
      "Three anti-skid groove cuts per tread",
      "Chamfered skirting finish",
    ],
    postedDate: "3 days ago",
    status: "Open for Quotes",
    description:
      "Bullnosing and anti-skid groove cutting on 22 steps, riser alignment, and skirting chamfering for natural dark granite. Open to contractor quoting granite supply.",
    quotesReceived: 0,
    urgency: "Flexible",
    isSampleJob: true,
  },
];

// No fake or fabricated quotations. Quotations appear only when registered workers submit them.
export const SAMPLE_QUOTATIONS: Quotation[] = [];
