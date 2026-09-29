import { Prompt, DirectorShotConfig } from "@/data/types";

export interface ExtractedSlots {
  subject?: string;
  action?: string;
  environment?: string;
  weather?: string;
  lighting?: string;
  timeOfDay?: string;
  cameraRig?: string;
  lens?: string;
  mood?: string;
  visualStyle?: string;
  aspectRatio?: string;
  fps?: string;
  duration?: string;
}

const WEATHER_PATTERNS = [
  { match: /heavy rain|downpour|torrential/i, val: "Heavy Rain" },
  { match: /rain|rainy|raining/i, val: "Rain-Soaked Wet Surfaces" },
  { match: /fog|foggy|mist|misty/i, val: "Misty Fog" },
  { match: /haze|dust haze/i, val: "Golden Dust Haze" },
  { match: /snow|snowing|blizzard/i, val: "Snow Flurry" },
  { match: /clear|sunny/i, val: "Clear Atmosphere" },
];

const TIME_PATTERNS = [
  { match: /night|midnight|dark/i, val: "Night" },
  { match: /golden hour|sunset|sundown/i, val: "Golden Hour / Dusk" },
  { match: /blue hour|twilight/i, val: "Blue Hour" },
  { match: /dawn|sunrise|morning/i, val: "Dawn" },
  { match: /midday|noon/i, val: "Overcast Midday" },
];

const LIGHTING_PATTERNS = [
  { match: /neon|cyan and amber|sodium/i, val: "Neon Reflections with Cyan & Amber Accents" },
  { match: /golden|warm sun|amber/i, val: "Soft Warm Golden Hour Key with Skylight Fill" },
  { match: /headlight|car light/i, val: "Cold Blue Night with Headlight Backlight" },
  { match: /chiaroscuro|high contrast/i, val: "High-Contrast Motivated Chiaroscuro" },
  { match: /studio|softbox|rim/i, val: "Diffused Overhead Softbox with Rim Lights" },
];

const RIG_PATTERNS = [
  { match: /russian arm|arm/i, val: "Russian Arm" },
  { match: /drone|aerial|fpv/i, val: "FPV Drone Dive" },
  { match: /steadicam|tracking/i, val: "Steadicam Single-Take" },
  { match: /dolly|push-in|push in/i, val: "Low Dolly" },
  { match: /handheld|shaky/i, val: "Handheld" },
  { match: /crane|technocrane/i, val: "Technocrane Orbit" },
  { match: /static|tripod|lock/i, val: "Static Tripod Lock-off" },
];

const LENS_PATTERNS = [
  { match: /anamorphic|cooke|2\.39/i, val: "Cooke Anamorphic 2.39:1" },
  { match: /macro|close-up|micro/i, val: "100mm Macro" },
  { match: /portrait|85mm/i, val: "85mm Portrait" },
  { match: /wide|24mm/i, val: "24mm Ultra-Wide" },
  { match: /35mm/i, val: "35mm Prime" },
  { match: /50mm/i, val: "50mm Standard" },
];

/**
 * Extracts slot values from user text, falling back to matched canonical recipe defaults.
 */
export function extractSlotsAndBuildConfig(
  userText: string,
  matchedRecipe: Prompt
): {
  slots: ExtractedSlots;
  shotConfig: DirectorShotConfig;
} {
  const cleanInput = userText.trim();
  const slots: ExtractedSlots = {};

  // 1. Weather detection
  for (const p of WEATHER_PATTERNS) {
    if (p.match.test(cleanInput)) {
      slots.weather = p.val;
      break;
    }
  }

  // 2. Time detection
  for (const p of TIME_PATTERNS) {
    if (p.match.test(cleanInput)) {
      slots.timeOfDay = p.val;
      break;
    }
  }

  // 3. Lighting detection
  for (const p of LIGHTING_PATTERNS) {
    if (p.match.test(cleanInput)) {
      slots.lighting = p.val;
      break;
    }
  }

  // 4. Rig detection
  for (const p of RIG_PATTERNS) {
    if (p.match.test(cleanInput)) {
      slots.cameraRig = p.val;
      break;
    }
  }

  // 5. Lens detection
  for (const p of LENS_PATTERNS) {
    if (p.match.test(cleanInput)) {
      slots.lens = p.val;
      break;
    }
  }

  // 6. Subject detection (heuristic from beginning of user prompt if reasonable)
  const words = cleanInput.split(/\s+/);
  if (words.length > 2) {
    const subjectCandidate = cleanInput
      .replace(/^(a|an|the|cinematic shot of|show|create|video of)\s+/i, "")
      .split(/(driving|walking|accelerating|running|standing|sitting|flying|through|in|at|during)\b/i)[0]
      .trim();

    if (subjectCandidate.length > 2 && subjectCandidate.length < 50) {
      slots.subject = subjectCandidate;
    }
  }

  // 7. Action / Movement detection
  const actionMatch = cleanInput.match(/(driving|walking|accelerating|running|standing|sitting|flying|moving|navigating)[^,.]*/i);
  if (actionMatch) {
    slots.action = actionMatch[0].trim();
  }

  // Build unified DirectorShotConfig based on verified recipe defaults + extracted overrides
  const shotConfig: DirectorShotConfig = {
    shotTitle: `${matchedRecipe.title} (Customized)`,
    shotCategory: (matchedRecipe.category || "video").toUpperCase(),
    subject: slots.subject || matchedRecipe.variables?.find((v) => v.key.toUpperCase().includes("SUBJ") || v.key.toUpperCase().includes("CHAR") || v.key.toUpperCase().includes("VEH"))?.defaultValue || "Hero Subject",
    action: slots.action || matchedRecipe.cameraMovement || "accelerating smoothly through frame",
    cameraRig: slots.cameraRig || matchedRecipe.camera || "Russian Arm",
    cameraMovement: matchedRecipe.cameraMovement || "Low-angle dynamic pursuit tracking",
    lens: slots.lens || matchedRecipe.lens || "Cooke Anamorphic 2.39:1",
    framing: "Low-Angle Hero Tracking",
    composition: matchedRecipe.composition || "Layered Depth Planes with foreground reflections",
    lighting: slots.lighting || matchedRecipe.lighting || "Cold Blue Night with Headlight Backlight",
    environment: slots.environment || matchedRecipe.environment || "Rain-Drenched Urban Road",
    weather: slots.weather || "Heavy Rain",
    timeOfDay: slots.timeOfDay || "Night",
    aspectRatio: matchedRecipe.aspectRatio || "2.39:1 (Cinemascope)",
    fps: "24fps (Standard Cinematic)",
    duration: matchedRecipe.recommendedDuration || "5 Seconds (Standard AI Take)",
    visualStyle: matchedRecipe.visualStyle || "Premium Commercial Cinematography",
    mood: matchedRecipe.mood || "High-Energy Action",
  };

  return { slots, shotConfig };
}
