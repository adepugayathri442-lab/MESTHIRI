"use client";

import React, { useState } from "react";
import { ActiveAppTab } from "@/types";
import { Logo } from "@/components/Logo";
import {
  Info,
  ShieldCheck,
  FileText,
  Mail,
  HelpCircle,
  X,
  Lock,
  ArrowRight,
  Calculator,
} from "lucide-react";

interface FooterProps {
  onNavigateTab: (tab: ActiveAppTab) => void;
  onOpenCalculator: () => void;
  onOpenPostJob: () => void;
  onOpenCompare: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateTab,
  onOpenCalculator,
  onOpenPostJob,
  onOpenCompare,
}) => {
  const [activeModal, setActiveModal] = useState<"help" | "privacy" | "terms" | null>(null);

  return (
    <footer className="bg-[#172321] text-stone-300 border-t border-stone-800 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info (2 Columns) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <Logo theme="light" size="md" showTagline={true} />
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Connecting homeowners, skilled flooring craftsmen, and stone suppliers with transparent quotations, verifiable standards, and perspective room visualizer.
            </p>

            <div className="p-3.5 rounded-xl bg-black/40 border border-stone-800 text-xs text-stone-400">
              <span className="font-bold text-[#C5A66B] flex items-center gap-1.5 mb-1">
                College Innovation Engineering Capstone
              </span>
              Engineered to address informal construction labor gaps, irregular tile lippage tolerances (IS 1443), and material procurement fragmentation.
            </div>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigateTab("home")}
                  className="hover:text-[#C5A66B] transition-colors cursor-pointer text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab("workers")}
                  className="hover:text-[#C5A66B] transition-colors cursor-pointer text-left"
                >
                  Find Workers
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPostJob}
                  className="hover:text-[#C5A66B] transition-colors cursor-pointer text-left"
                >
                  Post a Job
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab("visualizer")}
                  className="hover:text-[#C5A66B] transition-colors cursor-pointer text-left"
                >
                  Floor Visualizer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab("marketplace")}
                  className="hover:text-[#C5A66B] transition-colors cursor-pointer text-left"
                >
                  Marketplace
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCalculator}
                  className="hover:text-[#C5A66B] transition-colors cursor-pointer text-left"
                >
                  Cost Calculator
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Standards */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              About & Governance
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigateTab("about")}
                  className="hover:text-[#C5A66B] transition-colors text-white font-medium cursor-pointer text-left"
                >
                  About MESTHIRI
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab("schemes")}
                  className="hover:text-[#C5A66B] transition-colors cursor-pointer text-left"
                >
                  BOCWWB Welfare Schemes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab("designs")}
                  className="hover:text-[#C5A66B] transition-colors cursor-pointer text-left"
                >
                  Laying Patterns & Standards
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCompare}
                  className="hover:text-[#C5A66B] transition-colors cursor-pointer text-left"
                >
                  Compare Itemized Quotes
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Legal Notices */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Support & Transparency
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => setActiveModal("help")}
                  className="hover:text-[#C5A66B] transition-colors cursor-pointer flex items-center gap-1.5 text-left"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#C5A66B]" />
                  <span>Help / Contact</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal("privacy")}
                  className="hover:text-[#C5A66B] transition-colors cursor-pointer flex items-center gap-1.5 text-left"
                >
                  <Lock className="w-3.5 h-3.5 text-[#245B50]" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal("terms")}
                  className="hover:text-[#C5A66B] transition-colors cursor-pointer flex items-center gap-1.5 text-left"
                >
                  <FileText className="w-3.5 h-3.5 text-[#245B50]" />
                  <span>Terms and Conditions</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Presentation Disclaimer & Real Data Disclosure */}
        <div className="pt-8 border-t border-stone-800 text-xs text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-2.5 text-left max-w-3xl">
            <Info className="w-4 h-4 text-[#C5A66B] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Academic Presentation Notice:</strong> MESTHIRI is an Innovation Engineering capstone project. All worker archetypes, project simulations, and material listings shown are illustrative prototype records designed to demonstrate platform architecture. No claims of active commercial business partnerships or unverified third-party certifications are made.
            </p>
          </div>

          <p className="text-stone-500 text-center sm:text-right shrink-0">
            © 2026 MESTHIRI • College Innovation Project
          </p>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MODAL: Help / Contact Modal                                            */}
      {/* ===================================================================== */}
      {activeModal === "help" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md bg-white text-[#172321] rounded-2xl shadow-2xl border border-[#E2DDD2] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD2]">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#245B50]" />
                <h3 className="text-base font-bold font-serif">Help &amp; Project Contact</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#6E6B65] leading-relaxed">
              <p>
                <strong>Academic Prototype Support:</strong> MESTHIRI is an Innovation Engineering capstone project built for demonstration and evaluation.
              </p>
              <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E2DDD2] space-y-1.5">
                <div className="font-semibold text-[#172321]">Presentation Contacts:</div>
                <div>• Project: MESTHIRI Flooring Services Platform</div>
                <div>• Location: Telangana, India</div>
                <div>• Evaluation Desk: Capstone Project Evaluation Committee</div>
              </div>
              <p className="text-[11px] text-stone-500">
                Notice: Commercial customer support is not active in this development prototype.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-[#245B50] text-white font-semibold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: Privacy Policy Modal                                           */}
      {/* ===================================================================== */}
      {activeModal === "privacy" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md bg-white text-[#172321] rounded-2xl shadow-2xl border border-[#E2DDD2] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD2]">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#245B50]" />
                <h3 className="text-base font-bold font-serif">Privacy Policy Disclosure</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#6E6B65] leading-relaxed">
              <p>
                <strong>Data Protection Principles:</strong> MESTHIRI is committed to safeguarding artisan and homeowner privacy.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-xs">
                <li>
                  <strong>Document Confidentiality:</strong> Labour registration cards, identity documents, and residential addresses are stored in private audit records and are <em>never</em> published to public profiles.
                </li>
                <li>
                  <strong>No Public Disclosure of Unverified Workers:</strong> New worker registrations remain in <em>Pending Verification</em> until authorized audit review.
                </li>
                <li>
                  <strong>No Commercial Sale:</strong> User contact details are never shared or sold to advertising brokers.
                </li>
              </ul>
              <p className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                Production Notice: Real cloud deployment requires private encrypted S3/GCS bucket storage and verified KYC verification.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-[#245B50] text-white font-semibold text-xs cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: Terms and Conditions Modal                                      */}
      {/* ===================================================================== */}
      {activeModal === "terms" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md bg-white text-[#172321] rounded-2xl shadow-2xl border border-[#E2DDD2] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD2]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#245B50]" />
                <h3 className="text-base font-bold font-serif">Terms and Conditions</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#6E6B65] leading-relaxed">
              <p>
                <strong>Academic Prototype Terms:</strong>
              </p>
              <ul className="list-disc pl-4 space-y-1.5 text-xs">
                <li>
                  <strong>Educational Scope:</strong> This platform is a prototype engineered for an Innovation Engineering capstone project.
                </li>
                <li>
                  <strong>Demonstration Quotations:</strong> Rate calculations, quotation comparisons, and milestone progression are simulated workflows for academic review.
                </li>
                <li>
                  <strong>No Active Commercial Warranty:</strong> No legally binding construction contracts or payment disbursements are executed through this demonstration prototype.
                </li>
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-[#245B50] text-white font-semibold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
