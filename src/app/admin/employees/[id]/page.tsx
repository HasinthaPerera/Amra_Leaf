'use client';

import React, { useMemo, use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Mail, Building, Clock, 
  ShieldCheck, AlertTriangle, FileText, GraduationCap, HelpCircle, Edit2, Save, X 
} from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';
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
  
  const { 
    progressList, 
    policies, 
    trainingModules, 
    quizzes,
    getComplianceRecords 
  } = useSimulation();

  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', department: '' });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/employees/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setEmployee(data);
          setEditForm({ name: data.name, email: data.email, department: data.department });
        }
      })
      .catch(err => console.error('Error fetching employee:', err))
      .finally(() => setLoading(false));
  }, [id]);

  // Find progress record using employeeId
  const progress = useMemo(() => {
    if (!employee) return null;
    return progressList.find((p) => p.userId === employee.employeeId) || null;
  }, [progressList, employee]);

  // Compliance record using employeeId
  const compliance = useMemo(() => {
    if (!employee) return null;
    const records = getComplianceRecords();
    return records.find((r) => r.userId === employee.employeeId) || null;
  }, [getComplianceRecords, employee]);

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

  const publishedPolicies = policies.filter((p) => p.status === 'PUBLISHED');
  const publishedTraining = trainingModules.filter((t) => t.status === 'PUBLISHED');

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
                    { value: 'Operations', label: 'Operations' },
                    { value: 'Finance & Accounts', label: 'Finance & Accounts' },
                    { value: 'Human Resources', label: 'Human Resources' },
                    { value: 'Software Engineering', label: 'Software Engineering' },
                    { value: 'Sales & Marketing', label: 'Sales & Marketing' },
                    { value: 'Customer Success', label: 'Customer Success' },
                    { value: 'IT Support & Administration', label: 'IT Support & Administration' },
                    { value: 'Legal & Compliance', label: 'Legal & Compliance' },
                    { value: 'POS / Cashier', label: 'POS / Cashier' },
                    { value: 'Front Office / Service', label: 'Front Office / Service' }
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
              description={`${progress?.policyProgress.filter(p => p.status === 'ACKNOWLEDGED').length || 0} of ${publishedPolicies.length} signed`}
              icon={<FileText className="w-5 h-5" />}
              variant="blue"
            />
            <StatCard
              title="Training Progress"
              value={`${compliance.trainingCompletionRate}%`}
              description={`${progress?.trainingProgress.filter(t => t.status === 'COMPLETED').length || 0} of ${publishedTraining.length} finished`}
              icon={<GraduationCap className="w-5 h-5" />}
              variant="emerald"
            />
            <StatCard
              title="Quiz Passing Rate"
              value={`${compliance.averageQuizScore}%`}
              description={`${progress?.quizResults.filter(q => q.passed).length || 0} of ${quizzes.length} passed`}
              icon={<HelpCircle className="w-5 h-5" />}
              variant="purple"
            />
          </div>
        )}
      </div>

      {/* Breakdown Details Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Policies Status Card */}
        <Card className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
            Policy Acknowledgements
          </h3>
          
          <div className="space-y-3">
            {publishedPolicies.map((p) => {
              const policyState = progress?.policyProgress.find((pp) => pp.policyId === p.id);
              const isAcknowledged = policyState?.status === 'ACKNOWLEDGED';

              return (
                <div key={p.id} className="flex justify-between items-center p-2.5 border border-slate-100 rounded-lg text-xs">
                  <div className="truncate max-w-[65%]">
                    <p className="font-bold text-slate-700 truncate">{p.title}</p>
                    <p className="text-xxs text-slate-400">Ver: {p.version}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xxs font-bold uppercase tracking-wider ${
                      isAcknowledged 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {isAcknowledged ? 'Signed' : 'Pending'}
                    </span>
                    {isAcknowledged && (
                      <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{formatDate(policyState?.acknowledgedAt)}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Training Progress Card */}
        <Card className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
            Training Course Modules
          </h3>

          <div className="space-y-3">
            {publishedTraining.map((t) => {
              const trainingState = progress?.trainingProgress.find((tp) => tp.moduleId === t.id);
              const progressPct = trainingState?.progressPercent || 0;

              return (
                <div key={t.id} className="p-2.5 border border-slate-100 rounded-lg text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-slate-700 truncate max-w-[80%]">{t.title}</p>
                    <span className="text-xxs font-bold text-slate-400">{progressPct}%</span>
                  </div>
                  <ProgressBar value={progressPct} />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Quiz performance Card */}
        <Card className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
            Knowledge Quiz Scores
          </h3>

          <div className="space-y-3">
            {quizzes.map((q) => {
              const result = progress?.quizResults.find((qr) => qr.quizId === q.id);

              return (
                <div key={q.id} className="flex justify-between items-center p-2.5 border border-slate-100 rounded-lg text-xs">
                  <div className="truncate max-w-[60%]">
                    <p className="font-bold text-slate-700 truncate">{q.title}</p>
                    <p className="text-xxs text-slate-400">{q.questions.length} questions</p>
                  </div>
                  <div className="text-right">
                    {result ? (
                      <>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xxs font-bold uppercase tracking-wider ${
                          result.passed 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                          {result.percentage}% - {result.passed ? 'PASSED' : 'FAILED'}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{formatDate(result.submittedAt)}</p>
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
    </div>
  );
}
