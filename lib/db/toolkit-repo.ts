import { FilmProject, ToolkitStage, ProjectSceneItem, ProjectVisualLanguage, ProjectPostPipelineItem } from "@/data/film-intelligence-types";
import { queryNeon } from "./neon";

// In-memory private storage fallback (keyed strictly by userId)
const localProjectsStore: Map<string, FilmProject[]> = new Map();

/**
 * Generate default visual language board for new projects
 */
export function createDefaultVisualLanguage(): ProjectVisualLanguage {
  return {
    visualIntent: "Establish a grounded, cinematic atmosphere with organic texture and naturalistic lighting contrast.",
    compositionPrinciples: [
      "Rule of thirds with intentional negative space",
      "Dynamic leading lines towards character focal points",
      "Layered depth planes (foreground, midground, background)"
    ],
    cameraLanguage: "Deliberate dolly push-ins and grounded handheld camera motion with physical inertia.",
    lensLanguage: "Anamorphic 35mm / 50mm / 85mm prime lenses with 2x squeeze and gentle edge halation.",
    lightingLanguage: "High-contrast motivated practical sources, soft window falloff, subtle chiaroscuro rim accents.",
    colorPalette: ["#0F172A", "#334155", "#F59E0B", "#10B981", "#E2E8F0"],
    aspectRatio: "2.39:1 (Cinemascope)",
    movementGrammar: "Steadicam pacing matching the psychological tempo of the narrative.",
    textureEnvironmentNotes: "Fine 35mm organic film grain, volumetric atmosphere with suspended dust and light beams."
  };
}

/**
 * Generate default post-production pipeline stages
 */
export function createDefaultPostPipeline(): ProjectPostPipelineItem[] {
  return [
    { stage: "DAILIES_INGEST", status: "NOT_STARTED", notes: "RAW backup and checksum verification" },
    { stage: "OFFLINE_EDITORIAL_ASSEMBLY", status: "NOT_STARTED", notes: "Scene assembly and radio edit" },
    { stage: "ROUGH_CUT_ROUNDS", status: "NOT_STARTED", notes: "Director cut iterations" },
    { stage: "PICTURE_LOCK", status: "NOT_STARTED", notes: "Final timing lock" },
    { stage: "VFX_COMPOSITING", status: "NOT_STARTED", notes: "Synthetic plate composites and paint cleanup" },
    { stage: "COLOR_GRADING", status: "NOT_STARTED", notes: "ACES / DaVinci Resolve DCI-P3 grade" },
    { stage: "FINAL_RE_RECORDING_MIX_5_1_7_1", status: "NOT_STARTED", notes: "Theatrical 5.1 / 7.1 printmaster mix (-24 LKFS)" },
    { stage: "DCP_MASTERING", status: "NOT_STARTED", notes: "SMPTE 2006 DCI DCP packaging and QC" }
  ];
}

/**
 * Generate starter template projects for demonstration & first-time users
 */
