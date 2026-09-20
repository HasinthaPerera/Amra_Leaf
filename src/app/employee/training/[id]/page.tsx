'use client';

import React, { useMemo, useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Clock, ShieldCheck, AlertCircle, PlayCircle, Award, ArrowRight } from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/Feedback';
import { Breadcrumb } from '@/components/ui/Navigation';

interface EmployeeTrainingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EmployeeTrainingDetailPage({ params }: EmployeeTrainingDetailPageProps) {
  const { id } = use(params);
  const { quizzes } = useSimulation(); // Only for quiz logic
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [module, setModule] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchModule() {
      setLoadingData(true);
      try {
        const res = await fetch(`/api/employee/training/${id}`);
        if (res.ok) {
          const data = await res.json();
          setModule(data);
        }
      } catch (err) {
        console.error('Failed to fetch module', err);
      } finally {
        setLoadingData(false);
      }
    }
    fetchModule();
  }, [id]);

  const userProgress = module?.progress && module.progress.length > 0 ? module.progress[0] : null;
  const progressPercent = userProgress?.progressPercentage || 0;
  const status = userProgress?.status || 'NOT_STARTED';
  const isCompleted = status === 'COMPLETED';
  const isInProgress = status === 'IN_PROGRESS';

  // Find linked quiz
  const linkedQuiz = useMemo(() => {
    return quizzes.find((q) => q.trainingModuleId === id) || null;
  }, [quizzes, id]);

  const handleStartModule = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/employee/training/${id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'START' })
      });
      if (res.ok) {
        const newProgress = await res.json();
        setModule((prev: any) => ({
          ...prev,
          progress: [newProgress]
        }));
      }
    } catch (e) {
      console.error('Failed to start module', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteModule = async () => {
    if (isCompleted) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/employee/training/${id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'COMPLETE' })
      });
      if (res.ok) {
        const newProgress = await res.json();
        setModule((prev: any) => ({
          ...prev,
          progress: [newProgress]
        }));
      }
    } catch (e) {
      console.error('Failed to complete module', e);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <p className="font-bold text-sm text-slate-700">Loading module details...</p>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <AlertCircle className="w-12 h-12 mb-3 text-slate-300" />
        <h2 className="font-bold text-sm text-slate-700">Course Not Found</h2>
        <p className="text-xs text-slate-400 mb-4">No published training was found with the identifier: "{id}".</p>
        <Button variant="outline" size="sm" onClick={() => router.push('/employee/training')}>
          Return to Library
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Security Training', href: '/employee/training' },
          { label: module.title }
        ]}
      />

      {/* Header title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/employee/training')}
            className="p-1 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Awareness Education</p>
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">{module.title}</h2>
          </div>
        </div>

        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border ${
          isCompleted 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
            : isInProgress
            ? 'bg-amber-50 text-amber-850 border-amber-100'
            : 'bg-slate-50 text-slate-600 border-slate-200'
        }`}>
          {isCompleted ? 'Module Finished' : isInProgress ? 'Module In Progress' : 'Not Started'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Lesson markdown content */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 pb-3 mb-6">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Duration: {module.estimatedMinutes} mins
              </span>
              <span className="h-4 w-px bg-slate-200" />
              <span>Created: {new Date(module.createdAt).toISOString().split('T')[0]}</span>
            </div>

            <p className="text-xs text-slate-500 font-bold border-l-2 border-slate-300 pl-3 italic mb-6">
              {module.description}
            </p>

            {/* Markdown body render */}
            <div className={`prose prose-slate max-w-none text-slate-600 text-xs leading-relaxed whitespace-pre-wrap font-sans transition-opacity duration-300 ${status === 'NOT_STARTED' ? 'opacity-50 select-none blur-[1px]' : ''}`}>
              {module.content}
            </div>
          </Card>
        </div>

        {/* Right Column: Progress tracker and Quiz launcher */}
        <div className="space-y-4">
          <Card className="p-5 space-y-4 border-l-4 border-l-emerald-600">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <BookOpen className="w-4.5 h-4.5 text-emerald-500" />
              Course Progress
            </h3>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xxs font-bold text-slate-400 uppercase">
                <span>Completed</span>
                <span>{progressPercent}%</span>
              </div>
              <ProgressBar value={progressPercent} />
            </div>

            {isCompleted ? (
              <div className="space-y-3 bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
                  <Award className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800">Module Completed ✓</p>
                <p className="text-[10px] text-slate-400 leading-normal">You have completed reading the core materials of this module.</p>
              </div>
            ) : isInProgress ? (
              <Button
                variant="primary"
                className="w-full justify-center text-xs font-bold py-2.5 bg-emerald-600 hover:bg-emerald-500"
                onClick={handleCompleteModule}
                isLoading={loading}
              >
                COMPLETE TRAINING MODULE
              </Button>
            ) : (
              <Button
                variant="primary"
                className="w-full justify-center text-xs font-bold py-2.5"
                onClick={handleStartModule}
                isLoading={loading}
                leftIcon={<PlayCircle className="w-4 h-4" />}
              >
                START COURSE
              </Button>
            )}
          </Card>

          {/* Linked Quiz Box */}
          {linkedQuiz && (
            <Card className="p-5 space-y-4 border-l-4 border-l-purple-600">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4.5 h-4.5 text-purple-500" />
                Module Assessment
              </h3>
              
              <p className="text-xxs text-slate-400 leading-relaxed font-semibold">
                Test your knowledge now. Complete the multiple-choice quiz linked to this module to register your grade in the compliance directory.
              </p>

              <Link href={`/employee/quiz/${linkedQuiz.id}`}>
                <Button 
                  variant="primary" 
                  className="w-full justify-center text-xs font-bold py-2 bg-purple-600 hover:bg-purple-500"
                  disabled={!isCompleted}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  TAKE MODULE QUIZ
                </Button>
              </Link>
              
              {!isCompleted && (
                <p className="text-[10px] text-slate-400 leading-none text-center font-bold uppercase tracking-wider">
                  * Complete the training module to unlock the quiz.
                </p>
              )}
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
