import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaGlobe, FaEnvelopeOpenText, FaPalette, FaBookOpen, FaCamera, 
  FaStar, FaExternalLinkAlt, FaFolderOpen, FaArrowRight, FaCheckCircle 
} from 'react-icons/fa';
import apiClient, { Portfolio as PortfolioType, getImageUrl } from '../services/api';

// ── 3D Isometric Cube Icon for Section Header Badge ───────────────────────────
const IsometricCubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    {/* Top Face */}
    <path 
      d="M12 2 L21 7.2 L12 12.4 L3 7.2 Z" 
      fill="currentColor" 
      fillOpacity="0.2" 
      stroke="currentColor" 
      strokeWidth="1.3" 
      strokeLinejoin="round" 
    />
    {/* Left Face */}
    <path 
      d="M3 7.2 L12 12.4 L12 22 L3 16.8 Z" 
      fill="currentColor" 
      fillOpacity="0.1" 
      stroke="currentColor" 
      strokeWidth="1.3" 
      strokeLinejoin="round" 
    />
    {/* Right Face */}
    <path 
      d="M12 12.4 L21 7.2 L21 16.8 L12 22 Z" 
      fill="currentColor" 
      fillOpacity="0.15" 
      stroke="currentColor" 
      strokeWidth="1.3" 
      strokeLinejoin="round" 
    />
  </svg>
);

// ── 3D Isometric Wireframe Cube Watermark for Card Background ─────────────────
const CubeWatermark: React.FC = () => (
  <svg 
    className="absolute -bottom-6 -right-6 w-28 h-28 text-slate-400/10 group-hover:text-slate-600/20 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none" 
    viewBox="0 0 100 100" 
    fill="none" 
    stroke="currentColor"
  >
    <path d="M50 10 L85 30 L50 50 L15 30 Z" strokeWidth="1.5" strokeDasharray="3 3" />
    <path d="M15 30 L50 50 L50 90 L15 70 Z" strokeWidth="1.5" />
    <path d="M50 50 L85 30 L85 70 L50 90 Z" strokeWidth="1.5" />
    <circle cx="50" cy="50" r="3.5" fill="currentColor" />
    <line x1="50" y1="50" x2="50" y2="10" strokeWidth="1" opacity="0.5" />
    <line x1="50" y1="50" x2="15" y2="70" strokeWidth="1" opacity="0.5" />
    <line x1="50" y1="50" x2="85" y2="70" strokeWidth="1" opacity="0.5" />
  </svg>
);

// ── Helper: category label & icon ─────────────────────────────────────────────
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
      return <FaGlobe className="w-3.5 h-3.5" />;
    case 'undangan':
      return <FaEnvelopeOpenText className="w-3.5 h-3.5" />;
    case 'desain':
      return <FaPalette className="w-3.5 h-3.5" />;
    case 'katalog':
      return <FaBookOpen className="w-3.5 h-3.5" />;
    case 'fotografi':
      return <FaCamera className="w-3.5 h-3.5" />;
    default:
      return <FaFolderOpen className="w-3.5 h-3.5" />;
  }
};

export interface PortfolioProps {
  id?: string;
  limit?: number;
  showViewMore?: boolean;
  hideHeader?: boolean;
}

