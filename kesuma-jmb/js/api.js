// ═══════════════════════════════════════════════════════
//  api.js — API layer (localStorage backed via db.js)
//  Keeps the original function signatures so existing pages
//  keep working, and adds new modules for the full system.
// ═══════════════════════════════════════════════════════

// ── Upload helper (stores image as dataURL locally) ──
function uploadImage(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve('')
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Image read failed'))
    reader.readAsDataURL(file)
  })
}

// ═══════════════════════════════════════════
//  OWNERS & AUTH
// ═══════════════════════════════════════════

// Owner: verify identity then fetch parcels
async function apiCheckOwner({ unit, email, phone }) {
  const owner = kj_owner(unit)
  if (!owner) return { error: t ? t('owner_unit_not_found') : 'Unit not found' }

  let ok = false
  if (email) ok = ok || (owner.email && owner.email.toLowerCase() === email.toLowerCase())
  if (phone) ok = ok || (owner.phone && owner.phone === phone.trim())
  if (!ok) return { error: t ? t('owner_cred_error') : 'Email or phone does not match' }

  const parcels = kj_col('parcels').filter(p => p.unit === owner.unit)
    .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
    .map(p => ({ id: p.id, courier: p.courier, image: p.image, status: p.status, createdAt: p.created_at, collectedAt: p.collected_at }))

  const visitors = kj_col('visitors').filter(v => v.unit === owner.unit)
    .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))

  return { parcels, visitors, owner }
}

// Owner: mark parcel as collected
async function apiMarkDone(id) {
  return kj_update('parcels', id, { status: 'Done', collected_at: new Date().toISOString() })
}

// Dispatcher: add new parcel (file = raw File object)
async function apiAddParcel({ unit, courier, file }) {
  const image = await uploadImage(file)
  return kj_insert('parcels', { unit, courier, image, status: 'Pending' })
}

// Admin: all owners + their parcels
async function apiAdmin() {
  const owners = kj_col('owners').slice().sort((a, b) => a.unit.localeCompare(b.unit, undefined, { numeric: true }))
  const parcels = kj_col('parcels')
  return owners.map(o => ({
    unit: o.unit, email: o.email, phone: o.phone, name: o.name,
    parcels: parcels.filter(p => p.unit === o.unit).map(p => ({
      id: p.id, courier: p.courier, image: p.image, status: p.status, createdAt: p.created_at, collectedAt: p.collected_at
    }))
  }))
}

// Admin: update owner contact info
async function apiUpdateOwner(unit, { email, phone, name, ic_no }) {
  const patch = {}
  if (email !== undefined) patch.email = email
  if (phone !== undefined) patch.phone = phone
  if (name !== undefined) patch.name = name
  if (ic_no !== undefined) patch.ic_no = ic_no
  return kj_update('owners', kj_owner(unit).id, patch)
}

// ═══════════════════════════════════════════
//  VISITORS
// ═══════════════════════════════════════════

function genRefCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'KES'
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

async function apiRegisterVisitor({ name, ic_no, phone, unit, purpose, vehicle_type, vehicle_plate }) {
  const ref_code = genRefCode()
  return kj_insert('visitors', {
    ref_code, name, ic_no, phone, unit, purpose,
    vehicle_type: vehicle_type || '', vehicle_plate: vehicle_plate || '',
    status: 'Pending', approved_at: null, checked_in_at: null, checked_out_at: null,
  })
}

async function apiCheckVisitor(ref_code) {
  const v = kj_col('visitors').find(x => x.ref_code.toUpperCase() === String(ref_code).toUpperCase())
  return v || { error: 'Ref code not found' }
}

async function apiGetVisitors() {
  return kj_col('visitors').slice().sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
}

async function apiUpdateVisitor(id, status) {
  const patch = { status }
  if (status === 'Checked In') patch.checked_in_at = new Date().toISOString()
  if (status === 'Checked Out') patch.checked_out_at = new Date().toISOString()
  if (status === 'Approved') patch.approved_at = new Date().toISOString()
  return kj_update('visitors', id, patch)
}

// ═══════════════════════════════════════════
//  MAINTENANCE (Aduan & Penyelenggaraan)
// ═══════════════════════════════════════════
const MAINT_CATEGORIES = ['Elektrik', 'Paip', 'Lif', 'Kebocoran', 'Kebersihan', 'Keselamatan', 'Lain-lain']
const MAINT_PRIORITIES = ['Low', 'Medium', 'High']
const MAINT_STATUSES = ['Open', 'In Progress', 'Resolved']

async function apiAddMaintenance({ unit, category, title, desc, priority }) {
  return kj_insert('maintenance', { unit, category, title, desc, priority, status: 'Open', closed_at: null, notes: '' })
}
async function apiGetMaintenance() {
  return kj_col('maintenance').slice().sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
}
async function apiUpdateMaintenance(id, patch) {
  if (patch.status === 'Resolved') patch.closed_at = new Date().toISOString()
  return kj_update('maintenance', id, patch)
}

// ═══════════════════════════════════════════
//  PAYMENTS (Caj Penyelenggaraan)
// ═══════════════════════════════════════════
const PAY_METHODS = ['FPX', 'DuitNow', 'Cash', 'Bank Transfer', 'JomPAY']

