import {
  FilmFestival,
  FestivalEdition,
  FestivalPrestigeTier,
  FestivalRegion,
  PremiereType,
  VerificationStatus,
  RequirementTier,
  DeliveryMethod,
} from "./film-intelligence-types";

// ============================================================================
// CANONICAL STANDING FESTIVALS (PERSISTENT METADATA ONLY)
// ============================================================================
export const canonicalStandingFestivals: FilmFestival[] = [
  {
    id: "fest-cannes",
    slug: "cannes-film-festival",
    name: "Festival de Cannes",
    acronym: "CANNES",
    foundedYear: 1946,
    hostCity: "Cannes",
    hostCountry: "France",
    region: "EUROPE",
    prestigeTier: "TIER_1_A_LIST",
    academyAwardQualifying: true,
    baftaQualifying: true,
    fiapfAccredited: true,
    focusCategories: ["Official Selection", "Un Certain Regard", "Short Film Palme d'Or", "Marché du Film — AI Cinema Showcase", "Cinéf"],
    officialWebsite: "https://www.festival-cannes.com",
    submissionPortals: ["DIRECT_FESTIVAL_PORTAL"],
    description: "The world's most prestigious international film festival. Celebrates cinematic excellence, auteur vision, and industry-defining global premieres on the Croisette.",
    editorialNotes: "World premiere status strictly enforced for Competition and Un Certain Regard. Complete exclusion of public streaming or national television broadcasts prior to festival screening.",
    status: "ACTIVE",
    visibility: "PUBLIC",
    verifiedAt: "2026-08-20",
  },
  {
    id: "fest-sundance",
    slug: "sundance-film-festival",
    name: "Sundance Film Festival",
    acronym: "SUNDANCE",
    foundedYear: 1978,
    hostCity: "Park City & Salt Lake City, Utah",
    hostCountry: "United States",
    region: "NORTH_AMERICA",
    prestigeTier: "TIER_1_A_LIST",
    academyAwardQualifying: true,
    baftaQualifying: true,
    fiapfAccredited: false,
    focusCategories: ["U.S. Dramatic", "World Cinema", "Documentary", "Short Film Program", "New Frontier AI & Emerging Media"],
    officialWebsite: "https://www.sundance.org/festivals/submitting",
    submissionPortals: ["FILMFREEWAY", "DIRECT_FESTIVAL_PORTAL"],
    description: "The preeminent platform for independent cinema and groundbreaking narrative discovery in North America, hosted by the Sundance Institute.",
    editorialNotes: "Requires minimum US Premiere for Dramatic/Doc features. Short films accept international and domestic entries with no strict world premiere rule, but unreleased films receive program priority.",
    status: "ACTIVE",
    visibility: "PUBLIC",
    verifiedAt: "2026-08-20",
  },
  {
    id: "fest-tribeca",
    slug: "tribeca-film-festival",
    name: "Tribeca Festival",
    acronym: "TRIBECA",
    foundedYear: 2002,
    hostCity: "New York City",
    hostCountry: "United States",
    region: "NORTH_AMERICA",
    prestigeTier: "TIER_2_MAJOR_INDUSTRY",
    academyAwardQualifying: true,
    baftaQualifying: false,
    fiapfAccredited: false,
    focusCategories: ["Narrative Feature", "Short Film", "Tribeca X AI & Synthetic Media", "Immersive & Games", "Documentary"],
    officialWebsite: "https://tribecafilm.com/festival",
    submissionPortals: ["FILMFREEWAY", "DIRECT_FESTIVAL_PORTAL"],
    description: "New York City's defining international storytelling festival, renowned for championing cross-disciplinary innovation, synthetic cinema, and commercial brand storytelling.",
    editorialNotes: "Requires North American Premiere for feature competition. AI submissions in the Tribeca X pavilion require transparent provenance disclosures.",
    status: "ACTIVE",
    visibility: "PUBLIC",
    verifiedAt: "2026-08-20",
  },
  {
    id: "fest-runway-aiff",
    slug: "runway-ai-film-festival",
    name: "Runway AI Film Festival (AIFF)",
    acronym: "RUNWAY AIFF",
    foundedYear: 2023,
    hostCity: "New York & Los Angeles",
    hostCountry: "United States",
    region: "NORTH_AMERICA",
    prestigeTier: "TIER_4_SPECIALIZED_DISCOVERY",
    academyAwardQualifying: false,
    baftaQualifying: false,
    fiapfAccredited: false,
    focusCategories: ["AI Narrative Short", "Experimental Generative", "Animation & Hybrid", "Commercial Previs"],
    officialWebsite: "https://aiff.runwayml.com",
    submissionPortals: ["DIRECT_FESTIVAL_PORTAL"],
    description: "The global benchmark competition dedicated exclusively to cinematic storytelling created with generative artificial intelligence, machine learning, and emerging digital toolchains.",
    editorialNotes: "Short film runtime between 1 and 10 minutes. Submissions must incorporate generative AI workflows across concept, visual generation, video synthesis, or audio design.",
    status: "ACTIVE",
    visibility: "PUBLIC",
    verifiedAt: "2026-08-20",
  },
  {
    id: "fest-venice",
    slug: "venice-international-film-festival",
    name: "Venice International Film Festival (La Biennale di Venezia)",
    acronym: "VIFF",
    foundedYear: 1932,
    hostCity: "Venice",
    hostCountry: "Italy",
    region: "EUROPE",
    prestigeTier: "TIER_1_A_LIST",
    academyAwardQualifying: true,
    baftaQualifying: true,
    fiapfAccredited: true,
    focusCategories: ["Venezia In Concorso", "Orizzonti", "Venice Immersive / XR", "Out of Competition", "Short Films"],
    officialWebsite: "https://www.labiennale.org/en/cinema",
    submissionPortals: ["DIRECT_FESTIVAL_PORTAL"],
    description: "The oldest film festival in the world, renowned for artistic rigor, world premieres, and the Golden Lion competition on the Lido.",
    editorialNotes: "Strict World Premiere requirement across all official competitive sections. No prior public exhibition, broadcast, or internet availability permitted.",
    status: "ACTIVE",
    visibility: "PUBLIC",
    verifiedAt: "2026-08-20",
  },
  {
    id: "fest-idfa",
    slug: "idfa-amsterdam",
    name: "International Documentary Film Festival Amsterdam",
    acronym: "IDFA",
    foundedYear: 1988,
    hostCity: "Amsterdam",
    hostCountry: "Netherlands",
    region: "EUROPE",
    prestigeTier: "TIER_3_GENRE_REGIONAL",
    academyAwardQualifying: true,
    baftaQualifying: true,
    fiapfAccredited: true,
    focusCategories: ["International Competition", "Envision Competition", "DocLab AI & Interactive", "Short Documentary"],
    officialWebsite: "https://www.idfa.nl",
    submissionPortals: ["DIRECT_FESTIVAL_PORTAL"],
    description: "The world's leading documentary film and interactive non-fiction festival, fostering innovative documentary forms and synthetic documentary ethics via IDFA DocLab.",
    editorialNotes: "Requires minimum European Premiere for main competition entries. DocLab explores synthetic media in non-fiction storytelling with mandatory methodology logs.",
    status: "ACTIVE",
    visibility: "PUBLIC",
    verifiedAt: "2026-08-20",
  },
  {
    id: "fest-clermont-ferrand",
    slug: "clermont-ferrand-short-film-festival",
    name: "Clermont-Ferrand International Short Film Festival",
    acronym: "CLERMONT",
    foundedYear: 1979,
    hostCity: "Clermont-Ferrand",
    hostCountry: "France",
    region: "EUROPE",
    prestigeTier: "TIER_2_MAJOR_INDUSTRY",
    academyAwardQualifying: true,
    baftaQualifying: true,
    fiapfAccredited: true,
    focusCategories: ["International Competition", "National Competition", "Lab Competition (Experimental & Digital)", "Short Film Market"],
    officialWebsite: "https://clermont-filmfest.org",
    submissionPortals: ["SHORTFILMDEPOT"],
    description: "The world's largest short film marketplace and festival. Widely regarded as the Cannes of short cinema, offering unparalleled industry buyer access.",
    editorialNotes: "Runtime limit: strictly under 40 minutes for Lab/International competition. English and French dialogue subtitles required on all exhibition files.",
    status: "ACTIVE",
    visibility: "PUBLIC",
    verifiedAt: "2026-08-20",
  }
];

