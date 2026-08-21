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
  const shouldShowDemoButton = showDemoButton || Boolean(resolvedDemoUrl)
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
      className={`group relative rounded-3xl p-5 sm:p-6 transition-all duration-300 h-full flex flex-col backdrop-blur-sm overflow-hidden bg-white border border-slate-200/90 shadow-lg shadow-blue-500/5 hover:shadow-2xl hover:border-blue-300 hover:-translate-y-1.5
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
        <div className="flex items-center justify-between gap-2 mb-3 min-h-[26px]">
          {popular ? (
            <div className="px-3 py-1 bg-gradient-to-r from-[#126EFE] to-[#FBA41C] text-white text-[10px] font-black rounded-full shadow-xs flex items-center gap-1 uppercase tracking-wider">
              <HiSparkles className="w-3 h-3 text-white" />
              <span>PALING POPULER</span>
            </div>
          ) : badge ? (
            <div className="px-3 py-1 bg-blue-50 border border-blue-100 text-[#126EFE] text-[10px] font-bold rounded-full uppercase tracking-wider">
              {badge}
            </div>
          ) : <div />}
        </div>

        <button type="button" onClick={openFeaturesModal} className="flex flex-col h-full text-left cursor-pointer">
          
          {/* Image Showcase - object-contain to prevent text clipping */}
          <div className="rounded-2xl overflow-hidden border border-slate-100 mb-4 h-36 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-3 flex items-center justify-center group-hover:scale-102 transition-transform duration-300">
            <img src={resolvedImageSrc} alt={tier} className="w-full h-full object-contain drop-shadow-xs" />
          </div>

          <div className="mb-3">
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
              {tier}
            </h3>
            {isGoldTier && (
              <div className="flex items-center gap-1 text-[#FBA41C] mt-0.5">
                <HiSparkles className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">Pilihan Favorit</span>
              </div>
            )}
          </div>

          <div className="mt-auto space-y-3 pt-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#126EFE] to-blue-700 bg-clip-text text-transparent tracking-tight leading-none">
                Rp{priceValue}
              </span>
              {hasComparePrice && (
                <span className="text-xs font-semibold text-slate-400 line-through">
                  Rp{comparePriceValue}
                </span>
              )}
            </div>

            {priceDesc && (
              <span className="block text-xs text-slate-500 font-medium">
                {priceDesc}
              </span>
            )}

            <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <HiStar className="w-4 h-4 text-[#FBA41C]" />
                <span className="font-bold text-slate-700">5.0 Rating</span>
                <span>• {featureCount}+ Fitur Unggulan</span>
              </div>
            </div>
          </div>
        </button>

        {/* Buttons Row */}
        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={() => {
              if (!justAdded) {
                handleAddToCart()
              }
              openCartDrawer()
            }}
            className={`w-full py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-200 shadow-md cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
              justAdded
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-gradient-to-r from-[#126EFE] to-blue-700 hover:from-[#0950be] hover:to-blue-800 text-white shadow-blue-500/20 hover:scale-102 active:scale-98'
            }`}
          >
            <HiShoppingCart className="w-4 h-4 shrink-0" />
            <span>{justAdded ? 'Lihat di Keranjang' : 'Tambah Ke Keranjang'}</span>
          </button>

          <button
            type="button"
            onClick={openFeaturesModal}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-[#126EFE] hover:bg-blue-50/60 border border-slate-200 transition-colors cursor-pointer"
          >
            {`Lihat Detail Fitur (${featureCount})`}
          </button>
        </div>
      </div>

      {showFeaturesModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-2 sm:p-4">
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${isModalVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeFeaturesModal}
          />
          <div
            className={`relative z-10 w-full max-w-6xl max-h-[92vh] sm:max-h-[88vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-200 ${
              isModalVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 sm:translate-y-2 scale-[0.98]'
            }`}
          >
            <div className={`h-1 w-full bg-gradient-to-r ${styles.buttonGradient}`} />

            <div className="sticky top-0 z-20 px-4 sm:px-6 py-3 border-b border-slate-100 bg-white/95 backdrop-blur-sm shadow-sm flex items-start justify-between gap-4 flex-shrink-0">
              <div>
                <h4 className="text-base sm:text-lg font-black text-slate-800">{tier}</h4>
                <p className="text-xs text-slate-500 mt-1">Detail produk & pengaturan pembelian</p>
              </div>
              <button
                onClick={closeFeaturesModal}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-5">
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-4 sm:gap-6">
                <div className="space-y-4">
                  <div className="border-b border-slate-100">
                    <div className="flex items-center gap-5 text-sm font-semibold text-slate-500">
                      <span className="pb-2 border-b-2 border-accent text-accent">Detail Produk</span>
                      <span className="pb-2">Ulasan</span>
                      <span className="pb-2">Rekomendasi</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[300px_minmax(0,1fr)] gap-4 sm:gap-6">
                    <div>
                      <div className="rounded-xl overflow-hidden bg-slate-50 border border-slate-200 h-48 sm:h-64 md:h-72 p-2 flex items-center justify-center">
                        <img src={resolvedImageSrc} alt={tier} className="w-full h-full object-contain" />
                      </div>
                      <div className="mt-2 grid grid-cols-5 gap-2">
                        {[0, 1, 2, 3, 4].map((thumb) => (
                          <div key={thumb} className="h-14 rounded-lg overflow-hidden border border-slate-200 bg-white p-1 flex items-center justify-center">
                            <img src={resolvedImageSrc} alt={`${tier}-${thumb + 1}`} className="w-full h-full object-contain" />
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 space-y-1 text-xs text-slate-500">
                        <div>Kondisi: Baru</div>
                        <div>Min. Beli: 1</div>
                        <div>Kategori: Paket Digital</div>
                      </div>
                    </div>

                    <div className="space-y-3 max-h-[52vh] sm:max-h-[58vh] overflow-y-auto pr-2 pb-4">
                      <div>
                        <h5 className="text-lg font-bold text-slate-900 leading-snug">{tier}</h5>
                        <div className="mt-2 flex items-end gap-2 flex-wrap">
                          <span className="text-2xl font-black text-slate-900 leading-none">{formatRupiah(numericPrice)}</span>
                          {hasComparePrice && (
                            <span className="text-sm text-slate-400 line-through">Rp{comparePriceValue}</span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-slate-700 leading-relaxed">
                        {featureItems[0] || 'Paket layanan digital untuk kebutuhan bisnis dengan kualitas profesional.'}
                      </p>

                      <ul className="space-y-1">
                        {featureItems.map((item, index) => {
                          const { included, text } = processIncludeItem(item)
                          return (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              {included ? (
                                <HiCheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                              ) : (
                                <span className="w-4 h-4 mt-0.5 rounded-full border border-slate-300 flex-shrink-0" />
                              )}
                              <span className={included ? 'text-slate-700' : 'text-slate-400 line-through'}>{text}</span>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="border border-slate-200 rounded-xl p-4 bg-white sticky top-2">
                    <div className="rounded-lg bg-gradient-to-r from-accent to-primary text-white p-3 mb-4">
                      <div className="text-sm font-bold">Spesial Diskon</div>
                      <div className="text-xs opacity-90 mt-1">Penawaran untuk paket ini</div>
                    </div>

                    <h6 className="text-lg font-black text-slate-800 mb-3">Atur jumlah & catatan</h6>

                    <label className="block text-xs text-slate-500 mb-1">Catatan</label>
                    <textarea
                      value={modalNote}
                      onChange={(event) => setModalNote(event.target.value)}
                      placeholder="Tambahkan catatan untuk pesanan"
                      className="w-full h-20 resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent mb-3"
                    />

                    <div className="flex items-center justify-between mb-4">
                      <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setModalQty((qty) => Math.max(1, qty - 1))}
                          className="w-9 h-9 text-slate-600 hover:bg-slate-50"
                        >
                          −
                        </button>
                        <div className="w-10 text-center text-sm font-bold text-slate-800">{modalQty}</div>
                        <button
                          onClick={() => setModalQty((qty) => Math.min(99, qty + 1))}
                          className="w-9 h-9 text-accent hover:bg-accent/5"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xs text-slate-500">Stok: tersedia</span>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Subtotal</span>
                        <span className="text-2xl font-black text-slate-900">{formatRupiah(modalPrice)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          if (!justAdded) {
                            handleAddToCart(modalQty)
                          }
                          closeFeaturesModal()
                          openCartDrawer()
                        }}
                        className={`w-full py-2.5 rounded-xl font-bold text-base transition-all duration-300 border ${
                          justAdded
                            ? 'bg-accent text-white border-accent'
                            : 'bg-accent text-white border-accent hover:brightness-95'
                        }`}
                      >
                        {justAdded ? 'Lihat Keranjang' : '+ Keranjang'}
                      </button>

                      <button
                        onClick={() => {
                          closeFeaturesModal()
                          handleOrderNow(modalQty)
                        }}
                        className="w-full py-2.5 rounded-xl font-bold text-base border border-accent text-accent bg-white hover:bg-accent/5 transition-all duration-300"
                      >
                        Beli Langsung
                      </button>

                      {shouldShowDemoButton && (
                        <button
                          onClick={handleOpenDemo}
                          disabled={!canOpenDemo}
                          className={`w-full py-2.5 rounded-xl font-semibold text-sm border transition-all duration-300 ${
                            canOpenDemo
                              ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          Lihat Demo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}