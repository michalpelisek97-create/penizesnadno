import React from 'react';
import { ExternalLink, Gift, Sparkles, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categoryColors = {
  crypto: 'from-amber-500 to-orange-600',
  banks: 'from-emerald-500 to-teal-600',
  cashback: 'from-pink-500 to-rose-600',
  'Nákup levně': 'from-blue-500 to-cyan-600', // Barva pro novou kategorii
  games: 'from-purple-500 to-violet-600',
  apps: 'from-blue-500 to-indigo-600',
  other: 'from-slate-500 to-slate-600'
};

const categoryLabels = {
  crypto: 'Kryptoměny',
  banks: 'Banky',
  cashback: 'Cashback',
  'Nákup levně': 'Nákup levně', // Štítek pro novou kategorii
  games: 'Hry',
  apps: 'Aplikace',
  other: 'Ostatní'
};

export default function LinkCard({ link }) {
  const primaryCategory = link.category || (Array.isArray(link.categories) ? link.categories[0] : 'other');
  const gradientClass = categoryColors[primaryCategory] || categoryColors.other;

  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl -z-10"
           style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }} />
      
      <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Image Section */}
        <div className="relative h-40 overflow-hidden">
          {link.image_url ? (
            <img 
                    src={
                      link.image_url?.includes('images.unsplash.com')
                        ? link.image_url.replace(/[?&]w=\d+/, '').replace(/[?&]h=\d+/, '') + (link.image_url.includes('?') ? '&w=400&q=60&fm=webp' : '?w=400&q=60&fm=webp')
                        : link.image_url
                    }
                    alt={link.title}
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="160"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
              {primaryCategory === 'Nákup levně' ? (
                <ShoppingBag className="w-16 h-16 text-white/80" />
              ) : (
                <Gift className="w-16 h-16 text-white/80" />
              )}
            </div>
          )}
          
          {/* Category Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {/* Zobrazíme buď pole kategorií, nebo jen tu jednu hlavní */}
            {(Array.isArray(link.categories) && link.categories.length > 0 ? link.categories : [primaryCategory]).map((cat) => (
              <div 
                key={cat}
                className={`px-2.5 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${categoryColors[cat] || categoryColors.other} shadow-lg`}
              >
                {categoryLabels[cat] || cat}
              </div>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          <p className="text-lg font-semibold text-slate-900 mb-2 line-clamp-1">
            {link.title}
          </p>
          
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