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
    staypawsitive: { label: 'Stay Paw-sitive! CoComelon', cls: 'ch-cx0', color: '#ef476f', icon: '🐾' },
    lizhuma: { label: 'Lizhuma', cls: 'ch-cx1', color: '#ffd166', icon: '🐥' },
    bebefinn: { label: 'Bebefinn', cls: 'ch-cx2', color: '#f472b6', icon: '🦈' },
    papapipi: { label: 'Papa Pipi', cls: 'ch-cx3', color: '#f97316', icon: '👨‍👦' },
    pinkfong: { label: 'Baby Shark - Pinkfong', cls: 'ch-cx4', color: '#0ea5e9', icon: '🦈' },
    didimalay: { label: 'Didi & Friends (BM)', cls: 'ch-cx5', color: '#f59e0b', icon: '🐤' },
    parakeet: { label: 'The Parakeet', cls: 'ch-cx6', color: '#84cc16', icon: '🦜' },
    omarhanams: { label: 'Omar & Hana (BM)', cls: 'ch-cx7', color: '#16a34a', icon: '🌙' },
    monsta: { label: 'MONSTA', cls: 'ch-cx0', color: '#e63946', icon: '⚡' },
    powersphera: { label: 'Power Sphera Universe', cls: 'ch-cx1', color: '#8b5cf6', icon: '🌌' },
    animasea: { label: 'AnimaSEA', cls: 'ch-cx2', color: '#0891b2', icon: '🌊' },
    lescopaque: { label: 'Les\' Copaque', cls: 'ch-cx3', color: '#10b981', icon: '🧢' },
    lalala: { label: 'lalala Kids Songs', cls: 'ch-cx4', color: '#d946ef', icon: '🎶' },
    dawood: { label: 'Dawood Kids TV', cls: 'ch-cx5', color: '#6d28d9', icon: '🕌' },
    emmie: { label: 'Emmie\'s Wonder Wardrobe', cls: 'ch-cx0', color: '#ec4899', icon: '👗' },
    neurotic: { label: 'Neurotic Studio', cls: 'ch-cx1', color: '#64748b', icon: '🎵' },
};


