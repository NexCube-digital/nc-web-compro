import React from 'react'
import { Portfolio } from '../../../services/api'
import { Edit2, Trash2, Loader, ExternalLink, Star } from 'lucide-react'
import { getImageUrl } from '../../../services/api'

interface PortfolioTableProps {
  portfolios: Portfolio[]
  loading?: boolean
  deleteLoading: number | null
  onEdit: (portfolio: Portfolio) => void
  onDelete: (id: number) => void
  getCategoryColor: (category: string) => string
}

export const PortfolioTable: React.FC<PortfolioTableProps> = ({
  portfolios,
  loading,
  deleteLoading,
  onEdit,
  onDelete,
  getCategoryColor
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
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Portfolio
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kategori
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Link
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {portfolios.map((portfolio, index) => (
            <tr 
              key={portfolio.id} 
              className={`hover:bg-gray-50 transition-colors ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
              }`}
            >
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                    {portfolio.image ? (
                      <img
                        src={getImageUrl(portfolio.image)}
                        alt={portfolio.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=No+Image'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {portfolio.title}
                    </div>
                    {portfolio.description && (
                      <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                        {portfolio.description}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(portfolio.category)}`}>
                  {portfolio.category}
                </span>
              </td>
              
              <td className="px-6 py-4">
                <div className="text-sm text-gray-600">
                  {portfolio.client || '-'}
                </div>
              </td>
              
              <td className="px-6 py-4 text-center">
                {portfolio.featured ? (
                  <span className="inline-flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs">
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </span>
                ) : (
                  <span className="text-gray-400 text-xs">-</span>
                )}
              </td>
              
              <td className="px-6 py-4 text-center">
                {portfolio.link ? (
                  <a
                    href={portfolio.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-xs">Visit</span>
                  </a>
                ) : (
                  <span className="text-gray-400 text-xs">-</span>
                )}
              </td>
              
              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit(portfolio)}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                    title="Edit portfolio"
                    disabled={deleteLoading === portfolio.id}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(portfolio.id)}
                    disabled={deleteLoading === portfolio.id}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Hapus portfolio"
                  >
                    {deleteLoading === portfolio.id ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
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