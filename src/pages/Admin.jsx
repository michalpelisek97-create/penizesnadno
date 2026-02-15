import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Link2, ArrowLeft, FileText, Save, X, Trash2 } from 'lucide-react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Načítáme vše z jedné entity ReferralLink
  const { data: allItems = [] } = useQuery({
    queryKey: ['admin-links'],
    queryFn: () => base44.entities.ReferralLink.list('sort_order'),
  });

  // Rozdělíme data podle kategorie přímo v kódu
  const links = allItems.filter(item => item.category !== 'Článek');
  const articles = allItems.filter(item => item.category === 'Článek');

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-links'] });
    queryClient.invalidateQueries({ queryKey: ['referral-links'] });
    setShowForm(false);
    setEditingItem(null);
  };

  // Ukládání článku do entity ReferralLink
  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    const data = {
      title: formData.get('title'),
      description: formData.get('content'), // Text článku uložíme do popisu
      category: 'Článek', // Fixní kategorie pro rozlišení
      url: '#', // Článek nepotřebuje URL, ale pole může být povinné
      is_active: true,
      sort_order: 0
    };

    try {
      if (editingItem) {
        await base44.entities.ReferralLink.update(editingItem.id, data);
      } else {
        await base44.entities.ReferralLink.create(data);
      }
      handleSuccess();
    } catch (error) {
      console.error(error);
      alert("Chyba při ukládání do ReferralLink.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Opravdu smazat?")) return;
    try {
      await base44.entities.ReferralLink.delete(id);
      handleSuccess();
    } catch (e) { alert("Smazání selhalo."); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Home')}>
              <Button variant="ghost" size="icon" className="rounded-full"><ArrowLeft className="w-5 h-5" /></Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Správa webu</h1>
              <p className="text-sm text-slate-500">Vše uloženo v entitě ReferralLink</p>
            </div>
          </div>
          
          {!showForm && (
            <Button onClick={() => { setEditingItem(null); setShowForm(true); }} className="bg-slate-900">
              <Plus className="w-4 h-4 mr-2" />
              {activeTab === 'links' ? 'Nový odkaz' : 'Nový článek'}
            </Button>
          )}
        </div>

        {!showForm && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="w-full max-w-[400px]">
              <TabsTrigger value="links" className="flex-1">Odkazy ({links.length})</TabsTrigger>
              <TabsTrigger value="articles" className="flex-1">Články ({articles.length})</TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <AnimatePresence mode="wait">
          {showForm ? (
            <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {activeTab === 'links' ? (
                <LinkForm onSuccess={handleSuccess} editingLink={editingItem} onCancel={() => setShowForm(false)} />
              ) : (
                <form onSubmit={handleArticleSubmit} className="bg-white p-6 rounded-xl border space-y-4">
                  <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-xl font-bold">{editingItem ? 'Upravit článek' : 'Nový článek'}</h2>
                    <Button type="button" variant="ghost" onClick={() => setShowForm(false)}><X className="w-4 h-4" /></Button>
                  </div>
                  <Input name="title" defaultValue={editingItem?.title} required placeholder="Nadpis článku" />
                  <Textarea name="content" defaultValue={editingItem?.description} required placeholder="Text článku..." className="min-h-[300px]" />
                  <div className="flex gap-3">
                    <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 text-white">
                      {isSubmitting ? 'Ukládám...' : 'Uložit článek'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Zrušit</Button>
                  </div>
                </form>
              )}
            </motion.div>
          ) : (
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {activeTab === 'links' ? (
                <LinkTable links={links} onEdit={(item) => { setEditingItem(item); setShowForm(true); }} />
              ) : (
                <div className="grid gap-4">
                  {articles.length === 0 ? (
                    <div className="p-20 text-center bg-white rounded-xl border border-dashed text-slate-400">Žádné články.</div>
                  ) : (
                    articles.map(art => (
                      <div key={art.id} className="bg-white p-5 rounded-xl border flex justify-between items-center shadow-sm">
                        <div>
                          <h3 className="font-bold text-slate-900">{art.title}</h3>
                          <p className="text-xs text-slate-500 line-clamp-1">{art.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => { setEditingItem(art); setShowForm(true); }}>Upravit</Button>
                          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteItem(art.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
