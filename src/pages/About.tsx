import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import apiClient from '../services/api';
import { FaRocket, FaUsers, FaChartLine, FaHeadset, FaEye, FaHeart, FaExternalLinkAlt, FaWhatsapp, FaArrowDown, FaChevronRight } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

export const About: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

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
    id?: number;
    name: string;
    position: string;
    image?: string;
    bio?: string;
    expertise?: string[] | string;
    portfolioUrl?: string;
    experience?: string;
    status?: 'active' | 'in-active';
  };

  const [teams, setTeams] = useState<TeamPublic[]>([]);
  const API_MEDIA_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await apiClient.getTeams();
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
              experience: t.experience || '3+ Years',
              expertise: t.expertise ? (Array.isArray(t.expertise) ? t.expertise : (t.expertise as string).split(',').map((s: string) => s.trim())) : ['Digital Solutions'],
              status: t.status
            }));
          if (mounted && items.length > 0) {
            setTeams(items);
            return;
          }
        }
      } catch (e) {
        // Fallback
      }
      if (mounted) setTeams(defaultTeamMembers);
    };
    load();
    return () => { mounted = false; };
  }, []);

  const stats = [
    { number: '50+', label: 'Proyek Selesai', icon: <FaRocket className="w-4 h-4 sm:w-5 sm:h-5 text-[#126EFE]" /> },
    { number: '30+', label: 'Klien Puas', icon: <FaUsers className="w-4 h-4 sm:w-5 sm:h-5 text-[#FBA41C]" /> },
    { number: '99%', label: 'Success Rate', icon: <FaChartLine className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" /> },
    { number: '24/7', label: 'Support Responsif', icon: <FaHeadset className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" /> }
  ];

  const values = [
    {
      title: 'Visi Kami',
      description: 'Menjadi mitra terpercaya dalam akselerasi & transformasi digital Indonesia dengan menghadirkan solusi teknologi yang inovatif, cepat, dan berkelanjutan.',
      icon: <FaEye className="w-5 h-5 sm:w-6 sm:h-6 text-[#126EFE]" />,
      accentColor: 'from-[#126EFE] to-blue-600',
      bgIcon: 'bg-blue-50 border-blue-100'
    },
    {
      title: 'Misi Kami',
      description: 'Memberikan solusi digital berstandar internasional yang terjangkau, ramah pengguna, berdaya saing tinggi, dan berorientasi pada hasil nyata bisnis klien.',
      icon: <FaRocket className="w-5 h-5 sm:w-6 sm:h-6 text-[#FBA41C]" />,
      accentColor: 'from-[#FBA41C] to-amber-600',
      bgIcon: 'bg-amber-50 border-amber-100'
    },
    {
      title: 'Nilai Utama',
      description: 'Integritas, inovasi tanpa henti, dan kepuasan klien 100% adalah fondasi utama dari setiap karya proyek yang kami hasilkan.',
      icon: <FaHeart className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500" />,
      accentColor: 'from-rose-500 to-pink-600',
      bgIcon: 'bg-rose-50 border-rose-100'
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Tentang Kami - NexCube Digital | Studio Kreatif Premium</title>
        <meta name="description" content="NexCube Digital - Studio kreatif premium yang menghadirkan solusi digital berkualitas internasional untuk transformasi bisnis Anda. Tim berpengalaman, teknologi terdepan." />
      </Helmet>

      {/* ── HERO SECTION (Compact on Mobile) ─────────────────────────────────── */}
      <section className="relative min-h-screen lg:h-screen lg:max-h-[920px] bg-gradient-to-b from-blue-50/40 via-white to-slate-50/50 pt-20 lg:pt-24 pb-8 overflow-hidden flex flex-col justify-between">
        
        {/* Background Light Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10 flex-1 flex flex-col justify-center">
          
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            
            {/* Left Column: Hero Text */}
            <div className={`lg:col-span-7 space-y-3 sm:space-y-5 text-center lg:text-left ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}>
              
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#126EFE] shadow-xs">
                <HiSparkles className="w-3.5 h-3.5 text-[#FBA41C]" />
                <span>NEXCUBE DIGITAL INDONESIA</span>
              </div>

              {/* Clean Unified Headline */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Mitra Strategis <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#126EFE] via-blue-600 to-[#FBA41C] bg-clip-text text-transparent">
                  Transformasi Digital
                </span> Bisnis Anda
              </h1>

              {/* Clean Subtitle */}
              <p className="text-slate-600 text-xs sm:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Kami menghadirkan solusi digital terpadu (Website, Undangan Digital, Desain Grafis, dan Katalog Produk) berstandar internasional dengan pendekatan terukur & harga terjangkau.
              </p>

              {/* Feature Points */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1.5 text-[11px] sm:text-sm font-semibold text-slate-700 pt-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-blue-100 text-[#126EFE] flex items-center justify-center text-[10px] font-bold">✓</div>
                  <span>Solusi Digital Terpadu</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-amber-100 text-[#FBA41C] flex items-center justify-center text-[10px] font-bold">✓</div>
                  <span>Performa High Speed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">✓</div>
                  <span>Garansi Support 24/7</span>
                </div>
              </div>

              {/* Action Buttons (Official WhatsApp Green Button) */}
              <div className="pt-2 sm:pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3">
                <a
                  href="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20tentang%20kebutuhan%20digital%20saya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold px-5 py-3 sm:px-7 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <FaWhatsapp className="w-4 h-4 text-white" />
                  <span>Konsultasi Gratis</span>
                </a>

                <a
                  href="#team-section"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('team-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white hover:bg-blue-50/60 border border-slate-200 text-slate-800 font-bold px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-1.5 hover:border-blue-300 hover:text-[#126EFE] cursor-pointer"
                >
                  <span>Lihat Tim Kami</span>
                  <FaChevronRight className="w-3 h-3 text-[#126EFE]" />
                </a>
              </div>

            </div>

            {/* Right Column: Glassmorphic Showcase & 2x2 Stats Grid (Hidden on Mobile) */}
            <div className={`hidden lg:block lg:col-span-5 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-200'}`}>
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xl shadow-blue-500/5 space-y-3 sm:space-y-5 relative overflow-hidden">
                
                {/* Top Accent Gradient Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#126EFE] via-blue-600 to-[#FBA41C]"></div>

                {/* Top Ambient Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-100/40 rounded-full blur-2xl pointer-events-none"></div>

                {/* Logo Showcase */}
                <div className="text-center pt-1 sm:pt-2 pb-0.5 relative z-10">
                  <img 
                    src="/images/NexCube-full.png" 
                    alt="NexCube Digital" 
                    className="h-10 sm:h-16 w-auto mx-auto object-contain drop-shadow-xs"
                  />
                  <div className="text-[11px] sm:text-xs font-bold text-slate-500 mt-1.5 tracking-wide">
                    Studio Kreatif Digital Indonesia
                  </div>
                </div>

                {/* 2x2 Stats Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2.5 sm:pt-3 border-t border-slate-100 relative z-10">
                  {stats.map((stat, idx) => (
                    <div 
                      key={idx} 
                      className="bg-slate-50/70 hover:bg-gradient-to-b hover:from-blue-50/60 hover:to-white rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-slate-100 hover:border-blue-200 text-center transition-all duration-300 shadow-2xs"
                    >
                      <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white border border-slate-200/80 flex items-center justify-center mx-auto mb-1 sm:mb-2 shadow-2xs">
                        {stat.icon}
                      </div>
                      <div className="text-lg sm:text-2xl font-black bg-gradient-to-r from-[#126EFE] to-blue-700 bg-clip-text text-transparent">
                        {stat.number}
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-bold text-slate-600 mt-0.5">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="text-center py-2 hidden lg:block">
          <a
            href="#vision-section"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('vision-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#126EFE] transition-colors"
          >
            <span>Gulir Ke Bawah</span>
            <FaArrowDown className="w-3 h-3 animate-bounce" />
          </a>
        </div>
      </section>

      {/* ── VISI, MISI & NILAI SECTION (Compact on Mobile) ──────────────────── */}
      <section id="vision-section" className="py-8 sm:py-16 md:py-24 bg-white relative border-t border-slate-100">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12 space-y-2 sm:space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#126EFE]">
              <HiSparkles className="w-3.5 h-3.5 text-[#FBA41C]" />
              <span>FONDASI UTAMA KAMI</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Visi, Misi & Nilai <span className="text-[#126EFE]">NexCube</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6 max-w-6xl mx-auto">
            {values.map((item) => (
              <div 
                key={item.title}
                className="group relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-2xl hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${item.accentColor}`}></div>

                <div className="space-y-3 sm:space-y-4">
                  {/* Header Row: Icon + Title Samping Icon */}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border ${item.bgIcon} flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs shrink-0`}>
                      {item.icon}
                    </div>
                    <h3 className="text-base sm:text-xl font-bold text-slate-900 group-hover:text-[#126EFE] transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── TEAM MEMBERS SECTION (Compact on Mobile) ───────────────────────── */}
      <section id="team-section" className="py-8 sm:py-16 md:py-24 bg-gradient-to-b from-white via-blue-50/20 to-slate-50/50">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-6xl">
          
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-14 space-y-2 sm:space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 text-[#e08d07] px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-xs">
              <HiSparkles className="w-3.5 h-3.5 text-[#FBA41C]" />
              <span>TIM PROFESIONAL KAMI</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Mengenal Tim Di Balik <span className="text-[#126EFE]">NexCube Digital</span>
            </h2>

            <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
              Talenta muda berbakat dan berpengalaman yang siap mengeksekusi visi bisnis Anda menjadi kenyataan digital.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8">
            {teams.map((member, index) => (
              <a 
                key={index} 
                href={member.portfolioUrl || '#'}
                target={member.portfolioUrl ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="group bg-white rounded-xl sm:rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-2xl hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Image Container (Aspect-Square on Mobile) */}
                <div className="relative overflow-hidden bg-slate-100 aspect-square sm:aspect-4/3">
                  <img 
                    src={member.image} 
                    alt={`${member.name} - ${member.position}`} 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/team/team-1.jpg';
                    }}
                  />
                  
                  {/* Experience Badge */}
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-[#FBA41C] text-slate-900 font-extrabold text-[9px] sm:text-xs px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md">
                    {member.experience || '3+ Years'}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-2.5 sm:p-6">
                    <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform">
                      <div className="inline-flex items-center gap-1.5 text-white font-bold px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-[#126EFE] text-[10px] sm:text-xs shadow-md">
                        <span>Lihat Portofolio</span>
                        <FaExternalLinkAlt className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Content Info (Compact Padding on Mobile) */}
                <div className="p-2.5 sm:p-6 space-y-1.5 sm:space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xs sm:text-lg text-slate-900 group-hover:text-[#126EFE] transition-colors mb-0.5 leading-snug line-clamp-1 sm:line-clamp-none">
                      {member.name}
                    </h3>
                    <p className="text-[#126EFE] font-semibold text-[10px] sm:text-xs mb-1 sm:mb-2 truncate">{member.position}</p>
                    <p className="text-[11px] sm:text-sm text-slate-600 leading-snug mb-2 line-clamp-2">{member.bio}</p>
                  </div>

                  {/* Expertise Pills */}
                  <div className="flex flex-wrap gap-1 pt-1.5 border-t border-slate-100">
                    {member.expertise && Array.isArray(member.expertise) && member.expertise.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="text-[9px] sm:text-[11px] bg-blue-50 text-[#126EFE] border border-blue-100 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md sm:rounded-lg font-bold truncate">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER SECTION (Compact & Green WA Button) ───────────────────── */}
      <section className="py-8 sm:py-16 bg-white border-t border-slate-100">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-5xl">
          <div className="bg-gradient-to-r from-[#126EFE] via-blue-600 to-blue-700 rounded-2xl sm:rounded-3xl p-5 sm:p-12 text-white text-center shadow-xl relative overflow-hidden space-y-3 sm:space-y-4">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#FBA41C]/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-bold text-amber-300">
              <HiSparkles className="w-3.5 h-3.5 text-[#FBA41C]" />
              <span>Konsultasi Bebas Biaya 24/7</span>
            </div>

            <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Siap Memulai Proyek Digital Anda?
            </h2>

            <p className="text-blue-100 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Hubungi tim ahli kami sekarang dan dapatkan penawaran harga terbaik untuk akselerasi pertumbuhan bisnis Anda.
            </p>

            <div className="pt-1 sm:pt-2">
              <a 
                href="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20tentang%20kebutuhan%20digital%20saya"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold px-6 py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-lg transition-colors cursor-pointer"
              >
                <FaWhatsapp className="w-4 h-4 text-white" />
                <span>Konsultasi Gratis via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default About;