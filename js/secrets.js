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
import { lang as getLang, tSecrets, tFinale, logLines } from "./lang.js";

function currentSecrets() {
  return tSecrets() || SECRETS;
}

const byId = (id) => currentSecrets().find((s) => s.id === id);

/* ---------- rendering ---------- */

export function renderSecrets() {
  if (!el.secretGrid) return;
  el.secretGrid.innerHTML = "";
  const isID = getLang() === "id";
  const list = currentSecrets();

  list.forEach((secret, index) => {
    const unlocked = hasSecret(secret.id);
    const card = document.createElement("button");
    card.type = "button";
    card.className = "secret";
    card.dataset.locked = unlocked ? "false" : "true";
    card.dataset.id = secret.id;
    card.setAttribute(
      "aria-label",
      unlocked
        ? isID
          ? `${secret.title}. Udah kebongkar. Klik buat baca.`
          : `${secret.title}. Recovered. Open document.`
        : isID
          ? `Dokumen ${index + 1} dari ${list.length}. Masih disegel. Klik buat spill clue.`
          : `Document ${index + 1} of ${list.length}. Still sealed. Open hint.`
    );

    const statusBadge = unlocked
      ? isID
        ? "KEBONGKAR"
        : "RECOVERED"
      : isID
        ? "DISEGEL"
        : "SEALED";
    const cardTitle = unlocked
      ? secret.title
      : isID
        ? "DOKUMEN DIRAHASIAIN"
        : "DOCUMENT WITHHELD";
    const stampText = unlocked
      ? isID
        ? "BUKA FILE"
        : "OPEN FILE"
      : isID
        ? "DIGEMBOK"
        : "LOCKED";
    const footHint = unlocked
      ? secret.stamp
      : isID
        ? "SPILL CLUE-NYA"
        : "HINT AVAILABLE";

    card.innerHTML = `
      <span class="secret__idx"><span>${secret.code}</span><span>${statusBadge}</span></span>
      <h3 class="secret__title">${escapeHTML(cardTitle)}</h3>
      <p class="secret__desc">${escapeHTML(unlocked ? secret.desc : secret.clue)}</p>
      <span class="secret__foot">
        <span class="secret__stamp">${stampText}</span>
        <span>${footHint}</span>
      </span>`;

    card.addEventListener("click", () => {
      play("toggle");
      if (hasSecret(secret.id)) openSecret(secret.id);
      else openHint(secret.id);
    });

    el.secretGrid.append(card);
  });

  renderProgress();
  renderFinale();
}

function renderProgress() {
  const found = getState().secrets.length;
  const isID = getLang() === "id";
  if (el.secretProgress) {
    el.secretProgress.textContent = `${found} / ${SECRETS.length} ${
      isID ? "KEBONGKAR" : "RECOVERED"
    }`;
  }
  if (el.diagSecrets) el.diagSecrets.textContent = `${found} / ${SECRETS.length}`;
}

export function renderFinale() {
  const complete = getState().secrets.length >= SECRETS.length;
  if (!el.finaleCard) return;
  const isID = getLang() === "id";
  const fin = tFinale() || FINALE;

  el.finaleCard.dataset.unlocked = complete ? "true" : "false";
  el.finaleBtn.disabled = !complete;
  if (complete) {
    el.finaleTitle.textContent = fin.title;
    el.finaleText.textContent = fin.teaser;
    el.finaleBtn.textContent = isID ? "BUKA SERTIFIKATNYA" : "OPEN THE CERTIFICATE";
  } else {
    const left = SECRETS.length - getState().secrets.length;
    el.finaleTitle.textContent = isID
      ? "[ DISEGEL SAMPAI 7 FILE KEBONGKAR SEMUA ]"
      : "[ SEALED UNTIL ALL 7 ARE RECOVERED ]";
    el.finaleText.textContent = isID
      ? `Masih kurang ${left} dokumen lagi bestie. Si tombol kekeuh bilang udah gak ada apa-apa, padahal mah jelas bohong banget.`
      : `${left} document${
          left === 1 ? "" : "s"
        } still missing. The button insists there is nothing else, which is exactly what a button with seven documents would say.`;
    el.finaleBtn.textContent = isID ? "BUKA SERTIFIKATNYA" : "OPEN THE CERTIFICATE";
  }
}

/* ---------- opening ---------- */

export function openSecret(id) {
  const secret = byId(id);
  if (!secret) return;
  openDoc({ kicker: secret.kicker, title: secret.title, html: secret.doc });
}

function openHint(idOrSecret) {
  const id = typeof idOrSecret === "string" ? idOrSecret : idOrSecret.id;
  const secret = byId(id) || idOrSecret;
  const isID = getLang() === "id";

  if (isID) {
    openDoc({
      kicker: "DISEGEL · CLUE DIBOCORIN DIKIT",
      title: "DOKUMEN MASIH DIRAHASIAIN",
      html: `
        <div class="doc__meta"><span>${secret.code}</span><span>STATUS: DISEGEL RAPET</span><span>AKSES: DITOLAK</span></div>
        <div class="doc__body">
          <p>File aib ini beneran ada kok. Si tombol aja yang denial bilang gak ada. Yakali percaya omongan tombol.</p>
          <p class="mono">BOCORAN CLUE BUAT LO:
${escapeHTML(secret.clue)}</p>
          <p>Balik lagi ke sini kalau syaratnya udah lo penuhin ya bestie. Nanti segelnya bakal kebuka sendiri, dan si tombol bakal belagak gak pernah nyembunyiin apa-apa.</p>
          <div class="doc__sign"><span>Percobaan kepo lo udah dicatet.</span><span class="doc__stamp">Disegel</span></div>
        </div>`,
    });
    return;
  }

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
  const fin = tFinale() || FINALE;
  play("secret");
  openDoc({ kicker: fin.kicker, title: fin.title, html: fin.doc });
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

  const isID = getLang() === "id";
  addSecret(id);
  renderSecrets();
  flashCard(id);
  play("secret");
  const sLogs = logLines("secret", LOG_LINES.secret);
  addLog(`${sLogs[Math.floor(Math.random() * sLogs.length)]} (${secret.code})`, "secret");
  announce(
    isID ? `Dokumen rahasia kebongkar: ${secret.title}.` : `Secret recovered: ${secret.title}.`
  );
  showToast({
    kicker: isID ? "DOKUMEN KEBONGKAR!" : "DOCUMENT RECOVERED",
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
  const isID = getLang() === "id";
  const fin = tFinale() || FINALE;
  addLog(
    isID
      ? "KETUJUH DOKUMEN AIB BERHASIL DIBONGKAR! Tombol pasrah & ngeluarin sertifikat."
      : "ALL SEVEN DOCUMENTS RECOVERED. Button issuing paperwork in self-defence.",
    "secret"
  );
  showToast({
    kicker: isID ? "ACHIEVEMENT TERAKHIR!" : "FINAL ACHIEVEMENT",
    title: fin.title,
    onRead: openFinale,
  });
  announce(
    isID
      ? "Achievement terakhir kebuka: Sertifikat Penghargaan Si Paling Gigih."
      : "Final achievement unlocked: the certificate of unnecessary achievement."
  );
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
