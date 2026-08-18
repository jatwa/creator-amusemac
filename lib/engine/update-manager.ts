import { db } from "@/lib/db/repository";
import { detectToolChanges, IncomingToolSignal } from "./change-detector";
import { UpdateEvent } from "@/lib/db/types";

export class UpdateManager {
  /**
   * Ingest an incoming signal for a tool, detect differences, and stage or auto-apply updates.
   */
  public static async processToolSignal(signal: IncomingToolSignal): Promise<UpdateEvent[]> {
    const tool = db.getToolById(signal.toolId);
    if (!tool) return [];

    const detectedUpdates = detectToolChanges(tool, signal);
    const createdEvents: UpdateEvent[] = [];

    for (const updateData of detectedUpdates) {
      // Check if identical pending update already exists
      const existingPending = db
        .getUpdatesByStatus("pending")
        .find((u) => u.entityId === updateData.entityId && u.fieldPath === updateData.fieldPath);

      if (!existingPending) {
        // Auto-apply policy: LOW risk + confidence >= 0.95
        if (updateData.risk === "low" && updateData.confidenceScore >= 0.95) {
          const created = db.createUpdateEvent({
            ...updateData,
            status: "applied",
            reviewedBy: "System (Auto-Update Policy)",
            reviewedAt: new Date().toISOString().split("T")[0],
          });
          db.applyUpdate(created.id, "System (Auto-Update Policy)");
          createdEvents.push(created);
        } else {
          const created = db.createUpdateEvent(updateData);
          createdEvents.push(created);
        }
      }
    }

    return createdEvents;
  }

  /**
   * Approve and apply a pending update event to the live repository.
   */
  public static approveUpdate(eventId: string, reviewer: string = "Admin"): UpdateEvent | null {
    return db.applyUpdate(eventId, reviewer);
  }

  /**
   * Reject a pending update event with a reason.
   */
  public static rejectUpdate(
    eventId: string,
    reason: string = "Manual Admin Rejection",
    reviewer: string = "Admin"
  ): UpdateEvent | null {
    return db.rejectUpdate(eventId, reason, reviewer);
  }

  /**
   * Edit and apply a modified value to the live repository.
   */
  public static editAndApplyUpdate(
    eventId: string,
    customValue: any,
    reviewer: string = "Admin"
  ): UpdateEvent | null {
    return db.editAndApplyUpdate(eventId, customValue, reviewer);
  }

  /**
   * Revert a previously applied update event to its original previousValue.
   */
  public static rollbackUpdate(eventId: string, reviewer: string = "Admin"): UpdateEvent | null {
    return db.rollbackUpdate(eventId, reviewer);
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(tool.officialUrl, {
        method: "HEAD",
        signal: controller.signal,
        headers: { "User-Agent": "CreatorByAmusemac-HealthChecker/2.0" },
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
