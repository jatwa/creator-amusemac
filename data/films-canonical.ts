import {
  Film,
  Person,
  PersonRole,
  FilmFormat,
  PremiereType,
} from "./film-intelligence-types";

// ============================================================================
// CANONICAL PEOPLE REGISTRY (DEDUPLICATED & ALIAS-MAPPED)
// ============================================================================

export const canonicalPeople: Person[] = [
  {
    id: "person-marcus-vance",
    slug: "marcus-vance",
    name: "Marcus Vance",
    alternateNames: ["M. Vance", "Marc Vance"],
    primaryRole: "DIRECTOR",
    secondaryRoles: ["AI_ARTIST", "PRODUCER"],
    biography:
      "Marcus Vance is a London and Los Angeles-based commercial director and AI cinema pioneer specializing in photorealistic automotive, luxury goods, and high-speed motion design. Renowned for hybrid production workflows combining Midjourney v6 keyframing, Runway Gen-3 physical camera coordinates, and ACES DaVinci color grading.",
    country: "United Kingdom",
    avatarUrl: "/avatars/marcus-vance.jpg",
    filmography: [
      {
        filmId: "film-the-lucid-ride",
        title: "The Lucid Ride",
        year: 2026,
        role: "DIRECTOR",
        creditTitle: "Director & AI Cinematography Architect",
      },
      {
        filmId: "film-synthetic-horizon",
        title: "Synthetic Horizon",
        year: 2026,
        role: "AI_ARTIST",
        creditTitle: "Lead AI Motion Designer",
      },
    ],
    festivalAccolades: [
      {
        festivalName: "Runway AI Film Festival",
        festivalId: "fest-runway",
        editionId: "ed-runway-2026",
        year: 2026,
        awardTitle: "Best Commercial Spec & Virtual Cinematography",
        filmTitle: "The Lucid Ride",
      },
    ],
    socialLinks: {
      website: "https://creatorintels.com/people/marcus-vance",
      vimeo: "https://vimeo.com/marcusvance",
      instagram: "https://instagram.com/marcusvance.film",
    },
    visibility: "PUBLIC",
    verifiedAt: "2026-08-20",
  },
  {
    id: "person-elena-rostova",
    slug: "elena-rostova",
    name: "Elena Rostova",
    alternateNames: ["E. Rostova", "Alena Rostova"],
    primaryRole: "VFX_SUPERVISOR",
    secondaryRoles: ["DIRECTOR", "AI_ARTIST"],
    biography:
      "Elena Rostova is a Canadian visual effects supervisor and technical director with over a decade of studio experience in pipeline architecture. She pioneered local open-weight ComfyUI and Flux.1 LoRA character consistency pipelines for confidential narrative previsualization in high-stakes action and sci-fi features.",
    country: "Canada",
    avatarUrl: "/avatars/elena-rostova.jpg",
    filmography: [
      {
        filmId: "film-the-extraction",
        title: "The Extraction",
        year: 2026,
        role: "VFX_SUPERVISOR",
        creditTitle: "VFX Supervisor & Previs Director",
      },
      {
        filmId: "film-echoes-of-the-wasteland",
        title: "Echoes of the Wasteland",
        year: 2025,
        role: "VFX_SUPERVISOR",
        creditTitle: "Virtual Production Supervisor",
      },
    ],
    festivalAccolades: [
      {
        festivalName: "Tribeca Festival",
        festivalId: "fest-tribeca",
        editionId: "ed-tribeca-2026",
        year: 2026,
        awardTitle: "Innovative Previsualization & Pipeline Design",
        filmTitle: "The Extraction",
      },
    ],
    socialLinks: {
      website: "https://creatorintels.com/people/elena-rostova",
      linkedin: "https://linkedin.com/in/elenarostova-vfx",
    },
    visibility: "PUBLIC",
    verifiedAt: "2026-08-18",
  },
  {
    id: "person-claire-delacroix",
    slug: "claire-delacroix",
    name: "Claire Delacroix",
    alternateNames: ["C. Delacroix"],
    primaryRole: "DIRECTOR",
    secondaryRoles: ["SCREENWRITER"],
    biography:
      "Claire Delacroix is a French auteur filmmaker whose psychological dramas explore the boundaries between memory, digital hallucination, and European realism. A graduate of La Fémis, her work has screened in official competition at Cannes and Venice.",
    country: "France",
    avatarUrl: "/avatars/claire-delacroix.jpg",
    filmography: [
      {
        filmId: "film-chronicles-of-the-croisette",
        title: "Chronicles of the Croisette",
        year: 2026,
        role: "DIRECTOR",
        creditTitle: "Director & Screenwriter",
      },
    ],
    festivalAccolades: [
      {
        festivalName: "Festival de Cannes",
        festivalId: "fest-cannes",
        editionId: "ed-cannes-2026",
        year: 2026,
        awardTitle: "Official Short Film Selection — In Competition",
        filmTitle: "Chronicles of the Croisette",
      },
    ],
    socialLinks: {
      website: "https://creatorintels.com/people/claire-delacroix",
      imdb: "https://imdb.com/name/nm10839210",
    },
    visibility: "PUBLIC",
    verifiedAt: "2026-08-20",
  },
  {
    id: "person-jean-luc-moreau",
    slug: "jean-luc-moreau",
    name: "Jean-Luc Moreau",
    alternateNames: ["J.L. Moreau", "Jean Luc Moreau"],
    primaryRole: "CINEMATOGRAPHER",
    secondaryRoles: ["COLORIST"],
    biography:
      "Jean-Luc Moreau is an AFC-accredited director of photography specializing in anamorphic large-format cinematography, tungsten night exteriors, and photochemical emulation on digital sensors. He serves as a frequent technical contributor to the Creator Intel Cinema Research Desk.",
    country: "France",
    avatarUrl: "/avatars/jean-luc-moreau.jpg",
    filmography: [
      {
        filmId: "film-chronicles-of-the-croisette",
        title: "Chronicles of the Croisette",
        year: 2026,
        role: "CINEMATOGRAPHER",
        creditTitle: "Director of Photography",
      },
    ],
    festivalAccolades: [
      {
        festivalName: "Festival de Cannes",
        festivalId: "fest-cannes",
        editionId: "ed-cannes-2026",
        year: 2026,
        awardTitle: "CST Award for Technical Artist (Nominee)",
        filmTitle: "Chronicles of the Croisette",
      },
    ],
    socialLinks: {
      website: "https://creatorintels.com/people/jean-luc-moreau",
      instagram: "https://instagram.com/jlmoreau.cinematography",
    },
    visibility: "PUBLIC",
    verifiedAt: "2026-08-15",
  },
  {
    id: "person-sora-nomura",
    slug: "sora-nomura",
    name: "Sora Nomura",
    alternateNames: ["S. Nomura", "Nomura Sora"],
    primaryRole: "DIRECTOR",
    secondaryRoles: ["AI_ARTIST", "SOUND_DESIGNER"],
    biography:
      "Sora Nomura is a Tokyo-based transmedia artist and director investigating cybernetics, urban alienation, and algorithmic cinema. His works fuse generative neural synthesis with live-action 16mm archival footage.",
    country: "Japan",
    avatarUrl: "/avatars/sora-nomura.jpg",
    filmography: [
      {
        filmId: "film-synthetic-horizon",
        title: "Synthetic Horizon",
        year: 2026,
        role: "DIRECTOR",
        creditTitle: "Director & Sound Architect",
      },
    ],
    festivalAccolades: [
      {
        festivalName: "Tribeca Festival",
        festivalId: "fest-tribeca",
        editionId: "ed-tribeca-2026",
        year: 2026,
        awardTitle: "Tribeca X AI Showcase Juror Award",
        filmTitle: "Synthetic Horizon",
      },
    ],
    socialLinks: {
      website: "https://creatorintels.com/people/sora-nomura",
      twitter: "https://x.com/soranomura_film",
    },
    visibility: "PUBLIC",
    verifiedAt: "2026-08-19",
  },
  {
    id: "person-mateo-alvarez",
    slug: "mateo-alvarez",
    name: "Mateo Alvarez",
    alternateNames: ["M. Alvarez"],
    primaryRole: "DIRECTOR",
    secondaryRoles: ["SCREENWRITER", "PRODUCER"],
    biography:
      "Mateo Alvarez is a Mexican-American narrative director whose gritty neo-western and speculative fiction films explore environmental collapse and borderland folklore. A Sundance Institute Directing Fellow.",
    country: "Mexico",
    avatarUrl: "/avatars/mateo-alvarez.jpg",
    filmography: [
      {
        filmId: "film-echoes-of-the-wasteland",
        title: "Echoes of the Wasteland",
        year: 2025,
        role: "DIRECTOR",
        creditTitle: "Writer & Director",
      },
    ],
    festivalAccolades: [
      {
        festivalName: "Sundance Film Festival",
        festivalId: "fest-sundance",
        editionId: "ed-sundance-2026",
        year: 2026,
        awardTitle: "Short Film Grand Jury Prize Nominee",
        filmTitle: "Echoes of the Wasteland",
      },
    ],
    socialLinks: {
      website: "https://creatorintels.com/people/mateo-alvarez",
      vimeo: "https://vimeo.com/mateoalvarez",
    },
    visibility: "PUBLIC",
    verifiedAt: "2026-08-17",
  },
  {
    id: "person-kenji-sato",
    slug: "kenji-sato",
    name: "Kenji Sato",
    alternateNames: ["K. Sato", "Sato Kenji"],
    primaryRole: "EDITOR",
    secondaryRoles: ["SOUND_DESIGNER", "COLORIST"],
    biography:
      "Kenji Sato is an experimental editor and sound designer based in Kyoto, renowned for polyrhythmic pacing, micro-tonal sound synthesis, and spatio-temporal AI video upscaling workflows.",
    country: "Japan",
    avatarUrl: "/avatars/kenji-sato.jpg",
    filmography: [
      {
        filmId: "film-neural-drift-tokyo",
        title: "Neural Drift: Tokyo Midnight",
        year: 2026,
        role: "EDITOR",
        creditTitle: "Editor & Spatial Sound Designer",
      },
      {
        filmId: "film-synthetic-horizon",
        title: "Synthetic Horizon",
        year: 2026,
        role: "SOUND_DESIGNER",
        creditTitle: "Dolby Atmos Mastering Engineer",
      },
    ],
    festivalAccolades: [
      {
        festivalName: "Runway AI Film Festival",
        festivalId: "fest-runway",
        editionId: "ed-runway-2026",
        year: 2026,
        awardTitle: "Excellence in Sound Design & Spatial Audio",
        filmTitle: "Neural Drift: Tokyo Midnight",
      },
    ],
    socialLinks: {
      website: "https://creatorintels.com/people/kenji-sato",
      vimeo: "https://vimeo.com/kenjisato",
    },
    visibility: "PUBLIC",
    verifiedAt: "2026-08-16",
  },
];

