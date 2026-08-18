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
} from "@/data/types";
import {
  toolsData,
  promptsData,
  comparisonsData,
  workflowsData,
  tutorialsData,
  categoriesData,
  resourcesData,
  blogsData,
  videosData,
} from "@/data/platform-data";
import { SourceRecord, UpdateEvent, VerificationLog } from "./types";

export class PlatformRepository {
  private tools: Map<string, Tool> = new Map();
  private prompts: Map<string, Prompt> = new Map();
  private comparisons: Map<string, ToolComparison> = new Map();
  private workflows: Map<string, Workflow> = new Map();
  private tutorials: Map<string, Tutorial> = new Map();
  private blogs: Map<string, BlogPost> = new Map();
  private videos: Map<string, VideoItem> = new Map();
  private sources: Map<string, SourceRecord> = new Map();
  private updates: Map<string, UpdateEvent> = new Map();
  private verificationLogs: VerificationLog[] = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData(): void {
    // Seed core content
    toolsData.forEach((tool) => this.tools.set(tool.id, { ...tool }));
    promptsData.forEach((prompt) => this.prompts.set(prompt.id, { ...prompt }));
    comparisonsData.forEach((comp) => this.comparisons.set(comp.id, { ...comp }));
    workflowsData.forEach((wf) => this.workflows.set(wf.id, { ...wf }));
    tutorialsData.forEach((tut) => this.tutorials.set(tut.id, { ...tut }));
    blogsData.forEach((blog) => this.blogs.set(blog.id, { ...blog }));
    videosData.forEach((vid) => this.videos.set(vid.id, { ...vid }));

    // Seed Verified Sources for Tools
    toolsData.forEach((tool) => {
      const sourceId = `src-${tool.slug}-official`;
      this.sources.set(sourceId, {
        id: sourceId,
        url: tool.officialUrl,
        sourceType: "official_site",
        publisher: `${tool.name} Inc.`,
        entityType: "tool",
        entityId: tool.id,
        lastFetchedAt: "2026-08-18",
        lastVerifiedAt: tool.verifiedAt,
        reliabilityScore: 1.0,
      });
    });

    // Seed Verified Sources for Blogs & Videos
    blogsData.forEach((blog) => {
      if (blog.sourceUrls && blog.sourceUrls.length > 0) {
        blog.sourceUrls.forEach((url: string, i: number) => {
          const srcId = `src-${blog.slug}-${i}`;
          this.sources.set(srcId, {
            id: srcId,
            url,
            sourceType: "editorial_blog",
            publisher: blog.author.name,
            entityType: "blog",
            entityId: blog.id,
            lastFetchedAt: "2026-08-18",
            lastVerifiedAt: blog.updatedAt,
            reliabilityScore: 0.95,
          });
        });
      }
    });

    videosData.forEach((vid) => {
      const srcId = `src-${vid.slug}-channel`;
      this.sources.set(srcId, {
        id: srcId,
        url: vid.creator.channelUrl,
        sourceType: "video_channel",
        publisher: vid.creator.name,
        entityType: "video",
        entityId: vid.id,
        lastFetchedAt: "2026-08-18",
        lastVerifiedAt: vid.publishedAt,
        reliabilityScore: 0.98,
      });
    });

    // Seed Sample Staged Updates for Admin Review
    const sampleUpdate: UpdateEvent = {
      id: "upd-midjourney-price-signal",
      entityType: "tool",
      entityId: "tool-midjourney",
      entityName: "Midjourney",
      fieldPath: "pricing.startingPrice",
      previousValue: "$10/month (Basic Plan)",
      newValue: "$12/month (New Annual Tiers)",
      changeSummary: "Detected pricing adjustment on midjourney.com/pricing from $10/mo to $12/mo",
      sourceUrl: "https://midjourney.com/pricing",
      sourceType: "pricing_page",
      detectedAt: new Date().toISOString(),
      confidenceScore: 0.92,
      risk: "high",
      status: "pending",
    };
    this.updates.set(sampleUpdate.id, sampleUpdate);
  }

  // --- Tool Accessors ---
  public getAllTools(): Tool[] {
    return Array.from(this.tools.values());
  }

  public getToolBySlug(slug: string): Tool | undefined {
    return Array.from(this.tools.values()).find((t) => t.slug === slug);
  }

