import { useEffect } from "react";
import { convertGoogleDriveUrl } from "../utils/facultyUtils";

const FacultyModal = ({ faculty, onClose }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!faculty) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .fm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 15, 30, 0.75);
          backdrop-filter: blur(6px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: fm-fadeIn 0.2s ease;
        }
        @keyframes fm-fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fm-slideUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }

        .fm-modal {
          font-family: 'DM Sans', sans-serif;
          background: #fff;
          border-radius: 20px;
          width: 100%;
          max-width: 780px;
          max-height: 92vh;
          overflow-y: auto;
          overflow-x: hidden;
          animation: fm-slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          scrollbar-width: thin;
          scrollbar-color: #d1d5db transparent;
        }
        .fm-modal::-webkit-scrollbar { width: 5px; }
        .fm-modal::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }

        .fm-header {
          background: linear-gradient(135deg, #7e0000 0%, #9a0000 50%, #8b0000 100%);
          padding: 32px 28px 28px;
          position: relative;
          overflow: hidden;
        }
        .fm-header::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 220px; height: 220px;
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
        }
        .fm-header::after {
          content: '';
          position: absolute;
          bottom: -40px; left: 20%;
          width: 160px; height: 160px;
          background: rgba(255,255,255,0.04);
          border-radius: 50%;
        }
        .fm-header-inner {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          position: relative;
          z-index: 1;
        }
        .fm-avatar {
          width: 96px;
          height: 96px;
          border-radius: 16px;
          object-fit: cover;
          border: 3px solid rgba(255,255,255,0.3);
          flex-shrink: 0;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .fm-avatar-placeholder {
          width: 96px;
          height: 96px;
          border-radius: 16px;
          background: rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          flex-shrink: 0;
          border: 3px solid rgba(255,255,255,0.2);
        }
        .fm-title-group {
          flex: 1;
          min-width: 0;
        }
        .fm-name {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.3rem, 4vw, 1.75rem);
          font-weight: 700;
          color: #fff;
          margin: 0 0 6px;
          line-height: 1.2;
        }
        .fm-designation {
          font-size: 0.85rem;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.15);
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: 12px;
          letter-spacing: 0.02em;
        }
        .fm-contact-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 4px;
        }
        .fm-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          padding: 5px 10px;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.9);
          font-weight: 400;
        }
        .fm-chip-icon { font-size: 0.8rem; }

        .fm-close {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 10;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          color: #fff;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.1rem;
          line-height: 1;
          transition: background 0.2s;
        }
        .fm-close:hover { background: rgba(255,255,255,0.28); }

        .fm-body {
          padding: 24px 28px 28px;
        }

        .fm-quick-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 28px;
        }
        @media (max-width: 768px) {
          .fm-quick-stats { grid-template-columns: repeat(2, 1fr); }
        }
          .fm-header-inner { flex-direction: column; align-items: center; text-align: center; }
          .fm-contact-chips { justify-content: center; }
          .fm-body { padding: 20px 16px 24px; }
          .fm-header { padding: 24px 16px 20px; }
          .fm-grid-2 { grid-template-columns: 1fr !important; }
        }
        .fm-stat-card {
          background: #f8faf9;
          border: 1px solid #e8f0ec;
          border-radius: 12px;
          padding: 14px 14px 12px;
        }
        .fm-stat-label {
          font-size: 0.68rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #6b7280;
          margin-bottom: 4px;
        }
        .fm-stat-value {
          font-size: 0.88rem;
          font-weight: 600;
          color: #1f2937;
          line-height: 1.3;
        }
        .fm-stat-value.email { color: #7e0000; font-size: 0.78rem; word-break: break-all; }

        .fm-section-title {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #9ca3af;
          margin-bottom: 14px;
          padding-bottom: 8px;
          border-bottom: 1px solid #f3f4f6;
        }

        .fm-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }
        .fm-detail-card {
          background: #f9fafb;
          border: 1px solid #f0f0f0;
          border-radius: 12px;
          padding: 14px;
        }
        .fm-detail-card.full { grid-column: 1 / -1; }
        .fm-detail-icon {
          font-size: 1rem;
          margin-bottom: 6px;
          display: block;
        }
        .fm-detail-label {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: #9ca3af;
          margin-bottom: 4px;
        }
        .fm-detail-value {
          font-size: 0.875rem;
          color: #374151;
          line-height: 1.6;
          font-weight: 400;
        }

        .fm-address {
          background: linear-gradient(135deg, #f0faf5, #e8f5f0);
          border: 1px solid #c6e8d6;
          border-radius: 12px;
          padding: 16px 18px;
          margin-top: 20px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }
        .fm-address-icon {
          font-size: 1.3rem;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .fm-address-label {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #7e0000;
          margin-bottom: 5px;
        }
        .fm-address-text {
          font-size: 0.875rem;
          color: #374151;
          line-height: 1.65;
        }
      `}</style>

      <div className="fm-overlay" onClick={onClose}>
        <div className="fm-modal" onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="fm-header">
            <button className="fm-close" onClick={onClose} aria-label="Close">✕</button>
            <div className="fm-header-inner">
              {convertGoogleDriveUrl(faculty.image) !== 'https://via.placeholder.com/150?text=No+Image' ? (
                <img src={convertGoogleDriveUrl(faculty.image)} alt={faculty.name} className="fm-avatar" />
              ) : (
                <div className="fm-avatar-placeholder">👤</div>
              )}
              <div className="fm-title-group">
                <h2 className="fm-name">{faculty.name}</h2>
                <span className="fm-designation">{faculty.designation}</span>
                <div className="fm-contact-chips">
                  <span className="fm-chip">
                    <span className="fm-chip-icon">🏛️</span>
                    {faculty.department}
                  </span>
                  {faculty.email && (
                    <span className="fm-chip">
                      <span className="fm-chip-icon">✉️</span>
                      {faculty.email}
                    </span>
                  )}
                  {faculty.phone && (
                    <span className="fm-chip">
                      <span className="fm-chip-icon">📞</span>
                      {faculty.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="fm-body">

            {/* Quick Stats Row */}
            <div className="fm-quick-stats">
              <StatCard label="Faculty Type" value={faculty.type} />
              <StatCard label="Qualification" value={faculty.qualification} />
              <StatCard label="Experience" value={faculty.experience} />
              <StatCard label="Joined" value={faculty.dateOfJoining} />
            </div>

            {/* Core Academic Info */}
            <div className="fm-section-title">Academic Profile</div>
            <div className="fm-grid-2">
              <DetailCard icon="🔬" label="Specialization" value={faculty.specialization} />
              <DetailCard icon="📚" label="Subjects Handled" value={faculty.subjects} />
            </div>

            {/* Research */}
            {(faculty.researchPublications || faculty.researchProjects || faculty.researchGuidance) && (
              <>
                <div className="fm-section-title" style={{marginTop: '20px'}}>Research</div>
                <div className="fm-grid-2">
                  <DetailCard icon="📄" label="Publications" value={faculty.researchPublications} full />
                  <DetailCard icon="🔍" label="Projects" value={faculty.researchProjects} />
                  <DetailCard icon="👨‍🎓" label="Research Guidance" value={faculty.researchGuidance} />
                </div>
              </>
            )}

            {/* Recognition & Admin */}
            {(faculty.awards || faculty.administrativeResponsibility || faculty.professionalBodies || faculty.seminarsOrganized) && (
              <>
                <div className="fm-section-title" style={{marginTop: '20px'}}>Recognition & Responsibilities</div>
                <div className="fm-grid-2">
                  <DetailCard icon="🏆" label="Awards & Honors" value={faculty.awards} />
                  <DetailCard icon="💼" label="Administrative Role" value={faculty.administrativeResponsibility} />
                  <DetailCard icon="🤝" label="Professional Bodies" value={faculty.professionalBodies} />
                  <DetailCard icon="🎤" label="Seminars / FDP / STC" value={faculty.seminarsOrganized} />
                </div>
              </>
            )}

            {/* Address */}
            <div className="fm-address">
              <span className="fm-address-icon">📬</span>
              <div>
                <div className="fm-address-label">Address for Communication</div>
                <div className="fm-address-text">
                  {faculty.address || `Department of ${faculty.department}, GCEK, Bhawanipatna, Odisha`}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

const StatCard = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="fm-stat-card">
      <div className="fm-stat-label">{label}</div>
      <div className={`fm-stat-value ${label === 'Email' ? 'email' : ''}`}>{value}</div>
    </div>
  );
};

const DetailCard = ({ icon, label, value, full = false }) => {
  if (!value) return null;
  return (
    <div className={`fm-detail-card${full ? ' full' : ''}`}>
      <span className="fm-detail-icon">{icon}</span>
      <div className="fm-detail-label">{label}</div>
      <div className="fm-detail-value">{value}</div>
    </div>
  );
};

export default FacultyModal;