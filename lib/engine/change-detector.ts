import { Tool } from "@/data/types";
import { UpdateEvent } from "@/lib/db/types";

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
  scrapedTitleOrTagline?: string;
}

export function detectToolChanges(
  existingTool: Tool,
  signal: IncomingToolSignal
): Omit<UpdateEvent, "id">[] {
  const updates: Omit<UpdateEvent, "id">[] = [];
  const now = new Date().toISOString();

  // 1. Check Pricing changes
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
      changeSummary: `Detected updated starting price from ${existingTool.pricing.startingPrice} to ${signal.extractedPricing.startingPrice}`,
      sourceUrl: signal.sourceUrl,
      detectedAt: now,
      confidenceScore: 0.92,
      status: "pending", // Pricing changes ALWAYS require manual review
    });
  }

  // 2. Check Supported Models changes
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
        changeSummary: `New model(s) detected: ${newModels.join(", ")}`,
        sourceUrl: signal.sourceUrl,
        detectedAt: now,
        confidenceScore: 0.95,
        status: "pending",
      });
    }
  }

  // 3. Check Key Features additions
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
        changeSummary: `New capability detected: ${newFeatures.join(", ")}`,
        sourceUrl: signal.sourceUrl,
        detectedAt: now,
        confidenceScore: 0.90,
        status: "pending",
      });
    }
  }

  return updates;
}
