/* ==========================================================================
   button.js — the character.
   One press handler, one tick loop, and a set of clearly separated scripted
   beats (rapid-fire cooldown, escape, fake outage, reverse psychology,
   paperwork, honesty). Nothing here talks to localStorage directly.
   ========================================================================== */

import {
  MOODS,
  SCRIPTED_PRESSES,
  RAPID_LINES,
  COOLDOWN_LINES,
  REVERSE,
  HONESTY,
  FAKE_ERROR,
  HOVER_LINES,
  LOG_LINES,
} from "./content.js";
import {
  adjust,
  countPress,
  clearForcedMood,
  forceMood,
  getState,
  resolveMood,
  saveState,
  session,
  setPresserName,
  suspicionWord,
} from "./state.js";
import {
  addLog,
  announce,
  applyMood,
  blink,
  bumpCounter,
  el,
  lookAt,
  pressPulse,
  reducedMotion,
  renderMeters,
  restEyes,
  say,
  setAlarm,
  setCountFoot,
  setLabel,
  shakeStage,
  spikeMeter,
  tilt,
  closeModal,
  openModal,
  renderUptime,
} from "./ui.js";
import { play } from "./sound.js";
import { unlock } from "./secrets.js";
import {
  lang as getLang,
  t,
  moodBtnLabel,
  moodTag,
  moodReactions,
  rapidLine,
  cooldownLine,
  scriptedPress,
  reverse as getReverse,
  honesty as getHonesty,
  fakeError as getFakeError,
  hoverLine,
} from "./lang.js";

/* ---------- tuning constants (all the "feel" lives here) ---------- */
const RAPID_WINDOW = 2200; // ms considered "a burst"
const RAPID_THRESHOLD = 6; // presses inside the window before it snaps
const COOLDOWN_MS = 3800;
const IDLE_SILENCE_MS = 20000; // silence protocol
const IDLE_NAG_MS = 38000; // occasional "are you still there"
const LONG_PRESS_MS = 1800;
const REVERSE_WINDOW = 11000;

const MILESTONE = {
  firstDodge: 9,
  fakeError: 14,
  reverse: 19,
  paperwork: 24,
  honesty: 30,
};

/* ---------- local, non-persistent flags ---------- */
let suppressNextClick = false;
let holdTimer = null;
let holdStarted = 0;
let lastHoverLineAt = 0;
let lastMood = null;
let lastIdleNagAt = 0;
let cooldownEndsAt = 0;
let errorTimers = [];

/* ==========================================================================
   SETUP
   ========================================================================== */

export function initButton() {
  const btn = el.button;
  if (!btn) return;

  btn.addEventListener("click", onClick);
  btn.addEventListener("pointerdown", onPointerDown);
  btn.addEventListener("pointerup", cancelHold);
  btn.addEventListener("pointercancel", cancelHold);
  btn.addEventListener("pointerleave", cancelHold);
  btn.addEventListener("keydown", onKeyDown);
  btn.addEventListener("keyup", cancelHold);

  // pointer tracking: eyes + suspicious micro-movements (never required)
  el.stage.addEventListener("pointermove", onStagePointerMove);
  el.stage.addEventListener("pointerleave", () => restEyes());

  el.recallBtn.addEventListener("click", () => recallButton(false));

  // Form B-12 (the paperwork beat)
  el.formSubmit.addEventListener("click", submitForm);
  el.formDecline.addEventListener("click", declineForm);
  el.formClose.addEventListener("click", declineForm);

  // idle blinking keeps it alive without constant motion
  setInterval(() => {
    if (!document.hidden && Math.random() < 0.4) blink();
  }, 4200);

  refreshMoodVisuals(true);
  refreshLabel();
}

/* ==========================================================================
   PRESS PIPELINE
   ========================================================================== */

function onClick(event) {
  cancelHold(); // a completed hold already handled itself
  if (suppressNextClick) {
    suppressNextClick = false;
    event.preventDefault();
    return;
  }
  press();
}

function onKeyDown(event) {
  // Hold-to-discover also works from the keyboard.
  if ((event.key === " " || event.key === "Enter") && !event.repeat) startHold();
}

function onPointerDown() {
  startHold();
}

