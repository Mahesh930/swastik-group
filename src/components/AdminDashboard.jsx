import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  X,
  Download,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  TrendingUp,
  Compass,
  Trees,
  Maximize2,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';

export function AdminDashboard({ isOpen, onClose, onRefresh, stats, preferences, onDeleteEntry }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'responses' | 'funnel'

  if (!isOpen) return null;

  const total = stats?.total || preferences.length || 0;

  // Calculate percentages helper
  const getPct = (val, tot) => {
    if (!tot) return 0;
    return Math.round((val / tot) * 100);
  };

  // Find top luxury choice
  const luxuryEntries = Object.entries(stats?.luxuryCounts || {}).filter(([k]) => k !== 'Unspecified');
  luxuryEntries.sort((a, b) => b[1] - a[1]);
  const topLuxury = luxuryEntries[0] || ['More nature', 0];

  // Export CSV (robust Blob-based approach with UTF-8 BOM)
  const handleExportCSV = () => {
    const escapeCSV = (val) => {
      const str = String(val ?? '');
      // Escape double quotes by doubling them, wrap in quotes if contains comma/quote/newline
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };

    const headers = [
      'ID',
      'Author / Area',
      'Luxury Preference',
      'Home Priority',
      'Commute Tolerance',
      'Thought / Reflection',
      'Hearts',
      'Resonates',
      'True Pune',
      'Submitted Date',
      'Submitted Time'
    ];

    const rows = preferences.map(p => {
      const d = new Date(p.createdAt);
      return [
        escapeCSV(p.id),
        escapeCSV(p.author || 'A Punekar'),
        escapeCSV(p.luxury),
        escapeCSV(p.home),
        escapeCSV(p.commute),
        escapeCSV(p.thought),
        p.reactions?.heart || 0,
        p.reactions?.resonates || 0,
        p.reactions?.truePune || 0,
        escapeCSV(d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })),
        escapeCSV(d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
      ].join(',');
    });

    // UTF-8 BOM + header + data rows
    const BOM = '\uFEFF';
    const csvString = BOM + headers.join(',') + '\n' + rows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `Swastik-DearPune-Responses-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredPreferences = preferences.filter(p =>
    p.thought.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.author && p.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
    p.luxury.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-overlay" role="dialog" aria-modal="true" aria-label="Admin & Analytics Dashboard">
      <div className="admin-modal">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-brand-info">
            <div className="admin-icon-pill">
              <BarChart3 size={18} />
            </div>
            <div>
              <h2 className="admin-title">Dear Pune · Research & Analytics Console</h2>
              <span className="admin-subtitle">
                Chapter Two Intelligence · Real-time Resident Preferences for Swastik Realty Group
              </span>
            </div>
          </div>

          <div className="admin-head-actions">
            <button
              type="button"
              className="admin-action-btn"
              onClick={handleExportCSV}
              title="Download Data as CSV"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              className="admin-action-btn"
              onClick={onRefresh}
              title="Refresh Data from Server"
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              className="admin-close-btn"
              onClick={onClose}
              title="Close Dashboard"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="admin-tabs">
          <button
            type="button"
            className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Executive Summary & Charts
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'responses' ? 'active' : ''}`}
            onClick={() => setActiveTab('responses')}
          >
            All Responses ({preferences.length})
          </button>
        </div>

        {/* Tab Content: Overview */}
        {activeTab === 'overview' && (
          <div className="admin-content-scroll">
            {/* KPI Cards */}
            <div className="kpi-grid">
              <div className="kpi-card">
                <span className="kpi-label">Total Pune Responses</span>
                <span className="kpi-value">{total}</span>
                <span className="kpi-trend">Live across community wall</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">Top Luxury Mandate</span>
                <span className="kpi-value">{topLuxury[0]}</span>
                <span className="kpi-trend">{getPct(topLuxury[1], total)}% of Punekars agree</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">Nature / Green Priority</span>
                <span className="kpi-value">{getPct((stats?.luxuryCounts?.['More nature'] || 0) + (stats?.homeCounts?.['A greener view'] || 0), total * 2)}%</span>
                <span className="kpi-trend">Dominant emotional driver</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">Commute Trade-off Openness</span>
                <span className="kpi-value">{getPct((stats?.commuteCounts?.['Absolutely'] || 0) + (stats?.commuteCounts?.['Maybe'] || 0), total)}%</span>
                <span className="kpi-trend">Willing to move for calm & green</span>
              </div>
            </div>

            {/* Visual Breakdown Bars */}
            <div className="charts-grid">
              {/* Luxury Preference */}
              <div className="chart-box">
                <div className="chart-title-flex">
                  <Trees size={16} className="chart-icon" />
                  <h4>01 · What feels like real luxury?</h4>
                </div>
                <div className="bars-list">
                  {Object.entries(stats?.luxuryCounts || {})
                    .filter(([k]) => k !== 'Unspecified')
                    .map(([label, count]) => {
                      const pct = getPct(count, total);
                      return (
                        <div key={label} className="bar-row">
                          <div className="bar-labels">
                            <span className="bar-name">{label}</span>
                            <span className="bar-val">{count} ({pct}%)</span>
                          </div>
                          <div className="bar-track">
                            <div className="bar-fill green-fill" style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Home Preference */}
              <div className="chart-box">
                <div className="chart-title-flex">
                  <Maximize2 size={16} className="chart-icon" />
                  <h4>02 · Next home must give more of...</h4>
                </div>
                <div className="bars-list">
                  {Object.entries(stats?.homeCounts || {})
                    .filter(([k]) => k !== 'Unspecified')
                    .map(([label, count]) => {
                      const pct = getPct(count, total);
                      return (
                        <div key={label} className="bar-row">
                          <div className="bar-labels">
                            <span className="bar-name">{label}</span>
                            <span className="bar-val">{count} ({pct}%)</span>
                          </div>
                          <div className="bar-track">
                            <div className="bar-fill gold-fill" style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Commute Willingness */}
              <div className="chart-box">
                <div className="chart-title-flex">
                  <Compass size={16} className="chart-icon" />
                  <h4>03 · Travel further for calmer lifestyle?</h4>
                </div>
                <div className="bars-list">
                  {Object.entries(stats?.commuteCounts || {})
                    .filter(([k]) => k !== 'Unspecified')
                    .map(([label, count]) => {
                      const pct = getPct(count, total);
                      return (
                        <div key={label} className="bar-row">
                          <div className="bar-labels">
                            <span className="bar-name">{label}</span>
                            <span className="bar-val">{count} ({pct}%)</span>
                          </div>
                          <div className="bar-track">
                            <div className="bar-fill maroon-fill" style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Responses Table & Moderation */}
        {activeTab === 'responses' && (
          <div className="admin-content-scroll">
            <div className="table-controls-bar">
              <div className="table-search">
                <Search size={14} className="t-icon" />
                <input
                  type="text"
                  placeholder="Filter by thought, neighborhood, or selection..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <span className="table-count-label">Showing {filteredPreferences.length} of {preferences.length} entries</span>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Author / Area</th>
                    <th>Reflection / Thought</th>
                    <th>Luxury Choice</th>
                    <th>Home Priority</th>
                    <th>Commute</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPreferences.map(p => (
                    <tr key={p.id}>
                      <td className="author-cell">
                        <strong>{p.author || 'A Punekar'}</strong>
                        <small>{new Date(p.createdAt).toLocaleDateString()}</small>
                      </td>
                      <td className="thought-cell">“{p.thought}”</td>
                      <td><span className="badge-pill luxury-pill">{p.luxury}</span></td>
                      <td><span className="badge-pill home-pill">{p.home}</span></td>
                      <td><span className="badge-pill commute-pill">{p.commute}</span></td>
                      <td>
                        <button
                          type="button"
                          className="table-del-btn"
                          onClick={() => onDeleteEntry(p.id)}
                          title="Moderate / Delete Entry"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .admin-overlay {
          position: fixed;
          inset: 0;
          z-index: 160;
          background: rgba(24, 20, 16, 0.78);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(14px, 3vw, 36px);
          animation: adminFade 0.25s ease-out;
        }
        @keyframes adminFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .admin-modal {
          background: #fbf5e8;
          border: 1px solid rgba(64, 46, 28, 0.3);
          border-radius: var(--radius-lg);
          max-width: 1180px;
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
          overflow: hidden;
        }
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 28px;
          background: #f3e6cf;
          border-bottom: 1px solid var(--line-strong);
          gap: 20px;
          flex-wrap: wrap;
        }
        .admin-brand-info {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .admin-icon-pill {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--maroon);
          color: #fff;
          display: grid;
          place-items: center;
          box-shadow: 0 4px 14px rgba(116, 42, 34, 0.3);
        }
        .admin-title {
          font-family: var(--font-display);
          font-size: 20px;
          color: var(--ink);
          margin-bottom: 2px;
        }
        .admin-subtitle {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--muted);
          display: block;
        }
        .admin-head-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .admin-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: var(--radius-full);
          border: 1px solid var(--line-strong);
          background: rgba(255, 255, 255, 0.6);
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--ink);
          cursor: pointer;
          transition: all 0.2s;
        }
        .admin-action-btn:hover {
          background: var(--ink);
          color: #fff;
          border-color: var(--ink);
        }
        .admin-close-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(56, 41, 28, 0.16);
          background: rgba(56, 41, 28, 0.08);
          display: grid;
          place-items: center;
          cursor: pointer;
          color: var(--ink);
          transition: all 0.2s;
        }
        .admin-close-btn:hover {
          background: var(--maroon);
          color: #fff;
        }
        .admin-tabs {
          display: flex;
          gap: 1px;
          background: rgba(56, 41, 28, 0.1);
          border-bottom: 1px solid var(--line);
        }
        .admin-tab {
          padding: 12px 24px;
          background: #f7edd8;
          border: none;
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--muted);
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }
        .admin-tab.active {
          background: #fbf5e8;
          color: var(--maroon);
          border-bottom: 2px solid var(--maroon);
        }
        .admin-content-scroll {
          padding: 28px;
          overflow-y: auto;
          flex: 1;
        }
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        .kpi-card {
          background: #fffdf9;
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          padding: 18px 20px;
          box-shadow: var(--shadow-sm);
        }
        .kpi-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 8px;
        }
        .kpi-value {
          display: block;
          font-family: var(--font-display);
          font-size: 26px;
          color: var(--ink);
          font-weight: 700;
          margin-bottom: 6px;
        }
        .kpi-trend {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--green-dark);
          display: block;
        }
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .chart-box {
          background: #fffdf9;
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          padding: 22px;
          box-shadow: var(--shadow-sm);
        }
        .chart-title-flex {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 18px;
        }
        .chart-title-flex h4 {
          font-family: var(--font-display);
          font-size: 15px;
          color: var(--ink);
          font-weight: 600;
        }
        .chart-icon {
          color: var(--gold);
        }
        .bars-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .bar-labels {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 11px;
          margin-bottom: 4px;
        }
        .bar-name { color: var(--ink); }
        .bar-val { color: var(--muted); font-weight: 600; }
        .bar-track {
          height: 7px;
          background: #ede1cb;
          border-radius: 4px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .green-fill { background: var(--green); }
        .gold-fill { background: var(--gold); }
        .maroon-fill { background: var(--maroon); }

        /* Table styles */
        .table-controls-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          gap: 16px;
        }
        .table-search {
          position: relative;
          width: 100%;
          max-width: 380px;
        }
        .t-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted);
        }
        .table-search input {
          width: 100%;
          padding: 8px 12px 8px 34px;
          border-radius: var(--radius-full);
          border: 1px solid var(--line-strong);
          background: #fff;
          font-family: var(--font-mono);
          font-size: 11px;
          outline: none;
        }
        .table-count-label {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--muted);
        }
        .table-responsive {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-family: var(--font-mono);
          font-size: 11px;
        }
        .admin-table th {
          text-align: left;
          padding: 12px 14px;
          background: #f5e9d2;
          color: var(--ink);
          border-bottom: 1px solid var(--line);
          font-weight: 700;
          letter-spacing: 0.04em;
        }
        .admin-table td {
          padding: 12px 14px;
          border-bottom: 1px solid rgba(56, 41, 28, 0.08);
          vertical-align: top;
        }
        .admin-table tr:hover td {
          background: #fbf6ec;
        }
        .author-cell strong {
          display: block;
          color: var(--ink);
        }
        .author-cell small {
          color: var(--muted);
          font-size: 9.5px;
        }
        .thought-cell {
          font-family: var(--font-serif);
          font-size: 14px;
          max-width: 320px;
          color: #2b2723;
        }
        .badge-pill {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 9.5px;
          font-weight: 600;
        }
        .luxury-pill { background: rgba(49, 95, 73, 0.12); color: var(--green-dark); }
        .home-pill { background: rgba(169, 120, 53, 0.12); color: var(--gold); }
        .commute-pill { background: rgba(116, 42, 34, 0.10); color: var(--maroon); }
        .table-del-btn {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          border: 1px solid rgba(116, 42, 34, 0.2);
          background: rgba(116, 42, 34, 0.06);
          color: var(--maroon);
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: all 0.2s;
        }
        .table-del-btn:hover {
          background: var(--maroon);
          color: #fff;
        }
        @media (max-width: 980px) {
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 600px) {
          .kpi-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
