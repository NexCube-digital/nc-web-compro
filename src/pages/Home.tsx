import React, { useRef, useEffect, useState, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { Portfolio } from '../components/Portfolio'
import { Testimonial } from '../components/Testimonial'
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
  FaUsers,
  FaChartLine,
  FaHeadset
} from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'
import { IoMdCube } from 'react-icons/io'

// Lazy load Three.js components for better performance
const ThreeBackground = React.lazy(() => import('../components/ThreeBackground'))
const HeroThree = React.lazy(() => import('../components/HeroThree'))

// Separate StatCounter component to prevent re-initialization on scroll
interface StatCounterProps {
  number: number;
  suffix: string;
  color: string;
}

const StatCounter: React.FC<StatCounterProps> = React.memo(({ number, suffix, color }) => {
  const { formattedValue, elementRef } = useCountUp({
    end: number,
    duration: 2,
    suffix: suffix,
    enableScrollTrigger: true
  });

  return (
    <div 
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`text-xl md:text-2xl font-black bg-gradient-to-r ${color} bg-clip-text text-transparent`}
    >
      {formattedValue()}
    </div>
  );
});

StatCounter.displayName = 'StatCounter';

export const Home: React.FC = () => {
  const heroSectionRef = useRef<HTMLElement>(null);
  const portfolioSectionRef = useRef<HTMLElement>(null);
  const testimonialSectionRef = useRef<HTMLElement>(null);
  
  const fadeInRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  
  // Apply GSAP animations
  useScrollFadeIn('.scroll-fade-in');
  useParallax('.parallax-element', 0.3);
  useScrollRotate('.rotate-on-scroll', 360);
  useScrollScale('.scale-on-scroll');
  useFloatingAnimation('.floating-element');
  
  useSmoothScroll();
  useThreePerformance();
  
  const { scrollTo } = useSmoothScrollRAF();
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [showHero, setShowHero] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const isFirstVisit = !sessionStorage.getItem('hasVisitedHome');
    
    if (isFirstVisit) {
      const loadTimer = setTimeout(() => setIsLoaded(true), 800);
      const heroTimer = setTimeout(() => setShowHero(true), 1000);
      sessionStorage.setItem('hasVisitedHome', 'true');
      
      return () => {
        clearTimeout(loadTimer);
        clearTimeout(heroTimer);
      };
    } else {
      setIsLoaded(true);
      setShowHero(true);
    }
  }, []);
  
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
  
  const handleScrollToSection = (ref: React.RefObject<HTMLElement>, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (ref.current) {
      const headerOffset = 80;
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };
  
  useEffect(() => {
    const adjustHeroHeight = () => {
      if (heroSectionRef.current) {
        const windowHeight = window.innerHeight;
        heroSectionRef.current.style.minHeight = `${windowHeight - 20}px`;
      }
    };
    adjustHeroHeight();
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
      number: 50, suffix: '+', label: 'Proyek Selesai', 
      icon: <FaRocket className="w-6 h-6" />, color: 'from-blue-500 to-cyan-500'
    },
    { 
      number: 30, suffix: '+', label: 'Klien Puas', 
      icon: <FaUsers className="w-6 h-6" />, color: 'from-emerald-500 to-green-500'
    },
    { 
      number: 99, suffix: '%', label: 'Success Rate', 
      icon: <FaChartLine className="w-6 h-6" />, color: 'from-orange-500 to-amber-500'
    },
    { 
      number: 24, suffix: '/7', label: 'Support Premium', 
      icon: <FaHeadset className="w-6 h-6" />, color: 'from-pink-500 to-rose-500'
    }
  ];
  
  return (
    <Layout>
      {/* Scroll Progress Bar */}
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
        {/* Three.js 3D Background */}
        <Suspense fallback={null}>
          <ThreeBackground className="opacity-30" />
        </Suspense>
        
        {/* Background Elements */}
        <div className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-orange-400/20 rounded-full blur-3xl -translate-x-48 -translate-y-48 animate-pulse parallax-element"></div>
        <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-blue-500/20 rounded-full blur-3xl translate-x-48 translate-y-48 animate-pulse parallax-element" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating Cubes */}
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
        
        {/* Parallax Watermark */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.08] pointer-events-none z-0">
          <div className="parallax-element text-[15rem] md:text-[20rem] font-black bg-gradient-to-r from-blue-600/30 to-orange-500/30 bg-clip-text text-transparent">
            NEXCUBE
          </div>
        </div>

        {/* ===== HERO SECTION ===== */}
        <section 
          ref={heroSectionRef} 
          className="relative h-screen flex items-center justify-center overflow-hidden"
        >
          <Suspense fallback={null}>
            <HeroThree />
          </Suspense>
          
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/30"></div>
          
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(#0066FF 1px, transparent 1px), linear-gradient(90deg, #0066FF 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
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
                <rect x="30" y="30" width="140" height="140" rx="10" fill="url(#orangeFrame)" opacity="0.6" />
                <g transform="translate(100, 100)">
                  <path d="M-30,-15 L30,-15 L30,45 L-30,45 Z" fill="#0052CC" opacity="0.7" />
                  <path d="M-30,-45 L0,-60 L60,-30 L30,-15 Z" fill="#0080FF" opacity="0.9" />
                  <path d="M30,-15 L60,-30 L60,30 L30,45 Z" fill="url(#logoGradient)" />
                  <path d="M-30,-15 L0,-30 L0,30 L-30,45 Z" fill="#0052CC" opacity="0.8" />
                  <path d="M0,-30 L60,-30 L60,30 L0,30 Z" fill="url(#logoGradient)" />
                </g>
              </svg>
            </div>
          </div>
          
          <div className="container relative">
            <div className="max-w-5xl mx-auto text-center space-y-4 md:space-y-6">
              {/* Trust Badge */}
              <div className={`inline-flex items-center justify-center gap-2 backdrop-blur-xl bg-white/70 border border-white/30 shadow-lg px-4 py-1.5 rounded-2xl transition-all duration-500 delay-100 ${!showHero ? 'opacity-0 -translate-y-10' : 'opacity-100 translate-y-0'}`}>
                <HiSparkles className="w-4 h-4 text-orange-500" />
                <span className="text-xs md:text-sm font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">Premium Digital Solutions 2025</span>
              </div>

              <div className="space-y-3 md:space-y-4">
                <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight transition-all duration-500 delay-200 ${!showHero ? 'opacity-0 scale-95 -translate-y-10' : 'opacity-100 scale-100 translate-y-0'}`}>
                  <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">Digital Excellence</span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-orange-500 to-orange-600 bg-clip-text text-transparent text-2xl md:text-3xl lg:text-4xl font-bold mt-2 inline-block">For Modern Business</span>
                </h1>
                
                <p className={`text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto transition-all duration-500 delay-300 ${!showHero ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>
                  Transformasi bisnis Anda dengan teknologi terdepan dan kreativitas tanpa batas. Dari konsep hingga eksekusi, kami hadirkan solusi digital yang menghasilkan impact nyata.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="scroll-fade-in" ref={fadeInRef}>
                <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto transition-all duration-500 delay-400 ${!showHero ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                  {stats.map((stat, index) => (
                    <div key={index} className="scale-on-scroll group relative">
                      <div className="relative backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-4 md:p-5 hover:bg-white transition-all duration-300 hover:shadow-xl overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                        <div className="relative text-center space-y-2">
                          <div className={`inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg group-hover:scale-105 transition-all duration-300`}>
                            <div className="w-4 h-4 md:w-5 md:h-5">{stat.icon}</div>
                          </div>
                          <StatCounter number={stat.number} suffix={stat.suffix} color={stat.color} />
                          <div className="text-xs md:text-sm font-semibold text-slate-600">{stat.label}</div>
                          <div className="w-full h-1 bg-slate-200/50 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${stat.color} transform origin-left transition-transform duration-1000 group-hover:scale-x-100 scale-x-0`}
                              style={{ transitionDelay: `${index * 100}ms` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* CTAs */}
              <div className={`flex flex-wrap gap-3 md:gap-4 justify-center items-center transition-all duration-500 delay-500 ${!showHero ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>
                <button 
                  onClick={(e) => handleScrollToSection(portfolioSectionRef, e)} 
                  className="group bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-xl text-sm md:text-base font-bold transition-all duration-300 hover:shadow-xl inline-flex items-center gap-2"
                >
                  <FaRocket className="w-4 h-4" />
                  <span>Lihat Portfolio</span>
                  <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <Link 
                  to="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20tentang%20kebutuhan%20digital%20saya" 
                  className="group bg-white hover:bg-gray-50 border-2 border-slate-200 hover:border-green-500 text-slate-700 hover:text-green-600 px-6 py-3 rounded-xl text-sm md:text-base font-bold transition-all duration-300 hover:shadow-xl inline-flex items-center gap-2"
                >
                  <FaWhatsapp className="w-5 h-5 text-green-500" />
                  <span>Konsultasi Gratis</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SERVICES SECTION ===== */}
        <section className="relative py-16 md:py-20" ref={fadeInRef}>
          <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/30 to-white"></div>
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `linear-gradient(#0066FF 1px, transparent 1px), linear-gradient(90deg, #0066FF 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>

          <div className="container relative z-10">
            <div className="text-center mb-12">
              <h2 className="scroll-fade-in text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 via-orange-500 to-orange-600 bg-clip-text text-transparent mb-3">
                Premium Services
              </h2>
              <p className="scroll-fade-in text-lg bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent font-semibold max-w-2xl mx-auto">
                Solusi digital terlengkap untuk bisnis modern
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 max-w-6xl mx-auto">
              {services.map((service, index) => (
                <div 
                  key={index}
                  className="scroll-fade-in scale-on-scroll group relative"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative h-full bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${service.gradient} text-white shadow-lg`}>
                          {service.icon}
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-800">{service.title}</h3>
                      </div>
                      <p className="text-base text-slate-600 leading-relaxed">{service.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {service.features.map((feature, idx) => (
                          <span 
                            key={idx} 
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg"
                          >
                            <FaCheckCircle className="w-3 h-3" />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== BRAND SHOWCASE ===== */}
        <section className="relative overflow-hidden py-12 md:py-16" ref={fadeInRef}>
          <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-white"></div>
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `radial-gradient(circle, #0066FF 2px, transparent 2px)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          <div className="container relative z-10">
            <div className="text-center mb-12">
              <div className="scroll-fade-in inline-block">
                <div className="bg-gradient-to-br from-blue-600 to-orange-500 rounded-2xl p-8 shadow-xl">
                  <div className="mb-4 flex justify-center">
                    <img 
                      src="/images/NexCube-full.png" 
                      alt="NEXCUBE Digital Logo" 
                      className="h-16 md:h-20 w-auto"
                    />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl md:text-4xl font-black text-white">NEXCUBE Digital.</h2>
                    <p className="text-white/90">Your Trusted Digital Transformation Partner</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
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
                <div key={index} className="scroll-fade-in" style={{ animationDelay: `${index * 0.15}s` }}>
                  <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="text-center space-y-3">
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-lg`}>
                        <div className="w-7 h-7">{item.icon}</div>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TRUSTED BY ===== */}
        <section className="relative overflow-hidden py-12 md:py-16" ref={fadeInRef}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-white to-orange-50/50"></div>
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
            <div className="text-center mb-6">
              <div className="scroll-fade-in inline-flex items-center gap-2 backdrop-blur-xl bg-white/80 border border-white/40 px-4 py-2 rounded-xl text-xs md:text-sm font-bold text-slate-700 shadow-lg mb-3">
                <FaCheckCircle className="w-4 h-4 text-green-500" />
                <span>Dipercaya oleh <span className="text-blue-600">30+</span> Bisnis di Indonesia</span>
              </div>
              <h2 className="scroll-fade-in text-xl md:text-2xl font-bold text-slate-800">
                Partner Terpercaya untuk <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">Transformasi Digital</span>
              </h2>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
              {[1, 2, 3, 4, 5].map((item, index) => (
                <div key={index} style={{ animationDelay: `${index * 0.1}s` }} className="scroll-fade-in group">
                  <div className="backdrop-blur-xl bg-white/70 hover:bg-white/90 p-3 md:p-4 rounded-xl border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <img 
                      src={`/images/clients/client-${item}.png`} 
                      alt={`Client Logo ${item}`}
                      className="h-8 md:h-10 w-auto object-contain opacity-60 group-hover:opacity-100 transition-opacity" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PORTFOLIO SECTION ===== */}
        <section ref={portfolioSectionRef} id="portfolio">
          <Portfolio />
        </section>

        {/* ===== TESTIMONIALS SECTION ===== */}
        <section ref={testimonialSectionRef} id="testimonials">
          <Testimonial />
        </section>

      </div>
    </Layout>
  )
}