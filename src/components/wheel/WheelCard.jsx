import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

const encodedLinks = [
  'aHR0cHM6Ly9nLmNiLmNsaWNrL0htQXJ4aA==',
  'aHR0cHM6Ly93d3cuYWlyYmFuay5jei9wb3p2YW5pLXByYXRlbD9yZWZlcnJlcj01MmF3eXg=',
  'aHR0cHM6Ly9yb2xsZXJjb2luLmNvbS8/cj1rczVyYmR2Mg==',
  'aHR0cHM6Ly9qb2luLmhvbmV5Z2Fpbi5jb20vUEVMSVMwMDdCNQ==',
  'aHR0cHM6Ly9vbmIucmIuY3ovb25iLXdlYj9tZ209TjBGbng='
];

const prizes = [
  { text: '🪙 CTpool', symbol: '🪙', fullName: 'Bonus CTpool', color: '#2c3e50' },
  { text: '🏦 AirBank', symbol: '🏦', fullName: 'AirBank Bonus', color: '#f1c40f' },
  { text: '⛏️ RollerCoin', symbol: '⛏️', fullName: 'Těžba RollerCoin', color: '#00d4ff' },
  { text: '🍯 HoneyGain', symbol: '🍯', fullName: 'HoneyGain Credit', color: '#2c3e50' },
  { text: '💳 Raiffeisen', symbol: '💳', fullName: 'RB Odměna', color: '#f1c40f' }
];

const smartlinkUrl = 'https://www.effectivegatecpm.com/whifkrp4te?key=06123d4024c40ca03236d07ac020b0c6';

function drawWheel(canvas, rotation) {
  const dpr = window.devicePixelRatio || 1;
  const displaySize = canvas.offsetWidth || 160;

  if (canvas.width !== displaySize * dpr) {
    canvas.width = displaySize * dpr;
    canvas.height = displaySize * dpr;
  }

  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  const center = size / 2;
  const radius = center - 4 * dpr;

  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.translate(center, center);
  ctx.rotate((rotation * Math.PI) / 180);

  prizes.forEach((prize, index) => {
    const sliceAngle = (2 * Math.PI) / prizes.length;
    const startAngle = index * sliceAngle;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = prize.color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2 * dpr;
    ctx.stroke();

    ctx.save();
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.round(size * 0.09)}px Arial`;
    ctx.fillText(prize.symbol, radius - 8 * dpr, 6 * dpr);
    ctx.restore();
  });

  // Center circle
  const centerR = size * 0.13;
  ctx.beginPath();
  ctx.arc(0, 0, centerR, 0, 2 * Math.PI);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.strokeStyle = '#f1c40f';
  ctx.lineWidth = 3 * dpr;
  ctx.stroke();

  ctx.fillStyle = '#2c3e50';
  ctx.font = `bold ${Math.round(size * 0.08)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SPIN', 0, 0);

  ctx.restore();
}

export default function WheelCard() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const canvasRef = useRef(null);
  const rotationRef = useRef(0);
  const rafRef = useRef(null);

  const redraw = useCallback(() => {
    if (canvasRef.current) {
      drawWheel(canvasRef.current, rotationRef.current);
    }
  }, []);

  useEffect(() => {
    redraw();
    const observer = new ResizeObserver(redraw);
    if (canvasRef.current) observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, [redraw]);

  const handleUnlock = () => {
    window.open(smartlinkUrl, '_blank');
    setTimeout(() => setIsUnlocked(true), 1000);
  };

  const decodeLink = (encoded, index) => {
    if (index === 4) return 'https://onb.rb.cz/onb-web?mgm=N0Fnxi';
    try { return atob(encoded); } catch { return ''; }
  };

  const handleSpin = () => {
    if (!isUnlocked || isSpinning) return;
    setIsSpinning(true);

    const spinCount = 5 + Math.random() * 5;
    const randomPrize = Math.floor(Math.random() * prizes.length);
    const finalRotation = rotationRef.current + spinCount * 360 + (randomPrize * 72);
    const startRotation = rotationRef.current;
    const startTime = performance.now();
    const duration = 3000;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 0.25 * progress - 1.25 * progress ** 2 + 2 * progress ** 3;
      rotationRef.current = startRotation + ease * (finalRotation - startRotation);
      redraw();

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        rotationRef.current = finalRotation;
        redraw();
        setWinnerIndex(randomPrize);
        setIsSpinning(false);
        setShowModal(true);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const closeModal = () => {
    setShowModal(false);
    setIsUnlocked(false);
  };

  return (
    <>
      <div className="group relative">
        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 to-indigo-900 flex flex-col items-center justify-center"
            style={{ aspectRatio: '1 / 1', maxHeight: '200px' }}
          >
            {/* Pointer */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10"
              style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '14px solid #f1c40f', filter: 'drop-shadow(0 0 6px rgba(241,196,15,0.8))' }}
            />
            <canvas
              ref={canvasRef}
              style={{ width: '100%', height: '100%', display: 'block' }}
            />
            {/* Locked overlay */}
            {!isUnlocked && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-3xl">🔒</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            <p className="text-lg font-semibold text-white mb-2 line-clamp-1">🎡 Kolo Štěstí</p>
            <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">Odemkni a vyhraj skvělé bonusy! CTpool, AirBank, RollerCoin a další.</p>

            {!isUnlocked ? (
              <button
                onClick={handleUnlock}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm font-bold uppercase tracking-wide"
              >
                🔓 Odemknout kolo
              </button>
            ) : (
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-90 text-slate-900 font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm uppercase tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSpinning ? '⏳ Točím...' : '🎯 Roztočit kolo'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-sm w-full relative border-2 border-yellow-400"
            style={{ boxShadow: '0 0 40px rgba(241,196,15,0.4)' }}
            onClick={e => e.stopPropagation()}
          >
            <button className="absolute top-3 right-3 text-yellow-400 hover:text-yellow-200" onClick={closeModal}>
              <X size={24} />
            </button>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-yellow-400 mb-3">🎉 Gratulujeme!</h2>
              <p className="text-cyan-400 text-lg mb-4">Vyhrál jsi:</p>
              <div className="text-2xl font-bold text-yellow-400 bg-yellow-400/10 border-2 border-yellow-400 rounded-xl p-4 mb-5">
                {prizes[winnerIndex]?.fullName}
              </div>
              <p className="text-slate-300 text-sm mb-6">Klikni níže a vyzvedni si odměnu!</p>
              <a
                href={decodeLink(encodedLinks[winnerIndex], winnerIndex)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold py-3 px-8 rounded-full shadow-lg text-sm uppercase tracking-wide"
              >
                💰 Vyzvednout odměnu
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}