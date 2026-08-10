/* ═══════════════════════════════════════════
   UTube Maheera — KANAK-KANAK — app.js
   Kids-safe video browser: only official videos
   from popular Malay kids channels. No ads, no
   related-video rabbit holes (rel=0), no comments.
═══════════════════════════════════════════ */

/* ────────────────────────────────────────
   VIDEO DATABASE
   Every ID below is a real, official upload
   from the channel indicated (Monsta or the
   Omar & Hana / Durioo+ family of channels).
   Add or remove entries freely — thumbnails
   and embeds are derived from the YouTube ID.
──────────────────────────────────────── */
const CHANNELS = {
    monsta:    { label: 'MONSTA',       cls: 'ch-monsta',    color: '#e63946' },
    papazola:  { label: 'Papa Zola',    cls: 'ch-papazola',  color: '#f97316' },
    upinipin:  { label: 'Upin & Ipin',  cls: 'ch-upinipin',  color: '#10b981' },
    ejenali:   { label: 'Ejen Ali',     cls: 'ch-ejenali',   color: '#2563eb' },
    didi:      { label: 'Didi & Friends', cls: 'ch-didi',    color: '#f59e0b' },
    durioo:    { label: 'Durioo+',      cls: 'ch-durioo',    color: '#6d28d9' },
    msrachel:  { label: 'Ms Rachel',    cls: 'ch-msrachel',  color: '#ec4899' },
    alifsofia: { label: 'Alif & Sofia', cls: 'ch-alifsofia', color: '#ec4899' },
    omarhana:  { label: 'Omar & Hana',  cls: 'ch-omarhana',  color: '#16a34a' },
    learnwithzakaria: { label: 'Learn with Zakaria', cls: 'ch-zakaria', color: '#0891b2' },
};

