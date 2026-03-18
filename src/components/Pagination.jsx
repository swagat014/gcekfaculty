const Pagination = ({ total, perPage, page, setPage }) => {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;

  // Smart page window: show max 5 page numbers centered around current
  const getPageNumbers = () => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    const delta = 2;
    const range = [];
    const left = Math.max(2, page - delta);
    const right = Math.min(pages - 1, page + delta);
    range.push(1);
    if (left > 2) range.push("...");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < pages - 1) range.push("...");
    range.push(pages);
    return range;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .pg-wrap {
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          flex-wrap: wrap;
          padding: 12px 0;
        }

        .pg-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 40px;
          height: 40px;
          padding: 0 10px;
          border-radius: 10px;
          border: 1.5px solid #e5e7eb;
          background: #fff;
          color: #374151;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          outline: none;
          user-select: none;
          white-space: nowrap;
        }
        .pg-btn:hover:not(:disabled):not(.pg-active) {
          border-color: #7e0000;
          color: #7e0000;
          background: #fff0f0;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(126, 0, 0, 0.12);
        }
        .pg-btn:active:not(:disabled) {
          transform: scale(0.95) translateY(0);
        }
        .pg-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          border-color: #e5e7eb;
        }

        .pg-active {
          background: linear-gradient(135deg, #7e0000, #9a0000);
          border-color: transparent;
          color: #fff;
          box-shadow: 0 4px 14px rgba(126, 0, 0, 0.35);
          transform: translateY(-1px);
          cursor: default;
        }

        .pg-nav {
          gap: 5px;
          font-weight: 600;
          font-size: 0.8rem;
          letter-spacing: 0.04em;
          padding: 0 14px;
        }
        .pg-nav-icon {
          font-size: 0.75rem;
        }

        .pg-ellipsis {
          display: inline-flex;
          align-items: flex-end;
          justify-content: center;
          min-width: 36px;
          height: 40px;
          color: #9ca3af;
          font-size: 1rem;
          letter-spacing: 0.08em;
          padding-bottom: 4px;
          cursor: default;
          user-select: none;
        }

        .pg-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .pg-counter {
          font-size: 0.75rem;
          color: #9ca3af;
          font-weight: 500;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        @media (max-width: 480px) {
          .pg-btn { min-width: 36px; height: 36px; font-size: 0.8rem; }
          .pg-nav { padding: 0 10px; font-size: 0.75rem; }
          .pg-counter { display: none; }
        }
      `}</style>

      <div className="pg-wrap">
        {/* Prev */}
        <button
          className="pg-btn pg-nav"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <span className="pg-nav-icon">‹</span> Prev
        </button>

        {/* Page numbers */}
        <div className="pg-info">
          {getPageNumbers().map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="pg-ellipsis">···</span>
            ) : (
              <button
                key={p}
                className={`pg-btn ${page === p ? "pg-active" : ""}`}
                onClick={() => page !== p && setPage(p)}
                aria-label={`Page ${p}`}
                aria-current={page === p ? "page" : undefined}
              >
                {p}
              </button>
            )
          )}
        </div>

        {/* Next */}
        <button
          className="pg-btn pg-nav"
          onClick={() => setPage(page + 1)}
          disabled={page === pages}
          aria-label="Next page"
        >
          Next <span className="pg-nav-icon">›</span>
        </button>
      </div>
    </>
  );
};

export default Pagination;