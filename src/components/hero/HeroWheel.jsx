import React from 'react';

export default function HeroWheel() {
  const scrollToWheel = () => {
    const element = document.querySelector('#kolo-stesti');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: 500, behavior: 'smooth' });
    }
  };

  return (
    <>
      <style>{`
        .hero-wheel-container {
          background: linear-gradient(135deg, rgba(243, 156, 18, 0.15) 0%, rgba(249, 115, 22, 0.1) 100%);
          border: 2px solid #f39c12;
          border-radius: 20px;
          padding: 40px 30px;
          margin-bottom: 30px;
          box-shadow: 0 8px 32px rgba(243, 156, 18, 0.15), inset 0 0 20px rgba(243, 156, 18, 0.05);
        }

        .hero-wheel-title {
          color: #f39c12;
          font-size: 2.2em;
          font-weight: bold;
          text-transform: uppercase;
          text-align: center;
          margin-bottom: 15px;
          letter-spacing: 1px;
          text-shadow: 0 2px 10px rgba(243, 156, 18, 0.3);
          font-family: 'Segoe UI', 'Inter', system-ui, sans-serif;
        }

        .hero-wheel-subtitle {
          color: white;
          font-size: 1.1em;
          text-align: center;
          margin-bottom: 25px;
          font-family: 'Segoe UI', 'Inter', system-ui, sans-serif;
          line-height: 1.5;
        }

        .hero-tip-box {
          background: linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(245, 158, 11, 0.15) 100%);
          border-left: 4px solid #f97316;
          border-radius: 12px;
          padding: 18px 20px;
          margin-bottom: 25px;
          background-color: rgba(255, 251, 235, 0.08);
          border: 1px solid rgba(249, 115, 22, 0.3);
        }

        .hero-tip-text {
          color: #fef3c7;
          font-size: 0.95em;
          line-height: 1.6;
          font-family: 'Segoe UI', 'Inter', system-ui, sans-serif;
        }

        .hero-cta-button {
          display: inline-block;
          width: 100%;
          max-width: 100%;
          background: linear-gradient(135deg, #f97316 0%, #f39c12 100%);
          color: white;
          padding: 18px 40px;
          font-size: 1.1em;
          font-weight: bold;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Segoe UI', 'Inter', system-ui, sans-serif;
          text-align: center;
          box-shadow: 0 8px 20px rgba(243, 156, 18, 0.4);
          position: relative;
          overflow: hidden;
        }

        .hero-cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: glow-shine 2s infinite;
        }

        .hero-cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(243, 156, 18, 0.6);
        }

        .hero-cta-button:active {
          transform: translateY(-1px);
        }

        @keyframes glow-shine {
          0% {
            left: -100%;
          }
          50% {
            left: 100%;
          }
          100% {
            left: 100%;
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 8px 20px rgba(243, 156, 18, 0.4);
          }
          50% {
            box-shadow: 0 8px 40px rgba(243, 156, 18, 0.8), 0 0 30px rgba(249, 115, 22, 0.6);
          }
        }

        .hero-cta-button {
          animation: pulse-glow 2.5s ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .hero-wheel-container {
            padding: 25px 20px;
            margin-bottom: 20px;
            border-radius: 15px;
          }

          .hero-wheel-title {
            font-size: 1.5em;
            margin-bottom: 12px;
          }

          .hero-wheel-subtitle {
            font-size: 0.95em;
            margin-bottom: 18px;
          }

          .hero-tip-box {
            padding: 15px 16px;
            margin-bottom: 18px;
            border-radius: 10px;
          }

          .hero-tip-text {
            font-size: 0.9em;
          }

          .hero-cta-button {
            padding: 15px 30px;
            font-size: 0.95em;
            border-radius: 15px;
          }
        }
      `}</style>

      <div className="hero-wheel-container" id="hero-wheel">
        <h1 className="hero-wheel-title">💵 PENÍZE RYCHLE A BEZ INVESTIC</h1>
        <p className="hero-wheel-subtitle">
          Vyzvedni si své bonusy: 3 000 Kč od bank a krypto hrou RollerCoin!
        </p>

        <div className="hero-tip-box">
          <p className="hero-tip-text">
            🔥 <strong>HORKÝ TIP:</strong> Než roztočíš kolo, přečti si naše prověřené návody dole. Lidé, kteří je četli, vybrali v průměru o 1 500 Kč více!
          </p>
        </div>

        <button className="hero-cta-button" onClick={scrollToWheel}>
          🎡 ROZTOČIT KOLO ŠTĚSTÍ
        </button>
      </div>
    </>
  );
}