function createStarterProjects(userId: string): FilmProject[] {
  const timestamp = new Date().toISOString();
  return [
    {
      id: `proj-${userId.slice(0, 8)}-demo-01`,
      slug: "chronicles-of-the-monsoon",
      userId,
      visibility: "PRIVATE",
      title: "Chronicles of the Monsoon",
      logline: "In a rain-drenched coastal metropolis, an insomniac archivist uncovers acoustic recordings that predict impending municipal collapse.",
      synopsis: "Set against the backdrop of an endless tropical monsoon season, the story follows Elena, an audio preservationist who discovers ultrasonic resonance patterns embedded inside vintage tape reels. As she maps the frequencies, she realizes the soundwaves correspond to structural fractures beneath the harbor district.",
      format: "FEATURE",
      genres: ["Neo-Noir", "Psychological Drama", "Mystery"],
      projectType: "FEATURE",
      currentStage: "AI_PREVIS_AND_LOOKBOOK",
      toolkitStage: "04_VISUAL_LANGUAGE",
      completedStages: ["01_CONCEPT", "02_RESEARCH", "03_STORY"],
      directorName: "Director Workspace",
      runtimeMinutes: 104,
      language: ["English", "Hindi"],
      countryOfOrigin: ["India", "France"],
      targetPremiereWindow: "Cannes 2027 / Venice 2027",
      targetPremiereType: "WORLD_PREMIERE",
      creativeIntent: "Blend tactile 35mm neo-noir cinematography with immersive binaural soundscapes to explore urban alienation and climate anxiety.",
      
      // Relational IDs
      researchIds: ["res-anamorphic-vs-spherical-optics", "res-cannes-competition-dcp-specs"],
      filmReferenceIds: ["film-blade-runner-2049", "film-all-we-imagine-as-light"],
      peopleReferenceIds: ["person-roger-deakins", "person-payal-kapadia"],
      festivalIds: ["cannes", "venice", "sundance"],
      techniqueIds: ["tech-anamorphic-optics", "tech-chiaroscuro-lighting", "tech-volumetric-haze", "tech-binaural-sound"],
      toolIds: ["tool-runway", "tool-kling", "tool-davinci-resolve", "tool-flux"],
      promptIds: ["prompt-01-golden-hour-arrival", "prompt-02-rainy-night-street", "prompt-03-lonely-apartment"],
      workflowIds: ["wf-cinematic-lookbook", "wf-ai-previs-animatic", "wf-dci-dcp-mastering"],

      visualLanguage: {
        visualIntent: "Saturated nocturnal neon reflecting on wet asphalt juxtaposed against soft, warm tungsten interior sanctuaries.",
        compositionPrinciples: [
          "Wide horizontal Cinemascope framing with low horizon line",
          "Vertical raindrops catching specular bokeh streaks",
          "Extreme telephoto compression during street transit scenes"
        ],
        cameraLanguage: "Slow deliberate dolly push-ins and low-angle motorized gimbal tracking.",
        lensLanguage: "Cooke Anamorphic /i Special Flare primes with custom horizontal blue streak flare.",
        lightingLanguage: "High-contrast motivated streetlighting (cyan & amber sodium vapor) with 3:1 key-to-fill ratios.",
        colorPalette: ["#0284C7", "#0F172A", "#F59E0B", "#DC2626", "#059669"],
        aspectRatio: "2.39:1 (Cinemascope)",
        movementGrammar: "Gliding camera inertia conveying psychological detachment.",
        textureEnvironmentNotes: "Heavy rain precipitation, mist diffusion, and tactile film halation."
      },

      scenes: [
        {
          id: "sc-01",
          sceneNumber: 1,
          title: "The Archival Basement",
          slugline: "INT. MUNICIPAL ARCHIVES - NIGHT",
          timeOfDay: "NIGHT",
          locationType: "INT",
          locationName: "Old Municipal Vault",
          synopsis: "Elena operates the reel-to-reel tape machine as rainwater drips into buckets around her.",
          characters: ["Elena"],
          storyPurpose: "Introduce protagonist obsession and acoustic isolation.",
          techniqueIds: ["tech-chiaroscuro-lighting", "tech-binaural-sound"],
          toolIds: ["tool-davinci-resolve"],
          promptIds: ["prompt-03-lonely-apartment"],
          filmReferenceIds: ["film-all-we-imagine-as-light"],
          shots: [
            {
              id: "sh-01-01",
              shotNumber: 1,
              shotType: "Extreme Close-Up",
              framing: "Reel-to-reel tape head vibrating against magnetic tape",
              cameraMovement: "Macro static lock-off",
              lens: "100mm Macro T2.8",
              composition: "Tape guide pinned to upper horizontal third",
              lighting: "Warm 40W tungsten desk lamp angle raking across brass dials",
              action: "Magnetic tape slides past spinning capstan wheel",
              soundDialogueNote: "Isolated mechanical hiss and rhythmic tape wobble",
              estimatedDurationSec: 5,
              techniqueId: "tech-chiaroscuro-lighting",
              toolId: "tool-flux",
              promptId: "prompt-03-lonely-apartment"
            },
            {
              id: "sh-01-02",
              shotNumber: 2,
              shotType: "Medium Close-Up",
              framing: "Elena wearing heavy headphones, eyes closed in concentration",
              cameraMovement: "Slow slow push-in (0.2 m/s)",
              lens: "50mm Anamorphic Prime",
              composition: "Center-weighted character framing with window rain in soft background",
              lighting: "Soft blue window ambient fill vs warm desk key",
              action: "Elena adjusts volume knob; her eyes suddenly snap open",
              soundDialogueNote: "Sudden low-frequency sub-bass acoustic rumble",
              estimatedDurationSec: 7,
              techniqueId: "tech-anamorphic-optics",
              toolId: "tool-runway",
              promptId: "prompt-01-golden-hour-arrival"
            }
          ]
        },
        {
          id: "sc-02",
          sceneNumber: 2,
          title: "Midnight Harbor Crossing",
          slugline: "EXT. DOWNTOWN HARBOR BRIDGE - NIGHT",
          timeOfDay: "NIGHT",
          locationType: "EXT",
          locationName: "Harbor Skyway Bridge",
          synopsis: "Elena walks across the suspension bridge in torrential rain, recording harbor frequency resonance.",
          characters: ["Elena"],
          storyPurpose: "Escalate spatial danger and establish atmospheric scale.",
          techniqueIds: ["tech-volumetric-haze", "tech-anamorphic-optics"],
          toolIds: ["tool-runway", "tool-kling"],
          promptIds: ["prompt-02-rainy-night-street"],
          filmReferenceIds: ["film-blade-runner-2049"],
          shots: [
            {
              id: "sh-02-01",
              shotNumber: 1,
              shotType: "Wide Tracking Shot",
              framing: "Elena in dark trenchcoat crossing wet bridge deck under towering cables",
              cameraMovement: "Smooth low-angle gimbal tracking alongside protagonist",
              lens: "35mm Anamorphic Prime",
              composition: "Diagonal suspension cables creating dramatic leading lines",
              lighting: "High-contrast sodium vapor streetlights reflecting in wet asphalt",
              action: "Elena holds acoustic shotgun microphone towards harbor waters",
              soundDialogueNote: "Driving rain, distant foghorn, structural cable whine",
              estimatedDurationSec: 6,
              techniqueId: "tech-volumetric-haze",
              toolId: "tool-kling",
              promptId: "prompt-02-rainy-night-street"
            }
          ]
        }
      ],

      postPipeline: [
        { stage: "DAILIES_INGEST", status: "COMPLETE", notes: "RAW camera archives backed up on dual SSD RAID", completedAt: "2026-09-10" },
        { stage: "OFFLINE_EDITORIAL_ASSEMBLY", status: "IN_PROGRESS", notes: "First 40 minutes assembled in DaVinci timeline" },
        { stage: "ROUGH_CUT_ROUNDS", status: "NOT_STARTED", notes: "Scheduled for October review" },
        { stage: "PICTURE_LOCK", status: "NOT_STARTED" },
        { stage: "VFX_COMPOSITING", status: "NOT_STARTED", toolIds: ["tool-runway", "tool-after-effects"] },
        { stage: "COLOR_GRADING", status: "NOT_STARTED", techniqueIds: ["tech-bleach-bypass"], toolIds: ["tool-davinci-resolve"] },
        { stage: "FINAL_RE_RECORDING_MIX_5_1_7_1", status: "NOT_STARTED", techniqueIds: ["tech-binaural-sound"], toolIds: ["tool-davinci-resolve"] },
        { stage: "DCP_MASTERING", status: "NOT_STARTED", toolIds: ["tool-dcp-o-matic"], workflowIds: ["wf-dci-dcp-mastering"] }
      ],

      workflowStates: [
        {
          workflowId: "wf-cinematic-lookbook",
          stepStates: { 1: "COMPLETE", 2: "COMPLETE", 3: "COMPLETE", 4: "IN_PROGRESS", 5: "NOT_STARTED" }
        },
        {
          workflowId: "wf-ai-previs-animatic",
          stepStates: { 1: "COMPLETE", 2: "IN_PROGRESS", 3: "NOT_STARTED", 4: "NOT_STARTED", 5: "NOT_STARTED" }
        }
      ],

      targetFestivals: [
        {
          festivalId: "cannes",
          editionId: "cannes-2027",
          targetDeadlineTier: "REGULAR",
          claimedPremiere: "WORLD_PREMIERE",
          notes: "Targeting Un Certain Regard or Directors' Fortnight competition.",
          status: "DRAFT"
        },
        {
          festivalId: "venice",
          editionId: "venice-2027",
          targetDeadlineTier: "REGULAR",
          claimedPremiere: "INTERNATIONAL_PREMIERE",
          notes: "Fallback target if Cannes premiere window shifts.",
          status: "DRAFT"
        }
      ],

      sceneBreakdowns: [],
      postProductionStages: [],
      festivalChecklist: [],
      attachedResearchIds: ["res-anamorphic-vs-spherical-optics"],
      createdAt: timestamp,
      updatedAt: timestamp
    }
  ];
}

