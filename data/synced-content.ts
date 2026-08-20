export interface SyncedMediaArticle {
  id: string;
  slug: string;
  title: string;
  category: "Video Generation" | "Prompt Engineering" | "Post-Production" | "Workflows";
  author: string;
  publishedDate: string;
  readTime: string;
  summary: string;
  primaryToolId: string; // Links directly to tool dossier
  embeddedVideoUrl: string; // Verified cinematic preview / masterclass
  relatedPromptRecipe: {
    title: string;
    prompt: string;
  };
  keyTakeaways: string[];
}

export const SYNCED_MASTER_CONTENT: SyncedMediaArticle[] = [
  {
    id: "art-of-camera-motion",
    slug: "mastering-camera-motion-runway-kling",
    title: "Mastering Multi-Axis Camera Motion in Runway Gen-3 & Kling 2.0",
    category: "Video Generation",
    author: "Amusemac Studio Editorial",
    publishedDate: "August 2026",
    readTime: "6 min read",
    summary: "A definitive breakdown of Cartesian coordinate camera controls, preventing warping, and executing clean Russian arm tracking shots.",
    primaryToolId: "runway",
    embeddedVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-code-31940-large.mp4",
    relatedPromptRecipe: {
      title: "High-Speed Automotive Tracking Shot",
      prompt: "Low-angle Russian arm camera tracking matte-carbon supercar accelerating along a wet coastal highway during twilight --ar 2.39:1 --motion 6"
    },
    keyTakeaways: [
      "Always lock character identity using IP-Adapter or character reference tokens before adding camera movement.",
      "Keep Z-speed motion values between 3 and 6 to prevent background tearing.",
      "Combine text prompts with physical lens terminology (e.g., 35mm anamorphic) for accurate optical rendering."
    ]
  },
  {
    id: "character-consistency-pipeline",
    slug: "achieving-character-consistency-comfyui-flux",
    title: "The Production Blueprint: Character Consistency Across Multi-Shot AI Sequences",
    category: "Workflows",
    author: "Amusemac Studio Editorial",
    publishedDate: "August 2026",
    readTime: "8 min read",
    summary: "How to bypass single-frame drift by pairing FLUX.1 Pro with ComfyUI IP-Adapter nodes for seamless narrative storytelling.",
    primaryToolId: "comfyui",
    embeddedVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-green-screen-41582-large.mp4",
    relatedPromptRecipe: {
      title: "Narrative Close-Up Character Anchor",
      prompt: "Cinematic portrait of 30yo detective, extreme close-up, dramatic rim lighting, film grain --ar 16:9 --cref reference_id"
    },
    keyTakeaways: [
      "Establish a neutral studio reference image before placing characters into complex lighting environments.",
      "Use ComfyUI node workflows to isolate facial identity weights from background generation.",
      "Pair generated clips with Topaz Video AI to remove micro-jitter between frame cuts."
    ]
  },
  {
    id: "high-fidelity-fluid-physics",
    slug: "simulating-fluid-physics-kling-1-5",
    title: "Hydrodynamics & Particle Dynamics in Kling AI 1.5 Spatio-Temporal Model",
    category: "Video Generation",
    author: "Amusemac Studio Editorial",
    publishedDate: "August 2026",
    readTime: "7 min read",
    summary: "How Kling's 3D Spatio-Temporal Attention model simulates fluid mass, momentum, and droplet refraction in luxury beverage commercial shots.",
    primaryToolId: "kling",
    embeddedVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-code-31940-large.mp4",
    relatedPromptRecipe: {
      title: "Tabletop Beverage Splash Keyframe",
      prompt: "High-speed 1000fps macro shot of ice cube dropping into crystal glass of amber bourbon, splash droplets suspended in air, backlit studio rim light, 4k 24fps"
    },
    keyTakeaways: [
      "Specify high frame rate intent (e.g., '1000fps slow motion') in text conditioning to enforce fluid viscosity.",
      "Use Kling's Pro 10s mode to avoid abrupt ending loops on splash arcs.",
      "Bring footage into DaVinci Resolve Studio 19 for temporal de-noising and ACES Rec.709 color balance."
    ]
  },
  {
    id: "aces-color-grading-masterclass",
    slug: "aces-color-grading-ai-footage-davinci",
    title: "ACES Color Science & 35mm Emulation for Synthetic AI Media",
    category: "Post-Production",
    author: "Amusemac Studio Editorial",
    publishedDate: "August 2026",
    readTime: "10 min read",
    summary: "Transforming raw sRGB / 8-bit AI video generations into unified DCI-P3 / Rec.709 broadcast deliverables using DaVinci Resolve Neural Engine.",
    primaryToolId: "davinci-resolve",
    embeddedVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-green-screen-41582-large.mp4",
    relatedPromptRecipe: {
      title: "Cinematic Film Still Emulsion Anchor",
      prompt: "35mm photograph of protagonist standing in rain, Kodak Vision3 500T 5219 film stock, subtle cyan shadows, amber sodium-vapor key light --style raw"
    },
    keyTakeaways: [
      "Convert AI generated sRGB clips into ACEScc or DaVinci Wide Gamut to restore dynamic highlight rolloff.",
      "Use DaVinci Resolve Neural Magic Mask to isolate characters and grade backgrounds independently.",
      "Apply procedural 35mm optical grain to mask subtle generative interpolation micro-artifacts."
    ]
  }
];
