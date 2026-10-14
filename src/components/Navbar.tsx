"use client";

import React, { useState } from "react";
import { ActiveAppTab, UserProfile } from "@/types";
import { Logo } from "@/components/Logo";
import {
  Users,
  Eye,
  ShoppingBag,
  PlusCircle,
  Menu,
  X,
  LogOut,
  Sparkles,
  Info,
  ShieldCheck,
  Calculator,
  FileCheck2,
  ChevronDown,
} from "lucide-react";

interface NavbarProps {
  activeTab: ActiveAppTab;
  onTabChange: (tab: ActiveAppTab) => void;
  onOpenPostJob: () => void;
  onOpenCalculator: () => void;
  onOpenCompare: () => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenPostJob,
  onOpenCalculator,
  onOpenCompare,
  currentUser,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  // Core desktop middle navigation as requested:
  // Home, Find MESTHIRI, Floor Visualizer, Marketplace
  const mainNavLinks: { id: ActiveAppTab; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Home", icon: null },
    { id: "workers", label: "Find MESTHIRI", icon: <Users className="w-3.5 h-3.5 text-[#245B50]" /> },
    { id: "visualizer", label: "Floor Visualizer", icon: <Eye className="w-3.5 h-3.5 text-[#245B50]" /> },
    { id: "marketplace", label: "Marketplace", icon: <ShoppingBag className="w-3.5 h-3.5 text-[#245B50]" /> },
  ];

  // Secondary navigational views accessible via dropdown / mobile
  const secondaryNavLinks: { id: ActiveAppTab; label: string; icon: React.ReactNode; roleRequired?: string }[] = [
    { id: "designs", label: "Designs & Laying Patterns", icon: <Sparkles className="w-3.5 h-3.5 text-[#C5A66B]" /> },
    { id: "schemes", label: "Govt. Welfare Schemes (BOCWWB)", icon: <ShieldCheck className="w-3.5 h-3.5 text-[#245B50]" /> },
    { id: "about", label: "About MESTHIRI & Standards", icon: <Info className="w-3.5 h-3.5 text-[#245B50]" /> },
    ...(currentUser?.role === "worker"
      ? [{ id: "worker-dashboard" as ActiveAppTab, label: "Worker Portal & Leads", icon: <Users className="w-3.5 h-3.5 text-[#245B50]" /> }]
      : []),
  ];

  const handleNavClick = (tab: ActiveAppTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  };

