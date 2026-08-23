import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HiSparkles, HiCheckCircle, HiShieldCheck } from 'react-icons/hi';
import { FaGlobe, FaEnvelopeOpenText, FaPalette, FaBookOpen, FaArrowRight, FaWhatsapp, FaRocket, FaClock, FaHeadset } from 'react-icons/fa';

export const Paket: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const categoryHub = [
    {
      id: 'website',
      title: 'Website Premium',
      subtitle: 'Solusi Website Kustom & Company Profile Berstandar Internasional',
      badge: 'PROFIL & E-COMMERCE',
      badgeColor: 'bg-blue-50 text-[#126EFE] border-blue-100',
      gradient: 'from-[#126EFE] to-blue-700',
      icon: <FaGlobe className="w-6 h-6 text-white" />,
      startingPrice: 'Rp 300.000',
      tierCount: '5 Pilihan Tier (Student s/d Platinum)',
      features: [
        'Termasuk Sewa Domain & Hosting Tahun Pertama',
        'Desain Responsif (Smartphone, Tablet, Desktop)',
        'Dukungan Optimasi SEO & Loading Cepat',
        'Terintegrasi Tombol WhatsApp & Media Sosial',
        'Panel Kelola Admin (WP Admin / CPanel)'
      ],
      route: '/paket/website',
      ctaText: 'Jelajahi Paket Website'
    },
    {
      id: 'undangan',
      title: 'Undangan Digital',
      subtitle: 'E-Invitation Interaktif & Elegan untuk Momen Acara Spesial',
      badge: 'ACARA & ACARA PRIBADI',
      badgeColor: 'bg-amber-50 text-[#FBA41C] border-amber-100',
      gradient: 'from-[#FBA41C] to-amber-600',
      icon: <FaEnvelopeOpenText className="w-6 h-6 text-white" />,
      startingPrice: 'Rp 150.000',
      tierCount: '3 Pilihan Paket Tema',
      features: [
        'Konfirmasi Kehadiran Tamu (RSVP Online)',
        'Navigasi Lokasi Peta via Google Maps',
        'Hitung Mundur Acara (Countdown Timer)',
        'Galeri Foto Kenangan & Audio Musik Background',
        'Buku Tamu Ucapan & Amplop Digital'
      ],
      route: '/paket/undangan-digital',
      ctaText: 'Jelajahi Paket Undangan'
    },
    {
      id: 'desain',
      title: 'Desain Grafis & Branding',
      subtitle: 'Identitas Visual Profesional & Aset Pemasaran Kualitas HD',
      badge: 'BRANDING & MARKETING',
      badgeColor: 'bg-rose-50 text-rose-600 border-rose-100',
      gradient: 'from-rose-500 to-pink-600',
      icon: <FaPalette className="w-6 h-6 text-white" />,
      startingPrice: 'Rp 50.000',
      tierCount: 'Layanan Kustom per Project',
      features: [
        'Desain Logo & Panduan Brand Guidelines',
        'Konten Feed & Story Instagram/TikTok',
        'Banner Promosi & Iklan Digital',
        'Brosur, Flyer, & Katalog Cetak HD',
        'Desain Antarmuka UI/UX Mobile & Web'
      ],
      route: '/paket/desain-grafis',
      ctaText: 'Jelajahi Paket Desain'
    },
    {
      id: 'katalog',
      title: 'Katalog & Menu Digital QR',
      subtitle: 'Sistem Menu QR Online & Katalog Produk Interaktif Resto/Store',
      badge: 'RESTAURANT & RETAIL',
      badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      gradient: 'from-emerald-500 to-teal-600',
      icon: <FaBookOpen className="w-6 h-6 text-white" />,
      startingPrice: 'Rp 250.000',
      tierCount: '3 Paket Sistem QR',
      features: [
        'Akses Scan QR Code Sekali Klik dari HP',
        'Update Harga & Stok Menu Tanpa Cetak Ulang',
        'Tampilan Foto Produk High Resolution',
        'Kategori Menu & Fitur Filter Produk',
        'Hemat Biaya Operasional Cetak Kertas'
      ],
      route: '/paket/menu-katalog',
      ctaText: 'Jelajahi Paket Katalog'
    }
  ];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-blue-50/40 via-white to-slate-50/50 pt-28 pb-16 overflow-hidden">
        <Helmet>
          <title>Katalog Paket Layanan Digital - NexCube Digital</title>
          <meta name="description" content="Pusat informasi paket layanan digital NexCube Digital: Website, Undangan Digital, Desain Grafis, dan Katalog Digital QR." />
        </Helmet>

        <div className="container mx-auto px-4 md:px-6 relative">
          
          {/* Background Ambient Glows */}
          <div className="absolute top-10 left-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Hero Header */}
          <div className={`text-center max-w-4xl mx-auto mb-16 space-y-4 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}>
            
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#126EFE] shadow-xs">
              <HiSparkles className="w-3.5 h-3.5 text-[#FBA41C]" />
              <span>HUB LAYANAN DIGITAL NEXCUBE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Pilih Kategori Layanan <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#126EFE] via-blue-600 to-[#FBA41C] bg-clip-text text-transparent">
                Digital Terbaik Anda
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Jelajahi 4 kategori utama layanan digital kami. Setiap kategori dilengkapi dengan daftar tier paket terperinci, fitur transparan, dan garansi resmi.
            </p>

            {/* Trust Pills Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-700 pt-3">
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-2xs">
                <HiShieldCheck className="text-emerald-500 w-4 h-4" />
                <span>100% Bebas Biaya Tersembunyi</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-2xs">
                <FaClock className="text-[#126EFE] w-3.5 h-3.5" />
                <span>Pengerjaan Tepat Waktu</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-2xs">
                <FaHeadset className="text-[#FBA41C] w-3.5 h-3.5" />
                <span>Support Selama Berlangganan</span>
              </div>
            </div>

          </div>

          {/* 4 Category Hub Cards Grid - 2 Columns (2 Banjar) on Mobile */}
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-8 mb-20">
            {categoryHub.map((cat) => (
              <div 
                key={cat.id}
                className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 border border-slate-200/90 shadow-xl shadow-blue-500/5 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Accent Gradient Line */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${cat.gradient}`}></div>

                <div>
                  {/* Card Badge & Icon */}
                  <div className="flex items-start justify-between gap-2 mb-3 sm:mb-5">
                    <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-md shrink-0`}>
                      {cat.icon}
                    </div>
                    <span className={`text-[9px] sm:text-[11px] font-black uppercase tracking-wider px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border ${cat.badgeColor} shrink-0 truncate`}>
                      {cat.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h2 className="text-base sm:text-2xl font-black text-slate-900 mb-1 sm:mb-2 group-hover:text-[#126EFE] transition-colors leading-snug">
                    {cat.title}
                  </h2>
                  <p className="text-slate-600 text-[11px] sm:text-sm leading-relaxed mb-3 sm:mb-6 font-medium">
                    {cat.subtitle}
                  </p>

                  {/* Price & Tier Count */}
                  <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-slate-100 mb-3 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
                    <div>
                      <div className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mulai Dari</div>
                      <div className="text-sm sm:text-xl font-black bg-gradient-to-r from-[#126EFE] to-blue-700 bg-clip-text text-transparent">
                        {cat.startingPrice}
                      </div>
                    </div>
                    <div className="text-[10px] sm:text-xs font-extrabold text-slate-600 bg-white border border-slate-200 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl shadow-2xs truncate">
                      {cat.tierCount}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-1.5 sm:space-y-2.5 mb-4 sm:mb-8">
                    <div className="text-[10px] sm:text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Fitur Utama:</div>
                    {cat.features.slice(0, 3).map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-xs text-slate-700 font-semibold">
                        <HiCheckCircle className="text-emerald-500 w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Action Button */}
                <Link
                  to={cat.route}
                  className={`w-full py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-sm font-extrabold text-white bg-gradient-to-r ${cat.gradient} shadow-md flex items-center justify-center gap-1.5 sm:gap-2 hover:scale-102 transition-all cursor-pointer`}
                >
                  <span className="truncate">{cat.ctaText}</span>
                  <FaArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                </Link>

              </div>
            ))}
          </div>

          {/* Workflow Guide Section */}
          <div className="max-w-5xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm mb-20">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#126EFE]">
                <FaRocket className="w-3.5 h-3.5 text-[#FBA41C]" />
                <span>ALUR KERJA PRAKTIS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                4 Langkah Mudah Memulai Proyek Digital
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Pilih Kategori', desc: 'Pilih kategori & tier paket yang sesuai dengan kebutuhan dan anggaran Anda.' },
                { step: '02', title: 'Diskusi & Brief', desc: 'Tim kami mendiskusikan materi konten, preferensi warna, dan struktur desain.' },
                { step: '03', title: 'Pengerjaan Cepat', desc: 'Proses pengembangan dilakukan secara profesional dengan kabar berkala.' },
                { step: '04', title: 'Peluncuran & Support', desc: 'Website/aplikasi siap digunakan dengan garansi perbaikan bug resmi.' }
              ].map((s, idx) => (
                <div key={idx} className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 space-y-2 text-center">
                  <div className="text-2xl font-black text-[#126EFE]">{s.step}</div>
                  <h3 className="font-extrabold text-sm text-slate-900">{s.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom WhatsApp Help Banner */}
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-[#126EFE] via-blue-600 to-blue-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden space-y-4">
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#FBA41C]/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-amber-300">
                <HiSparkles className="w-3.5 h-3.5 text-[#FBA41C]" />
                <span>BINGUNG MEMILIH PAKET YANG TEPAT?</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Konsultasikan Kebutuhan Khusus Bisnis Anda
              </h3>

              <p className="text-blue-100 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                Tim spesialis kami siap membantu menyesuaikan paket & fitur kustom sesuai anggaran bisnis Anda.
              </p>

              <div className="pt-2">
                <a 
                  href="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20tentang%20paket%20layanan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#FBA41C] hover:bg-[#e08d07] text-slate-900 font-extrabold px-7 py-3 rounded-2xl text-xs sm:text-sm shadow-lg transition-all duration-200 hover:scale-105 active:scale-98 cursor-pointer"
                >
                  <FaWhatsapp className="w-4 h-4 text-slate-900" />
                  <span>Konsultasi Gratis via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default Paket;
