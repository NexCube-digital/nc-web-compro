import React, { useState, useEffect } from 'react'
import { Invoice, Contact, ITerminPayment } from '../../../services/api'
import { generateNextInvoiceNumber, calculateDueDate } from '../../../utils/invoiceUtils'

export interface PriceBreakdownItem {
  id: string
  description: string
  price: number
}

interface StoredPriceBreakdownItem {
  id?: string | number
  name?: string
  description?: string
  price?: string | number
}

const COMMON_BREAKDOWN_CATEGORIES = [
  'Domain (.com / .id / .co.id)',
  'Cloud Hosting & Server',
  'Jasa Pembuatan Website',
  'Jasa Desain Grafis & Logo',
  'Undangan Digital Premium',
  'Katalog Digital Produk',
  'Maintenance & Support Sistem',
  'Digital Marketing & Iklan',
  'SSL Certificate & Security',
  'Custom Fitur / Modul Tambahan'
];

const normalizePrice = (value: string | number): number => {
  if (typeof value === 'number') return Number.isFinite(value) ? Math.round(value) : 0
  const text = value.trim()
  if (!text) return 0
  const normalized = text.includes(',')
    ? text.replace(/\./g, '').replace(',', '.')
    : text
  return Math.round(Number(normalized.replace(/[^\d.-]/g, '')) || 0)
}

