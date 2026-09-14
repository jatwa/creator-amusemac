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
import { canonicalAIEntities } from "@/data/ai-entities-canonical";
import { canonicalFilms, canonicalPeople } from "@/data/films-canonical";
import { canonicalTechniques } from "@/data/techniques-canonical";
import { canonicalResearchRecords } from "@/data/research-canonical";
import { getAllStandingFestivals, getAllFestivalEditions } from "@/data/festivals-canonical";

function toSafeIsoDate(d?: string | null): string {
  if (!d) return new Date().toISOString();
  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://creatorintels.com";

  // Static indexable public routes
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/pricing",
    "/ai",
    "/tools",
    "/prompts",
    "/prompts/factory",
    "/prompts/vault",
    "/compare",
    "/stories",
    "/festivals",
    "/journal",
    "/research",
    "/films",
    "/people",
    "/techniques",
    "/kits",
    "/tutorials",
    "/workflows",
    "/categories",
    "/resources",
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
    priority: route === "" || route === "/ai" ? 1.0 : route === "/pricing" ? 0.95 : 0.8,
  }));

  // Tool routes
  const toolRoutes: MetadataRoute.Sitemap = toolsData
    .filter((t: any) => !t.status || t.status === "published")
    .map((tool) => ({
      url: `${baseUrl}/tools/${tool.slug}`,
      lastModified: toSafeIsoDate(tool.updatedAt),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

  // Story case studies
  const storyRoutes: MetadataRoute.Sitemap = storiesData
    .filter((s: any) => !s.status || s.status === "published" || s.status === "Case Study")
    .map((story) => ({
      url: `${baseUrl}/stories/${story.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

  // Blog routes
  const blogRoutes: MetadataRoute.Sitemap = blogsData
    .filter((b) => !b.status || b.status === "published")
    .map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: toSafeIsoDate(blog.updatedAt || blog.publishedAt),
      changeFrequency: "weekly",
      priority: 0.85,
    }));

  // Journal routes
  const journalRoutes: MetadataRoute.Sitemap = blogsData
    .filter((b) => !b.status || b.status === "published")
    .map((blog) => ({
      url: `${baseUrl}/journal/${blog.slug}`,
      lastModified: toSafeIsoDate(blog.updatedAt || blog.publishedAt),
      changeFrequency: "weekly",
      priority: 0.85,
    }));

  // Video routes
  const videoRoutes: MetadataRoute.Sitemap = videosData
    .filter((v) => !v.status || v.status === "published")
    .map((video) => ({
      url: `${baseUrl}/videos/${video.slug}`,
      lastModified: toSafeIsoDate(video.publishedAt),
      changeFrequency: "weekly",
      priority: 0.85,
    }));

  // Prompt routes
  const promptRoutes: MetadataRoute.Sitemap = promptsData
    .filter((p: any) => !p.status || p.status === "published")
    .map((prompt) => ({
      url: `${baseUrl}/prompts/${prompt.slug}`,
      lastModified: toSafeIsoDate(prompt.verifiedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  // Comparison routes
  const comparisonRoutes: MetadataRoute.Sitemap = comparisonsData.map((comp) => ({
    url: `${baseUrl}/compare/${comp.slug}`,
    lastModified: toSafeIsoDate(comp.updatedAt),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  // Tutorial routes
  const tutorialRoutes: MetadataRoute.Sitemap = tutorialsData
    .filter((t: any) => !t.status || t.status === "published")
    .map((tut) => ({
      url: `${baseUrl}/tutorials/${tut.slug}`,
      lastModified: toSafeIsoDate(tut.updatedAt),
      changeFrequency: "monthly",
      priority: 0.85,
    }));

  // Workflow routes
  const workflowRoutes: MetadataRoute.Sitemap = workflowsData
    .filter((w: any) => !w.status || w.status === "published")
    .map((wf) => ({
      url: `${baseUrl}/workflows/${wf.slug}`,
      lastModified: toSafeIsoDate(wf.lastUpdated),
      changeFrequency: "monthly",
      priority: 0.9,
    }));

  // AI Entity routes
  const aiEntityRoutes: MetadataRoute.Sitemap = canonicalAIEntities
    .filter((e) => e.visibility === "PUBLIC")
    .map((e) => ({
      url: `${baseUrl}/ai/${e.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

  // Standing Festival routes
  const standingFestivals = getAllStandingFestivals();
  const standingFestivalRoutes: MetadataRoute.Sitemap = standingFestivals.map((fest) => ({
    url: `${baseUrl}/festivals/${fest.slug}`,
    lastModified: toSafeIsoDate(fest.verifiedAt),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Festival Edition routes
  const festivalEditions = getAllFestivalEditions();
  const festivalEditionRoutes: MetadataRoute.Sitemap = festivalEditions
    .map((edition) => {
      const fest = standingFestivals.find((f) => f.id === edition.festivalId);
      if (!fest) return null;
      return {
        url: `${baseUrl}/festivals/${fest.slug}/${edition.year}`,
        lastModified: toSafeIsoDate(fest.verifiedAt),
        changeFrequency: "weekly",
        priority: 0.85,
      };
    })
    .filter(Boolean) as MetadataRoute.Sitemap;

  // Technique routes
  const techniqueRoutes: MetadataRoute.Sitemap = canonicalTechniques
    .filter((t) => t.visibility === "PUBLIC")
    .map((t) => ({
      url: `${baseUrl}/techniques/${t.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

  // Film routes
  const filmRoutes: MetadataRoute.Sitemap = canonicalFilms
    .filter((f) => f.visibility === "PUBLIC")
    .map((f) => ({
      url: `${baseUrl}/films/${f.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

  // People routes
  const peopleRoutes: MetadataRoute.Sitemap = canonicalPeople
    .filter((p) => p.visibility === "PUBLIC")
    .map((p) => ({
      url: `${baseUrl}/people/${p.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.85,
    }));

  // Research routes
  const researchRoutes: MetadataRoute.Sitemap = canonicalResearchRecords
    .filter((r) => r.visibility === "PUBLIC")
    .map((r) => ({
      url: `${baseUrl}/research/${r.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
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
    ...aiEntityRoutes,
    ...standingFestivalRoutes,
    ...festivalEditionRoutes,
    ...techniqueRoutes,
    ...filmRoutes,
    ...peopleRoutes,
    ...researchRoutes,
    ...toolRoutes,
    ...storyRoutes,
    ...blogRoutes,
    ...journalRoutes,
    ...videoRoutes,
    ...promptRoutes,
    ...comparisonRoutes,
    ...tutorialRoutes,
    ...workflowRoutes,
    ...categoryRoutes,
  ];
}
