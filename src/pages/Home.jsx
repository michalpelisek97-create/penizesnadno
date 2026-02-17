import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Gift, 
  FileText, 
  ArrowRight, 
  Share2, 
  TrendingUp, 
  CheckCircle2 
} from 'lucide-react';
import LinkCard from '@/components/links/LinkCard';
import CategoryFilter from '@/components/links/CategoryFilter';
import { Skeleton } from '@/components/ui/skeleton';

// 1. Pomocná komponenta pro animované počítadlo (čistý JS + Intersection Observer)
const AnimatedCounter = ({ targetValue }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const countRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const end = targetValue;
    const duration = 2500; // Čas v ms (2.5 sekundy pro plynulý efekt)
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [hasStarted, targetValue]);

  return <span ref={countRef}>{count.toLocaleString('cs-CZ')} Kč</span>;
};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notifIndex, setNotifIndex] = useState(0);

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

  // 3. Social Proof Notifikace
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

  // 4. API Data Fetching
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
        alert('Odkaz na stránku byl zkopírován!');
      }
    } catch (err) {
      console.log('Chyba při sdílení', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 sm:py-16">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-700">Dnes aktivní bonusy pro vás</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
            Vyzkoušej
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent"> & Ušetři</span>
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

        {/* Odkazy */}
        <AnimatePresence mode="wait">
          {selectedCategory !== 'Článek' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
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
            </div>
          )}
        </AnimatePresence>

        {/* Články */}
        <AnimatePresence mode="wait">
          {selectedCategory === 'Článek' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
               <div className="flex items-center gap-3 mb-8 border-b pb-6 border-slate-200">
                <FileText className="w-6 h-6 text-purple-600" />
                <h2 className="text-3xl font-bold text-slate-900">Návody a články</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {articles.map((article) => (
                  <div key={article.id} className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
                    <h3 className="text-2xl font-bold mb-4 text-slate-900 leading-tight">{article.title}</h3>
                    <p className="text-slate-600 mb-6 line-clamp-4 leading-relaxed">{article.content}</p>
                    <div className="flex items-center text-slate-900 font-bold group cursor-pointer">
                      Přečíst celý článek <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ZELENÁ PATIČKA S POČÍTADLEM A SDÍLENÍM */}
        <footer className="mt-24 pt-12 border-t border-slate-200/60">
          <div className="flex flex-col items-center text-center">
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-10 shadow-sm max-w-lg w-full mb-12"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-4">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-5xl md:text-6xl font-black text-emerald-600 mb-3 tracking-tighter">
                <AnimatedCounter targetValue={142500} />
              </div>
              <p className="text-emerald-800 text-lg font-semibold">
                Celkem ušetřeno díky naší komunitě
              </p>
              <div className="flex items-center justify-center gap-2 mt-4 text-emerald-600/70 text-xs font-bold uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4" />
                Bonusy jsou pravidelně ověřovány
              </div>
            </motion.div>

            <div className="space-y-6 max-w-sm pb-10">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Chceš pomoci i ostatním?</h3>
                <p className="text-slate-500">Sdílej tuto stránku a pomoz přátelům získat jejich první bonusy.</p>
              </div>
              
              <button 
                onClick={handleShare}
                className="group inline-flex items-center gap-3 px-10 py-4 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-slate-200 hover:shadow-emerald-100"
              >
                <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Sdílet s přáteli
              </button>

              <div className="pt-8 text-xs text-slate-400 italic">
                Poslední aktualizace systému: {new Date().toLocaleDateString('cs-CZ')}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
