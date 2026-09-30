import React from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaEnvelope, FaPalette, FaBook, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

// 3D Isometric Cube Icon for Section Header Badge
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

// 3D Isometric Wireframe Cube Watermark for Card Background
const CubeWatermark: React.FC = () => (
  <svg 
    className="absolute -top-6 -right-6 w-32 h-32 text-slate-400/15 group-hover:text-slate-600/25 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 pointer-events-none" 
    viewBox="0 0 100 100" 
    fill="none" 
    stroke="currentColor"
  >
    {/* Top Diamond Wireframe */}
    <path d="M50 10 L85 30 L50 50 L15 30 Z" strokeWidth="1.5" strokeDasharray="3 3" />
    {/* Left Isometric Wall */}
    <path d="M15 30 L50 50 L50 90 L15 70 Z" strokeWidth="1.5" />
    {/* Right Isometric Wall */}
    <path d="M50 50 L85 30 L85 70 L50 90 Z" strokeWidth="1.5" />
    {/* Internal Core Nodes */}
    <circle cx="50" cy="50" r="3.5" fill="currentColor" />
    <line x1="50" y1="50" x2="50" y2="10" strokeWidth="1" opacity="0.5" />
    <line x1="50" y1="50" x2="15" y2="70" strokeWidth="1" opacity="0.5" />
    <line x1="50" y1="50" x2="85" y2="70" strokeWidth="1" opacity="0.5" />
  </svg>
);

export const ServicesSection: React.FC = () => {
  const services = [
    {
      id: 'website',
      code: 'CUBE // MOD-01',
      title: 'Website Premium',
      subtitle: 'Company Profile & Web App',
      description: 'Arsitektur web kencang, responsif semua perangkat, SEO-native, dan scalable untuk ekosistem Industry 5.0.',
      icon: <FaCode className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />,
      bgIcon: 'bg-blue-50/90 border-blue-100',
      badge: 'Core Engine',
      features: ['Responsive Fluid Layout (All Devices)', 'SEO Native & Core Web Vitals Ultra Fast', 'Free Domain & Cloud Hosting (1 Thn)'],
      link: '/paket/website'
    },
    {
      id: 'undangan',
      code: 'CUBE // MOD-02',
      title: 'Undangan Digital',
      subtitle: 'Interactive Event & Wedding',
      description: 'Platform undangan interaktif dengan fitur live RSVP WhatsApp cerdas, geolocation map, galeri visual, & audio ambience.',
      icon: <FaEnvelope className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />,
      bgIcon: 'bg-purple-50/90 border-purple-100',
      badge: 'Interactive Event',
      features: ['Sistem RSVP & Buku Tamu WhatsApp', 'Integrasi Google Maps & Waze Sync', 'Galeri Visual HD & Custom Background Audio'],
      link: '/paket/undangan-digital'
    },
    {
      id: 'desain',
      code: 'CUBE // MOD-03',
      title: 'Desain Grafis',
      subtitle: 'Brand Identity & Visual Asset',
      description: 'Desain visual presisi tinggi dari brand identity (Logo, Guideline, Feed Social) hingga materi komersial.',
      icon: <FaPalette className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />,
      bgIcon: 'bg-amber-50/90 border-amber-100',
      badge: 'Creative Visual',
      features: ['Brand Identity & Precision Vector Logo', 'Social Media Dynamic Feed & Banner', 'Iterasi Cepat & Source File Resolusi HD'],
      link: '/paket/desain-grafis'
    },
    {
      id: 'katalog',
      code: 'CUBE // MOD-04',
      title: 'Katalog Digital',
      subtitle: 'Smart QR Menu & Commerce',
      description: 'Katalog digital pintar & menu QR cafe/resto dengan pembaruan harga instan & direct ordering ke WhatsApp.',
      icon: <FaBook className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />,
      bgIcon: 'bg-emerald-50/90 border-emerald-100',
      badge: 'Smart Automation',
      features: ['Instan Scan QR Code Tanpa Aplikasi', 'Real-time Sinkronisasi Menu & Stok', 'Direct Checkout Order ke WhatsApp'],
      link: '/paket/menu-katalog'
    }
  ];

  return (
    <section className="py-10 sm:py-16 md:py-24 bg-gradient-to-b from-white via-slate-50/70 to-slate-100/50 text-slate-900 relative overflow-hidden border-b border-slate-200/60">
      {/* ── Background Aesthetics: Digital Isometric Grid ── */}
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      ></div>

      {/* Soft Ambient Light Glows */}
      <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-slate-300/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-[450px] h-[450px] bg-indigo-200/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-slate-800 text-[11px] sm:text-xs font-bold tracking-wider uppercase">
            <IsometricCubeIcon className="w-3.5 h-3.5 text-slate-700" />
            <span>Ekosistem Modular CUBE 5.0</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Solusi Digital Terpadu Untuk <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent">
              Akselerasi Bisnis & Event
            </span>
          </h2>

          <p className="text-slate-600 text-xs sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Arsitektur modul digital adaptif berkinerja tinggi, dirancang terstruktur untuk mendukung transformasi digital dan skala bisnis Anda di era Industry 5.0.
          </p>
        </div>

        {/* Services Grid (2 Columns on mobile, 4 Columns on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {services.map((service) => (
            <div 
              key={service.id}
              className="group relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 border border-slate-200/90 hover:border-slate-400/80 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs"
            >
              {/* Cube Wireframe Watermark Background */}
              <CubeWatermark />

              {/* Subtle Titanium Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-slate-300 to-transparent group-hover:via-slate-600 transition-all duration-300"></div>

              <div className="space-y-3 sm:space-y-4 relative z-10">
                {/* Module Code Header & Badge */}
                <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 group-hover:text-slate-700 transition-colors">
                    {service.code}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100/90 text-slate-700 border border-slate-200/80 shrink-0">
                    {service.badge}
                  </span>
                </div>

                {/* Service Identity: Icon + Title */}
                <div className="space-y-2.5">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border ${service.bgIcon} flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-2xs`}>
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-lg font-bold text-slate-900 group-hover:text-slate-800 transition-colors leading-snug">
                      {service.title}
                    </h3>
                    <div className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">
                      {service.subtitle}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed min-h-[2.5rem]">
                  {service.description}
                </p>

                {/* Feature Checklist */}
                <ul className="space-y-2 pt-3 border-t border-slate-100">
                  {service.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[11px] sm:text-xs font-medium text-slate-700">
                      <FaCheckCircle className="text-slate-700 shrink-0 w-3 h-3 sm:w-3.5 sm:h-3.5 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action CTA Button */}
              <div className="pt-4 sm:pt-6 relative z-10">
                <Link
                  to={service.link}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all duration-300 group/btn cursor-pointer"
                >
                  <span>Lihat Detail Modul</span>
                  <FaArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform shrink-0" />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
