/* ═══════════════════════════════════════════
   UTube Maheera — KANAK-KANAK — app.js
   Kids-safe video browser: only official videos
   from popular Malay kids channels. No ads, no
   related-video rabbit holes (rel=0), no comments.
   Settings panel lets you add your own channels
   (validated via the YouTube Data API v3).
═══════════════════════════════════════════ */

/* ────────────────────────────────────────
   BUILT-IN CHANNELS
──────────────────────────────────────── */
const CHANNELS = {
    monsta:    { label: 'MONSTA',       cls: 'ch-monsta',    color: '#e63946', icon: '⚡', lang: 'ms' },
    papazola:  { label: 'Papa Zola',    cls: 'ch-papazola',  color: '#f97316', icon: '🍕', lang: 'ms' },
    upinipin:  { label: 'Upin & Ipin',  cls: 'ch-upinipin',  color: '#10b981', icon: '🌙', lang: 'ms' },
    ejenali:   { label: 'Ejen Ali',     cls: 'ch-ejenali',   color: '#2563eb', icon: '🕵️', lang: 'ms' },
    didi:      { label: 'Didi & Friends', cls: 'ch-didi',    color: '#f59e0b', icon: '🐤', lang: 'ms' },
    durioo:    { label: 'Durioo+',      cls: 'ch-durioo',    color: '#6d28d9', icon: '🕌', lang: 'ms' },
    msrachel:  { label: 'Ms Rachel',    cls: 'ch-msrachel',  color: '#ec4899', icon: '🎓', lang: 'en' },
    alifsofia: { label: 'Alif & Sofia', cls: 'ch-alifsofia', color: '#ec4899', icon: '🌸', lang: 'ms' },
    omarhana:  { label: 'Omar & Hana',  cls: 'ch-omarhana',  color: '#16a34a', icon: '🌙', lang: 'ms' },
    learnwithzakaria: { label: 'Learn with Zakaria', cls: 'ch-zakaria', color: '#0891b2', icon: '🎨', lang: 'ar' },
    bebefinn: { label: 'Bebefinn', cls: 'ch-bebefinn', color: '#f472b6', icon: '🦈' },
};

const CUSTOM_ICONS = ['📺', '🌟', '🎈', '🦄', '🍬', '🐼', '🦋', '🚀', '🎪', '🧸'];

