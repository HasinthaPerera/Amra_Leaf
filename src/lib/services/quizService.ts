import { Quiz } from '@/types';

const QUIZZES_KEY = 'amra_quizzes';

const getStoredQuizzes = (): Quiz[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(QUIZZES_KEY);
  return stored ? JSON.parse(stored) : [];
};

const setStoredQuizzes = (quizzes: Quiz[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
};

export const quizService = {
  async getQuizzes(): Promise<Quiz[]> {
    await new Promise(r => setTimeout(r, 300));
    return getStoredQuizzes();
  },

  async getQuizById(id: string): Promise<Quiz | null> {
    await new Promise(r => setTimeout(r, 200));
    const quizzes = getStoredQuizzes();
    return quizzes.find(q => q.id === id) || null;
  },

  async createQuiz(quizData: Omit<Quiz, 'id'>): Promise<Quiz> {
    await new Promise(r => setTimeout(r, 400));
    const quizzes = getStoredQuizzes();
    const nextIdVal = quizzes.reduce((max, q) => {
      const num = parseInt(q.id.replace('QZ', ''), 10);
      return num > max ? num : max;
    }, 4);
    const newId = `QZ${String(nextIdVal + 1).padStart(3, '0')}`;

    const newQuiz: Quiz = {
      ...quizData,
      id: newId,
    };

    setStoredQuizzes([...quizzes, newQuiz]);
    return newQuiz;
  },

  async updateQuiz(id: string, updates: Partial<Quiz>): Promise<Quiz> {
    await new Promise(r => setTimeout(r, 300));
    const quizzes = getStoredQuizzes();
    let updatedQuiz: Quiz | null = null;

    const updated = quizzes.map(q => {
      if (q.id === id) {
        updatedQuiz = { ...q, ...updates } as Quiz;
        return updatedQuiz;
      }
      return q;
    });

    if (!updatedQuiz) throw new Error('Quiz not found');
    setStoredQuizzes(updated);
    return updatedQuiz;
  },

  async deleteQuiz(id: string): Promise<void> {
    await new Promise(r => setTimeout(r, 200));
    const quizzes = getStoredQuizzes();
    const filtered = quizzes.filter(q => q.id !== id);
    setStoredQuizzes(filtered);
  }
};
