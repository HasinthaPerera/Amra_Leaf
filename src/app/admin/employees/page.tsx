'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { PlusCircle, Search, Trash2, ShieldAlert, UserPlus, Eye } from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';
import { SearchBar } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Feedback';
import { Card } from '@/components/ui/Card';

export default function EmployeesListPage() {
  const { users, updateEmployee } = useSimulation();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  // Compute list of employees only (excluding admins)
  const employees = useMemo(() => {
    return users.filter((u) => u.role === 'employee');
  }, [users]);

  // Dynamic list of departments for filtering
  const departments = useMemo(() => {
    const depts = new Set<string>();
    employees.forEach((emp) => depts.add(emp.department));
    return ['ALL', ...Array.from(depts)];
  }, [employees]);

  // Filtered employees list
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch = 
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase()) ||
        emp.id.toLowerCase().includes(search.toLowerCase());
      
      const matchDept = deptFilter === 'ALL' || emp.department === deptFilter;
      
      return matchSearch && matchDept;
    });
  }, [employees, search, deptFilter]);

  const toggleStatus = (id: string, currentStatus: 'active' | 'inactive') => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    updateEmployee(id, { status: nextStatus });
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cybersecurity Accounts</p>
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">Employee Directory</h2>
        </div>
        <Link href="/admin/employees/new" passHref legacyBehavior>
          <Button variant="primary" size="md" leftIcon={<UserPlus className="w-4 h-4" />}>
            ADD NEW EMPLOYEE
          </Button>
        </Link>
      </div>

      {/* Search and Filters panel */}
      <Card className="p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <SearchBar 
            placeholder="Search by Employee ID, name or email..." 
            onSearch={(val) => setSearch(val)} 
          />
        </div>
        <div className="w-full md:w-64">
          <label className="block text-xxs font-bold text-slate-400 uppercase tracking-widest mb-1">
            Filter by Department
          </label>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'ALL' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Directory Table Card */}
      <Card className="p-0 overflow-hidden">
        {filteredEmployees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <ShieldAlert className="w-12 h-12 mb-3 text-slate-300" />
            <p className="font-bold text-sm text-slate-700">No Employees Found</p>
            <p className="text-xs text-slate-400">Try adjusting your search query or department filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xxs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3.5 font-semibold">Employee ID</th>
                  <th className="px-5 py-3.5 font-semibold">Name & Email</th>
                  <th className="px-5 py-3.5 font-semibold">Department</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold">Last Active</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/30">
                    <td className="px-5 py-4 font-extrabold text-slate-800 text-xs tracking-wider">
                      {emp.id}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800 leading-snug">{emp.name}</p>
                      <p className="text-xxs text-slate-400 font-medium leading-none">{emp.email}</p>
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-600">
                      {emp.department}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={emp.status} />
                    </td>
                    <td className="px-5 py-4 text-xxs font-semibold text-slate-400">
                      {formatDate(emp.lastActivity)}
                    </td>
                    <td className="px-5 py-4 text-right flex items-center justify-end gap-2">
                      <Link href={`/admin/employees/${emp.id}`} passHref legacyBehavior>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="py-1 text-slate-600 hover:text-blue-600 hover:border-blue-200"
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                        >
                          View Detail
                        </Button>
                      </Link>
                      <Button
                        variant={emp.status === 'active' ? 'ghost' : 'success'}
                        size="sm"
                        onClick={() => toggleStatus(emp.id, emp.status)}
                        className={`py-1 text-xs font-bold ${
                          emp.status === 'active' 
                            ? 'text-red-500 hover:bg-red-50 hover:text-red-600' 
                            : 'text-emerald-600 border border-emerald-200 hover:bg-emerald-50'
                        }`}
                      >
                        {emp.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
