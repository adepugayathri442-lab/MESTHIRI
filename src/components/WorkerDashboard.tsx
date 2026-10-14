"use client";

import React, { useState, useMemo } from "react";
import {
  JobListing,
  Quotation,
  FlooringCategory,
  FlooringWorkType,
  TELANGANA_CITIES,
  UserProfile,
  ActiveAppTab,
  GovernmentScheme,
  LabourDocumentCategory,
  VerificationStatus,
} from "@/types";
import { GOVERNMENT_SCHEMES } from "@/data/schemes";
import {
  Briefcase,
  Clock,
  Send,
  DollarSign,
  CheckCircle2,
  TrendingUp,
  X,
  Shield,
  Layers,
  Sparkles,
  Info,
  Calendar,
  Check,
  AlertCircle,
  ShieldCheck,
  Upload,
  UserCheck,
  Award,
  FileText,
  Phone,
  MapPin,
  Search,
  Filter,
  CheckSquare,
  Square,
  ArrowRight,
  SlidersHorizontal,
  Eye,
  ToggleLeft,
  ToggleRight,
  Plus,
  Trash2,
  ExternalLink,
  FileCheck2,
  User,
  Edit3,
  Camera,
  HelpCircle,
  Wrench,
  ChevronRight,
  Mail,
  ShieldAlert,
} from "lucide-react";

interface WorkerDashboardProps {
  jobs: JobListing[];
  quotations: Quotation[];
  currentUser?: UserProfile;
  onUpdateUser?: (updated: UserProfile) => void;
  onSubmitWorkerQuote: (jobId: string, quote: Partial<Quotation>) => void;
  onWithdrawQuote?: (quoteId: string) => void;
  onNavigateTab?: (tab: ActiveAppTab) => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({
  jobs,
  quotations,
  currentUser,
  onUpdateUser,
  onSubmitWorkerQuote,
  onWithdrawQuote,
  onNavigateTab,
}) => {
  // Navigation tabs for Worker Portal
  const [activeTab, setActiveTab] = useState<
    "overview" | "profile" | "leads" | "quotations" | "portfolio" | "schemes"
  >("overview");

  const LABOUR_DOC_CATEGORIES: LabourDocumentCategory[] = [
    "Telangana BOCWWB Construction Worker Card",
    "State BOCW Construction Worker Card",
    "e-Shram National Worker Registration Card",
    "Artisans / Craftsman Guild Registration Identity",
    "Other State Construction Worker Card",
  ];

  const INDIAN_STATES = [
    "Telangana",
    "Andhra Pradesh",
    "Karnataka",
    "Maharashtra",
    "Tamil Nadu",
    "Rajasthan",
    "Gujarat",
    "Kerala",
    "Madhya Pradesh",
    "Uttar Pradesh",
    "Delhi (NCR)",
    "Other State",
  ] as const;

  // Worker Profile State (synchronized with currentUser if available)
  const [workerProfile, setWorkerProfile] = useState({
    name:
      currentUser?.name && !currentUser.name.includes("Unregistered") && !currentUser.name.includes("Incomplete")
        ? currentUser.name
        : "",
    avatarUrl:
      currentUser?.avatarUrl ||
      "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80",
    serviceAreaState: "Telangana",
    serviceAreaCity: currentUser?.city || "Hyderabad",
    serviceAreaNeighborhood: currentUser?.serviceAreaNeighborhood || "",
    phoneContact: currentUser?.phone && !currentUser.phone.includes("00000") ? currentUser.phone : "",
    contactPreference: (currentUser?.contactPreference as "phone" | "whatsapp" | "email") || "phone",
    skills: currentUser?.skills || ([] as FlooringCategory[]),
    experienceYears: currentUser?.experienceYears || 0,
    typicalSqftRate: currentUser?.typicalSqftRate || 75,
    bio: currentUser?.bio && !currentUser.bio.includes("Unregistered") ? currentUser.bio : "",
    equipmentTrainingDetails: currentUser?.equipmentTrainingDetails || "",
    toolsEquipment: currentUser?.toolsEquipment || [],
    certifications: currentUser?.certifications || [],
    portfolioPhotos: currentUser?.portfolioPhotos || [],
    isAvailableForWork:
      currentUser?.isAvailableForWork !== undefined ? currentUser.isAvailableForWork : true,
    profileCompleted: currentUser?.profileCompleted === true,
    verificationStatus: (currentUser?.verificationStatus as VerificationStatus) || "Pending Verification",
    rejectionReason: currentUser?.rejectionReason || "",
    // Labour Document Upload State
    documentCategory: "Telangana BOCWWB Construction Worker Card" as LabourDocumentCategory,
    issuingState: "Telangana",
    documentNumber: "",
    uploadedFile: null as { name: string; sizeKb: number; type: string } | null,
  });

  const isVerifiedWorker =
    workerProfile.verificationStatus === "Verified" ||
    workerProfile.verificationStatus === "Document Verified";

  // Re-upload state for rejected or unverified workers
  const [reuploadFile, setReuploadFile] = useState<{ name: string; sizeKb: number; type: string } | null>(null);
  const [reuploadCategory, setReuploadCategory] = useState<LabourDocumentCategory>(
    "Telangana BOCWWB Construction Worker Card"
  );
  const [reuploadDocNumber, setReuploadDocNumber] = useState<string>("");
  const [reuploadError, setReuploadError] = useState<string>("");
  const [reuploadSuccess, setReuploadSuccess] = useState<string>("");
  const [isReuploading, setIsReuploading] = useState<boolean>(false);

  // Calculate truthful profile completion based strictly on completed fields
  const profileCompletionScore = useMemo(() => {
    let score = 0;
    if (workerProfile.name?.trim()) score += 10;
    if (workerProfile.avatarUrl?.trim()) score += 10;
    if (workerProfile.serviceAreaCity?.trim()) score += 15;
    if (workerProfile.skills && workerProfile.skills.length > 0) score += 15;
    if (workerProfile.experienceYears && workerProfile.experienceYears > 0) score += 10;
    if (workerProfile.bio && workerProfile.bio.trim().length > 20) score += 15;
    if (workerProfile.toolsEquipment && workerProfile.toolsEquipment.length > 0) score += 10;
    if (workerProfile.portfolioPhotos && workerProfile.portfolioPhotos.length > 0) score += 15;
    return Math.min(100, score);
  }, [workerProfile]);

  // Modals state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({ ...workerProfile });
  const [selectedJobForQuote, setSelectedJobForQuote] = useState<JobListing | null>(null);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<JobListing | null>(null);
  const [selectedQuoteForDetails, setSelectedQuoteForDetails] = useState<Quotation | null>(null);

  // New certification / portfolio photo forms
  const [newCertTitle, setNewCertTitle] = useState("");
  const [newCertOrg, setNewCertOrg] = useState("");
  const [newCertYear, setNewCertYear] = useState("2024");
  const [showAddCertForm, setShowAddCertForm] = useState(false);

  // Quotation Builder Form State
  const [calcMode, setCalcMode] = useState<"per_sqft" | "fixed">("per_sqft");
  const [ratePerSqFt, setRatePerSqFt] = useState<number>(75);
  const [fixedLaborAmount, setFixedLaborAmount] = useState<number>(95000);
  const [isMaterialSupplied, setIsMaterialSupplied] = useState<boolean>(false);
  const [materialCost, setMaterialCost] = useState<number>(0);
  const [transportCharges, setTransportCharges] = useState<number>(2000);
  const [additionalCharges, setAdditionalCharges] = useState<number>(14000);
  const [additionalChargesExplanation, setAdditionalChargesExplanation] = useState<string>(
    "7-Stage rotary planetary diamond crystallization polishing & wet slurry extraction"
  );
  const [durationDays, setDurationDays] = useState<number>(14);
  const [validityPeriodDays, setValidityPeriodDays] = useState<number>(15);
  const [workerNotes, setWorkerNotes] = useState<string>(
    "Includes optical laser datum calibration and dry layout vein alignment preview before laying slabs. Power and water to be provided at site."
  );

  const defaultWorkIncluded = [
    "Optical laser datum line verification (IS 1443)",
    "Dry layout vein matching and homeowner preview",
    "Polymer-modified mortar slab bed fixing",
    "Two-component resin joint grouting",
    "7-stage planetary diamond crystallization polishing",
    "Debris bagging and final vacuum cleaning",
  ];

  const defaultWorkExcluded = [
    "Raw stone slab procurement (client supplied)",
    "Major RCC slab structural leveling",
    "Furniture shifting / heavy lifting",
    "Disposal of rubble outside community gate",
  ];

  const [workIncluded, setWorkIncluded] = useState<string[]>(defaultWorkIncluded);
  const [workExcluded, setWorkExcluded] = useState<string[]>(defaultWorkExcluded);

  // Job Leads Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCity, setFilterCity] = useState("All Cities");
  const [filterWorkType, setFilterWorkType] = useState("All Types");
  const [filterArea, setFilterArea] = useState("All Areas");
  const [filterMatchingSkillsOnly, setFilterMatchingSkillsOnly] = useState(false);

  // My Quotations Filter State
  const [quoteStatusFilter, setQuoteStatusFilter] = useState<string>("All");

  // Government Schemes Filter State
  const [schemeCategoryFilter, setSchemeCategoryFilter] = useState("All");

  // Toggle Availability
  const handleToggleAvailability = () => {
    const updatedStatus = !workerProfile.isAvailableForWork;
    const updated = {
      ...workerProfile,
      isAvailableForWork: updatedStatus,
    };
    setWorkerProfile(updated);
    if (onUpdateUser && currentUser) {
      onUpdateUser({
        ...currentUser,
        isAvailableForWork: updatedStatus,
      });
    }
  };

  // Open Quotation Builder Modal for a selected job
  const handleOpenQuoteModal = (job: JobListing) => {
    setSelectedJobForQuote(job);
    const isMarble = job.flooringType.includes("Marble");
    const isTile = job.flooringType.includes("Tile");
    const defaultRate = isMarble ? 75 : isTile ? 36 : 48;
    setRatePerSqFt(defaultRate);
    setFixedLaborAmount(Math.round(job.areaSqFt * defaultRate * 0.95));

    const workerSupplies = job.materialResponsibility === "Worker supplies materials";
    setIsMaterialSupplied(workerSupplies);
    setMaterialCost(workerSupplies ? Math.round(job.areaSqFt * 65) : 0);

    if (job.areaSqFt > 1000) setDurationDays(14);
    else if (job.areaSqFt > 500) setDurationDays(9);
    else setDurationDays(5);

    setWorkIncluded(defaultWorkIncluded);
    setWorkExcluded(defaultWorkExcluded);
  };

  // Grand total calculation without double-counting
  const calculatedLaborTotal = useMemo(() => {
    if (!selectedJobForQuote) return 0;
    if (calcMode === "per_sqft") {
      return selectedJobForQuote.areaSqFt * ratePerSqFt;
    } else {
      return fixedLaborAmount;
    }
  }, [selectedJobForQuote, calcMode, ratePerSqFt, fixedLaborAmount]);

  const activeMaterialCost = isMaterialSupplied ? materialCost : 0;
  const calculatedGrandTotal =
    calculatedLaborTotal + activeMaterialCost + transportCharges + additionalCharges;

  // Handle quote submission
  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForQuote) return;

