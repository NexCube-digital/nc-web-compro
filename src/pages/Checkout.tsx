import React, { useState, useEffect, useMemo } from 'react';
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

// Daftar Kode Negara untuk Dropdown WhatsApp
const COUNTRY_CODES = [
  { code: '+62', iso: 'id', flagImg: 'https://flagcdn.com/w40/id.png', name: 'Indonesia' },
  { code: '+60', iso: 'my', flagImg: 'https://flagcdn.com/w40/my.png', name: 'Malaysia' },
  { code: '+65', iso: 'sg', flagImg: 'https://flagcdn.com/w40/sg.png', name: 'Singapura' },
  { code: '+1',  iso: 'us', flagImg: 'https://flagcdn.com/w40/us.png', name: 'Amerika Serikat' },
  { code: '+44', iso: 'gb', flagImg: 'https://flagcdn.com/w40/gb.png', name: 'Inggris' },
  { code: '+61', iso: 'au', flagImg: 'https://flagcdn.com/w40/au.png', name: 'Australia' },
  { code: '+81', iso: 'jp', flagImg: 'https://flagcdn.com/w40/jp.png', name: 'Jepang' },
  { code: '+82', iso: 'kr', flagImg: 'https://flagcdn.com/w40/kr.png', name: 'Korea Selatan' },
  { code: '+86', iso: 'cn', flagImg: 'https://flagcdn.com/w40/cn.png', name: 'Tiongkok' },
  { code: '+91', iso: 'in', flagImg: 'https://flagcdn.com/w40/in.png', name: 'India' },
  { code: '+966',iso: 'sa', flagImg: 'https://flagcdn.com/w40/sa.png', name: 'Arab Saudi' },
  { code: '+971',iso: 'ae', flagImg: 'https://flagcdn.com/w40/ae.png', name: 'Uni Emirat Arab' },
];

export interface PaymentChannel {
  id: string;
  name: string;
  category: string;
  calc: (subtotal: number) => number;
  badge: string;
  logoImg: string;
  iconImgs?: string[];
}

export interface PaymentCategory {
  id: string;
  title: string;
  subtitle: string;
  isBestPrice?: boolean;
  channels: PaymentChannel[];
}

