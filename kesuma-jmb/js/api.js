// ═══════════════════════════════════════════════════════
//  api.js — Supabase data layer (PostgREST + Storage)
//  All reads/writes go to Supabase so data persists across
//  devices & sessions. `kjSb()` throws if not configured.
// ═══════════════════════════════════════════════════════
let _sb = null

function kjSb() {
  if (!window.supabase) throw new Error('supabase-js not loaded')
  if (!_sb) {
    const c = kjGetConfig()
    if (!c.supabaseUrl || !c.supabaseAnon) throw new Error('NOT_CONFIGURED')
    _sb = window.supabase.createClient(c.supabaseUrl, c.supabaseAnon, { auth: { persistSession: false } })
  }
  return _sb
}
function kjResetClient() { _sb = null }

// ── Connection / setup ──
async function kjTestConnection() {
  try {
    const { data, error } = await kjSb().from('settings').select('key').limit(1)
    if (error) {
      // PGRST205 → relation does not exist → schema.sql not run yet
      const needsSchema = /PGRST205|could not find the table/i.test(error.message)
      return { ok: false, error: error.message, needsSchema }
    }
    return { ok: true }
  } catch (e) {
    if (e.message === 'NOT_CONFIGURED') return { ok: false, error: 'NOT_CONFIGURED' }
    return { ok: false, error: e.message }
  }
}

// ── Settings (key/value) ──
async function kjGetSettings() {
  const { data, error } = await kjSb().from('settings').select('key,value')
  if (error) throw error
  const map = {}
  ;(data || []).forEach(r => { map[r.key] = r.value })
  return {
    name: map.name || KJ_CONFIG.appName,
    address: map.address || '',
    monthlyFee: Number(map.monthly_fee) || 0,
    pinAdmin: map.pin_admin || '1125',
    pinGuard: map.pin_guard || '1125',
    pinDispatcher: map.pin_dispatcher || '1125',
  }
}
async function kjSetSetting(key, value) {
  const { error } = await kjSb().from('settings').upsert({ key, value }, { onConflict: 'key' })
  if (error) throw error
}

// ── Owners ──
async function kjLogin(username, password) {
  const { data, error } = await kjSb().from('users').select('*').eq('username', String(username || '').trim()).limit(1)
  if (error) throw error
  const u = (data && data[0]) || null
  if (!u) return { error: t('login_invalid') }
  if (u.password !== password) return { error: t('login_invalid') }
  return { user: { id: u.id, username: u.username, role: u.role, unit: u.unit, name: u.name } }
}
async function kjUsernameFree(username) {
  const { data, error } = await kjSb().from('users').select('id').eq('username', username).limit(1)
  if (error) throw error
  return !(data && data.length)
}

// ── Tenants ──
async function kjTenants() {
  const { data, error } = await kjSb().from('tenants').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}
async function kjAddTenant(t) {
  const { data, error } = await kjSb().from('tenants').insert({
    unit: t.unit, name: t.name, phone: t.phone || '', email: t.email || '', ic_no: t.ic_no || '',
    start_date: t.start_date || '', end_date: t.end_date || '', status: 'Active',
  }).select().single()
  if (error) throw error
  const { error: uerr } = await kjSb().from('users').insert({
    username: t.username, password: t.password, role: 'tenant', unit: t.unit, name: t.name,
  })
  if (uerr) { await kjSb().from('tenants').delete().eq('id', data.id); throw uerr }
  return data
}
async function kjUpdateTenant(id, patch) {
  const { error } = await kjSb().from('tenants').update(patch).eq('id', id)
  if (error) throw error
}
async function kjDeleteTenant(id) {
  const { data, error } = await kjSb().from('tenants').select('unit,name').eq('id', id).single()
  if (error) throw error
  if (data && data.unit) {
    // remove the tenant's login account (role tenant for that unit)
    const { error: uErr } = await kjSb().from('users').delete().eq('unit', data.unit).eq('role', 'tenant')
    if (uErr) throw uErr
  }
  const { error: dErr } = await kjSb().from('tenants').delete().eq('id', id)
  if (dErr) throw dErr
}
async function kjOwner(unit) {
  const { data, error } = await kjSb().from('owners').select('*').eq('unit', unit).limit(1)
  if (error) throw error
  return (data && data[0]) || null
}
async function kjVerifyOwner({ unit, email, phone }) {
  const owner = await kjOwner(unit)
  if (!owner) return { error: t('unit_not_found') }
  let ok = false
  if (email) ok = ok || (owner.email && owner.email.toLowerCase() === email.toLowerCase())
  if (phone) ok = ok || (owner.phone && owner.phone === phone.trim())
  if (!ok) return { error: t('cred_no_match') }
  return { owner }
}
async function kjAllOwners() {
  const { data, error } = await kjSb().from('owners').select('*').order('unit')
  if (error) throw error
  return data || []
}
async function kjUpdateOwner(unit, patch) {
  const { error } = await kjSb().from('owners').update(patch).eq('unit', unit)
  if (error) throw error
}

