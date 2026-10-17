import React, { useState, useRef } from 'react'
import { User, Mail, Lock, Save, X, Shield, Eye, EyeOff, Camera, Briefcase, Award, Globe, CreditCard, Sparkles, CheckSquare, Square } from 'lucide-react'
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
  isTeamMember: boolean
  onToggleTeamMember: (val: boolean) => void
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
  isTeamMember,
  onToggleTeamMember,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const teamFileInputRef = useRef<HTMLInputElement>(null)

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
    { value: 'admin', label: 'Admin', description: 'Akses penuh ke seluruh menu, laporan, keuangan, dan pengaturan sistem' },
    { value: 'designer', label: 'Designer', description: 'Fokus pada Portofolio, Desain Grafis, Katalog, dan Konten Kreatif' },
    { value: 'teknis', label: 'Teknis', description: 'Fokus pada Pengembangan Website, Web App, Event, dan Operasional Teknis' },
    { value: 'user', label: 'User', description: 'Pengguna standar / akun umum' },
  ]

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Photo Upload (hanya saat edit user) */}
      {editingId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto Profil Akun
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
            placeholder="Contoh: Aslam Mushtafa Karim"
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
            placeholder="contoh@nexcube.digital"
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
          Role / Hak Akses Akun <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={onChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow appearance-none bg-white font-medium"
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

        {formData.role && (
          <div className="mt-2 p-3 bg-blue-50/70 rounded-xl border border-blue-100">
            <div className="flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-blue-900">
                  Role: {roles.find(r => r.value === formData.role)?.label}
                </p>
                <p className="text-xs text-blue-700 mt-0.5">
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

      {/* ── Toggle Profil Tim (Tampil di Website Publik) ─────── */}
      <div className="pt-2">
        <div className="p-4 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-blue-200/70 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 text-white rounded-xl shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Profil Anggota Tim (Tampil di Publik)
                </h3>
                <p className="text-xs text-slate-500">
                  Tampilkan profil ini di halaman Tim & Tentang Kami di website utama.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isTeamMember}
                onChange={(e) => onToggleTeamMember(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Form Fields Tim jika Toggle Aktif */}
          {isTeamMember && (
            <div className="space-y-4 pt-4 border-t border-blue-200/60 animate-fade-in">
              {/* Foto Tim */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-indigo-200 flex-shrink-0 shadow-sm">
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
                    className="px-3.5 py-1.5 border border-indigo-200 bg-white rounded-xl text-xs font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors shadow-sm"
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
                  <p className="text-[11px] text-slate-500 mt-1">JPG, PNG, WebP · Maks 2.5 MB</p>
                </div>
              </div>

              <div>
                <label htmlFor="position" className="block text-xs font-bold text-gray-700 mb-1.5">
                  Posisi / Jabatan di Tim <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="position"
                    name="position"
                    type="text"
                    placeholder="Contoh: Founder, Backend, Lead UI/UX Designer, dll"
                    value={teamData.position}
                    onChange={onTeamChange}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required={isTeamMember}
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
                      placeholder="Contoh: 3 Tahun, 5 Tahun"
                      value={teamData.experience}
                      onChange={onTeamChange}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="status" className="block text-xs font-bold text-gray-700 mb-1.5">
                    Status Tampil di Publik
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={teamData.status}
                    onChange={onTeamChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    disabled={loading}
                  >
                    <option value="active">Active (Tampil di Website)</option>
                    <option value="in-active">In-active (Sembunyikan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="portfolioUrl" className="block text-xs font-bold text-gray-700 mb-1.5">
                  Portfolio URL / Tautan Pribadi
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="portfolioUrl"
                    name="portfolioUrl"
                    type="url"
                    placeholder="https://portfolio.com atau linkedin"
                    value={teamData.portfolioUrl}
                    onChange={onTeamChange}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="bank" className="block text-xs font-bold text-gray-700 mb-1.5">
                    Bank (Internal)
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      id="bank"
                      name="bank"
                      value={teamData.bank}
                      onChange={onTeamChange}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                  placeholder="React.js, Next.js, Figma, Database Design"
                  value={teamData.expertise}
                  onChange={onTeamChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-xs font-bold text-gray-700 mb-1.5">
                  Bio Profil Tim
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  placeholder="Deskripsi singkat mengenai pengalaman dan keahlian untuk ditampilkan di website..."
                  value={teamData.bio}
                  onChange={onTeamChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  disabled={loading}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-all font-semibold shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>{editingId ? 'Update Pengguna & Tim' : 'Simpan Pengguna'}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-5 h-5" />
          Batal
        </button>
      </div>
    </form>
  )
}

export default FormUser