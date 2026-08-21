import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '../components/layout/Layout';
import { PricingCard } from '../ui/PricingCard';
import { pricingData } from '../data/pricingData';
import { FaBookOpen, FaArrowLeft, FaQrcode, FaSync, FaPalette, FaCoins, FaWhatsapp, FaChevronDown } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import apiClient, { getImageUrl } from '../services/api';

export const MenuKatalog: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchKatalogPackages = async () => {
      try {
        const res = await apiClient.getPackages('katalog');
        if (res && res.data && res.data.length > 0) {
          setPackages(res.data);
        }
      } catch (e) {
        console.error('Failed to load katalog packages from backend', e);
      }
    };
    fetchKatalogPackages();
  }, []);

  const resolveImageSource = (pkg: any): string => {
    if (!pkg) return '';
    let imageCandidate = '';
    if (Array.isArray(pkg.images) && pkg.images.length > 0) {
      const firstImg = pkg.images[0];
      imageCandidate = typeof firstImg === 'string' ? firstImg : (firstImg?.url || firstImg?.path || firstImg?.src || '');
    } else if (typeof pkg.images === 'string' && pkg.images.trim()) {
      const rawImages = pkg.images.trim();
      if (rawImages.startsWith('[') || rawImages.startsWith('{')) {
        try {
          const parsed = JSON.parse(rawImages);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const firstImg = parsed[0];
            imageCandidate = typeof firstImg === 'string' ? firstImg : (firstImg?.url || firstImg?.path || '');
          }
        } catch {
          imageCandidate = rawImages;
        }
      } else {
        imageCandidate = rawImages;
      }
    } else if (pkg.image) {
      imageCandidate = typeof pkg.image === 'string' ? pkg.image : (pkg.image?.url || pkg.image?.path || '');
    }

    if (!imageCandidate) return '';
    if (imageCandidate.startsWith('/images/') || imageCandidate.startsWith('http')) return imageCandidate;
    return getImageUrl(imageCandidate);
  };

  const katalogPricing = packages.length > 0
    ? packages
    : pricingData.filter(item => ['silver', 'gold', 'platinum'].includes(item.id));

  const benefits = [
    { title: 'Tampilan Interaktif', icon: <FaPalette className="w-5 h-5 text-[#126EFE]" />, description: 'Desain menarik & memikat untuk meningkatkan minat pesan pelanggan' },
    { title: 'Mudah Diperbarui', icon: <FaSync className="w-5 h-5 text-[#FBA41C]" />, description: 'Update harga & stok produk kapan saja tanpa perlu cetak ulang' },
    { title: 'Akses Scan QR Code', icon: <FaQrcode className="w-5 h-5 text-emerald-500" />, description: 'Pelanggan tinggal scan QR untuk langsung melihat menu di HP' },
    { title: 'Hemat Biaya Cetak', icon: <FaCoins className="w-5 h-5 text-purple-500" />, description: 'Solusi ramah lingkungan & hemat biaya operasional cetak kertas' }
  ];

  const faqs = [
    {
      q: 'Bagaimana cara pelanggan mengakses menu QR?',
      a: 'Kami memberikan barcode QR siap cetak yang bisa dipasang di meja resto atau standing akrilik. Tamu tinggal mengarahkan kamera HP untuk membuka menu.'
    },
    {
      q: 'Apakah bisa mengupdate foto dan harga makanan sendiri?',
      a: 'Bisa! Anda diberikan akses admin untuk mengubah daftar menu, foto, harga, dan status stok (tersedia/habis) secara realtime.'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 via-white to-slate-50/50 pt-28 pb-16 overflow-hidden">
        <Helmet>
          <title>Paket Katalog Digital & Menu QR - NexCube Digital</title>
          <meta name="description" content="Layanan pembuatan menu digital, katalog produk, dan pricelist interaktif untuk restoran dan e-commerce bisnis Anda." />
        </Helmet>
        
        <div className="container mx-auto px-4 md:px-6 max-w-6xl relative">
          
          {/* Header */}
          <div className={`text-center max-w-3xl mx-auto mb-12 space-y-3 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}>
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-600 shadow-xs">
              <FaBookOpen className="w-3.5 h-3.5" />
              <span>KATALOG PRODUK & QR MENU</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Paket Menu & <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">Katalog Digital</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Tingkatkan pengalaman pemesanan pelanggan dengan sistem menu QR online untuk resto/cafe dan katalog produk interaktif untuk bisnis Anda.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-200'}`}>
            {katalogPricing.map((tier, index) => {
              const isBackendPkg = !!tier.id && !!tier.title;
              const title = tier.title || tier.name || `Paket ${index + 1}`;
              const price = tier.price || '';
              const featuresList = tier.features || [];
              const includesList = tier.includes || [];
              const imageSrc = resolveImageSource(tier);
              const hot = tier.hot || tier.popular || false;
              const detailUrl = isBackendPkg ? `/paket/katalog/${tier.id}` : `/paket/${tier.id}`;

              return (
                <div key={tier.id || index} className="h-full">
                  <PricingCard 
                    tier={title}
                    price={price}
                    features={featuresList}
                    includes={includesList}
                    imageSrc={imageSrc}
                    accent={tier.accent}
                    badge={tier.badge}
                    popular={hot}
                    detailUrl={detailUrl}
                    onOrder={() => {
                      addItem({
                        id: tier.id || `katalog-${index}`,
                        name: `Katalog Digital - ${title}`,
                        price: typeof tier.rawPrice === 'number'
                          ? tier.rawPrice
                          : parseInt(String(tier.price || '0').replace(/\D/g, '')) || 0,
                        quantity: 1,
                        description: `Katalog Digital - ${tier.badge || ''}`,
                      });
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Benefit Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
            {benefits.map((b, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto">
                  {b.icon}
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">{b.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{b.description}</p>
              </div>
            ))}
          </div>

          {/* FAQ Accordion Section */}
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm max-w-4xl mx-auto space-y-6 mb-16">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg sm:text-xl border-b border-slate-100 pb-4">
              <HiSparkles className="text-[#FBA41C] w-5 h-5" />
              <h2>Pertanyaan Umum Menu & Katalog QR</h2>
            </div>
            
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <details key={idx} className="group border border-slate-100 rounded-2xl p-4 transition-colors hover:bg-slate-50/80">
                  <summary className="flex justify-between items-center font-bold text-slate-800 text-xs sm:text-sm cursor-pointer list-none">
                    <span>{faq.q}</span>
                    <FaChevronDown className="w-3.5 h-3.5 text-emerald-600 transition-transform group-open:rotate-180 shrink-0 ml-2" />
                  </summary>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-3 pt-3 border-t border-slate-100 font-medium">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Bottom WhatsApp Callout */}
          <div className="bg-gradient-to-r from-[#126EFE] via-blue-600 to-blue-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden space-y-4 text-center max-w-4xl mx-auto">
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#FBA41C]/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-amber-300">
              <HiSparkles className="w-3.5 h-3.5 text-[#FBA41C]" />
              <span>DIGITALISASI MENU & PRODUK ANDA</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Siap Bikin QR Menu & Katalog Produk?
            </h3>

            <div className="pt-2">
              <a 
                href="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20tentang%20pembuatan%20katalog%20menu%20digital"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#FBA41C] hover:bg-[#e08d07] text-slate-900 font-extrabold px-7 py-3 rounded-2xl text-xs sm:text-sm shadow-lg transition-all duration-200 hover:scale-105 active:scale-98 cursor-pointer"
              >
                <FaWhatsapp className="w-4 h-4 text-slate-900" />
                <span>Konsultasi Gratis via WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default MenuKatalog;
