import { CaseStudyStory } from "./types";

export const storiesData: CaseStudyStory[] = [
  {
    id: "story-the-lucid-ride",
    slug: "the-lucid-ride",
    title: "The Lucid Ride: 60-Second Automotive Spec Commercial",
    subtitle: "A complete multi-model breakdown of a photorealistic electric hypercar commercial produced with zero practical filming.",
    genre: "Commercial / Automotive",
    director: "Marcus Vance (AI Production Director)",
    runtime: "0:60",
    status: "Case Study",
    summary: "How an independent creative studio executed a hypercar commercial featuring rain-slicked city streets, Russian Arm tracking shots, and dynamic interior lighting using Midjourney v6.1, Flux.1, Runway Gen-3 Alpha, Kling AI 1.5, Topaz Video AI, and DaVinci Resolve.",
    creativeBrief: "Create a 60-second high-energy spec commercial for a futuristic electric GT coupe navigating Mumbai and Tokyo at midnight. The deliverable required razor-sharp vehicle reflections, authentic 35mm anamorphic camera language, zero morphological warping, and ACES color grading.",
    shotList: [
      {
        shotNumber: 1,
        shotName: "Opening Hero Establishing Shot (Tokyo Highway at Dusk)",
        conceptPrompt: "Wide panoramic 35mm photograph of sleek matte obsidian electric hypercar driving on wet highway overpass in Tokyo at twilight, illuminated billboard reflections in puddles, Kodak Vision3 500T --ar 2.39:1 --style raw",
        modelUsed: "Midjourney v6.1 → Runway Gen-3 Alpha (I2V)",
        technique: "I2V",
        creativeChallenge: "Establishing cinematic anamorphic streak reflections without melting the car's geometric bodywork.",
        solution: "Locked car body contours in Midjourney v6.1, then animated with Runway Gen-3 using `[Camera: Low-angle tracking truck right, 24fps motion blur]`.",
        outputArtifact: "5-second 1080p Master Clip"
      },
      {
        shotNumber: 2,
        shotName: "Wheel Rotation & Wet Asphalt Parallax",
        conceptPrompt: "Low Russian Arm shot tracking beside obsidian hypercar wheels spinning at 100km/h on wet asphalt, water spray droplets kicking up into neon headlights, golden hour rim light.",
        modelUsed: "Kling AI 1.5 (Pro 10s Mode)",
        technique: "I2V",
        creativeChallenge: "Runway exhibited slight wheel spoke warping at high speed; physical hydrodynamic simulation was critical.",
        solution: "Switched to Kling AI 1.5 Spatio-Temporal Attention model, which rendered realistic fluid mass and spoke momentum.",
        outputArtifact: "6-second 1080p Clip"
      },
      {
        shotNumber: 3,
        shotName: "Driver Gaze & Interior Ambient Light",
        conceptPrompt: "Close-up interior shot of female driver in cockpit looking in rearview mirror, neon city reflections sweeping across sunglasses, subtle confident smile.",
        modelUsed: "Runway Act-One Performance Capture",
        technique: "Act-One",
        creativeChallenge: "Preventing uncanny-valley facial stiffness during dialogue-less emotional beat.",
        solution: "Director recorded 4 seconds of webcam facial performance; mapped onto AI driver portrait using Act-One.",
        outputArtifact: "4-second Character Plate"
      },
      {
        shotNumber: 4,
        shotName: "Final Acceleration Tunnel Exit",
        conceptPrompt: "High-speed FPV camera diving down neon tunnel chasing hypercar as it bursts into midnight rainstorm, dramatic lens halation.",
        modelUsed: "Luma Dream Machine 1.5 → Topaz Video AI",
        technique: "I2V",
        creativeChallenge: "Fast 3D camera parallax without tunnel walls tearing.",
        solution: "Luma 1.5 generated rapid 3D depth; upscaled in Topaz Video AI with Proteus model to 4K ProRes 422 HQ.",
        outputArtifact: "5-second 4K Master Finish"
      }
    ],
    toolsUsed: ["Midjourney v6.1", "Flux.1 Pro", "Runway Gen-3 Alpha", "Kling AI 1.5", "Topaz Video AI 5", "DaVinci Resolve Studio"],
    keyPromptTakeaways: [
      "Always generate master keyframes at 2.39:1 aspect ratio with `--style raw` to establish photographic color science before animating.",
      "Use Kling AI for fluid and wheel dynamics; use Runway for directional camera coordinate precision.",
      "Never deliver raw AI video outputs directly to clients: upscale in Topaz and apply consistent 35mm grain in DaVinci Resolve."
    ],
    colorPalette: ["#0A0A0C", "#14213D", "#F77F00", "#00F5D4", "#E5E5E5"],
    publishedAt: "August 2026"
  },
  {
    id: "story-the-cyberpunk-extraction",
    slug: "cyberpunk-extraction",
    title: "The Extraction: Narrative Short Film Previs",
    subtitle: "A 3-minute sci-fi narrative previs pipeline built with custom character LoRAs and modular ComfyUI nodes.",
    genre: "Sci-Fi / Narrative Previs",
    director: "Elena Rostova (VFX Supervisor)",
    runtime: "3:15",
    status: "Case Study",
    summary: "How a feature film visual effects team pre-visualized an entire 12-shot action sequence to pitch to studio executives, saving $120,000 in early concept budgeting.",
    creativeBrief: "Deliver a 3-minute animated animatic of an extraction team infiltrating an underground bio-dome. Requirements: continuous lead character facial identity across all 12 shots, tactical camera angles, and zero cloud API leaks for confidential studio IP.",
    shotList: [
      {
        shotNumber: 1,
        shotName: "Tactical Team Infiltration (Wide Cavern)",
        conceptPrompt: "Wide establishing 35mm film shot of three tactical operatives in matte black armor rappelling into massive underground subterranean biodome, volumetric dust beams, Arri Alexa 2.39:1.",
        modelUsed: "Flux.1 Dev (Self-Hosted LoRA) → Wan 2.1 ComfyUI",
        technique: "T2I",
        creativeChallenge: "Maintaining proprietary studio suit design and confidential IP without uploading to public cloud servers.",
        solution: "Trained 20-image custom LoRA in Kohya_ss on local RTX 4090; animated locally via Wan 2.1 ComfyUI workflow.",
        outputArtifact: "12-shot Anamorphic Animatic"
      }
    ],
    toolsUsed: ["Flux.1 Dev", "Wan 2.1 (Open Weights)", "ComfyUI", "DaVinci Resolve Studio", "ElevenLabs"],
    keyPromptTakeaways: [
      "Self-hosted ComfyUI pipelines protect studio IP and eliminate recurring cloud API credit costs.",
      "Custom Flux LoRAs guarantee 100% actor and costume continuity across complex multi-shot scripts."
    ],
    colorPalette: ["#0D131A", "#1F2D3D", "#00A896", "#F4D35E", "#F0F3F4"],
    publishedAt: "August 2026"
  }
];
