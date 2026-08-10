// ═══════════════════════════════════════════════════════
//  config.js — Supabase configuration
//  Fill these two values with YOUR Supabase project, or use
//  the in-app Settings → Connection screen (saved to browser).
//    Project URL : Settings → API → Project URL
//    Anon Key    : Settings → API → anon public key
//  Then run schema.sql in your Supabase SQL Editor once.
// ═══════════════════════════════════════════════════════
const KJ_CONFIG = {
  appName: 'Kesuma JMB',
  appTagline: 'Sistem Pengurusan Harta',
  supabaseUrl: '',   // e.g. 'https://YOUR-PROJECT.supabase.co'
  supabaseAnon: '',  // e.g. 'eyJhbGciOi...'
}

// Runtime config: localStorage override wins, else defaults.
function kjGetConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem('kj_supabase_config') || '{}')
    return {
      supabaseUrl: (saved.supabaseUrl || KJ_CONFIG.supabaseUrl || '').trim(),
      supabaseAnon: (saved.supabaseAnon || KJ_CONFIG.supabaseAnon || '').trim(),
    }
  } catch (e) { return { supabaseUrl: '', supabaseAnon: '' } }
}
function kjSaveConfig(url, anon) {
  localStorage.setItem('kj_supabase_config', JSON.stringify({ supabaseUrl: url.trim(), supabaseAnon: anon.trim() }))
}
