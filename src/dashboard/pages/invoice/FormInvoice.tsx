import React, { useState, useEffect } from 'react'
import { Invoice, Contact } from '../../../services/api'
import { generateNextInvoiceNumber, calculateDueDate } from '../../../utils/invoiceUtils'

interface PriceBreakdownItem {
  id: string
  description: string
  price: number
}

interface FormInvoiceProps {
  formData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>;
  editingId: string | null;
  loading: boolean;
  clients: Contact[];
  invoices: Invoice[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  onPriceBreakdownChange?: (priceBreakdown: PriceBreakdownItem[]) => void;
}

const SERVICES = ['website', 'undangan', 'desain', 'katalog'] as const;

export const FormInvoice: React.FC<FormInvoiceProps> = ({
  formData,
  editingId,
  loading,
  clients,
  invoices,
  onInputChange,
  onSubmit,
  onCancel,
  onPriceBreakdownChange
}) => {
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdownItem[]>([
    { id: '1', description: '', price: 0 }
  ])

  // Auto-generate invoice number and due date on component mount (creation mode only)
  useEffect(() => {
    if (!editingId) {
      // Auto-generate invoice number only if it's empty (first time opening form)
      if (!formData.invoiceNumber) {
        const nextNumber = generateNextInvoiceNumber(invoices)
        onInputChange({
          target: { name: 'invoiceNumber', value: nextNumber }
        } as any)
      }

      // Auto-set issue date to today if not already set
      if (!formData.issueDate) {
        const today = new Date().toISOString().split('T')[0]
        onInputChange({
          target: { name: 'issueDate', value: today }
        } as any)
        const dueDate = calculateDueDate(today)
        onInputChange({
          target: { name: 'dueDate', value: dueDate }
        } as any)
      }
    }
    // Include invoices in dependency but don't regenerate if already set
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingId])

  // Load priceBreakdown from database when entering edit mode
  useEffect(() => {
    if (editingId && formData.priceBreakdown) {
      try {
        const parsed = JSON.parse(formData.priceBreakdown as any)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPriceBreakdown(parsed)
        } else {
          setPriceBreakdown([{ id: '1', description: '', price: 0 }])
        }
      } catch (err) {
        console.warn('Failed to parse price breakdown:', err)
        setPriceBreakdown([{ id: '1', description: '', price: 0 }])
      }
    }
  }, [editingId]) // Only depend on editingId to avoid resetting when formData changes

  // Find selected client to auto-fill email
  const selectedClient = clients.find(c => c.name === formData.clientName)
  
  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientName = e.target.value
    const client = clients.find(c => c.name === clientName)
    
    // Call original onChange for clientName
    onInputChange({
      ...e,
      target: { ...e.target, name: 'clientName', value: clientName }
    } as any)
    
