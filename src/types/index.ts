export type FlooringCategory =
  | "Italian Marble"
  | "Indian Marble"
  | "Black Galaxy Granite"
  | "Granite"
  | "Vitrified Tiles"
  | "Ceramic Tiles"
  | "Wooden / Laminate"
  | "Terrazzo / Mosaic"
  | "Adhesives & Grout"
  | "Flooring Polish & Accessories";

export const TELANGANA_CITIES = [
  "Hyderabad",
  "Secunderabad",
  "Warangal",
  "Nizamabad",
  "Karimnagar",
  "Siddipet",
  "Khammam",
  "Mahbubnagar",
  "Ramagundam",
  "Nalgonda",
  "Suryapet",
  "Adilabad",
] as const;

export type TelanganaCity = (typeof TELANGANA_CITIES)[number];

export type VerificationStatus =
  | "Draft"
  | "Document Uploaded"
  | "Pending Verification"
  | "Verified"
  | "Rejected — Re-upload Required"
  | "Registration Incomplete"
  | "Registration Submitted"
  | "Document Verification Pending"
  | "Document Verified"
  | "Verification Rejected — Resubmission Required"
  | "Publicly Listed"
  | "Demo Listing";

export type LabourDocumentCategory =
  | "Telangana BOCWWB Construction Worker Card"
  | "State BOCW Construction Worker Card"
  | "e-Shram National Worker Registration Card"
  | "Artisans / Craftsman Guild Registration Identity"
  | "Other State Construction Worker Card";

export interface LabourDocumentUpload {
  documentCategory: LabourDocumentCategory;
  issuingState: string;
  documentNumberMasked?: string;
  fileName: string;
  fileSizeKb: number;
  fileType: string;
  fileStoragePath?: string;
  uploadedAt: string;
  verificationStatus: VerificationStatus;
}

export interface WorkerVerificationRecord {
  id: string;
  workerId: string;
  workerName: string;
  phoneContact: string;
  emailContact?: string;
  skills: FlooringCategory[];
  experienceYears: number;
  serviceAreaCity: string;
  serviceAreaState: string;
  documentCategory: LabourDocumentCategory;
  documentNumberMasked?: string;
  fileName: string;
  fileSizeKb: number;
  fileType: string;
  fileStoragePath?: string;
  uploadedAt: string;
  status: "Draft" | "Document Uploaded" | "Pending Verification" | "Verified" | "Rejected — Re-upload Required";
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  rejectionReason?: string;
}

export interface GooglePlaceReview {
  authorName: string;
  authorPhotoUrl?: string;
  authorUrl?: string;
  rating: number;
  relativeTimeDescription: string;
  text: string;
  publishTime?: string;
}

export interface PublicBusinessPlace {
  id: string;
  name: string;
  category: "contractor" | "supplier";
  formattedAddress: string;
  locationCity: string;
  state: "Telangana";
  googleMapsUri: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
  businessStatus?: string;
  verificationStatus: "Publicly Listed";
  source: "Google Maps Platform Places API";
  reviews?: GooglePlaceReview[];
  distanceKmEstimated?: number;
  primaryType?: string;
}

export interface PlacesApiResponse {
  status: "OK" | "API_KEY_REQUIRED" | "ZERO_RESULTS" | "ERROR";
  message: string;
  category: "contractors" | "suppliers";
  city: string;
  results: PublicBusinessPlace[];
  attribution: string;
  isConfigured: boolean;
}

export interface RegisteredWorkerProfile {
  id: string;
  name: string;
  serviceAreaState?: string;
  serviceAreaCity: string;
  serviceAreaNeighborhood?: string;
  skills: FlooringCategory[];
  experienceYears: number;
  phoneContact: string; // voluntary contact
  emailContact?: string;
  portfolioNotes: string;
  typicalSqftRate?: number; // voluntary reference benchmark
  dailyWageExpectation?: number;
  avatarUrl?: string;
  portfolioPhotos?: string[];
  languages?: string[];
  isAvailableForWork?: boolean;
  rating?: number;
  reviewCount?: number;
  completedJobs?: number;
  labourDocument?: LabourDocumentUpload;
  verificationStatus: VerificationStatus;
  verificationBadges?: string[];
  registeredAt: string;
  source: "Registered on MESTHIRI";
}

export interface Worker {
  id: string;
  name: string;
  title: string;
  experienceYears: number;
  verificationStatus: VerificationStatus;
  verificationBadges?: VerificationStatus[];
  locationArea: string;
  location: string; // for backward-compatible displays
  serviceAreaCity?: string;
  distanceKm?: number;
  phoneContact?: string;
  googleMapsUri?: string;
  languages: string[];
  skills: FlooringCategory[];
  typicalSqftRate: number; // reference benchmark in INR per sq.ft
  dailyRate?: number;
  sqftRate: number; // legacy compatibility mapping
  about: string;
  availableNotice: string;
  specializationBadges: string[];
  rating?: number;
  reviewCount?: number;
  completedJobs?: number;
  isSampleProfile: boolean;
  avatarUrl: string;
  portfolioImages: string[];
  source?: string;
}

export type FlooringWorkType =
  | "Marble Installation"
  | "Granite Installation"
  | "Tile Installation"
  | "Floor Polishing"
  | "Other Flooring Work";

export type MaterialResponsibility =
  | "Homeowner supplies materials"
  | "Worker supplies materials"
  | "Quotation required for both";

