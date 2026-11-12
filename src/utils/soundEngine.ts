class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = true;
  private hapticsEnabled = true;

  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setHapticsEnabled(val: boolean) {
    this.hapticsEnabled = val;
  }

  public vibrate(pattern: number | number[]) {
    if (!this.hapticsEnabled) return;
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore on unsupported devices
      }
    }
  }

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public async unlock(): Promise<boolean> {
    const ctx = this.getContext();
    if (!ctx) return false;
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        return false;
      }
    }
    return ctx.state === 'running';
  }

  private playTone(
    freqStart: number,
    freqEnd: number,
    durationSec: number,
    type: OscillatorType = 'sine',
    gainPeak = 0.08,
    delaySec = 0
  ) {
    const ctx = this.getContext();
    if (!ctx || ctx.state !== 'running') return;

    const now = ctx.currentTime + delaySec;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, now);
    if (freqEnd !== freqStart) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), now + durationSec);
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(gainPeak, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durationSec + 0.02);
  }

  // Subtle 'pop' sound for button clicks
  public playPop() {
    this.vibrate(8);
    this.playTone(480, 720, 0.045, 'sine', 0.055);
  }

  // 3D Main Pink Button Press: crisp tactile pop + heavier haptic thump
  public play3dPress() {
    this.vibrate(18);
    this.playTone(240, 110, 0.065, 'triangle', 0.11);
    this.playTone(480, 720, 0.045, 'sine', 0.05);
  }

  // Flat Button / Bottom Nav Tap: subtle micro pop
  public playTap() {
    this.vibrate(8);
    this.playTone(540, 620, 0.032, 'sine', 0.04);
  }

  // Subtle 'success' chime for task completion
  public playSuccess() {
    this.vibrate(14);
    this.playTone(587.33, 587.33, 0.08, 'sine', 0.075, 0);
    this.playTone(880, 880, 0.16, 'sine', 0.085, 0.06);
  }

  // Subtle 'woosh' sound for transitions
  public playWoosh() {
    const ctx = this.getContext();
    if (!ctx || ctx.state !== 'running') return;

    const duration = 0.18;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + duration);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  }

  // Chapter / Target / Homework Tick
  public playTick(done: boolean) {
    if (done) {
      this.playSuccess();
    } else {
      this.vibrate(6);
      this.playTone(392, 261.63, 0.07, 'sine', 0.045);
    }
  }

  // All Today's Targets Won ("WAR WON TODAY")
  public playWarWon() {
    this.vibrate([16, 40, 24]);
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      this.playTone(freq, freq, 0.22, 'triangle', 0.085, i * 0.085);
    });
  }

  // Item Added
  public playAdd() {
    this.vibrate(10);
    this.playTone(360, 660, 0.085, 'sine', 0.065);
  }

  // Item Deleted
  public playDelete() {
    this.vibrate(12);
    this.playTone(280, 140, 0.085, 'triangle', 0.065);
  }

  // Focus Mode Finish Bell
  public playFocusBell() {
    this.vibrate([20, 60, 30]);
    this.playTone(440, 440, 1.0, 'sine', 0.1, 0);
    this.playTone(659.25, 659.25, 0.85, 'sine', 0.065, 0.04);
  }
}

export const soundEngine = new SoundEngine();
