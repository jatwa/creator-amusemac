import { CategoryType, ToolType, PricingModel } from "@/data/types";

export type ContentStatus = "draft" | "review" | "published" | "archived";

export interface IngestionValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  recordId?: string;
  recordSlug?: string;
  entityType: string;
}

export interface IngestionBatchResult {
  totalProcessed: number;
  totalValid: number;
  totalInvalid: number;
  results: IngestionValidationResult[];
  importedAt: string;
}

export interface BaseContentMetadata {
  id: string;
  slug: string;
  title: string;
  status: ContentStatus;
  category: string;
  tags?: string[];
  author?: {
    name: string;
    role?: string;
    avatarUrl?: string;
  } | string;
  createdAt?: string;
  updatedAt?: string;
  verifiedAt?: string;
  relatedContent?: {
    toolIds?: string[];
    promptIds?: string[];
    storyIds?: string[];
    workflowIds?: string[];
    tutorialIds?: string[];
    videoIds?: string[];
    blogIds?: string[];
  };
}
