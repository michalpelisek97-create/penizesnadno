import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const WheelOfFortune = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleUnlock = () => {
    window.open(smartlinkUrl, '_blank');
    // Simuluj odemčení po kliknutí
    setTimeout(() => {
      localStorage.setItem('wheel_unlocked', 'true');
      setIsUnlocked(true);
    }, 1000);
  };

  const handleSpin = () => {
    if (!isUnlocked || isSpinning) return;

    setIsSpinning(true);
    const spinCount = 5 + Math.random() * 5; // 5-10 otáček
    const randomPrize = Math.floor(Math.random() * prizes.length);
    const finalRotation = spinCount * 360 + (randomPrize * 72); // 360 / 5 = 72 stupňů

    setRotation(finalRotation);
    setWinnerIndex(randomPrize);

    // Po animaci (3s) zobraz modal
    setTimeout(() => {
      setIsSpinning(false);
      setShowModal(true);
    }, 3000);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(var(--rotation)); }
        }

        .wheel-rotating {
          animation: spin 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>

      <div style={styles.wheelSection}>
        <h1 style={styles.title}>🎡 Kolo Štěstí</h1>
        <p style={styles.subtitle}>Odemkni a vyhraj skvělé bonusy!</p>

        {/* Kolo */}
        <div style={styles.wheelContainer}>
          <svg
            style={{
              ...styles.wheel,
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'none' : 'transform 0.3s ease-out'
            }}
            viewBox="0 0 400 400"
            width="300"
            height="300"
          >
            {prizes.map((prize, index) => {
              const angle = (index * 360) / prizes.length;
              const rad = (angle * Math.PI) / 180;

              return (
                <g key={index}>
                  {/* Slice */}
                  <path
                    d={`M 200 200 L ${200 + 180 * Math.cos(rad)} ${200 + 180 * Math.sin(rad)} A 180 180 0 0 1 ${200 + 180 * Math.cos(rad + (72 * Math.PI) / 180)} ${200 + 180 * Math.sin(rad + (72 * Math.PI) / 180)} Z`}
                    fill={prize.color}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  {/* Text */}
                  <text
                    x="200"
                    y="200"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${angle + 36} 200 200) translate(120, 0)`}
                    fill="#fff"
                    fontSize="14"
                    fontWeight="bold"
                    fontFamily="Arial, sans-serif"
                    textLength="100"
                  >
                    {prize.text}
                  </text>
                </g>
              );
            })}

            {/* Kruh uprostřed */}
            <circle cx="200" cy="200" r="40" fill="#fff" stroke="#f1c40f" strokeWidth="3" />
            <text
              x="200"
              y="200"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#2c3e50"
              fontSize="20"
              fontWeight="bold"
              fontFamily="Arial, sans-serif"
            >
              SPIN
            </text>
          </svg>

          {/* Ukazatel na vrcholu */}
          <div style={styles.pointer}></div>
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
                href={referralUrl}
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
    fontSize: '42px',
    fontWeight: 'bold',
    color: '#f1c40f',
    marginBottom: '10px',
    textShadow: '0 0 20px rgba(241, 196, 15, 0.5)'
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

  wheel: {
    filter: 'drop-shadow(0 0 20px rgba(241, 196, 15, 0.3))',
    transformOrigin: 'center center'
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

  // Modal styles
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
    boxShadow: '0 0 40px rgba(241, 196, 15, 0.4), 0 0 80px rgba(0, 212, 255, 0.2)',
    animation: 'slideIn 0.3s ease-out'
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