import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

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
            {/* Login Button */}
            <Link
              to="/login"
              className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg border-2 border-slate-200 hover:border-blue-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-white opacity-100 group-hover:opacity-0 transition-all duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              
              <svg className="w-4 h-4 text-slate-600 group-hover:text-blue-600 relative z-10 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-slate-700 group-hover:text-blue-700 relative z-10 transition-colors duration-300">
                Login
              </span>
            </Link>

            {/* WhatsApp CTA Button */}
            <Link
              to="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20tentang%20kebutuhan%20digital%20saya"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2.5 px-7 py-3 rounded-2xl font-black text-sm overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-100 group-hover:opacity-110 transition-all duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-lg"></div>

              {/* Animated shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
              </div>

              <svg className="w-5 h-5 text-green-400 relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span className="text-white relative z-10 transition-all duration-300 group-hover:translate-x-0.5 tracking-wide">
                Chat Now
              </span>
              <svg className="w-4 h-4 text-white/80 relative z-10 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
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
              {/* Login Button Mobile */}
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 text-center px-6 py-3 rounded-xl font-semibold hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 transition-all duration-300 hover:shadow-md active:scale-95 border-2 border-slate-200 hover:border-blue-300 text-sm"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Login
                </div>
              </Link>

              {/* WhatsApp CTA Button Mobile */}
              <Link
                to="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20tentang%20kebutuhan%20digital%20saya"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white text-center px-6 py-4 rounded-2xl font-black hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 transition-all duration-300 hover:shadow-lg active:scale-95 shadow-lg text-sm tracking-wide"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Chat Now
                </div>
              </Link>
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
