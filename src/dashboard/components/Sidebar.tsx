import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiClient from '../../services/api'
import { useTheme } from '../ThemeContext'

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
  activeTab: string
}

export const DashboardSidebar: React.FC<SidebarProps> = ({ 
  open, 
  setOpen, 
  activeTab
}) => {
  const navigate = useNavigate()
  const { theme } = useTheme()

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 16l4-4m0 0l4 4m-4-4V5" />
        </svg>
      )
    },
    {
      id: 'team',
      label: 'Tim',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11c1.657 0 3-1.343 3-3S17.657 5 16 5s-3 1.343-3 3 1.343 3 3 3zM8 11c1.657 0 3-1.343 3-3S9.657 5 8 5 5 6.343 5 8s1.343 3 3 3zM8 13c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.98.05 1.16.84 1.98 1.98 1.98 3.45V19h6v-2.5C23 14.17 18.33 13 16 13z" />
        </svg>
      )
    },
    {
      id: 'clients',
      label: 'Klien',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3a6 6 0 0 1 6-6h6a6 6 0 0 1 6 6M21 21h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1z" />
        </svg>
      )
    },
    {
      id: 'invoices',
      label: 'Invoice',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'finances',
      label: 'Keuangan',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'reports',
      label: 'Laporan',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ]

  // Split menu into Admin Management and Content Management
  const adminItems = [
    menuItems[1], // team
    menuItems[5], // reports
  ]

  const contentItems = [
    menuItems[2], // clients
    menuItems[3], // invoices
    menuItems[4], // finances
  ]

  const packageItems = [
    {
      id: 'paket/website',
      label: 'Website',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3 6 6 .5-4.5 4 1 6L12 16l-5.5 3.5 1-6L3 8.5 9 8 12 2z" />
        </svg>
      )
    },
    {
      id: 'paket/desain',
      label: 'Desain Grafis',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21l18-18M7 7l10 10" />
        </svg>
      )
    },
    {
      id: 'paket/event',
      label: 'Event',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16v11a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11a3 3 0 100 6 3 3 0 000-6z" />
        </svg>
      )
    },
    {
      id: 'paket/katalog',
      label: 'Katalog Digital',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )
    }
  ]

  const [pkgOpen, setPkgOpen] = useState(true)

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('authToken')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('savedEmail')
    localStorage.removeItem('savedPassword')
    
    // Clear apiClient token
    apiClient.setToken(null)
    
    // Redirect to login
    navigate('/login')
  }

  return (
    <>
      {/* Sidebar Overlay - Mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-40 ${theme === 'compact' ? 'w-52' : 'w-60'} ${theme === 'minimal' ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'} text-white transform transition-all duration-300 ease-out shadow-2xl ${
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="h-full flex flex-col bg-gradient-to-br from-slate-950/50 to-transparent backdrop-blur-xl">
          {/* Logo */}
          <div className="px-4 py-5 border-b border-white/5 flex-shrink-0 backdrop-blur-sm">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img 
                src="/images/NexCube-full.png" 
                alt="NexCube" 
                className="h-8 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">NexCube</span>
            </Link>
          </div>

          {/* Menu Items with Custom Scrollbar */}
          <nav className="flex-1 px-3 py-4 space-y-3 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-700/50 scrollbar-track-transparent hover:scrollbar-thumb-slate-600 scroll-smooth">
            {/* Overview */}
            <div>
              <button
                onClick={() => {
                  navigate('/dashboard')
                  setOpen(false)
                }}
                className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                  (activeTab === '' || activeTab === 'overview')
                    ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 hover:scale-[1.01]'
                }`}
              >
                <div className="transition-transform duration-300 group-hover:scale-110">
                  {menuItems[0].icon}
                </div>
                <span className="font-medium text-sm">{menuItems[0].label}</span>
              </button>
            </div>

            {/* Admin Management */}
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider px-3 mb-2 mt-1 flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-slate-700 to-transparent"></div>
                <span>Admin</span>
              </div>
              <div className="space-y-1">
                {adminItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      const path = item.id === 'overview' ? '/dashboard' : `/dashboard/${item.id}`
                      navigate(path)
                      setOpen(false)
                    }}
                    className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5 hover:scale-[1.01] hover:translate-x-0.5'
                    }`}
                  >
                    <div className="transition-transform duration-300 group-hover:scale-110">
                      {item.icon}
                    </div>
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Management */}
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider px-3 mb-2 mt-1 flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-slate-700 to-transparent"></div>
                <span>Konten</span>
              </div>
              <div className="space-y-1">
                {contentItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      const path = item.id === 'overview' ? '/dashboard' : `/dashboard/${item.id}`
                      navigate(path)
                      setOpen(false)
                    }}
                    className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5 hover:scale-[1.01] hover:translate-x-0.5'
                    }`}
                  >
                    <div className="transition-transform duration-300 group-hover:scale-110">
                      {item.icon}
                    </div>
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Package Management */}
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider px-3 mb-2 mt-1 flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-slate-700 to-transparent"></div>
                <span>Paket</span>
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setPkgOpen(!pkgOpen)}
                  className={`group w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                    activeTab === 'paket' || activeTab?.startsWith('paket/')
                      ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="transition-transform duration-300 group-hover:scale-110">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <span className="font-medium text-sm">Paket</span>
                  </div>
                  <svg className={`w-4 h-4 transition-transform duration-300 ${pkgOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {pkgOpen && (
                  <div className="pl-4 space-y-1 mt-1 border-l-2 border-slate-800/50 ml-3">
                    {packageItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          const path = item.id === 'overview' ? '/dashboard' : `/dashboard/${item.id}`
                          navigate(path)
                          setOpen(false)
                        }}
                        className={`group w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-300 ${
                          activeTab === item.id
                            ? 'bg-gradient-to-r from-blue-600/90 via-blue-500/90 to-indigo-600/90 text-white shadow-md shadow-blue-500/20 scale-[1.01]'
                            : 'text-slate-500 hover:text-white hover:bg-white/5 hover:scale-[1.01] hover:translate-x-1'
                        }`}
                      >
                        <div className="transition-transform duration-300 group-hover:scale-110 w-4 h-4 flex items-center justify-center">
                          {item.icon}
                        </div>
                        <span className="font-medium text-xs">{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </nav>
          
          {/* Footer - Fixed at bottom */}
          <div className="px-4 py-3 border-t border-white/5 text-center flex-shrink-0 backdrop-blur-sm">
            <p className="text-slate-500 text-[10px] font-medium tracking-wide">
              © 2025 NexCube
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardSidebar
