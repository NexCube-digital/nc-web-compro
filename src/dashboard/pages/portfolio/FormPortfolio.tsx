import React, { useRef } from 'react'
import {
  Save,
  X,
  Upload,
  Link as LinkIcon,
  User,
  Code,
  Star,
  ImageOff,
  FileImage,
} from 'lucide-react'
import { PortfolioForm } from '../PortfolioManagement'

import { getImageUrl } from '../../../services/api'

interface FormPortfolioProps {
  formData: PortfolioForm
  loading: boolean
  editingId: number | null
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onFileChange: (file: File | null, preview: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  getCategoryColor: (category: string) => string
}

const MAX_FILE_SIZE_MB = 5
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export const FormPortfolio: React.FC<FormPortfolioProps> = ({
  formData,
  loading,
  editingId,
  onChange,
  onFileChange,
  onSubmit,
  onCancel,
  getCategoryColor,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = [
    { value: 'website', label: 'Website', icon: '🌐' },
    { value: 'undangan', label: 'Undangan', icon: '💌' },
    { value: 'desain', label: 'Desain', icon: '🎨' },
    { value: 'katalog', label: 'Katalog', icon: '📚' },
    { value: 'fotografi', label: 'Fotografi', icon: '📷' },
  ]

  // ─── File Input Handler ───────────────────────────────────────────────────
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    if (!file) {
      onFileChange(null, '')
      return
    }

    // Validate type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert('Format file tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.')
      e.target.value = ''
      return
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`Ukuran file terlalu besar. Maksimal ${MAX_FILE_SIZE_MB}MB.`)
      e.target.value = ''
      return
    }

    const preview = URL.createObjectURL(file)
    onFileChange(file, preview)
  }

  const handleRemoveFile = () => {
    onFileChange(null, '')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDropZoneClick = () => {
    if (!loading) fileInputRef.current?.click()
  }

  // Drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return

    const file = e.dataTransfer.files?.[0] || null
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert('Format file tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.')
      return
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`Ukuran file terlalu besar. Maksimal ${MAX_FILE_SIZE_MB}MB.`)
      return
    }

    const preview = URL.createObjectURL(file)
    onFileChange(file, preview)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const hasImage = !!formData.imagePreview

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ── Left Column ──────────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Judul Portfolio <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Contoh: Aplikasi E-commerce Modern"
              value={formData.title}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              required
              disabled={loading}
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              disabled={loading}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
            {formData.category && (
              <div className="mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(formData.category)}`}>
                  {categories.find(c => c.value === formData.category)?.icon}{' '}
                  {formData.category}
                </span>
              </div>
            )}
          </div>

          {/* Client */}
          <div>
            <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-2">
              Nama Client
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="client"
                name="client"
                type="text"
                placeholder="Contoh: PT Maju Jaya"
                value={formData.client}
                onChange={onChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                disabled={loading}
              />
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 mb-2">
              Teknologi yang Digunakan
            </label>
            <div className="relative">
              <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="technologies"
                name="technologies"
                type="text"
                placeholder="Contoh: React, Node.js, MongoDB"
                value={formData.technologies}
                onChange={onChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                disabled={loading}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Pisahkan dengan koma untuk multiple teknologi</p>
          </div>
        </div>

        {/* ── Right Column ─────────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gambar Portfolio <span className="text-red-500">*</span>
            </label>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES.join(',')}
              onChange={handleFileInputChange}
              className="hidden"
              disabled={loading}
            />

            {/* Preview area — shown when image exists */}
            {hasImage ? (
              <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                {/* Image preview */}
                <div className="aspect-video">
                  <img
                    src={
                      formData.imageFile
                        ? formData.imagePreview          
                        : getImageUrl(formData.imagePreview) 
                    }
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x225?text=Gambar+tidak+valid'
                    }}
                  />
                </div>

                {/* Overlay info & actions */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <div className="flex items-end justify-between">
                    <div>
                      {formData.imageFile ? (
                        <>
                          <p className="text-white text-xs font-medium truncate max-w-[180px]">
                            {formData.imageFile.name}
                          </p>
                          <p className="text-white/70 text-xs">
                            {formatFileSize(formData.imageFile.size)}
                          </p>
                        </>
                      ) : (
                        <p className="text-white/80 text-xs">Gambar saat ini</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {/* Change image */}
                      <button
                        type="button"
                        onClick={handleDropZoneClick}
                        disabled={loading}
                        className="flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg transition-colors border border-white/30"
                      >
                        <Upload className="w-3 h-3" />
                        Ganti
                      </button>
                      {/* Remove file (only if it's a new file, not the existing server image) */}
                      {formData.imageFile && (
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          disabled={loading}
                          className="flex items-center gap-1 bg-red-500/80 hover:bg-red-500 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <X className="w-3 h-3" />
                          Hapus
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* New file badge */}
                {formData.imageFile && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-green-500 text-white text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                      <FileImage className="w-3 h-3" />
                      File baru
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* Drop zone — shown when no image */
              <div
                onClick={handleDropZoneClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-lg p-8
                  flex flex-col items-center justify-center gap-3
                  cursor-pointer transition-colors
                  ${loading
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                  }
                `}
              >
                <div className={`p-3 rounded-full ${loading ? 'bg-gray-100' : 'bg-blue-100'}`}>
                  <Upload className={`w-6 h-6 ${loading ? 'text-gray-400' : 'text-blue-500'}`} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700">
                    Klik untuk upload atau drag & drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, WEBP, GIF — Maks. {MAX_FILE_SIZE_MB}MB
                  </p>
                </div>
                {!loading && (
                  <button
                    type="button"
                    className="text-xs text-blue-600 font-medium hover:text-blue-700 border border-blue-300 rounded px-3 py-1"
                  >
                    Pilih File
                  </button>
                )}
              </div>
            )}

            {/* No image warning (edit mode, existing image removed) */}
            {!hasImage && editingId && (
              <div className="mt-2 flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <ImageOff className="w-4 h-4 flex-shrink-0" />
                <p className="text-xs">
                  Upload gambar baru untuk mengganti gambar yang ada, atau biarkan kosong untuk mempertahankan gambar lama.
                </p>
              </div>
            )}
          </div>

          {/* Link */}
          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
              Link Proyek
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="link"
                name="link"
                type="url"
                placeholder="https://myproject.com"
                value={formData.link}
                onChange={onChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                disabled={loading}
              />
            </div>
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <input
              id="featured"
              name="featured"
              type="checkbox"
              checked={formData.featured}
              onChange={onChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={loading}
            />
            <label htmlFor="featured" className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
              <Star className="w-5 h-5 text-yellow-500" />
              Tandai sebagai Portfolio Unggulan (Featured)
            </label>
          </div>
        </div>
      </div>

      {/* Description — full width */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Deskripsi Proyek
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          placeholder="Jelaskan tentang proyek ini, fitur-fitur utama, tantangan yang dihadapi, dll..."
          value={formData.description}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none"
          disabled={loading}
        />
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-5 h-5" />
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>{editingId ? 'Update Portfolio' : 'Simpan Portfolio'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}