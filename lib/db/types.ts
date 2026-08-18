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
export type UpdateRisk = "low" | "medium" | "high";

export interface UpdateEvent {
  id: string;
  entityType: "tool" | "prompt" | "tutorial" | "workflow" | "comparison" | "blog" | "video";
  entityId: string;
  entityName: string;
  fieldPath: string; // e.g. "pricing.startingPrice", "supportedModels", "keyFeatures", "tagline", "status"
  previousValue: any;
  newValue: any;
  changeSummary: string;
  sourceId?: string;
  sourceUrl: string;
  sourceType?: SourceType;
  detectedAt: string;
  confidenceScore: number; // 0.0 to 1.0
  risk: UpdateRisk;
  status: UpdateStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  rollbackValue?: any;
}

export interface IngestionSignal {
  id: string;
  sourceId: string;
  entityType: "tool" | "prompt" | "tutorial" | "workflow" | "comparison" | "blog" | "video";
  entityId: string;
  entityName: string;
  field: string;
  oldValue: any;
  newValue: any;
  sourceUrl: string;
  sourceType: SourceType;
  confidence: number;
  risk: UpdateRisk;
  status: UpdateStatus;
  detectedAt: string;
}

export interface VerificationLog {
  id: string;
  entityId: string;
  entityType: string;
  sourceId?: string;
  verifiedAt: string;
  verifiedBy: string;
  notes: string;
  sourceUrls: string[];
  responseCode?: number;
  responseTimeMs?: number;
}

export interface SyncMetrics {
  lastSuccessfulSync: string;
  lastFailedSync: string | null;
  pendingUpdatesCount: number;
  approvedUpdatesCount: number;
  rejectedUpdatesCount: number;
  staleRecordsCount: number;
  totalSourcesCount: number;
  databaseProvider: "PostgreSQL" | "In-Memory Repository (Fallback)";
  isConnected: boolean;
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
