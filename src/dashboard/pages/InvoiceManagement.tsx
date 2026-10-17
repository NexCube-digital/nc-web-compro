import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import apiClient, { Invoice, Contact } from '../../services/api'
import useBackgroundRefresh from '../../hooks/useBackgroundRefresh'
import { InvoiceTable } from './invoice/InvoiceTable'
import { FormInvoice } from './invoice/FormInvoice'
import { Toast } from '../../components/Toast'
import NewDataBanner from '../../components/NewDataBanner'

const normalizeAmount = (value: string | number | null | undefined): number => {
  if (value === null || value === undefined) return 0
  if (typeof value === 'number') return Number.isFinite(value) ? Math.round(value) : 0
  const text = String(value).trim()
  if (!text) return 0

  const sanitized = text.replace(/[^0-9.,-]/g, '')
  if (!sanitized) return 0

  if (sanitized.includes(',')) {
    const clean = sanitized.replace(/\./g, '').replace(',', '.')
    const num = Number(clean)
    return Number.isFinite(num) ? Math.round(num) : 0
  }

  // Format MySQL DECIMAL: misal 400000.00
  if (/^-?\d+\.\d{1,2}$/.test(sanitized)) {
    const num = Number(sanitized)
    return Number.isFinite(num) ? Math.round(num) : 0
  }

  // Format ribuan Indonesia: 400.000 atau 1.500.000
  const clean = sanitized.replace(/\./g, '')
  const num = Number(clean)
  return Number.isFinite(num) ? Math.round(num) : 0
}

const normalizePriceBreakdown = (value: any): string | null => {
  if (!value) return null
  try {
    let parsed: any = typeof value === 'string' ? JSON.parse(value) : value
    while (typeof parsed === 'string') {
      try { parsed = JSON.parse(parsed) } catch { break }
    }
    if (!Array.isArray(parsed) || parsed.length === 0) return null
    const valid = parsed
      .filter((item: any) => item && (item.description || item.name || Number(item.price) > 0))
      .map((item: any) => {
        const entry = item as Record<string, unknown>
        return {
          id: String(entry.id || Math.random().toString(36).substring(2, 9)),
          description: String(entry.description || entry.name || 'Layanan').trim(),
          price: normalizeAmount(String(entry.price ?? 0))
        }
      })
    return valid.length > 0 ? JSON.stringify(valid) : null
  } catch {
    return null
  }
}