// ── Main Component ────────────────────────────────────────────────────────────
export const Portfolio: React.FC<PortfolioProps> = ({
  id = 'portfolio',
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

  // Daftar kategori
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
      {[...Array(limit || 6)].map((_, i) => (
        <div key={i} className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs bg-white border border-slate-200 animate-pulse">
          <div className="h-9 bg-slate-100 border-b border-slate-200" />
          <div className="aspect-video bg-slate-200" />
          <div className="p-4 sm:p-6 space-y-2.5">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-200 rounded w-full" />
            <div className="h-3 bg-slate-200 rounded w-2/3" />
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
        className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
      >
        Coba Lagi
      </button>
    </div>
  );

  // ── Render: Empty ───────────────────────────────────────────────────────────
  const renderEmpty = () => (
    <div className="text-center py-10 sm:py-16 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 max-w-md mx-auto p-6 sm:p-8 shadow-xs">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-3">
        <FaFolderOpen className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <p className="text-slate-600 text-xs sm:text-sm font-semibold">
        {selectedCategory === 'Semua'
          ? 'Belum ada portfolio yang tersedia.'
          : `Belum ada portfolio untuk kategori "${selectedCategory}".`}
      </p>
    </div>
  );

  // ── Render: Grid (Interactive Showcase Frame Style) ─────────────────────────
  const renderGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8 mb-6 sm:mb-10">
      {displayedItems.map((item, index) => {
        const techList: string[] = item.technologies
          ? item.technologies.split(',').map((t) => t.trim())
          : [];
        const categoryLabel = getCategoryLabel(item.category);
        const imageUrl = getImageUrl(item.image);

        return (
          <a
            key={item.id}
            href={item.link || '#'}
            target={item.link ? '_blank' : '_self'}
            rel="noopener noreferrer"
            style={{ animationDelay: `${250 + index * 80}ms` }}
            className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xs hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur-md border border-slate-200/90 hover:border-slate-400/80 hover:-translate-y-2 flex flex-col justify-between ${
              !isLoaded ? 'opacity-0' : 'animate-fadeInUp'
            }`}
          >
            {/* Wireframe Cube Watermark on Card */}
            <CubeWatermark />

            {/* Subtle Titanium Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-slate-300 to-transparent group-hover:via-slate-600 transition-all duration-300"></div>

            {/* ── Top Viewport Header (Mockup Frame) ── */}
            <div className="flex items-center justify-between px-3.5 py-2 sm:px-4 sm:py-2.5 bg-slate-100/90 border-b border-slate-200/80 text-[10px] font-mono text-slate-500 relative z-10">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-rose-400/80 transition-colors"></span>
                <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-amber-400/80 transition-colors"></span>
                <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-emerald-400/80 transition-colors"></span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-[9px] tracking-wider uppercase text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>DEPLOYED // CUBE 5.0</span>
              </div>
            </div>

            {/* ── Image Showcase Box ── */}
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
                <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">
                  <CategoryIcon category={item.category} />
                </div>
              )}

              {/* Hover Interactive Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3.5 sm:p-5">
                <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 space-y-2.5">
                  {techList.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {techList.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] sm:text-[10px] bg-white/15 backdrop-blur-md text-slate-200 px-2 py-0.5 rounded-md font-mono border border-white/15"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="inline-flex items-center gap-1.5 text-slate-950 font-bold px-3 py-1.5 rounded-xl bg-white hover:bg-cyan-300 text-[10px] sm:text-xs shadow-md transition-colors">
                    <span>Lihat Proyek Live</span>
                    <FaExternalLinkAlt className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>

              {/* Floating Category Pill */}
              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-slate-900/85 backdrop-blur-md text-white border border-white/10 px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold shadow-md flex items-center gap-1.5">
                <CategoryIcon category={item.category} />
                <span>{categoryLabel}</span>
              </div>

              {/* Featured Badge */}
              {item.featured && (
                <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black shadow-md flex items-center gap-1">
                  <FaStar className="w-2 h-2 text-slate-950" />
                  <span>Featured</span>
                </div>
              )}
            </div>

            {/* ── Card Content ── */}
            <div className="p-4 sm:p-6 space-y-2 flex-1 flex flex-col justify-between relative z-10">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 group-hover:text-slate-700 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom Row: Client Pill & Detail Action */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-[10px] sm:text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200/90 px-2.5 py-0.5 rounded-full truncate max-w-[65%] flex items-center gap-1">
                  <FaCheckCircle className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{item.client || 'Klien NexCube'}</span>
                </span>
                <div className="flex items-center gap-1 text-slate-500 group-hover:text-slate-900 transition-colors text-[11px] sm:text-xs font-bold shrink-0">
                  <span>Detail</span>
                  <FaArrowRight className="w-2.5 h-2.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );

  // ── Render: Category Filter Bar ──────────────────────────────────────────
  const renderCategoryFilter = () => {
    if (isLoading || error) return null;
    return (
      <div className={`flex justify-center mb-7 sm:mb-12 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-300'}`}>
        <div className="inline-flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 backdrop-blur-md overflow-x-auto no-scrollbar max-w-full shadow-xs">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 shrink-0 cursor-pointer ${
                selectedCategory === category
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // ── Render: View More Button ───────────────────────────────────────────────
  const renderViewMoreButton = () => {
    if (!showViewMore || isLoading || error || filteredItems.length === 0) return null;
    return (
      <div className="text-center pt-3 sm:pt-6">
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2.5 px-8 py-3.5 sm:px-10 sm:py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer"
        >
          <span>Jelajahi Seluruh Portfolio</span>
          <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform shrink-0" />
        </Link>
      </div>
    );
  };

  // ── Standalone / Embedded Mode (e.g. on /portfolio page) ───────────────────
  if (hideHeader) {
    return (
      <div id={id} className="w-full text-slate-900 relative">
        {renderCategoryFilter()}
        {isLoading
          ? renderLoading()
          : error
          ? renderError()
          : filteredItems.length === 0
          ? renderEmpty()
          : renderGrid()}
        {renderViewMoreButton()}
      </div>
    );
  }

  // ── Full Section Mode (Home Page) ──────────────────────────────────────────
  return (
    <section id={id} className="py-10 sm:py-16 md:py-24 bg-gradient-to-b from-white via-slate-50/70 to-slate-100/50 text-slate-900 relative overflow-hidden border-b border-slate-200/60">
      {/* ── Background Aesthetics: Digital Isometric Grid ── */}
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      ></div>

      {/* Soft Ambient Light Glows */}
      <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-slate-300/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-[450px] h-[450px] bg-indigo-200/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-2 sm:space-y-3">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-slate-800 text-[11px] sm:text-xs font-bold tracking-wider uppercase ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp'}`}>
            <IsometricCubeIcon className="w-3.5 h-3.5 text-slate-700" />
            <span>PORTFOLIO KARYA TERBAIK // CUBE 5.0</span>
          </div>

          <h2 className={`text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-100'}`}>
            Lihat Hasil Karya <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent">
              Terbaik Kami
            </span>
          </h2>

          <p className={`text-slate-600 text-xs sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-200'}`}>
            Setiap proyek adalah bukti komitmen kami terhadap kualitas, performa tinggi, dan kepuasan klien.
          </p>
        </div>

        {/* ── Segmented Controller Filter Tabs ── */}
        {renderCategoryFilter()}

        {/* Content Grid */}
        {isLoading
          ? renderLoading()
          : error
          ? renderError()
          : filteredItems.length === 0
          ? renderEmpty()
          : renderGrid()}

        {/* Button Lihat Selengkapnya */}
        {renderViewMoreButton()}

      </div>
    </section>
  );
};