  const getRoleBadgeStyle = (role?: string) => {
    switch (role) {
      case "worker":
        return "bg-[#E8F0EE] text-[#245B50] border-[#245B50]/30";
      case "shop":
        return "bg-[#F5F0E6] text-[#B88746] border-[#B88746]/30";
      case "admin":
        return "bg-purple-50 text-purple-800 border-purple-200";
      default:
        return "bg-[#EBF3FF] text-[#1E40AF] border-[#93C5FD]/40";
    }
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "worker":
        return "Mesthri";
      case "shop":
        return "Shop Partner";
      case "admin":
        return "Audit Officer";
      default:
        return "Homeowner";
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F0]/95 backdrop-blur-md border-b border-[#E2DDD2] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-3">
          {/* ========================================================= */}
          {/* 1. LEFT: MESTHIRI Logo & Wordmark                         */}
          {/* ========================================================= */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => handleNavClick("home")}
              className="focus:outline-none group text-left cursor-pointer"
              title="MESTHIRI — Skilled Hands. Beautiful Homes."
            >
              <Logo size="md" showTagline={true} />
            </button>
          </div>

          {/* ========================================================= */}
          {/* 2. MIDDLE: Home, Find MESTHIRI, Floor Visualizer, Marketplace */}
          {/* ========================================================= */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {mainNavLinks.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? "text-[#172321] bg-white border border-[#E2DDD2] shadow-2xs font-bold"
                      : "text-[#6E6B65] hover:text-[#172321] hover:bg-[#F6F2E9]"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* "More" Navigation Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  moreDropdownOpen || ["designs", "schemes", "about"].includes(activeTab)
                    ? "text-[#172321] bg-[#E8F0EE]"
                    : "text-[#6E6B65] hover:text-[#172321] hover:bg-[#F6F2E9]"
                }`}
              >
                <span>More</span>
                <ChevronDown className="w-3 h-3 text-[#6E6B65]" />
              </button>

              {moreDropdownOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-60 bg-white rounded-xl shadow-lg border border-[#E2DDD2] py-1.5 z-50 animate-in fade-in">
                  {secondaryNavLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => handleNavClick(link.id)}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-left transition-colors cursor-pointer ${
                        activeTab === link.id
                          ? "bg-[#FAF7F0] text-[#245B50] font-bold"
                          : "text-[#172321] hover:bg-[#F6F2E9]"
                      }`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </button>
                  ))}
                  <div className="my-1 border-t border-[#E2DDD2]" />
                  <button
                    onClick={() => {
                      setMoreDropdownOpen(false);
                      onOpenCalculator();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#172321] hover:bg-[#F6F2E9] text-left cursor-pointer"
                  >
                    <Calculator className="w-3.5 h-3.5 text-[#245B50]" />
                    <span>Quick Budget Calculator</span>
                  </button>
                  <button
                    onClick={() => {
                      setMoreDropdownOpen(false);
                      onOpenCompare();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#172321] hover:bg-[#F6F2E9] text-left cursor-pointer"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-[#C5A66B]" />
                    <span>Compare Quotations</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* ========================================================= */}
          {/* 3. RIGHT: Post a Job and Profile / Sign Out               */}
          {/* ========================================================= */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {/* Clear Primary "Post a Job" Button */}
            <button
              onClick={onOpenPostJob}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#F6F2E9] bg-[#245B50] hover:bg-[#1A443C] border border-[#245B50] shadow-xs transition-all cursor-pointer hover:shadow-md"
              title="Post your flooring requirements to receive quotations"
            >
              <PlusCircle className="w-4 h-4 text-[#C5A66B]" />
              <span>Post a Job</span>
            </button>

            {/* User Profile Pill or Login Trigger */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 pl-2 border-l border-[#E2DDD2]">
                <button
                  onClick={() => handleNavClick("profile")}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    activeTab === "profile"
                      ? "bg-[#172321] text-white border-[#172321] shadow-xs"
                      : "bg-white hover:bg-[#F6F2E9] text-[#172321] border-[#E2DDD2]"
                  }`}
                  title="View and Edit Profile"
                >
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover border border-[#C5A66B]/50"
                  />
                  <div className="text-left hidden lg:block">
                    <p className={`text-xs font-bold leading-tight line-clamp-1 ${activeTab === "profile" ? "text-white" : "text-[#172321]"}`}>
                      {currentUser.name.split(" ")[0]}
                    </p>
                    <span className={`text-[9px] px-1 py-0.2 rounded font-medium border inline-block ${getRoleBadgeStyle(currentUser.role)}`}>
                      {getRoleLabel(currentUser.role)}
                    </span>
                  </div>
                </button>

                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl text-[#6E6B65] hover:text-[#DC2626] hover:bg-[#FEE2E2]/60 transition-colors cursor-pointer"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onTabChange("home")}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#172321] bg-white border border-[#E2DDD2] hover:bg-[#F6F2E9] cursor-pointer"
              >
                Login / Sign Up
              </button>
            )}
          </div>

          {/* ========================================================= */}
          {/* Mobile Menu Button (lg and below)                         */}
          {/* ========================================================= */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenPostJob}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#245B50] flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#C5A66B]" />
              <span>Post</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white border border-[#E2DDD2] text-[#172321] hover:bg-[#F6F2E9] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Mobile Navigation Drawer                                  */}
        {/* ========================================================= */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#E2DDD2] bg-[#FAF7F0] space-y-2 animate-in slide-in-from-top-2">
            <div className="px-2 space-y-1">
              {mainNavLinks.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[#245B50] text-white font-bold"
                        : "text-[#172321] hover:bg-white"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="pt-2 pb-1 border-t border-[#E2DDD2] text-[10px] font-bold text-[#6E6B65] uppercase tracking-wider px-3">
                Explore More
              </div>

              {secondaryNavLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                    activeTab === link.id
                      ? "bg-[#245B50] text-white font-bold"
                      : "text-[#6E6B65] hover:bg-white hover:text-[#172321]"
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Actions: Calculator, Compare, Profile */}
            <div className="pt-3 border-t border-[#E2DDD2] px-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCalculator();
                  }}
                  className="py-2 px-2.5 rounded-xl bg-white border border-[#E2DDD2] text-xs font-semibold text-[#172321] flex items-center justify-center gap-1.5"
                >
                  <Calculator className="w-3.5 h-3.5 text-[#245B50]" />
                  <span>Cost Estimator</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCompare();
                  }}
                  className="py-2 px-2.5 rounded-xl bg-white border border-[#E2DDD2] text-xs font-semibold text-[#172321] flex items-center justify-center gap-1.5"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-[#C5A66B]" />
                  <span>Compare Quotes</span>
                </button>
              </div>

              {currentUser && (
                <div className="pt-2 flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#E2DDD2]">
                  <button
                    onClick={() => handleNavClick("profile")}
                    className="flex items-center gap-2 text-left"
                  >
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full object-cover border border-[#C5A66B]/50"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#172321]">{currentUser.name}</p>
                      <span className={`text-[9px] px-1 py-0.2 rounded font-medium border inline-block ${getRoleBadgeStyle(currentUser.role)}`}>
                        {getRoleLabel(currentUser.role)}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={onLogout}
                    className="p-1.5 rounded text-rose-700 hover:bg-rose-50"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
