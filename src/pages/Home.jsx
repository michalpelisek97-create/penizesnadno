import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, FileText, ArrowRight } from 'lucide-react';
import LinkCard from '@/components/links/LinkCard';
import CategoryFilter from '@/components/links/CategoryFilter';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Načítáme všechna data z jedné entity ReferralLink
  const { data: allData = [], isLoading } = useQuery({
    queryKey: ['referral-links'],
    queryFn: () => base44.entities.ReferralLink.filter({ is_active: true }, 'sort_order'),
  });

  // 1. ČISTÉ ROZDĚLENÍ DAT
  // linksOnly = Vše, co NENÍ článek
  const linksOnly = useMemo(() => 
    allData.filter(item => item.category !== 'Článek'), 
  [allData]);

  // articlesOnly = Pouze články
  const articlesOnly = useMemo(() => 
    allData.filter(item => item.category === 'Článek'), 
  [allData]);

  // 2. LOGIKA FILTROVÁNÍ ODKAZŮ PRO KATEGORIE
  const filteredLinks = useMemo(() => {
    // Pokud jsme na záložce Články, v mřížce odkazů nebude nic
    if (selectedCategory === 'Článek') return [];
    
    // Pokud jsme na "Vše" (all), ukážeme všechny referraly
    if (selectedCategory === 'all') return linksOnly;
    
    // FILTRACE KATEGORIÍ (Kryptoměny, Banky, atd.)
    // Kontroluje jak pole 'category', tak pole 'categories' (pokud je to pole)
    return linksOnly.filter(link => {
      const isInPrimaryCategory = link.category === selectedCategory;
      const isInCategoriesArray = Array.isArray(link.categories) && link.categories.includes(selectedCategory);
      return isInPrimaryCategory || isInCategoriesArray;
    });
  }, [selectedCategory, linksOnly]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="relative max-w-6xl mx-auto px-4 py-12 sm:py-16">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Vyzkoušej<span className="bg-gradient-to-r from-purple-600 to-rose-600 bg-clip-text text-transparent"> & Ušetři</span>
          </h1>
        </motion.div>

        {/* Filtr kategorií (Vše, Kryptoměny, Banky, Cashback, Hry, Články) */}
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        {/* MŘÍŽKA ODKAZŮ (Zobrazí se pro Vše a pro vybrané kategorie) */}
        <AnimatePresence mode="wait">
          {selectedCategory !== 'Článek' && (
            <motion.div 
              key="links-grid"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
            >
              {isLoading ? (
                [...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)
              ) : filteredLinks.length > 0 ? (
                filteredLinks.map((link, index) => (
                  <LinkCard key={link.id} link={link} index={index} />
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-slate-400 italic">
                  V kategorii {selectedCategory} zatím nejsou žádné nabídky.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* SEKCE ČLÁNKY (Zobrazí se POUZE při vybrané kategorii Článek) */}
        <AnimatePresence mode="wait">
          {selectedCategory === 'Článek' && (
            <motion.div 
              key="articles-list"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3 mb-8 border-b pb-6 border-slate-200">
                <FileText className="w-6 h-6 text-purple-600" />
                <h2 className="text-3xl font-bold text-slate-900">Návody a články</h2>
              </div>

              {articlesOnly.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {articlesOnly.map((article) => (
                    <div key={article.id} className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
                      <h3 className="text-2xl font-bold mb-4 text-slate-900 leading-tight">{article.title}</h3>
                      <p className="text-slate-600 mb-6 line-clamp-4 leading-relaxed">{article.description}</p>
                      <div className="flex items-center text-slate-900 font-bold group cursor-pointer">
                        Přečíst celý článek <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-slate-400 italic bg-white rounded-3xl border border-dashed">
                  Zatím tu nejsou žádné články. Vytvořte nějaký v administraci.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