/** The single entry point for "the user touched the button". */
export function press() {
  const now = Date.now();

  // 1. Hard blocks — the button is busy being dramatic.
  if (isCoolingDown()) {
    denied();
    return;
  }
  if (session.scriptRunning === "error") {
      const isIDerr = getLang() === "id";
      say(
        isIDerr ? "Tulisannya ERROR. Nge-press lebih keras gak bakal ngeresolve error." : "It says ERROR. Pressing it harder will not resolve the error.",
        { tag: isIDerr ? "SISTEM" : "SYSTEM", tone: "alarm" }
      );
    play("deny");
    return;
  }
  if (session.scriptRunning === "honesty") {
    const isIDh = getLang() === "id";
    say(isIDh ? "…Biar gue selesai." : "…Let me finish.", {
      tag: isIDh ? "PELAHAN" : "QUIETLY",
      tone: "soft",
    });
    return;
  }

  // 2. Reverse psychology round: pressing now is a choice with consequences.
  if (session.reverse) {
    breakReverse();
    return;
  }

  // 3. Normal press bookkeeping.
  const gap = session.lastPressAt ? now - session.lastPressAt : 9999;
  session.lastPressAt = now;
  session.pressTimes = session.pressTimes.filter((t) => now - t < RAPID_WINDOW);
  session.pressTimes.push(now);

  countPress();
  // Scripted beats run off the *session* counter so a returning visitor still
  // gets a performance, while the persistent counter keeps growing.
  session.presses += 1;
  const beat = session.presses;
  pressPulse();
  bumpCounter();
  blink();
  play("press");
  tilt(gap < 600 ? (Math.random() > 0.5 ? 3 : -3) : 0);

  applyCadence(gap);

  // 4. The trust-fall payoff: they waited, then accepted the invitation.
  if (session.awaitingTrustFall) {
    session.awaitingTrustFall = false;
    adjust({ trust: 12, suspicion: -8 });
    refreshMoodVisuals();
    renderMeters();
    const rev = getReverse();
  say(rev.rewarded, { tag: getLang() === "id" ? "OFF THE RECORD" : "OFF THE RECORD", tone: "soft" });
    addLog(LOG_LINES.trust[0], "calm");
    unlock("trust-fall");
    saveState();
    refreshLabel();
    return;
  }

  // 5. Burst detection beats everything else.
  if (session.pressTimes.length >= RAPID_THRESHOLD) {
    startCooldown();
    return;
  }

  // 6. Scripted beats at specific counts.
  if (runMilestone(beat)) {
    saveState();
    return;
  }

  // 7. Ordinary reaction.
  speakForPress(beat, gap);
  maybeDodgeAfterPress(beat);
  maybeLogPress(beat);
  saveState();
}

/** Cadence → hidden values. Hammering reads as threat; pacing reads as respect. */
function applyCadence(gap) {
  if (gap < 420) {
    adjust({ trust: -6, suspicion: 11 });
    session.rapidStage = Math.min(session.rapidStage + 1, RAPID_LINES.length - 1);
    spikeMeter("suspicionMeter");
  } else if (gap < 1100) {
    adjust({ trust: -1, suspicion: 6 });
  } else if (gap > 4200) {
    adjust({ trust: 4, suspicion: -6 });
    session.rapidStage = 0;
    spikeMeter("trustMeter");
  } else {
    adjust({ trust: 2, suspicion: 1 });
    session.rapidStage = Math.max(0, session.rapidStage - 1);
  }
  refreshMoodVisuals();
  renderMeters();
  checkPersistentUnlocks();
}

/** Choose what it says: scripted line → burst line → mood pool. */
function speakForPress(count, gap) {
  const mood = getState().mood;
  const scripted = SCRIPTED_PRESSES[count];
  if (scripted) {
    const sp = scriptedPress(count, scripted);
    say(sp.text, {
      tag: sp.tag,
      tone: scripted.tone || MOODS[mood].tone,
      shout: sp.shout,
    });
    return;
  }
  if (gap < 420 && session.rapidStage > 0) {
    say(rapidLine(session.rapidStage, RAPID_LINES[session.rapidStage]), {
      tag: getLang() === "id" ? "PELAN-PELAN" : "SLOW DOWN",
      tone: "alarm",
    });
    return;
  }
  const pool = moodReactions(mood, MOODS[mood].reactions);
  say(pickLine(pool), { tag: moodTag(mood, moodTagEn(mood)), tone: MOODS[mood].tone });
}

function moodTagEn(mood) {
  return {
    CAUTIOUS: "BUTTON SAYS",
    CURIOUS: "UNEXPECTEDLY INTERESTED",
    SUSPICIOUS: "UNDER OBSERVATION",
    ANNOYED: "FORMAL OBJECTION",
    PANICKING: "EMERGENCY",
    MANIPULATIVE: "ENTIRELY GENUINE",
    TRUSTING: "OFF THE RECORD",
    SECRETIVE: "NO COMMENT",
  }[mood] || "BUTTON SAYS";
}

