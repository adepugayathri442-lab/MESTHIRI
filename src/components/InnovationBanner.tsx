"use client";

import React, { useState } from "react";
import { Info, Users, Briefcase, Store, ChevronDown, ChevronUp, ShieldCheck, Lock } from "lucide-react";
import { UserRole } from "@/types";

interface InnovationBannerProps {
  activeRole: UserRole;
  onOpenAdminConsole?: () => void;
  isAdmin?: boolean;
}

export const InnovationBanner: React.FC<InnovationBannerProps> = ({
  activeRole,
  onOpenAdminConsole,
  isAdmin = false,
}) => {
  const [expanded, setExpanded] = useState(false);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "worker":
        return { label: "Worker Account", icon: <Briefcase className="w-3.5 h-3.5" />, bg: "bg-[#245B50] text-white border-[#C5A66B]/50" };
      case "shop":
        return { label: "Shop Partner", icon: <Store className="w-3.5 h-3.5" />, bg: "bg-[#C5A66B] text-[#172321] border-[#C5A66B]" };
      case "admin":
        return { label: "Review Officer (Admin)", icon: <ShieldCheck className="w-3.5 h-3.5" />, bg: "bg-emerald-700 text-white border-emerald-400" };
      default:
        return { label: "Homeowner Account", icon: <Users className="w-3.5 h-3.5" />, bg: "bg-[#245B50]/60 text-white border-white/20" };
    }
  };

  const badge = getRoleBadge(activeRole);

  return (
    <aside
      aria-label="Academic Project Scope & Presentation Mode"
      className="bg-[#172321] text-[#F6F2E9] border-b border-[#245B50]/40 text-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
          {/* Project Title & Context */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-[#245B50]/40 text-[#C5A66B] font-bold border border-[#C5A66B]/30 tracking-wider uppercase text-[10px]">
              Prototype A
            </span>
            <span className="text-[#FAF7F0] font-semibold tracking-tight text-[11px] sm:text-xs">
              Academic Innovation Project — Manual authentication active. Role-protected dashboards.
            </span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1 text-[#C5A66B] hover:text-[#FAF7F0] underline font-medium cursor-pointer ml-1 transition-colors text-[11px]"
              aria-expanded={expanded}
              aria-controls="innovation-details"
            >
              <Info className="w-3.5 h-3.5" />
              {expanded ? "Close Project Scope" : "Scope Details"}
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Active Session Identity & Admin Console Access */}
          <div className="flex items-center gap-2.5 self-stretch md:self-auto justify-end">
            {/* Authenticated Role Indicator (Protected) */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#F6F2E9]/70 font-medium hidden sm:inline text-[11px]">
                Session Role:
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${badge.bg}`}
              >
                {badge.icon}
                {badge.label}
              </span>
            </div>

            {/* Reviewer / Admin Console Button (if admin or reviewer action available) */}
            {onOpenAdminConsole && (
              <button
                onClick={onOpenAdminConsole}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#C5A66B]/20 hover:bg-[#C5A66B]/30 text-[#C5A66B] border border-[#C5A66B]/40 text-xs font-semibold transition-all cursor-pointer"
                title="Open Reviewer Labour Card Verification Console"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verification Console</span>
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Architecture Details */}
        {expanded && (
          <div
            id="innovation-details"
            className="mt-3 pt-3 border-t border-[#245B50]/30 text-[#F6F2E9]/80 text-xs grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            <div className="bg-[#172321]/90 p-3 rounded border border-[#245B50]/30">
              <h3 className="font-semibold text-[#C5A66B] mb-1">
                1. Authentication &amp; RBAC Security
              </h3>
              <p className="text-[#F6F2E9]/70 leading-relaxed text-[11px]">
                Direct bypasses and automatic logins are disabled. Users manually log in and are routed to their role-protected dashboard. Passwords are salted and hashed on the server.
              </p>
            </div>

            <div className="bg-[#172321]/90 p-3 rounded border border-[#245B50]/30">
              <h3 className="font-semibold text-[#C5A66B] mb-1">
                2. Mandatory Labour Card Verification
              </h3>
              <p className="text-[#F6F2E9]/70 leading-relaxed text-[11px]">
                Workers must upload a valid labour card (e.g. Telangana BOCWWB card) upon registration. Accounts remain in <em>Pending Verification</em> until approved by an authorized reviewer.
              </p>
            </div>

            <div className="bg-[#172321]/90 p-3 rounded border border-[#245B50]/30">
              <h3 className="font-semibold text-[#C5A66B] mb-1">
                3. Directory Integrity &amp; Trust
              </h3>
              <p className="text-[#F6F2E9]/70 leading-relaxed text-[11px]">
                Only verified workers appear in homeowner search results. Unverified workers cannot receive job leads or submit quotes. Sensitive document details are stored privately.
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
