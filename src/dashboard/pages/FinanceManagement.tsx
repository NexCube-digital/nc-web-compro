import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import apiClient, { Finance, Invoice } from '../../services/api'
import useBackgroundRefresh from '../../hooks/useBackgroundRefresh'
import Toast from '../../components/Toast'
import { FinanceTable } from './finance/FinanceTable'
import { FormFinance } from './finance/FormFinance'
import { CsvImportModal, downloadCsvTemplate } from './finance/CsvImportModal'
import NewDataBanner from '../../components/NewDataBanner'

interface FinanceManagementProps {
  division?: 'nexcube' | 'printing'
}

export const FinanceManagement: React.FC<FinanceManagementProps> = ({ division }) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Tentukan divisi aktif dari prop atau URL
  const activeDivision: 'nexcube' | 'printing' = division || (location.pathname.includes('/printing') ? 'printing' : 'nexcube')
  const isPrinting = activeDivision === 'printing'

  const [finances, setFinances] = useState<Finance[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCsvModal, setShowCsvModal] = useState(false)

  // Check if form should be shown based on URL
  const showForm = isPrinting
    ? (location.pathname.includes('/printing/form') || location.pathname.endsWith('/form'))
    : location.pathname.includes('/formfinance')

  const [formData, setFormData] = useState<Omit<Finance, 'id' | 'createdAt' | 'updatedAt'>>({
    type: 'income',
    category: '',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    status: 'pending',
    notes: '',
    division: activeDivision
  })

  // Load finances from backend filtered by active division
  const loadFinances = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await apiClient.getFinances({ division: activeDivision })
      if (response.success && response.data) {
        setFinances(response.data)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load finances')
      setToast({ msg: err.message || 'Failed to load finances', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // Load invoices from backend (only applicable for NexCube digital agency projects)
  const loadInvoices = async () => {
    if (isPrinting) {
      setInvoices([])
      return
    }
    try {
      const response = await apiClient.getInvoices()
      if (response.success && response.data) {
        setInvoices(response.data)
      }
    } catch (err: any) {
      console.error('Failed to load invoices:', err.message)
    }
  }

  useEffect(() => {
    loadFinances()
    if (!isPrinting) {
      loadInvoices()
    } else {
      setInvoices([])
    }
    setFormData(prev => ({
      ...prev,
      division: activeDivision
    }))
  }, [activeDivision])

  // Background refresh for finances
  const { hasNew: hasNewFinances, newData: newFinances, clearNew: clearNewFinances } = useBackgroundRefresh<Finance[]>(
    `finances-${activeDivision}`,
    async () => {
      try {
        const r = await apiClient.getFinances({ division: activeDivision })
        return r.success && Array.isArray(r.data) ? r.data : null
      } catch { return null }
    },
    { interval: 60000 }
  )

  const [sseUpdating, setSseUpdating] = useState(false)

  // ISOLASI DATA KETAT: Hanya ambil data yang sesuai dengan activeDivision
  const divisionFinances = Array.isArray(finances)
    ? finances.filter(f => (f.division || 'nexcube') === activeDivision)
    : []

  const filteredFinances = divisionFinances.filter(finance =>
    finance.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    finance.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'amount') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError('')

      const payload = {
        ...formData,
        division: activeDivision
      }

      if (editingId) {
        // Update existing finance
        const response = await apiClient.updateFinance(editingId, payload)
        if (response.success) {
          await loadFinances()
          setToast({ msg: 'Transaksi berhasil diperbarui', type: 'success' })
        }
      } else {
        // Create new finance
        const response = await apiClient.createFinance(payload)
        if (response.success) {
          await loadFinances()
          setToast({ msg: 'Transaksi berhasil dibuat', type: 'success' })
        }
      }

      setFormData({
        type: 'income',
        category: '',
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: '',
        status: 'pending',
        notes: '',
        division: activeDivision
      })
      setEditingId(null)
      navigate(isPrinting ? '/dashboard/finances/printing' : '/dashboard/finances')
    } catch (err: any) {
      setError(err.message || 'Failed to save finance')
      setToast({ msg: err.message || 'Gagal menyimpan transaksi', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleEditFinance = (finance: Finance) => {
    setFormData({
      type: finance.type,
      category: finance.category,
      amount: finance.amount,
      description: finance.description,
      date: finance.date,
      paymentMethod: finance.paymentMethod || '',
      status: finance.status,
      notes: finance.notes || '',
      division: finance.division || activeDivision
    })
    setEditingId(finance.id.toString())
    navigate(isPrinting ? '/dashboard/finances/printing/form' : '/dashboard/finances/formfinance')
  }

  const handleDeleteFinance = async (financeId: number) => {
    try {
      setLoading(true)
      setError('')
      await apiClient.deleteFinance(financeId.toString())
      await loadFinances()
      setLoading(false)
      setToast({ msg: 'Transaksi berhasil dihapus', type: 'success' })
    } catch (err: any) {
      setError(err.message || 'Failed to delete finance')
      setToast({ msg: err.message || 'Gagal menghapus transaksi', type: 'error' })
      setLoading(false)
      throw err
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({
      type: 'income',
      category: '',
      amount: 0,
      description: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: '',
      status: 'pending',
      notes: '',
      division: activeDivision
    })
    navigate(isPrinting ? '/dashboard/finances/printing' : '/dashboard/finances')
  }

  // --- STATS CALCULATIONS ---
  // NexCube Stats (dihitung khusus dari data divisi NexCube)
  const nexcubeIncome = divisionFinances.reduce((sum, f) => f.type === 'income' && f.status === 'completed' ? sum + Number(f.amount) : sum, 0)
  const nexcubeExpense = divisionFinances.reduce((sum, f) => f.type === 'expense' && f.status === 'completed' ? sum + Number(f.amount) : sum, 0)
  
  // Hanya hitung invoice lunas yang belum tercatat di tabel keuangan (mencegah double-counting)
  const unrecordedInvoicePaidRevenue = isPrinting ? 0 : invoices
    .filter(inv => inv.status === 'paid' && !divisionFinances.some(f => (f.notes?.includes(inv.invoiceNumber) || f.description?.includes(inv.invoiceNumber))))
    .reduce((sum, inv) => sum + Number(inv.amount), 0)

  const invoiceOtherRevenue = isPrinting ? 0 : invoices
    .filter(inv => inv.status !== 'paid')
    .reduce((sum, inv) => sum + Number(inv.amount), 0)

  const totalPemasukanNexCube = nexcubeIncome + unrecordedInvoicePaidRevenue
  const balanceNexCube = totalPemasukanNexCube - nexcubeExpense

  // Printing Stats (P&L: dihitung murni dari data divisi Printing)
  const printingIncome = divisionFinances.reduce((sum, f) => f.type === 'income' && f.status === 'completed' ? sum + Number(f.amount) : sum, 0)
  const printingExpense = divisionFinances.reduce((sum, f) => f.type === 'expense' && f.status === 'completed' ? sum + Number(f.amount) : sum, 0)
  const printingNetProfit = printingIncome - printingExpense
  const printingMargin = printingIncome > 0 ? (printingNetProfit / printingIncome) * 100 : 0
  const printingCompletedCount = divisionFinances.filter(f => f.type === 'income' && f.status === 'completed').length
  const printingExpenseCount = divisionFinances.filter(f => f.type === 'expense' && f.status === 'completed').length

  return (
    <div>
      <Helmet>
        <title>{isPrinting ? 'Keuangan Printing - NexCube Dashboard' : 'Keuangan NexCube - NexCube Dashboard'}</title>
      </Helmet>

      {/* Page Container with Fade-In Animation */}
      <div className={`relative animate-in fade-in duration-500 ${sseUpdating ? 'ring-2 ring-blue-300/30' : ''}`}>
        {loading && (
          <div className="absolute inset-0 z-40">
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
            <div className="relative z-50 flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" />
            </div>
          </div>
        )}
        {sseUpdating && (
          <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-white/90 px-3 py-1 rounded shadow">
            <svg className="animate-spin h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
            <span className="text-sm text-slate-700">Updating...</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 text-blue-700">
              {isPrinting ? '🖨️ Divisi Percetakan & Fotocopy' : '🔹 Divisi Software & Agency Digital'}
            </div>
            <h1 className="text-3xl font-bold text-slate-900">
              {isPrinting ? 'Keuangan Printing' : 'Keuangan NexCube'}
            </h1>
            <p className="text-slate-600 mt-1">
              {isPrinting
                ? 'Kelola omzet harian cetak tugas/dokumen, cetak foto/stiker, serta biaya bahan baku & operasional'
                : 'Kelola arus kas transaksi pemasukan proyek digital, langganan, dan beban operasional NexCube'}
            </p>
          </div>
          {!showForm && (
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => downloadCsvTemplate(activeDivision)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-all"
                title={`Unduh template format CSV ${isPrinting ? 'Printing' : 'NexCube'}`}
              >
                <span>📄</span>
                <span>Unduh Template CSV</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCsvModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <span>📥</span>
                <span>Import CSV</span>
              </button>
              <button
                onClick={() => {
                  setTimeout(() => navigate(isPrinting ? '/dashboard/finances/printing/form' : '/dashboard/finances/formfinance'), 150)
                }}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:shadow-lg transition-all hover:scale-105 active:scale-95 shadow-md shadow-blue-500/20"
              >
                <span>+</span>
                <span>{isPrinting ? 'Catat Transaksi Printing' : 'Tambah Transaksi'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <FormFinance
              formData={formData}
              editingId={editingId}
              loading={loading}
              division={activeDivision}
              onInputChange={handleInputChange}
              onSetFormFields={(fields) => setFormData(prev => ({ ...prev, ...fields }))}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              onImportSuccess={async () => {
                await loadFinances()
                setToast({ msg: `Berhasil meng-import transaksi ${isPrinting ? 'Printing' : 'NexCube'}!`, type: 'success' })
                navigate(isPrinting ? '/dashboard/finances/printing' : '/dashboard/finances')
              }}
            />
          </div>
        )}

        {/* Table & Stats - Only show when not in form view */}
        {!showForm && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {(hasNewFinances && newFinances) || (typeof (window as any)._financesSSE !== 'undefined' && (window as any)._financesSSE) ? (
              <NewDataBanner
                message={`Data transaksi keuangan ${isPrinting ? 'Printing' : 'NexCube'} terbaru tersedia`}
                onRefresh={async () => {
                  setLoading(true)
                  try {
                    if (hasNewFinances && newFinances) { setFinances(newFinances); clearNewFinances() }
                    else if ((window as any)._financesSSE) { await loadFinances(); (window as any)._financesSSE = false }
                  } finally { setLoading(false) }
                }}
                onDismiss={() => clearNewFinances()}
              />
            ) : null}

            {/* Stats Cards: PRINTING (P&L) vs NEXCUBE */}
            {isPrinting ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* 1. Total Pendapatan Printing */}
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-200/80 relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Pendapatan</span>
                    <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg text-lg">💰</span>
                  </div>
                  <p className="text-2xl lg:text-3xl font-extrabold text-emerald-600 tracking-tight">
                    Rp {Math.round(printingIncome).toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 font-medium">
                    {printingCompletedCount} pesanan selesai
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500/80 rounded-b-2xl" />
                </div>

                {/* 2. Total Beban Operasional & HPP */}
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-200/80 relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Beban & HPP</span>
                    <span className="p-2 bg-rose-50 text-rose-600 rounded-lg text-lg">📉</span>
                  </div>
                  <p className="text-2xl lg:text-3xl font-extrabold text-rose-600 tracking-tight">
                    Rp {Math.round(printingExpense).toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 font-medium">
                    {printingExpenseCount} transaksi pengeluaran
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500/80 rounded-b-2xl" />
                </div>

                {/* 3. Laba Bersih Operasional */}
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-200/80 relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Laba Bersih</span>
                    <span className="p-2 bg-blue-50 text-blue-600 rounded-lg text-lg">📈</span>
                  </div>
                  <p className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${printingNetProfit >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                    Rp {Math.round(printingNetProfit).toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 font-medium">
                    Pendapatan - Total Beban
                  </p>
                  <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl ${printingNetProfit >= 0 ? 'bg-blue-500/80' : 'bg-rose-500/80'}`} />
                </div>

                {/* 4. Margin Laba Bersih (%) */}
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-200/80 relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Margin Laba Bersih</span>
                    <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg text-lg">📊</span>
                  </div>
                  <p className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${printingMargin >= 20 ? 'text-indigo-600' : (printingMargin >= 0 ? 'text-amber-600' : 'text-rose-600')}`}>
                    {printingMargin.toFixed(1)}%
                  </p>
                  <p className="text-xs text-slate-500 mt-2 font-medium">
                    Rasio profitabilitas usaha
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500/80 rounded-b-2xl" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-200/80">
                  <p className="text-slate-600 text-sm mb-2 font-medium">Total Pemasukan</p>
                  <p className="text-3xl font-bold text-green-600">Rp {Math.round(totalPemasukanNexCube || 0).toLocaleString('id-ID')}</p>
                  <p className="text-xs text-slate-500 mt-2">Invoice lunas + pemasukan lainnya</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-200/80">
                  <p className="text-slate-600 text-sm mb-2 font-medium">Pemasukan Belum Terbayar</p>
                  <p className="text-3xl font-bold text-amber-600">Rp {Math.round(invoiceOtherRevenue || 0).toLocaleString('id-ID')}</p>
                  <p className="text-xs text-slate-500 mt-2">Invoice pending / belum lunas</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-200/80">
                  <p className="text-slate-600 text-sm mb-2 font-medium">Total Pengeluaran</p>
                  <p className="text-3xl font-bold text-red-600">Rp {Math.round(nexcubeExpense || 0).toLocaleString('id-ID')}</p>
                  <p className="text-xs text-slate-500 mt-2">Operasional digital & server</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-200/80">
                  <p className="text-slate-600 text-sm mb-2 font-medium">Saldo Kas</p>
                  <p className={`text-3xl font-bold ${(balanceNexCube || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Rp {Math.round(balanceNexCube || 0).toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">Total kas riil bersih</p>
                </div>
              </div>
            )}

            {/* Search & Filter */}
            <div className="mb-6 flex gap-4">
              <input
                type="text"
                placeholder={isPrinting ? "Cari transaksi printing (cth: HVS, jilid, stiker, kertas)..." : "Cari transaksi NexCube..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
              />
            </div>

            {/* Finance Table Section Header */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {isPrinting ? 'Riwayat Transaksi Printing' : 'Riwayat Transaksi NexCube'}
                </h2>
                <p className="text-sm text-slate-600">
                  {isPrinting
                    ? 'Daftar semua pencatatan kasir dan pengeluaran divisi printing'
                    : 'Daftar semua transaksi kas operasional dan proyek agency digital'}
                </p>
              </div>
            </div>

            {/* Finance Table */}
            <FinanceTable 
              finances={filteredFinances}
              loading={loading}
              onEditFinance={handleEditFinance}
              onDeleteFinance={handleDeleteFinance}
            />
          </div>
        )}
      </div>
      {/* Modal Import CSV */}
      <CsvImportModal
        isOpen={showCsvModal}
        onClose={() => setShowCsvModal(false)}
        division={activeDivision}
        onSuccess={async () => {
          await loadFinances()
          setToast({ msg: `Berhasil meng-import transaksi ${isPrinting ? 'Printing' : 'NexCube'}!`, type: 'success' })
        }}
      />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

export default FinanceManagement
