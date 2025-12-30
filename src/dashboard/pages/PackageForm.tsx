import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import apiClient from '../../services/api'

const PackageForm: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const editId = params.get('edit')

  const [form, setForm] = useState({ title: '', description: '', type: 'website', price: '', features: '' })
  const [files, setFiles] = useState<File[] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!editId) return
      setLoading(true)
      try {
        const res = await apiClient.getPackage(editId)
        if (res.success && res.data) {
          const p = res.data
          setForm({ title: p.title || '', description: p.description || '', type: p.type || 'website', price: p.price || '', features: (p.features || []).join(', ') })
        }
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    load()
  }, [editId])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, features: form.features.split(',').map(s => s.trim()) }
      if (editId) {
        await apiClient.updatePackage(editId, payload)
        if (files && files.length > 0) {
          try {
            await apiClient.uploadPackageImages(editId, files)
          } catch (e) { console.error('Upload images failed', e) }
        }
      } else {
        await apiClient.createPackage(payload)
        // After create, reload list - backend returns created package id
        // Try to upload images if any: fetch latest package maybe by title
        if (files && files.length > 0) {
          try {
            // Best-effort: fetch packages and find newest with same title
            const list = await apiClient.getPackages()
            const created = list.data?.find((p: any) => p.title === payload.title)
            if (created && created.id) await apiClient.uploadPackageImages(String(created.id), files)
          } catch (e) { console.error('Upload images after create failed', e) }
        }
      }
      navigate('/dashboard/paket')
    } catch (err) {
      console.error(err)
      alert('Gagal menyimpan paket')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{editId ? 'Edit Paket' : 'Buat Paket'}</h2>
      </div>

      <form onSubmit={submit} className="bg-white p-6 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Judul</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipe</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border px-3 py-2 rounded">
              <option value="website">Website</option>
              <option value="desain">Desain</option>
              <option value="event">Event</option>
              <option value="katalog">Katalog</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border px-3 py-2 rounded" rows={4} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Gambar Paket (opsional)</label>
            <input type="file" multiple onChange={e => setFiles(e.target.files ? Array.from(e.target.files) : null)} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Harga (opsional)</label>
            <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fitur (pisahkan koma)</label>
            <input value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} className="w-full border px-3 py-2 rounded" />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
        </div>
      </form>
    </div>
  )
}

export default PackageForm
