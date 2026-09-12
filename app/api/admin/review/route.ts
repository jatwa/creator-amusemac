import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth/admin-guard";
import { queryNeon } from "@/lib/db/neon";

export async function GET(req: Request) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await queryNeon<any>(`
    SELECT 
      pc.id,
      pc.tool_id,
      t.name as tool_name,
      t.slug as tool_slug,
      pc.field_name,
      pc.old_price,
      pc.new_price,
      pc.source_url,
      pc.detected_date,
      pc.status,
      pc.notes,
      pc.created_at
    FROM pending_changes pc
    LEFT JOIN tools t ON pc.tool_id = t.id
    ORDER BY pc.created_at DESC
  `);

  return NextResponse.json({
    success: true,
    changes: result ? result.rows : [],
  });
}
