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

// Importy pro původní referral odkazy
import LinkForm from '@/components/admin/LinkForm';
import LinkTable from '@/components/admin/LinkTable';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('links');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Načítáme vše z ReferralLink
  const { data: allItems = [], isLoading } = useQuery({
    queryKey: ['admin-links'],
    queryFn: () => base44.entities.ReferralLink.list('sort_order'),
  });

  // Rozdělení dat pro zobrazení v administraci
  const links = allItems.filter(item => item.category !== 'Článek');
  const articles = allItems.filter(item => item.category === 'Článek');

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-links'] });
    queryClient.invalidateQueries({ queryKey: ['referral-links'] });
    setShowForm(false);
    setEditingItem(null);
  };

  // FUNKCE PRO UKLÁDÁNÍ ČLÁNKU DO REFERRALLINK
  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    // Data pro článek - vymažeme pole typická pro referraly
    const data = {
      title: formData.get('title'),
      description: formData.get('content'), // Text článku do popisu
      category: 'Článek',                 // Identifikátor pro filtraci
      url: '',                            // Článek není odkaz
      reward: '',                         // Článek nemá bonus
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
      alert("Chyba při ukládání článku.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Opravdu smazat?")) return;
    try {
      await base44.entities.ReferralLink.delete(id);
      handleSuccess();
    } catch (e) { alert("Smazání selhalo."); }
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
              <p className="text-sm text-slate-500">Odkazy a články v jedné databázi</p>
            </div>
          </div>
          
          {!showForm && (
            <Button 
              onClick={() => { setEditingItem(null); setShowForm(true); }}
              className="bg-slate-900"
            >
              <Plus className="w-4 h-4 mr-2" />
              {activeTab === 'links' ? 'Nový odkaz' : 'Napsat článek'}
            </Button>
          )}
        </div>

        {/* Tabs */}
        {!showForm && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
              <TabsTrigger value="links" className="flex gap-2">
                <Link2 className="w-4 h-4" /> Odkazy ({links.length})
              </TabsTrigger>
              <TabsTrigger value="articles" className="flex gap-2">
                <FileText className="w-4 h-4" /> Články ({articles.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <AnimatePresence mode="wait">
          {showForm ? (
            <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {activeTab === 'links' ? (
                <LinkForm 
                  onSuccess={handleSuccess} 
                  editingLink={editingItem} 
                  onCancel={() => { setShowForm(false); setEditingItem(null); }} 
                />
              ) : (
                /* FORMULÁŘ PRO ČLÁNEK */
                <form onSubmit={handleArticleSubmit} className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-xl font-bold">{editingItem ? 'Upravit článek' : 'Nový článek'}</h2>
                    <Button type="button" variant="ghost" onClick={() => setShowForm(false)}><X className="w-4 h-4" /></Button>
                  </div>
                  <Input name="title" defaultValue={editingItem?.title} required placeholder="Nadpis článku..." />
                  <Textarea 
                    name="content" 
                    defaultValue={editingItem?.description} 
                    required 
                    placeholder="Obsah článku..." 
                    className="min-h-[300px]" 
                  />
                  <div className="flex gap-3">
                    <Button type="submit" disabled={isSubmitting} className="bg-slate-900">
                      <Save className="w-4 h-4 mr-2" />
                      {isSubmitting ? 'Ukládám...' : 'Publikovat článek'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Zrušit</Button>
                  </div>
                </form>
              )}
            </motion.div>
          ) : (
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {activeTab === 'links' ? (
                <LinkTable 
                  links={links} 
                  onEdit={(item) => { setEditingItem(item); setShowForm(true); }} 
                />
              ) : (
                /* TABULKA ČLÁNKŮ */
                <div className="grid gap-4">
                  {articles.length === 0 ? (
                    <div className="p-20 text-center bg-white rounded-xl border border-dashed text-slate-400">
                      Zatím žádné články.
                    </div>
                  ) : (
                    articles.map(art => (
                      <div key={art.id} className="bg-white p-5 rounded-xl border flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900">{art.title}</h3>
                            <p className="text-xs text-slate-500 line-clamp-1">{art.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => { setEditingItem(art); setShowForm(true); }}>
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => handleDelete(art.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
