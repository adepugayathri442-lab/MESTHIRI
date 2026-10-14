"use client";

import React, { useState, useEffect } from "react";
import {
  FlooringCategory,
  FlooringWorkType,
  MaterialResponsibility,
  JobListing,
  TELANGANA_CITIES,
} from "@/types";
import {
  X,
  PlusCircle,
  Calculator,
  CheckCircle,
  Info,
  Calendar,
  Layers,
  MapPin,
  Image as ImageIcon,
  CheckSquare,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitJob: (job: JobListing) => void;
  initialArea?: number;
  initialMaterial?: FlooringCategory;
  initialWorkType?: FlooringWorkType;
  onSwitchToWorkerPortal?: () => void;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({
  isOpen,
  onClose,
  onSubmitJob,
  initialArea,
  initialMaterial,
  initialWorkType,
  onSwitchToWorkerPortal,
}) => {
  // Form State
  const [title, setTitle] = useState("");
  const [homeownerName, setHomeownerName] = useState("");
  const [workType, setWorkType] = useState<FlooringWorkType>(
    initialWorkType || "Marble Installation"
  );
  const [city, setCity] = useState<string>("Hyderabad");
  const [location, setLocation] = useState("Kondapur, Hyderabad");
  const [areaSqFt, setAreaSqFt] = useState<number>(initialArea || 1200);
  const [flooringType, setFlooringType] = useState<FlooringCategory>(
    initialMaterial || "Italian Marble"
  );
  const [roomType, setRoomType] = useState("Living & Dining Hall");
  const [materialResponsibility, setMaterialResponsibility] =
    useState<MaterialResponsibility>("Homeowner supplies materials");
  const [budgetMin, setBudgetMin] = useState<number>(85000);
  const [budgetMax, setBudgetMax] = useState<number>(120000);
  const [preferredStartDate, setPreferredStartDate] = useState("Within 10 days");
  const [expectedCompletionDate, setExpectedCompletionDate] =
    useState("Within 25 days");
  const [selectedPhotoPreset, setSelectedPhotoPreset] = useState<string>(
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
  );
  const [description, setDescription] = useState("");
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([
    "Optical laser datum calibration (IS 1443)",
    "Dry layout vein matching and homeowner preview",
    "7-stage diamond crystallization polish",
  ]);

  // Submission & Confirmation state
  const [submittedJob, setSubmittedJob] = useState<JobListing | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize when initial props change
  useEffect(() => {
    if (initialArea) setAreaSqFt(initialArea);
    if (initialMaterial) setFlooringType(initialMaterial);
    if (initialWorkType) setWorkType(initialWorkType);
  }, [initialArea, initialMaterial, initialWorkType, isOpen]);

  if (!isOpen) return null;

  // Illustrative benchmark rates for reference estimation
  const benchmarkRate: Record<FlooringCategory, number> = {
    "Italian Marble": 75,
    "Indian Marble": 55,
    "Black Galaxy Granite": 50,
    "Granite": 48,
    "Vitrified Tiles": 36,
    "Ceramic Tiles": 32,
    "Terrazzo / Mosaic": 65,
    "Wooden / Laminate": 42,
    "Adhesives & Grout": 25,
    "Flooring Polish & Accessories": 28,
  };

  const estimatedLaborCost = areaSqFt * (benchmarkRate[flooringType] || 45);
  const estimatedPolishingCost =
    flooringType.includes("Marble") || flooringType.includes("Terrazzo")
      ? Math.round(areaSqFt * 18)
      : 0;
  const targetBudgetEst = estimatedLaborCost + estimatedPolishingCost;

  const requirementOptions = [
    "Optical laser datum calibration (IS 1443)",
    "Joint lippage tolerance < 1.0mm",
    "Dry layout vein matching and homeowner preview",
    "Two-component epoxy resin joint grouting",
    "7-stage diamond crystallization polish",
    "Subfloor screed leveling & slurry wash",
    "Debris bagging & post-job vacuum cleaning",
  ];

  const handleToggleRequirement = (req: string) => {
    if (selectedRequirements.includes(req)) {
      setSelectedRequirements(selectedRequirements.filter((r) => r !== req));
    } else {
      setSelectedRequirements([...selectedRequirements, req]);
    }
  };

  const photoPresets = [
    {
      label: "Italian Statuario Marble",
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    },
    {
      label: "Large-Format Vitrified Slabs",
      url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
    },
    {
      label: "Polished Granite Flooring",
      url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
    },
    {
      label: "Seamless Terrazzo",
      url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const handleResetAndClose = () => {
    setSubmittedJob(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = "Job title is required.";
    if (!homeownerName.trim()) newErrors.homeownerName = "Homeowner or architect name is required.";
    if (!location.trim()) newErrors.location = "Site address/neighborhood is required.";
    if (areaSqFt < 50) newErrors.areaSqFt = "Minimum flooring area is 50 sq.ft.";
    if (budgetMax < budgetMin) newErrors.budgetMax = "Maximum budget must be greater than minimum.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const newJob: JobListing = {
      id: `job-${Date.now()}`,
      title: title.trim(),
      homeownerName: homeownerName.trim(),
      workType,
      city,
      location: location.trim(),
      areaSqFt,
      flooringType,
      roomType,
      materialResponsibility,
      materialsProvidedBy:
        materialResponsibility === "Homeowner supplies materials"
          ? "Homeowner"
          : materialResponsibility === "Worker supplies materials"
          ? "Mesthiri"
          : "Discuss",
      budgetMin,
      budgetMax,
      budgetEst: targetBudgetEst,
      preferredStartDate,
      expectedCompletionDate,
      photos: selectedPhotoPreset ? [selectedPhotoPreset] : [],
      additionalRequirements: selectedRequirements,
      postedDate: "Just now (Demo Submission)",
      status: "Open for Quotes",
      description:
        description.trim() ||
        `Requirement for ${areaSqFt} sq.ft ${roomType} requiring ${workType} with ${flooringType}. Materials: ${materialResponsibility}.`,
      quotesReceived: 0,
      urgency: "Standard",
      isSampleJob: false,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedJob(newJob);
      onSubmitJob(newJob);
    }, 300);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172321]/75 backdrop-blur-sm overflow-y-auto animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-job-title"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E2DDD2] overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-[#172321] text-white flex items-center justify-between border-b border-[#245B50]/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#245B50]/50 rounded-xl text-[#C5A66B] border border-[#C5A66B]/30">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 text-[#C5A66B] text-[10px] font-bold uppercase tracking-wider mb-0.5">
                Homeowner Project Console • Academic Prototype A
              </div>
              <h3 id="post-job-title" className="text-base sm:text-lg font-bold font-serif">
                Post Flooring Requirement
              </h3>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================ */}
        {/* VIEW 1: CONFIRMATION SCREEN (Shown immediately after submit) */}
        {/* ============================================================ */}
        {submittedJob ? (
          <div className="p-6 sm:p-8 space-y-6 text-center bg-[#FAF7F0]/40 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs border border-emerald-300">
              <CheckCircle className="w-9 h-9 text-emerald-700" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#245B50] uppercase tracking-wider bg-[#E8F0EE] px-3 py-1 rounded-full border border-[#245B50]/20">
                Demo Job Logged in Local State
              </span>
              <h4 className="text-xl sm:text-2xl font-bold text-[#172321] mt-2">
                Flooring Requirement Published!
              </h4>
              <p className="text-xs text-[#6E6B65] mt-1 max-w-md mx-auto">
                Your requirement for <strong>{submittedJob.title}</strong> has been registered with status:{" "}
                <span className="font-bold text-emerald-700">“Open for Quotes”</span>.
              </p>
            </div>

            {/* Job Summary Ticket */}
            <div className="bg-white p-5 rounded-xl border border-[#E2DDD2] shadow-xs text-left max-w-lg mx-auto text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#E2DDD2] pb-2">
                <span className="text-stone-500">Requirement ID</span>
                <span className="font-mono font-bold text-[#172321]">{submittedJob.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-stone-400 block text-[10px]">Work Type</span>
                  <span className="font-bold text-[#172321]">{submittedJob.workType}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Location</span>
                  <span className="font-bold text-[#172321]">{submittedJob.city}, Telangana</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Floor Area</span>
                  <span className="font-bold text-[#172321]">{submittedJob.areaSqFt} sq.ft</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Material Scope</span>
                  <span className="font-bold text-[#172321]">{submittedJob.flooringType}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Material Responsibility</span>
                  <span className="font-bold text-[#245B50]">{submittedJob.materialResponsibility}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Target Budget</span>
                  <span className="font-bold text-[#172321]">
                    ₹{submittedJob.budgetMin?.toLocaleString("en-IN")} – ₹{submittedJob.budgetMax?.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Prototype Notice */}
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 text-left flex items-start gap-2.5 max-w-lg mx-auto">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="leading-relaxed text-[11px]">
                <strong>Academic Prototype A Notice:</strong> This submission is recorded in local demonstration state. It is now visible to the <strong>Worker Dashboard</strong> under <em>“Nearby Job Leads”</em> for testing craftsman quotation submissions. No live SMS or phone dispatch was sent to real-world workers.
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {onSwitchToWorkerPortal && (
                <button
                  type="button"
                  onClick={() => {
                    handleResetAndClose();
                    onSwitchToWorkerPortal();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#172321] hover:bg-[#245B50] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
                >
                  <span>Switch to Worker Portal & Submit Quote</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A66B]" />
                </button>
              )}
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-5 py-2.5 rounded-xl bg-white border border-[#E2DDD2] hover:bg-[#FAF7F0] text-[#172321] font-semibold text-xs transition-colors"
              >
                Close Dialog
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* VIEW 2: JOB REQUIREMENT INTAKE FORM                          */
          /* ============================================================ */
          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-4 max-h-[75vh] overflow-y-auto bg-[#FAF7F0]/30 text-xs"
          >
            {/* Context Badge if initial values are linked */}
            {(initialArea || initialMaterial) && (
              <div className="p-2.5 rounded-lg bg-[#E8F0EE] border border-[#245B50]/30 text-[#245B50] flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C5A66B]" />
                  <span>Linked from Budget Calculator / Floor Visualizer</span>
                </div>
                <span>
                  {initialMaterial} • {initialArea} sq.ft
                </span>
              </div>
            )}

            {/* Academic Notice */}
            <div className="p-3 rounded-lg bg-white border border-[#E2DDD2] text-[11px] text-[#6E6B65] flex items-start gap-2 shadow-2xs">
              <Info className="w-4 h-4 text-[#245B50] shrink-0 mt-0.5" />
              <span>
                <strong>Prototype Notice:</strong> Submitting adds this requirement to the demo job pool, enabling interactive quotation bids in the Worker Dashboard. Data is maintained in local application state.
              </span>
            </div>

            {/* Project Title & Client Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#172321] mb-1">
                  Project Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors({ ...errors, title: "" });
                  }}
                  placeholder="e.g. 1,450 sq.ft Italian Statuario Marble Laying"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    errors.title ? "border-rose-500 bg-rose-50" : "border-[#E2DDD2] bg-[#FAF7F0]"
                  } focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]`}
                />
                {errors.title && <p className="text-[10px] text-rose-500 mt-0.5">{errors.title}</p>}
              </div>

              <div>
                <label className="block font-semibold text-[#172321] mb-1">
                  Homeowner / Architect Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={homeownerName}
                  onChange={(e) => {
                    setHomeownerName(e.target.value);
                    if (errors.homeownerName) setErrors({ ...errors, homeownerName: "" });
                  }}
                  placeholder="e.g. P. Venkateswarlu / Client #4"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    errors.homeownerName ? "border-rose-500 bg-rose-50" : "border-[#E2DDD2] bg-[#FAF7F0]"
                  } focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]`}
                />
                {errors.homeownerName && (
                  <p className="text-[10px] text-rose-500 mt-0.5">{errors.homeownerName}</p>
                )}
              </div>
            </div>

            {/* Work Type & Material Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#172321] mb-1">
                  Work Classification <span className="text-rose-500">*</span>
                </label>
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value as FlooringWorkType)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2DDD2] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                >
                  <option value="Marble Installation">Marble Installation</option>
                  <option value="Granite Installation">Granite Installation</option>
                  <option value="Tile Installation">Tile Installation</option>
                  <option value="Floor Polishing">Floor Polishing & Crystallization</option>
                  <option value="Other Flooring Work">Other Flooring Work (Terrazzo / Wood)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#172321] mb-1">
                  Primary Material Scope <span className="text-rose-500">*</span>
                </label>
                <select
                  value={flooringType}
                  onChange={(e) => setFlooringType(e.target.value as FlooringCategory)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2DDD2] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                >
                  <option value="Italian Marble">Italian Marble (Statuario, Dyna, Botticino)</option>
                  <option value="Indian Marble">Indian Marble (Makrana, Rajsamand)</option>
                  <option value="Black Galaxy Granite">Black Galaxy Granite</option>
                  <option value="Granite">Standard Natural Granite</option>
                  <option value="Vitrified Tiles">Vitrified Tiles (1200x1800mm Slabs)</option>
                  <option value="Ceramic Tiles">Ceramic Tiles</option>
                  <option value="Terrazzo / Mosaic">Artisanal Terrazzo with Brass Divider</option>
                  <option value="Wooden / Laminate">Hardwood / Engineered Wooden Planks</option>
                </select>
              </div>
            </div>

            {/* Location (City + Address) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#172321] mb-1">
                  Telangana City <span className="text-rose-500">*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setLocation(`${location.split(",")[0]}, ${e.target.value}`);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2DDD2] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                >
                  {TELANGANA_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}, Telangana
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#172321] mb-1">
                  Site Neighborhood / Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (errors.location) setErrors({ ...errors, location: "" });
                  }}
                  placeholder="e.g. Madhapur, Hyderabad"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    errors.location ? "border-rose-500 bg-rose-50" : "border-[#E2DDD2] bg-[#FAF7F0]"
                  } focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]`}
                />
                {errors.location && (
                  <p className="text-[10px] text-rose-500 mt-0.5">{errors.location}</p>
                )}
              </div>
            </div>

            {/* Floor Area & Room Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#172321] mb-1">
                  Floor Area (sq.ft) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min={50}
                  max={25000}
                  value={areaSqFt}
                  onChange={(e) => {
                    setAreaSqFt(Number(e.target.value) || 0);
                    if (errors.areaSqFt) setErrors({ ...errors, areaSqFt: "" });
                  }}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    errors.areaSqFt ? "border-rose-500 bg-rose-50" : "border-[#E2DDD2] bg-[#FAF7F0]"
                  } focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]`}
                />
                {errors.areaSqFt && (
                  <p className="text-[10px] text-rose-500 mt-0.5">{errors.areaSqFt}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-[#172321] mb-1">Room / Space Classification</label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2DDD2] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                >
                  <option value="Living & Dining Hall">Living & Dining Hall</option>
                  <option value="Entire 3BHK Residence">Entire 3BHK Residence</option>
                  <option value="Master Bedroom Suite">Master Bedroom Suite</option>
                  <option value="Internal Duplex Staircase">Internal Duplex Staircase</option>
                  <option value="Gourmet Kitchen">Gourmet Kitchen</option>
                  <option value="Commercial Lobby / Retail">Commercial Lobby / Retail</option>
                </select>
              </div>
            </div>

            {/* Material Responsibility */}
            <div>
              <label className="block font-semibold text-[#172321] mb-1.5">
                Material Procurement Responsibility <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    value: "Homeowner supplies materials",
                    label: "Homeowner Supplies",
                    sub: "Labour & tools only",
                  },
                  {
                    value: "Worker supplies materials",
                    label: "Worker Supplies",
                    sub: "Turnkey stone + labour",
                  },
                  {
                    value: "Quotation required for both",
                    label: "Quote for Both",
                    sub: "Compare options",
                  },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setMaterialResponsibility(opt.value as MaterialResponsibility)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      materialResponsibility === opt.value
                        ? "border-[#245B50] bg-[#E8F0EE] ring-1 ring-[#245B50]"
                        : "border-[#E2DDD2] bg-white hover:bg-[#FAF7F0]"
                    }`}
                  >
                    <span className="font-bold text-[#172321] block leading-tight">{opt.label}</span>
                    <span className="text-[10px] text-stone-500 block mt-0.5">{opt.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Range (Min, Max, Benchmark) */}
            <div className="p-3 rounded-xl bg-white border border-[#E2DDD2] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#172321]">Target Budget Range (₹)</span>
                <span className="text-[11px] text-[#245B50] font-semibold">
                  Illustrative Reference: ~₹{targetBudgetEst.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-stone-500 block mb-0.5">Minimum Budget (₹)</label>
                  <input
                    type="number"
                    min={5000}
                    step={1000}
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded border border-[#E2DDD2] bg-[#FAF7F0] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-500 block mb-0.5">Maximum Budget (₹)</label>
                  <input
                    type="number"
                    min={5000}
                    step={1000}
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded border border-[#E2DDD2] bg-[#FAF7F0] focus:bg-white"
                  />
                  {errors.budgetMax && (
                    <p className="text-[10px] text-rose-500 mt-0.5">{errors.budgetMax}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Schedule / Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#172321] mb-1">
                  Preferred Start Date
                </label>
                <select
                  value={preferredStartDate}
                  onChange={(e) => setPreferredStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2DDD2] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                >
                  <option value="Immediate start">Immediate (Within 48 hours)</option>
                  <option value="Within 10 days">Within 10 days</option>
                  <option value="Within 2-3 weeks">Within 2–3 weeks</option>
                  <option value="Flexible schedule">Flexible schedule (Planning phase)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#172321] mb-1">
                  Expected Completion Timeline
                </label>
                <select
                  value={expectedCompletionDate}
                  onChange={(e) => setExpectedCompletionDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2DDD2] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                >
                  <option value="Within 10 days">Within 10 days</option>
                  <option value="Within 18 days">Within 18 days</option>
                  <option value="Within 25 days">Within 25 days</option>
                  <option value="Within 45 days">Within 45 days</option>
                </select>
              </div>
            </div>

            {/* Reference Photos Selection */}
            <div>
              <label className="block font-semibold text-[#172321] mb-1">
                Reference Image / Style Pattern
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {photoPresets.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setSelectedPhotoPreset(preset.url)}
                    className={`relative rounded-lg overflow-hidden border p-1 text-left transition-all ${
                      selectedPhotoPreset === preset.url
                        ? "border-[#245B50] ring-2 ring-[#245B50]"
                        : "border-[#E2DDD2] opacity-75 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-14 object-cover rounded"
                    />
                    <span className="text-[10px] font-semibold text-[#172321] block mt-1 truncate">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Requirements Checklist */}
            <div>
              <label className="block font-semibold text-[#172321] mb-1.5">
                Technical Specifications & Work Tolerances (IS 1443)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {requirementOptions.map((req) => {
                  const checked = selectedRequirements.includes(req);
                  return (
                    <label
                      key={req}
                      className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                        checked ? "bg-[#E8F0EE] border-[#245B50]/40" : "bg-white border-[#E2DDD2]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggleRequirement(req)}
                        className="mt-0.5 rounded text-[#245B50] focus:ring-[#245B50]"
                      />
                      <span className="text-[11px] text-[#172321] leading-tight">{req}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Scope Notes */}
            <div>
              <label className="block font-semibold text-[#172321] mb-1">
                Detailed Site Notes for Contractors
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. 2nd floor flat with service lift access. Sub-base already dry. Need dustless wet diamond cutting."
                className="w-full px-3 py-2 rounded-lg border border-[#E2DDD2] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E2DDD2]">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 font-semibold text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-[#245B50] hover:bg-[#1A443C] font-bold text-white shadow-xs transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Publishing..." : "Submit Flooring Requirement"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
