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
      { name: 'Website Custom & SEO', href: '/paket/website' },
      { name: 'Undangan Digital', href: '/paket/undangan-digital' },
      { name: 'Desain Grafis', href: '/paket/desain-grafis' },
      { name: 'Katalog Digital', href: '/paket/menu-katalog' },
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

      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-12 md:py-16 relative z-10">
        
        {/* Main Footer Links Grid (Responsive 2-column grid on mobile) */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8 md:gap-10 pt-2 sm:pt-4">
          
          {/* Column 1: Brand Info & Status (Full Width on Mobile) */}
          <div className="col-span-2 md:col-span-1 space-y-3 sm:space-y-4">
            <Link to="/" className="inline-block">
              <img 
                src="/images/NexCube-full.png" 
                alt="NexCube Digital" 
                className="h-8 sm:h-10 w-auto object-contain"
              />
            </Link>

            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
              Studio kreatif digital premium yang menghadirkan solusi pembuatan website, desain grafis, undangan digital, dan katalog produk berstandar internasional.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-2 pt-1">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 sm:p-2.5 bg-white border border-slate-200/90 text-slate-700 rounded-xl shadow-xs transition-all duration-200 hover:-translate-y-1 ${social.color} cursor-pointer`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 4: Support & Contact Info (Full Width on Mobile) */}
          <div className="col-span-2 md:col-span-1 space-y-2.5 sm:space-y-4">
            <h3 className="font-extrabold text-slate-900 mb-2 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Hubungi Kami</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2 bg-white border border-slate-200/90 px-3 py-1.5 sm:py-2 rounded-xl shadow-2xs">
                <FaMapMarkerAlt className="text-[#126EFE] shrink-0 w-3.5 h-3.5" />
                <span>Jln. Bukit Jarian No. 30, Hegarmanah, Bandung, Jawa Barat, Indonesia</span>
              </div>

              <div className="flex items-center gap-2 bg-white border border-slate-200/90 px-3 py-1.5 sm:py-2 rounded-xl shadow-2xs">
                <FaEnvelope className="text-[#126EFE] shrink-0 w-3.5 h-3.5" />
                <a href="mailto:nexcubedigital@gmail.com" className="hover:text-[#126EFE] transition-colors truncate">
                  nexcubedigital@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Company (Col Span 1 on Mobile) */}
          <div className="col-span-1">
            <h3 className="font-extrabold text-slate-900 mb-2.5 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#126EFE]"></span>
              <span>Perusahaan</span>
            </h3>
            <ul className="space-y-2 sm:space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="group text-slate-600 hover:text-[#126EFE] transition-colors duration-200 text-xs sm:text-sm font-medium inline-flex items-center gap-1"
                  >
                    <FaChevronRight className="w-2 h-2 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#126EFE]" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services (Col Span 1 on Mobile) */}
          <div className="col-span-1">
            <h3 className="font-extrabold text-slate-900 mb-2.5 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBA41C]"></span>
              <span>Layanan Utama</span>
            </h3>
            <ul className="space-y-2 sm:space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="group text-slate-600 hover:text-[#126EFE] transition-colors duration-200 text-xs sm:text-sm font-medium inline-flex items-center gap-1"
                  >
                    <FaChevronRight className="w-2 h-2 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#126EFE]" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar Footer (Compact on Mobile) */}
        <div className="border-t border-slate-200/90 pt-5 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            
            {/* Copyright */}
            <div className="text-[11px] sm:text-xs text-slate-500 font-medium text-center md:text-left">
              © {currentYear} <span className="font-extrabold text-slate-800">NexCube Digital</span>. Hak Cipta Dilindungi.
            </div>

            {/* Badges & Trust */}
            <div className="flex flex-wrap justify-center items-center gap-2.5 sm:gap-4 text-[11px] sm:text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-3 text-slate-400">
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