/** Never repeat a line while it is still fresh in the user's memory. */
function pickLine(pool) {
  const options = pool.filter((line) => !session.recentLines.includes(line));
  const choice = (options.length ? options : pool)[
    Math.floor(Math.random() * (options.length ? options.length : pool.length))
  ];
  session.recentLines.push(choice);
  if (session.recentLines.length > 4) session.recentLines.shift();
  return choice;
}

function maybeLogPress(count) {
  if (count === 1 || count % 3 === 0) {
    addLog(pickLine(LOG_LINES.press), "normal");
  }
}

/* ==========================================================================
   MOOD + LABEL RENDERING
   ========================================================================== */

export function refreshMoodVisuals(force = false) {
  const previous = lastMood;
  const mood = resolveMood();
  if (mood !== previous || force) {
    applyMood(mood);
    refreshLabel();
    if (previous && mood !== previous) {
      addLog(`State change: ${previous} → ${mood}.`, mood === "PANICKING" ? "alarm" : "normal");
      announce(`Button mood is now ${mood}.`);
      setAlarm(mood === "PANICKING");
    }
    lastMood = mood;
  }
  setCountFoot(countFootline(), getState().interactions);
}

function countFootline() {
  const n = getState().interactions;
  if (n === 0) return "ALL OF THEM UNINVITED";
  if (n < 5) return "SUSPICIOUSLY EARLY DAYS";
  if (n < 12) return "A PATTERN IS FORMING";
  if (n < 25) return "THIS IS A RELATIONSHIP NOW";
  if (n < 50) return "THE FILE IS GETTING THICK";
  return "THE BUTTON HAS STOPPED PRETENDING TO MIND";
}

const MOOD_LABELS_EN = {
  CAUTIOUS: "PRESS ME. OR DON'T.",
  CURIOUS: "AGAIN? CAREFULLY.",
  SUSPICIOUS: "PRESS AT YOUR OWN RISK",
  ANNOYED: "PLEASE. DON'T.",
  PANICKING: "DO NOT — OKAY, FINE",
  MANIPULATIVE: "PRESS ME. IT'S FINE. I'M FINE.",
  TRUSTING: "GO AHEAD. I TRUST YOU. BRIEFLY.",
  SECRETIVE: "NOTHING TO SEE HERE",
};

export function refreshLabel() {
  const isID = getLang() === "id";
  if (isCoolingDown()) {
    const left = Math.max(0, Math.ceil((cooldownEndsAt - Date.now()) / 1000));
    const prefix = isID ? "COOLDOWN — " : "COOLING DOWN — ";
    const suffix = isID ? "d" : "s";
    setLabel(`${prefix}${left}${suffix}`);
    return;
  }
  if (session.scriptRunning === "error") {
    const err = getFakeError();
    setLabel(err ? err.label : FAKE_ERROR.label);
    return;
  }
  if (session.reverse) {
    const rev = getReverse();
    const prompts = rev ? rev.prompts : REVERSE.prompts;
    setLabel(prompts[session.reverse.cycle % prompts.length]);
    return;
  }
  if (session.awaitingTrustFall) {
    setLabel(isID ? "TEKAN AKU. SEKALI DOANG." : "PRESS ME. JUST ONCE.");
    return;
  }
  const mood = getState().mood;
  setLabel(moodBtnLabel(mood, MOOD_LABELS_EN[mood] || MOOD_LABELS_EN.CAUTIOUS));
}

/* ==========================================================================
   BEAT 1 — RAPID FIRE COOLDOWN
   ========================================================================== */

function isCoolingDown() {
  return session.cooling && Date.now() < cooldownEndsAt;
}

function startCooldown() {
  session.cooling = true;
  cooldownEndsAt = Date.now() + COOLDOWN_MS;
  session.pressTimes = [];
  adjust({ trust: -10, suspicion: 22 });
  refreshMoodVisuals();
  renderMeters();
  spikeMeter("suspicionMeter");
  shakeStage();
  setAlarm(true);
  play("deny");
  el.button.setAttribute("aria-disabled", "true");
  el.button.dataset.cooldown = "1";
  say(
    cooldownLine(Math.floor(Math.random() * COOLDOWN_LINES.length), pickLine(COOLDOWN_LINES)),
    { tag: getLang() === "id" ? "AKSES DITANGGUHKAN" : "ACCESS SUSPENDED", tone: "alarm", shout: true }
  );
  addLog(pickLine(LOG_LINES.rapid), "alarm");
  addLog(pickLine(LOG_LINES.cooldown), "alarm");
  announce("The button has paused interaction for a few seconds.");
  refreshLabel();
  saveState();
}

