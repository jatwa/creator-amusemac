# CREATOR BY AMUSEMAC — CONTENT INGESTION & CMS ARCHITECTURE
**Date:** August 21, 2026  
**Engineering Role:** Principal Product Engineer + Senior UX Director + AI Research Architect  
**Branch:** `feature/final-content-production-audit`  

---

## 1. Storage & Schema Architecture

The platform implements a unified hybrid storage and content lifecycle model designed to scale to tens of thousands of records without degrading client performance or compromising data integrity:

### 1.1 Universal Content Lifecycle States
Every content entity supports four explicit lifecycle statuses:
- `draft` — In-progress editorial records. Excluded from public sitemaps, robots, and directory listings.
- `review` — Staged import records awaiting editorial validation.
- `published` — Production-grade records rendered on public pages and included in the dynamic `/sitemap.xml`.
- `archived` — Deprecated records preserved for historical URL redirects.

### 1.2 Universal Metadata Model (`lib/ingestion/types.ts`)
All content domains (`tools`, `prompts`, `stories`, `videos`, `guides`, `festivals`, `kits`, `lexicon`, `workflows`, `comparisons`, `blogs`) adhere to normalized core metadata:
```typescript
export interface BaseContentMetadata {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "review" | "published" | "archived";
  category: string;
  tags?: string[];
  author?: { name: string; role?: string; avatarUrl?: string } | string;
  createdAt?: string;
  updatedAt?: string;
  verifiedAt?: string;
  relatedContent?: {
    toolIds?: string[];
    promptIds?: string[];
    storyIds?: string[];
    workflowIds?: string[];
    tutorialIds?: string[];
    videoIds?: string[];
    blogIds?: string[];
  };
}
```

---

## 2. Ingestion & Import Pipeline (`lib/ingestion/`)

### 2.1 Structured File System Organization
Staged content is ingested from dedicated directory folders:
- `data/import/tools/` — AI Tool and Model additions (`.json`, `.csv`).
- `data/import/prompts/` — Prompt formulas and token recipes.
- `data/import/stories/` — Shot-by-shot multi-model case studies.
- `data/import/videos/` — Video masterclasses and timeline walkthroughs.
- `data/import/guides/` — Step-by-step production tutorials.
- `data/import/festivals/` — International film festival rules and deadlines.
- `data/import/kits/` — Downloadable production toolkits and LUT bundles.
- `data/import/lexicon/` — Optical camera lenses and motion vectors.

### 2.2 CLI Ingestion Runner (`scripts/import-content.ts`)
Run batch ingestion scans from the terminal:
```bash
cmd.exe /c "npx tsx scripts/import-content.ts"
```
The runner reads files, executes validation rules, logs individual record outcomes, and produces a batch summary.

---

## 3. Validation Engine (`lib/ingestion/validator.ts`)

The validation engine enforces strict quality constraints before any record is staged:

1. **Uniqueness Enforcement:**
   - Detects duplicate `id` and duplicate `slug` values across all existing datasets and within the batch.
   - Enforces slug formatting: lowercase alphanumeric with single hyphens (`^[a-z0-9]+(?:-[a-z0-9]+)*$`).
2. **Mandatory Field Integrity:**
   - Rejects empty titles, missing descriptions, empty markdown content, and missing categories.
3. **Relational Integrity:**
   - Validates that foreign key references (e.g. `compatibleToolIds`, `relatedToolIds`) point to existing entities.
4. **URL & Date Formatting:**
   - Programmatically validates official URLs, source URLs, and video embed links.
   - Enforces valid ISO timestamp formatting.
5. **Status Verification:**
   - Rejects unapproved status strings.

---

## 4. Publishing & SEO Safety Workflow

1. **Sitemap Isolation:**
   - `app/sitemap.ts` programmatically filters all entities: only records with `status === "published"` generate XML sitemap entries.
2. **Canonical Pages:**
   - Draft and review items do not generate public canonical index entries.
3. **Admin Review Interface:**
   - Protected Admin CMS (`app/admin/ingest`) allows editors to scan import folders, test raw JSON payloads against the validation engine, and review batch status before promoting records to `published`.

---

## 5. Performance & Scalability Design

1. **Server-Side Pagination (`lib/pagination.ts`):**
   - Reusable `paginateArray(items, page, pageSize)` and `filterByStatus(items, allowedStatuses)`.
   - Prevents sending massive datasets to client components.
2. **SSG & Incremental Static Regeneration:**
   - Prerenders high-traffic public pages at build time.
   - Keeps client bundles lightweight and maintains sub-50ms Time to First Byte (TTFB).

---

## 6. Migration & Editorial Safety

- Existing verified records (**24 tools, 2 stories, 7 prompts, 3 festivals, 4 kits, 8 lexicon entries, 3 videos, 2 blogs, 4 tutorials, 3 workflows**) remain untouched and fully preserved.
- Incoming imports append or safely upsert records without destructive overwrites.
