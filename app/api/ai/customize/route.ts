import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import crypto from "crypto";
import { authOptions } from "@/lib/auth/auth-options";
import { matchRecipeDeterministically } from "@/lib/ai/deterministic-matcher";
import { extractSlotsAndBuildConfig } from "@/lib/ai/slot-filler";
import { compileDirectorRecipe, compileModelPrompt, compileNegativePrompt } from "@/lib/ai/prompt-compiler";
import { TargetEngine, ENGINE_CONFIGS } from "@/lib/ai/engine-configs";
import { queryNeon } from "@/lib/db/neon";
import { getAllPrompts } from "@/data/content";

const COOKIE_NAME = "ci_ai_preview_tracker";
const COOKIE_SECRET = process.env.NEXTAUTH_SECRET || "creatorintel_ci_preview_secret_key_2026";

interface CookiePayload {
  date: string;
  count: number;
}

export function signPreviewCookie(data: CookiePayload): string {
  const str = JSON.stringify(data);
  const b64 = Buffer.from(str).toString("base64url");
  const hmac = crypto.createHmac("sha256", COOKIE_SECRET).update(b64).digest("hex");
  return `${b64}.${hmac}`;
}

export function verifyAndParsePreviewCookie(cookieVal?: string): CookiePayload | null {
  if (!cookieVal) return null;
  const parts = cookieVal.split(".");
  if (parts.length !== 2) return null;
  const [b64, hmac] = parts;
  try {
    const expectedHmac = crypto.createHmac("sha256", COOKIE_SECRET).update(b64).digest("hex");
    if (hmac.length !== expectedHmac.length || !crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac))) {
      return null;
    }
    const str = Buffer.from(b64, "base64url").toString("utf8");
    return JSON.parse(str);
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const tier = (session?.user as any)?.tier || "free";

    const body = await req.json().catch(() => ({}));
    const conceptText: string = (body.concept || "").trim();
    const selectedEngine: TargetEngine = (body.engine && ENGINE_CONFIGS[body.engine as TargetEngine])
      ? (body.engine as TargetEngine)
      : "runway";
    const requestedRecipeId: string | undefined = body.recipeId;

    if (!conceptText && !requestedRecipeId) {
      return NextResponse.json(
        { error: "Please provide a shot description to customize." },
        { status: 400 }
      );
    }

    // 1. Run deterministic matching against canonical prompt registry
    const matches = matchRecipeDeterministically(conceptText);
    const selectedMatch = requestedRecipeId
      ? (getAllPrompts().find((p) => p.id === requestedRecipeId || p.slug === requestedRecipeId)
          ? {
              recipe: getAllPrompts().find((p) => p.id === requestedRecipeId || p.slug === requestedRecipeId)!,
              matchScore: 0.98,
              matchPercentage: 98,
              dimensionScores: { subject: 0.98, environment: 0.98, action: 0.98, genreMood: 0.98, category: 0.98 },
              explanation: "Directly selected canonical recipe.",
            }
          : matches[0])
      : matches[0];

    if (!selectedMatch || !selectedMatch.recipe) {
      return NextResponse.json(
        { error: "No matching canonical recipe found." },
        { status: 404 }
      );
    }

    // 2. Extract slots and build DirectorShotConfig
    const { slots, shotConfig } = extractSlotsAndBuildConfig(conceptText, selectedMatch.recipe);

    // 3. Compile Director Recipe Slip, Model-Specific Prompt, and Calibrated Negative Prompt
    const directorSlip = compileDirectorRecipe(shotConfig);
    const compiledFullPrompt = compileModelPrompt(shotConfig, selectedEngine);
    const compiledNegative = compileNegativePrompt(selectedEngine);

    // 4. Entitlement & Quota Verification with FAIL-CLOSED Security
    let isLocked = true;
    let quotaRemaining: number | null = null;
    let quotaLimit: number | null = null;
    let shouldSetPreviewCookie = false;
    let previewCookieVal = "";

    const todayUtc = new Date().toISOString().split("T")[0];

    if (tier === "pro" && userId) {
      // STUDIO PRO: Unlimited AI generations (null quota limit / remaining), verified against database
      try {
        const proSub = await queryNeon(
          "SELECT id FROM subscriptions WHERE user_id = $1 AND status = 'active' AND tier = 'pro' LIMIT 1",
          [userId]
        );
        if (proSub && proSub.rows && proSub.rows.length > 0) {
          isLocked = false;
          quotaRemaining = null;
          quotaLimit = null;
        } else {
          // FAIL CLOSED: No verified active Pro subscription in DB
          isLocked = true;
          quotaRemaining = 0;
          quotaLimit = 0;
        }
      } catch (err) {
        console.error("[AI Customizer Pro Auth Error - Fail Closed]:", err);
        isLocked = true;
        quotaRemaining = 0;
        quotaLimit = 0;
      }
    } else if (tier === "basic" && userId) {
      // DIRECTOR BASIC: 25 generations per billing period (atomic, concurrency-safe, preserves all existing paddle_custom_data keys)
      try {
        const atomicUpdate = await queryNeon<{ id: string; ai_generations_used: number }>(
          `WITH current_sub AS (
            SELECT id, current_period_start, paddle_custom_data
            FROM subscriptions
            WHERE user_id = $1 AND status = 'active'
            FOR UPDATE
            LIMIT 1
          )
          UPDATE subscriptions s
          SET 
            paddle_custom_data = COALESCE(s.paddle_custom_data, '{}'::jsonb) || jsonb_build_object(
              'ai_generations_used',
              CASE 
                WHEN (s.paddle_custom_data->>'ai_period_start') IS DISTINCT FROM s.current_period_start::text THEN 1
                ELSE COALESCE((s.paddle_custom_data->>'ai_generations_used')::int, 0) + 1
              END,
              'ai_period_start', s.current_period_start::text
            ),
            updated_at = CURRENT_TIMESTAMP
          FROM current_sub
          WHERE s.id = current_sub.id
            AND (
              (s.paddle_custom_data->>'ai_period_start') IS DISTINCT FROM s.current_period_start::text
              OR COALESCE((s.paddle_custom_data->>'ai_generations_used')::int, 0) < 25
            )
          RETURNING 
            s.id, 
            (s.paddle_custom_data->>'ai_generations_used')::int AS ai_generations_used;`,
          [userId]
        );

        if (atomicUpdate && atomicUpdate.rows && atomicUpdate.rows.length > 0) {
          const used = atomicUpdate.rows[0].ai_generations_used;
          isLocked = false;
          quotaRemaining = Math.max(0, 25 - used);
          quotaLimit = 25;
        } else {
          // FAIL CLOSED: Quota exhausted (25/25), missing active subscription, or concurrent race exceeded limit
          isLocked = true;
          quotaRemaining = 0;
          quotaLimit = 25;
        }
      } catch (err) {
        // FAIL CLOSED: DB failure or query error
        console.error("[AI Customizer Basic Quota Error - Fail Closed]:", err);
        isLocked = true;
        quotaRemaining = 0;
        quotaLimit = 25;
      }
    } else {
      // FREE TIER: 1 preview/day tracked via signed HTTP-only ci_ai_preview_tracker cookie
      const rawCookie = req.cookies.get(COOKIE_NAME)?.value;
      const parsedCookie = verifyAndParsePreviewCookie(rawCookie);

      if (parsedCookie && parsedCookie.date === todayUtc && parsedCookie.count >= 1) {
        // 2nd request same day: fully locked
        isLocked = true;
        quotaRemaining = 0;
        quotaLimit = 1;
      } else {
        // 1st request today: allow 1 preview, set signed cookie
        isLocked = true; // Free tier never gets full prompt
        quotaRemaining = 0;
        quotaLimit = 1;
        shouldSetPreviewCookie = true;
        previewCookieVal = signPreviewCookie({ date: todayUtc, count: 1 });
      }
    }

    // Truncated preview text for paywalled state
    const lines = compiledFullPrompt.split("\n");
    const previewSnippet = lines[0]?.length > 100
      ? lines[0].substring(0, 95) + "..."
      : lines[0] || compiledFullPrompt.substring(0, 95) + "...";

    // FAIL-CLOSED SECURITY GUARANTEE:
    // If isLocked is true, promptFull and negativePrompt are GUARANTEED to be null
    const responsePayload = {
      matchedRecipe: {
        id: selectedMatch.recipe.id,
        slug: selectedMatch.recipe.slug,
        title: selectedMatch.recipe.title,
        category: selectedMatch.recipe.category,
        useCase: selectedMatch.recipe.useCase,
      },
      matchScore: selectedMatch.matchScore,
      matchPercentage: selectedMatch.matchPercentage,
      dimensionScores: selectedMatch.dimensionScores,
      explanation: selectedMatch.explanation,
      topAlternatives: matches.slice(1, 3).map((m) => ({
        id: m.recipe.id,
        slug: m.recipe.slug,
        title: m.recipe.title,
        matchPercentage: m.matchPercentage,
      })),
      directorShotConfig: shotConfig,
      directorSlip,
      engine: selectedEngine,
      isLocked,
      quotaRemaining,
      quotaLimit,
      promptPreview: previewSnippet,
      promptFull: isLocked ? null : compiledFullPrompt,
      negativePrompt: isLocked ? null : compiledNegative,
    };

    const res = NextResponse.json(responsePayload);

    if (shouldSetPreviewCookie && previewCookieVal) {
      res.cookies.set({
        name: COOKIE_NAME,
        value: previewCookieVal,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 48, // 48 hours
      });
    }

    return res;
  } catch (err: any) {
    console.error("[AI Customizer Fatal API Error - Fail Closed]:", err);
    return NextResponse.json(
      { error: "Internal error processing shot customization." },
      { status: 500 }
    );
  }
}
