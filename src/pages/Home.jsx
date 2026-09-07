import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  FileText,
  ArrowRight,
  Share2 } from
'lucide-react';
import CategoryFilter from '@/components/links/CategoryFilter';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

import LinkCard from '@/components/links/LinkCard';
import WheelCard from '@/components/wheel/WheelCard';
import HeroWheel from '@/components/hero/HeroWheel';
import { generateSchemaData } from '@/components/utils/seoHelper';

import AdBanner from '@/components/ads/AdBanner';
import RollerCoinCalculator from '@/components/calculator/RollerCoinCalculator';
import VisitorCounter from '@/components/visitors/VisitorCounter';
// Lazy import těžkých komponent
const WheelOfFortune = React.lazy(() => import('@/components/wheel/WheelOfFortune'));

// 1. Komponenta pro NEKONEČNĚ STOUPAJÍCÍ počítadlo
const InfiniteCounter = ({ startValue }) => {
  const [count, setCount] = useState(startValue);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.5 });

    const el = document.querySelector('[data-counter]');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 5) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <span className="tabular-nums" data-counter>
      {count.toLocaleString('cs-CZ')} Kč
    </span>);

};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notifIndex, setNotifIndex] = useState(0);
  const [displayCount, setDisplayCount] = useState(999);

  // Funkce pro získání dnešního data
  const getFormattedDate = () => {
    return new Date().toLocaleDateString('cs-CZ', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  };

  // AdSense je již v index.html, není potřeba přidávat znovu

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
  { name: 'Filip N.', app: 'RollerCoin' }],
  []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const timer = setInterval(() => {
        setNotifIndex((prev) => (prev + 1) % notifications.length);
      }, 5000);
      return () => clearInterval(timer);
    }, { threshold: 0.3 });

    const el = document.querySelector('[data-notif]');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [notifications.length]);

  // 4. API Data Fetching - Ultra-light inicializace (jen 12 záznamů)
  const { data: allData = [], isLoading } = useQuery({
    queryKey: ['referral-links'],
    queryFn: async () => {
      const data = await base44.entities.ReferralLink.filter({ is_active: true }, 'sort_order', 50);
      return data.map(({ content, ...rest }) => rest);
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 3 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  // Filtruj a připrav data
   const links = useMemo(() => allData.filter((item) => !item.is_article), [allData]);
   const articles = useMemo(() => allData.filter((item) => item.is_article), [allData]);

  // FILTRACE: Logika pro zobrazení bonusů
  const filteredLinks = useMemo(() => {
    let filtered;
    if (selectedCategory === 'all') {
      filtered = links.filter((link) =>
      link.category !== 'Nákup levně' &&
      !(Array.isArray(link.categories) && link.categories.includes('Nákup levně'))
      );
    } else if (selectedCategory === 'Článek') {
      return [];
    } else {
      filtered = links.filter((link) =>
      link.category === selectedCategory ||
      Array.isArray(link.categories) && link.categories.includes(selectedCategory)
      );
    }
    return filtered.slice(0, displayCount);
  }, [selectedCategory, links, displayCount]);

  // Nastavit Schema.org data pro domovskou stránku
  useEffect(() => {
    if (filteredLinks.length > 0) {
      const schemaEl = document.querySelector('script[type="application/ld+json"][data-collection="true"]');
      if (schemaEl) schemaEl.remove();

      const newSchema = document.createElement('script');
      newSchema.type = 'application/ld+json';
      newSchema.setAttribute('data-collection', 'true');
      newSchema.textContent = JSON.stringify(generateSchemaData('collectionPage', {
        title: 'Nejlepší bonusy a cashback v Česku',
        description: 'Kompletní sbírka dostupných bonusů a cashbacku',
        items: filteredLinks.slice(0, 10).map((link) => ({
          title: link.title,
          description: link.description,
          image_url: link.image_url,
          url: link.url
        }))
      }));
      document.head.appendChild(newSchema);
    }
  }, [filteredLinks]);



  // 5. Marketingové sdílení
  const handleShare = async () => {
    const shareData = {
      title: 'Vyzkoušej & Ušetři',
      text: 'Koukni na tyhle super bonusy a odměny, které můžeš snadno získat!',
      url: window.location.href
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden text-white">
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-12 sm:py-16">
        
        {/* Header - statický, bez animace pro rychlejší LCP */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/50 shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-sm font-medium text-amber-100">
              Dnes aktivní bonusy pro vás ({getFormattedDate()})
            </span>
          </div>
          
          {/* LCP element - inline styly pro rychlejší render */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Vyzkoušej
            <span className="bg-gradient-to-r from-amber-300 via-pink-300 to-rose-300 bg-clip-text text-transparent"> & Ušetři</span>
          </h1>
        </div>

        {/* Notifikace - lazy animace po načtení stránky */}
        <div className="flex justify-center mb-12 h-10" data-notif>
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/50 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-sm font-medium text-emerald-100 text-center">
              <span className="font-bold text-white">{notifications[notifIndex].name}</span> získal(a) bonus u <span className="text-emerald-300 font-bold">{notifications[notifIndex].app}</span>
            </p>
          </div>
        </div>

        <HeroWheel onWheelClick={() => setSelectedCategory('wheel')} />

        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        {/* Reklama */}
        <AdBanner />

        {/* Sekce Spočítat si výdělky */}
        {selectedCategory === 'Nákup levně' && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6 border-b pb-4 border-purple-500/30">
              <span className="text-2xl">💰</span>
              <h2 className="text-2xl font-bold text-white">RollerCoin Profit Calculator</h2>
            </div>
            <RollerCoinCalculator />
          </div>
        )}

        {/* Sekce Kolo Štěstí */}
         {selectedCategory === 'wheel' &&
         <React.Suspense fallback={<div className="h-64 flex items-center justify-center text-white">Načítám...</div>}>
             <div data-wheel-section>
               <WheelOfFortune />
             </div>
           </React.Suspense>
         }

        {/* Sekce Odkazy (Bonusy) */}
          {selectedCategory !== 'Článek' && selectedCategory !== 'wheel' &&
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20" style={{ contain: 'layout style paint' }}>
              {isLoading && filteredLinks.length === 0 ?
          [...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />) :

          filteredLinks.length > 0 ? filteredLinks.map((link, index) => {
            const isFavorite = link.title.includes('Air Bank') || link.title.includes('Raiffeisenbank');
            const isAirBank = link.title.includes('Air Bank');
            return (
              <React.Fragment key={link.id}>
                      <div className="relative">
                        {isFavorite &&
                  <div className="bg-gradient-to-r text-[10px] mx-2 my-5 py-2 font-bold rounded-full absolute -top-3 -right-2 z-20 from-amber-500 to-orange-600 shadow-lg border-2 border-white animate-bounce">
                            🔥 NEJOBLÍBENĚJŠÍ
                          </div>
                  }
                        <LinkCard link={link} priority={index === 0} loading={index < 2 ? "eager" : "lazy"} />
                      </div>
                      {isAirBank && <WheelCard />}
                    </React.Fragment>);

          }) : <div className="col-span-full text-center text-slate-400">Žádné bonusy v kategorii</div>
            }
            </div>
        }

        {/* Sekce Články */}
          {(selectedCategory === 'Článek' || selectedCategory === 'all') &&
        <div className="space-y-8">
               <div className="flex items-center gap-3 mb-8 border-b pb-6 border-emerald-600/30">
                <FileText className="w-6 h-6 text-emerald-300" />
                <h2 className="text-3xl font-bold text-white">Návody a články</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ?
            [...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />) :

            articles.map((article) =>
            <Link
              to={`/ArticleDetail?id=${article.id}`}
              key={article.id}
              className="group bg-gradient-to-br from-emerald-900/40 to-teal-900/40 p-4 sm:p-5 rounded-xl border border-emerald-500/40 hover:border-emerald-400/60 hover:shadow-xl transition-all duration-300 flex flex-col">

                      <div className="flex-1">
                        <div className="text-xs text-emerald-300 font-bold uppercase tracking-wider mb-2">Příspěvek</div>
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-200 transition-colors mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                      </div>
                      <div className="flex items-center text-emerald-300 font-semibold gap-1 text-xs sm:text-sm group-hover:text-emerald-200 transition-colors mt-3">
                        Číst <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
            )
            }
              </div>
            </div>
        }

        {/* Footer info s počítadlem - Jackpot style */}
        <div className="mt-20 relative">
          <style>{`
            @keyframes jackpot-glow {
              0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.4), 0 0 40px rgba(34, 197, 94, 0.2); }
              50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.8), 0 0 80px rgba(34, 197, 94, 0.5), inset 0 0 20px rgba(16, 185, 129, 0.2); }
            }
            @keyframes number-pulse {
              0%, 100% { text-shadow: 0 0 10px rgba(16, 185, 129, 0.5), 0 0 20px rgba(34, 197, 94, 0.3); }
              50% { text-shadow: 0 0 30px rgba(16, 185, 129, 1), 0 0 60px rgba(34, 197, 94, 0.8), 0 0 100px rgba(34, 197, 94, 0.4); }
            }
            @keyframes jackpot-shine {
              0% { left: -100%; }
              100% { left: 100%; }
            }
            .jackpot-container {
              animation: jackpot-glow 2s ease-in-out infinite;
            }
            .jackpot-number {
              animation: number-pulse 1.5s ease-in-out infinite;
            }
            .jackpot-shine {
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
              animation: jackpot-shine 2.5s ease-in-out infinite;
              border-radius: 1rem;
            }
          `}</style>
          
          <div className="jackpot-container bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 border-4 border-yellow-300 rounded-2xl p-8 text-center relative overflow-hidden backdrop-blur-sm">
            <div className="jackpot-shine" />
            
            <p className="text-sm font-bold text-yellow-100 mb-3 tracking-widest uppercase">Uživatelé s námi už ušetřili</p>
            
            <div className="jackpot-number text-7xl font-black text-white mb-6 drop-shadow-2xl">
              <InfiniteCounter startValue={142255} />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="bg-yellow-300 text-yellow-900 border-yellow-200 hover:bg-yellow-200 font-bold shadow-lg"
              onClick={handleShare}>

              <Share2 className="w-4 h-4 mr-2" /> Sdílet s přáteli
            </Button>
          </div>
          {/* Počítadlo návštěvnosti */}
          <div className="mt-16">
            <VisitorCounter />
          </div>
        </div>
      </main>
    </div>);

}