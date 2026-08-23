import React, { useState } from 'react';
import { FaChevronDown, FaQuestionCircle } from 'react-icons/fa';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Berapa lama proses pembuatan website di NexCube?',
      a: 'Waktu pengerjaan berkisar antara 3-7 hari kerja tergantung pada skala paket dan kelengkapan materi (konten, logo, teks) dari Anda.'
    },
    {
      q: 'Apakah harga sudah termasuk Domain dan Hosting?',
      a: 'Ya, mayoritas paket website kami sudah termasuk fasilitas hosting cepat serta domain (.com / .id / .my.id) gratis selama 1 tahun pertama.'
    },
    {
      q: 'Apakah website buatan NexCube bisa diakses dari HP?',
      a: 'Tentu! Seluruh website buatan kami dirancang dengan pendekatan Mobile-First yang 100% responsif dan nyaman diakses di smartphone, tablet, maupun laptop.'
    },
    {
      q: 'Bagaimana jika saya belum memiliki materi desain atau tulisan?',
      a: 'Tim NexCube siap membantu Anda menyusun alur konten, penulisan copy yang menarik, hingga penyediaan aset gambar bebas hak cipta.'
    },
    {
      q: 'Bagaimana cara berkonsultasi atau memesan layanan?',
      a: 'Anda cukup mengklik tombol "Konsultasi Gratis" atau memilih paket yang diinginkan untuk terhubung langsung via WhatsApp dengan tim konsultan kami.'
    }
  ];

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-8 sm:py-16 md:py-24 bg-slate-50/70 border-t border-slate-100">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-4xl">
        
        {/* Title (Compact on Mobile) */}
        <div className="text-center mb-6 sm:mb-12 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#126EFE] px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <FaQuestionCircle /> Pertanyaan Umum (FAQ)
          </div>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Punya Pertanyaan Mengenai <span className="text-[#126EFE]">Layanan Kami?</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-base max-w-xl mx-auto">
            Berikut adalah beberapa pertanyaan yang paling sering diajukan oleh calon klien kami.
          </p>
        </div>

        {/* Accordion List (Compact on Mobile) */}
        <div className="space-y-2.5 sm:space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx}
                className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-3.5 sm:p-5 text-left flex items-center justify-between gap-3 font-bold text-slate-800 hover:text-[#126EFE] transition-colors cursor-pointer"
                >
                  <span className="text-xs sm:text-base md:text-lg leading-snug">{faq.q}</span>
                  <FaChevronDown 
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#126EFE]' : ''}`} 
                  />
                </button>

                {isOpen && (
                  <div className="px-3.5 pb-3.5 sm:px-5 sm:pb-5 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-2.5 sm:pt-3 animate-fadeInUp">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
