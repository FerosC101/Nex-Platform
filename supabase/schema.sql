-- =====================================================================
-- NEX COMMUNITY PLATFORM - COMPLETE CONSOLIDATED POSTGRESQL SCHEMA
-- Ready for Supabase SQL Editor or Direct psql import
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. EXTENSIONS & PREREQUISITES
-- ---------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE SCHEMA IF NOT EXISTS auth;

-- ---------------------------------------------------------------------
-- 1. ENUM TYPES
-- ---------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('STUDENT', 'MODERATOR', 'ADMINISTRATOR');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE post_type AS ENUM (
        'DISCUSSION',
        'QUESTION',
        'PROJECT',
        'COLLABORATION',
        'OPPORTUNITY',
        'ANNOUNCEMENT'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE reaction_type AS ENUM ('UPVOTE', 'LIKE', 'HEART', 'CELEBRATE', 'ROCKET');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE project_status AS ENUM (
        'IDEA',
        'PLANNING',
        'PROTOTYPE',
        'DEVELOPMENT',
        'COMPLETED',
        'ARCHIVED'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE request_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE collaboration_status AS ENUM ('OPEN', 'CLOSED', 'FILLED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE tester_request_status AS ENUM ('OPEN', 'CLOSED', 'COMPLETED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE tester_signup_status AS ENUM ('PENDING', 'ACCEPTED', 'COMPLETED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE opportunity_category AS ENUM (
        'HACKATHON',
        'IDEATHON',
        'COMPETITION',
        'INTERNSHIP',
        'SCHOLARSHIP',
        'FELLOWSHIP',
        'WORKSHOP',
        'CONFERENCE',
        'STARTUP'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE event_registration_status AS ENUM ('REGISTERED', 'ATTENDED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM (
        'COMMENT_REPLY',
        'PROJECT_REQUEST',
        'COLLAB_REQUEST',
        'COLLAB_APPLICATION',
        'EVENT_REMINDER',
        'OPPORTUNITY_DEADLINE',
        'ANNOUNCEMENT',
        'MODERATOR_ACTION'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE report_target_type AS ENUM ('POST', 'COMMENT', 'PROJECT', 'USER', 'COLLAB_REQUEST');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE report_reason AS ENUM (
        'SPAM',
        'HARASSMENT',
        'SCAM',
        'INAPPROPRIATE_CONTENT',
        'MISLEADING_CONTENT',
        'OTHER'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('PENDING', 'REVIEWED', 'DISMISSED', 'ACTION_TAKEN');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------
-- 2. HELPER FUNCTIONS
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------
-- 3. NORMALIZED LOOKUP / TAXONOMY TABLES
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    short_name VARCHAR(50),
    slug VARCHAR(100) NOT NULL UNIQUE,
    domain VARCHAR(255),
    logo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.post_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    post_type post_type NOT NULL DEFAULT 'DISCUSSION',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 4. PROFILES & TAXONOMY JUNCTION TABLES
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
    course VARCHAR(150),
    year_level SMALLINT CHECK (year_level IS NULL OR (year_level >= 1 AND year_level <= 6)),
    bio TEXT,
    avatar_url TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    role user_role NOT NULL DEFAULT 'STUDENT',
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT valid_username CHECK (username ~* '^[a-zA-Z0-9_]{3,30}$')
);

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS public.profile_skills (
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (profile_id, skill_id)
);

CREATE TABLE IF NOT EXISTS public.profile_interests (
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    interest_id UUID NOT NULL REFERENCES public.interests(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (profile_id, interest_id)
);

-- ---------------------------------------------------------------------
-- 5. COMMUNITY POSTS, TAGS, COMMENTS & REACTIONS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.post_categories(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    post_type post_type NOT NULL DEFAULT 'DISCUSSION',
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    view_count INTEGER NOT NULL DEFAULT 0 CHECK (view_count >= 0),
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(content, '')), 'B')
    ) STORED,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS public.post_tags (
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (post_id, skill_id)
);

CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT check_no_self_parent CHECK (parent_id IS NULL OR parent_id <> id)
);

CREATE TRIGGER trg_comments_updated_at
BEFORE UPDATE ON public.comments
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS public.post_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction_type reaction_type NOT NULL DEFAULT 'UPVOTE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (post_id, user_id, reaction_type)
);

CREATE TABLE IF NOT EXISTS public.comment_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction_type reaction_type NOT NULL DEFAULT 'UPVOTE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (comment_id, user_id, reaction_type)
);

-- ---------------------------------------------------------------------
-- 6. PROJECTS & COLLABORATIONS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(160) NOT NULL UNIQUE,
    tagline VARCHAR(255),
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    status project_status NOT NULL DEFAULT 'IDEA',
    repository_url TEXT,
    demo_url TEXT,
    cover_image_url TEXT,
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(tagline, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(description, '')), 'C')
    ) STORED,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS public.project_skills (
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (project_id, skill_id)
);

