import { Policy } from '@/types';

const POLICIES_KEY = 'amra_policies';

const getStoredPolicies = (): Policy[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(POLICIES_KEY);
  return stored ? JSON.parse(stored) : [];
};

const setStoredPolicies = (policies: Policy[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(POLICIES_KEY, JSON.stringify(policies));
};

export const policyService = {
  async getPolicies(): Promise<Policy[]> {
    await new Promise(r => setTimeout(r, 300));
    return getStoredPolicies();
  },

  async getPolicyById(id: string): Promise<Policy | null> {
    await new Promise(r => setTimeout(r, 200));
    const policies = getStoredPolicies();
    return policies.find(p => p.id === id) || null;
  },

  async createPolicy(policyData: Omit<Policy, 'id' | 'createdDate' | 'updatedDate'>): Promise<Policy> {
    await new Promise(r => setTimeout(r, 400));
    const policies = getStoredPolicies();
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

    setStoredPolicies([...policies, newPolicy]);
    return newPolicy;
  },

  async updatePolicy(id: string, updates: Partial<Policy>): Promise<Policy> {
    await new Promise(r => setTimeout(r, 300));
    const policies = getStoredPolicies();
    let updatedPolicy: Policy | null = null;

    const updated = policies.map(p => {
      if (p.id === id) {
        const isPublishing = updates.status === 'PUBLISHED' && p.status !== 'PUBLISHED';
        updatedPolicy = {
          ...p,
          ...updates,
          updatedDate: new Date().toISOString().split('T')[0],
          publishedDate: isPublishing ? new Date().toISOString().split('T')[0] : p.publishedDate,
        } as Policy;
        return updatedPolicy;
      }
      return p;
    });

    if (!updatedPolicy) throw new Error('Policy not found');
    setStoredPolicies(updated);
    return updatedPolicy;
  }
};
