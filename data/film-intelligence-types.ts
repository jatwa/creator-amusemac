/**
 * CREATOR INTEL — CINEMATIC INTELLIGENCE DATA ARCHITECTURE (PHASE 2.1)
 * ARCHITECTURE AUDIT & DATA INTEGRITY HARDENING
 *
 * Core Subsystems:
 * 1. Research Record, Source Hierarchy & Conflict Tracking
 * 2. Journal & Cinema CMS Model with Provenance
 * 3. Standing Film Festival & Festival Edition Separation
 * 4. Festival Requirement Hierarchy & Specific Delivery Specifications
 * 5. Master Preparation Checklist vs Festival-Specific Requirements
 * 6. Premiere Rules & Disqualification Risk Engine
 * 7. Canonical Film & People Databases with Deduplication
 * 8. User Film Project Workflow & Private Data Isolation
 * 9. Explainable (Non-Fabricated) Festival Matching Engine
 * 10. Universal Search & Data Privacy Architecture
 */

// ============================================================================
// 1. DATA VISIBILITY & OWNERSHIP
// ============================================================================

export type DataVisibility = "PUBLIC" | "PRIVATE";

export type ContentProvenance =
  | "HUMAN_AUTHORED"
  | "AI_ASSISTED_HUMAN_VERIFIED"
  | "AI_DRAFT_PENDING_REVIEW"
  | "EXTERNAL_SYNDICATED";

// ============================================================================
// 2. 8-TIER SOURCE HIERARCHY & CONFLICT-AWARE RESEARCH CORE
// ============================================================================

/**
 * 8-Tier Authority Hierarchy for Cinema & Festival Verification:
 * Tier 1: Current Official Festival Regulations & Legal Terms
 * Tier 2: Current Official Festival Submission Portal (e.g. FilmFreeway Official Verified Page)
 * Tier 3: Official Festival FAQ & Official Director's Guidebook
 * Tier 4: Official Press Release & Festival Director / Jury Dispatches
 * Tier 5: Government / Institutional Cultural Agency (BFI, CNC, UniFrance, Telefilm)
 * Tier 6: Established Trade Publication (Variety, The Hollywood Reporter, Screen Daily, IndieWire, AC)
 * Tier 7: Established Industry Database (IMDb Pro, Cineando, Cinando)
 * Tier 8: Community / Social Media / Filmmaker Forums (Subject to verification)
 */
export type SourceTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type SourceTierName =
  | "TIER_1_OFFICIAL_REGULATIONS"
  | "TIER_2_OFFICIAL_SUBMISSION_PORTAL"
  | "TIER_3_OFFICIAL_FAQ"
  | "TIER_4_OFFICIAL_PRESS_ANNOUNCEMENT"
  | "TIER_5_GOVERNMENT_INSTITUTIONAL"
  | "TIER_6_ESTABLISHED_TRADE_PUBLICATION"
  | "TIER_7_INDUSTRY_DATABASE"
  | "TIER_8_COMMUNITY_SOCIAL";

export type SourceCategory =
  | "OFFICIAL_REGULATIONS"
  | "OFFICIAL_PORTAL"
  | "OFFICIAL_FAQ"
  | "PRESS_RELEASE"
  | "INSTITUTIONAL"
  | "TRADE_PUBLICATION"
  | "INDUSTRY_DATABASE"
  | "COMMUNITY_FORUM"
  | "ACADEMIC"
  | "ARCHIVAL";

export type VerificationStatus =
  | "VERIFIED"
  | "PARTIALLY_VERIFIED"
  | "UNVERIFIED"
  | "OUTDATED"
  | "NEEDS_REVIEW";

export type StatementNature =
  | "FACT"
  | "INTERPRETATION"
  | "INFERENCE"
  | "UNVERIFIED";

export interface ResearchSource {
  id: string;
  sourceTitle: string;
  sourceUrl: string;
  sourcePublisher: string;
  sourceCategory: SourceCategory;
  tier: SourceTier;
  tierName: SourceTierName;
  author?: string;
  publishedDate?: string;
  retrievedDate: string;
  lastVerifiedAt: string;
  verificationStatus: VerificationStatus;
  reliabilityScore: number; // 0.00 - 1.00 based on source authority tier & freshness
  archivedSnapshotUrl?: string; // Optional: Never invent archive URLs
  quotedPassage?: string;
  verificationNotes?: string;
}

