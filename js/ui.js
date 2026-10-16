/* ==========================================================================
   ui.js — everything that touches the DOM.
   Logic modules never query elements themselves; they call these helpers.
   ========================================================================== */

import { MOODS, TICKER_ITEMS } from "./content.js";
import { getState, suspicionWord, trustWord, session } from "./state.js";
import {
  lang as getLang,
  t,
  moodLabel,
  moodGlyph,
  moodPosture,
  moodNote,
  trustWord as tTrustWord,
  suspicionWordLabel,
  countFootLine,
  tickerItems,
} from "./lang.js";

const $ = (id) => document.getElementById(id);

export const el = {
  root: document.documentElement,
  // header
  moodLed: $("moodLed"),
  moodLabel: $("moodLabel"),
  moodGlyph: $("moodGlyph"),
  soundToggle: $("soundToggle"),
  soundState: $("soundState"),
  langToggle: $("langToggle"),
  langCurrent: $("langCurrent"),
  aboutBtn: $("aboutBtn"),
  tickerTrack: $("tickerTrack"),
  // hero
  heroTrustWord: $("heroTrustWord"),
  heroDate: $("heroDate"),
  // stage
  stage: $("stage"),
  stageCoords: $("stageCoords"),
  stageHint: $("stageHint"),
  dock: $("buttonDock"),
  button: $("theButton"),
  btnLabel: $("btnLabel"),
  speech: $("speech"),
  speechText: $("speechText"),
  speechTag: $("speechTag"),
  pupilL: $("pupilL"),
  pupilR: $("pupilR"),
  mouth: $("tbMouth"),
  recallBtn: $("recallBtn"),
  diagnosticOverlay: $("diagnosticOverlay"),
  diagnosticOut: $("diagnosticOut"),
  // rail
  trustMeter: $("trustMeter"),
  trustFill: $("trustFill"),
  trustValue: $("trustValue"),
  trustWordEl: $("trustWord"),
  suspicionMeter: $("suspicionMeter"),
  suspicionFill: $("suspicionFill"),
  suspicionValue: $("suspicionValue"),
  suspicionPeak: $("suspicionPeak"),
  countValue: $("countValue"),
  countFoot: $("countFoot"),
  diagMood: $("diagMood"),
  diagPosture: $("diagPosture"),
  diagUptime: $("diagUptime"),
  diagSecrets: $("diagSecrets"),
  diagNote: $("diagNote"),
  // log + secrets
  logList: $("logList"),
  secretGrid: $("secretGrid"),
  secretProgress: $("secretProgress"),
  finaleCard: $("finaleCard"),
  finaleTitle: $("finaleTitle"),
  finaleText: $("finaleText"),
  finaleBtn: $("finaleBtn"),
  // overlays
  docModal: $("docModal"),
  docSheet: $("docSheet"),
  docModalBody: $("docModalBody"),
  docModalKicker: $("docModalKicker"),
  docModalClose: $("docModalClose"),
  confirmModal: $("confirmModal"),
  confirmKicker: $("confirmKicker"),
  confirmTitle: $("confirmTitle"),
  confirmText: $("confirmText"),
  confirmYes: $("confirmYes"),
  confirmNo: $("confirmNo"),
  confirmNo2: $("confirmNo2"),
  formModal: $("formModal"),
  formName: $("formName"),
  formCheck: $("formCheck"),
  formSubmit: $("formSubmit"),
  formDecline: $("formDecline"),
  formClose: $("formClose"),
  toast: $("toast"),
  toastKicker: $("toastKicker"),
  toastTitle: $("toastTitle"),
  toastRead: $("toastRead"),
  // a11y
  srStatus: $("srStatus"),
  resetBtn: $("resetBtn"),
};

export const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* ---------- small helpers ---------- */

export function announce(message) {
  if (!el.srStatus) return;
  el.srStatus.textContent = message;
}

export function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (ch) => {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
  });
}

