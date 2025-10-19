import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PricingCard } from '../ui/PricingCard'

export const Home: React.FC = () => {
  const heroSectionRef = useRef<HTMLElement>(null);
  const pricingSectionRef = useRef<HTMLElement>(null);
  const testimonialSectionRef = useRef<HTMLElement>(null);
  
  // State untuk mengontrol animasi
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Set animasi entrance pada page load yang lebih tegas
  useEffect(() => {
    // Sedikit delay untuk memastikan DOM telah selesai dirender
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Fungsi scrolling yang lebih presisi
  const handleScrollToSection = (ref: React.RefObject<HTMLElement>, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    if (ref.current) {
      const headerOffset = 80; // Perkiraan tinggi header
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  
  // Sesuaikan tinggi hero section saat window resize
  useEffect(() => {
    const adjustHeroHeight = () => {
      if (heroSectionRef.current) {
        const windowHeight = window.innerHeight;
        heroSectionRef.current.style.minHeight = `${windowHeight - 20}px`;
      }
    };
    
    // Set height awal
    adjustHeroHeight();
    
    // Update ketika resize window
    window.addEventListener('resize', adjustHeroHeight);
    
    return () => window.removeEventListener('resize', adjustHeroHeight);
  }, []);
  
  return (
    <div>
      {/* Hero Section - Full Height with Animations */}
      <section 
        ref={heroSectionRef} 
        className="flex items-center pt-8 pb-12 bg-gradient-to-b from-slate-50 to-white"
      >
        <div className="container grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h1 
                className={`text-3xl sm:text-4xl md:text-5xl font-heading font-bold leading-tight text-slate-900 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}
              >
                Solusi Digital Premium untuk Bisnis Anda
              </h1>
              <p 
                className={`mt-4 sm:mt-6 text-base sm:text-lg text-slate-600 leading-relaxed ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-200'}`}
              >
                Kami menyediakan pembuatan website profesional, undangan digital, desain grafis, menu digital, katalog produk, dan banyak lagi — dengan paket Bronze hingga Platinum.
              </p>
            </div>

            <div className={`flex flex-wrap gap-3 sm:gap-4 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-300'}`}>
              <button 
                onClick={(e) => handleScrollToSection(pricingSectionRef, e)} 
                className="btn-primary text-sm sm:text-base relative overflow-hidden group"
              >
                <span className="relative z-10">Lihat Paket</span>
                <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              </button>
              <Link to="/contact" className="btn-secondary text-sm sm:text-base">
                Hubungi Kami
              </Link>
            </div>

            <div className={`flex flex-wrap items-center gap-4 sm:gap-8 text-sm text-slate-500 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-400'}`}>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>100% Satisfaction</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>Premium Support</span>
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-2xl p-4 sm:p-8 shadow-premium mt-6 md:mt-0 ${!isLoaded ? 'opacity-0' : 'animate-scaleIn delay-200 animate-float'}`}>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6">
              <div className={`p-6 border rounded-xl bg-gradient-to-br from-slate-50 to-white shadow-card hover:shadow-premium transition-all duration-300 hover:-translate-y-1 hidden-initially ${isLoaded ? 'animate-fadeInUp delay-300' : ''}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-accent/10 text-accent p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                      <line x1="16" y1="8" x2="2" y2="22"></line>
                      <line x1="17" y1="15" x2="9" y2="15"></line>
                    </svg>
                  </div>
                  <div className="font-heading font-semibold">Website BRONZE</div>
                </div>
                <div className="text-sm text-slate-500">Landing page sederhana, 2 revisi, 1 minggu pengerjaan</div>
              </div>
              
              <div className={`p-6 border rounded-xl bg-gradient-to-br from-slate-50 to-white shadow-card hover:shadow-premium transition-all duration-300 hover:-translate-y-1 hidden-initially ${isLoaded ? 'animate-fadeInUp delay-400' : ''}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-accent/10 text-accent p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.29 7 12 12 20.71 7"></polyline>
                      <line x1="12" y1="22" x2="12" y2="12"></line>
                    </svg>
                  </div>
                  <div className="font-heading font-semibold">Undangan Digital</div>
                </div>
                <div className="text-sm text-slate-500">Template interaktif, RSVP, maps terintegrasi</div>
              </div>
              
              <div className={`p-6 border rounded-xl bg-gradient-to-br from-slate-50 to-white shadow-card hover:shadow-premium transition-all duration-300 hover:-translate-y-1 hidden-initially ${isLoaded ? 'animate-fadeInUp delay-500' : ''}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-accent/10 text-accent p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </div>
                  <div className="font-heading font-semibold">Desain Gambar</div>
                </div>
                <div className="text-sm text-slate-500">Poster, feed sosial media, kartu nama profesional</div>
              </div>
              
              <div className={`p-6 border rounded-xl bg-gradient-to-br from-slate-50 to-white shadow-card hover:shadow-premium transition-all duration-300 hover:-translate-y-1 hidden-initially ${isLoaded ? 'animate-fadeInUp delay-600' : ''}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-accent/10 text-accent p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                  </div>
                  <div className="font-heading font-semibold">Katalog & Menu</div>
                </div>
                <div className="text-sm text-slate-500">Digital katalog, QR menu untuk restoran</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section - with animation */}
      <section className="py-10 bg-slate-50 overflow-hidden">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Dipercaya oleh</h2>
            <div className="mt-5 flex flex-wrap justify-center items-center gap-6 sm:gap-x-12 sm:gap-y-6">
              {[1, 2, 3, 4, 5].map((item, index) => (
                <img 
                  key={index}
                  src={`/images/clients/client-${item}.png`} 
                  alt={`Client Logo ${item}`}
                  className={`h-8 sm:h-12 w-auto object-contain opacity-0 transform transition-all duration-700 ease-out ${
                    isLoaded ? 'opacity-80 hover:opacity-100 translate-y-0' : 'translate-y-8'
                  }`} 
                  style={{ transitionDelay: `${600 + index * 150}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Full Height with Proper Padding */}
      <section 
        ref={pricingSectionRef} 
        id="paket" 
        className="flex flex-col justify-center min-h-screen py-16 bg-white"
      >
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold">Paket Website</h2>
            <p className="text-slate-500 mt-3 sm:mt-4 text-base sm:text-lg">
              Pilih paket sesuai kebutuhan — dari landing page cepat sampai solusi lengkap berskala.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <PricingCard 
              tier="Bronze" 
              price="Rp 800.000" 
              features={["Awal Kehadiran Digital. Ideal untuk individu atau bisnis yang baru memasuki ruang online dan membutuhkan website company profile dasar yang efisien."]} 
              accent="bg-slate-50" 
            />
            <PricingCard 
              tier="Silver" 
              price="Rp 1.200.000" 
              features={["Pembangunan Brand dan Kepercayaan. Dirancang untuk pebisnis yang serius membangun citra digital yang kuat dan otoritatif."]} 
              accent="bg-white"
            />
            <PricingCard 
              tier="Gold" 
              price="Rp 2.000.000" 
              features={["Kompleksitas Layanan Tinggi. Ditujukan bagi perusahaan dengan beragam produk atau layanan yang membutuhkan struktur konten yang luas dan presentasi informasi yang mendalam."]} 
              accent="bg-gradient-to-br from-gold-light to-white" 
              popular={true}
            />
            <PricingCard 
              tier="Platinum" 
              price="Rp 5.000.000" 
              features={["Kontrol Penuh & Kepemilikan Aset. Pilihan ideal bagi klien yang ingin memiliki kendali penuh atas infrastruktur, kode sumber, dan data tanpa ikatan biaya operasional vendor."]} 
              accent="bg-gradient-to-br from-slate-800 to-slate-850 text-white" 
            />
          </div>

          <div className="text-center mt-6">
            <Link to="/contact" className="btn-secondary inline-flex text-sm sm:text-base items-center">
              Konsultasi Paket Khusus
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials - Optimized Height */}
      <section 
        ref={testimonialSectionRef}
        className="flex items-center min-h-screen py-16 bg-slate-50"
      >
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold">Yang Klien Kami Katakan</h2>
            <p className="text-slate-500 mt-3 sm:mt-4 text-base sm:text-lg">
              Kami bangga dapat membantu bisnis klien dengan solusi digital premium.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-xl shadow-card">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#c8a355" stroke="#c8a355" strokeWidth="1">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                ))}
              </div>
              <p className="text-slate-600 italic">"Website kami mendapatkan peningkatan trafik signifikan setelah didesain ulang oleh tim NexCube. Tampilan premium dan responsif!"</p>
              <div className="mt-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                <div>
                  <div className="font-semibold">Budi Santoso</div>
                  <div className="text-sm text-slate-500">PT Maju Bersama</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-card">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#c8a355" stroke="#c8a355" strokeWidth="1">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                ))}
              </div>
              <p className="text-slate-600 italic">"Undangan digital untuk acara perusahaan kami mendapat banyak pujian dari para tamu. Fitur RSVP sangat membantu dalam persiapan acara."</p>
              <div className="mt-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                <div>
                  <div className="font-semibold">Dewi Anggraini</div>
                  <div className="text-sm text-slate-500">Harmony Events</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-card">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#c8a355" stroke="#c8a355" strokeWidth="1">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                ))}
              </div>
              <p className="text-slate-600 italic">"Menu digital untuk restoran kami memudahkan pelanggan melihat pilihan makanan. Update menu jadi sangat cepat tanpa perlu cetak ulang."</p>
              <div className="mt-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                <div>
                  <div className="font-semibold">Ahmad Fauzi</div>
                  <div className="text-sm text-slate-500">Warung Nusantara</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <button 
              onClick={(e) => handleScrollToSection(heroSectionRef, e)}
              className="text-accent hover:text-accent/80 flex items-center gap-2 mx-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
              Kembali ke atas
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}