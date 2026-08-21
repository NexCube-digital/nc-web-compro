import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaWhatsapp, FaArrowRight, FaGlobe, FaPalette, FaEnvelopeOpenText, FaBookOpen, FaStar, FaCheckCircle } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { IoMdCube } from 'react-icons/io';

interface HeroSectionProps {
  onExploreClick?: (e: React.MouseEvent) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick }) => {
  return (
    <section className="relative min-h-screen lg:h-screen lg:max-h-[920px] flex items-center justify-center pt-20 pb-8 lg:pt-24 lg:pb-12 overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-amber-50/20">
      {/* Soft Ambient Light Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-300/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-300/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Subtle Blue Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `linear-gradient(#126EFE 1px, transparent 1px), linear-gradient(90deg, #126EFE 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Column: Friendly & Informative Content */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-4 lg:space-y-5">
            
            {/* Friendly Agency Badge */}
            <div className="inline-flex items-center gap-2.5 bg-white border border-blue-200/80 shadow-xs px-4 py-2 rounded-full transition-all duration-300 hover:shadow-md hover:border-blue-300">
              <span className="p-1 rounded-full bg-amber-100 text-[#FBA41C]">
                <HiSparkles className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs md:text-sm font-bold text-slate-700">
                Jasa Pembuatan <span className="text-[#126EFE]">Website, Desain & Katalog Digital</span>
              </span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>

            {/* Main Headline - Bright Friendly Colors (No Harsh Dark Black) */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 tracking-tight leading-[1.2]">
                Solusi Digital Kreatif Untuk <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#126EFE] via-blue-600 to-[#FBA41C] bg-clip-text text-transparent">
                  Pertumbuhan Bisnis Anda
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                Kami membantu UMKM, profesional, dan bisnis modern hadir lebih memukau lewat pembuatan <span className="font-bold text-[#126EFE]">Website Custom</span>, <span className="font-bold text-amber-600">Desain Grafis</span>, <span className="font-bold text-rose-500">Undangan Digital</span>, & <span className="font-bold text-emerald-600">Katalog Produk</span>.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-stretch sm:items-center pt-2">
              <button
                onClick={onExploreClick}
                className="group bg-[#126EFE] hover:bg-[#0950be] text-white px-7 py-3 rounded-xl font-bold text-sm lg:text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer"
              >
                <FaRocket className="w-4 h-4 text-amber-300" />
                <span>Lihat Katalog Paket</span>
                <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                to="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20mengenai%20jasa%20digital%20(Website%2FDesain%2FUndangan%2FKatalog)"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-600 px-7 py-3 rounded-xl font-bold text-sm lg:text-base shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-center gap-2.5"
              >
                <FaWhatsapp className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                <span>Konsultasi WA Gratis</span>
              </Link>
            </div>

            {/* Social Trust Proof */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-3">
              <div className="flex -space-x-2">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-xs" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Klien 1" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-xs" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Klien 2" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-xs" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Klien 3" />
              </div>
              <div className="text-xs text-slate-600 text-left">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-3.5 h-3.5" />
                  ))}
                  <span className="text-slate-800 ml-1 font-bold">4.9/5.0</span>
                </div>
                <span className="text-[11px] text-slate-500">Dipercaya 50+ UMKM & Klien Puas</span>
              </div>
            </div>

          </div>

          {/* Right Column: Bright Informative Showcase Card */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Background Soft Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 via-amber-300/20 to-blue-200/30 rounded-3xl blur-2xl transform rotate-2 scale-95 pointer-events-none"></div>

            {/* Bright Creative Hub Card */}
            <div className="relative w-full max-w-sm lg:max-w-full xl:max-w-sm bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-500/10 overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
              
              {/* Card Header Bar */}
              <div className="bg-gradient-to-r from-blue-50 to-amber-50 px-4 py-3 flex items-center justify-between border-b border-blue-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
                  <span className="text-xs text-slate-600 font-bold font-mono ml-1.5">nexcube.id/services</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#126EFE] bg-white px-2.5 py-1 rounded-full border border-blue-200">
                  <IoMdCube className="w-4 h-4 text-[#FBA41C]" />
                  <span>Kreatif Studio</span>
                </div>
              </div>

              {/* Showcase Content */}
              <div className="p-4 space-y-3 bg-white">
                
                {/* Service Item 1: Website */}
                <div className="p-3 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between hover:bg-blue-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#126EFE] text-white shadow-xs">
                      <FaGlobe className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Website Custom & Landing Page</div>
                      <div className="text-[10px] text-slate-500">Responsive, Mobile Friendly & Fast</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#126EFE] bg-white px-2 py-0.5 rounded-md border border-blue-200">
                    Pro
                  </span>
                </div>

                {/* Service Item 2: Desain Grafis */}
                <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-center justify-between hover:bg-amber-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#FBA41C] text-white shadow-xs">
                      <FaPalette className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Desain Grafis & Branding</div>
                      <div className="text-[10px] text-slate-500">Logo, Feed IG, Brosur & Banner HD</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#e08d07] bg-white px-2 py-0.5 rounded-md border border-amber-200">
                    HD
                  </span>
                </div>

                {/* Service Item 3: Undangan Digital */}
                <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-center justify-between hover:bg-rose-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-rose-500 text-white shadow-xs">
                      <FaEnvelopeOpenText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Undangan Digital Premium</div>
                      <div className="text-[10px] text-slate-500">Musik, RSVP, Galeri Foto & Peta</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-rose-600 bg-white px-2 py-0.5 rounded-md border border-rose-200">
                    Elegan
                  </span>
                </div>

                {/* Service Item 4: Katalog Digital */}
                <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between hover:bg-emerald-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                      <FaBookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Katalog Produk & Menu E-Shop</div>
                      <div className="text-[10px] text-slate-500">Order Langsung via WhatsApp</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                    Katalog
                  </span>
                </div>

                {/* Bottom Value Banner */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-[#126EFE] to-blue-600 text-white shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-white/20">
                      <FaCheckCircle className="w-4 h-4 text-amber-300" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Harga Terjangkau & Garansi</div>
                      <div className="text-[10px] text-blue-100">Siap pengerjaan cepat & revisi ramah</div>
                    </div>
                  </div>
                  <HiSparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
