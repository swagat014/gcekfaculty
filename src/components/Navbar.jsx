const Navbar = () => {
  const handleBackToWebsite = () => {
    window.location.href = "https://gcekbpatna.ac.in/";
  };

  const handleFeedback = () => {
    window.location.href = "/feedback";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');

        .nb-root {
          font-family: 'DM Sans', sans-serif;
          position: sticky;
          top: 0;
          z-index: 1000;
          background: linear-gradient(135deg, #7e0000 0%, #9a0000 45%, #8b0000 100%);
          box-shadow: 0 4px 24px rgba(126, 0, 0, 0.45);
        }

        /* Subtle noise texture overlay */
        .nb-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
        }

        /* White accent line top */
        .nb-top-line {
          height: 3px;
          background: linear-gradient(90deg, transparent 0%, #ffffff 20%, #ffffff 50%, #ffffff 80%, transparent 100%);
        }

        .nb-inner {
          position: relative;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          height: 150px;
        }
        
        /* Large Desktop */
        @media (min-width: 1440px) {
          .nb-inner { padding: 0 32px; height: 170px; gap: 24px; }
        }
        
        /* Desktop */
        @media (min-width: 1024px) and (max-width: 1439px) {
          .nb-inner { height: 160px; padding: 0 28px; }
        }
        
        /* Tablet Landscape */
        @media (min-width: 768px) and (max-width: 1023px) {
          .nb-inner { height: 140px; padding: 0 20px; gap: 16px; }
        }
        
        /* Tablet Portrait */
        @media (min-width: 641px) and (max-width: 767px) {
          .nb-inner { height: 130px; padding: 0 18px; gap: 14px; }
        }
        
        /* Mobile Landscape */
        @media (max-width: 640px) {
          .nb-inner { height: 110px; gap: 10px; padding: 0 14px; }
        }
        
        /* Small Mobile */
        @media (max-width: 480px) {
          .nb-inner { height: 100px; gap: 8px; padding: 0 12px; }
        }
        
        /* Extra Small Mobile */
        @media (max-width: 360px) {
          .nb-inner { height: 90px; gap: 6px; padding: 0 10px; }
        }

        /* Logo */
        .nb-logo-wrap {
          flex-shrink: 0;
          position: relative;
        }
        .nb-logo-ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1.5px solid rgba(255, 255, 255, 0.35);
        }
        .nb-logo {
          display: block;
          width: 100px;
          height: 100px;
          object-fit: contain;
          border-radius: 50%;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
          cursor: pointer;
          position: relative;
          z-index: 1;
        }
        .nb-logo:hover { transform: scale(1.08) rotate(-2deg); }
        
        /* Large Desktop */
        @media (min-width: 1440px) {
          .nb-logo { width: 130px; height: 130px; }
        }
        
        /* Desktop */
        @media (min-width: 1024px) and (max-width: 1439px) {
          .nb-logo { width: 120px; height: 120px; }
        }
        
        /* Tablet */
        @media (max-width: 1023px) {
          .nb-logo { width: 90px; height: 90px; }
        }
        
        /* Mobile Landscape */
        @media (max-width: 640px) {
          .nb-logo { width: 70px; height: 70px; }
        }
        
        /* Small Mobile */
        @media (max-width: 480px) {
          .nb-logo { width: 60px; height: 60px; }
        }
        
        /* Extra Small Mobile */
        @media (max-width: 360px) {
          .nb-logo { width: 50px; height: 50px; }
        }

        /* Divider */
        .nb-divider {
          width: 1px;
          height: 56px;
          background: linear-gradient(180deg, transparent, rgba(255,255,255,0.4), transparent);
          flex-shrink: 0;
        }
        
        /* Desktop */
        @media (min-width: 1024px) {
          .nb-divider { height: 64px; }
        }
        
        /* Tablet */
        @media (max-width: 1023px) {
          .nb-divider { height: 48px; }
        }
        
        /* Mobile Landscape */
        @media (max-width: 640px) {
          .nb-divider { height: 40px; }
        }
        
        /* Small Mobile - Hide dividers */
        @media (max-width: 480px) { 
          .nb-divider { display: none; } 
        }

        /* Text Center */
        .nb-center {
          flex: 1;
          min-width: 0;
          text-align: center;
        }
        .nb-college-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.4rem, 3vw, 2.4rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.25;
          margin-bottom: 6px;
          letter-spacing: 0.01em;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        /* Tablet */
        @media (max-width: 1023px) {
          .nb-college-name { font-size: clamp(1.2rem, 2.5vw, 1.8rem); }
        }
        
        /* Mobile Landscape */
        @media (max-width: 640px) {
          .nb-college-name { font-size: 1.1rem; white-space: normal; line-height: 1.2; margin-bottom: 4px; }
        }
        
        /* Small Mobile */
        @media (max-width: 480px) {
          .nb-college-name { font-size: 1rem; }
        }
        
        /* Extra Small Mobile */
        @media (max-width: 360px) {
          .nb-college-name { font-size: 0.9rem; }
        }

        .nb-affiliation {
          font-size: clamp(0.75rem, 1.3vw, 1.1rem);
          font-weight: 500;
          color: rgba(255, 255, 255, 0.85);
          letter-spacing: 0.03em;
          line-height: 1.3;
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        /* Tablet */
        @media (max-width: 1023px) {
          .nb-affiliation { font-size: clamp(0.65rem, 1vw, 0.85rem); }
        }
        
        /* Mobile Landscape */
        @media (max-width: 640px) {
          .nb-affiliation { font-size: 0.65rem; white-space: normal; text-overflow: clip; }
        }
        
        /* Small Mobile */
        @media (max-width: 480px) {
          .nb-affiliation { font-size: 0.6rem; margin-bottom: 4px; }
        }
        
        /* Extra Small Mobile */
        @media (max-width: 360px) {
          .nb-affiliation { font-size: 0.55rem; }
        }

        .nb-odia {
          font-size: clamp(1.2rem, 1.8vw, 2rem);
          color: rgba(255,255,255,0.65);
          font-weight: 400;
          letter-spacing: 0.01em;
          line-height: 1.3;
        }
        
        /* Tablet */
        @media (max-width: 1023px) {
          .nb-odia { font-size: clamp(1rem, 1.5vw, 1.6rem); }
        }
        
        /* Mobile Landscape */
        @media (max-width: 640px) {
          .nb-odia { font-size: 0.95rem; }
        }
        
        /* Small Mobile */
        @media (max-width: 480px) {
          .nb-odia { font-size: 0.85rem; }
        }
        
        /* Extra Small Mobile */
        @media (max-width: 360px) {
          .nb-odia { display: none; }
        }

        /* White dot separator */
        .nb-dot-sep {
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #ffffff;
          vertical-align: middle;
          margin: 0 6px;
          opacity: 0.7;
        }

        /* Back button */
        .nb-back-btn {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.15);
          border: 1.5px solid rgba(255, 255, 255, 0.6);
          color: #ffffff;
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(0.7rem, 1vw, 0.85rem);
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 9px 18px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
          backdrop-filter: blur(4px);
        }
        
        /* Desktop */
        @media (min-width: 1024px) {
          .nb-back-btn { padding: 10px 20px; font-size: 0.85rem; gap: 8px; }
        }
        
        /* Tablet */
        @media (max-width: 1023px) {
          .nb-back-btn { padding: 8px 14px; font-size: 0.75rem; gap: 6px; }
        }
        
        /* Mobile Landscape */
        @media (max-width: 640px) {
          .nb-back-btn { padding: 7px 12px; font-size: 0.7rem; gap: 5px; }
        }
        
        /* Small Mobile */
        @media (max-width: 480px) {
          .nb-back-btn { padding: 6px 10px; font-size: 0.65rem; gap: 4px; }
        }
        
        /* Extra Small Mobile */
        @media (max-width: 360px) {
          .nb-back-btn { padding: 5px 8px; font-size: 0.6rem; gap: 3px; }
        }
        .nb-back-btn:hover {
          background: #ffffff;
          border-color: #ffffff;
          color: #7e0000;
          box-shadow: 0 4px 16px rgba(255, 255, 255, 0.4);
          transform: translateY(-1px);
        }
        .nb-back-btn:active { transform: scale(0.97); }
        .nb-back-icon {
          display: inline-block;
          transition: transform 0.25s ease;
          font-size: 1rem;
          line-height: 1;
        }
        
        /* Desktop */
        @media (min-width: 1024px) {
          .nb-back-icon { font-size: 1.1rem; }
        }
        
        /* Mobile */
        @media (max-width: 640px) {
          .nb-back-icon { font-size: 0.9rem; }
        }
        
        /* Small Mobile */
        @media (max-width: 480px) {
          .nb-back-icon { font-size: 0.8rem; }
        }
        .nb-back-btn:hover .nb-back-icon { transform: translateX(-3px); }
        .nb-back-text-short { display: none; }
        
        /* Mobile - Show short text */
        @media (max-width: 520px) {
          .nb-back-text-long { display: none; }
          .nb-back-text-short { display: inline; }
        }

        /* Feedback button */
        .nb-feedback-btn {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
          border: 1.5px solid rgba(255, 255, 255, 0.8);
          color: #7e0000;
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(0.7rem, 1vw, 0.85rem);
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 9px 18px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
          backdrop-filter: blur(4px);
          margin-left: 12px;
        }
        
        /* Desktop */
        @media (min-width: 1024px) {
          .nb-feedback-btn { padding: 10px 20px; font-size: 0.85rem; gap: 8px; margin-left: 12px; }
        }
        
        /* Tablet */
        @media (max-width: 1023px) {
          .nb-feedback-btn { padding: 8px 14px; font-size: 0.75rem; gap: 6px; margin-left: 10px; }
        }
        
        /* Mobile Landscape */
        @media (max-width: 640px) {
          .nb-feedback-btn { padding: 7px 12px; font-size: 0.7rem; gap: 5px; margin-left: 8px; }
        }
        
        /* Small Mobile */
        @media (max-width: 480px) {
          .nb-feedback-btn { padding: 6px 10px; font-size: 0.65rem; gap: 4px; margin-left: 6px; }
        }
        
        /* Extra Small Mobile */
        @media (max-width: 360px) {
          .nb-feedback-btn { padding: 5px 8px; font-size: 0.6rem; gap: 3px; margin-left: 4px; }
        }
        .nb-feedback-btn:hover {
          background: linear-gradient(135deg, #7e0000 0%, #9a0000 100%);
          border-color: #7e0000;
          color: #ffffff;
          box-shadow: 0 4px 16px rgba(126, 0, 0, 0.4);
          transform: translateY(-1px);
        }
        .nb-feedback-btn:active { transform: scale(0.97); }
        .nb-feedback-icon {
          display: inline-block;
          transition: transform 0.25s ease;
          font-size: 1rem;
          line-height: 1;
        }
        
        /* Desktop */
        @media (min-width: 1024px) {
          .nb-feedback-icon { font-size: 1.1rem; }
        }
        
        /* Mobile */
        @media (max-width: 640px) {
          .nb-feedback-icon { font-size: 0.9rem; }
        }
        
        /* Small Mobile */
        @media (max-width: 480px) {
          .nb-feedback-icon { font-size: 0.8rem; }
        }
        .nb-feedback-btn:hover .nb-feedback-icon { transform: rotate(15deg) scale(1.1); }
        .nb-feedback-text-short { display: none; }
        
        /* Mobile - Show short text */
        @media (max-width: 520px) {
          .nb-feedback-text-long { display: none; }
          .nb-feedback-text-short { display: inline; }
        }

        /* Button group container */
        .nb-button-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        
        /* Mobile */
        @media (max-width: 640px) {
          .nb-button-group { gap: 6px; }
        }
        
        /* Small Mobile */
        @media (max-width: 480px) {
          .nb-button-group { gap: 4px; }
        }

        /* Bottom white shimmer line */
        .nb-bottom-line {
          height: 1.5px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.6) 70%, transparent 100%);
        }
      `}</style>

      <nav className="nb-root">
        <div className="nb-top-line" />

        <div className="nb-inner">
          {/* Logo */}
          <div className="nb-logo-wrap">
            {/* <div className="nb-logo-ring" /> */}
            <img
              src="/logo.png"
              alt="GCEK Logo"
              className="nb-logo"
              onClick={() => window.location.href = "/"}
            />
          </div>

          <div className="nb-divider" />

          {/* Center Text */}
          <div className="nb-center">
            <div className="nb-college-name">
              Government College of Engineering, Kalahandi
            </div>
            <div className="nb-odia">
              ସରକାରୀ ଯାନ୍ତ୍ରିକ ମହାବିଦ୍ୟାଳୟ, କଳାହାଣ୍ଡି
            </div>
            <div className="nb-affiliation">
              (An Affiliated Institute Of BIJU PATNAIK UNIVERSITY OF TECHNOLOGY, ODISHA)
            </div>
          </div>

          <div className="nb-divider" />

          {/* Button Group */}
          <div className="nb-button-group">
            {/* Back Button */}
            <button className="nb-back-btn" onClick={handleBackToWebsite}>
              <span className="nb-back-icon">←</span>
              <span className="nb-back-text-long">Back to Website</span>
              <span className="nb-back-text-short">Back</span>
            </button>
          </div>
        </div>

        <div className="nb-bottom-line" />
      </nav>
    </>
  );
};

export default Navbar;