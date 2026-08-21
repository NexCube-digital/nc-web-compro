import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaRocket, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

export const CtaSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50/40 to-blue-50/30 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Modern Floating 3D Card Banner */}
        <div className="max-w-6xl mx-auto rounded-[2.5rem] bg-gradient-to-r from-[#126EFE] via-blue-600 to-[#126EFE] p-8 sm:p-12 md:p-16 text-white shadow-2xl shadow-blue-500/20 border border-blue-400/30 relative overflow-hidden">
          
          {/* Ambient Lighting Orbs */}
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#FBA41C]/30 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 text-center max-w-4xl mx-auto space-y-6">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold text-amber-300 shadow-xs">
              <HiSparkles className="w-4 h-4 text-[#FBA41C]" />
              <span>SIAP MELANGKAH LEBIH JAUH?</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Saatnya Tingkatkan Visibilitas Bisnis Anda Dengan <span className="text-[#FBA41C]">NexCube Digital</span>
            </h2>

            {/* Description */}
            <p className="text-blue-100 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
              Konsultasikan kebutuhan proyek Anda secara gratis. Tim kami siap merancang solusi pembuatan website, desain, dan katalog digital terbaik untuk kesuksesan Anda.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <div className="bg-white/15 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-bold text-white flex items-center gap-2 shadow-xs">
                <FaCheckCircle className="text-[#FBA41C] w-4 h-4" />
                <span>Konsultasi Bebas Biaya</span>
              </div>
              <div className="bg-white/15 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-bold text-white flex items-center gap-2 shadow-xs">
                <FaCheckCircle className="text-[#FBA41C] w-4 h-4" />
                <span>Pengerjaan Tepat Waktu</span>
              </div>
              <div className="bg-white/15 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-bold text-white flex items-center gap-2 shadow-xs">
                <FaShieldAlt className="text-[#FBA41C] w-4 h-4" />
                <span>Garansi Perbaikan Bug</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20siap%20memulai%20proyek%20digital%20saya"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-[#FBA41C] hover:bg-[#e08d07] text-slate-900 font-extrabold px-8 py-4 rounded-2xl text-sm sm:text-base shadow-xl transition-all duration-200 flex items-center justify-center gap-3 hover:scale-105 active:scale-98 cursor-pointer"
              >
                <FaWhatsapp className="w-5 h-5 text-slate-900" />
                <span>Hubungi Kami via WhatsApp</span>
              </a>

              <Link
                to="/paket"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-4 rounded-2xl text-sm sm:text-base backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 cursor-pointer"
              >
                <FaRocket className="w-4 h-4 text-[#FBA41C]" />
                <span>Lihat Seluruh Paket</span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
