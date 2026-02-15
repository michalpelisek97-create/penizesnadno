import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ArrowRight } from 'lucide-react';
import LinkCard from '@/components/links/LinkCard';
import CategoryFilter from '@/components/links/CategoryFilter';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Načítáme Odkazy
  const { data: links = [] } = useQuery({
    queryKey: ['referral-links'],
    queryFn: () => base44.entities.ReferralLink.filter({ is_active: true }, 'sort_order'),
  });

  // Načítáme Články (z nové entity!)
  const { data: articles = [] } = useQuery({
    queryKey: ['articles'],
    queryFn: () => base44.entities.Article.filter({ is_active: true }, '-created_at'),
  });

  // Filtrace odkazů (klasicky podle kategorie)
  const filteredLinks = selectedCategory === 'all' 
    ? links 
    : links.filter(link => link.category === selectedCategory || link.categories?.includes(selectedCategory));

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        {/* SEKCE ODKAZY */}
        <AnimatePresence mode="wait">
          {selectedCategory !== 'Článek' && (
            <motion.div key="links" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredLinks.map((link, index) => <LinkCard key={link.id} link={link} index={index} />)}
            </motion.div>
          )}
        </AnimatePresence>

        {/* SEKCE ČLÁNKY (Zobrazí se pouze na záložce Článek) */}
        <AnimatePresence mode="wait">
          {selectedCategory === 'Článek' && (
            <motion.div key="articles" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <h2 className="text-3xl font-bold flex items-center gap-2"><FileText /> Články a návody</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map(art => (
                  <div key={art.id} className="bg-white p-6 rounded-2xl border shadow-sm group">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-purple-600 transition-colors">{art.title}</h3>
                    <p className="text-slate-600 line-clamp-3 mb-4">{art.content}</p>
                    <div className="font-bold flex items-center gap-1">Číst více <ArrowRight size={16} /></div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
