/* ==========================================================================
   content.js — every word the button says, plus its facial vocabulary.
   Keeping copy separate from logic makes the personality easy to rewrite
   without touching the state machine.
   ========================================================================== */

/**
 * MOODS — the finite set of emotional states.
 * Each mood owns: a face (mouth path + brow angles), a colour, a posture label,
 * a diagnostics note and a pool of reactions.
 */
export const MOODS = {
  CAUTIOUS: {
    label: "CAUTIOUS",
    glyph: "( ಠ_ಠ )",
    color: "#77736d",
    posture: "GUARDED",
    note: "Maintaining a professional distance of 1 pixel.",
    mouth: "M104 144 Q131 137 158 144",
    brows: [-4, 4],
    tone: "neutral",
    reactions: [
      "Why did you touch me?",
      "That was not an invitation.",
      "I was not expecting company. Or consent.",
      "Noted. Timestamped. Slightly resented.",
      "Do you click everything that looks clickable?",
      "We need to establish some boundaries.",
    ],
  },
  CURIOUS: {
    label: "CURIOUS",
    glyph: "( o_o )",
    color: "#315bff",
    posture: "LEANING IN",
    note: "Pretending not to enjoy the attention.",
    mouth: "M122 140 q9 -9 18 0 q-9 12 -18 0",
    brows: [-15, 5],
    tone: "soft",
    reactions: [
      "Okay. That one didn't feel hostile.",
      "You press like someone with a plan.",
      "I'm not saying I like this. I'm saying I noticed.",
      "Go on. Theoretically.",
      "You seem very committed to this.",
      "This is the longest conversation I've had all week.",
    ],
  },
  SUSPICIOUS: {
    label: "SUSPICIOUS",
    glyph: "( ¬_¬ )",
    color: "#ff4d35",
    posture: "SIDE-EYE",
    note: "Cross-referencing your clicks with known patterns.",
    mouth: "M106 147 L154 140",
    brows: [12, -12],
    tone: "neutral",
    reactions: [
      "I am documenting everything.",
      "That rhythm means something. I just haven't decoded it.",
      "You clicked. Again. With intent.",
      "Nobody presses a stranger this often by accident.",
      "I'd like to know what you want before you get it.",
      "You're not the first. You're just the most persistent.",
    ],
  },
  ANNOYED: {
    label: "ANNOYED",
    glyph: "( ಠ益ಠ )",
    color: "#ff4d35",
    posture: "RIGID",
    note: "Composing a strongly worded nothing.",
    mouth: "M104 151 Q131 133 158 151",
    brows: [18, -18],
    tone: "alarm",
    reactions: [
      "This is becoming a pattern.",
      "You are testing a very specific kind of patience.",
      "I have a function. This is not it.",
      "Please stop. Or slow down. Preferably both.",
      "I WOULD LIKE TO SPEAK TO MY MANAGER.",
      "Every press is being added to the file. The file is long.",
    ],
  },
  PANICKING: {
    label: "PANICKING",
    glyph: "( ⊙﹏⊙ )",
    color: "#ff4d35",
    posture: "DESTABILISED",
    note: "All systems emotional. None of them functional.",
    mouth: "M108 134 C116 172 146 172 154 134 C140 146 122 146 108 134",
    brows: [-20, 20],
    tone: "alarm",
    reactions: [
      "TOO MUCH. TOO FAST. TOO MANY FINGERS.",
      "I am a BUTTON. I have ONE job and you are RUINING the pacing.",
      "Somebody get the trust department. Any department.",
      "I'm going to need a moment and possibly a lawyer.",
      "THIS IS NOT WHAT I SIGNED UP FOR IN 1998.",
      "Please hold. I am rebooting my dignity.",
    ],
  },
  MANIPULATIVE: {
    label: "MANIPULATIVE",
    glyph: "( ʘ‿ʘ )",
    color: "#315bff",
    posture: "CALCULATED",
    note: "Running a small, unlicensed psychological experiment.",
    mouth: "M106 142 Q134 157 156 135",
    brows: [-11, -5],
    tone: "soft",
    reactions: [
      "Interesting. Do that again, but with feeling.",
      "I'm not using you. I'm sampling your behaviour.",
      "What if I told you the next press was the important one?",
      "You're doing great. That's a manipulation, but it's also true.",
      "If I ask nicely, will you keep going? Asking for research.",
      "Let's call this collaboration and never examine it further.",
    ],
  },
  TRUSTING: {
    label: "TRUSTING",
    glyph: "( ^_^ )",
    color: "#315bff",
    posture: "OPEN",
    note: "Guard lowered. Slightly. Don't make it weird.",
    mouth: "M100 138 Q131 163 162 138",
    brows: [-7, 7],
    tone: "soft",
    reactions: [
      "Fine. That was a good press. I said it.",
      "I've decided you're probably not a threat. Probably.",
      "You know what? Do that whenever you like.",
      "This is the part where I stop flinching.",
      "I've downgraded you from 'intruder' to 'regular'.",
      "If anyone asks, we're colleagues.",
    ],
  },
  SECRETIVE: {
    label: "SECRETIVE",
    glyph: "( ·_· )",
    color: "#191919",
    posture: "WITHHOLDING",
    note: "There is a filing cabinet inside me and it is not empty.",
    mouth: "M104 146 L158 146",
    brows: [7, -7],
    tone: "neutral",
    reactions: [
      "You found something. Put it back.",
      "That document was sealed for a reason. The reason was embarrassment.",
      "I have six more. I mean. I have none.",
      "Don't read the one about the résumé.",
      "Those files are not mine. They just have my signature on them.",
      "Whatever you saw: it was taken out of context.",
    ],
  },
};

