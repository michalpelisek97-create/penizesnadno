import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const WheelOfFortune = () => {
  const [user, setUser] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const canvasRef = useRef(null);

  // Ověření přihlášení
  useEffect(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => setUser(null));
  }, []);

  const prizes = [
    { text: '🎯 Nic', fullName: 'Zkus to znovu', points: 0, color: '#95a5a6' },
    { text: '⭐ 5 kreditů', fullName: 'Malá výhra', points: 5, color: '#3498db' },
    { text: '✨ 7 kreditů', fullName: 'Malá výhra', points: 7, color: '#9b59b6' },
    { text: '💎 10 kreditů', fullName: 'Střední výhra', points: 10, color: '#e74c3c' },
    { text: '👑 50 kreditů', fullName: 'Velká výhra', points: 50, color: '#f39c12' },
    { text: '🏆 1000 kreditů', fullName: 'JACKPOT!', points: 1000, color: '#f1c40f' }
  ];

  const adUrl = 'https://www.effectivegatecpm.com/ij547nkxe?key=8b2ae4a3228e917760d4cc1d37ea46f6';

  // Kreslení kola na canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 4;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Save state
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    // Draw slices
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
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${size * 0.07}px Arial`;
      ctx.fillText(prize.text, radius - 8, 6);
      ctx.restore();
    });

    // Draw center circle
    const centerR = size * 0.13;
    ctx.beginPath();
    ctx.arc(0, 0, centerR, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw SPIN text
    ctx.fillStyle = '#2c3e50';
    ctx.font = `bold ${size * 0.07}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN', 0, 0);

    ctx.restore();
  }, [rotation]);

  const handleAdClick = () => {
    window.open(adUrl, '_blank');
    setTimeout(() => {
      setIsUnlocked(true);
    }, 500);
  };

  const getWeightedPrizeIndex = () => {
    const rand = Math.random() * 100;
    if (rand < 50) return 0; // 50% - Nic
    if (rand < 90) return 1; // 40% - 5 bodů
    if (rand < 120) return 2; // 30% - 7 bodů
    if (rand < 129) return 3; // 9% - 10 bodů
    if (rand < 134) return 4; // 5% - 50 bodů
    return 5; // 1% - 1000 bodů
  };

  const handleSpin = () => {
    if (!isUnlocked || isSpinning) return;

    setIsSpinning(true);
    const spinCount = 5 + Math.random() * 5;
    const randomPrize = getWeightedPrizeIndex();
    const finalRotation = spinCount * 360 + (randomPrize * 60);

    // Animate rotation
    let currentRotation = 0;
    const startTime = Date.now();
    const duration = 3000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 0.25 * progress - 1.25 * progress ** 2 + 2 * progress ** 3;
      currentRotation = easeProgress * finalRotation;
      setRotation(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setRotation(finalRotation);
        setWinnerIndex(randomPrize);
        setEarnedPoints(prizes[randomPrize].points);
        setIsSpinning(false);
        setShowModal(true);
        
        // Přidat kredity uživateli
        if (user && prizes[randomPrize].points > 0) {
          base44.entities.UserCredits.filter({email: user.email})
            .then(existing => {
              const newBalance = (existing[0]?.balance || 0) + prizes[randomPrize].points;
              const newEarned = (existing[0]?.total_earned || 0) + prizes[randomPrize].points;
              
              if (existing.length > 0) {
                base44.entities.UserCredits.update(existing[0].id, {
                  balance: newBalance,
                  total_earned: newEarned
                });
              } else {
                base44.entities.UserCredits.create({
                  email: user.email,
                  balance: prizes[randomPrize].points,
                  total_earned: prizes[randomPrize].points
                });
              }
            });
        }
      }
    };

    requestAnimationFrame(animate);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsUnlocked(false);
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      {/* Header */}
      <div className="relative flex-1 overflow-hidden bg-gradient-to-br from-purple-900 to-indigo-900 flex flex-col items-center justify-center min-h-40">
        {/* Pointer */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10"
          style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '14px solid #f1c40f', filter: 'drop-shadow(0 0 6px rgba(241,196,15,0.8))' }}
        />
        <canvas
          ref={canvasRef}
          width={160}
          height={160}
          className="w-40 h-40"
          style={{ filter: 'drop-shadow(0 0 10px rgba(241,196,15,0.3))' }}
        />
        {/* Locked overlay */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-3xl">🔒</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col">
        <p className="text-lg font-semibold text-white mb-2 line-clamp-1">🎡 Kolo Štěstí</p>
        <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">Odemkni a vyhraj skvělé bonusy!</p>

        {!user ? (
          <p className="text-center text-sm text-cyan-400">Přihlašte se pro účast</p>
        ) : !isUnlocked ? (
          <button
            onClick={handleAdClick}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm font-bold uppercase tracking-wide"
          >
            🔓 Odemknout
          </button>
        ) : (
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-90 text-slate-900 font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm uppercase tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSpinning ? '⏳ Točím...' : '🎯 Roztočit'}
          </button>
        )}
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
                {earnedPoints > 0 && <div className="text-base mt-2">+{earnedPoints} kreditů</div>}
              </div>
              <p className="text-slate-300 text-sm">
                {earnedPoints === 0 ? 'Zkus to znovu!' : 'Kredity byly přidány do tvého účtu!'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WheelOfFortune;