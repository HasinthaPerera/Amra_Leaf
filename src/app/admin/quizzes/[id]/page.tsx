'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, HelpCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Breadcrumb } from '@/components/ui/Navigation';

interface FormQuestion {
  id?: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
}

interface EditQuizPageProps {
  params: Promise<{ id: string }>;
}

export default function EditQuizPage({ params }: EditQuizPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [quiz, setQuiz] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [trainingModuleId, setTrainingModuleId] = useState('');
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  
  const [trainingModules, setTrainingModules] = useState<{value: string, label: string}[]>([]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [quizRes, trainingRes] = await Promise.all([
          fetch(`/api/admin/quizzes/${id}`),
          fetch('/api/admin/training')
        ]);
        
        if (quizRes.ok) {
          const qz = await quizRes.json();
          setQuiz(qz);
          setTitle(qz.title);
          setDescription(qz.description);
          setTrainingModuleId(qz.trainingId || '');
          setQuestions(
            qz.questions.map((q: any) => ({
              id: q.id,
              question: q.question,
              options: [q.optionA, q.optionB, q.optionC, q.optionD],
              correctAnswer: q.correctAnswer
            }))
          );
        }

        if (trainingRes.ok) {
          const tData = await trainingRes.json();
          const opts = tData.map((t: any) => ({ value: t.id, label: t.title }));
          setTrainingModules([{ value: '', label: 'Unlinked / General Security' }, ...opts]);
        }
      } catch (err) {
        console.error('Failed to load data', err);
      } finally {
        setLoadingData(false);
      }
    }
    loadData();
  }, [id]);

  if (loadingData) {
    return <div className="p-8 text-center text-slate-500">Loading quiz details...</div>;
  }

  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <AlertCircle className="w-12 h-12 mb-3 text-slate-300" />
        <h2 className="font-bold text-sm text-slate-700">Quiz Not Found</h2>
        <p className="text-xs text-slate-400 mb-4">No quiz was found with the identifier: "{id}".</p>
        <Button variant="outline" size="sm" onClick={() => router.push('/admin/quizzes')}>
          Return to Quizzes Catalog
        </Button>
      </div>
    );
  }

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]);
  };

  const handleRemoveQuestion = (qIndex: number) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, idx) => idx !== qIndex));
  };

  const handleQuestionChange = (qIndex: number, field: string, val: string | number) => {
    const updated = [...questions];
    if (field === 'question') {
      updated[qIndex].question = val as string;
    } else if (field === 'correctAnswer') {
      updated[qIndex].correctAnswer = val as number;
    }
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, optIndex: number, val: string) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = val;
    setQuestions(updated);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Quiz title is required';
    if (!description.trim()) errs.description = 'Description is required';

    questions.forEach((q, idx) => {
      if (!q.question.trim()) {
        errs[`q_${idx}`] = `Question #${idx + 1} text is empty`;
      }
      q.options.forEach((opt, optIdx) => {
        if (!opt.trim()) {
          errs[`q_${idx}_opt_${optIdx}`] = `Option ${String.fromCharCode(65 + optIdx)} is required`;
        }
      });
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const quizPayload = {
      title,
      description,
      trainingId: trainingModuleId || undefined,
      passMark: quiz.passMark || 70, // Preserve original
      status: quiz.status,
      questions: questions.map((q) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer
      }))
    };

    try {
      const res = await fetch(`/api/admin/quizzes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizPayload)
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        const errData = await res.json();
        setErrors({ global: errData.error || 'Failed to update quiz.' });
      }
    } catch (e) {
      setErrors({ global: 'Failed to update quiz record.' });
    } finally {
      setLoading(false);
    }
  };

  // Process attempt history
  // Group by user to show the latest result
  const attemptMap = new Map<string, any>();
  if (quiz.attempts) {
    quiz.attempts.forEach((a: any) => {
      if (!attemptMap.has(a.userId)) {
        attemptMap.set(a.userId, {
          user: a.user,
          latestAttempt: a,
          attemptsCount: 1,
          passedAny: a.passed
        });
      } else {
        const existing = attemptMap.get(a.userId);
        existing.attemptsCount++;
        if (a.passed) existing.passedAny = true;
      }
    });
  }
  const employeeResults = Array.from(attemptMap.values());

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Quizzes', href: '/admin/quizzes' },
          { label: `Edit ${quiz.title}` }
        ]}
      />

      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/admin/quizzes')}
          className="p-1 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Education & Awareness</p>
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">Modify Quiz Details</h2>
        </div>
      </div>

      {success ? (
        <Card className="p-6 text-center py-12">
          <HelpCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">Quiz Updated Successfully!</h3>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.global && (
            <p className="p-3 bg-red-50 text-red-700 border border-red-100 rounded-lg text-xs font-semibold">
              {errors.global}
            </p>
          )}

          {/* Core Info */}
          <Card className="p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              Quiz Catalog Entry
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Quiz Title"
                  placeholder="e.g. Social Media Security Quiz"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={errors.title}
                />
              </div>

              <div>
                <Select
                  label="Link Training Module"
                  options={trainingModules}
                  value={trainingModuleId}
                  onChange={(e) => setTrainingModuleId(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Input
                label="Short Description / Subtitle"
                placeholder="e.g. Assessment test for social media security guidelines"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={errors.description}
              />
            </div>
          </Card>

          {/* Interactive Questions Builder */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Quiz Questions ({questions.length})
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddQuestion}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="py-1 text-xs"
              >
                Add Question
              </Button>
            </div>

            {questions.map((q, idx) => (
              <Card key={idx} className="p-5 border-l-4 border-l-blue-600 relative">
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(idx)}
                    className="absolute top-4 right-4 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div className="space-y-4">
                  <div className="max-w-[90%]">
                    <Input
                      label={`Question #${idx + 1} Question Statement`}
                      placeholder="e.g. Which of the following is a symptom of phishing?"
                      required
                      value={q.question}
                      onChange={(e) => handleQuestionChange(idx, 'question', e.target.value)}
                      error={errors[`q_${idx}`]}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx}>
                        <Input
                          label={`Option ${String.fromCharCode(65 + optIdx)}`}
                          placeholder={`Enter choice option text`}
                          required
                          value={opt}
                          onChange={(e) => handleOptionChange(idx, optIdx, e.target.value)}
                          error={errors[`q_${idx}_opt_${optIdx}`]}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="w-64">
                    <Select
                      label="Select Correct Answer"
                      options={[
                        { value: '0', label: 'Option A' },
                        { value: '1', label: 'Option B' },
                        { value: '2', label: 'Option C' },
                        { value: '3', label: 'Option D' }
                      ]}
                      value={String(q.correctAnswer)}
                      onChange={(e) => handleQuestionChange(idx, 'correctAnswer', parseInt(e.target.value, 10))}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={loading}
              leftIcon={<Save className="w-3.5 h-3.5" />}
            >
              SAVE QUIZ DETAILS
            </Button>
          </div>
        </form>
      )}

      {/* Employee Results Table */}
      <Card className="p-0 overflow-hidden mt-8">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-blue-500" />
              Employee Results & Attempts
            </h3>
            <p className="text-xs text-slate-400 mt-1">Review the latest attempt and overall requirement status.</p>
          </div>
        </div>
        
        {employeeResults.length === 0 ? (
          <div className="p-8 text-center text-xs font-semibold text-slate-400">
            No employees have attempted this quiz yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xxs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3.5 font-semibold">Employee</th>
                  <th className="px-5 py-3.5 font-semibold">Latest Result</th>
                  <th className="px-5 py-3.5 font-semibold">Attempts</th>
                  <th className="px-5 py-3.5 font-semibold">Latest Date</th>
                  <th className="px-5 py-3.5 font-semibold">Requirement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {employeeResults.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/30">
                    <td className="px-5 py-3">
                      <p className="font-bold text-slate-800">{r.user?.name}</p>
                      <p className="text-xxs text-slate-400 font-medium">{r.user?.employeeId} • {r.user?.department}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${r.latestAttempt.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {r.latestAttempt.percentage}% {r.latestAttempt.passed ? 'PASS' : 'FAIL'}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">{r.latestAttempt.score} / {r.latestAttempt.totalQuestions}</p>
                    </td>
                    <td className="px-5 py-3 text-xs font-bold text-slate-600">
                      {r.attemptsCount}
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">
                      {new Date(r.latestAttempt.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-xs font-bold">
                      {r.passedAny ? (
                        <span className="text-emerald-600">PASSED</span>
                      ) : (
                        <span className="text-amber-500">FAILED</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
