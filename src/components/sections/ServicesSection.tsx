import React from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaEnvelope, FaPalette, FaBook, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

export const ServicesSection: React.FC = () => {
  const services = [
    {
      id: 'website',
      title: 'Website Premium',
      subtitle: 'Company Profile & Landing Page',
      description: 'Website profesional super kencang, responsif di semua perangkat, SEO-ready, dan mudah di-update.',
      icon: <FaCode className="w-5 h-5 sm:w-6 sm:h-6 text-[#126EFE]" />,
      badge: 'Terpopuler',
      badgeClass: 'bg-blue-50 text-[#126EFE] border-blue-200',
      accentColor: 'from-[#126EFE] to-blue-600',
      features: ['Responsive All Devices', 'SEO Optimized & Super Fast', 'Free Domain & Hosting (1 Thn)'],
      link: '/paket/website'
    },
    {
      id: 'undangan',
      title: 'Undangan Digital',
      subtitle: 'Pernikahan & Acara Spesial',
      description: 'Undangan web & video interaktif dengan fitur RSVP WhatsApp, peta lokasi, ucapan, & musik.',
      icon: <FaEnvelope className="w-5 h-5 sm:w-6 sm:h-6 text-[#FBA41C]" />,
      badge: 'Favorit',
      badgeClass: 'bg-amber-50 text-[#e08d07] border-amber-200',
      accentColor: 'from-[#FBA41C] to-amber-600',
      features: ['Sistem RSVP & Buku Tamu', 'Integrasi Google Maps & Waze', 'Galeri Foto & Musik Background'],
      link: '/paket/undangan-digital'
    },
    {
      id: 'desain',
      title: 'Desain Grafis',
      subtitle: 'Branding & Media Promosi',
      description: 'Layanan desain kreatif dari identitas brand (Logo, Banner, Feed IG) hingga materi promosi bisnis.',
      icon: <FaPalette className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500" />,
      badge: 'Kreatif',
      badgeClass: 'bg-rose-50 text-rose-600 border-rose-200',
      accentColor: 'from-rose-500 to-pink-600',
      features: ['Brand Identity & Custom Logo', 'Social Media Feed & Banner', 'Revisi Cepat & File HD'],
      link: '/paket/desain-grafis'
    },
    {
      id: 'katalog',
      title: 'Katalog Digital',
      subtitle: 'Menu QR Cafe & Resto',
      description: 'Katalog produk pintar & menu QR cafe/resto dengan pembaruan harga real-time & order langsung via WA.',
      icon: <FaBook className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />,
      badge: 'Smart QR',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      accentColor: 'from-emerald-500 to-teal-600',
      features: ['Scan QR Code Praktis', 'Real-time Update Menu & Stok', 'Order Langsung via WA'],
      link: '/paket/menu-katalog'
    }
  ];

  return (
    <section className="py-8 sm:py-16 md:py-24 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
        
        {/* Section Header (Compact on Mobile) */}
        <div className="text-center max-w-3xl mx-auto mb-7 sm:mb-14 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-[#126EFE] px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-xs">
            <HiSparkles className="w-3.5 h-3.5 text-[#FBA41C]" />
            <span>Layanan Unggulan Kreatif</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Solusi Digital Terlengkap Untuk <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#126EFE] via-blue-600 to-[#FBA41C] bg-clip-text text-transparent">
              Bisnis & Acara Anda
            </span>
          </h2>

          <p className="text-slate-600 text-xs sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Pilih layanan digital berkualitas internasional yang dirancang khusus untuk meningkatkan kredibilitas & omzet bisnis Anda.
          </p>
        </div>

        {/* Services Grid (2 Columns / 2 Banjar on Mobile) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {services.map((service) => (
            <div 
              key={service.id}
              className="group relative bg-white rounded-xl sm:rounded-3xl p-3 sm:p-6 md:p-7 border border-slate-200/90 shadow-2xs hover:shadow-2xl hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Top Accent Gradient Line */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${service.accentColor}`}></div>

              <div className="space-y-2 sm:space-y-4">
                {/* Header Row: Icon + Title/Subtitle & Badge */}
                <div className="flex items-start justify-between gap-1.5">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-13 sm:h-13 rounded-lg sm:rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-50 group-hover:border-blue-200 transition-all duration-300 shadow-2xs shrink-0">
                      {service.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs sm:text-lg font-bold text-slate-900 group-hover:text-[#126EFE] transition-colors leading-snug truncate">
                        {service.title}
                      </h3>
                      <div className="text-[9px] sm:text-xs font-semibold text-slate-500 truncate">
                        {service.subtitle}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[8px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full border ${service.badgeClass} shadow-2xs shrink-0 mt-0.5 truncate`}>
                    {service.badge}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[11px] sm:text-sm text-slate-600 leading-snug pt-0.5">
                  {service.description}
                </p>

                {/* Feature List */}
                <ul className="space-y-1 sm:space-y-2 pt-2 sm:pt-3 border-t border-slate-100">
                  {service.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-slate-700">
                      <FaCheckCircle className="text-[#126EFE] shrink-0 w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="truncate">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-3 sm:pt-6">
                <Link
                  to={service.link}
                  className="w-full inline-flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-2xl bg-slate-50 hover:bg-[#126EFE] text-slate-800 hover:text-white font-bold text-[10px] sm:text-sm border border-slate-200/80 hover:border-[#126EFE] transition-all duration-300 shadow-2xs group-hover:shadow-md cursor-pointer"
                >
                  <span className="truncate">Lihat Detail Paket</span>
                  <FaArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
