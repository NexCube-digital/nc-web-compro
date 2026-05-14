import React, { useEffect, useState } from 'react'
import { Finance } from '../../../services/api'

interface FormFinanceProps {
  formData: Omit<Finance, 'id' | 'createdAt' | 'updatedAt'>;
  editingId: string | null;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
}

const PAYMENT_METHODS = ['Bank Transfer', 'Qris', 'Cash', 'Check', 'E-wallet', 'Credit Card'];
const FINANCE_CATEGORIES = ['Salary', 'Office Supplies', 'Project Payment', 'Deposit', 'Equipment', 'Marketing', 'Utilities', 'Maintenance', 'Other'];
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
  onInputChange,
  onSubmit,
  onCancel
}) => {
  const [amountDisplay, setAmountDisplay] = useState(
    formData.amount > 0 ? Number(formData.amount).toLocaleString('id-ID') : ''
  );

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

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-slate-200">
      <h2 className="text-2xl font-bold mb-6 text-slate-900">
        {editingId ? 'Edit Transaksi Keuangan' : 'Tambah Transaksi Keuangan'}
      </h2>

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
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
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
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Pilih kategori...</option>
              {FINANCE_CATEGORIES.map(cat => (
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
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
    </div>
  )
}

export default FormFinance