const VIDEOS = [
    // MONSTA
    { id: 'QqulOB3K7VI', ch: 'monsta', title: 'Ochobot Coincase?!!💰 | Let\'s Save Up For BoBoiBoy Movie 3 #OchobotCoincase' },
    { id: 'PXkCbnbnfH8', ch: 'monsta', title: 'BoBoiBoy vs The Strongest Enemy in the Galaxy' },
    { id: 'yRu4Nc2hjCg', ch: 'monsta', title: 'Monsta Galaxy Card Academia League 2026 | Tournament Kedua Kuala Lumpur' },
    { id: 'FuVIpAFP8vA', ch: 'monsta', title: 'Papa Pipi Series | Teaser Trailer - 5 December 2026' },
    { id: 'iJPNFhNzyO8', ch: 'monsta', title: 'Monsta Galaxy Card Academia League 2026 | Lokasi Pertama Kuala Lumpur' },
    { id: 'YjkAQOR-O_w', ch: 'monsta', title: 'BoBoiBoy Movie 3 | Teaser Date Announcement' },
    { id: 'ZaK8YImgD64', ch: 'monsta', title: 'Terima Kasih, Ayah! | Hari Bapa Special' },
    { id: 'P_Fz8Cbtnic', ch: 'monsta', title: 'Kenangan Amato bersama Tok Aba' },
    { id: '62zHn0QObSQ', ch: 'monsta', title: '4K Ultra HDR | BoBoiBoy Galaxy Season 2 Final Fights' },
    { id: 'fMuDCyLRuQ0', ch: 'monsta', title: 'BoBoiBoy VS Tumbosaurus Rex! 🦖 | Kompilasi BoBoiBoy Galaxy SORI' },
    { id: 'DwuIPdMGMKc', ch: 'monsta', title: 'Pertempuran BARAJU | KOMPILASI' },
    { id: 'NvwK7hvEf-M', ch: 'monsta', title: 'Kemunculan BoBoiBoy Tahap Tiga! #boboiboy15' },
    { id: 'Q6FgogcaYAg', ch: 'monsta', title: 'BoBoiBoy Galaxy™ | Marathon #BoBoiBoy15' },
    { id: 'CYfgjup7CG4', ch: 'monsta', title: 'Mechamato™ I Musim 4 Marathon' },
    { id: 'SKVoCkEVvw0', ch: 'monsta', title: 'The arrival of Maharani Kira\'na! | Pek Bolt Impact #BoBoiBoy15' },
    { id: '0RiJKFjcHzM', ch: 'monsta', title: 'BoBoiBoy The Movie™ | Full Animated Film in HD (English Dub)' },
    { id: 'JXcMu0jmeQQ', ch: 'monsta', title: 'BoBoiBoy OST: Kotak - Jagalah Bumi (Theme from BoBoiBoy)' },
    { id: 'arJHUK4djaY', ch: 'monsta', title: 'BoBoiBoy Galaxy SORI™ | Marathon' },
    { id: 'G4ZVuKovGGY', ch: 'monsta', title: 'BoBoiBoy Galaxy EP12 | Si Penceroboh Panto / Phantom Thief Panto (ENG Subtitles)' },
    { id: 'ygkSYrXsLik', ch: 'monsta', title: 'BoBoiBoy Galaxy - Season 1 Finale EP24 | Sinaran Penamat / Light of Hope (ENG Subtitles)' },
    { id: 'BZ0Tw2KvWZE', ch: 'monsta', title: 'BoBoiBoy Movie 2™️ | TGV PSA COMPILATION' },
    { id: '1KYddgEZCyI', ch: 'monsta', title: 'Episod 19: Kejutan BoBoiBoy Air | BoBoiBoy Musim 3' },
    { id: 'YyjVgpocQTI', ch: 'monsta', title: 'BoBoiBoy Movie 2 OST || Fire & Water - Faizal Tahir [Official Music Video]' },
    { id: 'kGvaS9R9NSc', ch: 'monsta', title: 'Monsta Announcement Reel' },
    { id: 'EqjDaUx0YZk', ch: 'monsta', title: 'Episod 2: BoBoiBoy vs Ejo Jo Finale | BoBoiBoy Musim 3' },
    { id: 'wm1HL4Z9WVs', ch: 'monsta', title: 'Episod 6: Khidmat Wak Ba Ga Ga | BoBoiBoy Musim 3' },
    { id: '2k-Xk8u_T9c', ch: 'monsta', title: 'Episod 14 - Robot Pango & Raksasa Bawang | BoBoiBoy Musim 3' },
    { id: 'g9wSW-OdlhI', ch: 'monsta', title: 'BoBoiBoy™ | Season 1 Marathon' },
    { id: 'rplcxeDdx3o', ch: 'monsta', title: 'BoBoiBoy OST: Fang Theme' },
    { id: 'aI8shkpSBXA', ch: 'monsta', title: 'BoBoiBoy: The Movie Teaser Theme OST' },
    { id: 'MFgg1EMGIdY', ch: 'monsta', title: 'Hangat 🔥 atau Dingin ❄️?' },
    { id: 'zp6Cw8qXd4I', ch: 'monsta', title: 'Jangan Bagi Daun Dekat Dengan Solar! (Koleksi Gaduh) #BoBoiBoy15' },
    { id: '5g2023uiSuo', ch: 'monsta', title: 'Aura Farming Boboiboy Sopan vs Boboiboy Level 3 #BoBoiBoy15' },
    { id: 'GOV4dPesuk0', ch: 'monsta', title: 'Kompilasi Iklan Raya Monsta #BoBoiBoy15' },
    { id: '5-7MdjYameU', ch: 'monsta', title: 'Mecha Mega Koncho vs Robot Mega Pak Pato | Pek Champions Rise' },
    { id: 'j4vUO0pOzBY', ch: 'monsta', title: 'Masa untuk bro-broku bersinar!✨| FGURA GEMPA & HALILINTAR #BoBoiBoy15' },
    { id: 'GbDLd74tFjI', ch: 'monsta', title: 'BoBoiBoy Galaxy GENTAR™ | Marathon' },
    { id: '7Cl4k1sQ9o4', ch: 'monsta', title: 'EPISOD 05 - BoBoiBoy Galaxy SORI | Puak Purba Kadruax!' },
    { id: 'KMIv6BNHBlc', ch: 'monsta', title: 'BoBoiBoy Galaxy EP16 | Loopa Lupa? / Looping Loopa (ENG Subtitles)' },
    { id: '-ZJ5JS6rTh4', ch: 'monsta', title: 'BoBoiBoy Galaxy - Lanun Angkasa! | Animasi Kanak-kanak (42 Minit)' },
    { id: '0ldB8JYUuOU', ch: 'monsta', title: 'BoBoiBoy Galaxy EP23 | Ancaman Armada / Pirate Armada Invasion (ENG Subtitles)' },
    { id: 'ZiPCagQs7H0', ch: 'monsta', title: 'BoBoiBoy Galaxy EP10 | Ujian KENTAL / The Savage Trial (ENG Subtitles)' },
    { id: 'kp1oX7WQjQE', ch: 'monsta', title: 'Episod 4: Kerjasama BuBaDiBaKo | BoBoiBoy Musim 3' },
    { id: 'CYb26MFB9Og', ch: 'monsta', title: 'KOMPILASI CATTUS - BOBOIBOY GALAXY 🐱🐱🐱' },
    { id: 'Ik9zLjkPdxs', ch: 'monsta', title: 'Jom baca niat berpuasa bersama Otoi! 🤲🏻' },
    { id: '4vyD83QEZFM', ch: 'monsta', title: 'Rawr rawr di bioskop sek-rawr-ang!' },
    { id: 'QWjzRfAMFrs', ch: 'monsta', title: 'Monsta Fiesta 2025 Draws Down the Curtain' },
    { id: 'GjDeGQ_VyGs', ch: 'monsta', title: 'Finale Monsta Galaxy Card Academia League di Monsta Fiesta 2025!' },
    { id: '4Cjm0vZM2O0', ch: 'monsta', title: 'BoBoiBoy Galaxy EP15 | Perlumbaan Nova Prix / Nova Prix Space Race (ENG Subtitles)' },
    { id: 'Dq7ZPKve7fE', ch: 'monsta', title: 'Bunkface - Masih Di Sini (BoBoiBoy The Movie OST)' },
    { id: 'NDWVshCJe6U', ch: 'monsta', title: 'Episod 20: Bangkit BoBoiBoy Air! | BoBoiBoy Musim 3' },
    { id: 'KKo1Jv8K6uk', ch: 'monsta', title: 'Gopal Makan CICAK ANGKASA #BoBoiBoyGalaxy | Part 19' },
    { id: 'q-RgSIH7E58', ch: 'monsta', title: 'EPISOD 02 - BoBoiBoy Galaxy SORI | Rahsia King Balakung' },
    { id: 'nS0dOCtXNVU', ch: 'monsta', title: 'BoBoiBoy Galaxy BARAJU™ | Marathon' },

    // PAPA ZOLA
    { id: '7Ebg7nEeP2E', ch: 'papazola', title: 'PAPA ZOLA THE MOVIE | Official Trailer (Korean Dub)' },
    { id: '3lw1cd4F5K0', ch: 'papazola', title: 'Episod 10: Papa Zola & Mama Zila | BoBoiBoy Musim 3' },
    { id: 'DuGpjkh2oyk', ch: 'papazola', title: 'All Official Clips | Papa Zola The Movie' },
    { id: 'rB6O6Z2TOYQ', ch: 'papazola', title: 'Kemunculan Oboi Mon dan Opal Mon | Papa Zola The Movie (Official Clip)' },
    { id: 'rp8jK93wYR4', ch: 'papazola', title: 'TRAILER INDONESIA | Papa Zola The Movie' },
    { id: 'obG20EkKTZ0', ch: 'papazola', title: 'Otoi Ikut Camping | Papa Zola The Movie (Deleted Scene)' },
    { id: 'hP7Hj2NQ-wk', ch: 'papazola', title: 'Papa Zola The Movie - Official International Trailer | Now On Netflix' },
    { id: 'fxTGE4vtS3A', ch: 'papazola', title: 'Papa Zola The Movie - Treler Rasmi Esok' },

    // UPIN & IPIN
    { id: 'Sr0ZmSgAhGA', ch: 'upinipin', title: 'Upin & Ipin Fun Run 2026 (Video Promo 02)' },
    { id: '9uzi_NPBsEA', ch: 'upinipin', title: 'Upin & Ipin Fun Run 2026 (Video Promo)' },
    { id: 'UAwn-xmYLuw', ch: 'upinipin', title: 'Di Sebalik Tabir : Rakaman Suara bersama Hideko' },
    { id: 'DGnBLzlEu_8', ch: 'upinipin', title: 'Upin & Ipin Musim 20 - Minyak Sawit Luar Biasa (Episod Baru)' },
    { id: 'AkDwG_lersA', ch: 'upinipin', title: 'Di Sebalik Tabir : Legasi Kuasa' },
    { id: '3ZKzGJNScgw', ch: 'upinipin', title: 'Jawapan Carian Nombor 20 - Kembara Sambil Belajar' },
    { id: 'KbA6v5j8fqs', ch: 'upinipin', title: 'Kompilasi Upin & Ipin Musim 15' },
    { id: 'WS2Mo_1npHQ', ch: 'upinipin', title: 'Upin & Ipin - Susu Luar Biasa (Full Episode)' },
    { id: 'HuKTl8wYId0', ch: 'upinipin', title: 'Soalan Kuiz Upin & Ipin - Temanku Susanti (Musim 16)' },
    { id: '7-XciskK-ow', ch: 'upinipin', title: 'Upin & Ipin - Selamat Hari Raya Aidiladha' },
    { id: 'Zdkiw0Q_668', ch: 'upinipin', title: 'Soalan Kuiz Upin & Ipin - Belajar Sambil Main (Musim 8)' },
    { id: 'FUFUdtocbdo', ch: 'upinipin', title: 'Kompilasi Episod Upin & Ipin Menjadi Objek' },
    { id: 'RM8k1GPK2wU', ch: 'upinipin', title: 'Les\' Copaque Star Outstanding Business Awards 2026' },
    { id: 'ALHjhrcwD-E', ch: 'upinipin', title: 'Di Sebalik Tabir : Rakaman Suara bersama Dato\' Lat' },
    { id: 'vQqIvISGnFo', ch: 'upinipin', title: 'Upin & Ipin Musim 20 - End Credit Raya' },
    { id: 'mOGPhtqeAmY', ch: 'upinipin', title: 'Kompilasi Episod Ramadan Upin & Ipin (Musim 1-19)' },
    { id: 'bqPqp_XLLTU', ch: 'upinipin', title: 'Upin & Ipin - Goyang Upin & Ipin [Music Video]' },
    { id: 'PiWDylHIoRk', ch: 'upinipin', title: 'Promo LINE Malaysia - Upin & Ipin Official Account with Free Stickers' },
    { id: 'uv8Y3sNCXK8', ch: 'upinipin', title: 'Upin & Ipin Musim 10 - Aku Sebuah Jam HD (Full Episode)' },
    { id: '_MqrP0FQpeY', ch: 'upinipin', title: 'Upin & Ipin - Ibu Ayam Dikejar Musang [Sing-Along][HD]' },
    { id: 'NSOko9Zv4BA', ch: 'upinipin', title: 'Menari & Menyanyi Bersama Upin & Ipin' },
    { id: '7Sb3j-xlAUY', ch: 'upinipin', title: 'Upin & Ipin - Beli, Pakai, Suka (Full Episode)' },
    { id: 'E4R_e9bkLgg', ch: 'upinipin', title: 'Kompilasi Upin & Ipin Musim 17' },
    { id: 'JTagRU66Kg4', ch: 'upinipin', title: 'Upin & Ipin Musim 16 - Lindung Diri Dan Keluarga (Episod Penuh)' },
    { id: 'G6XHDD4-n2w', ch: 'upinipin', title: 'Upin & Ipin - Upin, Ipin dan Apin (Bahagian 1)' },
    { id: 'qdiCxlhDux8', ch: 'upinipin', title: 'Upin & Ipin - Jejak Rembo (Bahagian 3)' },
    { id: 'h8IJo0iUFo8', ch: 'upinipin', title: 'Upin & Ipin - Berpuasa Bersama Kawan Baru (Bahagian 1)' },
    { id: 'p6oTi6phReI', ch: 'upinipin', title: 'Upin & Ipin - Seronoknya Membaca (Bahagian 3)' },
    { id: 'o3RaiDhZRXk', ch: 'upinipin', title: 'Upin & Ipin - Kembara Ke Pulau Harta Karun (Bahagian 5)' },
    { id: 'jDMjSD3iZxM', ch: 'upinipin', title: 'Upin & Ipin - Ambil Galah Tolong Tunjukkan (Bahagian 3)' },
    { id: 'CJLO-jEQmoU', ch: 'upinipin', title: 'Upin & Ipin - Kembara Ke Pulau Harga Karun (Bahagian 7)' },
    { id: 'sQ0JGuqWIfo', ch: 'upinipin', title: 'Interview Bluehyppo - Faren (Music Composer)' },
    { id: 'APSCh00uEtQ', ch: 'upinipin', title: 'Mari saksikan episod terbaru Upin & Ipin Musim 20, Pelita Panjut! #shorts #upinipin #pelitapanjut' },
    { id: 'LJZD9qjXCPA', ch: 'upinipin', title: 'Kompilasi Upin & Ipin Musim 19' },
    { id: '9QhyLMMywiQ', ch: 'upinipin', title: 'Upin & Ipin - Kruk Krak Snek Sedap [Music Video + End Credit]' },
    { id: '9TRaEyenvhI', ch: 'upinipin', title: 'Upin & Ipin Musim 19 - Kruk Krak Snek Sedap (Episod Baru)' },
    { id: 'iuLuYdl_41o', ch: 'upinipin', title: 'Upin & Ipin - Medley Sponsor (Music Video)' },
    { id: 'FhN33ZjnnzI', ch: 'upinipin', title: 'Les\' Copaque Production 2025 Achievements' },
    { id: 'MPf6rKQsBKQ', ch: 'upinipin', title: 'Upin & Ipin Musim 19 – Gulai Kemahang (Promo)' },
    { id: '4cOUSEpFDrk', ch: 'upinipin', title: 'Puteri Nipis (Official Teaser)' },
    { id: 'eQvGHNZINUg', ch: 'upinipin', title: 'Kompilasi Muzik Video Upin & Ipin' },
    { id: 'wamVWDI-RLw', ch: 'upinipin', title: 'Kompilasi Episod Ramadhan Upin & Ipin' },
    { id: 'Ha-bixVRkGI', ch: 'upinipin', title: 'Upin & Ipin Iqra\' - Surah Al-Ikhlas & Surah Al-Falaq' },
    { id: 'dpDR2_wyFbc', ch: 'upinipin', title: 'Upin & Ipin - Ultraman Ribut II (Eng/Jap Sub)' },
    { id: 'aBSIisKGgdI', ch: 'upinipin', title: 'Upin & Ipin Musim 13 - Bila Hujan Turun' },
    { id: 'gMsL7ocTEIA', ch: 'upinipin', title: 'Upin & Ipin - Ultraman Ribut (Sing - Along)' },
    { id: 'hgh4WDgl9S8', ch: 'upinipin', title: 'Upin & Ipin - Lagu Pisang Goreng Ngap Ngap! [Sing-Along]' },
    { id: 'kyFl--pAo_8', ch: 'upinipin', title: 'Upin & Ipin - Basikal Baru (Bah. 2)' },
    { id: 'fgzxhrwUh-g', ch: 'upinipin', title: 'Interview Bluehyppo - Kak Ros (Script Writer)' },
    { id: 'CMfVzTMZgEI', ch: 'upinipin', title: 'gosokjgntakgosok3.mov' },
    { id: '2WPnbXc1gMM', ch: 'upinipin', title: 'Demam Bola Piala Dunia LCP' },
    { id: 'wgO-_X4po1g', ch: 'upinipin', title: 'Teater Upin & Ipin di Indonesia (Teaser)' },
    { id: 'Wa2b8mo1kOQ', ch: 'upinipin', title: 'Promo Karnival Upin & Ipin di Melaka Wonderland (4 - 7 Disember 2010)' },
    { id: 'dQsal8QkxUg', ch: 'upinipin', title: 'Upin & Ipin - Air Kolah, Air Laut (Bah. 2)' },
    { id: 'w47EvlQGf8Y', ch: 'upinipin', title: 'Upin & Ipin - Berkebun (Bah. 2)' },
    { id: 'sOMK_ozIJLo', ch: 'upinipin', title: 'Upin & Ipin - Kisah Dua Malam (Bah. 2)' },
    { id: '1IRDf-KX4ts', ch: 'upinipin', title: 'LCXPO 2025 - LEPAK @ Les\' Copaque Podcast' },
    { id: 'U-7KZ8s4YN0', ch: 'upinipin', title: 'Pada Zaman Dahulu Musim 6 - Arnab & Katak' },
    { id: 'ZXPEuNbtHxs', ch: 'upinipin', title: 'Lawatan dari Les\' Copaque Animation Academy' },
    { id: '8fDhJwpXxVc', ch: 'upinipin', title: 'Lawatan dari Institut Penyiaran dan Penerangan Tun Abdul Razak (IPPTAR)' },

    // EJEN ALI
    { id: 'Fbf1IZUuHgE', ch: 'ejenali', title: 'Ejen Ali × Spritzer Tinge' },
    { id: 'RfWyzNbcGu4', ch: 'ejenali', title: 'Some Other Day | FUGŌ | Official Music Video OST Ejen Ali The Movie 2' },
    { id: 'rRVgCUvuxE8', ch: 'ejenali', title: 'PENJUARA | HAEL HUSAINI | OFFICIAL MUSIC VIDEO OST EJEN ALI THE MOVIE 2' },
    { id: 'pK32GhMk7-I', ch: 'ejenali', title: '⚡MISI BIJAK TENAGA BERSAMA EJEN ALI DAN JERO⚡' },
    { id: '1mnIN5tyAiE', ch: 'ejenali', title: 'Teman Sejati | NIDJI | OST Klip dari Ejen Ali The Movie 2' },
    { id: '1iIkVsAxxIY', ch: 'ejenali', title: 'PENEBUSAN ANTARA DIMENSI | EPISODE 1 | EJEN ALI | GARDENIA | DATO AZIZUL HASNI AWANG' },
    { id: 'los4zx2C43g', ch: 'ejenali', title: 'Gardenia dan Ejen Ali | Misi : Penebusan Antara Dimensi - Teaser' },
    { id: 'f7hsZj271VM', ch: 'ejenali', title: 'Ejen Ali The Movie 2 - Official Teaser Trailer #2' },
    { id: 'jemNKpHJ6_g', ch: 'ejenali', title: 'EJEN ALI | SEASON 3 Original Soundtrack [VOL 3] - SATRIA THE END' },
    { id: '0qzDF32Qzqk', ch: 'ejenali', title: 'EJEN ALI | SEASON 3 Original Soundtrack [VOL 3] - HELP ME!' },
    { id: 'J2kzX7noMGI', ch: 'ejenali', title: 'EJEN ALI | SEASON 3 Original Soundtrack [VOL 2] - THIRD TIMES THE CINCO' },
    { id: 'QnGrr8IdAgE', ch: 'ejenali', title: 'EJEN ALI | SEASON 3 Original Soundtrack [VOL 1] - GONE ROGUE' },
    { id: 'dEtg5WzDusg', ch: 'ejenali', title: 'EJEN ALI | SEASON 3 Original Soundtrack - 3 2 1' },
    { id: 'Z3C2EXUPFAc', ch: 'ejenali', title: 'Ejen Ali Musim 3 | Episod 12 - Misi: SENGAT' },
    { id: 'rMqX0SFEQjw', ch: 'ejenali', title: 'Ejen Ali Musim 3 | Episod 8 - Misi: UBAH' },
    { id: 'DPaIfxH32Bs', ch: 'ejenali', title: 'Ejen Ali Musim 3 | Episod 5 - Misi: BLACKOUT' },
    { id: 'Q_Chhcgwcms', ch: 'ejenali', title: 'Misi Susu' },
    { id: 'Qt8kfgolt8Q', ch: 'ejenali', title: 'Ejen Ali Episod 2 - Misi: Orientasi' },
    { id: 'KRzRacODEUk', ch: 'ejenali', title: 'Ejen Ali - Musim 2 (EP06) - Misi : SUSU [Bahagian 3]' },
    { id: '1MhV91m5UA0', ch: 'ejenali', title: 'Ejen Ali Episod 9 - Misi: Peranan' },
    { id: 'TOTv3tI-gyE', ch: 'ejenali', title: 'Ejen Ali Episod 3 - Misi: Main' },
    { id: 'iKOQzfxOESA', ch: 'ejenali', title: 'Ejen Ali Episod 1 - Misi: Akademi' },
    { id: 'nu4oZtGuZKo', ch: 'ejenali', title: 'Ejen Ali Musim 2 (EP10) - Misi : Atlas [Bahagian 1]' },
    { id: 'JxdfMhB79ik', ch: 'ejenali', title: 'Ejen Ali (Episod 4 Bhg 3) - Misi : COMOT' },
    { id: '1Ya8xi58mQg', ch: 'ejenali', title: 'EJEN ALI : Simulation Training' },
    { id: 'E8LV57BN7cQ', ch: 'ejenali', title: 'MISI : SERI TV Promo' },
    { id: 'G16yqbwRNmg', ch: 'ejenali', title: 'MISI : BANGKIT TV Promo' },
    { id: 'WDDLG7CKSiY', ch: 'ejenali', title: 'Ejen Ali - Generic Promo' },
    { id: 'mXmwT4r9hYo', ch: 'ejenali', title: 'EJEN ALI : Simulation Training - ALICIA' },
    { id: 'ChVZVwDjnTk', ch: 'ejenali', title: 'Ejen Ali (Episod 1 Bhg 3) - Misi : Iris' },
    { id: 'bQdk6m72Uzw', ch: 'ejenali', title: 'Ejen Ali (Episod 3 Bhg 1) - Misi : SERI' },
    { id: 'mwKwtxvb0jY', ch: 'ejenali', title: 'Ejen Ali (Episod 4 Bhg 2) - Misi : COMOT' },
    { id: 'xvG-utE2bYQ', ch: 'ejenali', title: 'Ejen Ali Musim 3 | Episod 3 - Misi: UPGRADE' },
    { id: 'yVj21_GmWlA', ch: 'ejenali', title: 'EJEN ALI MUSIM 3 | OFFICIAL TEASER - Akan Datang, 25 Jun di TV3' },
    { id: 'cm6rojf8UH4', ch: 'ejenali', title: 'Ejen Ali Musim 3 | Promo Episod 10 - Misi: Khemah' },
    { id: 'PnpSnoMQnIg', ch: 'ejenali', title: '#4 - Ejen Ali Season 3 BTS - The Numeros' },
    { id: 'LY2-6-__4FM', ch: 'ejenali', title: 'Di Sebalik Tabir - EJEN ALI MUSIM KE-3' },
    { id: 'v1lSHfi8bT0', ch: 'ejenali', title: 'Ejen Ali Musim 3, BAHAGIAN 2 - ' },
    { id: '5tBLhes_pVw', ch: 'ejenali', title: 'Ejen Ali Musim 3 | Promo Episod 4 - Misi : Balas' },
    { id: 'fvPJVc1BRiE', ch: 'ejenali', title: 'Ejen Ali Musim 3 | Promo Episod 3 - Misi : Upgrade' },
    { id: '7hgj1QKU7tY', ch: 'ejenali', title: 'Ejen Ali Episod 4 - Misi: Analog' },
    { id: 'FcYe5A2d1io', ch: 'ejenali', title: 'Ejen Ali Episod 10 - Misi : Sensasi' },
    { id: 'Zh8EHoEhA8U', ch: 'ejenali', title: 'Ejen Ali Episod 11 - Misi : Bukti' },
    { id: '-6F8xutXTfk', ch: 'ejenali', title: 'Ejen Ali Episod 6 - Misi: BANGKIT' },
    { id: '75LVSW9kkb4', ch: 'ejenali', title: 'Ejen Ali Musim 2 (EP10) - Misi : Atlas [Bahagian 2]' },
    { id: 'tMGt7LSOH3M', ch: 'ejenali', title: '[ SPOILERS ] MISI ALIYA' },
    { id: 'r3OEe9XHTaE', ch: 'ejenali', title: 'Ejen Ali (Episod 13 Bhg 3) - Misi : OVERRIDE' },
    { id: 'cehQxiYZbys', ch: 'ejenali', title: 'Kita Jaga Kita - Altimet x Cuurley x Malik Abdullah Lyrics Video (Ejen Ali The Movie OST)' },
    { id: 'MyP-8edOt7E', ch: 'ejenali', title: 'Ejen Ali - Season 1 Soundtrack - ' },
    { id: 's8v3vSsavXI', ch: 'ejenali', title: 'Ejen Ali (Episod 6 Bhg 1) - Misi : BANGKIT' },
    { id: 'hdPBhzWw3so', ch: 'ejenali', title: 'Ejen Ali (Episod 7 Bhg 3) - Misi : PROTOKOL GEGAS' },
    { id: '3bnha1i4AgQ', ch: 'ejenali', title: 'Ejen Ali (Episod 8 Bhg 1) - Misi : PRESTASI' },
    { id: 'x4mGvvtJugk', ch: 'ejenali', title: 'Ejen Ali (Episod 9 Bhg 1) - Misi : POTENSI' },
    { id: 'lopGIO0ISEw', ch: 'ejenali', title: 'Ejen Ali (Episod 11 Bhg 3) - Misi : BUKTI' },
    { id: 'AzlM0_l5Rx0', ch: 'ejenali', title: 'Ejen Ali (Episod 12 Bhg 3) - Misi : UNO' },
    { id: 'dWrBbPZEddM', ch: 'ejenali', title: 'TV Promo - Majalah Komik Ejen Ali - Issue 1' },
    { id: 'eUvTntwqGj8', ch: 'ejenali', title: '‼️[ SPOILER ]‼️ Recap Ejen Ali The Movie' },
    { id: 'J9cp8c1MlNA', ch: 'ejenali', title: 'Ejen Ali Musim 3 | Promo Episod 2 - Misi : Boleh' },
    { id: 'tyZZmtI2pkA', ch: 'ejenali', title: 'Jom Lepak bersama WAUriors | Gartic Phone ft Pendekar Storyboard' },
    { id: 'RhNwi6_Ztqk', ch: 'ejenali', title: 'Ejen Ali Beats To Study To' },

    // DIDI & FRIENDS
    { id: 'vQhmr8pvN8E', ch: 'didi', title: 'Didi & Friends | Fun and educational | Nursery Rhymes' },
    { id: 'm7_uwmnEWJY', ch: 'didi', title: 'Nursery Rhymes | Didi & Friends: Ultimate Season 1 Song Compilation | Didi & Friends in English' },
    { id: 'q2mBy5JW-VY', ch: 'didi', title: 'A Bus Accidents! | Didi & friends Rescue Squad | Didi & Friends in English' },
    { id: 'w_Ao8HeEPXg', ch: 'didi', title: 'Didi & Friends Rescue Squad | A baby\'s Falling | Didi & Friends in English' },
    { id: '2kXEgwImVXY', ch: 'didi', title: 'Nursery Rhymes | 30 Minutes of Fun! Didi & Friends Animal Themed Songs | Didi & Friends in English' },
    { id: 'BS721BcYDjo', ch: 'didi', title: 'Didi & Friends Rescue Squad | I Can\'t Get Down | Didi & Friends in English' },
    { id: 'Yi4sEyNkTF0', ch: 'didi', title: '30 minutes of Learning & Laughter Blast! Didi & Friends\' BEST Nursery Rhymes (Season 1)' },
    { id: '5TizIExM67U', ch: 'didi', title: 'Didi & Friends Played with a Cat | Didi & Friends Play and Learn' },
    { id: 'gNA0f_ufmmM', ch: 'didi', title: 'The Planet Shape | Didi & Friends Storybook | Didi & Friends English' },
    { id: 'ScoPj8FH5eY', ch: 'didi', title: 'Didi & Friends Cook A Cheeseburger | Didi & Friends Play and Learn' },
    { id: 'MJbz0n5otjE', ch: 'didi', title: 'Didi & Friends | Nursery Rhymes and Kids Songs | Burger, Meatball, Ice Cream' },
    { id: 'NdaQf3vhyA8', ch: 'didi', title: 'Didi & Friends Stories | Uncle Atan\'s Cow, Mon Goes To School and +More | Didi & Friends English' },
    { id: '8ZQRqM7gKA8', ch: 'didi', title: 'Where is Kimi? | Didi & Friends Storybook | Didi & Friends English' },
    { id: 'cgHGzyl2A_U', ch: 'didi', title: 'Didi & Friends | Nursery Rhymes and Kids Songs | Goodbye Kwek, Tang Tang Tang, Fingers Family' },
    { id: 'wh58WnqKwnI', ch: 'didi', title: 'Didi & Friends | Nursery Rhymes and Kids Songs | Let\'s March, Dizzy Zombie, Dance Monster Dance' },
    { id: 'qDQiaTirS7E', ch: 'didi', title: 'The Big Clock | Didi & Friends Storybook | Didi & Friends English' },
    { id: 'Gwo9y3IoSUc', ch: 'didi', title: 'Police Cars | Fun Family Song | Didi & Friends Song for Children' },
    { id: 'tpTAHSSbspQ', ch: 'didi', title: 'ABCs | Nursery Rhymes & Kids Songs | Didi & Friends English' },
    { id: 'NFm6koXdyv4', ch: 'didi', title: 'Didi Rescue Squad: Submarine | Fun Family Song | Didi & Friends Song for Children' },
    { id: 'kwJVMm4wC-Y', ch: 'didi', title: 'Sad To Be Lonely | Fun Family Song | Didi & Friends Songs for Children' },
    { id: 'ObKeri2yOKc', ch: 'didi', title: 'Ninja Run | Fun Family Song | Didi & Friends Song for Children' },
    { id: 'MmO8qM_duZg', ch: 'didi', title: 'Nursery Rhymes & Kids Songs Compilation | Didi & Friends English | Here Comes Mon' },
    { id: 'snSIh59KeGs', ch: 'didi', title: 'Three Princesses | Nursery Rhymes Compilation | Didi & Friends English' },
    { id: 'OT8B_LlwY0k', ch: 'didi', title: 'Didi & Friends Rescue Squad | There\'s A Scorpion | Didi & Friends in English' },
    { id: '_cxIiRsk3dQ', ch: 'didi', title: 'Didi & Friends English Nursery Rhymes & Kids Songs | Coming Soon!' },
    { id: '8iGfuoT5A9M', ch: 'didi', title: 'BINGO | Nursery Rhymes & Kids Songs | Didi & Friends English' },
    { id: 'sNPI-BZFqKE', ch: 'didi', title: 'Row Row Row Your Boat Nursery | Rhymes & Kids Songs | Didi & Friends English' },
    { id: 'Tc2S3OtEVvI', ch: 'didi', title: 'Itsy Bitsy Spider | Didi & Friends English | Nursery Rhymes & Kids Songs' },
    { id: 'LrFrLmzr_HU', ch: 'didi', title: 'Let\'s Clean Up Together | Didi & Friends English | Nursery Rhymes & Kids Song' },
    { id: 'oRZCWlj0mzk', ch: 'didi', title: '12 Months | Didi & Friends English | Nursery Rhymes & Kids Songs | Months Of The Year' },
    { id: 'P_VzPGUFJC8', ch: 'didi', title: 'Let\'s Exercise | Nursery Rhymes & Kids Songs | Didi & Friends English | Exercise for Kids' },
    { id: '8jSWicrhf6k', ch: 'didi', title: 'Didi & Friends | Nursery Rhymes and Kids Songs | Police Car, Buckle Up, Construction Machines' },
    { id: 'n4D_KjRVcqQ', ch: 'didi', title: 'Uncle Atan\'s Cow | Didi & Friends Storybook | Didi & Friends English' },
    { id: 'ulferC8P-ds', ch: 'didi', title: 'Didi & Friends | Nursery Rhymes and Kids Songs | Hello Giant, Monster Shark, Dizzy Zombie' },
    { id: 'kPdumzakayA', ch: 'didi', title: 'Wheels On the Bus and +More | Sing and Dance Along | Didi & Friends Compilation' },
    { id: 'PhQ0lZ3LLvc', ch: 'didi', title: 'Uncle Atan\'s Cow is Missing! | Didi & Friends Stories | Didi & Friends English' },
    { id: 'TvLBI9fu82s', ch: 'didi', title: 'Sing and Dance Along | Buckle Up, AEIOU, The Tiger and +More | Didi & Friends English' },
    { id: 'RcDfhliihS8', ch: 'didi', title: 'Sing and Dance Along | Let\'s March with Didi & Friends and +More | Didi & Friends English' },
    { id: '-LhBKzmoghU', ch: 'didi', title: 'Didi & Friends Stories | Baking Competition and +More | Didi & Friends English' },
    { id: '2z3wQchf2BM', ch: 'didi', title: 'Monster Showdown | Scary Nursery Rhymes | Didi & Friends Songs for Children' },
    { id: 'xVVVtcTSw00', ch: 'didi', title: 'Amazing Robots | Nursery Rhymes & Songs for Kids | Didi & Friends English' },
    { id: '0yfs87m_Rw4', ch: 'didi', title: 'Didi & Friends Theme Song x Tayo the Little Bus | International Collaboration | Didi & Friends Songs' },
    { id: 'lpEpL7b1bi4', ch: 'didi', title: '[EPISODE] My Dream Job | Didi & Friends English Episode | Nursery Rhymes & Kids Songs' },
    { id: 'TmTGYMxTknw', ch: 'didi', title: '30 Minutes Compilation of Didi & Friends Song | Didi & Friends | Sleepy Mummy & More' },
    { id: 'tik7O1XaDP0', ch: 'didi', title: 'Dizzy Zombie - NEW 2020 Song For Kids | Didi & Friends' },
    { id: 'ahyUg0BqMJA', ch: 'didi', title: 'Cheese Burger - NEW 2020 Song For Kids | Didi & Friends' },
    { id: 'Sw0XQKPXMHs', ch: 'didi', title: 'A Landslide part 2! | Didi And Friends Rescue Squad | Didi & Friends in English' },
    { id: 'sG_YZ1UkFtA', ch: 'didi', title: 'Lullaby for Babies | Hush Happy Bear | Nursery Rhymes & Kids Songs | Didi & Friends' },
    { id: 'q86rPY7-SlA', ch: 'didi', title: 'Didi & Friends English | My Little Red Car | Nursery Rhymes & Kids Songs' },
    { id: 'nHHA_n-wcKQ', ch: 'didi', title: 'Let\'s Fly Away | Nursery Rhymes & Kids Songs | Didi & Friends English' },
    { id: 'fkHepZp4epM', ch: 'didi', title: 'Didi & Friends English | Nursery Rhymes & Kids Songs | Round And Round' },
    { id: 'kMa-QoGV-oY', ch: 'didi', title: 'Kids Nursery Rhymes Compilation | Didi & Friends English | A Happy Morning & Many More' },
    { id: 'XtZ2CT72lds', ch: 'didi', title: 'Nursery Rhymes Compilation | Didi & Friends English | 12 Months & More' },
    { id: 'k08ShyaWSPY', ch: 'didi', title: '14 Min Nursery Rhymes Compilation | Didi & Friends English | Rainbow & More' },
    { id: 'HR9Q9BeFkPY', ch: 'didi', title: 'Compilation Nursery Rhymes & Kids Songs | Didi & Friends English | The More We Get Together' },
    { id: 'DHoioGzyoXI', ch: 'didi', title: 'Oh No UFO | Dance Monster Dance and +More | Sing and Dance Along | Didi & Friends English' },
    { id: '9LH_2WFZ2Oo', ch: 'didi', title: 'Sing and Dance Along | Nana\'s Friend is Happy Bear and +More | Didi & Friends English' },
    { id: 'xBZKEvyPvTA', ch: 'didi', title: 'Sing and Dance Along | Apple, Burger, Bakso, Ice Cream and Many More | Didi & Friends English' },
    { id: 'DsNaxRCuQms', ch: 'didi', title: 'Sing and Dance Along | I Love Swimming and Many More | Didi & Friends English' },
    { id: 'SiQufK-nhuk', ch: 'didi', title: 'Sing and Dance Along | Didi & Friends English | Kids Song & Nursery Rhymes Compilation' },

    // DURIOO+ (Little Ammar & Mina Mila)
    { id: 'GUgrfWLbt74', ch: 'durioo', title: 'LOVE YOU MOM 💖 The Most Heartwarming Surprise Ever! | The Makers of Omar & Hana | Durioo' },
    { id: '92CFcqTcFqI', ch: 'durioo', title: 'Little Ammar Visits the Zoo! 🦁😱 What Animal Surprised Him Most? | The Makers of Omar & Hana | Durioo' },
    { id: 'Ot2StXaEv4Y', ch: 'durioo', title: 'Astaghfirullah! Say No to Brain Rot 🚫 | Little Ammar | From the Makers of Omar & Hana | Durioo' },
    { id: 'L6qW5HYUB9w', ch: 'durioo', title: 'The Happiest Eid Ever! 🎉 Little Ammar Celebrates Eid Mubarak | From the Makers of Omar & Hana' },
    { id: 'zIG0SkFHPmw', ch: 'durioo', title: 'First Ramadan 😱 Little Ammar’s Emotional Journey | Durioo+ The Makers Of Omar & Hana' },
    { id: 'wJmBkiHIWgc', ch: 'durioo', title: 'Ammar Not Feeling Well 🤒 Little Ammar’s Sick Day Story | Durioo+ The Makers Of Omar & Hana' },
    { id: '9upeBH5AjlQ', ch: 'durioo', title: '🌙 Little Ammar | Allahuakbar Prayer Time 🤲 Calm Faith Moments | Durioo The Makers Of Omar & Hana' },
    { id: 'KqszQCfFxwI', ch: 'durioo', title: '🌙 Little Ammar - Lets Count Our Days till Ramadhan ✨ | From the Makers of Omar & Hana | Durioo+' },
    { id: 'zxQ_x5KsXmo', ch: 'durioo', title: 'Little Ammar - Meet Our Tiny Little Friend! ✨ | From the Makers of Omar & Hana | Durioo+' },
    { id: 'k3tOGAO3v1c', ch: 'durioo', title: '🌟 Little Ammar: Peekaboo! Compilation | From the Makers of Omar & Hana | Durioo+' },
    { id: 'UeoSdDnor_M', ch: 'durioo', title: '🌟 Little Ammar: Let Sleep! Compilation | From the Makers of Omar & Hana | Durioo+' },
    { id: 'yrDLUm4z-cg', ch: 'durioo', title: '🌟 Little Ammar: Let’s Love Our Prophet! Compilation | From the Makers of Omar & Hana | Durioo+' },
    { id: 'BX-53T6hEc4', ch: 'durioo', title: '🌟 Little Ammar’s Fresh and Comfy 60 minutes Compilation | From the Makers of Omar & Hana | Durioo+' },
    { id: 'HJD9nSd4Mjs', ch: 'durioo', title: '💛 Little Ammar 🎬 Baba and Me! 60 Minutes Compilation | Durioo+' },
    { id: 'aCEoOjfa45E', ch: 'durioo', title: 'Little Ammar 🎬 Fi Sabilillah 🌟 | From the Makers of Omar and Hana | Full Episode | Durioo+' },
    { id: 'X9Dh9vNcpSE', ch: 'durioo', title: 'From the Creators of Omar & Hana | BACK TO SCHOOL Compilation | 95 Minutes | Little Ammar | Durioo+' },
    { id: 'YOOQ_hCiCjs', ch: 'durioo', title: 'The Makers of Omar & Hana - Little Ammar - Time for School COMPILATION | Durioo+' },
    { id: 'httdTL7b0Lc', ch: 'durioo', title: '🌟 Little Ammar: Peekaboo! Compilation | From the Makers of Omar & Hana | Durioo+' },
    { id: 'HBFLyCHn964', ch: 'durioo', title: 'Say Thank You 🤍 Little Ammar Learns Gratitude | Durioo+ The Makers Of Omar & Hana' },
    { id: '2ZTr7ZwIAjw', ch: 'durioo', title: '🍩 Little Ammar 🎬 Lets Bake! 60 Minutes Compilation | Durioo+' },
    { id: 'mvrtGfwY5LM', ch: 'durioo', title: 'The Makers of Omar & Hana - Little Ammar - Good Night Sleep For Kids | Durioo+' },
    { id: 'hsJ_G80wdGE', ch: 'durioo', title: 'The Most Powerful Night 🌙 Little Ammar Learns About Lailatul Qadr | The Makers Of Omar & Hana|Durioo' },
    { id: 'B6z2_A_nM5M', ch: 'durioo', title: '🌸 Hello Spring! Little Ammar’s CUTEST Adventure Ever 🐝 | From the Makers of Omar & Hana | Durioo' },
    { id: 'NAbVE1toA8s', ch: 'durioo', title: 'Little Ammar: Morning Routine | Islamic Nursery Rhymes for Kids' },
    { id: 'bXzzG55fAuc', ch: 'durioo', title: 'Little Ammar: Our Lord is Allah | Islamic Nursery Rhymes for Kids' },
    { id: 'rZyQwAQNUUc', ch: 'durioo', title: 'Little Ammar: Dua Before and After Sleep | Islamic Nursery Rhymes for Kids' },
    { id: 'NPhonhhxkj0', ch: 'durioo', title: 'Little Ammar: Marhaban Ya Ramadan Song | Islamic Nursery Rhymes for Kids' },
    { id: 'rqEG-Rj2pJ0', ch: 'durioo', title: 'Little Ammar: Fruit Ranger | Islamic Nursery Rhymes for Kids' },
    { id: 'SeqSxaPxUEk', ch: 'durioo', title: 'The Makers of Omar & Hana - Little Ammar -Thank you | Durioo+' },
    { id: '6hLH8a8iyo8', ch: 'durioo', title: 'The Makers of Omar & Hana - Little Ammar - Summer Holiday compilation | Durioo+' },
    { id: 'fpGXv174F4Y', ch: 'durioo', title: 'DEAR MOM 💖 You Mean Everything to Me 🥹 | Mina Mila | The Makers of Omar & Hana | Durioo' },
    { id: '1kV4qmbEtNE', ch: 'durioo', title: 'Mina Mila 🏡 Sweetest Family Moments & Fun Surprises! 💖 The Makers of Omar & Hana | Durioo' },
    { id: 'Qu2oz2TPKGg', ch: 'durioo', title: 'Astagfirullah! Mina Mila Says No to Brain Rot 🚫😱 | From the Makers of Omar & Hana | Durioo' },
    { id: 'ZYo_Fui3iNo', ch: 'durioo', title: 'The Happiest Eid Ever! 🎉 Mina Mila Celebrate Eid Mubarak | From the Makers of Omar & Hana | Durioo' },
    { id: 'ahuSqtusPmo', ch: 'durioo', title: 'Alhamdulillah, First Fast 🌙 Mina Mila’s Beautiful Ramadan Moments | Durioo The Makers Of Omar & Hana' },
    { id: '5CSdeg1erfE', ch: 'durioo', title: 'Cozy Moments 🤍 Mina Mila Relax Together at Home | Durioo+ The Makers Of Omar & Hana' },
    { id: 'OYidVOP3U1Q', ch: 'durioo', title: 'Mina Mila Beautiful Du\'a! ✨ Family Fun by Durioo & The Makers of Omar & Hana | Watch Together!' },
    { id: 'jEml2u4uOuQ', ch: 'durioo', title: 'Mina Mila 🎒 Daily Routine Fun! From Morning to Night | Durioo+ | The Makers of Omar & Hana' },
    { id: 'sdxk9LDrAbQ', ch: 'durioo', title: 'Spend Smart with Mina Mila 💡 Fun Lessons on Saving & Choices | Durioo+ The Makers Of Omar & Hana' },
    { id: '6S0K8K3IUwY', ch: 'durioo', title: '🎉 Mina Mila | New Year, New Smiles 😄 Fresh Joy & Fun | Durioo+ The Makers Of Omar & Hana' },
    { id: 'thpiQu5t8KY', ch: 'durioo', title: '✨Eid Is Loading 🌙 Mina Mila Can’t Wait! | Durioo+ The Makers Of Omar & Hana' },
    { id: 'HCD9leV3jWg', ch: 'durioo', title: '👗Mina Mila 🎞️ Playtime Dress Up! 😍 Outfit Changes & Cute Reactions! Durioo+The Makers of Omar & Hana' },
    { id: '1DC46DY5nXY', ch: 'durioo', title: '🌟 Mina Mila 🎞️ It’s Showtime! 🎤 Big Acts, Big Smiles, Big Fun! The Makers of Omar & Hana | Durioo+' },
    { id: 'wXRpxWYGRSY', ch: 'durioo', title: '“Mina Mila Back to School! 🎒 Cute Morning Rush & Funny Moments!” The Makers of Omar & Hana | Durioo+' },
    { id: 'Zqaoc_vZ2zg', ch: 'durioo', title: '🌟Mina Mila🎞️Alhamdulillah for Everything💖A Story of Gratitude | Durioo+ The Makers of Omar & Hana' },
    { id: 'cOBTpZg7Iyw', ch: 'durioo', title: '🌟 Mina Mila🎞️Thank You, Dad! 💖A Beautiful Story of Love & Gratitude Durioo+The Makers of Omar & Hana' },
    { id: 'whk0zVjtZ80', ch: 'durioo', title: '“Mina Mila Back to School! 🎒 Cute Morning Rush & Funny Moments!” The Makers of Omar & Hana | Durioo+' },
    { id: 'HpxXhNtwaVM', ch: 'durioo', title: 'Alhamdulillah, First Fast 🌙 Mina Mila’s Beautiful Ramadan Moments | Durioo The Makers Of Omar & Hana' },
    { id: 'P2aGUVANuRs', ch: 'durioo', title: '👗Mina Mila 🎞️ Playtime Dress Up! 😍 Outfit Changes & Cute Reactions! Durioo+The Makers of Omar & Hana' },
    { id: 'py9n8sLiiWg', ch: 'durioo', title: 'Islamic Cartoon MinaMila | Thank You Baba Compilation | The Makers of Omar & Hana | Durioo+' },
    { id: 's2IQifq4eDk', ch: 'durioo', title: 'Cozy Moments 🤍 Mina Mila Relax Together at Home | Durioo+ The Makers Of Omar & Hana' },
    { id: 'TN0AzEHcmsI', ch: 'durioo', title: '👯‍♀️ Mina Mila🎞️Besties Forever!🌟The Cutest & Friendship Moments | Durioo+The Makers of Omar & Hana' },
    { id: 'l_--cS3CXX4', ch: 'durioo', title: 'Mina & Mila: Meant to Be | Islamic Stories for Kids' },
    { id: 'Co4-rkznXlk', ch: 'durioo', title: 'The Makers of Omar & Hana - Islamic Stories Mina Mila - Miss know it all - Muslim Siblings | Durioo+' },
    { id: '0hFCwYWPjy8', ch: 'durioo', title: 'Mina Mila Compilation | Mina Mila | Durioo+' },
    { id: 'oMVBwt92UjA', ch: 'durioo', title: 'Islamic Cartoon MinaMila | Thank You Baba Compilation | The Makers of Omar & Hana | Durioo+' },
    { id: 'Yr6GQmZ6OjQ', ch: 'durioo', title: '👗 Kids Cartoon | Mina & Mila 🎞️Dress Up! | From the Makers of Omar & Hana | Durioo+' },
    { id: '0W_CC4_qZl0', ch: 'durioo', title: '🤲 Mina & Mila 🎞️ Let’s Pray Together 🌙 Gentle & Sweet Moments 💖| The Makers of Omar & Hana | Durioo+' },
    { id: 'iID_5bmKWfQ', ch: 'durioo', title: 'MINA MILA Patience in Anger Compilation | From the Makers of Omar & Hana | Durioo+ SAY NO TO BULLY' },
    { id: 'R1w2MglGaWk', ch: 'durioo', title: '🏘️Mina Mila🎞️Neighbourhood Adventure!🚲Fun Friends & Big Surprises| Durioo+ The Makers of Omar & Hana' },

    // MS RACHEL
    { id: 'yQyEmZIw1e8', ch: 'msrachel', title: 'Caterpillar Song - Kids Songs and Nursery Rhymes - Songs for Toddlers - Ms Rachel Songs on YouTube' },
    { id: 'w264Mn-2MnQ', ch: 'msrachel', title: 'Learn with Ms Rachel - Friendship & Social Skills - Videos for Kids - Colors, Letters & Counting' },
    { id: '8KtnrtHRiCg', ch: 'msrachel', title: 'Preschool & Toddler Learning Video with Ms Rachel - Learn Shapes, Letters, Numbers, Colors & More' },
    { id: '1v3Dk41C_10', ch: 'msrachel', title: 'Ms Rachel & Elmo Get Ready For School - ABC Song, Numbers, Colors - Toddler & Preschool Learning' },
    { id: '2dDpryw3z5w', ch: 'msrachel', title: 'Ms Rachel Visits the Doctor for a Checkup - Doctor Checkup Song - Toddler Learning - Healthy Habits' },
    { id: 'tYDuAfY77Do', ch: 'msrachel', title: 'Blippi & Ms Rachel Learn Vehicles - Wheels on the Bus - Videos for Kids - Tractor, Car, Truck + More' },
    { id: 'qXKsou9UmfY', ch: 'msrachel', title: 'Happy Song | I’m So Happy + More Nursery Rhymes & Kids Songs | Ms Rachel | Kids Dance Songs' },
    { id: 'drkVagtmIJA', ch: 'msrachel', title: 'Learning with Ms Rachel Halloween | Videos for Toddlers | Kids Songs | Wheels on The Bus | Speech' },
    { id: 'bOiYN7iU-W8', ch: 'msrachel', title: 'Wheels On The Bus + More Nursery Rhymes & Kids Songs - Educational Videos for Kids & Toddlers' },
    { id: 'ozsgl_sLnHQ', ch: 'msrachel', title: 'Learn to Talk with Ms Rachel | Baby Learning Videos | Toddler Speech | Christmas | First Words' },
    { id: '47MNn4bsmSw', ch: 'msrachel', title: 'First Sentences for Toddlers | Learn to Talk | Toddler Speech Delay | Speech Practice Video English' },
    { id: 'hTqtGJwsJVE', ch: 'msrachel', title: 'Bedtime Routine - Bedtime Stories for Toddlers - Preschool Videos - Toddler Learning Video Songs' },
    { id: 'omcNGrnt7Sg', ch: 'msrachel', title: 'Baby Songs and Nursery Rhymes- Baby Videos for Babies and Toddlers - Toddler Learning Video' },
    { id: 'HsT3iI6dT5U', ch: 'msrachel', title: 'Preschool Videos - Toddler Learning Videos - Circle Time, Phonics, Colors, Numbers - Dinosaur Class' },
    { id: 'hOHrqPI9bVk', ch: 'msrachel', title: 'Preschool Videos - Halloween Songs for Kids - Circle Time for Preschoolers - Learning, Movement' },
    { id: 'TyV-OhCrVDA', ch: 'msrachel', title: 'First Words for Babies and Toddlers - Learn To Talk - Baby’s First Words, Songs and Gestures' },
    { id: 'zmEv7vTOQGE', ch: 'msrachel', title: 'Talking Time with Ms Rachel - Baby Videos for Babies and Toddlers - Speech Delay Learning Video' },
    { id: 'dnHWQwh1Iso', ch: 'msrachel', title: 'Learn To Talk with Ms Rachel - Learning at an Outdoor Playground - Toddler Videos - Toddler Shows' },
    { id: 'gngPQ771Ahk', ch: 'msrachel', title: 'Learn To Talk with Ms Rachel - Help Take Care of Dolls - Speech, Baby Sign - Doll turn into baby' },
    { id: 'zwL2o4jZxbc', ch: 'msrachel', title: 'Learn To Talk with Ms Rachel - Toddler Learning Video - Learn Colors, Numbers, Emotions & Feelings' },
    { id: 'xkYved-ucGg', ch: 'msrachel', title: 'Learn Farm Animals with Ms Rachel | Animal Sounds, Old MacDonald Had A Farm | Videos for Toddlers' },
    { id: 'Qi4AV2S4xA0', ch: 'msrachel', title: 'Bubble, Bubble Pop! Fun circle time song for kids!' },
    { id: '0ETr_5NhX5Q', ch: 'msrachel', title: 'Good Morning Song for kids, toddlers, babies, circle time!' },
    { id: 'CcpI34r3MdQ', ch: 'msrachel', title: 'Clean Up Song for Kids from Barney and Friends - Original' },
    { id: 'V0Ox0p1x5Wc', ch: 'msrachel', title: 'We Are The Dinosaurs Laurie Berkner Cover Guitar' },
    { id: 'OpWGPOtSllM', ch: 'msrachel', title: '' },
    { id: 'HTfOVFwMRg4', ch: 'msrachel', title: 'The More We Get Together sign language' },
    { id: 'dpGJcY4brhs', ch: 'msrachel', title: 'Patty Cake how to play - with song lyrics hands clapping game' },
    { id: '4rVirL3FA6g', ch: 'msrachel', title: 'Pout Pout Fish Song' },
    { id: 'eetwPz7PHvY', ch: 'msrachel', title: 'Preschool Videos - Circle Time, Songs, Reading, Movement and More - Learning Video' },
    { id: '3Cif-tnRxjg', ch: 'msrachel', title: 'Speech Videos for Toddlers and Babies - Early Intervention Activities and Baby Milestones Video' },
    { id: '78Mt3XlWHsI', ch: 'msrachel', title: 'Baby Sign Language Basics and Baby First Words - The Best Baby Signs, Songs and Flashcards' },
    { id: 'nXzvYnkXQNI', ch: 'msrachel', title: 'Preschool Learning Videos - Preschool for Littles - Online Virtual Preschool Video - Learn at Home' },
    { id: 'Zuwuo5u0wYs', ch: 'msrachel', title: 'Free Online Toddler Frozen Music Class' },
    { id: 'I4o7caGRmwk', ch: 'msrachel', title: 'Music Class for Kids Online - Music Lessons for Kids' },
    { id: 'vzuo-C0hzpE', ch: 'msrachel', title: 'Days of the Week Song Addams Family - Teach The Days of the Week' },
    { id: '41vocyDRhLs', ch: 'msrachel', title: 'Be in our music video! ' },
    { id: '05Vj6rGCauQ', ch: 'msrachel', title: 'Preschool Learning Videos - Preschool for Littles - Online Virtual Preschool Video - Learn at Home' },
    { id: 'axhYc_4jL3Y', ch: 'msrachel', title: 'Speech Practice Video for Toddlers and Babies - Speech Delay Toddler - Learn To Talk Videos' },
    { id: 'oEn7XBxOXSw', ch: 'msrachel', title: 'Preschool Learning, Activities, and Songs - Learn at Home with Ms Rachel - Educational Videos' },
    { id: '7siu3eOW1VQ', ch: 'msrachel', title: 'Icky Sticky Bubble Gum Song with Ms Rachel + More Nursery Rhymes & Kids Songs' },
    { id: '1JBQ0oSq3eY', ch: 'msrachel', title: 'Toddler Learning Video Words, Songs and Signs! Baby\'s First Words Speech and Language Development' },
    { id: 'oLw8KBBjc9E', ch: 'msrachel', title: 'Farm Animal Sounds for Toddlers Toddler Learning Video Educational Speech Videos' },
    { id: 'I3EFGddv68g', ch: 'msrachel', title: 'Letter Sounds Phonics Song YouTube Plus More Learning Songs for Kids' },
    { id: 'jGf8C2qP22E', ch: 'msrachel', title: 'Toddler Learning Videos- Preschool Online - Educational Videos for Toddlers in English' },
    { id: 'WbpKj0F-Z3s', ch: 'msrachel', title: 'Baby\'s First Words - Flashcards - Teach Baby To Talk - Baby and Toddler Learning Videos - Mama, Dada' },
    { id: '-XvaC6OFwRw', ch: 'msrachel', title: 'Kids Music Class- Jammin\' with Jules' },
    { id: 'dTY4_5xhsVY', ch: 'msrachel', title: 'Toddler Speech Practice Video and Techniques - Speech Therapy Tips from Chatterbox NYC- Speech Delay' },
    { id: 'Ok1rDrnxh0A', ch: 'msrachel', title: 'Preschool Learning Videos - Preschool for Littles - Circle Time, Songs, Movement - Preschool Prep' },
    { id: 'UM83ZG2hvTM', ch: 'msrachel', title: '\'Imagination' },
    { id: 'wyIA0hsOGFQ', ch: 'msrachel', title: 'Row Row Row Your Boat Song Lyrics 7 verses' },
    { id: 'CZrUmP0UR_g', ch: 'msrachel', title: 'Tiny Tim - I Had A Little Turtle' },
    { id: 'BOOQLQUnMas', ch: 'msrachel', title: 'Toddler Learning Videos- Preschool Online - Educational Videos for Toddlers in English' },
    { id: 'hWRH7OWKMwI', ch: 'msrachel', title: 'Phonics Song + More Kids Songs & Nursery Rhymes - Learn Letter Sounds - Videos for Kids - Ms Rachel' },
    { id: 'AzzwhmTFf7U', ch: 'msrachel', title: 'Brush Your Teeth Song Raffi' },
    { id: 'sSPgkYoFqbg', ch: 'msrachel', title: 'Learning Videos for Toddlers - Speech and Songs - Learn To Talk and Meet Milestones' },
    { id: 'OQ9BL6_cexw', ch: 'msrachel', title: 'Learn To Talk with Ms Rachel - Help Take Care of Dolls - Speech, Baby Sign - Doll turn into baby' },
    { id: 'LjBmZWPX3Bk', ch: 'msrachel', title: 'Hop Little Bunnies with Ms Rachel + More Nursery Rhymes & Kids Songs | Toddler Learning Video' },
    { id: 'mGgDKEVZXw8', ch: 'msrachel', title: 'Learn Numbers, Colors, Counting and Shapes with Ms Rachel | Learning Videos for Toddlers in English' },
    { id: 'Md0A0tiPZlc', ch: 'msrachel', title: 'Music Class for Kids Online - Music Lessons for Kids' },

    // ALIF & SOFIA
    { id: 'cH4EEOfexPg', ch: 'alifsofia', title: '[ PSA ] Alif & Sofia | Hari Kanak-Kanak Sedunia' },
    { id: 'jziBg2O76iI', ch: 'alifsofia', title: '[PSA] Alif & Sofia | Hari Pahlawan' },
    { id: 'jPxs-h0X9Qw', ch: 'alifsofia', title: '[LAGU] Alif & Sofia | 20 Sifat Allah' },
    { id: '9eMypZeaDDo', ch: 'alifsofia', title: '[Jom Kreatif] Alif & Sofia | Pokok Butang' },
    { id: 'bkARmDjj2To', ch: 'alifsofia', title: '[CERITA] Alif & Sofia | Nabi Ibrahim Seorang Hero' },
    { id: 'zIu0r949imE', ch: 'alifsofia', title: '[LAGU] Alif & Sofia | 25 Rasul' },
    { id: 'Ug1uYVmgStE', ch: 'alifsofia', title: 'Alif & Sofia X Tanyalah Ustaz | Apa Itu Ibadah Korban' },
    { id: 'iJ4UAZGTEsk', ch: 'alifsofia', title: 'Alif & Sofia X Tanyalah Ustaz | Tempat Ibadah Haji' },
    { id: 'faVJQqSIO20', ch: 'alifsofia', title: 'Alif & Sofia X Tanyalah Ustaz | Apa Itu Wukuf Di Arafah?' },
    { id: 'TgOMfVSeYhE', ch: 'alifsofia', title: '[LAGU] Alif & Sofia | 25 Rasul' },
    { id: '-ZBM0PDkFgU', ch: 'alifsofia', title: 'Alif & Sofia | Kompilasi 15 Minit' },
    { id: 'r7PFgVpG3eI', ch: 'alifsofia', title: '[PSA] Alif & Sofia | Apa Itu Vaksin?' },
    { id: 'Lp7QRAG0yak', ch: 'alifsofia', title: '[ PSA ] Alif & Sofia | Hari Kanak-Kanak Sedunia' },
    { id: 'B2vorH0y-1w', ch: 'alifsofia', title: '[ PSA ] Alif Sofia | Apa Itu Al-Anam?' },
    { id: 'sbad4tvgyV4', ch: 'alifsofia', title: '[PSA] Alif & Sofia | Hari Pahlawan' },
    { id: '60MH0reGHAE', ch: 'alifsofia', title: '[Jom Kreatif] Alif & Sofia | Pokok Butang' },
    { id: 'QXezjn3hiHY', ch: 'alifsofia', title: 'Alif & Sofia X Tanyalah Ustaz | Apa Itu Tawaf?' },
    { id: 'pdbMM_6B66M', ch: 'alifsofia', title: 'Alif & Sofia X Tanyalah Ustaz | Apa Itu Ibadah Haji?' },
    { id: 'OcRwrHYbWsE', ch: 'alifsofia', title: 'Alif & Sofia X Tanyalah Ustaz | Apa Itu Saie?' },
    { id: 'gaDnQVlxDU4', ch: 'alifsofia', title: 'Alif & Sofia X Tanyalah Ustaz | Sambutan Hari Raya Aidiladha' },
    { id: 'Al9TkmqhsUI', ch: 'alifsofia', title: '[Jom Kreatif] Alif & Sofia | Origami Katak' },
    { id: '5EKatMZjjKE', ch: 'alifsofia', title: '[PSA] Alif & Sofia | Tidak Pasti Jangan Kongsi' },
    { id: 'Ps_GpjvEMX8', ch: 'alifsofia', title: 'Alif & Sofia X Tanyalah Ustaz | Masjid An-Nabawi' },

    // OMAR & HANA
    { id: '5kKk9Gp1KOQ', ch: 'omarhana', title: 'Omar & Hana SERIES COMPILATION 90 Mins Omar & Hana English' },
    { id: 'XKrKImw-DZ0', ch: 'omarhana', title: 'Omar & Hana Being Good Neighbors Islamic Cartoon for Kids Nasheed' },
    { id: 'rCnn7RWqSCE', ch: 'omarhana', title: 'Omar & Hana Season 5 New Episodes 40 Minutes Compilation' },
    { id: 's-ohLjVGbMs', ch: 'omarhana', title: 'Amazing Animals 20 Minutes Compilation Omar & Hana English' },
    { id: 'Hti42crbFLM', ch: 'omarhana', title: 'New Season Have Patience Daddy Islamic Series & Songs For Kids Omar & Hana English' },
    { id: 'fTxjb-ewVQQ', ch: 'omarhana', title: 'Omar & Hana Salam Scientist Islamic Cartoons for kids' },
    { id: '74N9sjf4pXg', ch: 'omarhana', title: 'Omar & Hana I Want To Be Islamic cartoons for kids' },
    { id: 'DHARkRoV9rs', ch: 'omarhana', title: 'Ustaz Musa Omar & Hana 40 Minutes Compilation Islamic Series & Songs For Kids' },
    { id: '2_q0xsQdM-Q', ch: 'omarhana', title: 'New Episode Grandpa\'s Feast Islamic Series & Songs For Kids Omar & Hana English' },
    { id: 'o3Eq79s6_5I', ch: 'omarhana', title: 'Omar & Hana Salam Scientist Islamic Cartoons for kids' },
    { id: 'i48WbcncaRg', ch: 'omarhana', title: 'Amazing Animals 20 Minutes Compilation Omar & Hana English' },
    { id: '53nnT8buKlI', ch: 'omarhana', title: 'Omar & Hana Season 5 New Episodes 40 Minutes Compilation' },
    { id: 'O5Qd222wLxA', ch: 'omarhana', title: 'Omar & Hana Being Good Neighbors Islamic Cartoon for Kids Nasheed' },
    { id: 'D3pzZVAlwAo', ch: 'omarhana', title: 'Omar & Hana SERIES COMPILATION 90 Mins Omar & Hana English' },

    // LEARN WITH ZAKARIA
    { id: 'HO08HGnIlxA', ch: 'learnwithzakaria', title: 'أنشودة الفأر 🐭 | فأر دخل الدار 😱 | أغنية مضحكة وتعليمية للأطفال بدون موسيقى' },
    { id: 'pYuOEEYupRU', ch: 'learnwithzakaria', title: 'مجموعة أناشيد الحيوانات والحشرات للأطفال | البعوضة والصرصور والذئب وزيكو والخروف 🐺🐱🐑🦟' },
    { id: 'yHYI7apORwY', ch: 'learnwithzakaria', title: 'Animal Sounds Song - Zico the Cat Song 🐱 | Learn with Zakaria' },
    { id: 'OcNaG6V18CA', ch: 'learnwithzakaria', title: 'أغنية المهن للأطفال | ماذا تريد أن تكون؟ تعلّم مع زكريا' },
    { id: 'cFU6B07-34w', ch: 'learnwithzakaria', title: 'The Letter Faa (ف) for kids | Learn Arabic Alphabet with Zakaria and Ziko' },
    { id: '2UhVkpZc2oc', ch: 'learnwithzakaria', title: 'Welcome Ramadan Song for Kids 🌙 | Learn with Zakaria' },
    { id: '_hnX1yLxMMo', ch: 'learnwithzakaria', title: 'The Letter Dhaa (ظ) for kids | Learn Arabic Alphabet with Zakaria and Ziko' },
    { id: 'DonogrVbpw0', ch: 'learnwithzakaria', title: 'The Letter Sad (ص) for kids | Learn Arabic Alphabet with Zakaria and Ziko' },
    { id: 'mYxJgqvJe9A', ch: 'learnwithzakaria', title: 'The Letter Sheen (ش) for kids | Learn Arabic Alphabet with Zakaria and Ziko' },
    { id: 'q9zUfhZ0Fpw', ch: 'learnwithzakaria', title: 'The Letter Dhaal (ذ) for kids | Learn Arabic Alphabet with Zakaria and Ziko' },
    { id: 'eUNBKxHr-is', ch: 'learnwithzakaria', title: 'The Letter Haa (ح) for kids | Learn Arabic Alphabet with Zakaria and Ziko' },
    { id: 'k9TEDLWq-nM', ch: 'learnwithzakaria', title: 'Baa Batta - The Letter Baa (ب) for kids | Learn Arabic Alphabet with Zakaria and Ziko' },
    { id: 'IEjthpiyBuw', ch: 'learnwithzakaria', title: 'Job names for Kids (Part 3) | Learn about jobs in Arabic for children with Zakaria & Zeeko' },
    { id: 'YTjBQCfZ50M', ch: 'learnwithzakaria', title: 'Job names for Kids (Part 2) | Learn about jobs in Arabic for children with Zakaria & Zeeko' },
    { id: '90emzw8DD1k', ch: 'learnwithzakaria', title: 'Body parts for Kids (Part 1) | Learn the body parts in Arabic for children with Zakaria & Zeeko' },
    { id: 'co5yzmpAMDw', ch: 'learnwithzakaria', title: 'Learn numbers from 1 to 20 in Arabic for kids | Learn counting in Arabic with Zakaria & Zeeko' },
    { id: 'OQs8g1DN55o', ch: 'learnwithzakaria', title: 'Arabic Alphabet Song for children – ABC Song in Arabic for kids | Nasheed with Zakaria' },
    { id: 'edL3W38ODd4', ch: 'learnwithzakaria', title: 'Learn Colors in Arabic for Kids - تعليم الألوان للاطفال باللغة العربية' },
    { id: 'LyzupN62MGA', ch: 'learnwithzakaria', title: 'Learn Ablution (Wudu for Kids) The Right Way – Learn Wudu for Kids with Zakaria' },
    { id: 'gr3XKopIsVA', ch: 'learnwithzakaria', title: 'Learn Writing Letter Baa (ب) in Arabic – Learn Writing Arabic for children with Zakaria' },
    { id: '8_4_F8EunRI', ch: 'learnwithzakaria', title: 'Nasheed | Arabic Alphabet Song with Zakaria – ABC Song in Arabic for kids' },
    { id: 'EiMf3iwvEkc', ch: 'learnwithzakaria', title: 'Learn the French Alphabet with Zakaria | ABC Letters in French' },
    { id: 'MPCvPqIeCCs', ch: 'learnwithzakaria', title: 'ABC Song For Children | Nursery Rhymes For Kids | Without Music | Learn ABCs with Zakaria' },
    { id: 'L2F_myEd8ag', ch: 'learnwithzakaria', title: 'Do You Know? Learn about Arab countries | Question and Answers about the Arab world with Zakaria' },
    { id: 'W4M4oHBGSkA', ch: 'learnwithzakaria', title: 'Learn Arabic Alphabet with Zakaria - تعلم الحروف العربية مع زكريا' },
    { id: 'gZ5eewBnwfg', ch: 'learnwithzakaria', title: 'Quran for Kids: Learn Surah Al-Fatiha - 001 - القرآن الكريم للأطفال: تعلّم سورة الفاتحة' },
    { id: 'NezLpsU_fTw', ch: 'learnwithzakaria', title: 'Quran for Kids: Learn Surat Al-Masad - 111 - القرآن الكريم للأطفال: تعلّم سورة المسد' },
    { id: 'IRnZtDQS6Ec', ch: 'learnwithzakaria', title: 'Quran for Kids: Learn Surah Al-Asr - 103 - القرآن الكريم للأطفال: تعلّم سورة العصر' },
    { id: 'aHbhda9rKRY', ch: 'learnwithzakaria', title: 'Quran for Kids: Learn Surah Al-Kafiroon - 109 - القرآن الكريم للأطفال: تعلّم سورة الكافرون' },
    { id: 'JZdTd5nfZyI', ch: 'learnwithzakaria', title: 'Learn Fruits in Arabic for Kids - تعليم أسماء الفواكه للاطفال باللغة العربية' },
    { id: 'tY9NfchOEno', ch: 'learnwithzakaria', title: 'Learn the Weekdays in Arabic for kids - تعلم أيام الأسبوع بالعربية للأطفال' },
    { id: 'tv28FMStQBY', ch: 'learnwithzakaria', title: 'Learn Hijri Months in Arabic for kids - تعلم الأشهر الهجرية بالعربية للأطفال' },
    { id: 'A8Qdzz4X70c', ch: 'learnwithzakaria', title: 'Vegetables names in Arabic for Kids (Part 2) | Learn Arabic with Zakaria and Zeeko' },
    { id: 'N18JXcJr1wo', ch: 'learnwithzakaria', title: 'Learn Insect Names in French | insect for kids - Learn French with Zakaria' },
    { id: '9YftisfXP70', ch: 'learnwithzakaria', title: 'Do You Know? Jordan | Learn about Jordan (Episode 23) | Question and Answers about Jordan' },
    { id: 'itFDZmIZ6pg', ch: 'learnwithzakaria', title: 'Learn Pet Animals Names in English | Pets for kids - Learn English with Zakaria' },
    { id: 'xw30TKAAojc', ch: 'learnwithzakaria', title: 'Do You Know? Egypt | Learn about Egypt (Episode 20) | Question and Answers about Egypt' },
    { id: 'hXAZcr2WDss', ch: 'learnwithzakaria', title: 'Means of Transport in Arabic for Kids | Match Word with Picture Game (Episode 20) Learn with Zakaria' },
    { id: 'FyHqoWx-hrg', ch: 'learnwithzakaria', title: 'Videos games | Memory Card Game (Episode 29) - brain exercise for family with Zakaria' },
    { id: 'dc1uprzEjec', ch: 'learnwithzakaria', title: 'Ice Cream | Memory Card Game (Episode 28) - brain exercise for family with Zakaria' },
    { id: 'NW4Le9Z-5Mo', ch: 'learnwithzakaria', title: 'Learn How To Pray (Salah Al Ishaa) The Right Way – Learn Salah Al Ishaa for Kids with Zakaria' },
    { id: 'Bu-AeL-UAvc', ch: 'learnwithzakaria', title: 'Quran For Kids Surah Al-Asr to Surah An-Nas - القران للأطفال - سورة العصر إلى سورة الناس' },
    { id: 'lP8pYFBvJsc', ch: 'learnwithzakaria', title: 'Quran for Kids: Learn Surah Al-Fil - 105 - القرآن الكريم للأطفال: تعلّم سورة الفيل' },
    { id: 'sQ-eUX0aUgo', ch: 'learnwithzakaria', title: 'Learn Colors in Arabic for Children - تعليم الألوان باللغة العربية للاطفال' },
    { id: '0hZWA4Rhoaw', ch: 'learnwithzakaria', title: 'Eid Al Fitr for Kids, zoom lesson about Eid | eLearning for children - Islam for kids' },
    { id: '3YCJ1bs2BUs', ch: 'learnwithzakaria', title: 'Learn Emotions & Feelings in Arabic for kids | Learn Facial expressions with Zakaria & Zeeko' },
    { id: 'cCtSs2Vx6fE', ch: 'learnwithzakaria', title: 'Job names for Kids (Part 2) | Learn about jobs in Arabic for children with Zakaria & Zeeko' },
    { id: 'u26wpdWNG8E', ch: 'learnwithzakaria', title: 'Learn Colors with Cars in Arabic for Kids - تعليم ألوان السيارات للاطفال باللغة العربية' },
    { id: 'LDPc0a__dzU', ch: 'learnwithzakaria', title: 'Quran For Kids Surah An-Nasr to Surah An-Nas - القران للأطفال - سورة النصر إلى سورة الناس' },
    { id: 'uHZzJ8_fXYo', ch: 'learnwithzakaria', title: 'Learn Colors with Cars in English for Kids - تعليم ألوان السيارات باللغة الإنجليزية للاطفال' },
    { id: '5XRe69nz3Ns', ch: 'learnwithzakaria', title: 'Learn ِKitchen Tools in Arabic for Kids - تعليم أدوات المطبخ باللغة العربية للاطفال' },
    { id: '-915f3Zutow', ch: 'learnwithzakaria', title: '5 Pillars of Islam for Kids - أركان الإسلام الخمس للأطفال' },
    { id: 'So5y8Sy8R6Y', ch: 'learnwithzakaria', title: 'Aquatic Animals in English for Kids - الحيوانات للأطفال - حيوانات البحر باللغة الإنجليزية للاطفال' },
    { id: 's4KAMzafo14', ch: 'learnwithzakaria', title: 'Fruits in Arabic for Kids - أسماء الفواكه باللغة العربية للأطفال' },
    { id: 'REmgm6JPYyE', ch: 'learnwithzakaria', title: 'Fruits in French for Kids - أسماء الفواكه باللغة الفرنسية للأطفال' },
    { id: 'fmgEDGF_9Pw', ch: 'learnwithzakaria', title: 'Words with letter Taa VS Letter Dhaa | Put the picture in the right place game Learn with Zakaria' },
    { id: 'jr1xKm6WyTE', ch: 'learnwithzakaria', title: 'Words with letter Raa VS Letter Zay | Put the picture in the right place game - Learn with Zakaria' },
    { id: 'uHeMWMJuMcw', ch: 'learnwithzakaria', title: 'Words with letter Taa VS Letter Thaa | Put the picture in the right place game - Learn with Zakaria' },
    { id: 'CHfDBAErw-w', ch: 'learnwithzakaria', title: 'Learn Pet names in Arabic | Pets for kids - Learn Arabic with Zakaria' },
    { id: '0fjooyfCoOU', ch: 'learnwithzakaria', title: 'Learn Insects names in Arabic | Insects for kids - Learn Arabic with Zakaria' },

];

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
    const ap = autoplay ? '&autoplay=1' : '';
    return `https://www.youtube-nocookie.com/embed/${v.id}?rel=0&modestbranding=1&playsinline=1&color=white${ap}`;
}

