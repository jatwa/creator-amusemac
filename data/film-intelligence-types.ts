/**
 * CREATOR INTEL — CINEMATIC INTELLIGENCE DATA ARCHITECTURE (PHASE 2)
 *
 * Comprehensive Type System covering:
 * 1. Journal & Cinema CMS Model
 * 2. Research Record & Source Verification Model
 * 3. Film Festival & Festival Edition Model
 * 4. Premiere Rules & Verification Engine
 * 5. Film Registry & Filmmaker People Database
 * 6. Film Project Workflow, Breakdown, Post Pipeline & Delivery System
 */

// ============================================================================
// 1. RESEARCH & SOURCE VERIFICATION CORE
// ============================================================================

export type SourceTier = 1 | 2 | 3 | 4 | 5 | 6;

export type SourceTierName =
  | "PRIMARY_OFFICIAL"
  | "PRIMARY_CREATOR_PRESS"
  | "TIER_1_TRADE"
  | "INDUSTRY_DATABASE"
  | "COMMUNITY_FORUM"
  | "UNVERIFIED_RUMOR";

export type SourceCategory =
  | "OFFICIAL"
  | "PRIMARY"
  | "INDUSTRY_PUBLICATION"
  | "DATABASE"
  | "COMMUNITY"
  | "SOCIAL"
  | "ARCHIVAL"
  | "ACADEMIC";

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
  title: string;
  url: string;
  sourceCategory: SourceCategory;
  tier: SourceTier;
  tierName: SourceTierName;
  publisher: string;
  author?: string;
  publishedDate?: string;
  retrievedDate: string;
  reliabilityScore: number; // 0.00 - 1.00
  archivedSnapshotUrl?: string;
  quotedPassage?: string;
  verificationNotes?: string;
}

export interface ResearchStatement {
  id: string;
  statement: string;
  nature: StatementNature;
  verificationStatus: VerificationStatus;
  sourceIds: string[];
  confidenceScore: number; // 0.00 - 1.00
  verificationNotes?: string;
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
}

export interface ResearchRecord {
  id: string;
  slug: string;
  topic: string;
  entityType: "FILM" | "PERSON" | "FESTIVAL" | "TOOL" | "TECHNIQUE" | "PREMIERE_RULE" | "GENERAL";
  entityId?: string;
  researchQuestion: string;
  findingsSummary: string;
  methodology: string;
  statements: ResearchStatement[];
  sources: ResearchSource[];
  confidenceLevel: "HIGH" | "MEDIUM" | "LOW" | "PROVISIONAL";
  verificationStatus: VerificationStatus;
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
// 2. JOURNAL & CINEMA CMS MODEL
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
  
  // Relational Ledger & Citations
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
// 3. FESTIVAL & FESTIVAL EDITION MODEL
// ============================================================================

export type FestivalPrestigeTier =
  | "TIER_1_A_LIST"
  | "TIER_2_MAJOR_INDUSTRY"
  | "TIER_3_GENRE_REGIONAL"
  | "TIER_4_SPECIALIZED_DISCOVERY"
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
  focusCategories: string[];
  officialWebsite: string;
  submissionPortals: ("FILMFREEWAY" | "SHORTFILMDEPOT" | "FESTHOME" | "DIRECT_FESTIVAL_PORTAL")[];
  description: string;
  editorialNotes?: string;
  status: FestivalStatus;
  verifiedAt: string;
}

export interface SubmissionFeeDetail {
  category: string;
  earlyBirdFee?: number;
  regularFee?: number;
  lateFee?: number;
  extendedFee?: number;
  currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF";
}

export interface FestivalEditionDeadlines {
  callForEntriesOpen?: string;
  earlyBirdDeadline?: string;
  regularDeadline?: string;
  lateDeadline?: string;
  extendedDeadline?: string;
  notificationDate: string;
}

export interface FestivalEditionRule {
  category: string;
  requiredPremiere: PremiereType;
  geographicRestriction: string;
  onlineExclusivityClause: boolean;
  priorBroadcastAllowed: boolean;
  completionDateCutoff: string;
  exemptionRules?: string;
}

