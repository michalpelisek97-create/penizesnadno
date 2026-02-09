import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categoryColors = {
  crypto: 'from-amber-500 to-orange-600',
  banks: 'from-emerald-500 to-teal-600',
  cashback: 'from-pink-500 to-rose-600',
  games: 'from-purple-500 to-violet-600',
  apps: 'from-blue-500 to-indigo-600',
  other: 'from-slate-500 to-slate-600'
};

const categoryLabels = {
  crypto: 'Kryptoměny',
  banks: 'Banky',
  cashback: 'Cashback',
  games: 'Hry',
  apps: 'Aplikace',
  other: 'Ostatní'
};

export default function LinkCard({ link, index }) {
  const primaryCategory = link.categories?.[0] || link.category || 'other';
  const gradientClass = categoryColors[primaryCategory] || categoryColors.other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl -z-10"
           style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }} />
      
      <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Image Section */}
        <div className="relative h-40 overflow-hidden">
          {link.image_url ? (
            <img 
              src={link.image_url} 
              alt={link.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
              <Gift className="w-16 h-16 text-white/80" />
            </div>
          )}
          
          {/* Category Badge */}
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${gradientClass} shadow-lg`}>
            {categoryLabels[primaryCategory]}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-1">
            {link.title}
          </h3>
          
          {link.description && (
            <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
              {link.description}
            </p>
          )}

          {/* CTA Button */}
          <a 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block"
          >
            <Button 
              className={`w-full bg-gradient-to-r ${gradientClass} hover:opacity-90 text-white font-medium py-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group/btn`}
            >
              <Sparkles className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
              {link.cta_text || 'Získat bonus'}
              <ExternalLink className="w-4 h-4 ml-2 opacity-70" />
            </Button>
          </a>
        </div>
      </div>
    </motion.div>
  );
}