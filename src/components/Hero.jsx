import React from 'react';
import { ArrowDown, Mail, Compass, Sparkles } from 'lucide-react';

export function Hero({ onTrackEvent }) {
  const handleCtaClick = (e, targetId, eventName) => {
    e.preventDefault();
    if (onTrackEvent) {
      onTrackEvent(eventName, { cta: targetId });
    }
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section" id="top" aria-label="Hero Introduction">
      <div className="hero-grid">
        <div className="hero-content reveal">
          <div className="eyebrow">
            <span>Dear Pune · Chapter Two</span>
          </div>

          <h1 className="hero-title">
            DEAR <span className="highlight-maroon">PUNE,</span>
          </h1>

          <h2 className="hero-subtitle">
            We wrote you many letters.<br />
            <strong>There was one we never sent.</strong>
          </h2>

          <p className="hero-narrative">
            Not because we forgot. Because some things are better revealed when the time is right.
            You saw the letters about Pune’s gentle mornings, sudden monsoons, resilient trees, and old wadas.
            This is the one that stayed behind — waiting for what comes next.
          </p>

          <div className="hero-actions">
            <a
              href="#sent"
              className="hero-cta-main"
              onClick={(e) => handleCtaClick(e, 'sent', 'hero_cta_why_unsent')}
            >
              <span>Why was it never sent?</span>
              <ArrowDown size={15} className="cta-arrow" />
            </a>

            <a
              href="#your-say"
              className="hero-cta-sub"
              onClick={(e) => handleCtaClick(e, 'your-say', 'hero_cta_speak_mind')}
            >
              <Compass size={14} />
              <span>Share your preference</span>
            </a>
          </div>

          <div className="hero-micro-stats">
            <div className="stat-pill">
              <span className="stat-num">04</span>
              <span className="stat-label">Sent Letters</span>
            </div>
            <div className="stat-divider">·</div>
            <div className="stat-pill">
              <span className="stat-num">01</span>
              <span className="stat-label">Unsent Truth</span>
            </div>
            <div className="stat-divider">·</div>
            <div className="stat-pill">
              <span className="stat-num">∞</span>
              <span className="stat-label">Punekar Voices</span>
            </div>
          </div>
        </div>

        <div className="hero-art-wrapper reveal">
          <div className="hero-frame">
            <img
              src="/images/hero-letter.webp"
              alt="The unsent letter to Pune - Swastik Realty Group"
              className="hero-letter-img"
              width="680"
              height="680"
              loading="eager"
            />
            <div className="wax-seal-badge" aria-hidden="true">
              <div className="wax-seal-inner">
                <span className="seal-text-top">WRITTEN</span>
                <span className="seal-text-mid">NOT SENT</span>
                <span className="seal-text-bot">· PUNE ·</span>
              </div>
            </div>
          </div>
          <div className="hero-shadow-glow"></div>
        </div>
      </div>

      <style>{`
        .hero-section {
          min-height: 88vh;
          display: flex;
          align-items: center;
          padding: 68px clamp(20px, 7vw, 110px) 80px;
          position: relative;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          align-items: center;
          gap: clamp(32px, 5vw, 80px);
          max-width: 1440px;
          margin: 0 auto;
          width: 100%;
        }
        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(54px, 8.2vw, 126px);
          line-height: 0.84;
          margin: 0 0 24px;
          letter-spacing: -0.055em;
          color: var(--ink);
          font-weight: 700;
        }
        .highlight-maroon {
          color: var(--maroon);
          font-style: italic;
        }
        .hero-subtitle {
          font-family: var(--font-display);
          font-weight: 400;
          font-size: clamp(26px, 3.6vw, 54px);
          line-height: 1.06;
          margin: 0 0 22px;
          max-width: 780px;
          letter-spacing: -0.03em;
          color: #38312b;
        }
        .hero-subtitle strong {
          font-weight: 600;
          color: var(--maroon);
        }
        .hero-narrative {
          font-family: var(--font-mono);
          max-width: 620px;
          line-height: 1.8;
          color: #5c4f43;
          font-size: 13.5px;
          margin-bottom: 32px;
        }
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 16px;
          margin-bottom: 36px;
        }
        .hero-cta-main {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 14px 24px;
          border: 1px solid var(--ink);
          border-radius: var(--radius-full);
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          background: transparent;
          color: var(--ink);
          transition: all 0.26s ease;
        }
        .hero-cta-main:hover {
          background: var(--ink);
          color: var(--paper-soft);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(43, 39, 35, 0.22);
        }
        .cta-arrow {
          transition: transform 0.25s ease;
        }
        .hero-cta-main:hover .cta-arrow {
          transform: translateY(3px);
        }
        .hero-cta-sub {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 20px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(116, 42, 34, 0.3);
          color: var(--maroon);
          font-family: var(--font-mono);
          font-size: 12px;
          background: rgba(116, 42, 34, 0.05);
          transition: all 0.24s ease;
        }
        .hero-cta-sub:hover {
          background: var(--maroon);
          color: #fff;
          border-color: var(--maroon);
          transform: translateY(-2px);
        }
        .hero-micro-stats {
          display: flex;
          align-items: center;
          gap: 14px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--muted);
          padding-top: 14px;
          border-top: 1px dashed rgba(56, 41, 28, 0.16);
          max-width: 520px;
        }
        .stat-pill {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .stat-num {
          font-weight: 700;
          color: var(--maroon);
          font-size: 12px;
        }
        .stat-divider {
          color: rgba(56, 41, 28, 0.3);
        }
        .hero-art-wrapper {
          position: relative;
        }
        .hero-frame {
          background: #e4d1b1;
          padding: 14px;
          border-radius: 26px;
          box-shadow: var(--shadow);
          transform: rotate(1.2deg);
          border: 1px solid rgba(64, 46, 28, 0.24);
          position: relative;
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hero-frame:hover {
          transform: rotate(0deg) translateY(-4px);
        }
        .hero-letter-img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 18px;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          filter: contrast(1.02);
        }
        .wax-seal-badge {
          position: absolute;
          right: -24px;
          bottom: -24px;
          width: 128px;
          height: 128px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          transform: rotate(-12deg);
          background: radial-gradient(circle at 35% 30%, #8d362c, var(--maroon-dark));
          border: 3px solid rgba(239, 227, 202, 0.85);
          box-shadow: 0 12px 30px rgba(88, 29, 22, 0.45), inset 0 2px 6px rgba(255, 255, 255, 0.25);
          cursor: default;
          user-select: none;
          transition: transform 0.3s ease;
        }
        .hero-frame:hover .wax-seal-badge {
          transform: rotate(-5deg) scale(1.05);
        }
        .wax-seal-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          text-align: center;
          color: #f7eedb;
          letter-spacing: 0.08em;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        }
        .seal-text-top {
          font-size: 10px;
          opacity: 0.9;
        }
        .seal-text-mid {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
        }
        .seal-text-bot {
          font-size: 9.5px;
          opacity: 0.75;
          margin-top: 2px;
        }
        .hero-shadow-glow {
          position: absolute;
          inset: 10%;
          background: radial-gradient(circle, rgba(169, 120, 53, 0.15) 0%, transparent 70%);
          z-index: -1;
          filter: blur(40px);
        }
        @media (max-width: 980px) {
          .hero-section {
            padding-top: 48px;
            min-height: auto;
          }
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .hero-art-wrapper {
            max-width: 540px;
            margin: 0 auto;
          }
        }
        @media (max-width: 580px) {
          .hero-section {
            padding: 36px 18px 60px;
          }
          .hero-title {
            font-size: 58px;
          }
          .hero-subtitle {
            font-size: 24px;
          }
          .wax-seal-badge {
            width: 96px;
            height: 96px;
            right: -10px;
            bottom: -16px;
          }
          .seal-text-top { font-size: 8px; }
          .seal-text-mid { font-size: 10px; }
          .seal-text-bot { font-size: 7.5px; }
        }
      `}</style>
    </section>
  );
}