/**
 * Fetch all projects belonging to the authenticated user
 */
export async function getUserProjects(userId: string): Promise<FilmProject[]> {
  if (!userId) return [];

  // 1. Try Neon Database if connected
  try {
    const res = await queryNeon<any>(
      `SELECT * FROM film_projects WHERE user_id = $1 ORDER BY updated_at DESC`,
      [userId]
    );
    if (res && res.rows.length > 0) {
      return res.rows.map(mapDbRowToFilmProject);
    }
  } catch (err: any) {
    console.warn("[ToolkitRepo: Neon query fallback]", err.message);
  }

  // 2. Fallback to user-scoped in-memory store
  if (!localProjectsStore.has(userId)) {
    const starter = createStarterProjects(userId);
    localProjectsStore.set(userId, starter);
  }

  return localProjectsStore.get(userId) || [];
}

/**
 * Get single project by ID (STRICTLY scoped to userId)
 */
export async function getProjectById(
  projectId: string,
  userId: string
): Promise<FilmProject | null> {
  if (!projectId || !userId) return null;

  // 1. Try Neon
  try {
    const res = await queryNeon<any>(
      `SELECT * FROM film_projects WHERE id = $1 AND user_id = $2 LIMIT 1`,
      [projectId, userId]
    );
    if (res && res.rows.length > 0) {
      return mapDbRowToFilmProject(res.rows[0]);
    }
  } catch (err: any) {
    console.warn("[ToolkitRepo: Neon query fallback]", err.message);
  }

  // 2. Fallback to local store
  const userProjects = await getUserProjects(userId);
  return userProjects.find((p) => p.id === projectId && p.userId === userId) || null;
}

