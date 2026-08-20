import { ProductionKit } from "./types";

export const productionKitsData: ProductionKit[] = [
  {
    id: "kit-ai-film-starter",
    slug: "ai-film-starter-kit",
    title: "AI Film Production Starter Kit",
    category: "Starter",
    badge: "Free Download",
    description: "The complete zero-to-screen production bundle for independent filmmakers, including shot list templates, model selection matrices, and prompt token sheets.",
    includedAssets: [
      "Notion Shot List & Director Production Hub Template",
      "PDF Model Selection Matrix (Runway vs Kling vs Wan vs Veo)",
      "Prompt Variable Token Cheatsheet (Camera, Lighting, Motion)",
      "DaVinci Resolve 35mm Grain & ACES Rec.709 LUT Pack"
    ],
    fileFormat: "ZIP (Notion Template, PDF, .cube LUTs)",
    targetSoftware: ["DaVinci Resolve", "Premiere Pro", "Notion", "Midjourney", "Runway"],
    downloadUrl: "#download-starter-kit",
    lastUpdated: "August 2026"
  },
  {
    id: "kit-commercial-previs",
    slug: "commercial-previs-kit",
    title: "Commercial Previsualization Kit",
    category: "Previs",
    badge: "Free Download",
    description: "Designed for commercial agency directors and DPs pitching high-stakes automotive, luxury, and beverage client commercials.",
    includedAssets: [
      "Automotive & Tabletop 24fps Prompt Recipe Book",
      "Start/End Frame Keyframing Alignment Guide",
      "Pitch Deck 16:9 / 2.39:1 Keynote & Figma Slide Templates",
      "High-Speed Fluid Dynamics Prompt Syntax Card"
    ],
    fileFormat: "ZIP (Figma, Keynote, PDF)",
    targetSoftware: ["Figma", "Keynote", "Runway Gen-3", "Kling AI", "Flux.1"],
    downloadUrl: "#download-previs-kit",
    lastUpdated: "August 2026"
  },
  {
    id: "kit-directors-camera",
    slug: "directors-camera-kit",
    title: "Director's Camera & Optics Kit",
    category: "Camera",
    badge: "Free Download",
    description: "Master optical terminology and camera coordinate syntax for Runway, Kling, and Luma. Learn how focal lengths alter latent space perspective.",
    includedAssets: [
      "20-Lens Optical Lexicon & Focal Length Comparison Guide",
      "6-DOF Camera Coordinate Command Sheet (Pan, Tilt, Zoom, Roll)",
      "Anamorphic Streak & Bokeh Prompt Modifiers",
      "Common AI Distortion & Motion Tearing Troubleshooting Chart"
    ],
    fileFormat: "PDF & Notion Template",
    targetSoftware: ["Runway Gen-3 Alpha", "Kling AI", "Luma Dream Machine", "Midjourney v6.1"],
    downloadUrl: "#download-camera-kit",
    lastUpdated: "August 2026"
  },
  {
    id: "kit-prompt-blueprint",
    slug: "prompt-engineering-blueprint",
    title: "Cinematic Prompt Architecture Blueprint",
    category: "Prompting",
    badge: "Free Download",
    description: "A structured methodology for constructing 10-token production prompts that enforce subject identity, lighting ratios, and camera movement.",
    includedAssets: [
      "10-Part Modular Prompt Formula Worksheet",
      "Negative Prompt Lexicon for Defect Elimination",
      "Photographic Film Stock & Lighting Glossary (Kodak, Cooke, Arri)",
      "Multi-Model Prompt Translation Grid"
    ],
    fileFormat: "PDF & Interactive Web Tool",
    targetSoftware: ["Midjourney v6.1", "Flux.1", "Runway Gen-3", "Kling AI", "Stable Diffusion"],
    downloadUrl: "#download-prompt-blueprint",
    lastUpdated: "August 2026"
  }
];
