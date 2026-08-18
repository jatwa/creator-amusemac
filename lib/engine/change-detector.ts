import { Tool } from "@/data/types";
import { UpdateEvent, UpdateRisk } from "@/lib/db/types";

export interface IncomingToolSignal {
  toolId: string;
  sourceUrl: string;
  sourceType: "official_site" | "pricing_page" | "changelog" | "api_docs";
  httpStatus: number;
  extractedPricing?: {
    startingPrice?: string;
    model?: "free" | "freemium" | "paid" | "open-source";
  };
  detectedModels?: string[];
  detectedFeatures?: string[];
  scrapedTagline?: string;
  availabilityStatus?: "active" | "deprecated" | "offline";
}

export function classifyRisk(fieldPath: string, changeType: string): UpdateRisk {
  if (fieldPath.includes("pricing") || fieldPath === "status" || changeType === "availability") {
    return "high";
  }
  if (fieldPath === "features" || fieldPath === "supportedModels" || fieldPath === "keyFeatures") {
    return "medium";
  }
  return "low";
}

export function detectToolChanges(
  existingTool: Tool,
  signal: IncomingToolSignal
): Omit<UpdateEvent, "id">[] {
  const updates: Omit<UpdateEvent, "id">[] = [];
  const now = new Date().toISOString().split("T")[0];

  // 1. Check Pricing Changes (HIGH RISK)
  if (
    signal.extractedPricing?.startingPrice &&
    signal.extractedPricing.startingPrice !== existingTool.pricing.startingPrice
  ) {
    updates.push({
      entityType: "tool",
      entityId: existingTool.id,
      entityName: existingTool.name,
      fieldPath: "pricing.startingPrice",
      previousValue: existingTool.pricing.startingPrice || "Free",
      newValue: signal.extractedPricing.startingPrice,
      changeSummary: `Updated starting price from ${existingTool.pricing.startingPrice} to ${signal.extractedPricing.startingPrice}`,
      sourceUrl: signal.sourceUrl,
      sourceType: signal.sourceType,
      detectedAt: now,
      confidenceScore: 0.96,
      risk: "high",
      status: "pending", // High risk pricing changes require human confirmation
    });
  }

  // 2. Check Supported Models / Architecture additions (MEDIUM RISK)
  if (signal.detectedModels && signal.detectedModels.length > 0) {
    const existingModels = existingTool.supportedModels || [];
    const newModels = signal.detectedModels.filter(
      (m) => !existingModels.some((em) => em.toLowerCase() === m.toLowerCase())
    );

    if (newModels.length > 0) {
      const combined = [...existingModels, ...newModels];
      updates.push({
        entityType: "tool",
        entityId: existingTool.id,
        entityName: existingTool.name,
        fieldPath: "supportedModels",
        previousValue: existingModels,
        newValue: combined,
        changeSummary: `New model generation detected: ${newModels.join(", ")}`,
        sourceUrl: signal.sourceUrl,
        sourceType: signal.sourceType,
        detectedAt: now,
        confidenceScore: 0.94,
        risk: "medium",
        status: "pending",
      });
    }
  }

  // 3. Check Key Features additions (MEDIUM RISK)
  if (signal.detectedFeatures && signal.detectedFeatures.length > 0) {
    const existingFeatures = existingTool.keyFeatures || [];
    const newFeatures = signal.detectedFeatures.filter(
      (f) => !existingFeatures.some((ef) => ef.toLowerCase() === f.toLowerCase())
    );

    if (newFeatures.length > 0) {
      updates.push({
        entityType: "tool",
        entityId: existingTool.id,
        entityName: existingTool.name,
        fieldPath: "keyFeatures",
        previousValue: existingFeatures,
        newValue: [...existingFeatures, ...newFeatures],
        changeSummary: `New capability verified: ${newFeatures.join(", ")}`,
        sourceUrl: signal.sourceUrl,
        sourceType: signal.sourceType,
        detectedAt: now,
        confidenceScore: 0.91,
        risk: "medium",
        status: "pending",
      });
    }
  }

  // 4. Check Non-Critical Tagline / Minor Description (LOW RISK)
  if (signal.scrapedTagline && signal.scrapedTagline !== existingTool.tagline) {
    updates.push({
      entityType: "tool",
      entityId: existingTool.id,
      entityName: existingTool.name,
      fieldPath: "tagline",
      previousValue: existingTool.tagline,
      newValue: signal.scrapedTagline,
      changeSummary: `Refreshed tagline: "${signal.scrapedTagline}"`,
      sourceUrl: signal.sourceUrl,
      sourceType: signal.sourceType,
      detectedAt: now,
      confidenceScore: 0.98,
      risk: "low",
      status: "applied", // Low risk changes can be auto-applied if confidence >= 0.95
    });
  }

  return updates;
}
