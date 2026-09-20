'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HelpCircle, Clock, BookOpen, AlertCircle, ShieldCheck, RefreshCw, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface EmployeeQuiz {
  id: string;
  title: string;
  description: string;
  passMark: number;
  trainingId: string;
  trainingTitle: string;
  questionCount: number;
  state: 'LOCKED' | 'AVAILABLE' | 'PASSED';
  latestAttempt: any;
}

export default function EmployeeQuizListPage() {
  const [quizzes, setQuizzes] = useState<EmployeeQuiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const res = await fetch('/api/employee/quizzes');
        if (res.ok) {
          const data = await res.json();
          setQuizzes(data);
        }
      } catch (err) {
        console.error('Failed to load employee quizzes', err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading quizzes...</div>;
  }

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
            const isAttempted = !!q.latestAttempt;
            const latestPassed = q.latestAttempt?.passed;
            const percentage = q.latestAttempt?.percentage || 0;
            const isLocked = q.state === 'LOCKED';
            const requirementPassed = q.state === 'PASSED';

            return (
               <Card key={q.id} className={`flex flex-col justify-between p-5 border min-h-56 relative overflow-hidden ${isLocked ? 'border-slate-100 opacity-70' : 'border-slate-200'}`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                      Category: {q.trainingTitle || 'General Cybersecurity'}
                    </span>
                    
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xxs font-bold uppercase tracking-wider border ${
                      !isAttempted 
                        ? 'bg-slate-50 text-slate-500 border-slate-100'
                        : latestPassed
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {!isAttempted ? 'Unattempted' : latestPassed ? 'Passed' : 'Failed'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-800 leading-snug line-clamp-1 mb-1.5 flex items-center gap-2">
                      {q.title}
                      {requirementPassed && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
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
                          Previous Score: <span className={latestPassed ? 'text-emerald-600' : 'text-red-500'}>{percentage}%</span>
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase leading-none">
                          {q.latestAttempt.score} of {q.latestAttempt.totalQuestions} Correct answers
                        </p>
                      </div>
                    ) : (
                      <p className="text-xxs text-slate-400 font-semibold uppercase tracking-wider leading-none">
                        Contains {q.questionCount} questions
                      </p>
                    )}
                  </div>

                  <div className="w-full sm:w-auto">
                    {!isLocked ? (
                      <Link href={`/employee/quiz/${q.id}`}>
                        <Button 
                          variant={latestPassed ? 'outline' : 'primary'} 
                          size="sm" 
                          className="py-1 px-4 text-xs w-full justify-center"
                          leftIcon={isAttempted ? <RefreshCw className="w-3.5 h-3.5" /> : <PlayCircle className="w-4 h-4" />}
                        >
                          {latestPassed ? 'Retake Test' : isAttempted ? 'Retake Quiz' : 'Start Quiz'}
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
                          * Locked. Complete "{q.trainingTitle}" module.
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
