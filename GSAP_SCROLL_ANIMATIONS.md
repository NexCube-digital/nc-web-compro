# GSAP ScrollTrigger Animations - NEXCUBE Landing Page

## 🎨 Update Terbaru

Landing page NEXCUBE telah diupdate dengan animasi GSAP ScrollTrigger yang kaya dan interaktif, dengan fokus highlight pada branding NEXCUBE.

## ✨ Fitur Animasi Baru

### 1. **GSAP Hooks dengan ScrollTrigger**
File: `src/hooks/useGsapAnimation.ts`

Hooks baru yang ditambahkan:
- ✅ `useScrollFadeIn` - Fade in element saat scroll
- ✅ `useParallax` - Efek parallax untuk background elements
- ✅ `useScrollRotate` - Rotasi element saat scroll
- ✅ `useScrollScale` - Scale animation triggered by scroll
- ✅ `useFloatingAnimation` - Floating animation untuk icon

### 2. **Landing Page Animations**
File: `src/pages/Home.tsx`

#### A. Background & Watermark NEXCUBE
- **Floating NEXCUBE Icons** - Icon "N" dan "C" yang melayang di background
- **Parallax Watermark** - Text "NEXCUBE" raksasa dengan efek parallax
- **Rotating Logo Background** - Logo cube yang berputar saat scroll

#### B. Hero Section Highlights
- **Animated NEXCUBE Badge** - Badge "Powered by NEXCUBE" dengan icon berputar
- **Rotating Cube Logo** - SVG cube dengan gradient yang berputar saat scroll
- **Scale Animation Badge** - Badge NEXCUBE dengan scale animation di service cards

#### C. NEXCUBE Showcase Section (NEW)
Section baru khusus untuk highlight NEXCUBE branding:
- **Giant NEXCUBE Logo** dengan animated rings
- **Feature badges** dengan scroll fade-in
- **Why NEXCUBE grid** dengan icon animasi
- **Ping animation** untuk visual menarik

#### D. Enhanced Elements
- **Service Cards** - Shimmer effect + NEXCUBE Certified badge
- **Stats Cards** - Glow effect on hover + scale animation
- **Testimonials** - Animated NEXCUBE orbs + Quality badge
- **Footer Branding** - Large NEXCUBE card dengan availability indicator

### 3. **Navbar Logo Animation**
File: `src/components/layout/Navbar.tsx`

- **GSAP Scale Animation** - Logo mengecil saat scroll
- **Pulsing Glow** - Efek glow yang berdenyut saat scrolled
- **Sparkle Effect** - Efek sparkle pada hover
- **Multi-layer Glow** - Multiple glow layers untuk depth

### 4. **Custom CSS Animations**
File: `src/styles/animations.css`

Animasi tambahan:
- `gradient-x` - Animated gradient background
- `float` - Floating effect untuk elements
- `pulse-glow` - Pulsing glow effect
- `rotate-slow` - Slow rotation animation
- `shimmer` - Shimmer effect untuk cards

## 🎯 Highlight NEXCUBE di Berbagai Section

### 1. **Background Layer**
- Fixed floating icons (N, C)
- Parallax watermark text
- Gradient orbs dengan pulse animation

### 2. **Hero Section**
- Rotating cube logo (top-right)
- "Powered by NEXCUBE" badge
- Service card dengan NEXCUBE badge

### 3. **Showcase Section**
- Giant centered NEXCUBE branding
- Animated rings
- Feature badges showcase

### 4. **Trusted Section**
- NEXCUBE pattern background
- Scroll fade-in pattern

### 5. **Testimonials**
- NEXCUBE Quality badge
- Animated orbs
- Premium branding

### 6. **Footer**
- Large NEXCUBE branding card
- Availability indicator
- Call-to-action

## 🚀 Penggunaan

Semua animasi akan otomatis berjalan saat:
1. Page load (initial animations)
2. Scroll down/up (ScrollTrigger animations)
3. Hover elements (interactive animations)

## ⚙️ Konfigurasi

ScrollTrigger sudah dikonfigurasi dengan:
- `start: 'top 85%'` - Animasi mulai saat element 85% dari viewport
- `toggleActions: 'play none none reverse'` - Reverse on scroll up
- `scrub: true` - Smooth scroll-linked animation

## 📱 Responsive

Semua animasi fully responsive dan akan bekerja dengan baik di:
- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)

## 🎨 Color Scheme NEXCUBE

Gradient yang digunakan (sesuai logo asli):
- Primary Blue: `#0066FF` (Blue Cube)
- Dark Blue: `#0052CC` 
- Light Blue: `#0080FF`
- Primary Orange: `#FF9900` (Orange Frame)
- Dark Orange: `#FF7700`

Gradients:
- Main Brand: `from-blue-600 via-blue-500 to-orange-500`
- Secondary: `from-blue-600 to-orange-500`
- Accent: `from-blue-500 to-orange-400`

## 🎯 Logo NEXCUBE

Logo terdiri dari:
1. **3D Blue Cube** - Cube biru 3D sebagai icon utama
2. **Orange Frame** - Frame/border orange di belakang cube
3. **Text "NEXCUBE"** - Bold typography dengan "NEX" putih dan "CUBE" bisa dengan accent orange
4. **Text "Digital."** - Subtitle dengan warna orange

## ✨ Animasi Khusus Logo NEXCUBE

- **3D Rotating Cube** - Cube berputar dengan efek 3D parallax
- **Floating Cubes** - Multiple cubes melayang di background
- **Orange Frame Pulse** - Frame beranimasi dengan pulse effect
- **Interactive Hover** - Logo bereaksi terhadap mouse movement
- **Scroll Trigger Scale** - Logo scale in/out saat scroll

## 🔧 Maintenance

Untuk modify animasi:
1. Edit hooks di `useGsapAnimation.ts`
2. Adjust timing di `Home.tsx` via `animationDelay`
3. Customize CSS animations di `animations.css`

## 📊 Performance

Optimizations:
- `will-change` CSS property untuk smooth animations
- GSAP's optimized rendering engine
- Lazy loading untuk scroll animations
- Hardware acceleration via transform

---

**Created by NEXCUBE Digital Studio**
*Premium Digital Solutions - Fast, Reliable, Innovative*
