import React from 'react';
import { VolumeX, Maximize2, Trees, ShieldCheck, Sparkles } from 'lucide-react';

export function ListeningSection() {
  const clues = [
    {
      icon: VolumeX,
      title: 'Less noise.',
      desc: 'Not everything valuable needs to announce itself loudly. True luxury is having space to hear yourself think.',
      accent: 'var(--maroon)'
    },
    {
      icon: Maximize2,
      title: 'More room.',
      desc: 'Space can be physical square footage, but it is also the psychological ease of never feeling enclosed or overlooked.',
      accent: 'var(--gold)'
    },
    {
      icon: Trees,
      title: 'Closer to nature.',
      desc: 'Perhaps progress and green canopies do not need to be sworn enemies. Real development respects the soil it stands on.',
      accent: 'var(--green)'
    }
  ];

  return (
    <section className="section listen-section" id="listening" aria-label="We Were Listening">
      <div className="listen-grid">
        <div className="listen-media-col reveal">
          <div className="listen-image-frame">
            <img
              src="/images/listen-growth.webp"
              alt="Pune growing toward the horizon - Swastik Realty"
              className="listen-main-img"
              loading="lazy"
              width="640"
              height="640"
            />
            <div className="listen-caption-badge">
              <span>Chapter Two · Direction</span>
            </div>
          </div>
        </div>

        <div className="listen-text-col reveal">
          <div className="eyebrow">
            <span>There was a reason we kept asking</span>
          </div>

          <h2 className="listen-heading">We were listening.</h2>

          <p className="listen-paragraph">
            The mornings. The rain. The trees. The questions. None of them were random.
            They were part of one long, deliberate conversation about how Pune can move forward
            without severing the emotional roots that make living here irreplaceable.
          </p>

          <strong className="listen-mantra">
            Growth is inevitable. Thoughtful growth is a choice.
          </strong>

          <p className="listen-subparagraph">
            The unsent letter carries that philosophy forward. It still does not reveal a project.
            It reveals a standard — that whenever Swastik builds next, it will be shaped by what Pune asked for.
          </p>
        </div>
      </div>

      {/* Three Core Clues */}
      <div className="clues-grid">
        {clues.map((clue, idx) => {
          const Icon = clue.icon;
          return (
            <div key={idx} className="clue-card reveal">
              <div className="clue-icon-wrapper" style={{ color: clue.accent }}>
                <Icon size={24} />
              </div>
              <b className="clue-title">{clue.title}</b>
              <span className="clue-desc">{clue.desc}</span>
            </div>
          );
        })}
      </div>

      <style>{`
        .listen-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: clamp(32px, 5vw, 68px);
          align-items: center;
          margin-bottom: 50px;
        }
        .listen-image-frame {
          position: relative;
          background: #e4d3b6;
          padding: 12px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--line);
          box-shadow: var(--shadow);
        }
        .listen-main-img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: var(--radius-md);
          object-fit: cover;
          aspect-ratio: 1.05 / 1;
        }
        .listen-caption-badge {
          position: absolute;
          bottom: 24px;
          left: 24px;
          background: rgba(43, 39, 35, 0.88);
          color: #fcf6eb;
          font-family: var(--font-mono);
          font-size: 11px;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .listen-heading {
          font-family: var(--font-display);
          font-size: clamp(38px, 5.5vw, 80px);
          line-height: 0.96;
          letter-spacing: -0.04em;
          margin: 0 0 20px;
          color: var(--ink);
        }
        .listen-paragraph {
          font-family: var(--font-mono);
          color: #5d5043;
          line-height: 1.8;
          max-width: 600px;
          font-size: 13.5px;
          margin-bottom: 24px;
        }
        .listen-mantra {
          font-family: var(--font-display);
          font-size: clamp(22px, 2.5vw, 30px);
          color: var(--maroon);
          display: block;
          line-height: 1.25;
          margin: 20px 0 14px;
          font-weight: 600;
        }
        .listen-subparagraph {
          font-family: var(--font-mono);
          color: var(--muted);
          line-height: 1.75;
          max-width: 580px;
          font-size: 12.5px;
        }
        .clues-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          margin-top: 24px;
        }
        .clue-card {
          padding: 28px 24px;
          border: 1px solid var(--line);
          border-radius: var(--radius-lg);
          background: var(--paper-card);
          box-shadow: var(--shadow-sm);
          transition: transform 0.28s ease, box-shadow 0.28s ease;
        }
        .clue-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-card);
        }
        .clue-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.7);
          display: grid;
          place-items: center;
          margin-bottom: 16px;
          border: 1px solid var(--line);
        }
        .clue-title {
          display: block;
          font-family: var(--font-display);
          font-size: 24px;
          margin-bottom: 8px;
          color: var(--ink);
        }
        .clue-desc {
          font-family: var(--font-mono);
          color: #6d6054;
          font-size: 12px;
          line-height: 1.65;
          display: block;
        }
        @media (max-width: 980px) {
          .listen-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .clues-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
