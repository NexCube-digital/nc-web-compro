import React from 'react';
import { FaRocket, FaUsers, FaChartLine, FaHeadset, FaCheck } from 'react-icons/fa';
import { useCountUp } from '../../hooks/useCountUp';

interface StatCounterProps {
  number: number;
  suffix: string;
  gradientClass?: string;
}

const StatCounter: React.FC<StatCounterProps> = React.memo(({ number, suffix, gradientClass }) => {
  const { formattedValue, elementRef } = useCountUp({
    end: number,
    duration: 2.2,
    suffix: suffix,
    enableScrollTrigger: true
  });

  return (
    <div 
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r ${gradientClass || 'from-slate-800 to-slate-900'} bg-clip-text text-transparent tracking-tight`}
    >
      {formattedValue()}
    </div>
  );
});

StatCounter.displayName = 'StatCounter';

export const StatsSection: React.FC = () => {
  const stats = [
    { 
      number: 50, suffix: '+', label: 'Proyek Selesai', 
      sublabel: 'Solusi Digital Berhasil Dideploy',
      icon: <FaRocket className="w-6 h-6 text-[#126EFE]" />,
      bgIcon: 'bg-blue-50 border-blue-100',
      gradientClass: 'from-[#126EFE] via-blue-600 to-blue-700',
      badge: 'Terverifikasi',
      badgeClass: 'bg-blue-50 text-[#126EFE] border-blue-200'
    },
    { 
      number: 30, suffix: '+', label: 'Klien Puas', 
      sublabel: 'UMKM & Perusahaan Terpercaya',
      icon: <FaUsers className="w-6 h-6 text-[#FBA41C]" />,
      bgIcon: 'bg-amber-50 border-amber-100',
      gradientClass: 'from-[#FBA41C] via-amber-500 to-orange-500',
      badge: '98% Retention',
      badgeClass: 'bg-amber-50 text-[#e08d07] border-amber-200'
    },
    { 
      number: 99, suffix: '%', label: 'Success Rate', 
      sublabel: 'Performa & Kecepatan Website',
      icon: <FaChartLine className="w-6 h-6 text-emerald-500" />,
      bgIcon: 'bg-emerald-50 border-emerald-100',
      gradientClass: 'from-emerald-500 via-teal-600 to-emerald-700',
      badge: 'Top Performance',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    { 
      number: 24, suffix: '/7', label: 'Support Responsif', 
      sublabel: 'Pendampingan Konsultasi Ramah',
      icon: <FaHeadset className="w-6 h-6 text-indigo-600" />,
      bgIcon: 'bg-indigo-50 border-indigo-100',
      gradientClass: 'from-indigo-600 via-purple-600 to-indigo-700',
      badge: 'Always Active',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    }
  ];

  return (
    <section className="relative py-12 md:py-16 bg-gradient-to-b from-white via-slate-50/50 to-white overflow-hidden border-y border-slate-100">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-300/10 via-amber-300/10 to-emerald-300/10 blur-3xl pointer-events-none rounded-full"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className="group relative bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/80 hover:border-blue-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-4 overflow-hidden"
            >
              {/* Subtle Ambient Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-amber-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

              <div className="relative z-10 flex items-center justify-between">
                <div className={`p-3.5 rounded-2xl border ${stat.bgIcon} group-hover:scale-110 transition-transform duration-300 shadow-xs`}>
                  {stat.icon}
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${stat.badgeClass} flex items-center gap-1`}>
                  <FaCheck className="w-2.5 h-2.5" />
                  {stat.badge}
                </span>
              </div>

              <div className="relative z-10 space-y-1 pt-2">
                <StatCounter number={stat.number} suffix={stat.suffix} gradientClass={stat.gradientClass} />
                <div className="text-sm font-bold text-slate-800 tracking-tight">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {stat.sublabel}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
