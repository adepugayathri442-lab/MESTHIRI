"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Worker,
  FlooringCategory,
  PublicBusinessPlace,
  RegisteredWorkerProfile,
  LabourDocumentCategory,
  TELANGANA_CITIES,
} from "@/types";
import {
  MapPin,
  FileCheck2,
  Info,
  UserPlus,
  ShieldCheck,
  CheckCircle,
  X,
  ExternalLink,
  Phone,
  Globe,
  Star,
  RefreshCw,
  Building2,
  Navigation,
  AlertCircle,
  Briefcase,
  Search,
  Clock,
  FileText,
  Upload,
  Compass,
  Award,
  Store,
  ShieldAlert,
  Check,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

interface WorkerDirectoryProps {
  onSelectWorker?: (worker: Worker) => void;
  onRequestQuote: (worker: Worker) => void;
  onOpenCompare: () => void;
  searchFilterCategory?: string;
  onWorkerRegistered?: (worker: RegisteredWorkerProfile) => void;
  externalRegisterOpen?: boolean;
  onCloseExternalRegister?: () => void;
}

export const WorkerDirectory: React.FC<WorkerDirectoryProps> = ({
  onSelectWorker,
  onRequestQuote,
  onOpenCompare,
  searchFilterCategory = "All Categories",
  onWorkerRegistered,
  externalRegisterOpen,
  onCloseExternalRegister,
}) => {
  // Navigation Tabs: Registered Workers, Nearby Locality Discovery, Google Places Enterprises, Verification Standards
  const [activeTab, setActiveTab] = useState<
    "registered-workers" | "nearby-discovery" | "public-directory" | "verification-tiers"
  >("registered-workers");

  const [selectedCity, setSelectedCity] = useState<string>("All Cities");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchFilterCategory);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [minExpFilter, setMinExpFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"experience" | "rate_low" | "rate_high">("experience");

  // Geolocation & Nearby Matching State
  const [userLocationDetected, setUserLocationDetected] = useState<boolean>(false);
  const [detectedLocality, setDetectedLocality] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);

  // Registered Workers State (From /api/workers - strictly approved profiles)
  const [registeredWorkers, setRegisteredWorkers] = useState<RegisteredWorkerProfile[]>([]);
  const [workersStatus, setWorkersStatus] = useState<"IDLE" | "LOADING" | "OK" | "ZERO_RESULTS" | "ERROR">("IDLE");
  const [workersMessage, setWorkersMessage] = useState<string>("");

  // Google Places API State (From /api/places)
  const [places, setPlaces] = useState<PublicBusinessPlace[]>([]);
  const [placesStatus, setPlacesStatus] = useState<"IDLE" | "LOADING" | "OK" | "API_KEY_REQUIRED" | "ZERO_RESULTS" | "ERROR">("IDLE");
  const [placesMessage, setPlacesMessage] = useState<string>("");
  const [placesAttribution, setPlacesAttribution] = useState<string>("Powered by Google");

  // Modals
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);
  const [selectedPublicPlace, setSelectedPublicPlace] = useState<PublicBusinessPlace | null>(null);
  const [selectedRegisteredWorker, setSelectedRegisteredWorker] = useState<RegisteredWorkerProfile | null>(null);

  // Registration Form State
  const [regForm, setRegForm] = useState({
    name: "",
    serviceAreaState: "Telangana",
    serviceAreaCity: "Hyderabad",
    serviceAreaNeighborhood: "",
    phoneContact: "",
    emailContact: "",
    skills: ["Italian Marble"] as FlooringCategory[],
    experienceYears: 8,
    typicalSqftRate: 75,
    languages: ["Telugu", "Hindi"],
    isAvailableForWork: true,
    portfolioNotes: "",
    avatarUrl: "",
    documentCategory: "Telangana BOCWWB Construction Worker Card" as LabourDocumentCategory,
    issuingState: "Telangana",
    documentNumber: "",
    uploadedFile: null as { name: string; sizeKb: number; type: string } | null,
    consentAgreed: false,
  });
  const [regSubmitting, setRegSubmitting] = useState<boolean>(false);
  const [regError, setRegError] = useState<string>("");

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

  const categories: string[] = [
    "All Categories",
    "Italian Marble",
    "Indian Marble",
    "Black Galaxy Granite",
    "Granite",
    "Vitrified Tiles",
    "Ceramic Tiles",
    "Terrazzo / Mosaic",
    "Adhesives & Grout",
    "Flooring Polish & Accessories",
  ];

  // Helper to convert registered worker to Worker model for quote modal
  const toWorker = (rw: RegisteredWorkerProfile): Worker => ({
    id: rw.id,
    name: rw.name,
    title: rw.skills && rw.skills.length > 0
      ? `${rw.skills.join(" & ")} Craftsman`
      : `${rw.experienceYears || 0} Years Experienced Flooring Craftsman`,
    experienceYears: rw.experienceYears || 0,
    verificationStatus: rw.verificationStatus || "Pending Verification",
    verificationBadges: rw.verificationStatus === "Verified" ? ["Verified"] : [],
    locationArea: rw.serviceAreaNeighborhood || rw.serviceAreaCity || "Telangana",
    location: `${rw.serviceAreaCity || "Telangana"}, ${rw.serviceAreaState || "India"}`,
    serviceAreaCity: rw.serviceAreaCity || "Hyderabad",
    phoneContact: rw.phoneContact || "Contact via platform",
    languages: rw.languages || ["Telugu", "Hindi"],
    skills: rw.skills || [],
    typicalSqftRate: rw.typicalSqftRate || 75,
    dailyRate: rw.typicalSqftRate ? rw.typicalSqftRate * 15 : 1200,
    sqftRate: rw.typicalSqftRate || 75,
    about: rw.portfolioNotes || "Professional flooring craftsman registered on MESTHIRI.",
    rating: rw.rating || 0,
    reviewCount: rw.reviewCount || 0,
    completedJobs: rw.completedJobs || 0,
    avatarUrl: rw.avatarUrl || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80",
    portfolioImages: rw.portfolioPhotos || [],
    availableNotice: rw.isAvailableForWork !== false ? "Available for projects" : "Currently unavailable",
    specializationBadges: rw.skills || [],
    isSampleProfile: false,
    source: rw.source || "Registered on MESTHIRI",
  });

  // Fetch approved registered workers from /api/workers
  const fetchRegisteredWorkers = async (city: string, category: string, search: string) => {
    setWorkersStatus("LOADING");
    try {
      const params = new URLSearchParams();
      if (city && city !== "All Cities" && city !== "All Telangana") {
        params.append("city", city);
      }
      if (category && category !== "All Categories") {
        params.append("category", category);
      }
      if (search.trim()) {
        params.append("search", search.trim());
      }

      const res = await fetch(`/api/workers?${params.toString()}`);
      const data = await res.json();

      if (data.status === "OK") {
        setRegisteredWorkers(data.results || []);
        setWorkersStatus("OK");
        setWorkersMessage(data.message || "");
      } else if (data.status === "ZERO_RESULTS" || (data.results && data.results.length === 0)) {
        setRegisteredWorkers([]);
        setWorkersStatus("ZERO_RESULTS");
        setWorkersMessage("No registered workers yet. Be the first skilled professional to join MESTHIRI.");
      } else {
        setRegisteredWorkers([]);
        setWorkersStatus("ERROR");
        setWorkersMessage(data.message || "Failed to retrieve registered workers.");
      }
    } catch {
      setRegisteredWorkers([]);
      setWorkersStatus("ZERO_RESULTS");
      setWorkersMessage("No registered workers yet. Be the first skilled professional to join MESTHIRI.");
    }
  };

  // Fetch public Google Places listings
  const fetchPlaces = async (city: string) => {
    setPlacesStatus("LOADING");
    try {
      const queryCity = city === "All Cities" ? "Hyderabad" : city;
      const res = await fetch(`/api/places?city=${encodeURIComponent(queryCity)}`);
      const data = await res.json();
      setPlacesStatus(data.status);
      setPlacesMessage(data.message || "");
      setPlaces(data.results || []);
      if (data.attribution) {
        setPlacesAttribution(data.attribution);
      }
    } catch {
      setPlacesStatus("ERROR");
      setPlacesMessage("Network error occurred while fetching public places.");
    }
  };

  // Data synchronization
  useEffect(() => {
    fetchRegisteredWorkers(selectedCity, selectedCategory, searchQuery);
  }, [selectedCity, selectedCategory, searchQuery]);

  useEffect(() => {
    if (activeTab === "public-directory") {
      fetchPlaces(selectedCity);
    }
  }, [activeTab, selectedCity]);

  useEffect(() => {
    if (externalRegisterOpen) {
      setIsRegisterModalOpen(true);
      setRegisterSuccess(false);
    }
  }, [externalRegisterOpen]);

  const handleCloseRegisterModal = () => {
    setIsRegisterModalOpen(false);
    if (onCloseExternalRegister) {
      onCloseExternalRegister();
    }
  };

  const handleFillDemoTestData = () => {
    setRegForm({
      name: "[TEST] Demo Craftsman",
      serviceAreaState: "Telangana",
      serviceAreaCity: "Hyderabad",
      serviceAreaNeighborhood: "Kukatpally (Demo Test Locality)",
      phoneContact: "+91 99999 00000",
      emailContact: "demo.craftsman.test@mesthiri.internal",
      skills: ["Italian Marble", "Granite", "Vitrified Tiles"],
      experienceYears: 8,
      typicalSqftRate: 75,
      languages: ["Telugu", "Hindi"],
      isAvailableForWork: true,
      portfolioNotes: "[TEST PROFILE] Professional stone craftsman archetype populated for validation testing. Real document storage is not production-ready; this safe test record will remain in 'Pending Verification' and will NOT appear in the genuine public directory.",
      avatarUrl: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80",
      documentCategory: "Telangana BOCWWB Construction Worker Card",
      issuingState: "Telangana",
      documentNumber: "TG-TEST-BOCW-2025-DEMO",
      uploadedFile: {
        name: "demo_test_bocwwb_card.pdf",
        sizeKb: 340,
        type: "application/pdf",
      },
      consentAgreed: true,
    });
    setRegError("");
  };

  // Handle document file upload (max 5MB)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setRegError("Document exceeds the maximum permitted 5MB file size limit.");
      return;
    }

    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      setRegError("Accepted file formats are PDF, JPG, PNG, or WEBP.");
      return;
    }

    setRegError("");
    setRegForm((prev) => ({
      ...prev,
      uploadedFile: {
        name: file.name,
        sizeKb: Math.round(file.size / 1024),
        type: file.type,
      },
    }));
  };

  // Submit worker registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!regForm.consentAgreed) {
      setRegError("Please confirm your voluntary consent to publish your trade profile on MESTHIRI.");
      return;
    }

    if (!regForm.name.trim() || regForm.name.trim().length < 2) {
      setRegError("Full legal name is required (minimum 2 characters).");
      return;
    }

    if (!regForm.phoneContact.trim() || regForm.phoneContact.trim().length < 10) {
      setRegError("Valid 10-digit mobile contact number is required.");
      return;
    }

    if (regForm.skills.length === 0) {
      setRegError("Please select at least one flooring trade skill.");
      return;
    }

    setRegSubmitting(true);
    try {
      const payload = {
        name: regForm.name.trim(),
        serviceAreaState: regForm.serviceAreaState,
        serviceAreaCity: regForm.serviceAreaCity,
        serviceAreaNeighborhood: regForm.serviceAreaNeighborhood.trim() || undefined,
        phoneContact: regForm.phoneContact.trim(),
        emailContact: regForm.emailContact.trim() || undefined,
        skills: regForm.skills,
        experienceYears: Number(regForm.experienceYears) || 1,
        typicalSqftRate: Number(regForm.typicalSqftRate) || 75,
        portfolioNotes: regForm.portfolioNotes.trim() || "Skilled flooring craftsman registered on MESTHIRI.",
        avatarUrl: regForm.avatarUrl.trim() || undefined,
        languages: regForm.languages,
        isAvailableForWork: regForm.isAvailableForWork,
        labourDocument: regForm.uploadedFile
          ? {
              documentCategory: regForm.documentCategory,
              issuingState: regForm.issuingState,
              documentNumber: regForm.documentNumber.trim() || undefined,
              fileName: regForm.uploadedFile.name,
              fileSizeKb: regForm.uploadedFile.sizeKb,
              fileType: regForm.uploadedFile.type,
            }
          : undefined,
      };

      const res = await fetch("/api/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.status === "CREATED") {
        setRegisterSuccess(true);
        if (onWorkerRegistered && data.worker) {
          onWorkerRegistered(data.worker);
        }
      } else {
        setRegError(data.message || "Failed to submit worker registration. Please check inputs.");
      }
    } catch {
      setRegError("Network error occurred while submitting worker registration.");
    } finally {
      setRegSubmitting(false);
    }
  };

  const handleToggleSkill = (skill: FlooringCategory) => {
    setRegForm((prev) => {
      const exists = prev.skills.includes(skill);
      if (exists) {
        return { ...prev, skills: prev.skills.filter((s) => s !== skill) };
      } else {
        return { ...prev, skills: [...prev.skills, skill] };
      }
    });
  };

  // Filter and sort registered workers
  const filteredWorkers = useMemo(() => {
    let list = [...registeredWorkers];

    if (minExpFilter > 0) {
      list = list.filter((w) => (w.experienceYears || 0) >= minExpFilter);
    }

    if (sortBy === "experience") {
      list.sort((a, b) => (b.experienceYears || 0) - (a.experienceYears || 0));
    } else if (sortBy === "rate_low") {
      list.sort((a, b) => (a.typicalSqftRate || 999) - (b.typicalSqftRate || 999));
    } else if (sortBy === "rate_high") {
      list.sort((a, b) => (b.typicalSqftRate || 0) - (a.typicalSqftRate || 0));
    }

    return list;
  }, [registeredWorkers, minExpFilter, sortBy]);

  // Privacy-conscious location detection (Ask permission ONLY on click)
  const handleDetectLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocationNotice("Geolocation is not supported by your browser. Please select your locality manually.");
      setTimeout(() => setLocationNotice(null), 5000);
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationLoading(false);
        setUserLocationDetected(true);
        const lat = pos.coords.latitude;
        let cluster = "Hyderabad";
        if (lat > 17.8) cluster = "Warangal";
        if (lat > 18.3) cluster = "Karimnagar";
        if (lat < 17.0) cluster = "Mahbubnagar";
        setDetectedLocality(cluster);
        setSelectedCity(cluster);
        setLocationNotice(`Approximate locality matched: ${cluster}, Telangana. Displaying local craftsmen.`);
        setTimeout(() => setLocationNotice(null), 5000);
      },
      () => {
        setLocationLoading(false);
        setUserLocationDetected(false);
        setLocationNotice(
          "Location permission denied. You can select your locality or service district manually below without live GPS."
        );
        setTimeout(() => setLocationNotice(null), 6000);
      },
      { timeout: 7000 }
    );
  };

  return (
    <section id="workers-section" className="py-12 bg-[#FAF7F0] border-b border-[#E2DDD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#E2DDD2] gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#245B50]/10 text-[#245B50] font-bold text-xs uppercase tracking-wider mb-2 border border-[#245B50]/20">
              <Briefcase className="w-3.5 h-3.5 text-[#245B50]" />
              Authentic Craftsmen Directory
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172321] tracking-tight font-serif">
              Skilled Flooring Craftsmen & Contractors
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6B65] mt-1 max-w-2xl leading-relaxed">
              Find genuine registered marble masons, granite workers, and tile installers. MESTHIRI does not fabricate profiles, ratings, or completed job counts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setRegisterSuccess(false);
                setIsRegisterModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#245B50] hover:bg-[#1A443C] text-[#F6F2E9] font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#C5A66B]" />
              Register as a Worker
            </button>
            <button
              onClick={onOpenCompare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF7F0] text-[#172321] border border-[#E2DDD2] font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-[#C5A66B]" />
              Compare Proposals
            </button>
          </div>
        </div>

        {/* Directory Navigation Tabs & Location Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-[#E2DDD2]">
          <div className="inline-flex p-0.5 rounded bg-white border border-[#E2DDD2] flex-wrap">
            <button
              onClick={() => setActiveTab("registered-workers")}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all cursor-pointer ${
                activeTab === "registered-workers"
                  ? "bg-[#245B50] text-[#F6F2E9] font-semibold shadow-xs"
                  : "text-[#6E6B65] hover:text-[#172321]"
              }`}
            >
              Verified Craftsmen Directory ({registeredWorkers.length})
            </button>
            <button
              onClick={() => setActiveTab("nearby-discovery")}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all cursor-pointer ${
                activeTab === "nearby-discovery"
                  ? "bg-[#245B50] text-[#F6F2E9] font-semibold shadow-xs"
                  : "text-[#6E6B65] hover:text-[#172321]"
              }`}
            >
              Nearby Discovery by Locality
            </button>
            <button
              onClick={() => setActiveTab("public-directory")}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all cursor-pointer ${
                activeTab === "public-directory"
                  ? "bg-[#245B50] text-[#F6F2E9] font-semibold shadow-xs"
                  : "text-[#6E6B65] hover:text-[#172321]"
              }`}
            >
              Commercial Depots (Google Places)
            </button>
            <button
              onClick={() => setActiveTab("verification-tiers")}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all cursor-pointer ${
                activeTab === "verification-tiers"
                  ? "bg-[#245B50] text-[#F6F2E9] font-semibold shadow-xs"
                  : "text-[#6E6B65] hover:text-[#172321]"
              }`}
            >
              Verification Standards & Trust
            </button>
          </div>

          {/* Location & GPS Detection Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDetectLocation}
              disabled={locationLoading}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-semibold transition-all cursor-pointer ${
                userLocationDetected
                  ? "bg-[#245B50] text-white border-[#245B50]"
                  : "bg-white text-[#172321] border-[#E2DDD2] hover:bg-[#FAF7F0]"
              }`}
              title="Detect approximate device locality to sort nearest craftsmen"
            >
              <Navigation className={`w-3.5 h-3.5 text-[#C5A66B] ${locationLoading ? "animate-spin" : ""}`} />
              <span>{locationLoading ? "Detecting..." : userLocationDetected ? `Locality: ${detectedLocality || "Detected"}` : "Use My Location"}</span>
            </button>

            <span className="text-xs text-[#6E6B65] hidden sm:inline">City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded border border-[#E2DDD2] bg-white text-[#172321] focus:outline-none focus:border-[#245B50]"
            >
              <option value="All Cities">All Cities (Telangana)</option>
              {TELANGANA_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}, Telangana
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                if (activeTab === "public-directory") fetchPlaces(selectedCity);
                else fetchRegisteredWorkers(selectedCity, selectedCategory, searchQuery);
              }}
              className="p-1.5 rounded bg-white border border-[#E2DDD2] hover:bg-[#F6F2E9] text-[#245B50] cursor-pointer"
              title="Refresh listings"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Location Notice Banner if any */}
        {locationNotice && (
          <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{locationNotice}</span>
            </div>
            <button
              onClick={() => setLocationNotice(null)}
              className="p-1 text-amber-700 hover:text-amber-900"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 1: VERIFIED CRAFTSMEN DIRECTORY (REAL REGISTERED WORKERS) */}
        {/* ============================================================ */}
        {activeTab === "registered-workers" && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-2xs border border-[#E2DDD2]">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Search Text */}
                <div className="md:col-span-5">
                  <label className="block text-xs font-semibold text-[#172321] mb-1">
                    Search by Name, Skill, or Locality
                  </label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#6E6B65]" />
                    <input
                      type="text"
                      placeholder="e.g. Marble, Tile, Granite, Secunderabad..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-[#E2DDD2] bg-[#FAF7F0] text-[#172321] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                    />
                  </div>
                </div>

                {/* Specialization Filter */}
                <div className="md:col-span-4">
                  <label className="block text-xs font-semibold text-[#172321] mb-1">
                    Flooring Specialization
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-[#E2DDD2] bg-[#FAF7F0] text-[#172321] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By Filter */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-[#172321] mb-1">
                    Sort Order
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-[#E2DDD2] bg-[#FAF7F0] text-[#172321] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                  >
                    <option value="experience">Most Experienced First</option>
                    <option value="rate_low">Benchmark Rate: Low to High</option>
                    <option value="rate_high">Benchmark Rate: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {workersStatus === "LOADING" && (
              <div className="py-16 text-center">
                <div className="w-8 h-8 rounded-full border-2 border-[#245B50] border-t-transparent animate-spin mx-auto mb-3" />
                <p className="text-xs font-semibold text-[#172321]">
                  Loading verified craftsmen from MESTHIRI registry...
                </p>
                <p className="text-[11px] text-[#6E6B65] mt-1">
                  Querying approved contractor profiles with verified credentials.
                </p>
              </div>
            )}

            {/* MANDATORY EMPTY STATE: ZERO REGISTERED WORKERS */}
            {(workersStatus === "ZERO_RESULTS" || (workersStatus !== "LOADING" && filteredWorkers.length === 0)) && (
              <div className="py-14 bg-white rounded-2xl border border-[#E2DDD2] text-center max-w-lg mx-auto p-8 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-[#FAF7F0] text-[#245B50] flex items-center justify-center mx-auto mb-4 border border-[#E2DDD2]">
                  <Briefcase className="w-7 h-7 text-[#245B50]" />
                </div>
                <h3 className="text-lg font-bold text-[#172321] font-serif">
                  No registered workers yet. Be the first skilled professional to join MESTHIRI.
                </h3>
                <p className="text-xs text-[#6E6B65] mt-2 leading-relaxed">
                  MESTHIRI does not display fictional worker profiles, fake ratings, or scraped directory data. Profiles appear only after genuine professionals register and complete labour card verification.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => {
                      setRegForm((prev) => ({
                        ...prev,
                        serviceAreaCity: selectedCity !== "All Cities" ? selectedCity : "Hyderabad",
                      }));
                      setRegisterSuccess(false);
                      setIsRegisterModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#245B50] text-[#F6F2E9] text-xs font-bold hover:bg-[#1A443C] transition-colors shadow-xs cursor-pointer"
                  >
                    Register as a Worker
                  </button>
                </div>
              </div>
            )}

            {/* Error State */}
            {workersStatus === "ERROR" && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{workersMessage}</span>
                </div>
                <button
                  onClick={() => fetchRegisteredWorkers(selectedCity, selectedCategory, searchQuery)}
                  className="px-3 py-1 bg-white rounded border border-amber-300 font-semibold text-xs cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Registered Worker Cards Grid */}
            {filteredWorkers.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs text-[#6E6B65]">
                  <span>
                    Showing <strong>{filteredWorkers.length}</strong> verified craftsmen in <strong>{selectedCity}, Telangana</strong>
                  </span>
                  <span className="text-[11px] font-medium text-[#245B50] bg-[#E8F0EE] px-2.5 py-0.5 rounded border border-[#245B50]/20">
                    Verified Credentials
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredWorkers.map((worker) => (
                    <div
                      key={worker.id}
                      className="bg-white rounded-xl border border-[#E2DDD2] p-5 shadow-2xs hover:shadow-sm hover:border-[#245B50] transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Status Label & Experience */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-800 border-emerald-300">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Verified Worker
                          </span>
                          <span className="text-[11px] font-semibold text-[#6E6B65]">
                            {worker.experienceYears} Years Exp
                          </span>
                        </div>

                        {/* Name & Trade */}
                        <h3 className="text-base font-bold text-[#172321] leading-snug">
                          {worker.name}
                        </h3>

                        {/* Location (City & Neighborhood ONLY - Never private street address) */}
                        <p className="text-xs text-[#6E6B65] mt-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#245B50] shrink-0" />
                          <span>
                            {worker.serviceAreaNeighborhood ? `${worker.serviceAreaNeighborhood}, ` : ""}
                            {worker.serviceAreaCity}, Telangana
                          </span>
                        </p>

                        {/* Rating Display: "Not yet rated" when no genuine reviews exist */}
                        <div className="mt-2.5 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 text-stone-600 text-[11px] font-medium border border-stone-200">
                            <Star className="w-3 h-3 text-stone-400" />
                            {worker.reviewCount && worker.reviewCount > 0 ? (
                              <span>★ {worker.rating?.toFixed(1)} ({worker.reviewCount} reviews)</span>
                            ) : (
                              <span>Not yet rated</span>
                            )}
                          </span>
                          <span className="text-[10px] text-stone-400">• New Registered Member</span>
                        </div>

                        {/* Trade Skills */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {worker.skills.map((skill) => (
                            <span
                              key={skill}
                              className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#FAF7F0] text-[#172321] border border-[#E2DDD2]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Work bio */}
                        <p className="text-xs text-[#6E6B65] mt-3 line-clamp-2 leading-relaxed">
                          {worker.portfolioNotes}
                        </p>

                        {/* Rate benchmark if provided */}
                        {typeof worker.typicalSqftRate === "number" && worker.typicalSqftRate > 0 && (
                          <div className="mt-3 pt-3 border-t border-[#E2DDD2] flex items-center justify-between text-xs">
                            <span className="text-[#6E6B65]">Labor Reference Rate:</span>
                            <span className="font-bold text-[#172321]">₹{worker.typicalSqftRate} / sq.ft</span>
                          </div>
                        )}
                      </div>

                      {/* Card Actions */}
                      <div className="mt-5 pt-3 border-t border-[#E2DDD2] flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#6E6B65] truncate max-w-[130px]">
                          {worker.phoneContact || "Contact via platform"}
                        </span>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => setSelectedRegisteredWorker(worker)}
                            className="px-2.5 py-1.5 rounded text-xs font-semibold text-[#172321] bg-[#FAF7F0] hover:bg-[#F6F2E9] border border-[#E2DDD2] transition-colors cursor-pointer"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              const wObj = toWorker(worker);
                              if (onSelectWorker) onSelectWorker(wObj);
                              else onRequestQuote(wObj);
                            }}
                            className="px-3 py-1.5 rounded text-xs font-semibold text-white bg-[#245B50] hover:bg-[#1A443C] transition-colors shadow-xs cursor-pointer"
                          >
                            Request Quote
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: NEARBY DISCOVERY BY LOCALITY (RESPONSIBLE LOCATION)  */}
        {/* ============================================================ */}
        {activeTab === "nearby-discovery" && (
          <div className="space-y-6">
            <div className="bg-[#172321] text-white p-6 sm:p-8 rounded-2xl border border-stone-800 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-[#C5A66B] uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-[#C5A66B]" />
                    Nearby Discovery by Locality
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#FAF7F0] mt-1">
                    Locate Skilled Craftsmen in Your Operating District
                  </h3>
                  <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
                    Matches homeowners with registered contractors based on voluntarily declared operating districts. Exact private residential addresses are never disclosed.
                  </p>
                </div>

                <button
                  onClick={handleDetectLocation}
                  disabled={locationLoading}
                  className="px-4 py-2.5 rounded-xl bg-[#245B50] hover:bg-[#1b433b] text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer shrink-0"
                >
                  <Navigation className={`w-4 h-4 text-[#C5A66B] ${locationLoading ? "animate-spin" : ""}`} />
                  <span>{locationLoading ? "Detecting..." : userLocationDetected ? "Locality Detected" : "Use My Location"}</span>
                </button>
              </div>

              {/* Locality Selector Bar */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-wrap items-center gap-3">
                <span className="text-xs text-stone-300 font-medium">Select Locality / Operating District:</span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-stone-600 bg-stone-900 text-white focus:outline-none focus:border-[#C5A66B]"
                >
                  <option value="All Cities">All Telangana Districts</option>
                  {TELANGANA_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <span className="text-[11px] text-stone-400">
                  {detectedLocality ? `Current device cluster: ${detectedLocality}` : "No live GPS required; select any operating city above."}
                </span>
              </div>
            </div>

            {/* Nearby Workers List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-bold text-[#172321] font-serif">
                  Registered Craftsmen in {selectedCity === "All Cities" ? "Telangana" : selectedCity}
                </h4>
                <span className="text-xs text-[#6E6B65]">
                  {filteredWorkers.length} matching profile{filteredWorkers.length === 1 ? "" : "s"}
                </span>
              </div>

              {filteredWorkers.length === 0 ? (
                <div className="py-12 bg-white rounded-xl border border-[#E2DDD2] text-center p-6">
                  <MapPin className="w-8 h-8 text-[#6E6B65] mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-bold text-[#172321]">
                    No registered craftsmen in {selectedCity} yet.
                  </p>
                  <p className="text-xs text-[#6E6B65] mt-1 max-w-md mx-auto">
                    Be the first professional to register your service in this district, or explore contractors from neighboring cities.
                  </p>
                  <button
                    onClick={() => {
                      setRegForm((prev) => ({
                        ...prev,
                        serviceAreaCity: selectedCity !== "All Cities" ? selectedCity : "Hyderabad",
                      }));
                      setIsRegisterModalOpen(true);
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#245B50] text-white text-xs font-bold hover:bg-[#1A443C] transition-colors cursor-pointer"
                  >
                    Register as a Worker in {selectedCity !== "All Cities" ? selectedCity : "Telangana"}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredWorkers.map((w) => (
                    <div
                      key={w.id}
                      className="p-4 bg-white rounded-xl border border-[#E2DDD2] flex flex-col justify-between shadow-2xs hover:border-[#245B50] transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Verified Craftsman
                          </span>
                          <span className="text-xs font-semibold text-stone-500">{w.experienceYears} yrs</span>
                        </div>
                        <h5 className="font-bold text-sm text-[#172321]">{w.name}</h5>
                        <p className="text-xs text-[#6E6B65] mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#245B50] shrink-0" />
                          <span>{w.serviceAreaCity}, Telangana</span>
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {w.skills.map((s) => (
                            <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const wObj = toWorker(w);
                          if (onSelectWorker) onSelectWorker(wObj);
                          else onRequestQuote(wObj);
                        }}
                        className="mt-4 w-full py-1.5 rounded-lg bg-[#245B50] hover:bg-[#1A443C] text-white font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Request Quote
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: COMMERCIAL ENTERPRISES (GOOGLE PLACES LIVE DATA)     */}
        {/* ============================================================ */}
        {activeTab === "public-directory" && (
          <div className="space-y-6">
            {placesStatus === "API_KEY_REQUIRED" && (
              <div className="p-5 rounded-xl bg-white border border-[#E2DDD2] shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-amber-50 text-[#C5A66B] shrink-0 border border-amber-200">
                    <AlertCircle className="w-5 h-5 text-[#C5A66B]" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <h4 className="text-sm font-bold text-[#172321]">
                      Google Places API Integration
                    </h4>
                    <p className="text-xs text-[#6E6B65] leading-relaxed">
                      Commercial material depots and stone yards are retrieved directly from Google Places API. Showing sample cached enterprises for {selectedCity}, Telangana.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {places.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {places.map((place) => (
                  <div
                    key={place.id}
                    className="bg-white rounded-xl border border-[#E2DDD2] p-5 shadow-2xs hover:border-[#245B50] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-[#6E6B65] block w-fit mb-2">
                        Public Enterprise • Google Places
                      </span>
                      <h4 className="font-bold text-base text-[#172321]">{place.name}</h4>
                      <p className="text-xs text-[#6E6B65] mt-1 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#245B50] shrink-0 mt-0.5" />
                        <span>{place.formattedAddress}</span>
                      </p>
                      <p className="text-xs text-[#6E6B65] mt-2 italic bg-[#FAF7F0] p-2 rounded">
                        Note: Commercial business listing. Not personally verified by MESTHIRI.
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedPublicPlace(place)}
                      className="mt-4 w-full py-1.5 rounded-lg bg-[#FAF7F0] hover:bg-[#245B50] hover:text-white text-[#172321] font-semibold text-xs border border-[#E2DDD2] transition-colors cursor-pointer"
                    >
                      View Details & Google Attribution
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center text-[11px] text-[#6E6B65] pt-3">
              {placesAttribution} • Commercial stone directories are subject to Google Places policies.
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: VERIFICATION STANDARDS & TRUST                        */}
        {/* ============================================================ */}
        {activeTab === "verification-tiers" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2DDD2] shadow-xs space-y-6">
              <div>
                <span className="text-xs font-bold text-[#245B50] uppercase tracking-wider">
                  Quality & Labour Protection Protocol
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#172321] mt-1">
                  MESTHIRI Verification & Document Privacy Standards
                </h3>
                <p className="text-xs sm:text-sm text-[#6E6B65] mt-2 leading-relaxed">
                  How MESTHIRI connects homeowners with authentic, verified stone masons and tile installers while preserving worker document confidentiality.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2] space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#245B50]" />
                    <h4 className="font-bold text-xs text-[#172321]">1. Labour Welfare Board Credentials</h4>
                  </div>
                  <p className="text-xs text-[#6E6B65] leading-relaxed">
                    Workers submit official Building and Other Construction Workers Welfare Board (BOCWWB) cards or national e-Shram worker registrations. Accounts initially hold <strong>Pending Verification</strong> status until reviewed by an authorized verification officer.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2] space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-700" />
                    <h4 className="font-bold text-xs text-[#172321]">2. Strict Document Privacy</h4>
                  </div>
                  <p className="text-xs text-[#6E6B65] leading-relaxed">
                    Identity cards, full card numbers, dates of birth, and home street addresses are <strong>never published publicly</strong>. Only approved trade skills, experience, and general operating localities appear on the public directory.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2] space-y-2">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-[#245B50]" />
                    <h4 className="font-bold text-xs text-[#172321]">3. Indian Standard IS 1443 Tolerances</h4>
                  </div>
                  <p className="text-xs text-[#6E6B65] leading-relaxed">
                    Quotations and job postings include standardized workmanship criteria: optical laser datum leveling, lippage tolerance &lt; 1.0mm, and two-component epoxy resin joint grouting.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2] space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#C5A66B]" />
                    <h4 className="font-bold text-xs text-[#172321]">4. Genuine Reviews Only</h4>
                  </div>
                  <p className="text-xs text-[#6E6B65] leading-relaxed">
                    Reviews can only be submitted by homeowners associated with completed jobs. New members show <strong>“Not yet rated”</strong> — MESTHIRI never generates fake 5-star ratings or fabricated job counts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL 1: WORKER REGISTRATION MODAL                          */}
        {/* ============================================================ */}
        {isRegisterModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172321]/70 backdrop-blur-sm overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[#E2DDD2] overflow-hidden my-6">
              <div className="px-6 py-4 bg-[#172321] text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#C5A66B] uppercase tracking-wider">
                    Contractor Onboarding
                  </span>
                  <h3 className="text-base sm:text-lg font-bold font-serif">Register as a Mesthiri</h3>
                </div>
                <button
                  onClick={handleCloseRegisterModal}
                  className="p-1 rounded text-white/80 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {registerSuccess ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#172321]">
                    Worker Registration Submitted
                  </h4>
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    Status: Pending Verification
                  </div>
                  <p className="text-xs text-[#6E6B65] leading-relaxed">
                    Your profile has been saved. In accordance with platform integrity rules, new applications start in <strong>Pending Verification</strong> and are strictly excluded from the genuine public directory until an authorized review officer verifies credentials.
                  </p>
                  <button
                    onClick={() => {
                      handleCloseRegisterModal();
                      setRegisterSuccess(false);
                      fetchRegisteredWorkers(selectedCity, selectedCategory, searchQuery);
                    }}
                    className="px-5 py-2.5 rounded bg-[#245B50] text-[#F6F2E9] font-semibold text-xs hover:bg-[#1A443C] transition-colors cursor-pointer"
                  >
                    Close & View Directory
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                  {/* SAFE DEMO / TEST MODE BANNER */}
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5 text-left">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                        <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                        <span>Development DEMO / TEST MODE</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-tight">
                        No real worker available? Click to test required field validation, document intake, and Pending Verification status safely.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleFillDemoTestData}
                      className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                    >
                      Fill Sample Test Data
                    </button>
                  </div>

                  {regError && (
                    <div className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{regError}</span>
                    </div>
                  )}

                  {/* Legal Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#172321] mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rameshwar Rao / Anand Sharma"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded border border-[#E2DDD2] bg-[#FAF7F0] focus:outline-none focus:border-[#245B50]"
                    />
                  </div>

                  {/* State & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#172321] mb-1">
                        State *
                      </label>
                      <select
                        value={regForm.serviceAreaState}
                        onChange={(e) =>
                          setRegForm({
                            ...regForm,
                            serviceAreaState: e.target.value,
                            serviceAreaCity: e.target.value === "Telangana" ? "Hyderabad" : regForm.serviceAreaCity,
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded border border-[#E2DDD2] bg-[#FAF7F0] focus:outline-none focus:border-[#245B50]"
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
                        City *
                      </label>
                      {regForm.serviceAreaState === "Telangana" ? (
                        <select
                          value={regForm.serviceAreaCity}
                          onChange={(e) => setRegForm({ ...regForm, serviceAreaCity: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded border border-[#E2DDD2] bg-[#FAF7F0] focus:outline-none focus:border-[#245B50]"
                        >
                          {TELANGANA_CITIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          required
                          placeholder="Enter your operating city"
                          value={regForm.serviceAreaCity}
                          onChange={(e) => setRegForm({ ...regForm, serviceAreaCity: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded border border-[#E2DDD2] bg-[#FAF7F0] focus:outline-none focus:border-[#245B50]"
                        />
                      )}
                    </div>
                  </div>

                  {/* Neighborhood / Locality */}
                  <div>
                    <label className="block text-xs font-semibold text-[#172321] mb-1">
                      Service Localities (General Area Only — Do Not Disclose Home Address)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Banjara Hills, Jubilee Hills, Kukatpally, Madhapur"
                      value={regForm.serviceAreaNeighborhood}
                      onChange={(e) => setRegForm({ ...regForm, serviceAreaNeighborhood: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded border border-[#E2DDD2] bg-[#FAF7F0] focus:outline-none focus:border-[#245B50]"
                    />
                  </div>

                  {/* Contact Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#172321] mb-1">
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98490 XXXXX"
                        value={regForm.phoneContact}
                        onChange={(e) => setRegForm({ ...regForm, phoneContact: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded border border-[#E2DDD2] bg-[#FAF7F0] focus:outline-none focus:border-[#245B50]"
                      />
                      <span className="text-[10px] text-stone-500 mt-0.5 block">
                        OTP verification is simulated in prototype mode.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#172321] mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="worker@example.com"
                        value={regForm.emailContact}
                        onChange={(e) => setRegForm({ ...regForm, emailContact: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded border border-[#E2DDD2] bg-[#FAF7F0] focus:outline-none focus:border-[#245B50]"
                      />
                    </div>
                  </div>

                  {/* Trade Experience & Benchmark Rate */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#172321] mb-1">
                        Trade Experience (Years) *
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        required
                        value={regForm.experienceYears}
                        onChange={(e) => setRegForm({ ...regForm, experienceYears: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs rounded border border-[#E2DDD2] bg-[#FAF7F0] focus:outline-none focus:border-[#245B50]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#172321] mb-1">
                        Reference Benchmark Rate (₹ / sq.ft)
                      </label>
                      <input
                        type="number"
                        min={10}
                        max={500}
                        value={regForm.typicalSqftRate}
                        onChange={(e) => setRegForm({ ...regForm, typicalSqftRate: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs rounded border border-[#E2DDD2] bg-[#FAF7F0] focus:outline-none focus:border-[#245B50]"
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-xs font-semibold text-[#172321] mb-1.5">
                      Flooring Skills & Specializations *
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {(
                        [
                          "Italian Marble",
                          "Indian Marble",
                          "Black Galaxy Granite",
                          "Granite",
                          "Vitrified Tiles",
                          "Ceramic Tiles",
                          "Terrazzo / Mosaic",
                        ] as FlooringCategory[]
                      ).map((skill) => (
                        <label
                          key={skill}
                          className="flex items-center gap-2 p-1.5 rounded border border-[#E2DDD2] bg-[#FAF7F0] cursor-pointer hover:bg-white"
                        >
                          <input
                            type="checkbox"
                            checked={regForm.skills.includes(skill)}
                            onChange={() => handleToggleSkill(skill)}
                            className="rounded text-[#245B50] focus:ring-[#245B50]"
                          />
                          <span className="text-[11px] font-medium text-[#172321]">{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Portfolio & Bio */}
                  <div>
                    <label className="block text-xs font-semibold text-[#172321] mb-1">
                      Portfolio Summary & Past Experience
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Describe your stone cutting equipment, team size, and notable past flooring work..."
                      value={regForm.portfolioNotes}
                      onChange={(e) => setRegForm({ ...regForm, portfolioNotes: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded border border-[#E2DDD2] bg-[#FAF7F0] focus:outline-none focus:border-[#245B50]"
                    />
                  </div>

                  {/* ============================================================ */}
                  {/* LABOUR CARD / REGISTRATION DOCUMENT UPLOAD                   */}
                  {/* ============================================================ */}
                  <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#245B50]/30 space-y-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#245B50]" />
                      <h4 className="text-xs font-bold text-[#172321] uppercase tracking-wider">
                        Labour Card / Registration Document Upload
                      </h4>
                    </div>
                    <p className="text-[11px] text-[#6E6B65] leading-relaxed">
                      Accepts applicable state construction worker cards (BOCWWB), e-Shram, or craftsman guild identities. <strong>Uploading a card does not prove authenticity; manual review is required before earning a verified badge.</strong>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#172321] mb-1">
                          Document Category *
                        </label>
                        <select
                          value={regForm.documentCategory}
                          onChange={(e) =>
                            setRegForm({
                              ...regForm,
                              documentCategory: e.target.value as LabourDocumentCategory,
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-[#E2DDD2] bg-white focus:outline-none focus:border-[#245B50]"
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
                          value={regForm.issuingState}
                          onChange={(e) => setRegForm({ ...regForm, issuingState: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-[#E2DDD2] bg-white focus:outline-none focus:border-[#245B50]"
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
                        Registration / Card Number (Masked in Private Audit Store)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. TG/BOCW/2024/09871"
                        value={regForm.documentNumber}
                        onChange={(e) => setRegForm({ ...regForm, documentNumber: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-[#E2DDD2] bg-white focus:outline-none focus:border-[#245B50]"
                      />
                    </div>

                    {/* File Upload Box */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#172321] mb-1">
                        Attach Document File (PDF, JPG, PNG - Max 5MB)
                      </label>

                      {regForm.uploadedFile ? (
                        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-700" />
                            <div>
                              <p className="text-xs font-bold text-emerald-900">
                                {regForm.uploadedFile.name}
                              </p>
                              <p className="text-[10px] text-emerald-700">
                                {regForm.uploadedFile.sizeKb} KB • Stored privately for audit review
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setRegForm((prev) => ({ ...prev, uploadedFile: null }))}
                            className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline cursor-pointer"
                          >
                            Replace File
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-[#245B50]/40 bg-white hover:bg-[#FAF7F0] cursor-pointer transition-colors">
                          <Upload className="w-5 h-5 text-[#245B50] mb-1" />
                          <span className="text-xs font-semibold text-[#172321]">
                            Click to upload registration document
                          </span>
                          <span className="text-[10px] text-[#6E6B65]">
                            PDF, JPG, or PNG up to 5MB
                          </span>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* Privacy Disclaimer */}
                    <div className="p-2.5 rounded bg-amber-50/70 border border-amber-200 text-[10px] text-amber-900 leading-relaxed flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span>
                        <strong>Document Privacy Protection:</strong> Uploaded identity documents are never published on your public profile. Files are restricted to authorized reviewers. Accounts initially receive <strong>Pending Verification</strong> status until reviewed.
                      </span>
                    </div>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="p-3 rounded bg-[#FAF7F0] border border-[#E2DDD2] space-y-2">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={regForm.consentAgreed}
                        onChange={(e) => setRegForm({ ...regForm, consentAgreed: e.target.checked })}
                        className="mt-0.5 rounded text-[#245B50] focus:ring-[#245B50]"
                      />
                      <span className="text-[11px] text-[#6E6B65] leading-relaxed">
                        I voluntarily consent to register my trade profile on MESTHIRI. I understand that my account will initially be set to <strong>Pending Verification</strong> and will not appear in the public directory until an authorized review officer inspects my credentials.
                      </span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCloseRegisterModal}
                      className="px-4 py-2 text-xs font-semibold text-[#6E6B65] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={regSubmitting}
                      className="px-5 py-2.5 rounded text-xs font-semibold text-[#F6F2E9] bg-[#245B50] hover:bg-[#1A443C] disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
                    >
                      {regSubmitting ? "Submitting..." : "Submit Worker Registration"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL 2: REGISTERED WORKER DETAIL MODAL                     */}
        {/* ============================================================ */}
        {selectedRegisteredWorker && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172321]/70 backdrop-blur-sm overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[#E2DDD2] overflow-hidden my-6">
              <div className="px-6 py-4 bg-[#172321] text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#C5A66B] uppercase tracking-wider">
                    Verified Craftsman Profile
                  </span>
                  <h3 className="text-base sm:text-lg font-bold font-serif">{selectedRegisteredWorker.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedRegisteredWorker(null)}
                  className="p-1 rounded text-white/80 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Worker
                  </span>
                  <span className="text-xs font-semibold text-[#6E6B65]">
                    {selectedRegisteredWorker.experienceYears} Years Trade Experience
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-[#172321] mb-1">Operating Locality</h4>
                  <p className="text-xs text-[#6E6B65] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#245B50]" />
                    <span>
                      {selectedRegisteredWorker.serviceAreaNeighborhood ? `${selectedRegisteredWorker.serviceAreaNeighborhood}, ` : ""}
                      {selectedRegisteredWorker.serviceAreaCity}, Telangana
                    </span>
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-[#172321] mb-1">Trade Specializations</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRegisteredWorker.skills.map((s) => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded bg-[#FAF7F0] text-[#172321] border border-[#E2DDD2]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-[#172321] mb-1">Experience & Bio</h4>
                  <p className="text-xs text-[#6E6B65] leading-relaxed bg-[#FAF7F0] p-3 rounded-lg border border-[#E2DDD2]">
                    {selectedRegisteredWorker.portfolioNotes || "Professional flooring craftsman registered on MESTHIRI."}
                  </p>
                </div>

                {/* Rating notice: genuine "Not yet rated" */}
                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-600">
                  <strong>Platform Ratings:</strong> Not yet rated. Reviews on MESTHIRI are only allowed from verified clients upon completed project milestones.
                </div>

                {/* Privacy reminder */}
                <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Privacy Protected:</strong> Worker identity documents and residential addresses are kept strictly confidential and are not published on public profiles.
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E2DDD2]">
                  <button
                    onClick={() => setSelectedRegisteredWorker(null)}
                    className="px-4 py-2 text-xs font-semibold text-[#6E6B65] cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const wObj = toWorker(selectedRegisteredWorker);
                      setSelectedRegisteredWorker(null);
                      onRequestQuote(wObj);
                    }}
                    className="px-4 py-2 rounded bg-[#245B50] hover:bg-[#1A443C] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Request a Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL 3: PUBLIC ENTERPRISE DETAIL (GOOGLE PLACES)           */}
        {/* ============================================================ */}
        {selectedPublicPlace && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172321]/70 backdrop-blur-sm overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[#E2DDD2] overflow-hidden my-6">
              <div className="px-6 py-4 bg-[#172321] text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#C5A66B] uppercase tracking-wider">
                    Commercial Stone Depot
                  </span>
                  <h3 className="text-base sm:text-lg font-bold font-serif">{selectedPublicPlace.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedPublicPlace(null)}
                  className="p-1 rounded text-white/80 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div>
                  <h4 className="text-xs font-semibold text-[#172321] mb-1">Commercial Address</h4>
                  <p className="text-xs text-[#6E6B65] flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#245B50] shrink-0 mt-0.5" />
                    <span>{selectedPublicPlace.formattedAddress}</span>
                  </p>
                </div>

                {selectedPublicPlace.nationalPhoneNumber && (
                  <div>
                    <h4 className="text-xs font-semibold text-[#172321] mb-1">Business Contact</h4>
                    <p className="text-xs text-[#6E6B65] flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#245B50]" />
                      <span>{selectedPublicPlace.nationalPhoneNumber}</span>
                    </p>
                  </div>
                )}

                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  <strong>Third-Party Business Data:</strong> This listing is retrieved from public data sources via Google Places API. MESTHIRI does not claim that publicly listed businesses are vetted or personally verified by MESTHIRI.
                </div>

                <div className="flex justify-end pt-2 border-t border-[#E2DDD2]">
                  <button
                    onClick={() => setSelectedPublicPlace(null)}
                    className="px-4 py-2 rounded bg-[#245B50] text-white font-semibold text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
