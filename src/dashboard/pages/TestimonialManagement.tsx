import React, { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-hot-toast'
import { TestimonialTable } from './testimonial/TestimonialTable'
import { FormTestimonial } from './testimonial/FormTestimonial'

import {
  Search,
  Plus,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  Star,
  CheckCircle,
  XCircle,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────
export interface TestimonialItem {
  id: number
  name: string
  company: string
  text: string
  rating: number
  avatar: string
  status: 'published' | 'pending' | 'hidden'
  createdAt: string
}

export interface TestimonialFormState {
  name: string
  company: string
  text: string
  rating: number
  avatarFile: File | null
  avatarPreview: string
  status: 'published' | 'pending' | 'hidden'
}

const defaultForm: TestimonialFormState = {
  name: '',
  company: '',
  text: '',
  rating: 5,
  avatarFile: null,
  avatarPreview: '',
  status: 'published',
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const dummyTestimonials: TestimonialItem[] = [
  {
    id: 1,
    name: 'Budi Santoso',
    company: 'PT Maju Bersama',
    text: 'Website kami mendapatkan peningkatan trafik signifikan setelah didesain ulang oleh tim NexCube. Tampilan premium dan responsif memberikan kesan profesional yang luar biasa!',
    rating: 5,
    avatar: '',
    status: 'published',
    createdAt: '2025-01-10',
  },
  {
    id: 2,
    name: 'Dewi Anggraini',
    company: 'Harmony Events',
    text: 'Undangan digital untuk acara perusahaan kami mendapat banyak pujian dari para tamu. Fitur RSVP sangat membantu dalam persiapan acara dan memberikan pengalaman yang memorable.',
    rating: 5,
    avatar: '',
    status: 'published',
    createdAt: '2025-01-15',
  },
  {
    id: 3,
    name: 'Ahmad Fauzi',
    company: 'Warung Nusantara',
    text: 'Menu digital untuk restoran kami memudahkan pelanggan melihat pilihan makanan. Update menu jadi sangat cepat tanpa perlu cetak ulang.',
    rating: 4,
    avatar: '',
    status: 'pending',
    createdAt: '2025-01-20',
  },
  {
    id: 4,
    name: 'Siti Rahayu',
    company: 'Butik Cantik',
    text: 'Katalog digital yang dibuat NexCube sangat membantu penjualan online kami. Desainnya elegan dan mudah digunakan oleh pelanggan.',
    rating: 5,
    avatar: '',
    status: 'published',
    createdAt: '2025-02-01',
  },
  {
    id: 5,
    name: 'Rizky Pratama',
    company: 'Tech Startup ID',
    text: 'Tim NexCube sangat profesional dan responsif. Mereka memahami kebutuhan bisnis kami dengan baik dan mengeksekusi dengan sempurna sesuai timeline.',
    rating: 5,
    avatar: '',
    status: 'hidden',
    createdAt: '2025-02-05',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────
const TestimonialManagement: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(dummyTestimonials)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterRating, setFilterRating] = useState<string>('all')
  const [formData, setFormData] = useState<TestimonialFormState>(defaultForm)

  const showForm = location.pathname.includes('/formtestimonial')

  // ─── Reset Form ─────────────────────────────────────────────────────────────
  const resetForm = useCallback(() => {
    setFormData(prev => {
      if (prev.avatarPreview && prev.avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(prev.avatarPreview)
      }
      return defaultForm
    })
    setEditingId(null)
  }, [])

  // ─── Derived Data ───────────────────────────────────────────────────────────
  const filteredTestimonials = testimonials.filter(t => {
    const matchSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.text.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = filterStatus === 'all' || t.status === filterStatus
    const matchRating = filterRating === 'all' || t.rating === Number(filterRating)
    return matchSearch && matchStatus && matchRating
  })

  const stats = {
    total: testimonials.length,
    published: testimonials.filter(t => t.status === 'published').length,
    pending: testimonials.filter(t => t.status === 'pending').length,
    avgRating:
      testimonials.length > 0
        ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
        : '0',
  }

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? Number(value) : value,
    }))
  }

  const handleFileChange = useCallback((file: File | null, preview: string) => {
    setFormData(prev => {
      if (prev.avatarPreview && prev.avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(prev.avatarPreview)
      }
      return { ...prev, avatarFile: file, avatarPreview: preview }
    })
  }, [])

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Nama harus diisi')
      return
    }
    if (!formData.text.trim()) {
      toast.error('Isi ulasan harus diisi')
      return
    }

    try {
      setLoading(true)

      // Simulasi delay API
      await new Promise(r => setTimeout(r, 600))

      if (editingId) {
        setTestimonials(prev =>
          prev.map(t =>
            t.id === editingId
              ? {
                  ...t,
                  name: formData.name,
                  company: formData.company,
                  text: formData.text,
                  rating: formData.rating,
                  avatar: formData.avatarPreview || t.avatar,
                  status: formData.status,
                }
              : t
          )
        )
        toast.success('Testimonial berhasil diupdate')
      } else {
        const newItem: TestimonialItem = {
          id: Date.now(),
          name: formData.name,
          company: formData.company,
          text: formData.text,
          rating: formData.rating,
          avatar: formData.avatarPreview || '',
          status: formData.status,
          createdAt: new Date().toISOString().split('T')[0],
        }
        setTestimonials(prev => [newItem, ...prev])
        toast.success('Testimonial berhasil ditambahkan')
      }

      resetForm()
      navigate('/dashboard/testimonials')
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: TestimonialItem) => {
    setEditingId(item.id)
    setFormData({
      name: item.name,
      company: item.company,
      text: item.text,
      rating: item.rating,
      avatarFile: null,
      avatarPreview: item.avatar || '',
      status: item.status,
    })
    navigate('/dashboard/testimonials/formtestimonial')
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus testimonial ini?')) return
    try {
      setDeleteLoading(id)
      await new Promise(r => setTimeout(r, 400))
      setTestimonials(prev => prev.filter(t => t.id !== id))
      toast.success('Testimonial berhasil dihapus')
    } catch {
      toast.error('Gagal menghapus testimonial')
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleToggleStatus = async (id: number) => {
    setTestimonials(prev =>
      prev.map(t => {
        if (t.id !== id) return t
        const next = t.status === 'published' ? 'hidden' : 'published'
        toast.success(`Testimonial ${next === 'published' ? 'dipublikasikan' : 'disembunyikan'}`)
        return { ...t, status: next }
      })
    )
  }

  const handleCancel = () => {
    resetForm()
    navigate('/dashboard/testimonials')
  }

  const handleRefresh = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    setLoading(false)
    toast.success('Data berhasil dimuat ulang')
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <Helmet>
        <title>Manajemen Testimonial - Dashboard</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Testimonial</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola ulasan dan testimoni dari klien Anda</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh data"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Testimonial</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Dipublikasikan</p>
              <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Menunggu Review</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <XCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rating Rata-rata</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-lg">
              <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Toolbar — hidden when form is shown */}
      {!showForm && (
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, perusahaan, atau isi ulasan..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
          </div>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Semua Status</option>
            <option value="published">Published</option>
            <option value="pending">Pending</option>
            <option value="hidden">Hidden</option>
          </select>

          {/* Filter Rating */}
          <select
            value={filterRating}
            onChange={e => setFilterRating(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Semua Rating</option>
            <option value="5">⭐⭐⭐⭐⭐ 5 Bintang</option>
            <option value="4">⭐⭐⭐⭐ 4 Bintang</option>
            <option value="3">⭐⭐⭐ 3 Bintang</option>
            <option value="2">⭐⭐ 2 Bintang</option>
            <option value="1">⭐ 1 Bintang</option>
          </select>

          {/* Add Button */}
          <button
            onClick={() => navigate('/dashboard/testimonials/formtestimonial')}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors font-medium whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Tambah Testimonial
          </button>
        </div>
      )}

      {/* Content */}
      {showForm ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {editingId ? 'Edit Testimonial' : 'Tambah Testimonial Baru'}
          </h2>
          <FormTestimonial
            formData={formData}
            loading={loading}
            editingId={editingId}
            onChange={handleInputChange}
            onFileChange={handleFileChange}
            onRatingChange={handleRatingChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Menampilkan{' '}
              <span className="font-semibold">{filteredTestimonials.length}</span> testimonial
              {searchTerm && ' dari hasil pencarian'}
            </p>
            {(searchTerm || filterStatus !== 'all' || filterRating !== 'all') && (
              <button
                onClick={() => { setSearchTerm(''); setFilterStatus('all'); setFilterRating('all') }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Reset Filter
              </button>
            )}
          </div>

          <TestimonialTable
            testimonials={filteredTestimonials}
            loading={loading}
            deleteLoading={deleteLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />

          {filteredTestimonials.length === 0 && !loading && (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm || filterStatus !== 'all' || filterRating !== 'all'
                  ? 'Tidak ada testimonial yang sesuai dengan filter'
                  : 'Belum ada data testimonial'}
              </p>
              {(searchTerm || filterStatus !== 'all' || filterRating !== 'all') && (
                <button
                  onClick={() => { setSearchTerm(''); setFilterStatus('all'); setFilterRating('all') }}
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

export default TestimonialManagement