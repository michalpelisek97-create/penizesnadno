import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Link2, LayoutGrid, Settings, ArrowLeft, FileText } from 'lucide-react'; // Přidáno FileText
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// Importy pro Odkazy
import LinkForm from '@/components/admin/LinkForm';
import LinkTable from '@/components/admin/LinkTable';

// --- PŘEDPOKLAD: Vytvoř si podobné komponenty pro články ---
// import ArticleForm from '@/components/admin/ArticleForm';
// import ArticleTable from '@/components/admin/ArticleTable';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('links');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // Přejmenováno z editingLink pro obecnost
  const queryClient = useQueryClient();

  // Query pro Odkazy
  const { data: links = [] } = useQuery({
    queryKey: ['admin-links'],
    queryFn: () => base44.entities.ReferralLink.list('sort_order'),
  });

  // Query pro Články
  const { data: articles = [] } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: () => base44.entities.Article.list('-created_at'), // Řazení od nejnovějších
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: [activeTab === 'links' ? 'admin-links' : 'admin-articles'] });
    setShowForm(false);
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
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
              <h1 className="text-2xl font-bold text-slate-900">Správa obsahu</h1>
              <p className="text-sm text-slate-500">Spravuj své odkazy a články na jednom místě</p>
            </div>
          </div>
          
          {!showForm && (
            <Button 
              onClick={() => { setEditingItem(null); setShowForm(true); }}
              className="bg-slate-900 hover:bg-slate-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              {activeTab === 'links' ? 'Přidat odkaz' : 'Napsat článek'}
            </Button>
          )}
        </div>

        {/* Přepínač sekcí */}
        {!showForm && (
          <Tabs defaultValue="links" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
              <TabsTrigger value="links" className="flex gap-2">
                <Link2 className="w-4 h-4" /> Odkazy
              </TabsTrigger>
              <TabsTrigger value="articles" className="flex gap-2">
                <FileText className="w-4 h-4" /> Články
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {/* Obsah (Formuláře / Tabulky) */}
        <AnimatePresence mode="wait">
          {showForm ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {activeTab === 'links' ? (
                <LinkForm onSuccess={handleSuccess} editingLink={editingItem} onCancel={handleCancel} />
              ) : (
                /* Zde bude tvůj ArticleForm */
                <div className="bg-white p-8 rounded-xl border">Formulář pro články (ArticleForm) zatím není vytvořen.</div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              {activeTab === 'links' ? (
                <LinkTable 
                  links={links} 
                  onEdit={handleEdit}
                  onRefresh={() => queryClient.invalidateQueries({ queryKey: ['admin-links'] })}
                />
              ) : (
                /* Zde bude tvá ArticleTable */
                <div className="bg-white p-8 rounded-xl border text-center text-slate-500">
                  Tabulka článků (ArticleTable) zatím není vytvořena. <br/>
                  Počet článků v databázi: {articles.length}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}