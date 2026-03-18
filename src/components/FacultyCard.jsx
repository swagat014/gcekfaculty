import { convertGoogleDriveUrl } from "../utils/facultyUtils";

const FacultyCard = ({ faculty, onClick }) => {
  const imageUrl = convertGoogleDriveUrl(faculty.image);
  
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .fc-card {
          font-family: 'DM Sans', sans-serif;
          position: relative;
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .fc-card:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 20px 48px rgba(126, 0, 0, 0.18), 0 0 0 1px rgba(126, 0, 0, 0.08);
        }

        /* Accent bar on top */
        .fc-accent {
          height: 4px;
          background: linear-gradient(90deg, #7e0000, #b30000, #7e0000);
          background-size: 200% 100%;
          animation: fc-shimmer 3s ease infinite;
        }
        @keyframes fc-shimmer {
          0% { background-position: 100% 0 }
          100% { background-position: -100% 0 }
        }

        .fc-body {
          padding: 28px 24px 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          position: relative;
        }

        /* Type badge */
        .fc-type-badge {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 3px 10px;
          border-radius: 12px;
          margin-bottom: 10px;
          white-space: nowrap;
        }
        .fc-type-regular {
          background: linear-gradient(135deg, #7e0000, #9a0000);
          color: #ffffff;
        }
        .fc-type-guest {
          background: linear-gradient(135deg, #6b7280, #9ca3af);
          color: #ffffff;
        }

        /* Avatar with ring */
        .fc-avatar-wrap {
          position: relative;
          margin-bottom: 18px;
        }
        .fc-avatar-ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: conic-gradient(#7e0000 0%, #b30000 40%, #ffe6e6 60%, #7e0000 100%);
          animation: fc-spin 6s linear infinite;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .fc-card:hover .fc-avatar-ring { opacity: 1; }
        @keyframes fc-spin { to { transform: rotate(360deg) } }
        .fc-avatar-inner {
          position: relative;
          z-index: 1;
          width: 84px;
          height: 84px;
          border-radius: 50%;
          border: 3px solid #fff;
          overflow: hidden;
          background: #e8f5f0;
        }
        .fc-avatar-inner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .fc-avatar-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          background: linear-gradient(135deg, #ffe6e6, #ffc6c6);
          color: #7e0000;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
        }

        /* Name */
        .fc-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: #1a1a1a;
          text-align: center;
          line-height: 1.25;
          margin-bottom: 6px;
          letter-spacing: 0.01em;
        }

        /* Designation pill */
        .fc-designation {
          font-size: 0.72rem;
          font-weight: 500;
          color: #7e0000;
          background: #ffe6e6;
          border: 1px solid #ffc6c6;
          border-radius: 20px;
          padding: 3px 12px;
          text-align: center;
          margin-bottom: 14px;
          letter-spacing: 0.02em;
        }

        /* Divider */
        .fc-divider {
          width: 36px;
          height: 2px;
          background: linear-gradient(90deg, #b30000, #7e0000);
          border-radius: 2px;
          margin: 0 auto 14px;
          transition: width 0.3s ease;
        }
        .fc-card:hover .fc-divider { width: 60px; }

        /* Department */
        .fc-dept {
          font-size: 0.8rem;
          font-weight: 600;
          color: #374151;
          text-align: center;
          margin-bottom: 6px;
          letter-spacing: 0.01em;
        }

        /* Email */
        .fc-email {
          font-size: 0.74rem;
          color: #6b7280;
          text-align: center;
          word-break: break-all;
          line-height: 1.4;
        }

        /* Footer CTA */
        .fc-footer {
          border-top: 1px solid #f3f4f6;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #7e0000;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: #fafafa;
          transition: background 0.2s, color 0.2s;
        }
        .fc-card:hover .fc-footer {
          background: linear-gradient(90deg, #7e0000, #9a0000);
          color: #fff;
        }
        .fc-footer-arrow {
          display: inline-block;
          transition: transform 0.25s ease;
          font-size: 0.9rem;
        }
        .fc-card:hover .fc-footer-arrow { transform: translateX(4px); }
      `}</style>

      <div className="fc-card" onClick={() => onClick(faculty)}>
        <div className="fc-accent" />

        <div className="fc-body">
          <div className="fc-avatar-wrap">
            <div className="fc-avatar-ring" />
            <div className="fc-avatar-inner">
              {imageUrl !== 'https://via.placeholder.com/150?text=No+Image' ? (
                <img src={imageUrl} alt={faculty.name} />
              ) : (
                <div className="fc-avatar-fallback">
                  {faculty.name?.charAt(0) || "F"}
                </div>
              )}
            </div>
          </div>

          <span className={`fc-type-badge ${faculty.type === "Regular" ? "fc-type-regular" : "fc-type-guest"}`}>
            {faculty.type}
          </span>

          <h2 className="fc-name">{faculty.name}</h2>
          <span className="fc-designation">{faculty.designation}</span>

          <div className="fc-divider" />

          <p className="fc-dept">{faculty.department}</p>
          <p className="fc-email">{faculty.email}</p>
        </div>

        <div className="fc-footer">
          <span>View Profile</span>
          <span className="fc-footer-arrow">→</span>
        </div>
      </div>
    </>
  );
};

export default FacultyCard;