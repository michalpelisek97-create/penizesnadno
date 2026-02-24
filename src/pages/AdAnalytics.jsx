import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, MousePointerClick, Eye, DollarSign, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(7);

  useEffect(() => {
    loadStats();
  }, [range]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke('getAdStats', { days: range });
      setStats(res.data);
    } catch (e) {
      console.error('getAdStats error', e);
    }
    setLoading(false);
  };

  const metricCards = stats ? [
    { label: 'Celkem zobrazení', value: stats.totalImpressions.toLocaleString('cs-CZ'), icon: Eye, color: 'from-blue-500 to-blue-700' },
    { label: 'Celkem kliknutí', value: stats.totalClicks.toLocaleString('cs-CZ'), icon: MousePointerClick, color: 'from-green-500 to-green-700' },
    { label: 'Průměrné CTR', value: `${stats.avgCTR} %`, icon: TrendingUp, color: 'from-purple-500 to-purple-700' },
    { label: 'Odhadované příjmy', value: `${stats.totalRevenue} Kč`, icon: DollarSign, color: 'from-amber-500 to-amber-700' },
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Výkon reklam</h1>
            <p className="text-slate-400 mt-1">Přehled metrik reklamních bannerů</p>
          </div>
          <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700" onClick={loadStats}>
            <RefreshCw className="w-4 h-4 mr-2" /> Obnovit
          </Button>
        </div>

        {/* Přepínač rozsahu */}
        <div className="flex gap-2 mb-6">
          {[7, 14, 30].map(d => (
            <button
              key={d}
              onClick={() => setRange(d)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${range === d ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              {d} dní
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-purple-400" />
          </div>
        ) : (
          <>
            {/* Metriky karty */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {metricCards.map((card) => (
                <div key={card.label} className={`bg-gradient-to-br ${card.color} rounded-xl p-5`}>
                  <card.icon className="w-5 h-5 mb-3 opacity-80" />
                  <div className="text-2xl font-bold">{card.value}</div>
                  <div className="text-xs opacity-80 mt-1">{card.label}</div>
                </div>
              ))}
            </div>

            {/* Graf zobrazení a kliknutí */}
            <div className="bg-slate-800/60 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Zobrazení a kliknutí</h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#fff' }} />
                  <Bar dataKey="zobrazení" fill="#6366f1" radius={[4,4,0,0]} />
                  <Bar dataKey="kliknutí" fill="#22c55e" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Graf CTR */}
            <div className="bg-slate-800/60 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">CTR (%) vývoj</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={stats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} unit="%" />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#fff' }} />
                  <Line type="monotone" dataKey="CTR" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Tabulka */}
            <div className="bg-slate-800/60 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Detail po dnech</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-700">
                      <th className="text-left py-2 pr-4">Datum</th>
                      <th className="text-right py-2 pr-4">Zobrazení</th>
                      <th className="text-right py-2 pr-4">Kliknutí</th>
                      <th className="text-right py-2 pr-4">CTR</th>
                      <th className="text-right py-2">Příjmy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.chartData.map((row) => (
                      <tr key={row.day} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="py-2 pr-4">{row.day}</td>
                        <td className="text-right py-2 pr-4">{row.zobrazení}</td>
                        <td className="text-right py-2 pr-4">{row.kliknutí}</td>
                        <td className="text-right py-2 pr-4 text-amber-400">{row.CTR}%</td>
                        <td className="text-right py-2 text-green-400">{row.příjmy} Kč</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-4 text-center">
              * Příjmy jsou orientační odhad na základě průměrného CPM 0.80 Kč. Skutečné příjmy závisí na reklamní síti.
            </p>
          </>
        )}
      </div>
    </div>
  );
}