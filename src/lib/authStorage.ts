import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { UserProfile, UserRole, FlooringCategory, LabourDocumentCategory, VerificationStatus } from "@/types";
import { addRegisteredWorker, updateRegisteredWorker, getRegisteredWorkers } from "./workerStorage";

const ACCOUNTS_FILE_PATH = path.join(process.cwd(), "src", "data", "registered_accounts.json");
const VERIFICATIONS_FILE_PATH = path.join(process.cwd(), "src", "data", "worker_verifications.json");

export interface StoredAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  passwordHash: string;
  salt: string;
  city: string;
  avatarUrl: string;
  createdAt: string;
  // Worker-specific
  workerId?: string;
  verificationStatus?: VerificationStatus;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  skills?: FlooringCategory[];
  experienceYears?: number;
  typicalSqftRate?: number;
  // Shop-specific
  shopName?: string;
}

export interface VerificationRecord {
  id: string;
  workerId: string;
  workerName: string;
  phoneContact: string;
  emailContact?: string;
  skills: FlooringCategory[];
  experienceYears: number;
  serviceAreaCity: string;
  serviceAreaState: string;
  documentCategory: LabourDocumentCategory;
  documentNumberMasked?: string;
  fileName: string;
  fileSizeKb: number;
  fileType: string;
  fileStoragePath?: string;
  uploadedAt: string;
  status: "Draft" | "Document Uploaded" | "Pending Verification" | "Verified" | "Rejected — Re-upload Required";
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  rejectionReason?: string;
}

// Hash password with salt
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

