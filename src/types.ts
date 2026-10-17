export type TargetRole = 
  | 'Associate Product Manager (APM)' 
  | 'Software Engineer (SDE)' 
  | 'Data Analyst' 
  | 'AI / ML Engineer' 
  | 'Other';

export interface BulletAuditItem {
  id: string;
  originalBullet: string;
  rewrittenBullet: string;
  secondaryRewrittenBullet?: string | null;
  issueFixedTag: string;
  issueExplanation: string;
  detectedIssues: string[];
  actionVerbUsed: string;
  metricPlaceholderType?: string;
  section?: string;
}

export interface ScoreBreakdown {
  roleKeywordMatch: number; // 0-35
  singleIdeaStructure: number; // 0-25
  quantifiedMetrics: number; // 0-25
  sectionFormattingCompliance: number; // 0-15
  impactAndMetrics?: number;
  actionVerbs?: number;
  roleAlignment?: number;
  clarityAndStructure?: number;
}

export interface StructuredResumeExperience {
  company: string;
  role: string;
  duration: string;
  location?: string;
  bullets: string[];
}

export interface StructuredResumeProject {
  title: string;
  technologies?: string;
  link?: string;
  bullets: string[];
}

export interface StructuredResumeEducation {
  institution: string;
  degree: string;
  graduationDate: string;
  gpaOrHonors?: string;
  relevantCoursework?: string[];
}

export interface StructuredResumeSkillCategory {
  category: string;
  skills: string[];
}

export interface StructuredResume {
  candidateName: string;
  contactInfo: string;
  summary: string;
  experience: StructuredResumeExperience[];
  projects: StructuredResumeProject[];
  skills: StructuredResumeSkillCategory[];
  education: StructuredResumeEducation[];
  achievements: string[];
  formattedFullResume: string;
}

export interface AuditResponse {
  beforeScore: number; // e.g. 62/100
  afterScore: number; // e.g. 98/100
  initialAtsScore?: number;
  rebuiltAtsScore?: number;
  atsScore: number; // Alias for afterScore (or current score)
  jdMatchScore?: number | null;
  isJdTailored?: boolean;
  scoreBreakdown: ScoreBreakdown;
  scoreSummary: string;
  missingKeywords: string[];
  matchedKeywords: string[];
  injectedKeywords?: string[];
  roleEvaluated: string;
  bulletAudits: BulletAuditItem[];
  fullResume: StructuredResume;
}

export interface BulletFeedback {
  bulletId: string;
  copied: boolean;
  rating: 'up' | 'down' | null;
}

export interface UploadedFileInfo {
  name: string;
  size: number;
  type: string;
  base64Data?: string;
  textContent?: string;
}

export interface ChatAssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionTag?: string;
  updatedResume?: StructuredResume;
  scoreDelta?: number;
}
