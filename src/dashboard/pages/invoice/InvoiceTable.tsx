import React, { useState } from 'react'
import { Invoice } from '../../../services/api'
import { ConfirmDialog } from '../../../components/ConfirmDialog'
import { Toast, ToastType } from '../../../components/Toast'
import { InvoicePDFModal } from '../../../components/InvoicePDFModal'
import html2pdf from 'html2pdf.js'

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

  const handleDownloadPDF = () => {
    if (!selectedInvoice) return

    try {
      setToast({ message: 'Membuat PDF...', type: 'info' })

      const element = document.querySelector('.invoice-pdf-content') as HTMLElement
      if (!element) {
        setToast({ message: 'Gagal menemukan konten invoice', type: 'error' })
        return
      }

      const opt: any = {
        margin: 10,
        filename: `${selectedInvoice.invoiceNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
      }

      html2pdf().set(opt).from(element).save()
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
                  <p className="font-bold text-slate-900">Rp {Math.round(invoice.amount).toLocaleString('id-ID')}</p>
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
                  <div className="flex gap-2 flex-wrap justify-center">
                    <button
                      onClick={() => handlePDFPreview(invoice)}
                      disabled={loading}
                      className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-200 disabled:opacity-50 transition-colors"
                      title="Generate PDF"
                    >
                      PDF
                    </button>
                    <button
                      onClick={() => onEditInvoice && onEditInvoice(invoice)}
                      disabled={loading}
                      className="px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg hover:bg-purple-200 disabled:opacity-50 transition-colors"
                      title="Edit invoice"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(invoice.id)}
                      disabled={loading || isDeleting}
                      className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200 disabled:opacity-50 transition-colors"
                      title="Hapus invoice"
                    >
                      {isDeleting && deleteInvoiceId === invoice.id ? 'Menghapus...' : 'Delete'}
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
        <>
          <div className="hidden invoice-pdf-content">
            <div className="max-w-2xl mx-auto bg-white border border-slate-300 rounded-lg p-8 text-slate-900">
              {/* Header Logo & Title */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-blue-600">NEXCUBE</h1>
                  <p className="text-xs text-slate-600 mt-1">nexcubedigital@gmail.com</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-700">KWITANSI</p>
                  <p className="text-xs text-slate-600 mt-1">No: {selectedInvoice.invoiceNumber}</p>
                </div>
              </div>

              <hr className="my-6 border-slate-300" />

              {/* Invoice To */}
              <div className="mb-8">
                <p className="text-xs font-bold text-slate-700 mb-2">Ditujukan kepada:</p>
                <p className="font-bold text-slate-900">{selectedInvoice.clientName}</p>
                <p className="text-sm text-slate-600">{selectedInvoice.clientEmail}</p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                <div>
                  <p className="font-bold text-slate-700">Tanggal Invoice</p>
                  <p className="text-slate-600">{new Date(selectedInvoice.issueDate).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-700">Jatuh Tempo</p>
                  <p className="text-slate-600">{new Date(selectedInvoice.dueDate).toLocaleDateString('id-ID')}</p>
                </div>
              </div>

              {/* Details Table */}
              <div className="mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="px-4 py-3 text-left font-bold">No</th>
                      <th className="px-4 py-3 text-left font-bold">Deskripsi</th>
                      <th className="px-4 py-3 text-center font-bold">Jumlah</th>
                      <th className="px-4 py-3 text-right font-bold">Harga</th>
                      <th className="px-4 py-3 text-right font-bold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      let breakdown: any[] = []
                      if (selectedInvoice.priceBreakdown) {
                        try {
                          const parsed = JSON.parse(selectedInvoice.priceBreakdown)
                          if (Array.isArray(parsed)) {
                            breakdown = parsed
                          }
                        } catch (err) {
                          console.warn('Failed to parse price breakdown:', err)
                        }
                      }
                      if (breakdown.length === 0 && selectedInvoice.amount) {
                        breakdown = [
                          {
                            id: 'fallback',
                            description: selectedInvoice.description || selectedInvoice.service || 'Item',
                            price: selectedInvoice.amount,
                          },
                        ]
                      }
                      return Array.isArray(breakdown) && breakdown.length > 0 ? (
                        breakdown.map((item, index) => (
                          <tr key={item.id || index} className="border-b border-slate-200 hover:bg-slate-50">
                            <td className="px-4 py-3 text-slate-900">{index + 1}</td>
                            <td className="px-4 py-3 text-slate-900">{item.description || '-'}</td>
                            <td className="px-4 py-3 text-center text-slate-600">1</td>
                            <td className="px-4 py-3 text-right text-slate-600">
                              Rp {Math.round(item.price || 0).toLocaleString('id-ID')}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-slate-900">
                              Rp {Math.round(item.price || 0).toLocaleString('id-ID')}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="border-b border-slate-200">
                          <td colSpan={5} className="px-4 py-3 text-center text-slate-600">
                            No price breakdown available
                          </td>
                        </tr>
                      )
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-64">
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-slate-700">Sub Total:</span>
                    <span className="font-semibold">Rp {Math.round(selectedInvoice.amount).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between mb-4 text-sm pb-2 border-b border-slate-300">
                    <span className="text-slate-700">PPN 10%:</span>
                    <span className="font-semibold">Rp 0</span>
                  </div>
                  <div className="flex justify-between bg-blue-100 px-4 py-2 rounded font-bold text-lg">
                    <span>TOTAL KESELURUHAN:</span>
                    <span>Rp {Math.round(selectedInvoice.amount).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-8 pb-8 border-b border-slate-300">
                <p className="font-bold text-slate-700 mb-3">METODE PEMBAYARAN:</p>
                <div className="text-sm text-slate-600">
                  <p className="mb-1"><strong>Bank Name:</strong> BCA - a.n Aslam Mushtafa Karim</p>
                  <p><strong>Account Number:</strong> 8320476420</p>
                </div>
              </div>

              {/* Footer */}
              <div className="text-xs text-slate-600">
                <p className="mb-4">
                  <strong>Syarat dan Ketentuan:</strong><br />
                  Silakan lakukan pembayaran dalam waktu 30 hari setelah menerima invoice ini. Akan dikenakan bunga 10% per bulan untuk keterlambatan pembayaran.
                </p>
                <div className="grid grid-cols-2 gap-8 mt-8">
                  <div>
                    <p className="mb-8">Terimakasih telah berbisnis dengan kami!</p>
                    <div>
                      <p className="font-bold text-slate-900">Bela Amelia Nuralfiani</p>
                      <p className="font-bold text-slate-900">Administrator</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">
                      🏢 Jln. Bukit Jarian dm Vl.30, kel.<br />
                      Hegarmanah, Kec. Cidolog, Kota<br />
                      Bandung, Jawa Barat
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <InvoicePDFModal
            invoice={selectedInvoice}
            isOpen={showPDFModal}
            onClose={() => {
              setShowPDFModal(false)
              setSelectedInvoice(null)
            }}
            onDownload={handleDownloadPDF}
          />
        </>
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
