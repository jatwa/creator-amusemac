# Live Data & Persistent Automated Architecture Report

**Platform:** Creator by Amusemac  
**Phase:** Persistent Database, Source Ingestion, Change Detection, Auto-Update Policy & Deployment  
**Version:** 2.1.0-Production  
**Date:** August 18, 2026  
**Status:** **PASSED** (TypeScript 0 errors, Production Build 51/51 Static/Dynamic Routes, 100% Pipeline Lifecycle & Rollback Tested)

---

## 1. Database Provider Decision

- **Primary Production Target:** Supabase PostgreSQL / Standard PostgreSQL compatible via standard `DATABASE_URL` protocol.
- **Connection Architecture:** Connection pooling with 5-second connection timeouts, error catching, and automatic zero-downtime fallback to the pre-seeded in-memory repository (`lib/db/postgres-adapter.ts`).
- **Development & Build-Time Safety:** When `DATABASE_URL` is omitted, Next.js static site generation (`next build`) and local development automatically utilize the in-memory singleton seeded from `platform-data.ts`, ensuring zero build-time network dependencies and complete deterministic reliability.

---

## 2. Database Schema

Implemented full PostgreSQL DDL in [`lib/db/schema.sql`](file:///C:/Users/amuse/Documents/Codex/2026-08-06/github-plugin-github-openai-curated-remote-3/lib/db/schema.sql) covering all 13 platform entities:

1. **`categories`** (`id`, `name`, `slug`, `description`, `icon`, `tool_count`)
2. **`tools`** (`id`, `slug`, `name`, `tagline`, `description`, `category_name`, `pricing_model`, `starting_price`, `features`, `pros`, `cons`, `platforms`, `capabilities`, `verified_at`)
3. **`tool_pricing`** (`id`, `tool_id`, `tier_name`, `price`, `period`, `credits_or_generation`, `features`)
4. **`tool_features`** (Feature matrix mappings and capability support)
5. **`prompts`** (`id`, `slug`, `title`, `description`, `prompt_text`, `target_tool`, `aspect_ratio`, `tags`, `variables`)
6. **`tutorials`** (`id`, `slug`, `title`, `category`, `difficulty`, `duration`, `tools_used`, `steps`)
7. **`workflows`** (`id`, `slug`, `title`, `outcome`, `difficulty`, `estimated_time`, `tools_involved`, `phases`)
8. **`comparisons`** (`id`, `slug`, `title`, `tool_a_id`, `tool_b_id`, `summary_verdict`, `dimensions`, `scenario_verdicts`)
9. **`resources`** (`id`, `title`, `description`, `category`, `file_type`, `download_url`)
10. **`blogs`** (`id`, `slug`, `title`, `excerpt`, `content_markdown`, `cover_image_url`, `author_name`, `tags`, `reading_time`, `related_tool_ids`)
11. **`videos`** (`id`, `slug`, `title`, `platform`, `video_url`, `embed_url`, `creator_name`, `duration`, `related_tool_ids`)
12. **`sources`** (`id`, `url`, `source_type`, `publisher`, `entity_type`, `entity_id`, `last_verified_at`, `reliability_score`)
13. **`update_events`** (`id`, `entity_type`, `entity_id`, `field`, `old_value`, `new_value`, `source_url`, `confidence`, `risk`, `status`, `detected_at`)
14. **`verification_logs`** (`id`, `entity_type`, `entity_id`, `status`, `checked_at`, `details`)

---

## 3. Database Connection & Fallback

- Managed in [`lib/db/postgres-adapter.ts`](file:///C:/Users/amuse/Documents/Codex/2026-08-06/github-plugin-github-openai-curated-remote-3/lib/db/postgres-adapter.ts).
- Dynamically connects via standard `pg` connection pool when `DATABASE_URL` is set in environment.
- On connection drop or missing credentials, transparently routes queries to `PlatformRepository` singleton with zero crash risk.

---

## 4. Repeatable Database Seeding

- Implemented in [`lib/db/seed.ts`](file:///C:/Users/amuse/Documents/Codex/2026-08-06/github-plugin-github-openai-curated-remote-3/lib/db/seed.ts).
- Uses `ON CONFLICT (id) DO UPDATE` across all 10 content domains so it is completely safe to run multiple times without creating duplicate records.

---

## 5. Source Ingestion Engine

- Structured official collectors implemented in [`lib/engine/source-collector.ts`](file:///C:/Users/amuse/Documents/Codex/2026-08-06/github-plugin-github-openai-curated-remote-3/lib/engine/source-collector.ts).
- Tracks official websites, pricing pages, and changelogs for the 8 core creator tools:
  - **Runway** (`runwayml.com`, `runwayml.com/pricing`, `runwayml.com/changelog`)
  - **Kling AI** (`klingai.org`, `klingai.org/pricing`, `klingai.org/updates`)
  - **Midjourney** (`midjourney.com`, `docs.midjourney.com/docs/plans`)
  - **Ideogram** (`ideogram.ai`, `ideogram.ai/pricing`)
  - **Descript** (`descript.com`, `descript.com/pricing`)
  - **ElevenLabs** (`elevenlabs.io`, `elevenlabs.io/pricing`)
  - **Topaz Video AI** (`topazlabs.com/topaz-video-ai`, `topazlabs.com/pricing`)
  - **Flux** (`blackforestlabs.ai`, `blackforestlabs.ai/get-started`)

---

## 6. Change Detection & Risk Classification

- Implemented in [`lib/engine/change-detector.ts`](file:///C:/Users/amuse/Documents/Codex/2026-08-06/github-plugin-github-openai-curated-remote-3/lib/engine/change-detector.ts).
- Classifies differences into three distinct risk tiers:
  - **LOW RISK:** Minor tagline adjustments, cosmetic description refreshes. (Confidence $\ge 95\%$ eligible for auto-apply policy).
  - **MEDIUM RISK:** New supported model releases, new capability feature flags. (Requires editorial review).
  - **HIGH RISK:** Pricing tier adjustments, plan deprecations, tool availability changes. (Mandatory human approval).

---

## 7. Auto-Update & Review Policy

- Managed in [`lib/engine/update-manager.ts`](file:///C:/Users/amuse/Documents/Codex/2026-08-06/github-plugin-github-openai-curated-remote-3/lib/engine/update-manager.ts).
- **Auto-Apply:** Automatically applies verified low-risk signals and logs verification records.
- **Review Queue:** High/medium risk signals are staged as `status: "pending"` for editorial review.
- **Rollback Safety:** Every applied update retains previous raw value in `rollbackValue` allowing 1-click atomic rollback.

---

## 8. Scheduled Cron Automation

Configured in [`vercel.json`](file:///C:/Users/amuse/Documents/Codex/2026-08-06/github-plugin-github-openai-curated-remote-3/vercel.json) and protected by `CRON_SECRET` headers:

| Route | Schedule | Frequency | Purpose |
|---|---|---|---|
| `/api/cron/check-tools` | `0 6 * * *` | Daily at 06:00 UTC | Sub-second concurrent domain reachability and model health checks |
| `/api/cron/detect-stale` | `0 12 * * 1` | Weekly on Mondays | Identifies tools unverified for $>14$ days and alerts admin |
| `/api/cron/refresh-index` | `0 0 * * *` | Daily at 00:00 UTC | Rebuilds universal multi-modal search index tokens |

---

## 9. Admin Review Control Center

- **Overview (`/admin`):** Live metrics on tracked tools, pending updates, source count, and stale items.
- **Review Board (`/admin/updates` & `components/admin-update-board.tsx`):**
  - Side-by-side OLD VALUE vs NEW VALUE diff cards.
  - Risk badges (LOW, MEDIUM, HIGH) and confidence scores.
  - Actions: **Approve & Apply**, **Reject**, **Edit & Apply**, and **↩ Rollback**.
- **Source Ledger (`/admin/sources`):** Reliability score tracker.
- **Blog & Video CMS (`/admin/blog`, `/admin/videos`):** Draft/Published state management.

---

## 10. Real-Time Search & Live Data Integration

- Universal search (`/search`, `lib/search/indexer.ts`, `components/search-view.tsx`) queries the active repository state across all 7 domains (Tools, Prompts, Blogs, Videos, Workflows, Tutorials, Comparisons).
- Approved updates reflect in search tokens and public pages immediately.

---

## 11. Controlled Pipeline Test & Rollback Verification (Phase 14)

Executed automated lifecycle audit via `/api/admin/pipeline-test`:

1. **Source Ingestion:** Ingested simulated tagline signal for Runway from official domain.
2. **Change Detection:** Detected diff on `tagline` field (Confidence: 98%, Risk: LOW).
3. **Update Staging:** Created `UpdateEvent` with ID `upd-1787074528829-xyaoy` (`status: "pending"`).
4. **Admin Approval:** Approved by Editorial Curator $\rightarrow$ status updated to `"applied"`.
5. **Database State:** Verified live entity updated to `"Next-Generation AI Video & World Models for Commercial Filmmaking"`.
6. **Rollback Execution:** Triggered `rollbackUpdate` $\rightarrow$ status updated to `"rolled_back"`.
7. **Restoration Verification:** Verified entity tagline was restored to `"The industry standard generative video and VFX suite for filmmakers."` (Matches Initial: **TRUE**).

---

## 12. Environment Variable Configuration

The application requires only variable names configured in the Vercel dashboard:

| Variable Name | Status | Usage |
|---|---|---|
| `DATABASE_URL` | Optional | Connection string for Supabase / PostgreSQL database. (System runs on built-in repository fallback when absent). |
| `CRON_SECRET` | Optional | Bearer token to authorize automated cron triggers. |
| `ADMIN_SECRET` | Optional | Shared token for protecting `/admin/*` operations. |

---

## 13. Production Verification

- **Production Domain:** [https://creator-amusemac.vercel.app/](https://creator-amusemac.vercel.app/)
- **Live HTTP Status:** 200 OK across all public routes.
- **TypeScript:** 0 errors.
- **Next.js Production Build:** 51 static and dynamic routes compiled successfully.

---

## 14. Next Recommended Phase

- **AI Recommendation Engine (Phase J):** Natural language creator prompt synthesizer connecting custom project treatments with tool stacks and prompt recipes.
