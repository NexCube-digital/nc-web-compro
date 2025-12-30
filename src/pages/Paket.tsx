import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async';
import { PricingCard } from '../ui/PricingCard'
import apiClient from '../services/api'
import { pricingData } from '../data/pricingData'
import { Layout } from '../components/layout/Layout';

export const Paket: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [packages, setPackages] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'website' | 'undangan' | 'desain' | 'katalog'>('all');
  const location = useLocation()
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);

    const determineAndFetch = async () => {
      // determine active category from URL path
      const pathAfter = location.pathname.split('/paket/')[1] || ''
      if (!pathAfter || pathAfter === '') {
        setActiveTab('all')
        try {
          const res = await apiClient.getPackages()
          if (res && res.data) setPackages(res.data)
        } catch (e) {
          console.error('Failed to load packages', e)
        }
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
        // fallback to loading all
        try {
          const resAll = await apiClient.getPackages()
          if (resAll && resAll.data) setPackages(resAll.data)
        } catch (_err) {}
      }
    }

    determineAndFetch()

    return () => clearTimeout(timer)
  }, [location.pathname])

  const paketCategories = [
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

  // Render pricing cards per category
  const renderPricingSection = (category: typeof paketCategories[0]) => {
    // use backend packages when available; otherwise fallback to pricingData
    const categoryPricing = packages.length > 0
      ? packages.filter(p => p.type === category.id)
      : pricingData.filter(item => category.tierIds.includes(item.id));
    
    return (
      <div key={category.id} className={`mb-20 scroll-mt-32 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}>
        {/* Category Header */}
        <div className="mb-10 text-center">
          <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${category.gradient} text-white px-6 py-3 rounded-full mb-4 shadow-lg`}>
            {category.icon}
            <span className="font-bold text-lg">{category.title}</span>
          </div>
          <p className="text-slate-600 text-lg mt-4 max-w-2xl mx-auto">{category.description}</p>
        </div>

        {/* Pricing Cards Grid - Per Category */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categoryPricing.map((tier, index) => {
            const isBackendPkg = !!tier.id && !!tier.title
            const title = tier.title || tier.id || `Package ${index + 1}`
            const price = tier.price || ''
            const features = tier.features || []
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
                    accent={tier.accent}
                    badge={tier.badge}
                    popular={tier.popular}
                    detailUrl={detailUrl}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* View More Button */}
        <div className="text-center mt-10">
          <Link 
            to={category.routePath}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r ${category.gradient} hover:shadow-lg transition-all duration-300 hover:scale-105`}
          >
            Lihat Detail {category.title}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Separator */}
        <div className="mt-16 mb-12">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        </div>
      </div>
    );
  };

  // Handle category button click
  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'all') {
      setActiveTab('all');
    } else {
      // Navigate to specific paket page
      const category = paketCategories.find(cat => cat.id === categoryId);
      if (category) {
        navigate(category.routePath);
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-8 sm:py-16 bg-gradient-to-b from-slate-50/50 to-white">
        <Helmet>
          <title>Paket Layanan - NexCube Digital</title>
          <meta name="description" content="Pilihan paket layanan NexCube Digital mulai dari website, undangan digital, desain grafis, hingga katalog digital" />
        </Helmet>

        <div className="container">
          {/* Category Filter - STICKY AT TOP */}
          <div className={`sticky top-20 z-40 mb-12 bg-gradient-to-b from-white via-white to-white/95 backdrop-blur-sm py-4 px-4 rounded-2xl shadow-lg border border-white/50 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-100'}`}>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              <button
                onClick={() => handleCategoryClick('all')}
                className={`px-4 sm:px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-300'
                }`}
              >
                Semua Kategori
              </button>
              
              {paketCategories.map((paket) => (
                <button
                  key={paket.id}
                  onClick={() => handleCategoryClick(paket.id)}
                  className={`px-4 sm:px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                    activeTab === paket.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {paket.icon}
                  <span className="hidden sm:inline">{paket.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Header Section */}
          <div className={`text-center max-w-3xl mx-auto mb-16 sm:mb-20 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-200'}`}>
            <h1 className="text-2xl sm:text-3xl font-heading font-semibold mb-4">Paket Layanan Kami</h1>
            <p className="text-slate-500 text-base sm:text-lg">
              Pilih layanan yang Anda butuhkan dan temukan paket yang paling sesuai dengan kebutuhan bisnis Anda.
            </p>
          </div>

          {/* Display All Pricing Sections */}
          {activeTab === 'all' ? (
            <div className={`space-y-0 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-300'}`}>
              {paketCategories.map((category) => renderPricingSection(category))}
            </div>
          ) : (
            <div className={!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-300'}>
              {renderPricingSection(paketCategories.find(p => p.id === activeTab)!)}
            </div>
          )}

          {/* FAQ Section */}
          <div className={`mt-20 bg-white p-6 md:p-10 rounded-xl shadow-card ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-500'}`}>
            <h2 className="text-xl font-heading font-semibold mb-6">Pertanyaan Umum tentang Paket Kami</h2>
            
            <div className="space-y-4">
              <details className="group border-b pb-4">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span>Apa perbedaan utama antar paket?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" width="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </summary>
                <p className="text-slate-500 mt-4">
                  Setiap paket dirancang untuk kebutuhan berbeda. Student & Bronze untuk pemula, Silver untuk bisnis menengah, Gold untuk bisnis berkembang, dan Platinum untuk solusi enterprise lengkap.
                </p>
              </details>
              
              <details className="group border-b pb-4">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span>Bisakah saya upgrade paket di kemudian hari?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" width="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </summary>
                <p className="text-slate-500 mt-4">
                  Tentu! Anda dapat upgrade paket kapan saja sesuai perkembangan bisnis Anda. Tim kami siap membantu proses upgrade dengan lancar.
                </p>
              </details>
              
              <details className="group border-b pb-4">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span>Apakah ada biaya setup tambahan?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" width="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </summary>
                <p className="text-slate-500 mt-4">
                  Tidak ada biaya setup tersembunyi. Harga yang kami tampilkan sudah termasuk semua biaya setup, domain, dan hosting untuk tahun pertama.
                </p>
              </details>
              
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span>Bagaimana jika kebutuhan saya custom?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" width="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </summary>
                <p className="text-slate-500 mt-4">
                  Kami menyediakan layanan custom untuk kebutuhan khusus. Hubungi tim kami untuk konsultasi gratis dan dapatkan penawaran yang disesuaikan dengan kebutuhan spesifik bisnis Anda.
                </p>
              </details>
            </div>
          </div>

          {/* CTA Section */}
          <div className={`mt-12 text-center ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-700'}`}>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Masih Bingung Memilih Paket?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Hubungi tim kami untuk konsultasi gratis. Kami akan membantu Anda memilih paket yang paling sesuai dengan kebutuhan dan budget Anda.
              </p>
              <Link 
                to="/contact" 
                className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-all duration-300 hover:scale-105"
              >
                Konsultasi Gratis
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Paket;
