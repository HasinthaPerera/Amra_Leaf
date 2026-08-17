'use client';

import React, { useState, useEffect, useMemo, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, ShieldCheck, AlertCircle } from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Breadcrumb } from '@/components/ui/Navigation';

interface EditPolicyPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPolicyPage({ params }: EditPolicyPageProps) {
  const { id } = use(params);
  const { policies, updatePolicy } = useSimulation();
  const router = useRouter();

  // Find target policy
  const policy = useMemo(() => {
    return policies.find((p) => p.id === id) || null;
  }, [policies, id]);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [version, setVersion] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('DRAFT');
  const [content, setContent] = useState('');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  // Pre-fill form values
  useEffect(() => {
    if (policy) {
      setTitle(policy.title);
      setCategory(policy.category);
      setVersion(policy.version);
      setStatus(policy.status);
      setContent(policy.content);
    }
  }, [policy]);

  const categories = [
    { value: 'Password Security', label: 'Password Security' },
    { value: 'Phishing Awareness', label: 'Phishing Awareness' },
    { value: 'POS Security', label: 'POS Security' },
    { value: 'Customer Data Protection', label: 'Customer Data Protection' },
    { value: 'Acceptable Use', label: 'Acceptable Use' },
    { value: 'Staff Device Security', label: 'Staff Device Security' },
    { value: 'Incident Reporting', label: 'Incident Reporting' },
    { value: 'Social Media Security', label: 'Social Media Security' }
  ];

  if (!policy) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <AlertCircle className="w-12 h-12 mb-3 text-slate-300" />
        <h2 className="font-bold text-sm text-slate-700">Document Not Found</h2>
        <p className="text-xs text-slate-400 mb-4">No policy was found with the identifier: "{id}".</p>
        <Button variant="outline" size="sm" onClick={() => router.push('/admin/policies')}>
          Return to Policies Catalog
        </Button>
      </div>
    );
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Policy title is required';
    if (!version.trim()) errs.version = 'Version tag is required';
    if (!content.trim()) errs.content = 'Policy document content is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    try {
      updatePolicy(id, {
        title,
        category,
        version,
        status,
        content
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/policies');
      }, 1000);
    } catch (e) {
      setErrors({ global: 'Failed to update policy record.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Policies', href: '/admin/policies' },
          { label: `Edit ${policy.title}` }
        ]}
      />

      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/admin/policies')}
          className="p-1 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Document Management</p>
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">Modify Policy Document</h2>
        </div>
      </div>

      <Card className="p-6">
        {success ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-slate-600">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">Policy Saved Successfully!</h3>
            <p className="text-xs text-slate-400">Success. Redirecting you back to policy catalog...</p>
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
                  label="Policy Document Title"
                  placeholder="e.g. Acceptable Use of IT Assets Policy"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={errors.title}
                />
              </div>

              <div>
                <Input
                  label="Version Tag"
                  placeholder="e.g. v1.0"
                  required
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  error={errors.version}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select
                  label="Document Category"
                  options={categories}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
                label="Policy Content (supports markdown)"
                placeholder="Write policy details here..."
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
                onClick={() => router.push('/admin/policies')}
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
                SAVE POLICY DOCUMENT
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
