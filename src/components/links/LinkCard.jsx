import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Gift, Sparkles, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categoryColors = {
  crypto: 'from-amber-500 to-orange-600',
  banks: 'from-emerald-500 to-teal-600',
  cashback: 'from-pink-500 to-rose-600',
  'Nákup levně': 'from-blue-500 to-cyan-600',
  games: 'from-purple-500 to-violet-600',
  apps: 'from-blue-500 to-indigo-600',
  other: 'from-slate-500 to-slate-600'
};

const categoryLabels = {
  crypto: 'Kryptoměny',
  banks: 'Banky',
  cashback: 'Cashback',
  'Nákup levně': 'Nákup levně',
  games: 'Hry',
  apps: 'Aplikace',
  other: 'Ostatní'
};

export default function LinkCard({ link, index }) {
  const primaryCategory = link.category || (Array.isArray(link.categories) ? link.categories[0] : 'other');
  const gradientClass = categoryColors[primaryCategory] || categoryColors.other;

  // OPRAVA: Teď už taháme data přímo z nového pole v DB
  const displayButtonText = link.button_text || link.cta_text || 'Získat bonus';

  const getOptimizedImageUrl = (url) => {
    if (!url) return null;
    if (url.includes('googleusercontent.com')) {
      return url.replace(/=w\d+-h\d+/, '=w400').replace(/=s\d+/, '=s400');
    }
    return url;
  };

  const optimizedSrc = getOptimizedImageUrl(link.image_url);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }} 
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl -z-10"
           style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }} />
      
      <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        
        <div className="relative h-40 overflow-hidden bg-slate-100">
          {optimizedSrc ? (
            <img 
              src={optimizedSrc} 
              alt={link.title}
              loading={index === 0 ? "eager" : "lazy"} 
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
              {primaryCategory === 'Nákup levně' ? <ShoppingBag className="w-16 h-16 text-white/80" /> : <Gift className="w-16 h-16 text-white/80" />}
            </div>
          )}
          
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {(Array.isArray(link.categories) ? link.categories : [primaryCategory]).map((cat) => (
              <div key={cat} className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase text-white bg-gradient-to-r ${categoryColors[cat] || categoryColors.other} shadow-lg`}>
                {categoryLabels[cat] || cat}
              </div>
            ))}
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">{link.title}</h3>
          <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed h-10">{link.description}</p>

          <a href={link.url} target="_blank" rel="noopener noreferrer" className="block">
            <Button className={`w-full bg-gradient-to-r ${gradientClass} hover:brightness-110 text-white font-bold py-6 rounded-xl shadow-md transition-all duration-300 group/btn`}>
              <Sparkles className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
              {displayButtonText}
              <ExternalLink className="w-4 h-4 ml-2 opacity-50" />
            </Button>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
