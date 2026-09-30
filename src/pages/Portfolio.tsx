import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '../components/layout/Layout';
import { Portfolio } from '../components/Portfolio';
import { 
  FaWhatsapp, FaArrowRight, FaRocket, FaCheckCircle, FaLaptopCode, 
  FaGlobe, FaEnvelopeOpenText, FaPalette, FaBookOpen, FaShieldAlt, FaStar 
} from 'react-icons/fa';

// 3D Isometric Cube Icon
const IsometricCubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    {/* Top Face */}
    <path 
      d="M12 2 L21 7.2 L12 12.4 L3 7.2 Z" 
      fill="currentColor" 
      fillOpacity="0.2" 
      stroke="currentColor" 
      strokeWidth="1.3" 
      strokeLinejoin="round" 
    />
    {/* Left Face */}
    <path 
      d="M3 7.2 L12 12.4 L12 22 L3 16.8 Z" 
      fill="currentColor" 
      fillOpacity="0.1" 
      stroke="currentColor" 
      strokeWidth="1.3" 
      strokeLinejoin="round" 
    />
    {/* Right Face */}
    <path 
      d="M12 12.4 L21 7.2 L21 16.8 L12 22 Z" 
      fill="currentColor" 
      fillOpacity="0.15" 
      stroke="currentColor" 
      strokeWidth="1.3" 
      strokeLinejoin="round" 
    />
  </svg>
);

