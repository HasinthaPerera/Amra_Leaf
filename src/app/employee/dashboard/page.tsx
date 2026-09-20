'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, GraduationCap, HelpCircle, ShieldCheck, 
  AlertTriangle, ArrowRight, ShieldCheck as ShieldCheckIcon 
} from 'lucide-react';
import { StatCard, Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge, ProgressBar } from '@/components/ui/Feedback';

export default function EmployeeDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/employee/dashboard/stats')
      .then(res => res.json())
      .then(json => {
        if (!json.error) {
          setData(json);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-slate-500">Loading your dashboard...</div>;
  }

  if (!data) {
    return <div className="py-20 text-center text-red-500">Failed to load dashboard data.</div>;
  }

  const {
    policiesAcknowledged, policiesRequired,
    trainingCompleted, trainingRequired,
    quizzesPassed, quizzesRequired,
    compliancePercentage, userName,
    pendingPolicies, pendingTraining
  } = data;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <p className="text-xxs font-black text-blue-400 uppercase tracking-widest leading-none">Security Awareness Console</p>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">
            Welcome back, <span className="text-blue-400">{userName || 'Employee'}</span>
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
          value={`${policiesAcknowledged} / ${policiesRequired}`}
          description="Read and acknowledged files"
          icon={<FileText className="w-5 h-5" />}
          variant="blue"
        />
        <StatCard
          title="Completed Lessons"
          value={`${trainingCompleted} / ${trainingRequired}`}
          description="Education modules finished"
          icon={<GraduationCap className="w-5 h-5" />}
          variant="emerald"
        />
        <StatCard
          title="Quizzes Passed"
          value={`${quizzesPassed} / ${quizzesRequired}`}
          description="Assessed security tests"
          icon={<HelpCircle className="w-5 h-5" />}
          variant="purple"
        />
        <StatCard
          title="My Compliance Rate"
          value={`${compliancePercentage}%`}
          description="Average personal score"
          icon={<ShieldCheckIcon className="w-5 h-5" />}
          variant={compliancePercentage >= 85 ? 'emerald' : compliancePercentage >= 50 ? 'amber' : 'red'}
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
                {pendingPolicies.map((p: any) => (
                  <div key={p.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg text-xs hover:border-slate-200 transition-colors">
                    <div>
                      <p className="font-bold text-slate-800 leading-snug">{p.title}</p>
                      <p className="text-xxs text-slate-400">Version: {p.version} | Published: {p.publishedDate}</p>
                    </div>
                    <Link href={`/employee/policies/${p.id}`}>
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
                {pendingTraining.map((t: any) => {
                  return (
                    <Card key={t.id} className="p-4 flex flex-col justify-between h-36 border border-slate-100">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 leading-snug line-clamp-1 mb-1">{t.title}</h4>
                        <p className="text-xxs text-slate-400 line-clamp-2 leading-relaxed mb-3">{t.description}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xxs font-bold text-slate-400">
                          <span>{t.estimatedDuration}</span>
                          <span>{t.progressPercent}% Done</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <div className="flex-1">
                            <ProgressBar value={t.progressPercent} />
                          </div>
                          <Link href={`/employee/training/${t.id}`}>
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
              <Link href="/employee/policies">
                <Button variant="outline" className="w-full text-xs font-bold py-2 border border-slate-200 justify-start" leftIcon={<FileText className="w-4 h-4 text-blue-500" />}>
                  Security Policies
                </Button>
              </Link>
              <Link href="/employee/training">
                <Button variant="outline" className="w-full text-xs font-bold py-2 border border-slate-200 justify-start" leftIcon={<GraduationCap className="w-4 h-4 text-emerald-500" />}>
                  Training Library
                </Button>
              </Link>
              <Link href="/employee/quiz">
                <Button variant="outline" className="w-full text-xs font-bold py-2 border border-slate-200 justify-start" leftIcon={<HelpCircle className="w-4 h-4 text-purple-500" />}>
                  Take Knowledge Quizzes
                </Button>
              </Link>
              <Link href="/employee/progress">
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
              Verify that Multi-Factor Authentication is active on your work email or authorized Amra Leaf account. Avoid verifying login approvals via SMS. Use time-based authenticator apps instead.
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">Privacy Notice</h3>
            <p className="text-[9px] text-slate-500 font-medium leading-relaxed">
              Your account details, policy signatures, training progress, and quiz results are securely recorded for internal security awareness and compliance monitoring. Access is restricted to authorized administrators.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
