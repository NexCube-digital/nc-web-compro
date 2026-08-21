import React from 'react';
import { useCart } from '../../context/CartContext';
import { openCartDrawer } from './CartDrawer';

export const CartButton: React.FC = () => {
  const { totalItems } = useCart();

  return (
    <button
      onClick={openCartDrawer}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-blue-50/80 hover:bg-[#126EFE] text-[#126EFE] hover:text-white transition-all duration-200 shadow-xs group cursor-pointer"
      aria-label="Buka keranjang"
    >
      <svg
        className="w-4 h-4 text-[#126EFE] group-hover:text-white transition-colors"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-4 bg-[#FBA41C] text-slate-900 text-[10px] font-extrabold rounded-full flex items-center justify-center px-1 shadow-xs">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
};