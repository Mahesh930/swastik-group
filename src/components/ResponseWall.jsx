import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Heart, Sparkles, Filter, Search, MessageSquareQuote, ChevronLeft, ChevronRight } from 'lucide-react';

// Persist which reactions the current user has clicked
const REACTED_KEY = 'dear_pune_reacted';

function getReactedMap() {
  try {
    return JSON.parse(localStorage.getItem(REACTED_KEY) || '{}');
  } catch {
    return {};
  }
}

function markReacted(id, type) {
  const map = getReactedMap();
  if (!map[id]) map[id] = {};
  map[id][type] = true;
  localStorage.setItem(REACTED_KEY, JSON.stringify(map));
  return map;
}

function unmarkReacted(id, type) {
  const map = getReactedMap();
  if (map[id]) {
    delete map[id][type];
    if (Object.keys(map[id]).length === 0) {
      delete map[id];
    }
  }
  localStorage.setItem(REACTED_KEY, JSON.stringify(map));
  return map;
}

function hasReacted(id, type) {
  const map = getReactedMap();
  return !!(map[id] && map[id][type]);
}

const ITEMS_PER_PAGE = 6;

export function ResponseWall({ preferences, onReaction, onTrackEvent }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [reactedState, setReactedState] = useState(getReactedMap());
  const [animatedIds, setAnimatedIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef(null);

  const filterChips = [
    { label: 'All Reflections', value: 'all' },
    { label: '🌿 Nature First', value: 'More nature' },
    { label: '🏡 More Space', value: 'More space' },
    { label: '🕊️ Privacy & Calm', value: 'More privacy' },
    { label: '🍃 Greener Views', value: 'A greener view' }
  ];

  const handleFilterClick = (val) => {
    setFilter(val);
    setCurrentPage(1); // Reset to first page on filter change
    if (onTrackEvent) {
      onTrackEvent('P2_Wall_Filter_Click', { filter: val });
    }
  };

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setCurrentPage(1); // Reset to first page on search
  };

  // Proper like / unlike toggle logic
  const handleReactionClick = useCallback((id, type, e) => {
    e.stopPropagation();

    const alreadyLiked = hasReacted(id, type);
    const action = alreadyLiked ? 'remove' : 'add';

    let updatedMap;
    if (alreadyLiked) {
      updatedMap = unmarkReacted(id, type);
    } else {
      updatedMap = markReacted(id, type);
    }

    setReactedState({ ...updatedMap });

    if (onReaction) {
      onReaction(id, type, action);
    }
    if (onTrackEvent) {
      onTrackEvent('P2_Wall_Reaction', { thought_id: id, reaction: type, action });
    }
  }, [onReaction, onTrackEvent]);

  const filteredItems = preferences.filter(item => {
    const matchesFilter =
      filter === 'all' ||
      item.luxury === filter ||
      item.home === filter;
    const matchesSearch =
      !searchTerm ||
      item.thought.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === activePage) return;
    setCurrentPage(newPage);

    // Smooth scroll back to top of the wall section
    const wallElem = document.getElementById('wall');
    if (wallElem) {
      wallElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Stagger entrance animation using IntersectionObserver
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.noteId;
            if (id) {
              setAnimatedIds(prev => new Set(prev).add(id));
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const cards = grid.querySelectorAll('.note-card');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [currentItems, activePage]);

  return (
    <div className="response-wall-section" aria-label="Community Thought Wall">
      <div className="wall-header reveal">
        <div className="wall-title-col">
          <span className="wall-badge">Live Submissions</span>
          <h3 className="wall-main-heading">Pune is already answering.</h3>
          <p className="wall-sub-note">
            Authentic reflections submitted by residents across the city.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="wall-controls">
          <div className="search-wrap">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search thoughts or areas..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-chips">
            {filterChips.map(chip => (
              <button
                key={chip.value}
                type="button"
                className={`filter-chip ${filter === chip.value ? 'active' : ''}`}
                onClick={() => handleFilterClick(chip.value)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Thoughts Grid */}
      <div className="wall-grid" id="wall" ref={gridRef}>
        {filteredItems.length === 0 ? (
          <div className="no-thoughts-empty">
            <MessageSquareQuote size={32} className="empty-icon" />
            <p>No thoughts found matching this filter. Be the first to add one above!</p>
          </div>
        ) : (
          currentItems.map((item, index) => {
            // Organic tilt rotation to each pinboard note
            const rotations = ['-0.8deg', '0.6deg', '-0.4deg', '0.9deg', '-0.5deg', '0.4deg'];
            const r = rotations[index % rotations.length];

            const heartReacted = hasReacted(item.id, 'heart');
            const sparkleReacted = hasReacted(item.id, 'truePune');
            const isVisible = animatedIds.has(item.id);

            return (
              <div
                key={item.id}
                data-note-id={item.id}
                className={`note-card ${isVisible ? 'note-visible' : 'note-hidden'}`}
                style={{
                  '--r': r,
                  '--stagger': `${index * 0.07}s`
                }}
              >
                <div className="note-card-top">
                  <div className="tags-row">
                    {item.luxury && item.luxury !== 'Unspecified' && (
                      <span className="tag-luxury">{item.luxury}</span>
                    )}
                    {item.home && item.home !== 'Unspecified' && (
                      <span className="tag-home">{item.home}</span>
                    )}
                  </div>
                </div>

                <p className="note-body">"{item.thought}"</p>

                <div className="note-footer">
                  <span className="note-author">— {item.author || 'A Punekar'}</span>
                  
                  {/* Reaction Buttons - Proper Like / Unlike Toggling */}
                  <div className="reaction-group">
                    <button
                      type="button"
                      className={`reaction-btn ${heartReacted ? 'reacted heart-active' : ''}`}
                      onClick={(e) => handleReactionClick(item.id, 'heart', e)}
                      title={heartReacted ? 'Liked! Click to unlike' : 'Click to like'}
                      aria-label={heartReacted ? 'Unlike reflection' : 'Like reflection'}
                    >
                      <Heart
                        size={12}
                        className={`heart-icon ${heartReacted ? 'filled' : ''}`}
                        fill={heartReacted ? 'currentColor' : 'none'}
                      />
                      <span>{item.reactions?.heart || 0}</span>
                    </button>

                    <button
                      type="button"
                      className={`reaction-btn ${sparkleReacted ? 'reacted sparkle-active' : ''}`}
                      onClick={(e) => handleReactionClick(item.id, 'truePune', e)}
                      title={sparkleReacted ? 'Resonated! Click to remove' : 'True Pune sentiment'}
                      aria-label={sparkleReacted ? 'Remove resonance' : 'Mark as true Pune sentiment'}
                    >
                      <Sparkles
                        size={12}
                        className={`sparkle-icon ${sparkleReacted ? 'filled' : ''}`}
                        fill={sparkleReacted ? 'currentColor' : 'none'}
                      />
                      <span>{item.reactions?.truePune || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {filteredItems.length > 0 && (
        <div className="wall-pagination-bar">
          <div className="pagination-count-info">
            Showing <span className="highlight-num">{startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredItems.length)}</span> of <span className="highlight-num">{filteredItems.length}</span> reflections
          </div>

          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                type="button"
                className="pagination-arrow-btn"
                onClick={() => handlePageChange(activePage - 1)}
                disabled={activePage === 1}
                aria-label="Previous Page"
              >
                <ChevronLeft size={16} />
                <span>Prev</span>
              </button>

              <div className="pagination-pages-list">
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    className={`pagination-number-btn ${pageNum === activePage ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                    aria-label={`Page ${pageNum}`}
                    aria-current={pageNum === activePage ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="pagination-arrow-btn"
                onClick={() => handlePageChange(activePage + 1)}
                disabled={activePage === totalPages}
                aria-label="Next Page"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        .response-wall-section {
          margin-top: 60px;
          padding-top: 40px;
          border-top: 1px dashed var(--line);
        }
        .wall-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .wall-badge {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--green-dark);
          background: rgba(49, 95, 73, 0.12);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          margin-bottom: 8px;
          font-weight: 700;
        }
        .wall-main-heading {
          font-family: var(--font-display);
          font-size: clamp(28px, 4vw, 42px);
          line-height: 1.1;
          color: var(--ink);
          margin-bottom: 6px;
        }
        .wall-sub-note {
          font-family: var(--font-mono);
          color: var(--muted);
          font-size: 11.5px;
        }
        .wall-controls {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-end;
        }
        .search-wrap {
          position: relative;
          width: 100%;
          max-width: 280px;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted);
        }
        .search-input {
          width: 100%;
          padding: 7px 12px 7px 32px;
          border-radius: var(--radius-full);
          border: 1px solid var(--line-strong);
          background: #fbf5e8;
          font-family: var(--font-mono);
          font-size: 11px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .search-input:focus {
          border-color: var(--maroon);
          background: #fff;
        }
        .filter-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          justify-content: flex-end;
        }
        .filter-chip {
          padding: 5px 12px;
          border-radius: var(--radius-full);
          font-family: var(--font-mono);
          font-size: 11px;
          background: rgba(255, 255, 255, 0.4);
          border: 1px solid rgba(56, 41, 28, 0.18);
          color: var(--ink);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .filter-chip:hover {
          background: rgba(43, 39, 35, 0.08);
        }
        .filter-chip.active {
          background: var(--ink);
          color: #fff;
          border-color: var(--ink);
        }
        .wall-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        /* Staggered entrance animation */
        .note-hidden {
          opacity: 0;
          transform: translateY(32px) rotate(var(--r, 0deg)) scale(0.94);
        }
        .note-visible {
          opacity: 1;
          transform: rotate(var(--r, 0deg)) scale(1);
          animation: noteEnter 0.55s cubic-bezier(0.16, 1, 0.3, 1) var(--stagger, 0s) both;
        }
        @keyframes noteEnter {
          from {
            opacity: 0;
            transform: translateY(32px) rotate(var(--r, 0deg)) scale(0.94);
          }
          to {
            opacity: 1;
            transform: translateY(0) rotate(var(--r, 0deg)) scale(1);
          }
        }

        .note-card {
          min-height: 180px;
          padding: 22px;
          background: #f8eee0;
          border: 1px solid rgba(82, 57, 34, 0.18);
          border-radius: 4px;
          box-shadow: 0 10px 28px rgba(61, 45, 28, 0.08);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          position: relative;
        }
        .note-card:hover {
          transform: rotate(0deg) translateY(-4px) scale(1.02) !important;
          box-shadow: 0 16px 38px rgba(61, 45, 28, 0.14);
          z-index: 5;
        }
        .note-card-top {
          margin-bottom: 12px;
        }
        .tags-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .tag-luxury, .tag-home {
          font-family: var(--font-mono);
          font-size: 9.5px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 2px 7px;
          border-radius: 4px;
        }
        .tag-luxury {
          background: rgba(49, 95, 73, 0.12);
          color: var(--green-dark);
          border: 1px solid rgba(49, 95, 73, 0.25);
        }
        .tag-home {
          background: rgba(169, 120, 53, 0.12);
          color: var(--gold);
          border: 1px solid rgba(169, 120, 53, 0.25);
        }
        .note-body {
          font-family: var(--font-serif);
          font-size: 19px;
          line-height: 1.35;
          margin: 0 0 16px;
          color: #2b2723;
        }
        .note-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-top: 1px dashed rgba(56, 41, 28, 0.14);
          padding-top: 12px;
        }
        .note-author {
          font-family: var(--font-mono);
          color: #8a7460;
          font-size: 11px;
        }
        .reaction-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .reaction-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 9px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(56, 41, 28, 0.16);
          background: rgba(255, 255, 255, 0.7);
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--muted);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          user-select: none;
        }
        .reaction-btn:hover {
          background: #fff;
          border-color: var(--maroon);
          color: var(--maroon);
          transform: translateY(-1px) scale(1.06);
          box-shadow: 0 2px 8px rgba(116, 42, 34, 0.12);
        }
        .reaction-btn:active {
          transform: scale(0.92);
        }

        /* Active reacted state */
        .reaction-btn.reacted.heart-active {
          background: rgba(116, 42, 34, 0.12);
          border-color: var(--maroon);
          color: var(--maroon);
          font-weight: 700;
        }
        .reaction-btn.reacted.sparkle-active {
          background: rgba(169, 120, 53, 0.14);
          border-color: var(--gold);
          color: var(--gold);
          font-weight: 700;
        }

        .heart-icon {
          color: var(--maroon);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reaction-btn.reacted .heart-icon {
          transform: scale(1.15);
        }
        .sparkle-icon {
          color: var(--gold);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reaction-btn.reacted .sparkle-icon {
          transform: scale(1.15);
        }

        /* Pagination Styling */
        .wall-pagination-bar {
          margin-top: 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.45);
          border: 1px solid rgba(56, 41, 28, 0.12);
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
        }
        .pagination-count-info {
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--muted);
        }
        .pagination-count-info .highlight-num {
          color: var(--ink);
          font-weight: 700;
        }
        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .pagination-arrow-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 12px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(56, 41, 28, 0.18);
          background: #fff;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--ink);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .pagination-arrow-btn:hover:not(:disabled) {
          background: var(--ink);
          color: #fff;
          border-color: var(--ink);
        }
        .pagination-arrow-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          background: rgba(0, 0, 0, 0.03);
          border-color: rgba(56, 41, 28, 0.08);
        }
        .pagination-pages-list {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .pagination-number-btn {
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-full);
          border: 1px solid rgba(56, 41, 28, 0.14);
          background: transparent;
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--ink);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .pagination-number-btn:hover:not(.active) {
          background: rgba(0, 0, 0, 0.06);
          border-color: rgba(56, 41, 28, 0.3);
        }
        .pagination-number-btn.active {
          background: var(--maroon);
          color: #fff;
          border-color: var(--maroon);
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(116, 42, 34, 0.25);
        }

        .no-thoughts-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 50px 20px;
          background: rgba(255, 255, 255, 0.3);
          border: 1px dashed var(--line);
          border-radius: var(--radius-md);
          font-family: var(--font-mono);
          color: var(--muted);
          font-size: 13px;
        }
        .empty-icon {
          margin: 0 auto 12px;
          opacity: 0.4;
          color: var(--maroon);
        }
        @media (max-width: 980px) {
          .wall-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .wall-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .wall-controls {
            align-items: flex-start;
            width: 100%;
          }
          .search-wrap {
            max-width: 100%;
          }
          .filter-chips {
            justify-content: flex-start;
          }
          .wall-pagination-bar {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
        }
        @media (max-width: 640px) {
          .wall-grid {
            grid-template-columns: 1fr;
          }
          .note-body {
            font-size: 16px;
          }
          .pagination-controls {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
