"use client";

import React from "react";
import { ActiveAppTab } from "@/types";
import {
  Layers,
  Users,
  Briefcase,
  Store,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Info,
  Compass,
  FileCheck2,
  Calculator,
} from "lucide-react";

interface AboutSectionProps {
  onNavigateTab: (tab: ActiveAppTab) => void;
  onOpenCalculator: () => void;
  onOpenPostJob: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onNavigateTab,
  onOpenCalculator,
  onOpenPostJob,
}) => {
  return (
    <div className="bg-[#FAF7F0] py-12 border-b border-[#E2DDD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#172321] text-[#C5A66B] font-semibold text-xs border border-[#C5A66B]/30">
            <Layers className="w-3.5 h-3.5 text-[#C5A66B]" />
            Academic Capstone • Innovation Engineering
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172321] tracking-tight font-serif">
            About MESTHIRI
          </h1>

          <p className="text-sm sm:text-base text-[#6E6B65] leading-relaxed">
            Find Trusted Flooring Professionals. Plan Every Detail with Confidence. MESTHIRI is an architectural construction-tech platform engineered to eliminate informal labor friction, lippage hazards, and procurement opacity in the flooring sector.
          </p>

          {/* Prototype A Transparency Notice */}
          <div className="p-4 rounded-xl bg-white border border-[#E2DDD2] text-xs text-[#6E6B65] shadow-2xs text-left flex items-start gap-3 max-w-2xl mx-auto">
            <Info className="w-4 h-4 text-[#245B50] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-[#172321]">Academic Prototype A Notice:</strong> This web application is an academic demonstration developed for an Innovation Engineering presentation. Some profiles, prices, quotations, and interactions use illustrative demo data to show the user journey. Live business data integration and paid external APIs are intentionally reserved for a future production phase.
            </p>
          </div>
        </div>

        {/* The 3 Stakeholder Pillars */}
        <div>
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-[#245B50] uppercase tracking-wider">
              Platform Architecture
            </span>
            <h2 className="text-2xl font-bold text-[#172321] mt-1 font-serif">
              Connecting Three Core Construction Stakeholders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Homeowners */}
            <div className="bg-white rounded-2xl border border-[#E2DDD2] p-6 shadow-2xs flex flex-col justify-between hover:border-[#245B50] transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2] text-[#245B50] flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#172321] mb-2 font-serif">
                  1. Homeowners
                </h3>
                <p className="text-xs text-[#6E6B65] leading-relaxed mb-4">
                  Homeowners investing in marble and tile flooring often struggle with price uncertainty, unqualified labor, and uneven edges (lippage). MESTHIRI empowers homeowners with:
                </p>
                <ul className="text-xs text-[#6E6B65] space-y-1.5 mb-6">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#245B50] shrink-0 mt-0.5" />
                    <span>Transparent sq.ft benchmark bidding across labor and polishing.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#245B50] shrink-0 mt-0.5" />
                    <span>Interactive Floor Visualizer to preview patterns before slab purchase.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#245B50] shrink-0 mt-0.5" />
                    <span>Phased milestone escrow ensuring quality tolerance checks.</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onNavigateTab("workers")}
                className="w-full py-2 px-3 rounded-lg bg-[#FAF7F0] hover:bg-[#245B50] hover:text-white text-[#172321] font-semibold text-xs border border-[#E2DDD2] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Browse Craftsmen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2. Workers / Mesthiris */}
            <div className="bg-white rounded-2xl border border-[#E2DDD2] p-6 shadow-2xs flex flex-col justify-between hover:border-[#245B50] transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#172321] text-[#C5A66B] flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#172321] mb-2 font-serif">
                  2. Skilled Mesthiris
                </h3>
                <p className="text-xs text-[#6E6B65] leading-relaxed mb-4">
                  Skilled stone masons and tile layers traditionally rely on word-of-mouth or exploitative intermediaries. MESTHIRI provides craftsmen with:
                </p>
                <ul className="text-xs text-[#6E6B65] space-y-1.5 mb-6">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#245B50] shrink-0 mt-0.5" />
                    <span>Direct access to local homeowner job leads without contractor cuts.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#245B50] shrink-0 mt-0.5" />
                    <span>Standardized itemized quotation builder for labor, prep, and polish.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#245B50] shrink-0 mt-0.5" />
                    <span>Structured milestone payments unlocked upon verified site signoffs.</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onNavigateTab("worker-dashboard")}
                className="w-full py-2 px-3 rounded-lg bg-[#172321] hover:bg-[#245B50] text-[#F6F2E9] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Worker Workstation</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A66B]" />
              </button>
            </div>

            {/* 3. Material Depots */}
            <div className="bg-white rounded-2xl border border-[#E2DDD2] p-6 shadow-2xs flex flex-col justify-between hover:border-[#245B50] transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2] text-[#245B50] flex items-center justify-center mb-4">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#172321] mb-2 font-serif">
                  3. Material Depots
                </h3>
                <p className="text-xs text-[#6E6B65] leading-relaxed mb-4">
                  Stone yards, marble importers, and tile distributors face high wastage disputes and fragmented catalog reach. MESTHIRI supports suppliers with:
                </p>
                <ul className="text-xs text-[#6E6B65] space-y-1.5 mb-6">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#245B50] shrink-0 mt-0.5" />
                    <span>Architectural category specifications with standard slab thicknesses.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#245B50] shrink-0 mt-0.5" />
                    <span>Automated 10% wastage allowance calculation per IS 1443 standards.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#245B50] shrink-0 mt-0.5" />
                    <span>Direct connection to verified local residential projects.</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onNavigateTab("marketplace")}
                className="w-full py-2 px-3 rounded-lg bg-[#FAF7F0] hover:bg-[#245B50] hover:text-white text-[#172321] font-semibold text-xs border border-[#E2DDD2] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Explore Materials</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Engineering Standards Deep-Dive */}
        <div className="bg-white rounded-2xl border border-[#E2DDD2] p-8 shadow-2xs space-y-6">
          <div>
            <span className="text-xs font-bold text-[#245B50] uppercase tracking-wider">
              Engineering Rigor
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#172321] mt-1 font-serif">
              Indian Standard (IS 1443) & Optical Laser Alignment
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6B65] mt-2 leading-relaxed">
              In conventional unorganized construction, flooring contractors rely on manual spirit levels and water tubes, resulting in tile lippage exceeding 2–3mm. MESTHIRI establishes standardized technical protocols:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2] space-y-2">
              <span className="text-xs font-bold text-[#245B50] block">TOLERANCE 1: LIFT & LIPPAGE</span>
              <h4 className="text-sm font-bold text-[#172321]">&lt; 1.0mm Joint Lippage</h4>
              <p className="text-xs text-[#6E6B65] leading-relaxed">
                Adjacent tile or marble slab height difference must remain strictly under 1.0mm tested with a dial indicator to eliminate tripping edges.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2] space-y-2">
              <span className="text-xs font-bold text-[#245B50] block">TOLERANCE 2: DATUM ALIGNMENT</span>
              <h4 className="text-sm font-bold text-[#172321]">360° Optical Laser Datum</h4>
              <p className="text-xs text-[#6E6B65] leading-relaxed">
                Calibration using cross-line optical laser levels across door thresholds and corridor transitions, guaranteeing uniform slope toward drainage points.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2] space-y-2">
              <span className="text-xs font-bold text-[#245B50] block">TOLERANCE 3: CRYSTALLIZATION</span>
              <h4 className="text-sm font-bold text-[#172321]">7-Grade Diamond Buffing</h4>
              <p className="text-xs text-[#6E6B65] leading-relaxed">
                Progressive abrasive resin pads (50# through 3000# grit) followed by fluorosilicate chemical crystallization to achieve specular mirror reflections.
              </p>
            </div>
          </div>
        </div>

        {/* Prototype A Presentation Footer CTA */}
        <div className="p-8 rounded-2xl bg-[#172321] text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-[#C5A66B] uppercase tracking-wider block mb-1">
              Interactive Prototype A
            </span>
            <h3 className="text-xl font-bold font-serif">
              Ready to Explore the Flooring Platform?
            </h3>
            <p className="text-xs text-stone-300 mt-1 max-w-xl">
              Experience the homeowner quotation comparison, simulated floor visualizer, and contractor workstation console.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab("workers")}
              className="px-4 py-2.5 rounded-xl bg-[#245B50] hover:bg-[#1A443C] text-xs font-bold text-white transition-colors"
            >
              Browse Mesthiris
            </button>
            <button
              onClick={onOpenCalculator}
              className="px-4 py-2.5 rounded-xl bg-white text-[#172321] hover:bg-[#FAF7F0] text-xs font-bold transition-colors"
            >
              Budget Calculator
            </button>
            <button
              onClick={() => onNavigateTab("visualizer")}
              className="px-4 py-2.5 rounded-xl border border-stone-600 hover:border-white text-xs font-bold text-stone-200 transition-colors"
            >
              Visualizer Studio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
