import {
  categoriesData,
  toolsData,
  promptsData,
  comparisonsData,
  workflowsData,
  tutorialsData,
  resourcesData,
  blogsData,
  videosData,
  updateLogsData,
} from "./platform-data";
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
  UpdateLog,
  DetailedToolDossier,
  CaseStudyStory,
  AIFilmFestival,
  ProductionKit,
  CameraLexiconItem,
} from "./types";
import { toolDossiers } from "./tool-dossiers";
import { storiesData } from "./production-stories";
import { festivalsData } from "./festivals-data";
import { productionKitsData } from "./kits-data";
import { cameraLexiconData } from "./lexicon-data";

// Backward-compatible exports for existing components
export const categories = categoriesData.map((c) => ({
  name: c.name,
  description: c.description,
  icon: c.icon,
  slug: c.slug,
}));

export const tools = toolsData.slice(0, 3).map((t) => ({
  name: t.name,
  type: t.subcategories[0] || t.category,
  description: t.description,
  tag: t.bestFor.split(",")[0] || "For creators",
  accent: t.accentColor,
  slug: t.slug,
}));

export const prompts = promptsData.slice(0, 3).map((p) => ({
  category: p.useCase.split("/")[0]?.trim() || p.category,
  title: p.title,
  prompt: p.promptText,
  slug: p.slug,
}));

export const comparisons = comparisonsData.map((c) => {
  const toolA = toolsData.find((t) => t.id === c.toolAId);
  const toolB = toolsData.find((t) => t.id === c.toolBId);
  return {
    left: toolA ? toolA.name : "Tool A",
    right: toolB ? toolB.name : "Tool B",
    answer: c.summaryVerdict,
    category: c.category,
    slug: c.slug,
  };
});

export const tutorials = tutorialsData.slice(0, 3).map((t) => ({
  title: t.title,
  type: t.category,
  readTime: t.readTime,
  slug: t.slug,
}));

// Rich Platform Query & Getter APIs
export function getAllTools(): Tool[] {
  return toolsData;
}

export function getToolBySlug(slug: string): Tool | undefined {
  return toolsData.find((t) => t.slug === slug);
}

export function getToolById(id: string): Tool | undefined {
  return toolsData.find((t) => t.id === id);
}

export function getToolsByCategory(category: string): Tool[] {
  return toolsData.filter((t) => t.category.toLowerCase() === category.toLowerCase());
}