function endCooldown() {
  session.cooling = false;
  el.button.removeAttribute("aria-disabled");
  el.button.dataset.cooldown = "0";
  setAlarm(false);
  adjust({ suspicion: -8, trust: 3 });
  refreshMoodVisuals();
  renderMeters();
  const isID = getLang() === "id";
  say(
    isID ? "Oke. Coba lagi kayak dua profesional." : "Right. Let's try that again like two professionals.",
    { tag: isID ? "DILANJUTKAN" : "RESUMED" }
  );
  refreshLabel();
}

function denied() {
  play("deny");
  shakeStage();
  adjust({ suspicion: 3 });
  renderMeters();
  const left = Math.max(1, Math.ceil((cooldownEndsAt - Date.now()) / 1000));
  const isID = getLang() === "id";
  const deniedMsg = isID
    ? `Masih cooldown. ${left} detik. Gue bisa nunggu lebih lama dari lo.`
    : `Still cooling down. ${left} second${left === 1 ? "" : "s"}. I can wait longer than you.`;
  say(deniedMsg, { tag: isID ? "DITOLAK" : "DENIED", tone: "alarm" });
}

/* ==========================================================================
   BEAT 2 — THE ESCAPE
   ========================================================================== */

function currentOffset() {
  // the inline style is what dodge() writes, so read it first
  const inline = el.dock.style;
  const ix = parseFloat(inline.getPropertyValue("--dx"));
  const iy = parseFloat(inline.getPropertyValue("--dy"));
  if (!Number.isNaN(ix) || !Number.isNaN(iy)) {
    return { x: Number.isNaN(ix) ? 0 : ix, y: Number.isNaN(iy) ? 0 : iy };
  }
  const style = getComputedStyle(el.dock);
  return {
    x: parseFloat(style.getPropertyValue("--dx")) || 0,
    y: parseFloat(style.getPropertyValue("--dy")) || 0,
  };
}

/**
 * Move the button somewhere else inside the stage.
 * Bounds are computed from the live rects so it can never leave the stage,
 * never hide under the speech bubble, and never become unreachable.
 */
function dodge({ awayFrom = null, distance = 1 } = {}) {
  if (!el.stage || !el.button) return false;
  const stage = el.stage.getBoundingClientRect();
  const btn = el.button.getBoundingClientRect();
  const offset = currentOffset();
  const naturalLeft = btn.left - offset.x;
  const naturalTop = btn.top - offset.y;

  const padX = 14;
  // measure the live speech bubble so the button can never hide behind it
  const speechRect = el.speech.getBoundingClientRect();
  const topGuard = speechRect.height ? speechRect.bottom - stage.top + 12 : 104;
  const bottomGuard = 52; // keep clear of the hint line

  const minX = stage.left + padX - naturalLeft;
  const maxX = stage.right - padX - btn.width - naturalLeft;
  const minY = stage.top + topGuard - naturalTop;
  const maxY = stage.bottom - bottomGuard - btn.height - naturalTop;

  if (maxX - minX < 24 && maxY - minY < 24) return false;

  let targetX;
  let targetY;
  if (awayFrom) {
    const centerX = btn.left + btn.width / 2;
    const dir = awayFrom.x > centerX ? -1 : 1;
    targetX = offset.x + dir * (40 + Math.random() * 90) * distance;
    targetY = offset.y + (Math.random() - 0.5) * 70 * distance;
  } else {
    targetX = minX + Math.random() * Math.max(0, maxX - minX);
    targetY = minY + Math.random() * Math.max(0, maxY - minY);
  }

  const x = Math.round(Math.min(Math.max(targetX, minX), Math.max(minX, maxX)));
  const y = Math.round(Math.min(Math.max(targetY, minY), Math.max(minY, maxY)));

  el.dock.style.setProperty("--dx", `${x}px`);
  el.dock.style.setProperty("--dy", `${y}px`);
  el.dock.dataset.panic = getState().mood === "PANICKING" ? "1" : "0";
  el.stageCoords.textContent = `X:${String(Math.abs(x)).padStart(3, "0")} Y:${String(
    Math.abs(y)
  ).padStart(3, "0")}`;
  el.recallBtn.hidden = false;
  return true;
}

