import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, FileText, ArrowRight, CheckCircle2, Circle, Trophy, Wallet, Star } from 'lucide-react';
import LinkCard from '@/components/links/LinkCard';
import CategoryFilter from '@/components/links/CategoryFilter';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notifIndex, setNotifIndex] = useState(0);
  const [completedQuests, setCompletedQuests] = useState([]);

  // Seznam všech 12 nabídek pro gamifikaci
  const quests = useMemo(() => [
    { id: 'rb', label: 'Raiffeisenbank', value: 1000 },
    { id: 'ab', label: 'Air Bank', value: 500 },
    { id: 'rev', label: 'Revolut', value: 1000 },
    { id: 'hg', label: 'Honeygain ($5)', value: 125 },
    { id: 'bin', label: 'Binance', value: 500 },
    { id: 'tipli', label: 'Tipli.cz', value: 100 },
    { id: 'atta', label: 'Attapoll', value: 20 },
    { id: 'pp', label: 'Plná Peněženka', value: 100 },
    { id: 'yh', label: 'Youhodler.com', value: 250 },
    { id: 'rc', label: 'RollerCoin', value: 50 },
    { id: 'ctp', label: 'CT Pool', value: 30 },
    { id: 'ac', label: 'Aircash', value: 150 }
  ], []);

  const toggleQuest = (id) => {
    setCompletedQuests(prev => 
      prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]
    );
  };

  const totalEarned = completedQuests.reduce((acc, qId) => {
    const q = quests.find(curr => curr.id === qId);
    return acc + (q ? q.value : 0);
  }, 0);

  const totalPotential = quests.reduce((acc, q) => acc + q.value, 0);

  // Načítání dat
  const { data: links = [], isLoading } = useQuery({
    queryKey: ['referral-links'],
    queryFn: () => base44.entities.ReferralLink.filter({ is_active: true }, 'sort_order'),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="relative max-w-6xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
            Vyzkoušej<span className="bg-gradient-to-r from-purple-600 to-rose-600 bg-clip-text text-transparent"> & Ušetři</span>
          </h1>
        </div>

        {/* KARTA: CESTA ZA PENĚZI */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-16 bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-purple-100/50 overflow-hidden"
        >
          <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500 rounded-2xl shadow-lg shadow-purple-500/40">
                <Trophy size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Cesta za penězi</h2>
                <p className="text-slate-400 text-sm italic">Splň všechny kroky a maximalizuj svůj zisk</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs uppercase tracking-widest text-slate-400 mb-1 font-bold">Aktuální skóre</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-emerald-400">{totalEarned}</span>
                <span className="text-slate-500 font-bold">/ {totalPotential} Kč</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quests.map((quest) => (
                <div 
                  key={quest.id} 
                  onClick={() => toggleQuest(quest.id)}
                  className={`group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                    completedQuests.includes(quest.id) 
                    ? 'bg-emerald-50 border-emerald-200 shadow-inner' 
                    : 'bg-slate-50 border-transparent hover:border-purple-200 hover:bg-white'
                  }`}
                >
                  <div className={`transition-colors ${completedQuests.includes(quest.id) ? 'text-emerald-500' : 'text-slate-300'}`}>
                    {completedQuests.includes(quest.id) ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${completedQuests.includes(quest.id) ? 'text-emerald-900' : 'text-slate-700'}`}>
                      {quest.label}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-xs font-black ${completedQuests.includes(quest.id) ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500 group-hover:bg-purple-500 group-hover:text-white'}`}>
                    +{quest.value} Kč
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-10">
               <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
                  <span>Tvůj progres</span>
                  <span>{Math.round((totalEarned / totalPotential) * 100)}%</span>
               </div>
               <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-1">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(totalEarned / totalPotential) * 100}%` }}
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-full"
                  />
               </div>
            </div>
          </div>
        </motion.div>

        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        {/* MŘÍŽKA ODKAZŮ */}
        <AnimatePresence mode="wait">
          {selectedCategory !== 'Článek' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {isLoading ? (
                [...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl shadow-sm" />)
              ) : links.filter(l => selectedCategory === 'all' || l.category === selectedCategory).map((link, index) => {
                const isFavorite = link.title.includes('Air Bank') || link.title.includes('Raiffeisenbank');
                return (
                  <div key={link.id} className="relative group">
                    {isFavorite && (
                      <div className="absolute -top-3 -right-2 z-20 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-xl border-2 border-white animate-bounce tracking-tighter">
                        ⭐ NEJOBLÍBENĚJŠÍ
                      </div>
                    )}
                    <LinkCard link={link} index={index} />
                  </div>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-slate-200/60 text-sm text-slate-500">
           Tyto nabídky jsou pravidelně aktualizovány. Celkový bonus k vybrání: <span className="font-bold text-slate-900">{totalPotential} Kč</span>.
        </footer>
      </div>
    </div>
  );
}
