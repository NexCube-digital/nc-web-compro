import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async';
import { PricingCard } from '../ui/PricingCard'
import { pricingData } from '../data/pricingData'
import { Layout } from '../components/layout/Layout';

export const Website: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleGoBack = () => {
    navigate(-1);
  };

  const paketCategories = [
    {
      id: 'website',
      title: 'Website Premium',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      routePath: '/paket/website'
    },
    {
      id: 'undangan',
      title: 'Undangan Digital',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
      routePath: '/paket/undangan-digital'
    },
    {
      id: 'desain',
      title: 'Desain Grafis',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      routePath: '/paket/desain-grafis'
    },
    {
      id: 'katalog',
      title: 'Katalog Digital',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      routePath: '/paket/menu-katalog'
    }
  ];

  const handleCategoryClick = (routePath: string) => {
    navigate(routePath);
  };

  const websitePricing = pricingData.filter(item => 
    ['student', 'bronze', 'silver', 'gold', 'platinum'].includes(item.id)
  );

  return (
    <Layout>
      <div className="min-h-screen py-8 sm:py-16 bg-gradient-to-b from-slate-50/50 to-white">
        <Helmet>
          <title>Paket Website - NexCube Digital</title>
          <meta name="description" content="Pilihan paket website NexCube Digital mulai dari paket mahasiswa hingga platinum untuk kebutuhan bisnis Anda" />
        </Helmet>

        <div className="container">
          {/* Category Filter - STICKY AT TOP */}
          <div className={`sticky top-20 z-40 mb-12 bg-gradient-to-b from-white via-white to-white/95 backdrop-blur-sm py-4 px-4 rounded-2xl shadow-lg border border-white/50 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-100'}`}>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              <Link
                to="/paket"
                className="px-4 sm:px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-300"
              >
                Semua Kategori
              </Link>
              
              {paketCategories.map((paket) => (
                <button
                  key={paket.id}
                  onClick={() => handleCategoryClick(paket.routePath)}
                  className={`px-4 sm:px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                    paket.id === 'website'
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

          <div className={`text-center max-w-3xl mx-auto mb-8 sm:mb-10 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}>
            <h1 className="text-2xl sm:text-3xl font-heading font-semibold">Paket Website</h1>
            <p className="text-slate-500 mt-3 sm:mt-4 text-base sm:text-lg">
              Pilih paket sesuai kebutuhan — dari paket mahasiswa hingga solusi lengkap berskala enterprise.
            </p>
          </div>

          <div className={`grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 mb-8 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-200'}`}>
            {websitePricing.map((tier, index) => (
              <div 
                key={tier.id}
                style={{ animationDelay: `${400 + (index * 100)}ms` }}
                className={!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}
              >
                <Link to={`/paket/${tier.id}`} className="block h-full">
                  <PricingCard 
                    tier={tier.title}
                    price={tier.price}
                    features={tier.features}
                    accent={tier.accent}
                    badge={tier.badge}
                    popular={tier.popular}
                  />
                </Link>
              </div>
            ))}
          </div>

          <div className={`mt-12 bg-white p-6 md:p-10 rounded-xl shadow-card ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-500'}`}>
            <h2 className="text-xl font-heading font-semibold mb-6">Pertanyaan Umum tentang Paket Website</h2>
            
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
                  Perbedaan utama antar paket mencakup jumlah halaman/konten, fitur tambahan seperti akses admin, domain premium, email bisnis, serta kompleksitas desain dan integrasi yang ditawarkan. Semakin tinggi tier paket, semakin banyak fitur dan fleksibilitas yang Anda dapatkan.
                </p>
              </details>
              
              <details className="group border-b pb-4">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span>Apakah ada biaya tersembunyi?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" width="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </summary>
                <p className="text-slate-500 mt-4">
                  Tidak ada biaya tersembunyi. Harga yang tercantum sudah termasuk domain dan hosting untuk tahun pertama. Perpanjangan tahunan akan diinformasikan menjelang masa berakhir layanan.
                </p>
              </details>
              
              <details className="group border-b pb-4">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span>Bagaimana cara memulai?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" width="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </summary>
                <p className="text-slate-500 mt-4">
                  Pilih paket yang sesuai dengan kebutuhan Anda, lalu klik "Detail Paket" untuk melihat informasi lengkap. Setelah itu, Anda dapat menghubungi kami melalui tombol "Pesan Paket Ini" atau melalui halaman kontak untuk memulai diskusi lebih lanjut.
                </p>
              </details>
              
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span>Bagaimana jika kebutuhan saya khusus?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" width="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </summary>
                <p className="text-slate-500 mt-4">
                  Kami juga menyediakan layanan custom yang dapat disesuaikan dengan kebutuhan spesifik bisnis Anda. Silakan hubungi tim kami untuk konsultasi dan penawaran khusus.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Website;
