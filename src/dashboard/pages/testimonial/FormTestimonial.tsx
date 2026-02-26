import React, { useRef } from 'react'
import { Save, X, Upload, User, Building2, Star, FileImage } from 'lucide-react'
import { TestimonialFormState } from '../TestimonialManagement'

interface FormTestimonialProps {
  formData: TestimonialFormState
  loading: boolean
  editingId: number | null
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onFileChange: (file: File | null, preview: string) => void
  onRatingChange: (rating: number) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

const MAX_FILE_SIZE_MB = 2
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const FormTestimonial: React.FC<FormTestimonialProps> = ({
  formData,
  loading,
  editingId,
  onChange,
  onFileChange,
  onRatingChange,
  onSubmit,
  onCancel,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ─── File Handler ─────────────────────────────────────────────────────────
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (!file) { onFileChange(null, ''); return }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert('Format tidak didukung. Gunakan JPG, PNG, atau WEBP.')
      e.target.value = ''
      return
    }
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

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation() }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (loading) return
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    if (!ACCEPTED_TYPES.includes(file.type)) { alert('Format tidak didukung.'); return }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) { alert(`Maks. ${MAX_FILE_SIZE_MB}MB.`); return }
    const preview = URL.createObjectURL(file)
    onFileChange(file, preview)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const ratingLabels = ['', 'Sangat Buruk', 'Buruk', 'Cukup', 'Baik', 'Sangat Baik']

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Klien <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                name="name"
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={formData.name}
                onChange={onChange}
                disabled={loading}
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-sm"
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Perusahaan
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                name="company"
                type="text"
                placeholder="Contoh: PT Maju Bersama"
                value={formData.company}
                onChange={onChange}
                disabled={loading}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-sm"
              />
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
              {/* Stars interactive */}
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => onRatingChange(star)}
                    disabled={loading}
                    className="transition-transform hover:scale-110 focus:outline-none disabled:cursor-not-allowed"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors duration-150 ${
                        star <= formData.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-300 fill-gray-100'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Label & slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">
                    {formData.rating} / 5 — {ratingLabels[formData.rating]}
                  </span>
                </div>
                <input
                  type="range"
                  name="rating"
                  min={1}
                  max={5}
                  value={formData.rating}
                  onChange={onChange}
                  disabled={loading}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-gray-400 px-0.5">
                  <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={onChange}
              disabled={loading}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-sm"
            >
              <option value="published">✅ Published — Tampil di halaman publik</option>
              <option value="pending">⏳ Pending — Menunggu review</option>
              <option value="hidden">🙈 Hidden — Disembunyikan</option>
            </select>
          </div>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto Profil <span className="text-gray-400 font-normal">(opsional)</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES.join(',')}
              onChange={handleFileInputChange}
              className="hidden"
              disabled={loading}
            />

            {formData.avatarPreview ? (
              /* Preview Mode */
              <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                <div className="flex items-center gap-4 p-4">
                  {/* Avatar preview */}
                  <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-orange-400 shadow-md">
                    <img
                      src={formData.avatarPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.target as HTMLImageElement).src = ''
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    {formData.avatarFile ? (
                      <>
                        <div className="flex items-center gap-1.5 mb-1">
                          <FileImage className="w-3.5 h-3.5 text-green-600" />
                          <span className="text-xs font-semibold text-green-700">File baru</span>
                        </div>
                        <p className="text-sm text-gray-700 font-medium truncate">
                          {formData.avatarFile.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatFileSize(formData.avatarFile.size)}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-600">Foto profil saat ini</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                  >
                    <Upload className="w-4 h-4" />
                    Ganti Foto
                  </button>
                  <div className="w-px bg-gray-200" />
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    <X className="w-4 h-4" />
                    Hapus
                  </button>
                </div>
              </div>
            ) : (
              /* Drop Zone */
              <div
                onClick={() => !loading && fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
                  loading
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                {/* Placeholder avatar circle */}
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700">Upload foto profil</p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP — Maks. {MAX_FILE_SIZE_MB}MB</p>
                </div>
                <span className="text-xs text-blue-600 font-medium border border-blue-300 rounded px-3 py-1 hover:bg-blue-50">
                  Pilih File
                </span>
              </div>
            )}

            {/* Fallback hint */}
            {!formData.avatarPreview && (
              <p className="text-xs text-gray-400 mt-2">
                Jika tidak ada foto, inisial nama akan ditampilkan secara otomatis
              </p>
            )}
          </div>

          {/* Preview Card */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview Tampilan
            </label>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="space-y-3">
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i <= formData.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-gray-700 leading-relaxed italic">
                  "{formData.text || 'Isi ulasan akan tampil di sini...'}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-2.5 pt-2 border-t border-gray-100">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-orange-400 flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
                    {formData.avatarPreview ? (
                      <img src={formData.avatarPreview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-sm">
                        {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {formData.name || 'Nama Klien'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formData.company || 'Perusahaan'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Text — full width */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Isi Ulasan <span className="text-red-500">*</span>
        </label>
        <textarea
          name="text"
          rows={4}
          placeholder="Tulis ulasan atau testimonial dari klien di sini..."
          value={formData.text}
          onChange={onChange}
          disabled={loading}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none text-sm"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{formData.text.length} karakter</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-4 h-4" />
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed min-w-[170px] justify-center"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{editingId ? 'Update Testimonial' : 'Simpan Testimonial'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}