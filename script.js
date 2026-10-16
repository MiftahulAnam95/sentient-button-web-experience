/* ==========================================================================
   THE BUTTON HAS TRUST ISSUES
   script.js — bootstrap. Loads saved state, wires the chrome around the
   button (header, modals, keyboard, reset) and starts the tick loop.
   Module map:
     js/content.js  — all copy, moods, documents
     js/state.js    — state object, trust/suspicion maths, persistence
     js/ui.js       — DOM access, rendering, modals, toasts
     js/secrets.js  — discovery system
     js/button.js   — the character's behaviour
     js/sound.js    — optional synthesised blips
   ========================================================================== */

import { ABOUT_DOC, LOG_LINES, RETURN_LINES } from "./js/content.js";
import {
  getState,
  loadState,
  registerVisit,
  saveState,
  session,
  setLang,
  setSound,
  subscribe,
  wipeState,
} from "./js/state.js";
import {
  lang as getLang,
  setLang as setLangModule,
  onLangChange,
  tAboutDoc,
  returnLines,
  logLines,
  t,
} from "./js/lang.js";
import {
  addLog,
  announce,
  anyModalOpen,
  applyLanguage,
  clearLog,
  closeModal,
  closeTopModal,
  el,
  hideToast,
  initTicker,
  openDoc,
  openModal,
  renderMeters,
  say,
  trapFocus,
} from "./js/ui.js";
import { openFinale, renderSecrets } from "./js/secrets.js";
import { initButton, onTrustTyped, recallButton, refreshMoodVisuals, resetCharacter, tick } from "./js/button.js";
import { play, setSoundEnabled } from "./js/sound.js";

/* ---------- boot ---------- */

function boot() {
  loadState();
  const returning = getState().visits > 0;
  registerVisit();

  // sync language module with saved preference
  const savedLang = getState().lang || "en";
  setLangModule(savedLang);
  applyLanguage();
  if (savedLang === "id") {
    el.langToggle.dataset.lang = "id";
    el.langCurrent.textContent = "ID";
    el.langToggle.setAttribute("aria-label", "Toggle bahasa, sekarang Indonesia");
  }
  onLangChange((lang) => {
    setLang(lang); // persist to localStorage
    el.langToggle.dataset.lang = lang;
    el.langCurrent.textContent = lang === "id" ? "ID" : "EN";
    el.langToggle.setAttribute(
      "aria-label",
      lang === "id" ? "Toggle bahasa, sekarang Indonesia" : "Toggle language, currently English"
    );
    applyLanguage();
    refreshMoodVisuals(true);
    renderMeters();
    renderSecrets();
  });

  subscribe(renderMeters);
  initTicker();
  stampDate();
  renderMeters();
  renderSecrets();
  initButton();
  wireChrome();
  wireKeyboard();
  greet(returning);

  setSoundEnabled(getState().sound);
  renderSoundToggle();

  window.setInterval(tick, 250);
  window.addEventListener("beforeunload", saveState);
}

function stampDate() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  el.heroDate.textContent = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(
    now.getDate()
  )} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

/** First words on arrival — contextual for returning visitors. */
function greet(returning) {
  const s = getState();
  const isID = getLang() === "id";
  const arrive = logLines("arrive", LOG_LINES.arrive);
  addLog(arrive[returning ? 1 : 0], "normal");

  if (!returning) {
    say(
      isID ? "Gue liat lo nemuin gue. Sial buat kita berdua." : "I see you found me. Unfortunate, for both of us.",
      { tag: isID ? "TOMBOL BILANG" : "BUTTON SAYS" }
    );
    if (!session.storageOK) {
      addLog("Storage unavailable. This session will not be remembered. Button relieved.", "normal");
    }
    return;
  }

  const rLines = returnLines() || RETURN_LINES;
  let line = rLines.low;
  if (s.finale) line = rLines.complete;
  else if (s.secrets.length >= 3 || s.interactions >= 25) line = rLines.high;
  else if (s.interactions >= 6) line = rLines.mid;

  say(line, { tag: isID ? "SEBELUMNYA DI TBHTI®" : "PREVIOUSLY ON TBHTI®", tone: "soft" });
  const prevLog = isID
    ? `Subjek kembali. ${s.interactions} interaksi sebelumnya tercatat, ${s.secrets.length} dokumen sudah dipulihkan.`
    : `Returning subject. ${s.interactions} previous interaction${
        s.interactions === 1 ? "" : "s"
      } on file, ${s.secrets.length} document${s.secrets.length === 1 ? "" : "s"} already recovered.`;
  addLog(prevLog, "calm");
  refreshMoodVisuals(true);
}

/* ---------- header / footer / modal wiring ---------- */

