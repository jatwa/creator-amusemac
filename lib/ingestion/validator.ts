import { IngestionValidationResult } from "./types";
import { toolsData, promptsData, workflowsData, tutorialsData, blogsData, videosData } from "@/data/platform-data";
import { storiesData } from "@/data/production-stories";
import { festivalsData } from "@/data/festivals-data";
import { productionKitsData } from "@/data/kits-data";
import { cameraLexiconData } from "@/data/lexicon-data";

export class ContentValidator {
  private existingIds = new Set<string>();
  private existingSlugs = new Set<string>();

  constructor() {
    this.seedExistingLookup();
  }

  private seedExistingLookup() {
    toolsData.forEach((t) => {
      this.existingIds.add(t.id);
      this.existingSlugs.add(t.slug);
    });
    promptsData.forEach((p) => {
      this.existingIds.add(p.id);
      this.existingSlugs.add(p.slug);
    });
    workflowsData.forEach((w) => {
      this.existingIds.add(w.id);
      this.existingSlugs.add(w.slug);
    });
    tutorialsData.forEach((t) => {
      this.existingIds.add(t.id);
      this.existingSlugs.add(t.slug);
    });
    blogsData.forEach((b) => {
      this.existingIds.add(b.id);
      this.existingSlugs.add(b.slug);
    });
    videosData.forEach((v) => {
      this.existingIds.add(v.id);
      this.existingSlugs.add(v.slug);
    });
    storiesData.forEach((s) => {
      this.existingIds.add(s.id);
      this.existingSlugs.add(s.slug);
    });
    festivalsData.forEach((f) => {
      this.existingIds.add(f.id);
      this.existingSlugs.add(f.slug);
    });
    productionKitsData.forEach((k) => {
      this.existingIds.add(k.id);
      this.existingSlugs.add(k.slug);
    });
    cameraLexiconData.forEach((l) => {
      this.existingSlugs.add(l.slug);
    });
  }

  public validateRecord(entityType: string, record: any, seenInBatch?: { ids: Set<string>; slugs: Set<string> }): IngestionValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Validate ID
    if (!record.id || typeof record.id !== "string" || record.id.trim() === "") {
      errors.push("Missing or invalid 'id' field.");
    } else {
      if (this.existingIds.has(record.id)) {
        warnings.push(`ID '${record.id}' already exists in repository (will be treated as update/upsert).`);
      }
      if (seenInBatch && seenInBatch.ids.has(record.id)) {
        errors.push(`Duplicate ID '${record.id}' detected within current import batch.`);
      }
    }

    // 2. Validate Slug
    if (!record.slug || typeof record.slug !== "string" || record.slug.trim() === "") {
      errors.push("Missing or invalid 'slug' field.");
    } else {
      // Slug format regex (lowercase alphanumeric + hyphens)
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(record.slug)) {
        errors.push(`Slug '${record.slug}' is malformed. Must be lowercase alphanumeric with single hyphens.`);
      }
      if (seenInBatch && seenInBatch.slugs.has(record.slug)) {
        errors.push(`Duplicate Slug '${record.slug}' detected within current import batch.`);
      }
    }

    // 3. Validate Title / Name
    const title = record.title || record.name;
    if (!title || typeof title !== "string" || title.trim() === "") {
      errors.push("Missing or empty 'title' / 'name' field.");
    }

    // 4. Validate Status
    const validStatuses = ["draft", "review", "published", "archived"];
    if (record.status && !validStatuses.includes(record.status)) {
      errors.push(`Invalid status '${record.status}'. Must be one of: ${validStatuses.join(", ")}.`);
    }

    // 5. Validate URLs
    const urlFields = ["officialUrl", "sourceUrl", "videoUrl", "embedUrl", "downloadUrl", "coverImageUrl"];
    urlFields.forEach((field) => {
      if (record[field] && typeof record[field] === "string" && !record[field].startsWith("#")) {
        try {
          new URL(record[field]);
        } catch {
          errors.push(`Invalid URL format in field '${field}': ${record[field]}`);
        }
      }
    });

    // 6. Validate Related References
    if (record.compatibleToolIds && Array.isArray(record.compatibleToolIds)) {
      record.compatibleToolIds.forEach((tId: string) => {
        if (!this.existingIds.has(tId)) {
          warnings.push(`Referenced tool ID '${tId}' does not yet exist in platform-data.`);
        }
      });
    }
    if (record.relatedToolIds && Array.isArray(record.relatedToolIds)) {
      record.relatedToolIds.forEach((tId: string) => {
        if (!this.existingIds.has(tId)) {
          warnings.push(`Referenced tool ID '${tId}' does not yet exist in platform-data.`);
        }
      });
    }

    // 7. Validate Entity-Specific Fields
    switch (entityType.toLowerCase()) {
      case "tool":
      case "tools":
        if (!record.category) errors.push("Missing 'category' field on Tool.");
        if (!record.description) errors.push("Missing 'description' on Tool.");
        if (!record.officialUrl) errors.push("Missing 'officialUrl' on Tool.");
        break;

      case "prompt":
      case "prompts":
        if (!record.promptText || record.promptText.trim() === "") {
          errors.push("Missing 'promptText' on Prompt recipe.");
        }
        break;

      case "blog":
      case "blogs":
        if (!record.contentMarkdown || record.contentMarkdown.trim() === "") {
          errors.push("Missing 'contentMarkdown' on Blog article.");
        }
        break;

      case "video":
      case "videos":
        if (!record.embedUrl && !record.videoUrl) {
          errors.push("Missing 'embedUrl' or 'videoUrl' on Video masterclass.");
        }
        break;

      case "festival":
      case "festivals":
        if (!record.deadline) errors.push("Missing 'deadline' on Festival record.");
        if (!record.officialUrl) errors.push("Missing 'officialUrl' on Festival record.");
        break;

      case "kit":
      case "kits":
        if (!record.includedAssets || !Array.isArray(record.includedAssets) || record.includedAssets.length === 0) {
          errors.push("Missing or empty 'includedAssets' array on Production Kit.");
        }
        break;

      case "story":
      case "stories":
        if (!record.shotList || !Array.isArray(record.shotList) || record.shotList.length === 0) {
          errors.push("Missing or empty 'shotList' array on Production Case Study Story.");
        }
        break;
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      recordId: record.id,
      recordSlug: record.slug,
      entityType,
    };
  }

  public validateBatch(entityType: string, records: any[]): IngestionValidationResult[] {
    const seenIds = new Set<string>();
    const seenSlugs = new Set<string>();

    return records.map((record) => {
      const result = this.validateRecord(entityType, record, { ids: seenIds, slugs: seenSlugs });
      if (record.id) seenIds.add(record.id);
      if (record.slug) seenSlugs.add(record.slug);
      return result;
    });
  }
}

export const contentValidator = new ContentValidator();
