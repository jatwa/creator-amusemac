import { CanonicalWorkflow, CanonicalWorkflowCategory } from "./film-intelligence-types";

/**
 * CREATOR INTEL — CANONICAL WORKFLOW INTELLIGENCE REGISTRY
 *
 * Professional, actionable production playbooks for modern filmmakers,
 * directors, cinematographers, and AI artists.
 *
 * Each workflow contains exact steps, inputs/outputs, techniques, tools,
 * prompts, research links, quality checks, and common failure modes.
 */
export const canonicalWorkflows: CanonicalWorkflow[] = [
  // =========================================================================
  // 1. LOOKBOOK & CONCEPT DEVELOPMENT
  // =========================================================================
  {
    id: "wf-cinematic-lookbook",
    slug: "cinematic-lookbook-visual-bible",
    title: "Building an Auteur Cinematic Lookbook & Visual Bible",
    category: "CONCEPT_DEVELOPMENT",
    summary:
      "A structured methodology for distilling script themes, lighting philosophies, optical choices, and character palettes into an executive-ready visual pitch bible.",
    purpose:
      "Bridge the communication divide between the director, cinematographer, production designer, and financiers before capital is committed to physical sets or full generation runs.",
    whenToUse: [
      "Pitching a feature or high-concept short film to producers, funds, or festival labs.",
      "Aligning Heads of Department (Cinematography, Production Design, Wardrobe) during early prep.",
      "Establishing strict prompt seeds and visual style bounds before launching an AI previs pipeline."
    ],
    whenNotToUse: [
      "Rapid turnaround single-shot social deliverables.",
      "Documentary projects where visual aesthetic must emerge entirely from unconditioned verité reality."
    ],
    estimatedEffort: "3 to 5 Days (Full Multi-Department Lookbook)",
    difficulty: "INTERMEDIATE",
    inputsRequired: [
      "Locked Screenplay or Detailed 5-Page Narrative Treatment",
      "Director's Aesthetic Statement & Key Thematic Keywords",
      "Target Aspect Ratio & Color Palette Restrictions (e.g. 2.39:1, Kodak 5219 Warm Tungsten)"
    ],
    outputsProduced: [
      "25–40 Page Master Lookbook PDF (Landscape 16:9)",
      "Structured Color Palette Palette Swatches (HEX / CIE chromaticity)",
      "Optical & Camera Lens Selection Blueprint",
      "Character Costume & Environmental Keyframe Plates"
    ],
    steps: [
      {
        stepNumber: 1,
        name: "Narrative Core & Visual Tone Extraction",
        objective: "Extract primary psychological themes and translate them into photographic constraints.",
        action:
          "Read through the script treatment to identify the emotional trajectory of each act. Translate abstract themes (e.g. 'alienation in a hyper-dense city') into concrete camera principles (e.g. 'telephoto compression isolating subject against dense defocused background blur').",
        input: "Narrative Treatment / Script",
        output: "1-Page Visual Rules Manifesto (Framing rules, contrast ratios, saturation limits)",
        recommendedTechniqueIds: ["tech-chiaroscuro-lighting", "tech-volumetric-haze"],
        recommendedToolIds: ["tool-midjourney"],
        optionalPromptIds: ["prompt-03-lonely-apartment"],
        commonFailure: "Choosing references based purely on surface coolness rather than narrative logic.",
        qualityCheck: "Does every visual reference directly support the psychological state of the protagonist?",
        proTips: [
          "Limit each scene to maximum 3 dominant tonal colors.",
          "Write down explicit 'Never Do' rules (e.g., 'Never use wide-angle closeups on the protagonist')."
        ]
      },
      {
        stepNumber: 2,
        name: "Optics & Lens Architecture Specification",
        objective: "Define physical camera, sensor format, focal length ranges, and anamorphic vs spherical optical characteristics.",
        action:
          "Specify the focal length roadmap (e.g. 35mm / 50mm / 85mm anamorphic primes with 2x horizontal squeeze) to define bokeh ovality, flare characteristics, and depth-of-field falloff across exterior and interior sequences.",
        input: "Visual Rules Manifesto",
        output: "Optical Specification Sheet with Lens Flare & Bokeh Behavior Chart",
        recommendedTechniqueIds: ["tech-anamorphic-optics"],
        recommendedToolIds: ["tool-midjourney", "tool-flux"],
        optionalPromptIds: ["prompt-01-golden-hour-arrival"],
        commonFailure: "Mixing incompatible lens aesthetics (e.g., hyper-clean clinical spherical digital with vintage anamorphic streak) without story justification.",
        qualityCheck: "Are lens focal lengths assigned consistently by narrative beat (e.g., wide focal lengths for institutional intimidation, long lenses for intimacy)?",
        proTips: [
          "Include optical reference plates showing highlight roll-off and barrel distortion behavior."
        ]
      },
      {
        stepNumber: 3,
        name: "Character Keyframe & Costume Look Generation",
        objective: "Synthesize high-fidelity keyframe portraits that lock character silhouettes, wardrobe textures, and lighting interaction.",
        action:
          "Use conditioned text-to-image workflows to render character keyframes across 3 lighting conditions: key daylight, dusk interior, and harsh night exterior. Ensure skin texture and wardrobe weave maintain photographic realism.",
        input: "Casting Brief & Costume Palette Notes",
        output: "6–12 High-Resolution Character Concept Keyframes",
        recommendedTechniqueIds: ["tech-chiaroscuro-lighting"],
        recommendedToolIds: ["tool-flux", "tool-midjourney"],
        optionalPromptIds: ["prompt-01-golden-hour-arrival", "prompt-03-lonely-apartment"],
        commonFailure: "Allowing generative models to produce waxy skin, inconsistent facial geometry, or generic stock-photo aesthetics.",
        qualityCheck: "Do all character keyframes match the established photographic grain and lighting contrast ratio?",
        proTips: [
          "Use fixed seed anchors and specific film stock tags ('Kodak Vision3 500T 5219') to maintain uniform skin undertones."
        ]
      },
      {
        stepNumber: 4,
        name: "Worldbuilding & Atmospheric Environment Studies",
        objective: "Generate wide master environment plates defining architecture, atmospheric haze density, and practical light placements.",
        action:
          "Create expansive wide-angle and telephoto vista keyframes establishing the architectural grammar of the film's world, emphasizing volumetric light beams and negative space.",
        input: "Location Scouting Notes / Script Settings",
        output: "8–12 Master Environment Keyframes (2.39:1 Aspect Ratio)",
        recommendedTechniqueIds: ["tech-volumetric-haze", "tech-anamorphic-optics"],
        recommendedToolIds: ["tool-midjourney", "tool-flux"],
        optionalPromptIds: ["prompt-02-rainy-night-street"],
        commonFailure: "Cluttering frames with excessive fantasy/sci-fi detail that detracts from scale and focal hierarchy.",
        qualityCheck: "Can a production designer immediately understand the spatial layout and materials from each keyframe?",
        proTips: [
          "Explicitly specify atmospheric moisture and particle density (e.g. 'subtle ground mist', 'fine airborne dust motes')."
        ]
      },
      {
        stepNumber: 5,
        name: "Lookbook Editorial Layout & Director Pitch Package",
        objective: "Compile keyframes, optical diagrams, typography, and director notes into an executive PDF presentation.",
        action:
          "Assemble all assets in an editorial layout program using minimalist typography (Helvetica Neue or Neue Haas Grotesk), high-contrast black backgrounds, and precise page pacing.",
        input: "Keyframe Plates + Technical Spec Sheets",
        output: "Master Director's Lookbook PDF (30+ Pages, 16:9 Screen Format)",
        recommendedTechniqueIds: ["tech-chiaroscuro-lighting"],
        recommendedToolIds: ["tool-premiere-pro"],
        optionalPromptIds: [],
        commonFailure: "Overloading slides with dense paragraphs of text instead of letting imagery and concise captions lead.",
        qualityCheck: "Does the PDF read like a prestigious art monograph rather than a generic PowerPoint slide deck?",
        proTips: [
          "Include a final 2-page 'Technical Execution Appendix' detailing camera, lighting package, and color pipeline for department heads."
        ]
      }
    ],
    relatedFilmIds: ["film-blade-runner-2049", "film-all-we-imagine-as-light"],
    relatedTechniqueIds: [
      "tech-anamorphic-optics",
      "tech-chiaroscuro-lighting",
      "tech-volumetric-haze"
    ],
    relatedToolIds: ["tool-midjourney", "tool-flux", "tool-premiere-pro"],
    relatedPromptIds: [
      "prompt-01-golden-hour-arrival",
      "prompt-02-rainy-night-street",
      "prompt-03-lonely-apartment"
    ],
    relatedResearchIds: ["res-anamorphic-vs-spherical-optics"],
    relatedJournalSlugs: ["deakins-blade-runner-2049-lighting-architecture"],
    visibility: "PUBLIC",
    verificationStatus: "VERIFIED",
    verifiedAt: "2026-09-12"
  },

  // =========================================================================
  // 2. AI PREVIS & ANIMATIC PIPELINE
  // =========================================================================
  {
    id: "wf-ai-previs-animatic",
    slug: "multi-shot-ai-previs-animatic-pipeline",
    title: "Multi-Shot AI Previsualization & Motion Animatic Pipeline",
    category: "AI_CINEMA",
    summary:
      "An end-to-end production workflow for converting complex storyboard sequences into timed, shot-consistent motion animatics with camera moves and spatial audio.",
    purpose:
      "Solve editorial rhythm, camera coverage, lens feasibility, and transition pacing during pre-production to avoid costly reshoots and physical set miscalculations.",
    whenToUse: [
      "Complex action sequences, car chases, or visual effects sequences requiring frame-accurate camera choreography.",
      "Pitching dynamic scene coverage to producers and stunt coordinators.",
      "Testing editorial transitions (match cuts, whip pans) before shooting live principal photography."
    ],
    whenNotToUse: [
      "Pure improvised dialogue scenes where actor spontaneity dictates coverage.",
      "Final theatrical visual effects finishing (this workflow outputs pre-visualization animatics, not final pixel composite masters)."
    ],
    estimatedEffort: "2 to 4 Days per Sequence",
    difficulty: "ADVANCED",
    inputsRequired: [
      "Shot List with Camera Angles (Wide, Medium, Close-up, Over-the-Shoulder)",
      "Storyboards or Thumbnails with Camera Motion Arrows",
      "Scene Scratch Dialogue Audio & Temp Foley Tracks"
    ],
    outputsProduced: [
      "Timeline-Conformed Video Animatic (ProRes / H.264, 24.00fps)",
      "Camera Coverage Overhead Floorplan Diagrams",
      "Editorial Cut XML / EDL with Accurate Shot Durations"
    ],
    steps: [
      {
        stepNumber: 1,
        name: "Beat-Sheet to Camera Motion Scripting",
        objective: "Convert storyboard beats into precise camera motion descriptors and temporal cues.",
        action:
          "Break down the scene into distinct camera setups. For each shot, define camera movement (e.g. 'Push in at 0.5 m/s while panning 15 degrees right') and subject staging.",
        input: "Storyboard Script / Shot List",
        output: "Structured Camera Motion Script with Timecodes and Focal Lengths",
        recommendedTechniqueIds: ["tech-dolly-zoom", "tech-match-cut"],
        recommendedToolIds: ["tool-blender"],
        optionalPromptIds: [],
        commonFailure: "Specifying impossible camera moves that cannot be physically reproduced on set with real dollies or cranes.",
        qualityCheck: "Are all camera heights and travel speeds physically plausible within the intended set dimensions?",
        proTips: [
          "Mark explicit transition anchors (e.g. 'Character crosses frame left at 00:03 to mask cut')."
        ]
      },
      {
        stepNumber: 2,
        name: "Keyframe Conditioning & 3D Depth Blocking",
        objective: "Generate high-fidelity anchor frames with consistent character silhouettes and spatial depth maps.",
        action:
          "Create start and end keyframe pairs for each shot. Use simple 3D primitives or ControlNet depth maps in Blender to lock spatial relationships before generating motion.",
        input: "Camera Motion Script + Character Reference Seed",
        output: "Paired Start/End Conditioning Keyframes with Depth Passes",
        recommendedTechniqueIds: ["tech-anamorphic-optics"],
        recommendedToolIds: ["tool-flux", "tool-blender"],
        optionalPromptIds: ["prompt-02-rainy-night-street"],
        commonFailure: "Character facial geometry or wardrobe warping between starting and ending keyframes.",
        qualityCheck: "Do keyframe pairs maintain identical lighting direction and background geometry?",
        proTips: [
          "Use fixed ambient lighting values to prevent generative engines from shifting the time of day between shots."
        ]
      },
      {
        stepNumber: 3,
        name: "Latent Motion Synthesis & Video Generation",
        objective: "Synthesize temporally stable video clips from conditioned keyframes with targeted camera curves.",
        action:
          "Feed paired keyframes into video diffusion models (Runway Gen-3 Alpha / Kling 1.5 Pro) with strict camera motion velocity prompts. Generate 3–5 iterations per shot to harvest clean motion vectors.",
        input: "Conditioned Keyframe Pairs + Camera Syntax",
        output: "Raw 4–6 Second Latent Video Shot Clips (24fps)",
        recommendedTechniqueIds: ["tech-dolly-zoom", "tech-russian-arm"],
        recommendedToolIds: ["tool-runway", "tool-kling"],
        optionalPromptIds: ["prompt-02-rainy-night-street"],
        commonFailure: "Accepting clips with micro-jitter, limb duplication, or background warping during fast camera pans.",
        qualityCheck: "Does the camera momentum feel continuous across cut points without abrupt speed drops?",
        proTips: [
          "Keep generation motion scale between 3.5 and 5.0 to prevent artifact warping in diffusion passes."
        ]
      },
      {
        stepNumber: 4,
        name: "Editorial Assembly & Rhythmic Cut Conformance",
        objective: "Cut generated video clips into a non-linear editor timeline against dialogue and sound markers.",
        action:
          "Import all candidate clips into DaVinci Resolve. Trim heads and tails to match the exact dramatic beat rhythm. Apply tempo-matched cuts and test match-cut alignments.",
        input: "Raw Generated Video Clips + Dialogue Audio",
        output: "Conformed Multi-Shot Rough Cut Sequence Timeline",
        recommendedTechniqueIds: ["tech-match-cut"],
        recommendedToolIds: ["tool-davinci-resolve"],
        optionalPromptIds: [],
        commonFailure: "Letting generated clip duration dictate pacing rather than the dramatic rhythm of the scene.",
        qualityCheck: "Does the sequence hold dramatic tension when played back at full 24.00fps speed?",
        proTips: [
          "Speed ramp or freeze final frames if slight temporal elongation is needed for cut matching."
        ]
      },
      {
        stepNumber: 5,
        name: "Spatial Audio Foley & Director Previs Review",
        objective: "Integrate binaural atmospheric sound and directional foley to complete the cinematic previs.",
        action:
          "Layer environmental room tone, directional vehicle/footstep foley, and score cues. Export the completed animatic with burned-in timecode (BITC) for director and department head review.",
        input: "Rough Cut Sequence + Temp Audio Stems",
        output: "Final Director Previs Animatic Video (ProRes / MP4 with BITC & 5.1/Stereo Mix)",
        recommendedTechniqueIds: ["tech-binaural-sound"],
        recommendedToolIds: ["tool-davinci-resolve"],
        optionalPromptIds: [],
        commonFailure: "Reviewing animatics without sound, leading to false impressions of shot pacing.",
        qualityCheck: "Can department heads immediately identify required equipment, lighting rigs, and actor blocking from this cut?",
        proTips: [
          "Overlay focal length and camera height watermarks directly on screen for on-set reference."
        ]
      }
    ],
    relatedFilmIds: ["film-blade-runner-2049", "film-oppenheimer"],
    relatedTechniqueIds: [
      "tech-dolly-zoom",
      "tech-match-cut",
      "tech-binaural-sound",
      "tech-russian-arm"
    ],
    relatedToolIds: [
      "tool-runway",
      "tool-kling",
      "tool-flux",
      "tool-davinci-resolve",
      "tool-blender"
    ],
    relatedPromptIds: ["prompt-02-rainy-night-street"],
    relatedResearchIds: ["res-ai-synthetic-media-festival-disclosures"],
    relatedJournalSlugs: ["sundance-vs-cannes-premiere-disqualification-matrix"],
    visibility: "PUBLIC",
    verificationStatus: "VERIFIED",
    verifiedAt: "2026-09-12"
  },

  // =========================================================================
  // 3. POST & FESTIVAL THEATRICAL DCP MASTERING
  // =========================================================================
  {
    id: "wf-dci-dcp-mastering",
    slug: "smpte-dci-dcp-mastering-quality-control",
    title: "SMPTE 2006 Theatrical DCP Packaging & Delivery Quality Control",
    category: "POST",
    summary:
      "The definitive post-production protocol for converting graded master picture and surround audio into a flawless, unencrypted SMPTE Digital Cinema Package (DCP) for international festival projection.",
    purpose:
      "Guarantee 100% projection compatibility across Barco, Christie, and NEC DCI cinema servers at major international film festivals without color shifts, frame drops, or audio sync drift.",
    whenToUse: [
      "Preparing final exhibition deliverables for Cannes, Venice, Berlin, Sundance, Toronto, or Clermont-Ferrand.",
      "Theatrical cinema premieres requiring unencrypted DCI-compliant DCP hard drives or Aspera transfers.",
      "Archival long-term preservation of festival-winning master cuts."
    ],
    whenNotToUse: [
      "Online streaming screener submissions (use ProRes 422HQ or high-bitrate H.264 instead).",
      "Social media or web distribution."
    ],
    estimatedEffort: "1 to 2 Days (Encoding + Physical Theater QC)",
    difficulty: "MASTER",
    inputsRequired: [
      "Apple ProRes 4444 XQ Graded Master (12-bit, Rec.709 or P3-D65, 24.00fps, Textless & Texted)",
      "24-bit / 48kHz 5.1 Surround Print Master Audio Tracks (L, R, C, LFE, Ls, Rs at -24 LKFS)",
      "SMPTE 428-7 XML Master Subtitles with TTF Font File (or Clean 24.00fps SRT)"
    ],
    outputsProduced: [
      "Unencrypted SMPTE Digital Cinema Package (DCP) Folder Structure (VOLINDEX, ASSETMAP, CPL, PKL, MXF Video, MXF Audio)",
      "Linux EXT3 / NTFS MBR-Formatted USB 3.0 Cinema Ingest Drive",
      "DCP Validation & QC Hash Verification Certificate (SHA-1 Digest Check)"
    ],
    steps: [
      {
        stepNumber: 1,
        name: "Color Transform & DCI Container Framing Conformance",
        objective: "Conform picture aspect ratio to DCI Flat (1.85:1 / 1998x1080 / 3996x2160) or DCI Scope (2.39:1 / 2048x858 / 4096x1716) and verify XYZ color space conversion.",
        action:
          "Import ProRes 4444 XQ master into DaVinci Resolve. Verify exact 24.00fps native cadence (not 23.976fps). Apply DCI XYZ matrix transform without clipping highlight luminance.",
        input: "ProRes 4444 XQ Master Video",
        output: "DCI Conformed 24.00fps Master Video Track",
        recommendedTechniqueIds: ["tech-bleach-bypass"],
        recommendedToolIds: ["tool-davinci-resolve"],
        optionalPromptIds: [],
        commonFailure: "Exporting at 23.976fps instead of 24.000fps, causing cinema server audio sync drift over feature runtimes.",
        qualityCheck: "Does the video frame rate read exactly 24.000 fps in media metadata?",
        proTips: [
          "Always confirm with the festival whether they expect DCI Flat (1998x1080) with letterboxing or pure DCI Scope (2048x858)."
        ]
      },
      {
        stepNumber: 2,
        name: "5.1 Surround Sound Printmaster Conformance & Loudness Check",
        objective: "Verify 6 discrete 24-bit/48kHz audio channels and ensure -24 LKFS/LUFS integrated theatrical loudness compliance.",
        action:
          "Map 6 discrete mono WAV files to standard DCI cinema channel routing: Ch 1 (Left), Ch 2 (Right), Ch 3 (Center), Ch 4 (LFE/Sub), Ch 5 (Left Surround), Ch 6 (Right Surround). Verify dialnorm and headroom peaks.",
        input: "6 Discrete 24-bit / 48kHz WAV Audio Stems",
        output: "Conformed 6-Channel 24-bit / 48kHz Theatrical Audio Package",
        recommendedTechniqueIds: ["tech-binaural-sound"],
        recommendedToolIds: ["tool-davinci-resolve"],
        optionalPromptIds: [],
        commonFailure: "Mismatched channel routing (e.g. Swapping Center and LFE channels, causing dialogue to emit from the subwoofer).",
        qualityCheck: "Is dialogue isolated cleanly to Channel 3 (Center) with zero bleed into subwoofer?",
        proTips: [
          "Leave at least 1.0 dB true peak headroom to prevent inter-sample clipping during theater digital-to-analog conversion."
        ]
      },
      {
        stepNumber: 3,
        name: "SMPTE 428-7 Timed Text XML Subtitle Integration",
        objective: "Convert subtitle script into frame-accurate SMPTE timed XML with embedded font packaging.",
        action:
          "Import SRT into subtitle authoring tool. Format for SMPTE 428-7 XML with CineChrome-compliant yellow or white typography, bottom 8% vertical margin offset, and embedded OpenType/TrueType font file.",
        input: "Master Dialogue SRT File + Approved TrueType Font",
        output: "SMPTE 428-7 Subtitle XML Asset with TTF Font Binary",
        recommendedTechniqueIds: [],
        recommendedToolIds: ["tool-dcp-o-matic"],
        optionalPromptIds: [],
        commonFailure: "Using non-standard fonts that fail to render on proprietary server engines, resulting in missing subtitles during screening.",
        qualityCheck: "Are subtitle in-points and out-points strictly snapped to 24fps frames without half-frame overlaps?",
        proTips: [
          "Always use standard Arial, Liberation Sans, or Cinebee OpenType fonts for 100% hardware compatibility."
        ]
      },
      {
        stepNumber: 4,
        name: "JPEG 2000 Encoding & DCI Package Wrap",
        objective: "Encode picture to DCI-compliant JPEG 2000 MXF at 250 Mbps max bitrate and wrap all assets into standard SMPTE DCP container.",
        action:
          "Use DCP-o-matic 2 or DaVinci Resolve Studio to encode video to DCI JPEG 2000 XYZ. Generate standard CPL (Composition Playlist), PKL (Packing List), ASSETMAP, and VOLINDEX XML descriptors with digital naming convention.",
        input: "Conformed Picture, Audio, and Subtitle Assets",
        output: "Complete SMPTE 2006 Unencrypted DCP Package",
        recommendedTechniqueIds: [],
        recommendedToolIds: ["tool-dcp-o-matic", "tool-davinci-resolve"],
        optionalPromptIds: [],
        commonFailure: "Exceeding 250 Mbps peak bitrate, causing older festival cinema servers to stutter or abort playback.",
        qualityCheck: "Does the DCP naming convention match ISDCF standard (e.g. MovieTitle_FTR-1_S_EN-XX_51_2K_20260912_CI_SMPTE_OV)?",
        proTips: [
          "Target an average bitrate of 175–200 Mbps to ensure total stability across all projector generations."
        ]
      },
      {
        stepNumber: 5,
        name: "Digital Ingest Hash Verification & Cinema Theater QC",
        objective: "Verify SHA-1 checksum integrity and conduct full physical cinema playback on a calibrated DCI projector.",
        action:
          "Format a dedicated USB 3.0 drive with MBR partition table and Linux EXT3 (or NTFS) filesystem. Copy DCP folder to root directory. Run SHA-1 hash validation. Ingest into a calibrated DCI theater server and verify head-to-tail picture sync and surround panning.",
        input: "Completed DCP Package + USB 3.0 Hard Drive",
        output: "Certified Master Festival DCP Drive + QC Sign-off Sheet",
        recommendedTechniqueIds: [],
        recommendedToolIds: ["tool-dcp-o-matic"],
        optionalPromptIds: [],
        commonFailure: "Formatting drive with GPT partition table or exFAT filesystem, which cannot be read by 90% of festival cinema servers.",
        qualityCheck: "Has the drive been verified with a Linux EXT3 MBR partition table and tested on a physical Doremi or Dolby cinema server?",
        proTips: [
          "Always pack a duplicate backup drive with NTFS formatting in case of venue operating system quirks."
        ]
      }
    ],
    relatedFilmIds: [
      "film-all-we-imagine-as-light",
      "film-anatomy-of-a-fall",
      "film-oppenheimer"
    ],
    relatedTechniqueIds: ["tech-bleach-bypass", "tech-binaural-sound"],
    relatedToolIds: ["tool-davinci-resolve", "tool-dcp-o-matic"],
    relatedPromptIds: [],
    relatedResearchIds: [
      "res-cannes-competition-dcp-specs",
      "res-sundance-world-cinema-premiere-rules"
    ],
    relatedJournalSlugs: ["sundance-vs-cannes-premiere-disqualification-matrix"],
    visibility: "PUBLIC",
    verificationStatus: "VERIFIED",
    verifiedAt: "2026-09-12"
  },

  // =========================================================================
  // 4. COMMERCIAL HIGH-SPEED AUTOMOTIVE DESIGN
  // =========================================================================
  {
    id: "wf-high-speed-automotive-commercial",
    slug: "high-speed-commercial-motion-design",
    title: "Virtual High-Speed Commercial Motion Design & Chase Capture",
    category: "PRODUCTION",
    summary:
      "A specialized technical pipeline for crafting high-energy automotive and commercial motion sequences with realistic dynamic vehicle reflections and kinetic camera tracking.",
    purpose:
      "Achieve multimillion-dollar commercial pursuit car cinematography aesthetics using synthetic motion design and precise virtual lens mechanics.",
    whenToUse: [
      "High-end automotive commercials, luxury brand spots, and dynamic action vehicle sequences.",
      "Pitching precision camera pursuit choreography to automotive clients and advertising agencies.",
      "Synthesizing high-speed tracking shots where physical road closures and pursuit cranes are budget-prohibitive."
    ],
    whenNotToUse: [
      "Intimate character dialogue drama.",
      "Static tabletop commercial packshots."
    ],
    estimatedEffort: "2 to 3 Days per 30-Second Commercial Spot",
    difficulty: "ADVANCED",
    inputsRequired: [
      "Brand Style Guide & Hero Vehicle CAD/3D Model or Reference Photos",
      "Storyboard with Camera Pursuit Vector Overlays (Tracking, Russian Arm Swing, Overtake)",
      "Target Color Palette & Commercial Finish Moodboard"
    ],
    outputsProduced: [
      "Series of 6–10 High-Speed Master Commercial Shots (4K ProRes 422HQ)",
      "Synchronized Dynamic Reflection & Environment Matte Passes",
      "Final 30-Second Master Commercial Edit with Color & Sound Design"
    ],
    steps: [
      {
        stepNumber: 1,
        name: "Pursuit Choreography & Shutter Angle Calculation",
        objective: "Calculate vehicle speeds, camera pursuit rig velocities, and shutter angles to create authentic cinematic motion blur.",
        action:
          "Design camera path relative to the hero vehicle. Specify a 90-degree or 180-degree shutter angle (1/96s or 1/48s at 24fps) depending on desired motion crispness.",
        input: "Automotive Storyboard & Location Environment",
        output: "Speed-Calibrated Camera Path Blueprint",
        recommendedTechniqueIds: ["tech-russian-arm"],
        recommendedToolIds: ["tool-blender"],
        optionalPromptIds: [],
        commonFailure: "Using excessive shutter speeds that produce hyper-strobe stutter instead of smooth cinematic road motion blur.",
        qualityCheck: "Does the wheel rotation and road blur match the perceived 120 km/h vehicle velocity?",
        proTips: [
          "Position the camera low (18 inches off asphalt) to exaggerate road speed and dramatic vehicle stance."
        ]
      },
      {
        stepNumber: 2,
        name: "Vehicle Hard-Surface Conditioning & Reflection Mapping",
        objective: "Generate photorealistic vehicle body panels with physically accurate environment specular reflections and clear windshield transparency.",
        action:
          "Condition the generative pipeline using consistent hard-surface vehicle seeds and metallic shader prompts. Ensure environment buildings and streetlights reflect realistically along body contours.",
        input: "Hero Vehicle Model References + Lighting Map",
        output: "Consistent Hero Vehicle Conditioning Plates",
        recommendedTechniqueIds: ["tech-volumetric-haze"],
        recommendedToolIds: ["tool-flux", "tool-midjourney"],
        optionalPromptIds: ["prompt-02-rainy-night-street"],
        commonFailure: "Generative warping of wheels, rims, or brand emblems during high-speed motion.",
        qualityCheck: "Are rim spokes, badge logos, and headlight geometries geometrically exact across all angles?",
        proTips: [
          "Apply polarized filter prompts ('circular polarizer cutting reflections at 45 degrees') to reveal interior driver silhouettes."
        ]
      },
      {
        stepNumber: 3,
        name: "Russian Arm Crane Motion Synthesis",
        objective: "Synthesize dynamic Russian Arm camera sweeping motion starting low near the front tire and sweeping up over the roof.",
        action:
          "Execute video generation with complex 3-axis motion prompts (crane lift, boom swing, camera pan tracking vehicle center). Generate multi-pass iterations to lock kinetic momentum.",
        input: "Conditioned Vehicle Keyframes + 3-Axis Motion Prompts",
        output: "High-Speed Kinetic Motion Video Shots",
        recommendedTechniqueIds: ["tech-russian-arm"],
        recommendedToolIds: ["tool-runway", "tool-kling"],
        optionalPromptIds: [],
        commonFailure: "Camera movements that feel like weightless video-game fly-throughs without inertial dampening.",
        qualityCheck: "Does the camera move exhibit realistic crane mass, acceleration curves, and subtle road vibration?",
        proTips: [
          "Prompt for subtle chassis roll and tire compression when the vehicle corners aggressively."
        ]
      },
      {
        stepNumber: 4,
        name: "Atmospheric Smoke & Headlight Flare Compositing",
        objective: "Layer volumetric headlight illumination cones, tire smoke, and airborne mist particles in post-production.",
        action:
          "Composite optical anamorphic flares and atmospheric particulate matter over the vehicle motion passes in After Effects to glue the car into the real-world environment.",
        input: "Raw Motion Video Passes + Optical Flare Assets",
        output: "Composited Master Commercial Plates",
        recommendedTechniqueIds: ["tech-volumetric-haze", "tech-anamorphic-optics"],
        recommendedToolIds: ["tool-after-effects"],
        optionalPromptIds: [],
        commonFailure: "Overpowering flares that obscure vehicle body lines and brand branding.",
        qualityCheck: "Do light beams react dynamically to road bumps and vehicle pitch changes?",
        proTips: [
          "Use 32-bit float color depth in After Effects to prevent banding around intense headlight hotspots."
        ]
      },
      {
        stepNumber: 5,
        name: "Commercial High-Gloss Color Grading & Sound Mix",
        objective: "Apply commercial contrast curves, metallic specular pop, and aggressive engine sound design.",
        action:
          "Conform the 30-second timeline in DaVinci Resolve. Apply high-contrast commercial LUTs with deep blacks and rich automotive paint saturation. Mix high-octane V8/electric motor sound design with sub-bass impact.",
        input: "Composited Video Plates + Multi-Track Engine Foley",
        output: "Broadcast & Web Ready 30-Second Commercial Master (ProRes 422HQ / H.264)",
        recommendedTechniqueIds: ["tech-chiaroscuro-lighting"],
        recommendedToolIds: ["tool-davinci-resolve"],
        optionalPromptIds: [],
        commonFailure: "Crushing shadow details on black tires or dark paint finishes.",
        qualityCheck: "Does the paint color match client brand Pantone specifications under both highlight and shadow areas?",
        proTips: [
          "Isolate vehicle paint hue with a clean qualified mask to dial in saturation independently of the environment background."
        ]
      }
    ],
    relatedFilmIds: ["film-blade-runner-2049"],
    relatedTechniqueIds: [
      "tech-russian-arm",
      "tech-volumetric-haze",
      "tech-anamorphic-optics",
      "tech-chiaroscuro-lighting"
    ],
    relatedToolIds: [
      "tool-runway",
      "tool-kling",
      "tool-davinci-resolve",
      "tool-after-effects",
      "tool-flux",
      "tool-midjourney",
      "tool-blender"
    ],
    relatedPromptIds: ["prompt-02-rainy-night-street"],
    relatedResearchIds: ["res-anamorphic-vs-spherical-optics"],
    relatedJournalSlugs: ["deakins-blade-runner-2049-lighting-architecture"],
    visibility: "PUBLIC",
    verificationStatus: "VERIFIED",
    verifiedAt: "2026-09-12"
  }
];

