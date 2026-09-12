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
  const { action, notes } = body;

  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json(
      { error: "Invalid action. Must be 'approve' or 'reject'." },
      { status: 400 }
    );
  }

  const today = new Date().toISOString().split("T")[0];

  if (action === "approve") {
    // 1. Fetch pending change record
    const changeRes = await queryNeon(
      "SELECT * FROM pending_changes WHERE id = $1 LIMIT 1",
      [id]
    );

    if (!changeRes || changeRes.rows.length === 0) {
      return NextResponse.json(
        { error: "Pending change not found." },
        { status: 404 }
      );
    }

    const change = changeRes.rows[0];

    // 2. Fetch tool data to update JSON
    const toolRes = await queryNeon(
      "SELECT data FROM tools WHERE id = $1 LIMIT 1",
      [change.tool_id]
    );

    if (toolRes && toolRes.rows.length > 0) {
      const toolData = toolRes.rows[0].data;
      if (change.new_price) {
        toolData.pricing.startingPrice = change.new_price;
      }
      toolData.verifiedAt = today;
      toolData.updatedAt = today;

      // Update live tools record
      await queryNeon(
        `UPDATE tools SET
          starting_price = $1,
          verified_date = $2,
          data = $3,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $4`,
        [change.new_price || toolData.pricing.startingPrice, today, JSON.stringify(toolData), change.tool_id]
      );
    }

    // 3. Mark pending change as approved
    await queryNeon(
      `UPDATE pending_changes SET
        status = 'approved',
        notes = $1,
        reviewed_at = CURRENT_TIMESTAMP
      WHERE id = $2`,
      [notes || "Approved by Administrator", id]
    );

    return NextResponse.json({
      success: true,
      action: "approved",
      id,
      verifiedDate: today,
    });
  } else {
    // Reject
    await queryNeon(
      `UPDATE pending_changes SET
        status = 'rejected',
        notes = $1,
        reviewed_at = CURRENT_TIMESTAMP
      WHERE id = $2`,
      [notes || "Rejected by Administrator", id]
    );

    return NextResponse.json({
      success: true,
      action: "rejected",
      id,
    });
  }
}
