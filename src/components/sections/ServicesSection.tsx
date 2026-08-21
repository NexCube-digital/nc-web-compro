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
      icon: <FaCode className="w-6 h-6 text-[#126EFE]" />,
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
      icon: <FaEnvelope className="w-6 h-6 text-[#FBA41C]" />,
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
      icon: <FaPalette className="w-6 h-6 text-rose-500" />,
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
      icon: <FaBook className="w-6 h-6 text-emerald-600" />,
      badge: 'Smart QR',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      accentColor: 'from-emerald-500 to-teal-600',
      features: ['Scan QR Code Praktis', 'Real-time Update Menu & Stok', 'Order Langsung via WA'],
      link: '/paket/menu-katalog'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-[#126EFE] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs">
            <HiSparkles className="w-3.5 h-3.5 text-[#FBA41C]" />
            <span>Layanan Unggulan Kreatif</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Solusi Digital Terlengkap Untuk <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#126EFE] via-blue-600 to-[#FBA41C] bg-clip-text text-transparent">
              Bisnis & Acara Anda
            </span>
          </h2>

          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Pilih layanan digital berkualitas internasional yang dirancang khusus untuk meningkatkan kredibilitas & omzet bisnis Anda.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div 
              key={service.id}
              className="group relative bg-white rounded-3xl p-6 md:p-7 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-blue-300 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Top Accent Gradient Line */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${service.accentColor}`}></div>

              <div className="space-y-5">
                {/* Icon & Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-13 h-13 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-50 group-hover:border-blue-200 transition-all duration-300 shadow-xs">
                    {service.icon}
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${service.badgeClass} shadow-2xs`}>
                    {service.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#126EFE] transition-colors mb-1">
                    {service.title}
                  </h3>
                  <div className="text-xs font-semibold text-slate-500 mb-2">
                    {service.subtitle}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Feature List */}
                <ul className="space-y-2 pt-3 border-t border-slate-100">
                  {service.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <FaCheckCircle className="text-[#126EFE] shrink-0 w-3.5 h-3.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-6">
                <Link
                  to={service.link}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-50 hover:bg-[#126EFE] text-slate-800 hover:text-white font-bold text-xs sm:text-sm border border-slate-200/80 hover:border-[#126EFE] transition-all duration-300 shadow-xs group-hover:shadow-md"
                >
                  <span>Lihat Detail Paket</span>
                  <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
