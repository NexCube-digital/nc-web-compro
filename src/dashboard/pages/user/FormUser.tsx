import React from 'react'

interface Props {

  formData: any
  loading: boolean
  editingId: number | null

  onChange: (e:any)=>void
  onSubmit: (e:any)=>void
  onCancel: ()=>void
}

export const FormUser: React.FC<Props> = ({
  formData,
  loading,
  editingId,
  onChange,
  onSubmit,
  onCancel
}) => {

  return (

    <form onSubmit={onSubmit} className="space-y-4">

      <input
        name="name"
        placeholder="Nama"
        value={formData.name}
        onChange={onChange}
        className="border p-2 w-full"
        required
      />

      <input
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={onChange}
        className="border p-2 w-full"
        required
      />

      <input
        name="password"
        type="password"
        placeholder={editingId ? "Kosongkan jika tidak diubah" : "Password"}
        value={formData.password}
        onChange={onChange}
        className="border p-2 w-full"
        required={!editingId}
      />

      <div className="space-x-2">

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update" : "Create"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>

      </div>

    </form>

  )
}
