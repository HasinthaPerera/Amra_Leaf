import { TrainingModule } from '@/types';

const TRAINING_KEY = 'amra_training';

const getStoredTraining = (): TrainingModule[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(TRAINING_KEY);
  return stored ? JSON.parse(stored) : [];
};

const setStoredTraining = (modules: TrainingModule[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TRAINING_KEY, JSON.stringify(modules));
};

export const trainingService = {
  async getTrainingModules(): Promise<TrainingModule[]> {
    await new Promise(r => setTimeout(r, 300));
    return getStoredTraining();
  },

  async getTrainingById(id: string): Promise<TrainingModule | null> {
    await new Promise(r => setTimeout(r, 200));
    const modules = getStoredTraining();
    return modules.find(t => t.id === id) || null;
  },

  async createTraining(trainingData: Omit<TrainingModule, 'id' | 'createdDate' | 'updatedDate'>): Promise<TrainingModule> {
    await new Promise(r => setTimeout(r, 400));
    const modules = getStoredTraining();
    const nextIdVal = modules.reduce((max, t) => {
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

    setStoredTraining([...modules, newModule]);
    return newModule;
  },

  async updateTraining(id: string, updates: Partial<TrainingModule>): Promise<TrainingModule> {
    await new Promise(r => setTimeout(r, 300));
    const modules = getStoredTraining();
    let updatedModule: TrainingModule | null = null;

    const updated = modules.map(t => {
      if (t.id === id) {
        updatedModule = {
          ...t,
          ...updates,
          updatedDate: new Date().toISOString().split('T')[0],
        } as TrainingModule;
        return updatedModule;
      }
      return t;
    });

    if (!updatedModule) throw new Error('Training module not found');
    setStoredTraining(updated);
    return updatedModule;
  }
};
