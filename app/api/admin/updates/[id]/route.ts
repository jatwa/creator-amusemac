import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/repository";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { action, reviewerName, customNewValue, rejectionReason } = body;

  if (!["approve", "reject", "edit"].includes(action)) {
    return NextResponse.json(
      { error: "Invalid action. Must be 'approve', 'reject', or 'edit'." },
      { status: 400 }
    );
  }

  const result = db.resolveUpdate(
    id,
    action,
    reviewerName || "Editorial Admin",
    customNewValue,
    rejectionReason
  );

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: `Update ${action}ed successfully.`,
    update: result.update,
  });
}
