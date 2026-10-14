import { NextRequest, NextResponse } from "next/server";
import {
  getRegisteredWorkers,
  addRegisteredWorker,
  updateRegisteredWorker,
} from "@/lib/workerStorage";
import { FlooringCategory, TELANGANA_CITIES, VerificationStatus, LabourDocumentUpload } from "@/types";

// GET /api/workers - Retrieve registered workers with city and category filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || "";
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search")?.toLowerCase() || "";

    const allWorkers = await getRegisteredWorkers();

    // Strict Visibility Rule: ONLY genuinely verified workers appear in the homeowner's directory!
    // Unverified workers (Draft, Pending Verification, Rejected) must never be presented to homeowners as approved workers.
    let filtered = allWorkers.filter(
      (w) => w.verificationStatus === "Verified" || w.verificationStatus === "Document Verified"
    );

    // Filter by Telangana city
    if (city && city !== "All Cities" && city !== "All Telangana") {
      filtered = filtered.filter(
        (w) => w.serviceAreaCity?.toLowerCase() === city.toLowerCase()
      );
    }

    // Filter by flooring category / skill
    if (category && category !== "All Categories") {
      filtered = filtered.filter((w) =>
        w.skills.some(
          (s) => s.toLowerCase() === category.toLowerCase()
        )
      );
    }

    // Filter by free text search query
    if (search) {
      filtered = filtered.filter(
        (w) =>
          w.name.toLowerCase().includes(search) ||
          w.portfolioNotes?.toLowerCase().includes(search) ||
          w.skills.some((s) => s.toLowerCase().includes(search))
      );
    }

    if (filtered.length === 0) {
      return NextResponse.json({
        status: "ZERO_RESULTS",
        message: "No verified workers are available yet. Please check again later.",
        city: city || "All Telangana",
        category: category || "All Categories",
        count: 0,
        results: [],
      });
    }

    // Privacy & Security: Ensure sensitive document numbers or internal files are sanitized from public response
    const sanitizedResults = filtered.map((w) => ({
      ...w,
      labourDocument: w.labourDocument
        ? {
            documentCategory: w.labourDocument.documentCategory,
            issuingState: w.labourDocument.issuingState,
            uploadedAt: w.labourDocument.uploadedAt,
            verificationStatus: w.labourDocument.verificationStatus,
            fileName: w.labourDocument.fileName,
            fileSizeKb: w.labourDocument.fileSizeKb,
            fileType: w.labourDocument.fileType,
          }
        : undefined,
    }));

    return NextResponse.json({
      status: "OK",
      message: `Retrieved ${sanitizedResults.length} registered worker profiles.`,
      city: city || "All Telangana",
      category: category || "All Categories",
      count: sanitizedResults.length,
      results: sanitizedResults,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "ERROR",
        message: error?.message || "Failed to retrieve registered workers.",
        results: [],
      },
      { status: 500 }
    );
  }
}

// POST /api/workers - Register a new worker profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      serviceAreaState = "Telangana",
      serviceAreaCity,
      serviceAreaNeighborhood,
      skills,
      experienceYears,
      phoneContact,
      emailContact,
      portfolioNotes,
      typicalSqftRate,
      dailyWageExpectation,
      avatarUrl,
      portfolioPhotos,
      labourDocument,
    } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { status: "ERROR", message: "Worker legal name is required (minimum 2 characters)." },
        { status: 400 }
      );
    }

    if (!serviceAreaCity || typeof serviceAreaCity !== "string") {
      return NextResponse.json(
        { status: "ERROR", message: "Primary operating city is required." },
        { status: 400 }
      );
    }

    if (!phoneContact || typeof phoneContact !== "string" || phoneContact.trim().length < 6) {
      return NextResponse.json(
        { status: "ERROR", message: "Contact phone number is required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json(
        { status: "ERROR", message: "At least one flooring trade skill must be selected." },
        { status: 400 }
      );
    }

    const expYears = Number(experienceYears);
    if (isNaN(expYears) || expYears < 0 || expYears > 50) {
      return NextResponse.json(
        { status: "ERROR", message: "Trade experience must be a valid number between 0 and 50 years." },
        { status: 400 }
      );
    }

    // Validate labour document upload if provided
    let processedDocument: LabourDocumentUpload | undefined = undefined;
    if (labourDocument) {
      if (!labourDocument.documentCategory || !labourDocument.fileName) {
        return NextResponse.json(
          { status: "ERROR", message: "Document category and uploaded file are required for labour card submission." },
          { status: 400 }
        );
      }

      // Validate file size (max 5MB = 5120 KB)
      if (labourDocument.fileSizeKb && labourDocument.fileSizeKb > 5120) {
        return NextResponse.json(
          { status: "ERROR", message: "Document file exceeds the 5MB maximum permitted size." },
          { status: 400 }
        );
      }

      processedDocument = {
        documentCategory: labourDocument.documentCategory,
        issuingState: labourDocument.issuingState || serviceAreaState || "Telangana",
        documentNumberMasked: labourDocument.documentNumber
          ? `***${labourDocument.documentNumber.slice(-4)}`
          : undefined,
        fileName: labourDocument.fileName,
        fileSizeKb: labourDocument.fileSizeKb || 450,
        fileType: labourDocument.fileType || "application/pdf",
        uploadedAt: new Date().toISOString(),
        verificationStatus: "Pending Verification", // Explicitly pending human review!
      };
    }

    // Determine initial verification status (never auto-verified!)
    const initialStatus: VerificationStatus = processedDocument
      ? "Pending Verification"
      : "Draft";

    // Add new worker to store
    const newWorker = await addRegisteredWorker({
      name: name.trim(),
      serviceAreaState: serviceAreaState.trim(),
      serviceAreaCity: serviceAreaCity.trim(),
      serviceAreaNeighborhood: serviceAreaNeighborhood ? serviceAreaNeighborhood.trim() : undefined,
      skills: skills as FlooringCategory[],
      experienceYears: expYears,
      phoneContact: phoneContact.trim(),
      emailContact: emailContact ? emailContact.trim() : undefined,
      portfolioNotes: portfolioNotes ? portfolioNotes.trim() : "Skilled flooring craftsman registered on MESTHIRI.",
      typicalSqftRate: typicalSqftRate ? Number(typicalSqftRate) : undefined,
      dailyWageExpectation: dailyWageExpectation ? Number(dailyWageExpectation) : undefined,
      avatarUrl: avatarUrl || undefined,
      portfolioPhotos: Array.isArray(portfolioPhotos) ? portfolioPhotos : [],
      labourDocument: processedDocument,
      verificationStatus: initialStatus,
    });

    return NextResponse.json(
      {
        status: "CREATED",
        message: "Worker profile registered successfully on MESTHIRI. Document verification is pending admin review.",
        worker: newWorker,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "ERROR",
        message: error?.message || "Failed to register worker profile.",
      },
      { status: 500 }
    );
  }
}

// PATCH /api/workers - Update an existing worker profile or submit verification audit items
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { status: "ERROR", message: "Worker ID is required for updating profile." },
        { status: 400 }
      );
    }

    const updated = await updateRegisteredWorker(id, updates);
    if (!updated) {
      return NextResponse.json(
        { status: "NOT_FOUND", message: `Worker with ID ${id} was not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "OK",
      message: "Worker profile updated successfully.",
      worker: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "ERROR",
        message: error?.message || "Failed to update worker profile.",
      },
      { status: 500 }
    );
  }
}
