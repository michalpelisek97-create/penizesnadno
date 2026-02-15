import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, FileText, ArrowRight, Banknote, CheckCircle2, Copy } from 'lucide-react';
import LinkCard from '@/components/links/LinkCard';
import CategoryFilter from '@/components/links/CategoryFilter';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notifIndex, setNotifIndex] = useState(0);
  const [isAirBankOpen, setIsAirBankOpen] = useState(false); // Stav pro rozbalení návodu

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

        {/* Social Proof Oznámení */}
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

        {/* SEKCE ODKAZY */}
        <AnimatePresence mode="wait">
          {selectedCategory !== 'Článek' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-48 w-full rounded-2xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))
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

        {/* SEKCE ČLÁNKY */}
        <AnimatePresence mode="wait">
          {selectedCategory === 'Článek' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
               <div className="flex items-center gap-3 mb-8 border-b pb-6 border-slate-200">
                <FileText className="w-6 h-6 text-purple-600" />
                <h2 className="text-3xl font-bold text-slate-900">Návody a články</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* AIR BANK ČLÁNEK S FUNKČNÍM ROZBALENÍM */}
                <motion.div 
                  layout
                  className={`bg-gradient-to-br from-emerald-50 to-white p-8 rounded-3xl border-2 border-emerald-100 shadow-sm transition-all relative overflow-hidden ${isAirBankOpen ? 'md:col-span-2' : ''}`}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Banknote className="w-24 h-24 text-emerald-600" />
                  </div>
                  
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold mb-4">
                    PRŮVODCE
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-slate-900 leading-tight">
                    Jak získat 500 Kč od Air Bank?
                  </h3>
                  
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Air Bank aktuálně nabízí odměnu pro nové klienty. Stačí dodržet jednoduchý postup a bonus je váš.
                  </p>

                  <AnimatePresence>
                    {isAirBankOpen && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-6 mb-8 border-t border-emerald-100 pt-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex flex-col gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">1</div>
                            <p className="text-sm font-semibold">Založte si běžný účet online</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">2</div>
                            <p className="text-sm font-semibold">Zaplaťte kartou v jakékoliv výši</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">3</div>
                            <p className="text-sm font-semibold">Bonus 500 Kč vám banka připíše na účet</p>
                          </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-inner">
                          <p className="text-sm text-slate-500 mb-3">Váš unikátní registrační odkaz:</p>
                          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 truncate">
                            <code className="text-emerald-700 font-bold flex-1 truncate">https://www.airbank.cz/pozvani-pratel?referrer=52awyx</code>
                            <a 
                              href="https://www.airbank.cz/pozvani-pratel?referrer=52awyx" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors"
                            >
                              Otevřít <ArrowRight className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button 
                    onClick={() => setIsAirBankOpen(!isAirBankOpen)}
                    className="flex items-center text-emerald-600 font-bold group cursor-pointer"
                  >
                    {isAirBankOpen ? 'Zavřít návod' : 'Přečíst návod krok za krokem'} 
                    <ArrowRight className={`w-4 h-4 ml-2 transition-transform ${isAirBankOpen ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                  </button>
                </motion.div>

                {/* DYNAMICKÉ ČLÁNKY */}
                {isLoadingArticles ? (
                  [...Array(2)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-3xl" />)
                ) : (
                  articles.map((article) => (
                    <div key={article.id} className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all group">
                      <h3 className="text-2xl font-bold mb-4 text-slate-900 leading-tight group-hover:text-purple-600 transition-colors">{article.title}</h3>
                      <p className="text-slate-600 mb-6 line-clamp-4 leading-relaxed">{article.content}</p>
                      <div className="flex items-center text-slate-900 font-bold cursor-pointer underline decoration-slate-200 underline-offset-4">
                        Přečíst celý článek <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="text-center mt-16 pt-8 border-t border-slate-200/60 text-sm text-slate-500">
          Všechny bonusy jsou aktuální k {new Date().toLocaleDateString('cs-CZ')}.
        </footer>
      </div>
    </div>
  );
}