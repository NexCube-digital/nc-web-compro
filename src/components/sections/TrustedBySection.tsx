import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

export const TrustedBySection: React.FC = () => {
  const clients = [
    { id: 1, name: 'CDC IWU', category: 'Universitas', logo: '/images/clients/client-1.png' },
    { id: 2, name: 'HIMATIF IWU', category: 'Organisasi Kampus', logo: '/images/clients/client-2.png' },
    { id: 4, name: 'Informatika IWU', category: 'Universitas', logo: '/images/clients/client-4.png' },
    { id: 5, name: 'Peluk Bumi', category: 'Komunitas', logo: '/images/clients/client-5.jpg' },
    { id: 6, name: 'Mekar Budaya', category: 'Komunitas', logo: '/images/clients/client-6.png' },
    { id: 3, name: 'Langgeng Inovasi Teknologi', category: 'Perusahaan', logo: '/images/clients/client-3.svg' },
    { id: 7, name: 'Onny Barber Center', category: 'Perusahaan', logo: '/images/clients/client-7.png' },
    { id: 8, name: 'Metanouva Informatika', category: 'Perusahaan', logo: '/images/clients/client-8.png' },
  
  ];

  // Split clients into balanced rows:
  // Baris 1: Universitas & Komunitas (CDC IWU, HIMATIF IWU, Informatika IWU, Peluk Bumi, Mekar Budaya - 5 logo di atas)
  // Baris 2: Perusahaan (Langgeng Inovasi Teknologi, Onny Barber Center, Metanouva Informatika - 3 logo di bawah)
  const balancedRows = React.useMemo(() => {
    const nonCompanies = clients.filter(c => c.category?.toLowerCase() !== 'perusahaan');
    const companies = clients.filter(c => c.category?.toLowerCase() === 'perusahaan');

    if (nonCompanies.length > 0 && companies.length > 0) {
      return [nonCompanies, companies];
    }

    const maxPerLine = 5;
    const rows: (typeof clients)[] = [];
    for (let i = 0; i < clients.length; i += maxPerLine) {
      rows.push(clients.slice(i, i + maxPerLine));
    }
    return rows;
  }, [clients]);

  return (
    <section className="py-10 sm:py-16 md:py-20 bg-gradient-to-b from-white via-blue-50/20 to-white relative overflow-hidden border-b border-slate-100">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[250px] bg-gradient-to-r from-blue-300/10 via-amber-300/10 to-blue-300/10 blur-3xl pointer-events-none rounded-full"></div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
        
        {/* Header Badge & Title */}
        <div className="text-center space-y-2 sm:space-y-3 mb-8 sm:mb-12 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 shadow-xs px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold text-[#126EFE]">
            <HiSparkles className="text-[#FBA41C] w-3.5 h-3.5" />
            <span>Dipercaya oleh <span className="font-extrabold text-slate-800">50+ UMKM & Instansi</span></span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Partner Terpercaya Untuk <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#126EFE] via-blue-600 to-[#FBA41C] bg-clip-text text-transparent">
              Pertumbuhan Bisnis & Event
            </span>
          </h2>
        </div>

        {/* Centered Client Logo Rows (Balanced so no row has only 1 logo) */}
        <div className="space-y-3 sm:space-y-4 md:space-y-5 max-w-6xl mx-auto">
          {balancedRows.map((row, rowIdx) => (
            <div 
              key={rowIdx} 
              className="flex flex-wrap justify-center items-stretch gap-2.5 sm:gap-4 md:gap-5"
            >
              {row.map((client) => {
                const isCompany = client.category?.toLowerCase() === 'perusahaan';

                return (
                  <div 
                    key={client.id}
                    className={`group relative bg-white hover:bg-gradient-to-b hover:from-blue-50/50 hover:to-white border border-slate-200/90 hover:border-blue-300 p-3.5 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-between text-center overflow-hidden ${
                      isCompany 
                        ? 'w-[calc(100%-0.5rem)] sm:w-[230px] md:w-[260px] lg:w-[285px]' 
                        : 'w-[calc(50%-0.4rem)] sm:w-[160px] md:w-[175px] lg:w-[185px]'
                    }`}
                  >
                    {/* Top Accent Gradient on Hover */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#126EFE] to-[#FBA41C] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Logo Container On Top (Wider container for Perusahaan) */}
                    <div className={`rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100/90 flex items-center justify-center p-2.5 sm:p-3 mb-2 sm:mb-4 group-hover:scale-105 group-hover:bg-blue-50/80 group-hover:border-blue-200 transition-all duration-300 shadow-2xs ${
                      isCompany
                        ? 'w-full max-w-[220px] h-16 sm:h-20 md:h-24 px-3 sm:px-4'
                        : 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24'
                    }`}>
                      <img 
                        src={client.logo} 
                        alt={client.name}
                        className="w-full h-full object-contain grayscale-0 md:grayscale md:group-hover:grayscale-0 transition-all duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLElement;
                          target.style.display = 'none';
                        }}
                      />
                      <FaShieldAlt className="w-5 h-5 sm:w-6 sm:h-6 text-[#126EFE] hidden group-hover:block" />
                    </div>

                    {/* Client Info Below Logo (No truncate so full name is visible) */}
                    <div className="space-y-1 w-full px-1">
                      <div 
                        className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#126EFE] transition-colors leading-snug break-words min-h-[2.5rem] flex items-center justify-center text-center"
                        title={client.name}
                      >
                        {client.name}
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400">
                        {client.category}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
