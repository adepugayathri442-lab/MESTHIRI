"use client";

import React, { useState } from "react";
import { ActiveAppTab } from "@/types";
import {
  Users,
  Briefcase,
  Eye,
  ArrowRight,
  Sparkles,
  Calculator,
  RotateCcw,
  Info,
  ShieldCheck,
  UserPlus,
  Layers,
  CheckCircle2,
  Hammer,
} from "lucide-react";

interface HomeSectionsProps {
  onNavigateTab: (tab: ActiveAppTab) => void;
  onOpenPostJob: () => void;
  onOpenRegisterWorker: () => void;
  onOpenCalculatorModal: (preFillArea?: number) => void;
  onSelectMarketplaceCategory: (category: string) => void;
}

export const HomeSections: React.FC<HomeSectionsProps> = ({
  onNavigateTab,
  onOpenPostJob,
  onOpenRegisterWorker,
  onOpenCalculatorModal,
  onSelectMarketplaceCategory,
}) => {
  // =========================================================================
  // STATE: Flooring Cost Calculator Shortcut
  // =========================================================================
  const [calcLength, setCalcLength] = useState<string>("20");
  const [calcWidth, setCalcWidth] = useState<string>("15");
  const [calcUnit, setCalcUnit] = useState<"feet" | "metres">("feet");
  const [calcError, setCalcError] = useState<string | null>(null);

  // Compute reactive values
  const numLength = parseFloat(calcLength);
  const numWidth = parseFloat(calcWidth);
  const isValidInputs =
    !isNaN(numLength) &&
    !isNaN(numWidth) &&
    numLength > 0 &&
    numWidth > 0 &&
    numLength <= 1000 &&
    numWidth <= 1000;

  let areaSqFt = 0;
  let areaSqM = 0;

  if (isValidInputs) {
    if (calcUnit === "feet") {
      areaSqFt = numLength * numWidth;
      areaSqM = areaSqFt * 0.092903;
    } else {
      areaSqM = numLength * numWidth;
      areaSqFt = areaSqM * 10.7639;
    }
  }

  const handleResetCalculator = () => {
    setCalcLength("20");
    setCalcWidth("15");
    setCalcUnit("feet");
    setCalcError(null);
  };

  const handleLengthChange = (val: string) => {
    setCalcLength(val);
    const n = parseFloat(val);
    if (val.trim() === "") {
      setCalcError("Please enter room length.");
    } else if (isNaN(n) || n <= 0) {
      setCalcError("Length must be a positive number greater than 0.");
    } else if (n > 1000) {
      setCalcError("Maximum supported single room dimension is 1,000 units.");
    } else {
      setCalcError(null);
    }
  };

  const handleWidthChange = (val: string) => {
    setCalcWidth(val);
    const n = parseFloat(val);
    if (val.trim() === "") {
      setCalcError("Please enter room width.");
    } else if (isNaN(n) || n <= 0) {
      setCalcError("Width must be a positive number greater than 0.");
    } else if (n > 1000) {
      setCalcError("Maximum supported single room dimension is 1,000 units.");
    } else {
      setCalcError(null);
    }
  };

  return (
    <div className="space-y-0">
      {/* ===================================================================== */}
      {/* SECTION 4: “What Can You Do with MESTHIRI?”                            */}
      {/* ===================================================================== */}
      <section className="py-16 bg-white border-b border-[#E2DDD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#245B50]/10 text-[#245B50] font-bold text-xs uppercase tracking-wider border border-[#245B50]/20 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A66B]" />
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#172321] tracking-tight font-serif">
              What Can You Do with MESTHIRI?
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6B65] mt-2 leading-relaxed">
              Designed for homeowners and artisans to eliminate informal gaps in stone flooring with transparent workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Find Skilled Workers */}
            <div className="p-7 rounded-2xl bg-[#FAF7F0] border border-[#E2DDD2] hover:border-[#245B50] hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E2DDD2] text-[#245B50] flex items-center justify-center mb-5 shadow-2xs group-hover:bg-[#245B50] group-hover:text-white transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#172321] mb-2 font-serif">
                  1. Find Skilled Workers
                </h3>
                <p className="text-xs text-[#6E6B65] leading-relaxed">
                  Browse verified marble masons, granite craftsmen, and tile installers across Telangana. Inspect trade experience, rate benchmarks, and request direct quotations.
                </p>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onNavigateTab("workers")}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#245B50] hover:bg-[#1A443C] text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                >
                  <span>Find Skilled Workers</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A66B]" />
                </button>
              </div>
            </div>

            {/* Card 2: Post a Flooring Job */}
            <div className="p-7 rounded-2xl bg-[#FAF7F0] border border-[#E2DDD2] hover:border-[#245B50] hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E2DDD2] text-[#245B50] flex items-center justify-center mb-5 shadow-2xs group-hover:bg-[#245B50] group-hover:text-white transition-colors">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#172321] mb-2 font-serif">
                  2. Post a Flooring Job
                </h3>
                <p className="text-xs text-[#6E6B65] leading-relaxed">
                  Specify your room dimensions, choice of marble or tile, and project location. Receive transparent, itemized quotes separating stone fixing and diamond polishing.
                </p>
              </div>

              <div className="pt-6">
                <button
                  onClick={onOpenPostJob}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#172321] hover:bg-[#245B50] text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                >
                  <span>Post a Flooring Job</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A66B]" />
                </button>
              </div>
            </div>

            {/* Card 3: Visualize Your Floor */}
            <div className="p-7 rounded-2xl bg-[#FAF7F0] border border-[#E2DDD2] hover:border-[#245B50] hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E2DDD2] text-[#245B50] flex items-center justify-center mb-5 shadow-2xs group-hover:bg-[#245B50] group-hover:text-white transition-colors">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#172321] mb-2 font-serif">
                  3. Visualize Your Floor
                </h3>
                <p className="text-xs text-[#6E6B65] leading-relaxed">
                  Preview Italian marble, granites, and vitrified tiles directly in interactive perspective rooms. Test Before/After split views, sheen levels, and angles before purchasing slabs.
                </p>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onNavigateTab("visualizer")}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F6F2E9] border border-[#E2DDD2] text-[#172321] font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                >
                  <span>Visualize Your Floor</span>
                  <ArrowRight className="w-4 h-4 text-[#245B50]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 5: Flooring Categories Section                                 */}
      {/* ===================================================================== */}
      <section className="py-16 bg-[#FAF7F0] border-b border-[#E2DDD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A66B]/15 text-[#8C6D23] font-bold text-xs uppercase tracking-wider border border-[#C5A66B]/30 mb-2">
                <Layers className="w-3.5 h-3.5 text-[#C5A66B]" />
                Material Classifications
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172321] tracking-tight font-serif">
                Flooring Categories
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6B65] mt-1 max-w-xl">
                Explore standardized architectural stone categories, benchmark specs, and local supplier depots.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab("marketplace")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#245B50] hover:text-[#172321] transition-colors cursor-pointer"
            >
              <span>View Full Marketplace Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A66B]" />
            </button>
          </div>

          {/* 4 Clean Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {/* 1. Tiles */}
            <div
              onClick={() => onSelectMarketplaceCategory("Vitrified Tiles")}
              className="bg-white rounded-2xl border border-[#E2DDD2] p-5 shadow-2xs hover:border-[#245B50] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative rounded-xl overflow-hidden h-36 mb-4 bg-stone-100">
                  <img
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"
                    alt="Vitrified Tiles"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-[#172321]/80 backdrop-blur-xs text-[10px] font-bold text-white">
                    GVT & PGVT Formats
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#172321] group-hover:text-[#245B50] transition-colors font-serif">
                  Tiles
                </h3>
                <p className="text-xs text-[#6E6B65] mt-1 line-clamp-2 leading-relaxed">
                  Vitrified, ceramic, and large-format porcelain slabs (600x1200mm up to 1200x1800mm) with water absorption &lt;0.05%.
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-[#E2DDD2] flex items-center justify-between text-xs font-bold text-[#245B50]">
                <span>Explore Tile Specs</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A66B] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 2. Marble */}
            <div
              onClick={() => onSelectMarketplaceCategory("Italian Marble")}
              className="bg-white rounded-2xl border border-[#E2DDD2] p-5 shadow-2xs hover:border-[#245B50] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative rounded-xl overflow-hidden h-36 mb-4 bg-stone-100">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
                    alt="Natural Italian Marble"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-[#172321]/80 backdrop-blur-xs text-[10px] font-bold text-white">
                    Italian & Indian
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#172321] group-hover:text-[#245B50] transition-colors font-serif">
                  Marble
                </h3>
                <p className="text-xs text-[#6E6B65] mt-1 line-clamp-2 leading-relaxed">
                  Calibrated gangsaw slabs from Carrara, Makrana, and Rajsamand. Natural bookmatching veins with crystallization polish.
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-[#E2DDD2] flex items-center justify-between text-xs font-bold text-[#245B50]">
                <span>Explore Marble Slabs</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A66B] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 3. Granite */}
            <div
              onClick={() => onSelectMarketplaceCategory("Granite")}
              className="bg-white rounded-2xl border border-[#E2DDD2] p-5 shadow-2xs hover:border-[#245B50] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative rounded-xl overflow-hidden h-36 mb-4 bg-stone-100">
                  <img
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80"
                    alt="Black Galaxy Granite"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-[#172321]/80 backdrop-blur-xs text-[10px] font-bold text-white">
                    Heavy-Duty Slabs
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#172321] group-hover:text-[#245B50] transition-colors font-serif">
                  Granite
                </h3>
                <p className="text-xs text-[#6E6B65] mt-1 line-clamp-2 leading-relaxed">
                  Black Galaxy, Tan Brown, and Steel Grey plutonic slabs with near-zero porosity, heat resistance, and extreme hardness.
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-[#E2DDD2] flex items-center justify-between text-xs font-bold text-[#245B50]">
                <span>Explore Granite Specs</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A66B] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 4. Floor Polishing */}
            <div
              onClick={() => onSelectMarketplaceCategory("Flooring Polish & Accessories")}
              className="bg-white rounded-2xl border border-[#E2DDD2] p-5 shadow-2xs hover:border-[#245B50] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative rounded-xl overflow-hidden h-36 mb-4 bg-stone-100">
                  <img
                    src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80"
                    alt="Floor Polishing & Crystallization"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-[#172321]/80 backdrop-blur-xs text-[10px] font-bold text-white">
                    7-Stage Crystallization
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#172321] group-hover:text-[#245B50] transition-colors font-serif">
                  Floor Polishing
                </h3>
                <p className="text-xs text-[#6E6B65] mt-1 line-clamp-2 leading-relaxed">
                  Planetary diamond pads, slurry extraction, and fluorosilicate crystallization for restoring deep gloss reflections.
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-[#E2DDD2] flex items-center justify-between text-xs font-bold text-[#245B50]">
                <span>Explore Polish Kits</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A66B] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Honest Empty State & Real Data Disclosure */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Transparent Depot Registry Notice:</strong> No commercial products listed yet. Registered partner shops will appear here once trade-license verification is verified. MESTHIRI does not fabricate retail shop listings or fake product stock.
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 6: “How It Works” Section                                     */}
      {/* ===================================================================== */}
      <section className="py-16 bg-white border-b border-[#E2DDD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#245B50]/10 text-[#245B50] font-bold text-xs uppercase tracking-wider border border-[#245B50]/20 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#245B50]" />
              Structured Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#172321] tracking-tight font-serif">
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6B65] mt-2 leading-relaxed">
              Three simple steps to coordinate quality flooring work with transparent documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-[#FAF7F0] border border-[#E2DDD2] shadow-2xs hover:border-[#245B50] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#245B50] text-[#FAF7F0] font-extrabold text-sm flex items-center justify-center mb-4 shadow-xs">
                01
              </div>
              <h3 className="text-base font-bold text-[#172321] mb-2 font-serif">
                Step 1: Post Your Flooring Requirement
              </h3>
              <p className="text-xs text-[#6E6B65] leading-relaxed">
                Specify your room measurements, floor type (marble, granite, or tiles), and target location. Describe surface preparation needs to initiate a structured inquiry.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E2DDD2] text-[11px] font-semibold text-[#245B50] flex items-center gap-1">
                <span>Working Job Form</span>
                <span>• Instant Lead Dispatch</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-[#FAF7F0] border border-[#E2DDD2] shadow-2xs hover:border-[#245B50] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#172321] text-[#C5A66B] font-extrabold text-sm flex items-center justify-center mb-4 shadow-xs">
                02
              </div>
              <h3 className="text-base font-bold text-[#172321] mb-2 font-serif">
                Step 2: Review Available Workers and Compare Quotes
              </h3>
              <p className="text-xs text-[#6E6B65] leading-relaxed">
                Compare itemized proposals breaking down surface leveling, fixing labor, and diamond crystallization polishing. <em>(Prototype comparison flow with authentic rate benchmarks)</em>.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E2DDD2] text-[11px] font-semibold text-[#172321] flex items-center gap-1">
                <span>Side-by-Side Comparison</span>
                <span>• IS 1443 Scopes</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-[#FAF7F0] border border-[#E2DDD2] shadow-2xs hover:border-[#245B50] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#C5A66B] text-[#172321] font-extrabold text-sm flex items-center justify-center mb-4 shadow-xs">
                03
              </div>
              <h3 className="text-base font-bold text-[#172321] mb-2 font-serif">
                Step 3: Select a Worker and Track the Job
              </h3>
              <p className="text-xs text-[#6E6B65] leading-relaxed">
                Choose a qualified craftsman and track work progression across foundation leveling, laying, and final inspection. <em>(Simulated prototype milestone workflow)</em>.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E2DDD2] text-[11px] font-semibold text-[#8C6D23] flex items-center gap-1">
                <span>Milestone Stage Tracking</span>
                <span>• Prototype Workflow</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 8: “Join as a Flooring Professional” Recruitment Section      */}
      {/* ===================================================================== */}
      <section className="py-16 bg-[#172321] text-[#FAF7F0] border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#245B50]/60 text-[#C5A66B] border border-[#C5A66B]/30 text-xs font-semibold uppercase tracking-wider">
                <Hammer className="w-3.5 h-3.5 text-[#C5A66B]" />
                Worker Recruitment
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
                Are You a Skilled Flooring Professional?
              </h2>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl">
                Join MESTHIRI to showcase your skills and connect with homeowners looking for flooring services.
              </p>
              <p className="text-xs text-stone-400 leading-relaxed max-w-2xl">
                Create a professional profile, receive direct job leads without middleman commissions, and link your Telangana BOCWWB or e-Shram worker credentials for verified trust.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onOpenRegisterWorker}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#245B50] hover:bg-[#1A443C] text-white font-bold text-sm shadow-md transition-all cursor-pointer border border-[#C5A66B]/40"
                >
                  <UserPlus className="w-4 h-4 text-[#C5A66B]" />
                  <span>Register as a MESTHIRI</span>
                </button>

                <button
                  onClick={() => onNavigateTab("schemes")}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 font-semibold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#C5A66B]" />
                  <span>Explore BOCWWB Schemes</span>
                </button>
              </div>

              <div className="text-[11px] text-stone-400 pt-1 flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-[#C5A66B] shrink-0" />
                <span>
                  Development Demo Mode available inside the registration form to test worker intake safely without real documents.
                </span>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="p-6 rounded-2xl bg-black/40 border border-stone-800 space-y-3">
                <h4 className="text-xs font-bold text-[#C5A66B] uppercase tracking-wider">
                  Registration Standard
                </h4>
                <ul className="text-xs text-stone-300 space-y-2.5">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A66B] mt-1.5 shrink-0" />
                    <span>New profiles start in <strong>Pending Verification</strong> status.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A66B] mt-1.5 shrink-0" />
                    <span>Identity documents kept strictly in private audit storage.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A66B] mt-1.5 shrink-0" />
                    <span>No unapproved profiles appear in the public homeowner directory.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 9: Flooring Cost Calculator Shortcut                           */}
      {/* ===================================================================== */}
      <section className="py-16 bg-[#FAF7F0] border-b border-[#E2DDD2]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-[#E2DDD2] shadow-sm p-6 sm:p-10">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 pb-6 border-b border-[#E2DDD2]">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#245B50]/10 text-[#245B50] font-bold text-xs uppercase tracking-wider mb-2">
                  <Calculator className="w-3.5 h-3.5 text-[#245B50]" />
                  Flooring Cost Calculator Shortcut
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#172321] font-serif">
                  Calculate Your Floor Area
                </h3>
                <p className="text-xs sm:text-sm text-[#6E6B65] mt-1">
                  Enter your room dimensions to estimate total flooring area accurately in feet or metres.
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetCalculator}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#6E6B65] hover:text-[#172321] hover:bg-[#FAF7F0] border border-[#E2DDD2] transition-colors self-start cursor-pointer"
                title="Reset calculator inputs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
              {/* Length Input */}
              <div>
                <label className="block text-xs font-semibold text-[#172321] mb-1.5">
                  Room Length
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    step="0.5"
                    value={calcLength}
                    onChange={(e) => handleLengthChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2DDD2] bg-[#FAF7F0] text-sm text-[#172321] font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                    placeholder="e.g. 20"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-[#6E6B65] font-semibold">
                    {calcUnit === "feet" ? "ft" : "m"}
                  </span>
                </div>
              </div>

              {/* Width Input */}
              <div>
                <label className="block text-xs font-semibold text-[#172321] mb-1.5">
                  Room Width
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    step="0.5"
                    value={calcWidth}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2DDD2] bg-[#FAF7F0] text-sm text-[#172321] font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                    placeholder="e.g. 15"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-[#6E6B65] font-semibold">
                    {calcUnit === "feet" ? "ft" : "m"}
                  </span>
                </div>
              </div>

              {/* Unit Toggle */}
              <div>
                <label className="block text-xs font-semibold text-[#172321] mb-1.5">
                  Measurement Unit
                </label>
                <div className="grid grid-cols-2 gap-1 p-1 bg-[#FAF7F0] rounded-xl border border-[#E2DDD2]">
                  <button
                    type="button"
                    onClick={() => setCalcUnit("feet")}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      calcUnit === "feet"
                        ? "bg-[#245B50] text-white shadow-2xs"
                        : "text-[#6E6B65] hover:text-[#172321]"
                    }`}
                  >
                    Feet (ft)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcUnit("metres")}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      calcUnit === "metres"
                        ? "bg-[#245B50] text-white shadow-2xs"
                        : "text-[#6E6B65] hover:text-[#172321]"
                    }`}
                  >
                    Metres (m)
                  </button>
                </div>
              </div>
            </div>

            {/* Error Banner */}
            {calcError && (
              <div className="p-3 mb-6 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {calcError}
              </div>
            )}

            {/* Calculation Result Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F0] border border-[#E2DDD2] flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E6B65]">
                  Calculated Floor Area
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#172321] font-serif">
                    {isValidInputs ? areaSqFt.toLocaleString("en-IN", { maximumFractionDigits: 1 }) : "0"}{" "}
                    <span className="text-lg font-sans font-medium text-[#6E6B65]">sq.ft</span>
                  </span>
                  <span className="text-sm font-semibold text-[#245B50] bg-white px-2.5 py-1 rounded-lg border border-[#E2DDD2]">
                    ≈ {isValidInputs ? areaSqM.toFixed(1) : "0"} sq.m
                  </span>
                </div>

                <p className="text-xs text-[#6E6B65] mt-2 max-w-xl leading-relaxed">
                  <strong>Pricing Note:</strong> Estimated project cost requires the selected material (marble, granite, or vitrified tiles) and actual local labour rates. MESTHIRI does not invent final prices without material specifications.
                </p>
              </div>

              <div className="shrink-0 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => onOpenCalculatorModal(Math.round(areaSqFt))}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#245B50] hover:bg-[#1A443C] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
                >
                  <Calculator className="w-4 h-4 text-[#C5A66B]" />
                  <span>Open Full Project Estimator</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenPostJob}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#FAF7F0] text-[#172321] font-semibold text-xs border border-[#E2DDD2] transition-colors cursor-pointer"
                >
                  <span>Post Job with this Scope</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#245B50]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