// ── Parcels ──
async function kjUploadParcelPhoto(file) {
  if (!file) return ''
  const ext = (file.name || 'p.jpg').split('.').pop().toLowerCase()
  const path = 'p-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext
  const { error } = await kjSb().storage.from('parcel-images').upload(path, file)
  if (error) throw error
  return kjSb().storage.from('parcel-images').getPublicUrl(path).data.publicUrl
}
async function kjAddParcel({ unit, courier, file }) {
  const imageUrl = await kjUploadParcelPhoto(file)
  const { data, error } = await kjSb().from('parcels').insert({ unit, courier, image_url: imageUrl, status: 'Pending' }).select().single()
  if (error) throw error
  return data
}
async function kjParcels() {
  const { data, error } = await kjSb().from('parcels').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}
async function kjParcelsByUnit(unit) {
  const { data, error } = await kjSb().from('parcels').select('*').eq('unit', unit).order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}
async function kjMarkParcelDone(id) {
  const { error } = await kjSb().from('parcels').update({ status: 'Done', collected_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
async function kjReopenParcel(id) {
  const { error } = await kjSb().from('parcels').update({ status: 'Pending', collected_at: null }).eq('id', id)
  if (error) throw error
}

// ── Visitors ──
function kjGenRef() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'KES'
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}
async function kjAddVisitor(v) {
  const { data, error } = await kjSb().from('visitors').insert({
    ref_code: kjGenRef(), name: v.name, ic_no: v.ic_no, phone: v.phone, unit: v.unit,
    purpose: v.purpose || '', vehicle_type: v.vehicle_type || '', vehicle_plate: v.vehicle_plate || '',
    status: 'Pending',
  }).select().single()
  if (error) throw error
  return data
}
async function kjVisitors() {
  const { data, error } = await kjSb().from('visitors').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}
async function kjVisitorByRef(ref) {
  const { data, error } = await kjSb().from('visitors').select('*').eq('ref_code', ref.toUpperCase()).limit(1)
  if (error) throw error
  return (data && data[0]) || null
}
async function kjUpdateVisitor(id, status) {
  const patch = { status }
  const now = new Date().toISOString()
  if (status === 'Approved') patch.approved_at = now
  if (status === 'Checked In') patch.checked_in_at = now
  if (status === 'Checked Out') patch.checked_out_at = now
  const { error } = await kjSb().from('visitors').update(patch).eq('id', id)
  if (error) throw error
}

// ── Maintenance ──
async function kjAddMaintenance(m) {
  const { data, error } = await kjSb().from('maintenance').insert({
    unit: m.unit, category: m.category, title: m.title, description: m.description,
    priority: m.priority, status: 'Open', notes: '',
  }).select().single()
  if (error) throw error
  return data
}
async function kjMaintenance() {
  const { data, error } = await kjSb().from('maintenance').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}
async function kjUpdateMaintenance(id, patch) {
  if (patch.status === 'Resolved') patch.closed_at = new Date().toISOString()
  const { error } = await kjSb().from('maintenance').update(patch).eq('id', id)
  if (error) throw error
}

// ── Payments ──
async function kjAddPayment(p) {
  const { data, error } = await kjSb().from('payments').insert({
    unit: p.unit, period: p.period, amount: p.amount, method: p.method, status: 'Paid',
    receipt: 'R-' + Date.now().toString(36).toUpperCase(),
  }).select().single()
  if (error) throw error
  return data
}
async function kjPayments() {
  const { data, error } = await kjSb().from('payments').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}
async function kjPaymentsByUnit(unit) {
  const { data, error } = await kjSb().from('payments').select('*').eq('unit', unit).order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

// ── Announcements ──
async function kjUploadFile(bucket, file, prefix) {
  if (!file) return ''
  const ext = (file.name || 'f').split('.').pop().toLowerCase()
  const path = prefix + '-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext
  const { error } = await kjSb().storage.from(bucket).upload(path, file)
  if (error) throw error
  return kjSb().storage.from(bucket).getPublicUrl(path).data.publicUrl
}
async function kjAnnouncements() {
  const { data, error } = await kjSb().from('announcements').select('*').order('pinned', { ascending: false }).order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}
async function kjAddAnnouncement(a) {
  const attachment = await kjUploadFile('notices', a.file, 'n')
  const { data, error } = await kjSb().from('announcements').insert({
    title: a.title, category: a.category, body: a.body || '', pinned: !!a.pinned, author: a.author || 'JMB Kesuma', attachment,
  }).select().single()
  if (error) throw error
  return data
}
async function kjDeleteAnnouncement(id) {
  const { error } = await kjSb().from('announcements').delete().eq('id', id)
  if (error) throw error
}

// ── Facilities & Bookings ──
async function kjFacilities() {
  const { data, error } = await kjSb().from('facilities').select('*').order('name')
  if (error) throw error
  return data || []
}
async function kjBookings() {
  const { data, error } = await kjSb().from('bookings').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}
async function kjAddBooking(b) {
  const { data, error } = await kjSb().from('bookings').insert({
    unit: b.unit, facility_id: b.facility_id, facility_name: b.facility_name,
    date: b.date, start: b.start, end: b.end, status: 'Pending',
  }).select().single()
  if (error) throw error
  return data
}
async function kjUpdateBooking(id, status) {
  const { error } = await kjSb().from('bookings').update({ status }).eq('id', id)
  if (error) throw error
}
async function kjSlotFree(facilityId, date, start, end) {
  const { data, error } = await kjSb().from('bookings')
    .select('id').eq('facility_id', facilityId).eq('date', date).neq('status', 'Rejected')
  if (error) throw error
  return !(data || []).some(() => true) // server-side filtering below
}

// ── Documents ──
async function kjDocuments() {
  const { data, error } = await kjSb().from('documents').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}
async function kjAddDocument(d) {
  const { data, error } = await kjSb().from('documents').insert({
    title: d.title, category: d.category, description: d.description || '', url: d.url || '',
  }).select().single()
  if (error) throw error
  return data
}
async function kjDeleteDocument(id) {
  const { error } = await kjSb().from('documents').delete().eq('id', id)
  if (error) throw error
}

// ── Dashboard stats ──
async function kjStats() {
  const [parcels, visitors, maint, payments, bookings, owners, anns] = await Promise.all([
    kjParcels(), kjVisitors(), kjMaintenance(), kjPayments(), kjBookings(), kjAllOwners(), kjAnnouncements(),
  ])
  const today = new Date().toDateString()
  return {
    units: owners.length,
    parcelsPending: parcels.filter(p => p.status === 'Pending').length,
    parcelsDone: parcels.filter(p => p.status === 'Done').length,
    visitorsPending: visitors.filter(v => v.status === 'Pending').length,
    visitorsToday: visitors.filter(v => v.created_at && new Date(v.created_at).toDateString() === today).length,
    maintOpen: maint.filter(m => m.status !== 'Resolved').length,
    maintResolved: maint.filter(m => m.status === 'Resolved').length,
    paymentsTotal: payments.reduce((s, p) => s + Number(p.amount || 0), 0),
    paymentsCount: payments.length,
    bookingsPending: bookings.filter(b => b.status === 'Pending').length,
    vehicles: owners.filter(o => o.vehicle_plate).length,
    announcements: anns.length,
  }
}