const VIDEOS = [
    // Stay Paw-sitive! CoComelon
    { id: 'ywelumJzgrg', ch: 'staypawsitive', title: 'Wheels on the Bus! | CoComelon Animal Time | Animal Nursery Rhymes' },
    { id: 'OkqCplssn2A', ch: 'staypawsitive', title: 'Baa Baa Black Sheep! | CoComelon Animal Time | Animal Nursery Rhymes' },
    { id: 'EwTIZTuBL4k', ch: 'staypawsitive', title: 'Baby Shark! (Submarine Version) | CoComelon Animal Time | Animal Nursery Rhymes' },
    { id: 'SPlWcqYZCTk', ch: 'staypawsitive', title: 'Shopping Cart Song | CoComelon - Cody\'s Playtime | Songs for Kids & Nursery Rhymes' },
    { id: 'IrDnibAGlO0', ch: 'staypawsitive', title: 'Five Little Ducks! | CoComelon Animal Time | Animal Nursery Rhymes' },
    { id: 'xbdtMdd6zFg', ch: 'staypawsitive', title: 'Baa Baa Black Sheep + Wheels on the Bus + MORE CoComelon Animal Time | Animal Nursery Rhymes' },
    { id: 'YQv20lyAiKI', ch: 'staypawsitive', title: '12345 Once I Caught A Fish Alive! | CoComelon Animal Time | Animal Nursery Rhymes' },
    { id: 'EfxxT10ui2k', ch: 'staypawsitive', title: 'Shopping Cart Song | CoComelon - Cody\'s Playtime | Songs for Kids & Nursery Rhymes' },
    { id: 'rsmrZ0PosbY', ch: 'staypawsitive', title: 'Soccer Song (Football Song) | CoComelon - Cody\'s Playtime | Songs for Kids & Nursery Rhymes' },
    { id: 'neTnOMQF9k0', ch: 'staypawsitive', title: 'The Boo Boo Song | CoComelon - Cody\'s Playtime | Songs for Kids & Nursery Rhymes' },
    { id: 'uGzqsLrN4rA', ch: 'staypawsitive', title: 'Five Little Speckled Frogs! | CoComelon Animal Time | Animal Nursery Rhymes' },
    { id: 'cjfSMi9Mi9Y', ch: 'staypawsitive', title: 'Train Park Song | 25 Min | CoComelon - Cody\'s Playtime | Songs for Kids & Nursery Rhymes' },
    { id: '8-jv-TMvdWA', ch: 'staypawsitive', title: 'Soccer Song (Football Song) | CoComelon - Cody\'s Playtime | Songs for Kids & Nursery Rhymes' },
    { id: 'uwIGfb4eDz8', ch: 'staypawsitive', title: 'How Can We Wash the Bus? | Wheels on the Bus | CoComelon Animal Time | Animal Nursery Rhymes' },
    { id: 'C30pH2J5oFQ', ch: 'staypawsitive', title: 'Boba in the Middle! | CoComelon Animal Time | Animal Nursery Rhymes' },
    { id: 'JyfGi45d2lA', ch: 'staypawsitive', title: 'The ABC Soup Song | CoComelon - Cody\'s Playtime | Songs for Kids & Nursery Rhymes' },
    { id: 'paq1P4CU6nM', ch: 'staypawsitive', title: 'Wheels On The Bus | 25 Min | CoComelon - Cody\'s Playtime | Songs for Kids & Nursery Rhymes' },
    { id: 'aCEJrYMROaY', ch: 'staypawsitive', title: 'Animal Dance Song! | CoComelon Animal Time | Animal Nursery Rhymes' },
    { id: 'eMY8nBuDaeY', ch: 'staypawsitive', title: 'Baby Shark Hide & Seek! | CoComelon Animal Time | Animal Nursery Rhymes' },
    { id: 'BDDu7B7WKGQ', ch: 'staypawsitive', title: 'Shopping Cart Song | CoComelon - Cody\'s Playtime | Songs for Kids & Nursery Rhymes' },
    { id: '9wfXPXL79OM', ch: 'staypawsitive', title: 'Wheels on the Bus Goes Round & Round | CoComelon - Cody\'s Playtime | Songs for Kids & Nursery Rhymes' },
    { id: 'Plq4Yt0W6kk', ch: 'staypawsitive', title: 'Goodbye Song | CoComelon - Cody\'s Playtime | Songs for Kids & Nursery Rhymes' },
    { id: 'dVsj07bZpxA', ch: 'staypawsitive', title: 'Train Park Song | CoComelon - Cody\'s Playtime | Songs for Kids & Nursery Rhymes' },
    { id: 'I6TojVhk59Q', ch: 'staypawsitive', title: 'Row Row Row Your Boat! | CoComelon Animal Time | Animal Nursery Rhymes' },
    { id: 'yC0h7zv5-VA', ch: 'staypawsitive', title: 'Fun At The Train Park | CoComelon - Cody\'s Playtime | Songs for Kids & Nursery Rhymes' },
    { id: 'H1bV3dhUy6A', ch: 'staypawsitive', title: 'Learn The ABC\'s with Animals! | CoComelon Animal Time | Animal Nursery Rhymes' },
    { id: 'uG5WJ71Cbes', ch: 'staypawsitive', title: 'Itsy Bitsy Spider! | CoComelon Animal Time | Animal Nursery Rhymes' },
    { id: 'Eb0RBpzHkw4', ch: 'staypawsitive', title: 'Bath Song | CoComelon - Cody\'s Playtime | Songs for Kids & Nursery Rhymes' },
    { id: '-hzwanE28Gs', ch: 'staypawsitive', title: 'Mary Had a Little Lamb! | CoComelon Animal Time | Animal Nursery Rhymes' },
    { id: '-RhQtu6qAzM', ch: 'staypawsitive', title: 'Wheels on the Bus Halloween | CoComelon - Cody\'s Playtime | Songs for Kids & Nursery Rhymes' },

    // Lizhuma
    { id: 'LgiXQGX5kqU', ch: 'lizhuma', title: 'Lagu Anak anak | CICAK CICAK DI DINDING | Cicak di dinding kartun | lagu cicak cicak di dinding' },
    { id: '6oOaafjtinI', ch: 'lizhuma', title: 'Cicak CICAK di dinding | Naik Delman istimewa Lagu anak, balonku ada lima | lagu anak-anak balita🐎' },
    { id: '8_xrD2lSOGg', ch: 'lizhuma', title: 'Lizard on the Wall Children\'s song | Children\'s songs | Lizard song on the wall silently' },
    { id: '0-XYe2DtRBM', ch: 'lizhuma', title: 'CICAK Cicak di Dinding | Lagu Anak anak | Cicak cicak didinding | lagu anak indonesia' },
    { id: 'V_nrT3Ftm2A', ch: 'lizhuma', title: 'CICAK CICAK DI DINDING LAGU ANAK | Kumpulan LAGU ANAK ANAK lainnya ❤️ Lagu Anak indonesia' },
    { id: 'QD40xGQJVGo', ch: 'lizhuma', title: 'LIZARD ON THE WALL - If You\'re Happy | Children\'s songs | DUCK GOOSE gecko gecko animation.' },
    { id: 'wxw3yxR9lgE', ch: 'lizhuma', title: 'Lagu CICAK di Dinding | Lagu Anak Anak | Cicak Cicak di Dinding lagu anak' },
    { id: '107dW7FSpjE', ch: 'lizhuma', title: 'Cicak cicak di Dinding | Cicak Orange | Lagu Anak Indonesia' },
    { id: '3cYdHByoYHo', ch: 'lizhuma', title: 'KALAU KAU SUKA HATI Tepuk tangan | Cicak CICAK DI Dinding | Lagu anak anak' },
    { id: 'VzHjxyA7RbI', ch: 'lizhuma', title: 'KALAU KAU SUKA HATI tepuk Tangan | Lagu Anak Indonesia , Lagu Anak anak 👏' },
    { id: 'wEpmzqhYH8o', ch: 'lizhuma', title: 'Kalau Kau Suka Hati Tepuk Tangan | Lagu anak anak | Cicak cicak di Dinding dan Lagu anak lainnya.' },
    { id: 'NK3MmiKsGwE', ch: 'lizhuma', title: 'CICAK CICAK di Dinding dan Pok ame Ame, Lagu anak anak, potong BEBEK Angsa' },
    { id: 'A6l-FGsPJ3k', ch: 'lizhuma', title: 'Lagu Anak Anak - ANAK KUCING MEONG MEONG - Lagu Anak & Balita Viral terbaru' },
    { id: 'kyDJn3VXXNo', ch: 'lizhuma', title: 'Aku Anak Sehat Cicak dan Bebek Bangun Tidur Lagu anak balita .' },
    { id: 'Q_6tgdn0FsY', ch: 'lizhuma', title: 'Naik Kereta Api Tut tut | Lagu Anak Anak | CiCaK di dinding , lagu anak indonesia lainnya' },
    { id: '2Almc8QPF4Y', ch: 'lizhuma', title: 'Kalau kau suka Hati tepuk tangan | Lagu anak balita indonesia' },
    { id: '0P53BzAQDbI', ch: 'lizhuma', title: 'Cicak Cicak di Dinding, Lagu anak Kepala Pundak lutut kaki Lutut kaki , lagu balita indonesia' },
    { id: 'Z9Sd04Wefc0', ch: 'lizhuma', title: 'Kitten Meow Meow Cheerful and Funny Kids Song, Songs for Kids & Toddlers' },
    { id: 'nXbUN4aK9xs', ch: 'lizhuma', title: 'Kalau kau Suka Hati | Lagu anak Anak, Cicak cicak di dinding | Lagu Anak Indonesia' },
    { id: 'HmSgqRABA38', ch: 'lizhuma', title: 'Kalau Kau SUKA HATI tepuk tangan | Lagu anak - Cicak cicak dinding' },
    { id: 'Jd5PdstqN9Q', ch: 'lizhuma', title: 'Lagu Anak Anak – ANAK KUCING MEONG MEONG | Lagu Anak Edukatif Balita' },
    { id: 'TmSyYi2lSNM', ch: 'lizhuma', title: 'Meow Meow Kitten Cheerful and Funny Kids Song, New Songs for Kids & Toddlers' },
    { id: 'Z4hMT_FKGRM', ch: 'lizhuma', title: 'Pok Ame Ame | Lagu anak balita Indonesia | lagu anak populer.' },
    { id: '0C1n7SXzPW4', ch: 'lizhuma', title: 'Anak Kucing Meong Meong Lagu Anak Ceria dan Lucu, Lagu Anak & Balita' },
    { id: 'pc1x3fwnVRc', ch: 'lizhuma', title: 'Lagu Anak anak - CICAK - cicak Berenang - cicak di dinding - Lagu Cicak cicak di dinding' },
    { id: 'MpAUndJxtYk', ch: 'lizhuma', title: 'Meow Meow Kittens Happy and Funny Children\'s Song, Newest Song for Kids & Toddlers' },
    { id: 'RLK3hgzTU5M', ch: 'lizhuma', title: 'Meow Meow Kitten Cheerful and Funny Kids Song, New Songs for Kids & Toddlers' },
    { id: 'T96p160b0-E', ch: 'lizhuma', title: 'Cicak Cicak Di dinding | BALONKU Ada Lima | Lagu anak anak Cicak dinding' },
    { id: '410aFB3-5XQ', ch: 'lizhuma', title: 'Kitten Meow Meow Cheerful and Funny Kids Song, Songs for Kids & Toddlers' },
    { id: 'KwXedNxltMY', ch: 'lizhuma', title: 'CICAK Cicak Di Dinding | CiCak Berenang - Lagu anak anak | CICAK didinding Lagu Anak-Anak' },

    // Bebefinn
    { id: 'kuDzMR6k4R4', ch: 'bebefinn', title: '☀️Good Morning Bebefinn! Wake up Bora #goodmorning_bebefinn | EP14 | Bebefinn\'s No.1 Nursery Rhymes' },
    { id: 'qxDuLdfGfW4', ch: 'bebefinn', title: 'Baby Shark and Bebefinn Doo Doo Doo | EP01 | Songs for Kids | Bebefinn - Nursery Rhymes & Kids Songs' },
    { id: 'N1Hgj4O9Nk0', ch: 'bebefinn', title: 'Mix - Baby Shark, Good Morning, Baby Car | #Bebefinn Most Viewed Videos | Animal Songs' },
    { id: 'm2mfP-AVMgQ', ch: 'bebefinn', title: 'Run Away Baby Car!🚗 | EP38 | Baby Shark Doo Doo Doo | Bebefinn Songs for Kids | Nursery Rhymes' },
    { id: '78rSZ9iEQeo', ch: 'bebefinn', title: '🍭 Yes Papa Yes Mama! | EP109 | Bebefinn Nursery Rhymes for Kids' },
    { id: 'F437eCwurA0', ch: 'bebefinn', title: '☀️Good Morning! Wake Up | #goodmorning_bebefinn | Nursery Rhymes Compilation for Kids | Family Song' },
    { id: 'Lh93IVFQU-Q', ch: 'bebefinn', title: 'Good Morning ☀️ Let\'s Feed Boo 😻 #goodmorning_bebefinn | EP104 | Bebefinn Best Songs' },
    { id: 'oiKji3JjkgY', ch: 'bebefinn', title: '🌧 Rain, Rain, Go Away #rainyday_bebefinn | EP101 | Bebefinn Nursery Rhymes for Kids' },
    { id: 'u05ke3nGqU0', ch: 'bebefinn', title: 'Yes Papa! No Bebefinn\'s Not Eating Cookies! | EP02 | Songs for Kids | Nursery Rhymes & Kids Songs' },
    { id: 'QXMHKfTtah4', ch: 'bebefinn', title: '🚶Walking Walking #walkingwalking_bebefinn | EP07 | Bebefinn Nursery Rhymes for Kids | Healthy Habits' },
    { id: 'qC3kGaTBW7s', ch: 'bebefinn', title: 'Moo 🐄 Oink! 🐷 Animal Sounds Song | EP18 | Songs for kids | Bebefinn - Nursery Rhymes & Kids Songs' },
    { id: 'Sje6rnScu7o', ch: 'bebefinn', title: 'Baby Shark Doo Doo Doo and more | Bebefinn Best Nursery Rhyme Compilation for Kids' },
    { id: 'stMZrWNXTKI', ch: 'bebefinn', title: 'Ride a Bike! 🚲 | EP99 | Outdoor Play and Learning | Bebefinn Nursery Rhymes' },
    { id: 'l_qyieStjMI', ch: 'bebefinn', title: 'Walking Walking #walkingwalking_bebefinnㅣNursery Rhymes for KidsㅣDance along Bebefinn' },
    { id: 'RLRsSeEPgJY', ch: 'bebefinn', title: 'Ouchie! Help Me Please 😭 | EP09 | Boo Boo Song | Bebefinn - Nursery Rhymes & Kids Songs' },
    { id: 'YK6aMTRCXTg', ch: 'bebefinn', title: 'Best T-rex and dinosaur songs | Animal Songs | +more compilation | Bebefinn Nursery Rhymes for Kids' },
    { id: 'MwzaSfkmLGY', ch: 'bebefinn', title: '💎 Treasure Hunt AdventureㅣBebefinn Playtime | Musical Stories' },
    { id: 'R0zwyX2La5w', ch: 'bebefinn', title: 'Bebe Ay! Bebefinn Song and More to Sing Alongㅣ Song CompilationㅣNursery Rhymes for Kids' },
    { id: '0PNiZflV2JQ', ch: 'bebefinn', title: 'Five Little Sharks 🦈 | EP39 | Baby Shark Doo Doo Doo | Bebefinn Songs for Kids | Nursery Rhymes' },
    { id: 'WKXXoPXQHjk', ch: 'bebefinn', title: 'Bebefinn\'s got a boo-boo 😭 | EP70 | Boo-Boo Song for Kids | Bebefinn Sing Along2 | Nursery Rhymes' },
    { id: 'Vk24cZJQTwE', ch: 'bebefinn', title: 'The Cat Song 😻 I\'m A Ginger Cat Boo! Meow | EP73 | Bebefinn Sing Along2 | Nursery Rhymes For Kids' },
    { id: '7muxnzQZS28', ch: 'bebefinn', title: 'Bebefinn ABC Song + more nursery rhymes | Alphabet Songs for Kids | Compilation' },
    { id: '4GCCv9LOcW8', ch: 'bebefinn', title: '🙈🙉 Peek-a-Boo Song | EP08 | Songs for Kids | Bebefinn - Nursery Rhymes & Kids Songs' },
    { id: 'AzvZEbYMqtw', ch: 'bebefinn', title: 'Dinosaurs and Old MacDonald Had a Farm +more Songs | Bebefinn Nursery Rhymes' },
    { id: 'xXso_TSrL5c', ch: 'bebefinn', title: 'Who am I? 😎 | Bebefinn Song | Special Songs for Kids | Best Nursery Rhymes' },
    { id: 'FDMgufO6kQ0', ch: 'bebefinn', title: 'TOP 30 Popular Songs for Kids | +Compilation | Bebefinn Nursery Rhymes for Kids' },
    { id: 'IIjv09RS0gg', ch: 'bebefinn', title: 'Ten in a Bed and Five Little Sharks | Count Numbers Together | Compilation | Bebefinn Nursery Rhymes' },
    { id: 'xJ6gG6DUjhI', ch: 'bebefinn', title: '🦈 Shark Finger Family | EP107 | Baby Shark Doo Doo Doo | Bebefinn Best Songs and Nursery Rhymes' },
    { id: 'ouytzhjWSSY', ch: 'bebefinn', title: 'I\'ve Got a Boo Boo! | Sing Along with Bebefinn | Healthy Habits | The Boo Boo Song' },
    { id: 'rPBqB8i1qy8', ch: 'bebefinn', title: 'Where Are You, Color Buses? 🚌 | EP56 | Bebefinn Sing Along | Nursery Rhymes & Kids Songs' },

    // Papa Pipi
    { id: 'oWKTfz7ndJU', ch: 'papapipi', title: 'MTV Raya feat. BoBoiBoy & Yaya' },
    { id: 'kZ0suZ0U-Lc', ch: 'papapipi', title: 'PSA Hari Raya - \'Berhati-hati di Jalan Raya\'' },
    { id: 'C_fBzMF_qXA', ch: 'papapipi', title: 'Kompilasi lagu-lagu PAPA PIPI' },
    { id: 'WcUfX-379E8', ch: 'papapipi', title: 'Meet Ying!' },
    { id: '52qP7LK-DTk', ch: 'papapipi', title: 'MASAK DI RUMAH | KOMPILASI 50 MINIT | #PapaPipi' },
    { id: 'bI9V_67IK6s', ch: 'papapipi', title: 'Aneka Baju Raya | Lagu Trendi | Istimewa Raya | #PapaPipi' },
    { id: 'RKZzcpipqx8', ch: 'papapipi', title: 'FAMILI PAPA PIPI PINDAH - Iklan Raya MONSTA 2024 #DemiFamili' },
    { id: 'bjKu0cKw-mw', ch: 'papapipi', title: 'KOMPILASI TERKINI I Papa & Pipi Zola' },
    { id: 'bph9ZHI5FzI', ch: 'papapipi', title: 'Mana Bunga Api?! | Kompilasi #PapaPipi | 1 Jam' },
    { id: 'uZ4VLYaRV4o', ch: 'papapipi', title: 'PSA Hari Raya - \'Jiran Terbaik!\'' },
    { id: 'wG3ZqbhZeqQ', ch: 'papapipi', title: 'BoBoiBoy Episode 03 (Deleted scene)' },
    { id: '6QNVMD8zea0', ch: 'papapipi', title: 'Lagu Tema Papa Pipi Zola | KITA SEMUA HAPPY! | #PapaPipiZola' },
    { id: 'OPwH_rXV_oM', ch: 'papapipi', title: 'PSA Hari Raya - \'Beringat Ketika Makan\'' },
    { id: 'oJm1udAUXr4', ch: 'papapipi', title: 'HELLO BOMBA!!! | Kompilasi | 19 Minit | #PapaPipi' },
    { id: 'HyZMAGGKQFg', ch: 'papapipi', title: 'Rindu Papa Pipi! | Kompilasi #PapaPipi | 57 Minit' },
    { id: 'EQTF79nPeqo', ch: 'papapipi', title: 'BoBoiBoy Extended Finale!' },
    { id: 'WRynWVqLzDk', ch: 'papapipi', title: 'PAPA ZOLA TAKUT KENA CUCUK | Pesanan Papa Pipi' },
    { id: 'j2SaLYrbZGU', ch: 'papapipi', title: 'BoBoiBoy Kembali!' },
    { id: 'L4ODnGO1WUY', ch: 'papapipi', title: 'Apa Kata Yaya' },
    { id: 'abXJrITT2HQ', ch: 'papapipi', title: 'Rasa SarangHae| BARU! | Lagu Trendi | #PapaPipi' },
    { id: 'cn3Yi2RiDBU', ch: 'papapipi', title: 'BoBoiBoy Children\'s Day Promo' },
    { id: 'z28ChHGWLNw', ch: 'papapipi', title: 'Video Lucu Pesanan Papa Pipi (12 Minit)' },
    { id: 'AoDX2Fjw2NQ', ch: 'papapipi', title: 'BoBoiBoy Global TV 10th Anniversary Promo' },
    { id: 'khEdsDqc7PI', ch: 'papapipi', title: 'BoBoiBoy Trailer HD' },
    { id: 'Cj_ECcCdf9Q', ch: 'papapipi', title: 'Meet BoBoiBoy!' },
    { id: 'L4yHoUHvjeM', ch: 'papapipi', title: 'Lagu Trendi Papa Pipi: Ayuh Cuci Tangan!' },
    { id: 'GBknBwSdUnU', ch: 'papapipi', title: 'PESANAN PAPA PIPI: Buai Laju-Laju' },
    { id: 'GpSzIS1ZsDg', ch: 'papapipi', title: 'Kompilasi Papa & Pipi' },
    { id: 'e5rGgGVUwwk', ch: 'papapipi', title: 'MTV Incik Boss & Probe' },
    { id: '_MGvKe0ijqE', ch: 'papapipi', title: 'Kompilasi Papa & Pipi TERBARU' },

    // Baby Shark - Pinkfong
    { id: 'XqZsoesa55w', ch: 'pinkfong', title: 'Baby Shark Dance | #babyshark Most Viewed Video | Animal Songs | PINKFONG Songs for Children' },
    { id: '7DYjfjaZGas', ch: 'pinkfong', title: 'Monkey Banana-Baby Monkey | Animal Songs | PINKFONG Songs for Children' },
    { id: 'gsw-de5xcCU', ch: 'pinkfong', title: 'Baby Shark, featuring Luis Fonsi | Baby Shark Song | Pinkfong Songs for Children' },
    { id: '-fJ_Lvy_LAc', ch: 'pinkfong', title: 'Baby Shark Dance with Song Puppets | Baby Shark Toy | Toy Review | Pinkfong Songs for Children' },
    { id: 'ubmiT8JKeRU', ch: 'pinkfong', title: 'Monkey Banana Dance | Baby Monkey | Dance Along | Pinkfong Songs for Children' },
    { id: 'fU1KKvbCrRI', ch: 'pinkfong', title: 'Monkey Banana Dance | Baby Monkey | Dance Along Song | Pinkfong Kids Songs' },
    { id: 'R93ce4FZGbc', ch: 'pinkfong', title: 'Baby Shark | Animal Songs | PINKFONG Songs for Children' },
    { id: 'gX2gOpgoTgw', ch: 'pinkfong', title: 'Baby Shark | Sing and Dance! | @Baby Shark Official | PINKFONG Songs for Children' },
    { id: 'Dybkj4VU2H0', ch: 'pinkfong', title: 'Thank You Heroes | Health Care Workers | Frontliners | Thank You Song | Pinkfong Songs for Children' },
    { id: 'sLFdnqMrGCM', ch: 'pinkfong', title: 'Five Little Monkeys | Dance Along | Pinkfong Songs for Children' },
    { id: 'KyBYuEgvFl0', ch: 'pinkfong', title: 'Baby Car | Car Songs | Pinkfong Songs for Children' },
    { id: 'x5Udg77RMeY', ch: 'pinkfong', title: 'Baby Shark Dance and more | +Compilation | Baby Shark Swims to the TOP | Pinkfong Songs for Children' },
    { id: 'JYnvpJL-0HA', ch: 'pinkfong', title: 'Baby Shark More and More | Baby Shark | Shark Family | Pinkfong Songs for Children' },
    { id: 'nDE3Ff-5zG4', ch: 'pinkfong', title: 'Baby Shark Bus | The shark bus goes round and round | Bus Songs | Pinkfong Songs for Children' },
    { id: 'S-kJQbq6oaA', ch: 'pinkfong', title: 'FASTER Version of Baby Shark | Faster and Faster! | Animal Songs | PINKFONG Songs for Children' },
    { id: 'd8pqPa7D8Ps', ch: 'pinkfong', title: 'Baby Shark Dance With Kids Wearing Shark Costumes! | Animal Songs | PINKFONG Songs for Children' },
    { id: '3XWRT0JZd5k', ch: 'pinkfong', title: 'Baby Shark Meets Traditional Korean Music♪ | Animal Songs | Pinkfong Songs for Children' },
    { id: 'Fx-BoVdbyi4', ch: 'pinkfong', title: 'Baby Shark Medley | +Compilation | Baby Shark | Pinking Songs for Children' },
    { id: 'wHumvJAIbVA', ch: 'pinkfong', title: 'Chumbala Cachumbala and more | +Compilation | Halloween Songs | Pinkfong Songs for Children' },
    { id: 'rlYHL_VpTBc', ch: 'pinkfong', title: 'Baby Shark Dance and more | Summer Songs Special | +Compilation | Pinkfong Songs for Children' },
    { id: 'eVDGYl0p6nU', ch: 'pinkfong', title: 'Clay Baby Shark | Pinkfong Clay | Animal Songs | Pinkfong Songs for Children' },
    { id: 'kvP4T6_Ji7A', ch: 'pinkfong', title: 'Baby T-Rex | Dance Along | Pinkfong Songs for Children' },
    { id: 'q6qmIBdxOEI', ch: 'pinkfong', title: 'Baby Shark and more | Best Songs of 2018 | +Compilation | Pinkfong Songs for Children' },
    { id: 'KFKGPOMusZk', ch: 'pinkfong', title: 'Shark ABC | Now I know my ABCs! | Sing along with baby shark | Pinkfong Songs for Children' },
    { id: 'tnj17sXKW5s', ch: 'pinkfong', title: 'Baby Shark Dance and more | Best Summer Songs | +Compilation | Pinkfong Songs for Children' },
    { id: 'd2S87jXhlV0', ch: 'pinkfong', title: 'Original Baby Shark | Go #BabySharkChallenge | Special Thank You Video | Pinkfong' },
    { id: 'weHSNl8CbDo', ch: 'pinkfong', title: 'Five Little Monkeys | Word Play | Pinkfong Songs for Children' },
    { id: 'lR-vzUw8sWo', ch: 'pinkfong', title: 'Shark Finger Family | Sing Along with Baby Shark | Pinkfong Songs for Children' },
    { id: 'rYHnOgwuDeM', ch: 'pinkfong', title: 'Monkey Banana Faster Version | Baby Monkey | Animal Songs | Pinkfong Songs for Children' },
    { id: 'Mmkxfco9GNk', ch: 'pinkfong', title: 'Baby Shark Dance and more | +Compilation | Best Kids Songs | Pinkfong Songs for Children' },

    // Didi & Friends (BM)
    { id: 'tMS2um3bAxM', ch: 'didimalay', title: 'Mengantuknya Mumia | Didi & Friends Lagu Kanak-Kanak | Didi Lagu Baru' },
    { id: '-8SnAJYICU0', ch: 'didimalay', title: 'Lagu Kanak Kanak | Kalau Rasa Gembira | Didi & Friends' },
    { id: 'pzAJ10aRuBM', ch: 'didimalay', title: 'Lagu Kanak-Kanak | Rasa Sayang | Didi & Friends' },
    { id: 'U82Yf-87AtE', ch: 'didimalay', title: 'Lagu Kanak Kanak | Tepuk Amai- Amai | Didi & Friends' },
    { id: '6_4cH3hA4ik', ch: 'didimalay', title: 'Kalau Rasa Gembira | Koleksi Lagu Kanak-Kanak Popular | Didi & Friends | 23 Minit' },
    { id: 'od2HLLUwKao', ch: 'didimalay', title: 'Lagu Kanak-Kanak | Tayar Bas | Didi & Friends' },
    { id: '0A6KCd9fcY4', ch: 'didimalay', title: 'Lagu Kanak Kanak | BINGO | Didi & Friends' },
    { id: '2s6RcKnIFH8', ch: 'didimalay', title: 'Lagu Kanak Kanak | Papaku Pulang Dari Kota | Didi & Friends' },
    { id: '36gEaTfqV6U', ch: 'didimalay', title: 'Didi & Friends x MyKekiss | Segmen Kreatif | Jom Buat Sugar Cookies Didi & Friends' },
    { id: 'hLcSM4gbS3o', ch: 'didimalay', title: 'Kompilasi Lagu Baru Didi & Friends | Lagu Mandi & Lain-Lain' },
    { id: 'FvO1EHFqsqs', ch: 'didimalay', title: 'Cerita-Cerita Didi & Friends Mengembara Bersama | Dah Sampai Ke?' },
    { id: 'CZ3BmywhIMQ', ch: 'didimalay', title: 'Lagu Kanak Kanak | ABC | Didi & Friends' },
    { id: 'RG4IiEWfqWc', ch: 'didimalay', title: 'Kereta Polis | Didi & Friends Lagu Kanak-Kanak | Didi Lagu Baru' },
    { id: 'PXoq9pWvlXs', ch: 'didimalay', title: 'Didi Lagu Baru | Goyang Goyang Zombi | Didi & Friends Lagu Kanak-Kanak' },
    { id: 'l_k3nsnMdA0', ch: 'didimalay', title: 'Didi Lagu Baru | Didi & Friends Lagu Kanak-Kanak | Oh Jerung!' },
    { id: 'daQ3UwVA7c4', ch: 'didimalay', title: 'Lagu Kanak Kanak | Selamat Hari Jadi | Didi & Friends' },
    { id: '8VgvEpv7iS0', ch: 'didimalay', title: 'Lagu Kanak-Kanak | Didi & Friends | Kompilasi Lagu Kegemaran Pak Atan | 27 Minit' },
    { id: 'KgevCC-nxUU', ch: 'didimalay', title: 'Ninja | Didi Lagu Baru | Didi & Friends Lagu Kanak-Kanak' },
    { id: '_MdjBW7KMQM', ch: 'didimalay', title: 'Kompilasi Cerita-Cerita Kanak-Kanak | Didi & Friends | Hari Sukan & lain-lain' },
    { id: 'DARatGuaOgU', ch: 'didimalay', title: 'Bunyi Anak Haiwan | Didi & Friends Lagu Kanak-Kanak | Didi Lagu Baru' },
    { id: 'cYuMIX6pIPk', ch: 'didimalay', title: 'Didi & Friends Lagu Kanak-Kanak | Di Mana Kimi' },
    { id: 'xlT5LvRxOUk', ch: 'didimalay', title: 'Lagu Kanak Kanak | Buai Laju-Laju | Didi & Friends' },
    { id: 'zk2DLN7O0F4', ch: 'didimalay', title: 'Lagu Kanak Kanak | Nenek Si Bongkok Tiga | Didi & Friends' },
    { id: 'ZRMsDUwn4MA', ch: 'didimalay', title: 'Ais Krim & Lagu Didi & Friends Lain-Lain | 30 Minit | Kompilasi Lagu Baru Didi & Friends' },
    { id: '9GwI2S0eSL0', ch: 'didimalay', title: 'Kompilasi Cerita-Cerita Didi & Friends Mengembara Bersama | Dah Sampai Ke? dan Lain-lain' },
    { id: 'kQIfviQC8R8', ch: 'didimalay', title: 'Kompilasi Lagu Baru Didi & Friends | Keretapi Didi & Lain-Lain | 50 Minit' },
    { id: '1OZFmyq62nE', ch: 'didimalay', title: 'Lagu Kanak Kanak | Anggota Badan | Didi & Friends' },
    { id: 'SzAK4ZBISZA', ch: 'didimalay', title: 'Lagu Kanak Kanak | Bunyi Haiwan | Didi & Friends' },
    { id: 'vmM9iwVg5DQ', ch: 'didimalay', title: 'Lagu Kanak Kanak | Burung Kakak Tua | Didi & Friends' },
    { id: '4cHzXFWQxJM', ch: 'didimalay', title: 'Lagu Kanak Kanak | Tetamu Didi | Didi & Friends' },

    // The Parakeet
    { id: 'KjmuBo8xoCU', ch: 'parakeet', title: 'COW VIDEO 🐮🐄 COWS MOOING AND GRAZING IN A FIELD | Cow Video' },
    { id: 'h7k6P12gfic', ch: 'parakeet', title: 'HAPPY COWS DANCING, RUNNING, SKIPPING OUT, AND JUMPING IN THE FIELD VIDEO' },
    { id: 'zzVS4soCak8', ch: 'parakeet', title: 'COW VIDEOS, COWS GRAZING IN A FIELD, COWS MOOING | Cow Video' },
    { id: 'D1hCiBAgyEE', ch: 'parakeet', title: 'COW VIDEOS, COWS GRAZING NATURAL COW SOUNDS | Cow Video | Cows Mooing' },
    { id: '8SS4Zdx1utc', ch: 'parakeet', title: '4K RELAXING FARM ANIMALS VIDEO | RELAXING FARM ANIMAL SOUNDS' },
    { id: 'sObyVL3oU6g', ch: 'parakeet', title: 'BEAUTIFUL COW VIDEO , COWS GRAZING & MOOING | Cow Video' },
    { id: '-aIlOxa-WBI', ch: 'parakeet', title: 'REAL COW VIDEOS REAL COW SOUNDS | Cow Video' },
    { id: 'UbtylnIHQXA', ch: 'parakeet', title: 'Calves Video, Adorable Baby Cows | Cow Video' },
    { id: 'PsBnW7Jo-_I', ch: 'parakeet', title: 'COW VIDEO COWS MOOING | Cow Video' },
    { id: 'cvB0Efy5fWg', ch: 'parakeet', title: 'BELTED GALLOWAY GRAZING RELAXING | Cow Video' },
    { id: 'WteNFsYlDzI', ch: 'parakeet', title: 'REAL COW VIDEO COW VIDEOS | Cow Video' },
    { id: '1Zd2FjNmkSg', ch: 'parakeet', title: 'RELAXING COW VIDEO 🐄 COWS GRAZING ON THE FIELD (with nature sounds & music) | Cow Video' },
    { id: 'DLJ2Z8ATgSg', ch: 'parakeet', title: 'DIFFERENT COW BREEDS GRAZING REAL COW VIDEOS | Cow Video' },
    { id: 'il5Wc4uFGeQ', ch: 'parakeet', title: '4k cow video with relaxing music & meadow sounds' },
    { id: 'lKznMnU1E1g', ch: 'parakeet', title: 'COWS GOING TO THE PASTURE COW SOUNDS COW VIDEO WITH MUSIC | Cow Video' },
    { id: 'sJynfagwd7c', ch: 'parakeet', title: 'COW VIDEOS COWS MOOING HOLSTEIN DAIRY COW' },
    { id: 'zKmepIIkhWc', ch: 'parakeet', title: 'Relaxing 4K Countryside Cows 🐄 Grazing & Mooing 🎶 | Calming Nature Sounds 🌿 for Stress Relief 😌' },
    { id: 'x2SncFHLEbo', ch: 'parakeet', title: 'Cows in the Countryside: Mooing & Grazing Video 🌾 serenely 🌻' },
    { id: 'mITNDZ8n1FU', ch: 'parakeet', title: '4k Farm Animal Video 🌿 Discover Tranquillity: Farm Animal Relaxation Video' },
    { id: '42DEVyxMf54', ch: 'parakeet', title: 'Running horses | Beautiful Wild Horses' },
    { id: 'UVGjJSjSrm8', ch: 'parakeet', title: 'BULLS RUNNING AND JUMPING PLAYFULLY 🐮 COW VIDEO 🐮' },
    { id: 'wAheSP524B0', ch: 'parakeet', title: 'Galloway Bulls Video Galloway Cows on Fields Richmond upon Thames England | Cow Video' },
    { id: 'Pk54jsKAquI', ch: 'parakeet', title: 'COW VIDEO FOR RELAXATION RELAXING NATURE | Cow Video' },
    { id: 'QQjTC-LKkFU', ch: 'parakeet', title: '4k cow video with relaxing music' },
    { id: 'PLX9-iQV8BU', ch: 'parakeet', title: 'Relaxing Farm Animals, Realistic Animal Sounds in 4K 🌿' },
    { id: 'FaC1WpYljZ4', ch: 'parakeet', title: 'COW VIDEO, REAL COWS MOOING AND GRAZING 🐄' },
    { id: 'chJkbirzTt0', ch: 'parakeet', title: 'Cow Ranch Grazing Cows in the mountains • Cow Farming • Happy Cows Video' },
    { id: 'Q50hgkEt3po', ch: 'parakeet', title: 'BUSHA CATTLE GRAZING GREEN GRASS AND ENJOYING BEING IN THE NATURE WITH OTHERS 🐄🐮🐄' },
    { id: '-zR1W9-b5Ac', ch: 'parakeet', title: 'Relaxing Farm Animals, 3 Hours of Peaceful Countryside Scenery 🐮🌾✨' },
    { id: 'r4lz72fT3ko', ch: 'parakeet', title: 'Ultra HD 4K Relaxing FARM ANIMALS VIDEO, REAL FARM ANIMAL SOUNDS' },

    // Omar & Hana (BM)
    { id: 'Iy2Lgc93jFY', ch: 'omarhanams', title: 'Lagu Kanak-Kanak Islam | Tolong Mama Papa | Omar & Hana' },
    { id: 'vA-di7cIdy8', ch: 'omarhanams', title: 'Koleksi Lagu Kanak-Kanak Islam | Alhamdulillah & Lain-lain | Omar & Hana' },
    { id: 'PaV97aKalDQ', ch: 'omarhanams', title: 'Kisah Omar & Hana | Alalala Raju' },
    { id: 'UMhHSWPnj3M', ch: 'omarhanams', title: 'Lagu Kanak-Kanak Islam | Alif, Ba, Ta | Omar & Hana' },
    { id: '0X0TAtB_rOs', ch: 'omarhanams', title: 'Koleksi Lagu Kanak-Kanak Islam | Lagu Kegemaran Omar | Omar & Hana | 19 Minit' },
    { id: 'gw80byO7ZG4', ch: 'omarhanams', title: 'Cerita Kanak Kanak Islam | Omar & Hana | Episod Istimewa | Jom Berkelah' },
    { id: 'LtnZgxUu-bQ', ch: 'omarhanams', title: 'Lagu Raya | Siti Nordiana x Omar & Hana | Oh Meriahnya Raya! | Video Rasmi' },
    { id: 'xCrqQyMh_Jo', ch: 'omarhanams', title: 'Lagu Kanak-Kanak Islam | Kami Suka Kucing | Omar & Hana' },
    { id: 'BPhdhVfbL2g', ch: 'omarhanams', title: 'Lagu Kanak-Kanak Islam | Hormati Yang Tua | Omar & Hana' },
    { id: 'iZfHrOoRkr4', ch: 'omarhanams', title: '30 Minit | Alalala Raju & Lain-Lain Kisah | Omar & Hana Lagu Kanak-Kanak Islam' },
    { id: 'DJjkGO3U000', ch: 'omarhanams', title: 'Koleksi Istimewa Lagu Kanak Kanak Islam | Musim 1| Omar & Hana' },
    { id: 'X2EQAFjOC9U', ch: 'omarhanams', title: 'Lagu Kanak-Kanak Islam | Seronoknya Berkunjung | Omar & Hana' },
    { id: 'SAzQy2g11mw', ch: 'omarhanams', title: 'Kisah Omar & Hana | Jom Kita Tolong' },
    { id: '3ebDhXmTup4', ch: 'omarhanams', title: 'Omar & Hana | Saidina Abu Bakar | Lagu Kanak-Kanak Islam' },
    { id: 'G0wX_MM3nMI', ch: 'omarhanams', title: 'Kisah-Kisah Menarik Season 5 | Omar & Hana | Kompilasi 60 Minit' },
    { id: 'qNEpovHi9VQ', ch: 'omarhanams', title: 'Kek Terakhir | Omar & Hana Kisah Kanak-Kanak Islam' },
    { id: 'HIwfzHcEr4Y', ch: 'omarhanams', title: 'Omar & Hana | Raya Gembira | Lagu Raya Omar & Hana 2020' },
    { id: 'rbIT554Hc7w', ch: 'omarhanams', title: 'Omar & Hana | Koleksi Lagu-Lagu Omar & Hana | Tolong Mama Papa & Lain-Lain' },
    { id: 'tAPPKHJI88Q', ch: 'omarhanams', title: 'Ragam Hana | Omar & Hana | Kisah Kanak-Kanak Islam' },
    { id: 'F7jMVVbSLm4', ch: 'omarhanams', title: 'Lagu Kanak-Kanak Islam | Assalamualaikum | Omar & Hana' },
    { id: 'h3ew_enK5qw', ch: 'omarhanams', title: 'Lagu Kanak-Kanak Islam | Sayangi Anak Yatim | Omar & Hana' },
    { id: 'JaTh_BO1l9s', ch: 'omarhanams', title: 'Lagu Kanak-Kanak Islam | Tolong Menolong | Omar & Hana' },
    { id: 'qVh3gsGEtEo', ch: 'omarhanams', title: 'Cerita Kanak-Kanak Islam | Omar & Hana | Episod Istimewa | Kejutan Untuk Papa' },
    { id: 'NgqrnwuGoJs', ch: 'omarhanams', title: 'Sabar Ya Papa | Omar & Hana Kisah Kanak-Kanak Islam' },
    { id: '4xfqKlo_SPk', ch: 'omarhanams', title: 'Omar & Hana | Azan | Istimewa Ramadan' },
    { id: 'e3VIykdnKm0', ch: 'omarhanams', title: 'Kompilasi Lagu & Kisah Omar & Hana | 30 Minit' },
    { id: '9ecvF2lG20c', ch: 'omarhanams', title: 'Wany Hasrita x Omar & Hana | Oh! Rindunya Raya | Diceriakan Oleh SSPN' },
    { id: 'UvuszY48uGY', ch: 'omarhanams', title: 'Omar & Hana | Koleksi Lagu & Kisah Terbaik Omar & Hana | Alhamdulillah & Lain-Lain' },
    { id: 'LtCGUHI1bJs', ch: 'omarhanams', title: 'Lagu Kanak-Kanak Islam | Mari Berusaha | Omar & Hana' },
    { id: '4S6ZtR2fS80', ch: 'omarhanams', title: 'Koleksi Lagu Kanak-Kanak Islam | Sayang Anak Yatim & Lain-lain | Omar & Hana' },

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

    // Power Sphera Universe
    { id: '7i19p8LOBq8', ch: 'powersphera', title: 'Amukan BoBoiBoy Api' },
    { id: 'BPtdmh0lluc', ch: 'powersphera', title: 'Memori Eidulfitri | Iklan Raya Monsta 2021' },
    { id: 'Uk3uCNV-EkU', ch: 'powersphera', title: 'BoBoiBoy Kuasa LIMA Masak Tomyam Sakti' },
    { id: '6vPBhgQX63g', ch: 'powersphera', title: 'Gopal Makan Cicak Angkasa #BoBoiBoyGalaxy | Part 19' },
    { id: '6Wenp-ZQkt0', ch: 'powersphera', title: 'BoBoiBoy Galaxy COMPLETE SEASON 1' },
    { id: 'W3VEWAHQDqU', ch: 'powersphera', title: 'Ayah akan balik nanti BoBoiBoy!' },
    { id: 'cRJryYFT1f8', ch: 'powersphera', title: 'Nanti kita sama-sama pergi melawat I BoBoiBoy Aidilfitri' },
    { id: 'QYhJxODb5RE', ch: 'powersphera', title: 'BoBoiBoy Raya 2022 #KembaliAidilfitri' },
    { id: 'JoUfKgN97_s', ch: 'powersphera', title: 'Fang muntah Petai Angkasa #BoBoiBoyGalaxy | Part 20' },
    { id: 'pYSdz2BF_gA', ch: 'powersphera', title: 'Station Tapops diserang Toyol? #BoBoiBoyGalaxy | Part 12' },
    { id: '6ZE78KEGjP8', ch: 'powersphera', title: 'BoBoiBoy Musim Pertama' },
    { id: '9WNEGcPMg10', ch: 'powersphera', title: 'Sup Lobak Merah Tok Aba' },
    { id: '02uncFuhGLo', ch: 'powersphera', title: 'Biskut Asam Pedas #BoBoiBoyGalaxy | Part 16' },
    { id: 'x7Io55JBncg', ch: 'powersphera', title: 'Pencuci Kapal Lanun Angkasa #BoBoiBoyGalaxy | Part 22' },
    { id: 'hkOLuH1x7XA', ch: 'powersphera', title: 'Robot Antik ke ni? #BoBoiBoyGalaxy | Part 21' },
    { id: '-E_Vh7xFPyg', ch: 'powersphera', title: 'BoBoiBoy Api MENGAMUK!' },
    { id: 'eNcw2Z1Wqm0', ch: 'powersphera', title: 'MechaBot pengemar Karipap' },
    { id: 'gemc44TU57g', ch: 'powersphera', title: 'Mechamato vs Robot pesalah dari Penjara Angkasa' },
    { id: 'LB56dJ5asDw', ch: 'powersphera', title: 'BoBoiBoy VS Retak\'ka FIRST BATTLE' },
    { id: 'bA1wIUeLjVk', ch: 'powersphera', title: 'MARATHON | BoBoiBoy Galaxy Baraju' },
    { id: 'bt212IhV56c', ch: 'powersphera', title: 'MECHAMATO - New Robot Animation Series | Chinese & English Subtitle' },
    { id: 'RT5a6RldKqk', ch: 'powersphera', title: 'Pertempuran Sun Nova Station' },
    { id: '8Bt75RhW0Cg', ch: 'powersphera', title: 'BoBoiBoy pun nak Power Sphera sendiri!' },
    { id: 'FO6IcxQRnd0', ch: 'powersphera', title: 'Raya feat BoBoiBoy & Yaya' },
    { id: 'IluyDX0snPQ', ch: 'powersphera', title: 'TEASER TRAILER | BoBoiBoy Galaxy Musim Ke-2 - DISEMBER 2023' },
    { id: 'ZOojAOSoO7A', ch: 'powersphera', title: 'Perlawanan Epik Elemental Api 🔥 dan Air ❄️ | 30 Minit' },
    { id: '_wZ7fXG8WRY', ch: 'powersphera', title: 'Buku bertemu Ruas #BoBoiBoyGalaxy | Part 13' },
    { id: 'fs9YQ_kdSi8', ch: 'powersphera', title: 'Ejojo tewas dengan mudah' },
    { id: 'L_m5jswTFro', ch: 'powersphera', title: 'Pencarian ApiBot bermula! #BoBoiBoyGalaxy | Part 11' },
    { id: '6s38XrGLXlU', ch: 'powersphera', title: 'Cahaya datang! #BoBoiBoyGalaxy | Part 23' },

    // AnimaSEA
    { id: '5JNVAjEda34', ch: 'animasea', title: 'UJIAN KENTAL TAPOPS FULL' },
    { id: 'T7O4FsenyGY', ch: 'animasea', title: 'BoBoiBoy Daun appearance' },
    { id: 'hQWyfwJwcbU', ch: 'animasea', title: 'BoBoiBoy Galaxy Season 1 COMPLETE' },
    { id: '6qDjhoqIqG4', ch: 'animasea', title: 'Gopal VS ABAM' },
    { id: '0fC5HmGbSXc', ch: 'animasea', title: 'BoBoiBoy VS Borara' },
    { id: 'lsDnXDCOYf4', ch: 'animasea', title: 'SUN NOVA STATION BATTLE FULL' },
    { id: '3eO6Y-joilo', ch: 'animasea', title: 'Cahaya and Solar Appearance' },
    { id: 'a6sgL0Qt-C8', ch: 'animasea', title: 'BoBoiBoy Season 1 - Episode 5' },
    { id: 'rDoVdM0TIRI', ch: 'animasea', title: 'KAIZO BATTLE FULL' },
    { id: 'MB3KC_uQs-M', ch: 'animasea', title: 'BoBoiBot Appearance FULL' },
    { id: 'xGsnLMUB5fQ', ch: 'animasea', title: 'BoBoiBoy Cetak Rompak' },
    { id: '1QnBu0avFSg', ch: 'animasea', title: 'BoBoiBoy Season 1 - Episode 1' },
    { id: 'VgaO7FtZM_g', ch: 'animasea', title: 'BoBoiBoy Fusion VS Retak\'ka' },
    { id: 'tE2auWDDLgo', ch: 'animasea', title: 'Kapten Kaizo appearance (FULL)' },
    { id: 'brIAtSP5G8Y', ch: 'animasea', title: 'Ejojo FULL Fight Scene' },
    { id: 'Rkir3IlYO_Q', ch: 'animasea', title: 'BoBoiBoy Season 1 - Episode 2' },
    { id: 'v44rt3fWU9Q', ch: 'animasea', title: 'Sahur bersama Kebenaran' },
    { id: '8w8b5UGMe4Q', ch: 'animasea', title: 'Itu kucing atau Cattus?' },
    { id: 'FwFBrh_0qCE', ch: 'animasea', title: '5 Panglima Scammer' },
    { id: 'GjxEmM1Zw2E', ch: 'animasea', title: 'BoBoiBoy Kuasa TAHAP KEDUA' },
    { id: 'isHk3tux9rs', ch: 'animasea', title: 'Karnival Hari Bumi BoBoiBoy' },
    { id: 'Ac9aoHrwXMQ', ch: 'animasea', title: 'BoBoiBoy Air Appearance' },
    { id: 'e7EWk_C6OPc', ch: 'animasea', title: 'Gopal VS Panto' },
    { id: 'dUh7muG5t7Y', ch: 'animasea', title: 'Nova Prix Space Race' },
    { id: 'Zm17qS5DC28', ch: 'animasea', title: 'BoBoiBoy Galaxy Lanun Angkasa Arc (COMPLETE)' },
    { id: 'rYqLV_9LimY', ch: 'animasea', title: 'EP06 - BoBoiBoy Galaxy Baraju (NO ADS)' },
    { id: 'qmQDI67DwU8', ch: 'animasea', title: 'LAKSMANA TARUNG STORY' },
    { id: 'E2B4nUsu7jY', ch: 'animasea', title: 'Raksasa CATTUS' },
    { id: 'a-LGQgrulYE', ch: 'animasea', title: 'PAPA ZOLA 5 KEBENARAN DI LORONG KEGELAPAN' },
    { id: 'itF-7ue-dyM', ch: 'animasea', title: 'Jugglenaut VS Halilintar FULL FIGHT' },

    // Les' Copaque
    { id: 'bqPqp_XLLTU', ch: 'lescopaque', title: 'Upin & Ipin - Goyang Upin & Ipin [Music Video]' },
    { id: 'PiWDylHIoRk', ch: 'lescopaque', title: 'Upin & Ipin - New Toys [English Version][HD]' },
    { id: 'uv8Y3sNCXK8', ch: 'lescopaque', title: 'Upin & Ipin - Gong Xi Fa Cai [FULL] [HD]' },
    { id: '_MqrP0FQpeY', ch: 'lescopaque', title: 'Upin & Ipin Mengaji - Alif Ba Ta' },
    { id: 'NSOko9Zv4BA', ch: 'lescopaque', title: 'Promo LINE Malaysia - Upin & Ipin Official Account with Free Stickers' },
    { id: '7Sb3j-xlAUY', ch: 'lescopaque', title: 'Upin & Ipin - Luar Biasa (Official Music Video)' },
    { id: 'E4R_e9bkLgg', ch: 'lescopaque', title: 'Upin & Ipin Musim 12 - Untuk Prestasi (Full Episode)' },
    { id: 'JTagRU66Kg4', ch: 'lescopaque', title: 'Cara Mengambil Wudhu & Azan Maghrib - Upin & Ipin Musim 11' },
    { id: 'Yqrt6HPoRQY', ch: 'lescopaque', title: 'Upin & Ipin Musim 10 - Aku Sebuah Jam HD (Full Episode)' },
    { id: 'qFX65RVb5X8', ch: 'lescopaque', title: 'Upin & Ipin- Bahaya Jerebu [Full Episod]' },
    { id: 'mOnFHqfDD1E', ch: 'lescopaque', title: 'Upin & Ipin - Pengembala dan Biri-Biri [Music Video]' },
    { id: 'r2lij3HObuM', ch: 'lescopaque', title: 'Upin & Ipin - Ultraman Ribut [Eng/Jap Sub]' },
    { id: '-ubMdTHfxko', ch: 'lescopaque', title: 'Upin & Ipin - Ibu Ayam Dikejar Musang [Sing-Along][HD]' },
    { id: 'h2D0zpcwuhg', ch: 'lescopaque', title: 'Upin Ipin - Chinese New Year Promo' },
    { id: 'UJX3PRaG3Yo', ch: 'lescopaque', title: 'Upin & Ipin Musim 15 - Angin (Full Episode)' },
    { id: 'ZYMI8adms7c', ch: 'lescopaque', title: 'Upin & Ipin Musim 18 - Minyak Sawit (Full Episode)' },
    { id: 'KMeWW4QBfdA', ch: 'lescopaque', title: 'Menari & Menyanyi Bersama Upin & Ipin' },
    { id: 'Oq-XABOTF4E', ch: 'lescopaque', title: 'Upin & Ipin - Boria Suka-Suka [Sing-Along]' },
    { id: 'vJrkwEv2dys', ch: 'lescopaque', title: 'Upin & Ipin - Amal Jariah (Full Episode)' },
    { id: '2Pd6zdl-il4', ch: 'lescopaque', title: 'Upin & Ipin Musim 17 - Irama Raya (Full Song Episode)' },
    { id: 'iDhlqk0cx9s', ch: 'lescopaque', title: 'Upin & Ipin - Beli, Pakai, Suka (Full Episode)' },
    { id: 'Y4kSNuCDQxU', ch: 'lescopaque', title: 'Upin & Ipin Musim 11 - Hapuskan Virus! (Full Episode)' },
    { id: 'I1v-J32r9y8', ch: 'lescopaque', title: 'Upin & Ipin - Kompang Dipalu (Sing -Along)' },
    { id: 'ST0b5RDuETQ', ch: 'lescopaque', title: 'Upin & Ipin Musim 15 - Rajin Menyimpan Bijak Belanja [Episod Penuh]' },
    { id: '9Ur_XXG9iDw', ch: 'lescopaque', title: 'Kompilasi Upin & Ipin Musim 17' },
    { id: 'pdNWPtBzNXk', ch: 'lescopaque', title: 'Upin & Ipin Musim 10 - Pesta Cahaya (Full Episode)' },
    { id: 'zM78QaUshxE', ch: 'lescopaque', title: 'Upin & Ipin Ramadan Raya - Full Episode' },
    { id: 'ZuXZRehfuNE', ch: 'lescopaque', title: 'Lagu 12 Bulan Islam - Upin & Ipin Sinar Syawal' },
    { id: '5LtleKBSwR8', ch: 'lescopaque', title: 'Upin & Ipin Musim 16 - Lindung Diri Dan Keluarga (Episod Penuh)' },
    { id: 'G3jDdVuL890', ch: 'lescopaque', title: 'Upin & Ipin Musim 14 : Ragam Ramadan (Episod Penuh)' },

    // lalala Kids Songs
    { id: 'snZjjG5h-hE', ch: 'lalala', title: 'Shoo Fly Don\'t Bother Me Song | Lalafun Nursery Rhymes & Kids Songs' },
    { id: 'j6QPGZMTv2k', ch: 'lalala', title: 'Quack, Quack, Colors! 5 Little Ducks Song | Lalafun Nursery Rhymes & Kids Songs' },
    { id: 'nlK0aw2afpY', ch: 'lalala', title: '5 Little Ducks(Learn Colors Song) | Lalafun Nursery Rhymes & Kids Songs' },
    { id: '6VICYPlehAc', ch: 'lalala', title: 'A Ram Sam Sam Song for Kids! 🎶✨ | Lalafun Nursery Rhymes & Kids Songs' },
    { id: 'bhts-ZSRPn4', ch: 'lalala', title: '5 Little Ducks | Learn Colors Song | Lalafun Nursery Rhymes & Kids Songs' },
    { id: 'sV00tdkUGYg', ch: 'lalala', title: 'Five Little Ducklings Song | Lalafun Nursery Rhymes & Kids Songs' },
    { id: 'C5N99sBws3I', ch: 'lalala', title: 'Baa Baa Black Sheep Song | Lalafun Nursery Rhymes & Kids Songs' },
    { id: 'EPQQMlYD4S4', ch: 'lalala', title: '5 Little Ducks | Learn Colors Song | Lalafun Nursery Rhymes & Kids Songs' },
    { id: '66KB9V8JIcw', ch: 'lalala', title: 'Baa Baa Black Sheep at Farm +More Lalafun Nursery Rhymes & Kids Songs' },
    { id: 's8Fj3fTEANY', ch: 'lalala', title: 'Five Little Ducks 🦆🦆🦆🦆🦆 - Colorful Learning Edition | Lalafun Nursery Rhymes & Kids Songs' },
    { id: 'mkW8s2CwHkg', ch: 'lalala', title: '5 Little Ducks - Learn Colors + Skip to My Lou | Lalafun Nursery Rhymes & Kids Songs' },
    { id: 'fLOdPvng3hU', ch: 'lalala', title: 'Wheels on the Bus Go Round and Round ( Animal Version ) | Lalafun Nursery Rhymes & Kids Songs' },
    { id: 'uygHQt0hefI', ch: 'lalala', title: 'Five Little Ducklings | Lalafun Nursery Rhymes & Kids Songs' },
    { id: 'IntjE5_ib3k', ch: 'lalala', title: 'Learn Colors with 5 Little Ducks! 🦆✨ | Lalafun Nursery Rhymes & Kids Songs' },
    { id: 'qNif8cDulyY', ch: 'lalala', title: 'Skidamarink Song (Farm Version) | Lalafun Nursery Rhymes & Kids Songs' },
    { id: 'l2EOi1R6oC0', ch: 'lalala', title: 'Baa Baa Black Sheep Song | Lalafun Nursery Rhymes & Kids Songs' },
    { id: '64_GRsUME-Y', ch: 'lalala', title: 'Baa Baa Black Sheep Song | Lalafun Nursery Rhymes & Kids Songs' },
    { id: '09fc-z23iok', ch: 'lalala', title: '5 Little Ducks (Learn Colors Song) 🦆🌲🌈 + MORE Lalafun Nursery Rhymes & Kids Songs' },
    { id: 'wQPk0weBqXQ', ch: 'lalala', title: 'Baa Baa Black Sheep. Where Are You? | Lalafun Nursery Rhymes & Kids Songs' },
    { id: 'OvmUVnSfAw8', ch: 'lalala', title: 'Five Little Ducks +More Lalafun Nursery Rhymes & Kids Songs' },
    { id: '3Rc1rI0rofk', ch: 'lalala', title: 'A Ram Sam Sam Move & Dance Together + MORE Lalafun Nursery Rhymes & Kids Songs' },
    { id: 'qfbpwuDfP2E', ch: 'lalala', title: 'Baa Baa Black Sheep, Don\'t Run! | Lalafun Nursery Rhymes & Kids Songs' },
    { id: 'btfi8_xZ1Cc', ch: 'lalala', title: 'Quack, Quack, Colors! 5 Little Ducks Song | Lalafun Nursery Rhymes & Kids Songs' },
    { id: 'zQO-tQpgfbw', ch: 'lalala', title: '5 Little Ducks (Learn Colors Song) | Lalafun Nursery Rhymes & Kids Songs' },
    { id: 'uHqfB6blOQA', ch: 'lalala', title: 'Baa Baa Black Sheep Song | Farm Version | Lalafun Nursery Rhymes & Kids Songs' },
    { id: '8cjv2slI5OU', ch: 'lalala', title: 'The Wheels on The Bus Song +More Lalafun Nursery Rhymes & Kids Songs' },
    { id: 'E8mq5KWGDWo', ch: 'lalala', title: 'Baa Baa Black Sheep, Don\'t Run! | Lalafun Nursery Rhymes & Kids Songs' },
    { id: 'mA1WnFkOsrA', ch: 'lalala', title: 'A Ram Sam Sam +More Lalafun Nursery Rhymes & Kids Songs' },
    { id: '1prOBlVJlm4', ch: 'lalala', title: '5 Little Ducks (Learn Colors Song) | Lalafun Nursery Rhymes & Kids Songs' },
    { id: 'xaXfuGsMXMk', ch: 'lalala', title: 'Old MacDonald’s Happy Animal Farm | Lalafun Nursery Rhymes & Kids Songs' },

    // Dawood Kids TV
    { id: 'Uufkkk6D2lk', ch: 'dawood', title: 'سورة الفاتحة ٣٠ دقيقة تكرار-أحلى طريقة لحفظ القرآن للأطفال Quran for Kids-Al Fatihah 30\' Repetition' },
    { id: '7CLccP_tElk', ch: 'dawood', title: '١٠ من قصار السور (١)-أحلى طريقة لتعليم القرآن للأطفال Quran for Kids- 10 of Short Surahs (1)' },
    { id: 'OquUdWeXbVc', ch: 'dawood', title: 'سورة الإخلاص ٣٠ دقيقة تكرار-أحلى طريقة لحفظ القرآن للأطفال Quran for Kids-Al Ikhlas 30\' Repetition' },
    { id: 'kVoDlXwPMqc', ch: 'dawood', title: 'سورة الفلق ٣٠ دقيقة تكرار-أحلى طريقة لحفظ القرآن للأطفال Quran for Kids-Al Falaq 30\' Repetition' },
    { id: 'VVIXAIbI3-Y', ch: 'dawood', title: 'سورة الماعون ٣٠ دقيقة تكرار-أحلى طريقة لحفظ القرآن للأطفال Quran for Kids-Al Maun 30\' Repetition' },
    { id: 'jggjZMf3PNc', ch: 'dawood', title: 'سورة الناس ٣٠ دقيقة تكرار-أحلى طريقة لحفظ القرآن للأطفال Quran for Kids-Al Nas 30\' Repetition' },
    { id: 'y1TUN9ivr-Q', ch: 'dawood', title: 'جزء عم كامل -أحلى طريقة لتعليم القرآن للأطفال Quran for Kids- Juz 30 All' },
    { id: 'qjXjNwgFohA', ch: 'dawood', title: 'سورة الفيل ٣٠ دقيقة تكرار-أحلى طريقة لحفظ القرآن للأطفال Quran for Kids-Al Fil 30\' Repetition' },
    { id: 'irKQUU16DOM', ch: 'dawood', title: 'سورة العاديات ٣٠ دقيقة تكرار-أحلى طريقة لحفظ القرآن للأطفال Quran for Kids-Al Adiyat 30\' Repetition' },
    { id: '3q9yntp_dhY', ch: 'dawood', title: 'سورة الكافرون ٣٠ دقيقة تكرار- أحلى طريقة لحفظ القرآن للأطفال Quran for Kids- Kafiroun 30\' Repetition' },
    { id: 'Uf0S7FcfXOI', ch: 'dawood', title: 'سورة النبإ - تعليم القرآن للأطفال- أحلى قرائة لسورة النبإ - قناة داوود Quran for Kids Al Naba' },
    { id: 'jYPxNl_WJg4', ch: 'dawood', title: 'سورة الفجر ٣٠ دقيقة تكرار-أحلى طريقة لحفظ القرآن للأطفال Quran for Kids-Al Fajr 30\' Repetition' },
    { id: '95U9Z6rFwDU', ch: 'dawood', title: 'سورة القدر ٣٠ دقيقة تكرار-أحلى طريقة لحفظ القرآن للأطفال Quran for Kids-Al Qadr 30\' Repetition' },
    { id: 'oPwIRS_d8yk', ch: 'dawood', title: 'سورة البيّنة -تعليم القرآن للأطفال -أحلى قرائة لسورة البيّنة - قناة داوود Quran for Kids Al Bayyinah' },
    { id: 'rJIsyMuk5rU', ch: 'dawood', title: 'سورة الفاتحة -تعليم القرآن للأطفال -أحلى قرائة لسورة الفاتحة - قناة داوود Quran for Kids Al Fatihah' },
    { id: 'phRvrtVysn4', ch: 'dawood', title: 'سورة الليل ٣٠ دقيقة تكرار- أحلى طريقة لحفظ القرآن للأطفال Quran for Kids- Al- Lail 30\' Repetition' },
    { id: 'waWgIDQoOMY', ch: 'dawood', title: 'سورة الهمزة - تعليم القرآن للأطفال - أحلى قرائة لسورة الهمزة -قناة داوودQuran for Kids - Al Humazah' },
    { id: 'eQIMYK1qp_w', ch: 'dawood', title: 'سورة العلق ٣٠ دقيقة تكرار-أحلى طريقة لحفظ القرآن للأطفال - Quran for Kids-Al Alaq 30\'Repetition' },
    { id: 'jkNuEE1hrNE', ch: 'dawood', title: 'سورة قريش ٣٠ دقيقة تكرار-أحلى طريقة لحفظ القرآن للأطفال Quran for Kids- Quraysh 30\' Repetition' },
    { id: 'Sd2iZZn9pBA', ch: 'dawood', title: 'سورة القارعة ٣٠ دقيقة تكرار- أحلى طريقة لحفظ القرآن للأطفال Quran for Kids- Al Qariah 30\' Repetition' },
    { id: '0S0WEBUbr00', ch: 'dawood', title: 'سورة المسد -تعليم القرآن للأطفال -أحلى قرائة لسورة المسد - قناة داوود Quran for Kids - Al-Masad' },
    { id: 'tIzXZcfZ2x8', ch: 'dawood', title: 'سورة الهمزة ٣٠ دقيقة تكرار-أحلى طريقة لحفظ القرآن للأطفال Quran for Kids-Al Humazah 30\' Repetition' },
    { id: 'nknuYqQ_FbY', ch: 'dawood', title: 'سورة الشمس ٣٠ دقيقة تكرار-أحلى طريقة لحفظ القرآن للأطفال Quran for Kids- Al-shams 30\' Repetition' },
    { id: 'rpCLNznceHQ', ch: 'dawood', title: 'سورة العصر ٣٠ دقيقة تكرار-أحلى طريقة لحفظ القرآن للأطفال Quran for Kids-Al Asr 30\' Repetition' },
    { id: 'MeCLL-biXks', ch: 'dawood', title: 'سورة التكاثر ٣٠ دقيقة تكرار-أحلى طريقة لحفظ القرآن للأطفال Quran for Kids-Al Takathor 30\'Repetition' },
    { id: 'gnuayjy28UI', ch: 'dawood', title: 'آية الكرسي -تعليم القرآن للأطفال -أحلى قرائة لآية الكرسي - قناة داوود Quran for Kids Ayat Al-Kursi' },
    { id: 'cqRbqjgOX2Y', ch: 'dawood', title: 'سورة التكاثر - تعليم القرآن للأطفال - أحلى قرائة - قناة داوود Quran for Kids -Surah Al Takathor' },
    { id: 'M7dCUgrZRL4', ch: 'dawood', title: 'سورة التين ٣٠ دقيقة تكرار-أحلى طريقة لحفظ القرآن للأطفال Quran for Kids-Al Tin 30\' Repetition' },
    { id: '51gBBer2qoI', ch: 'dawood', title: 'سورة الأعلى ٣٠ دقيقة تكرار-أحلى طريقة لحفظ القرآن للأطفال Quran for Kids-Al Aala 30\'Repetition' },
    { id: 'OuKN1VbuZxg', ch: 'dawood', title: 'سورة المطففين -تعليم القرآن للأطفال-أحلى قرائة لسورة المطففين-قناة داوود Quran for Kids Al Mutafifin' },

    // Baby Shark Indonesia

    // Omar & Hana Urdu

    // Emmie's Wonder Wardrobe
    { id: 'G9H2aliqkq8', ch: 'emmie', title: 'Ten in the Bed (Family Edition) | Little Angel Kids Songs & Nursery Rhymes' },
    { id: 'iz_04QWlSvY', ch: 'emmie', title: 'No No Healthy Habits with Baby Monkey | Kids Songs and Nursery Rhymes by Little Angel' },
    { id: '3VCyQqbH11s', ch: 'emmie', title: 'No More Snacks Baby John! | Yummy Vegetables & Healthy Habits Song | Little Angel Kids Songs' },
    { id: 'iAA7JsaGiPQ', ch: 'emmie', title: 'Baby John Learns Trick or Treat | Little Angel Halloween Song | Nursery Rhymes & Kids Songs' },
    { id: 'KplFR6Cowbc', ch: 'emmie', title: 'Baa Baa Black Sheep | Nursery Rhymes by Little Angel' },
    { id: 'fJTBmCVaaTc', ch: 'emmie', title: 'Baby John To The Rescue | Wheels On The Ambulance & More Little Angel Kids Songs' },
    { id: '8y_RkwAjRFU', ch: 'emmie', title: 'Beach Day, Hot And Cold Song | Opposites | Little Angel Kids Songs' },
    { id: 'UlhEXd-A_1U', ch: 'emmie', title: 'No No Swimming Song | +More Kids Songs & Nursery Rhymes Little Angel' },
    { id: 'FmeRLKjidbY', ch: 'emmie', title: 'Meet Our Baby Brother! New Baby Song | Nursery Rhymes by Little Angel' },
    { id: 'ueld0dt7CO0', ch: 'emmie', title: '10 Little Fishies Song | Little Angel Nursery Rhymes & Kids Songs' },
    { id: 'e4YQbZnswWU', ch: 'emmie', title: 'Don\'t Be Afraid Of Monsters! | Halloween Song | Little Angel Kids Songs & Nursery Rhymes' },
    { id: 'amvd3S0dWqg', ch: 'emmie', title: 'Bath Song | Baby John\'s Bath Time | Little Angel Nursery Rhymes & Kids Songs' },
    { id: '19zaRDWDijo', ch: 'emmie', title: 'Play Nice At The Playground | Good Manners Song | Little Angel Kids Songs' },
    { id: 'oWaKITo-wAA', ch: 'emmie', title: 'Camping Song | Little Angel Kids Songs & Nursery Rhymes' },
    { id: 'yYeLLfi4BDs', ch: 'emmie', title: 'I’m So Itchy | Baby John Songs | Little Angel Nursery Rhymes and Kids Songs' },
    { id: 'GCVm0oaTjL8', ch: 'emmie', title: 'Monsters In The Dark | Little Angel Kids Songs & Nursery Rhymes' },
    { id: 'UNJyKp1yIx4', ch: 'emmie', title: 'Ice Cream And Candy At The Mall | Little Angel Nursery Rhymes & Kids Songs' },
    { id: 'N4cbNq57wMg', ch: 'emmie', title: 'Baa Baa Black Sheep, Have You Any Wool? | Nursery Rhymes by Little Angel' },
    { id: 'D6jOaUNrsxc', ch: 'emmie', title: 'Playtime at the Playground | Playground Song +More Nursery Rhymes by Little Angel' },
    { id: 'Qw7zsaSnfmM', ch: 'emmie', title: 'Lollipop Song | Little Angel Kids Songs & Nursery Rhymes' },
    { id: 'HO2aWoiwOc4', ch: 'emmie', title: 'Monsters In The Dark | Little Angel Kids Songs & Nursery Rhymes' },
    { id: '5hKdF5cHniY', ch: 'emmie', title: 'Ten in the Bed (Camping Edition) | Little Angel Kids Songs & Nursery Rhymes' },
    { id: 'o-xbGlw-crI', ch: 'emmie', title: 'Where is My Nose? No No Safety Tips & More Nursery Rhymes Songs by Little Angel' },
    { id: 'z0bf51btzzo', ch: 'emmie', title: 'No More Snacks | Healthy Habits | Little Angel Kids Songs & Nursery Rhymes' },
    { id: 'XtUYYcCZpt0', ch: 'emmie', title: 'Who\'s At the Door? | Don\'t Open The Door To Strangers | Kids Songs & Nursery Rhymes by Little Angel' },
    { id: 'Rxpyuc6F_94', ch: 'emmie', title: 'Hot and Cold On The Beach | Opposites Song | Little Angel Kids Songs' },
    { id: '-dg1dgao3GU', ch: 'emmie', title: 'Ambulance Rescue Team | Little Angel Nursery Rhymes and Kids Songs' },
    { id: 'KFaZOTilKPI', ch: 'emmie', title: 'I Wanna Be Like Daddy | Little Angel Nursery Rhymes & Kids Songs' },
    { id: 'RUd7-264LUg', ch: 'emmie', title: 'Wheels on the Ambulance | Be Safe on the Road Song | Little Angel Kids Songs & Nursery Rhymes' },
    { id: 'bNVQkoCfr6g', ch: 'emmie', title: 'Learning At School & Playground | Little Teapot Song | Kids Songs and Nursery Rhymes Little Angel' },

    // Neurotic Studio
    { id: 'ej0kAOsqD68', ch: 'neurotic', title: 'DOA SUJUD AKHIR TAHAJJUD (VOCALS ONLY)' },
    { id: 'YQIQP5nA3uM', ch: 'neurotic', title: 'DOA BERLINDUNG DARIPADA KEBURUKAN AMAL' },
    { id: 'X5dOu3Zud-E', ch: 'neurotic', title: 'DOA TERBANGUN TENGAH MALAM' },
    { id: 'xirzyPtxdWY', ch: 'neurotic', title: 'HALIM AHMAD • Jangan Jangan (Official Music Video)' },
    { id: 'p_6bG6vG_h8', ch: 'neurotic', title: 'BACAAN DI ANTARA DUA SUJUD (Mudah Hafal)' },
    { id: 'E149RbQIWi4', ch: 'neurotic', title: 'DOA MEMOHON KEAMPUNAN KETIKA SUJUD (VOCALS ONLY)' },
    { id: 'pApLyt91AUY', ch: 'neurotic', title: 'DOA AGAR SETIAP URUSAN BERAKHIR DENGAN BAIK (VOCAL ONLY)' },
    { id: 'oNK9H3ei3X8', ch: 'neurotic', title: 'ZIKIR RADHITU BILLAHI RABBA' },
    { id: 'BlAOb5ujeMw', ch: 'neurotic', title: '[LIVE] Zikir & Doa Hari Selasa' },
    { id: 'DcXdjK-TAbI', ch: 'neurotic', title: 'DOA DI HUJUNG SOLAT - SELEPAS TAHIYAT' },
    { id: 'wbo7SDdPTMU', ch: 'neurotic', title: 'DOA DITETAPKAN HATI (VOCALS ONLY)' },
    { id: '27xNofvDX8Y', ch: 'neurotic', title: '[LIVE] Takbir Raya Aidilfitri 2026' },
    { id: 'vvE5fhfSadE', ch: 'neurotic', title: 'ZIKIR RAMADAN 2026 (Part 4)' },
    { id: 'VJkEkleiAlk', ch: 'neurotic', title: 'HALIM AHMAD × INTEAM • Meriah Raya (Official Music Video)' },
    { id: 'sGR7UGwMNZ0', ch: 'neurotic', title: 'ZIKIR RAMADAN 2026 (Part 3)' },

];

