'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, FileText, GraduationCap, 
  HelpCircle, Calendar, Check, AlertTriangle, ArrowRight 
} from 'lucide-react';
import { Card, StatCard } from '@/components/ui/Card';
import { StatusBadge, ProgressBar } from '@/components/ui/Feedback';
import { Breadcrumb } from '@/components/ui/Navigation';

export default function EmployeeProgressPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/employee/compliance')
      .then(res => res.json())
      .then(json => {
        if (!json.error) {
          setData(json);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (isoStr?: string | Date | null) => {
    if (!isoStr) return 'Pending';
    try {
      return new Date(isoStr).toLocaleDateString() + ' ' + new Date(isoStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return String(isoStr);
    }
  };

  const getComplianceStatus = (rate: number) => {
    if (rate >= 85) return 'COMPLIANT';
    if (rate >= 50) return 'PENDING';
    return 'INCOMPLETE';
  };

  // Compile a unified history timeline of activities
  const accomplishments = useMemo(() => {
    if (!data) return [];
    
    const items: { type: string; title: string; date: string; tag: string }[] = [];

    // Add signed policies
    data.policyDetails.forEach((pp: any) => {
      if (pp.status === 'SIGNED' && pp.acknowledgedAt) {
        items.push({
          type: 'policy',
          title: `Signed policy: ${pp.title}`,
          date: pp.acknowledgedAt,
          tag: 'Signed'
        });
      }
    });

    // Add completed training
    data.trainingDetails.forEach((tp: any) => {
      if (tp.status === 'COMPLETED' && tp.completedAt) {
        items.push({
          type: 'training',
          title: `Completed lesson: ${tp.title}`,
          date: tp.completedAt,
          tag: 'Finished'
        });
      }
    });

    // Add passed quizzes
    data.quizDetails.forEach((qr: any) => {
      if (qr.attemptsCount > 0 && qr.latestAttemptAt) {
        items.push({
          type: 'quiz',
          title: `Quiz Attempt: ${qr.title} (Grade: ${qr.latestPercentage}%)`,
          date: qr.latestAttemptAt,
          tag: qr.latestResult
        });
      }
    });

    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data]);

  if (loading) {
    return <div className="py-20 text-center text-slate-500">Loading your progress...</div>;
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <AlertTriangle className="w-12 h-12 mb-3 text-slate-300" />
        <h2 className="font-bold text-sm text-slate-700">No Records Found</h2>
        <p className="text-xs text-slate-400">We could not retrieve your compliance data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Security Center' },
          { label: 'My Progress' }
        ]}
      />

      {/* Header */}
      <div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Awareness Analytics</p>
        <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">My Security Accomplishments</h2>
      </div>

      {/* Progress Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Compliance details summary */}
        <Card className="lg:col-span-1 p-5 flex flex-col justify-between border-l-4 border-l-blue-600 min-h-64">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider border-b border-slate-100 pb-2">
              Overall Compliance
            </h3>
            
            <div className="text-center py-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Compliance Rate</span>
              <h4 className={`text-4xl font-black ${
                data.overallComplianceRate >= 85 ? 'text-emerald-600' : data.overallComplianceRate >= 50 ? 'text-amber-500' : 'text-red-500'
              }`}>
                {data.overallComplianceRate}%
              </h4>
            </div>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <span className="block text-xxs font-bold text-slate-400 uppercase tracking-widest">Audited Status</span>
            <StatusBadge status={data.overallStatus} className="w-full justify-center" />
          </div>
        </Card>

        {/* Aggregated categories grid */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Policy Acknowledges"
            value={`${data.policiesAcknowledged} / ${data.policiesRequired}`}
            description={`${data.policyCompletionRate}% complete`}
            icon={<FileText className="w-5 h-5" />}
            variant="blue"
          />
          <StatCard
            title="Training Modules"
            value={`${data.trainingCompleted} / ${data.trainingRequired}`}
            description={`${data.trainingCompletionRate}% complete`}
            icon={<GraduationCap className="w-5 h-5" />}
            variant="emerald"
          />
          <StatCard
            title="Quiz Evaluations"
            value={`${data.quizzesPassed} / ${data.quizzesRequired}`}
            description={`${data.quizPassRate}% passed`}
            icon={<HelpCircle className="w-5 h-5" />}
            variant="purple"
          />
        </div>
      </div>

      {/* Breakdowns columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Policies Signed */}
        <Card className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
            Policies Acknowledged
          </h3>
          
          <div className="space-y-3">
            {data.policyDetails.map((p: any) => (
              <div key={p.id} className="flex justify-between items-center p-2.5 border border-slate-100 rounded-lg text-xs">
                <div className="truncate max-w-[65%]">
                  <p className="font-bold text-slate-700 truncate">{p.title}</p>
                  <p className="text-xxs text-slate-400">Ver: {p.version}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xxs font-bold uppercase tracking-wider ${
                    p.status === 'SIGNED' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {p.status === 'SIGNED' ? 'Signed' : 'Pending'}
                  </span>
                  {p.status === 'SIGNED' && (
                    <p className="text-[9px] text-slate-400 mt-0.5 font-medium leading-none">{formatDate(p.acknowledgedAt).split(' ')[0]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Training Finished */}
        <Card className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
            Completed Lessons
          </h3>

          <div className="space-y-3">
            {data.trainingDetails.map((t: any) => (
              <div key={t.id} className="flex justify-between items-center p-2.5 border border-slate-100 rounded-lg text-xs">
                <div className="truncate max-w-[65%]">
                  <p className="font-bold text-slate-700 truncate">{t.title}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xxs font-bold uppercase tracking-wider ${
                    t.status === 'COMPLETED' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-slate-50 text-slate-500 border-slate-100'
                  }`}>
                    {t.status === 'COMPLETED' ? 'Finished' : t.status.replace('_', ' ')}
                  </span>
                  {t.status === 'COMPLETED' && (
                    <p className="text-[9px] text-slate-400 mt-0.5 font-medium leading-none">{formatDate(t.completedAt).split(' ')[0]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quizzes Graded */}
        <Card className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
            Knowledge Quiz Logs
          </h3>

          <div className="space-y-3">
            {data.quizDetails.map((q: any) => (
              <div key={q.id} className="flex justify-between items-center p-2.5 border border-slate-100 rounded-lg text-xs">
                <div className="truncate max-w-[65%]">
                  <p className="font-bold text-slate-700 truncate">{q.title}</p>
                  <p className="text-xxs text-slate-400">{q.attemptsCount} attempts</p>
                </div>
                <div className="text-right">
                  {q.attemptsCount > 0 ? (
                    <>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xxs font-bold uppercase tracking-wider ${
                        q.requirementStatus === 'PASSED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {q.latestPercentage}% - {q.requirementStatus}
                      </span>
                      <p className="text-[9px] text-slate-400 mt-0.5 font-medium leading-none">{formatDate(q.latestAttemptAt).split(' ')[0]}</p>
                    </>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-xxs font-bold uppercase tracking-wider bg-slate-50 text-slate-400 border border-slate-100">
                      Unattempted
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Unified Timeline / Accomplishments */}
      <Card className="space-y-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
          <Calendar className="w-4.5 h-4.5 text-blue-500" />
          Accomplishments History Timeline
        </h3>

        {accomplishments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400 text-center">
            <AlertTriangle className="w-10 h-10 text-slate-350 mb-2 animate-pulse" />
            <p className="text-xs font-bold text-slate-700">No records signed or completed yet</p>
            <p className="text-xxs text-slate-400">Complete items on your dashboard to see updates here.</p>
          </div>
        ) : (
          <div className="relative border-l border-slate-150 pl-6 ml-3 space-y-6">
            {accomplishments.map((item, idx) => (
              <div key={idx} className="relative">
                {/* Timeline node marker */}
                <div className={`
                  absolute -left-[30px] top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center
                  ${item.type === 'policy' ? 'border-blue-500' : item.type === 'training' ? 'border-emerald-500' : 'border-purple-500'}
                `}>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    item.type === 'policy' ? 'bg-blue-500' : item.type === 'training' ? 'bg-emerald-500' : 'bg-purple-500'
                  }`} />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <p className="font-bold text-slate-700">{item.title}</p>
                    <p className="text-xxs text-slate-400 mt-0.5">{formatDate(item.date)}</p>
                  </div>
                  
                  <div>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xxs font-bold uppercase tracking-wider ${
                      item.tag === 'Signed' || item.tag === 'Finished' || item.tag === 'PASSED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                      {item.tag}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
