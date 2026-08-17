'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { HelpCircle, Clock, BookOpen, AlertCircle, ShieldCheck, RefreshCw, PlayCircle } from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function EmployeeQuizListPage() {
  const { currentUser, quizzes, trainingModules, progressList } = useSimulation();

  // Load progress record for current employee
  const progress = useMemo(() => {
    if (!currentUser) return null;
    return progressList.find((p) => p.userId === currentUser.id) || null;
  }, [progressList, currentUser]);

  // Lookup training module name
  const getTrainingTitle = (moduleId?: string) => {
    if (!moduleId) return 'General Cybersecurity';
    const found = trainingModules.find((t) => t.id === moduleId);
    return found ? found.title : `Module: ${moduleId}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cybersecurity Evaluations</p>
        <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">Security Quizzes Directory</h2>
      </div>

      {quizzes.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12 text-slate-400">
          <AlertCircle className="w-12 h-12 mb-3 text-slate-300" />
          <p className="font-bold text-sm text-slate-700">No Quizzes Active</p>
          <p className="text-xs text-slate-400">Your cybersecurity administrator has not published any quizzes yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((q) => {
            const result = progress?.quizResults.find((qr) => qr.quizId === q.id);
            const isAttempted = !!result;
            const isPassed = result?.passed;
            const percentage = result?.percentage || 0;

            // Find associated training module to check if it's completed (unlocked)
            const linkedModule = trainingModules.find(t => t.id === q.trainingModuleId);
            const trainingState = progress?.trainingProgress.find(tp => tp.moduleId === q.trainingModuleId);
            const isModuleCompleted = !q.trainingModuleId || trainingState?.status === 'COMPLETED';

            return (
              <Card key={q.id} className="flex flex-col justify-between p-5 border border-slate-100 min-h-56 relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                      Category: {getTrainingTitle(q.trainingModuleId)}
                    </span>
                    
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xxs font-bold uppercase tracking-wider border ${
                      !isAttempted 
                        ? 'bg-slate-50 text-slate-500 border-slate-100'
                        : isPassed
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {!isAttempted ? 'Unattempted' : isPassed ? 'Passed' : 'Failed'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-800 leading-snug line-clamp-1 mb-1.5">
                      {q.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {q.description}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    {isAttempted ? (
                      <div className="text-xs">
                        <p className="font-bold text-slate-700 leading-none mb-1">
                          Previous Score: <span className={isPassed ? 'text-emerald-600' : 'text-red-500'}>{percentage}%</span>
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase leading-none">
                          {result.score} of {result.totalQuestions} Correct answers
                        </p>
                      </div>
                    ) : (
                      <p className="text-xxs text-slate-400 font-semibold uppercase tracking-wider leading-none">
                        Contains {q.questions.length} questions
                      </p>
                    )}
                  </div>

                  <div className="w-full sm:w-auto">
                    {isModuleCompleted ? (
                      <Link href={`/employee/quiz/${q.id}`}>
                        <Button 
                          variant={isPassed ? 'outline' : 'primary'} 
                          size="sm" 
                          className="py-1 px-4 text-xs w-full justify-center"
                          leftIcon={isAttempted ? <RefreshCw className="w-3.5 h-3.5" /> : <PlayCircle className="w-4 h-4" />}
                        >
                          {isPassed ? 'Retake Test' : isAttempted ? 'Retake Quiz' : 'Start Quiz'}
                        </Button>
                      </Link>
                    ) : (
                      <div className="space-y-1 w-full text-right sm:text-left">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="py-1 px-4 text-xs w-full opacity-60 cursor-not-allowed justify-center"
                          leftIcon={<PlayCircle className="w-4 h-4" />}
                        >
                          Start Quiz
                        </Button>
                        <p className="text-[9px] text-red-500 font-semibold block text-center uppercase tracking-wider">
                          * Locked. Complete "{linkedModule?.title}" module.
                        </p>
                      </div>
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
