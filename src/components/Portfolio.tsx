import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  client: string;
  technologies: string[];
  link?: string;
  icon: React.ReactNode;
  gradient: string;
}

export const Portfolio: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const portfolioItems: PortfolioItem[] = [
    {
      id: '1',
      title: 'CDC IWU',
      category: 'Website',
      description: 'Website Career Development Center International Women University. ',
      image: '/images/portfolio/cdc.png',
      client: 'International Women University',
      technologies: ['React', 'Laravel', 'MySQL', 'Tailwind CSS'],
      link: 'https://cdc-iwu.netlify.app',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      id: '2',
      title: '3Treesify',
      category: 'Website',
      description: 'Website Pencatatan dan Verifikasi Penanaman Pohon Berbasis Blockchain.',
      image: '/images/portfolio/ccs.png',
      client: 'CCS',
      technologies: ['Blockchain', 'React', 'Laravel', 'MySQL', 'Tailwind CSS'],
      link: 'https://3treesify.netlify.app',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      id: '3',
      title: 'Menu Digital Karomah Food',
      category: 'Katalog Digital',
      description: 'Menu digital dengan QR code, fitur pemesanan online, dan sistem manajemen inventori real-time.',
      image: '/images/portfolio/karomah.png',
      client: 'KaromahFood',
      technologies: ['Typescript', 'Stripe API', 'QR Code Generator'],
      link: 'https://menu-karomah.netlify.app/',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      gradient: 'from-orange-500 to-amber-600'
    },
    {
      id: '4',
      title: 'Ucapan Ulang Tahun Digital',
      category: 'Undangan Digital',
      description: 'Website ucapan ulang tahun digital yang interaktif dan personalisasi tinggi.',
      image: '/images/portfolio/dede.png',
      client: 'Anonym',
      technologies: ['Typescript'],
      link: 'https://nursyilla-birthday.netlify.app/',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      gradient: 'from-indigo-500 to-blue-600'
    },
    {
      id: '5',
      title: 'E-Commerce Platform',
      category: 'Desain Grafis',
      description: 'Platform e-commerce lengkap dengan sistem pembayaran, manajemen inventory, dan dashboard penjual.',
      image: '/images/portfolio/ecommerce-platform.jpg',
      client: 'TechStore Indonesia',
      technologies: ['Figma', 'Adobe Creative Suite', 'Canva Pro', 'Adobe Stock'],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      gradient: 'from-rose-500 to-pink-600'
    },
    {
      id: '6',
      title: 'Compro HimaIF IWU',
      category: 'Website',
      description: 'Landing page komprehensif untuk HimaIF IWU dengan informasi kegiatan, berita terbaru, dan galeri acara.',
      image: '/images/portfolio/compro.png',
      client: 'HimaIF IWU',
      technologies: ['React', 'Laravel', 'Tailwind CSS', 'Emailjs'],
      link: 'https://himaif-iwu.netlify.app/',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      gradient: 'from-cyan-500 to-blue-600'
    }
  ];

  const categories = ['Semua', 'Website', 'Undangan Digital', 'Desain Grafis', 'Katalog Digital', 'Fotografi'];

  const filteredItems = selectedCategory && selectedCategory !== 'Semua'
    ? portfolioItems.filter(item => item.category === selectedCategory)
    : portfolioItems;

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className={`inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200 mb-6 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}>
            🎨 Portfolio Karya Kami
          </div>
          <h2 className={`text-3xl md:text-4xl font-bold text-slate-800 mb-6 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-100'}`}>
            Lihat Karya <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Terbaik Kami</span>
          </h2>
          <p className={`text-xl text-slate-600 leading-relaxed ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-200'}`}>
            Kami telah berhasil menyelesaikan 50+ proyek dengan hasil yang memuaskan klien. 
            Setiap proyek adalah bukti komitmen kami terhadap kualitas dan inovasi.
          </p>
        </div>

        {/* Filter Categories */}
        <div className={`flex flex-wrap justify-center gap-3 mb-12 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-300'}`}>
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                selectedCategory === category || (selectedCategory === null && category === 'Semua')
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-300 hover:text-blue-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredItems.map((item, index) => (
            <a
              key={item.id}
              href={item.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              style={{ animationDelay: `${400 + (index * 100)}ms` }}
              className={`group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white border border-white/50 hover:-translate-y-2 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}
            >
              {/* Image Container - Optimized Dimensions */}
              <div className="relative overflow-hidden bg-slate-100 w-full aspect-video">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.technologies.slice(0, 2).map((tech, idx) => (
                        <span key={idx} className="text-xs bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="inline-flex items-center gap-2 text-white font-bold px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-sm shadow-lg hover:shadow-xl transition-all">
                      <span>Lihat Detail</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Category Badge */}
                <div className={`absolute top-4 left-4 bg-gradient-to-r ${item.gradient} text-white px-4 py-2 rounded-full text-xs font-black shadow-lg backdrop-blur-sm`}>
                  {item.category}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                    {item.client}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 group-hover:text-blue-600 transition-colors">
                    <svg className="w-4 h-4 group-hover:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA Section */}
        <div className={`text-center ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-500'}`}>
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-3xl p-12 text-white shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Ingin Melihat Lebih Banyak?</h3>
            <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
              Kunjungi galeri lengkap kami untuk melihat semua proyek dan testimonial klien yang telah merasakan transformasi bisnis mereka.
            </p>
            <Link
              to="/paket"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Mulai Proyek Anda
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Recommended Image Specifications */}
      <div style={{ display: 'none' }} className="portfolio-specs">
        {/* 
          Portfolio Image Specifications:
          - Recommended Size: 1200px × 675px (16:9 aspect ratio)
          - File Format: JPG/WEBP (optimized for web)
          - Max File Size: 150KB per image
          - Compression: 80-85% quality
          
          Image Paths:
          - /images/portfolio/cdc-iwu.jpg
          - /images/portfolio/wedding-invitation.jpg
          - /images/portfolio/restaurant-menu.jpg
          - /images/portfolio/design-campaign.jpg
          - /images/portfolio/ecommerce-platform.jpg
          - /images/portfolio/portfolio-landing.jpg
        */}
      </div>
    </section>
  );
};
