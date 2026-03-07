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
      className={`group relative rounded-xl p-3 sm:p-4 mt-2 sm:mt-3 transition-all duration-500 h-full flex flex-col backdrop-blur-sm
        ${styles.bg} ${styles.border} ${styles.glow}
        ${isHovered ? '-translate-y-1 scale-[1.01]' : ''} 
        ${popular ? 'ring-2 sm:ring-4 ring-blue-500/30 ring-offset-1 sm:ring-offset-2' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Shimmer */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transform rounded-2xl pointer-events-none" />
      
      {/* Corner Glow */}
      <div className={`absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-all duration-700 pointer-events-none ${
        isSpecialTier ? 'bg-purple-500' :
        isGoldTier ? 'bg-amber-400' :
        isSilverTier ? 'bg-slate-400' :
        isBronzeTier ? 'bg-orange-400' :
        'bg-emerald-400'
      }`} />
      
      {/* Popular Badge */}
      {popular && (
        <div className="absolute -top-4 sm:-top-5 left-1/2 transform -translate-x-1/2 z-30 w-max">
          <div className="relative px-3 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-[10px] sm:text-xs font-black rounded-full shadow-xl sm:shadow-2xl shadow-purple-500/50 flex items-center gap-1 sm:gap-2 animate-pulse whitespace-nowrap">
            <HiSparkles className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="tracking-wide sm:tracking-wider">PALING POPULER</span>
            <HiSparkles className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          </div>
        </div>
      )}
      
      {/* Custom Badge */}
      {badge && !popular && (
        <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 z-30 w-max">
          <div className={`px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r ${styles.badgeGradient} text-white text-[10px] sm:text-xs font-bold rounded-full shadow-md uppercase tracking-wide sm:tracking-widest whitespace-nowrap`}>
            {badge}
          </div>
        </div>
      )}
      
      <div className="relative z-10 flex flex-col h-full">
        <button type="button" onClick={openFeaturesModal} className="flex flex-col h-full text-left">
          <div className="rounded-lg overflow-hidden border border-white/20 mb-3 h-20 sm:h-28 bg-slate-100">
            <img src={resolvedImageSrc} alt={tier} className="w-full h-full object-cover" />
          </div>

          <div className="mb-2">
            <h3 className={`text-sm sm:text-base font-bold ${textColor} tracking-tight leading-snug`}>
              {tier}
            </h3>
            {isGoldTier && (
              <div className={`flex items-center gap-1 ${styles.accentColor} mt-1`}>
                <HiSparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs font-bold">Premium Choice</span>
              </div>
            )}
          </div>

          <div className="mt-auto space-y-2">
            <div className="flex items-end gap-2 flex-wrap">
              <span className={`text-xl sm:text-2xl font-black ${textColor} tracking-tight leading-none`}>
                Rp{priceValue}
              </span>
              {hasComparePrice && (
                <span className={`text-xs sm:text-sm font-semibold ${secondaryTextColor} line-through opacity-80`}>
                  Rp{comparePriceValue}
                </span>
              )}
            </div>

            {priceDesc && (
              <span className={`block text-xs sm:text-sm ${secondaryTextColor} font-medium`}>
                {priceDesc}
              </span>
            )}

            <div className={`space-y-1 text-[11px] sm:text-xs ${secondaryTextColor}`}>
              <div className="flex items-center gap-1.5">
                <HiStar className="w-4 h-4 text-accent" />
                <span className="font-semibold">5.0</span>
                <span>• {featureCount}+ fitur</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HiMapPin className="w-4 h-4 text-accent" />
                <span className="truncate">NexCube Digital</span>
              </div>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            if (!justAdded) {
              handleAddToCart()
            }
            openCartDrawer()
          }}
          className={`mt-3 w-full py-2 rounded-lg text-sm sm:text-base font-bold transition-all duration-300 border ${
            justAdded
              ? 'bg-accent text-white border-accent'
              : 'bg-white/80 text-accent border-accent/40 hover:bg-accent/5 hover:border-accent/70'
          }`}
        >
          {justAdded ? 'Lihat Keranjang' : '+ Keranjang'}
        </button>

        <button
          type="button"
          onClick={openFeaturesModal}
          className="mt-1.5 text-[11px] sm:text-xs font-semibold text-slate-600 hover:text-primary transition-colors"
        >
          {`Lihat Semua Fitur (${featureCount})`}
        </button>
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