// ============================================================================
// CANONICAL FILM DATABASE (RELATIONAL CREDITS & TECHNICAL SPECIFICATIONS)
// ============================================================================

export const canonicalFilms: Film[] = [
  {
    id: "film-the-lucid-ride",
    slug: "the-lucid-ride",
    title: "The Lucid Ride",
    originalTitle: "The Lucid Ride: Spec 60",
    releaseYear: 2026,
    runtimeMinutes: 1,
    countryOfOrigin: ["United Kingdom", "United States"],
    language: ["English"],
    format: "COMMERCIAL",
    genres: ["Automotive", "Commercial", "Cyberpunk", "Action"],
    logline:
      "A 60-second high-energy automotive spec film following an electric hypercar navigating midnight rainstorm expressways in Tokyo and Mumbai with zero practical filming.",
    synopsis:
      "Produced entirely via multi-model generative AI pipelines, The Lucid Ride demonstrates the state-of-the-art in virtual commercial cinematography. Utilizing Midjourney v6.1 and Flux.1 Pro for master photographic keyframing, Runway Gen-3 Alpha for camera movement, Kling AI 1.5 for hydrodynamic tire rotation physics, and DaVinci Resolve Studio for ACES color science, the film achieves photorealistic commercial production fidelity without physical camera plates.",
    posterUrl: "/posters/the-lucid-ride.jpg",
    trailerUrl: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-code-31940-large.mp4",
    
    // Relational Credits using Canonical Person IDs
    directors: [
      {
        personId: "person-marcus-vance",
        displayName: "Marcus Vance",
        creditRole: "Director & Virtual Cinematographer",
      },
    ],
    cinematographers: [
      {
        personId: "person-marcus-vance",
        displayName: "Marcus Vance",
        creditRole: "AI Cinematography Architect",
      },
    ],
    writers: [
      {
        personId: "person-marcus-vance",
        displayName: "Marcus Vance",
        creditRole: "Concept & Treatment",
      },
    ],
    producers: [
      {
        personId: "person-marcus-vance",
        displayName: "Marcus Vance",
        creditRole: "Executive Producer",
      },
    ],
    cast: [
      {
        actorName: "Virtual Pilot Alpha (Act-One Capture)",
        characterName: "Hypercar Driver",
      },
    ],
    aiAndVfxCredits: [
      {
        personId: "person-marcus-vance",
        name: "Marcus Vance",
        role: "Lead Prompt Engineer & Generative Supervisor",
        toolsUsed: ["Midjourney v6.1", "Flux.1 Pro", "Runway Gen-3 Alpha", "Kling AI 1.5", "Topaz Video AI 5", "DaVinci Resolve Studio"],
      },
    ],

    // Premiere & Circuit
    premiereStatus: "WORLD_PREMIERE",
    premiereFestivalId: "fest-runway",
    premiereEditionId: "ed-runway-2026",
    festivalHistory: [
      {
        festivalId: "fest-runway",
        editionId: "ed-runway-2026",
        festivalName: "Runway AI Film Festival",
        year: 2026,
        section: "Brand & Commercial Showcase",
        premiereHeld: "WORLD_PREMIERE",
        awardWon: "Best Commercial Spec & Virtual Cinematography",
        screeningDate: "2026-05-12",
      },
      {
        festivalId: "fest-cannes",
        editionId: "ed-cannes-2026",
        festivalName: "Festival de Cannes",
        year: 2026,
        section: "Marché du Film — AI Cinema Showcase",
        premiereHeld: "CONTINENTAL_PREMIERE",
        screeningDate: "2026-05-18",
      },
    ],

    // Technical Specifications
    technicalSpecs: {
      aspectRatio: "2.39:1 Anamorphic",
      cameraSystems: ["Virtual Russian Arm Rig", "Arri Alexa 65 Sensor Emulation"],
      lenses: ["Kowa Anamorphic 35mm T2.2 (Optical Emulation)"],
      captureFormat: "Digital Generative (4K Master ProRes 422 HQ)",
      colorSpace: "ACEScc / DCI-P3 D65",
      soundFormat: "Dolby 5.1 Surround / Linear PCM 24-bit 48kHz",
      aiGenerativeModels: ["Midjourney v6.1", "Flux.1 Pro", "Runway Gen-3 Alpha", "Kling AI 1.5", "Topaz Video AI 5"],
    },
    streamingLinks: [
      { platform: "Creator Intel Case Studies", url: "/stories/the-lucid-ride" },
    ],
    visibility: "PUBLIC",
    verifiedAt: "2026-08-20",
  },
  {
    id: "film-the-extraction",
    slug: "the-extraction",
    title: "The Extraction",
    originalTitle: "The Extraction: Previs Animatic",
    releaseYear: 2026,
    runtimeMinutes: 3,
    countryOfOrigin: ["Canada", "United States"],
    language: ["English"],
    format: "SHORT",
    genres: ["Sci-Fi", "Action", "Cyberpunk", "Previs"],
    logline:
      "A 3-minute sci-fi infiltration sequence pre-visualized with self-hosted open-weight LoRAs and modular ComfyUI pipelines to pitch a studio feature.",
    synopsis:
      "Designed as a proof-of-concept visual effects animatic for a major sci-fi studio pitch, The Extraction demonstrates end-to-end actor and costume continuity across 12 consecutive shots. By training custom character LoRAs on local RTX 4090 workstations and animating via Wan 2.1 in ComfyUI, the production team eliminated cloud data leakage while slashing previsualization costs by $120,000.",
    posterUrl: "/posters/the-extraction.jpg",
    trailerUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-green-screen-41582-large.mp4",
    
    directors: [
      {
        personId: "person-elena-rostova",
        displayName: "Elena Rostova",
        creditRole: "Previs Director & VFX Supervisor",
      },
    ],
    cinematographers: [
      {
        personId: "person-elena-rostova",
        displayName: "Elena Rostova",
        creditRole: "Virtual Camera Operator",
      },
    ],
    writers: [
      {
        personId: "person-elena-rostova",
        displayName: "Elena Rostova",
        creditRole: "Story & Action Choreography",
      },
    ],
    producers: [
      {
        personId: "person-elena-rostova",
        displayName: "Elena Rostova",
        creditRole: "Producer",
      },
    ],
    cast: [
      {
        actorName: "Operative Vesper (Synthetic Identity #409)",
        characterName: "Squad Leader",
      },
    ],
    aiAndVfxCredits: [
      {
        personId: "person-elena-rostova",
        name: "Elena Rostova",
        role: "ComfyUI Pipeline Architect",
        toolsUsed: ["Flux.1 Dev", "Wan 2.1 (Open Weights)", "ComfyUI", "DaVinci Resolve Studio", "ElevenLabs"],
      },
    ],

    premiereStatus: "WORLD_PREMIERE",
    premiereFestivalId: "fest-tribeca",
    premiereEditionId: "ed-tribeca-2026",
    festivalHistory: [
      {
        festivalId: "fest-tribeca",
        editionId: "ed-tribeca-2026",
        festivalName: "Tribeca Festival",
        year: 2026,
        section: "Games & Emerging Media",
        premiereHeld: "WORLD_PREMIERE",
        awardWon: "Innovative Previsualization & Pipeline Design",
        screeningDate: "2026-06-08",
      },
    ],

    technicalSpecs: {
      aspectRatio: "2.39:1 Scope",
      cameraSystems: ["Virtual Cine Rig (Steadicam & Drone Emulation)"],
      lenses: ["Cooke Anamorphic /i Full Frame Plus 40mm T2.3"],
      captureFormat: "1080p ProRes 422 HQ Master",
      colorSpace: "Rec.709 / DaVinci YRGB",
      soundFormat: "Stereo 24-bit 48kHz PCM",
      aiGenerativeModels: ["Flux.1 Dev", "Wan 2.1 (Open Weights)", "ElevenLabs Voice Model"],
    },
    streamingLinks: [
      { platform: "Creator Intel Case Studies", url: "/stories/cyberpunk-extraction" },
    ],
    visibility: "PUBLIC",
    verifiedAt: "2026-08-18",
  },
  {
    id: "film-chronicles-of-the-croisette",
    slug: "chronicles-of-the-croisette",
    title: "Chronicles of the Croisette",
    originalTitle: "Chroniques de la Croisette",
    releaseYear: 2026,
    runtimeMinutes: 18,
    countryOfOrigin: ["France"],
    language: ["French"],
    format: "SHORT",
    genres: ["Drama", "Mystery", "Auteur"],
    logline:
      "A young projectionist during the 1972 Cannes Film Festival uncovers an uncatalogued celluloid reel that begins to alter the reality of the festival palace.",
    synopsis:
      "Shot on the ARRI Alexa 35 with vintage Cooke anamorphic primes and mastered in full DCI SMPTE-2006 DCP packaging, Chronicles of the Croisette explores cinema history through tactile celluloid restoration and atmospheric psychological tension. Selected in official competition for the Short Film Palme d'Or at the 79th Festival de Cannes.",
    posterUrl: "/posters/chronicles-croisette.jpg",
    trailerUrl: "https://assets.mixkit.co/videos/preview/mixkit-vintage-film-projector-playing-a-movie-41981-large.mp4",

    directors: [
      {
        personId: "person-claire-delacroix",
        displayName: "Claire Delacroix",
        creditRole: "Director",
      },
    ],
    cinematographers: [
      {
        personId: "person-jean-luc-moreau",
        displayName: "Jean-Luc Moreau",
        creditRole: "Director of Photography",
      },
    ],
    writers: [
      {
        personId: "person-claire-delacroix",
        displayName: "Claire Delacroix",
        creditRole: "Screenplay",
      },
    ],
    producers: [
      {
        personId: "person-claire-delacroix",
        displayName: "Claire Delacroix",
        creditRole: "Producer",
      },
    ],
    cast: [
      {
        actorName: "Antoine Laurent",
        characterName: "Marc (The Projectionist)",
      },
      {
        actorName: "Sophie Vaneck",
        characterName: "Hélène (Festival Delegate)",
      },
    ],

    premiereStatus: "WORLD_PREMIERE",
    premiereFestivalId: "fest-cannes",
    premiereEditionId: "ed-cannes-2026",
    festivalHistory: [
      {
        festivalId: "fest-cannes",
        editionId: "ed-cannes-2026",
        festivalName: "Festival de Cannes",
        year: 2026,
        section: "Short Film Palme d'Or Competition",
        premiereHeld: "WORLD_PREMIERE",
        awardWon: "Official Selection — In Competition",
        screeningDate: "2026-05-21",
      },
    ],

    technicalSpecs: {
      aspectRatio: "2.39:1 DCI Scope",
      cameraSystems: ["ARRI Alexa 35", "ARRI Codex RAW"],
      lenses: ["Cooke Anamorphic /i Special Flare Primes (32mm, 50mm, 75mm)"],
      captureFormat: "4.6K ARRIRAW Open Gate",
      colorSpace: "ACEScc (AP1) / DCI-P3 D65 Theatrical Master",
      soundFormat: "SMPTE 2006 Discrete 5.1 / 24-bit 48kHz Uncompressed PCM",
    },
    visibility: "PUBLIC",
    verifiedAt: "2026-08-20",
  },
  {
    id: "film-synthetic-horizon",
    slug: "synthetic-horizon",
    title: "Synthetic Horizon",
    originalTitle: "シンセティック・ホライズン",
    releaseYear: 2026,
    runtimeMinutes: 12,
    countryOfOrigin: ["Japan", "United States"],
    language: ["Japanese", "English"],
    format: "AI_NARRATIVE",
    genres: ["Sci-Fi", "Experimental", "Cyberpunk"],
    logline:
      "A philosophical investigation into synthetic memory and neural simulation as a lone deep-space radio operator receives broadcasts from an Earth that no longer exists.",
    synopsis:
      "Winner of the Tribeca X AI Showcase Juror Award, Synthetic Horizon seamlessly blends physical 16mm grain capture with high-resolution Runway Gen-3 and Flux.1 neural scene generation. The film adheres to strict DCI theatrical color pipelines, proving that AI-authored narratives can achieve premiere status on Tier-1 festival circuits.",
    posterUrl: "/posters/synthetic-horizon.jpg",
    trailerUrl: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-code-31940-large.mp4",

    directors: [
      {
        personId: "person-sora-nomura",
        displayName: "Sora Nomura",
        creditRole: "Director & Sound Architect",
      },
    ],
    cinematographers: [
      {
        personId: "person-marcus-vance",
        displayName: "Marcus Vance",
        creditRole: "Virtual Cinematography Consultant",
      },
    ],
    writers: [
      {
        personId: "person-sora-nomura",
        displayName: "Sora Nomura",
        creditRole: "Screenplay",
      },
    ],
    producers: [
      {
        personId: "person-sora-nomura",
        displayName: "Sora Nomura",
        creditRole: "Producer",
      },
    ],
    cast: [
      {
        actorName: "Rei Takahashi (Voice & Performance Capture)",
        characterName: "Operator KAI-7",
      },
    ],
    aiAndVfxCredits: [
      {
        personId: "person-sora-nomura",
        name: "Sora Nomura",
        role: "Generative Director",
        toolsUsed: ["Midjourney v6.1", "Runway Gen-3 Alpha", "Flux.1 Pro", "ElevenLabs"],
      },
      {
        personId: "person-kenji-sato",
        name: "Kenji Sato",
        role: "Dolby Atmos Mastering Engineer",
      },
    ],

    premiereStatus: "WORLD_PREMIERE",
    premiereFestivalId: "fest-tribeca",
    premiereEditionId: "ed-tribeca-2026",
    festivalHistory: [
      {
        festivalId: "fest-tribeca",
        editionId: "ed-tribeca-2026",
        festivalName: "Tribeca Festival",
        year: 2026,
        section: "Tribeca X AI Cinema Showcase",
        premiereHeld: "WORLD_PREMIERE",
        awardWon: "Tribeca X AI Showcase Juror Award",
        screeningDate: "2026-06-11",
      },
    ],

    technicalSpecs: {
      aspectRatio: "1.85:1 DCI Flat",
      cameraSystems: ["Bolex H16 Reflex (Archival Plates) & Virtual Neural Synthesizer"],
      lenses: ["Angénieux 12-120mm Zoom & Virtual Panavision Primo Primes"],
      captureFormat: "4K DCI Flat Master",
      colorSpace: "DCI XYZ / Rec.2020",
      soundFormat: "Dolby Atmos Theatrical Master",
      aiGenerativeModels: ["Midjourney v6.1", "Runway Gen-3 Alpha", "Flux.1 Pro"],
    },
    visibility: "PUBLIC",
    verifiedAt: "2026-08-19",
  },
  {
    id: "film-echoes-of-the-wasteland",
    slug: "echoes-of-the-wasteland",
    title: "Echoes of the Wasteland",
    originalTitle: "Ecos del Páramo",
    releaseYear: 2025,
    runtimeMinutes: 15,
    countryOfOrigin: ["Mexico", "United States"],
    language: ["Spanish"],
    format: "SHORT",
    genres: ["Neo-Western", "Drama", "Sci-Fi"],
    logline:
      "In a drought-ravaged Sonora desert, an indigenous water diviner confronts a multi-national aquifer extraction convoy armed with ancestral acoustic instruments.",
    synopsis:
      "Premiered at the Sundance Film Festival, Echoes of the Wasteland balances raw physical desert location photography with cutting-edge real-time virtual production backgrounds supervised by Elena Rostova. Captured on RED V-Raptor 8K VV with Atlas Orion Anamorphic lenses.",
    posterUrl: "/posters/echoes-wasteland.jpg",

    directors: [
      {
        personId: "person-mateo-alvarez",
        displayName: "Mateo Alvarez",
        creditRole: "Director & Screenwriter",
      },
    ],
    cinematographers: [
      {
        personId: "person-jean-luc-moreau",
        displayName: "Jean-Luc Moreau",
        creditRole: "Anamorphic Camera Consultant",
      },
    ],
    writers: [
      {
        personId: "person-mateo-alvarez",
        displayName: "Mateo Alvarez",
        creditRole: "Screenplay",
      },
    ],
    producers: [
      {
        personId: "person-mateo-alvarez",
        displayName: "Mateo Alvarez",
        creditRole: "Producer",
      },
    ],
    cast: [
      {
        actorName: "Raúl Méndez",
        characterName: "Don Jacinto",
      },
      {
        actorName: "Elena Garza",
        characterName: "Valeria",
      },
    ],
    aiAndVfxCredits: [
      {
        personId: "person-elena-rostova",
        name: "Elena Rostova",
        role: "Virtual Production & Environment Supervisor",
        toolsUsed: ["Unreal Engine 5.4", "ComfyUI", "DaVinci Resolve Studio"],
      },
    ],

    premiereStatus: "NATIONAL_PREMIERE",
    premiereFestivalId: "fest-sundance",
    premiereEditionId: "ed-sundance-2026",
    festivalHistory: [
      {
        festivalId: "fest-sundance",
        editionId: "ed-sundance-2026",
        festivalName: "Sundance Film Festival",
        year: 2026,
        section: "Short Film Program — Midnight",
        premiereHeld: "NATIONAL_PREMIERE",
        awardWon: "Short Film Grand Jury Prize Nominee",
        screeningDate: "2026-01-24",
      },
    ],

    technicalSpecs: {
      aspectRatio: "2.39:1 Scope",
      cameraSystems: ["RED V-Raptor 8K VV"],
      lenses: ["Atlas Orion 2x Anamorphic Series (40mm, 65mm, 100mm)"],
      captureFormat: "8K REDCODE RAW (HQ)",
      colorSpace: "IPP2 / ACEScc",
      soundFormat: "5.1 Surround Sound / 24-bit 48kHz",
    },
    visibility: "PUBLIC",
    verifiedAt: "2026-08-17",
  },
  {
    id: "film-neural-drift-tokyo",
    slug: "neural-drift-tokyo",
    title: "Neural Drift: Tokyo Midnight",
    originalTitle: "ニューラル・ドリフト: 東京ミッドナイト",
    releaseYear: 2026,
    runtimeMinutes: 4,
    countryOfOrigin: ["Japan"],
    language: ["Japanese"],
    format: "EXPERIMENTAL",
    genres: ["Experimental", "Music Video", "Cyberpunk"],
    logline:
      "A kinetic visual poem capturing the nocturnal underground drift culture of Tokyo through spatio-temporal AI motion synthesis and sub-bass resonance.",
    synopsis:
      "Combining high-frame-rate Kling AI 1.5 spatio-temporal interpolation with Topaz Video AI Proteus upscaling, Neural Drift translates urban motion into an audiovisual dreamscape. Edited and sound-designed by Kenji Sato.",
    posterUrl: "/posters/neural-drift.jpg",

    directors: [
      {
        personId: "person-kenji-sato",
        displayName: "Kenji Sato",
        creditRole: "Director & Sound Designer",
      },
    ],
    cinematographers: [
      {
        personId: "person-kenji-sato",
        displayName: "Kenji Sato",
        creditRole: "Generative Camera Director",
      },
    ],
    writers: [
      {
        personId: "person-kenji-sato",
        displayName: "Kenji Sato",
        creditRole: "Visual Concept",
      },
    ],
    producers: [
      {
        personId: "person-kenji-sato",
        displayName: "Kenji Sato",
        creditRole: "Producer",
      },
    ],
    cast: [],
    aiAndVfxCredits: [
      {
        personId: "person-kenji-sato",
        name: "Kenji Sato",
        role: "AI Motion & Temporal Editor",
        toolsUsed: ["Kling AI 1.5", "Topaz Video AI 5", "Ableton Live 12", "DaVinci Resolve Studio"],
      },
    ],

    premiereStatus: "WORLD_PREMIERE",
    premiereFestivalId: "fest-runway",
    premiereEditionId: "ed-runway-2026",
    festivalHistory: [
      {
        festivalId: "fest-runway",
        editionId: "ed-runway-2026",
        festivalName: "Runway AI Film Festival",
        year: 2026,
        section: "Experimental & Music Video",
        premiereHeld: "WORLD_PREMIERE",
        awardWon: "Excellence in Sound Design & Spatial Audio",
        screeningDate: "2026-05-13",
      },
    ],

    technicalSpecs: {
      aspectRatio: "2.39:1 Anamorphic",
      cameraSystems: ["Kling AI 1.5 High-Temporal Engine"],
      lenses: ["Virtual Hawk V-Lite 45mm Anamorphic"],
      captureFormat: "4K Master ProRes 4444 XQ",
      colorSpace: "Rec.709 / DaVinci Wide Gamut",
      soundFormat: "Binaural & Spatial 7.1.4 Audio",
      aiGenerativeModels: ["Kling AI 1.5", "Topaz Video AI 5"],
    },
    visibility: "PUBLIC",
    verifiedAt: "2026-08-16",
  },
];

