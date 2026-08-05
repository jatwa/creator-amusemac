import { CategoryGrid } from "@/components/category-grid";
import { ComparisonList } from "@/components/comparison-list";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navigation } from "@/components/navigation";
import { PromptList } from "@/components/prompt-list";
import { SectionHeading } from "@/components/section-heading";
import { ToolGrid } from "@/components/tool-grid";
import { TutorialList } from "@/components/tutorial-list";

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <section id="categories" className="shell py-20 sm:py-28"><SectionHeading label="Explore" title="Find the right creative edge." description="Curated starting points for every stage of your next visual project." /><CategoryGrid /></section>
      <section id="tools" className="shell py-20 sm:py-28"><SectionHeading label="Creator stack" title="Featured AI tools" description="Useful tools, judged through a creator’s lens—not a hype cycle." /><ToolGrid /></section>
      <section id="prompts" className="shell py-20 sm:py-28"><SectionHeading label="Make better" title="Popular prompts" description="Starting points you can adapt to your own voice, format, and audience." /><PromptList /></section>
      <section id="compare" className="shell py-20 sm:py-28"><SectionHeading label="Decide with confidence" title="Creator comparisons" description="Straight answers when two capable tools overlap." /><ComparisonList /></section>
      <section id="tutorials" className="shell py-20 sm:py-28"><SectionHeading label="Learn the workflow" title="Tutorials that ship work" description="Short, practical guides for building a faster creative practice." /><TutorialList /></section>
      <Footer />
    </main>
  );
}
