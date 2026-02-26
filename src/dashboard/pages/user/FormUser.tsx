import React, { useState, useRef } from 'react'
import { User, Mail, Lock, Save, X, Shield, Eye, EyeOff, Camera } from 'lucide-react'
import { getImageUrl } from '../../../services/api'

interface FormUserProps {
  formData: {
    name: string
    email: string
    password: string
    role: string
  }
  loading: boolean
  editingId: number | null
  currentPhoto?: string
  photoPreview: string | null
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onPhotoChange: (file: File | null) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

export const FormUser: React.FC<FormUserProps> = ({
  formData,
  loading,
  editingId,
  currentPhoto,
  photoPreview,
  onChange,
  onPhotoChange,
  onSubmit,
  onCancel
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      const allowed = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowed.includes(file.type)) {
        alert('Format foto tidak didukung. Gunakan JPG, PNG, atau WebP.')
        e.target.value = ''
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran foto maksimal 5 MB.')
        e.target.value = ''
        return
      }
    }
    onPhotoChange(file)
    e.target.value = ''
  }

  const displayPhoto = photoPreview || (currentPhoto ? getImageUrl(currentPhoto) : null)
  const initials = (formData.name || '?').charAt(0).toUpperCase()

  const roles = [
    { value: 'user', label: 'User', icon: '', description: 'Hanya dapat melihat portfolio' },
    { value: 'admin', label: 'Admin', icon: '', description: 'Akses penuh ke semua fitur' }
  ]

  return (
    <form onSubmit={onSubmit} className="space-y-6">

      {/* Photo Upload (hanya saat edit user) */}
      {editingId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto Profil
          </label>
          <div className="flex items-center gap-4">
            {/* Avatar preview */}
            <div className="relative group w-16 h-16 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center border-2 border-gray-200 flex-shrink-0">
              {displayPhoto ? (
                <img src={displayPhoto} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-blue-600">{initials}</span>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                {displayPhoto ? 'Ganti Foto' : 'Upload Foto'}
              </button>
              {photoPreview && (
                <button
                  type="button"
                  onClick={() => onPhotoChange(null)}
                  className="text-xs text-red-500 hover:underline text-left"
                >
                  Batalkan pilihan
                </button>
              )}
              <p className="text-xs text-gray-400">JPG, PNG, WebP · Maks 5 MB</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      )}

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nama Lengkap <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Masukkan nama lengkap"
            value={formData.name}
            onChange={onChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            required
            disabled={loading}
          />
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Masukkan alamat email"
            value={formData.email}
            onChange={onChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            required
            disabled={loading}
          />
        </div>
      </div>

      {/* Role Field */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
          Role / Hak Akses <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={onChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow appearance-none bg-white"
            required
            disabled={loading}
          >
            <option value="">Pilih Role</option>
            {roles.map(role => (
              <option key={role.value} value={role.value}>
                {role.icon} {role.label}
              </option>
            ))}
          </select>
        </div>

        {/* Role Description */}
        {formData.role && (
          <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  {roles.find(r => r.value === formData.role)?.icon}{' '}
                  {roles.find(r => r.value === formData.role)?.label}
                </p>
                <p className="text-xs text-blue-600">
                  {roles.find(r => r.value === formData.role)?.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Password Field — hanya tampil saat tambah user baru */}
      {!editingId && (
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Masukkan password"
              value={formData.password}
              onChange={onChange}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              required
              disabled={loading}
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">Minimal 6 karakter</p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>{editingId ? 'Update User' : 'Simpan User'}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-5 h-5" />
          Batal
        </button>
      </div>
    </form>
  )
}