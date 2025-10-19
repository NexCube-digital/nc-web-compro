import React from 'react'
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  const teamMembers = [
    {
      name: 'Aslam Mushtafa Karim',
      position: 'CEO',
      image: '/images/team/team-1.jpg',
      bio: 'Berpengalaman lebih dari 5 tahun dalam industri programer dan digital marketing.'
    },
    {
      name: 'Bela Amelia Nuralfiani',
      position: 'UI/UX Designer',
      image: '/images/team/team-2.jpg',
      bio: 'Expert dalam Desain UI/UX serta berkomunikasi dengan Client.'
    },
    {
      name: 'Budi Santoso',
      position: 'Creative Director',
      image: '/images/team/team-3.jpg',
      bio: 'Spesialis dalam branding dan strategi kreatif untuk berbagai industri.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/50 to-white py-14">
      <Helmet>
        <title>Tentang Kami - NexCube Digital</title>
        <meta name="description" content="Mengenal lebih dekat NexCube Digital, studio kreatif yang fokus pada solusi web dan desain premium untuk perusahaan dan UMKM di Indonesia." />
      </Helmet>
      
      <div className="container">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="heading-lg text-slate-900">Tentang NexCube Digital</h1>
          <p className="text-slate-500 mt-6 text-lg leading-relaxed">
            PT NexCube Digital adalah studio kreatif yang fokus pada solusi web dan desain premium untuk perusahaan dan UMKM. 
            Kami menyediakan paket lengkap dari desain sampai deploy dengan pendekatan yang profesional dan hasil yang berkualitas.
          </p>
        </div>
        
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-xl shadow-card hover:shadow-premium transition-all">
            <div className="bg-accent/10 text-accent p-3 w-14 h-14 flex items-center justify-center rounded-lg mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h2 className="text-xl font-heading font-semibold mb-3">Visi</h2>
            <p className="text-slate-600">Mendigitalisasi bisnis Indonesia dengan solusi teknologi yang inovatif, terjangkau, dan berkualitas global.</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-card hover:shadow-premium transition-all">
            <div className="bg-accent/10 text-accent p-3 w-14 h-14 flex items-center justify-center rounded-lg mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <h2 className="text-xl font-heading font-semibold mb-3">Misi</h2>
            <p className="text-slate-600">Memberi solusi digital yang mudah, profesional, dan tepat guna untuk membantu pertumbuhan bisnis klien kami di era digital.</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-card hover:shadow-premium transition-all">
            <div className="bg-accent/10 text-accent p-3 w-14 h-14 flex items-center justify-center rounded-lg mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h2 className="text-xl font-heading font-semibold mb-3">Tim</h2>
            <p className="text-slate-600">Tim kami terdiri dari desainer UI/UX, developer, dan marketing specialist yang berpengalaman dalam industri digital.</p>
          </div>
        </div>
        
        {/* Team Members */}
        <div className="mb-20">
          <h2 className="text-2xl font-heading font-semibold mb-8 text-center">Tim Profesional Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-premium transition-all">
                {/* Ganti div placeholder dengan tag img */}
                <img 
                  src={member.image} 
                  alt={`Foto ${member.name}`} 
                  className="w-full h-48 object-cover object-center" 
                />
                <div className="p-6">
                  <h3 className="font-heading font-semibold text-lg">{member.name}</h3>
                  <p className="text-accent text-sm mb-3">{member.position}</p>
                  <p className="text-slate-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className="bg-gradient-premium rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-heading font-semibold mb-4">Siap Bekerja Sama?</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Diskusikan proyek Anda dengan tim kami dan dapatkan konsultasi gratis untuk kebutuhan digital bisnis Anda.
          </p>
          <Link to="/contact" className="btn-primary bg-white text-primary hover:bg-white/90">
            Hubungi Kami
          </Link>
        </div>
      </div>
    </div>
  )
}

export default About;