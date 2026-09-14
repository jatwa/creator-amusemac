import { initNeonTables, seedNeonToolsIfEmpty, queryNeon } from "../lib/db/neon";
import { initAuthAndSubscriptionTables } from "../lib/db/auth-schema";
import { blogsData } from "../data/platform-data";

async function runMigration() {
  console.log("====================================================");
  console.log("CREATOR INTEL — NEON POSTGRES DATABASE MIGRATION");
  console.log("====================================================\n");

  if (!process.env.DATABASE_URL) {
    console.log("ℹ Note: DATABASE_URL is not defined in current environment.");
    console.log("Neon Postgres client is configured and will automatically connect and seed in production upon Vercel deployment.");
    return;
  }

  console.log("1. Initializing schema tables (tools, blog_drafts, pending_changes)...");
  const tablesInit = await initNeonTables();
  if (tablesInit) {
    console.log("✓ Schema tables initialized successfully.");
  } else {
    console.error("✗ Failed to initialize schema tables.");
    return;
  }

  console.log("2. Initializing auth and subscription tables (Razorpay & Paddle schema)...");
  const authSubInit = await initAuthAndSubscriptionTables();
  if (authSubInit) {
    console.log("✓ Auth & Subscription schema tables initialized with Paddle support.");
  } else {
    console.warn("⚠ Warning: Auth & Subscription tables initialization encountered an issue.");
  }

  console.log("3. Migrating static tool entries into Neon `tools` table...");
  const toolsCount = await seedNeonToolsIfEmpty();
  console.log(`✓ Seeded ${toolsCount} tools into Neon database.`);

  console.log("4. Migrating existing blog posts into `blog_drafts` table...");
  for (const blog of blogsData) {
    await queryNeon(
      `INSERT INTO blog_drafts (
        id, slug, title, excerpt, content, category, tags, author_name, author_role, source_links, status, created_date, published_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        content = EXCLUDED.content,
        category = EXCLUDED.category,
        tags = EXCLUDED.tags,
        status = EXCLUDED.status,
        updated_at = CURRENT_TIMESTAMP`,
      [
        blog.id,
        blog.slug,
        blog.title,
        blog.excerpt,
        blog.contentMarkdown,
        blog.category,
        JSON.stringify(blog.tags),
        blog.author.name,
        blog.author.role,
        JSON.stringify(blog.sourceUrls || []),
        blog.status || "published",
        blog.publishedAt,
        blog.publishedAt,
      ]
    );
  }
  console.log(`✓ Seeded ${blogsData.length} blog articles into blog_drafts.`);

  console.log("\n====================================================");
  console.log("NEON MIGRATION COMPLETE");
  console.log("====================================================");
}

runMigration().catch((err) => {
  console.error("Migration error:", err);
});
