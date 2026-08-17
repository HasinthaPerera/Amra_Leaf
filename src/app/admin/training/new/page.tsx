'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, GraduationCap } from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Breadcrumb } from '@/components/ui/Navigation';

export default function NewTrainingPage() {
  const { addTraining } = useSimulation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('10 mins');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [content, setContent] = useState('');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Module title is required';
    if (!description.trim()) errs.description = 'Brief description is required';
    if (!estimatedDuration.trim()) errs.estimatedDuration = 'Duration is required (e.g. 10 mins)';
    if (!content.trim()) errs.content = 'Module learning text content is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    try {
      addTraining({
        title,
        description,
        estimatedDuration,
        status,
        content
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/training');
      }, 1000);
    } catch (e) {
      setErrors({ global: 'Failed to save training module.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Training Modules', href: '/admin/training' },
          { label: 'New Module' }
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
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">Draft New Training Module</h2>
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
                  label="Estimated Duration"
                  placeholder="e.g. 10 mins"
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
                    { value: 'DRAFT', label: 'Save as Draft' },
                    { value: 'PUBLISHED', label: 'Publish Immediately' }
                  ]}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'DRAFT' | 'PUBLISHED')}
                />
              </div>
            </div>

            <div>
              <Textarea
                label="Module Learning Content (supports markdown)"
                placeholder="## Course Learning Details&#10;Write training chapters here..."
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
    </div>
  );
}
