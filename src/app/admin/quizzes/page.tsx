'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { HelpCircle, Search, PlusCircle, Edit2, Trash2, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';
import { SearchBar } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/Modal';

export default function QuizzesListPage() {
  const { quizzes, trainingModules, deleteQuiz } = useSimulation();
  const [search, setSearch] = useState('');
  const [selectedDelete, setSelectedDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Filtered quizzes list
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((q) => {
      const matchSearch = 
        q.title.toLowerCase().includes(search.toLowerCase()) || 
        q.description.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
  }, [quizzes, search]);

  const handleDeleteConfirm = async () => {
    if (!selectedDelete) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 450));
    deleteQuiz(selectedDelete);
    setSelectedDelete(null);
    setLoading(false);
  };

  // Helper looking up course titles
  const getLinkedTrainingTitle = (moduleId?: string) => {
    if (!moduleId) return 'None';
    const found = trainingModules.find(t => t.id === moduleId);
    return found ? found.title : `Module: ${moduleId}`;
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Education & Awareness</p>
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">Quiz Management</h2>
        </div>
        <Link href="/admin/quizzes/new">
          <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
            CREATE NEW QUIZ
          </Button>
        </Link>
      </div>

      {/* Search panel */}
      <Card className="p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <SearchBar 
            placeholder="Search by quiz title or description details..." 
            onSearch={(val) => setSearch(val)} 
          />
        </div>
      </Card>

      {/* Quizzes Table Card */}
      <Card className="p-0 overflow-hidden">
        {filteredQuizzes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <AlertCircle className="w-12 h-12 mb-3 text-slate-300" />
            <p className="font-bold text-sm text-slate-700">No Quizzes Found</p>
            <p className="text-xs text-slate-400">Try adjusting your filter or compile a new quiz record.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xxs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3.5 font-semibold">Quiz Title & Description</th>
                  <th className="px-5 py-3.5 font-semibold">Linked Lesson Module</th>
                  <th className="px-5 py-3.5 font-semibold text-center">Questions</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredQuizzes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/30">
                    <td className="px-5 py-4 max-w-sm">
                      <p className="font-bold text-slate-800 leading-snug">{q.title}</p>
                      <p className="text-xxs text-slate-400 line-clamp-1 font-medium leading-relaxed">{q.description}</p>
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-600">
                      {getLinkedTrainingTitle(q.trainingModuleId)}
                    </td>
                    <td className="px-5 py-4 text-center text-xs font-extrabold text-slate-700">
                      {q.questions.length}
                    </td>
                    <td className="px-5 py-4 text-right flex items-center justify-end gap-2">
                      <Link href={`/admin/quizzes/${q.id}`}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="py-1 text-slate-600 border border-slate-200 hover:text-blue-600 hover:border-blue-200"
                          leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                        >
                          Edit Questions
                        </Button>
                      </Link>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDelete(q.id)}
                        className="py-1 text-xs font-bold text-red-500 hover:bg-red-50 hover:text-red-600"
                        leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={selectedDelete !== null}
        onClose={() => setSelectedDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Security Quiz"
        message="Are you sure you want to permanently delete this quiz? Active employee attempts logs for this test will remain, but the quiz itself will be deleted."
        confirmLabel="DELETE QUIZ"
        variant="danger"
        isLoading={loading}
      />
    </div>
  );
}
