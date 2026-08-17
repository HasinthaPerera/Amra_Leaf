import { ComplianceRecord, DashboardStats, User, Policy, TrainingModule, Quiz, UserProgress } from '@/types';

const USERS_KEY = 'amra_users';
const POLICIES_KEY = 'amra_policies';
const TRAINING_KEY = 'amra_training';
const QUIZZES_KEY = 'amra_quizzes';
const PROGRESS_KEY = 'amra_progress';

const getStoredData = <T>(key: string): T[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

export const complianceService = {
  async getComplianceRecords(): Promise<ComplianceRecord[]> {
    await new Promise(r => setTimeout(r, 400));
    
    const users = getStoredData<User>(USERS_KEY);
    const policies = getStoredData<Policy>(POLICIES_KEY);
    const trainingModules = getStoredData<TrainingModule>(TRAINING_KEY);
    const quizzes = getStoredData<Quiz>(QUIZZES_KEY);
    const progressList = getStoredData<UserProgress>(PROGRESS_KEY);

    const publishedPolicies = policies.filter((p) => p.status === 'PUBLISHED');
    const publishedTraining = trainingModules.filter((t) => t.status === 'PUBLISHED');
    const publishedQuizzes = quizzes; // All quizzes

    return users
      .filter((u) => u.role === 'employee')
      .map((employee) => {
        const progress = progressList.find((p) => p.userId === employee.id);
        
        let policyRate = 0;
        let trainingRate = 0;
        let averageQuiz = 0;

        if (progress) {
          // 1. Policy rate
          const ackedPolicies = progress.policyProgress.filter(
            (pp) => pp.status === 'ACKNOWLEDGED' && publishedPolicies.some((p) => p.id === pp.policyId)
          ).length;
          policyRate = publishedPolicies.length > 0 
            ? Math.round((ackedPolicies / publishedPolicies.length) * 100) 
            : 100;

          // 2. Training rate
          const completedTraining = progress.trainingProgress.filter(
            (tp) => tp.status === 'COMPLETED' && publishedTraining.some((t) => t.id === tp.moduleId)
          ).length;
          trainingRate = publishedTraining.length > 0 
            ? Math.round((completedTraining / publishedTraining.length) * 100) 
            : 100;

          // 3. Quiz average score
          const passingQuizzes = progress.quizResults.filter(
            (qr) => qr.passed && publishedQuizzes.some((q) => q.id === qr.quizId)
          ).length;
          averageQuiz = publishedQuizzes.length > 0 
            ? Math.round((passingQuizzes / publishedQuizzes.length) * 100) 
            : 100;
        }

        const overallCompliance = Math.round((policyRate + trainingRate + averageQuiz) / 3);
        
        let status: 'COMPLIANT' | 'PENDING' | 'INCOMPLETE' = 'INCOMPLETE';
        if (overallCompliance >= 85) {
          status = 'COMPLIANT';
        } else if (overallCompliance >= 50) {
          status = 'PENDING';
        }

        if (employee.status === 'inactive') {
          status = 'INCOMPLETE';
        }

        return {
          userId: employee.id,
          userName: employee.name,
          userEmail: employee.email,
          department: employee.department,
          policyCompletionRate: policyRate,
          trainingCompletionRate: trainingRate,
          averageQuizScore: averageQuiz,
          overallStatus: status,
          lastActivity: employee.lastActivity,
        };
      });
  },

  async getDashboardStats(): Promise<DashboardStats> {
    await new Promise(r => setTimeout(r, 450));
    
    const users = getStoredData<User>(USERS_KEY);
    const policies = getStoredData<Policy>(POLICIES_KEY);
    const trainingModules = getStoredData<TrainingModule>(TRAINING_KEY);
    const quizzes = getStoredData<Quiz>(QUIZZES_KEY);
    const progressList = getStoredData<UserProgress>(PROGRESS_KEY);

    const employees = users.filter((u) => u.role === 'employee' && u.status === 'active');
    const pubPolicies = policies.filter((p) => p.status === 'PUBLISHED').length;
    const pubTraining = trainingModules.filter((t) => t.status === 'PUBLISHED').length;
    
    const publishedPolicies = policies.filter((p) => p.status === 'PUBLISHED');
    const publishedTraining = trainingModules.filter((t) => t.status === 'PUBLISHED');
    const publishedQuizzes = quizzes;

    const activeRecords = employees.map(employee => {
      const progress = progressList.find((p) => p.userId === employee.id);
      
      let policyRate = 0;
      let trainingRate = 0;
      let averageQuiz = 0;

      if (progress) {
        const ackedPolicies = progress.policyProgress.filter(
          (pp) => pp.status === 'ACKNOWLEDGED' && publishedPolicies.some((p) => p.id === pp.policyId)
        ).length;
        policyRate = publishedPolicies.length > 0 ? (ackedPolicies / publishedPolicies.length) * 100 : 100;

        const completedTraining = progress.trainingProgress.filter(
          (tp) => tp.status === 'COMPLETED' && publishedTraining.some((t) => t.id === tp.moduleId)
        ).length;
        trainingRate = publishedTraining.length > 0 ? (completedTraining / publishedTraining.length) * 100 : 100;

        const passingQuizzes = progress.quizResults.filter(
          (qr) => qr.passed && publishedQuizzes.some((q) => q.id === qr.quizId)
        ).length;
        averageQuiz = publishedQuizzes.length > 0 ? (passingQuizzes / publishedQuizzes.length) * 100 : 100;
      }

      return (policyRate + trainingRate + averageQuiz) / 3;
    });

    const avgCompliance = activeRecords.length > 0
      ? Math.round(activeRecords.reduce((acc, val) => acc + val, 0) / activeRecords.length)
      : 0;

    return {
      totalEmployees: employees.length,
      publishedPolicies: pubPolicies,
      trainingModules: pubTraining,
      complianceRate: avgCompliance,
    };
  }
};
