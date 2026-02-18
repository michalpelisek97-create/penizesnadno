import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Link2, FileText, ArrowLeft, ShoppingBag } from 'lucide-react'; // Přidána ikona
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import LinkForm from '@/components/admin/LinkForm';
import LinkTable from '@/components/admin/LinkTable';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('links');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const queryClient = useQueryClient();

  // Query pro Odkazy
  const { data: links = [] } = useQuery({
    queryKey: ['admin-links'],
    queryFn: () => base44.entities.ReferralLink.list('sort_order'),
  });

  // Query pro Články
  const { data: articles = [] } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: () => base44.entities.Article.list('-created_at'),
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-links'] });
    queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
    setShowForm(false);
    setEditingItem(null);
  };

  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      content: formData.get('content'),
      is_active: true,
    };

    try {
      if (editingItem) {
        await base44.entities.Article.update(editingItem.id, data);
      } else {
        await base44.entities.Article.create(data);
      }
      handleSuccess();
    } catch (e) { alert("Chyba při ukládání článku."); }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Home')}><Button variant="ghost"><ArrowLeft /></Button></Link>
            <h1 className="text-2xl font-bold">Administrace</h1>
          </div>
          {!showForm && (
            <Button 
              onClick={() => { setEditingItem(null); setShowForm(true); }}
              className={activeTab === 'links' ? "bg-indigo-600 hover:bg-indigo-700" : ""}
            >
              <Plus className="mr-2 h-4 w-4" /> 
              {activeTab === 'links' ? 'Nový odkaz' : 'Nový článek'}
            </Button>
          )}
        </div>

        {!showForm && (
          <div className="flex gap-4 mb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="links"><Link2 className="mr-2 h-4 w-4" /> Odkazy</TabsTrigger>
                <TabsTrigger value="articles"><FileText className="mr-2 h-4 w-4" /> Články</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        <AnimatePresence mode="wait">
          {showForm ? (
            <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {activeTab === 'links' ? (
                /* LinkForm musí obsahovat Select/Input pro kategorii "Nákup levně" */
                <LinkForm 
                  onSuccess={handleSuccess} 
                  editingLink={editingItem} 
                  onCancel={() => { setShowForm(false); setEditingItem(null); }} 
                />
              ) : (
                <form onSubmit={handleArticleSubmit} className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                   <h2 className="text-xl font-bold mb-4">{editingItem ? 'Upravit článek' : 'Nový článek'}</h2>
                  <Input name="title" defaultValue={editingItem?.title} placeholder="Název článku" required className="text-lg font-semibold" />
                  <Textarea name="content" defaultValue={editingItem?.content} placeholder="Obsah článku (podporuje HTML)..." className="min-h-[400px] font-mono text-sm" required />
                  <div className="flex gap-2 pt-4">
                    <Button type="submit">Uložit článek</Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Zrušit</Button>
                  </div>
                </form>
              )}
            </motion.div>
          ) : (
            <div key={activeTab}>
              {activeTab === 'links' ? (
                <div className="space-y-2">
                  <LinkTable 
                    links={links} 
                    onEdit={(item) => { setEditingItem(item); setShowForm(true); }} 
                  />
                  {links.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed text-slate-400">
                      Zatím žádné odkazy.
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid gap-4">
                  {articles.map(art => (
                    <div key={art.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center hover:border-indigo-300 transition-colors">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{art.title}</span>
                        <span className="text-xs text-slate-400">Vytvořeno: {new Date(art.created_at).toLocaleDateString('cs-CZ')}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setEditingItem(art); setShowForm(true); }}>Upravit</Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => { if(confirm('Opravdu smazat tento článek?')) { base44.entities.Article.delete(art.id).then(handleSuccess); } }}>Smazat</Button>
                      </div>
                    </div>
                  ))}
                  {articles.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed text-slate-400">
                      Zatím žádné články.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