// ============================================================================
// HELPER QUERY FUNCTIONS FOR FILMS & PEOPLE
// ============================================================================

export function getAllPublicFilms(): Film[] {
  return canonicalFilms.filter((f) => f.visibility === "PUBLIC");
}

export function getFilmBySlug(slug: string): Film | undefined {
  const normalized = slug.toLowerCase();
  return canonicalFilms.find(
    (f) => f.slug === normalized && f.visibility === "PUBLIC"
  );
}

export function getFilmById(id: string): Film | undefined {
  return canonicalFilms.find((f) => f.id === id && f.visibility === "PUBLIC");
}

export function getFilmsByPersonId(personId: string): Film[] {
  return canonicalFilms.filter((film) => {
    const isDirector = film.directors.some((d) => d.personId === personId);
    const isCinematographer = film.cinematographers.some((c) => c.personId === personId);
    const isWriter = film.writers.some((w) => w.personId === personId);
    const isProducer = film.producers.some((p) => p.personId === personId);
    const isCast = film.cast.some((c) => c.personId === personId);
    const isAiVfx = film.aiAndVfxCredits?.some((a) => a.personId === personId);
    return isDirector || isCinematographer || isWriter || isProducer || isCast || isAiVfx;
  });
}

export function getFilmsByFestivalId(festivalId: string): Film[] {
  return canonicalFilms.filter(
    (f) =>
      f.premiereFestivalId === festivalId ||
      f.festivalHistory.some((h) => h.festivalId === festivalId)
  );
}

export function getFilmsByFormat(format: FilmFormat): Film[] {
  return canonicalFilms.filter((f) => f.format === format && f.visibility === "PUBLIC");
}

export function getFilmsByGenre(genre: string): Film[] {
  const gLower = genre.toLowerCase();
  return canonicalFilms.filter(
    (f) => f.genres.some((g) => g.toLowerCase() === gLower) && f.visibility === "PUBLIC"
  );
}

export function getAllPublicPeople(): Person[] {
  return canonicalPeople.filter((p) => p.visibility === "PUBLIC");
}

export function getPersonBySlug(slug: string): Person | undefined {
  const normalized = slug.toLowerCase();
  return canonicalPeople.find(
    (p) =>
      (p.slug === normalized || p.alternateNames.some((alt) => alt.toLowerCase() === normalized)) &&
      p.visibility === "PUBLIC"
  );
}

export function getPersonById(id: string): Person | undefined {
  return canonicalPeople.find((p) => p.id === id && p.visibility === "PUBLIC");
}

export function getPeopleByRole(role: PersonRole): Person[] {
  return canonicalPeople.filter(
    (p) =>
      (p.primaryRole === role || p.secondaryRoles.includes(role)) &&
      p.visibility === "PUBLIC"
  );
}
