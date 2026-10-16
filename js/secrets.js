/* ==========================================================================
   secrets.js — the discovery system.
   Seven documents, seven different unlock conditions, one final certificate.
   Unlock conditions live in button.js (where the behaviour happens); this
   module owns storage, rendering, notification and the finale.
   ========================================================================== */

import { SECRETS, FINALE, LOG_LINES } from "./content.js";
import { addSecret, getState, hasSecret, saveState, setFinale } from "./state.js";
import {
  addLog,
  announce,
  el,
  escapeHTML,
  openDoc,
  showToast,
  reducedMotion,
} from "./ui.js";
import { play } from "./sound.js";

const byId = (id) => SECRETS.find((s) => s.id === id);

/* ---------- rendering ---------- */

export function renderSecrets() {
  if (!el.secretGrid) return;
  el.secretGrid.innerHTML = "";

  SECRETS.forEach((secret, index) => {
    const unlocked = hasSecret(secret.id);
    const card = document.createElement("button");
    card.type = "button";
    card.className = "secret";
    card.dataset.locked = unlocked ? "false" : "true";
    card.dataset.id = secret.id;
    card.setAttribute(
      "aria-label",
      unlocked
        ? `${secret.title}. Recovered. Open document.`
        : `Document ${index + 1} of ${SECRETS.length}. Still sealed. Open hint.`
    );

    card.innerHTML = `
      <span class="secret__idx"><span>${secret.code}</span><span>${
        unlocked ? "RECOVERED" : "SEALED"
      }</span></span>
      <h3 class="secret__title">${escapeHTML(unlocked ? secret.title : "DOCUMENT WITHHELD")}</h3>
      <p class="secret__desc">${escapeHTML(unlocked ? secret.desc : secret.clue)}</p>
      <span class="secret__foot">
        <span class="secret__stamp">${unlocked ? "OPEN FILE" : "LOCKED"}</span>
        <span>${unlocked ? secret.stamp : "HINT AVAILABLE"}</span>
      </span>`;

    card.addEventListener("click", () => {
      if (hasSecret(secret.id)) openSecret(secret.id);
      else openHint(secret);
    });

    el.secretGrid.append(card);
  });

  renderProgress();
  renderFinale();
}

function renderProgress() {
  const found = getState().secrets.length;
  if (el.secretProgress) el.secretProgress.textContent = `${found} / ${SECRETS.length} RECOVERED`;
  if (el.diagSecrets) el.diagSecrets.textContent = `${found} / ${SECRETS.length}`;
}

export function renderFinale() {
  const complete = getState().secrets.length >= SECRETS.length;
  if (!el.finaleCard) return;
  el.finaleCard.dataset.unlocked = complete ? "true" : "false";
  el.finaleBtn.disabled = !complete;
  if (complete) {
    el.finaleTitle.textContent = FINALE.title;
    el.finaleText.textContent = FINALE.teaser;
    el.finaleBtn.textContent = "OPEN THE CERTIFICATE";
  } else {
    const left = SECRETS.length - getState().secrets.length;
    el.finaleTitle.textContent = "[ SEALED UNTIL ALL 7 ARE RECOVERED ]";
    el.finaleText.textContent = `${left} document${left === 1 ? "" : "s"} still missing. The button insists there is nothing else, which is exactly what a button with seven documents would say.`;
  }
}

/* ---------- opening ---------- */

export function openSecret(id) {
  const secret = byId(id);
  if (!secret) return;
  openDoc({ kicker: secret.kicker, title: secret.title, html: secret.doc });
}

function openHint(secret) {
  openDoc({
    kicker: "SEALED · HINT DECLASSIFIED",
    title: "DOCUMENT WITHHELD",
    html: `
      <div class="doc__meta"><span>${secret.code}</span><span>STATUS: SEALED</span><span>ACCESS: DENIED</span></div>
      <div class="doc__body">
        <p>This file exists. The button says it does not. One of us is a button.</p>
        <p class="mono">DECLASSIFIED HINT
${escapeHTML(secret.clue)}</p>
        <p>Come back when the condition is met. The file will unseal itself, loudly, and the button will pretend it was never hiding anything.</p>
        <div class="doc__sign"><span>Access attempt logged.</span><span class="doc__stamp">Sealed</span></div>
      </div>`,
  });
}

export function openFinale() {
  if (getState().secrets.length < SECRETS.length) return;
  openDoc({ kicker: FINALE.kicker, title: FINALE.title, html: FINALE.doc });
}

/* ---------- unlocking ---------- */

/**
 * Unlock a secret. Returns true only the first time, so callers can trigger
 * a reaction from the button without worrying about duplicates.
 */
export function unlock(id, { onReveal } = {}) {
  if (hasSecret(id)) return false;
  const secret = byId(id);
  if (!secret) return false;

  addSecret(id);
  renderSecrets();
  flashCard(id);
  play("secret");
  addLog(`${LOG_LINES.secret[Math.floor(Math.random() * LOG_LINES.secret.length)]} (${secret.code})`, "secret");
  announce(`Secret recovered: ${secret.title}.`);
  showToast({
    kicker: "DOCUMENT RECOVERED",
    title: secret.title,
    onRead: () => openSecret(id),
  });

  if (typeof onReveal === "function") onReveal(secret);

  // final achievement check
  if (getState().secrets.length >= SECRETS.length && !getState().finale) {
    setFinale(true);
    saveState();
    setTimeout(celebrateFinale, 1400);
  }
  return true;
}

function flashCard(id) {
  if (reducedMotion.matches) return;
  const card = el.secretGrid?.querySelector(`[data-id="${id}"]`);
  if (!card) return;
  card.dataset.fresh = "1";
  setTimeout(() => {
    card.dataset.fresh = "0";
  }, 760);
}

function celebrateFinale() {
  renderFinale();
  play("secret");
  addLog("ALL SEVEN DOCUMENTS RECOVERED. Button issuing paperwork in self-defence.", "secret");
  showToast({
    kicker: "FINAL ACHIEVEMENT",
    title: FINALE.title,
    onRead: openFinale,
  });
  announce("Final achievement unlocked: the certificate of unnecessary achievement.");
  if (el.finaleCard && typeof el.finaleCard.scrollIntoView === "function") {
    el.finaleCard.scrollIntoView({
      behavior: reducedMotion.matches ? "auto" : "smooth",
      block: "center",
    });
  }
}

export function allFound() {
  return getState().secrets.length >= SECRETS.length;
}

export function totalSecrets() {
  return SECRETS.length;
}