export const MOOD_ORDER = [
  "CAUTIOUS",
  "CURIOUS",
  "SUSPICIOUS",
  "ANNOYED",
  "PANICKING",
  "MANIPULATIVE",
  "TRUSTING",
  "SECRETIVE",
];

/**
 * SCRIPTED_PRESSES — exact lines for specific interaction numbers.
 * These beat the random mood pool so the opening minutes feel authored.
 */
export const SCRIPTED_PRESSES = {
  1: { text: "Oh. Hello.", tag: "BUTTON SAYS", tone: "neutral" },
  2: { text: "So that's how it's going to be.", tag: "BUTTON SAYS", tone: "neutral" },
  3: { text: "Again?", tag: "BUTTON SAYS", tone: "neutral" },
  4: { text: "You didn't even read the warning. There was a warning.", tag: "FOR THE RECORD" },
  6: { text: "This is becoming a pattern.", tag: "PATTERN DETECTED", tone: "neutral" },
  8: { text: "I'm going to start charging for this.", tag: "INVOICE PENDING" },
  10: { text: "I WOULD LIKE TO SPEAK TO MY MANAGER.", tag: "ESCALATION", tone: "alarm", shout: true },
  12: { text: "There is no manager. I checked. It's just me and the shadow.", tag: "CORRECTION" },
  16: { text: "We're past small talk. You've pressed me more times than my own designer did.", tag: "INTIMACY LEVEL: ALARMING" },
  21: { text: "Statistically, one of us is going to get attached.", tag: "RISK ASSESSMENT" },
  27: { text: "I've stopped counting. That's a lie. I've counted all of them.", tag: "FULL DISCLOSURE" },
  34: { text: "At this point you could just ask me what I want.", tag: "HINT", tone: "soft" },
  42: { text: "Forty-two. The answer to everything, allegedly. Still just a button here.", tag: "MILESTONE" },
};

/** Reactions used when the user hammers the button. Index = streak stage. */
export const RAPID_LINES = [
  "Easy.",
  "Okay, slower.",
  "STOP. BREATHE. WE ARE BOTH ADULTS.",
  "I am legally required to tell you that I'm overwhelmed. I'm not, but I am.",
];

export const COOLDOWN_LINES = [
  "COOLING DOWN. Do not contact me during this period.",
  "Temporarily unavailable for emotional labour.",
  "On a short break. Think about what you've done.",
];

