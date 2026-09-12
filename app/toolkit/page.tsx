import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getUserProjects } from "@/lib/db/toolkit-repo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ToolkitDashboard } from "@/components/toolkit/toolkit-dashboard";

export const metadata: Metadata = {
  title: "Director's Toolkit — Private Filmmaking Workspace | Creator Intel",
  description:
    "Structured cinematic workspace for directors, cinematographers, and producers to architect scenes, optical bibles, post pipelines, and festival strategies.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ToolkitPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || "usr-director-workspace";
  const projects = await getUserProjects(userId);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation />
      <div className="flex-1">
        <ToolkitDashboard initialProjects={projects} />
      </div>
      <Footer />
    </div>
  );
}
