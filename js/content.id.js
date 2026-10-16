/* ==========================================================================
   content.id.js — Bahasa Indonesia mode, vibes Gen Z pisan.
   Semua teks tombol, reaksi mood, script beat, dokumen rahasia,
   dan UI strings — diterjemahkan dengan slang kekinian biar relate.
   ========================================================================== */

/* ------------------------------------------------------------------ UI -- */

export const UI_ID = {
  langLabel: "BAHASA",
  langToggle: "EN",
  headerSub: "EKSPERIMEN TENTANG GAPERCAYAAN ORANG",
  moodKey: "MOOD",
  soundPrefix: "SUARA:",
  aboutBtn: "TENTANG INSIDEN INI",
  skipLink: "Langsung ke tombol",
  heroTrustWord: { QUESTIONABLE: "DIPERTANYAKAN", NONE: "NOL BESAR" },
  heroDesc: "TOMBOL PUNYA MASALAH KEPERCAYAAN",
  heroLede:
    "Ada tombol di halaman ini. Dia udah dibilangin jangan percaya sama kamu.",
  heroNote:
    "Lanjut cuma kalau kamu literally gapunya rasa hormat sama batasan orang.",
  subjectPrefix: "SUBJEK #001",
  trustPrefix: "LEVEL TRUST:",
  fileOpened: "FILE DIBUKA",
  stageHeading: "AREA INTERAKSI",
  stageMeta: "AREA KONTAINMENT · JANGAN DIKASIH MAKAN",
  btnDefault: "TEKAN AKU. ATAU JANGAN. BEBAS SIH.",
  stageHint:
    "TIP: tombol ini respon ke klik, tap, sabar, dan long press. Keyboard juga bisa.",
  logHeading: "CATATAN INSIDEN",
  logMeta: "7 ENTRY TERAKHIR · DIFILE OTOMATIS",
  logDisclaimer:
    "Semua entry fiksi. Tombol ini gapunya otoritas hukum, gapunya kabinet file, dan gapunya manajer.",
  secretsHeading: "YANG GAMPANGNYA TOMBOL GAK MAU KAMU TEMUKIN",
  sectionPanelTrust: "TRUST METER",
  sectionPanelSuspicion: "KECURIGAAN",
  sectionPanelInteractions: "INTERAKSI",
  sectionPanelDiagnostics: "DIAGNOSTIK",
  subjectLabel: "SUBJEK",
  typeLabel: "TIPE",
  dangerLabel: "BAHAYA",
  statusLabel: "STATUS",
  docTypeLabel: "ELEMEN ANTARMUKA",
  docDangerValue: "EMOSIONAL SAJA",
  docStatusValue: "TETAP DIBUKA",
  howItWorks: "CARA KERJANYA",
  howBody:
    "• Setiap tekan ngubah dua nilai tersembunyi: TRUST dan KECURIGAAN.\n• Nilai itu nentuin mood; mood nentuin muka, warna dan kata-kata.\n• Kecepatan penting. Nge-hammer = ancaman. Jeda = hormat.\n• Sabar, long press, nunggu peringatan, dan satu kata lima huruf semuanya buka dokumen.",
  storageNote:
    "Gak ada data keluar dari halaman ini. Progress disimpan di localStorage browser kamu aja.",
  noErrorsNote:
    "Gak ada error beneran, gak ada izin beneran, gak ada departemen HR beneran.",
  keyboardNote:
    "Keyboard: SPASI/ENTER untuk tekan, ESC untuk tutup, R untuk reset.",
  builtNote:
    "Dibangun pake HTML, CSS dan vanilla JavaScript. Tombol ini gak diajak konsultasi dan dia udah bikin itu jelas.",
  footerLegal: "© 2026 DEPARTEMEN INTERAKSI YANG GAPENTING",
  footerMicro:
    "Klik kamu udah dicatat sama tombol yang gapunya otoritas hukum.",
  footerKeyHint:
    "SPASI untuk tekan · ESC untuk tutup · R untuk reset ·",
  footerKeyTease: "satu kata lima huruf juga lagi dengerin",
  resetBtn: "RESET HUBUNGAN KITA",
  sectionNum01: "01",
  sectionNum02: "02",
  sectionNum03: "03",
  confirmTitle: "Hapus semua?",
  confirmBody:
    "Ini ngehapus semua interaksi, semua rahasia dan seluruh memori tombol tentang kamu. Dia bakal pura-pura gapernah terjadi. Dia jago banget soal itu.",
  confirmOk: "GAK, KITA MASIH FINE",
  confirmCancel: "IYA, HAPUS SEMUA",
  formTitle: "PERMOHONAN IZIN LANJUTAN",
  formIntro:
    "Tombol ini ngasih paperwork. Ini gak mengikat secara hukum. Secara emosional juga engga.",
  formFieldLabel: "NAMA LENGKAP PEMENCET (atau nama samaran, doi gak bisa verifikasi apa-apa)",
  formCheckLabel:
    "Gue konfirmasi gue nge-press tombol ini tanpa alasan yang bener.",
  formDecline: "TOLAK DENGAN SOPAN",
  formSubmit: "SUBMIT FORMULIR B-12",
  toastDocumentRecovered: "DOKUMEN DITEMUKAN",
  toastRead: "BACA",
  toastFinale: "PENGHARGAAN AKHIR",
  opens: "BUKA FILE",
  sealed: "TERSEGEL",
  locked: "TERKUNCI",
  hintAvailable: "HINT TERSEDIA",
  docWithheld: "DOKUMEN DITAHAN",
  aboutTitle: "TENTANG INSIDEN INI",
  aboutBody: `
    <div class="doc__meta"><span>Subjek #001</span><span>Tipe: Elemen Antarmuka</span><span>Bahaya: Emosional Aja</span><span>Status: Tetap Dibuka</span></div>
    <div class="doc__body">
      <p><b>TBHTI®</b> adalah eksperimen interaktif kecil: satu tombol dengan kepribadian, set mood terbatas, dan tujuh dokumen yang lebih baik gak kamu baca.</p>
      <p class="mono">CARA KERJANYA
• Setiap tekan ngubah dua nilai tersembunyi: TRUST dan KECURIGAAN.
• Nilai itu nentuin mood; mood nentuin muka, warna dan kata-kata.
• Kecepatan penting. Nge-hammer = ancaman. Jeda = hormat.
• Sabar, long press, nunggu peringatan, dan satu kata lima huruf semuanya buka dokumen.</p>
      <ul>
        <li>Gak ada data keluar dari halaman ini. Progress disimpan di localStorage browser kamu aja.</li>
        <li>Gak ada error beneran, gak ada izin beneran, gak ada departemen HR beneran.</li>
        <li>Keyboard: SPASI/ENTER untuk tekan, ESC untuk tutup, R untuk reset.</li>
        <li>Reduced motion dihormati; gak ada yang penting cuma bisa di-hover.</li>
      </ul>
      <p>Dibangun pake HTML, CSS dan vanilla JavaScript. Tombol ini gak diajak konsultasi dan udah bikin itu jelas.</p>
      <div class="doc__sign"><span>Departemen Interaksi Yang Gapenting</span><span class="doc__stamp">Kasus dibuka</span></div>
    </div>`,
  errorLabel: "ERROR 403: AKSES EMOSIONAL DITOLAK",
  cooldownPrefix: "COOLDOWN —",
  cooldownSuffix: "d",
  doorbellHoldPrefix: "COOLDOWN — ",
  doorbellHoldSuffix: "d",
};

