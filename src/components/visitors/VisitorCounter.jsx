import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Users } from 'lucide-react';

export default function VisitorCounter() {
  const [counts, setCounts] = useState({ d1: 0, d7: 0, d30: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        // 1) Zaznamenej návštěvu
        await base44.entities.Visit.create({}).catch(() => {});

        // 2) Spočti návštěvy v časových oknech
        const now = Date.now();
        const t1 = new Date(now - 24 * 60 * 60 * 1000).toISOString();
        const t7 = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
        const t30 = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();

        const [r1, r7, r30] = await Promise.all([
          base44.entities.Visit.filter({ created_date: { $gte: t1 } }, '-created_date', 100000),
          base44.entities.Visit.filter({ created_date: { $gte: t7 } }, '-created_date', 100000),
          base44.entities.Visit.filter({ created_date: { $gte: t30 } }, '-created_date', 100000),
        ]);

        if (mounted) {
          setCounts({ d1: r1.length, d7: r7.length, d30: r30.length });
          setLoading(false);
        }
      } catch (e) {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => { mounted = false; };
  }, []);

  const stats = [
    { label: '24 hodin', value: counts.d1 },
    { label: '7 dní', value: counts.d7 },
    { label: '30 dní', value: counts.d30 },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 mb-5">
          <Users className="w-5 h-5 text-cyan-300" />
          <h3 className="text-base font-bold text-white">Návštěvnost</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s, i) => (
            <div key={i} className="text-center bg-slate-900/50 rounded-xl py-4 px-2 border border-slate-700/40">
              <div className="text-2xl font-black text-cyan-300 tabular-nums">
                {loading ? '…' : s.value.toLocaleString('cs-CZ')}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}