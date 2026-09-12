import { Pool } from "pg";
import { Tool, BlogPost, Prompt } from "@/data/types";
import { toolsData, blogsData, promptsData } from "@/data/platform-data";

let pool: Pool | null = null;

export function getNeonPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  if (!pool) {
    try {
      pool = new Pool({
        connectionString,
        ssl: connectionString.includes("localhost")
          ? false
          : { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 10000,
        max: 10,
      });

      pool.on("error", (err) => {
        console.error("[Neon Postgres Pool Error]:", err.message);
      });
    } catch (err: any) {
      console.warn("[Neon Postgres Init Warning]:", err.message);
      return null;
    }
  }

  return pool;
}

export async function queryNeon<T = any>(
  text: string,
  params: any[] = []
): Promise<{ rows: T[]; rowCount: number } | null> {
  const dbPool = getNeonPool();
  if (!dbPool) return null;

  try {
    const client = await dbPool.connect();
    try {
      const result = await client.query(text, params);
      return { rows: result.rows, rowCount: result.rowCount || 0 };
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.warn("[Neon Query Error]:", err.message);
    return null;
  }
}

/**
 * Initialize all required Neon Postgres tables for Creator Intel
 */
export async function initNeonTables(): Promise<boolean> {
  const schemaSql = `
    -- 1. TOOLS TABLE
    CREATE TABLE IF NOT EXISTS tools (
      id VARCHAR(128) PRIMARY KEY,
      slug VARCHAR(128) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(64) NOT NULL,
      pricing JSONB NOT NULL DEFAULT '{}'::jsonb,
      starting_price VARCHAR(128),
      features JSONB NOT NULL DEFAULT '[]'::jsonb,
      official_url VARCHAR(512) NOT NULL,
      affiliate_url VARCHAR(512),
      verified_date VARCHAR(64) NOT NULL,
      status VARCHAR(32) NOT NULL DEFAULT 'published',
      data JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. BLOG DRAFTS TABLE
    CREATE TABLE IF NOT EXISTS blog_drafts (
      id VARCHAR(128) PRIMARY KEY,
      slug VARCHAR(128) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      category VARCHAR(64) NOT NULL DEFAULT 'Editorial',
      tags JSONB NOT NULL DEFAULT '[]'::jsonb,
      author_name VARCHAR(128) NOT NULL DEFAULT 'Creator Intel Editorial Desk',
      author_role VARCHAR(128) DEFAULT 'AI Research Lead',
      source_links JSONB NOT NULL DEFAULT '[]'::jsonb,
      status VARCHAR(32) NOT NULL DEFAULT 'draft',
      created_date VARCHAR(64) NOT NULL,
      published_date VARCHAR(64),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. PROMPT DRAFTS TABLE
    CREATE TABLE IF NOT EXISTS prompt_drafts (
      id VARCHAR(128) PRIMARY KEY,
      slug VARCHAR(128) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(64) NOT NULL DEFAULT 'video',
      use_case VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      prompt_text TEXT NOT NULL,
      negative_prompt TEXT,
      compatible_tool_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
      recommended_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
      variables JSONB NOT NULL DEFAULT '[]'::jsonb,
      status VARCHAR(32) NOT NULL DEFAULT 'draft',
      created_date VARCHAR(64) NOT NULL,
      published_date VARCHAR(64),
      data JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 4. PENDING CHANGES TABLE (Drift & Pricing Verification)
    CREATE TABLE IF NOT EXISTS pending_changes (
      id VARCHAR(128) PRIMARY KEY,
      tool_id VARCHAR(128) NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
      field_name VARCHAR(64) NOT NULL DEFAULT 'pricing',
      old_price VARCHAR(255),
      new_price VARCHAR(255),
      old_value JSONB,
      new_value JSONB,
      source_url VARCHAR(512) NOT NULL,
      detected_date VARCHAR(64) NOT NULL,
      status VARCHAR(32) NOT NULL DEFAULT 'needs_review',
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      reviewed_at TIMESTAMP WITH TIME ZONE
    );

    CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);
    CREATE INDEX IF NOT EXISTS idx_blog_drafts_status ON blog_drafts(status);
    CREATE INDEX IF NOT EXISTS idx_prompt_drafts_status ON prompt_drafts(status);
    CREATE INDEX IF NOT EXISTS idx_pending_changes_status ON pending_changes(status);
  `;

  const res = await queryNeon(schemaSql);
  return res !== null;
}

/**
 * Seed existing static tools into Neon Postgres if table is empty
 */
export async function seedNeonToolsIfEmpty(): Promise<number> {
  const check = await queryNeon("SELECT COUNT(*) as count FROM tools");
  if (!check || parseInt(check.rows[0]?.count || "0", 10) > 0) {
    return parseInt(check?.rows[0]?.count || "0", 10);
  }

  let inserted = 0;
  for (const tool of toolsData) {
    await queryNeon(
      `INSERT INTO tools (
        id, slug, name, category, pricing, starting_price, features, official_url, affiliate_url, verified_date, status, data
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        pricing = EXCLUDED.pricing,
        starting_price = EXCLUDED.starting_price,
        features = EXCLUDED.features,
        official_url = EXCLUDED.official_url,
        affiliate_url = EXCLUDED.affiliate_url,
        verified_date = EXCLUDED.verified_date,
        data = EXCLUDED.data,
        updated_at = CURRENT_TIMESTAMP`,
      [
        tool.id,
        tool.slug,
        tool.name,
        tool.category,
        JSON.stringify(tool.pricing),
        tool.pricing.startingPrice,
        JSON.stringify(tool.keyFeatures || []),
        tool.officialUrl,
        tool.affiliateUrl || null,
        tool.verifiedAt,
        tool.status || "published",
        JSON.stringify(tool),
      ]
    );
    inserted++;
  }

  return inserted;
}

/**
 * Fetch all tools (from Neon Postgres if active, else static fallback)
 */
export async function getDbTools(): Promise<Tool[]> {
  const result = await queryNeon<any>(
    "SELECT data FROM tools WHERE status = 'published' ORDER BY name ASC"
  );
  if (result && result.rows.length > 0) {
    return result.rows.map((r) => r.data);
  }
  return toolsData;
}

/**
 * Fetch tool by slug (from Neon Postgres if active, else static fallback)
 */
export async function getDbToolBySlug(slug: string): Promise<Tool | null> {
  const result = await queryNeon<any>(
    "SELECT data FROM tools WHERE slug = $1 LIMIT 1",
    [slug]
  );
  if (result && result.rows.length > 0) {
    return result.rows[0].data;
  }
  return toolsData.find((t) => t.slug === slug) || null;
}

/**
 * Fetch all published blogs (including any published drafts from Neon)
 */
export async function getDbPublishedBlogs(): Promise<BlogPost[]> {
  const result = await queryNeon<any>(
    "SELECT * FROM blog_drafts WHERE status = 'published' ORDER BY created_at DESC"
  );
  if (result && result.rows.length > 0) {
    const dbBlogs: BlogPost[] = result.rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt || "",
      contentMarkdown: r.content,
      publishedAt: r.published_date || r.created_date,
      updatedAt: r.created_date,
      category: r.category as any,
      tags: Array.isArray(r.tags) ? r.tags : JSON.parse(r.tags || "[]"),
      author: {
        name: r.author_name,
        role: r.author_role || "Editorial Desk",
      },
      readingTime: "4 min read",
      sourceUrls: Array.isArray(r.source_links) ? r.source_links : JSON.parse(r.source_links || "[]"),
      status: "published",
      relatedToolIds: [],
      relatedPromptIds: [],
      relatedTutorialIds: [],
      relatedWorkflowIds: [],
      relatedVideoIds: [],
    }));

    // Merge without duplicating existing IDs
    const merged = [...blogsData];
    dbBlogs.forEach((b) => {
      if (!merged.some((existing) => existing.id === b.id || existing.slug === b.slug)) {
        merged.unshift(b);
      }
    });
    return merged;
  }
  return blogsData;
}

