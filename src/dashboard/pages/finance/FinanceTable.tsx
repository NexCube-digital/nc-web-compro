import React, { useState } from 'react'
import { Finance } from '../../../services/api'
import { ConfirmDialog } from '../../../components/ConfirmDialog'

interface FinanceTableProps {
  finances: Finance[];
  loading?: boolean;
  onEditFinance?: (finance: Finance) => void;
  onDeleteFinance?: (financeId: number) => Promise<void>;
  onViewDetail?: (finance: Finance) => void;
}

export const FinanceTable: React.FC<FinanceTableProps> = ({
  finances,
  loading = false,
  onEditFinance,
  onDeleteFinance,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteFinanceId, setDeleteFinanceId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (financeId: number) => {
    setDeleteFinanceId(financeId)
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = async () => {
    if (deleteFinanceId == null || !onDeleteFinance) return

    setIsDeleting(true)
    try {
      await onDeleteFinance(deleteFinanceId)
      // FIX: toast ditangani oleh parent (FinanceManagement), tidak perlu di sini
    } catch {
      // error toast juga ditangani parent
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
      setDeleteFinanceId(null)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
    setDeleteFinanceId(null)
  }

  const filteredFinances = Array.isArray(finances) ? finances : []

  if (filteredFinances.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-slate-600 font-medium">Belum ada transaksi</p>
        <p className="text-slate-500 text-sm mt-2">Tambahkan transaksi keuangan terlebih dahulu</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {['Tanggal', 'Tipe', 'Kategori', 'Deskripsi', 'Jumlah', 'Status', 'Aksi'].map((h, i) => (
                <th key={h} className={`px-6 py-4 text-xs font-semibold text-slate-700 uppercase tracking-wide ${i === 4 ? 'text-right' : i === 6 ? 'text-center' : 'text-left'}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredFinances.map((finance, index) => (
              <tr key={finance.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>

                {/* Tanggal */}
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-900">
                    {new Date(finance.date).toLocaleDateString('id-ID')}
                  </p>
                </td>

                {/* Tipe */}
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    finance.type === 'income'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {finance.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                  </span>
                </td>

                {/* Kategori */}
                <td className="px-6 py-4">
                  <p className="text-slate-600 text-sm">{finance.category}</p>
                </td>

                {/* Deskripsi */}
                <td className="px-6 py-4">
                  <p className="text-slate-600 text-sm truncate max-w-xs">{finance.description}</p>
                </td>

                {/* Jumlah */}
                <td className="px-6 py-4 text-right">
                  <p className={`font-bold text-sm ${
                    finance.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {finance.type === 'income' ? '+' : '-'} Rp {Math.round(Number(finance.amount) || 0).toLocaleString('id-ID')}
                  </p>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    finance.status === 'completed'
                      ? 'bg-blue-100 text-blue-700'
                      : finance.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {finance.status === 'completed'
                      ? 'Selesai'
                      : finance.status === 'pending'
                      ? 'Tertunda'
                      : 'Dibatalkan'}
                  </span>
                </td>

                {/* Aksi */}
                <td className="px-6 py-4">
                  <div className="flex gap-2 flex-wrap justify-center">
                    <button
                      onClick={() => onEditFinance && onEditFinance(finance)}
                      disabled={loading || isDeleting}
                      className="px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg hover:bg-purple-200 disabled:opacity-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(finance.id)}
                      disabled={loading || isDeleting}
                      className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200 disabled:opacity-50 transition-colors"
                    >
                      {isDeleting && deleteFinanceId === finance.id ? 'Menghapus...' : 'Hapus'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Hapus Transaksi"
        message="Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        isDangerous={true}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}

export default FinanceTable