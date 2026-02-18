import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Helmet } from 'react-helmet-async'
import apiClient from '../../services/api'
import Toast from '../../components/Toast'

interface TeamItem {
  id?: number
  name: string
  position: string
  image?: string
  bio?: string
  experience?: string
  expertise?: string[]
  email?: string
  bank?: string
  accountNumber?: string
  portfolioUrl?: string
  status?: 'active' | 'in-active'
}

const TeamManagement: React.FC = () => {
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
      setError(err.message || 'Failed to load team')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadTeams() }, [loadTeams])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showForm])

  const emptyForm = useMemo<TeamItem>(() => ({
    name: '',
    position: '',
    image: '',
    bio: '',
    experience: '',
    expertise: [],
    portfolioUrl: '',
    bank: '',
    accountNumber: '',
    email: '',
    status: 'active'
  }), [])
  const [form, setForm] = useState<TeamItem>({ ...emptyForm })
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [dragActive, setDragActive] = useState(false)

  // Drag-and-drop handlers for image upload (stores base64 data URL in form.image)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files && e.dataTransfer.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setForm(prev => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleFileChange = (file?: File | null) => {
    const f = file
    if (f) {
      const reader = new FileReader()
      reader.onload = () => setForm(prev => ({ ...prev, image: reader.result as string }))
      reader.readAsDataURL(f)
    }
  }

  const openCreate = useCallback(() => {
    setEditing(null)
    setForm({ ...emptyForm })
    setShowForm(true)
  }, [emptyForm])
  const openEdit = useCallback((t: TeamItem) => {
    const normalizedExpertise = Array.isArray(t.expertise)
      ? t.expertise
      : (t.expertise ? (t.expertise as any).toString().split(',').map((s: string) => s.trim()) : [])
    setEditing(t)
    setForm({ ...t, expertise: normalizedExpertise, status: t.status || 'active' })
    setShowForm(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      const expertisePayload = Array.isArray(form.expertise)
        ? form.expertise.join(', ')
        : (typeof form.expertise === 'string' ? form.expertise : '')
      const payload = { ...form, expertise: expertisePayload }
      if (editing && editing.id) {
        await apiClient.updateTeam(editing.id.toString(), payload)
        setToast({ msg: 'Team updated', type: 'success' })
      } else {
        await apiClient.createTeam(payload)
        setToast({ msg: 'Team created', type: 'success' })
      }
      setShowForm(false)
      await loadTeams()
    } catch (err: any) {
      setError(err.message || 'Failed to save')
      setToast({ msg: err.message || 'Failed to save', type: 'error' })
    } finally { setLoading(false) }
  }

  const handleDelete = useCallback(async (id?: number) => {
    if (!id) return
    // keep original delete logic but extracted helper will call this
    try {
      setLoading(true)
      await apiClient.deleteTeam(id.toString())
      setToast({ msg: 'Team deleted', type: 'success' })
      await loadTeams()
    } catch (err: any) {
      setToast({ msg: err.message || 'Failed to delete', type: 'error' })
    } finally { setLoading(false) }
  }, [loadTeams])

  const handleDeleteWithConfirm = useCallback((id?: number) => {
    if (!id) return
    if (!confirm('Yakin ingin menghapus anggota tim ini?')) return
    // optimistic UI removal for responsiveness
    setTeams(prev => prev.filter(x => x.id !== id))
    handleDelete(id)
  }, [handleDelete])

  const filteredTeams = useMemo(() => {
    if (!Array.isArray(teams)) return [] as TeamItem[]
    const q = query.trim().toLowerCase()
    return teams
      .filter(t => {
        if (!q) return true
        return (t.name || '').toLowerCase().includes(q) || (t.position || '').toLowerCase().includes(q) || (t.expertise || []).join(' ').toLowerCase().includes(q)
      })
      .sort((a, b) => {
        if (sort === 'name') return (a.name || '').localeCompare(b.name || '')
        if (sort === 'id_asc') return (a.id || 0) - (b.id || 0)
        return (b.id || 0) - (a.id || 0)
      })
  }, [teams, query, sort])

  const teamCards = useMemo(() => (
    filteredTeams.map(t => {
      const imageUrl = t.image
        ? (typeof t.image === 'string' && t.image.startsWith('/uploads') ? `${API_MEDIA_BASE}${t.image}` : t.image)
        : '/images/team/team-1.jpg'

      return (
        <div key={t.id} className="group relative p-3 sm:p-4 rounded-xl bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/50 shadow-sm hover:shadow-xl hover:border-blue-200/50 transform hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
          <div className="flex gap-3 items-start">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-slate-200/50 group-hover:ring-blue-500/50 transition-all">
              <img src={imageUrl} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate">{t.name}</h3>
                  <p className="text-xs text-slate-600 truncate">{t.position}</p>
                  {t.email && <p className="text-xs text-slate-500 truncate mt-0.5">{t.email}</p>}
                </div>
                {t.portfolioUrl && (
                  <a href={t.portfolioUrl} target="_blank" rel="noreferrer" className="flex-shrink-0 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md text-[10px] font-medium transition-colors">
                    Portfolio
                  </a>
                )}
              </div>
              <p className="mt-2 text-xs text-slate-600 line-clamp-2">{t.bio}</p>
              {(t.bank || t.accountNumber) && (
                <div className="mt-2 text-[10px] text-slate-500 bg-slate-50 rounded px-2 py-1">
                  <strong className="text-slate-700">Rekening:</strong> {t.bank || '-'} {t.accountNumber ? `• ${t.accountNumber}` : ''}
                </div>
              )}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {Array.isArray(t.expertise)
                  ? t.expertise.map((e: string, i: number) => (
                      e.trim() ? <span key={i} className="text-[10px] bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200/50 font-medium transition-transform hover:scale-105">{e.trim()}</span> : null
                    ))
                  : (t.expertise || '').toString().split(',').map((e: string, i: number) => (
                      e.trim() ? <span key={i} className="text-[10px] bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200/50 font-medium transition-transform hover:scale-105">{e.trim()}</span> : null
                    ))
                }
              </div>

              <div className="mt-2 flex items-center gap-2">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${t.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {t.status === 'active' ? 'Active' : 'In-active'}
                </span>
                <span className="text-[10px] text-slate-400">Tampil publik: {t.status === 'active' ? 'Ya' : 'Tidak'}</span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200/50 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(t)} className="px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all text-xs font-medium">Edit</button>
                  <button onClick={() => handleDeleteWithConfirm(t.id)} className="px-2.5 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all text-xs font-medium">Hapus</button>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">ID #{t.id}</div>
              </div>
            </div>
          </div>
        </div>
      )
    })
  ), [filteredTeams, API_MEDIA_BASE, openEdit, handleDeleteWithConfirm])

  return (
    <div>
      <Helmet><title>Manajemen Tim - NexCube Dashboard</title></Helmet>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Manajemen Tim</h1>
          <p className="text-slate-500 mt-0.5 text-xs sm:text-sm">Kelola konten 'Tim Ahli Kami' yang tampil di halaman About</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-shadow">
            <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <input placeholder="Cari..." value={query} onChange={(e) => setQuery(e.target.value)} className="bg-transparent outline-none text-sm w-28 placeholder:text-slate-400" />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="newest">Terbaru</option>
            <option value="name">Nama (A-Z)</option>
          </select>
          <button onClick={openCreate} className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white px-3 py-2 rounded-lg shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform text-xs sm:text-sm font-medium whitespace-nowrap">+ Tambah</button>
        </div>
      </div>

      <div className="relative bg-white/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-slate-200/50 shadow-sm">
        {loading && (
          <div className="absolute inset-0 z-40">
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
            <div className="relative z-50 flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" />
            </div>
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}

        {filteredTeams.length === 0 ? (
          <div className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm mb-3">Belum ada anggota tim</p>
            <button onClick={openCreate} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform">+ Tambah Anggota</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {teamCards}
          </div>
        )}
      </div>

      {/* Form Modal - Fixed Position ICD */}
      {showForm && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          {/** compute avatar URL to support uploads, full URLs, and data URIs */}
          {(() => {
            let avatarUrl = '/images/team/team-1.jpg'
            if (form.image && typeof form.image === 'string') {
              if (form.image.startsWith('/uploads')) avatarUrl = `${API_MEDIA_BASE}${form.image}`
              else if (form.image.startsWith('http') || form.image.startsWith('data:')) avatarUrl = form.image
              else avatarUrl = form.image
            }
            return (
              <form onSubmit={handleSubmit} className="relative z-10 bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-200">
                {/* Modal Header - Fixed */}
                <div className="flex-shrink-0 p-4 sm:p-6 pb-3 border-b border-slate-200">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-slate-200 shadow-md">
                        <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                      </div>
                      <div className="mt-2 text-center">
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                          Ubah Foto
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                          {editing ? 'Edit Anggota' : 'Tambah Anggota'}
                        </h3>
                        <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Isi informasi anggota tim dengan lengkap</p>
                    </div>
                  </div>
                </div>

                {/* Modal Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Lengkap *</label>
                        <input 
                          autoFocus 
                          required
                          className="w-full border border-slate-300 px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-sm" 
                          value={form.name} 
                          onChange={(e) => setForm({...form, name: e.target.value})} 
                          placeholder="Masukkan nama lengkap"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Posisi / Jabatan *</label>
                        <input 
                          required
                          className="w-full border border-slate-300 px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-sm" 
                          value={form.position} 
                          onChange={(e) => setForm({...form, position: e.target.value})} 
                          placeholder="Contoh: Senior Developer"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Status Tim</label>
                        <select
                          className="w-full border border-slate-300 px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-sm bg-white"
                          value={form.status || 'active'}
                          onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'in-active' })}
                        >
                          <option value="active">Active (tampil di publik)</option>
                          <option value="in-active">In-active (disembunyikan)</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
                          <input 
                            type="email"
                            className="w-full border border-slate-300 px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-sm" 
                            value={(form as any).email || ''} 
                            onChange={(e) => setForm({...form, email: e.target.value})} 
                            placeholder="email@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Pengalaman</label>
                          <input 
                            className="w-full border border-slate-300 px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-sm" 
                            value={form.experience} 
                            onChange={(e) => setForm({...form, experience: e.target.value})} 
                            placeholder="Contoh: 5 tahun"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Portfolio URL</label>
                        <input 
                          type="url"
                          className="w-full border border-slate-300 px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-sm" 
                          value={form.portfolioUrl} 
                          onChange={(e) => setForm({...form, portfolioUrl: e.target.value})} 
                          placeholder="https://portfolio.com"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Bank</label>
                          <select 
                            className="w-full border border-slate-300 px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-sm bg-white" 
                            value={(form as any).bank || ''} 
                            onChange={(e) => setForm({...form, bank: e.target.value})}
                          >
                            <option value="">Pilih Bank</option>
                            <option value="BCA">BCA</option>
                            <option value="Mandiri">Mandiri</option>
                            <option value="BNI">BNI</option>
                            <option value="BRI">BRI</option>
                            <option value="CIMB">CIMB Niaga</option>
                            <option value="SB">SEABANK</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">No. Rekening</label>
                          <input 
                            className="w-full border border-slate-300 px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-sm" 
                            value={(form as any).accountNumber || ''} 
                            onChange={(e) => setForm({...form, accountNumber: e.target.value})} 
                            placeholder="1234567890"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Keahlian</label>
                        <input 
                          className="w-full border border-slate-300 px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-sm" 
                          value={Array.isArray(form.expertise) ? form.expertise.join(', ') : (form.expertise as any) || ''} 
                          onChange={(e) => setForm({...form, expertise: e.target.value.split(',').map(s => s.trim())})} 
                          placeholder="React, Node.js, TypeScript"
                        />
                        <p className="text-xs text-slate-500 mt-1">Pisahkan dengan koma untuk multiple keahlian</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Bio / Deskripsi</label>
                        <textarea 
                          rows={4} 
                          className="w-full border border-slate-300 px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-sm resize-none" 
                          value={form.bio} 
                          onChange={(e) => setForm({...form, bio: e.target.value})} 
                          placeholder="Ceritakan sedikit tentang anggota tim ini..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer - Fixed */}
                <div className="flex-shrink-0 p-4 sm:p-6 pt-3 border-t border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      type="button" 
                      onClick={() => setShowForm(false)} 
                      className="px-4 py-2.5 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors text-sm font-medium"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit" 
                      disabled={loading} 
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      {loading && (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                      )}
                      <span>{editing ? 'Update Anggota' : 'Tambah Anggota'}</span>
                    </button>
                  </div>
                </div>

                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e.target.files && e.target.files[0])} />
              </form>
            )
          })()}
        </div>,
        document.body
      )}

      {toast && <Toast message={toast.msg} type={toast.type === 'success' ? 'success' : 'error'} onClose={() => setToast(null)} />}
    </div>
  )
}

export default TeamManagement
