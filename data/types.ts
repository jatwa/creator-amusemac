export type CategoryType = "video" | "image" | "audio" | "3d" | "editing" | "workflow" | "vfx" | "concept";

export type PricingModel = "free" | "freemium" | "paid" | "open-source" | "usage-based";

export type RoleMode = "director" | "cinematographer" | "production_designer" | "editor" | "producer";

export interface ToolPricing {
  model: PricingModel;
  startingPrice?: string;
  freeTierDetails?: string;
  subscriptionInfo?: string;
  commercialUse: boolean | string;
}

export interface CreatorVerdict {
  rating: number; // e.g. 4.7
  bestFor: string;
  useWhen: string;
  avoidWhen: string;
  primaryAlternative: {
    name: string;
    slug: string;
    reason: string;
  };
  editorialQuote: string;
}

export interface QuickFacts {
  developer: string;
  releaseYear: string;
  verifiedModel: string;
  platforms: string[];
  commercialTerms: string;
  apiSupport: string;
  lastVerified: string;
  officialUrl: string;
  pricingSummary: string;
  freeTierStatus: string;
}

export interface FunctionalBreakdown {
  generation: string[];
  transformation: string[];
  performance: string[];
  camera: string[];
  audio: string[];
}

export interface ShotBreakdownItem {
  shotType: string;
  recommendedModel: string;
  why: string;
  promptStrategy: string;
  expectedResult: string;
  commonFailure: string;
}

export interface ProductionPipelineStage {
  stageNumber: number;
  stageName: string;
  action: string;
  featureUsed: string;
  outputArtifact: string;
  potentialPitfall: string;
}

export interface UsageGuide {
  beginner: string[];
  intermediate: string[];
  advanced: string[];
}

export interface PromptExampleItem {
  title: string;
  category: "Cinematic" | "Commercial" | "Product" | "Character" | "Camera Movement" | "VFX";
  promptText: string;
  anatomy: {
    subject: string;
    action: string;
    camera: string;
    lens: string;
    light: string;
    environment: string;
    motion: string;
    physics: string;
    style: string;
  };
  explanation: string;
}

export interface CommonMistakeItem {
  mistake: string;
  impact: string;
  fix: string;
}

export interface AlternativeMatrixItem {
  need: string;
  useTool: string;
  slug: string;
  why: string;
}

export interface PricingTierDetail {
  name: string;
  price: string;
  creditsOrLimits: string;
  watermark: boolean;
  commercialRights: boolean;
  notes: string;
}

export interface CreatorScorecard {
  cinematicQuality: number; // 1.0 - 5.0
  cameraControl: number;
  motionRealism: number;
  characterConsistency: number;
  promptAdherence: number;
  speed: number;
  easeOfUse: number;
  commercialSafety: number;
  workflowIntegration: number;
}

export interface SourceLedgerRecord {
  title: string;
  url: string;
  lastVerified: string;
  verificationConfidence: "Primary Documentation" | "API Specs" | "Direct Benchmark";
}

export interface DetailedToolDossier {
  toolId: string;
  slug: string;
  name: string;
  category: CategoryType;
  tagline: string;
  creatorVerdict: CreatorVerdict;
  quickFacts: QuickFacts;
  pros: string[];
  cons: string[];
  whyCreatorsUseIt: string;
  functionalBreakdown: FunctionalBreakdown;
  filmmakerTake: string;
  bestUseCases: { title: string; explanation: string }[];
  notBestFor: { title: string; explanation: string; betterAlternative: string }[];
  shotByShotBreakdown: ShotBreakdownItem[];
  productionPipeline: ProductionPipelineStage[];
  usageGuide: UsageGuide;
  promptExamples: PromptExampleItem[];
  commonMistakes: CommonMistakeItem[];
  alternativesMatrix: AlternativeMatrixItem[];
  pricingTiers: PricingTierDetail[];
  limitations: string[];
  creatorScorecard: CreatorScorecard;
  sourceLedger: SourceLedgerRecord[];
  rolePerspectives?: {
    director: string;
    cinematographer: string;
    production_designer: string;
    editor: string;
    producer: string;
  };
}

export interface Tool {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  overview: string;
  category: CategoryType;
  subcategories: string[];
  bestFor: string;
  keyFeatures: string[];
  strengths: string[];
  weaknesses: string[];
  pricing: ToolPricing;
  supportedModels?: string[];
  platforms: ("Web" | "macOS" | "Windows" | "iOS" | "Android" | "API" | "Plugin" | "Discord")[];
  officialUrl: string;
  accentColor: string;
  logoUrl?: string;
  rating?: number; // 1.0 - 5.0
  verifiedAt: string;
  updatedAt: string;
  competitorIds: string[];
  recommendedPromptIds: string[];
  tutorialIds: string[];
  workflowIds: string[];
  relatedBlogIds?: string[];
  relatedVideoIds?: string[];
  dossier?: DetailedToolDossier;
}

export interface PromptVariable {
  key: string;
  label: string;
  placeholder: string;
  defaultValue: string;
  description?: string;
}

export interface PromptVariation {
  name: string;
  promptText: string;
}

