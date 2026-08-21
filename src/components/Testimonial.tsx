import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaCheckCircle, FaChevronLeft, FaChevronRight, FaQuoteLeft, FaPen } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import apiClient, { getImageUrl } from '../services/api';

interface TestimonialItem {
  id?: number;
  name: string;
  company: string;
  text: string;
  rating: number;
  avatar: string;
  createdAt?: string;
}

const AUTO_SLIDE_INTERVAL_MS = 4000;

export const Testimonial: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [testimonialsData, setTestimonialsData] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchPublishedTestimonials = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getPublishedTestimonials();
      if (response.data?.testimonials && response.data.testimonials.length > 0) {
        setTestimonialsData(response.data.testimonials);
      } else {
        // Fallback default testimonials if API yields empty array
        setTestimonialsData([
          {
            id: 1,
            name: 'Eti Yuningsih',
            company: 'Kantin Karomah',
            text: 'Pelayanannya oke, gercep, pokonya gak rugi pakae NexCube! Website katalog menu makanan kami sekarang jauh lebih ramai & praktis.',
            rating: 5,
            avatar: ''
          },
          {
            id: 2,
            name: 'Nabila Syahla',
            company: 'Mahasiswi IWU',
            text: 'Sebagai mahasiswa, saya merasa sangat terbantu dengan layanan NexCube. Penjelasannya mudah dipahami, komunikasi baik, dan hasilnya sangat memuaskan!',
            rating: 5,
            avatar: ''
          },
          {
            id: 3,
            name: 'Rizky Pratama',
            company: 'Tech Startup ID',
            text: 'Tim NexCube sangat profesional dan responsif. Mereka memahami kebutuhan bisnis kami dengan baik dan mengeksekusi dengan sempurna sesuai timeline.',
            rating: 5,
            avatar: ''
          },
          {
            id: 4,
            name: 'Ahmad Fauzi',
            company: 'Owner Distro Bandung',
            text: 'Website e-commerce kami buatan NexCube luar biasa kencang & mudah dioperasikan. Penjualan naik signifikan sejak launching!',
            rating: 5,
            avatar: ''
          }
        ]);
      }
    } catch (error) {
      console.error('Gagal memuat testimonial:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishedTestimonials();
  }, []);

  const total = testimonialsData.length;

  // Automatic 3D Card Rotation Timer
  useEffect(() => {
    if (total <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, AUTO_SLIDE_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, isPaused]);

  const handlePrev = () => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev + 1) % total);
  };

  if (loading && total === 0) {
    return (
      <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-white via-slate-50/50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#126EFE] border-t-transparent"></div>
          <p className="mt-4 text-slate-600 font-medium text-sm">Memuat testimoni 3D...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Ambient Light Glows */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-blue-300/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-amber-300/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200/80 text-[#e08d07] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs">
            <HiSparkles className="w-3.5 h-3.5 text-[#FBA41C]" />
            <span>4.9/5 Rating Dari {total}+ Klien Puas</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Cerita Sukses & Ulasan <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#126EFE] via-blue-600 to-[#FBA41C] bg-clip-text text-transparent">
              Klien NexCube
            </span>
          </h2>

          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Arahkan kursor untuk menunda slide. Kepuasan dan keberhasilan bisnis Anda adalah prioritas utama kami.
          </p>
        </div>

        {/* 3D Card Slider Stage */}
        <div 
          className="relative max-w-5xl mx-auto min-h-[380px] flex items-center justify-center py-6 px-2 perspective-1000"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {testimonialsData.map((item, idx) => {
            // Calculate 3D Offset Distance relative to activeIndex
            let offset = idx - activeIndex;
            if (offset < -Math.floor(total / 2)) offset += total;
            if (offset > Math.floor(total / 2)) offset -= total;

            const isActive = offset === 0;
            const isPrev = offset === -1 || (offset === total - 1 && total > 2);
            const isNext = offset === 1 || (offset === -(total - 1) && total > 2);

            // Determine 3D Transform & Opacity Classes based on offset position
            let cardClasses = 'opacity-0 scale-75 pointer-events-none z-0';
            if (isActive) {
              cardClasses = 'opacity-100 scale-100 z-30 shadow-2xl border-blue-300 ring-4 ring-blue-500/10 cursor-default';
            } else if (isPrev) {
              cardClasses = 'opacity-60 scale-90 -translate-x-12 sm:-translate-x-24 -rotate-y-6 z-20 cursor-pointer hover:opacity-80 blur-[0.5px] hidden sm:flex';
            } else if (isNext) {
              cardClasses = 'opacity-60 scale-90 translate-x-12 sm:translate-x-24 rotate-y-6 z-20 cursor-pointer hover:opacity-80 blur-[0.5px] hidden sm:flex';
            }

            return (
              <div
                key={item.id || idx}
                onClick={() => {
                  if (isPrev) handlePrev();
                  if (isNext) handleNext();
                }}
                className={`absolute w-full max-w-lg bg-white rounded-3xl p-7 md:p-8 border border-slate-200/90 transition-all duration-700 ease-out flex flex-col justify-between overflow-hidden transform-gpu ${cardClasses}`}
                style={{
                  transformStyle: 'preserve-3d',
                  boxShadow: isActive ? '0 25px 50px -12px rgba(18, 110, 254, 0.15)' : 'none'
                }}
              >
                {/* Top Accent Line */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${isActive ? 'bg-gradient-to-r from-[#126EFE] to-[#FBA41C]' : 'bg-slate-200'}`}></div>

                {/* Quote Icon */}
                <FaQuoteLeft className={`absolute top-6 right-6 w-10 h-10 ${isActive ? 'text-blue-50' : 'text-slate-100'} transition-colors pointer-events-none`} />

                <div className="space-y-4 relative z-10">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={`w-4 h-4 ${i < item.rating ? 'text-[#FBA41C]' : 'text-slate-200'}`} />
                    ))}
                  </div>

                  {/* Testimonial Quote */}
                  <blockquote className="text-slate-700 text-sm sm:text-base leading-relaxed italic font-normal">
                    "{item.text}"
                  </blockquote>
                </div>

                {/* User Profile Info */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-3.5 mt-6 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#126EFE] to-blue-700 text-white flex items-center justify-center font-bold text-base shadow-md overflow-hidden shrink-0 border border-blue-200">
                    {item.avatar ? (
                      <img 
                        src={getImageUrl(item.avatar)} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} 
                      />
                    ) : (
                      <span>{item.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>

                  <div className="min-w-0 text-left">
                    <div className="font-bold text-base text-slate-900 group-hover:text-[#126EFE] transition-colors truncate">
                      {item.name}
                    </div>
                    <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 truncate">
                      <FaCheckCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.company || 'Pelanggan Terverifikasi'}</span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Slider Controls */}
        <div className="flex flex-col items-center gap-4 mt-6">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePrev}
              className="flex items-center justify-center w-11 h-11 rounded-full border border-blue-200 bg-white text-[#126EFE] hover:bg-[#126EFE] hover:text-white shadow-md transition-all duration-200 cursor-pointer active:scale-95"
              aria-label="Testimoni Sebelumnya"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>

            {/* Pagination Dots */}
            <div className="flex gap-2 items-center px-2">
              {testimonialsData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    i === activeIndex
                      ? 'w-8 h-3 bg-gradient-to-r from-[#126EFE] to-[#FBA41C] shadow-xs'
                      : 'w-3 h-3 bg-slate-200 hover:bg-slate-300'
                  }`}
                  aria-label={`Ke slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center justify-center w-11 h-11 rounded-full border border-blue-200 bg-white text-[#126EFE] hover:bg-[#126EFE] hover:text-white shadow-md transition-all duration-200 cursor-pointer active:scale-95"
              aria-label="Testimoni Selanjutnya"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="text-center max-w-4xl mx-auto mt-14">
          <div className="bg-gradient-to-r from-[#126EFE] via-blue-600 to-blue-700 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden space-y-4">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#FBA41C]/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-amber-300">
              <HiSparkles className="w-3.5 h-3.5 text-[#FBA41C]" />
              <span>Pengalaman Anda Berharga Bagi Kami</span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Puas Dengan Layanan NexCube Digital?
            </h3>

            <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Bagikan pengalaman positif Anda dan bantu calon klien lain membuat keputusan tepat dalam memilih partner digital terpercaya.
            </p>

            <div className="pt-2">
              <Link
                to="/ulasan"
                className="inline-flex items-center gap-2.5 bg-[#FBA41C] hover:bg-[#e08d07] text-slate-900 font-extrabold px-8 py-3.5 rounded-2xl text-sm md:text-base shadow-lg transition-all duration-200 hover:scale-105 active:scale-98"
              >
                <FaPen className="w-4 h-4 text-slate-900" />
                <span>Tulis Ulasan Anda</span>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};