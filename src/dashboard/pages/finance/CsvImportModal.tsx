import React, { useState, useRef } from 'react'
import apiClient, { Finance } from '../../../services/api'

interface CsvImportModalProps {
  isOpen: boolean
  onClose: () => void
  division?: 'nexcube' | 'printing'
  onSuccess: () => Promise<void>
}

interface ParsedFinanceRow {
  date: string
  type: 'income' | 'expense'
  category: string
  amount: number
  description: string
  paymentMethod: string
  status: 'completed' | 'pending' | 'cancelled'
  notes: string
  isValid: boolean
  errorMessage?: string
}

// Template CSV Data Khusus Printing
const PRINTING_CSV_TEMPLATE = `tanggal,tipe,kategori,jumlah,deskripsi,metode_pembayaran,status,catatan
2026-03-12,income,Print Dokumen & Tugas,15000,Print Tugas Makalah 30 lembar,Cash / Tunai,completed,Lunas kasir
2026-03-12,income,Print Foto, Stiker & Sertifikat,35000,Print Sertifikat Linen 10 lembar,Qris,completed,Qris Kasir Toko
2026-03-12,income,Jasa Cetak Kertas Sendiri,9000,Print Kertas Sendiri 30 lembar,Cash / Tunai,completed,Kertas bawa sendiri
2026-03-12,expense,Bahan Baku (HPP),120000,Beli Kertas HVS PaperOne 75gsm 2 Rim,Bank Transfer,completed,Toko Sinar Jaya
2026-03-12,expense,Operasional & Utilitas,25000,Refill Tinta Suntik Hitam,Cash / Tunai,completed,Perawatan berkala
2026-03-12,expense,Perlengkapan & Logistik,18000,Beli Klip & Plastik Pembungkus,Cash / Tunai,completed,Perlengkapan packing`

// Template CSV Data Khusus NexCube
const NEXCUBE_CSV_TEMPLATE = `tanggal,tipe,kategori,jumlah,deskripsi,metode_pembayaran,status,catatan
2026-03-12,income,Project Payment,5000000,Pembayaran DP Web Company Profile,Bank Transfer,completed,Klien PT Maju
2026-03-12,income,Desain Grafis,750000,Pembuatan Logo & Brand Identity,Qris,completed,Klien Cafe Kopi
2026-03-12,expense,Server & Hosting,350000,Perpanjangan VPS Cloud Server,Credit Card,completed,Server utama
2026-03-12,expense,Utilities,200000,Langganan Software & Internet,Bank Transfer,completed,`

