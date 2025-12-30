import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import apiClient from '../../services/api'

const PackageManagement: React.FC = () => {
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const getTypeFromPath = () => {
    const after = location.pathname.split('/dashboard/')[1] || ''
    // Expect formats: paket or paket/website
    if (after.startsWith('paket/')) return after.split('/')[1]
    return ''
  }

  const type = getTypeFromPath()

  const fetchPackages = async () => {
    setLoading(true)
    try {
      const res = await apiClient.getPackages(type || undefined)
      if (res && res.data) setPackages(res.data)
    } catch (err) {
      console.error('Failed to load packages', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPackages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Manajemen Paket {type ? `— ${type}` : ''}</h2>
        <div>
          <button onClick={() => navigate('/dashboard/paket/form')} className="px-3 py-2 bg-green-600 text-white rounded">Buat Paket</button>
        </div>
      </div>

      {loading ? (
        <div className="p-6 bg-white rounded shadow">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.length === 0 && (
            <div className="p-6 bg-white rounded shadow col-span-full">Belum ada paket untuk kategori ini.</div>
          )}
          {packages.map((p) => (
            <div key={p.id} className="p-4 bg-white rounded shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{p.title}</h3>
                  <div className="text-sm text-slate-500">{p.type} • {p.price || '—'}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/dashboard/paket/form?edit=${p.id}`)} className="px-2 py-1 bg-blue-600 text-white rounded text-sm">Edit</button>
                  <button onClick={async () => {
                    if (!confirm('Hapus paket ini?')) return
                    try {
                      await apiClient.deletePackage(p.id)
                      fetchPackages()
                    } catch (e) { console.error(e) }
                  }} className="px-2 py-1 bg-red-600 text-white rounded text-sm">Hapus</button>
                </div>
              </div>
              <p className="mt-3 text-slate-600 text-sm">{p.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PackageManagement
