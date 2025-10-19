import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Template data untuk paket-paket
const paketData = {
  bronze: {
    title: 'Bronze',
    price: 'Rp 1.000.000',
    description: 'Paket dasar untuk kebutuhan online sederhana',
    includes: [
      'Landing page 1 halaman',
      'Template undangan dasar',
      '2 revisi',
      'Support 7 hari'
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
    price: 'Rp 2.500.000',
    description: 'Paket menengah untuk website yang lebih lengkap',
    includes: [
      'Website 3 halaman',
      'Undangan interaktif',
      'Desain 5 assets',
      'Support 14 hari'
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
    price: 'Rp 5.000.000',
    description: 'Paket premium untuk website profesional dan katalog digital',
    includes: [
      'Website 6 halaman',
      'Katalog digital',
      'SEO dasar',
      '10 revisi',
      'Support 30 hari'
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
    title: 'Platinum',
    price: 'Rp 12.000.000',
    description: 'Paket premium lengkap untuk solusi digital skala penuh',
    includes: [
      'Website custom',
      'E-commerce',
      'Integrasi pembayaran',
      'Desain premium',
      'Support prioritas 90 hari'
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

export const PaketDetail: React.FC = () => {
  const { tier = '' } = useParams<{ tier: string }>();
  const paket = paketData[tier as keyof typeof paketData] || {
    title: 'Paket Tidak Ditemukan',
    price: '',
    description: 'Detail paket tidak tersedia',
    includes: [],
    benefits: [],
    idealFor: '',
    timeline: '',
    process: [],
    color: 'bg-white'
  };
  
  const isSpecialTier = paket.color?.includes('from-slate-800') || false;
  const isGoldTier = tier === 'gold';

  return (
    <div className="min-h-screen py-8 sm:py-16 bg-gradient-to-b from-slate-50/50 to-white">
      <Helmet>
        <title>Paket {paket.title} - NexCube Digital</title>
        <meta name="description" content={`Detail paket ${paket.title} - ${paket.description}`} />
      </Helmet>

      <div className="container">
        <Link to="/#paket" className="inline-flex items-center text-accent mb-6 sm:mb-8 hover:underline transition-all group text-sm sm:text-base">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 group-hover:-translate-x-1 transition-transform">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Kembali ke Daftar Paket
        </Link>

        <div className={`rounded-xl shadow-premium p-6 sm:p-8 md:p-12 ${paket.color}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 pb-6 sm:pb-8 border-b border-slate-200/30">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-heading font-semibold mb-2 sm:mb-4 ${isSpecialTier ? 'text-white' : ''}`}>Paket {paket.title}</h1>
              <p className={`${isSpecialTier ? 'text-slate-300' : 'text-slate-500'} text-base sm:text-lg`}>{paket.description}</p>
            </div>
            <div className={`text-2xl sm:text-3xl md:text-4xl font-bold ${isSpecialTier ? 'text-white' : isGoldTier ? 'text-gold' : 'text-accent'}`}>
              {paket.price}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <h2 className={`text-xl font-heading font-semibold mb-6 ${isSpecialTier ? 'text-white' : ''}`}>Yang Termasuk</h2>
              <ul className="space-y-3">
                {paket.includes.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className={`inline-flex mt-1 items-center justify-center w-5 h-5 rounded-full ${
                      isSpecialTier ? 'bg-white/20' : isGoldTier ? 'bg-gold-light' : 'bg-accent/10'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isSpecialTier ? 'white' : '#0284c7'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                    <span className={isSpecialTier ? 'text-white' : ''}>{item}</span>
                  </li>
                ))}
              </ul>

              <h2 className={`text-xl font-heading font-semibold mt-12 mb-6 ${isSpecialTier ? 'text-white' : ''}`}>Benefit Tambahan</h2>
              <ul className="space-y-3">
                {paket.benefits.map((item, index) => (
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

              <div className={`mt-10 p-4 rounded-lg ${isSpecialTier ? 'bg-white/10 text-white/90' : 'bg-slate-50 text-slate-600'}`}>
                <strong>Ideal untuk:</strong> {paket.idealFor}
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-heading font-semibold mb-6 ${isSpecialTier ? 'text-white' : ''}`}>Timeline Pengerjaan</h2>
              <p className={`text-lg mb-8 ${isSpecialTier ? 'text-white/90' : ''}`}>{paket.timeline}</p>

              <h2 className={`text-xl font-heading font-semibold mb-6 ${isSpecialTier ? 'text-white' : ''}`}>Proses Pengerjaan</h2>
              <ol className={`relative border-l ${isSpecialTier ? 'border-white/30' : 'border-slate-200'} space-y-6 pl-6`}>
                {paket.process.map((step, index) => (
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
        
        <div className="mt-12 bg-white p-6 md:p-10 rounded-xl shadow-card">
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
                Ya, paket {paket.title} sudah termasuk {paket.includes.find(item => item.includes('revisi')) || '2 revisi'}.
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
  );
};

export default PaketDetail;
