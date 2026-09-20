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
  // Policy CRUD operations were migrated to PostgreSQL API.
  // Training and Quizzes are fully migrated to PostgreSQL API.
  // Compliance and Dashboard stats are dynamically calculated on the server.

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
