# PathFinder Ultra: Real-World Execution Engine

An end-to-end upgrade transforming PathFinder into an ultra-efficient, real-world career transition platform through daily structured study sprints with calendar sync, AI-generated concrete portfolio projects for skill gaps, and interactive skill verification quizzes with verifiable score badges.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product decisions were confirmed through Phase 1 requirements analysis:

- **Confirmed Decision 1 (Core Real-World Focus)**: Daily structured study sprints with calendar integration. Rather than leaving learners with a passive static syllabus, PathFinder breaks the chosen career roadmap into manageable daily 45-to-90 minute micro-sprints with a focus timer, progress check-ins, and one-click export to Google Calendar and `.ics` files.
- **Confirmed Decision 2 (AI Intelligence Acceleration)**: Auto-generated concrete portfolio projects for missing skills. When a gap is identified (e.g., vLLM inference or Quantitative Risk Modeling), Gemini generates an end-to-end production-grade project specification: system architecture, tech stack, step-by-step milestones, GitHub README starter, and portfolio showcase talking points.
- **Confirmed Decision 3 (Proof of Competence)**: Interactive skill verification quizzes with score badges. Users can test and prove their knowledge in real time. Passing a 5-question technical drill unlocks a "Verified Competency" badge and dynamically flips the skill from "Gap" to "Matched" in the live Readiness Index.
- **Decision on Offline / Keyless Fallback**: When an external API key is absent, the system seamlessly uses high-fidelity, hyper-specific pre-compiled project blueprints and randomized domain question banks for all standard dream roles.

---

## 1. Overview & Core Concept

- **What It Does**: Bridges the gap between "knowing what to study" and "landing the job". Users receive a customized daily execution plan synced to their personal calendar, build portfolio-ready proof-of-work repositories for their skill gaps, and test their competencies with automated technical quizzes that update their career readiness score.
- **Target Audience / Persona**: Career switchers, aspiring AI/ML/Quant engineers, educators, and tech professionals who need structured discipline, tangible proof-of-work, and immediate feedback on their readiness.
- **Key Value**:
  1. *Frictionless Scheduling*: Eliminates analysis paralysis by turning multi-month plans into daily 60-minute calendar commitments.
  2. *Defensible Portfolio Proof*: Replaces passive video-watching with deployable GitHub projects designed to impress hiring managers.
  3. *Verifiable Competence*: Live skill verification quizzes that prove mastery and boost the Readiness Index dynamically.

---

## 2. User Experience & Visual Design

### Key User Flows

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. GAP IDENTIFICATION & READINESS AUDIT                                │
│    Learner inspects Skill Gap & Readiness Index (e.g., 3/8 matched,    │
│    5 gaps remaining, ~215 hours needed).                              │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 2. DAILY SPRINT ENGINE & CALENDAR SYNC                                 │
│    Learner sets weekly study hours (e.g., 15h/wk). PathFinder schedules│
│    today's sprint: "LoRA Fine-Tuning Setup - 45 min". One-click export │
│    to Google Calendar / Apple Calendar. Built-in Pomodoro timer.       │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 3. PROJECT LAB: GENERATE PROOF-OF-WORK REPO                            │
│    Learner clicks "Generate Project for Gap" on missing skill.         │
│    Gemini crafts a concrete portfolio build: architecture diagram,     │
│    milestones, dataset links, and downloadable starter repository.     │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 4. TECHNICAL DRILL & VERIFICATION BADGE                                │
│    Learner completes interactive 5-question technical quiz.            │
│    Score ≥ 80% awards a Verified Badge, switches skill to Matched,     │
│    and instantly boosts Goal Preparedness % in the live hero gauge.   │
└────────────────────────────────────────────────────────────────────────┘
```

### Visual Identity & Theme
- **Aesthetic Direction**: High-intent, tactical engineering dashboard. Deep obsidian canvas (`#020617` / `slate-950`), surgical hairline dividers (`border-slate-800`), and emerald accents (`#10b981` / `emerald-500`) for verified milestones and cyan (`#06b6d4`) for sprint focus.
- **Zero-Pill & Metadata Discipline**: Strict adherence to the Frontend Design Constitution. All informational metadata (sprint duration, difficulty, estimated hours, timestamps) will use clean, unboxed text separated by typographic middots (`·`). Interactive controls (sprint filters, calendar sync actions, quiz option buttons) use purpose-built segmented controls and tactile state buttons.
- **Typography**: `Plus Jakarta Sans` for clean, readable headings and interface labels; `JetBrains Mono` for tabular numerals (`tabular-nums`), countdown timers, code snippets, and metric counters.
- **Responsive Layout Integrity**: Desktop baseline adheres to a structured 1440px viewport with a 12-column layout. High-density sprint schedules and quiz sidebars collapse gracefully into bottom drawers and full-width touch stages on mobile.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Study Sprints as Calendar Export (.ics & Web Intent) vs. Third-Party OAuth Dependency**
  - *Chosen Approach*: Provide instant, zero-friction `.ics` calendar file downloads (compatible with Apple Calendar, Outlook, Google Calendar) and one-click Google Calendar web intents (`https://calendar.google.com/calendar/render?action=TEMPLATE...`), paired with in-browser daily sprint checklists.
  - *Why*: Eliminates complex OAuth approval hurdles and permissions requests for learners while immediately placing study sessions into their existing everyday workflow.
