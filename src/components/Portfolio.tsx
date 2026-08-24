import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGlobe, FaEnvelopeOpenText, FaPalette, FaBookOpen, FaCamera, FaStar, FaExternalLinkAlt, FaFolderOpen, FaArrowRight } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import apiClient, { Portfolio as PortfolioType, getImageUrl } from '../services/api';

// ── Helper: gradient & icon berdasarkan category ──────────────────────────────

const getCategoryGradient = (category: string): string => {
  const map: Record<string, string> = {
    website: 'from-[#126EFE] to-blue-700',
    undangan: 'from-[#FBA41C] to-amber-600',
    desain: 'from-rose-500 to-pink-600',
    katalog: 'from-emerald-500 to-teal-600',
    fotografi: 'from-violet-500 to-purple-600',
  };
  return map[category] ?? 'from-[#126EFE] to-blue-600';
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
      return <FaGlobe className="w-4 h-4 sm:w-5 sm:h-5" />;
    case 'undangan':
      return <FaEnvelopeOpenText className="w-4 h-4 sm:w-5 sm:h-5" />;
    case 'desain':
      return <FaPalette className="w-4 h-4 sm:w-5 sm:h-5" />;
    case 'katalog':
      return <FaBookOpen className="w-4 h-4 sm:w-5 sm:h-5" />;
    case 'fotografi':
      return <FaCamera className="w-4 h-4 sm:w-5 sm:h-5" />;
    default:
      return <FaFolderOpen className="w-4 h-4 sm:w-5 sm:h-5" />;
  }
};

export interface PortfolioProps {
  limit?: number;
  showViewMore?: boolean;
  hideHeader?: boolean;
}

// ── Main Component ────────────────────────────────────────────────────────────