/** mm:ss since the page opened — used by the incident log. */
export function sessionClock() {
  const secs = Math.floor((Date.now() - session.startedAt) / 1000);
  const m = String(Math.floor(secs / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${m}:${s}`;
}

/* ---------- speech bubble ---------- */

export function say(text, { tag = "BUTTON SAYS", tone = "neutral", shout = false } = {}) {
  if (!el.speech) return;
  el.speech.dataset.tone = tone;
  el.speechTag.textContent = tag;
  el.speechText.textContent = text;
  el.speechText.classList.toggle("speech__text--shout", Boolean(shout));
  // restart the pop-in animation
  el.speech.style.animation = "none";
  void el.speech.offsetWidth;
  el.speech.style.animation = "";
  announce(`Button says: ${text}`);
}

export function setLabel(text) {
  if (el.btnLabel) el.btnLabel.textContent = text;
  if (el.button) el.button.setAttribute("aria-label", `The button. Current label: ${text}`);
}

/* ---------- the face ---------- */

export function applyMood(mood) {
  const config = MOODS[mood] || MOODS.CAUTIOUS;
  el.root.style.setProperty("--mood", config.color);
  el.root.style.setProperty("--browL", `${config.brows[0]}deg`);
  el.root.style.setProperty("--browR", `${config.brows[1]}deg`);
  if (el.mouth) el.mouth.setAttribute("d", config.mouth);
  if (el.button) {
    el.button.dataset.mood = mood;
    el.button.dataset.sweat = mood === "PANICKING" || mood === "ANNOYED" ? "1" : "0";
  }
  if (el.moodLabel) el.moodLabel.textContent = moodLabel(mood);
  if (el.moodGlyph) el.moodGlyph.textContent = moodGlyph(mood, config.glyph);
  if (el.diagMood) el.diagMood.textContent = moodLabel(mood);
  if (el.diagPosture) el.diagPosture.textContent = moodPosture(mood, config.posture);
  if (el.diagNote) el.diagNote.textContent = moodNote(mood, config.note);
  blink();
}

let blinkTimer = null;
export function blink() {
  if (!el.button) return;
  clearTimeout(blinkTimer);
  el.button.dataset.blink = "1";
  blinkTimer = setTimeout(() => {
    el.button.dataset.blink = "0";
  }, 110);
}

/** Pupils follow the pointer, clamped so the eyes never look broken. */
export function lookAt(clientX, clientY) {
  if (!el.button || !el.pupilL) return;
  const rect = el.button.getBoundingClientRect();
  if (!rect.width) return;
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height * 0.42;
  const dx = clamp((clientX - cx) / (rect.width / 2), -1, 1) * 7;
  const dy = clamp((clientY - cy) / (rect.height / 2), -1, 1) * 6;
  el.pupilL.style.transform = `translate(${dx}px, ${dy}px)`;
  el.pupilR.style.transform = `translate(${dx}px, ${dy}px)`;
}

export function restEyes() {
  if (!el.pupilL) return;
  el.pupilL.style.transform = "";
  el.pupilR.style.transform = "";
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

/* ---------- press feedback ---------- */

export function pressPulse() {
  if (!el.button) return;
  el.button.dataset.press = "1";
  setTimeout(() => {
    el.button.dataset.press = "0";
  }, 130);
}

export function tilt(deg) {
  el.root.style.setProperty("--tilt", `${deg}deg`);
}

export function shakeStage() {
  if (!el.stage || reducedMotion.matches) return;
  el.stage.dataset.shake = "1";
  setTimeout(() => {
    el.stage.dataset.shake = "0";
  }, 420);
}

export function setAlarm(on) {
  if (el.stage) el.stage.dataset.alarm = on ? "1" : "0";
}

/* ---------- rail rendering ---------- */

export function renderMeters() {
  const s = getState();
  const isID = getLang() === "id";
  if (el.trustFill) el.trustFill.style.width = `${s.trust}%`;
  if (el.trustMeter) el.trustMeter.setAttribute("aria-valuenow", String(Math.round(s.trust)));
  if (el.trustValue) el.trustValue.textContent = `${Math.round(s.trust)}%`;
  if (el.trustWordEl) el.trustWordEl.textContent = tTrustWord(s.trust, trustWord());
  if (el.heroTrustWord) el.heroTrustWord.textContent = tTrustWord(s.trust, trustWord());

  if (el.suspicionFill) el.suspicionFill.style.width = `${s.suspicion}%`;
  if (el.suspicionMeter) {
    el.suspicionMeter.setAttribute("aria-valuenow", String(Math.round(s.suspicion)));
    el.suspicionMeter.setAttribute("aria-valuetext", suspicionWord());
  }
  if (el.suspicionValue) el.suspicionValue.textContent = suspicionWordLabel(s.suspicion, suspicionWord());
  if (el.suspicionPeak) {
    el.suspicionPeak.textContent = `${isID ? "PUNCAK" : "PEAK"}: ${suspicionWordLabel(
      s.peakSuspicion,
      suspicionWord(s.peakSuspicion)
    )}`;
  }
  if (el.countValue) el.countValue.textContent = String(s.interactions);
}

export function spikeMeter(which = "suspicionMeter") {
  const node = el[which];
  if (!node || reducedMotion.matches) return;
  node.dataset.spike = "1";
  setTimeout(() => {
    node.dataset.spike = "0";
  }, 420);
}

export function bumpCounter() {
  if (!el.countValue || reducedMotion.matches) return;
  el.countValue.dataset.bump = "1";
  setTimeout(() => {
    el.countValue.dataset.bump = "0";
  }, 320);
}

export function setCountFoot(text, n) {
  if (el.countFoot) el.countFoot.textContent = countFootLine(n ?? 0, text);
}

export function renderUptime() {
  if (el.diagUptime) el.diagUptime.textContent = sessionClock();
}

/* ---------- incident log ---------- */

const LOG_LIMIT = 7;

export function addLog(text, kind = "normal") {
  if (!el.logList) return;
  const li = document.createElement("li");
  li.className = "log__item";
  li.dataset.kind = kind;
  const time = document.createElement("span");
  time.className = "log__time";
  time.textContent = `[${sessionClock()}]`;
  const body = document.createElement("span");
  body.className = "log__text";
  body.textContent = text;
  li.append(time, body);
  el.logList.prepend(li);
  while (el.logList.children.length > LOG_LIMIT) {
    el.logList.lastElementChild.remove();
  }
}

export function clearLog() {
  if (el.logList) el.logList.innerHTML = "";
}

/* ---------- ticker & bilingual DOM sync ---------- */

export function applyLanguage() {
  const isID = getLang() === "id";
  const root = document.getElementById("rootHtml");
  if (root) root.lang = isID ? "id" : "en";

  document.title = isID
    ? "SI TOMBOL PUNYA TRUST ISSUES — TBHTI®"
    : "THE BUTTON HAS TRUST ISSUES — TBHTI®";

  // swap meta description
  const meta = document.querySelector('meta[name="description"]');
  if (meta) {
    meta.content = isID
      ? "SI TOMBOL PUNYA TRUST ISSUES — eksperimen interaktif soal trust issue parah. Satu tombol baperan, delapan mood swing, tujuh dokumen aib."
      : "THE BUTTON HAS TRUST ISSUES — an interactive experiment in distrust. One sentient button, eight moods, seven classified secrets.";
  }

  // aria-labels
  const rail = el.trustMeter?.closest?.("aside");
  if (rail) rail.setAttribute("aria-label", isID ? "Diagnostik mental tombol" : "Button diagnostics");

  // data-t="key" -> innerHTML = t("key", originalEnglishInnerHTML)
  document.querySelectorAll("[data-t]").forEach((node) => {
    const key = node.dataset.t;
    if (node.dataset.tEn === undefined) {
      node.dataset.tEn = node.innerHTML;
    }
    node.innerHTML = t(key, node.dataset.tEn);
  });

  // placeholder
  document.querySelectorAll("[data-t-placeholder]").forEach((input) => {
    const key = input.dataset.tPlaceholder;
    if (input.dataset.tPlaceholderEn === undefined) {
      input.dataset.tPlaceholderEn = input.placeholder;
    }
    input.placeholder = t(key, input.dataset.tPlaceholderEn);
  });

  // data-t-aria="key" -> aria-label = t("key", originalEnglishAria)
  document.querySelectorAll("[data-t-aria]").forEach((node) => {
    const key = node.dataset.tAria;
    if (node.dataset.tAriaEn === undefined) {
      node.dataset.tAriaEn = node.getAttribute("aria-label") || "";
    }
    node.setAttribute("aria-label", t(key, node.dataset.tAriaEn));
  });

  initTicker();
  announce(isID ? "Mode Bahasa Indonesia (Gaul Gen-Z) aktif." : "Language switched to English.");
}

export function initTicker() {
  if (!el.tickerTrack) return;
  const items = tickerItems(TICKER_ITEMS);
  const track = [...items, ...items];
  el.tickerTrack.textContent = "";
  track.forEach((text) => {
    const span = document.createElement("span");
    span.textContent = `${text}  ✦`;
    el.tickerTrack.append(span);
  });
}

/* ---------- modal manager ---------- */

let lastFocused = null;
let openModalNode = null;

export function openModal(node, focusTarget) {
  if (!node) return;
  lastFocused = document.activeElement;
  node.hidden = false;
  openModalNode = node;
  document.body.style.overflow = "hidden";
  const target = focusTarget || node.querySelector(".modal__x");
  if (target) setTimeout(() => target.focus(), 30);
}

export function closeModal(node) {
  const target = node || openModalNode;
  if (!target) return;
  target.hidden = true;
  if (target === openModalNode) openModalNode = null;
  if (!document.querySelector(".modal:not([hidden])")) {
    document.body.style.overflow = "";
  }
  if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
}

export function anyModalOpen() {
  return Boolean(document.querySelector(".modal:not([hidden])"));
}

export function closeTopModal() {
  const open = document.querySelector(".modal:not([hidden])");
  if (open) closeModal(open);
}

/** Keeps Tab inside an open dialog. */
export function trapFocus(event) {
  const open = document.querySelector(".modal:not([hidden]) .modal__sheet");
  if (!open || event.key !== "Tab") return;
  const focusables = open.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

/** Render a "document" (secret, certificate, about panel) into the modal. */
export function openDoc({ kicker = "CLASSIFIED", title = "", html = "" }) {
  if (!el.docModalBody) return;
  el.docModalKicker.textContent = kicker;
  el.docModalBody.innerHTML = `<h3 id="docModalTitle">${escapeHTML(title)}</h3>${html}`;
  openModal(el.docModal, el.docModalClose);
  announce(`Document opened: ${title}`);
}

/* ---------- toast ---------- */

let toastTimer = null;

export function showToast({ kicker, title, onRead }) {
  if (!el.toast) return;
  el.toastKicker.textContent = kicker;
  el.toastTitle.textContent = title;
  el.toast.hidden = false;
  el.toast.style.animation = "none";
  void el.toast.offsetWidth;
  el.toast.style.animation = "";
  el.toastRead.onclick = () => {
    hideToast();
    if (typeof onRead === "function") onRead();
  };
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 8000);
}

export function hideToast() {
  if (el.toast) el.toast.hidden = true;
}
