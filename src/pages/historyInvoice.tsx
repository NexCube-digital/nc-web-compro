import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { InvoicePDFModal } from '../components/InvoicePDFModal';
import apiClient, { Invoice } from '../services/api';

const formatRupiah = (num: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-';
  try {
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(
      new Date(dateStr)
    );
  } catch {
    return dateStr;
  }
};

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'expired';

const STATUS_LABEL: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Menunggu Pembayaran',
  paid: 'Berhasil',
  overdue: 'Jatuh Tempo',
  expired: 'Kadaluarsa',
};

const STATUS_STYLE: Record<InvoiceStatus, string> = {
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
  sent: 'bg-amber-50 text-amber-700 border-amber-200',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  overdue: 'bg-red-50 text-red-700 border-red-200',
  expired: 'bg-slate-100 text-slate-500 border-slate-200',
};

// ── Struktur & tarif metode pembayaran — HARUS SAMA PERSIS dengan Checkout.tsx
// supaya biaya admin yang ditampilkan konsisten di seluruh alur pembayaran.
interface PaymentChannel {
  id: string;
  name: string;
  category: string;
  calc: (subtotal: number) => number;
  badge: string;
  logoImg: string;
}

interface PaymentCategory {
  id: string;
  title: string;
  isBestPrice?: boolean;
  channels: PaymentChannel[];
}

const PAYMENT_CATEGORIES: PaymentCategory[] = [
  {
    id: 'qris_ewallet',
    title: 'QRIS OVO DANA GOPAY SHOPEEPAY, DLL',
    isBestPrice: true,
    channels: [
      {
        id: 'qris',
        name: 'QRIS (All Bank & E-Wallet)',
        category: 'E-Wallet (QRIS)',
        calc: (sub) => Math.round(sub * 0.007),
        badge: '0.7%',
        logoImg: '/images/payment/ewallet/qris.png',
      },
      {
        id: 'gopay',
        name: 'GoPay',
        category: 'GoPay',
        calc: (sub) => Math.round(sub * 0.02),
        badge: '2%',
        logoImg: '/images/payment/ewallet/gopay.png',
      },
      {
        id: 'shopeepay',
        name: 'ShopeePay',
        category: 'ShopeePay',
        calc: (sub) => Math.round(sub * 0.02),
        badge: '2%',
        logoImg: '/images/payment/ewallet/shopeepay.png',
      },
      {
        id: 'dana',
        name: 'DANA',
        category: 'DANA',
        calc: (sub) => Math.round(sub * 0.015),
        badge: '1.5%',
        logoImg: '/images/payment/ewallet/dana.png',
      },
      {
        id: 'ovo',
        name: 'OVO',
        category: 'OVO',
        calc: (sub) => Math.round(sub * 0.015),
        badge: '1.5%',
        logoImg: '/images/payment/ewallet/ovo.png',
      },
    ],
  },
  {
    id: 'virtual_account',
    title: 'Transfer Bank (Virtual Account)',
    channels: [
      {
        id: 'bca_va',
        name: 'BCA Virtual Account',
        category: 'Transfer Bank',
        calc: () => 4000,
        badge: 'Rp 4.000',
        logoImg: '/images/payment/transfer/bca.png',
      },
      {
        id: 'mandiri_va',
        name: "Mandiri (Livin')",
        category: 'Transfer Bank',
        calc: () => 4000,
        badge: 'Rp 4.000',
        logoImg: '/images/payment/transfer/mandiri.png',
      },
      {
        id: 'bni_va',
        name: 'BNI Virtual Account',
        category: 'Transfer Bank',
        calc: () => 4000,
        badge: 'Rp 4.000',
        logoImg: '/images/payment/transfer/bni.png',
      },
      {
        id: 'bri_va',
        name: 'BRI (BRIVA)',
        category: 'Transfer Bank',
        calc: () => 4000,
        badge: 'Rp 4.000',
        logoImg: '/images/payment/transfer/briva.png',
      },
      {
        id: 'permata_va',
        name: 'Permata Bank',
        category: 'Transfer Bank',
        calc: () => 4000,
        badge: 'Rp 4.000',
        logoImg: '/images/payment/transfer/permata.png',
      },
    ],
  },
  {
    id: 'credit_card',
    title: 'Kartu Kredit / Debit',
    channels: [
      {
        id: 'visa',
        name: 'Visa / MasterCard',
        category: 'Kartu Kredit',
        calc: (sub) => Math.round(sub * 0.029 + 2000),
        badge: '2.9% + Rp 2.000',
        logoImg: '/images/payment/kredit/visa.png',
      },
    ],
  },
];

