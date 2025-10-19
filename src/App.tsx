import React, { useState, useEffect, Suspense, lazy } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async';
import { Home } from './pages/Home'

// Lazy load pages for better performance
const Services = lazy(() => import('./pages/Services').then(module => ({ default: module.Services })));
const Contact = lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const PaketDetail = lazy(() => import('./pages/PaketDetail').then(module => ({ default: module.PaketDetail })));
const NotFound = lazy(() => import('./pages/NotFound').then(module => ({ default: module.NotFound })));

// Loading spinner for lazy loaded components
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
  </div>
);

// Tambahkan komponen animasi page transition
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
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

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Tambahkan fungsi untuk scroll ke anchor tag dari URL
  useEffect(() => {
    if (location.hash) {
      // Beri waktu untuk DOM selesai render
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
  
  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800 font-sans">
        <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white shadow-sm'}`}>
          <div className="container flex items-center justify-between h-16 sm:h-20 md:h-24">
            <Link to="/" className="flex items-center gap-2 sm:gap-4 group">
              <img 
                src="/images/NexCube-full.png" 
                alt="NexCube Digital Logo" 
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 object-contain transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="block max-w-[180px] xxs:max-w-none">
                <div className="text-sm xs:text-lg sm:text-xl font-heading font-semibold truncate">NexCube</div>
                <div className="text-2xs xs:text-xs sm:text-sm text-slate-500 line-clamp-1">digital.</div>
              </div>
            </Link>

            <button 
              className="md:hidden p-2 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <>
                    <path d="M4 8h16" />
                    <path d="M4 16h16" />
                  </>
                )}
              </svg>
            </button>

            <nav className="hidden md:flex gap-6 lg:gap-8 items-center text-sm">
              <Link to="/" className={`hover:text-accent font-medium transition-colors py-2 px-1 ${location.pathname === '/' ? 'text-accent' : ''}`}>
                Home
              </Link>
              <Link to="/services" className={`hover:text-accent font-medium transition-colors py-2 px-1 ${location.pathname === '/services' ? 'text-accent' : ''}`}>
                Services
              </Link>
              <Link to="/about" className={`hover:text-accent font-medium transition-colors py-2 px-1 ${location.pathname === '/about' ? 'text-accent' : ''}`}>
                About
              </Link>
              <Link to="/contact" className="btn-primary text-sm">Hubungi Kami</Link>
            </nav>
          </div>

          {/* Mobile menu with animation */}
          <div className={`md:hidden bg-white border-t overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-64' : 'max-h-0'}`}>
            <div className="container flex flex-col gap-2 py-2">
              <Link to="/" className={`hover:bg-slate-50 px-4 py-3 rounded font-medium ${location.pathname === '/' ? 'text-accent' : ''}`}>
                Home
              </Link>
              <Link to="/services" className={`hover:bg-slate-50 px-4 py-3 rounded font-medium ${location.pathname === '/services' ? 'text-accent' : ''}`}>
                Services
              </Link>
              <Link to="/about" className={`hover:bg-slate-50 px-4 py-3 rounded font-medium ${location.pathname === '/about' ? 'text-accent' : ''}`}>
                About
              </Link>
              <Link to="/contact" className="mt-2 mb-2 btn-primary text-center">Hubungi Kami</Link>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/paket/:tier" element={<PaketDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
          </Suspense>
        </main>

        <footer className="mt-16 sm:mt-24 bg-gradient-premium text-white">
          <div className="container py-12 sm:py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img src="/images/NexCube-full.png" alt="NexCube Digital Logo" className="w-16 h-16 sm:w-24 sm:h-24 object-contain" />
                  <div>
                    <div className="text-lg sm:text-xl font-heading font-semibold">NexCube Digital</div>
                    <div className="text-xs sm:text-sm text-slate-300 mt-1">Premium Digital Solutions</div>
                  </div>
                </div>
                <p className="text-sm text-slate-300">
                  Studio kreatif premium untuk kebutuhan digital bisnis Anda, dengan solusi yang elegan dan profesional.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-heading font-semibold mb-4">Layanan</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="hover:text-white transition-colors"><Link to="/services">Website Premium</Link></li>
                  <li className="hover:text-white transition-colors"><Link to="/services">Undangan Digital</Link></li>
                  <li className="hover:text-white transition-colors"><Link to="/services">Desain Grafis</Link></li>
                  <li className="hover:text-white transition-colors"><Link to="/services">Menu & Katalog Digital</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-heading font-semibold mb-4">Kontak</h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-1">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>Jl. Bukit Jarian dlm VI, Bandung</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-1">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    <a href="tel:+6281317435622" className="hover:text-white transition-colors">+62 813 1743 5622</a>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-1">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <a href="mailto:info@nexcube.id" className="hover:text-white transition-colors">info@nexcube.com</a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-slate-700/50 mt-10 sm:mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
              <div className="text-xs sm:text-sm text-slate-400">© {new Date().getFullYear()} NexCube Digital — All rights reserved.</div>
              <div className="flex gap-4 mt-4 md:mt-0">
                <a href="#" className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </HelmetProvider>
  )
}