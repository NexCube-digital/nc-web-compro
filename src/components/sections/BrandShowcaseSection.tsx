import React from 'react';
import { FaRocket, FaGem, FaBolt, FaCheckCircle } from 'react-icons/fa';

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

export const BrandShowcaseSection: React.FC = () => {
  const highlights = [
    {
      code: 'PILLAR // 01',
      icon: <FaRocket className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />,
      bgIcon: 'bg-blue-50/90 border-blue-100',
      title: 'Inovasi Tanpa Batas',
      subtitle: 'Modern High-Speed Stack',
      desc: 'Pengembangan teknologi modern (React, Tailwind, Vite) untuk performa website super kencang, aman, dan responsif di era Industry 5.0.',
      features: ['Tech Stack Modern Terkini', 'Ultra Fast Core Web Vitals', 'Arsitektur Keamanan Terjamin']
    },
    {
      code: 'PILLAR // 02',
      icon: <FaGem className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />,
      bgIcon: 'bg-indigo-50/90 border-indigo-100',
      title: 'Kualitas Presisi & Elegan',
      subtitle: 'Standar Desain Internasional',
      desc: 'Desain visual berkelas, user-friendly, dan berstandar internasional yang disesuaikan secara strategis untuk mendongkrak reputasi brand.',
      features: ['Desain UI/UX Eksklusif & Bersih', 'Struktur SEO-Native Optimal', 'Tampilan Sempurna di HP & Desktop']
    },
    {
      code: 'PILLAR // 03',
      icon: <FaBolt className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />,
      bgIcon: 'bg-emerald-50/90 border-emerald-100',
      title: 'Eksekusi Cepat & Terukur',
      subtitle: 'Proses Transparan 24/7',
      desc: 'Proses pengerjaan transparan, timeline presisi, serta dukungan konsultasi teknis responsif 24/7 untuk menjamin keberhasilan proyek Anda.',
      features: ['Garansi Tepat Waktu (On-Time)', 'Revisi Ramah & Cepat Tanggap', 'Pendampingan Konsultasi 24/7']
    }
  ];

  return (
    <section className="py-10 sm:py-16 md:py-24 bg-gradient-to-b from-slate-100/40 via-white to-slate-50/60 text-slate-900 relative overflow-hidden border-b border-slate-200/60">
      {/* ── Background Aesthetics: Digital Isometric Grid Matching Services ── */}
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      ></div>

      {/* Soft Ambient Light Effects */}
      <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-slate-300/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-[450px] h-[450px] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-14 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-slate-800 text-[11px] sm:text-xs font-bold tracking-wider uppercase">
            <IsometricCubeIcon className="w-3.5 h-3.5 text-slate-700" />
            <span>NEXCUBE 5.0 ECOSYSTEM</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Mitra Strategis <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent">
              Transformasi Digital Anda
            </span>
          </h2>

          <p className="text-slate-600 text-xs sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Sinergi teknologi modern dan keahlian manusia (Human-Cyber Synergy) untuk membangun aset digital yang tangguh, kredibel, dan siap berkembang di era Industry 5.0.
          </p>
        </div>

        {/* 3 Pillars Cards (Matching Services & Hero Aesthetic) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6 max-w-6xl mx-auto">
          {highlights.map((item, idx) => (
            <div 
              key={idx}
              className="group relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 border border-slate-200/90 hover:border-slate-400/80 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs"
            >
              {/* Cube Wireframe Watermark Background */}
              <CubeWatermark />

              {/* Subtle Titanium Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-slate-300 to-transparent group-hover:via-slate-600 transition-all duration-300"></div>

              <div className="space-y-3.5 relative z-10">
                {/* Pillar Code Header */}
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 group-hover:text-slate-700 transition-colors">
                    {item.code}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-slate-700 transition-colors"></span>
                </div>

                {/* Icon & Title Row */}
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border ${item.bgIcon} flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-2xs shrink-0`}>
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-slate-800 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <div className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed min-h-[2.5rem]">
                  {item.desc}
                </p>

                {/* Feature Bullet List */}
                <ul className="space-y-2 pt-3 border-t border-slate-100">
                  {item.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-[11px] sm:text-xs font-medium text-slate-700">
                      <FaCheckCircle className="text-slate-700 shrink-0 w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
