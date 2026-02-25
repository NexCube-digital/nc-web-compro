import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async';
import { PricingCard } from '../ui/PricingCard'
import apiClient from '../services/api'
import { Navbar } from '../components/layout/Navbar';
import { useScrollFadeIn, useScrollScale, useParallax } from '../hooks/useGsapAnimation';
import { useSmoothScroll } from '../hooks/useSmoothAnimation';
import {
  HiSparkles, HiCheckCircle, HiShoppingCart,
  HiLightBulb, HiGlobe, HiClock,
  HiHeart, HiStar, HiTag, HiBadgeCheck,
  HiUsers, HiExclamationCircle, HiRefresh
} from 'react-icons/hi';
import {
  FaRocket, FaArrowRight, FaWhatsapp,
  FaPalette, FaGoogle, FaCrown, FaMedal, FaGem
} from 'react-icons/fa';
import {
  SiStripe, SiPaypal, SiGoogleanalytics, SiMailchimp, SiHubspot,
  SiSalesforce, SiShopify, SiWordpress, SiWoo, SiMagento,
  SiAmazon, SiDocker,
} from 'react-icons/si';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCart } from '../context/CartContext';
import { openCartDrawer } from '../components/cart/CartDrawer';

gsap.registerPlugin(ScrollTrigger);

// ─── BASE CATEGORY DEFINITIONS ────────────────────────────────────────────────
const basePaketCategories = [
  {
    id: 'website',
    title: 'Website Premium',
    description: 'Solusi website profesional untuk bisnis Anda',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    gradient: 'from-blue-500 to-purple-600',
    tierIds: ['student', 'bronze', 'silver', 'gold', 'platinum'],
    routePath: '/paket/website',
  },

    {
    id: 'affiliate',
    title: 'Program Affiliate',
    description: 'Hasilkan komisi dengan merekomendasikan layanan NexCube Digital',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    gradient: 'from-violet-500 to-indigo-600',
    tierIds: [],
    routePath: '/paket/affiliate',
  },

  {
    id: 'undangan',
    title: 'Undangan Digital',
    description: 'Undangan interaktif untuk acara spesial Anda',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    gradient: 'from-emerald-500 to-teal-600',
    tierIds: ['bronze', 'silver', 'gold'],
    routePath: '/paket/undangan-digital',
  },
  {
    id: 'desain',
    title: 'Desain Grafis',
    description: 'Desain visual yang menarik dan profesional',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    gradient: 'from-rose-500 to-pink-600',
    tierIds: ['bronze', 'silver', 'gold', 'platinum'],
    routePath: '/paket/desain-grafis',
  },
  {
    id: 'katalog',
    title: 'Katalog Digital',
    description: 'Menu digital dan katalog produk interaktif',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    gradient: 'from-orange-500 to-amber-600',
    tierIds: ['silver', 'gold', 'platinum'],
    routePath: '/paket/menu-katalog',
  },
];

// ─── BUSINESS SOLUTIONS ────────────────────────────────────────────────────────
const businessSolutions = [
  {
    id: 'startup',
    title: 'Startup & UMKM',
    icon: <FaRocket className="w-6 h-6" />,
    gradient: 'from-blue-600 to-cyan-500',
    lightGradient: 'from-blue-50 to-cyan-50',
    description: 'Solusi lengkap untuk memulai dan mengembangkan bisnis digital',
    features: ['Website Company Profile', 'Landing Page Produk', 'Social Media Management', 'Digital Marketing Basic', 'Email Marketing'],
    relevantCategories: ['website', 'desain'],
  },
  {
    id: 'resto',
    title: 'Resto & Cafe',
    icon: <HiShoppingCart className="w-6 h-6" />,
    gradient: 'from-orange-600 to-amber-500',
    lightGradient: 'from-orange-50 to-amber-50',
    description: 'Digitalisasi restoran dengan menu QR, online ordering, dan loyalty program',
    features: ['Menu Digital QR Code', 'Online Ordering System', 'Table Management', 'Loyalty Program', 'POS Integration'],
    relevantCategories: ['katalog', 'website'],
  },
  {
    id: 'retail',
    title: 'Retail & E-commerce',
    icon: <FaGoogle className="w-6 h-6" />,
    gradient: 'from-purple-600 to-pink-500',
    lightGradient: 'from-purple-50 to-pink-50',
    description: 'Toko online dengan fitur lengkap, inventory management, dan payment gateway',
    features: ['E-commerce Platform', 'Inventory Management', 'Multi-payment Gateway', 'Shipping Integration', 'Analytics Dashboard'],
    relevantCategories: ['website', 'katalog'],
  },
  {
    id: 'creative',
    title: 'Creative Agency',
    icon: <FaPalette className="w-6 h-6" />,
    gradient: 'from-rose-600 to-red-500',
    lightGradient: 'from-rose-50 to-red-50',
    description: 'Portfolio website, client management, dan tools kolaborasi untuk agency',
    features: ['Portfolio Showcase', 'Project Management', 'Client Portal', 'Proposal Generator', 'Time Tracking'],
    relevantCategories: ['desain', 'website'],
  },
  {
    id: 'event',
    title: 'Event & Pernikahan',
    icon: <HiHeart className="w-6 h-6" />,
    gradient: 'from-pink-600 to-rose-500',
    lightGradient: 'from-pink-50 to-rose-50',
    description: 'Undangan digital elegan untuk momen spesial tak terlupakan',
    features: ['Undangan Digital Interaktif', 'RSVP Online', 'Live Streaming', 'Digital Album', 'Countdown Timer'],
    relevantCategories: ['undangan'],
  },
  {
    id: 'education',
    title: 'Pendidikan',
    icon: <HiLightBulb className="w-6 h-6" />,
    gradient: 'from-emerald-600 to-teal-500',
    lightGradient: 'from-emerald-50 to-teal-50',
    description: 'LMS, kelas online, dan sistem manajemen sekolah/kursus',
    features: ['Learning Management System', 'Student Portal', 'Course Management', 'Quiz & Assessment', 'Certificate Generator'],
    relevantCategories: ['website', 'desain'],
  },
];