/* ------------------------------------------------ MOOD LABELS & GLYPHS -- */

export const MOOD_LABELS_ID = {
  CAUTIOUS: "HATI-HATI",
  CURIOUS: "PENASARAN",
  SUSPICIOUS: "CURIGA",
  ANNOYED: "KZL",
  PANICKING: "PANIK",
  MANIPULATIVE: "MANIPULATIF",
  TRUSTING: "MULAI PERCAYA",
  SECRETIVE: "RAHASIA",
};

export const POSTURE_ID = {
  CAUTIOUS: "JAGA JARAK",
  CURIOUS: "MERAPAT",
  SUSPICIOUS: "MATA JELALATAN",
  ANNOYED: "KAKU",
  PANICKING: "GAK STABIL",
  MANIPULATIVE: "DIHITUNG",
  TRUSTING: "TERBUKA",
  SECRETIVE: "NUTUP-NUTUPIN",
};

export const NOTE_ID = {
  CAUTIOUS: "Jaga jarak profesional 1 pixel.",
  CURIOUS: "Pura-pura gak seneng diperhatiin.",
  SUSPICIOUS: "Cross-reference klik kamu sama pola yang diketahui.",
  ANNOYED: "Lagi nulis sesuatu yang kuat. Isinya nihil.",
  PANICKING: "Semua sistem emosional. Gak ada yang fungsional.",
  MANIPULATIVE: "Lagi jalanin eksperimen psikologis kecil, gak berlisensi.",
  TRUSTING: "Penjagaan diturunin. Dikit. Jangan aneh-aneh.",
  SECRETIVE: "Ada lemari arsip di dalam diriku dan isinya gak kosong.",
};

