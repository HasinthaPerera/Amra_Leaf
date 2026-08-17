'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { FileText, Search, ShieldCheck, AlertCircle, Eye } from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';
import { SearchBar } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function EmployeePoliciesListPage() {
  const { currentUser, policies, progressList } = useSimulation();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Load progress record for current employee
  const progress = useMemo(() => {
    if (!currentUser) return null;
    return progressList.find((p) => p.userId === currentUser.id) || null;
  }, [progressList, currentUser]);

  const publishedPolicies = useMemo(() => {
    return policies.filter((p) => p.status === 'PUBLISHED');
  }, [policies]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    publishedPolicies.forEach(p => cats.add(p.category));
    return ['ALL', ...Array.from(cats)];
  }, [publishedPolicies]);

  // Filtered policies list
  const filteredPolicies = useMemo(() => {
    return publishedPolicies.filter((p) => {
      const matchSearch = 
        p.title.toLowerCase().includes(search.toLowerCase()) || 
        p.content.toLowerCase().includes(search.toLowerCase());
      
      const matchCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
      
      return matchSearch && matchCategory;
    });
  }, [publishedPolicies, search, categoryFilter]);

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
      {/* Header */}
      <div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cybersecurity Documents</p>
        <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">Security Policies Catalog</h2>
      </div>

      {/* Search and Filters panel */}
      <Card className="p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <SearchBar 
            placeholder="Search policies by document title or content keywords..." 
            onSearch={(val) => setSearch(val)} 
          />
        </div>
        <div className="w-full md:w-64">
          <label className="block text-xxs font-bold text-slate-400 uppercase tracking-widest mb-1">
            Filter by Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'ALL' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Grid of policies */}
      {filteredPolicies.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12 text-slate-400">
          <AlertCircle className="w-12 h-12 mb-3 text-slate-300" />
          <p className="font-bold text-sm text-slate-700">No Policies Located</p>
          <p className="text-xs text-slate-400">Check back later or contact your cybersecurity officer.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPolicies.map((p) => {
            const policyState = progress?.policyProgress.find((pp) => pp.policyId === p.id);
            const isAcknowledged = policyState?.status === 'ACKNOWLEDGED';

            return (
              <Card key={p.id} className="flex flex-col justify-between p-5 border border-slate-100 min-h-48 relative overflow-hidden">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                      {p.category}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xxs font-bold uppercase tracking-wider border ${
                      isAcknowledged 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {isAcknowledged ? 'Signed' : 'Pending Signature'}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800 leading-snug line-clamp-1 mb-1">
                      {p.title}
                    </h3>
                    <p className="text-xxs text-slate-400 font-bold uppercase mb-2">Version: {p.version} | Released: {p.publishedDate}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {p.content.replace(/#+\s+.+/g, '').replace(/[*#`_\-]/g, '').trim()}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    {isAcknowledged && (
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        Signed on {formatDate(policyState?.acknowledgedAt)}
                      </p>
                    )}
                  </div>
                  
                  <Link href={`/employee/policies/${p.id}`} passHref legacyBehavior>
                    <Button 
                      variant={isAcknowledged ? 'outline' : 'primary'} 
                      size="sm" 
                      className="py-1 px-3 text-xs"
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      {isAcknowledged ? 'Read Document' : 'Review & Sign'}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
