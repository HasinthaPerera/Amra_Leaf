'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, FileText, GraduationCap, Percent, 
  PlusCircle, ShieldCheck, AlertTriangle, ArrowRight, UserPlus 
} from 'lucide-react';
import { StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge, ProgressBar } from '@/components/ui/Feedback';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard/stats')
      .then(res => res.json())
      .then(json => {
        if (!json.error) {
          setData(json);
        }
      })
      .catch(err => console.error('Error fetching dashboard stats:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-slate-500">Loading dashboard...</div>;
  }

  if (!data) {
    return <div className="py-20 text-center text-red-500">Failed to load dashboard</div>;
  }

  const { stats, urgentEmployees, recentPolicies, recentTraining } = data;

  return (
    <div className="space-y-6">
      {/* Upper Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          description="Active cybersecurity accounts"
          icon={<Users className="w-5 h-5" />}
          variant="indigo"
        />
        <StatCard
          title="Published Policies"
          value={stats.publishedPolicies}
          description="Active policies"
          icon={<FileText className="w-5 h-5" />}
          variant="blue"
        />
        <StatCard
          title="Training Modules"
          value={stats.trainingModules}
          description="Published awareness modules"
          icon={<GraduationCap className="w-5 h-5" />}
          variant="emerald"
        />
        <StatCard
          title="Compliance Rate"
          value={`${stats.complianceRate}%`}
          description="Average employee compliance"
          icon={<Percent className="w-5 h-5" />}
          variant={stats.complianceRate >= 80 ? 'emerald' : stats.complianceRate >= 50 ? 'amber' : 'red'}
        />
      </div>

      {/* Quick Action Hub */}
      <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm shadow-slate-100/40">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
          Administrative Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/admin/policies/new">
            <Button variant="outline" className="w-full text-xs font-bold py-2.5" leftIcon={<PlusCircle className="w-4 h-4 text-blue-500" />}>
              CREATE POLICY
            </Button>
          </Link>
          <Link href="/admin/employees/new">
            <Button variant="outline" className="w-full text-xs font-bold py-2.5" leftIcon={<UserPlus className="w-4 h-4 text-indigo-500" />}>
              ADD EMPLOYEE
            </Button>
          </Link>
          <Link href="/admin/training/new">
            <Button variant="outline" className="w-full text-xs font-bold py-2.5" leftIcon={<PlusCircle className="w-4 h-4 text-emerald-500" />}>
              ADD TRAINING
            </Button>
          </Link>
          <Link href="/admin/compliance">
            <Button variant="outline" className="w-full text-xs font-bold py-2.5" leftIcon={<ShieldCheck className="w-4 h-4 text-purple-500" />}>
              AUDIT COMPLIANCE
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Compliance Attention Column */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-xl p-5 shadow-sm shadow-slate-100/40">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
              Employees Requiring Attention
            </h2>
            <Link href="/admin/compliance" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {urgentEmployees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 border border-dashed border-slate-100 rounded-xl">
              <ShieldCheck className="w-10 h-10 text-emerald-500 mb-2" />
              <p className="text-xs text-slate-600 font-bold">All Employees Compliant</p>
              <p className="text-xxs text-slate-400">All registered employees are within acceptable safety bands.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xxs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Employee</th>
                    <th className="pb-3 font-semibold">Department</th>
                    <th className="pb-3 font-semibold text-center">Score</th>
                    <th className="pb-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {urgentEmployees.map((emp: any) => (
                    <tr key={emp.userId} className="hover:bg-slate-50/50">
                      <td className="py-3.5">
                        <Link href={`/admin/employees/${emp.userId}`} className="font-bold text-slate-700 hover:text-blue-600 transition-colors">
                          {emp.userName}
                        </Link>
                        <p className="text-xxs text-slate-400 font-medium">{emp.userEmail}</p>
                      </td>
                      <td className="py-3.5 text-xs text-slate-600 font-semibold">{emp.department}</td>
                      <td className="py-3.5 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className={`text-xs font-extrabold ${emp.overallScore >= 70 ? 'text-emerald-600' : emp.overallScore >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                            {emp.overallScore}%
                          </span>
                          <div className="w-16">
                            <ProgressBar value={emp.overallScore} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 text-right">
                        <StatusBadge status={emp.overallStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Activity feed Column */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm shadow-slate-100/40 space-y-6">
          {/* Policy Activity */}
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Policy Activity
            </h2>
            <div className="space-y-3">
              {recentPolicies.map((p: any) => (
                <div key={p.id} className="p-3 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <Link href={`/admin/policies`} className="text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors truncate max-w-[70%]">
                      {p.title}
                    </Link>
                    <span className="text-xxs font-bold text-slate-400 uppercase">{p.version}</span>
                  </div>
                  <div className="flex justify-between items-center text-xxs text-slate-400 font-medium">
                    <span>Category: {p.category}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xxs font-bold uppercase tracking-wider ${
                      p.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-50 text-slate-600 border border-slate-100'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Training Activity */}
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Training Additions
            </h2>
            <div className="space-y-3">
              {recentTraining.map((t: any) => (
                <div key={t.id} className="p-3 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <Link href={`/admin/training`} className="text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors truncate max-w-[80%]">
                      {t.title}
                    </Link>
                    <span className="text-xxs font-bold text-slate-400 uppercase">{t.estimatedDuration}</span>
                  </div>
                  <p className="text-xxs text-slate-400 line-clamp-1 mb-2 font-medium">{t.description}</p>
                  <div className="flex justify-between items-center text-xxs text-slate-400 font-medium">
                    <span>Created: {t.createdDate}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xxs font-bold uppercase tracking-wider ${
                      t.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-50 text-slate-600 border border-slate-100'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
