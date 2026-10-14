"use client";

import React, { useState, useMemo } from "react";
import { JobListing, Quotation, JobStatus, QuotationStatus } from "@/types";
import {
  X,
  FileCheck2,
  CheckCircle,
  Clock,
  Users,
  ShieldAlert,
  Check,
  Info,
  Calendar,
  AlertCircle,
  ArrowRight,
  Layers,
  Sparkles,
  ShieldCheck,
  Briefcase,
} from "lucide-react";

interface CompareQuotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: JobListing[];
  quotations: Quotation[];
  initialJobId?: string;
  onAcceptQuote: (quote: Quotation) => void;
  onUpdateJobStatus?: (jobId: string, status: JobStatus) => void;
  onUpdateQuoteStatus?: (quoteId: string, status: QuotationStatus) => void;
  onSwitchToWorkerPortal?: () => void;
}

export const CompareQuotesModal: React.FC<CompareQuotesModalProps> = ({
  isOpen,
  onClose,
  jobs,
  quotations,
  initialJobId,
  onAcceptQuote,
  onUpdateJobStatus,
  onUpdateQuoteStatus,
  onSwitchToWorkerPortal,
}) => {
  // Active selected job state
  const [selectedJobId, setSelectedJobId] = useState<string>(
    initialJobId || jobs[0]?.id || "sample-job-101"
  );

  // Active candidate confirmation state
  const [quotePendingConfirmation, setQuotePendingConfirmation] =
    useState<Quotation | null>(null);

  // Synchronize when initialJobId changes
  React.useEffect(() => {
    if (initialJobId) {
      setSelectedJobId(initialJobId);
    }
  }, [initialJobId]);

  if (!isOpen) return null;

  // Active Job Details
  const activeJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  // Active Quotations for this Job
  const matchingQuotes = quotations.filter((q) => q.jobId === selectedJobId);

  // Handle final selection
  const handleConfirmSelection = () => {
    if (!quotePendingConfirmation) return;

    // Update quote status
    if (onUpdateQuoteStatus) {
      onUpdateQuoteStatus(quotePendingConfirmation.id, "Quotation Selected");
    }

    // Update job status
    if (onUpdateJobStatus && activeJob) {
      onUpdateJobStatus(activeJob.id, "Quotation Selected");
    }

    onAcceptQuote(quotePendingConfirmation);
    setQuotePendingConfirmation(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172321]/75 backdrop-blur-sm overflow-y-auto animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-quotes-title"
    >
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-[#E2DDD2] overflow-hidden my-6">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#172321] text-[#F6F2E9] flex items-center justify-between border-b border-[#245B50]/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#245B50]/50 text-[#C5A66B] border border-[#C5A66B]/30">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 text-[#C5A66B] text-[10px] font-bold uppercase tracking-wider mb-0.5">
                Homeowner Proposal Analysis Engine • Section 9.D
              </div>
              <h3 id="compare-quotes-title" className="text-lg sm:text-xl font-bold font-serif text-[#F6F2E9]">
                Compare Contractor Quotations
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[80vh] bg-[#FAF7F0]/40 space-y-6 text-xs">
          {/* Job Selector Dropdown & Active Job Status Header */}
          <div className="p-4 rounded-xl bg-white border border-[#E2DDD2] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-stone-500 uppercase tracking-wider font-bold block">
                Select Posted Requirement to Compare
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="px-3 py-2 text-xs font-bold rounded-lg border border-[#E2DDD2] bg-[#FAF7F0] text-[#172321] focus:outline-none focus:ring-1 focus:ring-[#245B50] min-w-[280px]"
              >
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} ({job.city || "Telangana"})
                  </option>
                ))}
              </select>
            </div>

            {/* Active Job Specs Summary */}
            {activeJob && (
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="px-3 py-1.5 rounded-lg bg-[#FAF7F0] border border-[#E2DDD2]">
                  <span className="text-[10px] text-stone-400 block font-medium">Floor Area</span>
                  <span className="font-bold text-[#172321]">{activeJob.areaSqFt} sq.ft</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-[#FAF7F0] border border-[#E2DDD2]">
                  <span className="text-[10px] text-stone-400 block font-medium">Material Scope</span>
                  <span className="font-bold text-[#172321]">{activeJob.flooringType}</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-[#FAF7F0] border border-[#E2DDD2]">
                  <span className="text-[10px] text-stone-400 block font-medium">Job Status</span>
                  <span
                    className={`font-bold inline-block px-2 py-0.2 rounded text-[11px] ${
                      activeJob.status === "Quotation Selected"
                        ? "bg-purple-100 text-purple-900"
                        : activeJob.status === "In Progress (demo only)"
                        ? "bg-blue-100 text-blue-900"
                        : activeJob.status === "Completed (demo only)"
                        ? "bg-emerald-100 text-emerald-900"
                        : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {activeJob.status}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Demonstration Notice */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed text-[11px]">
              <strong>Neutral Comparison Principles:</strong> Quotations are evaluated across technical specification, crystallization polishing, IS 1443 laser tolerance inclusion, and completion timeline. Candidates are not ranked solely by lowest price. Selection is a demonstration action that updates local workflow status.
            </div>
          </div>

          {/* Empty State: No Quotations Yet */}
          {matchingQuotes.length === 0 && (
            <div className="py-12 bg-white rounded-2xl border border-[#E2DDD2] text-center p-8 max-w-lg mx-auto shadow-2xs">
              <FileCheck2 className="w-10 h-10 text-stone-400 mx-auto mb-2 opacity-60" />
              <h4 className="text-base font-bold text-[#172321]">
                No Quotations Received for This Job Yet
              </h4>
              <p className="text-xs text-[#6E6B65] mt-1.5 leading-relaxed">
                This requirement is currently <strong>“Open for Quotes”</strong>. Quotations appear only when submitted by actual registered craftsmen accounts — MESTHIRI does not fabricate placeholder bids.
              </p>
              {onSwitchToWorkerPortal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSwitchToWorkerPortal();
                  }}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-[#245B50] hover:bg-[#1A443C] text-white font-bold text-xs flex items-center gap-2 mx-auto transition-colors shadow-xs"
                >
                  <Briefcase className="w-3.5 h-3.5 text-[#C5A66B]" />
                  <span>Submit Quote via Worker Portal</span>
                </button>
              )}
            </div>
          )}

          {/* Quotations Grid */}
          {matchingQuotes.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>
                  Showing <strong>{matchingQuotes.length}</strong> contractor proposals for <strong>{activeJob?.title}</strong>
                </span>
                <span className="text-[11px] font-semibold text-[#245B50]">
                  Standardized Breakdown per Section 9.D
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {matchingQuotes.map((quote) => {
                  const isSelected = quote.status === "Quotation Selected";
                  const isInProgress = quote.status === "In Progress (demo only)";
                  const isCompleted = quote.status === "Completed (demo only)";

                  return (
                    <div
                      key={quote.id}
                      className={`relative bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                        isSelected || isInProgress || isCompleted
                          ? "border-[#245B50] ring-2 ring-[#245B50]/30 shadow-md"
                          : "border-[#E2DDD2] hover:border-[#245B50]/60 hover:shadow-sm"
                      }`}
                    >
                      {/* Top Badges */}
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                              quote.isMaterialSuppliedByWorker
                                ? "bg-amber-50 text-amber-900 border-amber-300"
                                : "bg-emerald-50 text-emerald-900 border-emerald-300"
                            }`}
                          >
                            {quote.isMaterialSuppliedByWorker ? "Turnkey Material + Labour" : "Labour-Only Quote"}
                          </span>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isSelected
                                ? "bg-purple-100 text-purple-900 border-purple-300"
                                : isInProgress
                                ? "bg-blue-100 text-blue-900 border-blue-300"
                                : isCompleted
                                ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                                : "bg-stone-100 text-stone-700 border-stone-200"
                            }`}
                          >
                            {quote.status}
                          </span>
                        </div>

                        {/* Craftsman Profile */}
                        <h4 className="text-base font-bold text-[#172321] leading-snug">
                          {quote.workerName}
                        </h4>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {quote.workerExperience} Years Trade Experience
                        </p>

                        {/* Skills tags */}
                        {quote.workerSkills && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {quote.workerSkills.map((s) => (
                              <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF7F0] border border-[#E2DDD2] text-stone-700">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Total Quoted Amount */}
                        <div className="mt-4 p-3 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2]">
                          <span className="text-[10px] text-stone-500 block uppercase tracking-wider font-semibold">
                            Total Quoted Amount
                          </span>
                          <span className="text-2xl font-black text-[#245B50] block mt-0.5">
                            ₹{quote.grandTotal.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] text-stone-500 block mt-0.5">
                            Estimated Completion: <strong>{quote.durationDays} working days</strong>
                          </span>
                        </div>

                        {/* Itemized Cost Breakdown (Section 9.D) */}
                        <div className="mt-3.5 space-y-1.5 pt-3 border-t border-[#E2DDD2] text-xs">
                          <span className="font-bold text-[#172321] block text-[11px]">Itemized Cost Breakdown:</span>

                          <div className="flex items-center justify-between text-stone-600">
                            <span>
                              Labour ({quote.calculationMode === "per_sqft" ? `₹${quote.ratePerSqFt}/sq.ft` : "Fixed lump-sum"}):
                            </span>
                            <span className="font-semibold text-[#172321]">
                              ₹{quote.laborTotal.toLocaleString("en-IN")}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-stone-600">
                            <span>Material Cost:</span>
                            <span className="font-semibold text-[#172321]">
                              {quote.materialCost > 0 ? `₹${quote.materialCost.toLocaleString("en-IN")}` : "Client Supplied (₹0)"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-stone-600">
                            <span>Transport & Logistics:</span>
                            <span className="font-semibold text-[#172321]">
                              ₹{quote.transportCharges.toLocaleString("en-IN")}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-stone-600">
                            <span>Finishing & Buffing:</span>
                            <span className="font-semibold text-[#172321]">
                              ₹{quote.additionalCharges.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>

                        {/* Work Included & Excluded */}
                        <div className="mt-3.5 pt-3 border-t border-[#E2DDD2] space-y-2 text-[11px]">
                          <div>
                            <span className="font-bold text-emerald-800 block mb-1">Work Included:</span>
                            <ul className="space-y-0.5 text-stone-700">
                              {quote.workIncluded.slice(0, 3).map((inc, i) => (
                                <li key={i} className="flex items-start gap-1">
                                  <span className="text-emerald-600 font-bold">✓</span>
                                  <span className="truncate">{inc}</span>
                                </li>
                              ))}
                              {quote.workIncluded.length > 3 && (
                                <li className="text-[10px] text-stone-400 italic">
                                  + {quote.workIncluded.length - 3} more specifications
                                </li>
                              )}
                            </ul>
                          </div>

                          {quote.workExcluded && quote.workExcluded.length > 0 && (
                            <div>
                              <span className="font-bold text-stone-500 block mb-0.5">Explicitly Excluded:</span>
                              <ul className="space-y-0.5 text-stone-500">
                                {quote.workExcluded.slice(0, 2).map((exc, i) => (
                                  <li key={i} className="flex items-start gap-1">
                                    <span className="text-stone-400">✕</span>
                                    <span className="truncate">{exc}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Comments */}
                        <p className="mt-3 text-[11px] text-stone-600 leading-relaxed bg-[#FAF7F0] p-2.5 rounded-lg border border-[#E2DDD2]">
                          &ldquo;{quote.comments}&rdquo;
                        </p>

                        <div className="mt-2 text-[10px] text-stone-400 flex items-center justify-between">
                          <span>Validity: {quote.validityPeriodDays || 15} days</span>
                          <span>Submitted: {quote.submittedAt}</span>
                        </div>
                      </div>

                      {/* Card Selection Action */}
                      <div className="mt-5 pt-3 border-t border-[#E2DDD2]">
                        {isSelected || isInProgress || isCompleted ? (
                          <div className="space-y-2">
                            <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200 text-center text-xs font-bold text-purple-900 flex items-center justify-center gap-1.5">
                              <CheckCircle className="w-4 h-4 text-purple-700" />
                              <span>Proposal Selected for Job</span>
                            </div>

                            {/* Section 9.E Interactive Status Progression Buttons */}
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <button
                                onClick={() => {
                                  if (onUpdateQuoteStatus) onUpdateQuoteStatus(quote.id, "In Progress (demo only)");
                                  if (onUpdateJobStatus && activeJob) onUpdateJobStatus(activeJob.id, "In Progress (demo only)");
                                }}
                                className={`py-1 px-2 rounded text-[10px] font-semibold border transition-colors ${
                                  isInProgress ? "bg-blue-600 text-white border-blue-600" : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
                                }`}
                              >
                                {isInProgress ? "✓ Status: In Progress" : "Simulate: Start Work"}
                              </button>

                              <button
                                onClick={() => {
                                  if (onUpdateQuoteStatus) onUpdateQuoteStatus(quote.id, "Completed (demo only)");
                                  if (onUpdateJobStatus && activeJob) onUpdateJobStatus(activeJob.id, "Completed (demo only)");
                                }}
                                className={`py-1 px-2 rounded text-[10px] font-semibold border transition-colors ${
                                  isCompleted ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
                                }`}
                              >
                                {isCompleted ? "✓ Status: Completed" : "Simulate: Handover"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setQuotePendingConfirmation(quote)}
                            className="w-full py-2.5 px-4 rounded-xl bg-[#245B50] hover:bg-[#1A443C] text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
                          >
                            <span>Select this Quotation</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* CONFIRMATION MODAL BEFORE SELECTING (SECTION 9.D)           */}
        {/* ============================================================ */}
        {quotePendingConfirmation && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in zoom-in-95"
            role="dialog"
          >
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E2DDD2] p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD2]">
                <h4 className="text-base font-bold text-[#172321]">
                  Confirm Preferred Quotation Selection
                </h4>
                <button
                  onClick={() => setQuotePendingConfirmation(null)}
                  className="p-1 text-stone-500 hover:text-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2] text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Selected Craftsman:</span>
                  <span className="font-bold text-[#172321]">{quotePendingConfirmation.workerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Total Quoted Amount:</span>
                  <span className="font-bold text-[#245B50] text-sm">
                    ₹{quotePendingConfirmation.grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Estimated Duration:</span>
                  <span className="font-bold text-[#172321]">
                    {quotePendingConfirmation.durationDays} working days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Quotation Type:</span>
                  <span className="font-bold text-[#172321]">
                    {quotePendingConfirmation.isMaterialSuppliedByWorker
                      ? "Turnkey Material + Labour"
                      : "Labour-Only Proposal"}
                  </span>
                </div>
              </div>

              {/* Prototype A Notice */}
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                <strong>Academic Prototype A Notice:</strong> Selection is an illustrative demonstration action. It marks the quotation and job status as <em>“Quotation Selected”</em> in local state. No binding commercial contract, bank debit, or escrow freeze is created.
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setQuotePendingConfirmation(null)}
                  className="px-4 py-2 font-semibold text-stone-600 hover:text-stone-900 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSelection}
                  className="px-5 py-2.5 rounded-xl bg-[#245B50] hover:bg-[#1A443C] font-bold text-white text-xs shadow-xs transition-colors"
                >
                  Confirm Selection (Demo)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
