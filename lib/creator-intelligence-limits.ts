import { SubscriptionTier } from "@/lib/db/subscription-repo";

export interface PlanLimits {
  tier: SubscriptionTier;
  label: string;
  maxFileSizeBytes: number;
  maxFileSizeFormatted: string;
  maxCharacters: number;
  maxCharactersFormatted: string;
  maxPages: number;
  maxPagesFormatted: string;
  supportedFormats: string[];
}

export const CREATOR_INTELLIGENCE_PLAN_LIMITS: Record<SubscriptionTier, PlanLimits> = {
  free: {
    tier: "free",
    label: "Free Discovery",
    maxFileSizeBytes: 5 * 1024 * 1024, // 5 MB
    maxFileSizeFormatted: "5 MB",
    maxCharacters: 15_000,
    maxCharactersFormatted: "15K chars",
    maxPages: 30,
    maxPagesFormatted: "30 pages",
    supportedFormats: [".txt", ".md", ".pdf", ".docx"],
  },
  basic: {
    tier: "basic",
    label: "Director Basic",
    maxFileSizeBytes: 25 * 1024 * 1024, // 25 MB
    maxFileSizeFormatted: "25 MB",
    maxCharacters: 100_000,
    maxCharactersFormatted: "100K chars",
    maxPages: 150,
    maxPagesFormatted: "150 pages",
    supportedFormats: [".txt", ".md", ".pdf", ".docx"],
  },
  pro: {
    tier: "pro",
    label: "Studio Pro",
    maxFileSizeBytes: 100 * 1024 * 1024, // 100 MB
    maxFileSizeFormatted: "100 MB",
    maxCharacters: 500_000,
    maxCharactersFormatted: "500K chars",
    maxPages: 500,
    maxPagesFormatted: "500 pages",
    supportedFormats: [".txt", ".md", ".pdf", ".docx"],
  },
};

export function getPlanLimits(tier?: string | null): PlanLimits {
  if (tier === "pro") return CREATOR_INTELLIGENCE_PLAN_LIMITS.pro;
  if (tier === "basic") return CREATOR_INTELLIGENCE_PLAN_LIMITS.basic;
  return CREATOR_INTELLIGENCE_PLAN_LIMITS.free;
}

export function isLocalTextExtractable(extension: string): boolean {
  const ext = extension.toLowerCase().replace(/^\./, "");
  return ext === "txt" || ext === "md";
}

export function isExtractionPending(extension: string): boolean {
  const ext = extension.toLowerCase().replace(/^\./, "");
  return ext === "pdf" || ext === "docx";
}

export function estimateWordCount(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function estimateTokens(textOrChars: string | number): number {
  const chars = typeof textOrChars === "string" ? textOrChars.length : textOrChars;
  if (chars <= 0) return 0;
  return Math.ceil(chars / 4);
}

export interface SourceValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateSourcePayload(
  fileSize: number,
  characterCount: number | null,
  extension: string,
  tier: SubscriptionTier = "free"
): SourceValidationResult {
  const limits = getPlanLimits(tier);
  const errors: string[] = [];
  const warnings: string[] = [];

  const cleanExt = ("." + extension.toLowerCase().replace(/^\./, "")).trim();
  if (!limits.supportedFormats.includes(cleanExt)) {
    errors.push(`Unsupported file format "${cleanExt}". Creator Intel supports .txt, .md, .pdf, and .docx.`);
  }

  if (fileSize > limits.maxFileSizeBytes) {
    errors.push(
      `File size (${(fileSize / (1024 * 1024)).toFixed(1)} MB) exceeds your ${limits.label} limit (${limits.maxFileSizeFormatted}). Upgrade to increase capacity.`
    );
  }

  if (characterCount !== null && characterCount > limits.maxCharacters) {
    errors.push(
      `Character count (${characterCount.toLocaleString()}) exceeds your ${limits.label} limit (${limits.maxCharactersFormatted}).`
    );
  }

  if (isExtractionPending(cleanExt)) {
    warnings.push(
      `Document text extraction for ${cleanExt.toUpperCase()} is queued. Raw file will be staged safely.`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
