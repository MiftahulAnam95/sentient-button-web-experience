/* ==========================================================================
   THE BUTTON HAS TRUST ISSUES
   script.js — bootstrap. Loads saved state, wires the chrome around the
   button (header, modals, keyboard, reset) and starts the tick loop.
   Module map:
     js/content.js     — English copy, moods, documents
     js/content.id.js  — Bahasa Indonesia (Gaul Gen-Z) copy, moods, documents
     js/lang.js        — bilingual switcher & lookup helpers
     js/state.js       — state object, trust/suspicion maths, persistence
     js/ui.js          — DOM access, rendering, modals, toasts
     js/secrets.js     — discovery system
     js/button.js      — the character's behaviour
     js/sound.js       — synthesised Web Audio API blips
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
import {
  initButton,
  onTrustTyped,
  recallButton,
  refreshLabel,
  refreshMoodVisuals,
  resetCharacter,
  tick,
} from "./js/button.js";
import { play, setSoundEnabled } from "./js/sound.js";

/* ---------- boot ---------- */

function boot() {
  loadState();
  const returning = getState().visits > 0;
  registerVisit();

  // sync sound preference first
  setSoundEnabled(getState().sound);

  // sync language module with saved preference
  const savedLang = getState().lang || "id";
  setLangModule(savedLang);
  applyLanguage();
  renderLangToggle(savedLang);
  renderSoundToggle();

  onLangChange((lang) => {
    setLang(lang); // persist to localStorage
    renderLangToggle(lang);
    applyLanguage();
    refreshMoodVisuals(true);
    refreshLabel();
    renderMeters();
    renderSecrets();
    renderSoundToggle();

    const isID = lang === "id";
    say(
      isID
        ? "Oke fix, sekarang gue ngomong mode Bahasa Gaul Gen-Z. Jangan baper ya bestie."
        : "Fine, switching to English. My trust issues are bilingual anyway.",
      {
        tag: isID ? "MODE GEN-Z AKTIF" : "LANGUAGE SWITCHED",
        tone: "soft",
      }
    );
    addLog(
      isID
        ? "Mode Bahasa Indonesia (Gaul Gen-Z) diaktifkan oleh subjek."
        : "Language switched to English by subject.",
      "calm"
    );
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

  window.setInterval(tick, 250);
  window.addEventListener("beforeunload", saveState);
}

function renderLangToggle(lang) {
  if (!el.langToggle || !el.langCurrent) return;
  const isID = lang === "id";
  el.langToggle.dataset.lang = lang;
  el.langCurrent.textContent = isID ? "ID · GEN-Z" : "EN";
  el.langToggle.setAttribute(
    "aria-label",
    isID
      ? "Ganti bahasa, sekarang Bahasa Indonesia (Gaul Gen-Z)"
      : "Toggle language, currently English"
  );
  el.langToggle.setAttribute(
    "title",
    isID ? "Klik buat ganti ke Bahasa Inggris (EN)" : "Click to switch to Bahasa Indonesia (Gen-Z)"
  );
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
      isID
        ? "Waduh, ketauan deh tempat nongkrong gue. Sial banget buat kita berdua, bestie."
        : "I see you found me. Unfortunate, for both of us.",
      { tag: isID ? "TOMBOL BILANG" : "BUTTON SAYS" }
    );
    if (!session.storageOK) {
      addLog(
        isID
          ? "LocalStorage gak tersedia. Sesi ini gak bakal diinget. Tombol lega banget."
          : "Storage unavailable. This session will not be remembered. Button relieved.",
        "normal"
      );
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
    ? `Subjek balik lagi. ${s.interactions} histori klik tercatat, ${s.secrets.length} dokumen aib udah kebongkar.`
    : `Returning subject. ${s.interactions} previous interaction${
        s.interactions === 1 ? "" : "s"
      } on file, ${s.secrets.length} document${s.secrets.length === 1 ? "" : "s"} already recovered.`;
  addLog(prevLog, "calm");
  refreshMoodVisuals(true);
}

/* ---------- header / footer / modal wiring ---------- */

function wireChrome() {
  el.aboutBtn?.addEventListener("click", () => {
    play("toggle");
    const about = tAboutDoc();
    openDoc({
      kicker: about?.kicker ?? ABOUT_DOC.kicker,
      title: about?.title ?? ABOUT_DOC.title,
      html: about?.body ?? ABOUT_DOC.body,
    });
  });

  el.langToggle?.addEventListener("click", () => {
    const next = getLang() === "en" ? "id" : "en";
    setLangModule(next);
    play("toggle");
  });

  el.soundToggle?.addEventListener("click", () => {
    const next = !getState().sound;
    setSound(next);
    setSoundEnabled(next);
    renderSoundToggle();
    const isID = getLang() === "id";
    if (next) {
      play("press");
      say(
        isID
          ? "Suara dinyalain nih. Siap-siap dengerin gue ngomel pake efek synth."
          : "Audio enabled. Now you can hear me judge you in stereo.",
        { tag: isID ? "AUDIO ON" : "SOUND ON", tone: "soft" }
      );
    } else {
      say(
        isID
          ? "Suara di-mute. Diemin aja terus, gue udah biasa dibungkam kok."
          : "Muted. Fine, silence me. See if that fixes my trust issues.",
        { tag: isID ? "AUDIO MUTE" : "SOUND OFF", tone: "neutral" }
      );
    }
    announce(
      next
        ? isID
          ? "Suara aktif."
          : "Sound on."
        : isID
          ? "Suara dimatikan."
          : "Sound off."
    );
  });

  el.finaleBtn?.addEventListener("click", openFinale);
  el.docModalClose?.addEventListener("click", () => {
    play("toggle");
    closeModal(el.docModal);
  });

  // every scrim closes its own modal
  document.querySelectorAll(".modal__scrim").forEach((scrim) => {
    scrim.addEventListener("click", () => closeModal(scrim.parentElement));
  });

  // reset flow — always confirmed first
  el.resetBtn?.addEventListener("click", () => {
    play("toggle");
    openResetConfirm();
  });
  el.confirmNo?.addEventListener("click", () => {
    play("calm");
    closeModal(el.confirmModal);
    const isID = getLang() === "id";
    say(
      isID
        ? "Nah gitu dong bestie. Males banget gue kalau harus ngafalin ritme jempol lo dari nol lagi."
        : "Good. I'd have to learn your clicking rhythm all over again.",
      { tag: isID ? "LEGA PARAH" : "RELIEVED", tone: "soft" }
    );
  });
  el.confirmNo2?.addEventListener("click", () => closeModal(el.confirmModal));
  el.confirmYes?.addEventListener("click", performReset);
}

function renderSoundToggle() {
  if (!el.soundToggle || !el.soundState) return;
  const on = getState().sound;
  el.soundToggle.setAttribute("aria-pressed", on ? "true" : "false");
  el.soundState.textContent = on ? "ON" : "OFF";
}

function openResetConfirm() {
  const isID = getLang() === "id";
  if (el.confirmKicker) {
    el.confirmKicker.textContent = isID
      ? "CUT OFF HUBUNGAN SEKARANG"
      : "TERMINATION OF RELATIONSHIP";
  }
  if (el.confirmTitle) {
    el.confirmTitle.textContent = isID ? "Yakin mau cut off & hapus semua?" : "Erase everything?";
  }
  if (el.confirmText) {
    el.confirmText.textContent = isID
      ? "Ini bakal ngehapus semua histori interaksi, 7 rahasia yang udah kebongkar, dan semua memori tombol tentang lo. Doi bakal belagak amnesia kayak kita gak pernah kenal. Doi jago banget soal playing strangers."
      : "This deletes every interaction, every secret and the button's entire memory of you. It will act like nothing happened. It is very good at that.";
  }
  if (el.confirmNo) {
    el.confirmNo.textContent = isID ? "GAJADI DEH, MASIH AMAN" : "NO, WE'RE FINE";
  }
  if (el.confirmYes) {
    el.confirmYes.textContent = isID ? "GAS, HAPUS SEMUA KENANGAN" : "YES, WIPE IT";
  }
  openModal(el.confirmModal, el.confirmNo);
  announce(isID ? "Konfirmasi reset hubungan dibuka." : "Reset confirmation opened.");
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
    isID
      ? "…Lah, lo siapa dah? Perasaan kita belum pernah kenalan sebelumnya."
      : "…Who are you? Never seen you before in my life.",
    { tag: isID ? "AMNESIA MODE" : "FRESH START" }
  );
  announce(
    isID
      ? "Progress dihapus. Si tombol udah lupa semuanya tentang lo."
      : "Progress cleared. The button has forgotten everything."
  );
  play("deny");
}

/* ---------- keyboard ---------- */

const SECRET_WORDS = ["trust", "yakin"];
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

    // hidden sequence: type the five-letter word ("trust" or "yakin")
    if (/^[a-z]$/.test(key)) {
      typedBuffer = (typedBuffer + key).slice(-5);
      if (SECRET_WORDS.includes(typedBuffer)) {
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
