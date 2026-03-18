const SearchFilter = ({
  search,
  setSearch,
  department,
  setDepartment,
  departments,
  facultyType,
  setFacultyType,
  designation,
  setDesignation,
}) => {
  const hasActiveFilters =
    search || department || facultyType || designation;

  const clearAll = () => {
    setSearch("");
    setDepartment("");
    setFacultyType("");
    setDesignation("");
  };

  const activeCount = [search, department, facultyType, designation].filter(Boolean).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        .sf-wrap {
          font-family: 'DM Sans', sans-serif;
          background: #fff;
          border: 1.5px solid #e8f0ec;
          border-radius: 18px;
          padding: 20px 20px 18px;
          box-shadow: 0 2px 16px rgba(15, 76, 53, 0.06);
          margin-bottom: 32px;
        }

        .sf-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .sf-label {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #9ca3af;
        }
        .sf-clear {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #7e0000;
          background: #ffe6e6;
          border: none;
          border-radius: 8px;
          padding: 5px 12px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          opacity: 0;
          pointer-events: none;
          transform: scale(0.9);
        }
        .sf-clear.visible {
          opacity: 1;
          pointer-events: auto;
          transform: scale(1);
        }
        .sf-clear:hover { background: #ffc6c6; }

        .sf-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }
        @media (min-width: 640px) {
          .sf-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 1024px) {
          .sf-grid { grid-template-columns: 2fr 1fr 1fr 1fr; }
        }

        /* Search input */
        .sf-search-wrap {
          position: relative;
        }
        .sf-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 1rem;
          pointer-events: none;
          transition: color 0.2s;
        }
        .sf-search-wrap:focus-within .sf-search-icon {
          color: #7e0000;
        }
        .sf-search-input {
          width: 100%;
          height: 46px;
          padding: 0 40px 0 42px;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          color: #1f2937;
          background: #fafafa;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .sf-search-input::placeholder { color: #b0bec5; }
        .sf-search-input:focus {
          border-color: #7e0000;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(126, 0, 0, 0.08);
        }
        .sf-clear-x {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: #e5e7eb;
          border: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.65rem;
          color: #6b7280;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s, background 0.2s;
        }
        .sf-clear-x.show { opacity: 1; pointer-events: auto; }
        .sf-clear-x:hover { background: #d1d5db; color: #374151; }

        /* Select wrapper */
        .sf-select-wrap {
          position: relative;
        }
        .sf-select-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.9rem;
          pointer-events: none;
          transition: filter 0.2s;
        }
        .sf-select-arrow {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #9ca3af;
          font-size: 0.6rem;
          transition: color 0.2s;
        }
        .sf-select-wrap:focus-within .sf-select-arrow { color: #7e0000; }

        .sf-select {
          width: 100%;
          height: 46px;
          padding: 0 32px 0 42px;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          color: #1f2937;
          background: #fafafa;
          outline: none;
          appearance: none;
          -webkit-appearance: none;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .sf-select:focus {
          border-color: #7e0000;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(126, 0, 0, 0.08);
        }
        .sf-select.active {
          border-color: #7e0000;
          color: #7e0000;
          background: #fff0f0;
          font-weight: 500;
        }

        /* Active badge */
        .sf-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #7e0000, #9a0000);
          color: #fff;
          font-size: 0.65rem;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          margin-left: 6px;
          vertical-align: middle;
        }
      `}</style>

      <div className="sf-wrap">
        <div className="sf-top-row">
          <span className="sf-label">
            Filter Faculty
            {activeCount > 0 && <span className="sf-badge">{activeCount}</span>}
          </span>
          <button
            className={`sf-clear ${hasActiveFilters ? "visible" : ""}`}
            onClick={clearAll}
          >
            ✕ Clear all
          </button>
        </div>

        <div className="sf-grid">
          {/* Search */}
          <div className="sf-search-wrap">
            <span className="sf-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sf-search-input"
            />
            <button
              className={`sf-clear-x ${search ? "show" : ""}`}
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          </div>

          {/* Department */}
          <div className="sf-select-wrap">
            <span className="sf-select-icon">🏛️</span>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className={`sf-select ${department ? "active" : ""}`}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <span className="sf-select-arrow">▼</span>
          </div>

          {/* Faculty Type */}
          <div className="sf-select-wrap">
            <span className="sf-select-icon">👤</span>
            <select
              value={facultyType}
              onChange={(e) => setFacultyType(e.target.value)}
              className={`sf-select ${facultyType ? "active" : ""}`}
            >
              <option value="">All Types</option>
              <option value="Regular Faculty">Regular</option>
              <option value="Guest Faculty">Guest</option>
            </select>
            <span className="sf-select-arrow">▼</span>
          </div>

          {/* Designation */}
          <div className="sf-select-wrap">
            <span className="sf-select-icon">🎓</span>
            <select
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className={`sf-select ${designation ? "active" : ""}`}
            >
              <option value="">All Designations</option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
            </select>
            <span className="sf-select-arrow">▼</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchFilter;