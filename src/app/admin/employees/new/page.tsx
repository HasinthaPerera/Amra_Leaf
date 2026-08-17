'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserPlus, CheckCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSimulation } from '@/context/SimulationContext';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Breadcrumb } from '@/components/ui/Navigation';

export default function NewEmployeePage() {
  const { addEmployee } = useSimulation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Operations');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const deptOptions = [
    { value: 'Operations', label: 'Operations' },
    { value: 'Finance & Accounts', label: 'Finance & Accounts' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Software Engineering', label: 'Software Engineering' },
    { value: 'Sales & Marketing', label: 'Sales & Marketing' },
    { value: 'Customer Success', label: 'Customer Success' },
    { value: 'IT Support & Administration', label: 'IT Support & Administration' },
    { value: 'Legal & Compliance', label: 'Legal & Compliance' }
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please provide a valid email format';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // Simulate networking lag
    await new Promise((r) => setTimeout(r, 600));

    try {
      addEmployee({
        name,
        email,
        department,
        status,
        role: 'employee'
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/employees');
      }, 1000);
    } catch (e) {
      setErrors({ global: 'Failed to create employee record' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Employees', href: '/admin/employees' },
          { label: 'Add Employee' }
        ]}
      />

      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/admin/employees')}
          className="p-1 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Directory Management</p>
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">Register New Employee</h2>
        </div>
      </div>

      <Card className="p-6">
        {success ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-slate-600">
            <CheckCircle className="w-12 h-12 text-emerald-500 mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">Employee Account Created!</h3>
            <p className="text-xs text-slate-400">Success. Redirecting you back to the directory listing...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.global && (
              <p className="p-3 bg-red-50 text-red-700 border border-red-100 rounded-lg text-xs font-semibold">
                {errors.global}
              </p>
            )}

            <div>
              <Input
                label="Full Name"
                placeholder="e.g. Liam Vance"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
              />
            </div>

            <div>
              <Input
                label="Corporate Email Address"
                placeholder="e.g. employee@amraleaf.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select
                  label="Department"
                  options={deptOptions}
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>

              <div>
                <Select
                  label="Initial Account Status"
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive / Suspended' }
                  ]}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push('/admin/employees')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={loading}
                leftIcon={<UserPlus className="w-3.5 h-3.5" />}
              >
                CREATE ACCOUNT
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
