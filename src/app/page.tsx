"use client";

import React, { useState } from "react";
import {
  ActiveAppTab,
  Worker,
  JobListing,
  Quotation,
  MaterialProduct,
  FlooringCategory,
  FlooringWorkType,
  JobStatus,
  QuotationStatus,
  UserRole,
  UserProfile,
} from "@/types";
import { SAMPLE_WORKERS } from "@/data/workers";
import { SAMPLE_JOBS, SAMPLE_QUOTATIONS } from "@/data/jobs";
import { SAMPLE_PRODUCTS, SAMPLE_SHOPS } from "@/data/products";
import { DEMO_USERS } from "@/data/users";
import { InnovationBanner } from "@/components/InnovationBanner";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { HomeSections } from "@/components/HomeSections";
import { WorkerDirectory } from "@/components/WorkerDirectory";
import { WorkerDashboard } from "@/components/WorkerDashboard";
import { AIFloorVisualizer } from "@/components/AIFloorVisualizer";
import { Marketplace } from "@/components/Marketplace";
import { DesignGallery } from "@/components/DesignGallery";
import { AboutSection } from "@/components/AboutSection";
import { PostJobModal } from "@/components/PostJobModal";
import { CompareQuotesModal } from "@/components/CompareQuotesModal";
import { WorkerDetailModal } from "@/components/WorkerDetailModal";
import { CostCalculatorModal } from "@/components/CostCalculatorModal";
import { AuthScreen } from "@/components/AuthScreen";
import { ProfilePage } from "@/components/ProfilePage";
import { GovernmentSchemesView } from "@/components/GovernmentSchemesView";
import { AdminVerificationModal } from "@/components/AdminVerificationModal";
import { ToastContainer, ToastMessage } from "@/components/Toast";
import { Footer } from "@/components/Footer";
import {
  Sparkles,
  ArrowRight,
  Shield,
  CheckCircle2,
  Users,
  Briefcase,
  Store,
  Layers,
  ChevronRight,
  Calculator,
  Compass,
  ShieldCheck,
  FileCheck2,
} from "lucide-react";

