import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getPricingTierById } from '../data/pricingData';
import { Layout } from '../components/layout/Layout';

// Enhanced paket data with detailed information
const paketDetailData = {
  student: {
    title: 'Student',
    price: 'Rp 300.000',
    description: 'Paket khusus untuk mahasiswa dengan kebutuhan digital sederhana',
    includes: [
        '✔️Harga Include Domain dan Hosting.',
        '❌Akses WP Admin.',
        '❌Akses C-Panel.',
        '✔️Halaman Maks. 2 Menu/Artikel.',
        '❌Bonus Halaman Menu/Artikel.',
        '✔️Gratis Pembuatan Konten.',
        '❌Gratis Design Logo.',
        '✔️Gratis Domain .my.id.',
        '❌Gratis E-mail bisnis.',
        '✔️10 Foto Quota Kerja.',
        '❌Video Quota Kerja.',
        '✔️Gratis SSL 1 Tahun.',
        '✔️Loading Cepat.',
        '✔️Halaman Responsif.',
        '✔️Mobile Friendly.',
        '✔️Terintegrasi Dengan WhatsApp dan Telpon.',
        '✔️Terintegrasi Dengan Media Sosial.',
        '✔️Standar Kontak Form.',
        '✔️1 Kali Revisi.',
        '✔️Garansi 6 Bulan.',
    ],
    benefits: [
      'Setup cepat dalam 2 hari kerja',
      'Template responsif',
      'Optimasi untuk pencarian Google'
    ],
    idealFor: 'Mahasiswa, portofolio personal, atau project tugas kuliah',
    timeline: '2-3 hari pengerjaan',
    process: [
      'Konsultasi kebutuhan',
      'Pemilihan template',
      'Implementasi konten',
      'Review dan revisi',
      'Deployment'
    ],
    color: 'bg-gradient-to-br from-blue-50 to-white',
    specialRequirement: '* Perlu menunjukkan kartu mahasiswa aktif'
  },
  bronze: {
    title: 'Bronze',
    price: 'Rp 800.000',
    description: 'Paket dasar untuk kebutuhan online sederhana',
    includes: [
        '✔️Harga Include Domain dan Hosting.',
        '❌Akses WP Admin.',
        '❌Akses C-Panel.',
        '✔️Halaman Maks. 3 Menu/Artikel.',
        '✔️Bonus 1 Halaman Menu/Artikel.',
        '✔️Gratis Pembuatan Konten.',
        '✔️Gratis Design Logo.',
        '✔️Gratis Domain .web.id.',
        '❌Gratis E-mail bisnis.',
        '✔️30 Foto Quota Kerja.',
        '❌Video Quota Kerja.',
        '✔️Gratis SSL 1 Tahun.',
        '✔️Loading Cepat.',
        '✔️Halaman Responsif.',
        '✔️Mobile Friendly.',
        '✔️Terintegrasi Dengan WhatsApp dan Telpon.',
        '✔️Terintegrasi Dengan Media Sosial.',
        '✔️Standar Kontak Form.',
        '✔️Revisi Gratis Sepuasnya.',
        '✔️Garansi Selama Berlangganan.',
    ],
    benefits: [
      'Setup cepat dalam 3 hari kerja',
      'Responsive design',
      'Optimasi untuk mobile'
    ],
    idealFor: 'UMKM kecil, event personal, atau portofolio sederhana',
    timeline: '1 minggu pengerjaan',
    process: [
      'Konsultasi awal',
      'Pembuatan wireframe',
      'Desain dan pengembangan',
      'Review dan revisi',
      'Deployment'
    ],
    color: 'bg-slate-50'
  },
  silver: {
    title: 'Silver',
    price: 'Rp 1.200.000',
    description: 'Paket menengah untuk website yang lebih lengkap',
    includes: [
        '✔️Harga Include Domain dan Hosting.',
        '✔️Akses WP Admin.',
        '❌Akses C-Panel.',
        '✔️Halaman Maks. 5 Menu/Artikel.',
        '✔️Bonus 1 Halaman Menu/Artikel.',
        '✔️Gratis Pembuatan Konten.',
        '✔️Gratis Design Logo.',
        '✔️Gratis Domain .com/.id.',
        '✔️Gratis E-mail bisnis.',
        '✔️50 Foto Quota Kerja.',
        '✔️1 Video Quota Kerja.',
        '✔️Gratis SSL 1 Tahun.',
        '✔️Loading Cepat.',
        '✔️Halaman Responsif.',
        '✔️Mobile Friendly.',
        '✔️Terintegrasi Dengan WhatsApp dan Telpon.',
        '✔️Terintegrasi Dengan Media Sosial.',
        '✔️Standar Kontak Form.',
        '✔️Revisi Gratis Sepuasnya.',
        '✔️Garansi Selama Berlangganan.',
    ],
    benefits: [
      'Setup dalam 5 hari kerja',
      'SEO dasar',
      'Integrasi dengan sosial media',
      'Analytics dasar'
    ],
    idealFor: 'Bisnis kecil menengah, toko online sederhana, atau event perusahaan',
    timeline: '2 minggu pengerjaan',
    process: [
      'Konsultasi detail kebutuhan',
      'Wireframe dan sitemap',
      'Desain UI/UX',
      'Pengembangan front-end',
      'Review dan revisi (2 tahap)',
      'Deployment dan training dasar'
    ],
    color: 'bg-white'
  },
  gold: {
    title: 'Gold',
    price: 'Rp 2.000.000',
    description: 'Paket premium untuk website profesional dan katalog digital',
    includes: [
        '✔️Harga Include Domain dan Hosting.',
        '✔️Akses WP Admin.',
        '✔️Akses C-Panel.',
        '✔️Halaman Maks. 10 Menu/Artikel.',
        '✔️Bonus 1 Halaman Menu/Artikel.',
        '✔️Gratis Pembuatan Konten.',
        '✔️Gratis Design Logo.',
        '✔️Gratis Domain .com/.id/.co.id.',
        '✔️Gratis E-mail bisnis.',
        '✔️90 Foto Quota Kerja.',
        '✔️3 Video Quota Kerja.',
        '✔️Gratis SSL 1 Tahun.',
        '✔️Loading Cepat.',
        '✔️Halaman Responsif.',
        '✔️Mobile Friendly.',
        '✔️Terintegrasi Dengan WhatsApp dan Telpon.',
        '✔️Terintegrasi Dengan Media Sosial.',
        '✔️Standar Kontak Form.',
        '✔️Revisi Gratis Sepuasnya.',
        '✔️Garansi Selama Berlangganan.',
    ],
    benefits: [
      'Custom design',
      'CMS dasar',
      'Optimasi performa',
      'Integrasi form dan email',
      'Security dasar'
    ],
    idealFor: 'Bisnis menengah, toko online dengan katalog produk, atau website perusahaan',
    timeline: '3-4 minggu pengerjaan',
    process: [
      'Workshop kebutuhan',
      'Research competitor',
      'Wireframe dan prototype interaktif',
      'Desain UI/UX custom',
      'Pengembangan front-end dan back-end',
      'Review dan revisi (3 tahap)',
      'Testing dan QA',
      'Deployment dan training'
    ],
    color: 'bg-gradient-to-br from-gold-light to-white'
  },
  platinum: {
    title: 'None',
    price: 'Rp 5.000.000',
    description: 'Paket premium lengkap untuk solusi digital skala penuh',
    includes: [
        '✔️Harga Include Domain dan Hosting.',
        '✔️Akses WP Admin.',
        '✔️Akses C-Panel.',
        '✔️Halaman (Sesuai Kebutuhan).',
        '✔️Gratis Pembuatan Konten.',
        '✔️Gratis Design Logo.',
        '✔️Gratis Domain .com/.id/.co.id.',
        '✔️Gratis E-mail bisnis.',
        '✔️Foto Quota Kerja (Sesuai Kebutuhan).',
        '✔️Video Quota Kerja (Sesuai Kebutuhan).',
        '✔️Gratis SSL 1 Tahun.',
        '✔️Loading Cepat.',
        '✔️Halaman Responsif.',
        '✔️Mobile Friendly.',
        '✔️Terintegrasi Dengan WhatsApp dan Telpon.',
        '✔️Terintegrasi Dengan Media Sosial.',
        '✔️Standar Kontak Form.',
        '✔️Revisi Gratis Sepuasnya.',
        '✔️Garansi Selama Berlangganan.',
    ],
    benefits: [
      'Fully custom design',
      'CMS lengkap',
      'Integrasi sistem pembayaran',
      'SEO menengah',
      'Security premium',
      'Performance optimization',
      'Multi-language option'
    ],
    idealFor: 'Perusahaan besar, e-commerce penuh, atau solusi digital enterprise',
    timeline: '6-8 minggu pengerjaan',
    process: [
      'Workshop dan discovery',
      'UX research',
      'Wireframing dan prototyping',
      'Design system',
      'UI/UX custom',
      'Front-end development',
      'Back-end integration',
      'Payment gateway setup',
      'Testing dan QA menyeluruh',
      'Deployment dan training lengkap',
      'Support dan maintenance plan'
    ],
    color: 'bg-gradient-to-br from-slate-800 to-slate-850 text-white'
  }
};

