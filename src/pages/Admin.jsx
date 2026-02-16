import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Link2, FileText, ArrowLeft, Save, Trash2 } from 'lucide-react';
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

  // Query pro Články (nová entita)
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
            <Button onClick={() => { setEditingItem(null); setShowForm(true); }}>
              <Plus className="mr-2 h-4 w-4" /> {activeTab === 'links' ? 'Nový odkaz' : 'Nový článek'}
            </Button>
          )}
        </div>

        {!showForm && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="w-[400px]">
              <TabsTrigger value="links" className="flex-1"><Link2 className="mr-2 h-4 w-4" /> Odkazy</TabsTrigger>
              <TabsTrigger value="articles" className="flex-1"><FileText className="mr-2 h-4 w-4" /> Články</TabsTrigger>
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
                  <Input name="title" defaultValue={editingItem?.title} placeholder="Název článku" required />
                  <Textarea name="content" defaultValue={editingItem?.content} placeholder="Obsah..." className="min-h-[300px]" required />
                  <div className="flex gap-2">
                    <Button type="submit">Uložit článek</Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Zrušit</Button>
                  </div>
                </form>
              )}
            </motion.div>
          ) : (
            <div key={activeTab}>
              {activeTab === 'links' ? (
                <LinkTable links={links} onEdit={(item) => { setEditingItem(item); setShowForm(true); }} />
              ) : (
                <div className="space-y-4">
                  {articles.map(art => (
                    <div key={art.id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
                      <span className="font-bold">{art.title}</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setEditingItem(art); setShowForm(true); }}>Upravit</Button>
                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => { if(confirm('Smazat?')) { base44.entities.Article.delete(art.id).then(handleSuccess); } }}>Smazat</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
