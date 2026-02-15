import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, FileText, ArrowRight, CheckCircle2, Circle, Trophy } from 'lucide-react';
import LinkCard from '@/components/links/LinkCard';
import CategoryFilter from '@/components/links/CategoryFilter';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notifIndex, setNotifIndex] = useState(0);
  
  // Stav pro gamifikaci - odškrtávání úkolů
  const [completedQuests, setCompletedQuests] = useState([]);

  const toggleQuest = (id) => {
    setCompletedQuests(prev => 
      prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]
    );
  };

  const notifications = useMemo(() => [
    { name: 'Marek P.', app: 'Air Bank' }, { name: 'Lucie K.', app: 'Honeygain' },
    { name: 'Jakub S.', app: 'Raiffeisenbank' }, { name: 'Petr M.', app: 'Revolut' },
    { name: 'Honza B.', app: 'Binance' }, { name: 'Jana R.', app: 'Plná Peněženka' }
  ], []);

  useEffect(() => {
    const timer = setInterval(() => setNotifIndex((prev) => (prev + 1) % notifications.length), 4000);
    return () => clearInterval(timer);
  }, [notifications.length]);

  const { data: links = [], isLoading } = useQuery({
    queryKey: ['referral-links'],
    queryFn: () => base44.entities.ReferralLink.filter({ is_active: true }, 'sort_order'),
  });

  const quests = [
    { id: 'rb', label: 'Bonus 1 000 Kč u Raiffeisenbank', value: 1000 },
    { id: 'ab', label: 'Bonus 500 Kč u Air Bank', value: 500 },
    { id: 'hg', label: 'Startovní bonus $5 u Honeygain', value: 120 }
  ];

  const totalEarned = completedQuests.reduce((acc, qId) => {
    const q = quests.find(curr => curr.id === qId);
    return acc + (q ? q.value : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="relative max-w-6xl mx-auto px-4 py-12">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
            Vyzkoušej<span className="bg-gradient-to-r from-purple-600 to-rose-600 bg-clip-text text-transparent"> & Ušetři</span>
          </h1>
          <p className="text-lg text-slate-600">Nejlepší bonusy na českém internetu na jednom místě.</p>
        </motion.div>

        {/* Social Proof */}
        <div className="flex justify-center mb-10 h-10">
          <AnimatePresence mode="wait">
            <motion.div key={notifIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white border border-emerald-100 shadow-sm"
            >
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm font-medium text-slate-700">
                <b>{notifications[notifIndex].name}</b> získal(a) bonus u <span className="text-emerald-600 font-bold">{notifications[notifIndex].app}</span>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* GAMIFIKACE: TVOJE CESTA ZA BONUSEM */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto mb-16 bg-white p-6 rounded-3xl border-2 border-purple-100 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10"><Trophy size={80} className="text-purple-600" /></div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="text-amber-500" size={20} /> Moje cesta za první tisícovkou
          </h2>
          
          <div className="space-y-3 mb-6">
            {quests.map((quest) => (
              <div 
                key={quest.id} 
                onClick={() => toggleQuest(quest.id)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                  completedQuests.includes(quest.id) ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-purple-200'
                }`}
              >
                {completedQuests.includes(quest.id) ? <CheckCircle2 className="text-emerald-500" /> : <Circle />}
                <span className="flex-1 font-medium">{quest.label}</span>
                <span className="font-bold">~{quest.value} Kč</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t flex justify-between items-center">
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Aktuálně vybráno:</span>
            <span className="text-2xl font-black text-purple-600">{totalEarned} Kč</span>
          </div>
          
          {totalEarned >= 1000 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center text-sm font-bold text-emerald-600">
              🎉 Gratulujeme! Dosáhl jsi na metu 1 000 Kč!
            </motion.p>
          )}
        </motion.div>

        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        {/* MŘÍŽKA ODKAZŮ */}
        <AnimatePresence mode="wait">
          {selectedCategory !== 'Článek' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {isLoading ? (
                [...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)
              ) : links.filter(l => selectedCategory === 'all' || l.category === selectedCategory).map((link, index) => {
                const isFavorite = link.title.includes('Air Bank') || link.title.includes('Raiffeisenbank');
                return (
                  <div key={link.id} className="relative">
                    {isFavorite && (
                      <div className="absolute -top-3 -right-2 z-20 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white animate-bounce">
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

        {/* Zbytek kódu (Články / Footer) zůstává stejný... */}
      </div>
    </div>
  );
}
