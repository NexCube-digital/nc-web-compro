import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPlay, FaArrowRight, FaGlobe, FaPalette, FaEnvelopeOpenText, FaBookOpen, 
  FaRocket, FaUsers, FaChartLine, FaHeadset, FaCheck 
} from 'react-icons/fa';
import { useCountUp } from '../../hooks/useCountUp';

interface HeroSectionProps {
  onExploreClick?: (e: React.MouseEvent) => void;
}

interface HeroStatCounterProps {
  number: number;
  suffix: string;
  gradientClass?: string;
}

const HeroStatCounter: React.FC<HeroStatCounterProps> = React.memo(({ number, suffix, gradientClass }) => {
  const { formattedValue, elementRef } = useCountUp({
    end: number,
    duration: 2.2,
    suffix: suffix,
    enableScrollTrigger: true
  });

  return (
    <div 
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r ${gradientClass || 'from-white to-slate-200'} bg-clip-text text-transparent tracking-tight leading-none`}
    >
      {formattedValue()}
    </div>
  );
});
HeroStatCounter.displayName = 'HeroStatCounter';

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick }) => {
  const stats = [
    { 
      number: 50, suffix: '+', label: 'Proyek Selesai', 
      sublabel: 'Solusi Digital Dideploy',
      icon: <FaRocket className="w-3.5 h-3.5 text-cyan-400" />,
      bgIcon: 'bg-cyan-500/10 border-cyan-500/30',
      gradientClass: 'from-cyan-300 via-blue-400 to-blue-500',
      badge: 'Terverifikasi',
      badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
    },
    { 
      number: 30, suffix: '+', label: 'Klien Puas', 
      sublabel: 'UMKM & Perusahaan',
      icon: <FaUsers className="w-3.5 h-3.5 text-amber-400" />,
      bgIcon: 'bg-amber-500/10 border-amber-500/30',
      gradientClass: 'from-amber-300 via-amber-400 to-orange-400',
      badge: '98% Retention',
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    },
    { 
      number: 99, suffix: '%', label: 'Success Rate', 
      sublabel: 'Performa Kecepatan',
      icon: <FaChartLine className="w-3.5 h-3.5 text-emerald-400" />,
      bgIcon: 'bg-emerald-500/10 border-emerald-500/30',
      gradientClass: 'from-emerald-300 via-teal-400 to-emerald-500',
      badge: 'Top Performance',
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    },
    { 
      number: 24, suffix: '/7', label: 'Support Responsif', 
      sublabel: 'Pendampingan Ramah',
      icon: <FaHeadset className="w-3.5 h-3.5 text-indigo-400" />,
      bgIcon: 'bg-indigo-500/10 border-indigo-500/30',
      gradientClass: 'from-indigo-300 via-purple-400 to-indigo-400',
      badge: 'Always Active',
      badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
    }
  ];
  return (
    <section id="hero" className="relative min-h-[100dvh] pt-28 pb-10 sm:pt-32 sm:pb-14 lg:pt-36 lg:pb-16 flex flex-col justify-between overflow-x-clip bg-[#030712] text-white">
      {/* ── Background Aesthetics: Deep Space, Radial Glows & Laser Spline ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#060c20] to-[#040817] pointer-events-none"></div>

      {/* Futuristic Blue & Cyan Ambient Glow Orbs */}
      <div className="absolute top-1/4 -left-20 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/3 -right-20 w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] bg-cyan-500/15 rounded-full blur-[160px] pointer-events-none animate-pulse" style={{ animationDelay: '2.5s' }}></div>

      {/* Glowing Neon Laser Mesh Curve (Matching Reference Image) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50 z-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="heroLaserGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#126EFE" stopOpacity="0" />
            <stop offset="45%" stopColor="#00d2ff" stopOpacity="0.85" />
            <stop offset="80%" stopColor="#126EFE" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00d2ff" stopOpacity="0" />
          </linearGradient>
          <filter id="laserGlowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Main sweeping luminous neon laser curve */}
        <path
          d="M -100,680 C 250,620 500,450 820,320 C 1120,200 1420,240 1850,110"
          fill="none"
          stroke="url(#heroLaserGrad)"
          strokeWidth="3.5"
          filter="url(#laserGlowEffect)"
        />
        {/* Secondary subtle wave curve */}
        <path
          d="M -50,720 C 300,660 550,500 870,360 C 1170,240 1470,270 1900,150"
          fill="none"
          stroke="url(#heroLaserGrad)"
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
      ></div>

      {/* Main Container Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full max-w-7xl flex-1 flex flex-col justify-center">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-14 items-center w-full">
          
          {/* ── Left Column: Clean High-Converting Copy (Matching Image) ── */}
          <div className="lg:col-span-7 min-w-0 w-full text-center lg:text-left space-y-5 sm:space-y-6">
            
            {/* NexCube Digital Industry 5.0 Tag */}
            <div className="inline-flex max-w-full items-center gap-2 bg-blue-500/10 border border-blue-400/25 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold text-blue-300 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.15)] text-left">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping shrink-0"></span>
              <img src="/images/NexCube-full.png" alt="NexCube Digital" className="h-4 w-auto object-contain shrink-0" />
              <span className="text-white font-bold tracking-wide shrink-0">NexCube Digital</span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-300 truncate">Industry 5.0 Digital Platform</span>
            </div>

            {/* Main Headline: Grow Your Business Online (Matching Image) */}
            <div className="space-y-3 w-full">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[3.9rem] font-black text-white tracking-tight leading-[1.1] break-words [overflow-wrap:anywhere]">
                Grow Your <br />
                <span className="text-white drop-shadow-sm">Business </span>
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent inline-block pb-1">
                  Online
                </span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal break-words [overflow-wrap:anywhere]">
                We deliver innovative digital solutions — pembuatan <span className="text-cyan-300 font-semibold">Website Custom</span>, <span className="text-blue-400 font-semibold">Desain Grafis</span>, <span className="text-rose-400 font-semibold">Undangan Digital</span>, & <span className="text-emerald-400 font-semibold">Katalog Produk Cerdas</span> bertenaga ekosistem NexCube Digital Industry 5.0.
              </p>
            </div>

            {/* Action Buttons: Get Started + Watch Video (Matching Image) */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center pt-2 w-full max-w-md mx-auto lg:mx-0">
              {/* Primary Glowing Blue Pill Button ("Get Started") */}
              <button
                onClick={onExploreClick}
                className="group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-[0_0_28px_rgba(37,99,235,0.6)] hover:shadow-[0_0_38px_rgba(56,189,248,0.8)] transition-all duration-300 hover:scale-103 active:scale-98 cursor-pointer shrink-0"
              >
                <span>Get Started</span>
                <FaArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary Circular Play + Text Pill ("Watch Video" / "Konsultasi WA") */}
              <Link
                to="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20mengenai%20solusi%20digital"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 w-full sm:w-auto px-5 py-3 rounded-full text-slate-200 hover:text-white font-semibold text-sm sm:text-base transition-all duration-200 hover:bg-white/5 cursor-pointer shrink-0"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/20 group-hover:border-cyan-400 group-hover:bg-cyan-500/20 text-cyan-300 shadow-md group-hover:scale-110 transition-all">
                  <FaPlay className="w-3.5 h-3.5 translate-x-0.5" />
                </div>
                <span>Watch Video & WA</span>
              </Link>
            </div>
          </div>

          {/* ── Right Column: 3D Glassmorphism Showcase Card (Matching Image) ── */}
          <div className="lg:col-span-5 min-w-0 w-full relative flex items-center justify-center">
            
            {/* Ambient Card Backlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/25 via-cyan-400/20 to-indigo-600/25 rounded-3xl blur-2xl transform rotate-1 scale-95 pointer-events-none"></div>

            {/* Futuristic Glass Card */}
            <div className="relative w-full max-w-md lg:max-w-full xl:max-w-md bg-[#0a1226]/75 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden transition-all duration-300 hover:border-cyan-400/40 group">
              
              {/* Card Header: +68% Growth Pill */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">NEXCUBE ANALYTICS</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs sm:text-sm font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                  <span>+ 68% Growth</span>
                  <svg className="w-4 h-4 text-cyan-300 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>

              {/* Glowing SVG Analytics Chart with Spline & Ascending Bars */}
              <div className="relative w-full aspect-[16/9] mb-4 bg-slate-950/40 rounded-2xl border border-white/5 p-2 overflow-hidden flex items-center justify-center">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 380 180" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    {/* Curve Gradient */}
                    <linearGradient id="chartCurveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#126EFE" />
                      <stop offset="60%" stopColor="#00d2ff" />
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>

                    {/* Area Fill Gradient */}
                    <linearGradient id="chartAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.25" />
                      <stop offset="70%" stopColor="#126EFE" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#126EFE" stopOpacity="0" />
                    </linearGradient>

                    {/* Rising Bars Gradients */}
                    <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#126EFE" stopOpacity="0.25" />
                    </linearGradient>

                    {/* Neon Glow Filter */}
                    <filter id="neonChartGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="glow" />
                      <feMerge>
                        <feMergeNode in="glow" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Horizontal Subtle Grid Lines */}
                  <line x1="20" y1="35" x2="365" y2="35" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                  <line x1="20" y1="75" x2="365" y2="75" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                  <line x1="20" y1="115" x2="365" y2="115" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                  <line x1="20" y1="155" x2="365" y2="155" stroke="rgba(255,255,255,0.08)" />

                  {/* Y-Axis Indicator Numbers */}
                  <text x="8" y="38" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">50k</text>
                  <text x="8" y="78" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">30k</text>
                  <text x="8" y="118" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">10k</text>

                  {/* 5 Rising Vertical Glow Bars (Matching Reference Image) */}
                  <rect x="225" y="90" width="16" height="65" rx="5" fill="url(#barGrad)" opacity="0.65" />
                  <rect x="255" y="68" width="16" height="87" rx="5" fill="url(#barGrad)" opacity="0.75" />
                  <rect x="285" y="48" width="16" height="107" rx="5" fill="url(#barGrad)" opacity="0.85" />
                  <rect x="315" y="32" width="16" height="123" rx="5" fill="url(#barGrad)" opacity="0.95" />
                  <rect x="345" y="18" width="16" height="137" rx="5" fill="url(#barGrad)" />

                  {/* Chart Area Gradient Fill */}
                  <path
                    d="M 25,140 C 75,130 105,115 145,95 C 185,75 220,85 260,55 C 295,32 325,24 358,16 L 358,155 L 25,155 Z"
                    fill="url(#chartAreaGrad)"
                  />

                  {/* Glowing Neon Spline Curve Line */}
                  <path
                    d="M 25,140 C 75,130 105,115 145,95 C 185,75 220,85 260,55 C 295,32 325,24 358,16"
                    fill="none"
                    stroke="url(#chartCurveGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    filter="url(#neonChartGlow)"
                  />

                  {/* Glowing Peak Data Node with Arrow */}
                  <circle cx="358" cy="16" r="5" fill="#ffffff" filter="url(#neonChartGlow)" />
                  <circle cx="358" cy="16" r="10" fill="#00d2ff" fillOpacity="0.3" className="animate-ping" />
                </svg>
              </div>

              {/* 4 Bottom Glass Tech Chips: Website, Design Grafis, Undangan Digital, Katalog Digital */}
              <div className="grid grid-cols-4 gap-2 sm:gap-2.5 pt-1">
                {/* 1. Website */}
                <div className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 hover:bg-cyan-500/10 transition-all duration-300 group/chip cursor-pointer">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-cyan-300 mb-1 group-hover/chip:scale-110 transition-transform">
                    <FaGlobe className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 truncate w-full text-center">Website</span>
                </div>

                {/* 2. Design Grafis */}
                <div className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-amber-500/10 transition-all duration-300 group/chip cursor-pointer">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 mb-1 group-hover/chip:scale-110 transition-transform">
                    <FaPalette className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 truncate w-full text-center">Design Grafis</span>
                </div>

                {/* 3. Undangan Digital */}
                <div className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-400/40 hover:bg-rose-500/10 transition-all duration-300 group/chip cursor-pointer">
                  <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 mb-1 group-hover/chip:scale-110 transition-transform">
                    <FaEnvelopeOpenText className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 truncate w-full text-center">Undangan Digital</span>
                </div>

                {/* 4. Katalog Digital */}
                <div className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/40 hover:bg-emerald-500/10 transition-all duration-300 group/chip cursor-pointer">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 mb-1 group-hover/chip:scale-110 transition-transform">
                    <FaBookOpen className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 truncate w-full text-center">Katalog Digital</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Docked Key Statistics Bar (Compact Pill Style) ── */}
        <div className="w-full max-w-5xl mx-auto mt-6 sm:mt-8 rounded-xl sm:rounded-2xl bg-[#070e22]/85 backdrop-blur-xl border border-white/10 px-3 py-2 sm:px-4 sm:py-2.5 shadow-xl relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 divide-y sm:divide-y-0 lg:divide-x divide-white/10">
            {stats.map((stat, idx) => (
              <div 
                key={idx}
                className={`flex flex-col justify-between p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-white/[0.04] transition-all duration-300 group ${idx > 0 ? 'lg:pl-4' : ''} ${idx === 1 ? 'pt-1.5 sm:pt-2' : ''}`}
              >
                <div className="flex items-center justify-between gap-1 mb-1 sm:mb-1.5">
                  <div className={`p-1.5 rounded-lg border ${stat.bgIcon} group-hover:scale-105 transition-transform duration-300 shadow-xs`}>
                    {stat.icon}
                  </div>
                  <span className={`text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${stat.badgeClass} flex items-center gap-1 shrink-0`}>
                    <FaCheck className="w-1.5 h-1.5 opacity-80" />
                    {stat.badge}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <HeroStatCounter number={stat.number} suffix={stat.suffix} gradientClass={stat.gradientClass} />
                  <div className="text-[11px] sm:text-xs font-bold text-white tracking-tight leading-tight">
                    {stat.label}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium truncate">
                    {stat.sublabel}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
