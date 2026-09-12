import { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { WorkflowDiscoveryDesk } from "@/components/workflow-discovery-desk";
import { getAllPublicWorkflows } from "@/data/workflows-canonical";
import { workflowsData } from "@/data/platform-data";

export const metadata: Metadata = {
  title: "Production Workflows & Cinematic Playbooks — Creator Intel",
  description:
    "Structured, repeatable filmmaking playbooks and pipeline blueprints for directors, cinematographers, post-production supervisors, and AI filmmakers.",
};

export default function WorkflowsPage() {
  const canonicalWorkflows = getAllPublicWorkflows();

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Header */}
      <div className="border-b border-border-subtle bg-surface/30 py-16 sm:py-20">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Filmmaking Playbooks"
            title="Cinema & AI Production Workflows"
            description="Verified, step-by-step production playbooks detailing exact inputs, outputs, camera optics, software stacks, prompts, and delivery quality controls across each stage of film production."
          />
        </div>
      </div>

      <div className="shell py-14">
        <WorkflowDiscoveryDesk
          initialWorkflows={canonicalWorkflows}
          legacyWorkflows={workflowsData}
        />
      </div>

      <Footer />
    </main>
  );
}
