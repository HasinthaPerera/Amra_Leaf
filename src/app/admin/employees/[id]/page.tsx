'use client';

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Mail, Building, Clock, 
  ShieldCheck, AlertTriangle, FileText, GraduationCap, HelpCircle, Edit2, Save, X, Target
} from 'lucide-react';
import { Card, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { StatusBadge, ProgressBar } from '@/components/ui/Feedback';
import { Breadcrumb } from '@/components/ui/Navigation';

interface EmployeeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EmployeeDetailPage({ params }: EmployeeDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [employee, setEmployee] = useState<any>(null);
  const [compliance, setCompliance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', department: '' });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/employees/${id}`).then(res => res.json()),
      fetch(`/api/admin/compliance/${id}`).then(res => res.json())
    ])
    .then(([empData, compData]) => {
      if (!empData.error) {
        setEmployee(empData);
        setEditForm({ name: empData.name, email: empData.email, department: empData.department });
      }
      if (!compData.error) {
        setCompliance(compData);
      }
    })
    .catch(err => console.error('Error fetching data:', err))
    .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center text-slate-500">Loading profile...</div>;
  }

  // If employee doesn't exist
  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <AlertTriangle className="w-12 h-12 mb-3 text-slate-300" />
        <h2 className="font-bold text-sm text-slate-700">Account Not Found</h2>
        <p className="text-xs text-slate-400 mb-4">No employee was found with the identifier: "{id}".</p>
        <Button variant="outline" size="sm" onClick={() => router.push('/admin/employees')}>
          Return to Directory
        </Button>
      </div>
    );
  }

  // Helper formatting dates
  const formatDate = (isoStr?: string) => {
    if (!isoStr) return 'N/A';
    try {
      return new Date(isoStr).toLocaleDateString();
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Employees', href: '/admin/employees' },
          { label: employee.name }
        ]}
      />

      {/* Header Profile Title card */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/admin/employees')}
          className="p-1 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Employee Security Profile</p>
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">{employee.name}</h2>
        </div>
      </div>

      {/* Profile Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Account Details */}
        <Card className="flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Identity & Account
              </h3>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-700">
                  <Edit2 className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-3">
                <Input 
                  label="Name" 
                  value={editForm.name} 
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })} 
                />
                <Input 
                  label="Email" 
                  type="email"
                  value={editForm.email} 
                  onChange={e => setEditForm({ ...editForm, email: e.target.value })} 
                />
                <Select
                  label="Department"
                  options={[
                    { value: 'Management', label: 'Management' },
                    { value: 'Supervisor', label: 'Supervisor' },
                    { value: 'POS / Cashier', label: 'POS / Cashier' },
                    { value: 'Front Office / Service', label: 'Front Office / Service' },
                    { value: 'Kitchen', label: 'Kitchen' },
                    { value: 'Delivery', label: 'Delivery' },
                    { value: 'Accounts', label: 'Accounts' },
                    { value: 'Marketing / Social Media', label: 'Marketing / Social Media' }
                  ]}
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                />
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="w-full"
                  isLoading={updateLoading}
                  onClick={async () => {
                    setUpdateLoading(true);
                    try {
                      const res = await fetch(`/api/admin/employees/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(editForm)
                      });
                      if (res.ok) {
                        const updated = await res.json();
                        setEmployee(updated);
                        setIsEditing(false);
                      } else {
                        const data = await res.json();
                        alert(data.error || 'Failed to update employee');
                      }
                    } catch (error) {
                      alert('Network error');
                    }
                    setUpdateLoading(false);
                  }}
                >
                  Save Changes
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2.5 text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <div className="text-xs font-medium truncate">
                    <span className="block font-bold text-slate-700">Employee ID</span>
                    {employee.employeeId}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <div className="text-xs font-medium truncate">
                    <span className="block font-bold text-slate-700">Email Address</span>
                    {employee.email}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-600">
                  <Building className="w-4 h-4 text-slate-400" />
                  <div className="text-xs font-medium">
                    <span className="block font-bold text-slate-700">Department</span>
                    {employee.department}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <div className="text-xs font-medium">
                    <span className="block font-bold text-slate-700">Created Date</span>
                    {formatDate(employee.createdAt)}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-bold text-slate-700 mb-1">Status</span>
                  <StatusBadge status={employee.status} />
                </div>
              </>
            )}
          </div>
          
          {compliance && (
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
              <span className="block text-xs font-bold text-slate-700">Overall Compliance Status</span>
              <StatusBadge status={compliance.overallStatus} />
            </div>
          )}
        </Card>

        {/* Right Column: Aggregated Compliance Stats */}
        {compliance && (
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Policy Acknowledgement"
              value={`${compliance.policyCompletionRate}%`}
              description={`${compliance.policiesAcknowledged} of ${compliance.policiesRequired} signed`}
              icon={<FileText className="w-5 h-5" />}
              variant="blue"
            />
            <StatCard
              title="Training Progress"
              value={`${compliance.trainingCompletionRate}%`}
              description={`${compliance.trainingCompleted} of ${compliance.trainingRequired} finished`}
              icon={<GraduationCap className="w-5 h-5" />}
              variant="emerald"
            />
            <StatCard
              title="Quiz Passing Rate"
              value={`${compliance.quizPassRate}%`}
              description={`${compliance.quizzesPassed} of ${compliance.quizzesRequired} passed`}
              icon={<HelpCircle className="w-5 h-5" />}
              variant="purple"
            />
            
            {/* Training Needs Section */}
            <Card className="sm:col-span-3 mt-2 bg-slate-50 border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 pb-2 mb-3 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-400" />
                Training Needs & Priorities
              </h3>
              <div className="space-y-2">
                {compliance.trainingNeeds.map((need: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">{need.title}</span>
                    <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] ${
                      need.need === 'No Current Training Need' ? 'bg-emerald-100 text-emerald-700' :
                      need.need === 'Retraining Recommended' ? 'bg-red-100 text-red-700' :
                      need.need === 'Training In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {need.need}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Breakdown Details Sections */}
      {compliance && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Policies Status Card */}
          <Card className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              Policy Acknowledgements
            </h3>
            
            <div className="space-y-3">
              {compliance.policyDetails.map((p: any) => (
                <div key={p.id} className="flex justify-between items-center p-2.5 border border-slate-100 rounded-lg text-xs">
                  <div className="truncate max-w-[65%]">
                    <p className="font-bold text-slate-700 truncate">{p.title}</p>
                    <p className="text-xxs text-slate-400">Ver: {p.version}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xxs font-bold uppercase tracking-wider ${
                      p.status === 'SIGNED' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {p.status}
                    </span>
                    {p.status === 'SIGNED' && (
                      <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{formatDate(p.acknowledgedAt)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Training Progress Card */}
          <Card className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              Training Course Modules
            </h3>

            <div className="space-y-3">
              {compliance.trainingDetails.map((t: any) => (
                <div key={t.id} className="p-2.5 border border-slate-100 rounded-lg text-xs space-y-1.5 flex flex-col justify-center min-h-[60px]">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-slate-700 truncate max-w-[80%]">{t.title}</p>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xxs font-bold uppercase tracking-wider ${
                      t.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      t.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                      'bg-slate-50 text-slate-500 border border-slate-200'
                    }`}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                  {t.status === 'COMPLETED' && (
                    <p className="text-[10px] text-slate-400 font-medium text-right mt-1">Completed: {formatDate(t.completedAt)}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Quiz performance Card */}
          <Card className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              Knowledge Quiz Scores
            </h3>

            <div className="space-y-3">
              {compliance.quizDetails.map((q: any) => (
                <div key={q.id} className="flex justify-between items-center p-2.5 border border-slate-100 rounded-lg text-xs">
                  <div className="truncate max-w-[50%]">
                    <p className="font-bold text-slate-700 truncate">{q.title}</p>
                    <p className="text-xxs text-slate-400">{q.attemptsCount} attempts</p>
                  </div>
                  <div className="text-right">
                    {q.attemptsCount > 0 ? (
                      <>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xxs font-bold uppercase tracking-wider mb-1 ${
                          q.requirementStatus === 'PASSED' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                          {q.requirementStatus}
                        </span>
                        <div className="text-[10px] text-slate-500 font-medium">
                          Latest: {q.latestPercentage}% ({q.latestResult})
                        </div>
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
      )}
    </div>
  );
}
