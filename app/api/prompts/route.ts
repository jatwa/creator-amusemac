import { NextResponse } from "next/server";
import { getDbPublishedPrompts } from "@/lib/db/neon";

export async function GET() {
  try {
    const prompts = await getDbPublishedPrompts();
    return NextResponse.json({
      success: true,
      prompts: prompts.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        category: p.category,
        useCase: p.useCase,
        description: p.description,
        verifiedAt: p.verifiedAt,
      })),
    });
  } catch (err: any) {
    console.error("[Get Prompts API Error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch prompts" },
      { status: 500 }
    );
  }
}
