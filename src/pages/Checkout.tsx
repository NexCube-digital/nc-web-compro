import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import apiClient from '../services/api';

const formatRupiah = (num: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);

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
  invoiceNumber: string;
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

const getDisplayInvoiceNumber = (orderId: string): string => orderId.replace(/-\d{13,}$/, '');

// ✅ FIX v2: helper untuk membuat "sidik jari" dari isi pesanan (item + total).
// Dipakai sebagai KEY di dalam peta (map) invoice — bukan slot tunggal — supaya
// tiap kombinasi pesanan (jasa A, jasa B, dst) punya invoice pending-nya
// masing-masing dan bisa di-resume kapan pun user kembali ke kombinasi itu,
// walau di antaranya sempat ganti-ganti ke kombinasi lain.
const computeOrderSignature = (its: { id: string; quantity: number }[], total: number): string =>
  its.map((i) => `${i.id}x${i.quantity}`).sort().join(',') + `::${total}`;

// Status pembayaran invoice yang di-polling dari backend (bukan klaim sepihak user)
type PaidStatus = 'pending' | 'paid';

// ✅ FIX v2: struktur record invoice pending per signature pesanan.
interface StoredOrderRecord {
  invoiceId: number;
  modalData: CustomPaymentModalData | null;
  createdAt: number;
  expiresAt: number; // 24 jam sejak invoice dibuat — dipakai untuk auto-bersihkan record basi
}

type OrdersMap = Record<string, StoredOrderRecord>;

const ORDERS_STORAGE_KEY = 'nexcube_checkout_orders_v2';

// Baca peta invoice dari localStorage, sekaligus buang entri yang sudah expired (>24 jam)
// supaya localStorage tidak menumpuk record basi selamanya.
const loadOrdersMap = (): OrdersMap => {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as OrdersMap;
    const now = Date.now();
    let changed = false;
    for (const key of Object.keys(parsed)) {
      if (parsed[key]?.expiresAt && now > parsed[key].expiresAt) {
        delete parsed[key];
        changed = true;
      }
    }
    if (changed) {
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(parsed));
      } catch (e) {}
    }
    return parsed;
  } catch (e) {
    return {};
  }
};

const saveOrdersMap = (map: OrdersMap): void => {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(map));
  } catch (e) {}
};

