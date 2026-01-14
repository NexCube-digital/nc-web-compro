import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Layout } from '../components/layout/Layout'

export const DesainGrafis: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleGoBack = () => {
    navigate(-1); // Navigate back to previous page
  };

  const handleCategoryClick = (routePath: string) => {
    navigate(routePath);
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

  const portfolioItems = [
    {
      category: 'Branding',
      items: [
        { title: 'Logo & Brand Identity', desc: 'Desain logo dan identitas visual perusahaan' },
        { title: 'Kartu Nama', desc: 'Desain kartu nama profesional' },
        { title: 'Kop Surat & Amplop', desc: 'Template untuk komunikasi resmi' }
      ]
    },
    {
      category: 'Marketing',
      items: [
        { title: 'Social Media Post', desc: 'Konten visual untuk Instagram, Facebook, dll.' },
        { title: 'Banner Iklan', desc: 'Banner untuk website dan media sosial' },
        { title: 'Brosur & Flyer', desc: 'Desain bahan promosi cetak' }
      ]
    },
    {
      category: 'Digital',
      items: [
        { title: 'UI/UX Design', desc: 'Desain antarmuka website dan aplikasi' },
        { title: 'Infografis', desc: 'Visualisasi data dan informasi' },
        { title: 'Ilustrasi Digital', desc: 'Ilustrasi kustom untuk berbagai kebutuhan' }
      ]
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50/50 to-white py-8 sm:py-16">
        <Helmet>
          <title>Desain Grafis - NexCube Digital</title>
          <meta name="description" content="Jasa desain grafis premium untuk kebutuhan bisnis - logo, branding, social media content, UI/UX, marketing material, dan lainnya" />
        </Helmet>
        
        <div className="container">
          {/* Category filter removed — sidebar provides navigation */}
          
          <div className={`mb-16 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}>
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-heading font-semibold mb-4">Desain Grafis</h1>
              <p className="text-slate-500 text-lg leading-relaxed">
                Tim desainer profesional kami siap membantu kebutuhan visual bisnis Anda, mulai dari branding, marketing material, hingga konten digital.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
              {['Branding', 'Marketing', 'UI/UX'].map((category, index) => (
                <div 
                  key={category} 
                  className={`text-center p-4 rounded-xl bg-white shadow-card hover:shadow-premium transition-all ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}
                  style={{ animationDelay: `${200 + (index * 150)}ms` }}
                >
                  <div className="bg-accent/10 text-accent w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                    {index === 0 && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    )}
                    {index === 1 && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <polyline points="1 20 1 14 7 14"></polyline>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                      </svg>
                    )}
                    {index === 2 && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                      </svg>
                    )}
                  </div>
                  <h3 className="font-heading font-semibold">{category}</h3>
                </div>
              ))}
            </div>
          </div>
          
          <div className={`p-8 sm:p-10 bg-white rounded-xl shadow-card mb-16 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-300'}`}>
            <h2 className="text-2xl font-heading font-semibold mb-8">Layanan Desain Kami</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {portfolioItems.map((category, categoryIndex) => (
                <div 
                  key={category.category} 
                  className={`${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}
                  style={{ animationDelay: `${400 + (categoryIndex * 150)}ms` }}
                >
                  <h3 className="font-heading font-semibold mb-4 text-lg">{category.category}</h3>
                  <div className="space-y-5">
                    {category.items.map((item, itemIndex) => (
                      <div 
                        key={item.title} 
                        className="border-l-2 border-accent pl-4 py-1"
                      >
                        <h4 className="font-medium text-slate-800">{item.title}</h4>
                        <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={`mb-16 grid md:grid-cols-2 gap-8 items-center ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-500'}`}>
            <div>
              <img 
                src="/images/services/design-process.jpg" 
                alt="Our Design Process" 
                className="rounded-xl shadow-card w-full h-auto object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-semibold mb-6">Proses Kreatif Kami</h2>
              <ol className="space-y-4">
                <li className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">1</span>
                  <div>
                    <h3 className="font-medium text-lg">Discovery</h3>
                    <p className="text-slate-500 mt-1">Memahami kebutuhan, target audience, dan goal bisnis Anda</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">2</span>
                  <div>
                    <h3 className="font-medium text-lg">Research & Brainstorm</h3>
                    <p className="text-slate-500 mt-1">Menganalisa kompetitor dan tren, kemudian brainstorming ide kreatif</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">3</span>
                  <div>
                    <h3 className="font-medium text-lg">Desain & Prototype</h3>
                    <p className="text-slate-500 mt-1">Menerjemahkan ide menjadi desain konkret, membuat prototype</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">4</span>
                  <div>
                    <h3 className="font-medium text-lg">Revisi & Finalisasi</h3>
                    <p className="text-slate-500 mt-1">Penyempurnaan desain berdasarkan feedback hingga hasil yang memuaskan</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
          
          <div className={`bg-gradient-premium rounded-xl p-8 md:p-12 text-white ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-600'}`}>
            <div className="md:flex justify-between items-center">
              <div className="md:max-w-lg">
                <h2 className="text-2xl font-heading font-semibold mb-4">Punya proyek desain?</h2>
                <p className="text-slate-200">
                  Diskusikan kebutuhan visual bisnis Anda dengan tim desainer profesional kami.
                </p>
              </div>
              <div className="flex gap-4 mt-8 md:mt-0">
                <Link to="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20tentang%20kebutuhan%20digital%20saya" className="border border-white/50 hover:border-white text-white px-6 py-3 rounded-md font-medium transition-all">
                  Hubungi Kami
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default DesainGrafis
