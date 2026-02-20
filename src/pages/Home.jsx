import React, { useState, useMemo, useEffect } from 'react';
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

// Optimalizované počítadlo
const InfiniteCounter = ({ startValue }) => {
  const [count, setCount] = useState(startValue);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return <span className="tabular-nums font-bold">{count.toLocaleString('cs-CZ')} Kč</span>;
};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // OPTIMALIZACE: Odložené načítání Google Ads (v index.html smazáno, tady se načte po startu)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!document.querySelector('script[src*="googlesyndication"]')) {
        const script = document.createElement('script');
        script.src = "https://pagead2.googlesyndication.com";
        script.async = true;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      }
    }, 2500); // Zpoždění 2.5s pro maximální rychlost startu webu

    return () => clearTimeout(timer);
  }, []);

  // Data Fetching s delší cache pro stabilitu
  const { data: allData = [], isLoading } = useQuery({
    queryKey: ['referral-links'],
    queryFn: () => base44.entities.ReferralLink.filter({ is_active: true }, 'sort_order'),
    staleTime: 1000 * 60 * 15, 
  });

  const links = useMemo(() => allData.filter(item => !item.is_article), [allData]);
  const articles = useMemo(() => allData.filter(item => item.is_article), [allData]);

  const filteredLinks = useMemo(() => {
    if (selectedCategory === 'all') {
      return links.filter(link => link.category !== 'Nákup levně' && !(Array.isArray(link.categories) && link.categories.includes('Nákup levně')));
    }
    return links.filter(link => link.category === selectedCategory || (Array.isArray(link.categories) && link.categories.includes(selectedCategory)));
  }, [selectedCategory, links]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        
        {/* HEADER */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 mb-4">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Bonusy pro vás
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-4 tracking-tight">
            Vyzkoušej
            <span className="text-purple-600"> & Ušetři</span>
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto text-sm sm:text-base">
            Získejte nejlepší bankovní bonusy a odměny na českém trhu přehledně na jednom místě.
          </p>
        </header>

        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        {/* Sekce BONUSY - Zde je oprava pro LCP */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {isLoading ? (
            [...Array(6)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-3xl" />)
          ) : (
            filteredLinks.map((link, index) => (
              <div key={link.id} className="relative">
                {(link.title.includes('Air Bank') || link.title.includes('Raiffeisenbank')) && (
                  <div className="absolute -top-2 -right-2 z-20 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md">🔥 TOP</div>
                )}
                {/* KLÍČOVÁ OPRAVA: Předáváme 'index', aby LinkCard mohl prioritizovat první obrázek */}
                <LinkCard link={link} index={index} />
              </div>
            ))
          )}
        </main>

        {/* Sekce ČLÁNKY */}
        {(selectedCategory === 'all' || selectedCategory === 'Článek') && articles.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center gap-3 mb-8 border-b pb-4">
              <FileText className="text-purple-600" size={28} />
              <h2 className="text-3xl font-bold">Návody a tipy</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/p/${article.id}`}
                  state={{ articleData: article }}
                  className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all"
                >
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600">{article.title}</h3>
                  <p className="text-slate-500 line-clamp-2 text-sm mb-4">{article.description}</p>
                  <div className="flex items-center text-purple-600 font-bold text-xs">
                    ČÍST VÍCE <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FINANCE a FOOTER */}
        <footer className="mt-24 py-12 border-t text-center">
          <div className="inline-block bg-slate-50 border border-slate-200 p-6 rounded-3xl mb-8">
            <div className="flex items-center justify-center gap-2 text-emerald-600 mb-1">
              <TrendingUp size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Celkem vyplaceno</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black">
              <InfiniteCounter startValue={1245850} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'Vyzkoušej & Ušetři', url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Odkaz zkopírován!');
                }
              }}
              className="rounded-full bg-slate-900 text-white px-8 py-6 hover:bg-slate-800 transition-all font-bold mx-auto"
            >
              <Share2 size={20} className="mr-2" />
              Sdílet s přáteli
            </Button>
            <p className="text-[10px] text-slate-400">© 2026 Vyzkoušej & Ušetři. Všechny bonusy podléhají podmínkám bank.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
