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
  resourcesData,
} from "../data/platform-data";
import { storiesData } from "../data/production-stories";
import { festivalsData } from "../data/festivals-data";
import { productionKitsData } from "../data/kits-data";
import { cameraLexiconData } from "../data/lexicon-data";
import { SYNCED_MASTER_CONTENT } from "../data/synced-content";

console.log("=== EXECUTING CONTENT QUALITY SAMPLE AUDIT ===");

const sampleReport = {
  timestamp: new Date().toISOString(),
  samples: {
    blogs: blogsData.map(b => ({
      slug: b.slug,
      title: b.title,
      readingTime: b.readingTime,
      hasContent: b.contentMarkdown.length > 500,
      contentLength: b.contentMarkdown.length,
      author: b.author.name,
      hasRelatedTools: b.relatedToolIds.length > 0,
      isSpecific: !b.contentMarkdown.includes("lorem ipsum") && b.contentMarkdown.includes("24fps") || b.contentMarkdown.includes("diffusion"),
    })),
    stories: storiesData.map(s => ({
      slug: s.slug,
      title: s.title,
      director: s.director,
      runtime: s.runtime,
      shotCount: s.shotList.length,
      hasTechnicalPrompts: s.shotList.every(shot => shot.conceptPrompt.length > 20),
      toolsUsed: s.toolsUsed,
    })),
    videos: videosData.map(v => ({
      slug: v.slug,
      title: v.title,
      duration: v.duration,
      platform: v.platform,
      embedUrl: v.embedUrl,
      hasDescription: v.description.length > 50,
      creator: v.creator.name,
    })),
    tutorials: tutorialsData.map(t => ({
      slug: t.slug,
      title: t.title,
      sectionsCount: t.sections.length,
      hasCommonMistakes: t.commonMistakes.length > 0,
      requiredTools: t.requiredToolIds,
    })),
    prompts: promptsData.map(p => ({
      slug: p.slug,
      title: p.title,
      useCase: p.useCase,
      promptLength: p.promptText.length,
      hasVariables: p.variables.length > 0,
      hasOpticalSyntax: p.promptText.includes("mm") || p.promptText.includes("lens") || p.promptText.includes("camera") || p.promptText.includes("--"),
      compatibleTools: p.compatibleToolIds,
    })),
    festivals: festivalsData.map(f => ({
      id: f.id,
      name: f.name,
      hostCity: f.hostCity,
      deadline: f.deadline,
      prizes: f.prizes,
      officialUrl: f.officialUrl,
      hasChecklist: f.readinessChecklist.length > 0,
    })),
    kits: productionKitsData.map(k => ({
      slug: k.slug,
      title: k.title,
      category: k.category,
      assetCount: k.includedAssets.length,
      targetSoftware: k.targetSoftware,
    })),
    lexicon: cameraLexiconData.map(l => ({
      slug: l.slug,
      name: l.name,
      category: l.category,
      hasPromptSyntax: l.promptSyntax.length > 15,
      hasCommonMistake: l.commonMistake.length > 15,
    })),
    tools: toolsData.slice(0, 20).map(t => ({
      slug: t.slug,
      name: t.name,
      category: t.category,
      hasPricing: !!t.pricing.startingPrice,
      hasDossier: !!t.dossier,
      strengthsCount: t.strengths.length,
      weaknessesCount: t.weaknesses.length,
      verifiedAt: t.verifiedAt,
    })),
  }
};

fs.writeFileSync(path.join(__dirname, "content_quality_sample.json"), JSON.stringify(sampleReport, null, 2));
console.log("Content quality sample written to scratch/content_quality_sample.json");
