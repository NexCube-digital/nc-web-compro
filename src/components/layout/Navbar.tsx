import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoginButton from './LoginButton';
import apiClient from '../../services/api'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // GSAP animation for logo on scroll
  useEffect(() => {
    if (!logoRef.current) return;

    gsap.to(logoRef.current, {
      scale: isScrolled ? 0.9 : 1,
      duration: 0.3,
      ease: 'power2.out'
    });

    // Pulsing glow effect on scroll
    if (isScrolled) {
      gsap.to(logoRef.current.querySelector('.logo-glow'), {
        opacity: 0.6,
        scale: 1.2,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
  }, [isScrolled]);

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
    setIsProfileOpen(false)
    navigate('/')
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userName) return 'U';
    const names = userName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
  };

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200' 
        : 'bg-white/90 backdrop-blur-sm border-b border-slate-100'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo - Clean and Modern */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img 
                src="/images/NexCube-full.png" 
                alt="NexCube Digital" 
                className="h-9 md:h-10 w-auto transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-base md:text-lg font-bold text-slate-900 tracking-tight">
                NexCube
              </div>
              <div className="text-xs text-slate-600 font-medium">
                Digital
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`relative px-4 py-2 text-sm font-semibold transition-all duration-200 rounded-lg flex items-center gap-2 ${
                  isActive(link.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className="w-5 h-5">{link.icon}</span>
                <span>{link.name}</span>
                
                {/* Active indicator */}
                {isActive(link.href) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Login & CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-slate-100 transition-all duration-200 group"
                >
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-lg transition-shadow">
                      {getUserInitials()}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="text-left hidden xl:block">
                    <div className="text-sm font-semibold text-slate-800 leading-tight">
                      {userName ? userName.split(' ')[0] : 'User'}
                    </div>
                    <div className="text-xs text-slate-500">Admin</div>
                  </div>
                  <svg 
                    className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className={`absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-200 origin-top-right ${
                  isProfileOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}>
                  {/* User Info Header */}
                  <div className="px-4 py-3 bg-gradient-to-br from-blue-50 to-orange-50 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center text-white font-bold text-base shadow-md">
                        {getUserInitials()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-800 truncate">
                          {userName || 'User'}
                        </div>
                        <div className="text-xs text-slate-600">Administrator</div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                      </svg>
                      <span>Dashboard</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <LoginButton />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
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

        {/* Mobile Menu */}
        <div className={`lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg transition-all duration-200 ${
          isMenuOpen 
            ? 'opacity-100 visible' 
            : 'opacity-0 invisible pointer-events-none'
        }`}>
          <div className="px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-base font-semibold rounded-lg transition-colors ${
                  isActive(link.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="w-5 h-5">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            ))}
            
            <div className="pt-4 mt-4 border-t border-slate-200 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center px-4 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      handleLogout()
                    }}
                    className="w-full px-4 py-3 rounded-lg font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div onClick={() => setIsMenuOpen(false)}>
                  <LoginButton onCloseMenu={() => setIsMenuOpen(false)} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
