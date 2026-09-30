import React, { useState } from 'react';
import { FaChevronDown, FaWhatsapp, FaShieldAlt, FaClock, FaRocket, FaCode } from 'react-icons/fa';

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

export interface FaqSectionProps {
  id?: string;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ id = 'faq' }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Berapa lama proses pembuatan website di NexCube?',
      a: 'Waktu pengerjaan berkisar antara 3-7 hari kerja tergantung pada skala paket dan kelengkapan materi (konten, logo, teks) dari Anda. Untuk sistem custom berskala besar, timeline disepakati di awal kontrak dengan garansi pengerjaan tepat waktu.',
      icon: <FaClock className="w-3.5 h-3.5 text-blue-600" />
    },
    {
      q: 'Apakah harga sudah termasuk Domain dan Hosting cepat?',
      a: 'Ya, seluruh paket website kami sudah termasuk fasilitas hosting cloud berkecepatan tinggi serta domain resmi (.com / .id / .my.id) gratis selama 1 tahun pertama dengan sertifikat SSL keamanan 256-bit.',
      icon: <FaRocket className="w-3.5 h-3.5 text-emerald-600" />
    },
    {
      q: 'Apakah website buatan NexCube 100% responsif di HP & Tablet?',
      a: 'Tentu! Seluruh produk digital kami dibangun dengan pendekatan Mobile-First dan arsitektur modern (React ecosystem) yang terbukti responsif, ringan, dan nyaman diakses di smartphone, tablet, maupun laptop dengan Google PageSpeed Score 90+.',
      icon: <FaCode className="w-3.5 h-3.5 text-indigo-600" />
    },
    {
      q: 'Bagaimana jika saya belum memiliki materi desain atau tulisan?',
      a: 'Jangan khawatir! Tim profesional NexCube siap mendampingi Anda menyusun struktur copywriting yang menjual, memilih palet visual yang sesuai identitas brand, hingga menyediakan aset grafis bebas lisensi.',
      icon: <FaShieldAlt className="w-3.5 h-3.5 text-amber-500" />
    },
    {
      q: 'Bagaimana cara berkonsultasi atau memesan layanan NexCube?',
      a: 'Anda cukup mengklik tombol "Konsultasi Gratis via WhatsApp" atau memilih paket layanan yang tersedia. Tim konsultan kami akan langsung merespons untuk mendiskusikan kebutuhan dan solusi terbaik bisnis Anda.',
      icon: <FaWhatsapp className="w-3.5 h-3.5 text-emerald-500" />
    }
  ];

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section 
      id={id} 
      className="py-10 sm:py-16 md:py-24 bg-gradient-to-b from-white via-slate-50/70 to-slate-100/50 text-slate-900 relative overflow-hidden border-b border-slate-200/60"
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
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-blue-300/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-indigo-300/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-6xl relative z-10">
        
        {/* ── 2-Column Split Layout (FAQ Stage) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Heading & Quick Support Dock (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            
            {/* Header Text */}
            <div className="space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs text-slate-800 text-[11px] sm:text-xs font-bold tracking-wider uppercase">
                <IsometricCubeIcon className="w-3.5 h-3.5 text-slate-700" />
                <span>PERTANYAAN UMUM // FAQ 5.0</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Punya Pertanyaan Mengenai <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-700 bg-clip-text text-transparent">
                  Layanan Kami?
                </span>
              </h2>

              <p className="text-slate-600 text-xs sm:text-base leading-relaxed font-medium">
                Berikut adalah jawaban lengkap atas pertanyaan yang paling sering diajukan seputar standar pengerjaan, teknologi, dan garansi kami.
              </p>
            </div>

            {/* Quick Live Assistance Card */}
            <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-900/5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700">
                    LIVE SUPPORT 24/7
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-semibold">
                  FAST RESPONSE &lt; 10 MENIT
                </span>
              </div>

              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                  Masih Punya Pertanyaan Lain?
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Konsultasikan ide atau kendala sistem digital Anda langsung bersama konsultan teknis kami tanpa dipungut biaya.
                </p>
              </div>

              <a
                href="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20mengenai%20layanan%20Anda"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <FaWhatsapp className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Konsultasi Gratis via WhatsApp</span>
              </a>
            </div>

          </div>

          {/* Right Column: Accordion Deck (7 Cols) */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div 
                  key={idx}
                  className={`bg-white/95 backdrop-blur-md rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen 
                      ? 'border-slate-800 shadow-lg ring-1 ring-slate-900/10' 
                      : 'border-slate-200/90 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3.5 font-bold text-slate-800 hover:text-slate-950 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isOpen 
                          ? 'bg-slate-900 text-cyan-300 shadow-xs' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {faq.icon}
                      </div>
                      <span className="text-xs sm:text-sm md:text-base leading-snug font-bold">
                        {faq.q}
                      </span>
                    </div>

                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen ? 'bg-slate-100 text-slate-900 rotate-180' : 'text-slate-400'
                    }`}>
                      <FaChevronDown className="w-3 h-3" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-fadeInUp">
                      <p className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default FaqSection;
