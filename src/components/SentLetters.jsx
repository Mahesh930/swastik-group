import React, { useState } from 'react';
import { Sparkles, X, BookOpen, Quote } from 'lucide-react';

const sentLettersData = [
  {
    id: '01',
    status: 'SENT · 01',
    title: 'The First Rain',
    snippet: "The smell Pune recognises before it even starts pouring.",
    narrative: "There is an hour in June when the Western Ghats send their first cool breath across the Mula-Mutha river. Before the first drop hits the asphalt or the red roof tiles of Deccan Gymkhana, every Punekar stops. That petrichor is not weather — it is memory.",
    image: '/images/sent-01-rain.webp',
    accentColor: '#315f49'
  },
  {
    id: '02',
    status: 'SENT · 02',
    title: 'The Mornings',
    snippet: "Chai, cyclists, sunlight and the city before the rush begins.",
    narrative: "6:00 AM on Law College Road. Mist still resting around the canopies of banyan trees. The soft clink of steel cups at the corner Amruttulya, the hum of solitary cyclists climbing toward Vetal Tekdi. This was Pune before speed took over.",
    image: '/images/sent-02-morning.webp',
    accentColor: '#a97835'
  },
  {
    id: '03',
    status: 'SENT · 03',
    title: 'The Trees',
    snippet: "Some became landmarks without ever needing a signboard.",
    narrative: "We never gave directions by street numbers; we gave them by trees. 'Turn left after the old rain tree,' 'wait near the banyan with the stone bench.' In Pune, trees were not landscape decorations — they were neighbors who had lived here longer than any of us.",
    image: '/images/sent-03-trees.webp',
    accentColor: '#2b503d'
  },
  {
    id: '04',
    status: 'SENT · 04',
    title: 'The Character',
    snippet: "The parts of Pune that remind us where the city came from.",
    narrative: "Carved wooden pillars of old wadas, quiet library verandahs, winding alleys in Sadashiv Peth where afternoon siestas were sacred. The city has grown taller, but its heartbeat remains rooted in modesty, intellect, and grace.",
    image: '/images/sent-04-heritage.webp',
    accentColor: '#742a22'
  }
];

