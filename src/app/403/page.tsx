'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ForbiddenPage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.replace('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-red-500/10 blur-[120px]" />
      
      <div className="max-w-md w-full text-center z-10 bg-slate-800 border border-slate-700/60 p-8 rounded-2xl shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-red-950/45 border border-red-900/60 p-4 rounded-full text-red-500 shadow-xl shadow-red-500/5">
            <ShieldAlert className="w-16 h-16 animate-pulse" />
          </div>
        </div>
        
        <h1 className="text-3xl font-black text-white tracking-tight uppercase mb-2">
          403 - ACCESS DENIED
        </h1>
        
        <p className="text-slate-400 font-medium text-sm leading-relaxed mb-8">
          Your credentials do not possess authorization to access this administrative segment. This incident has been logged by the security monitor.
        </p>

        <Button
          variant="danger"
          onClick={handleGoHome}
          className="w-full justify-center font-bold uppercase tracking-wider py-2.5"
          leftIcon={<ChevronLeft className="w-4 h-4" />}
        >
          Return to Portal
        </Button>
      </div>
    </div>
  );
}