// Normalize include item which may be a string (with ✔️/❌) or an object { included, text }
type RawInclude = string | { included?: boolean; text?: string };
const getIncludeText = (item: RawInclude) => {
  if (typeof item === 'string') {
    return item.replace(/^✔️|^❌/, '').trim();
  }
  return (item.text || '').trim();
};

const processIncludeItem = (item: RawInclude) => {
  if (typeof item === 'string') {
    const trimmed = item.trim();
    if (trimmed.startsWith('✔️')) return { included: true, text: trimmed.replace('✔️', '').trim() };
    if (trimmed.startsWith('❌')) return { included: false, text: trimmed.replace('❌', '').trim() };
    return { included: true, text: trimmed };
  }
  return { included: Boolean(item.included ?? true), text: item.text || '' };
};

// Helper function to determine card color based on tier title
const getTierColor = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('student')) return 'bg-gradient-to-br from-blue-50 to-white';
  if (lowerTitle.includes('bronze')) return 'bg-slate-50';
  if (lowerTitle.includes('silver')) return 'bg-white';
  if (lowerTitle.includes('gold')) return 'bg-gradient-to-br from-gold-light to-white';
  if (lowerTitle.includes('platinum') || lowerTitle.includes('diamond') || lowerTitle.includes('enterprise')) {
    return 'bg-gradient-to-br from-slate-800 to-slate-850 text-white';
  }
  return 'bg-white';
};

