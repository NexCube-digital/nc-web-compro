import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import apiClient from '../../services/api'
import { 
  HiChevronLeft, 
  HiInformationCircle, 
  HiCheckCircle, 
  HiLightningBolt,
  HiPhotograph,
  HiCheck,
  HiX,
  HiChevronDown
} from 'react-icons/hi'
import { IoMdFlame } from 'react-icons/io'
import { BiLoaderAlt } from 'react-icons/bi'
import { 
  MdWebAsset, 
  MdDesignServices, 
  MdEvent, 
  MdMenuBook
} from 'react-icons/md'

const PackageForm: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const editId = params.get('edit')

  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'website',
    price: '',
    features: '',
    includes: '', // newline-separated
    benefits: '', // newline-separated
    process: '', // newline-separated
    timeline: '',
    hot: false,
  })
  
  // Standardized website features list
  const WEBSITE_FEATURES = [
    { label: 'Domain & Hosting', value: 'Harga Include Domain dan Hosting.' },
    { label: 'Akses WP Admin', value: 'Akses WP Admin.' },
    { label: 'Akses C-Panel', value: 'Akses C-Panel.' },
    { label: 'Halaman Maks. 5 Menu', value: 'Halaman Maks. 5 Menu/Artikel.' },
    { label: 'Bonus 1 Halaman Menu', value: 'Bonus 1 Halaman Menu/Artikel.' },
    { label: 'Pembuatan Konten', value: 'Gratis Pembuatan Konten.' },
    { label: 'Design Logo', value: 'Gratis Design Logo.' },
    { label: 'Domain .com/.id', value: 'Gratis Domain .com/.id.' },
    { label: 'E-mail Bisnis', value: 'Gratis E-mail bisnis.' },
    { label: 'SSL Certificate', value: 'Gratis SSL 1 Tahun.' },
    { label: 'Loading Cepat', value: 'Loading Cepat.' },
    { label: 'Responsif', value: 'Halaman Responsif.' },
    { label: 'Mobile Friendly', value: 'Mobile Friendly.' },
    { label: 'Integrasi WhatsApp & Telpon', value: 'Terintegrasi Dengan WhatsApp dan Telpon.' },
    { label: 'Integrasi Media Sosial', value: 'Terintegrasi Dengan Media Sosial.' },
    { label: 'Kontak Form', value: 'Standar Kontak Form.' },
    { label: 'Revisi', value: 'Revisi' },
  ]
  
  const [files, setFiles] = useState<File[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedIncludes, setSelectedIncludes] = useState<string[]>([])
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false)

  const PACKAGE_TYPES = [
    { value: 'website', label: 'Website', icon: <MdWebAsset className="w-5 h-5" /> },
    { value: 'desain', label: 'Desain Grafis', icon: <MdDesignServices className="w-5 h-5" /> },
    { value: 'event', label: 'Undangan Digital', icon: <MdEvent className="w-5 h-5" /> },
    { value: 'katalog', label: 'Menu Katalog', icon: <MdMenuBook className="w-5 h-5" /> },
  ]

  useEffect(() => {
    const load = async () => {
      if (!editId) return
      setLoading(true)
      try {
        const res = await apiClient.getPackage(editId)
        if (res.success && res.data) {
          const p = res.data
          setForm({
            title: p.title || '',
            description: p.description || '',
            type: p.type || 'website',
            price: p.price || '',
            features: (p.features || []).join(', '),
            includes: Array.isArray(p.includes) ? p.includes.join('\n') : (p.includes || []).toString(),
            benefits: Array.isArray(p.benefits) ? p.benefits.join('\n') : (p.benefits || []).toString(),
            process: Array.isArray(p.process) ? p.process.join('\n') : (p.process || []).toString(),
            timeline: p.timeline || '',
            hot: Boolean(p.hot),
          })
          // initialize selectedIncludes for website checkbox mode
          if (Array.isArray(p.includes)) setSelectedIncludes(p.includes)
          if (p.hot) setForm(prev => ({ ...prev, hot: true }))
        }
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    load()
  }, [editId])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.type-dropdown')) {
        setIsTypeDropdownOpen(false)
      }
    }
    if (isTypeDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isTypeDropdownOpen])

  // when switching to website type, if includes textarea has values initialize selectedIncludes
  useEffect(() => {
    if (form.type === 'website') {
      const lines = (form.includes || '').split('\n').map(s => s.trim()).filter(s => s)
      if (lines.length > 0 && selectedIncludes.length === 0) setSelectedIncludes(lines)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.type])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        features: form.features.split(',').map((s: string) => s.trim()).filter((s: string) => s),
        includes: form.type === 'website'
          ? selectedIncludes
          : form.includes.split('\n').map((s: string) => s.trim()).filter((s: string) => s),
        benefits: form.benefits.split('\n').map((s: string) => s.trim()).filter((s: string) => s),
        process: form.process.split('\n').map((s: string) => s.trim()).filter((s: string) => s),
        timeline: form.timeline,
        hot: Boolean(form.hot),
      }
      if (editId) {
        await apiClient.updatePackage(editId, payload)
        if (files && files.length > 0) {
          try {
            await apiClient.uploadPackageImages(editId, files)
          } catch (e) { console.error('Upload images failed', e) }
        }
      } else {
        const createRes = await apiClient.createPackage(payload)
        const createdId = createRes?.data?.id
        if (createdId && files && files.length > 0) {
          try {
            await apiClient.uploadPackageImages(String(createdId), files)
          } catch (e) { console.error('Upload images after create failed', e) }
        }
      }
      navigate('/dashboard/paket')
    } catch (err) {
      console.error(err)
      alert('Gagal menyimpan paket')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <HiChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            {editId ? 'Edit Paket' : 'Buat Paket Baru'}
          </h2>
        </div>
        <p className="text-gray-600 ml-14">
          {editId ? 'Perbarui informasi paket' : 'Tambahkan paket layanan baru'}
        </p>
      </div>

      <form onSubmit={submit} className="space-y-6">
        {/* Basic Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <HiInformationCircle className="w-5 h-5 text-blue-600" />
              Informasi Dasar
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Paket <span className="text-red-500">*</span>
                </label>
                <input 
                  value={form.title} 
                  onChange={e => setForm({ ...form, title: e.target.value })} 
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Website Premium"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipe Paket <span className="text-red-500">*</span>
                </label>
                <div className="relative type-dropdown">
                  <button
                    type="button"
                    onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-left flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {PACKAGE_TYPES.find(t => t.value === form.type)?.icon}
                      <span>{PACKAGE_TYPES.find(t => t.value === form.type)?.label}</span>
                    </div>
                    <HiChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isTypeDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      {PACKAGE_TYPES.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => {
                            setForm({ ...form, type: type.value })
                            setIsTypeDropdownOpen(false)
                          }}
                          className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                            form.type === type.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                          } ${type.value === 'website' ? 'rounded-t-lg' : ''} ${type.value === 'katalog' ? 'rounded-b-lg' : ''}`}
                        >
                          <span className={form.type === type.value ? 'text-blue-600' : 'text-gray-400'}>
                            {type.icon}
                          </span>
                          <span className="font-medium">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harga
                </label>
                <input 
                  value={form.price} 
                  onChange={e => setForm({ ...form, price: e.target.value })} 
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Rp 2.500.000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline
                </label>
                <input 
                  value={form.timeline} 
                  onChange={e => setForm({ ...form, timeline: e.target.value })} 
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., 7-14 hari kerja"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Singkat
              </label>
              <textarea 
                value={form.description} 
                onChange={e => setForm({ ...form, description: e.target.value })} 
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows={3}
                placeholder="Deskripsi singkat tentang paket ini..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fitur Utama
                <span className="text-gray-500 text-xs ml-2">(pisahkan dengan koma)</span>
              </label>
              <input 
                value={form.features} 
                onChange={e => setForm({ ...form, features: e.target.value })} 
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., Responsive Design, SEO Friendly, Fast Loading"
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <input 
                type="checkbox" 
                checked={form.hot} 
                onChange={e => setForm({ ...form, hot: e.target.checked })} 
                className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                id="hot-checkbox"
              />
              <label htmlFor="hot-checkbox" className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                <IoMdFlame className="text-xl text-orange-500" />
                <span>Tandai sebagai paket HOT (promosi unggulan)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Includes Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <HiCheckCircle className="w-5 h-5 text-green-600" />
              Yang Termasuk Dalam Paket
            </h3>
          </div>
          <div className="p-6">
            {form.type === 'website' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {WEBSITE_FEATURES.map((feature) => {
                  const checked = selectedIncludes.includes(feature.value)
                  return (
                    <label 
                      key={feature.value} 
                      className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        checked 
                          ? 'bg-green-50 border-green-500 shadow-sm' 
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          if (checked) setSelectedIncludes(selectedIncludes.filter(s => s !== feature.value))
                          else setSelectedIncludes([...selectedIncludes, feature.value])
                        }}
                        className="w-4 h-4 mt-0.5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700 leading-tight">{feature.label}</span>
                    </label>
                  )
                })}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daftar Includes
                  <span className="text-gray-500 text-xs ml-2">(satu per baris)</span>
                </label>
                <textarea 
                  value={form.includes} 
                  onChange={e => setForm({ ...form, includes: e.target.value })} 
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm"
                  rows={6}
                  placeholder="Masukkan setiap item per baris&#10;e.g.,&#10;✔ Item pertama&#10;✔ Item kedua"
                />
              </div>
            )}
          </div>
        </div>

        {/* Benefits & Process Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <HiLightningBolt className="w-5 h-5 text-purple-600" />
              Keuntungan & Proses
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keuntungan (Benefits)
                <span className="text-gray-500 text-xs ml-2">(satu per baris)</span>
              </label>
              <textarea 
                value={form.benefits} 
                onChange={e => setForm({ ...form, benefits: e.target.value })} 
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows={4}
                placeholder="e.g.,&#10;Meningkatkan kredibilitas bisnis&#10;Jangkauan pasar lebih luas&#10;Hemat biaya marketing"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proses Pengerjaan
                <span className="text-gray-500 text-xs ml-2">(satu per baris)</span>
              </label>
              <textarea 
                value={form.process} 
                onChange={e => setForm({ ...form, process: e.target.value })} 
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows={4}
                placeholder="e.g.,&#10;Konsultasi & Brief&#10;Design Mockup&#10;Development&#10;Testing & Review&#10;Launch"
              />
            </div>
          </div>
        </div>

        {/* Images Upload Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <HiPhotograph className="w-5 h-5 text-amber-600" />
              Gambar Paket
            </h3>
          </div>
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Gambar
              <span className="text-gray-500 text-xs ml-2">(opsional, bisa multiple)</span>
            </label>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
              <div className="space-y-2 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600 justify-center">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Upload file</span>
                    <input 
                      type="file" 
                      multiple 
                      onChange={e => setFiles(e.target.files ? Array.from(e.target.files) : null)} 
                      className="sr-only"
                      accept="image/*"
                    />
                  </label>
                  <p className="pl-1">atau drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                {files && files.length > 0 && (
                  <p className="text-sm text-green-600 font-medium">{files.length} file dipilih</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
          >
            <HiX className="w-5 h-5" />
            <span>Batal</span>
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <BiLoaderAlt className="animate-spin h-5 w-5" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <HiCheck className="w-5 h-5" />
                <span>Simpan Paket</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PackageForm
