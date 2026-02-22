import React, { useEffect } from 'react';
import { generateSchemaData } from '@/components/utils/seoHelper';

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

// Preload LCP image co nejdříve
const lcpImageUrl = 'https://www.tosevyplati.cz/_next/image?url=https%3A%2F%2Fim.tosevyplati.cz%2Fraiffeisenbank.jpg&w=828&q=75';
if (typeof document !== 'undefined') {
  const existing = document.querySelector('link[rel="preload"][data-lcp]');
  if (!existing) {
    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.as = 'image';
    preload.href = lcpImageUrl;
    preload.setAttribute('fetchpriority', 'high');
    preload.setAttribute('data-lcp', 'true');
    document.head.prepend(preload);
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

  return <>{children}</>;
}