CREATE TABLE IF NOT EXISTS public.project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'MEMBER',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (project_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.project_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT,
    status request_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (project_id, user_id, status)
);

CREATE TRIGGER trg_project_requests_updated_at
BEFORE UPDATE ON public.project_requests
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS public.collaboration_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    role_title VARCHAR(100),
    status collaboration_status NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_collab_requests_updated_at
BEFORE UPDATE ON public.collaboration_requests
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS public.collaboration_request_skills (
    request_id UUID NOT NULL REFERENCES public.collaboration_requests(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (request_id, skill_id)
);

CREATE TABLE IF NOT EXISTS public.collaboration_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.collaboration_requests(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    status application_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (request_id, applicant_id)
);

CREATE TRIGGER trg_collab_applications_updated_at
BEFORE UPDATE ON public.collaboration_applications
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------
-- 7. BETA TESTER EXCHANGE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tester_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    number_needed INTEGER NOT NULL CHECK (number_needed > 0),
    estimated_time VARCHAR(50) NOT NULL,
    testing_url TEXT,
    deadline TIMESTAMPTZ,
    status tester_request_status NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_tester_requests_updated_at
BEFORE UPDATE ON public.tester_requests
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS public.tester_signups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tester_request_id UUID NOT NULL REFERENCES public.tester_requests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status tester_signup_status NOT NULL DEFAULT 'PENDING',
    feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (tester_request_id, user_id)
);

CREATE TRIGGER trg_tester_signups_updated_at
BEFORE UPDATE ON public.tester_signups
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------
-- 8. OPPORTUNITIES HUB
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    organizer VARCHAR(150) NOT NULL,
    organizer_logo_url TEXT,
    category opportunity_category NOT NULL DEFAULT 'HACKATHON',
    location TEXT,
    is_online BOOLEAN NOT NULL DEFAULT FALSE,
    deadline TIMESTAMPTZ,
    eligibility TEXT,
    application_url TEXT NOT NULL,
    banner_url TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(organizer, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(description, '')), 'C')
    ) STORED,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_opportunities_updated_at
BEFORE UPDATE ON public.opportunities
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS public.saved_opportunities (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, opportunity_id)
);

-- ---------------------------------------------------------------------
-- 9. EVENTS SYSTEM
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    is_online BOOLEAN NOT NULL DEFAULT FALSE,
    meeting_link TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    capacity INTEGER CHECK (capacity IS NULL OR capacity > 0),
    registration_deadline TIMESTAMPTZ,
    image_url TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(description, '')), 'B')
    ) STORED,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT valid_event_dates CHECK (end_date >= start_date)
);

CREATE TRIGGER trg_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status event_registration_status NOT NULL DEFAULT 'REGISTERED',
    registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (event_id, user_id)
);

