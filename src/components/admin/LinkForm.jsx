import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Link2, Sparkles, Globe, Image as ImageIcon } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

// PŘIDÁNA KATEGORIE NÁKUP LEVNĚ
const categories = [
  { id: 'banks', label: 'Banky' },
  { id: 'crypto', label: 'Kryptoměny' },
  { id: 'cashback', label: 'Cashback' },
  { id: 'Nákup levně', label: 'Nákup levně' }, // Musí se shodovat s ID v Home.jsx
  { id: 'games', label: 'Hry' },
  { id: 'apps', label: 'Aplikace' },
  { id: 'other', label: 'Ostatní' },
];

export default function LinkForm({ onSuccess, editingLink, onCancel }) {
  const [formData, setFormData] = useState(editingLink || {
    url: '',
    title: '',
    description: '',
    image_url: '',
    category: '', // Hlavní kategorie pro filtrování
    categories: [], // Pole pro zobrazení štítků
    cta_text: 'Získat bonus',
    is_active: true,
    sort_order: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);

  const fetchOpenGraphData = async () => {
    if (!formData.url) {
      toast.error('Zadej URL adresu');
      return;
    }
    setIsFetchingMeta(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Extract Open Graph metadata from this URL: ${formData.url}. Return title, description (max 150 chars), and image_url.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            image_url: { type: "string" }
          }
        }
      });
      setFormData(prev => ({
        ...prev,
        title: result.title || prev.title,
        description: result.description || prev.description,
        image_url: result.image_url || prev.image_url
      }));
      toast.success('Metadata načtena');
    } catch (e) {
      toast.error('Nepodařilo se načíst metadata');
    } finally {
      setIsFetchingMeta(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // ZAJIŠTĚNÍ, ŽE HLAVNÍ KATEGORIE JE TA PRVNÍ VYBRANÁ
    // To je klíčové pro filtrování na Home stránce
    const finalData = {
      ...formData,
      category: formData.categories[0] || 'other'
    };

    try {
      if (editingLink) {
        await base44.entities.ReferralLink.update(editingLink.id, finalData);
        toast.success('Odkaz byl aktualizován');
      } else {
        await base44.entities.ReferralLink.create(finalData);
        toast.success('Odkaz byl přidán');
      }
      onSuccess();
    } catch (e) {
      toast.error('Chyba při ukládání');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-slate-200/60 shadow-lg">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Link2 className="w-5 h-5 text-slate-600" />
          {editingLink ? 'Upravit odkaz' : 'Přidat nový odkaz'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="space-y-2">
            <Label htmlFor="url" className="text-slate-700">URL adresa *</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="url"
                  type="url"
                  placeholder="https://levnynakup.cz"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
              <Button type="button" variant="outline" onClick={fetchOpenGraphData} disabled={isFetchingMeta}>
                {isFetchingMeta ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Načíst data'}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-700">Název *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700">Popis</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700">Kategorie * (pro Nákup levně vyberte pouze tuto možnost)</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 border rounded-lg bg-slate-50/50">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center space-x-2 bg-white p-2 rounded border border-slate-100 shadow-sm">
                  <Checkbox
                    id={`cat-${cat.id}`}
                    checked={formData.categories?.includes(cat.id)}
                    onCheckedChange={(checked) => {
                      const newCategories = checked
                        ? [...(formData.categories || []), cat.id]
                        : (formData.categories || []).filter(c => c !== cat.id);
                      setFormData({ ...formData, categories: newCategories });
                    }}
                  />
                  <label htmlFor={`cat-${cat.id}`} className="text-xs font-bold cursor-pointer select-none">
                    {cat.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cta_text">Text tlačítka</Label>
              <Input
                id="cta_text"
                value={formData.cta_text}
                onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort_order">Pořadí (číslo)</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingLink ? 'Uložit změny' : 'Vytvořit odkaz'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>Zrušit</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
