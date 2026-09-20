'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { useSimulation } from '@/context/SimulationContext';
import { Activity } from 'lucide-react';

export default function ActivityLogPage() {
  const { currentUser: user, loading: authLoading } = useSimulation();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLogs();
    }
  }, [user]);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/activity');
      const data = await res.json();
      if (res.ok) {
        setLogs(data);
      } else {
        console.error('Failed to fetch activity logs:', data.error);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row font-sans text-slate-300">
      <Sidebar role="admin" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Navbar role="admin" onMenuToggle={() => setSidebarOpen(true)} title="Activity Log" />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Activity className="text-blue-500 w-6 h-6" />
                  Security Activity Log
                </h1>
                <p className="text-sm text-slate-500 mt-1 font-medium">Recent security and administrative events</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              {loading ? (
                <div className="p-12 text-center text-slate-400 font-medium">Loading activity logs...</div>
              ) : logs.length === 0 ? (
                <div className="p-12 text-center text-slate-400 font-medium">No recent activity found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-950/50 text-slate-400 uppercase tracking-wider text-xs">
                        <th className="px-6 py-4 font-bold border-b border-slate-800">Timestamp</th>
                        <th className="px-6 py-4 font-bold border-b border-slate-800">Action</th>
                        <th className="px-6 py-4 font-bold border-b border-slate-800">Actor</th>
                        <th className="px-6 py-4 font-bold border-b border-slate-800">Target</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-300">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-slate-800 text-blue-400">
                              {log.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-400">
                            {log.user ? `${log.user.name} (${log.user.employeeId})` : 'System'}
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                            {log.targetType} {log.targetId ? `#${log.targetId.slice(-6)}` : ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
