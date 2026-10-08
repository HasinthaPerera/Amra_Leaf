'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Clock, Award, BookOpen, AlertCircle, HelpCircle, ShieldAlert } from 'lucide-react';
import { SearchBar } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar, StatusBadge } from '@/components/ui/Feedback';

export default function EmployeeTrainingListPage() {
  const [trainingModules, setTrainingModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    async function fetchModules() {
      setLoading(true);
      try {
        const res = await fetch('/api/employee/training');
        if (res.ok) {
          const data = await res.json();
          setTrainingModules(data);
        }
      } catch (err) {
        console.error('Failed to fetch training modules', err);
      } finally {
        setLoading(false);
      }
    }
    fetchModules();
  }, []);

  // Filtered training modules list
  const filteredModules = useMemo(() => {
    return trainingModules.filter((t) => {
      const matchSearch = 
        t.title.toLowerCase().includes(search.toLowerCase()) || 
        (t.description || '').toLowerCase().includes(search.toLowerCase());
      
      const status = t.moduleStatus || 'NOT_STARTED';

      let matchStatus = true;
      if (statusFilter !== 'ALL') {
        matchStatus = status === statusFilter;
      }

      return matchSearch && matchStatus;
    });
  }, [trainingModules, search, statusFilter]);

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
            Filter by Module Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
          >
            <option value="ALL">All Modules</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="PENDING_ASSESSMENT">Pending Assessment</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </Card>

      {/* Course Card Deck */}
      {loading ? (
        <Card className="flex flex-col items-center justify-center py-12 text-slate-400">
          <p className="font-bold text-sm text-slate-700">Loading modules...</p>
        </Card>
      ) : filteredModules.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12 text-slate-400">
          <AlertCircle className="w-12 h-12 mb-3 text-slate-300" />
          <p className="font-bold text-sm text-slate-700">No Lessons Found</p>
          <p className="text-xs text-slate-400">Try adjusting your filters or check back later.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((t) => {
            const userProgress = t.progress && t.progress.length > 0 ? t.progress[0] : null;
            const progressVal = userProgress?.progressPercentage || 0;
            const status = t.moduleStatus || 'NOT_STARTED';
            const quizInfo = t.quizInfo;
            const latestAttempt = quizInfo?.latestAttempt;
            const isQuizFailed = quizInfo && latestAttempt && !latestAttempt.passed;

            return (
              <Card key={t.id} className="flex flex-col justify-between p-5 border border-slate-100 min-h-64 relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {t.estimatedMinutes} mins
                    </span>
                    
                    <StatusBadge status={status} />
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-800 leading-snug line-clamp-1 mb-1.5">
                      {t.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {t.description}
                    </p>
                  </div>

                  {/* Case 4 Notice: Content Completed, Quiz Failed */}
                  {status === 'PENDING_ASSESSMENT' && isQuizFailed && (
                    <div className="bg-red-50/70 border border-red-200/70 rounded-lg p-2.5 text-xxs text-red-700 space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                          Previous Score: {latestAttempt.percentage}%
                        </span>
                        <span className="text-red-600 uppercase">Failed</span>
                      </div>
                      <p className="font-medium text-[11px] leading-tight text-red-800">
                        You must pass the quiz to successfully complete this training module.
                      </p>
                    </div>
                  )}

                  {/* Case 3 Notice: Content Completed, Quiz Not Attempted */}
                  {status === 'PENDING_ASSESSMENT' && !isQuizFailed && (
                    <div className="bg-amber-50/70 border border-amber-200/70 rounded-lg p-2.5 text-xxs text-amber-800 space-y-0.5">
                      <p className="font-bold flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                        Assessment Required
                      </p>
                      <p className="font-medium text-[11px] leading-tight text-amber-700">
                        Training content finished. Pass the related quiz to complete this module.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 space-y-3.5">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>Content Progress</span>
                      <span>{progressVal}%</span>
                    </div>
                    <ProgressBar value={progressVal} />
                  </div>

                  <div className="flex gap-2 pt-1">
                    {status === 'PENDING_ASSESSMENT' && quizInfo?.id ? (
                      <>
                        <Link href={`/employee/training/${t.id}`} className="flex-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="py-1 px-2 text-xs w-full justify-center"
                            leftIcon={<BookOpen className="w-3.5 h-3.5" />}
                          >
                            Review
                          </Button>
                        </Link>
                        <Link href={`/employee/quiz/${quizInfo.id}`} className="flex-1">
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="py-1 px-2 text-xs w-full justify-center bg-purple-600 hover:bg-purple-500"
                            leftIcon={<HelpCircle className="w-3.5 h-3.5" />}
                          >
                            {isQuizFailed ? 'Retake Quiz' : 'Take Quiz'}
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <Link href={`/employee/training/${t.id}`} className="w-full">
                        <Button 
                          variant={status === 'COMPLETED' ? 'outline' : 'primary'} 
                          size="sm" 
                          className="py-1 px-3 text-xs w-full justify-center"
                          leftIcon={status === 'COMPLETED' ? <Award className="w-4 h-4 text-emerald-500" /> : <BookOpen className="w-4 h-4" />}
                        >
                          {status === 'COMPLETED' ? 'Review Lessons' : status === 'IN_PROGRESS' ? 'Continue Course' : 'Start Course'}
                        </Button>
                      </Link>
                    )}
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
