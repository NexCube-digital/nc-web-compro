import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { Portfolio } from '../components/Portfolio'

export const Home: React.FC = () => {
  const heroSectionRef = useRef<HTMLElement>(null);
  const portfolioSectionRef = useRef<HTMLElement>(null);
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

  const services = [
    {
      title: 'Website Premium',
      description: 'Landing page profesional dengan desain modern dan performa optimal',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Undangan Digital',
      description: 'Template interaktif dengan RSVP dan integrasi maps untuk acara spesial',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Desain Grafis',
      description: 'Poster, feed sosial media, dan materi branding yang eye-catching',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      gradient: 'from-rose-500 to-pink-600'
    },
    {
      title: 'Katalog Digital',
      description: 'QR menu untuk restoran dan katalog produk yang interaktif',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      gradient: 'from-orange-500 to-amber-600'
    }
  ];

  const stats = [
    { number: '50+', label: 'Proyek Selesai', icon: '🚀' },
    { number: '30+', label: 'Klien Puas', icon: '😊' },
    { number: '99%', label: 'Success Rate', icon: '⭐' },
    { number: '24/7', label: 'Support Premium', icon: '🔧' }
  ];

  const testimonials = [
    {
      name: 'Budi Santoso',
      company: 'PT Maju Bersama',
      text: 'Website kami mendapatkan peningkatan trafik signifikan setelah didesain ulang oleh tim NexCube. Tampilan premium dan responsif memberikan kesan profesional yang luar biasa!',
      rating: 5,
      avatar: '/images/avatars/avatar-1.jpg'
    },
    {
      name: 'Dewi Anggraini', 
      company: 'Harmony Events',
      text: 'Undangan digital untuk acara perusahaan kami mendapat banyak pujian dari para tamu. Fitur RSVP sangat membantu dalam persiapan acara dan memberikan pengalaman yang memorable.',
      rating: 5,
      avatar: '/images/avatars/avatar-2.jpg'
    },
    {
      name: 'Ahmad Fauzi',
      company: 'Warung Nusantara',
      text: 'Menu digital untuk restoran kami memudahkan pelanggan melihat pilihan makanan. Update menu jadi sangat cepat tanpa perlu cetak ulang, meningkatkan efisiensi operasional.',
      rating: 5,
      avatar: '/images/avatars/avatar-3.jpg'
    }
  ];
  
  return (
    <Layout>
      <div className="overflow-hidden">
        {/* Background Elements */}
        <div className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl -translate-x-48 -translate-y-48 animate-pulse"></div>
        <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-100/30 to-orange-100/30 rounded-full blur-3xl translate-x-48 translate-y-48 animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Hero Section - Enhanced with Premium Design */}
        <section 
          ref={heroSectionRef} 
          className="relative flex items-center pt-4 pb-16 bg-gradient-to-b from-slate-50 via-white to-slate-50/50"
        >
          <div className="container grid md:grid-cols-2 gap-12 md:gap-20 items-center relative">
            <div className="space-y-8">
              {/* Trust Badge */}
              <div className={`inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Premium Digital Solutions
              </div>

              <div>
                <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold leading-tight ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-100'}`}>
                  <span className="bg-gradient-to-r from-slate-800 via-blue-700 to-purple-700 bg-clip-text text-transparent">
                    Transformasi Digital
                  </span>
                  <br />
                  <span className="text-slate-800">untuk Bisnis Modern</span>
                </h1>
                <p className={`mt-6 text-xl text-slate-600 leading-relaxed max-w-xl ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-200'}`}>
                  Solusi teknologi <span className="font-semibold text-slate-800">berkualitas internasional</span> dengan 
                  pendekatan personal. Dari website premium hingga strategi digital yang 
                  <span className="font-semibold text-blue-700"> mengakselerasi pertumbuhan bisnis Anda</span>.
                </p>
              </div>

              {/* Enhanced CTAs */}
              <div className={`flex flex-wrap gap-4 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-300'}`}>
                <button 
                  onClick={(e) => handleScrollToSection(portfolioSectionRef, e)} 
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-xl inline-flex items-center gap-3"
                >
                  <span>Lihat Portfolio</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                
                <Link 
                  to="https://wa.me/qr/B7H5SIV33KOUM1" 
                  className="group bg-white text-slate-700 px-8 py-4 rounded-xl font-semibold border-2 border-slate-200 hover:border-blue-300 hover:text-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg inline-flex items-center gap-3"
                >
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  <span>Konsultasi Gratis</span>
                </Link>
              </div>

              {/* Enhanced Stats */}
              <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-400'}`}>
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-lg mb-1">{stat.icon}</div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Service Cards */}
            <div className={`relative ${!isLoaded ? 'opacity-0' : 'animate-scaleIn delay-200'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Layanan Premium Kami</h3>
                  <p className="text-slate-600">Solusi digital berkualitas internasional</p>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {services.map((service, index) => (
                    <div 
                      key={index}
                      style={{ animationDelay: `${500 + (index * 150)}ms` }}
                      className={`group p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${service.gradient} text-white group-hover:scale-110 transition-transform duration-300`}>
                          {service.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">
                            {service.title}
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Trusted By Section */}
        <section className="py-16 bg-gradient-to-r from-slate-50 to-white">
          <div className="container">
            <div className="text-center mb-12">
              <div className={`inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-slate-600 border border-slate-200 mb-4 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-600'}`}>
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Dipercaya oleh 30+ Bisnis
              </div>
              <h2 className={`text-2xl font-bold text-slate-800 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-700'}`}>
                Partner Terpercaya untuk Transformasi Digital
              </h2>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 hover:opacity-80 transition-opacity">
              {[1, 2, 3, 4, 5].map((item, index) => (
                <div 
                  key={index}
                  style={{ animationDelay: `${800 + (index * 100)}ms` }}
                  className={`bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/50 hover:shadow-lg transition-all duration-300 hover:scale-105 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}
                >
                  <img 
                    src={`/images/clients/client-${item}.png`} 
                    alt={`Client Logo ${item}`}
                    className="h-8 w-auto object-contain" 
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Section - Replaces Pricing */}
        <section ref={portfolioSectionRef} id="portfolio">
          <Portfolio />
        </section>

        {/* Enhanced Testimonials */}
        <section 
          ref={testimonialSectionRef}
          className="py-24 bg-gradient-to-b from-slate-50 to-white"
        >
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className={`inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-slate-600 border border-slate-200 mb-6 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-300'}`}>
                ⭐ 4.9/5 Rating dari 30+ Klien
              </div>
              <h2 className={`text-3xl md:text-4xl font-bold text-slate-800 mb-6 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-400'}`}>
                Cerita Sukses <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Klien Kami</span>
              </h2>
              <p className={`text-lg text-slate-600 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-500'}`}>
                Kepuasan dan kesuksesan klien adalah prioritas utama kami dalam setiap proyek digital
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  style={{ animationDelay: `${600 + (index * 150)}ms` }}
                  className={`group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 hover:-translate-y-2 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}
                >
                  {/* Rating Stars */}
                  <div className="flex mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  
                  <blockquote className="text-slate-600 italic leading-relaxed mb-6 group-hover:text-slate-700 transition-colors">
                    "{testimonial.text}"
                  </blockquote>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-700 font-semibold text-lg">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-slate-500">{testimonial.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Enhanced Back to Top */}
            <div className="text-center mt-16">
              <button 
                onClick={(e) => handleScrollToSection(heroSectionRef, e)}
                className="group inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-slate-600 hover:text-blue-700 px-6 py-3 rounded-xl border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <svg className="w-5 h-5 transform group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                Kembali ke Atas
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}