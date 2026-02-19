import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import apiClient, { User } from '../../services/api'
import { UserTable } from './user/UserTable'
import { FormUser } from './user/FormUser'

export const UserManagement: React.FC = () => {

  const navigate = useNavigate()
  const location = useLocation()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const showForm = location.pathname.includes('/formuser')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  // load users
  const loadUsers = async () => {
    try {
      setLoading(true)
      const res = await apiClient.getUsers()

      if (res.success && res.data) {
        setUsers(res.data)
      }

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  // filter
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()

    try {

      setLoading(true)

      if (editingId) {

        await apiClient.updateUser(editingId.toString(), formData)

      } else {

        await apiClient.createUser(formData)

      }

      await loadUsers()

      navigate('/dashboard/users')

      setEditingId(null)

      setFormData({
        name: '',
        email: '',
        password: ''
      })

    } catch (err: any) {

      setError(err.message)

    } finally {

      setLoading(false)

    }
  }

  const handleEdit = (user: User) => {

    setEditingId(user.id)

    setFormData({
      name: user.name,
      email: user.email,
      password: ''
    })

    navigate('/dashboard/users/formuser')
  }

  const handleDelete = async (id: number) => {

    await apiClient.deleteUser(id.toString())

    loadUsers()
  }

  const handleCancel = () => {

    navigate('/dashboard/users')

    setEditingId(null)

    setFormData({
      name: '',
      email: '',
      password: ''
    })
  }

  return (
    <div>

      <Helmet>
        <title>Manajemen User</title>
      </Helmet>

      <div className="flex justify-between mb-6">

        <input
          placeholder="Cari user..."
          value={searchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        {!showForm && (
          <button
            onClick={()=>navigate('/dashboard/users/formuser')}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Tambah User
          </button>
        )}

      </div>

      {showForm ? (

        <FormUser
          formData={formData}
          loading={loading}
          editingId={editingId}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />

      ) : (

        <UserTable
          users={filteredUsers}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

      )}

    </div>
  )
}

export default UserManagement