export type JobStatus =
  | "Draft"
  | "Open for Quotes"
  | "Quotation Submitted"
  | "Quotation Selected"
  | "In Progress (demo only)"
  | "Completed (demo only)";

export type QuotationStatus =
  | "Quotation Submitted"
  | "Quotation Selected"
  | "In Progress (demo only)"
  | "Completed (demo only)"
  | "Not Selected"
  | "Withdrawn";

export interface JobListing {
  id: string;
  title: string;
  homeownerName: string;
  workType: FlooringWorkType;
  city: string;
  location: string;
  distanceKm?: number;
  areaSqFt: number;
  flooringType: FlooringCategory;
  roomType: string;
  materialResponsibility: MaterialResponsibility;
  materialsProvidedBy?: "Homeowner" | "Mesthiri" | "Discuss"; // backward compatible
  budgetMin?: number;
  budgetMax?: number;
  budgetEst: number; // in INR
  preferredStartDate: string;
  expectedCompletionDate?: string;
  photos?: string[];
  additionalRequirements?: string[];
  postedDate: string;
  status: JobStatus;
  description: string;
  quotesReceived: number;
  selectedQuotationId?: string;
  urgency: "Standard" | "Urgent" | "Flexible";
  isSampleJob: boolean;
}

export interface Quotation {
  id: string;
  jobId: string;
  workerId: string;
  workerName: string;
  workerExperience: number;
  workerSkills?: FlooringCategory[];
  calculationMode: "per_sqft" | "fixed";
  ratePerSqFt?: number;
  fixedLaborAmount?: number;
  laborTotal: number;
  isMaterialSuppliedByWorker: boolean;
  materialCost: number;
  transportCharges: number;
  additionalCharges: number;
  additionalChargesExplanation?: string;
  polishingCost?: number;
  prepCost?: number;
  grandTotal: number;
  durationDays: number;
  teamSize?: number;
  laserLevelingIncluded?: boolean;
  workIncluded: string[];
  workExcluded: string[];
  validityPeriodDays: number;
  warrantyMonths?: number;
  comments: string;
  status: QuotationStatus;
  submittedAt: string;
  isSampleQuotation: boolean;
}

export interface MaterialCategorySpec {
  id: string;
  name: FlooringCategory;
  description: string;
  typicalOrigin: string;
  standardThickness: string;
  recommendedFinishes: string[];
  typicalApplication: string[];
  benchmarkPriceRange: string;
  priceNote?: string;
  curatedImageUrl: string;
}

export interface MaterialProduct {
  id: string;
  name: string;
  category: FlooringCategory;
  shopName: string;
  shopLocation: string;
  pricePerSqFt?: number;
  priceDisplay: string;
  availabilityDisplay: string;
  slabSize: string;
  thickness: string;
  finish: "Mirror Polished" | "Honed Matte" | "Flamed / Rustic" | "Leather Finish";
  origin: string;
  minOrderSqFt: number;
  description: string;
  color: string;
  imageUrl: string;
  isSampleListing: boolean;
  stockStatus: string;
}

export interface MaterialShop {
  id: string;
  name: string;
  contactPerson?: string;
  ownerName?: string;
  location: string;
  phone?: string;
  address: string;
  googleMapsUri?: string;
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
  verificationStatus: VerificationStatus;
  verificationBadges?: VerificationStatus[];
  categoriesStocked: FlooringCategory[];
  isSampleShop: boolean;
  notes: string;
  source?: string;
}

export interface DesignStyle {
  id: string;
  name: string;
  category: FlooringCategory;
  patternType: "Bookmatched Slab" | "Grid Lay" | "Herringbone" | "Diamond Inlay" | "Seamless Terrazzo";
  suitableRooms: string[];
  estimatedCostRange: string;
  description: string;
  colorTone: string;
  patternCss: string;
  technicalNote?: string;
}

export type UserRole = "homeowner" | "worker" | "shop" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl: string;
  headline?: string;
  city: string;
  serviceAreaNeighborhood?: string;
  bio?: string;
  // Worker specific
  skills?: FlooringCategory[];
  experienceYears?: number;
  typicalSqftRate?: number;
  isAvailableForWork?: boolean;
  contactPreference?: "phone" | "whatsapp" | "email";
  equipmentTrainingDetails?: string;
  profileCompleted?: boolean;
  labourDocument?: LabourDocumentUpload;
  verificationStatus?: VerificationStatus;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  documentUploadedAt?: string;
  certifications?: {
    id: string;
    title: string;
    issuingOrg: string;
    year: string;
    verified: boolean;
  }[];
  portfolioPhotos?: string[];
  toolsEquipment?: string[];
  // Shop specific
  shopName?: string;
  shopAddress?: string;
  operatingHours?: string;
  storageCapacity?: string;
  categoriesStocked?: FlooringCategory[];
}

export interface GovernmentScheme {
  id: string;
  title: string;
  shortName: string;
  category: "Welfare" | "Credit & Toolkits" | "Skill Certification" | "Social Security" | "Healthcare";
  department: string;
  level: "Telangana State" | "Central Government";
  description: string;
  keyBenefits: string[];
  eligibility: string[];
  requiredDocuments: string[];
  officialPortalUrl: string;
  applicationMode: string;
  statusNote: string;
}

export type ActiveAppTab =
  | "home"
  | "workers"
  | "worker-dashboard"
  | "visualizer"
  | "marketplace"
  | "designs"
  | "about"
  | "profile"
  | "schemes"
  | "admin-verification";


