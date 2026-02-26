import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import apiClient from '../../services/api'
import { useTheme } from '../ThemeContext'
import { StaggerContainer, CountUp } from '../../components/PageTransition'

// Lucide React Icons
import {
  LayoutDashboard,
  Images,
  MessageSquareQuote,
  Package,
  Link2,
  FileText,
  TrendingUp,
  ArrowRight,
  Lightbulb,
  Wallet,
  Receipt,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
} from 'lucide-react'

// React Icons
import { RiMoneyDollarCircleLine } from 'react-icons/ri'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import { MdOutlineAccountBalanceWallet } from 'react-icons/md'

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

// ─── Welcome Page untuk role 'user' ───────────────────────────────────────────
const UserWelcomePage: React.FC<{ userName?: string }> = ({ userName }) => {
  const firstName = userName?.split(' ')[0] || 'Kamu'
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const hour = new Date().getHours()
  const greeting =
    hour < 11 ? 'Selamat Pagi' :
    hour < 15 ? 'Selamat Siang' :
    hour < 18 ? 'Selamat Sore' : 'Selamat Malam'

  const greetingEmoji =
    hour < 11 ? '🌅' : hour < 15 ? '☀️' : hour < 18 ? '🌇' : '🌙'

  const tips = [
    {
      icon: <Images className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50 group-hover:bg-blue-100',
      title: 'Kelola Portfolio',
      desc: 'Tambahkan karya terbaik kamu ke halaman Portfolio untuk dipamerkan ke klien.',
      tab: 'portfolios',
      accent: 'group-hover:text-blue-700',
      arrow: 'group-hover:text-blue-400',
    },
    {
      icon: <MessageSquareQuote className="w-5 h-5 text-violet-600" />,
      bg: 'bg-violet-50 group-hover:bg-violet-100',
      title: 'Testimoni Klien',
      desc: 'Minta klien memberikan ulasan positif dan tampilkan di halaman Testimonial.',
      tab: 'testimonials',
      accent: 'group-hover:text-violet-700',
      arrow: 'group-hover:text-violet-400',
    },
    {
      icon: <Package className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50 group-hover:bg-emerald-100',
      title: 'Lihat Paket',
      desc: 'Eksplorasi paket layanan yang tersedia — website, desain, event, dan katalog.',
      tab: 'paket/website',
      accent: 'group-hover:text-emerald-700',
      arrow: 'group-hover:text-emerald-400',
    },
    {
      icon: <Link2 className="w-5 h-5 text-orange-600" />,
      bg: 'bg-orange-50 group-hover:bg-orange-100',
      title: 'Program Affiliate',
      desc: 'Daftarkan diri ke program affiliate dan raih komisi dari setiap referral.',
      tab: 'paket/affiliate',
      accent: 'group-hover:text-orange-700',
      arrow: 'group-hover:text-orange-400',
    },
  ]

  useEffect(() => {
    if (!containerRef.current) return
    const items = containerRef.current.querySelectorAll('.animate-item')
    gsap.fromTo(
      items,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power3.out', delay: 0.1 }
    )
  }, [])

  return (
    <div ref={containerRef} className="min-h-[80vh] flex flex-col gap-6 sm:gap-8 px-2">

      {/* Hero greeting */}
      <div className="animate-item relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 p-6 sm:p-10 shadow-2xl">
        <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-blue-300 text-sm font-semibold tracking-widest uppercase mb-2">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              {greeting}, <span className="text-blue-300">{firstName}!</span> {greetingEmoji}
            </h1>
            <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-lg leading-relaxed">
              Selamat datang di dashboard <span className="text-white font-semibold">NexCube Digital</span>.
              Kamu bisa mengelola portfolio, testimoni, paket layanan, dan program affiliate dari sini.
            </p>
          </div>

          <div className="flex-shrink-0 hidden sm:flex items-center justify-center h-24 w-24 rounded-2xl bg-white/10 border border-white/20 backdrop-blur shadow-xl">
            <LayoutDashboard className="w-10 h-10 text-blue-300" />
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="animate-item">
        <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="inline-block h-1 w-5 rounded-full bg-blue-500" />
          Akses Cepat
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {tips.map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(`/dashboard/${item.tab}`)}
              className="group text-left flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className={`flex-shrink-0 flex items-center justify-center h-11 w-11 rounded-xl ${item.bg} transition-colors`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-slate-800 text-sm ${item.accent} transition-colors`}>{item.title}</p>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">{item.desc}</p>
              </div>
              <ArrowRight className={`w-4 h-4 text-slate-300 ${item.arrow} ml-auto mt-0.5 flex-shrink-0 transition-colors`} />
            </button>
          ))}
        </div>
      </div>

      {/* Info strip */}
      <div className="animate-item flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
        <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-xl bg-amber-100">
          <Lightbulb className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-800">Tips untuk kamu</p>
          <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
            Lengkapi portfolio kamu dengan proyek terbaru agar klien dapat melihat karya-karya terbaik yang telah kamu buat.
            Semakin lengkap portfolio, semakin besar peluang mendapatkan proyek baru!
          </p>
        </div>
      </div>

      <p className="animate-item text-center text-xs text-slate-400 pb-2">
        Butuh akses lebih? Hubungi administrator NexCube Digital.
      </p>
    </div>
  )
}

