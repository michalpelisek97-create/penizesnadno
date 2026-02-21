import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { generateSchemaData } from '@/components/utils/seoHelper';

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Zkusíme vzít data ze "state" (předaná z Home.jsx)
  const passedArticle = location.state?.articleData;

  // 2. Query spustíme JEN tehdy, pokud data nemáme ze state
  const { data: fetchedArticle, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: () => base44.entities.ReferralLink.get(id),
    enabled: !passedArticle && !!id,
  });

  // Použijeme buď předaná data, nebo načtená
  const article = passedArticle || fetchedArticle;

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

  if (isLoading && !passedArticle) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-8 text-white hover:text-gray-200">
          <ArrowLeft className="mr-2 h-4 w-4" /> Zpět
        </Button>

        <article className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
          <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-xs mb-6">
            <FileText className="w-4 h-4" /> Návod / Článek
          </div>
          
          <h1 className="text-4xl font-extrabold mb-8 leading-tight text-white">
            {article.title}
          </h1>

          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-8 mb-4 text-white" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-6 mb-3 text-white" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 text-slate-200 leading-relaxed" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                li: ({node, ...props}) => <li className="text-slate-200" {...props} />,
                a: ({node, ...props}) => <a className="text-emerald-400 hover:text-emerald-300 underline" {...props} />,
              }}
            >
              {article.content || article.description || ''}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}