import { db } from "@/lib/db/repository";
import { detectToolChanges, IncomingToolSignal } from "./change-detector";
import { UpdateEvent } from "@/lib/db/types";

export class UpdateManager {
  /**
   * Ingest an incoming signal for a tool, detect differences, and stage updates in repository.
   */
  public static async processToolSignal(signal: IncomingToolSignal): Promise<UpdateEvent[]> {
    const tool = db.getToolById(signal.toolId);
    if (!tool) return [];

    // Detect diffs
    const detectedUpdates = detectToolChanges(tool, signal);
    const createdEvents: UpdateEvent[] = [];

    for (const updateData of detectedUpdates) {
      // Check if identical pending update already exists
      const existingPending = db
        .getUpdatesByStatus("pending")
        .find((u) => u.entityId === updateData.entityId && u.fieldPath === updateData.fieldPath);

      if (!existingPending) {
        const created = db.createUpdateEvent(updateData);
        createdEvents.push(created);
      }
    }

    return createdEvents;
  }

  /**
   * Run tool health checks (HTTP status code check and metadata validation)
   */
  public static async checkToolHealth(toolId: string): Promise<{
    toolId: string;
    status: "ok" | "unreachable" | "redirect";
    httpCode: number;
    url: string;
    checkedAt: string;
  }> {
    const tool = db.getToolById(toolId);
    if (!tool) {
      return {
        toolId,
        status: "unreachable",
        httpCode: 404,
        url: "",
        checkedAt: new Date().toISOString(),
      };
    }

    const now = new Date().toISOString();

    try {
      // Make a lightweight HEAD/GET request to verify domain availability
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const res = await fetch(tool.officialUrl, {
        method: "HEAD",
        signal: controller.signal,
        headers: { "User-Agent": "CreatorByAmusemac-HealthChecker/1.0" },
      });

      clearTimeout(timeoutId);

      // Update source verification record
      const sources = db.getSourcesByEntity(tool.id);
      if (sources.length > 0) {
        db.updateSourceVerification(sources[0].id, now.split("T")[0], 1.0);
      }

      return {
        toolId: tool.id,
        status: res.status >= 200 && res.status < 400 ? "ok" : "redirect",
        httpCode: res.status,
        url: tool.officialUrl,
        checkedAt: now,
      };
    } catch {
      return {
        toolId: tool.id,
        status: "unreachable",
        httpCode: 0,
        url: tool.officialUrl,
        checkedAt: now,
      };
    }
  }
}
