import { queryNeon } from "./neon";

/**
 * Initialize all tables required for Creator Intel Phase 2:
 * - festivals (Standing identity & prestige tier)
 * - festival_editions (Year-specific deadlines, fees, rules)
 * - people (Filmmakers, DPs, AI Artists)
 * - films (Film Registry & Festival Circuit history)
 * - research_records (Methodology, sources, verification ledger)
 * - journal_articles (Editorial CMS & cinema dispatches)
 * - film_projects (User production workflow & scene breakdowns)
 * - project_submissions (Festival application tracking & premiere sequence)
 */
export async function initFilmIntelligenceTables(): Promise<boolean> {
  const schemaSql = `
    -- 1. STANDING FILM FESTIVALS
    CREATE TABLE IF NOT EXISTS festivals (
        id VARCHAR(64) PRIMARY KEY,
        slug VARCHAR(128) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        acronym VARCHAR(32),
        founded_year INTEGER NOT NULL,
        host_city VARCHAR(128) NOT NULL,
        host_country VARCHAR(128) NOT NULL,
        region VARCHAR(64) NOT NULL,
        prestige_tier VARCHAR(64) NOT NULL,
        academy_award_qualifying BOOLEAN DEFAULT FALSE,
        bafta_qualifying BOOLEAN DEFAULT FALSE,
        fiapf_accredited BOOLEAN DEFAULT FALSE,
        focus_categories JSONB DEFAULT '[]'::jsonb,
        official_website VARCHAR(512) NOT NULL,
        submission_portals JSONB DEFAULT '[]'::jsonb,
        description TEXT NOT NULL,
        editorial_notes TEXT,
        status VARCHAR(32) DEFAULT 'ACTIVE',
        verified_at VARCHAR(64) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. FESTIVAL EDITIONS
    CREATE TABLE IF NOT EXISTS festival_editions (
        id VARCHAR(64) PRIMARY KEY,
        festival_id VARCHAR(64) NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
        edition_number INTEGER,
        year INTEGER NOT NULL,
        season VARCHAR(32) NOT NULL,
        event_start_date VARCHAR(64) NOT NULL,
        event_end_date VARCHAR(64) NOT NULL,
        deadlines JSONB NOT NULL DEFAULT '{}'::jsonb,
        fees JSONB NOT NULL DEFAULT '[]'::jsonb,
        premiere_rules JSONB NOT NULL DEFAULT '[]'::jsonb,
        accepted_formats JSONB NOT NULL DEFAULT '[]'::jsonb,
        ai_disclosure_policy JSONB NOT NULL DEFAULT '{}'::jsonb,
        verified_sources JSONB NOT NULL DEFAULT '[]'::jsonb,
        status VARCHAR(32) DEFAULT 'UPCOMING',
        last_verified_at VARCHAR(64) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unq_festival_year UNIQUE(festival_id, year)
    );

    -- 3. PEOPLE & FILMMAKER REGISTRY
    CREATE TABLE IF NOT EXISTS people (
        id VARCHAR(64) PRIMARY KEY,
        slug VARCHAR(128) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        alternate_names JSONB DEFAULT '[]'::jsonb,
        primary_role VARCHAR(64) NOT NULL,
        secondary_roles JSONB DEFAULT '[]'::jsonb,
        biography TEXT NOT NULL,
        country VARCHAR(128) NOT NULL,
        avatar_url VARCHAR(512),
        filmography JSONB DEFAULT '[]'::jsonb,
        festival_accolades JSONB DEFAULT '[]'::jsonb,
        social_links JSONB DEFAULT '{}'::jsonb,
        verified_at VARCHAR(64) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 4. FILM REGISTRY
    CREATE TABLE IF NOT EXISTS films (
        id VARCHAR(64) PRIMARY KEY,
        slug VARCHAR(128) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        original_title VARCHAR(255),
        release_year INTEGER NOT NULL,
        runtime_minutes INTEGER NOT NULL,
        country_of_origin JSONB DEFAULT '[]'::jsonb,
        language JSONB DEFAULT '[]'::jsonb,
        format VARCHAR(64) NOT NULL,
        genres JSONB DEFAULT '[]'::jsonb,
        logline TEXT NOT NULL,
        synopsis TEXT NOT NULL,
        poster_url VARCHAR(512),
        trailer_url VARCHAR(512),
        directors JSONB DEFAULT '[]'::jsonb,
        cinematographers JSONB DEFAULT '[]'::jsonb,
        writers JSONB DEFAULT '[]'::jsonb,
        producers JSONB DEFAULT '[]'::jsonb,
        cast_crew JSONB DEFAULT '[]'::jsonb,
        ai_vfx_credits JSONB DEFAULT '[]'::jsonb,
        premiere_status VARCHAR(64) NOT NULL,
        premiere_festival_id VARCHAR(64) REFERENCES festivals(id) ON DELETE SET NULL,
        premiere_edition_id VARCHAR(64) REFERENCES festival_editions(id) ON DELETE SET NULL,
        festival_history JSONB DEFAULT '[]'::jsonb,
        technical_specs JSONB DEFAULT '{}'::jsonb,
        streaming_links JSONB DEFAULT '[]'::jsonb,
        verified_at VARCHAR(64) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 5. RESEARCH RECORDS
    CREATE TABLE IF NOT EXISTS research_records (
        id VARCHAR(64) PRIMARY KEY,
        slug VARCHAR(128) UNIQUE NOT NULL,
        topic VARCHAR(255) NOT NULL,
        entity_type VARCHAR(64) NOT NULL,
        entity_id VARCHAR(64),
        research_question TEXT NOT NULL,
        findings_summary TEXT NOT NULL,
        methodology TEXT NOT NULL,
        statements JSONB DEFAULT '[]'::jsonb,
        sources JSONB DEFAULT '[]'::jsonb,
        confidence_level VARCHAR(32) NOT NULL,
        verification_status VARCHAR(32) NOT NULL,
        verified_by VARCHAR(128) NOT NULL,
        verified_date VARCHAR(64) NOT NULL,
        next_review_date VARCHAR(64) NOT NULL,
        change_log JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 6. JOURNAL ARTICLES
    CREATE TABLE IF NOT EXISTS journal_articles (
        id VARCHAR(64) PRIMARY KEY,
        slug VARCHAR(128) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        excerpt TEXT NOT NULL,
        category VARCHAR(64) NOT NULL,
        subcategory VARCHAR(128) NOT NULL,
        cover_image VARCHAR(512) NOT NULL,
        cover_image_caption TEXT,
        author JSONB NOT NULL DEFAULT '{}'::jsonb,
        reading_time VARCHAR(64) NOT NULL,
        publication_date VARCHAR(64) NOT NULL,
        updated_date VARCHAR(64) NOT NULL,
        status VARCHAR(32) DEFAULT 'PUBLISHED',
        featured BOOLEAN DEFAULT FALSE,
        source_ledger JSONB DEFAULT '[]'::jsonb,
        primary_research_record_id VARCHAR(64) REFERENCES research_records(id) ON DELETE SET NULL,
        related_film_ids JSONB DEFAULT '[]'::jsonb,
        related_people_ids JSONB DEFAULT '[]'::jsonb,
        related_festival_ids JSONB DEFAULT '[]'::jsonb,
        related_project_ids JSONB DEFAULT '[]'::jsonb,
        related_technique_ids JSONB DEFAULT '[]'::jsonb,
        related_tool_ids JSONB DEFAULT '[]'::jsonb,
        related_prompt_ids JSONB DEFAULT '[]'::jsonb,
        content_markdown TEXT NOT NULL,
        seo_metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 7. FILM PROJECTS
    CREATE TABLE IF NOT EXISTS film_projects (
        id VARCHAR(64) PRIMARY KEY,
        slug VARCHAR(128) UNIQUE NOT NULL,
        user_id VARCHAR(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        logline TEXT NOT NULL,
        synopsis TEXT NOT NULL,
        format VARCHAR(64) NOT NULL,
        genres JSONB DEFAULT '[]'::jsonb,
        current_stage VARCHAR(64) NOT NULL,
        director_name VARCHAR(128) NOT NULL,
        target_premiere_window VARCHAR(128),
        target_premiere_type VARCHAR(64),
        scene_breakdowns JSONB DEFAULT '[]'::jsonb,
        post_production_stages JSONB DEFAULT '[]'::jsonb,
        festival_checklist JSONB DEFAULT '[]'::jsonb,
        attached_research_ids JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 8. PROJECT FESTIVAL SUBMISSIONS
    CREATE TABLE IF NOT EXISTS project_submissions (
        id VARCHAR(64) PRIMARY KEY,
        project_id VARCHAR(64) NOT NULL REFERENCES film_projects(id) ON DELETE CASCADE,
        festival_id VARCHAR(64) NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
        edition_id VARCHAR(64) NOT NULL REFERENCES festival_editions(id) ON DELETE CASCADE,
        film_title VARCHAR(255) NOT NULL,
        category VARCHAR(128) NOT NULL,
        deadline_tier VARCHAR(64) NOT NULL,
        submission_date VARCHAR(64) NOT NULL,
        fee_paid JSONB DEFAULT '{"amount": 0, "currency": "USD"}'::jsonb,
        platform VARCHAR(64) NOT NULL,
        tracking_number VARCHAR(128),
        premiere_status_claimed VARCHAR(64) NOT NULL,
        status VARCHAR(32) DEFAULT 'SUBMITTED',
        notification_date VARCHAR(64) NOT NULL,
        screening_date VARCHAR(64),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- INDEXES
    CREATE INDEX IF NOT EXISTS idx_festivals_slug ON festivals(slug);
    CREATE INDEX IF NOT EXISTS idx_festivals_tier ON festivals(prestige_tier);
    CREATE INDEX IF NOT EXISTS idx_festivals_region ON festivals(region);
    CREATE INDEX IF NOT EXISTS idx_festival_editions_festival_id ON festival_editions(festival_id);
    CREATE INDEX IF NOT EXISTS idx_festival_editions_year ON festival_editions(year);
    CREATE INDEX IF NOT EXISTS idx_people_slug ON people(slug);
    CREATE INDEX IF NOT EXISTS idx_people_role ON people(primary_role);
    CREATE INDEX IF NOT EXISTS idx_films_slug ON films(slug);
    CREATE INDEX IF NOT EXISTS idx_films_year ON films(release_year);
    CREATE INDEX IF NOT EXISTS idx_films_premiere_status ON films(premiere_status);
    CREATE INDEX IF NOT EXISTS idx_research_records_slug ON research_records(slug);
    CREATE INDEX IF NOT EXISTS idx_research_records_entity ON research_records(entity_type, entity_id);
    CREATE INDEX IF NOT EXISTS idx_journal_articles_slug ON journal_articles(slug);
    CREATE INDEX IF NOT EXISTS idx_journal_articles_category ON journal_articles(category);
    CREATE INDEX IF NOT EXISTS idx_journal_articles_status ON journal_articles(status);
    CREATE INDEX IF NOT EXISTS idx_film_projects_user_id ON film_projects(user_id);
    CREATE INDEX IF NOT EXISTS idx_project_submissions_project_id ON project_submissions(project_id);
    CREATE INDEX IF NOT EXISTS idx_project_submissions_festival_id ON project_submissions(festival_id);
  `;

  const res = await queryNeon(schemaSql);
  return res !== null;
}