    // Auto-fill email
    if (client && client.email) {
      onInputChange({
        ...e,
        target: { ...e.target, name: 'clientEmail', value: client.email }
      } as any)
    }
  }

  // Handle issueDate change and auto-calculate dueDate
  const handleIssueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const issueDate = e.target.value
    
    // Update issueDate
    onInputChange(e)
    
    // Auto-calculate dueDate (3 days after issueDate)
    if (issueDate) {
      const dueDate = calculateDueDate(issueDate)
      onInputChange({
        target: { name: 'dueDate', value: dueDate }
      } as any)
    }
  }

  // Calculate total from breakdown
  const calculateTotal = () => {
    return priceBreakdown.reduce((sum, item) => sum + (item.price || 0), 0)
  }

  // Handle breakdown item change
  const handleBreakdownChange = (id: string, field: 'description' | 'price', value: string | number) => {
    const updated = priceBreakdown.map(item =>
      item.id === id
        ? { ...item, [field]: field === 'price' ? Number(value) : value }
        : item
    )
    setPriceBreakdown(updated)
    onPriceBreakdownChange?.(updated)
    
    // Update amount in parent formData
    const total = updated.reduce((sum, item) => sum + (item.price || 0), 0)
    onInputChange({
      target: { name: 'amount', value: total.toString() }
    } as any)
  }

  // Add new breakdown row
  const addBreakdownRow = () => {
    const newId = (Math.max(...priceBreakdown.map(item => parseInt(item.id)), 0) + 1).toString()
    const updated = [...priceBreakdown, { id: newId, description: '', price: 0 }]
    setPriceBreakdown(updated)
    onPriceBreakdownChange?.(updated)
  }

  // Remove breakdown row
  const removeBreakdownRow = (id: string) => {
    const updated = priceBreakdown.filter(item => item.id !== id)
    setPriceBreakdown(updated.length > 0 ? updated : [{ id: '1', description: '', price: 0 }])
    onPriceBreakdownChange?.(updated.length > 0 ? updated : [{ id: '1', description: '', price: 0 }])
    
    // Update amount in parent formData
    const total = updated.reduce((sum, item) => sum + (item.price || 0), 0)
    onInputChange({
      target: { name: 'amount', value: total.toString() }
    } as any)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-slate-200">
      <h2 className="text-2xl font-bold mb-6 text-slate-900">
        {editingId ? 'Edit Invoice' : 'Buat Invoice Baru'}
      </h2>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Invoice Number and Issue Date Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              No. Invoice <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={onInputChange}
              readOnly={!editingId}
              required
              className={`w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                !editingId ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : ''
              }`}
              placeholder="INV-2024-001"
            />
            {!editingId && <p className="text-xs text-slate-500 mt-1">Auto-generated</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tanggal Invoice <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleIssueDateChange}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tanggal Jatuh Tempo <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={onInputChange}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {!editingId && <p className="text-xs text-slate-500 mt-1">Auto-calculated (+3 hari)</p>}
          </div>
        </div>

        {/* Client Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Pilih Klien <span className="text-red-500">*</span>
            </label>
            <select
              name="clientName"
              value={formData.clientName || ''}
              onChange={handleClientChange}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Pilih Klien dari Database --</option>
              {clients.map((client) => (
                <option key={client.id} value={client.name}>
                  {client.name} ({client.email})
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">Email akan otomatis terisi saat memilih klien</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email Klien <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail || ''}
              onChange={onInputChange}
              readOnly
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed focus:outline-none"
              placeholder="Email akan terisi otomatis"
            />
            <p className="text-xs text-slate-500 mt-1">Email otomatis terisi dari database klien</p>
          </div>
        </div>

        {/* Service and Amount Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Layanan <span className="text-red-500">*</span>
            </label>
            <select
              name="service"
              value={formData.service || ''}
              onChange={onInputChange}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Pilih layanan...</option>
              {SERVICES.map(service => (
                <option key={service} value={service}>
                  {service === 'website' ? 'Website' : 
                   service === 'undangan' ? 'Undangan Digital' :
                   service === 'desain' ? 'Desain Grafis' : 'Katalog Digital'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Harga (Rp) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={onInputChange}
              required
              min="0"
              step="1000"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Contoh: 1500000"
            />
            <p className="text-xs text-slate-500 mt-1">Dalam Rupiah tanpa format (1000, 1500000, dst)</p>
          </div>
        </div>

        {/* Price Breakdown Section */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-4">
            Rincian Harga
          </label>
          <div className="bg-slate-50 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-200 border-b border-slate-300">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Deskripsi</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700">Harga (Rp)</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 w-12">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {priceBreakdown.map((item, index) => (
                  <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-100">
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleBreakdownChange(item.id, 'description', e.target.value)}
                        placeholder="Contoh: Domain, Hosting, Jasa, dll"
                        className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.price || ''}
                        onChange={(e) => handleBreakdownChange(item.id, 'price', e.target.value)}
                        placeholder="0"
                        min="0"
                        step="1000"
                        className="w-full px-3 py-2 border border-slate-200 rounded text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      {priceBreakdown.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBreakdownRow(item.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-semibold"
                        >
                          Hapus
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bg-white px-4 py-3 border-t border-slate-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-slate-700">Total:</span>
                <span className="text-lg font-bold text-slate-900">Rp {Math.round(calculateTotal()).toLocaleString('id-ID')}</span>
              </div>
              <button
                type="button"
                onClick={addBreakdownRow}
                className="w-full px-4 py-2 border border-blue-300 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-sm"
              >
                + Tambah Item
              </button>
            </div>
          </div>
        </div>

        {/* Status Section */}
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
            <option value="draft">Draft</option>
            <option value="sent">Terkirim</option>
            <option value="paid">Terbayar</option>
            <option value="overdue">Jatuh Tempo</option>
          </select>
        </div>

        {/* Description and Notes Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Deskripsi
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={onInputChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Detail pekerjaan/layanan"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Catatan
            </label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={onInputChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Catatan tambahan (opsional)"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-6 border-t border-slate-200">
          <button
            type="submit"
            disabled={loading}
            onClick={() => {
              // Update priceBreakdown in formData before submit
              onPriceBreakdownChange?.(priceBreakdown)
            }}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : editingId ? 'Perbarui Invoice' : 'Buat Invoice'}
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

export default FormInvoice
