import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiSparkles, HiCheckCircle, HiArrowRight } from 'react-icons/hi2'

export const PricingCard: React.FC<{ 
  tier: string; 
  price: string; 
  features: string[]; 
  includes?: string[];
  accent?: string;
  popular?: boolean;
  badge?: string;
  detailUrl?: string;
}> = ({ 
  tier, 
  price, 
  features,
  includes = [],
  accent,
  popular = false,
  badge,
  detailUrl
}) => {
  // Extract price value safely - handle format "Rp 800.000"
  const cleanPrice = price.replace(/Rp\s?/gi, '').trim();
  const priceValue = cleanPrice.includes(' ') ? cleanPrice.split(' ')[0] : cleanPrice;
  const priceDesc = cleanPrice.includes(' ') ? cleanPrice.split(' ').slice(1).join(' ') : '';
  
  // Process includes to detect included/excluded items
  const processIncludeItem = (item: string) => {
    const trimmed = item.trim();
    // Check for emoji markers or text patterns
    if (trimmed.startsWith('✔️') || trimmed.startsWith('✓')) {
      return { included: true, text: trimmed.replace(/^✔️|^✓/, '').trim() };
    }
    if (trimmed.startsWith('❌') || trimmed.startsWith('✗') || trimmed.startsWith('Tidak ')) {
      return { included: false, text: trimmed.replace(/^❌|^✗/, '').trim() };
    }
    // Default to included if no marker
    return { included: true, text: trimmed };
  };
  
  // Determine styling based on tier
  const isSpecialTier = accent?.includes('from-slate-800') || tier === 'Platinum';
  const isGoldTier = tier === 'Gold';
  const isSilverTier = tier === 'Silver';
  const isStudentTier = tier === 'Student';
  const isBronzeTier = tier === 'Bronze';
  
  // Card hover effect
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Tier-specific styling - Modern & Professional
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
    // Default
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
  
  return (
    <div 
      className={`group relative rounded-2xl p-5 sm:p-6 mt-4 sm:mt-5 transition-all duration-500 h-full flex flex-col backdrop-blur-sm
        ${styles.bg} ${styles.border} ${styles.glow}
        ${isHovered ? '-translate-y-1 scale-[1.01]' : ''} 
        ${popular ? 'ring-2 sm:ring-4 ring-blue-500/30 ring-offset-1 sm:ring-offset-2' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Shimmer Effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transform rounded-2xl pointer-events-none`}></div>
      
      {/* Corner Glow Effect */}
      <div className={`absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-all duration-700 pointer-events-none ${
        isSpecialTier ? 'bg-purple-500' :
        isGoldTier ? 'bg-amber-400' :
        isSilverTier ? 'bg-slate-400' :
        isBronzeTier ? 'bg-orange-400' :
        'bg-emerald-400'
      }`}></div>
      
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
        {/* Tier Header */}
        <div className="mb-4 pb-4 border-b border-current border-opacity-10">
          <h3 className={`text-xl sm:text-2xl font-black mb-1 ${textColor} tracking-tight`}>
            {tier}
          </h3>
          {isGoldTier && (
            <div className={`flex items-center gap-1 ${styles.accentColor} mt-1`}>
              <HiSparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs font-bold">Premium Choice</span>
            </div>
          )}
        </div>

        {/* Price Display */}
        <div className="mb-5">
          <div className="flex items-start gap-1.5">
            <span className={`text-sm sm:text-base font-bold ${secondaryTextColor} mt-0.5 sm:mt-1`}>Rp</span>
            <div className="flex flex-col">
              <span className={`text-3xl sm:text-4xl font-black ${textColor} tracking-tighter leading-none`}>
                {priceValue}
              </span>
              {priceDesc && (
                <span className={`text-xs sm:text-sm mt-1 ${secondaryTextColor} font-semibold`}>
                  {priceDesc}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Includes Section - Expandable */}
        {includes && includes.length > 0 && (
          <div className="mb-4 flex-grow">
            <h4 className={`text-xs font-bold ${textColor} uppercase tracking-wider mb-2 opacity-70`}>
              Fitur Utama:
            </h4>
            <ul className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
              {(isExpanded ? includes : includes.slice(0, 5)).map((item, index) => {
                const { included, text } = processIncludeItem(item);
                return (
                  <li 
                    key={index} 
                    className={`flex items-start gap-2 transition-all duration-300 ${isHovered ? 'translate-x-0.5' : ''}`}
                    style={{ transitionDelay: `${index * 40}ms` }}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {included ? (
                        <HiCheckCircle className={`w-3.5 h-3.5 ${styles.iconColor}`} />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`w-3.5 h-3.5 text-red-400`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-[11px] font-medium leading-relaxed ${included ? secondaryTextColor : 'text-slate-400 line-through'}`}>
                      {text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Features List - Hidden when includes exist */}
        {(!includes || includes.length === 0) && features && features.length > 0 && (
          <ul className="space-y-2 mb-5 flex-grow">
            {features.slice(0, 3).map((f, index) => (
              <li 
                key={index} 
                className={`flex items-start gap-2 transition-all duration-300 ${isHovered ? 'translate-x-0.5' : ''}`}
                style={{ transitionDelay: `${index * 40}ms` }}
              >
                <div className="mt-0.5 flex-shrink-0">
                  <HiCheckCircle className={`w-4 h-4 ${styles.iconColor} ${isHovered ? 'scale-110' : ''} transition-transform duration-300`} />
                </div>
                <span className={`text-xs font-medium leading-relaxed ${secondaryTextColor}`}>
                  {f}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* CTA Button */}
        <div className="mt-auto pt-4">
          {includes && includes.length > 5 ? (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className={`group/btn relative block w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl font-bold transition-all duration-300 text-center overflow-hidden
                bg-gradient-to-r ${styles.buttonGradient} text-white
                hover:shadow-lg hover:scale-[1.02] active:scale-95
                ${isHovered ? 'shadow-md' : ''} z-20`}
            >
              <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-1.5 text-xs sm:text-sm">
                {isExpanded ? (
                  <>
                    Tutup
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                ) : (
                  <>
                    Lihat Semua Fitur ({includes.length})
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </span>
              
              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 pointer-events-none"></div>
            </button>
          ) : (
            <a 
              href={`https://wa.me/6285950313360?text=Halo%20NexCube,%20saya%20tertarik%20dengan%20paket%20${encodeURIComponent(tier)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`group/btn relative block w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl font-bold transition-all duration-300 text-center overflow-hidden
                bg-gradient-to-r ${styles.buttonGradient} text-white
                hover:shadow-lg hover:scale-[1.02] active:scale-95
                ${isHovered ? 'shadow-md' : ''} z-20`}
            >
              <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-1.5 text-xs sm:text-sm">
                Hubungi Kami
                <HiArrowRight className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
              </span>
              
              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 pointer-events-none"></div>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}