export interface AIDisclosurePolicy {
  required: boolean;
  policyStatement: string;
  allowedCategories: string[];
  documentationRequirements: string[];
}

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
  acceptedFormats: string[];
  aiDisclosurePolicy: AIDisclosurePolicy;
  verifiedSources: ResearchSource[];
  status: EditionStatus;
  lastVerifiedAt: string;
}

// ============================================================================
// 4. PREMIERE & VERIFICATION ENGINE
// ============================================================================

export type PremiereType =
  | "WORLD_PREMIERE"
  | "INTERNATIONAL_PREMIERE"
  | "CONTINENTAL_PREMIERE"
  | "NATIONAL_PREMIERE"
  | "REGIONAL_PREMIERE"
  | "ONLINE_PREMIERE"
  | "NO_PREMIERE_REQUIREMENT"
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
// 5. FILM & PEOPLE DATABASE
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

export interface Person {
  id: string;
  slug: string;
  name: string;
  alternateNames?: string[];
  primaryRole: PersonRole;
  secondaryRoles: PersonRole[];
  biography: string;
  country: string;
  avatarUrl?: string;
  filmography: FilmographyItem[];
  festivalAccolades: FestivalAccoladeItem[];
  socialLinks: PersonSocialLinks;
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
  
  // Cast & Crew
  directors: { personId?: string; name: string }[];
  cinematographers: { personId?: string; name: string }[];
  writers: { personId?: string; name: string }[];
  producers: { personId?: string; name: string }[];
  cast: { personId?: string; name: string; characterName?: string }[];
  aiAndVfxCredits?: { personId?: string; name: string; role: string; toolsUsed?: string[] }[];
  
  // Premiere & Circuit
  premiereStatus: PremiereType;
  premiereFestivalId?: string;
  premiereEditionId?: string;
  festivalHistory: FilmFestivalHistoryItem[];
  
  // Technical
  technicalSpecs: FilmTechnicalSpecs;
  streamingLinks?: { platform: string; url: string }[];
  verifiedAt: string;
}

// ============================================================================
// 6. FILM PROJECT WORKFLOW & PRODUCTION INTELLIGENCE
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

export type DeliveryAssetCategory =
  | "MASTER_VIDEO"
  | "AUDIO_STEMS"
  | "SUBS_AND_TEXT"
  | "PUBLICITY_EPK"
  | "LEGAL_AND_METADATA";

export type DeliveryItemStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "READY"
  | "QC_PASSED"
  | "DELIVERED";

export interface FestivalDeliveryChecklistItem {
  id: string;
  itemNumber: number;
  assetName: string;
  category: DeliveryAssetCategory;
  technicalSpec: string;
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
  platform: "FILMFREEWAY" | "SHORTFILMDEPOT" | "FESTHOME" | "DIRECT_FESTIVAL_PORTAL" | "EMAIL";
  trackingNumber?: string;
  premiereStatusClaimed: PremiereType;
  status: SubmissionStatus;
  notificationDate: string;
  screeningDate?: string;
  notes?: string;
}

