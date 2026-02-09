import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Link2, LayoutGrid, Settings, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LinkForm from '@/components/admin/LinkForm';
import LinkTable from '@/components/admin/LinkTable';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Admin() {
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const queryClient = useQueryClient();

  const { data: links = [], isLoading } = useQuery({
    queryKey: ['admin-links'],
    queryFn: () => base44.entities.ReferralLink.list('sort_order'),
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-links'] });
    queryClient.invalidateQueries({ queryKey: ['referral-links'] });
    setShowForm(false);
    setEditingLink(null);
  };

  const handleEdit = (link) => {
    setEditingLink(link);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingLink(null);
  };

  const stats = {
    total: links.length,
    active: links.filter(l => l.is_active).length,
    categories: [...new Set(links.map(l => l.category))].length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Home')}>
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Správa odkazů</h1>
              <p className="text-sm text-slate-500">Přidávej a upravuj referenční odkazy</p>
            </div>
          </div>
          
          <Button 
            onClick={() => { setEditingLink(null); setShowForm(true); }}
            className="bg-slate-900 hover:bg-slate-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Přidat odkaz
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-slate-100">
                <Link2 className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-xs text-slate-500">Celkem odkazů</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-100">
                <Settings className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.active}</p>
                <p className="text-xs text-slate-500">Aktivních</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-100">
                <LayoutGrid className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.categories}</p>
                <p className="text-xs text-slate-500">Kategorií</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Form / Table */}
        <AnimatePresence mode="wait">
          {showForm ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <LinkForm 
                onSuccess={handleSuccess} 
                editingLink={editingLink}
                onCancel={handleCancel}
              />
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <LinkTable 
                links={links} 
                onEdit={handleEdit}
                onRefresh={() => queryClient.invalidateQueries({ queryKey: ['admin-links'] })}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}