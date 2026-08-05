"use client";

import { useState, useRef, useEffect } from "react";
import mammoth from "mammoth";

const LOGO_SRC = "data:image/png;base64,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AckuWACIiIqIBYDsggWAiKiIuBYA2QV/E4mIiohXAMguWACIiIpI4qZAZBP8LSQiKjIXrwKQDbAAEBEVGW8DkB2wABARFRkLANkBCwARUZGxAJAdsAAQERUZJwGSHfC3kIioyLgWANkBfwuJiIqMtwDIDlgAiIgE4G0AEo2/gUREAnAtABKNBYCISABeASDR+BtIRCQA5wGQaCwAREQCyJIkOgKVORYAIiIBZF4BIMFcogOQeT09PWhuaUFXdzeGIhHRcYgoC7phIJ1O53282+1GKBTCtGnTMHfuXHg8HgvTUTlgAXCwSCSCB37/e+zYuROGYYiOQ0SCBAIBXHTRRTjrrLMg8dYCZYkFwKFOnjyJf/nXf8XAwIDoKEQkWDwex5NPPokjR47g2muv5QRDygrnADjQcCyGf7vrLn74E9H7tLe34+mnnxYdgxyCBcCB/vj44+jt7RUdg4hsaOvWrThx4oToGOQALAAOk0wmsWXLFtExiMimDMPAq6++KjoGOQALgMMcPHgQmUxGdAwisrGDBw+KjkAOwALgMD09PaIjEJHNxWIxpFIp0THI5lgAHEbn435ElAU+GkzjYQFwmJqaGtERiMjmvF4vfD6f6BhkcywADjNv3jw+40tEY5ozZ47oCOQALAAOEwoGsXrVKtExiMjG1q5dKzoCOQALgAP9zZVXIhQMio5BRDa0ePFizJo1S3QMcgAWAAeqra3F/7rpJt7jI6L3aWpqwlVXXSU6BjkEC4BDzZs3D7fdcgvOmDlTdBQiEkyWZZx99tn48pe/DK/XKzoOOQQ3A3KwxsZG3Hbrrdi/fz/2tLSgq6sL0aEh0bGIKAcZVc3rOJfL9e52wEuXLkV1dbXFyajUsQA4nCRJWLBgARYsWCA6ChHloYuLe5EgvAVARCSQLEmiI1CZYgEgIhJIkvk2TGLwN4+ISCCJVwBIEBYAIiKBeAuARGEBICISiQWABGEBICISiB//JAoLABGRQJwDQKKwABARCcQCQKKwABARicQCQIKwABARCcSPfxKFBYCISCDeAiBRWACIiARiASBRWACIiARiASBRWACIiATixz+JwgJARCSQIToAlS0WACIigXgLgERhASAiIipDLABERERliAWAiEgg3gIgUVgAiIiIyhALABERURliASAiIipDLABERERliAWAiIioDLEAEBEJZBhcC5DE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";
import {
  Plus, Trash2, Download, Mail, Phone, MapPin, Link as LinkIcon,
  Palette, LayoutGrid, Upload, Image as ImageIcon, X, Globe,
  CheckCircle2, AlertTriangle, ClipboardPaste, FileText, Save, FolderOpen,
  Info, ChevronLeft, ChevronRight, Sparkles, RotateCcw, Heart, ArrowLeft,
} from "lucide-react";

/* ================= i18n ================= */
const LANGS = [
  { id: "ms", label: "BM" },
  { id: "en", label: "EN" },
  { id: "zh", label: "中文" },
  { id: "ta", label: "தமிழ்" },
];