    onSubmitWorkerQuote(selectedJobForQuote.id, {
      calculationMode: calcMode,
      ratePerSqFt: calcMode === "per_sqft" ? ratePerSqFt : undefined,
      fixedLaborAmount: calcMode === "fixed" ? fixedLaborAmount : undefined,
      laborTotal: calculatedLaborTotal,
      isMaterialSuppliedByWorker: isMaterialSupplied,
      materialCost: activeMaterialCost,
      transportCharges,
      additionalCharges,
      additionalChargesExplanation,
      grandTotal: calculatedGrandTotal,
      durationDays,
      validityPeriodDays,
      workIncluded,
      workExcluded,
      comments: workerNotes,
      status: "Quotation Submitted",
      workerSkills: workerProfile.skills,
    });

    setSelectedJobForQuote(null);
    setActiveTab("quotations");
  };

  const [docUploadError, setDocUploadError] = useState("");

  const handleDocFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowed.includes(file.type)) {
      setDocUploadError("Permitted formats: PDF, JPG, PNG. Please upload a valid document.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setDocUploadError("File size exceeds 5MB limit. Please upload a smaller file.");
      return;
    }

    setDocUploadError("");
    setEditProfileForm((prev) => ({
      ...prev,
      uploadedFile: {
        name: file.name,
        sizeKb: Math.round(file.size / 1024),
        type: file.type,
      },
    }));
  };

  // Save edited profile & persist to /api/workers
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const initialStatus: VerificationStatus = editProfileForm.uploadedFile
      ? "Document Verification Pending"
      : "Registration Submitted";

    const updated = {
      ...editProfileForm,
      profileCompleted: true,
      verificationStatus: initialStatus,
    };
    setWorkerProfile(updated);
    setIsEditingProfile(false);

    // Persist to worker storage API
    try {
      await fetch("/api/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updated.name.trim(),
          serviceAreaState: updated.serviceAreaState || "Telangana",
          serviceAreaCity: updated.serviceAreaCity,
          serviceAreaNeighborhood: updated.serviceAreaNeighborhood || undefined,
          phoneContact: updated.phoneContact || "+91 98490 00000",
          skills: updated.skills,
          experienceYears: Number(updated.experienceYears) || 1,
          typicalSqftRate: Number(updated.typicalSqftRate) || 75,
          portfolioNotes: updated.bio || "Registered craftsman on MESTHIRI.",
          avatarUrl: updated.avatarUrl || undefined,
          labourDocument: editProfileForm.uploadedFile
            ? {
                documentCategory: editProfileForm.documentCategory,
                issuingState: editProfileForm.issuingState || "Telangana",
                documentNumber: editProfileForm.documentNumber || undefined,
                fileName: editProfileForm.uploadedFile.name,
                fileSizeKb: editProfileForm.uploadedFile.sizeKb,
                fileType: editProfileForm.uploadedFile.type,
              }
            : undefined,
        }),
      });
    } catch (err) {
      console.error("Error saving worker profile to API:", err);
    }

    if (onUpdateUser && currentUser) {
      onUpdateUser({
        ...currentUser,
        name: updated.name,
        city: updated.serviceAreaCity,
        serviceAreaNeighborhood: updated.serviceAreaNeighborhood,
        skills: updated.skills,
        experienceYears: updated.experienceYears,
        typicalSqftRate: updated.typicalSqftRate,
        bio: updated.bio,
        equipmentTrainingDetails: updated.equipmentTrainingDetails,
        toolsEquipment: updated.toolsEquipment,
        certifications: updated.certifications,
        portfolioPhotos: updated.portfolioPhotos,
        isAvailableForWork: updated.isAvailableForWork,
        profileCompleted: true,
        verificationStatus: initialStatus,
        labourDocument: editProfileForm.uploadedFile
          ? {
              documentCategory: editProfileForm.documentCategory,
              issuingState: editProfileForm.issuingState || "Telangana",
              documentNumberMasked: editProfileForm.documentNumber
                ? `***${editProfileForm.documentNumber.slice(-4)}`
                : undefined,
              fileName: editProfileForm.uploadedFile.name,
              fileSizeKb: editProfileForm.uploadedFile.sizeKb,
              fileType: editProfileForm.uploadedFile.type,
              uploadedAt: new Date().toISOString(),
              verificationStatus: "Document Verification Pending",
            }
          : undefined,
      });
    }
  };

  // Handle re-uploading labour document for re-verification
  const handleReuploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reuploadFile) {
      setReuploadError("Please select a document file to upload (PDF, JPG, or PNG).");
      return;
    }

    setIsReuploading(true);
    setReuploadError("");
    setReuploadSuccess("");

    try {
      const updatedStatus: VerificationStatus = "Pending Verification";
      const updated = {
        ...workerProfile,
        verificationStatus: updatedStatus,
        rejectionReason: "",
      };
      setWorkerProfile(updated);
      setReuploadSuccess(
        "Your document has been submitted for verification. Your worker account will become active after verification."
      );
      setReuploadFile(null);

      if (onUpdateUser && currentUser) {
        onUpdateUser({
          ...currentUser,
          verificationStatus: updatedStatus,
          rejectionReason: undefined,
          labourDocument: {
            documentCategory: reuploadCategory,
            issuingState: "Telangana",
            documentNumberMasked: reuploadDocNumber ? `***${reuploadDocNumber.slice(-4)}` : undefined,
            fileName: reuploadFile.name,
            fileSizeKb: reuploadFile.sizeKb,
            fileType: reuploadFile.type,
            uploadedAt: new Date().toISOString(),
            verificationStatus: "Pending Verification",
          },
        });
      }
    } catch (err: any) {
      setReuploadError(err?.message || "Failed to submit document for verification.");
    } finally {
      setIsReuploading(false);
    }
  };

  // Add certification
  const handleAddCertification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertTitle.trim() || !newCertOrg.trim()) return;

    const newCert = {
      id: `cert-${Date.now()}`,
      title: newCertTitle.trim(),
      issuingOrg: newCertOrg.trim(),
      year: newCertYear.trim() || "2024",
      verified: false, // Truthful: self-submitted certificates are marked not verified
    };

    const updatedCerts = [newCert, ...workerProfile.certifications];
    setWorkerProfile((prev) => ({ ...prev, certifications: updatedCerts }));
    setNewCertTitle("");
    setNewCertOrg("");
    setShowAddCertForm(false);
  };

  // Filtered jobs calculation
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Free text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          job.title.toLowerCase().includes(q) ||
          job.homeownerName.toLowerCase().includes(q) ||
          job.description.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // City filter
      if (filterCity !== "All Cities") {
        if (job.city && job.city.toLowerCase() !== filterCity.toLowerCase()) {
          return false;
        }
        if (!job.city && !job.location.toLowerCase().includes(filterCity.toLowerCase())) {
          return false;
        }
      }

      // Work type filter
      if (filterWorkType !== "All Types") {
        if (job.workType !== filterWorkType) return false;
      }

      // Area filter
      if (filterArea === "< 500 sq.ft" && job.areaSqFt >= 500) return false;
      if (filterArea === "500 - 1000 sq.ft" && (job.areaSqFt < 500 || job.areaSqFt > 1000))
        return false;
      if (filterArea === "1000+ sq.ft" && job.areaSqFt < 1000) return false;

      // Matching skills
      if (filterMatchingSkillsOnly) {
        const hasMatchingSkill = workerProfile.skills.some((s) =>
          job.flooringType.toLowerCase().includes(s.toLowerCase())
        );
        if (!hasMatchingSkill) return false;
      }

      return true;
    });
  }, [
    jobs,
    searchQuery,
    filterCity,
    filterWorkType,
    filterArea,
    filterMatchingSkillsOnly,
    workerProfile.skills,
  ]);

  // Filtered quotations (my quotations)
  const myQuotations = useMemo(() => {
    return quotations.filter((q) => {
      if (quoteStatusFilter === "All") return true;
      return q.status.toLowerCase().includes(quoteStatusFilter.toLowerCase());
    });
  }, [quotations, quoteStatusFilter]);

  // Filtered government schemes
  const filteredSchemes = useMemo(() => {
    if (schemeCategoryFilter === "All") return GOVERNMENT_SCHEMES;
    return GOVERNMENT_SCHEMES.filter((s) => s.category === schemeCategoryFilter);
  }, [schemeCategoryFilter]);

  // Active status counts for Overview
  const quotationsStats = useMemo(() => {
    const total = quotations.length;
    const selected = quotations.filter((q) => q.status === "Quotation Selected").length;
    const submitted = quotations.filter((q) => q.status === "Quotation Submitted").length;
    return { total, selected, submitted };
  }, [quotations]);

  // =========================================================================
  // VIEW: FIRST-TIME PROFILE SETUP SCREEN (If profile not completed)
  // =========================================================================
  if (!workerProfile.profileCompleted) {
    return (
      <section className="py-12 bg-[#F6F2E9] min-h-[85vh] flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-2xl w-full bg-white rounded-3xl border border-[#E2DDD2] p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#172321] text-[#C5A66B] flex items-center justify-center border border-[#C5A66B]/40 shadow-xs">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#245B50] uppercase tracking-wider">
                Welcome to MESTHIRI
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#172321] font-serif">
                First-Time Craftsman Profile Setup
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#6E6B65] mb-6 leading-relaxed">
            Please complete your professional flooring craftsman profile. Homeowners review these details
            when evaluating your quotations. All demo records remain labelled as simulations.
          </p>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {docUploadError && (
              <div className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{docUploadError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172321] mb-1">
                  Full Name / Mesthiri Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Srikanth Rao / Anand Sharma"
                  value={editProfileForm.name}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172321] mb-1">
                  Contact Mobile Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98490 XXXXX"
                  value={editProfileForm.phoneContact}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, phoneContact: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172321] mb-1">
                  State *
                </label>
                <select
                  value={editProfileForm.serviceAreaState}
                  onChange={(e) =>
                    setEditProfileForm({
                      ...editProfileForm,
                      serviceAreaState: e.target.value,
                      serviceAreaCity: e.target.value === "Telangana" ? "Hyderabad" : editProfileForm.serviceAreaCity,
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172321] mb-1">
                  Primary Operating City *
                </label>
                {editProfileForm.serviceAreaState === "Telangana" ? (
                  <select
                    value={editProfileForm.serviceAreaCity}
                    onChange={(e) =>
                      setEditProfileForm({ ...editProfileForm, serviceAreaCity: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                  >
                    {TELANGANA_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}, Telangana
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="Enter operating city"
                    value={editProfileForm.serviceAreaCity}
                    onChange={(e) =>
                      setEditProfileForm({ ...editProfileForm, serviceAreaCity: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172321] mb-1">
                Service Area / Neighborhoods
              </label>
              <input
                type="text"
                value={editProfileForm.serviceAreaNeighborhood}
                onChange={(e) =>
                  setEditProfileForm({
                    ...editProfileForm,
                    serviceAreaNeighborhood: e.target.value,
                  })
                }
                placeholder="e.g. Kukatpally, Madhapur, Gachibowli, Hanamkonda"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172321] mb-1">
                Select Your Trade Skills *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  "Italian Marble",
                  "Indian Marble",
                  "Granite",
                  "Vitrified Tiles",
                  "Ceramic Tiles",
                  "Terrazzo / Mosaic",
                ].map((skill) => {
                  const isChecked = editProfileForm.skills.includes(skill as FlooringCategory);
                  return (
                    <label
                      key={skill}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                        isChecked
                          ? "bg-[#E8F0EE] border-[#245B50] text-[#172321]"
                          : "bg-[#FAF7F0] border-[#E2DDD2] text-[#6E6B65]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const updatedSkills = isChecked
                            ? editProfileForm.skills.filter((s) => s !== skill)
                            : [...editProfileForm.skills, skill as FlooringCategory];
                          setEditProfileForm({ ...editProfileForm, skills: updatedSkills });
                        }}
                        className="rounded text-[#245B50]"
                      />
                      <span>{skill}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172321] mb-1">
                  Years of Trade Experience *
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  required
                  value={editProfileForm.experienceYears}
                  onChange={(e) =>
                    setEditProfileForm({
                      ...editProfileForm,
                      experienceYears: Number(e.target.value) || 1,
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172321] mb-1">
                  Reference Labor Benchmark (₹ / sq.ft)
                </label>
                <input
                  type="number"
                  min={10}
                  max={500}
                  value={editProfileForm.typicalSqftRate}
                  onChange={(e) =>
                    setEditProfileForm({
                      ...editProfileForm,
                      typicalSqftRate: Number(e.target.value) || 50,
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172321] mb-1">
                Short Professional Introduction
              </label>
              <textarea
                rows={3}
                value={editProfileForm.bio}
                onChange={(e) => setEditProfileForm({ ...editProfileForm, bio: e.target.value })}
                placeholder="Mention your specialization, bookmatch experience, and laser leveling tools..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
              />
            </div>

            {/* Labour Card / Registration Document Upload Section */}
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#245B50]/30 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#245B50]" />
                <h4 className="text-xs font-bold text-[#172321] uppercase tracking-wider">
                  Labour Card / Registration Document Upload
                </h4>
              </div>
              <p className="text-[11px] text-[#6E6B65] leading-relaxed">
                Provide your relevant construction-worker or artisan registration document. Uploaded documents will be marked with status <strong>“Document Verification Pending”</strong> and require formal verification before earning a verified badge.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#172321] mb-1">
                    Document Category *
                  </label>
                  <select
                    value={editProfileForm.documentCategory}
                    onChange={(e) =>
                      setEditProfileForm({
                        ...editProfileForm,
                        documentCategory: e.target.value as LabourDocumentCategory,
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#E2DDD2] bg-white focus:outline-none focus:border-[#245B50]"
                  >
                    {LABOUR_DOC_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#172321] mb-1">
                    Issuing State *
                  </label>
                  <select
                    value={editProfileForm.issuingState}
                    onChange={(e) =>
                      setEditProfileForm({ ...editProfileForm, issuingState: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#E2DDD2] bg-white focus:outline-none focus:border-[#245B50]"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#172321] mb-1">
                  Card / Registration Number (Masked in Public View)
                </label>
                <input
                  type="text"
                  placeholder="e.g. TG-BOCW-2024-XXXX"
                  value={editProfileForm.documentNumber}
                  onChange={(e) =>
                    setEditProfileForm({ ...editProfileForm, documentNumber: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#E2DDD2] bg-white focus:outline-none focus:border-[#245B50]"
                />
              </div>

              {/* Document File Input */}
              <div>
                <label className="block text-[11px] font-semibold text-[#172321] mb-1">
                  Document Image or PDF (Max 5MB)
                </label>
                {editProfileForm.uploadedFile ? (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-700" />
                      <div>
                        <p className="text-xs font-bold text-emerald-900">
                          {editProfileForm.uploadedFile.name}
                        </p>
                        <p className="text-[10px] text-emerald-700">
                          {editProfileForm.uploadedFile.sizeKb} KB • Ready for verification review
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setEditProfileForm((prev) => ({ ...prev, uploadedFile: null }))
                      }
                      className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline"
                    >
                      Replace File
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-[#245B50]/40 bg-white hover:bg-[#FAF7F0] cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 text-[#245B50] mb-1" />
                    <span className="text-xs font-semibold text-[#172321]">
                      Click to attach registration document
                    </span>
                    <span className="text-[10px] text-[#6E6B65]">
                      Permitted: PDF, JPG, PNG up to 5MB
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={handleDocFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-[10px] text-amber-900 leading-relaxed flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Demo Upload Notice:</strong> Files are held in prototype state. Uploading a document sets initial status to “Document Verification Pending”. Verified badges are issued only after human vetting. Sensitive documents are never published publicly.
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2DDD2] flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={editProfileForm.skills.length === 0}
                className="px-6 py-2.5 rounded-xl bg-[#245B50] hover:bg-[#1A443C] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <span>Save Profile & Register as Mesthiri</span>
                <ArrowRight className="w-4 h-4 text-[#C5A66B]" />
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }

  // =========================================================================
  // MAIN WORKER DASHBOARD
  // =========================================================================
  return (
    <section className="py-8 sm:py-10 bg-[#F6F2E9] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header with Craftsman Identity & Availability Toggle */}
        <div className="bg-white rounded-2xl border border-[#E2DDD2] p-5 sm:p-6 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={workerProfile.avatarUrl}
              alt={workerProfile.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-[#C5A66B]/50 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-[#172321] font-serif">
                  {workerProfile.name}
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-[#E8F0EE] text-[#245B50] border border-[#245B50]/30">
                  Worker Portal
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-[#FAF7F0] text-[#6E6B65] border border-[#E2DDD2]">
                  Academic Demo Profile
                </span>
              </div>
              <p className="text-xs text-[#6E6B65] mt-1 flex items-center gap-1.5 flex-wrap">
                <MapPin className="w-3.5 h-3.5 text-[#245B50]" />
                <span>
                  {workerProfile.serviceAreaCity} ({workerProfile.serviceAreaNeighborhood})
                </span>
                <span>•</span>
                <span>{workerProfile.experienceYears} Years Trade Exp.</span>
                <span>•</span>
                <span>₹{workerProfile.typicalSqftRate}/sq.ft Benchmark</span>
              </p>
            </div>
          </div>

          {/* Section 8: Prominent "Available for Work" Toggle */}
          <div className="flex items-center gap-3 self-start md:self-center">
            <button
              onClick={handleToggleAvailability}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all shadow-xs cursor-pointer ${
                workerProfile.isAvailableForWork
                  ? "bg-[#E8F0EE] text-[#245B50] border-[#245B50]/40 ring-1 ring-[#245B50]/20"
                  : "bg-[#FAF7F0] text-[#6E6B65] border-[#E2DDD2]"
              }`}
              title="Toggle your availability state in the prototype"
            >
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wider">
                  Availability Status
                </span>
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      workerProfile.isAvailableForWork ? "bg-[#245B50] animate-pulse" : "bg-stone-400"
                    }`}
                  />
                  {workerProfile.isAvailableForWork ? "Available for Work" : "Currently Unavailable"}
                </span>
              </div>
              {workerProfile.isAvailableForWork ? (
                <ToggleRight className="w-7 h-7 text-[#245B50]" />
              ) : (
                <ToggleLeft className="w-7 h-7 text-stone-400" />
              )}
            </button>
          </div>
        </div>

        {/* Section 1: Dashboard Navigation Tabs (All 6 Tabs) */}
        <div className="flex border-b border-[#E2DDD2] mb-6 gap-1 overflow-x-auto scrollbar-none">
          {[
            { id: "overview", label: "Overview", icon: <TrendingUp className="w-4 h-4" /> },
            { id: "profile", label: "My Profile", icon: <User className="w-4 h-4" /> },
            {
              id: "leads",
              label: `Nearby Job Leads (${jobs.length})`,
              icon: <Briefcase className="w-4 h-4" />,
            },
            {
              id: "quotations",
              label: `My Quotations (${quotations.length})`,
              icon: <FileCheck2 className="w-4 h-4" />,
            },
            {
              id: "portfolio",
              label: "Skills & Portfolio",
              icon: <Award className="w-4 h-4" />,
            },
            {
              id: "schemes",
              label: "Government Schemes",
              icon: <ShieldCheck className="w-4 h-4" />,
            },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "border-[#245B50] text-[#245B50] bg-white rounded-t-lg shadow-xs"
                    : "border-transparent text-[#6E6B65] hover:text-[#172321] hover:bg-[#FAF7F0]"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* PROMINENT WORKER VERIFICATION BANNER & RE-UPLOAD FORM                      */}
        {/* ========================================================================= */}
        {isVerifiedWorker ? (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-emerald-900">
                    Verified Worker Account
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-700 text-white">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Your labour registration document has been reviewed and approved by an authorized review officer. You are eligible to browse leads and submit quotes.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-800 shrink-0 bg-white/70 px-3 py-1.5 rounded-xl border border-emerald-200">
              Active in Directory
            </span>
          </div>
        ) : workerProfile.verificationStatus === "Rejected — Re-upload Required" ? (
          <div className="mb-6 p-5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 space-y-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-rose-900">
                    Labour Card Verification Rejected — Re-upload Required
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-700 text-white">
                    Rejected
                  </span>
                </div>
                <p className="text-xs text-rose-800 mt-1">
                  <strong>Reason from Reviewer:</strong>{" "}
                  {workerProfile.rejectionReason || currentUser?.rejectionReason || "Uploaded document was blurry or could not be verified with the issuing authority."}
                </p>
                <p className="text-xs text-rose-700 mt-1">
                  Please upload a clear scanned copy of your valid Telangana BOCWWB card or applicable trade document below to resubmit for verification.
                </p>
              </div>
            </div>

            {/* Re-upload Form */}
            <form onSubmit={handleReuploadSubmit} className="pt-2 border-t border-rose-200 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-[11px] font-semibold text-rose-900 mb-1">
                  Document Type
                </label>
                <select
                  value={reuploadCategory}
                  onChange={(e) => setReuploadCategory(e.target.value as LabourDocumentCategory)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-rose-300 bg-white text-stone-900"
                >
                  {LABOUR_DOC_CATEGORIES.map((doc) => (
                    <option key={doc} value={doc}>{doc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-rose-900 mb-1">
                  Select Corrected Document (PDF, JPG, PNG)
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setReuploadFile({
                        name: f.name,
                        sizeKb: Math.round(f.size / 1024),
                        type: f.type,
                      });
                    }
                  }}
                  className="w-full text-xs text-rose-900 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-700 file:text-white hover:file:bg-rose-800 cursor-pointer"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isReuploading}
                  className="w-full py-2 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  {isReuploading ? "Submitting..." : "Submit for Re-verification"}
                </button>
              </div>
            </form>
            {reuploadError && <p className="text-xs text-rose-800 font-semibold">{reuploadError}</p>}
            {reuploadSuccess && <p className="text-xs text-emerald-800 font-semibold">{reuploadSuccess}</p>}
          </div>
        ) : (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-amber-900">
                    Your document has been submitted for verification. Your worker account will become active after verification.
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-600 text-white">
                    Pending Verification
                  </span>
                </div>
                <p className="text-xs text-amber-800 mt-0.5">
                  An authorized review officer is inspecting your labour document. Lead browsing and quotation builder will unlock upon verification.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-amber-800 shrink-0 bg-white/70 px-3 py-1.5 rounded-xl border border-amber-200">
              Review in Progress
            </span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: DASHBOARD OVERVIEW                                                */}
        {/* ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Quick Status Banners */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Profile Completion Card */}
              <div className="bg-white p-5 rounded-2xl border border-[#E2DDD2] shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#6E6B65] uppercase tracking-wider">
                    Profile Completion
                  </span>
                  <div className="flex items-center justify-between mt-2 mb-1.5">
                    <span className="text-2xl font-extrabold text-[#172321]">
                      {profileCompletionScore}%
                    </span>
                    <span className="text-xs font-semibold text-[#245B50]">
                      {profileCompletionScore === 100 ? "Complete" : "In Progress"}
                    </span>
                  </div>
                  <div className="w-full bg-[#FAF7F0] rounded-full h-2 border border-[#E2DDD2]">
                    <div
                      className="bg-[#245B50] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${profileCompletionScore}%` }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditProfileForm({ ...workerProfile });
                    setIsEditingProfile(true);
                  }}
                  className="mt-4 text-xs font-bold text-[#245B50] hover:text-[#172321] text-left flex items-center gap-1"
                >
                  <span>Edit Profile</span>
                  <ArrowRight className="w-3 h-3 text-[#C5A66B]" />
                </button>
              </div>

              {/* Active Availability */}
              <div className="bg-white p-5 rounded-2xl border border-[#E2DDD2] shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#6E6B65] uppercase tracking-wider">
                    Availability State
                  </span>
                  <p className="text-lg font-bold text-[#172321] mt-2">
                    {workerProfile.isAvailableForWork ? "Active & Taking Work" : "Currently Unavailable"}
                  </p>
                  <p className="text-xs text-[#6E6B65] mt-1">
                    {workerProfile.isAvailableForWork
                      ? "Shown as available in public Telangana craftsman listings."
                      : "Hidden from immediate availability inquiries."}
                  </p>
                </div>
                <button
                  onClick={handleToggleAvailability}
                  className="mt-4 text-xs font-bold text-[#245B50] hover:text-[#172321] text-left flex items-center gap-1"
                >
                  <span>Toggle Availability</span>
                  <ArrowRight className="w-3 h-3 text-[#C5A66B]" />
                </button>
              </div>

              {/* Job Leads Counter */}
              <div className="bg-white p-5 rounded-2xl border border-[#E2DDD2] shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#6E6B65] uppercase tracking-wider">
                    Available Job Leads
                  </span>
                  <div className="text-2xl font-extrabold text-[#172321] mt-2">
                    {jobs.length} Requirements
                  </div>
                  <p className="text-xs text-[#6E6B65] mt-1">
                    Submitted by homeowners across Telangana.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("leads")}
                  className="mt-4 text-xs font-bold text-[#245B50] hover:text-[#172321] text-left flex items-center gap-1"
                >
                  <span>Browse Job Leads</span>
                  <ArrowRight className="w-3 h-3 text-[#C5A66B]" />
                </button>
              </div>

              {/* My Quotations Counter */}
              <div className="bg-white p-5 rounded-2xl border border-[#E2DDD2] shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#6E6B65] uppercase tracking-wider">
                    My Active Quotations
                  </span>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-2xl font-extrabold text-[#172321]">
                      {quotationsStats.total}
                    </span>
                    {quotationsStats.selected > 0 && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {quotationsStats.selected} Selected!
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6E6B65] mt-1">
                    {quotationsStats.submitted} pending client review.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("quotations")}
                  className="mt-4 text-xs font-bold text-[#245B50] hover:text-[#172321] text-left flex items-center gap-1"
                >
                  <span>Manage Quotations</span>
                  <ArrowRight className="w-3 h-3 text-[#C5A66B]" />
                </button>
              </div>
            </div>

            {/* Reactive Proposal Selection Alert Card */}
            {quotationsStats.selected > 0 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-emerald-900">
                      Great News! A Homeowner Selected Your Quotation
                    </h3>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Your proposal has been selected in the homeowner comparison flow. Workflow state
                      has advanced to &ldquo;Quotation Selected&rdquo;.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("quotations")}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shrink-0 transition-colors"
                >
                  View Selected Quotation
                </button>
              </div>
            )}

            {/* Recent Leads Preview */}
            <div className="bg-white rounded-2xl border border-[#E2DDD2] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#172321]">Recent Flooring Job Leads</h3>
                  <p className="text-xs text-[#6E6B65]">
                    Real-time homeowner requirements open for craftsman quotations.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("leads")}
                  className="text-xs font-bold text-[#245B50] hover:text-[#172321] flex items-center gap-1"
                >
                  <span>View All Leads ({jobs.length})</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A66B]" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.slice(0, 2).map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-xl border border-[#E2DDD2] bg-[#FAF7F0] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white text-[#245B50] border border-[#E2DDD2]">
                          {job.workType}
                        </span>
                        <span className="text-[11px] font-semibold text-stone-600">
                          {job.areaSqFt} sq.ft
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#172321]">{job.title}</h4>
                      <p className="text-xs text-[#6E6B65] mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#245B50]" />
                        {job.location} ({job.city || "Telangana"})
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E2DDD2] flex items-center justify-between">
                      <span className="text-xs font-bold text-[#245B50]">
                        ₹{job.budgetEst?.toLocaleString("en-IN")} Est.
                      </span>
                      <button
                        onClick={() => handleOpenQuoteModal(job)}
                        className="px-3 py-1.5 rounded-lg bg-[#172321] hover:bg-[#245B50] text-white text-xs font-bold transition-colors"
                      >
                        Submit Quote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links Footer Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-[#E2DDD2] shadow-xs flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#172321]">Worker Government Schemes</h4>
                  <p className="text-xs text-[#6E6B65] mt-0.5">
                    Explore Telangana BOCWWB, PM Vishwakarma, and CSDCI RPL welfare.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("schemes")}
                  className="px-3.5 py-2 rounded-xl bg-[#245B50] text-white text-xs font-bold hover:bg-[#1A443C] shrink-0"
                >
                  View Schemes
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E2DDD2] shadow-xs flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#172321]">Skills & Portfolio</h4>
                  <p className="text-xs text-[#6E6B65] mt-0.5">
                    Showcase bookmatch photos, certifications, and equipment.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("portfolio")}
                  className="px-3.5 py-2 rounded-xl bg-[#172321] text-white text-xs font-bold hover:bg-[#245B50] shrink-0"
                >
                  Manage Portfolio
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MY PROFILE (SECTION 2 & 8)                                         */}
        {/* ========================================================================= */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E2DDD2] p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#E2DDD2]">
                <div className="flex items-start gap-4">
                  <img
                    src={workerProfile.avatarUrl}
                    alt={workerProfile.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#C5A66B]/50 shadow-xs"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-[#245B50] uppercase tracking-wider">
                      Verified Craftsman Identity
                    </span>
                    <h3 className="text-xl font-bold text-[#172321] mt-0.5">
                      {workerProfile.name}
                    </h3>
                    <p className="text-xs text-[#6E6B65] mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#245B50]" />
                      <span>
                        {workerProfile.serviceAreaNeighborhood}, {workerProfile.serviceAreaCity},
                        Telangana
                      </span>
                    </p>
                    <p className="text-xs text-[#6E6B65] mt-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#245B50]" />
                      <span>
                        {workerProfile.phoneContact} (Preference: {workerProfile.contactPreference})
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                        workerProfile.isAvailableForWork
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-stone-100 text-stone-700 border-stone-200"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {workerProfile.isAvailableForWork ? "Available for Work" : "Currently Unavailable"}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setEditProfileForm({ ...workerProfile });
                      setIsEditingProfile(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#245B50] hover:bg-[#1A443C] text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    Edit Profile Details
                  </button>
                </div>
              </div>

              {/* Skills and Experience Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div>
                  <h4 className="text-xs font-bold text-[#172321] uppercase tracking-wider mb-2">
                    Trade Specializations
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {workerProfile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-md bg-[#FAF7F0] border border-[#E2DDD2] text-xs font-medium text-[#172321]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 text-xs text-[#6E6B65] space-y-1.5">
                    <p>
                      • <strong>Trade Experience:</strong> {workerProfile.experienceYears} Years
                      active execution
                    </p>
                    <p>
                      • <strong>Labor Reference Benchmark:</strong> ₹{workerProfile.typicalSqftRate}{" "}
                      / sq.ft
                    </p>
                    <p>
                      • <strong>Preferred Contact Method:</strong>{" "}
                      {workerProfile.contactPreference.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#172321] uppercase tracking-wider mb-2">
                    Professional Introduction
                  </h4>
                  <p className="text-xs text-[#6E6B65] leading-relaxed bg-[#FAF7F0] p-3 rounded-xl border border-[#E2DDD2]">
                    {workerProfile.bio}
                  </p>

                  <h4 className="text-xs font-bold text-[#172321] uppercase tracking-wider mt-4 mb-2">
                    Equipment & Training Details
                  </h4>
                  <p className="text-xs text-[#6E6B65] leading-relaxed bg-[#FAF7F0] p-3 rounded-xl border border-[#E2DDD2]">
                    {workerProfile.equipmentTrainingDetails}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: NEARBY JOB LEADS (SECTION 3)                                       */}
        {/* ========================================================================= */}
        {activeTab === "leads" && (
          !isVerifiedWorker ? (
            <div className="py-12 bg-white rounded-3xl border border-[#E2DDD2] p-8 max-w-2xl mx-auto text-center shadow-xs space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto border border-amber-300">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-600 text-white uppercase tracking-wider">
                  Verification Required
                </span>
                <h3 className="text-xl font-bold font-serif text-[#172321] pt-1">
                  Job Leads Access Restricted
                </h3>
                <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                  {workerProfile.verificationStatus === "Rejected — Re-upload Required"
                    ? "Your labour card verification was rejected. Please re-upload your document using the form in the Overview tab to regain access."
                    : "Your document has been submitted for verification. Your worker account will become active after verification."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E2DDD2] text-xs text-left space-y-2 max-w-lg mx-auto">
                <h5 className="font-bold text-[#172321] text-[11px] uppercase tracking-wider">
                  Why is verification mandatory?
                </h5>
                <p className="text-stone-600 leading-relaxed">
                  To build homeowner trust and protect legitimate craftsmen, MESTHIRI only releases live flooring job leads and quotation bidding to verified workers whose Telangana BOCWWB or government trade cards have been audited.
                </p>
                <div className="pt-2 border-t border-[#E2DDD2] flex items-center justify-between text-[11px] text-[#245B50] font-semibold">
                  <span>Current Status: {workerProfile.verificationStatus}</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab("overview")}
                    className="hover:underline text-[#245B50] cursor-pointer"
                  >
                    View Status Details →
                  </button>
                </div>
              </div>
            </div>
          ) : (
          <div className="space-y-6">
            {/* Filter Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-[#E2DDD2] shadow-xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Search text */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#6E6B65]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search title, client, notes..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-[#FAF7F0] text-[#172321] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                  />
                </div>

                {/* City Filter */}
                <div>
                  <select
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-[#FAF7F0] text-[#172321] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                  >
                    <option value="All Cities">All Telangana Cities</option>
                    {TELANGANA_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}, Telangana
                      </option>
                    ))}
                  </select>
                </div>

                {/* Work Type Filter */}
                <div>
                  <select
                    value={filterWorkType}
                    onChange={(e) => setFilterWorkType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-[#FAF7F0] text-[#172321] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                  >
                    <option value="All Types">All Work Types</option>
                    <option value="Marble Installation">Marble Installation</option>
                    <option value="Granite Installation">Granite Installation</option>
                    <option value="Tile Installation">Tile Installation</option>
                    <option value="Floor Polishing">Floor Polishing</option>
                    <option value="Other Flooring Work">Other Flooring Work</option>
                  </select>
                </div>

                {/* Area Range Filter */}
                <div>
                  <select
                    value={filterArea}
                    onChange={(e) => setFilterArea(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-[#FAF7F0] text-[#172321] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                  >
                    <option value="All Areas">All Floor Areas</option>
                    <option value="< 500 sq.ft">&lt; 500 sq.ft</option>
                    <option value="500 - 1000 sq.ft">500 – 1,000 sq.ft</option>
                    <option value="1000+ sq.ft">1,000+ sq.ft</option>
                  </select>
                </div>
              </div>

              {/* Skills Match Toggle and Filter summary */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E2DDD2] text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-[#172321] font-semibold">
                  <input
                    type="checkbox"
                    checked={filterMatchingSkillsOnly}
                    onChange={(e) => setFilterMatchingSkillsOnly(e.target.checked)}
                    className="rounded text-[#245B50] focus:ring-[#245B50]"
                  />
                  <span>
                    Show only jobs matching my trade skills ({workerProfile.skills.join(", ")})
                  </span>
                </label>

                <div className="text-[#6E6B65]">
                  Showing <strong>{filteredJobs.length}</strong> of <strong>{jobs.length}</strong>{" "}
                  available job leads
                </div>
              </div>
            </div>

            {/* Zero State */}
            {filteredJobs.length === 0 && (
              <div className="py-12 bg-white rounded-2xl border border-[#E2DDD2] text-center p-6 max-w-lg mx-auto shadow-2xs">
                <Briefcase className="w-10 h-10 text-stone-400 mx-auto mb-2 opacity-60" />
                <h4 className="text-base font-bold text-[#172321]">
                  No Job Leads Match Your Filters
                </h4>
                <p className="text-xs text-[#6E6B65] mt-1">
                  Try clearing the city or skill filters to explore all available projects in
                  Telangana.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterCity("All Cities");
                    setFilterWorkType("All Types");
                    setFilterArea("All Areas");
                    setFilterMatchingSkillsOnly(false);
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#245B50] text-white font-semibold text-xs"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Job Leads Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredJobs.map((job) => {
                const isQuoteSubmitted = job.status === "Quotation Submitted";
                const isQuoteSelected = job.status === "Quotation Selected";

                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-[#E2DDD2] p-6 shadow-xs hover:shadow-md hover:border-[#245B50] transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#FAF7F0] text-[#245B50] border border-[#E2DDD2]">
                            {job.workType || "Flooring Work"}
                          </span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                            {job.flooringType}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                            isQuoteSelected
                              ? "bg-purple-50 text-purple-800 border-purple-200"
                              : isQuoteSubmitted
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-amber-50 text-amber-900 border-amber-200"
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>

                      {/* Title & Client */}
                      <h3 className="text-base font-bold text-[#172321] leading-snug">{job.title}</h3>
                      <p className="text-xs text-[#6E6B65] mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#245B50] shrink-0" />
                        <span>
                          {job.location} ({job.city || "Telangana"})
                        </span>
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Client: <strong>{job.homeownerName}</strong> • Space: {job.roomType}
                      </p>

                      {/* Description */}
                      <p className="text-xs text-[#6E6B65] mt-3 line-clamp-3 leading-relaxed">
                        {job.description}
                      </p>

                      {/* Metric Pills */}
                      <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2] text-xs">
                        <div>
                          <span className="text-[10px] text-stone-400 block font-medium">
                            Floor Area
                          </span>
                          <span className="font-bold text-[#172321]">{job.areaSqFt} sq.ft</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block font-medium">
                            Target Budget
                          </span>
                          <span className="font-bold text-[#245B50]">
                            {job.budgetMin && job.budgetMax
                              ? `₹${job.budgetMin.toLocaleString("en-IN")} - ₹${job.budgetMax.toLocaleString("en-IN")}`
                              : `₹${job.budgetEst?.toLocaleString("en-IN")}`}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block font-medium">
                            Materials
                          </span>
                          <span
                            className="font-semibold text-stone-800 text-[11px] truncate block"
                            title={job.materialResponsibility}
                          >
                            {job.materialResponsibility || "Client Supplied"}
                          </span>
                        </div>
                      </div>

                      {/* Schedule info */}
                      <div className="mt-3 text-[11px] text-stone-600 flex items-center justify-between">
                        <span>
                          Start: <strong>{job.preferredStartDate}</strong>
                        </span>
                        {job.expectedCompletionDate && (
                          <span>
                            Target: <strong>{job.expectedCompletionDate}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 pt-4 border-t border-[#E2DDD2] flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedJobForDetails(job)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-[#172321] bg-white border border-[#E2DDD2] hover:bg-[#FAF7F0] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#6E6B65]" />
                        <span>View Details</span>
                      </button>

                      <button
                        onClick={() => handleOpenQuoteModal(job)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#172321] hover:bg-[#245B50] transition-colors shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5 text-[#C5A66B]" />
                        <span>Submit Itemized Quotation</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          )
        )}

        {/* ========================================================================= */}
        {/* TAB 4: MY QUOTATIONS (SECTION 5)                                          */}
        {/* ========================================================================= */}
        {activeTab === "quotations" && (
          <div className="space-y-6">
            {/* Filter bar for Quotations */}
            <div className="bg-white p-4 rounded-2xl border border-[#E2DDD2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-[#172321]">Quotation Management</h3>
                <p className="text-xs text-[#6E6B65]">
                  Track status of submitted proposals across homeowner projects.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {["All", "Submitted", "Selected", "Withdrawn"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setQuoteStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      quoteStatusFilter === st
                        ? "bg-[#245B50] text-white shadow-xs"
                        : "bg-[#FAF7F0] text-[#6E6B65] hover:text-[#172321]"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Zero state */}
            {myQuotations.length === 0 && (
              <div className="py-12 bg-white rounded-2xl border border-[#E2DDD2] text-center p-6 max-w-lg mx-auto shadow-2xs">
                <FileCheck2 className="w-10 h-10 text-stone-400 mx-auto mb-2 opacity-60" />
                <h4 className="text-base font-bold text-[#172321]">No Quotations Found</h4>
                <p className="text-xs text-[#6E6B65] mt-1">
                  You have not submitted quotations under this filter status yet.
                </p>
                <button
                  onClick={() => setActiveTab("leads")}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#245B50] text-white font-semibold text-xs"
                >
                  Browse Job Leads & Submit Proposal
                </button>
              </div>
            )}

            {/* Quotations List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {myQuotations.map((quote) => {
                const isSelected = quote.status === "Quotation Selected";
                const isWithdrawn = quote.status === "Withdrawn";

                return (
                  <div
                    key={quote.id}
                    className={`bg-white rounded-2xl border p-6 shadow-xs flex flex-col justify-between transition-all ${
                      isSelected
                        ? "border-emerald-500 ring-2 ring-emerald-500/20"
                        : isWithdrawn
                        ? "border-stone-300 opacity-70"
                        : "border-[#E2DDD2]"
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FAF7F0] text-[#172321] border border-[#E2DDD2]">
                          Job ID: #{quote.jobId.slice(-6)}
                        </span>

                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                            isSelected
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : isWithdrawn
                              ? "bg-stone-100 text-stone-600 border-stone-300"
                              : "bg-blue-50 text-blue-800 border-blue-200"
                          }`}
                        >
                          {quote.status}
                        </span>
                      </div>

                      {/* Header */}
                      <h4 className="text-base font-bold text-[#172321]">
                        Quotation for {quote.workerSkills?.join(" / ") || "Flooring Installation"}
                      </h4>
                      <p className="text-xs text-[#6E6B65] mt-0.5">
                        Submitted: {quote.submittedAt} • Validity: {quote.validityPeriodDays} Days
                      </p>

                      {/* Grand Total Highlight */}
                      <div className="my-4 p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold block">
                            Quoted Grand Total
                          </span>
                          <span className="text-xl font-extrabold text-[#245B50]">
                            ₹{quote.grandTotal?.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-stone-500 block">Est. Duration</span>
                          <span className="text-xs font-bold text-[#172321]">
                            {quote.durationDays} Working Days
                          </span>
                        </div>
                      </div>

                      {/* Itemized Breakdown Pills */}
                      <div className="grid grid-cols-3 gap-2 text-[11px] p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-700">
                        <div>
                          <span className="text-stone-400 block text-[9px] uppercase font-bold">
                            Labor
                          </span>
                          <span className="font-semibold">
                            ₹{quote.laborTotal?.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[9px] uppercase font-bold">
                            Material
                          </span>
                          <span className="font-semibold">
                            {quote.isMaterialSuppliedByWorker
                              ? `₹${quote.materialCost?.toLocaleString("en-IN")}`
                              : "Client Supplied"}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[9px] uppercase font-bold">
                            Transport &amp; Misc
                          </span>
                          <span className="font-semibold">
                            ₹{(quote.transportCharges + quote.additionalCharges).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-600 mt-3 line-clamp-2 italic">
                        &ldquo;{quote.comments}&rdquo;
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 pt-4 border-t border-[#E2DDD2] flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedQuoteForDetails(quote)}
                        className="text-xs font-bold text-[#245B50] hover:text-[#172321] flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#C5A66B]" />
                        <span>View Breakdown</span>
                      </button>

                      {!isWithdrawn && !isSelected && onWithdrawQuote && (
                        <button
                          onClick={() => onWithdrawQuote(quote.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors"
                        >
                          Withdraw Quote
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SKILLS & PORTFOLIO (SECTION 6)                                     */}
        {/* ========================================================================= */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            {/* Certifications & Training Section */}
            <div className="bg-white rounded-2xl border border-[#E2DDD2] p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <span className="text-[10px] font-bold text-[#245B50] uppercase tracking-wider">
                    Certifications &amp; Credentials
                  </span>
                  <h3 className="text-base font-bold text-[#172321]">
                    Verified &amp; Declared Qualifications
                  </h3>
                  <p className="text-xs text-[#6E6B65]">
                    Official credentials from CSDCI, Skill India, and regional guilds.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddCertForm(!showAddCertForm)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2] hover:bg-white text-xs font-bold text-[#172321] flex items-center gap-1.5 self-start"
                >
                  <Plus className="w-3.5 h-3.5 text-[#245B50]" />
                  <span>Add Certificate</span>
                </button>
              </div>

              {/* Add Certificate Mini Form */}
              {showAddCertForm && (
                <form
                  onSubmit={handleAddCertification}
                  className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2] mb-4 space-y-3"
                >
                  <h4 className="text-xs font-bold text-[#172321]">Add a Professional Certificate</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Certificate Title"
                      value={newCertTitle}
                      onChange={(e) => setNewCertTitle(e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-[#E2DDD2] bg-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Issuing Authority"
                      value={newCertOrg}
                      onChange={(e) => setNewCertOrg(e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-[#E2DDD2] bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Year (e.g. 2024)"
                      value={newCertYear}
                      onChange={(e) => setNewCertYear(e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-[#E2DDD2] bg-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCertForm(false)}
                      className="px-3 py-1 rounded text-xs text-stone-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded bg-[#245B50] text-white text-xs font-bold"
                    >
                      Save Certificate
                    </button>
                  </div>
                </form>
              )}

              {/* Certificates List */}
              <div className="space-y-3">
                {workerProfile.certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-3.5 rounded-xl border border-[#E2DDD2] bg-[#FAF7F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          cert.verified
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#172321]">{cert.title}</h4>
                        <p className="text-[11px] text-[#6E6B65] mt-0.5">
                          {cert.issuingOrg} • {cert.year}
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      {cert.verified ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Verified Credential
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                          Provided by worker — not independently verified
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio Photos Gallery */}
            <div className="bg-white rounded-2xl border border-[#E2DDD2] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] font-bold text-[#245B50] uppercase tracking-wider">
                    Installation Portfolio
                  </span>
                  <h3 className="text-base font-bold text-[#172321]">
                    Demonstration Project Photos
                  </h3>
                  <p className="text-xs text-[#6E6B65]">
                    High-resolution showcases of bookmatched Statuario and vitrified floor laying.
                  </p>
                </div>
                <span className="text-[11px] text-[#6E6B65] font-medium">
                  {workerProfile.portfolioPhotos.length} Photos Listed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {workerProfile.portfolioPhotos.map((url, i) => (
                  <div
                    key={i}
                    className="relative rounded-xl overflow-hidden border border-[#E2DDD2] group aspect-[4/3] bg-black"
                  >
                    <img
                      src={url}
                      alt={`Portfolio project ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                      <span className="text-[10px] font-medium text-stone-200">
                        Illustrative Sample Installation #{i + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools & Equipment Details */}
            <div className="bg-white rounded-2xl border border-[#E2DDD2] p-6 shadow-xs">
              <h3 className="text-base font-bold text-[#172321] mb-1">
                Precision Equipment &amp; Quality Tools
              </h3>
              <p className="text-xs text-[#6E6B65] mb-4">
                Tools operated per IS 1443 laser datum tolerances.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {workerProfile.toolsEquipment.map((tool, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2] flex items-center gap-2.5"
                  >
                    <Wrench className="w-4 h-4 text-[#245B50] shrink-0" />
                    <span className="text-xs font-semibold text-[#172321]">{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: GOVERNMENT SCHEMES (SECTION 7)                                     */}
        {/* ========================================================================= */}
        {activeTab === "schemes" && (
          <div className="space-y-6">
            {/* Header & Transparency Notice */}
            <div className="bg-white rounded-2xl border border-[#E2DDD2] p-6 shadow-xs">
              <div className="flex items-start gap-3 mb-3">
                <ShieldCheck className="w-6 h-6 text-[#245B50] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-[#172321] font-serif">
                    Government Welfare &amp; Skill Schemes for Flooring Craftsmen
                  </h3>
                  <p className="text-xs text-[#6E6B65] mt-1 leading-relaxed">
                    Verified central and Telangana government schemes offering toolkit incentives,
                    accidental insurance, subsidized credit, and national RPL certifications for construction labor.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Official Verification Disclosure:</strong> Eligibility, enrollment, and
                  disbursements are handled directly by the administering government departments.
                  MESTHIRI provides factual reference details and official portal links only.
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#E2DDD2] flex-wrap">
                <span className="text-xs font-bold text-stone-700">Filter by Type:</span>
                {["All", "Credit & Toolkits", "Welfare", "Skill Certification", "Social Security", "Healthcare"].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => setSchemeCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        schemeCategoryFilter === cat
                          ? "bg-[#245B50] text-white"
                          : "bg-[#FAF7F0] text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Schemes Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredSchemes.map((scheme) => (
                <div
                  key={scheme.id}
                  className="bg-white rounded-2xl border border-[#E2DDD2] p-6 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FAF7F0] text-[#245B50] border border-[#E2DDD2]">
                        {scheme.level}
                      </span>
                      <span className="text-[10px] font-semibold text-stone-500">
                        {scheme.category}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#172321]">{scheme.title}</h4>
                    <p className="text-xs text-stone-500 mt-0.5">{scheme.department}</p>
                    <p className="text-xs text-[#6E6B65] mt-2.5 leading-relaxed">
                      {scheme.description}
                    </p>

                    {/* Key Benefits Checklist */}
                    <div className="mt-4 pt-3 border-t border-[#E2DDD2] space-y-1.5">
                      <span className="text-[10px] font-bold text-[#172321] uppercase tracking-wider block">
                        Key Benefits:
                      </span>
                      {scheme.keyBenefits.slice(0, 3).map((b, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-stone-700">
                          <Check className="w-3.5 h-3.5 text-[#245B50] shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>

                    {/* Required Documents */}
                    <div className="mt-3 text-[11px] text-stone-500">
                      <strong>Documents:</strong> {scheme.requiredDocuments.join(", ")}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#E2DDD2] flex items-center justify-between">
                    <span className="text-[11px] font-medium text-stone-600">
                      Mode: {scheme.applicationMode}
                    </span>
                    <a
                      href={scheme.officialPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#245B50] hover:text-[#172321]"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#C5A66B]" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ITEMISED QUOTATION BUILDER (SECTION 4)                           */}
      {/* ========================================================================= */}
      {selectedJobForQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#E2DDD2] shadow-2xl p-6 sm:p-8 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-[#E2DDD2]">
              <div>
                <span className="text-[10px] font-bold text-[#245B50] uppercase tracking-wider">
                  Contractor Workstation
                </span>
                <h3 className="text-xl font-bold text-[#172321] font-serif">
                  Submit Itemized Quotation
                </h3>
                <p className="text-xs text-[#6E6B65] mt-0.5">
                  Job #{selectedJobForQuote.id.slice(-6)}: {selectedJobForQuote.title} (
                  {selectedJobForQuote.areaSqFt} sq.ft)
                </p>
              </div>
              <button
                onClick={() => setSelectedJobForQuote(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-4 pt-4">
              {/* Calculation Mode */}
              <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2]">
                <button
                  type="button"
                  onClick={() => setCalcMode("per_sqft")}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    calcMode === "per_sqft"
                      ? "bg-[#245B50] text-white shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Rate Per Sq.Ft (₹{ratePerSqFt}/sq.ft)
                </button>
                <button
                  type="button"
                  onClick={() => setCalcMode("fixed")}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    calcMode === "fixed"
                      ? "bg-[#245B50] text-white shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Fixed Lump-Sum Labor
                </button>
              </div>

              {/* Rate Inputs */}
              {calcMode === "per_sqft" ? (
                <div>
                  <label className="block text-xs font-semibold text-[#172321] mb-1">
                    Labor Rate per Sq.Ft (INR)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={500}
                    value={ratePerSqFt}
                    onChange={(e) => setRatePerSqFt(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                  />
                  <span className="text-[10px] text-stone-500 mt-1 block">
                    Calculated Labor: {selectedJobForQuote.areaSqFt} sq.ft × ₹{ratePerSqFt} = ₹
                    {calculatedLaborTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-[#172321] mb-1">
                    Fixed Total Labor Amount (INR)
                  </label>
                  <input
                    type="number"
                    min={1000}
                    value={fixedLaborAmount}
                    onChange={(e) => setFixedLaborAmount(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                  />
                </div>
              )}

              {/* Material Responsibility Checkbox */}
              <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2]">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#172321]">
                  <input
                    type="checkbox"
                    checked={isMaterialSupplied}
                    onChange={(e) => setIsMaterialSupplied(e.target.checked)}
                    className="rounded text-[#245B50]"
                  />
                  <span>Worker supplies tile/marble materials (Turnkey)</span>
                </label>
                {selectedJobForQuote.materialResponsibility === "Homeowner supplies materials" && (
                  <p className="text-[11px] text-amber-800 mt-1">
                    Notice: Homeowner marked &ldquo;Homeowner supplies materials&rdquo;. Labor-only
                    quotation recommended.
                  </p>
                )}
                {isMaterialSupplied && (
                  <div className="mt-2.5">
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Estimated Material Cost (INR)
                    </label>
                    <input
                      type="number"
                      value={materialCost}
                      onChange={(e) => setMaterialCost(Number(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E2DDD2] bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Transport & Additional Charges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172321] mb-1">
                    Transport &amp; Cartage (INR)
                  </label>
                  <input
                    type="number"
                    value={transportCharges}
                    onChange={(e) => setTransportCharges(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172321] mb-1">
                    Estimated Working Days
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172321] mb-1">
                  Additional Equipment / Diamond Polishing Charges (INR)
                </label>
                <input
                  type="number"
                  value={additionalCharges}
                  onChange={(e) => setAdditionalCharges(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-white"
                />
                <input
                  type="text"
                  value={additionalChargesExplanation}
                  onChange={(e) => setAdditionalChargesExplanation(e.target.value)}
                  placeholder="Explanation for additional charges"
                  className="w-full mt-1.5 px-3 py-1.5 text-xs rounded-lg border border-[#E2DDD2] bg-white text-stone-600"
                />
              </div>

              {/* Scope Checklist */}
              <div>
                <label className="block text-xs font-semibold text-[#172321] mb-1">
                  Included in Scope
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                  {defaultWorkIncluded.map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-1.5 p-1.5 rounded bg-stone-50 border border-stone-200"
                    >
                      <input
                        type="checkbox"
                        checked={workIncluded.includes(item)}
                        onChange={() => {
                          setWorkIncluded((prev) =>
                            prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
                          );
                        }}
                        className="rounded text-[#245B50]"
                      />
                      <span className="text-[11px] truncate">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quotation Breakdown Summary Box */}
              <div className="p-4 rounded-2xl bg-[#172321] text-white">
                <span className="text-[10px] font-bold text-[#C5A66B] uppercase tracking-wider block">
                  Grand Total Quotation Summary
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-extrabold text-[#FAF7F0]">
                    ₹{calculatedGrandTotal.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-stone-300">
                    Est. Duration: {durationDays} Days
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-stone-700 text-[11px] text-stone-400 flex flex-wrap justify-between gap-2">
                  <span>Labor: ₹{calculatedLaborTotal.toLocaleString("en-IN")}</span>
                  <span>
                    Material:{" "}
                    {isMaterialSupplied ? `₹${activeMaterialCost.toLocaleString("en-IN")}` : "₹0 (Client)"}
                  </span>
                  <span>Transport: ₹{transportCharges.toLocaleString("en-IN")}</span>
                  <span>Equipment: ₹{additionalCharges.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2DDD2] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedJobForQuote(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#245B50] hover:bg-[#1A443C] text-white font-bold text-xs shadow-md"
                >
                  Confirm &amp; Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: JOB DETAILS MODAL                                                */}
      {/* ========================================================================= */}
      {selectedJobForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#E2DDD2] shadow-2xl p-6 sm:p-8">
            <div className="flex items-start justify-between pb-4 border-b border-[#E2DDD2]">
              <div>
                <span className="text-[10px] font-bold text-[#245B50] uppercase tracking-wider">
                  Requirement Details
                </span>
                <h3 className="text-lg font-bold text-[#172321]">{selectedJobForDetails.title}</h3>
              </div>
              <button
                onClick={() => setSelectedJobForDetails(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-4 text-xs">
              <p className="text-stone-700 leading-relaxed">{selectedJobForDetails.description}</p>
              <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-500">Location:</span>
                  <span className="font-bold text-stone-900">
                    {selectedJobForDetails.location} ({selectedJobForDetails.city})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Floor Area:</span>
                  <span className="font-bold text-stone-900">{selectedJobForDetails.areaSqFt} sq.ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Material Choice:</span>
                  <span className="font-bold text-stone-900">{selectedJobForDetails.flooringType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Material Supply:</span>
                  <span className="font-bold text-stone-900">
                    {selectedJobForDetails.materialResponsibility}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Preferred Start:</span>
                  <span className="font-bold text-stone-900">
                    {selectedJobForDetails.preferredStartDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2DDD2] flex justify-end gap-2 mt-4">
              <button
                onClick={() => setSelectedJobForDetails(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const job = selectedJobForDetails;
                  setSelectedJobForDetails(null);
                  handleOpenQuoteModal(job);
                }}
                className="px-4 py-2 rounded-xl bg-[#245B50] text-white text-xs font-bold"
              >
                Submit Quotation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: QUOTATION ITEMISED BREAKDOWN VIEW                                */}
      {/* ========================================================================= */}
      {selectedQuoteForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#E2DDD2] shadow-2xl p-6 sm:p-8">
            <div className="flex items-start justify-between pb-4 border-b border-[#E2DDD2]">
              <div>
                <span className="text-[10px] font-bold text-[#245B50] uppercase tracking-wider">
                  Proposal Breakdown
                </span>
                <h3 className="text-lg font-bold text-[#172321]">
                  Quotation #{selectedQuoteForDetails.id.slice(-6)}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuoteForDetails(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#172321] text-white flex justify-between items-center">
                <span className="text-xs text-stone-300">Total Quoted Amount</span>
                <span className="text-xl font-bold text-[#C5A66B]">
                  ₹{selectedQuoteForDetails.grandTotal?.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2] space-y-1.5">
                <div className="flex justify-between">
                  <span>Labor Charges:</span>
                  <span className="font-bold">
                    ₹{selectedQuoteForDetails.laborTotal?.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Material Costs:</span>
                  <span className="font-bold">
                    {selectedQuoteForDetails.isMaterialSuppliedByWorker
                      ? `₹${selectedQuoteForDetails.materialCost?.toLocaleString("en-IN")}`
                      : "Client Supplied"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Transport:</span>
                  <span className="font-bold">
                    ₹{selectedQuoteForDetails.transportCharges?.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Additional Charges:</span>
                  <span className="font-bold">
                    ₹{selectedQuoteForDetails.additionalCharges?.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#E2DDD2] pt-1">
                  <span>Estimated Duration:</span>
                  <span className="font-bold">{selectedQuoteForDetails.durationDays} Days</span>
                </div>
              </div>

              {selectedQuoteForDetails.workIncluded && (
                <div>
                  <span className="font-bold text-stone-800 block mb-1">Included Scope:</span>
                  <div className="space-y-1 text-stone-600">
                    {selectedQuoteForDetails.workIncluded.map((inc, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#245B50]" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#E2DDD2] flex justify-end mt-4">
              <button
                onClick={() => setSelectedQuoteForDetails(null)}
                className="px-4 py-2 rounded-xl bg-[#172321] text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: EDIT PROFILE MODAL                                               */}
      {/* ========================================================================= */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-[#E2DDD2] shadow-2xl p-6 sm:p-8 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-[#E2DDD2]">
              <div>
                <span className="text-[10px] font-bold text-[#245B50] uppercase tracking-wider">
                  Profile Editor
                </span>
                <h3 className="text-xl font-bold text-[#172321] font-serif">
                  Edit Craftsman Profile
                </h3>
              </div>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#172321] mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={editProfileForm.name}
                    onChange={(e) =>
                      setEditProfileForm({ ...editProfileForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172321] mb-1">
                    Operating City
                  </label>
                  <select
                    value={editProfileForm.serviceAreaCity}
                    onChange={(e) =>
                      setEditProfileForm({ ...editProfileForm, serviceAreaCity: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-white"
                  >
                    {TELANGANA_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}, Telangana
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172321] mb-1">
                  Service Area / Neighborhoods
                </label>
                <input
                  type="text"
                  value={editProfileForm.serviceAreaNeighborhood}
                  onChange={(e) =>
                    setEditProfileForm({
                      ...editProfileForm,
                      serviceAreaNeighborhood: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#172321] mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editProfileForm.experienceYears}
                    onChange={(e) =>
                      setEditProfileForm({
                        ...editProfileForm,
                        experienceYears: Number(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172321] mb-1">
                    Benchmark Rate (₹/sq.ft)
                  </label>
                  <input
                    type="number"
                    min={10}
                    value={editProfileForm.typicalSqftRate}
                    onChange={(e) =>
                      setEditProfileForm({
                        ...editProfileForm,
                        typicalSqftRate: Number(e.target.value) || 50,
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172321] mb-1">
                  Introduction / Bio
                </label>
                <textarea
                  rows={3}
                  value={editProfileForm.bio}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, bio: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172321] mb-1">
                  Equipment &amp; Training Details
                </label>
                <textarea
                  rows={2}
                  value={editProfileForm.equipmentTrainingDetails}
                  onChange={(e) =>
                    setEditProfileForm({
                      ...editProfileForm,
                      equipmentTrainingDetails: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-white"
                />
              </div>

              <div className="pt-3 border-t border-[#E2DDD2] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 text-xs text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#245B50] text-white font-bold text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
