"use client";

import React, { useState } from "react";
import { ActiveAppTab, TELANGANA_CITIES } from "@/types";
import {
  Search,
  MapPin,
  Compass,
  ArrowRight,
  Eye,
  Layers,
  FileCheck2,
  Sparkles,
  ShieldCheck,
  Building2,
  Navigation,
} from "lucide-react";

interface HeroSectionProps {
  onSearch: (category: string, location: string, minArea: number) => void;
  onNavigateTab: (tab: ActiveAppTab) => void;
  onOpenCalculator: () => void;
  onOpenPostJob: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onNavigateTab,
  onOpenCalculator,
  onOpenPostJob,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [selectedCity, setSelectedCity] = useState<string>("Hyderabad");
  const [areaInput, setAreaInput] = useState<number>(1200);
  const [locationNote, setLocationNote] = useState<string>("");

  const categories: string[] = [
    "All Categories",
    "Italian Marble",
    "Indian Marble",
    "Black Galaxy Granite",
    "Granite",
    "Vitrified Tiles",
    "Ceramic Tiles",
    "Terrazzo / Mosaic",
    "Wooden / Laminate",
  ];

  const telanganaCities = TELANGANA_CITIES as readonly string[];

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationNote("Geolocation is not supported by your browser.");
      return;
    }

    setLocationNote("Requesting location permission...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Approximate city based on Telangana bounds
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocationNote(`Approx location acquired (${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E). Estimated regional center: Hyderabad`);
        setSelectedCity("Hyderabad");
      },
      (error) => {
        setLocationNote("Location access denied or unavailable. Defaulted to Hyderabad, Telangana.");
      },
      { timeout: 8000 }
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(selectedCategory, selectedCity, areaInput);
    onNavigateTab("workers");
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF7F0] border-b border-[#E2DDD2] pt-8 pb-16">
      {/* Subtle Architectural Pattern Background */}
      <div className="absolute inset-0 architectural-grid opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb Note */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E2DDD2] bg-white text-xs text-[#6E6B65] shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#245B50]" />
            <span className="font-semibold text-[#172321]">Telangana Flooring Services & Stone Marketplace</span>
            <span className="text-[#C5A66B]">•</span>
            <span>Innovation Engineering Capstone</span>
          </div>
        </div>

        {/* Hero Main Grid (Text + Sophisticated Architectural Photo) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-14">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#245B50]/10 text-[#245B50] font-bold text-xs uppercase tracking-wider border border-[#245B50]/20">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A66B]" />
                Flooring Craftsmanship & Materials Platform
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-bold text-[#172321] tracking-tight leading-[1.14] font-serif">
                Skilled Hands. Beautiful Homes.
              </h1>
            </div>

            <p className="text-base sm:text-lg text-[#6E6B65] max-w-2xl leading-relaxed font-sans">
              Find flooring professionals, explore materials, and bring your dream floor to life with MESTHIRI.
            </p>

            {/* Main Required CTAs: Find a Worker, Post a Job, Explore Floor Designs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Primary CTA: Find a Worker */}
              <button
                onClick={() => onNavigateTab("workers")}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-[#F6F2E9] bg-[#245B50] hover:bg-[#1A443C] border border-[#245B50] shadow-sm transition-all cursor-pointer hover:shadow-md"
                title="Browse verified flooring craftsmen"
              >
                <span>Find a Worker</span>
                <ArrowRight className="w-4 h-4 text-[#C5A66B]" />
              </button>

              {/* Secondary CTA: Post a Job */}
              <button
                onClick={onOpenPostJob}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-[#172321] bg-white hover:bg-[#F6F2E9] border border-[#E2DDD2] shadow-2xs transition-all cursor-pointer hover:border-[#245B50]"
                title="Post your flooring requirements to receive bids"
              >
                <FileCheck2 className="w-4 h-4 text-[#245B50]" />
                <span>Post a Job</span>
              </button>

              {/* Additional CTA: Explore Floor Designs */}
              <button
                onClick={() => onNavigateTab("designs")}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-[#172321] bg-[#FAF7F0] hover:bg-white border border-[#E2DDD2] shadow-2xs transition-all cursor-pointer hover:border-[#C5A66B]"
                title="Explore floor patterns and laying styles"
              >
                <Sparkles className="w-4 h-4 text-[#C5A66B]" />
                <span>Explore Floor Designs</span>
              </button>

              {/* Budget Estimator Shortcut */}
              <button
                onClick={onOpenCalculator}
                className="inline-flex items-center gap-1.5 px-3 py-3 rounded-xl text-xs font-semibold text-[#6E6B65] hover:text-[#172321] hover:bg-stone-100/60 transition-all cursor-pointer"
                title="Open quick area calculator"
              >
                Quick Calculator
              </button>
            </div>

            <div className="text-[11px] text-[#6E6B65] flex items-center gap-2 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#245B50] shrink-0" />
              <span>
                Verified Craftsmen & Commercial Stone Suppliers across Telangana. No fake worker profiles or fabricated ratings.
              </span>
            </div>
          </div>

          {/* Right Column: Sophisticated Architectural Flooring Photograph */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-[#E2DDD2] bg-white shadow-md group">
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80"
                alt="Architectural natural marble and continuous stone flooring in modern interior"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#172321]/85 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C5A66B]">
                  Architectural Reference Photography
                </span>
                <p className="text-sm font-medium text-[#F6F2E9] mt-0.5">
                  Natural Calacatta Vein Continuity & Calibrated Slab Installation
                </p>
                <span className="text-[10px] text-[#F6F2E9]/70">
                  Curated architectural interior reference (Unsplash library)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Architectural Search Bar with Telangana City Selector */}
        <div className="max-w-4xl mx-auto bg-white p-5 rounded-xl shadow-sm border border-[#E2DDD2] mb-14">
          <div className="text-xs font-semibold text-[#172321] uppercase tracking-wider mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#245B50]" />
              Search Contractors & Suppliers in Telangana
            </span>
            <span className="text-[11px] font-normal text-[#6E6B65]">
              Google Places Live Directory + Benchmark Archetypes
            </span>
          </div>

          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Specialization */}
            <div className="sm:col-span-5">
              <label className="block text-xs font-medium text-[#6E6B65] mb-1">
                Flooring Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E2DDD2] bg-[#FAF7F0] text-[#172321] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Telangana City Selector */}
            <div className="sm:col-span-4">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-[#6E6B65]">
                  City / Location (Telangana)
                </label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  className="text-[10px] text-[#245B50] hover:underline flex items-center gap-0.5"
                  title="Detect approximate location"
                >
                  <Navigation className="w-2.5 h-2.5" />
                  Detect GPS
                </button>
              </div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E2DDD2] bg-[#FAF7F0] text-[#172321] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
              >
                {telanganaCities.map((city) => (
                  <option key={city} value={city}>
                    {city}, Telangana
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Action */}
            <div className="sm:col-span-3 flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold text-white bg-[#172321] hover:bg-[#245B50] transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Search className="w-4 h-4 text-[#C5A66B]" />
                <span>Find Services</span>
              </button>
            </div>
          </form>

          {locationNote && (
            <p className="text-[11px] text-[#6E6B65] mt-2 italic flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A66B]" />
              {locationNote}
            </p>
          )}
        </div>

        {/* 4 Honest Platform Value Propositions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-[#E2DDD2] shadow-2xs hover:border-[#245B50] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#E8F0EE] text-[#245B50] flex items-center justify-center mb-2.5">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-[#172321]">Skilled Worker Discovery</h4>
            <p className="text-xs text-[#6E6B65] mt-1 leading-relaxed">
              Standardized profiles, skill specializations, and benchmark labor rates per square foot.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E2DDD2] shadow-2xs hover:border-[#245B50] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F0] text-[#C5A66B] flex items-center justify-center mb-2.5 border border-[#E2DDD2]">
              <FileCheck2 className="w-4 h-4 text-[#245B50]" />
            </div>
            <h4 className="text-sm font-bold text-[#172321]">Transparent Quotations</h4>
            <p className="text-xs text-[#6E6B65] mt-1 leading-relaxed">
              Itemized bids separating labor, leveling, surface prep, and diamond crystallization polish.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E2DDD2] shadow-2xs hover:border-[#245B50] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#E8F0EE] text-[#245B50] flex items-center justify-center mb-2.5">
              <Eye className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-[#172321]">Flooring Design Preview</h4>
            <p className="text-xs text-[#6E6B65] mt-1 leading-relaxed">
              Interactive perspective room visualizer with Before/After split slider and surface sheen.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E2DDD2] shadow-2xs hover:border-[#245B50] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F0] text-[#172321] flex items-center justify-center mb-2.5 border border-[#E2DDD2]">
              <Building2 className="w-4 h-4 text-[#245B50]" />
            </div>
            <h4 className="text-sm font-bold text-[#172321]">Material Exploration</h4>
            <p className="text-xs text-[#6E6B65] mt-1 leading-relaxed">
              Architectural stone standards, origin transparency, and IS 1443 10% wastage allowance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
