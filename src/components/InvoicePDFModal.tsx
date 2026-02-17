import React, { useState } from 'react'
import { Invoice } from '../services/api'

interface InvoicePDFModalProps {
  invoice: Invoice
  isOpen: boolean
  onClose: () => void
  onDownload: () => void
}

export const InvoicePDFModal: React.FC<InvoicePDFModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onDownload
}) => {
  if (!isOpen) return null

  // Parse price breakdown
  let priceBreakdown: any[] = []
  if (invoice.priceBreakdown) {
    try {
      const parsed = JSON.parse(invoice.priceBreakdown)
      priceBreakdown = Array.isArray(parsed) ? parsed : []
    } catch (err) {
      console.warn('Failed to parse price breakdown:', err)
    }
  }

  if (priceBreakdown.length === 0 && invoice.amount) {
    priceBreakdown = [
      {
        id: 'fallback',
        description: invoice.description || invoice.service || 'Item',
        price: invoice.amount,
      },
    ]
  }

  const total = Array.isArray(priceBreakdown) && priceBreakdown.length > 0
    ? priceBreakdown.reduce((sum, item) => sum + (item.price || 0), 0)
    : invoice.amount

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">Invoice Preview</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* PDF Content */}
        <div className="p-8 bg-white">
          <div className="max-w-2xl mx-auto bg-white border border-slate-300 rounded-lg p-8 text-slate-900">
            {/* Header Logo & Title */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-blue-600">NEXCUBE</h1>
                <p className="text-xs text-slate-600 mt-1">nexcubedigital@gmail.com</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-700">KWITANSI</p>
                <p className="text-xs text-slate-600 mt-1">No: {invoice.invoiceNumber}</p>
              </div>
            </div>

            <hr className="my-6 border-slate-300" />

            {/* Invoice To */}
            <div className="mb-8">
              <p className="text-xs font-bold text-slate-700 mb-2">Ditujukan kepada:</p>
              <p className="font-bold text-slate-900">{invoice.clientName}</p>
              <p className="text-sm text-slate-600">{invoice.clientEmail}</p>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
              <div>
                <p className="font-bold text-slate-700">Tanggal Invoice</p>
                <p className="text-slate-600">{new Date(invoice.issueDate).toLocaleDateString('id-ID')}</p>
              </div>
              <div>
                <p className="font-bold text-slate-700">Jatuh Tempo</p>
                <p className="text-slate-600">{new Date(invoice.dueDate).toLocaleDateString('id-ID')}</p>
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
                  {priceBreakdown.length > 0 ? (
                    priceBreakdown.map((item, index) => (
                      <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-900">{index + 1}</td>
                        <td className="px-4 py-3 text-slate-900">{item.description}</td>
                        <td className="px-4 py-3 text-center text-slate-600">1</td>
                        <td className="px-4 py-3 text-right text-slate-600">
                          Rp {Math.round(item.price).toLocaleString('id-ID')}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-900">
                          Rp {Math.round(item.price).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-b border-slate-200">
                      <td colSpan={5} className="px-4 py-3 text-center text-slate-600">
                        No price breakdown available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-slate-700">Sub Total:</span>
                  <span className="font-semibold">Rp {Math.round(total).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between mb-4 text-sm pb-2 border-b border-slate-300">
                  <span className="text-slate-700">PPN 10%:</span>
                  <span className="font-semibold">Rp 0</span>
                </div>
                <div className="flex justify-between bg-blue-100 px-4 py-2 rounded font-bold text-lg">
                  <span>TOTAL KESELURUHAN:</span>
                  <span>Rp {Math.round(total).toLocaleString('id-ID')}</span>
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

        {/* Footer Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-8 py-4 flex gap-4 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={onDownload}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            📥 Download PDF
          </button>
        </div>
      </div>
    </div>
  )
}

export default InvoicePDFModal
