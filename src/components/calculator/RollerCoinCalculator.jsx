import React, { useState } from 'react';
import { Lock, Unlock, Calculator } from 'lucide-react';

// Každý blok trvá 10 minut → 6 bloků za hodinu pro všechny mince v RollerCoin
const BLOCKS_PER_HOUR = 6;

const COINS = [
  { id: 'BTC',  name: 'Bitcoin',      symbol: 'BTC',  color: '#f7931a' },
  { id: 'ETH',  name: 'Ethereum',     symbol: 'ETH',  color: '#627eea' },
  { id: 'RLT',  name: 'RollerToken',  symbol: 'RLT',  color: '#ff6b6b' },
  { id: 'DOGE', name: 'Dogecoin',     symbol: 'DOGE', color: '#c2a633' },
  { id: 'LTC',  name: 'Litecoin',     symbol: 'LTC',  color: '#bfbbbb' },
  { id: 'SOL',  name: 'Solana',       symbol: 'SOL',  color: '#9945ff' },
  { id: 'TRX',  name: 'TRON',         symbol: 'TRX',  color: '#ef0027' },
  { id: 'POL',  name: 'Polygon',      symbol: 'POL',  color: '#8247e5' },
  { id: 'BNB',  name: 'BNB',          symbol: 'BNB',  color: '#f3ba2f' },
  { id: 'HMT',  name: 'Human Protocol',symbol: 'HMT', color: '#5affb7' },
  { id: 'RST',  name: 'RST Token',    symbol: 'RST',  color: '#ff9f43' },
];

const POWER_UNITS = ['H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s', 'EH/s'];
const UNIT_MULTIPLIERS = { 'H/s': 1, 'KH/s': 1e3, 'MH/s': 1e6, 'GH/s': 1e9, 'TH/s': 1e12, 'PH/s': 1e15, 'EH/s': 1e18 };

