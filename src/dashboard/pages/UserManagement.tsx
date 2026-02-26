import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-hot-toast'
import apiClient, { User } from '../../services/api'
import { UserTable } from './user/UserTable'
import { FormUser } from './user/FormUser'
import { Search, Plus, RefreshCw, AlertCircle } from 'lucide-react'

export const UserManagement: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)

  // Photo state for admin editing
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [currentEditingPhoto, setCurrentEditingPhoto] = useState<string | undefined>(undefined)

  const showForm = location.pathname.includes('/formuser')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  })

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
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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

    try {
      setLoading(true)
      setError('')

      if (editingId) {
        // Tidak kirim password saat update — backend updateUser tidak menerimanya
        const { password, ...updatePayload } = formData
        const res = await apiClient.updateUser(editingId.toString(), { ...updatePayload, photoFile })
        if (res.success) {
          toast.success('User berhasil diupdate')
          // Update local users state immediately from returned data
          if (res.data) {
            setUsers(prev => prev.map(u => u.id === editingId ? { ...u, ...res.data } : u))
          }
          // If admin edited their own account, refresh header
          try {
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
            if (storedUser.id === editingId) {
              window.dispatchEvent(new CustomEvent('profileUpdated'))
            }
          } catch { }
        } else {
          throw new Error(res.message || 'Gagal mengupdate user')
        }
      } else {
        const res = await apiClient.createUser(formData)
        if (res.success) {
          toast.success('User berhasil ditambahkan')
        } else {
          throw new Error(res.message || 'Gagal menambahkan user')
        }
      }

      await loadUsers()
      navigate('/dashboard/users')

      // Reset form
      setEditingId(null)
      setFormData({ name: '', email: '', password: '', role: '' })
      // Reset photo
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
    setFormData({
      name: user.name,
      email: user.email,
      password: '',          // tidak digunakan saat edit
      role: user.role ?? ''
    })
    setCurrentEditingPhoto(user.photo)
    setPhotoFile(null)
    setPhotoPreview(null)
    navigate('/dashboard/users/formuser')
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
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
    setFormData({ name: '', email: '', password: '', role: '' })
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Manajemen User - Dashboard</title>
      </Helmet>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen User</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola data pengguna sistem Anda
          </p>
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button
            onClick={() => loadUsers()}
            className="ml-auto text-sm font-medium hover:text-red-800"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari user berdasarkan nama atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
        </div>

        {!showForm && (
          <button
            onClick={() => navigate('/dashboard/users/formuser')}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Tambah User Baru
          </button>
        )}
      </div>

      {/* Content */}
      {showForm ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {editingId ? 'Edit User' : 'Tambah User Baru'}
          </h2>
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
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Total Users: <span className="font-semibold">{filteredUsers.length}</span>
              {searchTerm && ` (hasil pencarian dari ${users.length} total)`}
            </p>
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
              <p className="text-gray-500">
                {searchTerm ? 'Tidak ada user yang sesuai dengan pencarian' : 'Belum ada data user'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
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