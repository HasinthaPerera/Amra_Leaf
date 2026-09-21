'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';
import { Button } from '@/components/ui/Button';
import { Input, PasswordInput } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Feedback';

export default function LoginPage() {
  const { login, currentUser } = useSimulation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/employee/dashboard');
      }
    }
  }, [currentUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate login submissions

    if (!email) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your security password.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success && res.user) {
        if (res.user.role === 'admin') {
          router.replace('/admin/dashboard');
        } else {
          router.replace('/employee/dashboard');
        }
      } else {
        setError('Invalid email or password.');
      }
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic Background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center items-center gap-2 mb-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight uppercase">
            Amra <span className="text-blue-500">Leaf</span>
          </span>
        </div>
        <h2 className="text-center text-lg font-bold text-slate-300 uppercase tracking-widest leading-none mb-1">
          Cybersecurity Portal
        </h2>
        <p className="text-center text-xs text-slate-500 font-semibold tracking-wider uppercase mb-8">
          Policy & Awareness Management System
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-slate-800/90 border border-slate-700/50 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-2xl">
          {error && (
            <Alert 
              type="error" 
              message={error} 
              className="mb-5 bg-red-950/40 border-red-900/50 text-red-300"
            />
          )}

          <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
            {/* Hidden dummy fields to capture browser autofill heuristics */}
            <input type="text" name="email" id="fake_email_trap" style={{ display: 'none' }} tabIndex={-1} readOnly />
            <input type="password" name="password" id="fake_password_trap" style={{ display: 'none' }} tabIndex={-1} readOnly />

            <div>
              <Input
                label="Corporate Email Address"
                labelClassName="text-slate-300"
                id="amra_login_email"
                name="amra_login_email"
                type="email"
                required
                autoComplete="off"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="bg-slate-950/80 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/30 font-medium"
              />
            </div>

            <div>
              <PasswordInput
                label="Security Password"
                labelClassName="text-slate-300"
                id="amra_login_password"
                name="amra_login_password"
                required
                autoComplete="new-password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="bg-slate-950/80 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/30 font-medium"
              />
            </div>

            <div>
              <Button
                type="submit"
                disabled={loading}
                isLoading={loading}
                className="w-full justify-center bg-blue-600 hover:bg-blue-500 py-2.5 font-bold tracking-wider"
              >
                {loading ? 'SIGNING IN...' : 'SECURE SIGN IN'}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 mt-8 text-center">
        <p className="text-xs text-slate-400 font-medium leading-relaxed">
          <strong className="text-slate-300">Privacy & Data Use Notice:</strong> Your account details, policy signatures, training progress, and quiz results are securely recorded for internal security awareness and compliance monitoring. Access is restricted to authorized administrators.
        </p>
      </div>
    </div>
  );
}
