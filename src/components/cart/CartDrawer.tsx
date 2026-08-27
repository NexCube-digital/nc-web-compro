import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTimes, FaTrashAlt, FaPlus, FaMinus, FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

let _setOpen: React.Dispatch<React.SetStateAction<boolean>> | null = null;
export const openCartDrawer = () => _setOpen?.(true);
export const closeCartDrawer = () => _setOpen?.(false);

export const CartDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, totalPrice, totalItems, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();

  _setOpen = setIsOpen;

  const formatRupiah = (num: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer Panel */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white/95 backdrop-blur-xl z-[70] shadow-2xl border-l border-slate-200/80 transform transition-transform duration-300 ease-out flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#126EFE] to-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <FaShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 tracking-tight">Keranjang Belanja</h2>
                {totalItems > 0 && (
                  <span className="bg-gradient-to-r from-[#FBA41C] to-amber-500 text-slate-900 text-[10px] font-black rounded-full px-2 py-0.5 shadow-xs">
                    {totalItems} Paket
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">NexCube Digital Solutions</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setIsOpen(false); navigate('/history-invoice'); }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold transition-colors cursor-pointer"
              title="Lihat riwayat transaksi"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Riwayat</span>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <FaTimes className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
              <div className="w-20 h-20 bg-blue-50 border border-blue-100 rounded-3xl flex items-center justify-center text-[#126EFE] shadow-inner">
                <FaShoppingCart className="w-8 h-8 text-blue-400" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-base">Keranjang Belanja Kosong</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Pilih paket website, undangan, atau desain grafis pilihan Anda untuk memulai pesanan.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => { setIsOpen(false); navigate('/paket'); }}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#126EFE] to-blue-700 text-white rounded-2xl text-xs font-extrabold shadow-md shadow-blue-500/20 hover:scale-105 transition-all cursor-pointer"
                >
                  Jelajahi Paket
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="relative bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm hover:border-blue-200 transition-all space-y-3 group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#126EFE] via-blue-600 to-[#FBA41C] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-1">{item.name}</h4>
                        {item.description && (
                          <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{item.description}</p>
                        )}
                        <p className="text-[#126EFE] font-black text-xs sm:text-sm mt-0.5">{formatRupiah(item.price)}</p>
                      </div>
                    </div>

                    {/* Delete Item */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Hapus dari keranjang"
                    >
                      <FaTrashAlt className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 font-medium text-[11px]">Jumlah Paket:</span>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
                      <button
                        onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                        className="w-5 h-5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                      >
                        <FaMinus className="w-2.5 h-2.5" />
                      </button>
                      <span className="text-xs font-black text-slate-900 w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-5 h-5 rounded-lg bg-[#126EFE] hover:bg-blue-700 flex items-center justify-center text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        <FaPlus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout Box */}
        {items.length > 0 && (
          <div className="border-t border-slate-200/90 bg-white p-6 space-y-4 shadow-lg">
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Total Item ({totalItems})</span>
                <span>Termasuk Garansi Bug</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-slate-900">Total Tagihan</span>
                <span className="text-xl font-black bg-gradient-to-r from-[#126EFE] to-blue-700 bg-clip-text text-transparent">
                  {formatRupiah(totalPrice)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 bg-gradient-to-r from-[#126EFE] via-blue-600 to-[#FBA41C] hover:from-[#0950be] hover:to-blue-800 text-white font-extrabold rounded-2xl shadow-lg shadow-blue-500/20 transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm hover:scale-102 active:scale-98 cursor-pointer"
            >
              <span>Lanjut ke Pembayaran</span>
              <FaArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium pt-1">
              <FaShieldAlt className="w-3 h-3 text-emerald-500" />
              <span>Pembayaran Aman & Terverifikasi Midtrans</span>
            </div>

          </div>
        )}
      </div>
    </>
  );
};