import React from 'react'
import { User } from '../../../services/api'

interface Props {

  users: User[]
  loading?: boolean

  onEdit: (user: User)=>void
  onDelete: (id: number)=>void
}

export const UserTable: React.FC<Props> = ({
  users,
  loading,
  onEdit,
  onDelete
}) => {

  return (

    <table className="w-full border">

      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 text-left">Nama</th>
          <th className="p-2 text-left">Email</th>
          <th className="p-2 text-center">Aksi</th>
        </tr>
      </thead>

      <tbody>

        {users.map(user => (

          <tr key={user.id}>

            <td className="p-2">{user.name}</td>

            <td className="p-2">{user.email}</td>

            <td className="p-2 text-center space-x-2">

              <button
                onClick={()=>onEdit(user)}
                className="text-blue-600"
              >
                Edit
              </button>

              <button
                onClick={()=>onDelete(user.id)}
                className="text-red-600"
              >
                Delete
              </button>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  )
}
