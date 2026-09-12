import fs from "fs";
import path from "path";
import {
  toolsData,
  videoEnginesData,
  promptsData,
  comparisonsData,
  tutorialsData,
  workflowsData,
  blogsData,
  videosData,
  categoriesData,
  resourcesData,
} from "../data/platform-data";
import { storiesData } from "../data/production-stories";
import { festivalsData } from "../data/festivals-data";
import { productionKitsData } from "../data/kits-data";
import { cameraLexiconData } from "../data/lexicon-data";
import { SYNCED_MASTER_CONTENT } from "../data/synced-content";

console.log("====================================================");
console.log("CREATOR BY AMUSEMAC — ACCURATE DATA & INVENTORY AUDIT");
console.log("====================================================\n");

// ==========================================
// PHASE 1: REAL INVENTORY AUDIT
// ==========================================
const inventoryReport = {
  reported: {
    blogs: 200,
    stories: 100,
    videos: 100,
    guides: 200,
    free_prompts: 300,
    pro_prompts: 200,
    prompt_packs: 15,
    festivals: 100,
    kits: 50,
    lexicon: 100,
    tools: 150,
  },
  actual: {
    blogs: blogsData.length,
    stories: storiesData.length,
    videos: videosData.length,
    guides: tutorialsData.length,
    prompts: promptsData.length,
    free_prompts: promptsData.length,
    pro_prompts: 0,
    prompt_packs: 0,
    festivals: festivalsData.length,
    kits: productionKitsData.length,
    lexicon: cameraLexiconData.length,
    tools: toolsData.length,
    video_engines: videoEnginesData.length,
    workflows: workflowsData.length,
    comparisons: comparisonsData.length,
    categories: categoriesData.length,
    resources: resourcesData.length,
    synced_articles: SYNCED_MASTER_CONTENT.length,
  },
};

console.log("PHASE 1 INVENTORY COUNTS:");
console.log(JSON.stringify(inventoryReport, null, 2));

// ==========================================
// PHASE 2: DATA QUALITY & INTEGRITY CHECKS
// ==========================================
const issues: { type: string; item: string; error: string }[] = [];

// 1. Check Duplicate IDs & Slugs across all datasets
const idMap = new Map<string, string>();
const slugMap = new Map<string, string>();

function checkItem(entity: string, item: { id?: string; slug?: string; name?: string; title?: string }) {
  const itemId = item.id;
  const itemSlug = item.slug;
  const itemName = item.name || item.title || "Unnamed";

  if (itemId) {
    if (idMap.has(itemId)) {
      issues.push({
        type: "DUPLICATE_ID",
        item: `${entity}: ${itemName} (${itemId})`,
        error: `Already defined in ${idMap.get(itemId)}`,
      });
    } else {
      idMap.set(itemId, entity);
    }
  }

  if (itemSlug) {
    // Note: video engines intentionally share slugs with tools so they route to /tools/[slug]
    if (entity !== "videoEngines") {
      if (slugMap.has(itemSlug)) {
        issues.push({
          type: "DUPLICATE_SLUG",
          item: `${entity}: ${itemName} (${itemSlug})`,
          error: `Already defined in ${slugMap.get(itemSlug)}`,
        });
      } else {
        slugMap.set(itemSlug, entity);
      }
    }
  }
}

toolsData.forEach((t) => checkItem("tools", t));
videoEnginesData.forEach((v) => checkItem("videoEngines", v));
promptsData.forEach((p) => checkItem("prompts", p));
comparisonsData.forEach((c) => checkItem("comparisons", c));
tutorialsData.forEach((t) => checkItem("tutorials", t));
workflowsData.forEach((w) => checkItem("workflows", w));
blogsData.forEach((b) => checkItem("blogs", b));
videosData.forEach((v) => checkItem("videos", v));
storiesData.forEach((s) => checkItem("stories", s));
festivalsData.forEach((f) => checkItem("festivals", f));
productionKitsData.forEach((k) => checkItem("kits", k));
cameraLexiconData.forEach((l) => checkItem("lexicon", l));
SYNCED_MASTER_CONTENT.forEach((s) => checkItem("syncedContent", s));

// 2. Check Empty Fields & Mandatory Schema Properties
const validToolSlugs = new Set(toolsData.map((t) => t.slug));
const validToolIds = new Set(toolsData.map((t) => t.id));

