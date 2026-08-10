/* ═══════════════════════════════════════════
   VideoSlim — Pemampat Video Dalam Pelayar
   Client-side video compression via FFmpeg.wasm
   (single-thread core → works on GitHub Pages,
   no SharedArrayBuffer / COOP / COEP needed).
═══════════════════════════════════════════ */

/* ────────────────────────────────────────
   CONSTANTS
──────────────────────────────────────── */
const FFMPEG_WRAPPER = './vendor/ffmpeg/index.js';
const FFMPEG_UTIL    = './vendor/util/index.js';
const FFMPEG_CORE    = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm';

const PRESETS = { ultra:{crf:18}, high:{crf:23}, medium:{crf:28}, low:{crf:32} };
const CRF_BR = [[18,9000],[20,6500],[23,4500],[25,3400],[28,2500],[30,1900],[32,1400],[35,1000],[38,750],[42,550],[45,420]];

const state = {
    file:null,
    videoUrl:null,
    resultUrl:null,
    resultBlob:null,
    resultName:'',
    duration:0,
    width:0,
    height:0,
    hasMeta:false,
    ffmpeg:null,
    busy:false,
    cancel:false,
};

const $ = (id) => document.getElementById(id);

/* ────────────────────────────────────────
   I18N — Bahasa Melayu / English / 中文 / தமிழ்
──────────────────────────────────────── */
const LANGS = [ {code:'ms',label:'BM'}, {code:'en',label:'EN'}, {code:'zh',label:'中文'}, {code:'ta',label:'தமிழ்'} ];

