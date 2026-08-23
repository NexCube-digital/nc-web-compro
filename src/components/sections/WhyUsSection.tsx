import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { IoMdCube } from 'react-icons/io';

export const WhyUsSection: React.FC = () => {
  const comparison = [
    {
      feature: 'Desain Kustom & Responsive 100%',
      note: 'Disesuaikan dengan identitas & warna branding Anda',
      nexcube: true,
      other: false,
    },
    {
      feature: 'Kecepatan Loading High Speed (Google Score 90+)',
      note: 'Optimasi gambar WebP & kompresi kode otomatis',
      nexcube: true,
      other: false,
    },
    {
      feature: 'Garansi Bebas Bug & Maintenance Support 24/7',
      note: 'Dukungan langsung dari tim developer profesional',
      nexcube: true,
      other: false,
    },
    {
      feature: 'Harga Transparan Tanpa Biaya Tersembunyi',
      note: 'Estimasi biaya jelas sesuai kesepakatan di awal',
      nexcube: true,
      other: false,
    },
    {
      feature: 'Integrasi SEO & Analytics Terlengkap',
      note: 'Meningkatkan peringkat & pencarian bisnis di Google',
      nexcube: true,
      other: true,
    },
    {
      feature: 'Konsultasi Gratis & Pendampingan Sampai Rilis',
      note: 'Bimbingan pengoperasian website & pengerjaan cepat',
      nexcube: true,
      other: false,
    }
  ];

  return (
    <section className="py-8 sm:py-16 md:py-24 bg-gradient-to-b from-slate-50/50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Background Ambient Light Glows */}
      <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-blue-300/10 blur-3xl pointer-events-none rounded-full"></div>
      <div className="absolute bottom-10 right-1/3 w-[500px] h-[500px] bg-amber-300/10 blur-3xl pointer-events-none rounded-full"></div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
        
        {/* Section Title (Compact on Mobile) */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-14 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 text-[#e08d07] px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-xs">
            <HiSparkles className="w-3.5 h-3.5 text-[#FBA41C]" />
            <span>MENGAPA MEMILIH NEXCUBE DIGITAL?</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Perbandingan Standar Kualitas <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#126EFE] via-blue-600 to-[#FBA41C] bg-clip-text text-transparent">
              NexCube vs Penyedia Biasa
            </span>
          </h2>

          <p className="text-slate-600 text-xs sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Lihat perbedaan nyata standar pengerjaan profesional kami dibandingkan dengan penyedia jasa konvensional.
          </p>
        </div>

        {/* Modern Comparison Table Container (Compact on Mobile) */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl shadow-blue-500/5 overflow-hidden">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-gradient-to-r from-[#126EFE] via-blue-600 to-blue-700 text-white py-3.5 px-4 sm:py-5 sm:px-6 items-center shadow-md">
            <div className="col-span-6 md:col-span-6 font-bold text-xs sm:text-sm md:text-base flex items-center gap-1.5">
              <span>Fitur & Standar Kerja</span>
            </div>

            <div className="col-span-3 md:col-span-3 flex items-center justify-center gap-1 sm:gap-1.5 text-center">
              <IoMdCube className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FBA41C]" />
              <span className="font-extrabold text-xs sm:text-sm md:text-base text-amber-300">NexCube</span>
            </div>

            <div className="col-span-3 md:col-span-3 text-center font-bold text-[11px] sm:text-xs md:text-sm text-blue-100/90">
              Penyedia Lain
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-slate-100">
            {comparison.map((item, idx) => (
              <div 
                key={idx}
                className={`grid grid-cols-12 py-3 px-3.5 sm:py-4.5 sm:px-6 items-center text-xs md:text-sm transition-colors duration-200 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                } hover:bg-blue-50/40`}
              >
                {/* Feature Description */}
                <div className="col-span-6 md:col-span-6 font-bold text-slate-800 pr-1 sm:pr-2">
                  <div className="flex items-center gap-1.5 text-slate-900 leading-snug text-xs sm:text-sm">
                    <span>{item.feature}</span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 font-normal mt-0.5 leading-snug">
                    {item.note}
                  </div>
                </div>
                
                {/* NexCube Checkmark Column */}
                <div className="col-span-3 md:col-span-3 flex justify-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#126EFE] to-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 transform hover:scale-110 transition-transform">
                    <FaCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                </div>

                {/* Other Providers Column */}
                <div className="col-span-3 md:col-span-3 flex justify-center">
                  {item.other ? (
                    <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold">
                      <FaCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-rose-50 border border-rose-100 text-rose-400 flex items-center justify-center font-bold">
                      <FaTimes className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Table Footer Accent Bar */}
          <div className="bg-slate-50 border-t border-slate-100 py-2.5 px-4 sm:py-3.5 sm:px-6 text-center text-[10px] sm:text-xs text-slate-500 font-medium">
            Diproses oleh tim profesional berpengalaman dengan garansi kualitas & kepuasan 100%.
          </div>

        </div>

      </div>
    </section>
  );
};
