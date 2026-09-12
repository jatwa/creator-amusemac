import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getProjectById } from "@/lib/db/toolkit-repo";
import { ToolkitWorkspace } from "@/components/toolkit/toolkit-workspace";

interface ToolkitProjectPageProps {
  params: Promise<{ projectId: string }>;
}

export async function generateMetadata({
  params,
}: ToolkitProjectPageProps): Promise<Metadata> {
  const { projectId } = await params;
  return {
    title: `Director's Workspace — ${projectId} | Creator Intel`,
    description: "Private filmmaking intelligence workspace.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ToolkitProjectPage({
  params,
}: ToolkitProjectPageProps) {
  const { projectId } = await params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || "usr-director-workspace";

  const project = await getProjectById(projectId, userId);

  if (!project) {
    notFound();
  }

  return <ToolkitWorkspace initialProject={project} />;
}