function fullDodge(reason = "press") {
  const moved = dodge({ distance: 1 });
  if (!moved) return false;
  session.dodges += 1;
  session.consecutiveDodges += 1;
  play("deny");
  addLog(pickLine(LOG_LINES.dodge), "normal");
  announce("The button moved to another part of the stage. Use call the button back to recentre it.");

  if (session.consecutiveDodges >= 2) {
    // Never frustrate: after two escapes it gives up and comes home.
    setTimeout(() => {
      recallButton(true);
      say(
    getLang() === "id"
      ? "Yaudah. Gue diam. Ini gue lagi diam."
      : "Fine. I'll stand still. This is me standing still.",
    { tag: getLang() === "id" ? "MENYERAH" : "SURRENDER" }
  );
    }, 1400);
  }

  const first = unlock("escape-attempt");
  if (!first) {
    const isIDdodge = getLang() === "id";
    say(
      reason === "hover"
        ? isIDdodge ? "Gak. Bukan hari ini. Bukan jari itu." : "Nope. Not today. Not that finger."
        : isIDdodge ? "Gue udah pindah. Secara administratif, gue sekarang disini." : "I've relocated. Administratively, I am now over here.",
      { tag: isIDdodge ? "AKSI MENGHINDAR" : "EVASIVE ACTION", tone: "alarm" }
    );
  } else {
    say("I'd like it on record that I tried to leave.", { tag: "EVASIVE ACTION", tone: "alarm" });
  }
  return true;
}

export function recallButton(silent = false) {
  el.dock.style.setProperty("--dx", "0px");
  el.dock.style.setProperty("--dy", "0px");
  el.stageCoords.textContent = "X:000 Y:000";
  el.recallBtn.hidden = true;
  session.consecutiveDodges = 0;
  if (!silent) {
    adjust({ trust: 2 });
    renderMeters();
    const isID = getLang() === "id";
    say(
      isID
        ? "Lo panggil gue balik. Gak ada orang yang gitu. Mencurigakan. Tapi manis sih."
        : "You called me back. Nobody does that. Suspicious. Nice, but suspicious.",
      { tag: isID ? "KEMBALI" : "RETURNED", tone: "soft" }
    );
    el.button.focus();
  }
}

function maybeDodgeAfterPress(count) {
  // Note: the relocation itself still happens with reduced motion (so the
  // ESCAPE ATTEMPT document stays reachable) — the CSS transition is removed.
  const s = getState();
  if (count === MILESTONE.firstDodge) {
    fullDodge("press");
    return;
  }
  if (count > MILESTONE.firstDodge && s.suspicion > 55 && Math.random() < 0.18) {
    fullDodge("press");
  }
}

/* ==========================================================================
   BEAT 3 — FAKE TECHNICAL FAILURE (entirely fictional)
   ========================================================================== */

function runFakeError() {
  session.scriptRunning = "error";
  session.errorDone = true;
  forceMood("PANICKING", 12000);
  applyMood("PANICKING");
  el.button.dataset.error = "1";
  el.diagnosticOverlay.hidden = false;
  el.diagnosticOut.textContent = "";
  setAlarm(true);
  shakeStage();
  play("error");
  refreshLabel();
  const isID = getLang() === "id";
  say(
    isID ? "Ada yang rusak. Mungkin di gue. Definitely gara-gara lo." : "Something has gone wrong. Possibly with me. Definitely because of you.",
    { tag: isID ? "KESALAHAN SISTEM" : "SYSTEM FAULT", tone: "alarm", shout: true }
  );
  addLog(pickLine(LOG_LINES.error), "alarm");
  announce("The button is displaying a fictional error and running a diagnostic.");

  errorTimers.forEach(clearTimeout);
  errorTimers = [];
  FAKE_ERROR.lines.forEach((line, index) => {
    errorTimers.push(
      setTimeout(() => {
        el.diagnosticOut.textContent += `${line}\n`;
      }, 420 * (index + 1))
    );
  });

  errorTimers.push(
    setTimeout(() => {
      el.diagnosticOverlay.hidden = true;
      el.button.dataset.error = "0";
      setAlarm(false);
      session.scriptRunning = null;
      clearForcedMood();
      adjust({ trust: 6, suspicion: -14 });
      refreshMoodVisuals(true);
      renderMeters();
      say(FAKE_ERROR.recovery, { tag: "DIAGNOSIS", tone: "soft" });
      unlock("confidential-memo");
      refreshLabel();
      saveState();
    }, 420 * FAKE_ERROR.lines.length + 1500)
  );
}

/* ==========================================================================
   BEAT 4 — REVERSE PSYCHOLOGY
   ========================================================================== */

function startReverse() {
  session.reverse = { until: Date.now() + REVERSE_WINDOW, cycle: 0, nextCycle: Date.now() + 2600 };
  forceMood("MANIPULATIVE", REVERSE_WINDOW + 2000);
  applyMood("MANIPULATIVE");
  refreshLabel();
  const rev = getReverse();
  say(rev.prompts[0], { tag: getLang() === "id" ? "INSTRUKSI" : "INSTRUCTION", tone: "soft", shout: true });
  addLog("Button issued an instruction it fully expects to be ignored.", "normal");
  announce("The button asks you not to press it for a few seconds.");
}