const VIDEOS = [
    // MONSTA
    { id: '0RiJKFjcHzM', ch: 'monsta', title: 'BoBoiBoy The Movie™ | Full Animated Film in HD (English Dub)' },
    { id: 'JXcMu0jmeQQ', ch: 'monsta', title: 'BoBoiBoy Movie 2™ | Full Movie in HD (English Subtitles)' },
    { id: 'arJHUK4djaY', ch: 'monsta', title: 'BoBoiBoy Galaxy Marathon - Episod 1 - 13' },
    { id: 'G4ZVuKovGGY', ch: 'monsta', title: 'BoBoiBoy Galaxy - Cahaya dan Solar | Animasi Kanak-kanak (42 Minit)' },
    { id: 'ygkSYrXsLik', ch: 'monsta', title: 'BoBoiBoy OST: Kotak - Jagalah Bumi (Theme from BoBoiBoy)' },
    { id: 'BZ0Tw2KvWZE', ch: 'monsta', title: 'BoBoiBoy Galaxy Marathon - Episod 14 - 18' },
    { id: '1KYddgEZCyI', ch: 'monsta', title: 'BoBoiBoy Galaxy EP11 | Pertarungan Hangat / A Fiery Fight (ENG Subtitles)' },
    { id: 'YyjVgpocQTI', ch: 'monsta', title: 'BoBoiBoy Galaxy Marathon - EPISOD 19 - 24' },
    { id: 'zMjSIjOqARc', ch: 'monsta', title: 'BoBoiBoy Galaxy SORI™ | Marathon' },
    { id: 'iMuMo5UQgvA', ch: 'monsta', title: 'BoBoiBoy Galaxy EP17 | Gelora BoBoiBoy Air / Making Waves (ENG Subtitles)' },
    { id: 'Bg1sjy_xS_Q', ch: 'monsta', title: 'Episod 16: Bahaya BoBoiBoy Api! | BoBoiBoy Musim 3' },
    { id: 's7c585J5YyY', ch: 'monsta', title: 'BoBoiBoy Galaxy EP09 | Katakululu\'s Hypnotic' },
    { id: 'BdVBBMCbg1s', ch: 'monsta', title: 'BoBoiBoy Galaxy EP12 | Si Penceroboh Panto / Phantom Thief Panto (ENG Subtitles)' },
    { id: 'iKHolM16a0o', ch: 'monsta', title: 'BoBoiBoy Galaxy EP14 | Kemunculan Halilintar / Thunderstorm Strikes (ENG Subtitles)' },
    { id: 'gHgkq0ZLIgo', ch: 'monsta', title: 'BoBoiBoy Galaxy EP18 | Dendam A.B.A.M / B.R.R.O.\'s Revenge (ENG Subtitles)' },
    { id: 'PJPfxmdIyFs', ch: 'monsta', title: 'Kemunculan Pertama BoBoiBoy FUSION! I #Happy1YearBBBM2' },
    { id: 'jWcLDirQmT4', ch: 'monsta', title: 'BoBoiBoy Galaxy - Season 1 Finale EP24 | Sinaran Penamat / Light of Hope (ENG Subtitles)' },
    { id: 'a82HdPAeFWI', ch: 'monsta', title: 'BoBoiBoy Galaxy EP13 | Sarkas Kegelapan / Dark Circus (ENG Subtitles)' },
    { id: 'M_ov3-HF-XM', ch: 'monsta', title: 'FINALE EP06 - BoBoiBoy Galaxy Windara | Pertarungan Demi Windara' },
    { id: 'jHhpBl0aqtQ', ch: 'monsta', title: 'BoBoiBoy Galaxy Windara (Malay & English Dub)' },
    { id: 'mlQ83Y-Gcdo', ch: 'monsta', title: 'BoBoiBoy Movie 2™️ | TGV PSA COMPILATION' },
    { id: 'TxtP0vo_nJo', ch: 'monsta', title: 'Pertemuan BoBoiBoy Api & BoBoiBoy Air' },
    { id: 'wuZnM5o-zMM', ch: 'monsta', title: 'FINALE EP06 - BoBoiBoy Galaxy Baraju | Baraju United' },
    { id: 'JLKOkeRSbRE', ch: 'monsta', title: 'BoBoiBoy Galaxy EP20 | Manipulasi Emosi / Emotion Manipulation (ENG Subtitles)' },
    { id: 'TJpIKNYC2SA', ch: 'monsta', title: 'Episod 19: Kejutan BoBoiBoy Air | BoBoiBoy Musim 3' },
    { id: 'bd5Onbh2uQc', ch: 'monsta', title: 'BoBoiBoy Galaxy EP21 | Jagara Si Jaga / The Guardian Robot (ENG Subtitles)' },
    { id: 'psKmmwrC8hg', ch: 'monsta', title: 'BoBoiBoy Galaxy EP05 | Daun VS Lanun / BoBoiBoy Leaf VS The Pirates (ENG Subtitles)' },
    { id: 'pNc_QR-LrJY', ch: 'monsta', title: 'Episod TERAKHIR: Jumpa Lagi BoBoiBoy | BoBoiBoy Musim 3' },
    { id: 'yjAiIVplFn0', ch: 'monsta', title: 'BoBoiBoy Movie 2 OST || Fire & Water - Faizal Tahir [Official Music Video]' },
    { id: 'JZVl9YIk490', ch: 'monsta', title: 'BoBoiBoy Galaxy - Cattus si Kucing Gergasi! | Animasi Kanak-kanak (56 Minit)' },
    { id: 'QqulOB3K7VI', ch: 'monsta', title: 'Ochobot Coincase?!!💰 | Let\'s Save Up For BoBoiBoy Movie 3 #OchobotCoincase' },
    { id: '7Ebg7nEeP2E', ch: 'monsta', title: 'Ochobot: Sebuah Power Sphera' },
    { id: 'PXkCbnbnfH8', ch: 'monsta', title: 'BoBoiBoy | Evolusi Golem Tanah ( Season 1 - Season 2 )' },
    { id: 'yRu4Nc2hjCg', ch: 'monsta', title: 'Detik Pertemuan BoBoiBoy Api dan BoBoiBoy Air' },
    { id: 'iJPNFhNzyO8', ch: 'monsta', title: 'Evolusi BoBoiBoy: Dari Musim 1 Hingga Galaxy!' },
    { id: 'YjkAQOR-O_w', ch: 'monsta', title: 'The Most EPIC Boboiboy Galaxy Moments' },
    { id: 'ZaK8YImgD64', ch: 'monsta', title: 'Boboiboy Galaxy 2: Best Fights, Funniest & Saddest Scenes EVER' },
    { id: 'HQI6cFlS-wc', ch: 'monsta', title: 'BoBoiBoy vs The Strongest Enemy in the Galaxy' },
    { id: 'tKgoE3XDR90', ch: 'monsta', title: 'BoBoiBoy Galaxy Windara (All Fight Scenes)' },
    { id: 'mOmnEIuK-lU', ch: 'monsta', title: 'Momen Epik BoBoiBoy Halilintar' },
    { id: '5S5ZcFFRvMI', ch: 'monsta', title: 'BoBoiBoy All Seasons Marathon' },
    { id: 's39FN6T2An0', ch: 'monsta', title: 'Monsta Galaxy Card Academia League 2026 | Tournament Kedua Kuala Lumpur' },
    { id: 'xo-q7IpjV3Q', ch: 'monsta', title: 'Tabung Ochobot | Akan Datang' },
    { id: 'LCUMO_U6wvU', ch: 'monsta', title: 'BoBoiBoy Galaxy S1 - S2 Marathon' },
    { id: 'dyemUJkaE3M', ch: 'monsta', title: 'BoBoiBoy Galaxy Gentar All Fight Scenes' },
    { id: 'x9a29HkH-hA', ch: 'monsta', title: 'Papa Pipi Series | Teaser Trailer - 5 December 2026' },
    { id: 'SR0gmWTt8tk', ch: 'monsta', title: 'BoBoiBoy Frostfire vs Glacier | Ultimate Combat #boboiboy15' },
    { id: '9itwMt6SO48', ch: 'monsta', title: 'Promo FGURA MechaCopter x Taufan' },
    { id: 'yq1MnxG6aI4', ch: 'monsta', title: 'BoBoiBoy Movie 3 | Logo Reveal' },
    { id: 'jp4m67Tc39E', ch: 'monsta', title: 'Monsta Galaxy Card Academia League 2026 | Lokasi Pertama Kuala Lumpur' },
    { id: 'XNL5CI11HY8', ch: 'monsta', title: 'BOBOIBOY MOVIE 3 - Official Teaser | MID 2027' },
    { id: '4-vLa8Snaic', ch: 'monsta', title: 'BoBoiBoy Movie 3 | Teaser Date Announcement' },
    { id: '5Ygpg9bJC5g', ch: 'monsta', title: 'Jom sambut Hari Bapa bersama Kebenaran!' },
    { id: 'V67wrMC_Qz8', ch: 'monsta', title: 'WEEK ONE MONSTA FIESTA 2026 INDONESIA' },
    { id: 'NJNt1iNCH-o', ch: 'monsta', title: 'Terima Kasih, Ayah! | Hari Bapa Special' },
    { id: 'fWOINi76j14', ch: 'monsta', title: 'Kenangan Pipi bersama Papa' },

    // PAPA ZOLA
    { id: 'FuVIpAFP8vA', ch: 'papazola', title: 'PAPA ZOLA THE MOVIE | Official Trailer (Korean Dub)' },
    { id: 'hP7Hj2NQ-wk', ch: 'papazola', title: 'PAPA ZOLA THE MOVIE | Official International Trailer | Now On Netflix' },
    { id: 'ZaH5p3ukyD4', ch: 'papazola', title: 'Papa Zola The Movie - Versi Komik' },
    { id: 'xQ2xIbRM4Ew', ch: 'papazola', title: 'BoBoiBoy Movie 3 | Papa Zola The Movie - First Look' },
    { id: 'fxTGE4vtS3A', ch: 'papazola', title: 'Papa Zola The Movie - Treler Rasmi Esok' },

    // UPIN & IPIN
    { id: 'bqPqp_XLLTU', ch: 'upinipin', title: 'Upin & Ipin - Goyang Upin & Ipin [Music Video]' },
    { id: 'PiWDylHIoRk', ch: 'upinipin', title: 'Upin & Ipin - New Toys [English Version][HD]' },
    { id: 'uv8Y3sNCXK8', ch: 'upinipin', title: 'Upin & Ipin - Gong Xi Fa Cai [FULL] [HD]' },
    { id: '_MqrP0FQpeY', ch: 'upinipin', title: 'Upin & Ipin Mengaji - Alif Ba Ta' },
    { id: 'NSOko9Zv4BA', ch: 'upinipin', title: 'Promo LINE Malaysia - Upin & Ipin Official Account with Free Stickers' },
    { id: '7Sb3j-xlAUY', ch: 'upinipin', title: 'Upin & Ipin - Luar Biasa (Official Music Video)' },
    { id: 'E4R_e9bkLgg', ch: 'upinipin', title: 'Upin & Ipin Musim 12 - Untuk Prestasi (Full Episode)' },
    { id: 'JTagRU66Kg4', ch: 'upinipin', title: 'Cara Mengambil Wudhu & Azan Maghrib - Upin & Ipin Musim 11' },
    { id: 'Yqrt6HPoRQY', ch: 'upinipin', title: 'Upin & Ipin Musim 10 - Aku Sebuah Jam HD (Full Episode)' },
    { id: 'qFX65RVb5X8', ch: 'upinipin', title: 'Upin & Ipin- Bahaya Jerebu [Full Episod]' },
    { id: 'mOnFHqfDD1E', ch: 'upinipin', title: 'Upin & Ipin - Pengembala dan Biri-Biri [Music Video]' },
    { id: 'r2lij3HObuM', ch: 'upinipin', title: 'Upin & Ipin - Ultraman Ribut [Eng/Jap Sub]' },
    { id: '-ubMdTHfxko', ch: 'upinipin', title: 'Upin & Ipin - Ibu Ayam Dikejar Musang [Sing-Along][HD]' },
    { id: 'h2D0zpcwuhg', ch: 'upinipin', title: 'Upin Ipin - Chinese New Year Promo' },
    { id: 'UJX3PRaG3Yo', ch: 'upinipin', title: 'Upin & Ipin Musim 15 - Angin (Full Episode)' },
    { id: 'ZYMI8adms7c', ch: 'upinipin', title: 'Upin & Ipin Musim 18 - Minyak Sawit (Full Episode)' },
    { id: 'KMeWW4QBfdA', ch: 'upinipin', title: 'Menari & Menyanyi Bersama Upin & Ipin' },
    { id: 'Oq-XABOTF4E', ch: 'upinipin', title: 'Upin & Ipin - Boria Suka-Suka [Sing-Along]' },
    { id: 'vJrkwEv2dys', ch: 'upinipin', title: 'Upin & Ipin - Amal Jariah (Full Episode)' },
    { id: '2Pd6zdl-il4', ch: 'upinipin', title: 'Upin & Ipin Musim 17 - Irama Raya (Full Song Episode)' },
    { id: 'iDhlqk0cx9s', ch: 'upinipin', title: 'Upin & Ipin - Beli, Pakai, Suka (Full Episode)' },
    { id: 'Y4kSNuCDQxU', ch: 'upinipin', title: 'Upin & Ipin Musim 11 - Hapuskan Virus! (Full Episode)' },
    { id: 'I1v-J32r9y8', ch: 'upinipin', title: 'Upin & Ipin - Kompang Dipalu (Sing -Along)' },
    { id: 'ST0b5RDuETQ', ch: 'upinipin', title: 'Upin & Ipin Musim 15 - Rajin Menyimpan Bijak Belanja [Episod Penuh]' },
    { id: '9Ur_XXG9iDw', ch: 'upinipin', title: 'Kompilasi Upin & Ipin Musim 17' },
    { id: 'pdNWPtBzNXk', ch: 'upinipin', title: 'Upin & Ipin Musim 10 - Pesta Cahaya (Full Episode)' },
    { id: 'zM78QaUshxE', ch: 'upinipin', title: 'Upin & Ipin Ramadan Raya - Full Episode' },
    { id: 'ZuXZRehfuNE', ch: 'upinipin', title: 'Lagu 12 Bulan Islam - Upin & Ipin Sinar Syawal' },
    { id: '5LtleKBSwR8', ch: 'upinipin', title: 'Upin & Ipin Musim 16 - Lindung Diri Dan Keluarga (Episod Penuh)' },
    { id: 'G3jDdVuL890', ch: 'upinipin', title: 'Upin & Ipin Musim 14 : Ragam Ramadan (Episod Penuh)' },
    { id: 'Sr0ZmSgAhGA', ch: 'upinipin', title: 'Upin & Ipin Fun Run 2026 (Video Promo 02)' },
    { id: '9uzi_NPBsEA', ch: 'upinipin', title: 'Upin & Ipin Musim 20 - Kasut Batik (Episod Baru)' },
    { id: 'UAwn-xmYLuw', ch: 'upinipin', title: 'Upin & Ipin - Pusat Ramalan dan Amaran Banjir Negara (PRABN)' },
    { id: 'DGnBLzlEu_8', ch: 'upinipin', title: 'Jawapan Carian Nombor 20 - Ayam Goreng Mail Mendunia' },
    { id: 'AkDwG_lersA', ch: 'upinipin', title: 'Upin & Ipin Fun Run 2026 (Video Promo)' },
    { id: '3ZKzGJNScgw', ch: 'upinipin', title: 'Upin & Ipin Musim 20 - Ayam Goreng Mail Mendunia (Episod Baru)' },
    { id: 'KbA6v5j8fqs', ch: 'upinipin', title: 'Jawapan Carian Nombor 20 - Minyak Sawit Luar Biasa' },
    { id: 'WS2Mo_1npHQ', ch: 'upinipin', title: 'Perlawanan Bola Sepak LCFC VS Team Amir Masdi' },
    { id: '_TK9CXJ-cD8', ch: 'upinipin', title: 'Di Sebalik Tabir : Rakaman Suara bersama Hideko' },
    { id: 'DKmIvzxFvKw', ch: 'upinipin', title: 'Upin & Ipin Musim 20 - Minyak Sawit Luar Biasa (Full Episode)' },
    { id: 'm2NFBb90T04', ch: 'upinipin', title: 'Soalan Kuiz Upin & Ipin - Motor Kapcai (Musim 16)' },
    { id: 'vgGVttmf7uc', ch: 'upinipin', title: 'Pelakon Suara Hideko - Upin & Ipin Musim 20' },
    { id: 'wS0U9e0Mlo8', ch: 'upinipin', title: 'Upin & Ipin Musim 20 - Minyak Sawit Luar Biasa (Episod Baru)' },
    { id: 'qMMwwji1IuU', ch: 'upinipin', title: 'Legasi Kuasa (Music Video)' },
    { id: 'j5CCK3xmtn0', ch: 'upinipin', title: 'Lawatan Menteri Komunikasi YB Datuk Fahmi Fadzil ke Les\' Copaque Production' },
    { id: 'KhFy8qd3z5Q', ch: 'upinipin', title: 'Konvokesyen Les\' Copaque Animation Academy (LCAA) ke 3' },
    { id: 'dbxrEuD-Zec', ch: 'upinipin', title: 'Di Sebalik Tabir : Legasi Kuasa' },
    { id: 'xJtG_o-aZEc', ch: 'upinipin', title: 'Legasi Kuasa (Di Sebalik Tabir) - Lepak @ Les\' Copaque Podcast' },
    { id: '6s-sWW4Y_6I', ch: 'upinipin', title: 'Legasi Kuasa - Official Trailer' },
    { id: '5nBdiqX1KvA', ch: 'upinipin', title: 'Soalan Kuiz Upin & Ipin - Sahabat Baik Abah (Musim 19)' },
    { id: 'lUZWP6CIyA0', ch: 'upinipin', title: 'Jawapan Carian Nombor 20 - Kembara Sambil Belajar' },
    { id: 'Sf62KMK6wrQ', ch: 'upinipin', title: 'Upin & Ipin Musim 20 - Kembara Sambil Belajar (Episod Baru)' },
    { id: 'VE0h-CDh6Uw', ch: 'upinipin', title: 'Pelakon Suara Susanti - Upin & Ipin Musim 20' },
    { id: 'PqDNoUOWJSQ', ch: 'upinipin', title: 'Soalan Kuiz Upin & Ipin - Wira Minyak Sawit (Musim 19)' },
    { id: 'IWb8uWVTX3g', ch: 'upinipin', title: 'Kompilasi Upin & Ipin Musim 15' },
    { id: 's_OPPeAtAvI', ch: 'upinipin', title: 'Di Sebalik Tabir : Storyboard Department Upin & Ipin Musim 20' },
    { id: 'iiTXXMOBSD8', ch: 'upinipin', title: 'Kompilasi Episod Cameo - Upin & Ipin Musim 5 - 19' },
    { id: 'DjBO98auack', ch: 'upinipin', title: 'Upin & Ipin - Basikal Baru (Full Episode)' },
    { id: 'R5EkUauE76I', ch: 'upinipin', title: 'Upin & Ipin - Susu Luar Biasa (Full Episode)' },
    { id: 'fmcf1-Efmn4', ch: 'upinipin', title: 'Di Sebalik Tabir : Compositing Department Upin & Ipin Musim 20' },

    // EJEN ALI
    { id: 'Q_Chhcgwcms', ch: 'ejenali', title: 'Misi Susu' },
    { id: 'Qt8kfgolt8Q', ch: 'ejenali', title: 'Ejen Ali Episod 1 - Misi : IRIS' },
    { id: 'KRzRacODEUk', ch: 'ejenali', title: 'Ejen Ali Episod 10 - Misi: Atlas' },
    { id: '1MhV91m5UA0', ch: 'ejenali', title: 'Ejen Ali (Episod 4 Bhg 2) - Misi : COMOT' },
    { id: 'TOTv3tI-gyE', ch: 'ejenali', title: 'Ejen Ali Episod 2 - Misi: Orientasi' },
    { id: 'iKOQzfxOESA', ch: 'ejenali', title: 'EJEN ALI MISI: JUANG (Animasi Pendek)' },
    { id: 'nu4oZtGuZKo', ch: 'ejenali', title: 'Ejen Ali Episod 12 - Misi: Diez' },
    { id: 'JxdfMhB79ik', ch: 'ejenali', title: 'Ejen Ali Episod 4 - Misi: COMOT' },
    { id: 'BGRAGH2ycfM', ch: 'ejenali', title: 'Ejen Ali - Musim 2 (EP06) - Misi : SUSU [Bahagian 3]' },
    { id: 'rJNMMEltQC4', ch: 'ejenali', title: 'Ejen Ali Episod 13 - Misi: Legasi' },
    { id: 'y8aYfgYF3a0', ch: 'ejenali', title: 'Ejen Ali Episod 8 - Misi: Tujuan' },
    { id: 'VGpp-c5BB-w', ch: 'ejenali', title: 'Ejen Ali Episod 11 - Misi: Harapan' },
    { id: 'CLldY3Hf_6M', ch: 'ejenali', title: 'Ejen Ali Episod 9 - Misi: Peranan' },
    { id: '0g5G_gbcNNc', ch: 'ejenali', title: 'Ejen Ali Episod 13 - Misi: Override' },
    { id: 'kRfuLhdHrXM', ch: 'ejenali', title: 'Ejen Ali Episod 2 - Misi : ALPHA' },
    { id: 'kq8COX-O_ac', ch: 'ejenali', title: 'Ejen Ali Musim 2 (EP12) - Misi : Diez [Bahagian 3]' },
    { id: 'WIz3G_hqTKE', ch: 'ejenali', title: 'Ejen Ali Episod 3 - Misi: Main' },
    { id: 'f2MHyRjpt64', ch: 'ejenali', title: 'Ejen Ali Episod 7 - Misi: Kembali' },
    { id: 'rsq-PXBmskk', ch: 'ejenali', title: 'Ejen Ali Musim 2 (EP13) - Misi : Legasi [Bahagian 1]' },
    { id: 'BQXcQxXJhbk', ch: 'ejenali', title: 'Ejen Ali Episod 5 - Misi: Cabar' },
    { id: 'Kf-qnHMpGug', ch: 'ejenali', title: 'Ejen Ali Episod 1 - Misi: Akademi' },
    { id: '6X6u0ASVBJo', ch: 'ejenali', title: 'MISI : RAYA \'17' },
    { id: 'soXg5pJ9vIA', ch: 'ejenali', title: 'Ejen Ali Episod 6 - Misi: Susu' },
    { id: 'WL2cmsh-AJI', ch: 'ejenali', title: 'Ejen Ali (Episod 10 Bhg 1) - Misi : SENSASI' },
    { id: 'sV6wJmO29fs', ch: 'ejenali', title: 'Ejen Ali Musim 2 (EP10) - Misi : Atlas [Bahagian 1]' },
    { id: 'p769WH_pXdw', ch: 'ejenali', title: 'Ejen Ali Episod 3 - Misi : SERI' },
    { id: 'LKWL4FT1YOU', ch: 'ejenali', title: 'Selamat Hari Malaysia!' },
    { id: 'lNIPwQP_LMg', ch: 'ejenali', title: 'EJEN ALI THE MOVIE - MAMAK MAJU, SERVICE LAJU!' },
    { id: '_AgPE0O_vp8', ch: 'ejenali', title: 'Ejen Ali (Episod 4 Bhg 3) - Misi : COMOT' },
    { id: 'EBsqmFBisgc', ch: 'ejenali', title: 'Ejen Ali Musim 2 (EP13) - Misi : Legasi [Bahagian 2]' },
    { id: 'Fbf1IZUuHgE', ch: 'ejenali', title: 'Ejen Ali × Spritzer Tinge' },
    { id: 'RfWyzNbcGu4', ch: 'ejenali', title: 'HAPPY 10th ANNIVERSARY EA!🎉' },
    { id: 'rRVgCUvuxE8', ch: 'ejenali', title: '⚡ MISI BIJAK TENAGA BERSAMA EJEN ALI & JERO ⚡' },
    { id: 'pK32GhMk7-I', ch: 'ejenali', title: 'Ejen Ali x Belanjawan 2026' },
    { id: '1mnIN5tyAiE', ch: 'ejenali', title: 'Some Other Day | FUGŌ | Official Music Video OST Ejen Ali The Movie 2' },
    { id: '1iIkVsAxxIY', ch: 'ejenali', title: 'PENEBUSAN ANTARA DIMENSI | EPISODE 6 | EJEN ALI | GARDENIA | DATO AZIZUL HASNI AWANG' },
    { id: 'los4zx2C43g', ch: 'ejenali', title: 'HANYA KAMU | M. NASIR | OFFICIAL MUSIC VIDEO OST EJEN ALI THE MOVIE 2' },
    { id: 'f7hsZj271VM', ch: 'ejenali', title: 'PENJUARA (CLIP) | HAEL HUSAINI | Undi di MUZIK MUZIK 40 sekarang!' },
    { id: 'qSYoSXF7ab8', ch: 'ejenali', title: 'PENJUARA | HAEL HUSAINI | OFFICIAL MUSIC VIDEO OST EJEN ALI THE MOVIE 2' },
    { id: '8CI90_ugHxU', ch: 'ejenali', title: 'PENEBUSAN ANTARA DIMENSI | EPISODE 5 | EJEN ALI | GARDENIA | DATO AZIZUL HASNI AWANG' },
    { id: 'AxjfY85cv5w', ch: 'ejenali', title: 'PENEBUSAN ANTARA DIMENSI | EPISODE 4 | EJEN ALI | GARDENIA | DATO AZIZUL HASNI AWANG' },
    { id: 'JPcv-6blP18', ch: 'ejenali', title: 'PENEBUSAN ANTARA DIMENSI | EPISODE 3 | EJEN ALI | GARDENIA | DATO AZIZUL HASNI AWANG' },
    { id: 'x5PcavR1KKo', ch: 'ejenali', title: '⚡MISI BIJAK TENAGA BERSAMA EJEN ALI DAN JERO⚡' },
    { id: 'NB0MvkXNOeg', ch: 'ejenali', title: 'PENEBUSAN ANTARA DIMENSI | EPISODE 2 | EJEN ALI | GARDENIA | DATO AZIZUL HASNI AWANG' },
    { id: 'c_EB4Fnnmn0', ch: 'ejenali', title: 'Some Other Day | FUGŌ | Video Lirik OST Ejen Ali The Movie 2' },
    { id: 'yaz0-_3JlrI', ch: 'ejenali', title: 'PENJUARA | HAEL HUSAINI | VIDEO LIRIK OST EJEN ALI THE MOVIE 2' },
    { id: 'EpHWlwG-jCc', ch: 'ejenali', title: 'Teman Sejati | NIDJI | OST Klip dari Ejen Ali The Movie 2' },
    { id: '_cpj3xAWuf0', ch: 'ejenali', title: 'THE MAKING OF | EJEN ALI THE MOVIE 2 | MISI : SATRIA' },
    { id: 'EKqQug2Ph_s', ch: 'ejenali', title: 'EJEN ALI THE MOVIE 2 | Dibawakan khas oleh Gardenia, sentiasa bersamamu!' },
    { id: 'k-CYCHwEjGM', ch: 'ejenali', title: '✨Perutusan khas Hari Guru 2025 dari Chief Ejen Prime YAB Dato\' Seri Anwar Ibrahim bersama Ejen Ali ✨' },
    { id: '3ct2PKB1E3U', ch: 'ejenali', title: 'PENEBUSAN ANTARA DIMENSI | EPISODE 1 | EJEN ALI | GARDENIA | DATO AZIZUL HASNI AWANG' },
    { id: 'N3CzCAs73RI', ch: 'ejenali', title: 'Ejen Ali x TGV PSA | ETIKA MENONTON WAYANG 📽' },
    { id: 'OWO4broZ9Bk', ch: 'ejenali', title: 'Ejen Ali x GSC PSA' },
    { id: '5nD1LWmAeKc', ch: 'ejenali', title: 'Ejen Ali The Movie 2 | Misi : Satria | Official Trailer #2' },
    { id: 'hgFSFo2Mkwc', ch: 'ejenali', title: 'Gardenia dan Ejen Ali | Misi : Penebusan Antara Dimensi - Teaser' },
    { id: 'F9w03TOLbcM', ch: 'ejenali', title: 'Ejen Ali The Movie 2 | Misi : Satria | Official Trailer #1' },
    { id: 'q9auLha55ws', ch: 'ejenali', title: 'Hanya Kamu - Dato M.Nasir | OST Ejen Ali The Movie 2' },
    { id: 'JAB2uPqCQto', ch: 'ejenali', title: 'Ejen Ali The Movie Rerun & Adegan Eksklusif Ejen Ali The Movie 2 | PROMO' },
    { id: 'r_g0PV3595o', ch: 'ejenali', title: 'Ejen Ali The Movie 2 - Official Teaser Trailer #2' },
    { id: 'ZqvGhb5hwY0', ch: 'ejenali', title: 'Ejen Ali The Movie 2 - Official Teaser Trailer #1' },

    // DIDI & FRIENDS
    { id: 'Gwo9y3IoSUc', ch: 'didi', title: 'Police Cars | Fun Family Song | Didi & Friends Song for Children' },
    { id: 'tpTAHSSbspQ', ch: 'didi', title: 'Sleepy Mummy | Fun Family Song | Didi & Friends Songs for Children' },
    { id: 'NFm6koXdyv4', ch: 'didi', title: 'Didi Rescue Squad: Fire Truck | Fun Family Song | Didi & Friends Song for Children' },
    { id: 'kwJVMm4wC-Y', ch: 'didi', title: 'Didi Rescue Squad: Ambulance | Fun Family Song | Didi & Friends Song for Children' },
    { id: 'ObKeri2yOKc', ch: 'didi', title: 'ABCs | Nursery Rhymes & Kids Songs | Didi & Friends English' },
    { id: 'MmO8qM_duZg', ch: 'didi', title: 'AEIOU Song | Vowel Song | ABC Learning | Didi & Friends Songs for Children' },
    { id: 'snSIh59KeGs', ch: 'didi', title: 'Twinkle Twinkle Little Star | +More Best Nursery Rhymes & Kids Songs | Didi & Friends English' },
    { id: 'OT8B_LlwY0k', ch: 'didi', title: 'Hello Giant | Fun Family Song | Didi & Friends Songs for Children' },
    { id: 'L3OBiy2Gzuc', ch: 'didi', title: 'Didi Rescue Squad: Submarine | Fun Family Song | Didi & Friends Song for Children' },
    { id: '_Ghf1X98jrk', ch: 'didi', title: 'Learning Aphabets and Numbers for Kids | Learning with Didi & Friends' },
    { id: 'Tc2S3OtEVvI', ch: 'didi', title: 'The Wheels On The Bus | Nursery Rhymes & Kids Songs | Didi & Friends English' },
    { id: '8lBZ5Jg_ZDI', ch: 'didi', title: 'Didi Rescue Squad: Helicopter | Fun Family Song | Didi & Friends Song for Children' },
    { id: 'CdzuaTMDgWI', ch: 'didi', title: 'Sad To Be Lonely | Fun Family Song | Didi & Friends Songs for Children' },
    { id: 'wRR0co0gPlo', ch: 'didi', title: 'Zombie Dance | Fun Nursery Rhymes | Didi & Friends Songs for Children' },
    { id: '8ufHV1DYcM4', ch: 'didi', title: 'Didi & Friends Rescue Squad |My Belly!| Didi & Friends in English' },
    { id: 'OrrLx3fudPs', ch: 'didi', title: 'Didi & Friends Rescue Squad | The Elevator\'s Broken | Didi & Friends in English' },
    { id: 'WSoII9xrMBo', ch: 'didi', title: 'Ninja Run | Fun Family Song | Didi & Friends Song for Children' },
    { id: 'LDhCe8YAH_I', ch: 'didi', title: 'Didi & Friends | Nursery Rhymes and Kids Songs | Ambulance, Fire Truck, Helicopter' },
    { id: 'vQhmr8pvN8E', ch: 'didi', title: 'Didi & Friends | Fun and educational | Nursery Rhymes' },
    { id: 'E5ylFaUqsCc', ch: 'didi', title: 'Even I Know That | Sarah Suhairi X Hitz Morning Crew X Didi & Friends' },
    { id: 'H_i2WWLsSYo', ch: 'didi', title: 'Nursery Rhymes & Kids Songs Compilation | Didi & Friends English | Here Comes Mon' },
    { id: 'NkjAD1b7914', ch: 'didi', title: 'Sleepy Mummy | Kids Dance Music | Didi & Friends Kids Songs to Dance' },
    { id: 'AJ-_YfiRqPc', ch: 'didi', title: 'Fight Coronavirus Song for Children | Fun Family Song | Didi & Friends Song for Children' },
    { id: 'tljADh4BxCk', ch: 'didi', title: 'Didi Rescue Squad: Ambulance, Helicopter, Submarine, Fire Truck Songs | Nursery Rhymes' },
    { id: 'o4jvDWLbU-4', ch: 'didi', title: 'Three Princesses | Nursery Rhymes Compilation | Didi & Friends English' },
    { id: 'qkFuJUmN8sE', ch: 'didi', title: 'Monster Shark | Fun Family Song | Didi & Friends Songs for Children' },
    { id: 'nF2U6k1krDk', ch: 'didi', title: 'Thank You | Fun Family Song | Didi & Friends Songs for Children' },
    { id: 'VV3ZQ_ik1yc', ch: 'didi', title: 'I Love Swimming | Fun Family Song | Didi & Friends Song for Children' },
    { id: '4Vhth5cKdUk', ch: 'didi', title: 'Didi & Friends Rescue Squad | There\'s A Scorpion | Didi & Friends in English' },
    { id: 'qxuNC8aNRbQ', ch: 'didi', title: 'Pirate Jam | Scary Nursery Rhymes | Didi & Friends Songs for Children' },
    { id: 'm7_uwmnEWJY', ch: 'didi', title: 'Didi & Friends | Good Values & Positive Lessons' },
    { id: 'q2mBy5JW-VY', ch: 'didi', title: 'Season 1 Music Marathon | Didi & Friends' },
    { id: 'w_Ao8HeEPXg', ch: 'didi', title: 'Let\'s Go Back To School! Nursery Rhymes | Compilation | Didi & Friends in English' },
    { id: '2kXEgwImVXY', ch: 'didi', title: 'Nursery Rhymes | Didi & Friends: Ultimate Season 1 Song Compilation | Didi & Friends in English' },
    { id: 'BS721BcYDjo', ch: 'didi', title: 'Nursery Rhymes | Didi Celebrate the Post-Olympic Spirit of France 2024 | Didi & Friends in English' },
    { id: 'Yi4sEyNkTF0', ch: 'didi', title: 'A Landslide part 2! | Didi And Friends Rescue Squad | Didi & Friends in English' },
    { id: '5TizIExM67U', ch: 'didi', title: 'A Landslide Part 1 | Didi & Friends Rescue Squad | Didi & Friends in English' },
    { id: 'I8xp7nzqOcM', ch: 'didi', title: 'A Bus Accidents! | Didi & friends Rescue Squad | Didi & Friends in English' },
    { id: 'rLP7BY1wCgI', ch: 'didi', title: 'The Virus Has Spread |Didi & Friends Rescue Squad | Didi & Friends in English' },
    { id: '1M_cygQDTuc', ch: 'didi', title: 'Didi & Friends Rescue Squad | Happy Bear\'s Lost! i & Friends in English' },
    { id: 'ZMrk7H54rUo', ch: 'didi', title: 'Didi & Friends Kembara Muzikal English Version |Now on CERIA | Didi & Friends in English' },
    { id: 'ahyUg0BqMJA', ch: 'didi', title: 'Didi & Friends Rescue Squad | A baby\'s Falling | Didi & Friends in English' },
    { id: 'MobGDQp3UEg', ch: 'didi', title: 'Didi & Friends Rescue Squad | I\'m Trapped | Didi & Friends in English' },
    { id: 'PdQ_inX0pac', ch: 'didi', title: 'Didi & Friends Rescue Squad | Bee Attack | Didi & Friends in English' },
    { id: 'YJ9vpBNsZCc', ch: 'didi', title: 'Nursery Rhymes | 30 Minutes of Fun! Didi & Friends Animal Themed Songs | Didi & Friends in English' },
    { id: '-EGbr3OGBM4', ch: 'didi', title: 'Didi & Friends Rescue Squad | I\'m Stuck! | Didi & Friends in English' },
    { id: 'ieMXOP6GhMc', ch: 'didi', title: 'Didi & Friends Rescue Squad | Tia\'s fallen! | Didi & Friends in English' },
    { id: 'nVkTuUomZNQ', ch: 'didi', title: 'Didi & Friends Rescue Squad | I Can\'t Get Down | Didi & Friends in English' },
    { id: 'xVVVtcTSw00', ch: 'didi', title: 'Didi & Friends Rescue Squad | Papa Bear\'s Choking! | Didi & Friends in English' },
    { id: 'MQ1kVt0fGs0', ch: 'didi', title: 'Didi & Friends Rescue Squad | Fire! Fire! | Didi & Friends in English' },
    { id: 'aUnDUbVfnag', ch: 'didi', title: '30 minutes of Learning & Laughter Blast! Didi & Friends\' BEST Nursery Rhymes (Season 1)' },
    { id: 'VdGqrbuLWdE', ch: 'didi', title: 'A Special Bag | Didi & Friends Storybook | Didi & Friends English' },
    { id: '9HnbSUjVLUI', ch: 'didi', title: 'The Color Machine | Didi & Friends Storybook | Didi & Friends English' },
    { id: 'AA1N7-OeSwQ', ch: 'didi', title: 'Let\'s Find the Dinosaur | Didi & Friends Play and Learn' },
    { id: 'oPJiegifWxc', ch: 'didi', title: 'Didi & Friends Played with a Cat | Didi & Friends Play and Learn' },
    { id: 's1Paf9goC_c', ch: 'didi', title: 'Didi & Friends Played with a Volcano Experiment | Didi & Friends Play and Learn' },
    { id: '_cxIiRsk3dQ', ch: 'didi', title: 'Didi & Friends English Nursery Rhymes & Kids Songs | Coming Soon!' },
    { id: '8iGfuoT5A9M', ch: 'didi', title: 'Twinkle Twinkle Little Star | Nursery Rhymes| Kids Songs | Didi & Friends English' },
    { id: 'sNPI-BZFqKE', ch: 'didi', title: 'Itsy Bitsy Spider | +More Popular Nursery Rhymes & Kids Songs | Didi & Friends English' },
    { id: 'LrFrLmzr_HU', ch: 'didi', title: 'Old McDonald Has A Farm | +More Kids Songs | Old MacDonald Had A Farm | Didi & Friends English' },

    // DURIOO+ (Little Ammar & Mina Mila)
    { id: 'YOOQ_hCiCjs', ch: 'durioo', title: 'The Makers of Omar & Hana - Little Ammar - Time for School COMPILATION | Durioo+' },
    { id: 'httdTL7b0Lc', ch: 'durioo', title: '🌙 Little Ammar | Allahuakbar Prayer Time 🤲 Calm Faith Moments | Durioo The Makers Of Omar & Hana' },
    { id: 'HBFLyCHn964', ch: 'durioo', title: 'Love The Quran 🤍 Little Ammar’s Beautiful Journey | Durioo+ The Makers Of Omar & Hana' },
    { id: '2ZTr7ZwIAjw', ch: 'durioo', title: 'Little Ammar Takes His Medicine 💊 | Doctor Time | Durioo+ | The Makers of Omar & Hana' },
    { id: 'BX-53T6hEc4', ch: 'durioo', title: '🌟 Little Ammar: Peekaboo! Compilation | From the Makers of Omar & Hana | Durioo+' },
    { id: 'mvrtGfwY5LM', ch: 'durioo', title: 'The Makers of Omar & Hana - Little Ammar - Summer Holiday compilation | Durioo+' },
    { id: 'hsJ_G80wdGE', ch: 'durioo', title: 'The Happiest Eid Ever! 🎉 Little Ammar Celebrates Eid Mubarak | From the Makers of Omar & Hana' },
    { id: 'B6z2_A_nM5M', ch: 'durioo', title: '🚪 Little Ammar | Knock Knock! Who’s There? 😲 Fun Surprise Time | Durioo The Makers Of Omar & Hana' },
    { id: 'arp2zK1hUmM', ch: 'durioo', title: 'Say Thank You 🤍 Little Ammar Learns Gratitude | Durioo+ The Makers Of Omar & Hana' },
    { id: 'l9IhIyrUfmk', ch: 'durioo', title: 'Ramadan Is Coming 🌙 Little Ammar’s Surprise | Durioo+ The Makers Of Omar & Hana' },
    { id: 'nU6Wl7wwG8E', ch: 'durioo', title: '🌙 Little Ammar - Lets Learn Good Habits! ✨ | From the Makers of Omar & Hana | Durioo+' },
    { id: '4raO2aSsmFc', ch: 'durioo', title: '🌙 Little Ammar - Lets Count Our Days till Ramadhan ✨ | From the Makers of Omar & Hana | Durioo+' },
    { id: 'P82hboKGuPE', ch: 'durioo', title: '🍩 Little Ammar 🎬 Lets Bake! 60 Minutes Compilation | Durioo+' },
    { id: 'X9Dh9vNcpSE', ch: 'durioo', title: '🌟 Little Ammar: Fun Time at School! Compilation | From the Makers of Omar & Hana | Durioo+' },
    { id: 'zIG0SkFHPmw', ch: 'durioo', title: 'Little Ammar Visits the Zoo! 🦁😱 What Animal Surprised Him Most? | The Makers of Omar & Hana | Durioo' },
    { id: '9upeBH5AjlQ', ch: 'durioo', title: 'Is Little Ammar Ready for School?! 🎒😱 The Makers Of Omar & Hana | Durioo' },
    { id: 'Eot9xKXcBMM', ch: 'durioo', title: 'The Makers of Omar & Hana | Little Ammar | ALLAHUL KAFI 1 HOUR Durioo+ School Performance | Friends' },
    { id: 'c-hB7LLampE', ch: 'durioo', title: 'Little Ammar Together with Friends 🤝 Fun, Laughter & Friendship | Durioo The Makers Of Omar & Hana' },
    { id: 'Do42THyMkBQ', ch: 'durioo', title: 'Ammar Not Feeling Well 🤒 Little Ammar’s Sick Day Story | Durioo+ The Makers Of Omar & Hana' },
    { id: 'GUgrfWLbt74', ch: 'durioo', title: 'LOVE YOU MOM 💖 The Most Heartwarming Surprise Ever! | The Makers of Omar & Hana | Durioo' },
    { id: 'CPqXeJB0ut4', ch: 'durioo', title: 'The Makers of Omar & Hana - Little Ammar - Good Night Sleep For Kids | Durioo+' },
    { id: 'opWNDoHcwoM', ch: 'durioo', title: 'From the Creators of Omar & Hana | BACK TO SCHOOL Compilation | 95 Minutes | Little Ammar | Durioo+' },
    { id: '9KkjWwcPh9A', ch: 'durioo', title: 'First Ramadan 😱 Little Ammar’s Emotional Journey | Durioo+ The Makers Of Omar & Hana' },
    { id: 'aCEoOjfa45E', ch: 'durioo', title: '🌟 Little Ammar: Snoozy Day! Compilation | From the Makers of Omar & Hana | Durioo+' },
    { id: 'FKAwbYc02YA', ch: 'durioo', title: 'The Most Powerful Night 🌙 Little Ammar Learns About Lailatul Qadr | The Makers Of Omar & Hana|Durioo' },
    { id: 'tdUjuR1qXOU', ch: 'durioo', title: 'The Makers of Omar & Hana - Little Ammar - Sweet Tooth Compilation🎞️ | Durioo+' },
    { id: 'LAZsN4U_l8M', ch: 'durioo', title: '90 Minutes of Animal Friends in the Quran 🐾 | Little Ammar | Durioo+ from the Creators of Omar&Hana' },
    { id: 'zxQ_x5KsXmo', ch: 'durioo', title: 'Little Ammar - Meet Our Tiny Little Friend! ✨ | From the Makers of Omar & Hana | Durioo+' },
    { id: 'AmLI97WzNHc', ch: 'durioo', title: '🌸 Hello Spring! Little Ammar’s CUTEST Adventure Ever 🐝 | From the Makers of Omar & Hana | Durioo' },
    { id: 'fuVqFMbsChg', ch: 'durioo', title: '🌟 Little Ammar: Let’s Pray! Compilation | From the Makers of Omar & Hana | Durioo+' },
    { id: '92CFcqTcFqI', ch: 'durioo', title: 'Let\'s Ride With Ammar 🚴‍♂️🔥 The Makers of Omar & Hana | Durioo' },
    { id: 'Ot2StXaEv4Y', ch: 'durioo', title: 'Let’s Dance with Little Ammar! 💃✨ The Fun Begins Now | The Makers of Omar & Hana | Durioo' },
    { id: 'L6qW5HYUB9w', ch: 'durioo', title: 'The Best of April with Little Ammar! 🌟Top Moments You Can’t Miss!|The Makers of Omar & Hana | Durioo' },
    { id: 'wJmBkiHIWgc', ch: 'durioo', title: 'Little Ammar Zikr Symphony 🎶|A Peaceful & Beautiful Islamic Journey|The Makers of Omar & Hana|Durioo' },
    { id: 'KqszQCfFxwI', ch: 'durioo', title: 'Big Adventure with Little Ammar 🌍✨ | From the Makers of Omar & Hana | Durioo' },
    { id: 'DzM9cOWbags', ch: 'durioo', title: 'Astaghfirullah! Say No to Brain Rot 🚫 | Little Ammar | From the Makers of Omar & Hana | Durioo' },
    { id: '35O0iuvi-Mw', ch: 'durioo', title: 'New Episode | Little Ammar Loves Food! 😍 What’s His Favorite? | Durioo | The Makers Of Omar & Hana' },
    { id: 'yP-wjoJY_p8', ch: 'durioo', title: 'The Best Eid With Friends Ever! 🎉 | Little Ammar | From the Makers of Omar & Hana | Durioo' },
    { id: 'V5cWrK4CFwg', ch: 'durioo', title: 'Ramadan Night Fun 🌙 Let’s Tarawih With Little Ammar | Durioo+ The Makers Of Omar & Hana' },
    { id: 'cC4ewDQ3mEY', ch: 'durioo', title: 'Get Ready for Ramadan 🌙✨Little Ammar Prepares for the Holy Month | Durioo+ The Makers Of Omar & Hana' },
    { id: 'zD_IpfjaMQc', ch: 'durioo', title: '🌙 Little Ammar - Peaceful Bedtime 😴💤 | From the Makers of Omar & Hana | Durioo+' },
    { id: '_it7YpGpdAY', ch: 'durioo', title: '🌙 Little Ammar - Into The Wild! ✨ | From the Makers of Omar & Hana | Durioo+' },
    { id: 'xro0pvFmyy8', ch: 'durioo', title: 'Little Ammar - Best of 2025 ✨ | From the Makers of Omar & Hana | Durioo+' },
    { id: 'NAbVE1toA8s', ch: 'durioo', title: 'Little Ammar: Morning Routine | Islamic Nursery Rhymes for Kids' },
    { id: 'bXzzG55fAuc', ch: 'durioo', title: 'Little Ammar: Tiny Friends in Al-Quran | Islamic Nursery Rhymes for Kids' },
    { id: 'rZyQwAQNUUc', ch: 'durioo', title: 'Little Ammar: 25 Prophets | Islamic Nursery Rhymes for Kids' },
    { id: 'NPhonhhxkj0', ch: 'durioo', title: 'Little Ammar: Al-Fatihah | Islamic Quran Recital for Kids' },
    { id: 'rqEG-Rj2pJ0', ch: 'durioo', title: 'Little Ammar: Our Lord is Allah | Islamic Nursery Rhymes for Kids' },
    { id: 'SeqSxaPxUEk', ch: 'durioo', title: 'Little Ammar: Baby Finger | Islamic Nursery Rhymes for Kids' },
    { id: '6hLH8a8iyo8', ch: 'durioo', title: 'Little Ammar: Dua For Soleh Children | Islamic Dua for Kids' },
    { id: '1KjdVbni9E8', ch: 'durioo', title: 'Little Ammar: Wheels On The Bus | Islamic Nursery Rhymes for Kids' },
    { id: 'iGq8QQHxmVM', ch: 'durioo', title: 'Little Ammar: Dua Before and After Sleep | Islamic Nursery Rhymes for Kids' },
    { id: 'QGMmKO0MY3s', ch: 'durioo', title: 'Little Ammar: If You Are Happy | Islamic Nursery Rhymes for Kids' },
    { id: 'QZcJ2bVquj8', ch: 'durioo', title: 'Little Ammar: Hugs Hugs | Islamic Nursery Rhymes for Kids' },
    { id: 'ARP0gf1AQn0', ch: 'durioo', title: 'Little Ammar: Twinkle Twinkle | Islamic Nursery Rhymes for Kids' },
    { id: 'SRQUKWw-QTA', ch: 'durioo', title: 'Little Ammar: Marhaban Ya Ramadan Song | Islamic Nursery Rhymes for Kids' },
    { id: 'Lf8bZriH4mo', ch: 'durioo', title: 'Little Ammar: If You\'re Happy - Islamic Version | Islamic Nursery Rhymes for Kids' },
    { id: 'qUosW4A4SvA', ch: 'durioo', title: 'Little Ammar: Hijaiyah Letters | Learn Arabic for Kids' },
    { id: 'sbf4IXRoYfE', ch: 'durioo', title: 'Little Ammar: Allahuakbar | Islamic Bursery Rhymes for Kids' },
    { id: 'Jam5OanJpbA', ch: 'durioo', title: 'Little Ammar: Fruit Ranger | Islamic Nursery Rhymes for Kids' },
    { id: 'whk0zVjtZ80', ch: 'durioo', title: '“Mina Mila Back to School! 🎒 Cute Morning Rush & Funny Moments!” The Makers of Omar & Hana | Durioo+' },
    { id: 'HpxXhNtwaVM', ch: 'durioo', title: '💖Mina Mila🎞️Allah Is With You🤍A Beautiful Reminder for Every Heart The Makers of Omar & Hana Durioo+' },
    { id: 'P2aGUVANuRs', ch: 'durioo', title: '🍰 Kids Cartoon | Mina & Mila 🎞️ Sweet Treats Time! | From the Makers of Omar & Hana | Durioo+' },
    { id: 'py9n8sLiiWg', ch: 'durioo', title: 'New Episode ! We’re Lost! 😱 Mina Mila Need Help | From the Makers of Omar & Hana | Durioo' },
    { id: 's2IQifq4eDk', ch: 'durioo', title: 'Alhamdulillah, First Fast 🌙 Mina Mila’s Beautiful Ramadan Moments | Durioo The Makers Of Omar & Hana' },
    { id: 'cOBTpZg7Iyw', ch: 'durioo', title: '😱 Mina Mila | Guess The Guest! Who’s Here Today? | Durioo+ The Makers Of Omar & Hana' },
    { id: 'TN0AzEHcmsI', ch: 'durioo', title: '👗 Kids Cartoon | Mina & Mila 🎞️Dress Up! | From the Makers of Omar & Hana | Durioo+' },
    { id: 'ZYo_Fui3iNo', ch: 'durioo', title: 'Mina Mila: Be Careful with Online Friends! 👀✨| From the Makers of Omar & Hana | Durioo' },
    { id: '8SOnBxqrII0', ch: 'durioo', title: '👗Mina Mila 🎞️ Playtime Dress Up! 😍 Outfit Changes & Cute Reactions! Durioo+The Makers of Omar & Hana' },
    { id: '6ud9mVWkmgM', ch: 'durioo', title: 'Mina Mila Beautiful Du\'a! ✨ Family Fun by Durioo & The Makers of Omar & Hana | Watch Together!' },
    { id: 'Fgim5LyeSO0', ch: 'durioo', title: 'Mina Mila 🎒 Daily Routine Fun! From Morning to Night | Durioo+ | The Makers of Omar & Hana' },
    { id: 'fIciVLPF4aE', ch: 'durioo', title: '🤒Mina Mila🎞️Get Well Soon!💖Sweet Care, Warm Hugs & Healing Moments The Makers of Omar & Hana Durioo+' },
    { id: 'agPbqWKKQDA', ch: 'durioo', title: 'Islamic Cartoon MinaMila | Thank You Baba Compilation | The Makers of Omar & Hana | Durioo+' },
    { id: 'XIcub02sc0A', ch: 'durioo', title: 'Makers of Omar & Hana | Compilation of Mina & Mila Bedtime Story 🌙 | Durioo+' },
    { id: 'km1swovoLyw', ch: 'durioo', title: '🌟 Mina Mila🎞️Thank You, Dad! 💖A Beautiful Story of Love & Gratitude Durioo+The Makers of Omar & Hana' },
    { id: 'z37v_njhVzc', ch: 'durioo', title: '🧹 Kids Cartoon | Mina & Mila 🎞️House chore! | From the Makers of Omar & Hana | Durioo+' },
    { id: 'eCpbSK4YyKk', ch: 'durioo', title: 'Cozy Moments 🤍 Mina Mila Relax Together at Home | Durioo+ The Makers Of Omar & Hana' },
    { id: 'Mz6w7cZSIQ8', ch: 'durioo', title: 'Mina Mila Indoor Games Fun! 🏠 New from Durioo & The Makers of Omar & Hana | Family Play Time!' },
    { id: 'z-56RvvCqxk', ch: 'durioo', title: 'Prepare For School 🎒 Mina Mila Get Ready Together | Morning Routine Fun | Durioo+ Omar & Hana' },
    { id: 'KYdtkf3IEuo', ch: 'durioo', title: 'The Best Eid Gathering Ever! 🎉 Mina Mila Celebrate Together | Omar & Hana Makers | Durioo' },
    { id: 'v2zBSCSFdy8', ch: 'durioo', title: 'Mina Mila Fasting With Friends 🌙 Sweet Ramadan Moments | Durioo+ The Makers Omar & Hana' },
    { id: 'ahuSqtusPmo', ch: 'durioo', title: 'Mina Mila 🏡 Sweetest Family Moments & Fun Surprises! 💖 The Makers of Omar & Hana | Durioo' },
    { id: '0W_CC4_qZl0', ch: 'durioo', title: 'Mina Mila Celebrating our first Eid | Durioo+' },
    { id: 'kfcK1U4ZOto', ch: 'durioo', title: '🌈 Mina Mila🎞️ Mila’s Cutest Moments!😄Fun, Smiles & Happy Vibes | The Makers of Omar & Hana | Durioo+' },
    { id: '69GDBD9QH4U', ch: 'durioo', title: '👯‍♀️ Mina Mila🎞️Besties Forever!🌟The Cutest & Friendship Moments | Durioo+The Makers of Omar & Hana' },
    { id: 'mTIs9xDRh4s', ch: 'durioo', title: 'Ramadan Is Coming 😱 Mina Mila’s Big Surprise! The Makers of Omar & Hana | Durioo' },
    { id: 'e2MbGv_6CEQ', ch: 'durioo', title: 'Mina Mila 🎒 Stay Indoor | Durioo+ | The Makers of Omar & Hana' },
    { id: 'RcYa0NzIGKk', ch: 'durioo', title: '🛍️ Mina & Mila 🎞️ Holiday Sale Madness! 💸 Big Deals, Big Smiles! | Durioo+The Makers of Omar & Hana' },
    { id: 'QUWB0S8M7Kg', ch: 'durioo', title: 'Islamic Cartoon MinaMila | Lets Talk It Out Compilation | The Makers of Omar & Hana | Durioo+' },
    { id: 'T2_f1QEFSK4', ch: 'durioo', title: 'The Happiest Eid Ever! 🎉 Mina Mila Celebrate Eid Mubarak | From the Makers of Omar & Hana | Durioo' },
    { id: 'fpGXv174F4Y', ch: 'durioo', title: 'DEAR MOM 💖 You Mean Everything to Me 🥹 | Mina Mila | The Makers of Omar & Hana | Durioo' },
    { id: '1kV4qmbEtNE', ch: 'durioo', title: 'Mina Mila: Who’s Watching Us?! 👀😱 | From the Makers of Omar & Hana | Durioo' },
    { id: 'Qu2oz2TPKGg', ch: 'durioo', title: 'Mina Mila: The Best of April! 🌸✨ | Compilation | From the Makers of Omar & Hana | Durioo' },
    { id: '5CSdeg1erfE', ch: 'durioo', title: 'Mina Mila Study Time! 📝 Can You Learn with Your Favorite Twins? The Makers of Omar & Hana | Durioo' },
    { id: 'OYidVOP3U1Q', ch: 'durioo', title: 'Mina Mila: First Day Back to School! 😱🎒 | Full Episode | From the Makers of Omar & Hana | Durioo' },
    { id: 'jEml2u4uOuQ', ch: 'durioo', title: 'Mina Mila’s Big Adventure 🌈✨ | From the Makers of Omar & Hana | Durioo' },
    { id: 'ewszuuwEujo', ch: 'durioo', title: 'Astagfirullah! Mina Mila Says No to Brain Rot 🚫😱 | From the Makers of Omar & Hana | Durioo' },
    { id: 'IKgvXPzXTqA', ch: 'durioo', title: 'This Spring Blessing Hit Different 🌸 Mina Mila | The Makers of Omar & Hana | Durioo |' },
    { id: 'Y2PWT1MmHT4', ch: 'durioo', title: 'Is Tonight Lailatul Qadr? 🌙 | Mina Mila |The Makers of Omar & Hana | Durioo' },
    { id: 'BTavXHtGkS4', ch: 'durioo', title: 'Quran In Our Heart 🤍 Mina Mila’s Beautiful Story | The Makers of Omar & Hana | Durioo+' },
    { id: 'FphUEvIr9qQ', ch: 'durioo', title: 'Ready Together for Ramadan 🌙 | Mina Mila & Family | Durioo+ | The Makers of Omar & Hana' },
    { id: 'RbTM0_aByxA', ch: 'durioo', title: 'Be Kind 💛 Mina Mila Learn to Care and Share Together | Durioo+ The Makers Of Omar & Hana' },
    { id: 'C8uVq-XVGPY', ch: 'durioo', title: 'Thank You Mommy 💕 Mina Mila’s Sweet Love & Gratitude | Durioo The Makers of Omar & Hana' },
    { id: 'M78kvMZpQSo', ch: 'durioo', title: 'The Makers of Omar & Hana | Mina Mila 🎬 Family Movie Night 🌙 | Durioo+' },
    { id: 'Z6EvvdQqhlI', ch: 'durioo', title: 'Mina Mila | Always Together💕Sibling Love, Laughs & Memories | Durioo+ The Makers Of Omar & Hana' },
    { id: 'l_--cS3CXX4', ch: 'durioo', title: 'Mina & Mila: Meant to Be | Islamic Stories for Kids' },
    { id: 'Co4-rkznXlk', ch: 'durioo', title: 'Mina & Mila: It\'s Mine | Islamic Stories for Kids' },
    { id: '0hFCwYWPjy8', ch: 'durioo', title: 'Mina & Mila: Mila Mina Competing for Science Show | Islamic Stories for Kids' },
    { id: 'oMVBwt92UjA', ch: 'durioo', title: 'Mina & Mila: I\'m Not a Baby | Islamic Stories for Kids' },
    { id: 'Yr6GQmZ6OjQ', ch: 'durioo', title: 'The Makers of Omar & Hana - Islamic Stories Mina Mila - Miss know it all - Muslim Siblings | Durioo+' },
    { id: 'iID_5bmKWfQ', ch: 'durioo', title: 'Islamic Stories Mina Mila -I\'m Cool With This -The Makers of Omar & Hana | Durioo+' },
    { id: 'R1w2MglGaWk', ch: 'durioo', title: 'Give it Back | Mina Mila | Durioo+' },
    { id: 'O31RnH5WIJ0', ch: 'durioo', title: 'Mina Mila Compilation | Mina Mila | Durioo+' },
    { id: 'raUcPyveKcE', ch: 'durioo', title: 'Allahu Akbar! | MinaMila | Durioo+' },
    { id: 'UukcL_TbT3Y', ch: 'durioo', title: 'Viral Macaroon | MinaMila | Durioo+' },
    { id: 'exkebt3ozcI', ch: 'durioo', title: 'Islamic Cartoon Mina Mila | This Gives Me Goosebump! Compilation | The Makers of Omar&Hana | Durioo+' },
    { id: 'FxZg3fUKUDo', ch: 'durioo', title: 'Islamic Cartoon MinaMila | Game on! Compilation | The Makers of Omar & Hana | Durioo+' },
    { id: 'KiP4vQtESEQ', ch: 'durioo', title: 'MINA MILA 💖 MOM, You Are The Best! 🌸 | From the Makers of Omar&Hana | Durioo+ 60 Minutes Compilation' },
    { id: 'lyvx2vsYAJI', ch: 'durioo', title: '💖 SPECIAL COMPILATION: MINA’S CORE 🌸 | From the Makers of Omar & Hana | Durioo+ MINA MILA' },
    { id: '1FWtwEDJVTg', ch: 'durioo', title: '🤲 Mina & Mila 🎞️ Let’s Pray Together 🌙 Gentle & Sweet Moments 💖| The Makers of Omar & Hana | Durioo+' },

    // MS RACHEL
    { id: 'hTqtGJwsJVE', ch: 'msrachel', title: 'Baby Learning With Ms Rachel - First Words, Songs and Nursery Rhymes for Babies - Toddler Videos' },
    { id: 'zmEv7vTOQGE', ch: 'msrachel', title: 'Baby Learning with Ms Rachel - Baby Songs, Speech, Sign Language for Babies - Baby Videos' },
    { id: 'bOiYN7iU-W8', ch: 'msrachel', title: 'Wheels On The Bus + More Nursery Rhymes & Kids Songs - Educational Videos for Kids & Toddlers' },
    { id: '47MNn4bsmSw', ch: 'msrachel', title: 'Learn Animals with Ms Rachel for Toddlers - Animal Sounds, Farm Animals, Nursery Rhymes & Kids Songs' },
    { id: 'dnHWQwh1Iso', ch: 'msrachel', title: 'Talking Time with Ms Rachel - Baby Videos for Babies and Toddlers - Speech Delay Learning Video' },
    { id: 'gngPQ771Ahk', ch: 'msrachel', title: 'Hop Little Bunnies Hop Hop Hop + More Ms Rachel Nursery Rhymes & Kids Songs' },
    { id: 'zwL2o4jZxbc', ch: 'msrachel', title: 'Baby’s First Words with Ms Rachel - Videos for Babies' },
    { id: 'xkYved-ucGg', ch: 'msrachel', title: 'Learn to Talk with Ms Rachel - Videos for Toddlers - Nursery Rhymes & Kids Songs - Speech Practice' },
    { id: 'h67AgK4EHq4', ch: 'msrachel', title: 'Toddler Learning with Ms Rachel - Nursery Rhymes & Kids Songs - Baby Video - Milestones & Speech' },
    { id: 'INYqyOPAP9Y', ch: 'msrachel', title: 'Toddler Learning Video with Ms Rachel | 2 Year Old Milestones, Speech & Social Skills for Toddlers' },
    { id: 'yBj9Qlpwjcs', ch: 'msrachel', title: 'Learning with Ms Rachel | Learn Words and Colors for Toddlers | Educational Kids Videos | Animals' },
    { id: '_Z0ZQT0FttM', ch: 'msrachel', title: 'Toddler Learning with Ms Rachel - Learn Zoo Animals - Kids Songs - Educational Videos for Toddlers' },
    { id: 'gFuEoxh5hd4', ch: 'msrachel', title: 'Blippi & Ms Rachel Learn Vehicles - Wheels on the Bus - Videos for Kids - Tractor, Car, Truck + More' },
    { id: '559QxICEleA', ch: 'msrachel', title: 'Learning Videos for Toddlers | Animal Sounds, Farm Animals, Learn Colors, Numbers, Words | Speech' },
    { id: '-1DYsiKC7b4', ch: 'msrachel', title: 'First Sentences for Toddlers | Learn to Talk | Toddler Speech Delay | Speech Practice Video English' },
    { id: 'K_Aq4H03Nm4', ch: 'msrachel', title: 'Preschool & Toddler Learning Video with Ms Rachel - Learn Shapes, Letters, Numbers, Colors & More' },
    { id: '1IEGrjMC88M', ch: 'msrachel', title: 'Learn To Talk with Ms Rachel - Learning at an Outdoor Playground - Toddler Videos - Toddler Shows' },
    { id: 'oVtzNpzuvoA', ch: 'msrachel', title: 'Learn with Ms Rachel - Phonics Song - Learn to Read - Preschool Learning - Kids Songs & Videos' },
    { id: 'nnqsEUxgSBQ', ch: 'msrachel', title: 'Ms Rachel & Elmo Get Ready For School - ABC Song, Numbers, Colors - Toddler & Preschool Learning' },
    { id: 'XtHZ_8ILGgY', ch: 'msrachel', title: 'Learn To Talk - Toddler Learning Video - Learn Colors with Crayon Surprises - Speech Delay - Baby' },
    { id: '8WLKPoOaNiM', ch: 'msrachel', title: 'Learn To Talk with Ms Rachel - Help Take Care of Dolls - Speech, Baby Sign - Doll turn into baby' },
    { id: '_R0xRT2y7Uo', ch: 'msrachel', title: 'Learn The Alphabet, Letters, Phonics Song | Toddler Learning Video | Letter Sounds | Speech | ABCs' },
    { id: 'omcNGrnt7Sg', ch: 'msrachel', title: 'Learn to Talk with Ms Rachel | Baby Learning Videos | Toddler Speech | Christmas | First Words' },
    { id: 'AyZNnxLGGlw', ch: 'msrachel', title: 'Happy Song | I’m So Happy + More Nursery Rhymes & Kids Songs | Ms Rachel | Kids Dance Songs' },
    { id: 'VvoO9-L1KA4', ch: 'msrachel', title: 'Learn To Talk with Ms Rachel - Toddler Learning Video - Learn Colors, Numbers, Emotions & Feelings' },
    { id: 'kBuKdHQYPps', ch: 'msrachel', title: 'Learning with Ms Rachel Halloween | Videos for Toddlers | Kids Songs | Wheels on The Bus | Speech' },
    { id: 'hOHrqPI9bVk', ch: 'msrachel', title: 'Learn Numbers, Colors, Counting and Shapes with Ms Rachel | Learning Videos for Toddlers in English' },
    { id: 'TyV-OhCrVDA', ch: 'msrachel', title: 'Learn Colors, Fruits and Vegetables with Ms Rachel | Toddler Learning Video | Speech | Educational' },
    { id: 'E2_kRmS6y8A', ch: 'msrachel', title: 'Learn Farm Animals with Ms Rachel | Animal Sounds, Old MacDonald Had A Farm | Videos for Toddlers' },
    { id: '6nRAv1_UFJs', ch: 'msrachel', title: 'Learn To Talk for Toddlers - First Words - Speech For 2 Year Old - Speech Delay Learning - Apraxia' },
    { id: 'yQyEmZIw1e8', ch: 'msrachel', title: 'Caterpillar Song - Kids Songs and Nursery Rhymes - Songs for Toddlers - Ms Rachel Songs on YouTube' },
    { id: 'w264Mn-2MnQ', ch: 'msrachel', title: 'Learn to Talk for Babies and Toddlers - Ms Rachel visits the Play Street Museum in Manhattan!' },
    { id: '8KtnrtHRiCg', ch: 'msrachel', title: 'Animal Learning for Toddlers with Ms Rachel - 3 Full Episodes - Learn Animal Sounds - Best Videos' },
    { id: '1v3Dk41C_10', ch: 'msrachel', title: 'Phonics Song + More Kids Songs & Nursery Rhymes - Learn Letter Sounds - Videos for Kids - Ms Rachel' },
    { id: '2dDpryw3z5w', ch: 'msrachel', title: 'Learn with Ms Rachel - Friendship & Social Skills - Videos for Kids - Colors, Letters & Counting' },
    { id: 'tYDuAfY77Do', ch: 'msrachel', title: 'Brush Your Teeth Song with Ms Rachel and Elmo - Timer - Kids Songs and Nursery Rhymes' },
    { id: 'qXKsou9UmfY', ch: 'msrachel', title: 'Potty Training with Ms Rachel - Toddler Learning Video - Potty Songs for Toddlers - Potty Song' },
    { id: 'drkVagtmIJA', ch: 'msrachel', title: 'Hide and Seek with Ms Rachel & Elmo + More Games, Kids Songs, Nursery Rhymes & Social Skills' },
    { id: 'GLigE_f4dl0', ch: 'msrachel', title: 'I Love A Rainbow with Ms Rachel, Elmo & Abby + MORE Nursery Rhymes & Kids Songs - Toddler Songs' },
    { id: 'b051ktudQDQ', ch: 'msrachel', title: 'ABC Song - The Alphabet - ABCs & 123s - Phonics - Kids Songs & Nursery Rhymes for Children' },
    { id: 'oEn7XBxOXSw', ch: 'msrachel', title: 'Ms Rachel Visits the Doctor for a Checkup - Doctor Checkup Song - Toddler Learning - Healthy Habits' },
    { id: 'O5xC8T1XsE4', ch: 'msrachel', title: 'Blippi and Ms Rachel Fire Truck Song and Wheels on the Bus - Nursery Rhymes and Kids Songs' },
    { id: 'w1lRsjY2EmI', ch: 'msrachel', title: 'Christmas Songs for Kids - Jingle Bells + More Nursery Rhymes & Kids Songs - Ms Rachel' },
    { id: 'axhYc_4jL3Y', ch: 'msrachel', title: 'Bingo + More Nursery Rhymes & Kids Songs - Ms Rachel' },
    { id: 'Qi4AV2S4xA0', ch: 'msrachel', title: 'Bubble, Bubble Pop! Fun circle time song for kids!' },
    { id: '0ETr_5NhX5Q', ch: 'msrachel', title: 'Open Shut Them Song with Action - Great for babies toddlers - extra verses!' },
    { id: 'CcpI34r3MdQ', ch: 'msrachel', title: 'I Love You Barney Song' },
    { id: 'V0Ox0p1x5Wc', ch: 'msrachel', title: '5 Little Hot Dogs Frying In A Pan Song for toddlers and babies!' },
    { id: 'OpWGPOtSllM', ch: 'msrachel', title: 'Good Morning Song for kids, toddlers, babies, circle time!' },
    { id: 'HTfOVFwMRg4', ch: 'msrachel', title: 'Baby Bumblebee Song for kids with action!' },
    { id: 'dpGJcY4brhs', ch: 'msrachel', title: 'Tiny Tim - I Had A Little Turtle' },
    { id: '4rVirL3FA6g', ch: 'msrachel', title: 'Once I Caught A Fish Alive with action!' },
    { id: '1mjMdudwtRc', ch: 'msrachel', title: 'Clean Up Song for Kids from Barney and Friends - Original' },
    { id: '4W_ThFZS3Kk', ch: 'msrachel', title: 'Five Little Monkeys Swinging in a Tree' },
    { id: 'QLNCchR5oXg', ch: 'msrachel', title: 'Row Row Row Your Boat Song Lyrics 7 verses' },
    { id: 'lvbCwqML9sc', ch: 'msrachel', title: '' },
    { id: '5GFQRzKG--A', ch: 'msrachel', title: 'We Are The Dinosaurs Laurie Berkner Cover Guitar' },
    { id: 'VuYPPyYinEI', ch: 'msrachel', title: 'I Love You to the Moon Song- original children\'s lullaby/song by Rachel' },
    { id: 'UWNc_2n8UDI', ch: 'msrachel', title: '\'Imagination' },
    { id: '7K6YSmf0HdU', ch: 'msrachel', title: 'Baby Music Class (full class) Great for babies, toddlers & preschool! Toddler Learning Video Songs' },

    // ALIF & SOFIA
    { id: 'TgOMfVSeYhE', ch: 'alifsofia', title: '[LAGU] Alif & Sofia | 25 Rasul' },
    { id: '-ZBM0PDkFgU', ch: 'alifsofia', title: '[LAGU] Alif & Sofia | 20 Sifat Allah' },
    { id: 'r7PFgVpG3eI', ch: 'alifsofia', title: 'Alif & Sofia | Kompilasi 15 Minit' },
    { id: 'Lp7QRAG0yak', ch: 'alifsofia', title: 'Alif & Sofia | Kompilasi 15 Minit' },
    { id: 'B2vorH0y-1w', ch: 'alifsofia', title: 'Alif & Sofia | Kompilasi 15 Minit' },
    { id: 'sbad4tvgyV4', ch: 'alifsofia', title: 'Alif & Sofia X Captain GG | Lima Cara' },
    { id: '60MH0reGHAE', ch: 'alifsofia', title: 'Alif Sofia | Kompilasi 10 Minit' },
    { id: 'QXezjn3hiHY', ch: 'alifsofia', title: 'Alif Sofia | Kompilasi 10 Minit' },
    { id: 'IfL3SdcgEIs', ch: 'alifsofia', title: '[PSA] Alif & Sofia | Apa Itu Vaksin?' },
    { id: 'jziBg2O76iI', ch: 'alifsofia', title: '[ PSA ] Alif & Sofia | Hari Haiwan Sedunia' },
    { id: 'mAh__YEA8T4', ch: 'alifsofia', title: '[CERITA] Alif & Sofia | Nabi Ibrahim Seorang Hero' },
    { id: 'aTlFmjlxgbQ', ch: 'alifsofia', title: '[PSA] Alif & Sofia | Tidak Pasti Jangan Kongsi' },
    { id: 'cH4EEOfexPg', ch: 'alifsofia', title: '[ PSA ] Alif & Sofia | Hari Kanak-Kanak Sedunia' },
    { id: '_zD8EQ7cCJ8', ch: 'alifsofia', title: '[PSA] Alif Sofia | Jangan Kongsi' },
    { id: '9eMypZeaDDo', ch: 'alifsofia', title: '[ PSA ] Alif Sofia | Hari Merdeka' },
    { id: 'jPxs-h0X9Qw', ch: 'alifsofia', title: '[ PSA ] Alif & Sofia | Hari Malaysia' },
    { id: 'zIu0r949imE', ch: 'alifsofia', title: '[ PSA ] Alif Sofia | Apa Itu Al-Anam?' },
    { id: 'Ug1uYVmgStE', ch: 'alifsofia', title: '[Jom Kreatif] Alif & Sofia | Bunga Kertas' },
    { id: '7ols_9AaYs0', ch: 'alifsofia', title: '[PSA] Alif & Sofia | Kami Sayang Malaysia' },
    { id: 'E8CTMCJHCTA', ch: 'alifsofia', title: '[Jom Kreatif] Alif & Sofia | Doh Mainan' },
    { id: 'bkARmDjj2To', ch: 'alifsofia', title: '[PSA] Alif & Sofia | Hari Pahlawan' },
    { id: 'RIWOtvY3sS0', ch: 'alifsofia', title: '[Jom Kreatif] Alif & Sofia | Origami Katak' },
    { id: 'pdbMM_6B66M', ch: 'alifsofia', title: 'Alif & Sofia X Tanyalah Ustaz | Apa Itu Ibadah Haji?' },
    { id: '2OVG1I35n2k', ch: 'alifsofia', title: 'Jom Kreatif] Alif & Sofia | Mari Mewarna' },
    { id: 'LubDac7SXa4', ch: 'alifsofia', title: '[Jom Kreatif] Alif & Sofia | Pokok Butang' },
    { id: 'OcRwrHYbWsE', ch: 'alifsofia', title: 'Alif & Sofia X Tanyalah Ustaz | Apa Itu Wukuf Di Arafah?' },
    { id: 'OHYbqRe9sz8', ch: 'alifsofia', title: 'Alif & Sofia X Tanyalah Ustaz | Apa Itu Ibadah Korban' },
    { id: 'gaDnQVlxDU4', ch: 'alifsofia', title: 'Alif & Sofia X Tanyalah Ustaz | Melontar Jamrah?' },
    { id: 'Al9TkmqhsUI', ch: 'alifsofia', title: 'Alif & Sofia X Tanyalah Ustaz | Apa Itu Tawaf?' },
    { id: '92t6tLFC55o', ch: 'alifsofia', title: 'Alif & Sofia X Tanyalah Ustaz | Sambutan Hari Raya Aidiladha' },
    { id: 'Ps_GpjvEMX8', ch: 'alifsofia', title: 'Alif & Sofia X Tanyalah Ustaz | Masjid An-Nabawi' },
    { id: '5EKatMZjjKE', ch: 'alifsofia', title: 'Alif & Sofia X Tanyalah Ustaz | Hajarul Aswad' },
    { id: 'faVJQqSIO20', ch: 'alifsofia', title: 'Alif & Sofia X Tanyalah Ustaz | Apa Itu Saie?' },
    { id: 'iJ4UAZGTEsk', ch: 'alifsofia', title: 'Alif & Sofia X Tanyalah Ustaz | Tempat Ibadah Haji' },

    // OMAR & HANA
    { id: '74N9sjf4pXg', ch: 'omarhana', title: 'Omar & Hana I Want To Be Islamic cartoons for kids' },
    { id: 'fTxjb-ewVQQ', ch: 'omarhana', title: 'Omar & Hana | NEW: Telling the Truth | Islamic Cartoon for Kids | Nasheed' },
    { id: '5kKk9Gp1KOQ', ch: 'omarhana', title: 'Omar & Hana SERIES COMPILATION 90 Mins Omar & Hana English' },
    { id: 'DHARkRoV9rs', ch: 'omarhana', title: 'Omar & Hana | Compilation of series | Islamic Cartoons' },
    { id: 'rCnn7RWqSCE', ch: 'omarhana', title: 'Alhamdulillah, Bismillah, InshaAllah Islamic Series & Songs For Kids Omar & Hana English' },
    { id: '2_q0xsQdM-Q', ch: 'omarhana', title: 'Islamic Series & Songs For Kids Omar & Hana English 90 Minutes Compilation' },
    { id: 'YNJmYX_pQJY', ch: 'omarhana', title: 'Omar & Hana 60 minutes compilation of series Islamic Cartoons' },
    { id: 'aeo2-o5BcSs', ch: 'omarhana', title: 'The Last Cake Islamic Series & Songs For Kids Omar & Hana English' },
    { id: 'o3Eq79s6_5I', ch: 'omarhana', title: 'Omar & Hana Salam Scientist Islamic Cartoons for kids' },
    { id: 'O5Qd222wLxA', ch: 'omarhana', title: 'New Season Have Patience Daddy Islamic Series & Songs For Kids Omar & Hana English' },
    { id: 'XKrKImw-DZ0', ch: 'omarhana', title: 'Omar & Hana | Islamic Series Compilation | Omar & Hana English' },
    { id: 'D3pzZVAlwAo', ch: 'omarhana', title: 'Let\'s Tidy Up Islamic Songs & Series For Kids Omar & Hana English' },
    { id: 's-ohLjVGbMs', ch: 'omarhana', title: 'Ustaz Musa Omar & Hana 40 Minutes Compilation Islamic Series & Songs For Kids' },
    { id: '1R3LWktWVLU', ch: 'omarhana', title: 'Amazing Animals 20 Minutes Compilation Omar & Hana English' },
    { id: 'n9EVOkE_vmg', ch: 'omarhana', title: '75 Minutes New Compilation 2023 Islamic Series & Songs For Kids Omar & Hana English' },
    { id: 'wT20xwO5Oks', ch: 'omarhana', title: 'Special EID AL ADHA 2024 Omar' },
    { id: 'DdW2NGqRZmw', ch: 'omarhana', title: 'Omar & Hana Season 5 New Episodes 40 Minutes Compilation' },
    { id: '53nnT8buKlI', ch: 'omarhana', title: 'NEW EPISODE Allah\'s Angels Islamic Series & Songs For Kids Omar & Hana English' },
    { id: 'Hti42crbFLM', ch: 'omarhana', title: 'Omar & Hana Being Good Neighbors Islamic Cartoon for Kids Nasheed' },
    { id: 'i48WbcncaRg', ch: 'omarhana', title: 'Omar & Hana I can do anything Islamic Cartoons' },
    { id: '4JsKUJpTpGc', ch: 'omarhana', title: 'New Episode Grandpa\'s Feast Islamic Series & Songs For Kids Omar & Hana English' },

    // LEARN WITH ZAKARIA
    { id: 'OQs8g1DN55o', ch: 'learnwithzakaria', title: 'Arabic Alphabet Song for children – ABC Song in Arabic for kids | Nasheed with Zakaria' },
    { id: 'edL3W38ODd4', ch: 'learnwithzakaria', title: 'Learn How To Pray (Salah for Kids) The Right Way – Learn Salah for Kids with Zakaria' },
    { id: 'LyzupN62MGA', ch: 'learnwithzakaria', title: 'Read Arabic Alphabet for kids (أَ, أُ, إِ)– Learn reading Arabic ABC for kids with Zakaria' },
    { id: 'gr3XKopIsVA', ch: 'learnwithzakaria', title: 'The ِArabic Numbers Song - Learn To Count from 1 to 10 - Number Rhymes For Children (No Music)' },
    { id: '8_4_F8EunRI', ch: 'learnwithzakaria', title: 'Learn Colors in Arabic for Kids - تعليم الألوان للاطفال باللغة العربية' },
    { id: 'EiMf3iwvEkc', ch: 'learnwithzakaria', title: 'Learn Reading Arabic for kids – Easy way to learn how to read for kids with Zakaria' },
    { id: 'MPCvPqIeCCs', ch: 'learnwithzakaria', title: 'Surah Al-Fatiha repeated 10 times - 01 - Quran for Kids - Learn Quran with Zakaria' },
    { id: 'L2F_myEd8ag', ch: 'learnwithzakaria', title: 'Learn Salah for Kids with Zakaria - Learn How To Perform Salah The Right Way' },
    { id: 'y3Hd5srW_ak', ch: 'learnwithzakaria', title: 'Learn Ablution (Wudu for Kids) The Right Way – Learn Wudu for Kids with Zakaria' },
    { id: 'ehEoHHcgp5E', ch: 'learnwithzakaria', title: 'Arabic Numbers Nasheed | Arabic Numbers Song with Zakaria – Numbers Song in Arabic for kids' },
    { id: '6ZVu40rx6uc', ch: 'learnwithzakaria', title: 'Read Arabic Alphabet for kids (آ, أُو, إِي)– Learn reading Arabic ABC for kids with Zakaria' },
    { id: 'ECJ_PzG2MAw', ch: 'learnwithzakaria', title: 'Do You Know? Learn about Prophet\'s life | Question and Answers about Sira Nabawiya with Zakaria' },
    { id: '8v3Ua4DjqEY', ch: 'learnwithzakaria', title: 'Learn Writing Letter Baa (ب) in Arabic – Learn Writing Arabic for children with Zakaria' },
    { id: '-A_uepM5yTg', ch: 'learnwithzakaria', title: 'Arabic Letter Alif (أ), Arabic Alphabet for Children – حرف الألف الحروف العربية للأطفال' },
    { id: 'z01UZ8r_ZOw', ch: 'learnwithzakaria', title: 'Do You Know? Learn about Animals | Question and Answers about Animals with Zakaria' },
    { id: '35dNnzd6F10', ch: 'learnwithzakaria', title: 'Ayat Al Kursi - Quran for Kids - آية الكرسي - القران الكريم للأطفال' },
    { id: 'XsuGqy1ozwE', ch: 'learnwithzakaria', title: 'Nasheed | Arabic Alphabet Song with Zakaria – ABC Song in Arabic for kids' },
    { id: 'gXhxa7QjEEM', ch: 'learnwithzakaria', title: 'Learn How To Pray (Salah Al Maghrib) The Right Way – Learn Salah Al Maghrib for Kids with Zakaria' },
    { id: '6QJ0NWz512g', ch: 'learnwithzakaria', title: 'Learn Numbers in English for kids 1 to 20 | تعلم الأرقام بالانجليزية للأطفال ١ الى ٢٠' },
    { id: 'vC43yxyjIEE', ch: 'learnwithzakaria', title: '5 Pillars of Islam for Kids – les 5 pillars de l’Islam pour les enfants' },
    { id: 'RTawXVqnLMg', ch: 'learnwithzakaria', title: 'Learn the French Alphabet with Zakaria | ABC Letters in French' },
    { id: 'NEhXW0VxkqA', ch: 'learnwithzakaria', title: 'ABC Nasheed - Arabic Alphabet Song for Kids | ABC Song in Arabic without music' },
    { id: 'VAX9S8F8ao4', ch: 'learnwithzakaria', title: 'Learn Colours in Arabic for Kids – Learn Colours Names for kids with Zakaria' },
    { id: 'aHbhda9rKRY', ch: 'learnwithzakaria', title: 'Quran for Kids: Learn Surah Al-Fatiha - 001 - القرآن الكريم للأطفال: تعلّم سورة الفاتحة' },
    { id: 'RVyIxbpTK1g', ch: 'learnwithzakaria', title: 'ABC Song For Children | Nursery Rhymes For Kids | Without Music | Learn ABCs with Zakaria' },
    { id: '0xYTcZvVCuI', ch: 'learnwithzakaria', title: 'Animals for Kids in Arabic - اسماء الحيوانات للأطفال باللغة العربية' },
    { id: 'kShYRVEETiY', ch: 'learnwithzakaria', title: 'ABC Song in Arabic for Children | ABC Nasheed - Arabic Alphabet Song for Kids' },
    { id: 'fmbVBIiO1k0', ch: 'learnwithzakaria', title: 'Arabic Alphabet for Kids with Animals – Learn Arabic ABC with Zakaria' },
    { id: 'd0t1DCRQtmI', ch: 'learnwithzakaria', title: 'Do You Know? Learn about Arab countries | Question and Answers about the Arab world with Zakaria' },
    { id: 'dmSVnXeTgw4', ch: 'learnwithzakaria', title: 'Alphabet Song in Arabic for kids - آ أو إي – Arabic ABC Nasheed in for Children with Zakaria' },
    { id: 'HO08HGnIlxA', ch: 'learnwithzakaria', title: 'أنشودة الفأر 🐭 | فأر دخل الدار 😱 | أغنية مضحكة وتعليمية للأطفال بدون موسيقى' },
    { id: 'pYuOEEYupRU', ch: 'learnwithzakaria', title: 'Educational Songs for Children | Alphabet, Numbers, Colors, and Professions with Zakaria' },
    { id: 'yHYI7apORwY', ch: 'learnwithzakaria', title: 'Numbers Song from 1 to 10 | Learn to Count Animals with Zakaria | Numbers Song with Animals' },
    { id: 'OcNaG6V18CA', ch: 'learnwithzakaria', title: 'Arabic Alphabet Song | The Easiest and Simplest Song to Learn the Letters with Zakaria' },
    { id: 'cFU6B07-34w', ch: 'learnwithzakaria', title: 'مجموعة أناشيد الحيوانات والحشرات للأطفال | البعوضة والصرصور والذئب وزيكو والخروف 🐺🐱🐑🦟' },
    { id: '2UhVkpZc2oc', ch: 'learnwithzakaria', title: '⚽ أنشودة كرة القدم للأطفال | هيا هيا هو - أغنية كأس العالم | World Cup Song for Kids' },
    { id: '_hnX1yLxMMo', ch: 'learnwithzakaria', title: 'Arabic Alphabet Song - Aleph Rabbit A A Rabbit | Educational Songs for Kids' },
    { id: 'DonogrVbpw0', ch: 'learnwithzakaria', title: 'أنشودة خروف العيد 🐑 | باع باع | أغنية عيد الأضحى للأطفال' },
    { id: '5DoA647sOtY', ch: 'learnwithzakaria', title: 'Animal Sounds Song - Zico the Cat Song 🐱 | Learn with Zakaria' },
    { id: 'Tx_yoMRDDqc', ch: 'learnwithzakaria', title: 'A Bunny Runs and Plays - Alphabet Song | Arabic Alphabet Song' },
    { id: 'SRpk6S180NA', ch: 'learnwithzakaria', title: 'أنشودة الذئب الراعي والخرفان | أناشيد ممتعة للأطفال - تعلم مع زكريا' },
    { id: 'VWBjBTWF1gg', ch: 'learnwithzakaria', title: 'أنشودة البعوضة لدغت | أنشودة مضحكة للأطفال عن البعوض - تعلم مع زكريا' },
    { id: 'OF4nMJ8icWg', ch: 'learnwithzakaria', title: 'أغنية المهن للأطفال | ماذا تريد أن تكون؟ تعلّم مع زكريا' },
    { id: 'x8BTd1ytd2k', ch: 'learnwithzakaria', title: 'The Sneaky Cockroach Song | Funny Kids Song About Cleaning' },
    { id: 'LXGXptsHGKc', ch: 'learnwithzakaria', title: 'The Letter Qaf (ق) for kids | Learn Arabic Alphabet with Zakaria and Ziko' },
    { id: '-ChmnC5_paQ', ch: 'learnwithzakaria', title: 'Colors Song for Kids | Learn Colors the Fun Way with Zakaria' },
    { id: '6HScj4ipV3k', ch: 'learnwithzakaria', title: 'The Letter Faa (ف) for kids | Learn Arabic Alphabet with Zakaria and Ziko' },
    { id: 'fKWqT774PU4', ch: 'learnwithzakaria', title: 'Eid Saeed Song | Eid Celebration Song for Kids with Zakaria' },
    { id: '8O40AjQKO5M', ch: 'learnwithzakaria', title: 'Ya Omi (My Mother) | A Heartwarming Song About Mom ❤️ | Learn with Zakaria' },
    { id: 'WZUKB_rBAgQ', ch: 'learnwithzakaria', title: 'Subhan Allah Song for Kids 🌟 | Learn with Zakaria' },
    { id: 'MorgfALY5mM', ch: 'learnwithzakaria', title: 'Welcome Ramadan Song for Kids 🌙 | Learn with Zakaria' },
    { id: '1GPpYnPeyoc', ch: 'learnwithzakaria', title: 'The Letter Ghayn (غ) for kids | Learn Arabic Alphabet with Zakaria and Ziko' },
    { id: '0-ua496VyHw', ch: 'learnwithzakaria', title: 'The Letter Ayn (ع) for kids | Learn Arabic Alphabet with Zakaria and Ziko' },
    { id: 'XIVWZX49_Ak', ch: 'learnwithzakaria', title: 'The Cockroach - The Terrifying Insect | Cockroaches for Kids - How, What, and Why (Episode 4)' },
    { id: 'me2SSJlJ0H0', ch: 'learnwithzakaria', title: 'The Letter Dhaa (ظ) for kids | Learn Arabic Alphabet with Zakaria and Ziko' },
    { id: 'yFy-knCP3vU', ch: 'learnwithzakaria', title: 'Is the Great White Shark Dangerous? | Shark Facts for Kids - How, What, and Why (Episode 3)' },
    { id: 'IACqrhsOkdo', ch: 'learnwithzakaria', title: 'The Letter Taa (ط) for kids | Learn Arabic Alphabet with Zakaria and Ziko' },
    { id: 'fl68EjP-jzY', ch: 'learnwithzakaria', title: 'The Letter Dad (ض) for kids | Learn Arabic Alphabet with Zakaria and Ziko' },
    { id: '7gpcxpoyaY0', ch: 'learnwithzakaria', title: 'The Letter Sad (ص) for kids | Learn Arabic Alphabet with Zakaria and Ziko' },
    { id: 'fWarA3WXavE', ch: 'learnwithzakaria', title: 'What are bees? How do bees make honey? | Facts about bees for kids - How, What, Why (Episode 2)' },

    // BEBEFINN 🦈 (Nursery Rhymes & Kids Songs)
    { id: 'qxDuLdfGfW4', ch: 'bebefinn', title: 'Baby Shark and Bebefinn Doo Doo Doo | EP01 | Songs for Kids' },
    { id: 'Sje6rnScu7o', ch: 'bebefinn', title: 'Baby Shark Doo Doo Doo and more | Bebefinn Best Nursery Rhyme Compilation' },
    { id: '0PNiZflV2JQ', ch: 'bebefinn', title: 'Five Little Sharks | EP39 | Baby Shark Doo Doo Doo | Bebefinn Songs for Kids' },
    { id: 'xJ6gG6DUjhI', ch: 'bebefinn', title: 'Shark Finger Family | EP107 | Baby Shark Doo Doo Doo | Bebefinn Best Songs' },
    { id: 'm2mfP-AVMgQ', ch: 'bebefinn', title: 'Run Away Baby Car! | EP38 | Baby Shark Doo Doo Doo | Bebefinn Songs for Kids' },
    { id: 'N1Hgj4O9Nk0', ch: 'bebefinn', title: 'Mix - Baby Shark, Good Morning, Baby Car | Bebefinn Most Viewed Videos' },
    { id: 'IIjv09RS0gg', ch: 'bebefinn', title: 'Ten in a Bed and Five Little Sharks | Count Numbers Together | Compilation' },
    { id: 'kuDzMR6k4R4', ch: 'bebefinn', title: 'Good Morning Bebefinn! Wake up Bora | EP14 | Nursery Rhymes' },
    { id: '78rSZ9iEQeo', ch: 'bebefinn', title: 'Yes Papa Yes Mama! | EP109 | Bebefinn Nursery Rhymes for Kids' },
    { id: 'u05ke3nGqU0', ch: 'bebefinn', title: 'Yes Papa! No Bebefinn\'s Not Eating Cookies! | EP02 | Songs for Kids' },
    { id: 'F437eCwurA0', ch: 'bebefinn', title: 'Good Morning! Wake Up | Nursery Rhymes Compilation for Kids | Family Song' },
    { id: 'oiKji3JjkgY', ch: 'bebefinn', title: 'Rain, Rain, Go Away | EP101 | Bebefinn Nursery Rhymes for Kids' },
    { id: 'QXMHKfTtah4', ch: 'bebefinn', title: 'Walking Walking | EP07 | Bebefinn Nursery Rhymes | Healthy Habits' },
    { id: 'qC3kGaTBW7s', ch: 'bebefinn', title: 'Animal Sounds Song (Moo! Oink!) | EP18 | Bebefinn Songs for Kids' },
    { id: 'RLRsSeEPgJY', ch: 'bebefinn', title: 'Ouchie! Help Me Please | EP09 | Boo Boo Song | Bebefinn Nursery Rhymes' },
    { id: '4GCCv9LOcW8', ch: 'bebefinn', title: 'Peek-a-Boo Song | EP08 | Songs for Kids | Bebefinn Nursery Rhymes' },
    { id: '7muxnzQZS28', ch: 'bebefinn', title: 'Bebefinn ABC Song + more nursery rhymes | Alphabet Songs | Compilation' },
    { id: 'YK6aMTRCXTg', ch: 'bebefinn', title: 'Best T-rex and dinosaur songs | Animal Songs | Compilation | Bebefinn' },
    { id: 'FDMgufO6kQ0', ch: 'bebefinn', title: 'TOP 30 Popular Songs for Kids | Compilation | Bebefinn Nursery Rhymes' },
    { id: 'WKXXoPXQHjk', ch: 'bebefinn', title: 'Bebefinn\'s got a boo-boo | EP70 | Boo-Boo Song for Kids | Bebefinn Sing Along2' },
];