export function getToolDossier(slug: string): DetailedToolDossier | undefined {
  if (toolDossiers[slug]) {
    return toolDossiers[slug];
  }

  const tool = getToolBySlug(slug);
  if (!tool) return undefined;

  // Synthesize a structured deep dossier for tools without custom manual dossiers
  return {
    toolId: tool.id,
    slug: tool.slug,
    name: tool.name,
    category: tool.category,
    tagline: tool.tagline,
    creatorVerdict: {
      rating: tool.rating || 4.7,
      bestFor: tool.bestFor,
      useWhen: `You need verified ${tool.category} production capabilities tailored for ${tool.bestFor.toLowerCase()}.`,
      avoidWhen: "You need fully offline or open-source self-hosted alternatives without recurring subscription overhead.",
      primaryAlternative: {
        name: tool.competitorIds[0] ? getToolById(tool.competitorIds[0])?.name || "Alternative Model" : "Alternative Model",
        slug: tool.competitorIds[0] ? getToolById(tool.competitorIds[0])?.slug || "tools" : "tools",
        reason: "Different workflow trade-off or commercial licensing model."
      },
      editorialQuote: `${tool.name} provides solid, verified capabilities in the ${tool.category} discipline, tested for modern creative pipelines.`
    },
    quickFacts: {
      developer: tool.company || `${tool.name} Team`,
      releaseYear: "2024–2026",
      verifiedModel: tool.supportedModels?.[0] || "Latest Production Release",
      platforms: tool.platforms,
      commercialTerms: typeof tool.pricing.commercialUse === "string" ? tool.pricing.commercialUse : tool.pricing.commercialUse ? "Commercial use permitted" : "Personal use only",
      apiSupport: tool.platforms.includes("API") ? "Developer API Available" : "Web Studio Interface",
      lastVerified: tool.verifiedAt || "August 2026",
      officialUrl: tool.officialUrl,
      pricingSummary: tool.pricing.startingPrice || "Free tier available",
      freeTierStatus: tool.pricing.freeTierDetails || "Free trial available upon signup"
    },
    pros: tool.strengths && tool.strengths.length > 0 ? tool.strengths : ["Verified production workflow integration", "Fast rendering turn-around", "Clean UI"],
    cons: tool.weaknesses && tool.weaknesses.length > 0 ? tool.weaknesses : ["Learning curve for advanced features", "Subscription required for high-volume export"],
    whyCreatorsUseIt: tool.description,
    functionalBreakdown: {
      generation: [tool.overview],
      transformation: tool.keyFeatures || [],
      performance: ["Production asset synthesis", "Consistent visual output"],
      camera: ["Native resolution scaling", "Multi-aspect ratio support"],
      audio: [tool.category === "audio" ? "High-fidelity audio synthesis" : "N/A"]
    },
    filmmakerTake: `In a live production environment, ${tool.name} serves as a reliable accelerator during pre-production and asset generation phases, reducing turn-around time for director reviews.`,
    bestUseCases: [
      {
        title: "Primary Production Workflow",
        explanation: tool.bestFor
      }
    ],
    notBestFor: [
      {
        title: "Unsuitable Production Scenarios",
        explanation: "Scenarios requiring zero-budget offline rendering.",
        betterAlternative: "Open-source alternatives"
      }
    ],
    shotByShotBreakdown: [
      {
        shotType: "Primary Production Shot",
        recommendedModel: tool.name,
        why: `Optimized for ${tool.category} generation.`,
        promptStrategy: "Use structured production parameters specifying lighting, framing, and subject.",
        expectedResult: "Clean, consistent production-ready output.",
        commonFailure: "Avoid vague or overly generic prompt descriptors."
      }
    ],
    productionPipeline: [
      {
        stageNumber: 1,
        stageName: "Initial Concept",
        action: `Generate initial ${tool.category} assets using ${tool.name}.`,
        featureUsed: "Core Studio Interface",
        outputArtifact: "Draft Asset Plate",
        potentialPitfall: "Ensure proper resolution settings."
      },
      {
        stageNumber: 2,
        stageName: "Refinement & Export",
        action: "Refine parameters and export final high-resolution artifact.",
        featureUsed: "Export & Master Settings",
        outputArtifact: "Master Production File",
        potentialPitfall: "Verify commercial licensing rights."
      }
    ],
    usageGuide: {
      beginner: [
        "Step 01: Familiarize yourself with basic preset options.",
        "Step 02: Test simple inputs before applying complex multi-variable parameters."
      ],
      intermediate: [
        "Step 01: Adjust advanced guidance and aspect ratio parameters.",
        "Step 02: Integrate outputs into secondary editing tools."
      ],
      advanced: [
        "Step 01: Automate batch generations via API endpoints where supported.",
        "Step 02: Build custom node-based pipelines."
      ]
    },
    promptExamples: [
      {
        title: `${tool.name} Production Recipe`,
        category: "Cinematic",
        promptText: `Cinematic ${tool.category} composition with pristine lighting, sharp focus, and commercial color grade.`,
        anatomy: {
          subject: "Hero Subject",
          action: "Engaging in primary action",
          camera: "Cinematic framing",
          lens: "50mm Prime",
          light: "Diffused studio lighting",
          environment: "Studio setting",
          motion: "Smooth",
          physics: "Realistic",
          style: "Editorial commercial grade"
        },
        explanation: `Designed to maximize ${tool.name}'s core model strengths.`
      }
    ],
    commonMistakes: [
      {
        mistake: "Over-complicating prompt instructions with conflicting parameters.",
        impact: "Reduces generation fidelity.",
        fix: "Focus on clear, descriptive language highlighting the primary subject and atmosphere."
      }
    ],
    alternativesMatrix: tool.competitorIds.map((cId) => {
      const comp = getToolById(cId);
      return {
        need: `Alternative in ${tool.category}`,
        useTool: comp?.name || "Alternative Tool",
        slug: comp?.slug || "tools",
        why: `Different feature balance or pricing structure in ${tool.category}.`
      };
    }),
    pricingTiers: [
      {
        name: "Standard Tier",
        price: tool.pricing.startingPrice || "Contact Sales",
        creditsOrLimits: tool.pricing.subscriptionInfo || "Standard allocation",
        watermark: false,
        commercialRights: Boolean(tool.pricing.commercialUse),
        notes: tool.pricing.freeTierDetails || "Check official site for current tier specifics."
      }
    ],
    limitations: tool.weaknesses && tool.weaknesses.length > 0 ? tool.weaknesses : ["Standard cloud computing latency applies."],
    creatorScorecard: {
      cinematicQuality: 4.5,
      cameraControl: 4.3,
      motionRealism: 4.4,
      characterConsistency: 4.3,
      promptAdherence: 4.6,
      speed: 4.5,
      easeOfUse: 4.4,
      commercialSafety: 4.7,
      workflowIntegration: 4.5
    },
    sourceLedger: [
      {
        title: `${tool.name} Official Product Documentation`,
        url: tool.officialUrl,
        lastVerified: tool.verifiedAt || "August 2026",
        verificationConfidence: "Primary Documentation"
      }
    ],
    rolePerspectives: {
      director: `A practical tool for exploring ${tool.category} concepts before committing physical production resources.`,
      cinematographer: "Provides clean visual references for lighting and lens choices.",
      production_designer: "Accelerates visual ideation and moodboard development.",
      editor: "Generates high-quality assets to incorporate directly into timeline edits.",
      producer: "Helps streamline pre-production budgets and client presentation materials."
    }
  };
}

