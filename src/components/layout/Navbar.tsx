import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import apiClient, { getImageUrl } from '../../services/api'
import { CartButton } from '../cart/CartButton'
import LoginButton from './LoginButton'
import { FaGlobe, FaEnvelopeOpenText, FaPalette, FaBookOpen } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'

type NavLinkItem = {
  name: string
  href: string
  icon: React.ReactNode
}

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isPaketOpen, setIsPaketOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [userPhoto, setUserPhoto] = useState<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const profileRef = useRef<HTMLDivElement>(null)
  const paketRef = useRef<HTMLDivElement>(null)
  const mobilePaketRef = useRef<HTMLDivElement>(null)

  const navLinks: NavLinkItem[] = [
    {
      name: 'Beranda',
      href: '/',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 11.5 12 4l9 7.5M5 10v10h14V10" />
        </svg>
      ),
    },
    {
      name: 'Portfolio',
      href: '/portfolio',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-6-6h12M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z" />
        </svg>
      ),
    },
    {
      name: 'Paket',
      href: '/paket',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8 4-8-4m16 0-8-4-8 4m16 0v10l-8 4-8-4V7" />
        </svg>
      ),
    },
    
    {
      name: 'Tentang',
      href: '/about',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
      ),
    },
    {
      name: 'Kontak',
      href: '/contact',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ]

  const paketItems = [
    { 
      name: 'Website Premium', 
      desc: 'Solusi website kustom & responsif', 
      href: '/paket/website',
      icon: <FaGlobe className="w-4 h-4" />,
      badgeBg: 'bg-blue-50 border border-blue-100',
      iconColor: 'text-[#126EFE]'
    },
    { 
      name: 'Undangan Digital', 
      desc: 'E-invitation interaktif & elegan', 
      href: '/paket/undangan-digital',
      icon: <FaEnvelopeOpenText className="w-4 h-4" />,
      badgeBg: 'bg-amber-50 border border-amber-100',
      iconColor: 'text-[#FBA41C]'
    },
    { 
      name: 'Desain Grafis', 
      desc: 'Branding visual & aset promosi HD', 
      href: '/paket/desain-grafis',
      icon: <FaPalette className="w-4 h-4" />,
      badgeBg: 'bg-rose-50 border border-rose-100',
      iconColor: 'text-rose-600'
    },
    { 
      name: 'Katalog Digital', 
      desc: 'Menu QR online & katalog produk', 
      href: '/paket/menu-katalog',
      icon: <FaBookOpen className="w-4 h-4" />,
      badgeBg: 'bg-emerald-50 border border-emerald-100',
      iconColor: 'text-emerald-600'
    },
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false)
      }
      const isInsideDesktop = paketRef.current && paketRef.current.contains(target)
      const isInsideMobile = mobilePaketRef.current && mobilePaketRef.current.contains(target)
      if (!isInsideDesktop && !isInsideMobile) {
        setIsPaketOpen(false)
      }
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 12)

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
    setIsProfileOpen(false)
    setIsPaketOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const token = localStorage.getItem('authToken')
    const userStr = localStorage.getItem('user')
    setIsAuthenticated(!!token)

    if (!userStr) {
      setUserName(null)
      setUserPhoto(null)
      return
    }

    try {
      const user = JSON.parse(userStr)
      setUserName(user?.name || user?.email || null)
      setUserPhoto(user?.photo || null)
    } catch {
      setUserName(null)
      setUserPhoto(null)
    }
  }, [location.pathname])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    }

    apiClient.setToken(null)
    setIsAuthenticated(false)
    setUserName(null)
    setUserPhoto(null)
    setIsProfileOpen(false)
    navigate('/')
  }

  const getUserInitials = () => {
    if (!userName) return 'U'

    const names = userName.split(' ').filter(Boolean)
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }

    return userName.substring(0, 2).toUpperCase()
  }

  const isHeroMode = (location.pathname === '/' || location.pathname === '/portfolio' || location.pathname === '/about' || location.pathname === '/contact') && !isScrolled

  return (
    <nav className="fixed inset-x-0 top-3 z-50 px-3 sm:px-4">
      <div
        className={`mx-auto max-w-7xl rounded-[28px] border backdrop-blur-xl transition-all duration-300 ${
          isHeroMode
            ? 'border-cyan-500/25 bg-[#040816]/80 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(0,210,255,0.06)]'
            : isScrolled
            ? 'border-blue-200/70 bg-white/90 shadow-[0_22px_50px_rgba(18,110,254,0.12)]'
            : 'border-blue-100/60 bg-white/84 shadow-[0_16px_40px_rgba(15,23,42,0.10)]'
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-5 lg:px-6">
          {/* NexCube Digital Logo */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
            <div className="relative flex items-center justify-center">
              <img
                src="/images/NexCube-full.png"
                alt="NexCube Digital"
                className="h-9 sm:h-10 w-auto object-contain drop-shadow-[0_0_12px_rgba(18,110,254,0.35)] transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className={`text-base sm:text-lg font-black tracking-tight transition-colors ${
                  isHeroMode ? 'text-white group-hover:text-cyan-300' : 'text-slate-900 group-hover:text-[#126EFE]'
                }`}>
                  NexCube
                </span>
                {location.pathname === '/portfolio' && (
                  <span className={`hidden xs:inline-flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border transition-colors ${
                    isHeroMode 
                      ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 shadow-[0_0_10px_rgba(0,210,255,0.2)]' 
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    PORTFOLIO
                  </span>
                )}
                {location.pathname === '/about' && (
                  <span className={`hidden xs:inline-flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border transition-colors ${
                    isHeroMode 
                      ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]' 
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}>
                    ABOUT US
                  </span>
                )}
                {location.pathname === '/contact' && (
                  <span className={`hidden xs:inline-flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border transition-colors ${
                    isHeroMode 
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    CONTACT
                  </span>
                )}
              </div>
              <div className={`text-[10px] font-semibold tracking-wider uppercase ${isHeroMode ? 'text-cyan-400' : 'text-[#126EFE]'}`}>
                Digital
              </div>
            </div>
          </Link>

          <div className="hidden lg:flex flex-1 justify-center">
            <div className={`flex items-center gap-1 rounded-full p-1 transition-all duration-300 ${
              isHeroMode
                ? 'border border-white/10 bg-white/5 shadow-inner'
                : 'border border-blue-100 bg-blue-50/80 shadow-inner shadow-blue-100/70'
            }`}>
              {navLinks.map((link) => {
                if (link.name === 'Paket') {
                  return (
                    <div key={link.name} className="relative" ref={paketRef}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsPaketOpen((current) => !current)
                          setIsProfileOpen(false)
                        }}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                          isActive('/paket') 
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm' 
                            : isHeroMode
                            ? 'text-slate-300 hover:bg-white/10 hover:text-white'
                            : 'text-slate-700 hover:bg-white hover:text-slate-950'
                        }`}
                      >
                        {link.icon}
                        <span>{link.name}</span>
                        <svg className={`h-4 w-4 transition-transform duration-200 ${isPaketOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      <div
                        className={`absolute left-1/2 top-full mt-3 w-[24rem] -translate-x-1/2 overflow-hidden rounded-3xl border transition-all duration-200 z-50 ${
                          isHeroMode
                            ? 'border-white/15 bg-[#070e20]/95 backdrop-blur-2xl text-white shadow-[0_25px_60px_rgba(0,0,0,0.8)]'
                            : 'border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-2xl shadow-blue-500/10'
                        } ${
                          isPaketOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'
                        }`}
                      >
                        {/* Header Banner inside Dropdown */}
                        <div className={`px-4 py-3 border-b flex items-center justify-between ${
                          isHeroMode
                            ? 'bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-900 border-white/10'
                            : 'bg-gradient-to-r from-blue-50 via-indigo-50/50 to-amber-50/30 border-slate-100'
                        }`}>
                          <div className="flex items-center gap-2">
                            <HiSparkles className="w-4 h-4 text-[#FBA41C]" />
                            <span className={`text-xs font-black uppercase tracking-wider ${isHeroMode ? 'text-white' : 'text-slate-800'}`}>
                              Paket Layanan Digital
                            </span>
                          </div>
                          <Link 
                            to="/paket" 
                            onClick={() => setIsPaketOpen(false)}
                            className="text-[11px] font-bold text-cyan-400 hover:underline"
                          >
                            Lihat Semua →
                          </Link>
                        </div>

                        <div className="p-2 space-y-1">
                          {paketItems.map((paket) => {
                            const active = location.pathname === paket.href
                            return (
                              <Link
                                key={paket.name}
                                to={paket.href}
                                onClick={() => {
                                  setIsPaketOpen(false)
                                  setIsMenuOpen(false)
                                }}
                                className={`flex items-center gap-3.5 w-full text-left rounded-2xl p-3 transition-all duration-200 border cursor-pointer ${
                                  active 
                                    ? isHeroMode
                                      ? 'bg-blue-600/20 border-cyan-400/40 text-cyan-300'
                                      : 'bg-blue-50/90 border-blue-100 text-[#126EFE] shadow-xs' 
                                    : isHeroMode
                                    ? 'border-transparent text-slate-300 hover:bg-white/10 hover:border-white/10 hover:text-white'
                                    : 'border-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-100'
                                }`}
                              >
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${paket.badgeBg} ${paket.iconColor} shadow-2xs`}>
                                  {paket.icon}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className={`text-sm font-black leading-tight transition-colors ${isHeroMode ? 'text-white' : 'text-slate-900 group-hover:text-[#126EFE]'}`}>
                                    {paket.name}
                                  </div>
                                  <div className={`mt-0.5 text-xs font-medium truncate ${isHeroMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {paket.desc}
                                  </div>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                }

                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive(link.href) 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_16px_rgba(0,210,255,0.35)]' 
                        : isHeroMode
                        ? 'text-slate-300 hover:bg-white/10 hover:text-white'
                        : 'text-slate-700 hover:bg-white hover:text-slate-950'
                    }`}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <CartButton isHeroMode={isHeroMode} />

            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen((current) => !current)
                    setIsPaketOpen(false)
                  }}
                  className={`flex items-center gap-2 rounded-full border px-2.5 py-1.5 transition-colors ${
                    isHeroMode
                      ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                      : 'border-emerald-100 bg-emerald-50/80 text-slate-700 hover:bg-emerald-100/80'
                  }`}
                >
                  <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-sm font-semibold text-white shadow-md">
                    {userPhoto ? <img src={getImageUrl(userPhoto)} alt={userName || ''} className="h-full w-full object-cover" /> : getUserInitials()}
                  </div>
                  <div className="hidden xl:block text-left">
                    <div className={`text-sm font-medium leading-tight ${isHeroMode ? 'text-white' : 'text-slate-900'}`}>{userName ? userName.split(' ')[0] : 'User'}</div>
                    <div className={`text-[11px] ${isHeroMode ? 'text-cyan-300' : 'text-slate-500'}`}>Administrator</div>
                  </div>
                  <svg className={`h-4 w-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''} ${isHeroMode ? 'text-white/70' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  className={`absolute right-0 mt-3 w-72 overflow-hidden rounded-3xl border transition-all duration-200 z-50 ${
                    isHeroMode
                      ? 'border-white/15 bg-[#070e20]/95 backdrop-blur-2xl text-white shadow-2xl'
                      : 'border-emerald-100 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.14)]'
                  } ${
                    isProfileOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'
                  }`}
                >
                  <div className={`border-b px-4 py-4 ${isHeroMode ? 'border-white/10' : 'border-emerald-100'}`}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-base font-semibold text-white">
                        {userPhoto ? <img src={getImageUrl(userPhoto)} alt={userName || ''} className="h-full w-full object-cover" /> : getUserInitials()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={`truncate text-sm font-semibold ${isHeroMode ? 'text-white' : 'text-slate-900'}`}>{userName || 'User'}</div>
                        <div className={`text-xs ${isHeroMode ? 'text-slate-400' : 'text-slate-500'}`}>Administrator</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                        isHeroMode ? 'text-slate-200 hover:bg-white/10 hover:text-white' : 'text-slate-700 hover:bg-emerald-50 hover:text-slate-950'
                      }`}
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                      </svg>
                      <span>Dashboard</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-500/10 hover:text-rose-400 cursor-pointer"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <LoginButton isHeroMode={isHeroMode} />
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <CartButton isHeroMode={isHeroMode} />
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                isHeroMode
                  ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                  : 'border-blue-100 bg-blue-50/80 text-[#126EFE] hover:bg-[#126EFE] hover:text-white'
              }`}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
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
        </div>

        <div
          className={`lg:hidden overflow-hidden border-t transition-all duration-200 ${
            isHeroMode
              ? 'border-white/10 bg-[#060b18]/95 backdrop-blur-2xl text-white'
              : 'border-slate-100 bg-white/95'
          } ${
            isMenuOpen ? 'max-h-[85vh] overflow-y-auto opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="space-y-2 px-3 py-3">
            {navLinks.map((link) => {
              if (link.name === 'Paket') {
                return (
                  <div key={link.name} ref={mobilePaketRef} className={`rounded-3xl border p-2 ${
                    isHeroMode ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-white/60'
                  }`}>
                    <button
                      type="button"
                      onClick={() => setIsPaketOpen((current) => !current)}
                      className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                        isActive('/paket') 
                          ? 'bg-blue-600/30 text-cyan-300' 
                          : isHeroMode 
                          ? 'text-slate-200 hover:bg-white/10 hover:text-white' 
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {link.icon}
                        <span>{link.name}</span>
                      </span>
                      <svg className={`h-4 w-4 transition-transform ${isPaketOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <div className={`grid gap-2 overflow-hidden transition-all duration-200 ${isPaketOpen ? 'mt-2 max-h-[30rem] opacity-100' : 'max-h-0 opacity-0'}`}>
                      {paketItems.map((paket) => (
                        <Link
                          key={paket.name}
                          to={paket.href}
                          onClick={() => {
                            setIsPaketOpen(false)
                            setIsMenuOpen(false)
                          }}
                          className={`flex items-center gap-3 w-full text-left rounded-2xl border p-3 text-sm transition-colors cursor-pointer ${
                            isHeroMode
                              ? 'border-white/5 bg-white/5 text-slate-200 hover:bg-white/10'
                              : 'border-slate-100 bg-white text-slate-700 hover:bg-blue-50/50'
                          }`}
                        >
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${paket.badgeBg} ${paket.iconColor}`}>
                            {paket.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className={`font-bold leading-tight ${isHeroMode ? 'text-white' : 'text-slate-900'}`}>{paket.name}</div>
                            <div className={`mt-0.5 text-xs font-medium truncate ${isHeroMode ? 'text-slate-400' : 'text-slate-500'}`}>{paket.desc}</div>
                          </div>
                        </Link>
                      ))}

                      <Link
                        to="/paket"
                        onClick={() => {
                          setIsPaketOpen(false)
                          setIsMenuOpen(false)
                        }}
                        className={`w-full text-center py-2.5 text-xs font-black rounded-xl transition-colors block cursor-pointer ${
                          isHeroMode ? 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30' : 'bg-blue-50/80 text-[#126EFE] hover:bg-blue-100/80'
                        }`}
                      >
                        Lihat Semua Paket Digital →
                      </Link>
                    </div>
                  </div>
                )
              }

              return (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-3xl border px-4 py-3 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? isHeroMode 
                        ? 'border-cyan-500/30 bg-blue-600/20 text-cyan-300' 
                        : 'border-emerald-100 bg-emerald-50 text-slate-950'
                      : isHeroMode
                      ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white'
                      : 'border-emerald-100 bg-white text-slate-700 hover:bg-emerald-50 hover:text-slate-950'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              )
            })}

            <div className={`rounded-3xl border p-2 ${isHeroMode ? 'border-white/10 bg-white/5' : 'border-white/10 bg-white/5'}`}>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block rounded-2xl px-4 py-3 text-center text-sm font-medium transition-colors ${
                      isHeroMode ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-emerald-50 hover:text-slate-950'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false)
                      handleLogout()
                    }}
                    className="mt-2 block w-full rounded-2xl px-4 py-3 text-sm font-medium text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div onClick={() => setIsMenuOpen(false)}>
                  <LoginButton isHeroMode={isHeroMode} onCloseMenu={() => setIsMenuOpen(false)} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}