import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { FaArrowUp } from 'react-icons/fa';

export interface ScrollTopProps {
  /** Ambang batas scroll (dalam pixel) sebelum tombol muncul */
  threshold?: number;
  /** ID elemen target untuk scroll (default: 'hero', fallback ke top 0) */
  targetId?: string;
  /** Tampilkan indikator persentase scroll melingkar */
  showProgress?: boolean;
  /** Custom class styling */
  className?: string;
  /** Teks tooltip saat tombol di-hover */
  tooltipText?: string;
  /** Label aksesibilitas untuk screen reader */
  ariaLabel?: string;
}

export const ScrollTop: React.FC<ScrollTopProps> = ({
  threshold = 300,
  targetId = 'hero',
  showProgress = true,
  className = '',
  tooltipText = 'Scroll ke Hero',
  ariaLabel = 'Scroll kembali ke bagian hero'
}) => {
  let pathname = '';
  try {
    const location = useLocation();
    pathname = location.pathname;
  } catch {
    // Abaikan jika digunakan di luar konteks router
  }

  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Jangan tampilkan pada rute dashboard admin
  if (pathname.startsWith('/dashboard')) {
    return null;
  }


  // Monitor scroll position dan hitung progress
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    // Tampilkan tombol jika posisi scroll melewati threshold
    setIsVisible(currentScrollY > threshold);

    // Hitung progress scroll dalam persen (0 - 100)
    if (showProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (currentScrollY / docHeight) * 100));
        setScrollProgress(progress);
      }
    }
  }, [threshold, showProgress]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Panggil sekali untuk sinkronisasi state awal
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Aksi scroll halus ke hero / atas halaman
  const scrollToHero = () => {
    const targetElement = targetId ? document.getElementById(targetId) : null;
    if (targetElement) {
      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Konfigurasi SVG progress circle
  const radius = 20;
  const strokeWidth = 2.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 transition-all duration-300 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-6 scale-90 pointer-events-none'
      } ${className}`}
    >
      <div className="relative group">
        {/* Tooltip Hover (Cyber Glass Tag) */}
        {tooltipText && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md text-[11px] font-semibold text-slate-200 border border-slate-700/80 shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-1 group-hover:translate-x-0 hidden sm:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>{tooltipText}</span>
          </div>
        )}

        {/* Tombol Utama Scroll ke Hero */}
        <button
          onClick={scrollToHero}
          type="button"
          aria-label={ariaLabel}
          className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-900/90 hover:bg-slate-950 backdrop-blur-xl border border-slate-700/80 hover:border-blue-400 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 cursor-pointer"
        >
          {/* SVG Progress Ring */}
          {showProgress && (
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
              viewBox="0 0 48 48"
            >
              <defs>
                <linearGradient id="scrollTopRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00d2ff" />
                  <stop offset="100%" stopColor="#126EFE" />
                </linearGradient>
              </defs>
              {/* Background Track Circle */}
              <circle
                cx="24"
                cy="24"
                r={radius}
                className="stroke-slate-700/40"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Active Progress Circle */}
              <circle
                cx="24"
                cy="24"
                r={radius}
                stroke="url(#scrollTopRingGrad)"
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                  transition: 'stroke-dashoffset 150ms ease-out'
                }}
              />
            </svg>
          )}

          {/* Ikon Arrow Up */}
          <FaArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300 group-hover:text-cyan-200 group-hover:-translate-y-0.5 transition-transform duration-200 relative z-10" />
        </button>
      </div>
    </div>
  );
};

export default ScrollTop;
