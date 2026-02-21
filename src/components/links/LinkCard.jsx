import React from 'react';
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

export default function LinkCard({ link, priority = false, loading = 'lazy' }) {
  const primaryCategory = link.category || (Array.isArray(link.categories) ? link.categories[0] : 'other');
  const gradientClass = categoryColors[primaryCategory] || categoryColors.other;
  const [imgError, setImgError] = React.useState(false);

  const handleImageError = () => setImgError(true);

  return (
    <div className="group relative">
      <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Image Section */}
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
          {link.image_url && !imgError ? (
            <img
              src={
                link.image_url?.includes('images.unsplash.com')
                  ? link.image_url.split('?')[0] + '?w=400&q=60&fm=webp'
                  : link.image_url
              }
              srcSet={
                link.image_url?.includes('images.unsplash.com')
                  ? `${link.image_url.split('?')[0]}?w=200&q=60&fm=webp 200w, ${link.image_url.split('?')[0]}?w=400&q=60&fm=webp 400w, ${link.image_url.split('?')[0]}?w=800&q=60&fm=webp 800w`
                  : undefined
              }
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              alt={link.title}
              loading={loading}
              fetchpriority={priority ? "high" : "auto"}
              decoding={priority ? "sync" : "async"}
              width="400"
              height="160"
              onError={handleImageError}
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
    </div>
  );
}