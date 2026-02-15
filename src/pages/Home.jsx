import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Sparkles, Gift, FileText, ArrowRight } from 'lucide-react';
import LinkCard from '@/components/links/LinkCard';
import CategoryFilter from '@/components/links/CategoryFilter';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Načítáme vše z jedné entity ReferralLink
  const { data: allData = [], isLoading } = useQuery({
    queryKey: ['referral-links'],
    queryFn: () => base44.entities.ReferralLink.filter({ is_active: true }, 'sort_order'),
  });

  // ROZDĚLENÍ DAT: Odkazy vs Články
  const allLinks = allData.filter(item => item.category !== 'Článek');
  const articles = allData.filter(item => item.category === 'Článek');

  // Filtrování odkazů podle vybrané kategorie
  const filteredLinks = selectedCategory === 'all' 
    ? allLinks 
    : allLinks.filter(link => link.categories?.includes(selectedCategory) || link.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-sm mb-6">
            <Gift className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-slate-700">Exkluzivní bonusy & slevy</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
            Vyzkoušej<span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent"> & Ušetři</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Speciální výběr aplikací s aktivním bonusem do začátku.
          </p>
        </motion.div>

        {/* Category Filter */}
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        {/* Links Grid */}
        <div className="mb-20">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm p-5 space-y-3">
                  <Skeleton className="h-40 w-full rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
              ))}
            </div>
          ) : filteredLinks.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLinks.map((link, index) => (
                <LinkCard key={link.id} link={link} index={index} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-10 text-slate-500">Žádné odkazy nenalezeny.</div>
          )}
        </div>

        {/* SEKCE ČLÁNKY (Nyní bere data z ReferralLink) */}
        {(selectedCategory === 'all' || selectedCategory === 'Článek') && articles.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex items-center gap-3 mb-6 border-t pt-12">
                <div className="p-2 rounded-lg bg-slate-900 text-white">
                    <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Nejnovější články a návody</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <motion.div 
                  key={article.id}
                  whileHover={{ y: -5 }}
                  className="group bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold uppercase">
                      Návod
                    </span>
                    <span className="text-xs text-slate-400">
                        {new Date(article.created_at).toLocaleDateString('cs-CZ')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {article.description} {/* Text článku je v poli description */}
                  </p>
                  <div className="flex items-center text-sm font-bold text-slate-900 group-hover:gap-2 transition-all">
                    Číst více <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center mt-16 pt-8 border-t border-slate-200/60">
          <p className="text-sm text-slate-500">
            Tyto odkazy jsou affiliate/referenční. Při registraci přes ně získáváš bonus a já malou provizi.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