// Hapus record berdasarkan invoiceId (dipakai saat expired/selesai/dibatalkan),
// tanpa perlu tahu signature-nya persis — lebih aman kalau cart sempat berubah.
const removeOrderRecordByInvoiceId = (invoiceId: number | null | undefined): void => {
  if (!invoiceId) return;
  const map = loadOrdersMap();
  let changed = false;
  for (const key of Object.keys(map)) {
    if (map[key]?.invoiceId === invoiceId) {
      delete map[key];
      changed = true;
    }
  }
  if (changed) saveOrdersMap(map);
};

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

  // ✅ FIX v2: customModalData TIDAK lagi diinisialisasi langsung dari satu key
  // localStorage tunggal. Sumber kebenarannya sekarang adalah `ordersMap` (peta
  // per-signature pesanan) — resolusi awal dilakukan oleh useEffect di bawah,
  // begitu `items` (isi keranjang/direct order) sudah siap.
  const [customModalData, setCustomModalData] = useState<CustomPaymentModalData | null>(null);

  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Status pembayaran ASLI, hasil polling ke backend — bukan klaim klik user.
  const [paidStatus, setPaidStatus] = useState<PaidStatus>('pending');
  const [checkingStatus, setCheckingStatus] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const selectedCountryObj = useMemo(
    () => COUNTRY_CODES.find(c => c.code === countryCode) || COUNTRY_CODES[0],
    [countryCode]
  );

  // ✅ FIX v2: sama seperti customModalData, pendingInvoiceId juga di-resolve dari
  // ordersMap lewat useEffect di bawah, bukan dari key localStorage tunggal.
  const [pendingInvoiceId, setPendingInvoiceId] = useState<number | null>(null);

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

  // ✅ FIX v2: pendingInvoiceId & customModalData TIDAK lagi disinkronkan ke
  // satu key localStorage tunggal di sini. Penulisan ke localStorage sekarang
  // terjadi lewat `ordersMap` (di handlePay & processChargeForChannel), dan
  // pembacaannya lewat efek resolve-by-signature di bawah. Ini yang memungkinkan
  // beberapa kombinasi pesanan pending disimpan berdampingan tanpa saling timpa.

  useEffect(() => {
    if (!isDirectOrder && cartItems.length === 0 && !pendingInvoiceId && !customModalData) {
      navigate('/paket');
    }
  }, [cartItems, isDirectOrder, pendingInvoiceId, customModalData, navigate]);

  // ✅ FIX v2: Setiap kali kombinasi pesanan aktif berubah (tambah/hapus/ganti
  // jasa di keranjang, atau direct order berbeda), cari di `ordersMap` apakah
  // kombinasi yang SEKARANG aktif itu punya invoice pending yang pernah dibuat
  // sebelumnya:
  //   • Ketemu & belum expired → RESUME invoice/modal itu (bukan bikin baru).
  //     Ini yang memperbaiki kasus: pesan A → ganti B → balik lagi ke A →
  //     invoice A yang lama tetap dipakai, bukan invoice A yang baru.
  //   • Tidak ketemu → kombinasi ini belum punya invoice pending, jadi
  //     tampilan direset ke "belum ada pembayaran pending" (tapi invoice milik
  //     kombinasi LAIN tetap aman tersimpan di ordersMap, tidak terhapus).
  useEffect(() => {
    if (items.length === 0) return; // cart/direct order belum siap, jangan proses dulu

    const signature = computeOrderSignature(items, subtotalPrice);
    const ordersMap = loadOrdersMap();
    const record = ordersMap[signature];

    if (record) {
      setPendingInvoiceId(record.invoiceId);
      setCustomModalData(record.modalData);
      setPaidStatus('pending');
    } else {
      setPendingInvoiceId(null);
      setCustomModalData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, subtotalPrice]);

  /**
   * Polling status invoice ke backend selagi modal pembayaran terbuka.
   *
   * PENTING: status "paid" di sini HARUS berasal dari backend (yang diupdate oleh
   * webhook/notifikasi Midtrans setelah settlement asli), bukan dari klik tombol
   * user. Ini menggantikan tombol "Saya Sudah Bayar" yang sebelumnya hanya klaim
   * sepihak dan tidak pernah memverifikasi apa pun ke Midtrans.
   *
   * apiClient.checkoutGetInvoiceStatus(invoiceId) diasumsikan memanggil endpoint
   * publik yang HANYA mengembalikan { status } (tanpa data sensitif lain), mis.
   * GET /api/public/invoices/:id/status — lihat catatan backend.
   */
  useEffect(() => {
    if (!customModalData || paidStatus === 'paid') {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      return;
    }

    const invoiceId = customModalData.invoiceId;

    const check = async () => {
      try {
        setCheckingStatus(true);
        const res = await apiClient.checkoutGetInvoiceStatus(invoiceId);
        const status = res?.data?.status;
        if (status === 'paid') {
          setPaidStatus('paid');
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
        }
      } catch (err) {
        // Diamkan error polling — jangan ganggu UX, coba lagi di interval berikutnya
        console.warn('[Checkout] Gagal cek status invoice:', err);
      } finally {
        setCheckingStatus(false);
      }
    };

    check(); // cek sekali langsung saat modal dibuka
    pollRef.current = setInterval(check, 5000); // lalu polling tiap 5 detik

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customModalData?.invoiceId, paidStatus]);

  // Reset status paid setiap kali modal untuk invoice/channel baru dibuka
  useEffect(() => {
    if (customModalData) setPaidStatus('pending');
  }, [customModalData?.orderId]);

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
    // ✅ FIX v2: hapus record invoice ini dari ordersMap berdasarkan invoiceId
    // (bukan berdasarkan signature aktif saat ini), supaya tetap tepat sasaran
    // meski cart sudah berubah sejak modal ini pertama dibuka.
    removeOrderRecordByInvoiceId(pendingInvoiceId ?? customModalData?.invoiceId);
    setPendingInvoiceId(null);
    setCustomModalData(null);
    setPaidStatus('pending');
    setError('Batas waktu pembayaran 24 jam telah berakhir. Silakan buat pesanan ulang.');
  };

  // Menutup modal saja — tidak menghapus invoice/pesanan, dan tidak melakukan klaim apa pun.
  // Kalau user memang belum bayar, invoice tetap "pending" dan bisa dibuka lagi lewat
  // "Lanjutkan Pembayaran". Kalau ternyata sudah bayar, polling/webhook yang akan
  // mengonfirmasi otomatis lain kali modal dibuka atau saat SSE/notifikasi masuk.
  const handleCloseModal = () => {
    setCustomModalData(null);
  };

  // ✅ FIX v2: Batalkan invoice pending untuk kombinasi pesanan yang SEKARANG
  // aktif secara eksplisit (dipicu tombol user) — dipakai kalau user memang mau
  // mulai ulang walau kombinasi jasanya sama seperti invoice pending yang ada.
  const handleCancelPendingOrder = () => {
    removeOrderRecordByInvoiceId(pendingInvoiceId ?? customModalData?.invoiceId);
    setPendingInvoiceId(null);
    setCustomModalData(null);
    setPaidStatus('pending');
  };

  // Dipanggil user setelah melihat konfirmasi sukses (ceklis) — baru di sini kita
  // aman membersihkan cart & mengarahkan ke halaman pesanan, karena statusnya
  // sudah terverifikasi backend, bukan klaim user.
  const handleFinishAfterPaid = () => {
    const activeInvoiceId = customModalData?.invoiceId;
    if (!isDirectOrder) clearCart();
    // ✅ FIX v2: bersihkan record invoice yang sudah lunas ini dari ordersMap,
    // supaya tidak ikut ke-resume lagi di kemudian hari.
    removeOrderRecordByInvoiceId(activeInvoiceId);
    setPendingInvoiceId(null);
    setCustomModalData(null);
    setPaidStatus('pending');
    navigate('/order/pending', { state: { invoiceId: activeInvoiceId } });
  };

  /**
   * Fungsi untuk memproses charge Midtrans Core API dan membuka Modal Kustom Website.
   *
   * PENTING: Fungsi ini HANYA menampilkan data pembayaran (nomor VA, kode QRIS, dll)
   * yang benar-benar dikembalikan oleh backend (yang berasal dari Midtrans).
   * Sebelumnya ada fallback yang "mengarang" nomor VA / string QRIS sendiri di
   * frontend kalau backend gagal mengirim data asli — itu sebabnya transaksi tidak
   * pernah bisa berstatus "paid": nomor/QR yang ditampilkan ke user tidak pernah
   * terdaftar di Midtrans, jadi transfer/scan apa pun tidak akan pernah trigger
   * webhook settlement. Fallback itu sudah dihapus.
   */
  const processChargeForChannel = async (invoiceId: number, targetChannel: PaymentChannel) => {
    setLoadingStep('payment');
    setLoading(true);
    setError('');

    try {
      const paymentRes = await apiClient.checkoutGeneratePaymentLink(invoiceId, targetChannel.id);
      const data = paymentRes?.data;

      if (!data) {
        throw new Error('Respons pembayaran dari server kosong. Silakan coba lagi.');
      }

      const createdAt = Date.now();
      const expiresAt = createdAt + 24 * 60 * 60 * 1000; // Timer 1x24 jam

      const calculatedFee = targetChannel.calc(subtotalPrice);
      const updatedTotal = subtotalPrice + calculatedFee;

      const isBankTransfer = targetChannel.category === 'Transfer Bank' || targetChannel.id.includes('va');
      const isMandiri = targetChannel.id.includes('mandiri');
      const isQrisOrEwallet =
        targetChannel.category.includes('E-Wallet') ||
        ['qris', 'gopay', 'shopeepay', 'dana', 'ovo'].includes(targetChannel.id);

      // Hanya pakai data ASLI dari Midtrans (via backend). Tidak ada fabrikasi di sisi client.
      const displayVaNumber = !isMandiri ? data.vaNumber : undefined;
      const displayBillerCode = isMandiri ? data.billerCode : undefined;
      const displayBillKey = isMandiri ? data.billKey : undefined;

      // qrCodeUrl: pakai langsung dari backend kalau tersedia. Kalau backend hanya
      // memberi qrString (payload EMVCo ASLI dari Midtrans), generate gambar QR dari
      // string asli tsb — ini hanya proses render gambar, bukan membuat data baru.
      const rawQrString = data.qrString;
      const displayQrCodeUrl =
        data.qrCodeUrl ||
        (rawQrString
          ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(rawQrString)}`
          : undefined);

      // Validasi: pastikan instruksi pembayaran yang relevan untuk channel ini
      // benar-benar tersedia dari Midtrans sebelum ditampilkan ke user.
      if (isBankTransfer && !isMandiri && !displayVaNumber) {
        throw new Error('Nomor Virtual Account belum tersedia dari Midtrans. Silakan coba lagi atau pilih metode lain.');
      }
      if (isMandiri && (!displayBillerCode || !displayBillKey)) {
        throw new Error('Kode pembayaran Mandiri belum tersedia dari Midtrans. Silakan coba lagi atau pilih metode lain.');
      }
      if (isQrisOrEwallet && !displayQrCodeUrl) {
        throw new Error('Kode QRIS belum tersedia dari Midtrans. Silakan coba lagi atau pilih metode lain.');
      }

      const newModalData: CustomPaymentModalData = {
        invoiceId,
        orderId: data.orderId || `INV-${invoiceId}`,
        invoiceNumber: getDisplayInvoiceNumber(data.orderId || `INV-${invoiceId}`),
        grossAmount: data.grossAmount || updatedTotal,
        paymentType: data.paymentType || targetChannel.category,
        selectedChannel: targetChannel,
        vaNumber: displayVaNumber,
        bank: data.bank || targetChannel.name,
        billerCode: displayBillerCode,
        billKey: displayBillKey,
        qrCodeUrl: displayQrCodeUrl,
        qrString: rawQrString,
        deeplinkUrl: data.deeplinkUrl,
        createdAt,
        expiresAt,
      };

      setPaidStatus('pending');
      setCustomModalData(newModalData);

      // ✅ FIX v2: simpan modalData ini ke record ordersMap milik kombinasi
      // pesanan yang SEKARANG aktif, supaya kalau user pindah ke kombinasi lain
      // lalu balik lagi ke sini, instruksi pembayaran (VA/QR) yang sama muncul
      // lagi tanpa perlu generate payment link baru ke Midtrans.
      const signature = computeOrderSignature(items, subtotalPrice);
      const ordersMap = loadOrdersMap();
      if (ordersMap[signature]) {
        ordersMap[signature] = { ...ordersMap[signature], modalData: newModalData };
        saveOrdersMap(ordersMap);
      }

    } catch (err: any) {
      console.error('[Checkout] Error:', err);
      setError(err.message || 'Gagal memproses metode pembayaran terpilih.');
      // Jangan tampilkan modal dengan data yang tidak valid/tidak lengkap.
      setCustomModalData(null);
    } finally {
      setLoading(false);
      setLoadingStep(null);
    }
  };

  /**
   * ✅ FIX v3 — Edit data / channel untuk invoice pending yang SUDAH ada:
   *
   * Sebelumnya: begitu invoice pending ada (`pendingInvoiceId`), semua input
   * form (nama/email/nomor WA) dan pemilihan channel di-disable. Ini salah,
   * karena user seharusnya BOLEH:
   *   1. Ubah salah satu field (nama saja / email saja / nomor saja), atau
   *   2. Ubah semuanya, dengan jasa/pesanan yang tetap sama, atau
   *   3. Ganti channel pembayaran untuk invoice yang sama.
   *
   * Solusinya BUKAN membuat invoice baru (itu akan membuat invoice/order_id
   * dobel di Midtrans untuk pesanan yang sama), tapi:
   *   • Kalau invoice pending SUDAH ada → panggil apiClient.updateInvoice()
   *     untuk sinkronkan nama/email/nomor & nominal terbaru ke invoice yang
   *     sudah ada, BARU lanjut generate/reuse instruksi pembayaran.
   *   • Kalau channel yang dipilih PERSIS SAMA dengan instruksi pembayaran
   *     terakhir yang sudah pernah digenerate & belum expired → jangan panggil
   *     Midtrans lagi, cukup tampilkan lagi modal yang sudah ada. Ini menghindari
   *     resiko error "order_id sudah dipakai" di Midtrans akibat charge ulang
   *     untuk channel & invoice yang sama persis.
   *   • Kalau channel BERBEDA (atau belum pernah ada instruksi sama sekali)
   *     → baru generate payment link baru via processChargeForChannel().
   */
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

      const checkoutItems = [
        ...items,
        { id: 'ppn-fee', name: `PPN & Biaya Gateway (${selectedChannel.name})`, price: ppnFeeAmount, quantity: 1 }
      ];

      if (!invoiceId) {
        // ── Belum ada invoice pending sama sekali → buat baru seperti biasa ──
        setLoadingStep('invoice');

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

        // ✅ FIX v2: daftarkan invoice baru ini ke ordersMap, dikunci dengan
        // signature kombinasi pesanan yang SEKARANG aktif. Kombinasi pesanan
        // lain (kalau ada) yang sudah tersimpan sebelumnya TIDAK tersentuh —
        // jadi kalau user nanti balik ke kombinasi itu, invoice-nya tetap ada.
        const signature = computeOrderSignature(items, subtotalPrice);
        const createdAt = Date.now();
        const expiresAt = createdAt + 24 * 60 * 60 * 1000;
        const ordersMap = loadOrdersMap();
        ordersMap[signature] = { invoiceId: createdId, modalData: null, createdAt, expiresAt };
        saveOrdersMap(ordersMap);
      } else {
        // ── Invoice pending SUDAH ada → update data pemesan & nominal di invoice
        //    yang sama, JANGAN bikin invoice baru (supaya tidak dobel di Midtrans). ──
        setLoadingStep('invoice');

        await apiClient.updateInvoice(String(invoiceId), {
          clientName: form.name,
          clientEmail: form.email,
          // @ts-ignore — "phone" dikirim mentah ke backend, sama seperti saat create invoice
          phone: fullFormattedPhone,
          amount: grandTotal,
          description: checkoutItems.map((i) => `${i.name} ×${i.quantity}`).join(', '),
          priceBreakdown: checkoutItems.map((i) => ({
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            subtotal: i.price * i.quantity,
          })) as any,
        });

        // Pastikan record di ordersMap tetap konsisten (signature bisa berubah
        // kalau nominal/channel berubah), tapi invoiceId & modalData lama dipertahankan.
        const signature = computeOrderSignature(items, subtotalPrice);
        const ordersMap = loadOrdersMap();
        let existingRecord: StoredOrderRecord | undefined;
        for (const key of Object.keys(ordersMap)) {
          if (ordersMap[key]?.invoiceId === invoiceId) {
            existingRecord = ordersMap[key];
            if (key !== signature) delete ordersMap[key];
          }
        }
        ordersMap[signature] = {
          invoiceId,
          modalData: existingRecord?.modalData ?? null,
          createdAt: existingRecord?.createdAt ?? Date.now(),
          expiresAt: existingRecord?.expiresAt ?? (Date.now() + 24 * 60 * 60 * 1000),
        };
        saveOrdersMap(ordersMap);
      }

      // ── Bonus optimasi: reuse instruksi pembayaran lama kalau channel yang
      //    dipilih PERSIS SAMA dengan instruksi terakhir & belum expired ──
      const canReuseExistingInstruction =
        !!customModalData &&
        customModalData.invoiceId === invoiceId &&
        customModalData.selectedChannel.id === selectedChannel.id &&
        Date.now() < customModalData.expiresAt;

      if (canReuseExistingInstruction) {
        setPaidStatus('pending');
        setLoading(false);
        setLoadingStep(null);
      } else {
        await processChargeForChannel(invoiceId, selectedChannel);
      }

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
      ? 'Menyimpan data pesanan...'
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
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Konfirmasi Pesanan</h1>
              <p className="text-slate-500 mt-1">
                {isDirectOrder
                  ? 'Pemesanan langsung — keranjang kamu tidak terpengaruh'
                  : 'Lengkapi data diri untuk melanjutkan pembayaran'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/history-invoice')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-blue-200 bg-white text-blue-700 hover:bg-blue-50 transition-colors text-sm font-bold shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Riwayat Transaksi
            </button>
          </div>
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

                {hasPendingPayment && (
                  <div className="mb-5 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-xs font-semibold flex items-start gap-2">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Kamu masih bisa mengubah data di bawah (nama, email, atau nomor WhatsApp — salah satu atau semuanya) untuk pesanan yang sama ini. Klik "Lanjutkan Pembayaran" untuk menyimpan perubahan.</span>
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text" name="name" value={form.name} onChange={handleChange}
                      placeholder="Contoh: Budi Santoso"
                      disabled={loading}
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
                      disabled={loading}
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
                          disabled={loading}
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
                        disabled={loading}
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
                    <div className="flex-1">
                      <p className="font-semibold text-xs">Pembayaran belum selesai</p>
                      <p className="text-[11px] mt-0.5 text-amber-600">Invoice sudah dibuat. Kamu bisa ubah data/metode di atas lalu klik tombol di bawah, atau langsung lanjutkan pembayaran seperti semula.</p>
                      {/* ✅ FIX: tombol eksplisit untuk membatalkan invoice pending & mulai baru */}
                      <button
                        type="button"
                        onClick={handleCancelPendingOrder}
                        className="mt-2 text-[11px] font-bold text-amber-700 underline hover:text-amber-900 cursor-pointer"
                      >
                        Batalkan pesanan ini & buat baru
                      </button>
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
        {customModalData && paidStatus !== 'paid' && (
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
                    <p className="text-xs text-blue-100/90 font-medium">Invoice Number: {customModalData.invoiceNumber}</p>
                  </div>
                </div>
                {/* Tombol Close (X): Hanya menutup modal tanpa me-redirect atau menghapus halaman checkout */}
                <button
                  type="button"
                  onClick={handleCloseModal}
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
                      {checkingStatus ? 'Mengecek status...' : 'Menunggu Pembayaran'}
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
                        download={`QRIS-NexCube-${customModalData.invoiceNumber}.png`}
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
                    <li>Status transaksi akan diverifikasi secara otomatis oleh sistem — halaman ini akan otomatis menampilkan konfirmasi begitu pembayaran diterima, tidak perlu klik apa pun.</li>
                  </ol>
                </div>

                {/* Modal Action Button — hanya Tutup. Konfirmasi sukses ditampilkan otomatis
                    (lihat overlay paidStatus === 'paid' di bawah) begitu backend memverifikasi
                    settlement dari Midtrans, bukan dari klaim klik user. */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Sukses — muncul otomatis begitu status invoice = 'paid' terverifikasi backend */}
        {customModalData && paidStatus === 'paid' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-sm w-full overflow-hidden my-auto p-8 text-center space-y-5">
              <div className="mx-auto w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-slate-900">Pembayaran Berhasil!</h3>
                <p className="text-sm text-slate-500">
                  Invoice Number <span className="font-semibold text-slate-700">{customModalData.invoiceNumber}</span> sebesar{' '}
                  <span className="font-semibold text-slate-700">{formatRupiah(customModalData.grossAmount)}</span> telah kami terima.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-xs font-medium">
                Tim kami akan segera memproses pesananmu. Bukti & invoice sudah dikirim ke email kamu.
              </div>

              <button
                type="button"
                onClick={handleFinishAfterPaid}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-blue-200 cursor-pointer"
              >
                Lihat Status Pesanan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};