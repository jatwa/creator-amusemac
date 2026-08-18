import { executeQuery, checkDatabaseConnection } from './postgres-adapter';
import {
  toolsData,
  categoriesData,
  promptsData,
  tutorialsData,
  workflowsData,
  comparisonsData,
  resourcesData,
  blogsData,
  videosData,
} from '@/data/platform-data';
import fs from 'fs';
import path from 'path';

export async function seedPostgresDatabase(): Promise<{ success: boolean; message: string }> {
  const connected = await checkDatabaseConnection();
  if (!connected) {
    return {
      success: false,
      message: 'PostgreSQL connection unavailable. Seed bypassed (in-memory repository is active).',
    };
  }

  try {
    // 1. Run Schema DDL
    const schemaPath = path.join(process.cwd(), 'lib', 'db', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await executeQuery(schemaSql);
    }

    // 2. Seed Categories
    for (const cat of categoriesData) {
      const catId = `cat-${cat.slug}`;
      await executeQuery(
        `INSERT INTO categories (id, name, slug, description, icon, tool_count)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           tool_count = EXCLUDED.tool_count,
           updated_at = CURRENT_TIMESTAMP`,
        [catId, cat.name, cat.slug, cat.description, cat.icon, cat.toolCount || 0]
      );
    }

    // 3. Seed Tools & Tool Pricing
    for (const tool of toolsData) {
      await executeQuery(
        `INSERT INTO tools (
           id, slug, name, tagline, description, category_name,
           pricing_model, pricing_summary, starting_price, website_url, logo_url,
           rating, review_count, features, pros, cons, best_for, platforms, capabilities, verified_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
         ON CONFLICT (id) DO UPDATE SET
           tagline = EXCLUDED.tagline,
           description = EXCLUDED.description,
           pricing_summary = EXCLUDED.pricing_summary,
           starting_price = EXCLUDED.starting_price,
           features = EXCLUDED.features,
           pros = EXCLUDED.pros,
           cons = EXCLUDED.cons,
           verified_at = EXCLUDED.verified_at,
           updated_at = CURRENT_TIMESTAMP`,
        [
          tool.id,
          tool.slug,
          tool.name,
          tool.tagline,
          tool.description,
          tool.category,
          tool.pricing.model,
          tool.pricing.startingPrice || 'Freemium',
          tool.pricing.startingPrice || 'Free',
          tool.officialUrl,
          tool.logoUrl || null,
          tool.rating || 5.0,
          0,
          JSON.stringify(tool.keyFeatures || []),
          JSON.stringify(tool.strengths || []),
          JSON.stringify(tool.weaknesses || []),
          JSON.stringify([tool.bestFor]),
          JSON.stringify(tool.platforms || []),
          JSON.stringify(tool.supportedModels || []),
          tool.verifiedAt,
        ]
      );
    }

    // 4. Seed Prompts
    for (const prompt of promptsData) {
      await executeQuery(
        `INSERT INTO prompts (id, slug, title, description, category, prompt_text, target_tool, aspect_ratio, tags, variables, creator_credit)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           prompt_text = EXCLUDED.prompt_text,
           updated_at = CURRENT_TIMESTAMP`,
        [
          prompt.id,
          prompt.slug,
          prompt.title,
          prompt.description,
          prompt.category,
          prompt.promptText,
          prompt.compatibleToolIds?.[0] || 'Midjourney',
          prompt.recommendedSettings?.aspectRatio || '16:9',
          JSON.stringify(prompt.compatibleToolIds || []),
          JSON.stringify(prompt.variables || []),
          'Amusemac Editorial',
        ]
      );
    }

    // 5. Seed Tutorials
    for (const tut of tutorialsData) {
      await executeQuery(
        `INSERT INTO tutorials (id, slug, title, description, category, difficulty, duration, tools_used, steps)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           steps = EXCLUDED.steps,
           updated_at = CURRENT_TIMESTAMP`,
        [
          tut.id,
          tut.slug,
          tut.title,
          tut.goal,
          tut.category,
          tut.difficulty,
          tut.readTime,
          JSON.stringify(tut.requiredToolIds || []),
          JSON.stringify(tut.sections || []),
        ]
      );
    }

    // 6. Seed Workflows
    for (const wf of workflowsData) {
      await executeQuery(
        `INSERT INTO workflows (id, slug, title, description, outcome, difficulty, estimated_time, tools_involved, phases)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           phases = EXCLUDED.phases,
           updated_at = CURRENT_TIMESTAMP`,
        [
          wf.id,
          wf.slug,
          wf.title,
          wf.summary,
          wf.targetAudience,
          wf.difficulty,
          wf.estimatedTime,
          JSON.stringify(wf.steps?.[0]?.recommendedToolIds || []),
          JSON.stringify(wf.steps || []),
        ]
      );
    }

    // 7. Seed Comparisons
    for (const comp of comparisonsData) {
      await executeQuery(
        `INSERT INTO comparisons (id, slug, title, category, tool_a_id, tool_b_id, summary_verdict, dimensions, scenario_verdicts)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET
           summary_verdict = EXCLUDED.summary_verdict,
           dimensions = EXCLUDED.dimensions,
           scenario_verdicts = EXCLUDED.scenario_verdicts,
           updated_at = CURRENT_TIMESTAMP`,
        [
          comp.id,
          comp.slug,
          `${comp.toolAId} vs ${comp.toolBId}`,
          comp.category,
          comp.toolAId,
          comp.toolBId,
          comp.summaryVerdict,
          JSON.stringify(comp.featureMatrix || []),
          JSON.stringify(comp.verdictByScenario || []),
        ]
      );
    }

    // 8. Seed Resources
    for (const res of resourcesData) {
      await executeQuery(
        `INSERT INTO resources (id, title, description, category, file_type, download_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           description = EXCLUDED.description`,
        [res.id, res.title, res.description, res.category, res.format, res.downloadOrActionUrl]
      );
    }

    // 9. Seed Blogs
    for (const blog of blogsData) {
      await executeQuery(
        `INSERT INTO blogs (
           id, slug, title, excerpt, content_markdown, cover_image_url,
           author_name, author_role, author_avatar_url, published_at, updated_at,
           category, tags, reading_time, status, related_tool_ids, related_prompt_ids,
           related_tutorial_ids, related_workflow_ids, related_video_ids, source_urls
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           excerpt = EXCLUDED.excerpt,
           content_markdown = EXCLUDED.content_markdown,
           updated_at = CURRENT_TIMESTAMP`,
        [
          blog.id,
          blog.slug,
          blog.title,
          blog.excerpt,
          blog.contentMarkdown,
          blog.coverImageUrl || '',
          blog.author.name,
          blog.author.role,
          blog.author.avatarUrl || '',
          blog.publishedAt,
          blog.updatedAt,
          blog.category,
          JSON.stringify(blog.tags),
          blog.readingTime,
          blog.status,
          JSON.stringify(blog.relatedToolIds || []),
          JSON.stringify(blog.relatedPromptIds || []),
          JSON.stringify(blog.relatedTutorialIds || []),
          JSON.stringify(blog.relatedWorkflowIds || []),
          JSON.stringify(blog.relatedVideoIds || []),
          JSON.stringify(blog.sourceUrls || []),
        ]
      );
    }

    // 10. Seed Videos
    for (const vid of videosData) {
      await executeQuery(
        `INSERT INTO videos (
           id, slug, title, description, platform, video_url, embed_url, thumbnail_url,
           duration, creator_name, creator_channel_url, creator_avatar_url, published_at,
           category, tags, status, related_tool_ids, related_prompt_ids, related_tutorial_ids,
           related_workflow_ids, related_blog_ids, source_url
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           description = EXCLUDED.description,
           status = EXCLUDED.status`,
        [
          vid.id,
          vid.slug,
          vid.title,
          vid.description,
          vid.platform,
          vid.videoUrl,
          vid.embedUrl,
          vid.thumbnailUrl,
          vid.duration,
          vid.creator.name,
          vid.creator.channelUrl,
          vid.creator.avatarUrl || '',
          vid.publishedAt,
          vid.category,
          JSON.stringify(vid.tags),
          vid.status,
          JSON.stringify(vid.relatedToolIds || []),
          JSON.stringify(vid.relatedPromptIds || []),
          JSON.stringify(vid.relatedTutorialIds || []),
          JSON.stringify(vid.relatedWorkflowIds || []),
          JSON.stringify(vid.relatedBlogIds || []),
          vid.sourceUrl,
        ]
      );
    }

    return {
      success: true,
      message: 'PostgreSQL database seeded successfully across all 10 entity domains.',
    };
  } catch (err: any) {
    console.error('[PostgreSQL Seeding Error]:', err);
    return {
      success: false,
      message: `Database seeding encountered error: ${err.message}`,
    };
  }
}