export const PaketDetail: React.FC = () => {
  // Support routes: /paket/:tier  OR /paket/:category/:id
  const params = useParams<{ tier?: string; id?: string }>();
  const location = useLocation()
  const tierParam = params.tier || ''
  const idParam = params.id || ''
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // State for backend-driven package detail
  const [remotePackage, setRemotePackage] = useState<any | null>(null)

  // Get basic pricing info from shared data (tier-based fallback)
  const basicPaketInfo = getPricingTierById(tierParam || '') || null;

  // When an ID is present, fetch package from backend; otherwise try to map tier to local detail
  useEffect(() => {
    const load = async () => {
      if (idParam) {
        try {
          const res = await (await import('../services/api')).default.getPackage(idParam)
          if (res && res.success && res.data) {
            setRemotePackage(res.data)
          }
        } catch (e) {
          console.error('Failed to fetch package detail from backend', e)
        }
      }
    }
    load()
  }, [idParam, tierParam, location.pathname])

  // Determine paket to render: prefer remotePackage, then local detailed mapping by tier, then basic info
  const detailedPaketInfo = !idParam ? paketDetailData[tierParam as keyof typeof paketDetailData] : null

  const paket = remotePackage ? {
    title: remotePackage.title || remotePackage.name || 'Paket',
    price: remotePackage.price || '',
    description: remotePackage.description || 'Detail paket tidak tersedia',
    includes: remotePackage.includes || [],
    benefits: remotePackage.benefits || remotePackage.features || [],
    idealFor: remotePackage.idealFor || 'Berbagai kebutuhan digital',
    timeline: remotePackage.timeline || '1-2 minggu pengerjaan',
    process: remotePackage.process || [
      'Konsultasi kebutuhan',
      'Desain dan pengembangan',
      'Review dan revisi',
      'Deployment'
    ],
    color: remotePackage.color || getTierColor(remotePackage.title || remotePackage.name || ''),
    hot: remotePackage.hot
  } : detailedPaketInfo ? {
    ...detailedPaketInfo,
    hot: undefined
  } : {
    title: basicPaketInfo?.title || 'Paket Tidak Ditemukan',
    price: basicPaketInfo?.price || '',
    description: basicPaketInfo?.description || 'Detail paket tidak tersedia',
    includes: [],
    benefits: [],
    idealFor: '',
    timeline: '',
    process: [],
    color: basicPaketInfo?.accent || 'bg-white',
    hot: undefined
  };
  
  const isSpecialTier = Boolean(paket.color && String(paket.color).includes('from-slate-800'));
  const isGoldTier = tierParam === 'gold';

  // (Optional) We could group includes here if desired. For now normalize texts when rendering.

  // Compute a sensible back link: prefer category/tier when present
  const backLink = tierParam ? `/paket/${tierParam}` : '/paket/website';

  return (
    <Layout>
      <div className="min-h-screen py-8 sm:py-16 bg-gradient-to-b from-slate-50/50 to-white">
        <Helmet>
          <title>Paket {paket.title} - NexCube Digital</title>
          <meta name="description" content={`Detail paket ${paket.title} - ${paket.description}`} />
        </Helmet>

        <div className="container">
          <Link to="/paket/website" className={`inline-flex items-center text-accent mb-6 sm:mb-8 hover:underline transition-all group text-sm sm:text-base ${!isLoaded ? 'opacity-0' : 'animate-fadeInLeft'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 group-hover:-translate-x-1 transition-transform">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Kembali ke Daftar Paket
          </Link>

          <div className={`rounded-xl shadow-premium p-6 sm:p-8 md:p-12 ${paket.color} ${!isLoaded ? 'opacity-0' : 'animate-scaleIn delay-200'}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 pb-6 sm:pb-8 border-b border-slate-200/30">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className={`text-2xl sm:text-3xl font-heading font-semibold mb-2 sm:mb-4 ${isSpecialTier ? 'text-white' : ''}`}>Paket {paket.title}</h1>
                  {paket.hot && (
                    <span className={`inline-block text-xs font-semibold px-2 py-1 rounded ${isSpecialTier ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'}`}>
                      HOT
                    </span>
                  )}
                </div>
                <p className={`${isSpecialTier ? 'text-slate-300' : 'text-slate-500'} text-base sm:text-lg`}>{paket.description}</p>
              </div>
              <div className={`text-2xl sm:text-3xl md:text-4xl font-bold ${isSpecialTier ? 'text-white' : isGoldTier ? 'text-gold' : 'text-accent'}`}>
                {paket.price}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
              <div>
                <h2 className={`text-xl font-heading font-semibold mb-6 ${isSpecialTier ? 'text-white' : ''}`}>Fitur Paket</h2>
                
                <div className="space-y-6">
                  {Array.isArray(paket.includes) && paket.includes.map((item: RawInclude, index: number) => {
                    const { included, text } = processIncludeItem(item);
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <span className={`flex-shrink-0 inline-flex mt-0.5 items-center justify-center w-5 h-5 rounded-full ${
                          included ? 
                            (isSpecialTier ? 'bg-white/30 text-white' : 'bg-green-100 text-green-600') : 
                            (isSpecialTier ? 'bg-white/10 text-white/60' : 'bg-red-50 text-red-400')
                        }`}>
                          {included ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          )}
                        </span>
                        <span className={`${isSpecialTier ? 'text-white' : ''} ${!included ? 'text-opacity-70' : ''}`}>
                          {text}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className={`mt-10 p-4 rounded-lg ${isSpecialTier ? 'bg-white/10 text-white/90' : 'bg-slate-50 text-slate-600'}`}>
                  <strong>Ideal untuk:</strong> {paket.idealFor}
                </div>
              </div>

              <div>
                <div className="mb-10">
                  <h2 className={`text-xl font-heading font-semibold mb-6 ${isSpecialTier ? 'text-white' : ''}`}>Benefit Tambahan</h2>
                  <ul className="space-y-3">
                    {paket.benefits.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className={`inline-flex mt-1 items-center justify-center w-5 h-5 rounded-full ${
                          isSpecialTier ? 'bg-white/20' : 'bg-gold-light/30'
                        }`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isSpecialTier ? 'white' : '#c8a355'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></path>
                          </svg>
                        </span>
                        <span className={isSpecialTier ? 'text-white' : ''}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className={`text-xl font-heading font-semibold mb-6 ${isSpecialTier ? 'text-white' : ''}`}>Timeline & Proses</h2>
                  <div className={`p-4 mb-6 rounded-lg ${isSpecialTier ? 'bg-white/10' : 'bg-slate-50'}`}>
                    <p className={`font-medium ${isSpecialTier ? 'text-white' : 'text-slate-700'}`}>
                      {paket.timeline}
                    </p>
                  </div>
                  
                  <ol className={`relative border-l ${isSpecialTier ? 'border-white/30' : 'border-slate-200'} space-y-6 pl-6`}>
                    {paket.process.map((step: string, index: number) => (
                      <li key={index} className="relative">
                        <div className={`absolute -left-[31px] flex items-center justify-center w-6 h-6 rounded-full bg-white ${isSpecialTier ? 'border-2 border-white/70' : 'border-2 border-accent'}`}>
                          <span className={`text-xs font-medium ${isSpecialTier ? 'text-slate-800' : 'text-accent'}`}>{index + 1}</span>
                        </div>
                        <p className={`font-medium ${isSpecialTier ? 'text-white' : ''}`}>{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link 
                to="/contact" 
                className={`btn-primary text-center flex-1 max-w-full sm:max-w-xs mx-auto sm:mx-0 ${
                  isSpecialTier ? 'bg-white text-slate-800 hover:bg-white/90' : ''
                }`}
              >
                Pesan Paket Ini
              </Link>
              <Link 
                to="/contact" 
                className={`btn-secondary text-center flex-1 max-w-full sm:max-w-xs mx-auto sm:mx-0 ${
                  isSpecialTier ? 'border-white/30 text-white hover:border-white/80' : ''
                }`}
              >
                Konsultasi Kebutuhan Custom
              </Link>
            </div>
          </div>
          
          <div className={`mt-12 bg-white p-6 md:p-10 rounded-xl shadow-card ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-500'}`}>
            {/* FAQ section with accordion */}
            <h2 className="text-xl font-heading font-semibold mb-6">Pertanyaan Umum tentang Paket {paket.title}</h2>
            
            <div className="space-y-4">
              <details className="group border-b pb-4">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span>Berapa lama waktu pengerjaan paket {paket.title}?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" width="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </summary>
                <p className="text-slate-500 mt-4">
                  {paket.timeline}. Timeline ini bisa bervariasi tergantung dari kompleksitas kebutuhan spesifik Anda.
                </p>
              </details>
              
              <details className="group border-b pb-4">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span>Apakah revisi termasuk dalam harga?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" width="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </summary>
                <p className="text-slate-500 mt-4">
                  Ya, paket {paket.title} sudah termasuk {(
                    Array.isArray(paket.includes)
                      ? paket.includes.find((it: RawInclude) => getIncludeText(it).toLowerCase().includes('revisi'))
                      : null
                  ) || '2 revisi'}.
                </p>
              </details>
              
              <details className="group border-b pb-4">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span>Apakah ada biaya pemeliharaan bulanan?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" width="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </summary>
                <p className="text-slate-500 mt-4">
                  Biaya dalam paket mencakup pengembangan dan periode support awal. Untuk pemeliharaan jangka panjang, kami menawarkan paket maintenance terpisah yang dapat disesuaikan dengan kebutuhan Anda.
                </p>
              </details>
              
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span>Bagaimana proses pembayarannya?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" width="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </summary>
                <p className="text-slate-500 mt-4">
                  Kami menerapkan sistem pembayaran bertahap: 50% di awal sebagai down payment, dan 50% setelah proyek selesai sebelum deployment ke server produksi.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaketDetail;
