import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import DashboardSidebar from './components/Sidebar'
import DashboardHeader from './components/Header'
import DashboardStats from './components/Stats'
import ClientManagement from './pages/ClientManagement'
import InvoiceManagement from './pages/InvoiceManagement'
import FinanceManagement from './pages/FinanceManagement'
import ReportManagement from './pages/ReportManagement'
import ProfilePage from './pages/ProfilePage'
import TeamManagement from './pages/TeamManagement'
import PackageManagement from './pages/PackageManagement'
import PackageForm from './pages/PackageForm'
import apiClient, { User } from '../services/api'

export const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  // Get active tab from URL path
  const getActiveTab = () => {
    const path = location.pathname.split('/dashboard/')[1] || ''
    return path || 'overview'
  }

  const activeTab = getActiveTab()

  useEffect(() => {
    const checkAuth = async () => {
      // Check for token (support both keys)
      const token = localStorage.getItem('authToken') || localStorage.getItem('token')
      
      if (!token) {
        navigate('/login')
        return
      }

      try {
        // Set token in apiClient
        apiClient.setToken(token)
        
        // Try to get user from localStorage first
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser)
            console.log('Loaded user from localStorage:', parsedUser)
            setUser(parsedUser)
          } catch (e) {
            console.error('Failed to parse saved user:', e)
          }
        }
        
        // Fetch profile from backend to verify token and get fresh data
        const response = await apiClient.getProfile()
        if (response.success && response.data) {
          // Extract user from data - backend returns User directly
          const userData = response.data
          console.log('Profile from backend:', userData)
          setUser(userData)
          // Update saved user data
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

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return <DashboardStats />
      case 'paket':
      case 'paket/website':
      case 'paket/desain':
      case 'paket/event':
      case 'paket/katalog':
        return <PackageManagement />
      case 'paket/form':
      case 'paket/formpaket':
        return <PackageForm />
      case 'team':
        return <TeamManagement />
      case 'clients':
      case 'clients/formclient':
        return <ClientManagement />
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
        return <DashboardStats />
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
    <div className="min-h-screen bg-slate-50">
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
        />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <DashboardHeader 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            user={user}
          />
          
          <main className="p-6 lg:p-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