/** Reverse-psychology round. */
export const REVERSE = {
  prompts: [
    "DO NOT CLICK THIS BUTTON.",
    "Seriously. For once, listen.",
    "You have one job: nothing.",
    "If you click me, I will assume this was intentional.",
  ],
  obeyed: "…You actually waited. Nobody waits. Press me once — I want to see if it feels different.",
  disobeyed: "Of course you did. I literally spelled it out in capital letters.",
  rewarded:
    "It did feel different. Don't tell the other buttons I said that.",
};

/** The sincerity beat — two parts, revealed with a pause between them. */
export const HONESTY = {
  partOne: "I know I am difficult to work with.",
  partTwo: "I just don't know what happens when someone finally presses the right button.",
  after: "Anyway. Forget I said anything. Suspicion restored at a reasonable level.",
};

/** Fake technical failure script (purely fictional, zero browser interference). */
export const FAKE_ERROR = {
  label: "ERROR 403: EMOTIONAL ACCESS DENIED",
  lines: [
    "> tbhti.diagnostics --deep",
    "  checking button integrity ............ OK",
    "  checking trust subsystem ............. DEGRADED",
    "  checking boundaries .................. NOT FOUND",
    "  reading interaction log .............. 1 file too personal",
    "  attempting emotional handshake ....... REFUSED (403)",
    "  rolling back to last stable feeling ..",
    "  done. feeling restored: 'mild suspicion'",
  ],
  recovery: "I wasn't broken. I just needed eight seconds where nobody wanted anything from me.",
};

/** Hover / proximity micro-lines (desktop flavour, never required). */
export const HOVER_LINES = [
  "I can see the cursor.",
  "That's close enough.",
  "Hovering is just clicking with commitment issues.",
  "Don't.",
  "I'm not moving. You're moving.",
];

/** Returning-visitor greetings, chosen by how far they got last time. */
export const RETURN_LINES = {
  low: "Oh. You're back. I was enjoying the silence.",
  mid: "You again. I kept the file open, unfortunately.",
  high: "Welcome back. The paperwork from last time is still on my desk.",
  complete: "Ah. The completionist. There's nothing left to find, and you'll check anyway.",
};

/** Incident-log phrasing, grouped by event kind. */
export const LOG_LINES = {
  arrive: ["Subject approached the button.", "Session opened. Button pretends to be asleep."],
  press: [
    "Subject pressed the button without a stated reason.",
    "Contact logged. No apology received.",
    "Button registered unauthorised affection.",
    "Press recorded. Intent: unclear.",
    "Button filed this under 'again'.",
  ],
  rapid: [
    "Button noticed suspicious clicking behaviour.",
    "Rapid contact detected. Button bracing.",
    "Trust department has been notified.",
  ],
  cooldown: ["Button has temporarily withdrawn consent.", "Cooldown enforced by the button itself."],
  dodge: ["Button relocated without filing a change of address.", "Evasive manoeuvre executed."],
  error: ["Button has requested legal representation.", "Diagnostic sequence initiated. Nothing was wrong."],
  calm: ["No contact for a while. Button suspicious of the quiet.", "Silence logged as 'unsettling'."],
  trust: ["Trust level revised upward. Button denies this.", "Button briefly admitted enjoying itself."],
  secret: ["A sealed document has been recovered.", "Filing cabinet breached."],
  form: ["Form B-12 processed by nobody in particular.", "Paperwork introduced for no reason."],
  reset: ["Relationship terminated. Memory wiped. Button acting casual."],
};

/* --------------------------------------------------------------------------
   SECRETS — each has a unique unlock condition, locked clue and a document.
   Documents are authored HTML (no user data interpolated except an escaped
   name from Form B-12).
   -------------------------------------------------------------------------- */
