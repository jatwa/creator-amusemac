import {
  Technique,
  TechniqueCategory,
  TechniqueDifficulty,
  ToolProductionStage,
  VerificationStatus,
} from "./film-intelligence-types";

// ============================================================================
// CANONICAL CINEMA TECHNIQUES REGISTRY
// ============================================================================

export const canonicalTechniques: Technique[] = [
  // 1. 2x Anamorphic Widescreen Optics
  {
    id: "tech-anamorphic-optics",
    slug: "anamorphic-widescreen-optics",
    name: "2x Anamorphic Widescreen Optics",
    alternateNames: ["Anamorphic Squeeze", "Scope Lenses", "Cylindrical Optics"],
    category: "LENS_OPTICS",
    subcategory: "Optical Compression",
    description:
      "A specialized optical system utilizing cylindrical lens elements to compress a wide panoramic horizontal field of view onto a standard sensor or film gate, desqueezed in post-production or projection to a 2.39:1 aspect ratio.",
    creativePurpose:
      "Creates an immersive theatrical widescreen canvas, enhancing cinematic separation between subject and environment through horizontal bokeh ovalization, dramatic streak flares, and distinctive peripheral barrel falloff.",
    visualCharacteristics:
      "Elliptical/oval out-of-focus background bokeh, horizontal cyan or amber streak flares across intense specular highlights, organic edge softness, and cinematic spatial compression.",
    whenToUse: [
      "Widescreen cinematic narrative features and high-concept shorts",
      "Night exteriors and urban environments with strong practical point light sources",
      "Character close-ups requiring painterly separation without telephoto flatness",
      "Auteur drama and sci-fi world-building intended for theatrical theatrical DCP projection"
    ],
    whenNotToUse: [
      "Strict vertical format delivery (9:16 mobile video) where anamorphic horizontal squeeze causes undesirable aspect clipping",
      "Run-and-gun documentary requiring extreme close-focus without supplementary diopters",
      "Ultra-clean clinical commercial packshots where geometric distortion is prohibited"
    ],
    productionStage: "PRODUCTION",
    difficulty: "ADVANCED",
    technicalConsiderations: [
      "Sensor height must support 4:3 or 6:5 Open Gate capture to maximize vertical resolution.",
      "Requires post-production desqueeze monitoring LUTs on camera EVF and client monitors.",
      "Minimum focus distance is typically longer (3 to 5 feet); diopters (+0.5 to +2.0) are mandatory for tight macro inserts."
    ],
    commonMistakes: [
      {
        mistake: "Framing in 16:9 without calculating 2.39:1 crop lines.",
        consequence: "Essential head room or narrative action gets sliced in the final theatrical scope master.",
        correction: "Enable custom 2.39:1 framelines inside camera viewfinder and monitoring feeds."
      },
      {
        mistake: "Over-flaring the lens with unmotivated point lights.",
        consequence: "Veiling glare washes out sensor shadow contrast and degrades blacks across the entire frame.",
        correction: "Use matte box French flags and side eyebrows to control unwanted stray light."
      }
    ],
    relatedTechniques: ["tech-shallow-dof-portrait", "tech-dolly-zoom"],
    relatedTools: ["davinci-resolve", "runway", "midjourney"],
    relatedPrompts: ["golden-hour-arrival", "rainy-night-street"],
    relatedFilms: ["film-chronicles-of-the-croisette", "film-the-lucid-ride", "film-echoes-of-the-wasteland"],
    relatedPeople: ["person-jean-luc-moreau", "person-marcus-vance", "person-mateo-alvarez"],
    relatedResearch: ["res-anamorphic-optics-characteristics", "res-theatrical-dcp-mastering"],
    relatedJournalArticles: ["mastering-camera-motion-runway-kling"],
    verificationStatus: "VERIFIED",
    sourceIds: ["src-ac-anamorphic-study", "src-dci-system-spec"],
    confidence: "HIGH",
    editorialNotes: "Verified optical characteristics cross-referenced with American Cinematographer lens benchmarks.",
    visibility: "PUBLIC",
    verifiedAt: "2026-08-20"
  },

  // 2. Dolly Zoom (Vertigo Effect)
  {
    id: "tech-dolly-zoom",
    slug: "dolly-zoom-vertigo-effect",
    name: "Dolly Zoom (Vertigo Effect)",
    alternateNames: ["Zolly", "Contra-Zoom", "Trombone Shot", "Hitchcock Zoom"],
    category: "CAMERA",
    subcategory: "Dynamic Perspective Warping",
    description:
      "A cinematic camera technique where the camera physically dollies forward or backward along track while the focal length of a zoom lens is simultaneously adjusted in the opposite direction to maintain identical subject scale.",
    creativePurpose:
      "Visually communicates intense psychological realization, disorientation, dread, or traumatic character epiphanies by dynamically distorting the spatial relationship between subject and background.",
    visualCharacteristics:
      "The foreground character remains stationary in frame size while the background dramatically rushes forward (compressing space) or recedes infinitely into extreme wide-angle depth.",
    whenToUse: [
      "Climactic moments of psychological realization or existential shock",
      "Sudden character dread, panic attacks, or vertigo in thriller/horror narratives",
      "Dramatic shift in power dynamics between two characters in tension"
    ],
    whenNotToUse: [
      "Casual dialogue or exposition scenes where the effect distracts from performance",
      "Action sequences with rapid cuts where the optical expansion cannot register",
      "Overused as a gimmick without motivated psychological underpinnings"
    ],
    productionStage: "PRODUCTION",
    difficulty: "ADVANCED",
    technicalConsiderations: [
      "Requires precise motor synchronization between camera dolly speed and electronic zoom controller.",
      "Depth of field shifts dynamically as focal length changes, requiring continuous wireless follow-focus pulls.",
      "In generative AI pipelines, requires dual parameter coordination (Z-axis camera dolly + lens FOV expansion)."
    ],
    commonMistakes: [
      {
        mistake: "Subject size fluctuates noticeably during the push/pull.",
        consequence: "Destroys the optical illusion and draws attention to mechanical crew error.",
        correction: "Map zoom marks and dolly track markers with millimeter precision during camera rehearsal."
      },
      {
        mistake: "Shallow depth of field causing subject's face to blur halfway through movement.",
        consequence: "Loses character emotional connection.",
        correction: "Stop down to f/4 or f/5.6 to provide a safe focus margin across the zoom range."
      }
    ],
    relatedTechniques: ["tech-russian-arm", "tech-anamorphic-optics"],
    relatedTools: ["runway", "kling"],
    relatedPrompts: ["lonely-apartment"],
    relatedFilms: ["film-synthetic-horizon", "film-chronicles-of-the-croisette"],
    relatedPeople: ["person-claire-delacroix", "person-sora-nomura"],
    relatedResearch: ["res-anamorphic-optics-characteristics"],
    relatedJournalArticles: ["mastering-camera-motion-runway-kling"],
    verificationStatus: "VERIFIED",
    sourceIds: ["src-ac-anamorphic-study"],
    confidence: "HIGH",
    editorialNotes: "First engineered by Irmin Roberts on Alfred Hitchcock's Vertigo (1958).",
    visibility: "PUBLIC",
    verifiedAt: "2026-08-20"
  },

  // 3. Russian Arm / Pursuit Tracking
  {
    id: "tech-russian-arm",
    slug: "russian-arm-high-speed-pursuit",
    name: "Russian Arm Pursuit Tracking",
    alternateNames: ["MotoCrane", "Gyro-Stabilized Roof Crane", "High-Speed Pursuit Rig"],
    category: "CAMERA",
    subcategory: "Vehicle Cinematography",
    description:
      "A high-speed pursuit vehicle equipped with a 360-degree gyro-stabilized roof-mounted crane arm and 3-axis remote camera head, capable of capturing dynamic fluid tracking shots at speeds exceeding 100 km/h.",
    creativePurpose:
      "Delivers visceral, grounded kinetic energy and dynamic spatial movement around high-speed vehicles, runners, or moving action subjects without camera vibration.",
    visualCharacteristics:
      "Low-angle sweeping camera arcs, razor-sharp subject isolation against streaking asphalt motion blur, and seamless 3D parallax shifts.",
    whenToUse: [
      "Automotive commercials, motorcycle chases, and high-speed action beats",
      "Sweeping dynamic establishing shots through moving city traffic",
      "Action sequences requiring continuous camera travel alongside moving actors"
    ],
    whenNotToUse: [
      "Confined interior studio locations without pursuit vehicle clearance",
      "Low-budget narrative scripts where static or gimbal camera language suffices"
    ],
    productionStage: "PRODUCTION",
    difficulty: "MASTER",
    technicalConsiderations: [
      "Requires a coordinated 4-person team: Pursuit Driver, Crane Arm Operator, Camera Gimbal Operator, and Focus Puller.",
      "In AI generative video (e.g. Runway/Kling), requires low motion intensity parameters (3-5) to prevent tire spoke warping."
    ],
    commonMistakes: [
      {
        mistake: "Setting AI motion speed too high in generative video suites.",
        consequence: "Vehicle geometry deforms and tires warp into unnatural hydrodynamic fluid states.",
        correction: "Lock vehicle contours in master keyframe (Flux/Midjourney) and apply low linear speed vector prompts."
      }
    ],
    relatedTechniques: ["tech-dolly-zoom", "tech-anamorphic-optics"],
    relatedTools: ["runway", "kling", "topaz"],
    relatedPrompts: ["rainy-night-street"],
    relatedFilms: ["film-the-lucid-ride", "film-neural-drift-tokyo"],
    relatedPeople: ["person-marcus-vance", "person-kenji-sato"],
    relatedResearch: ["res-rectified-flow-matching-vs-diffusion"],
    relatedJournalArticles: ["mastering-camera-motion-runway-kling"],
    verificationStatus: "VERIFIED",
    sourceIds: ["src-ac-anamorphic-study"],
    confidence: "HIGH",
    visibility: "PUBLIC",
    verifiedAt: "2026-08-20"
  },

  // 4. ACES Color Management Pipeline
  {
    id: "tech-aces-color-management",
    slug: "aces-color-management-pipeline",
    name: "ACES Color Management Pipeline",
    alternateNames: ["ACEScc", "Academy Color Encoding System", "ACES AP1/AP0"],
    category: "COLOR",
    subcategory: "Color Science & Standardization",
    description:
      "An open, device-independent color management architecture created by the Academy of Motion Picture Arts and Sciences that standardizes image color spaces from optical capture through VFX, CGI, and theatrical DCI mastering.",
    creativePurpose:
      "Preserves the full dynamic range and wide color gamut of camera sensors and AI renders, eliminating highlight clipping, color banding, and gamut mismatch between diverse cameras.",
    visualCharacteristics:
      "Smooth, photographic highlight roll-off, natural skin tone fidelity in mixed color temperatures, and rich shadow detail without gamut compression.",
    whenToUse: [
      "Multi-camera feature productions and commercial finishings",
      "Blending AI-generated VFX plates with live-action digital cinema sensors (ARRI, RED, Sony)",
      "Mastering theatrical DCI DCP and HDR10/Dolby Vision deliverables"
    ],
    whenNotToUse: [
      "Quick turnaround social media edits with single-camera sRGB capture and basic Rec.709 timelines"
    ],
    productionStage: "COLOR",
    difficulty: "ADVANCED",
    technicalConsiderations: [
      "Use ACEScc (logarithmic) for color grading in DaVinci Resolve Studio to ensure natural shadow lift and gain wheel behavior.",
      "Input Device Transforms (IDT) must be precisely assigned for each camera sensor and AI image source."
    ],
    commonMistakes: [
      {
        mistake: "Applying standard Rec.709 creative LUTs directly onto ACEScc working nodes.",
        consequence: "Produces extreme hyper-saturation and crushed black levels.",
        correction: "Apply ACES-compliant LUTs or use DaVinci Color Space Transform (CST) nodes."
      }
    ],
    relatedTechniques: ["tech-anamorphic-optics", "tech-dci-theatrical-dcp"],
    relatedTools: ["davinci-resolve"],
    relatedPrompts: ["golden-hour-arrival"],
    relatedFilms: ["film-the-lucid-ride", "film-chronicles-of-the-croisette", "film-echoes-of-the-wasteland"],
    relatedPeople: ["person-jean-luc-moreau", "person-marcus-vance", "person-claire-delacroix"],
    relatedResearch: ["res-theatrical-dcp-mastering"],
    relatedJournalArticles: ["mastering-camera-motion-runway-kling"],
    verificationStatus: "VERIFIED",
    sourceIds: ["src-davinci-color-spec", "src-dci-system-spec"],
    confidence: "HIGH",
    visibility: "PUBLIC",
    verifiedAt: "2026-08-18"
  },

  // 5. Rembrandt Triangle Lighting
  {
    id: "tech-rembrandt-lighting",
    slug: "rembrandt-chiaroscuro-lighting",
    name: "Rembrandt Triangle Lighting",
    alternateNames: ["Chiaroscuro Key", "Triangle Portrait Lighting", "45-Degree Key"],
    category: "LIGHTING",
    subcategory: "Portrait & Character Lighting",
    description:
      "A classic lighting technique inspired by Dutch master painter Rembrandt van Rijn, characterized by a single key light placed 45 degrees to the side and slightly above eye level, casting a distinct inverted triangle of light on the subject's shadowed cheek.",
    creativePurpose:
      "Sculpts facial features with dramatic depth, mystery, and natural three-dimensionality, subtly hinting at internal character conflict or psychological complexity.",
    visualCharacteristics:
      "High-contrast chiaroscuro modeling across the nose and cheekbones with an illuminated triangle beneath the shadow-side eye no wider than the eye and no longer than the nose tip.",
    whenToUse: [
      "Intimate dramatic dialogue, psychological thrillers, and auteur character studies",
      "Moody historical dramas and cinematic character lookbooks",
      "AI portrait prompting for photorealistic human characters"
    ],
    whenNotToUse: [
      "High-key commercial beauty advertising or upbeat family comedy",
      "Broad documentary interviews requiring flat, transparent lighting"
    ],
    productionStage: "PRODUCTION",
    difficulty: "INTERMEDIATE",
    technicalConsiderations: [
      "Key-to-fill light ratio typically ranges from 4:1 to 8:1 depending on desired dramatic mood.",
      "Requires precise subject orientation relative to the key light source to preserve the triangle boundary."
    ],
    commonMistakes: [
      {
        mistake: "Allowing the triangle of light to break across the lip line.",
        consequence: "Turns the clean Rembrandt pattern into sloppy broad/split lighting.",
        correction: "Adjust key light angle and height until the nose shadow connects precisely with the cheek shadow."
      }
    ],
    relatedTechniques: ["tech-shallow-dof-portrait", "tech-anamorphic-optics"],
    relatedTools: ["midjourney", "flux-1-dev", "davinci-resolve"],
    relatedPrompts: ["lonely-apartment", "golden-hour-arrival"],
    relatedFilms: ["film-chronicles-of-the-croisette", "film-echoes-of-the-wasteland"],
    relatedPeople: ["person-claire-delacroix", "person-jean-luc-moreau", "person-mateo-alvarez"],
    relatedResearch: ["res-anamorphic-optics-characteristics"],
    relatedJournalArticles: ["mastering-camera-motion-runway-kling"],
    verificationStatus: "VERIFIED",
    sourceIds: ["src-ac-anamorphic-study"],
    confidence: "HIGH",
    visibility: "PUBLIC",
    verifiedAt: "2026-08-19"
  },

  // 6. Open-Weights Flux LoRA Character Continuity
  {
    id: "tech-flux-lora-consistency",
    slug: "flux-lora-character-consistency",
    name: "Open-Weights Flux LoRA Character Continuity",
    alternateNames: ["Character LoRA Anchor", "Low-Rank Adaptation", "ComfyUI Identity Pipeline"],
    category: "VFX_AI",
    subcategory: "Synthetic Media & Pipeline Engineering",
    description:
      "A machine learning pipeline utilizing Low-Rank Adaptation (LoRA) trained on 15–30 high-resolution keyframe portraits in open-weight models (e.g. Flux.1 Dev) within modular ComfyUI environments to enforce strict actor facial and costume continuity across multi-shot scripts.",
    creativePurpose:
      "Enables independent filmmakers and VFX supervisors to execute complex multi-scene narrative animatics without character facial warping or confidential cloud studio IP leakage.",
    visualCharacteristics:
      "100% facial feature alignment, continuous costume textures, and consistent skin tone across changing lighting angles and focal lengths.",
    whenToUse: [
      "Narrative short film production and feature previsualization",
      "Pitch deck visual development for studio executives",
      "Self-hosted local workstation workflows protecting client IP"
    ],
    whenNotToUse: [
      "Single-frame abstract landscape generation with no recurring human subjects",
      "Low-power cloud mobile workflows where local GPU VRAM is unavailable"
    ],
    productionStage: "PRE_PRODUCTION",
    difficulty: "ADVANCED",
    technicalConsiderations: [
      "Requires minimum 16GB–24GB VRAM (e.g. NVIDIA RTX 3090/4090) for local FP8/BF16 inference.",
      "Training images must feature diverse focal lengths (35mm, 50mm, 85mm) and neutral lighting to prevent bias."
    ],
    commonMistakes: [
      {
        mistake: "Over-training the LoRA with excessive training steps (above 2500).",
        consequence: "Model burns character pose into all generations, losing camera angle flexibility.",
        correction: "Train with rank 16-32 for 1000-1500 steps and validate with multiple random seeds."
      }
    ],
    relatedTechniques: ["tech-rembrandt-lighting", "tech-dci-theatrical-dcp"],
    relatedTools: ["flux-1-dev", "comfyui", "davinci-resolve"],
    relatedPrompts: ["lonely-apartment"],
    relatedFilms: ["film-the-extraction", "film-synthetic-horizon"],
    relatedPeople: ["person-elena-rostova", "person-sora-nomura"],
    relatedResearch: ["res-rectified-flow-matching-vs-diffusion"],
    relatedJournalArticles: ["achieving-character-consistency-comfyui-flux"],
    verificationStatus: "VERIFIED",
    sourceIds: ["src-flux-bfl-whitepaper"],
    confidence: "HIGH",
    visibility: "PUBLIC",
    verifiedAt: "2026-08-18"
  },

  // 7. DCI SMPTE Theatrical DCP Mastering
  {
    id: "tech-dci-theatrical-dcp",
    slug: "dci-smpte-theatrical-dcp-mastering",
    name: "DCI SMPTE Theatrical DCP Mastering",
    alternateNames: ["Digital Cinema Package", "SMPTE 2006 DCP", "DCI XYZ Mastering"],
    category: "VFX_AI",
    subcategory: "Delivery & Exhibition Standards",
    description:
      "The rigorous technical packaging protocol governing digital cinema exhibition on DCI-compliant theatrical servers, requiring JPEG 2000 XYZ color space encoding at strict 24.000 fps with uncompressed 24-bit 48kHz discrete PCM multi-channel audio.",
    creativePurpose:
      "Guarantees that a filmmaker's visual grade, audio mix, and frame timing are projected with absolute fidelity on A-list festival and commercial theatrical screens without server ingestion rejection.",
    visualCharacteristics:
      "DCI XYZ color gamut mapped for xenon/laser theatrical projectors, uncompressed bitrates up to 250 Mbps, and zero web compression artifacts.",
    whenToUse: [
      "Official festival screenings at Cannes, Venice, Sundance, Tribeca, and Berlinale",
      "Commercial cinema distribution and theatrical premiere events",
      "Academy Award qualifying theatrical runs"
    ],
    whenNotToUse: [
      "Web streaming releases (YouTube, Vimeo) or social media distributions"
    ],
    productionStage: "DELIVERY",
    difficulty: "MASTER",
    technicalConsiderations: [
      "Must adhere strictly to SMPTE 428-1 and DCI System Specification v1.4.",
      "Frame rates must be integer 24.000 fps (not 23.976 fps NTSC pull-down).",
      "Audio channels must be discrete (L, R, C, LFE, Ls, Rs) without matrix downmixing."
    ],
    commonMistakes: [
      {
        mistake: "Exporting 23.976 fps master directly to DCP encoder.",
        consequence: "Severe audio drift or complete server ingestion failure in festival projection booths.",
        correction: "Perform 0.1% speed conform to strict 24.000 fps before DCP wrapping."
      }
    ],
    relatedTechniques: ["tech-aces-color-management", "tech-anamorphic-optics"],
    relatedTools: ["davinci-resolve"],
    relatedPrompts: ["golden-hour-arrival"],
    relatedFilms: ["film-chronicles-of-the-croisette", "film-echoes-of-the-wasteland"],
    relatedPeople: ["person-claire-delacroix", "person-jean-luc-moreau", "person-kenji-sato"],
    relatedResearch: ["res-theatrical-dcp-mastering", "res-premiere-exclusivity-rules"],
    relatedJournalArticles: ["state-of-generative-video-2026"],
    verificationStatus: "VERIFIED",
    sourceIds: ["src-dci-system-spec", "src-cannes-official-2027"],
    confidence: "HIGH",
    visibility: "PUBLIC",
    verifiedAt: "2026-08-20"
  },

  // 8. Graphic & Action Match Cut
  {
    id: "tech-match-cut",
    slug: "cinematic-graphic-match-cut",
    name: "Graphic & Action Match Cut",
    alternateNames: ["Visual Match Cut", "Shape Transition", "Kinetic Match"],
    category: "EDITING",
    subcategory: "Narrative Montage & Transitions",
    description:
      "An editing technique that cuts between two separate shots where subject silhouette, geometric framing, or kinetic motion vectors align smoothly, creating an associative thematic bridge across time or space.",
    creativePurpose:
      "Unifies disparate storylines, accelerates passage of time, and establishes visceral emotional connections between characters or narrative eras.",
    visualCharacteristics:
      "Instantaneous compositional symmetry between two disparate environments with continuous visual momentum.",
    whenToUse: [
      "Major temporal leaps in narrative storytelling",
      "Juxtaposing character interior psychology with external reality",
      "Dynamic commercial transitions between diverse environments"
    ],
    whenNotToUse: [
      "Standard shot-reverse-shot dialogue coverage within a single continuous scene"
    ],
    productionStage: "EDITORIAL",
    difficulty: "INTERMEDIATE",
    technicalConsiderations: [
      "Requires meticulous storyboard previsualization to align focal centers across both setups.",
      "Motion velocity in outgoing frame must match incoming frame speed."
    ],
    commonMistakes: [
      {
        mistake: "Misaligning optical center points by more than 5%.",
        consequence: "Viewer's eye jerks abruptly, causing visual jarring instead of seamless connection.",
        correction: "Use grid overlays in editing software to align key geometric shapes precisely."
      }
    ],
    relatedTechniques: ["tech-dolly-zoom", "tech-russian-arm"],
    relatedTools: ["davinci-resolve", "descript"],
    relatedPrompts: ["rainy-night-street"],
    relatedFilms: ["film-synthetic-horizon", "film-neural-drift-tokyo"],
    relatedPeople: ["person-sora-nomura", "person-kenji-sato"],
    relatedResearch: ["res-premiere-exclusivity-rules"],
    relatedJournalArticles: ["state-of-generative-video-2026"],
    verificationStatus: "VERIFIED",
    sourceIds: ["src-ac-anamorphic-study"],
    confidence: "HIGH",
    visibility: "PUBLIC",
    verifiedAt: "2026-08-19"
  }
];

// ============================================================================
// HELPER QUERY FUNCTIONS FOR CANONICAL TECHNIQUES
// ============================================================================

export function getAllPublicTechniques(): Technique[] {
  return canonicalTechniques.filter((t) => t.visibility === "PUBLIC");
}

export function getTechniqueBySlug(slug: string): Technique | undefined {
  const normalized = slug.toLowerCase();
  return canonicalTechniques.find(
    (t) =>
      (t.slug === normalized || t.alternateNames.some((alt) => alt.toLowerCase() === normalized)) &&
      t.visibility === "PUBLIC"
  );
}

export function getTechniqueById(id: string): Technique | undefined {
  return canonicalTechniques.find((t) => t.id === id && t.visibility === "PUBLIC");
}

export function getTechniquesByCategory(category: TechniqueCategory): Technique[] {
  return canonicalTechniques.filter((t) => t.category === category && t.visibility === "PUBLIC");
}

export function getTechniquesByStage(stage: ToolProductionStage): Technique[] {
  return canonicalTechniques.filter((t) => t.productionStage === stage && t.visibility === "PUBLIC");
}