const STRINGS = {
  appTitle: { ms: "Dear Resume", en: "Dear Resume", zh: "Dear Resume", ta: "Dear Resume" },
  backToPortal: { ms: "Portal Demo", en: "Demo Portal", zh: "演示门户", ta: "டெமோ போர்டல்" },
  donateBtn: { ms: "Sumbang", en: "Donate", zh: "捐赠", ta: "நன்கொடை" },
  donateTitle: { ms: "Sumbang", en: "Donate", zh: "捐赠", ta: "நன்கொடை" },
  donateBody: {
    ms: "Setiap sumbangan, walau sekecil mana pun, membantu projek ini terus hidup dan kekal percuma untuk semua.",
    en: "Every contribution, no matter how small, helps keep this project alive and free for everyone.",
    zh: "无论金额大小，每一笔捐赠都能帮助这个项目持续运行，并免费提供给所有人。",
    ta: "எவ்வளவு சிறியதாக இருந்தாலும், ஒவ்வொரு நன்கொடையும் இந்தத் திட்டத்தை உயிருடன் வைத்து அனைவருக்கும் இலவசமாக வைக்கிறது.",
  },
  donateDownload: { ms: "Muat Turun QR", en: "Download QR", zh: "下载二维码", ta: "QR பதிவிறக்கு" },
  donateHint: {
    ms: "Setiap sumbangan membantu projek ini terus hidup.",
    en: "Every contribution keeps this project alive.",
    zh: "每一笔捐款都能让这个项目持续运转。",
    ta: "ஒவ்வொரு நன்கொடையும் இந்தத் திட்டத்தை உயிருடன் வைக்கிறது.",
  },
  closeLabel: { ms: "Tutup", en: "Close", zh: "关闭", ta: "மூடு" },
  appSubtitle: {
    ms: "Kerana resume yang power buka lebih banyak pintu.",
    en: "Because a resume that shines opens more doors.",
    zh: "出色的简历，打开更多机会之门。",
    ta: "சிறந்த பயோடேட்டா, அதிக வாய்ப்புகளை திறக்கும்.",
  },
  saveAsPdf: { ms: "Simpan sebagai PDF", en: "Save as PDF", zh: "另存为PDF", ta: "PDF ஆக சேமிக்கவும்" },
  runAts: { ms: "Run ATS Checker", en: "Run ATS Checker", zh: "运行ATS检测", ta: "ATS சரிபார்ப்பு" },
  editTab: { ms: "Edit", en: "Edit", zh: "编辑", ta: "திருத்து" },
  previewTab: { ms: "Preview", en: "Preview", zh: "预览", ta: "முன்னோட்டம்" },
  layoutHeading: { ms: "Layout", en: "Layout", zh: "布局", ta: "தளவமைப்பு" },
  themeHeading: { ms: "Tema warna", en: "Color theme", zh: "配色主题", ta: "வண்ண தீம்" },
  combinations: { ms: "kombinasi", en: "combinations", zh: "种组合", ta: "சேர்க்கைகள்" },
  loadExample: { ms: "Load contoh", en: "Load example", zh: "加载示例", ta: "எடுத்துக்காட்டு" },
  clearAll: { ms: "Kosongkan semua", en: "Clear all", zh: "清空全部", ta: "அனைத்தையும் அழி" },
  exportData: { ms: "Export data", en: "Export data", zh: "导出数据", ta: "தரவை ஏற்றுமதி" },
  importData: { ms: "Import data", en: "Import data", zh: "导入数据", ta: "தரவை இறக்குமதி" },
  importResume: { ms: "Upload resume lama untuk auto-isi", en: "Upload old resume to auto-fill", zh: "上传旧简历自动填写", ta: "பழைய பயோடேட்டாவை பதிவேற்றவும்" },
  uploadFile: { ms: "Upload fail (.docx / .txt)", en: "Upload file (.docx / .txt)", zh: "上传文件 (.docx / .txt)", ta: "கோப்பை பதிவேற்று (.docx / .txt)" },
  orPasteText: { ms: "atau paste text resume (untuk PDF)", en: "or paste resume text (for PDF)", zh: "或粘贴简历文本（适用于PDF）", ta: "அல்லது உரையை ஒட்டவும்" },
  uploadTab: { ms: "Upload Fail", en: "Upload File", zh: "上传文件", ta: "கோப்பு பதிவேற்று" },
  pasteTab: { ms: "Paste Text", en: "Paste Text", zh: "粘贴文本", ta: "உரையை ஒட்டு" },
  quickActions: { ms: "Tindakan Pantas", en: "Quick Actions", zh: "快速操作", ta: "விரைவு செயல்கள்" },
  pasteHere: { ms: "Paste text resume di sini...", en: "Paste resume text here...", zh: "在此粘贴简历文本...", ta: "இங்கே ஒட்டவும்..." },
  parseAndFill: { ms: "Parse & Isi Form", en: "Parse & Fill Form", zh: "解析并填写", ta: "பகுப்பாய்வு செய்" },
  parsing: { ms: "Sedang proses...", en: "Processing...", zh: "处理中...", ta: "செயலாக்கத்தில்..." },
  personalInfo: { ms: "Maklumat Peribadi", en: "Personal Info", zh: "个人信息", ta: "தனிப்பட்ட தகவல்" },
  photo: { ms: "Gambar (opsyenal)", en: "Photo (optional)", zh: "照片（可选）", ta: "புகைப்படம் (விருப்பம்)" },
  uploadPhoto: { ms: "Upload gambar", en: "Upload photo", zh: "上传照片", ta: "படத்தை பதிவேற்று" },
  removePhoto: { ms: "Buang gambar", en: "Remove photo", zh: "移除照片", ta: "படத்தை நீக்கு" },
  fullName: { ms: "Nama penuh", en: "Full name", zh: "姓名", ta: "முழு பெயர்" },
  jobTitle: { ms: "Jawatan/Title", en: "Title", zh: "职位", ta: "பதவி" },
  email: { ms: "Email", en: "Email", zh: "邮箱", ta: "மின்னஞ்சல்" },
  phone: { ms: "Telefon", en: "Phone", zh: "电话", ta: "தொலைபேசி" },
  location: { ms: "Lokasi", en: "Location", zh: "地点", ta: "இடம்" },
  linkedin: { ms: "LinkedIn/Website", en: "LinkedIn/Website", zh: "领英/网站", ta: "இணையதளம்" },
  portfolio: { ms: "Portfolio/GitHub", en: "Portfolio/GitHub", zh: "作品集/GitHub", ta: "போர்ட்ஃபோலியோ" },
  summary: { ms: "Ringkasan", en: "Summary", zh: "简介", ta: "சுருக்கம்" },
  experience: { ms: "Pengalaman Kerja", en: "Experience", zh: "工作经验", ta: "பணி அனுபவம்" },
  addExperience: { ms: "Tambah pengalaman", en: "Add experience", zh: "添加经历", ta: "அனுபவம் சேர்" },
  role: { ms: "Jawatan", en: "Role", zh: "职位", ta: "பதவி" },
  company: { ms: "Syarikat", en: "Company", zh: "公司", ta: "நிறுவனம்" },
  period: { ms: "Tempoh", en: "Period", zh: "时间段", ta: "காலம்" },
  highlights: { ms: "Highlights (satu per baris)", en: "Highlights (one per line)", zh: "亮点（每行一条）", ta: "சிறப்பம்சங்கள்" },
  education: { ms: "Pendidikan", en: "Education", zh: "教育背景", ta: "கல்வி" },
  addEducation: { ms: "Tambah pendidikan", en: "Add education", zh: "添加教育经历", ta: "கல்வி சேர்" },
  school: { ms: "Sekolah/Universiti", en: "School", zh: "学校", ta: "பள்ளி" },
  degree: { ms: "Ijazah", en: "Degree", zh: "学位", ta: "பட்டம்" },
  projects: { ms: "Projek", en: "Projects", zh: "项目", ta: "திட்டங்கள்" },
  addProject: { ms: "Tambah projek", en: "Add project", zh: "添加项目", ta: "திட்டம் சேர்" },
  projectName: { ms: "Nama projek", en: "Project name", zh: "项目名称", ta: "திட்டப் பெயர்" },
  tech: { ms: "Tech/Tools", en: "Tech/Tools", zh: "技术工具", ta: "தொழில்நுட்பம்" },
  description: { ms: "Deskripsi", en: "Description", zh: "描述", ta: "விவரம்" },
  certifications: { ms: "Sijil/Certifications", en: "Certifications", zh: "证书", ta: "சான்றிதழ்கள்" },
  addCertification: { ms: "Tambah sijil", en: "Add certification", zh: "添加证书", ta: "சான்றிதழ் சேர்" },
  certName: { ms: "Nama sijil", en: "Certification", zh: "证书名称", ta: "சான்றிதழ் பெயர்" },
  issuer: { ms: "Dikeluarkan oleh", en: "Issuer", zh: "颁发机构", ta: "வழங்கியவர்" },
  year: { ms: "Tahun", en: "Year", zh: "年份", ta: "ஆண்டு" },
  skills: { ms: "Kemahiran", en: "Skills", zh: "技能", ta: "திறமைகள்" },
  languages: { ms: "Bahasa", en: "Languages", zh: "语言", ta: "மொழிகள்" },
  awards: { ms: "Anugerah/Pencapaian", en: "Awards/Achievements", zh: "奖项/成就", ta: "விருதுகள்" },
  volunteering: { ms: "Kesukarelawanan", en: "Volunteering", zh: "志愿服务", ta: "தன்னார்வ சேவை" },
  addVolunteer: { ms: "Tambah kesukarelawanan", en: "Add volunteering", zh: "添加志愿经历", ta: "சேவை சேர்" },
  organization: { ms: "Organisasi", en: "Organization", zh: "组织", ta: "அமைப்பு" },
  hobbies: { ms: "Hobi/Minat", en: "Hobbies/Interests", zh: "兴趣爱好", ta: "பொழுதுபோக்கு" },
  interests: { ms: "Minat", en: "Interests", zh: "兴趣", ta: "ஆர்வங்கள்" },
  customSections: { ms: "Section Tambahan (custom)", en: "Custom Sections", zh: "自定义板块", ta: "தனிப்பயன் பிரிவுகள்" },
  addCustomSection: { ms: "Tambah section", en: "Add section", zh: "添加板块", ta: "பிரிவு சேர்" },
  sectionLabel: { ms: "Nama section (e.g. Publications)", en: "Section name (e.g. Publications)", zh: "板块名称", ta: "பிரிவு பெயர்" },
  sectionContent: { ms: "Kandungan", en: "Content", zh: "内容", ta: "உள்ளடக்கம்" },
  references: { ms: "Rujukan/References", en: "References", zh: "推荐人", ta: "பரிந்துரையாளர்" },
  includeReferences: { ms: "Masukkan section references", en: "Include references section", zh: "包含推荐人板块", ta: "பரிந்துரையை சேர்" },
  commaSeparated: { ms: "Pisahkan dengan koma", en: "Comma-separated", zh: "用逗号分隔", ta: "காற்புள்ளியால் பிரிக்கவும்" },
  oneperline: { ms: "Satu per baris", en: "One per line", zh: "每行一条", ta: "ஒரு வரிக்கு ஒன்று" },
  entryLabel: { ms: "ENTRI", en: "ENTRY", zh: "条目", ta: "உள்ளீடு" },
  atsScoreLabel: { ms: "skor ATS", en: "ATS score", zh: "ATS 分数", ta: "ATS மதிப்பெண்" },
  atsCheckContact: { ms: "Contact info lengkap (email & phone)", en: "Complete contact info (email & phone)", zh: "联系方式完整（邮箱和电话）", ta: "முழுமையான தொடர்பு தகவல்" },
  atsCheckSummary: { ms: "Summary panjang sesuai (15-60 patah perkataan)", en: "Summary is a good length (15-60 words)", zh: "简介长度适中（15-60字）", ta: "சுருக்கம் சரியான நீளத்தில்" },
  atsCheckExperience: { ms: "Ada experience dengan highlights", en: "Has experience with highlights", zh: "有带亮点的工作经验", ta: "சிறப்பம்சங்களுடன் அனுபவம்" },
  atsCheckMetrics: { ms: "Highlights ada angka/metric", en: "Highlights include numbers/metrics", zh: "亮点包含数字/指标", ta: "எண்களுடன் சிறப்பம்சங்கள்" },
  atsCheckVerbs: { ms: "Highlights guna action verb yang kuat", en: "Highlights use strong action verbs", zh: "亮点使用有力的动词", ta: "செயல் வினைச்சொற்கள் பயன்பாடு" },
  atsCheckSkills: { ms: "Senarai skills mencukupi (5+)", en: "Sufficient skills listed (5+)", zh: "技能列表充足（5个以上）", ta: "போதுமான திறமைகள் (5+)" },
  atsCheckEducation: { ms: "Ada maklumat education", en: "Has education info", zh: "有教育背景信息", ta: "கல்வி தகவல் உள்ளது" },
  atsCheckLayout: { ms: "Layout mesra ATS (single-column)", en: "ATS-friendly layout (single-column)", zh: "ATS友好布局（单栏）", ta: "ATS நட்பு தளவமைப்பு" },
  atsCheckPhoto: { ms: "Tiada gambar (sesetengah ATS tak proses gambar)", en: "No photo (some ATS can't process images)", zh: "无照片（部分ATS无法处理图片）", ta: "படம் இல்லை" },
  statusUnsupported: { ms: "Format tak disokong. Sila upload .docx / .txt, atau paste text (untuk PDF).", en: "Unsupported format. Please upload .docx / .txt, or paste text (for PDF).", zh: "不支持的格式。请上传.docx/.txt，或粘贴文本（适用于PDF）。", ta: "ஆதரிக்கப்படாத வடிவம். .docx / .txt பதிவேற்றவும்." },
  statusFileError: { ms: "Ralat baca fail: ", en: "Error reading file: ", zh: "读取文件出错：", ta: "கோப்பு பிழை: " },
  statusParseSuccess: { ms: "Auto-fill selesai (diproses 100% dalam browser). Sila semak & kemas kini manual kalau perlu.", en: "Auto-fill complete (100% processed in your browser). Please review & adjust manually if needed.", zh: "自动填写完成（100%在浏览器中处理）。请检查并根据需要手动调整。", ta: "தானியங்கி நிரப்பல் முடிந்தது. சரிபார்க்கவும்." },
  statusParseError: { ms: "Ralat semasa proses: ", en: "Error while processing: ", zh: "处理时出错：", ta: "செயலாக்க பிழை: " },
  statusImportSuccess: { ms: "Data berjaya di-import!", en: "Data imported successfully!", zh: "数据导入成功！", ta: "தரவு இறக்குமதி வெற்றி!" },
  statusImportError: { ms: "Ralat: fail JSON tak sah.", en: "Error: invalid JSON file.", zh: "错误：无效的JSON文件。", ta: "பிழை: தவறான JSON கோப்பு." },
  tooltipLayoutTheme: {
    ms: "Pilih struktur & warna resume kau. Classic, Compact dan Timeline lagi mesra ATS sebab single-column tanpa jadual/sidebar.",
    en: "Choose your resume's structure & color. Classic, Compact and Timeline are more ATS-friendly since they're single-column with no tables/sidebars.",
    zh: "选择简历的结构和颜色。经典、紧凑和时间线布局对ATS更友好，因为是单栏无表格/侧栏。",
    ta: "உங்கள் பயோடேட்டாவின் அமைப்பையும் நிறத்தையும் தேர்வு செய்யவும். Classic/Compact/Timeline ATS-க்கு நட்பானவை.",
  },
  tooltipPhoto: {
    ms: "Opsyenal. Sesetengah ATS tak proses gambar & sesetengah company dasar tanpa gambar untuk elak bias.",
    en: "Optional. Some ATS systems can't process images and some companies avoid photos to reduce bias.",
    zh: "可选。部分ATS系统无法处理图片，有些公司为避免偏见而不使用照片。",
    ta: "விருப்பத்தேர்வு. சில ATS அமைப்புகள் படங்களை செயலாக்க முடியாது.",
  },
  tooltipSummary: {
    ms: "2-4 ayat pendek: siapa kau, expertise utama, dan value yang kau bawa. Ni benda pertama recruiter baca.",
    en: "2-4 short sentences: who you are, key expertise, and the value you bring. This is the first thing recruiters read.",
    zh: "2-4句话：你是谁、核心专长、你能带来的价值。这是招聘者最先读到的部分。",
    ta: "நீங்கள் யார், முக்கிய திறமை என்ன என்பதை சுருக்கமாக விவரிக்கவும்.",
  },
  tooltipHighlights: {
    ms: "Mula dengan action verb (Led, Built, Reduced) dan sertakan angka bila boleh ('30%', '5 projek') — tingkatkan ATS score.",
    en: "Start with an action verb (Led, Built, Reduced) and include numbers where possible ('30%', '5 projects') — improves your ATS score.",
    zh: "以动词开头（领导、建立、减少），尽量加入数字（'30%'、'5个项目'）——能提高ATS分数。",
    ta: "செயல் வினைச்சொல்லுடன் தொடங்கி எண்களை சேர்க்கவும் — ATS மதிப்பெண்ணை மேம்படுத்தும்.",
  },
  tooltipSkills: {
    ms: "Senaraikan skill yang match dengan job posting yang kau target — ATS scan keyword dari sini.",
    en: "List skills matching the job posting you're targeting — ATS systems scan keywords from here.",
    zh: "列出与目标职位匹配的技能——ATS系统从这里扫描关键词。",
    ta: "இலக்கு வேலைக்கு பொருந்தும் திறமைகளை பட்டியலிடவும்.",
  },
  tooltipImport: {
    ms: "Upload resume lama untuk auto-isi form. Diproses 100% dalam browser guna text-matching — tiada data keluar, tiada kos.",
    en: "Upload your old resume to auto-fill this form. Processed 100% in your browser via text-matching — no data leaves your device, no cost.",
    zh: "上传旧简历自动填写表单。100%在浏览器中通过文本匹配处理——数据不外传，无需费用。",
    ta: "பழைய பயோடேட்டாவை பதிவேற்றி தானாக நிரப்பவும் — உலாவியில் மட்டுமே செயலாக்கப்படும்.",
  },
  tooltipAts: {
    ms: "ATS ialah software company guna untuk scan resume SEBELUM manusia baca. Kalau tak 'lulus', resume mungkin tak sampai ke recruiter. Check ni untuk nampak apa nak diperbaiki.",
    en: "ATS is software companies use to scan resumes BEFORE a human reads them. If it doesn't pass, your resume may never reach a recruiter. Run this to see what to improve.",
    zh: "ATS是公司在人工阅读简历前用来扫描筛选的软件。若未通过，简历可能到不了招聘人员手中。运行此检测查看需改进之处。",
    ta: "ATS என்பது மனிதர்கள் படிக்கும் முன் பயோடேட்டாவை சரிபார்க்கும் மென்பொருள். இதை இயக்கி மேம்படுத்த வேண்டியவற்றை பாருங்கள்.",
  },
  tooltipCustomSections: {
    ms: "Ada benda lain tak match section sedia ada? Contoh: Publications, Patents. Buat section sendiri di sini.",
    en: "Got something that doesn't fit the existing sections? e.g. Publications, Patents. Create your own section here.",
    zh: "还有内容但现有板块不适用？例如：出版物、专利。在此自建板块。",
    ta: "வேறு ஏதேனும் சேர்க்க வேண்டுமா? உங்கள் சொந்த பிரிவை உருவாக்கவும்.",
  },
  tooltipReferences: {
    ms: "Kebanyakan resume moden tak perlu letak referee details terus — 'Available upon request' dah cukup.",
    en: "Most modern resumes don't need full referee details upfront — 'Available upon request' is enough.",
    zh: "大多数现代简历不需要提前列出推荐人详情——'可应要求提供'就足够了。",
    ta: "பெரும்பாலான பயோடேட்டாக்களுக்கு விரிவான தகவல் தேவையில்லை.",
  },
};