export interface ResearchStatement {
  id: string;
  statement: string;
  nature: StatementNature;
  verificationStatus: VerificationStatus;
  supportingSourceIds: string[]; // Multiple supporting sources
  conflictingSourceIds: string[]; // Explicit conflicting sources recorded
  counterEvidence?: string;
  directness: "DIRECT_PRIMARY" | "CORROBORATED_SECONDARY" | "ANECDOTAL" | "UNCONFIRMED";
  isAiGenerated: boolean;
  humanVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

export interface SourceVerificationLedgerRecord {
  claim: string;
  nature: StatementNature;
  sourceUrl: string;
  sourceTitle: string;
  sourcePublisher: string;
  sourceTier: SourceTier;
  verifiedAt: string;
  confidence: "HIGH" | "MEDIUM" | "PROVISIONAL";
  verifiedBy?: string;
  supportingSourceUrls?: string[];
  conflictingSourceUrls?: string[];
}

export interface ResearchRecord {
  id: string;
  slug: string;
  topic: string;
  visibility: DataVisibility;
  entityType: "FILM" | "PERSON" | "FESTIVAL" | "FESTIVAL_EDITION" | "TOOL" | "TECHNIQUE" | "PREMIERE_RULE" | "GENERAL";
  entityId?: string;
  researchQuestion: string;
  findingsSummary: string;
  methodology: string;
  statements: ResearchStatement[];
  sources: ResearchSource[];
  confidenceLevel: "HIGH" | "MEDIUM" | "LOW" | "PROVISIONAL";
  verificationStatus: VerificationStatus;
  provenance: ContentProvenance;
  verifiedBy: string;
  verifiedDate: string;
  nextReviewDate: string;
  changeLog?: {
    date: string;
    changedBy: string;
    description: string;
  }[];
}

// ============================================================================
// 3. JOURNAL & CINEMA CMS MODEL
// ============================================================================

export type JournalCategory =
  | "case_studies"
  | "film_breakdown"
  | "festival_dispatches"
  | "industry_research"
  | "technical_deep_dives"
  | "director_interviews";

export type EditorialStatus =
  | "RESEARCH"
  | "DRAFT"
  | "FACT_CHECK"
  | "EDITORIAL_REVIEW"
  | "SCHEDULED"
  | "PUBLISHED"
  | "UPDATED"
  | "ARCHIVED";

export interface JournalArticleAuthor {
  id?: string;
  name: string;
  role: string;
  avatarUrl?: string;
  bio?: string;
  socialUrl?: string;
}

export interface JournalArticleSeo {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  keywords?: string[];
  ogImage?: string;
  structuredDataType?: "Article" | "TechArticle" | "NewsArticle";
}

export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  category: JournalCategory;
  subcategory: string;
  coverImage: string;
  coverImageCaption?: string;
  author: JournalArticleAuthor;
  readingTime: string;
  publicationDate: string;
  updatedDate: string;
  status: EditorialStatus;
  featured: boolean;
  visibility: "PUBLIC";
  provenance: ContentProvenance;
  
  // Relational Ledger & Citations (Research -> Sources -> Article)
  sourceLedger: SourceVerificationLedgerRecord[];
  primaryResearchRecordId?: string;
  
  // Cross-Entity Relational Links
  relatedFilmIds: string[];
  relatedPeopleIds: string[];
  relatedFestivalIds: string[];
  relatedProjectIds: string[];
  relatedTechniqueIds: string[];
  relatedToolIds: string[];
  relatedPromptIds: string[];
  
  // Content & SEO
  contentMarkdown: string;
  seoMetadata: JournalArticleSeo;
}

// ============================================================================
// 4. STANDING FESTIVAL VS TIME-SENSITIVE FESTIVAL EDITION
// ============================================================================

export type FestivalPrestigeTier =
  | "TIER_1_A_LIST"         // Cannes, Venice, Berlinale, Sundance, TIFF
  | "TIER_2_MAJOR_INDUSTRY"  // Telluride, SXSW, Locarno, San Sebastian, Tribeca, Rotterdam, Clermont-Ferrand
  | "TIER_3_GENRE_REGIONAL"  // Sitges, Fantastic Fest, Annecy, IDFA, BFI London
  | "TIER_4_SPECIALIZED_DISCOVERY" // Raindance, Slamdance, Encounters, Palm Springs ShortFest
  | "TIER_5_ACADEMIC_STUDENT";

export type FestivalRegion =
  | "NORTH_AMERICA"
  | "EUROPE"
  | "ASIA_PACIFIC"
  | "LATIN_AMERICA"
  | "MIDDLE_EAST_AFRICA"
  | "GLOBAL";

export type FestivalStatus = "ACTIVE" | "ON_HIATUS" | "DEFUNCT";

export type EditionSeason = "WINTER" | "SPRING" | "SUMMER" | "FALL";

export type EditionStatus =
  | "UPCOMING"
  | "CALL_FOR_ENTRIES"
  | "SELECTION_IN_PROGRESS"
  | "CONCLUDED"
  | "CANCELLED";

export type SubmissionPlatform =
  | "FILMFREEWAY"
  | "SHORTFILMDEPOT"
  | "FESTHOME"
  | "DIRECT_FESTIVAL_PORTAL"
  | "EMAIL";

/**
 * Standing Festival Identity (PERSISTENT METADATA ONLY).
 * NEVER contains year-specific deadlines, entry fees, or temporary rules.
 */
export interface FilmFestival {
  id: string;
  slug: string;
  name: string;
  acronym?: string;
  foundedYear: number;
  hostCity: string;
  hostCountry: string;
  region: FestivalRegion;
  prestigeTier: FestivalPrestigeTier;
  academyAwardQualifying: boolean;
  baftaQualifying: boolean;
  fiapfAccredited: boolean;
  focusCategories: string[]; // e.g. ["Narrative Feature", "Short Film", "AI & Expanded Cinema", "Doc"]
  officialWebsite: string;
  submissionPortals: SubmissionPlatform[];
  description: string;
  editorialNotes?: string;
  status: FestivalStatus;
  visibility: "PUBLIC";
  verifiedAt: string;
}

export interface SubmissionFeeDetail {
  category: string; // e.g. "Short Film", "Feature Film", "AI Experimental"
  earlyBirdFee?: number;
  regularFee?: number;
  lateFee?: number;
  extendedFee?: number;
  currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "INR";
}

