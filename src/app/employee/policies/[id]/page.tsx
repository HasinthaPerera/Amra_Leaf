'use client';

import React, { useState, useMemo, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, AlertCircle, FileText, Check } from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Breadcrumb } from '@/components/ui/Navigation';

interface EmployeePolicyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EmployeePolicyDetailPage({ params }: EmployeePolicyDetailPageProps) {
  const { id } = use(params);
  const { currentUser, policies, progressList, acknowledgePolicy } = useSimulation();
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Find target policy
  const policy = useMemo(() => {
    return policies.find((p) => p.id === id && p.status === 'PUBLISHED') || null;
  }, [policies, id]);

  // Find user progress record
  const progress = useMemo(() => {
    if (!currentUser) return null;
    return progressList.find((p) => p.userId === currentUser.id) || null;
  }, [progressList, currentUser]);

  // Check if already acknowledged
  const isAcknowledged = useMemo(() => {
    if (!progress) return false;
    const state = progress.policyProgress.find((pp) => pp.policyId === id);
    return state?.status === 'ACKNOWLEDGED';
  }, [progress, id]);

  const handleAcknowledge = async () => {
    if (!isChecked || isAcknowledged) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // Simulate validation lag
    
    try {
      acknowledgePolicy(id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!policy) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <AlertCircle className="w-12 h-12 mb-3 text-slate-300" />
        <h2 className="font-bold text-sm text-slate-700">Document Not Found</h2>
        <p className="text-xs text-slate-400 mb-4">No published policy was found with the identifier: "{id}".</p>
        <Button variant="outline" size="sm" onClick={() => router.push('/employee/policies')}>
          Return to Catalog
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Policies', href: '/employee/policies' },
          { label: policy.title }
        ]}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/employee/policies')}
            className="p-1 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cybersecurity Documents</p>
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">Review Policy Details</h2>
          </div>
        </div>

        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border ${
          isAcknowledged 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
            : 'bg-amber-50 text-amber-850 border-amber-100'
        }`}>
          {isAcknowledged ? 'Signed & Compliant' : 'Awaiting Signature'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Policy text body */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            {/* Header info */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 pb-3 mb-6">
              <span>Category: <span className="text-slate-600">{policy.category}</span></span>
              <span className="h-4 w-px bg-slate-200" />
              <span>Version: <span className="text-slate-600">{policy.version}</span></span>
              <span className="h-4 w-px bg-slate-200" />
              <span>Published: <span className="text-slate-600">{policy.publishedDate}</span></span>
            </div>

            {/* Markdown rendered body preview */}
            <div className="prose prose-slate max-w-none text-slate-600 text-xs leading-relaxed whitespace-pre-wrap font-sans">
              {policy.content}
            </div>
          </Card>
        </div>

        {/* Right Column: Acknowledgement capsule */}
        <div className="space-y-4">
          <Card className="p-5 space-y-4 border-l-4 border-l-blue-600">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <FileText className="w-4.5 h-4.5 text-blue-500" />
              Acknowledgement Panel
            </h3>

            {isAcknowledged ? (
              <div className="space-y-3 bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
                  <Check className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800">Policy Acknowledged ✓</p>
                <p className="text-[10px] text-slate-400 leading-normal">You have signed and agreed to comply with this policy guidelines on behalf of Amra Leaf.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xxs text-slate-400 leading-relaxed font-medium">
                  Review the left panel and click the signature box to acknowledge receipt, reading comprehension, and compliance agreement of the policy rules.
                </p>

                <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                  <Checkbox
                    id="acknowledge_check"
                    label={
                      <span className="text-xxs font-bold text-slate-600 leading-tight block">
                        I have read, understood, and agree to abide by the terms of this policy.
                      </span>
                    }
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                </div>

                <Button
                  variant="primary"
                  className="w-full justify-center text-xs font-bold py-2.5"
                  disabled={!isChecked}
                  onClick={handleAcknowledge}
                  isLoading={loading}
                >
                  ACKNOWLEDGE POLICY
                </Button>
              </div>
            )}
          </Card>

          <Card className="p-5 space-y-2 bg-slate-50 border border-slate-100">
            <h4 className="text-xxs font-bold text-slate-400 uppercase tracking-widest">Compliance Note</h4>
            <p className="text-xxs text-slate-400 leading-relaxed font-semibold">
              Acknowledging policies is a core requirement of the Amra Leaf Cybersecurity Policy & Awareness Management System. A compliance rate below 85% may restrict certain intranet workspace credentials.
            </p>
          </Card>
        </div>

      </div>
    </div>
  );
}
