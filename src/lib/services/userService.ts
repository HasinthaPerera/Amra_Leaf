import { User } from '@/types';

const USERS_KEY = 'amra_users';

const getStoredUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

const setStoredUsers = (users: User[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const userService = {
  async getUsers(): Promise<User[]> {
    await new Promise(r => setTimeout(r, 300));
    return getStoredUsers();
  },

  async getUserById(id: string): Promise<User | null> {
    await new Promise(r => setTimeout(r, 200));
    const users = getStoredUsers();
    return users.find(u => u.id === id) || null;
  },

  async createEmployee(employeeData: Omit<User, 'id' | 'lastActivity'>): Promise<User> {
    await new Promise(r => setTimeout(r, 400));
    const users = getStoredUsers();
    const nextIdVal = users
      .filter((u) => u.role === 'employee')
      .reduce((max, u) => {
        const num = parseInt(u.id.replace('EMP', ''), 10);
        return num > max ? num : max;
      }, 8);
    const newId = `EMP${String(nextIdVal + 1).padStart(3, '0')}`;
    
    const newEmployee: User = {
      ...employeeData,
      id: newId,
      lastActivity: new Date().toISOString(),
    };

    setStoredUsers([...users, newEmployee]);
    return newEmployee;
  },

  async updateEmployee(id: string, updates: Partial<User>): Promise<User> {
    await new Promise(r => setTimeout(r, 300));
    const users = getStoredUsers();
    let updatedUser: User | null = null;
    
    const updatedUsers = users.map(u => {
      if (u.id === id) {
        updatedUser = { ...u, ...updates } as User;
        return updatedUser;
      }
      return u;
    });

    if (!updatedUser) throw new Error('User not found');
    setStoredUsers(updatedUsers);
    return updatedUser;
  }
};
