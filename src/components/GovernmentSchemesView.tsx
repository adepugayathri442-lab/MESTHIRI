"use client";

import React, { useState, useMemo } from "react";
import { GOVERNMENT_SCHEMES } from "@/data/schemes";
import { GovernmentScheme } from "@/types";
import {
  Award,
  ExternalLink,
  ShieldCheck,
  Building2,
  FileText,
  CheckCircle2,
  HelpCircle,
  Search,
  Filter,
  Sparkles,
  Info,
  DollarSign,
  HeartPulse,
  Hammer,
} from "lucide-react";

export const GovernmentSchemesView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [selectedLevel, setSelectedLevel] = useState<string>("All Levels");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    "All Categories",
    "Welfare",
    "Credit & Toolkits",
    "Skill Certification",
    "Social Security",
    "Healthcare",
  ];

  const levels = ["All Levels", "Telangana State", "Central Government"];

  const filteredSchemes = useMemo(() => {
    return GOVERNMENT_SCHEMES.filter((scheme) => {
      if (selectedCategory !== "All Categories" && scheme.category !== selectedCategory) {
        return false;
      }
      if (selectedLevel !== "All Levels" && scheme.level !== selectedLevel) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          scheme.title.toLowerCase().includes(q) ||
          scheme.description.toLowerCase().includes(q) ||
          scheme.department.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedLevel, searchQuery]);

  return (
    <div className="py-10 bg-[#FAF7F0] min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Hero */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#172321] text-[#C5A66B] font-semibold text-xs border border-[#C5A66B]/30 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A66B]" />
            Official Welfare & Skilling Schemes • Telangana & India
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#172321] tracking-tight font-serif">
            Worker Government Schemes & Skilling Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6B65] mt-2 leading-relaxed">
            A comprehensive, verified directory of statutory welfare programs, toolkit subsidies, accidental insurance, and RPL skill certifications available to marble workers, tile masons, and construction craftsmen.
          </p>
        </div>

        {/* Transparency Banner */}
        <div className="p-4 rounded-2xl bg-white border border-[#E2DDD2] shadow-2xs flex items-start gap-3 text-xs text-[#6E6B65] leading-relaxed">
          <Info className="w-4 h-4 text-[#245B50] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#172321]">Factual Data Integrity Notice:</strong> All scheme details, eligibility requirements, and financial amounts are sourced from verified public portals of the <em>Ministry of Labour & Employment</em>, the <em>Telangana BOCW Welfare Board</em>, and the <em>Ministry of MSME</em>. MESTHIRI connects unorganized stone craftsmen with genuine government welfare opportunities.
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2DDD2] shadow-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#6E6B65]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search schemes by name or benefit..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2DDD2] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
              >
                {levels.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#6E6B65] pt-1">
            <span>
              Showing <strong>{filteredSchemes.length}</strong> official welfare programs
            </span>
            <span className="text-[11px] font-semibold text-[#245B50]">
              Official Portal Links Attached
            </span>
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-3xl border border-[#E2DDD2] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3.5">
                {/* Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F0EE] text-[#245B50] border border-[#245B50]/20 uppercase tracking-wider">
                    {scheme.level}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FAF7F0] border border-[#E2DDD2] text-stone-700">
                    {scheme.category}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#172321] leading-snug">
                    {scheme.title}
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-1 font-medium">
                    Governed by: {scheme.department}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-[#6E6B65] leading-relaxed">
                  {scheme.description}
                </p>

                {/* Key Benefits */}
                <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E2DDD2] space-y-1.5 text-xs">
                  <span className="font-bold text-[#172321] block text-[11px] uppercase tracking-wider">
                    Key Entitlements & Financial Benefits:
                  </span>
                  <ul className="space-y-1 text-[#6E6B65]">
                    {scheme.keyBenefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#245B50] shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-tight">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Eligibility */}
                <div className="text-xs space-y-1">
                  <span className="font-bold text-[#172321] block text-[11px]">
                    Eligibility Criteria:
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-stone-600 text-[11px]">
                    {scheme.eligibility.slice(0, 3).map((e, idx) => (
                      <li key={idx}>{e}</li>
                    ))}
                  </ul>
                </div>

                {/* Required Documents */}
                <div className="text-[11px] text-stone-500">
                  <strong className="text-stone-700">Required Documents:</strong>{" "}
                  {scheme.requiredDocuments.join(" • ")}
                </div>
              </div>

              {/* Action Link to Official Portal */}
              <div className="pt-4 border-t border-[#E2DDD2] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <span className="text-[10px] text-stone-400 italic">
                  Application Mode: {scheme.applicationMode}
                </span>

                <a
                  href={scheme.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#245B50] hover:bg-[#1A443C] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <span>Official Government Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#C5A66B]" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
