import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Star, CheckCircle, ArrowLeft, SlidersHorizontal,
  ChevronDown, ChevronUp, X, Sparkles, Upload,
  Building2, User, MessageSquareQuote, Camera,
  Send, Clock, Trophy, Smile, MessageCircle, Quote
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import apiClient, { getImageUrl } from '../services/api'
import { Layout } from '../components/layout/Layout'

// ─── Types ────────────────────────────────────────────────────────────────────
interface TestimonialItem {
  id?: number
  name: string
  company: string
  text: string
  rating: number
  avatar: string
  createdAt?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ACCEPTED_TYPES  = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_MB     = 2
const COOLDOWN_DAYS   = 7
const STORAGE_KEY     = 'nexcube_last_testimonial_submit'
const RATING_LABELS   = ['', 'Sangat Buruk', 'Buruk', 'Cukup', 'Baik', 'Sangat Baik']
const RATING_COLORS   = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6']

// ─── Rate-limit helpers ───────────────────────────────────────────────────────
const getLastSubmit = (): number | null => {
  const v = localStorage.getItem(STORAGE_KEY)
  return v ? parseInt(v, 10) : null
}
const setLastSubmit = () => localStorage.setItem(STORAGE_KEY, Date.now().toString())
const checkCooldown = () => {
  const last = getLastSubmit()
  if (!last) return { allowed: true, daysLeft: 0 }
  const days = (Date.now() - last) / 86_400_000
  return { allowed: days >= COOLDOWN_DAYS, daysLeft: Math.max(0, Math.ceil(COOLDOWN_DAYS - days)) }
}

// ─── Stars ───────────────────────────────────────────────────────────────────
const Stars = ({ rating, interactive = false, onSet, size = 'sm' }: {
  rating: number; interactive?: boolean; onSet?: (v: number) => void; size?: 'sm' | 'lg'
}) => {
  const [hovered, setHovered] = useState(0)
  const active = interactive ? (hovered || rating) : rating
  return (
    <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
      {[1,2,3,4,5].map(s => (
        <button
          key={s}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onSet?.(s)}
          onMouseEnter={() => interactive && setHovered(s)}
          className={interactive ? 'transition-transform hover:scale-125 focus:outline-none' : 'cursor-default'}
        >
          <Star
            className={`transition-all duration-150 ${size === 'lg' ? 'w-8 h-8' : 'w-4 h-4'}`}
            fill={s <= active ? '#FBBF24' : 'transparent'}
            stroke={s <= active ? '#FBBF24' : '#CBD5E1'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, value, label, accent }: {
  icon: React.FC<any>; value: string | number; label: string; accent: string
}) => (
  <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-100 p-5 shadow-sm group hover:shadow-md transition-all duration-300">
    <div className={`absolute top-0 left-0 w-1 h-full ${accent}`} />
    <div className="pl-2">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${accent.replace('bg-', 'bg-').replace('-600','-50')}`}>
        <Icon className={`w-4.5 h-4.5 ${accent.replace('bg-', 'text-')}`} strokeWidth={2} />
      </div>
      <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5 font-medium">{label}</div>
    </div>
  </div>
)

// ─── RatingBar ────────────────────────────────────────────────────────────────
const RatingBar = ({ r, n, total, active, onClick }: {
  r: number; n: number; total: number; active: boolean; onClick: () => void
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${
      active ? 'bg-amber-50 ring-1 ring-amber-200' : 'hover:bg-slate-50'
    }`}
  >
    <span className="text-xs font-bold text-slate-600 w-2">{r}</span>
    <Star className="w-3.5 h-3.5 flex-shrink-0" fill="#FBBF24" stroke="#FBBF24" />
    <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500"
        style={{ width: total ? `${(n/total)*100}%` : '0%' }}
      />
    </div>
    <span className="text-xs font-bold text-slate-400 w-4 text-right">{n}</span>
  </button>
)

// ─── Main ─────────────────────────────────────────────────────────────────────
export const CreateUlasan: React.FC = () => {
  const navigate = useNavigate()
  const fileRef  = useRef<HTMLInputElement>(null)

  const [all,        setAll]       = useState<TestimonialItem[]>([])
  const [loading,    setLoading]   = useState(true)
  const [filter,     setFilter]    = useState<number | null>(null)
  const [showFilter, setShowFilter]= useState(false)
  const [form,       setForm]      = useState({ name:'', company:'', text:'', rating:5, avatar:'' })
  const [avatarFile, setAvatarFile]= useState<File | null>(null)
  const [errors,     setErrors]    = useState<{name?:string; text?:string}>({})
  const [submitting, setSubmitting]= useState(false)
  const [cooldown,   setCooldown]  = useState(checkCooldown())
  const [formOpen,   setFormOpen]  = useState(true)

  const fetchAll = async () => {
    try {
      setLoading(true)
      const res = await apiClient.getPublishedTestimonials()
      if (res.data?.testimonials) setAll(res.data.testimonials)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }
  useEffect(() => { fetchAll() }, [])

  const avg      = all.length ? (all.reduce((s,t) => s+t.rating, 0) / all.length).toFixed(1) : '0'
  const dist     = [5,4,3,2,1].map(r => ({ r, n: all.filter(t=>t.rating===r).length }))
  const filtered = filter ? all.filter(t=>t.rating===filter) : all
  const pctHappy = all.length ? Math.round((all.filter(t=>t.rating>=4).length/all.length)*100) : 0

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!ACCEPTED_TYPES.includes(f.type)) { toast.error('Gunakan JPG, PNG, atau WEBP.'); return }
    if (f.size > MAX_SIZE_MB*1024*1024) { toast.error(`Maks. ${MAX_SIZE_MB}MB.`); return }
    if (form.avatar.startsWith('blob:')) URL.revokeObjectURL(form.avatar)
    setAvatarFile(f)
    setForm(p=>({...p, avatar:URL.createObjectURL(f)}))
  }
  const removeAvatar = () => {
    if (form.avatar.startsWith('blob:')) URL.revokeObjectURL(form.avatar)
    setAvatarFile(null)
    setForm(p=>({...p, avatar:''}))
    if (fileRef.current) fileRef.current.value=''
  }
  const toBase64 = (f: File): Promise<string> =>
    new Promise((res,rej)=>{ const r=new FileReader(); r.readAsDataURL(f); r.onload=()=>res(r.result as string); r.onerror=rej })

  const handleSubmit = async () => {
    const c = checkCooldown()
    if (!c.allowed) { toast.error(`Tunggu ${c.daysLeft} hari lagi`, { icon:'⏱️' }); return }
    const errs: {name?:string;text?:string} = {}
    if (!form.name.trim()) errs.name = 'Nama wajib diisi'
    if (!form.text.trim()) errs.text = 'Ulasan wajib diisi'
    if (Object.keys(errs).length) { setErrors(errs); return }
    try {
      setSubmitting(true)
      const payload: any = { name:form.name, company:form.company, text:form.text, rating:form.rating, status:'pending' }
      if (avatarFile) payload.avatar = await toBase64(avatarFile)
      const res = await apiClient.createPublicTestimonial(payload)
      if (res.data?.testimonial) {
        setLastSubmit(); setCooldown(checkCooldown())
        await fetchAll()
        if (form.avatar.startsWith('blob:')) URL.revokeObjectURL(form.avatar)
        setAvatarFile(null)
        setForm({ name:'', company:'', text:'', rating:5, avatar:'' })
        setErrors({})
        if (fileRef.current) fileRef.current.value=''
        setFormOpen(false)
        toast.success('Terima kasih! Ulasan akan tampil setelah diverifikasi admin.', { duration:5000, icon:'🎉' })
      }
    } catch (e:any) {
      toast.error(e.message || 'Gagal mengirim ulasan.')
    } finally { setSubmitting(false) }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 font-sans">

        {/* ── Background ── */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#f8fafc,#f1f5f9)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-blue-600/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-orange-500/5 rounded-full blur-[100px]" />
          {/* grid */}
          <div className="absolute inset-0 opacity-[0.018]"
            style={{ backgroundImage:'linear-gradient(#0f172a 1px,transparent 1px),linear-gradient(90deg,#0f172a 1px,transparent 1px)', backgroundSize:'40px 40px' }} />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">

          {/* ── Back btn ── */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Kembali
          </button>

          {/* ── HERO ── */}
          <div className="relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6">
              <div className="flex-1 space-y-3">
                <div className="inline-flex items-center gap-2 bg-blue-600/8 border border-blue-200/60 px-3.5 py-1.5 rounded-full">
                  <MessageSquareQuote className="w-3.5 h-3.5 text-blue-600" strokeWidth={2.5} />
                  <span className="text-xs font-bold text-blue-700 tracking-wider uppercase">Ulasan & Testimoni</span>
                </div>
                <h1 className="text-4xl sm:text-[52px] font-black text-slate-900 leading-[1.05] tracking-tight">
                  Apa Kata<br />
                  <span className="relative">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Klien Kami?</span>
                    <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
                      <path d="M0 5 Q50 0 100 4 Q150 8 200 3" stroke="#F97316" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    </svg>
                  </span>
                </h1>
                <p className="text-slate-500 text-base max-w-sm leading-relaxed">
                  Cerita nyata dari klien yang telah mempercayakan bisnis mereka bersama NexCube.
                </p>
              </div>

              
            </div>
          </div>


          {/* ── Two-column ── */}
          {/* Mobile: form first (order-1), list second (order-2) */}
          {/* Desktop: list left, form right (restored via lg:order) */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

            {/* ══ LEFT — list (order-2 on mobile, order-1 on desktop) ══ */}
            <section className="space-y-4 order-2 lg:order-1">

              {/* filter bar */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-800">
                    {filter ? `Ulasan ${filter} Bintang` : 'Semua Ulasan'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">{filtered.length} ulasan ditemukan</p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowFilter(v=>!v)}
                    className={`flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl border transition-all shadow-sm ${
                      filter
                        ? 'bg-blue-600 text-white border-blue-600 shadow-blue-200'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={2.5} />
                    {filter ? `${filter} Bintang` : 'Filter'}
                    {showFilter
                      ? <ChevronUp className="w-3.5 h-3.5" />
                      : <ChevronDown className="w-3.5 h-3.5" />
                    }
                  </button>

                  {showFilter && (
                    <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 w-48 z-20">
                      <button onClick={() => { setFilter(null); setShowFilter(false) }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                          !filter ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-600'
                        }`}>
                        Semua ({all.length})
                      </button>
                      {dist.map(({r,n}) => (
                        <button key={r} onClick={() => { setFilter(r); setShowFilter(false) }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                            filter===r ? 'bg-amber-50 text-amber-800' : 'hover:bg-slate-50 text-slate-600'
                          }`}>
                          <div className="flex items-center gap-1.5">
                            {[...Array(r)].map((_,i) =>
                              <Star key={i} className="w-3 h-3" fill="#FBBF24" stroke="#FBBF24" />
                            )}
                          </div>
                          <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full font-bold">{n}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* cards */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <div className="w-8 h-8 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-slate-400 text-sm font-medium">Memuat ulasan...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-24 space-y-3">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
                    <MessageCircle className="w-7 h-7 text-slate-300" />
                  </div>
                  <p className="font-bold text-slate-600">
                    {filter ? `Belum ada ulasan ${filter} bintang` : 'Belum ada ulasan'}
                  </p>
                  <p className="text-slate-400 text-sm">Jadilah yang pertama memberikan ulasan!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filtered.map((t, i) => (
                    <article
                      key={t.id ?? i}
                      className="group bg-white rounded-2xl border border-slate-100/80 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col relative overflow-hidden"
                    >
                      {/* accent top */}
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* quote icon */}
                      <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Quote className="w-10 h-10 text-blue-600" />
                      </div>

                      <Stars rating={t.rating} />

                      <blockquote className="mt-3 text-slate-600 text-[13.5px] leading-relaxed flex-1 line-clamp-4 font-medium">
                        "{t.text}"
                      </blockquote>

                      <footer className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-sm ring-2 ring-white">
                          {t.avatar
                            ? <img src={getImageUrl(t.avatar)} alt={t.name} className="w-full h-full object-cover"
                                onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                            : <span className="text-white font-black text-sm">{t.name.charAt(0).toUpperCase()}</span>
                          }
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-black text-slate-800 text-sm truncate">{t.name}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-1 truncate mt-0.5">
                            <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" strokeWidth={2.5} />
                            <span>{t.company || 'Verified Customer'}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="text-xs font-black px-2 py-0.5 rounded-lg"
                            style={{ background: `${RATING_COLORS[t.rating]}15`, color: RATING_COLORS[t.rating] }}>
                            {t.rating}.0
                          </span>
                        </div>
                      </footer>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* ══ RIGHT — form (order-1 on mobile, order-2 on desktop) ══ */}
            <aside className="lg:sticky lg:top-20 order-1 lg:order-2">
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">

                {/* top gradient bar */}
                <div className="h-1 bg-gradient-to-r from-blue-600 via-violet-500 to-orange-500" />

                {/* header */}
                <button
                  className="w-full flex items-center justify-between px-6 pt-5 pb-4 lg:cursor-default"
                  onClick={() => setFormOpen(v=>!v)}
                >
                  <div className="text-left">
                    <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                      </div>
                      Tulis Ulasan Anda
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 ml-9">Bagikan pengalaman bersama NexCube</p>
                  </div>
                  <div className="lg:hidden text-slate-400">
                    {formOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* form body */}
                <div className={`transition-all duration-300 overflow-hidden ${formOpen ? 'max-h-[9999px] opacity-100' : 'max-h-0 opacity-0 lg:max-h-[9999px] lg:opacity-100'}`}>
                  <div className="px-6 pb-6 space-y-4">

                    {/* cooldown */}
                    {!cooldown.allowed && (
                      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl px-4 py-3.5 flex gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-amber-800">Sudah mengirim ulasan</p>
                          <p className="text-xs text-amber-600 mt-0.5">
                            Anda bisa mengirim lagi dalam <strong>{cooldown.daysLeft} hari</strong>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* rating */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Rating <span className="text-red-400">*</span>
                      </label>
                      <div className="bg-slate-50 rounded-xl px-4 py-3.5 flex items-center gap-3 border border-slate-100">
                        <Stars rating={form.rating} interactive={cooldown.allowed && !submitting}
                          onSet={v => setForm(p=>({...p, rating:v}))} size="lg" />
                        <div className="ml-1 border-l border-slate-200 pl-3">
                          <p className="text-sm font-black text-slate-800">{form.rating}/5</p>
                          <p className="text-xs font-medium" style={{ color: RATING_COLORS[form.rating] }}>
                            {RATING_LABELS[form.rating]}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* nama */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Nama <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" strokeWidth={2} />
                        <input
                          type="text" placeholder="Nama lengkap Anda"
                          value={form.name} disabled={submitting || !cooldown.allowed}
                          onChange={e => { setForm(p=>({...p,name:e.target.value})); if(errors.name) setErrors(p=>({...p,name:undefined})) }}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all disabled:bg-slate-50 disabled:cursor-not-allowed ${
                            errors.name
                              ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100'
                              : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white'
                          }`}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                          <X className="w-3 h-3" /> {errors.name}
                        </p>
                      )}
                    </div>

                    {/* perusahaan */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Perusahaan <span className="text-slate-300 font-normal normal-case text-[11px]">(opsional)</span>
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" strokeWidth={2} />
                        <input
                          type="text" placeholder="Nama usaha / perusahaan"
                          value={form.company} disabled={submitting || !cooldown.allowed}
                          onChange={e => setForm(p=>({...p,company:e.target.value}))}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white text-sm outline-none transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* ulasan */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Ulasan <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        placeholder="Ceritakan pengalaman Anda menggunakan layanan NexCube..."
                        rows={4} value={form.text} disabled={submitting || !cooldown.allowed}
                        onChange={e => { setForm(p=>({...p,text:e.target.value})); if(errors.text) setErrors(p=>({...p,text:undefined})) }}
                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all resize-none disabled:bg-slate-50 disabled:cursor-not-allowed ${
                          errors.text
                            ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100'
                            : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white'
                        }`}
                      />
                      {errors.text && (
                        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                          <X className="w-3 h-3" /> {errors.text}
                        </p>
                      )}
                    </div>

                    {/* foto */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Foto Profil <span className="text-slate-300 font-normal normal-case text-[11px]">(opsional)</span>
                      </label>
                      <input ref={fileRef} type="file" accept={ACCEPTED_TYPES.join(',')}
                        onChange={handleFile} className="hidden" disabled={submitting || !cooldown.allowed} />

                      {form.avatar ? (
                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm flex-shrink-0 ring-2 ring-white">
                            <img src={form.avatar} alt="preview" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-700 truncate">{avatarFile?.name}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{avatarFile ? `${(avatarFile.size/1024).toFixed(0)} KB` : ''}</p>
                          </div>
                          <div className="flex gap-1.5">
                            <button type="button" onClick={() => fileRef.current?.click()}
                              disabled={submitting || !cooldown.allowed}
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-200 disabled:opacity-50">
                              <Camera className="w-3.5 h-3.5" strokeWidth={2.5} />
                            </button>
                            <button type="button" onClick={removeAvatar}
                              disabled={submitting || !cooldown.allowed}
                              className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors border border-red-200 disabled:opacity-50">
                              <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button type="button" disabled={submitting || !cooldown.allowed}
                          onClick={() => fileRef.current?.click()}
                          className="w-full border-2 border-dashed border-slate-200 rounded-xl py-4 flex items-center gap-3 px-4 hover:border-blue-400 hover:bg-blue-50/40 transition-all group disabled:opacity-50 disabled:cursor-not-allowed">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors flex-shrink-0">
                            <Upload className="w-4.5 h-4.5 text-slate-400 group-hover:text-blue-500 transition-colors" strokeWidth={2} />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors">Upload foto profil</p>
                            <p className="text-xs text-slate-400">JPG, PNG, WEBP — maks. {MAX_SIZE_MB}MB</p>
                          </div>
                        </button>
                      )}
                    </div>

                    {/* submit */}
                    {cooldown.allowed ? (
                      <button type="button" onClick={handleSubmit} disabled={submitting}
                        className="w-full relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:translate-y-0 disabled:cursor-not-allowed group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {submitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10" />
                            <span className="relative z-10">Mengirim...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 relative z-10" strokeWidth={2.5} />
                            <span className="relative z-10">Kirim Ulasan</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="w-full bg-slate-100 text-slate-400 py-3.5 rounded-2xl font-black text-sm text-center cursor-not-allowed select-none">
                        Kirim Ulasan
                      </div>
                    )}

                    <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
                      <CheckCircle className="w-3 h-3 text-emerald-400" strokeWidth={2.5} />
                      Ulasan ditampilkan setelah diverifikasi admin
                    </p>

                  </div>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CreateUlasan