function useT(lang) {
  return (key) => STRINGS[key]?.[lang] || STRINGS[key]?.en || key;
}

/* ================= data helpers ================= */
const uid = () => crypto.randomUUID();
const emptyExperience = () => ({ id: uid(), role: "", company: "", period: "", bullets: "" });
const emptyEducation = () => ({ id: uid(), school: "", degree: "", period: "" });
const emptyCertification = () => ({ id: uid(), name: "", issuer: "", year: "" });
const emptyProject = () => ({ id: uid(), name: "", description: "", tech: "" });
const emptyVolunteer = () => ({ id: uid(), role: "", organization: "", period: "", bullets: "" });
const emptyCustomSection = () => ({ id: uid(), label: "", content: "" });

/* ================= themes ================= */
const THEMES = [
  { id: "navy", label: "Navy", primary: "#1e3a5f", tint: "#eef2f7" },
  { id: "forest", label: "Forest", primary: "#2f4a3c", tint: "#eef3ee" },
  { id: "terracotta", label: "Terracotta", primary: "#b5533c", tint: "#faf1ec" },
  { id: "charcoalGold", label: "Charcoal & Gold", primary: "#2b2b2b", tint: "#f5f3ee" },
  { id: "burgundy", label: "Burgundy", primary: "#6d2436", tint: "#f7ecee" },
  { id: "teal", label: "Teal", primary: "#1f5c5c", tint: "#eaf3f3" },
  { id: "monochrome", label: "Monochrome", primary: "#111111", tint: "#f2f2f2" },
  { id: "indigo", label: "Indigo", primary: "#3f3a6b", tint: "#efeef7" },
  { id: "rose", label: "Rose", primary: "#9d2f52", tint: "#faeef2" },
  { id: "amber", label: "Amber", primary: "#8a5a12", tint: "#faf3e6" },
  { id: "slateBlue", label: "Slate Blue", primary: "#3c4f6b", tint: "#eef1f5" },
  { id: "emerald", label: "Emerald", primary: "#166a4c", tint: "#e9f5ef" },
  { id: "copper", label: "Copper", primary: "#96502e", tint: "#f7ede3" },
  { id: "plum", label: "Plum", primary: "#5b3a5e", tint: "#f4eef4" },
  { id: "ocean", label: "Ocean", primary: "#0f5c78", tint: "#e8f3f6" },
  { id: "graphite", label: "Graphite", primary: "#3a3a3a", tint: "#f0efee" },
];

/* ================= layouts ================= */
const LAYOUTS = [
  { id: "classic", label: "Classic" },
  { id: "sidebarLeft", label: "Sidebar Kiri" },
  { id: "sidebarRight", label: "Sidebar Kanan" },
  { id: "headerBand", label: "Header Band" },
  { id: "timeline", label: "Timeline" },
  { id: "compact", label: "Compact/ATS" },
  { id: "cards", label: "Cards" },
  { id: "split", label: "Split Color" },
  { id: "photoFocus", label: "Photo Focus" },
  { id: "boldBlocks", label: "Bold Blocks" },
  { id: "elegant", label: "Elegant Serif" },
  { id: "monogram", label: "Monogram" },
];

const ATS_SAFE_LAYOUTS = ["classic", "compact", "timeline", "elegant", "boldBlocks"];

/* ================= sample data (fictional persona, not the user, not a real public figure) ================= */
const sampleInfo = {
  name: "Aziz Rahman",
  title: "Pelakon, Pengarah & Penggubah Lagu Filem Klasik",
  photo: null,
  email: "aziz.rahman@example.com",
  phone: "+60 12-345 6789",
  location: "Kuala Lumpur, Malaysia",
  link: "linkedin.com/in/azizrahman",
  portfolio: "filemarkib.example.com/aziz",
  summary: "Seniman serba boleh dengan lebih 20 tahun pengalaman dalam lakonan, pengarahan, dan penggubahan lagu filem Melayu klasik. Dikenali kerana gaya lakonan semula jadi dan lagu ciptaan yang kekal popular sehingga kini.",
};
const sampleExperience = [
  { id: uid(), role: "Pengarah & Pelakon Utama", company: "Studio Seri Filem", period: "1955 - 1970", bullets: "Mengarah dan membintangi lebih 20 buah filem popular di rantau Nusantara\nMenulis dan menggubah lebih 100 lagu untuk soundtrack filem\nMembimbing generasi pelakon dan penggubah lagu baharu" },
  { id: uid(), role: "Penggubah Lagu & Pemuzik", company: "Studio Persendirian", period: "1948 - 1955", bullets: "Menggubah lagu untuk pelbagai produksi filem dan radio\nMembentuk dan mengetuai kumpulan muzik sendiri" },
];
const sampleEducation = [{ id: uid(), school: "Akademi Seni Persembahan Nusantara", degree: "Latihan Lakonan & Muzik", period: "1940 - 1947" }];
const sampleProjects = [{ id: uid(), name: "Trilogi Filem Komedi-Drama", description: "Menghasilkan siri filem yang menjadi rujukan filem Melayu generasi seterusnya.", tech: "Penulisan skrip, Pengarahan, Muzik" }];
const sampleCertifications = [{ id: uid(), name: "Anugerah Seniman Filem Terbilang", issuer: "Festival Filem Nusantara", year: "1962" }];
const sampleVolunteer = [{ id: uid(), role: "Mentor", organization: "Akademi Seni Muda", period: "1960", bullets: "Melatih penggiat seni muda dalam lakonan dan muzik" }];

/* ================= ATS scoring ================= */
function computeAts(data, layoutId) {
  const allBullets = [
    ...data.experience.flatMap((e) => e.bullets.split("\n")),
    ...data.volunteering.flatMap((v) => v.bullets.split("\n")),
  ].map((b) => b.trim()).filter(Boolean);
  const actionVerbs = ["led", "managed", "built", "developed", "designed", "implemented", "improved", "created", "tested", "automated", "reduced", "increased", "launched", "coordinated", "conducted", "analyzed", "delivered", "optimized", "verified", "executed", "menggubah", "mengarah", "membina", "mereka"];
  const withNumbers = allBullets.filter((b) => /\d/.test(b));
  const withVerbs = allBullets.filter((b) => actionVerbs.some((v) => b.toLowerCase().startsWith(v)));
  const summaryWords = data.info.summary.trim().split(/\s+/).filter(Boolean).length;

  const checks = [
    { key: "atsCheckContact", pass: !!data.info.email && !!data.info.phone, points: 10 },
    { key: "atsCheckSummary", pass: summaryWords >= 15 && summaryWords <= 60, points: 10 },
    { key: "atsCheckExperience", pass: data.experience.some((e) => e.bullets.trim()), points: 15 },
    { key: "atsCheckMetrics", pass: allBullets.length > 0 && withNumbers.length / allBullets.length >= 0.3, points: 15 },
    { key: "atsCheckVerbs", pass: allBullets.length > 0 && withVerbs.length / allBullets.length >= 0.3, points: 10 },
    { key: "atsCheckSkills", pass: data.skillList.length >= 5, points: 10 },
    { key: "atsCheckEducation", pass: data.education.some((e) => e.school), points: 10 },
    { key: "atsCheckLayout", pass: ATS_SAFE_LAYOUTS.includes(layoutId), points: 15 },
    { key: "atsCheckPhoto", pass: !data.info.photo, points: 5 },
  ];
  const score = checks.reduce((s, c) => s + (c.pass ? c.points : 0), 0);
  return { score, checks };
}

/* ================= local resume text parser (no API, 100% in-browser) ================= */
const SECTION_ALIASES = {
  summary: ["summary", "objective", "profile", "about me", "professional summary"],
  experience: ["experience", "work experience", "employment history", "professional experience", "work history"],
  education: ["education", "academic background", "academic qualification"],
  skills: ["skills", "technical skills", "core competencies", "key skills"],
  certifications: ["certifications", "certificates", "licenses", "certification"],
  projects: ["projects", "personal projects", "key projects"],
  languages: ["languages"],
  awards: ["awards", "achievements", "honors", "honours"],
};
const YEAR_RANGE_RE = /((19|20)\d{2}\s*[-–—]\s*(present|(19|20)\d{2})|present|(19|20)\d{2})/i;

function matchSectionHeading(line) {
  const clean = line.toLowerCase().replace(/[:•\-]+$/, "").trim();
  if (!clean || clean.length > 40) return null;
  for (const [key, aliases] of Object.entries(SECTION_ALIASES)) {
    if (aliases.includes(clean)) return key;
  }
  return null;
}

function parseEntryBlocks(sectionText, kind) {
  if (!sectionText) return [];
  const blocks = sectionText.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return blocks.map((block) => {
    const blines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const headLine = blines[0] || "";
    const periodMatch = block.match(YEAR_RANGE_RE);
    const period = periodMatch ? periodMatch[0] : "";
    const headWithoutPeriod = (period ? headLine.replace(period, "") : headLine).trim();
    const parts = headWithoutPeriod.split(/,| at |\|| - /).map((p) => p.trim()).filter(Boolean);
    const bulletLines = blines.slice(1).map((l) => l.replace(/^[-•*]\s*/, "")).filter(Boolean);
    if (kind === "experience") return { role: parts[0] || "", company: parts[1] || "", period, bullets: bulletLines.join("\n") };
    if (kind === "education") return { school: parts[0] || "", degree: parts[1] || "", period };
    if (kind === "projects") return { name: parts[0] || headWithoutPeriod, tech: "", description: bulletLines.join(" ") };
    return {};
  });
}