CREATE TRIGGER trg_event_registrations_updated_at
BEFORE UPDATE ON public.event_registrations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------
-- 10. NOTIFICATION SYSTEM
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    reference_id UUID,
    reference_type VARCHAR(50),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 11. MODERATION & REPORTS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    target_type report_target_type NOT NULL,
    target_id UUID NOT NULL,
    reason report_reason NOT NULL,
    description TEXT,
    status report_status NOT NULL DEFAULT 'PENDING',
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    moderator_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_reports_updated_at
BEFORE UPDATE ON public.reports
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------
-- 12. TECHNICAL RESOURCES
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    category VARCHAR(100),
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 13. INDEXES
-- ---------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username_lower ON public.profiles(LOWER(username));
CREATE INDEX IF NOT EXISTS idx_profiles_school_id ON public.profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON public.posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_type_created ON public.posts(post_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_search ON public.posts USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_comments_post_created ON public.comments(post_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_post_reactions_post ON public.post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_comment_reactions_comment ON public.comment_reactions(comment_id);

CREATE INDEX IF NOT EXISTS idx_projects_owner ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_search ON public.projects USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_project_members_user ON public.project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_requests_proj ON public.project_requests(project_id, status);
CREATE INDEX IF NOT EXISTS idx_collab_requests_proj ON public.collaboration_requests(project_id, status);
CREATE INDEX IF NOT EXISTS idx_collab_applications_req ON public.collaboration_applications(request_id, status);

CREATE INDEX IF NOT EXISTS idx_tester_requests_proj ON public.tester_requests(project_id, status);
CREATE INDEX IF NOT EXISTS idx_tester_signups_req ON public.tester_signups(tester_request_id, status);

CREATE INDEX IF NOT EXISTS idx_opportunities_category ON public.opportunities(category);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON public.opportunities(deadline);
CREATE INDEX IF NOT EXISTS idx_opportunities_search ON public.opportunities USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_saved_opportunities_user ON public.saved_opportunities(user_id);

CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_search ON public.events USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_event_reg_event ON public.event_registrations(event_id, status);
CREATE INDEX IF NOT EXISTS idx_event_reg_user ON public.event_registrations(user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_target ON public.reports(target_type, target_id);

-- ---------------------------------------------------------------------
-- 14. AUTH SYNC TRIGGER & ROLE ACCESS CONTROL
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_moderator(lookup_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = lookup_user_id
          AND role IN ('MODERATOR', 'ADMINISTRATOR')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin(lookup_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = lookup_user_id
          AND role = 'ADMINISTRATOR'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    extracted_username TEXT;
    extracted_first_name TEXT;
    extracted_last_name TEXT;
    extracted_school_id UUID;
BEGIN
    extracted_username := COALESCE(
        NEW.raw_user_meta_data->>'username',
        SPLIT_PART(NEW.email, '@', 1) || '_' || SUBSTRING(NEW.id::text, 1, 5)
    );
    extracted_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', 'Student');
    extracted_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', 'Builder');

    BEGIN
        IF NEW.raw_user_meta_data->>'school_id' IS NOT NULL THEN
            extracted_school_id := (NEW.raw_user_meta_data->>'school_id')::UUID;
        ELSE
            extracted_school_id := NULL;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        extracted_school_id := NULL;
    END;

    INSERT INTO public.profiles (
        user_id,
        first_name,
        last_name,
        username,
        school_id,
        course,
        year_level,
        role
    )
    VALUES (
        NEW.id,
        extracted_first_name,
        extracted_last_name,
        extracted_username,
        extracted_school_id,
        NEW.raw_user_meta_data->>'course',
        (NEW.raw_user_meta_data->>'year_level')::SMALLINT,
        'STUDENT'
    )
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
        DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
        CREATE TRIGGER trg_on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;

-- ---------------------------------------------------------------------
-- 15. ANONYMOUS PRIVACY ABSTRACTION VIEW (Spec Section 10)
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW public.community_posts_view AS
SELECT
    p.id,
    p.category_id,
    p.title,
    p.content,
    p.post_type,
    p.is_anonymous,
    p.is_pinned,
    p.is_locked,
    p.view_count,
    p.created_at,
    p.updated_at,
    pc.name AS category_name,
    pc.slug AS category_slug,
    CASE
        WHEN p.is_anonymous AND (auth.uid() IS NULL OR (auth.uid() <> p.author_id AND NOT public.is_moderator(auth.uid())))
            THEN NULL
        ELSE p.author_id
    END AS author_id,
    CASE
        WHEN p.is_anonymous AND (auth.uid() IS NULL OR (auth.uid() <> p.author_id AND NOT public.is_moderator(auth.uid())))
            THEN 'Anonymous Student'
        ELSE pr.username
    END AS author_username,
    CASE
        WHEN p.is_anonymous AND (auth.uid() IS NULL OR (auth.uid() <> p.author_id AND NOT public.is_moderator(auth.uid())))
            THEN NULL
        ELSE pr.avatar_url
    END AS author_avatar_url,
    (SELECT COUNT(*) FROM public.comments c WHERE c.post_id = p.id) AS comments_count,
    (SELECT COUNT(*) FROM public.post_reactions r WHERE r.post_id = p.id AND r.reaction_type = 'UPVOTE') AS upvotes_count
FROM public.posts p
LEFT JOIN public.profiles pr ON p.author_id = pr.user_id
LEFT JOIN public.post_categories pc ON p.category_id = pc.id;

-- ---------------------------------------------------------------------
-- 16. FULL-TEXT SEARCH UNIFIED HELPER (Spec Section 17)
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.search_platform(search_term TEXT)
RETURNS TABLE (
    entity_type TEXT,
    entity_id UUID,
    title TEXT,
    snippet TEXT,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        'post'::TEXT AS entity_type,
        p.id AS entity_id,
        p.title,
        SUBSTRING(p.content, 1, 150) AS snippet,
        ts_rank(p.search_vector, plainto_tsquery('english', search_term)) AS rank
    FROM public.posts p
    WHERE p.search_vector @@ plainto_tsquery('english', search_term)

    UNION ALL

    SELECT
        'project'::TEXT AS entity_type,
        pr.id AS entity_id,
        pr.name AS title,
        COALESCE(pr.tagline, SUBSTRING(pr.description, 1, 150)) AS snippet,
        ts_rank(pr.search_vector, plainto_tsquery('english', search_term)) AS rank
    FROM public.projects pr
    WHERE pr.search_vector @@ plainto_tsquery('english', search_term)

    UNION ALL

    SELECT
        'opportunity'::TEXT AS entity_type,
        o.id AS entity_id,
        o.title,
        o.organizer || ': ' || SUBSTRING(o.description, 1, 120) AS snippet,
        ts_rank(o.search_vector, plainto_tsquery('english', search_term)) AS rank
    FROM public.opportunities o
    WHERE o.search_vector @@ plainto_tsquery('english', search_term)

    UNION ALL

    SELECT
        'event'::TEXT AS entity_type,
        e.id AS entity_id,
        e.title,
        e.location || ' - ' || SUBSTRING(e.description, 1, 120) AS snippet,
        ts_rank(e.search_vector, plainto_tsquery('english', search_term)) AS rank
    FROM public.events e
    WHERE e.search_vector @@ plainto_tsquery('english', search_term)

    ORDER BY rank DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- ---------------------------------------------------------------------
-- 17. ROW LEVEL SECURITY (RLS) POLICIES
-- ---------------------------------------------------------------------
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_request_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tester_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tester_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read schools" ON public.schools FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public read interests" ON public.interests FOR SELECT USING (true);
CREATE POLICY "Public read post_categories" ON public.post_categories FOR SELECT USING (true);
CREATE POLICY "Public read resources" ON public.resources FOR SELECT USING (true);

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Public profile_skills are viewable" ON public.profile_skills FOR SELECT USING (true);
CREATE POLICY "Users can manage own profile_skills" ON public.profile_skills FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_skills.profile_id AND user_id = auth.uid())
);

CREATE POLICY "Public profile_interests are viewable" ON public.profile_interests FOR SELECT USING (true);
CREATE POLICY "Users can manage own profile_interests" ON public.profile_interests FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_interests.profile_id AND user_id = auth.uid())
);

CREATE POLICY "Posts viewable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors and moderators can update posts" ON public.posts FOR UPDATE USING (
    auth.uid() = author_id OR public.is_moderator(auth.uid())
);
CREATE POLICY "Authors and moderators can delete posts" ON public.posts FOR DELETE USING (
    auth.uid() = author_id OR public.is_moderator(auth.uid())
);

CREATE POLICY "Public read post_tags" ON public.post_tags FOR SELECT USING (true);
CREATE POLICY "Post author can manage post_tags" ON public.post_tags FOR ALL USING (
    EXISTS (SELECT 1 FROM public.posts WHERE id = post_tags.post_id AND author_id = auth.uid())
);

CREATE POLICY "Comments viewable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors and moderators can update comments" ON public.comments FOR UPDATE USING (
    auth.uid() = author_id OR public.is_moderator(auth.uid())
);
CREATE POLICY "Authors and moderators can delete comments" ON public.comments FOR DELETE USING (
    auth.uid() = author_id OR public.is_moderator(auth.uid())
);

CREATE POLICY "Reactions viewable by everyone" ON public.post_reactions FOR SELECT USING (true);
CREATE POLICY "Users can manage own post reaction" ON public.post_reactions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Comment reactions viewable by everyone" ON public.comment_reactions FOR SELECT USING (true);
CREATE POLICY "Users can manage own comment reaction" ON public.comment_reactions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Projects viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Project owners can update projects" ON public.projects FOR UPDATE USING (
    auth.uid() = owner_id OR public.is_moderator(auth.uid())
);
CREATE POLICY "Project owners can delete projects" ON public.projects FOR DELETE USING (
    auth.uid() = owner_id OR public.is_admin(auth.uid())
);

CREATE POLICY "Project skills viewable by everyone" ON public.project_skills FOR SELECT USING (true);
CREATE POLICY "Project owners can manage skills" ON public.project_skills FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_skills.project_id AND owner_id = auth.uid())
);