// Data Biaya Transaksi Payment Gateway Midtrans dengan Logo Resmi
const PAYMENT_CATEGORIES: PaymentCategory[] = [
  {
    id: 'qris_ewallet',
    title: 'QRIS OVO DANA GOPAY SHOPEEPAY, DLL',
    subtitle: 'QRIS (All Bank & E-Wallet), GoPay, ShopeePay, DANA, OVO',
    isBestPrice: true,
    channels: [
      {
        id: 'qris',
        name: 'QRIS (All Bank & E-Wallet)',
        category: 'E-Wallet (QRIS)',
        calc: (sub) => Math.round(sub * 0.007),
        badge: '0.7%',
        logoImg: '/images/payment/ewallet/qris.png',
        iconImgs: [
          '/images/payment/ewallet/qris.png',
          '/images/payment/ewallet/gopay.png',
          '/images/payment/ewallet/shopeepay.png',
          '/images/payment/ewallet/dana.png',
          '/images/payment/ewallet/ovo.png',
        ],
      },
      {
        id: 'gopay',
        name: 'GoPay',
        category: 'GoPay',
        calc: (sub) => Math.round(sub * 0.02),
        badge: '2%',
        logoImg: '/images/payment/ewallet/gopay.png',
        iconImgs: ['/images/payment/ewallet/gopay.png'],
      },
      {
        id: 'shopeepay',
        name: 'ShopeePay',
        category: 'ShopeePay',
        calc: (sub) => Math.round(sub * 0.02),
        badge: '2%',
        logoImg: '/images/payment/ewallet/shopeepay.png',
        iconImgs: ['/images/payment/ewallet/shopeepay.png'],
      },
      {
        id: 'dana',
        name: 'DANA',
        category: 'DANA',
        calc: (sub) => Math.round(sub * 0.015),
        badge: '1.5%',
        logoImg: '/images/payment/ewallet/dana.png',
        iconImgs: ['/images/payment/ewallet/dana.png'],
      },
      {
        id: 'ovo',
        name: 'OVO',
        category: 'OVO',
        calc: (sub) => Math.round(sub * 0.015),
        badge: '1.5%',
        logoImg: '/images/payment/ewallet/ovo.png',
        iconImgs: ['/images/payment/ewallet/ovo.png'],
      },
    ],
  },
  {
    id: 'virtual_account',
    title: 'Transfer Bank',
    subtitle: 'BCA, Mandiri, BNI, BRI, BSI, Permata, SeaBank, Danamon, Bank Saqu',
    channels: [
      {
        id: 'bca_va',
        name: 'BCA',
        category: 'Transfer Bank',
        calc: () => 4000,
        badge: 'IDR 4.000',
        logoImg: '/images/payment/transfer/bca.png',
        iconImgs: ['/images/payment/transfer/bca.png'],
      },
      {
        id: 'mandiri_va',
        name: 'Mandiri (Livin\')',
        category: 'Transfer Bank',
        calc: () => 4000,
        badge: 'IDR 4.000',
        logoImg: '/images/payment/transfer/mandiri.png',
        iconImgs: ['/images/payment/transfer/mandiri.png'],
      },
      {
        id: 'bni_va',
        name: 'BNI',
        category: 'Transfer Bank',
        calc: () => 4000,
        badge: 'IDR 4.000',
        logoImg: '/images/payment/transfer/bni.png',
        iconImgs: ['/images/payment/transfer/bni.png'],
      },
      {
        id: 'bri_va',
        name: 'BRI (BRIVA)',
        category: 'Transfer Bank',
        calc: () => 4000,
        badge: 'IDR 4.000',
        logoImg: '/images/payment/transfer/briva.png',
        iconImgs: ['/images/payment/transfer/briva.png'],
      },
      {
        id: 'bsi_va',
        name: 'BSI ',
        category: 'Transfer Bank',
        calc: () => 4000,
        badge: 'IDR 4.000',
        logoImg: '/images/payment/transfer/bsi.png',
        iconImgs: ['/images/payment/transfer/bsi.png'],
      },
      {
        id: 'permata_va',
        name: 'Permata',
        category: 'Transfer Bank',
        calc: () => 4000,
        badge: 'IDR 4.000',
        logoImg: '/images/payment/transfer/permata.png',
        iconImgs: ['/images/payment/transfer/permata.png'],
      },
      {
        id: 'cimb_va',
        name: 'CIMB Niaga',
        category: 'Transfer Bank',
        calc: () => 4000,
        badge: 'IDR 4.000',
        logoImg: '/images/payment/transfer/cimb.png',
        iconImgs: ['/images/payment/transfer/cimb.png'],
      },
      {
        id: 'seabank_va',
        name: 'SeaBank',
        category: 'Transfer Bank',
        calc: () => 4000,
        badge: 'IDR 4.000',
        logoImg: '/images/payment/transfer/seabank.png',
        iconImgs: ['/images/payment/transfer/seabank.png'],
      },
      {
        id: 'danamon_va',
        name: 'Bank Danamon',
        category: 'Transfer Bank',
        calc: () => 4000,
        badge: 'IDR 4.000',
        logoImg: '/images/payment/transfer/danamon.png',
        iconImgs: ['/images/payment/transfer/danamon.png'],
      },
      {
        id: 'saqu_va',
        name: 'Bank Saqu',
        category: 'Transfer Bank',
        calc: () => 4000,
        badge: 'IDR 4.000',
        logoImg: '/images/payment/transfer/banksaqu.png',
        iconImgs: ['/images/payment/transfer/banksaqu.png'],
      },
    ],
  },
  {
    id: 'credit_card',
    title: 'Kartu Kredit / Debit',
    subtitle: 'Visa, MasterCard, JCB, Amex, UnionPay, GPay',
    channels: [
      {
        id: 'visa',
        name: 'Visa',
        category: 'Kartu Kredit',
        calc: (sub) => Math.round(sub * 0.029 + 2000),
        badge: '2.9% + Rp 2.000',
        logoImg: '/images/payment/kredit/visa.png',
        iconImgs: ['/images/payment/kredit/visa.png'],
      },
      {
        id: 'mastercard',
        name: 'MasterCard',
        category: 'Kartu Kredit',
        calc: (sub) => Math.round(sub * 0.029 + 2000),
        badge: '2.9% + Rp 2.000',
        logoImg: '/images/payment/kredit/mastercard.png',
        iconImgs: ['/images/payment/kredit/mastercard.png'],
      },
      {
        id: 'american_express',
        name: 'American Express (Amex)',
        category: 'Kartu Kredit',
        calc: (sub) => Math.round(sub * 0.029 + 2000),
        badge: '2.9% + Rp 2.000',
        logoImg: '/images/payment/kredit/american.png',
        iconImgs: ['/images/payment/kredit/american.png'],
      },
      {
        id: 'gpay',
        name: 'Google Pay (GPay)',
        category: 'Kartu Kredit',
        calc: (sub) => Math.round(0),
        badge: '0%',
        logoImg: '/images/payment/kredit/gpay.png',
        iconImgs: ['/images/payment/kredit/gpay.png'],
      },
      {
        id: 'jcb',
        name: 'JCB',
        category: 'Kartu Kredit',
        calc: (sub) => Math.round(sub * 0.029 + 2000),
        badge: '2.9% + Rp 2.000',
        logoImg: '/images/payment/kredit/ucb.png',
        iconImgs: ['/images/payment/kredit/ucb.png'],
      },
      {
        id: 'unionpay',
        name: 'UnionPay',
        category: 'Kartu Kredit',
        calc: (sub) => Math.round(sub * 0.029 + 2000),
        badge: '2.9% + Rp 2.000',
        logoImg: '/images/payment/kredit/unionpay.png',
        iconImgs: ['/images/payment/kredit/unionpay.png'],
      },
    ],
  },
  {
    id: 'minimarket',
    title: 'Minimarket (Gerai Retail)',
    subtitle: 'Alfamart, Alfamidi, DanDan, Indomaret',
    channels: [
      {
        id: 'alfamart',
        name: 'Alfamart',
        category: 'Minimarket',
        calc: () => 5000,
        badge: 'IDR 5.000',
        logoImg: '/images/payment/minimarket/alfamart.png',
        iconImgs: ['/images/payment/minimarket/alfamart.png'],
      },
      {
        id: 'alfamidi',
        name: 'Alfamidi',
        category: 'Minimarket',
        calc: () => 5000,
        badge: 'IDR 5.000',
        logoImg: '/images/payment/minimarket/alfamidi.png',
        iconImgs: ['/images/payment/minimarket/alfamidi.png'],
      },
      {
        id: 'dandan',
        name: 'DanDan',
        category: 'Minimarket',
        calc: () => 5000,
        badge: 'IDR 5.000',
        logoImg: '/images/payment/minimarket/dandan.png',
        iconImgs: ['/images/payment/minimarket/dandan.png'],
      },
      {
        id: 'indomart',
        name: 'Indomaret',
        category: 'Minimarket',
        calc: () => 5000,
        badge: 'IDR 5.000',
        logoImg: '/images/payment/minimarket/indomart.png',
        iconImgs: ['/images/payment/minimarket/indomart.png'],
      },
    ],
  },
  {
    id: 'paylater',
    title: 'Kredit Tanpa Kartu / PayLater',
    subtitle: 'Akulaku PayLater & Kredivo',
    channels: [
      {
        id: 'akulaku',
        name: 'Akulaku PayLater',
        category: 'PayLater',
        calc: (sub) => Math.round(sub * 0.017),
        badge: '1.7%',
        logoImg: '/images/payment/nocard/akulaku.png',
        iconImgs: ['/images/payment/nocard/akulaku.png'],
      },
      {
        id: 'kredivo',
        name: 'Kredivo',
        category: 'PayLater',
        calc: (sub) => Math.round(sub * 0.02),
        badge: '2%',
        logoImg: '/images/payment/nocard/kredivo.png',
        iconImgs: ['/images/payment/nocard/kredivo.png'],
      },
    ],
  },
];

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
  const subtotalPrice = directOrder ? directOrder.price * directOrder.quantity : cartTotalPrice;
  const isDirectOrder = !!directOrder;

  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [countryCode, setCountryCode] = useState('+62');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<'invoice' | 'payment' | null>(null);
  const [error, setError] = useState('');
  
  // State Accordion & Channel Pembayaran yang Dipilih
  const [openAccordionId, setOpenAccordionId] = useState<string>('qris_ewallet');
  const [selectedChannelId, setSelectedChannelId] = useState<string>('qris');

  const selectedCountryObj = useMemo(
    () => COUNTRY_CODES.find(c => c.code === countryCode) || COUNTRY_CODES[0],
    [countryCode]
  );

  const [pendingInvoiceId, setPendingInvoiceId] = useState<number | null>(null);
  const [pendingSnapToken, setPendingSnapToken] = useState<string | null>(null);

  useEffect(() => {
    // Redirect kalau tidak ada item sama sekali (bukan direct order dan cart kosong)
    if (!isDirectOrder && cartItems.length === 0) navigate('/paket');
  }, [cartItems, isDirectOrder, navigate]);

  // Cari Channel Terpilih dari Seluruh Kategori
  const selectedChannel = useMemo(() => {
    for (const cat of PAYMENT_CATEGORIES) {
      const found = cat.channels.find(c => c.id === selectedChannelId);
      if (found) return found;
    }
    return PAYMENT_CATEGORIES[0].channels[0];
  }, [selectedChannelId]);

  // PPN disesuaikan langsung dari nominal biaya gateway Midtrans untuk channel terpilih
  const ppnFeeAmount = useMemo(
    () => selectedChannel.calc(subtotalPrice),
    [selectedChannel, subtotalPrice]
  );

  const grandTotal = useMemo(
    () => subtotalPrice + ppnFeeAmount,
    [subtotalPrice, ppnFeeAmount]
  );

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

    // Bersihkan digit nomor telepon & hilangkan 0 di depan
    const sanitizedDigits = form.phone.replace(/\D/g, '').replace(/^0+/, '');
    if (!sanitizedDigits || sanitizedDigits.length < 6 || sanitizedDigits.length > 15) {
      setError('Format nomor WhatsApp tidak valid (minimal 6-15 digit)');
      return;
    }
    const fullFormattedPhone = `${countryCode}${sanitizedDigits}`;

    if (pendingInvoiceId && pendingSnapToken) {
      openSnap(pendingSnapToken, pendingInvoiceId);
      return;
    }

    setLoading(true);
    setError('');

    try {
      setLoadingStep('invoice');

      // Sertakan PPN (sesuai nominal biaya gateway Midtrans) ke Rincian Invoice
      const checkoutItems = [
        ...items,
        { id: 'ppn-fee', name: `PPN (${selectedChannel.name})`, price: ppnFeeAmount, quantity: 1 }
      ];

      const invoiceRes = await apiClient.checkoutCreateInvoice({
        name: form.name,
        email: form.email,
        phone: fullFormattedPhone,
        items: checkoutItems as any,
        totalPrice: grandTotal,
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
    loadingStep === 'invoice' ? 'Membuat invoice & menghitung PPN...'
    : loadingStep === 'payment' ? 'Menyiapkan pembayaran Midtrans...'
    : 'Memproses...';

  const hasPendingPayment = !!(pendingInvoiceId && pendingSnapToken);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-16 sm:pt-24 pb-28 lg:pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-4 cursor-pointer"
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

        <form onSubmit={handlePay}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Left Column: Data Pemesan & Accordion Metode Pembayaran (Wider Layout) */}
            <div className="lg:col-span-7 xl:col-span-8 order-1 lg:order-1 space-y-6">
              {/* Card 1: Data Pemesan */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 md:p-8">
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  Data Pemesan
                </h2>

                <div className="space-y-5">
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
                    <p className="text-xs text-slate-400 mt-1">Bukti pembayaran dan invoice akan dikirim ke email ini</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Nomor WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-row items-center gap-2">
                      {/* Dropdown Pilihan Kode Negara dengan Gambar Bendera */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                          disabled={hasPendingPayment || loading}
                          className="px-3.5 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-800 font-bold text-sm flex items-center gap-2 hover:bg-slate-200/70 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <img
                            src={selectedCountryObj.flagImg}
                            alt={selectedCountryObj.name}
                            className="w-5 h-3.5 object-cover rounded-xs border border-slate-300 shadow-2xs"
                          />
                          <span>{selectedCountryObj.code}</span>
                          <svg
                            className={`w-4 h-4 text-slate-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {isCountryDropdownOpen && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsCountryDropdownOpen(false)} />
                            <div className="absolute top-full left-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto py-1 space-y-0.5">
                              {COUNTRY_CODES.map((c) => (
                                <button
                                  key={c.code}
                                  type="button"
                                  onClick={() => {
                                    setCountryCode(c.code);
                                    setIsCountryDropdownOpen(false);
                                  }}
                                  className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer ${
                                    countryCode === c.code ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <img
                                      src={c.flagImg}
                                      alt={c.name}
                                      className="w-5 h-3.5 object-cover rounded-xs border border-slate-200 shrink-0 shadow-2xs"
                                    />
                                    <span>{c.name}</span>
                                  </div>
                                  <span className="font-mono text-slate-400 font-bold">{c.code}</span>
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      <input
                        type="tel" name="phone" value={form.phone} onChange={handleChange}
                        placeholder="8123456789"
                        disabled={hasPendingPayment || loading}
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        required
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Untuk konfirmasi dan koordinasi pengerjaan proyek</p>
                  </div>
                </div>
              </div>

              {/* Card 2: Accordion Pilih Metode Pembayaran (Light Theme dengan Logo Gambar Asli) */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 md:p-8">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  Pilih Metode Pembayaran
                </h2>
                
                <p className="text-xs text-slate-500 mb-5">
                  Pilih saluran pembayaran di bawah ini. Nominal PPN akan dihitung secara otomatis.
                </p>

                {/* List Accordion Per Kategori */}
                <div className="space-y-3">
                  {PAYMENT_CATEGORIES.map((cat) => {
                    const isOpen = openAccordionId === cat.id;
                    const hasSelectedChild = cat.channels.some(c => c.id === selectedChannelId);
                    
                    // Hitung nominal PPN pertama untuk preview di header
                    const firstChannelFee = cat.channels[0].calc(subtotalPrice);

                    return (
                      <div
                        key={cat.id}
                        className={`rounded-2xl border transition-all overflow-hidden ${
                          hasSelectedChild
                            ? 'border-blue-500 ring-2 ring-blue-100 bg-blue-50/20'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        {/* Header Accordion */}
                        <div
                          onClick={() => setOpenAccordionId(isOpen ? '' : cat.id)}
                          className={`p-4 sm:p-5 rounded-2xl cursor-pointer flex items-center justify-between gap-3 relative transition-all ${
                            hasSelectedChild
                              ? 'bg-blue-50/70 text-slate-900 border-b border-blue-200'
                              : 'bg-slate-50 hover:bg-slate-100/80 text-slate-900 border-b border-slate-200/60'
                          }`}
                        >
                          {/* Ribbon BEST PRICE jika ada */}
                          {cat.isBestPrice && (
                            <div className="absolute top-0 right-10 bg-amber-400 text-amber-950 font-black text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-b-md shadow-xs">
                              Best Price
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <h3 className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">
                                {cat.title}
                              </h3>
                            </div>
                            
                            {/* Preview Badges Logo Gambar */}
                            <div className="flex items-center gap-2 flex-wrap">
                              {cat.channels.slice(0, 6).map((ch) => (
                                <div
                                  key={ch.id}
                                  className="h-6 px-2 py-0.5 bg-white border border-slate-200/90 rounded-md shadow-2xs flex items-center justify-center"
                                >
                                  <img
                                    src={ch.logoImg}
                                    alt={ch.name}
                                    className="h-4 max-w-[55px] object-contain"
                                    onError={(e) => {
                                      // Fallback jika gambar gagal dimuat
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs sm:text-sm font-extrabold text-blue-600">
                              {formatRupiah(firstChannelFee)}
                            </span>
                            <svg
                              className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                              fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>

                        {/* Body Accordion (Grid Sub-Channel Cards dengan Logo Gambar) */}
                        {isOpen && (
                          <div className="p-3 sm:p-4 bg-slate-50/50 border-t border-slate-200/80">
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                              {cat.channels.map((ch) => {
                                const isSelected = selectedChannelId === ch.id;
                                const chFee = ch.calc(subtotalPrice);

                                return (
                                  <div
                                    key={ch.id}
                                    onClick={() => setSelectedChannelId(ch.id)}
                                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
                                      isSelected
                                        ? 'border-blue-500 bg-white ring-2 ring-blue-200 shadow-md'
                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                                    }`}
                                  >
                                    {/* Logo Image & Checkmark */}
                                    <div className="flex items-center justify-between gap-2 mb-3 min-h-[32px]">
                                      <div className="h-8 px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-200/70 flex items-center justify-center">
                                        <img
                                          src={ch.logoImg}
                                          alt={ch.name}
                                          className="h-6 max-w-[80px] object-contain"
                                        />
                                      </div>
                                      {isSelected && (
                                        <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs shadow-xs">
                                          ✓
                                        </span>
                                      )}
                                    </div>

                                    {/* Channel Name */}
                                    <p className="text-xs font-bold text-slate-800 mb-1 line-clamp-1">
                                      {ch.name}
                                    </p>

                                    {/* Calculated PPN Fee */}
                                    <div className="mb-2">
                                      <span className="text-xs font-black text-slate-900">
                                        {formatRupiah(chFee)}
                                      </span>
                                      <span className="text-[10px] text-slate-400 ml-1">({ch.badge})</span>
                                    </div>

                                    {/* Subtitle Status */}
                                    <div className="pt-2 border-t border-dashed border-slate-200 flex justify-between items-center text-[10px] text-slate-400 italic">
                                      <span>Proses Otomatis</span>
                                      <span className="text-emerald-600 font-semibold not-italic">Instant</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Ringkasan Pesanan & Tombol Bayar */}
            <div className="lg:col-span-5 xl:col-span-4 order-2 lg:order-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 sticky top-24 space-y-5">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  Ringkasan Pesanan
                </h2>

                {/* Badge info direct order */}
                {isDirectOrder && (
                  <div className="px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-xs font-semibold flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Pemesanan Langsung — tidak masuk keranjang
                  </div>
                )}

                {/* Items List */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 shadow-xs">
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

                {/* Rincian Harga & PPN */}
                <div className="border-t border-slate-200 pt-4 space-y-2.5">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal Layanan</span>
                    <span className="font-semibold text-slate-800">{formatRupiah(subtotalPrice)}</span>
                  </div>

                  <div className="flex justify-between text-sm text-slate-600">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span>PPN</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border bg-blue-50 text-blue-700 border-blue-200 shrink-0">
                        {selectedChannel.badge}
                      </span>
                    </div>
                    <span className="font-semibold text-slate-800 whitespace-nowrap">{formatRupiah(ppnFeeAmount)}</span>
                  </div>

                  {/* Info Badge Layanan Payment Gateway Midtrans (Di atas Total Pembayaran) */}
                  <div className="my-3 p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs text-slate-700 font-bold">Layanan Payment Gateway</p>
                      <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                        Midtrans Official
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed mb-2.5">
                      Metode terpilih: <span className="font-bold text-slate-800">{selectedChannel.name}</span> ({selectedChannel.badge}). PPN dihitung secara otomatis.
                    </p>

                    {/* Logo Gambar Metode Terpilih */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {selectedChannel.iconImgs ? (
                        selectedChannel.iconImgs.map((imgSrc, idx) => (
                          <div key={idx} className="h-6 px-2 py-0.5 bg-white border border-slate-200 rounded-md shadow-2xs flex items-center justify-center">
                            <img src={imgSrc} alt="Payment Logo" className="h-4 max-w-[55px] object-contain" />
                          </div>
                        ))
                      ) : (
                        <div className="h-6 px-2 py-0.5 bg-white border border-slate-200 rounded-md shadow-2xs flex items-center justify-center">
                          <img src={selectedChannel.logoImg} alt={selectedChannel.name} className="h-4 max-w-[55px] object-contain" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between font-extrabold text-slate-900 text-base sm:text-lg pt-3 border-t border-slate-200">
                    <span>Total Pembayaran</span>
                    <span className="text-blue-600">{formatRupiah(grandTotal)}</span>
                  </div>
                </div>

                {hasPendingPayment && !loading && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm flex items-start gap-2">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-xs">Pembayaran belum selesai</p>
                      <p className="text-[11px] mt-0.5 text-amber-600">Invoice sudah dibuat. Klik tombol di bawah untuk melanjutkan tanpa membuat invoice baru.</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs">{error}</span>
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

                {/* Tombol Bayar Sekarang di Ringkasan Pesanan */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200 text-sm sm:text-base cursor-pointer"
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
                      Bayar Sekarang — {formatRupiah(grandTotal)}
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
                  <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Pembayaran aman enkripsi SSL · Midtrans Official
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Floating Action Bar Khusus Layar Mobile (< lg) */}
          <div className="fixed bottom-0 left-0 right-0 p-3.5 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl z-40 lg:hidden flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Total Pembayaran</p>
              <p className="text-base font-black text-blue-600 truncate">{formatRupiah(grandTotal)}</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:bg-blue-300 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-200 cursor-pointer shrink-0"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Memproses...</span>
                </>
              ) : hasPendingPayment ? (
                <span>Lanjutkan Pembayaran</span>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Bayar Sekarang</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};