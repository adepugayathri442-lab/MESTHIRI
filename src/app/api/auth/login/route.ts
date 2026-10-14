import { NextRequest, NextResponse } from "next/server";
import { authenticateAccount } from "@/lib/authStorage";
import { isSupabaseConfigured, getSupabaseConfigStatus } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || typeof identifier !== "string" || !identifier.trim()) {
      return NextResponse.json(
        { status: "ERROR", message: "Email or mobile number is required." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || !password.trim()) {
      return NextResponse.json(
        { status: "ERROR", message: "Password is required." },
        { status: 400 }
      );
    }

    const user = await authenticateAccount(identifier.trim(), password);
    const supabaseStatus = getSupabaseConfigStatus();

    return NextResponse.json({
      status: "OK",
      message: `Signed in successfully as ${user.name} (${user.role}).`,
      user,
      backendStatus: {
        isSupabaseConfigured: supabaseStatus.isConfigured,
        mode: supabaseStatus.isConfigured ? "Supabase Auth" : "Prototype Local Store",
        statusNote: supabaseStatus.statusMessage,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "ERROR",
        message: error?.message || "Authentication failed. Please verify your credentials.",
      },
      { status: 401 }
    );
  }
}
