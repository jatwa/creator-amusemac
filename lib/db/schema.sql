-- Creator by Amusemac — Production PostgreSQL Database Schema
-- Compatible with Supabase, Neon, Vercel Postgres, and Standard PostgreSQL

-- 1. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    slug VARCHAR(128) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(64) NOT NULL,
    tool_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TOOLS
CREATE TABLE IF NOT EXISTS tools (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(128) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    tagline VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id VARCHAR(64) REFERENCES categories(id) ON DELETE SET NULL,
    category_name VARCHAR(128) NOT NULL,
    pricing_model VARCHAR(64) NOT NULL,
    pricing_summary VARCHAR(255) NOT NULL,
    starting_price VARCHAR(64) NOT NULL,
    website_url VARCHAR(512) NOT NULL,
    logo_url VARCHAR(512),
    rating NUMERIC(3, 2) DEFAULT 5.00,
    review_count INTEGER DEFAULT 0,
    features JSONB DEFAULT '[]'::jsonb,
    pros JSONB DEFAULT '[]'::jsonb,
    cons JSONB DEFAULT '[]'::jsonb,
    best_for JSONB DEFAULT '[]'::jsonb,
    platforms JSONB DEFAULT '[]'::jsonb,
    capabilities JSONB DEFAULT '[]'::jsonb,
    verified_at VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TOOL PRICING TIERS
CREATE TABLE IF NOT EXISTS tool_pricing (
    id VARCHAR(64) PRIMARY KEY,
    tool_id VARCHAR(64) NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
    tier_name VARCHAR(128) NOT NULL,
    price VARCHAR(64) NOT NULL,
    period VARCHAR(64) NOT NULL,
    credits_or_generation VARCHAR(255),
    features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. PROMPTS
CREATE TABLE IF NOT EXISTS prompts (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(128) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(128) NOT NULL,
    prompt_text TEXT NOT NULL,
    target_tool VARCHAR(128) NOT NULL,
    aspect_ratio VARCHAR(32) NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    variables JSONB DEFAULT '[]'::jsonb,
    creator_credit VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TUTORIALS
CREATE TABLE IF NOT EXISTS tutorials (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(128) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(128) NOT NULL,
    difficulty VARCHAR(64) NOT NULL,
    duration VARCHAR(64) NOT NULL,
    tools_used JSONB DEFAULT '[]'::jsonb,
    steps JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. WORKFLOWS
CREATE TABLE IF NOT EXISTS workflows (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(128) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    outcome VARCHAR(255) NOT NULL,
    difficulty VARCHAR(64) NOT NULL,
    estimated_time VARCHAR(64) NOT NULL,
    tools_involved JSONB DEFAULT '[]'::jsonb,
    phases JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. COMPARISONS
CREATE TABLE IF NOT EXISTS comparisons (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(128) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(128) NOT NULL,
    tool_a_id VARCHAR(64) REFERENCES tools(id) ON DELETE CASCADE,
    tool_b_id VARCHAR(64) REFERENCES tools(id) ON DELETE CASCADE,
    summary_verdict TEXT NOT NULL,
    dimensions JSONB DEFAULT '[]'::jsonb,
    scenario_verdicts JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. RESOURCES
CREATE TABLE IF NOT EXISTS resources (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(128) NOT NULL,
    file_type VARCHAR(64) NOT NULL,
    download_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. BLOGS
CREATE TABLE IF NOT EXISTS blogs (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(128) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    content_markdown TEXT NOT NULL,
    cover_image_url VARCHAR(512) NOT NULL,
    author_name VARCHAR(128) NOT NULL,
    author_role VARCHAR(128) NOT NULL,
    author_avatar_url VARCHAR(512) NOT NULL,
    published_at VARCHAR(64) NOT NULL,
    updated_at VARCHAR(64) NOT NULL,
    category VARCHAR(128) NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    reading_time VARCHAR(64) NOT NULL,
    status VARCHAR(32) DEFAULT 'published',
    related_tool_ids JSONB DEFAULT '[]'::jsonb,
    related_prompt_ids JSONB DEFAULT '[]'::jsonb,
    related_tutorial_ids JSONB DEFAULT '[]'::jsonb,
    related_workflow_ids JSONB DEFAULT '[]'::jsonb,
    related_video_ids JSONB DEFAULT '[]'::jsonb,
    source_urls JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. VIDEOS
CREATE TABLE IF NOT EXISTS videos (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(128) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    platform VARCHAR(64) NOT NULL,
    video_url VARCHAR(512) NOT NULL,
    embed_url VARCHAR(512) NOT NULL,
    thumbnail_url VARCHAR(512) NOT NULL,
    duration VARCHAR(64) NOT NULL,
    creator_name VARCHAR(128) NOT NULL,
    creator_channel_url VARCHAR(512) NOT NULL,
    creator_avatar_url VARCHAR(512) NOT NULL,
    published_at VARCHAR(64) NOT NULL,
    category VARCHAR(128) NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(32) DEFAULT 'published',
    related_tool_ids JSONB DEFAULT '[]'::jsonb,
    related_prompt_ids JSONB DEFAULT '[]'::jsonb,
    related_tutorial_ids JSONB DEFAULT '[]'::jsonb,
    related_workflow_ids JSONB DEFAULT '[]'::jsonb,
    related_blog_ids JSONB DEFAULT '[]'::jsonb,
    source_url VARCHAR(512) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. SOURCES
CREATE TABLE IF NOT EXISTS sources (
    id VARCHAR(64) PRIMARY KEY,
    url VARCHAR(512) NOT NULL,
    source_type VARCHAR(64) NOT NULL,
    publisher VARCHAR(128) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    last_fetched_at VARCHAR(64) NOT NULL,
    last_verified_at VARCHAR(64) NOT NULL,
    reliability_score NUMERIC(3, 2) DEFAULT 1.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. UPDATE EVENTS
CREATE TABLE IF NOT EXISTS update_events (
    id VARCHAR(64) PRIMARY KEY,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    entity_name VARCHAR(128) NOT NULL,
    field VARCHAR(128) NOT NULL,
    old_value JSONB,
    new_value JSONB,
    source_url VARCHAR(512) NOT NULL,
    source_type VARCHAR(64) NOT NULL,
    confidence NUMERIC(3, 2) NOT NULL,
    risk VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL,
    detected_at VARCHAR(64) NOT NULL,
    reviewed_at VARCHAR(64),
    reviewer VARCHAR(128),
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. VERIFICATION LOGS
CREATE TABLE IF NOT EXISTS verification_logs (
    id VARCHAR(64) PRIMARY KEY,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    source_id VARCHAR(64) REFERENCES sources(id) ON DELETE SET NULL,
    status VARCHAR(32) NOT NULL,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    response_code INTEGER,
    response_time_ms INTEGER,
    details JSONB DEFAULT '{}'::jsonb
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category_id);
CREATE INDEX IF NOT EXISTS idx_prompts_slug ON prompts(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_videos_slug ON videos(slug);
CREATE INDEX IF NOT EXISTS idx_update_events_status ON update_events(status);
CREATE INDEX IF NOT EXISTS idx_update_events_risk ON update_events(risk);
CREATE INDEX IF NOT EXISTS idx_sources_entity ON sources(entity_type, entity_id);
