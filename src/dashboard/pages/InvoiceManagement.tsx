import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import apiClient, { Invoice, Contact } from '../../services/api'
import useBackgroundRefresh from '../../hooks/useBackgroundRefresh'
import useSSE from '../../hooks/useSSE'
import { InvoiceTable } from './invoice/InvoiceTable'
import { FormInvoice } from './invoice/FormInvoice'
import { Toast } from '../../components/Toast'
import NewDataBanner from '../../components/NewDataBanner'

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

  // SSE temporarily disabled - backend doesn't support it yet
  // useSSE('/stream', {
  //   'invoice:created': async (d: any) => {
  //     setSseUpdating(true)
  //     try { await loadInvoices() } catch {} finally { setTimeout(() => setSseUpdating(false), 700) }
  //   },
  //   'invoice:updated': async (d: any) => {
  //     setSseUpdating(true)
  //     try { await loadInvoices() } catch {} finally { setTimeout(() => setSseUpdating(false), 700) }
  //   },
  //   'invoice:deleted': async (d: any) => {
  //     setSseUpdating(true)
  //     try { await loadInvoices() } catch {} finally { setTimeout(() => setSseUpdating(false), 700) }
  //   },
  // })

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
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError('')

      // Prepare data with priceBreakdown as JSON string or null
      let priceBreakdownValue = null;
      if (formData.priceBreakdown) {
        if (typeof formData.priceBreakdown === 'string' && formData.priceBreakdown.trim() !== '') {
          try {
            // Validate it's valid JSON
            const parsed = JSON.parse(formData.priceBreakdown);
            if (Array.isArray(parsed) && parsed.length > 0) {
              priceBreakdownValue = formData.priceBreakdown;
            }
          } catch (e) {
            // Invalid JSON, set to null
            priceBreakdownValue = null;
          }
        } else if (typeof formData.priceBreakdown === 'object' && Array.isArray(formData.priceBreakdown) && (formData.priceBreakdown as any[]).length > 0) {
          priceBreakdownValue = JSON.stringify(formData.priceBreakdown);
        }
      }

      const submitData = {
        ...formData,
        priceBreakdown: priceBreakdownValue
      }

      if (editingId) {
        // Update existing invoice
        const response = await apiClient.updateInvoice(editingId, submitData)
        if (response.success) {
          setToast({ message: 'Invoice berhasil diperbarui', type: 'success' })
          await loadInvoices()
          setTimeout(() => {
            setFormData({
              invoiceNumber: '',
              clientName: '',
              clientEmail: '',
              issueDate: new Date().toISOString().split('T')[0],
              dueDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              amount: 0,
              status: 'draft',
              service: 'website',
              priceBreakdown: '',
              notes: '',
              description: ''
            })
            setEditingId(null)
            navigate('/dashboard/invoices')
          }, 1500)
        }
      } else {
        // Create new invoice
        const response = await apiClient.createInvoice(submitData)
        if (response.success) {
          setToast({ message: 'Invoice berhasil dibuat', type: 'success' })
          await loadInvoices()
          setTimeout(() => {
            setFormData({
              invoiceNumber: '',
              clientName: '',
              clientEmail: '',
              issueDate: new Date().toISOString().split('T')[0],
              dueDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              amount: 0,
              status: 'draft',
              service: 'website',
              priceBreakdown: '',
              notes: '',
              description: ''
            })
            setEditingId(null)
            navigate('/dashboard/invoices')
          }, 1500)
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
    setFormData({
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      amount: invoice.amount,
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
    const totalAmount = invoiceArray.reduce((sum, inv) => sum + inv.amount, 0)
    const paidAmount = invoiceArray.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0)
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
                <p className="text-slate-600 text-sm mb-2">Total Nominal</p>
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
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default InvoiceManagement
