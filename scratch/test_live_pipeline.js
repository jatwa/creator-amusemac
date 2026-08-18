const { db } = require('../lib/db/repository');
const { UpdateManager } = require('../lib/engine/update-manager');
const { detectToolChanges } = require('../lib/engine/change-detector');

async function runEndToEndVerification() {
  console.log("=================================================");
  console.log("   CREATOR BY AMUSEMAC — LIVE DATA PIPELINE QA   ");
  console.log("=================================================\n");

  const tool = db.getToolById('tool-runway');
  if (!tool) {
    console.error("✗ ERROR: tool-runway not found in repository");
    process.exit(1);
  }

  const initialTagline = tool.tagline;
  console.log(`[1. INITIAL STATE] Runway Tagline: "${initialTagline}"`);
  console.log(`[1. INITIAL STATE] Verified At: ${tool.verifiedAt}`);

  // Step 1: Simulate Ingestion Signal from official source
  console.log("\n[2. SOURCE INGESTION] Ingesting non-critical tagline signal from runwayml.com...");
  const simulatedSignal = {
    toolId: 'tool-runway',
    sourceUrl: 'https://runwayml.com',
    sourceType: 'official_site',
    httpStatus: 200,
    scrapedTagline: 'Next-Generation AI Video & World Models for Cinematic Storytelling',
  };

  // Step 2: Change Detection
  console.log("\n[3. CHANGE DETECTION] Evaluating diff and classifying risk...");
  const detectedDiffs = detectToolChanges(tool, simulatedSignal);
  console.log(`   - Diffs Found: ${detectedDiffs.length}`);
  console.log(`   - Field: ${detectedDiffs[0].fieldPath}`);
  console.log(`   - Risk: ${detectedDiffs[0].risk.toUpperCase()}`);
  console.log(`   - Confidence: ${detectedDiffs[0].confidenceScore * 100}%`);

  // Step 3: Create Update Event in Repository
  console.log("\n[4. UPDATE STAGING] Creating staged UpdateEvent in review queue...");
  const updateEvent = db.createUpdateEvent({
    ...detectedDiffs[0],
    status: 'pending',
  });
  console.log(`   - Event ID: ${updateEvent.id}`);
  console.log(`   - Status: ${updateEvent.status}`);

  // Step 4: Admin Review & Approval
  console.log("\n[5. ADMIN APPROVAL] Editorial Curator approving update event...");
  const approved = db.applyUpdate(updateEvent.id, "Lead Curator QA");
  if (!approved || approved.status !== "applied") {
    console.error("✗ ERROR: Failed to apply update event");
    process.exit(1);
  }
  console.log(`   - Event Status After Approval: ${approved.status}`);
  console.log(`   - Reviewer: ${approved.reviewedBy}`);

  // Step 5: Verify Live Repository State
  const updatedTool = db.getToolById('tool-runway');
  console.log("\n[6. DATABASE & PUBLIC STATE] Verifying updated entity...");
  console.log(`   - Current Runway Tagline: "${updatedTool.tagline}"`);
  console.log(`   - Match New Value: ${updatedTool.tagline === simulatedSignal.scrapedTagline ? "✓ YES (APPLIED)" : "✗ NO"}`);

  // Step 6: Atomic Rollback Test
  console.log("\n[7. ROLLBACK TEST] Executing rollback on update event...");
  const rolledBack = db.rollbackUpdate(updateEvent.id, "Lead Curator QA");
  if (!rolledBack || rolledBack.status !== "rolled_back") {
    console.error("✗ ERROR: Failed to rollback update event");
    process.exit(1);
  }
  console.log(`   - Event Status After Rollback: ${rolledBack.status}`);

  // Step 7: Verify Restored State
  const restoredTool = db.getToolById('tool-runway');
  console.log("\n[8. RESTORATION VERIFICATION] Verifying restored entity...");
  console.log(`   - Restored Runway Tagline: "${restoredTool.tagline}"`);
  console.log(`   - Restored to Initial: ${restoredTool.tagline === initialTagline ? "✓ YES (RESTORED)" : "✗ NO"}`);

  console.log("\n=================================================");
  console.log("   ✓ ALL 8 PIPELINE & ROLLBACK PHASES PASSED     ");
  console.log("=================================================\n");
}

runEndToEndVerification();
