import React from 'react';
import { Scroll, Sparkles } from 'lucide-react';

export function UnsentTurn() {
  return (
    <section className="turn-section reveal" aria-label="The Narrative Turning Point">
      <div className="turn-watermark" aria-hidden="true">UNSENT</div>
      <div className="turn-container">
        <div className="turn-kicker">
          <span>Then the letters stopped.</span>
        </div>
        <h2 className="turn-heading">
          But there was one more.
        </h2>
        <p className="turn-paragraph">
          It was written with the same care. Folded with the same devotion. But kept away in a cedar drawer.
          Not because it was forgotten — but because some chapters must listen before they speak,
          and some homes must be dreamt together before the stone is laid.
        </p>
        <div className="turn-seal-stamp">
          <Scroll size={18} className="scroll-icon" />
          <span>Chapter Two · The Listening Chapter</span>
        </div>
      </div>

      <style>{`
        .turn-section {
          background: linear-gradient(135deg, var(--maroon) 0%, var(--maroon-dark) 100%);
          color: #f6ead5;
          padding: 120px clamp(20px, 9vw, 140px);
          position: relative;
          overflow: hidden;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        }
        .turn-watermark {
          position: absolute;
          right: -2vw;
          bottom: -4vw;
          font-family: var(--font-display);
          font-size: 21vw;
          line-height: 0.8;
          color: rgba(255, 255, 255, 0.035);
          font-weight: 700;
          letter-spacing: -0.06em;
          user-select: none;
          pointer-events: none;
        }
        .turn-container {
          position: relative;
          z-index: 2;
          max-width: 980px;
          margin: 0 auto;
        }
        .turn-kicker {
          font-family: var(--font-mono);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #d8c4ad;
          font-size: 11.5px;
          margin-bottom: 22px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .turn-kicker::before {
          content: "";
          display: inline-block;
          width: 24px;
          height: 1px;
          background: #d8c4ad;
          opacity: 0.6;
        }
        .turn-heading {
          font-family: var(--font-display);
          font-size: clamp(44px, 6.8vw, 96px);
          line-height: 0.94;
          margin: 0 0 28px;
          letter-spacing: -0.045em;
          color: #fff9f0;
          font-weight: 600;
        }
        .turn-paragraph {
          font-family: var(--font-mono);
          max-width: 680px;
          line-height: 1.85;
          color: #dac7b0;
          font-size: 14px;
          margin-bottom: 36px;
        }
        .turn-seal-stamp {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.16);
          padding: 8px 18px;
          border-radius: var(--radius-full);
          font-family: var(--font-mono);
          font-size: 11px;
          color: #f1dfca;
          letter-spacing: 0.06em;
        }
        .scroll-icon {
          color: var(--gold-light);
        }
        @media (max-width: 768px) {
          .turn-section {
            padding: 80px 20px;
          }
        }
      `}</style>
    </section>
  );
}