export interface FestivalEditionDeadlines {
  callForEntriesOpen?: string;
  earlyBirdDeadline?: string;
  regularDeadline?: string;
  lateDeadline?: string;
  extendedDeadline?: string;
  notificationDate: string;
}

export interface AIDisclosurePolicy {
  required: boolean;
  policyStatement: string;
  allowedCategories: string[];
  documentationRequirements: string[];
  sourceId?: string;
}

// ============================================================================
// 5. REQUIREMENT HIERARCHY & FESTIVAL-SPECIFIC DELIVERY SPECS
// ============================================================================

/**
 * Strict Distinction between General Practice and Actual Festival Requirements:
 * A. PLATFORM_RECOMMENDATION: Our general recommended filmmaking/festival delivery practice.
 * B. FESTIVAL_REQUIREMENT: A requirement explicitly stated by a specific festival for a specific edition.
 * C. FESTIVAL_EXCEPTION: A festival-specific requirement that differs from our general recommendation.
 */
export type RequirementTier =
  | "PLATFORM_RECOMMENDATION"
  | "FESTIVAL_REQUIREMENT"
  | "FESTIVAL_EXCEPTION";

export type SpecificationSafetyType =
  | "GENERAL_RECOMMENDATION"
  | "COMMON_INDUSTRY_PRACTICE"
  | "FESTIVAL_SPECIFIC"
  | "SOURCE_VERIFIED"
  | "UNVERIFIED";

export type DeliveryAssetCategory =
  | "MASTER_VIDEO"
  | "AUDIO_STEMS"
  | "SUBS_AND_TEXT"
  | "PUBLICITY_EPK"
  | "LEGAL_AND_METADATA";

export type DeliveryMethod =
  | "PHYSICAL_DCP_DRIVE"
  | "SECURE_UPLOAD_ASPERA"
  | "SECURE_UPLOAD_FTP"
  | "FILMFREEWAY_STREAM"
  | "VIMEO_LINK"
  | "DIRECT_PORTAL_UPLOAD"
  | "EMAIL_DOWNLOAD_LINK";

/**
 * Festival-Specific Delivery Requirements (Explicitly Sourced to Regulations)
 */
export interface FestivalEditionDeliveryRequirement {
  id: string;
  festivalEditionId: string;
  assetName: string;
  category: DeliveryAssetCategory;
  required: boolean;
  requirementTier: RequirementTier;
  technicalSpecification: string;
  submissionFormat: string;
  maximumFileSize?: string;
  resolution?: string;
  aspectRatio?: string;
  frameRate?: string;
  audioSpecification?: string;
  subtitleSpecification?: string;
  namingConvention?: string;
  deliveryMethod: DeliveryMethod;
  deadline?: string;
  sourceId: string; // Must be traceable to an official source
  lastVerified: string;
  verificationStatus: VerificationStatus;
  notes?: string;
}

export interface FestivalEditionRule {
  category: string;
  requiredPremiere: PremiereType;
  geographicRestriction: string;
  onlineExclusivityClause: boolean;
  priorBroadcastAllowed: boolean;
  completionDateCutoff: string;
  exemptionRules?: string;
  sourceId?: string;
}

/**
 * Year/Edition Specific Festival Record (TIME-SENSITIVE DATA)
 */
export interface FestivalEdition {
  id: string;
  festivalId: string;
  editionNumber?: number;
  year: number;
  season: EditionSeason;
  eventStartDate: string;
  eventEndDate: string;
  deadlines: FestivalEditionDeadlines;
  fees: SubmissionFeeDetail[];
  premiereRules: FestivalEditionRule[];
  acceptedFormats: string[]; // e.g. ["DCP", "ProRes 422HQ", "H.264 Screener"]
  deliveryRequirements: FestivalEditionDeliveryRequirement[];
  aiDisclosurePolicy: AIDisclosurePolicy;
  verifiedSources: ResearchSource[];
  status: EditionStatus;
  verificationStatus: VerificationStatus; // ACTIVE, OUTDATED, NEEDS_REVIEW, UNVERIFIED
  lastVerifiedAt: string;
}

// ============================================================================
// 6. PREMIERE RULES & SEQUENCE VALIDATION
// ============================================================================

export type PremiereType =
  | "WORLD_PREMIERE"               // Never screened anywhere publicly
  | "INTERNATIONAL_PREMIERE"       // Screened in country of origin, first time internationally
  | "CONTINENTAL_PREMIERE"         // First time in continent (European, Asian, North American)
  | "NATIONAL_PREMIERE"            // First time in specific nation
  | "REGIONAL_PREMIERE"            // First time in specific state/provincial territory
  | "ONLINE_PREMIERE"              // First public streaming release
  | "NO_PREMIERE_REQUIREMENT"      // No restriction
  | "UNKNOWN";

export interface PremiereRule {
  ruleId: string;
  festivalId: string;
  editionId: string;
  category: string;
  minimumPremiereRequired: PremiereType;
  isOnlineScreeningDisqualifying: boolean;
  isCommercialTheatricalDisqualifying: boolean;
  isPriorNationalBroadcastDisqualifying: boolean;
  completionDateCutoff: string;
  waiverPossibility: "NEVER" | "RARE" | "ON_REQUEST" | "AUTOMATIC";
  editorialRiskAssessment: string;
  sourceId: string;
  lastVerified: string;
  verificationStatus: VerificationStatus;
}