const I18N = {
    ms: {
        brandSub:'Pemampat Video Dalam Pelayar', privacy:'🔒 100% Setempat', langTitle:'Bahasa', theme:'Gelap/Terang', portal:'Portal Demo',
        dropTitle:'Mampat Video Anda, Terus Dalam Pelayar',
        dropSub:'Tiada muat naik, tiada pelayan, tiada had. Video anda tidak pernah meninggalkan peranti anda.',
        browse:'Seret & lepas video di sini', dropHint:'atau klik untuk pilih fail', chooseBtn:'Pilih Video',
        supported:'Sokongan: MP4 · WebM · MOV · AVI · MKV · M4V · MPEG · 3GP dan banyak lagi',
        f1t:'Mampat Kecil', f1d:'Kurangkan saiz fail sehingga 90%',
        f2t:'Potong & Edit', f2d:'Trim, ubah saiz, kelajuan & FPS',
        f3t:'Audio Pintar', f3d:'Ekstrak MP3 atau buang audio',
        f4t:'Privasi Dijaga', f4d:'Pemprosesan 100% setempat',
        fileInfo:'Maklumat Fail', resetBtn:'↺ Ganti Video', name:'Nama', size:'Saiz', resolution:'Resolusi', duration:'Tempoh',
        settingsTitle:'Tetapan', preset:'Preset Kualiti',
        pUltra:'Ultra — Kualiti Tertinggi', pHigh:'High — Seimbang (Disyorkan)', pMedium:'Medium — Saiz Kecil', pLow:'Low — Saiz Paling Kecil', pCustom:'Custom — Manual',
        crf:'CRF (Kualiti Video)', crfHigh:'Kualiti Tinggi', crfLow:'Fail Kecil',
        rOriginal:'Asal', fps:'Frame Rate (FPS)', fpsSame:'Sama seperti asal', speed:'Kelajuan',
        trim:'Potong Masa', trimStart:'Mula', trimEnd:'Tamat',
        audio:'Audio', aKeep:'Kekal', aMute:'Buang Audio', aExtract:'Ekstrak MP3',
        audioBitrate:'Kualiti Audio (Bitrate)', abr128:'128 kbps — Tinggi', abr96:'96 kbps — Seimbang', abr64:'64 kbps — Sederhana', abr32:'32 kbps — Kecil',
        formatOut:'Format Output', estimate:'Anggaran saiz output', runBtn:'▶ Mampat Video', cancelBtn:'■ Batal',
        processing:'Sedang memproses…', resultTitle:'Hasil Sedia ✓', before:'Sebelum', after:'Selepas', saved:'Jimat',
        download:'⬇ Muat Turun', againBtn:'↺ Mampat Video Lain',
        noteLocal:'⚙️ Enjin FFmpeg dimuat dari CDN (sekali sahaja, kemudian dicache). Fail anda diproses sepenuhnya di dalam pelayar anda.',
        noteMemory:'💡 Petua: fail bersaiz besar (>300MB) memerlukan lebih memori — cuba fail yang lebih kecil dahulu.',
        footText:'Alat pemampat video percuma — dibina dengan FFmpeg.wasm, berjalan sepenuhnya dalam pelayar anda.', backPortal:'← Kembali ke Portal Demo',
        loadingEngine:'Memuatkan enjin FFmpeg… (20–30MB, sekali sahaja)',
        preparing:'Menyediakan fail…', statusDone:'Selesai!', statusCancelled:'Dibatalkan.', statusError:'Ralat berlaku.',
        errNoFile:'Tiada fail dipilih.', errFileType:'Format video tidak disokong.', errCancel:'Operasi dibatalkan.',
        fileRead:'Membaca fail…', min:'min', max:'maks',
        fullDur:'Tempoh penuh', fpsSource:'FPS sumber:',
        savedPct:'dijimatkan', loadHint:'Memuatkan enjin buat kali pertama mungkin mengambil masa beberapa saat.',
    },
    en: {
        brandSub:'In-browser Video Compressor', privacy:'🔒 100% Local', langTitle:'Language', theme:'Dark/Light', portal:'Demo Portal',
        dropTitle:'Compress Your Video, Right in the Browser',
        dropSub:'No uploads, no servers, no limits. Your video never leaves your device.',
        browse:'Drag & drop a video here', dropHint:'or click to choose a file', chooseBtn:'Choose Video',
        supported:'Support: MP4 · WebM · MOV · AVI · MKV · M4V · MPEG · 3GP and more',
        f1t:'Smaller Files', f1d:'Shrink file size by up to 90%',
        f2t:'Trim & Edit', f2d:'Trim, resize, speed & FPS',
        f3t:'Smart Audio', f3d:'Extract MP3 or remove audio',
        f4t:'Privacy First', f4d:'100% on-device processing',
        fileInfo:'File Info', resetBtn:'↺ Change Video', name:'Name', size:'Size', resolution:'Resolution', duration:'Duration',
        settingsTitle:'Settings', preset:'Quality Preset',
        pUltra:'Ultra — Highest Quality', pHigh:'High — Balanced (Recommended)', pMedium:'Medium — Smaller Size', pLow:'Low — Smallest Size', pCustom:'Custom — Manual',
        crf:'CRF (Video Quality)', crfHigh:'High Quality', crfLow:'Small File',
        rOriginal:'Original', fps:'Frame Rate (FPS)', fpsSame:'Same as source', speed:'Speed',
        trim:'Trim', trimStart:'Start', trimEnd:'End',
        audio:'Audio', aKeep:'Keep', aMute:'Remove Audio', aExtract:'Extract MP3',
        audioBitrate:'Audio Quality (Bitrate)', abr128:'128 kbps — High', abr96:'96 kbps — Balanced', abr64:'64 kbps — Medium', abr32:'32 kbps — Small',
        formatOut:'Output Format', estimate:'Estimated output size', runBtn:'▶ Compress Video', cancelBtn:'■ Cancel',
        processing:'Processing…', resultTitle:'Result Ready ✓', before:'Before', after:'After', saved:'Saved',
        download:'⬇ Download', againBtn:'↺ Compress Another Video',
        noteLocal:'⚙️ FFmpeg engine loads from a CDN (once, then cached). Your file is processed entirely inside your browser.',
        noteMemory:'💡 Tip: large files (>300MB) need more memory — try a smaller file first.',
        footText:'Free video compressor — built with FFmpeg.wasm, runs entirely in your browser.', backPortal:'← Back to Demo Portal',
        loadingEngine:'Loading FFmpeg engine… (20–30MB, one time only)',
        preparing:'Preparing file…', statusDone:'Done!', statusCancelled:'Cancelled.', statusError:'An error occurred.',
        errNoFile:'No file selected.', errFileType:'Unsupported video format.', errCancel:'Operation cancelled.',
        fileRead:'Reading file…', min:'min', max:'max',
        fullDur:'Full duration', fpsSource:'Source FPS:',
        savedPct:'saved', loadHint:'First-time engine loading may take a few seconds.',
    },
    zh: {
        brandSub:'浏览器内视频压缩', privacy:'🔒 100% 本地处理', langTitle:'语言', theme:'深色/浅色', portal:'演示门户',
        dropTitle:'在浏览器中直接压缩视频',
        dropSub:'无需上传，无需服务器，无限制。您的视频永远不会离开您的设备。',
        browse:'将视频拖放到此处', dropHint:'或点击选择文件', chooseBtn:'选择视频',
        supported:'支持：MP4 · WebM · MOV · AVI · MKV · M4V · MPEG · 3GP 等',
        f1t:'更小文件', f1d:'文件大小最多可减少 90%',
        f2t:'剪辑与编辑', f2d:'裁剪、调整大小、速度与帧率',
        f3t:'智能音频', f3d:'提取 MP3 或移除音频',
        f4t:'保护隐私', f4d:'100% 本地处理',
        fileInfo:'文件信息', resetBtn:'↺ 更换视频', name:'名称', size:'大小', resolution:'分辨率', duration:'时长',
        settingsTitle:'设置', preset:'质量预设',
        pUltra:'超高品质', pHigh:'高 — 均衡（推荐）', pMedium:'中 — 较小文件', pLow:'低 — 最小文件', pCustom:'自定义',
        crf:'CRF（视频质量）', crfHigh:'高质量', crfLow:'小文件',
        rOriginal:'原始', fps:'帧率 (FPS)', fpsSame:'与源相同', speed:'速度',
        trim:'裁剪', trimStart:'开始', trimEnd:'结束',
        audio:'音频', aKeep:'保留', aMute:'移除音频', aExtract:'提取 MP3',
        audioBitrate:'音频质量（比特率）', abr128:'128 kbps — 高', abr96:'96 kbps — 均衡', abr64:'64 kbps — 中', abr32:'32 kbps — 小',
        formatOut:'输出格式', estimate:'预计输出大小', runBtn:'▶ 压缩视频', cancelBtn:'■ 取消',
        processing:'正在处理…', resultTitle:'结果就绪 ✓', before:'之前', after:'之后', saved:'节省',
        download:'⬇ 下载', againBtn:'↺ 压缩另一个视频',
        noteLocal:'⚙️ FFmpeg 引擎从 CDN 加载（仅一次，之后缓存）。您的文件完全在浏览器内处理。',
        noteMemory:'💡 提示：大文件（>300MB）需要更多内存——请先尝试较小的文件。',
        footText:'免费视频压缩工具 — 基于 FFmpeg.wasm，完全在浏览器中运行。', backPortal:'← 返回演示门户',
        loadingEngine:'正在加载 FFmpeg 引擎…（20–30MB，仅一次）',
        preparing:'正在准备文件…', statusDone:'完成！', statusCancelled:'已取消。', statusError:'发生错误。',
        errNoFile:'未选择文件。', errFileType:'不支持的视频格式。', errCancel:'操作已取消。',
        fileRead:'正在读取文件…', min:'分钟', max:'最大',
        fullDur:'完整时长', fpsSource:'源帧率：',
        savedPct:'节省', loadHint:'首次加载引擎可能需要几秒钟。',
    },
    ta: {
        brandSub:'உலாவியில் வீடியோ சுருக்கி', privacy:'🔒 100% உள்ளூர்', langTitle:'மொழி', theme:'இருள்/வெளிச்சம்', portal:'டெமோ போர்டல்',
        dropTitle:'உங்கள் வீடியோவை உலாவியிலேயே சுருக்கவும்',
        dropSub:'பதிவேற்றம் இல்லை, சேவையகம் இல்லை, வரம்பு இல்லை. உங்கள் வீடியோ உங்கள் சாதனத்தை விட்டு வெளியேறாது.',
        browse:'வீடியோவை இங்கே இழுத்து விடவும்', dropHint:'அல்லது கிளிக் செய்து கோப்பைத் தேர்ந்தெடுக்கவும்', chooseBtn:'வீடியோ தேர்வு',
        supported:'ஆதரவு: MP4 · WebM · MOV · AVI · MKV · M4V · MPEG · 3GP மேலும்',
        f1t:'சிறிய கோப்புகள்', f1d:'கோப்பு அளவை 90% வரை குறைக்கும்',
        f2t:'திருத்து', f2d:'வெட்டு, அளவு, வேகம் & FPS',
        f3t:'ஸ்மார்ட் ஆடியோ', f3d:'MP3 பிரித்தெடு அல்லது ஆடியோ நீக்கு',
        f4t:'தனியுரிமை', f4d:'100% சாதனத்தில் செயலாக்கம்',
        fileInfo:'கோப்பு தகவல்', resetBtn:'↺ வீடியோ மாற்று', name:'பெயர்', size:'அளவு', resolution:'தெளிவு', duration:'காலம்',
        settingsTitle:'அமைப்புகள்', preset:'தர முன்னமைவு',
        pUltra:'அல்ட்ரா — உயர் தரம்', pHigh:'உயர் — சமநிலை (பரிந்துரைக்கப்படுகிறது)', pMedium:'நடுத்தர — சிறிய அளவு', pLow:'குறைந்த — மிகச் சிறிய அளவு', pCustom:'தனிப்பயன்',
        crf:'CRF (வீடியோ தரம்)', crfHigh:'உயர் தரம்', crfLow:'சிறிய கோப்பு',
        rOriginal:'அசல்', fps:'பிரேம் வீதம் (FPS)', fpsSame:'மூலத்தைப் போலவே', speed:'வேகம்',
        trim:'வெட்டு', trimStart:'தொடக்கம்', trimEnd:'முடிவு',
        audio:'ஆடியோ', aKeep:'வைத்திரு', aMute:'ஆடியோ நீக்கு', aExtract:'MP3 பிரித்தெடு',
        audioBitrate:'ஆடியோ தரம் (பிட்ரேட்)', abr128:'128 kbps — உயர்', abr96:'96 kbps — சமநிலை', abr64:'64 kbps — நடுத்தர', abr32:'32 kbps — சிறிய',
        formatOut:'வெளியீட்டு வடிவம்', estimate:'மதிப்பிடப்பட்ட அளவு', runBtn:'▶ வீடியோ சுருக்கு', cancelBtn:'■ ரத்து',
        processing:'செயலாக்குகிறது…', resultTitle:'முடிவு தயார் ✓', before:'முன்', after:'பின்', saved:'சேமிப்பு',
        download:'⬇ பதிவிறக்கு', againBtn:'↺ மற்றொரு வீடியோ',
        noteLocal:'⚙️ FFmpeg இயந்திரம் CDN-இல் இருந்து ஏற்றப்படுகிறது (ஒருமுறை, பின்னர் கேச்). உங்கள் கோப்பு உலாவியில் முழுமையாக செயலாக்கப்படுகிறது.',
        noteMemory:'💡 உதவிக்குறிப்பு: பெரிய கோப்புகள் (>300MB) அதிக நினைவகம் தேவை — முதலில் சிறிய கோப்பை முயற்சிக்கவும்.',
        footText:'இலவச வீடியோ சுருக்கி — FFmpeg.wasm மூலம் உருவாக்கப்பட்டது, உலாவியிலேயே இயங்குகிறது.', backPortal:'← டெமோ போர்டலுக்குத் திரும்பு',
        loadingEngine:'FFmpeg இயந்திரம் ஏற்றுகிறது… (20–30MB, ஒருமுறை மட்டும்)',
        preparing:'கோப்பு தயாராகிறது…', statusDone:'முடிந்தது!', statusCancelled:'ரத்து செய்யப்பட்டது.', statusError:'பிழை ஏற்பட்டது.',
        errNoFile:'கோப்பு தேர்ந்தெடுக்கப்படவில்லை.', errFileType:'ஆதரிக்கப்படாத வடிவம்.', errCancel:'செயல் ரத்து செய்யப்பட்டது.',
        fileRead:'கோப்பு படிக்கிறது…', min:'நிமிடம்', max:'அதிகபட்சம்',
        fullDur:'முழு காலம்', fpsSource:'மூல FPS:',
        savedPct:'சேமிப்பு', loadHint:'முதல் முறை இயந்திரம் ஏற்ற சில வினாடிகள் ஆகலாம்.',
    },
};

