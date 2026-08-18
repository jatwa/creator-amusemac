import {
  categoriesData,
  toolsData,
  promptsData,
  comparisonsData,
  workflowsData,
  tutorialsData,
  resourcesData,
  blogsData,
  videosData,
  updateLogsData,
} from "./platform-data";
import {
  Tool,
  Prompt,
  ToolComparison,
  Workflow,
  Tutorial,
  CategoryInfo,
  ResourceItem,
  BlogPost,
  VideoItem,
  UpdateLog,
} from "./types";

// Backward-compatible exports for existing components
export const categories = categoriesData.map((c) => ({
  name: c.name,
  description: c.description,
  icon: c.icon,
  slug: c.slug,
}));

export const tools = toolsData.slice(0, 3).map((t) => ({
  name: t.name,
  type: t.subcategories[0] || t.category,
  description: t.description,
  tag: t.bestFor.split(",")[0] || "For creators",
  accent: t.accentColor,
  slug: t.slug,
}));

export const prompts = promptsData.slice(0, 3).map((p) => ({
  category: p.useCase.split("/")[0]?.trim() || p.category,
  title: p.title,
  prompt: p.promptText,
  slug: p.slug,
}));

export const comparisons = comparisonsData.map((c) => {
  const toolA = toolsData.find((t) => t.id === c.toolAId);
  const toolB = toolsData.find((t) => t.id === c.toolBId);
  return {
    left: toolA ? toolA.name : "Tool A",
    right: toolB ? toolB.name : "Tool B",
    answer: c.summaryVerdict,
    category: c.category,
    slug: c.slug,
  };
});

export const tutorials = tutorialsData.slice(0, 3).map((t) => ({
  title: t.title,
  type: t.category,
  readTime: t.readTime,
  slug: t.slug,
}));

// Rich Platform Query & Getter APIs
export function getAllTools(): Tool[] {
  return toolsData;
}

export function getToolBySlug(slug: string): Tool | undefined {
  return toolsData.find((t) => t.slug === slug);
}

export function getToolById(id: string): Tool | undefined {
  return toolsData.find((t) => t.id === id);
}

export function getToolsByCategory(category: string): Tool[] {
  return toolsData.filter((t) => t.category.toLowerCase() === category.toLowerCase());
}

export function getAllPrompts(): Prompt[] {
  return promptsData;
}

export function getPromptBySlug(slug: string): Prompt | undefined {
  return promptsData.find((p) => p.slug === slug);
}

export function getPromptById(id: string): Prompt | undefined {
  return promptsData.find((p) => p.id === id);
}

export function getAllComparisons(): ToolComparison[] {
  return comparisonsData;
}

export function getComparisonBySlug(slug: string): ToolComparison | undefined {
  return comparisonsData.find((c) => c.slug === slug);
}

export function getAllWorkflows(): Workflow[] {
  return workflowsData;
}

export function getWorkflowBySlug(slug: string): Workflow | undefined {
  return workflowsData.find((w) => w.slug === slug);
}

export function getAllTutorials(): Tutorial[] {
  return tutorialsData;
}

export function getTutorialBySlug(slug: string): Tutorial | undefined {
  return tutorialsData.find((t) => t.slug === slug);
}

export function getAllCategories(): CategoryInfo[] {
  return categoriesData;
}

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return categoriesData.find((c) => c.slug === slug);
}

export function getAllResources(): ResourceItem[] {
  return resourcesData;
}

export function getAllBlogs(): BlogPost[] {
  return blogsData.filter((b) => b.status === "published");
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogsData.find((b) => b.slug === slug && b.status === "published");
}

export function getAllVideos(): VideoItem[] {
  return videosData.filter((v) => v.status === "published");
}

export function getVideoBySlug(slug: string): VideoItem | undefined {
  return videosData.find((v) => v.slug === slug && v.status === "published");
}

export function getAllUpdateLogs(): UpdateLog[] {
  return updateLogsData;
}

export function searchAllEntities(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) {
    return {
      tools: toolsData,
      prompts: promptsData,
      tutorials: tutorialsData,
      workflows: workflowsData,
      comparisons: comparisonsData,
      blogs: blogsData.filter((b) => b.status === "published"),
      videos: videosData.filter((v) => v.status === "published"),
    };
  }

  const matchedTools = toolsData.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.bestFor.toLowerCase().includes(q) ||
      t.keyFeatures.some((f) => f.toLowerCase().includes(q)) ||
      t.category.toLowerCase().includes(q)
  );

  const matchedPrompts = promptsData.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.promptText.toLowerCase().includes(q) ||
      p.useCase.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );

  const matchedTutorials = tutorialsData.filter(
    (tut) =>
      tut.title.toLowerCase().includes(q) ||
      tut.goal.toLowerCase().includes(q) ||
      tut.category.toLowerCase().includes(q)
  );

  const matchedWorkflows = workflowsData.filter(
    (w) =>
      w.title.toLowerCase().includes(q) ||
      w.summary.toLowerCase().includes(q) ||
      w.steps.some((s) => s.phaseName.toLowerCase().includes(q) || s.goal.toLowerCase().includes(q))
  );

  const matchedComparisons = comparisonsData.filter((c) => {
    const tA = getToolById(c.toolAId)?.name.toLowerCase() || "";
    const tB = getToolById(c.toolBId)?.name.toLowerCase() || "";
    return (
      tA.includes(q) ||
      tB.includes(q) ||
      c.summaryVerdict.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  });

  const matchedBlogs = blogsData.filter(
    (b) =>
      b.status === "published" &&
      (b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.tags.some((tag: string) => tag.toLowerCase().includes(q)))
  );

  const matchedVideos = videosData.filter(
    (v) =>
      v.status === "published" &&
      (v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.creator.name.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.tags.some((tag: string) => tag.toLowerCase().includes(q)))
  );

  return {
    tools: matchedTools,
    prompts: matchedPrompts,
    tutorials: matchedTutorials,
    workflows: matchedWorkflows,
    comparisons: matchedComparisons,
    blogs: matchedBlogs,
    videos: matchedVideos,
  };
}
