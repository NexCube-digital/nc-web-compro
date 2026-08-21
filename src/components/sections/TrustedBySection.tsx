import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

export const TrustedBySection: React.FC = () => {
  const clients = [
    { id: 1, name: 'CDC IWU', category: 'Universitas', logo: '/images/clients/client-1.png' },
    { id: 2, name: 'HIMATIF IWU', category: 'Organisasi Kampus', logo: '/images/clients/client-2.png' },
    { id: 3, name: 'PT. LANGIT', category: 'Perusahaan', logo: '/images/clients/client-3.svg' },
    { id: 4, name: 'Prodi Informatika IWU', category: 'Universitas', logo: '/images/clients/client-4.png' },
    { id: 5, name: 'Peluk Bumi', category: 'Komunitas', logo: '/images/clients/client-5.jpg' },
    { id: 6, name: 'Mekar Budaya', category: 'Komunitas', logo: '/images/clients/client-6.png' },
  ];

  return (
    <section className="py-14 md:py-20 bg-gradient-to-b from-white via-blue-50/20 to-white relative overflow-hidden border-b border-slate-100">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[250px] bg-gradient-to-r from-blue-300/10 via-amber-300/10 to-blue-300/10 blur-3xl pointer-events-none rounded-full"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header Badge & Title */}
        <div className="text-center space-y-3 mb-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 shadow-xs px-4 py-1.5 rounded-full text-xs font-bold text-[#126EFE]">
            <HiSparkles className="text-[#FBA41C] w-3.5 h-3.5" />
            <span>Dipercaya oleh <span className="font-extrabold text-slate-800">50+ UMKM & Instansi</span> di Indonesia</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Partner Terpercaya Untuk <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#126EFE] via-blue-600 to-[#FBA41C] bg-clip-text text-transparent">
              Pertumbuhan Bisnis & Event
            </span>
          </h2>
        </div>

        {/* Modern Interactive Client Logo Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 max-w-6xl mx-auto">
          {clients.map((client) => (
            <div 
              key={client.id}
              className="group relative bg-white hover:bg-gradient-to-b hover:from-blue-50/50 hover:to-white border border-slate-200/90 hover:border-blue-300 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-between text-center overflow-hidden"
            >
              {/* Top Accent Gradient on Hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#126EFE] to-[#FBA41C] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Larger Logo Container On Top */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-50 border border-slate-100/90 flex items-center justify-center p-3 mb-4 group-hover:scale-110 group-hover:bg-blue-50/80 group-hover:border-blue-200 transition-all duration-300 shadow-xs">
                <img 
                  src={client.logo} 
                  alt={client.name}
                  className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  onError={(e) => {
                    // Fallback to Icon if image fails
                    const target = e.target as HTMLElement;
                    target.style.display = 'none';
                  }}
                />
                <FaShieldAlt className="w-6 h-6 text-[#126EFE] hidden group-hover:block" />
              </div>

              {/* Client Info Below Logo */}
              <div className="space-y-1 w-full">
                <div className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#126EFE] transition-colors leading-snug">
                  {client.name}
                </div>
                <div className="text-[11px] font-semibold text-slate-400">
                  {client.category}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