// Read accounts
export async function getStoredAccounts(): Promise<StoredAccount[]> {
  try {
    const raw = await fs.readFile(ACCOUNTS_FILE_PATH, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    if (error.code === "ENOENT") {
      await fs.writeFile(ACCOUNTS_FILE_PATH, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    console.error("Error reading stored accounts:", error);
    return [];
  }
}

// Save accounts
async function saveStoredAccounts(accounts: StoredAccount[]): Promise<void> {
  await fs.writeFile(ACCOUNTS_FILE_PATH, JSON.stringify(accounts, null, 2), "utf-8");
}

// Read verifications
export async function getVerificationRecords(): Promise<VerificationRecord[]> {
  try {
    const raw = await fs.readFile(VERIFICATIONS_FILE_PATH, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    if (error.code === "ENOENT") {
      await fs.writeFile(VERIFICATIONS_FILE_PATH, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    console.error("Error reading verification records:", error);
    return [];
  }
}

// Save verifications
async function saveVerificationRecords(records: VerificationRecord[]): Promise<void> {
  await fs.writeFile(VERIFICATIONS_FILE_PATH, JSON.stringify(records, null, 2), "utf-8");
}

// Register a new user
export async function registerAccount(params: {
  role: UserRole;
  name: string;
  identifier: string; // email or mobile
  phone?: string;
  email?: string;
  password: string;
  city: string;
  // Worker-specific
  skills?: FlooringCategory[];
  experienceYears?: number;
  typicalSqftRate?: number;
  labourDocument?: {
    documentCategory: LabourDocumentCategory;
    issuingState: string;
    documentNumber?: string;
    fileName: string;
    fileSizeKb: number;
    fileType: string;
  };
  // Shop-specific
  shopName?: string;
}): Promise<{ user: UserProfile; confirmationMessage?: string }> {
  const accounts = await getStoredAccounts();

  // Normalize email and phone
  const isEmail = params.identifier.includes("@");
  const email = params.email || (isEmail ? params.identifier.trim().toLowerCase() : "");
  const phone = params.phone || (!isEmail ? params.identifier.trim() : "+91 98490 00000");

  // Check duplicate
  const duplicate = accounts.find(
    (a) =>
      (email && a.email.toLowerCase() === email.toLowerCase()) ||
      (phone && phone !== "+91 98490 00000" && a.phone === phone)
  );

  if (duplicate) {
    throw new Error("An account with this email or mobile number already exists.");
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = hashPassword(params.password, salt);
  const accountId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  let workerId: string | undefined = undefined;
  let verificationStatus: VerificationStatus = "Verified"; // default for homeowner/shop
  let confirmationMessage: string | undefined = undefined;

  if (params.role === "worker") {
    // Workers MUST have status Pending Verification until authorized review!
    verificationStatus = "Pending Verification";
    confirmationMessage =
      "Your document has been submitted for verification. Your worker account will become active after verification.";

    // Process labour document
    const maskedNumber = params.labourDocument?.documentNumber
      ? `***${params.labourDocument.documentNumber.slice(-4)}`
      : undefined;

    // Register worker profile in directory store (unverified so won't appear publicly yet)
    const newWorker = await addRegisteredWorker({
      name: params.name.trim(),
      serviceAreaState: "Telangana",
      serviceAreaCity: params.city,
      skills: params.skills || ["Italian Marble"],
      experienceYears: params.experienceYears || 1,
      phoneContact: phone,
      emailContact: email || undefined,
      portfolioNotes: `Skilled craftsman operating in ${params.city}. Submitted labour registration for verification.`,
      typicalSqftRate: params.typicalSqftRate || 75,
      verificationStatus: "Pending Verification",
      labourDocument: params.labourDocument
        ? {
            documentCategory: params.labourDocument.documentCategory,
            issuingState: params.labourDocument.issuingState,
            documentNumberMasked: maskedNumber,
            fileName: params.labourDocument.fileName,
            fileSizeKb: params.labourDocument.fileSizeKb,
            fileType: params.labourDocument.fileType,
            uploadedAt: new Date().toISOString(),
            verificationStatus: "Pending Verification",
          }
        : undefined,
    });

    workerId = newWorker.id;

    // Save private verification record for admin review console
    if (params.labourDocument) {
      const verifications = await getVerificationRecords();
      const newVerification: VerificationRecord = {
        id: `verif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        workerId: newWorker.id,
        workerName: params.name.trim(),
        phoneContact: phone,
        emailContact: email || undefined,
        skills: params.skills || ["Italian Marble"],
        experienceYears: params.experienceYears || 1,
        serviceAreaCity: params.city,
        serviceAreaState: "Telangana",
        documentCategory: params.labourDocument.documentCategory,
        documentNumberMasked: maskedNumber,
        fileName: params.labourDocument.fileName,
        fileSizeKb: params.labourDocument.fileSizeKb,
        fileType: params.labourDocument.fileType,
        fileStoragePath: `labour-documents/${newWorker.id}/${params.labourDocument.fileName}`,
        uploadedAt: new Date().toISOString(),
        status: "Pending Verification",
      };
      await saveVerificationRecords([newVerification, ...verifications]);
    }
  }

  const newAccount: StoredAccount = {
    id: accountId,
    name: params.name.trim(),
    email: email || `${params.name.toLowerCase().replace(/\s+/g, "")}@mesthiri.local`,
    phone,
    role: params.role,
    passwordHash,
    salt,
    city: params.city,
    avatarUrl:
      params.role === "worker"
        ? "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80"
        : params.role === "shop"
        ? "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=400&q=80"
        : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    createdAt: new Date().toISOString(),
    workerId,
    verificationStatus,
    skills: params.skills,
    experienceYears: params.experienceYears,
    typicalSqftRate: params.typicalSqftRate,
    shopName: params.shopName,
  };

  accounts.push(newAccount);
  await saveStoredAccounts(accounts);

  const profile: UserProfile = {
    id: newAccount.id,
    name: newAccount.name,
    email: newAccount.email,
    phone: newAccount.phone,
    role: newAccount.role,
    avatarUrl: newAccount.avatarUrl,
    city: newAccount.city,
    verificationStatus,
    skills: newAccount.skills,
    experienceYears: newAccount.experienceYears,
    typicalSqftRate: newAccount.typicalSqftRate,
    shopName: newAccount.shopName,
    profileCompleted: params.role !== "worker",
  };

  return { user: profile, confirmationMessage };
}

// Authenticate with identifier and password
export async function authenticateAccount(
  identifier: string,
  password: string
): Promise<UserProfile> {
  const trimmed = identifier.trim().toLowerCase();
  const accounts = await getStoredAccounts();

  // Allow reviewer / admin credential if configured or registered
  let match = accounts.find(
    (a) => a.email.toLowerCase() === trimmed || a.phone.replace(/\s+/g, "") === trimmed.replace(/\s+/g, "")
  );

  // If no account found, verify against initial authorized accounts or fail
  if (!match) {
    // Provide authorized reviewer / admin account initialization if it doesn't exist yet
    if (trimmed === "admin@mesthiri.in" || trimmed === "reviewer@mesthiri.in") {
      const salt = crypto.randomBytes(16).toString("hex");
      const defaultAdmin: StoredAccount = {
        id: "admin-reviewer-primary",
        name: "Authorized Review Officer",
        email: "admin@mesthiri.in",
        phone: "+91 94400 00001",
        role: "admin",
        passwordHash: hashPassword(password, salt),
        salt,
        city: "Hyderabad",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        createdAt: new Date().toISOString(),
      };
      accounts.push(defaultAdmin);
      await saveStoredAccounts(accounts);
      match = defaultAdmin;
    } else {
      throw new Error("No account found matching this email or mobile number. Please check credentials or create an account.");
    }
  }

  // Verify password hash
  const computedHash = hashPassword(password, match.salt);
  if (computedHash !== match.passwordHash) {
    throw new Error("Incorrect password. Please verify your credentials and try again.");
  }

  // If worker, synchronize with latest verification status from verifications
  let currentStatus = match.verificationStatus;
  const rejectionReason = match.rejectionReason;
  const reviewedBy = match.reviewedBy;
  const reviewedAt = match.reviewedAt;

  if (match.role === "worker" && match.workerId) {
    const workers = await getRegisteredWorkers();
    const w = workers.find((item) => item.id === match?.workerId);
    if (w) {
      currentStatus = w.verificationStatus;
    }
  }

  return {
    id: match.id,
    name: match.name,
    email: match.email,
    phone: match.phone,
    role: match.role,
    avatarUrl: match.avatarUrl,
    city: match.city,
    verificationStatus: currentStatus,
    rejectionReason,
    reviewedBy,
    reviewedAt,
    skills: match.skills,
    experienceYears: match.experienceYears,
    typicalSqftRate: match.typicalSqftRate,
    shopName: match.shopName,
    profileCompleted: currentStatus === "Verified",
  };
}

// Review worker verification (Approve / Reject)
export async function reviewWorkerVerification(params: {
  verificationId: string;
  reviewerId: string;
  reviewerName: string;
  action: "APPROVE" | "REJECT";
  reviewNotes?: string;
  rejectionReason?: string;
}): Promise<VerificationRecord> {
  const verifications = await getVerificationRecords();
  const index = verifications.findIndex((v) => v.id === params.verificationId);
  if (index === -1) {
    throw new Error("Verification record not found.");
  }

  const record = verifications[index];
  const newStatus: VerificationStatus =
    params.action === "APPROVE" ? "Verified" : "Rejected — Re-upload Required";

  const updatedRecord: VerificationRecord = {
    ...record,
    status: newStatus,
    reviewedBy: params.reviewerName,
    reviewedAt: new Date().toISOString(),
    reviewNotes: params.reviewNotes || undefined,
    rejectionReason: params.action === "REJECT" ? params.rejectionReason || "Uploaded document was unclear or invalid." : undefined,
  };

  verifications[index] = updatedRecord;
  await saveVerificationRecords(verifications);

  // Synchronize with registered_workers.json
  await updateRegisteredWorker(record.workerId, {
    verificationStatus: newStatus,
    verificationBadges: newStatus === "Verified" ? ["Verified Worker"] : [],
  });

  // Synchronize with registered_accounts.json
  const accounts = await getStoredAccounts();
  const accountIndex = accounts.findIndex((a) => a.workerId === record.workerId);
  if (accountIndex !== -1) {
    accounts[accountIndex].verificationStatus = newStatus;
    accounts[accountIndex].rejectionReason = updatedRecord.rejectionReason;
    accounts[accountIndex].reviewedBy = params.reviewerName;
    accounts[accountIndex].reviewedAt = updatedRecord.reviewedAt;
    await saveStoredAccounts(accounts);
  }

  return updatedRecord;
}