/* ────────────────────────────────────────
   CUSTOM CHANNELS (user-added, localStorage)
──────────────────────────────────────── */
const CUSTOM_KEY = 'utube-custom-channels';

function getCustomChannels() {
    try {
        const raw = localStorage.getItem(CUSTOM_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr : [];
    } catch (e) {
        return [];
    }
}

function saveCustomChannels(list) {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
}

function allChannels() {
    const chs = Object.assign({}, CHANNELS);
    const customs = getCustomChannels();
    customs.forEach((c, i) => {
        chs[c.key] = {
            label: c.label,
            cls: 'ch-cx' + (i % 8),
            color: '#f59e0b',
            icon: CUSTOM_ICONS[i % CUSTOM_ICONS.length],
            custom: true,
            handle: c.handle,
        };
    });
    return chs;
}

function allVideos() {
    const vids = VIDEOS.slice();
    getCustomChannels().forEach((c) => {
        (c.videos || []).forEach((v) => {
            vids.push({ id: v.id, ch: c.key, title: v.title, lang: v.lang || undefined });
        });
    });
    if (embedFilterOn()) {
        const status = getEmbedStatus();
        return vids.filter((v) => status[v.id] !== 'blocked');
    }
    return vids;
}

function findVideoById(id) {
    return allVideos().find((v) => v.id === id) || null;
}

/* ────────────────────────────────────────
   VISIT COUNTER & EMBED FILTER
──────────────────────────────────────── */
function bumpVisits() {
    const k = 'utube-visits';
    let n = parseInt(localStorage.getItem(k) || '0', 10) || 0;
    n++;
    localStorage.setItem(k, String(n));
    return n;
}

const GLOBAL_VISITS_KEY = 'utube-global-visits';

function getCachedGlobalVisits() {
    try {
        const v = JSON.parse(localStorage.getItem(GLOBAL_VISITS_KEY) || 'null');
        return v && typeof v.count === 'number' ? v.count : null;
    } catch (e) {
        return null;
    }
}

function setCachedGlobalVisits(count) {
    localStorage.setItem(GLOBAL_VISITS_KEY, JSON.stringify({ count, ts: Date.now() }));
}

function updateGlobalVisitsUI() {
    const el = $('#globalVisitCount');
    if (!el) return;
    const count = getCachedGlobalVisits();
    el.textContent = count != null
        ? t('globalVisitors').replace('%s', String(count))
        : t('globalVisitorsErr');
}

async function refreshGlobalVisits() {
    try {
        const res = await fetch('https://api.visitorbadge.io/api/visitors?path=utube-maheera&label=');
        if (!res.ok) throw new Error('bad status ' + res.status);
        const svg = await res.text();
        const m = svg.match(/aria-label="([\d,.]+)"/);
        if (m) {
            const count = parseInt(m[1].replace(/,/g, ''), 10);
            if (!isNaN(count)) {
                setCachedGlobalVisits(count);
                updateGlobalVisitsUI();
            }
        }
    } catch (e) {
        console.error('[visits] global fetch failed:', e.message);
    }
}

function embedFilterOn() {
    return localStorage.getItem('utube-embed-filter') === '1';
}

function setEmbedFilterOn(on) {
    localStorage.setItem('utube-embed-filter', on ? '1' : '0');
}

function getEmbedStatus() {
    try {
        const map = JSON.parse(localStorage.getItem('utube-embed') || '{}');
        return (map && typeof map === 'object') ? map : {};
    } catch (e) {
        return {};
    }
}

function saveEmbedStatus(map) {
    localStorage.setItem('utube-embed', JSON.stringify(map));
}

function blockedVideoIds() {
    return Object.entries(getEmbedStatus())
        .filter(([, s]) => s === 'blocked')
        .map(([id]) => id);
}

function oembedUrl(id) {
    return `https://www.youtube.com/oembed?url=${encodeURIComponent('https://www.youtube.com/watch?v=' + id)}&format=json`;
}

async function checkEmbeddable(id) {
    try {
        const res = await fetch(oembedUrl(id));
        return res.ok;
    } catch (e) {
        return true;
    }
}

let embedCheckActive = false;
let embedCheckTotal = 0;
let embedCheckDone = 0;

function allVideoIds() {
    const ids = [];
    const seen = new Set();
    [...VIDEOS, ...getCustomChannels().flatMap((c) => (c.videos || []).map((v) => ({ id: v.id })))]
        .forEach((v) => {
            if (!seen.has(v.id)) { seen.add(v.id); ids.push(v.id); }
        });
    return ids;
}

function updateEmbedProgress() {
    const el = $('#embedProgress');
    if (!el) return;
    if (embedCheckActive) {
        el.textContent = `${t('checkingVideos')} ${embedCheckDone}/${embedCheckTotal}...`;
        return;
    }
    if (!embedFilterOn()) {
        el.textContent = t('filterOffNote');
        return;
    }
    const blocked = blockedVideoIds().length;
    el.textContent = blocked > 0 ? `${t('hiddenVideos')}: ${blocked}` : t('noHiddenVideos');
}

async function runEmbedCheck(force = false) {
    if (embedCheckActive) return;
    embedCheckActive = true;
    try {
        let status = getEmbedStatus();
        if (force) {
            status = {};
            saveEmbedStatus(status);
        }
        const ids = allVideoIds();
        const toCheck = ids.filter((id) => status[id] === undefined);
        embedCheckTotal = toCheck.length;
        embedCheckDone = 0;
        updateEmbedProgress();
        const CONC = 5;
        for (let i = 0; i < toCheck.length; i += CONC) {
            const batch = toCheck.slice(i, i + CONC);
            let foundBlocked = false;
            await Promise.all(batch.map(async (id) => {
                const ok = await checkEmbeddable(id);
                status[id] = ok ? 'ok' : 'blocked';
                if (!ok) foundBlocked = true;
                embedCheckDone++;
            }));
            saveEmbedStatus(status);
            updateEmbedProgress();
            if (foundBlocked && embedFilterOn()) {
                renderHero();
                renderGrid();
            }
        }
        saveEmbedStatus(status);
        updateEmbedProgress();
        renderHero();
        renderGrid();
    } finally {
        embedCheckActive = false;
        updateEmbedProgress();
    }
}

/* ────────────────────────────────────────
   I18N — Bahasa Melayu / English / 中文 / தமிழ்
──────────────────────────────────────── */
const LANGS = [
    { code: 'ms', label: 'BM' },
    { code: 'en', label: 'EN' },
    { code: 'zh', label: '中文' },
    { code: 'ta', label: 'தமிழ்' },
];

const I18N = {
    ms: {
        brandSub: 'Kanak-Kanak',
        searchPh: 'Cari video...',
        tabAll: 'Semua',
        featured: 'TAMPILAN',
        watch: 'Tonton',
        recent: 'Video',
        noResults: 'Tiada video dijumpai. Cuba cari perkataan lain.',
        adNote: 'Tanpa iklan — hanya video rasmi dari saluran kanak-kanak tempatan & antarabangsa.',
        close: 'Tutup',
        next: 'Tonton Seterusnya',
        settings: 'Tetapan',
        settingsTitle: 'Tetapan',
        apiKeyLabel: 'Kunci API YouTube',
        apiKeyPh: 'Paste kunci API di sini...',
        apiKeyHelp: 'Diperlukan untuk mengesahkan saluran. Dapatkan secara percuma di Google Cloud Console (dayakan "YouTube Data API v3").',
        saveBtn: 'Simpan',
        linkedChannels: 'Saluran Terhubung',
        builtinBadge: 'Asal',
        addChannelTitle: 'Tambah Saluran',
        addChannelHint: 'Tiada kunci API diperlukan. Jika saluran tidak dapat dimuatkan, hantar ID saluran kepada pembangun untuk ditambah sebagai saluran tetap.',
        channelPh: 'ID saluran (UC...)',
        addBtn: 'Tambah',
        remove: 'Buang',
        removeConfirm: 'Buang saluran ini?',
        checking: 'Menyemak saluran...',
        added: 'Saluran berjaya ditambah!',
        errEmpty: 'Sila masukkan nama saluran, @handle, pautan atau ID saluran.',
        errFetch: 'Saluran tidak dapat dimuatkan sekarang. Hantar ID saluran kepada pembangun untuk ditambah sebagai saluran tetap.',
        errInvalid: 'Format tidak sah. Guna pautan youtube.com/@handle, @handle atau ID saluran (UC...).',
        errNotFound: 'Saluran tidak dijumpai. Semak nama pengguna atau pautan.',
        errQuota: 'Kuota API habis. Cuba lagi kemudian.',
        errNetwork: 'Ralat rangkaian. Cuba lagi.',
        errNoVideos: 'Saluran ini tiada video boleh dimainkan.',
        errDuplicate: 'Saluran ini sudah pun tersedia.',
        keySaved: 'Kunci API disimpan.',
        statsTitle: 'Statistik',
        globalVisitors: 'Pelawat (semua pengguna): %s',
        globalVisitorsErr: 'Tidak dapat memuatkan bilangan pelawat global.',
        syncTitle: 'Segerakan',
        syncLabel: 'Segerak saluran merentas peranti',
        syncHint: 'Saluran yang anda tambah akan disegerakkan ke semua peranti atau pelayar yang membuka laman ini.',
        syncStatus: 'Saluran disegerakkan: %s',
        syncNow: 'Segerak Sekarang',
        syncing: 'Menyegerakkan...',
        syncErr: 'Segerakan gagal. Cuba lagi.',
        visitCount: 'Halaman ini dibuka %s kali pada peranti ini.',
        videoFilterTitle: 'Video',
        embedFilterLabel: 'Sembunyikan video yang tidak boleh dimainkan',
        embedFilterHelp: 'Video yang melarang penanaman (embed) atau tiada di luar YouTube akan disembunyikan secara automatik.',
        recheckBtn: 'Semak Semula',
        checkingVideos: 'Menyemak video',
        hiddenVideos: 'Video disorokkan',
        noHiddenVideos: 'Tiada video disorokkan',
        filterOffNote: 'Penapis video dimatikan',
    },
    en: {
        brandSub: 'Kids',
        searchPh: 'Search videos...',
        tabAll: 'All',
        featured: 'FEATURED',
        watch: 'Watch',
        recent: 'Videos',
        noResults: 'No videos found. Try a different word.',
        adNote: 'No ads — only official videos from local & international kids channels.',
        close: 'Close',
        next: 'Watch Next',
        settings: 'Settings',
        settingsTitle: 'Settings',
        apiKeyLabel: 'YouTube API Key',
        apiKeyPh: 'Paste your API key here...',
        apiKeyHelp: 'Required to verify channels. Get it free at Google Cloud Console (enable "YouTube Data API v3").',
        saveBtn: 'Save',
        linkedChannels: 'Linked Channels',
        builtinBadge: 'Built-in',
        addChannelTitle: 'Add Channel',
        addChannelHint: 'No API key needed. If the channel cannot be loaded, send the channel ID to the developer to add it as a fixed channel.',
        channelPh: 'Channel ID (UC...)',
        addBtn: 'Add',
        remove: 'Remove',
        removeConfirm: 'Remove this channel?',
        checking: 'Checking channel...',
        added: 'Channel added successfully!',
        errEmpty: 'Please enter a channel name, @handle, link or channel ID.',
        errFetch: 'The channel could not be loaded right now. Send the channel ID to the developer to add it as a fixed channel.',
        errInvalid: 'Invalid format. Use a youtube.com/@handle link, @handle or channel ID (UC...).',
        errNotFound: 'Channel not found. Check the username or link.',
        errQuota: 'API quota exceeded. Try again later.',
        errNetwork: 'Network error. Try again.',
        errNoVideos: 'This channel has no playable videos.',
        errDuplicate: 'This channel is already available.',
        keySaved: 'API key saved.',
        statsTitle: 'Stats',
        globalVisitors: 'Visitors (all users): %s',
        globalVisitorsErr: 'Could not load global visitor count.',
        syncTitle: 'Sync',
        syncLabel: 'Sync channels across devices',
        syncHint: 'Channels you add will sync to every device or browser that opens this page.',
        syncStatus: 'Synced channels: %s',
        syncNow: 'Sync Now',
        syncing: 'Syncing...',
        syncErr: 'Sync failed. Try again.',
        visitCount: 'This page has been opened %s times on this device.',
        videoFilterTitle: 'Videos',
        embedFilterLabel: 'Hide videos that cannot be played',
        embedFilterHelp: 'Videos that block embedding or are unavailable outside YouTube will be hidden automatically.',
        recheckBtn: 'Re-check',
        checkingVideos: 'Checking videos',
        hiddenVideos: 'Videos hidden',
        noHiddenVideos: 'No videos hidden',
        filterOffNote: 'Video filter is off',
    },
    zh: {
        brandSub: '儿童',
        searchPh: '搜索视频...',
        tabAll: '全部',
        featured: '精选',
        watch: '观看',
        recent: '视频',
        noResults: '没有找到视频，请换一个词试试。',
        adNote: '无广告 — 仅来自本地和国际儿童频道的官方视频。',
        close: '关闭',
        next: '接下来观看',
        settings: '设置',
        settingsTitle: '设置',
        apiKeyLabel: 'YouTube API 密钥',
        apiKeyPh: '在此粘贴 API 密钥...',
        apiKeyHelp: '用于验证频道。可在 Google Cloud Console 免费获取（启用 "YouTube Data API v3"）。',
        saveBtn: '保存',
        linkedChannels: '已连接频道',
        builtinBadge: '内置',
        addChannelTitle: '添加频道',
        addChannelHint: '无需 API 密钥。如果频道无法加载，请将频道 ID 发送给开发者以添加为固定频道。',
        channelPh: '频道 ID（UC...）',
        addBtn: '添加',
        remove: '移除',
        removeConfirm: '移除这个频道？',
        checking: '正在检查频道...',
        added: '频道添加成功！',
        errEmpty: '请输入频道名称、@handle、链接或频道 ID。',
        errFetch: '暂时无法加载该频道。请将频道 ID 发送给开发者以添加为固定频道。',
        errInvalid: '格式无效。请使用 youtube.com/@handle 链接、@handle 或频道 ID（UC...）。',
        errNotFound: '未找到频道。请检查用户名或链接。',
        errQuota: 'API 配额已用尽，请稍后再试。',
        errNetwork: '网络错误，请重试。',
        errNoVideos: '此频道没有可播放的视频。',
        errDuplicate: '此频道已经存在。',
        keySaved: 'API 密钥已保存。',
        statsTitle: '统计',
        globalVisitors: '访客（所有用户）：%s',
        globalVisitorsErr: '无法加载全球访客数量。',
        syncTitle: '同步',
        syncLabel: '跨设备同步频道',
        syncHint: '您添加的频道将同步到打开此页面的所有设备或浏览器。',
        syncStatus: '已同步频道：%s',
        syncNow: '立即同步',
        syncing: '同步中...',
        syncErr: '同步失败，请重试。',
        visitCount: '此页面已在本设备打开 %s 次。',
        videoFilterTitle: '视频',
        embedFilterLabel: '隐藏无法播放的视频',
        embedFilterHelp: '禁止嵌入或无法在 YouTube 之外播放的视频将被自动隐藏。',
        recheckBtn: '重新检查',
        checkingVideos: '正在检查视频',
        hiddenVideos: '已隐藏视频',
        noHiddenVideos: '没有隐藏视频',
        filterOffNote: '视频过滤器已关闭',
    },
    ta: {
        brandSub: 'குழந்தைகள்',
        searchPh: 'வீடியோ தேடு...',
        tabAll: 'அனைத்தும்',
        featured: 'சிறப்பு',
        watch: 'பார்க்க',
        recent: 'வீடியோக்கள்',
        noResults: 'வீடியோ எதுவும் கிடைக்கவில்லை. வேறு வார்த்தை முயற்சிக்கவும்.',
        adNote: 'விளம்பரம் இல்லை — உள்நாட்டு & சர்வதேச குழந்தைகள் சேனல்களின் அதிகாரப்பூர்வ வீடியோக்கள் மட்டும்.',
        close: 'மூடு',
        next: 'அடுத்து பார்க்க',
        settings: 'அமைப்புகள்',
        settingsTitle: 'அமைப்புகள்',
        apiKeyLabel: 'YouTube API விசை',
        apiKeyPh: 'API விசையை இங்கே ஒட்டவும்...',
        apiKeyHelp: 'சேனல்களைச் சரிபார்க்க தேவை. Google Cloud Console இல் இலவசமாகப் பெறலாம் ("YouTube Data API v3" ஐ இயக்கவும்).',
        saveBtn: 'சேமி',
        linkedChannels: 'இணைக்கப்பட்ட சேனல்கள்',
        builtinBadge: 'உள்ளமை',
        addChannelTitle: 'சேனல் சேர்',
        addChannelHint: 'API விசை தேவையில்லை. சேனலை ஏற்ற முடியவில்லை என்றால், நிரந்தர சேனலாகச் சேர்க்க சேனல் ID ஐ டெவலப்பருக்கு அனுப்பவும்.',
        channelPh: 'சேனல் ID (UC...)',
        addBtn: 'சேர்',
        remove: 'நீக்கு',
        removeConfirm: 'இந்த சேனலை நீக்கவா?',
        checking: 'சேனல் சரிபார்க்கிறது...',
        added: 'சேனல் வெற்றிகரமாக சேர்க்கப்பட்டது!',
        errEmpty: 'சேனல் பெயர், @handle, இணைப்பு அல்லது சேனல் ID ஐ உள்ளிடவும்.',
        errFetch: 'சேனலை இப்போது ஏற்ற முடியவில்லை. நிரந்தர சேனலாகச் சேர்க்க சேனல் ID ஐ டெவலப்பருக்கு அனுப்பவும்.',
        errInvalid: 'தவறான வடிவம். youtube.com/@handle இணைப்பு, @handle அல்லது சேனல் ID (UC...) பயன்படுத்தவும்.',
        errNotFound: 'சேனல் கிடைக்கவில்லை. பயனர் பெயர் அல்லது இணைப்பைச் சரிபார்க்கவும்.',
        errQuota: 'API ஒதுக்கீடு முடிந்தது. பின்னர் மீண்டும் முயற்சிக்கவும்.',
        errNetwork: 'நெட்வொர்க் பிழை. மீண்டும் முயற்சிக்கவும்.',
        errNoVideos: 'இந்த சேனலில் இயக்கக்கூடிய வீடியோக்கள் இல்லை.',
        errDuplicate: 'இந்த சேனல் ஏற்கனவே உள்ளது.',
        keySaved: 'API விசை சேமிக்கப்பட்டது.',
        statsTitle: 'புள்ளிவிவரம்',
        globalVisitors: 'பார்வையாளர்கள் (அனைத்து பயனர்கள்): %s',
        globalVisitorsErr: 'உலகளாவிய பார்வையாளர்களின் எண்ணிக்கையை ஏற்ற முடியவில்லை.',
        syncTitle: 'ஒத்திசைவு',
        syncLabel: 'சேனல்களை சாதனங்களுக்கு இடையே ஒத்திசை',
        syncHint: 'நீங்கள் சேர்க்கும் சேனல்கள் இந்தப் பக்கத்தைத் திறக்கும் ஒவ்வொரு சாதனம் அல்லது உலாவிக்கும் ஒத்திசைக்கப்படும்.',
        syncStatus: 'ஒத்திசைக்கப்பட்ட சேனல்கள்: %s',
        syncNow: 'இப்போது ஒத்திசை',
        syncing: 'ஒத்திசைக்கிறது...',
        syncErr: 'ஒத்திசைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.',
        visitCount: 'இந்தப் பக்கம் இந்த சாதனத்தில் %s முறை திறக்கப்பட்டது.',
        videoFilterTitle: 'வீடியோக்கள்',
        embedFilterLabel: 'இயக்க முடியாத வீடியோக்களை மறை',
        embedFilterHelp: 'உட்பொதித்தலைத் தடுக்கும் அல்லது YouTube வெளியே கிடைக்காத வீடியோக்கள் தானாக மறைக்கப்படும்.',
        recheckBtn: 'மீண்டும் சரிபார்',
        checkingVideos: 'வீடியோக்களை சரிபார்க்கிறது',
        hiddenVideos: 'மறைக்கப்பட்ட வீடியோக்கள்',
        noHiddenVideos: 'மறைக்கப்பட்ட வீடியோக்கள் இல்லை',
        filterOffNote: 'வீடியோ வடிகட்டி முடக்கப்பட்டுள்ளது',
    },
};

/* ────────────────────────────────────────
   STATE
──────────────────────────────────────── */
let lang = 'ms';
let activeChannel = 'all';
let query = '';
const playerVideoId = null;

/* ────────────────────────────────────────
   HELPERS
──────────────────────────────────────── */
const $ = (sel) => document.querySelector(sel);
const t = (key) => (I18N[lang] && I18N[lang][key]) || I18N.ms[key] || key;

function thumb(v) { return `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`; }

function embedUrl(v, autoplay = false) {
    // youtube-nocookie: no tracking cookies. rel=0: no unrelated rabbit-holes.
    // enablejsapi: benarkan postMessage playVideo (fallback autoplay iOS Safari).
    const ap = autoplay ? '&autoplay=1' : '';
    return `https://www.youtube-nocookie.com/embed/${v.id}?rel=0&modestbranding=1&playsinline=1&color=white&enablejsapi=1${ap}`;
}

function watchUrl(v) { return `https://www.youtube.com/watch?v=${v.id}`; }

/* Bahasa video: mula-mula semak tag v.lang (dari YouTube API), kemudian
   heuristik tajuk, akhir sekali bahasa saluran. */
const MS_TITLE_HINTS = [
    'bahasa melayu', 'bahasa malaysia', 'melayu', 'lagu kanak', 'kanak kanak',
    'anak yu', 'boboiboy', 'upin', 'ipin', 'ejen ali', 'didi & friends', 'didi and friends',
    'omar & hana', 'omar and hana', 'little ammar', 'kikako', 'musim', 'episod',
    'ramadan', 'raya', 'eid', 'jom', 'kita', 'mari', 'saya', 'belajar', 'buku',
];

function msTitleScore(title) {
    const tl = title.toLowerCase();
    let score = 0;
    MS_TITLE_HINTS.forEach((k) => { if (tl.includes(k)) score += 1; });
    return score;
}

function videoLang(v) {
    if (v.lang) return v.lang;
    const chMeta = allChannels()[v.ch] || {};
    const byChannel = chMeta.lang || '';
    const byTitle = msTitleScore(v.title) >= 2 ? 'ms' : '';
    return byTitle || byChannel || '';
}

function filterVideos() {
    const q = query.toLowerCase().trim();
    const chs = allChannels();
    let list = allVideos().filter((v) => {
        const chOk = activeChannel === 'all' || v.ch === activeChannel;
        const chMeta = chs[v.ch] || {};
        const chLabel = (chMeta.label || v.ch).toLowerCase();
        const qOk = !q || v.title.toLowerCase().includes(q) || chLabel.includes(q);
        return chOk && qOk;
    });
    // Fokus bahasa Melayu: video BM dulu, kemudian video lain.
    list.forEach((v) => { v._ms = videoLang(v) === 'ms' ? 0 : 1; });
    list.sort((a, b) => a._ms - b._ms);
    return list;
}

/* ────────────────────────────────────────
   RENDER
──────────────────────────────────────── */
function renderTabs() {
    const nav = $('#channelTabs');
    const chs = allChannels();
    let html = `<button class="ch-tab" data-channel="all"><span class="ch-icon">✨</span><span>${t('tabAll')}</span></button>`;
    Object.keys(chs).forEach((key) => {
        const c = chs[key];
        html += `<button class="ch-tab" data-channel="${key}"><span class="ch-icon">${c.icon}</span><span>${c.label}</span></button>`;
    });
    nav.innerHTML = html;
    const ok = activeChannel === 'all' || chs[activeChannel];
    if (!ok) activeChannel = 'all';
    nav.querySelectorAll('.ch-tab').forEach((b) => {
        b.classList.toggle('active', b.dataset.channel === activeChannel);
    });
}
function renderHero() {
    const list = filterVideos();
    const hero = list[0];
    if (!hero) {
        $('#heroSection').style.display = 'none';
        return;
    }
    $('#heroSection').style.display = '';
    $('#heroVideo').innerHTML = `<img src="${thumb(hero)}" alt="${hero.title}" loading="lazy">`;
    $('#heroTitle').textContent = hero.title;
    $('#heroDesc').textContent = `${(allChannels()[hero.ch] || {}).label || hero.ch} • youtube.com`;
    $('#heroPlayBtn').dataset.id = hero.id;
    $('#heroVideo').dataset.id = hero.id;
}

function renderGrid() {
    const list = filterVideos();
    const grid = $('#videoGrid');
    grid.innerHTML = '';

    list.forEach((v, i) => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.style.animationDelay = `${Math.min(i * 0.04, 0.4)}s`;
        const chMeta = allChannels()[v.ch] || { label: v.ch, cls: 'ch-cx0' };
        card.innerHTML = `
            <div class="card-thumb">
                <span class="card-channel-badge ${chMeta.cls}">${chMeta.label}</span>
                <img src="${thumb(v)}" alt="${v.title}" loading="lazy">
            </div>
            <div class="card-info">
                <div class="card-title">${v.title}</div>
                <div class="card-channel">${chMeta.label}</div>
            </div>`;
        card.addEventListener('click', () => openPlayer(v));
        grid.appendChild(card);
    });

    $('#emptyState').hidden = list.length > 0;
    $('#sectionTitle').textContent =
        t('recent') + (activeChannel === 'all' ? '' : ` — ${(allChannels()[activeChannel] || {}).label || activeChannel}`);
}

