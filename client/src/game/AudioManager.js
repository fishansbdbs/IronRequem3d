export class AudioManager {
  constructor() {
    this.context = null;
    this.masterGain = null;
    this.settings = { masterVolume: 0.8, sfxVolume: 0.75, musicVolume: 0.45 };
  }

  ensure() {
    if (this.context) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.context = new AudioContext();
    this.masterGain = this.context.createGain();
    this.masterGain.gain.value = this.settings.masterVolume;
    this.masterGain.connect(this.context.destination);
  }

  applySettings(settings) {
    this.settings = { ...this.settings, ...settings };
    if (this.masterGain) this.masterGain.gain.value = this.settings.masterVolume;
  }

  tone(frequency = 220, duration = 0.1, type = 'sine', gain = 0.08) {
    this.ensure();
    if (!this.context || !this.masterGain) return;
    const oscillator = this.context.createOscillator();
    const level = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    level.gain.value = gain * this.settings.sfxVolume;
    oscillator.connect(level);
    level.connect(this.masterGain);
    oscillator.start();
    level.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
    oscillator.stop(this.context.currentTime + duration);
  }

  ui() {
    this.tone(520, 0.08, 'triangle', 0.05);
  }

  alarm() {
    this.tone(180, 0.22, 'sawtooth', 0.08);
  }

  hit() {
    this.tone(90, 0.08, 'square', 0.07);
  }

  launch() {
    this.tone(60, 0.5, 'sawtooth', 0.08);
    setTimeout(() => this.tone(260, 0.3, 'triangle', 0.06), 120);
  }
}
