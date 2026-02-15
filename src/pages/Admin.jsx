import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Link2, ArrowLeft, FileText, Save, X, Trash2, Edit3 } from 'lucide-react';
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

  const { data: allItems = [] } = useQuery({
    queryKey: ['admin-links'],
    queryFn: () => base44.entities.ReferralLink.list('sort_order'),
  });

  const links = allItems.filter(item => item.category !== 'Článek');
  const articles = allItems.filter(item => item.category === 'Článek');

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-links'] });
    queryClient.invalidateQueries({ queryKey: ['referral-links'] });
    setShowForm(false);
    setEditingItem(null);
  };

  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const data = {
      title: formData.get('title'),
      description: formData.get('content'),
      category: 'Článek',
      url: '',      // Musí být prázdné, aby nebyla nula
      reward: '',   // Musí být prázdné, aby nebyla nula
      image: '',    // Musí být prázdné
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
      alert("Chyba při ukládání.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Home')}><Button variant="ghost" size="icon"><ArrowLeft /></Button></Link>
            <h1 className="text-2xl font-bold">Správa obsahu</h1>
          </div>
          {!showForm && (
            <Button onClick={() => { setEditingItem(null); setShowForm(true); }} className="bg-slate-900">
              <Plus className="w-4 h-4 mr-2" /> {activeTab === 'links' ? 'Nový odkaz' : 'Nový článek'}
            </Button>
          )}
        </div>

        {!showForm && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="w-full max-w-[400px]">
              <TabsTrigger value="links" className="flex-1">Odkazy</TabsTrigger>
              <TabsTrigger value="articles" className="flex-1">Články</TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <AnimatePresence mode="wait">
          {showForm ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {activeTab === 'links' ? (
                <LinkForm onSuccess={handleSuccess} editingLink={editingItem} onCancel={() => setShowForm(false)} />
              ) : (
                <form onSubmit={handleArticleSubmit} className="space-y-4 border p-6 rounded-xl">
                  <Input name="title" defaultValue={editingItem?.title} required placeholder="Titulek článku" />
                  <Textarea name="content" defaultValue={editingItem?.description} required placeholder="Obsah..." className="min-h-[300px]" />
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Ukládám...' : 'Uložit článek'}</Button>
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
                    <div key={art.id} className="p-4 border rounded-xl flex justify-between items-center">
                      <span className="font-medium">{art.title}</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => { setEditingItem(art); setShowForm(true); }}><Edit3 className="w-4 h-4" /></Button>
                        <Button variant="ghost" className="text-red-500" onClick={async () => { if(confirm('Smazat?')) { await base44.entities.ReferralLink.delete(art.id); handleSuccess(); } }}><Trash2 className="w-4 h-4" /></Button>
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
