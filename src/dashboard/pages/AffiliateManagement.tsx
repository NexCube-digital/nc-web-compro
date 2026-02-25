import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import apiClient from '../../services/api'
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiTag,
  HiOutlineInbox,
  HiUpload,
  HiDownload,
  HiX,
  HiCheckCircle,
  HiExclamationCircle,
  HiInformationCircle,
} from 'react-icons/hi'
import { BiLoaderAlt } from 'react-icons/bi'
import { IoMdFlame } from 'react-icons/io'
import { HiUsers } from 'react-icons/hi'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PreviewRow {
  rowNum: number
  title: string
  type: string
  level?: string
  category?: string
  price?: string
  hot?: boolean
  features?: string
  includes?: string
  benefits?: string
  process?: string
  timeline?: string
  description?: string
  valid: boolean
  error?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getLevelLabel = (level: string) => {
  const map: Record<string, string> = {
    basic: 'Basic',
    complete: 'Complete',
    express: 'Express',
    'non-package': 'Non Paket',
  }
  return map[level] ?? level
}

const getLevelColor = (level: string) => {
  const map: Record<string, string> = {
    basic: 'bg-blue-50 text-blue-700',
    complete: 'bg-green-50 text-green-700',
    express: 'bg-orange-50 text-orange-700',
    'non-package': 'bg-gray-100 text-gray-600',
  }
  return map[level] ?? 'bg-gray-100 text-gray-600'
}

const VALID_TYPES = ['website', 'desain', 'event', 'katalog', 'affiliate']
const VALID_LEVELS = ['basic', 'complete', 'express', 'non-package']

const parseRow = (raw: Record<string, any>, idx: number): PreviewRow => {
  const title = String(raw.title ?? '').trim()
  const type = String(raw.type ?? '').trim().toLowerCase()
  const level = raw.level ? String(raw.level).trim().toLowerCase() : undefined
  const error: string[] = []

  if (!title) error.push('title kosong')
  if (!type) error.push('type kosong')
  else if (!VALID_TYPES.includes(type)) error.push(`type "${type}" tidak valid`)
  if (level && !VALID_LEVELS.includes(level)) error.push(`level "${level}" tidak valid`)

  return {
    rowNum: idx + 2,
    title,
    type,
    level,
    category: raw.category ? String(raw.category).trim() : undefined,
    price: raw.price ? String(raw.price).trim() : undefined,
    hot: raw.hot === true || raw.hot === 'true' || raw.hot === 1 || raw.hot === '1',
    features: raw.features ? String(raw.features).trim() : undefined,
    includes: raw.includes ? String(raw.includes).trim() : undefined,
    benefits: raw.benefits ? String(raw.benefits).trim() : undefined,
    process: raw.process ? String(raw.process).trim() : undefined,
    timeline: raw.timeline ? String(raw.timeline).trim() : undefined,
    description: raw.description ? String(raw.description).trim() : undefined,
    valid: error.length === 0,
    error: error.join(', '),
  }
}

const parseArr = (val: any): string[] => {
  if (!val) return []
  return String(val).split(';').map((s: string) => s.trim()).filter(Boolean)
}

const downloadTemplate = () => {
  const headers = [
    'title', 'type', 'level', 'category', 'price', 'hot',
    'description', 'features', 'includes', 'benefits', 'process', 'timeline',
  ]
  const example = [
    'Paket Affiliate Basic', 'affiliate', 'basic', 'Digital',
    'Rp 500.000', 'false',
    'Paket affiliate dasar',
    'Fitur A;Fitur B',
    'Include 1;Include 2',
    'Benefit A;Benefit B',
    'Step 1;Step 2',
    '7 hari kerja',
  ]
  const ws = XLSX.utils.aoa_to_sheet([headers, example])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Packages')
  XLSX.writeFile(wb, 'template_import_paket.xlsx')
}

// ─── Import Modal ─────────────────────────────────────────────────────────────

interface ImportModalProps {
  onClose: () => void
  onSuccess: () => void
}

const ImportModal: React.FC<ImportModalProps> = ({ onClose, onSuccess }) => {
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<PreviewRow[]>([])
  const [step, setStep] = useState<'upload' | 'preview' | 'done'>('upload')
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [result, setResult] = useState<{ created: number; errors: { row: number; error: string }[] } | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const validRows = preview.filter((r) => r.valid)
  const invalidRows = preview.filter((r) => !r.valid)

  const handleFile = (file: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer)
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(ws)
        if (rows.length === 0) {
          alert('File Excel kosong atau tidak ada data.')
          return
        }
        setPreview(rows.map(parseRow))
        setStep('preview')
      } catch (err) {
        console.error('Excel parse error:', err)
        alert('Gagal membaca file. Pastikan format Excel (.xlsx) yang valid.')
      }
    }
    reader.onerror = () => alert('Gagal membaca file.')
    reader.readAsArrayBuffer(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  // ✅ FIX: tidak pakai rawFile — langsung pakai validRows dari state
  const submitImport = async () => {
    if (validRows.length === 0) return

    setImporting(true)
    setProgress({ done: 0, total: validRows.length })

    const created: number[] = []
    const errors: { row: number; error: string }[] = []

    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i]
      try {
        await apiClient.createPackage({
          title: row.title,
          type: row.type,
          level: row.level || null,
          category: row.category || null,
          price: row.price || null,
          hot: Boolean(row.hot),
          description: row.description || '',
          features: parseArr(row.features),
          includes: parseArr(row.includes),
          benefits: parseArr(row.benefits),
          process: parseArr(row.process),
          timeline: row.timeline || '',
          images: [],
        })
        created.push(row.rowNum)
      } catch (e: any) {
        console.error(`Gagal import baris ${row.rowNum}:`, e)
        errors.push({
          row: row.rowNum,
          error: e?.response?.data?.message ?? e?.message ?? 'Gagal',
        })
      }
      setProgress({ done: i + 1, total: validRows.length })
    }

    setResult({ created: created.length, errors })
    setStep('done')
    setImporting(false)
  }

  const resetModal = () => {
    setPreview([])
    setStep('upload')
    setResult(null)
    setProgress({ done: 0, total: 0 })
    // reset input file agar bisa upload file yang sama lagi
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <HiUpload className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Import Paket dari Excel</h3>
              <p className="text-xs text-gray-500">
                {step === 'upload' && 'Upload file .xlsx untuk import data massal'}
                {step === 'preview' && `${preview.length} baris ditemukan — ${validRows.length} valid, ${invalidRows.length} error`}
                {step === 'done' && 'Import selesai'}
              </p>
            </div>
          </div>
          <button onClick={onClose} disabled={importing} className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">
            <HiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* STEP: Upload */}
          {step === 'upload' && (
            <div className="space-y-5">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'
                }`}
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <HiUpload className="w-8 h-8 text-emerald-500" />
                </div>
                <p className="text-gray-700 font-semibold mb-1">Klik atau drag & drop file Excel</p>
                <p className="text-gray-500 text-sm">Format: .xlsx / .xls</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <HiInformationCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800 mb-2">Panduan Format Excel</p>
                    <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                      <li>Kolom wajib: <code className="bg-blue-100 px-1 rounded">title</code>, <code className="bg-blue-100 px-1 rounded">type</code></li>
                      <li>Nilai <code className="bg-blue-100 px-1 rounded">type</code>: website, desain, event, katalog, affiliate</li>
                      <li>Nilai <code className="bg-blue-100 px-1 rounded">level</code>: basic, complete, express, non-package</li>
                      <li>Kolom array (features, includes, dll) dipisahkan dengan tanda <strong>;</strong></li>
                      <li>Kolom <code className="bg-blue-100 px-1 rounded">hot</code>: true / false</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={downloadTemplate}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 transition-all font-medium"
              >
                <HiDownload className="w-5 h-5" />
                <span>Download Template Excel</span>
              </button>
            </div>
          )}

          {/* STEP: Preview */}
          {step === 'preview' && (
            <div className="space-y-4">
              {invalidRows.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HiExclamationCircle className="w-5 h-5 text-red-500" />
                    <p className="text-sm font-semibold text-red-700">{invalidRows.length} baris tidak valid (akan dilewati)</p>
                  </div>
                  {invalidRows.map((r) => (
                    <p key={r.rowNum} className="text-xs text-red-600">Baris {r.rowNum}: {r.error}</p>
                  ))}
                </div>
              )}

              {/* Progress bar saat importing */}
              {importing && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-emerald-700">Sedang mengimport...</p>
                    <p className="text-sm text-emerald-600">{progress.done}/{progress.total}</p>
                  </div>
                  <div className="w-full bg-emerald-100 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress.total > 0 ? (progress.done / progress.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Preview Data ({validRows.length} siap diimport)
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="text-left px-3 py-2 text-xs text-gray-500 font-medium">#</th>
                        <th className="text-left px-3 py-2 text-xs text-gray-500 font-medium">Title</th>
                        <th className="text-left px-3 py-2 text-xs text-gray-500 font-medium">Type</th>
                        <th className="text-left px-3 py-2 text-xs text-gray-500 font-medium">Level</th>
                        <th className="text-left px-3 py-2 text-xs text-gray-500 font-medium">Kategori</th>
                        <th className="text-left px-3 py-2 text-xs text-gray-500 font-medium">Harga</th>
                        <th className="text-left px-3 py-2 text-xs text-gray-500 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((row) => (
                        <tr
                          key={row.rowNum}
                          className={`border-b border-gray-50 ${!row.valid ? 'bg-red-50' : 'hover:bg-gray-50'}`}
                        >
                          <td className="px-3 py-2 text-gray-400 text-xs">{row.rowNum}</td>
                          <td className="px-3 py-2 font-medium text-gray-800 max-w-[160px] truncate">{row.title || '—'}</td>
                          <td className="px-3 py-2">
                            <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-medium">{row.type || '—'}</span>
                          </td>
                          <td className="px-3 py-2">
                            {row.level
                              ? <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${getLevelColor(row.level)}`}>{getLevelLabel(row.level)}</span>
                              : <span className="text-gray-300">—</span>
                            }
                          </td>
                          <td className="px-3 py-2 text-gray-600 text-xs">{row.category || '—'}</td>
                          <td className="px-3 py-2 text-green-600 font-medium text-xs">{row.price || '—'}</td>
                          <td className="px-3 py-2">
                            {row.valid
                              ? <HiCheckCircle className="w-4 h-4 text-green-500" />
                              : (
                                <div className="flex items-center gap-1">
                                  <HiExclamationCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                  <span className="text-xs text-red-600 truncate max-w-[120px]">{row.error}</span>
                                </div>
                              )
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* STEP: Done */}
          {step === 'done' && result && (
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <HiCheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-1">Import Selesai!</h4>
                <p className="text-gray-600">{result.created} paket berhasil ditambahkan</p>
              </div>
              {result.errors?.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-left">
                  <p className="text-sm font-semibold text-yellow-700 mb-2">{result.errors.length} baris gagal:</p>
                  {result.errors.map((e, i) => (
                    <p key={i} className="text-xs text-yellow-700">Baris {e.row}: {e.error}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-shrink-0 bg-gray-50">
          <button
            onClick={onClose}
            disabled={importing}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {step === 'done' ? 'Tutup' : 'Batal'}
          </button>

          <div className="flex items-center gap-3">
            {step === 'preview' && !importing && (
              <button
                onClick={resetModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                Ganti File
              </button>
            )}
            {step === 'preview' && validRows.length > 0 && (
              <button
                onClick={submitImport}
                disabled={importing}
                className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all text-sm font-medium shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                {importing ? (
                  <>
                    <BiLoaderAlt className="animate-spin w-4 h-4" />
                    <span>Mengimport {progress.done}/{progress.total}...</span>
                  </>
                ) : (
                  <>
                    <HiUpload className="w-4 h-4" />
                    <span>Import {validRows.length} Paket</span>
                  </>
                )}
              </button>
            )}
            {step === 'done' && (
              <button
                onClick={() => { onSuccess(); onClose() }}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm font-medium shadow-md"
              >
                Lihat Daftar Paket
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

const AffiliateManagement: React.FC = () => {
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const navigate = useNavigate()

  const fetchPackages = async () => {
    setLoading(true)
    try {
      const res = await apiClient.getPackages('affiliate')
      if (res && res.data) setPackages(res.data)
    } catch (err) {
      console.error('Failed to load affiliate packages', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPackages()
  }, [])

  return (
    <div className="max-w-7xl mx-auto">
      {showImport && (
        <ImportModal
          onClose={() => setShowImport(false)}
          onSuccess={fetchPackages}
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <HiUsers className="text-blue-600" />
              <span>Manajemen Affiliate</span>
            </h2>
            <p className="text-gray-600 mt-1">Kelola dan atur semua paket affiliate Anda</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImport(true)}
              className="px-4 py-2.5 bg-white border border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-all font-medium flex items-center gap-2 shadow-sm"
            >
              <HiUpload className="w-4 h-4" />
              <span>Import Excel</span>
            </button>
            <button
              onClick={downloadTemplate}
              className="px-4 py-2.5 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all font-medium flex items-center gap-2 shadow-sm"
            >
              <HiDownload className="w-4 h-4" />
              <span className="hidden sm:inline">Template</span>
            </button>
            <button
              onClick={() => navigate('/dashboard/paket/formaffiliate')}
              className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium shadow-md flex items-center gap-2"
            >
              <HiPlus className="w-5 h-5" />
              <span>Buat Paket Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <BiLoaderAlt className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Memuat paket affiliate...</p>
          </div>
        </div>
      ) : packages.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiOutlineInbox className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum Ada Paket Affiliate</h3>
            <p className="text-gray-600 mb-6">Mulai dengan membuat paket affiliate pertama Anda atau import dari Excel.</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowImport(true)}
                className="px-5 py-2.5 bg-white border-2 border-emerald-400 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-all font-medium inline-flex items-center gap-2"
              >
                <HiUpload className="w-5 h-5" />
                <span>Import Excel</span>
              </button>
              <button
                onClick={() => navigate('/dashboard/paket/formaffiliate')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-md inline-flex items-center gap-2"
              >
                <HiPlus className="w-5 h-5" />
                <span>Buat Paket Pertama</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
            >
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                        {p.name || p.title}
                      </h3>
                      {p.hot && (
                        <span className="flex items-center gap-1 text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full font-semibold shadow-sm">
                          <IoMdFlame className="w-3 h-3" />
                          <span>HOT</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm flex-wrap">
                      {p.level && (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md font-medium ${getLevelColor(p.level)}`}>
                          {getLevelLabel(p.level)}
                        </span>
                      )}
                      {p.category && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-md font-medium">
                          {p.category}
                        </span>
                      )}
                      {p.price && (
                        <span className="text-green-600 font-semibold">{p.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <HiTag className="w-4 h-4" />
                  <span>{getLevelLabel(p.level || '')}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/dashboard/paket/formaffiliate?edit=${p.id}`)}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <HiPencil className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm(`Yakin ingin menghapus paket "${p.name || p.title}"?`)) return
                      try {
                        await apiClient.deletePackage(p.id)
                        fetchPackages()
                      } catch (e) {
                        console.error(e)
                        alert('Gagal menghapus paket')
                      }
                    }}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-1"
                  >
                    <HiTrash className="w-4 h-4" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AffiliateManagement