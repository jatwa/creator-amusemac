import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getProjectById, updateProject, deleteProject } from "@/lib/db/toolkit-repo";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  if (!projectId || projectId === "undefined" || projectId === "null") {
    return NextResponse.json(
      { success: false, error: "Invalid project ID" },
      { status: 404 }
    );
  }
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || req.headers.get("x-demo-user-id") || "usr-director-workspace";

  try {
    const project = await getProjectById(projectId, userId);
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || req.headers.get("x-demo-user-id") || "usr-director-workspace";

  try {
    const body = await req.json();
    const updated = await updateProject(projectId, userId, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Project not found or unauthorized to update" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  return PATCH(req, { params });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || req.headers.get("x-demo-user-id") || "usr-director-workspace";

  try {
    const success = await deleteProject(projectId, userId);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Project not found or unauthorized to delete" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete project" },
      { status: 500 }
    );
  }
}
