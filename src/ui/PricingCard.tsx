import React from 'react'
import { Link } from 'react-router-dom'

export const PricingCard: React.FC<{ 
  tier: string; 
  price: string; 
  features: string[]; 
  accent?: string;
  popular?: boolean;
}> = ({ 
  tier, 
  price, 
  features, 
  accent,
  popular = false
}) => {
  // Extract price value safely
  const priceValue = price.includes(' ') ? price.split(' ')[0] : price;
  
  // Determine styling based on tier
  const isSpecialTier = accent?.includes('from-slate-800') || tier === 'Platinum';
  const isGoldTier = tier === 'Gold';
  
  return (
    <div className={`relative rounded-xl p-4 sm:p-6 md:p-8 shadow-card hover:shadow-premium-hover border ${accent ?? 'bg-white'} transition-all duration-300 hover:-translate-y-1 h-full flex flex-col`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-accent text-white text-xs font-medium rounded-full">
          Popular
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className={`text-lg sm:text-xl font-heading font-semibold ${isSpecialTier ? 'text-white' : ''}`}>{tier}</div>
          <div className={`text-xs sm:text-sm mt-1 ${isSpecialTier ? 'text-slate-300' : 'text-slate-500'}`}>{price}</div>
        </div>
        <div className={`text-2xl sm:text-3xl font-bold ${isSpecialTier ? 'text-white' : ''} ${isGoldTier ? 'text-gold' : ''}`}>{priceValue}</div>
      </div>

      <ul className={`mt-4 sm:mt-6 space-y-2 sm:space-y-3 text-sm flex-grow ${isSpecialTier ? 'text-white' : 'text-slate-600'}`}>
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 sm:gap-3">
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
          className={`block w-full py-2 sm:py-3 rounded-md font-medium transition-all duration-300 hover:shadow-lg text-center ${
            isSpecialTier 
              ? 'bg-white text-primary hover:bg-slate-100' 
              : isGoldTier
                ? 'bg-gradient-gold text-primary hover:opacity-90'
                : 'bg-accent text-white hover:bg-accent/90'
          }`}
        >
          Detail Paket
        </Link>
      </div>
    </div>
  )
}