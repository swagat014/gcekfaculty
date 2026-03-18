import { useState, useEffect } from "react";
import { facultyData } from "../data/facultyData";
import FacultyCard from "../components/FacultyCard";
import SearchFilter from "../components/SearchFilter";
import Pagination from "../components/Pagination";
import FacultyModal from "../components/FacultyModal";
import Navbar from "../components/Navbar";

const FacultyDirectory = () => {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [facultyType, setFacultyType] = useState("");
  const [designation, setDesignation] = useState("");
  const [page, setPage] = useState(1);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [mounted, setMounted] = useState(false);

  const perPage = 15;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset to page 1 on filter change
  useEffect(() => {
    setPage(1);
  }, [search, department, facultyType, designation]);

  const departments = [...new Set(facultyData.map((f) => f.department))];

  const filteredFaculty = facultyData.filter((f) => {
    return (
      f.name.toLowerCase().includes(search.toLowerCase()) &&
      (department === "" || f.department === department) &&
      (facultyType === "" || f.type === facultyType) &&
      (designation === "" || f.designation === designation)
    );
  });

  // Sort: Principal first, then alphabetical by name
  const sortedFaculty = [...filteredFaculty].sort((a, b) => {
    const aIsPrincipal = a.designation.toLowerCase() === "principal";
    const bIsPrincipal = b.designation.toLowerCase() === "principal";
    
    if (aIsPrincipal && !bIsPrincipal) return -1;
    if (!aIsPrincipal && bIsPrincipal) return 1;
    
    return a.name.localeCompare(b.name);
  });

  const start = (page - 1) * perPage;
  const paginatedFaculty = sortedFaculty.slice(start, start + perPage);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .fd-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f4f7f5;
          position: relative;
          overflow-x: hidden;
        }

        /* Background texture */
        .fd-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          background:
            radial-gradient(ellipse 80% 50% at 10% 0%, rgba(15,76,53,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 90% 100%, rgba(45,184,126,0.06) 0%, transparent 50%),
            #f4f7f5;
          pointer-events: none;
        }
        .fd-bg-dots {
          position: fixed;
          inset: 0;
          z-index: 0;
          background-image: radial-gradient(circle, rgba(15,76,53,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
        }

        .fd-container {
          position: relative;
          z-index: 1;
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 20px 60px;
        }
        
        /* Mobile - Reduce container padding */
        @media (max-width: 640px) {
          .fd-container {
            padding: 0 16px 40px;
          }
        }
        
        @media (max-width: 480px) {
          .fd-container {
            padding: 0 14px 32px;
          }
        }
        
        @media (max-width: 360px) {
          .fd-container {
            padding: 0 12px 24px;
          }
        }

        /* Hero Header */
        .fd-hero {
          text-align: center;
          padding: 48px 20px 36px;
          position: relative;
        }
        
        /* Mobile - Reduce gap between navbar and faculty heading */
        @media (max-width: 640px) {
          .fd-hero {
            padding: 24px 16px 28px;
          }
        }
        
        @media (max-width: 480px) {
          .fd-hero {
            padding: 20px 14px 24px;
          }
        }
        
        @media (max-width: 360px) {
          .fd-hero {
            padding: 16px 12px 20px;
          }
        }
        .fd-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(126, 0, 0, 0.08);
          border: 1px solid rgba(126, 0, 0, 0.15);
          border-radius: 20px;
          padding: 5px 16px;
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #7e0000;
          margin-bottom: 20px;
        }
        .fd-hero-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #b30000;
          animation: fd-pulse 2s ease infinite;
        }
        @keyframes fd-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }

        .fd-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 6vw, 4rem);
          font-weight: 700;
          color: #0d1f18;
          line-height: 1.1;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }
        .fd-title-accent {
          color: #7e0000;
          position: relative;
        }
        .fd-title-accent::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #7e0000, #b30000);
          border-radius: 2px;
        }

        .fd-subtitle {
          font-size: 1rem;
          color: #6b7280;
          font-weight: 400;
          max-width: 480px;
          margin: 0 auto 32px;
          line-height: 1.6;
        }

        /* Stats strip */
        .fd-stats {
          display: inline-flex;
          align-items: center;
          gap: 0;
          background: #fff;
          border: 1.5px solid #e8f0ec;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(15,76,53,0.07);
        }
        .fd-stat {
          padding: 12px 24px;
          text-align: center;
          position: relative;
        }
        .fd-stat + .fd-stat::before {
          content: '';
          position: absolute;
          left: 0; top: 20%; bottom: 20%;
          width: 1px;
          background: #e8f0ec;
        }
        .fd-stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #7e0000;
          line-height: 1;
        }
        .fd-stat-lbl {
          font-size: 0.68rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #9ca3af;
          margin-top: 3px;
        }
        @media (max-width: 480px) {
          .fd-stat { padding: 10px 16px; }
          .fd-stat-num { font-size: 1.3rem; }
        }

        /* Results bar */
        .fd-results-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .fd-results-text {
          font-size: 0.82rem;
          color: #6b7280;
          font-weight: 500;
        }
        .fd-results-text strong {
          color: #7e0000;
          font-weight: 700;
        }
        .fd-results-badge {
          font-size: 0.72rem;
          font-weight: 600;
          color: #6b7280;
          background: #f3f4f6;
          border-radius: 8px;
          padding: 4px 10px;
        }

        /* Grid */
        .fd-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 8px;
        }
        @media (max-width: 480px) {
          .fd-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
        }
        @media (max-width: 340px) {
          .fd-grid { grid-template-columns: 1fr; }
        }

        /* Card entrance animation */
        .fd-card-item {
          opacity: 0;
          transform: translateY(16px);
          animation: fd-cardIn 0.4s ease forwards;
        }
        @keyframes fd-cardIn {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Empty state */
        .fd-empty {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 72px 20px;
          text-align: center;
        }
        .fd-empty-icon {
          font-size: 3rem;
          margin-bottom: 16px;
          opacity: 0.4;
        }
        .fd-empty-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }
        .fd-empty-text {
          font-size: 0.875rem;
          color: #9ca3af;
        }

        /* Page entry */
        .fd-page-enter {
          animation: fd-pageIn 0.5s ease both;
        }
        @keyframes fd-pageIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="fd-page">
        <div className="fd-bg" />
        <div className="fd-bg-dots" />

        {/* Navbar */}
        <Navbar />

        <div className={`fd-container ${mounted ? "fd-page-enter" : ""}`}>

          {/* Hero */}
          <div className="fd-hero">
            {/* <div className="fd-hero-eyebrow">
              <span className="fd-hero-dot" />
              GCEK Berhampur
            </div> */}
            <h1 className="fd-title">
              Meet Our <span className="fd-title-accent">Faculty</span>
            </h1>
            {/* <p className="fd-subtitle">
              Discover our distinguished educators, researchers, and mentors shaping the future of engineering.
            </p> */}
            {/* <div className="fd-stats">
              <div className="fd-stat">
                <div className="fd-stat-num">{facultyData.length}</div>
                <div className="fd-stat-lbl">Faculty</div>
              </div>
              <div className="fd-stat">
                <div className="fd-stat-num">{departments.length}</div>
                <div className="fd-stat-lbl">Departments</div>
              </div>
              <div className="fd-stat">
                <div className="fd-stat-num">
                  {facultyData.filter(f => f.type === "Regular").length}
                </div>
                <div className="fd-stat-lbl">Regular</div>
              </div>
              <div className="fd-stat">
                <div className="fd-stat-num">
                  {facultyData.filter(f => f.type === "Guest").length}
                </div>
                <div className="fd-stat-lbl">Guest</div>
              </div>
            </div> */}
          </div>

          {/* Filters */}
          <SearchFilter
            search={search}
            setSearch={setSearch}
            department={department}
            setDepartment={setDepartment}
            departments={departments}
            facultyType={facultyType}
            setFacultyType={setFacultyType}
            designation={designation}
            setDesignation={setDesignation}
          />

          {/* Results bar */}
          <div className="fd-results-bar">
            <p className="fd-results-text">
              Showing <strong>{paginatedFaculty.length}</strong> of{" "}
              <strong>{filteredFaculty.length}</strong> faculty members
            </p>
            <span className="fd-results-badge">
              Page {page} of {Math.max(1, Math.ceil(filteredFaculty.length / perPage))}
            </span>
          </div>

          {/* Grid */}
          <div className="fd-grid">
            {paginatedFaculty.length > 0 ? (
              paginatedFaculty.map((faculty, i) => (
                <div
                  key={faculty.id}
                  className="fd-card-item"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <FacultyCard faculty={faculty} onClick={setSelectedFaculty} />
                </div>
              ))
            ) : (
              <div className="fd-empty">
                <div className="fd-empty-icon">🔍</div>
                <div className="fd-empty-title">No faculty found</div>
                <div className="fd-empty-text">Try adjusting your search or filters</div>
              </div>
            )}
          </div>

          {/* Pagination */}
          <Pagination
            total={filteredFaculty.length}
            perPage={perPage}
            page={page}
            setPage={setPage}
          />
        </div>
      </div>

      {/* Modal */}
      {selectedFaculty && (
        <FacultyModal
          faculty={selectedFaculty}
          onClose={() => setSelectedFaculty(null)}
        />
      )}
    </>
  );
};

export default FacultyDirectory;