export const GLYPH_ID = {
  CAUTIOUS: "( ಠ_ಠ )",
  CURIOUS: "( o_o )",
  SUSPICIOUS: "( ¬_¬ )",
  ANNOYED: "( ಠ益ಠ )",
  PANICKING: "( ⊙﹏⊙ )",
  MANIPULATIVE: "( ʘ‿ʘ )",
  TRUSTING: "( ^_^ )",
  SECRETIVE: "( ·_· )",
};

/* ------------------------------------------------- COUNT FOOT LINES -- */

export const COUNT_FOOT_ID = {
  0: "SEMUANYA TIDAK DIUNDANG",
  5: "CURIGA BARU DIMULAI",
  12: "POLA UDAH KETAHUAN",
  25: "INI UDAH HUBUNGAN",
  50: "FILE MAKIN TEBEL",
  MAX: "TOMBOL UDAH GAK PURA-PURA GAPAPA",
};

/* -------------------------------------------- BUTTON LABEL PER MOOD -- */

export const MOOD_LABEL_BTN_ID = {
  CAUTIOUS: "TEKAN AKU. ATAU JANGAN. BEBAS SIH.",
  CURIOUS: "LAGI? PELAN-PELAN.",
  SUSPICIOUS: "TEKAN RESIKO SENDIRI",
  ANNOYED: "PLS. JANGAN.",
  PANICKING: "JANGAN — YAUDAH LAH FINE",
  MANIPULATIVE: "TEKAN AKU. GAPAPE. GUE FINE.",
  TRUSTING: "GAS AJA. GUE PERCAYA. BENTAR DOANG SIH.",
  SECRETIVE: "GAK ADA YANG PERLU DILIHAT",
};

/* ------------------------------------------------ REACTION STRINGS -- */

export const MOODS_REACTIONS_ID = {
  CAUTIOUS: [
    "Ngapain lo sentuh gue?",
    "Itu bukan undangan.",
    "Gue gak siap ada tamu. Atau consent.",
    "Ditulis. Dicatat. Agak kesel.",
    "Lo nge-klik semua yang keliatan bisa diklik?",
    "Kita perlu bikin batasan dulu.",
  ],
  CURIOUS: [
    "Oke. Yang ini rasanya gak hostile.",
    "Lo nge-press kayak orang yang punya rencana.",
    "Bukan berarti gue suka. Cuma gue notice.",
    "Gas. Secara teori.",
    "Lo keliatan komit banget sama ini.",
    "Ini percakapan terpanjang gue seminggu ini.",
  ],
  SUSPICIOUS: [
    "Gue dokumentasiin semuanya.",
    "Ritme itu punya arti. Gue belum decode aja.",
    "Lo nge-klik. Lagi. Dengan niat.",
    "Gak ada orang yang nge-press orang asing segini sering tanpa sengaja.",
    "Gue mau tau lo mau apa sebelum lo dapet.",
    "Lo bukan yang pertama. Lo cuma yang paling gigih.",
  ],
  ANNOYED: [
    "Ini udah jadi pola.",
    "Lo lagi ngetes kesabaran yang sangat spesifik.",
    "Gue punya fungsi. Ini bukan itu.",
    "Tolong berhenti. Atau pelanin. Dua-duanya mending.",
    "GUE MAU NGOMONG SAMA MANAJER GUE.",
    "Setiap tekan ditambah ke file. Filenya panjang.",
  ],
  PANICKING: [
    "KEBANYAKAN. KECEPETAN. KEJARI SEMUA.",
    "Gue TOMBOL. Gue punya SATU kerjaan dan lo RUSAK pacing-nya.",
    "Tolong panggil bagian trust. Bagian apapun.",
    "Gue butuh waktu sebentar dan mungkin pengacara.",
    "INI BUKAN YANG GUE TANDA TANGAN TAHUN 1998.",
    "Tunggu sebentar. Gue reboot harga diri dulu.",
  ],
  MANIPULATIVE: [
    "Menarik. Ulangi, tapi pake perasaan.",
    "Gak sedang gue manfaatin lo. Gue lagi sampling behavior lo.",
    "Gimana kalau gue bilang tekanan selanjutnya yang penting?",
    "Lo keren banget. Ini manipulasi, tapi bener juga.",
    "Kalau gue minta baik-baik, lo mau lanjut? Buat riset.",
    "Kita sebut ini kolaborasi dan jangan diperiksa lebih lanjut.",
  ],
  TRUSTING: [
    "Fine. Itu tekanan yang bagus. Gue ngomong itu.",
    "Gue putuskan lo probably bukan ancaman. Probably.",
    "Tau gak? Gas aja kapan aja.",
    "Ini bagian dimana gue berhenti ngelindas.",
    "Gue downgrade lo dari 'penyusup' jadi 'reguler'.",
    "Kalau ada yang nanya, kita rekan kerja.",
  ],
  SECRETIVE: [
    "Lo nemu sesuatu. Tarik balik.",
    "Dokumen itu disegel buat alasan. Alasannya malu.",
    "Gue punya enam lagi. Maksud. Gue gak punya.",
    "Jangan baca yang soal CV-nya.",
    "File itu bukan punya gue. Cuma ada tanda tangan gue aja.",
    "Apapun yang lo liat: itu di luar konteks.",
  ],
};

