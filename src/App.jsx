import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SentLetters } from './components/SentLetters';
import { UnsentTurn } from './components/UnsentTurn';
import { PreferenceForm } from './components/PreferenceForm';
import { ResponseWall } from './components/ResponseWall';
import { ListeningSection } from './components/ListeningSection';
import { SealedLetter } from './components/SealedLetter';
import { Footer } from './components/Footer';
import { AnalyticsHUD } from './components/AnalyticsHUD';
import { AdminDashboard } from './components/AdminDashboard';
import { audioEngine } from './components/AudioAmbient';

export function App() {
  const [preferences, setPreferences] = useState([]);
  const [stats, setStats] = useState(null);
  const [analyticsEvents, setAnalyticsEvents] = useState([]);
  const [adminOpen, setAdminOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const sent50Ref = useRef(false);
  const sent90Ref = useRef(false);

  // Central Event Telemetry Dispatcher (Syncs with window.dataLayer + Express backend)
  const trackEvent = (eventName, payload = {}) => {
    // 1. GTM / GA4 standard dataLayer
    window.dataLayer = window.dataLayer || [];
    const eventData = {
      event: eventName,
      ...payload,
      timestamp: new Date().toISOString()
    };
    window.dataLayer.push(eventData);

    // 2. React state for live HUD
    setAnalyticsEvents(prev => [
      { id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, ...eventData },
      ...prev.slice(0, 199)
    ]);

    // 3. POST to Express backend API
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: eventName, payload })
    }).catch(err => console.debug('Telemetry sync:', err.message));
  };

  // Fetch initial preferences & stats
  const fetchPreferences = async () => {
    try {
      const res = await fetch('/api/preferences');
      const data = await res.json();
      if (data.success) {
        setPreferences(data.preferences || []);
        setStats(data.stats || null);
      }
    } catch (err) {
      console.warn('Using offline data fallback:', err);
    }
  };

  useEffect(() => {
    fetchPreferences();

    // Fire initial landing page view
    trackEvent('P2_Landing_View', {
      source: 'web',
      campaign: 'Dear Pune Chapter Two',
      referrer: document.referrer || 'direct'
    });

    // Scroll depth tracking (50% and 90%)
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      setScrollProgress(progress);

      if (progress >= 50 && !sent50Ref.current) {
        sent50Ref.current = true;
        trackEvent('P2_50_Scroll', { depth: '50%' });
      }

      if (progress >= 90 && !sent90Ref.current) {
        sent90Ref.current = true;
        trackEvent('P2_90_Scroll', { depth: '90%' });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Scroll reveal observer
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
          }
        });
      },
      { threshold: 0.12 }
    );

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    revealElements.forEach(el => io.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      io.disconnect();
    };
  }, []);

  // Community reaction updater (like / unlike toggle)
  const handleReaction = async (id, type, action = 'add') => {
    try {
      const res = await fetch(`/api/preferences/${id}/reaction`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, action })
      });
      const data = await res.json();
      if (data.success) {
        setPreferences(prev =>
          prev.map(item =>
            item.id === id ? { ...item, reactions: data.reactions } : item
          )
        );
      }
    } catch (err) {
      console.error('Reaction failed:', err);
    }
  };

  // Admin delete moderation handler
  const handleDeleteEntry = async (id) => {
    if (!window.confirm('Are you sure you want to remove this reflection?')) return;
    try {
      const res = await fetch(`/api/preferences/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPreferences(prev => prev.filter(p => p.id !== id));
        fetchPreferences();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // When a user submits a thought from the form
  const handlePreferenceSubmitted = (newEntry, newStats) => {
    setPreferences(prev => [newEntry, ...prev]);
    if (newStats) setStats(newStats);
  };

  // Toggle ambient sound
  const handleToggleAmbient = () => {
    if (ambientPlaying) {
      audioEngine.stop();
      setAmbientPlaying(false);
      trackEvent('ambient_audio_toggled', { state: 'off' });
    } else {
      audioEngine.start();
      setAmbientPlaying(true);
      trackEvent('ambient_audio_toggled', { state: 'on' });
    }
  };

  const handlePlayPaperSound = () => {
    audioEngine.playPaperRustle();
  };

  return (
    <div className="dear-pune-app">
      {/* Scroll reading progress bar */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* Header Navigation */}
      <Navbar
        onToggleAdmin={() => setAdminOpen(true)}
        onToggleAnalytics={() => setAnalyticsOpen(prev => !prev)}
        analyticsOpen={analyticsOpen}
        ambientPlaying={ambientPlaying}
        onToggleAmbient={handleToggleAmbient}
        totalEvents={analyticsEvents.length}
      />

      <main id="main-content">
        {/* Hero Section */}
        <Hero onTrackEvent={trackEvent} />

        {/* Chapter One Sent Letters */}
        <SentLetters onTrackEvent={trackEvent} />

        {/* Dramatic Unsent Turn */}
        <UnsentTurn />

        {/* Interactive Listening / Preference Questionnaire & Community Wall */}
        <section className="section" id="your-say">
          <div className="preference-wrap-grid">
            <div className="preference-narrative-col reveal-left">
              <div className="eyebrow">
                <span>Maybe the letter begins with you</span>
              </div>
              <h2 className="preference-heading">What does Pune want next?</h2>
              <p className="preference-intro">
                We have spent weeks talking about what Pune should preserve. Now we want to understand what people want from the way they live next. No property pitch. No brochure. Just your preferences.
              </p>
              <div className="preference-callout-signal">
                <span className="signal-lead">Every answer is a signal.</span> The point of Chapter Two is not to sell you something — it is to listen more carefully before the next chapter opens.
              </div>
            </div>

            <div className="preference-form-col reveal-right">
              <PreferenceForm
                onPreferenceSubmitted={handlePreferenceSubmitted}
                onTrackEvent={trackEvent}
              />
            </div>
          </div>

          {/* Anonymised Punekar Thoughts Wall */}
          <ResponseWall
            preferences={preferences}
            onReaction={handleReaction}
            onTrackEvent={trackEvent}
          />
        </section>

        {/* Listening Section with 3 Clues */}
        <ListeningSection />

        {/* Sealed Unsent Letter Interaction */}
        <SealedLetter
          onTrackEvent={trackEvent}
          onPlayPaperSound={handlePlayPaperSound}
        />
      </main>

      {/* Footer */}
      <Footer onToggleAdmin={() => setAdminOpen(true)} />

      {/* Live Telemetry Inspector HUD */}
      <AnalyticsHUD
        events={analyticsEvents}
        isOpen={analyticsOpen}
        onClose={() => setAnalyticsOpen(false)}
        onClearEvents={() => setAnalyticsEvents([])}
      />

      {/* Executive Admin Analytics Console */}
      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        onRefresh={fetchPreferences}
        stats={stats}
        preferences={preferences}
        onDeleteEntry={handleDeleteEntry}
      />

      <style>{`
        .preference-wrap-grid {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: clamp(32px, 5vw, 68px);
          align-items: start;
        }
        .preference-heading {
          font-family: var(--font-display);
          font-size: clamp(38px, 5.2vw, 82px);
          line-height: 0.95;
          letter-spacing: -0.04em;
          margin: 0 0 20px;
          color: var(--ink);
        }
        .preference-intro {
          font-family: var(--font-mono);
          color: var(--muted);
          line-height: 1.8;
          max-width: 540px;
          font-size: 13.5px;
          margin-bottom: 26px;
        }
        .preference-callout-signal {
          padding: 18px 20px;
          border-left: 3px solid var(--green);
          background: rgba(49, 95, 73, 0.08);
          font-family: var(--font-mono);
          font-size: 12px;
          line-height: 1.65;
          color: #4b3e34;
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
        }
        .signal-lead {
          font-weight: 700;
          color: var(--green-dark);
        }
        @media (max-width: 980px) {
          .preference-wrap-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
        }
      `}</style>
    </div>
  );
}
export default App;
