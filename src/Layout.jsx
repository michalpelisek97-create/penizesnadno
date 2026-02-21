import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { generateSchemaData } from '@/components/utils/seoHelper';

export default function Layout({ children, currentPageName = '', pageData = {}, pageTitle = '', pageDescription = '' }) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://vyzkousijaustri.cz';

  // Dynamické nastavení meta tagů
  const title = pageTitle || 'Vyzkoušej & Ušetři - Bonusy, Cashback a Zdarma Peníze';
  const description = pageDescription || 'Objevte nejlepší bonusy, cashback a zdarma peníze. Bezpečně a jednoduše si vydělávejte na aplikacích, bankách a nákupech.';
  const image = pageData.image_url || `${baseUrl}/og-image.jpg`;
  const url = typeof window !== 'undefined' ? window.location.href : baseUrl;

  // Schéma pro organizaci (na všech stránkách)
  const organizationSchema = generateSchemaData('organization');

  return (
    <>
      <Helmet>
        {/* Základní meta tagy */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="charset" content="utf-8" />
        
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />

        {/* Canonical URL */}
        <link rel="canonical" href={url} />

        {/* Schema.org strukturovaná data */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>

        {/* Další optimalizace */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="cs" />
        <meta name="revisit-after" content="7 days" />
      </Helmet>

      {children}
    </>
  );
}