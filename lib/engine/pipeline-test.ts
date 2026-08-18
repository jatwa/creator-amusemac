import { db } from "@/lib/db/repository";
import { UpdateManager } from "@/lib/engine/update-manager";
import { detectToolChanges } from "@/lib/engine/change-detector";

export function testLivePipeline(): {
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
  step5: boolean;
  step6: boolean;
  step7: boolean;
  allPassed: boolean;
  details: string[];
} {
  const details: string[] = [];
  const tool = db.getToolById("tool-runway");
  if (!tool) {
    throw new Error("tool-runway not found in repository");
  }

  const initialTagline = tool.tagline;
  details.push(`[1. INITIAL STATE] Runway Tagline: "${initialTagline}" | VerifiedAt: ${tool.verifiedAt}`);

  // Step 1: Simulate Ingestion Signal from official source
  const simulatedSignal = {
    toolId: "tool-runway",
    sourceUrl: "https://runwayml.com",
    sourceType: "official_site" as const,
    httpStatus: 200,
    scrapedTagline: "Next-Generation AI Video & World Models for Commercial Filmmaking",
  };
  details.push(`[2. SOURCE INGESTION] Ingested signal for ${tool.name} from ${simulatedSignal.sourceUrl}`);

  // Step 2: Change Detection
  const detectedDiffs = detectToolChanges(tool, simulatedSignal);
  const step2 = detectedDiffs.length > 0 && detectedDiffs[0].fieldPath === "tagline";
  details.push(`[3. CHANGE DETECTION] Diff detected: ${detectedDiffs[0]?.fieldPath} | Risk: ${detectedDiffs[0]?.risk} | Confidence: ${detectedDiffs[0]?.confidenceScore * 100}%`);

  // Step 3: Create Update Event in Repository
  const updateEvent = db.createUpdateEvent({
    ...detectedDiffs[0],
    status: "pending",
  });
  const step3 = Boolean(updateEvent.id);
  details.push(`[4. UPDATE STAGING] Staged UpdateEvent: ${updateEvent.id} (Status: ${updateEvent.status})`);

  // Step 4: Admin Review & Approval
  const approved = db.applyUpdate(updateEvent.id, "Editorial Curator QA");
  const step4 = approved?.status === "applied";
  details.push(`[5. ADMIN APPROVAL] Approved event ${updateEvent.id} -> Status: ${approved?.status}`);

  // Step 5: Verify Live Repository State
  const updatedTool = db.getToolById("tool-runway");
  const step5 = updatedTool?.tagline === simulatedSignal.scrapedTagline;
  details.push(`[6. DATABASE & PUBLIC STATE] Live Tagline is now: "${updatedTool?.tagline}"`);

  // Step 6: Atomic Rollback Test
  const rolledBack = db.rollbackUpdate(updateEvent.id, "Editorial Curator QA");
  const step6 = rolledBack?.status === "rolled_back";
  details.push(`[7. ROLLBACK EXECUTION] Rollback executed -> Status: ${rolledBack?.status}`);

  // Step 7: Verify Restored State
  const restoredTool = db.getToolById("tool-runway");
  const step7 = restoredTool?.tagline === initialTagline;
  details.push(`[8. RESTORATION VERIFICATION] Restored Tagline: "${restoredTool?.tagline}" (Matches Initial: ${step7})`);

  const allPassed = step2 && step3 && step4 && step5 && step6 && step7;
  return {
    step1: true,
    step2,
    step3,
    step4,
    step5,
    step6,
    step7,
    allPassed,
    details,
  };
}
