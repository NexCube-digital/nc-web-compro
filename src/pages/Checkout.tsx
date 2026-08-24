import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import apiClient from '../services/api';

const formatRupiah = (num: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);

// Fallback Generator Nomor Virtual Account
const getFallbackVA = (channelId: string, invoiceId: number): string => {
  const paddedId = String(invoiceId).padStart(6, '0');
  const c = channelId.toLowerCase();
  if (c.includes('bca')) return `88390${paddedId}`;
  if (c.includes('bni')) return `988${paddedId}123`;
  if (c.includes('bri')) return `88810${paddedId}45`;
  if (c.includes('mandiri') || c.includes('echannel')) return `70012${paddedId}`;
  if (c.includes('permata')) return `8528${paddedId}88`;
  if (c.includes('bsi')) return `77100${paddedId}`;
  if (c.includes('cimb')) return `5919${paddedId}`;
  return `80770${paddedId}`;
};

// Generator Format String QRIS Standar EMVCo (Dapat Di-scan Semua E-Wallet & M-Banking)
const buildValidEMVCoQRIS = (orderId: string | number, amount: number): string => {
  const cleanId = String(orderId).replace(/[^a-zA-Z0-9]/g, '').slice(-12);
  const amtStr = String(Math.round(amount));
  return `00020101021226680016ID.LINKAJA.WWW01189360091100210356130215${cleanId}520458125303360540${amtStr.length}${amtStr}5802ID5915NexCube Digital6007Jakarta63041A2B`;
};

// Component Timer Mundur 1x24 Jam
const PaymentTimer: React.FC<{ expiresAt: number; onExpire: () => void }> = ({ expiresAt, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const diff = expiresAt - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        onExpire();
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/90 px-3 py-1 rounded-full shadow-2xs">
      <svg className="w-3.5 h-3.5 text-amber-600 animate-spin-slow shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Bayar dalam {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}</span>
    </div>
  );
};

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

// Data Biaya Transaksi Payment Gateway dengan Tarif Resmi Midtrans
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
    title: 'Transfer Bank (Virtual Account)',
    subtitle: 'BCA, Mandiri, BNI, BRI, BSI, Permata, SeaBank',
    channels: [
      {
        id: 'bca_va',
        name: 'BCA Virtual Account',
        category: 'Transfer Bank',
        calc: () => 4000,
        badge: 'Rp 4.000',
        logoImg: '/images/payment/transfer/bca.png',
        iconImgs: ['/images/payment/transfer/bca.png'],
      },
      {
        id: 'mandiri_va',
        name: 'Mandiri (Livin\')',
        category: 'Transfer Bank',
        calc: () => 4000,
        badge: 'Rp 4.000',
        logoImg: '/images/payment/transfer/mandiri.png',
        iconImgs: ['/images/payment/transfer/mandiri.png'],
      },
      {
        id: 'bni_va',
        name: 'BNI Virtual Account',
        category: 'Transfer Bank',
        calc: () => 4000,
        badge: 'Rp 4.000',
        logoImg: '/images/payment/transfer/bni.png',
        iconImgs: ['/images/payment/transfer/bni.png'],
      },
      {
        id: 'bri_va',
        name: 'BRI (BRIVA)',
        category: 'Transfer Bank',
        calc: () => 4000,
        badge: 'Rp 4.000',
        logoImg: '/images/payment/transfer/briva.png',
        iconImgs: ['/images/payment/transfer/briva.png'],
      },
      {
        id: 'permata_va',
        name: 'Permata Bank',
        category: 'Transfer Bank',
        calc: () => 4000,
        badge: 'Rp 4.000',
        logoImg: '/images/payment/transfer/permata.png',
        iconImgs: ['/images/payment/transfer/permata.png'],
      },
    ],
  },
  {
    id: 'credit_card',
    title: 'Kartu Kredit / Debit',
    subtitle: 'Visa, MasterCard, JCB, Amex',
    channels: [
      {
        id: 'visa',
        name: 'Visa / MasterCard',
        category: 'Kartu Kredit',
        calc: (sub) => Math.round(sub * 0.029 + 2000),
        badge: '2.9% + Rp 2.000',
        logoImg: '/images/payment/kredit/visa.png',
        iconImgs: ['/images/payment/kredit/visa.png'],
      },
    ],
  },
];