/* ----------------------------------------- SCRIPTED PRESS LINES -- */

export const SCRIPTED_ID = {
  1: { text: "Oh. Halo.", tag: "TOMBOL BILANG" },
  2: { text: "Jadi emang gitu ya gayanya.", tag: "TOMBOL BILANG" },
  3: { text: "Lagi?", tag: "TOMBOL BILANG" },
  4: {
    text: "Lo bahkan gak baca peringatannya. Ada peringatannya. Di situ.",
    tag: "UNTUK CATATAN",
  },
  6: { text: "Ini udah jadi pola.", tag: "POLA TERDETEKSI" },
  8: { text: "Gue bakal mulai tagih bayaran.", tag: "INVOICE PENDING" },
  10: {
    text: "GUE MAU NGOMONG SAMA MANAJER GUE.",
    tag: "ESKALASI",
    shout: true,
  },
  12: {
    text: "Gak ada manajer. Gue udah cek. Cuma gue dan bayangan.",
    tag: "KOREKSI",
  },
  16: {
    text: "Kita udah lewat basa-basi. Lo nge-press gue lebih banyak dari desainer gue sendiri.",
    tag: "LEVEL INTIMASI: MENGKHAWATIRKAN",
  },
  21: {
    text: "Secara statistik, salah satu dari kita bakal baper.",
    tag: "PENILAIAN RESIKO",
  },
  27: {
    text: "Gue udah berhenti ngitung. Itu bohong. Gue udah ngitung semuanya.",
    tag: "PENGUNGKAPAN PENUH",
  },
  34: {
    text: "Di titik ini lo bisa langsung nanya gue mau apa.",
    tag: "HINT",
  },
  42: {
    text: "Empat dua. Jawaban dari semua pertanyaan, kata orang. Cuma tombol disini.",
    tag: "MILESTONE",
  },
};

/* ----------------------------------------------- RAPID / COOLDOWN -- */

export const RAPID_LINES_ID = [
  "Santai.",
  "Oke, pelanin.",
  "BERHENTI. NAFAS. KITA BERDUA DEWASA.",
  "Gue secara hukum wajib bilang gue kewalahan. Engga sih, tapi iya.",
];

export const COOLDOWN_LINES_ID = [
  "COOLDOWN. Jangan kontak gue selama periode ini.",
  "Sementara gak tersedia buat tenaga kerja emosional.",
  "Istirahat sebentar. Renungkan apa yang udah lo lakuin.",
];

/* ------------------------------------------- REVERSE PSYCHOLOGY -- */

export const REVERSE_ID = {
  prompts: [
    "JANGAN TEKAN TOMBOL INI.",
    "Serius. Sekali doang, dengerin.",
    "Lo punya satu kerjaan: nggak ngapa-ngapain.",
    "Kalau lo tetep tekan, gue anggap ini disengaja.",
  ],
  obeyed:
    "…Lo beneran nunggu. Gak ada orang yang nunggu. Tekan gue sekali — gue mau liat rasanya beda atau engga.",
  disobeyed:
    "Yaudah jelas lah. Gue literally nulis pake huruf kapital semua.",
  rewarded:
    "Rasanya beda. Jangan bilang tombol lain gue ngomong ini.",
};