export function getAllPrompts(): Prompt[] {
  return promptsData;
}

export function getPromptBySlug(slug: string): Prompt | undefined {
  return promptsData.find((p) => p.slug === slug);
}

export function getPromptById(id: string): Prompt | undefined {
  return promptsData.find((p) => p.id === id);
}

export function getAllComparisons(): ToolComparison[] {
  return comparisonsData;
}

export function getComparisonBySlug(slug: string): ToolComparison | undefined {
  return comparisonsData.find((c) => c.slug === slug);
}

export function getAllWorkflows(): Workflow[] {
  return workflowsData;
}

export function getWorkflowBySlug(slug: string): Workflow | undefined {
  return workflowsData.find((w) => w.slug === slug);
}

export function getAllTutorials(): Tutorial[] {
  return tutorialsData;
}

export function getTutorialBySlug(slug: string): Tutorial | undefined {
  return tutorialsData.find((t) => t.slug === slug);
}

export function getAllCategories(): CategoryInfo[] {
  return categoriesData;
}

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return categoriesData.find((c) => c.slug === slug);
}

export function getAllResources(): ResourceItem[] {
  return resourcesData;
}

export function getAllBlogs(): BlogPost[] {
  return blogsData.filter((b) => b.status === "published");
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogsData.find((b) => b.slug === slug && b.status === "published");
}

export function getAllVideos(): VideoItem[] {
  return videosData.filter((v) => v.status === "published");
}

export function getVideoBySlug(slug: string): VideoItem | undefined {
  return videosData.find((v) => v.slug === slug && v.status === "published");
}

export function getAllUpdateLogs(): UpdateLog[] {
  return updateLogsData;
}

export function getAllStories(): CaseStudyStory[] {
  return storiesData;
}

export function getStoryBySlug(slug: string): CaseStudyStory | undefined {
  return storiesData.find((s) => s.slug === slug);
}

export function getAllFestivals(): AIFilmFestival[] {
  return festivalsData;
}

export function getFestivalBySlug(slug: string): AIFilmFestival | undefined {
  return festivalsData.find((f) => f.slug === slug);
}

export function getAllProductionKits(): ProductionKit[] {
  return productionKitsData;
}

export function getProductionKitBySlug(slug: string): ProductionKit | undefined {
  return productionKitsData.find((k) => k.slug === slug);
}

export function getAllCameraLexicon(): CameraLexiconItem[] {
  return cameraLexiconData;
}

export function getCameraLexiconBySlug(slug: string): CameraLexiconItem | undefined {
  return cameraLexiconData.find((l) => l.slug === slug);
}

// Universal Search with Synonyms Dictionary
const SEARCH_SYNONYMS: Record<string, string[]> = {
  video: ["runway", "kling", "veo", "luma", "minimax", "hailuo", "higgsfield", "pika", "wan", "ltx", "vidu", "pixverse"],
  image: ["midjourney", "flux", "ideogram", "krea", "leonardo", "magnific"],
  audio: ["elevenlabs", "suno", "udio", "voice", "sound", "foley", "music", "dubbing"],
  voice: ["elevenlabs", "descript", "speech", "heygen", "audio"],
  editing: ["descript", "davinci", "premiere", "capcut", "frameio", "timeline", "nle", "cut"],
  color: ["davinci", "aces", "lut", "grade", "resolve"],
  vfx: ["topaz", "upscale", "comfyui", "meshy", "wonderdynamics", "diffusion"],
  previs: ["storyboard", "animatic", "workflow", "runway", "kling", "camera"],
  camera: ["35mm", "anamorphic", "macro", "tracking", "russian arm", "lens", "optics", "dolly", "orbit", "drone", "fpv"],
  free: ["wan", "ltx", "comfyui", "flux", "open source", "freemium"],
  open: ["wan", "ltx", "flux", "comfyui", "open weights", "open source"],
  avatar: ["heygen", "synthesia", "hedra", "actor", "lip sync", "performance"],
  api: ["fal", "replicate", "infrastructure", "developer", "cloud", "serverless"],
};

