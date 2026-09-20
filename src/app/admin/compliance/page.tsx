'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ShieldCheck, Search, ShieldAlert, ArrowUpDown, Eye } from 'lucide-react';
import { SearchBar } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StatusBadge, ProgressBar } from '@/components/ui/Feedback';
import { Card } from '@/components/ui/Card';

export default function ComplianceMonitorPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'name' | 'compliance'>('name');
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    fetch('/api/admin/compliance')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setRecords(data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Apply search and status filters
  const filteredRecords = useMemo(() => {
    return records
      .filter((rec) => {
        const matchSearch = 
          rec.name.toLowerCase().includes(search.toLowerCase()) || 
          rec.employeeId.toLowerCase().includes(search.toLowerCase());
        
        const matchStatus = statusFilter === 'ALL' || rec.overallStatus === statusFilter;
        
        return matchSearch && matchStatus;
      })
      .sort((a, b) => {
        if (sortField === 'name') {
          return sortAsc 
            ? a.name.localeCompare(b.name) 
            : b.name.localeCompare(a.name);
        } else {
          return sortAsc 
            ? a.overallComplianceRate - b.overallComplianceRate 
            : b.overallComplianceRate - a.overallComplianceRate;
        }
      });
  }, [records, search, statusFilter, sortField, sortAsc]);

  const handleSort = (field: 'name' | 'compliance') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cybersecurity Audits</p>
        <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">Compliance Tracking</h2>
      </div>

      {/* Filters bar */}
      <Card className="p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <SearchBar 
            placeholder="Search employees by ID or name..." 
            onSearch={(val) => setSearch(val)} 
          />
        </div>
        <div className="w-full md:w-64">
          <label className="block text-xxs font-bold text-slate-400 uppercase tracking-widest mb-1">
            Filter by Security Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLIANT">COMPLIANT</option>
            <option value="PENDING">PENDING</option>
            <option value="INCOMPLETE">INCOMPLETE</option>
          </select>
        </div>
      </Card>

      {/* Matrix Table */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
           <div className="py-12 text-center text-slate-500">Loading compliance data...</div>
        ) : filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <ShieldAlert className="w-12 h-12 mb-3 text-slate-300" />
            <p className="font-bold text-sm text-slate-700">No Audits Found</p>
            <p className="text-xs text-slate-400">Try adjusting your filters or search options.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xxs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3.5 font-semibold">
                    <button 
                      onClick={() => handleSort('name')} 
                      className="flex items-center gap-1 hover:text-slate-700 uppercase tracking-wider font-semibold focus:outline-none"
                    >
                      Employee
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </th>
                  <th className="px-5 py-3.5 font-semibold text-center w-36">Policies Signed</th>
                  <th className="px-5 py-3.5 font-semibold text-center w-36">Training Progress</th>
                  <th className="px-5 py-3.5 font-semibold text-center w-36">Quiz Status</th>
                  <th className="px-5 py-3.5 font-semibold text-center">
                    <button 
                      onClick={() => handleSort('compliance')} 
                      className="flex items-center gap-1 hover:text-slate-700 uppercase tracking-wider font-semibold focus:outline-none mx-auto"
                    >
                      Overall Rate
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </th>
                  <th className="px-5 py-3.5 font-semibold text-center">Overall State</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRecords.map((rec) => {
                  return (
                    <tr key={rec.userId} className="hover:bg-slate-50/30">
                      <td className="px-5 py-4">
                        <Link href={`/admin/employees/${rec.userId}`} className="font-bold text-slate-800 hover:text-blue-600 transition-colors">
                          {rec.name}
                        </Link>
                        <p className="text-xxs text-slate-400 font-semibold">{rec.department}</p>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-bold mb-1 text-slate-700">{rec.policyCompletionRate}%</span>
                          <div className="w-24">
                            <ProgressBar value={rec.policyCompletionRate} />
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-bold mb-1 text-slate-700">{rec.trainingCompletionRate}%</span>
                          <div className="w-24">
                            <ProgressBar value={rec.trainingCompletionRate} />
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-bold mb-1 text-slate-700">{rec.quizPassRate}%</span>
                          <div className="w-24">
                            <ProgressBar value={rec.quizPassRate} />
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span className={`text-sm font-extrabold ${
                          rec.overallComplianceRate >= 85 ? 'text-emerald-600' :
                          rec.overallComplianceRate >= 50 ? 'text-amber-500' :
                          'text-red-500'
                        }`}>
                          {rec.overallComplianceRate}%
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <StatusBadge status={rec.overallStatus} />
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link href={`/admin/employees/${rec.userId}`}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="py-1 text-xs border border-slate-200"
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                          >
                            View Audit
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
