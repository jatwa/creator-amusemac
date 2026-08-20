import { AIFilmFestival } from "./types";

export const festivalsData: AIFilmFestival[] = [
  {
    id: "fest-runway-aiff",
    slug: "runway-ai-film-festival",
    name: "Runway AI Film Festival (AIFF)",
    hostCity: "New York & Los Angeles",
    country: "USA",
    seasonYear: "2026",
    deadline: "October 15, 2026",
    prizes: "$60,000 in cash grants + studio artist residencies",
    eligibility: "Open to international filmmakers, animators, and creative technologists worldwide.",
    aiDisclosureRule: "Requires written production breakdown detailing AI models used across concept, image, motion, and audio stages.",
    submissionFormat: "1080p or 4K ProRes / MP4, 1 to 10 minutes runtime, 16:9 or 2.39:1 aspect ratio.",
    officialUrl: "https://aiff.runwayml.com",
    lastVerified: "August 2026",
    readinessChecklist: [
      { item: "Concept Treatment & Production Log", required: true, notes: "Document the exact prompts, tools, and iteration workflow." },
      { item: "Original or Cleared Audio Stems", required: true, notes: "All voice models and music must have verifiable commercial clearance." },
      { item: "High-Bitrate 4K Master Export", required: true, notes: "Topaz or DaVinci upscaled master file without web compression artifacts." },
      { item: "Under 10 Minutes Runtime", required: true, notes: "Strict time limit for official competition screening slots." }
    ]
  },
  {
    id: "fest-tribeca-ai",
    slug: "tribeca-x-ai-filmmaking",
    name: "Tribeca Film Festival — AI Cinema Pavilion",
    hostCity: "New York",
    country: "USA",
    seasonYear: "2026",
    deadline: "December 01, 2026",
    prizes: "Official Tribeca Screening + Industry Distribution Networking",
    eligibility: "Narrative, documentary, and experimental films utilizing machine intelligence.",
    aiDisclosureRule: "Full ethical AI disclosure required at time of submission including training data rights transparency.",
    submissionFormat: "DCP or ProRes 422 HQ, up to 15 minutes runtime.",
    officialUrl: "https://tribecafilm.com",
    lastVerified: "August 2026",
    readinessChecklist: [
      { item: "Director Statement on AI Methodology", required: true, notes: "Explain the artistic rationale for generative media in the narrative." },
      { item: "Full Copyright & Voice Clearance", required: true, notes: "No unauthorized likeness or celebrity voice clones permitted." },
      { item: "DCP Compatible Master", required: true, notes: "24fps theatrical cadence standard." }
    ]
  },
  {
    id: "fest-cannes-future-cinema",
    slug: "cannes-future-cinema-ai",
    name: "Cannes Marché du Film — AI Future Cinema Showcase",
    hostCity: "Cannes",
    country: "France",
    seasonYear: "2026",
    deadline: "February 15, 2027",
    prizes: "European Co-Production Grants & Studio Previs Awards",
    eligibility: "Commercial producers, feature directors, and XR/AI production studios.",
    aiDisclosureRule: "Clear demarcation of human cinematography vs synthetic generation.",
    submissionFormat: "ProRes 4444 or 422 HQ, Subtitled in English/French.",
    officialUrl: "https://www.marchedufilm.com",
    lastVerified: "August 2026",
    readinessChecklist: [
      { item: "International Dialogue Subtitles (SRT)", required: true, notes: "English and French subtitles formatted." },
      { item: "Co-production Pitch Deck", required: false, notes: "Recommended for feature previs submissions." }
    ]
  }
];