export const Portfolio: React.FC<PortfolioProps> = ({
  limit,
  showViewMore = false,
  hideHeader = false,
}) => {
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

  const displayedItems = limit ? filteredItems.slice(0, limit) : filteredItems;

  // ── Render: Loading ─────────────────────────────────────────────────────────
  const renderLoading = () => (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-8 mb-8 sm:mb-12">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-xl sm:rounded-3xl overflow-hidden shadow-xs bg-white border border-slate-100 animate-pulse">
          <div className="aspect-video bg-slate-200" />
          <div className="p-3 sm:p-6 space-y-2">
            <div className="h-3 sm:h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-2.5 sm:h-3 bg-slate-200 rounded w-full" />
            <div className="h-2.5 sm:h-3 bg-slate-200 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );

  // ── Render: Error ───────────────────────────────────────────────────────────
  const renderError = () => (
    <div className="text-center py-10 sm:py-16 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 max-w-md mx-auto p-6 sm:p-8 shadow-xs">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3 font-bold text-lg sm:text-xl">
        !
      </div>
      <p className="text-slate-600 text-xs sm:text-base mb-4 sm:mb-6 font-medium">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-[#126EFE] hover:bg-[#0950be] text-white px-5 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
      >
        Coba Lagi
      </button>
    </div>
  );

  // ── Render: Empty ───────────────────────────────────────────────────────────
  const renderEmpty = () => (
    <div className="text-center py-10 sm:py-16 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 max-w-md mx-auto p-6 sm:p-8 shadow-xs">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 text-[#126EFE] flex items-center justify-center mx-auto mb-3">
        <FaFolderOpen className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <p className="text-slate-600 text-xs sm:text-sm font-semibold">
        {selectedCategory === 'Semua'
          ? 'Belum ada portfolio yang tersedia.'
          : `Belum ada portfolio untuk kategori "${selectedCategory}".`}
      </p>
    </div>
  );

  // ── Render: Grid (2 Columns / 2 Banjar on Mobile) ───────────────────────────
  const renderGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8 mb-4 sm:mb-8">
      {displayedItems.map((item, index) => {
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
            className={`group relative overflow-hidden rounded-xl sm:rounded-3xl shadow-xs hover:shadow-2xl transition-all duration-500 bg-white border border-slate-200/90 hover:border-blue-300 hover:-translate-y-1.5 flex flex-col justify-between ${
              !isLoaded ? 'opacity-0' : 'animate-fadeInUp'
            }`}
          >
            {/* Image Box */}
            <div className="relative overflow-hidden bg-slate-100 w-full aspect-video">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white`}>
                  <CategoryIcon category={item.category} />
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3 sm:p-6">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {techList.slice(0, 3).map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] sm:text-[11px] bg-white/20 backdrop-blur-md text-white px-1.5 py-0.5 rounded-full font-semibold border border-white/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-white font-bold px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-[#126EFE] text-[10px] sm:text-xs shadow-md">
                    <span>Lihat Proyek Live</span>
                    <FaExternalLinkAlt className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </div>
                </div>
              </div>

              {/* Category badge */}
              <div className={`absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-r ${gradient} text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-xs font-bold shadow-md flex items-center gap-1 truncate max-w-[80%]`}>
                <CategoryIcon category={item.category} />
                <span className="truncate">{categoryLabel}</span>
              </div>

              {/* Featured badge */}
              {item.featured && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-[#FBA41C] text-slate-900 px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-xs font-extrabold shadow-md flex items-center gap-1">
                  <FaStar className="w-2 h-2 sm:w-3 sm:h-3 text-amber-900" />
                  <span>Featured</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-3 sm:p-6 space-y-1.5 sm:space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xs sm:text-lg font-bold text-slate-900 mb-0.5 sm:mb-1 group-hover:text-[#126EFE] transition-colors truncate">
                  {item.title}
                </h3>
                <p className="text-[11px] sm:text-sm text-slate-600 leading-snug">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-slate-100">
                <span className="text-[9px] sm:text-xs font-bold text-[#126EFE] bg-blue-50 border border-blue-100 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full truncate max-w-[65%]">
                  {item.client || 'Klien NexCube'}
                </span>
                <div className="flex items-center gap-1 text-slate-400 group-hover:text-[#126EFE] transition-colors text-[10px] sm:text-xs font-semibold shrink-0">
                  <span>Detail</span>
                  <FaArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-1 transition-transform" />
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
    <section className="py-8 sm:py-16 md:py-24 bg-gradient-to-b from-white via-slate-50/40 to-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
        
        {/* Header (Compact on Mobile) */}
        {!hideHeader && (
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12 space-y-2 sm:space-y-3">
            <div className={`inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-[#126EFE] px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-xs ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}>
              <HiSparkles className="w-3.5 h-3.5 text-[#FBA41C]" />
              <span>PORTFOLIO KARYA TERBAIK</span>
            </div>

            <h2 className={`text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-100'}`}>
              Lihat Hasil Karya <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#126EFE] via-blue-600 to-[#FBA41C] bg-clip-text text-transparent">
                Terbaik Kami
              </span>
            </h2>

            <p className={`text-slate-600 text-xs sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-200'}`}>
              Setiap proyek adalah bukti komitmen kami terhadap kualitas, performa tinggi, dan kepuasan klien.
            </p>
          </div>
        )}

        {/* Filter Buttons (Horizontally Scrollable / Compact on Mobile) */}
        {!isLoading && !error && (
          <div className={`flex items-center gap-2 overflow-x-auto pb-2 mb-6 sm:mb-12 sm:flex-wrap sm:justify-center no-scrollbar ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-300'}`}>
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 shrink-0 hover:scale-105 active:scale-98 cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[#126EFE] to-blue-700 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white text-slate-700 border border-slate-200/90 hover:border-blue-300 hover:text-[#126EFE] shadow-xs'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Content Grid */}
        {isLoading
          ? renderLoading()
          : error
          ? renderError()
          : filteredItems.length === 0
          ? renderEmpty()
          : renderGrid()}

        {/* Button Lihat Selengkapnya */}
        {showViewMore && !isLoading && !error && filteredItems.length > 0 && (
          <div className="text-center pt-3 sm:pt-6">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 sm:px-9 sm:py-4 rounded-2xl bg-gradient-to-r from-[#126EFE] via-blue-600 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold text-xs sm:text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer"
            >
              <span>Lihat Selengkapnya</span>
              <FaArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1.5 transition-transform shrink-0" />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
};