export interface PricingTier {
  id: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  accent: string;
  badge?: string;
  popular?: boolean;
}

export const pricingData: PricingTier[] = [
  {
    id: 'student',
    title: 'Student',
    price: 'Rp 300.000',
    description: 'Paket khusus untuk mahasiswa dengan kebutuhan digital sederhana',
    features: ['Paket khusus untuk mahasiswa. Ideal untuk portofolio personal atau tugas kuliah dengan kebutuhan website sederhana.'],
    accent: 'bg-gradient-to-br from-blue-50 to-white',
    badge: 'Khusus Mahasiswa'
  },
  {
    id: 'bronze',
    title: 'Bronze',
    price: 'Rp 800.000',
    description: 'Awal Kehadiran Digital untuk bisnis yang baru memasuki ruang online',
    features: ['Awal Kehadiran Digital. Ideal untuk individu atau bisnis yang baru memasuki ruang online dan membutuhkan website company profile dasar yang efisien.'],
    accent: 'bg-gradient-to-br from-slate-50 to-white'
  },
  {
    id: 'silver',
    title: 'Silver',
    price: 'Rp 1.200.000',
    description: 'Pembangunan Brand dan Kepercayaan untuk bisnis yang serius',
    features: ['Pembangunan Brand dan Kepercayaan. Dirancang untuk pebisnis yang serius membangun citra digital yang kuat dan otoritatif.'],
    accent: 'bg-gradient-to-br from-slate-100 to-white'
  },
  {
    id: 'gold',
    title: 'Gold',
    price: 'Rp 2.000.000',
    description: 'Kompleksitas Layanan Tinggi untuk perusahaan dengan beragam produk',
    features: ['Kompleksitas Layanan Tinggi. Ditujukan bagi perusahaan dengan beragam produk atau layanan yang membutuhkan struktur konten yang luas dan presentasi informasi yang mendalam.'],
    accent: 'bg-gradient-to-br from-amber-50 to-white',
    popular: true
  },
  {
    id: 'platinum',
    title: 'Platinum',
    price: 'Rp 5.000.000',
    description: 'Kontrol Penuh & Kepemilikan Aset untuk solusi enterprise',
    features: ['Kontrol Penuh & Kepemilikan Aset. Pilihan ideal bagi klien yang ingin memiliki kendali penuh atas infrastruktur, kode sumber, dan data tanpa ikatan biaya operasional vendor.'],
    accent: 'bg-gradient-to-br from-slate-800 to-slate-900 text-white'
  }
];

export const getPricingTierById = (id: string): PricingTier | undefined => {
  return pricingData.find(tier => tier.id === id);
};
