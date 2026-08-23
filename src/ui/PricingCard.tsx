import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { HiSparkles, HiCheckCircle, HiShoppingCart, HiBolt, HiStar, HiMapPin } from 'react-icons/hi2'
import { useCart } from '../context/CartContext'
import { openCartDrawer } from '../components/cart/CartDrawer'

export const PricingCard: React.FC<{ 
  tier: string; 
  price: string; 
  features: string[]; 
  includes?: string[];
  imageSrc?: string;
  accent?: string;
  comparePrice?: string;
  popular?: boolean;
  badge?: string;
  detailUrl?: string;
  demoUrl?: string;
  showDemoButton?: boolean;
  onOrder?: () => void;
}> = ({ 
  tier, 
  price, 
  features,
  includes = [],
  imageSrc,
  accent,
  comparePrice,
  popular = false,
  badge,
  detailUrl,
  demoUrl,
  showDemoButton = false,
  onOrder
}) => {
  const navigate = useNavigate()
  const { addItem } = useCart()

  // Extract price value safely - handle format "Rp 800.000"
  const cleanPrice = price.replace(/Rp\s?/gi, '').trim();
  const priceValue = cleanPrice.includes(' ') ? cleanPrice.split(' ')[0] : cleanPrice;
  const priceDesc = cleanPrice.includes(' ') ? cleanPrice.split(' ').slice(1).join(' ') : '';
  const comparePriceValue = comparePrice?.replace(/Rp\s?/gi, '').trim() || '';
  const hasComparePrice = Boolean(comparePriceValue);

  // Parse numeric price for cart
  const numericPrice = parseInt(priceValue.replace(/\./g, '').replace(/,/g, ''), 10) || 0;
  
  // Process includes to detect included/excluded items
  const processIncludeItem = (item: string) => {
    const trimmed = item.trim();
    if (trimmed.startsWith('✔️') || trimmed.startsWith('✓')) {
      return { included: true, text: trimmed.replace(/^✔️|^✓/, '').trim() };
    }
    if (trimmed.startsWith('❌') || trimmed.startsWith('✗') || trimmed.startsWith('Tidak ')) {
      return { included: false, text: trimmed.replace(/^❌|^✗/, '').trim() };
    }
    return { included: true, text: trimmed };
  };
  
  const isSpecialTier = accent?.includes('from-slate-800') || tier === 'Platinum';
  const isGoldTier = tier === 'Gold';
  const isSilverTier = tier === 'Silver';
  const isStudentTier = tier === 'Student';
  const isBronzeTier = tier === 'Bronze';
  
  const [isHovered, setIsHovered] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [modalQty, setModalQty] = useState(1);
  const [modalNote, setModalNote] = useState('');

  useEffect(() => {
    if (!showFeaturesModal) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const animationFrame = window.requestAnimationFrame(() => {
      setIsModalVisible(true)
    })

    setModalQty(1)
    setModalNote('')

    return () => {
      window.cancelAnimationFrame(animationFrame)
      document.body.style.overflow = previousOverflow
    }
  }, [showFeaturesModal])

  const openFeaturesModal = () => {
    setShowFeaturesModal(true)
  }

  const closeFeaturesModal = () => {
    setIsModalVisible(false)
    window.setTimeout(() => setShowFeaturesModal(false), 180)
  }

  const normalizeDemoUrl = (url?: string) => {
    const trimmed = url?.trim()
    if (!trimmed) return ''
    if (/^https?:\/\//i.test(trimmed)) return trimmed
    return `https://${trimmed}`
  }

  const resolvedDemoUrl = normalizeDemoUrl(demoUrl)
  const shouldShowDemoButton = showDemoButton
  const canOpenDemo = Boolean(resolvedDemoUrl)

  // Tambah ke keranjang lalu buka drawer
  const handleAddToCart = (quantity = 1) => {
    if (onOrder) {
      for (let index = 0; index < quantity; index += 1) {
        onOrder()
      }
    } else {
      addItem({ id: tier, name: `Paket ${tier}`, price: numericPrice, quantity })
    }
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  // Pesan langsung — TIDAK tambah ke cart, langsung ke checkout via navigate state
  const handleOrderNow = (quantity = 1) => {
    navigate('/checkout', {
      state: {
        directOrder: {
          id: tier,
          name: `Paket ${tier}`,
          price: numericPrice,
          quantity,
          description: priceDesc || undefined
        }
      }
    })
  }

  const handleOpenDemo = () => {
    if (!resolvedDemoUrl) return
    window.open(resolvedDemoUrl, '_blank', 'noopener,noreferrer')
  }
  
  const getTierStyles = () => {
    if (isSpecialTier) {
      return {
        bg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
        border: 'border-2 border-purple-500/30',
        glow: 'shadow-2xl shadow-purple-500/20',
        iconColor: 'text-purple-400',
        badgeGradient: 'from-purple-500 to-indigo-600',
        buttonGradient: 'from-purple-500 via-purple-600 to-indigo-600',
        accentColor: 'text-purple-300'
      };
    }
    if (isGoldTier) {
      return {
        bg: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50',
        border: 'border-2 border-amber-400/50 ring-2 ring-amber-200/50',
        glow: 'shadow-2xl shadow-amber-300/30',
        iconColor: 'text-amber-600',
        badgeGradient: 'from-amber-500 to-orange-600',
        buttonGradient: 'from-amber-500 via-yellow-500 to-amber-600',
        accentColor: 'text-amber-600'
      };
    }
    if (isSilverTier) {
      return {
        bg: 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100',
        border: 'border-2 border-slate-300/50 ring-2 ring-slate-200/50',
        glow: 'shadow-2xl shadow-slate-300/30',
        iconColor: 'text-slate-600',
        badgeGradient: 'from-slate-600 to-slate-700',
        buttonGradient: 'from-slate-600 via-slate-700 to-slate-800',
        accentColor: 'text-slate-600'
      };
    }
    if (isBronzeTier) {
      return {
        bg: 'bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100',
        border: 'border-2 border-orange-300/40',
        glow: 'shadow-xl shadow-orange-200/20',
        iconColor: 'text-orange-600',
        badgeGradient: 'from-orange-500 to-amber-600',
        buttonGradient: 'from-orange-500 via-amber-600 to-orange-600',
        accentColor: 'text-orange-600'
      };
    }
    if (isStudentTier) {
      return {
        bg: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100',
        border: 'border-2 border-emerald-300/40',
        glow: 'shadow-xl shadow-emerald-200/20',
        iconColor: 'text-emerald-600',
        badgeGradient: 'from-emerald-500 to-teal-600',
        buttonGradient: 'from-emerald-500 via-teal-600 to-emerald-600',
        accentColor: 'text-emerald-600'
      };
    }
    return {
      bg: 'bg-white',
      border: 'border-2 border-slate-200',
      glow: 'shadow-xl shadow-slate-200/20',
      iconColor: 'text-blue-600',
      badgeGradient: 'from-blue-500 to-blue-600',
      buttonGradient: 'from-blue-600 via-blue-700 to-purple-600',
      accentColor: 'text-blue-600'
    };
  };
  
  const styles = getTierStyles();
  const textColor = isSpecialTier ? 'text-white' : 'text-slate-900';
  const secondaryTextColor = isSpecialTier ? 'text-slate-300' : 'text-slate-600';
  const featureItems = includes.length > 0 ? includes : features;
  const featureCount = featureItems.length;
  const modalPrice = numericPrice * modalQty;
  const formatRupiah = (value: number) => `Rp${new Intl.NumberFormat('id-ID').format(value)}`;

  const fallbackImageByTier: Record<string, string> = {
    student: '/images/portfolio/compro.png',
    bronze: '/images/portfolio/menu.png',
    silver: '/images/portfolio/cdc.png',
    gold: '/images/portfolio/karomah.png',
    platinum: '/images/portfolio/ccs.png'
  }

  const resolvedImageSrc = imageSrc || fallbackImageByTier[tier.toLowerCase()] || '/images/NexCube-full.png'
  
  return (
    <div 
      className={`group relative rounded-2xl sm:rounded-3xl p-3 sm:p-6 transition-all duration-300 h-full flex flex-col backdrop-blur-sm overflow-hidden bg-white border border-slate-200/90 shadow-lg shadow-blue-500/5 hover:shadow-2xl hover:border-blue-300 hover:-translate-y-1.5
        ${popular ? 'ring-2 ring-[#126EFE] ring-offset-2' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Accent Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#126EFE] via-blue-600 to-[#FBA41C]" />

      {/* Shimmer Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transform pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full pt-1">
        
        {/* Top Badge Header Row */}
        <div className="flex items-center justify-between gap-1 mb-2.5 min-h-[22px]">
          {popular ? (
            <div className="px-2 py-0.5 sm:px-3 sm:py-1 bg-gradient-to-r from-[#126EFE] to-[#FBA41C] text-white text-[9px] sm:text-[10px] font-black rounded-full shadow-xs flex items-center gap-1 uppercase tracking-wider">
              <HiSparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
              <span>PALING POPULER</span>
            </div>
          ) : badge ? (
            <div className="px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-50 border border-blue-100 text-[#126EFE] text-[9px] sm:text-[10px] font-bold rounded-full uppercase tracking-wider truncate">
              {badge}
            </div>
          ) : <div />}
        </div>

        <button type="button" onClick={openFeaturesModal} className="flex flex-col h-full text-left cursor-pointer">
          
          {/* Image Showcase */}
          <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-slate-100 mb-2.5 sm:mb-4 h-28 sm:h-36 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-2 sm:p-3 flex items-center justify-center group-hover:scale-102 transition-transform duration-300">
            <img src={resolvedImageSrc} alt={tier} className="w-full h-full object-contain drop-shadow-xs" />
          </div>

          <div className="mb-2 sm:mb-3">
            <h3 className="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-snug truncate">
              {tier}
            </h3>
            {isGoldTier && (
              <div className="flex items-center gap-1 text-[#FBA41C] mt-0.5">
                <HiSparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="text-[10px] sm:text-xs font-bold">Pilihan Favorit</span>
              </div>
            )}
          </div>

          <div className="mt-auto space-y-2 sm:space-y-3 pt-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-lg sm:text-3xl font-black bg-gradient-to-r from-[#126EFE] to-blue-700 bg-clip-text text-transparent tracking-tight leading-none">
                Rp{priceValue}
              </span>
              {hasComparePrice && (
                <span className="text-[10px] sm:text-xs font-semibold text-slate-400 line-through">
                  Rp{comparePriceValue}
                </span>
              )}
            </div>

            {priceDesc && (
              <span className="block text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                {priceDesc}
              </span>
            )}

            <div className="space-y-1 text-[10px] sm:text-xs text-slate-500 pt-1.5 sm:pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <HiStar className="w-3.5 h-3.5 text-[#FBA41C] shrink-0" />
                <span className="font-bold text-slate-700">5.0</span>
                <span className="truncate">• {featureCount}+ Fitur</span>
              </div>
            </div>
          </div>
        </button>

        {/* Buttons Row */}
        <div className="mt-3 sm:mt-5 space-y-1.5 sm:space-y-2">
          <button
            type="button"
            onClick={() => {
              if (!justAdded) {
                handleAddToCart()
              }
              openCartDrawer()
            }}
            className={`w-full py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl sm:rounded-2xl text-[11px] sm:text-sm font-extrabold transition-all duration-200 shadow-md cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
              justAdded
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-gradient-to-r from-[#126EFE] to-blue-700 hover:from-[#0950be] hover:to-blue-800 text-white shadow-blue-500/20 hover:scale-102 active:scale-98'
            }`}
          >
            <HiShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">{justAdded ? 'Di Keranjang' : 'Tambah Ke Keranjang'}</span>
          </button>

          <button
            type="button"
            onClick={openFeaturesModal}
            className="w-full py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-slate-600 hover:text-[#126EFE] hover:bg-blue-50/60 border border-slate-200 transition-colors cursor-pointer truncate"
          >
            {`Detail Fitur (${featureCount})`}
          </button>
        </div>
      </div>

      {showFeaturesModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-200 ${isModalVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeFeaturesModal}
          />

          {/* Modal Card Sheet */}
          <div
            className={`relative z-10 w-full max-w-4xl max-h-[92vh] sm:max-h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-200 ${
              isModalVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 sm:translate-y-2 scale-[0.98]'
            }`}
          >
            {/* Top Gradient Accent Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#126EFE] via-blue-600 to-[#FBA41C]" />

            {/* Modal Header */}
            <div className="sticky top-0 z-20 px-4 sm:px-6 py-3.5 border-b border-slate-100 bg-white/95 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#126EFE] font-black text-xs shrink-0">
                  <HiSparkles className="w-4 h-4 text-[#FBA41C]" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 truncate leading-snug">
                    Rincian Paket {tier}
                  </h4>
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">
                    Detail fitur, spesifikasi & opsi pemesanan
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeFeaturesModal}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-base flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Tutup modal"
              >
                ×
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                
                {/* Left Side: Product Image & Feature List (7 cols) */}
                <div className="md:col-span-7 space-y-4">
                  
                  {/* Image Showcase Box */}
                  <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 flex items-center justify-center h-44 sm:h-52 shadow-2xs">
                    <img src={resolvedImageSrc} alt={tier} className="w-full h-full object-contain drop-shadow-md" />
                  </div>

                  {/* Title & Price Header */}
                  <div>
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                      <h3 className="text-lg sm:text-xl font-black text-slate-900">
                        {tier}
                      </h3>
                      {popular && (
                        <span className="px-2.5 py-0.5 bg-gradient-to-r from-[#126EFE] to-[#FBA41C] text-white text-[10px] font-black rounded-full shadow-2xs">
                          PALING POPULER
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl sm:text-2xl font-black text-[#126EFE]">
                        Rp{priceValue}
                      </span>
                      {hasComparePrice && (
                        <span className="text-xs font-semibold text-slate-400 line-through">
                          Rp{comparePriceValue}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Feature Checklist List */}
                  <div className="space-y-2.5 bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-100">
                    <div className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                      Daftar Fitur & Fasilitas Terdaftar:
                    </div>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {featureItems.map((item, index) => {
                        const { included, text } = processIncludeItem(item);
                        return (
                          <div key={index} className="flex items-start gap-2 text-xs sm:text-sm font-semibold">
                            {included ? (
                              <HiCheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                            ) : (
                              <span className="w-3.5 h-3.5 mt-0.5 rounded-full border border-slate-300 shrink-0" />
                            )}
                            <span className={included ? 'text-slate-800' : 'text-slate-400 line-through'}>
                              {text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Right Side: Order Action Form Box (5 cols) */}
                <div className="md:col-span-5 bg-blue-50/50 p-4 sm:p-5 rounded-2xl border border-blue-100 space-y-4">
                  
                  <div className="bg-gradient-to-r from-[#126EFE] to-blue-700 text-white rounded-xl p-3 shadow-md space-y-1">
                    <div className="text-xs font-black uppercase tracking-wider text-amber-300">Garansi & Dukungan NexCube</div>
                    <div className="text-xs text-blue-100 font-medium">Layanan profesional dengan jaminan kualitas 100%</div>
                  </div>

                  {/* Note Field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Catatan Khusus (Opsional):</label>
                    <textarea
                      value={modalNote}
                      onChange={(e) => setModalNote(e.target.value)}
                      placeholder="Contoh: warna dominan biru, referensi website, dll"
                      className="w-full h-20 resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#126EFE] transition-all"
                    />
                  </div>

                  {/* Quantity Counter */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-slate-700">Jumlah Paket:</span>
                    <div className="inline-flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setModalQty((qty) => Math.max(1, qty - 1))}
                        className="w-8 h-8 text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                      >
                        −
                      </button>
                      <div className="w-8 text-center text-xs font-black text-slate-900">{modalQty}</div>
                      <button
                        type="button"
                        onClick={() => setModalQty((qty) => Math.min(99, qty + 1))}
                        className="w-8 h-8 text-[#126EFE] hover:bg-blue-50 font-bold transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total Price Summary */}
                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">Total Harga:</span>
                    <span className="text-xl font-black text-[#126EFE]">{formatRupiah(modalPrice)}</span>
                  </div>

                  {/* Buttons Group */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (!justAdded) {
                          handleAddToCart(modalQty);
                        }
                        closeFeaturesModal();
                        openCartDrawer();
                      }}
                      className="w-full py-3 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-[#126EFE] to-blue-700 hover:from-[#0950be] hover:to-blue-800 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <HiShoppingCart className="w-4 h-4" />
                      <span>{justAdded ? 'Lihat di Keranjang' : 'Tambah Ke Keranjang'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        closeFeaturesModal();
                        handleOrderNow(modalQty);
                      }}
                      className="w-full py-2.5 rounded-xl font-extrabold text-xs sm:text-sm bg-[#FBA41C] hover:bg-[#e08d07] text-slate-900 shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <HiBolt className="w-4 h-4 text-slate-900" />
                      <span>Beli & Order Langsung</span>
                    </button>

                    {shouldShowDemoButton && (
                      <button
                        type="button"
                        onClick={handleOpenDemo}
                        disabled={!canOpenDemo}
                        className={`w-full py-2 rounded-xl font-bold text-xs border transition-colors cursor-pointer ${
                          canOpenDemo
                            ? 'bg-white border-blue-200 text-[#126EFE] hover:bg-blue-50/50'
                            : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Lihat Demo Live →
                      </button>
                    )}
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};