let lang = localStorage.getItem('vs_lang') || 'ms';

function t(key){ return (I18N[lang] && I18N[lang][key]) || I18N.ms[key] || key; }

function applyLang(){
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
    $('langBtn').textContent = LANGS.find(l => l.code === lang).label;
    updateEstimate();
}
$('langBtn').addEventListener('click', () => {
    const idx = LANGS.findIndex(l => l.code === lang);
    lang = LANGS[(idx + 1) % LANGS.length].code;
    localStorage.setItem('vs_lang', lang);
    applyLang();
});

/* ────────────────────────────────────────
   THEME
──────────────────────────────────────── */
const theme = localStorage.getItem('vs_theme') || 'dark';
document.documentElement.setAttribute('data-theme', theme);
$('themeBtn').textContent = theme === 'dark' ? '🌙' : '☀️';
$('themeBtn').addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('vs_theme', next);
    $('themeBtn').textContent = next === 'dark' ? '🌙' : '☀️';
});

/* ────────────────────────────────────────
   HELPERS
──────────────────────────────────────── */
function fmtBytes(bytes){
    if (!isFinite(bytes) || bytes < 0) return '—';
    if (bytes < 1024) return bytes + ' B';
    const units = ['KB','MB','GB'];
    let v = bytes;
    let i = -1;
    do { v /= 1024; i++; } while (v >= 1024 && i < units.length - 1);
    return v.toFixed(v >= 100 ? 0 : 1) + ' ' + units[i];
}
function fmtTime(sec){
    if (!isFinite(sec) || sec < 0) sec = 0;
    const s = Math.round(sec);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const r = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}`;
    return `${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}`;
}
function toast(msg, isErr){
    let el = document.querySelector('.toast');
    if (!el){ el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.toggle('err', !!isErr);
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 3200);
}
function crfToBitrate(crf, w, h, fps){
    const pixels = (w||1280) * (h||720);
    let base = CRF_BR[0][1];
    for (let i = 0; i < CRF_BR.length - 1; i++){
        if (crf <= CRF_BR[i+1][0]){ base = CRF_BR[i][1]; break; }
        base = CRF_BR[i+1][1];
    }
    const scale = pixels / (1280*720);
    const fpsF = Math.max(1, (fps||30)) / 30;
    return base * scale * fpsF;
}
function scaleTarget(h){
    if (!state.hasMeta || !h || h >= state.height) return null;
    const w = Math.round((state.width * h) / state.height);
    return { w: w - (w % 2), h: h - (h % 2) };
}
function atempoChain(speed){
    const parts = [];
    let s = speed;
    while (s > 2){ parts.push('atempo=2'); s /= 2; }
    while (s < 0.5){ parts.push('atempo=0.5'); s /= 0.5; }
    if (Math.abs(s - 1) > 0.001) parts.push('atempo=' + s.toFixed(4));
    return parts.length ? parts.join(',') : null;
}

/* ────────────────────────────────────────
   UPLOAD
──────────────────────────────────────── */
const dropZone = $('dropZone');
const fileInput = $('fileInput');

const VIDEO_RE = /\.(mp4|webm|mov|avi|mkv|m4v|mpeg|mpg|ts|flv|wmv|3gp|ogv|mpv|m2ts|mts|divx)$/i;

dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); fileInput.click(); } });
fileInput.addEventListener('change', () => { if (fileInput.files && fileInput.files[0]) handleFile(fileInput.files[0]); });
dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
});

function loadMeta(){
    return new Promise((resolve) => {
        const v = document.createElement('video');
        v.preload = 'metadata';
        v.muted = true;
        v.onloadedmetadata = () => {
            state.duration = isFinite(v.duration) ? v.duration : 0;
            state.width = v.videoWidth || 0;
            state.height = v.videoHeight || 0;
            state.hasMeta = state.width > 0 && state.height > 0;
            resolve();
        };
        v.onerror = () => { state.hasMeta = false; resolve(); };
        v.src = state.videoUrl;
    });
}

async function handleFile(file){
    if (!VIDEO_RE.test(file.name)){
        toast(t('errFileType'), true);
        return;
    }
    if (state.busy){ toast(t('errCancel'), true); return; }

    if (state.videoUrl) URL.revokeObjectURL(state.videoUrl);
    if (state.resultUrl) URL.revokeObjectURL(state.resultUrl);
    state.file = file;
    state.resultUrl = null;
    state.resultBlob = null;
    state.videoUrl = URL.createObjectURL(file);
    state.duration = 0; state.width = 0; state.height = 0; state.hasMeta = false;

    await loadMeta();

    $('metaName').textContent = file.name;
    $('metaSize').textContent = fmtBytes(file.size);
    $('metaRes').textContent = state.hasMeta ? `${state.width} × ${state.height}` : '—';
    $('metaDur').textContent = state.hasMeta ? fmtTime(state.duration) : '—';
    $('previewVideo').src = state.videoUrl;
    $('previewVideo').load();

    setupTrim();
    resetResult();
    showStep('editor');
    updateEstimate();
}

/* ────────────────────────────────────────
   TRIM SLIDERS
──────────────────────────────────────── */
const trimStart = $('trimStart'), trimEnd = $('trimEnd');
function setupTrim(){
    const row = $('trimRow');
    if (!state.hasMeta || state.duration <= 1){
        row.hidden = true;
        return;
    }
    row.hidden = false;
    const max = Math.floor(state.duration);
    trimStart.min = 0; trimStart.max = max; trimStart.value = 0;
    trimEnd.min = 0; trimEnd.max = max; trimEnd.value = max;
    $('trimStartVal').textContent = fmtTime(0);
    $('trimEndVal').textContent = fmtTime(state.duration);
}
function onTrimInput(){
    let s = parseFloat(trimStart.value), e = parseFloat(trimEnd.value);
    const max = parseFloat(trimEnd.max);
    if (e - s < 1){ (this === trimStart) ? (s = Math.max(0, e - 1)) : (e = Math.min(max, s + 1)); }
    trimStart.value = s; trimEnd.value = e;
    $('trimStartVal').textContent = fmtTime(s);
    $('trimEndVal').textContent = fmtTime(e);
    updateEstimate();
}
trimStart.addEventListener('input', onTrimInput);
trimEnd.addEventListener('input', onTrimInput);

/* ────────────────────────────────────────
   CONTROLS
──────────────────────────────────────── */
const presetSelect = $('presetSelect'), crfSlider = $('crfSlider'), crfVal = $('crfVal');
presetSelect.addEventListener('change', () => {
    $('crfRow').hidden = presetSelect.value !== 'custom';
    crfSlider.value = PRESETS[presetSelect.value] ? PRESETS[presetSelect.value].crf : crfSlider.value;
    crfVal.textContent = crfSlider.value;
    updateEstimate();
});
crfSlider.addEventListener('input', () => { crfVal.textContent = crfSlider.value; updateEstimate(); });

['resSelect','fpsSelect','speedSelect','abrSelect'].forEach(id => $(id).addEventListener('change', updateEstimate));

const audioModes = document.querySelectorAll('input[name=audioMode]');
audioModes.forEach(r => r.addEventListener('change', () => {
    const isExtract = document.querySelector('input[name=audioMode]:checked').value === 'extract';
    $('abrRow').hidden = isExtract;
    $('fmtRow').hidden = isExtract;
    updateEstimate();
}));
document.querySelectorAll('input[name=formatSel]').forEach(r => r.addEventListener('change', updateEstimate));

function readSettings(){
    const s = {};
    s.preset = presetSelect.value;
    s.crf = s.preset === 'custom' ? +crfSlider.value : PRESETS[s.preset].crf;
    s.resH = +$('resSelect').value;
    s.fps = +$('fpsSelect').value;
    s.speed = +$('speedSelect').value;
    s.audioMode = document.querySelector('input[name=audioMode]:checked').value;
    s.audioBitrate = +$('abrSelect').value;
    s.format = document.querySelector('input[name=formatSel]:checked').value;
    s.trimStart = state.hasMeta ? +trimStart.value : 0;
    s.trimEnd = state.hasMeta ? +trimEnd.value : (state.duration || 0);
    return s;
}

function updateEstimate(){
    if (!state.file){ $('estimateVal').textContent = '—'; return; }
    const s = readSettings();
    const scale = scaleTarget(s.resH);
    const w = scale ? scale.w : state.width || 1280;
    const h = scale ? scale.h : state.height || 720;
    const dur = Math.max(1, (s.trimEnd - s.trimStart) / s.speed);
    const vBit = crfToBitrate(s.crf, w, h, s.fps);
    const aBit = (s.audioMode === 'keep' && s.format !== 'extract') ? s.audioBitrate : 0;
    const bytes = ((vBit + aBit) * 1000 * dur) / 8;
    $('estimateVal').textContent = '≈ ' + fmtBytes(bytes);
}

/* ────────────────────────────────────────
   FFMPEG
──────────────────────────────────────── */
const logBox = $('logBox');
function log(msg){ logBox.textContent += msg + '\n'; logBox.scrollTop = logBox.scrollHeight; }
function clearLog(){ logBox.textContent = ''; }

let fetchFileRef = null;

async function getFFmpeg(){
    if (state.ffmpeg && state.ffmpeg.loaded) return state.ffmpeg;
    setProgressLabel(t('loadingEngine'));
    const { FFmpeg } = await import(FFMPEG_WRAPPER);
    const util = await import(FFMPEG_UTIL);
    fetchFileRef = util.fetchFile;
    const { toBlobURL } = util;
    const ffmpeg = new FFmpeg();
    ffmpeg.on('log', ({ message }) => { if (message && message.trim()) log(message); });
    ffmpeg.on('progress', ({ progress }) => {
        if (state.cancel) return;
        const p = Math.max(0, Math.min(1, progress));
        setProgress(p);
    });
    await ffmpeg.load({
        coreURL: await toBlobURL(`${FFMPEG_CORE}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${FFMPEG_CORE}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    state.ffmpeg = ffmpeg;
    return ffmpeg;
}

