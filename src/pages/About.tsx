import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import apiClient from '../services/api'

export const About: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Set animasi entrance pada page load dengan delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Default static data (fallback)
  const defaultTeamMembers = [
    {
      name: 'Aslam Mushtafa Karim',
      position: 'CEO & Founder',
      image: '/images/team/team-1.jpg',
      bio: 'Visioner dengan 5+ tahun pengalaman dalam transformasi digital dan strategi bisnis untuk startup dan enterprise.',
      portfolioUrl: 'https://aslam2025.netlify.app/',
      expertise: ['Digital Strategy', 'Business Development', 'Tech Leadership'],
      experience: '5+ Years'
    },
    {
      name: 'Bela Amelia Nuralfiani',
      position: 'Lead UI/UX Designer',
      image: '/images/team/team-2.jpg',
      bio: 'Desainer kreatif yang menghadirkan pengalaman pengguna yang intuitif dan estetika visual yang memukau.',
      portfolioUrl: 'https://example.com/bela',
      expertise: ['User Experience', 'Interface Design', 'Design Systems'],
      experience: '4+ Years'
    },
    {
      name: 'Muhammad Regi Taryana',
      position: 'Senior Backend Developer',
      image: '/images/team/team-3.jpg',
      bio: 'Arsitek sistem backend yang handal dalam membangun infrastruktur digital yang scalable dan secure.',
      portfolioUrl: 'https://example.com/regi',
      expertise: ['System Architecture', 'Database Design', 'API Development'],
      experience: '4+ Years'
    },
    {
      name: 'Alif Alfarizi',
      position: 'Frontend Specialist',
      image: '/images/team/team-4.jpg',
      bio: 'Pengembang frontend yang mahir menciptakan antarmuka web modern, responsif, dan performa tinggi.',
      portfolioUrl: 'https://alifalfariziportfolio.netlify.app/',
      expertise: ['React/Next.js', 'Performance Optimization', 'Modern CSS'],
      experience: '3+ Years'
    },
    {
      name: 'Okta Ramdani',
      position: 'Backend Developer',
      image: '/images/team/team-5.png',
      bio: 'Pengembang backend yang berdedikasi dalam membangun solusi server-side yang efisien dan andal.',
      portfolioUrl: 'https://oktaramdani.netlify.app/',
      expertise: ['Full Stack Development', 'DevOps', 'Cloud Solutions'],
      experience: '3+ Years'
    },
  ];

  type TeamPublic = {
    id?: number
    name: string
    position: string
    image?: string
    bio?: string
    expertise?: string[] | string
    portfolioUrl?: string
    experience?: string
    status?: 'active' | 'in-active'
  }

  const [teams, setTeams] = useState<TeamPublic[]>([])
  const API_MEDIA_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '')

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await apiClient.getTeams()
        if (res.success && res.data && !Array.isArray(res.data) && Array.isArray((res.data as any).teams)) {
          const items = (res.data as any).teams
            .filter((t: any) => t.status === 'active')
            .map((t: any) => ({
            id: t.id,
            name: t.name,
            position: t.position,
            image: typeof t.image === 'string' && t.image.startsWith('/uploads') ? `${API_MEDIA_BASE}${t.image}` : t.image || '/images/team/team-1.jpg',
            bio: t.bio,
            portfolioUrl: t.portfolioUrl,
            experience: t.experience,
            expertise: t.expertise ? (Array.isArray(t.expertise) ? t.expertise : (t.expertise as string).split(',').map((s: string) => s.trim())) : [],
            status: t.status
          }))
          if (mounted) setTeams(items)
          return
        }
      } catch (e) {
        // ignore, fallback to defaults
      }
      if (mounted) setTeams([])
    }
    load()
    return () => { mounted = false }
  }, [])

  const stats = [
    { 
      number: '50+', 
      label: 'Proyek Selesai', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ) 
    },
    { 
      number: '30+', 
      label: 'Klien Puas', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) 
    },
    { 
      number: '99%', 
      label: 'Success Rate', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ) 
    },
    { 
      number: '24/7', 
      label: 'Support', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.14 3.14a8 8 0 010 11.314m0 0L9.172 20.172m8.364-8.364l1.414-1.414M9.172 9.172L7.757 7.757m0 11.314l3.14-3.14a8 8 0 010-11.314m0 0l2.828 2.829m-2.828-2.829l1.414-1.414" />
        </svg>
      ) 
    }
  ];

  const values = [
    {
      title: 'Visi',
      description: 'Menjadi mitra terpercaya dalam transformasi digital Indonesia dengan solusi teknologi yang inovatif dan berkelanjutan.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Misi',
      description: 'Memberikan solusi digital premium yang mudah diakses, dengan fokus pada ROI tinggi dan pengalaman pengguna yang luar biasa.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Nilai',
      description: 'Integritas, inovasi, dan kepuasan klien adalah fondasi setiap proyek yang kami kerjakan dengan standar kualitas internasional.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      gradient: 'from-rose-500 to-pink-600'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-14 overflow-hidden">
        <Helmet>
          <title>Tentang Kami - NexCube Digital | Studio Kreatif Premium</title>
          <meta name="description" content="NexCube Digital - Studio kreatif premium yang menghadirkan solusi digital berkualitas internasional untuk transformasi bisnis Anda. Tim berpengalaman, teknologi terdepan." />
        </Helmet>
        
        <div className="container relative">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full blur-3xl -translate-x-48 -translate-y-48 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-100/50 to-orange-100/50 rounded-full blur-3xl translate-x-48 translate-y-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Hero Section with Enhanced Logo */}
          <div className={`text-center max-w-4xl mx-auto mb-20 relative ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}>
            <div className="flex justify-center mb-10">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
                <img 
                  src="/images/NexCube-full.png" 
                  alt="NexCube Digital Logo" 
                  className="relative w-48 h-48 object-contain animate-float drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-purple-700 bg-clip-text text-transparent leading-tight">
                NexCube Digital
              </h1>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent flex-1 max-w-20"></div>
                <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
                  Premium Digital Studio
                </span>
                <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent flex-1 max-w-20"></div>
              </div>
              <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
                <span className="font-semibold text-slate-800">Transformasi digital premium</span> untuk bisnis modern. 
                Kami menghadirkan solusi teknologi berkualitas internasional dengan pendekatan personal dan 
                <span className="font-semibold text-blue-700"> hasil yang terukur</span>.
              </p>
            </div>
          </div>

          {/* Stats Section - Enhanced */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-300'}`}>
            {stats.map((stat, index) => (
              <div 
                key={index}
                style={{ animationDelay: `${400 + (index * 100)}ms` }}
                className={`text-center p-8 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 group ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}
              >
                <div className="text-3xl md:text-4xl mb-4 transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4 rounded-2xl w-fit mx-auto text-white">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm font-bold text-slate-600 tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Enhanced Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {values.map((item, index) => (
              <div 
                key={item.title}
                style={{ animationDelay: `${600 + (index * 150)}ms` }}
                className={`group relative overflow-hidden bg-gradient-to-br from-white/90 via-white/70 to-white/50 backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <div className="relative">
                  <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-r ${item.gradient} text-white mb-6 group-hover:scale-125 transition-transform duration-300 group-hover:rotate-12 shadow-lg`}>
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-slate-900 tracking-tight">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Enhanced Team Members */}
          <div className="mb-24">
            <div className={`text-center mb-16 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-800'}`}>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Tim Ahli Kami</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6 rounded-full"></div>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Profesional berpengalaman dengan track record terbukti dalam menghadirkan solusi digital berkelas dunia
              </p>
            </div>
            
            {teams.length === 0 ? (
              <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-10 border border-white/50 shadow-lg">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mb-4">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
                  </svg>
                </div>
                <p className="text-slate-700 font-semibold">Belum ada anggota tim aktif</p>
                <p className="text-slate-500 text-sm mt-2">Silakan cek kembali dalam beberapa waktu.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teams.map((member, index) => (
                  <a 
                    key={index} 
                    href={member.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ animationDelay: `${900 + (index * 150)}ms` }}
                    className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}
                  >
                    {/* Experience Badge */}
                    <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      {member.experience}
                    </div>
                    
                    <div className="relative overflow-hidden">
                      <img 
                        src={member.image} 
                        alt={`${member.name} - ${member.position}`} 
                        className="w-full h-64 object-cover object-center transition-all duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <div className="flex flex-wrap gap-2 mb-4">
                            {member.expertise && Array.isArray(member.expertise) && member.expertise.slice(0, 2).map((skill, idx) => (
                              <span key={idx} className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                          <div className="inline-flex items-center gap-2 text-white font-medium px-4 py-2 rounded-xl bg-blue-600/90 text-sm shadow-lg backdrop-blur-sm hover:bg-blue-700/90 transition-colors">
                            <span>Lihat Portofolio</span>
                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-700 transition-colors mb-1">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 font-semibold text-sm mb-4">{member.position}</p>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">{member.bio}</p>
                      
                      {/* Expertise Tags */}
                      <div className="flex flex-wrap gap-2">
                        {member.expertise && Array.isArray(member.expertise) && member.expertise.map((skill, idx) => (
                          <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-lg font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
          
          {/* Enhanced CTA */}
          <div className={`relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-3xl p-12 text-white text-center overflow-hidden ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-1000'}`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>
            
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Siap Melayani 24/7
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 drop-shadow-lg">
                Mulai Transformasi Digital Anda
              </h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                Konsultasi gratis dengan tim ahli kami. Dapatkan strategi digital yang tepat untuk 
                mengakselerasi pertumbuhan bisnis Anda di era digital.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  to="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20tentang%20kebutuhan%20digital%20saya" 
                  className="group inline-flex items-center gap-3 bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Konsultasi Gratis
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                
                <div className="text-blue-200 text-sm">
                  ✨ Response dalam 5 menit
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default About;