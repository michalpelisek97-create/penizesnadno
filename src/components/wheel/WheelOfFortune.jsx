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
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 300;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save state
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    // Draw slices
    prizes.forEach((prize, index) => {
      const sliceAngle = (360 / prizes.length) * (Math.PI / 180);
      const startAngle = (index * 360) / prizes.length * (Math.PI / 180);

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = prize.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text/emoji
      ctx.save();
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 32px Arial';
      ctx.fillText(prize.text, radius - 40, 12);
      ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(0, 0, 80, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Draw SPIN text
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 40px Arial';
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
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 flex flex-col h-full">
      <h2 className="text-xl font-semibold text-white mb-2">🎡 Kolo Štěstí</h2>
      <p className="text-sm text-slate-400 mb-4">Odemkni a vyhraj kredity!</p>

      {/* Kolo */}
      <div className="flex justify-center mb-4 relative">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10"
          style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '14px solid #f1c40f', filter: 'drop-shadow(0 0 6px rgba(241,196,15,0.8))' }}
        />
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          style={{ maxWidth: '100%', filter: 'drop-shadow(0 0 10px rgba(241,196,15,0.3))' }}
        />
      </div>

      {/* Login check */}
      {!user && (
        <p className="text-xs text-blue-300 text-center mb-4">Přihlaste se pro účast</p>
      )}

      {/* Tlačítka */}
      <div className="flex justify-center">
        {!user ? (
          <p className="text-xs text-blue-300">Přihlašte se</p>
        ) : !isUnlocked ? (
          <button onClick={handleAdClick} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-medium py-2 rounded-lg text-xs font-bold uppercase">
            🔓 Odemknout
          </button>
        ) : (
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-90 text-slate-900 font-bold py-2 rounded-lg text-xs uppercase disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSpinning ? '⏳ Točím...' : '🎯 Spin'}
          </button>
        )}
      </div>
    </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={closeModal}>
              <X size={24} />
            </button>

            <div style={styles.modalContent}>
              <h2 style={styles.modalTitle}>🎉 Gratulujeme!</h2>
              <p style={styles.modalText}>Vyhrál jsi:</p>
              <div style={styles.prizeDisplay}>
                {prizes[winnerIndex]?.fullName}
                {earnedPoints > 0 && <div style={{fontSize: '24px', marginTop: '10px'}}>+{earnedPoints} kreditů</div>}
              </div>
              <p style={styles.modalDescription}>
                {earnedPoints === 0 ? 'Zkus to znovu!' : 'Kredity byly přidány do tvého účtu!'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },

  wheelSection: {
    textAlign: 'center',
    maxWidth: '600px',
    width: '100%'
  },

  title: {
    fontSize: '84px',
    fontWeight: 'bold',
    color: '#ff0000',
    marginBottom: '10px',
    textShadow: '0 0 20px rgba(255, 0, 0, 0.6)'
  },

  subtitle: {
    fontSize: '18px',
    color: '#00d4ff',
    marginBottom: '30px',
    textShadow: '0 0 10px rgba(0, 212, 255, 0.3)'
  },

  wheelContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '40px',
    filter: 'drop-shadow(0 0 30px rgba(0, 212, 255, 0.4))'
  },

  canvas: {
    filter: 'drop-shadow(0 0 20px rgba(241, 196, 15, 0.3))',
    maxWidth: '100%'
  },

  pointer: {
    position: 'absolute',
    top: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '0',
    height: '0',
    borderLeft: '15px solid transparent',
    borderRight: '15px solid transparent',
    borderTop: '25px solid #f1c40f',
    filter: 'drop-shadow(0 0 10px rgba(241, 196, 15, 0.8))',
    zIndex: 10
  },

  buttonContainer: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },

  unlockButton: {
    padding: '16px 40px',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '50px',
    background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
    color: '#fff',
    cursor: 'pointer',
    boxShadow: '0 0 20px rgba(0, 212, 255, 0.6)',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },

  spinButton: {
    padding: '16px 40px',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '50px',
    background: 'linear-gradient(135deg, #f1c40f, #ffaa00)',
    color: '#2c3e50',
    cursor: 'pointer',
    boxShadow: '0 0 20px rgba(241, 196, 15, 0.6)',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },

  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },

  modal: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: '20px',
    padding: '40px 30px',
    maxWidth: '400px',
    width: '100%',
    position: 'relative',
    border: '2px solid #f1c40f',
    boxShadow: '0 0 40px rgba(241, 196, 15, 0.4), 0 0 80px rgba(0, 212, 255, 0.2)'
  },

  closeButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'none',
    border: 'none',
    color: '#f1c40f',
    cursor: 'pointer',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  modalContent: {
    textAlign: 'center'
  },

  modalTitle: {
    fontSize: '32px',
    color: '#f1c40f',
    marginBottom: '15px',
    textShadow: '0 0 10px rgba(241, 196, 15, 0.5)'
  },

  modalText: {
    fontSize: '18px',
    color: '#00d4ff',
    marginBottom: '20px'
  },

  prizeDisplay: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#f1c40f',
    background: 'rgba(241, 196, 15, 0.1)',
    padding: '20px',
    borderRadius: '10px',
    border: '2px solid #f1c40f',
    marginBottom: '25px',
    textShadow: '0 0 10px rgba(241, 196, 15, 0.6)'
  },

  modalDescription: {
    fontSize: '14px',
    color: '#cbd5e1',
    marginBottom: '25px',
    lineHeight: '1.6'
  },

  claimButton: {
    display: 'inline-block',
    padding: '14px 35px',
    fontSize: '15px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '50px',
    background: 'linear-gradient(135deg, #f1c40f, #ffaa00)',
    color: '#2c3e50',
    textDecoration: 'none',
    cursor: 'pointer',
    boxShadow: '0 0 20px rgba(241, 196, 15, 0.6)',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  }
};

export default WheelOfFortune;