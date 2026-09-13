import { db } from "@/lib/db/repository";
import { canonicalStandingFestivals, canonicalFestivalEditions } from "@/data/festivals-canonical";
import { canonicalResearchRecords } from "@/data/research-canonical";
import { canonicalFilms, canonicalPeople } from "@/data/films-canonical";
import { canonicalTechniques } from "@/data/techniques-canonical";
import { canonicalWorkflows } from "@/data/workflows-canonical";
import { canonicalAIEntities } from "@/data/ai-entities-canonical";
import { canonicalAIContentItems } from "@/data/ai-content-canonical";

export interface SearchIndexEntry {
  id: string;
  entityType:
    | "tool"
    | "prompt"
    | "tutorial"
    | "workflow"
    | "comparison"
    | "blog"
    | "video"
    | "festival"
    | "festival_edition"
    | "research"
    | "film"
    | "person"
    | "technique"
    | "ai_entity"
    | "ai_content";
  slug: string;
  title: string;
  category: string;
  searchTokens: string[];
  snippet: string;
  weight: number;
}

export function generateSearchIndex(): {
  totalIndexed: number;
  entriesByType: Record<string, number>;
  generatedAt: string;
} {
  const tools = db.getAllTools();
  const prompts = db.getAllPrompts();
  const tutorials = db.getAllTutorials();
  const workflows = db.getAllWorkflows();
  const comparisons = db.getAllComparisons();
  const blogs = db.getPublishedBlogs();
  const videos = db.getPublishedVideos();
  const festivals = canonicalStandingFestivals;
  const festivalEditions = canonicalFestivalEditions;
  const publicResearch = canonicalResearchRecords.filter((r) => r.visibility === "PUBLIC");
  const publicFilms = canonicalFilms.filter((f) => f.visibility === "PUBLIC");
  const publicPeople = canonicalPeople.filter((p) => p.visibility === "PUBLIC");
  const publicTechniques = canonicalTechniques.filter((t) => t.visibility === "PUBLIC");
  const publicWorkflows = canonicalWorkflows.filter((w) => w.visibility === "PUBLIC");

  const entries: SearchIndexEntry[] = [];

  // Index Tools
  tools.forEach((tool) => {
    const tokens = [
      tool.name,
      tool.category,
      ...tool.subcategories,
      ...tool.keyFeatures,
      tool.pricing.model,
      tool.bestFor,
    ]
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9]+/);

    entries.push({
      id: tool.id,
      entityType: "tool",
      slug: `/tools/${tool.slug}`,
      title: tool.name,
      category: tool.category,
      searchTokens: Array.from(new Set(tokens)),
      snippet: tool.tagline,
      weight: 1.0,
    });
  });

  // Index Prompts
  prompts.forEach((prompt) => {
    const tokens = [
      prompt.title,
      prompt.useCase,
      prompt.category,
      prompt.promptText,
      ...(prompt.tags || []),
      ...(prompt.recommendedModels || []),
    ]
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9]+/);

    entries.push({
      id: prompt.id,
      entityType: "prompt",
      slug: `/prompts/${prompt.slug}`,
      title: prompt.title,
      category: prompt.category,
      searchTokens: Array.from(new Set(tokens)),
      snippet: prompt.description,
      weight: 0.85,
    });
  });

  // Index Workflows (Legacy + Canonical)
  workflows.forEach((wf) => {
    const tokens = [wf.title, wf.category, wf.summary, ...wf.steps.map((s) => s.phaseName)]
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9]+/);

    entries.push({
      id: wf.id,
      entityType: "workflow",
      slug: `/workflows/${wf.slug}`,
      title: wf.title,
      category: wf.category,
      searchTokens: Array.from(new Set(tokens)),
      snippet: wf.summary,
      weight: 0.9,
    });
  });

  // Index Canonical Public Workflows
  publicWorkflows.forEach((wf) => {
    const tokens = [
      wf.title,
      wf.category,
      wf.summary,
      wf.purpose,
      ...wf.whenToUse,
      ...wf.steps.map((s) => `${s.name} ${s.objective} ${s.action}`),
    ]
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9]+/);

    entries.push({
      id: wf.id,
      entityType: "workflow",
      slug: `/workflows/${wf.slug}`,
      title: wf.title,
      category: wf.category.replace(/_/g, " "),
      searchTokens: Array.from(new Set(tokens)),
      snippet: `${wf.category.replace(/_/g, " ")} (${wf.difficulty}) • ${wf.summary}`,
      weight: 1.0,
    });
  });

  // Index Tutorials
  tutorials.forEach((tut) => {
    const tokens = [tut.title, tut.category, tut.goal]
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9]+/);

    entries.push({
      id: tut.id,
      entityType: "tutorial",
      slug: `/tutorials/${tut.slug}`,
      title: tut.title,
      category: tut.category,
      searchTokens: Array.from(new Set(tokens)),
      snippet: tut.goal,
      weight: 0.8,
    });
  });

  // Index Blogs / Journal
  blogs.forEach((blog) => {
    const tokens = [blog.title, blog.category, ...blog.tags, blog.excerpt]
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9]+/);

    entries.push({
      id: blog.id,
      entityType: "blog",
      slug: `/journal/${blog.slug}`,
      title: blog.title,
      category: blog.category,
      searchTokens: Array.from(new Set(tokens)),
      snippet: blog.excerpt,
      weight: 0.95,
    });
  });

  // Index Videos
  videos.forEach((vid) => {
    const tokens = [vid.title, vid.category, vid.creator.name, ...vid.tags, vid.description]
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9]+/);

    entries.push({
      id: vid.id,
      entityType: "video",
      slug: `/videos/${vid.slug}`,
      title: vid.title,
      category: vid.category,
      searchTokens: Array.from(new Set(tokens)),
      snippet: vid.description,
      weight: 0.95,
    });
  });

  // Index Standing Festivals
  festivals.forEach((fest) => {
    const tokens = [
      fest.name,
      fest.acronym || "",
      fest.hostCity,
      fest.hostCountry,
      fest.region,
      fest.prestigeTier,
      ...fest.focusCategories,
      fest.description,
    ]
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9]+/);

    entries.push({
      id: fest.id,
      entityType: "festival",
      slug: `/festivals/${fest.slug}`,
      title: fest.name,
      category: fest.prestigeTier.replace(/_/g, " "),
      searchTokens: Array.from(new Set(tokens)),
      snippet: `${fest.hostCity}, ${fest.hostCountry} • ${fest.description.slice(0, 140)}...`,
      weight: 0.95,
    });
  });

  // Index Festival Editions
  festivalEditions.forEach((ed) => {
    const fest = festivals.find((f) => f.id === ed.festivalId);
    if (!fest) return;

    const tokens = [
      fest.name,
      ed.year.toString(),
      ed.season,
      ed.status,
      ...ed.acceptedFormats,
      ...ed.premiereRules.map((r) => `${r.category} ${r.requiredPremiere}`),
    ]
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9]+/);

    entries.push({
      id: ed.id,
      entityType: "festival_edition",
      slug: `/festivals/${fest.slug}/${ed.year}`,
      title: `${fest.name} (${ed.year} Edition)`,
      category: "Festival Edition",
      searchTokens: Array.from(new Set(tokens)),
      snippet: `Dates: ${ed.eventStartDate} - ${ed.eventEndDate} • ${ed.status.replace(/_/g, " ")} • Regular Due: ${ed.deadlines.regularDeadline || "TBA"}`,
      weight: 0.9,
    });
  });

  // Index Public Research Records
  publicResearch.forEach((rec) => {
    const tokens = [
      rec.researchQuestion,
      rec.topic,
      rec.findingsSummary,
      rec.methodology,
      ...rec.statements.map((s) => s.statement),
      ...rec.sources.map((src) => `${src.sourceTitle} ${src.sourcePublisher}`),
    ]
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9]+/);

    entries.push({
      id: rec.id,
      entityType: "research",
      slug: `/research/${rec.slug}`,
      title: rec.researchQuestion,
      category: rec.topic,
      searchTokens: Array.from(new Set(tokens)),
      snippet: rec.findingsSummary,
      weight: 1.0,
    });
  });

  // Index Public Films
  publicFilms.forEach((film) => {
    const tokens = [
      film.title,
      film.originalTitle || "",
      film.logline,
      film.synopsis,
      film.format,
      ...film.genres,
      ...film.countryOfOrigin,
      ...film.language,
      ...film.directors.map((d) => d.displayName || ""),
      ...film.cinematographers.map((c) => c.displayName || ""),
      ...(film.technicalSpecs.cameraSystems || []),
      ...(film.technicalSpecs.lenses || []),
      ...(film.technicalSpecs.aiGenerativeModels || []),
    ]
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9]+/);

    entries.push({
      id: film.id,
      entityType: "film",
      slug: `/films/${film.slug}`,
      title: film.title,
      category: film.format.replace(/_/g, " "),
      searchTokens: Array.from(new Set(tokens)),
      snippet: `${film.releaseYear} • ${film.technicalSpecs.aspectRatio} • ${film.logline}`,
      weight: 1.0,
    });
  });

  // Index Public People
  publicPeople.forEach((person) => {
    const tokens = [
      person.name,
      ...person.alternateNames,
      person.primaryRole,
      ...person.secondaryRoles,
      person.biography,
      person.country,
      ...person.filmography.map((f) => f.title),
      ...person.festivalAccolades.map((a) => `${a.awardTitle} ${a.festivalName}`),
    ]
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9]+/);

    entries.push({
      id: person.id,
      entityType: "person",
      slug: `/people/${person.slug}`,
      title: person.name,
      category: person.primaryRole.replace(/_/g, " "),
      searchTokens: Array.from(new Set(tokens)),
      snippet: `${person.primaryRole.replace(/_/g, " ")} (${person.country}) • ${person.biography.slice(0, 140)}...`,
      weight: 0.95,
    });
  });

  // Index Public Techniques
  publicTechniques.forEach((tech) => {
    const tokens = [
      tech.name,
      ...tech.alternateNames,
      tech.category,
      tech.subcategory || "",
      tech.description,
      tech.creativePurpose,
      tech.visualCharacteristics,
      ...tech.whenToUse,
      ...tech.technicalConsiderations,
      ...tech.relatedTools,
    ]
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9]+/);

    entries.push({
      id: tech.id,
      entityType: "technique",
      slug: `/techniques/${tech.slug}`,
      title: tech.name,
      category: tech.category.replace(/_/g, " "),
      searchTokens: Array.from(new Set(tokens)),
      snippet: `${tech.category.replace(/_/g, " ")} (${tech.difficulty}) • ${tech.creativePurpose}`,
      weight: 1.0,
    });
  });

  const publicAIEntities = canonicalAIEntities.filter((e) => e.visibility === "PUBLIC");
  const publicAIContent = canonicalAIContentItems.filter((c) => c.visibility === "PUBLIC");

  // Index Public AI Entities
  publicAIEntities.forEach((ai) => {
    const devOrg = ai.developerOrganization || ai.vendor || "";
    const overviewText = ai.overview || ai.description || "";
    const tokens = [
      ai.name,
      ai.slug,
      ai.category,
      ai.entityType,
      devOrg,
      ai.tagline,
      overviewText,
      ai.architectureOverview || "",
      ...(ai.keyCapabilities || ai.capabilities || []),
      ...(ai.cinemaStrengths || []),
      ...(ai.knownLimitations || []),
      ...(ai.modelsAndProducts || []).map((m) => `${m.name} ${m.version || ""} ${m.description}`),
    ]
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9]+/);

    entries.push({
      id: ai.id,
      entityType: "ai_entity",
      slug: `/ai/${ai.slug}`,
      title: ai.name,
      category: ai.category.replace(/_/g, " "),
      searchTokens: Array.from(new Set(tokens)),
      snippet: `${devOrg} • ${ai.tagline}`,
      weight: 1.0,
    });
  });

  // Index Public AI Content Items
  publicAIContent.forEach((item) => {
    const pub = item.sourcePublisher || item.publisher || "";
    const summaryText = item.summary || item.description || "";
    const tokens = [
      item.title,
      item.contentType,
      summaryText,
      item.editorialTakeaways || "",
      pub,
      ...(item.sourceAuthor ? [item.sourceAuthor] : item.author ? [item.author] : []),
      ...(item.cinemaTags || item.tags || []),
      ...(item.technicalDisciplines || []),
    ]
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9]+/);

    const parentSlug =
      canonicalAIEntities.find(
        (e) => e.id === item.aiEntityId || (item.aiEntityIds && item.aiEntityIds.includes(e.id))
      )?.slug || "hub";

    entries.push({
      id: item.id,
      entityType: "ai_content",
      slug: `/ai/${parentSlug}#content-${item.id}`,
      title: item.title,
      category: item.contentType.replace(/_/g, " "),
      searchTokens: Array.from(new Set(tokens)),
      snippet: `${pub} (${item.contentType}) • ${summaryText.slice(0, 140)}...`,
      weight: 0.9,
    });
  });

  return {
    totalIndexed: entries.length,
    entriesByType: {
      tools: tools.length,
      prompts: prompts.length,
      workflows: workflows.length,
      tutorials: tutorials.length,
      comparisons: comparisons.length,
      blogs: blogs.length,
      videos: videos.length,
      festivals: festivals.length,
      festivalEditions: festivalEditions.length,
      research: publicResearch.length,
      films: publicFilms.length,
      people: publicPeople.length,
      techniques: publicTechniques.length,
      aiEntities: publicAIEntities.length,
      aiContent: publicAIContent.length,
    },
    generatedAt: new Date().toISOString(),
  };
}