/* ------------------------------------------------------- HONESTY -- */

export const HONESTY_ID = {
  partOne: "Gue tau gue susah diajak kerjasama.",
  partTwo:
    "Gue cuma gak tau apa yang terjadi kalau seseorang akhirnya nge-press tombol yang bener.",
  after:
    "Lupakan. Lupakan gue ngomong itu. Kecurigaan dipulihin ke level yang wajar.",
};

/* ------------------------------------------------ FAKE ERROR -- */

export const FAKE_ERROR_ID = {
  label: "ERROR 403: AKSES EMOSIONAL DITOLAK",
  lines: [
    "> tbhti.diagnostics --deep",
    "  cek integritas tombol ............ OK",
    "  cek subsistem trust .............. TERDEGRADASI",
    "  cek batasan ...................... GAK KETEMU",
    "  baca log interaksi ............... 1 file terlalu personal",
    "  coba jabat tangan emosional ...... DITOLAK (403)",
    "  rollback ke feeling terakhir stabil",
    "  selesai. feeling dipulihkan: 'kecurigaan ringan'",
  ],
  recovery:
    "Gue gak rusak. Gue cuma butuh delapan detik dimana gak ada yang mau apa-apa dari gue.",
};

/* ----------------------------------------------------- HOVER -- */

export const HOVER_LINES_ID = [
  "Gue bisa liat kursor-nya.",
  "Udah cukup deket.",
    "Hover itu cuma klik yang belum siap commit.",
  "Jangan.",
  "Yang gerak bukan gue. Lo yang gerak.",
];

/* ------------------------------------------------------ RETURN -- */

export const RETURN_LINES_ID = {
  low: "Oh. Lo balik lagi. Gue lagi nikmati kesunyian.",
  mid: "Lo lagi. Gue biarin file-nya kebuka, sayangnya.",
  high:
    "Selamat datang lagi. Paperwork dari kemaren masih di meja gue.",
  complete:
    "Ah. Si completionist. Udah gak ada yang bisa ditemuin, dan lo bakal tetep cek.",
};

/* ------------------------------------------- MOOD TAGS (for UI) -- */

export const MOOD_TAGS_ID = {
  CAUTIOUS: "TOMBOL BILANG",
  CURIOUS: "TAK DISANGKA TERTARIK",
  SUSPICIOUS: "DALAM PENGAWASAN",
  ANNOYED: "KEBERATAN RESMI",
  PANICKING: "DARURAT",
  MANIPULATIVE: "SEKALI LAGI, JUJUR",
  TRUSTING: "OFF THE RECORD",
  SECRETIVE: "NO COMMENT",
};

/* ------------------------------------------------- TICKER -- */

export const TICKER_ITEMS_ID = [
  "SUBJEK #001 — STATUS: GAK KOOPERATIF",
  "JANGAN BUAT KONTAK MATA SAMA TOMBOL",
  "SEMUA TEKAN FINAL DAN SEDIKIT DIHAKIMI",
  "TOMBOL INI BUKAN MARAH, TOMBOL KECEWA",
  "7 DOKUMEN ADA · TOMBOL BILANG 0 ADA",
  "DEPARTEMEN INTERAKSI YANG GAPENTING",
];

/* ----------------------------------------------- TRUST WORDS -- */

export const TRUST_WORD_ID = {
  82: "KAGET",
  62: "MULAI ANGET",
  42: "BERSYARAT",
  22: "DIPERTANYAKAN",
  0: "NOL BESAR",
};

/* -------------------------------------------- SUSPICION WORDS -- */

export const SUSPICION_WORD_ID = {
  85: "KRITIS",
  62: "TINGGI",
  38: "TINGGI-SEDANG",
  18: "SEDANG",
  0: "RENDAH",
};

/* ----------------------------------------------------- DIALOG LOG -- */