/* ────────────────────────────────────────
   PLAYER MODAL
──────────────────────────────────────── */
function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function renderSuggestions(current) {
    const box = $('#suggestBox');
    const pool = allVideos().filter((v) => v.id !== current.id);
    // Utamakan video bahasa Melayu dahulu, kemudian yang lain.
    const sorted = pool.slice().sort((a, b) => {
        const msA = videoLang(a) === 'ms' ? 0 : 1;
        const msB = videoLang(b) === 'ms' ? 0 : 1;
        return msA - msB;
    });
    const picked = sorted.slice(0, 8);
    box.innerHTML = '';
    picked.forEach((v) => {
        const item = document.createElement('div');
        item.className = 'sug-item';
        item.innerHTML = `
            <img src="${thumb(v)}" alt="${v.title}" loading="lazy">
            <div class="sug-info">
                <div class="sug-title">${v.title}</div>
                <div class="sug-channel">${(allChannels()[v.ch] || {}).label || v.ch}</div>
            </div>`;
        item.addEventListener('click', () => loadVideo(v));
        box.appendChild(item);
    });
}

function loadVideo(v) {
    $('#playerTitle').textContent = v.title;
    $('#playerChannel').textContent = (allChannels()[v.ch] || {}).label || v.ch;
    $('#playerDesc').textContent = `https://youtu.be/${v.id}`;
    const frame = $('#playerFrame');
    // iOS Safari kadang-kadang abaikan autoplay=1 — jadi kita hantar arahan
    // playVideo melalui postMessage sebaik sahaja iframe siap dimuat.
    frame.onload = () => {
        try {
            frame.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
        } catch (e) { /* ignore */ }
    };
    frame.src = embedUrl(v, true);
    renderSuggestions(v);
    frame.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function openPlayer(v) {
    // iOS Safari: modal kena nampak (display:flex) DULU sebelum src iframe
    // di-set dengan autoplay — autoplay hanya dibenarkan jika iframe visible
    // dan src di-set dalam gesture klik yang sama (synchronous).
    $('#playerModal').classList.add('open');
    document.body.style.overflow = 'hidden';
    loadVideo(v);
}

function closePlayer() {
    $('#playerModal').classList.remove('open');
    $('#playerFrame').src = '';
    document.body.style.overflow = '';
}

/* ────────────────────────────────────────
   I18N / THEME
──────────────────────────────────────── */
function applyI18n() {
    $('#langBtn').textContent = LANGS.find((l) => l.code === lang).label;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
        el.placeholder = t(el.dataset.i18nPh);
    });
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
        el.title = t(el.dataset.i18nTitle);
    });
    // Re-render dynamic text
    renderTabs();
    renderChannelList();
    refreshSettingsStats();
    renderHero();
    renderGrid();
}

