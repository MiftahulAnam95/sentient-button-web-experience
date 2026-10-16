/* ==========================================================================
   sound.js — synthesised UI blips & character audio via Web Audio API.
   No external audio files required. Unlocks AudioContext on first user
   gesture and provides distinct retro-brutalist synth voices.
   ========================================================================== */

let ctx = null;
let masterGain = null;
let enabled = true;
let unlockBound = false;

const VOICES = {
  press: { freq: 240, to: 360, type: "square", dur: 0.09, gain: 0.18 },
  deny: { freq: 160, to: 85, type: "sawtooth", dur: 0.18, gain: 0.2 },
  error: { freq: 110, to: 55, type: "sawtooth", dur: 0.34, gain: 0.22 },
  secret: { freq: 523.25, to: 987.77, type: "triangle", dur: 0.32, gain: 0.22 },
  calm: { freq: 440, to: 659.25, type: "sine", dur: 0.24, gain: 0.18 },
  toggle: { freq: 580, to: 780, type: "triangle", dur: 0.07, gain: 0.15 },
  dodge: { freq: 300, to: 680, type: "sine", dur: 0.14, gain: 0.18 },
  hold: { freq: 190, to: 420, type: "triangle", dur: 0.28, gain: 0.16 },
};

function ensureContext() {
  if (ctx) return ctx;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  try {
    ctx = new AudioCtx();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.85;
    masterGain.connect(ctx.destination);
  } catch (err) {
    ctx = null;
  }
  return ctx;
}

function bindGestureUnlock() {
  if (unlockBound || typeof window === "undefined") return;
  unlockBound = true;
  const unlock = () => {
    if (!enabled) return;
    const audio = ensureContext();
    if (audio && audio.state === "suspended") {
      audio.resume().catch(() => {});
    }
  };
  window.addEventListener("pointerdown", unlock, { passive: true });
  window.addEventListener("keydown", unlock, { passive: true });
}

bindGestureUnlock();

export function setSoundEnabled(value) {
  enabled = Boolean(value);
  if (enabled) {
    const audio = ensureContext();
    if (audio && audio.state === "suspended") {
      audio.resume().catch(() => {});
    }
  }
}

export function isSoundEnabled() {
  return enabled;
}

function scheduleTone(audio, { freq, to, type = "square", startOffset = 0, dur = 0.1, gain = 0.18 }) {
  const dest = masterGain || audio.destination;
  const now = audio.currentTime + startOffset;
  const osc = audio.createOscillator();
  const g = audio.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(Math.max(40, freq), now);
  if (to && to !== freq) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, to), now + dur);
  }

  // Crisp attack + sustain + smooth release so short blips are clearly audible
  g.gain.setValueAtTime(0.0001, now);
  g.gain.linearRampToValueAtTime(gain, now + Math.min(0.012, dur * 0.2));
  g.gain.setValueAtTime(gain * 0.85, now + dur * 0.65);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  osc.connect(g);
  g.connect(dest);
  osc.start(now);
  osc.stop(now + dur + 0.02);
}

export function play(name = "press") {
  if (!enabled) return;
  const audio = ensureContext();
  if (!audio) return;

  const trigger = () => {
    if (name === "secret") {
      // Two-step classified discovery arpeggio
      scheduleTone(audio, { freq: 523.25, to: 659.25, type: "triangle", startOffset: 0, dur: 0.12, gain: 0.2 });
      scheduleTone(audio, { freq: 783.99, to: 1046.5, type: "triangle", startOffset: 0.11, dur: 0.22, gain: 0.22 });
      return;
    }

    if (name === "deny") {
      // Grumpy double low buzz
      scheduleTone(audio, { freq: 170, to: 115, type: "sawtooth", startOffset: 0, dur: 0.08, gain: 0.19 });
      scheduleTone(audio, { freq: 130, to: 82, type: "sawtooth", startOffset: 0.09, dur: 0.12, gain: 0.2 });
      return;
    }

    if (name === "error") {
      // Dramatic 403 glitch sequence
      scheduleTone(audio, { freq: 190, to: 95, type: "sawtooth", startOffset: 0, dur: 0.11, gain: 0.21 });
      scheduleTone(audio, { freq: 140, to: 70, type: "square", startOffset: 0.12, dur: 0.11, gain: 0.21 });
      scheduleTone(audio, { freq: 95, to: 52, type: "sawtooth", startOffset: 0.24, dur: 0.18, gain: 0.22 });
      return;
    }

    if (name === "calm") {
      // Warm two-note chime
      scheduleTone(audio, { freq: 440, to: 440, type: "sine", startOffset: 0, dur: 0.12, gain: 0.16 });
      scheduleTone(audio, { freq: 659.25, to: 659.25, type: "sine", startOffset: 0.1, dur: 0.2, gain: 0.18 });
      return;
    }

    const voice = VOICES[name] || VOICES.press;
    scheduleTone(audio, voice);
  };

  if (audio.state === "suspended") {
    audio
      .resume()
      .then(trigger)
      .catch(() => {});
  } else {
    trigger();
  }
}