// ─── Main DashboardStats ───────────────────────────────────────────────────────
interface DashboardStatsProps {
  userRole?: 'admin' | 'user'
  userName?: string
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ userRole = 'admin', userName }) => {
  const navigate = useNavigate()
  const { theme } = useTheme()

  if (userRole !== 'admin') {
    return <UserWelcomePage userName={userName} />
  }

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

        const contactsResponse = await apiClient.getContacts()
        const totalClients = (Array.isArray(contactsResponse.data) ? contactsResponse.data.length : 0) || 0

        const [invoicesResponse, financesResponse] = await Promise.allSettled([
          apiClient.getInvoices(),
          apiClient.getFinances()
        ])

        const invoices: InvoiceData[] = invoicesResponse.status === 'fulfilled' && Array.isArray(invoicesResponse.value.data)
          ? invoicesResponse.value.data : []

        const finances: any[] = financesResponse.status === 'fulfilled' && Array.isArray(financesResponse.value.data)
          ? financesResponse.value.data : []

        const totalInvoices = invoices.length
        const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length
        const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0)

        const totalPemasukan = invoices
          .filter(inv => inv.status === 'paid')
          .reduce((sum, inv) => sum + Number(inv.amount || 0), 0)

        const pemasukanLainnya = finances.reduce((sum, f: any) => sum + (f.type === 'income' ? Number(f.amount || 0) : 0), 0)
        const totalPengeluaran = finances.reduce((sum, f: any) => sum + (f.type === 'expense' ? Number(f.amount || 0) : 0), 0)
        const saldo = totalPemasukan + pemasukanLainnya - totalPengeluaran

        const recentInvoices = invoices
          .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
          .slice(0, 3)

        if (!mounted) return
        setStats({ totalClients, totalInvoices, totalRevenue, overdueInvoices, totalPemasukan, pemasukanLainnya, totalPengeluaran, saldo, recentInvoices })

        const now = new Date()
        const totals = Array.from({ length: 6 }, (_, i) => {
          const target = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
          const label = target.toLocaleString('id-ID', { month: 'short' })
          const value = invoices.reduce((sum: number, inv: any) => {
            if (inv.status !== 'paid') return sum
            const issue = new Date(inv.issueDate)
            if (issue.getFullYear() === target.getFullYear() && issue.getMonth() === target.getMonth()) {
              return sum + Number(inv.amount || 0)
            }
            return sum
          }, 0)
          return { label, value }
        })

        setMonthlyData(totals)
      } catch (e) {
        console.error('Failed fetching dashboard data', e)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchAll()
    return () => { mounted = false }
  }, [])

  const latest = monthlyData[monthlyData.length - 1]?.value || 0
  const prev = monthlyData[monthlyData.length - 2]?.value || 0
  const monthChangePercent = prev === 0 ? (latest === 0 ? 0 : 100) : Math.round(((latest - prev) / prev) * 100)

  const LineChart: React.FC<{ data: { label: string; value: number }[] }> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null)
    const lineRef = useRef<SVGPathElement | null>(null)
    const [hover, setHover] = useState<number | null>(null)

    const rawMax = Math.max(...data.map(d => d.value), 1)
    const niceNumber = (n: number) => {
      if (n <= 0) return 1
      const exp = Math.floor(Math.log10(n))
      const f = n / Math.pow(10, exp)
      const nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10
      return nf * Math.pow(10, exp)
    }
    const max = niceNumber(rawMax)
    const ticks = 4
    const tickValues = Array.from({ length: ticks + 1 }, (_, i) => Math.round((max * (ticks - i)) / ticks))

    const width = 600
    const height = 180
    const padding = { top: 15, right: 15, bottom: 30, left: 60 }

    const points = data.map((d, i) => ({
      x: padding.left + (i / (data.length - 1)) * (width - padding.left - padding.right),
      y: padding.top + (1 - d.value / max) * (height - padding.top - padding.bottom),
      value: d.value,
      label: d.label,
    }))

    const createPath = () => {
      if (points.length < 2) return ''
      let path = `M ${points[0].x} ${points[0].y}`
      for (let i = 1; i < points.length; i++) {
        const xc = (points[i].x + points[i - 1].x) / 2
        const yc = (points[i].y + points[i - 1].y) / 2
        path += ` Q ${points[i - 1].x} ${points[i - 1].y} ${xc} ${yc}`
      }
      path += ` T ${points[points.length - 1].x} ${points[points.length - 1].y}`
      return path
    }

    useEffect(() => {
      if (lineRef.current && points.length >= 2) {
        const pathLength = lineRef.current.getTotalLength()
        gsap.fromTo(lineRef.current,
          { strokeDasharray: pathLength, strokeDashoffset: pathLength },
          { strokeDashoffset: 0, duration: 2, ease: 'power2.out' }
        )
      }
    }, [data])

    return (
      <div className="bg-white/80 rounded-xl p-4 sm:p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.5)] border border-slate-100/80 h-full max-h-[400px] flex flex-col backdrop-blur">
        <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              Data Penjualan (Paid)
            </h2>
            <p className="text-xs text-slate-500 mt-1">Total: {formatRupiah(data.reduce((s, d) => s + d.value, 0))}</p>
          </div>
          <div className={`text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1 ${monthChangePercent >= 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
            {monthChangePercent >= 0
              ? <ArrowUpRight className="w-3 h-3" />
              : <ArrowDownLeft className="w-3 h-3" />
            }
            {monthChangePercent >= 0 ? '+' : ''}{monthChangePercent}% bulan ini
          </div>
        </div>

        <div className="relative overflow-x-auto">
          <div className="min-w-[320px]">
            <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.04" />
                </linearGradient>
                <linearGradient id="lineStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="60%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
                <filter id="lineGlow" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              <rect x={padding.left} y={padding.top} width={width - padding.left - padding.right} height={height - padding.top - padding.bottom} rx="8" fill="#f8fafc" />

              {tickValues.map((tick, i) => {
                const y = padding.top + (i / ticks) * (height - padding.top - padding.bottom)
                return (
                  <g key={i}>
                    <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 6" />
                    <text x={padding.left - 10} y={y + 5} textAnchor="end" fontSize="11" fill="#94a3b8">{(tick / 1000000).toFixed(1)}M</text>
                  </g>
                )
              })}

              {points.map((point, i) => (
                <text key={i} x={point.x} y={height - 10} textAnchor="middle" fontSize="11" fill="#64748b">{data[i].label}</text>
              ))}

              {points.length >= 2 && (
                <path d={`${createPath()} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`} fill="url(#lineGradient)" />
              )}
              {points.length >= 2 && (
                <path ref={lineRef} d={createPath()} fill="none" stroke="url(#lineStroke)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#lineGlow)" />
              )}
              {points.length < 2 && (
                <text x={width / 2} y={height / 2} textAnchor="middle" fontSize="13" fill="#94a3b8">Belum ada data penjualan</text>
              )}

              {points.map((point, i) => (
                <g key={i}>
                  <circle cx={point.x} cy={point.y} r={hover === i ? 6 : 4} fill="white" stroke="#3b82f6" strokeWidth="2"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
                  />
                  {hover === i && (
                    <g>
                      <rect x={point.x - 60} y={point.y - 45} width="120" height="35" rx="8" fill="#0f172a" opacity="0.96" />
                      <text x={point.x} y={point.y - 28} textAnchor="middle" fontSize="12" fill="white" fontWeight="600">{formatRupiah(point.value)}</text>
                      <text x={point.x} y={point.y - 15} textAnchor="middle" fontSize="10" fill="#cbd5e1">{point.label}</text>
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

  if (loading) {
    return (
      <div className="space-y-3 sm:space-y-4 overflow-hidden">
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

  // Stat cards config
  const statCards = [
    {
      label: 'Total Invoices',
      sub: null,
      value: <CountUp end={stats.totalInvoices} duration={1.5} delay={0.2} />,
      prefix: null,
      icon: <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: {
        bg: theme === 'minimal' ? 'bg-blue-50' : 'bg-gradient-to-br from-blue-50 to-blue-100',
        border: 'border-blue-200', text: 'text-blue-700', val: 'text-blue-900', iconBg: 'bg-blue-100 text-blue-700'
      },
    },
    {
      label: 'Total Pemasukan',
      sub: 'Invoice Paid',
      value: <CountUp end={stats.totalPemasukan || 0} duration={1.5} delay={0.3} />,
      prefix: 'Rp ',
      icon: <RiMoneyDollarCircleLine className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: {
        bg: theme === 'minimal' ? 'bg-green-50' : 'bg-gradient-to-br from-green-50 to-green-100',
        border: 'border-green-200', text: 'text-green-700', val: 'text-green-900', iconBg: 'bg-green-100 text-green-700'
      },
    },
    {
      label: 'Pemasukan Lainnya',
      sub: null,
      value: <CountUp end={stats.pemasukanLainnya || 0} duration={1.5} delay={0.4} />,
      prefix: 'Rp ',
      icon: <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: {
        bg: theme === 'minimal' ? 'bg-yellow-50' : 'bg-gradient-to-br from-yellow-50 to-yellow-100',
        border: 'border-yellow-200', text: 'text-yellow-700', val: 'text-yellow-900', iconBg: 'bg-yellow-100 text-yellow-700'
      },
    },
    {
      label: 'Total Pengeluaran',
      sub: null,
      value: <CountUp end={stats.totalPengeluaran || 0} duration={1.5} delay={0.5} />,
      prefix: 'Rp ',
      icon: <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: {
        bg: theme === 'minimal' ? 'bg-red-50' : 'bg-gradient-to-br from-red-50 to-red-100',
        border: 'border-red-200', text: 'text-red-700', val: 'text-red-900', iconBg: 'bg-red-100 text-red-700'
      },
    },
    {
      label: 'Saldo',
      sub: null,
      value: <CountUp end={Math.abs(stats.saldo || 0)} duration={1.5} delay={0.6} />,
      prefix: 'Rp ',
      icon: <MdOutlineAccountBalanceWallet className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: {
        bg: theme === 'minimal' ? 'bg-purple-50' : 'bg-gradient-to-br from-purple-50 to-purple-100',
        border: 'border-purple-200', text: 'text-purple-700', val: 'text-purple-900', iconBg: 'bg-purple-100 text-purple-700'
      },
      span: true,
    },
  ]

  return (
    <StaggerContainer className="space-y-3 sm:space-y-4 overflow-hidden" staggerDelay={0.15}>
      <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-2 sm:mb-3 flex items-center gap-2">
          <HiOutlineDocumentReport className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
          Ringkasan
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3">
          {statCards.map((card, i) => (
            <div
              key={i}
              className={`p-2 sm:p-3 ${card.color.bg} rounded-lg border ${card.color.border} ${card.span ? 'col-span-2 sm:col-span-2 lg:col-span-1' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs ${card.color.text} font-semibold`}>{card.label}</p>
                  {card.sub && <p className={`text-[10px] ${card.color.text} opacity-70 font-medium`}>{card.sub}</p>}
                  <p className={`text-lg sm:text-xl font-bold ${card.color.val} mt-1`}>
                    {card.prefix}{card.value}
                  </p>
                </div>
                <div className={`p-1 sm:p-1.5 rounded-md ${card.color.iconBg}`}>
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="lg:col-span-2">
          <LineChart data={monthlyData} />
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-slate-100 max-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
              Invoice Terbaru
            </h2>
            <button
              onClick={() => navigate('/dashboard/invoices')}
              className="text-blue-600 font-semibold text-xs sm:text-sm hover:text-blue-700 flex items-center gap-1"
            >
              Lihat Semua <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2 sm:space-y-3 overflow-y-auto flex-1">
            {Array.isArray(stats.recentInvoices) && stats.recentInvoices.length > 0 ? (
              stats.recentInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  onClick={() => navigate('/dashboard/invoices')}
                  className="flex items-center justify-between p-2 sm:p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base text-slate-900 truncate">{invoice.invoiceNumber}</p>
                    <p className="text-xs sm:text-sm text-slate-600 truncate">{invoice.clientName || 'Unknown Client'}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(invoice.issueDate).toLocaleDateString('id-ID')}
                    </p>
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
                <Wallet className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">Tidak ada invoice terbaru</p>
                <button
                  onClick={() => navigate('/dashboard/invoices/forminvoice')}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  <FileText className="w-4 h-4" /> Buat Invoice
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </StaggerContainer>
  )
}

export default DashboardStats