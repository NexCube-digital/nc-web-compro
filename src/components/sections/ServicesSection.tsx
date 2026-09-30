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

// 3D Isometric Wireframe Cube Watermark for Card Background (Blue on Hover)
const CubeWatermark: React.FC = () => (
  <svg 
    className="absolute -top-5 -right-5 w-28 h-28 text-slate-400/10 group-hover:text-blue-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 pointer-events-none" 
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

export interface ServicesSectionProps {
  id?: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ id = 'services' }) => {
  const services = [
    {
      id: 'website',
      code: 'CUBE // MOD-01',
      title: 'Website Premium',
      subtitle: 'Company Profile & Web App',
      description: 'Arsitektur web kencang, responsif semua perangkat, SEO-native, dan scalable untuk ekosistem Industry 5.0.',
      icon: <FaCode className="w-5 h-5 text-blue-600" />,
      badge: 'Core Engine',
      features: ['Responsive Fluid Layout (All Devices)', 'SEO Native & Core Web Vitals Ultra Fast', 'Free Domain & Cloud Hosting (1 Thn)'],
      link: '/paket/website'
    },
    {
      id: 'undangan',
      code: 'CUBE // MOD-02',
      title: 'Undangan Digital',
      subtitle: 'Interactive Event & Wedding',
      description: 'Platform undangan interaktif dengan live RSVP WhatsApp cerdas, geolocation map, galeri visual, & audio ambience.',
      icon: <FaEnvelope className="w-5 h-5 text-blue-600" />,
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
      icon: <FaPalette className="w-5 h-5 text-blue-600" />,
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
      icon: <FaBook className="w-5 h-5 text-blue-600" />,
      badge: 'Smart Automation',
      features: ['Instan Scan QR Code Tanpa Aplikasi', 'Real-time Sinkronisasi Menu & Stok', 'Direct Checkout Order ke WhatsApp'],
      link: '/paket/menu-katalog'
    }
  ];

  return (
    <section 
      id={id} 
      className="py-6 sm:py-8 lg:py-12 lg:min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gradient-to-b from-white via-slate-50/70 to-slate-100/50 text-slate-900 relative overflow-hidden border-b border-slate-200/60"
    >
      {/* ── Background Aesthetics: Digital Isometric Grid ── */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Ambient Lighting Glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-300/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-300/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-7xl relative z-10 w-full flex flex-col justify-center">
        
        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-5 sm:mb-8 space-y-1.5 sm:space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs text-slate-800 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
            <IsometricCubeIcon className="w-3.5 h-3.5 text-slate-700" />
            <span>Ekosistem Modular CUBE 5.0</span>
          </div>

          <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Solusi Digital Terpadu Untuk <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-700 bg-clip-text text-transparent">
              Akselerasi Bisnis & Event
            </span>
          </h2>

          <p className="text-slate-600 text-[11px] sm:text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
            Arsitektur modul digital adaptif berkinerja tinggi, dirancang terstruktur untuk mendukung transformasi digital dan skala bisnis Anda di era Industry 5.0.
          </p>
        </div>

        {/* ── Services 4-Card Grid (1 Frame / Blue Hover State) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5">
          {services.map((service) => (
            <div 
              key={service.id}
              className="group relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/90 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs cursor-pointer"
            >
              {/* Cube Wireframe Watermark Background (Glows blue on hover) */}
              <CubeWatermark />

              {/* Blue Glow Top Accent Line on Hover */}
              <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-slate-200 to-transparent group-hover:via-blue-500 group-hover:from-blue-600/40 group-hover:to-cyan-400/40 transition-all duration-300"></div>

              <div className="space-y-3 relative z-10">
                {/* Module Code Header & Badge */}
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">
                    {service.code}
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100/90 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200 border border-slate-200/80 transition-colors shrink-0">
                    {service.badge}
                  </span>
                </div>

                {/* Service Identity: Icon + Title */}
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl border border-slate-200/90 bg-slate-50 group-hover:bg-blue-50 group-hover:border-blue-200 flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-2xs">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {service.title}
                    </h3>
                    <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                      {service.subtitle}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] text-slate-600 leading-relaxed min-h-[2.8rem]">
                  {service.description}
                </p>

                {/* Feature Checklist */}
                <ul className="space-y-1.5 pt-2.5 border-t border-slate-100">
                  {service.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[10px] sm:text-[11px] font-medium text-slate-700">
                      <FaCheckCircle className="text-blue-600 shrink-0 w-3 h-3 mt-0.5" />
                      <span className="leading-tight">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action CTA Button (Turns Blue on Card Hover) */}
              <div className="pt-3.5 relative z-10">
                <Link
                  to={service.link}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 group-hover:bg-blue-600 hover:!bg-blue-700 text-white font-bold text-xs shadow-xs group-hover:shadow-md transition-all duration-300 group/btn cursor-pointer"
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

export default ServicesSection;
