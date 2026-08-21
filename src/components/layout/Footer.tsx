import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaEnvelope, FaChevronRight, FaShieldAlt, FaRocket, FaClock } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'Tentang Kami', href: '/about' },
      { name: 'Tim Kami', href: '/about#team' },
      { name: 'Karir & Komunitas', href: '/contact' },
      { name: 'Portofolio Proyek', href: '/portfolio' }
    ],
    services: [
      { name: 'Website Custom & SEO', href: '/paket' },
      { name: 'Undangan Digital E-Invite', href: '/paket' },
      { name: 'Desain Grafis & Branding', href: '/paket' },
      { name: 'Katalog Digital & QR Menu', href: '/paket' },
    ],
    support: [
      { name: 'Pusat Bantuan & FAQ', href: '/paket#faq', external: false },
      { name: 'Hubungi Tim Support', href: '/contact', external: false },
      { name: 'Konsultasi WhatsApp', href: 'https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20tentang%20kebutuhan%20digital%20saya', external: true },
      { name: 'Tulis Ulasan Klien', href: '/ulasan', external: false },
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
      color: 'hover:bg-pink-600 hover:text-white hover:border-pink-600'
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/nexcube-digital',
      icon: <FaLinkedin className="w-4 h-4" />,
      color: 'hover:bg-blue-600 hover:text-white hover:border-blue-600'
    }
  ];

  return (
    <footer className="bg-gradient-to-b from-blue-50/50 via-white to-slate-100/90 border-t border-slate-200/90 text-slate-700 relative overflow-hidden">
      {/* Background Soft Ambient Light Blobs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-200/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 relative z-10 space-y-12">
        
        {/* Floating Top Banner Card */}
        <div className="bg-gradient-to-r from-[#126EFE] via-blue-600 to-[#126EFE] rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-blue-500/10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-[#FBA41C]/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="space-y-2 text-center md:text-left max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-amber-300">
              <HiSparkles className="w-3.5 h-3.5 text-[#FBA41C]" />
              <span>SIAP MEMULAI PROYEK DIGITAL ANDA?</span>
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
              Konsultasikan Kebutuhan Digital Anda Gratis!
            </h3>

            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Tim profesional NexCube siap merancang solusi website, desain, dan katalog terbaik sesuai anggaran Anda.
            </p>
          </div>

          <a
            href="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20tentang%20kebutuhan%20digital%20saya"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#FBA41C] hover:bg-[#e08d07] text-slate-900 font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-lg transition-all duration-200 hover:scale-105 active:scale-98 shrink-0 cursor-pointer"
          >
            <FaWhatsapp className="w-4 h-4 text-slate-900" />
            <span>Chat Via WhatsApp</span>
          </a>
        </div>

        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 pt-4">
          
          {/* Column 1: Brand Info & Status */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img 
                src="/images/NexCube-full.png" 
                alt="NexCube Digital" 
                className="h-10 w-auto object-contain"
              />
            </Link>

            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
              Studio kreatif digital premium yang menghadirkan solusi pembuatan website, desain grafis, undangan digital, dan katalog produk berstandar internasional.
            </p>

            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-700 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Layanan 24/7 Siap Melayani</span>
            </div>

            {/* Social Links */}
            <div className="flex space-x-2.5 pt-1">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 bg-white border border-slate-200/90 text-slate-700 rounded-xl shadow-xs transition-all duration-200 hover:-translate-y-1 ${social.color} cursor-pointer`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Company */}
          <div>
            <h3 className="font-extrabold text-slate-900 mb-4 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#126EFE]"></span>
              <span>Perusahaan</span>
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="group text-slate-600 hover:text-[#126EFE] transition-colors duration-200 text-xs sm:text-sm font-medium inline-flex items-center gap-1.5"
                  >
                    <FaChevronRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#126EFE]" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="font-extrabold text-slate-900 mb-4 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBA41C]"></span>
              <span>Layanan Utama</span>
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="group text-slate-600 hover:text-[#126EFE] transition-colors duration-200 text-xs sm:text-sm font-medium inline-flex items-center gap-1.5"
                  >
                    <FaChevronRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#126EFE]" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support & Contact Info */}
          <div>
            <h3 className="font-extrabold text-slate-900 mb-4 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Hubungi Kami</span>
            </h3>
            
            <div className="space-y-3 text-xs font-semibold text-slate-700 mb-5">
              <div className="flex items-center gap-2.5 bg-white border border-slate-200/90 px-3.5 py-2 rounded-xl shadow-2xs">
                <FaMapMarkerAlt className="text-[#126EFE] shrink-0 w-3.5 h-3.5" />
                <span>Bandung, Indonesia</span>
              </div>

              <div className="flex items-center gap-2.5 bg-white border border-slate-200/90 px-3.5 py-2 rounded-xl shadow-2xs">
                <FaEnvelope className="text-[#126EFE] shrink-0 w-3.5 h-3.5" />
                <a href="mailto:info@nexcube.digital" className="hover:text-[#126EFE] transition-colors truncate">
                  info@nexcube.digital
                </a>
              </div>

              <div className="flex items-center gap-2.5 bg-blue-50/80 border border-blue-100 px-3.5 py-2 rounded-xl text-[#126EFE]">
                <FaClock className="shrink-0 w-3.5 h-3.5" />
                <span>Respon Cepat &lt; 15 Menit</span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Bar Footer */}
        <div className="border-t border-slate-200/90 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <div className="text-xs text-slate-500 font-medium text-center md:text-left">
              © {currentYear} <span className="font-extrabold text-slate-800">NexCube Digital Indonesia</span>. Hak Cipta Dilindungi.
            </div>

            {/* Badges & Trust */}
            <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <FaShieldAlt className="w-3 h-3" />
                <span>SSL Encrypted</span>
              </div>

              <div className="flex items-center gap-1.5 text-[#126EFE] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                <FaRocket className="w-3 h-3" />
                <span>React & Vite Tech</span>
              </div>

              <div className="flex items-center gap-4 pl-2 text-slate-400">
                <Link to="/privacy" className="hover:text-[#126EFE] transition-colors">
                  Privasi
                </Link>
                <span>•</span>
                <Link to="/terms" className="hover:text-[#126EFE] transition-colors">
                  Ketentuan
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
};
