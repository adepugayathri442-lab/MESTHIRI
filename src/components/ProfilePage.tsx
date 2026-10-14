"use client";

import React, { useState } from "react";
import {
  UserProfile,
  JobListing,
  Quotation,
  MaterialProduct,
  ActiveAppTab,
  FlooringCategory,
  TELANGANA_CITIES,
} from "@/types";
import { SAMPLE_PRODUCTS } from "@/data/products";
import {
  User,
  MapPin,
  Briefcase,
  Store,
  Layers,
  Award,
  Calendar,
  CheckCircle2,
  Phone,
  Mail,
  Edit3,
  PlusCircle,
  FileCheck2,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Building2,
  Clock,
  Check,
  X,
  Camera,
} from "lucide-react";

interface ProfilePageProps {
  user: UserProfile;
  jobs: JobListing[];
  quotations: Quotation[];
  onUpdateUser: (updatedUser: UserProfile) => void;
  onNavigateTab: (tab: ActiveAppTab) => void;
  onOpenPostJob: () => void;
  onOpenCompareForJob: (jobId: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  jobs,
  quotations,
  onUpdateUser,
  onNavigateTab,
  onOpenPostJob,
  onOpenCompareForJob,
}) => {
  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>({ ...user });

  // Lightbox Preview for Portfolio Photos
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  // Homeowner jobs: filter jobs posted by this homeowner or all demo jobs
  const homeownerJobs = jobs.filter(
    (j) =>
      j.homeownerName.toLowerCase().includes(user.name.toLowerCase()) ||
      !j.isSampleJob ||
      j.id === "sample-job-101"
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(editForm);
    setIsEditModalOpen(false);
  };

  return (
    <div className="py-8 bg-[#F6F2E9] min-h-[90vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* ============================================================ */}
        {/* LINKEDIN-STYLE PROFILE HERO CARD                             */}
        {/* ============================================================ */}
        <div className="bg-white rounded-3xl border border-[#E2DDD2] shadow-sm overflow-hidden">
          {/* Cover Banner */}
          <div className="h-44 sm:h-52 bg-gradient-to-r from-[#172321] via-[#245B50] to-[#172321] relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
              alt="Profile Cover Banner"
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-xs px-3 py-1 rounded-full text-white text-[10px] font-bold tracking-wider uppercase border border-white/20">
              {user.role === "worker"
                ? "Craftsman Portfolio"
                : user.role === "shop"
                ? "Verified Depot Profile"
                : "Homeowner Profile"}
            </div>
          </div>

          {/* Profile Header Details */}
          <div className="px-6 sm:px-8 pb-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-5">
              {/* Circular Avatar */}
              <div className="relative">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white shadow-lg bg-stone-100"
                />
                <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#245B50] border-2 border-white flex items-center justify-center text-[#C5A66B]">
                  {user.role === "worker" ? (
                    <Briefcase className="w-3.5 h-3.5" />
                  ) : user.role === "shop" ? (
                    <Store className="w-3.5 h-3.5" />
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setEditForm({ ...user });
                    setIsEditModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E2DDD2] bg-[#FAF7F0] hover:bg-white text-xs font-bold text-[#172321] transition-colors shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#245B50]" />
                  <span>Edit Profile</span>
                </button>

                {user.role === "homeowner" && (
                  <button
                    type="button"
                    onClick={onOpenPostJob}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#245B50] hover:bg-[#1A443C] text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-[#C5A66B]" />
                    <span>Post New Flooring Job</span>
                  </button>
                )}

                {user.role === "worker" && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab("worker-dashboard")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#172321] hover:bg-[#245B50] text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-[#C5A66B]" />
                    <span>Open Worker Console</span>
                  </button>
                )}

                {user.role === "shop" && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab("marketplace")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#245B50] hover:bg-[#1A443C] text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <Store className="w-3.5 h-3.5 text-[#C5A66B]" />
                    <span>View Stone Marketplace</span>
                  </button>
                )}
              </div>
            </div>

            {/* Profile Titles & Meta */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172321] tracking-tight font-serif">
                  {user.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F0EE] text-[#245B50] border border-[#245B50]/20">
                  <CheckCircle2 className="w-3 h-3 text-[#245B50]" />
                  {user.role === "worker"
                    ? user.verificationStatus || "Registration Incomplete"
                    : user.role === "shop"
                    ? "Trade Depot Profile"
                    : "Verified Homeowner"}
                </span>
              </div>

              <p className="text-sm font-semibold text-stone-700 mt-1 max-w-2xl">
                {user.headline || "Flooring Platform Member"}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#6E6B65] mt-2.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#245B50]" />
                  {user.serviceAreaNeighborhood ? `${user.serviceAreaNeighborhood}, ` : ""}
                  {user.city}, Telangana
                </span>

                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#245B50]" />
                  {user.phone}
                </span>

                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#245B50]" />
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* ROLE 1: WORKER LINKEDIN-STYLE DETAILED PROFILE               */}
        {/* ============================================================ */}
        {user.role === "worker" && (
          <div className="space-y-6">
            {/* Labour Registration Card & Verification Status */}
            <div className="bg-white rounded-3xl border border-[#E2DDD2] p-6 sm:p-8 shadow-xs space-y-3">
              <h2 className="text-base font-bold text-[#172321] uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#245B50]" />
                Labour Card &amp; Verification Status
              </h2>

              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E2DDD2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#172321]">
                      {user.labourDocument?.documentCategory || "State BOCW / Artisan Registration Card"}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        user.verificationStatus === "Document Verified"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : user.verificationStatus === "Document Verification Pending"
                          ? "bg-amber-100 text-amber-800 border-amber-300"
                          : "bg-blue-100 text-blue-800 border-blue-300"
                      }`}
                    >
                      {user.verificationStatus || "Registration Incomplete"}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6E6B65]">
                    {user.labourDocument?.issuingState
                      ? `Issuing State: ${user.labourDocument.issuingState} • File: ${user.labourDocument.fileName}`
                      : "Document verification is pending administrative review. Identity documents are held securely."}
                  </p>
                </div>
                <div className="text-[11px] text-stone-500 bg-white px-3 py-1.5 rounded-lg border border-[#E2DDD2]">
                  {user.labourDocument?.documentNumberMasked
                    ? `Reg ID: ${user.labourDocument.documentNumberMasked}`
                    : "Privacy Protected"}
                </div>
              </div>
            </div>
            {/* About Card */}
            <div className="bg-white rounded-3xl border border-[#E2DDD2] p-6 sm:p-8 shadow-xs space-y-3">
              <h2 className="text-base font-bold text-[#172321] uppercase tracking-wider">
                About & Craftsmanship Philosophy
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6B65] leading-relaxed">
                {user.bio ||
                  "Specialized flooring craftsman with extensive experience in stone laying, laser leveling, and diamond crystallization."}
              </p>
            </div>

            {/* Skills & Benchmark Card */}
            <div className="bg-white rounded-3xl border border-[#E2DDD2] p-6 sm:p-8 shadow-xs">
              <h2 className="text-base font-bold text-[#172321] uppercase tracking-wider mb-3">
                Trade Skills & Labour Benchmarks
              </h2>

              <div className="flex flex-wrap gap-2 mb-4">
                {user.skills?.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2] text-xs font-semibold text-[#172321]"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#E2DDD2] text-xs text-[#6E6B65]">
                <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2]">
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">
                    Active Trade Experience
                  </span>
                  <span className="text-lg font-black text-[#172321] mt-0.5 block">
                    {user.experienceYears || 15} Years
                  </span>
                  <span className="text-[10px] text-stone-500">Continuous residential & commercial execution</span>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2]">
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">
                    Reference Labour Benchmark
                  </span>
                  <span className="text-lg font-black text-[#245B50] mt-0.5 block">
                    ₹{user.typicalSqftRate || 75} / sq.ft
                  </span>
                  <span className="text-[10px] text-stone-500">Illustrative rate for master laying & diamond buffing</span>
                </div>
              </div>
            </div>

            {/* Certifications & Government Skilling */}
            <div className="bg-white rounded-3xl border border-[#E2DDD2] p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#172321] uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#C5A66B]" />
                  Trade Certifications & Skilling Credentials
                </h2>
                <button
                  onClick={() => onNavigateTab("schemes")}
                  className="text-xs font-bold text-[#245B50] hover:underline flex items-center gap-1"
                >
                  <span>Explore Govt. Welfare Schemes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {user.certifications && user.certifications.length > 0 ? (
                  user.certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E2DDD2] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#172321]">{cert.title}</span>
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-emerald-100 text-emerald-800">
                            Verified
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6E6B65]">
                          Issued by {cert.issuingOrg} • Year {cert.year}
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold text-stone-500">
                        Technical Quality Gate Validated
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#6E6B65]">No formal certificates uploaded yet.</p>
                )}
              </div>
            </div>

            {/* Portfolio Photos Showcase */}
            <div className="bg-white rounded-3xl border border-[#E2DDD2] p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-[#172321] uppercase tracking-wider flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#245B50]" />
                Craftsman Project Portfolio Showcase
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {user.portfolioPhotos?.map((photo, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPreviewPhoto(photo)}
                    className="group relative rounded-2xl overflow-hidden aspect-square border border-[#E2DDD2] cursor-pointer shadow-2xs hover:shadow-md transition-all"
                  >
                    <img
                      src={photo}
                      alt={`Portfolio photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                      Inspect Work
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools & Equipment Deployed */}
            {user.toolsEquipment && (
              <div className="bg-white rounded-3xl border border-[#E2DDD2] p-6 sm:p-8 shadow-xs space-y-3">
                <h2 className="text-base font-bold text-[#172321] uppercase tracking-wider">
                  Precision Equipment Deployed on Site
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#6E6B65]">
                  {user.toolsEquipment.map((tool, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2]">
                      <Check className="w-3.5 h-3.5 text-[#245B50] shrink-0" />
                      <span>{tool}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* ROLE 2: HOMEOWNER LINKEDIN-STYLE DETAILED PROFILE            */}
        {/* ============================================================ */}
        {user.role === "homeowner" && (
          <div className="space-y-6">
            {/* My Posted Requirements Section */}
            <div className="bg-white rounded-3xl border border-[#E2DDD2] p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-[#172321] uppercase tracking-wider">
                    My Posted Flooring Requirements ({homeownerJobs.length})
                  </h2>
                  <p className="text-xs text-[#6E6B65] mt-0.5">
                    Track incoming contractor quotations and monitor milestone stage progress
                  </p>
                </div>
                <button
                  onClick={onOpenPostJob}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#245B50] hover:bg-[#1A443C] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#C5A66B]" />
                  <span>Post Another Job</span>
                </button>
              </div>

              {homeownerJobs.length === 0 ? (
                <div className="py-10 text-center p-6 border border-dashed border-[#E2DDD2] rounded-2xl bg-[#FAF7F0]">
                  <p className="text-xs text-stone-500">No flooring jobs posted yet.</p>
                  <button
                    onClick={onOpenPostJob}
                    className="mt-3 text-xs font-bold text-[#245B50] hover:underline"
                  >
                    Post your first requirement now →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {homeownerJobs.map((job) => {
                    const isSelected = job.status === "Quotation Selected";
                    const selectedQuote = quotations.find((q) => q.jobId === job.id && q.status === "Quotation Selected");

                    return (
                      <div
                        key={job.id}
                        className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#E2DDD2] hover:border-[#245B50]/60 transition-all space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-[#172321]">{job.title}</span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  isSelected
                                    ? "bg-purple-100 text-purple-900 border-purple-200"
                                    : "bg-amber-100 text-amber-900 border-amber-200"
                                }`}
                              >
                                {job.status}
                              </span>
                            </div>
                            <p className="text-xs text-[#6E6B65] mt-0.5">
                              {job.roomType} • {job.areaSqFt} sq.ft • {job.location} ({job.city})
                            </p>
                          </div>

                          <button
                            onClick={() => onOpenCompareForJob(job.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-[#E2DDD2] hover:bg-[#FAF7F0] text-xs font-bold text-[#172321] transition-colors shadow-2xs"
                          >
                            <FileCheck2 className="w-3.5 h-3.5 text-[#C5A66B]" />
                            <span>Compare Proposals ({job.quotesReceived})</span>
                          </button>
                        </div>

                        {/* Selected Quotation Snapshot */}
                        {selectedQuote && (
                          <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-purple-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="font-bold block">Selected Contractor: {selectedQuote.workerName}</span>
                              <span className="text-[11px] text-purple-800">
                                Agreed Amount: <strong>₹{selectedQuote.grandTotal.toLocaleString("en-IN")}</strong> • Est. Duration: {selectedQuote.durationDays} days
                              </span>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-200 text-purple-900 self-start sm:self-auto">
                              Ready for Milestone 1 Escrow
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions & Visualizer Bridge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => onNavigateTab("visualizer")}
                className="p-6 rounded-3xl bg-[#172321] text-white cursor-pointer hover:bg-[#1a2d2a] transition-colors border border-stone-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#C5A66B] uppercase tracking-wider block">
                    Interactive Design Tool
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    Floor Visualizer & Pattern Studio
                  </h3>
                  <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                    Preview bookmatched Italian marble or porcelain slabs projected onto room environments before purchasing stone.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#C5A66B] mt-4 flex items-center gap-1">
                  Launch Visualizer Studio →
                </span>
              </div>

              <div
                onClick={() => onNavigateTab("marketplace")}
                className="p-6 rounded-3xl bg-white border border-[#E2DDD2] cursor-pointer hover:border-[#245B50] transition-colors shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#245B50] uppercase tracking-wider block">
                    Procurement Direct
                  </span>
                  <h3 className="text-lg font-bold text-[#172321] mt-1">
                    Explore Material Depots & Specimen Slabs
                  </h3>
                  <p className="text-xs text-[#6E6B65] mt-1 leading-relaxed">
                    Inspect calibrated stone specifications, request physical specimen tile samples, and view verified retail depots.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#245B50] mt-4 flex items-center gap-1">
                  Browse Stone Marketplace →
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* ROLE 3: SHOP / SUPPLIER LINKEDIN-STYLE DETAILED PROFILE       */}
        {/* ============================================================ */}
        {user.role === "shop" && (
          <div className="space-y-6">
            {/* Commercial Depot Details */}
            <div className="bg-white rounded-3xl border border-[#E2DDD2] p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-[#172321] uppercase tracking-wider">
                Depot Facility & Business Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#6E6B65]">
                <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E2DDD2] space-y-1">
                  <span className="font-bold text-[#172321] block text-xs">Operating Yard Address</span>
                  <p>{user.shopAddress || "Plot 42, Balanagar Industrial Zone, Secunderabad, Telangana"}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E2DDD2] space-y-1">
                  <span className="font-bold text-[#172321] block text-xs">Yard Operating Hours</span>
                  <p>{user.operatingHours || "Monday – Saturday: 9:00 AM – 7:30 PM"}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E2DDD2] space-y-1 sm:col-span-2">
                  <span className="font-bold text-[#172321] block text-xs">Storage Capacity & Material Handling</span>
                  <p>{user.storageCapacity || "Over 85,000 sq.ft covered slab display yard with gantry crane handling"}</p>
                </div>
              </div>
            </div>

            {/* Material Catalogue Showcase */}
            <div className="bg-white rounded-3xl border border-[#E2DDD2] p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#172321] uppercase tracking-wider">
                    Our Calibrated Slab Inventory
                  </h2>
                  <p className="text-xs text-[#6E6B65] mt-0.5">
                    Architectural marble, granite, and porcelain products available at our Telangana depot
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab("marketplace")}
                  className="text-xs font-bold text-[#245B50] hover:underline flex items-center gap-1"
                >
                  <span>Full Marketplace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {SAMPLE_PRODUCTS.slice(0, 3).map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3.5 rounded-2xl border border-[#E2DDD2] bg-[#FAF7F0] flex flex-col justify-between"
                  >
                    <div>
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-full h-28 object-cover rounded-xl mb-2.5"
                      />
                      <h4 className="text-xs font-bold text-[#172321]">{prod.name}</h4>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        {prod.thickness} • {prod.finish}
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-[#245B50] mt-3">
                      {prod.priceDisplay}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* EDIT PROFILE MODAL (INTERACTIVE PROFILE UPDATES)             */}
      {/* ============================================================ */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto"
          role="dialog"
        >
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E2DDD2] p-6 space-y-4 my-6 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD2]">
              <h3 className="text-base font-bold text-[#172321]">Edit Your Profile Details</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-stone-500 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-[#172321] mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2DDD2] bg-[#FAF7F0]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#172321] mb-1">Professional Headline</label>
                <input
                  type="text"
                  required
                  value={editForm.headline || ""}
                  onChange={(e) => setEditForm({ ...editForm, headline: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2DDD2] bg-[#FAF7F0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#172321] mb-1">City</label>
                  <select
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2DDD2] bg-[#FAF7F0]"
                  >
                    {TELANGANA_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}, Telangana
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#172321] mb-1">Neighborhood / Area</label>
                  <input
                    type="text"
                    value={editForm.serviceAreaNeighborhood || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, serviceAreaNeighborhood: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#E2DDD2] bg-[#FAF7F0]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#172321] mb-1">Phone Contact</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2DDD2] bg-[#FAF7F0]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#172321] mb-1">About / Bio</label>
                <textarea
                  rows={3}
                  value={editForm.bio || ""}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2DDD2] bg-[#FAF7F0]"
                />
              </div>

              {user.role === "worker" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#172321] mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      value={editForm.experienceYears || 15}
                      onChange={(e) =>
                        setEditForm({ ...editForm, experienceYears: Number(e.target.value) || 1 })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-[#E2DDD2] bg-[#FAF7F0]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#172321] mb-1">Rate (₹ / sq.ft)</label>
                    <input
                      type="number"
                      value={editForm.typicalSqftRate || 75}
                      onChange={(e) =>
                        setEditForm({ ...editForm, typicalSqftRate: Number(e.target.value) || 50 })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-[#E2DDD2] bg-[#FAF7F0]"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E2DDD2]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 font-semibold text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#245B50] hover:bg-[#1A443C] text-white font-bold"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Portfolio Photos */}
      {previewPhoto && (
        <div
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-3xl max-h-[85vh] relative">
            <img
              src={previewPhoto}
              alt="Enlarged Portfolio View"
              className="w-full h-full object-contain rounded-2xl"
            />
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-3 right-3 p-2 bg-black/60 rounded-full text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
