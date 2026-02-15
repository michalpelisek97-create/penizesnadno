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

  // Načítáme všechna data z ReferralLink
  const { data: allData = [], isLoading } = useQuery({
    queryKey: ['referral-links'],
    queryFn: () => base44.entities.ReferralLink.filter({ is_active: true }, 'sort_order'),
  });

  // --- FILTRACE (TADY SE TO OPRAVUJE) ---
  
  // 1. Odkazy jsou VŠE, co NENÍ v kategorii "Článek"
  const linksOnly = useMemo(() => 
    allData.filter(item => item.category !== 'Článek'), 
  [allData]);

  // 2. Články jsou POUZE ty, co MAJÍ kategorii "Článek"
  const articlesOnly = useMemo(() => 
    allData.filter(item => item.category === 'Článek'), 
  [allData]);

  // 3. Co se zobrazí v mřížce (referral karty)
  const filteredLinks = useMemo(() => {
    // Pokud klikneš na kategorii "Článek", mřížka odkazů zmizí
    if (selectedCategory === 'Článek') return [];
    
    // Pokud jsi na "Vše", ukážeš jen referraly (linksOnly)
    if (selectedCategory === 'all') return linksOnly;
    
    // Jinak filtruješ referraly podle kategorie
    return linksOnly.filter(link => link.category === selectedCategory);
  }, [selectedCategory, linksOnly]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="relative max-w-6xl mx-auto px-4 py-12">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-slate-200 shadow-sm mb-6">
            <Gift className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-slate-700">Bonusy & Články</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Vyzkoušej & Ušetři</h1>
        </motion.div>

        {/* Filtr kategorií */}
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        {/* MŘÍŽKA REFERRALŮ (Bonusy) */}
        <AnimatePresence mode="wait">
          {selectedCategory !== 'Článek' && (
            <motion.div 
              key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
            >
              {isLoading ? (
                [...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)
              ) : filteredLinks.map((link, index) => (
                <LinkCard key={link.id} link={link} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* SEKCE ČLÁNKŮ (Zobrazí se POUZE na záložce Články) */}
        <AnimatePresence mode="wait">
          {selectedCategory === 'Článek' && (
            <motion.div 
              key="articles" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3 mb-8 border-b pb-6 border-slate-200">
                <FileText className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-slate-900">Návody a články</h2>
              </div>

              {articlesOnly.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articlesOnly.map((article) => (
                    <div key={article.id} className="bg-white p-8 rounded-3xl border shadow-sm group">
                      <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-600 transition-colors">{article.title}</h3>
                      <p className="text-slate-600 mb-6 line-clamp-4">{article.description}</p>
                      <div className="flex items-center text-sm font-bold text-slate-900">
                        Přečíst <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-slate-400">Zatím žádné články.</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