// ─── INTEGRATIONS ──────────────────────────────────────────────────────────────
const integrations = [
  { icon: SiStripe, name: 'Stripe', color: 'text-purple-600' },
  { icon: SiPaypal, name: 'PayPal', color: 'text-blue-800' },
  { icon: SiGoogleanalytics, name: 'Analytics', color: 'text-yellow-600' },
  { icon: SiMailchimp, name: 'Mailchimp', color: 'text-yellow-500' },
  { icon: SiHubspot, name: 'HubSpot', color: 'text-orange-500' },
  { icon: SiSalesforce, name: 'Salesforce', color: 'text-blue-500' },
  { icon: SiShopify, name: 'Shopify', color: 'text-green-600' },
  { icon: SiWordpress, name: 'WordPress', color: 'text-blue-600' },
  { icon: SiWoo, name: 'WooCommerce', color: 'text-purple-600' },
  { icon: SiMagento, name: 'Magento', color: 'text-orange-600' },
  { icon: SiAmazon, name: 'AWS', color: 'text-yellow-500' },
  { icon: SiDocker, name: 'Docker', color: 'text-blue-500' },
];


// ─── STATS ────────────────────────────────────────────────────────────────────
const stats = [
  { value: '500+', label: 'Klien Aktif', icon: HiUsers, color: 'from-blue-600 to-cyan-500' },
  { value: '98%', label: 'Kepuasan Klien', icon: HiStar, color: 'from-orange-500 to-amber-500' },
  { value: '50+', label: 'Integrasi Platform', icon: HiGlobe, color: 'from-purple-600 to-pink-500' },
  { value: '24/7', label: 'Support', icon: HiClock, color: 'from-green-600 to-emerald-500' },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const normalizeTypeForCategory = (backendType: string) => {
  if (!backendType) return backendType;
  const t = String(backendType).toLowerCase();
  if (t === 'event' || t === 'undangan' || t === 'undangan-digital') return 'undangan';
  if (t === 'website' || t === 'web') return 'website';
  if (t === 'desain' || t === 'desain-grafis') return 'desain';
  if (t === 'katalog' || t === 'menu-katalog') return 'katalog';
  if (t === 'affiliate') return 'affiliate';

  return t;
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export const PaketAffiliate: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);
  const [paketCategories, setPaketCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('website');
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeSolution, setActiveSolution] = useState<string | null>(null);

  // ── Affiliate filter state ────────────────────────────────────────────────
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');
  const [affiliateLoading, setAffiliateLoading] = useState(false);
  const [affiliateError, setAffiliateError] = useState<string | null>(null);
  const [paketData, setPaketData] = useState<any[]>([]);

  const { addItem } = useCart();

  const heroLogoRef = useRef<HTMLDivElement>(null);
  const heroBadgeRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroDescRef = useRef<HTMLParagraphElement>(null);
  const heroStatsRef = useRef<HTMLDivElement>(null);
  const heroCTARef = useRef<HTMLDivElement>(null);
  const floatingElementsRef = useRef<HTMLDivElement>(null);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const integrationsRef = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);

  useScrollFadeIn('.scroll-fade-in');
  useScrollScale('.scale-on-scroll');
  useParallax('.parallax-element', 0.3);
  useSmoothScroll();

  // ── Fetch affiliate packages ───────────────────────────────────────────────
  const fetchData = async () => {
    setAffiliateLoading(true);
    setAffiliateError(null);
    try {
      const res = await apiClient.getPackages();
      if (res && res.data) {
        const affiliatePkgs = res.data.filter(
          (pkg: any) => normalizeTypeForCategory(pkg.type) === 'affiliate'
        );
        setPaketData(affiliatePkgs);
      }
    } catch (e: any) {
      setAffiliateError(e?.message || 'Terjadi kesalahan saat memuat data.');
    } finally {
      setAffiliateLoading(false);
    }
  };

  // ── Fetch packages & build categories ────────────────────────────────────
  useEffect(() => {
    const fetchPackagesAndCategories = async () => {
      try {
        const res = await apiClient.getPackages();
        if (res && res.data) {
          const normalized = res.data.map((pkg: any) => ({
            ...pkg,
            _normalizedType: normalizeTypeForCategory(pkg.type),
          }));
          setPackages(normalized);

          // Also populate paketData for affiliate filters
          const affiliatePkgs = normalized.filter((pkg: any) => pkg._normalizedType === 'affiliate');
          setPaketData(affiliatePkgs);

          const packagesByType: Record<string, any[]> = {};
          normalized.forEach((pkg: any) => {
            const t = pkg._normalizedType || pkg.type;
            if (!packagesByType[t]) packagesByType[t] = [];
            packagesByType[t].push(pkg);
          });

          const categories = basePaketCategories
            .map((baseCat) => {
              const pkgsForType = packagesByType[baseCat.id] || [];
              return {
                ...baseCat,
                packageCount: pkgsForType.length,
                hasPackages: pkgsForType.length > 0,
                tierIds: pkgsForType.map((p: any) => p.id),
              };
            })
            .filter((cat) => cat.hasPackages && cat.id === 'affiliate');

          setPaketCategories(categories);
          if (categories.length > 0) setActiveTab(categories[0].id);
        }
      } catch (e) {
        console.error('Failed to load packages', e);
        setPaketCategories(basePaketCategories);
      }
    };
    fetchPackagesAndCategories();
  }, []);

  // ── Derived filter values ─────────────────────────────────────────────────
  const uniqueCategories = Array.from(
    new Set(paketData.map((p: any) => p.level || p.category || p.badge).filter(Boolean))
  ) as string[];

  const filteredPaketData = paketData.filter((pkg: any) => {
    const matchLevel =
      selectedLevel === 'all' || (pkg.level || pkg.category || pkg.badge) === selectedLevel;

    const rawPrice =
      typeof pkg.rawPrice === 'number'
        ? pkg.rawPrice
        : parseInt(String(pkg.price || '0').replace(/\D/g, '')) || 0;

    const matchBudget =
      selectedBudget === 'all' ||
      (selectedBudget === 'budget' && rawPrice < 3_000_000) ||
      (selectedBudget === 'medium' && rawPrice >= 3_000_000 && rawPrice <= 7_000_000) ||
      (selectedBudget === 'premium' && rawPrice > 7_000_000);

    return matchLevel && matchBudget;
  });

  // ── GSAP animations ───────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);

    if (heroBadgeRef.current) {
      gsap.fromTo(heroBadgeRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'elastic.out(1,0.8)', delay: 0.1 });
    }
    if (heroTitleRef.current) {
      const words = heroTitleRef.current.querySelectorAll('.hero-word');
      gsap.fromTo(words, { y: 80, opacity: 0, skewY: 5 }, { y: 0, opacity: 1, skewY: 0, duration: 1.2, ease: 'expo.out', stagger: 0.2, delay: 0.3 });
    }
    if (heroDescRef.current) {
      gsap.fromTo(heroDescRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.7 });
    }
    if (heroStatsRef.current) {
      const cards = heroStatsRef.current.querySelectorAll('.stat-card');
      gsap.fromTo(cards, { scale: 0.7, opacity: 0, y: 50 }, { scale: 1, opacity: 1, y: 0, duration: 0.9, ease: 'back.out(1.7)', stagger: 0.12, delay: 0.9 });
    }
    if (heroCTARef.current) {
      const btns = heroCTARef.current.querySelectorAll('.cta-button');
      gsap.fromTo(btns, { y: 40, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'expo.out', stagger: 0.18, delay: 1.3 });
    }
    if (heroLogoRef.current) {
      gsap.to(heroLogoRef.current, { rotation: 360, duration: 20, ease: 'none', repeat: -1 });
    }
    if (floatingElementsRef.current) {
      const els = floatingElementsRef.current.children;
      gsap.to(els, { y: 'random(-25,25)', x: 'random(-15,15)', rotation: 'random(-20,20)', duration: 'random(4,7)', repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.3 });
    }
    if (solutionsRef.current) {
      gsap.fromTo(
        solutionsRef.current.querySelectorAll('.sol-card'),
        { scale: 0.85, opacity: 0, y: 60 },
        { scale: 1, opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'back.out(1.4)', scrollTrigger: { trigger: solutionsRef.current, start: 'top 80%', toggleActions: 'play none none reverse' } }
      );
    }
    if (integrationsRef.current) {
      gsap.fromTo(
        integrationsRef.current.querySelectorAll('.int-card'),
        { scale: 0, opacity: 0, rotation: -10 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.6, stagger: 0.05, ease: 'back.out(1.7)', scrollTrigger: { trigger: integrationsRef.current, start: 'top 80%', toggleActions: 'play none none reverse' } }
      );
    }
    if (testimonialRef.current) {
      gsap.fromTo(
        testimonialRef.current.querySelectorAll('.testi-card'),
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, stagger: 0.18, ease: 'power3.out', scrollTrigger: { trigger: testimonialRef.current, start: 'top 80%', toggleActions: 'play none none reverse' } }
      );
    }

    // Scroll listener for sidebar
    const handleScroll = () => {
      const packagesSection = document.getElementById('packages-solusi');
      if (packagesSection) {
        const rect = packagesSection.getBoundingClientRect();
        setShowSidebar(rect.top <= 100);
      }
    };

    // Intersection Observer to update active tab
    const observerOptions = { root: null, rootMargin: '-20% 0px -70% 0px', threshold: 0 };
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (paketCategories.length === 0) return;
      let bestEntry: IntersectionObserverEntry | undefined;
      let bestRatio = 0;
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
          bestEntry = entry;
          bestRatio = entry.intersectionRatio;
        }
      }
      if (bestEntry) {
        const sectionId = bestEntry.target.getAttribute('data-category');
        if (sectionId) setActiveTab(sectionId);
      }
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = document.querySelectorAll('[data-category]');
    sections.forEach((s) => observer.observe(s));

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [paketCategories]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getCategoryPackages = (categoryId: string) =>
    packages.filter((p) => (p._normalizedType || normalizeTypeForCategory(p.type)) === categoryId);

  const handleCategoryClick = (categoryId: string) => {
    const targetSection = document.querySelector(`[data-category="${categoryId}"]`);
    if (targetSection) {
      setActiveTab(categoryId);
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // ── Render per-category section ───────────────────────────────────────────
  const renderPricingSection = (category: typeof paketCategories[0]) => {
    const categoryPricing = getCategoryPackages(category.id);
    if (categoryPricing.length === 0 && !affiliateLoading && !affiliateError) return null;

    // For affiliate category, use filtered data; otherwise use raw categoryPricing
    const displayPricing = category.id === 'affiliate' ? filteredPaketData : categoryPricing;

    return (
      <div key={category.id} data-category={category.id} className="mb-24 scroll-mt-32 scroll-fade-in relative z-20">

        {/* ── Affiliate-specific section header & filters ── */}
        {category.id === 'affiliate' && (
          <>
            {/* Section header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-sm font-semibold text-blue-600 mb-4">
                <HiTag className="w-4 h-4" /><span>Paket Layanan Affiliate</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-4">
                <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Pilih </span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Paket Affiliate Anda</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Setiap paket dirancang untuk kebutuhan yang berbeda — dari pemula hingga skala besar.
              </p>
            </div>

            {/* Filters */}
            {!affiliateLoading && !affiliateError && paketData.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl px-2 py-1.5 shadow-md flex-wrap">
                  {(['all', ...uniqueCategories] as string[]).map(cat => (
                    <button key={cat} onClick={() => setSelectedLevel(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${selectedLevel === cat ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                    >{cat === 'all' ? 'Semua' : cat}</button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl px-2 py-1.5 shadow-md">
                  {[
                    { id: 'all',     label: 'Semua Harga' },
                    { id: 'budget',  label: '< 3jt'       },
                    { id: 'medium',  label: '3–7jt'       },
                    { id: 'premium', label: '> 7jt'       },
                  ].map(b => (
                    <button key={b.id} onClick={() => setSelectedBudget(b.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${selectedBudget === b.id ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                    >{b.label}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading */}
            {affiliateLoading && (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-14 h-14 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
                <p className="text-slate-500 font-medium">Memuat paket affiliate...</p>
              </div>
            )}

            {/* Error */}
            {!affiliateLoading && affiliateError && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <HiExclamationCircle className="w-16 h-16 text-red-400" />
                <p className="text-lg text-slate-600 font-semibold">Gagal memuat paket</p>
                <p className="text-sm text-slate-400">{affiliateError}</p>
                <button onClick={fetchData} className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                  <HiRefresh className="w-4 h-4" /> Coba Lagi
                </button>
              </div>
            )}
          </>
        )}

        {/* ── Default Category Header (for non-affiliate categories) ── */}
        {category.id !== 'affiliate' && (
          <div className="mb-12 text-center">
            <div className="inline-flex flex-col items-center">
              <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${category.gradient} text-white px-8 py-4 rounded-3xl mb-5 shadow-2xl scale-on-scroll relative z-20`}>
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">{category.icon}</div>
                <span className="font-black text-xl">{category.title}</span>
              </div>
              <p className="text-slate-600 text-lg mt-2 max-w-2xl mx-auto font-medium">{category.description}</p>
            </div>
          </div>
        )}

        {/* ── Pricing Cards (skip if loading or error for affiliate) ── */}
        {!(category.id === 'affiliate' && (affiliateLoading || affiliateError)) && (
          <div className="max-w-7xl mx-auto">
            {/* First row: first 3 */}
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
              {displayPricing.slice(0, 3).map((tier, index) => {
                const title = tier.title || `Package ${index + 1}`;
                const price = tier.price || '';
                const features = tier.features || [];
                const includes = tier.includes || [];
                const hot = tier.hot || false;
                const detailUrl = `/paket/solusi/${category.id}/${tier.id}`;

                return (
                  <div key={`pkg-${tier.id}`} className="scroll-fade-in scale-on-scroll">
                    {category.id === 'undangan' ? (
                      <a href={tier.link || tier.url || '#'} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition">
                        <div className="h-56 w-full bg-gray-100 overflow-hidden">
                          <img src={(tier.images && tier.images[0]) || tier.image || '/images/placeholder.png'} alt={title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4 bg-white">
                          <div className="font-bold text-lg">{title}</div>
                          <div className="text-sm text-slate-600">{price}</div>
                        </div>
                      </a>
                    ) : (
                      <PricingCard
                        tier={title}
                        price={price}
                        features={features}
                        includes={includes}
                        accent={tier.accent}
                        badge={tier.badge}
                        popular={hot || tier.popular}
                        detailUrl={detailUrl}
                        onOrder={() => {
                          addItem({
                            id: tier.id || `${category.id}-${index}`,
                            name: title,
                            price: typeof tier.rawPrice === 'number'
                              ? tier.rawPrice
                              : parseInt(String(tier.price || '0').replace(/\D/g, '')) || 0,
                            quantity: 1,
                            description: `${category.title} - ${tier.badge || ''}`,
                          });
                          openCartDrawer();
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Second row: remaining */}
            {displayPricing.length > 3 && (
              <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto">
                {displayPricing.slice(3).map((tier, index) => {
                  const title = tier.title || `Package ${index + 4}`;
                  const price = tier.price || '';
                  const features = tier.features || [];
                  const includes = tier.includes || [];
                  const hot = tier.hot || false;
                  const detailUrl = `/paket/solusi/${category.id}/${tier.id}`;

                  return (
                    <div key={`pkg-${tier.id}`} className="scroll-fade-in scale-on-scroll">
                      {category.id === 'undangan' ? (
                        <a href={tier.link || tier.url || '#'} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition">
                          <div className="h-56 w-full bg-gray-100 overflow-hidden">
                            <img src={(tier.images && tier.images[0]) || tier.image || '/images/placeholder.png'} alt={title} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-4 bg-white">
                            <div className="font-bold text-lg">{title}</div>
                            <div className="text-sm text-slate-600">{price}</div>
                          </div>
                        </a>
                      ) : (
                        <PricingCard
                          tier={title}
                          price={price}
                          features={features}
                          includes={includes}
                          accent={tier.accent}
                          badge={tier.badge}
                          popular={hot || tier.popular}
                          detailUrl={detailUrl}
                          onOrder={() => {
                            addItem({
                              id: tier.id || `${category.id}-${index + 3}`,
                              name: title,
                              price: typeof tier.rawPrice === 'number'
                                ? tier.rawPrice
                                : parseInt(String(tier.price || '0').replace(/\D/g, '')) || 0,
                              quantity: 1,
                              description: `${category.title} - ${tier.badge || ''}`,
                            });
                            openCartDrawer();
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty filtered state for affiliate */}
            {category.id === 'affiliate' && !affiliateLoading && !affiliateError && filteredPaketData.length === 0 && paketData.length > 0 && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                  <HiTag className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-lg text-slate-600 font-semibold">Tidak ada paket yang sesuai</p>
                <p className="text-sm text-slate-400">Coba ubah filter untuk melihat lebih banyak pilihan.</p>
                <button
                  onClick={() => { setSelectedLevel('all'); setSelectedBudget('all'); }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        )}

        {/* Separator */}
        <div className="mt-24 mb-8">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />

      {/* Fixed background orbs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-orange-400/20 rounded-full blur-3xl -translate-x-48 -translate-y-48 animate-pulse parallax-element pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-blue-500/20 rounded-full blur-3xl translate-x-48 translate-y-48 animate-pulse parallax-element pointer-events-none z-0" style={{ animationDelay: '2s' }}></div>

      {/* Floating cubes */}
      <div className="fixed top-20 right-10 opacity-20 pointer-events-none z-0">
        <div className="floating-element">
          <svg viewBox="0 0 100 100" className="w-32 h-32">
            <defs>
              <linearGradient id="cubeGradSolusi" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#0066FF' }} />
                <stop offset="100%" style={{ stopColor: '#0052CC' }} />
              </linearGradient>
            </defs>
            <path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z" fill="url(#cubeGradSolusi)" />
            <path d="M50 10 L90 30 L50 50 L10 30 Z" fill="#0080FF" opacity="0.8" />
            <path d="M50 50 L50 90 L10 70 L10 30 Z" fill="#0052CC" opacity="0.9" />
          </svg>
        </div>
      </div>
      <div className="fixed bottom-20 left-10 opacity-20 pointer-events-none z-0" style={{ animationDelay: '1s' }}>
        <div className="floating-element">
          <svg viewBox="0 0 100 100" className="w-40 h-40">
            <path d="M50 20 L85 40 L85 75 L50 85 L15 75 L15 40 Z" fill="url(#cubeGradSolusi)" />
          </svg>
        </div>
      </div>

      {/* NEXCUBE watermark */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none z-0 select-none">
        <div className="parallax-element text-[10rem] md:text-[15rem] font-black bg-gradient-to-r from-blue-600/30 to-orange-500/30 bg-clip-text text-transparent">NEXCUBE</div>
      </div>

      {/* Ambient floating blobs */}
      <div ref={floatingElementsRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="absolute top-3/4 right-1/4 w-28 h-28 bg-orange-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 right-1/3 w-36 h-36 bg-pink-500/10 rounded-full blur-2xl"></div>
      </div>

      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-x-hidden">
        <Helmet>
          <title>Paket Solusi Bisnis - NexCube Digital</title>
          <meta name="description" content="Solusi digital terintegrasi untuk berbagai industri — website, undangan, desain, dan katalog dari NexCube Digital" />
        </Helmet>

        {/* ════════ HERO ════════ */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/30"></div>
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(#0066FF 1px, transparent 1px), linear-gradient(90deg, #0066FF 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}></div>

          {/* Rotating logo */}
          <div className="absolute top-20 right-10 opacity-10" ref={heroLogoRef}>
            <div className="w-64 h-64 md:w-96 md:h-96">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <linearGradient id="logoGradSolusi" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#0066FF' }} />
                    <stop offset="100%" style={{ stopColor: '#0052CC' }} />
                  </linearGradient>
                  <linearGradient id="orangeFrameSolusi" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FF9900' }} />
                    <stop offset="100%" style={{ stopColor: '#FF7700' }} />
                  </linearGradient>
                </defs>
                <rect x="30" y="30" width="140" height="140" rx="10" fill="url(#orangeFrameSolusi)" opacity="0.6" />
                <g transform="translate(100, 100)">
                  <path d="M-30,-15 L30,-15 L30,45 L-30,45 Z" fill="#0052CC" opacity="0.7" />
                  <path d="M-30,-45 L0,-60 L60,-30 L30,-15 Z" fill="#0080FF" opacity="0.9" />
                  <path d="M30,-15 L60,-30 L60,30 L30,45 Z" fill="url(#logoGradSolusi)" />
                  <path d="M-30,-15 L0,-30 L0,30 L-30,45 Z" fill="#0052CC" opacity="0.8" />
                  <path d="M0,-30 L60,-30 L60,30 L0,30 Z" fill="url(#logoGradSolusi)" />
                </g>
              </svg>
            </div>
          </div>

          <div className="container relative z-10 px-4">
            <div className="max-w-5xl mx-auto text-center space-y-4">
              {/* Badge */}
              <div ref={heroBadgeRef} className="inline-flex items-center gap-3 backdrop-blur-xl bg-white/70 border border-white/30 shadow-lg px-5 py-2 rounded-2xl">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full blur-md opacity-75 animate-pulse"></div>
                  <HiSparkles className="w-5 h-5 text-orange-500 relative" />
                </div>
                <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                  Solusi Digital Terintegrasi 2025
                </span>
              </div>

              {/* Title */}
              <h1 ref={heroTitleRef} className="text-2xl sm:text-3xl md:text-5xl font-black leading-[1.05] tracking-tight overflow-hidden">
                <span className="block hero-word bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">
                  Solusi Terbaik
                </span>
                <span className="block hero-word bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
                  Untuk Setiap Industri
                </span>
              </h1>

              <p ref={heroDescRef} className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Temukan paket kami yang tepat untuk bisnis Anda. Dari{' '}
                <span className="font-bold text-blue-600">Website</span>,{' '}
                <span className="font-bold text-emerald-600">Undangan Digital</span>,{' '}
                <span className="font-bold text-rose-600">Desain Grafis</span>, hingga{' '}
                <span className="font-bold text-orange-600">Katalog Digital {' '}
                <span className="font-bold text-blue-600">Dan Affiliate</span>{' '}  
                </span> — semua tersedia.
              </p>

              {/* Stats */}
              <div ref={heroStatsRef} className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="group relative stat-card">
                      <div className="relative backdrop-blur-xl bg-white/70 border border-white/30 rounded-2xl p-3 md:p-4 hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                        <div className="relative text-center space-y-1 md:space-y-2">
                          <div className={`inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg group-hover:scale-110 transition-all duration-300 animate-pulse`}>
                            <Icon className="w-4 h-4 md:w-5 md:h-5" />
                          </div>
                          <div className={`text-xl md:text-2xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</div>
                          <div className="text-xs font-semibold text-slate-600">{stat.label}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTAs */}
              <div ref={heroCTARef} className="flex flex-wrap gap-3 justify-center mt-4">
                <button
                  onClick={() => {
                    const el = document.getElementById('packages-solusi');
                    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
                  }}
                  className="cta-button group relative bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl inline-flex items-center gap-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <FaRocket className="w-4 h-4 relative group-hover:rotate-12 transition-transform" />
                  <span className="relative">Lihat Semua Paket</span>
                  <FaArrowRight className="w-4 h-4 relative group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi"
                  target="_blank" rel="noopener noreferrer"
                  className="cta-button group relative backdrop-blur-xl bg-white/80 hover:bg-white border-2 border-slate-200 hover:border-orange-400 text-slate-700 hover:text-orange-600 text-sm px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl inline-flex items-center gap-2"
                >
                  <FaWhatsapp className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                  <span>Konsultasi Gratis</span>
                  <HiSparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-300" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ PACKAGES + SIDEBAR ════════ */}
        <div className="w-full py-16 relative" id="packages-solusi">
          {/* Dots pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle, #0066FF 2px, transparent 2px)`,
              backgroundSize: '40px 40px',
            }}></div>
          </div>

          {/* ── LEFT SIDEBAR ── */}
          <aside className={`hidden lg:block fixed left-8 top-24 w-80 z-30 transition-all duration-500 ${showSidebar ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
            <div className="sticky top-24">
              <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl overflow-hidden border border-white/50">
                {/* Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-orange-500 to-blue-600 p-6">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30 shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-black text-lg">Kategori Paket</h3>
                      <p className="text-white/90 text-xs">Pilih layanan terbaik</p>
                    </div>
                  </div>
                </div>

                {/* Nav items */}
                <nav className="px-4 py-6 space-y-1.5">
                  {paketCategories.map((paket) => {
                    const packageCount = paket.packageCount || paket.tierIds.length;
                    return (
                      <button
                        key={paket.id}
                        onClick={() => handleCategoryClick(paket.id)}
                        className={`group relative w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 overflow-hidden ${
                          activeTab === paket.id
                            ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-xl shadow-blue-500/50 scale-105'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50 hover:translate-x-1'
                        }`}
                      >
                        {activeTab === paket.id && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-orange-400/20 animate-pulse"></div>
                        )}
                        <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${paket.gradient} text-white transition-all duration-300 ${
                          activeTab === paket.id ? 'shadow-lg ring-2 ring-white/30' : 'opacity-75 group-hover:opacity-100'
                        }`}>
                          {paket.icon}
                        </div>
                        <div className="relative flex-1 text-left">
                          <span className="font-bold text-sm block">{paket.title.replace(' Premium', '').replace(' Digital', '')}</span>
                          <span className={`text-xs ${activeTab === paket.id ? 'text-blue-100' : 'text-slate-500'}`}>
                            {packageCount} paket tersedia
                          </span>
                        </div>
                        {activeTab === paket.id ? (
                          <div className="relative w-2 h-2 rounded-full bg-white shadow-lg animate-pulse"></div>
                        ) : (
                          <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold group-hover:bg-slate-200 transition-colors">
                            {packageCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>

                {/* Footer CTA */}
                <div className="mx-4 mb-4 p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-orange-500/10 border border-blue-500/20 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-800 text-sm font-bold">Butuh Bantuan?</p>
                      <p className="text-slate-600 text-xs">Konsultasi gratis</p>
                    </div>
                  </div>
                  <Link
                    to="/contact"
                    className="block w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-orange-500 text-white text-sm font-bold text-center hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105"
                  >
                    💬 Hubungi Kami
                  </Link>
                </div>

                <div className="px-4 pb-4 text-center">
                  <p className="text-slate-500 text-xs font-medium">© 2025 NexCube Digital</p>
                </div>
              </div>
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <div className="max-w-[1600px] mx-auto px-4 lg:pl-96 relative z-10">
            <main className="w-full">
              {/* All pricing sections from API */}
              <div className={`space-y-0 ${!isLoaded ? 'opacity-0' : 'animate-fadeInUp delay-300'}`}>
                {paketCategories.length > 0
                  ? paketCategories.map((cat) => renderPricingSection(cat))
                  : (
                    <div className="text-center py-20">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
                        <FaRocket className="w-7 h-7 text-white" />
                      </div>
                      <p className="text-slate-500 text-lg">Memuat paket...</p>
                    </div>
                  )
                }
              </div>

              {/* ════════ BUSINESS SOLUTIONS ════════ */}
              <section className="mt-24 mb-16">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-sm font-semibold text-blue-600 mb-4">
                    <HiTag className="w-4 h-4" />
                    <span>Solusi Per Industri</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black mb-4">
                    <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Solusi Berdasarkan </span>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Industri Anda</span>
                  </h2>
                  <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Setiap industri memiliki kebutuhan unik. Kami hadirkan solusi yang spesifik untuk bisnis Anda.
                  </p>
                </div>

                <div ref={solutionsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {businessSolutions.map((sol) => (
                    <div
                      key={sol.id}
                      onClick={() => setActiveSolution(activeSolution === sol.id ? null : sol.id)}
                      className={`sol-card group relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border overflow-hidden cursor-pointer ${
                        activeSolution === sol.id ? 'border-blue-400 ring-2 ring-blue-200' : 'border-slate-200/50'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${sol.lightGradient} opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                      <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${sol.gradient} text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                        {sol.icon}
                      </div>
                      <h3 className="relative text-xl font-bold text-slate-800 mb-2">{sol.title}</h3>
                      <p className="relative text-sm text-slate-600 mb-4">{sol.description}</p>
                      <div className="relative space-y-1.5 mb-4">
                        {sol.features.slice(0, 3).map((f, fi) => (
                          <div key={fi} className="flex items-center gap-2 text-xs text-slate-600">
                            <HiCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                      {/* Relevant categories */}
                      <div className="relative flex flex-wrap gap-2 mb-4">
                        {sol.relevantCategories.map((catId) => {
                          const cat = paketCategories.find((c) => c.id === catId);
                          if (!cat) return null;
                          return (
                            <button
                              key={catId}
                              onClick={(e) => { e.stopPropagation(); handleCategoryClick(catId); }}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${cat.gradient} text-white shadow`}
                            >
                              <span className="w-3 h-3">{cat.icon}</span>
                              {cat.title.replace(' Premium', '').replace(' Digital', '')}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const firstCat = paketCategories.find((c) => sol.relevantCategories.includes(c.id));
                          if (firstCat) handleCategoryClick(firstCat.id);
                        }}
                        className={`relative w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r ${sol.gradient} text-white font-bold text-sm group-hover:shadow-lg transition-all duration-300`}
                      >
                        <span>Paket</span>
                        <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* ════════ INTEGRATIONS ════════ */}
              <section className="mb-16">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-black mb-4">
                    <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Terintegrasi dengan </span>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">50+ Platform</span>
                  </h2>
                  <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Kami terintegrasi dengan berbagai platform terkemuka untuk memberikan solusi terbaik.
                  </p>
                </div>
                <div ref={integrationsRef} className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {integrations.map((Int, i) => {
                    const Icon = Int.icon;
                    return (
                      <div key={i} className="int-card group bg-white/60 backdrop-blur-sm rounded-xl p-4 hover:bg-white hover:shadow-xl transition-all duration-300 border border-slate-200/50 text-center hover:-translate-y-1">
                        <div className="flex justify-center mb-2">
                          <Icon className={`w-8 h-8 ${Int.color} group-hover:scale-125 transition-transform duration-300`} />
                        </div>
                        <span className="text-xs text-slate-600 font-medium">{Int.name}</span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* ════════ CTA ════════ */}
              <div className="mb-16">
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-3xl p-10 md:p-16 text-white shadow-2xl">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                  </div>
                  <div className="relative z-10 text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold mb-6">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Tim Kami Siap Membantu
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black mb-4 leading-tight">Siap Transformasi Bisnis Anda?</h3>
                    <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                      Konsultasikan kebutuhan digital Anda dengan tim ahli kami. Gratis dan tanpa komitmen!
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 bg-white text-blue-700 font-black px-10 py-4 rounded-2xl hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-2xl"
                      >
                        Konsultasi Gratis
                        <FaArrowRight className="w-5 h-5" />
                      </Link>
                      <a
                        href="https://wa.me/6285950313360?text=Halo%20NexCube%20Digital%2C%20saya%20ingin%20berkonsultasi%20tentang%20kebutuhan%20digital%20saya"
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 text-white font-black px-10 py-4 rounded-2xl hover:bg-green-600 transition-all duration-300 hover:scale-105 shadow-2xl"
                      >
                        <FaWhatsapp className="w-5 h-5" />
                        Chat WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-50px) scale(1.1); }
          66% { transform: translate(-20px,20px) scale(0.9); }
          100% { transform: translate(0,0) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </>
  );
};

export default PaketAffiliate;