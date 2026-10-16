# THE BUTTON HAS TRUST ISSUES — TBHTI®

> “The button knows you're going to click it. It just doesn't know why it should let you.”

A small interactive experiment: one sentient button with a personality, eight moods, a live
incident log, and seven classified documents it insists do not exist.

Built with **HTML5, CSS3 and vanilla JavaScript (ES modules)**. No frameworks, no backend,
no build step, no tracking. Progress is stored in `localStorage` and nowhere else.

---

## Run it

Because the JavaScript is split into ES modules, open it through a local server
(ES modules are blocked on `file://` by browsers):

```bash
# any one of these works
npx serve .
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy to GitHub Pages

1. Push the repository to GitHub (`index.html` must be at the repository root).
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Pick the `main` branch and the `/ (root)` folder, then **Save**.
5. Your site appears at `https://<your-username>.github.io/<repo-name>/` after a minute.

No build command, no bundler, no configuration — all paths are relative.

---

## Files

```
index.html        semantic structure, inline SVG for the button character
style.css         the full visual system (Swiss editorial × brutalism × terminal)
script.js         bootstrap: load, wire chrome, keyboard, tick loop
js/content.js     every word: moods, reactions, logs, the seven documents
js/state.js       state object, trust/suspicion maths, mood rules, persistence
js/ui.js          all DOM access: face, meters, log, modals, toasts
js/secrets.js     discovery system + final achievement
js/button.js      the character: presses, cooldowns, escapes, scripted beats
js/sound.js       four synthesised UI blips (off by default, no audio files)
```

## How the personality works

Two hidden values drive everything:

| value | goes up when | goes down when |
| --- | --- | --- |
| `TRUST` | you pace yourself, wait, hold, call it back, respect an instruction | you hammer it, ignore instructions |
| `SUSPICION` | you press fast or repeatedly | you leave it alone, let it calm down |

`resolveMood()` turns those two numbers into one of eight states —
`CAUTIOUS · CURIOUS · SUSPICIOUS · ANNOYED · PANICKING · MANIPULATIVE · TRUSTING · SECRETIVE`.
Suspicion always wins over trust (a nervous button cannot be curious). The mood then decides
the face (mouth path + brow angles), the accent colour, the status LED, the button label and
which pool of lines it can say. Scripted beats can temporarily *force* a mood; the force
expires and the derived mood takes over again.

Scripted beats, triggered by interaction count or cadence:

1. **Rapid fire** — 5 presses inside 2.2s triggers a real cooldown with a countdown label.
2. **The escape** — at press 9 (and occasionally above 55 suspicion) it relocates inside the stage.
3. **Fake outage** — at press 14, `ERROR 403: EMOTIONAL ACCESS DENIED` plus a fictional diagnostic.
4. **Reverse psychology** — at press 19 it orders you *not* to press it for 11 seconds.
5. **Paperwork** — at press 24 it invents Form B-12 and asks for permission.
6. **Honesty** — at press 30 (if calm) it says something sincere, then takes it back.

## The seven documents

| # | Document | Unlock condition |
| --- | --- | --- |
| 01 | The HR Complaint | reach 10 interactions |
| 02 | The Silence Protocol | leave it alone for 20 seconds |
| 03 | The Escape Attempt | make it relocate |
| 04 | The Confidential Memo | survive the fake outage |
| 05 | The Trust Fall | obey “DO NOT CLICK”, then accept its invitation |
| 06 | The Résumé On File | press and hold for ~2 seconds |
| 07 | The Unsent Confession | type the five-letter word `trust` anywhere |

Find all seven to unlock **The Certificate of Unnecessary Achievement**.
Locked cards show a declassified hint when clicked — nothing is unguessable.

## Keyboard

| key | action |
| --- | --- |
| `Space` / `Enter` | press the focused button (hold it down for the long-press secret) |
| `Escape` | dismiss any overlay or toast |
| `R` | open the reset confirmation (ignored while you're typing in a field) |
| `C` | recall the button if it has wandered off |
| `t r u s t` | …something |

## Accessibility & motion

- Semantic landmarks, real `<button>` elements, visible focus rings, focus trapping in dialogs.
- Mood, trust and suspicion are always communicated as **text**, never colour alone.
- `aria-live` regions announce reactions, mood changes and recovered documents.
- Hover behaviour is decorative only; touch and keyboard get the full experience.
- `prefers-reduced-motion` disables the marquee, escapes, shakes and flashes.
- The button can never become unreachable: it surrenders after two escapes and there is always
  a **CALL THE BUTTON BACK** control.

## Data

`localStorage` key `tbhti.save.v2` holds interactions, trust, suspicion, peak suspicion, mood,
unlocked documents, the final achievement, sound preference and the name typed into Form B-12.
Nothing is transmitted anywhere. If storage is unavailable or corrupt, the site silently falls
back to a temporary session. **RESET THE RELATIONSHIP** (with confirmation) wipes everything.

---

© 2026 Department of Unnecessary Interactions. Your clicks have been recorded by a button with
no legal authority.
