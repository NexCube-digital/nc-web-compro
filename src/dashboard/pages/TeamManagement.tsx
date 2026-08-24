import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../services/api'
import Toast from '../../components/Toast'
import {
  Users,
  UserPlus,
  Search,
  Edit3,
  ExternalLink,
  Mail,
  CreditCard,
  Award,
  Sparkles,
  CheckCircle2,
  X,
  ArrowUpDown,
  Globe,
  Info,
} from 'lucide-react'

interface TeamAccount {
  id: number
  name: string
  email: string
  photo?: string
  isActive?: boolean
}

interface TeamItem {
  id?: number
  userId: number
  position: string
  image?: string
  bio?: string
  experience?: string
  expertise?: string[]
  bank?: string
  accountNumber?: string
  portfolioUrl?: string
  status?: 'active' | 'in-active'
  account?: TeamAccount
}

// Bentuk form edit — cuma field milik Team, name & email diambil read-only dari account
interface TeamEditForm {
  name: string      
  email: string     
  position: string
  image: string
  bio: string
  experience: string
  expertise: string[]
  bank: string
  accountNumber: string
  portfolioUrl: string
  status: 'active' | 'in-active'
}

const TeamManagement: React.FC = () => {
  const navigate = useNavigate()

  const [teams, setTeams] = useState<TeamItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<TeamItem | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: any } | null>(null)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'newest' | 'name' | 'id_asc'>('id_asc')

  const API_MEDIA_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '')

  const loadTeams = useCallback(async () => {
    try {
      setLoading(true)
      const res = await apiClient.getTeams()
      if (res.success && res.data && !Array.isArray(res.data) && Array.isArray((res.data as any).teams)) {
        setTeams((res.data as any).teams)
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data tim')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTeams()
  }, [loadTeams])

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = showForm ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showForm])

  const emptyForm: TeamEditForm = {
    name: '',
    email: '',
    position: '',
    image: '',
    bio: '',
    experience: '',
    expertise: [],
    portfolioUrl: '',
    bank: '',
    accountNumber: '',
    status: 'active',
  }

  const [form, setForm] = useState<TeamEditForm>({ ...emptyForm })

  const handleFileChange = (file?: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm(prev => ({ ...prev, image: reader.result as string }))
    reader.readAsDataURL(file)
  }

  // Create dihapus dari sini — tambah anggota tim sekarang lewat Manajemen User (role: Team)
  const goToAddTeamUser = useCallback(() => {
    navigate('/dashboard/users/formuser')
  }, [navigate])

 const openEdit = useCallback((t: TeamItem) => {
  const normalizedExpertise = Array.isArray(t.expertise)
    ? t.expertise
    : t.expertise
    ? (t.expertise as any).toString().split(',').map((s: string) => s.trim())
    : []
  setEditing(t)
  setForm({
    name: t.account?.name || '',       
    email: t.account?.email || '',     
    position: t.position,
    image: t.image || '',
    bio: t.bio || '',
    experience: t.experience || '',
    expertise: normalizedExpertise,
    bank: t.bank || '',
    accountNumber: t.accountNumber || '',
    portfolioUrl: t.portfolioUrl || '',
    status: t.status || 'active',
  })
  setShowForm(true)
}, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing || !editing.id) return // safety — modal ini cuma buat edit
    try {
      setLoading(true)
      setError('')
      const payload = { ...form, expertise: form.expertise.join(', ') }
      await apiClient.updateTeam(editing.id.toString(), payload)
      setToast({ msg: 'Profil tim berhasil diperbarui', type: 'success' })
      setShowForm(false)
      await loadTeams()
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan data')
      setToast({ msg: err.message || 'Gagal menyimpan data', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // Hapus anggota tim sekarang lewat hapus User (role: team) di Manajemen User —
  // tombol & handler delete di sini sengaja dihilangkan biar gak ada 2 sumber kebenaran.

  const filteredTeams = useMemo(() => {
    if (!Array.isArray(teams)) return [] as TeamItem[]
    const q = query.trim().toLowerCase()
    return teams
      .filter(t => {
        if (!q) return true
        return (
          (t.account?.name || '').toLowerCase().includes(q) ||
          (t.position || '').toLowerCase().includes(q) ||
          (t.expertise || []).join(' ').toLowerCase().includes(q)
        )
      })
      .sort((a, b) => {
        if (sort === 'name') return (a.account?.name || '').localeCompare(b.account?.name || '')
        if (sort === 'id_asc') return (a.id || 0) - (b.id || 0)
        return (b.id || 0) - (a.id || 0)
      })
  }, [teams, query, sort])

  const activeCount = useMemo(() => teams.filter(t => (t.status || 'active') === 'active').length, [teams])

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Manajemen Tim - NexCube Dashboard</title>
      </Helmet>

      {/* ── HEADER TITLE & CONTROLS ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Manajemen Tim
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                Kelola profil & posisi anggota tim ahli NexCube yang tampil pada publik
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, posisi, keahlian..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={e => setSort(e.target.value as any)}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs sm:text-sm text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-medium"
            >
              <option value="id_asc">ID Terlama</option>
              <option value="newest">Terbaru</option>
              <option value="name">Nama (A - Z)</option>
            </select>
            <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Add Button → arahkan ke Manajemen User, bukan modal create di sini */}
          <button
            onClick={goToAddTeamUser}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Anggota</span>
          </button>
        </div>
      </div>

      {/* Info banner — jelasin alur baru */}
      <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs sm:text-sm rounded-xl px-4 py-3">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <p>
          Penambahan dan penghapusan anggota tim kini dilakukan melalui halaman <strong>Manajemen User</strong> (pilih role Team).
          Halaman ini hanya digunakan untuk mengedit profil publik anggota tim yang sudah terdaftar.
        </p>
      </div>

      {/* ── METRIC CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Total Anggota</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">{teams.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Status Aktif</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">{activeCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Tampil di Halaman Publik</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">{activeCount} Tim</p>
          </div>
        </div>
      </div>

      {/* ── TEAM GRID DISPLAY ── */}
      <div className="relative min-h-[250px]">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-xs rounded-2xl">
            <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-blue-600" />
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
            {error}
          </div>
        )}

        {filteredTeams.length === 0 && !loading ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Belum Ada Anggota Tim</h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
              {query ? 'Tidak ada anggota tim yang cocok dengan pencarian Anda.' : 'Tambahkan anggota tim baru lewat Manajemen User.'}
            </p>
            <button
              onClick={goToAddTeamUser}
              className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Anggota Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredTeams.map(t => {
              const imageUrl = t.image
                ? typeof t.image === 'string' && t.image.startsWith('/uploads')
                  ? `${API_MEDIA_BASE}${t.image}`
                  : t.image
                : '/images/team/team-1.jpg'

              const isActive = (t.status || 'active') === 'active'
              const accountActive = t.account?.isActive !== false

              return (
                <div
                  key={t.id}
                  className="group bg-white rounded-xl border border-slate-200/70 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col overflow-hidden"
                >
                  <div className="bg-slate-50/70 border-b border-slate-100 p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-slate-200 shadow-2xs flex-shrink-0 bg-slate-100 group-hover:scale-105 transition-transform duration-200">
                          <img
                            src={imageUrl}
                            alt={t.account?.name}
                            className="w-full h-full object-cover"
                            onError={e => {
                              ;(e.target as HTMLImageElement).src = '/images/team/team-1.jpg'
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate leading-tight group-hover:text-blue-600 transition-colors">
                            {t.account?.name || '(Akun tidak ditemukan)'}
                          </h3>
                          <span className="inline-block text-[11px] font-semibold text-blue-600 bg-blue-50/80 border border-blue-100 px-2 py-0.5 rounded-md mt-0.5 truncate">
                            {t.position}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                              : 'bg-slate-100 text-slate-500 border-slate-200/60'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {isActive ? 'Aktif' : 'Non-aktif'}
                        </span>
                        {!accountActive && (
                          <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200/60 px-2 py-0.5 rounded-full">
                            Akun nonaktif
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">#{t.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                      {t.account?.email && (
                        <div className="flex items-center gap-2 truncate">
                          <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{t.account.email}</span>
                        </div>
                      )}
                      {t.experience && (
                        <div className="flex items-center gap-2">
                          <Award className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                          <span className="font-medium text-slate-700">{t.experience} Pengalaman</span>
                        </div>
                      )}
                      {t.portfolioUrl && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                          <a
                            href={t.portfolioUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 font-semibold hover:underline flex items-center gap-1 text-xs truncate"
                          >
                            <span>Portfolio Web</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>

                    {t.bio && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3 italic bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                        "{t.bio}"
                      </p>
                    )}

                    {t.expertise && (Array.isArray(t.expertise) ? t.expertise.length > 0 : true) && (
                      <div className="mt-auto pt-2">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                          Keahlian:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(t.expertise)
                            ? t.expertise
                            : String(t.expertise || '').split(',')
                          ).map((e: string, i: number) => {
                            const tag = e.trim()
                            if (!tag) return null
                            return (
                              <span
                                key={i}
                                className="text-[10px] font-semibold bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-2 py-0.5 rounded-md border border-slate-200/60 transition-colors"
                              >
                                {tag}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {(t.bank || t.accountNumber) && (
                      <div className="mt-3 text-[11px] text-slate-600 bg-slate-50 border border-slate-200/70 rounded-lg px-2.5 py-1.5 flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="font-semibold text-slate-800">{t.bank || 'Bank'}</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-mono text-slate-700">{t.accountNumber || '-'}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Actions Footer — cuma Edit, delete udah dipindah ke Manajemen User */}
                  <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100">
                    <button
                      onClick={() => openEdit(t)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 rounded-xl text-xs font-bold transition-all shadow-2xs hover:shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Profil Tim</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── FORM MODAL (edit-only) ── */}
      {showForm &&
        editing &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
              onClick={() => setShowForm(false)}
            />

            {(() => {
              let avatarUrl = '/images/team/team-1.jpg'
              if (form.image && typeof form.image === 'string') {
                if (form.image.startsWith('/uploads')) avatarUrl = `${API_MEDIA_BASE}${form.image}`
                else if (form.image.startsWith('http') || form.image.startsWith('data:')) avatarUrl = form.image
                else avatarUrl = form.image
              }

              return (
                <form
                  onSubmit={handleSubmit}
                  className="relative z-10 bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 my-auto overflow-hidden"
                >
                  {/* Modal Header */}
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-blue-100 text-blue-700 font-bold">
                        <Edit3 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                          Edit Profil Tim
                        </h3>
                        <p className="text-xs text-slate-500">
                          {editing.account?.name} · {editing.account?.email}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Modal Body Scrollable */}
                  <div className="p-6 overflow-y-auto space-y-5 flex-1">
                    {/* Avatar */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">Foto Profil Tim</label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-slate-200 flex-shrink-0">
                          <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <label className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer">
                            <span>Ganti Foto</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => handleFileChange(e.target.files && e.target.files[0])}
                            />
                          </label>
                          <p className="text-[11px] text-slate-400 mt-1">JPG, PNG, WEBP · Maks 2.5 MB</p>
                        </div>
                      </div>
                    </div>
                
                    {/* Nama & Email — read-only, ambil dari akun User */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      <div>
    <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Lengkap *</label>
    <input
      required
      type="text"
      placeholder="Nama lengkap anggota tim"
      value={form.name}
      onChange={e => setForm({ ...form, name: e.target.value })}
      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
    />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Email *</label>
                          <input
                            required
                            type="email"
                            placeholder="nama@email.com"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                          />
                        </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Posisi / Jabatan *</label>
                        <input
                          required
                          type="text"
                          placeholder="Contoh: Senior Fullstack Engineer"
                          value={form.position}
                          onChange={e => setForm({ ...form, position: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Pengalaman</label>
                        <input
                          type="text"
                          placeholder="Contoh: 5 tahun"
                          value={form.experience}
                          onChange={e => setForm({ ...form, experience: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Portfolio URL</label>
                        <input
                          type="url"
                          placeholder="https://portfolio.com"
                          value={form.portfolioUrl}
                          onChange={e => setForm({ ...form, portfolioUrl: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Bank</label>
                        <select
                          value={form.bank}
                          onChange={e => setForm({ ...form, bank: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 cursor-pointer"
                        >
                          <option value="">Pilih Bank</option>
                          <option value="BCA">BCA</option>
                          <option value="Mandiri">Mandiri</option>
                          <option value="BNI">BNI</option>
                          <option value="BRI">BRI</option>
                          <option value="CIMB">CIMB Niaga</option>
                          <option value="SeaBank">SeaBank</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">No. Rekening</label>
                        <input
                          type="text"
                          placeholder="1234567890"
                          value={form.accountNumber}
                          onChange={e => setForm({ ...form, accountNumber: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Keahlian / Skill</label>
                        <input
                          type="text"
                          placeholder="React, TypeScript, Node.js, UI/UX"
                          value={form.expertise.join(', ')}
                          onChange={e => setForm({ ...form, expertise: e.target.value.split(',').map(s => s.trim()) })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">Pisahkan dengan koma untuk memasukkan beberapa keahlian</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Status Tampilan</label>
                        <select
                          value={form.status}
                          onChange={e => setForm({ ...form, status: e.target.value as 'active' | 'in-active' })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 cursor-pointer"
                        >
                          <option value="active">Active (Tampil di halaman publik)</option>
                          <option value="in-active">In-active (Disembunyikan)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Bio / Deskripsi Singkat</label>
                        <textarea
                          rows={3}
                          placeholder="Ceritakan singkat latar belakang atau peran anggota tim..."
                          value={form.bio}
                          onChange={e => setForm({ ...form, bio: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-bold text-xs sm:text-sm hover:bg-slate-100 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {loading && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
                      <span>Update Profil</span>
                    </button>
                  </div>
                </form>
              )
            })()}
          </div>,
          document.body
        )}

      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type === 'success' ? 'success' : 'error'}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default TeamManagement