// ============================================================================
// CANONICAL FESTIVAL EDITIONS (TIME-SENSITIVE DATA)
// ============================================================================
export const canonicalFestivalEditions: FestivalEdition[] = [
  // 1. Cannes 2027
  {
    id: "edition-cannes-2027",
    festivalId: "fest-cannes",
    editionNumber: 80,
    year: 2027,
    season: "SPRING",
    eventStartDate: "2027-05-11",
    eventEndDate: "2027-05-22",
    deadlines: {
      callForEntriesOpen: "2026-11-15",
      earlyBirdDeadline: "2027-01-15",
      regularDeadline: "2027-02-15",
      lateDeadline: "2027-03-01",
      notificationDate: "2027-04-15",
    },
    fees: [
      { category: "Feature Film (Competition / UCR)", regularFee: 350, currency: "EUR" },
      { category: "Short Film (Official Competition)", regularFee: 60, currency: "EUR" },
      { category: "Marché du Film AI Showcase Plate", regularFee: 200, currency: "EUR" },
    ],
    premiereRules: [
      {
        category: "Feature Film Competition",
        requiredPremiere: "WORLD_PREMIERE",
        geographicRestriction: "Global (no prior public screening anywhere)",
        onlineExclusivityClause: true,
        priorBroadcastAllowed: false,
        completionDateCutoff: "12 months prior to festival opening",
        sourceId: "src-cannes-regs-2027",
      },
      {
        category: "Short Film Palme d'Or",
        requiredPremiere: "WORLD_PREMIERE",
        geographicRestriction: "Global (runtime under 15 minutes)",
        onlineExclusivityClause: true,
        priorBroadcastAllowed: false,
        completionDateCutoff: "12 months prior to festival opening",
        sourceId: "src-cannes-regs-2027",
      },
    ],
    acceptedFormats: ["DCP (SMPTE / Interop 24fps)", "35mm (Special Sections)", "ProRes 422 HQ"],
    deliveryRequirements: [
      {
        id: "del-cannes-dcp-feature",
        festivalEditionId: "edition-cannes-2027",
        assetName: "DCI Theatrical Screening Master",
        category: "MASTER_VIDEO",
        required: true,
        requirementTier: "FESTIVAL_REQUIREMENT",
        technicalSpecification: "DCP SMPTE 2006, 24.00 fps or 48 fps HFR, JPEG2000 XYZ, 2K/4K, Unencrypted (or KDM valid for full festival duration).",
        submissionFormat: "Physical CRU Drive or Secured High-Speed Aspera Upload",
        resolution: "2K (2048x1080) or 4K (4096x2160)",
        aspectRatio: "1.85:1 Flat or 2.39:1 Scope",
        frameRate: "24.00 fps",
        audioSpecification: "Linear PCM 5.1 / 7.1 / Dolby Atmos 24-bit 48kHz",
        subtitleSpecification: "Burned or XML Subtitles in French & English (bilingual layout)",
        deliveryMethod: "SECURE_UPLOAD_ASPERA",
        deadline: "2027-04-25",
        sourceId: "src-cannes-regs-2027",
        lastVerified: "2026-08-20",
        verificationStatus: "VERIFIED",
        notes: "All foreign language films must carry French subtitles; French language films must carry English subtitles.",
      },
    ],
    aiDisclosurePolicy: {
      required: true,
      policyStatement: "Films utilizing generative AI must clearly demarcate synthetic elements versus live-action human performance in production notes. Marché du Film provides dedicated innovation showcase slots.",
      allowedCategories: ["Marché du Film Showcase", "Cinéf Experimental Track", "Special Out of Competition Screenings"],
      documentationRequirements: [
        "Production methodology document stating generative engines used (video/audio/stills)",
        "Proof of commercial licensing and training rights clearance for synthetic models",
      ],
      sourceId: "src-cannes-regs-2027",
    },
    verifiedSources: [
      {
        id: "src-cannes-regs-2027",
        sourceTitle: "Festival de Cannes Official Submission Regulations & Technical Charter 2027",
        sourceUrl: "https://www.festival-cannes.com/en/participate/submit-a-film/",
        sourcePublisher: "Association Française du Festival International du Film",
        sourceCategory: "OFFICIAL_REGULATIONS",
        tier: 1,
        tierName: "TIER_1_OFFICIAL_REGULATIONS",
        retrievedDate: "2026-08-20",
        lastVerifiedAt: "2026-08-20",
        verificationStatus: "VERIFIED",
        reliabilityScore: 1.0,
      },
    ],
    status: "UPCOMING",
    verificationStatus: "VERIFIED",
    lastVerifiedAt: "2026-08-20",
  },

  // 2. Sundance 2027
  {
    id: "edition-sundance-2027",
    festivalId: "fest-sundance",
    editionNumber: 43,
    year: 2027,
    season: "WINTER",
    eventStartDate: "2027-01-21",
    eventEndDate: "2027-01-31",
    deadlines: {
      callForEntriesOpen: "2026-06-01",
      earlyBirdDeadline: "2026-08-03",
      regularDeadline: "2026-09-14",
      lateDeadline: "2026-10-05",
      extendedDeadline: "2026-10-19",
      notificationDate: "2026-12-04",
    },
    fees: [
      { category: "Feature Film (U.S. / World Dramatic)", earlyBirdFee: 90, regularFee: 115, lateFee: 140, currency: "USD" },
      { category: "Short Film Program", earlyBirdFee: 45, regularFee: 65, lateFee: 85, currency: "USD" },
      { category: "New Frontier AI & Emerging Projects", earlyBirdFee: 50, regularFee: 75, lateFee: 95, currency: "USD" },
    ],
    premiereRules: [
      {
        category: "U.S. Dramatic / Documentary Feature",
        requiredPremiere: "NATIONAL_PREMIERE",
        geographicRestriction: "United States (no prior US theatrical or television exhibition)",
        onlineExclusivityClause: true,
        priorBroadcastAllowed: false,
        completionDateCutoff: "Completed on or after January 1, 2025",
        sourceId: "src-sundance-regs-2027",
      },
      {
        category: "Short Film & New Frontier",
        requiredPremiere: "NO_PREMIERE_REQUIREMENT",
        geographicRestriction: "Global (unreleased works receive strict programming priority)",
        onlineExclusivityClause: false,
        priorBroadcastAllowed: true,
        completionDateCutoff: "Completed on or after January 1, 2025",
        sourceId: "src-sundance-regs-2027",
      },
    ],
    acceptedFormats: ["DCP (24fps)", "ProRes 422 HQ", "Encrypted Secure Digital Screener (Vimeo/FilmFreeway)"],
    deliveryRequirements: [
      {
        id: "del-sundance-screener-short",
        festivalEditionId: "edition-sundance-2027",
        assetName: "Secure Digital Review Screener",
        category: "MASTER_VIDEO",
        required: true,
        requirementTier: "FESTIVAL_REQUIREMENT",
        technicalSpecification: "1080p or 4K H.264/H.265 MP4 or Vimeo Private Link with enabled 24fps cadence and burned English subtitles if non-English dialogue.",
        submissionFormat: "Secure streaming URL via FilmFreeway",
        deliveryMethod: "FILMFREEWAY_STREAM",
        deadline: "2026-10-19",
        sourceId: "src-sundance-regs-2027",
        lastVerified: "2026-08-20",
        verificationStatus: "VERIFIED",
      },
    ],
    aiDisclosurePolicy: {
      required: true,
      policyStatement: "Sundance Institute welcomes projects employing emerging AI and synthetic workflows. Submitting directors must submit an ethical disclosure statement detailing AI models used, training dataset provenance, and the degree of human creative direction.",
      allowedCategories: ["New Frontier", "Short Films", "Narrative Features", "Documentary Features"],
      documentationRequirements: [
        "Artistic Statement on AI Methodology (250-500 words)",
        "List of generative software platforms used for audio, vision, or motion",
        "Assurance that no protected celebrity likenesses or unauthorized copyrighted assets were cloned without license",
      ],
      sourceId: "src-sundance-regs-2027",
    },
    verifiedSources: [
      {
        id: "src-sundance-regs-2027",
        sourceTitle: "Sundance Film Festival 2027 Submissions FAQ & Rules",
        sourceUrl: "https://www.sundance.org/festivals/submitting",
        sourcePublisher: "Sundance Institute",
        sourceCategory: "OFFICIAL_REGULATIONS",
        tier: 1,
        tierName: "TIER_1_OFFICIAL_REGULATIONS",
        retrievedDate: "2026-08-20",
        lastVerifiedAt: "2026-08-20",
        verificationStatus: "VERIFIED",
        reliabilityScore: 1.0,
      },
    ],
    status: "CALL_FOR_ENTRIES",
    verificationStatus: "VERIFIED",
    lastVerifiedAt: "2026-08-20",
  },

  // 3. Tribeca 2026
  {
    id: "edition-tribeca-2026",
    festivalId: "fest-tribeca",
    editionNumber: 25,
    year: 2026,
    season: "SPRING",
    eventStartDate: "2026-06-03",
    eventEndDate: "2026-06-14",
    deadlines: {
      callForEntriesOpen: "2025-09-15",
      earlyBirdDeadline: "2025-10-27",
      regularDeadline: "2025-12-01",
      lateDeadline: "2026-01-14",
      notificationDate: "2026-04-10",
    },
    fees: [
      { category: "Feature Film", earlyBirdFee: 85, regularFee: 110, lateFee: 135, currency: "USD" },
      { category: "Short Film (Under 40 min)", earlyBirdFee: 50, regularFee: 70, lateFee: 90, currency: "USD" },
      { category: "Tribeca X AI Commercial & Branded Story", earlyBirdFee: 150, regularFee: 225, lateFee: 300, currency: "USD" },
    ],
    premiereRules: [
      {
        category: "Feature Film Competition",
        requiredPremiere: "CONTINENTAL_PREMIERE",
        geographicRestriction: "North America (no prior US/Canadian theatrical or online release)",
        onlineExclusivityClause: true,
        priorBroadcastAllowed: false,
        completionDateCutoff: "Completed after January 1, 2025",
        sourceId: "src-tribeca-regs-2026",
      },
      {
        category: "Tribeca X AI Storytelling",
        requiredPremiere: "NO_PREMIERE_REQUIREMENT",
        geographicRestriction: "Global (branded content previously aired is eligible)",
        onlineExclusivityClause: false,
        priorBroadcastAllowed: true,
        completionDateCutoff: "Completed after January 1, 2024",
        sourceId: "src-tribeca-regs-2026",
      },
    ],
    acceptedFormats: ["DCP (24fps SMPTE)", "ProRes 422 HQ", "ProRes 4444"],
    deliveryRequirements: [
      {
        id: "del-tribeca-theatrical-dcp",
        festivalEditionId: "edition-tribeca-2026",
        assetName: "DCI Theatrical Screening Master",
        category: "MASTER_VIDEO",
        required: true,
        requirementTier: "FESTIVAL_REQUIREMENT",
        technicalSpecification: "2K/4K DCI compliant DCP, 24fps, unencrypted, 5.1 channel audio.",
        submissionFormat: "Secure Aspera or Physical CRU",
        deliveryMethod: "SECURE_UPLOAD_ASPERA",
        deadline: "2026-05-01",
        sourceId: "src-tribeca-regs-2026",
        lastVerified: "2026-08-20",
        verificationStatus: "VERIFIED",
      },
    ],
    aiDisclosurePolicy: {
      required: true,
      policyStatement: "Tribeca champions AI-assisted cinema across Tribeca X and the New Media track. Creators must indicate the role of AI in writing, visual design, background synthesis, and character creation.",
      allowedCategories: ["Tribeca X", "Shorts", "Interactive", "Special Screenings"],
      documentationRequirements: [
        "Detailed AI workflow checklist submitted via FilmFreeway custom questions",
        "Commercial and IP indemnification confirmation",
      ],
      sourceId: "src-tribeca-regs-2026",
    },
    verifiedSources: [
      {
        id: "src-tribeca-regs-2026",
        sourceTitle: "Tribeca Festival Official Rules and Regulations 2026",
        sourceUrl: "https://tribecafilm.com/festival/submissions",
        sourcePublisher: "Tribeca Enterprises LLC",
        sourceCategory: "OFFICIAL_REGULATIONS",
        tier: 1,
        tierName: "TIER_1_OFFICIAL_REGULATIONS",
        retrievedDate: "2026-08-20",
        lastVerifiedAt: "2026-08-20",
        verificationStatus: "VERIFIED",
        reliabilityScore: 1.0,
      },
    ],
    status: "CONCLUDED",
    verificationStatus: "VERIFIED",
    lastVerifiedAt: "2026-08-20",
  },

  // 4. Runway AIFF 2026
  {
    id: "edition-runway-aiff-2026",
    festivalId: "fest-runway-aiff",
    editionNumber: 4,
    year: 2026,
    season: "FALL",
    eventStartDate: "2026-11-12",
    eventEndDate: "2026-11-14",
    deadlines: {
      callForEntriesOpen: "2026-07-01",
      earlyBirdDeadline: "2026-08-15",
      regularDeadline: "2026-09-30",
      lateDeadline: "2026-10-15",
      notificationDate: "2026-10-28",
    },
    fees: [
      { category: "AI Narrative Short (1-10 min)", earlyBirdFee: 0, regularFee: 0, lateFee: 0, currency: "USD" },
      { category: "Experimental Generative Short", earlyBirdFee: 0, regularFee: 0, lateFee: 0, currency: "USD" },
    ],
    premiereRules: [
      {
        category: "All Submissions",
        requiredPremiere: "NO_PREMIERE_REQUIREMENT",
        geographicRestriction: "Global (free to submit, open worldwide)",
        onlineExclusivityClause: false,
        priorBroadcastAllowed: true,
        completionDateCutoff: "Completed on or after November 1, 2025",
        sourceId: "src-runway-aiff-2026",
      },
    ],
    acceptedFormats: ["4K ProRes 422 HQ", "High-bitrate MP4 / H.264 (min 30 Mbps)"],
    deliveryRequirements: [
      {
        id: "del-runway-master-file",
        festivalEditionId: "edition-runway-aiff-2026",
        assetName: "High-Bitrate 4K Master Video",
        category: "MASTER_VIDEO",
        required: true,
        requirementTier: "FESTIVAL_REQUIREMENT",
        technicalSpecification: "3840x2160 or 4096x2160 ProRes 422 HQ or H.264 (minimum 35 Mbps bitrate), 24.00 fps or 25.00 fps, Stereo or 5.1 PCM audio.",
        submissionFormat: "High-resolution downloadable video file via Dropbox or Google Drive",
        resolution: "4K UHD (3840x2160) or 4K DCI",
        aspectRatio: "16:9 or 2.39:1",
        frameRate: "24fps or 25fps",
        deliveryMethod: "DIRECT_PORTAL_UPLOAD",
        deadline: "2026-10-15",
        sourceId: "src-runway-aiff-2026",
        lastVerified: "2026-08-20",
        verificationStatus: "VERIFIED",
        notes: "No watermarks, no web-compression compression artifacts. Must include clear audio stems.",
      },
      {
        id: "del-runway-prompt-log",
        festivalEditionId: "edition-runway-aiff-2026",
        assetName: "AI Production & Prompt Log",
        category: "LEGAL_AND_METADATA",
        required: true,
        requirementTier: "FESTIVAL_REQUIREMENT",
        technicalSpecification: "PDF document or text breakdown outlining tools (e.g. Runway Gen-3, Midjourney v6, ElevenLabs), prompt engineering techniques, and iteration pipelines used.",
        submissionFormat: "PDF Document (max 5 pages)",
        deliveryMethod: "DIRECT_PORTAL_UPLOAD",
        deadline: "2026-10-15",
        sourceId: "src-runway-aiff-2026",
        lastVerified: "2026-08-20",
        verificationStatus: "VERIFIED",
      }
    ],
    aiDisclosurePolicy: {
      required: true,
      policyStatement: "Film must incorporate generative AI technology in a meaningful creative capacity (e.g. video generation, image-to-video, voice synthesis, style transfer). Purely traditional footage with minor VFX is ineligible.",
      allowedCategories: ["AI Narrative", "Experimental", "Animation", "Music Video"],
      documentationRequirements: [
        "Prompt log detailing tools and iterative prompting workflow",
        "Attestation of full music and voice clearance rights",
      ],
      sourceId: "src-runway-aiff-2026",
    },
    verifiedSources: [
      {
        id: "src-runway-aiff-2026",
        sourceTitle: "Runway AI Film Festival Official Guidelines & Eligibility FAQ",
        sourceUrl: "https://aiff.runwayml.com",
        sourcePublisher: "Runway AI, Inc.",
        sourceCategory: "OFFICIAL_REGULATIONS",
        tier: 1,
        tierName: "TIER_1_OFFICIAL_REGULATIONS",
        retrievedDate: "2026-08-20",
        lastVerifiedAt: "2026-08-20",
        verificationStatus: "VERIFIED",
        reliabilityScore: 1.0,
      },
    ],
    status: "CALL_FOR_ENTRIES",
    verificationStatus: "VERIFIED",
    lastVerifiedAt: "2026-08-20",
  },

  // 5. Venice 2026
  {
    id: "edition-venice-2026",
    festivalId: "fest-venice",
    editionNumber: 83,
    year: 2026,
    season: "SUMMER",
    eventStartDate: "2026-08-26",
    eventEndDate: "2026-09-05",
    deadlines: {
      callForEntriesOpen: "2026-02-01",
      earlyBirdDeadline: "2026-04-30",
      regularDeadline: "2026-05-31",
      lateDeadline: "2026-06-15",
      notificationDate: "2026-07-22",
    },
    fees: [
      { category: "Feature Film (Venezia 83 / Orizzonti)", earlyBirdFee: 150, regularFee: 200, lateFee: 250, currency: "EUR" },
      { category: "Short Film (Corto Cortissimo)", earlyBirdFee: 70, regularFee: 90, lateFee: 110, currency: "EUR" },
      { category: "Venice Immersive / XR Experience", regularFee: 180, currency: "EUR" },
    ],
    premiereRules: [
      {
        category: "All Official Sections",
        requiredPremiere: "WORLD_PREMIERE",
        geographicRestriction: "Global (strictly no prior screenings or internet distribution)",
        onlineExclusivityClause: true,
        priorBroadcastAllowed: false,
        completionDateCutoff: "Completed within the 12 months preceding the festival",
        sourceId: "src-venice-regs-2026",
      },
    ],
    acceptedFormats: ["DCP (24fps SMPTE / Interop)", "35mm / 70mm", "Custom XR Engine Builds (Venice Immersive)"],
    deliveryRequirements: [
      {
        id: "del-venice-dcp-master",
        festivalEditionId: "edition-venice-2026",
        assetName: "DCI Theatrical Exhibition DCP",
        category: "MASTER_VIDEO",
        required: true,
        requirementTier: "FESTIVAL_REQUIREMENT",
        technicalSpecification: "DCI SMPTE DCP, 24.00fps, Italian and English subtitles formatted on screen.",
        submissionFormat: "Physical Hard Drive or Aspera Server",
        deliveryMethod: "SECURE_UPLOAD_ASPERA",
        deadline: "2026-08-01",
        sourceId: "src-venice-regs-2026",
        lastVerified: "2026-08-20",
        verificationStatus: "VERIFIED",
      },
    ],
    aiDisclosurePolicy: {
      required: true,
      policyStatement: "Synthetic characters and generative audio must be disclosed in the festival entry dossier. Venice Immersive allows generative narrative installations with full technological disclosure.",
      allowedCategories: ["Venice Immersive", "Special Screenings", "Out of Competition"],
      documentationRequirements: [
        "Technical architecture overview",
        "Synthetic media declaration form",
      ],
      sourceId: "src-venice-regs-2026",
    },
    verifiedSources: [
      {
        id: "src-venice-regs-2026",
        sourceTitle: "La Biennale di Venezia Cinema Regulations 2026",
        sourceUrl: "https://www.labiennale.org/en/cinema/2026/regulations",
        sourcePublisher: "La Biennale di Venezia",
        sourceCategory: "OFFICIAL_REGULATIONS",
        tier: 1,
        tierName: "TIER_1_OFFICIAL_REGULATIONS",
        retrievedDate: "2026-08-20",
        lastVerifiedAt: "2026-08-20",
        verificationStatus: "VERIFIED",
        reliabilityScore: 1.0,
      },
    ],
    status: "CALL_FOR_ENTRIES",
    verificationStatus: "VERIFIED",
    lastVerifiedAt: "2026-08-20",
  },

  // 6. IDFA 2026
  {
    id: "edition-idfa-2026",
    festivalId: "fest-idfa",
    editionNumber: 39,
    year: 2026,
    season: "FALL",
    eventStartDate: "2026-11-18",
    eventEndDate: "2026-11-29",
    deadlines: {
      callForEntriesOpen: "2026-03-01",
      earlyBirdDeadline: "2026-05-01",
      regularDeadline: "2026-07-01",
      lateDeadline: "2026-08-01",
      notificationDate: "2026-10-15",
    },
    fees: [
      { category: "Feature Documentary (Over 60 min)", regularFee: 160, lateFee: 210, currency: "EUR" },
      { category: "Short & Mid-Length Doc", regularFee: 60, lateFee: 90, currency: "EUR" },
      { category: "IDFA DocLab (AI & Interactive Non-Fiction)", regularFee: 90, currency: "EUR" },
    ],
    premiereRules: [
      {
        category: "International Competition",
        requiredPremiere: "CONTINENTAL_PREMIERE",
        geographicRestriction: "European Premiere required minimum (World/International preferred)",
        onlineExclusivityClause: true,
        priorBroadcastAllowed: false,
        completionDateCutoff: "Finished after November 1, 2025",
        sourceId: "src-idfa-regs-2026",
      },
      {
        category: "DocLab AI Interactive",
        requiredPremiere: "NO_PREMIERE_REQUIREMENT",
        geographicRestriction: "Global",
        onlineExclusivityClause: false,
        priorBroadcastAllowed: true,
        completionDateCutoff: "Finished after November 1, 2024",
        sourceId: "src-idfa-regs-2026",
      },
    ],
    acceptedFormats: ["DCP (24fps / 25fps)", "ProRes 422 HQ", "WebXR / Interactive Packages"],
    deliveryRequirements: [
      {
        id: "del-idfa-dcp",
        festivalEditionId: "edition-idfa-2026",
        assetName: "DCP Theatrical Screening Master",
        category: "MASTER_VIDEO",
        required: true,
        requirementTier: "FESTIVAL_REQUIREMENT",
        technicalSpecification: "SMPTE DCP, 24fps or 25fps, English subtitles mandatory for non-English dialogue.",
        submissionFormat: "Digital upload via IDFA portal or physical SSD",
        deliveryMethod: "DIRECT_PORTAL_UPLOAD",
        deadline: "2026-10-25",
        sourceId: "src-idfa-regs-2026",
        lastVerified: "2026-08-20",
        verificationStatus: "VERIFIED",
      },
    ],
    aiDisclosurePolicy: {
      required: true,
      policyStatement: "Documentaries utilizing synthetic recreation, AI voice cloning, or generated archival materials must provide explicit verification of subject consent and on-screen journalistic disclaimers.",
      allowedCategories: ["DocLab", "Envision Competition", "Luminous"],
      documentationRequirements: [
        "Ethical provenance declaration covering synthetic archives and consent documentation",
        "Technical pipeline summary submitted to IDFA DocLab curators",
      ],
      sourceId: "src-idfa-regs-2026",
    },
    verifiedSources: [
      {
        id: "src-idfa-regs-2026",
        sourceTitle: "IDFA Regulations & DocLab Entry Rules 2026",
        sourceUrl: "https://www.idfa.nl/en/info/regulations-entry-form",
        sourcePublisher: "Stichting IDFA",
        sourceCategory: "OFFICIAL_REGULATIONS",
        tier: 1,
        tierName: "TIER_1_OFFICIAL_REGULATIONS",
        retrievedDate: "2026-08-20",
        lastVerifiedAt: "2026-08-20",
        verificationStatus: "VERIFIED",
        reliabilityScore: 1.0,
      },
    ],
    status: "CALL_FOR_ENTRIES",
    verificationStatus: "VERIFIED",
    lastVerifiedAt: "2026-08-20",
  },

  // 7. Clermont-Ferrand 2027
  {
    id: "edition-clermont-2027",
    festivalId: "fest-clermont-ferrand",
    editionNumber: 49,
    year: 2027,
    season: "WINTER",
    eventStartDate: "2027-01-29",
    eventEndDate: "2027-02-06",
    deadlines: {
      callForEntriesOpen: "2026-05-15",
      earlyBirdDeadline: "2026-07-08",
      regularDeadline: "2026-10-02",
      notificationDate: "2026-12-10",
    },
    fees: [
      { category: "International Competition (Shorts under 40 min)", regularFee: 15, currency: "EUR" },
      { category: "Lab Competition (Experimental & Digital)", regularFee: 15, currency: "EUR" },
    ],
    premiereRules: [
      {
        category: "International & Lab Competition",
        requiredPremiere: "NO_PREMIERE_REQUIREMENT",
        geographicRestriction: "No strict national premiere required, but unreleased films receive preference",
        onlineExclusivityClause: false,
        priorBroadcastAllowed: true,
        completionDateCutoff: "Completed after October 1, 2025",
        sourceId: "src-clermont-regs-2027",
      },
    ],
    acceptedFormats: ["DCP (24fps / 25fps)", "ProRes 422 HQ", "ShortFilmDepot Digital Master"],
    deliveryRequirements: [
      {
        id: "del-clermont-screener",
        festivalEditionId: "edition-clermont-2027",
        assetName: "ShortFilmDepot Digital Master Screener",
        category: "MASTER_VIDEO",
        required: true,
        requirementTier: "FESTIVAL_REQUIREMENT",
        technicalSpecification: "1080p/2K ProRes or H.264 video with French and English subtitles, uploaded directly via ShortFilmDepot.",
        submissionFormat: "ShortFilmDepot platform file",
        deliveryMethod: "DIRECT_PORTAL_UPLOAD",
        deadline: "2026-10-02",
        sourceId: "src-clermont-regs-2027",
        lastVerified: "2026-08-20",
        verificationStatus: "VERIFIED",
      },
    ],
    aiDisclosurePolicy: {
      required: false,
      policyStatement: "Lab Competition specifically welcomes synthetic and computer-generated experimental shorts. Clear notation of AI tools is encouraged in the submission metadata.",
      allowedCategories: ["Lab Competition", "International Competition"],
      documentationRequirements: [
        "Software and AI workflow mention in film synopsis",
      ],
      sourceId: "src-clermont-regs-2027",
    },
    verifiedSources: [
      {
        id: "src-clermont-regs-2027",
        sourceTitle: "Clermont-Ferrand International Short Film Festival Regulations 2027",
        sourceUrl: "https://clermont-filmfest.org/en/short-film-festival/submission/",
        sourcePublisher: "Sauve qui peut le court métrage",
        sourceCategory: "OFFICIAL_REGULATIONS",
        tier: 1,
        tierName: "TIER_1_OFFICIAL_REGULATIONS",
        retrievedDate: "2026-08-20",
        lastVerifiedAt: "2026-08-20",
        verificationStatus: "VERIFIED",
        reliabilityScore: 1.0,
      },
    ],
    status: "CALL_FOR_ENTRIES",
    verificationStatus: "VERIFIED",
    lastVerifiedAt: "2026-08-20",
  },
];