// Verify Tools
toolsData.forEach((t) => {
  if (!t.name || t.name.trim() === "") issues.push({ type: "EMPTY_FIELD", item: t.slug, error: "Missing name" });
  if (!t.slug || t.slug.trim() === "") issues.push({ type: "EMPTY_FIELD", item: t.name, error: "Missing slug" });
  if (!t.description || t.description.trim() === "") issues.push({ type: "EMPTY_FIELD", item: t.slug, error: "Missing description" });
  if (!t.category) issues.push({ type: "EMPTY_FIELD", item: t.slug, error: "Missing category" });
  if (!t.officialUrl) issues.push({ type: "EMPTY_FIELD", item: t.slug, error: "Missing officialUrl" });
  if (!t.verifiedAt) issues.push({ type: "EMPTY_FIELD", item: t.slug, error: "Missing verifiedAt" });
});

// Verify Prompts
promptsData.forEach((p) => {
  if (!p.title) issues.push({ type: "EMPTY_FIELD", item: p.slug, error: "Missing prompt title" });
  if (!p.promptText) issues.push({ type: "EMPTY_FIELD", item: p.slug, error: "Missing promptText" });
  if (!p.compatibleToolIds || p.compatibleToolIds.length === 0) {
    issues.push({ type: "EMPTY_FIELD", item: p.slug, error: "Missing compatibleToolIds" });
  } else {
    p.compatibleToolIds.forEach((tId) => {
      if (!validToolIds.has(tId)) {
        issues.push({ type: "BROKEN_REF", item: p.slug, error: `Referenced toolId '${tId}' does not exist` });
      }
    });
  }
});

// Verify Comparisons
comparisonsData.forEach((c) => {
  if (!c.toolAId || !validToolIds.has(c.toolAId)) {
    issues.push({ type: "BROKEN_REF", item: c.slug, error: `ToolA ID '${c.toolAId}' does not exist` });
  }
  if (!c.toolBId || !validToolIds.has(c.toolBId)) {
    issues.push({ type: "BROKEN_REF", item: c.slug, error: `ToolB ID '${c.toolBId}' does not exist` });
  }
});

// Verify Stories
storiesData.forEach((s) => {
  if (!s.title) issues.push({ type: "EMPTY_FIELD", item: s.slug, error: "Missing story title" });
  if (!s.shotList || s.shotList.length === 0) issues.push({ type: "EMPTY_FIELD", item: s.slug, error: "Story has zero shots" });
});

// Verify Festivals
festivalsData.forEach((f) => {
  if (!f.name) issues.push({ type: "EMPTY_FIELD", item: f.id, error: "Missing festival name" });
  if (!f.deadline) issues.push({ type: "EMPTY_FIELD", item: f.id, error: "Missing deadline" });
  if (!f.officialUrl) issues.push({ type: "EMPTY_FIELD", item: f.id, error: "Missing officialUrl" });
});

// Verify Production Kits
productionKitsData.forEach((k) => {
  if (!k.title) issues.push({ type: "EMPTY_FIELD", item: k.slug, error: "Missing kit title" });
  if (!k.includedAssets || k.includedAssets.length === 0) issues.push({ type: "EMPTY_FIELD", item: k.slug, error: "Kit has zero assets" });
});

// Verify Videos & Embed URLs
videosData.forEach((v) => {
  if (!v.title) issues.push({ type: "EMPTY_FIELD", item: v.slug, error: "Missing video title" });
  if (!v.videoUrl && !v.embedUrl) {
    issues.push({ type: "EMPTY_FIELD", item: v.slug, error: "Video has no videoUrl or embedUrl" });
  }
});

// Verify Synced Master Content
SYNCED_MASTER_CONTENT.forEach((s) => {
  if (!s.primaryToolId) issues.push({ type: "EMPTY_FIELD", item: s.slug, error: "Missing primaryToolId" });
  else if (!validToolSlugs.has(s.primaryToolId)) {
    issues.push({ type: "BROKEN_REF", item: s.slug, error: `Primary tool '${s.primaryToolId}' not found in toolsData` });
  }
});

console.log("\n====================================================");
console.log(`PHASE 2 DATA QUALITY AUDIT COMPLETED. Total Issues: ${issues.length}`);
console.log("====================================================");
if (issues.length > 0) {
  console.log(JSON.stringify(issues, null, 2));
} else {
  console.log("✓ Zero duplicate IDs\n✓ Zero duplicate slugs\n✓ Zero broken tool references\n✓ Zero empty mandatory fields");
}

fs.writeFileSync(
  path.join(__dirname, "audit_phase1_phase2_results.json"),
  JSON.stringify({ inventoryReport, issues }, null, 2)
);
