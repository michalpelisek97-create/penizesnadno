import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, FileText, ArrowRight, Banknote, CheckCircle2, Share2, ClipboardList, TrendingUp } from 'lucide-react';
import LinkCard from '@/components/links/LinkCard';
import CategoryFilter from '@/components/links/CategoryFilter';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notifIndex, setNotifIndex] = useState(0);
  const [isAirBankOpen, setIsAirBankOpen] = useState(false);
  
  // Logika pro Live Counter úspor
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
    if (selectedCategory === 'Článek' || selectedCategory === 'Průzkumy') return [];
    return links.filter(link => 
      link.category === selectedCategory || 
      (Array.isArray(link.categories) && link.categories.includes(selectedCategory))
    );
  }, [selectedCategory, links]);

  const isLoading = isLoadingLinks || isLoadingArticles;

  const cpxUrl = "https://offers.cpx-research.com" + 
                 "?app_id=31477" + 
                 "&ext_user_id={unique_user_id}" + 
                 "&secure_hash={secure_hash}" + 
                 "&username={user_name}" + 
                 "&email={user_email}";

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

        {/* Social Proof */}
        <div className="flex justify-center mb-12 h-10">
          <AnimatePresence mode="wait">
            <motion.div key={notifIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white border border-emerald-100 shadow-sm shadow-emerald-100/30">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm font-medium text-slate-700">
                <span className="font-bold">{notifications[notifIndex].name}</span> získal(a) bonus u <span className="text-emerald-600 font-bold">{notifications[notifIndex].app}</span>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        {/* --- PRŮZKUMY SEKCE --- */}
        <AnimatePresence mode="wait">
          {selectedCategory === 'Průzkumy' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-12 mt-8">
              <div className="p-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3 text-indigo-100 font-bold text-xs uppercase tracking-widest leading-none">
                    <TrendingUp className="w-4 h-4" /> Bonusová sekce
                  </div>
                  <h2 className="text-3xl font-black mb-3">Vydělávejte s CPX Research</h2>
                  <p className="text-indigo-100 max-w-xl">Vyplňte dotazník a získejte okamžitou odměnu. Každý názor má svou cenu!</p>
                </div>
                <ClipboardList className="absolute right-[-20px] top-[-20px] w-64 h-64 opacity-10 rotate-12" />
              </div>
              <iframe width="100%" frameBorder="0" height="1200px" src={cpxUrl} title="CPX Research" className="bg-slate-50" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- ODKAZY SEKCE --- */}
        {selectedCategory !== 'Článek' && selectedCategory !== 'Průzkumy' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 mt-8">
            {isLoading ? <Skeleton className="h-48 w-full rounded-2xl" /> : filteredLinks.map((link, index) => <LinkCard key={link.id} link={link} index={index} />)}
          </div>
        )}

        {/* --- PŮVODNÍ PANEL PENÍZE A SDÍLENÍ --- */}
        <div className="space-y-6 mt-12 mb-20">
          {/* Live Counter Savings */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="p-4 bg-emerald-50 rounded-2xl">
                <Banknote className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Celkem ušetřeno komunitou</p>
                <div className="text-4xl font-mono font-bold text-slate-900 tracking-tighter">
                  {savings.toLocaleString()} <span className="text-xl">Kč</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block h-12 w-px bg-slate-100" />
            <div className="text-slate-500 text-sm max-w-[200px] text-center md:text-left">
              Částka, kterou uživatelé již reálně vybrali z aktivních bonusů.
            </div>
          </motion.div>

          {/* Share Card */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-900 p-10 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="relative z-10 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2 tracking-tight">Pomozte ušetřit i ostatním</h3>
              <p className="text-slate-400 text-sm">Sdílejte tento web s přáteli a rodinou. Bonusy platí pro každého!</p>
            </div>
            <button onClick={handleShare} className="relative z-10 bg-white text-slate-900 px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:scale-105 transition-all shadow-xl active:scale-95 shrink-0">
              <Share2 className="w-5 h-5" /> Sdílet s přáteli
            </button>
            <div className="absolute top-[-50%] right-[-10%] w-80 h-80 bg-indigo-600/20 blur-[100px] rounded-full" />
          </motion.div>
        </div>

      </div>
    </div>
  );
}
