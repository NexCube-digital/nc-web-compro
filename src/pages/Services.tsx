import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async';

const services = [
  { 
    title: 'Website', 
    desc: 'Website responsif, SEO friendly, CMS dasar',
    longDesc: 'Kami membuat website responsif yang menyesuaikan dengan semua ukuran layar, sudah dioptimasi untuk SEO, dan dilengkapi dengan CMS dasar untuk kemudahan update konten.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    ),
    features: [
      'Landing page profesional',
      'Responsif di semua perangkat',
      'SEO friendly',
      'CMS dasar untuk update konten',
      'Integrasi formulir kontak',
      'Paket khusus mahasiswa tersedia'
    ],
    linkTo: '/paket/bronze'
  },
  { 
    title: 'Undangan Digital', 
    desc: 'Undangan interaktif, RSVP, lokasi',
    longDesc: 'Undangan digital interaktif dengan fitur RSVP, peta lokasi terintegrasi, galeri foto, dan countdown timer menuju acara Anda.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    ),
    features: [
      'Desain template menarik',
      'Fitur RSVP online',
      'Peta lokasi terintegrasi',
      'Galeri foto',
      'Countdown timer'
    ],
    linkTo: '/paket/silver'
  },
  { 
    title: 'Desain Grafis', 
    desc: 'Poster, social media, branding',
    longDesc: 'Layanan desain grafis profesional untuk kebutuhan bisnis Anda, termasuk desain poster, konten media sosial, logo, dan material branding lainnya.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
        <line x1="8" y1="2" x2="8" y2="18"></line>
        <line x1="16" y1="6" x2="16" y2="22"></line>
      </svg>
    ),
    features: [
      'Desain poster dan banner',
      'Konten untuk media sosial',
      'Desain logo',
      'Kartu nama dan kop surat',
      'Material branding lainnya'
    ],
    linkTo: '/paket/gold'
  },
  { 
    title: 'Menu & Katalog', 
    desc: 'Menu digital, katalog produk',
    longDesc: 'Menu digital untuk restoran dengan QR code dan katalog produk online untuk bisnis retail Anda, memudahkan pelanggan melihat produk/layanan.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
      </svg>
    ),
    features: [
      'Menu digital dengan QR code',
      'Katalog produk online',
      'Mudah diperbarui',
      'Tampilan yang menarik',
      'Responsif di semua perangkat'
    ],
    linkTo: '/paket/platinum'
  }
];

export const Services: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/50 to-white py-8 sm:py-14">
      <Helmet>
        <title>Layanan Kami - NexCube Digital</title>
        <meta name="description" content="Layanan premium NexCube Digital - website, undangan digital, desain grafis, menu & katalog digital untuk kebutuhan bisnis Anda" />
      </Helmet>
      
      <div className="container">
        <div className={`text-center max-w-3xl mx-auto mb-8 sm:mb-16 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}>
          <h1 className="text-2xl sm:text-3xl font-heading font-semibold text-slate-900">Layanan Kami</h1>
          <p className="text-slate-500 mt-3 sm:mt-4 text-base sm:text-lg">
            Kami menyediakan berbagai layanan digital premium yang dapat disesuaikan dengan kebutuhan bisnis Anda.
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <div 
              key={service.title} 
              className={`bg-white rounded-xl shadow-card overflow-hidden group h-full flex flex-col ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}
              style={{ animationDelay: `${300 + (index * 150)}ms` }}
            >
              <div className="p-5 sm:p-8 flex-grow">
                <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="p-2 sm:p-3 bg-accent/10 text-accent rounded-xl transition-colors group-hover:bg-accent group-hover:text-white">
                    {service.icon}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-heading font-semibold">{service.title}</h2>
                    <p className="text-slate-500 mt-1 text-sm">{service.desc}</p>
                  </div>
                </div>
                
                <p className="text-slate-600 text-sm sm:text-base">{service.longDesc}</p>
                
                <div className="mt-5 sm:mt-6">
                  <h3 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">Fitur:</h3>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 sm:gap-3">
                        <span className="inline-flex mt-1 items-center justify-center w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-accent/10 text-accent">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                        <span className="text-xs sm:text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 sm:p-6 flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
                <Link 
                  to={service.linkTo} 
                  className="text-accent font-medium hover:underline flex items-center gap-1 text-sm sm:text-base"
                >
                  Lihat Detail Paket
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
                <Link 
                  to="/contact" 
                  className="text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-md border border-slate-200 hover:bg-accent hover:text-white hover:border-accent transition-colors text-center"
                >
                  Konsultasi
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className={`mt-16 bg-gradient-premium rounded-xl p-8 md:p-12 text-white ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-800'}`}>
          <div className="md:flex justify-between items-center">
            <div className="md:max-w-lg">
              <h2 className="text-2xl font-heading font-semibold mb-4">Butuh Solusi Custom?</h2>
              <p className="text-slate-200">
                Kami mengerti setiap bisnis punya kebutuhan unik. Tim kami siap membantu Anda dengan solusi yang disesuaikan untuk bisnis Anda.
              </p>
            </div>
            <div className="mt-8 md:mt-0">
              <Link to="/contact" className="bg-white text-primary hover:bg-white/90 px-6 py-3 rounded-md font-medium inline-block transition-all">
                Diskusikan Kebutuhan Anda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Services;