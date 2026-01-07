import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async';
import { PricingCard } from '../ui/PricingCard'
import apiClient from '../services/api'
import { pricingData } from '../data/pricingData'
import { Navbar } from '../components/layout/Navbar';

export const Paket: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [packages, setPackages] = useState<any[]>([])
  const [paketCategories, setPaketCategories] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'website' | 'undangan' | 'desain' | 'katalog'>('website');
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation()
  const navigate = useNavigate();

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
          setPackages(res.data)
          
          // Group packages by type to get actual package counts
          const packagesByType: Record<string, any[]> = {}
          res.data.forEach((pkg: any) => {
            if (!packagesByType[pkg.type]) {
              packagesByType[pkg.type] = []
            }
            packagesByType[pkg.type].push(pkg)
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
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);

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
        const res = await apiClient.getPackages(type)
        if (res && res.data) setPackages(res.data)
      } catch (e) {
        console.error('Failed to load packages', e)
      }
    }

    determineAndFetch()

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    }
  }, [location.pathname, paketCategories])

  // Render pricing cards per category
  const renderPricingSection = (category: typeof paketCategories[0]) => {
    // use backend packages when available; otherwise fallback to pricingData
    const categoryPricing = packages.length > 0
      ? packages.filter(p => p.type === category.id)
      : pricingData.filter(item => category.tierIds.includes(item.id));
    
    return (
      <div key={category.id} data-category={category.id} className={`mb-24 scroll-mt-32 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}>
        {/* Category Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex flex-col items-center">
            <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${category.gradient} text-white px-8 py-4 rounded-3xl mb-5 shadow-2xl hover:scale-105 transition-transform duration-300`}>
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
                  style={{ animationDelay: `${400 + (index * 100)}ms` }} 
                  className={!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}
                >
                  <div className="block h-full">
                    <PricingCard 
                      tier={title}
                      price={price}
                      features={features}
                      includes={includes}
                      accent={tier.accent}
                      badge={tier.badge}
                      popular={hot || tier.popular}
                      detailUrl={detailUrl}
                    />
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
                    style={{ animationDelay: `${400 + ((index + 3) * 100)}ms` }} 
                    className={!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}
                  >
                    <div className="block h-full">
                      <PricingCard 
                        tier={title}
                        price={price}
                        features={features}
                        includes={includes}
                        accent={tier.accent}
                        badge={tier.badge}
                        popular={hot || tier.popular}
                        detailUrl={detailUrl}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Separator */}
        {activeTab === 'all' && (
          <div className="mt-20">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
          </div>
        )}
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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <Helmet>
          <title>Paket Layanan - NexCube Digital</title>
          <meta name="description" content="Pilihan paket layanan NexCube Digital mulai dari website, undangan digital, desain grafis, hingga katalog digital" />
        </Helmet>

        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 min-h-screen flex items-center">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="container relative z-10 py-20">
            <div className={`text-center max-w-4xl mx-auto ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Solusi Digital Terlengkap
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                Paket Layanan<br />
                <span className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent">
                  Premium & Profesional
                </span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                Pilih paket yang sesuai dengan kebutuhan bisnis Anda. Dari startup hingga enterprise, kami punya solusinya.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => {
                    const packagesSection = document.getElementById('packages');
                    if (packagesSection) {
                      packagesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-blue-700 font-bold hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-white/20"
                >
                  Lihat Paket
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold hover:bg-white/20 transition-all duration-300"
                >
                  Konsultasi Gratis
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Wave Shape Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="w-full h-20 text-slate-50" preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z" fill="currentColor" opacity=".25"></path>
              <path d="M0 0v15.81c13 21.11 27.64 41.05 47.69 56.24C99.41 111.27 165 111 224.58 91.58c31.15-10.15 60.09-26.07 89.67-39.8 40.92-19 84.73-46 130.83-49.67 36.26-2.85 70.9 9.42 98.6 31.56 31.77 25.39 62.32 62 103.63 73 40.44 10.79 81.35-6.69 119.13-24.28s75.16-39 116.92-43.05c59.73-5.85 113.28 22.88 168.9 38.84 30.2 8.66 59 6.17 87.09-7.5 22.43-10.89 48-26.93 60.65-49.24V0z" fill="currentColor" opacity=".5"></path>
              <path d="M0 0v5.63C149.93 59 314.09 71.32 475.83 42.57c43-7.64 84.23-20.12 127.61-26.46 59-8.63 112.48 12.24 165.56 35.4C827.93 77.22 886 95.24 951.2 90c86.53-7 172.46-45.71 248.8-84.81V0z" fill="currentColor"></path>
            </svg>
          </div>
        </div>

        <div className="w-full py-16" id="packages">
          {/* Sidebar - Floating (Show on scroll) */}
          <aside className={`hidden lg:block fixed left-8 top-24 w-80 z-40 transition-all duration-500 ${showSidebar ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
            <div className="sticky top-24">
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-white/10 backdrop-blur-sm">
                  {/* Header with Logo */}
                  <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 p-6">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30 shadow-lg">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-white font-black text-lg">Kategori Paket</h3>
                        <p className="text-blue-100 text-xs">Pilih layanan terbaik</p>
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
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/50 scale-105'
                              : 'text-slate-400 hover:text-white hover:bg-white/5 hover:scale-102 hover:translate-x-1'
                          }`}
                        >
                          {activeTab === paket.id && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
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
                              <span className="px-2 py-1 rounded-lg bg-slate-700/50 text-slate-300 text-xs font-bold group-hover:bg-slate-600/50 transition-colors">
                                {packageCount}
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </nav>

                  {/* Footer CTA */}
                  <div className="mx-4 mb-4 p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-bold">Butuh Bantuan?</p>
                        <p className="text-slate-400 text-xs">Konsultasi gratis</p>
                      </div>
                    </div>
                    <Link 
                      to="/contact"
                      className="block w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold text-center hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                    >
                      💬 Hubungi Kami
                    </Link>
                  </div>

                  {/* Footer Copyright */}
                  <div className="px-4 pb-4 text-center">
                    <p className="text-white/40 text-xs font-medium">
                      © 2025 NexCube Digital
                    </p>
                  </div>
                </div>
              </div>
          </aside>

          {/* Main Content Area - Full Width with Margin */}
          <div className="max-w-[1600px] mx-auto px-4 lg:pl-96">
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