function parseResumeTextLocal(rawText) {
  const lines = rawText.split(/\r?\n/);
  const trimmed = lines.map((l) => l.trim());

  const boundaries = [];
  trimmed.forEach((line, i) => {
    const sec = matchSectionHeading(line);
    if (sec) boundaries.push({ key: sec, index: i });
  });

  const sections = {};
  boundaries.forEach((b, i) => {
    const end = i + 1 < boundaries.length ? boundaries[i + 1].index : trimmed.length;
    const content = lines.slice(b.index + 1, end).join("\n").trim();
    sections[b.key] = sections[b.key] ? `${sections[b.key]}\n${content}` : content;
  });

  const headerEnd = boundaries.length ? boundaries[0].index : trimmed.length;
  const headerLines = trimmed.slice(0, headerEnd).filter(Boolean);

  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = rawText.match(/(\+?\d[\d\-\s()]{7,}\d)/);
  const linkMatch = rawText.match(/(linkedin\.com\/[^\s,]+)/i);
  const portfolioMatch = rawText.match(/(github\.com\/[^\s,]+)/i);

  const nonContactHeaderLines = headerLines.filter((l) => !(emailMatch && l.includes(emailMatch[0])) && !(phoneMatch && l.includes(phoneMatch[0])));
  const name = nonContactHeaderLines[0] || "";
  const title = (nonContactHeaderLines[1] && nonContactHeaderLines[1].length < 60) ? nonContactHeaderLines[1] : "";
  const location = headerLines.find((l) => /,/.test(l) && !/@/.test(l) && !/\d{3,}/.test(l) && l !== name && l !== title) || "";

  const experience = parseEntryBlocks(sections.experience, "experience");
  const education = parseEntryBlocks(sections.education, "education");
  const projects = parseEntryBlocks(sections.projects, "projects");

  const certifications = (sections.certifications || "").split("\n").map((l) => l.trim()).filter(Boolean).map((line) => {
    const yearMatch = line.match(/(19|20)\d{2}/);
    const year = yearMatch ? yearMatch[0] : "";
    const withoutYear = (year ? line.replace(year, "") : line).trim();
    const parts = withoutYear.split(/,| - /).map((p) => p.trim()).filter(Boolean);
    return { name: parts[0] || "", issuer: parts[1] || "", year };
  });

  const skills = (sections.skills || "").split(/[,\n•]/).map((s) => s.trim()).filter(Boolean).join(", ");
  const languages = (sections.languages || "").split(/[,\n•]/).map((s) => s.trim()).filter(Boolean).join(", ");
  const awards = (sections.awards || "").split("\n").map((l) => l.replace(/^[-•*]\s*/, "").trim()).filter(Boolean).join("\n");
  const summary = (sections.summary || "").trim();

  return {
    name, title, location,
    email: emailMatch ? emailMatch[0] : "",
    phone: phoneMatch ? phoneMatch[0].trim() : "",
    link: linkMatch ? linkMatch[0] : "",
    portfolio: portfolioMatch ? portfolioMatch[0] : "",
    summary, experience, education, projects, certifications, skills, languages, awards,
  };
}

/* ================= length hint ================= */
function CountHint({ text, max }) {
  const count = (text || "").length;
  const ratio = count / max;
  const color = ratio > 1 ? "text-red-500" : ratio > 0.8 ? "text-amber-500" : "text-stone-400";
  return <div className={`text-[10px] mt-1 ${color}`}>{count}/{max} chars{ratio > 1 ? " — terlalu panjang, mungkin kacau layout" : ""}</div>;
}

