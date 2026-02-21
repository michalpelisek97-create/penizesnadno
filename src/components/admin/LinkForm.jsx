import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Link2, Sparkles, Image as ImageIcon, Upload, X } from 'lucide-react';
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
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    image_url: '',
    categories: [], 
    button_text: 'Získat bonus',
    is_active: true,
    sort_order: 0,
    ...editingLink
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);

  useEffect(() => {
    if (editingLink) {
      setFormData({
        ...editingLink,
        button_text: editingLink.button_text || editingLink.cta_text || 'Získat bonus'
      });
    }
  }, [editingLink]);

  // Funkce pro zpracování nahraného souboru
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Obrázek je příliš velký (max 2MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image_url: reader.result }));
        toast.success('Obrázek připraven k uložení');
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchOpenGraphData = async () => {
    if (!formData.url) {
      toast.error('Zadej URL adresu');
      return;
    }
    setIsFetchingMeta(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Extract Open Graph metadata from this URL: ${formData.url}. Return title, description, and image_url.`,
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
      toast.error('Chyba při načítání metadat');
    } finally {
      setIsFetchingMeta(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const mainCat = formData.categories.length > 0 ? formData.categories[0] : 'other';
    
    const finalData = {
      ...formData,
      category: mainCat,
      cta_text: formData.button_text,
      button_text: formData.button_text
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
          {editingLink ? 'Upravit odkaz' : 'Nový odkaz'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="space-y-2">
            <Label className="font-bold">URL adresa *</Label>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-bold">Název *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">Text tlačítka</Label>
              <Input
                value={formData.button_text}
                onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                placeholder="Získat bonus"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Popis bonusu</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="h-20"
            />
          </div>

          {/* SEKCE PRO OBRÁZEK - VYLEPŠENÁ O NAHRÁVÁNÍ */}
          <div className="space-y-3 p-4 border rounded-xl bg-slate-50/50">
            <Label className="font-bold flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Obrázek (Nahrajte pro lepší rychlost)
            </Label>
            
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Input
                  className="bg-white"
                  value={formData.image_url?.startsWith('data:') ? '✅ Soubor připraven k uložení' : formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="Vložte URL nebo nahrajte soubor"
                />
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => fileInputRef.current.click()}
                  className="shrink-0"
                >
                  <Upload className="w-4 h-4 mr-2" /> Nahrát
                </Button>
              </div>

              {formData.image_url && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border bg-white group">
                  <img src={formData.image_url} className="w-full h-full object-contain" alt="Náhled" />
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setFormData({ ...formData, image_url: '' })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-bold">Kategorie</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 border rounded-lg bg-white">
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
                  <Label htmlFor={`cat-${cat.id}`} className="text-xs cursor-pointer">{cat.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1 bg-slate-900" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              {editingLink ? 'Uložit změny' : 'Vytvořit odkaz'}
            </Button>
            <Button type="button" variant="ghost" onClick={onCancel}>Zrušit</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
