import React, { useState } from 'react'
import { Invoice } from '../../../services/api'
import { ConfirmDialog } from '../../../components/ConfirmDialog'
import { Toast, ToastType } from '../../../components/Toast'
import { InvoicePDFModal } from '../../../components/InvoicePDFModal'
import { KwitansiPreview } from '../../../components/KwitansiPreview'

interface InvoiceTableProps {
  invoices: Invoice[];
  loading?: boolean;
  onEditInvoice?: (invoice: Invoice) => void;
  onDeleteInvoice?: (invoiceId: number) => Promise<void>;
  onViewDetail?: (invoice: Invoice) => void;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({ 
  invoices, 
  loading = false,
  onEditInvoice,
  onDeleteInvoice,
  onViewDetail
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<number | null>(null)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showPDFModal, setShowPDFModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const handleDeleteClick = (invoiceId: number) => {
    setDeleteInvoiceId(invoiceId)
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = async () => {
    if (deleteInvoiceId && onDeleteInvoice) {
      try {
        setIsDeleting(true)
        await onDeleteInvoice(deleteInvoiceId)
        setToast({ message: 'Invoice berhasil dihapus', type: 'success' })
      } catch (error: any) {
        setToast({ message: error.message || 'Gagal menghapus invoice', type: 'error' })
      } finally {
        setIsDeleting(false)
        setShowDeleteConfirm(false)
        setDeleteInvoiceId(null)
      }
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
    setDeleteInvoiceId(null)
  }

  const handlePDFPreview = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setShowPDFModal(true)
  }

  const handleDownloadPDF = async () => {
    if (!selectedInvoice) return

    try {
      setToast({ message: 'Membuat PDF...', type: 'info' })

      const html2canvas = (await import('html2canvas-pro')).default
      const { jsPDF } = await import('jspdf')

      const element = document.getElementById('kwitansi-print-area')
      if (!element) {
        setToast({ message: 'Gagal menemukan konten invoice', type: 'error' })
        return
      }

      const canvas = await html2canvas(element, { scale: 2 })
      const imgData = canvas.toDataURL('image/jpeg', 0.98)

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`${selectedInvoice.invoiceNumber}.pdf`)

      setToast({ message: 'PDF berhasil diunduh', type: 'success' })
      setTimeout(() => setShowPDFModal(false), 500)
    } catch (error) {
      console.error('PDF generation error:', error)
      setToast({ message: 'Gagal membuat PDF', type: 'error' })
    }
  }

  const filteredInvoices = Array.isArray(invoices) ? invoices : []

  if (filteredInvoices.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-slate-600 font-medium">Belum ada invoice</p>
        <p className="text-slate-500 text-sm mt-2">Buat invoice terlebih dahulu</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Head */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                No. Invoice
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Klien
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Tanggal
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Layanan
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Jumlah
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Aksi
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {filteredInvoices.map((invoice, index) => (
              <tr key={invoice.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                {/* Invoice Number */}
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-900">{invoice.invoiceNumber}</p>
                </td>

                {/* Client Name */}
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-slate-900">{invoice.clientName}</p>
                    <p className="text-xs text-slate-500">{invoice.clientEmail}</p>
                  </div>
                </td>

                {/* Date */}
                <td className="px-6 py-4">
                  <p className="text-slate-600 text-sm">{new Date(invoice.issueDate).toLocaleDateString('id-ID')}</p>
                  <p className="text-xs text-slate-500">Jatuh tempo: {new Date(invoice.dueDate).toLocaleDateString('id-ID')}</p>
                </td>

                {/* Service */}
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                    {invoice.service === 'website' ? 'Website' : 
                     invoice.service === 'undangan' ? 'Undangan' :
                     invoice.service === 'desain' ? 'Desain' : 'Katalog'}
                  </span>
                </td>

                {/* Amount */}
                <td className="px-6 py-4 text-right">
                  <p className="font-bold text-slate-900">Rp {Math.round(parseFloat(String(invoice.amount)) || 0).toLocaleString('id-ID')}</p>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    invoice.status === 'paid' 
                      ? 'bg-green-100 text-green-700'
                      : invoice.status === 'sent'
                      ? 'bg-blue-100 text-blue-700'
                      : invoice.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {invoice.status === 'paid' ? 'Terbayar' :
                     invoice.status === 'sent' ? 'Terkirim' :
                     invoice.status === 'draft' ? 'Draft' : 'Jatuh Tempo'}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3 justify-center">
                    <button
                      onClick={() => handlePDFPreview(invoice)}
                      disabled={loading}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg hover:text-green-700 disabled:opacity-50 transition-colors"
                      title="Lihat PDF"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onEditInvoice && onEditInvoice(invoice)}
                      disabled={loading}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg hover:text-purple-700 disabled:opacity-50 transition-colors"
                      title="Edit invoice"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(invoice.id)}
                      disabled={loading || isDeleting}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg hover:text-red-700 disabled:opacity-50 transition-colors"
                      title="Hapus invoice"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Hapus Invoice"
        message="Apakah Anda yakin ingin menghapus invoice ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        isDangerous={true}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
      />

      {/* PDF Modal */}
      {selectedInvoice && (
        <InvoicePDFModal
          invoice={selectedInvoice}
          isOpen={showPDFModal}
          onClose={() => {
            setShowPDFModal(false)
            setSelectedInvoice(null)
          }}
          onDownload={handleDownloadPDF}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default InvoiceTable