export interface PremiereSequenceValidatorResult {
  valid: boolean;
  violations: {
    festivalId: string;
    festivalName: string;
    claimedPremiere: PremiereType;
    conflictingFestivalId: string;
    conflictingFestivalName: string;
    conflictingPremiere: PremiereType;
    explanation: string;
    riskLevel: "CRITICAL_DISQUALIFICATION" | "POTENTIAL_RESTRICTION" | "SAFE";
  }[];
}

// ============================================================================
// 7. CANONICAL FILM & PEOPLE DATABASE (DEDUPLICATED)
// ============================================================================

export type PersonRole =
  | "DIRECTOR"
  | "CINEMATOGRAPHER"
  | "SCREENWRITER"
  | "PRODUCER"
  | "EDITOR"
  | "SOUND_DESIGNER"
  | "VFX_SUPERVISOR"
  | "AI_ARTIST"
  | "COMPOSER"
  | "ACTOR"
  | "PRODUCTION_DESIGNER"
  | "COLORIST";

export interface FilmographyItem {
  filmId?: string;
  title: string;
  year: number;
  role: PersonRole;
  creditTitle?: string;
}

export interface FestivalAccoladeItem {
  festivalName: string;
  festivalId?: string;
  editionId?: string;
  year: number;
  awardTitle: string;
  filmTitle: string;
}

export interface PersonSocialLinks {
  website?: string;
  imdb?: string;
  instagram?: string;
  twitter?: string;
  vimeo?: string;
  linkedin?: string;
}

/**
 * Canonical Person Entity
 * Deduplicated by unique person ID and alias mapping.
 */
export interface Person {
  id: string;
  slug: string;
  name: string;
  alternateNames: string[]; // Aliases to prevent duplicate records
  primaryRole: PersonRole;
  secondaryRoles: PersonRole[];
  biography: string;
  country: string;
  avatarUrl?: string;
  filmography: FilmographyItem[];
  festivalAccolades: FestivalAccoladeItem[];
  socialLinks: PersonSocialLinks;
  visibility: "PUBLIC";
  verifiedAt: string;
}

export type FilmFormat =
  | "FEATURE"
  | "SHORT"
  | "PILOT"
  | "DOCUMENTARY"
  | "EXPERIMENTAL"
  | "AI_NARRATIVE"
  | "COMMERCIAL"
  | "MUSIC_VIDEO";

export interface FilmTechnicalSpecs {
  aspectRatio: string;
  cameraSystems?: string[];
  lenses?: string[];
  captureFormat?: string;
  colorSpace?: string;
  soundFormat?: string;
  aiGenerativeModels?: string[];
}

export interface FilmFestivalHistoryItem {
  festivalId: string;
  editionId?: string;
  festivalName: string;
  year: number;
  section?: string;
  premiereHeld?: PremiereType;
  awardWon?: string;
  screeningDate?: string;
}

export interface FilmCreditRef {
  personId: string; // Canonical reference to Person ID
  displayName?: string; // Resolved name fallback
  creditRole?: string;
}

/**
 * Canonical Film Entity
 */
export interface Film {
  id: string;
  slug: string;
  title: string;
  originalTitle?: string;
  releaseYear: number;
  runtimeMinutes: number;
  countryOfOrigin: string[];
  language: string[];
  format: FilmFormat;
  genres: string[];
  logline: string;
  synopsis: string;
  posterUrl?: string;
  trailerUrl?: string;
  
  // Relational Credits using Canonical Person IDs
  directors: FilmCreditRef[];
  cinematographers: FilmCreditRef[];
  writers: FilmCreditRef[];
  producers: FilmCreditRef[];
  cast: { personId?: string; actorName: string; characterName?: string }[];
  aiAndVfxCredits?: { personId?: string; name: string; role: string; toolsUsed?: string[] }[];
  
  // Premiere & Circuit
  premiereStatus: PremiereType;
  premiereFestivalId?: string;
  premiereEditionId?: string;
  festivalHistory: FilmFestivalHistoryItem[];
  
  // Technical & Visibility
  technicalSpecs: FilmTechnicalSpecs;
  streamingLinks?: { platform: string; url: string }[];
  visibility: "PUBLIC";
  verifiedAt: string;
}

// ============================================================================
// 8. USER FILM PROJECT WORKFLOW (PRIVATE DATA ISOLATION)
// ============================================================================

export type ProjectWorkflowStage =
  | "CONCEPT_DEVELOPMENT"
  | "TREATMENT_AND_SCRIPT"
  | "SCENE_BREAKDOWN_AND_BUDGET"
  | "AI_PREVIS_AND_LOOKBOOK"
  | "DIRECTOR_PROMPT_ARCHITECTURE"
  | "CASTING_AND_REHEARSAL"
  | "PRODUCTION_PRINCIPAL_PHOTOGRAPHY"
  | "AI_GENERATION_AND_ASSET_HARVEST"
  | "DAILIES_AND_EDITORIAL_ASSEMBLY"
  | "ROUGH_CUT_AND_REVIEW"
  | "PICTURE_LOCK_AND_VFX_FINISH"
  | "SOUND_DESIGN_AND_COLOR_GRADE"
  | "FESTIVAL_CIRCUIT_AND_DISTRIBUTION"
  | "PROJECT_ARCHIVE";

