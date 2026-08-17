'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { GraduationCap, Search, PlusCircle, CheckCircle, Edit2, AlertCircle, Eye, Clock } from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';
import { SearchBar } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Navigation';
import { StatusBadge } from '@/components/ui/Feedback';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';

export default function TrainingListPage() {
  const { trainingModules, updateTraining } = useSimulation();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  // Compute counts for tab badges
  const counts = useMemo(() => {
    return {
      ALL: trainingModules.length,
      DRAFT: trainingModules.filter(t => t.status === 'DRAFT').length,
      PUBLISHED: trainingModules.filter(t => t.status === 'PUBLISHED').length,
    };
  }, [trainingModules]);

  const tabs = [
    { id: 'ALL', label: 'All Modules', count: counts.ALL },
    { id: 'DRAFT', label: 'Drafts', count: counts.DRAFT },
    { id: 'PUBLISHED', label: 'Published', count: counts.PUBLISHED },
  ];

  // Filtered training list
  const filteredModules = useMemo(() => {
    return trainingModules.filter((t) => {
      const matchSearch = 
        t.title.toLowerCase().includes(search.toLowerCase()) || 
        t.description.toLowerCase().includes(search.toLowerCase());
      
      const matchTab = activeTab === 'ALL' || t.status === activeTab;
      
      return matchSearch && matchTab;
    });
  }, [trainingModules, search, activeTab]);

  const activePreviewModule = useMemo(() => {
    return trainingModules.find(t => t.id === selectedModule) || null;
  }, [trainingModules, selectedModule]);

  const publishModule = (id: string) => {
    updateTraining(id, { status: 'PUBLISHED' });
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Education & Awareness</p>
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">Training Management</h2>
        </div>
        <Link href="/admin/training/new" passHref legacyBehavior>
          <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
            CREATE TRAINING MODULE
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Search panel */}
      <Card className="p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <SearchBar 
            placeholder="Search by training title or course description..." 
            onSearch={(val) => setSearch(val)} 
          />
        </div>
      </Card>

      {/* Training Table Card */}
      <Card className="p-0 overflow-hidden">
        {filteredModules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <AlertCircle className="w-12 h-12 mb-3 text-slate-300" />
            <p className="font-bold text-sm text-slate-700">No Modules Found</p>
            <p className="text-xs text-slate-400">Try adjusting your filters or create a new training module.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xxs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3.5 font-semibold">Course Title & Description</th>
                  <th className="px-5 py-3.5 font-semibold">Estimated Time</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold">Last Updated</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredModules.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/30">
                    <td className="px-5 py-4 max-w-sm">
                      <p className="font-bold text-slate-800 leading-snug truncate">{t.title}</p>
                      <p className="text-xxs text-slate-400 line-clamp-1 font-medium leading-relaxed">{t.description}</p>
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-600 flex items-center gap-1 mt-1.5 border-none">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {t.estimatedDuration}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-400">
                      {t.updatedDate}
                    </td>
                    <td className="px-5 py-4 text-right flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedModule(t.id)}
                        className="py-1 text-slate-600 border border-slate-200"
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Preview
                      </Button>
                      
                      <Link href={`/admin/training/${t.id}`} passHref legacyBehavior>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="py-1 text-slate-600 border border-slate-200 hover:text-blue-600 hover:border-blue-200"
                          leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                        >
                          Edit
                        </Button>
                      </Link>

                      {t.status === 'DRAFT' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => publishModule(t.id)}
                          className="py-1 text-xs font-bold"
                          leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                        >
                          Publish
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

      {/* Training Module Preview Modal */}
      <Modal
        isOpen={selectedModule !== null}
        onClose={() => setSelectedModule(null)}
        title={activePreviewModule?.title || 'Training Module Preview'}
        size="lg"
        footer={
          <Button variant="outline" size="sm" onClick={() => setSelectedModule(null)}>
            Close Preview
          </Button>
        }
      >
        {activePreviewModule && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Time: <span className="text-slate-600">{activePreviewModule.estimatedDuration}</span>
              </span>
              <span className="h-4 w-px bg-slate-200" />
              <StatusBadge status={activePreviewModule.status} />
            </div>
            
            <p className="text-xs text-slate-500 font-bold border-l-2 border-slate-300 pl-3 italic mb-4">
              {activePreviewModule.description}
            </p>

            <div className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-600 whitespace-pre-wrap font-sans p-4 bg-slate-50 border border-slate-100 rounded-xl max-h-[50vh] overflow-y-auto">
              {activePreviewModule.content}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