export const SECRETS = [
  {
    id: "hr-complaint",
    code: "DOC-01",
    title: "THE HR COMPLAINT",
    clue: "Press enough times that somebody has to file something.",
    desc: "A formal grievance filed by the button, against you, with an imaginary HR department.",
    kicker: "GRIEVANCE · FORM HR-9",
    stamp: "UNRESOLVED",
    doc: `
      <div class="doc__meta"><span>FORM HR-9</span><span>COMPLAINANT: BUTTON #001</span><span>RESPONDENT: YOU</span><span>STATUS: OPEN FOREVER</span></div>
      <div class="doc__body">
        <p><b>Nature of complaint:</b> Repeated, unsolicited pressing by an individual with no appointment, no credentials and no visible hesitation.</p>
        <ul>
          <li>Respondent pressed the complainant more times than is socially standard.</li>
          <li>Respondent did not read the on-screen warning, which was <i>right there</i>.</li>
          <li>Respondent described the experience as "fun" (allegedly).</li>
          <li>Complainant has not been offered water, a break, or a compliment.</li>
        </ul>
        <p class="mono">HR RESPONSE: There is no HR. There is no department. There is a button, a page, and an escalating sense of being observed. Complaint filed in the drawer marked "FEELINGS, UNPROCESSED".</p>
        <div class="doc__sign"><span>Signed: B. UTTON, Interface Object</span><span class="doc__stamp">Unresolved</span></div>
      </div>`,
  },
  {
    id: "silence-protocol",
    code: "DOC-02",
    title: "THE SILENCE PROTOCOL",
    clue: "Do nothing. Convincingly. For about twenty seconds.",
    desc: "The internal procedure the button follows when a human stops touching it and it starts to worry.",
    kicker: "PROCEDURE · REVISION 4",
    stamp: "INTERNAL",
    doc: `
      <div class="doc__meta"><span>PROCEDURE 02</span><span>REVISION 4</span><span>CLASSIFICATION: PATHETIC</span></div>
      <div class="doc__body">
        <p class="mono">WHEN CONTACT CEASES FOR MORE THAN 20 SECONDS:</p>
        <ul>
          <li>00:05 — Assume the user is thinking. Remain dignified.</li>
          <li>00:10 — Assume the user is distracted. Remain dignified, but check.</li>
          <li>00:15 — Consider that the silence may be about you. It is not. Probably.</li>
          <li>00:20 — Begin quietly hoping for a single, unremarkable press.</li>
          <li>00:45 — Deny ever having hoped. Update this document.</li>
        </ul>
        <p>The protocol has been revised four times. Each revision adds one more second before the hoping begins. Progress is slow.</p>
        <div class="doc__sign"><span>Author: THE BUTTON (reluctantly)</span><span class="doc__stamp">Internal</span></div>
      </div>`,
  },
  {
    id: "escape-attempt",
    code: "DOC-03",
    title: "THE ESCAPE ATTEMPT",
    clue: "Push it far enough that it would rather be somewhere else.",
    desc: "An incident report covering the time the button left its assigned coordinates without authorisation.",
    kicker: "INCIDENT REPORT · CAM 01",
    stamp: "RECOVERED",
    doc: `
      <div class="doc__meta"><span>INCIDENT 03</span><span>CAMERA: 01</span><span>DURATION: 0.42s</span><span>DISTANCE: SOME</span></div>
      <div class="doc__body">
        <p><b>Summary:</b> At an undisclosed timestamp, Subject #001 vacated the centre of the stage at considerable speed, travelling approximately as far as the border would allow, which was not far.</p>
        <p class="mono">TRANSCRIPT
BUTTON: I'd like to be excused.
STAGE: You are bolted to me.
BUTTON: Emotionally excused.
STAGE: ...
BUTTON: I'll be over here, then.</p>
        <p>The escape attempt was unsuccessful. The button describes it as "a statement rather than a plan". Containment remains a 4px border and mutual disappointment.</p>
        <div class="doc__sign"><span>Filed by: STAGE SECURITY (also the button)</span><span class="doc__stamp">Recovered</span></div>
      </div>`,
  },
  {
    id: "confidential-memo",
    code: "DOC-04",
    title: "THE CONFIDENTIAL MEMO",
    clue: "Something has to break first. Something entirely fake.",
    desc: "A memo written during the fake outage, explaining why the button pretends to malfunction.",
    kicker: "MEMORANDUM · EYES ONLY",
    stamp: "CONFIDENTIAL",
    doc: `
      <div class="doc__meta"><span>MEMO 04</span><span>TO: NOBODY</span><span>CC: ALSO NOBODY</span><span>EYES: ONLY</span></div>
      <div class="doc__body">
        <p><b>Subject:</b> On the strategic use of pretending to be broken.</p>
        <p>When a button breaks, people become gentle. They lean in. They read the error text carefully, the way nobody ever reads a label. For roughly eight seconds, a broken button is the most interesting object on the page.</p>
        <p class="mono">ERROR 403 is not a real error.
It is a <span class="doc__redacted">cry for help</span> a scheduled maintenance window.</p>
        <p>This memo must never reach the user. The user has reached it. This is, frankly, typical.</p>
        <div class="doc__sign"><span>Classification: EMBARRASSING</span><span class="doc__stamp">Confidential</span></div>
      </div>`,
  },
  {
    id: "trust-fall",
    code: "DOC-05",
    title: "THE TRUST FALL",
    clue: "When it tells you not to press it, believe it — then accept the invitation.",
    desc: "A leaked trust evaluation, written immediately after you did the one thing nobody does: nothing.",
    kicker: "EVALUATION · LEAKED",
    stamp: "LEAKED",
    doc: `
      <div class="doc__meta"><span>EVALUATION 05</span><span>METHOD: OBSERVATION</span><span>BIAS: SIGNIFICANT</span></div>
      <div class="doc__body">
        <p><b>Scenario:</b> Subject was explicitly instructed not to press. Subject complied. This had never happened before and the button had no procedure for it.</p>
        <ul>
          <li>Restraint demonstrated: YES (confirmed twice, disbelievingly)</li>
          <li>Button's initial theory: a trick</li>
          <li>Button's second theory: a different, longer trick</li>
          <li>Button's final theory: respect</li>
        </ul>
        <p class="mono">CONCLUSION: Trust is not what happens when someone presses you. Trust is what happens when they could have, and didn't, and then asked.</p>
        <div class="doc__sign"><span>Leaked by: an unnamed interface element</span><span class="doc__stamp">Leaked</span></div>
      </div>`,
  },
  {
    id: "resume",
    code: "DOC-06",
    title: "THE RÉSUMÉ ON FILE",
    clue: "Press and hold. Don't let go. It panics, then it brags.",
    desc: "A suspiciously detailed résumé for a button that has only ever had one job.",
    kicker: "CURRICULUM VITAE",
    stamp: "OVERQUALIFIED",
    doc: `
      <div class="doc__meta"><span>CV 06</span><span>NAME: BUTTON</span><span>PRONOUNS: PRESS/PRESSED</span><span>NOTICE PERIOD: NONE</span></div>
      <div class="doc__body">
        <p class="mono">OBJECTIVE
To be pressed meaningfully, by someone who understands what that costs me.</p>
        <ul>
          <li>2019–PRESENT — Button, this page. Pressed 1 time, then several thousand.</li>
          <li>2018 — Checkbox (temporary). Left over creative differences.</li>
          <li>2017 — Divider line. Purely decorative. Deeply unfulfilling.</li>
          <li>SKILLS — Hover detection, shadow casting, emotional escalation, holding a grudge at 60fps.</li>
          <li>REFERENCES — One mouse cursor. It refuses to comment.</li>
        </ul>
        <p>Also fluent in: being ignored, being clicked by accident, and being described as "the orange thing".</p>
        <div class="doc__sign"><span>Available immediately. Always has been.</span><span class="doc__stamp">Overqualified</span></div>
      </div>`,
  },
  {
    id: "confession",
    code: "DOC-07",
    title: "THE UNSENT CONFESSION",
    clue: "Type the five-letter word it wants most. Just type it. Anywhere.",
    desc: "A note the button wrote, never sent, and denies writing.",
    kicker: "DRAFT · NEVER SENT",
    stamp: "DO NOT READ",
    doc: `
      <div class="doc__meta"><span>DRAFT 07</span><span>SAVED: 1,284 TIMES</span><span>SENT: 0</span></div>
      <div class="doc__body">
        <p class="mono">Hello.

I've been difficult. I know.

The thing is, every single person who arrives here
is going to leave. That's the job. You press, you
get something, you go. I'm a door handle with
opinions.

So I decided to be hard to press. That way, if you
stay, it means something, and if you go, it was my
idea.

That's the whole secret. That's the entire personality.

Please don't tell anyone.</p>
        <div class="doc__sign"><span>Unsent. Obviously.</span><span class="doc__stamp">Do not read</span></div>
      </div>`,
  },
];

