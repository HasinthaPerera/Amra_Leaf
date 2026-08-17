'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  FileText, Search, PlusCircle, CheckCircle, 
  Archive, Edit2, AlertCircle, Eye 
} from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';
import { SearchBar } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Navigation';
import { StatusBadge } from '@/components/ui/Feedback';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';

export default function PoliciesListPage() {
  const { policies, publishPolicy, archivePolicy } = useSimulation();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);

  // Compute counts for tab badges
  const counts = useMemo(() => {
    return {
      ALL: policies.length,
      DRAFT: policies.filter(p => p.status === 'DRAFT').length,
      PUBLISHED: policies.filter(p => p.status === 'PUBLISHED').length,
      ARCHIVED: policies.filter(p => p.status === 'ARCHIVED').length,
    };
  }, [policies]);

  const tabs = [
    { id: 'ALL', label: 'All Policies', count: counts.ALL },
    { id: 'DRAFT', label: 'Drafts', count: counts.DRAFT },
    { id: 'PUBLISHED', label: 'Published', count: counts.PUBLISHED },
    { id: 'ARCHIVED', label: 'Archived', count: counts.ARCHIVED },
  ];

  // Dynamic list of categories for filter dropdown
  const categories = useMemo(() => {
    const cats = new Set<string>();
    policies.forEach(p => cats.add(p.category));
    return ['ALL', ...Array.from(cats)];
  }, [policies]);

  // Filtered policies list
  const filteredPolicies = useMemo(() => {
    return policies.filter((p) => {
      const matchSearch = 
        p.title.toLowerCase().includes(search.toLowerCase()) || 
        p.content.toLowerCase().includes(search.toLowerCase());
      
      const matchCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
      const matchTab = activeTab === 'ALL' || p.status === activeTab;
      
      return matchSearch && matchCategory && matchTab;
    });
  }, [policies, search, categoryFilter, activeTab]);

  const activePreviewPolicy = useMemo(() => {
    return policies.find(p => p.id === selectedPolicy) || null;
  }, [policies, selectedPolicy]);

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cybersecurity Documents</p>
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">Policy Management</h2>
        </div>
        <Link href="/admin/policies/new">
          <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
            CREATE NEW POLICY
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Search and Filters panel */}
      <Card className="p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <SearchBar 
            placeholder="Search by policy title or contents..." 
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

      {/* Policies Grid/List */}
      <Card className="p-0 overflow-hidden">
        {filteredPolicies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <AlertCircle className="w-12 h-12 mb-3 text-slate-300" />
            <p className="font-bold text-sm text-slate-700">No Policies Found</p>
            <p className="text-xs text-slate-400">Try adjusting your filters or create a new policy document.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xxs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3.5 font-semibold">Title & Version</th>
                  <th className="px-5 py-3.5 font-semibold">Category</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold">Last Updated</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredPolicies.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/30">
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800 leading-snug">{p.title}</p>
                      <p className="text-xxs text-slate-400 font-bold uppercase">Version: {p.version}</p>
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-600">
                      {p.category}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-400">
                      {p.updatedDate}
                    </td>
                    <td className="px-5 py-4 text-right flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPolicy(p.id)}
                        className="py-1 text-slate-600 border border-slate-200"
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Preview
                      </Button>
                      
                      <Link href={`/admin/policies/${p.id}`}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="py-1 text-slate-600 border border-slate-200 hover:text-blue-600 hover:border-blue-200"
                          leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                        >
                          Edit
                        </Button>
                      </Link>

                      {p.status === 'DRAFT' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => publishPolicy(p.id)}
                          className="py-1 text-xs font-bold"
                          leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                        >
                          Publish
                        </Button>
                      )}

                      {p.status === 'PUBLISHED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => archivePolicy(p.id)}
                          className="py-1 text-xs font-bold text-slate-500 hover:text-red-500 border border-slate-200 hover:border-red-200 hover:bg-red-50"
                          leftIcon={<Archive className="w-3.5 h-3.5" />}
                        >
                          Archive
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Policy Preview Modal */}
      <Modal
        isOpen={selectedPolicy !== null}
        onClose={() => setSelectedPolicy(null)}
        title={activePreviewPolicy?.title || 'Policy Preview'}
        size="lg"
        footer={
          <Button variant="outline" size="sm" onClick={() => setSelectedPolicy(null)}>
            Close Preview
          </Button>
        }
      >
        {activePreviewPolicy && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Category: <span className="text-slate-600">{activePreviewPolicy.category}</span></span>
              <span className="h-4 w-px bg-slate-200" />
              <span className="text-xs font-bold text-slate-400 uppercase">Version: <span className="text-slate-600">{activePreviewPolicy.version}</span></span>
              <span className="h-4 w-px bg-slate-200" />
              <StatusBadge status={activePreviewPolicy.status} />
            </div>
            
            {/* Render formatted content markdown preview */}
            <div className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-600 whitespace-pre-wrap font-sans p-4 bg-slate-50 border border-slate-100 rounded-xl max-h-[50vh] overflow-y-auto">
              {activePreviewPolicy.content}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
