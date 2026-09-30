import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import apiClient from '../services/api';
import { FaRocket, FaUsers, FaChartLine, FaHeadset, FaEye, FaHeart, FaExternalLinkAlt, FaWhatsapp, FaArrowDown, FaChevronRight, FaCheckCircle, FaLaptopCode } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

// 3D Isometric Cube Icon
const IsometricCubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path 
      d="M12 2 L21 7.2 L12 12.4 L3 7.2 Z" 
      fill="currentColor" 
      fillOpacity="0.2" 
      stroke="currentColor" 
      strokeWidth="1.3" 
      strokeLinejoin="round" 
    />
    <path 
      d="M3 7.2 L12 12.4 L12 22 L3 16.8 Z" 
      fill="currentColor" 
      fillOpacity="0.1" 
      stroke="currentColor" 
      strokeWidth="1.3" 
      strokeLinejoin="round" 
    />
    <path 
      d="M12 12.4 L21 7.2 L21 16.8 L12 22 Z" 
      fill="currentColor" 
      fillOpacity="0.15" 
      stroke="currentColor" 
      strokeWidth="1.3" 
      strokeLinejoin="round" 
    />
  </svg>
);

// 3D Isometric Wireframe Cube Watermark for Card Background
const CubeWatermark: React.FC = () => (
  <svg 
    className="absolute -top-6 -right-6 w-32 h-32 text-slate-400/15 group-hover:text-blue-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 pointer-events-none" 
    viewBox="0 0 100 100" 
    fill="none" 
    stroke="currentColor"
  >
    {/* Top Diamond Wireframe */}
    <path d="M50 10 L85 30 L50 50 L15 30 Z" strokeWidth="1.5" strokeDasharray="3 3" />
    {/* Left Isometric Wall */}
    <path d="M15 30 L50 50 L50 90 L15 70 Z" strokeWidth="1.5" />
    {/* Right Isometric Wall */}
    <path d="M50 50 L85 30 L85 70 L50 90 Z" strokeWidth="1.5" />
    {/* Internal Core Nodes */}
    <circle cx="50" cy="50" r="3.5" fill="currentColor" />
    <line x1="50" y1="50" x2="50" y2="10" strokeWidth="1" opacity="0.5" />
    <line x1="50" y1="50" x2="15" y2="70" strokeWidth="1" opacity="0.5" />
    <line x1="50" y1="50" x2="85" y2="70" strokeWidth="1" opacity="0.5" />
  </svg>
);

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

  type TeamApiItem = Omit<TeamPublic, 'name'> & {
    name?: string;
    account?: { name?: string };
  };

  const [teams, setTeams] = useState<TeamPublic[]>([]);
  const API_MEDIA_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await apiClient.getTeams();
        const rawTeams: TeamApiItem[] = Array.isArray(res.data)
          ? res.data as TeamApiItem[]
          : res.data && Array.isArray((res.data as { teams?: TeamApiItem[] }).teams)
            ? (res.data as { teams: TeamApiItem[] }).teams
            : [];

        if (res.success && rawTeams.length > 0) {
          const items = rawTeams
            .filter(t => t.status === 'active')
            .map(t => ({
              id: t.id,
              name: t.account?.name || t.name || 'Anggota Tim NexCube',
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
      code: 'CORE // 01',
      title: 'Visi Kami',
      subtitle: 'Akselerasi Transformasi Digital',
      tag: 'STRATEGIC VISION',
      description: 'Menjadi mitra terpercaya dalam akselerasi & transformasi digital Indonesia dengan menghadirkan arsitektur teknologi modern yang inovatif, cepat, dan berkelanjutan.',
      icon: <FaEye className="w-5 h-5 sm:w-6 sm:h-6 text-[#126EFE]" />,
      accentColor: 'from-[#126EFE] via-blue-600 to-cyan-500',
      bgIcon: 'bg-blue-50/90 border-blue-100',
      features: [
        'Akselerasi Ekosistem Digital Nasional',
        'Pemberdayaan Bisnis & Brand Lokal',
        'Infrastruktur Digital Tangguh & Skalabel'
      ]
    },
    {
      code: 'CORE // 02',
      title: 'Misi Kami',
      subtitle: 'Standar Rekayasa Global',
      tag: 'OPERATIONAL MISSION',
      description: 'Memberikan solusi digital berstandar internasional yang terjangkau, ramah pengguna, berdaya saing tinggi, dan berorientasi langsung pada hasil bisnis klien.',
      icon: <FaRocket className="w-5 h-5 sm:w-6 sm:h-6 text-[#FBA41C]" />,
      accentColor: 'from-[#FBA41C] via-amber-500 to-yellow-500',
      bgIcon: 'bg-amber-50/90 border-amber-100',
      features: [
        'Standar Kualitas & Kode Internasional',
        'Transparansi Biaya & Timeline Presisi',
        'Dukungan Teknis & Konsultasi 24/7'
      ]
    },
    {
      code: 'CORE // 03',
      title: 'Nilai Utama',
      subtitle: 'Integritas & Kepuasan 100%',
      tag: 'CORE PRINCIPLE',
      description: 'Integritas tanpa kompromi, inovasi tanpa henti, dan dedikasi kepuasan klien 100% adalah fondasi utama dari setiap karya proyek yang kami bangun.',
      icon: <FaHeart className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500" />,
      accentColor: 'from-rose-500 via-pink-500 to-purple-600',
      bgIcon: 'bg-rose-50/90 border-rose-100',
      features: [
        'Integritas & Etika Profesional Tinggi',
        'Inovasi Solutif Berorientasi Dampak',
        'Garansi Kepuasan Klien 100%'
      ]
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Tentang Kami - NexCube Digital | Studio Kreatif Premium</title>
        <meta name="description" content="NexCube Digital - Studio kreatif premium yang menghadirkan solusi digital berkualitas internasional untuk transformasi bisnis Anda. Tim berpengalaman, teknologi terdepan." />
      </Helmet>

      {/* ── HERO SECTION: 1-FRAME VIEWPORT (100dvh) ── */}
      <section id="hero" className="relative min-h-[100dvh] lg:h-screen lg:max-h-screen flex flex-col justify-between overflow-hidden bg-[#030712] text-white border-b border-slate-800/80 pt-20 pb-2 sm:pt-24 sm:pb-3 lg:pt-24 lg:pb-3">
        
        {/* Background Aesthetics: Deep Space, Radial Glows & Laser Spline */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#060c20] to-[#040817] pointer-events-none" />

        {/* Ambient Blue & Indigo Glow Orbs */}
        <div className="absolute top-1/4 -left-20 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
        <div 
          className="absolute top-1/3 -right-20 w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] bg-indigo-500/15 rounded-full blur-[160px] pointer-events-none animate-pulse" 
          style={{ animationDelay: '2.5s' }} 
        />

        {/* Glowing Neon Laser Mesh Curve (Matching Landing Hero) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-45 z-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="aboutLaserGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#126EFE" stopOpacity="0" />
              <stop offset="45%" stopColor="#6366f1" stopOpacity="0.85" />
              <stop offset="80%" stopColor="#00d2ff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#126EFE" stopOpacity="0" />
            </linearGradient>
            <filter id="aboutLaserGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M -100,600 C 250,540 500,400 820,280 C 1120,180 1420,220 1850,90"
            fill="none"
            stroke="url(#aboutLaserGrad)"
            strokeWidth="3.5"
            filter="url(#aboutLaserGlow)"
          />
          <path
            d="M -50,640 C 300,580 550,440 870,320 C 1170,220 1470,250 1900,120"
            fill="none"
            stroke="url(#aboutLaserGrad)"
            strokeWidth="1.5"
            opacity="0.5"
          />
        </svg>

        {/* Subtle Digital Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.035] pointer-events-none z-0"
          style={{
            backgroundImage: `linear-gradient(#00d2ff 1px, transparent 1px), linear-gradient(90deg, #00d2ff 1px, transparent 1px)`,
            backgroundSize: '54px 54px'
          }}
        />

        {/* Container Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full max-w-7xl flex-1 flex flex-col justify-center my-auto py-2 sm:py-3">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 xl:gap-12 items-center">
            
            {/* ── Left Column: Headline, Copy & 3 Quick Stat Badges ── */}
            <div className={`lg:col-span-7 text-center lg:text-left space-y-4 sm:space-y-5 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}>
              
              {/* Badge Tag */}
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-400/25 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold text-indigo-300 backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.15)] text-left">
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping shrink-0"></span>
                <IsometricCubeIcon className="w-3.5 h-3.5 text-cyan-300" />
                <span className="text-white font-bold tracking-wide">NexCube Profile</span>
                <span className="text-slate-500">•</span>
                <span className="text-indigo-300 truncate">Industry 5.0 Creative Studio</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2.5 sm:space-y-3">
                <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-[2.6rem] xl:text-[3.2rem] font-black text-white tracking-tight leading-[1.15]">
                  Mitra Strategis <br />
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent inline-block pb-1">
                    Transformasi Digital
                  </span> Bisnis Anda
                </h1>

                <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                  Kami menghadirkan solusi digital terpadu (Website, Undangan Digital, Desain Grafis, dan Katalog Produk) berstandar internasional dengan arsitektur modern berkecepatan tinggi.
                </p>
              </div>

              {/* ── 3 Quick Stat Badges ── */}
              <div className="pt-1 sm:pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 text-xs sm:text-sm font-bold">
                <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-blue-500/30 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-blue-300 backdrop-blur-md shadow-xs hover:border-blue-400/60 transition-colors">
                  <FaRocket className="text-blue-400 w-3.5 h-3.5" />
                  <span>50+ Proyek Selesai</span>
                </div>

                <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-emerald-500/30 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-emerald-300 backdrop-blur-md shadow-xs hover:border-emerald-400/60 transition-colors">
                  <FaUsers className="text-emerald-400 w-3.5 h-3.5" />
                  <span>30+ Mitra Terpercaya</span>
                </div>

                <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-indigo-500/30 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-indigo-300 backdrop-blur-md shadow-xs hover:border-indigo-400/60 transition-colors">
                  <FaHeadset className="text-indigo-400 w-3.5 h-3.5" />
                  <span>24/7 Dedicated Support</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3">
                <a
                  href="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20tentang%20kebutuhan%20digital%20saya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-98"
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
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 hover:border-cyan-300 hover:text-cyan-300 cursor-pointer backdrop-blur-md"
                >
                  <span>Lihat Tim Kami</span>
                  <FaChevronRight className="w-3 h-3 text-cyan-400" />
                </a>
              </div>

            </div>

            {/* ── Right Column: 3D Floating CUBE Studio Terminal Console ── */}
            <div className={`lg:col-span-5 relative ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-200'}`}>
              <div className="relative bg-[#060c20]/90 backdrop-blur-xl border border-indigo-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-[0_0_40px_rgba(99,102,241,0.12)] space-y-3 sm:space-y-4">
                
                {/* Terminal Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 text-[10px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                    <span className="text-slate-400 pl-2 font-bold">NEXCUBE // STUDIO CORE v5.0</span>
                  </div>
                  <span className="text-cyan-400 font-bold flex items-center gap-1 text-[9px] sm:text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    VERIFIED STUDIO
                  </span>
                </div>

                {/* 2x2 Matrix Metrics */}
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  {stats.map((stat, idx) => (
                    <div 
                      key={idx} 
                      className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center transition-all duration-300"
                    >
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-1">
                        {stat.icon}
                      </div>
                      <div className="text-base sm:text-xl font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                        {stat.number}
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-medium text-slate-400 mt-0.5">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Studio Core DNA Highlights */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    STUDIO ARCHITECTURE
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                    <div className="flex items-center gap-2 text-slate-200 font-medium text-[11px] sm:text-xs">
                      <FaRocket className="text-cyan-400 w-3 h-3" />
                      <span>Inovasi & Kualitas Internasional</span>
                    </div>
                    <span className="text-cyan-300 font-mono text-[10px] sm:text-[11px] font-bold">Industry 5.0</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                    <div className="flex items-center gap-2 text-slate-200 font-medium text-[11px] sm:text-xs">
                      <FaCheckCircle className="text-emerald-400 w-3 h-3" />
                      <span>Kepuasan & Keamanan Klien</span>
                    </div>
                    <span className="text-emerald-300 font-mono text-[10px] sm:text-[11px] font-bold">100% Verified</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Bottom Explore Beacon Bar */}
        <div className="text-center pt-1 pb-2 sm:pb-3 relative z-10 hidden sm:block">
          <a 
            href="#vision-section"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('vision-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-colors uppercase tracking-widest cursor-pointer group"
          >
            <span>Kenali Nilai & Tim Kami</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform animate-pulse"></span>
            <svg className="w-3.5 h-3.5 text-cyan-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>

      </section>

      {/* ── VISI, MISI & NILAI SECTION (Industry 5.0 CUBE Landing Theme) ──────────────────── */}
      <section id="vision-section" className="py-10 sm:py-16 md:py-20 bg-gradient-to-b from-white via-slate-50/70 to-slate-100/50 text-slate-900 relative overflow-hidden border-b border-slate-200/60">
        
        {/* Background Digital Isometric Grid */}
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />

        {/* Ambient Lighting Glows */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-300/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-300/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14 space-y-2 sm:space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-slate-800 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
              <IsometricCubeIcon className="w-3.5 h-3.5 text-slate-700" />
              <span>FONDASI UTAMA KAMI // NEXCUBE CORE</span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-700 bg-clip-text text-transparent">
                NexCube Digital
              </span>
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Komitmen teguh, dedikasi kualitas internasional, dan etika profesional yang mendasari setiap baris kode, arsitektur visual, serta modul digital yang kami ciptakan.
            </p>
          </div>

          {/* 3 Pillars Cards (Matching Services & BrandShowcase Aesthetic) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {values.map((item) => (
              <div 
                key={item.title}
                className="group relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 border border-slate-200/90 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs cursor-pointer"
              >
                {/* 3D Wireframe Cube Watermark Background */}
                <CubeWatermark />

                {/* Glowing Top Accent Line on Hover */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-slate-200 to-transparent group-hover:via-blue-500 group-hover:from-blue-600/40 group-hover:to-cyan-400/40 transition-all duration-300"></div>

                <div className="space-y-4 relative z-10">
                  {/* Pillar Code Header & Badge */}
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">
                      {item.code}
                    </span>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      {item.tag}
                    </span>
                  </div>

                  {/* Icon & Title Row */}
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border ${item.bgIcon} flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-2xs shrink-0`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <div className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed min-h-[3rem]">
                    {item.description}
                  </p>

                  {/* Feature Checklist */}
                  <ul className="space-y-2 pt-3 border-t border-slate-100">
                    {item.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                        <FaCheckCircle className="text-blue-600 shrink-0 w-3.5 h-3.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── TEAM MEMBERS SECTION (CUBE 5.0 Industry Standard) ───────────────────────── */}
      <section id="team-section" className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-slate-100/40 via-white to-slate-50/60 text-slate-900 relative overflow-hidden border-b border-slate-200/60">
        
        {/* Background Digital Isometric Grid */}
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />

        {/* Ambient Lighting Glows */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-blue-300/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-indigo-300/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14 space-y-2 sm:space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-slate-800 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
              <IsometricCubeIcon className="w-3.5 h-3.5 text-slate-700" />
              <span>TALENTA & REKAYASA DIGITAL // NEXCUBE TEAM</span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Mengenal Tim Di Balik <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-700 bg-clip-text text-transparent">
                NexCube Digital
              </span>
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Talenta muda berbakat dan berpengalaman yang siap mengeksekusi visi bisnis Anda menjadi kenyataan digital.
            </p>
          </div>
          
          {/* Team Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {teams.map((member, index) => {
              const codeIdx = String(index + 1).padStart(2, '0');
              return (
                <div 
                  key={index} 
                  className="group relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/90 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xs"
                >
                  {/* Cube Wireframe Watermark Background */}
                  <CubeWatermark />

                  {/* Top Glowing Accent Line on Hover */}
                  <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-slate-200 to-transparent group-hover:via-blue-500 group-hover:from-blue-600/40 group-hover:to-cyan-400/40 transition-all duration-300"></div>

                  <div className="p-4 sm:p-6 relative z-10 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Card Header Status */}
                      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">
                          CREW // {codeIdx}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          ACTIVE CORE
                        </span>
                      </div>

                      {/* Member Photo Frame with Hover Effects */}
                      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-100 aspect-square sm:aspect-[4/3] border border-slate-200/80 group-hover:border-blue-300 transition-colors">
                        <img 
                          src={member.image} 
                          alt={`${member.name} - ${member.position}`} 
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/team/team-1.jpg';
                          }}
                        />
                        
                        {/* Experience Pill Badge */}
                        <div className="absolute top-2.5 right-2.5 bg-slate-900/85 backdrop-blur-md text-amber-300 border border-amber-400/30 font-mono text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                          {member.experience || '3+ Years Exp'}
                        </div>

                        {/* Hover Overlay with Portfolio CTA */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                          <a
                            href={member.portfolioUrl || '#'}
                            target={member.portfolioUrl ? '_blank' : '_self'}
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-lg shadow-blue-500/30 transition-transform active:scale-95"
                          >
                            <span>Lihat Portofolio</span>
                            <FaExternalLinkAlt className="w-2.5 h-2.5 text-cyan-200" />
                          </a>
                        </div>
                      </div>

                      {/* Member Info */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                            {member.name}
                          </h3>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                          <span>{member.position}</span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                          {member.bio}
                        </p>
                      </div>
                    </div>

                    {/* Expertise Skill Chips */}
                    <div className="pt-3 border-t border-slate-100">
                      <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                        CORE EXPERTISE
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {member.expertise && Array.isArray(member.expertise) && member.expertise.slice(0, 3).map((skill, idx) => (
                          <span 
                            key={idx} 
                            className="text-[10px] sm:text-[11px] bg-slate-50 group-hover:bg-blue-50/70 text-slate-700 group-hover:text-blue-600 border border-slate-200/80 group-hover:border-blue-200 px-2 py-0.5 rounded-lg font-semibold transition-colors truncate"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER SECTION (Industry 5.0 CUBE) ───────────────────── */}
      <section className="py-12 sm:py-16 md:py-20 bg-white relative overflow-hidden border-t border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl relative z-10">
          <div className="relative bg-gradient-to-r from-[#060c20] via-blue-950 to-[#040816] border border-cyan-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-white text-center shadow-[0_0_50px_rgba(18,110,254,0.15)] overflow-hidden space-y-4 sm:space-y-5">
            {/* Ambient Glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="inline-flex items-center gap-1.5 bg-blue-500/15 border border-blue-400/30 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold text-cyan-300">
              <HiSparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>KONSULTASI BEBAS BIAYA 24/7</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
              Siap Memulai Proyek Digital Anda?
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Hubungi tim ahli NexCube Digital sekarang dan dapatkan arsitektur solusi terbaik yang dirancang khusus untuk percepatan bisnis Anda di era Industry 5.0.
            </p>

            <div className="pt-2 sm:pt-3">
              <a 
                href="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20tentang%20kebutuhan%20digital%20saya"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold px-6 py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-98 transition-all duration-200 cursor-pointer"
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