export const PortfolioPage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>Portfolio Karya Terbaik & Hasil Proyek Klien - NexCube Digital</title>
        <meta
          name="description"
          content="Lihat koleksi portfolio hasil karya digital NexCube Digital — website bisnis, undangan digital, desain grafis, dan katalog menu QR."
        />
      </Helmet>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION: 1-FRAME VIEWPORT (100dvh)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="hero" className="relative min-h-[100dvh] lg:h-screen lg:max-h-screen flex flex-col justify-between overflow-hidden bg-[#030712] text-white border-b border-slate-800/80 pt-20 pb-2 sm:pt-24 sm:pb-3 lg:pt-24 lg:pb-3">
        
        {/* Background Aesthetics: Deep Space, Radial Glows & Laser Spline */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#060c20] to-[#040817] pointer-events-none" />

        {/* Ambient Blue & Cyan Glow Orbs */}
        <div className="absolute top-1/4 -left-20 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
        <div 
          className="absolute top-1/3 -right-20 w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] bg-cyan-500/15 rounded-full blur-[160px] pointer-events-none animate-pulse" 
          style={{ animationDelay: '2.5s' }} 
        />

        {/* Glowing Neon Laser Mesh Curve (Matching Landing Hero) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-45 z-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="portfolioLaserGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#126EFE" stopOpacity="0" />
              <stop offset="45%" stopColor="#00d2ff" stopOpacity="0.85" />
              <stop offset="80%" stopColor="#126EFE" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#00d2ff" stopOpacity="0" />
            </linearGradient>
            <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M -100,600 C 250,540 500,400 820,280 C 1120,180 1420,220 1850,90"
            fill="none"
            stroke="url(#portfolioLaserGrad)"
            strokeWidth="3.5"
            filter="url(#laserGlow)"
          />
          <path
            d="M -50,640 C 300,580 550,440 870,320 C 1170,220 1470,250 1900,120"
            fill="none"
            stroke="url(#portfolioLaserGrad)"
            strokeWidth="1.5"
            opacity="0.5"
          />
        </svg>

        {/* Subtle Digital Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.035] pointer-events-none z-0"
          style={{
            backgroundImage: `linear-gradient(#00d2ff 1px, transparent 1px), linear-gradient(90deg, #00d2ff 1px, transparent 1px)`,
            backgroundSize: '54px 54px'
          }}
        />

        {/* Container Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full max-w-7xl flex-1 flex flex-col justify-center my-auto py-2 sm:py-3">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 xl:gap-12 items-center">
            
            {/* ── Left Column: Headline, Copy & 3 Quick Stat Badges ── */}
            <div className={`lg:col-span-7 text-center lg:text-left space-y-4 sm:space-y-5 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}>
              
              {/* Badge Tag */}
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/25 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-300 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.15)] text-left">
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping shrink-0"></span>
                <IsometricCubeIcon className="w-3.5 h-3.5 text-cyan-300" />
                <span className="text-white font-bold tracking-wide">NexCube Showcase</span>
                <span className="text-slate-500">•</span>
                <span className="text-cyan-300 truncate">Industry 5.0 Verified Works</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2.5 sm:space-y-3">
                <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-[2.6rem] xl:text-[3.2rem] font-black text-white tracking-tight leading-[1.15]">
                  Koleksi Hasil Karya <br />
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent inline-block pb-1">
                    Digital Terbaik
                  </span>
                </h1>

                <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                  Jelajahi berbagai proyek website bisnis, aplikasi, undangan digital interaktif, dan desain visual yang telah kami selesaikan dengan standar kualitas internasional.
                </p>
              </div>

              {/* ── 3 Quick Stat Badges (Sesuai Permintaan User) ── */}
              <div className="pt-1 sm:pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 text-xs sm:text-sm font-bold">
                <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-cyan-500/30 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-cyan-300 backdrop-blur-md shadow-xs hover:border-cyan-400/60 transition-colors">
                  <FaRocket className="text-cyan-400 w-3.5 h-3.5" />
                  <span>100+ Proyek Selesai</span>
                </div>

                <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-emerald-500/30 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-emerald-300 backdrop-blur-md shadow-xs hover:border-emerald-400/60 transition-colors">
                  <FaCheckCircle className="text-emerald-400 w-3.5 h-3.5" />
                  <span>99% Kepuasan Klien</span>
                </div>

                <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-amber-500/30 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-amber-300 backdrop-blur-md shadow-xs hover:border-amber-400/60 transition-colors">
                  <FaLaptopCode className="text-amber-400 w-3.5 h-3.5" />
                  <span>Garansi Bug Free</span>
                </div>
              </div>

            </div>

            {/* ── Right Column: 3D Floating CUBE Telemetry Terminal Card ── */}
            <div className={`lg:col-span-5 relative ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-200'}`}>
              <div className="relative bg-[#060c20]/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-[0_0_40px_rgba(0,210,255,0.12)] space-y-3 sm:space-y-3.5">
                
                {/* Terminal Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 text-[10px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                    <span className="text-slate-400 pl-2 font-bold">PORTFOLIO // HUD v5.0</span>
                  </div>
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-[9px] sm:text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    LIVE DEPLOYED
                  </span>
                </div>

                {/* System Specs Overview */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider font-bold">
                    PRODUCTION SPECS & INTEGRITY
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Framework Stack</div>
                      <div className="font-bold text-white text-[11px] mt-0.5">React / Vite / TS</div>
                    </div>
                    <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Lighthouse Speed</div>
                      <div className="font-bold text-emerald-400 text-[11px] mt-0.5">Score 90+ Fast</div>
                    </div>
                  </div>
                </div>

                {/* 4 Category Pill Indicators */}
                <div className="space-y-1.5 pt-0.5">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    DISTRIBUSI KATEGORI PROYEK
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                      <div className="flex items-center gap-2 text-slate-200 font-medium text-[11px] sm:text-xs">
                        <FaGlobe className="text-cyan-400 w-3 h-3" />
                        <span>Website Bisnis & Portal Web</span>
                      </div>
                      <span className="text-cyan-300 font-mono text-[10px] sm:text-[11px] font-bold">50+ Unit</span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                      <div className="flex items-center gap-2 text-slate-200 font-medium text-[11px] sm:text-xs">
                        <FaEnvelopeOpenText className="text-purple-400 w-3 h-3" />
                        <span>Undangan Digital Interaktif</span>
                      </div>
                      <span className="text-purple-300 font-mono text-[10px] sm:text-[11px] font-bold">30+ Unit</span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                      <div className="flex items-center gap-2 text-slate-200 font-medium text-[11px] sm:text-xs">
                        <FaPalette className="text-amber-400 w-3 h-3" />
                        <span>Desain Grafis & Brand Assets</span>
                      </div>
                      <span className="text-amber-300 font-mono text-[10px] sm:text-[11px] font-bold">40+ Aset</span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                      <div className="flex items-center gap-2 text-slate-200 font-medium text-[11px] sm:text-xs">
                        <FaBookOpen className="text-emerald-400 w-3 h-3" />
                        <span>Katalog Menu & Smart QR</span>
                      </div>
                      <span className="text-emerald-300 font-mono text-[10px] sm:text-[11px] font-bold">20+ Modul</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Bottom Explore Beacon Bar */}
        <div className="text-center pt-1 pb-2 sm:pb-3 relative z-10 hidden sm:block">
          <a 
            href="#portfolio-gallery"
            className="inline-flex items-center gap-2 text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-colors uppercase tracking-widest cursor-pointer group"
          >
            <span>Eksplorasi Galeri Karya</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform animate-pulse"></span>
            <svg className="w-3.5 h-3.5 text-cyan-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>

      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          MAIN PORTFOLIO GRID GALLERY (Light Titanium CUBE 5.0 Canvas)
      ═══════════════════════════════════════════════════════════════════════ */}
      <div id="portfolio-gallery" className="py-10 sm:py-16 md:py-20 bg-gradient-to-b from-white via-slate-50/70 to-slate-100/50 relative overflow-hidden">
        
        {/* Subtle Digital Grid Texture */}
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />

        <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-7xl relative z-10">
          
          {/* Main Portfolio Grid */}
          <div className="mb-12 sm:mb-20">
            <Portfolio hideHeader={true} showViewMore={false} />
          </div>

          {/* ═════════════════════════════════════════════════════════════════
              BOTTOM CALL TO ACTION BANNER (CUBE 5.0 Titanium Edition)
          ═════════════════════════════════════════════════════════════════ */}
          <div className="relative bg-white/95 backdrop-blur-xl text-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 overflow-hidden shadow-2xl shadow-slate-900/5 border border-slate-200/90 text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            
            {/* Ambient Lighting in Card */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-300/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-2 sm:space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold text-blue-700 uppercase tracking-wider shadow-2xs">
                <IsometricCubeIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>SIAP MEMULAI PROYEK DIGITAL ANDA?</span>
              </div>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black leading-tight text-slate-900">
                Tertarik Membangun Proyek Seperti Ini Untuk Bisnis Anda?
              </h2>
              <p className="text-slate-600 text-xs sm:text-base leading-relaxed font-medium">
                Tim profesional NexCube siap membantu mewujudkan produk digital berkualitas super cepat, aman, dan siap meningkatkan omzet bisnis Anda.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <a
                href="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20tertarik%20dengan%20portfolio%20Anda%20dan%20ingin%20berkonsultasi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
              >
                <FaWhatsapp className="w-4 h-4 text-emerald-400" />
                <span>Konsultasi WA Gratis</span>
              </a>

              <Link
                to="/paket"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
              >
                <span>Lihat Paket Layanan</span>
                <FaArrowRight className="w-3.5 h-3.5 text-white" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
};

export default PortfolioPage;
