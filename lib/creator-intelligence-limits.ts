import { CREATOR_INTELLIGENCE_PLANS } from "@/lib/creator-intelligence-plans";

export const CREATOR_INTELLIGENCE_LIMITS = {
  ...CREATOR_INTELLIGENCE_PLANS.free,
  allowedExtensions: [".pdf", ".docx", ".txt", ".md"] as const,
} as const;

export type CreatorIntelligenceFileExtension =
  (typeof CREATOR_INTELLIGENCE_LIMITS.allowedExtensions)[number];

export function getFileExtension(name: string): string {
  const match = /\.[^.]+$/.exec(name.trim().toLowerCase());
  return match?.[0] ?? "";
}

export function isAllowedCreatorIntelligenceFile(name: string): boolean {
  return CREATOR_INTELLIGENCE_LIMITS.allowedExtensions.includes(
    getFileExtension(name) as CreatorIntelligenceFileExtension
  );
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
