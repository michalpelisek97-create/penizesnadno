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

  const { data: allData = [], isLoading } = useQuery({
    queryKey: ['referral-links'],
    queryFn: () => base44.entities.ReferralLink.filter({ is_active: true }, 'sort_order'),
  });

  // 1. Rozdělení dat
  const linksOnly = useMemo(() => allData.filter(item => item.category !== 'Článek'), [allData]);
  const articlesOnly = useMemo(() => allData.filter(item => item.category === 'Článek'), [allData]);

  // 2. Logika pro zobrazení odkazů v kategoriích
  const filteredLinks = useMemo(() => {
    if (selectedCategory === 'all') return linksOnly;
    if (selectedCategory === 'Článek') return []; // Na záložce článků nechceme odkazy
    return linksOnly.filter(link => 
      link.category === selectedCategory || (link.categories && link.categories.includes(selectedCategory))
    );
  }, [selectedCategory, linksOnly]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="relative max-w-6xl mx-auto px-4 py-12 sm:py-16">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-sm mb-6">
            <Gift className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-slate-700">Exkluzivní bonusy & slevy</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Vyzkoušej<span className="bg-gradient-to-r from-purple-600 to-rose-600 bg-clip-text text-transparent"> & Ušetři</span>
          </h1>
        </motion.div>

        {/* Category Filter */}
        <CategoryFilter 
          selected={selectedCategory} 
          onSelect={setSelectedCategory} 
        />

        {/* MŘÍŽKA ODKAZŮ (Zobrazí se všude kromě kategorie Článek) */}
        <AnimatePresence mode="wait">
          {selectedCategory !== 'Článek' && (
            <motion.div 
              key="links"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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

        {/* SEKCE ČLÁNKŮ (Zobrazí se POUZE při vybrané kategorii Článek) */}
        <AnimatePresence mode="wait">
          {selectedCategory === 'Článek' && (
            <motion.div 
              key="articles"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3 mb-8 border-b pb-6">
                <FileText className="w-6 h-6 text-purple-600" />
                <h2 className="text-3xl font-bold text-slate-900">Návody a články</h2>
              </div>

              {articlesOnly.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {articlesOnly.map((article) => (
                    <div key={article.id} className="bg-white p-8 rounded-3xl border shadow-sm hover:shadow-md transition-all">
                      <h3 className="text-2xl font-bold mb-4">{article.title}</h3>
                      <p className="text-slate-600 mb-6 line-clamp-4">{article.description}</p>
                      <div className="flex items-center text-purple-600 font-bold">
                        Číst více <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-slate-400 italic">Zatím nejsou napsány žádné články.</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