export const downloadCsvTemplate = (division: 'nexcube' | 'printing' = 'printing') => {
  const content = division === 'printing' ? PRINTING_CSV_TEMPLATE : NEXCUBE_CSV_TEMPLATE
  const filename = `template_keuangan_${division}.csv`
  
  // Menambahkan UTF-8 BOM (\uFEFF) agar Microsoft Excel & Numbers membuka karakter dengan rapi
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  division = 'printing',
  onSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null)
  const [parsedRows, setParsedRows] = useState<ParsedFinanceRow[]>([])
  const [parsingError, setParsingError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const isPrinting = division === 'printing'

  // Parser CSV sederhana yang fleksibel dengan koma atau titik koma (Excel Indonesia)
  const parseCsvContent = (text: string) => {
    try {
      setParsingError('')
      const lines = text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0)

      if (lines.length <= 1) {
        setParsingError('File CSV kosong atau hanya memiliki baris header.')
        setParsedRows([])
        return
      }

      // Deteksi delimiter: koma atau titik koma
      const headerLine = lines[0]
      const delimiter = headerLine.includes(';') ? ';' : ','

      // Parse baris dengan mempertimbangkan tanda kutip ganda
      const parseRow = (line: string): string[] => {
        const result: string[] = []
        let current = ''
        let inQuotes = false

        for (let i = 0; i < line.length; i++) {
          const char = line[i]
          if (char === '"') {
            inQuotes = !inQuotes
          } else if (char === delimiter && !inQuotes) {
            result.push(current.trim())
            current = ''
          } else {
            current += char
          }
        }
        result.push(current.trim())
        return result
      }

      const headers = parseRow(headerLine).map(h => h.toLowerCase().replace(/['"]+/g, ''))

      // Cari indeks kolom fleksibel
      const findIndex = (keys: string[]) => headers.findIndex(h => keys.some(k => h.includes(k)))

      const dateIdx = findIndex(['tanggal', 'date', 'tgl'])
      const typeIdx = findIndex(['tipe', 'type', 'jenis'])
      const catIdx = findIndex(['kategori', 'category'])
      const amountIdx = findIndex(['jumlah', 'amount', 'nominal', 'total'])
      const descIdx = findIndex(['deskripsi', 'description', 'keterangan', 'rincian'])
      const paymentIdx = findIndex(['metode', 'payment', 'pembayaran'])
      const statusIdx = findIndex(['status', 'state'])
      const notesIdx = findIndex(['catatan', 'notes', 'memo'])

      if (amountIdx === -1 || descIdx === -1) {
        setParsingError('Kolom "jumlah" dan "deskripsi" wajib ada pada header CSV.')
        setParsedRows([])
        return
      }

      const rows: ParsedFinanceRow[] = []

      for (let i = 1; i < lines.length; i++) {
        const cols = parseRow(lines[i])
        if (cols.length < 2 || cols.every(c => c === '')) continue

        const rawDate = dateIdx >= 0 ? cols[dateIdx] : ''
        const rawType = typeIdx >= 0 ? cols[typeIdx]?.toLowerCase() : ''
        const rawCat = catIdx >= 0 ? cols[catIdx] : ''
        const rawAmount = cols[amountIdx] || '0'
        const rawDesc = cols[descIdx] || ''
        const rawPayment = paymentIdx >= 0 ? cols[paymentIdx] : 'Cash / Tunai'
        const rawStatus = statusIdx >= 0 ? cols[statusIdx]?.toLowerCase() : 'completed'
        const rawNotes = notesIdx >= 0 ? cols[notesIdx] : ''

        // Format tanggal (YYYY-MM-DD)
        let formattedDate = new Date().toISOString().split('T')[0]
        if (rawDate) {
          // Tangani format DD/MM/YYYY atau DD-MM-YYYY
          const dmyMatch = rawDate.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
          if (dmyMatch) {
            const day = dmyMatch[1].padStart(2, '0')
            const month = dmyMatch[2].padStart(2, '0')
            const year = dmyMatch[3]
            formattedDate = `${year}-${month}-${day}`
          } else if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
            formattedDate = rawDate
          }
        }

        // Format tipe
        const isExpense = ['expense', 'pengeluaran', 'keluar', 'out', 'beban', 'hpp'].some(k => rawType.includes(k))
        const type: 'income' | 'expense' = isExpense ? 'expense' : 'income'

        // Format amount (bersihkan Rp, titik, koma)
        const cleanAmountStr = rawAmount.replace(/[^0-9]/g, '')
        const amount = Number(cleanAmountStr) || 0

        // Format status
        let status: 'completed' | 'pending' | 'cancelled' = 'completed'
        if (rawStatus.includes('pend') || rawStatus.includes('tunda') || rawStatus.includes('belum')) {
          status = 'pending'
        } else if (rawStatus.includes('batal') || rawStatus.includes('cancel')) {
          status = 'cancelled'
        }

        // Kategori fallback default jika kosong
        let category = rawCat
        if (!category) {
          if (isPrinting) {
            category = type === 'income' ? 'Print Dokumen & Tugas' : 'Bahan Baku (HPP)'
          } else {
            category = type === 'income' ? 'Project Payment' : 'Salary'
          }
        }

        const isValid = amount > 0 && rawDesc.trim().length > 0

        rows.push({
          date: formattedDate,
          type,
          category,
          amount,
          description: rawDesc || 'Transaksi Tanpa Keterangan',
          paymentMethod: rawPayment || 'Cash / Tunai',
          status,
          notes: rawNotes || '',
          isValid,
          errorMessage: !isValid ? (amount <= 0 ? 'Jumlah tidak boleh 0' : 'Deskripsi tidak boleh kosong') : undefined,
        })
      }

      setParsedRows(rows)
    } catch (err: any) {
      setParsingError(`Gagal membaca file CSV: ${err.message}`)
      setParsedRows([])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        if (text) parseCsvContent(text)
      }
      reader.readAsText(selectedFile, 'UTF-8')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      setFile(droppedFile)
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        if (text) parseCsvContent(text)
      }
      reader.readAsText(droppedFile, 'UTF-8')
    } else {
      setParsingError('Silakan pilih file dengan ekstensi .csv')
    }
  }

  const handleImportSubmit = async () => {
    const validRows = parsedRows.filter(r => r.isValid)
    if (validRows.length === 0) {
      alert('Tidak ada baris data valid yang dapat di-import.')
      return
    }

    try {
      setIsSubmitting(true)
      const payload = validRows.map(r => ({
        division,
        type: r.type,
        category: r.category,
        amount: r.amount,
        description: r.description,
        date: r.date,
        paymentMethod: r.paymentMethod,
        status: r.status,
        notes: r.notes,
      }))

      // Coba bulk API terlebih dahulu
      try {
        const res = await apiClient.bulkCreateFinances(payload, division)
        if (res.success) {
          await onSuccess()
          handleReset()
          onClose()
          return
        }
      } catch (bulkErr) {
        console.warn('Bulk endpoint fallback to individual creates:', bulkErr)
      }

      // Fallback create jika bulk API terhalang
      for (const row of payload) {
        await apiClient.createFinance(row as any)
      }

      await onSuccess()
      handleReset()
      onClose()
    } catch (err: any) {
      alert(`Gagal meng-import data: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setParsedRows([])
    setParsingError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const validRowsCount = parsedRows.filter(r => r.isValid).length
  const totalIncomeAmount = parsedRows.filter(r => r.isValid && r.type === 'income').reduce((s, r) => s + r.amount, 0)
  const totalExpenseAmount = parsedRows.filter(r => r.isValid && r.type === 'expense').reduce((s, r) => s + r.amount, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header Modal */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-white/10 rounded-xl text-xl backdrop-blur-md">
              {isPrinting ? '🖨️' : '💼'}
            </span>
            <div>
              <h3 className="text-xl font-bold">
                Import CSV Transaksi {isPrinting ? 'Printing' : 'NexCube'}
              </h3>
              <p className="text-xs text-blue-100 mt-0.5">
                Unggah file spreadsheet CSV untuk memasukkan banyak transaksi sekaligus secara otomatis
              </p>
            </div>
          </div>
          <button
            onClick={() => { handleReset(); onClose() }}
            className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* Banner Download Template */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📄</span>
              <div>
                <p className="font-bold text-slate-800 text-sm">Belum punya format file CSV?</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Unduh template resmi berisikan contoh format kolom: tanggal, tipe, kategori, jumlah, dan deskripsi.
                </p>
              </div>
            </div>
            <button
              onClick={() => downloadCsvTemplate(division)}
              type="button"
              className="px-4 py-2 bg-white text-blue-700 font-bold text-xs rounded-xl shadow-sm border border-blue-200 hover:bg-blue-50 hover:shadow transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <span>⬇️</span>
              <span>Unduh Template CSV</span>
            </button>
          </div>

          {/* Area Drag & Drop File */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50/50 scale-[0.99]'
                : file
                ? 'border-emerald-400 bg-emerald-50/30'
                : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="text-4xl mb-2">{file ? '✅' : '📥'}</div>
            {file ? (
              <div>
                <p className="font-bold text-slate-900 text-base">{file.name}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {(file.size / 1024).toFixed(1)} KB — Klik untuk memilih file lain
                </p>
              </div>
            ) : (
              <div>
                <p className="font-bold text-slate-800 text-base">
                  Tarik & lepas file CSV di sini, atau <span className="text-blue-600 underline">pilih file</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Format didukung: File comma-separated (.csv) ber-encoding UTF-8
                </p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {parsingError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <div>
                <p className="font-bold">Gagal Memproses CSV</p>
                <p className="text-xs mt-0.5">{parsingError}</p>
              </div>
            </div>
          )}

          {/* Preview Parsed Data */}
          {parsedRows.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">Total Baris</span>
                    <span className="text-lg font-bold text-slate-900">{parsedRows.length} data</span>
                  </div>
                  <div className="h-8 w-px bg-slate-300" />
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">Siap Di-import</span>
                    <span className="text-lg font-bold text-emerald-600">{validRowsCount} valid</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">Total Pemasukan</span>
                    <span className="text-sm font-bold text-emerald-600">
                      Rp {totalIncomeAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">Total Pengeluaran</span>
                    <span className="text-sm font-bold text-rose-600">
                      Rp {totalExpenseAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabel Preview */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm max-h-64 overflow-y-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 sticky top-0 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Tanggal</th>
                      <th className="px-4 py-3">Tipe</th>
                      <th className="px-4 py-3">Kategori</th>
                      <th className="px-4 py-3">Deskripsi</th>
                      <th className="px-4 py-3 text-right">Jumlah</th>
                      <th className="px-4 py-3">Metode</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {parsedRows.map((row, idx) => (
                      <tr key={idx} className={row.isValid ? 'hover:bg-slate-50/80' : 'bg-rose-50/40 text-rose-800'}>
                        <td className="px-4 py-2.5 font-medium">
                          {row.isValid ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                              ✓ Siap
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-600 font-bold">
                              ✗ {row.errorMessage || 'Invalid'}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600">{row.date}</td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                            row.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {row.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-slate-800">{row.category}</td>
                        <td className="px-4 py-2.5 text-slate-700 max-w-[200px] truncate" title={row.description}>
                          {row.description}
                        </td>
                        <td className="px-4 py-2.5 text-right font-bold text-slate-900">
                          Rp {row.amount.toLocaleString('id-ID')}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600">{row.paymentMethod}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => { handleReset(); onClose() }}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-100 transition-colors text-sm"
          >
            Batal
          </button>

          <div className="flex items-center gap-3">
            {parsedRows.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl font-semibold text-slate-600 hover:text-slate-900 text-sm"
              >
                Ganti File
              </button>
            )}

            <button
              type="button"
              onClick={handleImportSubmit}
              disabled={validRowsCount === 0 || isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Meng-import {validRowsCount} Data...</span>
                </>
              ) : (
                <>
                  <span>📥</span>
                  <span>Import {validRowsCount > 0 ? `${validRowsCount} Transaksi` : 'Sekarang'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default CsvImportModal
