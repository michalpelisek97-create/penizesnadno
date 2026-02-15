import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, FileText, ArrowRight, ClipboardList } from 'lucide-react';
import LinkCard from '@/components/links/LinkCard';
import CategoryFilter from '@/components/links/CategoryFilter';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notifIndex, setNotifIndex] = useState(0);
  
  // Vaše ID pro CPX Research
  const PROJECT_ID = 31456;

  // --- OVĚŘENÍ GOOGLE ADSENSE (META TAG + SCRIPT) ---
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = "google-adsense-account";
    meta.content = "ca-pub-3492240221253160";
    document.head.appendChild(meta);

    const script = document.createElement('script');
    script.src = "https://pagead2.googlesyndication.com";
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(meta)) document.head.removeChild(meta);
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  // Seznam oznámení pro social proof
  const notifications = useMemo(() => [
    { name: 'Marek P.', app: 'Air Bank' },
    { name: 'Lucie K.', app: 'Honeygain' },
    { name: 'Jakub S.', app: 'Raiffeisenbank' },
    { name: 'Petr M.', app: 'Revolut' },
    { name: 'Veronika T.', app: 'Aircash' },
    { name: 'Honza B.', app: 'Binance' },
    { name: 'Klára V.', app: 'Tipli' },
    { name: 'Martin D.', app: 'Attapoll' },
    { name: 'Jana R.', app: 'Plná Peněženka' },
    { name: 'Tomáš L.', app: 'Youhodler.com' },
    { name: 'Eva S.', app: 'CT Pool' },
    { name: 'Filip N.', app: 'RollerCoin' }
  ], []);

  // Interval pro animaci oznámení
  useEffect(() => {
    const timer = setInterval(() => {
      setNotifIndex((prev) => (prev + 1) % notifications.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [notifications.length]);

  const { data: allData = [], isLoading } = useQuery({
    queryKey: ['referral-links'],
    queryFn: () => base44.entities.ReferralLink.filter({ is_active: true }, 'sort_order'),
  });

  const { data: articles = [] } = useQuery({
    queryKey: ['articles'],
    queryFn: () => base44.entities.Article.filter({ is_active: true }, '-created_at'),
  });

  // Filtrace dat: Odkazy (vyloučení kategorie Článek)
  const linksOnly = useMemo(() => allData.filter(item => item.category !== 'Článek'), [allData]);

  // Dynamická filtrace podle vybrané kategorie
  const filteredLinks = useMemo(() => {
    if (selectedCategory === 'all') return linksOnly;
    if (selectedCategory === 'Článek' || selectedCategory === 'průzkumy') return [];
    return linksOnly.filter(link => 
      link.category === selectedCategory || 
      (Array.isArray(link.categories) && link.categories.includes(selectedCategory))
    );
  }, [selectedCategory, linksOnly]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 sm:py-16">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-700">Dnes aktivní bonusy pro vás</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
            Vyzkoušej<span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent"> & Ušetři</span>
          </h1>
        </motion.div>

        {/* Social Proof Bar */}
        <div className="flex justify-center mb-12 h-10">
          <AnimatePresence mode="wait">
            <motion.div key={notifIndex} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white border border-emerald-100 shadow-sm shadow-emerald-100/30"
            >
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm font-medium text-slate-700 text-center">
                <span className="font-bold">{notifications[notifIndex].name}</span> získal(a) bonus u <span className="text-emerald-600 font-bold">{notifications[notifIndex].app}</span>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        {/* SEKCE ODKAZY - MŘÍŽKA */}
        <AnimatePresence mode="wait">
          {selectedCategory !== 'Článek' && selectedCategory !== 'průzkumy' && (
            <motion.div key="links-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {isLoading ? (
                [...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)
              ) : filteredLinks.map((link, index) => {
                const isFavorite = link.title.includes('Air Bank') || link.title.includes('Raiffeisenbank');
                return (
                  <div key={link.id} className="relative">
                    {isFavorite && (
                      <div className="absolute -top-3 -right-2 z-20 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white animate-bounce">
                        🔥 NEJOBLÍBENĚJŠÍ
                      </div>
                    )}
                    <LinkCard link={link} index={index} />
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* SEKCE PRŮZKUMY (CPX Research Integration) */}
        <AnimatePresence mode="wait">
          {selectedCategory === 'průzkumy' && (
            <motion.div key="surveys-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8 mb-20">
              <div className="flex items-center gap-3 mb-8 border-b pb-6 border-slate-200">
                <div className="p-2 rounded-lg bg-emerald-600 text-white shadow-lg"><ClipboardList className="w-5 h-5" /></div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Placené průzkumy</h2>
                  <p className="text-slate-500 text-sm font-medium tracking-tight">Získejte odměnu za svůj názor.</p>
                </div>
              </div>
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden min-h-[800px]">
                <iframe 
                  src={`https://offers.cpx-research.com{PROJECT_ID}`}
                  style={{ width: '100%', height: '800px', border: 'none' }}
                  title="CPX Research Surveys"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SEKCE ČLÁNKY - VÝPIS */}
        <AnimatePresence mode="wait">
          {selectedCategory === 'Článek' && (
            <motion.div key="articles-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
               <div className="flex items-center gap-3 mb-8 border-b pb-6 border-slate-200">
                <FileText className="w-6 h-6 text-purple-600" />
                <h2 className="text-3xl font-bold text-slate-900">Návody a články</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {articles.map((article) => (
                  <div key={article.id} className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-xl transition-shadow group">
                    <h3 className="text-xl font-bold mb-4 group-hover:text-purple-600 transition-colors">{article.title}</h3>
                    <p className="text-slate-600 mb-6 line-clamp-3">{article.content}</p>
                    <button className="flex items-center gap-2 text-purple-600 font-bold">
                      Číst více <ArrowRight className="w-4 h-4" />
                    </button>
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
