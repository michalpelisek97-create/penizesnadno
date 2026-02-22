import React, { useEffect } from 'react';
import { generateSchemaData } from '@/components/utils/seoHelper';
import PerformanceMonitor from '@/components/performance/PerformanceMonitor';

const setSEOMeta = (title, description, image, url) => {
  if (typeof document === 'undefined') return;

  document.title = title;
  
  // Aktualizovat meta tagy
  const setMeta = (name, content, isProperty = false) => {
    let el = document.querySelector(isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      isProperty ? el.setAttribute('property', name) : el.setAttribute('name', name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('description', description);
  setMeta('og:title', title, true);
  setMeta('og:description', description, true);
  setMeta('og:image', image, true);
  setMeta('og:url', url, true);
  setMeta('twitter:title', title);
  setMeta('twitter:description', description);
  setMeta('twitter:image', image);
};

// Preload LCP image co nejdříve - high priorita
if (typeof document !== 'undefined') {
  const lcpImageUrl = 'https://www.tosevyplati.cz/_next/image?url=https%3A%2F%2Fim.tosevyplati.cz%2Fraiffeisenbank.jpg&w=828&q=75';
  const existing = document.querySelector('link[rel="preload"][data-lcp]');
  if (!existing) {
    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.as = 'image';
    preload.href = lcpImageUrl;
    preload.setAttribute('fetchpriority', 'high');
    preload.setAttribute('data-lcp', 'true');
    preload.setAttribute('imagesrcset', lcpImageUrl + ' 1x, ' + lcpImageUrl.replace('w=828', 'w=1656') + ' 2x');
    // Insert at start of head
    if (document.head.firstChild) {
      document.head.insertBefore(preload, document.head.firstChild);
    } else {
      document.head.appendChild(preload);
    }
  }
}

export default function Layout({ children, currentPageName = '', pageData = {}, pageTitle = '', pageDescription = '' }) {
  useEffect(() => {
    const baseUrl = window.location.origin;
    const title = pageTitle || 'Vyzkoušej & Ušetři - Bonusy, Cashback a Zdarma Peníze';
    const description = pageDescription || 'Objevte nejlepší bonusy, cashback a zdarma peníze. Bezpečně a jednoduše si vydělávejte na aplikacích, bankách a nákupech.';
    const image = pageData.image_url || `${baseUrl}/og-image.jpg`;
    const url = window.location.href;

    setSEOMeta(title, description, image, url);

    // Přidat Schema.org data
    const schemaEl = document.querySelector('script[type="application/ld+json"]');
    if (schemaEl) schemaEl.remove();
    
    const newSchema = document.createElement('script');
    newSchema.type = 'application/ld+json';
    newSchema.textContent = JSON.stringify(generateSchemaData('organization'));
    document.head.appendChild(newSchema);
  }, [pageTitle, pageDescription, pageData]);

  return (
    <>
      <PerformanceMonitor />
      <style>{`
              /* Critical CSS - inline pro rychlejší rendering */
              html { font-size: 16px; } 
              body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #fff; }
              * { box-sizing: border-box; }
              img { display: block; max-width: 100%; height: auto; content-visibility: auto; }
              /* Preload LCP image styles */
              link[data-lcp] { display: none; }
              /* Disable animations na prvním load pro lepší performance */
              @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
              }
            `}</style>
      {children}
    </>
  );
}