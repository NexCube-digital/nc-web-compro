import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaStar, FaCheckCircle, FaChevronLeft, FaChevronRight, 
  FaQuoteLeft, FaPen, FaShieldAlt 
} from 'react-icons/fa';
import apiClient, { getImageUrl } from '../services/api';

export interface TestimonialItem {
  id?: number;
  name: string;
  company: string;
  text: string;
  rating: number;
  avatar: string;
  createdAt?: string;
  tag?: string;
}

export interface TestimonialProps {
  id?: string;
}

const AUTO_SLIDE_INTERVAL_MS = 5500;

export const Testimonial: React.FC<TestimonialProps> = ({ id = 'testimonials' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [testimonialsData, setTestimonialsData] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fallbackTestimonials: TestimonialItem[] = [
    {
      id: 1,
      name: 'Eti Yuningsih',
      company: 'Kantin Karomah',
      text: 'Pelayanannya oke, gercep, pokonya gak rugi pakai NexCube! Website katalog menu makanan kami sekarang jauh lebih ramai & praktis dalam melayani pelanggan.',
      rating: 5,
      avatar: '',
      tag: 'Katalog Menu Digital'
    },
    {
      id: 2,
      name: 'Nabila Syahla',
      company: 'Mahasiswi IWU',
      text: 'Sebagai mahasiswa, saya merasa sangat terbantu dengan layanan NexCube. Penjelasannya mudah dipahami, komunikasi sangat ramah, dan hasilnya melebihi ekspektasi!',
      rating: 5,
      avatar: '',
      tag: 'Platform & Undangan Digital'
    },
    {
      id: 3,
      name: 'Rizky Pratama',
      company: 'Tech Startup ID',
      text: 'Tim NexCube sangat profesional dan responsif. Mereka memahami arsitektur sistem bisnis kami dengan sangat cepat dan mengeksekusi dengan sempurna sesuai timeline.',
      rating: 5,
      avatar: '',
      tag: 'Web System & Architecture'
    },
    {
      id: 4,
      name: 'Ahmad Fauzi',
      company: 'Owner Distro Bandung',
      text: 'Website e-commerce kami buatan NexCube luar biasa kencang & mudah dioperasikan. Konversi penjualan naik signifikan sejak kami migrasi ke platform baru ini!',
      rating: 5,
      avatar: '',
      tag: 'E-Commerce High Performance'
    }
  ];

  const fetchPublishedTestimonials = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getPublishedTestimonials();
      if (response.data?.testimonials && response.data.testimonials.length > 0) {
        setTestimonialsData(response.data.testimonials);
      } else {
        setTestimonialsData(fallbackTestimonials);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonialsData(fallbackTestimonials);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishedTestimonials();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
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
      <section id={id} className="py-12 lg:min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gradient-to-b from-slate-50 to-white text-slate-800">
        <div className="container mx-auto px-4 text-center">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-xs sm:text-sm font-semibold tracking-wide">
            Mengambil ulasan mitra terverifikasi...
          </p>
        </div>
      </section>
    );
  }

  const currentTestimonial = testimonialsData[activeIndex] || testimonialsData[0];

  return (
    <section 
      id={id} 
      className="py-6 sm:py-8 lg:py-12 lg:min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gradient-to-b from-white via-slate-50/70 to-slate-100/50 text-slate-900 relative overflow-hidden border-b border-slate-200/60"
    >
      {/* ── Background Aesthetics: Digital Isometric Grid ── */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Ambient Lighting Accents */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-indigo-400/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-6xl relative z-10 w-full">
        
        {/* ═════════════════════════════════════════════════════════════════════
            1-FRAME MASTER CONSOLE CARD (Satu Bingkai Terpadu Utuh)
        ═════════════════════════════════════════════════════════════════════ */}
        <div 
          className="w-full bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-2xl shadow-slate-900/5 overflow-hidden flex flex-col relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          
          {/* ── Top Master Console Bar ── */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-100/90 border-b border-slate-200/80 text-[10px] sm:text-xs font-mono text-slate-500">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
              </div>
              <span className="hidden sm:inline font-bold tracking-wider uppercase text-slate-600 pl-2 border-l border-slate-200">
                1-FRAME // VOICE OF CLIENT CONSOLE
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-600 font-bold text-[10px] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>LIVE VERIFIED STORIES</span>
            </div>
          </div>

          {/* ── Inner Split Deck inside the 1-Frame ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 flex-1">
            
            {/* ─────────────────────────────────────────────────────────────────
                LEFT PANE: Trust Anchor, Header & Mitra Selector (5 Cols)
            ───────────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-5 p-5 sm:p-6 lg:p-7 flex flex-col justify-between space-y-4 bg-slate-50/40">
              
              {/* Header Info */}
              <div className="space-y-2.5">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs text-slate-800 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}>
                  <span className="flex items-center gap-0.5 text-blue-600">
                    <span className="w-1 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                    <span className="w-1 h-3.5 bg-indigo-600 rounded-full animate-pulse delay-75"></span>
                    <span className="w-1 h-1.5 bg-blue-600 rounded-full animate-pulse delay-150"></span>
                  </span>
                  <span>KATA MEREKA TENTANG NEXCUBE</span>
                </div>

                <h2 className={`text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-900 leading-tight ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-100'}`}>
                  Kisah Sukses <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-700 bg-clip-text text-transparent">
                    Mitra Kami
                  </span>
                </h2>

                <p className={`text-slate-600 text-xs sm:text-xs md:text-sm leading-relaxed font-medium ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-200'}`}>
                  Kepercayaan dan kepuasan klien adalah komitmen utama kami dalam menghadirkan solusi digital berkelas dunia.
                </p>
              </div>

              {/* Compact Trust Radar */}
              <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-center">
                <div className="p-1.5 bg-slate-50/80 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-amber-500 font-black text-xs">
                    <FaStar className="w-2.5 h-2.5 fill-current" />
                    <span>4.98</span>
                  </div>
                  <div className="text-[9px] text-slate-500 font-semibold">Rating Klien</div>
                </div>

                <div className="p-1.5 bg-slate-50/80 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-emerald-600 font-black text-xs">
                    <FaCheckCircle className="w-2.5 h-2.5" />
                    <span>100%</span>
                  </div>
                  <div className="text-[9px] text-slate-500 font-semibold">Terverifikasi</div>
                </div>

                <div className="p-1.5 bg-slate-50/80 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-blue-600 font-black text-xs">
                    <FaShieldAlt className="w-2.5 h-2.5" />
                    <span>99.2%</span>
                  </div>
                  <div className="text-[9px] text-slate-500 font-semibold">Puas & Repeat</div>
                </div>
              </div>

              {/* Interactive Mitra Playlist (Compact List in Left Pane) */}
              <div className="space-y-1.5 hidden sm:block">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
                  <span>PILIH MITRA</span>
                  <span className="text-[9px] text-slate-400 font-normal">KLIK NAMA</span>
                </div>

                <div className="space-y-1">
                  {testimonialsData.map((item, idx) => {
                    const isActive = activeIndex === idx;
                    return (
                      <button
                        key={item.id || idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl transition-all duration-200 text-left cursor-pointer border ${
                          isActive 
                            ? 'bg-white border-slate-800 shadow-xs ring-1 ring-slate-900/10' 
                            : 'bg-white/40 hover:bg-white border-slate-200/70 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Mini Avatar / Monogram */}
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 transition-colors ${
                            isActive 
                              ? 'bg-slate-900 text-white' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.avatar ? (
                              <img 
                                src={getImageUrl(item.avatar)} 
                                alt={item.name} 
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <span>{item.name.charAt(0)}</span>
                            )}
                          </div>

                          {/* Text Name & Company */}
                          <div className="min-w-0">
                            <h4 className={`text-xs font-bold truncate ${isActive ? 'text-slate-950 font-black' : 'text-slate-700'}`}>
                              {item.name}
                            </h4>
                            <p className="text-[10px] text-slate-500 font-medium truncate">
                              {item.company}
                            </p>
                          </div>
                        </div>

                        {/* Right Indicator */}
                        <div className="shrink-0 pl-1.5">
                          {isActive ? (
                            <div className="flex items-center gap-0.5 text-indigo-600 h-3">
                              <span className="w-0.5 h-2.5 bg-indigo-600 rounded-full animate-pulse"></span>
                              <span className="w-0.5 h-3.5 bg-indigo-600 rounded-full animate-pulse delay-75"></span>
                              <span className="w-0.5 h-1.5 bg-indigo-600 rounded-full animate-pulse delay-150"></span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono">
                              #0{idx + 1}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom CTA Button */}
              <div className="pt-1">
                <Link 
                  to="/ulasan/baru"
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-white hover:bg-slate-900 text-slate-800 hover:text-white font-bold text-xs border border-slate-300 hover:border-slate-900 shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer group"
                >
                  <FaPen className="w-2.5 h-2.5 text-amber-500 group-hover:text-amber-300 transition-colors" />
                  <span>Tulis Ulasan Pengalaman Anda</span>
                </Link>
              </div>

            </div>

            {/* ─────────────────────────────────────────────────────────────────
                RIGHT PANE: Grand Testimonial Spotlight Stage (7 Cols)
            ───────────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-7 p-5 sm:p-7 lg:p-9 flex flex-col justify-between bg-white relative overflow-hidden min-h-[340px] sm:min-h-[380px]">
              
              {/* Background Giant Stylized Quotation Watermark */}
              <FaQuoteLeft className="w-24 h-24 sm:w-32 sm:h-32 text-slate-100 absolute -top-2 -right-2 pointer-events-none select-none opacity-80" />

              {/* Top Viewport Header */}
              <div className="relative z-10 flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 gap-2">
                
                {/* Verified Shield Pill */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold tracking-wide">
                  <FaCheckCircle className="w-2.5 h-2.5 text-emerald-600" />
                  <span className="uppercase">VERIFIED IMPACT STORY #{currentTestimonial.id || activeIndex + 1}</span>
                </div>

                {/* Voice Log Audio Waveform */}
                <div className="hidden sm:flex items-center gap-1.5 bg-slate-100/80 px-2 py-0.5 rounded-full border border-slate-200 text-[9px] font-mono text-slate-500">
                  <span className="font-bold">VOICE // LOG</span>
                  <span className="flex items-center gap-0.5 h-2.5 text-indigo-600">
                    <span className={`w-0.5 bg-indigo-600 rounded-full transition-all duration-300 ${isPaused ? 'h-1' : 'h-2.5 animate-pulse'}`}></span>
                    <span className={`w-0.5 bg-indigo-600 rounded-full transition-all duration-300 ${isPaused ? 'h-1.5' : 'h-3 animate-pulse delay-100'}`}></span>
                    <span className={`w-0.5 bg-indigo-600 rounded-full transition-all duration-300 ${isPaused ? 'h-2' : 'h-1.5 animate-pulse delay-200'}`}></span>
                  </span>
                </div>

                {/* Star Rating Badge */}
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-amber-600 text-xs font-bold shrink-0">
                  <div className="flex items-center text-amber-400">
                    {[...Array(currentTestimonial.rating || 5)].map((_, i) => (
                      <FaStar key={i} className="w-2.5 h-2.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-amber-700 font-bold ml-0.5">
                    {(currentTestimonial.rating || 5).toFixed(1)}
                  </span>
                </div>

              </div>

              {/* Main Testimonial Statement */}
              <div className="relative z-10 py-5 sm:py-7 my-auto">
                <blockquote className="text-base sm:text-lg md:text-xl font-medium text-slate-800 leading-relaxed italic">
                  "{currentTestimonial.text}"
                </blockquote>
              </div>

              {/* Author Showcase Profile & Tactical Controls */}
              <div className="relative z-10 pt-4 sm:pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                
                {/* Author Info */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-white font-black text-base sm:text-lg flex items-center justify-center shadow-xs border-2 border-white ring-1 ring-slate-200">
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
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-white shadow-xs">
                      <FaCheckCircle className="w-2 h-2" />
                    </div>
                  </div>

                  {/* Name & Company */}
                  <div className="min-w-0">
                    <h4 className="text-sm sm:text-base font-black text-slate-900 leading-snug truncate">
                      {currentTestimonial.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold truncate">
                      {currentTestimonial.company}
                    </p>
                    <span className="inline-block mt-0.5 text-[9px] font-mono text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded font-bold">
                      {currentTestimonial.tag || 'Klien Mitra NexCube'}
                    </span>
                  </div>
                </div>

                {/* Tactical Slider Controls */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-1 sm:pt-0">
                  {/* Step Counter */}
                  <div className="text-[11px] font-mono font-bold text-slate-400 tracking-wider">
                    <span className="text-slate-900 font-black text-xs">
                      {String(activeIndex + 1).padStart(2, '0')}
                    </span>
                    <span> / </span>
                    <span>{String(testimonialsData.length).padStart(2, '0')}</span>
                  </div>

                  {/* Arrow Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handlePrev}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105"
                      title="Sebelumnya"
                    >
                      <FaChevronLeft className="w-3 h-3" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs hover:scale-105"
                      title="Selanjutnya"
                    >
                      <FaChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Mobile-only Bottom Thumbnail Selector (Horizontal Pills) */}
              <div className="flex sm:hidden items-center gap-1.5 overflow-x-auto no-scrollbar pt-3 border-t border-slate-100 mt-2">
                {testimonialsData.map((item, idx) => (
                  <button
                    key={item.id || idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-all cursor-pointer border ${
                      activeIndex === idx
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {item.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Countdown Slide Progress Bar at the bottom of Stage Card */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden">
                <div 
                  key={activeIndex}
                  className={`h-full bg-gradient-to-r from-indigo-500 to-blue-600 origin-left transition-all ${
                    isPaused ? 'opacity-40' : 'animate-progressFill'
                  }`}
                  style={{
                    animationDuration: `${AUTO_SLIDE_INTERVAL_MS}ms`,
                    animationTimingFunction: 'linear',
                    animationFillMode: 'forwards'
                  }}
                />
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Testimonial;