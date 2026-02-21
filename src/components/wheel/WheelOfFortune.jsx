import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const WheelOfFortune = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef(null);

  // Base64 zakódované referral linky
  const encodedLinks = [
    'aHR0cHM6Ly9nLmNiLmNsaWNrL0htQXJ4aA==', // Coinbase
    'aHR0cHM6Ly93d3cuYWlyYmFuay5jei9wb3p2YW5pLXByYXRlbD9yZWZlcnJlcj01MmF3eXg=', // AirBank
    'aHR0cHM6Ly9yb2xsZXJjb2luLmNvbS8/cj1rczVyYmR2Mg==', // RollerCoin
    'aHR0cHM6Ly9qb2luLmhvbmV5Z2Fpbi5jb20vUEVMSVMwMDdCNQ==', // HoneyGain
    'aHR0cHM6Ly9vbmIucmIuY3ovb25iLXdlYj9tZ209TjBGbng=' // RB
  ];

  const prizes = [
    { text: 'Bonus Coinbase', color: '#2c3e50' },
    { text: 'AirBank Bonus', color: '#f1c40f' },
    { text: 'Těžba RollerCoin', color: '#00d4ff' },
    { text: 'HoneyGain Credit', color: '#2c3e50' },
    { text: 'RB Odměna', color: '#f1c40f' }
  ];

  const smartlinkUrl = 'https://www.effectivegatecpm.com/whifkrp4te?key=06123d4024c40ca03236d07ac020b0c6';

  // Zkontroluj localStorage při loadování
  useEffect(() => {
    const unlocked = localStorage.getItem('wheel_unlocked');
    if (unlocked) {
      setIsUnlocked(true);
    }
  }, []);

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

      // Draw text
      ctx.save();
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(prize.text, radius - 30, 5);
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

  const handleUnlock = () => {
    window.open(smartlinkUrl, '_blank');
    setTimeout(() => {
      localStorage.setItem('wheel_unlocked', 'true');
      setIsUnlocked(true);
    }, 1000);
  };

  const decodeLink = (encoded) => {
    try {
      return atob(encoded);
    } catch (e) {
      return '';
    }
  };

  const handleSpin = () => {
    if (!isUnlocked || isSpinning) return;

    setIsSpinning(true);
    const spinCount = 5 + Math.random() * 5;
    const randomPrize = Math.floor(Math.random() * prizes.length);
    const finalRotation = spinCount * 360 + (randomPrize * 72);

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
        setIsSpinning(false);
        setShowModal(true);
      }
    };

    requestAnimationFrame(animate);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsUnlocked(false);
    localStorage.removeItem('wheel_unlocked');
  };

  return (
    <div style={styles.container}>
      <div style={styles.wheelSection}>
        <h1 style={styles.title}>🎡 Kolo Štěstí</h1>
        <p style={styles.subtitle}>Odemkni a vyhraj skvělé bonusy!</p>

        {/* Kolo */}
        <div style={styles.wheelContainer}>
          <div style={styles.pointer}></div>
          <canvas
            ref={canvasRef}
            width={640}
            height={640}
            style={styles.canvas}
          />
        </div>

        {/* Tlačítka */}
        <div style={styles.buttonContainer}>
          {!isUnlocked ? (
            <button style={styles.unlockButton} onClick={handleUnlock}>
              🔓 ODEMKNOUT KOLO
            </button>
          ) : (
            <button
              style={{
                ...styles.spinButton,
                opacity: isSpinning ? 0.7 : 1,
                cursor: isSpinning ? 'not-allowed' : 'pointer'
              }}
              onClick={handleSpin}
              disabled={isSpinning}
            >
              {isSpinning ? '⏳ TOČENÍ...' : '🎯 ROZTOČIT KOLO'}
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
              <div style={styles.prizeDisplay}>{prizes[winnerIndex]?.text}</div>
              <p style={styles.modalDescription}>
                Klikni na tlačítko níže a vyzvedni si svou odměnu!
              </p>

              <a
                href={decodeLink(encodedLinks[winnerIndex])}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.claimButton}
              >
                💰 VYZVEDNOUT ODMĚNU
              </a>
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