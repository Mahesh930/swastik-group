// Web Audio API generator for authentic Pune monsoon rain and subtle temple bells
class MonsoonAudioEngine {
  constructor() {
    this.ctx = null;
    this.rainBuffer = null;
    this.rainSource = null;
    this.gainNode = null;
    this.isPlaying = false;
    this.bellTimer = null;
    this.audioEl = null;

    if (typeof window !== 'undefined') {
      this.loadRainAudio();
    }
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  async loadRainAudio() {
    try {
      const res = await fetch('/audio/rain.wav');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      this.init();
      this.ctx.decodeAudioData(
        arrayBuffer,
        (decoded) => {
          this.rainBuffer = decoded;
          // If the user started playback before download/decode completed
          if (this.isPlaying && !this.rainSource && (!this.audioEl || this.audioEl.paused)) {
            this._playRainBuffer();
          }
        },
        (err) => {
          console.warn('Web Audio decode failed, will use Audio element:', err);
        }
      );
    } catch (e) {
      console.warn('Could not preload rain audio buffer:', e);
    }
  }

  _playRainBuffer() {
    if (!this.rainBuffer || !this.ctx || !this.isPlaying) return;

    if (this.rainSource) {
      try { this.rainSource.stop(); } catch (e) {}
      this.rainSource.disconnect();
    }

    this.rainSource = this.ctx.createBufferSource();
    this.rainSource.buffer = this.rainBuffer;
    this.rainSource.loop = true;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.gainNode.gain.exponentialRampToValueAtTime(0.32, this.ctx.currentTime + 1.2);

    this.rainSource.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    this.rainSource.start(0);
  }

  start() {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.isPlaying) return;
    this.isPlaying = true;

    if (this.rainBuffer) {
      this._playRainBuffer();
    } else {
      // Immediate fallback while buffer is decoding or loading
      if (!this.audioEl) {
        this.audioEl = new Audio('/audio/rain.wav');
        this.audioEl.loop = true;
      }
      this.audioEl.volume = 0.32;
      this.audioEl.play().catch(() => {});
    }

    // Gentle Pune temple chimes every 14-24 seconds
    this.scheduleBell();
  }

  scheduleBell() {
    if (!this.isPlaying) return;
    const delay = (14 + Math.random() * 10) * 1000;
    this.bellTimer = setTimeout(() => {
      this.playBell();
      this.scheduleBell();
    }, delay);
  }

  playBell() {
    if (!this.ctx || !this.isPlaying) return;
    const osc = this.ctx.createOscillator();
    const bellGain = this.ctx.createGain();

    // Harmonic bell frequency
    const freqs = [587.33, 659.25, 880, 1046.5];
    const freq = freqs[Math.floor(Math.random() * freqs.length)];

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    bellGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    bellGain.gain.exponentialRampToValueAtTime(0.05, this.ctx.currentTime + 0.05);
    bellGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.5);

    osc.connect(bellGain);
    bellGain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 3.6);
  }

  stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;

    if (this.bellTimer) {
      clearTimeout(this.bellTimer);
      this.bellTimer = null;
    }

    if (this.gainNode && this.ctx) {
      this.gainNode.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      setTimeout(() => {
        if (this.rainSource) {
          try { this.rainSource.stop(); } catch (e) {}
          this.rainSource.disconnect();
          this.rainSource = null;
        }
      }, 800);
    } else if (this.rainSource) {
      try { this.rainSource.stop(); } catch (e) {}
      this.rainSource.disconnect();
      this.rainSource = null;
    }

    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.currentTime = 0;
    }
  }

  // Play a quick realistic parchment rustle sound effect on seal breaking
  playPaperRustle() {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    const bufferSize = this.ctx.sampleRate * 0.45;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }
}

export const audioEngine = new MonsoonAudioEngine();
