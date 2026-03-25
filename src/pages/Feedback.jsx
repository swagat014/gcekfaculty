import Navbar from '../components/Navbar';
import { feedbackFormURLs } from '../data/facultyData';

const Feedback = () => {
  const handleOpenForm = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

        .fb-root {
          font-family: 'DM Sans', sans-serif;
          background: linear-gradient(135deg, #fef5f5 0%, #fff5f5 100%);
          position: relative;
          overflow-x: hidden;
        }

        /* Subtle noise texture overlay */
        .fb-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
        }

        .fb-container {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 24px;
        }

        /* Large Desktop */
        @media (min-width: 1440px) {
          .fb-container { padding: 64px 32px; }
        }

        /* Desktop */
        @media (min-width: 1024px) and (max-width: 1439px) {
          .fb-container { padding: 56px 28px; }
        }

        /* Tablet Landscape */
        @media (min-width: 768px) and (max-width: 1023px) {
          .fb-container { padding: 40px 20px; }
        }

        /* Tablet Portrait */
        @media (min-width: 641px) and (max-width: 767px) {
          .fb-container { padding: 32px 18px; }
        }

        /* Mobile Landscape */
        @media (max-width: 640px) {
          .fb-container { padding: 24px 14px; }
        }

        /* Small Mobile */
        @media (max-width: 480px) {
          .fb-container { padding: 20px 12px; }
        }

        /* Extra Small Mobile */
        @media (max-width: 360px) {
          .fb-container { padding: 16px 10px; }
        }

        .fb-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 700;
          color: #7e0000;
          text-align: center;
          margin-bottom: 12px;
          letter-spacing: 0.01em;
          text-shadow: 0 2px 12px rgba(126, 0, 0, 0.15);
        }

        .fb-subtitle {
          font-size: clamp(0.95rem, 1.5vw, 1.2rem);
          font-weight: 500;
          color: #5a0000;
          text-align: center;
          margin-bottom: 48px;
          line-height: 1.6;
          opacity: 0.85;
        }

        .fb-cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
          margin-top: 24px;
        }

        /* Desktop */
        @media (min-width: 1024px) {
          .fb-cards-container {
            grid-template-columns: repeat(4, 1fr);
            gap: 40px;
          }
        }

        /* Large Desktop */
        @media (min-width: 1440px) {
          .fb-cards-container {
            gap: 48px;
          }
        }

        /* Ultra-wide */
        @media (min-width: 1600px) {
          .fb-container {
            padding: 80px 40px;
          }
          .fb-cards-container {
            gap: 56px;
          }
          .fb-card {
            padding: 50px 35px;
          }
          .fb-icon-wrapper {
            width: 120px;
            height: 120px;
          }
          .fb-icon {
            font-size: 3.5rem;
          }
          .fb-card-title {
            font-size: clamp(1.8rem, 3vw, 2.2rem);
          }
          .fb-card-description {
            font-size: clamp(1rem, 1.5vw, 1.1rem);
          }
          .fb-button {
            padding: 16px 36px;
            font-size: clamp(1rem, 1.5vw, 1.1rem);
          }
        }

        /* Tablet */
        @media (min-width: 768px) and (max-width: 1023px) {
          .fb-cards-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 28px;
          }
        }

        /* Mobile */
        @media (max-width: 767px) {
          .fb-cards-container {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .fb-button {
            width: 100%;
            justify-content: center;
          }
          .fb-decorative-circle {
            display: none;
          }
        }

        /* Small Mobile */
        @media (max-width: 480px) {
          .fb-container {
            padding: 20px 12px;
          }
          .fb-cards-container {
            gap: 20px;
          }
          .fb-card {
            padding: 30px 20px;
          }
          .fb-icon-wrapper {
            width: 80px;
            height: 80px;
          }
          .fb-icon {
            font-size: 2.5rem;
          }
          .fb-card-title {
            font-size: clamp(1.2rem, 2vw, 1.8rem);
          }
          .fb-card-description {
            font-size: clamp(0.85rem, 1vw, 0.95rem);
          }
          .fb-button {
            padding: 12px 24px;
            font-size: clamp(0.85rem, 1vw, 0.95rem);
          }
        }

        /* Extra Small Mobile */
        @media (max-width: 360px) {
          .fb-container {
            padding: 16px 10px;
          }
          .fb-cards-container {
            gap: 16px;
          }
          .fb-card {
            padding: 24px 16px;
          }
          .fb-icon-wrapper {
            width: 70px;
            height: 70px;
          }
          .fb-icon {
            font-size: 2rem;
          }
          .fb-card-title {
            font-size: clamp(1rem, 2vw, 1.5rem);
          }
          .fb-card-description {
            font-size: clamp(0.8rem, 1vw, 0.9rem);
          }
          .fb-button {
            padding: 10px 20px;
            font-size: clamp(0.8rem, 1vw, 0.9rem);
          }
        }

        .fb-card {
          background: linear-gradient(135deg, #ffffff 0%, #faf5f5 100%);
          border-radius: 20px;
          padding: 40px 28px;
          box-shadow: 0 8px 32px rgba(126, 0, 0, 0.12);
          border: 1px solid rgba(126, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .fb-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, transparent 0%, #7e0000 20%, #9a0000 50%, #7e0000 80%, transparent 100%);
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }

        .fb-card:hover::before {
          transform: scaleX(1);
        }

        .fb-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 16px 48px rgba(126, 0, 0, 0.25);
          border-color: rgba(126, 0, 0, 0.2);
        }

        .fb-card:active {
          transform: translateY(-8px);
        }

        .fb-icon-wrapper {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7e0000 0%, #9a0000 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          box-shadow: 0 8px 24px rgba(126, 0, 0, 0.3);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .fb-card:hover .fb-icon-wrapper {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 12px 32px rgba(126, 0, 0, 0.4);
        }

        .fb-icon {
          font-size: 3rem;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.2));
        }

        .fb-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.5rem, 2.5vw, 2rem);
          font-weight: 700;
          color: #7e0000;
          margin-bottom: 12px;
          letter-spacing: 0.01em;
        }

        .fb-card-description {
          font-size: clamp(0.9rem, 1.2vw, 1rem);
          font-weight: 400;
          color: #5a0000;
          line-height: 1.6;
          margin-bottom: 28px;
          opacity: 0.85;
        }

        .fb-button {
          background: linear-gradient(135deg, #7e0000 0%, #9a0000 100%);
          color: #ffffff;
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(0.9rem, 1.2vw, 1rem);
          font-weight: 600;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          padding: 14px 32px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(126, 0, 0, 0.3);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .fb-button:hover {
          background: linear-gradient(135deg, #9a0000 0%, #b30000 100%);
          box-shadow: 0 8px 24px rgba(126, 0, 0, 0.45);
          transform: translateY(-2px);
        }

        .fb-button:active {
          transform: translateY(0);
        }

        .fb-arrow {
          transition: transform 0.3s ease;
          font-size: 1.2rem;
        }

        .fb-button:hover .fb-arrow {
          transform: translateX(4px);
        }

        /* Decorative elements - removed for cleaner UI */
      `}</style>

      <div className="fb-root">
        <Navbar />

        <div className="fb-container">
          <h1 className="fb-title">Feedback Portal</h1>
          <p className="fb-subtitle">
            We value your feedback! Please select your category below to submit your feedback form.
          </p>

          <div className="fb-cards-container">
            {/* Students Feedback Card */}
            <div 
              className="fb-card"
              onClick={() => handleOpenForm(feedbackFormURLs.students)}
            >
              <div className="fb-icon-wrapper">
                <span className="fb-icon">🎓</span>
              </div>
              <h2 className="fb-card-title">Students Feedback</h2>
              <p className="fb-card-description">
                Share your experience and suggestions as a student. Your voice matters!
              </p>
              <button className="fb-button">
                Open Form
                <span className="fb-arrow">→</span>
              </button>
            </div>

            {/* Faculty Feedback Card */}
            <div 
              className="fb-card"
              onClick={() => handleOpenForm(feedbackFormURLs.faculty)}
            >
              <div className="fb-icon-wrapper">
                <span className="fb-icon">👨‍🏫</span>
              </div>
              <h2 className="fb-card-title">Faculty Feedback</h2>
              <p className="fb-card-description">
                Provide your valuable feedback as a faculty member to help us improve.
              </p>
              <button className="fb-button">
                Open Form
                <span className="fb-arrow">→</span>
              </button>
            </div>

            {/* Parents Feedback Card */}
            <div 
              className="fb-card"
              onClick={() => handleOpenForm(feedbackFormURLs.parents)}
            >
              <div className="fb-icon-wrapper">
                <span className="fb-icon">👨‍👩‍👧</span>
              </div>
              <h2 className="fb-card-title">Parents Feedback</h2>
              <p className="fb-card-description">
                As a parent, your insights help us serve you better.
              </p>
              <button className="fb-button">
                Open Form
                <span className="fb-arrow">→</span>
              </button>
            </div>

            {/* Alumni Feedback Card */}
            <div 
              className="fb-card"
              onClick={() => handleOpenForm(feedbackFormURLs.alumni)}
            >
              <div className="fb-icon-wrapper">
                <span className="fb-icon">🎓</span>
              </div>
              <h2 className="fb-card-title">Alumni Feedback</h2>
              <p className="fb-card-description">
                Share your post-graduation experiences and suggestions as an alumnus.
              </p>
              <button className="fb-button">
                Open Form
                <span className="fb-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Feedback;
