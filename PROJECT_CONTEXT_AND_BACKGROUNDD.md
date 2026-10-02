
# Project Context, Background & Technical Briefing: Nex Community Platform ("NEX")

> **Document Purpose:** This document serves as the master context briefing for developers and AI agents working on the **Nex Community Platform ("NEX")**. It details the real-world project background, team dynamics, contributor responsibilities, architectural decisions, design system, and complete functional scope.

---

## 1. Project Background & Real-World Context

### 1.1 The Origin & Vision of NEX
The **Nex Community Platform** was conceived as a student-driven tech community ecosystem for university builders, learners, innovators, and future tech professionals across the Philippines. 

In the Philippine university tech landscape, students face significant systemic friction:
* **Siloed Communities:** Project showcases and hackathon prototypes are trapped inside private campus Facebook/Messenger groups or Discord servers.
* **Teammate Scarcity for Competitions:** Cross-disciplinary collaboration is difficult (e.g., Computer Science students struggling to find Computer Engineering IoT hackers or UI/UX designers for national events like DOST-SEI challenges, NASA Space Apps, or Google Solution Challenge).
* **MVP Tester Shortage:** Student developers have no structured platform to recruit beta testers from peer universities before launching their prototypes.
* **Scattered Opportunities:** Tech grants, hackathons, and internship openings are published across disjointed university bulletin boards without central aggregation.

### 1.2 The Team Challenges & Reality (What Happened)
While the vision was ambitious, the project faced critical real-world hurdles from the outset:
1. **Lack of UI/UX Assets:** There were no official Figma design files, UI wireframes, design components, or user journey prototypes provided. The only visual references were a 23-section conceptual technical PDF (`Nex-Community-Platform-Technical-Spec.pdf`) and an exported 12-page Canva brand kit (`NexAssetsReference.pdf`).
2. **Missing Lead Dev Frontend Architecture:** The lead developer did not provide an initial frontend structure, state management plan, API interface definitions, or clear component breakdown. The project lacked execution clarity on how to bridge the conceptual spec into a production web app.
3. **Repository Permissions & Git Constraints:** The user only has contributor-level access to the GitHub repository (`FerosC101/Nex-Platform`), without repository administrative rights (unable to change default branches on GitHub settings or force-push to `main`).

### 1.3 The Role of Georgie Villar (`georgiedev`) & How We Solved It
Stepping up as the **de facto Frontend Lead and Core Architect**, Georgie Villar took full end-to-end ownership of the frontend delivery:
* **Extracted Brand Tokens from Raw Canva Slides:** Analyzed the Canva PDF slides to extract the exact brand color palette (Obsidian Charcoal `#1b1a1f`, Elevated Surface `#232228`, Electric Aqua `#5cd6d7`) and typography pairings (`Poppins` for bold headlines, `Raleway` for body copy, and `Geist Mono` for tech tags).
* **Anti-AI Slop Design System:** Instead of falling into generic "AI slop" (cluttered gradients, generic cards, placeholder text), Georgie engineered a clean, high-craft, developer-first UI inspired by **Linear, Vercel, Supabase, and GitHub**.
* **Synthesized the Roadmap (`FRONTEND_ROADMAP_AND_SPECS.md`):** Translated the 23-section technical spec into 5 realistic, phased sprints with clear route definitions and priority milestones.
* **Engineered a 1:1 Supabase Relational Mock Layer:** Designed `lib/types.ts` and `lib/mock-data.ts` to strictly mirror Supabase's PostgreSQL database schema (Profiles, Posts, Comments, Projects, Project Members, Collaboration Requests, Applications). When the backend is integrated, switching to real database queries will require zero UI rewrite.
* **Adopted a Stacked PR Architecture:** To overcome contributor git constraints and ensure clean, granular code reviews, implemented a Stacked Pull Request architecture with atomic conventional commits.

---

## 2. Contributor & Git Architecture

### 2.1 Contributor Profile
* **Name / Handle:** Georgie Villar (`georgiedev` on GitHub)
* **Education:** 3rd Year BS Computer Science, Batangas State University - The National Engineering University (BatStateU - TNEU)
* **Role:** Frontend Lead / Core Builder
* **Repository:** `FerosC101/Nex-Platform`

### 2.2 Stacked Pull Request (PR) Workflow
All work flows incrementally through stacked feature branches:

```
main (Base: Contains only specification PDFs & documentation)
  │
  └── feature/frontend-scaffolding (Scaffolding, design tokens, Radix UI components, AppShell)
        │
        └── feature/phase-1-mvp (Auth, Dashboard, Community Feed, Threaded Comments, Profile)
              │
              └── feature/phase-2-projects (Projects Directory, Creation Form, Project Details, Team Roster, Collab Applications)
                    │
                    └── feature/phase-3-opportunities (Upcoming: Opportunities & Events Hub)
```

