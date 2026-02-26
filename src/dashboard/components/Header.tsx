import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient, { User, getImageUrl } from '../../services/api'
import { useTheme } from '../ThemeContext'
import { ActivityHistoryModal } from './ActivityHistoryModal'

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
  const [showActivityHistory, setShowActivityHistory] = useState(false)
  const [hasUnreadActivity, setHasUnreadActivity] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkUnreadActivities = async () => {
      try {
        const response = await apiClient.getActivities(1)
        if (response && response.data && (response.data as any).items?.length > 0) {
          const latestTimestamp = (response.data as any).items[0].createdAt
          const lastSeen = localStorage.getItem('lastSeenActivity')
          if (!lastSeen || new Date(latestTimestamp) > new Date(lastSeen)) {
            setHasUnreadActivity(true)
          }
        }
      } catch (error) {
        // Silently fail for unread check
      }
    }

    checkUnreadActivities()

    // Listen for manual "Mark as Read" from modal
    const handleManualRead = () => setHasUnreadActivity(false);
    window.addEventListener('activityRead', handleManualRead);

    // Poll every 2 minutes
    const interval = setInterval(checkUnreadActivities, 2 * 60 * 1000)
    return () => {
      clearInterval(interval);
      window.removeEventListener('activityRead', handleManualRead);
    }
  }, [])

  const handleOpenActivities = () => {
    setShowActivityHistory(true)
    setHasUnreadActivity(false)
    localStorage.setItem('lastSeenActivity', new Date().toISOString())
  }

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

  const headerClass = `px-3 sm:px-4 lg:px-6 ${theme === 'compact' ? 'py-2' : 'py-3'} flex items-center justify-between sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-sm`

  return (
    <header className={headerClass}>
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-all duration-300 hover:scale-105 ring-1 ring-slate-200/50 hover:ring-blue-500/30 hover:shadow-md"
        >
          <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h1 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-[10px] sm:text-xs text-slate-600 hidden sm:block">Selamat datang, <span className="font-semibold text-blue-600">{user?.name}</span></p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">

        {/* Theme Selector */}
        <div className="hidden sm:flex items-center gap-1.5 bg-white/80 backdrop-blur-sm p-1 rounded-lg border border-slate-200/50 shadow-sm">
          <button
            title="Modern"
            onClick={() => setTheme('modern')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all duration-300 ${theme === 'modern' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 scale-105' : 'text-slate-600 hover:bg-slate-100 hover:scale-105'}`}
          >M</button>
          <button
            title="Minimal"
            onClick={() => setTheme('minimal')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all duration-300 ${theme === 'minimal' ? 'bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-md shadow-slate-500/30 scale-105' : 'text-slate-600 hover:bg-slate-100 hover:scale-105'}`}
          >Min</button>
          <button
            title="Compact"
            onClick={() => setTheme('compact')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all duration-300 ${theme === 'compact' ? 'bg-gradient-to-r from-slate-800 to-slate-950 text-white shadow-md shadow-slate-500/30 scale-105' : 'text-slate-600 hover:bg-slate-100 hover:scale-105'}`}
          >C</button>
        </div>

        {/* Notifications */}
        <button
          onClick={handleOpenActivities}
          className="relative p-2 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-all duration-300 hover:scale-105 ring-1 ring-slate-200/50 hover:ring-blue-500/30 hover:shadow-md group"
          title="Riwayat Kegiatan"
        >
          <svg className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {hasUnreadActivity && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-br from-red-500 to-pink-600 rounded-full shadow-lg shadow-red-500/50 animate-pulse"></span>
          )}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 sm:gap-2.5 px-2 sm:px-2.5 py-1.5 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-all duration-300 group ring-1 ring-slate-200/50 hover:ring-blue-500/30 hover:shadow-md hover:scale-[1.02]"
          >
            <div className={`text-right hidden sm:block ${theme === 'compact' ? 'text-sm' : ''}`}>
              <p className="font-semibold text-xs text-slate-900 group-hover:text-blue-600 truncate max-w-[100px] transition-colors">
                {user?.name || 'User'}
              </p>
              <p className="text-[10px] text-slate-500">{formatRole(user?.role)}</p>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-110 text-xs flex-shrink-0">
              {user?.photo ? (
                <img src={getImageUrl(user.photo)} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                getInitials(user?.name)
              )}
            </div>
            <svg className={`hidden sm:block w-3.5 h-3.5 text-slate-600 group-hover:text-blue-600 transition-all duration-300 flex-shrink-0 ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm"
                onClick={() => setShowProfileMenu(false)}
              />

              {/* Menu */}
              <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-slate-900/10 border border-slate-200/50 overflow-hidden z-40 animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-slate-200/50">

                {/* User Info Section */}
                <div className="p-3 bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80 backdrop-blur-sm border-b border-slate-200/50">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/30 flex-shrink-0">
                      {user?.photo ? (
                        <img src={getImageUrl(user.photo)} alt={user?.name} className="w-full h-full object-cover" />
                      ) : (
                        getInitials(user?.name)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate text-xs">{user?.name || 'User'}</p>
                      <p className="text-[10px] text-slate-600 truncate">{user?.email || 'user@example.com'}</p>
                      {user?.id && (
                        <p className="text-[10px] text-slate-500 mt-0.5">ID: {user.id}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-1.5 text-[10px]">
                    <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full font-semibold border border-blue-200/50">
                      {formatRole(user?.role)}
                    </span>
                    <span className={`px-2 py-1 rounded-full font-semibold whitespace-nowrap border ${user?.isActive ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200/50' : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-200/50'}`}>
                      {user?.isActive ? '● Active' : '● Inactive'}
                    </span>
                  </div>
                  {user?.createdAt && (
                    <p className="text-[10px] text-slate-500 mt-2">
                      Bergabung: {new Date(user.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  )}
                </div>

                {/* Menu Items */}
                <div className="py-1.5">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false)
                      navigate('/dashboard/profile')
                    }}
                    className="w-full px-3 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 text-xs group hover:translate-x-0.5"
                  >
                    <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-600 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="group-hover:font-semibold transition-all">Profile Saya</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false)
                      navigate('/dashboard/settings')
                    }}
                    className="w-full px-3 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 text-xs group hover:translate-x-0.5"
                  >
                    <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-600 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="group-hover:font-semibold transition-all">Pengaturan</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false)
                      navigate('/dashboard/help')
                    }}
                    className="w-full px-3 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 text-xs group hover:translate-x-0.5"
                  >
                    <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-600 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="group-hover:font-semibold transition-all">Bantuan</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-200/50 mx-2"></div>

                {/* Logout Button */}
                <div className="p-1.5">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false)
                      handleLogout()
                    }}
                    className="w-full px-3 py-2 flex items-center gap-2.5 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300 text-xs font-semibold rounded-lg group hover:shadow-md hover:shadow-red-500/10 hover:scale-[1.02]"
                  >
                    <svg className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Activity History Modal */}
      <ActivityHistoryModal
        isOpen={showActivityHistory}
        onClose={() => setShowActivityHistory(false)}
        onOpen={() => setHasUnreadActivity(false)}
      />
    </header>
  )
}

export default DashboardHeader
