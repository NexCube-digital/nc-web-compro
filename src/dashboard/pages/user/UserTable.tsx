import React from 'react'
import { User, getImageUrl } from '../../../services/api'
import { Edit2, Trash2, Loader, Shield, ShieldCheck, Palette, Code2, Users, Briefcase, CheckCircle, XCircle } from 'lucide-react'

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
  onDelete,
}) => {
  const getRoleBadge = (role: string = 'user') => {
    switch (role.toLowerCase()) {
      case 'admin':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-purple-600" />
            Admin
          </span>
        )
      case 'designer':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-800 border border-pink-200">
            <Palette className="w-3.5 h-3.5 mr-1 text-pink-600" />
            Designer
          </span>
        )
      case 'teknis':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
            <Code2 className="w-3.5 h-3.5 mr-1 text-cyan-600" />
            Teknis
          </span>
        )
      case 'team':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <Users className="w-3.5 h-3.5 mr-1 text-indigo-600" />
            Team
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <Shield className="w-3.5 h-3.5 mr-1 text-slate-500" />
            User
          </span>
        )
    }
  }

  const resolveAvatar = (user: User) => {
    return user.teamProfile?.image || user.photo || null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="ml-3 text-slate-600 font-medium">Memuat data pengguna & tim...</span>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 text-sm">
        Tidak ada data pengguna yang ditemukan.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50/80">
          <tr>
            <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
              Pengguna / Profil
            </th>
            <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
              Role Akun
            </th>
            <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
              Profil Tim (Publik)
            </th>
            <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
              Status Akun
            </th>
            <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {users.map((user, index) => {
            const avatarPath = resolveAvatar(user)
            const teamProfile = user.teamProfile

            return (
              <tr
                key={user.id}
                className={`hover:bg-slate-50/80 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                }`}
              >
                {/* User Info Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0 h-11 w-11 rounded-full overflow-hidden flex items-center justify-center bg-slate-100 border border-slate-200">
                      {avatarPath ? (
                        <img
                          src={getImageUrl(avatarPath)}
                          alt={user.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      ) : (
                        <span className="font-bold text-base text-slate-600">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span>{user.name}</span>
                        {teamProfile && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60">
                            Tim
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</div>
                    </div>
                  </div>
                </td>

                {/* Role Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRoleBadge(user.role)}
                </td>

                {/* Team Profile Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {teamProfile ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-800">
                          {teamProfile.position || 'Staff'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {teamProfile.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            Tampil Publik
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            <XCircle className="w-3 h-3 text-slate-400" />
                            Nonaktif
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Bukan Anggota Tim</span>
                  )}
                </td>

                {/* Account Status Column */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      user.isActive !== false
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : 'bg-red-50 text-red-700 border border-red-200/60'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        user.isActive !== false ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                    />
                    {user.isActive !== false ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>

                {/* Actions Column */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-xl transition-colors border border-transparent hover:border-blue-100"
                      title="Edit user & profil tim"
                      disabled={deleteLoading === user.id}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      disabled={deleteLoading === user.id}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-red-100"
                      title="Hapus user"
                    >
                      {deleteLoading === user.id ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default UserTable