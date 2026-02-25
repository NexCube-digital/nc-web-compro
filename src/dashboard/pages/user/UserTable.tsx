import React from 'react'
import { User } from '../../../services/api'
import { Edit2, Trash2, Loader, Shield, ShieldCheck } from 'lucide-react'

interface UserTableProps {
  users: User[]
  loading?: boolean
  deleteLoading: number | null
  onEdit: (user: User) => void
  onDelete: (id: number) => void
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  deleteLoading,
  onEdit,
  onDelete
}) => {
  const getRoleBadge = (role: string = 'user') => {
    const roles = {
      admin: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        icon: <ShieldCheck className="w-3.5 h-3.5 mr-1" />,
        label: 'Admin'
      },
      user: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: <Shield className="w-3.5 h-3.5 mr-1" />,
        label: 'User'
      }
    }

    const roleConfig = roles[role as keyof typeof roles] || roles.user
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleConfig.bg} ${roleConfig.text}`}>
        {roleConfig.icon}
        {roleConfig.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-gray-600">Memuat data...</span>
      </div>
    )
  }


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user, index) => (
            <tr 
              key={user.id} 
              className={`hover:bg-gray-50 transition-colors ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                    user.role === 'admin' ? 'bg-purple-100' : 'bg-blue-100'
                  }`}>
                    <span className={`font-medium text-sm ${
                      user.role === 'admin' ? 'text-purple-600' : 'text-blue-600'
                    }`}>
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getRoleBadge(user.role)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => onEdit(user)}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                    title="Edit user"
                    disabled={deleteLoading === user.id}
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    disabled={deleteLoading === user.id}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Hapus user"
                  >
                    {deleteLoading === user.id ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}