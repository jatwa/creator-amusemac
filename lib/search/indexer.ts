import { db } from "@/lib/db/repository";

export interface SearchIndexEntry {
  id: string;
  entityType: "tool" | "prompt" | "tutorial" | "workflow" | "comparison" | "blog" | "video";
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

  // Index Blogs
  blogs.forEach((blog) => {
    const tokens = [blog.title, blog.category, ...blog.tags, blog.excerpt]
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9]+/);

    entries.push({
      id: blog.id,
      entityType: "blog",
      slug: `/blog/${blog.slug}`,
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
    },
    generatedAt: new Date().toISOString(),
  };
}
