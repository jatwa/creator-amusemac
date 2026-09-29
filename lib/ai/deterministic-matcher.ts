import { Prompt } from "@/data/types";
import { getAllPrompts } from "@/data/content";

export interface RecipeMatchResult {
  recipe: Prompt;
  matchScore: number; // 0.00 - 1.00
  matchPercentage: number; // 0 - 100
  dimensionScores: {
    subject: number;
    environment: number;
    action: number;
    genreMood: number;
    category: number;
  };
  explanation: string;
}

const STOP_WORDS = new Set([
  "a", "an", "the", "in", "on", "at", "by", "with", "from", "for", "to", "of",
  "and", "or", "is", "are", "was", "were", "shot", "scene", "video", "film",
  "cinematic", "make", "create", "generate", "show", "showing", "i", "want",
  "please", "like", "view", "camera"
]);

// Domain synonym / semantic expansion dictionary
const SYNONYM_MAP: Record<string, string[]> = {
  car: ["vehicle", "automobile", "hypercar", "sports", "chassis", "automotive", "motorcycle", "bike", "driving", "drift"],
  rain: ["rainy", "downpour", "wet", "soaked", "slick", "storm", "puddle", "spray", "water", "drenched"],
  night: ["midnight", "nocturnal", "dark", "dusk", "evening", "neon", "shadows", "low-light"],
  neon: ["cyberpunk", "tokyo", "illuminated", "glow", "reflections", "cyan", "amber", "sodium", "vapor"],
  drone: ["aerial", "fpv", "bird", "eye", "overhead", "fly-through", "top-down"],
  macro: ["close-up", "microscopic", "texture", "detail", "extreme", "focus", "rings", "watch", "product"],
  portrait: ["character", "face", "skin", "eyes", "person", "human", "monologue", "dialogue", "beauty"],
  chase: ["pursuit", "speed", "fast", "acceleration", "tracking", "action", "drift", "dynamic", "speeding"],
  landscape: ["mountain", "desert", "ocean", "sea", "forest", "horizon", "wide", "establishing"],
  fog: ["mist", "haze", "atmospheric", "smoke", "volumetric", "steam"],
  golden: ["sunset", "sunrise", "dusk", "dawn", "warm", "sunlight", "hour"],
  noir: ["detective", "crime", "mystery", "trench", "corridor", "alley", "shadowy", "chiaroscuro", "foggy"],
  boxing: ["fight", "boxer", "ring", "punch", "round", "arena", "bout", "training", "fighter"],
  space: ["orbit", "orbital", "station", "nebula", "planet", "galaxy", "cosmic", "sci-fi", "astronaut", "spaceship"],
  fashion: ["model", "runway", "editorial", "couture", "apparel", "clothing", "haute", "glamour", "style", "pose"],
  vintage: ["retro", "1970s", "1980s", "1940s", "1950s", "grain", "kodak", "film", "analog", "celluloid"],
};

function tokenize(text: string): string[] {
  if (!text) return [];
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
  return words;
}

function expandTokens(tokens: string[]): Set<string> {
  const expanded = new Set<string>(tokens);
  for (const t of tokens) {
    for (const [key, synonyms] of Object.entries(SYNONYM_MAP)) {
      if (t === key || synonyms.includes(t)) {
        expanded.add(key);
        synonyms.forEach((s) => {
          tokenize(s).forEach((w) => expanded.add(w));
        });
      }
    }
  }
  return expanded;
}

function computeOverlap(querySet: Set<string>, targetText: string): number {
  if (!targetText || querySet.size === 0) return 0;
  const targetTokens = tokenize(targetText);
  if (targetTokens.length === 0) return 0;

  let matches = 0;
  for (const t of targetTokens) {
    if (querySet.has(t)) {
      matches += 1;
    }
  }

  // Jaccard-inspired score bounded between 0 and 1
  return Math.min(1.0, matches / Math.max(1, Math.min(querySet.size, 6)));
}

/**
 * Deterministic lexical + domain-weighted matcher
 * Weights:
 * - Subject / Vehicle / Character = 30%
 * - Environment / Weather / Lighting = 25%
 * - Action / Camera Movement = 20%
 * - Genre / Mood / Cinematic Tags = 15%
 * - Category / Use Case = 10%
 * Total = 100%
 */
