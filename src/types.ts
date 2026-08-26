export type TabType = 'home' | 'score-checker' | 'resume-builder' | 'templates';

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  graduationYear: string;
  honors?: string;
}

export interface SkillCategory {
  categoryName: string;
  skills: string;
}

export interface ResumeData {
  personalInfo: {
    firstName: string;
    lastName: string;
    professionalTitle: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website?: string;
  };
  summary: string;
  workExperience: WorkExperience[];
  education: EducationItem[];
  skillsCategories: SkillCategory[];
  settings: {
    fontFamily: 'Inter' | 'Merriweather' | 'Roboto';
    spacing: 'Compact' | 'Normal' | 'Spacious';
    accentColor: string;
    templateId: string;
  };
}

export interface ATSIssue {
  id: string;
  title: string;
  description: string;
  category: 'Formatting' | 'Parsing Error' | 'Impact & Metrics' | 'Structure';
  severity: 'critical' | 'warning' | 'info';
  recommendedFix?: string;
}

export interface MissingKeyword {
  keyword: string;
  frequency: number;
  importance: 'High' | 'Medium';
}

export interface ATSAnalysisResult {
  overallScore: number;
  matchLevel: 'Poor Match' | 'Fair Match' | 'Good Match' | 'Strong Match';
  summary: string;
  targetRole: string;
  targetCompany?: string;
  jobDescription?: string;
  issues: ATSIssue[];
  missingKeywords: MissingKeyword[];
  matchedKeywords: string[];
  documentDetails: {
    fileName: string;
    wordCount: number;
    readabilityScore: string;
    lastAnalyzed?: string;
  };
}

export interface ScoreSubMetric {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  weight: string;
  status: 'optimal' | 'warning' | 'critical';
  description: string;
  recommendation: string;
}

export interface ResumeAnnotation {
  id: string;
  section: 'header' | 'summary' | 'experience' | 'skills' | 'education';
  type: 'strength' | 'warning' | 'critical';
  title: string;
  originalText: string;
  suggestedText?: string;
  explanation: string;
  scoreImpact: number;
}

export interface BeforeAfterExample {
  id: string;
  category: string;
  before: {
    score: number;
    text: string;
    flaws: string[];
  };
  after: {
    score: number;
    text: string;
    improvements: string[];
  };
  appliedToBuilder?: boolean;
}

export interface ResumeTemplate {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  industry: 'tech' | 'finance' | 'creative' | 'healthcare' | 'academic' | 'all';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive' | 'all';
  tags: string[];
  features: string[];
}
