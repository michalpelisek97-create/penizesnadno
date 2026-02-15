import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Link2, LayoutGrid, Settings, ArrowLeft, FileText, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import LinkForm from '@/components/admin/LinkForm';
import LinkTable from '@/components/admin/LinkTable';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('links');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  // Data pro odkazy
  const { data: links = [] } = useQuery({
    queryKey: ['admin-links'],
    queryFn: () => base44.entities.ReferralLink.list('sort_order'),
  });

  // Data pro články
  const { data: articles = [] } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: () => base44.entities.Article.list('-created_at'),
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-links'] });
    queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
    queryClient.invalidateQueries({ queryKey: ['referral-links'] });
    queryClient.invalidateQueries({ queryKey: ['articles'] });
    setShowForm(false);
    setEditingItem(null);
  };

  // Funkce pro uložení článku přímo zde
  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      content: formData.get('content'),
      category: 'články',
      is_active: true,
    };

    try {
      if (editingItem) {
        await base44.entities.Article.update(editingItem.id, data);
      } else {
        await base44.entities.Article.create(data);
      }
      handleSuccess();
    } catch (error) {
      console.error("Chyba:", error);
      alert("Nepodařilo se uložit článek.");
    } finally {
      setLoading(false);
    }
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
              <h1 className="text-2xl font-bold text-slate-900">Správa webu</h1>
              <p className="text-sm text-slate-500">Odkazy a články na jednom místě</p>
            </div>
          </div>
          
          {!showForm && (
            <Button 
              onClick={() => { setEditingItem(null); setShowForm(true); }}
              className="bg-slate-900 hover:bg-slate-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              {activeTab === 'links' ? 'Přidat odkaz' : 'Nový článek'}
            </Button>
          )}
        </div>

        {!showForm && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
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

        <AnimatePresence mode="wait">
          {showForm ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {activeTab === 'links' ? (
                <LinkForm 
                  onSuccess={handleSuccess} 
                  editingLink={editingItem}
                  onCancel={() => { setShowForm(false); setEditingItem(null); }}
                />
              ) : (
                /* FORMULÁŘ PRO ČLÁNKY PŘÍMO ZDE */
                <form onSubmit={handleArticleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold">{editingItem ? 'Upravit článek' : 'Nový článek'}</h2>
                    <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditingItem(null); }}>
                        <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Titulek článku</label>
                    <Input name="title" defaultValue={editingItem?.title} required placeholder="Zadejte název..." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Obsah</label>
                    <Textarea 
                      name="content" 
                      defaultValue={editingItem?.content} 
                      required 
                      placeholder="Sem napište text..." 
                      className="min-h-[300px]"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={loading} className="bg-slate-900">
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Ukládám...' : 'Uložit článek'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingItem(null); }}>
                      Zrušit
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {activeTab === 'links' ? (
                <LinkTable 
                  links={links} 
                  onEdit={(item) => { setEditingItem(item); setShowForm(true); }}
                  onRefresh={() => queryClient.invalidateQueries({ queryKey: ['admin-links'] })}
                />
              ) : (
                /* TABULKA ČLÁNKŮ PŘÍMO ZDE */
                <div className="grid gap-4">
                  {articles.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl border border-dashed text-center text-slate-400">
                        Zatím jsi nenapsal žádný článek.
                    </div>
                  ) : (
                    articles.map(article => (
                      <div key={article.id} className="bg-white p-5 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                        <div>
                          <h3 className="font-bold text-slate-900">{article.title}</h3>
                          <p className="text-xs text-slate-500">Vytvořeno: {new Date(article.created_at).toLocaleDateString('cs-CZ')}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => { setEditingItem(article); setShowForm(true); }}>
                          Upravit
                        </Button>
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