/**
 * Fetch a single published blog by slug
 */
export async function getDbBlogBySlug(slug: string): Promise<BlogPost | null> {
  const blogs = await getDbPublishedBlogs();
  return blogs.find((b) => b.slug === slug) || null;
}

/**
 * Fetch all published prompts (including published prompt drafts from Neon)
 */
export async function getDbPublishedPrompts(): Promise<Prompt[]> {
  const result = await queryNeon<any>(
    "SELECT * FROM prompt_drafts WHERE status = 'published' ORDER BY created_at DESC"
  );
  if (result && result.rows.length > 0) {
    const dbPrompts: Prompt[] = result.rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      category: r.category as any,
      useCase: r.use_case,
      description: r.description,
      promptText: r.prompt_text,
      negativePrompt: r.negative_prompt,
      variables: Array.isArray(r.variables) ? r.variables : JSON.parse(r.variables || "[]"),
      compatibleToolIds: Array.isArray(r.compatible_tool_ids) ? r.compatible_tool_ids : JSON.parse(r.compatible_tool_ids || "[]"),
      recommendedSettings: typeof r.recommended_settings === "object" ? r.recommended_settings : JSON.parse(r.recommended_settings || "{}"),
      relatedPromptIds: [],
      relatedTutorialIds: [],
      verifiedAt: r.published_date || r.created_date,
      status: "published",
    }));

    const merged = [...promptsData];
    dbPrompts.forEach((p) => {
      if (!merged.some((existing) => existing.id === p.id || existing.slug === p.slug)) {
        merged.unshift(p);
      }
    });
    return merged;
  }
  return promptsData;
}

/**
 * Fetch a single published prompt by slug
 */
export async function getDbPromptBySlug(slug: string): Promise<Prompt | null> {
  const prompts = await getDbPublishedPrompts();
  return prompts.find((p) => p.slug === slug) || null;
}

