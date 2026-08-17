'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { 
  FileText, GraduationCap, HelpCircle, ShieldCheck, 
  AlertTriangle, ArrowRight, ShieldCheck as ShieldCheckIcon 
} from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';
import { StatCard, Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge, ProgressBar } from '@/components/ui/Feedback';

export default function EmployeeDashboardPage() {
  const { currentUser, policies, trainingModules, quizzes, progressList } = useSimulation();

  // Find user progress record
  const progress = useMemo(() => {
    if (!currentUser) return null;
    return progressList.find((p) => p.userId === currentUser.id) || null;
  }, [progressList, currentUser]);

  const publishedPolicies = useMemo(() => policies.filter(p => p.status === 'PUBLISHED'), [policies]);
  const publishedTraining = useMemo(() => trainingModules.filter(t => t.status === 'PUBLISHED'), [trainingModules]);

  // Compute stats for current employee
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

    const policyRate = publishedPolicies.length > 0 ? (signedCount / publishedPolicies.length) * 100 : 100;
    const trainingRate = publishedTraining.length > 0 ? (trainingFinishedCount / publishedTraining.length) * 100 : 100;
    const quizRate = quizzes.length > 0 ? (quizPassedCount / quizzes.length) * 100 : 100;

    const complianceRate = Math.round((policyRate + trainingRate + quizRate) / 3);

    return {
      policiesSigned: signedCount,
      trainingFinished: trainingFinishedCount,
      quizzesPassed: quizPassedCount,
      complianceRate,
    };
  }, [progress, publishedPolicies, publishedTraining, quizzes]);

  // List of pending policies requiring signature
  const pendingPolicies = useMemo(() => {
    if (!progress) return [];
    return publishedPolicies.filter(p => {
      const state = progress.policyProgress.find(pp => pp.policyId === p.id);
      return !state || state.status === 'PENDING';
    });
  }, [progress, publishedPolicies]);

  // List of incomplete training modules
  const pendingTraining = useMemo(() => {
    if (!progress) return [];
    return publishedTraining.filter(t => {
      const state = progress.trainingProgress.find(tp => tp.moduleId === t.id);
      return !state || state.status !== 'COMPLETED';
    }).slice(0, 3);
  }, [progress, publishedTraining]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <p className="text-xxs font-black text-blue-400 uppercase tracking-widest leading-none">Security Awareness Console</p>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">
            Welcome back, <span className="text-blue-400">{currentUser?.name || 'Employee'}</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-xl font-medium leading-relaxed">
            Keep your account protected. Read and sign pending policies, complete educational modules, and pass quizzes to maintain your compliance ranking.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Signed Policies"
          value={`${stats.policiesSigned} / ${publishedPolicies.length}`}
          description="Read and acknowledged files"
          icon={<FileText className="w-5 h-5" />}
          variant="blue"
        />
        <StatCard
          title="Completed Lessons"
          value={`${stats.trainingFinished} / ${publishedTraining.length}`}
          description="Education modules finished"
          icon={<GraduationCap className="w-5 h-5" />}
          variant="emerald"
        />
        <StatCard
          title="Quizzes Passed"
          value={`${stats.quizzesPassed} / ${quizzes.length}`}
          description="Assessed security tests"
          icon={<HelpCircle className="w-5 h-5" />}
          variant="purple"
        />
        <StatCard
          title="My Compliance Rate"
          value={`${stats.complianceRate}%`}
          description="Average personal score"
          icon={<ShieldCheckIcon className="w-5 h-5" />}
          variant={stats.complianceRate >= 85 ? 'emerald' : stats.complianceRate >= 50 ? 'amber' : 'red'}
        />
      </div>

      {/* Dynamic Alerts / Actions layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pending Tasks Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Pending Policies Alerts */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm shadow-slate-100/40">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Required Actions: Pending Policies ({pendingPolicies.length})
              </h3>
              <Link href="/employee/policies" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {pendingPolicies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 bg-emerald-50/20 border border-dashed border-emerald-100 rounded-xl text-center">
                <ShieldCheckIcon className="w-8 h-8 text-emerald-500 mb-2" />
                <p className="text-xs font-bold text-slate-800">You are all caught up!</p>
                <p className="text-xxs text-slate-400">All published security policies have been read and signed.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingPolicies.map((p) => (
                  <div key={p.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg text-xs hover:border-slate-200 transition-colors">
                    <div>
                      <p className="font-bold text-slate-800 leading-snug">{p.title}</p>
                      <p className="text-xxs text-slate-400">Version: {p.version} | Published: {p.publishedDate}</p>
                    </div>
                    <Link href={`/employee/policies/${p.id}`} passHref legacyBehavior>
                      <Button variant="primary" size="sm" className="py-1 px-3 text-xs">
                        Review & Sign
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Lessons */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm shadow-slate-100/40">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <GraduationCap className="w-4.5 h-4.5 text-blue-500" />
                Recommended Security Lessons ({pendingTraining.length})
              </h3>
              <Link href="/employee/training" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Open Library <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {pendingTraining.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 bg-emerald-50/20 border border-dashed border-emerald-100 rounded-xl text-center">
                <ShieldCheckIcon className="w-8 h-8 text-emerald-500 mb-2" />
                <p className="text-xs font-bold text-slate-800">Lessons Completed!</p>
                <p className="text-xxs text-slate-400">You have completed all available awareness modules.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pendingTraining.map((t) => {
                  const state = progress?.trainingProgress.find(tp => tp.moduleId === t.id);
                  const progressVal = state?.progressPercent || 0;

                  return (
                    <Card key={t.id} className="p-4 flex flex-col justify-between h-36 border border-slate-100">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 leading-snug line-clamp-1 mb-1">{t.title}</h4>
                        <p className="text-xxs text-slate-400 line-clamp-2 leading-relaxed mb-3">{t.description}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xxs font-bold text-slate-400">
                          <span>{t.estimatedDuration}</span>
                          <span>{progressVal}% Done</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <div className="flex-1">
                            <ProgressBar value={progressVal} />
                          </div>
                          <Link href={`/employee/training/${t.id}`} passHref legacyBehavior>
                            <Button variant="outline" size="sm" className="py-1 px-2.5 text-xxs border border-slate-200">
                              Study
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Quick actions panel */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm shadow-slate-100/40 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Navigation</h3>
            <div className="space-y-2">
              <Link href="/employee/policies" passHref legacyBehavior>
                <Button variant="outline" className="w-full text-xs font-bold py-2 border border-slate-200 justify-start" leftIcon={<FileText className="w-4 h-4 text-blue-500" />}>
                  Security Policies
                </Button>
              </Link>
              <Link href="/employee/training" passHref legacyBehavior>
                <Button variant="outline" className="w-full text-xs font-bold py-2 border border-slate-200 justify-start" leftIcon={<GraduationCap className="w-4 h-4 text-emerald-500" />}>
                  Training Library
                </Button>
              </Link>
              <Link href="/employee/quiz" passHref legacyBehavior>
                <Button variant="outline" className="w-full text-xs font-bold py-2 border border-slate-200 justify-start" leftIcon={<HelpCircle className="w-4 h-4 text-purple-500" />}>
                  Take Knowledge Quizzes
                </Button>
              </Link>
              <Link href="/employee/progress" passHref legacyBehavior>
                <Button variant="outline" className="w-full text-xs font-bold py-2 border border-slate-200 justify-start" leftIcon={<ShieldCheckIcon className="w-4 h-4 text-indigo-500" />}>
                  My Progress Profile
                </Button>
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">Security Tips</h3>
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3.5 text-slate-600 text-xxs leading-relaxed font-semibold">
              <span className="text-blue-600 block text-xs font-extrabold uppercase mb-1">MFA Alert</span>
              Verify that Multi-Factor Authentication is active on your company email client. Avoid verifying login approvals via SMS. Use time-based authenticator apps instead.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
