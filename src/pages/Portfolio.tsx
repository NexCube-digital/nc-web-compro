import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '../components/layout/Layout';
import { Portfolio } from '../components/Portfolio';
import { FaWhatsapp, FaArrowRight, FaRocket, FaCheckCircle, FaLaptopCode } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

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

      <div className="min-h-screen bg-gradient-to-b from-blue-50/40 via-white to-slate-50/50 pt-24 sm:pt-32 lg:pt-36 pb-12 sm:pb-20 overflow-hidden">
        
        {/* Background Ambient Light Glows */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-blue-300/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-7xl relative z-10">
          
          {/* Header Banner */}
          <div className={`text-center max-w-3xl mx-auto mb-8 sm:mb-14 space-y-3 sm:space-y-4 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}>
            
            <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-[#126EFE] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs">
              <HiSparkles className="w-4 h-4 text-[#FBA41C]" />
              <span>GALERI PORTFOLIO & HASIL KARYA</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Koleksi Hasil Karya <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#126EFE] via-blue-600 to-[#FBA41C] bg-clip-text text-transparent">
                Digital Terbaik
              </span>
            </h1>

            <p className="text-slate-600 text-xs sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Jelajahi berbagai proyek website bisnis, aplikasi, undangan digital interaktif, dan desain visual yang telah kami selesaikan dengan standar kualitas internasional.
            </p>

            {/* Quick Stat Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold text-slate-700">
              <div className="inline-flex items-center gap-1.5 bg-white border border-slate-200/90 px-3.5 py-1.5 rounded-xl shadow-2xs">
                <FaRocket className="text-[#126EFE] w-3.5 h-3.5" />
                <span>100+ Proyek Selesai</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-white border border-slate-200/90 px-3.5 py-1.5 rounded-xl shadow-2xs">
                <FaCheckCircle className="text-emerald-500 w-3.5 h-3.5" />
                <span>99% Kepuasan Klien</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-white border border-slate-200/90 px-3.5 py-1.5 rounded-xl shadow-2xs">
                <FaLaptopCode className="text-[#FBA41C] w-3.5 h-3.5" />
                <span>Garansi Bug Free</span>
              </div>
            </div>

          </div>

          {/* Main Portfolio Grid (No limit) */}
          <div className="bg-white/60 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-8 border border-slate-200/80 shadow-xs mb-12 sm:mb-20">
            <Portfolio hideHeader={true} showViewMore={false} />
          </div>

          {/* Bottom Call To Action Banner */}
          <div className="relative bg-gradient-to-r from-blue-50/80 via-white to-amber-50/60 text-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-12 overflow-hidden shadow-xl shadow-blue-500/5 border border-blue-100/90 text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            
            {/* Ambient Lighting in Card */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-300/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl space-y-2 sm:space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold text-[#126EFE] uppercase tracking-wider shadow-2xs">
                <HiSparkles className="w-3.5 h-3.5 text-[#FBA41C]" />
                <span>SIAP MEMULAI PROYEK ANDA?</span>
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-md transition-all duration-300 cursor-pointer hover:scale-102"
              >
                <FaWhatsapp className="w-4 h-4 text-white" />
                <span>Konsultasi WA Gratis</span>
              </a>

              <Link
                to="/paket"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#126EFE] hover:bg-[#0950be] text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all duration-300 cursor-pointer hover:scale-102"
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
