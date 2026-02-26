import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiClient from '../../services/api'
import { useTheme } from '../ThemeContext'

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
  activeTab: string
  userRole?: 'admin' | 'user'  // ← tambah prop role
}

export const DashboardSidebar: React.FC<SidebarProps> = ({ 
  open, 
  setOpen, 
  activeTab,
  userRole = 'user'  // default user agar aman
}) => {
  const navigate = useNavigate()
  const { theme } = useTheme()

  const isAdmin = userRole === 'admin'

  // ===== ICONS =====
  const icons = {
    overview: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 22V12h6v10" />
      </svg>
    ),
    team: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    users: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
  // Admin only
  const adminItems = [
    { id: 'team',    label: 'Tim',     icon: icons.team    },
    { id: 'users',   label: 'User',    icon: icons.users   },
    { id: 'reports', label: 'Laporan', icon: icons.reports  },
  ]

  // Admin only (konten sensitif)
  const contentAdminItems = [
    { id: 'clients',   label: 'Klien',   icon: icons.clients   },
    { id: 'invoices',  label: 'Invoice', icon: icons.invoices  },
    { id: 'finances',  label: 'Keuangan', icon: icons.finances },
  ]

  // Tersedia untuk semua (termasuk user)
  const contentSharedItems = [
    { id: 'portfolios',   label: 'Portfolio',   icon: icons.portfolios   },
    { id: 'testimonials', label: 'Testimonial', icon: icons.testimonials },
  ]

  // Sub-paket — tersedia semua role
  const packageItems = [
    { id: 'paket/website', label: 'Website',         icon: icons.website  },
    { id: 'paket/desain',  label: 'Desain Grafis',   icon: icons.desain   },
    { id: 'paket/event',   label: 'Event',           icon: icons.event    },
    { id: 'paket/katalog', label: 'Katalog Digital', icon: icons.katalog  },
  ]

  const affiliateItems = [
    { id: 'paket/affiliate', label: 'Paket Affiliate', icon: icons.affiliate },
  ]

  // ===== STATE =====
  const [pkgOpen, setPkgOpen] = useState(true)
  const [affiliateOpen, setAffiliateOpen] = useState(true)

  const isPaketActive = activeTab?.startsWith('paket/') && activeTab !== 'paket/affiliate'
  const isAffiliateActive = activeTab === 'paket/affiliate'

  const handleNavigate = (id: string) => {
    const path = id === 'overview' ? '/dashboard' : `/dashboard/${id}`
    navigate(path)
    setOpen(false)
  }

  const btnActive = 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
  const btnDefault = 'text-slate-400 hover:text-white hover:bg-white/5 hover:scale-[1.01] hover:translate-x-0.5'
  const subBtnActive = 'bg-gradient-to-r from-blue-600/90 via-blue-500/90 to-indigo-600/90 text-white shadow-md shadow-blue-500/20 scale-[1.01]'
  const subBtnDefault = 'text-slate-500 hover:text-white hover:bg-white/5 hover:scale-[1.01] hover:translate-x-1'

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-40 ${theme === 'compact' ? 'w-52' : 'w-60'} ${
        theme === 'minimal' ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
      } text-white transform transition-all duration-300 ease-out shadow-2xl ${
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="h-full flex flex-col bg-gradient-to-br from-slate-950/50 to-transparent backdrop-blur-xl">

          {/* Logo */}
          <div className="px-4 py-5 border-b border-white/5 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/images/NexCube-full.png"
                alt="NexCube"
                className="h-8 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                NexCube
              </span>
            </Link>
          </div>

          {/* Role Badge */}
          <div className="px-4 pt-3 pb-1 flex-shrink-0">
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
              isAdmin
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-blue-400' : 'bg-emerald-400'}`} />
              {isAdmin ? 'Administrator' : 'User'}
            </span>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-3 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-700/50 scrollbar-track-transparent hover:scrollbar-thumb-slate-600 scroll-smooth">

            {/* Overview — semua role */}
            <button
              onClick={() => handleNavigate('overview')}
              className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                activeTab === '' || activeTab === 'overview' ? btnActive : btnDefault
              }`}
            >
              <div className="transition-transform duration-300 group-hover:scale-110">{icons.overview}</div>
              <span className="font-medium text-sm">Overview</span>
            </button>

            {/* ── ADMIN ONLY: Seksi Admin ── */}
            {isAdmin && (
              <div>
                <SectionLabel label="Admin" />
                <div className="space-y-1">
                  {adminItems.map(item => (
                    <NavButton
                      key={item.id}
                      item={item}
                      active={activeTab === item.id}
                      activeClass={btnActive}
                      defaultClass={btnDefault}
                      onClick={() => handleNavigate(item.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── KONTEN ── */}
            <div>
              <SectionLabel label="Konten" />
              <div className="space-y-1">
                {/* Admin-only content items */}
                {isAdmin && contentAdminItems.map(item => (
                  <NavButton
                    key={item.id}
                    item={item}
                    active={activeTab === item.id}
                    activeClass={btnActive}
                    defaultClass={btnDefault}
                    onClick={() => handleNavigate(item.id)}
                  />
                ))}
                {/* Shared content items (semua role) */}
                {contentSharedItems.map(item => (
                  <NavButton
                    key={item.id}
                    item={item}
                    active={activeTab === item.id}
                    activeClass={btnActive}
                    defaultClass={btnDefault}
                    onClick={() => handleNavigate(item.id)}
                  />
                ))}
              </div>
            </div>

            {/* ── PAKET — semua role ── */}
            <div>
              <SectionLabel label="Paket" />
              <div className="space-y-1">
                <button
                  onClick={() => setPkgOpen(!pkgOpen)}
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
                  <div className="pl-4 space-y-1 mt-1 border-l-2 border-slate-800/50 ml-3">
                    {packageItems.map(item => (
                      <NavButton
                        key={item.id}
                        item={item}
                        active={activeTab === item.id}
                        activeClass={subBtnActive}
                        defaultClass={subBtnDefault}
                        onClick={() => handleNavigate(item.id)}
                        small
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── AFFILIATE — semua role ── */}
            <div>
              <SectionLabel label="Affiliate" />
              <div className="space-y-1">
                <button
                  onClick={() => setAffiliateOpen(!affiliateOpen)}
                  className={`group w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                    isAffiliateActive ? btnActive : btnDefault
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="transition-transform duration-300 group-hover:scale-110">{icons.affiliate}</div>
                    <span className="font-medium text-sm">Affiliate</span>
                  </div>
                  <svg className={`w-4 h-4 transition-transform duration-300 ${affiliateOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {affiliateOpen && (
                  <div className="pl-4 space-y-1 mt-1 border-l-2 border-slate-800/50 ml-3">
                    {affiliateItems.map(item => (
                      <NavButton
                        key={item.id}
                        item={item}
                        active={activeTab === item.id}
                        activeClass={subBtnActive}
                        defaultClass={subBtnDefault}
                        onClick={() => handleNavigate(item.id)}
                        small
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

          </nav>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/5 text-center flex-shrink-0">
            <p className="text-slate-500 text-[10px] font-medium tracking-wide">© 2025 NexCube</p>
          </div>

        </div>
      </div>
    </>
  )
}

// ===== SUB-COMPONENTS =====

const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider px-3 mb-2 mt-1 flex items-center gap-2">
    <div className="h-px flex-1 bg-gradient-to-r from-slate-700 to-transparent"></div>
    <span>{label}</span>
  </div>
)

interface NavButtonProps {
  item: { id: string; label: string; icon: React.ReactNode }
  active: boolean
  activeClass: string
  defaultClass: string
  onClick: () => void
  small?: boolean
}

const NavButton: React.FC<NavButtonProps> = ({ item, active, activeClass, defaultClass, onClick, small }) => (
  <button
    onClick={onClick}
    className={`group w-full flex items-center gap-3 px-3 ${small ? 'py-2' : 'py-2.5'} rounded-lg transition-all duration-300 ${active ? activeClass : defaultClass}`}
  >
    <div className={`transition-transform duration-300 group-hover:scale-110 ${small ? 'w-4 h-4 flex items-center justify-center' : ''}`}>
      {item.icon}
    </div>
    <span className={`font-medium ${small ? 'text-xs' : 'text-sm'}`}>{item.label}</span>
  </button>
)

export default DashboardSidebar