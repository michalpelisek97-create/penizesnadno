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

// Plynulé počítadlo
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

  // Načtení Adsense s odstupem
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
    const timer = setTimeout(loadAds, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Načtení dat z databáze
  const { data: allData = [], isLoading } = useQuery({
    queryKey: ['referral-links'],
    queryFn: () => base44.entities.ReferralLink.filter({ is_active: true }, 'sort_order'),
    staleTime: 1000 * 60 * 15,
  });

  // Filtrování článků a odkazů
  const { links, articles } = useMemo(() => {
    return {
      links: allData.filter(item => !item.is_article),
      articles: allData.filter(item => item.is_article)
    };
  }, [allData]);

  const filteredLinks = useMemo(() => {
    if (selectedCategory === 'all') {
      return links.filter(link => 
        link.category !== 'Nákup levně' && 
        !(Array.isArray(link.categories) && link.categories.includes('Nákup levně'))
      );
    }
    return links.filter(link => 
      link.category === selectedCategory || 
      (Array.isArray(link.categories) && link.categories.includes(selectedCategory))
    );
  }, [selectedCategory, links]);

  return (
    <div className="bg-white text-slate-900 selection:bg-purple-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* HEADER - Bez nadbytečných mezer */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 mb-4">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              Prověřené bonusy
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-2 tracking-tight">
            Vyzkoušej<span className="text-purple-600"> & Ušetři</span>
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto text-sm sm:text-base">
            Nejlepší bankovní bonusy a odměny přehledně na jednom místě.
          </p>
        </header>

        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        {/* HLAVNÍ SEKCE - Opravena tak, aby nezabírala prázdné místo */}
        <main className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-60 w-full rounded-[1.5rem] bg-slate-100" />
              ))
            ) : (
              filteredLinks.map((link, index) => (
                <div key={link.id}>
                   <LinkCard link={link} index={index} />
                </div>
              ))
            )}
          </div>
        </main>

        {/* SEKCE ČLÁNKY - Přisunuta blíže k obsahu */}
        {(selectedCategory === 'all' || selectedCategory === 'Článek') && articles.length > 0 && (
          <section className="mt-12 pt-10 border-t border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-50 rounded-xl">
                <FileText className="text-purple-600" size={24} />
              </div>
              <h2 className="text-2xl font-black tracking-tight">Návody a tipy</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/p/${article.id}`}
                  state={{ articleData: article }}
                  className="group bg-white rounded-[2rem] p-6 border border-slate-100 hover:border-purple-200 hover:shadow-lg transition-all"
                >
                  <h3 className="text-lg font-bold mb-2 group-hover:text-purple-600">{article.title}</h3>
                  <p className="text-slate-500 line-clamp-2 text-sm mb-4 leading-relaxed">{article.description}</p>
                  <div className="flex items-center text-purple-600 font-bold text-xs uppercase tracking-wider">
                    Číst více <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="mt-20 py-12 border-t border-slate-100 text-center">
          <div className="inline-block bg-slate-50 border border-slate-200 p-6 rounded-[2rem] mb-8">
            <div className="flex items-center justify-center gap-2 text-emerald-600 mb-1">
              <TrendingUp size={16} />
              <span className="text-[9px] font-black uppercase tracking-widest">Vyplaceno</span>
            </div>
            <div className="text-2xl font-black text-slate-900">
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
                  alert('Zkopírováno!');
                }
              }}
              className="rounded-full bg-slate-900 text-white px-8 py-6 hover:bg-purple-600 transition-all font-bold mx-auto"
            >
              <Share2 size={18} className="mr-2" />
              Sdílet s přáteli
            </Button>
            <p className="text-[10px] text-slate-400">© 2026 Vyzkoušej & Ušetři. Bonusy podléhají podmínkám bank.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
