// ... (importy zůstávají stejné)

export default function Home() {
  // ... (logika zůstává stejná)

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        
        {/* 1. HERO SEKCE - Rozprostřená do šířky */}
        <header className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-left lg:max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 mb-6">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Dnešní top nabídky</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-[1.1]">
              Vyzkoušej
              <span className="block bg-gradient-to-r from-purple-600 to-rose-600 bg-clip-text text-transparent">
                & Ušetři Peníze
              </span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-lg">
              Průvodce světem bonusů. Aktuálně jsme uživatelům pomohli získat přes 
              <span className="font-bold text-slate-900 ml-1 leading-none inline-flex flex-col">
                {savings.toLocaleString()} Kč
              </span>
            </p>
            
            {/* Social Proof integrovaný přímo do Hero */}
            <div className="h-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={notifIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 text-sm text-slate-500 bg-white/50 w-fit pr-4 rounded-full border border-slate-100"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-[10px]">
                    LIVE
                  </div>
                  <span><b>{notifications[notifIndex].name}</b> právě získal bonus u <b>{notifications[notifIndex].app}</b></span>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* 2. STATS CARD - Rozbití nudle pravým panelem */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full lg:w-80 bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden"
          >
             <div className="relative z-10">
                <p className="text-slate-400 text-sm mb-1">Celkem ušetřeno komunitou</p>
                <div className="text-3xl font-mono font-bold mb-6 text-emerald-400">
                  {savings.toLocaleString()} CZK
                </div>
                <button 
                  onClick={handleShare}
                  className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md py-3 rounded-xl flex items-center justify-center gap-2 transition-all border border-white/10"
                >
                  <Share2 className="w-4 h-4" /> Sdílet s přáteli
                </button>
             </div>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-600/20 blur-3xl rounded-full" />
          </motion.div>
        </header>

        {/* 3. STICKY FILTER BAR */}
        <div className="sticky top-4 z-50 mb-12">
          <div className="bg-white/80 backdrop-blur-xl p-2 rounded-2xl shadow-lg border border-slate-200/50 max-w-fit mx-auto">
            <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
          </div>
        </div>

        {/* 4. CONTENT GRID (Bento Style) */}
        <AnimatePresence mode="wait">
          {selectedCategory !== 'Článek' && (
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {isLoading ? (
                // Skeletony...
                <div className="col-span-full h-64 bg-slate-100 animate-pulse rounded-3xl" />
              ) : (
                filteredLinks.map((link, index) => {
                  // PRVNÍ KARTA BUDE VELKÁ (FEATURED)
                  const isFeatured = index === 0;
                  return (
                    <div 
                      key={link.id} 
                      className={`relative ${isFeatured ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2'}`}
                    >
                      <LinkCard 
                        link={link} 
                        index={index} 
                        isFeatured={isFeatured} // Upravit LinkCard pro různé styly
                      />
                    </div>
                  );
                })
              )}
            </div>
          )}
        </AnimatePresence>

        {/* 5. SEKCE ČLÁNKY - Grid 2x2 místo pod sebou */}
        {selectedCategory === 'Článek' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Vaše články zde */}
          </div>
        )}

      </div>
    </div>
  );
}
