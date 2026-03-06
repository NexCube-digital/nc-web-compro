import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { HiSparkles, HiCheckCircle, HiShoppingCart, HiBolt } from 'react-icons/hi2'
import { useCart } from '../context/CartContext'
import { openCartDrawer } from '../components/cart/CartDrawer'

export const PricingCard: React.FC<{ 
  tier: string; 
  price: string; 
  features: string[]; 
  includes?: string[];
  imageSrc?: string;
  accent?: string;
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

  useEffect(() => {
    if (!showFeaturesModal) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const animationFrame = window.requestAnimationFrame(() => {
      setIsModalVisible(true)
    })

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
  const handleAddToCart = () => {
    if (onOrder) {
      onOrder()
    } else {
      addItem({ id: tier, name: `Paket ${tier}`, price: numericPrice, quantity: 1 })
    }
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  // Pesan langsung — TIDAK tambah ke cart, langsung ke checkout via navigate state
  const handleOrderNow = () => {
    navigate('/checkout', {
      state: {
        directOrder: {
          id: tier,
          name: `Paket ${tier}`,
          price: numericPrice,
          quantity: 1,
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
      className={`group relative rounded-2xl p-5 sm:p-6 mt-4 sm:mt-5 transition-all duration-500 h-full flex flex-col backdrop-blur-sm
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
      
      <button type="button" onClick={openFeaturesModal} className="relative z-10 flex flex-col h-full text-left">
        <div className="rounded-xl overflow-hidden border border-white/20 mb-4 h-28 sm:h-36 bg-slate-100">
          <img src={resolvedImageSrc} alt={tier} className="w-full h-full object-cover" />
        </div>

        <div className="mb-3 pb-3 border-b border-current border-opacity-10">
          <h3 className={`text-lg sm:text-xl font-black mb-1 ${textColor} tracking-tight`}>
            {tier}
          </h3>
          {isGoldTier && (
            <div className={`flex items-center gap-1 ${styles.accentColor} mt-1`}>
              <HiSparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs font-bold">Premium Choice</span>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <div className="flex items-start gap-1.5">
            <span className={`text-sm sm:text-base font-bold ${secondaryTextColor} mt-0.5 sm:mt-1`}>Rp</span>
            <div className="flex flex-col">
              <span className={`text-2xl sm:text-3xl font-black ${textColor} tracking-tighter leading-none`}>
                {priceValue}
              </span>
              {priceDesc && (
                <span className={`text-xs sm:text-sm mt-1 ${secondaryTextColor} font-semibold`}>
                  {priceDesc}
                </span>
              )}
            </div>
          </div>
          <div className={`mt-3 text-xs font-bold ${styles.accentColor}`}>
            {`Lihat Semua Fitur (${featureCount})`}
          </div>
        </div>
      </button>

      {showFeaturesModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-3 sm:p-4">
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${isModalVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeFeaturesModal}
          />
          <div
            className={`relative z-10 w-full max-w-md sm:max-w-lg max-h-[88vh] sm:max-h-[80vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-200 ${
              isModalVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 sm:translate-y-2 scale-[0.98]'
            }`}
          >
            <div className={`h-1 w-full bg-gradient-to-r ${styles.buttonGradient}`} />

            <div className="sticky top-0 z-20 px-4 sm:px-5 py-4 border-b border-slate-100 bg-white/95 backdrop-blur-sm shadow-sm flex items-start justify-between gap-4 flex-shrink-0">
              <div>
                <h4 className="text-lg font-black text-slate-800">Fitur Paket {tier}</h4>
                <p className="text-xs text-slate-500 mt-1">Total {featureCount} fitur untuk paket ini</p>
              </div>
              <button
                onClick={closeFeaturesModal}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-4">
              <div className="rounded-xl overflow-hidden bg-slate-100 h-40 sm:h-52">
                <img src={resolvedImageSrc} alt={tier} className="w-full h-full object-cover" />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-xs font-semibold text-slate-500 mb-1">Harga Paket</div>
                <div className="flex items-start gap-1.5">
                  <span className="text-sm font-bold text-slate-600 mt-0.5">Rp</span>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">{priceValue}</span>
                    {priceDesc && (
                      <span className="text-xs mt-1 text-slate-500 font-medium">{priceDesc}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h5 className="text-sm font-bold text-slate-800">Detail Fitur Paket</h5>
                <p className="text-xs text-slate-500">Semua benefit yang Anda dapatkan:</p>
              </div>

              <ul className="space-y-2">
                {featureItems.map((item, index) => {
                  const { included, text } = processIncludeItem(item);
                  return (
                    <li key={index} className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex-shrink-0">
                        {included ? (
                          <HiCheckCircle className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm leading-relaxed ${included ? 'text-slate-700' : 'text-slate-400 line-through'}`}>
                        {text}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="sticky bottom-0 z-20 px-4 sm:px-5 py-4 border-t border-slate-100 bg-white/95 backdrop-blur-sm shadow-lg flex-shrink-0">
              <div className={`grid ${shouldShowDemoButton ? 'grid-cols-[1fr_1fr_auto]' : 'grid-cols-2'} gap-2`}>
                {shouldShowDemoButton && (
                  <button
                    onClick={handleOpenDemo}
                    disabled={!canOpenDemo}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center border ${
                      canOpenDemo
                        ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Demo
                  </button>
                )}

                <button
                  onClick={handleOrderNow}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r ${styles.buttonGradient} text-white hover:scale-[1.01]`}
                >
                  <HiBolt className="w-4 h-4" />
                  Pesan
                </button>

                <button
                  onClick={() => {
                    if (!justAdded) {
                      handleAddToCart()
                    }
                    closeFeaturesModal()
                    openCartDrawer()
                  }}
                  className={`py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${shouldShowDemoButton ? 'w-11 px-0' : 'w-full'} ${
                    justAdded
                      ? 'bg-green-600 text-white border border-green-700'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <HiShoppingCart className="w-4 h-4" />
                  {!shouldShowDemoButton && (justAdded ? 'Lihat' : 'Keranjang')}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}