### 2.3 Strict Rules of Engagement for AI Working on this Codebase
1. **The User Pushes:** The AI must NEVER push directly to the remote repository. Georgie pushes branches manually from his terminal (`git push -u origin <branch-name>`).
2. **Granular Atomic Commits:** NEVER combine all changes into a single bulk commit. Each feature, page, or type definition must have its own conventional git commit (e.g., `feat(core): ...`, `feat(projects): ...`).
3. **Strictly No Emojis in PRs or Commits:** All commit messages and PR descriptions must be clean, professional, and contain zero emojis.
4. **No Overengineering:** Keep implementations clean, simple, robust, and aligned with standard Next.js App Router patterns.
5. **No Half-Work:** Every started feature must be completed end-to-end, fully typed, integrated, and verified with `npm run build` with 0 TypeScript and 0 routing errors.

---

## 3. Technology Stack & Design System

### 3.1 Technology Stack
* **Framework:** Next.js 16.3.7 (App Router, Turbopack, React 19.2.8, TypeScript 5)
* **Styling:** Tailwind CSS v4 + Radix UI Primitives (`shadcn/ui` style)
* **Icons:** `lucide-react` (with custom inline SVGs for brand logos like GitHub and LinkedIn)
* **Backend Target:** Supabase (PostgreSQL, Supabase Auth, Supabase Storage, Row Level Security, Edge Functions)

### 3.2 Official Brand Tokens & Styling Guidelines
* **Base Canvas (Dark Background):** `#1b1a1f` (Obsidian Charcoal / Deep Black)
* **Elevated Surface (Cards / Modals):** `#232228` (Subtle elevated dark container)
* **Brand Primary Accent:** `#5cd6d7` (Electric Aqua / Vibrant Neon Cyan)
* **Borders / Separators:** `border-border/80` or `rgba(255, 255, 255, 0.1)`
* **Headlines / Display:** `Poppins` (Bold / SemiBold) or `Space Grotesk`
* **Body / Subheadings / UI Labels:** `Raleway` (Regular & Medium)
* **Code / Badges / Monospace:** `Geist Mono` or `JetBrains Mono`

### 3.3 Official Brand Microcopy
* **Motto / Tagline:** *"Learn. Build. Collaborate. Compete. Connect."*
* **Call to Action:** *"Ready to take your NEX step in tech?"* / *"Make your NEX move."*
* **Mission Statement:**
  > *"NEX is a student-driven tech community built for learners, creators, innovators, and future tech professionals. Whether you're just getting started or already building your own projects, there's a place for you here."*

---

## 4. Platform Page & Route Directory

The complete platform scope encompasses **9 core modules and 17 primary screens**:

```
nex-platform/app/
├── (auth)/
│   ├── login/page.tsx               # Screen 1: Login with email/password + Google OAuth
│   ├── register/page.tsx            # Screen 2: Registration (Name, University, Course, Year Level)
│   ├── verify-email/page.tsx        # Screen 3: Email confirmation notice
│   └── onboarding/page.tsx          # Screen 4: First-time technical skill & interest chips selector
│
├── dashboard/page.tsx               # Screen 5: Student Hub Dashboard (Personalized greeting, stats, deadlines)
│
├── community/
│   ├── page.tsx                     # Screen 6: Community Feed (Filters: Discussion, Question, Project, Collab, etc.)
│   └── [postId]/page.tsx            # Screen 7: Post Detail + Markdown render + Nested threaded comments
│
├── projects/
│   ├── page.tsx                     # Screen 8: Projects Directory & Discovery (Search & Status filters)
│   ├── new/page.tsx                 # Screen 9: Create Project Form (Repo/Demo links, stack tags, recruitment toggle)
│   └── [id]/page.tsx                # Screen 10: Project Overview, Team Roster, and Collab Application Drawer
│
├── opportunities/
│   ├── page.tsx                     # Screen 11: Opportunities Catalog (Hackathons, Grants, Internships)
│   └── saved/page.tsx               # Screen 12: Bookmarked/Saved Opportunities
│
├── events/
│   ├── page.tsx                     # Screen 13: Event Directory (Workshops, Hackathons, Tech Summits)
│   └── [id]/page.tsx                # Screen 14: Event Detail, Agenda & RSVP Modal
│
├── testers/
│   └── page.tsx                     # Screen 15: Beta Tester Requests Board (Student prototype recruitment)
│
├── profile/
│   ├── [username]/page.tsx          # Screen 16: Public Student Profile & Portfolio (Posts, Skills, Projects)
│   └── settings/page.tsx            # Screen 17: Profile & Account Settings Editor
│
└── admin/
    └── moderation/page.tsx          # Screen 18: Moderator Queue (Reports, Takedowns, Audit Logs)
```

---

## 5. Development Phases & Current Status

