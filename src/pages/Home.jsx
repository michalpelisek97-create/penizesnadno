import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, FileText, ArrowRight, Banknote, CheckCircle2, Share2, TrendingUp } from 'lucide-react';
import LinkCard from '@/components/links/LinkCard';
import CategoryFilter from '@/components/links/CategoryFilter';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notifIndex, setNotifIndex] = useState(0);
  const [savings, setSavings] = useState(143202);

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
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Header - Tvůj původní styl */}
        <header className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-600">Dnes aktivní bonusy pro vás</span>
          </motion.div>
          <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
            Vyzkoušej<span className="bg-gradient-to-r from-purple-600 to-rose-600 bg-clip-text text-transparent"> & Ušetři</span>
          </h1>
        </header>

        {/* HLAVNÍ LAYOUT: 2 SLOPCE (Obsah | Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEVÝ SLOUPEC (Filtry a Karty) */}
          <div className="lg:col-span-8">
            <div className="mb-8">
              <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
            </div>

            <AnimatePresence mode="wait">
              {selectedCategory !== 'Článek' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isLoading ? (
                    [...Array(4)].map((_, i) => <Skeleton key={i} className="h-64 rounded-3xl" />)
                  ) : (
                    filteredLinks.map((link, index) => (
                      <LinkCard key={link.id} link={link} index={index} />
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Tady tvůj kód pro články */}
                  <h2 className="text-2xl font-bold mb-4">Návody a články</h2>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200">Jak získat 500 Kč od Air Bank...</div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* PRAVÝ SLOUPEC (Tvůj fixní panel s financemi a sdílením) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Live Counter Box */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Ušetřeno komunitou</span>
              </div>
              <div className="text-4xl font-mono font-bold text-slate-900 mb-2">
                {savings.toLocaleString()} <span className="text-xl">Kč</span>
              </div>
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: '70%' }} 
                  className="h-full bg-emerald-500" 
                />
              </div>
            </div>

            {/* Social Proof Box */}
            <div className="bg-slate-900 p-6 rounded-[2rem] text-white overflow-hidden relative">
              <div className="relative z-10">
                <p className="text-slate-400 text-xs font-bold mb-4 uppercase tracking-widest">Aktuálně čerpají</p>
                <div className="h-12">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={notifIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="text-sm"
                    >
                      <span className="font-bold text-emerald-400">{notifications[notifIndex].name}</span> získal bonus u <span className="underline">{notifications[notifIndex].app}</span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Banknote className="w-16 h-16" />
              </div>
            </div>

            {/* Share Box */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[2rem] text-white shadow-lg shadow-indigo-200">
              <h3 className="text-xl font-bold mb-2">Líbí se ti web?</h3>
              <p className="text-indigo-100 text-sm mb-6">Sdílej ho s kámošema a pomoz jim taky ušetřit pár stovek.</p>
              <button 
                onClick={handleShare}
                className="w-full bg-white text-indigo-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors"
              >
                <Share2 className="w-5 h-5" /> Sdílet odkaz
              </button>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
