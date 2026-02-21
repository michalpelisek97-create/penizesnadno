// SEO Helper - generování meta tagů a strukturovaných dat

export const generateMetaTags = (page, data = {}) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://vyzkousijaustri.cz';
  
  const defaults = {
    title: 'Vyzkoušej & Ušetři - Bonusy, Cashback a Zdarma Peníze',
    description: 'Objevte nejlepší bonusy, cashback a zdarma peníze. Bezpečně a jednoduše si vydělávejte na aplikacích, bankách a nákupech.',
    image: `${baseUrl}/og-image.jpg`,
    url: baseUrl,
    type: 'website'
  };

  const pages = {
    home: {
      title: 'Vyzkoušej & Ušetři - Nejlepší Bonusy a Cashback',
      description: 'Odkryjte tisíce způsobů, jak si vydělat s bonusy od bank, kryptoburz, her a aplikací. Snadné, bezpečné a ověřené.',
      url: baseUrl,
      type: 'website'
    },
    article: {
      title: `${data.title} - Návod a Tip`,
      description: data.description || `Přečtěte si detailný návod: ${data.title}. Kompletní průvodce s tipy a postupy.`,
      url: `${baseUrl}/clanek/${data.id}`,
      image: data.image_url || defaults.image,
      type: 'article'
    },
    link: {
      title: `${data.title} - ${data.description || 'Bonus a Cashback'}`,
      description: data.description || `Získejte bonus u ${data.title}. Ověřený a funkční odkaz.`,
      url: data.url || baseUrl,
      image: data.image_url || defaults.image,
      type: 'website'
    }
  };

  return {
    ...defaults,
    ...(pages[page] || {})
  };
};

export const generateSchemaData = (type, data = {}) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://vyzkousijaustri.cz';

  const schemas = {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Vyzkoušej & Ušetři',
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      description: 'Platforma pro bezpečné získávání bonusů a cashbacku',
      sameAs: ['https://facebook.com', 'https://instagram.com']
    },
    
    article: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.title || 'Návod',
      description: data.description || '',
      image: data.image_url || '',
      datePublished: data.created_date || new Date().toISOString(),
      dateModified: data.updated_date || new Date().toISOString(),
      author: {
        '@type': 'Organization',
        name: 'Vyzkoušej & Ušetři'
      }
    },

    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: data.items?.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: item.name,
        item: `${baseUrl}${item.url}`
      })) || []
    },

    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.items?.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      })) || []
    }
  };

  return schemas[type] || schemas.organization;
};