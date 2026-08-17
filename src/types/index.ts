export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  department: string;
  status: 'active' | 'inactive';
  lastActivity: string;
}

export interface Policy {
  id: string;
  title: string;
  category: string;
  content: string;
  version: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdDate: string;
  updatedDate: string;
  publishedDate?: string;
}

export interface PolicyAcknowledgement {
  policyId: string;
  userId: string;
  acknowledgedAt: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  content: string; // Detail markdown/text content
  estimatedDuration: string; // e.g. "10 mins"
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdDate: string;
  updatedDate: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string]; // Exactly 4 options
  correctAnswer: number; // 0, 1, 2, 3
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  trainingModuleId?: string; // Optional links to training modules
  questions: QuizQuestion[];
}

export interface QuizResult {
  quizId: string;
  userId: string;
  score: number; // Correct answers
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  submittedAt: string;
}

export interface UserProgress {
  userId: string;
  policyProgress: {
    policyId: string;
    status: 'PENDING' | 'ACKNOWLEDGED';
    acknowledgedAt?: string;
  }[];
  trainingProgress: {
    moduleId: string;
    progressPercent: number; // 0 to 100
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    completedAt?: string;
  }[];
  quizResults: QuizResult[];
}

export interface ComplianceRecord {
  userId: string;
  userName: string;
  userEmail: string;
  department: string;
  policyCompletionRate: number; // percentage
  trainingCompletionRate: number; // percentage
  averageQuizScore: number; // percentage
  overallStatus: 'COMPLIANT' | 'PENDING' | 'INCOMPLETE';
  lastActivity: string;
}

export interface DashboardStats {
  totalEmployees: number;
  publishedPolicies: number;
  trainingModules: number;
  complianceRate: number;
}