interface FormInvoiceProps {
  formData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>;
  editingId: string | null;
  loading: boolean;
  clients: Contact[];
  invoices: Invoice[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent, priceBreakdownData?: PriceBreakdownItem[], paymentTermsData?: ITerminPayment[]) => Promise<void>;
  onCancel: () => void;
  onPriceBreakdownChange?: (priceBreakdown: PriceBreakdownItem[]) => void;
  onPaymentTermsChange?: (terms: ITerminPayment[]) => void;
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
  onPriceBreakdownChange,
  onPaymentTermsChange
}) => {
  const [manualClient, setManualClient] = useState(false)
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdownItem[]>([
    { id: '1', description: '', price: 0 }
  ])
  const [amountDisplay, setAmountDisplay] = useState<string>(() => {
    const num = Number(formData.amount) || 0
    return num > 0 ? num.toLocaleString('id-ID') : ''
  })

  // State untuk Termin / DP
  const [isTerminMode, setIsTerminMode] = useState<boolean>(false)
  const [paymentTerms, setPaymentTerms] = useState<ITerminPayment[]>([
    { id: '1', name: 'Termin 1 (DP)', amount: 0, status: 'unpaid' },
    { id: '2', name: 'Termin 2 (Pelunasan)', amount: 0, status: 'unpaid' }
  ])

  // Sinkronisasi amountDisplay saat formData.amount berubah dari luar
  useEffect(() => {
    const num = Number(formData.amount) || 0
    setAmountDisplay(num > 0 ? num.toLocaleString('id-ID') : '')
  }, [formData.amount])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, '')
    if (!rawDigits) {
      setAmountDisplay('')
      onInputChange({
        target: { name: 'amount', value: '0' }
      } as any)
      return
    }
    const num = parseInt(rawDigits, 10)
    setAmountDisplay(num.toLocaleString('id-ID'))
    onInputChange({
      target: { name: 'amount', value: num.toString() }
    } as any)
  }

  // Auto-generate invoice number and due date on component mount (creation mode only)
  useEffect(() => {
    if (!editingId) {
      if (!formData.invoiceNumber) {
        const nextNumber = generateNextInvoiceNumber(invoices)
        onInputChange({
          target: { name: 'invoiceNumber', value: nextNumber }
        } as any)
      }

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
  }, [editingId])

  // Load priceBreakdown from database when entering edit mode
  useEffect(() => {
    if (editingId && formData.priceBreakdown) {
      try {
        let parsed: any = typeof formData.priceBreakdown === 'string'
          ? JSON.parse(formData.priceBreakdown)
          : formData.priceBreakdown
        while (typeof parsed === 'string') {
          try { parsed = JSON.parse(parsed) } catch { break }
        }
        if (Array.isArray(parsed) && parsed.length > 0) {
          const items = (parsed as StoredPriceBreakdownItem[]).map((item, index) => ({
            id: String(item.id ?? index + 1),
            description: item.description || item.name || '',
            price: normalizePrice(item.price ?? 0),
          }))
          setPriceBreakdown(items)
          onPriceBreakdownChange?.(items)
        } else {
          setPriceBreakdown([{ id: '1', description: '', price: 0 }])
        }
      } catch (err) {
        console.warn('Failed to parse price breakdown:', err)
        setPriceBreakdown([{ id: '1', description: '', price: 0 }])
      }
    } else if (!editingId) {
      setPriceBreakdown([{ id: '1', description: '', price: 0 }])
    }
  }, [editingId, formData.priceBreakdown])

  // Load paymentTerms when entering edit mode
  useEffect(() => {
    if (editingId && formData.paymentTerms) {
      try {
        let parsed: any = typeof formData.paymentTerms === 'string'
          ? JSON.parse(formData.paymentTerms)
          : formData.paymentTerms
        while (typeof parsed === 'string') {
          try { parsed = JSON.parse(parsed) } catch { break }
        }
        if (Array.isArray(parsed) && parsed.length > 0) {
          const loadedTerms: ITerminPayment[] = parsed.map((item, index) => ({
            id: String(item.id ?? index + 1),
            name: item.name || (index === 0 ? 'Termin 1 (DP)' : index === parsed.length - 1 ? `Termin ${index + 1} (Pelunasan)` : `Termin ${index + 1}`),
            amount: normalizePrice(item.amount ?? 0),
            dueDate: item.dueDate || undefined,
            status: item.status === 'paid' ? 'paid' : 'unpaid',
            paidAt: item.paidAt || null,
            paymentMethod: item.paymentMethod || null,
            notes: item.notes || null
          }))
          setPaymentTerms(loadedTerms)
          setIsTerminMode(true)
          onPaymentTermsChange?.(loadedTerms)
        }
      } catch (err) {
        console.warn('Failed to parse payment terms:', err)
      }
    }
  }, [editingId, formData.paymentTerms])

  const selectedClient = clients.find(client => client.name === formData.clientName)
  const isKnownClient = Boolean(selectedClient)
  const useManualClient = manualClient || (Boolean(formData.clientName) && !isKnownClient)

  useEffect(() => {
    if (!editingId && !formData.clientName) setManualClient(false)
  }, [editingId, formData.clientName])

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientName = e.target.value
    const client = clients.find(c => c.name === clientName)
    
    onInputChange({
      ...e,
      target: { ...e.target, name: 'clientName', value: clientName }
    } as React.ChangeEvent<HTMLSelectElement>)
    
    if (client && client.email) {
      onInputChange({
        ...e,
        target: { ...e.target, name: 'clientEmail', value: client.email }
      } as React.ChangeEvent<HTMLSelectElement>)
    }
  }

  const handleManualClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(e)
  }

  const handleIssueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const issueDate = e.target.value
    onInputChange(e)
    
    if (issueDate) {
      const dueDate = calculateDueDate(issueDate)
      onInputChange({
        target: { name: 'dueDate', value: dueDate }
      } as any)
    }
  }

  const calculateTotal = () => {
    return priceBreakdown.reduce((sum, item) => sum + (item.price || 0), 0)
  }

  const currentTotalAmount = Number(formData.amount) || calculateTotal() || 0

  const handleBreakdownChange = (id: string, field: 'description' | 'price', value: string | number) => {
    const updated = priceBreakdown.map(item =>
      item.id === id
        ? { ...item, [field]: field === 'price' ? normalizePrice(value) : value }
        : item
    )
    setPriceBreakdown(updated)
    onPriceBreakdownChange?.(updated)
    
    const total = updated.reduce((sum, item) => sum + (item.price || 0), 0)
    if (total > 0 || updated.some(it => it.price > 0)) {
      setAmountDisplay(total > 0 ? total.toLocaleString('id-ID') : '')
      onInputChange({
        target: { name: 'amount', value: total.toString() }
      } as any)
    }
  }

  const addBreakdownRow = () => {
    const newId = (Math.max(...priceBreakdown.map(item => parseInt(item.id) || 0), 0) + 1).toString()
    const updated = [...priceBreakdown, { id: newId, description: '', price: 0 }]
    setPriceBreakdown(updated)
    onPriceBreakdownChange?.(updated)
  }

  const removeBreakdownRow = (id: string) => {
    const updated = priceBreakdown.filter(item => item.id !== id)
    const finalItems = updated.length > 0 ? updated : [{ id: '1', description: '', price: 0 }]
    setPriceBreakdown(finalItems)
    onPriceBreakdownChange?.(finalItems)
    
    const total = finalItems.reduce((sum, item) => sum + (item.price || 0), 0)
    setAmountDisplay(total > 0 ? total.toLocaleString('id-ID') : '')
    onInputChange({
      target: { name: 'amount', value: total.toString() }
    } as any)
  }

  // Helper untuk Termin Presets & Rows
  const applyTerminPreset = (preset: '50-50' | '30-40-30') => {
    const total = currentTotalAmount
    const issue = formData.issueDate || new Date().toISOString().split('T')[0]
    const due = formData.dueDate || calculateDueDate(issue)

    if (preset === '50-50') {
      const dp = Math.round(total / 2)
      const pelunasan = total - dp
      const newTerms: ITerminPayment[] = [
        {
          id: '1',
          name: 'Termin 1 (DP)',
          amount: dp,
          dueDate: issue,
          status: 'unpaid'
        },
        {
          id: '2',
          name: 'Termin 2 (Pelunasan)',
          amount: pelunasan,
          dueDate: due,
          status: 'unpaid'
        }
      ]
      setPaymentTerms(newTerms)
      onPaymentTermsChange?.(newTerms)
    } else if (preset === '30-40-30') {
      const dp = Math.round(total * 0.3)
      const t2 = Math.round(total * 0.4)
      const pelunasan = total - dp - t2
      const newTerms: ITerminPayment[] = [
        {
          id: '1',
          name: 'Termin 1 (DP)',
          amount: dp,
          dueDate: issue,
          status: 'unpaid'
        },
        {
          id: '2',
          name: 'Termin 2 (Progress)',
          amount: t2,
          dueDate: due,
          status: 'unpaid'
        },
        {
          id: '3',
          name: 'Termin 3 (Pelunasan)',
          amount: pelunasan,
          dueDate: due,
          status: 'unpaid'
        }
      ]
      setPaymentTerms(newTerms)
      onPaymentTermsChange?.(newTerms)
    }
  }

  const addTerminRow = () => {
    const nextIdx = paymentTerms.length + 1
    const newId = String(Date.now() + Math.random())
    const newTerms: ITerminPayment[] = [
      ...paymentTerms,
      {
        id: newId,
        name: nextIdx === 2 ? 'Termin 2 (Pelunasan)' : `Termin ${nextIdx}`,
        amount: 0,
        dueDate: formData.dueDate || undefined,
        status: 'unpaid'
      }
    ]
    setPaymentTerms(newTerms)
    onPaymentTermsChange?.(newTerms)
  }

  const removeTerminRow = (id: string) => {
    const filtered = paymentTerms.filter(t => t.id !== id)
    const finalTerms = filtered.length > 0 ? filtered : [
      { id: '1', name: 'Termin 1 (DP)', amount: 0, status: 'unpaid' as const }
    ]
    setPaymentTerms(finalTerms)
    onPaymentTermsChange?.(finalTerms)
  }

  const handleTerminItemChange = (id: string, field: keyof ITerminPayment, value: any) => {
    const updated = paymentTerms.map(item => {
      if (item.id !== id) return item
      if (field === 'amount') {
        return { ...item, amount: normalizePrice(value) }
      }
      return { ...item, [field]: value }
    })
    setPaymentTerms(updated)
    onPaymentTermsChange?.(updated)

    // Auto-update status invoice jika ada termin yang ditandai sudah dibayar
    const totalTerminPaid = updated.filter(t => t.status === 'paid').reduce((s, t) => s + (Number(t.amount) || 0), 0)
    const targetTotal = currentTotalAmount
    if (totalTerminPaid >= targetTotal && targetTotal > 0) {
      onInputChange({ target: { name: 'status', value: 'paid' } } as any)
    } else if (totalTerminPaid > 0) {
      onInputChange({ target: { name: 'status', value: 'partial' } } as any)
    }
  }

  const balanceToLastTerm = () => {
    if (paymentTerms.length === 0) return
    const total = currentTotalAmount
    const otherSum = paymentTerms.slice(0, -1).reduce((s, t) => s + (Number(t.amount) || 0), 0)
    const diff = Math.max(0, total - otherSum)
    const last = paymentTerms[paymentTerms.length - 1]
    handleTerminItemChange(last.id, 'amount', diff)
  }

  const totalTermin = paymentTerms.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  const isTerminBalanced = Math.round(totalTermin) === Math.round(currentTotalAmount)
  const totalTerminPaid = paymentTerms.filter(t => t.status === 'paid').reduce((sum, item) => sum + (Number(item.amount) || 0), 0)

  // Form submit handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validItems = priceBreakdown
      .filter(item => item.description.trim() !== '' || item.price > 0)
      .map(item => ({
        id: item.id,
        description: item.description.trim() || 'Item Layanan',
        price: normalizePrice(item.price)
      }))

    const itemsToSubmit = validItems.length > 0 ? validItems : priceBreakdown
    onPriceBreakdownChange?.(itemsToSubmit)

    let termsToSubmit: ITerminPayment[] | undefined = undefined
    if (isTerminMode && paymentTerms.length > 0) {
      termsToSubmit = paymentTerms.map((t, idx) => ({
        id: t.id || `term-${idx + 1}`,
        name: t.name.trim() || `Termin ${idx + 1}`,
        amount: normalizePrice(t.amount),
        dueDate: t.dueDate || undefined,
        status: t.status === 'paid' ? 'paid' : 'unpaid',
        paidAt: t.paidAt || (t.status === 'paid' ? new Date().toISOString() : null),
        paymentMethod: t.paymentMethod || null,
        notes: t.notes || null
      }))
    }

    await onSubmit(e, itemsToSubmit, termsToSubmit)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-slate-200">
      <h2 className="text-2xl font-bold mb-6 text-slate-900">
        {editingId ? 'Edit Invoice' : 'Buat Invoice Baru'}
      </h2>

      <form onSubmit={handleFormSubmit} className="space-y-6">
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
          </div>
        </div>

        {/* Client Selection Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Klien <span className="text-red-500">*</span>
            </label>
            {useManualClient ? (
              <div className="space-y-2">
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleManualClientChange}
                  required
                  placeholder="Ketik nama klien..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    setManualClient(false)
                    onInputChange({
                      target: { name: 'clientName', value: '' }
                    } as any)
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  ← Pilih dari daftar klien yang ada
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <select
                  value={formData.clientName}
                  onChange={handleClientChange}
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih klien...</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.name}>
                      {client.name} {client.company ? `(${client.company})` : ''}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    setManualClient(true)
                    onInputChange({
                      target: { name: 'clientName', value: '' }
                    } as any)
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  + Klien baru (ketik manual)
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email Klien <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={onInputChange}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="klien@example.com"
            />
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
              value={formData.service}
              onChange={onInputChange}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize"
            >
              {SERVICES.map(service => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Total Tagihan (Rp) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-2.5 text-slate-400 font-medium select-none">Rp</span>
              <input
                type="text"
                value={amountDisplay}
                onChange={handleAmountChange}
                required
                className="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                placeholder="0"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Otomatis terhitung dari total rincian harga di bawah.
            </p>
          </div>
        </div>

        {/* Price Breakdown Section */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Rincian Harga & Kategori Layanan</h3>
              <p className="text-xs text-slate-500">
                Pilih atau ketik kategori layanan (Domain, Hosting, Pembuatan Web, dll)
              </p>
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-full">
              {priceBreakdown.length} Baris
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-600 text-xs">
                  <th className="px-4 py-2.5 text-left font-semibold">Deskripsi / Kategori</th>
                  <th className="px-4 py-2.5 text-right font-semibold w-48">Harga (Rp)</th>
                  <th className="px-4 py-2.5 text-center font-semibold w-16">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {priceBreakdown.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-2.5">
                      <input
                        type="text"
                        list="rincian-kategori-options"
                        value={item.description}
                        onChange={(e) => handleBreakdownChange(item.id, 'description', e.target.value)}
                        placeholder="Contoh: Domain .com, Cloud Hosting, Jasa Web, dll"
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="relative">
                        <span className="absolute left-2.5 top-1.5 text-xs text-slate-400 select-none">Rp</span>
                        <input
                          type="text"
                          value={item.price > 0 ? item.price.toLocaleString('id-ID') : ''}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '')
                            handleBreakdownChange(item.id, 'price', digits ? parseInt(digits, 10) : 0)
                          }}
                          placeholder="0"
                          className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm text-right font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {priceBreakdown.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => removeBreakdownRow(item.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold hover:bg-red-50 p-1.5 rounded-md transition-colors"
                          title="Hapus baris"
                        >
                          ✕
                        </button>
                      ) : (
                        <span className="text-slate-300 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <datalist id="rincian-kategori-options">
              {COMMON_BREAKDOWN_CATEGORIES.map((cat, idx) => (
                <option key={idx} value={cat} />
              ))}
            </datalist>

            <div className="bg-white px-4 py-3 border-t border-slate-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-slate-700">Total Rincian:</span>
                <span className="text-lg font-bold text-blue-600">
                  Rp {Math.round(calculateTotal()).toLocaleString('id-ID')}
                </span>
              </div>
              <button
                type="button"
                onClick={addBreakdownRow}
                className="w-full px-4 py-2.5 border-2 border-dashed border-blue-300 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <span>+ Tambah Baris Rincian</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── SKEMA PEMBAYARAN TERMIN / DP ── */}
        <div className="border border-indigo-200 bg-gradient-to-br from-indigo-50/40 via-purple-50/20 to-white rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Skema Pembayaran</span>
                {isTerminMode && (
                  <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                    Termin / Bertahap Aktif
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-600">
                Pilih apakah pembayaran dilakukan 1x penuh atau bertahap (contoh: DP 400.000 & Pelunasan 400.000).
              </p>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded-xl self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setIsTerminMode(false)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  !isTerminMode
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1x Bayar (Penuh)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsTerminMode(true)
                  if (paymentTerms.length === 0 || paymentTerms.every(t => t.amount === 0)) {
                    applyTerminPreset('50-50')
                  }
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isTerminMode
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bertahap / Termin (DP)
              </button>
            </div>
          </div>

          {/* Termin Settings when Active */}
          {isTerminMode && (
            <div className="pt-2 space-y-4 animate-in fade-in duration-300">
              {/* Presets */}
              <div className="flex flex-wrap items-center gap-2 bg-white/80 border border-indigo-100 rounded-lg p-2.5">
                <span className="text-xs font-semibold text-slate-700 mr-1">Preset Cepat:</span>
                <button
                  type="button"
                  onClick={() => applyTerminPreset('50-50')}
                  className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-md text-xs font-medium transition-colors"
                >
                  ⚡ DP 50% + Pelunasan 50%
                </button>
                <button
                  type="button"
                  onClick={() => applyTerminPreset('30-40-30')}
                  className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-md text-xs font-medium transition-colors"
                >
                  ⚡ DP 30% + Termin 40% + Pelunasan 30%
                </button>
              </div>

              {/* Termin Table */}
              <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                      <th className="px-3 py-2.5 text-left font-semibold">Nama Termin</th>
                      <th className="px-3 py-2.5 text-right font-semibold w-40">Nominal (Rp)</th>
                      <th className="px-3 py-2.5 text-left font-semibold w-36">Jatuh Tempo</th>
                      <th className="px-3 py-2.5 text-center font-semibold w-36">Status Bayar</th>
                      <th className="px-3 py-2.5 text-center font-semibold w-12">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paymentTerms.map((term, idx) => (
                      <tr key={term.id} className="hover:bg-slate-50/50">
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={term.name}
                            onChange={(e) => handleTerminItemChange(term.id, 'name', e.target.value)}
                            placeholder={`Termin ${idx + 1}`}
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <div className="relative">
                            <span className="absolute left-2 top-1.5 text-slate-400 select-none">Rp</span>
                            <input
                              type="text"
                              value={term.amount > 0 ? term.amount.toLocaleString('id-ID') : ''}
                              onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, '')
                                handleTerminItemChange(term.id, 'amount', digits ? parseInt(digits, 10) : 0)
                              }}
                              placeholder="0"
                              className="w-full pl-7 pr-2 py-1.5 border border-slate-200 rounded text-xs text-right font-semibold focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="date"
                            value={term.dueDate || ''}
                            onChange={(e) => handleTerminItemChange(term.id, 'dueDate', e.target.value)}
                            className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <select
                            value={term.status}
                            onChange={(e) => handleTerminItemChange(term.id, 'status', e.target.value)}
                            className={`w-full px-2 py-1.5 border rounded text-xs font-semibold focus:outline-none ${
                              term.status === 'paid'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            <option value="unpaid">⏳ Belum Bayar</option>
                            <option value="paid">✅ Sudah Bayar</option>
                          </select>
                        </td>
                        <td className="px-3 py-2 text-center">
                          {paymentTerms.length > 1 ? (
                            <button
                              type="button"
                              onClick={() => removeTerminRow(term.id)}
                              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                              title="Hapus termin"
                            >
                              ✕
                            </button>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Termin Summary & Balance Validator */}
                <div className="bg-slate-50 p-3 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-4">
                      <span>Total Termin: <strong className="text-slate-900">Rp {totalTermin.toLocaleString('id-ID')}</strong></span>
                      <span>Total Invoice: <strong className="text-blue-600">Rp {currentTotalAmount.toLocaleString('id-ID')}</strong></span>
                      <span>Sudah Bayar: <strong className="text-emerald-600">Rp {totalTerminPaid.toLocaleString('id-ID')}</strong></span>
                    </div>
                    {isTerminBalanced ? (
                      <p className="text-emerald-600 font-semibold flex items-center gap-1">
                        ✓ Total termin sesuai dengan total invoice
                      </p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-amber-600 font-medium">
                          ⚠️ Selisih Rp {Math.abs(currentTotalAmount - totalTermin).toLocaleString('id-ID')}
                        </p>
                        <button
                          type="button"
                          onClick={balanceToLastTerm}
                          className="text-[11px] bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold px-2 py-0.5 rounded transition-colors"
                        >
                          Sesuaikan ke Termin Terakhir
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={addTerminRow}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold transition-colors"
                  >
                    + Tambah Termin
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status Section */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Status Invoice <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={onInputChange}
            required
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
          >
            <option value="">Pilih status...</option>
            <option value="draft">Draft</option>
            <option value="sent">Terkirim</option>
            <option value="partial">⏳ DP Terbayar / Sebagian</option>
            <option value="paid">✅ Terbayar (Lunas)</option>
            <option value="overdue">Jatuh Tempo</option>
          </select>
          {isTerminMode && (
            <p className="text-xs text-indigo-600 mt-1 font-medium">
              ℹ️ Ketika menggunakan skema Termin, status otomatis menjadi <strong>DP Terbayar</strong> saat DP dibayar, dan otomatis berubah ke <strong>Terbayar (Lunas)</strong> saat seluruh termin lunas.
            </p>
          )}
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
