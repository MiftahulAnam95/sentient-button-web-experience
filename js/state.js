/* ==========================================================================
   state.js — the single source of truth.
   Everything the button "feels" lives here. Nothing else mutates it directly;
   modules call the small set of functions exported at the bottom.
   ========================================================================== */

import { MOODS } from "./content.js";

const STORAGE_KEY = "tbhti.save.v2";

/** Values that survive a reload. */
const DEFAULTS = Object.freeze({
  interactions: 0,
  trust: 50, // 0-100, how safe the button feels
  suspicion: 10, // 0-100, how watched it feels
  mood: "CAUTIOUS",
  peakSuspicion: 10,
  secrets: [], // unlocked secret ids
  finale: false,
  sound: false,
  lang: "en", // "en" | "id"
  visits: 0,
  lastSeen: 0,
  presserName: "",
});

/** Always build a brand-new object (and a brand-new secrets array). */
function freshState() {
  return { ...DEFAULTS, secrets: [] };
}

/** Values that only matter for the current page view. */
export const session = {
  startedAt: Date.now(),
  presses: 0, // presses in THIS visit — scripted beats replay each session
  pressTimes: [], // timestamps used for rapid-click detection
  lastPressAt: 0,
  recentLines: [], // prevents repeating the same reaction
  rapidStage: 0,
  dodges: 0,
  consecutiveDodges: 0,
  cooling: false,
  lockedUntil: 0,
  forcedMood: null, // { mood, until }
  scriptRunning: false, // a scripted beat (error / reverse / honesty) owns the stage
  reverse: null, // { until, obeyed }
  awaitingTrustFall: false,
  honestyDone: false,
  errorDone: false,
  formDone: false,
  storageOK: true,
};

let state = freshState();
const listeners = new Set();

/* ---------- persistence ---------- */

function storageAvailable() {
  try {
    const probe = "__tbhti__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch (err) {
    return false;
  }
}

/** Load saved progress, repairing anything missing, corrupt or out of range. */
export function loadState() {
  session.storageOK = storageAvailable();
  if (!session.storageOK) return state;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return state;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return state;

    state = {
      ...DEFAULTS,
      ...parsed,
      trust: clamp(Number(parsed.trust) || DEFAULTS.trust, 0, 100),
      suspicion: clamp(Number(parsed.suspicion) || 0, 0, 100),
      peakSuspicion: clamp(Number(parsed.peakSuspicion) || 0, 0, 100),
      interactions: Math.max(0, Math.floor(Number(parsed.interactions) || 0)),
      secrets: Array.isArray(parsed.secrets) ? parsed.secrets.filter((s) => typeof s === "string") : [],
      mood: MOODS[parsed.mood] ? parsed.mood : DEFAULTS.mood,
      sound: Boolean(parsed.sound),
      finale: Boolean(parsed.finale),
      visits: Math.max(0, Math.floor(Number(parsed.visits) || 0)),
      presserName: typeof parsed.presserName === "string" ? parsed.presserName.slice(0, 24) : "",
    };
  } catch (err) {
    // Corrupt save: start clean rather than crash the experience.
    state = freshState();
  }
  return state;
}

/** Write the current state. Failures are silent — the session still works. */
export function saveState() {
  if (!session.storageOK) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    session.storageOK = false;
  }
}

export function wipeState() {
  state = { ...freshState(), sound: state.sound, visits: 1 };
  session.presses = 0;
  session.pressTimes = [];
  session.recentLines = [];
  session.rapidStage = 0;
  session.dodges = 0;
  session.consecutiveDodges = 0;
  session.cooling = false;
  session.lockedUntil = 0;
  session.forcedMood = null;
  session.scriptRunning = false;
  session.reverse = null;
  session.awaitingTrustFall = false;
  session.honestyDone = false;
  session.errorDone = false;
  session.formDone = false;
  if (session.storageOK) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      /* nothing to do */
    }
  }
  emit();
}

/* ---------- accessors ---------- */

export function getState() {
  return state;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function emit() {
  listeners.forEach((fn) => fn(state));
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/* ---------- mutations ---------- */

/**
 * Adjust the two hidden drivers. Everything visible (mood, face, colour,
 * copy) is derived from them, so this is the only place they change.
 */
export function adjust({ trust = 0, suspicion = 0 }) {
  state.trust = clamp(state.trust + trust, 0, trustCeiling());
  state.suspicion = clamp(state.suspicion + suspicion, 0, 100);
  state.peakSuspicion = Math.max(state.peakSuspicion, state.suspicion);
  return state;
}

/**
 * A button with trust issues does not hand out trust on day one.
 * The maximum trust it can feel rises only as the relationship accumulates
 * history, which keeps TRUSTING a late-game mood rather than a quick win.
 */
export function trustCeiling() {
  const n = state.interactions;
  if (n < 8) return 62;
  if (n < 16) return 74;
  if (n < 28) return 86;
  return 100;
}

export function countPress() {
  state.interactions += 1;
  return state.interactions;
}

export function setPresserName(name) {
  state.presserName = String(name || "").slice(0, 24);
}

/**
 * Force a mood for a while (used by scripted beats like the fake error).
 * It expires on its own so the derived mood can take over again.
 */
export function forceMood(mood, ms = 4000) {
  if (!MOODS[mood]) return;
  session.forcedMood = { mood, until: Date.now() + ms };
  state.mood = mood;
}

export function clearForcedMood() {
  session.forcedMood = null;
}

/**
 * MOOD TRANSITION RULES
 * Suspicion dominates: a nervous button cannot be curious. Below the
 * suspicion thresholds, trust decides how open it is. This keeps the
 * personality coherent instead of random.
 */
export function resolveMood() {
  const forced = session.forcedMood;
  if (forced && Date.now() < forced.until) {
    state.mood = forced.mood;
    return state.mood;
  }
  if (forced) session.forcedMood = null;

  const { trust, suspicion } = state;
  let next;

  if (suspicion >= 85) next = "PANICKING";
  else if (suspicion >= 62) next = "ANNOYED";
  else if (suspicion >= 38) next = "SUSPICIOUS";
  else if (trust >= 82) next = "TRUSTING";
  else if (trust >= 62) next = "CURIOUS";
  else if (trust <= 22 && suspicion >= 25) next = "SUSPICIOUS";
  else next = "CAUTIOUS";

  state.mood = next;
  return next;
}

/** Suspicion as a readable, non-numeric label (non-colour indicator). */
export function suspicionWord(value = state.suspicion) {
  if (value >= 85) return "CRITICAL";
  if (value >= 62) return "HIGH";
  if (value >= 38) return "ELEVATED";
  if (value >= 18) return "MODERATE";
  return "LOW";
}

export function trustWord(value = state.trust) {
  if (value >= 82) return "SURPRISING";
  if (value >= 62) return "WARMING";
  if (value >= 42) return "CONDITIONAL";
  if (value >= 22) return "QUESTIONABLE";
  return "NONE WHATSOEVER";
}

/* ---------- secrets ---------- */

export function hasSecret(id) {
  return state.secrets.includes(id);
}

export function addSecret(id) {
  if (state.secrets.includes(id)) return false;
  state.secrets.push(id);
  saveState();
  return true;
}

export function setFinale(value) {
  state.finale = Boolean(value);
}

export function setSound(value) {
  state.sound = Boolean(value);
  saveState();
}

export function setLang(value) {
  state.lang = value === "id" ? "id" : "en";
  saveState();
}

export function registerVisit() {
  state.visits += 1;
  state.lastSeen = Date.now();
  saveState();
}
