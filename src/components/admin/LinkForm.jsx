import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link2, Image as ImageIcon } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const categories = [
  { id: 'banks', label: 'Banky' },
  { id: 'crypto', label: 'Kryptoměny' },
  { id: 'cashback', label: 'Cashback' },
  { id: 'Nákup levně', label: 'Nákup levně' },
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
    category: '', 
    categories: [], 
    cta_text: 'Získat bonus',
    is_active: true,
    sort_order: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // DŮLEŽITÉ: Nastavíme hlavní 'category' podle prvního zaškrtnutého políčka.
    // Pokud je zaškrtnuto "Nákup levně", v Home.jsx se díky filtru 'link.category === selectedCategory'
    // tato položka zobrazí JEN tehdy, když je vybrána tato kategorie.
    const mainCat = formData.categories.length > 0 ? formData.categories[0] : 'other';
    
    const finalData = {
      ...formData,
      category: mainCat
    };

    try {
      if (editingLink) {
        await base44.entities.ReferralLink.update(editingLink.id, finalData);
        toast.success('Aktualizováno');
      } else {
        await base44.entities.ReferralLink.create(finalData);
        toast.success('Vytvořeno');
      }
      onSuccess();
    } catch (e) {
      toast.error('Chyba při ukládání');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Link2 className="w-5 h-5" />
          {editingLink ? 'Upravit' : 'Nový odkaz'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="space-y-2">
            <Label>URL adresa *</Label>
            <div className="flex gap-2">
              <Input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
                required
              />
              <Button type="button" variant="outline" onClick={fetchOpenGraphData} disabled={isFetchingMeta}>
                {isFetchingMeta ? <Loader2 className="animate-spin h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Název *</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Popis</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* VRÁCENÉ POLE PRO OBRÁZEK */}
          <div className="space-y-2">
            <Label>URL Obrázku</Label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                className="pl-10"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://img.com"
              />
            </div>
            {formData.image_url && (
              <img src={formData.image_url} className="mt-2 h-20 w-full object-cover rounded-md border" alt="Preview" />
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-red-500 font-bold">Kategorie (Pokud chceš, aby to bylo JEN v Nákup levně, zaškrtni JEN tu jednu)</Label>
            <div className="grid grid-cols-2 gap-2 p-3 border rounded-lg bg-slate-50">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${cat.id}`}
                    checked={formData.categories?.includes(cat.id)}
                    onCheckedChange={(checked) => {
                      const newCats = checked
                        ? [...formData.categories, cat.id]
                        : formData.categories.filter(c => c !== cat.id);
                      setFormData({ ...formData, categories: newCats });
                    }}
                  />
                  <Label htmlFor={`cat-${cat.id}`} className="text-sm cursor-pointer">{cat.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Text tlačítka</Label>
              <Input
                value={formData.cta_text}
                onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Pořadí</Label>
              <Input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Ukládám...' : 'Uložit'}
            </Button>
            <Button type="button" variant="ghost" onClick={onCancel}>Zrušit</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}