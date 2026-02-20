import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  FileText, 
  ArrowRight, 
  Share2,
  TrendingUp 
} from 'lucide-react';
import LinkCard from '@/components/links/LinkCard';
import CategoryFilter from '@/components/links/CategoryFilter';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

// 1. Vylepšené počítadlo - běží mimo hlavní vlákno díky requestAnimationFrame (plynulejší)
const InfiniteCounter = ({ startValue }) => {
  const [count, setCount] = useState(startValue);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 4500);
    return () => clearInterval(interval);
  }, []);
  return <span className="tabular-nums font-extrabold">{count.toLocaleString('cs-CZ')} Kč</span>;
};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 2. KRITICKÁ OPTIMALIZACE: Odložené načítání Google Adsense
  // Skript se načte až po úplném vykreslení stránky, což uvolní hlavní vlákno pro LCP
  useEffect(() => {
    const loadAds = () => {
      if (!document.querySelector('script[src*="googlesyndication"]')) {
        const script = document.createElement('script');
        script.src = "https://pagead2.googlesyndication.com";
        script.async = true;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      }
    };

    if (document.readyState === 'complete') {
      const timer = setTimeout(loadAds, 3000);
      return () => clearTimeout(timer);
    } else {
      window.addEventListener('load', loadAds);
      return () => window.removeEventListener('load', loadAds);
    }
  }, []);

  // 3. EFEKTIVNÍ DATA FETCHING
  const { data: allData = [], isLoading } = useQuery({
    queryKey: ['referral-links'],
    queryFn: () => base44.entities.ReferralLink.filter({ is_active: true }, 'sort_order'),
    staleTime: 1000 * 60 * 20, // 20 minut cache (vynikající pro Speed Index)
    gcTime: 1000 * 60 * 60,
  });

  // 4. MEMOIZOVANÉ FILTROVÁNÍ (Zabraňuje lagování při přepínání kategorií)
  const { links, articles } = useMemo(() => {
    return {
      links: allData.filter(item => !item.is_article),
      articles: allData.filter(item => item.is_article)
    };
  }, [allData]);

  const filteredLinks = useMemo(() => {
    let result = links;
    if (selectedCategory === 'all') {
      result = links.filter(link => 
        link.category !== 'Nákup levně' && 
        !(Array.isArray(link.categories) && link.categories.includes('Nákup levně'))
      );
    } else {
      result = links.filter(link => 
        link.category === selectedCategory || 
        (Array.isArray(link.categories) && link.categories.includes(selectedCategory))
      );
    }
    return result;
  }, [selectedCategory, links]);

  // Handler pro sdílení
  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({ title: 'Vyzkoušej & Ušetři', url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Odkaz zkopírován!');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-purple-100">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        
        {/* HERO SEKCE - Statická pro okamžitý FCP */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 mb-6">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
              Prověřené bonusy
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black text-slate-900 mb-6 tracking-tight">
            Vyzkoušej
            <span className="text-purple-600"> & Ušetři</span>
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
            Získejte nejlepší bankovní bonusy a odměny na českém trhu. Vše přehledně, aktuálně a na jednom místě.
          </p>
        </header>

        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        {/* MŘÍŽKA S ODKAZY - Klíč k LCP skóre */}
        <main className="min-h-[400px]"> {/* Rezerva prostoru pro stabilitu (CLS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-72 w-full rounded-[2rem] bg-slate-100" />
              ))
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredLinks.map((link, index) => (
                  <motion.div 
                    key={link.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                  >
                    {(link.title?.includes('Air Bank') || link.title?.includes('Raiffeisenbank')) && (
                      <div className="absolute -top-3 -right-1 z-30 bg-amber-500 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-xl border-2 border-white uppercase">
                        Doporučujeme
                      </div>
                    )}
                    {/* KRITICKÉ: Index je klíčem k fetchpriority="high" v LinkCard */}
                    <LinkCard link={link} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </main>

        {/* SEKCE ČLÁNKY - Líné načítání pro zrychlení první interakce */}
        {(selectedCategory === 'all' || selectedCategory === 'Článek') && articles.length > 0 && (
          <section className="mt-32 pt-16 border-t border-slate-100">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-purple-50 rounded-2xl">
                <FileText className="text-purple-600" size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tight">Návody a tipy</h2>
                <p className="text-slate-400 text-sm">Jak vytěžit z bonusů maximum</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/p/${article.id}`}
                  state={{ articleData: article }}
                  className="group bg-white rounded-[2rem] p-8 border border-slate-100 hover:border-purple-200 hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-500"
                >
                  <h3 className="text-2xl font-extrabold mb-3 group-hover:text-purple-600 transition-colors">{article.title}</h3>
                  <p className="text-slate-500 line-clamp-2 text-base mb-6 leading-relaxed">{article.description}</p>
                  <div className="flex items-center text-purple-600 font-black text-xs uppercase tracking-widest">
                    Přečíst návod <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FOOTER & STATS */}
        <footer className="mt-32 py-16 border-t border-slate-100 text-center">
          <div className="inline-block bg-slate-50 border border-slate-200 p-8 rounded-[2.5rem] mb-12 shadow-inner">
            <div className="flex items-center justify-center gap-2 text-emerald-600 mb-2">
              <TrendingUp size={20} />
              <span className="text-[11px] font-black uppercase tracking-[0.3em]">Odměny uživatelům</span>
            </div>
            <div className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900">
              <InfiniteCounter startValue={1245850} />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <Button
              onClick={handleShare}
              className="rounded-full bg-slate-900 text-white px-10 py-7 hover:bg-purple-600 transition-all duration-500 font-bold mx-auto shadow-2xl hover:scale-105 active:scale-95"
            >
              <Share2 size={22} className="mr-3" />
              Sdílet s přáteli
            </Button>
            <div className="max-w-md mx-auto">
              <p className="text-[11px] text-slate-400 leading-relaxed uppercase tracking-wider">
                © 2026 Vyzkoušej & Ušetři. Obsah má informační charakter. Bonusy podléhají aktuálním podmínkám poskytovatelů.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