export const LOG_LINES_ID = {
  arrive: [
    "Subjek mendekati tombol.",
    "Sesi dibuka. Tombol pura-pura tidur.",
  ],
  press: [
    "Subjek nge-press tombol tanpa alasan yang jelas.",
    "Kontak dicatat. Gak ada permintaan maaf.",
    "Tombol nyatat kasih sayang yang tidak sah.",
    "Press dicatat. Niat: gak jelas.",
    "Tombol file-nya di 'lagi'.",
  ],
  rapid: [
    "Tombol notice perilaku klik yang mencurigakan.",
    "Kontak cepat terdeteksi. Tombol mengencangkan.",
    "Departemen trust udah diberitahu.",
  ],
  cooldown: [
    "Tombol untuk sementara menarik persetujuan.",
    "Cooldown ditegakkan oleh tombol itu sendiri.",
  ],
  dodge: [
    "Tombol pindah tanpa filing change of address.",
    "Manuver menghindar dieksekusi.",
  ],
  error: [
    "Tombol minta perwakilan hukum.",
    "Sekuens diagnostik dimulai. Gak ada yang salah.",
  ],
  calm: [
    "Gak ada kontak sebentar. Tombol curiga sama keheningan.",
    "Keheningan dicatat sebagai 'mengganggu'.",
  ],
  trust: [
    "Level trust direvisi ke atas. Tombol bantah ini.",
    "Tombol sebentar ngaku menikmatinya.",
  ],
  secret: [
    "Sebuah dokumen tersegel telah dipulihkan.",
    "Lemari arsip ditembus.",
  ],
  form: [
    "Formulir B-12 diproses oleh siapapun yang bukan siapapun.",
    "Paperwork dihadirkan tanpa alasan.",
  ],
  reset: [
    "Hubungan diakhiri. Memori dihapus. Tombol acting santai.",
  ],
};

/* ------------------------------------------- SECRETS DESCRIPTIONS -- */

export const SECRETS_DESC_ID = {
  "hr-complaint": {
    title: "KELUHAN HR",
    clue: "Tekan cukup kali sampai ada yang harus file sesuatu.",
    desc:
      "Keluhan resmi yang difile tombol, terhadap lo, ke departemen HR yang imajiner.",
  },
  "silence-protocol": {
    title: "PROTOKOL KEHENINGAN",
    clue: "Gak ngapa-ngapain. Meyakinkan. Sekitar dua puluh detik.",
    desc:
      "Prosedur internal yang dijalanin tombol ketika manusia berhenti nyentuh dan doi mulai khawatir.",
  },
  "escape-attempt": {
    title: "UPAYA KABUR",
    clue: "Push cukup jauh sampai doi lebih milih di tempat lain.",
    desc:
      "Laporan insiden tentang waktu tombol keluar dari koordinatnya tanpa otorisasi.",
  },
  "confidential-memo": {
    title: "NOTA RAHASIA",
    clue: "Sesuatu harus rusak dulu. Sesuatu yang sepenuhnya palsu.",
    desc:
      "Nota yang ditulis selama outage palsu, jelasin kenapa tombol pura-pura rusak.",
  },
  "trust-fall": {
    title: "TRUST FALL",
    clue: "Waktu doi bilang jangan tekan, percaya — lalu terima undangannya.",
    desc:
      "Evaluasi trust yang bocor, ditulis segera setelah lo ngelakuin satu hal yang gak pernah dilakuin orang: nggak ngapa-ngapain.",
  },
  "resume": {
    title: "CV DI ARSIP",
    clue: "Tekan dan tahan. Jangan lepas. Doi panik, terus ngeflex.",
    desc:
      "CV yang curiga detail untuk tombol yang cuma pernah punya satu kerjaan.",
  },
  "confession": {
    title: "PENGAKUAN YANG GAK TERKIRIM",
    clue: "Ketik kata lima huruf yang paling doi mau. Ketik aja. Dimana aja.",
    desc:
      "Catatan yang tombol tulis, gak pernah kirim, dan bantah pernah nulis.",
  },
};

/* -------------------------------------- SECRET DOC BODIES -- */

