import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export const PricingCard: React.FC<{ 
  tier: string; 
  price: string; 
  features: string[]; 
  accent?: string;
  popular?: boolean;
  badge?: string;
}> = ({ 
  tier, 
  price, 
  features, 
  accent,
  popular = false,
  badge
}) => {
  // Extract price value safely
  const priceValue = price.includes(' ') ? price.split(' ')[0] : price;
  
  // Determine styling based on tier
  const isSpecialTier = accent?.includes('from-slate-800') || tier === 'Platinum';
  const isGoldTier = tier === 'Gold';
  const isStudentTier = tier === 'Student';
  
  // Card hover effect
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`relative rounded-xl p-4 sm:p-6 md:p-8 shadow-card hover:shadow-premium-hover border ${accent ?? 'bg-white'} transition-all duration-500 ${isHovered ? '-translate-y-2' : ''} h-full flex flex-col`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-accent text-white text-xs font-medium rounded-full">
          <span className={`${isHovered ? 'animate-pulse' : ''} inline-block`}>Popular</span>
        </div>
      )}
      
      {badge && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
          <span className={`${isHovered ? 'animate-pulse' : ''} inline-block`}>{badge}</span>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className={`text-lg sm:text-xl font-heading font-semibold ${isSpecialTier ? 'text-white' : ''}`}>{tier}</div>
          <div className={`text-xs sm:text-sm mt-1 ${isSpecialTier ? 'text-slate-300' : 'text-slate-500'}`}>{price}</div>
        </div>
        <div className={`text-2xl sm:text-3xl font-bold ${isSpecialTier ? 'text-white' : ''} ${isGoldTier ? 'text-gold' : ''} ${isStudentTier ? 'text-blue-500' : ''} transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
          {priceValue}
        </div>
      </div>

      <ul className={`mt-4 sm:mt-6 space-y-2 sm:space-y-3 text-sm flex-grow ${isSpecialTier ? 'text-white' : 'text-slate-600'}`}>
        {features.map((f, index) => (
          <li 
            key={f} 
            className={`flex items-start gap-2 sm:gap-3 transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <span className={`inline-flex mt-1 items-center justify-center w-4 sm:w-5 h-4 sm:h-5 rounded-full ${
              isSpecialTier ? 'bg-white/20' : isGoldTier ? 'bg-gold-light' : 'bg-slate-100'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span className="text-xs sm:text-sm">{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 md:mt-8">
        <Link 
          to={`/paket/${tier.toLowerCase()}`} 
          className={`block w-full py-2 sm:py-3 rounded-md font-medium transition-all duration-300 hover:shadow-lg text-center overflow-hidden relative ${
            isSpecialTier 
              ? 'bg-white text-primary hover:bg-slate-100' 
              : isGoldTier
                ? 'bg-gradient-gold text-primary hover:opacity-90'
                : 'bg-accent text-white hover:bg-accent/90'
          }`}
        >
          <span className="relative z-10">Detail Paket</span>
          <span className={`absolute inset-0 transform ${isHovered ? 'scale-x-100' : 'scale-x-0'} origin-left transition-transform duration-500 ${
            isSpecialTier ? 'bg-slate-200' : isGoldTier ? 'bg-yellow-300/20' : 'bg-white/20'
          }`}></span>
        </Link>
      </div>
    </div>
  )
}