import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '../components/layout/Layout';
import apiClient from '../services/api';
import { 
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp, FaPaperPlane, 
  FaCheckCircle, FaRocket, FaShieldAlt, FaExternalLinkAlt, FaComments, FaChevronRight 
} from 'react-icons/fa';
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
    <path d="M50 10 L85 30 L50 50 L15 30 Z" strokeWidth="1.5" strokeDasharray="3 3" />
    <path d="M15 30 L50 50 L50 90 L15 70 Z" strokeWidth="1.5" />
    <path d="M50 50 L85 30 L85 70 L50 90 Z" strokeWidth="1.5" />
    <circle cx="50" cy="50" r="3.5" fill="currentColor" />
    <line x1="50" y1="50" x2="50" y2="10" strokeWidth="1" opacity="0.5" />
    <line x1="50" y1="50" x2="15" y2="70" strokeWidth="1" opacity="0.5" />
    <line x1="50" y1="50" x2="85" y2="70" strokeWidth="1" opacity="0.5" />
  </svg>
);

export const Contact: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    budget: '',
    service: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const contactInfo = [
    {
      code: "CH // 01",
      title: "Telepon / WhatsApp",
      info: "+62 859 5031 3360",
      subinfo: "Respon Cepat Tim Support",
      icon: <FaPhoneAlt className="w-3.5 h-3.5 text-blue-600" />,
      badgeBg: 'bg-blue-50/90 border-blue-100',
      actionUrl: "https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi",
      actionLabel: "Chat WhatsApp"
    },
    {
      code: "CH // 02",
      title: "Email Resmi",
      info: "nexcubedigital@gmail.com",
      subinfo: "Proposal & Kerjasama Bisnis",
      icon: <FaEnvelope className="w-3.5 h-3.5 text-amber-600" />,
      badgeBg: 'bg-amber-50/90 border-amber-100',
      actionUrl: "mailto:nexcubedigital@gmail.com",
      actionLabel: "Kirim Email"
    },
    {
      code: "CH // 03",
      title: "Alamat Studio",
      info: "Jln. Bukit Jarian No. 30, Hegarmanah, Bandung, Jawa Barat",
      subinfo: "Bandung Creative Tech Hub",
      icon: <FaMapMarkerAlt className="w-3.5 h-3.5 text-rose-500" />,
      badgeBg: 'bg-rose-50/90 border-rose-100',
      actionUrl: "https://maps.google.com/?q=Bandung+Jawa+Barat",
      actionLabel: "Buka Google Maps"
    },
    {
      code: "CH // 04",
      title: "Jam Operasional",
      info: "Senin - Jumat: 09:00 - 17:00 WIB\nSabtu: 09:00 - 13:00 WIB",
      subinfo: "WhatsApp 24/7 Selalu Aktif",
      icon: <FaClock className="w-3.5 h-3.5 text-emerald-500" />,
      badgeBg: 'bg-emerald-50/90 border-emerald-100',
      actionUrl: "https://wa.me/6285950313360",
      actionLabel: "Konsultasi 24/7"
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nama lengkap wajib diisi';
    if (!formData.email.trim()) {
      newErrors.email = 'Alamat email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.message.trim()) newErrors.message = 'Pesan atau detail proyek wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      await apiClient.submitContact({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        company: formData.company || undefined,
        phone: formData.phone || undefined,
        service: formData.service ? formData.service as any : undefined,
        budget: formData.budget ? formData.budget as any : undefined
      });
      
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: '',
        budget: '',
        service: ''
      });
      
      setTimeout(() => {
        setSubmitted(false);
      }, 6000);
    } catch (error: any) {
      setErrors({ form: error.message || 'Terjadi kesalahan saat mengirim pesan' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Hubungi Kami - NexCube Digital | Konsultasi Proyek & Penawaran</title>
        <meta 
          name="description" 
          content="Hubungi NexCube Digital untuk konsultasi gratis dan diskusikan kebutuhan website, aplikasi, desain grafis, undangan digital, atau katalog produk Anda." 
        />
      </Helmet>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION: 1-FRAME VIEWPORT (100dvh)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="hero" className="relative min-h-[100dvh] lg:h-screen lg:max-h-screen flex flex-col justify-between overflow-hidden bg-[#030712] text-white border-b border-slate-800/80 pt-20 pb-2 sm:pt-24 sm:pb-3 lg:pt-24 lg:pb-3">
        
        {/* Background Aesthetics: Deep Space, Radial Glows & Laser Spline */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#060c20] to-[#040817] pointer-events-none" />

        {/* Ambient Blue & Emerald Glow Orbs */}
        <div className="absolute top-1/4 -left-20 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
        <div 
          className="absolute top-1/3 -right-20 w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] bg-emerald-500/15 rounded-full blur-[160px] pointer-events-none animate-pulse" 
          style={{ animationDelay: '2.5s' }} 
        />

        {/* Glowing Neon Laser Mesh Curve (Matching Landing & Portfolio Hero) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-45 z-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="contactLaserGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#126EFE" stopOpacity="0" />
              <stop offset="45%" stopColor="#00d2ff" stopOpacity="0.85" />
              <stop offset="80%" stopColor="#10b981" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#126EFE" stopOpacity="0" />
            </linearGradient>
            <filter id="contactLaserGlow" x="-20%" y="-20%" width="140%" height="140%">
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
            stroke="url(#contactLaserGrad)"
            strokeWidth="3.5"
            filter="url(#contactLaserGlow)"
          />
          <path
            d="M -50,640 C 300,580 550,440 870,320 C 1170,220 1470,250 1900,120"
            fill="none"
            stroke="url(#contactLaserGrad)"
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
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-400/25 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-300 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.15)] text-left">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
                <IsometricCubeIcon className="w-3.5 h-3.5 text-emerald-300" />
                <span className="text-white font-bold tracking-wide">NexCube Dispatch</span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-300 truncate">Official Communication Channels</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2.5 sm:space-y-3">
                <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-[2.6rem] xl:text-[3.2rem] font-black text-white tracking-tight leading-[1.15]">
                  Konsultasi Digital <br />
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent inline-block pb-1">
                    Solusi Terbaik
                  </span> Bisnis Anda
                </h1>

                <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                  Diskusikan kebutuhan pembuatan website, aplikasi, desain grafis, undangan digital, dan katalog produk Anda bersama tim spesialis NexCube Digital.
                </p>
              </div>

              {/* ── 3 Quick Stat Badges ── */}
              <div className="pt-1 sm:pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 text-xs sm:text-sm font-bold">
                <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-cyan-500/30 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-cyan-300 backdrop-blur-md shadow-xs hover:border-cyan-400/60 transition-colors">
                  <FaRocket className="text-cyan-400 w-3.5 h-3.5" />
                  <span>Respon &lt; 15 Menit</span>
                </div>

                <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-emerald-500/30 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-emerald-300 backdrop-blur-md shadow-xs hover:border-emerald-400/60 transition-colors">
                  <FaCheckCircle className="text-emerald-400 w-3.5 h-3.5" />
                  <span>100% Bebas Biaya</span>
                </div>

                <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-amber-500/30 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-amber-300 backdrop-blur-md shadow-xs hover:border-amber-400/60 transition-colors">
                  <FaShieldAlt className="text-amber-400 w-3.5 h-3.5" />
                  <span>Kerahasiaan Terjamin</span>
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
                  <span>Konsultasi WhatsApp</span>
                </a>

                <a
                  href="#contact-form-section"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact-form-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 hover:border-cyan-300 hover:text-cyan-300 cursor-pointer backdrop-blur-md"
                >
                  <span>Isi Formulir Proyek</span>
                  <FaChevronRight className="w-3 h-3 text-cyan-400" />
                </a>
              </div>

            </div>

            {/* ── Right Column: 3D Floating CUBE Communications HUD Card ── */}
            <div className={`lg:col-span-5 relative ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-200'}`}>
              <div className="relative bg-[#060c20]/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-[0_0_40px_rgba(0,210,255,0.12)] space-y-3 sm:space-y-4">
                
                {/* Terminal Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 text-[10px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                    <span className="text-slate-400 pl-2 font-bold">NEXCUBE // DISPATCH v5.0</span>
                  </div>
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-[9px] sm:text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    ONLINE 24/7
                  </span>
                </div>

                {/* 2x2 Dispatch Hotlines */}
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors">
                    <div className="flex items-center gap-1.5 text-cyan-300 text-[10px] font-mono font-bold">
                      <FaPhoneAlt className="w-3 h-3" />
                      <span>HOTLINE / WA</span>
                    </div>
                    <div className="text-white text-xs font-bold mt-1 truncate">+62 859 5031 3360</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Respon Cepat</div>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors">
                    <div className="flex items-center gap-1.5 text-amber-300 text-[10px] font-mono font-bold">
                      <FaEnvelope className="w-3 h-3" />
                      <span>EMAIL RESMI</span>
                    </div>
                    <div className="text-white text-xs font-bold mt-1 truncate">nexcube@gmail.com</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Kerjasama & Info</div>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors">
                    <div className="flex items-center gap-1.5 text-rose-300 text-[10px] font-mono font-bold">
                      <FaMapMarkerAlt className="w-3 h-3" />
                      <span>STUDIO HUB</span>
                    </div>
                    <div className="text-white text-xs font-bold mt-1 truncate">Bandung, Jawa Barat</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Creative Center</div>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors">
                    <div className="flex items-center gap-1.5 text-emerald-300 text-[10px] font-mono font-bold">
                      <FaClock className="w-3 h-3" />
                      <span>JAM OPERASIONAL</span>
                    </div>
                    <div className="text-white text-xs font-bold mt-1 truncate">09:00 - 17:00 WIB</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Senin - Sabtu</div>
                  </div>
                </div>

                {/* Dispatch Security Specs */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    SECURITY & ENCRYPTION
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                    <div className="flex items-center gap-2 text-slate-200 font-medium text-[11px] sm:text-xs">
                      <FaShieldAlt className="text-cyan-400 w-3 h-3" />
                      <span>Enkripsi Pesan & Kerahasiaan Ide</span>
                    </div>
                    <span className="text-cyan-300 font-mono text-[10px] sm:text-[11px] font-bold">256-Bit SSL</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                    <div className="flex items-center gap-2 text-slate-200 font-medium text-[11px] sm:text-xs">
                      <FaComments className="text-emerald-400 w-3 h-3" />
                      <span>Didampingi Konsultan Senior</span>
                    </div>
                    <span className="text-emerald-300 font-mono text-[10px] sm:text-[11px] font-bold">Direct Call</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Bottom Explore Beacon Bar */}
        <div className="text-center pt-1 pb-2 sm:pb-3 relative z-10 hidden sm:block">
          <a 
            href="#contact-form-section"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact-form-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-colors uppercase tracking-widest cursor-pointer group"
          >
            <span>Isi Formulir & Hubungi Langsung</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform animate-pulse"></span>
            <svg className="w-3.5 h-3.5 text-cyan-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>

      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          MAIN CONTACT & FORM SECTION: CUBE 5.0 TITANIUM CANVAS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="contact-form-section" className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-white via-slate-50/70 to-slate-100/50 text-slate-900 relative overflow-hidden border-b border-slate-200/60">
        
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
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-300/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14 space-y-2 sm:space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-slate-800 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
              <IsometricCubeIcon className="w-3.5 h-3.5 text-slate-700" />
              <span>FORMULIR PROYEK & KANAL RESMI // NEXCUBE DISPATCH</span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Kirim Pesan Konsultasi <br className="hidden sm:inline" />
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Isi formulir di bawah ini dengan detail kebutuhan Anda atau hubungi langsung kanal resmi kami untuk respon secepat kilat.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* ── Left Column: Smart Inquiry Form (7 Cols) ── */}
            <div className="lg:col-span-7">
              {submitted ? (
                <div className="p-8 sm:p-14 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-emerald-300 shadow-2xl text-center space-y-4 relative overflow-hidden">
                  <CubeWatermark />
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <FaCheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">Pesan Berhasil Terkirim!</h3>
                  <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-medium">
                    Terima kasih telah mempercayakan rencana proyek Anda kepada NexCube Digital. Konsultan spesialis kami akan segera meninjau dan merespon via Email / WhatsApp.
                  </p>
                  <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
                    >
                      Kirim Pesan Lain
                    </button>
                    <a
                      href="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20sudah%20mengirimkan%20formulir%20konsultasi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <FaWhatsapp className="w-4 h-4" />
                      <span>Follow-up via WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form 
                  onSubmit={handleSubmit} 
                  className="group relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-slate-200/90 shadow-xl shadow-blue-500/5 space-y-5 relative overflow-hidden"
                >
                  {/* Cube Wireframe Watermark Background */}
                  <CubeWatermark />

                  {/* Top Glowing Accent Line on Hover */}
                  <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-blue-500 to-transparent transition-all duration-300"></div>

                  {/* Form Header Info */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 relative z-10">
                    <div>
                      <div className="text-[10px] font-mono font-bold tracking-widest text-slate-400">
                        PROJECT INQUIRY FORM // 256-BIT ENCRYPTED
                      </div>
                      <div className="text-xs font-bold text-slate-800 mt-0.5">
                        Lengkapi rincian proyek Anda
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      SYSTEM READY
                    </span>
                  </div>

                  {errors.form && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
                      {errors.form}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                    
                    {/* Name */}
                    <div className="space-y-1">
                      <label htmlFor="name" className="block text-xs font-bold text-slate-700">
                        Nama Lengkap <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Contoh: Budi Santoso"
                        className={`w-full bg-slate-50 border px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                          errors.name ? 'border-rose-400' : 'border-slate-200 focus:border-[#126EFE]'
                        }`}
                      />
                      {errors.name && <p className="text-rose-500 text-[11px] font-semibold">{errors.name}</p>}
                    </div>
                    
                    {/* Email */}
                    <div className="space-y-1">
                      <label htmlFor="email" className="block text-xs font-bold text-slate-700">
                        Email Resmi <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="budi@perusahaan.com"
                        className={`w-full bg-slate-50 border px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                          errors.email ? 'border-rose-400' : 'border-slate-200 focus:border-[#126EFE]'
                        }`}
                      />
                      {errors.email && <p className="text-rose-500 text-[11px] font-semibold">{errors.email}</p>}
                    </div>
                    
                    {/* Company */}
                    <div className="space-y-1">
                      <label htmlFor="company" className="block text-xs font-bold text-slate-700">
                        Nama Perusahaan / Bisnis <span className="text-slate-400 font-normal">(Opsional)</span>
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="PT / CV / Usaha Anda"
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-[#126EFE] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label htmlFor="phone" className="block text-xs font-bold text-slate-700">
                        Nomor WhatsApp / Telepon <span className="text-slate-400 font-normal">(Opsional)</span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="081234567890"
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-[#126EFE] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    
                    {/* Service Needed */}
                    <div className="space-y-1">
                      <label htmlFor="service" className="block text-xs font-bold text-slate-700">
                        Kategori Layanan
                      </label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-[#126EFE] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                      >
                        <option value="">Pilih Kategori Layanan</option>
                        <option value="website">Website Premium & Custom</option>
                        <option value="undangan">Undangan Digital Interaktif</option>
                        <option value="desain">Desain Grafis & Brand Assets</option>
                        <option value="katalog">Katalog Menu & Smart QR</option>
                        <option value="lainnya">Solusi Custom / Enterprise</option>
                      </select>
                    </div>
                    
                    {/* Budget */}
                    <div className="space-y-1">
                      <label htmlFor="budget" className="block text-xs font-bold text-slate-700">
                        Perkiraan Budget Investasi
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-[#126EFE] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                      >
                        <option value="">Pilih Estimasi Budget</option>
                        <option value="< 1jt">Di bawah Rp 1 Juta</option>
                        <option value="1-3jt">Rp 1 - 3 Juta</option>
                        <option value="3-5jt">Rp 3 - 5 Juta</option>
                        <option value="5-10jt">Rp 5 - 10 Juta</option>
                        <option value="> 10jt">Di atas Rp 10 Juta</option>
                      </select>
                    </div>
                    
                    {/* Message */}
                    <div className="space-y-1 sm:col-span-2">
                      <label htmlFor="message" className="block text-xs font-bold text-slate-700">
                        Detail Pesan & Kebutuhan Proyek <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Jelaskan gambaran singkat kebutuhan proyek Anda (fitur yang diinginkan, target peluncuran, atau referensi)..."
                        className={`w-full bg-slate-50 border px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                          errors.message ? 'border-rose-400' : 'border-slate-200 focus:border-[#126EFE]'
                        }`}
                      />
                      {errors.message && <p className="text-rose-500 text-[11px] font-semibold">{errors.message}</p>}
                    </div>

                  </div>
                  
                  {/* Submit Button */}
                  <div className="pt-2 relative z-10">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-extrabold py-3.5 px-8 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-98 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Memproses Pengiriman Pesan...</span>
                      ) : (
                        <>
                          <FaPaperPlane className="w-3.5 h-3.5" />
                          <span>Kirim Pesan Konsultasi Sekarang</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
            
            {/* ── Right Column: 4 Channels & Direct WhatsApp Station (5 Cols) ── */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* 4 Contact Channel Cards (Compact CUBE 5.0) */}
              <div className="space-y-2">
                {contactInfo.map((item, index) => (
                  <div 
                    key={index} 
                    className="group relative bg-white/95 rounded-xl px-3 py-2.5 sm:px-3.5 sm:py-2.5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-400/80 transition-all duration-200 flex items-start gap-2.5 sm:gap-3 overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-slate-200 to-transparent group-hover:via-blue-500 transition-all"></div>
                    
                    <div className={`w-8 h-8 rounded-lg ${item.badgeBg} border flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-2xs mt-0.5`}>
                      {item.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[9px] font-mono font-bold tracking-wider text-slate-400 group-hover:text-blue-600 transition-colors">
                          {item.code}
                        </span>
                        <a 
                          href={item.actionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
                        >
                          <span>{item.actionLabel}</span>
                          <FaExternalLinkAlt className="w-2 h-2" />
                        </a>
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-700 font-semibold whitespace-pre-line mt-0.5 leading-snug">
                        {item.info}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                        {item.subinfo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Direct WhatsApp Fast Dispatcher Box (Industry 5.0 Emerald Cyber) */}
              <div className="relative bg-gradient-to-br from-[#061e16] via-[#093325] to-[#04120e] rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white border border-emerald-500/30 shadow-xl space-y-3 overflow-hidden">
                <CubeWatermark />

                <div className="flex items-center justify-between relative z-10">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold text-emerald-300">
                    <FaWhatsapp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>RESPON INSTAN &lt; 15 MENIT</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                </div>

                <div className="relative z-10 space-y-1.5">
                  <h4 className="text-base sm:text-lg font-black tracking-tight leading-snug">
                    Diskusi Cepat Melalui WhatsApp
                  </h4>
                  <p className="text-emerald-100/80 text-xs leading-relaxed">
                    Dapatkan estimasi biaya instan, konsultasi arsitektur modul, dan portofolio referensi langsung bersama tim spesialis kami.
                  </p>
                </div>

                <div className="pt-1 relative z-10">
                  <a 
                    href="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20langsung%20tentang%20proyek%20saya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold w-full py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
                  >
                    <FaWhatsapp className="w-4 h-4 text-white" />
                    <span>Chat WhatsApp Sekarang</span>
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>
    </Layout>
  );
};

export default Contact;