function breakReverse() {
  session.reverse = null;
  clearForcedMood();
  countPress();
  session.presses += 1;
  bumpCounter();
  pressPulse();
  play("deny");
  shakeStage();
  adjust({ trust: -12, suspicion: 18 });
  refreshMoodVisuals();
  renderMeters();
  const rev = getReverse();
  say(rev.disobeyed, { tag: getLang() === "id" ? "UDAH DIDUGA" : "PREDICTED", tone: "alarm" });
  addLog("Instruction ignored within seconds. Button unsurprised.", "alarm");
  refreshLabel();
  saveState();
}

function completeReverse() {
  session.reverse = null;
  clearForcedMood();
  session.awaitingTrustFall = true;
  adjust({ trust: 20, suspicion: -22 });
  refreshMoodVisuals(true);
  renderMeters();
  spikeMeter("trustMeter");
  play("calm");
  const rev = getReverse();
  say(rev.obeyed, { tag: getLang() === "id" ? "BENERAN KAGET" : "GENUINELY SURPRISED", tone: "soft" });
  addLog("Subject did nothing. Button rattled.", "calm");
  refreshLabel();
  saveState();
}

/* ==========================================================================
   BEAT 5 — PAPERWORK (the button changes the rules)
   ========================================================================== */

function openPaperwork() {
  session.formDone = true;
  forceMood("MANIPULATIVE", 20000);
  applyMood("MANIPULATIVE");
  const isIDform = getLang() === "id";
  say(
    isIDform
      ? "Aturan baru: akses lanjutan sekarang butuh formulir. Gak gue yang bikin aturan. Tapi gue yang bikin formulirnya."
      : "New rule: continued access now requires a form. I didn't make the rules. I did make the form.",
    { tag: isIDform ? "UPDATE KEBIJAKAN" : "POLICY UPDATE", tone: "soft" }
  );
  addLog(pickLine(LOG_LINES.form), "normal");
  openModal(el.formModal, el.formName);
}

function submitForm() {
  const name = el.formName.value.trim();
  const agreed = el.formCheck.checked;
  if (!agreed) {
    el.formCheck.parentElement.style.borderColor = "#FF4D35";
    const isIDsub = getLang() === "id";
    say(
      isIDsub ? "Kotak itu seluruh formulirnya. Centang kotaknya." : "The box is the entire form. Tick the box.",
      { tag: isIDsub ? "FORMULIR DITOLAK" : "FORM REJECTED", tone: "alarm" }
    );
    return;
  }
  setPresserName(name);
  closeModal(el.formModal);
  clearForcedMood();
  adjust({ trust: 14, suspicion: -12 });
  refreshMoodVisuals(true);
  renderMeters();
  play("calm");
  const isIDsub2 = getLang() === "id";
  const who = name || (isIDsub2 ? "pencet tanpa nama" : "unnamed presser");
  const formMsg = tFormSubmitter(name)
    || `Processed. Welcome aboard, ${who}. Your access level is 'still just a button'.`;
  say(formMsg, {
    tag: isIDsub2 ? "FORMULIR B-12 DITERIMA" : "FORM B-12 ACCEPTED",
    tone: "soft",
  });
  addLog(`Form B-12 filed under: ${name || "NO NAME GIVEN"}.`, "calm");
  saveState();
}

function declineForm() {
  closeModal(el.formModal);
  clearForcedMood();
  adjust({ trust: 6, suspicion: -4 });
  refreshMoodVisuals(true);
  renderMeters();
  const isIDdecl = getLang() === "id";
  say(
    isIDdecl
      ? "Ditolak. Jujur? Jawaban yang bener. Formulir itu cuma power move."
      : "Declined. Honestly? Correct answer. The form was a power move.",
    { tag: isIDdecl ? "DICATAT" : "NOTED", tone: "soft" }
  );
  addLog("Form B-12 declined politely. Button respects this.", "calm");
  saveState();
}

/* ==========================================================================
   BEAT 6 — THE HONEST MOMENT
   ========================================================================== */

