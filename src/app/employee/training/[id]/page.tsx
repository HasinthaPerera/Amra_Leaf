'use client';

import React, { useMemo, useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, BookOpen, Clock, ShieldCheck, AlertCircle, 
  PlayCircle, Award, ArrowRight, ShieldAlert, RefreshCw, CheckCircle2 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar, StatusBadge } from '@/components/ui/Feedback';
import { Breadcrumb } from '@/components/ui/Navigation';

interface EmployeeTrainingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EmployeeTrainingDetailPage({ params }: EmployeeTrainingDetailPageProps) {
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [module, setModule] = useState<any>(null);
  const router = useRouter();

  const fetchModule = async () => {
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
  };

  useEffect(() => {
    fetchModule();
  }, [id]);

  const userProgress = module?.progress && module.progress.length > 0 ? module.progress[0] : null;
  const progressPercent = userProgress?.progressPercentage || 0;
  const isContentCompleted = userProgress?.status === 'COMPLETED';
  const isInProgress = userProgress?.status === 'IN_PROGRESS';

  // Linked quiz and attempts
  const quizInfo = module?.quizInfo || (module?.quizzes && module.quizzes.length > 0 ? {
    id: module.quizzes[0].id,
    title: module.quizzes[0].title,
    passMark: module.quizzes[0].passMark,
    passed: module.quizzes[0].attempts?.some((a: any) => a.passed),
    latestAttempt: module.quizzes[0].attempts?.[0] || null,
  } : null);

  const isQuizPassed = !!quizInfo?.passed;
  const isQuizFailed = quizInfo && quizInfo.latestAttempt && !quizInfo.latestAttempt.passed;
  const isQuizAttempted = !!quizInfo?.latestAttempt;

  const moduleStatus = module?.moduleStatus || (
    !isContentCompleted 
      ? (isInProgress ? 'IN_PROGRESS' : 'NOT_STARTED')
      : (quizInfo ? (isQuizPassed ? 'COMPLETED' : 'PENDING_ASSESSMENT') : 'COMPLETED')
  );

  const handleStartModule = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/employee/training/${id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'START' })
      });
      if (res.ok) {
        await fetchModule();
      }
    } catch (e) {
      console.error('Failed to start module', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteModule = async () => {
    if (isContentCompleted) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/employee/training/${id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'COMPLETE' })
      });
      if (res.ok) {
        await fetchModule();
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

        <StatusBadge status={moduleStatus} />
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
            <div className={`prose prose-slate max-w-none text-slate-600 text-xs leading-relaxed whitespace-pre-wrap font-sans transition-opacity duration-300 ${!isContentCompleted && !isInProgress ? 'opacity-50 select-none blur-[1px]' : ''}`}>
              {module.content?.replace(/^#+\s+/gm, '')?.replace(/\*\*/g, '')}
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
                <span>Content Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <ProgressBar value={progressPercent} />
            </div>

            {isContentCompleted ? (
              <div className="space-y-2 bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5 text-center">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-800">Training Content Finished ✓</p>
                <p className="text-[10px] text-slate-400 leading-normal">
                  You have completed reading the core materials.
                </p>
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
          {quizInfo && (
            <Card className={`p-5 space-y-4 border-l-4 ${isQuizPassed ? 'border-l-emerald-600' : isQuizFailed ? 'border-l-red-500' : 'border-l-purple-600'}`}>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className={`w-4.5 h-4.5 ${isQuizPassed ? 'text-emerald-500' : isQuizFailed ? 'text-red-500' : 'text-purple-500'}`} />
                  Module Assessment
                </h3>
                <span className={`px-2 py-0.5 rounded text-xxs font-bold uppercase tracking-wider ${
                  !isContentCompleted ? 'bg-slate-100 text-slate-500' :
                  isQuizPassed ? 'bg-emerald-50 text-emerald-700' :
                  isQuizFailed ? 'bg-red-50 text-red-700' :
                  'bg-blue-50 text-blue-700'
                }`}>
                  {!isContentCompleted ? 'Locked' : isQuizPassed ? 'Passed' : isQuizFailed ? 'Retake Available' : 'Unlocked'}
                </span>
              </div>
              
              {/* Case 4: Content Finished, Quiz Failed */}
              {isContentCompleted && isQuizFailed && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-red-800">
                    <span className="flex items-center gap-1">
                      <ShieldAlert className="w-4 h-4 text-red-500" />
                      Previous Score:
                    </span>
                    <span className="text-red-600 text-sm font-black">
                      {quizInfo.latestAttempt.percentage}% ({quizInfo.latestAttempt.score}/{quizInfo.latestAttempt.totalQuestions})
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-red-800 leading-snug">
                    You must pass the quiz to successfully complete this training module.
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Training content is preserved. You do not need to repeat the lesson.
                  </p>
                </div>
              )}

              {/* Case 5: Content Finished, Quiz Passed */}
              {isContentCompleted && isQuizPassed && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-1 text-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <Award className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-emerald-800">Quiz Passed ({quizInfo.latestAttempt?.percentage}%) ✓</p>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    This training module is fully completed and credited to your compliance score.
                  </p>
                </div>
              )}

              {/* Case 3: Content Finished, Quiz Not Attempted */}
              {isContentCompleted && !isQuizAttempted && (
                <p className="text-xxs text-slate-500 leading-relaxed font-semibold">
                  Test your knowledge now. Complete the multiple-choice quiz linked to this module to successfully finish and register your compliance credit.
                </p>
              )}

              {/* Case 1 & 2: Content Not Finished */}
              {!isContentCompleted && (
                <p className="text-xxs text-slate-400 leading-relaxed font-semibold">
                  Complete the training materials above to unlock the module quiz evaluation.
                </p>
              )}

              <Link href={`/employee/quiz/${quizInfo.id}`}>
                <Button 
                  variant="primary" 
                  className={`w-full justify-center text-xs font-bold py-2 ${
                    isQuizPassed ? 'bg-slate-700 hover:bg-slate-600' :
                    isQuizFailed ? 'bg-red-600 hover:bg-red-500' :
                    'bg-purple-600 hover:bg-purple-500'
                  }`}
                  disabled={!isContentCompleted}
                  leftIcon={isQuizFailed ? <RefreshCw className="w-4 h-4" /> : undefined}
                  rightIcon={!isQuizFailed ? <ArrowRight className="w-4 h-4" /> : undefined}
                >
                  {!isContentCompleted 
                    ? 'QUIZ LOCKED' 
                    : isQuizPassed 
                    ? 'RETAKE ASSESSMENT' 
                    : isQuizFailed 
                    ? 'RETAKE MODULE QUIZ' 
                    : 'TAKE MODULE QUIZ'}
                </Button>
              </Link>
              
              {!isContentCompleted && (
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