function watchUrl(v) { return `https://www.youtube.com/watch?v=${v.id}`; }

function filterVideos() {
    const q = query.toLowerCase().trim();
    return VIDEOS.filter((v) => {
        const chOk = activeChannel === 'all' || v.ch === activeChannel;
        const qOk = !q || v.title.toLowerCase().includes(q) || v.ch.toLowerCase().includes(q);
        return chOk && qOk;
    });
}

/* ────────────────────────────────────────
   RENDER
──────────────────────────────────────── */
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
    $('#heroDesc').textContent = `${CHANNELS[hero.ch].label} • youtube.com`;
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
        card.innerHTML = `
            <div class="card-thumb">
                <span class="card-channel-badge ${CHANNELS[v.ch].cls}">${CHANNELS[v.ch].label}</span>
                <img src="${thumb(v)}" alt="${v.title}" loading="lazy">
            </div>
            <div class="card-info">
                <div class="card-title">${v.title}</div>
                <div class="card-channel">${CHANNELS[v.ch].label}</div>
            </div>`;
        card.addEventListener('click', () => openPlayer(v));
        grid.appendChild(card);
    });

    $('#emptyState').hidden = list.length > 0;
    $('#sectionTitle').textContent =
        t('recent') + (activeChannel === 'all' ? '' : ` — ${CHANNELS[activeChannel].label}`);
}

