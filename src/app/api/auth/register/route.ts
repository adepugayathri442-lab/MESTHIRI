import { NextRequest, NextResponse } from "next/server";
import { registerAccount } from "@/lib/authStorage";
import { getSupabaseConfigStatus } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      role,
      name,
      identifier,
      phone,
      email,
      password,
      passwordConfirm,
      city = "Hyderabad",
      skills,
      experienceYears,
      typicalSqftRate,
      labourDocument,
      shopName,
    } = body;

    // Validate role
    if (!["homeowner", "worker", "shop"].includes(role)) {
      return NextResponse.json(
        { status: "ERROR", message: "A valid role (Homeowner, Worker, or Shop) must be selected." },
        { status: 400 }
      );
    }

    // Validate name
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { status: "ERROR", message: "Full name is required (minimum 2 characters)." },
        { status: 400 }
      );
    }

    // Validate identifier (email or mobile)
    if (!identifier || typeof identifier !== "string" || identifier.trim().length < 5) {
      return NextResponse.json(
        { status: "ERROR", message: "Valid email or mobile number is required." },
        { status: 400 }
      );
    }

    // Validate password
    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { status: "ERROR", message: "Password must be at least 6 characters in length." },
        { status: 400 }
      );
    }

    // Validate password confirmation
    if (password !== passwordConfirm) {
      return NextResponse.json(
        { status: "ERROR", message: "Password and confirmation do not match." },
        { status: 400 }
      );
    }

    // WORKER SPECIFIC MANDATORY VALIDATION
    if (role === "worker") {
      if (!Array.isArray(skills) || skills.length === 0) {
        return NextResponse.json(
          { status: "ERROR", message: "Select at least one flooring trade category or skill." },
          { status: 400 }
        );
      }

      const exp = Number(experienceYears);
      if (isNaN(exp) || exp < 0 || exp > 50) {
        return NextResponse.json(
          { status: "ERROR", message: "Work experience must be between 0 and 50 years." },
          { status: 400 }
        );
      }

      // Mandatory labour document upload
      if (!labourDocument || !labourDocument.fileName || !labourDocument.documentCategory) {
        return NextResponse.json(
          {
            status: "ERROR",
            message:
              "Labour registration card or document upload is mandatory for worker registration. Please attach an accepted PDF, JPG, or PNG document.",
          },
          { status: 400 }
        );
      }

      // Validate file size (max 5MB = 5120 KB)
      if (labourDocument.fileSizeKb && labourDocument.fileSizeKb > 5120) {
        return NextResponse.json(
          { status: "ERROR", message: "Uploaded document exceeds the 5MB file limit." },
          { status: 400 }
        );
      }
    }

    // Register user in store
    const { user, confirmationMessage } = await registerAccount({
      role,
      name: name.trim(),
      identifier: identifier.trim(),
      phone: phone?.trim(),
      email: email?.trim(),
      password,
      city: city.trim(),
      skills: role === "worker" ? skills : undefined,
      experienceYears: role === "worker" ? Number(experienceYears) || 0 : undefined,
      typicalSqftRate: role === "worker" ? Number(typicalSqftRate) || 75 : undefined,
      labourDocument: role === "worker" ? labourDocument : undefined,
      shopName: role === "shop" ? shopName?.trim() : undefined,
    });

    const supabaseStatus = getSupabaseConfigStatus();

    return NextResponse.json(
      {
        status: "CREATED",
        message:
          confirmationMessage ||
          `Account created successfully for ${user.name}. You are logged in as ${user.role}.`,
        confirmationMessage,
        user,
        backendStatus: {
          isSupabaseConfigured: supabaseStatus.isConfigured,
          mode: supabaseStatus.isConfigured ? "Supabase Auth" : "Prototype Local Store",
          statusNote: supabaseStatus.statusMessage,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "ERROR",
        message: error?.message || "Failed to complete account registration.",
      },
      { status: 400 }
    );
  }
}