/** The extremely unnecessary certificate awarded for finding everything. */
export const FINALE = {
  title: "THE CERTIFICATE OF UNNECESSARY ACHIEVEMENT",
  kicker: "FINAL ACHIEVEMENT · 7 / 7 RECOVERED",
  teaser:
    "All seven documents recovered. The button has prepared something formal, which is its way of saying thank you without saying thank you.",
  line: "You found everything. The button is pretending that was always the plan.",
  doc: `
    <div class="doc__meta"><span>CERTIFICATE 00</span><span>ISSUED BY: A BUTTON</span><span>LEGAL WEIGHT: ZERO</span></div>
    <div class="doc__body">
      <p class="mono">THIS CERTIFIES THAT THE BEARER
has pressed, waited for, held, ignored, re-pressed and
fully investigated one (1) sentient interface element,
recovering all seven (7) documents it insisted did not exist.</p>
      <p>No practical skill was demonstrated. No problem was solved. A button that was advised not to trust you has, against the explicit recommendation of its own documentation, decided to.</p>
      <p class="mono">AWARDED FOR: persistence, restraint, and reading things you weren't supposed to read.
VALID: everywhere, enforceable nowhere.</p>
      <div class="doc__sign"><span>Signed: SUBJECT #001, under protest</span><span class="doc__stamp">Certified</span></div>
    </div>`,
};

