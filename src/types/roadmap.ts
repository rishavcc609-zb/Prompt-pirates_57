/**
 * Types for Hyper-Specific Dream Job Career Roadmaps & Reverse-Engineering Engine
 */

export type MilestoneStatus = 'not_started' | 'in_progress' | 'achieved';

export type SkillLevel = 1 | 2 | 3 | 4 | 5;

export type SkillGapStatus = 'possessed' | 'partial' | 'missing';

export type ResourceType = 'Course' | 'Book' | 'Documentation' | 'Paper' | 'Project' | 'Certification';

export interface LearningResource {
  id: string;
  title: string;
  type: ResourceType;
  provider: string; // e.g. "MIT OpenCourseWare", "Coursera", "ArXiv", "Official Docs", "O'Reilly"
  url?: string;
  estimatedHours?: number;
  completed: boolean;
  linkedSkillId?: string;
}

export interface Milestone {
  id: string;
  stageId: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced' | 'Pinnacle';
  targetTimeframe: string;
  deliverables: string[];
  completedDeliverables?: string[];
  linkedSkillIds: string[];
  notes?: string;
  completedAt?: string;
}

export interface CareerStage {
  id: string;
  stageIndex: number;
  title: string;
  timeframe: string;
  objective: string;
  milestones: Milestone[];
}

export interface SkillCompetency {
  id: string;
  name: string;
  category: string;
  currentLevel: SkillLevel; // Practice or assessed level (1 to 5)
  targetLevel: SkillLevel;  // Dream job requirement level (1 to 5)
  verifiedLevel: SkillLevel; // Boosted by certificates & achieved milestones
  description: string;
  prerequisites: string[]; // IDs of required foundational skills beneath this one
  keyTopics: string[];
  tierLevel: number; // 0 = Target Goal Peak, 1 = Specialized Capstone, 2 = Core Technical, 3 = Foundations
  gapStatus: SkillGapStatus;
  matchReason?: string;
  estimatedHoursToBridge?: number;
}

export interface MonthPlan {
  id: string;
  monthNumber: number;
  title: string;
  theme: string;
  weeklyHoursTarget: number;
  focusSkillIds: string[];
  milestones: Milestone[];
  resources: LearningResource[];
  completed: boolean;
}

export interface GapAnalysisSummary {
  possessedCount: number;
  partialCount: number;
  missingCount: number;
  totalRequiredSkills: number;
  estimatedTotalHoursToBridge: number;
  currentReadinessQuotient: number; // 0 - 100%
}

export interface UploadedCertificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  credentialUrl?: string;
  fileDataUrl?: string; // base64 preview or placeholder
  fileName: string;
  fileSize: string;
  mimeType: string;
  linkedSkillIds: string[];
  verified: boolean;
  notes?: string;
  uploadedAt: string;
}

export interface RecommendedCert {
  id: string;
  name: string;
  issuer: string;
  estimatedCost: string;
  relevance: string;
  linkedSkillIds: string[];
  externalUrl?: string;
}

export interface JobRoadmap {
  id: string;
  title: string;
  slug: string;
  industry: string;
  summary: string;
  targetHorizon: string; // e.g. "12 Months"
  targetTimelineMonths: number; // e.g. 12
  weeklyStudyHours: number; // e.g. 15
  salaryRange: string;   // e.g. "$190k - $285k / yr"
  marketDemand: string;  // e.g. "Frontier High-Growth (+42% YoY)"
  requiredDegreeOrEquivalent: string;
  userCurrentSkills: string[];
  keyResponsibilities: string[];
  stages: CareerStage[];
  skills: SkillCompetency[];
  monthPlans: MonthPlan[];
  gapAnalysisSummary: GapAnalysisSummary;
  certifications: UploadedCertificate[];
  recommendedCertifications: RecommendedCert[];
  createdAt: string;
  lastUpdated: string;
  isCustom?: boolean;
}

export type RoadmapViewMode = 'timeline' | 'nodegraph' | 'gap' | 'skills' | 'vault' | 'sprints' | 'projectlab' | 'advisor';

export interface DailyStudySprint {
  id: string;
  dayNumber: number;
  roadmapId: string;
  skillId: string;
  skillName: string;
  stageTitle: string;
  title: string;
  durationMinutes: number;
  objective: string;
  actionItems: string[];
  deliverable: string;
  resourceLink?: string;
  completed: boolean;
  completedAt?: string;
  dateOffsetDays: number; // for calendar scheduling starting from today
}

export interface PortfolioProject {
  id: string;
  targetSkillId: string;
  targetSkillName: string;
  roadmapId: string;
  projectTitle: string;
  tagline: string;
  difficulty: 'Intermediate' | 'Advanced' | 'Pinnacle';
  estimatedHours: number;
  problemStatement: string;
  techStack: string[];
  architectureOverview: string;
  milestones: { step: number; title: string; deliverable: string; acceptanceCriteria: string }[];
  datasetsOrApis: { name: string; url?: string; description: string }[];
  githubReadmeTemplate: string;
  interviewTalkingPoints: string[];
  status: 'idea' | 'in_progress' | 'completed';
  repoUrl?: string;
}

export interface SkillQuizQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SkillBadge {
  id: string;
  skillId: string;
  skillName: string;
  score: number; // e.g. 100 or 80
  passedAt: string;
  verificationCode: string;
}

