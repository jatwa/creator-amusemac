import { NextRequest, NextResponse } from "next/server";

export function checkCronAuth(req: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    // If no secret configured in local dev, allow execution
    return true;
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  const url = new URL(req.url);
  const keyParam = url.searchParams.get("key");
  if (keyParam === cronSecret) {
    return true;
  }

  return false;
}

export function checkAdminAuth(req: Request): boolean {
  const adminSecret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (!adminSecret) {
    // Open in local dev if no password set
    return true;
  }

  // Check Authorization header (Bearer or Basic)
  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    if (authHeader === `Bearer ${adminSecret}`) return true;

    if (authHeader.startsWith("Basic ")) {
      try {
        const credentials = atob(authHeader.replace("Basic ", ""));
        const [user, pass] = credentials.split(":");
        if (pass === adminSecret || user === adminSecret) return true;
      } catch {}
    }
  }

  // Check Cookie
  const cookie = req.headers.get("cookie");
  if (cookie && cookie.includes(`admin_session=${adminSecret}`)) {
    return true;
  }

  // Check URL Key Param
  const url = new URL(req.url);
  if (url.searchParams.get("key") === adminSecret) {
    return true;
  }

  return false;
}
