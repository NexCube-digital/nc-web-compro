import React, { useState, useRef } from 'react'
import { FaStar, FaCheckCircle, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'

interface TestimonialItem {
  name: string
  company: string
  text: string
  rating: number
  avatar: string
}

const initialTestimonials: TestimonialItem[] = [
  {
    name: 'Budi Santoso',
    company: 'PT Maju Bersama',
    text: 'Website kami mendapatkan peningkatan trafik signifikan setelah didesain ulang oleh tim NexCube. Tampilan premium dan responsif memberikan kesan profesional yang luar biasa!',
    rating: 5,
    avatar: ''
  },
  {
    name: 'Dewi Anggraini',
    company: 'Harmony Events',
    text: 'Undangan digital untuk acara perusahaan kami mendapat banyak pujian dari para tamu. Fitur RSVP sangat membantu dalam persiapan acara dan memberikan pengalaman yang memorable.',
    rating: 5,
    avatar: ''
  },
  {
    name: 'Ahmad Fauzi',
    company: 'Warung Nusantara',
    text: 'Menu digital untuk restoran kami memudahkan pelanggan melihat pilihan makanan. Update menu jadi sangat cepat tanpa perlu cetak ulang, meningkatkan efisiensi operasional.',
    rating: 5,
    avatar: ''
  },
  {
    name: 'Siti Rahayu',
    company: 'Butik Cantik',
    text: 'Katalog digital yang dibuat NexCube sangat membantu penjualan online kami. Desainnya elegan dan mudah digunakan oleh pelanggan. Highly recommended!',
    rating: 5,
    avatar: ''
  },
  {
    name: 'Rizky Pratama',
    company: 'Tech Startup ID',
    text: 'Tim NexCube sangat profesional dan responsif. Mereka memahami kebutuhan bisnis kami dengan baik dan mengeksekusi dengan sempurna sesuai timeline.',
    rating: 5,
    avatar: ''
  }
]

const ITEMS_PER_PAGE = 3
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_MB = 2

export const Testimonial: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [testimonialPage, setTestimonialPage] = useState(0)
  const [showAddModal, setShowAddModal] = useState(false)
  const [testimonialsData, setTestimonialsData] = useState<TestimonialItem[]>(initialTestimonials)
  const [newReview, setNewReview] = useState<TestimonialItem>({
    name: '', company: '', text: '', rating: 5, avatar: ''
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<{ name?: string; text?: string }>({})

  const totalPages = Math.ceil(testimonialsData.length / ITEMS_PER_PAGE)
  const visibleTestimonials = testimonialsData.slice(
    testimonialPage * ITEMS_PER_PAGE,
    (testimonialPage + 1) * ITEMS_PER_PAGE
  )

  // ── Avatar handlers ──────────────────────────────────────────────────────
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert('Format tidak didukung. Gunakan JPG, PNG, atau WEBP.')
      e.target.value = ''
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`Ukuran maksimal ${MAX_SIZE_MB}MB.`)
      e.target.value = ''
      return
    }

    if (newReview.avatar.startsWith('blob:')) URL.revokeObjectURL(newReview.avatar)
    const preview = URL.createObjectURL(file)
    setAvatarFile(file)
    setNewReview(r => ({ ...r, avatar: preview }))
  }

  const handleRemoveAvatar = () => {
    if (newReview.avatar.startsWith('blob:')) URL.revokeObjectURL(newReview.avatar)
    setAvatarFile(null)
    setNewReview(r => ({ ...r, avatar: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── Submit / Close ───────────────────────────────────────────────────────
  const handleSubmit = () => {
    const errs: { name?: string; text?: string } = {}
    if (!newReview.name.trim()) errs.name = 'Nama wajib diisi'
    if (!newReview.text.trim()) errs.text = 'Ulasan wajib diisi'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setTestimonialsData(prev => [...prev, { ...newReview }])
    const newTotal = Math.ceil((testimonialsData.length + 1) / ITEMS_PER_PAGE)
    setTestimonialPage(newTotal - 1)

    // Don't revoke: avatar lives in card now
    setAvatarFile(null)
    setNewReview({ name: '', company: '', text: '', rating: 5, avatar: '' })
    setErrors({})
    setShowAddModal(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleCloseModal = () => {
    if (newReview.avatar.startsWith('blob:')) URL.revokeObjectURL(newReview.avatar)
    setAvatarFile(null)
    setNewReview({ name: '', company: '', text: '', rating: 5, avatar: '' })
    setErrors({})
    setShowAddModal(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const ratingLabel = ['', 'Sangat Buruk', 'Buruk', 'Cukup', 'Baik', 'Sangat Baik']

  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      {/* ── Backgrounds ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-white" />
      <div className="absolute top-20 left-10 opacity-10 pointer-events-none">
        <div className="w-80 h-80 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full blur-[100px] animate-pulse" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-10 pointer-events-none">
        <div className="w-80 h-80 bg-gradient-to-br from-orange-500 to-orange-300 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container relative z-10">
        {/* ── Section Header ───────────────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="scroll-fade-in inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-lg text-sm font-semibold text-orange-600 mb-4">
            <FaStar className="w-4 h-4" />
            <span>4.9/5 Rating dari 30+ Klien Puas</span>
          </div>
          <h2 className="scroll-fade-in text-3xl md:text-4xl font-black text-slate-800 mb-4">
            Cerita Sukses Klien Kami
          </h2>
          <p className="scroll-fade-in text-lg text-slate-600">
            Kepuasan dan kesuksesan klien adalah prioritas utama kami
          </p>
        </div>

        {/* ── Cards Grid ───────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 min-h-[280px]">
          {visibleTestimonials.map((t, index) => (
            <div key={`${testimonialPage}-${index}`} className="scroll-fade-in group" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="h-full bg-white border border-slate-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={`w-5 h-5 drop-shadow-sm ${i < t.rating ? 'text-amber-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <blockquote className="text-slate-700 leading-relaxed text-base">"{t.text}"</blockquote>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md overflow-hidden">
                      {t.avatar
                        ? <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                        : <span className="text-white font-bold text-lg">{t.name.charAt(0).toUpperCase()}</span>
                      }
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{t.name}</div>
                      <div className="text-sm text-slate-500 flex items-center gap-1.5">
                        <FaCheckCircle className="w-3 h-3 text-green-500" />
                        {t.company || 'Verified Customer'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Pagination ───────────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mb-10">
            <button onClick={() => setTestimonialPage(p => Math.max(0, p - 1))} disabled={testimonialPage === 0}
              className="flex items-center justify-center w-11 h-11 rounded-xl border-2 border-slate-200 bg-white text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200">
              <FaChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2 items-center">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setTestimonialPage(i)}
                  className={`rounded-full transition-all duration-300 ${i === testimonialPage ? 'w-8 h-3 bg-gradient-to-r from-blue-600 to-orange-500' : 'w-3 h-3 bg-slate-300 hover:bg-slate-400'}`} />
              ))}
            </div>
            <button onClick={() => setTestimonialPage(p => Math.min(totalPages - 1, p + 1))} disabled={testimonialPage === totalPages - 1}
              className="flex items-center justify-center w-11 h-11 rounded-xl border-2 border-slate-200 bg-white text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200">
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <div className="text-center">
          <button onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-bold text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <HiSparkles className="w-5 h-5" />
            Tambah Ulasan
          </button>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal} />

          {/* Card */}
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden flex flex-col"
            style={{ maxHeight: 'min(90vh, 780px)', animation: 'modalFadeIn 0.28s ease-out' }}
          >
            {/* Top bar */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-orange-500 flex-shrink-0" />

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 px-7 pt-7 pb-2">

              {/* Header row */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h3 className="text-[1.25rem] font-black text-slate-800 leading-snug">Tulis Ulasan</h3>
                  <p className="text-sm text-slate-500 mt-1">Bagikan pengalaman Anda bersama NexCube</p>
                </div>
                <button onClick={handleCloseModal}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors ml-4 mt-0.5">
                  <FaTimes className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-6 pb-2">

                {/* ── Rating ── */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Rating <span className="text-red-400">*</span>
                  </label>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} type="button" onClick={() => setNewReview(r => ({ ...r, rating: star }))}
                          className="transition-transform hover:scale-110 focus:outline-none">
                          <FaStar className={`w-8 h-8 transition-colors duration-150 ${star <= newReview.rating ? 'text-amber-400' : 'text-slate-200'}`} />
                        </button>
                      ))}
                      <div className="ml-2 flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{newReview.rating} / 5</span>
                        <span className="text-xs text-slate-400">{ratingLabel[newReview.rating]}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Nama ── */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nama <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nama lengkap Anda"
                    value={newReview.name}
                    onChange={e => { setNewReview(r => ({ ...r, name: e.target.value })); if (errors.name) setErrors(err => ({ ...err, name: undefined })) }}
                    className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all ${errors.name ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">⚠ {errors.name}</p>}
                </div>

                {/* ── Perusahaan ── */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Perusahaan <span className="text-slate-400 font-normal">(opsional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nama perusahaan / usaha Anda"
                    value={newReview.company}
                    onChange={e => setNewReview(r => ({ ...r, company: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
                  />
                </div>

                {/* ── Ulasan ── */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Ulasan <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    placeholder="Ceritakan pengalaman Anda menggunakan layanan NexCube..."
                    rows={4}
                    value={newReview.text}
                    onChange={e => { setNewReview(r => ({ ...r, text: e.target.value })); if (errors.text) setErrors(err => ({ ...err, text: undefined })) }}
                    className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all resize-none ${errors.text ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`}
                  />
                  {errors.text && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">⚠ {errors.text}</p>}
                </div>

                {/* ── Foto Profil (file upload) ── */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Foto Profil <span className="text-slate-400 font-normal">(opsional)</span>
                  </label>

                  {/* Hidden input */}
                  <input ref={fileInputRef} type="file" accept={ACCEPTED_TYPES.join(',')} onChange={handleAvatarChange} className="hidden" />

                  {newReview.avatar ? (
                    /* Preview */
                    <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden shadow-sm ring-2 ring-white ring-offset-1 ring-offset-slate-100">
                        <img src={newReview.avatar} alt="preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{avatarFile?.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {avatarFile ? `${(avatarFile.size / 1024).toFixed(0)} KB` : ''}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button type="button" onClick={() => fileInputRef.current?.click()}
                          className="text-xs font-semibold text-blue-600 border border-blue-200 bg-white hover:bg-blue-50 rounded-lg px-3 py-1.5 transition-colors">
                          Ganti
                        </button>
                        <button type="button" onClick={handleRemoveAvatar}
                          className="text-xs font-semibold text-red-500 border border-red-200 bg-white hover:bg-red-50 rounded-lg px-3 py-1.5 transition-colors">
                          Hapus
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Drop zone */
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-slate-200 rounded-xl py-5 px-4 flex items-center gap-4 hover:border-blue-400 hover:bg-blue-50/40 transition-colors group text-left">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                        <svg className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-600 group-hover:text-blue-600 transition-colors">Klik untuk upload foto profil</p>
                        <p className="text-xs text-slate-400 mt-0.5">JPG, PNG, WEBP — maks. {MAX_SIZE_MB}MB · Inisial nama ditampilkan jika kosong</p>
                      </div>
                    </button>
                  )}
                </div>

              </div>
            </div>

            {/* Footer — sticky */}
            <div className="flex-shrink-0 px-7 py-5 border-t border-slate-100 flex gap-3">
              <button type="button" onClick={handleCloseModal}
                className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:border-slate-300 hover:bg-slate-50 transition-all duration-200">
                Batal
              </button>
              <button type="button" onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                <HiSparkles className="w-4 h-4" />
                Kirim Ulasan
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.96) translateY(14px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </section>
  )
}