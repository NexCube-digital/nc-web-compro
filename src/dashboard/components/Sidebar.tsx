import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiClient from '../../services/api'
import { useTheme } from '../ThemeContext'

const DASHBOARD_PREFETCHERS: Record<string, () => Promise<unknown>> = {
  overview: () => import('./Stats'),
  users: () => import('../pages/UserManagement'),
  'hak-akses': () => import('../pages/HakAksesManagement'),
  reports: () => import('../pages/ReportManagement'),
  clients: () => import('../pages/ClientManagement'),
  invoices: () => import('../pages/InvoiceManagement'),
  finances: () => import('../pages/FinanceManagement'),
  'finances/printing': () => import('../pages/FinanceManagement'),
  portfolios: () => import('../pages/PortfolioManagement'),
  testimonials: () => import('../pages/TestimonialManagement'),
  'paket/website': () => import('../pages/PackageManagement'),
  'paket/desain': () => import('../pages/PackageManagement'),
  'paket/event': () => import('../pages/PackageManagement'),
  'paket/katalog': () => import('../pages/PackageManagement'),
  'paket/affiliate': () => import('../pages/AffiliateManagement'),
}

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
  activeTab: string
  userRole?: string
}

export const DashboardSidebar: React.FC<SidebarProps> = ({ 
  open, 
  setOpen, 
  activeTab,
  userRole = 'user'
}) => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [prefetchedTabs, setPrefetchedTabs] = useState<Record<string, boolean>>({})

  const isAdmin = userRole === 'admin'

  // Dynamic role permissions from BE/cache
  const [rolePermissions, setRolePermissions] = useState<string[]>(() => {
    try {
      const cached = localStorage.getItem('rolePermissionsCache')
      if (cached) {
        const parsed = JSON.parse(cached)
        return parsed[userRole] || []
      }
    } catch {}
    return []
  })

  useEffect(() => {
    let mounted = true
    const loadPermissions = async () => {
      try {
        const res = await apiClient.getRolePermissions()
        if (res.success && res.data && mounted) {
          localStorage.setItem('rolePermissionsCache', JSON.stringify(res.data))
          setRolePermissions(res.data[userRole] || [])
        }
      } catch {}
    }

    loadPermissions()

    const handlePermUpdated = () => {
      loadPermissions()
    }
    window.addEventListener('permissionsUpdated', handlePermUpdated)
    return () => {
      mounted = false
      window.removeEventListener('permissionsUpdated', handlePermUpdated)
    }
  }, [userRole])

  // Helper: check if the menu item is permitted for current role
  const canAccess = (id: string): boolean => {
    if (isAdmin) return true
    if (rolePermissions.length > 0) {
      return rolePermissions.includes(id)
    }
    // Fallback defaults if cache not yet populated
    if (userRole === 'designer') {
      return ['overview', 'portfolios', 'testimonials', 'paket/desain', 'paket/katalog', 'paket/website'].includes(id)
    }
    if (userRole === 'teknis') {
      return ['overview', 'portfolios', 'testimonials', 'paket/website', 'paket/event'].includes(id)
    }
    return ['overview', 'portfolios', 'testimonials', 'paket/website', 'paket/desain', 'paket/event', 'paket/katalog', 'paket/affiliate'].includes(id)
  }

  // ===== ICONS =====
  const icons = {
    overview: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 22V12h6v10" />
      </svg>
    ),
    users: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    hakAkses: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    reports: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    clients: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    invoices: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    portfolios: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    testimonials: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    finances: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    paket: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    website: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
      </svg>
    ),
    desain: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    event: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    katalog: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    affiliate: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  }

  // ===== MENU GROUPS =====
  // Manajemen User & Sistem (Sidebar cuman ada Users sama Hak Akses)
  const adminItems = [
    { id: 'users',     label: 'Users',     icon: icons.users },
    { id: 'hak-akses', label: 'Hak Akses', icon: icons.hakAkses },
    { id: 'reports',   label: 'Laporan',   icon: icons.reports },
  ]

  // Operasional (Klien & Invoice)
  const contentAdminItems = [
    { id: 'clients',   label: 'Klien',   icon: icons.clients },
    { id: 'invoices',  label: 'Invoice', icon: icons.invoices },
  ]

  // Sub-keuangan
  const financeItems = [
    { id: 'finances',          label: 'NexCube',  icon: icons.finances },
    { id: 'finances/printing', label: 'Printing', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
    ) },
  ]

  // Konten Showcase
  const contentSharedItems = [
    { id: 'portfolios',   label: 'Portfolio',   icon: icons.portfolios },
    { id: 'testimonials', label: 'Testimonial', icon: icons.testimonials },
  ]

  // Sub-paket
  const packageItems = [
    { id: 'paket/website',   label: 'Website',         icon: icons.website },
    { id: 'paket/desain',    label: 'Desain Grafis',   icon: icons.desain },
    { id: 'paket/event',     label: 'Event',           icon: icons.event },
    { id: 'paket/katalog',   label: 'Katalog Digital', icon: icons.katalog },
    { id: 'paket/affiliate', label: 'Paket Affiliate', icon: icons.affiliate },
  ]

  // Filter items according to permissions
  const visibleAdminItems = adminItems.filter(item => canAccess(item.id))
  const visibleFinanceItems = financeItems.filter(item => canAccess(item.id))
  const visibleContentAdminItems = contentAdminItems.filter(item => canAccess(item.id))
  const visibleContentSharedItems = contentSharedItems.filter(item => canAccess(item.id))
  const visiblePackageItems = packageItems.filter(item => canAccess(item.id))

  // ===== STATE =====
  const [financeOpen, setFinanceOpen] = useState(true)
  const [pkgOpen, setPkgOpen] = useState(true)

  const isFinanceActive = activeTab === 'finances' || activeTab.startsWith('finances/')
  const isPaketActive = activeTab?.startsWith('paket/')

  const handleNavigate = (id: string) => {
    const path = id === 'overview' ? '/dashboard' : `/dashboard/${id}`
    navigate(path)
    setOpen(false)
  }

  const handlePrefetchTab = (id: string) => {
    if (prefetchedTabs[id]) return
    const prefetcher = DASHBOARD_PREFETCHERS[id]
    if (!prefetcher) return

    setPrefetchedTabs((prev) => ({ ...prev, [id]: true }))
    prefetcher().catch(() => {
      setPrefetchedTabs((prev) => ({ ...prev, [id]: false }))
    })
  }

  const btnActive = 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-[1.02] font-semibold'
  const btnDefault = 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/80 hover:scale-[1.01] hover:translate-x-0.5 font-medium'
  const subBtnActive = 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-medium'
  const subBtnDefault = 'text-slate-500 hover:text-blue-600 hover:bg-blue-50/60 hover:scale-[1.01] hover:translate-x-1'

  // Role Badge Styling
  const getRoleBadge = () => {
    switch (userRole) {
      case 'admin':
        return {
          label: 'Administrator',
          badgeClass: 'bg-purple-50 text-purple-700 border-purple-200/60',
          dot: 'bg-purple-500',
        }
      case 'designer':
        return {
          label: 'Designer',
          badgeClass: 'bg-pink-50 text-pink-700 border-pink-200/60',
          dot: 'bg-pink-500',
        }
      case 'teknis':
        return {
          label: 'Teknis',
          badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200/60',
          dot: 'bg-cyan-500',
        }
      default:
        return {
          label: 'User',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
          dot: 'bg-emerald-500',
        }
    }
  }

  const roleBadge = getRoleBadge()

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm lg:hidden z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-40 ${theme === 'compact' ? 'w-52' : 'w-60'} bg-white border-r border-slate-200/80 text-slate-800 transform transition-all duration-300 ease-out shadow-xl lg:shadow-none ${
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="h-full flex flex-col bg-slate-50/40">

          {/* Logo */}
          <div className="px-5 py-5 border-b border-slate-100 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/images/NexCube-full.png"
                alt="NexCube"
                className="h-8 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-bold text-lg tracking-tight text-slate-900">
                NexCube
              </span>
            </Link>
          </div>

          {/* Role Badge */}
          <div className="px-5 pt-3 pb-1 flex-shrink-0">
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${roleBadge.badgeClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${roleBadge.dot}`} />
              {roleBadge.label}
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-4 space-y-3 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400 scroll-smooth">

            {/* Overview */}
            {canAccess('overview') && (
              <button
                onClick={() => handleNavigate('overview')}
                onMouseEnter={() => handlePrefetchTab('overview')}
                onFocus={() => handlePrefetchTab('overview')}
                className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                  activeTab === '' || activeTab === 'overview' ? btnActive : btnDefault
                }`}
              >
                <div className="transition-transform duration-300 group-hover:scale-110">{icons.overview}</div>
                <span className="font-medium text-sm">Overview</span>
              </button>
            )}

            {/* ── ADMIN / SISTEM (Users, Hak Akses, Laporan, Keuangan) ── */}
            {(visibleAdminItems.length > 0 || visibleFinanceItems.length > 0) && (
              <div>
                <SectionLabel label="Admin" />
                <div className="space-y-1">
                  {visibleAdminItems.map(item => (
                    <NavButton
                      key={item.id}
                      item={item}
                      active={activeTab === item.id}
                      activeClass={btnActive}
                      defaultClass={btnDefault}
                      onClick={() => handleNavigate(item.id)}
                      onPrefetch={() => handlePrefetchTab(item.id)}
                    />
                  ))}

                  {/* ── KEUANGAN ACCORDION ── */}
                  {visibleFinanceItems.length > 0 && (
                    <div>
                      <button
                        onClick={() => setFinanceOpen(!financeOpen)}
                        onMouseEnter={() => handlePrefetchTab('finances')}
                        onFocus={() => handlePrefetchTab('finances')}
                        className={`group w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                          isFinanceActive ? btnActive : btnDefault
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="transition-transform duration-300 group-hover:scale-110">{icons.finances}</div>
                          <span className="font-medium text-sm">Keuangan</span>
                        </div>
                        <svg className={`w-4 h-4 transition-transform duration-300 ${financeOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      {financeOpen && (
                        <div className="pl-4 space-y-1 mt-1 border-l-2 border-slate-200 ml-3">
                          {visibleFinanceItems.map(item => (
                            <NavButton
                              key={item.id}
                              item={item}
                              active={activeTab === item.id || (item.id === 'finances' && activeTab === 'finances/formfinance') || (item.id === 'finances/printing' && activeTab === 'finances/printing/form')}
                              activeClass={subBtnActive}
                              defaultClass={subBtnDefault}
                              onClick={() => handleNavigate(item.id)}
                              onPrefetch={() => handlePrefetchTab(item.id)}
                              small
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── KONTEN & OPERASIONAL ── */}
            {(visibleContentAdminItems.length > 0 || visibleContentSharedItems.length > 0) && (
              <div>
                <SectionLabel label="Konten" />
                <div className="space-y-1">
                  {visibleContentAdminItems.map(item => (
                    <NavButton
                      key={item.id}
                      item={item}
                      active={activeTab === item.id}
                      activeClass={btnActive}
                      defaultClass={btnDefault}
                      onClick={() => handleNavigate(item.id)}
                      onPrefetch={() => handlePrefetchTab(item.id)}
                    />
                  ))}

                  {visibleContentSharedItems.map(item => (
                    <NavButton
                      key={item.id}
                      item={item}
                      active={activeTab === item.id}
                      activeClass={btnActive}
                      defaultClass={btnDefault}
                      onClick={() => handleNavigate(item.id)}
                      onPrefetch={() => handlePrefetchTab(item.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── PAKET (Termasuk Paket Affiliate) ── */}
            {visiblePackageItems.length > 0 && (
              <div>
                <SectionLabel label="Paket" />
                <div className="space-y-1">
                  <button
                    onClick={() => setPkgOpen(!pkgOpen)}
                    onMouseEnter={() => handlePrefetchTab('paket/website')}
                    onFocus={() => handlePrefetchTab('paket/website')}
                    className={`group w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                      isPaketActive ? btnActive : btnDefault
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="transition-transform duration-300 group-hover:scale-110">{icons.paket}</div>
                      <span className="font-medium text-sm">Paket</span>
                    </div>
                    <svg className={`w-4 h-4 transition-transform duration-300 ${pkgOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {pkgOpen && (
                    <div className="pl-4 space-y-1 mt-1 border-l-2 border-slate-200 ml-3">
                      {visiblePackageItems.map(item => (
                        <NavButton
                          key={item.id}
                          item={item}
                          active={activeTab === item.id}
                          activeClass={subBtnActive}
                          defaultClass={subBtnDefault}
                          onClick={() => handleNavigate(item.id)}
                          onPrefetch={() => handlePrefetchTab(item.id)}
                          small
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </nav>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-slate-100 text-center flex-shrink-0">
            <p className="text-slate-400 text-[10px] font-medium tracking-wide">© 2026 NexCube Digital</p>
          </div>

        </div>
      </div>
    </>
  )
}

// ===== SUB-COMPONENTS =====

const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider px-3 mb-2 mt-2 flex items-center gap-2">
    <div className="h-px flex-1 bg-slate-200"></div>
    <span>{label}</span>
  </div>
)

interface NavButtonProps {
  item: { id: string; label: string; icon: React.ReactNode }
  active: boolean
  activeClass: string
  defaultClass: string
  onClick: () => void
  onPrefetch?: () => void
  small?: boolean
}

const NavButton: React.FC<NavButtonProps> = ({ item, active, activeClass, defaultClass, onClick, onPrefetch, small }) => (
  <button
    onClick={onClick}
    onMouseEnter={onPrefetch}
    onFocus={onPrefetch}
    className={`group w-full flex items-center gap-3 px-3 ${small ? 'py-2' : 'py-2.5'} rounded-lg transition-all duration-300 ${active ? activeClass : defaultClass}`}
  >
    <div className={`transition-transform duration-300 group-hover:scale-110 ${small ? 'w-4 h-4 flex items-center justify-center' : ''}`}>
      {item.icon}
    </div>
    <span className={`font-medium ${small ? 'text-xs' : 'text-sm'}`}>{item.label}</span>
  </button>
)

export default DashboardSidebar