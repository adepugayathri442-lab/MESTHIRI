"use client";

import React from "react";
import { SAMPLE_DESIGN_STYLES } from "@/data/designs";
import { FlooringCategory } from "@/types";
import {
  Sparkles,
  ArrowRight,
  Eye,
  Layers,
  Compass,
} from "lucide-react";

interface DesignGalleryProps {
  onSelectPatternForVisualizer: (patternId: string) => void;
  onFilterWorkersByStyle: (category: FlooringCategory) => void;
}

export const DesignGallery: React.FC<DesignGalleryProps> = ({
  onSelectPatternForVisualizer,
  onFilterWorkersByStyle,
}) => {
  return (
    <section id="designs-section" className="py-12 bg-white border-t border-[#E2DDD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#172321] text-[#C5A66B] font-semibold text-xs mb-2">
              <Compass className="w-3.5 h-3.5 text-[#C5A66B]" />
              Architectural Layouts & Laying Geometries
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172321] tracking-tight">
              Curated Flooring Patterns & Design Archetypes
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Explore signature architectural laying geometries crafted by master mesthiris. Preview how bookmatched veins, herringbone angles, and brass dividers transform room aesthetics.
            </p>
          </div>
        </div>

        {/* Designs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_DESIGN_STYLES.map((design) => (
            <div
              key={design.id}
              className="bg-[#FAF7F0] rounded-2xl border border-[#E2DDD2] overflow-hidden shadow-xs hover:shadow-md hover:border-[#245B50] transition-all flex flex-col justify-between group"
            >
              {/* Pattern Banner Header */}
              <div className="p-6 bg-[#172321] text-white relative overflow-hidden">
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#245B50] text-[#FAF7F0]">
                    {design.patternType}
                  </span>
                  <span className="text-[11px] font-semibold text-[#C5A66B]">
                    Architectural Layout
                  </span>
                </div>

                <h3 className="text-lg font-bold tracking-tight text-white relative z-10">
                  {design.name}
                </h3>
                <p className="text-xs text-stone-300 mt-1 relative z-10 font-medium">
                  {design.colorTone}
                </p>

                {/* Subtle Decorative Pattern */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 opacity-5 bg-white rounded-full blur-lg" />
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {design.description}
                  </p>

                  <div className="mb-4">
                    <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider mb-1.5">
                      Recommended Room Types:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {design.suitableRooms.map((room) => (
                        <span
                          key={room}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#FAF7F0] text-stone-700 border border-[#E2DDD2]"
                        >
                          {room}
                        </span>
                      ))}
                    </div>
                  </div>

                  {design.technicalNote && (
                    <div className="mb-4 p-2.5 rounded-lg bg-[#FAF7F0] border border-[#E2DDD2] text-[11px] text-stone-600 leading-normal">
                      <strong className="text-[#172321]">Installation Protocol:</strong> {design.technicalNote}
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-[#F6F2E9] border border-[#E2DDD2] text-xs">
                    <span className="text-stone-500 block text-[10px] font-medium uppercase">
                      Benchmark Turnkey Budget:
                    </span>
                    <span className="font-extrabold text-[#245B50] text-sm">
                      {design.estimatedCostRange}
                    </span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="mt-5 pt-4 border-t border-[#E2DDD2] grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectPatternForVisualizer(design.id)}
                    className="py-2 px-3 rounded-xl text-xs font-bold text-white bg-[#172321] hover:bg-[#245B50] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#C5A66B]" />
                    Visualizer
                  </button>

                  <button
                    onClick={() => onFilterWorkersByStyle(design.category)}
                    className="py-2 px-3 rounded-xl text-xs font-bold text-stone-800 bg-[#FAF7F0] hover:bg-stone-200 border border-[#E2DDD2] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Mesthiris</span>
                    <ArrowRight className="w-3 h-3 text-[#245B50]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