export type TimeOfDay = "DAY" | "NIGHT" | "DAWN" | "DUSK" | "MAGIC_HOUR";
export type LocationType = "INT" | "EXT" | "INT_EXT" | "VIRTUAL_VOLUME" | "PURE_SYNTHETIC";

export interface DepartmentBreakdown {
  cast: string[];
  backgroundExtras?: string[];
  camera: {
    framing: string;
    lens: string;
    movement: string;
    cameraPackage?: string;
    shutterAngle?: string;
    iso?: string;
  };
  lighting: {
    mood: string;
    practicals?: string[];
    keyLightSetup?: string;
    colorTemperature?: string;
  };
  sound: {
    ambience: string;
    foleyNeeds?: string[];
    dialoguePriority: string;
    musicCueIdea?: string;
  };
  artDepartment: {
    props: string[];
    wardrobe: string[];
    setDressing: string[];
    colorPalette?: string[];
  };
  vfxAi: {
    promptConcept?: string;
    generativeModels?: string[];
    compositeNotes?: string;
    controlNetNeeds?: string[];
  };
  specialEffects?: string[];
  stunts?: string[];
}

export interface SceneBreakdownItem {
  sceneNumber: number;
  slugline: string;
  timeOfDay: TimeOfDay;
  locationType: LocationType;
  pageCount: number;
  dramaticIntent: string;
  departments: DepartmentBreakdown;
  attachedResearchRecordIds?: string[];
  attachedPromptIds?: string[];
}

export type PostProductionPipelineStage =
  | "DAILIES_INGEST"
  | "OFFLINE_EDITORIAL_ASSEMBLY"
  | "ROUGH_CUT_ROUNDS"
  | "PICTURE_LOCK"
  | "CONFORM_AND_ONLINE_FINISH"
  | "AI_INPAINT_CLEANUP"
  | "VFX_COMPOSITING"
  | "COLOR_PREP"
  | "COLOR_GRADING"
  | "SOUND_EDIT_DIALOGUE"
  | "ADR_AND_VO"
  | "FOLEY_RECORDING"
  | "SOUND_DESIGN_AND_SFX"
  | "MUSIC_SCORE_INTEGRATION"
  | "FINAL_RE_RECORDING_MIX_5_1_7_1"
  | "SUBTITLE_AND_CLOSED_CAPTIONING"
  | "QUALITY_CONTROL_QC"
  | "DCP_MASTERING"
  | "DELIVERY_PACKAGE_ARCHIVE";

export type DeliveryItemStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "READY"
  | "QC_PASSED"
  | "DELIVERED";

export interface ProjectDeliveryChecklistItem {
  id: string;
  itemNumber: number;
  assetName: string;
  category: DeliveryAssetCategory;
  technicalSpec: string;
  requirementTier: RequirementTier;
  specificationSafety: SpecificationSafetyType;
  required: boolean;
  status: DeliveryItemStatus;
  filePathOrUrl?: string;
  notes?: string;
}

export type SubmissionStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "IN_CONSIDERATION"
  | "SELECTED"
  | "AWARD_WINNER"
  | "NOT_SELECTED"
  | "WITHDRAWN";

export interface FestivalSubmission {
  id: string;
  projectId: string;
  userId: string; // Strictly scoped to user
  festivalId: string;
  editionId: string;
  filmTitle: string;
  category: string;
  deadlineTier: "EARLY_BIRD" | "REGULAR" | "LATE" | "EXTENDED";
  submissionDate: string;
  feePaid: {
    amount: number;
    currency: string;
  };
  platform: SubmissionPlatform;
  trackingNumber?: string;
  premiereStatusClaimed: PremiereType;
  status: SubmissionStatus;
  notificationDate: string;
  screeningDate?: string;
  notes?: string;
}

/**
 * User-Owned Film Project Entity (STRICTLY PRIVATE)
 */
export interface FilmProject {
  id: string;
  slug: string;
  userId: string; // MANDATORY: Project ownership strictly belongs to user
  visibility: "PRIVATE"; // Never exposed to public search or unauthenticated requests
  title: string;
  logline: string;
  synopsis: string;
  format: FilmFormat;
  genres: string[];
  currentStage: ProjectWorkflowStage;
  directorName: string;
  targetPremiereWindow?: string;
  targetPremiereType?: PremiereType;
  sceneBreakdowns: SceneBreakdownItem[];
  postProductionStages: {
    stage: PostProductionPipelineStage;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    notes?: string;
    completedAt?: string;
  }[];
  festivalChecklist: ProjectDeliveryChecklistItem[];
  attachedResearchIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// 9. EXPLAINABLE (NON-FABRICATED) FESTIVAL MATCHING ENGINE
// ============================================================================

export interface FestivalMatchingCriteria {
  filmFormat: FilmFormat;
  genres: string[];
  runtimeMinutes: number;
  countryOfOrigin: string[];
  availablePremiereStatus: PremiereType;
  budgetTier: "MICRO_BUDGET" | "LOW_BUDGET" | "MID_BUDGET" | "STUDIO";
  aiUsed: boolean;
  preferredRegions: FestivalRegion[];
  maxSubmissionFeeUSD?: number;
  targetReleaseWindow: {
    startDate: string;
    endDate: string;
  };
}

/**
 * Transparent, Explainable Match Breakdown.
 * NO arbitrary or fake scores without explainable rules.
 */
export interface FestivalMatchAuditBreakdown {
  festivalId: string;
  festivalName: string;
  editionId: string;
  editionYear: number;
  editionStatus: EditionStatus;
  