CREATE POLICY "Project members viewable by everyone" ON public.project_members FOR SELECT USING (true);
CREATE POLICY "Project owners can manage members" ON public.project_members FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_members.project_id AND owner_id = auth.uid())
);

CREATE POLICY "Project requests viewable by owner or requester" ON public.project_requests FOR SELECT USING (
    auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.projects WHERE id = project_requests.project_id AND owner_id = auth.uid())
);
CREATE POLICY "Users can apply to join project" ON public.project_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Project owner can update request status" ON public.project_requests FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_requests.project_id AND owner_id = auth.uid())
);

CREATE POLICY "Collab requests viewable by everyone" ON public.collaboration_requests FOR SELECT USING (true);
CREATE POLICY "Project owners can create collab requests" ON public.collaboration_requests FOR INSERT WITH CHECK (
    auth.uid() = creator_id AND EXISTS (SELECT 1 FROM public.projects WHERE id = collaboration_requests.project_id AND owner_id = auth.uid())
);
CREATE POLICY "Project owners can update collab requests" ON public.collaboration_requests FOR UPDATE USING (
    auth.uid() = creator_id
);

CREATE POLICY "Collab request skills viewable by everyone" ON public.collaboration_request_skills FOR SELECT USING (true);
CREATE POLICY "Collab request creator can manage skills" ON public.collaboration_request_skills FOR ALL USING (
    EXISTS (SELECT 1 FROM public.collaboration_requests WHERE id = collaboration_request_skills.request_id AND creator_id = auth.uid())
);