function cycleLang() {
    const idx = LANGS.findIndex((l) => l.code === lang);
    lang = LANGS[(idx + 1) % LANGS.length].code;
    localStorage.setItem('utube-lang', lang);
    applyI18n();
}

function initTheme() {
    const saved = localStorage.getItem('utube-night');
    if (saved === '1') document.body.classList.add('night');
}

/* ────────────────────────────────────────
   SETTINGS — linked channels & add channel
──────────────────────────────────────── */
function openSettings() {
    refreshSettingsStats();
    renderChannelList();
    hideFeedback();
    $('#settingsModal').classList.add('open');
}

function refreshSettingsStats() {
    const n = parseInt(localStorage.getItem('utube-visits') || '0', 10) || 0;
    const vc = $('#visitCount');
    if (vc) vc.textContent = t('visitCount').replace('%s', String(n));
    updateGlobalVisitsUI();
    const tg = $('#embedFilterToggle');
    if (tg) tg.checked = embedFilterOn();
    updateEmbedProgress();
}

function closeSettings() {
    $('#settingsModal').classList.remove('open');
    hideFeedback();
}

function showFeedback(msg, ok = false) {
    const fb = $('#settingsFeedback');
    fb.textContent = msg;
    fb.hidden = false;
    fb.className = 'settings-feedback' + (ok ? ' ok' : ' err');
}

