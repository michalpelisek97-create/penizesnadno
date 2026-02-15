{/* SEKCE PRŮZKUMY (CPX Research) */}
<AnimatePresence mode="wait">
  {selectedCategory === 'průzkumy' && (
    <motion.div 
      key="surveys-section"
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-8 mb-20"
    >
      <div className="flex items-center gap-3 mb-8 border-b pb-6 border-slate-200">
        <div className="p-2 rounded-lg bg-emerald-600 text-white shadow-lg">
          <ClipboardList className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Placené průzkumy</h2>
          <p className="text-slate-500 text-sm font-medium">Vydělávejte peníze sdílením svého názoru</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden min-h-[800px]">
        <iframe 
          src="https://offers.cpx-research.com"
          style={{ width: '100%', height: '800px', border: 'none' }}
          title="CPX Research Surveys"
        />
      </div>
    </motion.div>
  )}
</AnimatePresence>
