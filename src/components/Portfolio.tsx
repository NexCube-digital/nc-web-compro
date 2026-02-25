import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient, { Portfolio as PortfolioType, getImageUrl } from '../services/api'; // sesuaikan path import

// ── Helper: gradient & icon berdasarkan category ──────────────────────────────

const getCategoryGradient = (category: string): string => {
  const map: Record<string, string> = {
    website: 'from-emerald-500 to-teal-600',
    undangan: 'from-indigo-500 to-blue-600',
    desain: 'from-rose-500 to-pink-600',
    katalog: 'from-orange-500 to-amber-600',
    fotografi: 'from-violet-500 to-purple-600',
  };
  return map[category] ?? 'from-blue-500 to-cyan-600';
};

const getCategoryLabel = (category: string): string => {
  const map: Record<string, string> = {
    website: 'Website',
    undangan: 'Undangan Digital',
    desain: 'Desain Grafis',
    katalog: 'Katalog Digital',
    fotografi: 'Fotografi',
  };
  return map[category] ?? category;
};

const CategoryIcon: React.FC<{ category: string }> = ({ category }) => {
  switch (category) {
    case 'website':
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'undangan':
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case 'desain':
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      );
    case 'katalog':
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    default:
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
  }
};

// ── Main Component ────────────────────────────────────────────────────────────

export const Portfolio: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch dari API
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiClient.getPortfolios();
        if (response.success && response.data) {
          const sorted = [...response.data].sort((a, b) => a.id - b.id);
          setPortfolioItems(sorted);
        } else {
          setError(response.message || 'Gagal memuat portfolio');
        }
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan saat memuat portfolio');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  // Animasi masuk
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Daftar kategori dinamis dari data
  const categories = [
    'Semua',
    'Website',
    'Undangan Digital',
    'Desain Grafis',
    'Katalog Digital',
    'Fotografi',
  ];

  const filteredItems =
    selectedCategory === 'Semua'
      ? portfolioItems
      : portfolioItems.filter(
          (item) => getCategoryLabel(item.category) === selectedCategory
        );

  // ── Render: Loading ─────────────────────────────────────────────────────────
  const renderLoading = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-3xl overflow-hidden shadow-lg bg-white border border-white/50 animate-pulse">
          <div className="aspect-video bg-slate-200" />
          <div className="p-6 space-y-3">
            <div className="h-5 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );

  // ── Render: Error ───────────────────────────────────────────────────────────
  const renderError = () => (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">😕</div>
      <p className="text-slate-600 text-lg mb-4">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  );

  // ── Render: Empty ───────────────────────────────────────────────────────────
  const renderEmpty = () => (
    <div className="text-center py-16">
      <div className="text-5xl mb-4"></div>
      <p className="text-slate-600 text-lg">
        {selectedCategory === 'Semua'
          ? 'Belum ada portfolio yang tersedia.'
          : `Belum ada portfolio untuk kategori "${selectedCategory}".`}
      </p>
    </div>
  );

  // ── Render: Grid ────────────────────────────────────────────────────────────
  const renderGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      {filteredItems.map((item, index) => {
        const techList: string[] = item.technologies
          ? item.technologies.split(',').map((t) => t.trim())
          : [];
        const gradient = getCategoryGradient(item.category);
        const categoryLabel = getCategoryLabel(item.category);
        const imageUrl = getImageUrl(item.image);

        return (
          <a
            key={item.id}
            href={item.link || '#'}
            target={item.link ? '_blank' : '_self'}
            rel="noopener noreferrer"
            style={{ animationDelay: `${400 + index * 100}ms` }}
            className={`group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white border border-white/50 hover:-translate-y-2 ${
              !isLoaded ? 'opacity-0' : 'animate-fadeInUp'
            }`}
          >
            {/* Image */}
            <div className="relative overflow-hidden bg-slate-100 w-full aspect-video">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white`}>
                  <CategoryIcon category={item.category} />
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {techList.slice(0, 2).map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="inline-flex items-center gap-2 text-white font-bold px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-sm shadow-lg">
                    <span>Lihat Detail</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Category badge */}
              <div className={`absolute top-4 left-4 bg-gradient-to-r ${gradient} text-white px-4 py-2 rounded-full text-xs font-black shadow-lg`}>
                {categoryLabel}
              </div>

              {/* Featured badge */}
              {item.featured && (
                <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-black shadow-lg">
                  ⭐ Featured
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                  {item.client}
                </span>
                <div className="flex items-center gap-1 text-slate-400 group-hover:text-blue-600 transition-colors">
                  <svg className="w-4 h-4 group-hover:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );

  // ── Main Render ─────────────────────────────────────────────────────────────
  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className={`inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200 mb-6 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}>
            🎨 Portfolio Karya Kami
          </div>
          <h2 className={`text-3xl md:text-4xl font-bold text-slate-800 mb-6 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-100'}`}>
            Lihat Karya{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Terbaik Kami
            </span>
          </h2>
          <p className={`text-xl text-slate-600 leading-relaxed ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-200'}`}>
            Kami telah berhasil menyelesaikan banyak proyek dengan hasil yang memuaskan klien.
            Setiap proyek adalah bukti komitmen kami terhadap kualitas dan inovasi.
          </p>
        </div>

        {/* Filter */}
        {!isLoading && !error && (
          <div className={`flex flex-wrap justify-center gap-3 mb-12 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-300'}`}>
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-lg'
                    : 'bg-white/80 backdrop-blur-xl text-slate-700 border-2 border-white/50 hover:border-blue-400 hover:text-blue-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {isLoading
          ? renderLoading()
          : error
          ? renderError()
          : filteredItems.length === 0
          ? renderEmpty()
          : renderGrid()}

        {/* CTA */}
        {!isLoading && !error && (
          <div className={`text-center ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-500'}`}>
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-3xl p-12 text-white shadow-2xl">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Ingin Melihat Lebih Banyak?</h3>
              <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
                Kunjungi galeri lengkap kami untuk melihat semua proyek dan testimonial klien
                yang telah merasakan transformasi bisnis mereka.
              </p>
              <Link
                to="/paket"
                className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                Mulai Proyek Anda
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};