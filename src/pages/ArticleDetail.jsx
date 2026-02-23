import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { generateSchemaData } from '@/components/utils/seoHelper';

export default function ArticleDetail() {
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Získání ID z query parametru
  const id = new URLSearchParams(window.location.search).get('id');

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setNotFound(false);

    base44.entities.ReferralLink.list('sort_order', 500)
      .then(results => {
        const found = results.find(r => r.id === id);
        if (found) {
          setArticle(found);
        } else {
          setNotFound(true);
        }
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    if (!article) return;
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

    let schemaEl = document.querySelector('script[type="application/ld+json"][data-article="true"]');
    if (schemaEl) schemaEl.remove();
    const newSchema = document.createElement('script');
    newSchema.type = 'application/ld+json';
    newSchema.setAttribute('data-article', 'true');
    newSchema.textContent = JSON.stringify(generateSchemaData('article', article));
    document.head.appendChild(newSchema);
  }, [article]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Skeleton className="h-8 w-24 mb-8 bg-white/20" />
          <Skeleton className="h-10 w-3/4 mb-6 bg-white/20" />
          <Skeleton className="h-96 w-full bg-white/20" />
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Článek nebyl nalezen</h1>
          <p className="text-slate-400 mb-6">ID: {id}</p>
          <Button onClick={() => navigate('/')} className="bg-emerald-600 hover:bg-emerald-700">Zpět na domů</Button>
        </div>
      </div>
    );
  }

  // Vyextrahujeme obsah z HTML dokumentu
  const getContent = (raw) => {
    if (!raw) return '';
    const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) return bodyMatch[1];
    return raw
      .replace(/<\/?html[^>]*>/gi, '')
      .replace(/<head[\s\S]*?<\/head>/gi, '')
      .replace(/<\/?body[^>]*>/gi, '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <style>{`
        .article-wrap { color: #2c3e50; background: white; padding: 40px; border-radius: 15px; margin-top: 20px; font-size: 16px; }
        .article-wrap h1 { color: #1a1a1a; text-align: center; font-size: 2.2em; margin-bottom: 30px; line-height: 1.2; }
        .article-wrap h2 { color: #2c3e50; margin-top: 40px; border-bottom: 2px solid #eee; padding-bottom: 10px; font-size: 1.6em; }
        .article-wrap h3 { color: #2c3e50; margin-top: 30px; margin-bottom: 15px; font-size: 1.2em; }
        .article-wrap p { line-height: 1.8; margin-bottom: 20px; }
        @media (max-width: 640px) {
          .article-wrap { padding: 12px 16px; border-radius: 10px; font-size: 14.5px; }
          .article-wrap h1 { font-size: 1.5em; margin-bottom: 16px; line-height: 1.3; }
          .article-wrap h2 { font-size: 1.2em; margin-top: 20px; margin-bottom: 12px; padding-bottom: 8px; }
          .article-wrap h3 { font-size: 1em; margin-top: 16px; margin-bottom: 10px; }
          .article-wrap p { line-height: 1.65; margin-bottom: 12px; }
          .article-wrap ul, .article-wrap ol { margin-left: 16px; margin-bottom: 12px; }
          .article-wrap li { margin-bottom: 5px; font-size: 0.95em; }
          .article-wrap table { font-size: 0.9em; }
          .article-wrap td, .article-wrap th { padding: 8px 10px; }
          .article-wrap .content-card { padding: 20px; margin: 15px 0; }
          .article-wrap .bonus-section { padding: 16px; margin: 15px 0; }
          .article-wrap .step-box { padding: 15px; margin: 12px 0; }
        }
        .article-wrap ul, .article-wrap ol { margin-left: 20px; margin-bottom: 15px; }
        .article-wrap li { margin-bottom: 8px; }
        .article-wrap table { width: 100%; border-collapse: collapse; }
        .article-wrap td, .article-wrap th { padding: 12px 15px; border-bottom: 1px solid #ddd; }
        .article-wrap .content-card { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 5px 25px rgba(0,0,0,0.1); border-top: 5px solid #27ae60; }
        .article-wrap .main-card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); border-top: 10px solid #fee600; }
        .article-wrap .bonus-section { background: #fffdf0; border: 1px solid #f1c40f; border-radius: 10px; padding: 25px; margin: 30px 0; }
        .article-wrap .bonus-highlight { background: #000; color: #fee600; padding: 20px; text-align: center; border-radius: 8px; font-size: 1.5em; font-weight: bold; margin-bottom: 30px; }
        .article-wrap .step-box { background: #f9f9f9; padding: 25px; border-radius: 8px; border-left: 6px solid #000; margin: 20px 0; }
        .article-wrap .hack-box { background: #fffde7; border: 2px dashed #fbc02d; padding: 20px; margin: 25px 0; border-radius: 10px; }
        .article-wrap .pro-tip { background: #e8f4fd; border-left: 5px solid #3498db; padding: 15px; margin: 20px 0; font-style: italic; }
        .article-wrap .cta-btn { display: inline-block; background: #000; color: #fff !important; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 0.95em; transition: 0.3s; }
        .article-wrap .cta-btn:hover { background: #333; color: #f1c40f !important; }
        .article-wrap a { color: #27ae60; }
        .article-wrap .inline-link { color: #27ae60; font-weight: bold; text-decoration: underline; }
        .article-wrap .footer-info, .article-wrap .info-footer { font-size: 0.85em; color: #95a5a6; text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; }
        .article-wrap .important-list { list-style-type: none; padding: 0; }
        .article-wrap .important-list li:before { content: "✔"; color: #fee600; font-weight: bold; margin-right: 10px; background: black; border-radius: 50%; padding: 2px 6px; font-size: 0.8em; }
        .article-wrap .validity { text-align: center; color: #666; font-weight: bold; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 1px; }
        .article-wrap .bank-name { font-weight: bold; font-size: 1.1em; color: #333; }
        .article-wrap .reward { color: #27ae60; font-weight: bold; font-size: 1.2em; text-align: right; }
        .article-wrap img { width: 100% !important; height: auto !important; max-width: 100% !important; display: block !important; margin: 20px 0 !important; border-radius: 8px !important; object-fit: cover !important; }
      `}</style>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-8 text-white hover:text-gray-200">
          <ArrowLeft className="mr-2 h-4 w-4" /> Zpět
        </Button>

        <div className="article-wrap">
          <div dangerouslySetInnerHTML={{ __html: getContent(article.content || article.description || '') }} />
        </div>
      </div>
    </div>
  );
}