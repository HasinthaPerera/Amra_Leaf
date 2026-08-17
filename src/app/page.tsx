'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSimulation } from '@/context/SimulationContext';
import { LoadingSpinner } from '@/components/ui/Feedback';

export default function Home() {
  const { currentUser, loading } = useSimulation();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (currentUser) {
        if (currentUser.role === 'admin') {
          router.replace('/admin/dashboard');
        } else {
          router.replace('/employee/dashboard');
        }
      } else {
        router.replace('/login');
      }
    }
  }, [currentUser, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <LoadingSpinner label="Directing to secure portal..." />
    </div>
  );
}