// ============================================================================
// QUERY & GETTER HELPERS
// ============================================================================

export function getAllPublicWorkflows(): CanonicalWorkflow[] {
  return canonicalWorkflows.filter((w) => w.visibility === "PUBLIC");
}

export function getWorkflowBySlug(slug: string): CanonicalWorkflow | undefined {
  return canonicalWorkflows.find((w) => w.slug === slug && w.visibility === "PUBLIC");
}

export function getWorkflowById(id: string): CanonicalWorkflow | undefined {
  return canonicalWorkflows.find((w) => w.id === id && w.visibility === "PUBLIC");
}

export function getWorkflowsByCategory(
  category: CanonicalWorkflowCategory
): CanonicalWorkflow[] {
  return canonicalWorkflows.filter(
    (w) => w.category === category && w.visibility === "PUBLIC"
  );
}

export function getWorkflowsByTechniqueId(techniqueId: string): CanonicalWorkflow[] {
  return canonicalWorkflows.filter(
    (w) =>
      w.visibility === "PUBLIC" &&
      (w.relatedTechniqueIds.includes(techniqueId) ||
        w.steps.some((s) => s.recommendedTechniqueIds.includes(techniqueId)))
  );
}

export function getWorkflowsByToolId(toolId: string): CanonicalWorkflow[] {
  return canonicalWorkflows.filter(
    (w) =>
      w.visibility === "PUBLIC" &&
      (w.relatedToolIds.includes(toolId) ||
        w.steps.some((s) => s.recommendedToolIds.includes(toolId)))
  );
}

export function getWorkflowsByFilmId(filmId: string): CanonicalWorkflow[] {
  return canonicalWorkflows.filter(
    (w) => w.visibility === "PUBLIC" && w.relatedFilmIds.includes(filmId)
  );
}
