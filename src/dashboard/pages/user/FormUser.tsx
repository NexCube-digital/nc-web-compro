import React, { useState, useRef } from 'react'
import { User, Mail, Lock, Save, X, Shield, Eye, EyeOff, Camera, Briefcase, Award, Globe, CreditCard, Sparkles } from 'lucide-react'
import { getImageUrl } from '../../../services/api'

export interface TeamFormData {
  position: string
  bio: string
  experience: string
  expertise: string // comma-separated di form
  portfolioUrl: string
  bank: string
  accountNumber: string
  status: 'active' | 'in-active'
  image: string // base64 data URL, atau path lama saat edit
}

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
  teamData: TeamFormData
  onTeamChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onTeamImageChange: (file: File | null) => void
  isCurrentlyTeam?: boolean
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
  onCancel,
  teamData,
  onTeamChange,
  onTeamImageChange,
  isCurrentlyTeam = false,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const teamFileInputRef = useRef<HTMLInputElement>(null)

  const isLeavingTeamRole = editingId !== null && isCurrentlyTeam && formData.role !== 'team' && formData.role !== ''

  const handleSubmitWithGuard = (e: React.FormEvent) => {
    if (isLeavingTeamRole) {
      const confirmed = window.confirm(
        'Anda mengubah role dari Team ke ' +
        (formData.role === 'admin' ? 'Admin' : 'User') +
        '. Seluruh data profil tim (bio, foto, posisi, portfolio, dll) akan DIHAPUS PERMANEN. Lanjutkan?'
      )
      if (!confirmed) {
        e.preventDefault()
        return
      }
    }
    onSubmit(e)
  }

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

  const handleTeamFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      const allowed = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowed.includes(file.type)) {
        alert('Format foto tidak didukung. Gunakan JPG, PNG, atau WebP.')
        e.target.value = ''
        return
      }
      if (file.size > 2.5 * 1024 * 1024) {
        alert('Ukuran foto maksimal 2.5 MB.')
        e.target.value = ''
        return
      }
    }
    onTeamImageChange(file)
    e.target.value = ''
  }

  const displayPhoto = photoPreview || (currentPhoto ? getImageUrl(currentPhoto) : null)
  const initials = (formData.name || '?').charAt(0).toUpperCase()

  const displayTeamPhoto =
    teamData.image
      ? teamData.image.startsWith('data:') || teamData.image.startsWith('http')
        ? teamData.image
        : getImageUrl(teamData.image)
      : null

  const roles = [
    { value: 'user', label: 'User', description: 'Hanya dapat melihat portfolio' },
    { value: 'team', label: 'Team', description: 'Akses sama seperti Admin, plus punya profil tim publik' },
    { value: 'admin', label: 'Admin', description: 'Akses penuh ke semua fitur' },
  ]

  const isTeam = formData.role === 'team'

  return (
    <form onSubmit={handleSubmitWithGuard} className="space-y-6">
      {/* Photo Upload (hanya saat edit user) */}
      {editingId && !isTeam && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto Profil
          </label>
          <div className="flex items-center gap-4">
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
                {role.label}
              </option>
            ))}
          </select>
        </div>

        {isLeavingTeamRole && (
          <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-xl px-4 py-3">
            <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>
              <strong>Perhatian:</strong> Mengganti role dari <strong>Team</strong> ke{' '}
              <strong>{formData.role === 'admin' ? 'Admin' : 'User'}</strong> akan menghapus
              seluruh data profil tim (bio, foto, posisi, portfolio, bank) secara permanen.
              Anda akan diminta konfirmasi saat menyimpan.
            </p>
          </div>
        )}

        {formData.role && (
          <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">
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

      {/* ── Blok Data Profil Tim — hanya muncul kalau role === 'team' ─────── */}
      {isTeam && (
        <div className="space-y-4 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-indigo-900">Data Profil Tim</h3>
          </div>

          {/* Foto Tim */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-indigo-200 flex-shrink-0">
              {displayTeamPhoto ? (
                <img src={displayTeamPhoto} alt="Foto tim" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-indigo-300">
                  <User className="w-6 h-6" />
                </div>
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={() => teamFileInputRef.current?.click()}
                disabled={loading}
                className="px-3 py-1.5 border border-indigo-200 bg-white rounded-lg text-xs font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors"
              >
                Upload Foto Tim
              </button>
              <input
                ref={teamFileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleTeamFileChange}
              />
              <p className="text-[11px] text-indigo-400 mt-1">JPG, PNG, WebP · Maks 2.5 MB</p>
            </div>
          </div>

          <div>
            <label htmlFor="position" className="block text-xs font-bold text-gray-700 mb-1.5">
              Posisi / Jabatan <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                id="position"
                name="position"
                type="text"
                placeholder="Contoh: Senior Fullstack Engineer"
                value={teamData.position}
                onChange={onTeamChange}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="experience" className="block text-xs font-bold text-gray-700 mb-1.5">
                Pengalaman
              </label>
              <div className="relative">
                <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="experience"
                  name="experience"
                  type="text"
                  placeholder="Contoh: 5 tahun"
                  value={teamData.experience}
                  onChange={onTeamChange}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <label htmlFor="status" className="block text-xs font-bold text-gray-700 mb-1.5">
                Status Tampil Publik
              </label>
              <select
                id="status"
                name="status"
                value={teamData.status}
                onChange={onTeamChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                disabled={loading}
              >
                <option value="active">Active</option>
                <option value="in-active">In-active</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="portfolioUrl" className="block text-xs font-bold text-gray-700 mb-1.5">
              Portfolio URL
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                id="portfolioUrl"
                name="portfolioUrl"
                type="url"
                placeholder="https://portfolio.com"
                value={teamData.portfolioUrl}
                onChange={onTeamChange}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="bank" className="block text-xs font-bold text-gray-700 mb-1.5">
                Bank
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  id="bank"
                  name="bank"
                  value={teamData.bank}
                  onChange={onTeamChange}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  disabled={loading}
                >
                  <option value="">Pilih Bank</option>
                  <option value="BCA">BCA</option>
                  <option value="Mandiri">Mandiri</option>
                  <option value="BNI">BNI</option>
                  <option value="BRI">BRI</option>
                  <option value="CIMB">CIMB Niaga</option>
                  <option value="SeaBank">SeaBank</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="accountNumber" className="block text-xs font-bold text-gray-700 mb-1.5">
                No. Rekening
              </label>
              <input
                id="accountNumber"
                name="accountNumber"
                type="text"
                placeholder="1234567890"
                value={teamData.accountNumber}
                onChange={onTeamChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="expertise" className="block text-xs font-bold text-gray-700 mb-1.5">
              Keahlian (pisahkan dengan koma)
            </label>
            <input
              id="expertise"
              name="expertise"
              type="text"
              placeholder="React, TypeScript, Node.js"
              value={teamData.expertise}
              onChange={onTeamChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-xs font-bold text-gray-700 mb-1.5">
              Bio Tim
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              placeholder="Deskripsi singkat anggota tim untuk halaman publik..."
              value={teamData.bio}
              onChange={onTeamChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
          </div>
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