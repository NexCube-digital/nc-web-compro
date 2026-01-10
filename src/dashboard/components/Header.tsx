import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient, { User } from '../../services/api'
import { useTheme } from '../ThemeContext'

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  user: User | null
}

export const DashboardHeader: React.FC<HeaderProps> = ({ 
  sidebarOpen, 
  setSidebarOpen,
  user
}) => {
  const { theme, setTheme } = useTheme()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const navigate = useNavigate()

  React.useEffect(() => {
    if (user) {
      console.log('Header user data:', {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      })
    }
  }, [user])

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

  // Get user initials
  const getInitials = (name?: string): string => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Format role
  const formatRole = (role?: string): string => {
    if (!role) return 'user'
    return role.charAt(0).toUpperCase() + role.slice(1)
  }

  const headerClass = `px-6 ${theme === 'compact' ? 'py-2' : 'py-4'} flex items-center justify-between sticky top-0 z-20 bg-white border-b border-slate-200`

  return (
    <header className={headerClass}>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-600">Selamat datang kembali, {user?.name}</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari..."
            className="bg-transparent outline-none text-sm w-48"
          />
        </div>

        {/* Theme Selector */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            title="Modern"
            onClick={() => setTheme('modern')}
            className={`px-2 py-1 rounded-md ${theme === 'modern' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
          >M</button>
          <button
            title="Minimal"
            onClick={() => setTheme('minimal')}
            className={`px-2 py-1 rounded-md ${theme === 'minimal' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}
          >Min</button>
          <button
            title="Compact"
            onClick={() => setTheme('compact')}
            className={`px-2 py-1 rounded-md ${theme === 'compact' ? 'bg-slate-700 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >C</button>
        </div>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 rounded-xl transition-all duration-200 group"
          >
            <div className={`text-right hidden sm:block ${theme === 'compact' ? 'text-sm' : ''}`}>
              <p className="font-semibold text-sm text-slate-900 group-hover:text-slate-700 truncate max-w-[120px]">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-slate-500">{formatRole(user?.role)}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-shadow text-sm">
              {getInitials(user?.name)}
            </div>
            <svg className={`w-4 h-4 text-slate-600 transition-transform duration-300 flex-shrink-0 ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowProfileMenu(false)}
              />
              
              {/* Menu */}
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                
                {/* User Info Section */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                      {getInitials(user?.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate text-sm">{user?.name || 'User'}</p>
                      <p className="text-xs text-slate-600 truncate">{user?.email || 'user@example.com'}</p>
                      {user?.id && (
                        <p className="text-xs text-slate-500 mt-1">ID: {user.id}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                      {formatRole(user?.role)}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap ${user?.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user?.isActive ? '● Active' : '● Inactive'}
                    </span>
                  </div>
                  {user?.createdAt && (
                    <p className="text-xs text-slate-500 mt-2">
                      Bergabung: {new Date(user.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  )}
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false)
                      navigate('/dashboard/profile')
                    }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-slate-700 hover:bg-slate-100 transition-colors text-sm"
                  >
                    <svg className="w-5 h-5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profile Saya</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false)
                      navigate('/dashboard/settings')
                    }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-slate-700 hover:bg-slate-100 transition-colors text-sm"
                  >
                    <svg className="w-5 h-5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Pengaturan</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false)
                      navigate('/dashboard/help')
                    }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-slate-700 hover:bg-slate-100 transition-colors text-sm"
                  >
                    <svg className="w-5 h-5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Bantuan</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-200"></div>

                {/* Logout Button */}
                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false)
                      handleLogout()
                    }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors text-sm font-semibold rounded-lg"
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