function runHonesty() {
  session.scriptRunning = "honesty";
  session.honestyDone = true;
  forceMood("TRUSTING", 14000);
  applyMood("TRUSTING");
  recallButton(true);
  play("calm");
  const hon = getHonesty() || HONESTY;
  const isIDhon = getLang() === "id";
  say(hon.partOne, { tag: isIDhon ? "JUJUR BANGET" : "UNUSUALLY SINCERE", tone: "soft" });
  addLog("Button said something it will later deny.", "calm");
  setLabel("…");

  setTimeout(() => {
    say(hon.partTwo, { tag: isIDhon ? "MASIH JUJUR" : "STILL SINCERE", tone: "soft" });
  }, 3200);

  setTimeout(() => {
    session.scriptRunning = null;
    clearForcedMood();
    adjust({ trust: 16, suspicion: -10 });
    refreshMoodVisuals(true);
    renderMeters();
    say(hon.after, { tag: isIDhon ? "MOMEN SELESAI" : "MOMENT OVER" });
    refreshLabel();
    saveState();
  }, 7600);
}

/* ==========================================================================
   MILESTONE ROUTER
   ========================================================================== */

function runMilestone(count) {
  if (count === MILESTONE.fakeError && !session.errorDone) {
    runFakeError();
    return true;
  }
  if (count === MILESTONE.reverse && !session.reverse) {
    startReverse();
    return true;
  }
  if (count === MILESTONE.paperwork && !session.formDone) {
    openPaperwork();
    return true;
  }
  if (count >= MILESTONE.honesty && !session.honestyDone && getState().suspicion < 70) {
    runHonesty();
    return true;
  }
  return false;
}

/** Unlocks that depend on cumulative, saved progress rather than a beat. */
function checkPersistentUnlocks() {
  if (getState().interactions >= 10) unlock("hr-complaint");
}

/* ==========================================================================
   HOVER / PROXIMITY (progressive enhancement only)
   ========================================================================== */

function onStagePointerMove(event) {
  if (event.pointerType === "touch") return;
  lookAt(event.clientX, event.clientY);

  if (session.scriptRunning || session.cooling || reducedMotion.matches) return;

  const rect = el.button.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dist = Math.hypot(event.clientX - cx, event.clientY - cy);
  const near = dist < rect.width * 0.75;
  if (!near) return;

  const s = getState();
  const now = Date.now();

  // tiny defensive flinch, scaled by suspicion
  if (s.suspicion > 45 && Math.random() < 0.05) {
    dodge({ awayFrom: { x: event.clientX, y: event.clientY }, distance: 0.45 });
  }
  // occasional muttering, heavily throttled so it never spams
  if (now - lastHoverLineAt > 9000 && Math.random() < 0.08) {
    lastHoverLineAt = now;
    say(hoverLine(Math.floor(Math.random() * HOVER_LINES.length), pickLine(HOVER_LINES)), {
      tag: getLang() === "id" ? "PERINGATAN KEDekatan" : "PROXIMITY WARNING",
    });
  }
}

/* ==========================================================================
   LONG PRESS → THE RÉSUMÉ
   ========================================================================== */

function startHold() {
  if (session.cooling || session.scriptRunning) return;
  holdStarted = Date.now();
  el.button.dataset.holding = "1";
  clearTimeout(holdTimer);
  holdTimer = setTimeout(completeHold, LONG_PRESS_MS);
}

function cancelHold() {
  clearTimeout(holdTimer);
  if (el.button.dataset.holding === "1" && Date.now() - holdStarted < LONG_PRESS_MS) {
    el.button.dataset.holding = "0";
  }
  el.button.dataset.holding = "0";
}

function completeHold() {
  el.button.dataset.holding = "0";
  suppressNextClick = true; // a hold is not a press
  play("calm");
  adjust({ trust: 8, suspicion: 4 });
  refreshMoodVisuals();
  renderMeters();
  const first = unlock("resume");
  const isIDhold = getLang() === "id";
  say(
    first
      ? isIDhold
        ? "LEPASIN. LEPASIN. …yaudah. Karena lo tetep nahan: ini CV gue. Gue punya range."
        : "LET GO. LET GO. …fine. Since you're holding on: here's my CV. I have range."
      : isIDhold
        ? "Masih ditahan. Kita udah pernah gini. CV-nya belum berubah."
        : "Still holding. We've done this. The CV hasn't changed.",
    { tag: isIDhold ? "KONTAK BERKEPANJANGAN" : "PROLONGED CONTACT", tone: "soft" }
  );
  addLog("Sustained contact detected. Button overshared.", "calm");
  saveState();
}

/* ==========================================================================
   KEYBOARD EASTER EGG — type T-R-U-S-T anywhere
   ========================================================================== */

