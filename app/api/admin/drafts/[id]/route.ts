import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth/admin-guard";
import { queryNeon } from "@/lib/db/neon";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { type, action, title, content, excerpt, promptText, negativePrompt } = body;

  const today = new Date().toISOString().split("T")[0];

  if (type === "blog") {
    if (action === "publish") {
      await queryNeon(
        `UPDATE blog_drafts SET
          status = 'published',
          published_date = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2`,
        [today, id]
      );
      return NextResponse.json({ success: true, action: "published", id, date: today });
    } else if (action === "reject") {
      await queryNeon(
        `UPDATE blog_drafts SET status = 'rejected', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [id]
      );
      return NextResponse.json({ success: true, action: "rejected", id });
    } else if (action === "update") {
      await queryNeon(
        `UPDATE blog_drafts SET
          title = COALESCE($1, title),
          content = COALESCE($2, content),
          excerpt = COALESCE($3, excerpt),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $4`,
        [title, content, excerpt, id]
      );
      return NextResponse.json({ success: true, action: "updated", id });
    }
  } else if (type === "prompt") {
    if (action === "publish") {
      // Update prompt_drafts status
      await queryNeon(
        `UPDATE prompt_drafts SET
          status = 'published',
          published_date = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2`,
        [today, id]
      );
      return NextResponse.json({ success: true, action: "published", id, date: today });
    } else if (action === "reject") {
      await queryNeon(
        `UPDATE prompt_drafts SET status = 'rejected', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [id]
      );
      return NextResponse.json({ success: true, action: "rejected", id });
    } else if (action === "update") {
      await queryNeon(
        `UPDATE prompt_drafts SET
          title = COALESCE($1, title),
          prompt_text = COALESCE($2, prompt_text),
          negative_prompt = COALESCE($3, negative_prompt),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $4`,
        [title, promptText, negativePrompt, id]
      );
      return NextResponse.json({ success: true, action: "updated", id });
    }
  }

  return NextResponse.json({ error: "Invalid type or action." }, { status: 400 });
}
