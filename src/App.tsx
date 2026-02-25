import React, { Suspense, lazy } from 'react'
import { useLocation, Outlet } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Home } from './pages/Home'
import ErrorBoundary from './components/ErrorBoundary'
import Loading from './components/Loading'
import { CartProvider } from './context/CartContext'      // ✅ import
import { CartDrawer } from './components/cart/CartDrawer' // ✅ import

// Lazy load pages
const Services         = lazy(() => import('./pages/Services').then(m => ({ default: m.Services })))
const Contact          = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })))
const About            = lazy(() => import('./pages/About').then(m => ({ default: m.About })))
const PaketDetail      = lazy(() => import('./pages/PaketDetail').then(m => ({ default: m.PaketDetail })))
const Paket            = lazy(() => import('./pages/Paket').then(m => ({ default: m.Paket })))
// const PaketDigital     = lazy(() => import('./pages/PaketDigital').then(m => ({ default: m.PaketDigital })))
const PaketAffiliate      = lazy(() => import('./pages/PaketAffiliate').then(m => ({ default: m.PaketAffiliate })))
const Website          = lazy(() => import('./paket/Website').then(m => ({ default: m.Website })))
const UndanganDigital  = lazy(() => import('./paket/UndanganDigital').then(m => ({ default: m.UndanganDigital })))
const DesainGrafis     = lazy(() => import('./paket/DesainGrafis').then(m => ({ default: m.DesainGrafis })))
const MenuKatalog      = lazy(() => import('./paket/MenuKatalog').then(m => ({ default: m.MenuKatalog })))
const NotFound         = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })))
const ErrorPage        = lazy(() => import('./pages/ErrorPage').then(m => ({ default: m.ErrorPage })))
const Login            = lazy(() => import('./auth/Login').then(m => ({ default: m.Login })))
const Dashboard        = lazy(() => import('./dashboard/Dashboard').then(m => ({ default: m.Dashboard })))
const Checkout         = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })))
const OrderSuccess     = lazy(() => import('./pages/OrderSuccess').then(m => ({ default: m.OrderSuccess })))
const OrderPending     = lazy(() => import('./pages/OrderPending').then(m => ({ default: m.OrderPending })))

const PageLoader = () => <Loading fullScreen message="Memuat halaman..." />

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
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
        }
      }, 300)
    }
  }, [location])

  return null
}

// ✅ RootLayout membungkus CartProvider + CartDrawer di dalam Router
const RootLayout = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <CartProvider>                    
          <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800 font-sans antialiased">
            <ScrollToTop />
            <CartDrawer />       
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <Outlet />
              </PageTransition>
            </Suspense>
          </div>
        </CartProvider>
      </HelmetProvider>
    </ErrorBoundary>
  )
}

export const routes = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: (
      <Suspense fallback={<PageLoader />}>
        <ErrorPage />
      </Suspense>
    ),
    children: [
      { index: true,                      element: <Home /> },
      { path: 'services',                 element: <Services /> },
      { path: 'contact',                  element: <Contact /> },
      { path: 'about',                    element: <About /> },
      { path: 'paket',                    element: <Paket /> },
      // { path: 'paket/digital',            element: <PaketDigital /> },
      { path: 'paket/affiliate',             element: <PaketAffiliate /> },
      { path: 'paket/:tier',              element: <PaketDetail /> },
      { path: 'paket/website',            element: <Website /> },
      { path: 'paket/undangan-digital',   element: <UndanganDigital /> },
      { path: 'paket/desain-grafis',      element: <DesainGrafis /> },
      { path: 'paket/menu-katalog',       element: <MenuKatalog /> },
      { path: 'login',                    element: <Login /> },
      { path: 'dashboard',                element: <Dashboard /> },
      { path: 'dashboard/*',              element: <Dashboard /> },
      { path: 'checkout',                 element: <Checkout /> },
      { path: 'order/success',            element: <OrderSuccess /> },
      { path: 'order/pending',            element: <OrderPending /> },
      { path: '*',                        element: <NotFound /> },
    ]
  }
]

export default function App() {
  return <RootLayout />
}