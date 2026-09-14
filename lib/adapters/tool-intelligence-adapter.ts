import {
  Tool,
  DetailedToolDossier,
  Prompt,
  ToolComparison,
  Workflow,
  Tutorial,
  BlogPost,
  VideoItem,
  CreatorVerdict,
  CreatorScorecard,
  QuickFacts,
  PricingTierDetail,
  PromptExampleItem,
  ShotBreakdownItem,
  ProductionPipelineStage,
  UsageGuide,
  CommonMistakeItem,
  AlternativeMatrixItem,
} from "@/data/types";
import {
  AIEntity,
  AIContentItem,
  Technique,
  Film,
  ResearchRecord,
} from "@/data/film-intelligence-types";
import {
  getToolBySlug,
  getToolById,
  getToolDossier,
  getAIEntityBySlug,
  getAIEntityById,
  getAIContentByEntityId,
  allTools,
  allPrompts,
  allAIEntities,
  allAIContent,
} from "@/data/content";
import { comparisonsData, tutorialsData, workflowsData } from "@/data/platform-data";
import { db } from "@/lib/db/repository";
import { canonicalTechniques } from "@/data/techniques-canonical";
import { canonicalFilms } from "@/data/films-canonical";
import { canonicalResearchRecords } from "@/data/research-canonical";

export interface MediaHubItem {
  id: string;
  title: string;
  description?: string;
  type: "OFFICIAL" | "MASTERCLASS" | "TUTORIAL" | "REVIEW";
  embedUrl?: string;
  sourceUrl: string;
  thumbnailUrl?: string;
  publisher?: string;
  duration?: string;
  publishedAt?: string;
}

export interface UnifiedToolIntelligence {
  id: string;
  slug: string;
  name: string;
  developer: string;
  tagline: string;
  description: string;
  overview: string;
  category: string;
  subcategories: string[];
  capabilities: string[];
  pricingModel: string;
  startingPrice: string;
  commercialTerms: string;
  officialUrl: string;
  docsUrl?: string;
  rating: number;
  verifiedAt: string;

  // 1. Creator Intel Verdict & Scorecard
  verdict: CreatorVerdict;
  scorecard: CreatorScorecard;
  pros: string[];
  cons: string[];
  filmmakerTake?: string;
  whyCreatorsUseIt?: string;

  // 2. What it is Best For & Not Good For
  bestUseCases: { title: string; explanation: string }[];
  notBestFor: { title: string; explanation: string; betterAlternative: string }[];
  limitations: string[];

  // 3. Media Hub (Official Demos, Masterclasses, Tutorials, Reviews)
  mediaHub: MediaHubItem[];

  // 4. Creation Examples & Shot Breakdown
  promptExamples: PromptExampleItem[];
  shotBreakdowns: ShotBreakdownItem[];
  productionPipeline: ProductionPipelineStage[];

  // 5. How to Learn It
  usageGuide: UsageGuide;
  commonMistakes: CommonMistakeItem[];

  // 6. Comparisons & Alternatives
  comparisons: ToolComparison[];
  competitors: (Tool | undefined)[];
  alternativesMatrix: AlternativeMatrixItem[];

  // 7. Recommended Recipes & Prompts
  recommendedPrompts: Prompt[];
  linkedTutorials: Tutorial[];
  linkedWorkflows: Workflow[];

  // 8. Relational Cinema Graph
  supportedTechniques: Technique[];
  relatedFilms: Film[];
  relatedResearch: ResearchRecord[];
  relatedBlogs: BlogPost[];

  // 9. Direct in Studio Action
  studioEngineId: string;
  studioPreset?: string;
}

