// Web Audio API generator for authentic Pune monsoon rain and subtle temple bells
class MonsoonAudioEngine {
  constructor() {
    this.ctx = null;
    this.rainNode = null;
    this.gainNode = null;
    this.isPlaying = false;
    this.bellTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  start() {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.isPlaying) return;

    // Create pink noise buffer for soft monsoon rain
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;

    // Filter to make it sound like distant soft rain
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.gainNode.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 2);

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    whiteNoise.start();
    this.rainNode = whiteNoise;
    this.isPlaying = true;

    // Random gentle chime every 14-24 seconds
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
    bellGain.gain.exponentialRampToValueAtTime(0.04, this.ctx.currentTime + 0.05);
    bellGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.5);

    osc.connect(bellGain);
    bellGain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 3.6);
  }

  stop() {
    if (!this.isPlaying) return;
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 1);
      setTimeout(() => {
        if (this.rainNode) {
          try { this.rainNode.stop(); } catch (e) {}
          this.rainNode.disconnect();
          this.rainNode = null;
        }
      }, 1000);
    }
    if (this.bellTimer) clearTimeout(this.bellTimer);
    this.isPlaying = false;
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