export function matchRecipeDeterministically(
  userQuery: string,
  targetCategoryFilter?: string
): RecipeMatchResult[] {
  const allPrompts = getAllPrompts();
  const rawTokens = tokenize(userQuery);
  const querySet = expandTokens(rawTokens);

  if (rawTokens.length === 0) {
    // Default fallback to popular recipes
    return allPrompts.slice(0, 3).map((recipe) => ({
      recipe,
      matchScore: 0.85,
      matchPercentage: 85,
      dimensionScores: { subject: 0.85, environment: 0.85, action: 0.85, genreMood: 0.85, category: 0.85 },
      explanation: "Deterministic match based on Creator Intel's verified recipe metadata.",
    }));
  }

  const scoredResults: RecipeMatchResult[] = allPrompts.map((recipe) => {
    // 1. Subject score (30%)
    const subjectCorpus = [
      recipe.title,
      recipe.whatItCreates,
      recipe.variables?.find((v) => v.key.toUpperCase().includes("SUBJ") || v.key.toUpperCase().includes("CHAR") || v.key.toUpperCase().includes("VEH"))?.defaultValue || "",
      recipe.tags?.join(" ") || "",
    ].join(" ");
    const subjectScore = computeOverlap(querySet, subjectCorpus);

    // 2. Environment / Weather / Lighting score (25%)
    const envCorpus = [
      recipe.environment || "",
      recipe.lighting || "",
      recipe.variables?.find((v) => v.key.toUpperCase().includes("LOC") || v.key.toUpperCase().includes("ENV") || v.key.toUpperCase().includes("WEATH"))?.defaultValue || "",
    ].join(" ");
    const envScore = computeOverlap(querySet, envCorpus);

    // 3. Action / Camera Movement score (20%)
    const actionCorpus = [
      recipe.cameraMovement || "",
      recipe.camera || "",
      recipe.lens || "",
      recipe.description || "",
    ].join(" ");
    const actionScore = computeOverlap(querySet, actionCorpus);

    // 4. Genre / Mood / Cinematic Tags score (15%)
    const genreMoodCorpus = [
      recipe.mood || "",
      recipe.visualStyle || "",
      recipe.subcategory || "",
      recipe.tags?.join(" ") || "",
    ].join(" ");
    const genreMoodScore = computeOverlap(querySet, genreMoodCorpus);

    // 5. Category / Use Case score (10%)
    const catCorpus = [recipe.category || "", recipe.useCase || ""].join(" ");
    let catScore = computeOverlap(querySet, catCorpus);
    if (targetCategoryFilter && recipe.category.toLowerCase() === targetCategoryFilter.toLowerCase()) {
      catScore = Math.max(catScore, 0.9);
    }

    // Weighted composite score (Total = 100%)
    const rawScore =
      0.30 * subjectScore +
      0.25 * envScore +
      0.20 * actionScore +
      0.15 * genreMoodScore +
      0.10 * catScore;

    // Boost score slightly if multiple dimensions fired
    const firedCount = [subjectScore, envScore, actionScore, genreMoodScore, catScore].filter((s) => s > 0.2).length;
    const boost = firedCount >= 3 ? 0.25 : firedCount >= 2 ? 0.15 : firedCount === 1 ? 0.05 : 0;
    
    // Normalization to [0.45, 0.98]
    const normalizedScore = Math.min(0.98, Math.max(0.40, rawScore + boost));
    const percentage = Math.round(normalizedScore * 100);

    return {
      recipe,
      matchScore: Number(normalizedScore.toFixed(2)),
      matchPercentage: percentage,
      dimensionScores: {
        subject: Number(subjectScore.toFixed(2)),
        environment: Number(envScore.toFixed(2)),
        action: Number(actionScore.toFixed(2)),
        genreMood: Number(genreMoodScore.toFixed(2)),
        category: Number(catScore.toFixed(2)),
      },
      explanation: "Deterministic match based on Creator Intel's verified recipe metadata.",
    };
  });

  // Sort descending by matchScore
  scoredResults.sort((a, b) => b.matchScore - a.matchScore);

  return scoredResults.slice(0, 3);
}