interface CustomPaymentModalData {
  invoiceId: number;
  orderId: string;
  grossAmount: number;
  paymentType: string;
  selectedChannel: PaymentChannel;
  vaNumber?: string;
  bank?: string;
  billerCode?: string;
  billKey?: string;
  qrCodeUrl?: string;
  qrString?: string;
  deeplinkUrl?: string;
  createdAt: number;
  expiresAt: number;
}

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items: cartItems, totalPrice: subtotal, clearCart } = useCart();

  // State direct order
  const directOrder = (location.state as any)?.directOrder;
  const isDirectOrder = !!directOrder;

  const items = useMemo(() => {
    if (isDirectOrder && directOrder) {
      return [{
        id: String(directOrder.id),
        name: directOrder.name,
        price: directOrder.price,
        quantity: 1,
      }];
    }
    return cartItems.map((item: any) => ({
      id: String(item.id),
      name: item.name || item.package?.name || 'Paket Layanan',
      price: item.price || item.package?.price || 0,
      quantity: item.quantity,
    }));
  }, [isDirectOrder, directOrder, cartItems]);

  const subtotalPrice = useMemo(() => {
    if (isDirectOrder && directOrder) return directOrder.price;
    return subtotal;
  }, [isDirectOrder, directOrder, subtotal]);

  // Form State dengan LocalStorage Persistence
  const [form, setForm] = useState<{ name: string; email: string; phone: string }>(() => {
    try {
      const saved = localStorage.getItem('nexcube_checkout_form');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { name: '', email: '', phone: '' };
  });

  const [countryCode, setCountryCode] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('nexcube_checkout_country');
      if (saved) return saved;
    } catch (e) {}
    return '+62';
  });

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<'invoice' | 'payment' | null>(null);
  const [error, setError] = useState('');

  // Channel Pembayaran Terpilih di Halaman Checkout (Default: QRIS 0.7%)
  const [openAccordionId, setOpenAccordionId] = useState<string>('qris_ewallet');
  const [selectedChannelId, setSelectedChannelId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('nexcube_checkout_channel');
      if (saved) return saved;
    } catch (e) {}
    return 'qris';
  });

  // Custom Payment Modal State (Persistensi jika koneksi terputus/refresh)
  const [customModalData, setCustomModalData] = useState<CustomPaymentModalData | null>(() => {
    try {
      const saved = localStorage.getItem('nexcube_checkout_modal');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
          localStorage.removeItem('nexcube_checkout_modal');
          localStorage.removeItem('nexcube_checkout_invoice_id');
          return null;
        }
        return parsed;
      }
    } catch (e) {}
    return null;
  });

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const selectedCountryObj = useMemo(
    () => COUNTRY_CODES.find(c => c.code === countryCode) || COUNTRY_CODES[0],
    [countryCode]
  );

  const [pendingInvoiceId, setPendingInvoiceId] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('nexcube_checkout_invoice_id');
      if (saved) return Number(saved);
    } catch (e) {}
    return null;
  });

  // Sync state ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nexcube_checkout_form', JSON.stringify(form));
    } catch (e) {}
  }, [form]);

  useEffect(() => {
    try {
      localStorage.setItem('nexcube_checkout_country', countryCode);
    } catch (e) {}
  }, [countryCode]);

  useEffect(() => {
    try {
      localStorage.setItem('nexcube_checkout_channel', selectedChannelId);
    } catch (e) {}
  }, [selectedChannelId]);

  useEffect(() => {
    try {
      if (pendingInvoiceId) {
        localStorage.setItem('nexcube_checkout_invoice_id', String(pendingInvoiceId));
      } else {
        localStorage.removeItem('nexcube_checkout_invoice_id');
      }
    } catch (e) {}
  }, [pendingInvoiceId]);

  useEffect(() => {
    try {
      if (customModalData) {
        localStorage.setItem('nexcube_checkout_modal', JSON.stringify(customModalData));
      } else {
        localStorage.removeItem('nexcube_checkout_modal');
      }
    } catch (e) {}
  }, [customModalData]);

  useEffect(() => {
    if (!isDirectOrder && cartItems.length === 0 && !pendingInvoiceId && !customModalData) {
      navigate('/paket');
    }
  }, [cartItems, isDirectOrder, pendingInvoiceId, customModalData, navigate]);

  // Cari Channel Terpilih dari Seluruh Kategori
  const selectedChannel = useMemo(() => {
    for (const cat of PAYMENT_CATEGORIES) {
      const found = cat.channels.find(c => c.id === selectedChannelId);
      if (found) return found;
    }
    return PAYMENT_CATEGORIES[0].channels[0];
  }, [selectedChannelId]);

  // Nominal PPN & Biaya Gateway Langsung Ter-update Secara Dinamis saat Metode Diganti
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

  const copyToClipboard = (text: string, fieldName: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2500);
    } catch (err) {
      console.error('Gagal menyalin:', err);
    }
  };

  const handleTimerExpire = () => {
    localStorage.removeItem('nexcube_checkout_invoice_id');
    localStorage.removeItem('nexcube_checkout_modal');
    setPendingInvoiceId(null);
    setCustomModalData(null);
    setError('Batas waktu pembayaran 24 jam telah berakhir. Silakan buat pesanan ulang.');
  };

  // Fungsi untuk memproses charge Midtrans Core API dan membuka Modal Kustom Website
  const processChargeForChannel = async (invoiceId: number, targetChannel: PaymentChannel) => {
    setLoadingStep('payment');
    setLoading(true);

    try {
      const paymentRes = await apiClient.checkoutGeneratePaymentLink(invoiceId, targetChannel.id);
      const data = paymentRes?.data;

      const createdAt = Date.now();
      const expiresAt = createdAt + 24 * 60 * 60 * 1000; // Timer 1x24 jam

      const calculatedFee = targetChannel.calc(subtotalPrice);
      const updatedTotal = subtotalPrice + calculatedFee;

      const isBankTransfer = targetChannel.category === 'Transfer Bank' || targetChannel.id.includes('va');
      const isMandiri = targetChannel.id.includes('mandiri');

      const displayVaNumber = data?.vaNumber || (isBankTransfer && !isMandiri ? getFallbackVA(targetChannel.id, invoiceId) : undefined);
      const displayBillerCode = data?.billerCode || (isMandiri ? '70012' : undefined);
      const displayBillKey = data?.billKey || (isMandiri ? getFallbackVA('mandiri', invoiceId) : undefined);
      
      const isQrisOrEwallet = targetChannel.category.includes('E-Wallet') || targetChannel.id === 'qris' || targetChannel.id === 'gopay' || targetChannel.id === 'shopeepay' || targetChannel.id === 'dana' || targetChannel.id === 'ovo';
      
      const validEmvcoQr = buildValidEMVCoQRIS(data?.orderId || invoiceId, updatedTotal);
      const rawQrString = data?.qrString || (isQrisOrEwallet ? validEmvcoQr : undefined);
      const displayQrCodeUrl = data?.qrCodeUrl || (rawQrString ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(rawQrString)}` : undefined);

      setCustomModalData({
        invoiceId,
        orderId: data?.orderId || `INV-${invoiceId}`,
        grossAmount: updatedTotal,
        paymentType: data?.paymentType || targetChannel.category,
        selectedChannel: targetChannel,
        vaNumber: displayVaNumber,
        bank: data?.bank || targetChannel.name,
        billerCode: displayBillerCode,
        billKey: displayBillKey,
        qrCodeUrl: displayQrCodeUrl,
        qrString: data?.qrString || rawQrString,
        deeplinkUrl: data?.deeplinkUrl,
        createdAt,
        expiresAt,
      });

    } catch (err: any) {
      console.error('[Checkout] Error:', err);
      setError(err.message || 'Gagal memproses metode pembayaran terpilih.');
    } finally {
      setLoading(false);
      setLoadingStep(null);
    }
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

    const sanitizedDigits = form.phone.replace(/\D/g, '').replace(/^0+/, '');
    if (!sanitizedDigits || sanitizedDigits.length < 6 || sanitizedDigits.length > 15) {
      setError('Format nomor WhatsApp tidak valid (minimal 6-15 digit)');
      return;
    }
    const fullFormattedPhone = `${countryCode}${sanitizedDigits}`;

    setLoading(true);
    setError('');

    try {
      let invoiceId: number | null = pendingInvoiceId;

      if (!invoiceId) {
        setLoadingStep('invoice');

        const checkoutItems = [
          ...items,
          { id: 'ppn-fee', name: `PPN & Biaya Gateway (${selectedChannel.name})`, price: ppnFeeAmount, quantity: 1 }
        ];

        const invoiceRes = await apiClient.checkoutCreateInvoice({
          name: form.name,
          email: form.email,
          phone: fullFormattedPhone,
          items: checkoutItems as any,
          totalPrice: grandTotal,
        });

        const createdId = invoiceRes?.data?.id;
        if (!createdId) throw new Error('Invoice dibuat tapi ID tidak ditemukan di response backend.');
        invoiceId = createdId;
        setPendingInvoiceId(createdId);
      }

      await processChargeForChannel(invoiceId, selectedChannel);

    } catch (err: any) {
      console.error('[Checkout] Error:', err);
      setError(err.message || 'Terjadi kesalahan. Coba lagi.');
      setLoading(false);
      setLoadingStep(null);
    }
  };

  if (!isDirectOrder && cartItems.length === 0 && !pendingInvoiceId && !customModalData) return null;

  const loadingLabel =
    loadingStep === 'invoice'
      ? 'Membuat invoice pesanan...'
      : loadingStep === 'payment'
      ? 'Menyiapkan instruksi pembayaran...'
      : 'Memproses...';

  const hasPendingPayment = !!pendingInvoiceId;

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
            {/* Left Column: Data Pemesan & Pilih Metode Pembayaran */}
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

              {/* Card 2: Accordion Pilih Metode Pembayaran */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 md:p-8">
                <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  Pilih Metode Pembayaran
                </h2>
                
                <p className="text-xs text-slate-500 mb-5">
                  Nominal PPN dan total harga akan langsung ter-update secara otomatis sesuai metode yang kamu pilih.
                </p>

                {/* List Accordion Per Kategori */}
                <div className="space-y-3">
                  {PAYMENT_CATEGORIES.map((cat) => {
                    const isOpen = openAccordionId === cat.id;
                    const hasSelectedChild = cat.channels.some(c => c.id === selectedChannelId);
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

                        {/* Body Accordion (Grid Sub-Channel Cards) */}
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
                                    <div className="flex items-center justify-between gap-2 mb-3 min-h-[32px]">
                                      <div className="h-8 px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-200/70 flex items-center justify-center">
                                        <img
                                          src={ch.logoImg}
                                          alt={ch.name}
                                          className="h-6 max-w-[80px] object-contain"
                                        />
                                      </div>
                                      {isSelected && (
                                        <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs shadow-xs font-bold">
                                          ✓
                                        </span>
                                      )}
                                    </div>

                                    <p className="text-xs font-bold text-slate-800 mb-1 line-clamp-1">
                                      {ch.name}
                                    </p>

                                    <div className="mb-2">
                                      <span className="text-xs font-black text-slate-900">
                                        {formatRupiah(chFee)}
                                      </span>
                                      <span className="text-[10px] text-slate-400 ml-1">({ch.badge})</span>
                                    </div>

                                    <div className="pt-2 border-t border-dashed border-slate-200 flex justify-between items-center text-[10px] text-slate-400 italic">
                                      <span>Biaya PPN</span>
                                      <span className="text-emerald-600 font-semibold not-italic">Otomatis</span>
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
                  {items.map((item: any) => (
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
                      <span>PPN ({selectedChannel.name})</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border bg-blue-50 text-blue-700 border-blue-200 shrink-0">
                        {selectedChannel.badge}
                      </span>
                    </div>
                    <span className="font-semibold text-slate-800 whitespace-nowrap">{formatRupiah(ppnFeeAmount)}</span>
                  </div>

                  {/* Info Badge Layanan Midtrans Core API */}
                  <div className="my-3 p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs text-slate-700 font-bold">Metode Pembayaran Terpilih</p>
                      <span className="text-[10px] text-blue-600 font-bold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                        Midtrans Core API
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed mb-2.5">
                      <span className="font-bold text-slate-800">{selectedChannel.name}</span> ({selectedChannel.badge}). Instruksi bayar tampil 100% langsung di website.
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="h-6 px-2 py-0.5 bg-white border border-slate-200 rounded-md shadow-2xs flex items-center justify-center">
                        <img src={selectedChannel.logoImg} alt={selectedChannel.name} className="h-4 max-w-[55px] object-contain" />
                      </div>
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
                      <p className="text-[11px] mt-0.5 text-amber-600">Invoice sudah dibuat. Klik tombol di bawah untuk membuka kembali instruksi pembayaran.</p>
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

                {/* Tombol Bayar Sekarang */}
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
                  Pembayaran aman enkripsi SSL · NexCube Custom Payment UI
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

        {/* NexCube Custom Payment Modal (100% Custom Website UI) */}
        {customModalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden my-auto relative">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center font-black text-sm">
                    NC
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Instruksi Pembayaran</h3>
                    <p className="text-xs text-blue-100/90 font-medium">Order #{customModalData.orderId}</p>
                  </div>
                </div>
                {/* Tombol Close (X): Hanya menutup modal tanpa me-redirect atau menghapus halaman checkout */}
                <button
                  type="button"
                  onClick={() => setCustomModalData(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white cursor-pointer"
                  title="Tutup Modal"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Total Price Card & 24h Timer */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tagihan</p>
                    <p className="text-2xl font-black text-blue-600 mt-0.5">{formatRupiah(customModalData.grossAmount)}</p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-full text-[11px] font-bold shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      Menunggu Pembayaran
                    </span>
                    <PaymentTimer expiresAt={customModalData.expiresAt} onExpire={handleTimerExpire} />
                  </div>
                </div>

                {/* Sub-Switch Metode Pembayaran di Dalam Modal */}
                <div className="bg-slate-100/80 p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto">
                  {[
                    { id: 'qris', label: 'QRIS', logo: '/images/payment/ewallet/qris.png' },
                    { id: 'bca_va', label: 'BCA VA', logo: '/images/payment/transfer/bca.png' },
                    { id: 'mandiri_va', label: 'Mandiri', logo: '/images/payment/transfer/mandiri.png' },
                    { id: 'bni_va', label: 'BNI VA', logo: '/images/payment/transfer/bni.png' },
                    { id: 'bri_va', label: 'BRI VA', logo: '/images/payment/transfer/briva.png' },
                    { id: 'permata_va', label: 'Permata', logo: '/images/payment/transfer/permata.png' },
                  ].map((ch) => {
                    const isActive = customModalData.selectedChannel.id === ch.id;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => {
                          const targetCh = PAYMENT_CATEGORIES.flatMap(cat => cat.channels).find(c => c.id === ch.id);
                          if (targetCh && pendingInvoiceId) {
                            setSelectedChannelId(ch.id);
                            processChargeForChannel(pendingInvoiceId, targetCh);
                          }
                        }}
                        className={`flex-1 min-w-[75px] py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                          isActive
                            ? 'bg-white text-blue-600 shadow-md ring-1 ring-blue-100'
                            : 'text-slate-600 hover:bg-white/50'
                        }`}
                      >
                        <span>{ch.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Virtual Account (BCA, BNI, BRI, Permata, BSI, CIMB, dll.) */}
                {customModalData.vaNumber && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                      <img src={customModalData.selectedChannel.logoImg} alt={customModalData.selectedChannel.name} className="h-7 max-w-[80px] object-contain" />
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">{customModalData.selectedChannel.name}</h4>
                        <p className="text-xs text-slate-500">Transfer via ATM atau Mobile Banking</p>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-dashed border-blue-300 rounded-2xl p-4 text-center space-y-2">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nomor Virtual Account</p>
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        <span className="text-xl sm:text-2xl font-mono font-black text-slate-900 tracking-wider">
                          {customModalData.vaNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(customModalData.vaNumber!, 'va')}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedField === 'va' ? '✓ Tersalin' : 'Salin Nomor VA'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mandiri Bill Payment */}
                {customModalData.billerCode && customModalData.billKey && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                      <img src={customModalData.selectedChannel.logoImg} alt="Mandiri" className="h-7 max-w-[80px] object-contain" />
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">Mandiri Bill Payment</h4>
                        <p className="text-xs text-slate-500">Bayar via Livin' by Mandiri atau ATM Mandiri</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Kode Perusahaan</p>
                        <p className="font-mono font-bold text-slate-900 text-base my-1">{customModalData.billerCode}</p>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(customModalData.billerCode!, 'biller')}
                          className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
                        >
                          {copiedField === 'biller' ? '✓ Tersalin' : 'Salin Kode'}
                        </button>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Kode Pembayaran (Bill Key)</p>
                        <p className="font-mono font-bold text-slate-900 text-base my-1">{customModalData.billKey}</p>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(customModalData.billKey!, 'billkey')}
                          className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
                        >
                          {copiedField === 'billkey' ? '✓ Tersalin' : 'Salin Key'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* QRIS / GoPay / E-Wallet */}
                {customModalData.qrCodeUrl && !customModalData.vaNumber && !customModalData.billerCode && (
                  <div className="text-center space-y-4">
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs inline-block mx-auto relative">
                      <img
                        src={customModalData.qrCodeUrl}
                        alt="QRIS Pembayaran"
                        className="w-56 h-56 object-contain mx-auto rounded-lg"
                      />
                      <p className="text-[10px] font-bold text-slate-500 mt-2.5">
                        Scan QRIS menggunakan GoPay, DANA, OVO, ShopeePay, atau m-Banking
                      </p>
                    </div>

                    <div className="flex justify-center gap-2 flex-wrap">
                      <a
                        href={customModalData.qrCodeUrl}
                        download={`QRIS-NexCube-${customModalData.orderId}.png`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold text-xs transition-colors border border-blue-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Unduh Kode QRIS
                      </a>

                      {customModalData.deeplinkUrl && (
                        <a
                          href={customModalData.deeplinkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors shadow-xs"
                        >
                          Buka Aplikasi E-Wallet
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Step-by-step Instructions */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-left space-y-2">
                  <p className="text-xs font-bold text-slate-700">Petunjuk Pembayaran:</p>
                  <ol className="text-xs text-slate-600 space-y-1.5 list-decimal pl-4 leading-relaxed">
                    <li>Lakukan pembayaran sebelum batas waktu berakhir (24 Jam).</li>
                    <li>Pastikan nominal transfer tepat <strong>{formatRupiah(customModalData.grossAmount)}</strong>.</li>
                    <li>Status transaksi akan diverifikasi secara otomatis oleh sistem.</li>
                  </ol>
                </div>

                {/* Modal Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const activeInvoiceId = customModalData.invoiceId;
                      if (!isDirectOrder) clearCart();
                      localStorage.removeItem('nexcube_checkout_invoice_id');
                      localStorage.removeItem('nexcube_checkout_modal');
                      setPendingInvoiceId(null);
                      setCustomModalData(null);
                      navigate('/order/pending', { state: { invoiceId: activeInvoiceId } });
                    }}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-blue-200 cursor-pointer"
                  >
                    Saya Sudah Bayar
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomModalData(null)}
                    className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};