function hideFeedback() {
    const fb = $('#settingsFeedback');
    fb.hidden = true;
    fb.textContent = '';
    fb.className = 'settings-feedback';
}

function renderChannelList() {
    const box = $('#channelList');
    const chs = allChannels();
    const order = Object.keys(CHANNELS).concat(getCustomChannels().map((c) => c.key));
    box.innerHTML = '';
    order.forEach((key) => {
        const c = chs[key];
        if (!c) return;
        const item = document.createElement('div');
        item.className = 'channel-list-item';
        const dot = `<span class="ch-dot ${c.cls}"></span>`;
        const info = `
            <div class="ch-info">
                <div class="ch-name">${c.label}</div>
                <div class="ch-handle">${c.handle || ''}</div>
            </div>`;
        const action = c.custom
            ? `<button class="ch-remove" data-key="${key}" title="${t('remove')}" aria-label="${t('remove')}">✕</button>`
            : `<span class="ch-badge-builtin">${t('builtinBadge')}</span>`;
        item.innerHTML = dot + info + action;
        box.appendChild(item);
    });
    box.querySelectorAll('.ch-remove').forEach((btn) => {
        btn.addEventListener('click', () => {
            if (confirm(t('removeConfirm'))) removeCustomChannel(btn.dataset.key);
        });
    });
}

