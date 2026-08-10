/* ═══════════════════════════════════════════
   SAFARI RADIO — app.js
   Wildlife FM Radio Web Application
═══════════════════════════════════════════ */

/* ────────────────────────────────────────
   RADIO STATION DATABASE
   Every stream below was verified playing in
   a real browser (readyState >= 3, no error).
   Avoid HLS (.m3u8) URLs — not supported by
   Chrome/Edge <audio> without an HLS shim.
──────────────────────────────────────── */
const RADIO_DB = [
    // 🇲🇾 Malaysia — verified live (Streamtheworld / RCS)
    { name: "Suria FM",      url: "https://playerservices.streamtheworld.com/api/livestream-redirect/SURIA_FMAAC.aac",   cat: "malaysia", flag: "🇲🇾" },
    { name: "988 FM",        url: "https://playerservices.streamtheworld.com/api/livestream-redirect/988_FMAAC.aac",     cat: "malaysia", flag: "🇲🇾" },
    { name: "Sabah FM",      url: "https://playerservices.streamtheworld.com/api/livestream-redirect/SABAH_FMAAC.aac",   cat: "malaysia", flag: "🇲🇾" },
    { name: "Kelantan FM",   url: "https://playerservices.streamtheworld.com/api/livestream-redirect/KELANTAN_FMAAC.aac",cat: "malaysia", flag: "🇲🇾" },
    { name: "Klasik FM",     url: "https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_KLASIK.mp3",  cat: "malaysia", flag: "🇲🇾" },
    { name: "Nasional FM",   url: "https://playerservices.streamtheworld.com/api/livestream-redirect/NASIONAL_FM.mp3",   cat: "malaysia", flag: "🇲🇾" },
    { name: "Terengganu FM", url: "https://22243.live.streamtheworld.com/TERENGGANU_FMAAC_SC",                          cat: "malaysia", flag: "🇲🇾" },
    { name: "HITZ",          url: "https://stream.rcs.revma.com/488kt4sbv4uvv",                                         cat: "malaysia", flag: "🇲🇾" },
    { name: "LITE FM",       url: "https://stream.rcs.revma.com/bn4ex8sbv4uvv",                                         cat: "malaysia", flag: "🇲🇾" },

    // 🌿 Chill / Lo-fi
    { name: "Lofi Hip Hop",   url: "https://stream.zeno.fm/f3wvbbqmdg8uv",                cat: "chill" },
    { name: "0R LO-FI",       url: "https://0nlineradio.radioho.st/0r-lo-fi",             cat: "chill" },
    { name: "Café del Mar",   url: "https://streams.radio.co/se1a320b47/listen",          cat: "chill" },
    { name: "ISEKOI Chill",   url: "https://public.isekoi-radio.com/listen/chill/radio.mp3", cat: "chill" },
    { name: "Box Lofi Radio", url: "https://stream.zeno.fm/tabzverz0fctv",                cat: "chill" },

    // 🎧 EDM / Pop
    { name: "Top 100 Club Charts", url: "https://breakz-2012-high.rautemusik.fm/",        cat: "edm" },
    { name: "Los 40 Dance",   url: "https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_DANCE_SC", cat: "edm" },
    { name: "Radio FG",       url: "https://stream.rcs.revma.com/2v1zz979n98uv",          cat: "edm" },

    // 🎸 Rock
    { name: "SWR3",           url: "https://liveradio.swr.de/sw282p3/swr3/play.mp3",       cat: "rock" },
    { name: "1LIVE",          url: "https://wdr-1live-live.icecast.wdr.de/wdr/1live/live/mp3/128/stream.mp3", cat: "rock" },

    // 🌍 International
    { name: "FIP (FR)",       url: "https://icecast.radiofrance.fr/fip-midfi.mp3",         cat: "international" },
    { name: "Deutschlandfunk",url: "https://st01.sslstream.dlf.de/dlf/01/128/mp3/stream.mp3", cat: "international" },

    // 🎮 Gaming / Anime
    { name: "Gensokyo Radio", url: "https://stream.gensokyoradio.net/3",                   cat: "gaming" },
    { name: "Rainwave Chill", url: "https://relay.rainwave.cc/chill.ogg",                  cat: "gaming" },
    { name: "Stereo Anime",   url: "https://radio.stereoanime.com/listen/stereoanime/128", cat: "gaming" },
];

const CAT_META = {
    malaysia:      { emoji: "🇲🇾", labelKey: "catMalaysia",      color: "#52b788" },
    chill:         { emoji: "🌿", labelKey: "catChill",          color: "#7dd3fc" },
    edm:           { emoji: "🎧", labelKey: "catEdm",            color: "#c084fc" },
    rock:          { emoji: "🎸", labelKey: "catRock",           color: "#fb923c" },
    international: { emoji: "🌍", labelKey: "catInternational",  color: "#facc15" },
    gaming:        { emoji: "🎮", labelKey: "catGaming",         color: "#34d399" },
};
function catLabel(cat){
    if(cat==='all') return '🌍 '+t('catAll');
    const m=CAT_META[cat];
    return (m.emoji?m.emoji+' ':'')+t(m.labelKey);
}

const EXTERNAL_LINKS = {
    youtube:    'https://music.youtube.com',
    spotify:    'https://open.spotify.com',
    soundcloud: 'https://soundcloud.com',
    apple:      'https://music.apple.com',
    tidal:      'https://listen.tidal.com',
    deezer:     'https://www.deezer.com',
};

/* ────────────────────────────────────────
   I18N — Malay / English / Mandarin / Tamil
──────────────────────────────────────── */
const LANGS = [
    { code:'ms', label:'BM'   },
    { code:'en', label:'EN'   },
    { code:'zh', label:'中文' },
    { code:'ta', label:'தமிழ்' },
];

