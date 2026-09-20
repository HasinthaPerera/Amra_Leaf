'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, GraduationCap, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Breadcrumb } from '@/components/ui/Navigation';
import { StatusBadge } from '@/components/ui/Feedback';

interface EditTrainingPageProps {
  params: Promise<{ id: string }>;
}

export default function EditTrainingPage({ params }: EditTrainingPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [training, setTraining] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('DRAFT');
  const [content, setContent] = useState('');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoadingData(true);
      try {
        const [trainingRes, employeesRes] = await Promise.all([
          fetch(`/api/admin/training/${id}`),
          fetch('/api/admin/employees')
        ]);
        if (trainingRes.ok) {
          const t = await trainingRes.json();
          setTraining(t);
          setTitle(t.title);
          setDescription(t.description);
          setEstimatedDuration(t.estimatedMinutes.toString());
          setStatus(t.status);
          setContent(t.content);
        }
        if (employeesRes.ok) {
          const e = await employeesRes.json();
          setEmployees(e);
        }
      } catch (err) {
        console.error('Failed to load training details', err);
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, [id]);

  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <p className="font-bold text-sm text-slate-700">Loading module details...</p>
      </div>
    );
  }

  if (!training) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <AlertCircle className="w-12 h-12 mb-3 text-slate-300" />
        <h2 className="font-bold text-sm text-slate-700">Training Module Not Found</h2>
        <p className="text-xs text-slate-400 mb-4">No course was found with the identifier: "{id}".</p>
        <Button variant="outline" size="sm" onClick={() => router.push('/admin/training')}>
          Return to Training Catalog
        </Button>
      </div>
    );
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Module title is required';
    if (!description.trim()) errs.description = 'Brief description is required';
    if (!estimatedDuration.trim()) errs.estimatedDuration = 'Duration is required (e.g. 10)';
    if (!content.trim()) errs.content = 'Module learning text content is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/training/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          estimatedMinutes: estimatedDuration,
          status,
          content
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update training module');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/training');
      }, 1000);
    } catch (e: any) {
      setErrors({ global: e.message || 'Failed to update training module record.' });
    } finally {
      setLoading(false);
    }
  };

  // Build employee progress table data
  const progressMap = new Map();
  if (training.progress) {
    training.progress.forEach((p: any) => {
      progressMap.set(p.userId, p);
    });
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Training Modules', href: '/admin/training' },
          { label: `Edit ${training.title}` }
        ]}
      />

      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/admin/training')}
          className="p-1 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Education & Awareness</p>
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">Modify Training Module</h2>
        </div>
      </div>

      <Card className="p-6">
        {success ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-slate-600">
            <GraduationCap className="w-12 h-12 text-emerald-500 mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">Training Course Module Saved!</h3>
            <p className="text-xs text-slate-400">Success. Redirecting you back to training catalog...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.global && (
              <p className="p-3 bg-red-50 text-red-700 border border-red-100 rounded-lg text-xs font-semibold">
                {errors.global}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Course Module Title"
                  placeholder="e.g. Ransomware and Malware Protection"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={errors.title}
                />
              </div>

              <div>
                <Input
                  label="Estimated Duration (minutes)"
                  placeholder="e.g. 10"
                  type="number"
                  required
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(e.target.value)}
                  error={errors.estimatedDuration}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-1">
                <Input
                  label="Brief Description / Subtitle"
                  placeholder="e.g. Essential guide on ransomware prevention"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  error={errors.description}
                />
              </div>

              <div>
                <Select
                  label="Document State"
                  options={[
                    { value: 'DRAFT', label: 'Draft' },
                    { value: 'PUBLISHED', label: 'Published' },
                    { value: 'ARCHIVED', label: 'Archived' }
                  ]}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED')}
                />
              </div>
            </div>

            <div>
              <Textarea
                label="Module Learning Content (supports markdown)"
                placeholder="Write training chapters here..."
                required
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                error={errors.content}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push('/admin/training')}
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
                SAVE TRAINING MODULE
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* Admin Training Status Section */}
      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Employee Training Status</h3>
          <p className="text-xs text-slate-500 mt-1">Track which employees have started or completed this module.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-xxs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3.5 font-semibold">Employee</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold">Completion Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-xs text-slate-400">
                    No active employees found.
                  </td>
                </tr>
              ) : (
                employees.map(emp => {
                  const empProgress = progressMap.get(emp.id);
                  const pStatus = empProgress?.status || 'NOT_STARTED';
                  const completedDate = empProgress?.completedAt 
                    ? new Date(empProgress.completedAt).toLocaleDateString() 
                    : '-';
                  
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/30">
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-800">{emp.name}</p>
                        <p className="text-xxs text-slate-400">{emp.department}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xxs font-bold uppercase tracking-wider border ${
                          pStatus === 'COMPLETED' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : pStatus === 'IN_PROGRESS'
                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                            : 'bg-slate-50 text-slate-500 border-slate-100'
                        }`}>
                          {pStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs font-semibold text-slate-500">
                        {completedDate}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
