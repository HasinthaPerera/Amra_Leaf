'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, FileText, GraduationCap, 
  HelpCircle, Calendar, Check, AlertTriangle, ArrowRight 
} from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';
import { Card, StatCard } from '@/components/ui/Card';
import { StatusBadge, ProgressBar } from '@/components/ui/Feedback';
import { Breadcrumb } from '@/components/ui/Navigation';

export default function EmployeeProgressPage() {
  const { currentUser, progressList, policies, trainingModules, quizzes } = useSimulation();

  // Load progress record for current employee
  const progress = useMemo(() => {
    if (!currentUser) return null;
    return progressList.find((p) => p.userId === currentUser.id) || null;
  }, [progressList, currentUser]);

  const publishedPolicies = useMemo(() => policies.filter(p => p.status === 'PUBLISHED'), [policies]);
  const publishedTraining = useMemo(() => trainingModules.filter(t => t.status === 'PUBLISHED'), [trainingModules]);

  // Compute percentages
  const stats = useMemo(() => {
    if (!progress) {
      return { policiesSigned: 0, trainingFinished: 0, quizzesPassed: 0, complianceRate: 0 };
    }

    const signedCount = progress.policyProgress.filter(
      (pp) => pp.status === 'ACKNOWLEDGED' && publishedPolicies.some(p => p.id === pp.policyId)
    ).length;

    const trainingFinishedCount = progress.trainingProgress.filter(
      (tp) => tp.status === 'COMPLETED' && publishedTraining.some(t => t.id === tp.moduleId)
    ).length;

    const quizPassedCount = progress.quizResults.filter(
      (qr) => qr.passed && quizzes.some(q => q.id === qr.quizId)
    ).length;

    const policyRate = publishedPolicies.length > 0 ? Math.round((signedCount / publishedPolicies.length) * 100) : 100;
    const trainingRate = publishedTraining.length > 0 ? Math.round((trainingFinishedCount / publishedTraining.length) * 100) : 100;
    const quizRate = quizzes.length > 0 ? Math.round((quizPassedCount / quizzes.length) * 100) : 100;

    const complianceRate = Math.round((policyRate + trainingRate + quizRate) / 3);

    return {
      policiesSigned: signedCount,
      trainingFinished: trainingFinishedCount,
      quizzesPassed: quizPassedCount,
      complianceRate,
      policyRate,
      trainingRate,
      quizRate,
    };
  }, [progress, publishedPolicies, publishedTraining, quizzes]);

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return 'Pending';
    try {
      return new Date(isoStr).toLocaleDateString() + ' ' + new Date(isoStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoStr;
    }
  };

  const getComplianceStatus = (rate: number) => {
    if (rate >= 85) return 'COMPLIANT';
    if (rate >= 50) return 'PENDING';
    return 'INCOMPLETE';
  };

  // Compile a unified history timeline of activities
  const accomplishments = useMemo(() => {
    if (!progress) return [];
    
    const items: { type: string; title: string; date: string; tag: string }[] = [];

    // Add signed policies
    progress.policyProgress.forEach((pp) => {
      if (pp.status === 'ACKNOWLEDGED' && pp.acknowledgedAt) {
        const doc = policies.find(p => p.id === pp.policyId);
        items.push({
          type: 'policy',
          title: `Signed policy: ${doc?.title || pp.policyId}`,
          date: pp.acknowledgedAt,
          tag: 'Signed'
        });
      }
    });

    // Add completed training
    progress.trainingProgress.forEach((tp) => {
      if (tp.status === 'COMPLETED' && tp.completedAt) {
        const mod = trainingModules.find(t => t.id === tp.moduleId);
        items.push({
          type: 'training',
          title: `Completed lesson: ${mod?.title || tp.moduleId}`,
          date: tp.completedAt,
          tag: 'Finished'
        });
      }
    });

    // Add passed quizzes
    progress.quizResults.forEach((qr) => {
      const qz = quizzes.find(q => q.id === qr.quizId);
      items.push({
        type: 'quiz',
        title: `Passed quiz: ${qz?.title || qr.quizId} (Grade: ${qr.percentage}%)`,
        date: qr.submittedAt,
        tag: qr.passed ? 'PASSED' : 'FAILED'
      });
    });

    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [progress, policies, trainingModules, quizzes]);

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
              Security Rank
            </h3>
            
            <div className="text-center py-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Compliance Rate</span>
              <h4 className={`text-4xl font-black ${
                stats.complianceRate >= 85 ? 'text-emerald-600' : stats.complianceRate >= 50 ? 'text-amber-500' : 'text-red-500'
              }`}>
                {stats.complianceRate}%
              </h4>
            </div>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <span className="block text-xxs font-bold text-slate-400 uppercase tracking-widest">Audited Status</span>
            <StatusBadge status={getComplianceStatus(stats.complianceRate)} className="w-full justify-center" />
          </div>
        </Card>

        {/* Aggregated categories grid */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Policy Acknowledges"
            value={`${stats.policiesSigned} / ${publishedPolicies.length}`}
            description={`${stats.policyRate}% complete`}
            icon={<FileText className="w-5 h-5" />}
            variant="blue"
          />
          <StatCard
            title="Training Modules"
            value={`${stats.trainingFinished} / ${publishedTraining.length}`}
            description={`${stats.trainingRate}% complete`}
            icon={<GraduationCap className="w-5 h-5" />}
            variant="emerald"
          />
          <StatCard
            title="Quiz Evaluations"
            value={`${stats.quizzesPassed} / ${quizzes.length}`}
            description={`${stats.quizRate}% passed`}
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
            {publishedPolicies.map((p) => {
              const state = progress?.policyProgress.find((pp) => pp.policyId === p.id);
              const isAck = state?.status === 'ACKNOWLEDGED';

              return (
                <div key={p.id} className="flex justify-between items-center p-2.5 border border-slate-100 rounded-lg text-xs">
                  <div className="truncate max-w-[65%]">
                    <p className="font-bold text-slate-700 truncate">{p.title}</p>
                    <p className="text-xxs text-slate-400">Ver: {p.version}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xxs font-bold uppercase tracking-wider ${
                      isAck 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {isAck ? 'Signed' : 'Pending'}
                    </span>
                    {isAck && (
                      <p className="text-[9px] text-slate-400 mt-0.5 font-medium leading-none">{formatDate(state?.acknowledgedAt).split(' ')[0]}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Training Finished */}
        <Card className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
            Completed Lessons
          </h3>

          <div className="space-y-3">
            {publishedTraining.map((t) => {
              const state = progress?.trainingProgress.find((tp) => tp.moduleId === t.id);
              const isCompleted = state?.status === 'COMPLETED';
              const progressPct = state?.progressPercent || 0;

              return (
                <div key={t.id} className="flex justify-between items-center p-2.5 border border-slate-100 rounded-lg text-xs">
                  <div className="truncate max-w-[65%]">
                    <p className="font-bold text-slate-700 truncate">{t.title}</p>
                    <p className="text-xxs text-slate-400">{t.estimatedDuration}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xxs font-bold uppercase tracking-wider ${
                      isCompleted 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                      {isCompleted ? 'Finished' : `${progressPct}% done`}
                    </span>
                    {isCompleted && (
                      <p className="text-[9px] text-slate-400 mt-0.5 font-medium leading-none">{formatDate(state?.completedAt).split(' ')[0]}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Quizzes Graded */}
        <Card className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
            Knowledge Quiz Logs
          </h3>

          <div className="space-y-3">
            {quizzes.map((q) => {
              const result = progress?.quizResults.find((qr) => qr.quizId === q.id);

              return (
                <div key={q.id} className="flex justify-between items-center p-2.5 border border-slate-100 rounded-lg text-xs">
                  <div className="truncate max-w-[65%]">
                    <p className="font-bold text-slate-700 truncate">{q.title}</p>
                    <p className="text-xxs text-slate-400">{q.questions.length} questions</p>
                  </div>
                  <div className="text-right">
                    {result ? (
                      <>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xxs font-bold uppercase tracking-wider ${
                          result.passed 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : 'bg-red-50 text-red-700 border-red-100'
                        }`}>
                          {result.percentage}% - {result.passed ? 'PASSED' : 'FAILED'}
                        </span>
                        <p className="text-[9px] text-slate-400 mt-0.5 font-medium leading-none">{formatDate(result.submittedAt).split(' ')[0]}</p>
                      </>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-xxs font-bold uppercase tracking-wider bg-slate-50 text-slate-400 border border-slate-100">
                        Unattempted
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
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
