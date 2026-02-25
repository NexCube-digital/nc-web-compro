import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-hot-toast'
import apiClient, { Portfolio, PortfolioFormData } from '../../services/api'
import { PortfolioTable } from './portfolio/PortfolioTable'
import { FormPortfolio } from './portfolio/FormPortfolio'
import { getImageUrl } from '../../services/api'


import { 
  Search, 
  Plus, 
  RefreshCw, 
  AlertCircle, 
  FolderOpen,
  Grid,
  List
} from 'lucide-react'

// ─── Form State ──────────────────────────────────────────────────────────────
export interface PortfolioForm {
  title: string
  description: string
  category: string
  imageFile: File | null      // file yang dipilih user
  imagePreview: string        // URL preview (blobURL untuk file baru, URL lama saat edit)
  client: string
  technologies: string
  link: string
  featured: boolean
}

const defaultForm: PortfolioForm = {
  title: '',
  description: '',
  category: 'website',
  imageFile: null,
  imagePreview: '',
  client: '',
  technologies: '',
  link: '',
  featured: false,
}

// ─── Component ───────────────────────────────────────────────────────────────
const PortfolioManagement: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [formData, setFormData] = useState<PortfolioForm>(defaultForm)

  const showForm = location.pathname.includes('/formportfolio')

  // ─── Load portfolios ────────────────────────────────────────────────────────
  const loadPortfolios = useCallback(async (showToast = false) => {
    try {
      setLoading(true)
      setError('')
      const res = await apiClient.getPortfolios()
      if (res.success && res.data) {
        setPortfolios(res.data)
        if (showToast) toast.success('Data portfolio berhasil dimuat')
      } else {
        throw new Error(res.message || 'Gagal memuat data portfolio')
      }
    } catch (err: any) {
      const msg = err.message || 'Terjadi kesalahan saat memuat data'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }, [])

  useEffect(() => { loadPortfolios() }, [loadPortfolios])

  // ─── Revoke blob URL when form resets ──────────────────────────────────────
  const resetForm = useCallback(() => {
    setFormData(prev => {
      // Revoke blob URL agar tidak memory leak
      if (prev.imagePreview && prev.imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(prev.imagePreview)
      }
      return defaultForm
    })
    setEditingId(null)
  }, [])

  // ─── Derived data ───────────────────────────────────────────────────────────
  const categories = ['all', ...new Set(portfolios.map(p => p.category))]

  const filteredPortfolios = portfolios.filter(portfolio => {
    const matchesSearch =
      portfolio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      portfolio.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      portfolio.client?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || portfolio.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  // Handler khusus untuk file input
  const handleFileChange = useCallback((file: File | null, preview: string) => {
    setFormData(prev => {
      // Revoke blob URL lama agar tidak memory leak
      if (prev.imagePreview && prev.imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(prev.imagePreview)
      }
      return { ...prev, imageFile: file, imagePreview: preview }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Judul portfolio harus diisi')
      return
    }
    // Saat create: wajib pilih file. Saat edit: boleh tidak ganti gambar (imagePreview ada dari gambar lama)
    if (!editingId && !formData.imageFile) {
      toast.error('Gambar portfolio harus diupload')
      return
    }
    if (editingId && !formData.imageFile && !formData.imagePreview) {
      toast.error('Gambar portfolio harus diupload')
      return
    }

    try {
      setLoading(true)
      setError('')

      const payload: PortfolioFormData = {
        title: formData.title,
        description: formData.description,
        category: formData.category as Portfolio['category'],
        image: formData.imagePreview, // URL lama (hanya relevan jika tidak ada file baru)
        client: formData.client,
        technologies: formData.technologies,
        link: formData.link,
        featured: formData.featured,
        imageFile: formData.imageFile || undefined,
      }

      if (editingId) {
        const res = await apiClient.updatePortfolio(editingId.toString(), payload)
        if (res.success) {
          toast.success('Portfolio berhasil diupdate')
        } else {
          throw new Error(res.message || 'Gagal mengupdate portfolio')
        }
      } else {
        const res = await apiClient.createPortfolio(payload)
        if (res.success) {
          toast.success('Portfolio berhasil ditambahkan')
        } else {
          throw new Error(res.message || 'Gagal menambahkan portfolio')
        }
      }

      await loadPortfolios()
      resetForm()
      navigate('/dashboard/portfolios')
    } catch (err: any) {
      const msg = err.message || 'Terjadi kesalahan'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (portfolio: Portfolio) => {
    setEditingId(portfolio.id)
    // Tidak ada imageFile — set imagePreview ke URL lama agar ditampilkan
    setFormData({
      title: portfolio.title,
      description: portfolio.description || '',
      category: portfolio.category || 'website',
      imageFile: null,
      imagePreview: portfolio.image || '',
      client: portfolio.client || '',
      technologies: portfolio.technologies || '',
      link: portfolio.link || '',
      featured: portfolio.featured || false,
    })
    navigate('/dashboard/portfolios/formportfolio')
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus portfolio ini?')) return

    try {
      setDeleteLoading(id)
      const res = await apiClient.deletePortfolio(id.toString())
      if (res.success) {
        toast.success('Portfolio berhasil dihapus')
        await loadPortfolios()
      } else {
        throw new Error(res.message || 'Gagal menghapus portfolio')
      }
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus portfolio')
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleCancel = () => {
    resetForm()
    navigate('/dashboard/portfolios')
  }

  const handleRefresh = () => loadPortfolios(true)

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      website: 'bg-blue-100 text-blue-800',
      undangan: 'bg-purple-100 text-purple-800',
      desain: 'bg-pink-100 text-pink-800',
      katalog: 'bg-green-100 text-green-800',
      fotografi: 'bg-orange-100 text-orange-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  // ─── Initial loading ────────────────────────────────────────────────────────
  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data portfolio...</p>
        </div>
      </div>
    )
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <Helmet>
        <title>Manajemen Portfolio - Dashboard</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Portfolio</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola karya dan proyek portfolio Anda</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              title="Table View"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              title="Grid View"
            >
              <Grid className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Portfolio</p>
              <p className="text-2xl font-bold text-gray-900">{portfolios.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FolderOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Featured</p>
              <p className="text-2xl font-bold text-gray-900">{portfolios.filter(p => p.featured).length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <span className="text-yellow-600 text-xl">⭐</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Kategori</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <span className="text-purple-600 text-xl">📁</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Dengan Link</p>
              <p className="text-2xl font-bold text-gray-900">{portfolios.filter(p => p.link).length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <span className="text-green-600 text-xl">🔗</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={() => loadPortfolios()} className="ml-auto text-sm font-medium hover:text-red-800">
            Coba Lagi
          </button>
        </div>
      )}

      {/* Search, Filter, Add — hidden saat showForm */}
      {!showForm && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari portfolio berdasarkan judul, deskripsi, atau client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'Semua Kategori' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={() => navigate('/dashboard/portfolios/formportfolio')}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Tambah Portfolio
          </button>
        </div>
      )}

      {/* Content */}
      {showForm ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {editingId ? 'Edit Portfolio' : 'Tambah Portfolio Baru'}
          </h2>
          <FormPortfolio
            formData={formData}
            loading={loading}
            editingId={editingId}
            onChange={handleInputChange}
            onFileChange={handleFileChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            getCategoryColor={getCategoryColor}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Menampilkan <span className="font-semibold">{filteredPortfolios.length}</span> portfolio
              {searchTerm && ' dari hasil pencarian'}
              {selectedCategory !== 'all' && ` di kategori ${selectedCategory}`}
            </p>
            {filteredPortfolios.length > 0 && (
              <p className="text-xs text-gray-500">
                {viewMode === 'table' ? 'Tampilan tabel' : 'Tampilan grid'}
              </p>
            )}
          </div>

          {viewMode === 'table' ? (
            <PortfolioTable
              portfolios={filteredPortfolios}
              loading={loading}
              deleteLoading={deleteLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              getCategoryColor={getCategoryColor}
            />
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPortfolios.map(portfolio => (
                  <div
                    key={portfolio.id}
                    className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                      {portfolio.image ? (
                        <img
                          src={getImageUrl(portfolio.image)}
                          alt={portfolio.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x225?text=No+Image'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                      {portfolio.featured && (
                        <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{portfolio.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(portfolio.category)}`}>
                          {portfolio.category}
                        </span>
                      </div>
                      {portfolio.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{portfolio.description}</p>
                      )}
                      {portfolio.client && (
                        <p className="text-xs text-gray-500 mb-2">Client: {portfolio.client}</p>
                      )}
                      {portfolio.technologies && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {portfolio.technologies.split(',').map((tech, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        {portfolio.link ? (
                          <a
                            href={portfolio.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <span>🔗</span> Lihat Proyek
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">Tidak ada link</span>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(portfolio)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                            disabled={deleteLoading === portfolio.id}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(portfolio.id)}
                            disabled={deleteLoading === portfolio.id}
                            className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                          >
                            {deleteLoading === portfolio.id ? '...' : 'Hapus'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredPortfolios.length === 0 && !loading && (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Tidak ada portfolio yang sesuai dengan filter'
                  : 'Belum ada data portfolio'}
              </p>
              {(searchTerm || selectedCategory !== 'all') && (
                <button
                  onClick={() => { setSearchTerm(''); setSelectedCategory('all') }}
                  className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Reset Filter
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PortfolioManagement