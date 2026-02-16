import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, FileText, ArrowRight, Banknote, CheckCircle2, Share2, TrendingUp, ShieldCheck } from 'lucide-react';
import LinkCard from '@/components/links/LinkCard';
import CategoryFilter from '@/components/links/CategoryFilter';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notifIndex, setNotifIndex] = useState(0);
  const [isAirBankOpen, setIsAirBankOpen] = useState(false);
  const [savings, setSavings] = useState(143202);

  // Interval pro counter úspor
  useEffect(() => {
    const interval = setInterval(() => {
      setSavings(prev => prev + Math.floor(Math.random() * 80) + 20);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setNotifIndex((prev) => (prev + 1) % notifications.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [notifications.length]);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Vyzkoušej & Ušetři',
        text: 'Koukni na tyhle aktivní bonusy a ušetři taky!',
        url: window.location.href,
      });
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
      alert('Odkaz zkopírován do schránky!');
    }
  };

  const { data: links = [], isLoading: isLoadingLinks } = useQuery({
    queryKey: ['referral-links'],
    queryFn: () => base44.entities.ReferralLink.filter({ is_active: true }, 'sort_order'),
  });

  const { data: articles = [], isLoading: isLoadingArticles } = useQuery({
    queryKey: ['articles'],
    queryFn: () => base44.entities.Article.filter({ is_active: true }, '-created_at'),
  });

  const filteredLinks = useMemo(() => {
    if (selectedCategory === 'all') return links;
    if (selectedCategory === 'Článek') return [];
    return links.filter(link => 
      link.category === selectedCategory || 
      (Array.isArray(link.categories) && link.categories.includes(selectedCategory))
    );
  }, [selectedCategory, links]);

  const isLoading = isLoadingLinks || isLoadingArticles;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-white to-blue-50/40">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16">
        
        {/* --- HERO SEKCE (ROZBITÍ NUDLE) --- */}
        <header className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Aktuální bonusy 2024</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">
              Vyzkoušej
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
                & Ušetři Peníze
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-lg leading-relaxed">
              Největší česká komunita pro sdílení referral bonusů. Získejte odměny za registraci v aplikacích, které stejně budete milovat.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 bg-slate-100 px-4 py-2 rounded-full">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Ověřené odkazy
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 bg-slate-100 px-4 py-2 rounded-full">
                <TrendingUp className="w-4 h-4 text-blue-500" /> Denně aktualizováno
              </div>
            </div>
          </motion.div>

          {/* STATS PANEL (Pravá strana, která rozbíjí vertikální tok) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full lg:w-96 bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase mb-1">Živý přehled úspor</p>
                  <div className="text-4xl font-mono font-bold text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                    {savings.toLocaleString()} <span className="text-lg">Kč</span>
                  </div>
                </div>
                <div className="bg-white/10 p-3 rounded-2xl">
                  <Banknote className="w-6 h-6 text-emerald-400" />
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={notifIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4"
                  >
                    <p className="text-sm text-slate-300">
                      <span className="text-white font-bold">{notifications[notifIndex].name}</span> právě využil bonus u <span className="text-emerald-400 font-bold">{notifications[notifIndex].app}</span>
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <button 
                onClick={handleShare}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
              >
                <Share2 className="w-5 h-5" /> Sdílet s přáteli
              </button>
            </div>
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full" />
          </motion.div>
        </header>

        {/* --- FILTROVÁNÍ (STICKY) --- */}
        <div className="sticky top-6 z-50 mb-12 flex justify-center">
          <div className="bg-white/70 backdrop-blur-xl p-2 rounded-2xl shadow-xl border border-white/50">
            <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
          </div>
        </div>

        {/* --- HLAVNÍ OBSAH (BENTO GRID) --- */}
        <AnimatePresence mode="wait">
          {selectedCategory !== 'Článek' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="flex flex-col space-y-4 bg-white p-6 rounded-3xl border border-slate-100">
                    <Skeleton className="h-48 w-full rounded-2xl" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))
              ) : (
                filteredLinks.map((link, index) => {
                  const isFavorite = link.title.includes('Air Bank') || link.title.includes('Raiffeisenbank');
                  return (
                    <motion.div 
                      key={link.id} 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group"
                    >
                      <div className="relative h-full">
                        {isFavorite && (
                          <div className="absolute -top-3 -right-2 z-20 bg-gradient-to-r from-orange-500 to-rose-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-xl border-2 border-white animate-bounce uppercase tracking-tighter">
                            🔥 Hot
                          </div>
                        )}
                        <LinkCard link={link} index={index} />
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}
        </AnimatePresence>

        {/* --- SEKCE ČLÁNKY (LAYOUT 2x2) --- */}
        <AnimatePresence mode="wait">
          {selectedCategory === 'Článek' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
               <div className="flex items-center gap-4 mb-10 border-b border-slate-200 pb-8">
                <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-900">Návody</h2>
                  <p className="text-slate-500 font-medium">Jak vytěžit z aplikací maximum</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Příklad AIR BANK článku (můžeš pak mapovat z query) */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-emerald-200 transition-all group relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest">Fintech</span>
                      <span className="text-slate-400 text-xs font-medium">Čtení na 3 minuty</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-slate-900 group-hover:text-emerald-600 transition-colors">
                      Jak získat 500 Kč od Air Bank bez námahy?
                    </h3>
                    <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                      Kompletní průvodce pro nové klienty. Ukážeme vám, jak aktivovat účet během 5 minut a získat bonus.
                    </p>
                    <button className="flex items-center gap-2 font-bold text-slate-900 group-hover:gap-4 transition-all">
                      Přečíst návod <ArrowRight className="w-5 h-5 text-emerald-500" />
                    </button>
                  </div>
                  <Banknote className="absolute bottom-[-20px] right-[-20px] w-48 h-48 text-slate-50 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" />
                </motion.div>

                {/* Zde by pokračovaly další články... */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