/* ────────────────────────────────────────
   PLAYER MODAL
──────────────────────────────────────── */
function renderSuggestions(current) {
    const box = $('#suggestBox');
    const list = VIDEOS
        .filter((v) => v.ch === current.ch && v.id !== current.id)
        .concat(VIDEOS.filter((v) => v.ch !== current.ch && v.id !== current.id))
        .slice(0, 8);
    box.innerHTML = '';
    list.forEach((v) => {
        const item = document.createElement('div');
        item.className = 'sug-item';
        item.innerHTML = `
            <img src="${thumb(v)}" alt="${v.title}" loading="lazy">
            <div class="sug-info">
                <div class="sug-title">${v.title}</div>
                <div class="sug-channel">${CHANNELS[v.ch].label}</div>
            </div>`;
        item.addEventListener('click', () => loadVideo(v));
        box.appendChild(item);
    });
}

function loadVideo(v) {
    $('#playerTitle').textContent = v.title;
    $('#playerChannel').textContent = CHANNELS[v.ch].label;
    $('#playerDesc').textContent = `https://youtu.be/${v.id}`;
    const frame = $('#playerFrame');
    frame.src = embedUrl(v, true);
    renderSuggestions(v);
    frame.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function openPlayer(v) {
    loadVideo(v);
    $('#playerModal').classList.add('open');
    document.body.style.overflow = 'hidden';
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
   EVENTS
──────────────────────────────────────── */
function bindEvents() {
    $('#langBtn').addEventListener('click', cycleLang);

    $('#nightBtn').addEventListener('click', () => {
        const on = document.body.classList.toggle('night');
        localStorage.setItem('utube-night', on ? '1' : '0');
    });

    document.querySelectorAll('.ch-tab').forEach((tab) => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.ch-tab').forEach((x) => x.classList.remove('active'));
            tab.classList.add('active');
            activeChannel = tab.dataset.channel;
            renderHero();
            renderGrid();
        });
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
        const v = VIDEOS.find((x) => x.id === e.currentTarget.dataset.id);
        if (v) openPlayer(v);
    });

    $('#heroVideo').addEventListener('click', (e) => {
        const v = VIDEOS.find((x) => x.id === e.currentTarget.dataset.id);
        if (v) openPlayer(v);
    });

    $('#closeBtn').addEventListener('click', closePlayer);
    $('#playerModal').addEventListener('click', (e) => {
        if (e.target === $('#playerModal')) closePlayer();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePlayer();
    });
}

/* ────────────────────────────────────────
   BOOT
──────────────────────────────────────── */
(function init() {
    const savedLang = localStorage.getItem('utube-lang');
    if (savedLang && LANGS.some((l) => l.code === savedLang)) lang = savedLang;
    initTheme();
    bindEvents();
    applyI18n();
    renderHero();
    renderGrid();
})();
