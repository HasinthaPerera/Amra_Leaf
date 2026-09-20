'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface SimulationContextType {
  currentUser: User | null;
  loading: boolean;
  
  // Auth
  login: (email: string, password?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check current session from server-side HttpOnly cookie
  useEffect(() => {
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
  }, []);

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
      setCurrentUser(authenticatedUser);
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
        setCurrentUser(null);
      });
  };

  return (
    <SimulationContext.Provider
      value={{
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

