import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Link2, Sparkles, Globe, Image as ImageIcon } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const categories = [
  { id: 'crypto', label: 'Kryptoměny' },
  { id: 'banks', label: 'Banky' },
  { id: 'cashback', label: 'Cashback' },
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
    categories: [],
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
    
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Extract Open Graph metadata from this URL: ${formData.url}
      
      Return the following information:
      - title: The page title or og:title
      - description: The meta description or og:description (max 150 characters)
      - image_url: The og:image URL if available
      
      If you can't access the URL, make reasonable assumptions based on the domain name.`,
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
    setIsFetchingMeta(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (editingLink) {
      await base44.entities.ReferralLink.update(editingLink.id, formData);
      toast.success('Odkaz byl aktualizován');
    } else {
      await base44.entities.ReferralLink.create(formData);
      toast.success('Odkaz byl přidán');
    }

    setIsLoading(false);
    onSuccess();
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
          {/* URL with Fetch Button */}
          <div className="space-y-2">
            <Label htmlFor="url" className="text-slate-700">URL adresa *</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/ref/123"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
              <Button 
                type="button" 
                variant="outline"
                onClick={fetchOpenGraphData}
                disabled={isFetchingMeta}
                className="shrink-0"
              >
                {isFetchingMeta ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Načíst data
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-700">Název *</Label>
            <Input
              id="title"
              placeholder="Název služby"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700">Popis</Label>
            <Textarea
              id="description"
              placeholder="Krátký popis bonusu nebo služby..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image_url" className="text-slate-700">URL obrázku</Label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="image_url"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="pl-10"
              />
            </div>
            {formData.image_url && (
              <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 h-32">
                <img 
                  src={formData.image_url} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
          </div>

          {/* Category & CTA */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-700">Kategorie *</Label>
              <div className="grid grid-cols-2 gap-2 p-3 border rounded-lg bg-slate-50/50">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center space-x-2">
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
                    <label
                      htmlFor={`cat-${cat.id}`}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {cat.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cta_text" className="text-slate-700">Text tlačítka</Label>
              <Input
                id="cta_text"
                placeholder="Získat bonus"
                value={formData.cta_text}
                onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
              />
            </div>
          </div>

          {/* Sort Order & Active */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sort_order" className="text-slate-700">Pořadí</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700">Aktivní</Label>
              <div className="flex items-center h-10">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <span className="ml-2 text-sm text-slate-600">
                  {formData.is_active ? 'Zobrazeno' : 'Skryto'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Zrušit
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 bg-slate-900 hover:bg-slate-800"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {editingLink ? 'Uložit změny' : 'Přidat odkaz'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}