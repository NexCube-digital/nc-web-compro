import React, { useEffect, useState } from 'react'
import { Finance } from '../../../services/api'
import { CsvImportModal, downloadCsvTemplate } from './CsvImportModal'

interface FormFinanceProps {
  formData: Omit<Finance, 'id' | 'createdAt' | 'updatedAt'>;
  editingId: string | null;
  loading: boolean;
  division?: 'nexcube' | 'printing';
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSetFormFields?: (fields: Partial<Omit<Finance, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  onImportSuccess?: () => Promise<void>;
}

const PAYMENT_METHODS = ['Cash / Tunai', 'Qris', 'Bank Transfer', 'E-wallet', 'Check', 'Credit Card'];

// Kategori Keuangan NexCube
const NEXCUBE_INCOME_CATEGORIES = [
  'Project Payment',
  'Deposit',
  'Website & App',
  'Desain Grafis',
  'Digital Marketing',
  'Other'
];

const NEXCUBE_EXPENSE_CATEGORIES = [
  'Salary',
  'Office Supplies',
  'Equipment',
  'Marketing',
  'Utilities',
  'Maintenance',
  'Server & Hosting',
  'Other'
];

// Kategori Keuangan Printing (Sesuai Struktur P&L User)
const PRINTING_INCOME_CATEGORIES = [
  'Print Dokumen & Tugas',
  'Print Foto, Stiker & Sertifikat',
  'Jasa Cetak Kertas Sendiri',
  'Lainnya'
];

const PRINTING_EXPENSE_CATEGORIES = [
  'Bahan Baku (HPP)',
  'Gaji Karyawan',
  'Operasional & Utilitas',
  'Sewa Tempat',
  'Pemasaran & Iklan',
  'Perlengkapan & Logistik',
  'Lainnya'
];

// Acuan Kasir / Daftar Harga Cepat Printing
export const PRINTING_PRICELIST = [
  { id: 1, name: 'Print Dokumen & Tugas 75gsm B&W', spec: 'HVS 75gsm Hitam Putih (A4/F4)', price: 400, category: 'Print Dokumen & Tugas', note: 'Rp 2.000 / 5 pcs' },
  { id: 2, name: 'Print Dokumen & Tugas 75gsm Color', spec: 'HVS 75gsm Berwarna (A4/F4)', price: 800, category: 'Print Dokumen & Tugas', note: 'Rp 2.000 / 3 pcs' },
  { id: 3, name: 'Print Dokumen & Tugas 80gsm B&W', spec: 'HVS 80gsm Tebal Hitam Putih', price: 500, category: 'Print Dokumen & Tugas', note: 'Rp 2.500 / 5 pcs' },
  { id: 4, name: 'Print Dokumen & Tugas 80gsm Color', spec: 'HVS 80gsm Tebal Berwarna', price: 1500, category: 'Print Dokumen & Tugas', note: 'Rp 3.500 / 3 pcs' },
  { id: 5, name: 'Print Sertifikat', spec: 'Linen / Concorde / Art Carton A4', price: 3500, category: 'Print Foto, Stiker & Sertifikat', note: 'Rp 15.000 / 5 pcs' },
  { id: 6, name: 'Print Foto', spec: 'Glossy Photo Paper High-Res (4R/A4)', price: 5000, category: 'Print Foto, Stiker & Sertifikat', note: 'Rp 12.000 / 3 pcs' },
  { id: 7, name: 'Print Stiker', spec: 'Bontax / Cromo / Vinyl A4', price: 4000, category: 'Print Foto, Stiker & Sertifikat', note: 'Rp 7.000 / 2 pcs' },
  { id: 8, name: 'Print Bawa Kertas Sendiri', spec: 'Jasa Cetak / Tinta Saja', price: 300, category: 'Jasa Cetak Kertas Sendiri', note: 'Rp 300 / pcs' },
];

const FINANCE_STATUSES = ['pending', 'completed', 'cancelled'] as const;

const formatAmountToId = (value: string): string => {
  const numericOnly = value.replace(/\D/g, '');
  if (!numericOnly) return '';
  return Number(numericOnly).toLocaleString('id-ID');
};

export const FormFinance: React.FC<FormFinanceProps> = ({
  formData,
  editingId,
  loading,
  division = 'nexcube',
  onInputChange,
  onSetFormFields,
  onSubmit,
  onCancel,
  onImportSuccess
}) => {
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [amountDisplay, setAmountDisplay] = useState(
    formData.amount > 0 ? Number(formData.amount).toLocaleString('id-ID') : ''
  );

  // State untuk Quick Pos/Kasir Printing
  const [selectedServiceId, setSelectedServiceId] = useState<number | ''>('');
  const [serviceQty, setServiceQty] = useState<number>(1);

  useEffect(() => {
    setAmountDisplay(formData.amount > 0 ? Number(formData.amount).toLocaleString('id-ID') : '');
  }, [formData.amount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatAmountToId(e.target.value);
    const numericValue = formattedValue.replace(/\D/g, '');

    setAmountDisplay(formattedValue);

    onInputChange({
      target: {
        name: 'amount',
        value: numericValue
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // Pilih kategori sesuai tipe transaksi dan divisi
  const availableCategories = division === 'printing'
    ? (formData.type === 'income' ? PRINTING_INCOME_CATEGORIES : PRINTING_EXPENSE_CATEGORIES)
    : (formData.type === 'income' ? NEXCUBE_INCOME_CATEGORIES : NEXCUBE_EXPENSE_CATEGORIES);

  // Aksi tombol cepat Kasir Printing
  const handleApplyQuickService = () => {
    if (!selectedServiceId) return;
    const item = PRINTING_PRICELIST.find(p => p.id === Number(selectedServiceId));
    if (!item) return;

    const qty = Math.max(1, Number(serviceQty) || 1);
    const total = item.price * qty;

    if (onSetFormFields) {
      onSetFormFields({
        category: item.category,
        amount: total,
        description: `${item.name} (${qty} pcs)`,
        paymentMethod: formData.paymentMethod || 'Cash / Tunai',
        status: 'completed',
      });
    } else {
      // Fallback manual trigger via onInputChange
      onInputChange({ target: { name: 'category', value: item.category } } as any);
      onInputChange({ target: { name: 'description', value: `${item.name} (${qty} pcs)` } } as any);
      onInputChange({ target: { name: 'amount', value: String(total) } } as any);
    }
  };

  const isPrinting = division === 'printing';

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 bg-blue-50 text-blue-700">
            {isPrinting ? '🖨️ Divisi Printing' : '🔹 Divisi NexCube'}
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {editingId ? `Edit Transaksi Keuangan (${isPrinting ? 'Printing' : 'NexCube'})` : `Tambah Transaksi Keuangan (${isPrinting ? 'Printing' : 'NexCube'})`}
          </h2>
        </div>

        {!editingId && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => downloadCsvTemplate(division)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border border-slate-200/80 shadow-sm"
              title="Unduh contoh template CSV"
            >
              <span>📄</span>
              <span>Unduh Template CSV</span>
            </button>
            <button
              type="button"
              onClick={() => setShowCsvModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
            >
              <span>📥</span>
              <span>Import CSV</span>
            </button>
          </div>
        )}
      </div>

      {/* QUICK FILL KASIR KHUSUS PRINTING */}
      {isPrinting && formData.type === 'income' && !editingId && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-cyan-50/80 via-blue-50/50 to-indigo-50/60 border border-cyan-200/80">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">⚡</span>
            <h3 className="text-sm font-bold text-slate-900">Kasir Cepat: Pilih Layanan Cetak</h3>
            <span className="text-xs text-cyan-700 bg-cyan-100/70 px-2 py-0.5 rounded-full font-medium">Acuan Harga Resmi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-7">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Layanan / Spesifikasi Kertas</label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value ? Number(e.target.value) : '')}
                className="w-full text-sm px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">-- Pilih Layanan Dari Katalog --</option>
                {PRINTING_PRICELIST.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} - Rp {p.price.toLocaleString('id-ID')}/pcs ({p.spec})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Qty (Pcs)</label>
              <input
                type="number"
                min={1}
                value={serviceQty}
                onChange={(e) => setServiceQty(parseInt(e.target.value) || 1)}
                className="w-full text-sm px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="sm:col-span-3">
              <button
                type="button"
                onClick={handleApplyQuickService}
                disabled={!selectedServiceId}
                className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Terapkan ke Form</span>
                <span>↳</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Type and Date Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tipe Transaksi <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={onInputChange}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
            >
              <option value="income">🟢 Pemasukan {isPrinting ? '(Pendapatan Usaha)' : ''}</option>
              <option value="expense">🔴 Pengeluaran {isPrinting ? '(Beban Operasional & HPP)' : ''}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={onInputChange}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category and Amount Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={onInputChange}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
            >
              <option value="">Pilih kategori...</option>
              {availableCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Jumlah (Rp) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="amount"
              value={amountDisplay}
              onChange={handleAmountChange}
              required
              inputMode="numeric"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold text-slate-900"
              placeholder="Contoh: 10.000"
            />
            <p className="text-xs text-slate-500 mt-1">Format otomatis Rupiah (contoh: 1.000, 10.000, 500.000)</p>
          </div>
        </div>

        {/* Payment Method and Status Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Metode Pembayaran <span className="text-red-500">*</span>
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod || ''}
              onChange={onInputChange}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Pilih metode...</option>
              {PAYMENT_METHODS.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={onInputChange}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Pilih status...</option>
              {FINANCE_STATUSES.map(status => (
                <option key={status} value={status}>
                  {status === 'pending' ? 'Tertunda' : status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description Section */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Deskripsi <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onInputChange}
            required
            rows={3}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Jelaskan detail transaksi"
          />
        </div>

        {/* Notes Section */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Catatan
          </label>
          <textarea
            name="notes"
            value={formData.notes || ''}
            onChange={onInputChange}
            rows={2}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Catatan tambahan (opsional)"
          />
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-6 border-t border-slate-200">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : editingId ? 'Perbarui Transaksi' : 'Simpan Transaksi'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
        </div>
      </form>

      {/* Modal Import CSV */}
      <CsvImportModal
        isOpen={showCsvModal}
        onClose={() => setShowCsvModal(false)}
        division={division}
        onSuccess={async () => {
          if (onImportSuccess) {
            await onImportSuccess()
          }
        }}
      />
    </div>
  )
}

export default FormFinance