/* ────────────────────────────────────────
   CHANNELS & VIDEOS (built-in, from subscriptions)
──────────────────────────────────────── */
function allChannels() {
    return CHANNELS;
}

function allVideos() {
    const vids = VIDEOS.slice();
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
    VIDEOS.forEach((v) => {
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
        oauthTitle: 'Sambung YouTube',
        oauthClientIdPh: 'Paste OAuth Client ID di sini...',
        oauthSecretPh: 'Client Secret (pilihan)',
        oauthHint: 'Tarik saluran langganan anda secara automatik. Buat "OAuth Client ID" (jenis Web/SPA) di Google Cloud Console dan daftar redirect URI di bawah.',
        oauthConnect: 'Sambung',
        oauthSync: 'Segerak',
        oauthDisconnect: 'Putuskan',
        oauthStatusConnected: 'Disambungkan (%s saluran)',
        oauthStatusDisconnected: 'Belum disambungkan',
        oauthBadge: 'YouTube',
        oauthSyncing: 'Menyegerakkan saluran langganan...',
        oauthSynced: 'Disegerakkan: %s saluran',
        oauthSyncFailed: 'Segerakan gagal. Cuba lagi.',
        oauthNoClientId: 'Sila masukkan OAuth Client ID dahulu.',
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
        oauthTitle: 'Connect YouTube',
        oauthClientIdPh: 'Paste your OAuth Client ID here...',
        oauthSecretPh: 'Client Secret (optional)',
        oauthHint: 'Automatically pull your subscribed channels. Create an "OAuth Client ID" (type Web/SPA) in Google Cloud Console and register the redirect URI below.',
        oauthConnect: 'Connect',
        oauthSync: 'Sync',
        oauthDisconnect: 'Disconnect',
        oauthStatusConnected: 'Connected (%s channels)',
        oauthStatusDisconnected: 'Not connected',
        oauthBadge: 'YouTube',
        oauthSyncing: 'Syncing subscribed channels...',
        oauthSynced: 'Synced: %s channels',
        oauthSyncFailed: 'Sync failed. Try again.',
        oauthNoClientId: 'Please enter your OAuth Client ID first.',
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
        oauthTitle: '连接 YouTube',
        oauthClientIdPh: '在此粘贴 OAuth Client ID...',
        oauthSecretPh: 'Client Secret（可选）',
        oauthHint: '自动拉取您订阅的频道。在 Google Cloud Console 创建"OAuth Client ID"（类型：Web/SPA），并注册下面的重定向 URI。',
        oauthConnect: '连接',
        oauthSync: '同步',
        oauthDisconnect: '断开',
        oauthStatusConnected: '已连接（%s 个频道）',
        oauthStatusDisconnected: '未连接',
        oauthBadge: 'YouTube',
        oauthSyncing: '正在同步订阅频道...',
        oauthSynced: '已同步：%s 个频道',
        oauthSyncFailed: '同步失败，请重试。',
        oauthNoClientId: '请先输入 OAuth Client ID。',
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
        oauthTitle: 'YouTube இணைக்க',
        oauthClientIdPh: 'OAuth Client ID ஐ இங்கே ஒட்டவும்...',
        oauthSecretPh: 'Client Secret (விருப்பம்)',
        oauthHint: 'நீங்கள் சந்தா செய்த சேனல்களை தானாக இழுக்கவும். Google Cloud Console இல் "OAuth Client ID" (Web/SPA) உருவாக்கி, கீழே உள்ள திருப்பி வழி URI ஐ பதிவு செய்யவும்.',
        oauthConnect: 'இணைக்க',
        oauthSync: 'ஒத்திசை',
        oauthDisconnect: 'துண்டி',
        oauthStatusConnected: 'இணைக்கப்பட்டது (%s சேனல்கள்)',
        oauthStatusDisconnected: 'இணைக்கப்படவில்லை',
        oauthBadge: 'YouTube',
        oauthSyncing: 'சந்தா சேனல்களை ஒத்திசைக்கிறது...',
        oauthSynced: 'ஒத்திசைக்கப்பட்டது: %s சேனல்கள்',
        oauthSyncFailed: 'ஒத்திசைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.',
        oauthNoClientId: 'முதலில் OAuth Client ID ஐ உள்ளிடவும்.',
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
    // mute=1: iOS/Safari hanya benarkan autoplay jika video senyap (bunyi boleh dibuka semula).
    // enablejsapi: benarkan postMessage playVideo (fallback autoplay iOS Safari).
    const ap = autoplay ? '&autoplay=1&mute=1' : '';
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
}

function initSettings() {
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
