import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async';
import { PricingCard } from '../ui/PricingCard'
import apiClient from '../services/api'
import { pricingData } from '../data/pricingData'
import { Navbar } from '../components/layout/Navbar';
import { useScrollFadeIn, useScrollScale, useParallax } from '../hooks/useGsapAnimation';
import { useSmoothScroll } from '../hooks/useSmoothAnimation';
import { useCountUp } from '../hooks/useCountUp';
import { HiSparkles, HiCheckCircle, HiChip, HiDeviceMobile, HiCloud, HiShieldCheck } from 'react-icons/hi';
import { FaRocket, FaArrowRight, FaWhatsapp, FaGithub, FaFigma, FaGoogle } from 'react-icons/fa';
import { SiAdobephotoshop, SiAdobexd, SiFramer, SiTailwindcss, SiReact, SiTypescript } from 'react-icons/si';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export const PaketDigital: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [packages, setPackages] = useState<any[]>([])
  const [paketCategories, setPaketCategories] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isGridView, setIsGridView] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const techStackRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroBadgeRef = useRef<HTMLDivElement>(null);
  const heroDescRef = useRef<HTMLParagraphElement>(null);
  const heroStatsRef = useRef<HTMLDivElement>(null);
  const heroCTARef = useRef<HTMLDivElement>(null);
  const heroLogoRef = useRef<HTMLDivElement>(null);

  // Apply GSAP animations hooks
  useScrollFadeIn('.scroll-fade-in');
  useScrollScale('.scale-on-scroll');
  useParallax('.parallax-element', 0.3);
  useSmoothScroll();

  // Base category definitions
  const basePaketCategories = [
    {
      id: 'website',
      title: 'Website',
      subtitle: 'Professional Web Solutions',
      description: 'Website modern dengan teknologi terkini untuk bisnis Anda',
      icon: <SiReact className="w-6 h-6" />,
      gradient: 'from-blue-600 to-cyan-500',
      lightGradient: 'from-blue-50 to-cyan-50',
      tierIds: ['student', 'bronze', 'silver', 'gold', 'platinum'],
      techStack: [SiReact, SiTypescript, SiTailwindcss],
      color: 'blue'
    },
    {
      id: 'undangan',
      title: 'Undangan Digital',
      subtitle: 'Interactive Invitations',
      description: 'Undangan interaktif dengan animasi dan fitur modern',
      icon: <SiFramer className="w-6 h-6" />,
      gradient: 'from-emerald-600 to-teal-500',
      lightGradient: 'from-emerald-50 to-teal-50',
      tierIds: ['bronze', 'silver', 'gold'],
      techStack: [SiFramer, SiAdobexd, SiAdobephotoshop],
      color: 'emerald'
    },
    {
      id: 'desain',
      title: 'Desain Grafis',
      subtitle: 'Creative Design Studio',
      description: 'Solusi desain visual untuk branding dan marketing',
      icon: <SiAdobephotoshop className="w-6 h-6" />,
      gradient: 'from-purple-600 to-pink-500',
      lightGradient: 'from-purple-50 to-pink-50',
      tierIds: ['bronze', 'silver', 'gold', 'platinum'],
      techStack: [SiAdobephotoshop, SiAdobexd, FaFigma],
      color: 'purple'
    },
    {
      id: 'katalog',
      title: 'Katalog Digital',
      subtitle: 'Digital Catalog Solutions',
      description: 'Katalog produk interaktif untuk meningkatkan penjualan',
      icon: <HiDeviceMobile className="w-6 h-6" />,
      gradient: 'from-orange-600 to-amber-500',
      lightGradient: 'from-orange-50 to-amber-50',
      tierIds: ['silver', 'gold', 'platinum'],
      techStack: [SiTailwindcss, SiReact, FaGoogle],
      color: 'orange'
    }
  ];

  // Features data
  const features = [
    {
      icon: <HiChip className="w-8 h-8" />,
      title: 'Teknologi Modern',
      description: 'Dibangun dengan stack teknologi terbaru untuk performa maksimal'
    },
    {
      icon: <HiCloud className="w-8 h-8" />,
      title: 'Cloud Hosting',
      description: 'Hosting premium dengan uptime 99.9% dan kecepatan tinggi'
    },
    {
      icon: <HiShieldCheck className="w-8 h-8" />,
      title: 'Keamanan Enterprise',
      description: 'SSL gratis, backup otomatis, dan proteksi DDoS'
    },
    {
      icon: <HiDeviceMobile className="w-8 h-8" />,
      title: 'Responsive Design',
      description: 'Tampil sempurna di semua perangkat, dari mobile hingga desktop'
    }
  ];

  // Comparison data
  const comparisonData = [
    { feature: 'Halaman Website', basic: '5', pro: '20', enterprise: 'Unlimited' },
    { feature: 'Database', basic: '1', pro: '3', enterprise: 'Unlimited' },
    { feature: 'Email Business', basic: '2', pro: '10', enterprise: 'Unlimited' },
    { feature: 'Bandwidth', basic: '10 GB', pro: '50 GB', enterprise: 'Unlimited' },
    { feature: 'Support', basic: 'Email', pro: 'Priority', enterprise: '24/7' }
  ];

  // Fetch packages
  useEffect(() => {
    const fetchPackagesAndCategories = async () => {
      try {
        const res = await apiClient.getPackages()
        if (res && res.data) {
          const normalized = res.data.map((pkg: any) => ({
            ...pkg,
            _normalizedType: normalizeTypeForCategory(pkg.type)
          }))
          setPackages(normalized)
          
          const packagesByType: Record<string, any[]> = {}
          normalized.forEach((pkg: any) => {
            const t = pkg._normalizedType || pkg.type
            if (!packagesByType[t]) packagesByType[t] = []
            packagesByType[t].push(pkg)
          })
          
          const categories = basePaketCategories.map(baseCat => {
            const packagesForType = packagesByType[baseCat.id] || []
            return {
              ...baseCat,
              packageCount: packagesForType.length,
              hasPackages: packagesForType.length > 0,
              tierIds: packagesForType.map((p: any) => p.id)
            }
          }).filter(cat => cat.hasPackages)
          
          setPaketCategories(categories)
        }
      } catch (e) {
        console.error('Failed to load packages', e)
        setPaketCategories(basePaketCategories)
      }
    }

    fetchPackagesAndCategories()
  }, [])

  // Initialize animations
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);

    // Hero animations
    if (heroBadgeRef.current) {
      gsap.fromTo(heroBadgeRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.8)', delay: 0.1 }
      );
    }
    
    if (heroTitleRef.current) {
      const titleSpans = heroTitleRef.current.querySelectorAll('.hero-title-word');
      gsap.fromTo(titleSpans,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.15, delay: 0.3 }
      );
    }
    
    if (heroDescRef.current) {
      gsap.fromTo(heroDescRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out', delay: 0.6 }
      );
    }
    
    if (heroStatsRef.current) {
      const statsCards = heroStatsRef.current.querySelectorAll('.stat-card');
      gsap.fromTo(statsCards,
        { scale: 0.8, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.4)', stagger: 0.1, delay: 0.8 }
      );
    }
    
    if (heroCTARef.current) {
      const ctaButtons = heroCTARef.current.querySelectorAll('.cta-button');
      gsap.fromTo(ctaButtons,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.15, delay: 1.2 }
      );
    }
    
    if (heroLogoRef.current) {
      gsap.to(heroLogoRef.current, {
        rotation: 360,
        duration: 20,
        ease: 'none',
        repeat: -1
      });
    }

    // Features animation
    if (featuresRef.current) {
      gsap.fromTo(featuresRef.current.children,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // Tech stack animation
    if (techStackRef.current) {
      gsap.fromTo(techStackRef.current.children,
        { rotation: -10, opacity: 0 },
        {
          rotation: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: techStackRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    return () => clearTimeout(timer);
  }, []);

  const normalizeTypeForCategory = (backendType: string) => {
    if (!backendType) return backendType
    const t = String(backendType).toLowerCase()
    if (t === 'event' || t === 'undangan' || t === 'undangan-digital') return 'undangan'
    if (t === 'website' || t === 'web') return 'website'
    if (t === 'desain' || t === 'desain-grafis') return 'desain'
    if (t === 'katalog' || t === 'menu-katalog') return 'katalog'
    return t
  }

  // Get filtered packages
  const getFilteredPackages = () => {
    if (activeCategory === 'all') {
      return packages.length > 0 ? packages : pricingData;
    }
    const category = paketCategories.find(c => c.id === activeCategory);
    if (!category) return [];
    
    return packages.length > 0
      ? packages.filter(p => (p._normalizedType || normalizeTypeForCategory(p.type)) === category.id)
      : pricingData.filter(item => category.tierIds.includes(item.id));
  };

  // Render category tabs
  const renderCategoryTabs = () => (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      <button
        onClick={() => setActiveCategory('all')}
        className={`group relative px-6 py-3 rounded-2xl font-bold transition-all duration-300 overflow-hidden ${
          activeCategory === 'all'
            ? 'text-white'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        {activeCategory === 'all' && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 animate-gradient-x"></div>
        )}
        <span className="relative flex items-center gap-2">
          <HiSparkles className="w-5 h-5" />
          Semua Paket
        </span>
      </button>
      
      {paketCategories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setActiveCategory(cat.id)}
          className={`group relative px-6 py-3 rounded-2xl font-bold transition-all duration-300 overflow-hidden ${
            activeCategory === cat.id
              ? 'text-white'
              : `text-slate-600 hover:text-${cat.color}-600`
          }`}
        >
          {activeCategory === cat.id && (
            <div className={`absolute inset-0 bg-gradient-to-r ${cat.gradient} animate-gradient-x`}></div>
          )}
          <span className="relative flex items-center gap-2">
            {cat.icon}
            {cat.title}
          </span>
        </button>
      ))}
    </div>
  );

  // Render view toggle
  const renderViewToggle = () => (
    <div className="flex justify-end mb-8">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-1 shadow-lg border border-slate-200">
        <button
          onClick={() => setIsGridView(true)}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            isGridView ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-slate-600'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
        <button
          onClick={() => setIsGridView(false)}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            !isGridView ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-slate-600'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  );

  // Render pricing cards
  const renderPricingCards = () => {
    const filteredPackages = getFilteredPackages();
    const categories = activeCategory === 'all' ? paketCategories : paketCategories.filter(c => c.id === activeCategory);
    
    if (isGridView) {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPackages.map((pkg, index) => {
            const category = categories.find(c => c.tierIds.includes(pkg.id)) || categories[0];
            const Icon = category?.icon || <HiSparkles />;
            
            return (
              <div
                key={pkg.id || index}
                className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-200/50 overflow-hidden cursor-pointer"
                onClick={() => setSelectedTier(pkg.id)}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category?.lightGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${category?.gradient} text-white p-4 mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  {Icon}
                </div>
                
                {/* Title */}
                <h3 className="relative text-xl font-bold text-slate-800 mb-2">
                  {pkg.title || pkg.name || `Paket ${index + 1}`}
                </h3>
                
                {/* Category */}
                {category && (
                  <div className={`relative inline-block px-3 py-1 rounded-full text-xs font-semibold bg-${category.color}-100 text-${category.color}-600 mb-4`}>
                    {category.title}
                  </div>
                )}
                
                {/* Price */}
                <div className="relative mb-4">
                  <span className="text-3xl font-black text-slate-800">{pkg.price || 'Hubungi'}</span>
                  {pkg.price && <span className="text-slate-500 text-sm">/tahun</span>}
                </div>
                
                {/* Features */}
                <div className="relative space-y-2 mb-6">
                  {(pkg.features || pkg.includes || []).slice(0, 4).map((feature: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <HiCheckCircle className={`w-4 h-4 text-${category?.color}-500 flex-shrink-0`} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* Button */}
                <Link
                  to={pkg.id ? `/paket/digital/${category?.id}/${pkg.id}` : '#'}
                  className={`relative w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r ${category?.gradient} text-white font-bold group-hover:shadow-lg transition-all duration-300`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Lihat Detail</span>
                  <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      );
    } else {
      // List view
      return (
        <div className="space-y-4">
          {filteredPackages.map((pkg, index) => {
            const category = categories.find(c => c.tierIds.includes(pkg.id)) || categories[0];
            
            return (
              <div
                key={pkg.id || index}
                className="group relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 cursor-pointer"
                onClick={() => setSelectedTier(pkg.id)}
              >
                <div className="flex flex-wrap items-center gap-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category?.gradient} text-white p-4 flex-shrink-0`}>
                    {category?.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-[200px]">
                    <h3 className="text-xl font-bold text-slate-800 mb-1">
                      {pkg.title || pkg.name || `Paket ${index + 1}`}
                    </h3>
                    {category && (
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-${category.color}-100 text-${category.color}-600`}>
                        {category.title}
                      </div>
                    )}
                  </div>
                  
                  {/* Price */}
                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-800">{pkg.price || 'Custom'}</div>
                    {pkg.price && <div className="text-sm text-slate-500">/tahun</div>}
                  </div>
                  
                  {/* Button */}
                  <Link
                    to={pkg.id ? `/paket/digital/${category?.id}/${pkg.id}` : '#'}
                    className={`px-6 py-3 rounded-xl bg-gradient-to-r ${category?.gradient} text-white font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-2`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Detail</span>
                    <FaArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  };

  return (
    <>
      <Navbar />
      
      {/* Background Elements with NEXCUBE Branding - Same as Paket */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-orange-400/20 rounded-full blur-3xl -translate-x-48 -translate-y-48 animate-pulse parallax-element pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-blue-500/20 rounded-full blur-3xl translate-x-48 translate-y-48 animate-pulse parallax-element pointer-events-none z-0" style={{ animationDelay: '2s' }}></div>
      
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
        <div className="parallax-element text-[10rem] md:text-[15rem] font-black bg-gradient-to-r from-blue-600/30 to-orange-500/30 bg-clip-text text-transparent">
          NEXCUBE
        </div>
      </div>
      
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <Helmet>
          <title>Paket Digital - NexCube Digital Solutions</title>
          <meta name="description" content="Solusi digital lengkap untuk bisnis Anda - Website, Undangan Digital, Desain Grafis, dan Katalog Digital dengan teknologi modern" />
        </Helmet>

        {/* Hero Section - With Same Background as Paket */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
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
          <div className="absolute top-20 right-10 opacity-10" ref={heroLogoRef}>
            <div className="w-64 h-64 md:w-96 md:h-96">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <linearGradient id="logoGradientPaket" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#0066FF', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#0052CC', stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="orangeFramePaket" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FF9900', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#FF7700', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                {/* Orange Frame */}
                <rect x="30" y="30" width="140" height="140" rx="10" fill="url(#orangeFramePaket)" opacity="0.6" />
                {/* 3D Cube */}
                <g transform="translate(100, 100)">
                  {/* Back face */}
                  <path d="M-30,-15 L30,-15 L30,45 L-30,45 Z" fill="#0052CC" opacity="0.7" />
                  {/* Top face */}
                  <path d="M-30,-45 L0,-60 L60,-30 L30,-15 Z" fill="#0080FF" opacity="0.9" />
                  {/* Right face */}
                  <path d="M30,-15 L60,-30 L60,30 L30,45 Z" fill="url(#logoGradientPaket)" />
                  {/* Left face */}
                  <path d="M-30,-15 L0,-30 L0,30 L-30,45 Z" fill="#0052CC" opacity="0.8" />
                  {/* Front face */}
                  <path d="M0,-30 L60,-30 L60,30 L0,30 Z" fill="url(#logoGradientPaket)" />
                </g>
              </svg>
            </div>
          </div>
          
          <div className="container relative z-10">
            <div className="max-w-5xl mx-auto text-center space-y-3">
              
              {/* Modern Trust Badge */}
              <div ref={heroBadgeRef} className="inline-flex items-center justify-center gap-3 backdrop-blur-xl bg-white/70 border border-white/30 shadow-lg px-5 py-2 rounded-2xl">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full blur-md opacity-75 animate-pulse"></div>
                  <HiSparkles className="w-5 h-5 text-orange-500 relative" />
                </div>
                <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">Digital Solutions 2025</span>
              </div>

              <div className="space-y-2">
                <h1 ref={heroTitleRef} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight">
                  <span className="inline-block hero-title-word">
                    <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">Transformasi Digital</span>
                  </span>
                  <br />
                  <span className="inline-block hero-title-word">
                    <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">Untuk Bisnis Anda</span>
                  </span>
                  <br />
                  <span className="text-slate-800 text-xl md:text-2xl lg:text-3xl font-bold mt-2 inline-block drop-shadow hero-title-word">Dengan Teknologi Modern</span>
                </h1>
                
                <p ref={heroDescRef} className="text-xs md:text-sm lg:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                  Pilih solusi digital yang tepat untuk mengembangkan bisnis Anda dengan <span className="font-bold text-blue-600">teknologi modern</span> dan <span className="font-bold text-orange-600">tim profesional</span>.
                </p>
              </div>

              {/* Modern Stats Cards */}
              <div className="scroll-fade-in">
                <div ref={heroStatsRef} className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 max-w-4xl mx-auto">
                  {[
                    { number: 4, suffix: '+', label: 'Layanan Unggulan', icon: <HiCheckCircle className="w-6 h-6" />, color: 'from-blue-600 to-cyan-500' },
                    { number: 15, suffix: '+', label: 'Pilihan Paket', icon: <FaRocket className="w-5 h-5" />, color: 'from-orange-500 to-amber-500' },
                    { number: 50, suffix: '+', label: 'Klien Puas', icon: <HiSparkles className="w-6 h-6" />, color: 'from-purple-600 to-pink-500' },
                    { number: 24, suffix: '/7', label: 'Dukungan', icon: <FaWhatsapp className="w-5 h-5" />, color: 'from-green-600 to-emerald-500' }
                  ].map((stat, index) => {
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
                          className={`text-xl md:text-2xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                        >
                          {formattedValue()}
                        </div>
                      );
                    };

                    return (
                      <div key={index} className="scale-on-scroll group relative stat-card">
                        <div className="relative backdrop-blur-xl bg-white/70 border border-white/30 rounded-2xl p-3 md:p-4 hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden">
                          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                          <div className={`absolute -inset-1 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                          
                          <div className="relative text-center space-y-1 md:space-y-2">
                            <div className={`inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 animate-pulse`}>
                              {stat.icon}
                            </div>
                            <StatCounter />
                            <div className="text-xs md:text-sm font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">
                              {stat.label}
                            </div>
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
              </div>
              
              {/* Modern CTAs - Below Stats */}
              <div ref={heroCTARef} className="flex flex-wrap gap-3 justify-center items-center mt-4">
                <button 
                  onClick={() => {
                    const packagesSection = document.getElementById('packages');
                    if (packagesSection) {
                      window.scrollTo({
                        top: packagesSection.offsetTop - 80,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className="cta-button group relative backdrop-blur-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-sm px-5 py-2.5 rounded-2xl font-bold transition-all duration-300 hover:scale-110 hover:shadow-2xl inline-flex items-center gap-2 overflow-hidden hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <FaRocket className="w-5 h-5 relative transform group-hover:rotate-12 group-hover:scale-125 transition-all duration-300" />
                  <span className="relative">Lihat Paket</span>
                  <FaArrowRight className="w-5 h-5 relative transform group-hover:translate-x-2 transition-transform duration-300" />
                  <span className="absolute inset-0 rounded-2xl">
                    <span className="animate-ping absolute inset-0 rounded-2xl bg-blue-400 opacity-0 group-hover:opacity-20"></span>
                  </span>
                </button>
                
                <a 
                  href="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20tentang%20paket%20digital" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-button group relative backdrop-blur-xl bg-white/80 hover:bg-white border-2 border-slate-200 hover:border-orange-400 text-slate-700 hover:text-orange-600 text-sm px-5 py-2.5 rounded-2xl font-bold transition-all duration-300 hover:scale-110 hover:shadow-2xl inline-flex items-center gap-2 overflow-hidden hover:-translate-y-1"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-orange-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <FaWhatsapp className="w-6 h-6 text-green-500 relative group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 animate-pulse" />
                  <span className="relative">Konsultasi Gratis</span>
                  <HiSparkles className="w-5 h-5 relative opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-180" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Mengapa Memilih
                </span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-2">
                  NexCube Digital?
                </span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Kami menggabungkan teknologi modern dengan desain kreatif untuk hasil yang maksimal
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="group bg-white/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-white hover:shadow-xl transition-all duration-300 border border-slate-200/50"
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white p-4 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section ref={techStackRef} className="py-20 bg-white/30 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Teknologi Terkini
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Kami menggunakan stack teknologi modern untuk hasil terbaik
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8">
              {paketCategories.map((cat, i) => (
                <div key={i} className="text-center">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white p-5 mx-auto mb-3 animate-float`}>
                    {cat.icon}
                  </div>
                  <div className="font-semibold text-slate-800">{cat.title}</div>
                  <div className="flex justify-center gap-2 mt-2">
                    {cat.techStack.map((Tech: React.ElementType, j: number) => (
                      <Tech key={j} className={`w-4 h-4 text-${cat.color}-500`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section ref={pricingRef} className="py-20" id="packages">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Pilih Paket
                </span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-2">
                  Sesuai Kebutuhan
                </span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Fleksibel dan dapat disesuaikan dengan budget serta kebutuhan bisnis Anda
              </p>
            </div>

            {/* Category Tabs */}
            {renderCategoryTabs()}

            {/* View Toggle */}
            {renderViewToggle()}

            {/* Pricing Cards */}
            {renderPricingCards()}
          </div>
        </section>

        {/* Comparison Table */}
        <section ref={comparisonRef} className="py-20 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Perbandingan Paket
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Lihat perbedaan fitur antar paket untuk memilih yang paling sesuai
              </p>
            </div>

            <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <th className="px-6 py-4 text-left">Fitur</th>
                    <th className="px-6 py-4 text-center">Basic</th>
                    <th className="px-6 py-4 text-center">Pro</th>
                    <th className="px-6 py-4 text-center">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, i) => (
                    <tr key={i} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{row.feature}</td>
                      <td className="px-6 py-4 text-center text-slate-600">{row.basic}</td>
                      <td className="px-6 py-4 text-center text-slate-600">{row.pro}</td>
                      <td className="px-6 py-4 text-center text-slate-600">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-white text-center">
              {/* Animated Background */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
              </div>

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-black mb-4">
                  Siap Memulai Transformasi Digital?
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Konsultasikan kebutuhan digital Anda dengan tim kami. Gratis!
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link
                    to="/contact"
                    className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  >
                    Hubungi Kami
                  </Link>
                  <a
                    href="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20tentang%20kebutuhan%20digital%20saya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white hover:text-blue-600 hover:-translate-y-1 transition-all duration-300"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </>
  );
};

export default PaketDigital;