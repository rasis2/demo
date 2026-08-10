// ═══════════════════════════════════════════════════════
//  db.js — Local database engine for Kesuma JMB
//  Self-contained (localStorage) so the whole system runs
//  on static hosting (GitHub Pages / Netlify) with zero
//  servers. Mirrors the old Supabase schema 1:1.
// ═══════════════════════════════════════════════════════
const KJ_DB_KEY = 'kesuma_jmb_db_v2'
let kj_db = null

function kj_load() {
  if (kj_db) return kj_db
  try { kj_db = JSON.parse(localStorage.getItem(KJ_DB_KEY)) } catch (e) { kj_db = null }
  if (!kj_db || !kj_db.owners || !kj_db.owners.length) {
    kj_db = kj_seed()
    kj_save()
  }
  return kj_db
}
function kj_save() { localStorage.setItem(KJ_DB_KEY, JSON.stringify(kj_db)) }
function kj_uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8) }

// Generic collection helpers
function kj_col(name) { return (kj_load()[name] = kj_load()[name] || []) }
function kj_insert(name, obj) {
  const row = Object.assign({ id: kj_uid(), created_at: new Date().toISOString() }, obj)
  kj_col(name).unshift(row)
  kj_save()
  return row
}
function kj_update(name, id, patch) {
  const arr = kj_col(name)
  const i = arr.findIndex(x => x.id === id)
  if (i < 0) return false
  arr[i] = Object.assign({}, arr[i], patch)
  kj_save()
  return true
}
function kj_remove(name, id) {
  const arr = kj_col(name)
  const i = arr.findIndex(x => x.id === id)
  if (i < 0) return false
  arr.splice(i, 1)
  kj_save()
  return true
}

// ═══════════════════════════════════════════════════════
//  Unit catalogue — Residensi Kesuma, Beranang
//  475 units · 19 floors (4–22) · 25 units per floor
// ═══════════════════════════════════════════════════════
const KJ_FLOORS = Array.from({ length: 19 }, (_, i) => i + 4)
const KJ_UNITS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, '23A', 25]

