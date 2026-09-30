# Nex Community Platform — Screen Directory & Scope Summary

> **Scope Source:** `Nex-Community-Platform-Technical-Spec.pdf`  
> **Brand & Styling Source:** `NexAssetsReference.pdf` (Canva Brand Kit)  
> **Rule:** Clean, zero-slop, no overengineering.

---

## 1. Quick Screen & Route Directory

### Total Count
* **17 Core Page Views** (across 9 modules)
* **6 Action Modals / Drawers**
* **Phase 1 MVP Target:** **6 screens only**

---

### Module 1: Authentication & Onboarding (4 screens)
* `/login` — Email/password + Google OAuth login card.
* `/register` — Registration form including student fields: School, Course, Year Level.
* `/verify-email` — Verification link sent screen.
* `/onboarding` — First-time interest & skill chips selector (`React`, `Python`, `AI`, `Hackathons`).

### Module 2: Student Dashboard (1 screen)
* `/dashboard` — Main app shell with personalized greeting, active projects, upcoming deadlines, and activity stream.

### Module 3: Community System (2 screens + 1 modal)
* `/community` — Main feed with category filters (`Discussion`, `Question`, `Project`, `Collab`, `Opportunity`, `Announcement`).
* `/community/[postId]` — Post view with markdown content and nested comments.
* *Modal:* Create Post dialog with **Anonymous toggle** (`is_anonymous = true`).

### Module 4: Projects & Teammate Recruitment (3 screens + 1 modal)
* `/projects` — Directory with status filters (`Idea`, `Planning`, `Prototype`, `Development`, `Completed`).
* `/projects/new` — Project submission form (Title, description, repo URL, demo URL, stack).
* `/projects/[id]` — Project details, member roster, and open collaboration roles.
* *Modal:* Apply for Collaboration message drawer.

### Module 5: Opportunities Hub (2 screens)
* `/opportunities` — Directory for `Hackathon`, `Ideathon`, `Internship`, `Scholarship` with deadlines.
* `/opportunities/saved` — Student's bookmarked opportunities.

### Module 6: Events Hub (2 screens + 1 modal)
* `/events` — Upcoming tech events & workshops calendar/grid.
* `/events/[id]` — Event agenda and speaker lineup.
* *Modal:* Event registration / RSVP modal.

### Module 7: Beta Tester Exchange (1 screen + 1 modal)
* `/testers` — Student testing board (e.g. *"Need 5 testers for student fintech prototype"*).
* *Modal:* Tester signup confirmation modal.

### Module 8: Profile & Settings (2 screens)
* `/profile/[username]` — Public student portfolio (School/Course badges, projects, posts, skills).
* `/profile/settings` — Edit bio, update social links, upload avatar.

### Module 9: Admin & Moderation (1 screen)
* `/admin/moderation` — Moderator queue for reported content (`Spam`, `Harassment`, `Scam`) to dismiss or delete.

---

## 2. Immediate Phase 1 MVP Scope (Build These First)

Do not build all 17 screens at once. Start with **Phase 1 (6 screens)**:

1. **Global App Shell** (Sidebar & Header using `#1b1a1f` dark base and `#5cd6d7` accent)
2. **Auth Suite** (`/login`, `/register`, `/onboarding`)
3. **Community Feed & Post Detail** (`/community`, `/community/[postId]`)
4. **Student Profile** (`/profile/[username]`)

---

## 3. Brand Identity Quick Reference

* **Dark Canvas:** `#1b1a1f` (Obsidian Charcoal)
* **Surface/Card:** `#232228`
* **Primary Accent:** `#5cd6d7` (Electric Aqua / Cyan)
* **Display Font:** `Poppins` (Bold) / `Space Grotesk`
* **Body Font:** `Raleway`
* **Brand Slogan:** *"Learn. Build. Collaborate. Compete. Connect."*