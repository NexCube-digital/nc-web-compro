import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '../components/layout/Layout';
import { PricingCard } from '../ui/PricingCard';
import { pricingData } from '../data/pricingData';
import { FaEnvelopeOpenText, FaArrowLeft, FaCheckCircle, FaWhatsapp, FaMapMarkedAlt, FaImages, FaClock, FaChevronDown } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import apiClient, { getImageUrl } from '../services/api';

export const UndanganDigital: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchUndanganPackages = async () => {
      try {
        const res = await apiClient.getPackages('event');
        if (res && res.data && res.data.length > 0) {
          setPackages(res.data);
        }
      } catch (e) {
        console.error('Failed to load undangan packages from backend', e);
      }
    };
    fetchUndanganPackages();
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

  const undanganPricing = packages.length > 0
    ? packages
    : pricingData.filter(item => ['bronze', 'silver', 'gold'].includes(item.id));

  const features = [
    { title: 'RSVP & Ucapan Online', desc: 'Konfirmasi kehadiran otomatis & buku tamu ucapan langsung', icon: <FaCheckCircle className="text-emerald-500 w-4 h-4" /> },
    { title: 'Google Maps Location', desc: 'Peta lokasi venue terintegrasi navigasi sekali klik', icon: <FaMapMarkedAlt className="text-[#126EFE] w-4 h-4" /> },
    { title: 'Countdown Timer Acara', desc: 'Hitung mundur otomatis menuju hari bahagian Anda', icon: <FaClock className="text-[#FBA41C] w-4 h-4" /> },
    { title: 'Galeri Foto & Musik Background', desc: 'Tampilan album momen & musik pilihan elegan', icon: <FaImages className="text-purple-500 w-4 h-4" /> }
  ];

  const faqs = [
    {
      q: 'Berapa lama masa aktif undangan digital?',
      a: 'Masa aktif undangan digital berlaku selama 1 tahun sejak tanggal acara diselenggarakan.'
    },
    {
      q: 'Apakah bisa menambah galeri foto dan cerita cinta?',
      a: 'Bisa! Setiap paket undangan sudah termasuk fitur galeri foto HD dan bagian kisah perjalanan cinta (Our Story).'
    },
    {
      q: 'Bagaimana cara membagikan undangan ke tamu?',
      a: 'Anda akan mendapatkan link unik eksklusif yang bisa dikirimkan langsung ke daftar kontak WhatsApp, Instagram, atau grup keluarga.'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-slate-50/50 pt-28 pb-16 overflow-hidden">
        <Helmet>
          <title>Paket Undangan Digital E-Invitation - NexCube Digital</title>
          <meta name="description" content="Layanan pembuatan undangan digital interaktif untuk pernikahan, ulang tahun, dan acara perusahaan dengan fitur RSVP dan lokasi maps" />
        </Helmet>
        
        <div className="container mx-auto px-4 md:px-6 max-w-6xl relative">
          
          {/* Header */}

          {/* Header */}
          <div className={`text-center max-w-3xl mx-auto mb-12 space-y-3 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#FBA41C] shadow-xs">
              <FaEnvelopeOpenText className="w-3.5 h-3.5" />
              <span>E-INVITATION ELEGAN & INTERAKTIF</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Paket Undangan <span className="bg-gradient-to-r from-[#FBA41C] to-amber-600 bg-clip-text text-transparent">Digital</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Undangan digital interaktif dengan tampilan memukau untuk pernikahan, ulang tahun, & acara perusahaan. Praktis dibagikan via WhatsApp.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-200'}`}>
            {undanganPricing.map((tier, index) => {
              const isBackendPkg = !!tier.id && !!tier.title;
              const title = tier.title || tier.name || `Paket ${index + 1}`;
              const price = tier.price || '';
              const featuresList = tier.features || [];
              const includesList = tier.includes || [];
              const imageSrc = resolveImageSource(tier);
              const hot = tier.hot || tier.popular || false;
              const detailUrl = isBackendPkg ? `/paket/undangan/${tier.id}` : `/paket/${tier.id}`;

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
                    showDemoButton={true}
                    demoUrl={tier.link || tier.demoUrl}
                    onOrder={() => {
                      addItem({
                        id: tier.id || `undangan-${index}`,
                        name: `Undangan Digital - ${title}`,
                        price: typeof tier.rawPrice === 'number'
                          ? tier.rawPrice
                          : parseInt(String(tier.price || '0').replace(/\D/g, '')) || 0,
                        quantity: 1,
                        description: `Undangan Digital - ${tier.badge || ''}`,
                      });
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Feature Highlight Box */}
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm mb-16">
            <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4 mb-6">
              Keunggulan Undangan Digital NexCube
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feat, idx) => (
                <div key={idx} className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <div className="shrink-0">{feat.icon}</div>
                  <div className="font-extrabold text-xs sm:text-sm text-slate-900">{feat.title}</div>
                  <div className="text-xs text-slate-500 font-medium leading-relaxed">{feat.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Accordion Section */}
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm max-w-4xl mx-auto space-y-6 mb-16">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg sm:text-xl border-b border-slate-100 pb-4">
              <HiSparkles className="text-[#FBA41C] w-5 h-5" />
              <h2>Pertanyaan Umum Undangan Digital</h2>
            </div>
            
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <details key={idx} className="group border border-slate-100 rounded-2xl p-4 transition-colors hover:bg-slate-50/80">
                  <summary className="flex justify-between items-center font-bold text-slate-800 text-xs sm:text-sm cursor-pointer list-none">
                    <span>{faq.q}</span>
                    <FaChevronDown className="w-3.5 h-3.5 text-[#FBA41C] transition-transform group-open:rotate-180 shrink-0 ml-2" />
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
              <span>KONSULTASI UNDANGAN DIGITAL</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Konsultasikan Tanggal Acara Anda Sekarang
            </h3>

            <div className="pt-2">
              <a 
                href="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20tentang%20pembuatan%20undangan%20digital"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#FBA41C] hover:bg-[#e08d07] text-slate-900 font-extrabold px-7 py-3 rounded-2xl text-xs sm:text-sm shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer"
              >
                <FaWhatsapp className="w-4 h-4 text-slate-900" />
                <span>Pesan Undangan via WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default UndanganDigital;
