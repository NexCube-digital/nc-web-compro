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
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishedTestimonials();
  }, []);

  // Auto-slide carousel effect
  useEffect(() => {
    if (testimonialsData.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonialsData.length);
    }, AUTO_SLIDE_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testimonialsData.length, isPaused]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonialsData.length);
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-20 bg-gradient-to-b from-white via-blue-50/20 to-white text-slate-800">
        <div className="container mx-auto px-4 text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-xs sm:text-sm font-medium">Memuat ulasan klien...</p>
        </div>
      </section>
    );
  }

  const currentTestimonial = testimonialsData[activeIndex] || testimonialsData[0];

  return (
    <section className="py-8 sm:py-20 md:py-24 bg-gradient-to-b from-white via-blue-50/30 to-white text-slate-900 relative overflow-hidden border-b border-slate-100">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-5xl relative z-10">
        
        {/* Section Header (Light Theme) */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-14 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#126EFE] shadow-xs">
            <HiSparkles className="w-3.5 h-3.5 text-[#FBA41C]" />
            <span>KATA MEREKA TENTANG NEXCUBE</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Kisah Sukses <span className="bg-gradient-to-r from-[#126EFE] via-blue-600 to-[#FBA41C] bg-clip-text text-transparent">Mitra Kami</span>
          </h2>

          <p className="text-slate-600 text-xs sm:text-base font-medium leading-relaxed">
            Kepercayaan dan kepuasan klien adalah komitmen utama kami dalam menghadirkan solusi digital berkelas dunia.
          </p>
        </div>

        {/* Testimonial Showcase Card (Konsisten & Presisi di Seluruh Ukuran Layar) */}
        {currentTestimonial && (
          <div 
            className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/90 shadow-xl shadow-blue-500/5 relative transition-all duration-500 group overflow-hidden min-h-[300px] sm:min-h-[280px] flex flex-col justify-between"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <FaQuoteLeft className="w-8 h-8 sm:w-10 sm:h-10 text-[#126EFE]/15 absolute top-5 left-5 sm:top-7 sm:left-7 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-5 sm:gap-8">
              
              {/* Client Avatar / Initial (Konsisten 80px / 96px) */}
              <div className="shrink-0">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-blue-100 bg-gradient-to-br from-[#126EFE] via-blue-600 to-[#FBA41C] flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-md">
                    {currentTestimonial.avatar ? (
                      <img 
                        src={getImageUrl(currentTestimonial.avatar)} 
                        alt={currentTestimonial.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span>{currentTestimonial.name.charAt(0)}</span>
                    )}
                  </div>
                  
                  <div className="absolute -bottom-1 -right-1 sm:-bottom-1.5 sm:-right-1.5 bg-emerald-500 text-white p-1 sm:p-1.5 rounded-lg sm:rounded-xl shadow-md" title="Terverifikasi">
                    <FaCheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>
              </div>

              {/* Text & Details (Konsisten & Rapi) */}
              <div className="space-y-2 sm:space-y-2.5 text-center md:text-left flex-1 min-w-0">
                
                {/* Author Info (Di atas Bintang) */}
                <div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug">{currentTestimonial.name}</h4>
                  <p className="text-xs sm:text-sm text-slate-500 font-semibold">{currentTestimonial.company}</p>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center justify-center md:justify-start gap-1">
                  {[...Array(currentTestimonial.rating || 5)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4 text-[#FBA41C]" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-xs sm:text-base font-medium text-slate-700 italic leading-relaxed">
                  "{currentTestimonial.text}"
                </p>

              </div>

            </div>

            {/* Navigation Buttons (Light Theme) */}
            <div className="flex items-center justify-between pt-4 mt-4 sm:pt-6 sm:mt-6 border-t border-slate-100">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {testimonialsData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeIndex === idx ? 'w-6 sm:w-8 bg-[#126EFE]' : 'w-1.5 sm:w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handlePrev}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-slate-50 hover:bg-[#126EFE] hover:text-white border border-slate-200 text-slate-700 flex items-center justify-center transition-all hover:scale-105 cursor-pointer shadow-2xs"
                  title="Sebelumnya"
                >
                  <FaChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-slate-50 hover:bg-[#126EFE] hover:text-white border border-slate-200 text-slate-700 flex items-center justify-center transition-all hover:scale-105 cursor-pointer shadow-2xs"
                  title="Selanjutnya"
                >
                  <FaChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Bottom CTA Button "Tulis Ulasan" - Statis (Tidak Bergerak) */}
        <div className="mt-6 sm:mt-10 text-center">
          <Link 
            to="/ulasan/baru"
            className="inline-flex items-center gap-2.5 bg-[#126EFE] hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-colors duration-200 cursor-pointer"
          >
            <FaPen className="w-3.5 h-3.5 text-amber-300" />
            <span>Tulis Ulasan Pengalaman Anda</span>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Testimonial;