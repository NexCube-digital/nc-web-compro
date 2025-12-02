import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { Layout } from '../components/layout/Layout';

export const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    budget: '',
    service: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Array kontak info yang terstruktur
  const contactInfo = [
    {
      title: "Telepon",
      info: "+62 813 1743 5622",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
        </svg>
      )
    },
    {
      title: "Email",
      info: "info@nexcube.com",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      )
    },
    {
      title: "Lokasi",
      info: "Jl. Bukit Jarian dlm VI, Bandung",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      )
    },
    {
      title: "Jam Kerja",
      info: "Senin - Jumat: 09:00 - 17:00\nSabtu: 09:00 - 13:00",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      )
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
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
    
    if (!formData.name.trim()) newErrors.name = 'Nama harus diisi';
    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.message.trim()) newErrors.message = 'Pesan harus diisi';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    // Simulate form submission - replace with actual API call in production
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        message: '',
        budget: '',
        service: ''
      });
    }, 1500);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50/50 to-white py-8 sm:py-14">
        <Helmet>
          <title>Hubungi Kami - NexCube Digital</title>
          <meta name="description" content="Hubungi NexCube Digital untuk konsultasi gratis 15 menit dan diskusikan kebutuhan digital Anda" />
        </Helmet>
        
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl font-heading font-semibold text-slate-900 drop-shadow-sm mb-2">Hubungi Kami</h1>
              <div className="w-20 h-1 bg-gradient-modern mx-auto mb-4 rounded-full"></div>
              <p className="text-slate-500 mt-3 sm:mt-4 text-base sm:text-lg">
                Konsultasi gratis 15 menit untuk semua klien baru.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 sm:gap-10">
              <div className="md:col-span-2">
                {submitted ? (
                  <div className="p-8 sm:p-10 bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl border border-green-100 text-center backdrop-blur-sm shadow-premium">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <h2 className="text-2xl font-heading font-semibold mb-3 text-green-800">Terima Kasih!</h2>
                    <p className="text-green-700 text-lg mb-8">Pesan Anda telah terkirim. Tim kami akan menghubungi Anda segera.</p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="btn-secondary bg-white px-8"
                    >
                      Kirim Pesan Lain
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="card-glass rounded-2xl p-6 sm:p-10 shadow-premium">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                          Nama <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          className={`input-premium w-full text-base ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                        />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`input-premium w-full ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                        />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="company" className="block text-sm font-medium text-slate-700">
                          Perusahaan / Proyek
                        </label>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          value={formData.company}
                          onChange={handleChange}
                          className="input-premium w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="service" className="block text-sm font-medium text-slate-700">
                          Layanan yang Dibutuhkan
                        </label>
                        <select
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="input-premium w-full"
                        >
                          <option value="">Pilih layanan</option>
                          <option value="website">Website</option>
                          <option value="undangan">Undangan Digital</option>
                          <option value="desain">Desain Grafis</option>
                          <option value="katalog">Menu & Katalog</option>
                          <option value="lainnya">Lainnya</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <label htmlFor="budget" className="block text-sm font-medium text-slate-700">
                          Budget
                        </label>
                        <select
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className="input-premium w-full"
                        >
                          <option value="">Pilih budget</option>
                          <option value="< 1jt">Dibawah 1 juta</option>
                          <option value="1-3jt">1 - 3 juta</option>
                          <option value="3-5jt">3 - 5 juta</option>
                          <option value="5-10jt">5 - 10 juta</option>
                          <option value="> 10jt">Diatas 10 juta</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <label htmlFor="message" className="block text-sm font-medium text-slate-700">
                          Pesan <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          className={`input-premium w-full ${errors.message ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                        />
                        {errors.message && <p className="text-red-500 text-xs">{errors.message}</p>}
                      </div>
                    </div>
                    
                    <div className="mt-8 sm:mt-10">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto btn-premium flex items-center justify-center text-base"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Mengirim...
                          </>
                        ) : 'Kirim Pesan'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
              
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="card-glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-premium">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-premium-light rounded-xl shadow-sm text-premium-700">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg mb-1">{item.title}</h3>
                        <p className="text-slate-600 whitespace-pre-line">{item.info}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Contact;