export default function HomePage() {
  // Authentication Gate: Defaults to false so unauthenticated users see the Login/Sign Up page first!
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS.homeowner);

  // Navigation & Role states
  const [activeTab, setActiveTab] = useState<ActiveAppTab>("home");
  const [activeRole, setActiveRole] = useState<UserRole>("homeowner");

  // Admin verification console modal state
  const [isAdminConsoleOpen, setIsAdminConsoleOpen] = useState<boolean>(false);

  // Data states (shared reactive application state for Prototype A)
  const [workers, setWorkers] = useState<Worker[]>(SAMPLE_WORKERS);
  const [jobs, setJobs] = useState<JobListing[]>(SAMPLE_JOBS);
  const [quotations, setQuotations] = useState<Quotation[]>(SAMPLE_QUOTATIONS);

  // Search filter query from Hero
  const [searchCategory, setSearchCategory] = useState<string>("All Categories");

  // Modal states
  const [isPostJobOpen, setIsPostJobOpen] = useState<boolean>(false);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [compareInitialJobId, setCompareInitialJobId] = useState<string | undefined>(undefined);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [calculatorInitialArea, setCalculatorInitialArea] = useState<number | undefined>(undefined);
  const [selectedWorkerForModal, setSelectedWorkerForModal] = useState<Worker | null>(null);
  const [isRegisterWorkerOpen, setIsRegisterWorkerOpen] = useState<boolean>(false);

  // Pre-fill parameters for PostJobModal (from Calculator / Visualizer)
  const [postJobPreFill, setPostJobPreFill] = useState<{
    area?: number;
    material?: FlooringCategory;
    workType?: FlooringWorkType;
  }>({});

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, description: string, type: "success" | "info" = "success") => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      title,
      description,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Protected Tab Navigation: Prevent access to another role's private dashboard
  const handleTabChange = (tab: ActiveAppTab) => {
    if (tab === "worker-dashboard" && currentUser.role !== "worker") {
      addToast(
        "Access Restricted",
        "The Worker Portal is only accessible to registered worker accounts.",
        "info"
      );
      return;
    }
    if (tab === "admin-verification") {
      setIsAdminConsoleOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  // Authentication Completion Handler (from AuthScreen)
  const handleAuthenticationSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setActiveRole(user.role);

    // Redirect user strictly to the correct dashboard based on their registered role
    if (user.role === "worker") {
      setActiveTab("worker-dashboard");
      addToast(
        `Welcome, ${user.name}`,
        user.verificationStatus === "Verified"
          ? "Logged in as Verified Mesthiri. Worker Portal and leads active."
          : "Logged in as Worker. Labour card verification is currently pending review."
      );
    } else if (user.role === "shop") {
      setActiveTab("marketplace");
      addToast(
        `Welcome, ${user.name}`,
        "Logged in as Marble & Tile Shop Partner. Material depot active."
      );
    } else if (user.role === "admin") {
      setActiveTab("home");
      setIsAdminConsoleOpen(true);
      addToast(
        `Welcome, ${user.name}`,
        "Authorized Review Officer session active. Verification Console opened."
      );
    } else {
      setActiveTab("home");
      addToast(
        `Welcome, ${user.name}`,
        "Logged in as Homeowner. Explore verified craftsmen and flooring solutions."
      );
    }
  };

  // Logout Handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab("home");
    addToast(
      "Signed Out",
      "You have signed out. Please enter your credentials to log in.",
      "info"
    );
  };

  // Search handler from hero
  const handleHeroSearch = (category: string, location: string, minArea: number) => {
    setSearchCategory(category);
    addToast(
      "Filtering Craftsmen Archetypes",
      `Showing specialists for ${category} in ${location} (${minArea} sq.ft scope).`
    );
  };

  // Homeowner posts a new job
  const handlePostJob = (newJob: JobListing) => {
    // Brand job with current homeowner user name if logged in as homeowner
    const brandedJob: JobListing = {
      ...newJob,
      homeownerName:
        currentUser.role === "homeowner" && currentUser.name
          ? currentUser.name
          : newJob.homeownerName,
    };

    setJobs((prev) => [brandedJob, ...prev]);
    addToast(
      "Demonstration Job Published",
      `Requirement for "${brandedJob.title}" added to local demonstration pool. Prototype simulation — visible to workers immediately in leads!`,
      "info"
    );
  };

  // Worker submits quotation for a job (Connected Workflow)
  const handleWorkerSubmitQuote = (jobId: string, quoteData: Partial<Quotation>) => {
    // Increment quote count on job and update status
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              quotesReceived: j.quotesReceived + 1,
              status: "Quotation Submitted" as JobStatus,
            }
          : j
      )
    );

    const newQuote: Quotation = {
      id: `quote-${Date.now()}`,
      jobId,
      workerId: currentUser.role === "worker" ? currentUser.id : "registered-worker",
      workerName:
        currentUser.role === "worker"
          ? `${currentUser.name} (Registered Mesthiri)`
          : "Registered Craftsman",
      workerExperience: currentUser.role === "worker" ? currentUser.experienceYears || 10 : 10,
      workerSkills:
        quoteData.workerSkills ||
        (currentUser.role === "worker" ? currentUser.skills : undefined) || [
          "Italian Marble",
          "Indian Marble",
          "Granite",
        ],
      calculationMode: quoteData.calculationMode || "per_sqft",
      ratePerSqFt: quoteData.ratePerSqFt,
      fixedLaborAmount: quoteData.fixedLaborAmount,
      laborTotal: quoteData.laborTotal || 104400,
      isMaterialSuppliedByWorker: quoteData.isMaterialSuppliedByWorker || false,
      materialCost: quoteData.materialCost || 0,
      transportCharges: quoteData.transportCharges || 2000,
      additionalCharges: quoteData.additionalCharges || 14000,
      additionalChargesExplanation:
        quoteData.additionalChargesExplanation || "Diamond polishing & slurry extraction",
      grandTotal: quoteData.grandTotal || 120400,
      durationDays: quoteData.durationDays || 14,
      validityPeriodDays: quoteData.validityPeriodDays || 15,
      workIncluded: quoteData.workIncluded || [
        "Optical laser datum line verification (IS 1443)",
        "Polymer-modified mortar slab bed fixing",
        "7-stage planetary diamond crystallization polishing",
      ],
      workExcluded: quoteData.workExcluded || [
        "Raw stone slab procurement (client supplied)",
      ],
      comments:
        quoteData.comments ||
        `Submitted by ${currentUser.name} via contractor workstation demonstration.`,
      status: "Quotation Submitted",
      submittedAt: "Just now",
      isSampleQuotation: true,
    };

    setQuotations((prev) => [newQuote, ...prev]);

    addToast(
      "Demonstration Quotation Logged",
      `Sample bid of ₹${newQuote.grandTotal.toLocaleString(
        "en-IN"
      )} recorded for Job #${jobId.slice(-6)}. Homeowner can now compare and select it!`,
      "info"
    );
  };

  // Homeowner accepts quotation (Connected Workflow)
  const handleAcceptQuote = (quote: Quotation) => {
    // Update quote status
    setQuotations((prev) =>
      prev.map((q) =>
        q.id === quote.id
          ? { ...q, status: "Quotation Selected" }
          : q.jobId === quote.jobId
          ? { ...q, status: "Not Selected" }
          : q
      )
    );

    // Update job status
    setJobs((prev) =>
      prev.map((j) =>
        j.id === quote.jobId
          ? { ...j, status: "Quotation Selected" as JobStatus, selectedQuotationId: quote.id }
          : j
      )
    );

    addToast(
      "Demonstration Proposal Selected",
      `Simulated selection of ${quote.workerName} (₹${quote.grandTotal.toLocaleString(
        "en-IN"
      )}). Job status updated to "Quotation Selected". No live payment or contract executed.`,
      "info"
    );
  };

  // Job status progression handler
  const handleUpdateJobStatus = (jobId: string, status: JobStatus) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status } : j))
    );
    addToast(
      "Job Status Progressed",
      `Requirement status updated to "${status}". Prototype state progression recorded.`,
      "info"
    );
  };

  // Quote status progression handler
  const handleUpdateQuoteStatus = (quoteId: string, status: QuotationStatus) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status } : q))
    );
  };

  // Worker registered callback
  const handleWorkerRegistered = (worker: any) => {
    addToast(
      "Worker Profile Registered",
      `${worker.name} registered successfully in ${worker.serviceAreaCity} with status "Registered on MESTHIRI".`,
      "success"
    );
  };

  // Direct quotation request for a specific worker
  const handleDirectWorkerQuote = (worker: Worker, notes: string) => {
    addToast(
      "Demonstration Inquiry Recorded",
      `Inquiry logged for craftsman ${worker.name}. Prototype demonstration — no external SMS or phone dispatch was sent.`,
      "info"
    );
  };

  // Product actions in marketplace
  const handleInquireProduct = (product: MaterialProduct) => {
    addToast(
      "Specification Inquiry Recorded",
      `Technical details noted for ${product.name}. Prototype reference data — no commercial order placed.`,
      "info"
    );
  };

  const handleRequestSample = (product: MaterialProduct) => {
    addToast(
      "Sample Request Logged (Demo)",
      `Sample specimen tile request noted for ${product.name}. Prototype simulation mode.`,
      "info"
    );
  };

  // =========================================================================
  // GATE SCREEN: If user is not authenticated, show Login / Sign Up Page first!
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#172321] selection:bg-[#245B50] selection:text-white">
        <AuthScreen onAuthenticate={handleAuthenticationSuccess} />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED USER EXPERIENCE
  // =========================================================================
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F2E9] text-[#172321] selection:bg-[#245B50] selection:text-white">
      {/* 1. College Innovation Presentation Banner & Reviewer Console Access */}
      <InnovationBanner
        activeRole={currentUser.role}
        onOpenAdminConsole={() => setIsAdminConsoleOpen(true)}
        isAdmin={currentUser.role === "admin"}
      />

      {/* 2. Responsive Main Navigation with User Profile Pill & Sign Out */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenPostJob={() => setIsPostJobOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenCompare={() => {
          setCompareInitialJobId(undefined);
          setIsCompareOpen(true);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* 3. Main Views Content */}
      <main className="flex-1">
        {/* VIEW: LINKEDIN-STYLE PROFILE PAGE */}
        {activeTab === "profile" && (
          <ProfilePage
            user={currentUser}
            jobs={jobs}
            quotations={quotations}
            onUpdateUser={(updated) => {
              setCurrentUser(updated);
              addToast("Profile Updated", "Your profile details have been saved.");
            }}
            onNavigateTab={setActiveTab}
            onOpenPostJob={() => setIsPostJobOpen(true)}
            onOpenCompareForJob={(jobId) => {
              setCompareInitialJobId(jobId);
              setIsCompareOpen(true);
            }}
          />
        )}

        {/* VIEW: GOVERNMENT SCHEMES DIRECTORY */}
        {activeTab === "schemes" && <GovernmentSchemesView />}

        {/* VIEW: HOME PAGE */}
        {activeTab === "home" && (
          <div>
            {/* Hero Section with Architectural Photograph & Value Propositions */}
            <HeroSection
              onSearch={handleHeroSearch}
              onNavigateTab={setActiveTab}
              onOpenCalculator={() => setIsCalculatorOpen(true)}
              onOpenPostJob={() => setIsPostJobOpen(true)}
            />

            {/* Complete Home Page Sections: What You Can Do, Categories, How It Works, Professional Recruitment, Cost Calculator Shortcut */}
            <HomeSections
              onNavigateTab={setActiveTab}
              onOpenPostJob={() => setIsPostJobOpen(true)}
              onOpenRegisterWorker={() => setIsRegisterWorkerOpen(true)}
              onOpenCalculatorModal={(preFillArea) => {
                setCalculatorInitialArea(preFillArea);
                setIsCalculatorOpen(true);
              }}
              onSelectMarketplaceCategory={(cat) => {
                setSearchCategory(cat);
                setActiveTab("marketplace");
              }}
            />

            {/* Tri-Sided Value Engine Showcase */}
            <section className="py-14 bg-white border-b border-[#E2DDD2]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-10">
                  <span className="text-xs font-bold text-[#245B50] uppercase tracking-wider">
                    Tri-Sided Platform Architecture
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172321] mt-1 font-serif">
                    How MESTHIRI Solves Flooring Friction
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                    Traditional flooring projects suffer from informal contracting gaps, irregular lippage tolerances, and fragmented stone procurement. MESTHIRI structures the process into a transparent digital workflow.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Pillar 1: Homeowner */}
                  <div className="p-6 rounded-2xl bg-[#FAF7F0] border border-[#E2DDD2] hover:border-[#245B50] hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-white border border-[#E2DDD2] text-[#245B50] flex items-center justify-center mb-4 shadow-xs">
                        <Users className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-[#172321] mb-2">1. For Homeowners</h3>
                      <p className="text-xs text-stone-600 leading-relaxed space-y-1">
                        • Discover skilled craftsmen with standardized sq.ft rate benchmarks.<br />
                        • Compare itemized quotations across labor, prep, and diamond polishing.<br />
                        • Preview floor patterns and perspective reflections before purchasing slabs.<br />
                        • Phased milestone escrow linked to quality tolerances (IS 1443).
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab("workers")}
                      className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#245B50] hover:text-[#172321] transition-colors"
                    >
                      <span>Find Mesthiris</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C5A66B]" />
                    </button>
                  </div>

                  {/* Pillar 2: Mesthiris */}
                  <div className="p-6 rounded-2xl bg-[#FAF7F0] border border-[#E2DDD2] hover:border-[#245B50] hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-[#172321] text-[#C5A66B] flex items-center justify-center mb-4 shadow-xs">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-[#172321] mb-2">2. For Skilled Mesthiris</h3>
                      <p className="text-xs text-stone-600 leading-relaxed space-y-1">
                        • Access direct client job opportunities without contractor middlemen.<br />
                        • Digital portfolio showcasing specialized stone laying expertise.<br />
                        • Standardized quotation builder with clear material scope.<br />
                        • Protected milestone disbursements upon mutual stage completion.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab("worker-dashboard")}
                      className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#172321] hover:text-[#245B50] transition-colors"
                    >
                      <span>Open Worker Portal</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C5A66B]" />
                    </button>
                  </div>

                  {/* Pillar 3: Material Depots */}
                  <div className="p-6 rounded-2xl bg-[#FAF7F0] border border-[#E2DDD2] hover:border-[#245B50] hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-white border border-[#E2DDD2] text-[#245B50] flex items-center justify-center mb-4 shadow-xs">
                        <Store className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-[#172321] mb-2">3. For Material Depots</h3>
                      <p className="text-xs text-stone-600 leading-relaxed space-y-1">
                        • Architectural category specifications with calibrated thicknesses.<br />
                        • Automated 10% wastage buffer calculation (IS 1443 standards).<br />
                        • Doorstep physical sample tile dispatch workflow.<br />
                        • Structured intake portal for trade-licensed suppliers.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab("marketplace")}
                      className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#245B50] hover:text-[#172321] transition-colors"
                    >
                      <span>Explore Material Marketplace</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C5A66B]" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Craftsmen Directory Preview */}
            <WorkerDirectory
              onSelectWorker={(worker) => setSelectedWorkerForModal(worker)}
              onRequestQuote={(worker) => setSelectedWorkerForModal(worker)}
              onOpenCompare={() => {
                setCompareInitialJobId(undefined);
                setIsCompareOpen(true);
              }}
              searchFilterCategory={searchCategory}
              onWorkerRegistered={handleWorkerRegistered}
              externalRegisterOpen={isRegisterWorkerOpen}
              onCloseExternalRegister={() => setIsRegisterWorkerOpen(false)}
            />

            <div className="text-center pb-12 bg-[#F6F2E9]">
              <button
                onClick={() => setActiveTab("workers")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#172321] hover:bg-[#245B50] text-white font-bold text-xs sm:text-sm shadow-xs transition-all"
              >
                <span>View Craftsman Directory & Verified Registry</span>
                <ArrowRight className="w-4 h-4 text-[#C5A66B]" />
              </button>
            </div>

            {/* Simulated Floor Visualizer Banner Teaser */}
            <section className="py-14 bg-[#172321] text-white border-y border-stone-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 space-y-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#245B50]/40 text-[#C5A66B] border border-[#C5A66B]/30 text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A66B]" />
                      Interactive Perspective Projection
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#FAF7F0] font-serif">
                      Preview Flooring Patterns Before Laying Slabs
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                      Select room environments, project Statuario bookmatch marble or 1200x1800mm vitrified slabs, adjust diamond polish reflections, and interact with the Before/After split slider.
                    </p>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={() => setActiveTab("visualizer")}
                        className="px-6 py-3 rounded-xl bg-[#245B50] hover:bg-[#1b433b] text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all"
                      >
                        <Sparkles className="w-4 h-4 text-[#C5A66B]" />
                        <span>Launch Visualizer Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setIsCalculatorOpen(true)}
                        className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all"
                      >
                        Calculate Benchmark Budget
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    <div
                      onClick={() => setActiveTab("visualizer")}
                      className="cursor-pointer group relative rounded-2xl overflow-hidden border border-stone-700 shadow-2xl"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"
                        alt="Architectural Visualizer Preview"
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#172321] via-[#172321]/40 to-transparent flex flex-col justify-end p-6">
                        <span className="text-[#C5A66B] font-bold text-xs">Test interactive studio →</span>
                        <p className="text-white font-bold text-base mt-1 font-serif">
                          Perspective Overlay • Before/After Split Demo
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Curated Laying Patterns */}
            <DesignGallery
              onSelectPatternForVisualizer={() => setActiveTab("visualizer")}
              onFilterWorkersByStyle={(category) => {
                setSearchCategory(category);
                setActiveTab("workers");
              }}
            />

            {/* Material Marketplace Preview */}
            <Marketplace
              onInquireProduct={handleInquireProduct}
              onRequestSample={handleRequestSample}
            />
          </div>
        )}

        {/* VIEW: WORKER DIRECTORY (HOMEOWNER FLOW) */}
        {activeTab === "workers" && (
          <div>
            <div className="bg-[#172321] text-white py-8 px-4 sm:px-8 border-b border-stone-800">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FAF7F0] font-serif">
                    Flooring Craftsmen Directory
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1">
                    Explore craftsman archetypes, compare labor benchmarks, and review verification intake requirements.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCompareInitialJobId(undefined);
                      setIsCompareOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white text-[#172321] font-bold text-xs shadow-xs hover:bg-[#FAF7F0] transition-colors"
                  >
                    Compare Proposals
                  </button>
                  <button
                    onClick={() => setIsPostJobOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#245B50] text-white font-bold text-xs shadow-xs hover:bg-[#1b433b] transition-colors"
                  >
                    Post a Job
                  </button>
                </div>
              </div>
            </div>

            <WorkerDirectory
              onSelectWorker={(worker) => setSelectedWorkerForModal(worker)}
              onRequestQuote={(worker) => setSelectedWorkerForModal(worker)}
              onOpenCompare={() => {
                setCompareInitialJobId(undefined);
                setIsCompareOpen(true);
              }}
              searchFilterCategory={searchCategory}
              onWorkerRegistered={handleWorkerRegistered}
              externalRegisterOpen={isRegisterWorkerOpen}
              onCloseExternalRegister={() => setIsRegisterWorkerOpen(false)}
            />
          </div>
        )}

        {/* VIEW: WORKER DASHBOARD (WORKER FLOW) */}
        {activeTab === "worker-dashboard" && (
          <WorkerDashboard
            jobs={jobs}
            quotations={quotations}
            currentUser={currentUser}
            onUpdateUser={(updated) => setCurrentUser(updated)}
            onSubmitWorkerQuote={handleWorkerSubmitQuote}
            onWithdrawQuote={(quoteId) => handleUpdateQuoteStatus(quoteId, "Withdrawn")}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* VIEW: SIMULATED AI FLOOR VISUALIZER */}
        {activeTab === "visualizer" && (
          <AIFloorVisualizer
            onBookWorkersForStyle={(styleName, category, area) => {
              setPostJobPreFill({
                material: category as FlooringCategory,
                area: area || 750,
                workType: category.includes("Marble")
                  ? "Marble Installation"
                  : category.includes("Tile")
                  ? "Tile Installation"
                  : category.includes("Granite")
                  ? "Granite Installation"
                  : "Other Flooring Work",
              });
              setIsPostJobOpen(true);
              addToast(
                "Flooring Requirement Form Opened",
                `Pre-filled with ${category} (${area || 750} sq.ft scope) from Visualizer Studio.`
              );
            }}
            onOrderMaterial={(materialName) => {
              setActiveTab("marketplace");
              addToast(
                "Material Catalog",
                `Viewing technical stone category specifications for ${materialName}.`
              );
            }}
          />
        )}

        {/* VIEW: MARKETPLACE */}
        {activeTab === "marketplace" && (
          <Marketplace
            onInquireProduct={handleInquireProduct}
            onRequestSample={handleRequestSample}
          />
        )}

        {/* VIEW: DESIGNS & PATTERNS */}
        {activeTab === "designs" && (
          <DesignGallery
            onSelectPatternForVisualizer={() => setActiveTab("visualizer")}
            onFilterWorkersByStyle={(category) => {
              setSearchCategory(category);
              setActiveTab("workers");
            }}
          />
        )}

        {/* VIEW: ABOUT MESTHIRI */}
        {activeTab === "about" && (
          <AboutSection
            onNavigateTab={setActiveTab}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
            onOpenPostJob={() => setIsPostJobOpen(true)}
          />
        )}
      </main>

      {/* 4. Footer */}
      <Footer
        onNavigateTab={setActiveTab}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenPostJob={() => setIsPostJobOpen(true)}
        onOpenCompare={() => {
          setCompareInitialJobId(undefined);
          setIsCompareOpen(true);
        }}
      />

      {/* 5. Modals & Dialogs */}
      {/* Post Job Modal (Connected Homeowner Workflow) */}
      <PostJobModal
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
        onSubmitJob={handlePostJob}
        initialArea={postJobPreFill.area}
        initialMaterial={postJobPreFill.material}
        initialWorkType={postJobPreFill.workType}
        onSwitchToWorkerPortal={() => {
          setIsPostJobOpen(false);
          if (currentUser.role === "worker") {
            setActiveTab("worker-dashboard");
          } else {
            addToast(
              "Access Restricted",
              "The Worker Portal is only accessible to registered Worker accounts. Please log in as a Worker.",
              "info"
            );
          }
        }}
      />

      {/* Compare Quotes Modal (Connected Homeowner Workflow) */}
      <CompareQuotesModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        jobs={jobs}
        quotations={quotations}
        initialJobId={compareInitialJobId}
        onAcceptQuote={handleAcceptQuote}
        onUpdateJobStatus={handleUpdateJobStatus}
        onUpdateQuoteStatus={handleUpdateQuoteStatus}
        onSwitchToWorkerPortal={() => {
          setIsCompareOpen(false);
          if (currentUser.role === "worker") {
            setActiveTab("worker-dashboard");
          } else {
            addToast(
              "Access Restricted",
              "The Worker Portal is only accessible to registered Worker accounts. Please log in as a Worker.",
              "info"
            );
          }
        }}
      />

      {/* Admin Verification & Labour Card Review Console */}
      <AdminVerificationModal
        isOpen={isAdminConsoleOpen}
        onClose={() => setIsAdminConsoleOpen(false)}
        currentUser={currentUser}
        onStatusUpdated={() => {
          addToast("Audit Logged", "Worker verification status updated.");
        }}
      />

      {/* Worker Detail / Direct Quote Modal */}
      <WorkerDetailModal
        worker={selectedWorkerForModal}
        onClose={() => setSelectedWorkerForModal(null)}
        onRequestQuote={handleDirectWorkerQuote}
      />

      {/* Cost Calculator Modal */}
      <CostCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        initialArea={calculatorInitialArea}
        onProceedToPostJob={(area, material) => {
          setIsCalculatorOpen(false);
          setPostJobPreFill({
            area,
            material,
            workType: material.includes("Marble")
              ? "Marble Installation"
              : material.includes("Tile")
              ? "Tile Installation"
              : material.includes("Granite")
              ? "Granite Installation"
              : "Other Flooring Work",
          });
          setIsPostJobOpen(true);
          addToast(
            "Flooring Requirement Form Opened",
            `Pre-filled with ${material} (${area} sq.ft) from Budget Calculator.`
          );
        }}
      />

      {/* Toast Feedback System */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
