import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { headers } from "next/headers";

/**
 * Returns whether an email is in the authorized admin list.
 */
export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminEmailsList = process.env.ADMIN_EMAILS;

  const authorizedEmails: string[] = [];
  if (adminEmail) authorizedEmails.push(adminEmail.toLowerCase().trim());
  if (adminEmailsList) {
    adminEmailsList
      .split(",")
      .map((e) => e.toLowerCase().trim())
      .filter(Boolean)
      .forEach((e) => authorizedEmails.push(e));
  }

  // If no admin emails are configured, default to false in production
  if (authorizedEmails.length === 0) {
    if (process.env.NODE_ENV === "development") {
      return true; // Local development convenience
    }
    return false;
  }

  return authorizedEmails.includes(email.toLowerCase().trim());
}

/**
 * Server-side admin verification for Next.js App Router Server Components & Actions.
 * Returns true if the session user is an authorized admin.
 */
export async function isServerAdmin(): Promise<boolean> {
  // 1. Check NextAuth Session
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email && isAuthorizedAdminEmail(session.user.email)) {
      return true;
    }
  } catch (err) {
    console.warn("[AdminAuth: Session check warning]:", err);
  }

  // 2. Emergency server-only fallback via request headers (for cron/monitoring)
  // NEVER exposed to client-side code or public UI
  try {
    const headersList = await headers();
    const authHeader = headersList.get("authorization");
    const adminSecret = process.env.ADMIN_SECRET;

    if (adminSecret && authHeader === `Bearer ${adminSecret}`) {
      return true;
    }

    const cookieHeader = headersList.get("cookie");
    if (adminSecret && cookieHeader?.includes(`admin_session=${adminSecret}`)) {
      return true;
    }
  } catch {
    // headers() might not be available in all contexts
  }

  // 3. Local development fallback only when NODE_ENV is strictly development
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  return false;
}

/**
 * Check admin authorization for Route Handlers (API requests).
 */
export async function checkAdminApiAuth(req: Request): Promise<{ authorized: boolean; email?: string }> {
  // 1. NextAuth Session
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email && isAuthorizedAdminEmail(session.user.email)) {
      return { authorized: true, email: session.user.email };
    }
  } catch {}

  // 2. Emergency Bearer token header
  const adminSecret = process.env.ADMIN_SECRET;
  if (adminSecret) {
    const authHeader = req.headers.get("authorization");
    if (authHeader === `Bearer ${adminSecret}`) {
      return { authorized: true, email: "service-account@creatorintel.admin" };
    }
    const cookie = req.headers.get("cookie");
    if (cookie?.includes(`admin_session=${adminSecret}`)) {
      return { authorized: true, email: "admin-cookie@creatorintel.admin" };
    }
  }

  // 3. Development fallback
  if (process.env.NODE_ENV === "development") {
    return { authorized: true, email: "dev-local@creatorintel.internal" };
  }

  return { authorized: false };
}