function buildArgs(inName, outName, ext, s){
    const args = ['-y'];

    if (s.trimStart > 0) args.push('-ss', s.trimStart.toFixed(3));
    if (s.trimEnd > 0 && s.trimEnd < state.duration - 0.5 && s.trimStart > 0) args.push('-to', (s.trimEnd - s.trimStart).toFixed(3));
    else if (s.trimEnd > 0 && s.trimEnd < state.duration - 0.5) args.push('-to', s.trimEnd.toFixed(3));

    args.push('-i', inName);

    const vf = [];
    const scale = scaleTarget(s.resH);
    if (scale) vf.push(`scale=${scale.w}:${scale.h}`);
    if (s.fps > 0 && s.fps < 60) vf.push(`fps=${s.fps}`);
    if (s.speed !== 1) vf.push(`setpts=PTS*${(1 / s.speed).toFixed(6)}`);
    if (vf.length) args.push('-vf', vf.join(','));

    if (s.audioMode === 'mute'){
        args.push('-an');
    } else if (s.audioMode === 'extract'){
        args.push('-vn', '-c:a', 'libmp3lame', '-q:a', '2', '-map', '0:a?');
    } else {
        if (s.speed !== 1){
            const at = atempoChain(s.speed);
            if (at) args.push('-af', at);
        }
        if (ext === 'mp4') args.push('-c:a', 'aac', '-b:a', String(s.audioBitrate) + 'k');
        else if (ext === 'webm') args.push('-c:a', 'libopus', '-b:a', String(s.audioBitrate) + 'k');
    }

    if (ext === 'mp4'){
        args.push('-c:v', 'libx264', '-preset', 'veryfast', '-crf', String(s.crf), '-pix_fmt', 'yuv420p', '-movflags', '+faststart');
    } else if (ext === 'webm'){
        args.push('-c:v', 'libvpx-vp9', '-crf', String(s.crf), '-b:v', '0', '-pix_fmt', 'yuv420p');
    }
    args.push(outName);
    return args;
}

