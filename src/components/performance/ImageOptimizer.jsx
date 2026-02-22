import React from 'react';

/**
 * OptimizedImage - Komponenta pro optimalizované Loading obrázků
 * - Responsive images s srcset
 * - WebP fallback
 * - Lazy loading
 * - LQIP (Low Quality Image Placeholder)
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  fetchpriority = 'auto',
  className = '',
  onError,
}) {
  const [imgError, setImgError] = React.useState(false);

  const handleError = (e) => {
    setImgError(true);
    onError?.(e);
  };

  // Generate responsive srcset
  const generateSrcSet = (url) => {
    if (!url || url.startsWith('data:')) return undefined;
    
    if (url.includes('images.unsplash.com')) {
      const base = url.split('?')[0];
      return `${base}?w=200&q=60&fm=webp&fit=crop 200w, ${base}?w=400&q=60&fm=webp&fit=crop 400w, ${base}?w=800&q=60&fm=webp&fit=crop 800w`;
    }
    
    if (url.includes('tosevyplati.cz') && url.includes('_next/image')) {
      return `${url} 1x, ${url.replace('w=400', 'w=800')} 2x`;
    }
    
    return undefined;
  };

  return (
    <img
      src={imgError ? 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="160"%3E%3Crect fill="%23374151" width="400" height="160"/%3E%3C/svg%3E' : src}
      srcSet={!imgError ? generateSrcSet(src) : undefined}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      fetchPriority={fetchpriority}
      decoding={fetchpriority === 'critical' ? 'sync' : 'async'}
      onError={handleError}
      className={className}
      style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
    />
  );
}