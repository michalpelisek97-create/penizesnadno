import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, FileText, ArrowRight, Share2 } from 'lucide-react';
import LinkCard from '@/components/links/LinkCard';
import CategoryFilter from '@/components/links/CategoryFilter';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

// 1. Komponenta pro NEKONEČNĚ STOUPAJÍCÍ počítadlo
const InfiniteCounter = ({ startValue }) => {
  const [count, setCount] = useState(startValue);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="tabular-nums">
      {count.toLocaleString('cs-CZ')} Kč
    </span>
  );
};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notifIndex, setNotifIndex] = useState(0);

  // Funkce pro získání dnešního data
  const getFormattedDate = () => {
    return new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' });
  };

  // 2. Google AdSense Verifikace
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

  // 3. Social Proof Oznámení
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

  // 4. API Data Fetching - Vše taháme z ReferralLink kvůli limitům
  const { data: allData = [], isLoading } = useQuery({
    queryKey: ['referral-links'],
    queryFn: () => base44.entities.ReferralLink.filter({ is_active: true }, 'sort_order'),
  });

  // Rozdělení dat na bonusy a články na základě příznaku is_article
  const links = useMemo(() => allData.filter(item => !item.is_article), [allData]);
  const articles = useMemo(() => allData.filter(item => item.is_article), [allData]);

  // FILTRACE: Logika pro zobrazení bonusů
  const filteredLinks = useMemo(() => {
    if (selectedCategory === 'all') {
      return links.filter(link => 
        link.category !== 'Nákup levně' && 
        !(Array.isArray(link.categories) && link.categories.includes('Nákup levně'))
      );
    }
    if (selectedCategory === 'Článek') return [];
    return links.filter(link => 
      link.category === selectedCategory || 
      (Array.isArray(link.categories) && link.categories.includes(selectedCategory))
    );
  }, [selectedCategory, links]);

  // 5. Marketingové sdílení
  const handleShare = async () => {
    const shareData = {
      title: 'Vyzkoušej & Ušetři',
      text: 'Koukni na tyhle super bonusy a odměny, které můžeš snadno získat!',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Odkaz byl zkopírován do schránky!');
      }
    } catch (err) {
      console.log('Chyba při sdílení', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden text-slate-900">
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 sm:py-16">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-700">
              Dnes aktivní bonusy pro vás ({getFormattedDate()})
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
            Vyzkoušej <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent"> & Ušetři</span>
          </h1>
        </motion.div>

        {/* Notifikace */}
        <div className="flex justify-center mb-12 h-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={notifIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
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

        {/* Sekce Odkazy (Bonusy) */}
        <AnimatePresence mode="wait">
          {selectedCategory !== 'Článek' && (
            <motion.div
              key="links-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
            >
              {isLoading ? (
                [...Array(6)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)
              ) : (
                filteredLinks.map((link, index) => {
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
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zde by pokračovala Sekce Články... */}
      </div>
    </div>
  );
}