// ============================================================================
// MASTER PREPARATION GUIDE (CREATOR INTEL GENERAL BEST PRACTICES)
// Explicitly separated from festival-specific requirements
// ============================================================================
export interface MasterDeliveryChecklistItem {
  item: string;
  category: "MASTER_VIDEO" | "AUDIO_STEMS" | "SUBS_AND_TEXT" | "PUBLICITY_EPK" | "LEGAL_AND_METADATA";
  description: string;
  recommendationTier: "PLATFORM_RECOMMENDATION";
  technicalDetails: string;
}

export const masterDeliveryChecklist: MasterDeliveryChecklistItem[] = [
  {
    item: "DCI Compliant 24fps DCP",
    category: "MASTER_VIDEO",
    description: "Theatrical projection standard for A-list festival circuit.",
    recommendationTier: "PLATFORM_RECOMMENDATION",
    technicalDetails: "SMPTE Bv2.1 container, JPEG 2000 XYZ color space, 24.00fps strict cadence, unencrypted KDM for test screenings.",
  },
  {
    item: "Apple ProRes 422 HQ / 4444 Clean Master",
    category: "MASTER_VIDEO",
    description: "High-fidelity digital archive and broadcast master.",
    recommendationTier: "PLATFORM_RECOMMENDATION",
    technicalDetails: "Rec.709 or ACEScc color space, 10-bit or 12-bit depth, native resolution without scaling artifacts, textless tail.",
  },
  {
    item: "Discrete 5.1 / 7.1 Surround Audio Stems",
    category: "AUDIO_STEMS",
    description: "Multi-channel cinema sound delivery.",
    recommendationTier: "PLATFORM_RECOMMENDATION",
    technicalDetails: "24-bit 48kHz uncompressed WAV stems (L, R, C, LFE, Ls, Rs). Dialogue, Music, and Effects (M&E) separated.",
  },
  {
    item: "Bilingual SRT & WebVTT Subtitle Files",
    category: "SUBS_AND_TEXT",
    description: "Standardized international dialogue translation.",
    recommendationTier: "PLATFORM_RECOMMENDATION",
    technicalDetails: "UTF-8 encoded .srt and .vtt files timed to 24fps video. English and native host-nation language.",
  },
  {
    item: "Electronic Press Kit (EPK) & 300 DPI Stills",
    category: "PUBLICITY_EPK",
    description: "Festival catalog and press promotion assets.",
    recommendationTier: "PLATFORM_RECOMMENDATION",
    technicalDetails: "5x high-res horizontal stills (minimum 3000px wide, 300 DPI), director headshot, one-sheet vertical poster (27x40 ratio).",
  },
  {
    item: "AI Model & Training Provenance Log",
    category: "LEGAL_AND_METADATA",
    description: "Transparent production record for emerging synthetic media regulations.",
    recommendationTier: "PLATFORM_RECOMMENDATION",
    technicalDetails: "Comprehensive ledger of diffusion, flow-matching, voice synthesis, and motion tools used, with commercial license attestations.",
  },
];

