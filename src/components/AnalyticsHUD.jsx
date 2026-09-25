import React, { useState } from 'react';
import { Activity, X, Trash2, CheckCircle2, ChevronUp, ChevronDown, Layers, Terminal } from 'lucide-react';

export function AnalyticsHUD({ events, isOpen, onClose, onClearEvents }) {
  const [minimized, setMinimized] = useState(false);

  if (!isOpen) return null;

  return (
    <aside className="analytics-hud-drawer" aria-label="Real-Time Analytics & Telemetry Inspector">
      <div className="hud-header">
        <div className="hud-title-col">
          <Activity size={16} className="hud-pulse" />
          <span className="hud-title">Live Telemetry Inspector</span>
          <span className="hud-badge">{events.length}</span>
        </div>
        <div className="hud-controls">
          <button
            type="button"
            className="hud-btn-icon"
            onClick={() => setMinimized(!minimized)}
            title={minimized ? "Expand Inspector" : "Collapse"}
          >
            {minimized ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
          <button
            type="button"
            className="hud-btn-icon"
            onClick={onClearEvents}
            title="Clear Event Stream"
          >
            <Trash2 size={14} />
          </button>
          <button
            type="button"
            className="hud-btn-icon close-hud"
            onClick={onClose}
            title="Close Inspector"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {!minimized && (
        <div className="hud-body">
          <div className="hud-meta-bar">
            <span>dataLayer / GA4 Stream (Latest First)</span>
            <span>window.dataLayer</span>
          </div>

          <div className="hud-stream">
            {events.length === 0 ? (
              <div className="hud-empty">
                <Terminal size={20} />
                <span>No events captured yet. Scroll, click preferences, or touch the seal to view real-time signals.</span>
              </div>
            ) : (
              events.map((ev, i) => (
                <div key={ev.id || i} className="hud-event-row">
                  <div className="hud-event-header">
                    <span className="hud-event-name">{ev.event}</span>
                    <span className="hud-event-time">
                      {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  {ev.payload && Object.keys(ev.payload).length > 0 && (
                    <pre className="hud-payload">
                      {JSON.stringify(ev.payload, null, 2)}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style>{`
        .analytics-hud-drawer {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 150;
          width: clamp(320px, 32vw, 440px);
          max-height: 520px;
          background: #1c1815;
          border: 1px solid rgba(255, 235, 204, 0.18);
          border-radius: var(--radius-md);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.55);
          color: #e5d7c3;
          font-family: var(--font-mono);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hud-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: #25201c;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .hud-title-col {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .hud-pulse {
          color: #55ba84;
          animation: pulse 1.6s infinite ease-in-out;
        }
        .hud-title {
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #f7eedb;
        }
        .hud-badge {
          background: var(--maroon);
          color: #fff;
          font-size: 9.5px;
          padding: 1px 6px;
          border-radius: 8px;
        }
        .hud-controls {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .hud-btn-icon {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: #c5b59f;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .hud-btn-icon:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
        }
        .close-hud:hover {
          background: var(--maroon);
          border-color: var(--maroon);
        }
        .hud-body {
          display: flex;
          flex-direction: column;
          max-height: 440px;
        }
        .hud-meta-bar {
          display: flex;
          justify-content: space-between;
          padding: 8px 16px;
          background: #14110e;
          font-size: 9.5px;
          color: #8c7d6d;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }
        .hud-stream {
          padding: 12px 14px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 380px;
        }
        .hud-empty {
          text-align: center;
          padding: 30px 10px;
          font-size: 11px;
          color: #796c5f;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .hud-event-row {
          background: #231e1a;
          border-left: 3px solid #a97835;
          padding: 8px 10px;
          border-radius: 4px;
          font-size: 11px;
        }
        .hud-event-row:nth-child(odd) {
          border-left-color: #55ba84;
        }
        .hud-event-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        .hud-event-name {
          font-weight: 700;
          color: #f7eedb;
          font-size: 11.5px;
        }
        .hud-event-time {
          font-size: 9.5px;
          color: #8c7d6d;
        }
        .hud-payload {
          background: #14110f;
          padding: 6px 8px;
          border-radius: 4px;
          font-size: 10px;
          color: #c4b5a2;
          overflow-x: auto;
          max-height: 120px;
          margin-top: 4px;
        }
        @media (max-width: 640px) {
          .analytics-hud-drawer {
            right: 12px;
            bottom: 12px;
            width: calc(100vw - 24px);
          }
        }
      `}</style>
    </aside>
  );
}