export interface FilmProject {
  id: string;
  slug: string;
  userId: string;
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
  festivalChecklist: FestivalDeliveryChecklistItem[];
  attachedResearchIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// 7. FESTIVAL MATCHING ENGINE SCHEMA
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

export interface FestivalMatchScoreBreakdown {
  festivalId: string;
  festivalName: string;
  editionId: string;
  editionYear: number;
  overallFitScore: number; // 0 - 100
  factors: {
    premiereEligibility: { score: number; status: "ELIGIBLE" | "BORDERLINE" | "INELIGIBLE"; reason: string };
    genreAndToneFit: { score: number; rationale: string };
    timelineMatch: { score: number; deadlineDate: string; daysRemaining: number };
    prestigeAndAudienceMatch: { score: number; tier: FestivalPrestigeTier };
    costEfficiency: { score: number; feeUSD: number };
  };
  strategicRecommendation: "TOP_TIER_TARGET" | "STRONG_CONTENDER" | "SAFETY_CIRCUIT" | "HIGH_RISK_INELIGIBLE";
}

// ============================================================================
// 8. 28-ITEM CANONICAL FESTIVAL DELIVERY CHECKLIST MASTER
// ============================================================================

export const CANONICAL_FESTIVAL_DELIVERY_CHECKLIST: Omit<FestivalDeliveryChecklistItem, "status" | "filePathOrUrl" | "notes">[] = [
  // 1. MASTER VIDEO
  { id: "del-01", itemNumber: 1, assetName: "DCP (Digital Cinema Package - SMPTE/Interop DCI Compliant)", category: "MASTER_VIDEO", technicalSpec: "2K/4K DCI Flat (1.85:1) or Scope (2.39:1), 24.00fps, Unencrypted, 5.1/7.1 Audio", required: true },
  { id: "del-02", itemNumber: 2, assetName: "Apple ProRes 4444 XQ Master (Textless)", category: "MASTER_VIDEO", technicalSpec: "ProRes 4444 XQ, Native Framerate (24.00/25.00/23.976), 12-bit, Rec.709 / P3-D65", required: true },
  { id: "del-03", itemNumber: 3, assetName: "Apple ProRes 422 HQ Master (Texted / Festival Clean)", category: "MASTER_VIDEO", technicalSpec: "ProRes 422 HQ, 10-bit, 24.00fps, Rec.709, Stereo & 5.1 Embedded", required: true },
  { id: "del-04", itemNumber: 4, assetName: "H.264 / H.265 High-Bitrate Exhibition File", category: "MASTER_VIDEO", technicalSpec: "MP4/MOV, 1080p/4K, 25-50 Mbps, AAC 320kbps Audio (Backup Screening Copy)", required: true },
  { id: "del-05", itemNumber: 5, assetName: "Secure Streaming Screener (Vimeo OTT / FilmFreeway Stream)", category: "MASTER_VIDEO", technicalSpec: "1080p Protected Screener with On-Screen Watermark option & Password Protection", required: true },

  // 2. AUDIO STEMS
  { id: "del-06", itemNumber: 6, assetName: "5.1 Surround Final Re-Recording Print Master", category: "AUDIO_STEMS", technicalSpec: "24-bit / 48kHz WAV, 6 Discrete Tracks (L, R, C, LFE, Ls, Rs), -24 LKFS/LUFS", required: true },
  { id: "del-07", itemNumber: 7, assetName: "Stereo 2.0 Lo/Ro Final Mix Master", category: "AUDIO_STEMS", technicalSpec: "24-bit / 48kHz WAV, 2 Discrete Channels (L, R), -23/-24 LUFS Target", required: true },
  { id: "del-08", itemNumber: 8, assetName: "5.1 M&E (Music & Effects) Stem", category: "AUDIO_STEMS", technicalSpec: "24-bit / 48kHz WAV 5.1 (Fully filled M&E, zero English dialogue for foreign dubbing)", required: true },
  { id: "del-09", itemNumber: 9, assetName: "Stereo M&E Stem", category: "AUDIO_STEMS", technicalSpec: "24-bit / 48kHz WAV Stereo (Clean Music & Effects without dialogue)", required: true },
  { id: "del-10", itemNumber: 10, assetName: "Isolated Dialogue Stem (DX)", category: "AUDIO_STEMS", technicalSpec: "24-bit / 48kHz WAV (Center channel or L/R dialogue split)", required: false },
  { id: "del-11", itemNumber: 11, assetName: "Isolated Music Stem (MX)", category: "AUDIO_STEMS", technicalSpec: "24-bit / 48kHz WAV 5.1 & Stereo", required: false },
  { id: "del-12", itemNumber: 12, assetName: "Isolated Sound Effects Stem (FX/Foley/Ambience)", category: "AUDIO_STEMS", technicalSpec: "24-bit / 48kHz WAV 5.1 & Stereo", required: false },

  // 3. SUBTITLES & TIMED TEXT
  { id: "del-13", itemNumber: 13, assetName: "English Master Subtitles (SRT / VTT)", category: "SUBS_AND_TEXT", technicalSpec: "UTF-8 SRT, frame-accurate timecode matching 24.00fps master, max 37 chars/line", required: true },
  { id: "del-14", itemNumber: 14, assetName: "DCP XML Subtitle Asset (SMPTE 428-7)", category: "SUBS_AND_TEXT", technicalSpec: "SMPTE XML subtitle file with embedded font file (TTF/OTF) for DCI projector sync", required: true },
  { id: "del-15", itemNumber: 15, assetName: "Dialogue List / Continuity Script with Timecode", category: "SUBS_AND_TEXT", technicalSpec: "PDF/DOCX with absolute timecodes (HH:MM:SS:FF) and character-attributed lines for translation", required: true },
  { id: "del-16", itemNumber: 16, assetName: "Closed Captions (SDH / Hearing Impaired)", category: "SUBS_AND_TEXT", technicalSpec: "English SDH SRT/VTT with audio descriptors in brackets ([door slams], [melancholic cello])", required: false },
  { id: "del-17", itemNumber: 17, assetName: "Foreign Language Subtitle Tracks (French / Spanish / German / Italian)", category: "SUBS_AND_TEXT", technicalSpec: "UTF-8 SRT matching European Tier 1 festival submission specs", required: false },

  // 4. PUBLICITY & EPK (ELECTRONIC PRESS KIT)
  { id: "del-18", itemNumber: 18, assetName: "High-Resolution Production Stills (Landscape & Portrait)", category: "PUBLICITY_EPK", technicalSpec: "Min 5-10 uncompressed JPEG/TIFF, min 300 DPI, 3840x2160 or higher, with photo credit metadata", required: true },
  { id: "del-19", itemNumber: 19, assetName: "Official Theatrical Key Art Poster (High-Res 300 DPI)", category: "PUBLICITY_EPK", technicalSpec: "Layered PSD + Flat TIFF/PDF, 27x40 inch (One-Sheet) and A1/A0 European format, CMYK & RGB", required: true },
  { id: "del-20", itemNumber: 20, assetName: "Digital Poster Social Adapters (1:1, 4:5, 9:16)", category: "PUBLICITY_EPK", technicalSpec: "JPEG/PNG RGB 2160x2160 (1:1), 1080x1350 (4:5), 1080x1920 (9:16) for social promotion", required: true },
  { id: "del-21", itemNumber: 21, assetName: "Official Trailer / Teaser (ProRes & H.264)", category: "PUBLICITY_EPK", technicalSpec: "ProRes 422HQ and MP4, 1080p/4K, 60-120 seconds duration, stereo mix, no festival laurels", required: true },
  { id: "del-22", itemNumber: 22, assetName: "Director Headshot & Biography (Short 50w & Full 250w)", category: "PUBLICITY_EPK", technicalSpec: "300 DPI Photo + formatted Markdown/PDF text bio including previous festival history", required: true },
  { id: "del-23", itemNumber: 23, assetName: "Electronic Press Kit (EPK) Comprehensive PDF", category: "PUBLICITY_EPK", technicalSpec: "Multi-page interactive PDF containing Logline, Synopsis, Director Statement, Cast/Crew Bios, Tech Specs, Press Quotes", required: true },
  { id: "del-24", itemNumber: 24, assetName: "Director's Vision Statement (300-500 words)", category: "PUBLICITY_EPK", technicalSpec: "Text/PDF document addressing thematic context, aesthetic approach, and AI/production methodology", required: true },

  // 5. LEGAL, RIGHTS & TECHNICAL METADATA
  { id: "del-25", itemNumber: 25, assetName: "Music Cue Sheet & Sync License Clearances", category: "LEGAL_AND_METADATA", technicalSpec: "Standard ASCAP/BMI/PRS cue sheet template with Track Title, Composer, Publisher, Usage, Duration", required: true },
  { id: "del-26", itemNumber: 26, assetName: "Chain of Title & Underlying Rights Clearance Summary", category: "LEGAL_AND_METADATA", technicalSpec: "PDF certifying screenplay ownership, talent releases, location permits, and archival licenses", required: true },
  { id: "del-27", itemNumber: 27, assetName: "AI Tool Disclosure & Dataset Provenance Statement", category: "LEGAL_AND_METADATA", technicalSpec: "Standardized disclosure declaration listing AI models used, scope of generation, and human authorship", required: true },
  { id: "del-28", itemNumber: 28, assetName: "Technical Delivery Cue Sheet & Running Order", category: "LEGAL_AND_METADATA", technicalSpec: "1-page technical spec sheet: Aspect ratio, frame rate, audio channel mapping, color space, exact head-to-tail runtime", required: true },
];