// ============================================================================
// HELPER ACCESSORS & REPOSITORIES
// ============================================================================

export function getAllStandingFestivals(): FilmFestival[] {
  return canonicalStandingFestivals;
}

export function getStandingFestivalBySlug(slug: string): FilmFestival | undefined {
  // Direct match or fallback to legacy slug mappings
  const normalizedSlug = slug.toLowerCase();
  return canonicalStandingFestivals.find(
    (f) =>
      f.slug === normalizedSlug ||
      (normalizedSlug === "tribeca-x-ai-filmmaking" && f.slug === "tribeca-film-festival") ||
      (normalizedSlug === "cannes-future-cinema-ai" && f.slug === "cannes-film-festival") ||
      (normalizedSlug === "sundance-new-frontier-ai" && f.slug === "sundance-film-festival") ||
      (normalizedSlug === "runway-ai-film-festival" && f.slug === "runway-ai-film-festival")
  );
}

export function getStandingFestivalById(id: string): FilmFestival | undefined {
  return canonicalStandingFestivals.find((f) => f.id === id);
}

export function getFestivalEditions(festivalId: string): FestivalEdition[] {
  return canonicalFestivalEditions.filter((e) => e.festivalId === festivalId);
}

export function getFestivalEditionByYear(festivalId: string, year: number): FestivalEdition | undefined {
  return canonicalFestivalEditions.find((e) => e.festivalId === festivalId && e.year === year);
}

export function getLatestEdition(festivalId: string): FestivalEdition | undefined {
  const editions = getFestivalEditions(festivalId);
  if (editions.length === 0) return undefined;
  return editions.sort((a, b) => b.year - a.year)[0];
}

export function getAllFestivalEditions(): FestivalEdition[] {
  return canonicalFestivalEditions;
}

export interface FestivalWithCurrentEdition {
  festival: FilmFestival;
  currentEdition?: FestivalEdition;
}

export function getAllFestivalsWithCurrentEdition(): FestivalWithCurrentEdition[] {
  return canonicalStandingFestivals.map((festival) => {
    const currentEdition = getLatestEdition(festival.id);
    return { festival, currentEdition };
  });
}
