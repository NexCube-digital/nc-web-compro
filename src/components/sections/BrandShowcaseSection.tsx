import React from 'react';
import { FaRocket, FaGem, FaBolt, FaCheckCircle } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

export const BrandShowcaseSection: React.FC = () => {
  const highlights = [
    {
      icon: <FaRocket className="w-5 h-5 sm:w-6 sm:h-6 text-[#126EFE]" />,
      title: 'Inovasi Tanpa Batas',
      subtitle: 'Teknologi Modern & Fast Load',
      desc: 'Pengembangan teknologi modern (React, Tailwind v4, Vite) untuk performa website yang super kencang, aman, dan responsif.',
      accentColor: 'from-[#126EFE] to-blue-600',
      bgIcon: 'bg-blue-50 border-blue-100',
      features: ['Tech Stack Terkini', 'Loading Super Kencang', 'Keamanan Terjamin']
    },
    {
      icon: <FaGem className="w-5 h-5 sm:w-6 sm:h-6 text-[#FBA41C]" />,
      title: 'Kualitas Premium',
      subtitle: 'Standar Desain Internasional',
      desc: 'Desain elegan, user-friendly, ramah SEO, dan berstandar internasional dengan harga lokal terjangkau untuk akselerasi bisnismu.',
      accentColor: 'from-[#FBA41C] to-amber-600',
      bgIcon: 'bg-amber-50 border-amber-100',
      features: ['Desain UI/UX Eksklusif', 'Struktur SEO Friendly', 'Tampilan Ramah HP & PC']
    },
    {
      icon: <FaBolt className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />,
      title: 'Pengerjaan Cepat & Tepat',
      subtitle: 'Proses Transparan 24/7',
      desc: 'Proses pengerjaan transparan, tepat waktu, serta dukungan konsultasi ramah 24/7 untuk memastikan proyek berjalan lancar.',
      accentColor: 'from-emerald-500 to-teal-600',
      bgIcon: 'bg-emerald-50 border-emerald-100',
      features: ['Garansi Tepat Waktu', 'Revisi Ramah & Cepat', 'Konsultasi Gratis 24/7']
    }
  ];

  return (
    <section className="py-8 sm:py-16 md:py-24 bg-gradient-to-b from-blue-50/40 via-white to-slate-50/50 text-slate-900 relative overflow-hidden">
      {/* Soft Ambient Light Effects */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
        
        {/* Section Header Banner (Compact on Mobile) */}
        <div className="max-w-3xl mx-auto text-center mb-7 sm:mb-14 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#126EFE] shadow-xs">
            <HiSparkles className="w-3.5 h-3.5 text-[#FBA41C]" />
            <span>NEXCUBE DIGITAL INDONESIA</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Mitra Strategis <span className="bg-gradient-to-r from-[#126EFE] via-blue-600 to-[#FBA41C] bg-clip-text text-transparent">Transformasi Digital</span> Anda
          </h2>

          <p className="text-slate-600 text-xs sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Kami membantu ribuan pelaku usaha, UMKM, dan perorangan untuk tampil lebih profesional & terpercaya di era digital.
          </p>
        </div>

        {/* 3 Pillars Cards (Compact & Inline Title/Icon on Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6 max-w-6xl mx-auto">
          {highlights.map((item, idx) => (
            <div 
              key={idx}
              className="group relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-2xl hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Top Accent Gradient Line */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${item.accentColor}`}></div>

              <div className="space-y-3 sm:space-y-4">
                {/* Header Row: Icon + Title & Subtitle Samping Icon */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl border ${item.bgIcon} flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-2xs shrink-0`}>
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-xl font-bold text-slate-900 group-hover:text-[#126EFE] transition-colors leading-snug truncate">
                      {item.title}
                    </h3>
                    <div className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-0.5">
                  {item.desc}
                </p>

                {/* Feature Bullet List */}
                <ul className="space-y-1.5 sm:space-y-2 pt-2.5 sm:pt-3 border-t border-slate-100">
                  {item.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-slate-700">
                      <FaCheckCircle className="text-[#126EFE] w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
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
