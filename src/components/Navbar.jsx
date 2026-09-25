import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, BarChart3, Activity, ShieldCheck, Sparkles, Feather } from 'lucide-react';

export function Navbar({
  onToggleAdmin,
  onToggleAnalytics,
  analyticsOpen,
  ambientPlaying,
  onToggleAmbient,
  totalEvents
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`nav-header ${scrolled ? 'nav-scrolled' : ''}`}
      role="banner"
    >
      <div className="nav-container">
        <a href="#top" className="brand-link" aria-label="Swastik Realty Group - Return to top">
          <img
            src="/images/logo.webp"
            alt="Swastik Realty Group"
            className="brand-logo"
            width="142"
            height="46"
            loading="eager"
          />
        </a>

        <div className="nav-center-note">
          <span className="dot-indicator"></span>
          <span>Dear Pune · Chapter Two · The Unsent Letter</span>
        </div>

        <div className="nav-actions">
          {/* Ambient Rain & Pune Chimes Audio Generator */}
          <button
            type="button"
            className={`nav-btn ${ambientPlaying ? 'active-audio' : ''}`}
            onClick={onToggleAmbient}
            title={ambientPlaying ? "Pause Pune Monsoon Ambience" : "Play Pune Monsoon Ambience"}
            aria-label={ambientPlaying ? "Mute monsoon sound" : "Unmute monsoon sound"}
          >
            {ambientPlaying ? <Volume2 size={16} className="pulse-icon" /> : <VolumeX size={16} />}
            <span className="nav-btn-label">{ambientPlaying ? "Rain On" : "Ambience"}</span>
          </button>

          {/* Real-Time Telemetry HUD Toggle */}
          <button
            type="button"
            className={`nav-btn ${analyticsOpen ? 'active-hud' : ''}`}
            onClick={onToggleAnalytics}
            title="Inspect Live GA4 / dataLayer Events"
            aria-label="Toggle Real-Time Telemetry Inspector"
          >
            <Activity size={16} className={analyticsOpen ? 'rotate-pulse' : ''} />
            <span className="nav-btn-label">Events</span>
            {totalEvents > 0 && <span className="event-badge">{totalEvents}</span>}
          </button>

          {/* Admin Dashboard */}
          <button
            type="button"
            className="nav-btn admin-btn"
            onClick={onToggleAdmin}
            title="Open Admin & Response Analytics"
            aria-label="Open HR / Admin Analytics Console"
          >
            <BarChart3 size={16} />
            <span className="nav-btn-label">Admin Console</span>
          </button>
        </div>
      </div>

      <style>{`
        .nav-header {
          position: sticky;
          top: 0;
          z-index: 90;
          padding: 14px clamp(16px, 5vw, 64px);
          background: rgba(247, 238, 220, 0.90);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(76, 53, 34, 0.12);
          transition: all 0.3s ease;
        }
        .nav-scrolled {
          background: rgba(245, 234, 214, 0.96);
          box-shadow: 0 4px 20px rgba(66, 48, 31, 0.08);
          padding-top: 10px;
          padding-bottom: 10px;
        }
        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          max-width: 1440px;
          margin: 0 auto;
        }
        .brand-link {
          display: block;
          transition: transform 0.25s ease;
        }
        .brand-link:hover {
          transform: translateY(-1px);
        }
        .brand-logo {
          display: block;
          mix-blend-mode: multiply;
          width: clamp(118px, 14vw, 142px);
          height: auto;
        }
        .nav-center-note {
          display: flex;
          align-items: center;
          gap: 9px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          background: rgba(239, 227, 202, 0.6);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(76, 53, 34, 0.10);
        }
        .dot-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--maroon);
          box-shadow: 0 0 6px rgba(116, 42, 34, 0.6);
          animation: blink 2.4s infinite ease-in-out;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.8); }
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: var(--radius-full);
          background: rgba(255, 250, 239, 0.65);
          border: 1px solid rgba(64, 46, 28, 0.18);
          color: var(--ink);
          font-family: var(--font-mono);
          font-size: 11px;
          cursor: pointer;
          transition: all 0.22s ease;
        }
        .nav-btn:hover {
          background: var(--ink);
          color: var(--paper-soft);
          border-color: var(--ink);
          transform: translateY(-1px);
        }
        .admin-btn {
          background: rgba(116, 42, 34, 0.08);
          border-color: rgba(116, 42, 34, 0.24);
          color: var(--maroon);
          font-weight: 600;
        }
        .admin-btn:hover {
          background: var(--maroon);
          border-color: var(--maroon);
          color: #fff;
        }
        .active-audio {
          background: rgba(49, 95, 73, 0.14);
          border-color: var(--green);
          color: var(--green);
        }
        .active-hud {
          background: rgba(116, 42, 34, 0.14);
          border-color: var(--maroon);
          color: var(--maroon);
        }
        .event-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 17px;
          height: 17px;
          padding: 0 4px;
          border-radius: 9px;
          background: var(--maroon);
          color: #fff;
          font-size: 9.5px;
          font-weight: 700;
        }
        .pulse-icon {
          animation: pulse 1.8s infinite ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @media (max-width: 900px) {
          .nav-center-note {
            display: none;
          }
        }
        @media (max-width: 580px) {
          .nav-btn-label {
            display: none;
          }
          .nav-btn {
            padding: 8px 10px;
          }
        }
      `}</style>
    </header>
  );
}
