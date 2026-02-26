import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { Camera, Trash2, Save, X, User as UserIcon, Phone, FileText } from 'lucide-react'
import apiClient, { User, getImageUrl } from '../../services/api'

export const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  // Photo state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [removingPhoto, setRemovingPhoto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
  })

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getProfile()
        if (response.success && response.data) {
          const userData = response.data as User
          setUser(userData)
          setFormData({
            name: userData.name || '',
            bio: userData.bio || '',
            phone: userData.phone || '',
          })
        } else {
          setError('Gagal memuat data profile')
        }
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan saat memuat profile')
      } finally {
        setLoading(false)
      }
    }
    fetchUserProfile()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate type
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      toast.error('Format foto tidak didukung. Gunakan JPG, PNG, atau WebP.')
      return
    }
    // Validate size (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran foto maksimal 5 MB.')
      return
    }

    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
    // Reset the input so the same file can be selected again if needed
    e.target.value = ''
  }

  const handleCancelPhotoChange = () => {
    setPhotoFile(null)
    if (photoPreview && photoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreview)
    }
    setPhotoPreview(null)
  }

  const handleRemovePhoto = async () => {
    if (!user?.photo) return
    if (!window.confirm('Hapus foto profil Anda?')) return

    try {
      setRemovingPhoto(true)
      const res = await apiClient.removeProfilePhoto()
      if (res.success) {
        setUser(prev => prev ? { ...prev, photo: undefined } : prev)
        toast.success('Foto profil berhasil dihapus')
      } else {
        toast.error(res.message || 'Gagal menghapus foto')
      }
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus foto')
    } finally {
      setRemovingPhoto(false)
    }
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Nama tidak boleh kosong')
      return
    }

    try {
      setSaving(true)
      setError('')

      const res = await apiClient.updateProfile({
        name: formData.name,
        bio: formData.bio,
        phone: formData.phone,
        photoFile: photoFile,
      })

      if (res.success && res.data) {
        const updated = (res.data as any).user as User
        setUser(updated)
        setFormData({
          name: updated.name || '',
          bio: updated.bio || '',
          phone: updated.phone || '',
        })
        // Clear pending photo preview
        if (photoPreview && photoPreview.startsWith('blob:')) {
          URL.revokeObjectURL(photoPreview)
        }
        setPhotoFile(null)
        setPhotoPreview(null)
        setIsEditing(false)
        toast.success('Profil berhasil diperbarui')
      } else {
        throw new Error(res.message || 'Gagal memperbarui profil')
      }
    } catch (err: any) {
      const msg = err.message || 'Terjadi kesalahan'
      setError(msg)
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    handleCancelPhotoChange()
    setFormData({
      name: user?.name || '',
      bio: user?.bio || '',
      phone: user?.phone || '',
    })
    setError('')
  }

  const currentPhotoUrl = photoPreview || (user?.photo ? getImageUrl(user.photo) : null)
  const initials = (user?.name || 'U').charAt(0).toUpperCase()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Profile Saya</h1>
        <p className="text-slate-600 mt-2">Kelola informasi akun Anda</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-10 flex items-end justify-between">
          {/* Avatar + name */}
          <div className="flex items-end gap-5">
            {/* Avatar with change photo overlay */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-white shadow-lg border-4 border-white overflow-hidden flex items-center justify-center">
                {currentPhotoUrl ? (
                  <img
                    src={currentPhotoUrl}
                    alt={user?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-blue-600">{initials}</span>
                )}
              </div>

              {/* Overlay: change photo button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Ganti foto"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            <div className="text-white pb-1">
              <h2 className="text-3xl font-bold">{user?.name}</h2>
              <p className="text-blue-100 text-sm">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 rounded text-xs font-medium capitalize">
                {user?.role || 'user'}
              </span>
            </div>
          </div>

          {/* Edit / Action btns */}
          <div className="flex gap-2 items-center">
            {/* Show pending photo change notice */}
            {photoFile && (
              <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-lg text-sm font-medium">
                <Camera className="w-4 h-4" />
                <span>Foto baru dipilih</span>
                <button
                  type="button"
                  onClick={handleCancelPhotoChange}
                  className="ml-1 hover:text-yellow-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {!isEditing && !photoFile && (
              <>
                {user?.photo && (
                  <button
                    onClick={handleRemovePhoto}
                    disabled={removingPhoto}
                    className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                    title="Hapus foto profil"
                  >
                    <Trash2 className="w-4 h-4" />
                    {removingPhoto ? 'Menghapus...' : 'Hapus Foto'}
                  </button>
                )}
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Left â€” Basic Info */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Informasi Dasar</h3>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <UserIcon className="inline w-4 h-4 mr-1 text-slate-400" />
                  Nama Lengkap
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-slate-900 font-medium">{user?.name || 'â€”'}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <Phone className="inline w-4 h-4 mr-1 text-slate-400" />
                  No. Telepon
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Contoh: 08123456789"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-slate-900 font-medium">{user?.phone || 'â€”'}</p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <FileText className="inline w-4 h-4 mr-1 text-slate-400" />
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Tulis sedikit tentang Anda..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                ) : (
                  <p className="text-slate-900">{user?.bio || 'â€”'}</p>
                )}
              </div>
            </div>

            {/* Right â€” Account Info */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Informasi Akun</h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <p className="text-slate-900 font-medium">{user?.email}</p>
                <p className="text-xs text-slate-400 mt-0.5">Email tidak dapat diubah dari sini</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">ID User</label>
                <p className="text-slate-900 font-medium">{user?.id}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold capitalize">
                  {user?.role || 'user'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${user?.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-slate-900 font-medium">{user?.isActive ? 'Aktif' : 'Nonaktif'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Waktu Akun</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bergabung</label>
                <p className="text-slate-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Terakhir Diupdate</label>
                <p className="text-slate-900">
                  {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Save / Cancel buttons */}
          {(isEditing || photoFile) && (
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-6 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 disabled:opacity-50 transition-colors"
              >
                Batal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