  public getToolById(id: string): Tool | undefined {
    return this.tools.get(id);
  }

  public getToolsByCategory(category: string): Tool[] {
    return Array.from(this.tools.values()).filter((t) => t.category === category);
  }

  // --- Blog Accessors ---
  public getAllBlogs(): BlogPost[] {
    return Array.from(this.blogs.values());
  }

  public getPublishedBlogs(): BlogPost[] {
    return Array.from(this.blogs.values()).filter((b) => b.status === "published");
  }

  public getBlogBySlug(slug: string): BlogPost | undefined {
    return Array.from(this.blogs.values()).find((b) => b.slug === slug);
  }

  public getBlogById(id: string): BlogPost | undefined {
    return this.blogs.get(id);
  }

  public createBlog(blog: BlogPost): BlogPost {
    this.blogs.set(blog.id, blog);
    return blog;
  }

  public updateBlog(id: string, partial: Partial<BlogPost>): BlogPost | undefined {
    const existing = this.blogs.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...partial, updatedAt: new Date().toISOString().split("T")[0] };
    this.blogs.set(id, updated);
    return updated;
  }

  // --- Video Accessors ---
  public getAllVideos(): VideoItem[] {
    return Array.from(this.videos.values());
  }

  public getPublishedVideos(): VideoItem[] {
    return Array.from(this.videos.values()).filter((v) => v.status === "published");
  }

  public getVideoBySlug(slug: string): VideoItem | undefined {
    return Array.from(this.videos.values()).find((v) => v.slug === slug);
  }

  public getVideoById(id: string): VideoItem | undefined {
    return this.videos.get(id);
  }

  public createVideo(video: VideoItem): VideoItem {
    this.videos.set(video.id, video);
    return video;
  }

  public updateVideo(id: string, partial: Partial<VideoItem>): VideoItem | undefined {
    const existing = this.videos.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...partial };
    this.videos.set(id, updated);
    return updated;
  }

  // --- Content Relationship Resolvers ---
  public getRelatedBlogsForTool(toolId: string): BlogPost[] {
    return this.getPublishedBlogs().filter((b) => b.relatedToolIds.includes(toolId));
  }

  public getRelatedVideosForTool(toolId: string): VideoItem[] {
    return this.getPublishedVideos().filter((v) => v.relatedToolIds.includes(toolId));
  }

  public getRelatedToolsForBlog(blog: BlogPost): Tool[] {
    return blog.relatedToolIds
      .map((id) => this.getToolById(id))
      .filter((t): t is Tool => t !== undefined);
  }

  public getRelatedPromptsForBlog(blog: BlogPost): Prompt[] {
    return blog.relatedPromptIds
      .map((id) => this.prompts.get(id))
      .filter((p): p is Prompt => p !== undefined);
  }

  public getRelatedTutorialsForBlog(blog: BlogPost): Tutorial[] {
    return blog.relatedTutorialIds
      .map((id) => this.tutorials.get(id))
      .filter((tut): tut is Tutorial => tut !== undefined);
  }

  public getRelatedVideosForBlog(blog: BlogPost): VideoItem[] {
    return blog.relatedVideoIds
      .map((id) => this.videos.get(id))
      .filter((v): v is VideoItem => v !== undefined && v.status === "published");
  }

  public getRelatedToolsForVideo(video: VideoItem): Tool[] {
    return video.relatedToolIds
      .map((id) => this.getToolById(id))
      .filter((t): t is Tool => t !== undefined);
  }

  public getRelatedPromptsForVideo(video: VideoItem): Prompt[] {
    return video.relatedPromptIds
      .map((id) => this.prompts.get(id))
      .filter((p): p is Prompt => p !== undefined);
  }

  public getRelatedTutorialsForVideo(video: VideoItem): Tutorial[] {
    return video.relatedTutorialIds
      .map((id) => this.tutorials.get(id))
      .filter((t): t is Tutorial => t !== undefined);
  }

  public getRelatedBlogsForVideo(video: VideoItem): BlogPost[] {
    return video.relatedBlogIds
      .map((id) => this.blogs.get(id))
      .filter((b): b is BlogPost => b !== undefined && b.status === "published");
  }

  // --- Prompts, Workflows, Comparisons, Categories Accessors ---
  public getAllPrompts(): Prompt[] {
    return Array.from(this.prompts.values());
  }

  public getPromptBySlug(slug: string): Prompt | undefined {
    return Array.from(this.prompts.values()).find((p) => p.slug === slug);
  }

  public getAllComparisons(): ToolComparison[] {
    return Array.from(this.comparisons.values());
  }

  public getComparisonBySlug(slug: string): ToolComparison | undefined {
    return Array.from(this.comparisons.values()).find((c) => c.slug === slug);
  }

  public getAllWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  public getWorkflowBySlug(slug: string): Workflow | undefined {
    return Array.from(this.workflows.values()).find((w) => w.slug === slug);
  }

  public getAllTutorials(): Tutorial[] {
    return Array.from(this.tutorials.values());
  }

  public getTutorialBySlug(slug: string): Tutorial | undefined {
    return Array.from(this.tutorials.values()).find((t) => t.slug === slug);
  }

  public getAllCategories(): CategoryInfo[] {
    return categoriesData;
  }

  public getAllResources(): ResourceItem[] {
    return resourcesData;
  }

  // --- Sources & Ingestion Accessors ---
  public getAllSources(): SourceRecord[] {
    return Array.from(this.sources.values());
  }

  public getSourcesByEntity(entityId: string): SourceRecord[] {
    return Array.from(this.sources.values()).filter((s) => s.entityId === entityId);
  }

  public updateSourceVerification(sourceId: string, verifiedAt: string, reliability: number): void {
    const src = this.sources.get(sourceId);
    if (src) {
      src.lastVerifiedAt = verifiedAt;
      src.reliabilityScore = reliability;
      this.sources.set(sourceId, src);
    }
  }

  // --- Updates & Review Queue ---
  public getAllUpdates(): UpdateEvent[] {
    return Array.from(this.updates.values()).sort(
      (a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
    );
  }

  public getUpdatesByStatus(status: UpdateEvent["status"]): UpdateEvent[] {
    return this.getAllUpdates().filter((u) => u.status === status);
  }

  public createUpdateEvent(update: Omit<UpdateEvent, "id">): UpdateEvent {
    const id = `upd-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const event: UpdateEvent = { id, ...update };
    this.updates.set(id, event);
    return event;
  }

  public resolveUpdate(
    id: string,
    action: "approve" | "reject" | "edit",
    reviewerName: string,
    customNewValue?: unknown,
    rejectionReason?: string
  ): { success: boolean; update?: UpdateEvent; error?: string } {
    const upd = this.updates.get(id);
    if (!upd) return { success: false, error: "Update event not found" };

    const now = new Date().toISOString();

    if (action === "reject") {
      upd.status = "rejected";
      upd.reviewedBy = reviewerName;
      upd.reviewedAt = now;
      upd.rejectionReason = rejectionReason || "Rejected by editorial curator";
      this.updates.set(id, upd);
      return { success: true, update: upd };
    }

    const finalValue = customNewValue !== undefined ? customNewValue : upd.newValue;
    const tool = this.tools.get(upd.entityId);

    if (tool && upd.entityType === "tool") {
      const currentRawVal = this.getNestedProperty(tool as unknown as Record<string, unknown>, upd.fieldPath);
      upd.rollbackValue = currentRawVal as UpdateEvent["rollbackValue"];
      upd.newValue = finalValue as UpdateEvent["newValue"];
      upd.status = "applied";
      upd.reviewedBy = reviewerName;
      upd.reviewedAt = now;

      this.setNestedProperty(tool as unknown as Record<string, unknown>, upd.fieldPath, finalValue);
      tool.updatedAt = now.split("T")[0];
      tool.verifiedAt = now.split("T")[0];
      this.tools.set(tool.id, tool);

      this.verificationLogs.push({
        id: `ver-${Date.now()}`,
        entityId: tool.id,
        entityType: "tool",
        verifiedAt: now,
        verifiedBy: reviewerName,
        notes: `Applied update [${upd.fieldPath}]: ${upd.changeSummary}`,
        sourceUrls: [upd.sourceUrl],
      });

      this.updates.set(id, upd);
      return { success: true, update: upd };
    }

    upd.status = "approved";
    upd.reviewedBy = reviewerName;
    upd.reviewedAt = now;
    this.updates.set(id, upd);
    return { success: true, update: upd };
  }

  public applyUpdate(id: string, reviewerName: string = "Admin"): UpdateEvent | null {
    const res = this.resolveUpdate(id, "approve", reviewerName);
    return res.update || null;
  }

  public rejectUpdate(
    id: string,
    rejectionReason: string = "Rejected by editorial curator",
    reviewerName: string = "Admin"
  ): UpdateEvent | null {
    const res = this.resolveUpdate(id, "reject", reviewerName, undefined, rejectionReason);
    return res.update || null;
  }

  public editAndApplyUpdate(
    id: string,
    customNewValue: any,
    reviewerName: string = "Admin"
  ): UpdateEvent | null {
    const res = this.resolveUpdate(id, "edit", reviewerName, customNewValue);
    return res.update || null;
  }

  public rollbackUpdate(id: string, reviewerName: string = "Admin"): UpdateEvent | null {
    const upd = this.updates.get(id);
    if (!upd || upd.status !== "applied") return null;

    const tool = this.tools.get(upd.entityId);
    if (tool && upd.entityType === "tool") {
      const rollbackVal = upd.rollbackValue !== undefined ? upd.rollbackValue : upd.previousValue;
      this.setNestedProperty(tool as unknown as Record<string, unknown>, upd.fieldPath, rollbackVal);
      const now = new Date().toISOString();
      tool.updatedAt = now.split("T")[0];
      this.tools.set(tool.id, tool);

      upd.status = "rolled_back";
      upd.reviewedBy = reviewerName;
      upd.reviewedAt = now;
      this.updates.set(id, upd);

      this.verificationLogs.push({
        id: `ver-rollback-${Date.now()}`,
        entityId: tool.id,
        entityType: "tool",
        verifiedAt: now,
        verifiedBy: reviewerName,
        notes: `Rolled back update [${upd.fieldPath}] to previous value`,
        sourceUrls: [upd.sourceUrl],
      });

      return upd;
    }

    return null;
  }

  public getSyncMetrics() {
    const allUpdates = this.getAllUpdates();
    const pendingCount = allUpdates.filter((u) => u.status === "pending").length;
    const approvedCount = allUpdates.filter((u) => u.status === "applied" || u.status === "approved").length;
    const rejectedCount = allUpdates.filter((u) => u.status === "rejected").length;
    const staleCount = this.getStaleTools(14).length;

    return {
      lastSuccessfulSync: "2026-08-18",
      lastFailedSync: null,
      pendingUpdatesCount: pendingCount,
      approvedUpdatesCount: approvedCount,
      rejectedUpdatesCount: rejectedCount,
      staleRecordsCount: staleCount,
      totalSourcesCount: this.sources.size,
      databaseProvider: process.env.DATABASE_URL ? "PostgreSQL" : "In-Memory Repository (Fallback)",
      isConnected: true,
    };
  }

  public getStaleTools(daysThreshold = 14): { tool: Tool; daysSinceVerification: number }[] {
    const now = new Date().getTime();
    const stale: { tool: Tool; daysSinceVerification: number }[] = [];

    this.tools.forEach((tool) => {
      const verifiedDate = new Date(tool.verifiedAt).getTime();
      const diffDays = Math.floor((now - verifiedDate) / (1000 * 60 * 60 * 24));
      if (diffDays > daysThreshold) {
        stale.push({ tool, daysSinceVerification: diffDays });
      }
    });

    return stale.sort((a, b) => b.daysSinceVerification - a.daysSinceVerification);
  }

  // --- Property Helpers ---
  private getNestedProperty(obj: Record<string, unknown>, path: string): unknown {
    return path.split(".").reduce<unknown>((curr, key) => (curr && typeof curr === "object" ? (curr as Record<string, unknown>)[key] : undefined), obj);
  }

  private setNestedProperty(obj: Record<string, unknown>, path: string, value: unknown): void {
    const keys = path.split(".");
    let curr: Record<string, unknown> = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!curr[key] || typeof curr[key] !== "object") {
        curr[key] = {};
      }
      curr = curr[key] as Record<string, unknown>;
    }
    curr[keys[keys.length - 1]] = value;
  }
}

// Global Singleton Repository instance
export const db = new PlatformRepository();
