/**
 * Nex Community Platform - Supabase Database Types
 * Generated and typed against the normalized PostgreSQL schema.
 * Corresponds to: supabase/schema.sql & Nex-Community-Platform-Technical-Spec.pdf
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'STUDENT' | 'MODERATOR' | 'ADMINISTRATOR';

export type PostType =
  | 'DISCUSSION'
  | 'QUESTION'
  | 'PROJECT'
  | 'COLLABORATION'
  | 'OPPORTUNITY'
  | 'ANNOUNCEMENT';

export type ReactionType = 'UPVOTE' | 'LIKE' | 'HEART' | 'CELEBRATE' | 'ROCKET';

export type ProjectStatus =
  | 'IDEA'
  | 'PLANNING'
  | 'PROTOTYPE'
  | 'DEVELOPMENT'
  | 'COMPLETED'
  | 'ARCHIVED';

export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export type CollaborationStatus = 'OPEN' | 'CLOSED' | 'FILLED';

export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export type TesterRequestStatus = 'OPEN' | 'CLOSED' | 'COMPLETED';

export type TesterSignupStatus = 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'REJECTED';

export type OpportunityCategory =
  | 'HACKATHON'
  | 'IDEATHON'
  | 'COMPETITION'
  | 'INTERNSHIP'
  | 'SCHOLARSHIP'
  | 'FELLOWSHIP'
  | 'WORKSHOP'
  | 'CONFERENCE'
  | 'STARTUP';

export type EventRegistrationStatus = 'REGISTERED' | 'ATTENDED' | 'CANCELLED';

export type NotificationType =
  | 'COMMENT_REPLY'
  | 'PROJECT_REQUEST'
  | 'COLLAB_REQUEST'
  | 'COLLAB_APPLICATION'
  | 'EVENT_REMINDER'
  | 'OPPORTUNITY_DEADLINE'
  | 'ANNOUNCEMENT'
  | 'MODERATOR_ACTION';

export type ReportTargetType = 'POST' | 'COMMENT' | 'PROJECT' | 'USER' | 'COLLAB_REQUEST';

export type ReportReason =
  | 'SPAM'
  | 'HARASSMENT'
  | 'SCAM'
  | 'INAPPROPRIATE_CONTENT'
  | 'MISLEADING_CONTENT'
  | 'OTHER';

export type ReportStatus = 'PENDING' | 'REVIEWED' | 'DISMISSED' | 'ACTION_TAKEN';

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string;
          name: string;
          short_name: string | null;
          slug: string;
          domain: string | null;
          logo_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          short_name?: string | null;
          slug: string;
          domain?: string | null;
          logo_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          short_name?: string | null;
          slug?: string;
          domain?: string | null;
          logo_url?: string | null;
          created_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          name: string;
          slug: string;
          category: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          category?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          category?: string | null;
          created_at?: string;
        };
      };
      interests: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
      };
      post_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          post_type: PostType;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          post_type?: PostType;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          post_type?: PostType;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          last_name: string;
          username: string;
          school_id: string | null;
          course: string | null;
          year_level: number | null;
          bio: string | null;
          avatar_url: string | null;
          github_url: string | null;
          linkedin_url: string | null;
          portfolio_url: string | null;
          role: UserRole;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          first_name: string;
          last_name: string;
          username: string;
          school_id?: string | null;
          course?: string | null;
          year_level?: number | null;
          bio?: string | null;
          avatar_url?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          portfolio_url?: string | null;
          role?: UserRole;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          first_name?: string;
          last_name?: string;
          username?: string;
          school_id?: string | null;
          course?: string | null;
          year_level?: number | null;
          bio?: string | null;
          avatar_url?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          portfolio_url?: string | null;
          role?: UserRole;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      profile_skills: {
        Row: {
          profile_id: string;
          skill_id: string;
          created_at: string;
        };
        Insert: {
          profile_id: string;
          skill_id: string;
          created_at?: string;
        };
        Update: {
          profile_id?: string;
          skill_id?: string;
          created_at?: string;
        };
      };
      profile_interests: {
        Row: {
          profile_id: string;
          interest_id: string;
          created_at: string;
        };
        Insert: {
          profile_id: string;
          interest_id: string;
          created_at?: string;
        };
        Update: {
          profile_id?: string;
          interest_id?: string;
          created_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          author_id: string;
          category_id: string | null;
          title: string;
          content: string;
          post_type: PostType;
          is_anonymous: boolean;
          is_pinned: boolean;
          is_locked: boolean;
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          category_id?: string | null;
          title: string;
          content: string;
          post_type?: PostType;
          is_anonymous?: boolean;
          is_pinned?: boolean;
          is_locked?: boolean;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string;
          category_id?: string | null;
          title?: string;
          content?: string;
          post_type?: PostType;
          is_anonymous?: boolean;
          is_pinned?: boolean;
          is_locked?: boolean;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      post_tags: {
        Row: {
          post_id: string;
          skill_id: string;
          created_at: string;
        };
        Insert: {
          post_id: string;
          skill_id: string;
          created_at?: string;
        };
        Update: {
          post_id?: string;
          skill_id?: string;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          parent_id: string | null;
          content: string;
          is_anonymous: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_id: string;
          parent_id?: string | null;
          content: string;
          is_anonymous?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          author_id?: string;
          parent_id?: string | null;
          content?: string;
          is_anonymous?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      post_reactions: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          reaction_type: ReactionType;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          reaction_type?: ReactionType;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          reaction_type?: ReactionType;
          created_at?: string;
        };
      };
      comment_reactions: {
        Row: {
          id: string;
          comment_id: string;
          user_id: string;
          reaction_type: ReactionType;
          created_at: string;
        };
        Insert: {
          id?: string;
          comment_id: string;
          user_id: string;
          reaction_type?: ReactionType;
          created_at?: string;
        };
        Update: {
          id?: string;
          comment_id?: string;
          user_id?: string;
          reaction_type?: ReactionType;
          created_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          slug: string;
          tagline: string | null;
          description: string;
          category: string;
          status: ProjectStatus;
          repository_url: string | null;
          demo_url: string | null;
          cover_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          slug: string;
          tagline?: string | null;
          description: string;
          category: string;
          status?: ProjectStatus;
          repository_url?: string | null;
          demo_url?: string | null;
          cover_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          slug?: string;
          tagline?: string | null;
          description?: string;
          category?: string;
          status?: ProjectStatus;
          repository_url?: string | null;
          demo_url?: string | null;
          cover_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      project_skills: {
        Row: {
          project_id: string;
          skill_id: string;
          created_at: string;
        };
        Insert: {
          project_id: string;
          skill_id: string;
          created_at?: string;
        };
        Update: {
          project_id?: string;
          skill_id?: string;
          created_at?: string;
        };
      };
      project_members: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          role: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          role?: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string;
          role?: string;
          joined_at?: string;
        };
      };
      project_requests: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          message: string | null;
          status: RequestStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          message?: string | null;
          status?: RequestStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string;
          message?: string | null;
          status?: RequestStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      collaboration_requests: {
        Row: {
          id: string;
          creator_id: string;
          project_id: string;
          title: string;
          description: string;
          role_title: string | null;
          status: CollaborationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          project_id: string;
          title: string;
          description: string;
          role_title?: string | null;
          status?: CollaborationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          project_id?: string;
          title?: string;
          description?: string;
          role_title?: string | null;
          status?: CollaborationStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      collaboration_request_skills: {
        Row: {
          request_id: string;
          skill_id: string;
          created_at: string;
        };
        Insert: {
          request_id: string;
          skill_id: string;
          created_at?: string;
        };
        Update: {
          request_id?: string;
          skill_id?: string;
          created_at?: string;
        };
      };
      collaboration_applications: {
        Row: {
          id: string;
          request_id: string;
          applicant_id: string;
          message: string;
          status: ApplicationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          applicant_id: string;
          message: string;
          status?: ApplicationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          applicant_id?: string;
          message?: string;
          status?: ApplicationStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      tester_requests: {
        Row: {
          id: string;
          project_id: string;
          creator_id: string;
          title: string;
          description: string;
          number_needed: number;
          estimated_time: string;
          testing_url: string | null;
          deadline: string | null;
          status: TesterRequestStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          creator_id: string;
          title: string;
          description: string;
          number_needed: number;
          estimated_time: string;
          testing_url?: string | null;
          deadline?: string | null;
          status?: TesterRequestStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          creator_id?: string;
          title?: string;
          description?: string;
          number_needed?: number;
          estimated_time?: string;
          testing_url?: string | null;
          deadline?: string | null;
          status?: TesterRequestStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      tester_signups: {
        Row: {
          id: string;
          tester_request_id: string;
          user_id: string;
          status: TesterSignupStatus;
          feedback: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tester_request_id: string;
          user_id: string;
          status?: TesterSignupStatus;
          feedback?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tester_request_id?: string;
          user_id?: string;
          status?: TesterSignupStatus;
          feedback?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      opportunities: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          organizer: string;
          organizer_logo_url: string | null;
          category: OpportunityCategory;
          location: string | null;
          is_online: boolean;
          deadline: string | null;
          eligibility: string | null;
          application_url: string;
          banner_url: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          organizer: string;
          organizer_logo_url?: string | null;
          category?: OpportunityCategory;
          location?: string | null;
          is_online?: boolean;
          deadline?: string | null;
          eligibility?: string | null;
          application_url: string;
          banner_url?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          organizer?: string;
          organizer_logo_url?: string | null;
          category?: OpportunityCategory;
          location?: string | null;
          is_online?: boolean;
          deadline?: string | null;
          eligibility?: string | null;
          application_url?: string;
          banner_url?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      saved_opportunities: {
        Row: {
          user_id: string;
          opportunity_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          opportunity_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          opportunity_id?: string;
          created_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          location: string;
          is_online: boolean;
          meeting_link: string | null;
          start_date: string;
          end_date: string;
          capacity: number | null;
          registration_deadline: string | null;
          image_url: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          location: string;
          is_online?: boolean;
          meeting_link?: string | null;
          start_date: string;
          end_date: string;
          capacity?: number | null;
          registration_deadline?: string | null;
          image_url?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          location?: string;
          is_online?: boolean;
          meeting_link?: string | null;
          start_date?: string;
          end_date?: string;
          capacity?: number | null;
          registration_deadline?: string | null;
          image_url?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_registrations: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          status: EventRegistrationStatus;
          registered_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          status?: EventRegistrationStatus;
          registered_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          status?: EventRegistrationStatus;
          registered_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: NotificationType;
          title: string;
          message: string;
          reference_id: string | null;
          reference_type: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: NotificationType;
          title: string;
          message: string;
          reference_id?: string | null;
          reference_type?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: NotificationType;
          title?: string;
          message?: string;
          reference_id?: string | null;
          reference_type?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          target_type: ReportTargetType;
          target_id: string;
          reason: ReportReason;
          description: string | null;
          status: ReportStatus;
          reviewed_by: string | null;
          moderator_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          target_type: ReportTargetType;
          target_id: string;
          reason: ReportReason;
          description?: string | null;
          status?: ReportStatus;
          reviewed_by?: string | null;
          moderator_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reporter_id?: string;
          target_type?: ReportTargetType;
          target_id?: string;
          reason?: ReportReason;
          description?: string | null;
          status?: ReportStatus;
          reviewed_by?: string | null;
          moderator_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      resources: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          url: string;
          category: string | null;
          author_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          url: string;
          category?: string | null;
          author_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          url?: string;
          category?: string | null;
          author_id?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      community_posts_view: {
        Row: {
          id: string;
          category_id: string | null;
          title: string;
          content: string;
          post_type: PostType;
          is_anonymous: boolean;
          is_pinned: boolean;
          is_locked: boolean;
          view_count: number;
          created_at: string;
          updated_at: string;
          category_name: string | null;
          category_slug: string | null;
          author_id: string | null;
          author_username: string | null;
          author_avatar_url: string | null;
          comments_count: number;
          upvotes_count: number;
        };
      };
    };
    Functions: {
      is_moderator: {
        Args: { lookup_user_id: string };
        Returns: boolean;
      };
      is_admin: {
        Args: { lookup_user_id: string };
        Returns: boolean;
      };
      search_platform: {
        Args: { search_term: string };
        Returns: {
          entity_type: string;
          entity_id: string;
          title: string;
          snippet: string;
          rank: number;
        }[];
      };
    };
    Enums: {
      user_role: UserRole;
      post_type: PostType;
      reaction_type: ReactionType;
      project_status: ProjectStatus;
      request_status: RequestStatus;
      collaboration_status: CollaborationStatus;
      application_status: ApplicationStatus;
      tester_request_status: TesterRequestStatus;
      tester_signup_status: TesterSignupStatus;
      opportunity_category: OpportunityCategory;
      event_registration_status: EventRegistrationStatus;
      notification_type: NotificationType;
      report_target_type: ReportTargetType;
      report_reason: ReportReason;
      report_status: ReportStatus;
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertDto<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateDto<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
export type Views<T extends keyof Database['public']['Views']> =
  Database['public']['Views'][T]['Row'];
