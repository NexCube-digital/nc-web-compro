import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '../components/layout/Layout';
import { PricingCard } from '../ui/PricingCard';
import { pricingData } from '../data/pricingData';
import { FaPalette, FaArrowLeft, FaCheckCircle, FaWhatsapp, FaChevronDown } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import apiClient, { getImageUrl } from '../services/api';

export const DesainGrafis: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchDesainPackages = async () => {
      try {
        const res = await apiClient.getPackages('desain');
        if (res && res.data && res.data.length > 0) {
          setPackages(res.data);
        }
      } catch (e) {
        console.error('Failed to load desain packages from backend', e);
      }
    };
    fetchDesainPackages();
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

  const desainPricing = packages.length > 0
    ? packages
    : pricingData.filter(item => ['bronze', 'silver', 'gold', 'platinum'].includes(item.id));

  const portfolioItems = [
    {
      category: 'Branding & Identitas',
      items: [
        { title: 'Logo & Brand Guidelines', desc: 'Desain logo profesional & buku panduan identitas visual' },
        { title: 'Kartu Nama & Stasioneri', desc: 'Desain kartu nama, amplop & kop surat perusahaan' },
        { title: 'Kemasan & Sticker', desc: 'Desain kemasan produk & label stiker menarik' }
      ]
    },
    {
      category: 'Pemasaran & Konten',
      items: [
        { title: 'Social Media Feed & Story', desc: 'Konten visual Instagram, TikTok & Facebook kustom' },
        { title: 'Banner Iklan Digital', desc: 'Banner promo untuk website & iklan sosial media' },
        { title: 'Brosur, Flyer & Catalog', desc: 'Bahan promosi cetak & PDF digital berkualitas tinggi' }
      ]
    },
    {
      category: 'UI/UX & Digital Assets',
      items: [
        { title: 'UI/UX Mobile & Web App', desc: 'Desain antarmuka aplikasi & website yang intuitif' },
        { title: 'Infografis & Presentasi', desc: 'Visualisasi data & slide pitch deck profesional' },
        { title: 'Vektor & Ilustrasi Kustom', desc: 'Ilustrasi digital eksklusif untuk branding' }
      ]
    }
  ];

  const faqs = [
    {
      q: 'Format file apa saja yang akan saya dapatkan?',
      a: 'Anda mendapatkan master file lengkap seperti Vector AI/EPS/PSD, PDF siap cetak, serta file PNG/JPG resolusi tinggi (HD).'
    },
    {
      q: 'Berapa kali kesempatan revisi desain yang didapatkan?',
      a: 'Setiap paket sudah mencakup garansi revisi sepuasnya hingga hasil desain sesuai dengan visi branding bisnis Anda.'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-rose-50/30 via-white to-slate-50/50 pt-28 pb-16 overflow-hidden">
        <Helmet>
          <title>Paket Desain Grafis & Branding - NexCube Digital</title>
          <meta name="description" content="Jasa desain grafis premium untuk kebutuhan bisnis - logo, branding, social media content, UI/UX, marketing material, dan lainnya" />
        </Helmet>
        
        <div className="container mx-auto px-4 md:px-6 max-w-6xl relative">
          
          {/* Header */}
          <div className={`text-center max-w-3xl mx-auto mb-12 space-y-3 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}>
            <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-rose-600 shadow-xs">
              <FaPalette className="w-3.5 h-3.5" />
              <span>DESAIN GRAFIS & BRANDING HD</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Paket <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">Desain Grafis</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Tim desainer profesional kami siap memperkuat identitas visual & estetika branding bisnis Anda agar tampil unggul di pasaran.
            </p>
          </div>

          {/* Pricing Grid - 2 Columns (2 Banjar) on Mobile */}
          <div className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 mb-16 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-200'}`}>
            {desainPricing.map((tier, index) => {
              const isBackendPkg = !!tier.id && !!tier.title;
              const title = tier.title || tier.name || `Paket ${index + 1}`;
              const price = tier.price || '';
              const featuresList = tier.features || [];
              const includesList = tier.includes || [];
              const imageSrc = resolveImageSource(tier);
              const hot = tier.hot || tier.popular || false;
              const detailUrl = isBackendPkg ? `/paket/desain/${tier.id}` : `/paket/${tier.id}`;

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
                        id: tier.id || `desain-${index}`,
                        name: `Desain Grafis - ${title}`,
                        price: typeof tier.rawPrice === 'number'
                          ? tier.rawPrice
                          : parseInt(String(tier.price || '0').replace(/\D/g, '')) || 0,
                        quantity: 1,
                        description: `Desain Grafis - ${tier.badge || ''}`,
                      });
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Service Details Grid */}
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm mb-14 space-y-6">
            <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4">
              Cakupan Layanan Desain Kami
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {portfolioItems.map((cat, catIdx) => (
                <div key={catIdx} className="space-y-4">
                  <h3 className="font-bold text-base text-rose-600 border-b border-rose-100 pb-2">{cat.category}</h3>
                  <div className="space-y-4">
                    {cat.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="space-y-1">
                        <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                          <FaCheckCircle className="text-emerald-500 w-3.5 h-3.5 shrink-0" />
                          <span>{item.title}</span>
                        </div>
                        <p className="text-xs text-slate-500 pl-5 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Accordion Section */}
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm max-w-4xl mx-auto space-y-6 mb-16">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg sm:text-xl border-b border-slate-100 pb-4">
              <HiSparkles className="text-[#FBA41C] w-5 h-5" />
              <h2>Pertanyaan Umum Layanan Desain</h2>
            </div>
            
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <details key={idx} className="group border border-slate-100 rounded-2xl p-4 transition-colors hover:bg-slate-50/80">
                  <summary className="flex justify-between items-center font-bold text-slate-800 text-xs sm:text-sm cursor-pointer list-none">
                    <span>{faq.q}</span>
                    <FaChevronDown className="w-3.5 h-3.5 text-rose-600 transition-transform group-open:rotate-180 shrink-0 ml-2" />
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
              <span>KONSULTASI DESAIN BEBAS BIAYA</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Punya Proyek Desain & Branding Khusus?
            </h3>

            <div className="pt-2">
              <a 
                href="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20tentang%20layanan%20desain%20grafis"
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

export default DesainGrafis;