function removeCustomChannel(key) {
    const list = getCustomChannels().filter((c) => c.key !== key);
    saveCustomChannels(list);
    if (activeChannel === key) activeChannel = 'all';
    renderTabs();
    renderChannelList();
    renderHero();
    renderGrid();
}

function parseChannelId(input) {
    const s = input.trim();
    const m = s.match(/(UC[A-Za-z0-9_-]{22})/);
    return m ? m[1] : null;
}

async function fetchChannelVideosKeyless(channelId) {
    // Muatkan suapan RSS saluran melalui beberapa proksi CORS (tanpa kunci API).
    const feed = 'https://www.youtube.com/feeds/videos.xml?channel_id=' + encodeURIComponent(channelId);
    const urls = [
        'https://corsproxy.io/?url=' + encodeURIComponent(feed),
        'https://api.allorigins.win/raw?url=' + encodeURIComponent(feed),
        'https://cors.eu.org/' + feed,
    ];
    for (const u of urls) {
        try {
            const res = await fetch(u);
            if (!res.ok) continue;
            const xml = await res.text();
            const ids = [...xml.matchAll(/<yt:videoId>([A-Za-z0-9_-]{11})<\/yt:videoId>/g)].map((m) => m[1]);
            const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map((m) => m[1].trim());
            if (ids.length) {
                const vids = ids.map((id, i) => ({ id, title: titles[i + 1] || 'Video' }));
                return { title: titles[0] || channelId, videos: vids };
            }
        } catch (e) {
            // cuba proksi seterusnya
        }
    }
    return null;
}

