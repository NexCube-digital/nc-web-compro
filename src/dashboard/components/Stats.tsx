import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient, { Invoice, Finance } from '../../services/api'

interface InvoiceData {
  id: number
  invoiceNumber: string
  clientName?: string
  clientId?: number
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  issueDate: string
  dueDate: string
}

export const DashboardStats: React.FC = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalClients: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    overdueInvoices: 0,
    totalPemasukan: 0,
    pemasukanLainnya: 0,
    totalPengeluaran: 0,
    saldo: 0,
    recentInvoices: [] as InvoiceData[]
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const POLL_MS = 10000 // 10s polling interval

    const fetchAll = async () => {
      if (!mounted) return
      try {
        setLoading(true)

        // contacts
        const contactsResponse = await apiClient.getContacts()
        const totalClients = (Array.isArray(contactsResponse.data) ? contactsResponse.data.length : 0) || 0

        // invoices + finances in parallel
        const [invoicesResponse, financesResponse] = await Promise.allSettled([
          apiClient.getInvoices(),
          apiClient.getFinances()
        ])

        const invoices: InvoiceData[] = invoicesResponse.status === 'fulfilled' && Array.isArray(invoicesResponse.value.data)
          ? invoicesResponse.value.data
          : []

        const finances: any[] = financesResponse.status === 'fulfilled' && Array.isArray(financesResponse.value.data)
          ? financesResponse.value.data
          : []

        // Calculate stats
        const totalInvoices = invoices.length
        const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length
        const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0)
        const pemasukanLainnya = finances.reduce((sum, f: any) => sum + (f.type === 'income' ? Number(f.amount || 0) : 0), 0)
        const totalPengeluaran = finances.reduce((sum, f: any) => sum + (f.type === 'expense' ? Number(f.amount || 0) : 0), 0)
        const totalPemasukan = totalRevenue
        const saldo = totalPemasukan + pemasukanLainnya - totalPengeluaran

        const recentInvoices = invoices
          .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
          .slice(0, 3)

        if (!mounted) return
        setStats({
          totalClients: totalClients || 0,
          totalInvoices: totalInvoices || 0,
          totalRevenue: totalRevenue || 0,
          overdueInvoices: overdueInvoices || 0,
          totalPemasukan: totalPemasukan || 0,
          pemasukanLainnya: pemasukanLainnya || 0,
          totalPengeluaran: totalPengeluaran || 0,
          saldo: saldo || 0,
          recentInvoices: recentInvoices || []
        })

        // compute monthly data
        const now = new Date()
        const months: { label: string; value: number }[] = []
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
          const label = d.toLocaleString('id-ID', { month: 'short' })
          months.push({ label, value: 0 })
        }

        const totals = months.map((m, idx) => {
          const target = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1)
          const total = invoices.reduce((sum: number, inv: any) => {
            const issue = new Date(inv.issueDate)
            if (issue.getFullYear() === target.getFullYear() && issue.getMonth() === target.getMonth()) {
              return sum + Number(inv.amount || 0)
            }
            return sum
          }, 0)
          return { label: m.label, value: total }
        })

        setMonthlyData(totals)
      } catch (e) {
        console.error('Failed fetching dashboard data', e)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    // initial fetch
    fetchAll()

    // polling
    const id = setInterval(fetchAll, POLL_MS)

    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [])

  // Prepare monthly data for bar chart (last 6 months)
  const [monthlyData, setMonthlyData] = useState<{ label: string; value: number }[]>([])

  useEffect(() => {
    const now = new Date()
    const months: { label: string; value: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const label = d.toLocaleString('id-ID', { month: 'short' })
      months.push({ label, value: 0 })
    }

    // Aggregate invoice amounts by month
    const loadMonthly = async () => {
      try {
        const invRes = await apiClient.getInvoices()
        const invs = Array.isArray(invRes.data) ? invRes.data : []
        const totals = months.map((m, idx) => {
          const target = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1)
          const total = invs.reduce((sum: number, inv: any) => {
            const issue = new Date(inv.issueDate)
            if (issue.getFullYear() === target.getFullYear() && issue.getMonth() === target.getMonth()) {
              return sum + Number(inv.amount || 0)
            }
            return sum
          }, 0)
          return { label: m.label, value: total }
        })
        setMonthlyData(totals)
      } catch (e) {
        setMonthlyData(months)
      }
    }

    loadMonthly()
  }, [stats.recentInvoices])

  // Enhanced BarChart component with responsive layout, y-axis ticks and tooltip
  const BarChart: React.FC<{ data: { label: string; value: number }[] }> = ({ data }) => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [hover, setHover] = useState<{ idx: number; x: number; y: number; value: number } | null>(null)
    const rawMax = Math.max(...data.map(d => d.value), 1)

    // Round max to a 'nice' number (1,2,5 * 10^exp) for better readable ticks
    const niceNumber = (n: number) => {
      if (n <= 0) return 1
      const exp = Math.floor(Math.log10(n))
      const f = n / Math.pow(10, exp)
      let nf = 1
      if (f <= 1) nf = 1
      else if (f <= 2) nf = 2
      else if (f <= 5) nf = 5
      else nf = 10
      return nf * Math.pow(10, exp)
    }

    const max = niceNumber(rawMax)

    // ticks for y-axis (4 ticks)
    const ticks = 4
    const tickValues = Array.from({ length: ticks + 1 }, (_, i) => Math.round((max * (ticks - i)) / ticks))

    const formatRupiah = (v: number) => `Rp ${v.toLocaleString('id-ID')}`

    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 14h3v-4h4v4h3" />
            </svg>
            Pemasukan Bulanan
          </h2>
          <div className="text-sm text-slate-500">6 bulan terakhir — Total: {formatRupiah(data.reduce((s, d) => s + d.value, 0))}</div>
        </div>

        <div className="flex gap-4 items-stretch">
          {/* Y-axis labels */}
          <div className="w-20 hidden sm:flex flex-col justify-between items-end text-xs text-slate-400 pr-3">
            {tickValues.map((v, i) => (
              <div key={i}>{formatRupiah(v)}</div>
            ))}
          </div>

          {/* Chart area */}
          <div ref={containerRef} className="flex-1 relative h-48 lg:h-64">
            {/* horizontal grid lines */}
            {tickValues.map((_, i) => (
              <div key={i} className="absolute left-0 right-0 border-t border-slate-100" style={{ top: `${(i / ticks) * 100}%` }} />
            ))}

            <div className="absolute inset-0 flex items-end gap-3 px-1">
              {data.map((d, idx) => {
                const heightPercent = (d.value / max) * 100
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div className="text-xs text-slate-600 mb-2 sm:mb-3">{formatRupiah(d.value)}</div>
                    <div
                      role="button"
                      tabIndex={0}
                      onMouseMove={(e) => {
                        const rect = containerRef.current?.getBoundingClientRect()
                        if (!rect) return
                        setHover({ idx, x: e.clientX - rect.left, y: e.clientY - rect.top - 48, value: d.value })
                      }}
                      onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover({ idx, x: 0, y: 0, value: d.value })}
                      className="w-full rounded-t-md bg-gradient-to-br from-blue-500 to-blue-600 transform origin-bottom hover:from-blue-600 hover:to-blue-700 hover:scale-105 cursor-pointer"
                      style={{ height: `${heightPercent}%`, transition: 'height 700ms cubic-bezier(0.2,0.8,0.2,1)', willChange: 'height' }}
                      title={`${formatRupiah(d.value)} — ${d.label}`}
                    />
                    <div className="text-xs text-slate-600 mt-3">{d.label}</div>
                  </div>
                )
              })}
            </div>

            {/* Tooltip */}
            {hover && (
              <div
                className="absolute z-50 pointer-events-none"
                style={{ left: Math.min(hover.x, (containerRef.current?.clientWidth || 300) - 140), top: Math.max(hover.y, 8) }}
              >
                <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-md shadow-lg">
                  <div className="font-semibold">{formatRupiah(hover.value)}</div>
                  <div className="text-slate-200 text-xs">{data[hover.idx]?.label}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Ringkasan (replaces top stat cards) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Ringkasan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-semibold">Total Invoices</p>
                <p className="text-2xl font-bold text-blue-900 mt-2">{stats.totalInvoices}</p>
              </div>
              <div className="p-2 rounded-md bg-blue-100 text-blue-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-semibold">Total Pemasukan</p>
                <p className="text-2xl font-bold text-green-900 mt-2">Rp {((stats.totalPemasukan || 0)).toLocaleString('id-ID')}</p>
              </div>
              <div className="p-2 rounded-md bg-green-100 text-green-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 font-semibold">Pemasukan Lainnya</p>
                <p className="text-2xl font-bold text-yellow-900 mt-2">Rp {((stats.pemasukanLainnya || 0)).toLocaleString('id-ID')}</p>
              </div>
              <div className="p-2 rounded-md bg-yellow-100 text-yellow-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 font-semibold">Total Pengeluaran</p>
                <p className="text-2xl font-bold text-red-900 mt-2">Rp {((stats.totalPengeluaran || 0)).toLocaleString('id-ID')}</p>
              </div>
              <div className="p-2 rounded-md bg-red-100 text-red-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18" />
                </svg>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 lg:col-span-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-semibold">Saldo</p>
                <p className="text-2xl font-bold text-purple-900 mt-2">Rp {Math.abs(stats.saldo || 0).toLocaleString('id-ID')}</p>
              </div>
              <div className="p-2 rounded-md bg-purple-100 text-purple-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-9H21" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Invoices (swapped) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart in the former invoice area (large) */}
        <div className="lg:col-span-2">
          <BarChart data={monthlyData} />
        </div>

        {/* Recent Invoices (moved to right) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-3">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6M7 7h10M7 21h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Invoice Terbaru
            </h2>
            <button
              onClick={() => navigate('/dashboard/invoices')}
              className="text-blue-600 font-semibold text-sm hover:text-blue-700"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-4">
            {Array.isArray(stats.recentInvoices) && stats.recentInvoices.length > 0 ? (
              stats.recentInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  onClick={() => navigate(`/dashboard/invoices`)}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-slate-600">{invoice.clientName || 'Unknown Client'}</p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(invoice.issueDate).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">Rp {Math.round(invoice.amount || 0).toLocaleString('id-ID')}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                      invoice.status === 'sent' ? 'bg-yellow-100 text-yellow-700' :
                      invoice.status === 'overdue' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>Tidak ada invoice terbaru</p>
                <button onClick={() => navigate('/dashboard/invoices/forminvoice')} className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Buat Invoice</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardStats
