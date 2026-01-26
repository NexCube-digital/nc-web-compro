import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import apiClient, { Invoice, Finance } from '../../services/api'
import { useTheme } from '../ThemeContext'
import { StaggerContainer, CountUp } from '../../components/PageTransition'

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
  const { theme } = useTheme()
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
  const [monthlyData, setMonthlyData] = useState<{ label: string; value: number }[]>([])

  const formatRupiah = (v: number) => `Rp ${v.toLocaleString('id-ID')}`

  useEffect(() => {
    let mounted = true

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

    // fetch only on mount (no auto-refresh)
    fetchAll()

    return () => {
      mounted = false
    }
  }, [])

  // Compute simple month-over-month change for top card metrics
  const latest = monthlyData[monthlyData.length - 1]?.value || 0
  const prev = monthlyData[monthlyData.length - 2]?.value || 0
  const monthChangePercent = prev === 0 ? (latest === 0 ? 0 : 100) : Math.round(((latest - prev) / prev) * 100)

  // Enhanced LineChart component with growth animation
  const LineChart: React.FC<{ data: { label: string; value: number }[] }> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null)
    const lineRef = useRef<SVGPathElement | null>(null)
    const [hover, setHover] = useState<number | null>(null)
    
    const rawMax = Math.max(...data.map(d => d.value), 1)
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
    
    const ticks = 4
    const tickValues = Array.from({ length: ticks + 1 }, (_, i) => Math.round((max * (ticks - i)) / ticks))
    const formatRupiah = (v: number) => `Rp ${v.toLocaleString('id-ID')}`
    
    // Chart dimensions
    const width = 600
    const height = 180
    const padding = { top: 15, right: 15, bottom: 30, left: 60 }
    
    // Calculate points for line
    const points = data.map((d, i) => {
      const x = padding.left + (i / (data.length - 1)) * (width - padding.left - padding.right)
      const y = padding.top + (1 - d.value / max) * (height - padding.top - padding.bottom)
      return { x, y, value: d.value, label: d.label }
    })
    
    // Create SVG path
    const createPath = () => {
      if (points.length === 0) return ''
      let path = `M ${points[0].x} ${points[0].y}`
      for (let i = 1; i < points.length; i++) {
        const xc = (points[i].x + points[i - 1].x) / 2
        const yc = (points[i].y + points[i - 1].y) / 2
        path += ` Q ${points[i - 1].x} ${points[i - 1].y} ${xc} ${yc}`
      }
      path += ` T ${points[points.length - 1].x} ${points[points.length - 1].y}`
      return path
    }
    
    // Animate line on mount
    useEffect(() => {
      if (lineRef.current) {
        const pathLength = lineRef.current.getTotalLength()
        gsap.fromTo(lineRef.current,
          { strokeDasharray: pathLength, strokeDashoffset: pathLength },
          { strokeDashoffset: 0, duration: 2, ease: 'power2.out' }
        )
      }
    }, [data])
    
    const cardPadding = theme === 'compact' ? 'p-4' : 'p-6'

    return (
      <div className={`bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-slate-100 h-full max-h-[400px] flex flex-col`}>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Data Penjualan
          </h2>
          <div className="text-xs sm:text-sm text-slate-500">Total: {formatRupiah(data.reduce((s, d) => s + d.value, 0))}</div>
        </div>

        <div className="relative overflow-x-auto">
          <div className="min-w-[320px]">
            <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
            {/* Grid lines */}
            {tickValues.map((tick, i) => {
              const y = padding.top + (i / ticks) * (height - padding.top - padding.bottom)
              return (
                <g key={i}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                  <text x={padding.left - 10} y={y + 5} textAnchor="end" fontSize="11" fill="#94a3b8">
                    {(tick / 1000000).toFixed(1)}M
                  </text>
                </g>
              )
            })}
            
            {/* X-axis labels */}
            {points.map((point, i) => (
              <text
                key={i}
                x={point.x}
                y={height - 10}
                textAnchor="middle"
                fontSize="11"
                fill="#64748b"
              >
                {data[i].label}
              </text>
            ))}
            
            {/* Area gradient */}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            
            {/* Area fill */}
            <path
              d={`${createPath()} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`}
              fill="url(#lineGradient)"
            />
            
            {/* Main line */}
            <path
              ref={lineRef}
              d={createPath()}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Data points */}
            {points.map((point, i) => (
              <g key={i}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={hover === i ? 6 : 4}
                  fill="white"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                />
                {hover === i && (
                  <g>
                    <rect
                      x={point.x - 60}
                      y={point.y - 45}
                      width="120"
                      height="35"
                      rx="6"
                      fill="#1e293b"
                      opacity="0.95"
                    />
                    <text
                      x={point.x}
                      y={point.y - 28}
                      textAnchor="middle"
                      fontSize="12"
                      fill="white"
                      fontWeight="600"
                    >
                      {formatRupiah(point.value)}
                    </text>
                    <text
                      x={point.x}
                      y={point.y - 15}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#cbd5e1"
                    >
                      {point.label}
                    </text>
                  </g>
                )}
              </g>
            ))}
          </svg>
          </div>
        </div>
      </div>
    )
  }

  const cardPaddingOuter = theme === 'compact' ? 'p-4' : 'p-6'

  if (loading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 sm:h-20 rounded-lg bg-slate-100 animate-pulse" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="lg:col-span-2 h-64 sm:h-80 rounded-lg bg-slate-100 animate-pulse" />
          <div className="h-64 sm:h-80 rounded-lg bg-slate-100 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <StaggerContainer className="space-y-3 sm:space-y-4" staggerDelay={0.15}>
      {/* Ringkasan (replaces top stat cards) */}
      <div className={`bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-slate-100 transition-smooth hover:shadow-lg`}>
        <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-2 sm:mb-3">Ringkasan</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3">
          <div className={`p-2 sm:p-3 ${theme === 'minimal' ? 'bg-blue-50' : 'bg-gradient-to-br from-blue-50 to-blue-100'} rounded-lg border border-blue-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-700 font-semibold">Total Invoices</p>
                <p className="text-lg sm:text-xl font-bold text-blue-900 mt-1">
                  <CountUp end={stats.totalInvoices} duration={1.5} delay={0.2} />
                </p>
              </div>
              <div className="p-1 sm:p-1.5 rounded-md bg-blue-100 text-blue-700">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className={`p-2 sm:p-3 ${theme === 'minimal' ? 'bg-green-50' : 'bg-gradient-to-br from-green-50 to-green-100'} rounded-lg border border-green-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-700 font-semibold">Total Pemasukan</p>
                <p className="text-lg sm:text-xl font-bold text-green-900 mt-1">
                  Rp <CountUp end={stats.totalPemasukan || 0} duration={1.5} delay={0.3} />
                </p>
              </div>
              <div className="p-1 sm:p-1.5 rounded-md bg-green-100 text-green-700">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className={`p-2 sm:p-3 ${theme === 'minimal' ? 'bg-yellow-50' : 'bg-gradient-to-br from-yellow-50 to-yellow-100'} rounded-lg border border-yellow-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-yellow-700 font-semibold">Pemasukan Lainnya</p>
                <p className="text-lg sm:text-xl font-bold text-yellow-900 mt-1">
                  Rp <CountUp end={stats.pemasukanLainnya || 0} duration={1.5} delay={0.4} />
                </p>
              </div>
              <div className="p-1 sm:p-1.5 rounded-md bg-yellow-100 text-yellow-700">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className={`p-2 sm:p-3 ${theme === 'minimal' ? 'bg-red-50' : 'bg-gradient-to-br from-red-50 to-red-100'} rounded-lg border border-red-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-red-700 font-semibold">Total Pengeluaran</p>
                <p className="text-lg sm:text-xl font-bold text-red-900 mt-1">
                  Rp <CountUp end={stats.totalPengeluaran || 0} duration={1.5} delay={0.5} />
                </p>
              </div>
              <div className="p-1 sm:p-1.5 rounded-md bg-red-100 text-red-700">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18" />
                </svg>
              </div>
            </div>
          </div>
          <div className={`p-2 sm:p-3 ${theme === 'minimal' ? 'bg-purple-50' : 'bg-gradient-to-br from-purple-50 to-purple-100'} rounded-lg border border-purple-200 col-span-2 sm:col-span-2 lg:col-span-1`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-700 font-semibold">Saldo</p>
                <p className="text-lg sm:text-xl font-bold text-purple-900 mt-1">
                  Rp <CountUp end={Math.abs(stats.saldo || 0)} duration={1.5} delay={0.6} />
                </p>
              </div>
              <div className="p-1 sm:p-1.5 rounded-md bg-purple-100 text-purple-700">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-9H21" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Invoices (swapped) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Line chart in the former invoice area (large) */}
        <div className="lg:col-span-2">
          <LineChart data={monthlyData} />
        </div>

        {/* Recent Invoices (moved to right) */}
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-slate-100 max-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6M7 7h10M7 21h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Invoice Terbaru
            </h2>
            <button
              onClick={() => navigate('/dashboard/invoices')}
              className="text-blue-600 font-semibold text-xs sm:text-sm hover:text-blue-700"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-2 sm:space-y-3 overflow-y-auto flex-1">
            {Array.isArray(stats.recentInvoices) && stats.recentInvoices.length > 0 ? (
              stats.recentInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  onClick={() => navigate(`/dashboard/invoices`)}
                  className="flex items-center justify-between p-2 sm:p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base text-slate-900 truncate">{invoice.invoiceNumber}</p>
                    <p className="text-xs sm:text-sm text-slate-600 truncate">{invoice.clientName || 'Unknown Client'}</p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(invoice.issueDate).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div className="text-right ml-2 flex-shrink-0">
                    <p className="font-semibold text-sm sm:text-base text-slate-900">Rp {Math.round(invoice.amount || 0).toLocaleString('id-ID')}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${
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
    </StaggerContainer>
  )
}

export default DashboardStats
