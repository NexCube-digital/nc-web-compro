import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import apiClient from '../services/api';

declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        callbacks: {
          onSuccess: (result: any) => void;
          onPending: (result: any) => void;
          onError: (result: any) => void;
          onClose: () => void;
        }
      ) => void;
    };
  }
}

const formatRupiah = (num: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);

export const Checkout: React.FC = () => {
  const { items: cartItems, totalPrice: cartTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Cek apakah ada directOrder dari "Pesan Sekarang" (tidak lewat cart)
  const directOrder = (location.state as any)?.directOrder as {
    id: string; name: string; price: number; quantity: number; description?: string;
  } | undefined;

  // Gunakan directOrder ATAU cart — tidak campur keduanya
  const items = directOrder ? [directOrder] : cartItems;
  const totalPrice = directOrder ? directOrder.price * directOrder.quantity : cartTotalPrice;
  const isDirectOrder = !!directOrder;

  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<'invoice' | 'payment' | null>(null);
  const [error, setError] = useState('');

  const [pendingInvoiceId, setPendingInvoiceId] = useState<number | null>(null);
  const [pendingSnapToken, setPendingSnapToken] = useState<string | null>(null);

  useEffect(() => {
    // Redirect kalau tidak ada item sama sekali (bukan direct order dan cart kosong)
    if (!isDirectOrder && cartItems.length === 0) navigate('/paket');
  }, [cartItems, isDirectOrder, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const openSnap = (snapToken: string, invoiceId: number) => {
    if (!window.snap) {
      setError('Midtrans Snap belum dimuat. Pastikan script snap.js ada di index.html.');
      return;
    }

    window.snap.pay(snapToken, {
      onSuccess: (result) => {
        console.log('✅ Pembayaran berhasil:', result);
        // Hanya clear cart kalau bukan direct order
        if (!isDirectOrder) clearCart();
        setPendingInvoiceId(null);
        setPendingSnapToken(null);
        navigate('/order/success', { state: { result, invoiceId } });
      },
      onPending: (result) => {
        console.log('⏳ Pembayaran pending:', result);
        if (!isDirectOrder) clearCart();
        setPendingInvoiceId(null);
        setPendingSnapToken(null);
        navigate('/order/pending', { state: { result, invoiceId } });
      },
      onError: (result) => {
        console.error('❌ Pembayaran error:', result);
        setError('Pembayaran gagal. Silakan coba lagi.');
      },
      onClose: () => {
        console.log('🔒 Popup ditutup — invoice tetap tersimpan, bisa dibuka ulang');
      },
    });
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone) {
      setError('Semua field wajib diisi');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Format email tidak valid');
      return;
    }
    if (!/^(\+62|62|0)8[1-9][0-9]{6,11}$/.test(form.phone.replace(/\s/g, ''))) {
      setError('Format nomor WA tidak valid');
      return;
    }

    if (pendingInvoiceId && pendingSnapToken) {
      openSnap(pendingSnapToken, pendingInvoiceId);
      return;
    }

    setLoading(true);
    setError('');

    try {
      setLoadingStep('invoice');

      const invoiceRes = await apiClient.checkoutCreateInvoice({
        name: form.name,
        email: form.email,
        phone: form.phone,
        items,
        totalPrice,
      });

      const invoiceId = invoiceRes?.data?.id;
      if (!invoiceId) throw new Error('Invoice dibuat tapi ID tidak ditemukan di response backend.');

      setLoadingStep('payment');

      const paymentRes = await apiClient.checkoutGeneratePaymentLink(invoiceId);

      const snapToken =
        paymentRes?.data?.token ??
        (paymentRes?.data as any)?.paymentToken ??
        (paymentRes?.data as any)?.snapToken;

      if (!snapToken) throw new Error('Token pembayaran tidak ditemukan. Hubungi administrator.');

      setPendingInvoiceId(invoiceId);
      setPendingSnapToken(snapToken);
      openSnap(snapToken, invoiceId);

    } catch (err: any) {
      console.error('[Checkout] Error:', err);
      setError(err.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
      setLoadingStep(null);
    }
  };

  if (!isDirectOrder && cartItems.length === 0) return null;

  const loadingLabel =
    loadingStep === 'invoice' ? 'Membuat invoice...'
    : loadingStep === 'payment' ? 'Menyiapkan pembayaran...'
    : 'Memproses...';

  const hasPendingPayment = !!(pendingInvoiceId && pendingSnapToken);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Konfirmasi Pesanan</h1>
          <p className="text-slate-500 mt-1">
            {isDirectOrder
              ? 'Pemesanan langsung — keranjang kamu tidak terpengaruh'
              : 'Lengkapi data diri untuk melanjutkan pembayaran'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Data Pemesan
              </h2>

              <form onSubmit={handlePay} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="Contoh: Budi Santoso"
                    disabled={hasPendingPayment || loading}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="Contoh: budi@email.com"
                    disabled={hasPendingPayment || loading}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    required
                  />
                  <p className="text-xs text-slate-400 mt-1">Bukti pembayaran akan dikirim ke email ini</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Nomor WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-medium text-sm flex items-center">
                      🇮🇩 +62
                    </div>
                    <input
                      type="tel" name="phone" value={form.phone} onChange={handleChange}
                      placeholder="8123456789"
                      disabled={hasPendingPayment || loading}
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Untuk konfirmasi dan koordinasi proyek</p>
                </div>

                {hasPendingPayment && !loading && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm flex items-start gap-2">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold">Pembayaran belum selesai</p>
                      <p className="text-xs mt-0.5 text-amber-600">Invoice sudah dibuat. Klik tombol di bawah untuk melanjutkan tanpa membuat invoice baru.</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                )}

                {loading && loadingStep && (
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-sm flex items-center gap-3">
                    <svg className="w-4 h-4 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <div className="flex-1">
                      <p className="font-semibold text-xs">{loadingLabel}</p>
                      <div className="flex gap-1 mt-1.5">
                        <div className={`h-1 rounded-full flex-1 transition-all duration-500 ${loadingStep === 'invoice' ? 'bg-blue-500' : 'bg-blue-300'}`} />
                        <div className={`h-1 rounded-full flex-1 transition-all duration-500 ${loadingStep === 'payment' ? 'bg-blue-500' : 'bg-blue-100'}`} />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200 text-base"
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {loadingLabel}
                    </>
                  ) : hasPendingPayment ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Lanjutkan Pembayaran
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Bayar Sekarang
                    </>
                  )}
                </button>

                {/* {hasPendingPayment && !loading && (
                  <button
                    type="button"
                    onClick={() => { setPendingInvoiceId(null); setPendingSnapToken(null); setError(''); }}
                    className="w-full py-2 text-sm text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-2"
                  >
                    Ganti data & buat pesanan baru
                  </button>
                )} */}

                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Pembayaran aman menggunakan enkripsi SSL · Powered by Midtrans
                </div>
              </form>
            </div>
          </div>

          {/* Right: Ringkasan */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Ringkasan Pesanan
              </h2>

              {/* ✅ Badge info direct order */}
              {isDirectOrder && (
                <div className="mb-4 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-xs font-semibold flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Pemesanan Langsung — tidak masuk keranjang
                </div>
              )}

              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                        {item.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">{item.name}</p>
                        <p className="text-xs text-slate-400">×{item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-800 text-sm whitespace-nowrap">
                      {formatRupiah(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span>{formatRupiah(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Biaya Layanan</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-base pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span className="text-blue-600">{formatRupiah(totalPrice)}</span>
                </div>
              </div>

              <div className="mt-5 p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 font-medium mb-2">Metode pembayaran tersedia:</p>
                <div className="flex flex-wrap gap-1.5">
                  {['QRIS', 'GoPay', 'OVO', 'BCA', 'Mandiri', 'BNI', 'BRI', 'DANA'].map((m) => (
                    <span key={m} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};