CREATE POLICY "Collab applications viewable by applicant or request creator" ON public.collaboration_applications FOR SELECT USING (
    auth.uid() = applicant_id OR EXISTS (SELECT 1 FROM public.collaboration_requests WHERE id = collaboration_applications.request_id AND creator_id = auth.uid())
);
CREATE POLICY "Users can apply to collaboration" ON public.collaboration_applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);
CREATE POLICY "Request creator can update application status" ON public.collaboration_applications FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.collaboration_requests WHERE id = collaboration_applications.request_id AND creator_id = auth.uid())
);

CREATE POLICY "Tester requests viewable by everyone" ON public.tester_requests FOR SELECT USING (true);
CREATE POLICY "Project owners can create tester requests" ON public.tester_requests FOR INSERT WITH CHECK (
    auth.uid() = creator_id AND EXISTS (SELECT 1 FROM public.projects WHERE id = tester_requests.project_id AND owner_id = auth.uid())
);
CREATE POLICY "Project owners can update tester requests" ON public.tester_requests FOR UPDATE USING (
    auth.uid() = creator_id
);

CREATE POLICY "Tester signups viewable by creator and signup user" ON public.tester_signups FOR SELECT USING (
    auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.tester_requests WHERE id = tester_signups.tester_request_id AND creator_id = auth.uid())
);
CREATE POLICY "Users can sign up as tester" ON public.tester_signups FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Tester request owner or user can update signup" ON public.tester_signups FOR UPDATE USING (
    auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.tester_requests WHERE id = tester_signups.tester_request_id AND creator_id = auth.uid())
);

CREATE POLICY "Opportunities viewable by everyone" ON public.opportunities FOR SELECT USING (true);
CREATE POLICY "Moderators can manage opportunities" ON public.opportunities FOR ALL USING (
    public.is_moderator(auth.uid())
);

CREATE POLICY "Users can view and manage own saved opportunities" ON public.saved_opportunities FOR ALL USING (
    auth.uid() = user_id
);

CREATE POLICY "Events viewable by everyone" ON public.events FOR SELECT USING (true);
CREATE POLICY "Moderators can manage events" ON public.events FOR ALL USING (
    public.is_moderator(auth.uid())
);

CREATE POLICY "Users can view own event registrations and organizers can view" ON public.event_registrations FOR SELECT USING (
    auth.uid() = user_id OR public.is_moderator(auth.uid())
);
CREATE POLICY "Users can register for events" ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own registration" ON public.event_registrations FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view and update own notifications" ON public.notifications FOR ALL USING (
    auth.uid() = user_id
);

CREATE POLICY "Reporters can view own reports, moderators view all" ON public.reports FOR SELECT USING (
    auth.uid() = reporter_id OR public.is_moderator(auth.uid())
);
CREATE POLICY "Authenticated users can submit reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Moderators can update reports" ON public.reports FOR UPDATE USING (
    public.is_moderator(auth.uid())
);