  // Auditable Eligibility Checks
  runtimeCheck: {
    status: "PASS" | "FAIL" | "UNKNOWN";
    filmRuntimeMinutes: number;
    ruleLimitMinutes?: number;
    explanation: string;
  };
  
  premiereEligibility: {
    status: "ELIGIBLE" | "BORDERLINE" | "INELIGIBLE" | "EXEMPTION_POSSIBLE";
    requiredPremiere: PremiereType;
    availablePremiere: PremiereType;
    explanation: string;
    riskOfDisqualification: boolean;
  };
  
  genreToneEligibility: {
    status: "MATCH" | "PARTIAL" | "OUT_OF_SCOPE";
    festivalFocus: string[];
    filmGenres: string[];
    explanation: string;
  };
  
  timelineCheck: {
    status: "OPEN" | "UPCOMING" | "MISSED";
    activeDeadline?: string;
    daysUntilDeadline?: number;
    explanation: string;
  };
  
  aiPolicyCheck: {
    status: "PERMITTED" | "RESTRICTED" | "DISCLOSURE_REQUIRED" | "PROHIBITED";
    policyNotes: string;
  };
  
  strategicRecommendation: "TOP_TIER_TARGET" | "STRONG_CONTENDER" | "SAFETY_CIRCUIT" | "INELIGIBLE" | "REQUIRES_MANUAL_REVIEW";
  explanationSummary: string;
}

// ============================================================================
// 10. MASTER FESTIVAL DELIVERY CHECKLIST (28-ITEM MASTER PREPARATION GUIDE)
// ============================================================================

export type ChecklistApplicability =
  | "UNIVERSALLY_RECOMMENDED"
  | "COMMONLY_REQUESTED"
  | "FESTIVAL_SPECIFIC"
  | "REQUIRED_BY_FESTIVAL"
  | "OPTIONAL"
  | "NOT_APPLICABLE";

export interface MasterFestivalDeliveryItem {
  id: string;
  itemNumber: number;
  assetName: string;
  category: DeliveryAssetCategory;
  requirementTier: RequirementTier;
  specificationSafety: SpecificationSafetyType;
  applicability: ChecklistApplicability;
  technicalSpec: string;
  recommendationRationale: string;
  sourceCitation?: string;
}

/**
 * CREATOR INTEL — MASTER FESTIVAL DELIVERY CHECKLIST
 * Re-framed as a comprehensive master preparation guide (not all 28 required by every festival).
 */
export const MASTER_FESTIVAL_DELIVERY_CHECKLIST: MasterFestivalDeliveryItem[] = [
  // 1. MASTER VIDEO
  {
    id: "m-del-01",
    itemNumber: 1,
    assetName: "DCP (Digital Cinema Package - SMPTE/Interop DCI Compliant)",
    category: "MASTER_VIDEO",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "UNIVERSALLY_RECOMMENDED",
    technicalSpec: "2K/4K DCI Flat (1.85:1) or Scope (2.39:1), 24.00fps, Unencrypted, 5.1/7.1 Audio",
    recommendationRationale: "Universal theatrical standard required for physical cinema projection at Tier 1 & Tier 2 festivals."
  },
  {
    id: "m-del-02",
    itemNumber: 2,
    assetName: "Apple ProRes 4444 XQ Master (Textless)",
    category: "MASTER_VIDEO",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "UNIVERSALLY_RECOMMENDED",
    technicalSpec: "ProRes 4444 XQ, Native Framerate (24.00/25.00/23.976), 12-bit, Rec.709 / P3-D65",
    recommendationRationale: "Archival clean master required for generating foreign localizations, trailers, and streaming deliverables."
  },
  {
    id: "m-del-03",
    itemNumber: 3,
    assetName: "Apple ProRes 422 HQ Master (Texted / Festival Clean)",
    category: "MASTER_VIDEO",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "COMMONLY_REQUESTED",
    technicalSpec: "ProRes 422 HQ, 10-bit, 24.00fps, Rec.709, Stereo & 5.1 Embedded",
    recommendationRationale: "Standard high-fidelity digital screening file used by virtual festivals and secondary screening venues."
  },
  {
    id: "m-del-04",
    itemNumber: 4,
    assetName: "H.264 / H.265 High-Bitrate Exhibition File",
    category: "MASTER_VIDEO",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "COMMONLY_REQUESTED",
    technicalSpec: "MP4/MOV, 1080p/4K, 25-50 Mbps, AAC 320kbps Audio (Backup Screening Copy)",
    recommendationRationale: "Lightweight fallback projection file required by regional venues without dedicated DCI cinema servers."
  },
  {
    id: "m-del-05",
    itemNumber: 5,
    assetName: "Secure Streaming Screener (Vimeo OTT / FilmFreeway Stream)",
    category: "MASTER_VIDEO",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "UNIVERSALLY_RECOMMENDED",
    technicalSpec: "1080p Protected Screener with On-Screen Watermark option & Password Protection",
    recommendationRationale: "Standard submission preview format required by programmers and jury members during initial review."
  },

  // 2. AUDIO STEMS
  {
    id: "m-del-06",
    itemNumber: 6,
    assetName: "5.1 Surround Final Re-Recording Print Master",
    category: "AUDIO_STEMS",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "UNIVERSALLY_RECOMMENDED",
    technicalSpec: "24-bit / 48kHz WAV, 6 Discrete Tracks (L, R, C, LFE, Ls, Rs), -24 LKFS/LUFS",
    recommendationRationale: "Required for theatrical screening in commercial cinema auditoriums with multichannel sound systems."
  },
  {
    id: "m-del-07",
    itemNumber: 7,
    assetName: "Stereo 2.0 Lo/Ro Final Mix Master",
    category: "AUDIO_STEMS",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "UNIVERSALLY_RECOMMENDED",
    technicalSpec: "24-bit / 48kHz WAV, 2 Discrete Channels (L, R), -23/-24 LUFS Target",
    recommendationRationale: "Required for streaming screeners, press copies, and broadcast distribution."
  },
  {
    id: "m-del-08",
    itemNumber: 8,
    assetName: "5.1 M&E (Music & Effects) Stem",
    category: "AUDIO_STEMS",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "COMMONLY_REQUESTED",
    technicalSpec: "24-bit / 48kHz WAV 5.1 (Fully filled M&E, zero English dialogue for foreign dubbing)",
    recommendationRationale: "Essential for international sales agents and foreign distribution territory licensing."
  },
  {
    id: "m-del-09",
    itemNumber: 9,
    assetName: "Stereo M&E Stem",
    category: "AUDIO_STEMS",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "COMMONLY_REQUESTED",
    technicalSpec: "24-bit / 48kHz WAV Stereo (Clean Music & Effects without dialogue)",
    recommendationRationale: "Used for international trailer localized dubs and ancillary market localization."
  },
  {
    id: "m-del-10",
    itemNumber: 10,
    assetName: "Isolated Dialogue Stem (DX)",
    category: "AUDIO_STEMS",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "OPTIONAL",
    technicalSpec: "24-bit / 48kHz WAV (Center channel or L/R dialogue split)",
    recommendationRationale: "Helpful for foreign subtitling QA, automated translation, and re-dubbing workflows."
  },
  {
    id: "m-del-11",
    itemNumber: 11,
    assetName: "Isolated Music Stem (MX)",
    category: "AUDIO_STEMS",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "OPTIONAL",
    technicalSpec: "24-bit / 48kHz WAV 5.1 & Stereo",
    recommendationRationale: "Enables promotional teaser remixing and soundtrack release compilation."
  },
  {
    id: "m-del-12",
    itemNumber: 12,
    assetName: "Isolated Sound Effects Stem (FX/Foley/Ambience)",
    category: "AUDIO_STEMS",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "OPTIONAL",
    technicalSpec: "24-bit / 48kHz WAV 5.1 & Stereo",
    recommendationRationale: "Enables trailer sound design reconstruction and video game / interactive adaptation."
  },

  // 3. SUBTITLES & TIMED TEXT
  {
    id: "m-del-13",
    itemNumber: 13,
    assetName: "English Master Subtitles (SRT / VTT)",
    category: "SUBS_AND_TEXT",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "UNIVERSALLY_RECOMMENDED",
    technicalSpec: "UTF-8 SRT, frame-accurate timecode matching 24.00fps master, max 37 chars/line",
    recommendationRationale: "Universally required for international festival juries and accessible screening."
  },
  {
    id: "m-del-14",
    itemNumber: 14,
    assetName: "DCP XML Subtitle Asset (SMPTE 428-7)",
    category: "SUBS_AND_TEXT",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "FESTIVAL_SPECIFIC",
    technicalSpec: "SMPTE XML subtitle file with embedded font file (TTF/OTF) for DCI projector sync",
    recommendationRationale: "Required when projecting open captions directly via DCI server without hardcoding burn-in."
  },
  {
    id: "m-del-15",
    itemNumber: 15,
    assetName: "Dialogue List / Continuity Script with Timecode",
    category: "SUBS_AND_TEXT",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "COMMONLY_REQUESTED",
    technicalSpec: "PDF/DOCX with absolute timecodes (HH:MM:SS:FF) and character-attributed lines for translation",
    recommendationRationale: "Mandatory for festival translation bureaus (e.g. French translation for Cannes/Clermont)."
  },
  {
    id: "m-del-16",
    itemNumber: 16,
    assetName: "Closed Captions (SDH / Hearing Impaired)",
    category: "SUBS_AND_TEXT",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "OPTIONAL",
    technicalSpec: "English SDH SRT/VTT with audio descriptors in brackets ([door slams], [melancholic cello])",
    recommendationRationale: "Crucial for festival accessibility programs and broadcast/VOD compliance."
  },
  {
    id: "m-del-17",
    itemNumber: 17,
    assetName: "Foreign Language Subtitle Tracks (French / Spanish / German / Italian)",
    category: "SUBS_AND_TEXT",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "FESTIVAL_SPECIFIC",
    technicalSpec: "UTF-8 SRT matching European Tier 1 festival submission specs",
    recommendationRationale: "Specifically required by French, German, and Italian domestic regulations when screening locally."
  },

  // 4. PUBLICITY & EPK (ELECTRONIC PRESS KIT)
  {
    id: "m-del-18",
    itemNumber: 18,
    assetName: "High-Resolution Production Stills (Landscape & Portrait)",
    category: "PUBLICITY_EPK",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "UNIVERSALLY_RECOMMENDED",
    technicalSpec: "Min 5-10 uncompressed JPEG/TIFF, min 300 DPI, 3840x2160 or higher, with photo credit metadata",
    recommendationRationale: "Required for the festival catalog, printed program book, and trade press announcements."
  },
  {
    id: "m-del-19",
    itemNumber: 19,
    assetName: "Official Theatrical Key Art Poster (High-Res 300 DPI)",
    category: "PUBLICITY_EPK",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "UNIVERSALLY_RECOMMENDED",
    technicalSpec: "Layered PSD + Flat TIFF/PDF, 27x40 inch (One-Sheet) and A1/A0 European format, CMYK & RGB",
    recommendationRationale: "Displayed in cinema lobbies, festival venues, and market catalogs."
  },
  {
    id: "m-del-20",
    itemNumber: 20,
    assetName: "Digital Poster Social Adapters (1:1, 4:5, 9:16)",
    category: "PUBLICITY_EPK",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "COMMONLY_REQUESTED",
    technicalSpec: "JPEG/PNG RGB 2160x2160 (1:1), 1080x1350 (4:5), 1080x1920 (9:16) for social promotion",
    recommendationRationale: "Used for official festival Instagram/TikTok program announcements and social laurels."
  },
  {
    id: "m-del-21",
    itemNumber: 21,
    assetName: "Official Trailer / Teaser (ProRes & H.264)",
    category: "PUBLICITY_EPK",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "COMMONLY_REQUESTED",
    technicalSpec: "ProRes 422HQ and MP4, 1080p/4K, 60-120 seconds duration, stereo mix, no festival laurels",
    recommendationRationale: "Screened during festival pre-roll reels, press showcases, and online program listings."
  },
  {
    id: "m-del-22",
    itemNumber: 22,
    assetName: "Director Headshot & Biography (Short 50w & Full 250w)",
    category: "PUBLICITY_EPK",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "UNIVERSALLY_RECOMMENDED",
    technicalSpec: "300 DPI Photo + formatted Markdown/PDF text bio including previous festival history",
    recommendationRationale: "Required for official director badges, printed festival books, and Q&A moderator guides."
  },
  {
    id: "m-del-23",
    itemNumber: 23,
    assetName: "Electronic Press Kit (EPK) Comprehensive PDF",
    category: "PUBLICITY_EPK",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "COMMONLY_REQUESTED",
    technicalSpec: "Multi-page interactive PDF containing Logline, Synopsis, Director Statement, Cast/Crew Bios, Tech Specs, Press Quotes",
    recommendationRationale: "Distributed to journalists, film critics, buyers, and festival jury delegates."
  },
  {
    id: "m-del-24",
    itemNumber: 24,
    assetName: "Director's Vision Statement (300-500 words)",
    category: "PUBLICITY_EPK",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "COMMONLY_REQUESTED",
    technicalSpec: "Text/PDF document addressing thematic context, aesthetic approach, and AI/production methodology",
    recommendationRationale: "Frequently required by programming committees during second-round deliberation."
  },

  // 5. LEGAL, RIGHTS & TECHNICAL METADATA
  {
    id: "m-del-25",
    itemNumber: 25,
    assetName: "Music Cue Sheet & Sync License Clearances",
    category: "LEGAL_AND_METADATA",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "UNIVERSALLY_RECOMMENDED",
    technicalSpec: "Standard ASCAP/BMI/PRS cue sheet template with Track Title, Composer, Publisher, Usage, Duration",
    recommendationRationale: "Required by festival insurance and legal counsel to protect against copyright infringement claims."
  },
  {
    id: "m-del-26",
    itemNumber: 26,
    assetName: "Chain of Title & Underlying Rights Clearance Summary",
    category: "LEGAL_AND_METADATA",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "COMMONLY_REQUESTED",
    technicalSpec: "PDF certifying screenplay ownership, talent releases, location permits, and archival licenses",
    recommendationRationale: "Required by international festivals before confirming competition selection and screening."
  },
  {
    id: "m-del-27",
    itemNumber: 27,
    assetName: "AI Tool Disclosure & Dataset Provenance Statement",
    category: "LEGAL_AND_METADATA",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "SOURCE_VERIFIED",
    applicability: "FESTIVAL_SPECIFIC",
    technicalSpec: "Standardized disclosure declaration listing AI models used, scope of generation, and human authorship",
    recommendationRationale: "Increasingly mandated by major festivals (e.g. Tribeca, Annecy, Sundance) for AI & synthetic media sections."
  },
  {
    id: "m-del-28",
    itemNumber: 28,
    assetName: "Technical Delivery Cue Sheet & Running Order",
    category: "LEGAL_AND_METADATA",
    requirementTier: "PLATFORM_RECOMMENDATION",
    specificationSafety: "COMMON_INDUSTRY_PRACTICE",
    applicability: "UNIVERSALLY_RECOMMENDED",
    technicalSpec: "1-page technical spec sheet: Aspect ratio, frame rate, audio channel mapping, color space, exact head-to-tail runtime",
    recommendationRationale: "Crucial for projectionists and festival print traffic managers to ensure flawless theater playback."
  }
];
