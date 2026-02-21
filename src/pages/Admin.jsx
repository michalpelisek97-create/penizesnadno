import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

import { Plus, Link2, FileText, ArrowLeft } from 'lucide-react';
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

  // Všechna data taháme z ReferralLink
  const { data: allData = [] } = useQuery({
    queryKey: ['admin-data'],
    queryFn: () => base44.entities.ReferralLink.list('-created_at'),
  });

  // Rozdělení na odkazy a články pro zobrazení v tabulkách
  const links = allData.filter(item => !item.is_article);
  const articles = allData.filter(item => item.is_article);

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-data'] });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      content: formData.get('content'),
      is_article: true,
      is_active: true,
      categories: ['clanek']
    };

    try {
      if (editingItem) {
        await base44.entities.ReferralLink.update(editingItem.id, data);
      } else {
        await base44.entities.ReferralLink.create(data);
      }
      handleSuccess();
    } catch (err) { 
      alert("Chyba při ukládání: " + err.message); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 text-slate-900">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Home')}><Button variant="ghost"><ArrowLeft /></Button></Link>
            <h1 className="text-2xl font-bold">Administrace</h1>
          </div>
          {!showForm && (
            <Button onClick={() => { setEditingItem(null); setShowForm(true); }}>
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

        <div>
          {showForm ? (
            <div>
              {activeTab === 'links' ? (
                <LinkForm 
                  onSuccess={handleSuccess} 
                  editingLink={editingItem} 
                  onCancel={() => { setShowForm(false); setEditingItem(null); }} 
                />
              ) : (
                <form onSubmit={handleArticleSubmit} className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                  <h2 className="text-xl font-bold mb-4">{editingItem ? 'Upravit článek' : 'Nový článek'}</h2>
                  <Input name="title" defaultValue={editingItem?.title} placeholder="Název článku" required />
                  <Textarea name="content" defaultValue={editingItem?.content} placeholder="Obsah článku..." className="min-h-[400px]" required />
                  <div className="flex gap-2 pt-4">
                    <Button type="submit">Uložit článek</Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Zrušit</Button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div>
              {activeTab === 'links' ? (
                <LinkTable links={links} onEdit={(item) => { setEditingItem(item); setShowForm(true); }} />
              ) : (
                <div className="grid gap-4">
                  {articles.map(art => (
                    <div key={art.id} className="bg-white p-5 rounded-xl border flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="font-bold">{art.title}</span>
                        <span className="text-xs text-slate-400">Článek</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setEditingItem(art); setShowForm(true); }}>Upravit</Button>
                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => { if(confirm('Smazat?')) base44.entities.ReferralLink.delete(art.id).then(handleSuccess); }}>Smazat</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}