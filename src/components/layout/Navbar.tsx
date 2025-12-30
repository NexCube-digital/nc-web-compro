import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoginButton from './LoginButton';
import apiClient from '../../services/api'

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('authToken')
    const userStr = localStorage.getItem('user')
    setIsAuthenticated(!!token)
    if (userStr) {
      try {
        const u = JSON.parse(userStr)
        setUserName(u?.name || u?.email || null)
      } catch (e) {
        setUserName(null)
      }
    } else {
      setUserName(null)
    }
  }, [location.pathname])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      // keep rememberEmail if user wanted it
    }
    apiClient.setToken(null)
    setIsAuthenticated(false)
    setUserName(null)
    navigate('/')
  }

  const navLinks = [
    { 
      name: 'Home', 
      href: '/', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 16l4-4m0 0l4 4m-4-4V5" />
        </svg>
      ) 
    },
    { 
      name: 'Paket', 
      href: '/paket', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) 
    },
    { 
      name: 'Tentang', 
      href: '/about', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ) 
    },
    { 
      name: 'Kontak', 
      href: '/contact', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ) 
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-2xl shadow-2xl border-b border-white/20' 
        : 'bg-gradient-to-b from-white/90 to-white/50 backdrop-blur-xl border-b border-white/30'
    }`}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-0 hover:opacity-5 transition-opacity duration-300 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>

      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo with Enhanced Animation */}
          <Link to="/" className="flex items-center space-x-3 group relative z-10">
            <div className="relative">
              {/* Animated glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-all duration-500 scale-0 group-hover:scale-100"></div>
              <img 
                src="/images/NexCube-full.png" 
                alt="NexCube Digital" 
                className="h-12 lg:h-14 w-auto transition-all duration-300 group-hover:scale-110 filter drop-shadow-sm group-hover:drop-shadow-lg relative"
              />
            </div>
            <div className="hidden xs:block">
              <div className="text-base lg:text-lg font-black bg-gradient-to-r from-slate-900 via-blue-700 to-purple-700 bg-clip-text text-transparent tracking-tight">
                NexCube
              </div>
              <div className="text-xs lg:text-sm font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text">
                Digital Studio
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`relative group px-4 py-2 text-sm font-bold transition-all duration-300 rounded-xl flex items-center gap-2 ${
                  isActive(link.href)
                    ? 'text-blue-600 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50'
                    : 'text-slate-700 hover:text-blue-700'
                }`}
              >
                {/* Animated background on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-purple-100/0 to-blue-100/0 group-hover:from-blue-100 group-hover:via-purple-100 group-hover:to-blue-100 rounded-xl transition-all duration-300 -z-10"></div>
                
                <span className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">{link.icon}</span>
                <span className="hidden sm:inline">{link.name}</span>

                {/* Animated underline */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-full transition-all duration-300 ${
                  isActive(link.href) 
                    ? 'w-full opacity-100' 
                    : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                }`}></div>
              </Link>
            ))}
          </div>

          {/* Login & CTA Buttons - Gen-Z Style */}
          <div className="hidden lg:flex items-center space-x-3 relative z-10">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
                  {userName ? `Halo, ${userName}` : 'Dashboard'}
                </Link>
                <button onClick={handleLogout} className="text-sm px-3 py-2 rounded-xl border border-white/20 hover:bg-white/5">Logout</button>
              </div>
            ) : (
              <LoginButton />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 transition-all duration-300 relative z-10 group"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-slate-700 transition-all duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 18h16" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu with Gen-Z Premium Design */}
        <div className={`lg:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-white/95 via-white/92 to-white/90 backdrop-blur-2xl border-t border-white/30 shadow-2xl transition-all duration-300 overflow-hidden ${
          isMenuOpen 
            ? 'opacity-100 visible translate-y-0' 
            : 'opacity-0 invisible -translate-y-2 pointer-events-none'
        }`}>
          <div className="px-4 py-8 space-y-3">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex px-5 py-4 text-base font-bold transition-all duration-300 rounded-xl group relative overflow-hidden items-center gap-3 ${
                  isActive(link.href)
                    ? 'text-blue-600 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100'
                    : 'text-slate-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
                }`}
                style={{ 
                  animation: isMenuOpen ? `slideIn 0.3s ease-out ${index * 0.05}s forwards` : 'none',
                  opacity: isMenuOpen ? 1 : 0
                }}
              >
                <span className="transition-all duration-300 group-hover:scale-120 group-hover:rotate-12 text-lg">{link.icon}</span>
                <span className="tracking-tight">{link.name}</span>
              </Link>
            ))}
            
            <div className="pt-6 border-t border-slate-200/50 space-y-3">
              {/* Mobile: single LoginButton (modal) */}
              <div>
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-center px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        handleLogout()
                      }}
                      className="w-full px-6 py-3 rounded-xl font-semibold border border-white/10 text-slate-200 hover:bg-white/5"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div onClick={() => setIsMenuOpen(false)}>
                    <LoginButton onCloseMenu={() => setIsMenuOpen(false)} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add animation keyframes */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </nav>
  );
};