export default function RollerCoinCalculator() {
  const [coin, setCoin] = useState(COINS[0]);
  const [networkPower, setNetworkPower] = useState('');
  const [networkUnit, setNetworkUnit] = useState('EH/s');
  const [blockReward, setBlockReward] = useState('');
  const [userPower, setUserPower] = useState('');
  const [userUnit, setUserUnit] = useState('TH/s');
  const [unlocked, setUnlocked] = useState(false);
  const [results, setResults] = useState(null);

  const calculate = () => {
    const net = parseFloat(networkPower) * UNIT_MULTIPLIERS[networkUnit];
    const usr = parseFloat(userPower) * UNIT_MULTIPLIERS[userUnit];
    const reward = parseFloat(blockReward);
    if (!net || !usr || !reward || net === 0) return;
    const share = usr / net;
    const perBlock = share * reward;
    setResults({
      perBlock,
      perHour: perBlock * BLOCKS_PER_HOUR,
      perDay: perBlock * BLOCKS_PER_HOUR * 24,
      perWeek: perBlock * BLOCKS_PER_HOUR * 24 * 7,
      perMonth: perBlock * BLOCKS_PER_HOUR * 24 * 30,
      sharePercent: (share * 100).toFixed(12),
    });
  };

  const handleUnlock = () => {
    window.open('https://www.effectivegatecpm.com/ij547nkxe?key=8b2ae4a3228e917760d4cc1d37ea46f6', '_blank');
    setUnlocked(true);
  };

  const fmt = (val) => val < 0.001 ? val.toExponential(6) : val.toFixed(8);

  const rows = results ? [
    { label: 'Za blok (~' + Math.round(60 / coin.blocks_per_hour) + ' min)', value: fmt(results.perBlock) },
    { label: 'Za hodinu', value: fmt(results.perHour) },
    { label: 'Za den', value: fmt(results.perDay) },
    { label: 'Za týden', value: fmt(results.perWeek) },
    { label: 'Za měsíc', value: fmt(results.perMonth) },
  ] : [];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        .pixel-font { font-family: 'Press Start 2P', monospace; }
        .rc-card { background: linear-gradient(135deg, #0d1117 0%, #161b22 50%, #0d1117 100%); border: 2px solid #30363d; }
        .rc-input { background: #010409; border: 1px solid #30363d; color: #e6edf3; }
        .rc-input:focus { outline: none; border-color: #58a6ff; box-shadow: 0 0 0 3px rgba(88,166,255,0.15); }
        .rc-btn { background: linear-gradient(135deg, #f7931a, #ff6b35); border: none; cursor: pointer; transition: all 0.2s; }
        .rc-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(247,147,26,0.4); }
        .unlock-btn { background: linear-gradient(135deg, #238636, #2ea043); animation: pulse-green 2s infinite; }
        .unlock-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(35,134,54,0.5); }
        @keyframes pulse-green { 0%,100% { box-shadow: 0 0 10px rgba(46,160,67,0.3); } 50% { box-shadow: 0 0 30px rgba(46,160,67,0.7); } }
        .blurred { filter: blur(8px); user-select: none; }
        .pixel-border { image-rendering: pixelated; border: 3px solid #58a6ff; box-shadow: 0 0 0 1px #0d1117, 0 0 0 4px #58a6ff22; }
        .scanline { background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px); pointer-events: none; }
      `}</style>

      <div className="rc-card rounded-2xl p-6 relative overflow-hidden">
        {/* Scanlines overlay */}
        <div className="scanline absolute inset-0 z-0 rounded-2xl" />

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="pixel-font text-xs text-yellow-400 mb-1">🎮 ROLLERCOIN</div>
            <h2 className="pixel-font text-lg sm:text-xl text-white leading-tight">PROFIT CALCULATOR</h2>
            <div className="h-1 w-32 mx-auto mt-3 rounded" style={{ background: 'linear-gradient(90deg, #f7931a, #ff6b35)' }} />
          </div>

          {/* Coin selector */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {COINS.map(c => (
              <button
                key={c.id}
                onClick={() => { setCoin(c); setResults(null); setUnlocked(false); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${coin.id === c.id ? 'scale-110' : 'opacity-60 hover:opacity-90'}`}
                style={{
                  borderColor: c.color,
                  background: coin.id === c.id ? c.color + '33' : 'transparent',
                  color: c.color
                }}
              >
                {c.symbol}
              </button>
            ))}
          </div>

          {/* Inputs */}
          <div className="space-y-4 mb-6">
            {/* Network Power */}
            <div>
              <label className="block text-xs text-slate-400 mb-1 pixel-font" style={{ fontSize: '9px' }}>NETWORK POWER</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={networkPower}
                  onChange={e => setNetworkPower(e.target.value)}
                  placeholder="např. 500"
                  className="rc-input flex-1 rounded-lg px-3 py-2 text-sm"
                />
                <select
                  value={networkUnit}
                  onChange={e => setNetworkUnit(e.target.value)}
                  className="rc-input rounded-lg px-2 py-2 text-sm"
                >
                  {POWER_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            {/* Block Reward */}
            <div>
              <label className="block text-xs text-slate-400 mb-1 pixel-font" style={{ fontSize: '9px' }}>BLOCK REWARD ({coin.symbol})</label>
              <input
                type="number"
                value={blockReward}
                onChange={e => setBlockReward(e.target.value)}
                placeholder="např. 3.125"
                className="rc-input w-full rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* User Power */}
            <div>
              <label className="block text-xs text-slate-400 mb-1 pixel-font" style={{ fontSize: '9px' }}>TVŮJ VÝKON</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={userPower}
                  onChange={e => setUserPower(e.target.value)}
                  placeholder="např. 1000"
                  className="rc-input flex-1 rounded-lg px-3 py-2 text-sm"
                />
                <select
                  value={userUnit}
                  onChange={e => setUserUnit(e.target.value)}
                  className="rc-input rounded-lg px-2 py-2 text-sm"
                >
                  {POWER_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Calculate button */}
          <button
            onClick={calculate}
            className="rc-btn w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 mb-6"
          >
            <Calculator className="w-4 h-4" />
            SPOČÍTAT VÝDĚLEK
          </button>

          {/* Results */}
          {results && (
            <div className="relative">
              <div className="pixel-border rounded-xl overflow-hidden">
                <div className="bg-slate-900/80 px-4 py-2 flex items-center justify-between">
                  <span className="pixel-font text-slate-300" style={{ fontSize: '8px' }}>VÝSLEDKY ({coin.symbol})</span>
                  <span className="pixel-font text-blue-400" style={{ fontSize: '8px' }}>PODÍL: {results.sharePercent}%</span>
                </div>
                <div className={`divide-y divide-slate-800 ${!unlocked ? 'blurred' : ''}`}>
                  {rows.map((row, i) => (
                    <div key={i} className="flex justify-between items-center px-4 py-3">
                      <span className="text-slate-400 text-xs">{row.label}</span>
                      <span className="font-bold text-sm" style={{ color: coin.color }}>
                        {row.value} <span className="text-slate-500 text-xs">{coin.symbol}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Overlay + unlock button */}
              {!unlocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl" style={{ background: 'rgba(13,17,23,0.7)', backdropFilter: 'blur(2px)' }}>
                  <Lock className="w-8 h-8 text-yellow-400 mb-3" />
                  <p className="text-white font-bold text-sm text-center mb-4 px-4">Pro zobrazení výsledků klikni na tlačítko níže</p>
                  <button
                    onClick={handleUnlock}
                    className="unlock-btn flex items-center gap-2 px-6 py-3 rounded-xl text-white font-black text-sm"
                  >
                    <Unlock className="w-4 h-4" />
                    🔓 ODEMKNOUT VÝSLEDKY
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}