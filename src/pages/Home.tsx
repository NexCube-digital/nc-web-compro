import React, { useRef, useEffect, useState, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { Portfolio } from '../components/Portfolio'
import { 
  useScrollFadeIn, 
  useParallax, 
  useScrollRotate, 
  useScrollScale,
  useFloatingAnimation 
} from '../hooks/useGsapAnimation'
import { useCountUp } from '../hooks/useCountUp'
import { useSmoothScroll, useThreePerformance } from '../hooks/useSmoothAnimation'
import { useSmoothScrollRAF } from '../hooks/useFrameOptimization'
import { 
  FaRocket, 
  FaGem, 
  FaBolt, 
  FaCode, 
  FaEnvelope, 
  FaPalette, 
  FaBook,
  FaCheckCircle,
  FaStar,
  FaWhatsapp,
  FaArrowRight,
  FaArrowUp,
  FaShieldAlt,
  FaClock,
  FaUsers,
  FaChartLine,
  FaHeadset
} from 'react-icons/fa'
import { HiSparkles, HiLightningBolt } from 'react-icons/hi'
import { IoMdCube } from 'react-icons/io'

// Lazy load Three.js components for better performance
const ThreeBackground = React.lazy(() => import('../components/ThreeBackground'))
const HeroThree = React.lazy(() => import('../components/HeroThree'))

export const Home: React.FC = () => {
  const heroSectionRef = useRef<HTMLElement>(null);
  const portfolioSectionRef = useRef<HTMLElement>(null);
  const testimonialSectionRef = useRef<HTMLElement>(null);
  
  // GSAP ScrollTrigger refs dengan proper dependencies
  const fadeInRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const rotateRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  
  // Apply GSAP animations
  useScrollFadeIn('.scroll-fade-in');
  useParallax('.parallax-element', 0.3);
  useScrollRotate('.rotate-on-scroll', 360);
  useScrollScale('.scale-on-scroll');
  useFloatingAnimation('.floating-element');
  
  // Apply smooth scroll and Three.js performance optimization
  useSmoothScroll();
  useThreePerformance();
  
  // Smooth scroll dengan RAF
  const { scrollTo } = useSmoothScrollRAF();
  
  // State untuk mengontrol animasi
  const [isLoaded, setIsLoaded] = useState(false);
  const [showHero, setShowHero] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Set animasi entrance pada page load yang lebih tegas
  useEffect(() => {
    // Check if this is first visit in this session
    const isFirstVisit = !sessionStorage.getItem('hasVisitedHome');
    
    if (isFirstVisit) {
      // Loading animation only on first visit
      const loadTimer = setTimeout(() => {
        setIsLoaded(true);
      }, 800);
      
      // Hero content reveal
      const heroTimer = setTimeout(() => {
        setShowHero(true);
      }, 1000);
      
      // Mark as visited
      sessionStorage.setItem('hasVisitedHome', 'true');
      
      return () => {
        clearTimeout(loadTimer);
        clearTimeout(heroTimer);
      };
    } else {
      // Skip loading animation for subsequent visits
      setIsLoaded(true);
      setShowHero(true);
    }
  }, []);
  
  // Track scroll progress untuk visual feedback
  useEffect(() => {
    let rafId: number;
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          const scrollTop = window.scrollY;
          const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
          setScrollProgress(scrollPercentage);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
  
  // Fungsi scrolling yang lebih presisi dengan RAF
  const handleScrollToSection = (ref: React.RefObject<HTMLElement>, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    if (ref.current) {
      const headerOffset = 80;
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      // Smooth scroll dengan easing
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
      description: 'Full-stack web solutions dengan teknologi terkini, SEO-optimized, dan performa blazing fast',
      icon: <FaCode className="w-7 h-7" />,
      gradient: 'from-blue-500 via-blue-600 to-cyan-500',
      features: ['Responsive Design', 'SEO Ready', 'Fast Loading']
    },
    {
      title: 'Undangan Digital',
      description: 'Interactive wedding & event invitations dengan RSVP tracking dan live streaming integration',
      icon: <FaEnvelope className="w-7 h-7" />,
      gradient: 'from-emerald-500 via-green-600 to-teal-500',
      features: ['RSVP System', 'Maps Integration', 'Gallery']
    },
    {
      title: 'Desain Grafis',
      description: 'Creative design solutions dari branding hingga social media content yang engaging',
      icon: <FaPalette className="w-7 h-7" />,
      gradient: 'from-pink-500 via-rose-600 to-orange-500',
      features: ['Brand Identity', 'Social Media', 'Print Design']
    },
    {
      title: 'Katalog Digital',
      description: 'Smart digital catalogs dengan QR technology dan real-time inventory management',
      icon: <FaBook className="w-7 h-7" />,
      gradient: 'from-amber-500 via-orange-600 to-yellow-500',
      features: ['QR Menu', 'Real-time Update', 'Analytics']
    }
  ];

  const stats = [
    { 
      number: 50, 
      suffix: '+',
      label: 'Proyek Selesai', 
      icon: <FaRocket className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      number: 30, 
      suffix: '+',
      label: 'Klien Puas', 
      icon: <FaUsers className="w-6 h-6" />,
      color: 'from-emerald-500 to-green-500'
    },
    { 
      number: 99, 
      suffix: '%',
      label: 'Success Rate', 
      icon: <FaChartLine className="w-6 h-6" />,
      color: 'from-orange-500 to-amber-500'
    },
    { 
      number: 24, 
      suffix: '/7',
      label: 'Support Premium', 
      icon: <FaHeadset className="w-6 h-6" />,
      color: 'from-pink-500 to-rose-500'
    }
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
      {/* Scroll Progress Bar - Fixed at Top */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200/30 z-50 backdrop-blur-sm">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 transition-all duration-300 shadow-lg shadow-blue-500/50"
          style={{ width: `${scrollProgress}%`, willChange: 'width' }}
        ></div>
      </div>
      
      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 z-40 backdrop-blur-xl bg-gradient-to-r from-blue-600 to-orange-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 ${
          scrollProgress > 10 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <FaArrowUp className="w-5 h-5" />
        <span className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full blur opacity-50 animate-pulse"></span>
      </button>
      
      {/* Initial Page Load Animation Overlay */}
      <div 
        className={`fixed inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-orange-500 z-50 transition-all duration-1000 flex items-center justify-center ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="text-center">
          <div className="inline-block animate-bounce">
            <IoMdCube className="w-20 h-20 text-white animate-spin" style={{ animationDuration: '2s' }} />
          </div>
          <h2 className="text-3xl font-bold text-white mt-6 tracking-wider">NEXCUBE</h2>
          <div className="mt-4 flex gap-2 justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
      
      <div className="overflow-hidden" ref={parallaxRef}>
        {/* Three.js 3D Background - Smooth particles and shapes */}
        <Suspense fallback={null}>
          <ThreeBackground className="opacity-30" />
        </Suspense>
        
        {/* Background Elements with NEXCUBE Branding */}
        <div className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-orange-400/20 rounded-full blur-3xl -translate-x-48 -translate-y-48 animate-pulse parallax-element"></div>
        <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-blue-500/20 rounded-full blur-3xl translate-x-48 translate-y-48 animate-pulse parallax-element" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating NEXCUBE 3D Cubes */}
        <div className="fixed top-20 right-10 opacity-20 pointer-events-none z-0">
          <div className="floating-element">
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              <defs>
                <linearGradient id="cubeGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#0066FF', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#0052CC', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z" fill="url(#cubeGradient1)" />
              <path d="M50 10 L90 30 L50 50 L10 30 Z" fill="#0080FF" opacity="0.8" />
              <path d="M50 50 L50 90 L10 70 L10 30 Z" fill="#0052CC" opacity="0.9" />
            </svg>
          </div>
        </div>
        <div className="fixed bottom-20 left-10 opacity-20 pointer-events-none z-0" style={{ animationDelay: '1s' }}>
          <div className="floating-element">
            <svg viewBox="0 0 100 100" className="w-40 h-40">
              <rect x="10" y="10" width="80" height="80" rx="5" fill="none" stroke="#FF9900" strokeWidth="3" />
              <path d="M50 20 L85 40 L85 75 L50 85 L15 75 L15 40 Z" fill="url(#cubeGradient1)" />
            </svg>
          </div>
        </div>
        
        {/* Parallax NEXCUBE watermark */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.08] pointer-events-none z-0">
          <div className="parallax-element text-[15rem] md:text-[20rem] font-black bg-gradient-to-r from-blue-600/30 to-orange-500/30 bg-clip-text text-transparent">
            NEXCUBE
          </div>
        </div>

        {/* Hero Section - Full Viewport (1 Frame) */}
        <section 
          ref={heroSectionRef} 
          className="relative h-screen flex items-start justify-center overflow-hidden pt-20"
        >
          {/* Three.js 3D NEXCUBE Logo in background */}
          <Suspense fallback={null}>
            <HeroThree />
          </Suspense>
          
          {/* Modern Gradient Mesh Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/30"></div>
          
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(#0066FF 1px, transparent 1px), linear-gradient(90deg, #0066FF 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          {/* Animated 3D NEXCUBE Logo Background */}
          <div className="absolute top-20 right-10 opacity-10">
            <div className="rotate-on-scroll w-64 h-64 md:w-96 md:h-96">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#0066FF', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#0052CC', stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="orangeFrame" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FF9900', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#FF7700', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                {/* Orange Frame */}
                <rect x="30" y="30" width="140" height="140" rx="10" fill="url(#orangeFrame)" opacity="0.6" />
                {/* 3D Cube */}
                <g transform="translate(100, 100)">
                  {/* Back face */}
                  <path d="M-30,-15 L30,-15 L30,45 L-30,45 Z" fill="#0052CC" opacity="0.7" />
                  {/* Top face */}
                  <path d="M-30,-45 L0,-60 L60,-30 L30,-15 Z" fill="#0080FF" opacity="0.9" />
                  {/* Right face */}
                  <path d="M30,-15 L60,-30 L60,30 L30,45 Z" fill="url(#logoGradient)" />
                  {/* Left face */}
                  <path d="M-30,-15 L0,-30 L0,30 L-30,45 Z" fill="#0052CC" opacity="0.8" />
                  {/* Front face */}
                  <path d="M0,-30 L60,-30 L60,30 L0,30 Z" fill="url(#logoGradient)" />
                </g>
              </svg>
            </div>
          </div>
          
          <div className="container relative">
            <div className="max-w-6xl mx-auto text-center space-y-4">

              
              {/* Modern Trust Badge */}
              <div className={`inline-flex items-center justify-center gap-3 backdrop-blur-xl bg-white/70 border border-white/30 shadow-lg px-5 py-2 rounded-2xl transition-all duration-700 delay-100 ${!showHero ? 'opacity-0 -translate-y-10' : 'opacity-100 translate-y-0'}`}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full blur-md opacity-75 animate-pulse"></div>
                  <HiSparkles className="w-5 h-5 text-orange-500 relative" />
                </div>
                <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">Premium Digital Solutions 2025</span>
              </div>

              <div className="space-y-2">
                <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight transition-all duration-700 delay-200 ${!showHero ? 'opacity-0 scale-95 -translate-y-10' : 'opacity-100 scale-100 translate-y-0'}`}>
                  <span className="inline-block">
                    <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">Digital</span>
                  </span>
                  <br />
                  <span className="inline-block">
                    <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">Excellence</span>
                  </span>
                  <br />
                  <span className="text-slate-800 text-2xl md:text-3xl lg:text-4xl font-bold mt-2 inline-block drop-shadow">For Modern Business</span>
                </h1>
                
                <p className={`text-sm md:text-base lg:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto transition-all duration-700 delay-300 ${!showHero ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>
                  Transformasi bisnis Anda dengan <span className="font-bold text-blue-600">teknologi terdepan</span> dan <span className="font-bold text-orange-600">kreativitas tanpa batas</span>. Dari konsep hingga eksekusi, kami hadirkan solusi digital yang <span className="font-bold text-slate-800">menghasilkan impact nyata</span>.
                </p>
              </div>

              {/* Modern Stats Cards with Counter Animation */}
              <div className="scroll-fade-in" ref={fadeInRef}>
                <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto transition-all duration-700 delay-500 ${!showHero ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                {stats.map((stat, index) => {
                  // Counter hook untuk setiap stat
                  const StatCounter = () => {
                    const { formattedValue, elementRef } = useCountUp({
                      end: stat.number,
                      duration: 2,
                      suffix: stat.suffix,
                      enableScrollTrigger: false
                    });

                    return (
                      <div 
                        ref={elementRef as React.RefObject<HTMLDivElement>}
                        className={`text-2xl md:text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                      >
                        {formattedValue()}
                      </div>
                    );
                  };

                  return (
                    <div key={index} className="scale-on-scroll group relative">
                      {/* Glassmorphism Card */}
                      <div className="relative backdrop-blur-xl bg-white/70 border border-white/30 rounded-2xl p-4 md:p-5 hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden">
                        {/* Gradient Overlay on Hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                        
                        {/* Glow Effect */}
                        <div className={`absolute -inset-1 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                        
                        <div className="relative text-center space-y-1 md:space-y-2">
                          {/* Icon with gradient & pulse animation */}
                          <div className={`inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 animate-pulse`}>
                            {stat.icon}
                          </div>
                          
                          {/* Animated Number Counter */}
                          <StatCounter />
                          
                          {/* Label */}
                          <div className="text-xs md:text-sm font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">
                            {stat.label}
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full h-1 bg-slate-200/50 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${stat.color} transform origin-left transition-transform duration-1000 group-hover:scale-x-100 scale-x-0`}
                              style={{ transitionDelay: `${index * 100}ms` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Modern CTAs with Enhanced Animations - Moved Below Stats */}
              <div className={`flex flex-wrap gap-4 justify-center items-center mt-6 transition-all duration-700 delay-600 ${!showHero ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>
                <button 
                  onClick={(e) => handleScrollToSection(portfolioSectionRef, e)} 
                  className="group relative backdrop-blur-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:scale-110 hover:shadow-2xl inline-flex items-center gap-3 overflow-hidden hover:-translate-y-1"
                >
                  {/* Animated Background Shine */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                  
                  <FaRocket className="w-5 h-5 relative transform group-hover:rotate-12 group-hover:scale-125 transition-all duration-300" />
                  <span className="relative">Lihat Portfolio</span>
                  <FaArrowRight className="w-5 h-5 relative transform group-hover:translate-x-2 transition-transform duration-300" />
                  
                  {/* Ripple Effect */}
                  <span className="absolute inset-0 rounded-2xl">
                    <span className="animate-ping absolute inset-0 rounded-2xl bg-blue-400 opacity-0 group-hover:opacity-20"></span>
                  </span>
                </button>
                
                <Link 
                  to="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20tentang%20kebutuhan%20digital%20saya" 
                  className="group relative backdrop-blur-xl bg-white/80 hover:bg-white border-2 border-slate-200 hover:border-orange-400 text-slate-700 hover:text-orange-600 px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:scale-110 hover:shadow-2xl inline-flex items-center gap-3 overflow-hidden hover:-translate-y-1"
                >
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-orange-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  
                  <FaWhatsapp className="w-6 h-6 text-green-500 relative group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 animate-pulse" />
                  <span className="relative">Konsultasi Gratis</span>
                  <HiSparkles className="w-5 h-5 relative opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-180" />
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Link>
              </div>
            </div>
            
            {/* Scroll Indicator - Animated */}
            <div className="scroll-fade-in absolute left-1/2 -translate-x-1/2 animate-bounce">
              <div className="flex flex-col items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer">
                <span className="text-xs font-semibold">Scroll Down</span>
                <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* Premium Services Section - Full Viewport (1 Frame) */}
        <section className="relative h-screen flex items-center justify-center overflow-y-auto" ref={fadeInRef}>
          {/* Modern Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/30 to-white"></div>
          
          {/* Animated Dots Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `linear-gradient(#0066FF 1px, transparent 1px), linear-gradient(90deg, #0066FF 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>

          <div className="container relative z-10 py-10">
            {/* Section Header */}
            <div className="text-center mb-6">
              <div className="scroll-fade-in inline-block relative mb-6 scale-on-scroll">
                {/* Premium NEXCUBE Badge */}
                <div className="relative group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full blur-2xl opacity-75 group-hover:opacity-100 animate-pulse"></div>
                  <div className="relative backdrop-blur-xl bg-gradient-to-r from-blue-600 to-orange-500 text-white px-8 py-4 rounded-full font-black text-sm md:text-base shadow-2xl border-4 border-white/50 flex items-center gap-2 group-hover:scale-110 transition-transform">
                    <IoMdCube className="w-5 h-5" />
                    <span>NEXCUBE</span>
                    <HiSparkles className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <h2 className="scroll-fade-in text-3xl md:text-4xl font-black text-slate-800 mb-2 flex items-center justify-center gap-3">
                <HiSparkles className="w-8 h-8 text-orange-500" />
                <span>Premium Services</span>
                <HiSparkles className="w-8 h-8 text-blue-500" />
              </h2>
              <p className="scroll-fade-in text-base md:text-lg text-slate-600 font-medium max-w-2xl mx-auto">
                Solusi digital terlengkap untuk bisnis modern
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid md:grid-cols-2 gap-4 max-w-6xl mx-auto">
              {services.map((service, index) => (
                <div 
                  key={index}
                  className="scroll-fade-in scale-on-scroll group relative"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative h-full backdrop-blur-xl bg-white/80 hover:bg-white/95 rounded-3xl p-4 md:p-6 border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer">
                    {/* Animated Shine Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                    
                    {/* Gradient Border Effect on Hover */}
                    <div className={`absolute -inset-[2px] bg-gradient-to-r ${service.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`}></div>
                    
                    <div className="relative space-y-3">
                      {/* Gradient Icon with Multiple Animations */}
                      <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 p-4 rounded-2xl bg-gradient-to-br ${service.gradient} text-white shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 animate-pulse`}>
                          <div className="group-hover:animate-spin-slow">
                            {service.icon}
                          </div>
                        </div>
                        
                        <h3 className="text-xl md:text-2xl font-black text-slate-800 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                          {service.title}
                          <FaBolt className="w-5 h-5 text-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-bounce" />
                        </h3>
                      </div>
                      
                      <p className="text-sm md:text-base text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">
                        {service.description}
                      </p>
                      
                      {/* Feature Tags with Stagger Animation */}
                      <div className="flex flex-wrap gap-2">
                        {service.features.map((feature, idx) => (
                          <span 
                            key={idx} 
                            className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-200 hover:bg-blue-100 hover:scale-110 transition-all duration-300"
                            style={{ transitionDelay: `${idx * 50}ms` }}
                          >
                            <FaCheckCircle className="w-3 h-3 group-hover:animate-spin" />
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* Progress indicator on hover */}
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div 
                          className={`h-full bg-gradient-to-r ${service.gradient} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000`}
                          style={{ transitionDelay: '200ms' }}
                        ></div>
                      </div>
                    </div>

                    {/* Corner Badge */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-0">
                      <div className={`bg-gradient-to-r ${service.gradient} text-white text-xs font-bold px-3 py-1 rounded-full shadow-xl animate-bounce`}>
                        HOT
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NEXCUBE Brand Showcase - Full Viewport (1 Frame) */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden" ref={fadeInRef}>
          {/* Modern Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-white"></div>
          
          {/* Animated Dots Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `radial-gradient(circle, #0066FF 2px, transparent 2px)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          <div className="container relative z-10">
            {/* Main NEXCUBE 3D Logo */}
            <div className="text-center mb-6">
              <div className="scroll-fade-in scale-on-scroll inline-block relative">
                {/* Animated Glow Rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-[400px] h-[400px] rounded-full border-4 border-blue-200 animate-ping opacity-20"></div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '0.5s' }}>
                  <div className="w-[350px] h-[350px] rounded-full border-4 border-orange-200 animate-ping opacity-20"></div>
                </div>
                
                {/* Main Logo Card - Glassmorphism */}
                <div className="scale-on-scroll relative backdrop-blur-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-orange-500 rounded-[30px] p-6 md:p-8 shadow-[0_30px_60px_-20px_rgba(0,102,255,0.5)] border-2 border-white/30">
                  {/* NEXCUBE Real Logo - Enhanced */}
                  <div className="mb-4 flex justify-center relative">
                    <div className="relative group cursor-pointer">
                      <div className="absolute inset-0 bg-white/30 rounded-2xl blur-2xl group-hover:blur-3xl transition-all animate-pulse"></div>
                      <div className="relative backdrop-blur-xl bg-white/10 rounded-2xl p-4 border-2 border-white/30 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                        <img 
                          src="/images/NexCube-full.png" 
                          alt="NEXCUBE Digital Logo" 
                          className="h-16 md:h-20 w-auto drop-shadow-2xl relative group-hover:rotate-3 transition-all duration-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Typography - Modern 2025 */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl">
                        <span className="inline-block hover:scale-110 transition-transform">NEX</span>
                        <span className="inline-block text-orange-200 hover:scale-110 transition-transform">CUBE</span>
                      </h2>
                      <HiSparkles className="w-8 h-8 text-orange-300 animate-pulse" />
                    </div>
                    <div className="text-xl font-black text-orange-200 tracking-wider">
                      Digital.
                    </div>
                    <div className="text-sm font-bold text-white/90 max-w-2xl mx-auto">
                      Your Trusted Digital Transformation Partner
                    </div>
                    
                    {/* Feature Pills - Modern */}
                    <div className="flex flex-wrap gap-2 justify-center mt-2">
                      {[
                        { text: 'Premium Quality', icon: <FaGem className="w-3 h-3" /> },
                        { text: 'Lightning Fast', icon: <HiLightningBolt className="w-3 h-3" /> },
                        { text: '24/7 Support', icon: <FaClock className="w-3 h-3" /> },
                        { text: 'Best Value', icon: <FaStar className="w-3 h-3" /> }
                      ].map((badge, i) => (
                        <div key={i} className="scroll-fade-in group cursor-pointer backdrop-blur-xl bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-white text-sm font-bold border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-110 inline-flex items-center gap-2" style={{ animationDelay: `${i * 0.1}s` }}>
                          {badge.icon}
                          <span>{badge.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Choose NEXCUBE - Modern Cards */}
            <div className="grid md:grid-cols-3 gap-4 md:gap-5">
              {[
                {
                  icon: <FaRocket className="w-12 h-12" />,
                  title: 'Innovation First',
                  desc: 'Teknologi cutting-edge dan solusi inovatif untuk akselerasi bisnis digital Anda',
                  gradient: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: <FaGem className="w-12 h-12" />,
                  title: 'Premium Quality',
                  desc: 'Standar kualitas internasional dengan harga yang kompetitif dan value terbaik',
                  gradient: 'from-purple-500 to-pink-500'
                },
                {
                  icon: <FaBolt className="w-12 h-12" />,
                  title: 'Fast & Reliable',
                  desc: 'Pengerjaan cepat dengan hasil maksimal, tanpa mengorbankan kualitas premium',
                  gradient: 'from-orange-500 to-amber-500'
                }
              ].map((item, index) => (
                <div key={index} className="scroll-fade-in scale-on-scroll group" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="relative backdrop-blur-xl bg-white/60 hover:bg-white/80 border border-white/40 rounded-3xl p-5 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                    
                    <div className="relative text-center space-y-3">
                      {/* Icon */}
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <div className="w-8 h-8">{item.icon}</div>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-lg font-black text-slate-800 bg-gradient-to-r ${item.gradient} bg-clip-text group-hover:text-transparent transition-all duration-300">
                        {item.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trusted By Section - Full Viewport (1 Frame) */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden" ref={fadeInRef}>
          {/* Modern Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-white to-orange-50/50"></div>
          
          {/* 3D NEXCUBE Pattern Background */}
          <div className="absolute inset-0 opacity-5 overflow-hidden">
            <div className="grid grid-cols-8 gap-6 p-8 rotate-12 scale-150">
              {[...Array(32)].map((_, i) => (
                <div key={i} className="scroll-fade-in animate-float" style={{ animationDelay: `${i * 0.1}s` }}>
                  <svg viewBox="0 0 40 40" className="w-10 h-10">
                    <rect x="2" y="2" width="36" height="36" rx="4" fill="none" stroke="#FF9900" strokeWidth="2" opacity="0.4" />
                    <g transform="translate(20, 20)">
                      <path d="M-8,-4 L8,-4 L8,10 L-8,10 Z" fill="#0066FF" opacity="0.6" />
                      <path d="M-8,-10 L0,-13 L16,-6 L8,-4 Z" fill="#0080FF" opacity="0.8" />
                      <path d="M8,-4 L16,-6 L16,6 L8,10 Z" fill="#0052CC" opacity="0.7" />
                    </g>
                  </svg>
                </div>
              ))}
            </div>
          </div>
          
          <div className="container relative z-10">
            <div className="text-center mb-12">
              <div className="scroll-fade-in inline-flex items-center gap-3 backdrop-blur-xl bg-white/80 border border-white/40 px-6 py-3 rounded-2xl text-sm font-bold text-slate-700 shadow-xl mb-6">
                <FaCheckCircle className="w-5 h-5 text-green-500" />
                <span>Dipercaya oleh <span className="text-blue-600">30+</span> Bisnis di Indonesia</span>
              </div>
              
              <h2 className="scroll-fade-in text-4xl font-black text-slate-800">
                Partner Terpercaya untuk <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">Transformasi Digital</span>
              </h2>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-8">
              {[1, 2, 3, 4, 5].map((item, index) => (
                <div 
                  key={index}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className="scroll-fade-in group"
                >
                  <div className="backdrop-blur-xl bg-white/70 hover:bg-white/90 p-6 rounded-2xl border border-white/50 hover:shadow-2xl transition-all duration-300 hover:scale-110">
                    <img 
                      src={`/images/clients/client-${item}.png`} 
                      alt={`Client Logo ${item}`}
                      className="h-12 w-auto object-contain opacity-60 group-hover:opacity-100 transition-opacity" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Section - Replaces Pricing */}
        <section ref={portfolioSectionRef} id="portfolio">
          <Portfolio />
        </section>

        {/* Testimonials - Full Viewport (1 Frame) */}
        <section 
          ref={testimonialSectionRef}
          className="relative h-screen flex items-center justify-center overflow-hidden"
        >
          {/* Modern Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-white"></div>
          
          {/* Animated NEXCUBE Orbs */}
          <div className="absolute top-20 left-10 opacity-10" ref={scaleRef}>
            <div className="scale-on-scroll w-80 h-80 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full blur-[100px] animate-pulse"></div>
          </div>
          <div className="absolute bottom-20 right-10 opacity-10" ref={scaleRef}>
            <div className="scale-on-scroll w-80 h-80 bg-gradient-to-br from-orange-500 to-orange-300 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="container relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="scroll-fade-in inline-flex items-center gap-2 backdrop-blur-xl bg-white/80 border border-white/40 px-6 py-3 rounded-2xl text-sm font-bold text-orange-600 shadow-xl mb-6">
                <FaStar className="w-5 h-5" />
                <span>4.9/5 Rating dari 30+ Klien Puas</span>
              </div>
              
              <h2 className="scroll-fade-in text-5xl font-black text-slate-800 mb-6">
                Cerita Sukses <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">Klien Kami</span>
              </h2>
              
              <p className="scroll-fade-in text-lg text-slate-600">
                Kepuasan dan kesuksesan klien adalah prioritas utama dalam setiap proyek digital kami
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-6">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="scroll-fade-in scale-on-scroll group"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="relative h-full backdrop-blur-2xl bg-white/80 hover:bg-white/95 border border-white/60 rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative space-y-6">
                      {/* Rating Stars */}
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <FaStar key={i} className="w-5 h-5 text-amber-400 fill-current drop-shadow-sm" />
                        ))}
                      </div>
                      
                      {/* Testimonial Text */}
                      <blockquote className="text-slate-700 leading-relaxed italic text-lg group-hover:text-slate-800 transition-colors">
                        "{testimonial.text}"
                      </blockquote>
                      
                      {/* Client Info */}
                      <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <span className="text-white font-black text-xl drop-shadow">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-black text-slate-800 group-hover:text-blue-600 transition-colors text-lg">
                            {testimonial.name}
                          </div>
                          <div className="text-sm font-semibold text-slate-500 flex items-center gap-2">
                            <FaCheckCircle className="w-3 h-3 text-green-500" />
                            {testimonial.company}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Modern Footer NEXCUBE Branding */}
            <div className="text-center mt-16" ref={fadeInRef}>
              {/* Main NEXCUBE Card - Ultra Modern */}
              <div className="scroll-fade-in mb-12">
                <div className="inline-block relative group cursor-pointer">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 rounded-[40px] blur-3xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse"></div>                  
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}