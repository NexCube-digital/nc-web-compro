import React, { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async';
import { Home } from './pages/Home'

// Lazy load pages for better performance
const Services = lazy(() => import('./pages/Services').then(module => ({ default: module.Services })));
const Contact = lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const PaketDetail = lazy(() => import('./pages/PaketDetail').then(module => ({ default: module.PaketDetail })));
const Paket = lazy(() => import('./pages/Paket').then(module => ({ default: module.Paket })));
const Website = lazy(() => import('./paket/Website').then(module => ({ default: module.Website })));
const UndanganDigital = lazy(() => import('./paket/UndanganDigital').then(module => ({ default: module.UndanganDigital })));
const DesainGrafis = lazy(() => import('./paket/DesainGrafis').then(module => ({ default: module.DesainGrafis })));
const MenuKatalog = lazy(() => import('./paket/MenuKatalog').then(module => ({ default: module.MenuKatalog })));
const NotFound = lazy(() => import('./pages/NotFound').then(module => ({ default: module.NotFound })));

// Loading spinner for lazy loaded components
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
  </div>
);

// Page transition component
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </div>
  );
};

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  React.useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300);
    }
  }, [location]);
  
  return null;
};

export default function App() {
  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800 font-sans">
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </Suspense>
      </div>
    </HelmetProvider>
  )
}