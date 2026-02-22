import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  FileText, 
  ArrowRight, 
  Share2 
} from 'lucide-react';
import CategoryFilter from '@/components/links/CategoryFilter';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

import LinkCard from '@/components/links/LinkCard';
import WheelCard from '@/components/wheel/WheelCard';
import AdBanner from '@/components/ads/AdBanner';
import LoginSection from '@/components/auth/LoginSection';
import { generateSchemaData } from '@/components/utils/seoHelper';

// Lazy import těžkých komponent
const WheelOfFortune = React.lazy(() => import('@/components/wheel/WheelOfFortune'));

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
  const [displayCount, setDisplayCount] = useState(6);

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
    queryFn: async () => {
      const data = await base44.entities.ReferralLink.filter({ is_active: true }, 'sort_order', 500);
      return data.map(({ description, content, ...rest }) => {
        // Pro články nenosíme content (je obrovský), jen metadata
        return {
          ...rest,
          description: description ? description.substring(0, 120) : null,
          // content vůbec nepotřebujeme na homepage
        };
      });
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: [],
  });

  // Rozdělení dat na bonusy a články na základě příznaku is_article
  const links = useMemo(() => allData.filter(item => !item.is_article), [allData]);
  const articles = useMemo(() => allData.filter(item => item.is_article), [allData]);

  // FILTRACE: Logika pro zobrazení bonusů
  const filteredLinks = useMemo(() => {
    let filtered;
    if (selectedCategory === 'all') {
      filtered = links.filter(link => 
        link.category !== 'Nákup levně' && 
        !(Array.isArray(link.categories) && link.categories.includes('Nákup levně'))
      );
    } else if (selectedCategory === 'Článek') {
      return [];
    } else {
      filtered = links.filter(link => 
        link.category === selectedCategory || 
        (Array.isArray(link.categories) && link.categories.includes(selectedCategory))
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
        items: filteredLinks.slice(0, 10).map(link => ({
          title: link.title,
          description: link.description,
          image_url: link.image_url,
          url: link.url
        }))
      }));
      document.head.appendChild(newSchema);
    }
  }, [filteredLinks]);

  useEffect(() => {
    const handleScroll = () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
        setDisplayCount(prev => prev + 6);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        <div className="flex justify-center mb-12 h-10">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/50 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-sm font-medium text-emerald-100 text-center">
              <span className="font-bold text-white">{notifications[notifIndex].name}</span> získal(a) bonus u <span className="text-emerald-300 font-bold">{notifications[notifIndex].app}</span>
            </p>
          </div>
        </div>

        <LoginSection />

        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        {/* Reklama */}
        <AdBanner />

        {/* Sekce Kolo Štěstí */}
        {selectedCategory === 'wheel' && (
          <React.Suspense fallback={<div className="h-64 flex items-center justify-center text-white">Načítám...</div>}>
            <WheelOfFortune />
          </React.Suspense>
        )}

        {/* Sekce Odkazy (Bonusy) */}
          {selectedCategory !== 'Článek' && selectedCategory !== 'wheel' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {isLoading ? (
                [...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)
              ) : (
                filteredLinks.map((link, index) => {
                   const displayIndex = index < 3 ? index : index + 1;
                   const isFavorite = link.title.includes('Air Bank') || link.title.includes('Raiffeisenbank');
                   return (
                     <React.Fragment key={link.id}>
                       {displayIndex === 3 && <WheelCard />}
                       <div className="relative">
                         {isFavorite && (
                           <div className="absolute -top-3 -right-2 z-20 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white animate-bounce">
                             🔥 NEJOBLÍBENĚJŠÍ
                           </div>
                         )}
                         <LinkCard link={link} priority={index === 0} loading={index < 2 ? "eager" : "lazy"} />
                       </div>
                     </React.Fragment>
                   );
                 })
              )}
            </div>
          )}

        {/* Sekce Články */}
          {(selectedCategory === 'Článek' || selectedCategory === 'all') && (
            <div className="space-y-8">
               <div className="flex items-center gap-3 mb-8 border-b pb-6 border-emerald-600/30">
                <FileText className="w-6 h-6 text-emerald-300" />
                <h2 className="text-3xl font-bold text-white">Návody a články</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  [...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)
                ) : (
                  articles.slice(0, displayCount).map(article => (
                    <Link
                      key={article.id}
                      to={createPageUrl(`ArticleDetail?id=${article.id}`)}
                      className="group relative bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/40 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      {article.image_url && (
                        <div className="relative h-32 overflow-hidden bg-gradient-to-br from-purple-900 to-indigo-900">
                          <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="p-5 flex flex-col h-full">
                        <p className="text-sm text-emerald-300 font-semibold mb-2">📖 Návod / Článek</p>
                        <p className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-amber-300 transition-colors">{article.title}</p>
                        <p className="text-sm text-slate-400 line-clamp-2 flex-grow">{article.description}</p>
                        <div className="flex items-center gap-2 text-amber-400 mt-4 group-hover:gap-3 transition-all">
                          <span className="text-sm font-semibold">Přečíst</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}

        {/* FOOTER - Ceník */}
        <div className="relative mt-32 mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { emoji: '🎁', text: 'Bezplatné', desc: 'Bez poplatků' },
              { emoji: '🔒', text: 'Bezpečné', desc: 'Ověřené partnery' },
              { emoji: '⚡', text: 'Rychlé', desc: 'Ihned k dispozici' },
              { emoji: '📱', text: 'Mobilní', desc: 'Kdykoliv a kdekoli' }
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20">
                <div className="text-4xl mb-3">{feature.emoji}</div>
                <p className="font-bold text-white mb-1">{feature.text}</p>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom Banner - Sdílení */}
          <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 border border-purple-500/40 rounded-2xl p-8 text-center shadow-lg">
            <h3 className="text-2xl font-bold text-white mb-4">💰 Už jsi vydělal <InfiniteCounter startValue={2450} /> Kč?</h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">Sdílej tuto stránku se svými přáteli a vy si budete moct vydělávat spolu!</p>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-full shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Share2 className="w-5 h-5" />
              Sdílet s přáteli
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}