import React from 'react';
import { ExternalLink, Shield } from 'lucide-react';

export function Footer({ onToggleAdmin }) {
  return (
    <footer className="footer-section" role="contentinfo">
      <div className="footer-container">
        <div className="footer-brand-col">
          <a href="#top" aria-label="Swastik Realty Group">
            <img
              src="/images/logo.webp"
              alt="Swastik Realty Group"
              className="footer-logo"
              width="138"
              height="44"
              loading="lazy"
            />
          </a>
          <span className="footer-tagline">
            Dear Pune · Chapter Two · The Unsent Letter
          </span>
        </div>

        <div className="footer-links-col">
          <a
            href="https://www.swastikrealtygroup.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <span>www.swastikrealtygroup.com</span>
            <ExternalLink size={12} />
          </a>
          <span className="footer-separator">·</span>
          <button
            type="button"
            className="footer-link-btn"
            onClick={onToggleAdmin}
          >
            <Shield size={12} />
            <span>Admin Console</span>
          </button>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <span>© {new Date().getFullYear()} Swastik Realty Group. Crafted with care for Pune.</span>
      </div>

      <style>{`
        .footer-section {
          border-top: 1px solid var(--line);
          background: rgba(244, 233, 212, 0.7);
          padding: 40px clamp(20px, 7vw, 110px) 24px;
          font-family: var(--font-mono);
          color: #786a5d;
          font-size: 11px;
        }
        .footer-container {
          max-width: 1440px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
          padding-bottom: 24px;
          border-bottom: 1px dashed rgba(56, 41, 28, 0.12);
        }
        .footer-brand-col {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .footer-logo {
          width: 130px;
          height: auto;
          mix-blend-mode: multiply;
          display: block;
        }
        .footer-tagline {
          font-size: 11px;
          letter-spacing: 0.06em;
          color: var(--muted);
        }
        .footer-links-col {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .footer-link, .footer-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #695a4e;
          font-size: 11px;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .footer-link:hover, .footer-link-btn:hover {
          color: var(--maroon);
        }
        .footer-separator {
          color: rgba(56, 41, 28, 0.3);
        }
        .footer-bottom-bar {
          max-width: 1440px;
          margin: 16px auto 0;
          text-align: center;
          font-size: 10px;
          color: #9c8e82;
        }
        @media (max-width: 680px) {
          .footer-container {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </footer>
  );
}
