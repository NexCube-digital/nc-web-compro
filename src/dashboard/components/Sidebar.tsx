import React from 'react'
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
      <div className={`fixed lg:static inset-y-0 left-0 z-40 ${theme === 'compact' ? 'w-56' : 'w-64'} ${theme === 'minimal' ? 'bg-slate-900' : 'bg-gradient-to-b from-slate-900 to-slate-800'} text-white transform transition-transform duration-300 ${
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/images/NexCube-full.png" 
                alt="NexCube" 
                className="h-10 w-auto"
              />
              <span className="font-bold text-lg hidden sm:inline">NexCube</span>
            </Link>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-4 py-6 space-y-4">
            {/* Overview */}
            <div>
              <button
                onClick={() => {
                  navigate('/dashboard')
                  setOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  (activeTab === '' || activeTab === 'overview')
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {menuItems[0].icon}
                <span className="font-semibold">{menuItems[0].label}</span>
              </button>
            </div>

            {/* Admin Management */}
            <div>
              <div className="text-xs text-slate-300 uppercase font-semibold px-2 mb-2">Manajemen Admin</div>
              <div className="space-y-2">
                {adminItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      const path = item.id === 'overview' ? '/dashboard' : `/dashboard/${item.id}`
                      navigate(path)
                      setOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 ${theme === 'compact' ? 'py-2 text-sm' : 'py-3'} rounded-xl transition-all duration-200 ${
                      activeTab === item.id
                        ? (theme === 'minimal' ? 'bg-slate-700 text-white shadow' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg')
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.icon}
                    <span className="font-semibold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Management */}
            <div>
              <div className="text-xs text-slate-300 uppercase font-semibold px-2 mb-2">Manajemen Konten</div>
              <div className="space-y-2">
                {contentItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      const path = item.id === 'overview' ? '/dashboard' : `/dashboard/${item.id}`
                      navigate(path)
                      setOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.icon}
                    <span className="font-semibold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Package Management */}
            <div>
              <div className="text-xs text-slate-300 uppercase font-semibold px-2 mb-2">Manajemen Paket</div>
              <div className="space-y-2">
                {packageItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      const path = item.id === 'overview' ? '/dashboard' : `/dashboard/${item.id}`
                      navigate(path)
                      setOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.icon}
                    <span className="font-semibold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>
          <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            © 2025 NexCube Digital.
          </p>
        </div>
        </div>
      </div>
    </>
  )
}

export default DashboardSidebar
