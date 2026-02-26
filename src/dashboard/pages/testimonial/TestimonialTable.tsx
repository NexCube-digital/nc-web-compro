import React from 'react'
import { TestimonialItem } from '../TestimonialManagement'
import { Edit2, Trash2, Loader, Eye, EyeOff, Star } from 'lucide-react'

interface TestimonialTableProps {
  testimonials: TestimonialItem[]
  loading?: boolean
  deleteLoading: number | null
  onEdit: (item: TestimonialItem) => void
  onDelete: (id: number) => void
  onToggleStatus: (id: number) => void
}

const statusConfig = {
  published: {
    label: 'Published',
    class: 'bg-green-100 text-green-700 border border-green-200',
  },
  pending: {
    label: 'Pending',
    class: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  },
  hidden: {
    label: 'Hidden',
    class: 'bg-gray-100 text-gray-600 border border-gray-200',
  },
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${
          i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'
        }`}
      />
    ))}
  </div>
)

export const TestimonialTable: React.FC<TestimonialTableProps> = ({
  testimonials,
  loading,
  deleteLoading,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Klien
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ulasan
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rating
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tanggal
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {testimonials.map((item, index) => {
            const cfg = statusConfig[item.status]
            return (
              <tr
                key={item.id}
                className={`hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                }`}
              >
                {/* Klien */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-orange-400 flex items-center justify-center shadow-sm">
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={e => {
                            const el = e.currentTarget
                            el.style.display = 'none'
                            el.parentElement!.innerHTML = `<span class="text-white font-bold text-sm">${item.name.charAt(0).toUpperCase()}</span>`
                          }}
                        />
                      ) : (
                        <span className="text-white font-bold text-sm">
                          {item.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.company || '-'}</p>
                    </div>
                  </div>
                </td>

                {/* Ulasan */}
                <td className="px-6 py-4 max-w-xs">
                  <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                    "{item.text}"
                  </p>
                </td>

                {/* Rating */}
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <StarRating rating={item.rating} />
                    <span className="text-xs text-gray-500 font-medium">{item.rating}/5</span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${cfg.class}`}>
                    {cfg.label}
                  </span>
                </td>

                {/* Tanggal */}
                <td className="px-6 py-4 text-center">
                  <span className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </td>

                {/* Aksi */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-1.5">
                    {/* Toggle Published/Hidden */}
                    <button
                      onClick={() => onToggleStatus(item.id)}
                      title={item.status === 'published' ? 'Sembunyikan' : 'Publikasikan'}
                      className={`p-2 rounded-lg transition-colors ${
                        item.status === 'published'
                          ? 'text-green-600 hover:bg-green-50 hover:text-green-800'
                          : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                      }`}
                    >
                      {item.status === 'published' ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => onEdit(item)}
                      disabled={deleteLoading === item.id}
                      title="Edit"
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => onDelete(item.id)}
                      disabled={deleteLoading === item.id}
                      title="Hapus"
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleteLoading === item.id ? (
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