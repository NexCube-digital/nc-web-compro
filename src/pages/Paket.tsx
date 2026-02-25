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
import { HiSparkles, HiCheckCircle } from 'react-icons/hi';
import { FaRocket, FaArrowRight, FaWhatsapp } from 'react-icons/fa';
import gsap from 'gsap';

import { useCart } from '../context/CartContext';
import { openCartDrawer } from '../components/cart/CartDrawer';

export const Paket: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [packages, setPackages] = useState<any[]>([])
  const [paketCategories, setPaketCategories] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'website' | 'undangan' | 'desain' | 'katalog'>('website');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showHero, setShowHero] = useState(false);
  const location = useLocation()
  const navigate = useNavigate();
  const fadeInRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroBadgeRef = useRef<HTMLDivElement>(null);
  const heroDescRef = useRef<HTMLParagraphElement>(null);
  const heroStatsRef = useRef<HTMLDivElement>(null);
  const heroCTARef = useRef<HTMLDivElement>(null);
  const heroLogoRef = useRef<HTMLDivElement>(null);

  const { addItem } = useCart();

  // Apply GSAP animations
  useScrollFadeIn('.scroll-fade-in');
  useScrollScale('.scale-on-scroll');
  useParallax('.parallax-element', 0.3);
  useSmoothScroll();

  // Base category definitions with UI elements
  const basePaketCategories = [
    {
      id: 'website',
      title: 'Website Premium',
      description: 'Solusi website profesional untuk bisnis Anda',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-purple-600',
      tierIds: ['student', 'bronze', 'silver', 'gold', 'platinum'],
      routePath: '/paket/website'
    },
    {
      id: 'undangan',
      title: 'Undangan Digital',
      description: 'Undangan interaktif untuk acara spesial Anda',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
      gradient: 'from-emerald-500 to-teal-600',
      tierIds: ['bronze', 'silver', 'gold'],
      routePath: '/paket/undangan-digital'
    },
    {
      id: 'desain',
      title: 'Desain Grafis',
      description: 'Desain visual yang menarik dan profesional',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      gradient: 'from-rose-500 to-pink-600',
      tierIds: ['bronze', 'silver', 'gold', 'platinum'],
      routePath: '/paket/desain-grafis'
    },
    {
      id: 'katalog',
      title: 'Katalog Digital',
      description: 'Menu digital dan katalog produk interaktif',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      gradient: 'from-orange-500 to-amber-600',
      tierIds: ['silver', 'gold', 'platinum'],
      routePath: '/paket/menu-katalog'
    }
  ];
  
  // Fetch all packages and build categories from backend data
  useEffect(() => {
    const fetchPackagesAndCategories = async () => {
      try {
        const res = await apiClient.getPackages()
        if (res && res.data) {
          // Normalize backend package types to public category ids
          const normalized = res.data.map((pkg: any) => ({
            ...pkg,
            _normalizedType: normalizeTypeForCategory(pkg.type)
          }))
          setPackages(normalized)
          
          // Group packages by type to get actual package counts
          const packagesByType: Record<string, any[]> = {}
          normalized.forEach((pkg: any) => {
            const t = pkg._normalizedType || pkg.type
            if (!packagesByType[t]) {
              packagesByType[t] = []
            }
            packagesByType[t].push(pkg)
          })
          
          // Build categories with actual data from backend
          const categories = basePaketCategories.map(baseCat => {
            const packagesForType = packagesByType[baseCat.id] || []
            return {
              ...baseCat,
              packageCount: packagesForType.length,
              hasPackages: packagesForType.length > 0,
              tierIds: packagesForType.map((p: any) => p.id)
            }
          }).filter(cat => cat.hasPackages) // Only show categories that have packages
          
          setPaketCategories(categories)
        }
      } catch (e) {
        console.error('Failed to load packages', e)
        // Fallback to base categories if fetch fails
        setPaketCategories(basePaketCategories)
      }
    }

    fetchPackagesAndCategories()
  }, [])

  // Map backend package type values to public category ids
  const normalizeTypeForCategory = (backendType: string) => {
    if (!backendType) return backendType
    const t = String(backendType).toLowerCase()
    if (t === 'event' || t === 'undangan' || t === 'undangan-digital') return 'undangan'
    if (t === 'website' || t === 'web') return 'website'
    if (t === 'desain' || t === 'desain-grafis') return 'desain'
    if (t === 'katalog' || t === 'menu-katalog') return 'katalog'
    return t
  }

  // Map public category id to API type param when requesting backend
  const categoryIdToApiType = (categoryId: string) => {
    switch (categoryId) {
      case 'undangan': return 'event'
      case 'website': return 'website'
      case 'desain': return 'desain'
      case 'katalog': return 'katalog'
      default: return categoryId
    }
  }
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    const heroTimer = setTimeout(() => {
      setShowHero(true);
      
      // GSAP animations for hero elements
      // Animate badge
      if (heroBadgeRef.current) {
        gsap.fromTo(heroBadgeRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.8)', delay: 0.1 }
        );
      }
      
      // Animate title words
      if (heroTitleRef.current) {
        const titleSpans = heroTitleRef.current.querySelectorAll('.hero-title-word');
        gsap.fromTo(titleSpans,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.15, delay: 0.3 }
        );
      }
      
      // Animate description
      if (heroDescRef.current) {
        gsap.fromTo(heroDescRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'power2.out', delay: 0.6 }
        );
      }
      
      // Animate stats cards
      if (heroStatsRef.current) {
        const statsCards = heroStatsRef.current.querySelectorAll('.stat-card');
        gsap.fromTo(statsCards,
          { scale: 0.8, opacity: 0, y: 40 },
          { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.4)', stagger: 0.1, delay: 0.8 }
        );
      }
      
      // Animate CTA buttons
      if (heroCTARef.current) {
        const ctaButtons = heroCTARef.current.querySelectorAll('.cta-button');
        gsap.fromTo(ctaButtons,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.15, delay: 1.2 }
        );
      }
      
      // Animate 3D logo rotation
      if (heroLogoRef.current) {
        gsap.to(heroLogoRef.current, {
          rotation: 360,
          duration: 20,
          ease: 'none',
          repeat: -1
        });
      }
    }, 300);

    // Scroll listener for sidebar visibility
    const handleScroll = () => {
      const packagesSection = document.getElementById('packages');
      if (packagesSection) {
        const rect = packagesSection.getBoundingClientRect();
        // Show sidebar when packages section is near viewport top
        setShowSidebar(rect.top <= 100);
      }
    };

    // Intersection Observer for section detection
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Only process if categories are loaded
      if (paketCategories.length > 0 && location.pathname === '/paket') {
        // Find the most visible section
        let bestEntry: IntersectionObserverEntry | undefined;
        let bestRatio = 0;
        
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-category');
            if (sectionId && paketCategories.some(cat => cat.id === sectionId)) {
              if (entry.intersectionRatio > bestRatio) {
                bestEntry = entry;
                bestRatio = entry.intersectionRatio;
              }
            }
          }
        }

        // Update activeTab if we found a visible category section
        if (bestEntry) {
          const sectionId = bestEntry.target.getAttribute('data-category');
          if (sectionId) {
            setActiveTab(sectionId as any);
          }
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all category sections
    const sections = document.querySelectorAll('[data-category]');
    sections.forEach(section => observer.observe(section));

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    const determineAndFetch = async () => {
      // If we don't have categories yet, wait for them
      if (paketCategories.length === 0) return

      // determine active category from URL path
      const pathAfter = location.pathname.split('/paket/')[1] || ''
      if (!pathAfter || pathAfter === '') {
        setActiveTab('all')
        return
      }

      // match to known category routePaths
      const matched = paketCategories.find(cat => location.pathname.startsWith(cat.routePath))
      const type = matched ? matched.id : pathAfter.split('/')[0]
      setActiveTab((matched && matched.id) as any || 'all')
      try {
        const apiType = categoryIdToApiType(type)
        const res = await apiClient.getPackages(apiType)
        if (res && res.data) {
          const normalized = res.data.map((pkg: any) => ({
            ...pkg,
            _normalizedType: normalizeTypeForCategory(pkg.type)
          }))
          setPackages(normalized)
        }
      } catch (e) {
        console.error('Failed to load packages', e)
      }
    }

    determineAndFetch()

    return () => {
      clearTimeout(timer);
      clearTimeout(heroTimer);
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    }
  }, [location.pathname, paketCategories])

  // Render pricing cards per category
  const renderPricingSection = (category: typeof paketCategories[0]) => {
    // use backend packages when available; otherwise fallback to pricingData
    
    const categoryPricing = packages.length > 0
      ? packages.filter(p => (p._normalizedType || normalizeTypeForCategory(p.type)) === category.id)
      : pricingData.filter(item => category.tierIds.includes(item.id));
    
    return (
      <div key={category.id} data-category={category.id} className="mb-24 scroll-mt-32 scroll-fade-in relative z-20">
        {/* Category Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex flex-col items-center">
            <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${category.gradient} text-white px-8 py-4 rounded-3xl mb-5 shadow-2xl scale-on-scroll transition-transform duration-300 relative z-20`}>
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                {category.icon}
              </div>
              <span className="font-black text-xl">{category.title}</span>
            </div>
            <p className="text-slate-600 text-lg mt-2 max-w-2xl mx-auto font-medium">{category.description}</p>
          </div>
        </div>

        {/* Pricing Cards Grid - Per Category */}
        <div className="max-w-7xl mx-auto">
          {/* First Row: Student, Bronze, Silver */}
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
            {categoryPricing.filter((tier, index) => index < 3).map((tier, index) => {
              const isBackendPkg = !!tier.id && !!tier.title
              const title = tier.title || tier.id || `Package ${index + 1}`
              const price = tier.price || ''
              const features = tier.features || []
              const includes = tier.includes || []
              const hot = tier.hot || false
              const detailUrl = isBackendPkg ? `/paket/${category.id}/${tier.id}` : undefined

              return (
                <div 
                  key={isBackendPkg ? `pkg-${tier.id}` : `tier-${index}`} 
                  className="scroll-fade-in scale-on-scroll"
                >
                  <div className="block h-full">
                    {isBackendPkg && category.id === 'undangan' ? (
                      // Render event package as clickable cover image
                      <a href={tier.link || tier.url || '#'} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition">
                        <div className="h-56 w-full bg-gray-100 overflow-hidden">
                          <img src={(tier.images && tier.images[0]) || tier.image || '/images/placeholder.png'} alt={title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4 bg-white">
                          <div className="font-bold text-lg">{title}</div>
                          <div className="text-sm text-slate-600">{price}</div>
                        </div>
                      </a>
                    ) : (
                      <PricingCard 
                        tier={title}
                        price={price}
                        features={features}
                        includes={includes}
                        accent={tier.accent}
                        badge={tier.badge}
                        popular={hot || tier.popular}
                        detailUrl={detailUrl}

                        onOrder={() => {
                        addItem({
                          id: tier.id || `${category.id}-${index}`,
                          name: title,
                          price: typeof tier.rawPrice === 'number' 
                            ? tier.rawPrice 
                            : parseInt(String(tier.price || '0').replace(/\D/g, '')) || 0,
                          quantity: 1,
                          description: `${category.title} - ${tier.badge || ''}`,
                        });
                        openCartDrawer();
                      }}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Second Row: Gold, Platinum (Centered) */}
          {categoryPricing.length > 3 && (
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto">
              {categoryPricing.filter((tier, index) => index >= 3).map((tier, index) => {
                const isBackendPkg = !!tier.id && !!tier.title
                const title = tier.title || tier.id || `Package ${index + 3 + 1}`
                const price = tier.price || ''
                const features = tier.features || []
                const includes = tier.includes || []
                const hot = tier.hot || false
                const detailUrl = isBackendPkg ? `/paket/${category.id}/${tier.id}` : undefined

                return (
                  <div 
                    key={isBackendPkg ? `pkg-${tier.id}` : `tier-${index + 3}`} 
                    className="scroll-fade-in scale-on-scroll"
                  >
                    <div className="block h-full">
                      {isBackendPkg && category.id === 'undangan' ? (
                        <a href={tier.link || tier.url || '#'} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition">
                          <div className="h-56 w-full bg-gray-100 overflow-hidden">
                            <img src={(tier.images && tier.images[0]) || tier.image || '/images/placeholder.png'} alt={title} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-4 bg-white">
                            <div className="font-bold text-lg">{title}</div>
                            <div className="
                            text-sm text-slate-600">{price}</div>
                          </div>
                        </a>
                      ) : (
                        <PricingCard 
                          tier={title}
                          price={price}
                          features={features}
                          includes={includes}
                          accent={tier.accent}
                          badge={tier.badge}
                          popular={hot || tier.popular}
                          detailUrl={detailUrl}
                          onOrder={() => {
                          addItem({
                            id: tier.id || `${category.id}-${index + 3}`,
                            name: title,
                            price: typeof tier.rawPrice === 'number'
                              ? tier.rawPrice
                              : parseInt(String(tier.price || '0').replace(/\D/g, '')) || 0,
                            quantity: 1,
                            description: `${category.title} - ${tier.badge || ''}`,
                          });
                          openCartDrawer();
                        }}
                        />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Separator - Always show between categories */}
        <div className="mt-24 mb-8">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
        </div>
      </div>
    );
  };

  // Handle category button click
  const handleCategoryClick = (categoryId: string) => {
    // Scroll to specific category section
    const targetSection = document.querySelector(`[data-category="${categoryId}"]`);
    if (targetSection) {
      setActiveTab(categoryId as any);
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // If section not found (different route), navigate
      const category = paketCategories.find(cat => cat.id === categoryId);
      if (category) {
        navigate(category.routePath);
      }
    }
  };

  return (
    <>
      <Navbar />
      
      {/* Background Elements with NEXCUBE Branding - Same as Home */}
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
          <title>Paket Layanan - NexCube Digital</title>
          <meta name="description" content="Pilihan paket layanan NexCube Digital mulai dari website, undangan digital, desain grafis, hingga katalog digital" />
        </Helmet>

        {/* Hero Section - Full Viewport Template from Home */}
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
          
          <div className="container relative">
            <div className="max-w-5xl mx-auto text-center space-y-3">
              
              {/* Modern Trust Badge */}
              <div ref={heroBadgeRef} className="inline-flex items-center justify-center gap-3 backdrop-blur-xl bg-white/70 border border-white/30 shadow-lg px-5 py-2 rounded-2xl">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full blur-md opacity-75 animate-pulse"></div>
                  <HiSparkles className="w-5 h-5 text-orange-500 relative" />
                </div>
                <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">Paket Premium 2025</span>
              </div>

              <div className="space-y-2">
                <h1 ref={heroTitleRef} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight">
                  <span className="inline-block hero-title-word">
                    <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">Paket Layanan</span>
                  </span>
                  <br />
                  <span className="inline-block hero-title-word">
                    <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">Terlengkap</span>
                  </span>
                  <br />
                  <span className="text-slate-800 text-xl md:text-2xl lg:text-3xl font-bold mt-2 inline-block drop-shadow hero-title-word">Untuk Semua Kebutuhan</span>
                </h1>
                
                <p ref={heroDescRef} className="text-xs md:text-sm lg:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                  Pilih paket yang <span className="font-bold text-blue-600">sesuai kebutuhan</span> bisnis Anda. Dari <span className="font-bold text-orange-600">startup hingga enterprise</span>, kami hadirkan solusi yang <span className="font-bold text-slate-800">menghasilkan hasil nyata</span>.
                </p>
              </div>

              {/* Modern Stats Cards */}
              <div className="scroll-fade-in" ref={fadeInRef}>
                <div ref={heroStatsRef} className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 max-w-4xl mx-auto">
                  {[
                    { number: 4, suffix: '+', label: 'Kategori Paket', icon: <HiCheckCircle className="w-6 h-6" />, color: 'from-blue-600 to-cyan-500' },
                    { number: 15, suffix: '+', label: 'Pilihan Paket', icon: <FaRocket className="w-5 h-5" />, color: 'from-orange-500 to-amber-500' },
                    { number: 100, suffix: '%', label: 'Customizable', icon: <HiSparkles className="w-6 h-6" />, color: 'from-purple-600 to-pink-500' },
                    { number: 24, suffix: '/7', label: 'Support', icon: <FaWhatsapp className="w-5 h-5" />, color: 'from-green-600 to-emerald-500' }
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
                
                <Link 
                  to="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20tentang%20paket%20layanan" 
                  className="cta-button group relative backdrop-blur-xl bg-white/80 hover:bg-white border-2 border-slate-200 hover:border-orange-400 text-slate-700 hover:text-orange-600 text-sm px-5 py-2.5 rounded-2xl font-bold transition-all duration-300 hover:scale-110 hover:shadow-2xl inline-flex items-center gap-2 overflow-hidden hover:-translate-y-1"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-orange-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <FaWhatsapp className="w-6 h-6 text-green-500 relative group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 animate-pulse" />
                  <span className="relative">Konsultasi Gratis</span>
                  <HiSparkles className="w-5 h-5 relative opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-180" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full py-16 relative" id="packages">
          {/* Animated Dots Pattern Background */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `radial-gradient(circle, #0066FF 2px, transparent 2px)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          {/* Sidebar - Floating (Show on scroll) */}
          <aside className={`hidden lg:block fixed left-8 top-24 w-80 z-30 transition-all duration-500 ${showSidebar ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
            <div className="sticky top-24">
                <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl overflow-hidden border border-white/50">
                  {/* Header with Logo */}
                  <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-orange-500 to-blue-600 p-6">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30 shadow-lg">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-white font-black text-lg">Kategori Paket</h3>
                        <p className="text-white/90 text-xs">Pilih layanan terbaik</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <nav className="px-4 py-6 space-y-1.5">
                    {/* Category Buttons */}
                    {paketCategories.map((paket) => {
                      const packageCount = paket.packageCount || paket.tierIds.length;
                      
                      return (
                        <button
                          key={paket.id}
                          onClick={() => handleCategoryClick(paket.id)}
                          className={`group relative w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 overflow-hidden ${
                            activeTab === paket.id
                              ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-xl shadow-blue-500/50 scale-105'
                              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50 hover:scale-102 hover:translate-x-1'
                          }`}
                        >
                          {activeTab === paket.id && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-orange-400/20 animate-pulse"></div>
                          )}
                          <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${paket.gradient} transition-all duration-300 ${
                            activeTab === paket.id ? 'shadow-lg ring-2 ring-white/30' : 'opacity-75 group-hover:opacity-100'
                          }`}>
                            {paket.icon}
                          </div>
                          <div className="relative flex-1 text-left">
                            <span className="font-bold text-sm block">{paket.title.replace(' Premium', '').replace(' Digital', '')}</span>
                            <span className={`text-xs ${activeTab === paket.id ? 'text-blue-100' : 'text-slate-500'}`}>
                              {packageCount} paket tersedia
                            </span>
                          </div>
                          {activeTab === paket.id ? (
                            <div className="relative w-2 h-2 rounded-full bg-white shadow-lg animate-pulse"></div>
                          ) : (
                            <div className="relative">
                              <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold group-hover:bg-slate-200 transition-colors">
                                {packageCount}
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </nav>

                  {/* Footer CTA */}
                  <div className="mx-4 mb-4 p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-orange-500/10 border border-blue-500/20 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-800 text-sm font-bold">Butuh Bantuan?</p>
                        <p className="text-slate-600 text-xs">Konsultasi gratis</p>
                      </div>
                    </div>
                    <Link 
                      to="/contact"
                      className="block w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-orange-500 text-white text-sm font-bold text-center hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105"
                    >
                      💬 Hubungi Kami
                    </Link>
                  </div>

                  {/* Footer Copyright */}
                  <div className="px-4 pb-4 text-center">
                    <p className="text-slate-500 text-xs font-medium">
                      © 2025 NexCube Digital
                    </p>
                  </div>
                </div>
              </div>
          </aside>

          {/* Main Content Area - Full Width with Margin */}
          <div className="max-w-[1600px] mx-auto px-4 lg:pl-96 relative z-10">
            <main className="w-full" id="packages-content">
              {/* Display All Pricing Sections - Always show all categories */}
              <div className={`space-y-0 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-300'}`}>
                {paketCategories.map((category) => renderPricingSection(category))}
              </div>

              {/* FAQ Section */}
              <div className={`mt-24 bg-gradient-to-br from-slate-50 to-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-200 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-500'}`}>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Pertanyaan yang Sering Ditanyakan
              </h2>
              <p className="text-slate-600">Temukan jawaban untuk pertanyaan umum tentang paket kami</p>
            </div>
            
            <div className="space-y-4 max-w-3xl mx-auto">
              <details className="group bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                <summary className="flex justify-between items-center font-bold text-slate-800 cursor-pointer list-none p-6">
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-black">?</span>
                    Apa perbedaan utama antar paket?
                  </span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" width="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </summary>
                <p className="text-slate-600 px-6 pb-6 pt-2 leading-relaxed">
                  Setiap paket dirancang untuk kebutuhan berbeda. Student & Bronze untuk pemula, Silver untuk bisnis menengah, Gold untuk bisnis berkembang, dan Platinum untuk solusi enterprise lengkap dengan semua fitur premium.
                </p>
              </details>
              
              <details className="group bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                <summary className="flex justify-between items-center font-bold text-slate-800 cursor-pointer list-none p-6">
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-black">?</span>
                    Bisakah saya upgrade paket di kemudian hari?
                  </span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" width="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </summary>
                <p className="text-slate-600 px-6 pb-6 pt-2 leading-relaxed">
                  Tentu! Anda dapat upgrade paket kapan saja sesuai perkembangan bisnis Anda. Tim kami siap membantu proses upgrade dengan lancar dan memberikan credit untuk sisa periode paket lama Anda.
                </p>
              </details>
              
              <details className="group bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                <summary className="flex justify-between items-center font-bold text-slate-800 cursor-pointer list-none p-6">
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-black">?</span>
                    Apakah ada biaya setup tambahan?
                  </span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" width="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </summary>
                <p className="text-slate-600 px-6 pb-6 pt-2 leading-relaxed">
                  Tidak ada biaya setup tersembunyi! Harga yang kami tampilkan sudah termasuk semua biaya setup, domain, hosting untuk tahun pertama, dan semua fitur yang tertera di paket.
                </p>
              </details>
              
              <details className="group bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                <summary className="flex justify-between items-center font-bold text-slate-800 cursor-pointer list-none p-6">
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-black">?</span>
                    Bagaimana jika kebutuhan saya custom?
                  </span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" width="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </summary>
                <p className="text-slate-600 px-6 pb-6 pt-2 leading-relaxed">
                  Kami menyediakan layanan custom untuk kebutuhan khusus. Hubungi tim kami untuk konsultasi gratis dan dapatkan penawaran yang disesuaikan dengan kebutuhan spesifik bisnis Anda dengan harga yang kompetitif.
                </p>
              </details>
            </div>
              </div>

              {/* CTA Section */}
              <div className={`mt-16 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-700'}`}>
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-3xl p-10 md:p-16 text-white shadow-2xl">
                  {/* Animated Background */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                  </div>

                  <div className="relative z-10 text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold mb-6">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Tim Kami Siap Membantu
                    </div>

                    <h3 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                      Masih Bingung Memilih Paket?
                    </h3>
                    <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                      Hubungi tim kami untuk konsultasi gratis. Kami akan membantu Anda memilih paket yang paling sesuai dengan kebutuhan dan budget Anda.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                      <Link 
                        to="/contact" 
                        className="inline-flex items-center gap-2 bg-white text-blue-700 font-black px-10 py-4 rounded-2xl hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-2xl"
                      >
                        Konsultasi Gratis
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                      
                      <a 
                        href="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20tentang%20kebutuhan%20digital%20saya" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 text-white font-black px-10 py-4 rounded-2xl hover:bg-green-600 transition-all duration-300 hover:scale-105 shadow-2xl"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        Chat WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Paket;
