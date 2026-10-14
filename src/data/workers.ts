import { Worker } from "@/types";

/**
 * Public Worker Directory Initial State
 * 
 * In accordance with MESTHIRI verification and data integrity rules:
 * - Fictional worker profiles, fake ratings, fabricated reviews, and fake job counts have been removed.
 * - The public directory initially starts empty until genuine workers register and pass review.
 * - Only verified registered profiles with explicit publication consent appear in the directory.
 */
export const SAMPLE_WORKERS: Worker[] = [];
