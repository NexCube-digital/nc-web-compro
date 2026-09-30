import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

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

export interface WhyUsSectionProps {
  id?: string;
}

export const WhyUsSection: React.FC<WhyUsSectionProps> = ({ id = 'why-us' }) => {
  const comparison = [
    {
      tag: 'TECH STACK',
      feature: 'Arsitektur Modern (React & Vite Ecosystem)',
      note: 'Performa super kencang, clean-code, zero-bloatware & bebas plugin berat rentan bug.',
      nexcube: true,
      nexcubeLabel: 'High Speed Modern',
      other: false,
      otherLabel: 'WordPress usang & berat'
    },
    {
      tag: 'SPEED & PERF',
      feature: 'Core Web Vitals & Loading Speed Terverifikasi',
      note: 'Optimasi WebP/AVIF, lazy loading cerdas, & Google PageSpeed Score stabil 90+.',
      nexcube: true,
      nexcubeLabel: 'Skor 90+ (< 1.5s)',
      other: false,
      otherLabel: 'Lambat (> 4-6 detik)'
    },
    {
      tag: 'MODULARITY',
      feature: 'Skalabilitas Modular CUBE 5.0',
      note: 'Dapat di-upgrade bertahap (fitur custom, QR, e-commerce) tanpa buat ulang dari nol.',
      nexcube: true,
      nexcubeLabel: 'Modular & Skalabel',
      other: false,
      otherLabel: 'Monolitik kaku (rombak ulang)'
    },
    {
      tag: 'OWNERSHIP',
      feature: '100% Hak Milik Penuh & Bebas Vendor Lock-in',
      note: 'Source code, aset desain, dan domain sepenuhnya milik klien tanpa ditahan.',
      nexcube: true,
      nexcubeLabel: 'Aset 100% Milik Anda',
      other: false,
      otherLabel: 'Terkunci vendor sepihak'
    },
    {
      tag: 'SEO & SCHEMA',
      feature: 'Struktur SEO Native, OpenGraph & JSON-LD',
      note: 'Optimasi metadata terstruktur agar bisnis mudah dirayapi dan tampil teratas di Google.',
      nexcube: true,
      nexcubeLabel: 'Full Schema & Analytics',
      other: false,
      otherLabel: 'Hanya meta tag standar'
    },
    {
      tag: 'HUMAN-TOUCH',
      feature: 'Pendampingan Konsultasi Teknis & Human-Touch',
      note: 'Bukan sekadar bot instan; didampingi langsung oleh tim developer & desainer profesional.',
      nexcube: true,
      nexcubeLabel: 'Direct Partner Developer',
      other: false,
      otherLabel: 'Antrean tiket lambat'
    },
    {
      tag: 'WARRANTY',
      feature: 'Garansi Bebas Bug & SLA Support Responsif',
      note: 'Monitoring berkala, garansi perbaikan gratis, dan pendampingan sampai go-live sukses.',
      nexcube: true,
      nexcubeLabel: 'Garansi 100% Bug-Free',
      other: false,
      otherLabel: 'Biaya tambahan per perbaikan'
    }
  ];

  return (
    <section 
      id={id} 
      className="py-6 sm:py-8 lg:py-12 lg:min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gradient-to-b from-white via-slate-50/70 to-slate-100/50 text-slate-900 relative overflow-hidden border-b border-slate-200/60"
    >
      {/* ── Background Aesthetics: Digital Isometric Grid ── */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Ambient Light Accents */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-slate-300/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-200/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-6xl relative z-10 w-full flex flex-col justify-center">
        
        {/* ── Section Header (Di Atas Tabel) ── */}
        <div className="text-center max-w-3xl mx-auto mb-4 sm:mb-6 space-y-1.5 sm:space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs text-slate-800 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
            <IsometricCubeIcon className="w-3.5 h-3.5 text-slate-700" />
            <span>BENCHMARK STANDAR INDUSTRI</span>
          </div>

          <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Perbandingan Standar Kualitas
          </h2>

          <p className="text-slate-600 text-[11px] sm:text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
            Lihat perbedaan nyata standar pengerjaan profesional kami dibandingkan dengan penyedia jasa konvensional.
          </p>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════
            1-FRAME MASTER BENCHMARK CONSOLE CARD (TABEL)
        ═════════════════════════════════════════════ */}
        <div className="w-full bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-900/5 overflow-hidden flex flex-col relative">
          
          {/* ── Top Master Console Bar ── */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-100/90 border-b border-slate-200/80 text-[10px] sm:text-xs font-mono text-slate-500">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
              </div>
              <span className="hidden sm:inline font-bold tracking-wider uppercase text-slate-600 pl-2 border-l border-slate-200">
                1-FRAME // INDUSTRIAL BENCHMARK CONSOLE
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-600 font-bold text-[10px] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
              <span>STANDAR INDUSTRY 5.0 VERIFIED</span>
            </div>
          </div>

          {/* ── Benchmark Matrix Table ── */}
          <div className="w-full overflow-hidden">
            
            {/* Table Header (Aligned with Columns) */}
            <div className="grid grid-cols-12 bg-slate-900 text-white py-2.5 px-3.5 sm:py-3 sm:px-6 items-center text-xs">
              <div className="col-span-6 sm:col-span-6 font-bold flex items-center gap-2">
                <span className="text-slate-200 tracking-wide text-[11px] sm:text-xs uppercase font-mono">
                  KRITERIA & ARSITEKTUR STANDAR
                </span>
              </div>

              {/* NexCube Column Header */}
              <div className="col-span-3 sm:col-span-3 flex items-center justify-center">
                <div className="flex items-center justify-center md:justify-start gap-2 w-auto md:w-full md:max-w-[170px]">
                  <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-lg bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
                    <IsometricCubeIcon className="w-3 h-3 text-cyan-300" />
                  </div>
                  <span className="font-extrabold text-[11px] sm:text-xs md:text-sm text-cyan-300 tracking-tight">
                    NexCube 5.0
                  </span>
                </div>
              </div>

              {/* Conventional Column Header */}
              <div className="col-span-3 sm:col-span-3 flex items-center justify-center">
                <div className="flex items-center justify-center md:justify-start gap-2 w-auto md:w-full md:max-w-[170px]">
                  <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center shrink-0">
                    <span className="text-[9px] font-mono font-bold">VS</span>
                  </div>
                  <span className="font-bold text-[10px] sm:text-xs text-slate-400 truncate">
                    Penyedia Biasa
                  </span>
                </div>
              </div>
            </div>

            {/* Matrix Table Rows (All Checkmarks and X's RULER-STRAIGHT) */}
            <div className="divide-y divide-slate-100">
              {comparison.map((item, idx) => (
                <div 
                  key={idx}
                  className={`grid grid-cols-12 py-2 px-3.5 sm:py-2.5 sm:px-6 items-center text-xs transition-colors duration-150 ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                  } hover:bg-slate-100/60`}
                >
                  {/* Feature & Note Column */}
                  <div className="col-span-6 sm:col-span-6 pr-2 sm:pr-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] sm:text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase bg-slate-100 px-1.5 py-0.2 rounded shrink-0">
                        {item.tag}
                      </span>
                      <h4 className="text-slate-900 font-bold text-[11px] sm:text-xs truncate">
                        {item.feature}
                      </h4>
                    </div>
                    <p className="text-[10px] text-slate-500 font-normal leading-tight mt-0.5 truncate hidden sm:block">
                      {item.note}
                    </p>
                  </div>
                  
                  {/* NexCube Highlight Column (Straight Vertical Line) */}
                  <div className="col-span-3 sm:col-span-3 flex items-center justify-center">
                    <div className="flex items-center justify-center md:justify-start gap-2 w-auto md:w-full md:max-w-[170px]">
                      <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-lg bg-slate-900 text-cyan-400 border border-slate-700 flex items-center justify-center shadow-2xs shrink-0">
                        <FaCheck className="w-2.5 h-2.5" />
                      </div>
                      <span className="hidden md:inline-block text-[10px] font-bold text-slate-800 truncate">
                        {item.nexcubeLabel}
                      </span>
                    </div>
                  </div>

                  {/* Conventional Column (Straight Vertical Line) */}
                  <div className="col-span-3 sm:col-span-3 flex items-center justify-center">
                    <div className="flex items-center justify-center md:justify-start gap-2 w-auto md:w-full md:max-w-[170px]">
                      <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-lg bg-rose-50 border border-rose-200/80 text-rose-500 flex items-center justify-center shrink-0">
                        <FaTimes className="w-2.5 h-2.5" />
                      </div>
                      <span className="hidden md:inline-block text-[10px] text-slate-400 truncate">
                        {item.otherLabel}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* ── Table Footer Highlight Bar ── */}
          <div className="bg-slate-50/90 border-t border-slate-200/80 py-2.5 px-4 sm:py-3 sm:px-6">
            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2 text-center sm:text-left">
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                Standar arsitektur Industry 5.0 dengan garansi performa & kepuasan 100%.
              </span>
              <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-bold text-slate-700">
                <span className="inline-flex items-center gap-1">
                  <FaCheck className="text-emerald-600 w-2.5 h-2.5" /> 100% Hak Milik Kode
                </span>
                <span className="inline-flex items-center gap-1">
                  <FaCheck className="text-emerald-600 w-2.5 h-2.5" /> Google Score 90+
                </span>
                <span className="inline-flex items-center gap-1">
                  <FaCheck className="text-emerald-600 w-2.5 h-2.5" /> SLA Bug-Free
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyUsSection;
