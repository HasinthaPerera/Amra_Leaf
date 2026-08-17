'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { GraduationCap, Search, Clock, Award, BookOpen, AlertCircle } from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';
import { SearchBar } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/Feedback';

export default function EmployeeTrainingListPage() {
  const { currentUser, trainingModules, progressList } = useSimulation();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Load progress record for current employee
  const progress = useMemo(() => {
    if (!currentUser) return null;
    return progressList.find((p) => p.userId === currentUser.id) || null;
  }, [progressList, currentUser]);

  const publishedModules = useMemo(() => {
    return trainingModules.filter((t) => t.status === 'PUBLISHED');
  }, [trainingModules]);

  // Filtered training modules list
  const filteredModules = useMemo(() => {
    return publishedModules.filter((t) => {
      const matchSearch = 
        t.title.toLowerCase().includes(search.toLowerCase()) || 
        t.description.toLowerCase().includes(search.toLowerCase());
      
      const state = progress?.trainingProgress.find((tp) => tp.moduleId === t.id);
      const isCompleted = state?.status === 'COMPLETED';
      const isInProgress = state?.status === 'IN_PROGRESS';
      const isNotStarted = !state || state.status === 'NOT_STARTED';

      let matchStatus = true;
      if (statusFilter === 'COMPLETED') matchStatus = isCompleted;
      else if (statusFilter === 'IN_PROGRESS') matchStatus = isInProgress;
      else if (statusFilter === 'NOT_STARTED') matchStatus = isNotStarted;

      return matchSearch && matchStatus;
    });
  }, [publishedModules, search, statusFilter, progress]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Education & Awareness</p>
        <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">Security Awareness Library</h2>
      </div>

      {/* Search and Filters panel */}
      <Card className="p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <SearchBar 
            placeholder="Search courses by module title or subject description..." 
            onSearch={(val) => setSearch(val)} 
          />
        </div>
        <div className="w-full md:w-64">
          <label className="block text-xxs font-bold text-slate-400 uppercase tracking-widest mb-1">
            Filter by Course Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
          >
            <option value="ALL">All Lessons</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </Card>

      {/* Course Card Deck */}
      {filteredModules.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12 text-slate-400">
          <AlertCircle className="w-12 h-12 mb-3 text-slate-300" />
          <p className="font-bold text-sm text-slate-700">No Lessons Found</p>
          <p className="text-xs text-slate-400">Try adjusting your filters or check back later.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((t) => {
            const state = progress?.trainingProgress.find((tp) => tp.moduleId === t.id);
            const progressVal = state?.progressPercent || 0;
            const status = state?.status || 'NOT_STARTED';

            return (
              <Card key={t.id} className="flex flex-col justify-between p-5 border border-slate-100 min-h-60 relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {t.estimatedDuration}
                    </span>
                    
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xxs font-bold uppercase tracking-wider border ${
                      status === 'COMPLETED' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : status === 'IN_PROGRESS'
                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                        : 'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                      {status === 'COMPLETED' ? 'Completed' : status === 'IN_PROGRESS' ? 'In Progress' : 'Not Started'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-800 leading-snug line-clamp-1 mb-1.5">
                      {t.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 space-y-3.5">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>Module Progress</span>
                      <span>{progressVal}%</span>
                    </div>
                    <ProgressBar value={progressVal} />
                  </div>

                  <div className="flex justify-end pt-1">
                    <Link href={`/employee/training/${t.id}`}>
                      <Button 
                        variant={status === 'COMPLETED' ? 'outline' : 'primary'} 
                        size="sm" 
                        className="py-1 px-3 text-xs w-full justify-center"
                        leftIcon={status === 'COMPLETED' ? <Award className="w-4 h-4 text-emerald-500" /> : <BookOpen className="w-4 h-4" />}
                      >
                        {status === 'COMPLETED' ? 'Review Lessons' : status === 'IN_PROGRESS' ? 'Continue Course' : 'Start Course'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
