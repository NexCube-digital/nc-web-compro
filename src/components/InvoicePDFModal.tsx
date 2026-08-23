import React from 'react'
import { Invoice } from '../services/api'
import { KwitansiPreview } from './KwitansiPreview'

interface InvoicePDFModalProps {
  invoice: Invoice
  isOpen: boolean
  onClose: () => void
  onDownload?: () => void
}

export const InvoicePDFModal: React.FC<InvoicePDFModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onDownload
}) => {
  if (!isOpen) return null

  const handlePrintPDF = () => {
    if (onDownload) {
      onDownload()
    } else {
      window.print()
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-100 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto border border-slate-200">
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10 print:hidden">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Preview Invoice & Kwitansi</h2>
              <p className="text-xs text-slate-500">Kwitansi No: {invoice.invoiceNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition-colors text-xl font-bold"
            title="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-100">
          <KwitansiPreview invoice={invoice} />
        </div>

        {/* Modal Actions */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex gap-3 justify-end items-center z-10 print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={handlePrintPDF}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.01] transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Cetak / Download PDF
          </button>
        </div>

      </div>
    </div>
  )
}

export default InvoicePDFModal