/* ================= info tooltip ================= */
function InfoTip({ text }) {
  const [open, setOpen] = useState(false);
  if (!text) return null;
  return (
    <span className="relative inline-flex items-center ml-1">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={(e) => { e.preventDefault(); setOpen((o) => !o); }}
        className="text-stone-400 hover:text-stone-600"
      >
        <Info size={12} />
      </button>
      {open && (
        <span className="absolute z-40 left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-56 text-[11px] leading-snug bg-stone-900 text-white rounded-md p-2 shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
}

/* ================= main component ================= */
export default function ResumeGenerator({ initialData, onChange }) {
  const initial = initialData && Object.keys(initialData).length > 0 ? initialData : null;

  const [uiLang, setUiLang] = useState(initial?.uiLang || "ms");
  const t = useT(uiLang);

  const [formCollapsed, setFormCollapsed] = useState(false);
  const [previewCollapsed, setPreviewCollapsed] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [isWide, setIsWide] = useState(typeof window !== "undefined" ? window.innerWidth >= 860 : true);

  useEffect(() => {
    const handleResize = () => setIsWide(window.innerWidth >= 860);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const blankInfo = { name: "", title: "", photo: null, email: "", phone: "", location: "", link: "", portfolio: "", summary: "" };

  const [info, setInfo] = useState(initial?.info || blankInfo);
  const [experience, setExperience] = useState(initial?.experience?.length ? initial.experience : [emptyExperience()]);
  const [education, setEducation] = useState(initial?.education?.length ? initial.education : [emptyEducation()]);
  const [certifications, setCertifications] = useState(initial?.certifications || []);
  const [projects, setProjects] = useState(initial?.projects || []);
  const [volunteering, setVolunteering] = useState(initial?.volunteering || []);
  const [customSections, setCustomSections] = useState(initial?.customSections || []);
  const [skills, setSkills] = useState(initial?.skills ?? "");
  const [languages, setLanguages] = useState(initial?.languages ?? "");
  const [awards, setAwards] = useState(initial?.awards ?? "");
  const [hobbies, setHobbies] = useState(initial?.hobbies ?? "");
  const [showReferences, setShowReferences] = useState(initial?.showReferences || false);
  const [referencesText, setReferencesText] = useState(initial?.referencesText || "Available upon request.");

  const [themeId, setThemeId] = useState(initial?.themeId || "navy");
  const [layoutId, setLayoutId] = useState(initial?.layoutId || "classic");
  const theme = THEMES.find((th) => th.id === themeId);

  const [pasteText, setPasteText] = useState("");
  const [importMode, setImportMode] = useState("file");
  const [parsing, setParsing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [atsResult, setAtsResult] = useState(null);
  const fileInputRef = useRef(null);
  const jsonInputRef = useRef(null);

  const updateInfo = (field, value) => setInfo((prev) => ({ ...prev, [field]: value }));
  const updateList = (setter) => (id, field, value) => setter((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  const addTo = (setter, factory) => () => setter((prev) => [...prev, factory()]);
  const removeFrom = (setter) => (id) => setter((prev) => prev.filter((item) => item.id !== id));

  const updateExperience = updateList(setExperience);
  const updateEducation = updateList(setEducation);
  const updateCertification = updateList(setCertifications);
  const updateProject = updateList(setProjects);
  const updateVolunteer = updateList(setVolunteering);
  const updateCustomSection = updateList(setCustomSections);

  const handlePrint = () => window.print();

  const toList = (csv) => csv.split(",").map((s) => s.trim()).filter(Boolean);
  const skillList = toList(skills);
  const languageList = toList(languages);
  const hobbyList = toList(hobbies);
  const awardList = awards.split("\n").map((s) => s.trim()).filter(Boolean);

  const data = { info, experience, education, certifications, projects, volunteering, customSections, skillList, languageList, hobbyList, awardList, showReferences, referencesText, skills, languages, awards, hobbies, themeId, layoutId, uiLang };

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const saveTimeoutRef = useRef(null);
  useEffect(() => {
    if (!onChangeRef.current) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      onChangeRef.current(data);
    }, 1200);
    return () => clearTimeout(saveTimeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data)]);

  const handleAtsRun = () => setAtsResult(computeAts(data, layoutId));

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateInfo("photo", reader.result);
    reader.readAsDataURL(file);
  };

  const loadExample = () => {
    setInfo(sampleInfo);
    setExperience(sampleExperience);
    setEducation(sampleEducation);
    setCertifications(sampleCertifications);
    setProjects(sampleProjects);
    setVolunteering(sampleVolunteer);
    setSkills("Lakonan, Pengarahan Filem, Penggubahan Lagu, Penulisan Skrip, Muzik");
    setLanguages("Bahasa Malaysia (Native), English (Fluent)");
    setAwards("Anugerah Seniman Filem Terbilang - Festival Filem Nusantara");
    setHobbies("Muzik, Melukis, Wayang Kulit");
  };

  const clearAll = () => {
    setInfo({ name: "", title: "", photo: null, email: "", phone: "", location: "", link: "", portfolio: "", summary: "" });
    setExperience([emptyExperience()]);
    setEducation([emptyEducation()]);
    setCertifications([]);
    setProjects([]);
    setVolunteering([]);
    setCustomSections([]);
    setSkills(""); setLanguages(""); setAwards(""); setHobbies("");
  };

  const exportJson = () => {
    const payload = { info, experience, education, certifications, projects, volunteering, customSections, skills, languages, awards, hobbies, showReferences, referencesText };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "resume-data.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const d = JSON.parse(reader.result);
        if (d.info) setInfo(d.info);
        if (d.experience) setExperience(d.experience);
        if (d.education) setEducation(d.education);
        if (d.certifications) setCertifications(d.certifications);
        if (d.projects) setProjects(d.projects);
        if (d.volunteering) setVolunteering(d.volunteering);
        if (d.customSections) setCustomSections(d.customSections);
        if (d.skills) setSkills(d.skills);
        if (d.languages) setLanguages(d.languages);
        if (d.awards) setAwards(d.awards);
        if (d.hobbies) setHobbies(d.hobbies);
        setUploadStatus(t("statusImportSuccess"));
      } catch (err) {
        setUploadStatus(t("statusImportError"));
      }
    };
    reader.readAsText(file);
  };

  function parseResumeText(text) {
    setParsing(true);
    setUploadStatus("");
    try {
      const parsed = parseResumeTextLocal(text);
      setInfo((prev) => ({
        ...prev,
        name: parsed.name || prev.name,
        title: parsed.title || prev.title,
        email: parsed.email || prev.email,
        phone: parsed.phone || prev.phone,
        location: parsed.location || prev.location,
        link: parsed.link || prev.link,
        portfolio: parsed.portfolio || prev.portfolio,
        summary: parsed.summary || prev.summary,
      }));
      if (parsed.experience.length) setExperience(parsed.experience.map((e) => ({ id: uid(), ...e })));
      if (parsed.education.length) setEducation(parsed.education.map((e) => ({ id: uid(), ...e })));
      if (parsed.projects.length) setProjects(parsed.projects.map((e) => ({ id: uid(), ...e })));
      if (parsed.certifications.length) setCertifications(parsed.certifications.map((e) => ({ id: uid(), ...e })));
      if (parsed.skills) setSkills(parsed.skills);
      if (parsed.languages) setLanguages(parsed.languages);
      if (parsed.awards) setAwards(parsed.awards);
      setUploadStatus(t("statusParseSuccess"));
    } catch (err) {
      setUploadStatus(t("statusParseError") + err.message);
    }
    setParsing(false);
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadStatus("");
    try {
      let text = "";
      if (file.name.endsWith(".docx")) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else if (file.name.endsWith(".txt")) {
        text = await file.text();
      } else {
        setUploadStatus(t("statusUnsupported"));
        return;
      }
      parseResumeText(text);
    } catch (err) {
      setUploadStatus(t("statusFileError") + err.message);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-b from-stone-100 to-stone-200 text-stone-900">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-area { box-shadow: none !important; margin: 0 !important; width: 100% !important; height: auto !important; overflow: visible !important; }
          html, body { height: auto !important; overflow: visible !important; background: white !important; }
        }
      `}</style>

      {/* Header bar */}
      <div className="no-print shrink-0 border-b border-stone-300 bg-white/90 backdrop-blur px-4 sm:px-6 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <a href="../index.html" title={t("backToPortal")} className="no-print flex items-center gap-1 text-stone-500 hover:text-stone-900 text-xs font-medium shrink-0">
            <ArrowLeft size={14} /> <span className="hidden sm:inline">{t("backToPortal")}</span>
          </a>
          <img src={LOGO_SRC} alt="Dear Resume logo" className="w-9 h-9 rounded-lg object-contain" />
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-none" style={{ fontFamily: "Georgia, serif" }}>{t("appTitle")}</h1>
            <p className="text-[11px] text-stone-500 mt-0.5 italic">{t("appSubtitle")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 border border-stone-300 rounded-md p-0.5 bg-white">
            <Globe size={13} className="ml-1 text-stone-400" />
            {LANGS.map((l) => (
              <button key={l.id} onClick={() => setUiLang(l.id)}
                className={`text-xs px-2 py-1 rounded ${uiLang === l.id ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100"}`}>
                {l.label}
              </button>
            ))}
          </div>
          <div className="flex items-center">
            <button onClick={handleAtsRun} className="flex items-center gap-1.5 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-medium hover:bg-stone-50">
              <CheckCircle2 size={15} /> {t("runAts")}
            </button>
            <InfoTip text={t("tooltipAts")} />
          </div>
          <button onClick={handlePrint} className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white hover:opacity-90" style={{ background: theme.primary }}>
            <Download size={16} /> {t("saveAsPdf")}
          </button>
          <button onClick={() => setDonateOpen(true)} className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold hover:opacity-90" style={{ background: "#e8a13d", color: "#1a1200" }}>
            <Heart size={15} /> {t("donateBtn")}
          </button>
        </div>
      </div>

      {/* ATS result panel */}
      {atsResult && (
        <div className="no-print shrink-0 max-w-3xl mx-auto mt-4 mx-4 sm:mx-auto rounded-lg border border-stone-300 bg-white p-4 shadow-sm w-full">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold" style={{ color: atsResult.score >= 70 ? "#16794f" : atsResult.score >= 40 ? "#b5860e" : "#b5352e" }}>{atsResult.score}</span>
              <span className="text-sm text-stone-500">/ 100 {t("atsScoreLabel")}</span>
            </div>
            <button onClick={() => setAtsResult(null)} className="text-stone-400 hover:text-stone-700"><X size={16} /></button>
          </div>
          <div className="space-y-1.5">
            {atsResult.checks.map((c, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                {c.pass ? <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" /> : <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />}
                <span className={c.pass ? "text-stone-700" : "text-stone-500"}>{t(c.key)} <span className="text-xs text-stone-400">({c.points}pts)</span></span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`flex-1 min-h-0 ${isWide ? "overflow-hidden" : "overflow-y-auto"} flex ${isWide ? "flex-row" : "flex-col"} gap-4 p-4 sm:p-6 max-w-7xl mx-auto w-full`}>
        {/* FORM PANEL (sidebar-collapsible) */}
        <div className={`no-print transition-all duration-200 ${!isWide ? "w-full" : formCollapsed ? "w-14 shrink-0 h-full" : "flex-1 min-w-0 h-full overflow-y-auto"}`}>
            {formCollapsed ? (
              <button onClick={() => setFormCollapsed(false)}
                className={`sticky top-0 bg-white rounded-lg border border-stone-300 hover:bg-stone-50 shadow-sm flex items-center gap-2 ${isWide ? "w-14 flex-col py-4" : "w-full justify-between px-3 py-2"}`}>
                {isWide ? (
                  <>
                    <ChevronRight size={16} className="text-stone-500" />
                    <span className="text-[10px] font-semibold text-stone-500 tracking-wide" style={{ writingMode: "vertical-rl" }}>{t("editTab")}</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-semibold">{t("editTab")}</span>
                    <ChevronRight size={15} className="text-stone-500" />
                  </>
                )}
              </button>
            ) : (
              <>
                <div className="sticky top-0 z-10 flex items-center justify-between bg-white rounded-lg border border-stone-300 px-3 py-2 mb-3 mr-3 shadow-sm">
                  <span className="text-sm font-semibold">{t("editTab")}</span>
                  <button onClick={() => setFormCollapsed(true)} className="text-stone-500 hover:text-stone-900 ml-auto" title="Minimize">
                    <ChevronLeft size={15} />
                  </button>
                </div>
          <div className="space-y-6 pr-3">

          <div className="rounded-lg border border-stone-300 bg-white p-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">{t("quickActions")}</div>
            <div className="grid grid-cols-4 gap-2">
              <button onClick={loadExample} className="flex flex-col items-center gap-1 rounded-md py-2 text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors">
                <Sparkles size={16} /> <span className="text-[10px] font-medium leading-tight text-center">{t("loadExample")}</span>
              </button>
              <button onClick={clearAll} className="flex flex-col items-center gap-1 rounded-md py-2 text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors">
                <RotateCcw size={16} /> <span className="text-[10px] font-medium leading-tight text-center">{t("clearAll")}</span>
              </button>
              <button onClick={exportJson} className="flex flex-col items-center gap-1 rounded-md py-2 text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors">
                <Save size={16} /> <span className="text-[10px] font-medium leading-tight text-center">{t("exportData")}</span>
              </button>
              <button onClick={() => jsonInputRef.current?.click()} className="flex flex-col items-center gap-1 rounded-md py-2 text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors">
                <FolderOpen size={16} /> <span className="text-[10px] font-medium leading-tight text-center">{t("importData")}</span>
              </button>
              <input ref={jsonInputRef} type="file" accept=".json" onChange={importJson} className="hidden" />
            </div>
          </div>

          <Section title={t("importResume")} tooltip={t("tooltipImport")}>
            <div className="rounded-lg border border-stone-300 bg-white p-3 space-y-3">
              <div className="flex gap-1 bg-stone-100 rounded-md p-1">
                <button onClick={() => setImportMode("file")}
                  className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium rounded px-2 py-1.5 transition-colors ${importMode === "file" ? "bg-white shadow-sm text-stone-900" : "text-stone-500 hover:text-stone-700"}`}>
                  <Upload size={13} /> {t("uploadTab")}
                </button>
                <button onClick={() => setImportMode("paste")}
                  className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium rounded px-2 py-1.5 transition-colors ${importMode === "paste" ? "bg-white shadow-sm text-stone-900" : "text-stone-500 hover:text-stone-700"}`}>
                  <ClipboardPaste size={13} /> {t("pasteTab")}
                </button>
              </div>

              {importMode === "file" ? (
                <button onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-2 text-sm font-medium rounded-lg border-2 border-dashed border-stone-300 px-3 py-6 hover:bg-stone-50 hover:border-stone-400 w-full justify-center text-stone-600 transition-colors">
                  <Upload size={20} className="text-stone-400" />
                  {t("uploadFile")}
                </button>
              ) : (
                <>
                  <textarea value={pasteText} onChange={(e) => setPasteText(e.target.value)} placeholder={t("pasteHere")} rows={4}
                    className="w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400" />
                  <button onClick={() => parseResumeText(pasteText)} disabled={parsing || !pasteText.trim()}
                    className="flex items-center gap-2 text-sm font-medium rounded-md px-3 py-2 text-white w-full justify-center disabled:opacity-40" style={{ background: theme.primary }}>
                    <ClipboardPaste size={15} /> {parsing ? t("parsing") : t("parseAndFill")}
                  </button>
                </>
              )}
              <input ref={fileInputRef} type="file" accept=".docx,.txt" onChange={handleFileUpload} className="hidden" />
              {uploadStatus && <p className="text-xs text-stone-500">{uploadStatus}</p>}
            </div>
          </Section>


          <Section title={`${t("layoutHeading")} & ${t("themeHeading")}`} tooltip={t("tooltipLayoutTheme")}>
            <div className="mb-3">
              <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2"><LayoutGrid size={13} /> {t("layoutHeading")} ({LAYOUTS.length})</div>
              <div className="flex flex-wrap gap-2">
                {LAYOUTS.map((l) => (
                  <button key={l.id} onClick={() => setLayoutId(l.id)}
                    className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${layoutId === l.id ? "bg-stone-900 text-white border-stone-900" : "bg-white border-stone-300 text-stone-600 hover:border-stone-500"}`}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2"><Palette size={13} /> {t("themeHeading")} ({THEMES.length}) — {LAYOUTS.length}×{THEMES.length} = {LAYOUTS.length * THEMES.length} {t("combinations")}</div>
              <div className="flex flex-wrap gap-2">
                {THEMES.map((th) => (
                  <button key={th.id} onClick={() => setThemeId(th.id)} title={th.label}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${themeId === th.id ? "scale-110 border-stone-900" : "border-white"}`}
                    style={{ background: th.primary, boxShadow: "0 0 0 1px #d6d3d1" }} />
                ))}
              </div>
            </div>
          </Section>

          <Section title={t("personalInfo")}>
            <div className="mb-3">
              <span className="text-xs text-stone-500 inline-flex items-center">{t("photo")}<InfoTip text={t("tooltipPhoto")} /></span>
              <div className="flex items-center gap-3 mt-1">
                {info.photo ? (
                  <img src={info.photo} alt="" className="w-14 h-14 rounded-full object-cover border border-stone-300" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-stone-200 flex items-center justify-center text-stone-400"><ImageIcon size={20} /></div>
                )}
                <label className="text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer border border-stone-300 rounded-md px-3 py-1.5">
                  {t("uploadPhoto")}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
                {info.photo && <button onClick={() => updateInfo("photo", null)} className="text-xs text-red-500">{t("removePhoto")}</button>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t("fullName")} value={info.name} onChange={(v) => updateInfo("name", v)} />
              <Field label={t("jobTitle")} value={info.title} onChange={(v) => updateInfo("title", v)} />
              <Field label={t("email")} value={info.email} onChange={(v) => updateInfo("email", v)} />
              <Field label={t("phone")} value={info.phone} onChange={(v) => updateInfo("phone", v)} />
              <Field label={t("location")} value={info.location} onChange={(v) => updateInfo("location", v)} />
              <Field label={t("linkedin")} value={info.link} onChange={(v) => updateInfo("link", v)} />
              <Field label={t("portfolio")} value={info.portfolio} onChange={(v) => updateInfo("portfolio", v)} />
            </div>
            <TextArea label={t("summary")} tooltip={t("tooltipSummary")} value={info.summary} onChange={(v) => updateInfo("summary", v)} rows={3} />
            <CountHint text={info.summary} max={400} />
          </Section>

          <Section title={t("experience")}>
            <ListEditor t={t} items={experience} onAdd={addTo(setExperience, emptyExperience)} onRemove={removeFrom(setExperience)} addLabel={t("addExperience")}
              render={(exp) => (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label={t("role")} value={exp.role} onChange={(v) => updateExperience(exp.id, "role", v)} />
                    <Field label={t("company")} value={exp.company} onChange={(v) => updateExperience(exp.id, "company", v)} />
                  </div>
                  <Field label={t("period")} value={exp.period} onChange={(v) => updateExperience(exp.id, "period", v)} />
                  <TextArea label={t("highlights")} tooltip={t("tooltipHighlights")} value={exp.bullets} onChange={(v) => updateExperience(exp.id, "bullets", v)} rows={3} />
                  <CountHint text={exp.bullets} max={500} />
                </>
              )} />
          </Section>

          <Section title={t("education")}>
            <ListEditor t={t} items={education} onAdd={addTo(setEducation, emptyEducation)} onRemove={removeFrom(setEducation)} addLabel={t("addEducation")}
              render={(edu) => (
                <>
                  <Field label={t("school")} value={edu.school} onChange={(v) => updateEducation(edu.id, "school", v)} />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label={t("degree")} value={edu.degree} onChange={(v) => updateEducation(edu.id, "degree", v)} />
                    <Field label={t("period")} value={edu.period} onChange={(v) => updateEducation(edu.id, "period", v)} />
                  </div>
                </>
              )} />
          </Section>

          <Section title={t("projects")}>
            <ListEditor t={t} items={projects} onAdd={addTo(setProjects, emptyProject)} onRemove={removeFrom(setProjects)} addLabel={t("addProject")}
              render={(p) => (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label={t("projectName")} value={p.name} onChange={(v) => updateProject(p.id, "name", v)} />
                    <Field label={t("tech")} value={p.tech} onChange={(v) => updateProject(p.id, "tech", v)} />
                  </div>
                  <TextArea label={t("description")} value={p.description} onChange={(v) => updateProject(p.id, "description", v)} rows={2} />
                  <CountHint text={p.description} max={250} />
                </>
              )} />
          </Section>

          <Section title={t("volunteering")}>
            <ListEditor t={t} items={volunteering} onAdd={addTo(setVolunteering, emptyVolunteer)} onRemove={removeFrom(setVolunteering)} addLabel={t("addVolunteer")}
              render={(v) => (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label={t("role")} value={v.role} onChange={(val) => updateVolunteer(v.id, "role", val)} />
                    <Field label={t("organization")} value={v.organization} onChange={(val) => updateVolunteer(v.id, "organization", val)} />
                  </div>
                  <Field label={t("period")} value={v.period} onChange={(val) => updateVolunteer(v.id, "period", val)} />
                  <TextArea label={t("highlights")} value={v.bullets} onChange={(val) => updateVolunteer(v.id, "bullets", val)} rows={2} />
                </>
              )} />
          </Section>

          <Section title={t("certifications")}>
            <ListEditor t={t} items={certifications} onAdd={addTo(setCertifications, emptyCertification)} onRemove={removeFrom(setCertifications)} addLabel={t("addCertification")}
              render={(c) => (
                <div className="grid grid-cols-3 gap-3">
                  <Field label={t("certName")} value={c.name} onChange={(v) => updateCertification(c.id, "name", v)} />
                  <Field label={t("issuer")} value={c.issuer} onChange={(v) => updateCertification(c.id, "issuer", v)} />
                  <Field label={t("year")} value={c.year} onChange={(v) => updateCertification(c.id, "year", v)} />
                </div>
              )} />
          </Section>

          <Section title={t("skills")} tooltip={t("tooltipSkills")}><TextArea label={t("commaSeparated")} value={skills} onChange={setSkills} rows={2} /></Section>
          <Section title={t("languages")}><TextArea label={t("commaSeparated")} value={languages} onChange={setLanguages} rows={2} /></Section>
          <Section title={t("hobbies")}><TextArea label={t("commaSeparated")} value={hobbies} onChange={setHobbies} rows={2} /></Section>
          <Section title={t("awards")}><TextArea label={t("oneperline")} value={awards} onChange={setAwards} rows={2} /></Section>

          <Section title={t("customSections")} tooltip={t("tooltipCustomSections")}>
            <ListEditor t={t} items={customSections} onAdd={addTo(setCustomSections, emptyCustomSection)} onRemove={removeFrom(setCustomSections)} addLabel={t("addCustomSection")}
              render={(s) => (
                <>
                  <Field label={t("sectionLabel")} value={s.label} onChange={(v) => updateCustomSection(s.id, "label", v)} />
                  <TextArea label={t("sectionContent")} value={s.content} onChange={(v) => updateCustomSection(s.id, "content", v)} rows={2} />
                </>
              )} />
          </Section>

          <Section title={t("references")} tooltip={t("tooltipReferences")}>
            <label className="flex items-center gap-2 text-sm text-stone-600 mb-2">
              <input type="checkbox" checked={showReferences} onChange={(e) => setShowReferences(e.target.checked)} />
              {t("includeReferences")}
            </label>
            {showReferences && <TextArea label={t("references")} value={referencesText} onChange={setReferencesText} rows={2} />}
          </Section>

          </div>
              </>
            )}
        </div>

        {isWide && <div className="w-px bg-stone-300 shrink-0 self-stretch mx-1" />}

        {/* PREVIEW PANEL (sidebar-collapsible) */}
        <div className={`print-area transition-all duration-200 ${!isWide ? "w-full" : previewCollapsed ? "w-14 shrink-0 h-full" : "flex-1 min-w-0 h-full overflow-y-auto"}`}>
            {previewCollapsed ? (
              <button onClick={() => setPreviewCollapsed(false)}
                className={`no-print sticky top-0 bg-white rounded-lg border border-stone-300 hover:bg-stone-50 shadow-sm flex items-center gap-2 ${isWide ? "w-14 flex-col py-4" : "w-full justify-between px-3 py-2"}`}>
                {isWide ? (
                  <>
                    <ChevronLeft size={16} className="text-stone-500" />
                    <span className="text-[10px] font-semibold text-stone-500 tracking-wide" style={{ writingMode: "vertical-rl" }}>{t("previewTab")}</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-semibold">{t("previewTab")}</span>
                    <ChevronLeft size={15} className="text-stone-500" />
                  </>
                )}
              </button>
            ) : (
              <>
                <div className="no-print sticky top-0 z-10 flex items-center justify-between bg-white rounded-lg border border-stone-300 px-3 py-2 mb-3 mr-3 shadow-sm">
                  <span className="text-sm font-semibold">{t("previewTab")}</span>
                  <button onClick={() => setPreviewCollapsed(true)} className="text-stone-500 hover:text-stone-900 ml-auto" title="Minimize">
                    <ChevronRight size={15} />
                  </button>
                </div>
                <div className="pb-4 pr-3">
                  <ResumeDocument data={data} theme={theme} layoutId={layoutId} t={t} />
                </div>
              </>
            )}
        </div>
      </div>

      {/* Donate modal */}
      {donateOpen && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5" onClick={() => setDonateOpen(false)}>
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setDonateOpen(false)} className="absolute top-3 right-4 text-stone-400 hover:text-stone-700 text-2xl leading-none" aria-label={t("closeLabel")}>&times;</button>
            <h3 className="text-2xl font-extrabold text-stone-900 mb-1">{t("donateTitle")}</h3>
            <p className="text-sm text-stone-500 mb-4">{t("donateBody")}</p>
            <img src="qr.jpg" alt={t("donateTitle")} className="mx-auto w-56 h-56 rounded-xl border border-stone-200 object-contain" />
            <a href="qr.jpg" download="dear-resume-qr.jpg" className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold" style={{ background: "#e8a13d", color: "#1a1200" }}>
              <Download size={15} /> {t("donateDownload")}
            </a>
            <p className="text-xs text-stone-400 mt-3">{t("donateHint")}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= shared small components ================= */

function Section({ title, tooltip, children }) {
  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-2 inline-flex items-center">{title}<InfoTip text={tooltip} /></h2>
      {children}
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs text-stone-500">{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400" />
    </label>
  );
}

function TextArea({ label, value, onChange, rows, tooltip }) {
  return (
    <label className="block mt-3">
      <span className="text-xs text-stone-500 inline-flex items-center">{label}<InfoTip text={tooltip} /></span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows}
        className="mt-1 w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400" />
    </label>
  );
}

function ListEditor({ items, onAdd, onRemove, addLabel, render, t }) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={item.id} className="rounded-lg border border-stone-300 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400">{t("entryLabel")} {i + 1}</span>
            <button onClick={() => onRemove(item.id)} className="text-stone-400 hover:text-red-500"><Trash2 size={14} /></button>
          </div>
          {render(item)}
        </div>
      ))}
      <button onClick={onAdd} className="flex items-center gap-1 text-sm font-medium text-stone-600 hover:text-stone-900">
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  );
}

