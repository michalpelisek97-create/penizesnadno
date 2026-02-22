import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { generateSchemaData } from '@/components/utils/seoHelper';

export default function ArticleDetail() {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // ID může být v URL params nebo jako query param (?id=xxx)
  const urlParams = new URLSearchParams(window.location.search);
  const id = paramId || urlParams.get('id');

  // Vždy fetchujeme plná data článku (content byl vynechán na homepage kvůli optimalizaci)
  const { data: article, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      const results = await base44.entities.ReferralLink.filter({ id });
      return results[0] || null;
    },
    enabled: !!id,
  });

  // Nastavit meta tagy a schema.org data
  useEffect(() => {
    if (article) {
      const baseUrl = window.location.origin;
      document.title = `${article.title} - Návod a Tip | Vyzkoušej & Ušetři`;
      
      const setMeta = (name, content, isProperty = false) => {
        let el = document.querySelector(isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`);
        if (!el) {
          el = document.createElement('meta');
          isProperty ? el.setAttribute('property', name) : el.setAttribute('name', name);
          document.head.appendChild(el);
        }
        el.setAttribute('content', content);
      };

      setMeta('description', article.description || article.title);
      setMeta('og:title', `${article.title} - Návod`, true);
      setMeta('og:description', article.description || article.title, true);
      setMeta('og:image', article.image_url || '', true);
      setMeta('og:url', window.location.href, true);

      // Přidat Schema.org data
      let schemaEl = document.querySelector('script[type="application/ld+json"][data-article="true"]');
      if (schemaEl) schemaEl.remove();
      
      const newSchema = document.createElement('script');
      newSchema.type = 'application/ld+json';
      newSchema.setAttribute('data-article', 'true');
      newSchema.textContent = JSON.stringify(generateSchemaData('article', article));
      document.head.appendChild(newSchema);
    }
  }, [article]);

  if (isLoading && !article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <Skeleton className="h-10 w-3/4 mb-6" />
        <Skeleton className="h-64 w-full mt-8" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Článek nebyl nalezen</h1>
        <Button onClick={() => navigate('/')} className="mt-4">Zpět na domů</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <style>{`
        .article-container { color: #2c3e50; background: white; padding: 40px; border-radius: 15px; margin-top: 20px; }
        .article-container .content-card { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 5px 25px rgba(0,0,0,0.1); border-top: 5px solid #27ae60; }
        .article-container h1 { color: #1a1a1a; text-align: center; font-size: 2.5em; margin-bottom: 30px; }
        .article-container h2 { color: #2c3e50; margin-top: 40px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        .article-container h3 { color: #2c3e50; margin-top: 30px; margin-bottom: 15px; }
        .article-container .bonus-section { background: #fffdf0; border: 1px solid #f1c40f; border-radius: 10px; padding: 25px; margin: 30px 0; }
        .article-container .bonus-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .article-container .bonus-table td { padding: 15px; border-bottom: 1px solid #ddd; }
        .article-container .bank-name { font-weight: bold; font-size: 1.1em; color: #333; }
        .article-container .reward { color: #27ae60; font-weight: bold; font-size: 1.2em; text-align: right; }
        .article-container .cta-btn { display: inline-block; background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 0.9em; transition: 0.3s; }
        .article-container .cta-btn:hover { background: #333; color: #f1c40f; }
        .article-container .pro-tip { background: #e8f4fd; border-left: 5px solid #3498db; padding: 15px; margin: 20px 0; font-style: italic; color: #2c3e50; }
        .article-container .footer-info { font-size: 0.85em; color: #95a5a6; text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; }
        .article-container .inline-link { color: #27ae60; font-weight: bold; text-decoration: underline; }
        .article-container p { line-height: 1.6; }
        .article-container ul, .article-container ol { margin-left: 20px; }
      `}</style>
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-8 text-white hover:text-gray-200">
          <ArrowLeft className="mr-2 h-4 w-4" /> Zpět
        </Button>

        <div className="article-container">
          <div 
            dangerouslySetInnerHTML={{ __html: (() => {
              const raw = article.content || article.description || '';
              // Pokud content obsahuje celý HTML dokument, vyextrahujeme jen obsah <body>
              const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
              if (bodyMatch) return bodyMatch[1];
              // Jinak odstraníme případné <html>, <head> tagy a vrátíme zbytek
              return raw.replace(/<\/?html[^>]*>/gi, '').replace(/<head[\s\S]*?<\/head>/gi, '').replace(/<\/?body[^>]*>/gi, '');
            })() }} 
          />
        </div>
      </div>
    </div>
  );
}