export const InvoiceManagement: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [clients, setClients] = useState<Contact[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null)

  // Check if form should be shown based on URL
  const showForm = location.pathname.includes('/forminvoice')

  const [formData, setFormData] = useState<Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>>({
    invoiceNumber: '',
    clientName: '',
    clientEmail: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    amount: 0,
    paidAmount: 0,
    paymentTerms: '',
    status: 'draft',
    service: 'website',
    priceBreakdown: '',
    notes: '',
    description: ''
  })

  // Load invoices from backend
  const loadInvoices = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await apiClient.getInvoices()
      if (response.success && response.data) {
        // Ensure data is an array
        const invoiceData = Array.isArray(response.data) ? response.data : []
        setInvoices(invoiceData)
      } else {
        setInvoices([])
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load invoices')
      setInvoices([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Load clients from backend
  const loadClients = useCallback(async () => {
    try {
      const response = await apiClient.getContacts()
      if (response.success && response.data) {
        // Ensure data is an array
        const clientData = Array.isArray(response.data) ? response.data : []
        setClients(clientData)
      } else {
        setClients([])
      }
    } catch (err: any) {
      console.error('Failed to load clients:', err.message)
      setClients([])
    }
  }, [])

  useEffect(() => {
    loadInvoices()
    loadClients()
  }, [loadInvoices, loadClients])

  // Background refresh: poll for new invoices silently and notify user
  const { hasNew: hasNewInvoices, newData: newInvoices, clearNew: clearNewInvoices } = useBackgroundRefresh<Invoice[]>(
    'invoices',
    async () => {
      try {
        const r = await apiClient.getInvoices()
        return r.success && Array.isArray(r.data) ? r.data : null
      } catch { return null }
    },
    { interval: 60000 } // 60s polling interval (reduced from 10s)
  )
  const [sseUpdating, setSseUpdating] = useState(false)

  const filteredInvoices = useMemo(() => {
    if (!Array.isArray(invoices)) return [] as Invoice[]
    const q = searchTerm.toLowerCase()
    return invoices.filter(invoice =>
      invoice.invoiceNumber.toLowerCase().includes(q) ||
      (invoice.clientName?.toLowerCase().includes(q) || false) ||
      (invoice.clientEmail?.toLowerCase().includes(q) || false)
    )
  }, [invoices, searchTerm])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'amount') {
      setFormData(prev => ({ ...prev, [name]: normalizeAmount(value) }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }, [])

  const handlePaymentTermsChange = useCallback((terms: any[] | null) => {
    setFormData(prev => ({
      ...prev,
      paymentTerms: terms && terms.length > 0 ? JSON.stringify(terms) : ''
    }))
  }, [])

  const handleSubmit = async (
    e: React.FormEvent,
    customBreakdown?: any[],
    customPaymentTerms?: any[] | null
  ) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError('')

      // Gunakan breakdown langsung dari submit handler form jika tersedia, fallback ke formData
      const breakdownToUse = (customBreakdown && Array.isArray(customBreakdown) && customBreakdown.length > 0)
        ? JSON.stringify(customBreakdown)
        : formData.priceBreakdown;

      const priceBreakdownValue = normalizePriceBreakdown(breakdownToUse)

      let paymentTermsValue: string | null = null
      let paidAmountValue = 0

      // Jika customPaymentTerms secara eksplisit dikirim (array atau null jika termin dimatikan)
      if (customPaymentTerms !== undefined) {
        if (customPaymentTerms && Array.isArray(customPaymentTerms) && customPaymentTerms.length > 0) {
          paymentTermsValue = JSON.stringify(customPaymentTerms)
          paidAmountValue = customPaymentTerms.reduce((sum: number, t: any) => {
            return t.status === 'paid' ? sum + (Number(t.amount) || 0) : sum
          }, 0)
        } else {
          paymentTermsValue = null
          paidAmountValue = 0
        }
      } else if (formData.paymentTerms) {
        paymentTermsValue = formData.paymentTerms
        try {
          let parsed = typeof formData.paymentTerms === 'string' ? JSON.parse(formData.paymentTerms) : formData.paymentTerms
          while (typeof parsed === 'string') { parsed = JSON.parse(parsed) }
          if (Array.isArray(parsed) && parsed.length > 0) {
            paidAmountValue = parsed.reduce((sum: number, t: any) => {
              return t.status === 'paid' ? sum + (Number(t.amount) || 0) : sum
            }, 0)
          } else {
            paymentTermsValue = null
          }
        } catch {
          paymentTermsValue = null
        }
      }

      const totalAmount = normalizeAmount(formData.amount)
      let finalStatus = formData.status
      if (paymentTermsValue) {
        if (paidAmountValue >= totalAmount && totalAmount > 0) {
          finalStatus = 'paid'
        } else if (paidAmountValue > 0) {
          finalStatus = 'partial'
        }
      } else if (finalStatus === 'paid') {
        paidAmountValue = totalAmount
      }

      const submitData = {
        ...formData,
        amount: totalAmount,
        paidAmount: paidAmountValue,
        paymentTerms: paymentTermsValue,
        status: finalStatus,
        priceBreakdown: priceBreakdownValue
      }

      const resetFormState = () => {
        setFormData({
          invoiceNumber: '',
          clientName: '',
          clientEmail: '',
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          amount: 0,
          paidAmount: 0,
          paymentTerms: '',
          status: 'draft',
          service: 'website',
          priceBreakdown: '',
          notes: '',
          description: ''
        })
        setEditingId(null)
      }

      if (editingId) {
        // Update existing invoice
        const response = await apiClient.updateInvoice(editingId, submitData)
        if (response.success) {
          setToast({ message: 'Invoice berhasil diperbarui', type: 'success' })
          await loadInvoices()
          resetFormState()
          navigate('/dashboard/invoices')
        }
      } else {
        // Create new invoice
        const response = await apiClient.createInvoice(submitData)
        if (response.success) {
          setToast({ message: 'Invoice berhasil dibuat', type: 'success' })
          await loadInvoices()
          resetFormState()
          navigate('/dashboard/invoices')
        }
      }
    } catch (err: any) {
      setToast({ message: err.message || 'Gagal menyimpan invoice', type: 'error' })
      setError(err.message || 'Failed to save invoice')
    } finally {
      setLoading(false)
    }
  }

  const handleEditInvoice = (invoice: Invoice) => {
    let normalizedTerms = ''
    if (invoice.paymentTerms) {
      if (typeof invoice.paymentTerms === 'string') {
        normalizedTerms = invoice.paymentTerms
      } else {
        try {
          normalizedTerms = JSON.stringify(invoice.paymentTerms)
        } catch {
          normalizedTerms = ''
        }
      }
    }

    setFormData({
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      amount: invoice.amount,
      paidAmount: invoice.paidAmount || 0,
      paymentTerms: normalizedTerms,
      status: invoice.status,
      service: invoice.service,
      priceBreakdown: invoice.priceBreakdown || '',
      notes: invoice.notes || '',
      description: invoice.description || ''
    })
    setEditingId(invoice.id.toString())
    navigate('/dashboard/invoices/forminvoice')
  }

  const handleDeleteInvoice = async (invoiceId: number) => {
    try {
      setLoading(true)
      setError('')
      await apiClient.deleteInvoice(invoiceId.toString())
      await loadInvoices()
      setLoading(false)
    } catch (err: any) {
      setError(err.message || 'Failed to delete invoice')
      setLoading(false)
      throw err
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({
      invoiceNumber: '',
      clientName: '',
      clientEmail: '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: 0,
      paidAmount: 0,
      paymentTerms: '',
      status: 'draft',
      service: 'website',
      priceBreakdown: '',
      notes: '',
      description: ''
    })
    navigate('/dashboard/invoices')
  }

  const handlePriceBreakdownChange = (priceBreakdown: any[]) => {
    setFormData(prev => ({
      ...prev,
      priceBreakdown: JSON.stringify(priceBreakdown)
    }))
  }

  // Calculate stats
  const invoiceStats = useMemo(() => {
    const invoiceArray = Array.isArray(invoices) ? invoices : []
    const totalInvoices = invoiceArray.length
    
    const paidInvoices = invoiceArray.filter(inv => inv.status === 'paid').length

    // Hitung total nominal terbayar (termasuk cicilan/termin yang sudah dibayar)
    const paidAmount = invoiceArray.reduce((sum, inv) => {
      if (inv.status === 'paid') return sum + (parseFloat(String(inv.amount)) || 0)
      return sum + (parseFloat(String(inv.paidAmount)) || 0)
    }, 0)

    // Hitung sisa tagihan yang belum terbayar
    const totalAmount = invoiceArray.reduce((sum, inv) => {
      if (inv.status === 'paid') return sum
      const invTotal = parseFloat(String(inv.amount)) || 0
      const invPaid = parseFloat(String(inv.paidAmount)) || 0
      return sum + Math.max(0, invTotal - invPaid)
    }, 0)

    return { totalInvoices, paidInvoices, totalAmount, paidAmount }
  }, [invoices])

  return (
    <div>
      <Helmet>
        <title>Manajemen Invoice - NexCube Dashboard</title>
      </Helmet>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Page Container with Fade-In Animation */}
      <div className={`relative animate-in fade-in duration-500 ${sseUpdating ? 'ring-2 ring-blue-300/30' : ''}`}>
        {loading && <div className="absolute inset-0 z-40"><div className="absolute inset-0 bg-white/60 backdrop-blur-sm" /><div className="relative z-50 flex items-center justify-center h-full"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" /></div></div>}
        {sseUpdating && (
          <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-white/90 px-3 py-1 rounded shadow">
            <svg className="animate-spin h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
            <span className="text-sm text-slate-700">Updating...</span>
          </div>
        )}
        {(hasNewInvoices && newInvoices) || (typeof (window as any)._invoiceSSE !== 'undefined' && (window as any)._invoiceSSE) ? (
          <NewDataBanner
            message="Invoice terbaru tersedia"
            onRefresh={async () => {
              // apply new data and clear flag with a smooth update
              setLoading(true)
              try {
                if (hasNewInvoices && newInvoices) {
                  setInvoices(newInvoices)
                  clearNewInvoices()
                } else if ((window as any)._invoiceSSE) {
                  await loadInvoices()
                  ;(window as any)._invoiceSSE = false
                }
              } finally { setLoading(false) }
            }}
            onDismiss={() => clearNewInvoices()}
          />
        ) : null}
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Manajemen Invoice</h1>
            <p className="text-slate-600 mt-2">Kelola invoice dan pembayaran klien</p>
          </div>
          {!showForm && (
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Cari invoice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
              <button
                onClick={() => {
                  handleCancel()
                  setTimeout(() => navigate('/dashboard/invoices/forminvoice'), 150)
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105 whitespace-nowrap"
              >
                + Buat Invoice
              </button>
            </div>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <FormInvoice
              formData={formData}
              editingId={editingId}
              loading={loading}
              clients={clients}
              invoices={invoices}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              onPriceBreakdownChange={handlePriceBreakdownChange}
              onPaymentTermsChange={handlePaymentTermsChange}
            />
          </div>
        )}

        {/* Table & Stats - Only show when not in form view */}
        {!showForm && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <p className="text-slate-600 text-sm mb-2">Total Invoice</p>
                <p className="text-3xl font-bold text-slate-900">{invoiceStats.totalInvoices}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <p className="text-slate-600 text-sm mb-2">Invoice Terbayar</p>
                <p className="text-3xl font-bold text-green-600">{invoiceStats.paidInvoices}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <p className="text-slate-600 text-sm mb-2">Total Belum Terbayar</p>
                <p className="text-xl font-bold text-slate-900">Rp {Math.round(invoiceStats.totalAmount).toLocaleString('id-ID')}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <p className="text-slate-600 text-sm mb-2">Sudah Terbayar</p>
                <p className="text-xl font-bold text-green-600">Rp {Math.round(invoiceStats.paidAmount).toLocaleString('id-ID')}</p>
              </div>
            </div>

            {/* Invoice Table Section Header */}
            <div className="mb-4 mt-8">
              <h2 className="text-lg font-bold text-slate-900">Daftar Invoice</h2>
              <p className="text-sm text-slate-600">Kelola semua invoice dan pembayaran</p>
            </div>

            {/* Invoice Table */}
            <InvoiceTable 
              invoices={filteredInvoices}
              loading={loading}
              onEditInvoice={handleEditInvoice}
              onDeleteInvoice={handleDeleteInvoice}
              onInvoiceUpdated={loadInvoices}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default InvoiceManagement
