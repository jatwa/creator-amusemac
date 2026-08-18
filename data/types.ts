export type CategoryType = "video" | "image" | "audio" | "3d" | "editing" | "workflow" | "vfx" | "concept";

export type PricingModel = "free" | "freemium" | "paid" | "open-source" | "usage-based";

export interface ToolPricing {
  model: PricingModel;
  startingPrice?: string;
  freeTierDetails?: string;
  subscriptionInfo?: string;
  commercialUse: boolean | string;
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
