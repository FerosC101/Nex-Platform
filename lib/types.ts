export type PostType =
  | "DISCUSSION"
  | "QUESTION"
  | "PROJECT"
  | "COLLABORATION"
  | "OPPORTUNITY"
  | "ANNOUNCEMENT";

export interface StudentProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  schoolId: string;
  schoolName: string;
  course: string;
  yearLevel: string;
  bio: string;
  profileImage?: string;
  skills: string[];
  interests: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  createdAt: string;
}

export interface PostAuthor {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  school: string;
  course: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: PostAuthor;
  content: string;
  isAnonymous: boolean;
  createdAt: string;
  upvotes: number;
}

export interface Post {
  id: string;
  authorId: string;
  author: PostAuthor;
  title: string;
  content: string;
  postType: PostType;
  isAnonymous: boolean;
  upvotes: number;
  commentsCount: number;
  createdAt: string;
  tags: string[];
  comments?: Comment[];
}

// ==========================================
// Phase 2: Project & Collaboration Entities
// ==========================================

export type ProjectStatus =
  | "IDEA"
  | "PLANNING"
  | "PROTOTYPE"
  | "DEVELOPMENT"
  | "COMPLETED"
  | "ARCHIVED";

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  user: PostAuthor;
  role: string;
  joinedAt: string;
}

export interface CollaborationRequest {
  id: string;
  creatorId: string;
  projectId: string;
  title: string;
  description: string;
  skillsRequired: string[];
  status: "OPEN" | "FILLED" | "CLOSED";
  createdAt: string;
  applicationsCount: number;
}

export interface CollaborationApplication {
  id: string;
  requestId: string;
  applicantId: string;
  applicant: PostAuthor;
  message: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
}

export interface Project {
  id: string;
  ownerId: string;
  owner: PostAuthor;
  name: string;
  description: string;
  category: string;
  status: ProjectStatus;
  repositoryUrl?: string;
  demoUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  members: ProjectMember[];
  collaborationRequests?: CollaborationRequest[];
}

// ==========================================
// Phase 3: Opportunities, Events & Notifications
// ==========================================

export type OpportunityType =
  | "HACKATHON"
  | "INTERNSHIP"
  | "GRANT"
  | "SCHOLARSHIP"
  | "FELLOWSHIP"
  | "COMPETITION";

export type LocationType = "ONLINE" | "ONSITE" | "HYBRID";

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  organizationLogo?: string;
  type: OpportunityType;
  description: string;
  locationType: LocationType;
  location: string;
  deadline: string; // ISO date string
  eligibility: string;
  applicationUrl: string;
  reward: string; // e.g. "₱150,000 Prize Pool", "₱20,000 / mo + Mentorship"
  tags: string[];
  createdAt: string;
  featured?: boolean;
}

export type EventType =
  | "WORKSHOP"
  | "WEBINAR"
  | "HACKATHON_KICKOFF"
  | "CAMPUS_MEETUP"
  | "TECH_CONFERENCE";

export interface EventAgendaItem {
  time: string;
  title: string;
  description?: string;
}

export interface TechEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  date: string; // ISO date string
  startTime: string;
  endTime: string;
  locationType: LocationType;
  location: string;
  organizer: string;
  speaker: {
    name: string;
    role: string;
    organization: string;
    avatar?: string;
  };
  capacity: number;
  registeredCount: number;
  agenda: EventAgendaItem[];
  tags: string[];
  meetingLink?: string;
  bannerGradient: string;
}

export type NotificationType =
  | "COLLABORATION_REQUEST"
  | "APPLICATION_STATUS"
  | "COMMENT_REPLY"
  | "UPVOTE_MILESTONE"
  | "OPPORTUNITY_DEADLINE"
  | "EVENT_REMINDER";

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

// ==========================================
// Phase 4: Tester System & Moderation System
// ==========================================

export interface TesterRequest {
  id: string;
  projectId: string;
  projectName: string;
  creatorId: string;
  creator: PostAuthor;
  title: string;
  description: string;
  numberNeeded: number;
  estimatedTime: string; // e.g. "15 mins"
  deadline: string;
  status: "OPEN" | "FILLED" | "COMPLETED";
  signupsCount: number;
  testUrl?: string;
  createdAt: string;
}

export interface TesterSignup {
  id: string;
  testerRequestId: string;
  userId: string;
  user: PostAuthor;
  status: "PENDING" | "ACCEPTED" | "COMPLETED";
  feedback?: string;
  createdAt: string;
}

export type ReportReason =
  | "SPAM"
  | "HARASSMENT"
  | "SCAM"
  | "INAPPROPRIATE_CONTENT"
  | "MISLEADING_CONTENT"
  | "OTHER";

export type ReportStatus =
  | "PENDING"
  | "REVIEWED"
  | "DISMISSED"
  | "ACTION_TAKEN";

export interface ModerationReport {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: "POST" | "COMMENT" | "PROJECT" | "USER";
  targetId: string;
  targetTitle: string;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  reviewedBy?: string;
  createdAt: string;
}


