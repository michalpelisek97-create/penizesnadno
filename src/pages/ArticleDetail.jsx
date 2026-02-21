import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // Přidán useLocation
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

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
    enabled: !passedArticle && !!id, // Spustí se jen když passedArticle chybí
  });

  // Použijeme buď předaná data, nebo načtená
  const article = passedArticle || fetchedArticle;

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
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> Zpět
        </Button>

        <motion.article initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex items-center gap-2 text-purple-600 font-bold uppercase text-xs mb-4">
            <FileText className="w-4 h-4" /> Návod / Článek
          </div>
          
          <h1 className="text-4xl font-extrabold mb-8 leading-tight">
            {article.title}
          </h1>

          <div 
            className="prose prose-slate prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content || article.description }} 
          />
        </motion.article>
      </div>
    </div>
  );
}