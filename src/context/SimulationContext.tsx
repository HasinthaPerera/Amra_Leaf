'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Policy, TrainingModule, Quiz, QuizResult, 
  UserProgress, ComplianceRecord, DashboardStats, QuizQuestion
} from '@/types';
import { mockUsers } from '@/lib/mock-data/users';
import { mockPolicies } from '@/lib/mock-data/policies';
import { mockTrainingModules } from '@/lib/mock-data/training';
import { mockQuizzes } from '@/lib/mock-data/quizzes';
import { mockUserProgress } from '@/lib/mock-data/compliance';

interface SimulationContextType {
  users: User[];
  policies: Policy[];
  trainingModules: TrainingModule[];
  quizzes: Quiz[];
  progressList: UserProgress[];
  currentUser: User | null;
  loading: boolean;
  
  // Auth
  login: (email: string, password?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  
  // Employees - Migrated to real PostgreSQL API
  
  // Policies
  addPolicy: (policy: Omit<Policy, 'id' | 'createdDate' | 'updatedDate'>) => Policy;
  updatePolicy: (id: string, updates: Partial<Policy>) => void;
  publishPolicy: (id: string) => void;
  archivePolicy: (id: string) => void;
  
  // Training
  addTraining: (module: Omit<TrainingModule, 'id' | 'createdDate' | 'updatedDate'>) => TrainingModule;
  updateTraining: (id: string, updates: Partial<TrainingModule>) => void;
  
  // Quizzes
  addQuiz: (quiz: Omit<Quiz, 'id'>) => Quiz;
  updateQuiz: (id: string, updates: Partial<Quiz>) => void;
  deleteQuiz: (id: string) => void;
  
  // Employee Actions
  acknowledgePolicy: (policyId: string) => void;
  updateTrainingProgress: (moduleId: string, progress: number) => void;
  submitQuizResult: (quizId: string, answers: Record<string, number>) => QuizResult;
  
  // Queries
  getComplianceRecords: () => ComplianceRecord[];
  getDashboardStats: () => DashboardStats;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [progressList, setProgressList] = useState<UserProgress[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load state from localStorage or use defaults
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('amra_users');
      const storedPolicies = localStorage.getItem('amra_policies');
      const storedTraining = localStorage.getItem('amra_training');
      const storedQuizzes = localStorage.getItem('amra_quizzes');
      const storedProgress = localStorage.getItem('amra_progress');

      if (storedUsers) setUsers(JSON.parse(storedUsers));
      else {
        setUsers(mockUsers);
        localStorage.setItem('amra_users', JSON.stringify(mockUsers));
      }

      if (storedPolicies) setPolicies(JSON.parse(storedPolicies));
      else {
        setPolicies(mockPolicies);
        localStorage.setItem('amra_policies', JSON.stringify(mockPolicies));
      }

      if (storedTraining) setTrainingModules(JSON.parse(storedTraining));
      else {
        setTrainingModules(mockTrainingModules);
        localStorage.setItem('amra_training', JSON.stringify(mockTrainingModules));
      }

      if (storedQuizzes) setQuizzes(JSON.parse(storedQuizzes));
      else {
        setQuizzes(mockQuizzes);
        localStorage.setItem('amra_quizzes', JSON.stringify(mockQuizzes));
      }

      if (storedProgress) setProgressList(JSON.parse(storedProgress));
      else {
        setProgressList(mockUserProgress);
        localStorage.setItem('amra_progress', JSON.stringify(mockUserProgress));
      }

      // Check current session from server-side HttpOnly cookie
      fetch('/api/auth/me')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.user) {
            setCurrentUser(data.user);
          } else {
            setCurrentUser(null);
          }
        })
        .catch((err) => {
          console.error('Failed to verify session from server:', err);
          setCurrentUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (e) {
      console.error('Failed to parse localStorage data, resetting to mock data', e);
      setUsers(mockUsers);
      setPolicies(mockPolicies);
      setTrainingModules(mockTrainingModules);
      setQuizzes(mockQuizzes);
      setProgressList(mockUserProgress);
      setLoading(false);
    }
  }, []);

  // Save changes helper
  const saveState = (
    updatedUsers?: User[],
    updatedPolicies?: Policy[],
    updatedTraining?: TrainingModule[],
    updatedQuizzes?: Quiz[],
    updatedProgress?: UserProgress[],
    updatedUser?: User | null
  ) => {
    if (updatedUsers) {
      setUsers(updatedUsers);
      localStorage.setItem('amra_users', JSON.stringify(updatedUsers));
    }
    if (updatedPolicies) {
      setPolicies(updatedPolicies);
      localStorage.setItem('amra_policies', JSON.stringify(updatedPolicies));
    }
    if (updatedTraining) {
      setTrainingModules(updatedTraining);
      localStorage.setItem('amra_training', JSON.stringify(updatedTraining));
    }
    if (updatedQuizzes) {
      setQuizzes(updatedQuizzes);
      localStorage.setItem('amra_quizzes', JSON.stringify(updatedQuizzes));
    }
    if (updatedProgress) {
      setProgressList(updatedProgress);
      localStorage.setItem('amra_progress', JSON.stringify(updatedProgress));
    }
    if (updatedUser !== undefined) {
      setCurrentUser(updatedUser);
    }
  };

  // Auth implementation - Real server-side authentication
  const login = async (email: string, password?: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.user) {
        setLoading(false);
        return {
          success: false,
          error: data.error || 'Invalid email or password',
        };
      }

      const authenticatedUser: User = data.user;
      saveState(undefined, undefined, undefined, undefined, undefined, authenticatedUser);
      setLoading(false);
      return { success: true, user: authenticatedUser };
    } catch (err) {
      console.error('Authentication error:', err);
      setLoading(false);
      return { success: false, error: 'Invalid email or password' };
    }
  };

  const logout = () => {
    fetch('/api/auth/logout', { method: 'POST' })
      .catch((err) => console.error('Logout error:', err))
      .finally(() => {
        saveState(undefined, undefined, undefined, undefined, undefined, null);
      });
  };

  // Employee Management was migrated to PostgreSQL.

  // Policies implementation
  const addPolicy = (policyData: Omit<Policy, 'id' | 'createdDate' | 'updatedDate'>) => {
    const nextIdVal = policies.reduce((max, p) => {
      const num = parseInt(p.id.replace('POL', ''), 10);
      return num > max ? num : max;
    }, 8);
    const newId = `POL${String(nextIdVal + 1).padStart(3, '0')}`;
    
    const newPolicy: Policy = {
      ...policyData,
      id: newId,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      publishedDate: policyData.status === 'PUBLISHED' ? new Date().toISOString().split('T')[0] : undefined,
    };

    const updatedPolicies = [...policies, newPolicy];

    // Update progress records if policy is published
    let updatedProgress = [...progressList];
    if (newPolicy.status === 'PUBLISHED') {
      updatedProgress = progressList.map((p) => {
        // Only append if it doesn't already exist
        if (!p.policyProgress.some((pr) => pr.policyId === newId)) {
          return {
            ...p,
            policyProgress: [...p.policyProgress, { policyId: newId, status: 'PENDING' }],
          };
        }
        return p;
      });
    }

    saveState(undefined, updatedPolicies, undefined, undefined, updatedProgress);
    return newPolicy;
  };

  const updatePolicy = (id: string, updates: Partial<Policy>) => {
    const updatedPolicies = policies.map((p) => {
      if (p.id === id) {
        const isPublishing = updates.status === 'PUBLISHED' && p.status !== 'PUBLISHED';
        return {
          ...p,
          ...updates,
          updatedDate: new Date().toISOString().split('T')[0],
          publishedDate: isPublishing ? new Date().toISOString().split('T')[0] : p.publishedDate,
        } as Policy;
      }
      return p;
    });

    // Check if this policy was just published, if so add to employee progress lists
    const targetPolicy = policies.find((p) => p.id === id);
    let updatedProgress = [...progressList];
    if (targetPolicy && updates.status === 'PUBLISHED' && targetPolicy.status !== 'PUBLISHED') {
      updatedProgress = progressList.map((p) => {
        if (!p.policyProgress.some((pr) => pr.policyId === id)) {
          return {
            ...p,
            policyProgress: [...p.policyProgress, { policyId: id, status: 'PENDING' }],
          };
        }
        return p;
      });
    }

    saveState(undefined, updatedPolicies, undefined, undefined, updatedProgress);
  };

  const publishPolicy = (id: string) => {
    updatePolicy(id, { status: 'PUBLISHED' });
  };

  const archivePolicy = (id: string) => {
    updatePolicy(id, { status: 'ARCHIVED' });
  };

  // Training implementation
  const addTraining = (trainingData: Omit<TrainingModule, 'id' | 'createdDate' | 'updatedDate'>) => {
    const nextIdVal = trainingModules.reduce((max, t) => {
      const num = parseInt(t.id.replace('TRN', ''), 10);
      return num > max ? num : max;
    }, 7);
    const newId = `TRN${String(nextIdVal + 1).padStart(3, '0')}`;
    
    const newModule: TrainingModule = {
      ...trainingData,
      id: newId,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
    };

    const updatedTraining = [...trainingModules, newModule];

    // If published, add to progress trackers
    let updatedProgress = [...progressList];
    if (newModule.status === 'PUBLISHED') {
      updatedProgress = progressList.map((p) => {
        if (!p.trainingProgress.some((tr) => tr.moduleId === newId)) {
          return {
            ...p,
            trainingProgress: [...p.trainingProgress, { moduleId: newId, progressPercent: 0, status: 'NOT_STARTED' }],
          };
        }
        return p;
      });
    }

    saveState(undefined, undefined, updatedTraining, undefined, updatedProgress);
    return newModule;
  };

  const updateTraining = (id: string, updates: Partial<TrainingModule>) => {
    const updatedTraining = trainingModules.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          ...updates,
          updatedDate: new Date().toISOString().split('T')[0],
        } as TrainingModule;
      }
      return t;
    });

    let updatedProgress = [...progressList];
    const originalModule = trainingModules.find((t) => t.id === id);
    if (originalModule && updates.status === 'PUBLISHED' && originalModule.status !== 'PUBLISHED') {
      updatedProgress = progressList.map((p) => {
        if (!p.trainingProgress.some((tr) => tr.moduleId === id)) {
          return {
            ...p,
            trainingProgress: [...p.trainingProgress, { moduleId: id, progressPercent: 0, status: 'NOT_STARTED' }],
          };
        }
        return p;
      });
    }

    saveState(undefined, undefined, updatedTraining, undefined, updatedProgress);
  };

  // Quizzes implementation
  const addQuiz = (quizData: Omit<Quiz, 'id'>) => {
    const nextIdVal = quizzes.reduce((max, q) => {
      const num = parseInt(q.id.replace('QZ', ''), 10);
      return num > max ? num : max;
    }, 4);
    const newId = `QZ${String(nextIdVal + 1).padStart(3, '0')}`;
    
    const newQuiz: Quiz = {
      ...quizData,
      id: newId,
    };
    
    const updatedQuizzes = [...quizzes, newQuiz];
    saveState(undefined, undefined, undefined, updatedQuizzes);
    return newQuiz;
  };

  const updateQuiz = (id: string, updates: Partial<Quiz>) => {
    const updatedQuizzes = quizzes.map((q) => q.id === id ? { ...q, ...updates } : q);
    saveState(undefined, undefined, undefined, updatedQuizzes);
  };

  const deleteQuiz = (id: string) => {
    const updatedQuizzes = quizzes.filter((q) => q.id !== id);
    saveState(undefined, undefined, undefined, updatedQuizzes);
  };

  // Employee actions
  const acknowledgePolicy = (policyId: string) => {
    if (!currentUser) return;
    
    const updatedProgress = progressList.map((p) => {
      if (p.userId === currentUser.id) {
        const policyIndex = p.policyProgress.findIndex((pp) => pp.policyId === policyId);
        
        const newPolicyProgress = [...p.policyProgress];
        if (policyIndex >= 0) {
          newPolicyProgress[policyIndex] = {
            policyId,
            status: 'ACKNOWLEDGED',
            acknowledgedAt: new Date().toISOString(),
          };
        } else {
          newPolicyProgress.push({
            policyId,
            status: 'ACKNOWLEDGED',
            acknowledgedAt: new Date().toISOString(),
          });
        }
        
        return {
          ...p,
          policyProgress: newPolicyProgress,
        };
      }
      return p;
    });

    // Update currentUser activity timestamp
    const updatedUsers = users.map((u) => 
      u.id === currentUser.id ? { ...u, lastActivity: new Date().toISOString() } : u
    );

    saveState(updatedUsers, undefined, undefined, undefined, updatedProgress);
  };

  const updateTrainingProgress = (moduleId: string, progress: number) => {
    if (!currentUser) return;

    const updatedProgress = progressList.map((p) => {
      if (p.userId === currentUser.id) {
        const trainingIndex = p.trainingProgress.findIndex((tp) => tp.moduleId === moduleId);
        
        const newTrainingProgress = [...p.trainingProgress];
        const status = progress >= 100 ? 'COMPLETED' : 'IN_PROGRESS';
        const completedAt = progress >= 100 ? new Date().toISOString() : undefined;
        
        if (trainingIndex >= 0) {
          newTrainingProgress[trainingIndex] = {
            ...newTrainingProgress[trainingIndex],
            progressPercent: progress,
            status,
            completedAt: completedAt || newTrainingProgress[trainingIndex].completedAt,
          };
        } else {
          newTrainingProgress.push({
            moduleId,
            progressPercent: progress,
            status,
            completedAt,
          });
        }

        return {
          ...p,
          trainingProgress: newTrainingProgress,
        };
      }
      return p;
    });

    const updatedUsers = users.map((u) => 
      u.id === currentUser.id ? { ...u, lastActivity: new Date().toISOString() } : u
    );

    saveState(updatedUsers, undefined, undefined, undefined, updatedProgress);
  };

  const submitQuizResult = (quizId: string, answers: Record<string, number>) => {
    if (!currentUser) throw new Error('Not logged in');

    const quiz = quizzes.find((q) => q.id === quizId);
    if (!quiz) throw new Error('Quiz not found');

    let score = 0;
    quiz.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        score++;
      }
    });

    const percentage = Math.round((score / quiz.questions.length) * 100);
    const passed = percentage >= 70; // 70% passing grade standard

    const quizResult: QuizResult = {
      quizId,
      userId: currentUser.id,
      score,
      totalQuestions: quiz.questions.length,
      percentage,
      passed,
      submittedAt: new Date().toISOString(),
    };

    const updatedProgress = progressList.map((p) => {
      if (p.userId === currentUser.id) {
        // filter out previous attempts for simplicity or append. We will overwrite the previous attempts for compliance tracking.
        const filteredResults = p.quizResults.filter((qr) => qr.quizId !== quizId);
        return {
          ...p,
          quizResults: [...filteredResults, quizResult],
        };
      }
      return p;
    });

    const updatedUsers = users.map((u) => 
      u.id === currentUser.id ? { ...u, lastActivity: new Date().toISOString() } : u
    );

    saveState(updatedUsers, undefined, undefined, undefined, updatedProgress);
    return quizResult;
  };

  // Dynamically compute compliance records
  const getComplianceRecords = (): ComplianceRecord[] => {
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

        // Deactivated employee handling
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
  };

  // Compute dashboard metrics
  const getDashboardStats = (): DashboardStats => {
    const employees = users.filter((u) => u.role === 'employee' && u.status === 'active');
    const pubPolicies = policies.filter((p) => p.status === 'PUBLISHED').length;
    const pubTraining = trainingModules.filter((t) => t.status === 'PUBLISHED').length;
    
    const records = getComplianceRecords();
    const activeRecords = records.filter(r => {
      const u = users.find(user => user.id === r.userId);
      return u && u.status === 'active';
    });

    const avgCompliance = activeRecords.length > 0
      ? Math.round(
          activeRecords.reduce((acc, r) => {
            const progress = progressList.find((p) => p.userId === r.userId);
            const policyRate = r.policyCompletionRate;
            const trainingRate = r.trainingCompletionRate;
            const quizRate = r.averageQuizScore;
            return acc + (policyRate + trainingRate + quizRate) / 3;
          }, 0) / activeRecords.length
        )
      : 0;

    return {
      totalEmployees: employees.length,
      publishedPolicies: pubPolicies,
      trainingModules: pubTraining,
      complianceRate: avgCompliance,
    };
  };

  return (
    <SimulationContext.Provider
      value={{
        users,
        policies,
        trainingModules,
        quizzes,
        progressList,
        currentUser,
        loading,
        login,
        logout,
        addPolicy,
        updatePolicy,
        publishPolicy,
        archivePolicy,
        addTraining,
        updateTraining,
        addQuiz,
        updateQuiz,
        deleteQuiz,
        acknowledgePolicy,
        updateTrainingProgress,
        submitQuizResult,
        getComplianceRecords,
        getDashboardStats,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
