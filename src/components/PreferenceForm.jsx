import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Send, CheckCircle2, AlertCircle, Heart, Sparkles, User, MapPin } from 'lucide-react';

const questionList = [
  {
    key: 'luxury',
    number: '01',
    label: 'What feels like real luxury today?',
    options: ['More space', 'More privacy', 'More nature', 'More convenience']
  },
  {
    key: 'home',
    number: '02',
    label: 'Your next home should give you more of...',
    options: ['A greener view', 'A higher floor', 'A better location', 'More room']
  },
  {
    key: 'commute',
    number: '03',
    label: 'Would you travel a little further for a calmer way of living?',
    options: ['Absolutely', 'Maybe', 'Probably not']
  }
];

export function PreferenceForm({ onPreferenceSubmitted, onTrackEvent }) {
  const [answers, setAnswers] = useState({
    luxury: '',
    home: '',
    commute: ''
  });
  const [thought, setThought] = useState('');
  const [author, setAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }

  const handleChoice = (key, val) => {
    setAnswers(prev => ({ ...prev, [key]: val }));
    if (onTrackEvent) {
      onTrackEvent('P2_Preference_Select', { question: key, value: val });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thought.trim()) {
      setFeedback({
        type: 'error',
        message: 'Write one honest line first — the simplest thoughts are usually the most true.'
      });
      document.getElementById('thought-input')?.focus();
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    const payload = {
      luxury: answers.luxury || 'Unspecified',
      home: answers.home || 'Unspecified',
      commute: answers.commute || 'Unspecified',
      thought: thought.trim(),
      author: author.trim() || 'A Punekar'
    };

    try {
      const res = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Unable to submit your reflection.');
      }

      // Trigger delicate celebration confetti
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.75 },
          colors: ['#742a22', '#a97835', '#315f49', '#fbf5e8']
        });
      } catch (err) {
        // Fallback gracefully
      }

      setFeedback({
        type: 'success',
        message: '✓ Inscribed into the living letter. Your thought is now on the community wall.'
      });

      if (onPreferenceSubmitted) {
        onPreferenceSubmitted(data.preference, data.stats);
      }

      if (onTrackEvent) {
        onTrackEvent('form_submitted', {
          id: data.preference?.id,
          luxury: payload.luxury,
          home: payload.home,
          commute: payload.commute,
          thoughtLength: payload.thought.length
        });
      }

      // Reset entire form after successful submission
      setThought('');
      setAuthor('');
      setAnswers({ luxury: '', home: '', commute: '' });
    } catch (err) {
      console.error('Submission error:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'Something went wrong while recording. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="paper-form-wrap" id="preference-form">
      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          {questionList.map(q => (
            <div key={q.key} className="form-question" data-key={q.key}>
              <label className="question-label">
                <span className="q-num">{q.number}</span> · {q.label}
              </label>
              <div className="choices-grid">
                {q.options.map(option => {
                  const isSelected = answers[q.key] === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`choice-pill ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleChoice(q.key, option)}
                      aria-pressed={isSelected}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Thought Field */}
          <div className="form-question">
            <div className="question-header-flex">
              <label htmlFor="thought-input" className="question-label">
                <span className="q-num">04</span> · One thing your next home must have?
              </label>
              <span className={`char-counter ${thought.length >= 170 ? 'limit-near' : ''}`}>
                {thought.length}/180
              </span>
            </div>
            <textarea
              id="thought-input"
              value={thought}
              onChange={(e) => setThought(e.target.value.slice(0, 180))}
              placeholder="e.g. A balcony where I can hear the rain, not the traffic..."
              maxLength={180}
              rows={3}
              required
              aria-describedby="thought-hint"
            />
            <p id="thought-hint" className="field-hint">
              Be candid. The architects and thinkers behind Chapter Two read every submission.
            </p>
          </div>

          {/* Optional Neighborhood / Author Nickname */}
          <div className="form-question author-question">
            <label htmlFor="author-input" className="question-label-subtle">
              <User size={13} />
              <span>Sign as (Neighborhood / Name - optional):</span>
            </label>
            <input
              type="text"
              id="author-input"
              value={author}
              onChange={(e) => setAuthor(e.target.value.slice(0, 40))}
              placeholder="e.g. A Punekar from Prabhat Road"
              maxLength={40}
            />
          </div>

          {/* Feedback Alert */}
          {feedback && (
            <div className={`form-feedback-alert ${feedback.type}`} role="alert">
              {feedback.type === 'success' ? (
                <CheckCircle2 size={16} className="alert-icon" />
              ) : (
                <AlertCircle size={16} className="alert-icon" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            className="submit-thought-btn"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner"></span>
                <span>Inscribing your thought...</span>
              </>
            ) : (
              <>
                <Send size={15} />
                <span>Add my answer to the letter</span>
              </>
            )}
          </button>

          <div className="form-telemetry-footnote">
            <span className="pulse-dot"></span>
            <span>
              Connected to live REST API & GA4 dataLayer telemetry. Stored anonymously for Chapter Two research.
            </span>
          </div>
        </form>
      </div>

      <style>{`
        .paper-form-wrap {
          width: 100%;
        }
        .form-card {
          background: var(--paper-card);
          border: 1px solid var(--line-strong);
          border-radius: var(--radius-lg);
          padding: clamp(22px, 4vw, 36px);
          box-shadow: var(--shadow);
          position: relative;
        }
        .form-question {
          padding: 0 0 24px;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--line);
        }
        .form-question:last-of-type {
          border-bottom: none;
          margin-bottom: 18px;
          padding-bottom: 0;
        }
        .question-label {
          display: block;
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 11.5px;
          margin-bottom: 14px;
          color: #4f4237;
          font-weight: 700;
        }
        .q-num {
          color: var(--maroon);
        }
        .question-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .char-counter {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--muted);
        }
        .char-counter.limit-near {
          color: var(--maroon);
          font-weight: 700;
        }
        .choices-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .choice-pill {
          padding: 10px 16px;
          border: 1px solid rgba(61, 43, 29, 0.28);
          background: rgba(255, 255, 255, 0.4);
          border-radius: var(--radius-full);
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--ink);
          transition: all 0.22s ease;
          user-select: none;
        }
        .choice-pill:hover {
          background: rgba(49, 95, 73, 0.12);
          border-color: var(--green);
          color: var(--green-dark);
        }
        .choice-pill.selected {
          background: var(--green);
          color: #fff;
          border-color: var(--green);
          box-shadow: 0 4px 12px rgba(49, 95, 73, 0.28);
        }
        textarea, input[type="text"] {
          width: 100%;
          border: 1px solid rgba(61, 43, 29, 0.24);
          background: #fbf4e6;
          border-radius: var(--radius-md);
          padding: 14px 16px;
          outline: none;
          line-height: 1.55;
          color: var(--ink);
          font-family: var(--font-serif);
          font-size: 15px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        textarea:focus, input[type="text"]:focus {
          border-color: var(--maroon);
          background: #fffdf9;
          box-shadow: 0 0 0 3px rgba(116, 42, 34, 0.12);
        }
        .field-hint {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--muted);
          margin-top: 8px;
          line-height: 1.5;
        }
        .author-question {
          padding-bottom: 14px;
        }
        .question-label-subtle {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--muted);
          margin-bottom: 8px;
        }
        .form-feedback-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          font-family: var(--font-mono);
          font-size: 11.5px;
          margin-bottom: 16px;
          animation: slideDown 0.25s ease-out;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .form-feedback-alert.success {
          background: rgba(49, 95, 73, 0.12);
          border: 1px solid var(--green);
          color: var(--green-dark);
        }
        .form-feedback-alert.error {
          background: rgba(116, 42, 34, 0.10);
          border: 1px solid var(--maroon);
          color: var(--maroon);
        }
        .submit-thought-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 15px;
          border: 0;
          background: var(--ink);
          color: #fff8eb;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 700;
          transition: all 0.24s ease;
          box-shadow: 0 4px 16px rgba(43, 39, 35, 0.2);
        }
        .submit-thought-btn:hover:not(:disabled) {
          background: var(--maroon);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(116, 42, 34, 0.3);
        }
        .submit-thought-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .form-telemetry-footnote {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 14px;
          font-family: var(--font-mono);
          font-size: 10px;
          color: #8a7868;
          line-height: 1.5;
        }
        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 6px var(--green);
        }
      `}</style>
    </div>
  );
}