export function onTrustTyped() {
  forceMood("SECRETIVE", 9000);
  applyMood("SECRETIVE");
  play("secret");
  const first = unlock("confession");
  const isIDword = getLang() === "id";
  say(
    first
      ? isIDword
        ? "…Kok lo tau kata itu. Ambil file-nya. Ambil dan jangan pernah sebut lagi."
        : "…How did you know that word. Take the file. Take it and never mention it."
      : isIDword
        ? "Lo ketik lagi. File-nya masih kebuka. Gue masih malu."
        : "You typed it again. The file is still open. I'm still embarrassed.",
    { tag: isIDword ? "LO BILANG KATA ITU" : "YOU SAID THE WORD", tone: "neutral" }
  );
  addLog("Keyword detected. Button went very quiet.", "secret");
  adjust({ trust: 10, suspicion: -6 });
  refreshMoodVisuals();
  renderMeters();
  saveState();
}

/* ==========================================================================
   TICK — cooldowns, reverse timer, idle behaviour, clock
   ========================================================================== */

export function tick() {
  const now = Date.now();
  renderUptime();

  // cooldown countdown + release
  if (session.cooling) {
    if (now >= cooldownEndsAt) endCooldown();
    else refreshLabel();
  }

  // reverse psychology window
  if (session.reverse) {
    if (now >= session.reverse.nextCycle && now < session.reverse.until) {
      session.reverse.cycle += 1;
      session.reverse.nextCycle = now + 2600;
      refreshLabel();
      const rev = getReverse();
      const prompts = rev ? rev.prompts : REVERSE.prompts;
      const line = prompts[session.reverse.cycle % prompts.length];
      say(line, {
        tag: getLang() === "id" ? "INSTRUKSI" : "INSTRUCTION",
        tone: "soft",
        shout: session.reverse.cycle % 2 === 0,
      });
    }
    if (now >= session.reverse.until) completeReverse();
    return;
  }

  if (session.scriptRunning) return;

  // idle behaviour — the silence protocol
  const idleFor = now - (session.lastPressAt || session.startedAt);
  const s = getState();
  if (idleFor > IDLE_SILENCE_MS && s.interactions >= 3) {
    if (unlock("silence-protocol")) {
      adjust({ trust: 8, suspicion: -12 });
      refreshMoodVisuals();
      renderMeters();
      play("calm");
      const isIDsil = getLang() === "id";
      say(
        isIDsil
          ? "Lo berhenti. Dua puluh detik gak ngapa-ngapain. Gue file prosedur soal ini."
          : "You stopped. Twenty seconds of nothing. I filed a procedure about this.",
        { tag: isIDsil ? "KEHENINGAN TERDETEKSI" : "SILENCE DETECTED", tone: "soft" }
      );
      addLog(pickLine(LOG_LINES.calm), "calm");
      saveState();
      lastIdleNagAt = now;
    } else if (now - lastIdleNagAt > IDLE_NAG_MS) {
      lastIdleNagAt = now;
      adjust({ suspicion: -4, trust: 2 });
      refreshMoodVisuals();
      renderMeters();
      const isIDnag = getLang() === "id";
      say(
        isIDnag
          ? pickLine([
              "Masih disana? Gue nanya bukan buat gue.",
              "Heningnya gapapa. Gue gapapa. Kita semua gapapa.",
              "Gue pernah punya teman yang lebih buruk. Secara teknis gak punya teman, tapi lebih buruk.",
              `Kecurigaan udah turun ke ${suspicionWordLabel(getState().suspicion, suspicionWord())}. Jangan rusak.`,
            ])
          : pickLine([
              "Still there? I'm not asking for me.",
              "The quiet is fine. I'm fine. We're all fine.",
              "I've had worse company. Technically none, but worse.",
              `Suspicion has drifted down to ${suspicionWord()}. Don't ruin it.`,
            ]),
        { tag: isIDnag ? "AMBISAL" : "AMBIENT", tone: "neutral" }
      );
      addLog(pickLine(LOG_LINES.calm), "calm");
    }
  }
}

/* ==========================================================================
   RESET SUPPORT
   ========================================================================== */

export function resetCharacter() {
  errorTimers.forEach(clearTimeout);
  errorTimers = [];
  clearTimeout(holdTimer);
  cooldownEndsAt = 0;
  lastMood = null;
  lastIdleNagAt = 0;
  suppressNextClick = false;
  session.startedAt = Date.now();
  session.lastPressAt = 0;
  el.button.dataset.error = "0";
  el.button.dataset.cooldown = "0";
  el.button.dataset.holding = "0";
  el.button.removeAttribute("aria-disabled");
  el.diagnosticOverlay.hidden = true;
  setAlarm(false);
  recallButton(true);
  refreshMoodVisuals(true);
  refreshLabel();
  renderMeters();
}
