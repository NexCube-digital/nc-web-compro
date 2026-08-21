import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PricingCard } from '../ui/PricingCard';
import { pricingData } from '../data/pricingData';
import { Layout } from '../components/layout/Layout';
import { FaGlobe, FaArrowLeft, FaChevronDown } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import apiClient, { getImageUrl } from '../services/api';

export const Website: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Fetch website packages from backend
  useEffect(() => {
    const fetchWebsitePackages = async () => {
      try {
        const res = await apiClient.getPackages('website');
        if (res && res.data && res.data.length > 0) {
          setPackages(res.data);
        }
      } catch (e) {
        console.error('Failed to load website packages from backend', e);
      }
    };
    fetchWebsitePackages();
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

  const websitePricing = packages.length > 0
    ? packages
    : pricingData.filter(item => ['student', 'bronze', 'silver', 'gold', 'platinum'].includes(item.id));

  const faqs = [
    {
      q: 'Apa perbedaan utama antar paket website?',
      a: 'Perbedaan utama mencakup kapasitas halaman, fitur integrasi admin (WP/CPanel), domain gratis (.my.id, .com, .co.id), email bisnis, serta kuota pembuatan konten foto/video.'
    },
    {
      q: 'Apakah ada biaya tersembunyi setelah pengerjaan?',
      a: 'Tidak ada biaya tersembunyi. Harga yang tercantum sudah termasuk sewa domain dan hosting untuk tahun pertama serta garansi perbaikan bug.'
    },
    {
      q: 'Berapa lama waktu pengerjaan website?',
      a: 'Waktu pengerjaan berkisar antara 2 hari hingga 3 minggu tergantung paket yang dipilih dan kelengkapan materi dari Anda.'
    },
    {
      q: 'Bagaimana jika bisnis saya membutuhkan fitur kustom?',
      a: 'Kami menyediakan layanan pengembangan website custom penuh. Anda bisa berkonsultasi gratis dengan tim developer kami melalui WhatsApp.'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50/40 via-white to-slate-50/50 pt-28 lg:pt-32 pb-16 overflow-hidden">
        <Helmet>
          <title>Paket Website Premium - NexCube Digital</title>
          <meta name="description" content="Pilihan paket website NexCube Digital mulai dari paket mahasiswa hingga platinum untuk kebutuhan bisnis Anda" />
        </Helmet>

        <div className="container mx-auto px-4 md:px-6 max-w-6xl relative">
          
          {/* Header */}
          <div className={`text-center max-w-3xl mx-auto mb-12 space-y-3 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}>
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#126EFE] shadow-xs">
              <FaGlobe className="w-3.5 h-3.5" />
              <span>WEBSITE PREMIUM & SEO FRIENDLY</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Paket Pembuatan <span className="bg-gradient-to-r from-[#126EFE] via-blue-600 to-[#FBA41C] bg-clip-text text-transparent">Website</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Pilih paket sesuai kebutuhan bisnis Anda — dari paket mahasiswa, UMKM, hingga solusi lengkap skala enterprise.
            </p>
          </div>

          {/* Pricing Grid - Spacious 3 Columns Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-200'}`}>
            {websitePricing.map((tier, index) => {
              const isBackendPkg = !!tier.id && !!tier.title;
              const title = tier.title || tier.name || `Paket ${index + 1}`;
              const price = tier.price || '';
              const features = tier.features || [];
              const includes = tier.includes || [];
              const imageSrc = resolveImageSource(tier);
              const hot = tier.hot || tier.popular || false;
              const detailUrl = isBackendPkg ? `/paket/website/${tier.id}` : `/paket/${tier.id}`;

              return (
                <div key={tier.id || index} className="h-full">
                  <PricingCard 
                    tier={title}
                    price={price}
                    features={features}
                    includes={includes}
                    imageSrc={imageSrc}
                    accent={tier.accent}
                    badge={tier.badge}
                    popular={hot}
                    detailUrl={detailUrl}
                    onOrder={() => {
                      addItem({
                        id: tier.id || `website-${index}`,
                        name: title,
                        price: typeof tier.rawPrice === 'number'
                          ? tier.rawPrice
                          : parseInt(String(tier.price || '0').replace(/\D/g, '')) || 0,
                        quantity: 1,
                        description: `Website - ${tier.badge || ''}`,
                      });
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* FAQ Accordion Section */}
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg sm:text-xl border-b border-slate-100 pb-4">
              <HiSparkles className="text-[#FBA41C] w-5 h-5" />
              <h2>Pertanyaan Umum Tentang Paket Website</h2>
            </div>
            
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <details key={idx} className="group border border-slate-100 rounded-2xl p-4 transition-colors hover:bg-slate-50/80">
                  <summary className="flex justify-between items-center font-bold text-slate-800 text-xs sm:text-sm cursor-pointer list-none">
                    <span>{faq.q}</span>
                    <FaChevronDown className="w-3.5 h-3.5 text-[#126EFE] transition-transform group-open:rotate-180 shrink-0 ml-2" />
                  </summary>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-3 pt-3 border-t border-slate-100 font-medium">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Website;
