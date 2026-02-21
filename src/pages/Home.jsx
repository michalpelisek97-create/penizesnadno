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

// Přímý import - LinkCard musí být ready dřív než data dorazí
import LinkCard from '@/components/links/LinkCard';

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
      const res = await base44.functions.invoke('getHomeLinks');
      return res.data.map(({ description, ...rest }) => ({
        ...rest,
        description: description ? description.substring(0, 120) : null,
      }));
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: [],
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
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-12 sm:py-16">
        
        {/* Header - statický, bez animace pro rychlejší LCP */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-slate-200/60 shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-slate-700">
              Dnes aktivní bonusy pro vás ({getFormattedDate()})
            </span>
          </div>
          
          {/* LCP element - inline styly pro rychlejší render */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
            Vyzkoušej
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent"> & Ušetři</span>
          </h1>
        </div>

        {/* Notifikace - lazy animace po načtení stránky */}
        <div className="flex justify-center mb-12 h-10">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white border border-emerald-100 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <p className="text-sm font-medium text-slate-700 text-center">
              <span className="font-bold">{notifications[notifIndex].name}</span> získal(a) bonus u <span className="text-emerald-700 font-bold">{notifications[notifIndex].app}</span>
            </p>
          </div>
        </div>

        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        {/* Sekce Odkazy (Bonusy) */}
          {selectedCategory !== 'Článek' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
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
                      <LinkCard link={link} priority={index < 3} />
                    </div>
                  );
                })
              )}
            </div>
          )}

        {/* Sekce Články */}
          {selectedCategory === 'Článek' && (
            <div className="space-y-8">
               <div className="flex items-center gap-3 mb-8 border-b pb-6 border-slate-200">
                <FileText className="w-6 h-6 text-purple-600" />
                <h2 className="text-3xl font-bold text-slate-900">Návody a články</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {isLoading ? (
                  [...Array(4)].map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)
                ) : (
                  articles.map((article) => (
                    <Link 
                      to={createPageUrl('ArticleDetail', { id: article.id })} 
                      key={article.id}
                      className="group bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-xs text-purple-500 font-bold uppercase tracking-wider mb-2">Příspěvek</div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors mb-2">
                          {article.title}
                        </h3>
                        <p className="text-slate-600 line-clamp-2 mb-4 text-sm">
                          {article.description || article.title}
                        </p>
                      </div>
                      <div className="flex items-center text-purple-600 font-semibold gap-1 text-sm">
                        Číst návod <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}

        {/* Footer info s počítadlem */}
        <div className="mt-20 text-center border-t pt-10 border-slate-200">
          <p className="text-slate-500 text-sm mb-2">Uživatelé s námi celkem ušetřili už přes</p>
          <div className="text-3xl font-bold text-emerald-600">
            <InfiniteCounter startValue={1250400} />
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-6 text-slate-400 hover:text-purple-600"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 mr-2" /> Sdílet s přáteli
          </Button>
        </div>
      </main>
    </div>
  );
}