const I18N = {
    ms: {
        brandTitle: "ZOO RADIO",
        portal: "Portal Demo",
        brandSub: "Safari Radio Network",
        tagline: "Selamat datang ke Zoo Radio — Alam Bebas, Muzik Bebas —",
        nowPlaying: "NOW PLAYING",
        muteTitle: "Mute/Unmute",
        energy: "ENERGY",
        hydration: "HYDRATION",
        years: "TAHUN",
        chooseSource: "PILIH SUMBER MUZIK",
        sourceTitle: "Sumber Muzik",
        tabRadio: "Radio Stesen",
        tabExternal: "Sumber Lain",
        tabCustom: "Custom URL",
        catAll: "Semua",
        catMalaysia: "Malaysia",
        catChill: "Chill/Lo-fi",
        catEdm: "EDM/Pop",
        catRock: "Rock",
        catInternational: "International",
        catGaming: "Gaming/Anime",
        random: "Rawak",
        active: "Aktif:",
        prev: "Sebelumnya",
        next: "Seterusnya",
        open: "Buka",
        extYoutube: "Buka dalam tetingkap baru",
        extSpotify: "Buka Spotify Web Player",
        extSoundcloud: "Buka SoundCloud",
        extApple: "Buka Apple Music Web",
        extTidal: "Buka Tidal Web Player",
        extDeezer: "Buka Deezer Web",
        extNote: "Servis ini akan dibuka dalam tab baru. Audio tidak disinkronkan dengan radio panel.",
        customLabel: "Stream URL Sendiri",
        customHint: "Masukkan URL stream audio terus (MP3, AAC). Contoh: stesen radio peribadi, icecast, shoutcast.",
        customUrlPh: "https://stream.example.com/live.mp3",
        customNamePh: "Nama stesen (pilihan)",
        playThis: "Main Stream Ini",
        delete: "Padam",
        statusOnline: "Online",
        statusOffline: "Offline",
        statusUntried: "Belum dicuba",
        sWander: "Merayau",
        sSeekWater: "Haus (Cari Air)",
        sSeekFood: "Lapar (Cari Makanan)",
        sHunt: "Memburu {x}",
        sFlee: "Melarikan Diri",
        sDrink: "Minum Air",
        sEat: "Sedang Makan",
        sSleep: "Tidur",
        sRest: "Berehat",
        sPlay: "Bermain",
        sFull: "Kenyang!",
        sHydrated: "Kenyang Air (Merayau)",
        sDead: "TIDAK AKTIF (MATI)",
        sOldAge: "Mati Tua",
        sHungry: "Lapar",
        sThirsty: "Haus",
        male: "Jantan",
        female: "Betina",
        ticker: "{icon} {name} — {state} — Mendengar: {radio} —",
        night: "Tukar Siang/Malam",
        langTitle: "Tukar Bahasa",
        panelDragHint: "Seret untuk alih, klik dua kali untuk reset",
        help: "Bantuan: ←/→ tukar haiwan, M untuk mute",
    },
    en: {
        brandTitle: "ZOO RADIO",
        portal: "Demo Portal",
        brandSub: "Safari Radio Network",
        tagline: "Welcome to Zoo Radio — Free Nature, Free Music —",
        nowPlaying: "NOW PLAYING",
        muteTitle: "Mute/Unmute",
        energy: "ENERGY",
        hydration: "HYDRATION",
        years: "YRS",
        chooseSource: "CHOOSE MUSIC SOURCE",
        sourceTitle: "Music Source",
        tabRadio: "Radio Stations",
        tabExternal: "Other Sources",
        tabCustom: "Custom URL",
        catAll: "All",
        catMalaysia: "Malaysia",
        catChill: "Chill/Lo-fi",
        catEdm: "EDM/Pop",
        catRock: "Rock",
        catInternational: "International",
        catGaming: "Gaming/Anime",
        random: "Random",
        active: "Active:",
        prev: "Previous",
        next: "Next",
        open: "Open",
        extYoutube: "Open in a new window",
        extSpotify: "Open Spotify Web Player",
        extSoundcloud: "Open SoundCloud",
        extApple: "Open Apple Music Web",
        extTidal: "Open Tidal Web Player",
        extDeezer: "Open Deezer Web",
        extNote: "These services open in a new tab. Audio is not synced with the radio panel.",
        customLabel: "Custom Stream URL",
        customHint: "Enter a direct audio stream URL (MP3, AAC). E.g. private radio, icecast, shoutcast.",
        customUrlPh: "https://stream.example.com/live.mp3",
        customNamePh: "Station name (optional)",
        playThis: "Play This Stream",
        delete: "Delete",
        statusOnline: "Online",
        statusOffline: "Offline",
        statusUntried: "Not tried",
        sWander: "Wandering",
        sSeekWater: "Thirsty (Seeking Water)",
        sSeekFood: "Hungry (Seeking Food)",
        sHunt: "Hunting {x}",
        sFlee: "Fleeing",
        sDrink: "Drinking Water",
        sEat: "Eating",
        sSleep: "Sleeping",
        sRest: "Resting",
        sPlay: "Playing",
        sFull: "Full!",
        sHydrated: "Hydrated (Wandering)",
        sDead: "INACTIVE (DEAD)",
        sOldAge: "Died of Old Age",
        sHungry: "Hungry",
        sThirsty: "Thirsty",
        male: "Male",
        female: "Female",
        ticker: "{icon} {name} — {state} — Listening: {radio} —",
        night: "Toggle Day/Night",
        langTitle: "Change Language",
        panelDragHint: "Drag to move, double-click to reset",
        help: "Help: ←/→ switch animal, M to mute",
    },
    zh: {
        brandTitle: "动物园电台",
        portal: "演示门户",
        brandSub: "野生动物电台网络",
        tagline: "欢迎来到动物园电台 — 自由自然，自由音乐 —",
        nowPlaying: "正在播放",
        muteTitle: "静音/取消静音",
        energy: "能量",
        hydration: "水分",
        years: "岁",
        chooseSource: "选择音乐来源",
        sourceTitle: "音乐来源",
        tabRadio: "广播电台",
        tabExternal: "其他来源",
        tabCustom: "自定义 URL",
        catAll: "全部",
        catMalaysia: "马来西亚",
        catChill: "放松/低保真",
        catEdm: "电子/流行",
        catRock: "摇滚",
        catInternational: "国际",
        catGaming: "游戏/动漫",
        random: "随机",
        active: "当前：",
        prev: "上一个",
        next: "下一个",
        open: "打开",
        extYoutube: "在新窗口打开",
        extSpotify: "打开 Spotify 网页播放器",
        extSoundcloud: "打开 SoundCloud",
        extApple: "打开 Apple Music 网页",
        extTidal: "打开 Tidal 网页播放器",
        extDeezer: "打开 Deezer 网页",
        extNote: "这些服务将在新标签页打开，音频与电台面板不同步。",
        customLabel: "自定义流媒体 URL",
        customHint: "输入直接音频流 URL（MP3、AAC）。例如：私人电台、icecast、shoutcast。",
        customUrlPh: "https://stream.example.com/live.mp3",
        customNamePh: "电台名称（可选）",
        playThis: "播放此流",
        delete: "删除",
        statusOnline: "在线",
        statusOffline: "离线",
        statusUntried: "未尝试",
        sWander: "漫步",
        sSeekWater: "口渴（寻找水源）",
        sSeekFood: "饥饿（寻找食物）",
        sHunt: "狩猎 {x}",
        sFlee: "逃跑",
        sDrink: "喝水",
        sEat: "正在进食",
        sSleep: "睡觉",
        sRest: "休息",
        sPlay: "玩耍",
        sFull: "吃饱了！",
        sHydrated: "喝饱了（漫步）",
        sDead: "无活动（已死亡）",
        sOldAge: "寿终正寝",
        sHungry: "饥饿",
        sThirsty: "口渴",
        male: "雄性",
        female: "雌性",
        ticker: "{icon} {name} — {state} — 正在收听：{radio} —",
        night: "切换白天/夜晚",
        langTitle: "切换语言",
        panelDragHint: "拖动移动，双击复位",
        help: "帮助：←/→ 切换动物，M 静音",
    },
    ta: {
        brandTitle: "ஜூ ரேடியோ",
        portal: "டெமோ போர்டல்",
        brandSub: "சஃபாரி ரேடியோ நெட்வொர்க்",
        tagline: "ஜூ ரேடியோவிற்கு வரவேற்கிறோம் — இயற்கை சுதந்திரம், இசை சுதந்திரம் —",
        nowPlaying: "இப்போது இயங்குகிறது",
        muteTitle: "ஒலி நிறுத்து/தொடங்கு",
        energy: "சக்தி",
        hydration: "நீர்ச்சத்து",
        years: "வயது",
        chooseSource: "இசை மூலத்தைத் தேர்ந்தெடுங்கள்",
        sourceTitle: "இசை மூலம்",
        tabRadio: "ரேடியோ நிலையங்கள்",
        tabExternal: "பிற மூலங்கள்",
        tabCustom: "தனிப்பயன் URL",
        catAll: "அனைத்தும்",
        catMalaysia: "மலேசியா",
        catChill: "அமைதி/லோ-ஃபை",
        catEdm: "EDM/பாப்",
        catRock: "ராக்",
        catInternational: "சர்வதேசம்",
        catGaming: "கேமிங்/அனிம்",
        random: "சீரற்றது",
        active: "செயலில்:",
        prev: "முந்தையது",
        next: "அடுத்தது",
        open: "திற",
        extYoutube: "புதிய சாளரத்தில் திற",
        extSpotify: "Spotify வெப் பிளேயரை திற",
        extSoundcloud: "SoundCloud ஐ திற",
        extApple: "Apple Music வெப்பை திற",
        extTidal: "Tidal வெப் பிளேயரை திற",
        extDeezer: "Deezer வெப்பை திற",
        extNote: "இந்த சேவைகள் புதிய தாவலில் திறக்கும். ஆடியோ ரேடியோ பேனலுடன் ஒத்திசைக்கப்படாது.",
        customLabel: "தனிப்பயன் ஸ்ட்ரீம் URL",
        customHint: "நேரடி ஆடியோ ஸ்ட்ரீம் URL ஐ உள்ளிடவும் (MP3, AAC). எ.கா: தனிப்பட்ட ரேடியோ, icecast, shoutcast.",
        customUrlPh: "https://stream.example.com/live.mp3",
        customNamePh: "நிலையப் பெயர் (விருப்பம்)",
        playThis: "இந்த ஸ்ட்ரீமை இயக்கு",
        delete: "நீக்கு",
        statusOnline: "ஆன்லைன்",
        statusOffline: "ஆஃப்லைன்",
        statusUntried: "முயற்சிக்கவில்லை",
        sWander: "சுற்றுதல்",
        sSeekWater: "தாகம் (நீர் தேடுகிறது)",
        sSeekFood: "பசி (உணவு தேடுகிறது)",
        sHunt: "வேட்டையாடுகிறது {x}",
        sFlee: "தப்பி ஓடுகிறது",
        sDrink: "தண்ணீர் குடிக்கிறது",
        sEat: "உண்கிறது",
        sSleep: "தூங்குகிறது",
        sRest: "ஓய்வெடுக்கிறது",
        sPlay: "விளையாடுகிறது",
        sFull: "நிரம்பியது!",
        sHydrated: "நீர் நிறைவு (சுற்றுதல்)",
        sDead: "செயலற்றது (இறந்தது)",
        sOldAge: "முதுமையால் இறந்தது",
        sHungry: "பசி",
        sThirsty: "தாகம்",
        male: "ஆண்",
        female: "பெண்",
        ticker: "{icon} {name} — {state} — கேட்கிறது: {radio} —",
        night: "பகல்/இரவு மாற்று",
        langTitle: "மொழியை மாற்று",
        panelDragHint: "நகர்த்த இழுக்கவும், மீட்டமை இருமுறை சொடுக்கவும்",
        help: "உதவி: ←/→ விலங்கு மாற்ற, M ஒலி நிறுத்து",
    },
};

let lang = localStorage.getItem('zoo_lang') || 'ms';
if(!I18N[lang]) lang='ms';

function t(key, vars){
    let s = (I18N[lang] && I18N[lang][key]) || I18N.ms[key] || key;
    if(vars) for(const k in vars) s=s.replace(new RegExp('\\{'+k+'\\}','g'), vars[k]);
    return s;
}

function setLang(code){
    if(!I18N[code]) return;
    lang=code;
    localStorage.setItem('zoo_lang', code);
    applyI18n();
}

