export const categories = [
  { name: "AI Tools", description: "Discover tools worth your production time.", icon: "✦" },
  { name: "Prompts", description: "Direct better outputs with less iteration.", icon: "⌁" },
  { name: "Compare", description: "Pick the stack that fits your workflow.", icon: "↔" },
  { name: "Tutorials", description: "Build skills that compound on every project.", icon: "◫" },
  { name: "Templates", description: "Start from a strong creative system.", icon: "▱" },
  { name: "Resources", description: "Keep your ideas, references, and process moving.", icon: "◌" },
];

export const tools = [
  { name: "Runway", type: "Video generation", description: "A flexible production suite for visual effects, shots, and image-to-video experiments.", tag: "For filmmakers", accent: "from-violet-500/25" },
  { name: "Midjourney", type: "Image generation", description: "A fast way to explore art direction, lighting, composition, and visual worlds.", tag: "For designers", accent: "from-amber-400/25" },
  { name: "Descript", type: "Video editing", description: "Edit spoken video as naturally as a document and get your rough cut moving sooner.", tag: "For editors", accent: "from-cyan-400/25" },
];

export const prompts = [
  { category: "Image direction", title: "Cinematic product launch still", prompt: "A sculptural product photograph of [product], suspended in [environment], soft directional light, restrained color palette, editorial composition, tactile materials, 35mm film grain." },
  { category: "Video concept", title: "15-second brand film treatment", prompt: "Write a concise 15-second film treatment for [brand] that opens with [tension], pivots through [visual transition], and ends on [payoff]. Include sound design and a shot-by-shot beat." },
  { category: "Editing", title: "Fast-cut social sequence", prompt: "Turn this transcript into a 30-second vertical edit. Lead with the strongest contrarian statement, retain one proof point, add three visual cutaway suggestions, and end with a direct call to action." },
];

export const comparisons = [
  { left: "Runway", right: "Pika", answer: "Choose Runway for a broader post-production toolkit; choose Pika when fast stylized clips are the priority.", category: "AI video" },
  { left: "Midjourney", right: "Ideogram", answer: "Choose Midjourney for image-making range; choose Ideogram when typography and readable text need to lead.", category: "AI images" },
  { left: "Descript", right: "CapCut", answer: "Choose Descript for dialogue-led edits; choose CapCut for high-tempo social publishing workflows.", category: "Editing" },
];

export const tutorials = [
  { title: "Create a repeatable AI pre-production workflow", type: "Workflow", readTime: "8 min" },
  { title: "From one long-form interview to five social edits", type: "Editing", readTime: "6 min" },
  { title: "Direct AI images without losing your visual identity", type: "Art direction", readTime: "7 min" },
];
