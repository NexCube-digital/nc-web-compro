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
      <section className="py-20 bg-[#0B132B] text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-blue-200 text-sm font-medium">Memuat ulasan klien...</p>
        </div>
      </section>
    );
  }

  const currentTestimonial = testimonialsData[activeIndex] || testimonialsData[0];

  return (
    <section className="py-24 bg-gradient-to-b from-[#0B132B] via-[#1C2541] to-[#0B132B] text-white relative overflow-hidden">
      
      {/* Background Accent Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#126EFE]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FBA41C]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-amber-300 backdrop-blur-md">
            <HiSparkles className="w-3.5 h-3.5 text-[#FBA41C]" />
            <span>KATA MEREKA TENTANG NEXCUBE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Kisah Sukses <span className="bg-gradient-to-r from-[#126EFE] via-blue-400 to-[#FBA41C] bg-clip-text text-transparent">Mitra Kami</span>
          </h2>

          <p className="text-blue-200/80 text-sm sm:text-base font-medium leading-relaxed">
            Kepercayaan dan kepuasan klien adalah komitmen utama kami dalam menghadirkan solusi digital berkelas dunia.
          </p>
        </div>

        {/* Testimonial Showcase Card */}
        {currentTestimonial && (
          <div 
            className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 border border-white/15 shadow-2xl relative transition-all duration-500 group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <FaQuoteLeft className="w-12 h-12 text-[#126EFE]/20 absolute top-8 left-8 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
              
              {/* Client Avatar / Initial */}
              <div className="shrink-0">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-white/20 bg-gradient-to-br from-[#126EFE] via-blue-600 to-[#FBA41C] flex items-center justify-center text-white font-black text-3xl shadow-xl">
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
                  
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl shadow-md" title="Terverifikasi">
                    <FaCheckCircle className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Text & Details */}
              <div className="space-y-4 text-center md:text-left flex-1">
                
                {/* Rating Stars */}
                <div className="flex items-center justify-center md:justify-start gap-1">
                  {[...Array(currentTestimonial.rating || 5)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4 text-[#FBA41C]" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-base sm:text-lg md:text-xl font-medium text-slate-100 italic leading-relaxed">
                  "{currentTestimonial.text}"
                </p>

                {/* Author Info */}
                <div>
                  <h4 className="text-lg font-black text-white">{currentTestimonial.name}</h4>
                  <p className="text-xs sm:text-sm text-blue-300/80 font-medium">{currentTestimonial.company}</p>
                </div>

              </div>

            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-white/10">
              <div className="flex items-center gap-2">
                {testimonialsData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeIndex === idx ? 'w-8 bg-[#FBA41C]' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
                  title="Sebelumnya"
                >
                  <FaChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
                  title="Selanjutnya"
                >
                  <FaChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Bottom CTA to Submit Review */}
        <div className="mt-12 text-center">
          <Link 
            to="/ulasan/baru"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            <FaPen className="w-3.5 h-3.5 text-[#FBA41C]" />
            <span>Tulis Ulasan Pengalaman Anda</span>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Testimonial;