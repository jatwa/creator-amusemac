import {
  SourceTier,
  VerificationStatus,
  FestivalPrestigeTier,
  FestivalRegion,
  PremiereType,
  PersonRole,
  FilmFormat,
  ProjectWorkflowStage
} from "@/data/types";

export type UniversalEntityType =
  | "tool"
  | "prompt"
  | "tutorial"
  | "workflow"
  | "comparison"
  | "blog"
  | "video"
  | "journal_article"
  | "research_record"
  | "festival"
  | "festival_edition"
  | "film"
  | "person"
  | "film_project";

export interface UniversalSearchIndexEntry {
  id: string;
  entityType: UniversalEntityType;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  tags: string[];
  searchTokens: string[];
  snippet: string;
  weight: number;
  
  // Intelligence Metadata
  verificationStatus?: VerificationStatus;
  sourceTier?: SourceTier;
  prestigeTier?: FestivalPrestigeTier;
  region?: FestivalRegion;
  premiereType?: PremiereType;
  personRole?: PersonRole;
  filmFormat?: FilmFormat;
  workflowStage?: ProjectWorkflowStage;
  
  // Relational connections
  relatedEntityIds?: string[];
  lastVerifiedAt?: string;
}

export interface UniversalSearchQuery {
  query: string;
  entityTypes?: UniversalEntityType[];
  categories?: string[];
  regions?: FestivalRegion[];
  prestigeTiers?: FestivalPrestigeTier[];
  premiereTypes?: PremiereType[];
  roles?: PersonRole[];
  formats?: FilmFormat[];
  verificationStatuses?: VerificationStatus[];
  limit?: number;
  offset?: number;
}

export interface UniversalSearchResult {
  entry: UniversalSearchIndexEntry;
  matchScore: number;
  highlightSnippets: string[];
}
