import React, { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Home } from './pages/Home'
import ErrorBoundary from './components/ErrorBoundary'
import Loading from './components/Loading'

// Lazy load pages for better performance
const Services = lazy(() => import('./pages/Services').then(module => ({ default: module.Services })))
const Contact = lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })))
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })))
const PaketDetail = lazy(() => import('./pages/PaketDetail').then(module => ({ default: module.PaketDetail })))
const Paket = lazy(() => import('./pages/Paket').then(module => ({ default: module.Paket })))
const Website = lazy(() => import('./paket/Website').then(module => ({ default: module.Website })))
const UndanganDigital = lazy(() => import('./paket/UndanganDigital').then(module => ({ default: module.UndanganDigital })))
const DesainGrafis = lazy(() => import('./paket/DesainGrafis').then(module => ({ default: module.DesainGrafis })))
const MenuKatalog = lazy(() => import('./paket/MenuKatalog').then(module => ({ default: module.MenuKatalog })))
const NotFound = lazy(() => import('./pages/NotFound').then(module => ({ default: module.NotFound })))
const ErrorPage = lazy(() => import('./pages/ErrorPage').then(module => ({ default: module.ErrorPage })))
const Login = lazy(() => import('./auth/Login').then(module => ({ default: module.Login })))
const Dashboard = lazy(() => import('./dashboard/Dashboard').then(module => ({ default: module.Dashboard })))

// Loading component for lazy loaded pages
const PageLoader = () => <Loading fullScreen message="Memuat halaman..." />

// Page transition component with smooth animation
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = React.useState(false)
  
  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div 
      className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ willChange: 'opacity' }}
    >
      {children}
    </div>
  )
}

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation()
  const location = useLocation()
  
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [pathname])
  
  React.useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.substring(1)
        const element = document.getElementById(id)
        if (element) {
          const headerOffset = 80
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }, 300)
    }
  }, [location])
  
  return null
}

// Root layout wrapper component
const RootLayout = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800 font-sans antialiased">
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/paket" element={<Paket />} />
                <Route path="/paket/:tier" element={<PaketDetail />} />
                <Route path="/paket/website" element={<Website />} />
                <Route path="/paket/undangan-digital" element={<UndanganDigital />} />
                <Route path="/paket/desain-grafis" element={<DesainGrafis />} />
                <Route path="/paket/menu-katalog" element={<MenuKatalog />} />
                
                {/* Admin Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/*" element={<Dashboard />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
          </Suspense>
        </div>
      </HelmetProvider>
    </ErrorBoundary>
  )
}

// Export routes configuration for createBrowserRouter
export const routes = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: (
      <Suspense fallback={<PageLoader />}>
        <ErrorPage />
      </Suspense>
    ),
  }
]

export default function App() {
  return <RootLayout />
}