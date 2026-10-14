"use client";

import React, { useState, useEffect } from "react";
import { WorkerVerificationRecord, UserProfile } from "@/types";
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Eye,
  AlertTriangle,
  X,
  Search,
  Filter,
  RefreshCw,
  Lock,
  ArrowRight,
  User,
  MapPin,
  Calendar,
  Layers,
  Check,
} from "lucide-react";

interface AdminVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onStatusUpdated?: () => void;
}

export const AdminVerificationModal: React.FC<AdminVerificationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onStatusUpdated,
}) => {
  const [records, setRecords] = useState<WorkerVerificationRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<WorkerVerificationRecord | null>(null);

  // Decision Modal State
  const [isDecisionOpen, setIsDecisionOpen] = useState<boolean>(false);
  const [decisionAction, setDecisionAction] = useState<"APPROVE" | "REJECT">("APPROVE");
  const [reviewerNotes, setReviewerNotes] = useState<string>("");
  const [rejectionReason, setRejectionReason] = useState<string>(
    "Labour card image is blurry or illegible. Please re-upload a clear scanned copy."
  );
  const [submittingDecision, setSubmittingDecision] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/verifications");
      const data = await res.json();
      if (data.status === "OK") {
        setRecords(data.results || []);
      }
    } catch (err) {
      console.error("Failed to load verifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchVerifications();
      setFeedbackMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredRecords = records.filter((r) => {
    if (filterStatus !== "ALL" && r.status !== filterStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        r.workerName.toLowerCase().includes(query) ||
        r.serviceAreaCity.toLowerCase().includes(query) ||
        r.documentCategory.toLowerCase().includes(query) ||
        r.phoneContact.includes(query)
      );
    }
    return true;
  });

  const handleOpenDecision = (record: WorkerVerificationRecord, action: "APPROVE" | "REJECT") => {
    setSelectedRecord(record);
    setDecisionAction(action);
    setReviewerNotes("");
    if (action === "REJECT") {
      setRejectionReason("Labour card image is blurry or illegible. Please re-upload a clear scanned copy.");
    }
    setIsDecisionOpen(true);
  };

  const handleSubmitDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    setSubmittingDecision(true);
    setFeedbackMessage(null);

    try {
      const res = await fetch("/api/admin/verifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationId: selectedRecord.id,
          reviewerName: currentUser.name || "Authorized Review Officer",
          action: decisionAction,
          reviewNotes: reviewerNotes.trim(),
          rejectionReason: decisionAction === "REJECT" ? rejectionReason.trim() : undefined,
        }),
      });

      const data = await res.json();
      if (data.status === "OK") {
        setFeedbackMessage({
          type: "success",
          text: data.message,
        });
        setIsDecisionOpen(false);
        setSelectedRecord(null);
        fetchVerifications();
        if (onStatusUpdated) onStatusUpdated();
      } else {
        setFeedbackMessage({
          type: "error",
          text: data.message || "Failed to submit review decision.",
        });
      }
    } catch (err: any) {
      setFeedbackMessage({
        type: "error",
        text: err?.message || "Network error submitting review.",
      });
    } finally {
      setSubmittingDecision(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Verified":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Verified
          </span>
        );
      case "Rejected — Re-upload Required":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Rejected — Re-upload Required
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            Pending Verification
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#FAF7F0] rounded-3xl max-w-5xl w-full border border-[#E2DDD2] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#172321] text-white p-5 sm:p-6 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#245B50] text-[#C5A66B] flex items-center justify-center border border-[#C5A66B]/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-serif text-[#FAF7F0]">
                  Worker Verification &amp; Labour Card Console
                </h2>
                <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-[#C5A66B]/20 text-[#C5A66B] border border-[#C5A66B]/40 font-semibold uppercase tracking-wider">
                  Reviewer Authority
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                Authorized Review Officer: {currentUser.name} • Private Document Storage &amp; Audit Trail
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security & RLS Notice Banner */}
        <div className="bg-[#E8F0EE] px-6 py-2.5 border-b border-[#245B50]/20 flex items-center justify-between text-xs text-[#245B50] shrink-0">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#245B50]" />
            <span>
              <strong>Private Supabase Storage:</strong> Sensitive labour cards and registration numbers are restricted to document owners and authorized reviewers. Never exposed on public profiles.
            </span>
          </div>
          <button
            onClick={fetchVerifications}
            className="inline-flex items-center gap-1 text-xs font-semibold hover:underline text-[#245B50]"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
        </div>

        {/* Feedback message */}
        {feedbackMessage && (
          <div
            className={`px-6 py-3 text-xs font-medium border-b shrink-0 ${
              feedbackMessage.type === "success"
                ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                : "bg-rose-50 text-rose-900 border-rose-200"
            }`}
          >
            {feedbackMessage.text}
          </div>
        )}

        {/* Toolbar & Filters */}
        <div className="p-4 sm:p-6 border-b border-[#E2DDD2] bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Status Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2]">
            <button
              onClick={() => setFilterStatus("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === "ALL"
                  ? "bg-[#245B50] text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              All ({records.length})
            </button>
            <button
              onClick={() => setFilterStatus("Pending Verification")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === "Pending Verification"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Pending ({records.filter((r) => r.status === "Pending Verification").length})
            </button>
            <button
              onClick={() => setFilterStatus("Verified")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === "Verified"
                  ? "bg-emerald-700 text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Verified ({records.filter((r) => r.status === "Verified").length})
            </button>
            <button
              onClick={() => setFilterStatus("Rejected — Re-upload Required")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === "Rejected — Re-upload Required"
                  ? "bg-rose-700 text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Rejected ({records.filter((r) => r.status === "Rejected — Re-upload Required").length})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search worker or document..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E2DDD2] bg-[#FAF7F0] text-xs text-[#172321] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245B50]"
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-[#245B50] border-t-transparent animate-spin mx-auto mb-2" />
              <p className="text-xs text-stone-600 font-medium">Loading verification submissions...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-[#E2DDD2] p-8">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F0] text-stone-400 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 opacity-60" />
              </div>
              <h3 className="text-sm font-bold text-[#172321]">No verification records found</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                {filterStatus !== "ALL"
                  ? `No applications currently have status "${filterStatus}".`
                  : "No worker applications have been submitted yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecords.map((record) => (
                <div
                  key={record.id}
                  className="bg-white rounded-2xl border border-[#E2DDD2] p-4 sm:p-5 hover:border-[#245B50]/40 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left Column: Worker & Trade Details */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-[#172321]">{record.workerName}</h4>
                      {getStatusBadge(record.status)}
                      <span className="text-[11px] text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        {record.serviceAreaCity}, {record.serviceAreaState}
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 flex items-center gap-3 flex-wrap">
                      <span>
                        <strong>Trades:</strong> {record.skills.join(", ")}
                      </span>
                      <span>•</span>
                      <span>
                        <strong>Experience:</strong> {record.experienceYears} Years
                      </span>
                      <span>•</span>
                      <span>
                        <strong>Contact:</strong> {record.phoneContact}
                      </span>
                    </div>

                    {/* Labour Document Details */}
                    <div className="mt-2 p-2.5 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#172321] flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#245B50]" />
                          {record.documentCategory}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          Uploaded: {new Date(record.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-600 flex items-center gap-3">
                        <span>File: {record.fileName} ({record.fileSizeKb} KB)</span>
                        {record.documentNumberMasked && (
                          <span>Registration No: {record.documentNumberMasked}</span>
                        )}
                        <span className="text-stone-400">Path: {record.fileStoragePath || "labour-documents/"}</span>
                      </div>

                      {/* Audit History (if reviewed) */}
                      {record.reviewedBy && (
                        <div className="mt-1.5 pt-1.5 border-t border-stone-200 text-[11px] text-stone-600 flex items-center gap-2">
                          <span className="font-semibold text-stone-700">Reviewed by:</span>
                          <span>{record.reviewedBy} on {record.reviewedAt ? new Date(record.reviewedAt).toLocaleDateString() : ""}</span>
                          {record.rejectionReason && (
                            <span className="text-rose-700 font-medium ml-2">
                              Reason: {record.rejectionReason}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => setSelectedRecord(record)}
                      className="px-3 py-2 rounded-xl border border-[#E2DDD2] bg-[#FAF7F0] hover:bg-stone-100 text-xs font-semibold text-[#172321] flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#245B50]" />
                      Inspect Document
                    </button>

                    {record.status === "Pending Verification" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenDecision(record, "APPROVE")}
                          className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDecision(record, "REJECT")}
                          className="px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </>
                    )}

                    {record.status === "Rejected — Re-upload Required" && (
                      <button
                        type="button"
                        onClick={() => handleOpenDecision(record, "APPROVE")}
                        className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        Re-evaluate &amp; Approve
                      </button>
                    )}

                    {record.status === "Verified" && (
                      <button
                        type="button"
                        onClick={() => handleOpenDecision(record, "REJECT")}
                        className="px-3 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        Revoke Verification
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#E2DDD2] flex items-center justify-between text-xs text-stone-500 shrink-0">
          <span>
            Total: {records.length} applications ({records.filter((r) => r.status === "Pending Verification").length} awaiting action)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#172321] text-white font-semibold text-xs hover:bg-[#245B50] transition-colors"
          >
            Done
          </button>
        </div>
      </div>

      {/* INSPECT DOCUMENT PREVIEW MODAL */}
      {selectedRecord && !isDecisionOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-stone-300 shadow-2xl p-6 overflow-hidden">
            <div className="flex items-start justify-between pb-3 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-bold text-[#245B50] uppercase tracking-wider">
                  Private Storage Document Inspection
                </span>
                <h3 className="text-base font-bold text-[#172321]">{selectedRecord.workerName}</h3>
                <p className="text-xs text-stone-500 mt-0.5">{selectedRecord.documentCategory}</p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 p-4 rounded-2xl bg-[#FAF7F0] border border-[#E2DDD2] space-y-3">
              <div className="aspect-video bg-[#172321] rounded-xl flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
                <FileText className="w-12 h-12 text-[#C5A66B] mb-2" />
                <span className="text-xs font-bold text-[#FAF7F0]">{selectedRecord.fileName}</span>
                <span className="text-[11px] text-stone-400 mt-0.5">
                  Size: {selectedRecord.fileSizeKb} KB • Format: {selectedRecord.fileType}
                </span>
                <span className="mt-2 text-[10px] px-2.5 py-0.5 rounded-full bg-[#245B50] text-[#C5A66B] border border-[#C5A66B]/40">
                  Private Bucket: labour-documents/
                </span>
              </div>

              {/* Document verification checklist */}
              <div className="text-xs text-stone-700 space-y-1.5 pt-1">
                <h5 className="font-bold text-[#172321] uppercase text-[10px] tracking-wider">
                  Reviewer Checklist:
                </h5>
                <p className="flex items-center gap-1.5 text-stone-600">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Valid Telangana BOCWWB or accepted construction worker registration.</span>
                </p>
                <p className="flex items-center gap-1.5 text-stone-600">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Document registration name matches legal worker name ({selectedRecord.workerName}).</span>
                </p>
                <p className="flex items-center gap-1.5 text-stone-600">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Unexpired issue date / valid government stamp.</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => handleOpenDecision(selectedRecord, "APPROVE")}
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800"
              >
                Approve Registration
              </button>
              <button
                type="button"
                onClick={() => handleOpenDecision(selectedRecord, "REJECT")}
                className="px-4 py-2 rounded-xl bg-rose-700 text-white text-xs font-bold hover:bg-rose-800"
              >
                Reject &amp; Request Re-upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPROVE / REJECT DECISION DIALOG */}
      {isDecisionOpen && selectedRecord && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-stone-300 shadow-2xl p-6">
            <div className="flex items-start justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                {decisionAction === "APPROVE" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600" />
                )}
                <h3 className="text-base font-bold text-[#172321]">
                  {decisionAction === "APPROVE"
                    ? `Approve Worker: ${selectedRecord.workerName}`
                    : `Reject Document: ${selectedRecord.workerName}`}
                </h3>
              </div>
              <button
                onClick={() => setIsDecisionOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitDecision} className="space-y-4 pt-4">
              {decisionAction === "APPROVE" ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                  Approving this worker will grant the <strong>“Verified Worker”</strong> badge. Their profile will immediately become active and visible in the public directory, and they will be eligible to receive leads and submit quotations.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 leading-relaxed">
                    Rejecting this document will mark the worker status as <strong>“Rejected — Re-upload Required”</strong>. They will not appear in the directory until a corrected document is uploaded and reviewed.
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Rejection Reason (Required)
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Explain why the document was rejected..."
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-xs text-[#172321] focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Reviewer Audit Notes (Optional)
                </label>
                <input
                  type="text"
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  placeholder="e.g. Verified against Telangana BOCWWB portal"
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs text-[#172321] focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsDecisionOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingDecision}
                  className={`px-5 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-xs ${
                    decisionAction === "APPROVE"
                      ? "bg-emerald-700 hover:bg-emerald-800"
                      : "bg-rose-700 hover:bg-rose-800"
                  }`}
                >
                  {submittingDecision
                    ? "Submitting..."
                    : decisionAction === "APPROVE"
                    ? "Confirm Approval"
                    : "Confirm Rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
