import React, { useState, useEffect } from 'react';
import { Sparkles, Download, Copy, Check, ArrowRight, Award, Key, Send, RotateCcw, HeartHandshake, FileText } from 'lucide-react';

export function SealedLetter({ onTrackEvent, onPlayPaperSound }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [vipCode, setVipCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [claimName, setClaimName] = useState('');
  const [claimContact, setClaimContact] = useState('');
  const [isClaimed, setIsClaimed] = useState(false);
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);

  // Generate or retrieve persistent VIP pass code
  useEffect(() => {
    let savedCode = localStorage.getItem('dear_pune_vip_code');
    if (!savedCode) {
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      savedCode = `PUN-CH3-${randomDigits}`;
      localStorage.setItem('dear_pune_vip_code', savedCode);
    }
    setVipCode(savedCode);

    const savedClaim = localStorage.getItem('dear_pune_vip_claimed');
    if (savedClaim) {
      setIsClaimed(true);
      setClaimName(savedClaim);
    }
  }, []);

  // Seal breaking trigger with multi-stage animation and sound
  const handleBreakSeal = () => {
    if (isOpen || isBreaking) return;

    setIsBreaking(true);
    if (onPlayPaperSound) onPlayPaperSound();

    if (onTrackEvent) {
      onTrackEvent('P2_Break_Seal_Initiated', { method: 'wax_seal', code: vipCode });
    }

    // After crack shake and particle burst (750ms), unfold the letter
    setTimeout(() => {
      setIsBreaking(false);
      setIsOpen(true);

      if (onTrackEvent) {
        onTrackEvent('P2_Letter_Unfolded', { method: 'wax_seal', code: vipCode });
      }

      // Smooth scroll to the revealed letter
      setTimeout(() => {
        const giftElem = document.getElementById('unfolded-keepsake');
        if (giftElem) {
          giftElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);
    }, 750);
  };

  // Copy VIP Token to clipboard
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(vipCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      if (onTrackEvent) {
        onTrackEvent('P2_VIP_Code_Copied', { code: vipCode });
      }
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Download official keepsake letter & VIP pass certificate
  const handleDownloadKeepsake = () => {
    const today = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const certificateText = `================================================================
          SWASTIK REALTY GROUP · PUNE
      CHAPTER TWO: THE UNSENT LETTER — VIP PIONEER PASS
================================================================

CERTIFICATE OF EARLY CITIZENSHIP & PREVIEW RESERVATION
Issued On: ${today}
Pass Code:  ${vipCode}
Holder:     ${claimName || 'Honorary Punekar Pioneer'}
Status:     OFFICIALLY RESERVED · CHAPTER THREE INAUGURAL ACCESS

----------------------------------------------------------------
THE UNSENT LETTER — FRAGMENT FROM CHAPTER TWO:
----------------------------------------------------------------
"Dear Pune,

We didn't build to fill a skyline. We built because you taught us
what a Sunday morning should feel like under a rain-washed
gulmohar tree, where chai is an unhurried ritual and neighbors
know each other by the sound of their footsteps.

By breaking this seal, you become an inaugural co-author of
Chapter Three. Some stories deserve the right moment, the right
weather, and the right people who truly listened."

----------------------------------------------------------------
YOUR UNLOCKED EXCLUSIVE PRIVILEGES:
----------------------------------------------------------------
1. PRIVATE SANCTUARY PREVIEW
   Exclusive private walking tour of the landmark site 14 days
   before public market unveiling.

2. ROOFTOP BAITHAK WITH SWASTIK ARCHITECTS
   An intimate twilight tea session discussing cross-ventilation,
   heritage tree conservation, and biophilic design.

3. INAUGURAL ARCHIVE INSCRIPTION
   Your name permanently recorded in the foundation guest registry
   of Chapter Three.

----------------------------------------------------------------
Official Swastik Realty Group Telemetry Token: ${vipCode}
Inquiries & Private Liaison: concierge@swastikrealtygroup.com
================================================================`;

    const blob = new Blob([certificateText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Swastik_Chapter_Three_VIP_Pass_${vipCode}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (onTrackEvent) {
      onTrackEvent('P2_Keepsake_Downloaded', { code: vipCode });
    }
  };

  // Claim & submit priority invitation delivery
  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!claimContact.trim()) return;

    setIsSubmittingClaim(true);
    try {
      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'P2_VIP_Invitation_Claimed',
          payload: {
            code: vipCode,
            name: claimName || 'A Punekar',
            contact: claimContact
          }
        })
      });

      localStorage.setItem('dear_pune_vip_claimed', claimName || 'A Punekar');
      setIsClaimed(true);
      if (onTrackEvent) {
        onTrackEvent('P2_VIP_Claimed_Success', { code: vipCode, name: claimName });
      }
    } catch (err) {
      console.error('Claim submit error:', err);
      setIsClaimed(true);
    } finally {
      setIsSubmittingClaim(false);
    }
  };

  // Reset to re-experience the seal breaking animation
  const handleReSeal = () => {
    setIsOpen(false);
    setIsBreaking(false);
  };

  return (
    <section className="final-letter-section" id="letter" aria-label="The Sealed Unsent Letter">
      <div className="final-wrap reveal">
        
        {/* Interactive Envelope with Physical Wax Seal */}
        <div
          className={`envelope-container ${isBreaking ? 'envelope-breaking' : ''} ${isOpen ? 'envelope-unsealed' : ''}`}
          id="envelope"
          role="button"
          tabIndex={0}
          onClick={handleBreakSeal}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleBreakSeal();
            }
          }}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'The seal is broken and letter is unfolded' : 'Click to break the wax seal and open the letter'}
        >
          <img
            src="/images/sealed-envelope.webp"
            alt="A sealed letter to Pune - Swastik Realty"
            className="envelope-img"
            width="620"
            height="460"
            loading="lazy"
          />

          {/* Golden glow radiating when broken */}
          <div className={`envelope-glow ${isOpen ? 'active' : ''}`} />

          {/* Interactive 3D Wax Seal Over Envelope Center */}
          <div className={`wax-seal-wrapper ${isBreaking ? 'cracking' : ''} ${isOpen ? 'shattered' : ''}`}>
            {!isOpen ? (
              <div className="wax-seal-stamp" title="Touch to break the wax seal">
                <div className="wax-seal-inner">
                  {/* Left & Right crack halves */}
                  <div className="wax-half wax-left" />
                  <div className="wax-half wax-right" />
                  <div className="wax-emblem">
                    <span className="seal-monogram">S</span>
                    <span className="seal-city">PUNE</span>
                  </div>
                </div>

                {/* Shimmer pulse rings */}
                <div className="seal-pulse-ring" />
                <div className="seal-pulse-ring ring-delay" />

                {/* Shatter particles (bursting on click) */}
                {isBreaking && (
                  <div className="wax-particles">
                    {[...Array(12)].map((_, i) => (
                      <span key={i} className={`particle p-${i + 1}`} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="wax-broken-badge">
                <Check size={14} className="badge-check" />
                <span>SEAL BROKEN</span>
              </div>
            )}
          </div>

          <div className="envelope-interactive-overlay">
            <span className="seal-tooltip">
              {isOpen ? 'Seal Broken · Letter Unfolded' : isBreaking ? 'Breaking Seal...' : '✦ Touch Wax Seal to Open ✦'}
            </span>
          </div>
        </div>

        <div className="eyebrow center-eyebrow">
          <span>{isOpen ? 'The seal is broken · Chapter Three Awakens' : 'The letter is still closed'}</span>
        </div>

        <h2 className="final-heading">
          {isOpen ? 'Your letter has arrived.' : 'Not for much longer.'}
        </h2>

        <p className="final-subtext">
          {isOpen
            ? 'The envelope has opened. As a true Punekar who took the time to listen, here is your personal Chapter Three keepsake and founding invitation.'
            : 'You have read every letter we sent to Pune across Chapter One. Now there is only one left to open. When it does, Chapter Three begins.'}
        </p>

        {!isOpen ? (
          <button
            type="button"
            className={`touch-seal-btn ${isBreaking ? 'breaking-btn' : ''}`}
            id="stayBtn"
            onClick={handleBreakSeal}
            disabled={isBreaking}
          >
            <Sparkles size={16} className={isBreaking ? 'spin-icon' : ''} />
            <span>{isBreaking ? 'Breaking the Wax Seal...' : 'Break the Wax Seal'}</span>
          </button>
        ) : (
          /* ==============================================================
             UNFOLDED LETTER & EXCLUSIVE REWARD CARD FOR THE USER
             ============================================================== */
          <div className="secret-drawer open" id="unfolded-keepsake" role="region" aria-live="polite">
            
            {/* 1. The Handwritten Letter Fragment */}
            <div className="secret-parchment-inner">
              <div className="parchment-stamp-header">
                <span className="secret-ribbon">Chapter Two · Personal Keepsake</span>
                <span className="parchment-seal-watermark">CONFIDENTIAL · PUNE</span>
              </div>

              <p className="secret-handwritten-intro">Dear Punekar,</p>

              <p className="secret-text">
                “We didn't build to fill a skyline. We built because you taught us what a Sunday morning should feel like under a rain-washed gulmohar tree, where chai is an unhurried ritual and breezes drift through wide-open verandas.”
              </p>

              <p className="secret-text-conclusion">
                By breaking this seal, you become an inaugural co-author of <strong>Chapter Three</strong>.
              </p>

              {/* 2. THE COLLECTIBLE VIP PASS CARD (What the user gets) */}
              <div className="vip-collector-card">
                <div className="vip-card-header">
                  <div className="vip-badge-row">
                    <span className="vip-exclusive-pill">
                      <Award size={12} />
                      FOUNDING CITIZEN PASS
                    </span>
                    <span className="vip-status-dot">● Active & Verified</span>
                  </div>
                  <h4 className="vip-card-title">Chapter Three · Priority Pioneer Token</h4>
                  <p className="vip-card-desc">Personal invitation token to the private unveiling in Pune</p>
                </div>

                <div className="vip-token-box">
                  <div className="vip-token-label">YOUR PRIVATE RESERVATION CODE</div>
                  <div className="vip-token-value-row">
                    <span className="vip-code-text">{vipCode}</span>
                    <button
                      type="button"
                      className={`copy-code-btn ${copied ? 'copied' : ''}`}
                      onClick={handleCopyCode}
                      title="Copy code to clipboard"
                    >
                      {copied ? (
                        <>
                          <Check size={13} />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 3 Exclusive Unlocked Privileges */}
                <div className="vip-perks-list">
                  <div className="vip-perk-item">
                    <span className="perk-icon">🗝️</span>
                    <div>
                      <strong>14-Day Early Site Walk</strong>
                      <p>Walk the heritage garden trails before public release</p>
                    </div>
                  </div>
                  <div className="vip-perk-item">
                    <span className="perk-icon">☕</span>
                    <div>
                      <strong>Rooftop Baithak Invitation</strong>
                      <p>Private twilight tea with Swastik master architects</p>
                    </div>
                  </div>
                  <div className="vip-perk-item">
                    <span className="perk-icon">📜</span>
                    <div>
                      <strong>Foundation Memorial Inscription</strong>
                      <p>Honorary Punekar tribute inscribed on the cornerstone</p>
                    </div>
                  </div>
                </div>

                {/* Download Certificate Action */}
                <div className="vip-card-footer">
                  <button
                    type="button"
                    className="download-pass-btn"
                    onClick={handleDownloadKeepsake}
                    title="Download official keepsake certificate"
                  >
                    <Download size={14} />
                    <span>Download Keepsake Certificate (.txt)</span>
                  </button>
                </div>
              </div>

              {/* 3. Direct Invitation Dispatch Form */}
              <div className="claim-invite-section">
                {!isClaimed ? (
                  <form onSubmit={handleClaimSubmit} className="claim-invite-form">
                    <div className="claim-heading-wrap">
                      <Send size={15} className="claim-icon" />
                      <h5>Have the physical wax-sealed letter delivered to you</h5>
                    </div>
                    <p className="claim-sub">
                      Enter your details below to receive the collector's edition wax-sealed letter directly:
                    </p>
                    <div className="claim-input-row">
                      <input
                        type="text"
                        placeholder="Your Name (e.g. Anand Kulkarni)"
                        value={claimName}
                        onChange={(e) => setClaimName(e.target.value)}
                        className="claim-input"
                      />
                      <input
                        type="text"
                        required
                        placeholder="WhatsApp / Phone or Email"
                        value={claimContact}
                        onChange={(e) => setClaimContact(e.target.value)}
                        className="claim-input"
                      />
                      <button
                        type="submit"
                        className="claim-submit-btn"
                        disabled={isSubmittingClaim}
                      >
                        {isSubmittingClaim ? 'Dispatching...' : 'Claim Invitation'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="invitation-confirmed-banner">
                    <div className="confirmed-icon-circle">
                      <Check size={20} />
                    </div>
                    <div>
                      <h5 className="confirmed-title">Invitation Dispatched to {claimName || 'You'}!</h5>
                      <p className="confirmed-sub">
                        Pass token <strong>{vipCode}</strong> is officially registered. Swastik Realty's private concierge will contact you with the sealed physical edition.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Reset to re-experience */}
              <div className="reseal-container">
                <button
                  type="button"
                  onClick={handleReSeal}
                  className="reseal-btn"
                  title="Seal the letter back to test or experience the animation again"
                >
                  <RotateCcw size={12} />
                  <span>Fold letter back & re-seal</span>
                </button>
              </div>

              <div className="secret-micro-note" id="clueNote">
                Connected to Swastik Realty CRM & retargeting telemetry. No spam, no pushy sales. Purely editorial.
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .final-letter-section {
          padding: 120px clamp(20px, 8vw, 130px) 96px;
          text-align: center;
          background: linear-gradient(180deg, rgba(239, 227, 202, 0) 0%, rgba(49, 95, 73, 0.08) 100%);
          position: relative;
        }
        .final-wrap {
          max-width: 860px;
          margin: 0 auto;
        }

        /* Envelope interactive container */
        .envelope-container {
          max-width: 610px;
          margin: 0 auto 38px;
          position: relative;
          cursor: pointer;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease;
          border-radius: 20px;
          user-select: none;
        }
        .envelope-container:hover:not(.envelope-unsealed) {
          transform: translateY(-8px) scale(1.02);
        }

        /* Breaking vibration animation */
        .envelope-breaking {
          animation: sealCrackShake 0.75s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        @keyframes sealCrackShake {
          10%, 90% { transform: translate3d(-3px, 0, 0) rotate(-0.5deg); }
          20%, 80% { transform: translate3d(4px, 0, 0) rotate(0.8deg); }
          30%, 50%, 70% { transform: translate3d(-6px, 0, 0) rotate(-1deg); }
          40%, 60% { transform: translate3d(6px, 0, 0) rotate(1deg); }
        }

        .envelope-unsealed {
          transform: translateY(-4px);
          filter: drop-shadow(0 20px 40px rgba(116, 42, 34, 0.25));
        }
        .envelope-img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 18px;
          box-shadow: var(--shadow);
          transition: filter 0.5s ease;
        }
        .envelope-unsealed .envelope-img {
          filter: brightness(1.03) contrast(1.02);
        }

        /* Radiating warm glow when unsealed */
        .envelope-glow {
          position: absolute;
          inset: 0;
          border-radius: 18px;
          background: radial-gradient(circle at 53% 58%, rgba(212, 163, 89, 0.4) 0%, rgba(116, 42, 34, 0) 70%);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.8s ease;
        }
        .envelope-glow.active {
          opacity: 1;
        }

        /* 3D Wax Seal Element Over Center */
        .wax-seal-wrapper {
          position: absolute;
          top: 57%;
          left: 53%;
          transform: translate(-50%, -50%);
          z-index: 10;
          pointer-events: auto;
        }
        .wax-seal-stamp {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #9e2a2b, #671d1e 80%, #3e0e0f);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -3px 6px rgba(0, 0, 0, 0.5);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          border: 2px solid #b83334;
        }
        .envelope-container:hover .wax-seal-stamp {
          transform: scale(1.1);
          box-shadow: 0 8px 24px rgba(116, 42, 34, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.4);
        }
        .wax-seal-inner {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 1px dashed rgba(255, 255, 255, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .wax-emblem {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          line-height: 1;
          color: #f7d498;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
          z-index: 2;
        }
        .seal-monogram {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 700;
        }
        .seal-city {
          font-family: var(--font-mono);
          font-size: 6px;
          letter-spacing: 0.15em;
          opacity: 0.85;
          margin-top: 1px;
        }

        /* Pulsing rings around seal */
        .seal-pulse-ring {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 2px solid rgba(212, 163, 89, 0.6);
          animation: sealPulse 2.2s infinite cubic-bezier(0.25, 1, 0.5, 1);
          pointer-events: none;
        }
        .ring-delay {
          animation-delay: 1.1s;
        }
        @keyframes sealPulse {
          0% { transform: scale(0.9); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        /* Seal cracking & shattering */
        .wax-seal-wrapper.cracking .wax-left {
          animation: crackLeft 0.75s forwards cubic-bezier(0.16, 1, 0.3, 1);
        }
        .wax-seal-wrapper.cracking .wax-right {
          animation: crackRight 0.75s forwards cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes crackLeft {
          0% { transform: translate(0, 0) rotate(0); }
          50% { transform: translate(-8px, -4px) rotate(-15deg); }
          100% { transform: translate(-25px, -15px) rotate(-35deg) scale(0.6); opacity: 0; }
        }
        @keyframes crackRight {
          0% { transform: translate(0, 0) rotate(0); }
          50% { transform: translate(8px, 4px) rotate(15deg); }
          100% { transform: translate(25px, 15px) rotate(35deg) scale(0.6); opacity: 0; }
        }

        /* Burst particles */
        .wax-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #d4a359;
          box-shadow: 0 0 8px #d4a359;
          top: 50%;
          left: 50%;
          animation: particleFly 0.7s forwards ease-out;
        }
        .p-1 { --tx: -40px; --ty: -35px; background: #9e2a2b; width: 8px; height: 8px; }
        .p-2 { --tx: 45px; --ty: -30px; background: #d4a359; }
        .p-3 { --tx: -50px; --ty: 20px; background: #d4a359; width: 7px; height: 7px; }
        .p-4 { --tx: 38px; --ty: 40px; background: #9e2a2b; }
        .p-5 { --tx: 0px; --ty: -55px; background: #fbf5e8; width: 5px; height: 5px; }
        .p-6 { --tx: 60px; --ty: 0px; background: #d4a359; }
        .p-7 { --tx: -60px; --ty: -5px; background: #9e2a2b; width: 7px; height: 7px; }
        .p-8 { --tx: 25px; --ty: -50px; background: #fbf5e8; }
        .p-9 { --tx: -25px; --ty: 50px; background: #d4a359; }
        .p-10 { --tx: 50px; --ty: -45px; background: #9e2a2b; }
        .p-11 { --tx: -45px; --ty: -45px; background: #fbf5e8; }
        .p-12 { --tx: 0px; --ty: 60px; background: #d4a359; width: 8px; height: 8px; }

        @keyframes particleFly {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0.2); opacity: 0; }
        }

        .wax-broken-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(43, 39, 35, 0.9);
          border: 1px solid rgba(212, 163, 89, 0.5);
          color: #d4a359;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          animation: badgePop 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes badgePop {
          from { transform: scale(0.6); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .badge-check { color: #d4a359; }

        .envelope-interactive-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 24px;
          pointer-events: none;
        }
        .seal-tooltip {
          background: rgba(43, 39, 35, 0.92);
          color: #fff8eb;
          font-family: var(--font-mono);
          font-size: 11px;
          padding: 8px 18px;
          border-radius: var(--radius-full);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0.9;
          transform: translateY(0);
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(212, 163, 89, 0.3);
        }
        .envelope-container:hover .seal-tooltip {
          opacity: 1;
          transform: translateY(-4px);
          background: var(--maroon);
          border-color: #d4a359;
        }

        .center-eyebrow {
          justify-content: center;
        }
        .center-eyebrow::after {
          display: none;
        }
        .final-heading {
          font-family: var(--font-display);
          font-size: clamp(38px, 5.8vw, 76px);
          line-height: 1;
          margin: 0 0 18px;
          letter-spacing: -0.03em;
          color: var(--ink);
        }
        .final-subtext {
          font-family: var(--font-mono);
          color: var(--muted);
          line-height: 1.8;
          max-width: 640px;
          margin: 0 auto 28px;
          font-size: 13.5px;
        }

        .touch-seal-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 36px;
          border-radius: var(--radius-full);
          background: var(--maroon);
          color: #fff;
          border: 0;
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 12.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 700;
          transition: all 0.25s ease;
          box-shadow: 0 8px 26px rgba(116, 42, 34, 0.3);
        }
        .touch-seal-btn:hover:not(:disabled) {
          background: var(--maroon-dark);
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 14px 38px rgba(116, 42, 34, 0.45);
        }
        .breaking-btn {
          opacity: 0.85;
          cursor: wait;
        }
        .spin-icon {
          animation: spin 1s infinite linear;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Unfolded drawer & parchment */
        .secret-drawer {
          overflow: hidden;
          margin-top: 36px;
          animation: letterSlideOut 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes letterSlideOut {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.92);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .secret-parchment-inner {
          background: #fbf5e8;
          border: 1px solid var(--line-strong);
          border-radius: var(--radius-lg);
          padding: clamp(24px, 5vw, 44px);
          box-shadow: 0 18px 50px rgba(56, 41, 28, 0.12);
          max-width: 720px;
          margin: 0 auto;
          position: relative;
          text-align: left;
        }
        .parchment-stamp-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .secret-ribbon {
          font-family: var(--font-mono);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--maroon);
          background: rgba(116, 42, 34, 0.08);
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-weight: 700;
        }
        .parchment-seal-watermark {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.18em;
          color: var(--muted);
          border: 1px dashed var(--line);
          padding: 3px 8px;
          border-radius: 4px;
        }
        .secret-handwritten-intro {
          font-family: var(--font-display);
          font-size: 24px;
          color: var(--ink);
          margin-bottom: 12px;
        }
        .secret-text {
          font-family: var(--font-serif);
          font-size: clamp(19px, 2.6vw, 24px);
          line-height: 1.5;
          color: #2b2723;
          margin-bottom: 16px;
          font-style: italic;
        }
        .secret-text-conclusion {
          font-family: var(--font-mono);
          font-size: 13px;
          color: #635345;
          line-height: 1.6;
          margin-bottom: 30px;
        }

        /* VIP Collectible Token Card */
        .vip-collector-card {
          background: linear-gradient(135deg, #f7efe1 0%, #ede1cc 100%);
          border: 2px solid #d4a359;
          border-radius: 12px;
          padding: 24px 28px;
          margin-bottom: 28px;
          box-shadow: 0 10px 30px rgba(116, 42, 34, 0.08);
          position: relative;
        }
        .vip-badge-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .vip-exclusive-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: var(--maroon);
          color: #fff;
          font-family: var(--font-mono);
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          padding: 3px 10px;
          border-radius: var(--radius-full);
        }
        .vip-status-dot {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--green-dark);
          font-weight: 700;
        }
        .vip-card-title {
          font-family: var(--font-display);
          font-size: 22px;
          color: var(--ink);
          margin: 0 0 4px;
        }
        .vip-card-desc {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--muted);
          margin: 0 0 18px;
        }

        /* Token Box */
        .vip-token-box {
          background: #fff;
          border: 1px dashed #d4a359;
          border-radius: 8px;
          padding: 12px 18px;
          margin-bottom: 20px;
        }
        .vip-token-label {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.15em;
          color: var(--muted);
          margin-bottom: 4px;
        }
        .vip-token-value-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .vip-code-text {
          font-family: var(--font-mono);
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--maroon);
        }
        .copy-code-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          border: 1px solid var(--line-strong);
          background: #fbf5e8;
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--ink);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .copy-code-btn:hover {
          background: var(--ink);
          color: #fff;
        }
        .copy-code-btn.copied {
          background: var(--green);
          color: #fff;
          border-color: var(--green);
        }

        /* Perks list */
        .vip-perks-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 20px;
        }
        .vip-perk-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          background: rgba(255, 255, 255, 0.5);
          padding: 10px 12px;
          border-radius: 6px;
        }
        .perk-icon {
          font-size: 16px;
          flex-shrink: 0;
        }
        .vip-perk-item strong {
          display: block;
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--ink);
          margin-bottom: 2px;
        }
        .vip-perk-item p {
          font-family: var(--font-mono);
          font-size: 9.5px;
          color: var(--muted);
          margin: 0;
          line-height: 1.35;
        }

        /* Download pass button */
        .vip-card-footer {
          display: flex;
          justify-content: flex-end;
        }
        .download-pass-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          border-radius: var(--radius-full);
          background: var(--ink);
          color: #fff;
          border: none;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .download-pass-btn:hover {
          background: var(--maroon);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(116, 42, 34, 0.25);
        }

        /* Claim form section */
        .claim-invite-section {
          background: rgba(49, 95, 73, 0.08);
          border: 1px solid rgba(49, 95, 73, 0.25);
          border-radius: 8px;
          padding: 20px 22px;
          margin-bottom: 20px;
        }
        .claim-heading-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .claim-icon { color: var(--green-dark); }
        .claim-heading-wrap h5 {
          font-family: var(--font-display);
          font-size: 17px;
          color: var(--ink);
          margin: 0;
        }
        .claim-sub {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--muted);
          margin: 0 0 14px;
        }
        .claim-input-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .claim-input {
          flex: 1;
          min-width: 170px;
          padding: 8px 14px;
          border-radius: var(--radius-full);
          border: 1px solid var(--line-strong);
          background: #fff;
          font-family: var(--font-mono);
          font-size: 11px;
          outline: none;
        }
        .claim-input:focus {
          border-color: var(--green);
        }
        .claim-submit-btn {
          padding: 8px 20px;
          border-radius: var(--radius-full);
          background: var(--green);
          color: #fff;
          border: none;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .claim-submit-btn:hover:not(:disabled) {
          background: var(--green-dark);
          transform: translateY(-1px);
        }

        .invitation-confirmed-banner {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .confirmed-icon-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--green);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .confirmed-title {
          font-family: var(--font-display);
          font-size: 17px;
          color: var(--ink);
          margin: 0 0 3px;
        }
        .confirmed-sub {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--muted);
          margin: 0;
          line-height: 1.45;
        }

        .reseal-container {
          display: flex;
          justify-content: center;
          margin-top: 18px;
          margin-bottom: 12px;
        }
        .reseal-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: transparent;
          border: none;
          color: var(--muted);
          font-family: var(--font-mono);
          font-size: 10px;
          cursor: pointer;
          padding: 4px 8px;
          transition: color 0.2s;
        }
        .reseal-btn:hover {
          color: var(--maroon);
        }

        .secret-micro-note {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--muted);
          line-height: 1.5;
          text-align: center;
          margin-top: 10px;
        }

        @media (max-width: 768px) {
          .vip-perks-list {
            grid-template-columns: 1fr;
          }
          .claim-input-row {
            flex-direction: column;
          }
          .claim-input {
            width: 100%;
          }
          .vip-card-footer {
            justify-content: center;
          }
          .download-pass-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
