import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import gsap from 'gsap'
import DashboardSidebar from './components/Sidebar'
import DashboardHeader from './components/Header'
import DashboardStats from './components/Stats'
import { ThemeProvider } from './ThemeContext'
import TopProgress from './components/TopProgress'
import UserManagement from './pages/UserManagement'
import PortfolioManagement from './pages/PortfolioManagement'
import ClientManagement from './pages/ClientManagement'
import InvoiceManagement from './pages/InvoiceManagement'
import FinanceManagement from './pages/FinanceManagement'
import ReportManagement from './pages/ReportManagement'
import ProfilePage from './pages/ProfilePage'
import TeamManagement from './pages/TeamManagement'
import PackageManagement from './pages/PackageManagement'
import PackageForm from './pages/PackageForm'
import AffiliateManagement from './pages/AffiliateManagement'
import AffiliateForm from './pages/AffiliateForm'
import TestimonialManagement from './pages/TestimonialManagement'

import apiClient, { User } from '../services/api'

// Halaman yang TIDAK boleh di-scroll (fit to screen)
const NO_SCROLL_TABS = ['overview']

// Tab yang hanya boleh diakses admin
const ADMIN_ONLY_TABS = [
  'team',
  'users',
  'reports',
  'clients',
  'clients/formclient',
  'invoices',
  'invoices/forminvoice',
  'finances',
  'finances/formfinance',
]

export const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const contentRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLElement>(null)

  // Get active tab from URL path
  const getActiveTab = () => {
    const path = location.pathname.split('/dashboard/')[1] || ''
    return path || 'overview'
  }

  const activeTab = getActiveTab()
  const isNoScroll = NO_SCROLL_TABS.includes(activeTab)
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token')
      
      if (!token) {
        navigate('/login')
        return
      }

      try {
        apiClient.setToken(token)
        
        const response = await apiClient.getProfile()
        if (response.success && response.data) {
          const userData = response.data
          setUser(userData)
          localStorage.setItem('user', JSON.stringify(userData))
        } else {
          localStorage.removeItem('authToken')
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('authToken')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [navigate])

  // Redirect user biasa jika mencoba akses halaman admin
  useEffect(() => {
    if (!loading && user && user.role !== 'admin') {
      const isRestricted = ADMIN_ONLY_TABS.some(
        t => activeTab === t || activeTab.startsWith(t + '/')
      )
      if (isRestricted) {
        navigate('/dashboard', { replace: true })
      }
    }
  }, [activeTab, user, loading, navigate])

  // Animate content when activeTab changes
  useEffect(() => {
    if (mainRef.current && !loading) {
      gsap.to(mainRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.2,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.to(mainRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out'
          })
        }
      })
    }
  }, [activeTab, loading])

  // Helper: nama tampilan user (sesuaikan field dengan tipe User kamu)
  const displayName = (user as any)?.name || (user as any)?.fullName || (user as any)?.username || ''

  const renderContent = () => {
    // Guard: user biasa tidak bisa render halaman admin
    const isRestricted = ADMIN_ONLY_TABS.some(
      t => activeTab === t || activeTab.startsWith(t + '/')
    )
    if (!isAdmin && isRestricted) {
      return <DashboardStats userRole={user?.role} userName={displayName} />
    }

    switch (activeTab) {
      case 'overview':
        return <DashboardStats userRole={user?.role} userName={displayName} />
      case 'paket':
      case 'paket/website':
      case 'paket/desain':
      case 'paket/event':
      case 'paket/katalog':
        return <PackageManagement />
      case 'paket/form':
      case 'paket/formpaket':
        return <PackageForm />
      case 'paket/affiliate':
        return <AffiliateManagement />
      case 'paket/formaffiliate':
        return <AffiliateForm />
      case 'team':
        return <TeamManagement />
      case 'clients':
      case 'clients/formclient':
        return <ClientManagement />
      case 'users':
      case 'users/formuser':
        return <UserManagement />
      case 'portfolios':
      case 'portfolios/formportfolio':
        return <PortfolioManagement />
      case 'testimonials':
      case 'testimonials/formtestimonial':
        return <TestimonialManagement />
      case 'invoices':
      case 'invoices/forminvoice':
        return <InvoiceManagement />
      case 'finances':
      case 'finances/formfinance':
        return <FinanceManagement />
      case 'reports':
        return <ReportManagement />
      case 'profile':
        return <ProfilePage />
      default:
        return <DashboardStats userRole={user?.role} userName={displayName} />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <ThemeProvider>
      <TopProgress />
      <Helmet>
        <title>Dashboard - NexCube Digital Admin</title>
        <meta name="description" content="Dashboard admin NexCube Digital untuk mengelola klien, invoice, keuangan, dan laporan" />
      </Helmet>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          activeTab={activeTab}
          userRole={user.role}
        />

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col ${isNoScroll ? 'overflow-hidden' : 'overflow-auto'}`}
          ref={contentRef}
        >
          <DashboardHeader
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            user={user}
          />

          <main
            className={`p-3 sm:p-4 lg:p-6 flex-1 ${isNoScroll ? 'overflow-hidden' : ''}`}
            ref={mainRef}
          >
            {renderContent()}
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default Dashboard