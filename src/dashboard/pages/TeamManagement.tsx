import React, { useEffect, useState, useRef } from 'react'
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

  const loadTeams = async () => {
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
  }

  useEffect(() => { loadTeams() }, [])

  const filteredTeams = teams
    .filter(t => {
      if (!query) return true
      const q = query.toLowerCase()
      return (t.name || '').toLowerCase().includes(q) || (t.position || '').toLowerCase().includes(q) || (t.expertise || []).join(' ').toLowerCase().includes(q)
    })
    .sort((a, b) => {
      if (sort === 'name') return (a.name || '').localeCompare(b.name || '')
      if (sort === 'id_asc') return (a.id || 0) - (b.id || 0)
      return (b.id || 0) - (a.id || 0)
    })

  const emptyForm: TeamItem = { name: '', position: '', image: '', bio: '', experience: '', expertise: [], portfolioUrl: '' }
  // include bank/account defaults
  emptyForm.bank = ''
  emptyForm.accountNumber = ''
  emptyForm.email = ''
  const [form, setForm] = useState<TeamItem>(emptyForm)
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

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowForm(true) }
  const openEdit = (t: TeamItem) => {
    const normalizedExpertise = Array.isArray(t.expertise)
      ? t.expertise
      : (t.expertise ? (t.expertise as any).toString().split(',').map((s: string) => s.trim()) : [])
    setEditing(t);
    setForm({ ...t, expertise: normalizedExpertise });
    setShowForm(true)
  }

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

  const handleDelete = async (id?: number) => {
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
  }

  const handleDeleteWithConfirm = (id?: number) => {
    if (!id) return
    if (!confirm('Yakin ingin menghapus anggota tim ini?')) return
    // optimistic UI removal for responsiveness
    setTeams(prev => prev.filter(x => x.id !== id))
    handleDelete(id)
  }

  return (
    <div>
      <Helmet><title>Manajemen Tim - NexCube Dashboard</title></Helmet>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Manajemen Tim</h1>
          <p className="text-slate-600 mt-1">Kelola konten 'Tim Ahli Kami' yang tampil di halaman About</p>
        </div>
        <div className="flex-1 flex items-center gap-3 justify-end">
          <div className="flex items-center gap-2 bg-slate-50 border rounded px-3 py-2">
            <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <input placeholder="Cari anggota..." value={query} onChange={(e) => setQuery(e.target.value)} className="bg-transparent outline-none text-sm" />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="border rounded px-3 py-2 text-sm">
            <option value="newest">Terbaru</option>
            <option value="name">Nama (A-Z)</option>
          </select>
          <button onClick={openCreate} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform">+ Tambah Anggota</button>
        </div>
      </div>

      <div className="relative bg-white rounded-xl p-4 border">
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
          <div className="py-24 text-center">
            <p className="text-slate-500">Belum ada anggota tim.</p>
            <button onClick={openCreate} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">+ Tambah Anggota</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeams.map(t => {
            const imageUrl = t.image
              ? (typeof t.image === 'string' && t.image.startsWith('/uploads') ? `${API_MEDIA_BASE}${t.image}` : t.image)
              : '/images/team/team-1.jpg'

            return (
              <div key={t.id} className="group p-4 rounded-xl bg-white border shadow-md hover:shadow-xl transform hover:-translate-y-1 transition">
                <div className="flex gap-4 items-center">
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={imageUrl} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{t.name}</h3>
                        <p className="text-sm text-slate-600">{t.position}</p>
                        {t.email && <p className="text-sm text-slate-500">{t.email}</p>}
                      </div>
                      <div className="text-right opacity-0 group-hover:opacity-100 transition">
                        {t.portfolioUrl && <a href={t.portfolioUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600">Portfolio</a>}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-slate-700 line-clamp-3">{t.bio}</p>
                    {(t.bank || t.accountNumber) && (
                      <div className="mt-2 text-sm text-slate-600">
                        <strong>Rekening:</strong> {t.bank || '-'} {t.accountNumber ? `• ${t.accountNumber}` : ''}
                      </div>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Array.isArray(t.expertise)
                        ? t.expertise.map((e: string, i: number) => (
                            e.trim() ? <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded transition-transform hover:scale-105">{e.trim()}</span> : null
                          ))
                        : (t.expertise || '').toString().split(',').map((e: string, i: number) => (
                            e.trim() ? <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded transition-transform hover:scale-105">{e.trim()}</span> : null
                          ))
                      }
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(t)} className="px-3 py-1 bg-blue-600 text-white rounded hover:shadow">Edit</button>
                        <button onClick={() => handleDeleteWithConfirm(t.id)} className="px-3 py-1 bg-red-600 text-white rounded hover:shadow">Hapus</button>
                      </div>
                      <div className="text-xs text-slate-400">ID #{t.id}</div>
                    </div>
                  </div>
                </div>
              </div>
            )
            })}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          {/** compute avatar URL to support uploads, full URLs, and data URIs */}
          {(() => {
            let avatarUrl = '/images/team/team-1.jpg'
            if (form.image && typeof form.image === 'string') {
              if (form.image.startsWith('/uploads')) avatarUrl = `${API_MEDIA_BASE}${form.image}`
              else if (form.image.startsWith('http') || form.image.startsWith('data:')) avatarUrl = form.image
              else avatarUrl = form.image
            }
            return (
              <form onSubmit={handleSubmit} className="relative z-10 bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto transform transition-transform">
            <div className="flex gap-4">
              <div className="w-28 flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mx-auto border shadow-sm">
                  <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                </div>
                <div className="mt-2 text-center">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm text-blue-600">Ubah Foto</button>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold">{editing ? 'Edit Anggota' : 'Tambah Anggota'}</h3>
                  <button type="button" onClick={() => setShowForm(false)} className="text-slate-500">Tutup</button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-xs text-slate-500">Nama</label>
                    <input autoFocus className="w-full border px-3 py-2 rounded-lg" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Posisi</label>
                    <input className="w-full border px-3 py-2 rounded-lg" value={form.position} onChange={(e) => setForm({...form, position: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500">Email</label>
                      <input className="w-full border px-3 py-2 rounded-lg" value={(form as any).email || ''} onChange={(e) => setForm({...form, email: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Pengalaman</label>
                      <input className="w-full border px-3 py-2 rounded-lg" value={form.experience} onChange={(e) => setForm({...form, experience: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Portfolio URL</label>
                    <input className="w-full border px-3 py-2 rounded-lg" value={form.portfolioUrl} onChange={(e) => setForm({...form, portfolioUrl: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500">Bank</label>
                      <select className="w-full border px-3 py-2 rounded-lg" value={(form as any).bank || ''} onChange={(e) => setForm({...form, bank: e.target.value})}>
                        <option value="">Pilih Bank</option>
                        <option value="BCA">BCA</option>
                        <option value="Mandiri">Mandiri</option>
                        <option value="BNI">BNI</option>
                        <option value="BRI">BRI</option>
                        <option value="SB">SEABANK</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">No. Rekening</label>
                      <input className="w-full border px-3 py-2 rounded-lg" value={(form as any).accountNumber || ''} onChange={(e) => setForm({...form, accountNumber: e.target.value})} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-xs text-slate-500">Keahlian (pisahkan koma)</label>
              <input className="w-full border px-3 py-2 rounded-lg" value={Array.isArray(form.expertise) ? form.expertise.join(', ') : (form.expertise as any) || ''} onChange={(e) => setForm({...form, expertise: e.target.value.split(',').map(s => s.trim())})} />
            </div>

            <div className="mt-4">
              <label className="text-xs text-slate-500">Bio</label>
              <textarea className="w-full border px-3 py-2 rounded-lg" value={form.bio} onChange={(e) => setForm({...form, bio: e.target.value})} />
            </div>

                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e.target.files && e.target.files[0])} />

                <div className="mt-6" />
                <div className="mt-4 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded bg-white">Batal</button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2">
                {loading && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>}
                <span>{editing ? 'Update' : 'Buat'}</span>
              </button>
                </div>
              </form>
            )
          })()}
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type === 'success' ? 'success' : 'error'} onClose={() => setToast(null)} />}
    </div>
  )
}

export default TeamManagement
