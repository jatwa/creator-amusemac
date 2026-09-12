import { db } from "@/lib/db/repository";
import { canonicalStandingFestivals, canonicalFestivalEditions } from "@/data/festivals-canonical";

export interface SearchIndexEntry {
  id: string;
  entityType: "tool" | "prompt" | "tutorial" | "workflow" | "comparison" | "blog" | "video" | "festival" | "festival_edition";
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
    const tokens = [prompt.title, prompt.useCase, prompt.category, prompt.promptText]
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

  // Index Workflows
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
    },
    generatedAt: new Date().toISOString(),
  };
}
