/**
 * Procedural Web Audio API Sound Engine for NEXUS: LEVEL ZERO
 * 100% royalty-free, offline, ultra-low-latency sound synthesizer.
 * Includes optional dark electronic / phonk ambient pulse & crisp futuristic RPG SFX.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMusicPlaying = false;
  private musicInterval: number | null = null;
  private step = 0;

  private soundEnabled = true;
  private musicEnabled = false;
  private sfxEnabled = true;
  private masterVolume = 0.7;

  constructor() {
    // Lazy AudioContext init on first user gesture
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.musicGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();

        this.musicGain.connect(this.ctx.destination);
        this.sfxGain.connect(this.ctx.destination);

        this.updateVolumes();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public updateSettings(sound: boolean, music: boolean, sfx: boolean, volume: number) {
    this.soundEnabled = sound;
    this.musicEnabled = music;
    this.sfxEnabled = sfx;
    this.masterVolume = Math.max(0, Math.min(1, volume));

    this.updateVolumes();

    if (this.soundEnabled && this.musicEnabled) {
      if (!this.isMusicPlaying) this.startMusic();
    } else {
      if (this.isMusicPlaying) this.stopMusic();
    }
  }

  private updateVolumes() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const effectiveSfxVol = this.soundEnabled && this.sfxEnabled ? this.masterVolume : 0;
    const effectiveMusicVol = this.soundEnabled && this.musicEnabled ? this.masterVolume * 0.4 : 0;

    if (this.sfxGain) {
      this.sfxGain.gain.setValueAtTime(effectiveSfxVol, now);
    }
    if (this.musicGain) {
      this.musicGain.gain.setValueAtTime(effectiveMusicVol, now);
    }
  }

  // --- Haptic Feedback for Android Mobile ---
  public triggerHaptic(pattern: number | number[] = 25) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore if unsupported/restricted
      }
    }
  }

  // --- SOUND EFFECTS ---

  /** UI Click / Button Tap */
  public playClick() {
    if (!this.soundEnabled || !this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    this.triggerHaptic(15);
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  /** Quest Completed Chime (Satisfying digital reward tone) */
  public playQuestComplete() {
    if (!this.soundEnabled || !this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    this.triggerHaptic([30, 40, 50]);
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const start = now + idx * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(start);
      osc.stop(start + 0.3);
    });
  }

  /** XP Gain Cascade Ticks */
  public playXpTick() {
    if (!this.soundEnabled || !this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.03);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.035);
  }

  /** Level Up Fanfare: Resonant energy burst & harmonic lift */
  public playLevelUp() {
    if (!this.soundEnabled || !this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    this.triggerHaptic([60, 60, 100, 50, 150]);
    const now = this.ctx.currentTime;

    // Deep sub bass impact
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(160, now);
    subOsc.frequency.exponentialRampToValueAtTime(40, now + 0.6);
    subGain.gain.setValueAtTime(0.4, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    subOsc.connect(subGain);
    subGain.connect(this.sfxGain);
    subOsc.start(now);
    subOsc.stop(now + 0.65);

    // Heroic brass chord sweep
    const chord = [392.0, 523.25, 659.25, 783.99, 1046.5]; // G4, C5, E5, G5, C6
    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const start = now + 0.1 + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.12, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.7);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(start);
      osc.stop(start + 0.75);
    });
  }

  /** Rank Up Epic Sound: Transcendent anime awakening chime */
  public playRankUp() {
    if (!this.soundEnabled || !this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    this.triggerHaptic([80, 50, 80, 50, 200]);
    const now = this.ctx.currentTime;

    // Resonant sweep
    const sweep = this.ctx.createOscillator();
    const sweepGain = this.ctx.createGain();
    sweep.type = 'sawtooth';
    sweep.frequency.setValueAtTime(220, now);
    sweep.frequency.exponentialRampToValueAtTime(1320, now + 0.8);
    sweepGain.gain.setValueAtTime(0.2, now);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
    sweep.connect(sweepGain);
    sweepGain.connect(this.sfxGain);
    sweep.start(now);
    sweep.stop(now + 0.9);
  }

  /** Achievement Unlocked Ring */
  public playAchievement() {
    if (!this.soundEnabled || !this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    this.triggerHaptic([40, 30, 70]);
    const now = this.ctx.currentTime;
    const chimeNotes = [783.99, 987.77, 1174.66, 1567.98]; // G5, B5, D6, G6
    chimeNotes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const start = now + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.18, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(start);
      osc.stop(start + 0.55);
    });
  }

  /** System Notification alert */
  public playSystemNotification() {
    if (!this.soundEnabled || !this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1320, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  // --- DARK ELECTRONIC / PHONK AMBIENT PULSE ENGINE ---
  public startMusic() {
    if (!this.soundEnabled || !this.musicEnabled || this.isMusicPlaying) return;
    this.initContext();
    if (!this.ctx || !this.musicGain) return;

    this.isMusicPlaying = true;
    this.step = 0;

    // 128 BPM = ~117ms per 16th note, ~468ms per beat
    const beatIntervalMs = 468;
    this.musicInterval = window.setInterval(() => {
      this.playPhonkBeatStep();
    }, beatIntervalMs);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  private playPhonkBeatStep() {
    if (!this.ctx || !this.musicGain || !this.soundEnabled || !this.musicEnabled) return;
    const now = this.ctx.currentTime;
    const currentStep = this.step % 16;
    this.step++;

    // 808 Deep Bass Kick on step 0, 4, 8, 11, 14
    if ([0, 4, 8, 11, 14].includes(currentStep)) {
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(120, now);
      kickOsc.frequency.exponentialRampToValueAtTime(36, now + 0.35);

      kickGain.gain.setValueAtTime(0.35, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      kickOsc.connect(kickGain);
      kickGain.connect(this.musicGain);
      kickOsc.start(now);
      kickOsc.stop(now + 0.4);
    }

    // Dark Synth Drone Chord (Atmospheric minor chord pulses)
    if (currentStep % 4 === 0) {
      const root = currentStep < 8 ? 146.83 : 130.81; // D3 / C3
      [root, root * 1.2, root * 1.5].forEach((freq) => {
        if (!this.ctx || !this.musicGain) return;
        const padOsc = this.ctx.createOscillator();
        const padGain = this.ctx.createGain();
        padOsc.type = 'sawtooth';
        padOsc.frequency.setValueAtTime(freq, now);

        padGain.gain.setValueAtTime(0.025, now);
        padGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        padOsc.connect(padGain);
        padGain.connect(this.musicGain);
        padOsc.start(now);
        padOsc.stop(now + 0.42);
      });
    }

    // Cyber Cowbell / Phonk Accent Tone on step 2, 6, 10, 14
    if ([2, 6, 10, 14].includes(currentStep)) {
      const bell = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();
      bell.type = 'square';
      bell.frequency.setValueAtTime(currentStep === 14 ? 740 : 587.33, now);

      bellGain.gain.setValueAtTime(0.04, now);
      bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      bell.connect(bellGain);
      bellGain.connect(this.musicGain);
      bell.start(now);
      bell.stop(now + 0.13);
    }
  }
}

export const sound = new SoundEngine();