### Phase 1: MVP Baseline (COMPLETED — Branch: `feature/phase-1-mvp`)
* **Accomplishments:**
  * Created global layout shell (`AppShell`, `Sidebar`, `Header` with search trigger and quick action).
  * Built complete auth suite (`/login`, `/register`, `/verify-email`, `/onboarding`) with student university metadata fields.
  * Built student dashboard (`/dashboard`) with personalized stats and quick action cards.
  * Implemented community hub (`/community`) with multi-category tabs, upvoting, and post creation dialog with anonymous publishing mode.
  * Implemented threaded post detail (`/community/[postId]`) with markdown content and recursive comment replies.
  * Implemented public student profile (`/profile/[username]`) and settings editor (`/profile/settings`).

### Phase 2: Projects & Collaboration Engine (COMPLETED — Branch: `feature/phase-2-projects`)
* **Accomplishments:**
  * Defined project lifecycle types (`ProjectStatus`, `ProjectMember`, `CollaborationRequest`, `CollaborationApplication`) in `lib/types.ts`.
  * Created realistic mock dataset with 4 student projects (Nex Platform, AgriSense IoT, StudySync, CampusLogix) with complete member rosters.
  * Built project directory (`/projects`) with live search, status pills (`All`, `In Development`, `Prototypes`, `Planning`, `Ideas`, `Completed`), and teammate recruitment filters.
  * Built project registration form (`/projects/new`) supporting repository/demo URLs, category, stage, tags, and initial collaborator openings.
  * Built project overview (`/projects/[id]`) with team roster, assigned roles, open positions, and an interactive sliding application drawer with real-time feedback.
  * Integrated student project portfolio into the profile page (`/profile/[username]`), replacing the placeholder with live project cards.
  * Validated via `npm run build` with 15/15 routes compiled and 0 TypeScript errors.

### Phase 3: Opportunities Hub, Events & Alerts (UPCOMING — Next Priority)
* **Planned Scope:**
  * Opportunities Catalog (`/opportunities` and `/opportunities/saved`) for hackathons, DOST-SEI grants, and internships with countdown badges and bookmark toggles.
  * Events Directory (`/events` and `/events/[id]`) with workshops, tech summits, agendas, and RSVP registration modals.
  * Header notification drawer for collaboration request responses and event reminders.

### Phase 4: Beta Tester Exchange, Anonymous Mode & Polish (FUTURE)
* **Planned Scope:**
  * Beta Tester Request Board (`/testers`) with slot trackers and tester signup forms.
  * Global `Ctrl+K` Command Palette search across posts, projects, and users.
  * Admin Moderation Queue (`/admin/moderation`).

---

## 6. Relational Data Models (`lib/types.ts`)

```typescript
export type PostType =
  | "DISCUSSION"
  | "QUESTION"
  | "PROJECT"
  | "COLLABORATION"
  | "OPPORTUNITY"
  | "ANNOUNCEMENT";

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    school?: string;
    course?: string;
  };
  content: string;
  isAnonymous: boolean;
  createdAt: string;
  upvotes: number;
}

export interface Post {
  id: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    school?: string;
    course?: string;
  };
  title: string;
  content: string;
  postType: PostType;
  isAnonymous: boolean;
  upvotes: number;
  commentsCount: number;
  createdAt: string;
  tags: string[];
  comments: Comment[];
}

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
  profileImage: string;
  skills: string[];
  interests: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  createdAt: string;
}

export type ProjectStatus =
  | "IDEA"
  | "PLANNING"
  | "PROTOTYPE"
  | "DEVELOPMENT"
  | "COMPLETED";

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    school?: string;
    course?: string;
  };
  role: string;
  joinedAt: string;
}

export interface CollaborationRequest {
  id: string;
  projectId: string;
  roleTitle: string;
  description: string;
  skillsNeeded: string[];
  status: "OPEN" | "FILLED" | "CLOSED";
  createdAt: string;
}

export interface CollaborationApplication {
  id: string;
  collaborationRequestId: string;
  applicantId: string;
  applicant: {
    id: string;
    name: string;
    username: string;
    school?: string;
    course?: string;
  };
  message: string;
  contactHandle: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
}

export interface Project {
  id: string;
  ownerId: string;
  owner: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    school?: string;
    course?: string;
  };
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
```

---

## 7. How to Continue Development (Instructions for Incoming AI)

When continuing work or picking up the next phase:
1. **Always Verify Active Branch:** Ensure you are working on the proper feature branch (e.g. `feature/phase-3-opportunities` branched off `feature/phase-2-projects`).
2. **Commit Granularly:** Use conventional commits per file/feature (`feat(opportunities): ...`).
3. **Verify Every Step:** Always run `npm run build` before considering any phase complete.
4. **Preserve User Workflow:** Remind the user to push to GitHub themselves. Provide stacked PR instructions targeting the previous branch.