export function SentLetters({ onTrackEvent }) {
  const [activeLetter, setActiveLetter] = useState(null);

  const openLetter = (letter) => {
    setActiveLetter(letter);
    if (onTrackEvent) {
      onTrackEvent('P2_Sent_Letter_Inspect', { letter_id: letter.id, title: letter.title });
    }
  };

  const closeLetter = () => {
    setActiveLetter(null);
  };

  return (
    <section className="section sent-section" id="sent" aria-label="Chapter One Sent Letters">
      <div className="section-head reveal">
        <div>
          <div className="eyebrow">
            <span>Chapter One Archive</span>
          </div>
          <h2>You saw the letters we sent.</h2>
        </div>
        <p>
          Chapter One was about what Pune should never lose. These were some of the memories we put into words.
          They were read by thousands. But one letter was withheld.
        </p>
      </div>

      <div className="sent-grid">
        {sentLettersData.map((letter) => (
          <article
            key={letter.id}
            className="sent-card reveal"
            onClick={() => openLetter(letter)}
            role="button"
            tabIndex={0}
            aria-label={`Read letter ${letter.id}: ${letter.title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLetter(letter);
              }
            }}
          >
            <div className="card-media">
              <img
                src={letter.image}
                alt={letter.title}
                className="card-img"
                loading="lazy"
                width="400"
                height="400"
              />
              <span className="card-overlay-hint">
                <BookOpen size={14} /> Read Excerpt
              </span>
            </div>
            <div className="card-copy">
              <span className="card-status">{letter.status}</span>
              <h3 className="card-title">{letter.title}</h3>
              <p className="card-snippet">{letter.snippet}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Modal Lightbox for Letter Archive Reading */}
      {activeLetter && (
        <div
          className="letter-modal-backdrop"
          onClick={closeLetter}
          role="dialog"
          aria-modal="true"
          aria-label={activeLetter.title}
        >
          <div className="letter-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={closeLetter}
              aria-label="Close letter excerpt"
            >
              <X size={18} />
            </button>

            <div className="modal-header">
              <span className="modal-status">{activeLetter.status}</span>
              <h3 className="modal-title">{activeLetter.title}</h3>
            </div>

            <div className="modal-body">
              <div className="modal-image-col">
                <img
                  src={activeLetter.image}
                  alt={activeLetter.title}
                  className="modal-image"
                />
              </div>
              <div className="modal-text-col">
                <Quote size={28} className="quote-icon" />
                <p className="modal-narrative">{activeLetter.narrative}</p>
                <div className="modal-signoff">
                  <span>— From Swastik Realty's Living Letter to Pune</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .sent-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(16px, 2vw, 24px);
        }
        .sent-card {
          position: relative;
          border: 1px solid var(--line);
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--paper-card);
          box-shadow: var(--shadow-sm);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          display: flex;
          flex-direction: column;
        }
        .sent-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-card);
          border-color: rgba(64, 46, 28, 0.35);
        }
        .card-media {
          aspect-ratio: 1 / 1;
          overflow: hidden;
          position: relative;
          background: #e2d2b5;
        }
        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(0.85) sepia(0.06);
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sent-card:hover .card-img {
          transform: scale(1.05);
        }
        .card-overlay-hint {
          position: absolute;
          bottom: 12px;
          right: 12px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(43, 39, 35, 0.85);
          color: #fff;
          font-family: var(--font-mono);
          font-size: 10px;
          padding: 5px 10px;
          border-radius: var(--radius-full);
          opacity: 0;
          transform: translateY(6px);
          transition: all 0.25s ease;
        }
        .sent-card:hover .card-overlay-hint {
          opacity: 1;
          transform: translateY(0);
        }
        .card-copy {
          padding: 20px 22px 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .card-status {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 700;
          margin-bottom: 8px;
        }
        .card-title {
          font-family: var(--font-display);
          font-size: 22px;
          line-height: 1.15;
          margin: 0 0 10px;
          letter-spacing: -0.02em;
          color: var(--ink);
        }
        .card-snippet {
          font-family: var(--font-mono);
          color: #6c5e52;
          line-height: 1.6;
          font-size: 12px;
          margin: 0;
        }

        /* Modal Lightbox */
        .letter-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 120;
          background: rgba(30, 24, 18, 0.72);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.25s ease-out;
        }
        .letter-modal-box {
          background: var(--paper-soft);
          border: 1px solid rgba(64, 46, 28, 0.3);
          border-radius: var(--radius-lg);
          max-width: 720px;
          width: 100%;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.45);
          position: relative;
          padding: clamp(24px, 5vw, 40px);
          animation: modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .modal-close-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(56, 41, 28, 0.08);
          border: 1px solid rgba(56, 41, 28, 0.16);
          color: var(--ink);
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .modal-close-btn:hover {
          background: var(--maroon);
          color: #fff;
        }
        .modal-status {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.16em;
          color: var(--gold);
          font-weight: 700;
          display: block;
          margin-bottom: 6px;
        }
        .modal-title {
          font-family: var(--font-display);
          font-size: clamp(28px, 4vw, 38px);
          margin: 0 0 24px;
          color: var(--ink);
        }
        .modal-body {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 28px;
          align-items: center;
        }
        .modal-image {
          width: 100%;
          border-radius: 14px;
          box-shadow: var(--shadow-sm);
          display: block;
        }
        .quote-icon {
          color: var(--gold);
          opacity: 0.4;
          margin-bottom: 12px;
        }
        .modal-narrative {
          font-family: var(--font-serif);
          font-size: 17px;
          line-height: 1.7;
          color: #38312b;
          margin-bottom: 20px;
        }
        .modal-signoff {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--muted);
          border-top: 1px dashed var(--line);
          padding-top: 12px;
        }
        @media (max-width: 980px) {
          .sent-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .sent-grid {
            grid-template-columns: 1fr;
          }
          .modal-body {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
