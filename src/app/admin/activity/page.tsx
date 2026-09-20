'use client';

import React, { useState, useEffect } from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { Activity } from 'lucide-react';

export default function ActivityLogPage() {
  const { currentUser: user, loading: authLoading } = useSimulation();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    return <div className="py-20 text-center text-slate-500">Loading activity logs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <Activity className="text-blue-500 w-6 h-6" />
            Security Activity Log
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Recent security and administrative events</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium">Loading activity logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-medium">No recent activity found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs">
                  <th className="px-6 py-4 font-bold border-b border-slate-200">Timestamp</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-200">Action</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-200">Actor</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-200">Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-600">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
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
  );
}