async function addChannel() {
    const input = $('#customChannelInput').value.trim();
    if (!input) { showFeedback(t('errEmpty'), false); return; }
    const channelId = parseChannelId(input);
    if (!channelId) { showFeedback(t('errInvalid'), false); return; }
    if (CHANNELS[channelId] || getCustomChannels().some((c) => c.key === channelId)) {
        showFeedback(t('errDuplicate'), false);
        return;
    }

    const btn = $('#addChannelBtn');
    const oldText = btn.textContent;
    btn.disabled = true;
    btn.textContent = t('checking');
    try {
        const data = await fetchChannelVideosKeyless(channelId);
        if (!data || data.videos.length === 0) {
            showFeedback(t('errFetch'), false);
            return;
        }
        // Malay-first: susun video Bahasa Melayu di hadapan.
        data.videos.forEach((v) => { if (msTitleScore(v.title) >= 2) v.lang = 'ms'; });
        data.videos.sort((a, b) => ((a.lang === 'ms') ? 0 : 1) - ((b.lang === 'ms') ? 0 : 1));
        const list = getCustomChannels();
        list.push({ key: channelId, label: data.title, handle: '', videos: data.videos });
        saveCustomChannels(list);
        $('#customChannelInput').value = '';
        renderTabs();
        renderChannelList();
        renderHero();
        renderGrid();
        if (embedFilterOn()) runEmbedCheck();
        showFeedback(t('added'), true);
    } catch (e) {
        showFeedback(t('errFetch'), false);
    } finally {
        btn.disabled = false;
        btn.textContent = oldText;
    }
}

function initSettings() {
    renderChannelList();
    refreshSettingsStats();
}

/* ────────────────────────────────────────
   EVENTS
──────────────────────────────────────── */
function bindEvents() {
    $('#langBtn').addEventListener('click', cycleLang);

    $('#nightBtn').addEventListener('click', () => {
        const on = document.body.classList.toggle('night');
        localStorage.setItem('utube-night', on ? '1' : '0');
    });

    $('#channelTabs').addEventListener('click', (e) => {
        const tab = e.target.closest('.ch-tab');
        if (!tab) return;
        document.querySelectorAll('.ch-tab').forEach((x) => x.classList.remove('active'));
        tab.classList.add('active');
        activeChannel = tab.dataset.channel;
        renderHero();
        renderGrid();
    });

    $('#settingsBtn').addEventListener('click', openSettings);
    $('#settingsCloseBtn').addEventListener('click', closeSettings);
    $('#settingsModal').addEventListener('click', (e) => {
        if (e.target === $('#settingsModal')) closeSettings();
    });
    $('#embedFilterToggle').addEventListener('change', (e) => {
        setEmbedFilterOn(e.target.checked);
        renderHero();
        renderGrid();
        updateEmbedProgress();
        if (e.target.checked) runEmbedCheck();
    });
    $('#embedRecheckBtn').addEventListener('click', () => {
        runEmbedCheck(true);
    });
    $('#addChannelBtn').addEventListener('click', addChannel);
    $('#customChannelInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addChannel();
    });

    let debounce;
    $('#searchInput').addEventListener('input', (e) => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
            query = e.target.value;
            renderHero();
            renderGrid();
        }, 180);
    });

    $('#heroPlayBtn').addEventListener('click', (e) => {
        const v = findVideoById(e.currentTarget.dataset.id);
        if (v) openPlayer(v);
    });

    $('#heroVideo').addEventListener('click', (e) => {
        const v = findVideoById(e.currentTarget.dataset.id);
        if (v) openPlayer(v);
    });

    $('#closeBtn').addEventListener('click', closePlayer);
    $('#playerModal').addEventListener('click', (e) => {
        if (e.target === $('#playerModal')) closePlayer();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if ($('#settingsModal').classList.contains('open')) closeSettings();
            else closePlayer();
        }
    });
}

/* ────────────────────────────────────────
   BOOT
──────────────────────────────────────── */
(function init() {
    const savedLang = localStorage.getItem('utube-lang');
    if (savedLang && LANGS.some((l) => l.code === savedLang)) lang = savedLang;
    bumpVisits();
    refreshGlobalVisits();
    initTheme();
    initSettings();
    renderTabs();
    bindEvents();
    applyI18n();
    renderHero();
    renderGrid();
    if (embedFilterOn()) runEmbedCheck();
})();
