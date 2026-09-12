import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth/admin-guard";
import { queryNeon } from "@/lib/db/neon";

export async function GET(req: Request) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const blogRes = await queryNeon(
    "SELECT * FROM blog_drafts ORDER BY created_at DESC"
  );
  const promptRes = await queryNeon(
    "SELECT * FROM prompt_drafts ORDER BY created_at DESC"
  );

  return NextResponse.json({
    success: true,
    blogs: blogRes ? blogRes.rows : [],
    prompts: promptRes ? promptRes.rows : [],
  });
}
