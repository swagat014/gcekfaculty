import { convertGoogleDriveUrl } from "../utils/facultyUtils";

const FacultyCard = ({ faculty, onClick }) => {
  const imageUrl = convertGoogleDriveUrl(faculty.image);
  const isPrincipal = faculty.designation?.toLowerCase() === "principal";
  const isHod = faculty.hod === "yes" || (faculty.designation || "").toUpperCase().includes("HOD");
  const isRegular = (faculty.type || "").toLowerCase().includes("regular");
  const isGuest = (faculty.type || "").toLowerCase().includes("guest");

  const cleanDesignation = (faculty.designation || "")
    .replace(/^HOD\s*&\s*/i, "")
    .replace(/^HOD\s*,\s*/i, "")
    .replace(/^HOD\s*-\s*/i, "")
    .replace(/^HOD\s+/i, "")
    .trim() || (isHod ? "Faculty Member" : faculty.designation);

  let cardClass = "fc-card";
  if (isPrincipal) {
    cardClass += " fc-card-principal";
  } else if (isHod) {
    cardClass += " fc-card-hod";
  }
  if (isGuest) {
    cardClass += " fc-card-guest";
  } else if (isRegular && !isPrincipal) {
    cardClass += " fc-card-regular";
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .fc-card {
          font-family: 'DM Sans', sans-serif;
          position: relative;
          background: #fff;
          border-radius: 24px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
          box-shadow: 0 8px 24px rgba(29, 34, 31, 0.08), 0 1px 3px rgba(29, 34, 31, 0.05);
          display: flex;
          flex-direction: column;
          height: 100%;
          border: 1px solid rgba(29, 34, 31, 0.06);
        }
        .fc-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 38px rgba(29, 34, 31, 0.14), 0 4px 10px rgba(29, 34, 31, 0.06);
        }
        .fc-card:focus-visible {
          outline: 3px solid #c5a66b;
          outline-offset: 3px;
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

        /* Badge container */
        .fc-badges-wrap {
          display: flex;
          gap: 6px;
          margin-bottom: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }

        /* Type badge */
        .fc-type-badge {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 3px 10px;
          border-radius: 12px;
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

        /* HOD badge */
        .fc-hod-badge {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 3px 10px;
          border-radius: 12px;
          white-space: nowrap;
          background: linear-gradient(135deg, #d97706, #fbbf24);
          color: #ffffff;
          box-shadow: 0 2px 4px rgba(217, 119, 6, 0.2);
        }

        /* Principal Card Styles */
        .fc-card-principal {
          background: linear-gradient(135deg, #f5f8ff, #edf2ff);
          box-shadow: 0 4px 18px rgba(79, 70, 229, 0.08), 0 0 0 1px rgba(79, 70, 229, 0.15);
        }
        .fc-card-principal .fc-name {
          color: #1a1a1a;
        }
        .fc-card-principal .fc-dept {
          color: #374151;
        }
        .fc-card-principal .fc-email {
          color: #6b7280;
        }
        .fc-card-principal .fc-designation {
          color: #4f46e5;
          background: #e0e7ff;
          border: 1px solid #c7d2fe;
        }
        .fc-card-principal .fc-divider {
          background: linear-gradient(90deg, #4f46e5, #7c3aed);
        }
        .fc-card-principal .fc-accent {
          background: linear-gradient(90deg, #4f46e5, #7c3aed, #4f46e5);
        }
        .fc-card-principal .fc-footer {
          background: #ebf1fe;
          color: #4f46e5;
          border-top: 1px solid #dbe5ff;
        }
        .fc-card-principal:hover {
          box-shadow: 0 20px 48px rgba(79, 70, 229, 0.14), 0 0 0 1.5px rgba(79, 70, 229, 0.25);
        }
        .fc-card-principal:hover .fc-footer {
          background: linear-gradient(90deg, #4f46e5, #7c3aed);
          color: #fff;
        }
        .fc-card-principal:hover .fc-avatar-ring {
          background: conic-gradient(#4f46e5 0%, #7c3aed 40%, #e0e7ff 60%, #4f46e5 100%);
        }

        /* HOD Card Styles */
        .fc-card-hod {
          background: linear-gradient(135deg, #fffdf7, #fffcf4);
          box-shadow: 0 4px 16px rgba(217, 119, 6, 0.08), 0 0 0 1px rgba(217, 119, 6, 0.12);
        }
        .fc-card-hod .fc-name {
          color: #1a150e;
        }
        .fc-card-hod .fc-dept {
          color: #453015;
        }
        .fc-card-hod .fc-email {
          color: #78654c;
        }
        .fc-card-hod .fc-designation {
          color: #d97706;
          background: #fef3c7;
          border: 1px solid #fde68a;
        }
        .fc-card-hod .fc-divider {
          background: linear-gradient(90deg, #d97706, #fbbf24);
        }
        .fc-card-hod .fc-accent {
          background: linear-gradient(90deg, #d97706, #fbbf24, #d97706);
        }
        .fc-card-hod .fc-footer {
          background: #faf8f2;
          color: #d97706;
          border-top: 1px solid #f9f5ea;
        }
        .fc-card-hod:hover {
          box-shadow: 0 20px 48px rgba(217, 119, 6, 0.16), 0 0 0 1.5px rgba(217, 119, 6, 0.28);
        }
        .fc-card-hod:hover .fc-footer {
          background: linear-gradient(90deg, #d97706, #fbbf24);
          color: #fff;
        }
        .fc-card-hod:hover .fc-avatar-ring {
          background: conic-gradient(#b45309 0%, #d97706 40%, #fffbeb 60%, #b45309 100%);
        }

        .fc-card-guest {
          background: linear-gradient(160deg, #fffefa 0%, #f7faf6 100%);
          border-color: rgba(55, 91, 67, 0.14);
          box-shadow: 0 8px 24px rgba(35, 67, 45, 0.09), 0 1px 3px rgba(35, 67, 45, 0.05);
        }
        .fc-card-guest:hover {
          box-shadow: 0 20px 40px rgba(35, 67, 45, 0.16), 0 0 0 1px rgba(174, 139, 77, 0.42);
        }
        .fc-card-guest .fc-accent {
          height: 6px;
          background: linear-gradient(90deg, #426d53, #d2b776 52%, #426d53);
          animation: none;
        }
        .fc-card-guest .fc-body {
          padding: 27px 24px 25px;
        }
        .fc-card-guest .fc-body::before {
          content: "";
          position: absolute;
          inset: 0 0 auto;
          height: 172px;
          background:
            radial-gradient(circle at 88% 12%, rgba(255, 255, 255, 0.92), transparent 25%),
            radial-gradient(circle at 12% 100%, rgba(255, 255, 255, 0.64), transparent 34%),
            linear-gradient(145deg, #e5efe5, #d5e4d7);
        }
        .fc-card-guest .fc-avatar-wrap,
        .fc-card-guest .fc-badges-wrap,
        .fc-card-guest .fc-name,
        .fc-card-guest .fc-divider,
        .fc-card-guest .fc-dept,
        .fc-card-guest .fc-email {
          position: relative;
          z-index: 1;
        }
        .fc-card-guest .fc-avatar-ring {
          opacity: 1;
          background: conic-gradient(from 25deg, #997744, #f0dfb6, #997744);
          animation: none;
        }
        .fc-card-guest .fc-avatar-inner {
          border: 4px solid #fffefa;
          background: #e8eee8;
          box-shadow: 0 4px 12px rgba(31, 62, 42, 0.18);
        }
        .fc-card-guest .fc-badges-wrap {
          margin-bottom: 29px;
        }
        .fc-card-guest .fc-type-guest {
          background: rgba(255, 255, 255, 0.88);
          color: #2f523b;
          border: 1px solid rgba(69, 107, 77, 0.25);
          box-shadow: 0 2px 6px rgba(41, 79, 51, 0.08);
        }
        .fc-card-guest .fc-hod-badge {
          color: #263b2d;
          background: linear-gradient(135deg, #ead7a8, #f6e9c6);
          box-shadow: none;
        }
        .fc-card-guest .fc-name {
          margin-bottom: 12px;
          color: #20372a;
          font-size: 1.45rem;
          letter-spacing: 0.015em;
        }
        .fc-card-guest .fc-divider {
          width: 42px;
          background: linear-gradient(90deg, #9b7846, #d8bd83);
        }
        .fc-card-guest:hover .fc-divider {
          width: 64px;
        }
        .fc-card-guest .fc-dept {
          color: #2d5039;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.025em;
        }
        .fc-card-guest .fc-email {
          color: #657369;
        }
        .fc-card-guest .fc-footer {
          color: #2f523b;
          background: linear-gradient(180deg, #f8faf6, #edf3eb);
          border-top: 1px solid #e2eade;
          padding-block: 14px;
        }
        .fc-card-guest:hover .fc-footer {
          color: #254331;
          background: linear-gradient(90deg, #e2eee2, #d2e3d4);
        }

        .fc-card-regular {
          background: linear-gradient(160deg, #fffefa 0%, #f8f7f2 100%);
          border-color: rgba(35, 54, 74, 0.14);
          box-shadow: 0 8px 24px rgba(27, 42, 59, 0.09), 0 1px 3px rgba(27, 42, 59, 0.05);
        }
        .fc-card-regular:hover {
          box-shadow: 0 20px 40px rgba(27, 42, 59, 0.17), 0 0 0 1px rgba(195, 160, 98, 0.48);
        }
        .fc-card-regular .fc-accent {
          height: 6px;
          background: linear-gradient(90deg, #192b40, #d2b474 52%, #192b40);
          animation: none;
        }
        .fc-card-regular .fc-body {
          padding: 27px 24px 25px;
        }
        .fc-card-regular .fc-body::before {
          content: "";
          position: absolute;
          inset: 0 0 auto;
          height: 172px;
          background:
            radial-gradient(circle at 88% 12%, rgba(255, 255, 255, 0.2), transparent 27%),
            radial-gradient(circle at 10% 100%, rgba(216, 184, 125, 0.2), transparent 35%),
            linear-gradient(145deg, #182a3e, #304761);
        }
        .fc-card-regular .fc-avatar-wrap,
        .fc-card-regular .fc-badges-wrap,
        .fc-card-regular .fc-name,
        .fc-card-regular .fc-designation,
        .fc-card-regular .fc-divider,
        .fc-card-regular .fc-dept,
        .fc-card-regular .fc-email {
          position: relative;
          z-index: 1;
        }
        .fc-card-regular .fc-avatar-ring {
          opacity: 1;
          background: conic-gradient(from 25deg, #9b7947, #f0dfb6, #9b7947);
          animation: none;
        }
        .fc-card-regular .fc-avatar-inner {
          border: 4px solid #fffefa;
          background: #e8ebee;
          box-shadow: 0 4px 12px rgba(24, 42, 62, 0.2);
        }
        .fc-card-regular .fc-badges-wrap {
          margin-bottom: 29px;
        }
        .fc-card-regular .fc-type-regular {
          background: rgba(255, 255, 255, 0.13);
          color: #f3e7c9;
          border: 1px solid rgba(230, 207, 159, 0.5);
          backdrop-filter: blur(8px);
          box-shadow: 0 2px 8px rgba(15, 29, 45, 0.16);
        }
        .fc-card-regular .fc-hod-badge {
          color: #432b18;
          background: linear-gradient(135deg, #ead7a8, #f6e9c6);
          box-shadow: none;
        }
        .fc-card-regular .fc-name {
          margin-bottom: 8px;
          color: #233346;
          font-size: 1.45rem;
          letter-spacing: 0.015em;
        }
        .fc-card-regular .fc-designation {
          color: #344b63;
          background: linear-gradient(135deg, #edf1f3, #e5eaed);
          border-color: #d4dde2;
          margin-bottom: 14px;
          box-shadow: 0 2px 6px rgba(27, 42, 59, 0.07);
        }
        .fc-card-regular .fc-divider {
          width: 42px;
          background: linear-gradient(90deg, #997545, #d8bd83);
        }
        .fc-card-regular:hover .fc-divider {
          width: 64px;
        }
        .fc-card-regular .fc-dept {
          color: #3a4b5c;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.025em;
        }
        .fc-card-regular .fc-email {
          color: #707a82;
        }
        .fc-card-regular .fc-footer {
          color: #30455b;
          background: linear-gradient(180deg, #f8f8f4, #eff1ed);
          border-top: 1px solid #e3e7e5;
          padding-block: 14px;
        }
        .fc-card-regular:hover .fc-footer {
          color: #fff9e9;
          background: linear-gradient(90deg, #192b40, #304761);
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
        .fc-card-principal .fc-avatar-inner {
          border: 3px solid #fff;
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
        .fc-card-principal .fc-avatar-fallback {
          background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
          color: #4f46e5;
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

      <div className={cardClass} onClick={() => onClick(faculty)}>
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

          <div className="fc-badges-wrap">
            <span className={`fc-type-badge ${isRegular ? "fc-type-regular" : "fc-type-guest"}`}>
              {faculty.type}
            </span>
            {isHod && (
              <span className="fc-hod-badge">
                HOD
              </span>
            )}
          </div>

          <h2 className="fc-name">{faculty.name}</h2>
          {!isGuest && <span className="fc-designation">{cleanDesignation}</span>}

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