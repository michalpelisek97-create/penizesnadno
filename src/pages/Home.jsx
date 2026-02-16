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
  const [isAirBankOpen, setIsAirBankOpen] = useState(false);
  const [savings, setSavings] = useState(143202);

  useEffect(() => {
    const interval = setInterval(() => {
      setSavings(prev => prev + Math.floor(Math.random() * 80) + 20);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

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

  const notifications = useMemo(() => [
    { name: 'Marek P.', app: 'Air Bank' }, { name: 'Lucie K.', app: 'Honeygain' },
    { name: 'Jakub S.', app: 'Raiffeisenbank' }, { name: 'Petr M.', app: 'Revolut' },
    { name: 'Veronika T.', app: 'Aircash' }, { name: 'Honza B.', app: 'Binance' },
    { name: 'Klára V.', app: 'Tipli' }, { name: 'Martin D.', app: 'Attapoll' },
    { name: 'Jana R.', app: 'Plná Peněženka' }, { name: 'Tomáš L.', app: 'Youhodler.com' },
    { name: 'Eva S.', app: 'CT Pool' }, { name: 'Filip N.', app: 'RollerCoin' }
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNotifIndex((prev) => (prev + 1) % notifications.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [notifications.length]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-x-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:py-16">
        
        {/* Header - Zůstává stejný */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-700">Dnes aktivní bonusy pro vás</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
            Vyzkoušej<span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent"> & Ušetři</span>
          </h1>
          
          {/* Social Proof - Přestěhováno sem pro lepší flow */}
          <div className="flex justify-center h-10 mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={notifIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white border border-emerald-100 shadow-sm"
              >
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-sm font-medium text-slate-700">
                  <span className="font-bold">{notifications[notifIndex].name}</span> ušetřil(a) s <span className="text-emerald-600 font-bold">{notifications[notifIndex].app}</span>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* HLAVNÍ MŘÍŽKA - Tady řešíme tu "nudli" */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEVÝ SLOUPEC: Filtry a Odkazy (8/12 šířky) */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <div className="mb-8">
              <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
            </div>

            <AnimatePresence mode="wait">
              {selectedCategory !== 'Článek' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {isLoading ? (
                    [...Array(4)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)
                  ) : (
                    filteredLinks.map((link, index) => (
                      <LinkCard key={link.id} link={link} index={index} />
                    ))
                  )}
                </div>
              )}
            </AnimatePresence>

            {/* SEKCE ČLÁNKY (v rámci levého sloupce) */}
            <AnimatePresence mode="wait">
              {selectedCategory === 'Článek' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  <div className="flex items-center gap-3 mb-8 border-b pb-6 border-slate-200">
                    <FileText className="w-6 h-6 text-purple-600" />
                    <h2 className="text-3xl font-bold text-slate-900">Návody</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <motion.div layout className="bg-white p-8 rounded-3xl border-2 border-emerald-100 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10"><Banknote className="w-24 h-24 text-emerald-600" /></div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold mb-4">PRŮVODCE</div>
                      <h3 className="text-2xl font-bold mb-4 text-slate-900">Jak získat 500 Kč od Air Bank?</h3>
                      <p className="text-slate-600 mb-6 leading-relaxed">Air Bank aktuálně nabízí odměnu pro nové klienty. Stačí dodržet jednoduchý postup.</p>
                      <button className="flex items-center gap-2 font-bold text-emerald-600">Zjistit více <ArrowRight className="w-4 h-4"/></button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PRAVÝ SLOUPEC: Statistiky a Akce (4/12 šířky) */}
          <aside className="lg:col-span-4 space-y-6 order-1 lg:order-2 lg:sticky lg:top-8">
            
            {/* Box s úsporami */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-400 uppercase">Celkem ušetřeno</span>
              </div>
              <div className="text-4xl font-mono font-bold text-slate-900 tracking-tight">
                {savings.toLocaleString()} <span className="text-lg">Kč</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Částka, kterou komunita získala z bonusů.</p>
            </div>

            {/* Box pro sdílení */}
            <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl shadow-slate-200">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-indigo-400" /> Sdílej web
              </h3>
              <p className="text-slate-400 text-sm mb-6">Pomoz ostatním ušetřit taky! Stačí poslat odkaz dál.</p>
              <button 
                onClick={handleShare}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Zkopírovat odkaz
              </button>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}
