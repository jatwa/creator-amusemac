import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { blogsData } from "@/data/platform-data";
import { EditorialCard } from "@/components/ui-cards";

interface AuthorProfile {
  slug: string;
  name: string;
  role: string;
  bio: string;
  credentials: string[];
  avatarUrl?: string;
}

const AUTHORS_REGISTRY: Record<string, AuthorProfile> = {
  "marcus-vance": {
    slug: "marcus-vance",
    name: "Marcus Vance",
    role: "Lead Commercial Director & VFX Supervisor",
    bio: "Director and visual effects supervisor with 12+ years of experience leading commercial spots and narrative previs pipelines across London and Los Angeles. Specializes in neural camera trajectory control, optical simulation, and hybrid CGI/generative workflows.",
    credentials: [
      "VFX Supervisor on D&AD award-winning commercial campaigns",
      "Specialist in 3D spatio-temporal diffusion architectures",
      "Creator of the Multi-Motion Brush camera choreography methodology",
    ],
  },
  "elena-rostova": {
    slug: "elena-rostova",
    name: "Elena Rostova",
    role: "Concept Artist & Look-Dev Lead",
    bio: "Look development artist and concept designer focusing on 35mm optical fidelity, rectified flow matching models, and cinematic color science for indie feature films.",
    credentials: [
      "Lead concept artist on festival-selected indie features",
      "Benchmark evaluator for Black Forest Labs Flux.1 flow matching",
      "Expert in film emulation LUTs and ACES color grading",
    ],
  },
  "claire-delacroix": {
    slug: "claire-delacroix",
    name: "Claire Delacroix",
    role: "Director of Photography & Optics Specialist",
    bio: "Cinematographer specializing in anamorphic prime lenses, volumetric practical lighting, and the translation of physical camera grammars into generative AI synthesis.",
    credentials: [
      "DoP on European theatrical narrative shorts",
      "Curator of the Creator Intel 42-Director-Recipe optical bible",
      "Specialist in Cooke Anamorphic /i and Zeiss Master Prime optical characteristics",
    ],
  },
  "amusemac-studio": {
    slug: "amusemac-studio",
    name: "Amusemac Studio Editorial",
    role: "Curatorial & Filmmaking Intelligence Desk",
    bio: "The collective editorial and technical research team behind Creator Intel. Dedicated to unvarnished, independent tool benchmarking, physical cinematography analysis, and open production intelligence.",
    credentials: [
      "100% independent evaluation with zero sponsored tool rankings",
      "Multi-model camera control benchmark contributors",
      "Curators of the DCI theatrical DCP compliance playbooks",
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(AUTHORS_REGISTRY).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = AUTHORS_REGISTRY[slug];
  if (!author) return { title: "Author Not Found" };

  return {
    title: `${author.name} — Editorial Curator & Intelligence Contributor`,
    description: author.bio,
    alternates: {
      canonical: `https://creatorintels.com/authors/${author.slug}`,
    },
  };
}

export default async function AuthorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = AUTHORS_REGISTRY[slug];

  if (!author) {
    notFound();
  }

  // Find articles by author
  const authorArticles = blogsData.filter(
    (b) =>
      b.author.name.toLowerCase().includes(author.name.toLowerCase()) ||
      (author.slug === "amusemac-studio" && b.author.name.includes("Editorial"))
  );

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Header */}
      <section className="border-b border-border-subtle bg-surface/30 py-16 sm:py-24">
        <div className="shell max-w-4xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-tertiary">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/journal" className="hover:text-primary">Journal</Link>
            <span>/</span>
            <span className="text-secondary">{author.name}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center font-serif text-3xl font-bold text-accent">
              {author.name[0]}
            </div>
            <div>
              <span className="text-xs font-mono text-accent uppercase tracking-wider font-semibold">
                EDITORIAL CONTRIBUTOR
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-primary font-serif mt-1">
                {author.name}
              </h1>
              <p className="text-sm text-secondary font-medium mt-1">{author.role}</p>
            </div>
          </div>

          <p className="text-base text-secondary leading-relaxed font-sans max-w-2xl">
            {author.bio}
          </p>

          <div className="pt-2 space-y-2">
            <span className="text-xs font-mono uppercase text-tertiary font-semibold block">
              VERIFIED EXPERTISE &amp; CREDENTIALS
            </span>
            <ul className="space-y-1.5 text-xs text-secondary font-sans list-disc pl-5">
              {author.credentials.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Articles by Author */}
      <section className="shell py-16 space-y-8">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-primary font-serif">
            Articles &amp; Research by {author.name}
          </h2>
          <span className="text-xs font-mono text-tertiary">
            {authorArticles.length} {authorArticles.length === 1 ? "Essay" : "Essays"}
          </span>
        </div>

        {authorArticles.length === 0 ? (
          <div className="surface p-12 rounded-2xl border border-border text-center text-xs text-tertiary font-mono">
            New research papers and essays by {author.name} are currently in editorial peer review.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {authorArticles.map((post) => (
              <EditorialCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