const ALL_CHANNELS: PaymentChannel[] = PAYMENT_CATEGORIES.flatMap((c) => c.channels);

interface PaymentInstructionData {
  orderId: string;
  grossAmount: number;
  vaNumber?: string;
  bank?: string;
  billerCode?: string;
  billKey?: string;
  qrCodeUrl?: string;
  qrString?: string;
  deeplinkUrl?: string;
}

interface PriceBreakdownItem {
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

// Timer mundur batas waktu bayar (1x24 jam)
const PaymentTimer: React.FC<{ expiresAt: number; onExpire: () => void }> = ({ expiresAt, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

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
      <svg className="w-3.5 h-3.5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Sisa waktu {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}</span>
    </div>
  );
};

export const HistoryInvoice: React.FC = () => {
  const navigate = useNavigate();

  // State pencarian
  const [invoiceCodeInput, setInvoiceCodeInput] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [foundInvoice, setFoundInvoice] = useState<Invoice | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // State pemilihan metode pembayaran (sama seperti Checkout: accordion per kategori)
  const [openAccordionId, setOpenAccordionId] = useState<string>('qris_ewallet');
  const [selectedChannelId, setSelectedChannelId] = useState('qris');

  // State pembayaran lanjutan
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentData, setPaymentData] = useState<PaymentInstructionData | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showPDFModal, setShowPDFModal] = useState(false);

  // Status ASLI hasil polling backend (bukan klaim sepihak user)
  const [liveStatus, setLiveStatus] = useState<InvoiceStatus | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const selectedChannel = useMemo(
    () => ALL_CHANNELS.find((c) => c.id === selectedChannelId) || ALL_CHANNELS[0],
    [selectedChannelId]
  );

  // Ambil subtotal ASLI (di luar biaya admin) dari priceBreakdown invoice yang
  // tersimpan saat checkout. Item dengan nama "PPN & Biaya Gateway (...)" adalah
  // biaya admin channel LAMA yang dipilih user pertama kali — harus dikeluarkan
  // dari subtotal supaya perhitungan ulang untuk channel BARU tidak dobel.
  const baseSubtotal = useMemo(() => {
    if (!foundInvoice?.priceBreakdown) return null;
    try {
      const items: PriceBreakdownItem[] =
        typeof foundInvoice.priceBreakdown === 'string'
          ? JSON.parse(foundInvoice.priceBreakdown)
          : (foundInvoice.priceBreakdown as any);

      if (!Array.isArray(items)) return null;

      return items
        .filter((it) => !it.name?.startsWith('PPN & Biaya Gateway'))
        .reduce((sum, it) => sum + (it.subtotal ?? it.price * it.quantity), 0);
    } catch {
      return null;
    }
  }, [foundInvoice]);

  // Kalau subtotal tidak bisa diambil (data lama/rusak), fallback: anggap
  // nominal invoice saat ini sebagai subtotal apa adanya, tanpa hitung ulang biaya.
  const effectiveSubtotal = baseSubtotal ?? (foundInvoice ? Number(foundInvoice.amount) : 0);

  const adminFee = useMemo(() => selectedChannel.calc(effectiveSubtotal), [selectedChannel, effectiveSubtotal]);
  const grandTotal = useMemo(() => effectiveSubtotal + adminFee, [effectiveSubtotal, adminFee]);

  const expiredAtMs = useMemo(() => {
    if (!foundInvoice) return null;
    if (foundInvoice.expiredAt) return new Date(foundInvoice.expiredAt).getTime();
    if (foundInvoice.createdAt) return new Date(foundInvoice.createdAt).getTime() + 24 * 60 * 60 * 1000;
    return null;
  }, [foundInvoice]);

  const currentStatus: InvoiceStatus | null = (liveStatus || (foundInvoice?.status as InvoiceStatus)) ?? null;
  const isPayable = currentStatus === 'draft' || currentStatus === 'sent';

  const resetPaymentState = () => {
    setPaymentData(null);
    setPaymentError('');
    setLiveStatus(null);
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = invoiceCodeInput.trim();
    if (!code) {
      setSearchError('Masukkan kode invoice terlebih dahulu');
      return;
    }

    setSearching(true);
    setSearchError('');
    setFoundInvoice(null);
    setShowPDFModal(false);
    resetPaymentState();
    setHasSearched(true);

    try {
      const res = await apiClient.searchInvoiceByCode(code);
      if (res.data) {
        setFoundInvoice(res.data);
      } else {
        setSearchError('Invoice tidak ditemukan');
      }
    } catch (err: any) {
      setSearchError(err.message || 'Invoice tidak ditemukan, periksa kembali kode invoice Anda');
    } finally {
      setSearching(false);
    }
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

  const handleDownloadPDF = async () => {
    if (!foundInvoice || currentStatus !== 'paid') return;

    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const { jsPDF } = await import('jspdf');
      const element = document.getElementById('kwitansi-print-area');

      if (!element) return;

      const canvas = await html2canvas(element, { scale: 2 });
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(canvas.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${foundInvoice.invoiceNumber}.pdf`);
    } catch (err) {
      console.error('[HistoryInvoice] Gagal membuat PDF:', err);
    }
  };

  // Generate instruksi pembayaran dari invoice yang sudah ada (tidak buat invoice baru).
  // grandTotal (subtotal + biaya admin channel terpilih) dikirim ke backend supaya
  // invoice.amount ikut diperbarui sebelum di-charge ke Midtrans.
  const handleProcessPayment = async () => {
    if (!foundInvoice) return;
    setProcessingPayment(true);
    setPaymentError('');

    try {
      const res = await apiClient.checkoutGeneratePaymentLink(foundInvoice.id, selectedChannelId, grandTotal);
      const data = res?.data as any;

      if (!data) {
        throw new Error('Respons pembayaran dari server kosong. Silakan coba lagi.');
      }

      const isMandiri = selectedChannelId.includes('mandiri');
      const isBankTransfer = selectedChannelId.includes('va');
      const isQrisOrEwallet = ['qris', 'gopay', 'shopeepay', 'dana', 'ovo'].includes(selectedChannelId);

      const displayVaNumber = !isMandiri ? data.vaNumber : undefined;
      const displayBillerCode = isMandiri ? data.billerCode : undefined;
      const displayBillKey = isMandiri ? data.billKey : undefined;
      const rawQrString = data.qrString;
      const displayQrCodeUrl =
        data.qrCodeUrl ||
        (rawQrString
          ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(rawQrString)}`
          : undefined);

      if (isBankTransfer && !isMandiri && !displayVaNumber) {
        throw new Error('Nomor Virtual Account belum tersedia dari Midtrans. Silakan coba lagi atau pilih metode lain.');
      }
      if (isMandiri && (!displayBillerCode || !displayBillKey)) {
        throw new Error('Kode pembayaran Mandiri belum tersedia dari Midtrans. Silakan coba lagi atau pilih metode lain.');
      }
      if (isQrisOrEwallet && !displayQrCodeUrl) {
        throw new Error('Kode QRIS belum tersedia dari Midtrans. Silakan coba lagi atau pilih metode lain.');
      }

      // Nominal invoice sudah diperbarui di backend, sinkronkan juga tampilan lokal
      setFoundInvoice((prev) => (prev ? { ...prev, amount: grandTotal } : prev));
      setLiveStatus('sent');
      setPaymentData({
        orderId: data.orderId || foundInvoice.invoiceNumber,
        grossAmount: data.grossAmount || grandTotal,
        vaNumber: displayVaNumber,
        bank: data.bank || selectedChannel.name,
        billerCode: displayBillerCode,
        billKey: displayBillKey,
        qrCodeUrl: displayQrCodeUrl,
        qrString: rawQrString,
        deeplinkUrl: data.deeplinkUrl,
      });
    } catch (err: any) {
      console.error('[HistoryInvoice] Error:', err);
      setPaymentError(err.message || 'Gagal memproses metode pembayaran terpilih.');
      setPaymentData(null);
    } finally {
      setProcessingPayment(false);
    }
  };

  // Polling status invoice ke backend selagi instruksi pembayaran terbuka.
  useEffect(() => {
    if (!paymentData || !foundInvoice || liveStatus === 'paid') {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      return;
    }

    const check = async () => {
      try {
        const res = await apiClient.checkoutGetInvoiceStatus(foundInvoice.id);
        const status = res?.data?.status as InvoiceStatus | undefined;
        if (status) setLiveStatus(status);
      } catch (err) {
        console.warn('[HistoryInvoice] Gagal cek status invoice:', err);
      }
    };

    check();
    pollRef.current = setInterval(check, 5000);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentData, foundInvoice?.id, liveStatus]);

  const handleTimerExpire = () => {
    setLiveStatus('expired');
    resetPaymentState();
  };

  const handleCloseInstructions = () => {
    resetPaymentState();
  };

  return (
    <Layout>
      <main className="min-h-screen bg-gradient-to-b from-blue-50/60 via-white to-slate-50 pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600 mb-2">Cek Pesanan</p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Riwayat Transaksi</h1>
            <p className="text-slate-500 mt-2 max-w-xl">
              Masukkan kode invoice yang kamu terima saat checkout untuk melihat status pesanan, dan lanjutkan
              pembayaran jika belum lunas.
            </p>
          </div>

          {/* Kotak Pencarian */}
          <form onSubmit={handleSearch} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6 mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kode Invoice</label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={invoiceCodeInput}
                onChange={(e) => {
                  setInvoiceCodeInput(e.target.value);
                  setSearchError('');
                }}
                placeholder="Contoh: INV-20260821-A3F9B"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 font-mono transition-all"
              />
              <button
                type="submit"
                disabled={searching}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                {searching ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Mencari...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                    </svg>
                    Cari
                  </>
                )}
              </button>
            </div>
            {searchError && <p className="text-xs text-red-600 font-medium mt-2.5">{searchError}</p>}
          </form>

          {!foundInvoice && hasSearched && !searching && !searchError && (
            <div className="text-center py-10 text-slate-400 text-sm">Invoice tidak ditemukan.</div>
          )}

          {/* Kartu Hasil */}
          {foundInvoice && (
            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-200 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-slate-400 mb-1">{foundInvoice.invoiceNumber}</p>
                  <h2 className="font-bold text-slate-900 text-lg truncate">
                    {foundInvoice.description || foundInvoice.service || 'Layanan NexCube'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Dibuat {formatDate(foundInvoice.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {currentStatus && (
                    <span className={`px-2.5 py-1 rounded-full border text-[11px] font-bold whitespace-nowrap ${STATUS_STYLE[currentStatus]}`}>
                      {STATUS_LABEL[currentStatus]}
                    </span>
                  )}
                  {currentStatus === 'paid' && (
                    <button
                      type="button"
                      onClick={() => setShowPDFModal(true)}
                      className="p-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors cursor-pointer"
                      title="Preview dan download invoice"
                      aria-label="Preview dan download invoice"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                {isPayable && expiredAtMs && !paymentData && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Batas waktu bayar</span>
                    <PaymentTimer expiresAt={expiredAtMs} onExpire={handleTimerExpire} />
                  </div>
                )}

                {currentStatus === 'paid' && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">Total Tagihan</span>
                      <span className="text-lg font-black text-blue-600">{formatRupiah(Number(foundInvoice.amount))}</span>
                    </div>
                    <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm font-medium flex items-center gap-2.5">
                      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Pembayaran untuk invoice ini sudah lunas. Terima kasih!
                    </div>
                  </>
                )}

                {currentStatus === 'expired' && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-sm">
                    <p className="font-semibold mb-1">Invoice sudah kadaluarsa</p>
                    <p className="text-xs mb-3">
                      Batas waktu 24 jam pembayaran sudah berakhir. Silakan buat pesanan baru untuk melanjutkan.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/paket')}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Pesan Layanan Baru →
                    </button>
                  </div>
                )}

                {/* Accordion Pilih Metode Pembayaran — identik dengan Checkout.tsx */}
                {isPayable && !paymentData && (
                  <div className="pt-1 space-y-3">
                    <p className="text-sm font-semibold text-slate-700">Pilih metode pembayaran:</p>
                    <p className="text-xs text-slate-500 -mt-2">
                      Nominal PPN dan total harga akan otomatis ter-update sesuai metode yang kamu pilih.
                    </p>

                    <div className="space-y-3">
                      {PAYMENT_CATEGORIES.map((cat) => {
                        const isOpen = openAccordionId === cat.id;
                        const hasSelectedChild = cat.channels.some((c) => c.id === selectedChannelId);
                        const firstChannelFee = cat.channels[0].calc(effectiveSubtotal);

                        return (
                          <div
                            key={cat.id}
                            className={`rounded-2xl border transition-all overflow-hidden ${
                              hasSelectedChild ? 'border-blue-500 ring-2 ring-blue-100 bg-blue-50/20' : 'border-slate-200 bg-white'
                            }`}
                          >
                            <div
                              onClick={() => setOpenAccordionId(isOpen ? '' : cat.id)}
                              className={`p-4 rounded-2xl cursor-pointer flex items-center justify-between gap-3 relative transition-all ${
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
                                <h3 className="font-bold text-sm text-slate-900 tracking-tight mb-2">{cat.title}</h3>
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
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>

                            {isOpen && (
                              <div className="p-3 bg-slate-50/50 border-t border-slate-200/80">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                  {cat.channels.map((ch) => {
                                    const isSelected = selectedChannelId === ch.id;
                                    const chFee = ch.calc(effectiveSubtotal);

                                    return (
                                      <div
                                        key={ch.id}
                                        onClick={() => setSelectedChannelId(ch.id)}
                                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
                                          isSelected
                                            ? 'border-blue-500 bg-white ring-2 ring-blue-200 shadow-md'
                                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between gap-2 mb-2.5 min-h-[30px]">
                                          <div className="h-7 px-2 py-1 bg-slate-50 rounded-lg border border-slate-200/70 flex items-center justify-center">
                                            <img src={ch.logoImg} alt={ch.name} className="h-5 max-w-[70px] object-contain" />
                                          </div>
                                          {isSelected && (
                                            <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs shadow-xs font-bold">
                                              ✓
                                            </span>
                                          )}
                                        </div>

                                        <p className="text-xs font-bold text-slate-800 mb-1 line-clamp-1">{ch.name}</p>

                                        <div>
                                          <span className="text-xs font-black text-slate-900">{formatRupiah(chFee)}</span>
                                          <span className="text-[10px] text-slate-400 ml-1">({ch.badge})</span>
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

                    {/* Ringkasan nominal — ikut berubah sesuai channel terpilih */}
                    <div className="border-t border-slate-200 pt-3 space-y-2">
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Subtotal Layanan</span>
                        <span className="font-semibold text-slate-800">{formatRupiah(effectiveSubtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Biaya Admin ({selectedChannel.name})</span>
                        <span className="font-semibold text-slate-800">{formatRupiah(adminFee)}</span>
                      </div>
                      <div className="flex justify-between font-extrabold text-slate-900 text-base pt-2 border-t border-slate-200">
                        <span>Total Pembayaran</span>
                        <span className="text-blue-600">{formatRupiah(grandTotal)}</span>
                      </div>
                    </div>

                    {paymentError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {paymentError}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleProcessPayment}
                      disabled={processingPayment}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
                    >
                      {processingPayment ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Menyiapkan instruksi pembayaran...
                        </>
                      ) : (
                        <>Bayar Sekarang — {formatRupiah(grandTotal)}</>
                      )}
                    </button>
                  </div>
                )}

                {/* Instruksi Pembayaran */}
                {paymentData && liveStatus !== 'paid' && (
                  <div className="pt-3 border-t border-slate-200 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-slate-500">Total Tagihan</p>
                        <p className="text-lg font-black text-blue-600">{formatRupiah(paymentData.grossAmount)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-full text-[11px] font-bold">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                          Menunggu Pembayaran
                        </span>
                        {expiredAtMs && <PaymentTimer expiresAt={expiredAtMs} onExpire={handleTimerExpire} />}
                      </div>
                    </div>

                    {paymentData.vaNumber && (
                      <div className="bg-white border-2 border-dashed border-blue-300 rounded-2xl p-4 text-center space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Nomor Virtual Account {paymentData.bank ? `— ${paymentData.bank}` : ''}
                        </p>
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          <span className="text-xl font-mono font-black text-slate-900 tracking-wider">
                            {paymentData.vaNumber}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(paymentData.vaNumber!, 'va')}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
                          >
                            {copiedField === 'va' ? '✓ Tersalin' : 'Salin Nomor'}
                          </button>
                        </div>
                      </div>
                    )}

                    {paymentData.billerCode && paymentData.billKey && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Kode Perusahaan</p>
                          <p className="font-mono font-bold text-slate-900 text-base my-1">{paymentData.billerCode}</p>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(paymentData.billerCode!, 'biller')}
                            className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
                          >
                            {copiedField === 'biller' ? '✓ Tersalin' : 'Salin Kode'}
                          </button>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Bill Key</p>
                          <p className="font-mono font-bold text-slate-900 text-base my-1">{paymentData.billKey}</p>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(paymentData.billKey!, 'billkey')}
                            className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
                          >
                            {copiedField === 'billkey' ? '✓ Tersalin' : 'Salin Key'}
                          </button>
                        </div>
                      </div>
                    )}

                    {paymentData.qrCodeUrl && !paymentData.vaNumber && !paymentData.billerCode && (
                      <div className="text-center space-y-3">
                        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs inline-block mx-auto">
                          <img
                            src={paymentData.qrCodeUrl}
                            alt="QRIS Pembayaran"
                            className="w-48 h-48 object-contain mx-auto rounded-lg"
                          />
                        </div>
                        {paymentData.deeplinkUrl && (
                          <a
                            href={paymentData.deeplinkUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors shadow-xs"
                          >
                            Buka Aplikasi E-Wallet
                          </a>
                        )}
                      </div>
                    )}

                    <p className="text-[11px] text-slate-400 text-center">
                      Status akan otomatis terverifikasi begitu pembayaran diterima — tidak perlu klik apa pun.
                    </p>

                    <button
                      type="button"
                      onClick={handleCloseInstructions}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Tutup Instruksi
                    </button>
                  </div>
                )}

                {liveStatus === 'paid' && (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center space-y-2">
                    <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                      <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="font-bold text-emerald-700">Pembayaran Berhasil!</p>
                    <p className="text-xs text-emerald-600">Invoice {foundInvoice.invoiceNumber} telah lunas. Terima kasih.</p>
                  </div>
                )}
              </div>
            </section>
          )}

          <p className="text-center text-xs text-slate-400 mt-6">
            Tidak menemukan invoice? Pastikan kode yang dimasukkan sesuai dengan yang dikirim ke email kamu saat
            checkout.
          </p>

          {foundInvoice && currentStatus === 'paid' && (
            <InvoicePDFModal
              invoice={foundInvoice}
              isOpen={showPDFModal}
              onClose={() => setShowPDFModal(false)}
              onDownload={handleDownloadPDF}
            />
          )}
        </div>
      </main>
    </Layout>
  );
};

export default HistoryInvoice;