/* ==========================================================================
   sound.js — four tiny synthesised UI blips. No audio files, no autoplay.
   Disabled by default; the AudioContext is only created after a user gesture.
   ========================================================================== */

let ctx = null;
let enabled = false;

const VOICES = {
  press: { freq: 220, to: 330, type: "square", dur: 0.08, gain: 0.05 },
  deny: { freq: 150, to: 90, type: "sawtooth", dur: 0.16, gain: 0.05 },
  error: { freq: 90, to: 60, type: "square", dur: 0.3, gain: 0.055 },
  secret: { freq: 520, to: 880, type: "triangle", dur: 0.26, gain: 0.06 },
  calm: { freq: 440, to: 660, type: "sine", dur: 0.2, gain: 0.05 },
};

function ensureContext() {
  if (ctx) return ctx;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  try {
    ctx = new AudioCtx();
  } catch (err) {
    ctx = null;
  }
  return ctx;
}

export function setSoundEnabled(value) {
  enabled = Boolean(value);
  if (enabled) ensureContext();
}

export function isSoundEnabled() {
  return enabled;
}

export function play(name) {
  if (!enabled) return;
  const voice = VOICES[name];
  const audio = ensureContext();
  if (!voice || !audio) return;
  if (audio.state === "suspended") audio.resume().catch(() => {});

  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = voice.type;
  osc.frequency.setValueAtTime(voice.freq, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(40, voice.to), now + voice.dur);
  gain.gain.setValueAtTime(voice.gain, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + voice.dur);
  osc.connect(gain).connect(audio.destination);
  osc.start(now);
  osc.stop(now + voice.dur + 0.02);
}
