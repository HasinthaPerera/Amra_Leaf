'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSimulation } from '@/context/SimulationContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { LoadingSpinner } from '@/components/ui/Feedback';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useSimulation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Route security: client-side role authorization check
  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.replace('/login');
      } else if (currentUser.role !== 'admin') {
        router.replace('/403');
      }
    }
  }, [currentUser, loading, router]);

  if (loading || !currentUser || currentUser.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <LoadingSpinner label="Authenticating administrative session..." />
      </div>
    );
  }

  // Derive dynamic page titles from route pathname
  const getPageTitle = () => {
    if (pathname.includes('/dashboard')) return 'Admin Dashboard';
    if (pathname.includes('/employees')) return 'Employee Directory';
    if (pathname.includes('/policies')) return 'Cybersecurity Policies';
    if (pathname.includes('/training')) return 'Training Modules';
    if (pathname.includes('/quizzes')) return 'Security Quizzes';
    if (pathname.includes('/compliance')) return 'Compliance Audits';
    return 'Amra Leaf Security';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar Navigation */}
      <Sidebar 
        role="admin" 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Navbar 
          role="admin" 
          title={getPageTitle()} 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
        
        {/* Main Route Content viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