/* ================= resume content blocks ================= */

function ContactLine({ info, color = "#78716c" }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ fontFamily: "Arial, sans-serif", color }}>
      {info.email && <span className="flex items-center gap-1"><Mail size={11} />{info.email}</span>}
      {info.phone && <span className="flex items-center gap-1"><Phone size={11} />{info.phone}</span>}
      {info.location && <span className="flex items-center gap-1"><MapPin size={11} />{info.location}</span>}
      {info.link && <span className="flex items-center gap-1"><LinkIcon size={11} />{info.link}</span>}
      {info.portfolio && <span className="flex items-center gap-1"><FileText size={11} />{info.portfolio}</span>}
    </div>
  );
}

function Heading({ children, theme }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b" style={{ fontFamily: "Arial, sans-serif", color: theme.primary, borderColor: theme.tint }}>
      {children}
    </h2>
  );
}

function SummaryBlock({ info, theme }) {
  if (!info.summary) return null;
  return <div className="mb-4"><p className="text-sm leading-relaxed text-stone-700">{info.summary}</p></div>;
}

function ExperienceBlock({ experience, theme, title = "Experience" }) {
  if (!experience.some((e) => e.role || e.company)) return null;
  return (
    <div className="mb-4">
      <Heading theme={theme}>{title}</Heading>
      <div className="space-y-3">
        {experience.map((exp) => (
          <div key={exp.id}>
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-sm">{exp.role || "Role"}{exp.company ? `, ${exp.company}` : ""}</span>
              <span className="text-xs text-stone-500" style={{ fontFamily: "Arial, sans-serif" }}>{exp.period}</span>
            </div>
            {exp.bullets && <ul className="list-disc list-inside text-sm text-stone-700 mt-1 space-y-0.5">{exp.bullets.split("\n").filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}</ul>}
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineExperienceBlock({ experience, theme, title = "Experience" }) {
  if (!experience.some((e) => e.role || e.company)) return null;
  return (
    <div className="mb-4">
      <Heading theme={theme}>{title}</Heading>
      <div className="space-y-4 border-l-2 pl-4" style={{ borderColor: theme.tint }}>
        {experience.map((exp) => (
          <div key={exp.id} className="relative">
            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full" style={{ background: theme.primary }} />
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-sm">{exp.role || "Role"}{exp.company ? `, ${exp.company}` : ""}</span>
              <span className="text-xs text-stone-500" style={{ fontFamily: "Arial, sans-serif" }}>{exp.period}</span>
            </div>
            {exp.bullets && <ul className="list-disc list-inside text-sm text-stone-700 mt-1 space-y-0.5">{exp.bullets.split("\n").filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}</ul>}
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationBlock({ education, theme, title = "Education" }) {
  if (!education.some((e) => e.school)) return null;
  return (
    <div className="mb-4">
      <Heading theme={theme}>{title}</Heading>
      <div className="space-y-2">
        {education.map((edu) => (
          <div key={edu.id} className="flex justify-between items-baseline">
            <span className="text-sm"><span className="font-semibold">{edu.school}</span>{edu.degree ? ` — ${edu.degree}` : ""}</span>
            <span className="text-xs text-stone-500" style={{ fontFamily: "Arial, sans-serif" }}>{edu.period}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsBlock({ projects, theme, title = "Projects" }) {
  if (!projects.some((p) => p.name)) return null;
  return (
    <div className="mb-4">
      <Heading theme={theme}>{title}</Heading>
      <div className="space-y-2">
        {projects.map((p) => (
          <div key={p.id}>
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-sm">{p.name}</span>
              {p.tech && <span className="text-xs text-stone-500" style={{ fontFamily: "Arial, sans-serif" }}>{p.tech}</span>}
            </div>
            {p.description && <p className="text-sm text-stone-700">{p.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function VolunteeringBlock({ volunteering, theme, title = "Volunteering" }) {
  if (!volunteering.some((v) => v.role || v.organization)) return null;
  return (
    <div className="mb-4">
      <Heading theme={theme}>{title}</Heading>
      <div className="space-y-2">
        {volunteering.map((v) => (
          <div key={v.id}>
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-sm">{v.role || "Role"}{v.organization ? `, ${v.organization}` : ""}</span>
              <span className="text-xs text-stone-500" style={{ fontFamily: "Arial, sans-serif" }}>{v.period}</span>
            </div>
            {v.bullets && <ul className="list-disc list-inside text-sm text-stone-700 mt-1 space-y-0.5">{v.bullets.split("\n").filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}</ul>}
          </div>
        ))}
      </div>
    </div>
  );
}

function CertificationsBlock({ certifications, theme, title = "Certifications" }) {
  if (!certifications.some((c) => c.name)) return null;
  return (
    <div className="mb-4">
      <Heading theme={theme}>{title}</Heading>
      <div className="space-y-1">
        {certifications.map((c) => (
          <div key={c.id} className="flex justify-between items-baseline text-sm">
            <span><span className="font-semibold">{c.name}</span>{c.issuer ? ` — ${c.issuer}` : ""}</span>
            <span className="text-xs text-stone-500" style={{ fontFamily: "Arial, sans-serif" }}>{c.year}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsBlock({ skillList, theme, title = "Skills" }) {
  if (skillList.length === 0) return null;
  return (
    <div className="mb-4">
      <Heading theme={theme}>{title}</Heading>
      <div className="flex flex-wrap gap-2">
        {skillList.map((s, i) => <span key={i} className="text-xs rounded px-2 py-0.5" style={{ fontFamily: "Arial, sans-serif", background: theme.tint, color: theme.primary }}>{s}</span>)}
      </div>
    </div>
  );
}

function LanguagesBlock({ languageList, theme, title = "Languages" }) {
  if (languageList.length === 0) return null;
  return (
    <div className="mb-4">
      <Heading theme={theme}>{title}</Heading>
      <ul className="text-sm text-stone-700 space-y-0.5">{languageList.map((l, i) => <li key={i}>{l}</li>)}</ul>
    </div>
  );
}

function HobbiesBlock({ hobbyList, theme, title = "Interests" }) {
  if (hobbyList.length === 0) return null;
  return (
    <div className="mb-4">
      <Heading theme={theme}>{title}</Heading>
      <p className="text-sm text-stone-700">{hobbyList.join(" · ")}</p>
    </div>
  );
}

function AwardsBlock({ awardList, theme, title = "Awards & Achievements" }) {
  if (awardList.length === 0) return null;
  return (
    <div className="mb-4">
      <Heading theme={theme}>{title}</Heading>
      <ul className="list-disc list-inside text-sm text-stone-700 space-y-0.5">{awardList.map((a, i) => <li key={i}>{a}</li>)}</ul>
    </div>
  );
}

function CustomSectionsBlock({ customSections, theme }) {
  if (!customSections.some((s) => s.label)) return null;
  return (
    <>
      {customSections.filter((s) => s.label).map((s) => (
        <div key={s.id} className="mb-4">
          <Heading theme={theme}>{s.label}</Heading>
          <p className="text-sm text-stone-700 whitespace-pre-line">{s.content}</p>
        </div>
      ))}
    </>
  );
}

function ReferencesBlock({ show, text, theme, title = "References" }) {
  if (!show) return null;
  return (
    <div>
      <Heading theme={theme}>{title}</Heading>
      <p className="text-sm text-stone-700">{text}</p>
    </div>
  );
}

/* ================= page frame + layouts ================= */

function Page({ children }) {
  return (
    <div className="bg-white shadow-xl mx-auto w-full max-w-[8.5in] min-h-[11in] text-stone-900 overflow-hidden" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      {children}
    </div>
  );
}

function NameBlock({ info, theme, color, sub, showPhoto = true }) {
  return (
    <div className="flex items-center gap-4">
      {showPhoto && info.photo && <img src={info.photo} alt="" className="w-16 h-16 rounded-full object-cover" />}
      <div>
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: color || "inherit" }}>{info.name || "Your Name"}</h1>
        <p className="text-base mt-0.5" style={{ color: sub || theme.primary }}>{info.title || "Your Title"}</p>
      </div>
    </div>
  );
}

function MainSections({ data, theme, t, experienceComponent: Exp = ExperienceBlock }) {
  return (
    <>
      <SummaryBlock info={data.info} theme={theme} />
      <Exp experience={data.experience} theme={theme} title={t("experience")} />
      <ProjectsBlock projects={data.projects} theme={theme} title={t("projects")} />
      <VolunteeringBlock volunteering={data.volunteering} theme={theme} title={t("volunteering")} />
      <EducationBlock education={data.education} theme={theme} title={t("education")} />
      <AwardsBlock awardList={data.awardList} theme={theme} title={t("awards")} />
      <CustomSectionsBlock customSections={data.customSections} theme={theme} />
      <ReferencesBlock show={data.showReferences} text={data.referencesText} theme={theme} title={t("references")} />
    </>
  );
}

function SideSections({ data, theme, t }) {
  return (
    <>
      <SkillsBlock skillList={data.skillList} theme={theme} title={t("skills")} />
      <LanguagesBlock languageList={data.languageList} theme={theme} title={t("languages")} />
      <CertificationsBlock certifications={data.certifications} theme={theme} title={t("certifications")} />
      <HobbiesBlock hobbyList={data.hobbyList} theme={theme} title={t("interests")} />
    </>
  );
}

function FullStack({ data, theme, t }) {
  return (
    <>
      <SummaryBlock info={data.info} theme={theme} />
      <ExperienceBlock experience={data.experience} theme={theme} title={t("experience")} />
      <ProjectsBlock projects={data.projects} theme={theme} title={t("projects")} />
      <VolunteeringBlock volunteering={data.volunteering} theme={theme} title={t("volunteering")} />
      <EducationBlock education={data.education} theme={theme} title={t("education")} />
      <SkillsBlock skillList={data.skillList} theme={theme} title={t("skills")} />
      <LanguagesBlock languageList={data.languageList} theme={theme} title={t("languages")} />
      <CertificationsBlock certifications={data.certifications} theme={theme} title={t("certifications")} />
      <HobbiesBlock hobbyList={data.hobbyList} theme={theme} title={t("interests")} />
      <AwardsBlock awardList={data.awardList} theme={theme} title={t("awards")} />
      <CustomSectionsBlock customSections={data.customSections} theme={theme} />
      <ReferencesBlock show={data.showReferences} text={data.referencesText} theme={theme} title={t("references")} />
    </>
  );
}

function ResumeDocument({ data, theme, layoutId, t }) {
  const { info } = data;

  if (layoutId === "sidebarLeft" || layoutId === "sidebarRight") {
    const sidebar = (
      <div className="w-[34%] p-6" style={{ background: theme.tint }}>
        {info.photo && <img src={info.photo} alt="" className="w-20 h-20 rounded-full object-cover mb-3" />}
        <h1 className="text-xl font-bold" style={{ color: theme.primary }}>{info.name || "Your Name"}</h1>
        <p className="text-sm text-stone-600">{info.title || "Your Title"}</p>
        <div className="mt-3"><ContactLine info={info} color="#57534e" /></div>
        <div className="mt-4"><SideSections data={data} theme={theme} t={t} /></div>
      </div>
    );
    const main = <div className="w-[66%] p-6"><MainSections data={data} theme={theme} t={t} /></div>;
    return <Page><div className="flex min-h-[11in]">{layoutId === "sidebarLeft" ? <>{sidebar}{main}</> : <>{main}{sidebar}</>}</div></Page>;
  }

  if (layoutId === "headerBand") {
    return (
      <Page>
        <div className="p-6 text-white" style={{ background: theme.primary }}>
          <NameBlock info={info} theme={theme} color="#ffffff" sub="#e7e5e4" />
          <div className="mt-2"><ContactLine info={info} color="#e7e5e4" /></div>
        </div>
        <div className="flex">
          <div className="w-[34%] p-6" style={{ background: theme.tint }}><SideSections data={data} theme={theme} t={t} /></div>
          <div className="w-[66%] p-6"><MainSections data={data} theme={theme} t={t} /></div>
        </div>
      </Page>
    );
  }

  if (layoutId === "split") {
    return (
      <Page>
        <div className="flex min-h-[11in]">
          <div className="w-[32%] p-6 text-white" style={{ background: theme.primary }}>
            {info.photo && <img src={info.photo} alt="" className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-white/40" />}
            <h1 className="text-2xl font-bold">{info.name || "Your Name"}</h1>
            <p className="text-sm mt-0.5 opacity-90">{info.title || "Your Title"}</p>
            <div className="mt-4 space-y-1 text-xs" style={{ fontFamily: "Arial, sans-serif" }}>
              {info.email && <div className="flex items-center gap-1.5"><Mail size={11} />{info.email}</div>}
              {info.phone && <div className="flex items-center gap-1.5"><Phone size={11} />{info.phone}</div>}
              {info.location && <div className="flex items-center gap-1.5"><MapPin size={11} />{info.location}</div>}
              {info.link && <div className="flex items-center gap-1.5"><LinkIcon size={11} />{info.link}</div>}
              {info.portfolio && <div className="flex items-center gap-1.5"><FileText size={11} />{info.portfolio}</div>}
            </div>
            <div className="mt-5 [&_h2]:text-white/70 [&_span]:text-white [&_li]:text-white/90 [&_p]:text-white/90">
              <SideSections data={data} theme={{ ...theme, tint: "rgba(255,255,255,0.15)", primary: "#ffffff" }} t={t} />
            </div>
          </div>
          <div className="w-[68%] p-6"><MainSections data={data} theme={theme} t={t} /></div>
        </div>
      </Page>
    );
  }

  if (layoutId === "timeline") {
    return (
      <Page>
        <div className="p-8">
          <div className="border-b-2 pb-3 mb-4" style={{ borderColor: theme.primary }}>
            <NameBlock info={info} theme={theme} showPhoto={false} />
            <div className="mt-2"><ContactLine info={info} /></div>
          </div>
          <SummaryBlock info={info} theme={theme} />
          <TimelineExperienceBlock experience={data.experience} theme={theme} title={t("experience")} />
          <ProjectsBlock projects={data.projects} theme={theme} title={t("projects")} />
          <VolunteeringBlock volunteering={data.volunteering} theme={theme} title={t("volunteering")} />
          <EducationBlock education={data.education} theme={theme} title={t("education")} />
          <SkillsBlock skillList={data.skillList} theme={theme} title={t("skills")} />
          <LanguagesBlock languageList={data.languageList} theme={theme} title={t("languages")} />
          <CertificationsBlock certifications={data.certifications} theme={theme} title={t("certifications")} />
          <HobbiesBlock hobbyList={data.hobbyList} theme={theme} title={t("interests")} />
          <AwardsBlock awardList={data.awardList} theme={theme} title={t("awards")} />
          <CustomSectionsBlock customSections={data.customSections} theme={theme} />
          <ReferencesBlock show={data.showReferences} text={data.referencesText} theme={theme} title={t("references")} />
        </div>
      </Page>
    );
  }

  if (layoutId === "compact") {
    return (
      <Page>
        <div className="p-6 text-[13px] leading-snug">
          <div className="flex justify-between items-baseline flex-wrap gap-y-1">
            <div>
              <h1 className="text-xl font-bold">{info.name || "Your Name"}</h1>
              <p className="text-sm text-stone-600">{info.title || "Your Title"}</p>
            </div>
            <ContactLine info={info} />
          </div>
          <hr className="my-2 border-stone-300" />
          <FullStack data={data} theme={theme} t={t} />
        </div>
      </Page>
    );
  }

  if (layoutId === "cards") {
    const Card = ({ children }) => <div className="rounded-lg border border-stone-200 shadow-sm p-4 mb-4">{children}</div>;
    return (
      <Page>
        <div className="p-8" style={{ background: theme.tint }}>
          <div className="rounded-lg p-5 mb-4 text-white flex items-center gap-4" style={{ background: theme.primary }}>
            {info.photo && <img src={info.photo} alt="" className="w-16 h-16 rounded-full object-cover" />}
            <div>
              <h1 className="text-2xl font-bold">{info.name || "Your Name"}</h1>
              <p className="text-sm opacity-90">{info.title || "Your Title"}</p>
              <div className="mt-2"><ContactLine info={info} color="#f5f5f4" /></div>
            </div>
          </div>
          <Card><SummaryBlock info={info} theme={theme} /></Card>
          <Card><ExperienceBlock experience={data.experience} theme={theme} title={t("experience")} /></Card>
          <Card><ProjectsBlock projects={data.projects} theme={theme} title={t("projects")} /></Card>
          <Card><VolunteeringBlock volunteering={data.volunteering} theme={theme} title={t("volunteering")} /></Card>
          <Card><EducationBlock education={data.education} theme={theme} title={t("education")} /></Card>
          <Card><SkillsBlock skillList={data.skillList} theme={theme} title={t("skills")} /></Card>
          <Card><LanguagesBlock languageList={data.languageList} theme={theme} title={t("languages")} /></Card>
          <Card><CertificationsBlock certifications={data.certifications} theme={theme} title={t("certifications")} /></Card>
          <Card><HobbiesBlock hobbyList={data.hobbyList} theme={theme} title={t("interests")} /></Card>
          <Card><AwardsBlock awardList={data.awardList} theme={theme} title={t("awards")} /></Card>
          <Card><CustomSectionsBlock customSections={data.customSections} theme={theme} /></Card>
          <Card><ReferencesBlock show={data.showReferences} text={data.referencesText} theme={theme} title={t("references")} /></Card>
        </div>
      </Page>
    );
  }

  if (layoutId === "photoFocus") {
    return (
      <Page>
        <div className="p-10 flex flex-col items-center text-center">
          {info.photo && <img src={info.photo} alt="" className="w-24 h-24 rounded-full object-cover mb-3" style={{ border: `3px solid ${theme.primary}` }} />}
          <h1 className="text-3xl font-bold">{info.name || "Your Name"}</h1>
          <p className="text-base mt-0.5" style={{ color: theme.primary }}>{info.title || "Your Title"}</p>
          <div className="mt-2 flex justify-center"><ContactLine info={info} /></div>
          <div className="w-full text-left mt-6">
            <FullStack data={data} theme={theme} t={t} />
          </div>
        </div>
      </Page>
    );
  }

  if (layoutId === "boldBlocks") {
    const BoldHeading = ({ children }) => (
      <h2 className="text-xs font-bold uppercase tracking-widest text-white px-3 py-1.5 rounded mb-2 inline-block" style={{ fontFamily: "Arial, sans-serif", background: theme.primary }}>{children}</h2>
    );
    return (
      <Page>
        <div className="p-8">
          <NameBlock info={info} theme={theme} showPhoto={true} />
          <div className="mt-2 mb-4"><ContactLine info={info} /></div>
          {info.summary && <div className="mb-4"><BoldHeading>{t("summary")}</BoldHeading><p className="text-sm leading-relaxed text-stone-700">{info.summary}</p></div>}
          {data.experience.some((e) => e.role) && (
            <div className="mb-4">
              <BoldHeading>{t("experience")}</BoldHeading>
              <div className="space-y-3 mt-1">
                {data.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline"><span className="font-semibold text-sm">{exp.role}{exp.company ? `, ${exp.company}` : ""}</span><span className="text-xs text-stone-500">{exp.period}</span></div>
                    {exp.bullets && <ul className="list-disc list-inside text-sm text-stone-700 mt-1">{exp.bullets.split("\n").filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}</ul>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.projects.some((p) => p.name) && <div className="mb-4"><BoldHeading>{t("projects")}</BoldHeading><ProjectsBlockRaw projects={data.projects} /></div>}
          {data.education.some((e) => e.school) && <div className="mb-4"><BoldHeading>{t("education")}</BoldHeading><EducationBlockRaw education={data.education} /></div>}
          {data.skillList.length > 0 && <div className="mb-4"><BoldHeading>{t("skills")}</BoldHeading><div className="flex flex-wrap gap-2 mt-1">{data.skillList.map((s, i) => <span key={i} className="text-xs rounded px-2 py-0.5" style={{ background: theme.tint, color: theme.primary }}>{s}</span>)}</div></div>}
          <LanguagesBlock languageList={data.languageList} theme={theme} title={t("languages")} />
          <CertificationsBlock certifications={data.certifications} theme={theme} title={t("certifications")} />
          <VolunteeringBlock volunteering={data.volunteering} theme={theme} title={t("volunteering")} />
          <HobbiesBlock hobbyList={data.hobbyList} theme={theme} title={t("interests")} />
          <AwardsBlock awardList={data.awardList} theme={theme} title={t("awards")} />
          <CustomSectionsBlock customSections={data.customSections} theme={theme} />
          <ReferencesBlock show={data.showReferences} text={data.referencesText} theme={theme} title={t("references")} />
        </div>
      </Page>
    );
  }

  if (layoutId === "elegant") {
    return (
      <Page>
        <div className="p-10">
          <div className="text-center border-y-2 py-4 mb-6" style={{ borderColor: theme.primary }}>
            <h1 className="text-3xl tracking-widest uppercase font-bold">{info.name || "Your Name"}</h1>
            <p className="text-sm mt-1 tracking-wide" style={{ color: theme.primary }}>{info.title || "Your Title"}</p>
            <div className="mt-2 flex justify-center"><ContactLine info={info} /></div>
          </div>
          <FullStack data={data} theme={theme} t={t} />
        </div>
      </Page>
    );
  }

  if (layoutId === "monogram") {
    const initials = (info.name || "").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
    return (
      <Page>
        <div className="p-6 flex items-center gap-4 border-b" style={{ borderColor: theme.tint }}>
          {info.photo ? (
            <img src={info.photo} alt="" className="w-14 h-14 rounded-full object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ background: theme.primary }}>{initials || "?"}</div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{info.name || "Your Name"}</h1>
            <p className="text-sm" style={{ color: theme.primary }}>{info.title || "Your Title"}</p>
          </div>
          <div className="ml-auto"><ContactLine info={info} /></div>
        </div>
        <div className="flex">
          <div className="w-[70%] p-6 border-r" style={{ borderColor: theme.tint }}><MainSections data={data} theme={theme} t={t} /></div>
          <div className="w-[30%] p-6"><SideSections data={data} theme={theme} t={t} /></div>
        </div>
      </Page>
    );
  }

  // classic (default)
  return (
    <Page>
      <div className="p-10">
        <div className="border-b-2 pb-3 mb-4" style={{ borderColor: theme.primary }}>
          <NameBlock info={info} theme={theme} />
          <div className="mt-2"><ContactLine info={info} /></div>
        </div>
        <MainSections data={data} theme={theme} t={t} />
        <SkillsBlock skillList={data.skillList} theme={theme} title={t("skills")} />
        <LanguagesBlock languageList={data.languageList} theme={theme} title={t("languages")} />
        <CertificationsBlock certifications={data.certifications} theme={theme} title={t("certifications")} />
        <HobbiesBlock hobbyList={data.hobbyList} theme={theme} title={t("interests")} />
      </div>
    </Page>
  );
}

/* raw (no heading) variants for boldBlocks layout where heading is custom */
function ProjectsBlockRaw({ projects }) {
  return (
    <div className="space-y-2 mt-1">
      {projects.filter((p) => p.name).map((p) => (
        <div key={p.id}>
          <div className="flex justify-between items-baseline"><span className="font-semibold text-sm">{p.name}</span>{p.tech && <span className="text-xs text-stone-500">{p.tech}</span>}</div>
          {p.description && <p className="text-sm text-stone-700">{p.description}</p>}
        </div>
      ))}
    </div>
  );
}
function EducationBlockRaw({ education }) {
  return (
    <div className="space-y-2 mt-1">
      {education.filter((e) => e.school).map((edu) => (
        <div key={edu.id} className="flex justify-between items-baseline">
          <span className="text-sm"><span className="font-semibold">{edu.school}</span>{edu.degree ? ` — ${edu.degree}` : ""}</span>
          <span className="text-xs text-stone-500">{edu.period}</span>
        </div>
      ))}
    </div>
  );
}
