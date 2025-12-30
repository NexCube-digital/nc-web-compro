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
    if (!confirm('Hapus anggota tim ini?')) return
    try {
      setLoading(true)
      await apiClient.deleteTeam(id.toString())
      setToast({ msg: 'Team deleted', type: 'success' })
      await loadTeams()
    } catch (err: any) {
      setToast({ msg: err.message || 'Failed to delete', type: 'error' })
    } finally { setLoading(false) }
  }

  return (
    <div>
      <Helmet><title>Manajemen Tim - NexCube Dashboard</title></Helmet>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Tim</h1>
          <p className="text-slate-600 mt-1">Kelola konten 'Tim Ahli Kami' yang tampil di halaman About</p>
        </div>
        <div>
          <button onClick={openCreate} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg">+ Tambah Anggota</button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map(t => {
            const imageUrl = t.image
              ? (typeof t.image === 'string' && t.image.startsWith('/uploads') ? `${API_MEDIA_BASE}${t.image}` : t.image)
              : '/images/team/team-1.jpg'

            return (
              <div key={t.id} className="p-4 rounded-xl bg-white border shadow-md">
                <div className="flex gap-4 items-center">
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={imageUrl} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{t.name}</h3>
                        <p className="text-sm text-slate-600">{t.position}</p>
                          {t.email && <p className="text-sm text-slate-500">{t.email}</p>}
                      </div>
                      <div className="text-right">
                        {t.portfolioUrl && <a href={t.portfolioUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600">Portfolio</a>}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">{t.bio}</p>
                    { (t.bank || t.accountNumber) && (
                      <div className="mt-2 text-sm text-slate-600">
                        <strong>Rekening:</strong> {t.bank || '-'} {t.accountNumber ? `• ${t.accountNumber}` : ''}
                      </div>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Array.isArray(t.expertise) 
                        ? t.expertise.map((e: string, i: number) => (
                            e.trim() ? <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">{e.trim()}</span> : null
                          ))
                        : (t.expertise || '').split(',').map((e: string, i: number) => (
                            e.trim() ? <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">{e.trim()}</span> : null
                          ))
                      }
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => openEdit(t)} className="px-3 py-1 bg-blue-600 text-white rounded">Edit</button>
                      <button onClick={() => handleDelete(t.id)} className="px-3 py-1 bg-red-600 text-white rounded">Hapus</button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <form onSubmit={handleSubmit} className="relative z-10 bg-white p-6 rounded-lg w-full max-w-2xl">
            <h3 className="text-lg font-bold mb-4">{editing ? 'Edit Anggota' : 'Tambah Anggota'}</h3>
              <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Nama</label>
                <input className="w-full border px-3 py-2 rounded" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label className="text-sm">Posisi</label>
                <input className="w-full border px-3 py-2 rounded" value={form.position} onChange={(e) => setForm({...form, position: e.target.value})} />
              </div>
              <div>
                <label className="text-sm">Email</label>
                <input className="w-full border px-3 py-2 rounded" value={(form as any).email || ''} onChange={(e) => setForm({...form, email: e.target.value})} />
              </div>
              <div>
                <label className="text-sm">Pengalaman</label>
                <input className="w-full border px-3 py-2 rounded" value={form.experience} onChange={(e) => setForm({...form, experience: e.target.value})} />
              </div>
              <div>
                <label className="text-sm">Portfolio URL</label>
                <input className="w-full border px-3 py-2 rounded" value={form.portfolioUrl} onChange={(e) => setForm({...form, portfolioUrl: e.target.value})} />
              </div>
              <div>
                <label className="text-sm">Bank</label>
                <select className="w-full border px-3 py-2 rounded" value={(form as any).bank || ''} onChange={(e) => setForm({...form, bank: e.target.value})}>
                  <option value="">Pilih Bank</option>
                  <option value="BCA">BCA</option>
                  <option value="Mandiri">Mandiri</option>
                  <option value="BNI">BNI</option>
                  <option value="BRI">BRI</option>
                  <option value="SB">SEABANK</option>
                </select>
              </div>
              <div>
                <label className="text-sm">No. Rekening</label>
                <input className="w-full border px-3 py-2 rounded" value={(form as any).accountNumber || ''} onChange={(e) => setForm({...form, accountNumber: e.target.value})} />
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm">Keahlian (pisahkan koma)</label>
              <input className="w-full border px-3 py-2 rounded" value={Array.isArray(form.expertise) ? form.expertise.join(', ') : (form.expertise as any) || ''} onChange={(e) => setForm({...form, expertise: e.target.value.split(',').map(s => s.trim())})} />
            </div>

            <div className="mt-4">
              <label className="text-sm">Foto (seret & lepas atau klik)</label>
              <div onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onClick={() => fileInputRef.current?.click()} className={`mt-2 border-dashed border-2 rounded p-4 text-center cursor-pointer ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-slate-200'}`}>
                {form.image ? (
                  <img src={form.image} alt="preview" className="mx-auto h-32 object-cover rounded" />
                ) : (
                  <p className="text-sm text-slate-500">Tarik gambar kesini atau klik untuk memilih</p>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e.target.files && e.target.files[0])} />
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm">Bio</label>
              <textarea className="w-full border px-3 py-2 rounded" value={form.bio} onChange={(e) => setForm({...form, bio: e.target.value})} />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded">Batal</button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
            </div>
          </form>
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type === 'success' ? 'success' : 'error'} onClose={() => setToast(null)} />}
    </div>
  )
}

export default TeamManagement
