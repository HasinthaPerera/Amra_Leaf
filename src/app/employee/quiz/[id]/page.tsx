'use client';

import React, { useState, useMemo, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, CheckCircle, XCircle, AlertCircle, 
  ChevronRight, ChevronLeft, Send, RefreshCw, Trophy, Award 
} from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Radio } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/Feedback';
import { Breadcrumb } from '@/components/ui/Navigation';

interface EmployeeQuizPageProps {
  params: Promise<{ id: string }>;
}

export default function EmployeeQuizPage({ params }: EmployeeQuizPageProps) {
  const { id } = use(params);
  const { quizzes, submitQuizResult } = useSimulation();
  const router = useRouter();

  // Find target quiz
  const quiz = useMemo(() => {
    return quizzes.find((q) => q.id === id) || null;
  }, [quizzes, id]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [quizResult, setQuizResult] = useState<any | null>(null);

  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <AlertCircle className="w-12 h-12 mb-3 text-slate-300" />
        <h2 className="font-bold text-sm text-slate-700">Quiz Not Found</h2>
        <p className="text-xs text-slate-400 mb-4">No quiz was found with the identifier: "{id}".</p>
        <Button variant="outline" size="sm" onClick={() => router.push('/employee/quiz')}>
          Return to Directory
        </Button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIdx];
  const isLastQuestion = currentIdx === quiz.questions.length - 1;
  const isFirstQuestion = currentIdx === 0;

  const handleSelectOption = (qId: string, optIdx: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [qId]: optIdx,
    });
  };

  const handleNext = () => {
    if (isLastQuestion) return;
    setCurrentIdx(currentIdx + 1);
  };

  const handlePrev = () => {
    if (isFirstQuestion) return;
    setCurrentIdx(currentIdx - 1);
  };

  const handleSubmit = async () => {
    // Ensure all questions are answered
    if (Object.keys(selectedAnswers).length < quiz.questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // Simulate grading

    try {
      const res = submitQuizResult(quiz.id, selectedAnswers);
      setQuizResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setQuizResult(null);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Security Quizzes', href: '/employee/quiz' },
          { label: quiz.title }
        ]}
      />

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/employee/quiz')}
          className="p-1 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cybersecurity Assessment</p>
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">{quiz.title}</h2>
        </div>
      </div>

      {quizResult ? (
        /* Results View Page */
        <Card className="p-6 text-center space-y-6">
          <div className="flex justify-center">
            {quizResult.passed ? (
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-full text-emerald-500 shadow-xl shadow-emerald-500/10">
                <Trophy className="w-16 h-16 animate-bounce" />
              </div>
            ) : (
              <div className="bg-red-50 border border-red-100 p-4 rounded-full text-red-500 shadow-xl shadow-red-500/10">
                <XCircle className="w-16 h-16 animate-pulse" />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              Quiz {quizResult.passed ? 'Passed!' : 'Failed'}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Passing grade is 70% or higher.
            </p>
          </div>

          {/* Aggregated Score card */}
          <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl max-w-sm mx-auto grid grid-cols-2 gap-4 divide-x divide-slate-150">
            <div>
              <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider mb-1.5">My Grade</p>
              <h4 className={`text-2xl font-black ${quizResult.passed ? 'text-emerald-600' : 'text-red-500'}`}>
                {quizResult.percentage}%
              </h4>
            </div>
            <div>
              <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-sans">Details</p>
              <h4 className="text-2xl font-extrabold text-slate-700">
                {quizResult.score} / {quizResult.totalQuestions}
              </h4>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 border-t border-slate-100 max-w-sm mx-auto">
            <Button
              variant="outline"
              className="w-full text-xs font-bold py-2 border border-slate-200"
              onClick={handleReset}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              RETAKE QUIZ
            </Button>
            <Button
              variant="primary"
              className="w-full text-xs font-bold py-2 bg-blue-600 hover:bg-blue-500"
              onClick={() => router.push('/employee/quiz')}
            >
              BACK TO PORTAL
            </Button>
          </div>
        </Card>
      ) : (
        /* Quiz Form Panels */
        <div className="space-y-5">
          {/* Progress indicators */}
          <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm shadow-slate-100/40 space-y-2">
            <div className="flex justify-between items-center text-xxs font-bold text-slate-400 uppercase tracking-wider">
              <span>Question {currentIdx + 1} of {quiz.questions.length}</span>
              <span>{Math.round(((currentIdx + 1) / quiz.questions.length) * 100)}% Complete</span>
            </div>
            <ProgressBar value={Math.round(((currentIdx + 1) / quiz.questions.length) * 100)} />
          </div>

          {/* Active Question Box */}
          <Card className="p-6 space-y-5">
            <h3 className="text-sm font-bold text-slate-700 leading-snug">
              {currentQuestion.question}
            </h3>

            {/* Answer Options Radio Stack */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === oIdx;
                
                return (
                  <div 
                    key={oIdx} 
                    onClick={() => handleSelectOption(currentQuestion.id, oIdx)}
                    className={`
                      p-3 border rounded-xl flex items-center cursor-pointer select-none transition-all duration-150
                      hover:bg-slate-50
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50/20 hover:bg-blue-50/20 ring-1 ring-blue-500/20' 
                        : 'border-slate-150'}
                    `}
                  >
                    <Radio
                      id={`opt_${oIdx}`}
                      label={
                        <span className={`text-xs font-semibold ${isSelected ? 'text-slate-800 font-extrabold' : 'text-slate-600'}`}>
                          {opt}
                        </span>
                      }
                      checked={isSelected}
                      onChange={() => {}} // Controlled click on outer container
                      className="border-slate-350 checked:bg-blue-600 checked:border-blue-600 focus:ring-blue-500/25 focus:ring-offset-0"
                    />
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isFirstQuestion}
              onClick={handlePrev}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
              className="px-4 py-2 border border-slate-200"
            >
              Previous
            </Button>

            {isLastQuestion ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                isLoading={loading}
                disabled={Object.keys(selectedAnswers).length < quiz.questions.length}
                leftIcon={<Send className="w-3.5 h-3.5" />}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-500/10"
              >
                SUBMIT QUIZ
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={selectedAnswers[currentQuestion.id] === undefined}
                rightIcon={<ChevronRight className="w-4 h-4" />}
                className="px-4 py-2 border border-slate-200 text-slate-700"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