// ═══════════════════════════════════════════════════════
//  Seed — realistic demo data so the app is alive on load
// ═══════════════════════════════════════════════════════
function kj_seed() {
  const owners = []
  KJ_FLOORS.forEach(f => {
    KJ_UNITS.forEach(u => {
      const unit = f + '-' + u
      const digit = typeof u === 'string' ? u.replace(/\D/g, '') : String(u)
      const phone = '01' + String((f * 37 + Number(digit) * 11) % 900000000 + 100000000)
      owners.push({
        unit,
        name: 'Pemilik ' + unit,
        email: 'unit' + f + '-' + String(u).replace('A', 'a') + '@kesuma.my',
        phone,
        ic_no: '',
        vehicle_plate: '',
        vehicle_model: '',
        parking_lot: '',
        resident: true,
      })
    })
  })
  // A few units have vehicles registered
  ;['4-1', '4-5', '7-12', '10-20', '15-7', '19-3', '22-25'].forEach((unit, i) => {
    const o = owners.find(x => x.unit === unit)
    if (o) { o.vehicle_plate = ['WXX 4521', 'BMW 1128', 'JKT 8812', 'VAF 3321', 'MXY 9910', 'WFA 5002', 'STK 8877'][i]; o.vehicle_model = ['Proton X50', 'Perodua Myvi', 'Honda City', 'Toyota Vios', 'Perodua Axia', 'Mitsubishi Xpander', 'Proton Saga'][i]; o.parking_lot = ['A-' + (i + 1), 'B-' + (i + 1), 'C-' + (i + 1), 'D-' + (i + 1), 'A-' + (i + 6), 'B-' + (i + 6), 'C-' + (i + 6)][i] }
  })

  const facilities = [
    { id: 'f-hall', name: 'Dewan Serbaguna', icon: '🏛️', capacity: 100, cost: 80 },
    { id: 'f-gym', name: 'Gimnasium', icon: '🏋️', capacity: 20, cost: 0 },
    { id: 'f-pool', name: 'Kolam Renang', icon: '🏊', capacity: 40, cost: 0 },
    { id: 'f-bbq', name: 'Tapak BBQ', icon: '🍢', capacity: 30, cost: 40 },
    { id: 'f-play', name: 'Taman Permainan', icon: '🛝', capacity: 50, cost: 0 },
    { id: 'f-read', name: 'Bilik Bacaan', icon: '📚', capacity: 15, cost: 0 },
  ]

  const now = Date.now()
  const day = 86400000
  const iso = (ms) => new Date(ms).toISOString()

  const parcels = [
    { id: 'p1', unit: '4-1', courier: 'J&T Express', image: '', status: 'Pending', created_at: iso(now - 1 * day), collected_at: null },
    { id: 'p2', unit: '4-5', courier: 'Pos Laju', image: '', status: 'Pending', created_at: iso(now - 3 * day), collected_at: null },
    { id: 'p3', unit: '7-12', courier: 'Shopee Express (SPX)', image: '', status: 'Pending', created_at: iso(now - 5 * day), collected_at: null },
    { id: 'p4', unit: '10-20', courier: 'Ninja Van', image: '', status: 'Pending', created_at: iso(now - 6 * day), collected_at: null },
    { id: 'p5', unit: '4-1', courier: 'Lazada Logistics', image: '', status: 'Done', created_at: iso(now - 8 * day), collected_at: iso(now - 7 * day) },
    { id: 'p6', unit: '15-7', courier: 'DHL', image: '', status: 'Done', created_at: iso(now - 10 * day), collected_at: iso(now - 9 * day) },
  ]

  const visitors = [
    { id: 'v1', ref_code: 'KES4X7MNP', name: 'Ahmad bin Ali', ic_no: '901234-01-1234', phone: '0123456789', unit: '4-1', purpose: 'Ziarah', vehicle_type: 'Kereta', vehicle_plate: 'WXX 4521', status: 'Pending', created_at: iso(now - 2 * 3600000), approved_at: null, checked_in_at: null, checked_out_at: null },
    { id: 'v2', ref_code: 'KES8D2QZR', name: 'Siti Nurhaliza', ic_no: '880101-02-5566', phone: '0134567890', unit: '7-12', purpose: 'Hantar Barang', vehicle_type: 'Motosikal', vehicle_plate: 'BMW 1128', status: 'Approved', created_at: iso(now - 26 * 3600000), approved_at: iso(now - 25 * 3600000), checked_in_at: null, checked_out_at: null },
    { id: 'v3', ref_code: 'KES9PL3WK', name: 'Rajesh Kumar', ic_no: '750620-14-8890', phone: '0172345678', unit: '10-20', purpose: 'Urusan Kerja', vehicle_type: 'Lori / Van', vehicle_plate: 'JKT 8812', status: 'Checked In', created_at: iso(now - 50 * 3600000), approved_at: iso(now - 48 * 3600000), checked_in_at: iso(now - 2 * 3600000), checked_out_at: null },
  ]

  const maintenance = [
    { id: 'm1', unit: '4-1', category: 'Elektrik', title: 'Lampu koridor tingkat 4 rosak', desc: 'Lampu di koridor hadapan unit 4-1 tidak menyala sejak semalam.', priority: 'Medium', status: 'Open', created_at: iso(now - 1 * day), closed_at: null, notes: '' },
    { id: 'm2', unit: '7-12', category: 'Paip', title: 'Paip bocor di bilik air', desc: 'Paip bawah sinki bocor, lantai sentiasa basah.', priority: 'High', status: 'In Progress', created_at: iso(now - 3 * day), closed_at: null, notes: 'Teknisi telah dijadualkan.' },
    { id: 'm3', unit: '10-20', category: 'Lif', title: 'Lif A bunyi kuat', desc: 'Lif A mengeluarkan bunyi kuat ketika sampai di tingkat 10.', priority: 'Low', status: 'Resolved', created_at: iso(now - 9 * day), closed_at: iso(now - 6 * day), notes: 'Servis lif telah dijalankan.' },
  ]

  const payments = [
    { id: 'pm1', unit: '4-1', period: 'Januari 2026', amount: 120, method: 'FPX', status: 'Paid', date: iso(now - 20 * day) },
    { id: 'pm2', unit: '4-1', period: 'Februari 2026', amount: 120, method: 'Cash', status: 'Paid', date: iso(now - 12 * day) },
    { id: 'pm3', unit: '4-5', period: 'Februari 2026', amount: 120, method: 'FPX', status: 'Paid', date: iso(now - 6 * day) },
    { id: 'pm4', unit: '7-12', period: 'Januari 2026', amount: 120, method: 'DuitNow', status: 'Paid', date: iso(now - 15 * day) },
  ]

  const announcements = [
    { id: 'a1', title: 'Mesyuarat Agung Tahunan (AGM) 2026', category: 'AGM', body: 'Mesyuarat Agung Tahunan akan diadakan pada 15 Mac 2026, jam 10:00 pagi di Dewan Serbaguna. Semua pemilik dijemput hadir.', pinned: true, author: 'JMB Kesuma', created_at: iso(now - 4 * day) },
    { id: 'a2', title: 'Kempen Kitar Semula', category: 'Kemudahan', body: 'Kempen kitar semula akan diadakan setiap Ahad pertama bulan. Sila asingkan bahan kitar semula anda.', pinned: false, author: 'JMB Kesuma', created_at: iso(now - 9 * day) },
    { id: 'a3', title: 'Servis Lif Berkala', category: 'Penyelenggaraan', body: 'Servis lif A dan B akan dijalankan pada 20 Februari 2026, 9:00 pagi hingga 5:00 petang. Kekurangan penggunaan maafkan.', pinned: false, author: 'JMB Kesuma', created_at: iso(now - 12 * day) },
  ]

  const bookings = [
    { id: 'b1', unit: '4-1', facility_id: 'f-hall', facility_name: 'Dewan Serbaguna', date: '2026-03-15', start: '10:00', end: '13:00', status: 'Approved', created_at: iso(now - 2 * day) },
    { id: 'b2', unit: '7-12', facility_id: 'f-bbq', facility_name: 'Tapak BBQ', date: '2026-03-01', start: '18:00', end: '22:00', status: 'Pending', created_at: iso(now - 1 * day) },
  ]

  const documents = [
    { id: 'd1', title: 'Minuta Mesyuarat AGM 2025', category: 'AGM', desc: 'Minuta rasmi mesyuarat agung tahunan 2025.', url: '', created_at: iso(now - 30 * day) },
    { id: 'd2', title: 'Penyata Kewangan 2025', category: 'Kewangan', desc: 'Penyata kewangan JMB bagi tahun 2025.', url: '', created_at: iso(now - 30 * day) },
    { id: 'd3', title: 'Borang Aduan Rasmi', category: 'Borang', desc: 'Borang aduan rasmi untuk penduduk.', url: '', created_at: iso(now - 20 * day) },
  ]

  return {
    owners, facilities, parcels, visitors, maintenance, payments, announcements, bookings, documents,
    fees: { monthly: 120, receipt_no: 1000 },
    settings: { pin_dispatcher: '1125', pin_guard: '1125', pin_admin: '1125', name: 'Residensi Kesuma', address: 'Beranang, Selangor' },
  }
}

// ═══════════════════════════════════════════════════════
//  Lookup helpers
// ═══════════════════════════════════════════════════════
function kj_owner(unit) { return kj_col('owners').find(o => o.unit.toLowerCase() === String(unit).toLowerCase()) || null }
function kj_getFees() { return kj_db ? kj_db.fees : kj_load().fees }