/**
 * Create a new minimal project for authenticated user
 */
export async function createProject(
  userId: string,
  data: Partial<FilmProject>
): Promise<FilmProject> {
  const timestamp = new Date().toISOString();
  const id = `proj-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
  const title = (data.title || "Untitled Cinematic Project").trim();
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `project-${Date.now()}`;

  const newProject: FilmProject = {
    id,
    slug: `${slug}-${id.slice(-4)}`,
    userId,
    visibility: "PRIVATE",
    title,
    logline: data.logline || "",
    synopsis: data.synopsis || "",
    format: data.format || "FEATURE",
    genres: data.genres || ["Drama"],
    projectType: data.projectType || "FEATURE",
    currentStage: "CONCEPT_DEVELOPMENT",
    toolkitStage: "01_CONCEPT",
    completedStages: [],
    directorName: data.directorName || "Director",
    runtimeMinutes: data.runtimeMinutes || 90,
    language: data.language || ["English"],
    countryOfOrigin: data.countryOfOrigin || ["United States"],
    targetPremiereWindow: data.targetPremiereWindow || "TBD",
    targetPremiereType: data.targetPremiereType || "WORLD_PREMIERE",
    creativeIntent: data.creativeIntent || "",

    researchIds: data.researchIds || [],
    filmReferenceIds: data.filmReferenceIds || [],
    peopleReferenceIds: data.peopleReferenceIds || [],
    festivalIds: data.festivalIds || [],
    techniqueIds: data.techniqueIds || [],
    toolIds: data.toolIds || [],
    promptIds: data.promptIds || [],
    workflowIds: data.workflowIds || [],

    visualLanguage: data.visualLanguage || createDefaultVisualLanguage(),
    scenes: data.scenes || [],
    postPipeline: data.postPipeline || createDefaultPostPipeline(),
    workflowStates: data.workflowStates || [],
    targetFestivals: data.targetFestivals || [],

    sceneBreakdowns: [],
    postProductionStages: [],
    festivalChecklist: [],
    attachedResearchIds: data.researchIds || [],
    createdAt: timestamp,
    updatedAt: timestamp
  };

  // 1. Try insert into Neon
  try {
    await queryNeon(
      `INSERT INTO film_projects (
        id, slug, user_id, visibility, title, logline, synopsis, format,
        genres, current_stage, director_name, target_premiere_window,
        target_premiere_type, scene_breakdowns, post_production_stages,
        festival_checklist, attached_research_ids, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
      [
        newProject.id,
        newProject.slug,
        newProject.userId,
        newProject.visibility,
        newProject.title,
        newProject.logline,
        newProject.synopsis,
        newProject.format,
        JSON.stringify(newProject.genres),
        newProject.currentStage,
        newProject.directorName,
        newProject.targetPremiereWindow,
        newProject.targetPremiereType,
        JSON.stringify(newProject.scenes),
        JSON.stringify(newProject.postPipeline),
        JSON.stringify(newProject.targetFestivals),
        JSON.stringify(newProject.researchIds),
        newProject.createdAt,
        newProject.updatedAt
      ]
    );
  } catch (err: any) {
    console.warn("[ToolkitRepo: Neon insert fallback to memory]", err.message);
  }

  // 2. Add to in-memory store
  const existing = localProjectsStore.get(userId) || [];
  localProjectsStore.set(userId, [newProject, ...existing]);

  return newProject;
}

