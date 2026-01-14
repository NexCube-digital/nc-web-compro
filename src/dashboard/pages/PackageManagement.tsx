import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import apiClient from '../../services/api'
import { 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiChevronLeft,
  HiTag,
  HiOutlineInbox
} from 'react-icons/hi'
import { BiLoaderAlt } from 'react-icons/bi'
import { 
  MdWebAsset, 
  MdDesignServices, 
  MdEvent, 
  MdMenuBook,
  MdOutlineInventory2 
} from 'react-icons/md'
import { IoMdFlame } from 'react-icons/io'

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'website': return <MdWebAsset className="inline" />
      case 'desain': return <MdDesignServices className="inline" />
      case 'event': return <MdEvent className="inline" />
      case 'katalog': return <MdMenuBook className="inline" />
      default: return <MdOutlineInventory2 className="inline" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'website': return 'Website'
      case 'desain': return 'Desain Grafis'
      case 'event': return 'Undangan Digital'
      case 'katalog': return 'Menu Katalog'
      default: return 'Semua Paket'
    }
  }

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
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span>{getTypeIcon(type)}</span>
              <span>Manajemen Paket</span>
              {type && <span className="text-gray-400">— {getTypeLabel(type)}</span>}
            </h2>
            <p className="text-gray-600 mt-1">Kelola dan atur semua paket layanan Anda</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard/paket/form')} 
            className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium shadow-md flex items-center gap-2"
          >
            <HiPlus className="w-5 h-5" />
            <span>Buat Paket Baru</span>
          </button>
        </div>

        {/* Category filter removed — use sidebar navigation */}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <BiLoaderAlt className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Memuat paket...</p>
          </div>
        </div>
      ) : packages.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiOutlineInbox className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Belum Ada Paket {type && `untuk ${getTypeLabel(type)}`}
            </h3>
            <p className="text-gray-600 mb-6">
              Mulai dengan membuat paket layanan pertama Anda untuk kategori ini.
            </p>
            <button 
              onClick={() => navigate('/dashboard/paket/form')} 
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-md inline-flex items-center gap-2"
            >
              <HiPlus className="w-5 h-5" />
              <span>Buat Paket Pertama</span>
            </button>
          </div>
        </div>
      ) : (
        /* Package Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((p) => (
            p.type === 'event' ? (
              <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all group">
                <a href={p.link || '#'} target="_blank" rel="noreferrer" className="block">
                  <div className="h-52 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {p.images && p.images.length > 0 ? (
                      <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-gray-400">Tidak ada gambar</div>
                    )}
                  </div>
                </a>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-gray-800">{p.title}</h3>
                    {p.price && <span className="text-green-600 font-semibold">{p.price}</span>}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <HiTag className="w-4 h-4" />
                    <span>{(p.features || []).length} fitur</span>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate(`/dashboard/paket/form?edit=${p.id}`)} 
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                    >
                      <HiPencil className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={async () => {
                        if (!confirm(`Yakin ingin menghapus paket "${p.title}"?`)) return
                        try {
                          await apiClient.deletePackage(p.id)
                          fetchPackages()
                        } catch (e) { 
                          console.error(e)
                          alert('Gagal menghapus paket')
                        }
                      }} 
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-1"
                    >
                      <HiTrash className="w-4 h-4" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div 
                key={p.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                          {p.title}
                        </h3>
                        {p.hot && (
                          <span className="flex items-center gap-1 text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full font-semibold shadow-sm">
                            <IoMdFlame className="w-3 h-3" />
                            <span>HOT</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
                          <span>{getTypeIcon(p.type)}</span>
                          <span>{getTypeLabel(p.type)}</span>
                        </span>
                        {p.price && (
                          <span className="text-green-600 font-semibold">{p.price}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {p.description || 'Tidak ada deskripsi'}
                  </p>
                </div>

                {/* Card Footer with Actions */}
                <div className="p-4 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <HiTag className="w-4 h-4" />
                    <span>{(p.features || []).length} fitur</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate(`/dashboard/paket/form?edit=${p.id}`)} 
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                    >
                      <HiPencil className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={async () => {
                        if (!confirm(`Yakin ingin menghapus paket "${p.title}"?`)) return
                        try {
                          await apiClient.deletePackage(p.id)
                          fetchPackages()
                        } catch (e) { 
                          console.error(e)
                          alert('Gagal menghapus paket')
                        }
                      }} 
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-1"
                    >
                      <HiTrash className="w-4 h-4" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  )
}

export default PackageManagement
