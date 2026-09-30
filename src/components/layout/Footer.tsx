import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaWhatsapp, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaEnvelope, 
  FaChevronRight, FaShieldAlt, FaRocket, FaClock, FaCheckCircle 
} from 'react-icons/fa';

// 3D Isometric Cube Icon
const IsometricCubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    {/* Top Face */}
    <path 
      d="M12 2 L21 7.2 L12 12.4 L3 7.2 Z" 
      fill="currentColor" 
      fillOpacity="0.2" 
      stroke="currentColor" 
      strokeWidth="1.3" 
      strokeLinejoin="round" 
    />
    {/* Left Face */}
    <path 
      d="M3 7.2 L12 12.4 L12 22 L3 16.8 Z" 
      fill="currentColor" 
      fillOpacity="0.1" 
      stroke="currentColor" 
      strokeWidth="1.3" 
      strokeLinejoin="round" 
    />
    {/* Right Face */}
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

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'Tentang Kami', href: '/about' },
      { name: 'Portofolio Karya', href: '/portfolio' },
      { name: 'Benchmark Standar Kualitas', href: '/#why-us' },
      { name: 'Kisah Sukses Mitra', href: '/#testimonials' },
      { name: 'Tim & Karir', href: '/about#team' }
    ],
    services: [
      { name: 'Website High Performance', href: '/paket/website' },
      { name: 'Undangan Digital Interaktif', href: '/paket/undangan-digital' },
      { name: 'Desain Grafis & Identitas', href: '/paket/desain-grafis' },
      { name: 'Katalog Menu Digital QR', href: '/paket/menu-katalog' },
      { name: 'Arsitektur Modular CUBE 5.0', href: '/#services' }
    ],
    support: [
      { name: 'Pusat Bantuan & FAQ', href: '/#faq', external: false },
      { name: 'Tulis Ulasan Mitra', href: '/ulasan/baru', external: false },
      { name: 'Konsultasi WhatsApp', href: 'https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20tentang%20kebutuhan%20digital%20saya', external: true },
      { name: 'Hubungi Tim Support', href: '/contact', external: false }
    ]
  };

  const socialLinks = [
    {
      name: 'WhatsApp',
      href: 'https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20tentang%20kebutuhan%20digital%20saya',
      icon: <FaWhatsapp className="w-4 h-4" />,
      color: 'hover:bg-emerald-500 hover:text-white hover:border-emerald-500'
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/nexcube.digital',
      icon: <FaInstagram className="w-4 h-4" />,
      color: 'hover:bg-gradient-to-tr hover:from-amber-500 hover:to-pink-600 hover:text-white hover:border-pink-500'
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/nexcube-digital',
      icon: <FaLinkedin className="w-4 h-4" />,
      color: 'hover:bg-blue-600 hover:text-white hover:border-blue-600'
    },
    {
      name: 'Email',
      href: 'mailto:nexcubedigital@gmail.com',
      icon: <FaEnvelope className="w-4 h-4" />,
      color: 'hover:bg-slate-900 hover:text-white hover:border-slate-900'
    }
  ];

  return (
    <footer className="bg-gradient-to-b from-white via-slate-50 to-slate-100 border-t border-slate-200/90 text-slate-700 relative overflow-hidden">
      {/* ── Background Aesthetics: Digital Isometric Grid ── */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Ambient Lighting Accents */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-300/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-300/10 rounded-full blur-[120px] pointer-events-none" />

      {/* ── Top Ecosystem Status Bar ── */}
      <div className="border-b border-slate-200/80 bg-white/70 backdrop-blur-md relative z-10">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <IsometricCubeIcon className="w-3.5 h-3.5 text-slate-700" />
            <span>NEXCUBE 5.0 // NEXT GENERATION DIGITAL STUDIO ECOSYSTEM</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-700 font-bold">SYSTEM STATUS: ONLINE</span>
            </span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline">UPTIME 99.98%</span>
            <span className="hidden md:inline text-slate-400">•</span>
            <span className="hidden md:inline">BANDUNG, ID</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-10 sm:py-14 md:py-16 relative z-10">
        
        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Column 1: Brand Info & Status (5 Cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            <Link to="/" className="inline-block">
              <img 
                src="/images/NexCube-full.png" 
                alt="NexCube Digital" 
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </Link>

            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm max-w-md">
              Studio kreatif digital generasi baru yang menghadirkan solusi pembuatan website modern, desain grafis, undangan interaktif, dan katalog QR berstandar internasional dengan pendekatan <span className="font-semibold text-slate-900">Industry 5.0 Human-Centric</span>.
            </p>

            {/* Quick Contact Chips */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center gap-2.5 bg-white/90 border border-slate-200/90 px-3 py-2 rounded-xl shadow-2xs max-w-md">
                <FaMapMarkerAlt className="text-blue-600 shrink-0 w-3.5 h-3.5" />
                <span className="text-slate-700 text-[11px] sm:text-xs">
                  Jln. Bukit Jarian No. 30, Hegarmanah, Bandung, Jawa Barat, Indonesia
                </span>
              </div>

              <div className="flex items-center gap-2.5 bg-white/90 border border-slate-200/90 px-3 py-2 rounded-xl shadow-2xs max-w-md">
                <FaEnvelope className="text-indigo-600 shrink-0 w-3.5 h-3.5" />
                <a 
                  href="mailto:nexcubedigital@gmail.com" 
                  className="text-slate-700 hover:text-slate-950 transition-colors text-[11px] sm:text-xs font-semibold truncate"
                >
                  nexcubedigital@gmail.com
                </a>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-2 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-9 h-9 flex items-center justify-center bg-white border border-slate-200/90 text-slate-700 rounded-xl shadow-xs transition-all duration-200 hover:-translate-y-1 ${social.color} cursor-pointer`}
                  aria-label={social.name}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Layanan Utama (2.5 Cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-mono font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              <span>Layanan CUBE</span>
            </h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="group text-slate-600 hover:text-slate-950 transition-colors duration-200 text-xs sm:text-[13px] font-medium inline-flex items-center gap-1"
                  >
                    <FaChevronRight className="w-2 h-2 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-slate-900" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Perusahaan (2 Cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-mono font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              <span>Perusahaan</span>
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="group text-slate-600 hover:text-slate-950 transition-colors duration-200 text-xs sm:text-[13px] font-medium inline-flex items-center gap-1"
                  >
                    <FaChevronRight className="w-2 h-2 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-slate-900" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Bantuan & Jaminan (2.5 Cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-mono font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Dukungan Mitra</span>
            </h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group text-slate-600 hover:text-slate-950 transition-colors duration-200 text-xs sm:text-[13px] font-medium inline-flex items-center gap-1"
                    >
                      <FaChevronRight className="w-2 h-2 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-slate-900" />
                      <span>{link.name}</span>
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="group text-slate-600 hover:text-slate-950 transition-colors duration-200 text-xs sm:text-[13px] font-medium inline-flex items-center gap-1"
                    >
                      <FaChevronRight className="w-2 h-2 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-slate-900" />
                      <span>{link.name}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Micro Trust Card */}
            <div className="p-3 rounded-xl bg-white/90 border border-slate-200/90 shadow-2xs space-y-1.5 mt-2">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold text-[11px]">
                <FaShieldAlt className="text-emerald-600 w-3 h-3" />
                <span>Garansi Kepuasan 100%</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Hak milik kode penuh, bebas vendor lock-in, dan dukungan SLA perbaikan gratis.
              </p>
            </div>
          </div>

        </div>

        {/* ── Bottom Bar Footer ── */}
        <div className="border-t border-slate-200/90 pt-6 mt-8 sm:mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            
            {/* Copyright & Architecture Note */}
            <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
              © {currentYear} <span className="font-extrabold text-slate-900">NexCube Digital</span>. Hak Cipta Dilindungi. Engineered with Industry 5.0 Modern Architecture.
            </div>

            {/* Badges & Legal Links */}
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-5 text-[11px] sm:text-xs font-semibold text-slate-500">
              <Link to="/privacy" className="hover:text-slate-900 transition-colors">
                Kebijakan Privasi
              </Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-slate-900 transition-colors">
                Syarat & Ketentuan
              </Link>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px]">
                <FaCheckCircle className="w-2.5 h-2.5 text-emerald-600" /> Verified 256-bit SSL
              </span>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
