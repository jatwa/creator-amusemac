import { ExecutionMode } from "./creator-intelligence-plans";
import { SubscriptionTier } from "@/lib/db/subscription-repo";

export interface StagedSourcePayload {
  id: string;
  sourceName: string;
  sourceType: "file_upload" | "direct_text" | "sample_scenario";
  fileName?: string;
  fileExtension: string;
  sizeBytes: number;
  rawText: string | null;
  characterCount: number | null;
  wordCount: number | null;
  pageCount: number | null;
  textAvailable: boolean;
  extractionStatus: "ready" | "pending" | "unsupported";
  userTier: SubscriptionTier;
  selectedModules: string[];
  executionMode: ExecutionMode;
  stagedAt: string;
}

export const STAGED_INTAKE_STORAGE_KEY = "ci_staged_intake";

export function saveStagedIntake(payload: StagedSourcePayload): boolean {
  if (typeof window === "undefined") return false;
  try {
    sessionStorage.setItem(STAGED_INTAKE_STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.error("Failed to save staged intake to sessionStorage:", err);
    return false;
  }
}

export function loadStagedIntake(): StagedSourcePayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STAGED_INTAKE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StagedSourcePayload;
  } catch (err) {
    console.error("Failed to parse staged intake from sessionStorage:", err);
    return null;
  }
}

export function clearStagedIntake(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STAGED_INTAKE_STORAGE_KEY);
  } catch {
    // ignore cleanup errors
  }
}

export const SAMPLE_CINEMATIC_SCENARIOS = [
  {
    id: "sample_neo_tokyo",
    title: "Neo-Tokyo High Speed Pursuit",
    extension: ".md",
    filename: "neo_tokyo_pursuit_treatment.md",
    rawText: `# NEO-TOKYO NIGHT PURSUIT
**Logline:** An undercover cybernetic detective races across an elevated neon expressway in 2088 Shinjuku to intercept an autonomous smuggler drone before it breaches the orbital spaceport.

## SCENE 1 - EXT. ELEVATED EXPRESSWAY - NIGHT (RAIN)
Rain sluices down the asphalt in thick iridescent sheets, reflecting towering holographic monoliths.
A tuned 1980s-inspired electric interceptor idles at 140 KPH, its twin rear diffusers glowing cyan.

**DETECTIVE REN (V.O.)**
"The city only tells the truth at 7,000 RPM."

The interceptor initiates a high-angle drift through the S-curve over Shibuya Sector 4.
Camera: Low-angle Russian Arm tracking 2 inches above wet pavement, 35mm Anamorphic T1.4, 180-degree shutter.`,
  },
  {
    id: "sample_dust_bowl",
    title: "1930s Dust Bowl Drama",
    extension: ".txt",
    filename: "dust_bowl_act1_screenplay.txt",
    rawText: `THE DRY HARVEST
Written for 35mm Cinema

EXT. WHEAT FIELD - DUST STORM - DAY

A suffocating amber wall of topsoil billows 2,000 feet into the Oklahoma sky.
CLARA (40s, hardened pioneer) stands on the wooden porch of a decaying farmhouse.
She grips the porch railing as 60 MPH winds tear through the dry corn husks.

CLARA
(screaming over wind)
"Thomas! Get the cattle into the cellar!"

The camera slowly tracks in from a 50mm spherical prime, shallow depth of field, natural harsh directional sunlight diffused through atmospheric dust particles.`,
  },
];
