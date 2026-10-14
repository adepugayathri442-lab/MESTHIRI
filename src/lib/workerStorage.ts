import fs from "fs/promises";
import path from "path";
import { RegisteredWorkerProfile, FlooringCategory, VerificationStatus } from "@/types";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "registered_workers.json");

// Read all registered workers from JSON storage
export async function getRegisteredWorkers(): Promise<RegisteredWorkerProfile[]> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // Initialize file with empty array if not found
      await fs.writeFile(DATA_FILE_PATH, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    console.error("Error reading registered workers:", error);
    return [];
  }
}

// Add a newly registered worker
export async function addRegisteredWorker(
  newWorker: Omit<RegisteredWorkerProfile, "id" | "registeredAt" | "source"> & {
    verificationStatus?: VerificationStatus;
  }
): Promise<RegisteredWorkerProfile> {
  const workers = await getRegisteredWorkers();

  const initialStatus: VerificationStatus =
    newWorker.verificationStatus ||
    (newWorker.labourDocument ? "Pending Verification" : "Draft");

  const workerRecord: RegisteredWorkerProfile = {
    ...newWorker,
    id: `reg-worker-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    registeredAt: new Date().toISOString(),
    verificationStatus: initialStatus,
    verificationBadges: initialStatus === "Verified" ? ["Verified Worker"] : [],
    source: "Registered on MESTHIRI",
  };

  const updated = [workerRecord, ...workers];
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(updated, null, 2), "utf-8");
  return workerRecord;
}

// Update worker profile or verification state
export async function updateRegisteredWorker(
  id: string,
  updates: Partial<RegisteredWorkerProfile>
): Promise<RegisteredWorkerProfile | null> {
  const workers = await getRegisteredWorkers();
  const index = workers.findIndex((w) => w.id === id);
  if (index === -1) return null;

  const current = workers[index];
  const updatedRecord: RegisteredWorkerProfile = {
    ...current,
    ...updates,
    id: current.id, // Immutable ID
    registeredAt: current.registeredAt,
  };

  workers[index] = updatedRecord;
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(workers, null, 2), "utf-8");
  return updatedRecord;
}
