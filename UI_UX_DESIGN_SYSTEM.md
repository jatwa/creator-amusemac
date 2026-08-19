# Creator by Amusemac — UI/UX Design System Specification

**Design Theme:** Cinematic AI Production Intelligence  
**Target Persona:** Visual Directors, Cinematographers, Editors, VFX Artists, Creative Producers  
**Aesthetic Core:** High-contrast Darkroom Minimal, Tactile Technical Precision, Editorial Storytelling  

---

## 1. Color Palette & Token Architecture

| Token Name | Hex / Value | Usage & Context |
|---|---|---|
| `--color-bg-base` | `#08080a` | Deepest root background (`bg-ink`) |
| `--color-bg-elevated` | `#0e0e12` | Elevated section backdrop |
| `--color-surface` | `#131318` | Primary card, modal, and panel background |
| `--color-surface-hover` | `#1a1a22` | Interactive surface hover state |
| `--color-surface-active` | `#22222c` | Pressed / active state |
| `--color-border-subtle` | `#22222a` | Default crisp division line (`border-line`) |
| `--color-border-hover` | `#3f3f4a` | Hovered card border |
| `--color-border-accent` | `rgba(217, 255, 74, 0.35)` | Lime highlight border for featured cards |
| `--color-text-primary` | `#ffffff` | High-emphasis display headlines and titles |
| `--color-text-secondary` | `#d4d4d8` | Body copy, descriptions, clear reading paragraphs |
| `--color-text-muted` | `#a1a1aa` | Explanatory subtext, labels, captions |
| `--color-text-dim` | `#71717a` | Technical metadata, timestamps, author lines |
| `--color-accent-lime` | `#d9ff4a` | Brand primary highlight, key active pills, badges |
| `--color-accent-amber` | `#f59e0b` | Warm cine highlight, ratings, warning states |
| `--color-accent-cyan` | `#38bdf8` | Cold cine highlight, workflow node connections |

---

## 2. Typographic Scale & Hierarchy

- **Display 1 (Cinematic Hero):** `text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[1.08] text-white`
- **Section Heading (H2):** `text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[-0.03em] text-white`
- **Subheading / Dossier Title (H3):** `text-lg sm:text-xl font-semibold tracking-tight text-white`
- **Eyebrow / Category Tag:** `font-mono text-xs font-semibold uppercase tracking-[0.14em] text-lime`
- **Body Regular:** `text-sm sm:text-base leading-relaxed text-zinc-300`
- **Small Body / Card Description:** `text-xs sm:text-sm leading-normal text-zinc-400`
- **Technical Metadata / Code:** `font-mono text-[11px] sm:text-xs text-zinc-400`

---

## 3. Elevation, Radius & Border System

- **Card Radius:** `rounded-xl` or `rounded-2xl` (clean, tight corners rather than overly bubbly curves).
- **Surface Elevation:**
  - Level 0 (Canvas): `#08080a`
  - Level 1 (Card / Grid Tile): `#131318` + `border border-zinc-800/80`
  - Level 2 (Hover / Active / Dropdown): `#1a1a22` + `border border-zinc-700` + subtle shadow `0 8px 30px rgba(0,0,0,0.4)`
  - Level 3 (Modal / Sticky Header): `#131318` at 90% opacity with `backdrop-blur-xl` + `border border-zinc-700/80`

---

## 4. Component Primitives

### 4.1 Global Navigation (`components/navigation.tsx`)
Organized around **4 Filmmaking Pillars**:
1. **DISCOVER:** Tools Directory, Flagship Video Hub, Image AI, Audio & VFX.
2. **CREATE:** Prompt Library, Workflows, Camera & Lens Advisor.
3. **LEARN:** Creator Journal (Blog), Masterclasses (Videos), Practical Tutorials.
4. **COMPARE:** Head-to-head AI model comparisons.
- **Search trigger:** Direct access to `/search`.
- **Responsive Mobile Drawer:** Clean categorized slide-down drawer with full touch targets.

### 4.2 Homepage Discovery Journey (`app/page.tsx` & `components/hero.tsx`)
- **Stage 1 — Editorial Hero:** Immediate value statement + Primary ("Explore AI Tools") & Secondary ("Build a Prompt") CTAs + Quick Search.
- **Stage 2 — "What Are You Making?":** Production intent router (Commercials, Narrative Cinema, Character Consistency, Music Videos, Social Ads, Pre-viz).
- **Stage 3 — Video Generation Flagship Hub Feature:** Direct showcase of the latest motion diffusion models.
- **Stage 4 — Tool Intelligence Matrix:** Curated tools with structured capability badges.
- **Stage 5 — Prompt Recipes:** Production-ready prompt formulas with 1-click copy.
- **Stage 6 — Verdict-First Comparisons:** Direct comparative decision matrix.
- **Stage 7 — Production Workflows & Tutorials:** Step-by-step pipeline blueprints.
- **Stage 8 — Creator Journal & Video Masterclasses:** Deep technical essays and director timeline breakdowns.

### 4.3 Distinct Card Archetypes
- **`ToolCard`:** Top banner with accent tint, model name, category badge, pricing pill, core strengths, and direct dossier link.
- **`PromptCard`:** Monospace prompt preview with variable badges, target model chip, and 1-click copy button.
- **`EditorialCard`:** High-contrast reading layout, category tag, reading time, author byline, and excerpt.
- **`VideoCard`:** 16:9 cinematic aspect ratio thumbnail, platform icon, duration badge, skill level, and tool tags.
- **`ComparisonCard`:** Side-by-side tool avatars, comparison verdict snippet, and "Read comparison" action.
- **`WorkflowCard`:** Multi-step node pipeline visualization (Step 1 $\rightarrow$ Step 2 $\rightarrow$ Step 3) with tool requirements and time estimate.

---

## 5. Interaction Design & Micro-Animations

- **Hover States:** Smooth border brightening (`hover:border-zinc-500` or `hover:border-lime/60`), subtle `translate-y-[-2px]` lift on interactive cards.
- **Feedback:** Copy buttons switch state with green icon and text (`✓ Copied`).
- **Focus Rings:** High-visibility keyboard focus indicator (`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-black`).
- **Reduced Motion:** Gracefully disabled when user prefers reduced motion.