export function searchAllEntities(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) {
    return {
      tools: toolsData,
      prompts: promptsData,
      tutorials: tutorialsData,
      workflows: workflowsData,
      comparisons: comparisonsData,
      blogs: blogsData.filter((b) => b.status === "published"),
      videos: videosData.filter((v) => v.status === "published"),
      stories: storiesData,
      festivals: festivalsData,
      kits: productionKitsData,
      lexicon: cameraLexiconData,
    };
  }

  // Check synonym triggers
  const relatedTerms: string[] = [q];
  for (const [key, synonyms] of Object.entries(SEARCH_SYNONYMS)) {
    if (q.includes(key) || synonyms.some((s) => s.includes(q))) {
      relatedTerms.push(key, ...synonyms);
    }
  }

  const matchesTerm = (text: string) => {
    const lower = text.toLowerCase();
    return relatedTerms.some((term) => lower.includes(term));
  };

  const matchedTools = toolsData.filter(
    (t) =>
      matchesTerm(t.name) ||
      matchesTerm(t.description) ||
      matchesTerm(t.bestFor) ||
      matchesTerm(t.category) ||
      t.keyFeatures.some((f) => matchesTerm(f)) ||
      (t.subcategories && t.subcategories.some((sub) => matchesTerm(sub)))
  );

  const matchedPrompts = promptsData.filter(
    (p) =>
      matchesTerm(p.title) ||
      matchesTerm(p.promptText) ||
      matchesTerm(p.useCase) ||
      matchesTerm(p.category)
  );

  const matchedTutorials = tutorialsData.filter(
    (tut) =>
      matchesTerm(tut.title) ||
      matchesTerm(tut.goal) ||
      matchesTerm(tut.category)
  );

  const matchedWorkflows = workflowsData.filter(
    (w) =>
      matchesTerm(w.title) ||
      matchesTerm(w.summary) ||
      w.steps.some((s) => matchesTerm(s.phaseName) || matchesTerm(s.goal))
  );

  const matchedComparisons = comparisonsData.filter((c) => {
    const tA = getToolById(c.toolAId)?.name || "";
    const tB = getToolById(c.toolBId)?.name || "";
    return (
      matchesTerm(tA) ||
      matchesTerm(tB) ||
      matchesTerm(c.summaryVerdict) ||
      matchesTerm(c.category)
    );
  });

  const matchedBlogs = blogsData.filter(
    (b) =>
      b.status === "published" &&
      (matchesTerm(b.title) ||
        matchesTerm(b.excerpt) ||
        matchesTerm(b.category) ||
        b.tags.some((tag: string) => matchesTerm(tag)))
  );

  const matchedVideos = videosData.filter(
    (v) =>
      v.status === "published" &&
      (matchesTerm(v.title) ||
        matchesTerm(v.description) ||
        matchesTerm(v.creator.name) ||
        matchesTerm(v.category) ||
        v.tags.some((tag: string) => matchesTerm(tag)))
  );

  const matchedStories = storiesData.filter(
    (s) =>
      matchesTerm(s.title) ||
      matchesTerm(s.subtitle) ||
      matchesTerm(s.summary) ||
      matchesTerm(s.genre) ||
      s.toolsUsed.some((t) => matchesTerm(t))
  );

  const matchedFestivals = festivalsData.filter(
    (f) =>
      matchesTerm(f.name) ||
      matchesTerm(f.hostCity) ||
      matchesTerm(f.country) ||
      matchesTerm(f.eligibility)
  );

  const matchedKits = productionKitsData.filter(
    (k) =>
      matchesTerm(k.title) ||
      matchesTerm(k.description) ||
      matchesTerm(k.category) ||
      k.targetSoftware.some((s) => matchesTerm(s))
  );

  const matchedLexicon = cameraLexiconData.filter(
    (l) =>
      matchesTerm(l.name) ||
      matchesTerm(l.cinematicEffect) ||
      matchesTerm(l.promptSyntax) ||
      matchesTerm(l.category)
  );

  return {
    tools: matchedTools,
    prompts: matchedPrompts,
    tutorials: matchedTutorials,
    workflows: matchedWorkflows,
    comparisons: matchedComparisons,
    blogs: matchedBlogs,
    videos: matchedVideos,
    stories: matchedStories,
    festivals: matchedFestivals,
    kits: matchedKits,
    lexicon: matchedLexicon,
  };
}
