/* ==========================================================================
   lang.js — bilingual layer.
   Exposes `lang()` / `setLang()` / `t()` / `tDoc()` / `tSecrets()`.
   English is the source of truth; Indonesian lives in content.id.js.
   Every `t()` call falls back to the English string when the key is missing,
   so nothing breaks if a translation is incomplete.
   ========================================================================== */

import { SECRETS, ABOUT_DOC, FINALE } from "./content.js";
import {
  UI_ID,
  MOOD_LABELS_ID,
  POSTURE_ID,
  NOTE_ID,
  GLYPH_ID,
  COUNT_FOOT_ID,
  MOOD_LABEL_BTN_ID,
  MOODS_REACTIONS_ID,
  SCRIPTED_ID,
  RAPID_LINES_ID,
  COOLDOWN_LINES_ID,
  REVERSE_ID,
  HONESTY_ID,
  FAKE_ERROR_ID,
  HOVER_LINES_ID,
  RETURN_LINES_ID,
  MOOD_TAGS_ID,
  TICKER_ITEMS_ID,
  TRUST_WORD_ID,
  SUSPICION_WORD_ID,
  LOG_LINES_ID,
  SECRETS_DESC_ID,
  DOCS_ID,
  FINALE_ID,
} from "./content.id.js";

/* ---------- language state ---------- */

let current = "en"; // "en" | "id"
const changeListeners = new Set();

export function lang() {
  return current;
}

export function setLang(value) {
  if (value !== "en" && value !== "id") return;
  if (value === current) return;
  current = value;
  changeListeners.forEach((fn) => fn(current));
}

export function onLangChange(fn) {
  changeListeners.add(fn);
  return () => changeListeners.delete(fn);
}

/* ------------------------------------------------------------------
   t(path, fallback)
   Dot-path lookup into the ID dictionary; returns fallback (the
   English default) when the key is missing or we're in English mode.
   ------------------------------------------------------------------ */

export function t(path, fallback) {
  if (current !== "id") return fallback;
  return lookup(path) ?? fallback;
}

function lookup(path) {
  const parts = path.split(".");
  let node = UI_ID;
  for (const key of parts) {
    if (node == null || typeof node !== "object") return undefined;
    node = node[key];
  }
  return node;
}

/* ------------------------------------------------------------------
   Convenience getters for commonly accessed ID dictionaries.
   ------------------------------------------------------------------ */

export function moodLabel(mood) {
  return current === "id" ? (MOOD_LABELS_ID[mood] ?? mood) : mood;
}

export function moodGlyph(mood, enGlyph) {
  return current === "id" ? (GLYPH_ID[mood] ?? enGlyph) : enGlyph;
}

export function moodPosture(mood, enPosture) {
  return current === "id" ? (POSTURE_ID[mood] ?? enPosture) : enPosture;
}

export function moodNote(mood, enNote) {
  return current === "id" ? (NOTE_ID[mood] ?? enNote) : enNote;
}

export function moodTag(mood, enTag) {
  return current === "id" ? (MOOD_TAGS_ID[mood] ?? enTag) : enTag;
}

export function moodReactions(mood, enReactions) {
  return current === "id" ? (MOODS_REACTIONS_ID[mood] ?? enReactions) : enReactions;
}

export function moodBtnLabel(mood, enLabel) {
  return current === "id" ? (MOOD_LABEL_BTN_ID[mood] ?? enLabel) : enLabel;
}

export function rapidLine(index, enLine) {
  return current === "id" ? (RAPID_LINES_ID[index] ?? enLine) : enLine;
}

export function cooldownLine(index, enLine) {
  return current === "id" ? (COOLDOWN_LINES_ID[index] ?? enLine) : enLine;
}

export function scriptedPress(n, enObj) {
  return current === "id" ? (SCRIPTED_ID[n] ?? enObj) : enObj;
}

export function reverse() {
  return current === "id" ? REVERSE_ID : null;
}

export function honesty() {
  return current === "id" ? HONESTY_ID : null;
}

export function fakeError() {
  return current === "id" ? FAKE_ERROR_ID : null;
}

export function hoverLine(index, enLine) {
  return current === "id" ? (HOVER_LINES_ID[index] ?? enLine) : enLine;
}

export function returnLines() {
  return current === "id" ? RETURN_LINES_ID : null;
}

export function tickerItems(enItems) {
  return current === "id" ? TICKER_ITEMS_ID : enItems;
}

export function logLine(kind, index, enLine) {
  return current === "id" ? (LOG_LINES_ID[kind]?.[index] ?? enLine) : enLine;
}

export function logLines(kind, enLines) {
  return current === "id" ? (LOG_LINES_ID[kind] ?? enLines) : enLines;
}

export function trustWord(value, enWord) {
  if (current !== "id") return enWord;
  const sorted = Object.entries(TRUST_WORD_ID)
    .map(([k, v]) => [Number(k), v])
    .sort((a, b) => b[0] - a[0]);
  for (const [threshold, word] of sorted) {
    if (value >= threshold) return word;
  }
  return enWord;
}

export function suspicionWordLabel(value, enWord) {
  if (current !== "id") return enWord;
  const sorted = Object.entries(SUSPICION_WORD_ID)
    .map(([k, v]) => [Number(k), v])
    .sort((a, b) => b[0] - a[0]);
  for (const [threshold, word] of sorted) {
    if (value >= threshold) return word;
  }
  return enWord;
}

export function countFootLine(n, enText) {
  if (current !== "id") return enText;
  const keys = Object.keys(COUNT_FOOT_ID)
    .map(Number)
    .sort((a, b) => b - a);
  for (const key of keys) {
    if (key === 0 && n === 0) return COUNT_FOOT_ID[0];
    if (key <= n) return COUNT_FOOT_ID[key];
  }
  return COUNT_FOOT_ID[0];
}

/* ------------------------------------------------------------------
   Secret document translations.
   tSecrets() returns an ID-keyed object mirroring SECRETS, with
   translated title / clue / desc / doc fields filled in.
   ------------------------------------------------------------------ */

export function tSecrets() {
  if (current !== "id") return null;
  return SECRETS.map((s) => {
    const desc = SECRETS_DESC_ID[s.id];
    return {
      id: s.id,
      code: s.code,
      title: desc?.title ?? s.title,
      clue: desc?.clue ?? s.clue,
      desc: desc?.desc ?? s.desc,
      stamp: s.stamp,
      kicker: s.kicker,
      doc: DOCS_ID[s.id] ?? s.doc,
    };
  });
}

export function tFinale() {
  return current === "id" ? FINALE_ID : null;
}

export function tAboutDoc() {
  if (current !== "id") return null;
  return {
    kicker: "FILE KASUS · TENTANG INSIDEN INI",
    title: UI_ID.aboutTitle,
    body: UI_ID.aboutBody,
  };
}

export function tFormSubmitter(name) {
  if (current !== "id") return null;
  return `Diproses. Selamat datang, ${name || "pencet tanpa nama"}. Level akses lo: 'tetep cuma tombol'.`;
}