/**
 * Update project fields (with strict userId verification)
 */
export async function updateProject(
  projectId: string,
  userId: string,
  data: Partial<FilmProject>
): Promise<FilmProject | null> {
  if (!projectId || !userId) return null;

  const existing = await getProjectById(projectId, userId);
  if (!existing) return null;

  const timestamp = new Date().toISOString();
  const updated: FilmProject = {
    ...existing,
    ...data,
    id: existing.id,
    userId: existing.userId, // Prevent ownership modification
    updatedAt: timestamp
  };

  // 1. Try Neon Update
  try {
    await queryNeon(
      `UPDATE film_projects SET
        title = $1, logline = $2, synopsis = $3, format = $4, genres = $5,
        current_stage = $6, director_name = $7, target_premiere_window = $8,
        target_premiere_type = $9, scene_breakdowns = $10, post_production_stages = $11,
        festival_checklist = $12, attached_research_ids = $13, updated_at = $14
      WHERE id = $15 AND user_id = $16`,
      [
        updated.title,
        updated.logline,
        updated.synopsis,
        updated.format,
        JSON.stringify(updated.genres),
        updated.currentStage,
        updated.directorName,
        updated.targetPremiereWindow,
        updated.targetPremiereType,
        JSON.stringify(updated.scenes || []),
        JSON.stringify(updated.postPipeline || []),
        JSON.stringify(updated.targetFestivals || []),
        JSON.stringify(updated.researchIds || []),
        updated.updatedAt,
        projectId,
        userId
      ]
    );
  } catch (err: any) {
    console.warn("[ToolkitRepo: Neon update fallback to memory]", err.message);
  }

  // 2. Update memory store
  const userProjects = localProjectsStore.get(userId) || [];
  const idx = userProjects.findIndex((p) => p.id === projectId);
  if (idx !== -1) {
    userProjects[idx] = updated;
    localProjectsStore.set(userId, userProjects);
  }

  return updated;
}

/**
 * Delete project (strictly scoped to userId)
 */
export async function deleteProject(
  projectId: string,
  userId: string
): Promise<boolean> {
  if (!projectId || !userId) return false;

  // 1. Try Neon delete
  try {
    await queryNeon(
      `DELETE FROM film_projects WHERE id = $1 AND user_id = $2`,
      [projectId, userId]
    );
  } catch (err: any) {
    console.warn("[ToolkitRepo: Neon delete fallback]", err.message);
  }

  // 2. Memory store delete
  const userProjects = localProjectsStore.get(userId) || [];
  const filtered = userProjects.filter((p) => p.id !== projectId);
  localProjectsStore.set(userId, filtered);

  return true;
}

function mapDbRowToFilmProject(r: any): FilmProject {
  const scenes = typeof r.scene_breakdowns === "string" ? JSON.parse(r.scene_breakdowns || "[]") : r.scene_breakdowns || [];
  const postPipeline = typeof r.post_production_stages === "string" ? JSON.parse(r.post_production_stages || "[]") : r.post_production_stages || [];
  const targetFestivals = typeof r.festival_checklist === "string" ? JSON.parse(r.festival_checklist || "[]") : r.festival_checklist || [];
  const researchIds = typeof r.attached_research_ids === "string" ? JSON.parse(r.attached_research_ids || "[]") : r.attached_research_ids || [];

  return {
    id: r.id,
    slug: r.slug,
    userId: r.user_id,
    visibility: "PRIVATE",
    title: r.title,
    logline: r.logline || "",
    synopsis: r.synopsis || "",
    format: r.format || "FEATURE",
    genres: Array.isArray(r.genres) ? r.genres : JSON.parse(r.genres || '["Drama"]'),
    currentStage: r.current_stage || "CONCEPT_DEVELOPMENT",
    toolkitStage: "01_CONCEPT",
    completedStages: [],
    directorName: r.director_name || "Director",
    targetPremiereWindow: r.target_premiere_window,
    targetPremiereType: r.target_premiere_type,
    researchIds,
    filmReferenceIds: [],
    peopleReferenceIds: [],
    festivalIds: [],
    techniqueIds: [],
    toolIds: [],
    promptIds: [],
    workflowIds: [],
    visualLanguage: createDefaultVisualLanguage(),
    scenes,
    postPipeline,
    workflowStates: [],
    targetFestivals,
    sceneBreakdowns: [],
    postProductionStages: [],
    festivalChecklist: [],
    attachedResearchIds: researchIds,
    createdAt: r.created_at || new Date().toISOString(),
    updatedAt: r.updated_at || new Date().toISOString()
  };
}