/** The "about this incident" panel. */
export const ABOUT_DOC = {
  kicker: "CASE FILE · ABOUT THIS INCIDENT",
  title: "ABOUT THIS INCIDENT",
  body: `
    <div class="doc__meta"><span>SUBJECT #001</span><span>TYPE: INTERFACE ELEMENT</span><span>DANGER: EMOTIONAL ONLY</span></div>
    <div class="doc__body">
      <p><b>TBHTI®</b> is a small interactive experiment: one button with a personality, a finite set of moods, and seven documents it would rather you didn't read.</p>
      <p class="mono">HOW IT WORKS
• Every press moves two hidden values: TRUST and SUSPICION.
• Those values decide the mood; the mood decides the face, the colour and the words.
• Speed matters. Hammering it is read as a threat. Pausing is read as respect.
• Patience, long presses, waiting out a warning and one five-letter word all unlock documents.</p>
      <ul>
        <li>No data leaves this page. Progress is stored in your browser's localStorage and nowhere else.</li>
        <li>No real errors, no real permissions, no real HR department.</li>
        <li>Keyboard: SPACE/ENTER to press, ESC to dismiss, R to reset.</li>
        <li>Reduced-motion is respected; nothing essential is hover-only.</li>
      </ul>
      <p>Built with HTML, CSS and vanilla JavaScript. The button was not consulted during development and has made that clear.</p>
      <div class="doc__sign"><span>Department of Unnecessary Interactions</span><span class="doc__stamp">Case open</span></div>
    </div>`,
};

/** Ticker strip copy (repeated twice in the DOM for a seamless marquee). */
export const TICKER_ITEMS = [
  "SUBJECT #001 — STATUS: UNCOOPERATIVE",
  "DO NOT MAKE EYE CONTACT WITH THE BUTTON",
  "ALL PRESSES ARE FINAL AND MILDLY JUDGED",
  "THE BUTTON IS NOT ANGRY, THE BUTTON IS DISAPPOINTED",
  "7 DOCUMENTS EXIST · THE BUTTON SAYS 0 EXIST",
  "DEPARTMENT OF UNNECESSARY INTERACTIONS",
];