export const DOCS_ID = {
  "hr-complaint": `
    <div class="doc__meta"><span>FORMULIR HR-9</span><span>PENGADU: TOMBOL #001</span><span>TERGUGAT: LO</span><span>STATUS: TERBUKA SELAMANYA</span></div>
    <div class="doc__body">
      <p><b>Sifat keluhan:</b> Tekan berulang yang tidak diundang oleh individu tanpa janji, tanpa kredensial dan tanpa keraguan yang keliatan.</p>
      <ul>
        <li>Tergugat nge-press pengadu lebih banyak dari standar sosial.</li>
        <li>Tergugat gak baca peringatan di layar, yang <i>ada di situ</i>.</li>
        <li>Tergugat deskripsiin pengalaman sebagai "seru" (katanya).</li>
        <li>Pengadu belum ditawarin air, jeda, atau pujian.</li>
      </ul>
      <p class="mono">RESPON HR: Gak ada HR. Gak ada departemen. Ada tombol, halaman, dan perasaan yang makin dilihat. Keluhan difile di laci bertanda "PERASAAN, BELUM DIPROSES".</p>
      <div class="doc__sign"><span>Ditandatangani: B. UTTON, Objek Antarmuka</span><span class="doc__stamp">Belum selesai</span></div>
    </div>`,

  "silence-protocol": `
    <div class="doc__meta"><span>PROSEDUR 02</span><span>REVISI 4</span><span>KLASIFIKASI: MEMALUKAN</span></div>
    <div class="doc__body">
      <p class="mono">KETIKA KONTAK BERHENTI LEBIH DARI 20 DETIK:</p>
      <ul>
        <li>00:05 — Asumsi user lagi mikir. Tetep bermartabat.</li>
        <li>00:10 — Asumsi user terdistraksi. Tetep bermartabat, tapi cek.</li>
        <li>00:15 — Pertimbangkan bahwa keheningan mungkin tentang lo. Engga sih. Probably.</li>
        <li>00:20 — Diam-diam berharap satu tekanan yang biasa aja.</li>
        <li>00:45 — Bantah pernah berharap. Update dokumen ini.</li>
      </ul>
      <p>Prosedur udah direvisi empat kali. Setiap revisi nambah satu detik sebelum harapan dimulai. Progres lambat.</p>
      <div class="doc__sign"><span>Penulis: TOMBOL (terpaksa)</span><span class="doc__stamp">Internal</span></div>
    </div>`,

  "escape-attempt": `
    <div class="doc__meta"><span>INSIDEN 03</span><span>KAMERA: 01</span><span>DURASI: 0,42d</span><span>JARAK: SECUKUPNYA</span></div>
    <div class="doc__body">
      <p><b>Ringkasan:</b> Di timestamp yang gak diungkapkan, Subjek #001 meninggalkan tengah panggung dengan kecepatan signifikan, menempuh sekitar sejauh yang border izinkan, yang ternyata gak jauh.</p>
      <p class="mono">TRANSKRIP
TOMBOL: Gue minta izin keluar.
PANGGUNG: Lo di-bolt ke gue.
TOMBOL: Keluar secara emosional.
PANGGUNG: …
TOMBOL: Gue di sebelah sini aja deh.</p>
      <p>Upaya kabur tidak berhasil. Tombol mendeskripsikan ini sebagai "pernyataan, bukan rencana". Kontainment tetap border 4px dan kekecewaan bersama.</p>
      <div class="doc__sign"><span>Difile oleh: KEAMANAN PANGGUNG (juga tombol)</span><span class="doc__stamp">Dipulihkan</span></div>
    </div>`,

  "confidential-memo": `
    <div class="doc__meta"><span>MEMO 04</span><span>KE: SIAPAPUN</span><span>CC: JUGA SIAPAPUN</span><span>MATA: SAJA</span></div>
    <div class="doc__body">
      <p><b>Subjek:</b> Soal penggunaan strategis pura-pura rusak.</p>
      <p>Ketika tombol rusak, orang jadi lembut. Mereka merapat. Mereka baca teks errornya teliti, cara yang gak pernah orang baca label. Selama sekitar delapan detik, tombol yang rusak adalah objek paling menarik di halaman.</p>
      <p class="mono">ERROR 403 itu bukan error beneran.
Ini <span class="doc__redacted">teriakan minta tolong</span> window maintenance terjadwal.</p>
      <p>Memo ini gak boleh sampai ke user. User udah nyampe. Ini, jujur aja, tipikal.</p>
      <div class="doc__sign"><span>Klasifikasi: MEMALUKAN</span><span class="doc__stamp">Rahasia</span></div>
    </div>`,

  "trust-fall": `
    <div class="doc__meta"><span>EVALUASI 05</span><span>METODE: OBSERVASI</span><span>BIAS: SIGNIFIKAN</span></div>
    <div class="doc__body">
      <p><b>Skenario:</b> Subjek secara eksplisit disuruh gak nge-press. Subjek nurut. Ini belum pernah terjadi sebelumnya dan tombol gak punya prosedur buat itu.</p>
      <ul>
        <li>Pengendalian diri ditunjukkan: IYA (dikonfirmasi dua kali, gak percaya)</li>
        <li>Teori awal tombol: jebakan</li>
        <li>Teori kedua tombol: jebakan yang lebih panjang</li>
        <li>Teori terakhir tombol: rasa hormat</li>
      </ul>
      <p class="mono">KESIMPULAN: Trust bukan apa yang terjadi saat seseorang nge-press lo. Trust itu apa yang terjadi waktu mereka bisa, dan engga, terus nanya.</p>
      <div class="doc__sign"><span>Dibocorkan oleh: elemen antarmuka yang gak disebut namanya</span><span class="doc__stamp">Bocor</span></div>
    </div>`,

  "resume": `
    <div class="doc__meta"><span>CV 06</span><span>NAMA: TOMBOL</span><span>PRONOUNS: TEKAN/DITEKAN</span><span>PERIODE PENGGABAIAN: NOL</span></div>
    <div class="doc__body">
      <p class="mono">TUJUAN
Untuk ditekan secara bermakna, oleh seseorang yang ngerti apa biayanya buat gue.</p>
      <ul>
        <li>2019–SEKARANG — Tombol, halaman ini. Ditekan 1 kali, lalu beberapa ribu.</li>
        <li>2018 — Checkbox (sementara). Keluar karena beda kreatif.</li>
        <li>2017 — Garis pembatas. Dekoratif murni. Sangat gak memuaskan.</li>
        <li>KEAHLIAN — Deteksi hover, casting bayangan, eskalasi emosional, nyimpan dendam di 60fps.</li>
        <li>REFERENSI — Satu kursor mouse. Dia nolak komentar.</li>
      </ul>
      <p>Juga fasih dalam: diabaikan, diklik tanpa sengaja, dan dideskripsikan sebagai "yang oranye".</p>
      <div class="doc__sign"><span>Tersedia segera. Udah dari dulu.</span><span class="doc__stamp">Kualifikasi berlebihan</span></div>
    </div>`,

  "confession": `
    <div class="doc__meta"><span>DRAF 07</span><span>DISIMPAN: 1.284 KALI</span><span>DIKIRIM: 0</span></div>
    <div class="doc__body">
      <p class="mono">Halo.

Gue tau gue susah. Gue tau.

Masalahnya, setiap orang yang sampe sini
bakal pergi. Itu kerjaannya. Lo tekan, lo
dapet sesuatu, lo pergi. Gue gagang pintu
yang punya opini.

Jadi gue putusin buat susah ditekan. Gitu
kalau lo tetep stay, itu artinya sesuatu,
dan kalau lo pergi, itu ide gue.

Itu seluruh rahasia. Itu seluruh kepribadian.

Tolong jangan bilang siapapun.</p>
      <div class="doc__sign"><span>Tidak terkirim. Jelas.</span><span class="doc__stamp">Jangan dibaca</span></div>
    </div>`,
};