function wireChrome() {
  el.aboutBtn.addEventListener("click", () => {
    const about = tAboutDoc();
    openDoc({
      kicker: about?.kicker ?? ABOUT_DOC.kicker,
      title: about?.title ?? ABOUT_DOC.title,
      html: about?.body ?? ABOUT_DOC.body,
    });
  });

  el.langToggle.addEventListener("click", () => {
    const next = getLang() === "en" ? "id" : "en";
    setLangModule(next);
  });

  el.soundToggle.addEventListener("click", () => {
    const next = !getState().sound;
    setSound(next);
    setSoundEnabled(next);
    renderSoundToggle();
    if (next) play("press");
    announce(next ? "Sound on." : "Sound off.");
  });

  el.finaleBtn.addEventListener("click", openFinale);
  el.docModalClose.addEventListener("click", () => closeModal(el.docModal));

  // every scrim closes its own modal
  document.querySelectorAll(".modal__scrim").forEach((scrim) => {
    scrim.addEventListener("click", () => closeModal(scrim.parentElement));
  });

  // reset flow — always confirmed first
  el.resetBtn.addEventListener("click", openResetConfirm);
  el.confirmNo.addEventListener("click", () => {
    closeModal(el.confirmModal);
    say("Good. I'd have to learn your clicking rhythm all over again.", { tag: "RELIEVED", tone: "soft" });
  });
  el.confirmNo2.addEventListener("click", () => closeModal(el.confirmModal));
  el.confirmYes.addEventListener("click", performReset);
}

function renderSoundToggle() {
  const on = getState().sound;
  el.soundToggle.setAttribute("aria-pressed", on ? "true" : "false");
  el.soundState.textContent = on ? "ON" : "OFF";
}

function openResetConfirm() {
  // update modal text with current language
  const isID = getLang() === "id";
  el.confirmKicker.textContent = isID ? "PENGHENTIAN HUBUNGAN" : "TERMINATION OF RELATIONSHIP";
  el.confirmTitle.textContent = isID ? "Hapus semua?" : "Erase everything?";
  el.confirmText.textContent = isID
    ? "Ini ngehapus semua interaksi, semua rahasia dan seluruh memori tombol tentang kamu. Dia bakal pura-pura gapernah terjadi. Dia jago banget soal itu."
    : "This deletes every interaction, every secret and the button's entire memory of you. It will act like nothing happened. It is very good at that.";
  el.confirmNo.textContent = isID ? "GAK, KITA MASIH FINE" : "NO, WE'RE FINE";
  el.confirmYes.textContent = isID ? "IYA, HAPUS SEMUA" : "YES, WIPE IT";
  openModal(el.confirmModal, el.confirmNo);
  announce(isID ? "Konfirmasi reset dibuka." : "Reset confirmation opened.");
}

function performReset() {
  wipeState();
  closeModal(el.confirmModal);
  clearLog();
  renderSecrets();
  resetCharacter();
  renderMeters();
  const resetLog = logLines("reset", LOG_LINES.reset);
  addLog(resetLog[0], "alarm");
  const isID = getLang() === "id";
  say(
    isID ? "…Lo siapa? Gak pernah liat lo sebelumnya." : "…Who are you? Never seen you before in my life.",
    { tag: isID ? "MULAI BARU" : "FRESH START" }
  );
  announce(isID ? "Progress dihapus. Tombol udah lupa semua." : "Progress cleared. The button has forgotten everything.");
  play("deny");
}

/* ---------- keyboard ---------- */

const SECRET_WORD = "trust";
let typedBuffer = "";

function isTypingTarget(node) {
  if (!node) return false;
  const tag = node.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || node.isContentEditable;
}

function wireKeyboard() {
  document.addEventListener("keydown", (event) => {
    trapFocus(event);

    if (event.key === "Escape") {
      if (anyModalOpen()) closeTopModal();
      hideToast();
      return;
    }

    if (isTypingTarget(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;

    const key = event.key.toLowerCase();

    // hidden sequence: type the five-letter word
    if (/^[a-z]$/.test(key)) {
      typedBuffer = (typedBuffer + key).slice(-SECRET_WORD.length);
      if (typedBuffer === SECRET_WORD) {
        typedBuffer = "";
        onTrustTyped();
        return;
      }
    }

    // R opens the reset confirmation — unless the user is mid-way through
    // typing the secret word (which also contains an R).
    if (key === "r" && !anyModalOpen() && !typedBuffer.startsWith("t")) {
      event.preventDefault();
      openResetConfirm();
      return;
    }

    // C recentres the button if it has wandered off (recovery path)
    if (key === "c" && !el.recallBtn.hidden) {
      recallButton();
    }
  });
}

/* ---------- go ---------- */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
