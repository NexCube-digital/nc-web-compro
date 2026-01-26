# 🎯 Counter Animations & Interactive Features

## ✨ Counter Animation Features

### Animated Statistics
Angka-angka statistik sekarang **count up** dari 0 ke nilai target saat user scroll ke section tersebut!

#### Stats dengan Counter Animation:
- **50+ Proyek Selesai** - Counts from 0 to 50
- **30+ Klien Puas** - Counts from 0 to 30  
- **99% Success Rate** - Counts from 0 to 99
- **24/7 Support Premium** - Counts from 0 to 24

### Custom Hook: `useCountUp`

```typescript
const { formattedValue, elementRef } = useCountUp({
  end: 50,              // Target number
  duration: 2.5,        // Animation duration (seconds)
  suffix: '+',          // Add suffix ('+', '%', etc.)
  prefix: '',           // Add prefix ('$', etc.)
  enableScrollTrigger: true  // Trigger on scroll
});
```

#### Features:
- ✅ ScrollTrigger integration (animates when visible)
- ✅ Customizable duration & easing
- ✅ Support for decimals
- ✅ Prefix & suffix support
- ✅ Thousand separators
- ✅ One-time animation (tidak repeat)

## 🎨 Interactive Animations

### 1. Stats Cards
- **Counter Animation**: Numbers count from 0 to target
- **Hover Scale**: Cards enlarge on hover (scale-105)
- **Icon Pulse**: Icons continuously pulse with gradient
- **Glow Effect**: Gradient glow appears on hover
- **Progress Bar**: Animated progress bar on hover
- **Rotate Effect**: Icons rotate 6° on hover

### 2. Service Cards
- **Enhanced Hover**: Lift -3px + scale 1.02
- **Border Glow**: Gradient border appears on hover
- **Icon Animations**: Scale 1.25 + Rotate 12° + Pulse
- **Shine Effect**: Moving light across card
- **Feature Tags**: Scale on hover with stagger delay
- **Progress Bar**: Fills from left on hover
- **Corner Badge**: "HOT" badge appears with bounce
- **Cursor**: Cards change to pointer

### 3. CTA Buttons
#### Primary Button (Lihat Portfolio):
- **Scale**: 1.10 on hover
- **Lift**: -1px translate
- **Shine**: Moving gradient shine
- **Glow**: Blue gradient blur shadow
- **Ripple**: Ping animation on hover
- **Icon Rocket**: Rotate 12° + Scale 1.25
- **Arrow**: Translate right 2px

#### Secondary Button (WhatsApp):
- **Scale**: 1.10 on hover
- **Lift**: -1px translate
- **Glow**: Green-to-orange gradient blur
- **WhatsApp Icon**: Scale 1.25 + Rotate 12° + Pulse
- **Sparkles**: Appear with 180° rotation
- **Shine**: Moving white gradient

### 4. Hero Section
- **Logo Badge**: Scale on hover with glow
- **Trust Badge**: Pulse animation on badge
- **Gradient Text**: Animated gradient on headings
- **Stagger Delays**: Sequential appearance (100ms intervals)

## 📱 Responsive Design

### Mobile (< 768px):
- Stats grid: 2 columns
- Smaller text sizes (text-3xl for numbers)
- Reduced padding (p-5)
- Touch-optimized hover states

### Desktop (≥ 768px):
- Stats grid: 4 columns
- Larger text sizes (text-4xl for numbers)
- Full padding (p-6)
- Enhanced hover animations

## 🚀 Performance Optimizations

1. **GSAP ScrollTrigger**: Efficient scroll monitoring
2. **One-time animations**: Counters animate only once
3. **Hardware acceleration**: Transform & opacity for smooth 60fps
4. **Lazy loading**: Animations triggered only when visible
5. **CSS transforms**: GPU-accelerated animations
6. **Optimized re-renders**: React refs prevent unnecessary updates

## 🎭 Animation Timing

```javascript
// Page Load Sequence
0ms    - Logo & Trust Badge
100ms  - Hero Heading  
150ms  - NEXCUBE Badge
200ms  - Description Text
300ms  - CTA Buttons
400ms  - Stats Cards (with counter)
500ms+ - Service Cards (staggered 150ms each)
```

## 💡 Usage Tips

### Adding More Counters:
```typescript
const stats = [
  { 
    number: 100,     // Target value
    suffix: '+',     // Suffix to add
    label: 'Projects',
    icon: <FaRocket />,
    color: 'from-blue-500 to-cyan-500'
  }
];
```

### Custom Animation Duration:
```typescript
useCountUp({
  end: 100,
  duration: 3.5,  // Slower animation (3.5s)
  suffix: 'K'
});
```

### Without ScrollTrigger:
```typescript
useCountUp({
  end: 50,
  enableScrollTrigger: false  // Start immediately
});
```

## 🎨 New Tailwind Animations

Added to `tailwind.config.cjs`:
- `animate-fadeInUp` - Fade in from bottom
- `animate-fadeInDown` - Fade in from top
- `animate-scaleIn` - Scale from 90% to 100%
- `animate-slideInLeft` - Slide from left
- `animate-slideInRight` - Slide from right
- `animate-gradient-x` - Animated gradient
- `animate-glow-pulse` - Glowing pulse effect
- `animate-float` - Floating up/down
- `animate-spin-slow` - Slow rotation (3s)
- `animate-bounce-slow` - Slow bounce (3s)

## 🔥 Interactive Elements Summary

| Element | Animations | Trigger |
|---------|-----------|---------|
| Stats Cards | Counter + Scale + Glow + Progress | Scroll + Hover |
| Service Cards | Lift + Rotate + Shine + Border | Hover |
| CTA Buttons | Scale + Glow + Ripple + Shine | Hover |
| Icons | Rotate + Scale + Pulse | Hover |
| Badges | Bounce + Appear | Hover |
| Progress Bars | Fill Animation | Hover |

## 🌟 Modern 2025 Design Features

✅ Glassmorphism (backdrop-blur-xl)
✅ Gradient Meshes (multi-color gradients)
✅ Micro-interactions (hover states)
✅ Counter Animations (number count-up)
✅ Smooth Transitions (300-1000ms)
✅ Hardware Acceleration (transform/opacity)
✅ Responsive Design (mobile-first)
✅ Accessibility (semantic HTML)
✅ Performance Optimized (GSAP)
✅ User-Friendly (clear visual feedback)

---

**Semua animasi sudah responsive dan user-friendly!** 🎉