- **Decision 2: In-App Interactive Skill Verification vs External Redirects**
  - *Chosen Approach*: Deliver self-contained, real-time 5-question technical drills directly inside PathFinder with explanations, immediate feedback, and score calculations.
  - *Why*: Instant gratification and tangible progress; passing a quiz directly mutates the roadmap state and updates the user's Goal Preparedness % without leaving the app.
- **Decision 3: Gemini AI Generation with High-Fidelity Domain Fallback**
  - *Chosen Approach*: Use `@google/genai` with `gemini-3.8-flash` for tailored project generation and quiz formulation, backed by a comprehensive pre-configured library of curated real-world projects and quizzes for all preset roles.
  - *Why*: Guarantees zero latency and 100% reliability even when API keys are not supplied or rate limits are reached.

---

## 4. Technical Architecture & Data Strategy

### System & Component Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PATHFINDER CORE SPA                           │
├────────────────────────────────────────────────────────────────────────┤
│ TopBar                                                                 │
│ ├─ Active Role Switcher & Dream Job Quick Search                       │
│ ├─ View Selector: [Timeline | Graph | Gaps | Sprints | Project Lab]   │
│ └─ Download Website ZIP Modal                                          │
├────────────────────────────────────────────────────────────────────────┤
│ RoadmapHero                                                            │
│ ├─ Dynamic Scope & Market Overview                                     │
│ └─ Live Skill Gap & Readiness Index (Calculated via RoadmapContext)    │
├────────────────────────────────────────────────────────────────────────┤
│ NEW: StudySprintPlannerView                                            │
│ ├─ Daily Micro-Sprint Queue (Today's 45m/60m commitment)               │
│ ├─ Focus Pomodoro Timer & Completion Checkbox                          │
│ ├─ Weekly Pace Calculator (adjusts study load to learner's schedule)   │
│ └─ Calendar Export Action (.ics file download & Google Calendar link)  │
├────────────────────────────────────────────────────────────────────────┤
│ NEW: ProjectLabView & Modal                                            │
│ ├─ Gap-to-Project Mapper (identifies unmastered competencies)          │
│ ├─ AI Project Architect (Gemini / Domain Blueprint Engine)             │
│ ├─ Production Spec (Architecture, Stack, Milestones, Dataset Links)    │
│ └─ Export Project Starter / README.md file                             │
├────────────────────────────────────────────────────────────────────────┤
│ NEW: SkillVerificationQuizModal                                        │
│ ├─ 5-Question Technical Assessment Engine                              │
│ ├─ Instant Option Feedback, Code Snippet Evaluation & Score Tally      │
│ ├─ Verified Competency Badge Generator                                 │
│ └─ Live Mutator: Updates skill.gapStatus -> 'possessed'               │
├────────────────────────────────────────────────────────────────────────┤
│ RoadmapContext (State Store & localStorage + Firestore Sync)           │
│ ├─ currentRoadmap (skills, milestones, resources)                      │
│ ├─ userSprints (daily schedule, completed tasks, streak)               │
│ ├─ verifiedBadges (quiz scores, dates, verification certificates)      │
│ └─ stats (goalPreparednessPercentage, matchedSkills, remainingHours)   │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model Additions

```typescript
// Daily Study Sprint
interface DailyStudySprint {
  id: string;
  dayNumber: number;
  dateString?: string;
  skillId: string;
  skillName: string;
  title: string;
  durationMinutes: number;
  objective: string;
  actionItems: string[];
  resourceLink?: string;
  completed: boolean;
}

// Portfolio Project Blueprint
interface PortfolioProject {
  id: string;
  targetSkillId: string;
  targetSkillName: string;
  projectTitle: string;
  tagline: string;
  problemStatement: string;
  techStack: string[];
  architectureOverview: string;
  milestones: { step: number; title: string; deliverable: string }[];
  githubReadmeTemplate: string;
  interviewTalkingPoints: string[];
}

// Skill Verification Quiz
interface SkillQuizQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface SkillQuizResult {
  skillId: string;
  score: number; // 0 - 100
  passed: boolean;
  completedAt: string;
  badgeId: string;
}
```

---

## 5. Execution Stages

1. **Sprint Scheduler & Calendar Sync Engine (`StudySprintPlannerView.tsx`)**:
   - Generates daily 45–90 min study sessions from the active roadmap's timeline.
   - Includes Google Calendar one-click scheduling link and RFC 5545 compliant `.ics` calendar file download.
   - Interactive focus timer and daily completion streak tracker.
2. **AI Portfolio Project Lab (`ProjectLabView.tsx` & `ProjectGeneratorModal.tsx`)**:
   - Scans missing skills and suggests concrete, employer-grade projects.
   - Generates production-level project blueprints with architecture overview, dataset links, and downloadable `README.md`.
3. **Interactive Skill Verification Quiz (`SkillVerificationQuizModal.tsx`)**:
   - 5-question technical drills for targeted competencies.
   - Instant score evaluation and badge unlock.
   - Seamlessly integrates with `toggleSkillPossessed` to instantly recalculate the Readiness Index and Goal Preparedness %.
4. **Context & Navigation Integration**:
   - Adds "Study Sprints" and "Project Lab" tabs to `TopBar` and navigation.
   - Persists all sprint progress and verification badges to `localStorage` and Firestore.