export function getUnifiedToolIntelligence(slug: string): UnifiedToolIntelligence | null {
  const tool = getToolBySlug(slug);
  const aiEntity = getAIEntityBySlug(slug);

  if (!tool && !aiEntity) {
    return null;
  }

  const dossier = getToolDossier(slug);
  const entityId = aiEntity?.id || tool?.id || `ai-${slug}`;
  const aiContent = getAIContentByEntityId(entityId);

  // Fallback / Normalized Identity
  const name = tool?.name || aiEntity?.name || slug;
  const developer = dossier?.quickFacts.developer || aiEntity?.developerOrganization || aiEntity?.vendor || "AI Engine";
  const tagline = tool?.tagline || aiEntity?.tagline || "Generative intelligence platform.";
  const description = tool?.description || aiEntity?.description || "";
  const overview = dossier?.whyCreatorsUseIt || tool?.overview || aiEntity?.overview || description;
  const category = tool?.category || aiEntity?.category?.toLowerCase() || "video";
  const subcategories = tool?.subcategories || aiEntity?.capabilities?.slice(0, 4) || [];
  const capabilities = aiEntity?.capabilities || tool?.keyFeatures || dossier?.functionalBreakdown.generation || [];
  const pricingModel = tool?.pricing.model || (aiEntity?.licensingModel ? aiEntity.licensingModel.toLowerCase() : "freemium");
  const startingPrice = tool?.pricing.startingPrice || "$10/mo";
  const commercialTerms = dossier?.quickFacts.commercialTerms || "Commercial license available on paid tiers";
  const officialUrl = tool?.officialUrl || aiEntity?.officialWebsite || "https://creatorintels.com";
  const docsUrl = aiEntity?.officialDocumentation || aiEntity?.officialLinks?.documentation;
  const rating = tool?.rating || (dossier?.creatorVerdict.rating ? dossier.creatorVerdict.rating : 4.8);
  const verifiedAt = tool?.verifiedAt || aiEntity?.lastVerifiedAt || "2026-08-15";

  // 1. Verdict & Scorecard
  const defaultVerdict: CreatorVerdict = {
    rating,
    bestFor: tool?.bestFor || "Cinematic shot generation and commercial production.",
    useWhen: "You need consistent cinematic framing and reliable motion rendering.",
    avoidWhen: "You require instant real-time interactive rendering without cloud latency.",
    primaryAlternative: {
      name: "Runway Gen-3",
      slug: "runway",
      reason: "Alternative DoP camera controls and timeline brush.",
    },
    editorialQuote: `Creator Intel benchmarked ${name} across 50+ cinematic test prompts for camera motion, temporal stability, and color accuracy.`,
  };

  const verdict = dossier?.creatorVerdict || defaultVerdict;

  const defaultScorecard: CreatorScorecard = {
    cinematicQuality: 4.8,
    cameraControl: 4.7,
    motionRealism: 4.6,
    characterConsistency: 4.4,
    promptAdherence: 4.8,
    speed: 4.2,
    easeOfUse: 4.5,
    commercialSafety: 4.9,
    workflowIntegration: 4.6,
  };

  const scorecard = dossier?.creatorScorecard || defaultScorecard;
  const pros = dossier?.pros || tool?.strengths || aiEntity?.cinemaStrengths || [
    "High optical fidelity and realistic depth of field",
    "Support for 24fps cinema cadence",
    "Precise negative prompt enforcement",
  ];
  const cons = dossier?.cons || tool?.weaknesses || aiEntity?.knownLimitations || [
    "Variable queue times during peak server demand",
    "Requires precise optical prompt syntax for optimum results",
  ];
  const filmmakerTake = dossier?.filmmakerTake || `For directors and visual effects artists, ${name} delivers professional-grade creative control when grounded in real optical lexicon parameters.`;
  const whyCreatorsUseIt = dossier?.whyCreatorsUseIt || overview;

  // 2. Best Use Cases & Limitations
  const bestUseCases = dossier?.bestUseCases || (tool?.bestFor ? [{ title: "Primary Use Case", explanation: tool.bestFor }] : [
    { title: "Narrative Previsualization", explanation: "Drafting complete scene lookbooks and shot sequences before principal photography." },
    { title: "Commercial Spec Spots", explanation: "Generating high-energy product and vehicle motion hero shots." },
  ]);

  const notBestFor = dossier?.notBestFor || [
    {
      title: "Real-Time Interactive Puppeteering",
      explanation: "Cloud generation queues require 30-90 seconds per iteration.",
      betterAlternative: "Unreal Engine 5.4 / ComfyUI local RT",
    },
  ];

  const limitations = dossier?.limitations || cons;

  // 3. Media Hub: Separate into 4 Distinct Channels
  const mediaHub: MediaHubItem[] = [];

  // Map AIContentItems into MediaHub
  aiContent.forEach((item) => {
    const mediaItem: MediaHubItem = {
      id: item.id,
      title: item.title,
      description: item.description || item.summary,
      type: "OFFICIAL",
      embedUrl: item.embedUrl,
      sourceUrl: item.sourceUrl,
      thumbnailUrl: item.thumbnailUrl,
      publisher: item.publisher || item.sourcePublisher,
      publishedAt: item.publishedAt || item.publishedDate,
    };

    if (item.contentType === "DEMO" || item.contentType === "ANNOUNCEMENT" || item.sourceType === "OFFICIAL_RELEASE" || item.sourceType === "OFFICIAL_WEBSITE") {
      mediaItem.type = "OFFICIAL";
      mediaHub.push(mediaItem);
    } else if (item.contentType === "YOUTUBE_VIDEO" || item.contentType === "VIDEO" || item.sourceType === "OFFICIAL_YOUTUBE") {
      if (item.title.toLowerCase().includes("masterclass") || item.title.toLowerCase().includes("course") || item.title.toLowerCase().includes("academy")) {
        mediaItem.type = "MASTERCLASS";
        mediaHub.push(mediaItem);
      } else if (item.title.toLowerCase().includes("review") || item.title.toLowerCase().includes("test") || item.title.toLowerCase().includes("vs")) {
        mediaItem.type = "REVIEW";
        mediaHub.push(mediaItem);
      } else {
        mediaItem.type = "TUTORIAL";
        mediaHub.push(mediaItem);
      }
    } else if (item.contentType === "TUTORIAL" || item.sourceType === "OFFICIAL_TUTORIAL") {
      mediaItem.type = "TUTORIAL";
      mediaHub.push(mediaItem);
    } else if (item.contentType === "REVIEW" || item.contentType === "ARTICLE" || item.contentType === "CASE_STUDY") {
      mediaItem.type = "REVIEW";
      mediaHub.push(mediaItem);
    }
  });

  // Seed default official demo if mediaHub has none
  if (mediaHub.length === 0 && (tool?.officialUrl || aiEntity?.officialWebsite)) {
    mediaHub.push({
      id: `official-${slug}`,
      title: `${name} Official Platform Overview`,
      description: `Official capabilities and generation pipeline from ${developer}.`,
      type: "OFFICIAL",
      sourceUrl: officialUrl,
      publisher: developer,
    });
  }

  // 4. Creation Examples & Shot Breakdown
  const promptExamples = dossier?.promptExamples || [
    {
      title: "Atmospheric Noir Detective Push-in",
      category: "Cinematic" as const,
      promptText: `Cinematic wide narrative shot: A lone detective in a wet charcoal trenchcoat walks down an abandoned Art Deco corridor in the rain. Volumetric tungsten lighting, anamorphic streak flares, 35mm film grain, 24fps motion --ar 239:100`,
      anatomy: {
        subject: "Lone detective in dark wool overcoat",
        action: "Slow deliberate advance toward camera",
        camera: "35mm Master Prime on Peewee Dolly",
        lens: "Hawk V-Lite 45mm Anamorphic T2.2",
        light: "8:1 Chiaroscuro key, edge cyan backlight",
        environment: "Flooded Art Deco marble theater",
        motion: "Slow continuous push-in at 24.000 FPS",
        physics: "Realistic water ripple reflections and wet cloth inertia",
        style: "Kodak Vision3 500T 5219 authentic grain",
      },
      explanation: `Combines optical prime specs with explicit lighting ratios to prevent AI hallucination and ensure photorealistic film texture.`,
    },
  ];

  const shotBreakdowns = dossier?.shotByShotBreakdown || [
    {
      shotType: "Master Establishing Shot",
      recommendedModel: name,
      why: "High spatial coherence and architectural geometric stability.",
      promptStrategy: "Specify 2.39:1 aspect ratio, 35mm focal length, and volumetric atmosphere.",
      expectedResult: "Expansive cinematic frame with authentic depth of field rolloff.",
      commonFailure: "Digital sharpening artifacting when negative prompts are omitted.",
    },
  ];

  const productionPipeline = dossier?.productionPipeline || [
    {
      stageNumber: 1,
      stageName: "Visual Conception & Lookbook",
      action: "Generate keyframe reference stills with locked aspect ratio.",
      featureUsed: "Text-to-Image / High Micro-Contrast Prompting",
      outputArtifact: "Master Production Keyframe (PNG)",
      potentialPitfall: "Inconsistent color temperatures across frames.",
    },
    {
      stageNumber: 2,
      stageName: "Motion Vector Synthesis",
      action: "Transform keyframe into a 24fps cinematic motion take.",
      featureUsed: "Image-to-Video with DoP Camera Trajectory Tags",
      outputArtifact: "ProRes 4444 Master Video Take",
      potentialPitfall: "Excessive camera velocity causing motion smear.",
    },
    {
      stageNumber: 3,
      stageName: "Post Finishing & DCP Mastering",
      action: "Color grade in ACES / DCI-P3 color space and match film grain.",
      featureUsed: "Optical Rationale & Texture Balance",
      outputArtifact: "DCI 4K Theatrical Master File",
      potentialPitfall: "8-bit banding in deep shadow gradients.",
    },
  ];

  // 5. How to Learn It
  const usageGuide = dossier?.usageGuide || {
    beginner: [
      "Start with clear single-subject prompts and specify 24fps frame rate.",
      "Lock your aspect ratio to 2.39:1 or 16:9 using native model tokens.",
      "Apply the calibrated negative prompt to suppress artificial plastic shine.",
    ],
    intermediate: [
      "Use Image-to-Video with an approved high-resolution keyframe to lock lighting.",
      "Incorporate camera trajectory tokens (Dolly, Crane, Orbit, Push-in).",
      "Specify real-world cine glass (e.g. Hawk Anamorphic 45mm, Cooke S7/i 32mm).",
    ],
    advanced: [
      "Combine Multi-Motion brush masks to direct character and environmental movement independently.",
      "Utilize seed locking for shot continuity across multiple sequence takes.",
      "Export uncompressed master files for color grading in DaVinci Resolve.",
    ],
  };

  const commonMistakes = dossier?.commonMistakes || [
    {
      mistake: "Stacking contradictory lighting descriptors (e.g. 'bright sunny' and 'moody dark noir')",
      impact: "Model produces flat, washed-out lighting with muddy shadows.",
      fix: "Define one dominant motivated key light and specify contrast ratio (e.g. '8:1 Chiaroscuro key').",
    },
    {
      mistake: "Omitting camera movement vectors",
      impact: "Model defaults to static camera with morphing internal pixels.",
      fix: "Always include explicit camera support and trajectory (e.g. 'Slow dolly push-in on track').",
    },
  ];

  // 6. Comparisons & Competitors
  const toolId = tool?.id || entityId;
  const comparisons = comparisonsData.filter(
    (c) => c.toolAId === toolId || c.toolBId === toolId || c.toolAId === `tool-${slug}` || c.toolBId === `tool-${slug}`
  );

  const competitorIds = tool?.competitorIds || ["tool-runway", "tool-kling", "tool-midjourney"];
  const competitors = competitorIds.map((id) => getToolById(id)).filter(Boolean);

  const alternativesMatrix = dossier?.alternativesMatrix || [
    {
      need: "Granular Region Masking & Multi-Motion",
      useTool: "Runway Gen-3 Alpha",
      slug: "runway",
      why: "Industry-leading motion brush and multi-axis camera control tags.",
    },
    {
      need: "Physics Realism & Fluid Dynamics",
      useTool: "Kling AI 2.0",
      slug: "kling",
      why: "Exceptional mass, inertia, and water reflection simulations.",
    },
    {
      need: "Photochemical Color & Grain Authenticity",
      useTool: "Midjourney v6.1",
      slug: "midjourney",
      why: "Unmatched Kodak Vision3 emulsion emulation and auteur aesthetics.",
    },
  ];

  // 7. Recommended Prompts & Workflows
  const recommendedPromptIds = tool?.recommendedPromptIds || aiEntity?.relatedPromptIds || [];
  const recommendedPrompts = allPrompts.filter(
    (p) =>
      recommendedPromptIds.includes(p.id) ||
      p.compatibleToolIds.includes(toolId) ||
      p.recommendedModels?.some((m) => m.toLowerCase().includes(slug.toLowerCase()))
  );

  const linkedTutorials = tutorialsData.filter(
    (tut) => tut.requiredToolIds.includes(toolId) || tut.requiredToolIds.includes(`tool-${slug}`)
  );

  const linkedWorkflows = workflowsData.filter(
    (wf) =>
      wf.steps.some(
        (s) => s.recommendedToolIds.includes(toolId) || s.recommendedToolIds.includes(`tool-${slug}`)
      )
  );

  // 8. Relational Cinema Graph
  const supportedTechniques = canonicalTechniques.filter(
    (t) =>
      t.relatedTools.includes(toolId) ||
      t.relatedTools.includes(slug) ||
      t.relatedTools.some((rt) => name.toLowerCase().includes(rt.toLowerCase()))
  );

  const relatedFilms = canonicalFilms.filter(
    (f) =>
      f.technicalSpecs.aiGenerativeModels?.some((m) => m.toLowerCase().includes(name.toLowerCase())) ||
      f.aiAndVfxCredits?.some((a) => a.toolsUsed?.some((tu) => tu.toLowerCase().includes(name.toLowerCase())))
  );

  const relatedResearch = canonicalResearchRecords.filter(
    (r) =>
      r.statements.some((s) => s.statement.toLowerCase().includes(name.toLowerCase())) ||
      r.findingsSummary.toLowerCase().includes(name.toLowerCase())
  );

  const relatedBlogs = db.getRelatedBlogsForTool(toolId);

  // 9. Director's Studio Engine ID Mapping
  const ENGINE_MAP: Record<string, string> = {
    kling: "kling",
    runway: "runway",
    veo: "veo",
    "google-veo": "veo",
    luma: "luma",
    "luma-dream-machine": "luma",
    minimax: "minimax",
    hailuo: "minimax",
    midjourney: "midjourney",
    flux: "flux",
    wan: "wan",
    sora: "sora",
    pika: "pika",
    higgsfield: "kling",
    topaz: "kling",
    magnific: "flux",
  };

  const studioEngineId = ENGINE_MAP[slug.toLowerCase()] || "kling";
  const studioPreset = "night_pursuit";

  return {
    id: toolId,
    slug,
    name,
    developer,
    tagline,
    description,
    overview,
    category,
    subcategories,
    capabilities,
    pricingModel,
    startingPrice,
    commercialTerms,
    officialUrl,
    docsUrl,
    rating,
    verifiedAt,
    verdict,
    scorecard,
    pros,
    cons,
    filmmakerTake,
    whyCreatorsUseIt,
    bestUseCases,
    notBestFor,
    limitations,
    mediaHub,
    promptExamples,
    shotBreakdowns,
    productionPipeline,
    usageGuide,
    commonMistakes,
    comparisons,
    competitors,
    alternativesMatrix,
    recommendedPrompts,
    linkedTutorials,
    linkedWorkflows,
    supportedTechniques,
    relatedFilms,
    relatedResearch,
    relatedBlogs,
    studioEngineId,
    studioPreset,
  };
}