/* ────────────────────────────────────────
   RUN
──────────────────────────────────────── */
const progressPanel = $('progressPanel'), progressFill = $('progressFill');
const progressLabel = $('progressLabel'), progressPct = $('progressPct');
const resultPanel = $('resultPanel');

function setProgressLabel(text){ progressLabel.textContent = text; }
function setProgress(p){
    progressFill.style.width = (p * 100).toFixed(1) + '%';
    progressPct.textContent = Math.round(p * 100) + '%';
}

async function run(){
    if (!state.file){ toast(t('errNoFile'), true); return; }
    if (state.busy) return;
    state.busy = true;
    state.cancel = false;

    $('runBtn').disabled = true;
    $('cancelBtn').hidden = false;
    $('resetBtn').disabled = true;
    clearLog();
    log(t('fileRead'));
    resultPanel.hidden = true;
    progressPanel.hidden = false;
    progressFill.style.width = '0%';
    progressPct.textContent = '0%';

    const s = readSettings();
    const isExtract = s.audioMode === 'extract';
    const ext = isExtract ? 'mp3' : s.format;
    const mime = ext === 'mp4' ? 'video/mp4' : ext === 'webm' ? 'video/webm' : 'audio/mpeg';
    const base = state.file.name.replace(/\.[^.]+$/, '').replace(/[^\w\-\u00C0-\uFFFF]+/g, '-') || 'video';
    state.resultName = `${base}_slim.${ext}`;

    try {
        const ffmpeg = await getFFmpeg();
        if (state.cancel) throw new Error(t('errCancel'));

        setProgressLabel(t('preparing'));
        const inName = 'input' + (state.file.name.match(/\.[^.]{1,10}$/) || ['.mp4'])[0].toLowerCase();
        const outName = 'output.' + ext;
        await ffmpeg.writeFile(inName, await fetchFileRef(state.file));

        const args = buildArgs(inName, outName, ext, s);
        log('$ ffmpeg ' + args.join(' '));
        setProgressLabel(t('processing'));
        const ret = await ffmpeg.exec(args);
        if (state.cancel) throw new Error(t('errCancel'));
        if (ret !== 0) throw new Error('ffmpeg exit code: ' + ret);

        setProgressLabel(t('fileRead'));
        const data = await ffmpeg.readFile(outName);
        if (!data) throw new Error('Output file not found');

        const blob = new Blob([data], { type: mime });
        if (state.resultUrl) URL.revokeObjectURL(state.resultUrl);
        state.resultBlob = blob;
        state.resultUrl = URL.createObjectURL(blob);

        try { await ffmpeg.deleteFile(inName); } catch(_) {}
        try { await ffmpeg.deleteFile(outName); } catch(_) {}

        showResult(blob, state.file.size);
        setProgress(1);
        setProgressLabel(t('statusDone'));
    } catch (err){
        if (state.cancel){
            setProgressLabel(t('statusCancelled'));
            log(t('statusCancelled'));
        } else {
            setProgressLabel(t('statusError'));
            log('✖ ' + (err && err.message ? err.message : String(err)));
            toast(t('statusError'), true);
        }
    } finally {
        state.busy = false;
        $('runBtn').disabled = false;
        $('cancelBtn').hidden = true;
        $('resetBtn').disabled = false;
        progressFill.style.width = state.cancel ? '0%' : progressFill.style.width;
    }
}
$('runBtn').addEventListener('click', run);

