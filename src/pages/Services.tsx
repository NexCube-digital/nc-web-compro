import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '../components/layout/Layout';
import { FaGlobe, FaEnvelopeOpenText, FaPalette, FaBookOpen, FaArrowRight, FaWhatsapp, FaCheckCircle } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

const services = [
  { 
    title: 'Website Premium & SEO', 
    desc: 'Website kustom, responsif, berkecepatan tinggi & SEO friendly',
    longDesc: 'Kami membangun website bisnis & landing page profesional yang dioptimasi penuh untuk Google SEO, berkecepatan tinggi, serta dilengkapi panel admin untuk kemudahan pengelolaan.',
    badge: 'WEBSITE & E-COMMERCE',
    gradient: 'from-[#126EFE] to-blue-700',
    badgeColor: 'bg-blue-50 text-[#126EFE] border-blue-100',
    icon: <FaGlobe className="w-6 h-6 text-white" />,
    features: [
      'Landing page & website bisnis profesional',
      'Desain 100% responsif di semua perangkat',
      'Optimasi SEO & performa loading super cepat',
      'Panel CMS admin (WP Admin / CPanel)',
      'Terintegrasi tombol WhatsApp & formulir kontak',
      'Sudah termasuk domain & hosting tahun pertama'
    ],
    linkTo: '/paket/website'
  },
  { 
    title: 'Undangan Digital Interaktif', 
    desc: 'E-Invitation elegan untuk pernikahan & acara spesial',
    longDesc: 'Undangan digital interaktif dengan fitur RSVP online, lokasi Google Maps terintegrasi, galeri foto HD, musik background, dan hitung mundur otomatis.',
    badge: 'E-INVITATION & EVENT',
    gradient: 'from-[#FBA41C] to-amber-600',
    badgeColor: 'bg-amber-50 text-[#FBA41C] border-amber-100',
    icon: <FaEnvelopeOpenText className="w-6 h-6 text-white" />,
    features: [
      'Desain template eksklusif & elegan',
      'Fitur RSVP konfirmasi kehadiran online',
      'Peta lokasi venue terintegrasi Google Maps',
      'Galeri album foto momen kenangan',
      'Hitung mundur (countdown timer) ke hari H'
    ],
    linkTo: '/paket/undangan-digital'
  },
  { 
    title: 'Desain Grafis & Branding', 
    desc: 'Visual branding, poster, konten media sosial & UI/UX',
    longDesc: 'Layanan desain grafis profesional untuk kebutuhan komunikasi visual bisnis Anda, mencakup desain logo, brand guidelines, konten sosial media, dan aset cetak HD.',
    badge: 'BRANDING & MARKETING',
    gradient: 'from-rose-500 to-pink-600',
    badgeColor: 'bg-rose-50 text-rose-600 border-rose-100',
    icon: <FaPalette className="w-6 h-6 text-white" />,
    features: [
      'Desain logo & buku panduan identitas visual',
      'Konten feeds & story Instagram/TikTok HD',
      'Banner promosi iklan digital & cetak',
      'Desain kartu nama, kop surat & amplop',
      'Desain antarmuka UI/UX mobile & website'
    ],
    linkTo: '/paket/desain-grafis'
  },
  { 
    title: 'Katalog Digital & QR Menu', 
    desc: 'Menu QR online & katalog produk interaktif',
    longDesc: 'Menu digital untuk restoran dengan scan QR code dan katalog produk online untuk retail, mempermudah pelanggan melihat daftar harga & melakukan pemesanan.',
    badge: 'RESTAURANT & RETAIL',
    gradient: 'from-emerald-500 to-teal-600',
    badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    icon: <FaBookOpen className="w-6 h-6 text-white" />,
    features: [
      'Sistem menu digital dengan barcode QR code',
      'Update daftar menu & harga secara realtime',
      'Hemat biaya cetak kertas jangka panjang',
      'Tampilan foto produk resolusi tinggi',
      'Responsif & cepat dibuka dari browser HP'
    ],
    linkTo: '/paket/menu-katalog'
  }
];

export const Services: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50/40 via-white to-slate-50/50 pt-32 lg:pt-36 pb-16 overflow-hidden">
        <Helmet>
          <title>Panduan & Spesifikasi Layanan - NexCube Digital</title>
          <meta name="description" content="Layanan premium NexCube Digital - website, undangan digital, desain grafis, menu & katalog digital untuk kebutuhan bisnis Anda" />
        </Helmet>
        
        <div className="container mx-auto px-4 md:px-6 max-w-6xl relative">
          
          {/* Ambient Glows */}
          <div className="absolute top-10 left-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Header */}
          <div className={`text-center max-w-3xl mx-auto mb-14 space-y-3 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}>
            
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#126EFE] shadow-xs">
              <HiSparkles className="w-3.5 h-3.5 text-[#FBA41C]" />
              <span>SPESIFIKASI LAYANAN NEXCUBE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Solusi Digital <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#126EFE] via-blue-600 to-[#FBA41C] bg-clip-text text-transparent">
                Terpadu & Profesional
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Kami menyediakan berbagai layanan digital premium yang dapat disesuaikan secara presisi dengan kebutuhan bisnis Anda.
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {services.map((service, index) => (
              <div 
                key={service.title} 
                className={`bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-blue-500/5 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}
                style={{ animationDelay: `${200 + (index * 150)}ms` }}
              >
                {/* Top Accent Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${service.gradient}`} />

                <div>
                  {/* Badge & Icon */}
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-md`}>
                      {service.icon}
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${service.badgeColor}`}>
                      {service.badge}
                    </span>
                  </div>

                  <h2 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-[#126EFE] transition-colors">
                    {service.title}
                  </h2>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                    {service.longDesc}
                  </p>
                  
                  {/* Features List */}
                  <div className="space-y-2.5 mb-8 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                    <div className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Cakupan Fitur Unggulan:</div>
                    {service.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold">
                        <FaCheckCircle className="text-emerald-500 w-3.5 h-3.5 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Bottom CTAs */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link 
                    to={service.linkTo} 
                    className={`flex-1 py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r ${service.gradient} shadow-md flex items-center justify-center gap-2 hover:scale-102 transition-all cursor-pointer`}
                  >
                    <span>Lihat Detail Paket</span>
                    <FaArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <a 
                    href="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20tentang%20layanan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-2xl text-xs font-bold text-slate-700 hover:text-[#126EFE] bg-white border border-slate-200 hover:bg-blue-50/50 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <FaWhatsapp className="w-4 h-4 text-emerald-500" />
                    <span>Konsultasi</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom WhatsApp Help Banner */}
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-[#126EFE] via-blue-600 to-blue-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden space-y-4">
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#FBA41C]/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-amber-300">
                <HiSparkles className="w-3.5 h-3.5 text-[#FBA41C]" />
                <span>BUTUH SOLUSI DIGITAL CUSTOM?</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Diskusikan Kebutuhan Spesifik Bisnis Anda
              </h3>

              <p className="text-blue-100 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                Kami mengerti setiap bisnis memiliki kebutuhan unik. Tim spesialis kami siap membantu merancang solusi kustom untuk Anda.
              </p>

              <div className="pt-2">
                <a 
                  href="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20tentang%20kebutuhan%20digital%20custom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#FBA41C] hover:bg-[#e08d07] text-slate-900 font-extrabold px-7 py-3 rounded-2xl text-xs sm:text-sm shadow-lg transition-all duration-200 hover:scale-105 active:scale-98 cursor-pointer"
                >
                  <FaWhatsapp className="w-4 h-4 text-slate-900" />
                  <span>Hubungi Tim Spesialis</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Services;