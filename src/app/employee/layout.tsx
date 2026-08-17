'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSimulation } from '@/context/SimulationContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { LoadingSpinner } from '@/components/ui/Feedback';

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useSimulation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Route security: client-side role authorization check
  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.replace('/login');
      } else if (currentUser.role !== 'employee') {
        router.replace('/403');
      }
    }
  }, [currentUser, loading, router]);

  if (loading || !currentUser || currentUser.role !== 'employee') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <LoadingSpinner label="Authenticating employee credentials..." />
      </div>
    );
  }

  // Derive dynamic page titles from route pathname
  const getPageTitle = () => {
    if (pathname.includes('/dashboard')) return 'Employee Hub';
    if (pathname.includes('/policies')) return 'Company Policies';
    if (pathname.includes('/training')) return 'Security training';
    if (pathname.includes('/quiz')) return 'Knowledge Quizzes';
    if (pathname.includes('/progress')) return 'My Progress Profile';
    return 'Amra Leaf Security';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar Navigation */}
      <Sidebar 
        role="employee" 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Navbar 
          role="employee" 
          title={getPageTitle()} 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
        
        {/* Main Route Content viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}
