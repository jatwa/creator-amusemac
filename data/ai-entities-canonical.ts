import { AIEntity } from "./film-intelligence-types";

/**
 * CREATOR INTEL — CANONICAL AI CINEMA INTELLIGENCE REGISTRY (PHASE 3I)
 *
 * Curated, verified intelligence dossiers for premier AI cinema technologies,
 * foundational diffusion/flow-matching models, audio generators, and director platforms.
 *
 * Every official link, documentation URL, and video source is grounded in verified provenance.
 */
export const canonicalAIEntities: AIEntity[] = [
  // =========================================================================
  // 1. HIGGSFIELD AI
  // =========================================================================
  {
    id: "ai-higgsfield",
    slug: "higgsfield",
    name: "Higgsfield AI",
    entityType: "COMPANY",
    vendor: "Higgsfield Inc.",
    tagline: "Foundational AI video models, Cinema Studio camera controls, and character consistency for filmmakers.",
    description:
      "Higgsfield is a specialized AI video research and product company developing foundational video generation systems with fine-grained Director of Photography (DoP) camera motion control, dynamic lighting simulation, Character Studio consistency, and the Higgsfield Academy educational ecosystem.",
    category: "VIDEO",
    secondaryCategories: ["PREVIS", "PRODUCTION", "VFX"],
    capabilities: [
      "Cinema Studio DoP Camera Controls (Dolly, Pan, Orbit, Crane)",
      "High-Fidelity Human Character Studio Consistency",
      "Motion-to-Video & Image-to-Video Synthesis",
      "Inpainting, Outpainting & Spatial Scene Extension",
      "Higgsfield Academy Filmmaking Curriculum & Previs Pipelines"
    ],
    productionStages: ["PRE_PRODUCTION", "PRODUCTION", "VFX", "AI"],
    officialWebsite: "https://higgsfield.ai",
    officialDocumentation: "https://docs.higgsfield.ai",
    officialBlog: "https://higgsfield.ai/blog",
    officialYouTube: "https://www.youtube.com/@HiggsfieldAI",
    officialSocialLinks: {
      twitter: "https://x.com/higgsfield_ai",
      linkedin: "https://www.linkedin.com/company/higgsfield-ai",
      discord: "https://discord.gg/higgsfield",
      webApp: "https://cloud.higgsfield.ai",
      academy: "https://higgsfield.ai/academy"
    },
    modelsAndProducts: [
      {
        id: "prod-higgsfield-cinema-studio",
        name: "Higgsfield Cinema Studio (DoP 2.0)",
        version: "2.0",
        category: "VIDEO",
        description: "Specialized cinematic camera motion platform supporting physical lens focal lengths, kinetic camera trajectories, and DoP camera controls.",
        releaseDate: "2026-02-14",
        contextWindowOrDuration: "5s - 10s per generation",
        resolutionOrOutput: "1080p / 4K Upscale",
        commercialStatus: "FREEMIUM",
        officialDocsUrl: "https://docs.higgsfield.ai"
      },
      {
        id: "prod-higgsfield-character-studio",
        name: "Higgsfield Character Studio",
        version: "1.4",
        category: "PREVIS",
        description: "Consistent facial identity and wardrobe preservation across multi-shot narrative sequence generations.",
        releaseDate: "2025-11-20",
        contextWindowOrDuration: "Multi-prompt sequence memory",
        resolutionOrOutput: "1080p High-Bitrate ProRes/H.264",
        commercialStatus: "PAID",
        officialDocsUrl: "https://docs.higgsfield.ai"
      },
      {
        id: "prod-higgsfield-academy",
        name: "Higgsfield Academy",
        version: "2026",
        category: "PREVIS",
        description: "Official educational curriculum, cinema masterclasses, and director workflow training for AI filmmakers.",
        releaseDate: "2025-09-01",
        contextWindowOrDuration: "Interactive video courses",
        resolutionOrOutput: "Tutorial library & certified masterclasses",
        commercialStatus: "FREE",
        officialDocsUrl: "https://higgsfield.ai/academy"
      }
    ],
    relatedToolIds: ["tool-runway", "tool-kling", "tool-midjourney"],
    relatedTechniqueIds: [
      "tech-camera-motion-prompting",
      "tech-virtual-production-previs",
      "tech-optical-lens-distortion"
    ],
    relatedWorkflowIds: [
      "wf-ai-previs-animatic",
      "wf-cinematic-lookbook"
    ],
    relatedPromptIds: [
      "prompt-01-golden-hour",
      "prompt-04-neo-tokyo"
    ],
    relatedResearchIds: [
      "res-rectified-flow-matching-motion",
      "res-anamorphic-vs-spherical-optics"
    ],
    relatedJournalArticleIds: ["state-of-generative-video-2026"],
    sources: [
      {
        id: "src-hf-01",
        url: "https://higgsfield.ai",
        sourceType: "OFFICIAL_WEBSITE",
        publisher: "Higgsfield Inc.",
        title: "Higgsfield AI — The Video Creation Platform for Filmmakers",
        tier: 1,
        verificationStatus: "VERIFIED",
        dateDiscovered: "2025-06-10",
        lastVerifiedAt: "2026-09-10",
        notes: "Verified official landing portal and product specifications."
      },
      {
        id: "src-hf-02",
        url: "https://docs.higgsfield.ai",
        sourceType: "OFFICIAL_DOCUMENTATION",
        publisher: "Higgsfield Engineering",
        title: "Higgsfield Camera Motion & Generation API Documentation",
        tier: 1,
        verificationStatus: "VERIFIED",
        dateDiscovered: "2025-08-15",
        lastVerifiedAt: "2026-09-10",
        notes: "Verified API parameters and camera movement syntax."
      },
      {
        id: "src-hf-03",
        url: "https://higgsfield.ai/academy",
        sourceType: "OFFICIAL_TUTORIAL",
        publisher: "Higgsfield Academy",
        title: "Higgsfield Academy — Cinematic AI Filmmaking Masterclasses",
        tier: 1,
        verificationStatus: "VERIFIED",
        dateDiscovered: "2025-09-15",
        lastVerifiedAt: "2026-09-10",
        notes: "Verified official cinema tutorials and educational portal."
      }
    ],
    sourceIds: ["src-hf-01", "src-hf-02", "src-hf-03"],
    verificationStatus: "VERIFIED",
    confidence: "HIGH",
    visibility: "PUBLIC",
    lastVerifiedAt: "2026-09-10"
  },

  // =========================================================================
  // 2. RUNWAY
  // =========================================================================
  {
    id: "ai-runway",
    slug: "runway",
    name: "Runway",
    entityType: "PLATFORM",
    vendor: "Runway AI, Inc.",
    tagline: "Pioneering generative video research, Gen-3 Alpha, Act-One character performance, and cinematic toolsets.",
    description:
      "Runway is an applied AI research company advancing multi-modal generative video models for film, animation, and VFX. Known for Gen-3 Alpha, Act-One facial performance capture, Motion Brush, and the annual AI Film Festival (AIFF).",
    category: "VIDEO",
    secondaryCategories: ["VFX", "EDITING", "PREVIS", "AUDIO"],
    capabilities: [
      "Text-to-Video & Image-to-Video Synthesis",
      "Act-One Driving Performance & Expressive Facial Capture",
      "Motion Brush Directional Velocity Masking",
      "Camera Control Velocity Curves",
      "Gen-3 Alpha Turbo Real-time Rendering"
    ],
    productionStages: ["PRE_PRODUCTION", "PRODUCTION", "EDITORIAL", "VFX", "AI"],
    officialWebsite: "https://runway.com",
    officialDocumentation: "https://docs.runwayml.com",
    officialBlog: "https://runway.com/blog",
    officialYouTube: "https://www.youtube.com/@RunwayML",
    officialSocialLinks: {
      twitter: "https://x.com/runwayml",
      discord: "https://discord.gg/runwayml",
      linkedin: "https://www.linkedin.com/company/runwayml",
      webApp: "https://app.runwayml.com"
    },
    modelsAndProducts: [
      {
        id: "prod-gen3-alpha",
        name: "Gen-3 Alpha",
        version: "3.0",
        category: "VIDEO",
        description: "High temporal fidelity, photorealistic video diffusion foundation model with advanced cinematic camera control.",
        releaseDate: "2024-06-17",
        contextWindowOrDuration: "5s - 10s",
        resolutionOrOutput: "1080p / 4K Upscale",
        commercialStatus: "PAID",
        officialDocsUrl: "https://docs.runwayml.com/gen3-alpha"
      },
      {
        id: "prod-act-one",
        name: "Act-One",
        version: "1.0",
        category: "VFX",
        description: "Markerless expressive facial performance capture mapping camera-recorded actors onto stylized or photorealistic AI characters.",
        releaseDate: "2024-10-22",
        contextWindowOrDuration: "Performance video mapping",
        resolutionOrOutput: "1080p 24fps",
        commercialStatus: "PAID",
        officialDocsUrl: "https://docs.runwayml.com/act-one"
      }
    ],
    toolId: "tool-runway",
    relatedToolIds: ["tool-kling", "tool-luma", "tool-midjourney", "tool-after-effects"],
    relatedTechniqueIds: [
      "tech-camera-motion-prompting",
      "tech-rotoscoping-depth-matte",
      "tech-virtual-production-previs"
    ],
    relatedWorkflowIds: [
      "wf-ai-previs-animatic",
      "wf-cinematic-lookbook"
    ],
    relatedPromptIds: ["prompt-01-golden-hour", "prompt-02-rainy-night", "prompt-04-neo-tokyo"],
    relatedResearchIds: [
      "res-rectified-flow-matching-motion",
      "res-anamorphic-vs-spherical-optics"
    ],
    relatedJournalArticleIds: ["state-of-generative-video-2026", "flux-flow-matching-vs-midjourney-diffusion"],
    sources: [
      {
        id: "src-runway-01",
        url: "https://runway.com",
        sourceType: "OFFICIAL_WEBSITE",
        publisher: "Runway AI, Inc.",
        title: "Runway — Advancing Creativity with Artificial Intelligence",
        tier: 1,
        verificationStatus: "VERIFIED",
        dateDiscovered: "2024-01-01",
        lastVerifiedAt: "2026-09-10",
        notes: "Verified official homepage and product pricing tiers."
      },
      {
        id: "src-runway-02",
        url: "https://docs.runwayml.com",
        sourceType: "OFFICIAL_DOCUMENTATION",
        publisher: "Runway AI, Inc.",
        title: "Runway Knowledge Base & Developer Documentation",
        tier: 1,
        verificationStatus: "VERIFIED",
        dateDiscovered: "2024-01-01",
        lastVerifiedAt: "2026-09-10",
        notes: "Verified camera control coordinates and Gen-3 prompting guidelines."
      }
    ],
    sourceIds: ["src-runway-01", "src-runway-02"],
    verificationStatus: "VERIFIED",
    confidence: "HIGH",
    visibility: "PUBLIC",
    lastVerifiedAt: "2026-09-10"
  },

  // =========================================================================
  // 3. KLING AI
  // =========================================================================
  {
    id: "ai-kling",
    slug: "kling",
    name: "Kling AI",
    entityType: "PLATFORM",
    vendor: "Kuaishou Technology",
    tagline: "High-duration video diffusion models featuring physics simulation and 1080p fluid motion.",
    description:
      "Kling AI is a large-scale video foundation model developed by Kuaishou, celebrated for its 3D space-time joint attention architecture, realistic physics simulation (fluid dynamics, fabric collisions, lighting reflections), and native continuous generations up to 2 minutes with audio sync.",
    category: "VIDEO",
    secondaryCategories: ["PRODUCTION", "VFX"],
    capabilities: [
      "Long-Duration Video Generation (up to 2 minutes extended)",
      "3D Spatiotemporal Joint Attention Physics Simulation",
      "Motion Brush & Multi-Trajectory Tracking",
      "Lip-Sync & Native Acoustic Synchronization",
      "High Dynamic Range 1080p Rendering"
    ],
    productionStages: ["PRODUCTION", "VFX", "AI"],
    officialWebsite: "https://klingai.com",
    officialDocumentation: "https://klingai.com/help",
    officialBlog: "https://klingai.com/blog",
    officialSocialLinks: {
      twitter: "https://x.com/Kling_ai",
      discord: "https://discord.gg/klingai",
      webApp: "https://klingai.com"
    },
    modelsAndProducts: [
      {
        id: "prod-kling-1-5",
        name: "Kling 1.5 HD",
        version: "1.5",
        category: "VIDEO",
        description: "Upgraded video foundation model with enhanced physical realism, facial kinematics, and dynamic lighting accuracy.",
        releaseDate: "2024-09-20",
        contextWindowOrDuration: "5s - 10s per shot / up to 2m extend",
        resolutionOrOutput: "1080p HD 30fps",
        commercialStatus: "FREEMIUM",
        officialDocsUrl: "https://klingai.com/help"
      }
    ],
    toolId: "tool-kling",
    relatedToolIds: ["tool-runway", "tool-luma", "tool-midjourney"],
    relatedTechniqueIds: ["tech-camera-motion-prompting", "tech-volumetric-haze"],
    relatedWorkflowIds: ["wf-ai-previs-animatic"],
    relatedPromptIds: ["prompt-01-golden-hour", "prompt-02-rainy-night"],
    relatedResearchIds: ["res-rectified-flow-matching-motion"],
    relatedJournalArticleIds: ["state-of-generative-video-2026"],
    sources: [
      {
        id: "src-kling-01",
        url: "https://klingai.com",
        sourceType: "OFFICIAL_WEBSITE",
        publisher: "Kuaishou Technology",
        title: "Kling AI — Next-Generation AI Video Creation",
        tier: 1,
        verificationStatus: "VERIFIED",
        dateDiscovered: "2024-06-05",
        lastVerifiedAt: "2026-09-10",
        notes: "Verified official global web application portal (klingai.com / kling.ai)."
      }
    ],
    sourceIds: ["src-kling-01"],
    verificationStatus: "VERIFIED",
    confidence: "HIGH",
    visibility: "PUBLIC",
    lastVerifiedAt: "2026-09-10"
  },

  // =========================================================================
  // 4. LUMA AI
  // =========================================================================
  {
    id: "ai-luma",
    slug: "luma",
    name: "Luma AI",
    entityType: "COMPANY",
    vendor: "Luma AI, Inc.",
    tagline: "Dream Machine video synthesis, high-speed neural radiance fields (NeRF), and interactive 3D camera pathing.",
    description:
      "Luma AI is a visual intelligence research company building generative foundation models, bridging neural 3D scene reconstruction (NeRFs and Gaussian Splats) and high-temporal-coherence video generation through Dream Machine and the Ray 2 foundation architecture.",
    category: "VIDEO",
    secondaryCategories: ["VFX", "PREVIS"],
    capabilities: [
      "Dream Machine Fast Video Generation",
      "Camera Motion Keyframing & Pathing",
      "NeRF & 3D Gaussian Splatting Scene Capture",
      "High Temporal Coherence Transitions"
    ],
    productionStages: ["PRE_PRODUCTION", "PRODUCTION", "VFX", "AI"],
    officialWebsite: "https://lumalabs.ai",
    officialDocumentation: "https://lumalabs.ai/docs",
    officialBlog: "https://lumalabs.ai/blog",
    officialYouTube: "https://www.youtube.com/@LumaAI",
    officialSocialLinks: {
      twitter: "https://x.com/LumaLabsAI",
      discord: "https://discord.gg/lumalabs",
      webApp: "https://lumalabs.ai/dream-machine"
    },
    modelsAndProducts: [
      {
        id: "prod-dream-machine",
        name: "Dream Machine",
        version: "1.5",
        category: "VIDEO",
        description: "Flagship video foundation model developed by Luma AI, designed for creative world building and dynamic camera motion.",
        releaseDate: "2024-06-12",
        contextWindowOrDuration: "5s iterations",
        resolutionOrOutput: "1080p",
        commercialStatus: "FREEMIUM",
        officialDocsUrl: "https://lumalabs.ai/dream-machine"
      }
    ],
    toolId: "tool-luma",
    relatedToolIds: ["tool-runway", "tool-kling"],
    relatedTechniqueIds: ["tech-camera-motion-prompting", "tech-virtual-production-previs"],
    relatedWorkflowIds: ["wf-ai-previs-animatic"],
    relatedPromptIds: ["prompt-01-golden-hour", "prompt-03-lonely-apartment"],
    relatedResearchIds: ["res-rectified-flow-matching-motion"],
    sources: [
      {
        id: "src-luma-01",
        url: "https://lumalabs.ai",
        sourceType: "OFFICIAL_WEBSITE",
        publisher: "Luma AI, Inc.",
        title: "Luma AI — Dream Machine & 3D Intelligence",
        tier: 1,
        verificationStatus: "VERIFIED",
        dateDiscovered: "2024-06-12",
        lastVerifiedAt: "2026-09-10",
        notes: "Verified official web portal (Luma AI, Inc.)."
      }
    ],
    sourceIds: ["src-luma-01"],
    verificationStatus: "VERIFIED",
    confidence: "HIGH",
    visibility: "PUBLIC",
    lastVerifiedAt: "2026-09-10"
  },

  // =========================================================================
  // 5. GOOGLE VEO (DEEPMIND)
  // =========================================================================
  {
    id: "ai-google-veo",
    slug: "veo",
    name: "Google Veo",
    entityType: "MODEL",
    vendor: "Google DeepMind",
    tagline: "Google DeepMind's state-of-the-art cinematic generative video model.",
    description:
      "Veo is Google DeepMind's flagship generative video model capable of creating 1080p high-definition video across a wide variety of cinematic styles. It exhibits deep comprehension of film terminology such as timelapse, aerial shots, and depth of field.",
    category: "VIDEO",
    secondaryCategories: ["RESEARCH", "PRODUCTION"],
    capabilities: [
      "High-Definition 1080p Video Generation",
      "Cinematic Directorial Prompt Comprehension",
      "Visual Consistency & Temporal Coherence",
      "Masked Video Editing & Outpainting"
    ],
    productionStages: ["PRODUCTION", "AI", "RESEARCH"],
    officialWebsite: "https://deepmind.google/technologies/veo",
    officialDocumentation: "https://cloud.google.com/vertex-ai/generative-ai/docs/video",
    officialBlog: "https://blog.google/technology/ai/google-veo-video-generation-model",
    officialYouTube: "https://www.youtube.com/@GoogleDeepMind",
    modelsAndProducts: [
      {
        id: "prod-veo-2",
        name: "Veo 2",
        version: "2.0",
        category: "VIDEO",
        description: "Next-generation video foundation model with enhanced prompt adherence and extended cinematic control.",
        releaseDate: "2024-12-11",
        contextWindowOrDuration: "Up to 60s clips",
        resolutionOrOutput: "1080p / 4K Ready",
        commercialStatus: "RESEARCH_PREVIEW",
        officialDocsUrl: "https://deepmind.google/technologies/veo/veo-2"
      }
    ],
    relatedToolIds: ["tool-runway", "tool-sora"],
    relatedTechniqueIds: ["tech-camera-motion-prompting", "tech-optical-lens-distortion"],
    relatedResearchIds: ["res-rectified-flow-matching-motion"],
    sources: [
      {
        id: "src-veo-01",
        url: "https://deepmind.google/technologies/veo",
        sourceType: "OFFICIAL_WEBSITE",
        publisher: "Google DeepMind",
        title: "Veo — Google DeepMind Video Generation",
        tier: 1,
        verificationStatus: "VERIFIED",
        dateDiscovered: "2024-05-14",
        lastVerifiedAt: "2026-09-10",
        notes: "Verified official Google DeepMind research release."
      }
    ],
    sourceIds: ["src-veo-01"],
    verificationStatus: "VERIFIED",
    confidence: "HIGH",
    visibility: "PUBLIC",
    lastVerifiedAt: "2026-09-10"
  },

  // =========================================================================
  // 6. OPENAI SORA
  // =========================================================================
  {
    id: "ai-openai-sora",
    slug: "sora",
    name: "OpenAI Sora",
    entityType: "MODEL",
    vendor: "OpenAI",
    tagline: "World-simulator video diffusion transformer generating complex spatiotemporal scenes.",
    description:
      "Sora is a diffusion transformer model developed by OpenAI that generates videos from text instructions up to a minute long while maintaining high visual quality and adherence to physical world dynamics.",
    category: "VIDEO",
    secondaryCategories: ["RESEARCH", "PRODUCTION"],
    capabilities: [
      "Up to 60-second Continuous Video Generation",
      "World Simulation & Physics Modeling",
      "Complex Multi-Character Scene Composition",
      "Temporal & Identity Memory Across Frames"
    ],
    productionStages: ["PRE_PRODUCTION", "PRODUCTION", "AI"],
    officialWebsite: "https://openai.com/sora",
    officialDocumentation: "https://platform.openai.com/docs/guides/video-generation",
    officialBlog: "https://openai.com/index/sora",
    officialYouTube: "https://www.youtube.com/@OpenAI",
    officialSocialLinks: {
      twitter: "https://x.com/OpenAI"
    },
    modelsAndProducts: [
      {
        id: "prod-sora-turbo",
        name: "Sora Turbo",
        version: "1.0",
        category: "VIDEO",
        description: "Commercial video generation model with rapid turnaround times for creative directors.",
        releaseDate: "2024-12-09",
        contextWindowOrDuration: "Up to 20s per prompt",
        resolutionOrOutput: "1080p Widescreen & Vertical",
        commercialStatus: "PAID",
        officialDocsUrl: "https://openai.com/sora"
      }
    ],
    relatedToolIds: ["tool-runway", "tool-kling"],
    relatedTechniqueIds: ["tech-camera-motion-prompting", "tech-virtual-production-previs"],
    relatedResearchIds: ["res-rectified-flow-matching-motion"],
    sources: [
      {
        id: "src-sora-01",
        url: "https://openai.com/sora",
        sourceType: "OFFICIAL_WEBSITE",
        publisher: "OpenAI",
        title: "Sora: Creating Video from Text",
        tier: 1,
        verificationStatus: "VERIFIED",
        dateDiscovered: "2024-02-15",
        lastVerifiedAt: "2026-09-10",
        notes: "Verified official OpenAI research paper and portal."
      }
    ],
    sourceIds: ["src-sora-01"],
    verificationStatus: "VERIFIED",
    confidence: "HIGH",
    visibility: "PUBLIC",
    lastVerifiedAt: "2026-09-10"
  },

  // =========================================================================
  // 7. MIDJOURNEY
  // =========================================================================
  {
    id: "ai-midjourney",
    slug: "midjourney",
    name: "Midjourney",
    entityType: "TOOL",
    vendor: "Midjourney, Inc.",
    tagline: "Industry-standard aesthetic image synthesis engine for lookbooks, styleframes, and concept art.",
    description:
      "Midjourney is an independent research lab producing the premier aesthetic image generation system for filmmakers and concept artists. Renowned for its rich optical lighting nuances, lens simulation, and texture rendering.",
    category: "IMAGE",
    secondaryCategories: ["PREVIS", "VFX"],
    capabilities: [
      "Photorealistic & Painterly Styleframes",
      "Character Reference (--cref) Consistency",
      "Style Reference (--sref) Transfer",
      "Vary (Region) Inpainting & Pan Outpainting",
      "Parameter Control (--ar, --stylize, --chaos, --weird)"
    ],
    productionStages: ["PRE_PRODUCTION", "VFX", "AI"],
    officialWebsite: "https://midjourney.com",
    officialDocumentation: "https://docs.midjourney.com",
    officialBlog: "https://midjourney.com/blog",
    officialSocialLinks: {
      twitter: "https://x.com/midjourney",
      discord: "https://discord.gg/midjourney"
    },
    modelsAndProducts: [
      {
        id: "prod-mj-v6-1",
        name: "Midjourney v6.1",
        version: "6.1",
        category: "IMAGE",
        description: "Refined aesthetic foundation model with enhanced photorealism, fine text rendering, and accurate lighting falloff.",
        releaseDate: "2024-07-30",
        contextWindowOrDuration: "Instant text-to-image",
        resolutionOrOutput: "Up to 4K Upscale (2048x2048 native grid)",
        commercialStatus: "PAID",
        officialDocsUrl: "https://docs.midjourney.com/docs/models"
      }
    ],
    toolId: "tool-midjourney",
    relatedToolIds: ["tool-flux", "tool-runway", "tool-photoshop"],
    relatedTechniqueIds: [
      "tech-chiaroscuro-lighting",
      "tech-anamorphic-lens-optics",
      "tech-volumetric-haze"
    ],
    relatedWorkflowIds: ["wf-cinematic-lookbook", "wf-ai-previs-animatic"],
    relatedPromptIds: ["prompt-01-golden-hour", "prompt-02-rainy-night", "prompt-03-lonely-apartment"],
    relatedResearchIds: [
      "res-anamorphic-vs-spherical-optics",
      "res-rectified-flow-matching-motion"
    ],
    relatedJournalArticleIds: ["flux-flow-matching-vs-midjourney-diffusion"],
    sources: [
      {
        id: "src-mj-01",
        url: "https://docs.midjourney.com",
        sourceType: "OFFICIAL_DOCUMENTATION",
        publisher: "Midjourney, Inc.",
        title: "Midjourney Official User Guide & Parameters Reference",
        tier: 1,
        verificationStatus: "VERIFIED",
        dateDiscovered: "2023-01-15",
        lastVerifiedAt: "2026-09-10",
        notes: "Verified official parameter syntax and guidelines."
      }
    ],
    sourceIds: ["src-mj-01"],
    verificationStatus: "VERIFIED",
    confidence: "HIGH",
    visibility: "PUBLIC",
    lastVerifiedAt: "2026-09-10"
  },

  // =========================================================================
  // 8. BLACK FOREST LABS (FLUX)
  // =========================================================================
  {
    id: "ai-bfl-flux",
    slug: "flux",
    name: "FLUX (Black Forest Labs)",
    entityType: "MODEL",
    vendor: "Black Forest Labs GmbH",
    tagline: "12B parameter rectified flow transformer for photorealism, typography, and prompt adherence.",
    description:
      "FLUX is an open and commercial suite of 12-billion parameter flow-matching models created by the original Stable Diffusion inventors at Black Forest Labs. It sets the open benchmark for visual anatomy, text rendering, and cinematic optical prompt execution.",
    category: "IMAGE",
    secondaryCategories: ["RESEARCH", "PREVIS", "VFX"],
    capabilities: [
      "12B Parameter Hybrid Flow Transformer Architecture",
      "Rotary Positional Embeddings & Parallel Attention",
      "In-Context Fill, Depth & Canny Inpainting Control",
      "State-of-the-Art Typography & Finger Anatomy"
    ],
    productionStages: ["PRE_PRODUCTION", "VFX", "AI", "RESEARCH"],
    officialWebsite: "https://blackforestlabs.ai",
    officialDocumentation: "https://docs.bfl.ml",
    officialBlog: "https://blackforestlabs.ai/blog",
    officialSocialLinks: {
      twitter: "https://x.com/bfl_ml",
      github: "https://github.com/black-forest-labs/flux"
    },
    modelsAndProducts: [
      {
        id: "prod-flux-pro",
        name: "FLUX.1 [pro]",
        version: "1.0",
        category: "IMAGE",
        description: "State-of-the-art enterprise image generation API with extreme prompt fidelity and nuanced cinematic grain texture.",
        releaseDate: "2024-08-01",
        contextWindowOrDuration: "API Generation",
        resolutionOrOutput: "Up to 2.0 MegaPixels",
        commercialStatus: "API_ONLY",
        officialDocsUrl: "https://docs.bfl.ml"
      },
      {
        id: "prod-flux-dev",
        name: "FLUX.1 [dev]",
        version: "1.0",
        category: "IMAGE",
        description: "Open-weights non-commercial model for local pipeline experimentation and fine-tuning (LoRA / ControlNet).",
        releaseDate: "2024-08-01",
        contextWindowOrDuration: "Local PyTorch inference",
        resolutionOrOutput: "Flexible resolution",
        commercialStatus: "OPEN_SOURCE",
        officialDocsUrl: "https://github.com/black-forest-labs/flux"
      }
    ],
    relatedToolIds: ["tool-midjourney", "tool-comfyui"],
    relatedTechniqueIds: ["tech-chiaroscuro-lighting", "tech-optical-lens-distortion"],
    relatedWorkflowIds: ["wf-cinematic-lookbook"],
    relatedResearchIds: [
      "res-rectified-flow-matching-motion",
      "res-anamorphic-vs-spherical-optics"
    ],
    relatedJournalArticleIds: ["flux-flow-matching-vs-midjourney-diffusion"],
    sources: [
      {
        id: "src-bfl-01",
        url: "https://blackforestlabs.ai",
        sourceType: "OFFICIAL_WEBSITE",
        publisher: "Black Forest Labs GmbH",
        title: "Black Forest Labs — Announcing FLUX.1",
        tier: 1,
        verificationStatus: "VERIFIED",
        dateDiscovered: "2024-08-01",
        lastVerifiedAt: "2026-09-10",
        notes: "Verified official company announcement and model benchmarks."
      }
    ],
    sourceIds: ["src-bfl-01"],
    verificationStatus: "VERIFIED",
    confidence: "HIGH",
    visibility: "PUBLIC",
    lastVerifiedAt: "2026-09-10"
  },

  // =========================================================================
  // 9. ELEVENLABS
  // =========================================================================
  {
    id: "ai-elevenlabs",
    slug: "elevenlabs",
    name: "ElevenLabs",
    entityType: "PLATFORM",
    vendor: "ElevenLabs Inc.",
    tagline: "Natural voice synthesis, cinematic sound effects generation, and multilingual dubbing.",
    description:
      "ElevenLabs is an AI audio research and deployment platform producing voice cloning, dynamic voice design, foley sound effects, and automated theatrical dubbing for filmmakers, game designers, and content producers.",
    category: "AUDIO",
    secondaryCategories: ["PRODUCTION", "POST", "VFX"],
    capabilities: [
      "Emotional Tone & Cadence Voice Synthesis",
      "Text-to-Sound Effects (Foley, Environmental Atmospheres)",
      "Automated Lip-Sync Multilingual Dubbing",
      "Voice Isolator & Noise Reduction Studio"
    ],
    productionStages: ["PRE_PRODUCTION", "PRODUCTION", "SOUND", "AI"],
    officialWebsite: "https://elevenlabs.io",
    officialDocumentation: "https://elevenlabs.io/docs",
    officialBlog: "https://elevenlabs.io/blog",
    officialYouTube: "https://www.youtube.com/@elevenlabsio",
    officialSocialLinks: {
      twitter: "https://x.com/elevenlabsio",
      discord: "https://discord.gg/elevenlabs"
    },
    modelsAndProducts: [
      {
        id: "prod-eleven-sound-fx",
        name: "ElevenLabs Sound Effects",
        version: "1.0",
        category: "AUDIO",
        description: "Prompt-driven cinematic foley, impact sounds, and environmental audio beds.",
        releaseDate: "2024-05-22",
        contextWindowOrDuration: "Up to 22s audio clips",
        resolutionOrOutput: "44.1kHz WAV / MP3",
        commercialStatus: "FREEMIUM",
        officialDocsUrl: "https://elevenlabs.io/docs/sound-effects"
      }
    ],
    toolId: "tool-elevenlabs",
    relatedToolIds: ["tool-suno", "tool-davinci-resolve"],
    relatedTechniqueIds: ["tech-binaural-sound-design"],
    relatedWorkflowIds: ["wf-dci-dcp-mastering"],
    sources: [
      {
        id: "src-el-01",
        url: "https://elevenlabs.io",
        sourceType: "OFFICIAL_WEBSITE",
        publisher: "ElevenLabs Inc.",
        title: "ElevenLabs — Voice & Audio AI Platform",
        tier: 1,
        verificationStatus: "VERIFIED",
        dateDiscovered: "2023-05-10",
        lastVerifiedAt: "2026-09-10",
        notes: "Verified official homepage."
      }
    ],
    sourceIds: ["src-el-01"],
    verificationStatus: "VERIFIED",
    confidence: "HIGH",
    visibility: "PUBLIC",
    lastVerifiedAt: "2026-09-10"
  },

  // =========================================================================
  // 10. SUNO
  // =========================================================================
  {
    id: "ai-suno",
    slug: "suno",
    name: "Suno",
    entityType: "PLATFORM",
    vendor: "Suno, Inc.",
    tagline: "Generative music system creating full orchestral scores, vocals, and genre compositions.",
    description:
      "Suno is a generative music platform that enables creators to produce original musical compositions, orchestral cues, and cinematic atmospheres from simple text prompts and style references.",
    category: "AUDIO",
    secondaryCategories: ["PRODUCTION", "POST"],
    capabilities: [
      "Text-to-Music Orchestral & Cinematic Score Synthesis",
      "Audio Input Style Transfer & Continuation",
      "Multi-Track Sectional Extensions & Stems"
    ],
    productionStages: ["PRE_PRODUCTION", "SOUND", "AI"],
    officialWebsite: "https://suno.com",
    officialDocumentation: "https://suno.com/help",
    officialBlog: "https://suno.com/blog",
    officialSocialLinks: {
      twitter: "https://x.com/suno_ai_",
      discord: "https://discord.gg/suno"
    },
    modelsAndProducts: [
      {
        id: "prod-suno-v4",
        name: "Suno v4",
        version: "4.0",
        category: "AUDIO",
        description: "Enhanced dynamic range music model with cleaner separation between orchestral instrumentation and vocal melodies.",
        releaseDate: "2024-11-20",
        contextWindowOrDuration: "Up to 4m full songs",
        resolutionOrOutput: "High-Bitrate Stereo Audio",
        commercialStatus: "FREEMIUM",
        officialDocsUrl: "https://suno.com/docs"
      }
    ],
    toolId: "tool-suno",
    relatedToolIds: ["tool-elevenlabs", "tool-udio"],
    relatedWorkflowIds: ["wf-dci-dcp-mastering"],
    sources: [
      {
        id: "src-suno-01",
        url: "https://suno.com",
        sourceType: "OFFICIAL_WEBSITE",
        publisher: "Suno, Inc.",
        title: "Suno — Make Any Song You Can Imagine",
        tier: 1,
        verificationStatus: "VERIFIED",
        dateDiscovered: "2023-12-01",
        lastVerifiedAt: "2026-09-10",
        notes: "Verified official music portal."
      }
    ],
    sourceIds: ["src-suno-01"],
    verificationStatus: "VERIFIED",
    confidence: "HIGH",
    visibility: "PUBLIC",
    lastVerifiedAt: "2026-09-10"
  },

  // =========================================================================
  // 11. ADOBE FIREFLY
  // =========================================================================
  {
    id: "ai-adobe-firefly",
    slug: "adobe-firefly",
    name: "Adobe Firefly",
    entityType: "TOOL",
    vendor: "Adobe Inc.",
    tagline: "Commercially safe generative video and image models integrated directly into Premiere Pro and Photoshop.",
    description:
      "Adobe Firefly is Adobe's suite of creative generative models trained on licensed content (Adobe Stock and public domain). It provides native Generative Extend in Premiere Pro, Generative Fill in Photoshop, and Firefly Video generation.",
    category: "VIDEO",
    secondaryCategories: ["IMAGE", "EDITING", "VFX"],
    capabilities: [
      "Premiere Pro Generative Extend (Audio & Video Frame Padding)",
      "Photoshop Generative Fill & Expand",
      "Commercially Indemnified Training Dataset Provenance",
      "Camera Angle & Motion Angle Conditioning"
    ],
    productionStages: ["PRE_PRODUCTION", "EDITORIAL", "VFX", "AI"],
    officialWebsite: "https://firefly.adobe.com",
    officialDocumentation: "https://helpx.adobe.com/firefly/using/firefly-overview.html",
    officialBlog: "https://blog.adobe.com/en/topics/generative-ai",
    officialYouTube: "https://www.youtube.com/@AdobeCreativeCloud",
    modelsAndProducts: [
      {
        id: "prod-firefly-video",
        name: "Firefly Video Model",
        version: "1.0",
        category: "VIDEO",
        description: "Commercially safe video model integrated into Premiere Pro for seamless shot extensions and b-roll generation.",
        releaseDate: "2024-10-14",
        contextWindowOrDuration: "Up to 5s extend",
        resolutionOrOutput: "1080p 24/30fps",
        commercialStatus: "PAID",
        officialDocsUrl: "https://helpx.adobe.com/premiere-pro/using/generative-extend.html"
      }
    ],
    toolId: "tool-firefly",
    relatedToolIds: ["tool-premiere", "tool-photoshop", "tool-after-effects"],
    relatedTechniqueIds: ["tech-virtual-production-previs"],
    relatedWorkflowIds: ["wf-cinematic-lookbook"],
    sources: [
      {
        id: "src-firefly-01",
        url: "https://firefly.adobe.com",
        sourceType: "OFFICIAL_WEBSITE",
        publisher: "Adobe Inc.",
        title: "Adobe Firefly — Generative AI for Creative Workflows",
        tier: 1,
        verificationStatus: "VERIFIED",
        dateDiscovered: "2023-03-21",
        lastVerifiedAt: "2026-09-10",
        notes: "Verified official Adobe Firefly portal."
      }
    ],
    sourceIds: ["src-firefly-01"],
    verificationStatus: "VERIFIED",
    confidence: "HIGH",
    visibility: "PUBLIC",
    lastVerifiedAt: "2026-09-10"
  },

  // =========================================================================
  // 12. PIKA
  // =========================================================================
  {
    id: "ai-pika",
    slug: "pika",
    name: "Pika",
    entityType: "TOOL",
    vendor: "Pika Labs Inc.",
    tagline: "Idea-to-video platform with physics modifiers, sound effects sync, and creative camera controls.",
    description:
      "Pika is an AI video platform developed by Pika Labs that enables filmmakers to animate static shots, apply physics-defying scene modifiers (e.g. Pikaffects), expand canvases, and control camera pans and zooms.",
    category: "VIDEO",
    secondaryCategories: ["VFX", "PREVIS"],
    capabilities: [
      "Image-to-Video & Text-to-Video Animation",
      "Pikaffects Physics Modifiers (Melt, Explode, Inflate, Crumble)",
      "Sound FX Sync & Voice Lip-Sync",
      "Canvas Outpainting & Region Modify"
    ],
    productionStages: ["PRE_PRODUCTION", "VFX", "AI"],
    officialWebsite: "https://pika.art",
    officialDocumentation: "https://pika.art/help",
    officialSocialLinks: {
      twitter: "https://x.com/pika_labs",
      discord: "https://discord.gg/pika"
    },
    modelsAndProducts: [
      {
        id: "prod-pika-2",
        name: "Pika 2.0",
        version: "2.0",
        category: "VIDEO",
        description: "Fast creative video generation engine with real-time physics deformation effects.",
        releaseDate: "2024-10-01",
        contextWindowOrDuration: "3s - 5s iterations",
        resolutionOrOutput: "1080p 24fps",
        commercialStatus: "FREEMIUM",
        officialDocsUrl: "https://pika.art"
      }
    ],
    toolId: "tool-pika",
    relatedToolIds: ["tool-runway", "tool-kling"],
    relatedTechniqueIds: ["tech-camera-motion-prompting"],
    relatedWorkflowIds: ["wf-ai-previs-animatic"],
    sources: [
      {
        id: "src-pika-01",
        url: "https://pika.art",
        sourceType: "OFFICIAL_WEBSITE",
        publisher: "Pika Labs Inc.",
        title: "Pika — Idea to Video Platform",
        tier: 1,
        verificationStatus: "VERIFIED",
        dateDiscovered: "2023-11-28",
        lastVerifiedAt: "2026-09-10",
        notes: "Verified official web application."
      }
    ],
    sourceIds: ["src-pika-01"],
    verificationStatus: "VERIFIED",
    confidence: "HIGH",
    visibility: "PUBLIC",
    lastVerifiedAt: "2026-09-10"
  },

  // =========================================================================
  // 13. COMFYUI
  // =========================================================================
  {
    id: "ai-comfyui",
    slug: "comfyui",
    name: "ComfyUI",
    entityType: "PLATFORM",
    vendor: "Comfy Org / Open Source",
    tagline: "Node-based graph execution engine for local diffusion, LoRA stacking, and visual pipeline engineering.",
    description:
      "ComfyUI is the definitive node-based visual interface and backend execution engine for Stable Diffusion, FLUX, and video models. It gives technical directors complete modular control over latent sampling, ControlNets, and multi-model pipelines.",
    category: "PRODUCTION",
    secondaryCategories: ["IMAGE", "VIDEO", "VFX", "RESEARCH"],
    capabilities: [
      "Modular Node-Based Latent Graph Execution",
      "Multi-Model Stacking (FLUX + ControlNet + IP-Adapter)",
      "High-Performance Local VRAM Memory Management",
      "Custom Python Extension Node Architecture"
    ],
    productionStages: ["PRE_PRODUCTION", "PRODUCTION", "VFX", "AI"],
    officialWebsite: "https://comfy.org",
    officialDocumentation: "https://docs.comfy.org",
    officialBlog: "https://blog.comfy.org",
    officialSocialLinks: {
      github: "https://github.com/comfyanonymous/ComfyUI",
      discord: "https://discord.gg/comfyorg"
    },
    modelsAndProducts: [
      {
        id: "prod-comfyui-core",
        name: "ComfyUI Core Engine",
        version: "0.3.0",
        category: "PRODUCTION",
        description: "Local execution runtime for flow-matching and diffusion inference graphs.",
        releaseDate: "2023-01-10",
        contextWindowOrDuration: "Hardware dependent",
        resolutionOrOutput: "Arbitrary resolution / uncompressed",
        commercialStatus: "OPEN_SOURCE",
        officialDocsUrl: "https://docs.comfy.org"
      }
    ],
    relatedToolIds: ["tool-flux", "tool-midjourney", "tool-blender"],
    relatedTechniqueIds: ["tech-optical-lens-distortion", "tech-virtual-production-previs"],
    relatedWorkflowIds: ["wf-ai-previs-animatic", "wf-cinematic-lookbook"],
    sources: [
      {
        id: "src-comfy-01",
        url: "https://comfy.org",
        sourceType: "OFFICIAL_WEBSITE",
        publisher: "Comfy Org",
        title: "ComfyUI — Modular Generative Graph Interface",
        tier: 1,
        verificationStatus: "VERIFIED",
        dateDiscovered: "2023-03-01",
        lastVerifiedAt: "2026-09-10",
        notes: "Verified official organization portal and GitHub repository."
      }
    ],
    sourceIds: ["src-comfy-01"],
    verificationStatus: "VERIFIED",
    confidence: "HIGH",
    visibility: "PUBLIC",
    lastVerifiedAt: "2026-09-10"
  },

  // =========================================================================
  // 14. TOPAZ LABS
  // =========================================================================
  {
    id: "ai-topaz",
    slug: "topaz",
    name: "Topaz Video AI",
    entityType: "TOOL",
    vendor: "Topaz Labs LLC",
    tagline: "Neural video enhancement, motion deblurring, temporal frame interpolation, and 4K/8K upscaling.",
    description:
      "Topaz Video AI is the production-standard neural upscaling and frame interpolation suite used by studios and filmmakers to restore archival footage, remove compression artifacts, interpolate 24fps to 60fps/120fps, and upscale AI-generated video to theatrical 4K DCP resolution.",
    category: "VFX",
    secondaryCategories: ["EDITING", "PRODUCTION"],
    capabilities: [
      "4K / 8K Neural Super-Resolution Upscaling (Iris, Proteus, Rhea)",
      "Temporal Frame Rate Interpolation (Chronos, Aion)",
      "Motion Artifact & Compression Deblur",
      "Grain Injection & Sensor Noise Emulation"
    ],
    productionStages: ["EDITORIAL", "COLOR", "VFX", "AI", "DELIVERY"],
    officialWebsite: "https://www.topazlabs.com",
    officialDocumentation: "https://docs.topazlabs.com/video-ai",
    officialBlog: "https://www.topazlabs.com/blog",
    officialYouTube: "https://www.youtube.com/@TopazLabs",
    modelsAndProducts: [
      {
        id: "prod-topaz-video-5",
        name: "Topaz Video AI 5",
        version: "5.3",
        category: "VFX",
        description: "Studio-grade offline neural processing engine with local multi-GPU acceleration.",
        releaseDate: "2024-05-15",
        contextWindowOrDuration: "Full-length feature timeline export",
        resolutionOrOutput: "Up to 8K DCI ProRes 4444 / DNxHR",
        commercialStatus: "PAID",
        officialDocsUrl: "https://docs.topazlabs.com/video-ai"
      }
    ],
    toolId: "tool-topaz",
    relatedToolIds: ["tool-davinci-resolve", "tool-premiere", "tool-dcp-o-matic"],
    relatedTechniqueIds: ["tech-optical-lens-distortion"],
    relatedWorkflowIds: ["wf-dci-dcp-mastering"],
    relatedResearchIds: ["res-dci-dcp-mastering-standards"],
    sources: [
      {
        id: "src-topaz-01",
        url: "https://www.topazlabs.com",
        sourceType: "OFFICIAL_WEBSITE",
        publisher: "Topaz Labs LLC",
        title: "Topaz Labs — AI Video & Photo Enhancement",
        tier: 1,
        verificationStatus: "VERIFIED",
        dateDiscovered: "2022-01-10",
        lastVerifiedAt: "2026-09-10",
        notes: "Verified official product page."
      }
    ],
    sourceIds: ["src-topaz-01"],
    verificationStatus: "VERIFIED",
    confidence: "HIGH",
    visibility: "PUBLIC",
    lastVerifiedAt: "2026-09-10"
  },

  // =========================================================================
  // 15. BLACKMAGIC DAVINCI RESOLVE AI (NEURAL ENGINE)
  // =========================================================================
  {
    id: "ai-davinci-resolve-ai",
    slug: "davinci-resolve-ai",
    name: "DaVinci Resolve Neural Engine",
    entityType: "TOOL",
    vendor: "Blackmagic Design Pty. Ltd.",
    tagline: "Post-production studio suite featuring AI Magic Mask, UltraNR, Voice Isolation, and scene classification.",
    description:
      "DaVinci Resolve Studio integrates the DaVinci Neural Engine, delivering state-of-the-art machine learning tools directly into the color grading, editing, Fairlight audio, and Fusion VFX timelines without cloud round-tripping.",
    category: "EDITING",
    secondaryCategories: ["COLOR", "AUDIO", "VFX"],
    capabilities: [
      "Magic Mask 2.0 (Intelligent Character, Clothing & Object Tracking)",
      "UltraNR AI Temporal & Spatial Video Denoising",
      "IntelliTrack AI Point & Surface Motion Tracking",
      "Fairlight Voice Isolation & Dialogue Leveler",
      "Smart Reframe & Speed Warp Optical Flow"
    ],
    productionStages: ["EDITORIAL", "COLOR", "SOUND", "VFX", "DELIVERY"],
    officialWebsite: "https://www.blackmagicdesign.com/products/davinciresolve",
    officialDocumentation: "https://www.blackmagicdesign.com/support",
    officialBlog: "https://www.blackmagicdesign.com/media/release",
    officialYouTube: "https://www.youtube.com/@BlackmagicDesignOfficial",
    modelsAndProducts: [
      {
        id: "prod-resolve-19",
        name: "DaVinci Resolve Studio 19",
        version: "19.0",
        category: "COLOR",
        description: "Complete post-production suite with advanced Neural Engine machine learning acceleration.",
        releaseDate: "2024-08-20",
        contextWindowOrDuration: "Infinite timeline support",
        resolutionOrOutput: "Up to 32K DCI / ACES Color Managed",
        commercialStatus: "PAID",
        officialDocsUrl: "https://www.blackmagicdesign.com/products/davinciresolve"
      }
    ],
    toolId: "tool-davinci-resolve",
    relatedToolIds: ["tool-topaz", "tool-premiere", "tool-dcp-o-matic"],
    relatedTechniqueIds: [
      "tech-bleach-bypass-grading",
      "tech-binaural-sound-design",
      "tech-rotoscoping-depth-matte"
    ],
    relatedWorkflowIds: ["wf-dci-dcp-mastering"],
    relatedResearchIds: ["res-dci-dcp-mastering-standards"],
    sources: [
      {
        id: "src-resolve-01",
        url: "https://www.blackmagicdesign.com/products/davinciresolve",
        sourceType: "OFFICIAL_WEBSITE",
        publisher: "Blackmagic Design",
        title: "DaVinci Resolve 19 — Post Production",
        tier: 1,
        verificationStatus: "VERIFIED",
        dateDiscovered: "2024-04-12",
        lastVerifiedAt: "2026-09-10",
        notes: "Verified official product specifications."
      }
    ],
    sourceIds: ["src-resolve-01"],
    verificationStatus: "VERIFIED",
    confidence: "HIGH",
    visibility: "PUBLIC",
    lastVerifiedAt: "2026-09-10"
  }
];

// Helper query functions
export function getAllAIEntities(): AIEntity[] {
  return canonicalAIEntities;
}

export function getAIEntityBySlug(slug: string): AIEntity | undefined {
  return canonicalAIEntities.find((e) => e.slug.toLowerCase() === slug.toLowerCase());
}

export function getAIEntityById(id: string): AIEntity | undefined {
  return canonicalAIEntities.find((e) => e.id === id);
}
