import { MetadataRoute } from "next";
import {
  toolsData,
  promptsData,
  comparisonsData,
  tutorialsData,
  workflowsData,
  categoriesData,
  blogsData,
  videosData,
} from "@/data/platform-data";
import { storiesData } from "@/data/production-stories";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://creator-amusemac.vercel.app";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/tools",
    "/prompts",
    "/prompts/factory",
    "/compare",
    "/stories",
    "/festivals",
    "/kits",
    "/tutorials",
    "/workflows",
    "/categories",
    "/resources",
    "/search",
    "/blog",
    "/videos",
    "/about",
    "/privacy",
    "/terms",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Tool routes
  const toolRoutes: MetadataRoute.Sitemap = toolsData.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: new Date(tool.updatedAt).toISOString(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Story case studies
  const storyRoutes: MetadataRoute.Sitemap = storiesData.map((story) => ({
    url: `${baseUrl}/stories/${story.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Blog routes
  const blogRoutes: MetadataRoute.Sitemap = blogsData
    .filter((b) => b.status === "published")
    .map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.updatedAt).toISOString(),
      changeFrequency: "weekly",
      priority: 0.85,
    }));

  // Video routes
  const videoRoutes: MetadataRoute.Sitemap = videosData
    .filter((v) => v.status === "published")
    .map((video) => ({
      url: `${baseUrl}/videos/${video.slug}`,
      lastModified: new Date(video.publishedAt).toISOString(),
      changeFrequency: "weekly",
      priority: 0.85,
    }));

  // Prompt routes
  const promptRoutes: MetadataRoute.Sitemap = promptsData.map((prompt) => ({
    url: `${baseUrl}/prompts/${prompt.slug}`,
    lastModified: new Date(prompt.verifiedAt).toISOString(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Comparison routes
  const comparisonRoutes: MetadataRoute.Sitemap = comparisonsData.map((comp) => ({
    url: `${baseUrl}/compare/${comp.slug}`,
    lastModified: new Date(comp.updatedAt).toISOString(),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  // Tutorial routes
  const tutorialRoutes: MetadataRoute.Sitemap = tutorialsData.map((tut) => ({
    url: `${baseUrl}/tutorials/${tut.slug}`,
    lastModified: new Date(tut.updatedAt).toISOString(),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  // Workflow routes
  const workflowRoutes: MetadataRoute.Sitemap = workflowsData.map((wf) => ({
    url: `${baseUrl}/workflows/${wf.slug}`,
    lastModified: new Date(wf.lastUpdated).toISOString(),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  // Category routes
  const categoryRoutes: MetadataRoute.Sitemap = categoriesData.map((cat) => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [
    ...staticRoutes,
    ...toolRoutes,
    ...storyRoutes,
    ...blogRoutes,
    ...videoRoutes,
    ...promptRoutes,
    ...comparisonRoutes,
    ...tutorialRoutes,
    ...workflowRoutes,
    ...categoryRoutes,
  ];
}