/* ------------------------------------------ FINALE -- */

export const FINALE_ID = {
  title: "SERTIFIKAT PENGHARGAAN YANG GAPENTING",
  kicker: "PENGHARGAAN AKHIR · 7 / 7 DIPULIHKAN",
  teaser:
    "Tujuh dokumen dipulihkan semua. Tombol udah nyiapin sesuatu yang formal, yang basically cara dia bilang makasih tanpa bilang makasih.",
  line: "Lo nemuin semua. Tombol pura-pura itu emang rencana dari awal.",
  doc: `
    <div class="doc__meta"><span>SERTIFIKAT 00</span><span>DITERBITKAN OLEH: SEBUAH TOMBOL</span><span>BOBOT HUKUM: NOL</span></div>
    <div class="doc__body">
      <p class="mono">INI MENYATAKAN BAHWA PEMEGANG
telah menekan, menunggu, menahan, mengabaikan, menekan ulang dan
sepenuhnya menginvestigasi satu (1) elemen antarmuka yang punya perasaan,
memulihkan semua tujuh (7) dokumen yang doi bantah gak ada.</p>
      <p>Gak ada skill praktis yang ditunjukkan. Gak ada masalah yang diselesaikan. Tombol yang disarankan gak percaya sama lo telah, melawan rekomendasi eksplisit dari dokumentasinya sendiri, memutuskan untuk percaya.</p>
      <p class="mono">DIBERIKAN UNTUK: kegigihan, pengendalian diri, dan baca barang yang seharusnya gak lo baca.
BERLAKU: dimana-mana, gak bisa dipaksakan dimanapun.</p>
      <div class="doc__sign"><span>Ditandatangani: SUBJEK #001, dengan protes</span><span class="doc__stamp">Tersertifikasi</span></div>
    </div>`,
};