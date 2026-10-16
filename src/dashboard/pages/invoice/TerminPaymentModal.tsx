import React, { useState } from 'react'
import { Invoice, ITerminPayment, apiClient } from '../../../services/api'
import { CheckCircle2, Clock, Calendar, CreditCard, AlertCircle, X, Check, Loader2 } from 'lucide-react'

interface TerminPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  invoice: Invoice | null
  onPaymentSuccess?: (updatedInvoice: Invoice) => void
}

export const TerminPaymentModal: React.FC<TerminPaymentModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onPaymentSuccess
}) => {
  const [activePayingTermId, setActivePayingTermId] = useState<string | null>(null)
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [paymentMethod, setPaymentMethod] = useState<string>('Bank Transfer')
  const [paymentNotes, setPaymentNotes] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  if (!isOpen || !invoice) return null

  // Parse termin
  let terms: ITerminPayment[] = []
  if (invoice.paymentTerms) {
    try {
      let parsed = typeof invoice.paymentTerms === 'string' ? JSON.parse(invoice.paymentTerms) : invoice.paymentTerms
      while (typeof parsed === 'string') {
        try { parsed = JSON.parse(parsed) } catch { break }
      }
      if (Array.isArray(parsed)) {
        terms = parsed
      }
    } catch {}
  }

  const totalAmount = Number(invoice.amount) || 0
  const paidAmount = Number(invoice.paidAmount) || 0
  const remainingAmount = Math.max(0, totalAmount - paidAmount)
  const percentPaid = totalAmount > 0 ? Math.min(100, Math.round((paidAmount / totalAmount) * 100)) : 0
  const isFullyPaid = paidAmount >= totalAmount && totalAmount > 0

  const handleStartPay = (term: ITerminPayment) => {
    setActivePayingTermId(term.id)
    setPaymentDate(new Date().toISOString().split('T')[0])
    setPaymentMethod('Bank Transfer')
    setPaymentNotes(`Pembayaran ${term.name}`)
    setErrorMsg(null)
    setSuccessMsg(null)
  }

  const handleCancelPay = () => {
    setActivePayingTermId(null)
    setErrorMsg(null)
  }

  const handleConfirmPay = async (term: ITerminPayment) => {
    try {
      setLoading(true)
      setErrorMsg(null)

      const response = await apiClient.payInvoiceTerm(invoice.id, {
        termId: term.id,
        paymentMethod,
        paidAt: paymentDate,
        notes: paymentNotes
      })

      if (response.success && response.data) {
        const isPaidNow = response.data.status === 'paid' || Boolean(response.isFullyPaid)
        setSuccessMsg(
          isPaidNow
            ? `🎉 ${term.name} berhasil dibayar! Invoice kini LUNAS (Terbayar) dan masuk ke Keuangan NexCube.`
            : `✅ ${term.name} berhasil dibayar dan dicatat ke Keuangan!`
        )
        setActivePayingTermId(null)
        onPaymentSuccess?.(response.data)
      } else {
        setErrorMsg(response.message || 'Gagal memproses pembayaran termin')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses pembayaran termin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold bg-white/20 px-2.5 py-0.5 rounded-full">
                Skema Termin / DP
              </span>
              <span className="text-xs font-mono bg-black/20 px-2 py-0.5 rounded">
                #{invoice.invoiceNumber}
              </span>
            </div>
            <h3 className="text-xl font-bold mt-1 text-white">Kelola Pembayaran Termin</h3>
            <p className="text-xs text-blue-100 mt-0.5">
              Klien: <strong className="text-white">{invoice.clientName}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="grid grid-cols-3 gap-3 text-center divide-x divide-slate-200">
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Tagihan</p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </p>
              </div>
              <div>
                <p className="text-xs text-emerald-600 font-medium">Total Terbayar</p>
                <p className="text-lg font-bold text-emerald-600 mt-0.5">
                  Rp {paidAmount.toLocaleString('id-ID')}
                </p>
              </div>
              <div>
                <p className="text-xs text-amber-600 font-medium">Sisa Tagihan</p>
                <p className="text-lg font-bold text-amber-600 mt-0.5">
                  Rp {remainingAmount.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between items-center text-xs font-medium text-slate-600 mb-1">
                <span>Progress Pelunasan</span>
                <span className="font-bold text-blue-600">{percentPaid}% {isFullyPaid ? '(LUNAS)' : ''}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    isFullyPaid ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                  }`}
                  style={{ width: `${percentPaid}%` }}
                />
              </div>
            </div>
          </div>

          {/* Feedback messages */}
          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="font-medium leading-relaxed">{successMsg}</p>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <p className="font-medium leading-relaxed">{errorMsg}</p>
            </div>
          )}

          {/* Termin List */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span>Daftar Pembayaran Termin:</span>
              <span className="text-xs font-normal text-slate-500">
                (Otomatis menjadi Terbayar ketika seluruh termin lunas)
              </span>
            </h4>

            {terms.length === 0 ? (
              <div className="text-center py-8 px-4 border border-dashed border-slate-300 rounded-xl text-slate-500">
                <p className="text-sm font-medium">Invoice ini belum memiliki rincian termin.</p>
                <p className="text-xs text-slate-400 mt-1">
                  Anda dapat menambahkan termin DP & Pelunasan melalui menu Edit Invoice.
                </p>
              </div>
            ) : (
              terms.map((term, idx) => {
                const isPaid = term.status === 'paid'
                const isPayingThis = activePayingTermId === term.id

                return (
                  <div
                    key={term.id || idx}
                    className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                      isPaid
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : isPayingThis
                        ? 'border-blue-400 bg-blue-50/30 ring-2 ring-blue-100'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isPaid ? <Check className="w-5 h-5" /> : idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-slate-900 text-sm">{term.name}</h5>
                            <span
                              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                                isPaid
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {isPaid ? '✅ Terbayar' : '⏳ Belum Bayar'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            {term.dueDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                Tempo: {new Date(term.dueDate).toLocaleDateString('id-ID')}
                              </span>
                            )}
                            {isPaid && term.paidAt && (
                              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                                <Clock className="w-3.5 h-3.5" />
                                Dibayar: {new Date(term.paidAt).toLocaleDateString('id-ID')}
                              </span>
                            )}
                            {isPaid && term.paymentMethod && (
                              <span className="flex items-center gap-1 text-slate-600">
                                <CreditCard className="w-3.5 h-3.5" />
                                {term.paymentMethod}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-4">
                        <div>
                          <p className="text-xs text-slate-400">Nominal</p>
                          <p className="text-base font-bold text-slate-900">
                            Rp {Number(term.amount).toLocaleString('id-ID')}
                          </p>
                        </div>

                        {!isPaid && !isPayingThis && (
                          <button
                            type="button"
                            onClick={() => handleStartPay(term)}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap"
                          >
                            Catat Bayar
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Inline Form to Record Payment */}
                    {isPayingThis && (
                      <div className="p-4 bg-white border-t border-blue-200 space-y-3 animate-in fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Tanggal Pembayaran
                            </label>
                            <input
                              type="date"
                              value={paymentDate}
                              onChange={(e) => setPaymentDate(e.target.value)}
                              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Metode Pembayaran
                            </label>
                            <select
                              value={paymentMethod}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                              <option value="Bank Transfer">Bank Transfer (BCA / Mandiri / BRI / BNI)</option>
                              <option value="Cash / Tunai">Cash / Tunai</option>
                              <option value="QRIS">QRIS</option>
                              <option value="Midtrans Payment Link">Midtrans Payment Link</option>
                              <option value="Lainnya">Lainnya</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Catatan Pembayaran (Opsional)
                          </label>
                          <input
                            type="text"
                            value={paymentNotes}
                            onChange={(e) => setPaymentNotes(e.target.value)}
                            placeholder="Contoh: DP 50% via transfer BCA Bu Sheila"
                            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={handleCancelPay}
                            disabled={loading}
                            className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={() => handleConfirmPay(term)}
                            disabled={loading}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Memproses...
                              </>
                            ) : (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                Konfirmasi Pembayaran Rp {Number(term.amount).toLocaleString('id-ID')}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <p className="text-xs text-slate-500">
            {isFullyPaid ? (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Seluruh pembayaran telah lunas.
              </span>
            ) : (
              <span>Sisa yang harus dibayar: <strong>Rp {remainingAmount.toLocaleString('id-ID')}</strong></span>
            )}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}

export default TerminPaymentModal
