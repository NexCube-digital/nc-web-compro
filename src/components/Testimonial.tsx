import React, { useState, useEffect } from 'react'
import { FaStar, FaCheckCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { apiClient, getImageUrl } from '../services/api'

interface TestimonialItem {
  name: string
  company: string
  text: string
  rating: number
  avatar: string
}



const ITEMS_PER_PAGE = 3

export const Testimonial: React.FC = () => {
  const [testimonialPage, setTestimonialPage] = useState(0)
  const [testimonialsData, setTestimonialsData] = useState<TestimonialItem[]>([])
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  // Fetch published testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getPublishedTestimonials()
        if (response.success && response.data) {
          setTestimonialsData(response.data as TestimonialItem[])
          console.log('Testimonials loaded:', response.data) // Debug log
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  const totalPages = Math.ceil(testimonialsData.length / ITEMS_PER_PAGE)
  const visibleTestimonials = testimonialsData.slice(
    testimonialPage * ITEMS_PER_PAGE,
    (testimonialPage + 1) * ITEMS_PER_PAGE
  )

  // Calculate average rating and total testimonials
  const totalTestimonials = testimonialsData.length
  const averageRating = totalTestimonials > 0
    ? (testimonialsData.reduce((sum, t) => sum + t.rating, 0) / totalTestimonials).toFixed(1)
    : '0.0'

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
          {!loading && totalTestimonials > 0 && (
            <div className="scroll-fade-in inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-lg text-sm font-semibold text-orange-600 mb-4">
              <FaStar className="w-4 h-4" />
              <span>{averageRating}/5 Rating dari {totalTestimonials}+ Klien Puas</span>
            </div>
          )}
          <h2 className="scroll-fade-in text-3xl md:text-4xl font-black text-slate-800 mb-4">
            Cerita Sukses Klien Kami
          </h2>
          <p className="scroll-fade-in text-lg text-slate-600">
            Kepuasan dan kesuksesan klien adalah prioritas utama kami
          </p>
        </div>

        {/* ── Cards Grid ───────────────────────────────────────────────── */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[280px]">
            <div className="text-slate-500">Memuat testimoni...</div>
          </div>
        ) : testimonialsData.length === 0 ? (
          <div className="flex items-center justify-center min-h-[280px]">
            <div className="text-slate-500">Belum ada testimoni</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mb-8 min-h-[280px]">
          {visibleTestimonials.map((t, index) => {
            const testimonialId = t.name + t.company; // Simple ID for tracking errors
            const hasImageError = imageErrors.has(index);
            
            return (
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
                      {t.avatar && !hasImageError ? (
                        <img 
                          src={getImageUrl(t.avatar)} 
                          alt={t.name} 
                          className="w-full h-full object-cover"
                          onError={() => {
                            console.error('Failed to load image:', getImageUrl(t.avatar));
                            setImageErrors(prev => new Set(prev).add(index));
                          }}
                        />
                      ) : (
                        <span className="text-white font-bold text-lg">{t.name.charAt(0).toUpperCase()}</span>
                      )}
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
            )
          })}
        </div>
        )}

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

      </div>
    </section>
  )
}

export default Testimonial