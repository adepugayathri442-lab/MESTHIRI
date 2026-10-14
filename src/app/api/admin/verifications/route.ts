import { NextRequest, NextResponse } from "next/server";
import { getVerificationRecords, reviewWorkerVerification } from "@/lib/authStorage";

// GET /api/admin/verifications - List all worker verification submissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    let records = await getVerificationRecords();

    if (statusFilter && statusFilter !== "ALL") {
      records = records.filter((r) => r.status === statusFilter);
    }

    return NextResponse.json({
      status: "OK",
      count: records.length,
      results: records,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "ERROR", message: error?.message || "Failed to load verification records." },
      { status: 500 }
    );
  }
}

// POST /api/admin/verifications - Review an application (Approve or Reject)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { verificationId, reviewerName = "Verification Review Officer", action, reviewNotes, rejectionReason } = body;

    if (!verificationId) {
      return NextResponse.json(
        { status: "ERROR", message: "Verification ID is required." },
        { status: 400 }
      );
    }

    if (action !== "APPROVE" && action !== "REJECT") {
      return NextResponse.json(
        { status: "ERROR", message: "Action must be either APPROVE or REJECT." },
        { status: 400 }
      );
    }

    if (action === "REJECT" && (!rejectionReason || !rejectionReason.trim())) {
      return NextResponse.json(
        { status: "ERROR", message: "A specific rejection reason is required when rejecting a labour document." },
        { status: 400 }
      );
    }

    const updated = await reviewWorkerVerification({
      verificationId,
      reviewerId: "admin-officer",
      reviewerName,
      action,
      reviewNotes,
      rejectionReason,
    });

    return NextResponse.json({
      status: "OK",
      message:
        action === "APPROVE"
          ? `Application approved. Worker ${updated.workerName} is now marked as Verified.`
          : `Application rejected. Worker ${updated.workerName} has been notified to re-upload document.`,
      record: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "ERROR", message: error?.message || "Failed to complete verification review." },
      { status: 500 }
    );
  }
}
