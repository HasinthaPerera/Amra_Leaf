'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Breadcrumb } from '@/components/ui/Navigation';

interface FormQuestion {
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
}

export default function NewQuizPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [trainingModuleId, setTrainingModuleId] = useState('');
  const [trainingModules, setTrainingModules] = useState<{value: string, label: string}[]>([]);
  
  // Start with 1 blank question
  const [questions, setQuestions] = useState<FormQuestion[]>([
    { question: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadTrainings() {
      try {
        const res = await fetch('/api/admin/training');
        if (res.ok) {
          const data = await res.json();
          const opts = data.map((t: any) => ({ value: t.id, label: t.title }));
          setTrainingModules([{ value: '', label: 'Unlinked / General Security' }, ...opts]);
        }
      } catch (err) {
        console.error('Failed to load training modules', err);
      }
    }
    loadTrainings();
  }, []);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]);
  };

  const handleRemoveQuestion = (qIndex: number) => {
    if (questions.length === 1) return; // Must have at least 1 question
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

    // Verify all questions are filled
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
      passMark: 70,
      status: 'PUBLISHED',
      questions: questions.map((q, idx) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer
      }))
    };

    try {
      const res = await fetch('/api/admin/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizPayload)
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/quizzes');
        }, 1000);
      } else {
        const errData = await res.json();
        setErrors({ global: errData.error || 'Failed to create quiz record.' });
      }
    } catch (e) {
      setErrors({ global: 'Failed to create quiz record.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Quizzes', href: '/admin/quizzes' },
          { label: 'New Quiz' }
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
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">Compile New Security Quiz</h2>
        </div>
      </div>

      {success ? (
        <Card className="p-6 text-center py-12">
          <HelpCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">Quiz Saved Successfully!</h3>
          <p className="text-xs text-slate-400">Success. Redirecting you back to quiz catalog...</p>
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
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push('/admin/quizzes')}
              disabled={loading}
            >
              Cancel
            </Button>
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
    </div>
  );
}
