import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '../components/layout/Layout';
import apiClient from '../services/api';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

export const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    budget: '',
    service: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const contactInfo = [
    {
      title: "Telepon / WhatsApp",
      info: "+62 859 5031 3360",
      icon: <FaPhoneAlt className="w-4 h-4 sm:w-5 sm:h-5 text-[#126EFE]" />,
      badgeBg: 'bg-blue-50 border-blue-100'
    },
    {
      title: "Email Resmi",
      info: "nexcubedigital@gmail.com",
      icon: <FaEnvelope className="w-4 h-4 sm:w-5 sm:h-5 text-[#FBA41C]" />,
      badgeBg: 'bg-amber-50 border-amber-100'
    },
    {
      title: "Alamat Studio",
      info: "Jln. Bukit Jarian No. 30, Hegarmanah, Bandung, Jawa Barat, Indonesia",
      icon: <FaMapMarkerAlt className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />,
      badgeBg: 'bg-rose-50 border-rose-100'
    },
    {
      title: "Jam Kerja Layanan",
      info: "Senin - Jumat: 09:00 - 17:00\nSabtu: 09:00 - 13:00",
      icon: <FaClock className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />,
      badgeBg: 'bg-emerald-50 border-emerald-100'
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nama lengkap wajib diisi';
    if (!formData.email.trim()) {
      newErrors.email = 'Alamat email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.message.trim()) newErrors.message = 'Pesan atau detail proyek wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      await apiClient.submitContact({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        company: formData.company || undefined,
        phone: formData.phone || undefined,
        service: formData.service ? formData.service as any : undefined,
        budget: formData.budget ? formData.budget as any : undefined
      });
      
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: '',
        budget: '',
        service: ''
      });
      
      setTimeout(() => {
        setSubmitted(false);
      }, 6000);
    } catch (error: any) {
      setErrors({ form: error.message || 'Terjadi kesalahan saat mengirim pesan' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50/40 via-white to-slate-50/50 pt-24 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 overflow-hidden">
        <Helmet>
          <title>Hubungi Kami - NexCube Digital</title>
          <meta name="description" content="Hubungi NexCube Digital untuk konsultasi gratis 15 menit dan diskusikan kebutuhan digital Anda" />
        </Helmet>
        
        <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-6xl relative z-10">
          
          {/* Ambient Glows */}
          <div className="absolute top-10 left-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Header (Compact on Mobile) */}
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-14 space-y-2 sm:space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#126EFE] shadow-xs">
              <HiSparkles className="w-3.5 h-3.5 text-[#FBA41C]" />
              <span>KONSULTASI DIGITAL GRATIS 15 MENIT</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Hubungi <span className="bg-gradient-to-r from-[#126EFE] via-blue-600 to-[#FBA41C] bg-clip-text text-transparent">Tim NexCube</span>
            </h1>

            <p className="text-slate-600 text-xs sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Ada pertanyaan atau ingin mendiskusikan ide proyek digital Anda? Kirimkan pesan di bawah ini atau hubungi kami langsung via WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
            
            {/* Form Section (Left 7 Cols - Compact on Mobile) */}
            <div className="lg:col-span-7">
              {submitted ? (
                <div className="p-6 sm:p-12 bg-white rounded-2xl sm:rounded-3xl border border-emerald-200 shadow-xl text-center space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <FaCheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Pesan Berhasil Terkirim!</h2>
                  <p className="text-slate-600 text-xs sm:text-base max-w-md mx-auto leading-relaxed font-medium">
                    Terima kasih telah menghubungi NexCube Digital. Tim spesialis kami akan segera menanggapi pesan Anda via Email/WhatsApp.
                  </p>
                  <div className="pt-2 sm:pt-4">
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm transition-colors cursor-pointer"
                    >
                      Kirim Pesan Lain
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-10 border border-slate-200/90 shadow-xl shadow-blue-500/5 space-y-4 sm:space-y-6 relative overflow-hidden">
                  
                  {/* Top Accent Gradient Line */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#126EFE] via-blue-600 to-[#FBA41C]" />

                  {errors.form && (
                    <div className="p-3 sm:p-4 bg-rose-50 border border-rose-200 rounded-xl sm:rounded-2xl text-rose-700 text-xs sm:text-sm font-semibold">
                      {errors.form}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                    
                    {/* Name */}
                    <div className="space-y-1">
                      <label htmlFor="name" className="block text-xs sm:text-sm font-bold text-slate-700">
                        Nama Lengkap <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Contoh: Budi Santoso"
                        className={`w-full bg-slate-50 border px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                          errors.name ? 'border-rose-400' : 'border-slate-200 focus:border-[#126EFE]'
                        }`}
                      />
                      {errors.name && <p className="text-rose-500 text-[11px] font-semibold">{errors.name}</p>}
                    </div>
                    
                    {/* Email */}
                    <div className="space-y-1">
                      <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-slate-700">
                        Email Resmi <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="budi@perusahaan.com"
                        className={`w-full bg-slate-50 border px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                          errors.email ? 'border-rose-400' : 'border-slate-200 focus:border-[#126EFE]'
                        }`}
                      />
                      {errors.email && <p className="text-rose-500 text-[11px] font-semibold">{errors.email}</p>}
                    </div>
                    
                    {/* Company */}
                    <div className="space-y-1">
                      <label htmlFor="company" className="block text-xs sm:text-sm font-bold text-slate-700">
                        Nama Perusahaan / Bisnis
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="PT / CV / Toko Anda"
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-[#126EFE] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label htmlFor="phone" className="block text-xs sm:text-sm font-bold text-slate-700">
                        Nomor WhatsApp / Telepon
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="081234567890"
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-[#126EFE] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    
                    {/* Service Needed */}
                    <div className="space-y-1">
                      <label htmlFor="service" className="block text-xs sm:text-sm font-bold text-slate-700">
                        Kategori Layanan
                      </label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-[#126EFE] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                      >
                        <option value="">Pilih Kategori</option>
                        <option value="website">Website Premium</option>
                        <option value="undangan">Undangan Digital</option>
                        <option value="desain">Desain Grafis & Branding</option>
                        <option value="katalog">Katalog Digital & QR Menu</option>
                        <option value="lainnya">Lainnya / Custom</option>
                      </select>
                    </div>
                    
                    {/* Budget */}
                    <div className="space-y-1">
                      <label htmlFor="budget" className="block text-xs sm:text-sm font-bold text-slate-700">
                        Perkiraan Budget
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-[#126EFE] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                      >
                        <option value="">Pilih Budget</option>
                        <option value="< 1jt">Di bawah Rp 1 Juta</option>
                        <option value="1-3jt">Rp 1 - 3 Juta</option>
                        <option value="3-5jt">Rp 3 - 5 Juta</option>
                        <option value="5-10jt">Rp 5 - 10 Juta</option>
                        <option value="> 10jt">Di atas Rp 10 Juta</option>
                      </select>
                    </div>
                    
                    {/* Message */}
                    <div className="space-y-1 sm:col-span-2">
                      <label htmlFor="message" className="block text-xs sm:text-sm font-bold text-slate-700">
                        Detail Pesan & Proyek <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Jelaskan gambaran singkat kebutuhan proyek Anda..."
                        className={`w-full bg-slate-50 border px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                          errors.message ? 'border-rose-400' : 'border-slate-200 focus:border-[#126EFE]'
                        }`}
                      />
                      {errors.message && <p className="text-rose-500 text-[11px] font-semibold">{errors.message}</p>}
                    </div>

                  </div>
                  
                  {/* Submit Button */}
                  <div className="pt-1 sm:pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#126EFE] to-blue-700 hover:from-[#0950be] hover:to-blue-800 text-white font-extrabold py-3 px-6 sm:py-3.5 sm:px-8 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Mengirim Pesan...</span>
                      ) : (
                        <>
                          <FaPaperPlane className="w-3.5 h-3.5" />
                          <span>Kirim Pesan Konsultasi</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
            
            {/* Info Section (Right 5 Cols - Compact on Mobile) */}
            <div className="lg:col-span-5 space-y-3 sm:space-y-4">
              
              {contactInfo.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-300 flex items-start gap-3 sm:gap-4"
                >
                  <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl ${item.badgeBg} border flex items-center justify-center shrink-0`}>
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 mb-0.5">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium whitespace-pre-line leading-relaxed">{item.info}</p>
                  </div>
                </div>
              ))}

              {/* Direct WhatsApp Fast Response Box */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-xl space-y-2.5 sm:space-y-3 relative overflow-hidden">
                <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold text-emerald-100">
                  <FaWhatsapp className="w-3.5 h-3.5 text-white" />
                  <span>RESPON CEPAT WHATSAPP</span>
                </div>

                <h3 className="text-base sm:text-lg font-black tracking-tight leading-snug">
                  Ingin Respon Langsung & Diskusi Lebih Cepat?
                </h3>

                <p className="text-emerald-100 text-xs leading-relaxed font-medium">
                  Hubungi tim konsultan kami via WhatsApp untuk mendapatkan estimasi harga & jawaban instan.
                </p>

                <div className="pt-1 sm:pt-2">
                  <a 
                    href="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20langsung%20tentang%20proyek%20saya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold px-5 py-2.5 rounded-xl sm:rounded-2xl text-xs shadow-md transition-colors cursor-pointer"
                  >
                    <FaWhatsapp className="w-4 h-4 text-white" />
                    <span>Chat WhatsApp Sekarang</span>
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Contact;