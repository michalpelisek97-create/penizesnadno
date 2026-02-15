import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FileText, ArrowRight, Banknote, CheckCircle2, ExternalLink } from 'lucide-react';
import LinkCard from '@/components/links/LinkCard';
import CategoryFilter from '@/components/links/CategoryFilter';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notifIndex, setNotifIndex] = useState(0);
  const [isAirBankOpen, setIsAirBankOpen] = useState(false);

  // Seznam oznámení
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
    if (selectedCategory === 'Článek') return [];
    return links.filter(link => 
      link.category === selectedCategory || 
      (Array.isArray(link.categories) && link.categories.includes(selectedCategory))
    );
  }, [selectedCategory, links]);

  const isLoading = isLoadingLinks || isLoadingArticles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 sm:py-16">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-700">Dnes aktivní bonusy pro vás</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
            Vyzkoušej
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent"> & Ušetři</span>
          </h1>
        </div>

        {/* Social Proof */}
        <div className="flex justify-center mb-12 h-10 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={notifIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white border border-emerald-100 shadow-sm"
            >
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm font-medium text-slate-700">
                <strong>{notifications[notifIndex].name}</strong> získal bonus u <strong className="text-emerald-600">{notifications[notifIndex].app}</strong>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        {/* SEKCE ODKAZY */}
        {selectedCategory !== 'Článek' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {isLoadingLinks ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-2xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            ) : (
              filteredLinks.map((link, index) => (
                <LinkCard key={link.id} link={link} index={index} />
              ))
            )}
          </div>
        )}

        {/* SEKCE ČLÁNKY */}
        {selectedCategory === 'Článek' && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-8 border-b pb-6 border-slate-200">
              <FileText className="w-6 h-6 text-purple-600" />
              <h2 className="text-3xl font-bold text-slate-900">Návody a články</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
              
              {/* AIR BANK ČLÁNEK - OPRAVENÉ KLIKÁNÍ */}
              <div className="bg-white border-2 border-emerald-100 rounded-[2rem] shadow-sm overflow-hidden transition-all">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-emerald-100 text-emerald-700 text-xs font-black px-4 py-1 rounded-full uppercase italic">
                      🔥 Top Návod
                    </div>
                    <Banknote className="text-emerald-500 w-10 h-10 opacity-20" />
                  </div>
                  
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">
                    Jak získat 500 Kč od Air Bank?
                  </h3>
                  <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                    Tento bonus patří mezi nejoblíbenější. Stačí pár minut v aplikaci a odměna je vaše. Podívejte se na náš podrobný návod.
                  </p>

                  {/* TLAČÍTKO - Teď je to klasický button mimo animované wrappery */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setIsAirBankOpen(!isAirBankOpen);
                    }}
                    className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg shadow-emerald-200"
                  >
                    {isAirBankOpen ? 'Skrýt podrobnosti' : 'Zobrazit návod a kód'}
                    <ArrowRight className={`w-5 h-5 transition-transform ${isAirBankOpen ? 'rotate-90' : ''}`} />
                  </button>

                  {/* ROZBALOVACÍ ČÁST */}
                  {isAirBankOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-10 pt-10 border-t border-slate-100"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative">
                          <span className="absolute -top-3 -left-3 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold shadow-md">1</span>
                          <h4 className="font-bold mb-2 pt-2">Registrace</h4>
                          <p className="text-sm text-slate-500">Založte si běžný účet online přes aplikaci My Air.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative">
                          <span className="absolute -top-3 -left-3 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold shadow-md">2</span>
                          <h4 className="font-bold mb-2 pt-2">Platba</h4>
                          <p className="text-sm text-slate-500">Proveďte jakoukoli platbu kartou v obchodě nebo na internetu.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative">
                          <span className="absolute -top-3 -left-3 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold shadow-md">3</span>
                          <h4 className="font-bold mb-2 pt-2">Odměna</h4>
                          <p className="text-sm text-slate-500">Banka vám připíše bonus 500 Kč přímo na váš nový účet.</p>
                        </div>
                      </div>

                      {/* REFERRAL BOX */}
                      <div className="bg-emerald-50 rounded-[2rem] p-2 border border-emerald-100">
                        <div className="bg-white rounded-[1.6rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-50">
                          <div>
                            <p className="text-emerald-600 font-black text-sm uppercase tracking-widest mb-1">Tvůj odkaz pro bonus</p>
                            <p className="text-slate-500 text-xs font-mono break-all">airbank.cz/pozvani-pratel?referrer=52awyx</p>
                          </div>
                          <a 
                            href="https://www.airbank.cz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-black text-center transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-200"
                          >
                            OTEVŘÍT AIR BANK <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Ostatní články */}
              {!isLoadingArticles && articles.map((article) => (
                <div key={article.id} className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm">
                  <h3 className="text-2xl font-bold mb-4 text-slate-900">{article.title}</h3>
                  <p className="text-slate-600 line-clamp-3">{article.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="text-center mt-16 pt-8 border-t border-slate-200 text-sm text-slate-400 font-medium">
          Všechny bonusy jsou aktuální k {new Date().toLocaleDateString('cs-CZ')}
        </footer>
      </div>
    </div>
  );
}