$('cancelBtn').addEventListener('click', () => {
    state.cancel = true;
    if (state.ffmpeg){ try { state.ffmpeg.terminate(); } catch(_){} state.ffmpeg = null; }
    setProgressLabel(t('statusCancelled'));
    log(t('statusCancelled'));
});

function showResult(blob, origSize){
    $('resultVideo').src = state.resultUrl;
    $('resultVideo').load();
    $('downloadBtn').href = state.resultUrl;
    $('downloadBtn').download = state.resultName;

    $('cmpBefore').textContent = fmtBytes(origSize);
    $('cmpAfter').textContent = fmtBytes(blob.size);
    const saved = origSize - blob.size;
    const pct = origSize > 0 ? Math.round((saved / origSize) * 100) : 0;
    $('cmpSaved').textContent = pct >= 0 ? `${pct}%` : '—';
    resultPanel.hidden = false;
    resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function resetResult(){
    resultPanel.hidden = true;
    progressPanel.hidden = true;
    progressFill.style.width = '0%';
    progressPct.textContent = '0%';
}

function resetAll(){
    if (state.busy) return;
    if (state.videoUrl){ URL.revokeObjectURL(state.videoUrl); state.videoUrl = null; }
    if (state.resultUrl){ URL.revokeObjectURL(state.resultUrl); state.resultUrl = null; }
    state.file = null; state.resultBlob = null;
    state.duration = 0; state.width = 0; state.height = 0; state.hasMeta = false;
    fileInput.value = '';
    resetResult();
    showStep('upload');
    logBox.textContent = '';
}
$('resetBtn').addEventListener('click', resetAll);
$('againBtn').addEventListener('click', resetAll);

function showStep(step){
    $('uploadStep').hidden = step !== 'upload';
    $('editorStep').hidden = step !== 'editor';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

applyLang();
