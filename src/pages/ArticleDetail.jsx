import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Taháme data z ReferralLink (protože tam jsme ty články uložili)
  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      // Důležité: Používáme ReferralLink entitu
      const res = await base44.entities.ReferralLink.get(id);
      return res;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <Skeleton className="h-10 w-3/4 mb-6" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-64 w-full mt-8" />
      </div>
    );
  }

  // Pokud nastala chyba nebo článek chybí
  if (error || !article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900">Článek nebyl nalezen</h1>
        <p className="text-slate-500 mt-2 max-w-sm">
          Pravděpodobně došlo k vyčerpání limitů projektu nebo článek v databázi neexistuje.
        </p>
        <Button onClick={() => navigate('/')} className="mt-8 bg-slate-900 text-white">
          Zpět na domovskou stránku
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')} 
          className="mb-8 hover:bg-slate-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Zpět na bonusy
        </Button>

        <motion.article
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 text-purple-600 font-bold uppercase text-xs mb-4 tracking-widest">
            <FileText className="w-4 h-4" /> Návod a Informace
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
            {article.title}
          </h1>

          <div 
            className="prose prose-slate prose-lg max-w-none 
              prose-headings:font-bold prose-headings:text-slate-900
              prose-p:text-slate-600 prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content || article.description }} 
          />
        </motion.article>
      </div>
    </div>
  );
}
