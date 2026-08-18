import {
  Tool,
  Prompt,
  ToolComparison,
  Workflow,
  Tutorial,
  CategoryInfo,
  ResourceItem,
  BlogPost,
  VideoItem,
} from "@/data/types";

export type SourceType =
  | "official_site"
  | "pricing_page"
  | "changelog"
  | "api_docs"
  | "social_announcement"
  | "video_channel"
  | "editorial_blog"
  | "manual_audit";

export interface SourceRecord {
  id: string;
  url: string;
  sourceType: SourceType;
  publisher: string;
  entityType: "tool" | "prompt" | "tutorial" | "workflow" | "comparison" | "blog" | "video";
  entityId: string;
  lastFetchedAt: string;
  lastVerifiedAt: string;
  reliabilityScore: number; // 0.0 to 1.0 (1.0 = official primary domain)
  httpStatus?: number;
  etagOrHash?: string;
  metadata?: Record<string, unknown>;
}

export type UpdateStatus = "pending" | "approved" | "rejected" | "applied" | "rolled_back";

export interface UpdateEvent {
  id: string;
  entityType: "tool" | "prompt" | "tutorial" | "workflow" | "comparison" | "blog" | "video";
  entityId: string;
  entityName: string;
  fieldPath: string; // e.g. "pricing.startingPrice", "supportedModels", "keyFeatures", "status"
  previousValue: string | number | boolean | string[] | Record<string, unknown>;
  newValue: string | number | boolean | string[] | Record<string, unknown>;
  changeSummary: string;
  sourceId?: string;
  sourceUrl: string;
  detectedAt: string;
  confidenceScore: number; // 0.0 to 1.0
  status: UpdateStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  rollbackValue?: string | number | boolean | string[] | Record<string, unknown>;
}

export interface VerificationLog {
  id: string;
  entityId: string;
  entityType: string;
  verifiedAt: string;
  verifiedBy: string;
  notes: string;
  sourceUrls: string[];
}

export interface PlatformDatabaseSchema {
  tools: Tool[];
  sources: SourceRecord[];
  updates: UpdateEvent[];
  verificationLogs: VerificationLog[];
  prompts: Prompt[];
  comparisons: ToolComparison[];
  workflows: Workflow[];
  tutorials: Tutorial[];
  categories: CategoryInfo[];
  resources: ResourceItem[];
  blogs: BlogPost[];
  videos: VideoItem[];
}
