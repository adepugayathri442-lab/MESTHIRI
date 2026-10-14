"use client";

import React, { useState } from "react";
import { Worker } from "@/types";
import {
  X,
  MapPin,
  Calendar,
  Layers,
  Send,
  Award,
  Sparkles,
  Info,
  ShieldAlert,
} from "lucide-react";

interface WorkerDetailModalProps {
  worker: Worker | null;
  onClose: () => void;
  onRequestQuote: (worker: Worker, notes: string) => void;
}

export const WorkerDetailModal: React.FC<WorkerDetailModalProps> = ({
  worker,
  onClose,
  onRequestQuote,
}) => {
  const [customNotes, setCustomNotes] = useState("");
  const [requestedArea, setRequestedArea] = useState(1200);

  if (!worker) return null;

  const estimatedLaborCost = requestedArea * worker.typicalSqftRate;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    onRequestQuote(worker, customNotes || `Requesting quote for ${requestedArea} sq.ft.`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172321]/70 backdrop-blur-sm overflow-y-auto animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="worker-modal-name"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl border border-[#E2DDD2] overflow-hidden my-6">
        {/* Modal Header */}
        <div className="relative bg-[#172321] text-[#F6F2E9] p-6 border-b border-[#245B50]/40">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded text-[#F6F2E9]/70 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={worker.avatarUrl}
              alt={worker.name}
              className="w-16 h-16 rounded object-cover border border-[#C5A66B]/50 shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF7F0] text-[#172321] uppercase tracking-wider">
                  {worker.verificationStatus || "Registered on MESTHIRI"}
                </span>
              </div>
              <h3 id="worker-modal-name" className="text-xl font-bold font-serif text-[#F6F2E9]">
                {worker.name}
              </h3>
              <p className="text-xs text-[#C5A66B] font-medium mt-0.5">{worker.title}</p>
              <p className="text-[11px] text-[#F6F2E9]/70 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#C5A66B]" />
                {worker.location}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6 bg-[#FAF7F0]/40">
          {/* Transparency Disclaimer */}
          <div className="p-3 rounded bg-[#E8F0EE] border border-[#245B50]/30 text-xs text-[#172321] flex items-start gap-2">
            <Info className="w-4 h-4 text-[#245B50] shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Academic Demonstration Notice:</strong> This profile represents an illustrative contractor archetype to demonstrate the quotation and rate comparison interface. No real commercial contract is executed.
            </div>
          </div>

          {/* About & Craftsmanship Profile */}
          <div>
            <h4 className="text-xs font-bold text-[#172321] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-serif">
              <Award className="w-4 h-4 text-[#245B50]" />
              Trade Specialization & Scope Archetype
            </h4>
            <p className="text-xs text-[#5E6C68] leading-relaxed">{worker.about}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {worker.specializationBadges.map((badge) => (
                <span
                  key={badge}
                  className="px-2.5 py-1 rounded text-[11px] font-medium bg-white text-[#172321] border border-[#E2DDD2]"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Key Reference Benchmarks */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded bg-white border border-[#E2DDD2]">
              <span className="text-[10px] text-[#5E6C68] block">Reference Benchmark Rate</span>
              <span className="text-sm font-bold text-[#172321]">₹{worker.typicalSqftRate} / sq.ft</span>
            </div>
            <div className="p-3 rounded bg-white border border-[#E2DDD2]">
              <span className="text-[10px] text-[#5E6C68] block">Trade Experience</span>
              <span className="text-xs font-bold text-[#245B50]">~{worker.experienceYears} Years</span>
            </div>
            <div className="p-3 rounded bg-white border border-[#E2DDD2]">
              <span className="text-[10px] text-[#5E6C68] block">Languages Spoken</span>
              <span className="text-xs text-[#172321]">{worker.languages.join(", ")}</span>
            </div>
          </div>

          {/* Core Flooring Categories */}
          <div>
            <h4 className="text-xs font-bold text-[#172321] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-serif">
              <Layers className="w-4 h-4 text-[#245B50]" />
              Stone & Tile Formats Handled
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {worker.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded text-xs font-medium bg-white text-[#172321] border border-[#E2DDD2]"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Direct Quotation Simulation Form */}
          <div className="p-5 rounded-lg bg-white border border-[#E2DDD2] shadow-2xs">
            <h4 className="text-xs font-bold text-[#172321] uppercase tracking-wider mb-1 flex items-center gap-2 font-serif">
              <Send className="w-3.5 h-3.5 text-[#245B50]" />
              Test Quotation Dispatch with {worker.name.split(" ")[0]}
            </h4>
            <p className="text-[11px] text-[#5E6C68] mb-3">
              Enter your floor area to calculate an automated labor cost breakdown based on the benchmark rate.
            </p>

            <form onSubmit={handleSend} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#172321] mb-1">
                    Floor Area (sq.ft)
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={25000}
                    value={requestedArea}
                    onChange={(e) => setRequestedArea(Number(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-xs rounded border border-[#E2DDD2] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#172321] mb-1">
                    Estimated Labor Benchmark
                  </label>
                  <div className="w-full px-3 py-1.5 text-xs font-bold text-[#245B50] bg-[#E8F0EE] rounded border border-[#245B50]/20 flex items-center">
                    ₹{estimatedLaborCost.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#172321] mb-1">
                  Specific Project Notes & Inquiries
                </label>
                <textarea
                  rows={2}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g. Slabs delivered at site, need laser leveling and diamond crystallization polish."
                  className="w-full px-3 py-1.5 text-xs rounded border border-[#E2DDD2] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-[#5E6C68]">
                  Prototype test mode • Simulated quotation
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 rounded text-xs font-semibold text-[#F6F2E9] bg-[#245B50] hover:bg-[#1A443C] transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Dispatch Sample Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
