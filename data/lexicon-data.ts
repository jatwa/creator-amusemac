import { CameraLexiconItem } from "./types";

export const cameraLexiconData: CameraLexiconItem[] = [
  {
    slug: "35mm-prime",
    name: "35mm Prime Lens",
    category: "Optics / Lenses",
    focalLengthOrVector: "35mm, f/1.8 - f/2.8",
    cinematicEffect: "Natural human eye perspective with subtle environmental context; standard Hollywood narrative field of view.",
    bestUseInAI: "Establishing medium shots, dialogue two-shots, and urban street photography.",
    promptSyntax: "Shot on 35mm prime lens, natural optical perspective, subtle shallow depth of field, f/2.0.",
    commonMistake: "Do not pair with 'macro close up'—35mm naturally captures wider environmental staging."
  },
  {
    slug: "85mm-portrait",
    name: "85mm Portrait Prime",
    category: "Optics / Lenses",
    focalLengthOrVector: "85mm, f/1.4 - f/1.8",
    cinematicEffect: "Flattering facial compression, creamy circular bokeh, and strict subject isolation from background clutter.",
    bestUseInAI: "Emotional character close-ups, fashion beauty shots, and dramatic monologue keyframes.",
    promptSyntax: "Tight character close-up, 85mm portrait lens, f/1.4 aperture, creamy background bokeh, sharp eye focus.",
    commonMistake: "Forgetting to specify aperture; without f/1.4, some AI models may keep the background in full sharp focus."
  },
  {
    slug: "cooke-anamorphic",
    name: "Cooke Anamorphic 2.39:1",
    category: "Optics / Lenses",
    focalLengthOrVector: "40mm Anamorphic 2x Squeeze",
    cinematicEffect: "Horizontal lens flares, oval bokeh discs, subtle corner halation, and classic widescreen theatrical texture.",
    bestUseInAI: "Cinematic commercial films, sci-fi night scenes with point lights, and epic landscape establishing shots.",
    promptSyntax: "Anamorphic 40mm lens, 2.39:1 aspect ratio, subtle horizontal cyan streak flare, oval bokeh, cinematic film look.",
    commonMistake: "Using without setting 16:9 or 21:9 aspect ratios; square aspect ratios clip the anamorphic squeeze."
  },
  {
    slug: "100mm-macro",
    name: "100mm Macro Lens",
    category: "Optics / Lenses",
    focalLengthOrVector: "100mm 1:1 Reproduction Ratio",
    cinematicEffect: "Extreme microscopic focus, razor-thin depth of field, revealing minute surface textures (liquid droplets, iris patterns, luxury watch gears).",
    bestUseInAI: "Food & beverage commercials, cosmetic texture shots, luxury jewelry, and scientific visualization.",
    promptSyntax: "Extreme macro 100mm lens, razor-thin depth of field, glistening condensation droplets, 1:1 scale texture.",
    commonMistake: "Over-describing background elements that will be completely thrown out of focus by macro optics."
  },
  {
    slug: "russian-arm",
    name: "Russian Arm / Pursuit Vehicle Tracking",
    category: "Camera Movement",
    focalLengthOrVector: "3-Axis Gyro-Stabilized Roof Crane",
    cinematicEffect: "Dynamic, high-velocity low-angle camera movement tracking beside, in front of, or sweeping over moving vehicles.",
    bestUseInAI: "Automotive commercials, motorcycle chases, athletic sprinting, and high-speed action beats.",
    promptSyntax: "Low-angle Russian Arm tracking shot sweeping beside speeding vehicle, asphalt motion blur, camera 1 foot off ground.",
    commonMistake: "Setting motion intensity too high in Runway (above 7), which can cause vehicle wheels to deform."
  },
  {
    slug: "vertigo-dolly-zoom",
    name: "Vertigo / Dolly Zoom (Zolly)",
    category: "Camera Movement",
    focalLengthOrVector: "Dolly Forward + Zoom Out Simultaneously",
    cinematicEffect: "Subject remains stationary in frame while background rapidly warps and expands, creating intense psychological disorientation.",
    bestUseInAI: "Moments of shocking character realization, horror beats, or dramatic epiphany in narrative scripts.",
    promptSyntax: "Vertigo dolly-zoom effect, pushing camera forward while zooming out focal length, subject locked in center frame, background expanding.",
    commonMistake: "Allowing the subject to move laterally; the Hitchcock effect requires the subject locked dead-center."
  },
  {
    slug: "fpv-drone-dive",
    name: "FPV Acrobatic Drone Dive",
    category: "Camera Movement",
    focalLengthOrVector: "High-Speed Dynamic Roll Vector",
    cinematicEffect: "High-velocity vertical descent down cliffs, architectural facades, or waterfalls, pulling up sharply into horizontal flight.",
    bestUseInAI: "Extreme sports, epic architectural reveals, music video intros, and opening trailer stingers.",
    promptSyntax: "FPV drone diving vertically down concrete skyscraper canyon at sunset, banking 180 degrees into low street pass, 4k 24fps.",
    commonMistake: "Lack of environment definition; FPV requires strong vertical geometries (buildings, cliffs) to communicate scale."
  },
  {
    slug: "steadicam-tracking",
    name: "Steadicam Single-Take Tracking",
    category: "Camera Movement",
    focalLengthOrVector: "Smooth Floating 3-Axis Gimbal Path",
    cinematicEffect: "Fluid, floating human-eye movement following a subject through complex multi-room interior environments without micro-jitter.",
    bestUseInAI: "Long narrative tracking shots, nightclub corridor entrances, and documentary immersions.",
    promptSyntax: "Smooth Steadicam tracking shot following protagonist from behind through bustling crowded corridor, fluid camera float, 24fps.",
    commonMistake: "Describing sudden 90-degree snap cuts; Steadicam requires continuous flowing momentum."
  }
];