function applyI18n(){
    document.title = t('brandTitle') + ' — Zoo Radio';
    document.querySelectorAll('[data-i18n]').forEach(el=>{ el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-ph]').forEach(el=>{ el.placeholder = t(el.dataset.i18nPh); });
    document.querySelectorAll('[data-i18n-title]').forEach(el=>{ el.title = t(el.dataset.i18nTitle); });
    // Language switcher button label
    const langBtn=document.getElementById('langBtn');
    if(langBtn) langBtn.textContent=LANGS.find(l=>l.code===lang).label;
    buildSourcePanel();
    updateMuteBtn();
    updateUI();
}

/* ────────────────────────────────────────
   SPECIES CONFIG
──────────────────────────────────────── */
const SPECIES_CONFIG = {
    elephant: { color:'#90a4ae', secondary:'#546e7a', size:45, diet:'herbivore', icon:'🐘', life:60,  hRate:0.008, tRate:0.01,  speed:1.1 },
    hippo:    { color:'#7986cb', secondary:'#5c6bc0', size:36, diet:'herbivore', icon:'🦛', life:40,  hRate:0.01,  tRate:0.005, speed:1.2 },
    rhino:    { color:'#9e9e9e', secondary:'#757575', size:34, diet:'herbivore', icon:'🦏', life:40,  hRate:0.01,  tRate:0.015, speed:1.3 },
    giraffe:  { color:'#ffb74d', secondary:'#ef6c00', size:30, diet:'herbivore', icon:'🦒', life:25,  neck:45,     hRate:0.01,  tRate:0.015, speed:1.5 },
    bear:     { color:'#6d4c41', secondary:'#3e2723', size:30, diet:'carnivore', icon:'🐻', life:30,  hRate:0.015, tRate:0.02,  speed:1.7 },
    crocodile:{ color:'#2d5a27', secondary:'#1b3d17', size:35, diet:'carnivore', icon:'🐊', life:70,  hRate:0.01,  tRate:0.01,  speed:1.2 },
    cow:      { color:'#fff',    secondary:'#333',    size:26, diet:'herbivore', icon:'🐄', life:20,  hRate:0.012, tRate:0.018, speed:1.4 },
    gorilla:  { color:'#34495e', secondary:'#2c3e50', size:26, diet:'herbivore', icon:'🦍', life:35,  hRate:0.015, tRate:0.02,  speed:1.8 },
    lion:     { color:'#f4a460', secondary:'#a0522d', size:24, diet:'carnivore', icon:'🦁', life:15,  hRate:0.02,  tRate:0.03,  speed:2.7 },
    tiger:    { color:'#fb8c00', secondary:'#000',    size:24, diet:'carnivore', icon:'🐯', life:15,  hRate:0.02,  tRate:0.03,  speed:2.8 },
    zebra:    { color:'#eee',    secondary:'#000',    size:22, diet:'herbivore', icon:'🦓', life:20,  hRate:0.015, tRate:0.02,  speed:1.8 },
    camel:    { color:'#c6a664', secondary:'#8d6e63', size:24, diet:'herbivore', icon:'🐫', life:40,  hRate:0.005, tRate:0.005, speed:1.3 },
    panda:    { color:'#ffffff', secondary:'#000000', size:25, diet:'herbivore', icon:'🐼', life:20,  hRate:0.02,  tRate:0.02,  speed:1.1 },
    ostrich:  { color:'#2c3e50', secondary:'#f5cba7', size:23, diet:'herbivore', icon:'🦤', life:30,  hRate:0.02,  tRate:0.02,  speed:4.0 },
    kangaroo: { color:'#e67e22', secondary:'#d35400', size:20, diet:'herbivore', icon:'🦘', life:15,  hRate:0.02,  tRate:0.02,  speed:3.2 },
    deer:     { color:'#a1887f', secondary:'#5d4037', size:19, diet:'herbivore', icon:'🦌', life:15,  hRate:0.018, tRate:0.022, speed:2.2 },
    sheep:    { color:'#ffffff', secondary:'#333',    size:17, diet:'herbivore', icon:'🐑', life:12,  hRate:0.015, tRate:0.02,  speed:1.5 },
    goat:     { color:'#e0e0e0', secondary:'#757575', size:17, diet:'herbivore', icon:'🐐', life:15,  hRate:0.015, tRate:0.02,  speed:1.8 },
    wolf:     { color:'#78909c', secondary:'#37474f', size:17, diet:'carnivore', icon:'🐺', life:13,  hRate:0.03,  tRate:0.04,  speed:3.0 },
    pig:      { color:'#f8bbd0', secondary:'#f06292', size:18, diet:'herbivore', icon:'🐷', life:15,  hRate:0.02,  tRate:0.02,  speed:1.4 },
    cheetah:  { color:'#fdd835', secondary:'#000000', size:18, diet:'carnivore', icon:'🐆', life:10,  hRate:0.04,  tRate:0.05,  speed:3.8 },
    flamingo: { color:'#ff80ab', secondary:'#f06292', size:15, diet:'herbivore', icon:'🦩', life:30,  hRate:0.03,  tRate:0.04,  speed:1.5 },
    fox:      { color:'#e65100', secondary:'#ffffff', size:12, diet:'carnivore', icon:'🦊', life:7,   hRate:0.03,  tRate:0.04,  speed:2.8 },
    red_panda:{ color:'#d35400', secondary:'#5d4037', size:11, diet:'herbivore', icon:'🐼', life:12,  hRate:0.03,  tRate:0.03,  speed:2.2 },
    rabbit:   { color:'#fff',    secondary:'#ffcdd2', size:7,  diet:'herbivore', icon:'🐇', life:6,   hRate:0.04,  tRate:0.05,  speed:2.1 },
};

const NAMES = ["Bobi","Molly","Rambo","Luna","Kopi","Rex","Milo","Samba","Daisy","Zack","Nina","Kiki","Jojo","Bubu"];

/* ────────────────────────────────────────
   GLOBAL STATE
──────────────────────────────────────── */
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
const radioPlayer = document.getElementById('radioPlayer');

let zoom          = 0.7;
const worldSize   = 5000;
let currentCamX   = 0;
let currentCamY   = 0;
let entities      = [];
let plants        = [];
let lakes         = [];
let rocks         = [];
let mudPits       = [];
let focusedIndex  = 0;
let isMinimized   = false;
let isMuted       = true;
let sourcePanelOpen = false;
let activeCategory  = 'all';
let currentStationIdx = 0;  // index into RADIO_DB (or per-animal assigned)

/* ────────────────────────────────────────
   WORLD CLASSES
──────────────────────────────────────── */
class Rock {
    constructor(x,y,r) {
        this.x=x; this.y=y; this.r=r;
        this.color = Math.random()>0.5?'#90a4ae':'#78909c';
        this.vertices=[];
        for(let i=0;i<6;i++){
            let angle=(i/6)*Math.PI*2;
            let dist=r*(0.8+Math.random()*0.4);
            this.vertices.push({x:Math.cos(angle)*dist,y:Math.sin(angle)*dist});
        }
    }
    draw(){
        ctx.save(); ctx.translate(this.x,this.y);
        ctx.fillStyle=this.color;
        ctx.beginPath();
        ctx.moveTo(this.vertices[0].x,this.vertices[0].y);
        for(let v of this.vertices) ctx.lineTo(v.x,v.y);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle='rgba(255,255,255,0.2)'; ctx.lineWidth=2; ctx.stroke();
        ctx.restore();
    }
}

class MudPit {
    constructor(x,y,r){
        this.x=x; this.y=y; this.r=r;
        this.points=[]; this.miniSplats=[];
        const segs=10;
        for(let i=0;i<segs;i++){
            let a=(i/segs)*Math.PI*2; let d=r*(0.6+Math.random()*0.6);
            this.points.push({x:Math.cos(a)*d,y:Math.sin(a)*d});
        }
        for(let i=0;i<4;i++){
            let a=Math.random()*Math.PI*2; let d=r*(1.1+Math.random()*0.4);
            this.miniSplats.push({x:Math.cos(a)*d,y:Math.sin(a)*d,r:5+Math.random()*15});
        }
    }
    draw(){
        ctx.save(); ctx.translate(this.x,this.y);
        let g=ctx.createRadialGradient(0,0,0,0,0,this.r);
        g.addColorStop(0,'#3e2723'); g.addColorStop(0.8,'#5d4037'); g.addColorStop(1,'rgba(93,64,55,0)');
        ctx.fillStyle=g;
        ctx.beginPath();
        ctx.moveTo(this.points[0].x,this.points[0].y);
        for(let i=1;i<this.points.length;i++){
            let xc=(this.points[i].x+this.points[i-1].x)/2;
            let yc=(this.points[i].y+this.points[i-1].y)/2;
            ctx.quadraticCurveTo(this.points[i-1].x,this.points[i-1].y,xc,yc);
        }
        ctx.closePath(); ctx.fill();
        this.miniSplats.forEach(s=>{ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();});
        ctx.fillStyle='rgba(255,255,255,0.05)';
        ctx.beginPath(); ctx.ellipse(-this.r*0.2,-this.r*0.2,this.r*0.3,this.r*0.15,Math.PI/4,0,Math.PI*2); ctx.fill();
        ctx.restore();
    }
}

class Lake {
    constructor(x,y,r){
        this.x=x; this.y=y; this.r=r;
        this.points=[];
        for(let i=0;i<15;i++){
            let a=(i/15)*Math.PI*2; let d=r+Math.random()*r*0.4;
            this.points.push({x:x+Math.cos(a)*d,y:y+Math.sin(a)*d});
        }
    }
    draw(){
        ctx.fillStyle='#4fc3f7';
        ctx.beginPath();
        ctx.moveTo(this.points[0].x,this.points[0].y);
        for(let i=1;i<this.points.length;i++){
            let xc=(this.points[i].x+this.points[i-1].x)/2;
            let yc=(this.points[i].y+this.points[i-1].y)/2;
            ctx.quadraticCurveTo(this.points[i-1].x,this.points[i-1].y,xc,yc);
        }
        ctx.fill();
        ctx.strokeStyle='#81d4fa'; ctx.lineWidth=10; ctx.stroke();
    }
}

/* ────────────────────────────────────────
   ANIMAL CLASS
──────────────────────────────────────── */
class Animal {
    constructor(type,x,y){
        this.type=type; this.config=SPECIES_CONFIG[type];
        this.x=x; this.y=y;
        this.name=NAMES[Math.floor(Math.random()*NAMES.length)];
        // Assign a fixed station for this individual
        this.stationIdx = Math.floor(Math.random()*RADIO_DB.length);
        this.radioName  = RADIO_DB[this.stationIdx].name;
        this.radioUrl   = RADIO_DB[this.stationIdx].url;
        this.gender = Math.random()>0.5?'male':'female';
        // Lifecycle: start between 1 and ~60% of the species lifespan
        this.life    = this.config.life;
        this.age     = 1 + Math.random()*(this.life*0.6);
        this.ageRate = this.life/120;               // years per second (~2min full life)
        this.hunger = 70+Math.random()*30;
        this.thirst = 70+Math.random()*30;
        this.vx=(Math.random()-0.5); this.vy=(Math.random()-0.5);
        this.wiggle=Math.random()*Math.PI; this.flip=1;
        this.stateKey='sWander'; this.stateArg=null;
        this.mode='idle'; this.timer=0;
        this._eatTimer=0; this._drinkTimer=0; this._fullTimer=0;
        this.isDead=false; this.deathTimer=0;
    }

    update(){
        if(this.isDead) return;

        // Ageing — full lifecycle: grow old, die, and respawn as a new animal
        this.age += this.ageRate*0.016;
        if(this.age >= this.life){ this.isDead=true; this.stateKey='sOldAge'; return; }

        this.hunger-=this.config.hRate;
        this.thirst-=this.config.tRate;
        if(this.hunger<=0||this.thirst<=0){this.isDead=true;this.stateKey='sDead';return;}

        const margin=500, push=0.15;
        if(this.x<margin)              this.vx+=push;
        if(this.x>worldSize-margin)    this.vx-=push;
        if(this.y<margin)              this.vy+=push;
        if(this.y>worldSize-margin)    this.vy-=push;

        let spd=this.config.speed, target=null;

        // ── Sleeping: mostly still, needs drain slower, wakes on need/danger ──
        if(this.mode==='sleep'){
            this.timer--;
            this.hunger+=this.config.hRate*0.5;
            this.thirst+=this.config.tRate*0.5;
            const danger=this.config.diet==='herbivore'&&entities.some(e=>e.config.diet==='carnivore'&&!e.isDead&&Math.hypot(this.x-e.x,this.y-e.y)<500);
            if(this.timer<=0||this.hunger<50||this.thirst<50||danger){
                this.mode='idle'; this.timer=0;
            } else {
                this.stateKey='sSleep';
                this.x+=this.vx*0.05; this.y+=this.vy*0.05;
                this.wiggle+=0.03;
                return;
            }
        }

        // ── Urgent needs ──
        let predator=null;
        if(this.config.diet==='herbivore'){
            predator=entities.find(e=>e.config.diet==='carnivore'&&!e.isDead&&Math.hypot(this.x-e.x,this.y-e.y)<500);
        }

        if(predator){
            let ang=Math.atan2(this.y-predator.y,this.x-predator.x);
            this.vx+=Math.cos(ang)*0.5; this.vy+=Math.sin(ang)*0.5;
            this.stateKey='sFlee'; spd*=1.6;
            this.mode='idle'; this.timer=0;
        } else if(this.thirst<50){
            target=lakes.reduce((p,c)=>Math.hypot(this.x-c.x,this.y-c.y)<Math.hypot(this.x-p.x,this.y-p.y)?c:p);
            this.stateKey='sSeekWater';
            this.mode='idle'; this.timer=0;
        } else if(this.hunger<60){
            if(this.config.diet==='herbivore'){
                target=plants.find(p=>p.type==='grass'&&Math.hypot(this.x-p.x,this.y-p.y)<1500);
                this.stateKey='sSeekFood';
            } else {
                target=entities.find(e=>e.config.diet==='herbivore'&&!e.isDead&&Math.hypot(this.x-e.x,this.y-e.y)<1000);
                if(target){ this.stateKey='sHunt'; this.stateArg=target.type.replace('_',' '); spd*=1.5; }
            }
            this.mode='idle'; this.timer=0;
        } else {
            // ── Optional behaviors: play / sleep / rest / wander ──
            if(this._fullTimer>0){ this._fullTimer--; this.stateKey='sFull'; }
            else if(this._eatTimer>0){ this._eatTimer--; this.stateKey='sEat'; }
            else if(this._drinkTimer>0){ this._drinkTimer--; this.stateKey='sDrink'; }
            else if(this.timer<=0){
                const young=this.age<this.life*0.35;
                const r=Math.random();
                if(young&&r<0.0015){ this.mode='play';  this.timer=80+Math.random()*120; }
                else if(r<0.0008){   this.mode='sleep'; this.timer=240+Math.random()*180; }
                else if(r<0.006){    this.mode='rest';  this.timer=40+Math.random()*80; }
                else {               this.mode='idle';  this.timer=30+Math.random()*60; }
            }
            this.timer--;

            if(this.mode==='play'){
                this.stateKey='sPlay';
                this.vx+=(Math.random()-0.5)*0.6; this.vy+=(Math.random()-0.5)*0.6;
                spd*=1.4;
            } else if(this.mode==='rest'){
                this.stateKey='sRest';
                this.vx*=0.92; this.vy*=0.92;
            } else {
                this.stateKey='sWander';
                this.vx+=(Math.random()-0.5)*0.05;
                this.vy+=(Math.random()-0.5)*0.05;
            }
        }

        // ── Herbivore grazing / eating ──
        if(this.config.diet==='herbivore'){
            plants.slice().forEach((p)=>{
            if(p.type==='grass'&&Math.hypot(this.x-p.x,this.y-p.y)<30){
                    this.hunger=100;
                    this.stateKey='sEat'; this._eatTimer=45; this._fullTimer=0;
                    const i=plants.indexOf(p);
                    if(i>-1) plants.splice(i,1);
                    spawnPlant('grass',true);
                }
            });
        }

        // ── Move toward target ──
        if(target){
            let ang=Math.atan2(target.y-this.y,target.x-this.x);
            this.vx+=Math.cos(ang)*0.2; this.vy+=Math.sin(ang)*0.2;
            let d=Math.hypot(this.x-target.x,this.y-target.y);
            if(d<40){
                if(this.stateKey==='sSeekWater'){
                    this.thirst=100; this.stateKey='sDrink'; this.vx*=-1.5; this.vy*=-1.5;
                } else if(this.config.diet==='carnivore'&&target.config&&target.config.diet==='herbivore'){
                    this.hunger=100; target.isDead=true; this.stateKey='sFull'; this._fullTimer=60;
                }
            }
        }

        // ── Separation & mild herding ──
        entities.forEach(o=>{
            if(o===this||o.isDead) return;
            let d=Math.hypot(this.x-o.x,this.y-o.y);
            if(this.config.diet==='herbivore'&&o.type===this.type&&d<300){
                this.vx+=(o.x-this.x)*0.0005; this.vy+=(o.y-this.y)*0.0005;
            }
            let md=(this.config.size+o.config.size)*1.4;
            if(d<md){
                let a=Math.atan2(this.y-o.y,this.x-o.x);
                this.vx+=Math.cos(a)*0.15; this.vy+=Math.sin(a)*0.15;
            }
        });

        // ── Drinking at the water edge ──
        lakes.forEach(l=>{
            let d=Math.hypot(this.x-l.x,this.y-l.y);
            if(d<l.r+10){
                let ao=Math.atan2(this.y-l.y,this.x-l.x);
                this.thirst=100; this.stateKey='sDrink'; this._drinkTimer=45;
                this.x=l.x+Math.cos(ao)*(l.r+15);
                this.y=l.y+Math.sin(ao)*(l.r+15);
                this.vx=Math.cos(ao)*this.config.speed*1.5;
                this.vy=Math.sin(ao)*this.config.speed*1.5;
            }
        });

        let cs=Math.hypot(this.vx,this.vy);
        if(cs>spd){this.vx=(this.vx/cs)*spd; this.vy=(this.vy/cs)*spd;}
        this.x+=this.vx; this.y+=this.vy;
        if(Math.abs(this.vx)>0.1) this.flip=this.vx>0?1:-1;
        this.wiggle+=0.22;
        this.x=Math.max(50,Math.min(worldSize-50,this.x));
        this.y=Math.max(50,Math.min(worldSize-50,this.y));
    }

    draw(){
        ctx.save(); ctx.translate(this.x,this.y);
        if(this.isDead){
            let alpha=Math.max(0,1-this.deathTimer/4000);
            ctx.fillStyle=`rgba(180,180,180,${alpha})`;
            for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(Math.sin(this.deathTimer/200+i)*10,-this.deathTimer/50-i*10,15,0,Math.PI*2);ctx.fill();}
            ctx.restore(); return;
        }
        if(this.flip<0) ctx.scale(-1,1);
        let s=this.config.size, bob=Math.abs(Math.sin(this.wiggle))*4;
        ctx.strokeStyle=this.config.secondary; ctx.lineWidth=s/5; ctx.lineCap='round';
        let w1=Math.sin(this.wiggle)*(s/2), w2=Math.cos(this.wiggle)*(s/2);
        ctx.beginPath();ctx.moveTo(-s/3,-bob);ctx.lineTo(-s/3+w1,s/2-bob);ctx.stroke();
        ctx.beginPath();ctx.moveTo(s/3,-bob);ctx.lineTo(s/3+w2,s/2-bob);ctx.stroke();
        ctx.fillStyle=this.config.color;
        switch(this.type){
            case 'sheep':
                ctx.beginPath();ctx.arc(-s*.3,-bob-s*.3,s*.6,0,Math.PI*2);ctx.arc(s*.3,-bob-s*.3,s*.6,0,Math.PI*2);ctx.arc(0,-bob-s*.7,s*.7,0,Math.PI*2);ctx.fill();
                ctx.fillStyle=this.config.secondary;ctx.beginPath();ctx.ellipse(s*.6,-bob-s*.3,s*.4,s*.5,0,0,Math.PI*2);ctx.fill();break;
            case 'lion':
                ctx.fillStyle=this.config.secondary;ctx.beginPath();ctx.arc(s*.8,-bob-s*1.2,s*.9,0,Math.PI*2);ctx.fill();
                ctx.fillStyle=this.config.color;ctx.beginPath();ctx.roundRect(-s,-bob-s*1.1,s*1.8,s,10);ctx.fill();
                ctx.beginPath();ctx.arc(s*.8,-bob-s*1.2,s*.6,0,Math.PI*2);ctx.fill();break;
            case 'elephant':
                ctx.beginPath();ctx.roundRect(-s,-bob-s*1.2,s*1.8,s*1.3,15);ctx.fill();
                ctx.fillStyle=this.config.secondary;ctx.beginPath();ctx.ellipse(s*.2,-bob-s*1.2,s*.7,s*.9,0.2,0,Math.PI*2);ctx.fill();
                ctx.fillStyle=this.config.color;ctx.beginPath();ctx.arc(s*.9,-bob-s*1.1,s*.7,0,Math.PI*2);ctx.fill();
                ctx.lineWidth=s/3;ctx.strokeStyle=this.config.color;ctx.beginPath();ctx.moveTo(s*1.2,-bob-s);ctx.quadraticCurveTo(s*2,-bob-s*.5,s*1.5,-bob+s*.5);ctx.stroke();break;
            case 'giraffe':
                ctx.beginPath();ctx.roundRect(-s*.8,-bob-s*.8,s*1.5,s*.8,8);ctx.fill();
                ctx.fillRect(s*.3,-bob-s*2.5,s*.4,s*2);ctx.beginPath();ctx.ellipse(s*.6,-bob-s*2.6,s*.4,s*.3,-0.2,0,Math.PI*2);ctx.fill();break;
            case 'tiger':
                ctx.beginPath();ctx.roundRect(-s,-bob-s*1.1,s*1.8,s,10);ctx.fill();
                ctx.strokeStyle='#000';ctx.lineWidth=s*.1;
                for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-s*.6+i*s*.4,-bob-s*1.1);ctx.lineTo(-s*.6+i*s*.4,-bob-s*.2);ctx.stroke();}
                ctx.fillStyle=this.config.color;ctx.beginPath();ctx.arc(s*.8,-bob-s*1.2,s*.6,0,Math.PI*2);ctx.fill();break;
            case 'zebra':
                ctx.beginPath();ctx.roundRect(-s,-bob-s*1.1,s*1.8,s,10);ctx.fill();
                ctx.strokeStyle='#000';ctx.lineWidth=s*.15;
                for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-s*.5+i*s*.4,-bob-s*1.1);ctx.lineTo(-s*.5+i*s*.4,-bob-s*.2);ctx.stroke();}
                ctx.fillStyle=this.config.color;ctx.beginPath();ctx.arc(s*.8,-bob-s*1.2,s*.5,0,Math.PI*2);ctx.fill();break;
            case 'wolf':
                ctx.beginPath();ctx.roundRect(-s,-bob-s*1.0,s*1.6,s*.8,5);ctx.fill();
                ctx.beginPath();ctx.moveTo(s*.5,-bob-s*.8);ctx.lineTo(s*1.4,-bob-s*.8);ctx.lineTo(s*.8,-bob-s*1.5);ctx.fill();
                ctx.beginPath();ctx.arc(s*.6,-bob-s*1.2,s*.2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(s*.3,-bob-s*1.2,s*.2,0,Math.PI*2);ctx.fill();break;
            case 'rabbit':
                ctx.beginPath();ctx.arc(0,-bob-s*.6,s*.8,0,Math.PI*2);ctx.fill();
                ctx.fillStyle=this.config.secondary;
                ctx.beginPath();ctx.ellipse(-s*.2,-bob-s*1.6,s*.2,s*.7,-0.1,0,Math.PI*2);ctx.fill();
                ctx.beginPath();ctx.ellipse(s*.2,-bob-s*1.6,s*.2,s*.7,0.1,0,Math.PI*2);ctx.fill();break;
            case 'deer':
                ctx.beginPath();ctx.roundRect(-s*.8,-bob-s*.8,s*1.5,s*.7,8);ctx.fill();
                ctx.fillRect(s*.4,-bob-s*1.6,s*.3,s);ctx.beginPath();ctx.ellipse(s*.6,-bob-s*1.7,s*.4,s*.25,0,0,Math.PI*2);ctx.fill();
                ctx.strokeStyle=this.config.secondary;ctx.lineWidth=2;
                ctx.beginPath();ctx.moveTo(s*.6,-bob-s*1.8);ctx.lineTo(s*.4,-bob-s*2.3);ctx.moveTo(s*.6,-bob-s*1.8);ctx.lineTo(s*.9,-bob-s*2.3);ctx.stroke();break;
            case 'bear':
                ctx.beginPath();ctx.arc(0,-bob-s*.6,s*1.1,0,Math.PI*2);ctx.fill();
                ctx.beginPath();ctx.arc(s*.8,-bob-s*1.2,s*.6,0,Math.PI*2);ctx.fill();
                ctx.beginPath();ctx.arc(s*.5,-bob-s*1.7,s*.25,0,Math.PI*2);ctx.fill();
                ctx.beginPath();ctx.arc(s*1.1,-bob-s*1.7,s*.25,0,Math.PI*2);ctx.fill();break;
            case 'cow':
                ctx.beginPath();ctx.roundRect(-s,-bob-s*1.1,s*2,s*1.2,10);ctx.fill();
                ctx.fillStyle=this.config.secondary;ctx.beginPath();ctx.arc(-s*.4,-bob-s*.8,s*.4,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(s*.2,-bob-s*.4,s*.3,0,Math.PI*2);ctx.fill();
                ctx.fillStyle=this.config.color;ctx.beginPath();ctx.roundRect(s*.8,-bob-s*1.3,s*.8,s*.9,5);ctx.fill();
                ctx.fillStyle='#ddd';ctx.fillRect(s*.9,-bob-s*1.5,s*.15,s*.3);ctx.fillRect(s*1.3,-bob-s*1.5,s*.15,s*.3);break;
            case 'hippo':
                ctx.beginPath();ctx.roundRect(-s,-bob-s*1.0,s*2.2,s*1.1,15);ctx.fill();
                ctx.beginPath();ctx.roundRect(s*.6,-bob-s*1.2,s*1.2,s*1.0,10);ctx.fill();
                ctx.fillStyle='rgba(0,0,0,0.1)';ctx.beginPath();ctx.arc(s*1.5,-bob-s*.6,s*.1,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(s*1.7,-bob-s*.6,s*.1,0,Math.PI*2);ctx.fill();break;
            case 'rhino':
                ctx.beginPath();ctx.roundRect(-s,-bob-s*1.1,s*2.2,s*1.3,12);ctx.fill();
                ctx.beginPath();ctx.arc(s*1.1,-bob-s*1.2,s*.7,0,Math.PI*2);ctx.fill();
                ctx.fillStyle='#ddd';ctx.beginPath();ctx.moveTo(s*1.4,-bob-s*1.3);ctx.lineTo(s*1.8,-bob-s*1.8);ctx.lineTo(s*1.8,-bob-s*1.3);ctx.fill();break;
            case 'fox':
                ctx.beginPath();ctx.ellipse(0,-bob-s*.6,s*1.2,s*.6,0,0,Math.PI*2);ctx.fill();
                ctx.beginPath();ctx.ellipse(-s*1.2,-bob-s*.8,s*.8,s*.4,-0.5,0,Math.PI*2);ctx.fill();
                ctx.fillStyle=this.config.secondary;ctx.beginPath();ctx.arc(s*.8,-bob-s*1.0,s*.5,0,Math.PI*2);ctx.fill();break;
            case 'cheetah':
                ctx.beginPath();ctx.roundRect(-s,-bob-s*1.0,s*1.8,s*.9,8);ctx.fill();
                ctx.fillStyle=this.config.secondary;ctx.lineWidth=1;
                for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(-s*.6+i*s*.4,-bob-s*.6,s*.12,0,Math.PI*2);ctx.fill();}
                ctx.fillStyle=this.config.color;ctx.beginPath();ctx.arc(s*.8,-bob-s*1.1,s*.55,0,Math.PI*2);ctx.fill();break;
            case 'kangaroo':
                ctx.beginPath();ctx.roundRect(-s*.5,-bob-s*1.4,s*1.0,s*1.5,10);ctx.fill();
                ctx.beginPath();ctx.arc(s*.3,-bob-s*1.5,s*.5,0,Math.PI*2);ctx.fill();
                ctx.lineWidth=s*.3;ctx.strokeStyle=this.config.color;ctx.lineCap='round';
                ctx.beginPath();ctx.moveTo(s*.3,-bob-s*1.3);ctx.quadraticCurveTo(s*1.5,-bob-s,s*1.8,-bob+s*.5);ctx.stroke();break;
            case 'goat':
                ctx.beginPath();ctx.roundRect(-s*.8,-bob-s*.8,s*1.5,s*.7,8);ctx.fill();
                ctx.fillRect(s*.3,-bob-s*1.6,s*.25,s);ctx.beginPath();ctx.ellipse(s*.5,-bob-s*1.7,s*.35,s*.22,0,0,Math.PI*2);ctx.fill();
                ctx.strokeStyle='#aaa';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(s*.4,-bob-s*1.9);ctx.lineTo(s*.3,-bob-s*2.2);ctx.moveTo(s*.6,-bob-s*1.9);ctx.lineTo(s*.7,-bob-s*2.2);ctx.stroke();break;
            case 'pig':
                ctx.beginPath();ctx.roundRect(-s*.9,-bob-s*.9,s*1.8,s*1.0,15);ctx.fill();
                ctx.beginPath();ctx.arc(s*.9,-bob-s*.9,s*.6,0,Math.PI*2);ctx.fill();
                ctx.fillStyle=this.config.secondary;ctx.beginPath();ctx.ellipse(s*1.2,-bob-s*.9,s*.25,s*.2,0,0,Math.PI*2);ctx.fill();break;
            case 'camel':
                ctx.beginPath();ctx.roundRect(-s,-bob-s*1.0,s*2,s*1.0,10);ctx.fill();
                ctx.beginPath();ctx.arc(0,-bob-s*1.5,s*.5,0,Math.PI*2);ctx.fill();
                ctx.beginPath();ctx.arc(s*.8,-bob-s*1.7,s*.4,0,Math.PI*2);ctx.fill();
                ctx.fillRect(s*.7,-bob-s*1.8,s*.3,s*.8);ctx.beginPath();ctx.ellipse(s*.9,-bob-s*1.8,s*.3,s*.2,-0.1,0,Math.PI*2);ctx.fill();break;
            case 'panda':
                ctx.beginPath();ctx.arc(0,-bob-s*.7,s*1.1,0,Math.PI*2);ctx.fill();
                ctx.beginPath();ctx.arc(s*.8,-bob-s*1.2,s*.65,0,Math.PI*2);ctx.fill();
                ctx.fillStyle=this.config.secondary;
                ctx.beginPath();ctx.arc(s*.55,-bob-s*1.3,s*.25,0,Math.PI*2);ctx.fill();
                ctx.beginPath();ctx.arc(s*1.05,-bob-s*1.3,s*.25,0,Math.PI*2);ctx.fill();
                ctx.beginPath();ctx.arc(s*.3,-bob-s*1.6,s*.2,0,Math.PI*2);ctx.fill();
                ctx.beginPath();ctx.arc(s*1.3,-bob-s*1.6,s*.2,0,Math.PI*2);ctx.fill();break;
            case 'gorilla':
                ctx.beginPath();ctx.arc(0,-bob-s*.5,s*1.2,0,Math.PI*2);ctx.fill();
                ctx.beginPath();ctx.arc(s*.9,-bob-s*1.2,s*.7,0,Math.PI*2);ctx.fill();
                ctx.fillStyle=this.config.secondary;ctx.beginPath();ctx.ellipse(s*.9,-bob-s*1.0,s*.35,s*.3,0,0,Math.PI*2);ctx.fill();break;
            case 'ostrich':
                ctx.beginPath();ctx.ellipse(0,-bob-s*1.0,s*1.1,s*.8,0,0,Math.PI*2);ctx.fill();
                ctx.fillStyle=this.config.secondary;ctx.fillRect(s*.6,-bob-s*2.5,s*.2,s*1.5);
                ctx.beginPath();ctx.arc(s*.7,-bob-s*2.6,s*.3,0,Math.PI*2);ctx.fill();break;
            case 'flamingo':
                ctx.beginPath();ctx.ellipse(0,-bob-s*1.2,s*1.0,s*.6,0,0,Math.PI*2);ctx.fill();
                ctx.lineWidth=s*.25;ctx.strokeStyle=this.config.color;
                ctx.beginPath();ctx.moveTo(s*.8,-bob-s*1.2);ctx.bezierCurveTo(s*1.5,-bob-s*1.8,s*1.5,-bob-s*2.5,s*1.0,-bob-s*2.6);ctx.stroke();
                ctx.fillStyle='#000';ctx.beginPath();ctx.arc(s*.9,-bob-s*2.6,s*.2,0,Math.PI*2);ctx.fill();break;
            case 'red_panda':
                ctx.beginPath();ctx.roundRect(-s,-bob-s*.8,s*1.8,s*.8,8);ctx.fill();
                for(let i=0;i<4;i++){ctx.fillStyle=i%2===0?this.config.color:this.config.secondary;ctx.beginPath();ctx.ellipse(-s*1.2-i*5,-bob-s*.6,s*.4,s*.5,0.5,0,Math.PI*2);ctx.fill();}
                ctx.fillStyle=this.config.color;ctx.beginPath();ctx.arc(s*.8,-bob-s*1.0,s*.6,0,Math.PI*2);ctx.fill();break;
            case 'crocodile':
                ctx.beginPath();ctx.roundRect(-s*1.2,-bob-s*.5,s*2.4,s*.6,4);ctx.fill();
                ctx.fillStyle=this.config.secondary;ctx.beginPath();ctx.roundRect(s*.8,-bob-s*.7,s*1.2,s*.3,2);ctx.fill();
                for(let i=0;i<4;i++){ctx.fillStyle=this.config.color;ctx.beginPath();ctx.arc(-s*.8+i*s*.5,-bob-s*.1,s*.15,0,Math.PI*2);ctx.fill();}break;
            default:
                ctx.beginPath();ctx.roundRect(-s,-s*1.2-bob,s*1.8,s*1.2,10);ctx.fill();
        }
        // Selection ring for focused animal
        if(entities[focusedIndex]===this && !this.isDead){
            ctx.strokeStyle='rgba(232,160,69,0.7)';
            ctx.lineWidth=2/zoom;
            ctx.setLineDash([4/zoom,3/zoom]);
            ctx.beginPath();
            ctx.arc(0,-bob-s*0.6,s*1.8,0,Math.PI*2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        ctx.restore();
    }
}

/* ────────────────────────────────────────
   ECOSYSTEM
──────────────────────────────────────── */
function isPositionInLake(x,y){
    for(let l of lakes) if(Math.hypot(x-l.x,y-l.y)<l.r+30) return true;
    return false;
}

function spawnPlant(type,isNew=false){
    let x,y,ok=false,att=0;
    while(!ok&&att<50){ x=Math.random()*worldSize; y=Math.random()*worldSize; if(!isPositionInLake(x,y)) ok=true; att++; }
    if(ok) plants.push({x,y,type,size:type==='tree'?45:8,scale:isNew?0:1,color:['#e74c3c','#f39c12','#9b59b6','#1abc9c'][Math.floor(Math.random()*4)]});
}

function initEcosystem(){
    lakes=[new Lake(1000,1000,300),new Lake(4000,1000,300),new Lake(1000,4000,300),new Lake(4000,4000,350)];
    for(let i=0;i<6;i++) mudPits.push(new MudPit(Math.random()*worldSize,Math.random()*worldSize,100+Math.random()*100));
    for(let i=0;i<50;i++) rocks.push(new Rock(Math.random()*worldSize,Math.random()*worldSize,20+Math.random()*30));
    for(let i=0;i<800;i++) spawnPlant('grass');
    for(let i=0;i<200;i++) spawnPlant('tree');
    for(let i=0;i<30;i++)  spawnPlant('flower');
    Object.keys(SPECIES_CONFIG).forEach(type=>{
        const cfg=SPECIES_CONFIG[type];
        let count=cfg.diet==='carnivore'?2:10;
        for(let i=0;i<count;i++) entities.push(new Animal(type,Math.random()*worldSize,Math.random()*worldSize));
    });
    updateUI();
    updateRadio();
    draw();
}

/* ────────────────────────────────────────
   RADIO LOGIC
──────────────────────────────────────── */
function updateRadio(){
    const f=entities[focusedIndex];
    if(!f) return;
    if(f.stationIdx >= 0) markStationStatus(f.stationIdx, 'checking');
    radioPlayer.src=f.radioUrl;
    radioPlayer.muted=true;
    radioPlayer.play().then(()=>{
        radioPlayer.muted=isMuted;
        if(f.stationIdx >= 0) markStationStatus(f.stationIdx, 'ok');
    }).catch(()=>{
        if(f.stationIdx >= 0) markStationStatus(f.stationIdx, 'error');
    });
    document.getElementById('p-radio').textContent=f.radioName;
    document.getElementById('activeSource').textContent=f.radioName;
    updateStationListHighlight(f.stationIdx);
}

function updateMuteBtn(){
    const btn=document.getElementById('muteBtn');
    btn.classList.toggle('is-muted',isMuted);
    btn.querySelector('.icon-sound').style.display=isMuted?'none':'block';
    btn.querySelector('.icon-muted').style.display=isMuted?'block':'none';
    const viz=document.getElementById('visualizer');
    viz.classList.toggle('paused',isMuted);
}

function toggleMute(){
    isMuted=!isMuted;
    radioPlayer.muted=isMuted;
    if(!isMuted) radioPlayer.play().catch(()=>{});
    updateMuteBtn();
}

function playRandom(){
    const idx=Math.floor(Math.random()*RADIO_DB.length);
    playStation(idx);
}

function playStation(idx){
    currentStationIdx=idx;
    const station=RADIO_DB[idx];
    markStationStatus(idx, 'checking');
    entities[focusedIndex].stationIdx=idx;
    entities[focusedIndex].radioName=station.name;
    entities[focusedIndex].radioUrl=station.url;
    radioPlayer.src=station.url;
    radioPlayer.muted=true;
    radioPlayer.play().then(()=>{
        radioPlayer.muted=isMuted;
        markStationStatus(idx, 'ok');
    }).catch(()=>{
        markStationStatus(idx, 'error');
    });
    document.getElementById('p-radio').textContent=station.name;
    document.getElementById('activeSource').textContent=station.name;
    updateStationListHighlight(idx);
}

/* ────────────────────────────────────────
   SOURCE PANEL UI
──────────────────────────────────────── */
let stationStatuses = {}; // idx -> 'ok' | 'error' | 'checking' | 'unknown'
let savedCustomUrls = JSON.parse(localStorage.getItem('safari_custom_urls') || '[]');

function buildSourcePanel(){
    const catContainer = document.querySelector('.source-categories');
    const cats=['all', ...Object.keys(CAT_META)];
    catContainer.innerHTML='';
    cats.forEach(cat=>{
        const btn=document.createElement('button');
        btn.className='cat-pill'+(cat==='all'?' active':'');
        btn.textContent=catLabel(cat);
        btn.dataset.cat=cat;
        btn.onclick=()=>filterCategory(cat);
        catContainer.appendChild(btn);
    });
    renderStationList('all');
    renderSavedCustomList();
}

function switchMainTab(tab) {
    document.querySelectorAll('.main-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('hidden', c.id !== 'tab-' + tab));
}

function filterCategory(cat){
    activeCategory=cat;
    document.querySelectorAll('.cat-pill').forEach(p=>{
        p.classList.toggle('active', p.dataset.cat===cat);
    });
    renderStationList(cat);
}

function renderStationList(cat){
    const list=document.getElementById('sourceList');
    const filtered=cat==='all'?RADIO_DB:RADIO_DB.filter(s=>s.cat===cat);
    list.innerHTML='';
    filtered.forEach((station)=>{
        const globalIdx=RADIO_DB.indexOf(station);
        const status = stationStatuses[globalIdx] || 'unknown';
        const item=document.createElement('div');
        item.className='station-item';
        item.dataset.idx=globalIdx;
        item.innerHTML=`
            <div class="station-status ${status}" title="${status==='ok'?t('statusOnline'):status==='error'?t('statusOffline'):t('statusUntried')}"></div>
            <div class="station-info">
                <div class="station-name">${station.flag||''}${station.flag?' ':''}${station.name}</div>
                <div class="station-cat-label">${catLabel(station.cat)}</div>
            </div>
            <div class="station-play-indicator">
                <span></span><span></span><span></span>
            </div>
        `;
        item.onclick=()=>{ playStation(globalIdx); };
        list.appendChild(item);
    });
    updateStationListHighlight(entities[focusedIndex] ? entities[focusedIndex].stationIdx : currentStationIdx);
}

function updateStationListHighlight(activeIdx){
    document.querySelectorAll('.station-item').forEach(item=>{
        item.classList.toggle('is-playing', parseInt(item.dataset.idx)===activeIdx);
    });
}

function toggleSourcePanel(){
    sourcePanelOpen=!sourcePanelOpen;
    const panel=document.getElementById('sourcePanel');
    const btn=document.getElementById('sourceToggleBtn');
    panel.classList.toggle('is-open',sourcePanelOpen);
    btn.classList.toggle('is-open',sourcePanelOpen);
}

/* ── External Sources ── */
function openExternal(service) {
    const url = EXTERNAL_LINKS[service];
    if (url) window.open(url, '_blank', 'noopener');
}

/* ── Custom URL ── */
function playCustomUrl() {
    const urlInput = document.getElementById('customUrlInput');
    const nameInput = document.getElementById('customNameInput');
    const url = urlInput.value.trim();
    const name = nameInput.value.trim() || url;
    if (!url) return;

    // Save to list
    const existing = savedCustomUrls.findIndex(s => s.url === url);
    if (existing === -1) {
        savedCustomUrls.unshift({ name, url });
        if (savedCustomUrls.length > 10) savedCustomUrls.pop();
        localStorage.setItem('safari_custom_urls', JSON.stringify(savedCustomUrls));
        renderSavedCustomList();
    }

    // Play directly
    const f = entities[focusedIndex];
    if (!f) return;
    f.stationIdx = -1;
    f.radioName = name;
    f.radioUrl = url;
    radioPlayer.src = url;
    radioPlayer.muted = true;
    radioPlayer.play().then(() => { radioPlayer.muted = isMuted; }).catch(() => {});
    document.getElementById('p-radio').textContent = name;
    document.getElementById('activeSource').textContent = name;
    updateStationListHighlight(-1);
    urlInput.value = '';
    nameInput.value = '';
}

function renderSavedCustomList() {
    const container = document.getElementById('savedCustomList');
    container.innerHTML = '';
    if (savedCustomUrls.length === 0) return;
    savedCustomUrls.forEach((s, i) => {
        const item = document.createElement('div');
        item.className = 'saved-custom-item';
        item.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px;color:var(--text-3);flex-shrink:0"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
            <span class="saved-custom-name" title="${s.url}">${s.name}</span>
            <button class="saved-custom-delete" onclick="deleteCustomUrl(${i},event)" title="${t('delete')}">✕</button>
        `;
        item.onclick = () => {
            document.getElementById('customUrlInput').value = s.url;
            document.getElementById('customNameInput').value = s.name;
            playCustomUrl();
        };
        container.appendChild(item);
    });
}

function deleteCustomUrl(idx, e) {
    e.stopPropagation();
    savedCustomUrls.splice(idx, 1);
    localStorage.setItem('safari_custom_urls', JSON.stringify(savedCustomUrls));
    renderSavedCustomList();
}

/* ── Station health check (passive — only check on play attempt) ── */
function markStationStatus(idx, status) {
    stationStatuses[idx] = status;
    // Update dot in list if visible
    document.querySelectorAll('.station-item').forEach(item => {
        if (parseInt(item.dataset.idx) === idx) {
            const dot = item.querySelector('.station-status');
            if (dot) { dot.className = 'station-status ' + status; }
        }
    });
}

/* ────────────────────────────────────────
   PANEL MINIMIZE
──────────────────────────────────────── */
function toggleMinimize(){
    isMinimized=!isMinimized;
    const profile=document.getElementById('profile-panel');
    profile.classList.toggle('is-minimized',isMinimized);
    if(isMinimized) document.getElementById('mini-icon').textContent=entities[focusedIndex]?.config.icon||'🐘';
}

function shiftEntity(dir){
    focusedIndex=(focusedIndex+dir+entities.length)%entities.length;
    updateUI();
    updateRadio();
    if(isMinimized) document.getElementById('mini-icon').textContent=entities[focusedIndex]?.config.icon;
}

/* ────────────────────────────────────────
   UI UPDATE
──────────────────────────────────────── */
function updateUI(){
    const f=entities[focusedIndex];
    if(!f) return;
    document.getElementById('p-icon').textContent=f.config.icon;
    document.getElementById('p-name').textContent=f.name;
    document.getElementById('p-species').textContent=f.type.replace('_',' ').toUpperCase();
    document.getElementById('p-gender').textContent=t(f.gender==='male'?'male':'female');
    document.getElementById('p-age').textContent=Math.floor(f.age)+' '+t('years');
    document.getElementById('p-hunger-bar').style.width=Math.max(0,f.hunger)+'%';
    document.getElementById('p-thirst-bar').style.width=Math.max(0,f.thirst)+'%';
    document.getElementById('p-hunger-txt').textContent=Math.floor(Math.max(0,f.hunger))+'%';
    document.getElementById('p-thirst-txt').textContent=Math.floor(Math.max(0,f.thirst))+'%';

    // Refill flash: pulse the bar while it is visibly filling up
    const hb=document.getElementById('p-hunger-bar');
    const tb=document.getElementById('p-thirst-bar');
    hb.classList.toggle('bar-flash', f.hunger>f._lastHunger+1);
    tb.classList.toggle('bar-flash', f.thirst>f._lastThirst+1);
    f._lastHunger=f.hunger; f._lastThirst=f.thirst;

    const state=f.isDead
        ? t(f.stateKey==='sOldAge'?'sOldAge':'sDead')
        : t(f.stateKey, f.stateArg?{x:f.stateArg}:undefined);
    document.getElementById('p-status').textContent=state;
    document.getElementById('status-dot').classList.toggle('is-dead',f.isDead);

    // Ticker
    const ticker=document.getElementById('ticker-text');
    ticker.textContent=t('ticker',{icon:f.config.icon,name:f.name,state,radio:f.radioName});
}

/* ────────────────────────────────────────
   ZOOM & CANVAS
──────────────────────────────────────── */
function adjustZoom(v){
    let minZ=Math.max(window.innerWidth/worldSize, window.innerHeight/worldSize);
    zoom=Math.max(minZ, Math.min(3, zoom+v));
}

window.addEventListener('wheel', e=>adjustZoom(e.deltaY<0?0.1:-0.1));
window.addEventListener('resize',()=>{
    canvas.width=window.innerWidth; canvas.height=window.innerHeight; adjustZoom(0);
});

canvas.addEventListener('mousedown',e=>{
    const mx=(e.clientX-canvas.width/2+currentCamX)/zoom;
    const my=(e.clientY-canvas.height/2+currentCamY)/zoom;
    const cr=Math.max(60,30/zoom);
    entities.forEach((ent,idx)=>{
        if(!ent.isDead&&Math.hypot(ent.x-mx,ent.y-my)<cr){
            focusedIndex=idx; updateUI(); updateRadio();
            if(isMinimized) document.getElementById('mini-icon').textContent=ent.config.icon;
        }
    });
});

/* ────────────────────────────────────────
   DRAW LOOP
──────────────────────────────────────── */
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const f=entities[focusedIndex];
    if(!f) return requestAnimationFrame(draw);

    ctx.save();
    let camX=f.x*zoom, camY=f.y*zoom;
    let vW=canvas.width/2, vH=canvas.height/2;
    let wZ=worldSize*zoom;
    if(wZ<=canvas.width)  camX=wZ/2; else camX=Math.max(vW,Math.min(wZ-vW,camX));
    if(wZ<=canvas.height) camY=wZ/2; else camY=Math.max(vH,Math.min(wZ-vH,camY));
    currentCamX=camX; currentCamY=camY;

    ctx.translate(canvas.width/2-camX, canvas.height/2-camY);
    ctx.scale(zoom,zoom);

    // Ground dots
    ctx.fillStyle='rgba(0,0,0,0.03)';
    for(let i=0;i<150;i++){
        let dx=(Math.floor(f.x/1000)*1000)+(i*137)%2000-1000+f.x;
        let dy=(Math.floor(f.y/1000)*1000)+(i*183)%2000-1000+f.y;
        ctx.beginPath();ctx.arc(dx,dy,2,0,Math.PI*2);ctx.fill();
    }

    mudPits.forEach(m=>m.draw());
    lakes.forEach(l=>l.draw());
    rocks.forEach(r=>r.draw());

    plants.forEach(p=>{
        if(p.scale<1) p.scale+=0.05;
        ctx.save(); ctx.translate(p.x,p.y); ctx.scale(p.scale,p.scale);
        if(p.type==='grass'){
            ctx.lineWidth=2; ctx.lineCap='round';
            ctx.strokeStyle='#2e7d32';ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-5,-5,-4,-12);ctx.stroke();
            ctx.strokeStyle='#388e3c';ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(0,-8,2,-15);ctx.stroke();
            ctx.strokeStyle='#43a047';ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(5,-5,6,-10);ctx.stroke();
        } else if(p.type==='tree'){
            ctx.fillStyle='rgba(0,0,0,0.1)';ctx.beginPath();ctx.ellipse(0,0,20,10,0,0,Math.PI*2);ctx.fill();
            ctx.fillStyle='#5d4037';ctx.beginPath();ctx.moveTo(-4,0);ctx.lineTo(-2,-30);ctx.lineTo(2,-30);ctx.lineTo(4,0);ctx.fill();
            ctx.fillStyle='#1b5e20';ctx.beginPath();ctx.arc(0,-45,25,0,Math.PI*2);ctx.fill();
            ctx.fillStyle='#2e7d32';ctx.beginPath();ctx.arc(10,-50,18,0,Math.PI*2);ctx.fill();
            ctx.fillStyle='#43a047';ctx.beginPath();ctx.arc(-8,-55,12,0,Math.PI*2);ctx.fill();
        } else if(p.type==='flower'){
            ctx.strokeStyle='green';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-10);ctx.stroke();
            ctx.fillStyle=p.color;
            for(let i=0;i<5;i++){let a=(i/5)*Math.PI*2;ctx.beginPath();ctx.arc(Math.cos(a)*4,-10+Math.sin(a)*4,3,0,Math.PI*2);ctx.fill();}
            ctx.fillStyle='yellow';ctx.beginPath();ctx.arc(0,-10,2,0,Math.PI*2);ctx.fill();
        }
        ctx.restore();
    });

    entities.forEach((e,i)=>{
        e.update(); e.draw();
        if(e.isDead){
            if(!e.deathTimer) e.deathTimer=0;
            e.deathTimer+=16;
            if(e.deathTimer>4000) entities[i]=new Animal(e.type,Math.random()*worldSize,Math.random()*worldSize);
        }
    });

    ctx.restore();

    if(plants.filter(p=>p.type==='grass').length<800&&Math.random()<0.1) spawnPlant('grass',true);

    updateUI();
    requestAnimationFrame(draw);
}

/* ────────────────────────────────────────
   INIT
──────────────────────────────────────── */
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

// Allow audio on first interaction
document.addEventListener('click',()=>{ radioPlayer.muted=isMuted; },{once:true});

// Handle stream errors — mark station as failed
radioPlayer.addEventListener('error', () => {
    const f = entities[focusedIndex];
    if(f && f.stationIdx >= 0) markStationStatus(f.stationIdx, 'error');
});

// Enter key on custom URL input
document.getElementById('customUrlInput').addEventListener('keydown', e => {
    if(e.key === 'Enter') playCustomUrl();
});

/* ── Language switcher (cycles through LANGS) ── */
document.getElementById('langBtn').addEventListener('click', ()=>{
    const i=LANGS.findIndex(l=>l.code===lang);
    setLang(LANGS[(i+1)%LANGS.length].code);
});

/* ── Day / Night toggle ── */
let isNight=localStorage.getItem('zoo_night')==='1';
function applyNight(){
    document.body.classList.toggle('night',isNight);
    const nb=document.getElementById('nightBtn');
    if(nb) nb.textContent=isNight?'☀️':'🌙';
}
document.getElementById('nightBtn').addEventListener('click',()=>{
    isNight=!isNight;
    localStorage.setItem('zoo_night', isNight?'1':'0');
    applyNight();
});

/* ── Draggable profile panel (position saved) ── */
const profilePanel=document.getElementById('profile-panel');
let panelPos={x:0,y:0};
try{ panelPos=JSON.parse(localStorage.getItem('zoo_panel_pos'))||panelPos; }catch(e){}
profilePanel.style.transform=`translate3d(${panelPos.x}px,${panelPos.y}px,0)`;
let dragState=null;
profilePanel.addEventListener('pointerdown',e=>{
    if(e.target.closest('button')) return;
    if(e.target.closest('#minimizeBtn')||e.target.closest('#miniState')) return;
    dragState={sx:e.clientX,sy:e.clientY,ox:panelPos.x,oy:panelPos.y};
    profilePanel.classList.add('dragging');
    profilePanel.setPointerCapture(e.pointerId);
});
profilePanel.addEventListener('pointermove',e=>{
    if(!dragState) return;
    panelPos.x=dragState.ox+e.clientX-dragState.sx;
    panelPos.y=dragState.oy+e.clientY-dragState.sy;
    profilePanel.style.transform=`translate3d(${panelPos.x}px,${panelPos.y}px,0)`;
});
function endDrag(){
    if(!dragState) return;
    dragState=null;
    profilePanel.classList.remove('dragging');
    localStorage.setItem('zoo_panel_pos',JSON.stringify(panelPos));
}
profilePanel.addEventListener('pointerup',endDrag);
profilePanel.addEventListener('pointercancel',endDrag);
profilePanel.addEventListener('dblclick',()=>{
    panelPos={x:0,y:0};
    profilePanel.style.transform='translate3d(0,0,0)';
    localStorage.setItem('zoo_panel_pos',JSON.stringify(panelPos));
});

/* ── Keyboard shortcuts: ←/→ switch animal, M to mute ── */
document.addEventListener('keydown', e => {
    const t=e.target;
    if(t && typeof t.matches==='function' && t.matches('input,textarea')) return;
    if(e.key==='ArrowLeft') shiftEntity(-1);
    else if(e.key==='ArrowRight') shiftEntity(1);
    else if(e.key==='m'||e.key==='M') toggleMute();
});

buildSourcePanel();
updateMuteBtn();
applyI18n();
applyNight();
initEcosystem();
