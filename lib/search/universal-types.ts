import {
  DataVisibility,
  SourceTier,
  VerificationStatus,
  FestivalPrestigeTier,
  FestivalRegion,
  PremiereType,
  PersonRole,
  FilmFormat,
  ProjectWorkflowStage
} from "@/data/types";

/**
 * Public Searchable Entity Types.
 * Private user artifacts (e.g. scripts, private research, submissions, budgets)
 * are NEVER indexed into the public search catalog.
 */
export type PublicSearchableEntityType =
  | "tool"
  | "prompt"
  | "tutorial"
  | "workflow"
  | "comparison"
  | "blog"
  | "video"
  | "journal_article"
  | "public_research"
  | "festival"
  | "festival_edition"
  | "film"
  | "person";

export interface UniversalSearchIndexEntry {
  id: string;
  entityType: PublicSearchableEntityType;
  visibility: "PUBLIC"; // Enforced: strictly public only
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
  
  // Relational references
  relatedEntityIds?: string[];
  lastVerifiedAt?: string;
}

export interface UniversalSearchQuery {
  query: string;
  entityTypes?: PublicSearchableEntityType[];
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