async function apiGetFees() { return kj_load().fees }
async function apiSetFees(monthly) { kj_db.fees.monthly = Number(monthly) || 0; kj_save(); return kj_db.fees }
async function apiGetPayments() {
  return kj_col('payments').slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''))
}
async function apiAddPayment({ unit, period, amount, method }) {
  kj_db.fees.receipt_no = (kj_db.fees.receipt_no || 1000) + 1
  const receipt = 'R-' + kj_db.fees.receipt_no
  kj_save()
  return kj_insert('payments', { unit, period, amount: Number(amount), method, status: 'Paid', receipt })
}
async function apiGetOwnerPayments(unit) {
  return kj_col('payments').filter(p => p.unit === unit).sort((a, b) => (b.date || '').localeCompare(a.date || ''))
}
// Compute outstanding months for a unit vs the fee calendar
function apiOwnerBalance(unit, payments) {
  const fee = kj_load().fees.monthly || 0
  const paid = (payments || []).reduce((s, p) => s + (Number(p.amount) || 0), 0)
  return { fee, paid, outstanding: Math.max(0, fee - paid), coveredMonths: Math.floor(paid / fee) }
}

// ═══════════════════════════════════════════
//  ANNOUNCEMENTS
// ═══════════════════════════════════════════
const ANN_CATEGORIES = ['Penting', 'AGM', 'Penyelenggaraan', 'Kemudahan', 'Acara', 'Keselamatan']

async function apiGetAnnouncements() {
  return kj_col('announcements').slice().sort((a, b) => (b.pinned === a.pinned) ? (b.created_at || '').localeCompare(a.created_at || '') : (b.pinned ? 1 : -1))
}
async function apiAddAnnouncement({ title, category, body, pinned, author }) {
  return kj_insert('announcements', { title, category, body: body || '', pinned: !!pinned, author: author || 'JMB Kesuma' })
}
async function apiDeleteAnnouncement(id) { return kj_remove('announcements', id) }

// ═══════════════════════════════════════════
//  FACILITY BOOKINGS
// ═══════════════════════════════════════════
async function apiGetFacilities() { return kj_col('facilities') }
async function apiGetBookings() {
  return kj_col('bookings').slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''))
}
async function apiAddBooking({ unit, facility_id, facility_name, date, start, end }) {
  return kj_insert('bookings', { unit, facility_id, facility_name, date, start, end, status: 'Pending' })
}
async function apiUpdateBooking(id, status) { return kj_update('bookings', id, { status }) }
// Check slot availability (no overlapping approved/pending booking)
function apiSlotFree(facility_id, date, start, end) {
  return !kj_col('bookings').some(b =>
    b.facility_id === facility_id && b.date === date && b.status !== 'Rejected' &&
    ((start >= b.start && start < b.end) || (end > b.start && end <= b.end) || (start <= b.start && end >= b.end)))
}

// ═══════════════════════════════════════════
//  VEHICLES & PARKING
// ═══════════════════════════════════════════
async function apiGetVehicles() {
  return kj_col('owners').filter(o => o.vehicle_plate).map(o => ({
    id: o.id, unit: o.unit, plate: o.vehicle_plate, model: o.vehicle_model, lot: o.parking_lot,
  }))
}
async function apiAddVehicle({ unit, plate, model, lot }) {
  const o = kj_owner(unit)
  if (!o) return { error: 'Unit not found' }
  return kj_update('owners', o.id, { vehicle_plate: plate, vehicle_model: model, parking_lot: lot })
}
async function apiDeleteVehicle(id) {
  return kj_update('owners', id, { vehicle_plate: '', vehicle_model: '', parking_lot: '' })
}

// ═══════════════════════════════════════════
//  DOCUMENTS
// ═══════════════════════════════════════════
const DOC_CATEGORIES = ['AGM', 'Kewangan', 'Borang', 'Polisi', 'Laporan']

async function apiGetDocuments() {
  return kj_col('documents').slice().sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
}
async function apiAddDocument({ title, category, desc, url }) {
  return kj_insert('documents', { title, category, desc: desc || '', url: url || '' })
}
async function apiDeleteDocument(id) { return kj_remove('documents', id) }

// ═══════════════════════════════════════════
//  RESIDENTS / DIRECTORY
// ═══════════════════════════════════════════
async function apiAllOwners() {
  return kj_col('owners').slice().sort((a, b) => a.unit.localeCompare(b.unit, undefined, { numeric: true }))
}

// ═══════════════════════════════════════════
//  DASHBOARD STATS
// ═══════════════════════════════════════════
async function apiStats() {
  const owners = kj_col('owners')
  const parcels = kj_col('parcels')
  const visitors = kj_col('visitors')
  const maint = kj_col('maintenance')
  const payments = kj_col('payments')
  const bookings = kj_col('bookings')
  const vehCount = owners.filter(o => o.vehicle_plate).length
  return {
    units: owners.length,
    parcelsPending: parcels.filter(p => p.status === 'Pending').length,
    parcelsDone: parcels.filter(p => p.status === 'Done').length,
    visitorsPending: visitors.filter(v => v.status === 'Pending').length,
    visitorsToday: visitors.filter(v => v.created_at && new Date(v.created_at).toDateString() === new Date().toDateString()).length,
    maintOpen: maint.filter(m => m.status === 'Open' || m.status === 'In Progress').length,
    maintResolved: maint.filter(m => m.status === 'Resolved').length,
    paymentsTotal: payments.reduce((s, p) => s + (Number(p.amount) || 0), 0),
    paymentsCount: payments.length,
    bookingsPending: bookings.filter(b => b.status === 'Pending').length,
    vehicles: vehCount,
    announcements: kj_col('announcements').length,
  }
}
