// ========================================
// TYPE DEFINITIONS
// ========================================

export type ApplicationStatus =
  | 'WISHLIST'
  | 'CV_IN_PROGRESS'
  | 'APPLIED'
  | 'HR_SCREEN'
  | 'INTERVIEW_1'
  | 'INTERVIEW_2'
  | 'FINAL_INTERVIEW'
  | 'OFFER_RECEIVED'
  | 'OFFER_ACCEPTED'
  | 'REJECTED'
  | 'WITHDRAWN';

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export type InterviewType = 'ONLINE' | 'ONSITE' | 'PHONE';

export type ApplicationSource =
  | 'LINKEDIN'
  | 'INDEED'
  | 'GLASSDOOR'
  | 'COMPANY_WEBSITE'
  | 'REFERRAL'
  | 'RECRUITER'
  | 'OTHER';

// ========================================
// CORE ENTITIES
// ========================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'BASIC' | 'PRO' | 'ADMIN';
  createdAt: string;
  onboarded: boolean;
  avatar?: string;
  emailNotificationsEnabled?: boolean;
}

export interface JobApplication {
  id: string;
  userId: string;
  companyName: string;
  position: string;
  status: ApplicationStatus;
  appliedDate: string;
  jdLink?: string;
  jdText?: string;
  source: ApplicationSource;
  salaryExpectation?: number;
  priority: Priority;
  tags: string[];
  cvVersion?: string;
  coverLetter?: string;
  recruiterContact?: string;
  notes?: string;
  fitScore?: number;
  firstResponseDate?: string;
  createdAt: string;
  updatedAt: string;
  missingSkills?: string[];
  interviewReminder?: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  round: number;
  interviewDate: string;
  interviewerName?: string;
  interviewerTitle?: string;
  interviewType: InterviewType;
  questions: string[];
  selfAnswers?: string[];
  feedback?: string;
  confidenceScore?: number; // 1-5
  fitScore?: number; // 1-5
  wantContinue: boolean;
  salaryDiscussed?: number;
  notes?: string;
  createdAt: string;
}

export interface FollowUp {
  id: string;
  applicationId: string;
  remindAt: string;
  sent: boolean;
  channel: 'EMAIL' | 'IN_APP';
  message?: string;
  createdAt: string;
}

export interface FitScoreAnalysis {
  score: number; // 0-100
  cvJdMatch: number;
  selfRating: number;
  processSignal: number;
  explanation: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export type ParsingStatus = 'UPLOADED' | 'ANALYZING' | 'READY' | 'NEEDS_REVIEW' | 'FAILED';

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  originalFileName: string;
  fileUrl: string;
  versionName?: string;
  parsingStatus: ParsingStatus;
  parsedContent?: string;
  extractedSkills?: string;
  qualityScore?: number;
  atsCompatibility?: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendations?: string;
  experienceCount?: number;
  isPrimary: boolean;
  usageCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResumePerformance {
  totalApplications: number;
  interviews: number;
  offers: number;
  successRate: number;
}

export interface ResumeEvent {
  type: string;
  description: string;
  createdAt: string;
}

export interface CVMatchResult {
  resumeId: string;
  resumeName: string;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  experienceScore: number;
  skillScore: number;
  keywordScore: number;
}

// ========================================
// ANALYTICS & DASHBOARD
// ========================================

export interface DashboardStats {
  totalApplications: number;
  activeApplications: number;
  interviewsScheduled: number;
  offersReceived: number;
  responseRate: number;
  averageFitScore: number;
}

export interface FunnelData {
  stage: ApplicationStatus;
  count: number;
  percentage: number;
}

export interface SourcePerformance {
  source: ApplicationSource;
  applications: number;
  interviews: number;
  offers: number;
  conversionRate: number;
}

export interface TimelineEvent {
  id: string;
  applicationId: string;
  type: 'STATUS_CHANGE' | 'INTERVIEW' | 'FOLLOW_UP' | 'NOTE';
  title: string;
  description?: string;
  timestamp: string;
}

// ========================================
// NOTIFICATIONS
// ========================================

export interface Notification {
  id: string;
  type: 'INTERVIEW_REMINDER' | 'FOLLOW_UP' | 'STATUS_UPDATE';
  title: string;
  content: string;
  channel: string;
  isRead: boolean;
  sentAt: string;
}

// ========================================
// API TYPES
// ========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  id: string;
  name: string;
  email: string;
  onboarded: boolean;
  emailNotificationsEnabled: boolean;
}

// ========================================
// FORM TYPES
// ========================================

export interface ApplicationFormData {
  companyName: string;
  position: string;
  status: ApplicationStatus;
  appliedDate: string;
  jdLink?: string;
  jdText?: string;
  source: ApplicationSource;
  salaryExpectation?: number;
  priority: Priority;
  tags: string[];
  cvVersion?: string;
  recruiterContact?: string;
  notes?: string;
  interviewReminder?: string;
}

export interface InterviewFormData {
  round: number;
  interviewDate: string;
  interviewerName?: string;
  interviewerTitle?: string;
  interviewType: InterviewType;
  questions: string[];
  selfAnswers?: string[];
  feedback?: string;
  confidenceScore?: number;
  fitScore?: number;
  wantContinue: boolean;
  salaryDiscussed?: number;
  notes?: string;
}

// ========================================
// FILTER & SORT TYPES
// ========================================

export interface ApplicationFilters {
  status?: ApplicationStatus[];
  priority?: Priority[];
  source?: ApplicationSource[];
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  minFitScore?: number;
  search?: string;
}

export type SortField =
  | 'appliedDate'
  | 'companyName'
  | 'position'
  | 'fitScore'
  | 'priority'
  | 'updatedAt';

export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  field: SortField;
  order: SortOrder;
}
