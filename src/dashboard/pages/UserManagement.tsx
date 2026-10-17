import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-hot-toast'
import apiClient, { User } from '../../services/api'
import { UserTable } from './user/UserTable'
import { FormUser, TeamFormData } from './user/FormUser'
import { Search, Plus, RefreshCw, AlertCircle, Users, Sparkles } from 'lucide-react'

const emptyTeamData: TeamFormData = {
  position: '',
  bio: '',
  experience: '',
  expertise: '',
  portfolioUrl: '',
  bank: '',
  accountNumber: '',
  status: 'active',
  image: '',
}

export const UserManagement: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingUserHadTeam, setEditingUserHadTeam] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)

  // Photo state for admin editing (foto akun User)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [currentEditingPhoto, setCurrentEditingPhoto] = useState<string | undefined>(undefined)

  const showForm = location.pathname.includes('/formuser')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  })

  // State khusus data profil tim
  const [isTeamMember, setIsTeamMember] = useState(false)
  const [teamData, setTeamData] = useState<TeamFormData>({ ...emptyTeamData })

  // Load users
  const loadUsers = async (showToast = false) => {
    try {
      setLoading(true)
      setError('')

      const res = await apiClient.getUsers()

      if (res.success && res.data) {
        setUsers(res.data)
        if (showToast) {
          toast.success('Data users berhasil dimuat')
        }
      } else {
        throw new Error(res.message || 'Gagal memuat data users')
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Terjadi kesalahan saat memuat data'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.teamProfile?.position && user.teamProfile.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handler input data profil tim (position, bio, expertise, dll)
  const handleTeamInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setTeamData((prev) => ({ ...prev, [name]: value }))
  }

  // Handler upload foto profil tim -> base64
  const handleTeamImageChange = (file: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setTeamData((prev) => ({ ...prev, image: reader.result as string }))
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Nama harus diisi')
      return
    }

    if (!formData.email.trim()) {
      toast.error('Email harus diisi')
      return
    }

    if (!formData.role) {
      toast.error('Role harus dipilih')
      return
    }

    if (!editingId && !formData.password.trim()) {
      toast.error('Password harus diisi untuk user baru')
      return
    }

    // Validasi profil tim jika diaktifkan
    if (isTeamMember && !teamData.position.trim()) {
      toast.error('Posisi/jabatan di tim wajib diisi jika profil tim diaktifkan')
      return
    }

    try {
      setLoading(true)
      setError('')

      let teamPayload: any = undefined
      if (isTeamMember) {
        teamPayload = { ...teamData, isTeamMember: true }
      } else if (editingId && editingUserHadTeam) {
        teamPayload = { removeTeamProfile: true }
      }

      if (editingId) {
        const { password, ...updatePayload } = formData
        const res = await apiClient.updateUser(editingId.toString(), {
          ...updatePayload,
          team: teamPayload,
          photoFile,
        })
        if (res.success) {
          toast.success('Data pengguna & tim berhasil diperbarui')
          if (res.data) {
            setUsers((prev) => prev.map((u) => (u.id === editingId ? { ...u, ...res.data } : u)))
          }
          // Refresh user context if edited own account
          try {
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
            if (storedUser.id === editingId) {
              window.dispatchEvent(new CustomEvent('profileUpdated'))
            }
          } catch {}
        } else {
          throw new Error(res.message || 'Gagal mengupdate user')
        }
      } else {
        const res = await apiClient.createUser({ ...formData, team: teamPayload })
        if (res.success) {
          toast.success('Pengguna baru berhasil ditambahkan')
        } else {
          throw new Error(res.message || 'Gagal menambahkan user')
        }
      }

      await loadUsers()
      navigate('/dashboard/users')

      // Reset form
      setEditingId(null)
      setEditingUserHadTeam(false)
      setFormData({ name: '', email: '', password: '', role: '' })
      setIsTeamMember(false)
      setTeamData({ ...emptyTeamData })
      setPhotoFile(null)
      if (photoPreview && photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview)
      setPhotoPreview(null)
      setCurrentEditingPhoto(undefined)
    } catch (err: any) {
      const errorMessage = err.message || 'Terjadi kesalahan'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user: User) => {
    setEditingId(user.id)
    setEditingUserHadTeam(!!user.teamProfile)
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role ?? '',
    })

    const hasTeam = !!user.teamProfile
    setIsTeamMember(hasTeam)
    setTeamData({
      position: user.teamProfile?.position || '',
      bio: user.teamProfile?.bio || '',
      experience: user.teamProfile?.experience || '',
      expertise: user.teamProfile?.expertise || '',
      portfolioUrl: user.teamProfile?.portfolioUrl || '',
      bank: user.teamProfile?.bank || '',
      accountNumber: user.teamProfile?.accountNumber || '',
      status: user.teamProfile?.status || 'active',
      image: user.teamProfile?.image || '',
    })

    setCurrentEditingPhoto(user.photo)
    setPhotoFile(null)
    setPhotoPreview(null)
    navigate('/dashboard/users/formuser')
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus akun user ini beserta profil timnya?')) {
      return
    }

    try {
      setDeleteLoading(id)
      const res = await apiClient.deleteUser(id.toString())

      if (res.success) {
        toast.success('User berhasil dihapus')
        await loadUsers()
      } else {
        throw new Error(res.message || 'Gagal menghapus user')
      }
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus user')
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleCancel = () => {
    navigate('/dashboard/users')
    setEditingId(null)
    setEditingUserHadTeam(false)
    setFormData({ name: '', email: '', password: '', role: '' })
    setIsTeamMember(false)
    setTeamData({ ...emptyTeamData })
    setPhotoFile(null)
    if (photoPreview && photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview)
    setPhotoPreview(null)
    setCurrentEditingPhoto(undefined)
  }

  const handleRefresh = () => {
    loadUsers(true)
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 font-medium">Memuat data pengguna...</span>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <Helmet>
        <title>Users & Tim | Dashboard NexCube</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl shadow-md shadow-blue-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Users & Tim
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Kelola akun pengguna, hak akses role (Admin, Designer, Teknis, User), serta profil publik tim dalam satu tempat.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {!showForm && (
            <button
              onClick={() => {
                setEditingId(null)
                setEditingUserHadTeam(false)
                setFormData({ name: '', email: '', password: '', role: '' })
                setIsTeamMember(false)
                setTeamData({ ...emptyTeamData })
                navigate('/dashboard/users/formuser')
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah User</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Bar - Only show on list view */}
      {!showForm && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, email, jabatan tim, atau role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50/50"
            />
          </div>
        </div>
      )}

      {/* Content: Form or Table */}
      {showForm ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {editingId ? 'Edit Akun Pengguna & Tim' : 'Tambah Akun Pengguna & Tim Baru'}
              </h2>
              <p className="text-xs text-slate-500">
                Isi informasi akun serta profil tim yang akan tampil di halaman publik website.
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              ✕
            </button>
          </div>

          <FormUser
            formData={formData}
            loading={loading}
            editingId={editingId}
            currentPhoto={currentEditingPhoto}
            photoPreview={photoPreview}
            onChange={handleInputChange}
            onPhotoChange={(file) => {
              setPhotoFile(file)
              if (photoPreview && photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview)
              setPhotoPreview(file ? URL.createObjectURL(file) : null)
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            teamData={teamData}
            onTeamChange={handleTeamInputChange}
            onTeamImageChange={handleTeamImageChange}
            isTeamMember={isTeamMember}
            onToggleTeamMember={setIsTeamMember}
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
            <p className="text-xs sm:text-sm font-medium text-slate-600">
              Total Pengguna & Tim: <span className="font-bold text-slate-900">{filteredUsers.length}</span>
              {searchTerm && ` (hasil filter dari ${users.length} total)`}
            </p>
            <span className="text-xs text-slate-400">
              {filteredUsers.filter((u) => !!u.teamProfile).length} Anggota Tim Publik
            </span>
          </div>

          <UserTable
            users={filteredUsers}
            loading={loading}
            deleteLoading={deleteLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {filteredUsers.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-sm">
                {searchTerm ? 'Tidak ada pengguna yang sesuai dengan pencarian' : 'Belum ada data user'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-blue-600 hover:text-blue-700 font-semibold text-xs"
                >
                  Reset Pencarian
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default UserManagement