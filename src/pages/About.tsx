import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Set animasi entrance pada page load dengan delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const teamMembers = [
    {
      name: 'Aslam Mushtafa Karim',
      position: 'CEO',
      image: '/images/team/team-1.jpg',
      bio: 'Berpengalaman lebih dari 5 tahun dalam industri programer dan digital marketing.',
      portfolioUrl: 'https://aslam2025.netlify.app/'
    },
    {
      name: 'Bela Amelia Nuralfiani',
      position: 'UI/UX Designer',
      image: '/images/team/team-2.jpg',
      bio: 'Berpengalaman dalam desain antarmuka pengguna dan pengalaman pengguna untuk berbagai platform digital.',
      portfolioUrl: 'https://example.com/bela'
    },
    {
      name: 'Muhammad Regi Taryana',
      position: 'Backend Developer',
      image: '/images/team/an.jpeg',
      bio: 'Spesialis dalam pengembangan backend dan manajemen database untuk aplikasi skala besar.',
      portfolioUrl: 'https://example.com/regi'
    }, 
    {
      name: 'Alif Alfarizi',
      position: 'Frontend Developer',
      image: '/images/team/an.jpeg',
      bio: 'Spesialis dalam pengembangan antarmuka pengguna yang responsif dan interaktif.',
      portfolioUrl: 'https://example.com/alif'
    },
    
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/50 to-white py-14">
      <Helmet>
        <title>Tentang Kami - NexCube Digital</title>
        <meta name="description" content="Mengenal lebih dekat NexCube Digital, studio kreatif yang fokus pada solusi web dan desain premium untuk perusahaan dan UMKM di Indonesia." />
      </Helmet>
      
      <div className="container">
        {/* Hero Section with Logo */}
        <div className={`text-center max-w-3xl mx-auto mb-16 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}>
          {/* Added Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="/images/NexCube-full.png" 
              alt="NexCube Digital Logo" 
              className="w-40 h-40 object-contain animate-float drop-shadow-premium"
            />
          </div>
          <h1 className="heading-lg text-slate-900 mb-2">Tentang NexCube Digital</h1>
          <div className="w-20 h-1 bg-gradient-modern mx-auto mb-6 rounded-full"></div>
          <p className="text-slate-500 mt-6 text-lg leading-relaxed">
            NexCube Digital adalah studio kreatif yang fokus pada solusi web dan desain premium untuk perusahaan dan UMKM. 
            Kami menyediakan paket lengkap dari desain sampai deploy dengan pendekatan yang profesional dan hasil yang berkualitas.
          </p>
        </div>
        
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {["Visi", "Misi", "Tim"].map((title, index) => (
            <div 
              key={title}
              style={{ animationDelay: `${200 + (index * 150)}ms` }}
              className={`card-glass p-8 rounded-xl hover:shadow-premium transition-all ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}
            >
              <div className="bg-premium-100 text-premium-700 p-3 w-14 h-14 flex items-center justify-center rounded-xl mb-5">
                {title === "Visi" && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                )}
                {title === "Misi" && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                )}
                {title === "Tim" && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                )}
              </div>
              <h2 className="text-xl font-heading font-semibold mb-3">{title}</h2>
              <p className="text-slate-600">
                {title === "Visi" && "Mendigitalisasi bisnis Indonesia dengan solusi teknologi yang inovatif, terjangkau, dan berkualitas global."}
                {title === "Misi" && "Memberi solusi digital yang mudah, profesional, dan tepat guna untuk membantu pertumbuhan bisnis klien kami di era digital."}
                {title === "Tim" && "Tim kami terdiri dari desainer UI/UX, developer, dan marketing specialist yang berpengalaman dalam industri digital."}
              </p>
            </div>
          ))}
        </div>
        
        {/* Team Members */}
        <div className="mb-20">
          <h2 className={`text-2xl font-heading font-semibold mb-2 text-center ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-600'}`}>Tim Profesional Kami</h2>
          <div className="w-20 h-1 bg-gradient-modern mx-auto mb-8 rounded-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <a 
                key={index} 
                href={member.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ animationDelay: `${700 + (index * 150)}ms` }}
                className={`bg-gradient-premium-light rounded-2xl overflow-hidden shadow-card hover:shadow-premium-hover transition-all duration-500 group ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={`Foto ${member.name}`} 
                    className="w-full h-60 object-cover object-center transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                    <span className="text-white font-medium px-6 py-2.5 rounded-xl bg-premium-700/90 text-sm shadow-premium-dark backdrop-blur-sm">Lihat Portofolio</span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="font-heading font-semibold text-lg group-hover:text-premium-700 transition-colors">{member.name}</h3>
                  <p className="text-premium-700 text-sm mb-3">{member.position}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className={`bg-gradient-modern rounded-2xl p-10 text-white text-center ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-800'}`}>
          <h2 className="text-2xl font-heading font-semibold mb-4 drop-shadow-text">Siap Bekerja Sama?</h2>
          <p className="text-slate-100 mb-8 max-w-2xl mx-auto">
            Diskusikan proyek Anda dengan tim kami dan dapatkan konsultasi gratis untuk kebutuhan digital bisnis Anda.
          </p>
          <Link to="https://wa.me/qr/B7H5SIV33KOUM1" className="btn-premium bg-white text-premium-700 hover:bg-white/90 px-8 py-3.5 rounded-xl">
            Hubungi Kami
          </Link>
        </div>
      </div>
    </div>
  )
}

export default About;