export interface Prompt {
  id: string;
  slug: string;
  title: string;
  category: CategoryType;
  useCase: string;
  description: string;
  promptText: string;
  negativePrompt?: string;
  variables: PromptVariable[];
  compatibleToolIds: string[];
  recommendedSettings?: {
    aspectRatio?: string;
    guidanceScale?: string;
    model?: string;
    steps?: number;
    additionalNotes?: string;
  };
  variations?: PromptVariation[];
  relatedPromptIds: string[];
  relatedTutorialIds: string[];
  relatedBlogIds?: string[];
  relatedVideoIds?: string[];
  verifiedAt: string;
}

export interface ComparisonScenario {
  scenario: string;
  winnerId: string;
  rationale: string;
}

export interface FeatureComparisonRow {
  feature: string;
  toolASupport: boolean | string;
  toolBSupport: boolean | string;
  importance: "essential" | "nice-to-have" | "advanced";
}

export interface ToolComparison {
  id: string;
  slug: string;
  toolAId: string;
  toolBId: string;
  category: string;
  summaryVerdict: string;
  verdictByScenario: ComparisonScenario[];
  scores: {
    quality: { toolA: number; toolB: number }; // 1-10
    speed: { toolA: number; toolB: number };
    easeOfUse: { toolA: number; toolB: number };
    creatorValue: { toolA: number; toolB: number };
    commercialSafety: { toolA: number; toolB: number };
  };
  featureMatrix: FeatureComparisonRow[];
  relatedTutorialIds: string[];
  relatedPromptIds: string[];
  relatedBlogIds?: string[];
  relatedVideoIds?: string[];
  updatedAt: string;
}

export interface WorkflowStep {
  stepNumber: number;
  phaseName: string;
  goal: string;
  explanation: string;
  recommendedToolIds: string[];
  alternativeToolIds: string[];
  recommendedPromptIds: string[];
  proTips: string[];
}

export interface Workflow {
  id: string;
  slug: string;
  title: string;
  category: "film" | "commercial" | "music-video" | "social" | "game-art" | "vfx";
  summary: string;
  targetAudience: string;
  estimatedTime: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "pro";
  steps: WorkflowStep[];
  relatedTutorialIds: string[];
  relatedBlogIds?: string[];
  relatedVideoIds?: string[];
  lastUpdated: string;
}

export interface TutorialSection {
  heading: string;
  contentMarkdown: string;
  tipBox?: string;
  promptId?: string;
  toolId?: string;
}

export interface Tutorial {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  goal: string;
  prerequisites: string[];
  requiredToolIds: string[];
  sections: TutorialSection[];
  commonMistakes: string[];
  relatedWorkflowIds: string[];
  relatedBlogIds?: string[];
  relatedVideoIds?: string[];
  publishedAt: string;
  updatedAt: string;
}

export interface CategoryInfo {
  slug: string;
  name: string;
  description: string;
  icon: string;
  badge: string;
  toolCount?: number;
}

export interface ResourceItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  type: "Template" | "Cheat Sheet" | "Guide" | "Asset Pack" | "Checklist";
  description: string;
  downloadOrActionUrl: string;
  format: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  coverImageUrl?: string;
  author: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  readingTime: string;
  status: "draft" | "published";
  relatedToolIds: string[];
  relatedPromptIds: string[];
  relatedTutorialIds: string[];
  relatedWorkflowIds: string[];
  relatedVideoIds: string[];
  sourceUrls?: string[];
}

export interface VideoItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  platform: "youtube" | "vimeo" | "other";
  videoUrl: string;
  embedUrl: string;
  thumbnailUrl?: string;
  duration: string;
  creator: {
    name: string;
    channelUrl: string;
    avatarUrl?: string;
  };
  publishedAt: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
  relatedToolIds: string[];
  relatedPromptIds: string[];
  relatedTutorialIds: string[];
  relatedWorkflowIds: string[];
  relatedBlogIds: string[];
  sourceUrl?: string;
}

export interface UpdateLog {
  id: string;
  toolId: string;
  sourceUrl: string;
  detectedChange: string;
  previousValue: string;
  newValue: string;
  confidenceScore: number;
  verificationState: "verified" | "pending_editorial_review" | "rejected";
  timestamp: string;
}

export interface VideoEngine {
  id: string;
  name: string;
  slug: string;
  company: string;
  model: string;
  officialUrl: string;
  pricingModel: "Free" | "Freemium" | "Paid" | "Open Source";
  startingPrice: string;
  freeTier: string;
  maxResolution: string;
  maxDuration: string;
  t2v: boolean;
  i2v: boolean;
  v2v: boolean;
  cameraControl: string;
  motionControl: string;
  characterConsistency: string;
  audio: string;
  dialogue: boolean;
  lipSync: boolean;
  referenceImages: boolean;
  seedControl: boolean;
  aspectRatios: string[];
  apiAvailability: boolean;
  commercialUse: string;
  strengths: string[];
  weaknesses: string[];
  bestUseCases: string[];
  lastVerified: string;
  sourceUrl: string;
  rating: number;
  useCaseTags: ("commercial" | "narrative" | "previs" | "vfx" | "social" | "music-video" | "documentary")[];
}
