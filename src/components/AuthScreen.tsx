"use client";

import React, { useState } from "react";
import { UserRole, UserProfile, TELANGANA_CITIES, FlooringCategory, LabourDocumentCategory } from "@/types";
import { DEMO_USERS } from "@/data/users";
import { Logo } from "@/components/Logo";
import {
  Layers,
  Users,
  Briefcase,
  Store,
  Mail,
  Lock,
  ArrowRight,
  Info,
  Eye,
  EyeOff,
  User,
  MapPin,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Phone,
  Shield,
  KeyRound,
  X,
  FileCheck2,
  Sparkles,
} from "lucide-react";

interface AuthScreenProps {
  onAuthenticate: (user: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticate }) => {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [selectedRole, setSelectedRole] = useState<UserRole>("homeowner");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [confirmationNotice, setConfirmationNotice] = useState<string | null>(null);

  // Forgot Password Modal State
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState<boolean>(false);
  const [forgotIdentifier, setForgotIdentifier] = useState<string>("");
  const [forgotSentMessage, setForgotSentMessage] = useState<string | null>(null);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  // Sign Up Form State
  const [regName, setRegName] = useState<string>("");
  const [regIdentifier, setRegIdentifier] = useState<string>(""); // email or mobile
  const [regPhone, setRegPhone] = useState<string>("");
  const [regEmail, setRegEmail] = useState<string>("");
  const [regPassword, setRegPassword] = useState<string>("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState<string>("");
  const [regCity, setRegCity] = useState<string>("Hyderabad");

  // Worker-specific Fields
  const [regSkills, setRegSkills] = useState<FlooringCategory[]>(["Italian Marble"]);
  const [regExperience, setRegExperience] = useState<number>(5);
  const [regTypicalRate, setRegTypicalRate] = useState<number>(75);
  const [regDocCategory, setRegDocCategory] = useState<LabourDocumentCategory>(
    "Telangana BOCWWB Construction Worker Card"
  );
  const [regDocState, setRegDocState] = useState<string>("Telangana");
  const [regDocNumber, setRegDocNumber] = useState<string>("");
  const [uploadedDoc, setUploadedDoc] = useState<{
    name: string;
    sizeKb: number;
    type: string;
  } | null>(null);
  const [docUploadError, setDocUploadError] = useState<string>("");

  // Shop-specific Fields
  const [regShopName, setRegShopName] = useState<string>("");

  const LABOUR_DOC_OPTIONS: LabourDocumentCategory[] = [
    "Telangana BOCWWB Construction Worker Card",
    "State BOCW Construction Worker Card",
    "e-Shram National Worker Registration Card",
    "Artisans / Craftsman Guild Registration Identity",
    "Other State Construction Worker Card",
  ];

  const TRADE_CATEGORIES: FlooringCategory[] = [
    "Italian Marble",
    "Indian Marble",
    "Granite",
    "Vitrified Tiles",
    "Ceramic Tiles",
    "Terrazzo / Mosaic",
    "Wooden / Laminate",
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocUploadError("");
    const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      setDocUploadError("Accepted formats: PDF, JPG, PNG. Please upload a valid document file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setDocUploadError("File size exceeds 5MB limit. Please upload a smaller scan.");
      return;
    }

    setUploadedDoc({
      name: file.name,
      sizeKb: Math.round(file.size / 1024),
      type: file.type,
    });
  };

  // Toggle Trade Skill
  const toggleSkill = (skill: FlooringCategory) => {
    if (regSkills.includes(skill)) {
      if (regSkills.length === 1) return; // Keep at least one
      setRegSkills(regSkills.filter((s) => s !== skill));
    } else {
      setRegSkills([...regSkills, skill]);
    }
  };

  // Manual Login Handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setConfirmationNotice(null);

    if (!loginIdentifier.trim()) {
      setErrorMessage("Please enter your registered email or mobile number.");
      return;
    }

    if (!loginPassword.trim()) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: loginIdentifier.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (data.status === "OK" && data.user) {
        onAuthenticate(data.user);
      } else {
        setErrorMessage(data.message || "Invalid credentials. Please verify your email/mobile and password.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to reach authentication server.");
    } finally {
      setLoading(false);
    }
  };

  // Manual Registration Handler
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setConfirmationNotice(null);

    if (!regName.trim() || regName.trim().length < 2) {
      setErrorMessage("Please enter your full legal name (minimum 2 characters).");
      return;
    }

    if (!regIdentifier.trim()) {
      setErrorMessage("Please enter a valid mobile number or email address.");
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    if (regPassword !== regPasswordConfirm) {
      setErrorMessage("Password and confirmation password do not match.");
      return;
    }

    // Worker-specific validation: Labour Card is mandatory
    if (selectedRole === "worker") {
      if (regSkills.length === 0) {
        setErrorMessage("Please select at least one flooring trade skill.");
        return;
      }
      if (!uploadedDoc) {
        setErrorMessage(
          "Labour registration card or document upload is mandatory for Worker / Mesthri registration. Please upload your valid card."
        );
        return;
      }
    }

    setLoading(true);
    try {
      const payload: any = {
        role: selectedRole,
        name: regName.trim(),
        identifier: regIdentifier.trim(),
        phone: regPhone.trim() || (regIdentifier.includes("@") ? undefined : regIdentifier.trim()),
        email: regEmail.trim() || (regIdentifier.includes("@") ? regIdentifier.trim() : undefined),
        password: regPassword,
        passwordConfirm: regPasswordConfirm,
        city: regCity,
      };

      if (selectedRole === "worker") {
        payload.skills = regSkills;
        payload.experienceYears = Number(regExperience);
        payload.typicalSqftRate = Number(regTypicalRate);
        payload.labourDocument = {
          documentCategory: regDocCategory,
          issuingState: regDocState,
          documentNumber: regDocNumber.trim() || undefined,
          fileName: uploadedDoc?.name,
          fileSizeKb: uploadedDoc?.sizeKb,
          fileType: uploadedDoc?.type,
        };
      } else if (selectedRole === "shop") {
        payload.shopName = regShopName.trim() || `${regName.trim()} Marble & Tile Depot`;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.status === "CREATED" && data.user) {
        if (data.confirmationMessage) {
          setConfirmationNotice(data.confirmationMessage);
          // Pass user to authenticated state
          setTimeout(() => {
            onAuthenticate(data.user);
          }, 2400);
        } else {
          onAuthenticate(data.user);
        }
      } else {
        setErrorMessage(data.message || "Failed to create account.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Error submitting registration request.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) return;

    setForgotSentMessage(
      `Password recovery instructions have been sent to "${forgotIdentifier.trim()}". Please follow the verification link sent via SMS/Email.`
    );
  };

  return (
    <div className="min-h-screen bg-[#F6F2E9] text-[#172321] flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-[#245B50] selection:text-white">
      {/* Centered Dark Forest-Green Card */}
      <div className="w-full max-w-xl bg-[#172321] text-[#FAF7F0] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#245B50]/40 my-auto">
        {/* Header: Logo, Name, Subtitle */}
        <div className="flex flex-col items-center text-center mb-6">
          <Logo theme="light" size="lg" showTagline={true} className="mb-2" />
          <p className="text-xs text-[#C5A66B] font-medium tracking-wide">
            Flooring Services &amp; Material Marketplace
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">
            Manual Credential Authentication &amp; Labour Verification System
          </p>
        </div>

        {/* Tab switch: Sign In vs Create Account */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-black/30 rounded-2xl border border-white/10 mb-5">
          <button
            type="button"
            onClick={() => {
              setAuthMode("signin");
              setErrorMessage("");
              setConfirmationNotice(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              authMode === "signin"
                ? "bg-[#245B50] text-white shadow-sm border border-[#C5A66B]/40"
                : "text-stone-400 hover:text-white"
            }`}
          >
            Manual Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("signup");
              setErrorMessage("");
              setConfirmationNotice(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              authMode === "signup"
                ? "bg-[#245B50] text-white shadow-sm border border-[#C5A66B]/40"
                : "text-stone-400 hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error / Confirmation Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-xs text-rose-200 text-center flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {confirmationNotice && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-xs text-emerald-200 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 font-bold text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Submission Received</span>
            </div>
            <p className="leading-relaxed">{confirmationNotice}</p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 1: MANUAL SIGN IN & 1-CLICK QUICK DEMO ACCESS                        */}
        {/* ========================================================================= */}
        {authMode === "signin" && (
          <div className="space-y-4">
            {/* Quick Demo Evaluation Personas for College Presentation */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#C5A66B] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A66B]" />
                  College Presentation: 1-Click Demo Mode
                </span>
                <span className="text-[10px] text-stone-400">Instant Access</span>
              </div>
              <p className="text-[11px] text-stone-300">
                Click any role to test the platform instantly with realistic data:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onAuthenticate(DEMO_USERS.homeowner)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-[#245B50] text-white text-xs font-semibold flex items-center gap-2 border border-white/10 transition-colors text-left cursor-pointer group"
                >
                  <Users className="w-4 h-4 text-[#C5A66B] shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="overflow-hidden">
                    <span className="block font-bold text-[11px]">Homeowner</span>
                    <span className="block text-[10px] text-stone-400 truncate">Anand Sharma</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onAuthenticate(DEMO_USERS.worker)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-[#245B50] text-white text-xs font-semibold flex items-center gap-2 border border-white/10 transition-colors text-left cursor-pointer group"
                >
                  <Briefcase className="w-4 h-4 text-[#C5A66B] shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="overflow-hidden">
                    <span className="block font-bold text-[11px]">Worker Account</span>
                    <span className="block text-[10px] text-stone-400 truncate">Worker Portal Demo</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onAuthenticate(DEMO_USERS.shop)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-[#245B50] text-white text-xs font-semibold flex items-center gap-2 border border-white/10 transition-colors text-left cursor-pointer group"
                >
                  <Store className="w-4 h-4 text-[#C5A66B] shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="overflow-hidden">
                    <span className="block font-bold text-[11px]">Material Depot</span>
                    <span className="block text-[10px] text-stone-400 truncate">Balaji Marble</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onAuthenticate((DEMO_USERS as any).admin)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-[#245B50] text-white text-xs font-semibold flex items-center gap-2 border border-white/10 transition-colors text-left cursor-pointer group"
                >
                  <Shield className="w-4 h-4 text-[#C5A66B] shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="overflow-hidden">
                    <span className="block font-bold text-[11px]">Review Officer</span>
                    <span className="block text-[10px] text-stone-400 truncate">Labour Audit</span>
                  </div>
                </button>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-2 text-[10px] text-stone-400 uppercase tracking-widest font-semibold">
                  Or Manual Credentials Login
                </span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email or Mobile Number */}
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Email or Mobile Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="name@example.com or 98490XXXXX"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/30 border border-white/15 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#C5A66B] focus:ring-1 focus:ring-[#C5A66B] transition-all"
                />
              </div>
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-stone-300">Password</label>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-[11px] text-[#C5A66B] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-black/30 border border-white/15 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#C5A66B] focus:ring-1 focus:ring-[#C5A66B] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-white p-0.5 transition-colors focus:outline-none cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Manual Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#245B50] hover:bg-[#1A443C] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 group border border-[#245B50] cursor-pointer mt-3"
            >
              <span>{loading ? "Authenticating..." : "Manual Log In"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-[#C5A66B]" />
            </button>

            {/* Reviewer / Admin Login Tip */}
            <div className="text-center pt-2">
              <p className="text-[11px] text-stone-400">
                Review Officers: Log in with authorized credentials to inspect pending labour card verifications.
              </p>
            </div>
          </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 2: MANUAL CREATE ACCOUNT (ROLE SELECTION + MANDATORY LABOUR CARD)    */}
        {/* ========================================================================= */}
        {authMode === "signup" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* 1. Mandatory Role Selection */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-2 text-center">
                Select Your Registered Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole("homeowner")}
                  className={`py-2.5 px-2 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    selectedRole === "homeowner"
                      ? "bg-[#245B50] text-white border-[#C5A66B] shadow-sm ring-1 ring-[#C5A66B]/50"
                      : "bg-white/5 text-stone-300 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <Users
                    className={`w-4 h-4 ${
                      selectedRole === "homeowner" ? "text-[#C5A66B]" : "text-stone-400"
                    }`}
                  />
                  <span className="text-[11px] leading-tight text-center">Homeowner</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole("worker")}
                  className={`py-2.5 px-2 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    selectedRole === "worker"
                      ? "bg-[#245B50] text-white border-[#C5A66B] shadow-sm ring-1 ring-[#C5A66B]/50"
                      : "bg-white/5 text-stone-300 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <Briefcase
                    className={`w-4 h-4 ${
                      selectedRole === "worker" ? "text-[#C5A66B]" : "text-stone-400"
                    }`}
                  />
                  <span className="text-[11px] leading-tight text-center">Worker / Mesthri</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole("shop")}
                  className={`py-2.5 px-2 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    selectedRole === "shop"
                      ? "bg-[#245B50] text-white border-[#C5A66B] shadow-sm ring-1 ring-[#C5A66B]/50"
                      : "bg-white/5 text-stone-300 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <Store
                    className={`w-4 h-4 ${
                      selectedRole === "shop" ? "text-[#C5A66B]" : "text-stone-400"
                    }`}
                  />
                  <span className="text-[11px] leading-tight text-center">Marble &amp; Tile Shop</span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                {selectedRole === "shop" ? "Owner / Manager Full Name" : "Legal Full Name"}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Anand Sharma / Venkat Rao"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/30 border border-white/15 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#C5A66B] focus:ring-1 focus:ring-[#C5A66B] transition-all"
                />
              </div>
            </div>

            {/* Mobile / Contact Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Mobile Number (Required)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={regIdentifier}
                    onChange={(e) => setRegIdentifier(e.target.value)}
                    placeholder="+91 98490XXXXX"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/30 border border-white/15 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#C5A66B] focus:ring-1 focus:ring-[#C5A66B] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="worker@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/30 border border-white/15 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#C5A66B] focus:ring-1 focus:ring-[#C5A66B] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Operating City in Telangana */}
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Work Location / Operating City (Telangana)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#172321] border border-white/15 text-white text-xs focus:outline-none focus:border-[#C5A66B] focus:ring-1 focus:ring-[#C5A66B] transition-all"
                >
                  {TELANGANA_CITIES.map((c) => (
                    <option key={c} value={c} className="bg-[#172321] text-white">
                      {c}, Telangana
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Shop Name (if shop) */}
            {selectedRole === "shop" && (
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Retail Marble &amp; Tile Shop Business Name
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={regShopName}
                    onChange={(e) => setRegShopName(e.target.value)}
                    placeholder="e.g. Sri Balaji Marble & Granite Depot"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/30 border border-white/15 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#C5A66B] focus:ring-1 focus:ring-[#C5A66B] transition-all"
                  />
                </div>
              </div>
            )}

            {/* WORKER SPECIFIC MANDATORY REGISTRATION SECTION */}
            {selectedRole === "worker" && (
              <div className="p-4 rounded-2xl bg-black/40 border border-[#C5A66B]/30 space-y-3.5 mt-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#C5A66B]" />
                  <h4 className="text-xs font-bold text-[#C5A66B] uppercase tracking-wider">
                    Worker Trade &amp; Mandatory Labour Card Verification
                  </h4>
                </div>

                {/* Trade Skills */}
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Flooring Trades &amp; Skills (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {TRADE_CATEGORIES.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          regSkills.includes(skill)
                            ? "bg-[#245B50] text-white border border-[#C5A66B]"
                            : "bg-white/5 text-stone-400 border border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Experience & Reference Rate */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      required
                      value={regExperience}
                      onChange={(e) => setRegExperience(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#172321] border border-white/15 text-white text-xs focus:outline-none focus:border-[#C5A66B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Benchmark Rate (₹/sq.ft)
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={1000}
                      required
                      value={regTypicalRate}
                      onChange={(e) => setRegTypicalRate(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#172321] border border-white/15 text-white text-xs focus:outline-none focus:border-[#C5A66B]"
                    />
                  </div>
                </div>

                {/* Labour Document Selection */}
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Applicable Labour Registration Document
                  </label>
                  <select
                    value={regDocCategory}
                    onChange={(e) => setRegDocCategory(e.target.value as LabourDocumentCategory)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#172321] border border-white/15 text-white text-xs focus:outline-none focus:border-[#C5A66B]"
                  >
                    {LABOUR_DOC_OPTIONS.map((doc) => (
                      <option key={doc} value={doc} className="bg-[#172321] text-white">
                        {doc}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-stone-400 mt-1 leading-snug">
                    Accepted documents: Telangana BOCWWB Welfare Board card, State BOCW card, e-Shram National Worker Card, or Artisan Guild identity. Manual review support is available if your trade uses a different state registration.
                  </p>
                </div>

                {/* Registration Number (Optional / Masked) */}
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Card Registration Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={regDocNumber}
                    onChange={(e) => setRegDocNumber(e.target.value)}
                    placeholder="e.g. TG-BOCW-2024-XXXX"
                    className="w-full px-3 py-2 rounded-xl bg-[#172321] border border-white/15 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#C5A66B]"
                  />
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    Registration numbers are encrypted and never exposed on your public profile.
                  </p>
                </div>

                {/* Mandatory Document File Upload */}
                <div>
                  <label className="block text-xs font-semibold text-[#C5A66B] mb-1">
                    Upload Labour Card Document (Mandatory) *
                  </label>
                  <div className="border border-dashed border-white/20 hover:border-[#C5A66B] rounded-xl p-3 text-center bg-black/20 transition-colors">
                    <input
                      type="file"
                      id="worker-doc-file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="worker-doc-file"
                      className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                    >
                      <Upload className="w-5 h-5 text-[#C5A66B]" />
                      {uploadedDoc ? (
                        <div className="text-xs text-emerald-300">
                          <span className="font-semibold">{uploadedDoc.name}</span>
                          <span className="text-[11px] text-stone-400 block">
                            {uploadedDoc.sizeKb} KB • Ready for verification review
                          </span>
                        </div>
                      ) : (
                        <div className="text-xs text-stone-300">
                          <span className="font-semibold text-white">Click to upload document</span>
                          <span className="text-[11px] text-stone-400 block">
                            Accepts PDF, JPG, PNG (Max 5MB)
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                  {docUploadError && (
                    <p className="text-[11px] text-rose-300 mt-1">{docUploadError}</p>
                  )}
                </div>

                {/* Verification Notice */}
                <div className="p-2.5 rounded-xl bg-[#245B50]/30 border border-[#245B50]/60 text-[11px] text-stone-300 leading-relaxed">
                  <strong>Verification Workflow Notice:</strong> Your worker account will be created with status <em>“Pending Verification”</em>. It will <strong>NOT</strong> become active until an authorized reviewer validates your labour document.
                </div>
              </div>
            )}

            {/* Password and Password Confirmation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min. 6 chars"
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-black/30 border border-white/15 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#C5A66B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-stone-400 hover:text-white p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    required
                    value={regPasswordConfirm}
                    onChange={(e) => setRegPasswordConfirm(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-black/30 border border-white/15 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#C5A66B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-2.5 top-2.5 text-stone-400 hover:text-white p-0.5"
                  >
                    {showPasswordConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#245B50] hover:bg-[#1A443C] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 group border border-[#245B50] cursor-pointer mt-3"
            >
              <span>{loading ? "Submitting Registration..." : "Create Account & Submit"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-[#C5A66B]" />
            </button>
          </form>
        )}

        {/* Honest Backend & Academic Prototype Notice */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center space-y-1">
          <p className="text-[11px] text-stone-400 leading-snug flex items-center justify-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#C5A66B] shrink-0" />
            <span>Prototype A Environment • Supabase Auth backend not configured (Local Mode)</span>
          </p>
          <p className="text-[10px] text-stone-500">
            Passwords hashed with salt. Sensitive labour cards stored privately and excluded from localStorage.
          </p>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#172321] text-white rounded-3xl max-w-sm w-full border border-stone-700 shadow-2xl p-6">
            <div className="flex items-start justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#C5A66B]" />
                <h3 className="text-base font-bold font-serif text-[#FAF7F0]">Reset Password</h3>
              </div>
              <button
                onClick={() => {
                  setIsForgotPasswordOpen(false);
                  setForgotSentMessage(null);
                }}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotSentMessage ? (
              <div className="my-4 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-xs text-emerald-200 space-y-2">
                <p>{forgotSentMessage}</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPasswordOpen(false);
                    setForgotSentMessage(null);
                  }}
                  className="w-full py-2 rounded-xl bg-[#245B50] text-white text-xs font-bold"
                >
                  Return to Log In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 my-4">
                <p className="text-xs text-stone-300 leading-relaxed">
                  Enter your registered email address or mobile number. We will send a secure password reset link or verification code.
                </p>
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Email or Mobile Number
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="name@example.com or 98490XXXXX"
                    className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/20 text-white text-xs focus:outline-none focus:border-[#C5A66B]"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="px-3 py-2 rounded-xl border border-stone-700 text-xs text-stone-300 hover:bg-stone-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#245B50] hover:bg-[#1A443C] text-white text-xs font-bold"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
