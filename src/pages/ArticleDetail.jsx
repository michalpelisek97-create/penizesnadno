import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: () => base44.entities.ReferralLink.get(id),
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <Skeleton className="h-10 w-3/4 mb-6" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
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
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-8 hover:bg-slate-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Zpět
        </Button>

        <motion.article
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 text-purple-600 font-bold uppercase text-xs mb-4 tracking-widest">
            <FileText className="w-4 h-4" /> Návod / Článek
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-slate-400 text-sm mb-10 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString('cs-CZ')}
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Redakce Vyzkoušej & Ušetři
            </div>
          </div>

          {/* Vykreslení obsahu článku - podporuje HTML tagy */}
          <div 
            className="prose prose-slate prose-lg max-w-none 
              prose-headings:font-bold prose-headings:text-slate-900
              prose-p:text-slate-600 prose-p:leading-relaxed
              prose-a:text-purple-600 prose-strong:text-slate-900"
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />
        </motion.article>
      </div>
    </div>
  );
}

